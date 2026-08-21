/** Colores del atlas esquemático y categorías OTBN. */

export const ATLAS_COLORS = {
  water: "#C9C6C1",
  land: "#F6F3EE",
  neighbor: "#D9D5CE",
  stroke: "#1A1A1A",
  coral: "#C45C4A",
} as const;

export const OTBN_COLORS = {
  1: "#C45C4A", // Conservación — coral
  2: "#E0B25A", // Uso sustentable — ámbar
  3: "#5F8A6A", // Cambio de uso — salvia
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
