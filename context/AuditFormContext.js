import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateFees } from '../utils/feeCalculation';
import { calculateCAGRBasedFee } from '../utils/cagr-feeCalculation';
import { loadFromLocalStorage, saveToLocalStorage, clearLocalStorage } from '../utils/localStorage';

// Client type options
export const CLIENT_TYPES = [
  { id: 'list', name: 'List Company' },
  { id: 'public', name: 'Public Company' },
  { id: 'private', name: 'Private Company' },
  { id: 'smc', name: 'SMC Company' },
  { id: 'llp', name: 'LLP' },
  { id: 'section8', name: 'Section 8 Company or Trust' }
];

// Initialize empty data structure for 4 years
const initializeYearlyData = () => {
  const years = [];
  
  // Create data for 4 years with generic labels
  for (let i = 4; i > 0; i--) {
    years.push({
      yearLabel: `Year ${5-i}`, // Year 1, Year 2, etc.
      financialData: {
        revenueFromOperations: '',
        totalRevenue: '',
        surplusDeficit: '',
        totalAssets: '',
        employeeBenefitExpense: '',
        borrowings: '', // New field for borrowings
      },
      services: {
        statutoryAudit: { selected: false, fee: '' },
        ifcTesting: { selected: false, fee: '' },
        taxAudit: { selected: false, fee: '' },
        transferPricingCertification: { selected: false, fee: '' },
        transferPricingDocumentation: { selected: false, fee: '' },
        incomeTaxReturnFiling: { selected: false, fee: '' },
        gstAnnualReturnFiling: { selected: false, fee: '' },
      }
    });
  }
  
  return years;
};

// Initialize additional questions
const initializeAdditionalData = () => {
  return {
    clientType: 'private', // Default to private company
    hasComplexGroupStructure: false,
    hasInternationalTransactions: false,
    hasRegulatoryChanges: false,
    hasMultipleBranches: false,
    numberOfBranches: 0,
    additionalNotes: '',
    inflationRate: '', // New field for inflation rate
    // New client and personnel information
    clientInfo: {
      clientName: '',
      clientId: null,
      CIN: '',
      PAN: '',
      paidUpCapital: '',
      latestTurnover: '',
      borrowings: '',
      netProfit: '',
      sector: ''
    },
    personnelInfo: {
      engagementPartnerId: null,
      auditManagerId: null,
      concurringPartnerId: null
    }
  };
};

// Initialize proposed fee
const initializeProposedFee = () => {
  return {
    statutoryAudit: '',
    ifcTesting: '',
    taxAudit: '',
    transferPricingCertification: '',
    transferPricingDocumentation: '',
    incomeTaxReturnFiling: '',
    gstAnnualReturnFiling: '',
    total: 0,
    explanation: '',
    metrics: {
      revenueCAGR: 0,
      profitCAGR: 0,
      historicalFeeGrowth: 0,
      inflationRate: 0
    }
  };
};

// Create the context
const AuditFormContext = createContext();

