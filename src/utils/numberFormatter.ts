/**
 * Formats numbers with K notation for thousands and proper comma formatting
 * @param value - The number to format
 * @param options - Formatting options
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  options: {
    showCurrency?: boolean;
    currency?: string;
    decimals?: number;
    compact?: boolean;
  } = {}
): string => {
  const {
    showCurrency = false,
    currency = "$",
    decimals = 0,
    compact = true,
  } = options;

  // Handle negative numbers
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  let formatted: string;

  if (compact && absValue >= 1000) {
    // Use K notation for thousands
    if (absValue >= 1000000) {
      formatted = `${(absValue / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      formatted = `${(absValue / 1000).toFixed(1)}K`;
    } else {
      formatted = absValue.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
  } else {
    // Use regular comma formatting
    formatted = absValue.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  // Add currency symbol if needed
  if (showCurrency) {
    formatted = `${currency}${formatted}`;
  }

  // Add negative sign if needed
  if (isNegative) {
    formatted = `-${formatted}`;
  }

  return formatted;
};

/**
 * Formats currency values with K notation
 * @param value - The currency value to format
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  currency: string = "$"
): string => {
  return formatNumber(value, { showCurrency: true, currency, compact: true });
};

/**
 * Formats percentage values
 * @param value - The percentage value to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  decimals: number = 0
): string => {
  return `${value.toFixed(decimals)}%`;
};
