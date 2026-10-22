import { expect, test } from "vitest";
import { surfaceGravity, weightNewtons } from "@/lib/lab/gravity";

test("fixed-radius gravity is proportional to planet mass", () => {
  expect(surfaceGravity(1)).toBeCloseTo(9.81);
  expect(surfaceGravity(2)).toBeCloseTo(19.62);
  expect(surfaceGravity(3)).toBeCloseTo(29.43);
});
test("radius is an independent inverse-square input", () => {
  expect(surfaceGravity(1, 2)).toBeCloseTo(9.81 / 4);
  expect(surfaceGravity(2, 2)).toBeCloseTo(9.81 / 2);
});
test("test-body mass changes weight, not surface gravity", () => {
  const g = surfaceGravity(2);
  expect(weightNewtons(75, g)).toBeCloseTo(1471.5);
  expect(weightNewtons(150, g)).toBeCloseTo(2943);
  expect(g).toBeCloseTo(19.62);
});
test("nonphysical and nonfinite inputs cannot produce a plausible output", () => {
  for (const mass of [-1, 0, NaN, Infinity])
    expect(() => surfaceGravity(mass)).toThrow(RangeError);
  for (const radius of [-1, 0, NaN, Infinity])
    expect(() => surfaceGravity(1, radius)).toThrow(RangeError);
  expect(() => weightNewtons(-1, 9.81)).toThrow(RangeError);
  expect(() => weightNewtons(75, NaN)).toThrow(RangeError);
});
