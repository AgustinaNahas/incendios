/**
 * Intensidad estacional de hectáreas quemadas (Patagonia, CONAE 2022–2026).
 * Promedio histórico por mes calendario → color del timeline.
 */
export const BURNED_TIMELINE_MONTHS: string[] = (() => {
  const out: string[] = [];
  for (let year = 2022; year <= 2026; year += 1) {
    const last = year === 2026 ? 6 : 12;
    for (let month = 1; month <= last; month += 1) {
      out.push(`${year}-${String(month).padStart(2, "0")}`);
    }
  }
  return out;
})();

/** Media de ha quemadas por mes calendario (1–12), CONAE Patagonia 2022–2026. */
export const CALENDAR_MONTH_MEAN_HA: Record<number, number> = {
  1: 28000,
  2: 14486,
  3: 2681,
  4: 868,
  5: 2143,
  6: 420,
  7: 165,
  8: 188,
  9: 113,
  10: 168,
  11: 7763,
  12: 12553,
};

const MAX_MEAN = Math.max(...Object.values(CALENDAR_MONTH_MEAN_HA));

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpChannel(a: number, b: number, t: number) {
  return Math.round(lerp(a, b, t));
}

/** t 0 (pocos incendios) → 1 (pico estacional). Blanco/ámbar → naranja → bordo. */
export function seasonColor(t: number): string {
  const x = Math.min(1, Math.max(0, t));
  // stops: cream → yellow → orange → bordo
  const stops: [number, [number, number, number]][] = [
    [0, [246, 243, 238]],
    [0.22, [255, 200, 0]],
    [0.5, [244, 107, 21]],
    [0.78, [148, 15, 17]],
    [1, [92, 10, 12]],
  ];
  for (let i = 0; i < stops.length - 1; i += 1) {
    const [t0, c0] = stops[i];
    const [t1, c1] = stops[i + 1];
    if (x <= t1) {
      const u = (x - t0) / (t1 - t0 || 1);
      return `rgb(${lerpChannel(c0[0], c1[0], u)}, ${lerpChannel(c0[1], c1[1], u)}, ${lerpChannel(c0[2], c1[2], u)})`;
    }
  }
  const last = stops[stops.length - 1][1];
  return `rgb(${last[0]}, ${last[1]}, ${last[2]})`;
}

/** Intensidad 0–1 para un mes calendario; raíz suaviza el salto ene/feb vs invierno. */
export function calendarMonthIntensity(month: number): number {
  const mean = CALENDAR_MONTH_MEAN_HA[month] ?? 0;
  return Math.sqrt(mean / MAX_MEAN);
}

export function isoMonthIntensity(iso: string): number {
  const month = Number(iso.split("-")[1]);
  return calendarMonthIntensity(month);
}

/** CSS linear-gradient(90deg, …) alineado a BURNED_TIMELINE_MONTHS. */
export function burnedSeasonGradient(
  months: string[] = BURNED_TIMELINE_MONTHS,
): string {
  if (months.length === 0) return "#940F11";
  if (months.length === 1) {
    return seasonColor(isoMonthIntensity(months[0]));
  }
  const stops = months.map((iso, i) => {
    const pct = (i / (months.length - 1)) * 100;
    return `${seasonColor(isoMonthIntensity(iso))} ${pct.toFixed(2)}%`;
  });
  return `linear-gradient(90deg, ${stops.join(", ")})`;
}
