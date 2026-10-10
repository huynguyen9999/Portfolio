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
  await page.getByRole("link", { name: "iGauchoBack", exact: true }).click();
  for (const title of ["LiDAR Security System", "Orbit AFE", "Chromatic Guitar Tuner", "iGauchoBack"]) {
    await page.locator(".next-project").getByRole("link", { name: title }).click();
    await expect(page.locator("h1")).toHaveText(title);
  }
  await page.getByRole("link", { name: "All selected work" }).click();
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
  await page.getByRole("link", { name: "iGauchoBack", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("iGauchoBack");
  await expect(page.getByRole("link", { name: "View résumé" })).toHaveAttribute("href", "/resume.pdf");
  await context.close();
});

test("résumé download contains the exact published document", async ({ page, request }) => {
  await page.goto("/");
  const downloadPromise = page.waitForEvent("download");
  await page.locator(".hero-actions").getByRole("link", { name: "Résumé", exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("Huy-Nguyen-Resume.pdf");
  expect(await download.failure()).toBeNull();
  const pdf = await request.get("/resume.pdf");
  const hash = (value: Buffer) => createHash("sha256").update(value).digest("hex");
  expect(hash(await pdf.body())).toBe(hash(readFileSync("public/resume.pdf")));
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
