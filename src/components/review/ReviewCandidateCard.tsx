import React from 'react';
import { ReviewCandidate } from '../../types';
import { useSubSentry } from '../../context/SubSentryContext';
import { formatCurrency } from '../../utils/currency';
import { Check, EyeOff, ArrowRight, Clock } from 'lucide-react';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { StatusBadge } from '../common/StatusBadge';

interface ReviewCandidateCardProps {
  candidate: ReviewCandidate;
}

export const ReviewCandidateCard: React.FC<ReviewCandidateCardProps> = ({ candidate }) => {
  const { openEvidenceDrawer, keepCandidate, dismissCandidate, markCandidateForReview } =
    useSubSentry();

  const isResolved = candidate.status !== 'review';

  return (
    <div
      className={`bg-surface rounded-lg border p-6 transition-all duration-150 ${
        isResolved ? 'border-border/60 opacity-80' : 'border-border'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        {/* Left Core Summary */}
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <StatusBadge status={candidate.status} />
              <span className="text-border">•</span>
              <ConfidenceBadge confidence={candidate.confidence} />
            </div>
            <h3 className="text-lg font-bold text-primary tracking-tight">
              {candidate.merchant}
            </h3>
            <p className="text-xs text-secondary leading-relaxed max-w-2xl">
              {candidate.reason}
            </p>
          </div>

          {/* Structured Financial Summary Row with Subtle Separators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-y border-border/70 text-xs">
            <div>
              <div className="text-[10px] text-secondary uppercase font-medium">Monthly amount</div>
              <div className="text-sm font-bold text-primary tabular-nums mt-0.5">
                {formatCurrency(candidate.monthlyCost)}
              </div>
            </div>
            <div className="sm:border-l sm:border-border/70 sm:pl-4">
              <div className="text-[10px] text-secondary uppercase font-medium">Cadence</div>
              <div className="text-sm font-bold text-primary mt-0.5">
                ~{candidate.averageIntervalDays} days
              </div>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l sm:border-border/70 pt-2 sm:pt-0 sm:pl-4">
              <div className="text-[10px] text-secondary uppercase font-medium">Payments</div>
              <div className="text-sm font-bold text-primary mt-0.5">
                {candidate.consecutivePayments} consecutive
              </div>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l sm:border-border/70 pt-2 sm:pt-0 sm:pl-4">
              <div className="text-[10px] text-secondary uppercase font-medium">Total spend</div>
              <div className="text-sm font-bold text-primary tabular-nums mt-0.5">
                {formatCurrency(candidate.totalSpent)}
              </div>
            </div>
          </div>

          {/* Why this was detected */}
          <div className="pt-1">
            <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
              Why this was detected
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {candidate.evidenceChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-primary">
                  <span className="text-positive font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Decision Action Buttons */}
        <div className="flex flex-col gap-2 shrink-0 sm:w-48 lg:w-44 pt-2 lg:pt-0">
          <button
            onClick={() => openEvidenceDrawer(candidate.merchant)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-surface bg-primary hover:bg-primary/90 rounded-md transition-all shadow-xs group"
          >
            <span>Inspect evidence</span>
            <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-surface group-hover:translate-x-0.5 transition-all" />
          </button>

          {candidate.status === 'review' ? (
            <>
              <button
                onClick={() => keepCandidate(candidate.id)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-accent-hover bg-accent-subtle hover:bg-accent/20 border border-accent-border rounded-md transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Keep subscription</span>
              </button>

              <button
                onClick={() => dismissCandidate(candidate.id)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-secondary hover:text-primary bg-surface-subtle hover:bg-surface-hover border border-border rounded-md transition-colors"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Dismiss</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => markCandidateForReview(candidate.id)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-warning hover:text-warning/80 bg-warning-subtle border border-warning-border rounded-md transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Re-open review</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
