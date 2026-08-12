import Papa from "papaparse";
import {
  COMPLETE_YEARS,
  PATAGONIA_PROVINCES,
  YEARS,
  type PatagoniaProvince,
  type Year,
} from "./patagonia";

export type ProvinceYearValue = {
  jurisdiction: string;
  year: Year;
  value: number | null;
};

function parseCell(raw: string | undefined): number | null {
  if (raw == null) return null;
  const trimmed = raw.trim().replace(/^"|"$/g, "");
  if (!trimmed || trimmed.toLowerCase() === "s/d") return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function yearFromHeader(header: string): Year | null {
  const match = header.match(/(?:hectáreas_|año_)(\d{4})/i);
  if (!match) return null;
  const year = Number(match[1]) as Year;
  return (YEARS as readonly number[]).includes(year) ? year : null;
}

function normalizeKey(key: string): string {
  return key
    .replace(/^\uFEFF/, "")
    .trim()
    .replace(/^"|"$/g, "")
    .toLowerCase();
}

export function parseProvinceYearCsv(csvText: string): ProvinceYearValue[] {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    delimiter: ";",
    skipEmptyLines: true,
  });

  const rows: ProvinceYearValue[] = [];

  for (const row of parsed.data) {
    const keys = Object.keys(row);
    const jurKey =
      keys.find((k) => {
        const n = normalizeKey(k);
        return n === "jurisdicción" || n === "jurisdiccion" || n === "mes";
      }) ?? keys[0];

    const jurisdiction = (row[jurKey] ?? "")
      .trim()
      .replace(/^"|"$/g, "")
      .replace(/\r/g, "");

    if (!jurisdiction || jurisdiction === "Total") continue;

    for (const key of keys) {
      if (key === jurKey) continue;
      const year = yearFromHeader(normalizeKey(key).replace(/\s/g, "_"));
      if (!year) continue;
      rows.push({
        jurisdiction,
        year,
        value: parseCell(row[key]),
      });
    }
  }

  return rows;
}

export function parseMonthYearCsv(csvText: string): ProvinceYearValue[] {
  // Same shape as province CSV but jurisdiction field is month name
  return parseProvinceYearCsv(csvText).map((r) => ({
    ...r,
    jurisdiction: r.jurisdiction,
  }));
}

export function filterPatagonia(rows: ProvinceYearValue[]): ProvinceYearValue[] {
  const set = new Set<string>(PATAGONIA_PROVINCES);
  return rows.filter((r) => set.has(r.jurisdiction));
}

export function sumByYear(
  rows: ProvinceYearValue[],
  years: readonly number[] = COMPLETE_YEARS,
): { year: Year; value: number }[] {
  return years.map((year) => {
    const value = rows
      .filter((r) => r.year === year && r.value != null)
      .reduce((acc, r) => acc + (r.value ?? 0), 0);
    return { year: year as Year, value };
  });
}

export function sumByProvince(
  rows: ProvinceYearValue[],
  years: readonly number[] = COMPLETE_YEARS,
): { province: PatagoniaProvince; value: number }[] {
  return PATAGONIA_PROVINCES.map((province) => {
    const value = rows
      .filter(
        (r) =>
          r.jurisdiction === province &&
          years.includes(r.year) &&
          r.value != null,
      )
      .reduce((acc, r) => acc + (r.value ?? 0), 0);
    return { province, value };
  }).sort((a, b) => b.value - a.value);
}

export function valuesByProvinceYear(
  rows: ProvinceYearValue[],
): Record<string, Record<number, number | null>> {
  const out: Record<string, Record<number, number | null>> = {};
  for (const row of rows) {
    if (!out[row.jurisdiction]) out[row.jurisdiction] = {};
    out[row.jurisdiction][row.year] = row.value;
  }
  return out;
}

export function peakYear(
  series: { year: Year; value: number }[],
): { year: Year; value: number } | null {
  if (!series.length) return null;
  return series.reduce((best, cur) => (cur.value > best.value ? cur : best));
}

export function mean(series: { value: number }[]): number {
  if (!series.length) return 0;
  return series.reduce((a, b) => a + b.value, 0) / series.length;
}
