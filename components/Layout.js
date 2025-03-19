import React from 'react';
import Head from 'next/head';
import StepWizard from './StepWizard';
import { useAuditForm } from '../context/AuditFormContext';
import { FiHelpCircle, FiSettings, FiRefreshCw } from 'react-icons/fi';

const Layout = ({ children }) => {
  const { resetForm } = useAuditForm();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Audit Fee Calculator</title>
        <meta name="description" content="Calculate audit fees based on financial data and complexity factors" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <header className="bg-gradient-primary text-white shadow-md">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Audit Fee Calculator</h1>
              <p className="text-blue-100 text-sm">Professional Fee Estimation Tool</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => window.open('https://www.icai.org', '_blank')}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Help & Resources"
              >
                <FiHelpCircle className="w-5 h-5" />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Settings"
              >
                <FiSettings className="w-5 h-5" />
              </button>
              <button 
                onClick={resetForm}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Reset Form"
              >
                <FiRefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <StepWizard />
          </div>
          
          <div className="premium-card p-6">
            {children}
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>All calculations are based on industry standards and ICAI guidelines.</p>
            <p className="mt-1">
              For professional advice, please consult with a certified accountant.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-white text-lg font-semibold mb-2">Audit Fee Calculator</h3>
                <p className="text-sm">A tool for estimating professional audit fees</p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  About
                </a>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} Audit Fee Calculator. All rights reserved.</p>
              <p className="mt-1">
                This is a fee estimation tool only. Actual fees may vary based on engagement specifics.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 