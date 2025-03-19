import React from 'react';
import { useAuditForm, CLIENT_TYPES } from '../../context/AuditFormContext';
import { calculateFee } from '../../utils/feeCalculator';
import { FiPrinter, FiDownload } from 'react-icons/fi';

const Summary = () => {
  const { yearlyData, selectedServices, complexityFactors, additionalData } = useAuditForm();
  
  // Get client type from additionalData to ensure we're accessing the correct value
  const clientType = additionalData?.clientType || 'private';
  
  // Calculate the proposed fee based on the form data
  const proposedFee = calculateFee(yearlyData, selectedServices, complexityFactors, clientType);
  
  // Format a number for display
  const formatNumber = (num) => {
    if (num === '' || num === undefined) return '-';
    return parseFloat(num).toLocaleString('en-IN');
  };
  
  // Create a printable version of the page
  const handlePrint = () => {
    window.print();
  };
  
  // Get client type display name
  const getClientTypeDisplay = () => {
    if (!clientType) return 'Not Specified';
    
    // Use CLIENT_TYPES from context to get the display name safely
    const clientTypeObj = CLIENT_TYPES.find(type => type.id === clientType);
    if (clientTypeObj) {
      return clientTypeObj.name;
    }
    
    // Fallback to basic capitalization
    return clientType.charAt(0).toUpperCase() + clientType.slice(1);
  };
  
  // Ensure there's valid data to display
  const hasFinancialData = Array.isArray(yearlyData) && yearlyData.length > 0;
  const hasSelectedServices = Array.isArray(selectedServices) && selectedServices.length > 0;
  const hasComplexityFactors = Array.isArray(complexityFactors) && complexityFactors.length > 0;
  
  return (
    <div className="space-y-6" id="summary-page">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Fee Proposal Summary</h2>
        <div className="flex space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiPrinter /> Print
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FiDownload /> Export
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-medium mb-4 border-b pb-2">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Client Type</p>
            <p className="font-medium">{getClientTypeDisplay()}</p>
          </div>
        </div>
      </div>
      
      {hasFinancialData && (
        <div className="bg-gray-50 p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Financial Information</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financial Parameter</th>
                  {yearlyData.map((yearData, index) => (
                    <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {yearData.yearLabel || `Year ${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Total Revenue (₹ in Lakhs)</td>
                  {yearlyData.map((yearData, index) => (
                    <td key={index} className="px-4 py-3 text-sm text-gray-900">
                      {formatNumber(yearData.financialData.totalRevenue)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Revenue from Operations (₹ in Lakhs)</td>
                  {yearlyData.map((yearData, index) => (
                    <td key={index} className="px-4 py-3 text-sm text-gray-900">
                      {formatNumber(yearData.financialData.revenueFromOperations)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Total Assets (₹ in Lakhs)</td>
                  {yearlyData.map((yearData, index) => (
                    <td key={index} className="px-4 py-3 text-sm text-gray-900">
                      {formatNumber(yearData.financialData.totalAssets)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Surplus/Deficit (₹ in Lakhs)</td>
                  {yearlyData.map((yearData, index) => (
                    <td key={index} className="px-4 py-3 text-sm text-gray-900">
                      {formatNumber(yearData.financialData.surplusDeficit)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Employee Benefit Expense (₹ in Lakhs)</td>
                  {yearlyData.map((yearData, index) => (
                    <td key={index} className="px-4 py-3 text-sm text-gray-900">
                      {formatNumber(yearData.financialData.employeeBenefitExpense)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Borrowings (₹ in Lakhs)</td>
                  {yearlyData.map((yearData, index) => (
                    <td key={index} className="px-4 py-3 text-sm text-gray-900">
                      {formatNumber(yearData.financialData.borrowings)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-medium mb-4 border-b pb-2">Selected Services</h3>
        {hasSelectedServices ? (
          <ul className="list-disc ml-6 text-sm">
            {selectedServices.map((service, index) => (
              <li key={index} className="py-1">{service}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No services selected.</p>
        )}
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-medium mb-4 border-b pb-2">Complexity Factors</h3>
        {hasComplexityFactors ? (
          <ul className="list-disc ml-6 text-sm">
            {complexityFactors.map((factor, index) => (
              <li key={index} className="py-1">{factor}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No complexity factors selected.</p>
        )}
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 shadow">
        <h3 className="text-lg font-medium mb-4 border-b border-blue-200 pb-2 text-blue-800">Proposed Fee</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Based on your information, we propose the following audit fee:</p>
          </div>
          <div className="text-2xl font-bold text-blue-900">₹ {formatNumber(proposedFee)}</div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Note: This fee is indicative and subject to change based on detailed scope assessment and engagement specifics.
        </p>
      </div>
    </div>
  );
};

export default Summary; 