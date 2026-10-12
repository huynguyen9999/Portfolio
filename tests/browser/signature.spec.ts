import { test, expect } from "@playwright/test";

test("signature visualization renders and keyboard reaches each project", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Graph, signal, sensor" })).toBeVisible();
  await expect(page.locator("[data-signature-canvas] canvas")).toBeVisible();
  await expect(page.locator("[data-signature-canvas]")).toHaveAttribute("data-canvas", "ready");
  const routes = [
    ["Signal", "Explore the tuner", /\/projects\/guitar-tuner$/],
    ["Sensor", "See the LiDAR system", /\/projects\/lidar$/],
    ["Graph", "Built for iGauchoBack", /\/projects\/igauchoback$/],
  ] as const;
  for (const [control, link, url] of routes) {
    await page.goto("/");
    await page.getByRole("radio", { name: control }).click();
    await page.getByRole("link", { name: link }).click();
    await expect(page).toHaveURL(url);
  }
});

test("sensor mode sweeps an illustrative field with a proximity LED status", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "Sensor" }).click();
  await expect(page.locator(".signature-sensor-readout")).toContainText("180° sweep");
  await expect(page.locator(".signature-sensor-readout")).toContainText(/LED (on|off)/);
  await expect(page.locator("[data-signature-canvas]")).toHaveAttribute("data-sensor-led", /on|off/);
});

test("reduced motion keeps the states and project links reachable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".signature")).toHaveAttribute("data-reduced", "true");
  await page.getByRole("radio", { name: "Sensor" }).click();
  await expect(page.getByRole("link", { name: "See the LiDAR system" })).toBeVisible();
  await expect(page.getByText("illustrative, not a live recording")).toBeVisible();
});

test("signature canvas fits a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const canvas = page.locator("[data-signature-canvas]");
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  expect(box?.width).toBeLessThanOrEqual(390);
  expect(box?.height).toBeGreaterThan(200);
});