// Context provider component
export const AuditFormProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [yearlyData, setYearlyData] = useState(initializeYearlyData());
  const [additionalData, setAdditionalData] = useState(initializeAdditionalData());
  const [proposedFee, setProposedFee] = useState(initializeProposedFee());
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = () => {
      const savedData = loadFromLocalStorage();
      if (savedData) {
        if (savedData.yearlyData) setYearlyData(savedData.yearlyData);
        if (savedData.additionalData) {
          // Ensure the client type is valid before setting
          const safeAdditionalData = {...savedData.additionalData};
          if (!safeAdditionalData.clientType || 
              !CLIENT_TYPES.some(type => type.id === safeAdditionalData.clientType)) {
            safeAdditionalData.clientType = 'private'; // Safe default
          }
          
          // Initialize new fields if they don't exist
          if (!safeAdditionalData.inflationRate) safeAdditionalData.inflationRate = '';
          if (!safeAdditionalData.clientInfo) {
            safeAdditionalData.clientInfo = {
              clientName: '',
              clientId: null,
              CIN: '',
              PAN: '',
              paidUpCapital: '',
              latestTurnover: '',
              borrowings: '',
              netProfit: '',
              sector: ''
            };
          }
          if (!safeAdditionalData.personnelInfo) {
            safeAdditionalData.personnelInfo = {
              engagementPartnerId: null,
              auditManagerId: null,
              concurringPartnerId: null
            };
          }
          
          setAdditionalData(safeAdditionalData);
        }
        if (savedData.proposedFee) setProposedFee(savedData.proposedFee);
        if (savedData.currentStep) setCurrentStep(savedData.currentStep);
      }
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoading) return; // Skip initial render
    
    const saveData = () => {
      saveToLocalStorage({
        yearlyData,
        additionalData,
        proposedFee,
        currentStep
      });
    };
    
    saveData();
  }, [yearlyData, additionalData, proposedFee, currentStep, isLoading]);
  
  // Update financial data for a specific year
  const updateFinancialData = (yearIndex, field, value) => {
    const updatedYearlyData = [...yearlyData];
    updatedYearlyData[yearIndex].financialData[field] = value;
    setYearlyData(updatedYearlyData);
  };
  
  // Update year label for a specific year
  const updateYearLabel = (yearIndex, value) => {
    const updatedYearlyData = [...yearlyData];
    updatedYearlyData[yearIndex].yearLabel = value;
    setYearlyData(updatedYearlyData);
  };
  
  // Update service selection and fee for a specific year
  const updateServiceData = (yearIndex, service, field, value) => {
    const updatedYearlyData = [...yearlyData];
    updatedYearlyData[yearIndex].services[service][field] = value;
    setYearlyData(updatedYearlyData);
  };
  
  // Update additional data
  const updateAdditionalData = (field, value) => {
    setAdditionalData({
      ...additionalData,
      [field]: value
    });
  };
  
  // Update client information
  const updateClientInfo = (field, value) => {
    setAdditionalData({
      ...additionalData,
      clientInfo: {
        ...additionalData.clientInfo,
        [field]: value
      }
    });
  };
  
  // Set entire client info at once (e.g., when selecting from dropdown)
  const setClientInfo = (clientInfo) => {
    setAdditionalData({
      ...additionalData,
      clientInfo
    });
  };
  
  // Update personnel information
  const updatePersonnelInfo = (field, value) => {
    setAdditionalData({
      ...additionalData,
      personnelInfo: {
        ...additionalData.personnelInfo,
        [field]: value
      }
    });
  };
  
  // Update client type
  const updateClientType = (clientType) => {
    // Validate that clientType is one of the available options
    if (CLIENT_TYPES.some(type => type.id === clientType)) {
      updateAdditionalData('clientType', clientType);
    } else {
      console.warn(`Invalid client type: ${clientType}. Defaulting to 'private'.`);
      updateAdditionalData('clientType', 'private');
    }
  };
  
  // Update inflation rate
  const updateInflationRate = (value) => {
    // Validate that the input is a valid percentage
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      updateAdditionalData('inflationRate', value);
    }
  };
  
  // Calculate proposed fee using CAGR-based approach
  const calculateProposedFee = () => {
    // Convert inflation rate from percentage to decimal
    const inflationRate = additionalData.inflationRate 
      ? parseFloat(additionalData.inflationRate) / 100 
      : 0;
      
    // Calculate fee using new CAGR-based approach
    const cagrBasedResult = calculateCAGRBasedFee(yearlyData, inflationRate);
    
    // If CAGR approach doesn't produce a result, fall back to old method
    if (cagrBasedResult.proposedFee <= 0) {
      const oldCalculatedFees = calculateFees(yearlyData, additionalData);
      setProposedFee({
        ...oldCalculatedFees,
        explanation: "Insufficient historical data for CAGR-based calculation. Using traditional method."
      });
      return;
    }
    
    // Update proposed fee with CAGR-based result
    const updatedFee = { ...initializeProposedFee() };
    updatedFee.statutoryAudit = cagrBasedResult.proposedFee;
    
    // Update other fees based on appropriate proportions if historical data exists
    const latestYearWithFees = yearlyData
      .filter(year => 
        year.services.statutoryAudit.selected && 
        parseFloat(year.services.statutoryAudit.fee) > 0
      )
      .sort((a, b) => b.yearLabel.localeCompare(a.yearLabel))[0];
      
    if (latestYearWithFees) {
      const services = latestYearWithFees.services;
      const statutoryAuditFee = parseFloat(services.statutoryAudit.fee);
      
      // If other services have fees, calculate their proportion relative to statutory audit
      if (statutoryAuditFee > 0) {
        Object.keys(services).forEach(service => {
          if (service !== 'statutoryAudit' && services[service].selected && services[service].fee) {
            const proportion = parseFloat(services[service].fee) / statutoryAuditFee;
            updatedFee[service] = Math.round(cagrBasedResult.proposedFee * proportion);
          }
        });
      }
    }
    
    // Calculate total
    updatedFee.total = Object.entries(updatedFee)
      .filter(([key, _]) => key !== 'total' && key !== 'explanation' && key !== 'metrics')
      .reduce((sum, [_, fee]) => sum + (parseFloat(fee) || 0), 0);
      
    // Add explanation and metrics
    updatedFee.explanation = cagrBasedResult.explanation;
    updatedFee.metrics = cagrBasedResult.metrics;
    
    setProposedFee(updatedFee);
  };
  
  // Update proposed fee manually
  const updateProposedFee = (service, value) => {
    const updatedFee = { ...proposedFee };
    updatedFee[service] = parseFloat(value) || 0;
    
    // Recalculate total
    updatedFee.total = Object.entries(updatedFee)
      .filter(([key, _]) => key !== 'total' && key !== 'explanation' && key !== 'metrics')
      .reduce((sum, [_, fee]) => sum + (parseFloat(fee) || 0), 0);
      
    setProposedFee(updatedFee);
  };
  
  // Next step handler
  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };
  
  // Previous step handler
  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  // Reset form and clear localStorage
  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
      setCurrentStep(1);
      setYearlyData(initializeYearlyData());
      setAdditionalData(initializeAdditionalData());
      setProposedFee(initializeProposedFee());
      clearLocalStorage();
    }
  };
  
  // Export form data as JSON
  const exportData = () => {
    const data = {
      clientInfo: additionalData.clientInfo,
      personnelInfo: additionalData.personnelInfo,
      clientType: additionalData.clientType,
      yearlyData,
      additionalData,
      proposedFee,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-fee-data-${additionalData.clientInfo.clientName || 'client'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Validate data based on current step
  const isDataValid = (step) => {
    switch (step) {
      case 1: // Client Info
        // Require at least client name and engagement partner
        return (
          additionalData.clientInfo && 
          additionalData.clientInfo.clientName && 
          additionalData.clientInfo.clientName.trim() !== '' &&
          additionalData.personnelInfo && 
          additionalData.personnelInfo.engagementPartnerId
        );
      
      case 2: // Financial Data
        // At least one year should have turnover and profit data
        return Object.values(yearlyData).some(
          yearData => 
            yearData && 
            yearData.financialData && 
            yearData.financialData.revenueFromOperations && 
            yearData.financialData.netProfit &&
            parseFloat(yearData.financialData.revenueFromOperations) > 0 &&
            parseFloat(yearData.financialData.netProfit) > 0
        );
      
      case 3: // Services
        // At least one service should be selected
        return Object.values(yearlyData).some(
          year => Object.values(year.services).some(
            service => service.selected === true
          )
        );
      
      case 4: // Additional Questions
        // All complexity factors should have a value
        const hasAllFactors = Object.values(additionalData).every(
          factor => factor !== null && factor !== ''
        );
        return hasAllFactors;
      
      case 5: // Summary
        // No validation needed for summary
        return true;
      
      default:
        return false;
    }
  };
  
  // Context value
  const value = {
    currentStep,
    yearlyData,
    additionalData,
    proposedFee,
    isLoading,
    updateFinancialData,
    updateYearLabel,
    updateServiceData,
    updateAdditionalData,
    updateClientInfo,
    setClientInfo,
    updatePersonnelInfo,
    updateClientType,
    updateInflationRate,
    calculateProposedFee,
    updateProposedFee,
    goToNextStep,
    goToPreviousStep,
    resetForm,
    exportData,
    isDataValid
  };
  
  return (
    <AuditFormContext.Provider value={value}>
      {children}
    </AuditFormContext.Provider>
  );
};

// Custom hook to use the context
export const useAuditForm = () => {
  const context = useContext(AuditFormContext);
  if (!context) {
    throw new Error('useAuditForm must be used within an AuditFormProvider');
  }
  return context;
}; 