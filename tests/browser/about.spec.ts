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
  const building = section.getByRole('button', { name: 'What I build', exact: true });
  await building.focus();
  await building.press('Space');
  await expect(building).toHaveAttribute('aria-pressed', 'true');
  await expect(section.locator('.pieces-count')).toHaveText('03 / 12');
  const values = section.getByRole('button', { name: 'Other hobbies', exact: true });
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
  await section.getByRole('button', { name: 'What I build', exact: true }).click();
  await section.getByRole('button', { name: 'Origin', exact: true }).hover();
  await expect(section.locator('.pieces-count')).toHaveText('01 / 12');
  await section.getByRole('heading', { name: 'About me' }).hover();
  await expect(section.locator('.pieces-count')).toHaveText('03 / 12');
});

test('touch selection and narrow layouts remain usable', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Touch device check');
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#about');
  await page.getByRole('button', { name: 'What I’m learning', exact: true }).tap();
  await expect(page.locator('.pieces-count')).toHaveText('04 / 12');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

const cardHeadings = [
  'Vietnam → California', 'Why I chose electrical engineering',
  'Software, hardware, and a bit of both', 'RF and antenna design',
  'Making time to read', 'Electrical engineering, class of 2028',
  'Outside class', 'Sports, streets, and long exposures',
  'No dream car. A whole garage.', 'Cubing and rock crawling',
  'Something I’m learning', 'An easy place to start',
];

test('all twelve cards have distinct approved content', async ({ page }) => {
  await page.goto('/#about');
  const section = page.locator('#about');
  for (const heading of cardHeadings) {
    await expect(section.locator('.pieces-answer h3')).toHaveText(heading);
    await expect(section.locator('.pieces-answer img')).toHaveCount(0);
    await section.getByRole('button', { name: 'Next section' }).click();
  }
  await expect(section.locator('.pieces-count')).toHaveText('01 / 12');
  await expect(section).not.toContainText('Beyond the résumé');
  await expect(section).not.toContainText('One piece at a time');
  await expect(section.locator('.pieces-intro')).toHaveText('About me');
});

for (const width of [320, 390, 768, 1440]) {
  test(`heading styles and wheel fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#about');
    await page.evaluate(() => document.fonts.ready);
    const typography = (element: Element) => {
      const s = getComputedStyle(element);
      return [s.fontFamily, s.fontSize, s.fontWeight, s.letterSpacing, s.lineHeight];
    };
    expect(await page.locator('#about-heading').evaluate(typography)).toEqual(
      await page.locator('#work .section-heading h2').evaluate(typography)
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const labels = await page.locator('.pieces-label').evaluateAll(elements => elements
      .filter(element => getComputedStyle(element).display !== 'none')
      .map(element => { const r = element.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; }));
    expect(labels.length).toBe(width === 320 ? 0 : 12);
    for (let i = 0; i < labels.length; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i], b = labels[j];
        expect(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top).toBe(false);
      }
    }
    await page.locator('#about').screenshot({ path: `test-results/about-${width}.png` });
  });
}
