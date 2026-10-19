import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { pieces } from "../../components/about/content";

const labels = [
  "My Roots",
  "The Engineer",
  "People & Community",
  "Behind the Lens",
  "Off the Clock",
  "Still Figuring It Out",
];
const sectionFor = (page: Page) => page.locator("#about");
const radioFor = (page: Page, index: number) =>
  sectionFor(page).getByRole("radio", { name: labels[index], exact: true });

async function expectStory(page: Page, index: number) {
  const section = sectionFor(page);
  await expect(section.locator(".pieces-answer h3")).toHaveText(
    pieces[index].question,
  );
  await expect(section.locator(".pieces-answer p")).toHaveText(
    pieces[index].answer,
  );
  await expect(section.locator(".pieces-count")).toHaveText(
    `${String(index + 1).padStart(2, "0")} / 06`,
  );
}

test("six stories select, wrap, and follow radio keyboard conventions", async ({
  page,
  browserName,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#about");
  const section = sectionFor(page);
  await expect(section.getByRole("radiogroup")).toHaveCount(1);
  await expect(section.getByRole("radio")).toHaveCount(6);
  await expect(section.locator('.pieces-segment[tabindex="0"]')).toHaveCount(1);
  await expect(radioFor(page, 0)).toHaveAttribute("aria-checked", "true");
  await expectStory(page, 0);
  await section.getByRole("button", { name: "Previous section" }).click();
  await expectStory(page, 5);
  await section.getByRole("button", { name: "Next section" }).click();
  await expectStory(page, 0);
  await radioFor(page, 0).focus();
  for (const [key, index] of [
    ["ArrowLeft", 5],
    ["ArrowRight", 0],
    ["ArrowUp", 5],
    ["ArrowDown", 0],
  ] as const) {
    await page.keyboard.press(key);
    await expect(radioFor(page, index)).toBeFocused();
    await expect(radioFor(page, index)).toHaveAttribute("aria-checked", "true");
    await expectStory(page, index);
  }
  for (const [key, index] of [
    ["Enter", 2],
    ["Space", 4],
  ] as const) {
    await radioFor(page, index).focus();
    await page.keyboard.press(key);
    await expect(radioFor(page, index)).toHaveAttribute("aria-checked", "true");
    await expectStory(page, index);
  }
  await expect(section.locator('.pieces-segment[tabindex="0"]')).toHaveCount(1);
  // WebKit's default macOS preference uses Option+Tab to include native buttons.
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(
    section.getByRole("button", { name: "Previous section" }),
  ).toBeFocused();
  await page.keyboard.press(
    browserName === "webkit" ? "Alt+Shift+Tab" : "Shift+Tab",
  );
  await expect(radioFor(page, 4)).toBeFocused();
  await expect(section.locator(".pieces-announcement")).toHaveAttribute(
    "aria-live",
    "polite",
  );
  expect(
    (await new AxeBuilder({ page }).include("#about").analyze()).violations,
  ).toEqual([]);
  expect(errors).toEqual([]);
});

test("hover previews preserve selection and stay out of the announcement", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Hover requires a mouse pointer");
  await page.goto("/#about");
  await radioFor(page, 1).click();
  const announcement = sectionFor(page).locator(".pieces-announcement");
  await expect(announcement).not.toBeEmpty();
  const committedAnnouncement = await announcement.textContent();
  await radioFor(page, 3).hover();
  await expectStory(page, 3);
  await expect(radioFor(page, 1)).toHaveAttribute("aria-checked", "true");
  await expect(radioFor(page, 3)).toHaveAttribute("aria-checked", "false");
  await expect(announcement).toHaveText(committedAnnouncement!);
  await sectionFor(page)
    .getByRole("heading", { name: "About me", exact: true })
    .hover();
  await expectStory(page, 1);
  await sectionFor(page).getByRole("button", { name: "Next section" }).focus();
  await radioFor(page, 3).hover();
  await radioFor(page, 1).focus();
  await expectStory(page, 1);
  await expect(announcement).toHaveText(committedAnnouncement!);
  await radioFor(page, 3).hover();
  await page.keyboard.press("ArrowRight");
  await expectStory(page, 2);
  await expect(radioFor(page, 2)).toBeFocused();
});

