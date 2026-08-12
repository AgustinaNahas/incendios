/** Colores configurables para categorías OTBN (clave = properties.zona del GeoJSON). */
export const OTBN_COLORS = {
  1: "#9b2226", // Conservación
  2: "#d4a373", // Uso sustentable
  3: "#1b4332", // Cambio de uso
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
