import { test, expect } from "@playwright/test";

// These tests run in Chrome touch emulation and the opt-in iPhone/iPad WebKit
// projects. WebKit exercises Safari's engine; it is not a physical-device test.
test.beforeEach(async ({ isMobile }) => {
  test.skip(!isMobile, "Touch-device layout and interaction checks");
});

test("safe-area viewport preserves zoom and touch controls are finger-sized", async ({ page }) => {
  await page.goto("/");
  const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
  expect(viewport).toContain("viewport-fit=cover");
  expect(viewport).not.toMatch(/user-scalable=no|maximum-scale=1(?:,|$)/);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#f8f7f4");
  const targets = page.locator([
    ".site-header a",
    ".carousel-controls button",
    ".featured-actions a",
    ".signature-controls button",
    ".contact-links a",
    ".site-footer a",
    ".tuner-control button",
    '.tuner input[type="range"]',
  ].join(","));
  const sizes = await targets.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { label: element.textContent || element.getAttribute("aria-label"), width: rect.width, height: rect.height };
  }));
  expect(sizes.length).toBeGreaterThan(15);
  for (const size of sizes) {
    expect(size.width, `${size.label} width`).toBeGreaterThanOrEqual(44);
    expect(size.height, `${size.label} height`).toBeGreaterThanOrEqual(44);
  }
});

for (const viewport of [
  { width: 375, height: 812 },
  { width: 812, height: 375 },
  { width: 507, height: 768 }, // iPad Split View-sized content area
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
]) {
  test(`project diagrams, metrics, and navigation fit at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".featured-metrics dt").first()).toHaveText("5.5M+");
    const header = await page.locator(".site-header").evaluate((element) => {
      const home = element.querySelector(".monogram")!.getBoundingClientRect();
      const nav = element.querySelector("nav")!.getBoundingClientRect();
      return { homeRight: home.right, navLeft: nav.left, navRight: nav.right };
    });
    expect(header.homeRight).toBeLessThanOrEqual(header.navLeft);
    expect(header.navRight).toBeLessThanOrEqual(viewport.width);
    const assertFits = async () => {
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const diagrams = await page.locator(".featured-shot:has(.diagram)").evaluateAll((shots) => shots.map((shot) => {
        const frame = shot.getBoundingClientRect();
        return Array.from(shot.querySelectorAll(".visual-topline, .diagram > svg, .visual-caption")).every((element) => {
          const rect = element.getBoundingClientRect();
          return rect.top >= frame.top - 1 && rect.bottom <= frame.bottom + 1 && rect.left >= frame.left - 1 && rect.right <= frame.right + 1 && rect.height > 0;
        });
      }));
      expect(diagrams.every(Boolean), "Diagram header, SVG, and caption stay inside the card").toBe(true);
      const tunerFits = await page.locator(".featured-shot:has(.tuner)").evaluateAll((shots) => shots.every((shot) => {
        const frame = shot.getBoundingClientRect();
        return Array.from(shot.querySelectorAll("input, button, .range-labels, .visual-caption")).every((element) => {
          const rect = element.getBoundingClientRect();
          return rect.top >= frame.top - 1 && rect.bottom <= frame.bottom + 1;
        });
      }));
      expect(tunerFits, "Tuner controls and caption are not cropped").toBe(true);
    };
    await assertFits();
    await page.goto("/projects");
    await assertFits();
    await page.goto("/projects/unwrapathon");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("ECHO");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("signature keeps its selected mode when tapping different canvas positions", async ({ page }) => {
  await page.goto("/");
  const signature = page.locator(".signature");
  const sensor = signature.getByRole("radio", { name: "Sensor", exact: true });
  await sensor.tap();
  const canvas = signature.locator("canvas");
  await canvas.scrollIntoViewIfNeeded();
  await canvas.tap({ position: { x: 30, y: 80 } });
  await expect(sensor).toHaveAttribute("aria-checked", "true");
  await canvas.tap({ position: { x: 180, y: 180 } });
  await expect(signature).toHaveAttribute("data-stage", "lidar");
});

test("touch navigation and tuner remain usable after rotating an iPad", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/#about");
  await page.evaluate(() => document.fonts.ready);
  // Read both bounds in one frame: hash scrolling may still be settling.
  const bounds = await page.locator("#about").evaluate((section) => {
    const wheel = section.querySelector(".pieces-wheel")!.getBoundingClientRect();
    const panel = section.querySelector(".pieces-panel")!.getBoundingClientRect();
    return { wheelBottom: wheel.bottom, panelTop: panel.top };
  });
  expect(bounds.panelTop).toBeGreaterThanOrEqual(bounds.wheelBottom);
  await page.getByRole("radio", { name: "The Engineer", exact: true }).tap();
  await expect(page.getByRole("radio", { name: "The Engineer", exact: true })).toHaveAttribute("aria-checked", "true");
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.getByRole("radio", { name: "The Engineer", exact: true })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Next section" }).tap();
  await expect(page.getByRole("radio", { name: "People & Community", exact: true })).toHaveAttribute("aria-checked", "true");
  await page.goto("/projects/guitar-tuner");
  const slider = page.getByRole("slider", { name: "Adjust pitch" });
  await slider.tap({ position: { x: 24, y: 22 } });
  await expect(page.locator(".tuner-status")).toContainText("Flat");
  await page.getByRole("button", { name: "Reset" }).tap();
  await expect(slider).toHaveValue("0");
});
