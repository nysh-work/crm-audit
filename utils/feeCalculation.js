/**
 * Fee Calculation Utilities
 * 
 * This file contains constants and helper functions for fee calculations.
 * You can modify these constants to adjust how fees are calculated.
 */

// Base fee constants for different services (in INR)
export const BASE_FEES = {
  statutoryAudit: 200000,
  ifcTesting: 100000,
  taxAudit: 75000,
  transferPricingCertification: 60000,
  transferPricingDocumentation: 150000,
  incomeTaxReturnFiling: 25000,
  gstAnnualReturnFiling: 40000
};

// Revenue multipliers for scaling fees based on client size
export const REVENUE_MULTIPLIERS = {
  // Revenue in millions
  small: { threshold: 100, factor: 0.8 },
  medium: { threshold: 500, factor: 1.0 },
  large: { threshold: 1000, factor: 1.3 },
  veryLarge: { threshold: Infinity, factor: 1.5 }
};

// Client type multipliers for adjusting fees based on client type
export const CLIENT_TYPE_MULTIPLIERS = {
  list: {
    factor: 1.5,
    description: 'Listed companies have higher regulatory requirements and audit complexity.'
  },
  listed: {
    factor: 1.5,
    description: 'Listed companies have higher regulatory requirements and audit complexity.'
  },
  public: {
    factor: 1.3,
    description: 'Public companies have additional reporting and audit requirements.'
  },
  private: {
    factor: 1.0,
    description: 'Standard fee structure for private companies.'
  },
  smc: {
    factor: 0.8,
    description: 'Small and Medium Companies have simplified audit requirements.'
  },
  llp: {
    factor: 0.9,
    description: 'LLPs have different audit requirements than companies.'
  },
  section8: {
    factor: 0.7,
    description: 'Section 8 companies and trusts often have reduced fees due to their non-profit nature.'
  },
  trust: {
    factor: 0.7,
    description: 'Trusts often have reduced fees due to their non-profit nature.'
  }
};

// Complexity factors for adjusting fees based on client complexity
export const COMPLEXITY_FACTORS = {
  hasComplexGroupStructure: 0.05,
  hasInternationalTransactions: 0.05,
  hasRegulatoryChanges: 0.03,
  branchFactor: 0.01, // per branch, up to a maximum
  maxBranchFactor: 0.1, // maximum adjustment for multiple branches
};

// Growth factors for historical data
export const GROWTH_FACTORS = {
  defaultAnnualIncrease: 0.05, // 5% default increase if we can't calculate from data
  maxGrowthFactor: 0.15      // maximum growth adjustment (15%)
};

/**
 * Determines the revenue size category of a client
 * 
 * @param {number} revenueInMillions - Client's revenue in millions
 * @returns {string} - Size category (small, medium, large, veryLarge)
 */
export const getRevenueCategory = (revenueInMillions) => {
  const revenue = parseFloat(revenueInMillions);
  
  if (revenue < REVENUE_MULTIPLIERS.small.threshold) {
    return 'small';
  } else if (revenue < REVENUE_MULTIPLIERS.medium.threshold) {
    return 'medium';
  } else if (revenue < REVENUE_MULTIPLIERS.large.threshold) {
    return 'large';
  } else {
    return 'veryLarge';
  }
};

/**
 * Calculates a revenue multiplier based on client size
 * 
 * @param {number} revenueInMillions - Client's revenue in millions
 * @returns {number} - Revenue multiplier factor
 */
export const calculateRevenueMultiplier = (revenueInMillions) => {
  const category = getRevenueCategory(revenueInMillions);
  return REVENUE_MULTIPLIERS[category].factor;
};

/**
 * Calculates a client type multiplier
 * 
 * @param {string} clientType - Type of client (list, public, private, smc, llp, section8)
 * @returns {number} - Client type multiplier factor
 */
export const calculateClientTypeMultiplier = (clientType) => {
  return CLIENT_TYPE_MULTIPLIERS[clientType]?.factor || CLIENT_TYPE_MULTIPLIERS.private.factor;
};

/**
 * Calculates a complexity multiplier based on client characteristics
 * 
 * @param {Object} additionalData - Client's complexity characteristics
 * @returns {number} - Complexity multiplier factor
 */
export const calculateComplexityMultiplier = (additionalData) => {
  let factor = 1.0;
  
  if (additionalData.hasComplexGroupStructure) {
    factor += COMPLEXITY_FACTORS.hasComplexGroupStructure;
  }
  
  if (additionalData.hasInternationalTransactions) {
    factor += COMPLEXITY_FACTORS.hasInternationalTransactions;
  }
  
  if (additionalData.hasRegulatoryChanges) {
    factor += COMPLEXITY_FACTORS.hasRegulatoryChanges;
  }
  
  if (additionalData.hasMultipleBranches && additionalData.numberOfBranches > 0) {
    // Add branch factor up to maximum
    const branchAdjustment = Math.min(
      COMPLEXITY_FACTORS.maxBranchFactor,
      additionalData.numberOfBranches * COMPLEXITY_FACTORS.branchFactor
    );
    factor += branchAdjustment;
  }
  
  return factor;
};

/**
 * Calculates growth factor based on historical revenue data
 * 
 * @param {Array} yearlyData - Array of yearly financial data
 * @returns {number} - Growth multiplier factor
 */
