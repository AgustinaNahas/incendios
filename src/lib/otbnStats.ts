import type { OtbnZona } from "@/lib/otbnColors";
import type { OtbnProvinceFilter } from "@/lib/otbnCopy";

/** Superficie de la ecorregión Andino Patagónica (guión / OTBN). */
export const ECOREGION_HA = 6_452_891;

export type OtbnHaBreakdown = {
  1: number;
  2: number;
  3: number;
  total: number;
};

/**
 * Superficie OTBN por categoría de conservación declarada (ha).
 * Fuente: tabla “Categoría de conservación declarada” (Rojo I / Amarillo II / Verde III).
 */
export const OTBN_HA: Record<
  Exclude<OtbnProvinceFilter, "all">,
  OtbnHaBreakdown
> = {
  Neuquén: { 1: 192_686, 2: 347_672, 3: 3_559, total: 543_917 },
  "Río Negro": { 1: 181_900, 2: 252_700, 3: 44_300, total: 478_900 },
  Chubut: { 1: 419_351, 2: 613_324, 3: 19_496, total: 1_052_171 },
  "Santa Cruz": { 1: 277_960, 2: 70_629, 3: 0, total: 348_589 },
  "Tierra del Fuego": { 1: 368_424, 2: 407_686, 3: 17_799, total: 793_909 },
};

export const OTBN_TOTAL_HA: OtbnHaBreakdown = {
  1: 1_440_321,
  2: 1_692_011,
  3: 85_154,
  total: 3_217_486,
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
