import React, { useState, useEffect } from 'react';
import { useAuditForm } from '../../context/AuditFormContext';
import { FiSearch, FiUser, FiUserCheck, FiBriefcase } from 'react-icons/fi';
import { clientsDatabase, personnelDatabase, getPersonnelByRole } from '../../utils/mockDatabase';

const ClientInfoForm = () => {
  const { 
    additionalData, 
    updateClientInfo, 
    setClientInfo,
    updatePersonnelInfo 
  } = useAuditForm();
  
  const [filteredClients, setFilteredClients] = useState([]);
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  
  const [partners, setPartners] = useState([]);
  const [managers, setManagers] = useState([]);
  
  // Load personnel data
  useEffect(() => {
    setPartners(getPersonnelByRole('partner'));
    setManagers(getPersonnelByRole('manager'));
  }, []);
  
  // Filter clients based on search term
  useEffect(() => {
    if (!clientSearch) {
      setFilteredClients([]);
      return;
    }
    
    const search = clientSearch.toLowerCase();
    const filtered = clientsDatabase.filter(client => 
      client.clientName.toLowerCase().includes(search) || 
      client.CIN.toLowerCase().includes(search) || 
      client.PAN.toLowerCase().includes(search)
    );
    
    setFilteredClients(filtered);
  }, [clientSearch]);
  
  // Handle client search
  const handleClientSearchChange = (e) => {
    setClientSearch(e.target.value);
    setShowClientDropdown(true);
  };
  
  // Handle client selection
  const handleClientSelect = (client) => {
    setClientInfo({
      clientId: client.id,
      clientName: client.clientName,
      CIN: client.CIN,
      PAN: client.PAN,
      paidUpCapital: client.paidUpCapital.toString(),
      latestTurnover: client.latestTurnover.toString(),
      borrowings: client.borrowings.toString(),
      netProfit: client.netProfit.toString(),
      sector: client.sector
    });
    
    setClientSearch(client.clientName);
    setShowClientDropdown(false);
  };
  
  // Handle manual client info input
  const handleClientInfoChange = (field, value) => {
    updateClientInfo(field, value);
  };
  
  // Handle personnel selection
  const handlePersonnelChange = (field, value) => {
    updatePersonnelInfo(field, parseInt(value) || null);
  };
  
  // Get personnel name by ID
  const getPersonnelNameById = (id) => {
    const person = personnelDatabase.find(p => p.id === id);
    return person ? person.name : '';
  };
  
  return (
    <div className="space-y-8">
      <div className="border rounded-lg p-6 mb-6 bg-gray-50 shadow-sm">
        <div className="flex items-center mb-4">
          <FiBriefcase className="text-blue-600 w-5 h-5 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Client Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Search & Selection */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Search Client
            </label>
            <div className="relative">
              <div className="flex">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={handleClientSearchChange}
                    onFocus={() => setShowClientDropdown(true)}
                    className="w-full p-2 pr-8 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Search by client name, CIN, or PAN"
                  />
                  <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
                </div>
                <button
                  onClick={() => {
                    setClientInfo(initializeClientInfo());
                    setClientSearch('');
                  }}
                  className="ml-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              </div>
              
              {showClientDropdown && filteredClients.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredClients.map(client => (
                    <div
                      key={client.id}
                      className="p-2 hover:bg-blue-50 cursor-pointer border-b"
                      onClick={() => handleClientSelect(client)}
                    >
                      <div className="font-medium">{client.clientName}</div>
                      <div className="text-xs text-gray-500">
                        CIN: {client.CIN} | PAN: {client.PAN} | Sector: {client.sector}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Search for existing client or enter new client details below
            </p>
          </div>
          
          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Client Name
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={additionalData.clientInfo.clientName}
              onChange={(e) => handleClientInfoChange('clientName', e.target.value)}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter client name"
              required
            />
          </div>
          
          {/* Client CIN */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Corporate Identification Number (CIN)
            </label>
            <input
              type="text"
              value={additionalData.clientInfo.CIN}
              onChange={(e) => handleClientInfoChange('CIN', e.target.value)}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter CIN"
            />
          </div>
          
          {/* Client PAN */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Permanent Account Number (PAN)
            </label>
            <input
              type="text"
              value={additionalData.clientInfo.PAN}
              onChange={(e) => handleClientInfoChange('PAN', e.target.value)}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter PAN"
            />
          </div>
          
          {/* Client Sector */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Business Sector
            </label>
            <input
              type="text"
              value={additionalData.clientInfo.sector}
              onChange={(e) => handleClientInfoChange('sector', e.target.value)}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="E.g., Manufacturing, Technology, etc."
            />
          </div>
          
          {/* Paid-up Capital */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Paid-up Capital (₹ in Lakhs)
            </label>
            <input
              type="text"
              value={additionalData.clientInfo.paidUpCapital}
              onChange={(e) => handleClientInfoChange('paidUpCapital', e.target.value)}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter amount in lakhs"
            />
          </div>
          
          {/* Latest Turnover */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Latest Turnover (₹ in Lakhs)
            </label>
            <input
              type="text"
              value={additionalData.clientInfo.latestTurnover}
              onChange={(e) => handleClientInfoChange('latestTurnover', e.target.value)}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter amount in lakhs"
            />
          </div>
          
          {/* Borrowings */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Borrowings (₹ in Lakhs)
            </label>
            <input
              type="text"
              value={additionalData.clientInfo.borrowings}
              onChange={(e) => handleClientInfoChange('borrowings', e.target.value)}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter amount in lakhs"
            />
          </div>
          
          {/* Net Profit */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Net Profit (₹ in Lakhs)
            </label>
            <input
              type="text"
              value={additionalData.clientInfo.netProfit}
              onChange={(e) => handleClientInfoChange('netProfit', e.target.value)}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter amount in lakhs"
            />
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-6 mb-6 bg-gray-50 shadow-sm">
        <div className="flex items-center mb-4">
          <FiUser className="text-blue-600 w-5 h-5 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Engagement Personnel</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Engagement Partner */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Engagement Partner
              <span className="text-red-500">*</span>
            </label>
            <select
              value={additionalData.personnelInfo.engagementPartnerId || ''}
              onChange={(e) => handlePersonnelChange('engagementPartnerId', e.target.value)}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Select Engagement Partner</option>
              {partners
                .filter(p => p.designation.includes('Engagement Partner'))
                .map(partner => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name} ({partner.membershipNumber})
                  </option>
                ))
              }
            </select>
            <p className="mt-1 text-xs text-gray-500">
              The partner responsible for the overall engagement
            </p>
          </div>
          
          {/* Audit Manager */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Audit Manager
            </label>
            <select
              value={additionalData.personnelInfo.auditManagerId || ''}
              onChange={(e) => handlePersonnelChange('auditManagerId', e.target.value)}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Audit Manager</option>
              {managers.map(manager => (
                <option key={manager.id} value={manager.id}>
                  {manager.name} ({manager.membershipNumber})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              The manager overseeing the day-to-day audit activities
            </p>
          </div>
          
          {/* Concurring Partner */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Concurring Partner
            </label>
            <select
              value={additionalData.personnelInfo.concurringPartnerId || ''}
              onChange={(e) => handlePersonnelChange('concurringPartnerId', e.target.value)}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Concurring Partner</option>
              {partners
                .filter(p => p.designation.includes('Concurring Partner'))
                .map(partner => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name} ({partner.membershipNumber})
                  </option>
                ))
              }
            </select>
            <p className="mt-1 text-xs text-gray-500">
              The partner providing an objective review of the audit
            </p>
          </div>
        </div>
        
        {/* Selected Personnel Summary */}
        {(additionalData.personnelInfo.engagementPartnerId || 
          additionalData.personnelInfo.auditManagerId || 
          additionalData.personnelInfo.concurringPartnerId) && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h4 className="text-sm font-medium mb-2 text-gray-800">Selected Personnel:</h4>
            <ul className="text-sm space-y-1">
              {additionalData.personnelInfo.engagementPartnerId && (
                <li className="flex items-center">
                  <FiUserCheck className="text-green-500 mr-2" />
                  <span className="text-gray-700">Engagement Partner: </span>
                  <span className="font-medium ml-1">
                    {getPersonnelNameById(additionalData.personnelInfo.engagementPartnerId)}
                  </span>
                </li>
              )}
              {additionalData.personnelInfo.auditManagerId && (
                <li className="flex items-center">
                  <FiUserCheck className="text-green-500 mr-2" />
                  <span className="text-gray-700">Audit Manager: </span>
                  <span className="font-medium ml-1">
                    {getPersonnelNameById(additionalData.personnelInfo.auditManagerId)}
                  </span>
                </li>
              )}
              {additionalData.personnelInfo.concurringPartnerId && (
                <li className="flex items-center">
                  <FiUserCheck className="text-green-500 mr-2" />
                  <span className="text-gray-700">Concurring Partner: </span>
                  <span className="font-medium ml-1">
                    {getPersonnelNameById(additionalData.personnelInfo.concurringPartnerId)}
                  </span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to initialize client info
const initializeClientInfo = () => {
  return {
    clientId: null,
    clientName: '',
    CIN: '',
    PAN: '',
    paidUpCapital: '',
    latestTurnover: '',
    borrowings: '',
    netProfit: '',
    sector: ''
  };
};

export default ClientInfoForm; 