import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const outputDir = path.join(process.cwd(), "tmp", "visual-check", "playwright");

const checks = [
  { name: "home-desktop", url: "http://localhost:3000/", width: 1440, height: 1100 },
  { name: "home-apod-desktop", url: "http://localhost:3000/#apod", width: 1440, height: 1000 },
  { name: "compare-desktop", url: "http://localhost:3000/compare?left=andromeda&right=milky-way", width: 1440, height: 1200 },
  { name: "journey-desktop", url: "http://localhost:3000/journeys/dark-matter-evidence", width: 1440, height: 1200 },
  { name: "expansion-journey-desktop", url: "http://localhost:3000/journeys/universe-expansion", width: 1440, height: 1200 },
  { name: "discoveries-desktop", url: "http://localhost:3000/discoveries", width: 1440, height: 1200 },
  { name: "lab-desktop", url: "http://localhost:3000/lab", width: 1440, height: 1200 },
  { name: "observe-desktop", url: "http://localhost:3000/observe", width: 1440, height: 1200 },
  { name: "my-cosmos-desktop", url: "http://localhost:3000/my-cosmos", width: 1440, height: 1000 },
  { name: "andromeda-mobile", url: "http://localhost:3000/objects/andromeda", width: 390, height: 1000 },
  { name: "compare-mobile", url: "http://localhost:3000/compare?left=europa&right=enceladus", width: 390, height: 1000 },
  { name: "journey-mobile", url: "http://localhost:3000/journeys/dark-matter-evidence", width: 390, height: 1000 },
  { name: "discoveries-mobile", url: "http://localhost:3000/discoveries", width: 390, height: 1000 },
  { name: "lab-mobile", url: "http://localhost:3000/lab", width: 390, height: 1000 },
  { name: "observe-mobile", url: "http://localhost:3000/observe", width: 390, height: 1000 },
  { name: "my-cosmos-mobile", url: "http://localhost:3000/my-cosmos", width: 390, height: 1000 },
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: edgePath,
  headless: true,
});

const failures = [];

for (const check of checks) {
  const page = await browser.newPage({
    viewport: { width: check.width, height: check.height },
    deviceScaleFactor: 1,
  });

  await page.goto(check.url, { waitUntil: "networkidle" });

  if (check.name.includes("apod")) {
    await page.waitForSelector('[data-apod-state="ready"], [data-apod-state="error"]', { timeout: 15_000 });
    await page.waitForFunction(
      () => {
        const image = document.querySelector('[data-apod-state="ready"] img');
        return !image || (image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0);
      },
      null,
      { timeout: 15_000 },
    );
  }

  if (check.name.includes("discoveries")) {
    await page.waitForSelector('[data-news-state="live"], [data-news-state="fallback"], [data-news-state="error"]', { timeout: 15_000 });
  }

  const metrics = await page.evaluate(() => ({
    bodyTextLength: document.body.innerText.trim().length,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    title: document.querySelector("h1")?.textContent?.trim() || "",
  }));

  await page.screenshot({
    path: path.join(outputDir, `${check.name}.png`),
    fullPage: false,
    caret: "initial",
  });

  if (metrics.bodyTextLength < 200) {
    failures.push(`${check.name}: page rendered too little text`);
  }

  if (metrics.scrollWidth > metrics.clientWidth + 2) {
    failures.push(`${check.name}: horizontal overflow ${metrics.scrollWidth}px > ${metrics.clientWidth}px`);
  }

  if (!metrics.title) {
    failures.push(`${check.name}: missing h1`);
  }

  await page.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Visual smoke passed. Screenshots written to ${outputDir}`);
