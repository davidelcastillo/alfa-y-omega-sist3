const moneyFmtAR = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function moneyAR(n?: number) {
  return moneyFmtAR.format(n ?? 0);
}