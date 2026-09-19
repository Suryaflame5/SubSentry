import React from 'react';
import { useSubSentry } from '../../context/SubSentryContext';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { ArrowRight, ChevronRight } from 'lucide-react';

export const RepeatingMerchantsTable: React.FC = () => {
  const { recurringPayments, openEvidenceDrawer, setCurrentRoute } = useSubSentry();

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden shadow-xs">
      <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-primary tracking-tight">
              Recurring merchants
            </h3>
            <span className="text-xs text-secondary font-medium tabular-nums">
              ({recurringPayments.length} patterns)
            </span>
          </div>
          <p className="text-xs text-secondary mt-0.5">
            Verified from normalized transaction intervals and amount stability.
          </p>
        </div>

        <button
          onClick={() => setCurrentRoute('/recurring')}
          className="text-xs font-semibold text-accent hover:text-accent-hover flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <span>View all recurring</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Responsive Table / List View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-subtle/60 text-secondary font-medium uppercase tracking-wider text-[11px]">
              <th className="py-3 px-5">Merchant Identity</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Recurrence Pattern</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Confidence</th>
              <th className="py-3 px-4">Last Charged</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {recurringPayments.map((rec) => (
              <tr
                key={rec.id}
                onClick={() => openEvidenceDrawer(rec)}
                className="hover:bg-surface-subtle/80 cursor-pointer transition-colors group"
              >
                {/* Merchant */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-surface border border-border flex items-center justify-center font-bold text-xs text-primary shadow-2xs group-hover:border-accent shrink-0">
                      {rec.logoText}
                    </div>
                    <div>
                      <div className="font-semibold text-primary group-hover:text-accent transition-colors">
                        {rec.merchant}
                      </div>
                      <div className="text-[11px] text-muted font-mono truncate max-w-[160px]">
                        {rec.rawDescriptors[0]}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 text-secondary">
                  {rec.category}
                </td>

                {/* Recurrence Pattern */}
                <td className="py-3.5 px-4 font-mono text-primary font-medium">
                  Every ~{rec.averageIntervalDays} days
                </td>

                {/* Amount */}
                <td className="py-3.5 px-4 text-right font-bold text-primary tabular-nums">
                  {formatCurrency(rec.monthlyCost)}
                  <span className="text-[10px] text-secondary font-normal ml-0.5">/mo</span>
                </td>

                {/* Confidence */}
                <td className="py-3.5 px-4 text-center">
                  <ConfidenceBadge confidence={rec.recurrenceConfidence} size="sm" />
                </td>

                {/* Last Charged */}
                <td className="py-3.5 px-4 text-secondary font-mono text-[11px]">
                  {formatDate(rec.lastPaymentDate)}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <StatusBadge status={rec.status} size="sm" />
                </td>

                {/* Action */}
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
