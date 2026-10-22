import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

// Run against an isolated local production server. No AI or external feed requests.
const phase = process.argv[2] || "after";
const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3100";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw new Error("Capture requires a local test server");
const out = process.env.CAPTURE_OUTPUT || `test-results/observatory-${phase}`;
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
  args: ["--disable-dev-shm-usage"],
});
const sizes = [
  [1440, 900],
  [1024, 768],
  [390, 844],
  [360, 800],
  [768, 1024],
  [1280, 900],
];
const results = [];
for (const [width, height] of sizes) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  await context.route("**/api/ai", (r) =>
    r.fulfill({ status: 503, json: { available: false } }),
  );
  await context.route("**/api/nasa/apod", (r) =>
    r.fulfill({
      json: {
        title: "Astronomy Picture of the Day",
        explanation: "NASA data is unavailable in this reproducible capture.",
        date: null,
        status: "fallback",
        mediaType: "fallback",
        provider: "NASA APOD",
      },
    }),
  );
  await context.route("**/api/news", (r) =>
    r.fulfill({
      json: {
        status: "fallback",
        items: [],
        errors: [],
        updatedAt: "2026-10-22T00:00:00.000Z",
      },
    }),
  );
  const page = await context.newPage();
  for (const route of ["/", "/lab", "/atlas"]) {
    const errors = [];
    const listener = (e) => errors.push(e.message);
    page.on("pageerror", listener);
    await page.goto(base + route);
    await page.locator("h1").waitFor();
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = "auto";
      await document.fonts.ready;
      for (const img of document.images) img.loading = "eager";
      await Promise.all(
        [...document.images].map((img) => img.decode().catch(() => {})),
      );
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(200);
    const slug = route === "/" ? "home" : route.slice(1);
    const prefix = `${slug}-${width}x${height}`;
    await page.screenshot({
      path: `${out}/${prefix}-view.png`,
      animations: "disabled",
    });
    await page.screenshot({
      path: `${out}/${prefix}-full.png`,
      fullPage: true,
      animations: "disabled",
    });
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      body: document.body.scrollWidth,
      main: document.querySelector("main").scrollWidth,
      brokenImages: [...document.images]
        .filter((i) => !i.complete || !i.naturalWidth)
        .map((i) => i.getAttribute("src")),
    }));
    results.push({
      route,
      width,
      height,
      files: [`${prefix}-view.png`, `${prefix}-full.png`],
      metrics,
      errors,
    });
    page.off("pageerror", listener);
  }
  await context.close();
}
await browser.close();
await writeFile(
  `${out}/manifest.json`,
  JSON.stringify(
    {
      phase,
      commit: execFileSync("git", ["rev-parse", "HEAD"], {
        encoding: "utf8",
      }).trim(),
      capturedAt: new Date().toISOString(),
      browser: "Chromium",
      feeds: "deterministic fallback fixtures",
      results,
    },
    null,
    2,
  ),
);
console.log(
  `${phase}: ${results.length} page/viewport combinations; ${results.length * 2} screenshots in ${out}`,
);
