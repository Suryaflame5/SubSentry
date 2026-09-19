import React, { useState } from 'react';
import { useSubSentry } from '../context/SubSentryContext';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { ArrowRight } from 'lucide-react';

export const RecurringPage: React.FC = () => {
  const {
    recurringPayments,
    monthlyRecurringSpend,
    annualizedRecurringSpend,
    recurringMerchantsCount,
    totalTransactionsCount,
    openEvidenceDrawer,
  } = useSubSentry();

  const [filterCadence, setFilterCadence] = useState<'All' | 'Monthly' | 'Variable'>('All');

  const filtered = recurringPayments.filter((r) => {
    if (filterCadence === 'All') return true;
    return r.cadence === filterCadence;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-primary">
          Recurring payments
        </h2>
        <p className="text-xs text-secondary mt-0.5">
          Active subscriptions, services, and cadenced recurring commitments.
        </p>
      </div>

      {/* Top 3 Summary Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-lg border border-border p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Monthly recurring spend
          </div>
          <div className="text-2xl font-bold text-primary tabular-nums mt-1">
            {formatCurrency(monthlyRecurringSpend)}
          </div>
          <div className="text-[11px] text-muted mt-0.5">
            Active monthly recurring obligation
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Annualized estimate
          </div>
          <div className="text-2xl font-bold text-primary tabular-nums mt-1">
            {formatCurrency(annualizedRecurringSpend)}
          </div>
          <div className="text-[11px] text-muted mt-0.5">
            12-month projection based on current cadence
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Recurring merchants
          </div>
          <div className="text-2xl font-bold text-primary tabular-nums mt-1">
            {recurringMerchantsCount}
          </div>
          <div className="text-[11px] text-muted mt-0.5">
            Verified across {totalTransactionsCount} analyzed transactions
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-surface p-1 rounded-lg border border-border text-xs">
          <button
            onClick={() => setFilterCadence('All')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterCadence === 'All'
                ? 'bg-surface-subtle text-primary font-semibold shadow-xs'
                : 'text-secondary hover:text-primary'
            }`}
          >
            All Subscriptions ({recurringPayments.length})
          </button>
          <button
            onClick={() => setFilterCadence('Monthly')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterCadence === 'Monthly'
                ? 'bg-surface-subtle text-primary font-semibold shadow-xs'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Monthly Cadence
          </button>
        </div>

        <span className="text-xs text-muted font-mono hidden sm:inline">
          Click any card to inspect evidence
        </span>
      </div>

      {/* Grid of Recurring Payments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => openEvidenceDrawer(item)}
            className="bg-surface rounded-lg border border-border hover:border-accent/60 p-5 shadow-xs hover:shadow-card cursor-pointer transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-subtle border border-border flex items-center justify-center font-bold text-sm text-primary group-hover:border-accent shadow-xs">
                    {item.logoText}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-primary group-hover:text-accent transition-colors">
                      {item.merchant}
                    </h3>
                    <div className="text-xs text-secondary">{item.category}</div>
                  </div>
                </div>

                <StatusBadge status={item.status} size="sm" />
              </div>

              {/* Financial Metrics */}
              <div className="mt-4 pt-3 border-t border-border/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-muted uppercase">Cadence</div>
                  <div className="font-semibold text-primary mt-0.5">
                    Every ~{item.averageIntervalDays} days
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted uppercase">Monthly Cost</div>
                  <div className="font-bold text-primary tabular-nums mt-0.5 text-sm">
                    {formatCurrency(item.monthlyCost)}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-secondary">
                <span>Last payment:</span>
                <span className="font-mono text-primary font-medium">{formatDate(item.lastPaymentDate)}</span>
              </div>
            </div>

            {/* Bottom Confidence & Action */}
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
              <ConfidenceBadge confidence={item.recurrenceConfidence} size="sm" />
              <span className="text-xs font-medium text-accent group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                <span>Evidence</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
