import React from 'react';
import { useSubSentry } from '../context/SubSentryContext';
import { formatCurrency } from '../utils/currency';

export const InsightsPage: React.FC = () => {
  const { transactions, recurringPayments, monthlyRecurringSpend } = useSubSentry();

  // 1. Recurring vs One-time
  const totalSpend = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const recurringTransactionsTotal = transactions
    .filter((t) => t.isRecurring && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const oneTimeTotal = totalSpend - recurringTransactionsTotal;
  const recurringPercent = Math.round((recurringTransactionsTotal / totalSpend) * 100);
  const oneTimePercent = 100 - recurringPercent;

  // 2. Category distribution of recurring
  const categoryMap: Record<string, number> = {};
  recurringPayments.forEach((r) => {
    categoryMap[r.category] = (categoryMap[r.category] || 0) + r.monthlyCost;
  });

  const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-primary">
          Spending patterns
        </h2>
        <p className="text-xs text-secondary mt-0.5">
          Structural breakdown of recurring commitments vs one-off discretionary outflows.
        </p>
      </div>

      {/* Chart Grid: 2x2 Clean Analytical Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Recurring vs One-Time */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary uppercase tracking-tight">
              Recurring vs One-Time Capital Allocation
            </h3>
            <span className="text-xs font-mono text-secondary">40 Transactions</span>
          </div>

          <p className="text-xs text-secondary leading-relaxed">
            What proportion of transaction volume is locked into automated recurring cycles?
          </p>

          {/* Segmented Bar */}
          <div className="space-y-2 pt-2">
            <div className="w-full h-4 bg-surface-subtle rounded overflow-hidden border border-border flex">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${recurringPercent}%` }}
                title={`Recurring: ${recurringPercent}%`}
              />
              <div
                className="h-full bg-surface-hover transition-all duration-500"
                style={{ width: `${oneTimePercent}%` }}
                title={`One-time: ${oneTimePercent}%`}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-accent shrink-0"></span>
                <span className="text-primary font-medium">Recurring</span>
                <span className="font-mono text-secondary tabular-nums">
                  {formatCurrency(recurringTransactionsTotal)} ({recurringPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-border shrink-0"></span>
                <span className="text-primary font-medium">One-time</span>
                <span className="font-mono text-secondary tabular-nums">
                  {formatCurrency(oneTimeTotal)} ({oneTimePercent}%)
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-md bg-surface-subtle border border-border/70 text-xs text-secondary leading-relaxed">
            <strong>Key takeaway:</strong> Recurring commitments make up{' '}
            <strong className="text-primary font-semibold">{recurringPercent}%</strong> of observed transaction volume.
          </div>
        </div>

        {/* Card 2: Recurring Category Allocation */}
        <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary uppercase tracking-tight">
              Recurring Category Distribution
            </h3>
            <span className="text-xs font-mono text-secondary">Monthly Rate</span>
          </div>

          <p className="text-xs text-secondary leading-relaxed">
            Which product sectors account for recurring commitments?
          </p>

          <div className="space-y-3 pt-1">
            {categories.map(([cat, amount]) => {
              const pct = Math.round((amount / monthlyRecurringSpend) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-primary">{cat}</span>
                    <span className="font-mono text-secondary tabular-nums">
                      {formatCurrency(amount)}/mo • <strong>{pct}%</strong>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-subtle rounded overflow-hidden border border-border">
                    <div
                      className="h-full bg-accent rounded"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Merchant Concentration */}
        <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary uppercase tracking-tight">
              Merchant Concentration
            </h3>
            <span className="text-xs font-mono text-secondary">Top Outflows</span>
          </div>

          <p className="text-xs text-secondary leading-relaxed">
            Does recurring spend concentrate in a single dominant tool?
          </p>

          <div className="p-4 rounded-md bg-surface-subtle border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-secondary">Largest Single Commitment</div>
                <div className="text-base font-bold text-primary mt-0.5">
                  Adobe Creative Cloud
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-primary tabular-nums">
                  {formatCurrency(1675)}
                  <span className="text-xs font-normal text-secondary">/mo</span>
                </div>
                <div className="text-[11px] font-mono text-warning">27% of recurring spend</div>
              </div>
            </div>
            <div className="text-[11px] text-secondary border-t border-border/80 pt-2 leading-relaxed">
              Adobe accounts for over a quarter of recurring outflow and is currently flagged as a review candidate.
            </div>
          </div>
        </div>

        {/* Card 4: Billing Cadence Health */}
        <div className="bg-surface rounded-lg border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary uppercase tracking-tight">
              Cadence & Billing Regularity
            </h3>
            <span className="text-xs font-mono text-secondary">Interval Health</span>
          </div>

          <p className="text-xs text-secondary leading-relaxed">
            How strictly do merchants adhere to expected 30-day cycles?
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-surface-subtle border border-border">
              <div className="text-[10px] text-muted uppercase">Strict 30-Day Cycles</div>
              <div className="text-lg font-bold text-primary mt-1">6 of 7</div>
              <div className="text-[10px] text-positive mt-0.5 font-medium">85% consistency</div>
            </div>
            <div className="p-3 rounded-lg bg-surface-subtle border border-border">
              <div className="text-[10px] text-muted uppercase">Variable Cadence</div>
              <div className="text-lg font-bold text-primary mt-1">1 of 7</div>
              <div className="text-[10px] text-secondary mt-0.5 font-medium">AWS (30–32 days)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