test("all six cards render the approved data and no photographs", async ({
  page,
}) => {
  await page.goto("/#about");
  for (let index = 0; index < pieces.length; index++) {
    await expectStory(page, index);
    await expect(sectionFor(page).locator(".pieces-answer img")).toHaveCount(0);
    await sectionFor(page)
      .getByRole("button", { name: "Next section" })
      .click();
  }
  await expectStory(page, 0);
});

test("server rendered default and six fallback stories work without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("/#about");
  await expectStory(page, 0);
  const details = sectionFor(page).locator(".pieces-fallback details");
  await expect(details).toHaveCount(6);
  for (let index = 0; index < pieces.length; index++) {
    await expect(details.nth(index).locator("summary")).toContainText(
      pieces[index].label,
    );
    if (
      !(await details
        .nth(index)
        .evaluate((element) => (element as HTMLDetailsElement).open))
    ) {
      await details.nth(index).locator("summary").click();
    }
    await expect(details.nth(index).locator("p")).toHaveText(
      pieces[index].answer,
    );
    await expect(details.nth(index).locator("p")).toBeVisible();
  }
  await context.close();
});

test("default story remains useful when JavaScript downloads fail", async ({
  page,
}) => {
  await page.route(/\.js(?:\?|$)/, (route) => route.abort());
  await page.goto("/#about");
  await expectStory(page, 0);
  await expect(sectionFor(page).locator(".pieces-answer h3")).toBeVisible();
  await expect(sectionFor(page).locator(".pieces-answer p")).toBeVisible();
});

test("touch navigation works in portrait and landscape", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Touch device orientation reflow");
  await page.goto("/#about");
  for (const [index, viewport] of [
    { width: 390, height: 844 },
    { width: 844, height: 390 },
  ].entries()) {
    await page.setViewportSize(viewport);
    await radioFor(page, index + 1).tap();
    await expectStory(page, index + 1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("touch hits icons, labels, and wedge interiors without activating the center", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Uses trusted touchscreen taps on a touch project");
  await page.goto("/#about");
  await radioFor(page, 1).locator("svg").tap({ force: true });
  await expectStory(page, 1);
  // WebKit reports the SVG text parent bounds incorrectly when x is set on tspans.
  // Target the rendered label's SVG baseline instead of that automation bounding box.
  const labelPoint = await radioFor(page, 2)
    .locator(".pieces-label")
    .evaluate((element) => {
      const text = element as SVGTextElement;
      const point = new DOMPoint(
        text.x.baseVal.getItem(0).value,
        text.y.baseVal.getItem(0).value - 7,
      ).matrixTransform(text.getScreenCTM()!);
      return { x: point.x, y: point.y };
    });
  await page.touchscreen.tap(labelPoint.x, labelPoint.y);
  await expectStory(page, 2);
  const point = await radioFor(page, 4)
    .locator(".pieces-hit-area")
    .evaluate((element) => {
      const path = element as SVGGeometryElement;
      const box = path.getBBox();
      const matrix = path.getScreenCTM()!;
      for (let y = box.y + 12; y < box.y + box.height; y += 12) {
        for (let x = box.x + 12; x < box.x + box.width; x += 12) {
          if (path.isPointInFill(new DOMPoint(x, y))) {
            const screen = new DOMPoint(x, y).matrixTransform(matrix);
            return { x: screen.x, y: screen.y };
          }
        }
      }
      throw new Error("No interior wedge point");
    });
  await page.touchscreen.tap(point.x, point.y);
  await expectStory(page, 4);
  const wheel = await sectionFor(page).locator(".pieces-wheel").boundingBox();
  expect(wheel).not.toBeNull();
  await page.touchscreen.tap(
    wheel!.x + wheel!.width / 2,
    wheel!.y + wheel!.height / 2,
  );
  await expectStory(page, 4);
});

test("trusted Chromium touch scrolling does not commit a story", async ({
  page,
  isMobile,
  browserName,
}) => {
  test.skip(
    !isMobile || browserName !== "chromium",
    "CDP trusted touch input is available only in Chromium; this is device emulation, not native iOS",
  );
  await page.goto("/#about");
  await sectionFor(page).locator(".pieces-wheel").scrollIntoViewIfNeeded();
  const target = await radioFor(page, 3).locator("svg").boundingBox();
  expect(target).not.toBeNull();
  const x = target!.x + target!.width / 2;
  const y = target!.y + target!.height / 2;
  const before = await page.evaluate(() => scrollY);
  const session = await page.context().newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  for (let step = 1; step <= 8; step++) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: y - step * 14 }],
    });
  }
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(before + 20);
  await expect(radioFor(page, 0)).toHaveAttribute("aria-checked", "true");
  await expectStory(page, 0);
  await session.detach();
});

