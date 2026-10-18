import { test, expect } from "@playwright/test";

test("signature visualization renders and keyboard reaches each project", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Graph, signal, sensor" }),
  ).toBeVisible();
  await expect(page.locator("[data-signature-canvas] canvas")).toBeVisible();
  await expect(page.locator("[data-signature-canvas]")).toHaveAttribute(
    "data-canvas",
    "ready",
  );
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

test("sensor mode sweeps an illustrative field with a proximity LED status", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "Sensor" }).click();
  await expect(page.locator(".signature-sensor-readout")).toContainText(
    "180° sweep",
  );
  await expect(page.locator(".signature-sensor-readout")).toContainText(
    /LED (on|off)/,
  );
  await expect(page.locator("[data-signature-canvas]")).toHaveAttribute(
    "data-sensor-led",
    /on|off/,
  );
});

test("reduced motion keeps the states and project links reachable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".signature")).toHaveAttribute(
    "data-reduced",
    "true",
  );
  await page.getByRole("radio", { name: "Sensor" }).click();
  await expect(
    page.getByRole("link", { name: "See the LiDAR system" }),
  ).toBeVisible();
  await expect(
    page.getByText("illustrative, not a live recording"),
  ).toBeVisible();
});

test("visualization radios support arrow keys and wrapping", async ({
  page,
}) => {
  await page.goto("/");
  const graph = page.getByRole("radio", { name: "Graph", exact: true });
  const signal = page.getByRole("radio", { name: "Signal", exact: true });
  const sensor = page.getByRole("radio", { name: "Sensor", exact: true });
  await graph.focus();
  await graph.press("ArrowRight");
  await expect(signal).toBeFocused();
  await expect(signal).toHaveAttribute("aria-checked", "true");
  await signal.press("ArrowDown");
  await expect(sensor).toBeFocused();
  await expect(sensor).toHaveAttribute("aria-checked", "true");
  await sensor.press("ArrowRight");
  await expect(graph).toBeFocused();
  await graph.press("ArrowLeft");
  await expect(sensor).toBeFocused();
  await expect(
    page.getByRole("link", { name: "See the LiDAR system" }),
  ).toBeVisible();
});

test("losing window focus releases a held signal", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Mouse hold regression");
  await page.goto("/");
  const canvas = page.locator("[data-signature-canvas]");
  await canvas.scrollIntoViewIfNeeded();
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.3);
  await page.mouse.down();
  await expect(page.locator(".signature-readout")).toContainText("IN TUNE");
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(page.locator(".signature-readout")).not.toContainText("IN TUNE");
  await page.mouse.up();
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
