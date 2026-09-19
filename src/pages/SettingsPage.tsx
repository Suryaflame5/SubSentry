import React, { useState } from 'react';
import { useSubSentry } from '../context/SubSentryContext';
import { Shield, RefreshCw, Sliders, Download, Calendar, DollarSign } from 'lucide-react';
export const SettingsPage: React.FC = () => {
  const { resetToSampleData, setCurrentRoute } = useSubSentry();
  const [sensitivity, setSensitivity] = useState(85);
  const [currency, setCurrency] = useState('INR');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  const handleExport = () => {
    setCurrentRoute('/report');
  };

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-primary">
          Settings
        </h2>
        <p className="text-xs text-secondary mt-0.5">
          Detection sensitivity, currency, date formatting, and local data handling.
        </p>
      </div>

      {/* Section 1: Privacy & Data Handling */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <Shield className="w-4 h-4 text-positive" />
          <span>Data handling & privacy</span>
        </div>
        <p className="text-xs text-secondary leading-relaxed">
          SubSentry operates on local transaction data in memory. No banking credentials, OAuth tokens, or external API relays are used.
        </p>
        <div className="p-3 rounded-lg bg-surface-subtle border border-border text-xs text-secondary">
          <strong>Explainability principle:</strong> Transparent scoring based on frequency, interval consistency, amount stability, and merchant identity verification.
        </div>
      </div>

      {/* Section 2: Recurrence Sensitivity */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <Sliders className="w-4 h-4 text-accent" />
            <span>Detection sensitivity threshold</span>
          </div>
          <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-surface-subtle border border-border">
            {sensitivity}%
          </span>
        </div>

        <p className="text-xs text-secondary">
          Payment patterns scoring at or above this threshold are classified as recurring.
        </p>

        <input
          type="range"
          min="70"
          max="95"
          value={sensitivity}
          onChange={(e) => setSensitivity(Number(e.target.value))}
          className="w-full accent-accent cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-muted font-mono">
          <span>70% (Inclusive - captures variable utility bills)</span>
          <span>85% (Standard)</span>
          <span>95% (Strict - exact fixed subscriptions only)</span>
        </div>
      </div>

      {/* Section 3: Currency Standard */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <DollarSign className="w-4 h-4 text-secondary" />
          <span>Currency formatting</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div
            onClick={() => setCurrency('INR')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              currency === 'INR'
                ? 'bg-accent-subtle/50 border-accent text-primary font-medium'
                : 'bg-surface-subtle border-border text-secondary'
            }`}
          >
            <div className="font-bold">Indian Rupee (₹ INR)</div>
            <div className="text-[11px] text-muted mt-0.5">Indian comma notation (e.g. ₹6,240)</div>
          </div>
          <div
            onClick={() => setCurrency('USD')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              currency === 'USD'
                ? 'bg-accent-subtle/50 border-accent text-primary font-medium'
                : 'bg-surface-subtle border-border text-secondary'
            }`}
          >
            <div className="font-bold">US Dollar ($ USD)</div>
            <div className="text-[11px] text-muted mt-0.5">International standard grouping</div>
          </div>
        </div>
      </div>

      {/* Section 4: Date Format */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <Calendar className="w-4 h-4 text-secondary" />
          <span>Date format</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div
            onClick={() => setDateFormat('DD/MM/YYYY')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              dateFormat === 'DD/MM/YYYY'
                ? 'bg-accent-subtle/50 border-accent text-primary font-medium'
                : 'bg-surface-subtle border-border text-secondary'
            }`}
          >
            <div className="font-bold">DD Mon YYYY (Default)</div>
            <div className="text-[11px] text-muted mt-0.5">e.g. 05 May 2026</div>
          </div>
          <div
            onClick={() => setDateFormat('YYYY-MM-DD')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              dateFormat === 'YYYY-MM-DD'
                ? 'bg-accent-subtle/50 border-accent text-primary font-medium'
                : 'bg-surface-subtle border-border text-secondary'
            }`}
          >
            <div className="font-bold">ISO Format (YYYY-MM-DD)</div>
            <div className="text-[11px] text-muted mt-0.5">e.g. 2026-05-05</div>
          </div>
        </div>
      </div>

      {/* Section 5: Data Management */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-4">
        <div className="text-sm font-bold text-primary">
          Data management
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={resetToSampleData}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary bg-surface-subtle hover:bg-surface-hover border border-border rounded-md transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-secondary" />
            <span>Load benchmark transactions</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-secondary hover:text-primary bg-surface hover:bg-surface-subtle border border-border rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>View printable report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
