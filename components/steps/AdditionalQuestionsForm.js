import React from 'react';
import { useAuditForm } from '../../context/AuditFormContext';

const AdditionalQuestionsForm = () => {
  const { additionalData, updateAdditionalData } = useAuditForm();
  
  // Handle checkbox change
  const handleCheckboxChange = (field, checked) => {
    updateAdditionalData(field, checked);
  };
  
  // Handle input change
  const handleInputChange = (field, value) => {
    updateAdditionalData(field, value);
  };
  
  // Handle numeric input change with validation
  const handleNumericChange = (field, value) => {
    if (value === '' || (!isNaN(value) && value >= 0)) {
      updateAdditionalData(field, parseInt(value) || 0);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500 mb-4">
        Please provide additional information about the client to help refine the fee calculation.
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-blue-700 text-lg font-medium mb-2">Why this information matters</h3>
        <p className="text-sm text-blue-600">
          These factors can significantly affect the complexity and effort required for audit services, 
          which in turn affects the appropriate fee level. Your answers help us provide a more accurate proposal.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="complexGroupStructure"
              checked={additionalData.hasComplexGroupStructure}
              onChange={(e) => handleCheckboxChange('hasComplexGroupStructure', e.target.checked)}
              className="mt-1 mr-3 h-4 w-4"
            />
            <div>
              <label htmlFor="complexGroupStructure" className="block text-sm font-medium">
                Complex Group Structure
              </label>
              <p className="text-xs text-gray-500">
                The entity is part of a complex group with multiple inter-company transactions.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <input
              type="checkbox"
              id="internationalTransactions"
              checked={additionalData.hasInternationalTransactions}
              onChange={(e) => handleCheckboxChange('hasInternationalTransactions', e.target.checked)}
              className="mt-1 mr-3 h-4 w-4"
            />
            <div>
              <label htmlFor="internationalTransactions" className="block text-sm font-medium">
                International Transactions
              </label>
              <p className="text-xs text-gray-500">
                The entity has significant international transactions or operations.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <input
              type="checkbox"
              id="regulatoryChanges"
              checked={additionalData.hasRegulatoryChanges}
              onChange={(e) => handleCheckboxChange('hasRegulatoryChanges', e.target.checked)}
              className="mt-1 mr-3 h-4 w-4"
            />
            <div>
              <label htmlFor="regulatoryChanges" className="block text-sm font-medium">
                Recent Regulatory Changes
              </label>
              <p className="text-xs text-gray-500">
                There have been significant regulatory changes affecting the entity's operations or reporting.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="multipleBranches"
              checked={additionalData.hasMultipleBranches}
              onChange={(e) => handleCheckboxChange('hasMultipleBranches', e.target.checked)}
              className="mt-1 mr-3 h-4 w-4"
            />
            <div>
              <label htmlFor="multipleBranches" className="block text-sm font-medium">
                Multiple Branches or Locations
              </label>
              <p className="text-xs text-gray-500">
                The entity operates from multiple branches or locations requiring separate audits.
              </p>
            </div>
          </div>
          
          {additionalData.hasMultipleBranches && (
            <div className="ml-7">
              <label className="block text-sm font-medium mb-1">
                Number of Branches
              </label>
              <input
                type="number"
                min="0"
                value={additionalData.numberOfBranches}
                onChange={(e) => handleNumericChange('numberOfBranches', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter number of branches"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-medium mb-1">
          Additional Notes or Specific Requirements
        </label>
        <textarea
          value={additionalData.additionalNotes}
          onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
          className="w-full p-2 border rounded h-24"
          placeholder="Please provide any additional information that might be relevant for fee calculation..."
        />
      </div>
    </div>
  );
};

export default AdditionalQuestionsForm; 