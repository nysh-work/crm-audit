import React, { useState, useEffect } from 'react';
import { useAuditForm } from '../../context/AuditFormContext';
import { FiSearch, FiUser, FiUserCheck, FiBriefcase, FiInfo } from 'react-icons/fi';
import { clientsDatabase, personnelDatabase, getPersonnelByRole } from '../../utils/mockDatabase';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import PersonnelSection from './PersonnelSection';

const FieldWithTooltip = ({ label, tooltip, children, required }) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <FiInfo className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    {children}
  </div>
);

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
  
  // Add validation state
  const [errors, setErrors] = useState({});

  // Validate form fields
  const validateField = (field, value) => {
    switch (field) {
      case 'clientName':
        return !value ? 'Client name is required' : '';
      case 'CIN':
        return value && !/^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/.test(value) 
          ? 'Invalid CIN format' : '';
      case 'PAN':
        return value && !/^[A-Z]{5}\d{4}[A-Z]$/.test(value)
          ? 'Invalid PAN format' : '';
      default:
        return '';
    }
  };

  // Update handler to include validation
  const handleClientInfoChange = (field, value) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
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
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <FiBriefcase className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Client Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Search & Selection */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label htmlFor="clientSearch">Search Client</Label>
              <div className="relative">
                <div className="flex space-x-2">
                  <div className="relative flex-grow">
                    <Input
                      id="clientSearch"
                      type="text"
                      value={clientSearch}
                      onChange={handleClientSearchChange}
                      onFocus={() => setShowClientDropdown(true)}
                      className="pr-8"
                      placeholder="Search by client name, CIN, or PAN"
                    />
                    <FiSearch className="absolute right-3 top-2.5 text-muted-foreground" />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setClientInfo(initializeClientInfo());
                      setClientSearch('');
                    }}
                  >
                    Clear
                  </Button>
                </div>
                
                {showClientDropdown && filteredClients.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredClients.map(client => (
                      <div
                        key={client.id}
                        className="p-3 hover:bg-accent cursor-pointer border-b"
                        onClick={() => handleClientSelect(client)}
                      >
                        <div className="font-medium">{client.clientName}</div>
                        <div className="text-xs text-muted-foreground">
                          CIN: {client.CIN} | PAN: {client.PAN} | Sector: {client.sector}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Search for existing client or enter new client details below
              </p>
            </div>
            
            {/* Client Name */}
            <FieldWithTooltip
              label="Client Name"
              tooltip="Enter the legal name of the client company"
              required
            >
              <Input
                id="clientName"
                type="text"
                value={additionalData.clientInfo.clientName}
                onChange={(e) => handleClientInfoChange('clientName', e.target.value)}
                placeholder="Enter client name"
                required
              />
              {errors.clientName && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.clientName}</AlertDescription>
                </Alert>
              )}
            </FieldWithTooltip>
            
            {/* Client CIN */}
            <FieldWithTooltip
              label="Corporate Identification Number (CIN)"
              tooltip="21-character unique company identification number issued by RoC"
            >
              <Input
                id="cin"
                type="text"
                value={additionalData.clientInfo.CIN}
                onChange={(e) => handleClientInfoChange('CIN', e.target.value)}
                placeholder="Enter CIN"
              />
              {errors.CIN && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.CIN}</AlertDescription>
                </Alert>
              )}
            </FieldWithTooltip>
            
            {/* Client PAN */}
            <FieldWithTooltip
              label="Permanent Account Number (PAN)"
              tooltip="10-character alphanumeric tax identification number"
            >
              <Input
                id="pan"
                type="text"
                value={additionalData.clientInfo.PAN}
                onChange={(e) => handleClientInfoChange('PAN', e.target.value)}
                placeholder="Enter PAN"
              />
              {errors.PAN && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.PAN}</AlertDescription>
                </Alert>
              )}
            </FieldWithTooltip>
            
            {/* Client Sector */}
            <FieldWithTooltip
              label="Business Sector"
              tooltip="Primary industry sector of the client's business operations"
            >
              <Input
                id="sector"
                type="text"
                value={additionalData.clientInfo.sector}
                onChange={(e) => handleClientInfoChange('sector', e.target.value)}
                placeholder="E.g., Manufacturing, Technology, etc."
              />
            </FieldWithTooltip>
            
            {/* Financial Information Section */}
            <div className="col-span-1 md:col-span-2">
              <Alert className="mb-4">
                <AlertDescription>
                  Please enter all financial amounts in lakhs (₹). For example, ₹10,00,000 should be entered as 10.
                </AlertDescription>
              </Alert>
            </div>
            
            {/* Paid-up Capital */}
            <FieldWithTooltip
              label="Paid-up Capital"
              tooltip="Total amount of share capital that has been paid by shareholders"
            >
              <Input
                id="paidUpCapital"
                type="text"
                value={additionalData.clientInfo.paidUpCapital}
                onChange={(e) => handleClientInfoChange('paidUpCapital', e.target.value)}
                placeholder="Enter amount in lakhs"
              />
            </FieldWithTooltip>
            
            {/* Latest Turnover */}
            <FieldWithTooltip
              label="Latest Turnover"
              tooltip="Total revenue generated by the company in the most recent financial year"
            >
              <Input
                id="latestTurnover"
                type="text"
                value={additionalData.clientInfo.latestTurnover}
                onChange={(e) => handleClientInfoChange('latestTurnover', e.target.value)}
                placeholder="Enter amount in lakhs"
              />
            </FieldWithTooltip>
            
            {/* Borrowings */}
            <FieldWithTooltip
              label="Borrowings"
              tooltip="Total outstanding loans and borrowings from all sources"
            >
              <Input
                id="borrowings"
                type="text"
                value={additionalData.clientInfo.borrowings}
                onChange={(e) => handleClientInfoChange('borrowings', e.target.value)}
                placeholder="Enter amount in lakhs"
              />
            </FieldWithTooltip>
            
            {/* Net Profit */}
            <FieldWithTooltip
              label="Net Profit"
              tooltip="Profit after tax for the most recent financial year"
            >
              <Input
                id="netProfit"
                type="text"
                value={additionalData.clientInfo.netProfit}
                onChange={(e) => handleClientInfoChange('netProfit', e.target.value)}
                placeholder="Enter amount in lakhs"
              />
            </FieldWithTooltip>
          </div>
        </CardContent>
      </Card>

      <PersonnelSection 
        additionalData={additionalData}
        handlePersonnelChange={handlePersonnelChange}
        partners={partners}
        managers={managers}
        getPersonnelNameById={getPersonnelNameById}
      />
    </div>
  );
};

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