/** Educational Newtonian ratio model, calibrated to reference Earth g = 9.81 m/s².
 * Planet mass, radius and test-body mass are independent inputs. Rotation is omitted.
 */
export function surfaceGravity(massRatio: number, radiusRatio = 1) {
  if (
    !Number.isFinite(massRatio) ||
    massRatio <= 0 ||
    !Number.isFinite(radiusRatio) ||
    radiusRatio <= 0
  )
    throw new RangeError("Mass and radius ratios must be finite and positive");
  return (9.81 * massRatio) / (radiusRatio * radiusRatio);
}
export function weightNewtons(testBodyMassKg: number, acceleration: number) {
  if (
    !Number.isFinite(testBodyMassKg) ||
    testBodyMassKg < 0 ||
    !Number.isFinite(acceleration) ||
    acceleration < 0
  )
    throw new RangeError(
      "Mass and acceleration must be finite and nonnegative",
    );
  return testBodyMassKg * acceleration;
}
