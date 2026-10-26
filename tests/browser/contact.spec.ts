import { test, expect } from "@playwright/test";

test("cool lifts only inside its word and resets without shifting the heading", async ({ page, isMobile }) => {
  test.skip(isMobile, "Mouse hover interaction");
  await page.goto("/#contact");
  const word = page.locator(".magnetic-word");
  const face = word.locator(".magnetic-word-face");
  await word.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  const before = await word.boundingBox();
  await page.locator("#contact-heading").hover({ position: { x: 5, y: 5 } });
  await expect(word).not.toHaveAttribute("data-active", "true");
  await word.hover({ position: { x: before!.width * 0.8, y: before!.height * 0.3 } });
  await expect(word).toHaveAttribute("data-active", "true");
  expect(await word.evaluate(el => parseFloat(el.style.getPropertyValue("--word-x")))).toBeGreaterThan(0);
  const upwardPull = await word.evaluate(el => Math.abs(parseFloat(el.style.getPropertyValue("--word-y"))));
  await expect.poll(() => face.evaluate(el => getComputedStyle(el).transform)).not.toBe("matrix(1, 0, 0, 1, 0, 0)");
  await word.hover({ position: { x: before!.width * 0.2, y: before!.height * 0.7 } });
  expect(await word.evaluate(el => parseFloat(el.style.getPropertyValue("--word-x")))).toBeLessThan(0);
  const downwardPull = await word.evaluate(el => Math.abs(parseFloat(el.style.getPropertyValue("--word-y"))));
  expect(upwardPull).toBeGreaterThan(downwardPull * 1.5);
  const after = await word.boundingBox();
  expect(after!.width).toBeCloseTo(before!.width, 1);
  expect(after!.height).toBeCloseTo(before!.height, 1);
  await page.mouse.move(0, 0);
  await expect(word).not.toHaveAttribute("data-active", "true");
  await expect.poll(() => face.evaluate(el => getComputedStyle(el).transform)).toBe("matrix(1, 0, 0, 1, 0, 0)");
  await expect(page.locator("#contact-heading")).toHaveText("Let's build something cool");
});

test("reduced motion and touch keep cool static", async ({ page, isMobile }) => {
  await page.goto("/#contact");
  const word = page.locator(".magnetic-word");
  if (isMobile) {
    await word.tap();
    await expect(word).not.toHaveAttribute("data-active", "true");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await word.hover();
  await expect(word).not.toHaveAttribute("data-active", "true");
  await expect(word.locator("span")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
});

test("cool remains readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/#contact`);
    await expect(page.locator("#contact-heading")).toHaveText("Let's build something cool");
    await expect(page.locator(".magnetic-word")).not.toHaveAttribute("tabindex");
  } finally {
    await context.close();
  }
});
