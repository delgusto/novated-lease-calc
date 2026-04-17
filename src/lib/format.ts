export const aud = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
});

export const audPrecise = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 2,
});

export function formatCompact(n: number): string {
  if (Math.abs(n) >= 1000) {
    return `$${Math.round(n / 100) / 10}k`;
  }
  return aud.format(n);
}
