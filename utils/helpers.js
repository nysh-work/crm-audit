/**
 * Helper utility functions for the audit fee calculator
 */

/**
 * Format a number as currency in Indian format (e.g., ₹1,23,456.00)
 * @param {number|string} amount - The amount to format
 * @param {boolean} includeSymbol - Whether to include the ₹ symbol
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, includeSymbol = true) => {
  if (amount === undefined || amount === null || amount === '') {
    return includeSymbol ? '₹0.00' : '0.00';
  }
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return includeSymbol ? '₹0.00' : '0.00';
  }
  
  // Format with Indian numbering system (lakhs, crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: includeSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(numAmount);
};

/**
 * Format a number with commas according to Indian number format
 * @param {number|string} number - The number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (number) => {
  if (number === undefined || number === null || number === '') {
    return '0';
  }
  
  const numValue = typeof number === 'string' ? parseFloat(number) : number;
  
  if (isNaN(numValue)) {
    return '0';
  }
  
  return numValue.toLocaleString('en-IN');
};

/**
 * Calculate percentage change between two values
 * @param {number} oldValue - The original value
 * @param {number} newValue - The new value
 * @param {number} decimals - Number of decimal places to show
 * @returns {string} - Formatted percentage change with sign
 */
export const calculatePercentageChange = (oldValue, newValue, decimals = 2) => {
  if (!oldValue || oldValue === 0) return 'N/A';
  
  const change = ((newValue - oldValue) / oldValue) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(decimals)}%`;
};

/**
 * Convert a number in lakhs to millions or vice versa
 * @param {number} value - The value to convert
 * @param {string} from - The source unit ('lakhs' or 'millions')
 * @param {string} to - The target unit ('lakhs' or 'millions')
 * @returns {number} - The converted value
 */
export const convertCurrencyUnit = (value, from, to) => {
  if (value === undefined || value === null || value === '') {
    return 0;
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return 0;
  }
  
  // 1 million = 10 lakhs
  if (from === 'lakhs' && to === 'millions') {
    return numValue / 10;
  } else if (from === 'millions' && to === 'lakhs') {
    return numValue * 10;
  } else {
    return numValue; // Same unit, no conversion needed
  }
}; 