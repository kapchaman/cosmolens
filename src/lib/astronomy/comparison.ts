import type { Measurement } from "@/types/astronomy";

// Deliberate, narrow grouping. Never infer equivalence from a substring or
// convert free-text measurements. Preserve each record's original qualifier.
const groups: Record<string, string> = {
  diameter: "Diameter",
  "equatorial diameter": "Diameter",
};

export function comparisonRows(left: Measurement[], right: Measurement[]) {
  const rows = new Map<
    string,
    { label: string; left?: Measurement; right?: Measurement }
  >();
  for (const [side, measurements] of [
    ["left", left],
    ["right", right],
  ] as const) {
    for (const measurement of measurements) {
      const normalized = measurement.label
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
      const label = groups[normalized] || measurement.label.trim();
      const key = label.toLowerCase();
      // If one record has both general and equatorial diameters, do not drop
      // either measurement or imply that their definitions are interchangeable.
      const rowKey = rows.get(key)?.[side]
        ? `${key}:${side}:${normalized}`
        : key;
      const row = rows.get(rowKey) || { label };
      row[side] = measurement;
      rows.set(rowKey, row);
    }
  }
  return [...rows.values()].sort(
    (a, b) =>
      Number(Boolean(b.left && b.right)) - Number(Boolean(a.left && a.right)),
  );
}
