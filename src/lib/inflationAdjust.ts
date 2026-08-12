/**
 * Adjust nominal pesos to a base-year real value using annual CPI multipliers.
 * `cpiIndex` is relative to the base year (base year = 1).
 */
export function adjustForInflation(
  nominal: number,
  cpiIndex: number,
): number {
  if (!cpiIndex) return nominal;
  return nominal / cpiIndex;
}

export function seriesReal(
  points: { year: number; nominal: number; cpiIndex: number }[],
): { year: number; real: number; nominal: number }[] {
  return points.map((p) => ({
    year: p.year,
    nominal: p.nominal,
    real: adjustForInflation(p.nominal, p.cpiIndex),
  }));
}
