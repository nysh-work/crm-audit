import React from 'react';
import Head from 'next/head';
import AuditFeeWizard from '../components/AuditFeeWizard';
import { AuditFormProvider } from '../context/AuditFormContext';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Audit Fee Calculator</title>
        <meta name="description" content="Calculate proposed audit fees based on historical data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-10">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-8 text-foreground">
          Audit Fee Calculator
        </h1>
        
        <AuditFormProvider>
          <AuditFeeWizard />
        </AuditFormProvider>
      </main>

      <footer className="mt-10 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} Audit Fee Calculator. All rights reserved.</p>
      </footer>
    </div>
  );
} 