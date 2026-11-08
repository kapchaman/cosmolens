import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";
const routes = [
  "/compare?left=europa&right=enceladus",
  "/my-cosmos",
  "/journeys",
  "/journeys/dark-matter-evidence",
  "/journeys/life-of-a-star",
  "/journeys/universe-expansion",
  "/discoveries",
];
for (const route of routes)
  test(`WCAG automated checks ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map(({ id, nodes }) => ({
        id,
        targets: nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  });
