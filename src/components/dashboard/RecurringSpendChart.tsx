import React, { useState } from 'react';
import { useSubSentry } from '../../context/SubSentryContext';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { RecurringPayment } from '../../types';
import { ArrowUpRight } from 'lucide-react';

export const RecurringSpendChart: React.FC = () => {
  const { recurringPayments, openEvidenceDrawer, monthlyRecurringSpend } = useSubSentry();
  const [hoveredMerchant, setHoveredMerchant] = useState<RecurringPayment | null>(null);

  // Sort descending by monthly cost
  const sorted = [...recurringPayments].sort((a, b) => b.monthlyCost - a.monthlyCost);
  const maxSpend = sorted[0]?.monthlyCost || 1;

  return (
    <div className="bg-surface rounded-xl border border-border p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-primary tracking-tight">
            Where the money repeats
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            Proportional monthly distribution across recurring merchants.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-secondary">Total Recurring</div>
          <div className="text-base font-bold text-primary tabular-nums">
            {formatCurrency(monthlyRecurringSpend)}
            <span className="text-xs font-normal text-secondary">/month</span>
          </div>
        </div>
      </div>

      {/* Proportional Bars List */}
      <div className="space-y-3 pt-2">
        {sorted.map((item) => {
          const percentage = Math.round((item.monthlyCost / monthlyRecurringSpend) * 100);
          const barWidthPercent = Math.max(10, Math.round((item.monthlyCost / maxSpend) * 100));

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredMerchant(item)}
              onMouseLeave={() => setHoveredMerchant(null)}
              onClick={() => openEvidenceDrawer(item)}
              className="group cursor-pointer p-2.5 -mx-2.5 rounded-lg hover:bg-surface-subtle transition-all duration-150 relative"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold text-primary group-hover:text-accent transition-colors truncate">
                    {item.merchant}
                  </span>
                  <span className="text-[11px] text-muted font-normal">
                    ({item.category})
                  </span>
                  {item.status === 'review' && (
                    <span className="text-[11px] font-semibold text-warning">
                      Review ↗
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-primary tabular-nums">
                    {formatCurrency(item.monthlyCost)}
                  </span>
                  <span className="text-[11px] font-mono text-secondary tabular-nums w-8 text-right">
                    {percentage}%
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-2 bg-surface-subtle rounded overflow-hidden border border-border/80">
                <div
                  className={`h-full rounded transition-all duration-300 ${
                    item.status === 'review'
                      ? 'bg-amber group-hover:bg-warning'
                      : 'bg-accent group-hover:bg-accent-hover'
                  }`}
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>

              {/* Precise Hover Tooltip Card */}
              {hoveredMerchant?.id === item.id && (
                <div className="hidden lg:block absolute left-1/2 -top-16 -translate-x-1/2 z-20 bg-primary text-surface p-2.5 rounded-lg shadow-dropdown text-xs pointer-events-none animate-in fade-in duration-100 min-w-[200px]">
                  <div className="font-bold flex items-center justify-between border-b border-surface/20 pb-1 mb-1">
                    <span>{item.merchant}</span>
                    <span className="text-accent font-mono">{item.recurrenceConfidence}% conf</span>
                  </div>
                  <div className="text-[11px] text-surface/80 flex items-center justify-between">
                    <span>Cadence: Every ~{item.averageIntervalDays} days</span>
                    <span className="tabular-nums font-semibold">{formatCurrency(item.monthlyCost)}</span>
                  </div>
                  <div className="text-[10px] text-surface/60 mt-0.5">
                    Last charged: {formatDate(item.lastPaymentDate)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
