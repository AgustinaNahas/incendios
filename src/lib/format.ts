export function formatHa(value: number, digits = 0): string {
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${formatHa(value / 1_000_000, 1)} M`;
  }
  if (value >= 10_000) {
    return `${formatHa(value / 1000, 1)} mil`;
  }
  return formatHa(value);
}

export function formatPesos(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}
