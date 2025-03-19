import React from 'react';
import { FiUser, FiUserCheck } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const PersonnelSection = ({ 
  additionalData, 
  handlePersonnelChange, 
  partners, 
  managers, 
  getPersonnelNameById 
}) => {
  return (
    <Card className="bg-card">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <FiUser className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Engagement Personnel</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Engagement Partner */}
          <div className="space-y-2">
            <Label htmlFor="engagementPartner">
              Engagement Partner <span className="text-destructive">*</span>
            </Label>
            <Select
              value={additionalData.personnelInfo.engagementPartnerId?.toString() || ''}
              onValueChange={(value) => handlePersonnelChange('engagementPartnerId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Engagement Partner" />
              </SelectTrigger>
              <SelectContent>
                {partners
                  .filter(p => p.designation.includes('Engagement Partner'))
                  .map(partner => (
                    <SelectItem key={partner.id} value={partner.id.toString()}>
                      {partner.name} ({partner.membershipNumber})
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              The partner responsible for the overall engagement
            </p>
          </div>
          
          {/* Audit Manager */}
          <div className="space-y-2">
            <Label htmlFor="auditManager">
              Audit Manager
            </Label>
            <Select
              value={additionalData.personnelInfo.auditManagerId?.toString() || ''}
              onValueChange={(value) => handlePersonnelChange('auditManagerId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Audit Manager" />
              </SelectTrigger>
              <SelectContent>
                {managers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id.toString()}>
                    {manager.name} ({manager.membershipNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              The manager overseeing the day-to-day audit activities
            </p>
          </div>
          
          {/* Concurring Partner */}
          <div className="space-y-2">
            <Label htmlFor="concurringPartner">
              Concurring Partner
            </Label>
            <Select
              value={additionalData.personnelInfo.concurringPartnerId?.toString() || ''}
              onValueChange={(value) => handlePersonnelChange('concurringPartnerId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Concurring Partner" />
              </SelectTrigger>
              <SelectContent>
                {partners
                  .filter(p => p.designation.includes('Concurring Partner'))
                  .map(partner => (
                    <SelectItem key={partner.id} value={partner.id.toString()}>
                      {partner.name} ({partner.membershipNumber})
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              The partner providing an objective review of the audit
            </p>
          </div>
        </div>
        
        {/* Selected Personnel Summary */}
        {(additionalData.personnelInfo.engagementPartnerId || 
          additionalData.personnelInfo.auditManagerId || 
          additionalData.personnelInfo.concurringPartnerId) && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">Selected Personnel:</h4>
            <ul className="text-sm space-y-2">
              {additionalData.personnelInfo.engagementPartnerId && (
                <li className="flex items-center">
                  <FiUserCheck className="text-primary mr-2" />
                  <span className="text-muted-foreground">Engagement Partner: </span>
                  <span className="font-medium ml-1">
                    {getPersonnelNameById(additionalData.personnelInfo.engagementPartnerId)}
                  </span>
                </li>
              )}
              {additionalData.personnelInfo.auditManagerId && (
                <li className="flex items-center">
                  <FiUserCheck className="text-primary mr-2" />
                  <span className="text-muted-foreground">Audit Manager: </span>
                  <span className="font-medium ml-1">
                    {getPersonnelNameById(additionalData.personnelInfo.auditManagerId)}
                  </span>
                </li>
              )}
              {additionalData.personnelInfo.concurringPartnerId && (
                <li className="flex items-center">
                  <FiUserCheck className="text-primary mr-2" />
                  <span className="text-muted-foreground">Concurring Partner: </span>
                  <span className="font-medium ml-1">
                    {getPersonnelNameById(additionalData.personnelInfo.concurringPartnerId)}
                  </span>
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonnelSection; 