for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
  test(`six readable labels and a circular wheel fit at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#about");
    await page.evaluate(() => document.fonts.ready);
    const geometry = await sectionFor(page)
      .locator(".pieces-wheel")
      .evaluate((svg) => {
        const bounds = (element: Element) => {
          const r = element.getBoundingClientRect();
          return {
            left: r.left,
            right: r.right,
            top: r.top,
            bottom: r.bottom,
            width: r.width,
            height: r.height,
          };
        };
        return {
          wheel: bounds(svg),
          center: bounds(svg.querySelector(".pieces-center")!),
          labels: Array.from(
            svg.querySelectorAll<SVGGraphicsElement>(".pieces-label"),
          ).map((element) => {
            const style = getComputedStyle(element);
            const matrix = element.getScreenCTM()!;
            return {
              ...bounds(element),
              display: style.display,
              visibility: style.visibility,
              fontSize:
                parseFloat(style.fontSize) * Math.hypot(matrix.a, matrix.b),
            };
          }),
        };
      });
    expect(geometry.labels).toHaveLength(6);
    expect(Math.abs(geometry.wheel.width - geometry.wheel.height)).toBeLessThan(
      1,
    );
    expect(geometry.wheel.left).toBeGreaterThanOrEqual(0);
    expect(geometry.wheel.right).toBeLessThanOrEqual(width + 1);
    const overlaps = (a: typeof geometry.center, b: typeof geometry.center) =>
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top;
    for (let index = 0; index < geometry.labels.length; index++) {
      const label = geometry.labels[index];
      expect(label.display).not.toBe("none");
      expect(label.visibility).toBe("visible");
      expect(label.width).toBeGreaterThan(0);
      expect(label.fontSize).toBeGreaterThanOrEqual(10.5);
      expect(overlaps(label, geometry.center)).toBe(false);
      for (const other of geometry.labels.slice(index + 1))
        expect(overlaps(label, other)).toBe(false);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const typography = (element: Element) => {
      const s = getComputedStyle(element);
      return [
        s.fontFamily,
        s.fontSize,
        s.fontWeight,
        s.letterSpacing,
        s.lineHeight,
      ];
    };
    expect(await page.locator("#about-heading").evaluate(typography)).toEqual(
      await page.locator("#work .section-heading h2").evaluate(typography),
    );
    const motion = await sectionFor(page)
      .locator(".pieces-segment, .pieces-segment-art, .pieces-answer")
      .evaluateAll((elements) =>
        elements.map((element) => {
          const style = getComputedStyle(element);
          return {
            transition: style.transitionDuration,
            animation: style.animationDuration,
          };
        }),
      );
    for (const style of motion) {
      expect(
        style.transition.split(",").every((value) => parseFloat(value) === 0),
      ).toBe(true);
      expect(
        style.animation.split(",").every((value) => parseFloat(value) === 0),
      ).toBe(true);
    }
    const heights: number[] = [];
    for (let index = 0; index < pieces.length; index++) {
      heights.push(
        await sectionFor(page)
          .locator(".pieces-panel")
          .evaluate((el) => el.getBoundingClientRect().height),
      );
      await sectionFor(page)
        .getByRole("button", { name: "Next section" })
        .click();
    }
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
    await sectionFor(page).screenshot({
      path: testInfo.outputPath(`about-${width}.png`),
    });
  });
}

test("200 percent equivalent viewport reflow from 1440px to 720px keeps navigation usable", async ({
  page,
}) => {
  // Browser zoom reduces the CSS viewport; CSS zoom does not update media queries.
  await page.setViewportSize({ width: 720, height: 1000 });
  await page.goto("/#about");
  await expect(sectionFor(page).locator(".pieces-label")).toHaveCount(6);
  await sectionFor(page).getByRole("button", { name: "Next section" }).click();
  await expectStory(page, 1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("400 percent equivalent viewport reflow from 1280px to 320px keeps stories usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/#about");
  await radioFor(page, 5).click();
  await expectStory(page, 5);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
