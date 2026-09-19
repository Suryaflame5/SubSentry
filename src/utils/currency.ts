/**
 * Financial currency formatting utilities for SubSentry
 * Focused on Indian Rupee (₹) formatting with precision and clean tabular rendering
 */

export function formatCurrency(amount: number, options?: { showCents?: boolean; sign?: boolean }): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Format to Indian numbering system (e.g. 1,00,000 or 74,880)
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: options?.showCents ? 2 : 0,
    maximumFractionDigits: options?.showCents ? 2 : 0,
  }).format(absAmount);

  const prefix = options?.sign ? (isNegative ? "-₹" : "+₹") : (isNegative ? "-₹" : "₹");
  return `${prefix}${formatted}`;
}

export function formatCompactCurrency(amount: number): string {
  if (Math.abs(amount) >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return formatCurrency(amount);
}
