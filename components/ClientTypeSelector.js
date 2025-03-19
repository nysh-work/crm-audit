import React from 'react';
import { useAuditForm } from '../context/AuditFormContext';
import { CLIENT_TYPES } from '../context/AuditFormContext';

const ClientTypeSelector = () => {
  const { additionalData, updateClientType } = useAuditForm();
  
  // Default to private if additionalData or clientType is undefined
  const currentClientType = additionalData?.clientType || 'private';
  
  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500 mb-4">
        Please select the type of client. This will help customize the fee calculation.
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-blue-700 text-lg font-medium mb-2">Why client type matters</h3>
        <p className="text-sm text-blue-600">
          Different types of entities have different audit requirements, complexity levels, and 
          regulatory obligations, which can significantly impact the appropriate fee structure.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CLIENT_TYPES.map((type) => (
          <div 
            key={type.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              currentClientType === type.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
            onClick={() => updateClientType(type.id)}
          >
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={`client-type-${type.id}`}
                  name="client-type"
                  type="radio"
                  className="h-4 w-4 text-blue-600"
                  checked={currentClientType === type.id}
                  onChange={() => updateClientType(type.id)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={`client-type-${type.id}`} className="font-medium text-gray-700">
                  {type.name}
                </label>
                <p className="text-gray-500 mt-1">
                  {getClientTypeDescription(type.id)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get descriptions for each client type
const getClientTypeDescription = (clientType) => {
  switch (clientType) {
    case 'list':
      return 'Companies listed on stock exchanges. Subject to additional regulations and disclosure requirements.';
    case 'public':
      return 'Public limited companies not listed on stock exchanges.';
    case 'private':
      return 'Privately held companies with limited liability.';
    case 'smc':
      return 'Small and Medium-sized Companies with simplified reporting requirements.';
    case 'llp':
      return 'Limited Liability Partnerships with partnership structure but limited liability.';
    case 'section8':
      return 'Non-profit organizations incorporated under Section 8 of Companies Act or as Trusts.';
    default:
      return '';
  }
};

export default ClientTypeSelector; 