import { chromium } from "playwright-core";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

// Actual browser zoom through Chrome's tabs API, not CSS zoom or a DPR substitute.
// The extension is temporary and only loaded into this isolated local QA profile.
const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3100";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw new Error("Zoom QA requires a local server");
const out = process.env.CAPTURE_OUTPUT || "test-results/observatory-zoom";
const temp = await mkdtemp(join(tmpdir(), "cosmolens-zoom-"));
const extension = join(temp, "extension");
await mkdir(extension);
await mkdir(out, { recursive: true });
await writeFile(
  join(extension, "manifest.json"),
  JSON.stringify({
    manifest_version: 3,
    name: "CosmoLens local zoom QA",
    version: "1.0",
    permissions: ["tabs"],
    background: { service_worker: "background.js" },
  }),
);
await writeFile(
  join(extension, "background.js"),
  "chrome.runtime.onInstalled.addListener(() => {});",
);
const context = await chromium.launchPersistentContext(join(temp, "profile"), {
  channel: "chromium",
  headless: true,
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
  args: [
    `--disable-extensions-except=${extension}`,
    `--load-extension=${extension}`,
  ],
});
const results = [];
try {
  await context.route("**/api/ai", (r) =>
    r.fulfill({ status: 503, json: { available: false } }),
  );
  await context.route("**/api/nasa/apod", (r) =>
    r.fulfill({
      json: {
        title: "Astronomy Picture of the Day",
        explanation: "NASA data is unavailable in this reproducible capture.",
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
  const worker =
    context.serviceWorkers()[0] ||
    (await context.waitForEvent("serviceworker"));
  const page = await context.newPage();
  for (const route of ["/", "/lab", "/atlas"]) {
    await page.goto(base + route);
    await page.locator("h1").waitFor();
    const zoom = await worker.evaluate(async (url) => {
      const tab = (await chrome.tabs.query({})).find((t) => t.url === url);
      if (!tab?.id) throw new Error("Local QA tab not found");
      await chrome.tabs.setZoom(tab.id, 2);
      return chrome.tabs.getZoom(tab.id);
    }, page.url());
    assert.equal(zoom, 2);
    await page.waitForFunction(
      () => innerWidth === 720 && devicePixelRatio === 2,
    );
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (const img of document.images) img.loading = "eager";
      await Promise.all(
        [...document.images].map((i) => i.decode().catch(() => {})),
      );
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(200);
    const metrics = await page.evaluate(() => ({
      innerWidth,
      innerHeight,
      dpr: devicePixelRatio,
      bodyWidth: document.body.scrollWidth,
      rootWidth: document.documentElement.scrollWidth,
      brokenImages: [...document.images]
        .filter((i) => i.complete && !i.naturalWidth)
        .map((i) => i.src),
    }));
    assert.ok(
      metrics.bodyWidth <= metrics.innerWidth + 1,
      `${route}: body overflow at 200%`,
    );
    assert.ok(
      metrics.rootWidth <= metrics.innerWidth + 1,
      `${route}: root overflow at 200%`,
    );
    assert.deepEqual(metrics.brokenImages, []);
    // Controls remain reachable and operable after reflow, even below the fold.
    if (route === "/atlas") {
      const search = page.getByRole("searchbox", { name: "Search atlas" });
      await search.fill("Jupiter");
      // Search includes descriptions, aliases and tags, so related objects may match.
      await page.waitForFunction(() => {
        const count = document.querySelectorAll('[data-object-id]').length;
        return count > 0 && count < 33;
      });
      assert.equal(await page.locator('[data-object-id="jupiter"]').count(), 1);
      await search.fill("");
      await page.waitForFunction(() => document.querySelectorAll('[data-object-id]').length === 33);
    }
    if (route === "/lab") {
      const slider = page.getByRole("slider", {
        name: "Earth mass multiplier",
      });
      await slider.focus();
      await page.keyboard.press("End");
      assert.equal(await slider.inputValue(), "3");
      await page.keyboard.press("Home");
      for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowRight");
    }
    await page.evaluate(() => {
      document.activeElement?.blur();
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo({top:0,behavior:'instant'});
    });
    await page.waitForFunction(() => scrollY === 0);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const slug = route === "/" ? "home" : route.slice(1);
    // At real tab zoom, Playwright fullPage clips using unzoomed CSS dimensions.
    // Preserve the actual 1440×900 browser viewport; normal-zoom full pages are
    // captured separately by capture-observatory.mjs.
    await page.screenshot({ path: `${out}/${slug}-200-percent-view.png` });
    results.push({ route, zoom, metrics });
  }
  await writeFile(
    `${out}/manifest.json`,
    JSON.stringify(
      {
        method: "chrome.tabs.setZoom(tabId, 2)",
        browserViewport: { width: 1440, height: 900 },
        results,
      },
      null,
      2,
    ),
  );
  console.log(
    "Actual browser zoom: 200%, 3 pages, reflow and controls passed.",
  );
} finally {
  await context.close();
  await rm(temp, { recursive: true, force: true });
}
