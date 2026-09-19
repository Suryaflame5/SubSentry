import React from 'react';
import { useSubSentry } from '../context/SubSentryContext';
import { formatCurrency } from '../utils/currency';
import { ArrowRight } from 'lucide-react';

export const MerchantsPage: React.FC = () => {
  const { transactions, recurringPayments, openEvidenceDrawer } = useSubSentry();

  // Group transactions by normalized merchant
  const merchantMap = new Map<
    string,
    {
      normalizedName: string;
      category: string;
      rawVariants: Set<string>;
      transactionCount: number;
      totalSpent: number;
      isRecurring: boolean;
      confidence: number;
      recurringId?: string;
    }
  >();

  transactions.forEach((tx) => {
    const existing = merchantMap.get(tx.merchantNormalized) || {
      normalizedName: tx.merchantNormalized,
      category: tx.category,
      rawVariants: new Set<string>(),
      transactionCount: 0,
      totalSpent: 0,
      isRecurring: false,
      confidence: 0,
    };

    existing.rawVariants.add(tx.merchantRaw);
    existing.transactionCount += 1;
    existing.totalSpent += tx.amount;

    const matchingRecurring = recurringPayments.find(
      (r) => r.merchant === tx.merchantNormalized
    );
    if (matchingRecurring) {
      existing.isRecurring = true;
      existing.confidence = matchingRecurring.recurrenceConfidence;
      existing.recurringId = matchingRecurring.id;
    }

    merchantMap.set(tx.merchantNormalized, existing);
  });

  const merchants = Array.from(merchantMap.values()).sort(
    (a, b) => b.totalSpent - a.totalSpent
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-primary">
          Merchants
        </h2>
        <p className="text-xs text-secondary mt-0.5">
          Normalized merchant identities from transaction descriptions.
        </p>
      </div>

      {/* Directory Table */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border bg-surface flex items-center justify-between text-xs text-secondary">
          <span className="font-semibold text-primary">
            {merchants.length} Normalized Merchants
          </span>
          <span className="font-mono text-[11px]">Rule-based token normalization</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/50 text-secondary font-medium uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">Normalized Merchant</th>
                <th className="py-3 px-4">Raw Descriptor</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Tx Count</th>
                <th className="py-3 px-4 text-right">Total Outflow</th>
                <th className="py-3 px-4 text-center">Pattern Status</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {merchants.map((m) => (
                <tr
                  key={m.normalizedName}
                  onClick={() => {
                    if (m.isRecurring) openEvidenceDrawer(m.normalizedName);
                  }}
                  className={`hover:bg-surface-subtle/80 transition-colors group ${
                    m.isRecurring ? 'cursor-pointer' : ''
                  }`}
                >
                  <td className="py-3.5 px-5 font-semibold text-primary group-hover:text-accent transition-colors">
                    {m.normalizedName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-secondary truncate max-w-[200px]">
                    {Array.from(m.rawVariants)[0]}
                  </td>
                  <td className="py-3.5 px-4 text-secondary">{m.category}</td>
                  <td className="py-3.5 px-4 text-center font-mono">{m.transactionCount}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-primary tabular-nums">
                    {formatCurrency(m.totalSpent)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {m.isRecurring ? (
                      <span className="text-[11px] font-semibold text-positive">
                        Recurring ({m.confidence}%)
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted">One-time</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {m.isRecurring && (
                      <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all inline-block" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
