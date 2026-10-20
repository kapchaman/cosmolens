import { test, expect } from './fixtures';
const routes = ['/', '/atlas', '/objects/andromeda', '/compare?left=europa&right=enceladus', '/journeys', '/journeys/dark-matter-evidence', '/journeys/life-of-a-star', '/journeys/universe-expansion', '/discoveries', '/lab', '/observe', '/my-cosmos'];
for (const route of routes) {
  test(`smoke ${route}`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('main')).not.toBeEmpty();
    const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, body: document.body.scrollWidth, main: document.querySelector('main')!.scrollWidth }));
    expect(dimensions.body).toBeLessThanOrEqual(dimensions.width + 2);
    expect(dimensions.main).toBeLessThanOrEqual(dimensions.width + 2);
    expect(errors).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath('view.png'), fullPage: false, animations: 'disabled' });
  });
}
