/**
 * CAGR-based Fee Calculation Utilities
 * 
 * This file implements the new compound annual growth rate (CAGR) based
 * approach for calculating audit fees.
 */

/**
 * Calculate the Compound Annual Growth Rate (CAGR)
 * 
 * @param {number} initialValue - The initial value
 * @param {number} finalValue - The final value
 * @param {number} numberOfYears - Number of years between the values
 * @returns {number} - The CAGR as a percentage (e.g., 10 for 10%)
 */
export const calculateCAGR = (initialValue, finalValue, numberOfYears) => {
  if (initialValue <= 0 || numberOfYears === 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / numberOfYears) - 1) * 100;
};

/**
 * Extract valid financial data from yearly data
 * 
 * @param {Array} yearlyData - Array of yearly financial data
 * @param {string} field - Financial field to extract (e.g., 'totalRevenue', 'surplusDeficit')
 * @returns {Array} - Array of valid numerical values for the field
 */
export const extractValidFinancialData = (yearlyData, field) => {
  if (!Array.isArray(yearlyData) || yearlyData.length === 0) {
    return [];
  }
  
  return yearlyData
    .filter(year => year.financialData && year.financialData[field])
    .map(year => parseFloat(year.financialData[field]) || 0)
    .filter(value => value > 0);
};

/**
 * Calculate CAGR for a specific financial metric
 * 
 * @param {Array} yearlyData - Array of yearly financial data
 * @param {string} field - Financial field to calculate CAGR for
 * @returns {number} - CAGR as a decimal or 0 if insufficient data
 */
export const calculateMetricCAGR = (yearlyData, field) => {
  const validData = extractValidFinancialData(yearlyData, field);
  
  if (validData.length < 2) {
    return 0;
  }
  
  const oldestValue = validData[0];
  const latestValue = validData[validData.length - 1];
  const years = validData.length - 1;
  
  return calculateCAGR(oldestValue, latestValue, years);
};

/**
 * Calculate historical audit fee growth rate
 * 
 * @param {Array} yearlyData - Array of yearly financial data
 * @returns {number} - Historical audit fee growth rate as a decimal or 0 if insufficient data
 */
export const calculateHistoricalAuditFeeGrowth = (yearlyData) => {
  if (!Array.isArray(yearlyData) || yearlyData.length < 2) {
    return 0;
  }
  
  // Filter years with valid statutoryAudit fees
  const validYears = yearlyData
    .filter(year => 
      year.services && 
      year.services.statutoryAudit &&
      year.services.statutoryAudit.selected && 
      parseFloat(year.services.statutoryAudit.fee) > 0
    )
    .map(year => ({
      year: year.yearLabel,
      fee: parseFloat(year.services.statutoryAudit.fee)
    }))
    .sort((a, b) => a.year.localeCompare(b.year));
  
  if (validYears.length < 2) {
    return 0;
  }
  
  const oldestFee = validYears[0].fee;
  const latestFee = validYears[validYears.length - 1].fee;
  const years = validYears.length - 1;
  
  return calculateCAGR(oldestFee, latestFee, years);
};

/**
 * Calculate the proposed fee based on new CAGR-based logic
 * 
 * @param {Array} yearlyData - Array of yearly financial data
 * @param {number} inflationRate - Optional inflation rate as a decimal (e.g., 0.06 for 6%)
 * @returns {Object} - Object containing proposed fee and calculation explanation
 */
