import React from 'react';
import { useSubSentry } from '../../context/SubSentryContext';
import { formatCurrency } from '../../utils/currency';
import { Check, ArrowRight } from 'lucide-react';
import { ConfidenceBadge } from '../common/ConfidenceBadge';

export const CandidateHighlightCard: React.FC = () => {
  const { reviewCandidates, openEvidenceDrawer, keepCandidate, dismissCandidate } = useSubSentry();

  const adobeCandidate = reviewCandidates.find((c) => c.merchant === 'Adobe Creative Cloud');
  if (!adobeCandidate || adobeCandidate.status !== 'review') return null;

  return (
    <div className="bg-surface rounded-lg border border-warning/50 p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Info */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-warning">Review candidate</span>
            <span className="text-border">•</span>
            <ConfidenceBadge confidence={adobeCandidate.confidence} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-primary tracking-tight">
              {adobeCandidate.merchant}
            </h3>
            <p className="text-xs text-secondary mt-1 max-w-xl leading-relaxed">
              {adobeCandidate.reason}
            </p>
          </div>

          {/* Structured Financial Summary Row with Subtle Separators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-y border-border/70 text-xs">
            <div>
              <div className="text-[10px] text-secondary uppercase font-medium">Monthly amount</div>
              <div className="text-sm font-bold text-primary tabular-nums mt-0.5">
                {formatCurrency(adobeCandidate.monthlyCost)}
              </div>
            </div>
            <div className="sm:border-l sm:border-border/70 sm:pl-4">
              <div className="text-[10px] text-secondary uppercase font-medium">Cadence</div>
              <div className="text-sm font-bold text-primary mt-0.5">
                ~{adobeCandidate.averageIntervalDays} days
              </div>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l sm:border-border/70 pt-2 sm:pt-0 sm:pl-4">
              <div className="text-[10px] text-secondary uppercase font-medium">Payments</div>
              <div className="text-sm font-bold text-primary mt-0.5">
                {adobeCandidate.consecutivePayments} consecutive
              </div>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l sm:border-border/70 pt-2 sm:pt-0 sm:pl-4">
              <div className="text-[10px] text-secondary uppercase font-medium">Total spend</div>
              <div className="text-sm font-bold text-primary tabular-nums mt-0.5">
                {formatCurrency(adobeCandidate.totalSpent)}
              </div>
            </div>
          </div>
        </div>

        {/* Right CTA Decision buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            onClick={() => openEvidenceDrawer('Adobe Creative Cloud')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-surface bg-primary hover:bg-primary/90 rounded-md transition-all shadow-xs group"
          >
            <span>Inspect evidence</span>
            <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-surface group-hover:translate-x-0.5 transition-all" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => keepCandidate(adobeCandidate.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-accent hover:bg-surface-subtle border border-border rounded-md transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Keep</span>
            </button>
            <button
              onClick={() => dismissCandidate(adobeCandidate.id)}
              className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-secondary hover:text-primary bg-surface-subtle hover:bg-surface-hover border border-border rounded-md transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
