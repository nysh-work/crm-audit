import React, { useEffect, useState } from 'react';
import { useAuditForm } from '../../context/AuditFormContext';
import { CLIENT_TYPES } from '../../context/AuditFormContext';
import { formatCurrency, formatNumber } from '../../utils/helpers';
import { FiInfo, FiDollarSign, FiBriefcase, FiHelpCircle, FiUser, FiUsers } from 'react-icons/fi';
import { getPersonnelById } from '../../utils/mockDatabase';
import { calculateProfitCAGR } from '../../utils/cagr-feeCalculation';

// Remove or comment out the CLIENT_TYPE_MULTIPLIERS import if it doesn't exist
// import { CLIENT_TYPE_MULTIPLIERS } from '../../utils/feeCalculation';

const SummaryForm = () => {
  const { 
    yearlyData, 
    additionalData, 
    proposedFee, 
    calculateProposedFee,
    updateProposedFee,
    exportData,
    clientType
  } = useAuditForm();
  
  // Local state for mapped data structures
  const [financialData, setFinancialData] = useState({});
  const [selectedServices, setSelectedServices] = useState({});
  const [complexityFactors, setComplexityFactors] = useState({});
  
  const { clientInfo, personnelInfo } = additionalData || {};
  
  // Map yearlyData to financialData and selectedServices
  useEffect(() => {
    if (yearlyData && Array.isArray(yearlyData)) {
      // Map financial data
      const mappedFinancialData = {};
      const mappedServices = {};
      
      yearlyData.forEach((year, index) => {
        if (year && year.financialData) {
          const yearKey = `year${index}`;
          mappedFinancialData[yearKey] = {
            yearLabel: year.yearLabel || `Year ${index + 1}`,
            turnover: year.financialData.totalRevenue || year.financialData.revenueFromOperations || 0,
            profit: year.financialData.surplusDeficit || year.financialData.netProfit || 0,
            borrowings: year.financialData.borrowings || 0
          };
        }
        
        // Map services
        if (year && year.services) {
          Object.keys(year.services).forEach(service => {
            if (year.services[service].selected) {
              mappedServices[service] = true;
            }
          });
        }
      });
      
      setFinancialData(mappedFinancialData);
      setSelectedServices(mappedServices);
    }
    
    // Map complexity factors
    if (additionalData) {
      const factors = {};
      if (additionalData.hasComplexGroupStructure !== undefined) {
        factors['Complex Group Structure'] = additionalData.hasComplexGroupStructure ? 'High' : 'Low';
      }
      if (additionalData.hasInternationalTransactions !== undefined) {
        factors['International Transactions'] = additionalData.hasInternationalTransactions ? 'High' : 'Low';
      }
      if (additionalData.hasRegulatoryChanges !== undefined) {
        factors['Regulatory Changes'] = additionalData.hasRegulatoryChanges ? 'High' : 'Low';
      }
      if (additionalData.hasMultipleBranches !== undefined) {
        factors['Multiple Branches'] = additionalData.hasMultipleBranches ? 'High' : 'Low';
      }
      
      setComplexityFactors(factors);
    }
  }, [yearlyData, additionalData]);
  
  // Calculate fees when component mounts or when yearlyData changes
  useEffect(() => {
    if (calculateProposedFee && yearlyData && Array.isArray(yearlyData)) {
      calculateProposedFee();
    }
  }, [calculateProposedFee, yearlyData]);
  
  // Handle fee input change
  const handleFeeChange = (service, value) => {
    // Validate that the input is a number
    if (value === '' || (!isNaN(value) && value >= 0)) {
      updateProposedFee(service, value);
    }
  };
  
  // Get service display name
  const getServiceDisplayName = (serviceKey) => {
    const serviceNames = {
      statutoryAudit: 'Statutory Audit',
      ifcTesting: 'IFC Testing',
      taxAudit: 'Tax Audit',
      transferPricingCertification: 'Transfer Pricing Certification',
      transferPricingDocumentation: 'Transfer Pricing Documentation',
      incomeTaxReturnFiling: 'Income Tax Return Filing',
      gstAnnualReturnFiling: 'GST Annual Return Filing',
      total: 'Total Proposed Fee'
    };
    return serviceNames[serviceKey] || serviceKey;
  };
  
  // Get client type display name
  const getClientTypeName = (clientTypeId) => {
    const clientTypeObj = CLIENT_TYPES.find(type => type.id === clientTypeId);
    return clientTypeObj ? clientTypeObj.name : 'Unknown';
  };
  
  // Calculate yearly growth rate for revenue
  const calculateRevenueGrowth = () => {
    if (!yearlyData || !Array.isArray(yearlyData)) return 'N/A';
    
    const validYears = yearlyData.filter(year => 
      year?.financialData?.totalRevenue && parseFloat(year.financialData.totalRevenue) > 0
    );
    
    if (validYears.length < 2) return 'N/A';
    
    const oldestYear = validYears[0];
    const latestYear = validYears[validYears.length - 1];
    
    const oldestRevenue = parseFloat(oldestYear.financialData.totalRevenue);
    const latestRevenue = parseFloat(latestYear.financialData.totalRevenue);
    
    if (oldestRevenue <= 0) return 'N/A';
    
    const growthRate = ((latestRevenue - oldestRevenue) / oldestRevenue) * 100;
    return growthRate.toFixed(2) + '%';
  };
  
  // Get the latest year label
  const getLatestYearLabel = () => {
    if (!financialData) return '';
    const yearKeys = Object.keys(financialData);
    if (yearKeys.length === 0) return '';
    return financialData[yearKeys[0]]?.yearLabel || '';
  };
  
  // Helper function to get personnel name by ID
  const getPersonnelNameById = (id) => {
    if (!id) return 'Not selected';
    const person = getPersonnelById(id);
    return person ? person.name : 'Unknown';
  };
  
  // Check if we have any financial data to show
  const hasFinancialData = financialData && Object.keys(financialData).length > 0;
  
  // Check if we have any services to show
  const hasServices = selectedServices && Object.keys(selectedServices).length > 0;
  
  // Check if we have any complexity factors to show
  const hasComplexityFactors = complexityFactors && Object.keys(complexityFactors).length > 0;
  
  // Check if we need to add a default fee calculation
  const needsDefaultFee = !proposedFee || 
                         (!proposedFee.baseMethod && !proposedFee.cagrMethod && !proposedFee.recommended);
  
  // Default fee calculation if needed
  const defaultFee = needsDefaultFee ? {
    baseMethod: 250000,  // ₹2,50,000 as default
    cagrMethod: 275000,  // ₹2,75,000 as default
    recommended: 250000  // ₹2,50,000 as default
  } : {};
  
  // Combined fee object
  const displayFee = {
    ...proposedFee,
    ...defaultFee
  };

  const profitCAGR = React.useMemo(() => {
    if (!yearlyData || !Array.isArray(yearlyData)) return 0;
    return calculateProfitCAGR(yearlyData);
  }, [yearlyData]);

  return (
    <div className="space-y-8">
      {/* Client Information */}
      <div className="border rounded-lg p-6 bg-gray-50 shadow-sm">
        <div className="flex items-center mb-4">
          <FiUser className="text-blue-600 w-5 h-5 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Client Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Client Name</p>
            <p className="text-base font-semibold">{clientInfo?.clientName || 'Not provided'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">CIN</p>
            <p className="text-base">{clientInfo?.CIN || 'Not provided'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">PAN</p>
            <p className="text-base">{clientInfo?.PAN || 'Not provided'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Sector</p>
            <p className="text-base">{clientInfo?.sector || 'Not provided'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Client Type</p>
            <p className="text-base font-semibold">{getClientTypeName(clientType) || 'Not selected'}</p>
          </div>
        </div>
      </div>
      
      {/* Engagement Personnel */}
      <div className="border rounded-lg p-6 bg-gray-50 shadow-sm">
        <div className="flex items-center mb-4">
          <FiUsers className="text-blue-600 w-5 h-5 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Engagement Personnel</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Engagement Partner</p>
            <p className="text-base font-semibold">{getPersonnelNameById(personnelInfo?.engagementPartnerId)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Audit Manager</p>
            <p className="text-base">{getPersonnelNameById(personnelInfo?.auditManagerId)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Concurring Partner</p>
            <p className="text-base">{getPersonnelNameById(personnelInfo?.concurringPartnerId)}</p>
          </div>
        </div>
      </div>
      
      {/* Financial Information */}
      {hasFinancialData && (
        <div className="border rounded-lg p-6 bg-gray-50 shadow-sm">
          <div className="flex items-center mb-4">
            <FiDollarSign className="text-blue-600 w-5 h-5 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Financial Information</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                  {Object.keys(financialData).map(year => (
                    <th key={year} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {financialData[year]?.yearLabel || year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-700">Turnover (₹ in Lakhs)</td>
                  {Object.keys(financialData).map(year => (
                    <td key={year} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(financialData[year]?.turnover || 0)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-700">Profit (₹ in Lakhs)</td>
                  {Object.keys(financialData).map(year => (
                    <td key={year} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(financialData[year]?.profit || 0)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-700">Borrowings (₹ in Lakhs)</td>
                  {Object.keys(financialData).map(year => (
                    <td key={year} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(financialData[year]?.borrowings || 0)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Financial Analysis (CAGR)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Turnover Growth</p>
                <p className="text-lg font-semibold">{additionalData?.financialAnalysis?.turnoverCAGR?.toFixed(2) || '5.5'}%</p>
              </div>
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Profit Growth</p>
                <p className="text-lg font-semibold">{profitCAGR.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Services */}
      {hasServices && (
        <div className="border rounded-lg p-6 bg-gray-50 shadow-sm">
          <div className="flex items-center mb-4">
            <FiBriefcase className="text-blue-600 w-5 h-5 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Selected Services</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(selectedServices).map(service => 
              selectedServices[service] ? (
                <div key={service} className="flex items-center space-x-2 bg-blue-50 p-3 rounded-md">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">{getServiceDisplayName(service)}</span>
                </div>
              ) : null
            )}
            
            {/* Display default service if no services are selected */}
            {Object.keys(selectedServices).length === 0 && (
              <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-md">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700">Statutory Audit</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Complexity Factors */}
      {hasComplexityFactors && (
        <div className="border rounded-lg p-6 bg-gray-50 shadow-sm">
          <div className="flex items-center mb-4">
            <FiHelpCircle className="text-blue-600 w-5 h-5 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Complexity Factors</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(complexityFactors).map(factor => (
              <div key={factor} className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                <span className="text-sm text-gray-700">{factor}</span>
                <span className={`font-semibold ${complexityFactors[factor] === 'High' ? 'text-red-600' : complexityFactors[factor] === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {complexityFactors[factor]}
                </span>
              </div>
            ))}
            
            {/* Display default complexity factor if none exist */}
            {Object.keys(complexityFactors).length === 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                <span className="text-sm text-gray-700">Standard Complexity</span>
                <span className="font-semibold text-green-600">Medium</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Proposed Fee */}
      <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50 shadow-md">
        <div className="flex items-center mb-4">
          <FiInfo className="text-blue-600 w-6 h-6 mr-2" />
          <h3 className="text-xl font-bold text-gray-800">Proposed Audit Fee</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Base Method Calculation</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(displayFee?.baseMethod || 0)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">CAGR Method Calculation</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(displayFee?.cagrMethod || 0)}</p>
          </div>
          
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500">Recommended Fee Range</p>
            <div className="bg-white p-4 rounded-lg border border-blue-200 mt-2">
              <p className="text-3xl font-bold text-blue-800">{formatCurrency(displayFee?.recommended || 0)}</p>
              <p className="text-sm text-gray-500 mt-1">
                Based on {getLatestYearLabel() || 'latest'} financial data, selected services, and complexity factors
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Note:</span> This is a proposed fee based on the information provided. 
            The final fee may vary based on additional factors and firm policies. Consider this as a starting point for negotiation.
          </p>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={calculateProposedFee}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Recalculate Proposed Fees
        </button>
        
        <div className="space-x-2">
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Print Summary
          </button>
          
          <button
            onClick={exportData}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Export Data (JSON)
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryForm;