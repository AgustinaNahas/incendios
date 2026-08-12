export const PATAGONIA_PROVINCES = [
  "Neuquén",
  "Río Negro",
  "Chubut",
  "Santa Cruz",
  "Tierra del Fuego",
] as const;

export type PatagoniaProvince = (typeof PATAGONIA_PROVINCES)[number];

export const YEARS = [
  2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
] as const;

export type Year = (typeof YEARS)[number];

/** Years with complete annual RII series (2026 is partial through March). */
export const COMPLETE_YEARS = [
  2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
] as const;

export const FIRE_SEASON_MONTHS = [
  "Diciembre",
  "Enero",
  "Febrero",
  "Marzo",
] as const;

export const CHAPTERS = [
  { id: "despues", label: "El después", short: "Después", tree: "burned" },
  { id: "fuego", label: "El fuego", short: "Fuego", tree: "fire" },
  { id: "antes", label: "El antes", short: "Antes", tree: "healthy" },
  { id: "otbn", label: "El territorio", short: "OTBN", tree: "otbn" },
  { id: "brechas", label: "Brechas", short: "Brechas", tree: "gap" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

export const PROVINCE_COLORS: Record<PatagoniaProvince, string> = {
  Neuquén: "#e8a87c",
  "Río Negro": "#c38d9e",
  Chubut: "#85cdca",
  "Santa Cruz": "#e27d60",
  "Tierra del Fuego": "#41b3a3",
};
