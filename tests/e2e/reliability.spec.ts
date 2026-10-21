import { test, expect } from "./fixtures";

test("Atlas query/category deep links survive reload and history navigation", async ({ page }) => {
  await page.goto("/atlas?query=Jupiter&category=planet");
  await expect(page.getByRole("textbox", { name: "Search atlas" })).toHaveValue("Jupiter");
  await expect(page.getByRole("button", { name: /^Planet/ })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("textbox", { name: "Search atlas" }).fill("Saturn");
  await page.reload(); await expect(page.getByRole("textbox", { name: "Search atlas" })).toHaveValue("Saturn");
  await page.getByRole("button", { name: /^Moon/ }).click();
  await expect(page.getByRole("button", { name: /^Moon/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/category=moon/);
  await page.getByRole("textbox", { name: "Search atlas" }).fill("no-such-object-xyz");
  await expect(page.getByText("No curated object matches")).toBeVisible();
  await page.goBack(); await expect(page.getByRole("button", { name: /^Planet/ })).toHaveAttribute("aria-pressed", "true");
});

test("object scale links select the requested scale", async ({ page }) => {
  await page.goto("/objects/jupiter");
  await page.getByRole("link", { name: /Gas giant|Jupiter.*makes the jump/i }).click();
  await expect(page.getByRole("slider", { name: "Scale position" })).toHaveAttribute("aria-valuetext", "Jupiter");
  await page.reload();
  await expect(page.getByRole("slider", { name: "Scale position" })).toHaveValue("2");
});

test("malformed storage cannot crash My Cosmos; notes persist on reload", async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem("cosmolens:saved-objects", '{"bad":"shape"}');
      localStorage.setItem("cosmolens:notes", '[null,{"title":3}]');
      sessionStorage.setItem("seeded", "yes");
    }
  });
  await page.goto("/my-cosmos");
  await page.getByRole("textbox", { name: "Note title" }).fill("Star question");
  await page.getByRole("textbox", { name: "Note body" }).fill("How does fusion work?");
  await page.getByRole("button", { name: "Add note" }).click();
  await expect(page.getByRole("status")).toHaveText("Note saved on this device.");
  await page.reload(); await expect(page.getByRole("heading", { name: "Star question" })).toBeVisible();
});

test("failed save keeps draft and does not claim persistence", async ({ page }) => {
  await page.goto("/my-cosmos");
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException("Full", "QuotaExceededError"); }; });
  await page.getByRole("textbox", { name: "Note title" }).fill("Keep my draft");
  await page.getByRole("textbox", { name: "Note body" }).fill("Useful notes");
  await page.getByRole("button", { name: "Add note" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Note was not saved");
  await expect(page.getByRole("textbox", { name: "Note title" })).toHaveValue("Keep my draft");
  await expect(page.getByRole("heading", { name: "Keep my draft" })).toHaveCount(0);
});

test("comparison context resets AI history and suggestion", async ({ page }) => {
  await page.route("**/api/ai", (route) => route.fulfill({ json: route.request().method() === "GET" ? { available: true } : { answer: "Previous comparison answer" } }));
  await page.goto("/compare?left=andromeda&right=milky-way");
  const question = page.getByRole("textbox", { name: "Ask CosmoLens AI" });
  await expect(question).toBeEnabled();
  await page.getByRole("button", { name: "Ask CosmoLens AI" }).click();
  await expect(page.getByText("Previous comparison answer")).toBeVisible();
  await page.getByLabel("Comparison object").selectOption("jupiter");
  await expect(question).toHaveValue(/Jupiter/);
  await expect(page.getByText("Previous comparison answer")).toHaveCount(0);
});

test("disabled AI is explained before sending a question", async ({ page }) => {
  await page.goto("/compare");
  await expect(page.getByRole("status")).toContainText("AI assistance is temporarily unavailable");
  await expect(page.getByRole("button", { name: "Ask CosmoLens AI" })).toBeDisabled();
});

test("clearing planner date produces no NaN or fabricated phase", async ({ page }) => {
  await page.goto("/observe"); await page.getByLabel("Date", { exact: true }).fill("");
  await expect(page.getByText("Choose a valid date between 1900 and 2100.")).toBeVisible();
  await expect(page.locator("body")).not.toContainText("NaN");
});

test("stellar and expansion journeys show their own conclusions and links", async ({ page }) => {
  await page.goto("/journeys/life-of-a-star");
  await expect(page.getByRole("heading", { name: "A star’s mass shapes its evolution." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continue in atlas" })).toHaveAttribute("href", "/atlas?query=star");
  await page.goto("/journeys/universe-expansion");
  await expect(page.getByRole("heading", { name: "Expansion emerges on large scales." })).toBeVisible();
});
