/** Token público de Mapbox (pk). Se puede overridear con NEXT_PUBLIC_MAPBOX_TOKEN. */
export const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ??
  "pk.eyJ1IjoiaGF2YiIsImEiOiJpSHhUWGVBIn0.IY5RvkA4-jqVtNxcsYioug";

export const MAPBOX_STYLE = "mapbox://styles/mapbox/dark-v11";

/** Igual que --background. Mapbox no resuelve var(), así que el hex vive una sola vez acá. */
export const SITE_BG = "#2b2b2b";
export const MAP_WATER_COLOR = SITE_BG;
export const MAP_ARGENTINA_COLOR = "#666666";
export const MAP_NEIGHBOR_COLOR = "#000000";
export const MAP_WORLD_COLOR = "#000000";
