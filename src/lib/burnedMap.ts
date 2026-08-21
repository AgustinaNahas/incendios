export type BurnedHaByMonth = Record<string, number>;

export type BurnedProperties = {
  in1: number;
  provincia: string;
  nam: string;
  ha: BurnedHaByMonth;
};

export type BurnedCollection = GeoJSON.FeatureCollection<
  GeoJSON.MultiPolygon | GeoJSON.Polygon,
  BurnedProperties
> & {
  months: string[];
};

export function cumulativeHa(
  ha: BurnedHaByMonth,
  months: string[],
  throughIndex: number,
): number {
  let total = 0;
  const last = Math.min(throughIndex, months.length - 1);
  for (let i = 0; i <= last; i += 1) {
    total += ha[months[i]] ?? 0;
  }
  return total;
}

export function monthHa(
  ha: BurnedHaByMonth,
  months: string[],
  index: number,
): number {
  return ha[months[index]] ?? 0;
}

export function maxCumulativeHa(data: BurnedCollection): number {
  let max = 0;
  const last = data.months.length - 1;
  for (const feature of data.features) {
    const total = cumulativeHa(feature.properties.ha, data.months, last);
    if (total > max) max = total;
  }
  return max;
}

const MONTH_LABELS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function formatBurnedMonth(iso: string): string {
  const [year, month] = iso.split("-");
  const idx = Number(month) - 1;
  const name = MONTH_LABELS[idx] ?? month;
  return `${name} ${year}`;
}
