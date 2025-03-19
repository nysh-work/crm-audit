import React from 'react';
import { useAuditForm } from '../context/AuditFormContext';
import { FiCheck, FiDollarSign, FiFileText, FiHelpCircle, FiList } from 'react-icons/fi';

const StepWizard = () => {
  const { currentStep, goToNextStep, goToPreviousStep } = useAuditForm();
  
  const steps = [
    { id: 1, title: 'Financial Data', icon: <FiFileText /> },
    { id: 2, title: 'Services', icon: <FiList /> },
    { id: 3, title: 'Additional Questions', icon: <FiHelpCircle /> },
    { id: 4, title: 'Summary', icon: <FiDollarSign /> },
  ];
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8 px-2">
        {steps.map((step) => (
          <React.Fragment key={step.id}>
            <div 
              className="flex flex-col items-center relative cursor-pointer"
              onClick={() => step.id <= currentStep && goToPreviousStep(step.id)}
            >
              <div 
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                  step.id < currentStep 
                    ? 'bg-green-500 text-white' 
                    : step.id === currentStep 
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.id < currentStep ? (
                  <FiCheck className="w-6 h-6" />
                ) : (
                  <div className="flex items-center justify-center">
                    {step.icon}
                  </div>
                )}
              </div>
              <p className={`mt-2 text-sm font-medium ${
                step.id === currentStep ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.title}
              </p>
              
              {step.id === currentStep && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-600 rounded-full" />
              )}
            </div>
            
            {step.id < steps.length && (
              <div className={`flex-1 h-1 mx-2 rounded ${
                step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex justify-between items-center px-2 mt-2 no-print">
        <button
          onClick={goToPreviousStep}
          disabled={currentStep === 1}
          className={`premium-button-secondary py-2 px-4 text-sm ${
            currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </button>
        
        {currentStep < 4 && (
          <button
            onClick={goToNextStep}
            className="premium-button py-2 px-4 text-sm"
          >
            Next
          </button>
        )}
        
        {currentStep === 4 && (
          <button
            onClick={() => window.print()}
            className="premium-button py-2 px-4 text-sm"
          >
            Print Summary
          </button>
        )}
      </div>
    </div>
  );
};

export default StepWizard; 