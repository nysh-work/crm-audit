import React from 'react';
import Head from 'next/head';
import AuditFeeWizard from '../components/AuditFeeWizard';
import { AuditFormProvider } from '../context/AuditFormContext';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Head>
        <title>Audit Fee Calculator</title>
        <meta name="description" content="Calculate proposed audit fees based on historical data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Audit Fee Calculator</h1>
        
        <AuditFormProvider>
          <AuditFeeWizard />
        </AuditFormProvider>
      </main>

      <footer className="mt-10 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Audit Fee Calculator. All rights reserved.</p>
      </footer>
    </div>
  );
} 