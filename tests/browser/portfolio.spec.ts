import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const slugs = ["igauchoback", "lidar", "orbit", "guitar-tuner", "the-hobbiest"];

test("homepage exposes work, contact, and a working résumé", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Huy Nguyen.");
  await expect(page.locator(".featured-card")).toHaveCount(5);
  await expect(page.getByRole("button", { name: "Show previous projects" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Show more projects" })).toBeVisible();
  const carousel = page.locator(".carousel-track");
  const initialScroll = await carousel.evaluate(element => element.scrollLeft);
  await page.getByRole("button", { name: "Show more projects" }).click();
  await expect.poll(() => carousel.evaluate(element => element.scrollLeft)).toBeGreaterThan(initialScroll);
  await page.getByRole("button", { name: "Show previous projects" }).click();
  await expect.poll(() => carousel.evaluate(element => element.scrollLeft)).toBeLessThanOrEqual(initialScroll + 1);
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/huynguyen06/");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/huynguyen9999");
  const contact = page.locator("#contact");
  await expect(contact.getByRole("heading")).toHaveText("Let’s build something to help the other 90%!");
  await expect(contact.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/huynguyen06/");
  await expect(contact.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/huynguyen9999");
  await expect(contact.getByRole("link", { name: "Strava" })).toHaveAttribute("href", "https://www.strava.com/");
  await expect(contact.getByRole("link", { name: "TikTok" })).toHaveAttribute("href", "https://www.tiktok.com/@huy_engineer");
  await expect(contact.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", "https://www.instagram.com/huy.engineer/");
  await page.getByRole("link", { name: "View work", exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole("link", { name: "Email", exact: true })).toHaveAttribute("href", "mailto:dominichuyn@gmail.com");
  const resume = await request.get("/Huy%20Nguyen%27s%20Resume.pdf");
  expect(resume.status()).toBe(200);
  expect(resume.headers()["content-type"]).toContain("application/pdf");
  expect((await resume.body()).subarray(0, 5).toString()).toBe("%PDF-");
  expect(errors).toEqual([]);
});

test("tuner responds to keyboard input, endpoints, and reset", async ({ page }) => {
  await page.goto("/");
  const slider = page.getByRole("slider", { name: "Adjust pitch" });
  await slider.focus();
  await expect(slider).toBeFocused();
  await slider.press("Home");
  await expect(page.locator(".frequency")).toHaveText("427.5 Hz");
  await expect(page.locator(".tuner-status")).toContainText("Flat");
  const lowWave = await page.locator(".waveform path").last().getAttribute("d");
  await slider.press("End");
  await expect(page.locator(".frequency")).toHaveText("452.9 Hz");
  await expect(page.locator(".tuner-status")).toContainText("Sharp");
  expect(await page.locator(".waveform path").last().getAttribute("d")).not.toBe(lowWave);
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(slider).toHaveValue("0");
  await expect(page.locator(".frequency")).toHaveText("440.0 Hz");
  await expect(page.locator(".tuner-status")).toContainText("Target pitch");
});

for (const path of ["/", "/projects", ...slugs.map(slug => `/projects/${slug}`)]) {
  test(`${path} is accessible and fits the viewport`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator("h1")).toHaveCount(1);
    const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(audit.violations).toEqual([]);
  });
}

test("project navigation, metadata, not-found, and reduced motion work", async ({ page, request }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore project: iGauchoBack" }).click();
  await expect(page).toHaveURL(/\/projects\/igauchoback$/);
  await expect(page).toHaveTitle("iGauchoBack — Huy Nguyen");
  await expect(page.getByRole("link", { name: "Visit live project" })).toHaveAttribute("href", "https://igauchoback.vercel.app/");
  await page.getByRole("link", { name: "All projects" }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  const image = await request.get("/opengraph-image");
  expect(image.headers()["content-type"]).toContain("image/png");
  expect((await image.body()).length).toBeGreaterThan(1000);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  const missing = await page.goto("/projects/does-not-exist");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
});

test("iGauchoBack roadmap supports selection, keyboard reset, and a responsive inspector", async ({ page }) => {
  await page.goto("/projects/igauchoback");
  const circuit = page.getByRole("button", { name: /ECE 10C, Circuits & Systems III/ });
  await circuit.focus();
  await circuit.press("Enter");
  await expect(circuit).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("status")).toContainText("ECE 10C · Circuits & Systems III");
  await expect(page.getByRole("status")).toContainText("ECE 10B");
  await page.keyboard.press("Escape");
  await expect(circuit).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("status")).toContainText("Select a course or outcome");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await circuit.click();
  await expect(circuit).toHaveAttribute("aria-pressed", "true");
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole("link", { name: /Try the live roadmap/ })).toHaveAttribute("href", "https://igauchoback.vercel.app/roadmap/ucsb/electrical-engineering");
});

test("narrow screens remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("slider", { name: "Adjust pitch" }).fill("25");
  await expect(page.locator(".tuner-status")).toContainText("Sharp");
});

test("project library links every project and preserves live access", async ({ page }) => {
  await page.goto("/projects");
  await expect(page).toHaveTitle("Projects — Huy Nguyen");
  await expect(page.locator(".library-grid article")).toHaveCount(5);
  const card = page.locator(".library-grid article").filter({ has: page.getByRole("heading", { name: "The Hobbiest", exact: true }) });
  await expect(card.getByRole("link", { name: "Live site: The Hobbiest" })).toHaveAttribute("href", "https://thehobbiest.vercel.app/");
  await expect(card.getByRole("link", { name: /Source/ })).toHaveCount(0);
  await card.getByRole("link", { name: "Explore project: The Hobbiest" }).click();
  await expect(page).toHaveURL(/\/projects\/the-hobbiest$/);
  await expect(page.getByRole("heading", { name: "What I built" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Visit live project" })).toHaveAttribute("target", "_blank");
  await expect(page.getByRole("link", { name: /View source/ })).toHaveCount(0);
  await page.goto("/projects/lidar");
  await expect(page.getByRole("link", { name: "View project poster" })).toHaveAttribute("href", "/lidar-poster.pdf");
  await page.getByRole("link", { name: "All projects" }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  // Follow any deployment-domain redirect before checking the route alias.
  await page.goto("/project");
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator(".library-grid article")).toHaveCount(5);
});
