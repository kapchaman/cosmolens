import { expect, test } from "vitest";
import { getAllObjects, getJourneys, getCosmicScale } from "@/lib/astronomy/catalog";
import { globalSearch } from "@/lib/astronomy/search";
import { boundedHistory } from "@/lib/ai/history";
import { assistantRequestSchema } from "@/lib/ai/validation";
test("every journey has specific conclusions, valid comparison targets and prompts", () => {
  const journeys = getJourneys(); const ids = new Set(getAllObjects().map((o) => o.id));
  expect(new Set(journeys.map((j) => j.conclusion.body)).size).toBe(journeys.length);
  for (const journey of journeys) {
    expect(ids.has(journey.comparison.left)).toBe(true); expect(ids.has(journey.comparison.right)).toBe(true);
    expect(journey.suggestedQuestion.length).toBeGreaterThan(20);
    if (journey.id !== "dark-matter-evidence") expect(journey.conclusion.body).not.toContain("Dark matter becomes compelling");
  }
});
test("scale search results encode their specific scale", () => {
  for (const node of getCosmicScale()) {
    const result = globalSearch(node.title).find((item) => item.id === `scale-${node.id}`);
    expect(result?.href).toBe(`/?scale=${node.id}#cosmic-scale`);
  }
});
test("long assistant answers cannot invalidate the next request's history", () => {
  const history = Array.from({ length: 20 }, () => ({ role: "assistant" as const, content: "x".repeat(12000) }));
  expect(assistantRequestSchema.safeParse({ question: "Explain stars", history: boundedHistory(history) }).success).toBe(true);
  expect(boundedHistory(history)).toHaveLength(6);
  expect(assistantRequestSchema.safeParse({ question: "Explain stars", history }).success).toBe(false);
});
