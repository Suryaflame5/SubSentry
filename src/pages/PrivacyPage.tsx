import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useSubSentry } from '../context/SubSentryContext';

export const PrivacyPage: React.FC = () => {
  const { setCurrentRoute } = useSubSentry();

  return (
    <div className="min-h-screen bg-canvas text-primary antialiased font-sans p-6 sm:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => setCurrentRoute('/signin')}
          className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors mb-6 focus:outline-hidden"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to SubSentry</span>
        </button>

        <div className="flex items-center gap-2.5 text-accent mb-2">
          <Shield className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Privacy Statement</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Privacy Policy
        </h1>
        <p className="text-xs text-secondary mt-1">
          Last revised: September 2026
        </p>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6 sm:p-8 space-y-6 text-xs leading-relaxed text-secondary">
        <div>
          <h2 className="text-sm font-semibold text-primary mb-2">
            1. Client-Side Data Isolation
          </h2>
          <p>
            SubSentry operates on an isolation-first architecture. When you upload bank transaction statements (CSV), your financial data is analyzed locally within your authenticated browser environment. Your transaction histories and subscription traces are scoped directly to your account storage and are not transmitted to external third-party analytics trackers.
          </p>
        </div>

        <div className="border-t border-border/70 pt-6">
          <h2 className="text-sm font-semibold text-primary mb-2">
            2. No Financial Credentials Required
          </h2>
          <p>
            SubSentry does not connect directly to banking institutions and never asks for banking passwords, PINs, card numbers, or online banking credentials. All pattern intelligence is computed strictly from exported statement lines that you choose to provide.
          </p>
        </div>

        <div className="border-t border-border/70 pt-6">
          <h2 className="text-sm font-semibold text-primary mb-2">
            3. Account & Authentication Security
          </h2>
          <p>
            User credentials are protected using browser-native Web Crypto cryptographic algorithms (SHA-256 with unique random salts). Plaintext passwords are never stored in memory or local databases.
          </p>
        </div>

        <div className="border-t border-border/70 pt-6">
          <h2 className="text-sm font-semibold text-primary mb-2">
            4. Data Retention & Erasure
          </h2>
          <p>
            You maintain absolute sovereignty over your financial statements. You may delete your account and all associated transaction records at any time from your Account Settings. Upon confirmation, all local records are permanently wiped.
          </p>
        </div>
      </div>
    </div>
  );
};
