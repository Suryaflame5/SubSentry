import React, { useState } from 'react';
import { X, Check, EyeOff, FileSpreadsheet } from 'lucide-react';
import { useSubSentry } from '../../context/SubSentryContext';
import { RecurrenceTimeline } from './RecurrenceTimeline';
import { ConfidenceBreakdown } from './ConfidenceBreakdown';
import { NormalizationTrace } from './NormalizationTrace';
import { formatCurrency } from '../../utils/currency';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';

export const EvidenceDrawer: React.FC = () => {
  const {
    selectedEvidenceMerchant,
    closeEvidenceDrawer,
    transactions,
    reviewCandidates,
    keepCandidate,
    dismissCandidate,
    setCurrentRoute,
  } = useSubSentry();

  const [activeTab, setActiveTab] = useState<'timeline' | 'scoring' | 'normalization'>('timeline');

  if (!selectedEvidenceMerchant) return null;

  const matchedTransactions = transactions.filter(
    (t) =>
      selectedEvidenceMerchant.transactionIds.includes(t.id) ||
      t.merchantNormalized === selectedEvidenceMerchant.merchant
  );

  const candidate = reviewCandidates.find(
    (c) =>
      c.recurringPaymentId === selectedEvidenceMerchant.id ||
      c.merchant === selectedEvidenceMerchant.merchant
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/25 backdrop-blur-xs transition-opacity"
        onClick={closeEvidenceDrawer}
      />

      {/* Slide-out Instrument Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-surface border-l border-border shadow-drawer flex flex-col justify-between animate-in slide-in-from-right duration-250 ease-out">
          {/* Header */}
          <div className="p-6 border-b border-border bg-surface">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-lg bg-surface-subtle border border-border flex items-center justify-center font-bold text-base text-primary shadow-xs">
                  {selectedEvidenceMerchant.logoText}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-primary tracking-tight">
                      {selectedEvidenceMerchant.merchant}
                    </h2>
                    <StatusBadge status={selectedEvidenceMerchant.status} size="sm" />
                  </div>
                  <div className="text-xs text-secondary mt-0.5 flex items-center gap-2">
                    <span>{selectedEvidenceMerchant.category}</span>
                    <span>•</span>
                    <span>Every ~{selectedEvidenceMerchant.averageIntervalDays} days</span>
                    <span>•</span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(selectedEvidenceMerchant.monthlyCost)}/mo
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={closeEvidenceDrawer}
                className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface-subtle transition-colors"
                aria-label="Close evidence drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recurrence Confidence and Summary */}
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <ConfidenceBadge confidence={selectedEvidenceMerchant.recurrenceConfidence} />
              <span className="font-mono text-secondary tabular-nums">
                {selectedEvidenceMerchant.transactionCount} matched payments
              </span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-4 pt-2 border-t border-border/60">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'timeline'
                    ? 'bg-primary text-surface'
                    : 'text-secondary hover:text-primary hover:bg-surface-subtle'
                }`}
              >
                Payment Timeline ({matchedTransactions.length})
              </button>
              <button
                onClick={() => setActiveTab('scoring')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'scoring'
                    ? 'bg-primary text-surface'
                    : 'text-secondary hover:text-primary hover:bg-surface-subtle'
                }`}
              >
                Scoring Logic (4 Factors)
              </button>
              <button
                onClick={() => setActiveTab('normalization')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'normalization'
                    ? 'bg-primary text-surface'
                    : 'text-secondary hover:text-primary hover:bg-surface-subtle'
                }`}
              >
                Merchant Normalization
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/50">
            {activeTab === 'timeline' && (
              <RecurrenceTimeline
                transactions={matchedTransactions}
                merchantName={selectedEvidenceMerchant.merchant}
              />
            )}

            {activeTab === 'scoring' && (
              <ConfidenceBreakdown evidence={selectedEvidenceMerchant.evidence} />
            )}

            {activeTab === 'normalization' && (
              <NormalizationTrace
                rawDescriptors={selectedEvidenceMerchant.rawDescriptors}
                normalizedName={selectedEvidenceMerchant.merchant}
                category={selectedEvidenceMerchant.category}
              />
            )}
          </div>

          {/* Action Footer */}
          <div className="p-5 border-t border-border bg-surface flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-secondary">
              {candidate ? (
                <span>
                  Status: <strong className="capitalize text-primary">{candidate.status}</strong>
                </span>
              ) : (
                <span>Recurring Monitoring Active</span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {candidate && (
                <>
                  <button
                    onClick={() => {
                      keepCandidate(candidate.id);
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md bg-accent-subtle text-accent-hover hover:bg-accent/20 border border-accent-border transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Keep Subscription</span>
                  </button>

                  <button
                    onClick={() => {
                      dismissCandidate(candidate.id);
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md bg-surface-subtle text-secondary hover:text-primary border border-border transition-colors"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Dismiss</span>
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  closeEvidenceDrawer();
                  setCurrentRoute('/transactions');
                }}
                className="p-2 text-secondary hover:text-primary rounded-md border border-border hover:bg-surface-subtle transition-colors"
                title="View in full ledger"
              >
                <FileSpreadsheet className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
