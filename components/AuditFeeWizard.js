import React from 'react';
import { useAuditForm } from '../context/AuditFormContext';
import ClientInfoForm from './steps/ClientInfoForm';
import FinancialDataForm from './steps/FinancialDataForm';
import ServicesForm from './steps/ServicesForm';
import AdditionalQuestionsForm from './steps/AdditionalQuestionsForm';
import SummaryForm from './steps/SummaryForm';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { FiUser, FiDollarSign, FiBriefcase, FiHelpCircle, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const AuditFeeWizard = () => {
  const { 
    currentStep, 
    goToNextStep, 
    goToPreviousStep,
    resetForm,
    isLoading
  } = useAuditForm();

  // Show loading indicator if data is still loading
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading your data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the appropriate step based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ClientInfoForm />;
      case 2:
        return <FinancialDataForm />;
      case 3:
        return <ServicesForm />;
      case 4:
        return <AdditionalQuestionsForm />;
      case 5:
        return <SummaryForm />;
      default:
        return <ClientInfoForm />;
    }
  };

  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Client Information";
      case 2:
        return "Financial Data";
      case 3:
        return "Services and Fees";
      case 4:
        return "Additional Questions";
      case 5:
        return "Proposed Fee Calculation & Summary";
      default:
        return "Audit Fee Calculator";
    }
  };

  // Get step icon
  const getStepIcon = () => {
    switch (currentStep) {
      case 1:
        return <FiUser className="h-6 w-6" />;
      case 2:
        return <FiDollarSign className="h-6 w-6" />;
      case 3:
        return <FiBriefcase className="h-6 w-6" />;
      case 4:
        return <FiHelpCircle className="h-6 w-6" />;
      case 5:
        return <FiCheckCircle className="h-6 w-6" />;
      default:
        return <FiUser className="h-6 w-6" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              {getStepIcon()}
            </div>
            <CardTitle className="text-2xl font-bold">
              {getStepTitle()}
            </CardTitle>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="flex space-x-2 flex-1 max-w-md">
              {[1, 2, 3, 4, 5].map((step) => (
                <div 
                  key={step}
                  className={`h-2 w-full rounded-full transition-colors ${
                    step <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground ml-4">
              Step {currentStep} of 5
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {renderStep()}
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6">
          <div className="flex space-x-2">
            {currentStep > 1 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={goToPreviousStep}
                    >
                      Previous
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Go back to {getStepTitle(currentStep - 1)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {currentStep === 5 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                  >
                    <FiAlertTriangle className="mr-2 h-4 w-4" />
                    Reset Form
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Form</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to reset the form? This action cannot be undone.
                      All entered data will be lost.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => document.querySelector('[role="dialog"]')?.close()}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        resetForm();
                        document.querySelector('[role="dialog"]')?.close();
                      }}
                    >
                      Reset
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <div>
            {currentStep < 5 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={goToNextStep}
                    >
                      Next
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Continue to {getStepTitle(currentStep + 1)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuditFeeWizard; 