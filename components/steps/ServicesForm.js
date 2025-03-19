import React from 'react';
import { useAuditForm } from '../../context/AuditFormContext';

const ServicesForm = () => {
  const { yearlyData, updateServiceData } = useAuditForm();
  
  // Handle checkbox change
  const handleCheckboxChange = (yearIndex, service, checked) => {
    updateServiceData(yearIndex, service, 'selected', checked);
    
    // Clear fee if unchecked
    if (!checked) {
      updateServiceData(yearIndex, service, 'fee', '');
    }
  };
  
  // Handle fee input change
  const handleFeeChange = (yearIndex, service, value) => {
    // Validate that the input is a number
    if (value === '' || (!isNaN(value) && value >= 0)) {
      updateServiceData(yearIndex, service, 'fee', value);
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
      gstAnnualReturnFiling: 'GST Annual Return Filing'
    };
    return serviceNames[serviceKey] || serviceKey;
  };

  // Calculate yearly totals
  const calculateYearlyTotal = (yearIndex) => {
    const year = yearlyData[yearIndex];
    let total = 0;
    
    Object.keys(year.services).forEach(service => {
      if (year.services[service].selected && year.services[service].fee) {
        total += parseFloat(year.services[service].fee) || 0;
      }
    });
    
    return total;
  };
  
  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500 mb-4">
        For each year, select the services provided and enter the fee charged (in ₹). This historical data will help calculate proposed fees.
      </div>
      
      {yearlyData.map((yearData, yearIndex) => (
        <div key={yearIndex} className="border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium mb-4">Financial Year: {yearData.year}</h3>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">Service</th>
                <th className="border p-2 text-center w-24">Provided?</th>
                <th className="border p-2 text-left">Fee (₹)</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(yearData.services).map((service) => (
                <tr key={service} className="border-b">
                  <td className="border p-2">
                    {getServiceDisplayName(service)}
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={yearData.services[service].selected}
                      onChange={(e) => handleCheckboxChange(yearIndex, service, e.target.checked)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={yearData.services[service].fee}
                      onChange={(e) => handleFeeChange(yearIndex, service, e.target.value)}
                      disabled={!yearData.services[service].selected}
                      className={`w-full p-2 border rounded ${!yearData.services[service].selected ? 'bg-gray-100' : ''}`}
                      placeholder="Enter amount"
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td className="border p-2">Total</td>
                <td className="border p-2"></td>
                <td className="border p-2">
                  ₹ {calculateYearlyTotal(yearIndex).toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>
          
          <div className="mt-4 text-sm text-gray-600">
            Note: Only enter fees for services that were provided in {yearData.year}.
          </div>
        </div>
      ))}
      
      <div className="text-sm text-gray-500 mt-4">
        <p>Accurate historical data will help generate better fee proposals.</p>
      </div>
    </div>
  );
};

export default ServicesForm; 