export const calculateGrowthFactor = (yearlyData) => {
  // Get valid revenue data
  const revenueData = yearlyData
    .map(year => parseFloat(year.financialData.totalRevenue) || 0)
    .filter(rev => rev > 0);
  
  // Default growth factor
  if (revenueData.length < 2) {
    return 1 + GROWTH_FACTORS.defaultAnnualIncrease;
  }
  
  // Calculate CAGR (Compound Annual Growth Rate)
  const oldestRevenue = revenueData[0];
  const latestRevenue = revenueData[revenueData.length - 1];
  const years = revenueData.length - 1;
  
  if (oldestRevenue <= 0) {
    return 1 + GROWTH_FACTORS.defaultAnnualIncrease;
  }
  
  // Calculate growth rate: (ending/beginning)^(1/years) - 1
  const cagr = Math.pow(latestRevenue / oldestRevenue, 1 / years) - 1;
  
  // Apply reasonable limits to the growth factor
  const growthFactor = Math.max(0, Math.min(cagr, GROWTH_FACTORS.maxGrowthFactor));
  
  return 1 + growthFactor;
};

/**
 * Calculate service-specific adjustments based on client type and service
 * 
 * @param {string} service - Service key
 * @param {Object} additionalData - Client's complexity characteristics
 * @returns {number} - Service-specific multiplier
 */
export const calculateServiceSpecificFactor = (service, additionalData) => {
  let factor = 1.0;
  const clientType = additionalData.clientType || 'private';
  
  // Specific adjustments for certain services
  switch (service) {
    case 'transferPricingCertification':
    case 'transferPricingDocumentation':
      // These services are more complex if there are international transactions
      if (additionalData.hasInternationalTransactions) {
        factor += 0.1;
      }
      // Listed and public companies might have more complex TP requirements
      if (clientType === 'list' || clientType === 'public') {
        factor += 0.05;
      }
      break;
      
    case 'statutoryAudit':
      // Statutory audit is more complex with complex group structure
      if (additionalData.hasComplexGroupStructure) {
        factor += 0.07;
      }
      // Listed companies have additional statutory audit requirements
      if (clientType === 'list') {
        factor += 0.1;
      }
      break;
      
    case 'ifcTesting':
      // IFC testing is more complex with multiple branches
      if (additionalData.hasMultipleBranches) {
        factor += Math.min(0.15, additionalData.numberOfBranches * 0.02);
      }
      // Listed companies have more rigorous IFC requirements
      if (clientType === 'list') {
        factor += 0.15;
      } else if (clientType === 'public') {
        factor += 0.1;
      }
      // SMCs typically have simplified IFC requirements
      if (clientType === 'smc' || clientType === 'section8') {
        factor -= 0.1;
      }
      break;
      
    case 'taxAudit':
      // Adjust tax audit based on client type
      if (clientType === 'list' || clientType === 'public') {
        factor += 0.05;
      } else if (clientType === 'section8') {
        factor -= 0.1; // Non-profits often have tax exemptions
      }
      break;
  }
  
  return factor;
};

/**
 * Calculates the historical average fee for a specific service
 * 
 * @param {Array} yearlyData - Array of yearly financial data
 * @param {string} service - Service key
 * @returns {number} - Average historical fee or 0 if no data
 */
export const calculateHistoricalAverageFee = (yearlyData, service) => {
  let validYears = 0;
  let totalFee = 0;
  
  yearlyData.forEach(year => {
    if (year.services[service].selected && year.services[service].fee) {
      validYears += 1;
      totalFee += parseFloat(year.services[service].fee) || 0;
    }
  });
  
  if (validYears === 0) {
    return 0;
  }
  
  return totalFee / validYears;
};

/**
 * Main fee calculation function
 * 
 * @param {Array} yearlyData - Array of yearly financial data
 * @param {Object} additionalData - Client's complexity characteristics  
 * @returns {Object} - Calculated fees for each service
 */
export const calculateFees = (yearlyData, additionalData) => {
  const proposedFees = {};
  const latestYearData = yearlyData[yearlyData.length - 1];
  const clientType = additionalData.clientType || 'private';
  
  // Calculate base factors
  const revenueMultiplier = calculateRevenueMultiplier(
    latestYearData.financialData.totalRevenue || 0
  );
  const clientTypeMultiplier = calculateClientTypeMultiplier(clientType);
  const complexityMultiplier = calculateComplexityMultiplier(additionalData);
  const growthFactor = calculateGrowthFactor(yearlyData);
  
  // Calculate fee for each service
  Object.keys(latestYearData.services).forEach(service => {
    // Get historical average fee for this service
    const historicalFee = calculateHistoricalAverageFee(yearlyData, service);
    
    // Calculate service-specific adjustments
    const serviceFactor = calculateServiceSpecificFactor(service, additionalData);
    
    // Calculate proposed fee
    let calculatedFee;
    
    if (historicalFee > 0) {
      // If we have historical data, use it as a base
      calculatedFee = historicalFee * growthFactor * complexityMultiplier * serviceFactor;
    } else {
      // Otherwise use base fees
      calculatedFee = BASE_FEES[service] * revenueMultiplier * clientTypeMultiplier * complexityMultiplier * serviceFactor;
    }
    
    // Store rounded fee
    proposedFees[service] = Math.round(calculatedFee);
  });
  
  // Calculate total
  proposedFees.total = Object.entries(proposedFees)
    .filter(([key, _]) => key !== 'total')
    .reduce((sum, [_, fee]) => sum + fee, 0);
  
  return proposedFees;
}; 