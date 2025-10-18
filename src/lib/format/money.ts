const moneyFmtAR = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function moneyAR(n?: number) {
  return moneyFmtAR.format(n ?? 0);
}