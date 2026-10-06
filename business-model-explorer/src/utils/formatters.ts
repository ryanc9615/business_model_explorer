export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(
  value: number,
  maximumFractionDigits = 1,
): string {
  return new Intl.NumberFormat("en-GB", {
    style: "percent",
    maximumFractionDigits,
  }).format(value);
}

export function formatNumber(
  value: number,
  maximumFractionDigits = 0,
): string {
  return new Intl.NumberFormat("en-GB", {
    maximumFractionDigits,
  }).format(value);
}