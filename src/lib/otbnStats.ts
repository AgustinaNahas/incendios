import type { OtbnZona } from "@/lib/otbnColors";
import type { OtbnProvinceFilter } from "@/lib/otbnCopy";

/** Superficie de la ecorregión Bosques Patagónicos (atlas-ecoregion-bosques). */
export const ECOREGION_HA = 6_459_673;

export type OtbnHaBreakdown = {
  1: number;
  2: number;
  3: number;
  total: number;
};

/** Superficie OTBN (polígonos de otbn-zonas.geojson), en hectáreas. */
export const OTBN_HA: Record<
  Exclude<OtbnProvinceFilter, "all">,
  OtbnHaBreakdown
> = {
  Neuquén: { 1: 189_975, 2: 347_652, 3: 3_583, total: 541_210 },
  "Río Negro": { 1: 429_192, 2: 249_043, 3: 48_949, total: 727_184 },
  Chubut: { 1: 380_629, 2: 510_038, 3: 19_518, total: 910_185 },
  "Santa Cruz": { 1: 276_916, 2: 69_770, 3: 0, total: 346_686 },
  "Tierra del Fuego": { 1: 309_002, 2: 397_159, 3: 19_980, total: 726_141 },
};

export const OTBN_TOTAL_HA: OtbnHaBreakdown = {
  1: 1_585_714,
  2: 1_573_662,
  3: 92_030,
  total: 3_251_406,
};

export function otbnHaFor(
  province: OtbnProvinceFilter,
): OtbnHaBreakdown {
  if (province === "all") return OTBN_TOTAL_HA;
  return OTBN_HA[province];
}

export function otbnShareOfEcoregion(): number {
  return OTBN_TOTAL_HA.total / ECOREGION_HA;
}

export function otbnZonasPresent(
  province: OtbnProvinceFilter,
): OtbnZona[] {
  const ha = otbnHaFor(province);
  return ([1, 2, 3] as const).filter((zona) => ha[zona] > 0);
}
