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
  for (const route of (process.env.CAPTURE_ROUTES?.split(",") || ["/", "/lab", "/atlas"])) {
    const page = await context.newPage();
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
    // Capture the initial viewport before focus/scroll changes. A fresh tab per
    // route avoids stale compositor tiles when Chromium tab zoom is active.
    const slug = route === "/" ? "home" : route.split("?")[0].slice(1).replaceAll("/", "-");
    await page.screenshot({ path: `${out}/${slug}-200-percent-view.png` });
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
    if (route.startsWith("/compare")) {
      await page.getByLabel("Primary object").selectOption("europa");
      await page.getByLabel("Comparison object").selectOption("enceladus");
      const table = page.getByRole("table");
      assert.ok(await table.evaluate((el) => el.scrollWidth <= el.clientWidth + 1));
      assert.ok((await table.innerText()).includes("3,122"));
      assert.ok((await table.innerText()).includes("about 500"));
    }
    if (route === "/my-cosmos") {
      await page.getByLabel("Note title", { exact: true }).fill("Zoom QA");
      await page.getByLabel("Note body", { exact: true }).fill("Readable at 200 percent.");
      await page.getByRole("button", { name: "Add note" }).click();
      await page.getByRole("button", { name: "Remove note Zoom QA", exact: true }).click();
      await page.getByRole("button", { name: "Undo removal" }).click();
      assert.ok((await page.locator("#journal-notes").innerText()).includes("Readable at 200 percent."));
    }
    if (route.includes("/journeys/")) {
      await page.getByRole("link", { name: "Start journey", exact: true }).click();
      assert.equal(await page.getByText("Visualization planned").count(), 0);
      for (const slider of await page.getByRole("slider").all()) {
        await slider.focus(); await page.keyboard.press("End");
        assert.equal(await slider.inputValue(), await slider.getAttribute("max"));
      }
    }
    results.push({ route, zoom, metrics });
    await page.close();
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
