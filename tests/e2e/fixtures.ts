import { test as base, expect } from "@playwright/test";
// Tests never use paid AI or rely on public NASA availability.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route("**/api/nasa/apod", (route) => route.fulfill({ json: { title: "Astronomy Picture of the Day", date: null, explanation: "NASA data is unavailable in this test.", status: "fallback", mediaType: "fallback", provider: "NASA APOD" } }));
    await page.route("**/api/news", (route) => route.fulfill({ json: { status: "fallback", items: [], errors: [], updatedAt: "2026-10-21T00:00:00.000Z" } }));
    await use(page);
  },
});
export { expect };
