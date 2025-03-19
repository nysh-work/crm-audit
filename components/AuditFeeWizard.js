import React from 'react';
import { useAuditForm } from '../context/AuditFormContext';
import ClientInfoForm from './steps/ClientInfoForm';
import FinancialDataForm from './steps/FinancialDataForm';
import ServicesForm from './steps/ServicesForm';
import AdditionalQuestionsForm from './steps/AdditionalQuestionsForm';
import SummaryForm from './steps/SummaryForm';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { FiUser, FiDollarSign, FiBriefcase, FiHelpCircle, FiCheckCircle } from 'react-icons/fi';

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
        <Card className="mb-8">
          <CardContent className="p-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading your data...</p>
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
        return "Step 1: Client Information";
      case 2:
        return "Step 2: Financial Data";
      case 3:
        return "Step 3: Services and Fees";
      case 4:
        return "Step 4: Additional Questions";
      case 5:
        return "Step 5: Proposed Fee Calculation & Summary";
      default:
        return "Audit Fee Calculator";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{getStepTitle()}</CardTitle>
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div 
                  key={step}
                  className={`h-2 w-10 rounded-full ${
                    step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of 5
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {renderStep()}
        </CardContent>

        <CardFooter className="flex justify-between border-t p-4">
          <div>
            {currentStep > 1 && (
              <button
                onClick={goToPreviousStep}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mr-2"
              >
                Previous
              </button>
            )}
            
            {currentStep === 5 && (
              <button
                onClick={resetForm}
                className="bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200 mr-2"
              >
                Reset Form
              </button>
            )}
          </div>
          
          <div>
            {currentStep < 5 && (
              <button
                onClick={goToNextStep}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuditFeeWizard; 