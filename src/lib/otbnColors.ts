/** Colores del atlas OTBN sobre Mapbox Dark. */

export const ATLAS_COLORS = {
  water: "#C9C6C1",
  land: "#F6F3EE",
  neighbor: "#D9D5CE",
  stroke: "#1A1A1A",
  coral: "#C7281C",
  forest: "#AEB091",
  barTrack: "#6F7358",
  provinceFill: "#9A9A92",
} as const;

export const OTBN_COLORS = {
  1: "#C7281C", // Conservación — coral
  2: "#F1B100", // Uso sustentable — ámbar
  3: "#63A358", // Cambio de uso — salvia
} as const;

export type OtbnZona = keyof typeof OTBN_COLORS;

export const OTBN_ZONA_LABELS: Record<OtbnZona, string> = {
  1: "Conservación",
  2: "Uso sustentable",
  3: "Cambio de uso",
};

export function otbnColor(zona: number): string {
  return OTBN_COLORS[zona as OtbnZona] ?? "#888888";
}
