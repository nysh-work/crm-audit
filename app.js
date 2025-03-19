import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './components/ui/card';

const AuditFeeCalculator = () => {
  // Initial state for the client
  const [clientState, setClientState] = useState({
    clientName: '',
    clientType: 'MRI', // Default to MRI
    financialYear: '2024-25',
    revenueInMillion: 0,
    totalAssetsInMillion: 0,
    foreignTransactions: false,
    requiresIFC: false,
    requiresTPDoc: false,
    gstRegistered: false,
  });

  // Fee components from the Excel file
  const [feeComponents, setFeeComponents] = useState({
    statutoryAudit: 0,
    ifc: 0,
    taxAudit: 0,
    gstAudit: 0,
    tpAudit: 0,
    tpDocumentation: 0,
    itr: 0,
    otherServices: 0
  });

  // Default fee structure based on the Excel file
  const defaultFeeStructure = {
    MRI: {
      statutoryAudit: { base: 500000, percentOfRevenue: 0.0001 },
      ifc: { base: 200000, required: false },
      taxAudit: { base: 110000, percentOfRevenue: 0.00005 },
      gstAudit: { base: 60000, percentOfRevenue: 0.00001 },
      tpAudit: { base: 40000, required: false },
      tpDocumentation: { base: 185000, required: false },
      itr: { base: 25000, flat: true }
    },
    iNTERCHANGE: {
      statutoryAudit: { base: 75000, percentOfRevenue: 0.0001 },
      ifc: { base: 0, required: false },
      taxAudit: { base: 75000, percentOfRevenue: 0.00003 },
      gstAudit: { base: 0, percentOfRevenue: 0.00001 },
      tpAudit: { base: 0, required: false },
      tpDocumentation: { base: 0, required: false },
      itr: { base: 0, flat: true }
    }
  };

  // Calculate total fee
  const totalFee = Object.values(feeComponents).reduce((sum, fee) => sum + fee, 0);

  // Handle changes in client information
  const handleClientChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClientState({
      ...clientState,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Calculate fees based on client information
  const calculateFees = () => {
    const clientType = clientState.clientType;
    const feeStructure = defaultFeeStructure[clientType];
    const revenueInRupees = clientState.revenueInMillion * 1000000;
    
    const newFeeComponents = {
      statutoryAudit: Math.round(feeStructure.statutoryAudit.base + (revenueInRupees * feeStructure.statutoryAudit.percentOfRevenue)),
      ifc: clientState.requiresIFC ? feeStructure.ifc.base : 0,
      taxAudit: Math.round(feeStructure.taxAudit.base + (revenueInRupees * feeStructure.taxAudit.percentOfRevenue)),
      gstAudit: clientState.gstRegistered ? Math.round(feeStructure.gstAudit.base + (revenueInRupees * feeStructure.gstAudit.percentOfRevenue)) : 0,
      tpAudit: clientState.foreignTransactions ? feeStructure.tpAudit.base : 0,
      tpDocumentation: clientState.requiresTPDoc ? feeStructure.tpDocumentation.base : 0,
      itr: feeStructure.itr.base,
      otherServices: 0
    };
    
    setFeeComponents(newFeeComponents);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateFees();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Audit Fee Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Client Name</label>
                <input
                  type="text"
                  name="clientName"
                  value={clientState.clientName}
                  onChange={handleClientChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Client Type</label>
                <select
                  name="clientType"
                  value={clientState.clientType}
                  onChange={handleClientChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="MRI">MRI Software India Private Limited</option>
                  <option value="iNTERCHANGE">iINTERCHANGE SYSTEMS PRIVATE LIMITED</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Financial Year</label>
                <select
                  name="financialYear"
                  value={clientState.financialYear}
                  onChange={handleClientChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="2024-25">2024-25</option>
                  <option value="2023-24">2023-24</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Revenue (in millions)</label>
                <input
                  type="number"
                  name="revenueInMillion"
                  value={clientState.revenueInMillion}
                  onChange={handleClientChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Total Assets (in millions)</label>
                <input
                  type="number"
                  name="totalAssetsInMillion"
                  value={clientState.totalAssetsInMillion}
                  onChange={handleClientChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="requiresIFC"
                  checked={clientState.requiresIFC}
                  onChange={handleClientChange}
                  className="mr-2"
                />
                <label>Requires IFC (Internal Financial Controls)</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="foreignTransactions"
                  checked={clientState.foreignTransactions}
                  onChange={handleClientChange}
                  className="mr-2"
                />
                <label>Has Foreign Transactions (TP Audit)</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="requiresTPDoc"
                  checked={clientState.requiresTPDoc}
                  onChange={handleClientChange}
                  className="mr-2"
                />
                <label>Requires Transfer Pricing Documentation</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="gstRegistered"
                  checked={clientState.gstRegistered}
                  onChange={handleClientChange}
                  className="mr-2"
                />
                <label>GST Registered (GST Audit)</label>
              </div>
            </div>
            
            <div className="mt-4">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Calculate Fees
              </button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">Fee Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Statutory Audit:</span>
                <span>₹{feeComponents.statutoryAudit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>IFC:</span>
                <span>₹{feeComponents.ifc.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Audit:</span>
                <span>₹{feeComponents.taxAudit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Audit:</span>
                <span>₹{feeComponents.gstAudit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Transfer Pricing Audit:</span>
                <span>₹{feeComponents.tpAudit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>TP Documentation:</span>
                <span>₹{feeComponents.tpDocumentation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>ITR Filing:</span>
                <span>₹{feeComponents.itr.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Other Services:</span>
                <span>₹{feeComponents.otherServices.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2 font-bold">
                <span>Total Fee:</span>
                <span>₹{totalFee.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>This is an estimated fee based on provided information. Actual fees may vary.</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuditFeeCalculator;