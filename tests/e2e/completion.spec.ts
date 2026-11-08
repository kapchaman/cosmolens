import { test, expect } from "./fixtures";

test("comparison shows both diameters without horizontal scrolling and preserves missing values", async ({
  page,
}) => {
  await page.goto("/compare?left=europa&right=enceladus");
  const row = page.getByRole("row").filter({
    has: page.getByRole("rowheader", { name: "Diameter", exact: true }),
  });
  await expect(row).toContainText("3,122");
  await expect(row).toContainText("about 500");
  await expect(row).toContainText("Equatorial diameter");
  await expect(row).toContainText("Estimate");
  const box = await row.boundingBox();
  expect(box!.y).toBeLessThan(page.viewportSize()!.height);
  const table = page.getByRole("table");
  expect(
    await table.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
  ).toBe(true);
  await row.locator("summary").first().click();
  await expect(row.getByRole("link")).toHaveAttribute("href", /jpl.nasa.gov/);
  await page.getByLabel("Primary object").selectOption("ganymede");
  await expect(
    page.getByText("These records have no shared measurement fields.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(table).toContainText("Not in curated record");
});

test("notes have visible labels and can be restored after reload, with storage failures kept recoverable", async ({
  page,
}) => {
  await page.goto("/my-cosmos");
  await expect(page.locator('label[for="cosmos-note-title"]')).toBeVisible();
  const write = await page
    .getByRole("link", { name: "Write a note" })
    .boundingBox();
  expect(write!.y + write!.height).toBeLessThan(page.viewportSize()!.height);
  await page.getByLabel("Note title", { exact: true }).fill("Recovery check");
  await page
    .getByLabel("Note body", { exact: true })
    .fill("Keep this exact text, including 42.");
  await page.getByRole("button", { name: "Add note" }).click();
  await page
    .getByRole("button", { name: "Remove note Recovery check", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Undo removal" }),
  ).toBeFocused();
  await page.reload();
  await page.getByText("Removed notes (1)", { exact: true }).click();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Full", "QuotaExceededError");
    };
  });
  await page
    .getByRole("button", { name: "Restore note Recovery check" })
    .click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Could not restore",
  );
  await page.reload();
  await page.getByText("Removed notes (1)", { exact: true }).click();
  await page
    .getByRole("button", { name: "Restore note Recovery check" })
    .click();
  await page.reload();
  await expect(page.locator("#journal-notes")).toContainText(
    "Keep this exact text, including 42.",
  );
  await expect(
    page.getByText("Removed notes (1)", { exact: true }),
  ).toHaveCount(0);
});

test("journey start is early, diagrams explain their models and controls work with a keyboard", async ({
  page,
}) => {
  await page.goto("/journeys/dark-matter-evidence");
  const start = page.getByRole("link", { name: "Start journey", exact: true });
  const box = await start.boundingBox();
  expect(box!.y + box!.height).toBeLessThan(page.viewportSize()!.height);
  await start.click();
  await expect(page).toHaveURL(/#rotation-curves$/);
  await expect(page.getByText("Visualization planned")).toHaveCount(0);
  const offset = page.getByRole("slider", {
    name: "Source offset",
    exact: true,
  });
  await offset.focus();
  await page.keyboard.press("Home");
  await expect(
    page.getByText("Exact alignment: a ring", { exact: false }),
  ).toBeVisible();
  const mass = page.getByRole("slider", { name: "Lens mass", exact: true });
  await mass.focus();
  await page.keyboard.press("End");
  await expect(
    page.getByText("Exact alignment: a ring", { exact: false }),
  ).toContainText("1.73");
  await page.goto("/journeys/life-of-a-star");
  const star = page.getByRole("button", { name: "Select Rigel", exact: true });
  await star.focus();
  await page.keyboard.press("Space");
  await expect(star).toHaveAttribute("aria-pressed", "true");
  await page.goto("/journeys/universe-expansion");
  const scatter = page.getByRole("slider", { name: "Illustrative scatter" });
  await scatter.focus();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("img", { name: /Synthetic distance/ }),
  ).toHaveAttribute("aria-label", /1000/);
  await expect(page.getByText("Visualization planned")).toHaveCount(0);
});

test("offline assistant is compact and never sends a paid request; discoveries has one introduction", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST" && r.url().includes("/api/ai"))
      posts.push(r.url());
  });
  await page.goto("/objects/andromeda");
  const notice = page.getByRole("complementary", {
    name: "Assistant availability",
  });
  await expect(notice.getByRole("status")).toContainText(
    "temporarily unavailable",
  );
  await expect(
    notice.getByRole("link", { name: "Explore atlas" }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Ask CosmoLens AI" }),
  ).toHaveCount(0);
  expect(posts).toEqual([]);
  await page.goto("/discoveries");
  await expect(
    page.getByRole("heading", { name: "Dispatches from the universe." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Official astronomy and space science updates",
    }),
  ).toHaveCount(0);
});

test("permanent note deletion requires confirmation and cancellation retains recovery", async ({
  page,
}) => {
  await page.goto("/my-cosmos");
  await page
    .getByLabel("Note title", { exact: true })
    .fill("Disposable test note");
  await page
    .getByLabel("Note body", { exact: true })
    .fill("Only this test record.");
  await page.getByRole("button", { name: "Add note" }).click();
  await page
    .getByRole("button", {
      name: "Remove note Disposable test note",
      exact: true,
    })
    .click();
  await page.getByText("Removed notes (1)", { exact: true }).click();
  const remove = page.getByRole("button", {
    name: "Permanently delete note Disposable test note",
  });
  page.once("dialog", (dialog) => dialog.dismiss());
  await remove.click();
  await expect(remove).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await remove.click();
  await expect(page.getByRole("status")).toHaveText(
    "Note permanently deleted from this device.",
  );
  await page.reload();
  await expect(
    page.getByText("Disposable test note", { exact: true }),
  ).toHaveCount(0);
});
