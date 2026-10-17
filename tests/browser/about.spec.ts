import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('wheel selects, cycles, and supports keyboard navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/#about');
  const section = page.locator('#about');
  const segments = section.locator('.pieces-segment');
  await expect(segments).toHaveCount(12);
  await expect(section.locator('.pieces-count')).toHaveText('01 / 12');
  await section.getByRole('button', { name: 'Previous section' }).click();
  await expect(section.locator('.pieces-count')).toHaveText('12 / 12');
  await section.getByRole('button', { name: 'Next section' }).click();
  await expect(section.locator('.pieces-count')).toHaveText('01 / 12');
  const building = section.getByRole('button', { name: 'Building', exact: true });
  await building.focus();
  await building.press('Space');
  await expect(building).toHaveAttribute('aria-pressed', 'true');
  await expect(section.locator('.pieces-count')).toHaveText('03 / 12');
  const values = section.getByRole('button', { name: 'My Values', exact: true });
  await values.focus();
  await values.press('Enter');
  await expect(values).toHaveAttribute('aria-pressed', 'true');
  const results = await new AxeBuilder({ page }).include('#about').analyze();
  expect(results.violations).toEqual([]);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('hover previews return to the clicked selection', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Hover is a desktop interaction');
  await page.goto('/#about');
  const section = page.locator('#about');
  await section.getByRole('button', { name: 'Building', exact: true }).click();
  await section.getByRole('button', { name: 'Origin', exact: true }).hover();
  await expect(section.locator('.pieces-count')).toHaveText('01 / 12');
  await section.getByRole('heading', { name: 'About me' }).hover();
  await expect(section.locator('.pieces-count')).toHaveText('03 / 12');
});

test('touch selection and narrow layouts remain usable', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Touch device check');
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#about');
  await page.getByRole('button', { name: 'Curiosity', exact: true }).tap();
  await expect(page.locator('.pieces-count')).toHaveText('04 / 12');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
