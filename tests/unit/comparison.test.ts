import { expect, test } from "vitest";
import { comparisonRows } from "@/lib/astronomy/comparison";
import { getObjectById } from "@/lib/astronomy/catalog";
import type { Measurement } from "@/types/astronomy";
const m = (label: string, unit = "km"): Measurement => ({
  label,
  value: "20",
  unit,
  confidence: "estimate",
  sourceIds: ["test"],
});
test("Europa and Enceladus diameters share one row while keeping definitions, sources and confidence", () => {
  const left = getObjectById("europa")!.measurements,
    right = getObjectById("enceladus")!.measurements;
  const rows = comparisonRows(left, right);
  expect(rows[0]).toEqual({
    label: "Diameter",
    left: left[0],
    right: right[0],
  });
  expect(rows.filter((r) => r.left && r.right)).toHaveLength(1);
  expect(rows.find((r) => r.label === "Ocean evidence")?.left).toBeUndefined();
});
test("radius, diameter, orbital distance and distance from Earth never collapse into one field", () => {
  const rows = comparisonRows(
    [m("Radius"), m("Distance from Earth"), m("Orbital distance from Jupiter")],
    [m("Diameter"), m("Distance"), m("Mean distance from Sun")],
  );
  expect(rows).toHaveLength(6);
  expect(rows.every((r) => !(r.left && r.right))).toBe(true);
});
test("same-named measurements retain units and duplicate qualified records are not discarded", () => {
  const rows = comparisonRows(
    [m("Diameter"), m("Equatorial diameter")],
    [m("Diameter", "miles")],
  );
  expect(rows).toHaveLength(2);
  expect(rows[0].right?.unit).toBe("miles");
  expect(rows.flatMap((r) => [r.left, r.right]).filter(Boolean)).toHaveLength(
    3,
  );
});
