import React from 'react';
import { useSubSentry } from '../context/SubSentryContext';
import { formatCurrency } from '../utils/currency';
import { Printer, ArrowLeft } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const ReportPage: React.FC = () => {
  const {
    recurringPayments,
    reviewCandidates,
    monthlyRecurringSpend,
    annualizedRecurringSpend,
    recurringMerchantsCount,
    reviewCandidatesCount,
    datasetName,
    setCurrentRoute,
  } = useSubSentry();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      {/* Top action toolbar (hidden on print) */}
      <div className="print:hidden flex items-center justify-between">
        <button
          onClick={() => setCurrentRoute('/')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-surface bg-primary hover:bg-primary/90 rounded-md transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print or export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-surface rounded-lg border border-border p-8 md:p-10 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-primary text-surface font-mono font-bold text-xs flex items-center justify-center">
                SS
              </span>
              <span className="font-bold tracking-tight text-primary text-sm uppercase">
                SUBSENTRY
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-primary mt-2">
              Recurring Payment Analysis Report
            </h1>
            <p className="text-xs text-secondary mt-0.5">
              Verified transaction pattern intelligence & review manifest.
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-secondary space-y-0.5">
            <div>Analysis Date: <strong className="text-primary font-sans font-medium">19 May 2026</strong></div>
            <div>Dataset: <strong className="text-primary font-sans font-medium">{datasetName}</strong></div>
            <div>Status: <span className="text-positive font-sans font-semibold">Verified</span></div>
          </div>
        </div>

        {/* Executive Summary Figures */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg bg-surface-subtle border border-border">
            <div className="text-[10px] text-secondary uppercase font-semibold">Monthly Recurring</div>
            <div className="text-xl font-bold text-primary tabular-nums mt-1">
              {formatCurrency(monthlyRecurringSpend)}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-subtle border border-border">
            <div className="text-[10px] text-secondary uppercase font-semibold">Annualized Spend</div>
            <div className="text-xl font-bold text-primary tabular-nums mt-1">
              {formatCurrency(annualizedRecurringSpend)}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-subtle border border-border">
            <div className="text-[10px] text-secondary uppercase font-semibold">Recurring Merchants</div>
            <div className="text-xl font-bold text-primary mt-1">
              {recurringMerchantsCount}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-subtle border border-border">
            <div className="text-[10px] text-secondary uppercase font-semibold">Review Candidates</div>
            <div className="text-xl font-bold text-warning mt-1">
              {reviewCandidatesCount}
            </div>
          </div>
        </div>

        {/* Recurring Merchants Schedule */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
            1. Recurring Merchant Schedule
          </h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle/70 text-secondary uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-4 font-semibold">Merchant</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">Cadence</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Monthly Spend</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Confidence</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {recurringPayments.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2.5 px-4 font-medium text-primary">{r.merchant}</td>
                    <td className="py-2.5 px-3 text-secondary">{r.category}</td>
                    <td className="py-2.5 px-3 font-mono">Every ~{r.averageIntervalDays} days</td>
                    <td className="py-2.5 px-3 text-right font-bold text-primary tabular-nums">
                      {formatCurrency(r.monthlyCost)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">{r.recurrenceConfidence}%</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={r.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Candidates Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
            2. Review Candidates & Potential Action Items
          </h3>
          <div className="space-y-2.5">
            {reviewCandidates.map((c) => (
              <div key={c.id} className="p-3.5 rounded-lg border border-border bg-surface-subtle/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-primary flex items-center gap-2">
                    <span>{c.merchant}</span>
                    <span className="font-normal text-secondary">({formatCurrency(c.monthlyCost)}/mo)</span>
                  </div>
                  <span className="font-mono text-warning font-medium">Confidence: {c.confidence}%</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  {c.reason}
                </p>
                <div className="text-[11px] text-muted flex items-center gap-2">
                  <span>Matched {c.consecutivePayments} consecutive charges</span>
                  <span>•</span>
                  <span>Cumulative spend: {formatCurrency(c.totalSpent)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology & Verification */}
        <div className="space-y-2 border-t border-border pt-5 text-xs text-secondary">
          <h3 className="font-bold text-primary uppercase text-[11px] tracking-wider">
            3. Detection Methodology & Governance
          </h3>
          <p className="leading-relaxed text-[11px]">
            SubSentry computes recurrence through a deterministic 4-factor scoring framework: 30% frequency consistency, 30% interval regularity, 25% amount variance stability, and 15% raw descriptor token clustering. The system identifies candidate patterns; all retainment or cancellation decisions rest with the user.
          </p>
        </div>

        {/* Report Footer */}
        <div className="border-t border-border/80 pt-4 flex items-center justify-between text-[11px] text-muted font-mono">
          <span>Analysis based on supplied transaction data.</span>
          <span>SubSentry Protocol v1.0 • Confidential</span>
        </div>
      </div>
    </div>
  );
};
