import React from 'react';
import { useAuditForm } from '../../context/AuditFormContext';
import ClientTypeSelector from '../ClientTypeSelector';

const FinancialDataForm = () => {
  const { yearlyData, updateFinancialData, updateYearLabel } = useAuditForm();
  
  // Handle input change
  const handleInputChange = (yearIndex, field, value) => {
    // Validate that the input is a number
    if (value === '' || (!isNaN(value) && value >= 0)) {
      updateFinancialData(yearIndex, field, value);
    }
  };

  // Handle year label change
  const handleYearLabelChange = (yearIndex, value) => {
    updateYearLabel(yearIndex, value);
  };

  // Format number with commas for display
  const formatNumber = (num) => {
    if (num === '') return '';
    return parseFloat(num).toLocaleString('en-IN');
  };

  return (
    <div className="space-y-8">
      {/* Client Type Selection */}
      <div className="border rounded-lg p-6 mb-6 bg-gray-50 shadow-sm">
        <h3 className="text-lg font-medium mb-4 text-gray-800">Client Classification</h3>
        <ClientTypeSelector />
      </div>
      
      <div className="text-sm text-gray-600 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="font-medium text-blue-800 mb-2">Financial Data Instructions</p>
        <p>Please provide financial data for each year. All values should be in Indian Rupees (₹) in Lakhs.</p>
        <p className="mt-2 text-xs">Note: 1 Lakh = 100,000 Rupees</p>
      </div>
      
      {yearlyData.map((yearData, yearIndex) => (
        <div key={yearIndex} className="border rounded-lg p-6 mb-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-5">
            <div className="flex-grow">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Year Label
              </label>
              <input
                type="text"
                value={yearData.yearLabel}
                onChange={(e) => handleYearLabelChange(yearIndex, e.target.value)}
                className="p-2 border rounded-md w-full max-w-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter year label (e.g., 2022-23)"
              />
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
              Year {yearIndex + 1}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Revenue from Operations (₹ in Lakhs)
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={yearData.financialData.revenueFromOperations}
                onChange={(e) => handleInputChange(yearIndex, 'revenueFromOperations', e.target.value)}
                className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter amount in lakhs"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Total Revenue (₹ in Lakhs)
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={yearData.financialData.totalRevenue}
                onChange={(e) => handleInputChange(yearIndex, 'totalRevenue', e.target.value)}
                className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter amount in lakhs"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Surplus/Deficit for the Year (₹ in Lakhs)
              </label>
              <input
                type="text"
                value={yearData.financialData.surplusDeficit}
                onChange={(e) => handleInputChange(yearIndex, 'surplusDeficit', e.target.value)}
                className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter amount in lakhs"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Total Assets (₹ in Lakhs)
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={yearData.financialData.totalAssets}
                onChange={(e) => handleInputChange(yearIndex, 'totalAssets', e.target.value)}
                className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter amount in lakhs"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Employee Benefit Expense (₹ in Lakhs)
              </label>
              <input
                type="text"
                value={yearData.financialData.employeeBenefitExpense}
                onChange={(e) => handleInputChange(yearIndex, 'employeeBenefitExpense', e.target.value)}
                className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter amount in lakhs"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Borrowings (₹ in Lakhs)
                <span className="ml-1 text-gray-400 text-xs">(Excluding short-term payables)</span>
              </label>
              <input
                type="text"
                value={yearData.financialData.borrowings}
                onChange={(e) => handleInputChange(yearIndex, 'borrowings', e.target.value)}
                className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter amount in lakhs"
              />
            </div>
          </div>
          
          {yearData.financialData.totalRevenue && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2 text-gray-700">Summary:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded-md">
                <div>
                  <div className="text-gray-500">Total Revenue:</div>
                  <div className="font-medium text-gray-900">₹ {formatNumber(yearData.financialData.totalRevenue)} lakhs</div>
                </div>
                
                <div>
                  <div className="text-gray-500">Total Assets:</div>
                  <div className="font-medium text-gray-900">₹ {formatNumber(yearData.financialData.totalAssets)} lakhs</div>
                </div>
                
                {yearData.financialData.borrowings && (
                  <div>
                    <div className="text-gray-500">Borrowings:</div>
                    <div className="font-medium text-gray-900">₹ {formatNumber(yearData.financialData.borrowings)} lakhs</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      
      <div className="text-sm text-gray-500 mt-6 p-3 border rounded-md bg-gray-50">
        <p><span className="text-red-500">*</span> Required fields</p>
        <p className="mt-1 text-xs">Tip: Enter the most recent year's data first (Year 1) followed by previous years.</p>
      </div>
    </div>
  );
};

export default FinancialDataForm; 