// Thin, isolated point lens; fixed observer/lens/source distances.
// Angles use the Einstein radius at reference mass M0 (theta_E0) as a unit.
// beta = theta - m/theta, where m = M/M0. Not a galaxy-cluster fit.
export function pointLens(massRatio: number, sourceOffset: number) {
  if (
    !Number.isFinite(massRatio) ||
    massRatio <= 0 ||
    !Number.isFinite(sourceOffset)
  )
    throw new RangeError("Invalid point-lens parameters");
  const root = Math.sqrt(sourceOffset ** 2 + 4 * massRatio);
  return {
    einsteinRadius: Math.sqrt(massRatio),
    positive: (sourceOffset + root) / 2,
    negative: (sourceOffset - root) / 2,
  };
}
