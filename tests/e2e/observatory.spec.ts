import { test, expect } from "./fixtures";

for (const [width, height] of [
  [1440, 900],
  [1024, 768],
  [390, 844],
  [360, 800],
  [768, 1024],
  [1280, 900],
]) {
  for (const route of ["/", "/lab", "/atlas"]) {
    test(`observatory reflow ${route} at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => ({
        body: document.body.scrollWidth,
        root: document.documentElement.scrollWidth,
        viewport: innerWidth,
      }));
      expect(dimensions.body).toBeLessThanOrEqual(width + 1);
      expect(dimensions.root).toBeLessThanOrEqual(width + 1);
      if (route === "/atlas") {
        const search = page.getByRole("searchbox", { name: "Search atlas" });
        await expect(search).toBeVisible();
        const box = await search.boundingBox();
        expect(box!.y + box!.height).toBeLessThan(height);
        await expect(page.locator("[data-object-id]")).toHaveCount(33);
      }
      if (route === "/lab") {
        const control = page.getByRole("slider", {
          name: "Earth mass multiplier",
        });
        await expect(control).toBeVisible();
        const box = await control.boundingBox();
        expect(box!.y + box!.height).toBeLessThan(height);
        const text = await page.locator(".lab-explanation").boundingBox();
        expect(text!.width).toBeGreaterThan(250);
      }
      if (route === "/") {
        const scene = await page.getByTestId("scale-scene").boundingBox();
        const metrics = await page.getByTestId("scale-readouts").boundingBox();
        expect(metrics!.y).toBeGreaterThanOrEqual(scene!.y + scene!.height);
        const hero = page.locator(".hero-observation .obs-image");
        await expect(hero).toHaveAttribute("data-image-state", "ready");
      }
      const bad = await page
        .locator("img:visible")
        .evaluateAll((images) =>
          images
            .filter(
              (i) =>
                (i as HTMLImageElement).complete &&
                !(i as HTMLImageElement).naturalWidth,
            )
            .map((i) => i.getAttribute("src")),
        );
      expect(bad).toEqual([]);
    });
  }
}

test("all Scale positions keep their data outside the illustration and preserve deep links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  const stations = page
    .getByRole("group", { name: "Choose a cosmic scale" })
    .getByRole("button");
  await expect(stations).toHaveCount(10);
  for (let i = 0; i < 10; i++) {
    const button = stations.nth(i);
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("slider", { name: "Scale position" }),
    ).toHaveValue(String(i));
    const scene = await page.getByTestId("scale-scene").boundingBox();
    const metrics = await page.getByTestId("scale-readouts").boundingBox();
    expect(metrics!.y).toBeGreaterThan(scene!.y + scene!.height);
  }
  await page.reload();
  await expect(
    page.getByRole("slider", { name: "Scale position" }),
  ).toHaveValue("9");
});

test("Earth outputs distinguish mass, radius, acceleration and weight", async ({
  page,
}) => {
  await page.goto("/lab");
  const slider = page.getByRole("slider", { name: "Earth mass multiplier" });
  await slider.focus();
  await page.keyboard.press("End");
  await expect(page.getByTestId("lab-explanation")).toContainText("3.00 times");
  await expect(page.getByTestId("lab-explanation")).toContainText("29.43 m/s²");
  await expect(page.getByTestId("lab-explanation")).toContainText(
    "2207.3 newtons",
  );
  await expect(page.getByText("Radius: 6,371 km")).toBeVisible();
  await page.locator(".lab-mass-input summary").click();
  await page.getByLabel("Test-body mass", { exact: true }).fill("150");
  await expect(page.getByTestId("lab-explanation")).toContainText(
    "4414.5 newtons",
  );
  await expect(page.getByTestId("lab-explanation")).toContainText("29.43 m/s²");
  await page.getByLabel("Test-body mass", { exact: true }).fill("");
  await expect(
    page.getByText("Enter a mass between 1 and 500 kg."),
  ).toBeVisible();
  await expect(page.locator("body")).not.toContainText("NaN");
});

test("all four experiments remain usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lab");
  const select = page.getByLabel("Experiment", { exact: true });
  await select.selectOption("moon-disappears");
  await page.getByRole("button", { name: "With Moon", exact: true }).click();
  await expect(page.getByTestId("lab-explanation")).toContainText(
    "Both the Moon and the Sun",
  );
  await select.selectOption("sun-red-giant-today");
  await page.getByRole("button", { name: "Present Sun", exact: true }).click();
  await expect(page.getByTestId("lab-explanation")).toContainText(
    "main-sequence",
  );
  await select.selectOption("milky-way-no-dark-matter");
  const model = page.getByRole("button", {
    name: "Dark matter model",
    exact: true,
  });
  await model.click();
  await expect(model).toHaveAttribute("aria-pressed", "false");
  await select.selectOption("earth-double-mass");
  await expect(
    page.getByRole("slider", { name: "Earth mass multiplier" }),
  ).toHaveValue("2");
});

test("failed imagery keeps a stable, usable record", async ({ page }) => {
  await page.route("**/images/observatory/*.webp", (r) => r.abort());
  await page.goto("/");
  const image = page.locator(".hero-observation .obs-image");
  await expect(image).toHaveAttribute("data-image-state", "failed");
  await expect(image.getByText("Observation unavailable")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore the atlas", exact: true }),
  ).toBeVisible();
  expect((await image.boundingBox())!.height).toBeGreaterThanOrEqual(200);
});

test("APOD media failure and fallback recovery stay visible", async ({
  page,
}) => {
  await page.route("**/api/nasa/apod", (r) =>
    r.fulfill({
      json: {
        title: "Test observation",
        explanation: "A scientific explanation.",
        status: "live",
        mediaType: "image",
        imageUrl: "/missing-observation.jpg",
        sourceUrl: "https://science.nasa.gov/mission/apod/",
        provider: "NASA APOD",
      },
    }),
  );
  await page.goto("/");
  await page.locator("#apod").scrollIntoViewIfNeeded();
  await expect(page.locator("#apod .obs-image")).toHaveAttribute(
    "data-image-state",
    "failed",
  );
  await expect(
    page.locator("#apod").getByRole("link", { name: "Open source" }),
  ).toBeVisible();
});

test("CSS spacing utilities and source links override component defaults", async ({
  page,
}) => {
  await page.goto("/objects/andromeda");
  await expect(page.locator("section.pt-0")).toHaveCSS("padding-top", "0px");
  await expect(page.locator("section.pb-10")).toHaveCSS(
    "padding-bottom",
    "40px",
  );
  await page.goto("/journeys/life-of-a-star");
  await expect(page.locator("a.underline").first()).toHaveCSS(
    "text-decoration-line",
    "underline",
  );
});
