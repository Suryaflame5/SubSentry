import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSubSentry } from '../../context/SubSentryContext';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';

export const TransactionDetailDrawer: React.FC = () => {
  const {
    selectedTransaction,
    closeTransactionDetail,
    recurringPayments,
    transactions,
    openEvidenceDrawer,
  } = useSubSentry();

  if (!selectedTransaction) return null;

  // Find parent recurring pattern if exists
  const recurringPattern = recurringPayments.find(
    (r) =>
      r.merchant === selectedTransaction.merchantNormalized ||
      r.transactionIds.includes(selectedTransaction.id)
  );

  const relatedTransactions = transactions.filter(
    (t) =>
      t.merchantNormalized === selectedTransaction.merchantNormalized &&
      t.id !== selectedTransaction.id
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-primary/25 backdrop-blur-xs"
        onClick={closeTransactionDetail}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-border shadow-drawer flex flex-col justify-between animate-in slide-in-from-right duration-250 ease-out">
          {/* Header */}
          <div className="p-6 border-b border-border bg-surface">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  Transaction Audit
                </div>
                <h2 className="text-xl font-bold text-primary mt-1">
                  {selectedTransaction.merchantNormalized}
                </h2>
                <div className="text-2xl font-bold text-primary tabular-nums mt-1">
                  {formatCurrency(selectedTransaction.amount)}
                </div>
              </div>
              <button
                onClick={closeTransactionDetail}
                className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface-subtle"
                aria-label="Close transaction detail"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <StatusBadge status={selectedTransaction.status} />
              {selectedTransaction.isRecurring && (
                <ConfidenceBadge confidence={selectedTransaction.recurrenceConfidence} size="sm" />
              )}
            </div>
          </div>

          {/* Details Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/50">
            {/* Raw Normalization Trace */}
            <div className="bg-surface rounded-lg border border-border p-4 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Original Transaction String
              </div>
              <div className="p-2.5 rounded bg-surface-subtle border border-border font-mono text-xs text-primary break-all">
                {selectedTransaction.merchantRaw}
              </div>
              <div className="text-[11px] text-muted flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-positive" />
                Normalized into <strong>{selectedTransaction.merchantNormalized}</strong>
              </div>
            </div>

            {/* Core Metadata */}
            <div className="bg-surface rounded-lg border border-border divide-y divide-border/60 text-xs">
              <div className="p-3 flex justify-between">
                <span className="text-secondary">Posting Date</span>
                <span className="font-semibold text-primary font-mono">
                  {formatDate(selectedTransaction.date)}
                </span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-secondary">Category</span>
                <span className="font-semibold text-primary">
                  {selectedTransaction.category}
                </span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-secondary">Payment Method</span>
                <span className="font-semibold text-primary">
                  {selectedTransaction.paymentMethod || 'Visa Direct'}
                </span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-secondary">Transaction ID</span>
                <span className="font-mono text-muted">
                  {selectedTransaction.id}
                </span>
              </div>
            </div>

            {/* Pattern Context */}
            {recurringPattern && (
              <div className="bg-surface rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Pattern Context
                  </div>
                  <button
                    onClick={() => {
                      closeTransactionDetail();
                      openEvidenceDrawer(recurringPattern);
                    }}
                    className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
                  >
                    <span>Full Evidence</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-surface-subtle border border-border">
                    <div className="text-[10px] text-secondary uppercase">Average Cadence</div>
                    <div className="font-bold text-primary mt-0.5">
                      ~{recurringPattern.averageIntervalDays} days
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-surface-subtle border border-border">
                    <div className="text-[10px] text-secondary uppercase">Monthly Spend</div>
                    <div className="font-bold text-primary mt-0.5">
                      {formatCurrency(recurringPattern.monthlyCost)}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-secondary">
                  Next projected billing: <strong className="text-primary font-mono">{formatDate(recurringPattern.nextExpectedDate)}</strong>
                </div>
              </div>
            )}

            {/* Related Cycle Transactions */}
            {relatedTransactions.length > 0 && (
              <div className="bg-surface rounded-lg border border-border p-4 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Other Cycle Occurrences ({relatedTransactions.length})
                </div>
                <div className="space-y-1 pt-1">
                  {relatedTransactions.map((rel) => (
                    <div
                      key={rel.id}
                      className="flex items-center justify-between p-2 rounded bg-surface-subtle text-xs"
                    >
                      <span className="font-mono text-secondary">{formatDate(rel.date)}</span>
                      <span className="font-semibold text-primary tabular-nums">
                        {formatCurrency(rel.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-surface flex items-center justify-end">
            <button
              onClick={closeTransactionDetail}
              className="px-4 py-2 text-xs font-medium text-secondary hover:text-primary rounded-md border border-border hover:bg-surface-subtle transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
