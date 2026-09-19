import React from 'react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { formatShortMonthDay, getDaysBetween } from '../../utils/date';
import { ArrowDown } from 'lucide-react';

interface RecurrenceTimelineProps {
  transactions: Transaction[];
  merchantName?: string;
}

export const RecurrenceTimeline: React.FC<RecurrenceTimelineProps> = ({
  transactions,
}) => {
  // Sort transactions ascending by date
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalSpent = sorted.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary">
          Payment history
        </h4>
        <span className="text-xs text-secondary font-mono">
          {sorted.length} payments matched
        </span>
      </div>

      {/* Summary Banner */}
      <div className="bg-surface rounded-lg border border-border p-3.5 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-medium text-secondary uppercase tracking-wider">
            Total pattern spend
          </div>
          <div className="text-xl font-bold text-primary tabular-nums tracking-tight">
            {formatCurrency(totalSpent)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-medium text-secondary uppercase tracking-wider">
            Average interval
          </div>
          <div className="text-sm font-semibold text-primary">
            ~30 days
          </div>
        </div>
      </div>

      {/* Vertical Connected Node Timeline */}
      <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
        {sorted.map((tx, idx) => {
          const prevTx = idx > 0 ? sorted[idx - 1] : null;
          const intervalDays = prevTx ? getDaysBetween(prevTx.date, tx.date) : null;

          return (
            <React.Fragment key={tx.id}>
              {/* Interval Connector between nodes */}
              {intervalDays !== null && (
                <div className="relative -ml-6 py-1 flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-surface-subtle border border-border flex items-center justify-center z-10 shrink-0 text-secondary">
                    <ArrowDown className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-[11px] font-mono text-secondary font-medium">
                    {intervalDays} days
                  </span>
                </div>
              )}

              {/* Payment Node Card */}
              <div className="relative group">
                {/* Node indicator */}
                <div className="absolute -left-[18px] top-3.5 w-2 h-2 rounded-xs bg-accent border border-surface z-10"></div>

                <div className="bg-surface rounded-lg border border-border p-3 hover:border-accent/40 transition-colors shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-primary px-1.5 py-0.5 rounded bg-surface-subtle border border-border">
                        {formatShortMonthDay(tx.date)}
                      </span>
                      <span className="text-xs text-secondary font-mono">
                        {tx.date}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-primary tabular-nums">
                      {formatCurrency(tx.amount)}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-secondary">
                    <span className="truncate max-w-[220px]" title={tx.description}>
                      {tx.description}
                    </span>
                    <span className="text-muted font-mono shrink-0 ml-2">
                      {tx.paymentMethod || 'Card'}
                    </span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
