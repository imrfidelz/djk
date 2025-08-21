export const NGN_SYMBOL = '₦';

export function formatCurrency(amount: number = 0, options: Intl.NumberFormatOptions = {}) {
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });
  return formatter.format(Number(amount) || 0);
}
