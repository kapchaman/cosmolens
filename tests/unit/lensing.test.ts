import { expect, test } from "vitest";
import { pointLens } from "@/lib/astronomy/lensing";
test("point-lens image locations satisfy the lens equation across the allowed range", () => {
  for (const mass of [0.25, 1, 3])
    for (const beta of [0, 0.5, 2]) {
      const result = pointLens(mass, beta);
      for (const theta of [result.positive, result.negative])
        expect(theta - mass / theta).toBeCloseTo(beta, 12);
      expect(result.positive).toBeGreaterThan(0);
      expect(result.negative).toBeLessThan(0);
      expect(result.positive * result.negative).toBeCloseTo(-mass, 12);
    }
});
test("aligned Einstein radius scales with square root of mass, not radius of the lens", () => {
  expect(pointLens(4, 0).einsteinRadius).toBe(
    2 * pointLens(1, 0).einsteinRadius,
  );
  expect(pointLens(1, 0)).toEqual({
    einsteinRadius: 1,
    positive: 1,
    negative: -1,
  });
});
test.each([
  [0, 0],
  [-1, 0],
  [Infinity, 0],
  [1, NaN],
])("rejects invalid model parameters %s, %s", (mass, beta) =>
  expect(() => pointLens(mass, beta)).toThrow(RangeError),
);
