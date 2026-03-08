/**
 * Format a price using Intl.NumberFormat for consistent display across the app.
 */
export const formatPrice = (
  amount: number,
  currency: string = "GHS",
  options?: { compact?: boolean }
): string => {
  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
      ...(options?.compact ? { notation: "compact" } : {}),
    });
    return `${currency} ${formatter.format(amount)}`;
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
};

/**
 * Format just the number portion (no currency prefix).
 */
export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