export const calculateCAGRBasedFee = (yearlyData, inflationRate = 0) => {
  // Safety check
  if (!Array.isArray(yearlyData) || yearlyData.length === 0) {
    return {
      proposedFee: 0,
      explanation: "Insufficient data to calculate fee."
    };
  }
  
  // Calculate CAGR for revenue and profit
  const revenueCAGR = calculateMetricCAGR(yearlyData, 'totalRevenue');
  const profitCAGR = calculateMetricCAGR(yearlyData, 'surplusDeficit');
  
  // Calculate historical audit fee growth
  const historicalFeeGrowth = calculateHistoricalAuditFeeGrowth(yearlyData);
  
  // Get most recent statutory audit fee
  const latestYearWithFee = yearlyData
    .filter(year => 
      year.services && 
      year.services.statutoryAudit &&
      year.services.statutoryAudit.selected && 
      parseFloat(year.services.statutoryAudit.fee) > 0
    )
    .sort((a, b) => b.yearLabel.localeCompare(a.yearLabel))[0];
  
  if (!latestYearWithFee) {
    return {
      proposedFee: 0,
      explanation: "No previous audit fee data available."
    };
  }
  
  const latestFee = parseFloat(latestYearWithFee.services.statutoryAudit.fee);
  
  // Determine the appropriate growth rate based on business rules
  let growthRate;
  let explanation;
  
  // Convert to percentages for display
  const revenueCAGRPercent = (revenueCAGR * 100).toFixed(2);
  const profitCAGRPercent = (profitCAGR * 100).toFixed(2);
  const historicalFeeGrowthPercent = (historicalFeeGrowth * 100).toFixed(2);
  const inflationRatePercent = (inflationRate * 100).toFixed(2);
  
  // Apply fee calculation logic
  if (revenueCAGR > 0.10 && profitCAGR > 0.10) {
    // If both revenue and profit CAGR > 10%
    if (historicalFeeGrowth < 0.10) {
      growthRate = 0.10;
      explanation = `Both revenue growth (${revenueCAGRPercent}%) and profit growth (${profitCAGRPercent}%) exceed 10%, but historical fee growth (${historicalFeeGrowthPercent}%) is less than 10%. Recommending a 10% increase.`;
    } else {
      growthRate = historicalFeeGrowth;
      explanation = `Both revenue growth (${revenueCAGRPercent}%) and profit growth (${profitCAGRPercent}%) exceed 10%, and historical fee growth (${historicalFeeGrowthPercent}%) is already in line with profitability. Recommending continuing with the same growth rate.`;
    }
  } else {
    // If either revenue or profit CAGR <= 10%
    if (profitCAGR > historicalFeeGrowth) {
      growthRate = profitCAGR;
      explanation = `Growth in profitability (${profitCAGRPercent}%) exceeds historical fee growth (${historicalFeeGrowthPercent}%). Recommending aligning with profitability growth.`;
    } else {
      growthRate = 0.15;
      explanation = `Neither revenue growth (${revenueCAGRPercent}%) nor profit growth (${profitCAGRPercent}%) exceeds 10%. Recommending a standard 15% increase.`;
    }
  }
  
  // Adjust for inflation if provided
  if (inflationRate > 0 && growthRate < inflationRate) {
    growthRate = inflationRate;
    explanation += ` However, the inflation rate (${inflationRatePercent}%) is higher, so recommending at least an inflation-based increase.`;
  }
  
  // Calculate proposed fee
  const proposedFee = Math.round(latestFee * (1 + growthRate));
  
  return {
    proposedFee,
    growthRate,
    explanation,
    metrics: {
      revenueCAGR,
      profitCAGR,
      historicalFeeGrowth,
      inflationRate
    }
  };
};

/**
 * Calculate the Compound Annual Growth Rate (CAGR) for profit
 * 
 * @param {Array} yearlyData - Array of yearly financial data
 * @returns {number} - The CAGR for profit as a percentage or 0 if insufficient data
 */
export const calculateProfitCAGR = (yearlyData) => {
  if (!yearlyData || yearlyData.length < 2) return 0;

  const validYears = yearlyData.filter(year => 
    year?.financialData?.surplusDeficit || year?.financialData?.netProfit
  );

  if (validYears.length < 2) return 0;

  const firstYear = validYears[0];
  const lastYear = validYears[validYears.length - 1];
  
  const initialValue = firstYear.financialData.surplusDeficit || firstYear.financialData.netProfit;
  const finalValue = lastYear.financialData.surplusDeficit || lastYear.financialData.netProfit;
  
  return calculateCAGR(initialValue, finalValue, validYears.length - 1);
};

/**
 * Calculate the Compound Annual Growth Rate (CAGR) for turnover
 * 
 * @param {Array} yearlyData - Array of yearly financial data
 * @returns {number} - The CAGR for turnover as a percentage or 0 if insufficient data
 */
export const calculateTurnoverCAGR = (yearlyData) => {
  if (!yearlyData || yearlyData.length < 2) return 0;

  const validYears = yearlyData.filter(year => 
    year?.financialData?.turnover
  );

  if (validYears.length < 2) return 0;

  const firstYear = validYears[0];
  const lastYear = validYears[validYears.length - 1];
  
  const initialValue = firstYear.financialData.turnover;
  const finalValue = lastYear.financialData.turnover;
  
  return calculateCAGR(initialValue, finalValue, validYears.length - 1);
};