import { ATLAS_COLORS } from "@/lib/otbnColors";

export const BURNED_GRADIENT = [
  { t: 0, color: "#FFFFFF" },
  { t: 0.34, color: "#FFC800" },
  { t: 0.67, color: "#F46B15" },
  { t: 1, color: "#940F11" },
] as const;

export const BURNED_FILL_OPACITY = 1;
export const BURNED_STROKE = ATLAS_COLORS.stroke;
export const BURNED_STROKE_WEIGHT = 1.1;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function burnedFillColor(t: number): string {
  const x = Math.min(1, Math.max(0, t));
  let i = 0;
  while (i < BURNED_GRADIENT.length - 2 && BURNED_GRADIENT[i + 1].t < x) i += 1;
  const a = BURNED_GRADIENT[i];
  const b = BURNED_GRADIENT[i + 1];
  const local = (x - a.t) / (b.t - a.t || 1);
  const ca = hexToRgb(a.color);
  const cb = hexToRgb(b.color);
  const r = Math.round(lerp(ca[0], cb[0], local));
  const g = Math.round(lerp(ca[1], cb[1], local));
  const bl = Math.round(lerp(ca[2], cb[2], local));
  return `#${[r, g, bl].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

/** Map hectares to 0–1 using log1p so small fires still read as yellow. */
export function burnedScaleT(hectares: number, maxHectares: number): number {
  if (hectares <= 0 || maxHectares <= 0) return 0;
  return Math.log1p(hectares) / Math.log1p(maxHectares);
}

export function burnedColorForHa(hectares: number, maxHectares: number): string {
  return burnedFillColor(burnedScaleT(hectares, maxHectares));
}
