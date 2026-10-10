import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const routes = ["/", "/projects/igauchoback", "/projects/lidar", "/projects/orbit", "/projects/guitar-tuner"];

test("all responses enforce browser restrictions without leaking framework headers", async ({ request }) => {
  for (const path of [...routes, "/resume.pdf", "/robots.txt", "/sitemap.xml", "/opengraph-image", "/missing-page"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(path === "/missing-page" ? 404 : 200);
    const headers = response.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("microphone=()");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["x-powered-by"]).toBeUndefined();
    const csp = headers["content-security-policy"];
    for (const directive of ["default-src 'self'", "object-src 'none'", "base-uri 'none'", "frame-ancestors 'none'", "connect-src 'self'"]) expect(csp).toContain(directive);
    expect(csp).not.toContain("'unsafe-eval'");
  }
});

test("navigation has no failed assets, runtime errors, or CSP violations", async ({ page }) => {
  const failures: string[] = [];
  page.on("pageerror", error => failures.push(error.message));
  page.on("console", message => { if (message.type() === "error") failures.push(message.text()); });
  page.on("response", response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", event => console.error(`CSP: ${event.violatedDirective}`));
  });
  await page.goto("/");
  await page.getByRole("link", { name: "Project breakdown: iGauchoBack" }).click();
  for (const title of ["LiDAR Security System", "Orbit AFE", "Chromatic Guitar Tuner", "iGauchoBack"]) {
    await page.locator(".next-project").getByRole("link", { name: title }).click();
    await expect(page.locator("h1")).toHaveText(title);
  }
  await page.getByRole("link", { name: "All projects" }).click();
  await page.getByRole("slider").fill("-25");
  await expect(page.locator(".tuner-status")).toContainText("Flat");
  expect(failures).toEqual([]);
});

test("content and navigation survive JavaScript being unavailable", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Huy Nguyen.");
  // Playwright text selectors deliberately exclude noscript content.
  await expect(page.locator("noscript p")).toBeVisible();
  await expect(page.locator("noscript p")).toContainText("JavaScript is unavailable.");
  await page.getByRole("link", { name: "Project breakdown: iGauchoBack" }).click();
  await expect(page.locator("h1")).toHaveText("iGauchoBack");
  await expect(page.getByRole("link", { name: "View résumé" })).toHaveAttribute("href", "/resume.pdf");
  await context.close();
});

test("résumé opens a separate tab and preserves the published PDF", async ({ page, request }) => {
  const pdf = await request.get("/resume.pdf");
  expect(pdf.headers()["content-disposition"]).toContain("inline;");
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  const hash = (value: Buffer) => createHash("sha256").update(value).digest("hex");
  expect(hash(await pdf.body())).toBe(hash(readFileSync("public/resume.pdf")));
  await page.goto("/");
  const links = page.locator('a[href="/resume.pdf"]');
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    expect(await link.getAttribute("download")).toBeNull();
  }
  // Native PDF viewers differ across engines; separately verify tab navigation.
  await page.context().route("**/resume.pdf", route => route.fulfill({ contentType: "text/html", body: "PDF navigation" }));
  const popupPromise = page.waitForEvent("popup");
  await page.locator(".hero-actions").getByRole("link", { name: "Résumé", exact: true }).click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(/resume\.pdf$/);
  await popup.close();
});

