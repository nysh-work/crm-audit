import React, { useState, useEffect } from 'react';
import { useAuditForm } from '../context/AuditFormContext';
import ClientInfoForm from './steps/ClientInfoForm';
import FinancialDataForm from './steps/FinancialDataForm';
import ServicesForm from './steps/ServicesForm';
import AdditionalQuestionsForm from './steps/AdditionalQuestionsForm';
import SummaryForm from './steps/SummaryForm';
import ProgressBar from './ProgressBar';
import StepNavigation from './StepNavigation';
import { FiFileText, FiDollarSign, FiBriefcase, FiHelpCircle, FiCheckCircle, FiUser } from 'react-icons/fi';

const MultiStepForm = () => {
  const { calculateProposedFee, isDataValid, exportFormData } = useAuditForm();
  const [currentStep, setCurrentStep] = useState(1);
  const [inflation, setInflation] = useState('5.5');
  const [isValidated, setIsValidated] = useState(false);

  // Define steps with their icons and labels
  const steps = [
    { number: 1, label: 'Client Info', icon: <FiUser className="w-5 h-5" /> },
    { number: 2, label: 'Financial Data', icon: <FiDollarSign className="w-5 h-5" /> },
    { number: 3, label: 'Services', icon: <FiBriefcase className="w-5 h-5" /> },
    { number: 4, label: 'Additional Qs', icon: <FiHelpCircle className="w-5 h-5" /> },
    { number: 5, label: 'Summary', icon: <FiCheckCircle className="w-5 h-5" /> }
  ];

  // Check data validity whenever step changes
  useEffect(() => {
    setIsValidated(isDataValid(currentStep));
  }, [currentStep, isDataValid]);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
    // Calculate proposed fee when reaching summary
    if (currentStep === steps.length - 1) {
      calculateProposedFee(parseFloat(inflation));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
    }
  };

  // Handle inflation rate change
  const handleInflationChange = (e) => {
    const value = e.target.value;
    setInflation(value);
    // Recalculate fee when inflation rate changes
    if (currentStep === steps.length) {
      calculateProposedFee(parseFloat(value));
    }
  };

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
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <label htmlFor="inflation" className="font-medium text-gray-700">
                Inflation Rate (%):
              </label>
              <input
                type="number"
                id="inflation"
                value={inflation}
                onChange={handleInflationChange}
                min="0"
                max="20"
                step="0.1"
                className="w-24 p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => calculateProposedFee(parseFloat(inflation))}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Recalculate
              </button>
            </div>
            <SummaryForm />
          </div>
        );
      default:
        return <FinancialDataForm />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-7xl mx-auto">
      <ProgressBar
        steps={steps}
        currentStep={currentStep}
        goToStep={goToStep}
      />
      
      <div className="my-8">
        {renderStep()}
      </div>
      
      <StepNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        nextStep={nextStep}
        prevStep={prevStep}
        isNextDisabled={!isValidated}
        exportData={exportFormData}
      />
    </div>
  );
};

export default MultiStepForm; 