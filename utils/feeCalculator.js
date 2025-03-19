// Import the CLIENT_TYPE_MULTIPLIERS from feeCalculation.js
import { CLIENT_TYPE_MULTIPLIERS } from './feeCalculation';

// Calculate the audit fee based on financial data, selected services, and complexity factors
export const calculateFee = (yearlyData, selectedServices, complexityFactors, clientType) => {
  try {
    // Safety check - ensure we have valid arrays and values
    if (!Array.isArray(yearlyData) || yearlyData.length === 0) {
      return 0;
    }
    
    if (!Array.isArray(selectedServices)) {
      selectedServices = [];
    }
    
    if (!Array.isArray(complexityFactors)) {
      complexityFactors = [];
    }
    
    // Ensure clientType is a string or set default
    const safeClientType = typeof clientType === 'string' ? clientType : 'private';
    
    // Get the most recent year's data (first item in the array)
    const latestYearData = yearlyData[0]?.financialData;
    
    if (!latestYearData) {
      return 0;
    }
    
    // Base fee calculation based on total revenue and assets (all values in lakhs)
    const totalRevenue = parseFloat(latestYearData.totalRevenue) || 0;
    const totalAssets = parseFloat(latestYearData.totalAssets) || 0;
    const borrowings = parseFloat(latestYearData.borrowings) || 0;
    
    // Progressive fee structure based on revenue
    let baseFee = 0;
    if (totalRevenue <= 500) {
      baseFee = totalRevenue * 0.005;
    } else if (totalRevenue <= 2000) {
      baseFee = 2.5 + (totalRevenue - 500) * 0.0035;
    } else if (totalRevenue <= 10000) {
      baseFee = 7.75 + (totalRevenue - 2000) * 0.002;
    } else {
      baseFee = 23.75 + (totalRevenue - 10000) * 0.0015;
    }
    
    // Add fee component based on total assets
    let assetsFee = totalAssets * 0.0005;
    
    // Add fee component based on borrowings
    let borrowingsFee = borrowings * 0.001;
    
    // Apply client type multiplier
    let clientTypeMultiplier = 1.0;
    
    // Safely access client type
    if (safeClientType) {
      const clientTypeLower = safeClientType.toLowerCase();
      
      // Use the CLIENT_TYPE_MULTIPLIERS constant from feeCalculation.js
      clientTypeMultiplier = CLIENT_TYPE_MULTIPLIERS[clientTypeLower]?.factor || 1.0;
    }
    
    // Calculate service fees
    const serviceFees = calculateServiceFees(selectedServices, totalRevenue, safeClientType);
    
    // Apply complexity factors
    const complexityMultiplier = calculateComplexityMultiplier(complexityFactors);
    
    // Calculate total fee
    const totalFee = (baseFee + assetsFee + borrowingsFee + serviceFees) * clientTypeMultiplier * complexityMultiplier;
    
    // Round to nearest thousand
    return Math.round(totalFee / 1) * 1;
  } catch (error) {
    console.error('Error calculating fee:', error);
    return 0;
  }
};

// Calculate fees for selected services
const calculateServiceFees = (selectedServices, totalRevenue, clientType) => {
  if (!selectedServices || selectedServices.length === 0) {
    return 0;
  }
  
  // Safe client type check
  const safeClientType = clientType ? clientType.toLowerCase() : 'private';
  
  let serviceFees = 0;
  
  selectedServices.forEach(service => {
    switch(service) {
      case 'Tax Audit':
        serviceFees += totalRevenue * 0.001;
        // Additional multiplier for public companies on tax audit
        if (safeClientType === 'public' || safeClientType === 'list' || safeClientType === 'listed') {
          serviceFees += totalRevenue * 0.0005;
        }
        break;
      case 'GST Audit':
        serviceFees += totalRevenue * 0.0015;
        break;
      case 'Internal Financial Controls':
        // Higher IFC fees for listed companies
        if (safeClientType === 'list' || safeClientType === 'listed') {
          serviceFees += totalRevenue * 0.002;
        } else {
          serviceFees += totalRevenue * 0.001;
        }
        break;
      case 'Consolidated Financial Statements':
        serviceFees += 1.5 * (totalRevenue * 0.0005);
        break;
      case 'Transfer Pricing Certification':
        serviceFees += totalRevenue * 0.001;
        break;
      default:
        serviceFees += totalRevenue * 0.0005; // Default fee for other services
    }
  });
  
  return serviceFees;
};

// Calculate complexity multiplier based on selected factors
const calculateComplexityMultiplier = (complexityFactors) => {
  if (!complexityFactors || complexityFactors.length === 0) {
    return 1.0;
  }
  
  let baseMultiplier = 1.0;
  
  complexityFactors.forEach(factor => {
    switch(factor) {
      case 'Multiple Locations':
        baseMultiplier += 0.15;
        break;
      case 'Complex Revenue Recognition':
        baseMultiplier += 0.10;
        break;
      case 'Significant Judgments Required':
        baseMultiplier += 0.12;
        break;
      case 'First-Time Audit':
        baseMultiplier += 0.20;
        break;
      case 'Multiple Business Segments':
        baseMultiplier += 0.15;
        break;
      case 'Foreign Currency Transactions':
        baseMultiplier += 0.08;
        break;
      case 'Related Party Transactions':
        baseMultiplier += 0.07;
        break;
      default:
        baseMultiplier += 0.05; // Default for other factors
    }
  });
  
  // Cap the multiplier at 2.0 (100% increase) to avoid excessive fees
  return Math.min(baseMultiplier, 2.0);
}; 