test("project details and separate live evidence remain accessible", async ({ page, request }) => {
  await page.goto("/");
  for (const [name, href] of [["Open live project: iGauchoBack", "https://igauchoback.vercel.app/"], ["Open live project: Orbit AFE", "https://orbitafe.vercel.app/"], ["View poster: LiDAR Security System", "/lidar-poster.pdf"]]) {
    const link = page.getByRole("link", { name, exact: true });
    await expect(link).toHaveAttribute("href", href);
    await expect(link).toHaveAttribute("target", "_blank");
  }
  for (const [name, slug] of [["iGauchoBack", "igauchoback"], ["Orbit AFE", "orbit"], ["LiDAR Security System", "lidar"], ["Chromatic Guitar Tuner", "guitar-tuner"]]) {
    await page.goto("/");
    await page.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/projects/${slug}$`));
    await expect(page.getByRole("heading", { name: "What I built", exact: true })).toBeVisible();
    if (slug === "igauchoback" || slug === "orbit") await expect(page.getByRole("link", { name: "Visit live project" })).toHaveAttribute("target", "_blank");
    if (slug === "lidar") await expect(page.getByRole("link", { name: "View project poster" })).toHaveAttribute("href", "/lidar-poster.pdf");
  }
  await page.goto("/");
  const poster = await request.get("/lidar-poster.pdf");
  expect(poster.status()).toBe(200);
  expect(poster.headers()["content-disposition"]).toContain("inline;");
  expect((await poster.body()).equals(readFileSync("public/lidar-poster.pdf"))).toBe(true);
  const portrait = page.locator(".hero-portrait img");
  await expect(portrait).toBeVisible();
  await expect.poll(() => portrait.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator("#work-heading, #experience-heading, #about-heading")).toHaveText(["Projects", "Experience", "About me"]);
});

test("unknown and hostile-looking URLs stay 404 and do not execute input", async ({ page }) => {
  for (const path of ["/missing", "/projects/constructor", "/projects/__proto__", "/projects/igauchoback/extra", "/projects/%3Cscript%3Ealert(1)%3C%2Fscript%3E"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
  await page.goto('/?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E');
  await expect(page.locator("h1")).toHaveText("Huy Nguyen.");
});

test("keyboard users can skip navigation and adjust by one cent", async ({ page, browserName }) => {
  await page.goto("/");
  // macOS WebKit uses Option+Tab to include links in keyboard navigation.
  await page.keyboard.press(browserName === "webkit" && process.platform === "darwin" ? "Alt+Tab" : "Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  const slider = page.getByRole("slider");
  await slider.focus();
  expect(await slider.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
  await slider.press("ArrowRight");
  await expect(slider).toHaveValue("1");
  await expect(slider).toHaveAttribute("aria-valuetext", /\+1 cents.*Sharp/);
  await slider.press("ArrowLeft");
  await expect(slider).toHaveValue("0");
  await slider.press("ArrowLeft");
  await expect(slider).toHaveAttribute("aria-valuetext", /-1 cents.*Flat/);
});

test("metadata, internal links, and external link isolation remain valid", async ({ page, request }) => {
  const internalPaths = new Set<string>();
  for (const path of routes) {
    await page.goto(path);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).protocol).toBe("https:");
    expect(new URL(canonical!).pathname).toBe(path);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S+/);
    for (const link of await page.locator("a[href]").evaluateAll(links => links.map(link => ({ href: link.getAttribute("href")!, target: link.getAttribute("target"), rel: link.getAttribute("rel") })))) {
      if (link.target === "_blank") expect(link.rel).toMatch(/noreferrer|noopener/);
      if (link.href.startsWith("/")) internalPaths.add(link.href.split("#")[0]);
    }
  }
  for (const path of internalPaths) expect((await request.get(path)).status()).toBe(200);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect((sitemap.match(/<loc>/g) || []).length).toBe(5);
  for (const path of routes.slice(1)) expect(sitemap).toContain(path);
});

test("a small concurrent burst serves static routes without 5xx responses", async ({ request }) => {
  // Local-only: this is a regression smoke test, not a production capacity claim.
  test.skip(!!process.env.PLAYWRIGHT_BASE_URL, "Avoid synthetic load on the public deployment");
  for (let batch = 0; batch < 5; batch++) {
    const responses = await Promise.all(routes.map(path => request.get(path, { timeout: 5000 })));
    for (const response of responses) {
      expect(response.status()).toBe(200);
      expect(response.headers()["cache-control"]).toMatch(/s-maxage|public/);
    }
  }
});

test("failed script downloads leave readable content and inert tuner controls", async ({ page }) => {
  await page.route("**/*.js", route => route.abort("failed"));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Huy Nguyen.");
  await expect(page.getByRole("slider")).toBeDisabled();
  await expect(page.getByRole("button", { name: "Reset" })).toBeDisabled();
  await expect(page.locator(".frequency")).toHaveText("440.0 Hz");
  await expect(page.getByRole("link", { name: "iGauchoBack", exact: true })).toHaveAttribute("href", "/projects/igauchoback");
});
