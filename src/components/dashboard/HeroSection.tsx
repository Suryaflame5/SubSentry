import React from 'react';
import { ArrowRight, AlertTriangle, ListFilter, Database } from 'lucide-react';
import { useSubSentry } from '../../context/SubSentryContext';

export const HeroSection: React.FC = () => {
  const { setCurrentRoute, totalTransactionsCount, reviewCandidatesCount, recurringMerchantsCount } = useSubSentry();

  return (
    <div className="bg-surface rounded-lg border border-border p-6 md:p-8 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Headline */}
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Pattern analysis
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Recurring spending, uncovered.
          </h2>

          <p className="text-sm text-secondary leading-relaxed">
            SubSentry found {recurringMerchantsCount} recurring payment patterns across your transaction history.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted font-mono">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-secondary" />
              <span>{totalTransactionsCount} transactions analyzed</span>
            </span>
            <span>•</span>
            <span>Last analyzed: <strong className="text-primary font-semibold font-sans">Today, 10:42 AM</strong></span>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            onClick={() => setCurrentRoute('/review')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-surface bg-primary hover:bg-primary/90 rounded-md transition-all shadow-xs group"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
            <span>Review candidates ({reviewCandidatesCount})</span>
            <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-surface group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => setCurrentRoute('/transactions')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium text-primary hover:text-primary bg-surface-subtle hover:bg-surface-hover border border-border rounded-md transition-colors"
          >
            <ListFilter className="w-3.5 h-3.5 text-secondary" />
            <span>View transactions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
