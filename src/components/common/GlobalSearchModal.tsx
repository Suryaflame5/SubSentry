import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useSubSentry } from '../../context/SubSentryContext';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    recurringPayments,
    transactions,
    openEvidenceDrawer,
    openTransactionDetail,
    setCurrentRoute,
  } = useSubSentry();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedRecurrings = q
    ? recurringPayments.filter(
        (r) =>
          r.merchant.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.rawDescriptors.some((d) => d.toLowerCase().includes(q))
      )
    : recurringPayments.slice(0, 4);

  const matchedTransactions = q
    ? transactions
        .filter(
          (t) =>
            t.merchantNormalized.toLowerCase().includes(q) ||
            t.merchantRaw.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q)
        )
        .slice(0, 5)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-surface rounded-xl border border-border shadow-dropdown overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-surface">
          <Search className="w-5 h-5 text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recurring merchants, raw transaction text, categories..."
            className="w-full bg-transparent text-sm text-primary placeholder:text-muted focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-muted hover:text-primary transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] text-muted border border-border px-1.5 py-0.5 rounded font-mono bg-surface-subtle shrink-0">
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-[420px] overflow-y-auto p-2 divide-y divide-border/40">
          {/* Recurring Merchants Section */}
          <div className="py-2">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-secondary uppercase tracking-wider flex items-center justify-between">
              <span>Recurring Subscriptions & Patterns</span>
              <span className="text-[10px] lowercase text-muted">
                {matchedRecurrings.length} found
              </span>
            </div>
            {matchedRecurrings.length > 0 ? (
              <div className="space-y-1 mt-1">
                {matchedRecurrings.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      openEvidenceDrawer(rec);
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-subtle cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-md bg-surface-subtle border border-border flex items-center justify-center font-medium text-xs text-primary group-hover:border-accent">
                        {rec.logoText}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-primary group-hover:text-accent truncate flex items-center gap-1.5">
                          {rec.merchant}
                          {rec.status === 'review' && (
                            <span className="text-[10px] text-warning bg-warning-subtle border border-warning-border px-1 rounded">
                              Review
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-secondary truncate">
                          {rec.category} • Every ~{rec.averageIntervalDays} days • {rec.transactionCount} payments
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-3">
                      <div>
                        <div className="text-xs font-semibold text-primary tabular-nums">
                          {formatCurrency(rec.monthlyCost)}
                          <span className="text-[10px] text-secondary font-normal">/mo</span>
                        </div>
                        <div className="text-[10px] text-positive font-mono">
                          {rec.recurrenceConfidence}% conf
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-3 py-4 text-xs text-muted text-center">
                No recurring merchants match "{query}"
              </div>
            )}
          </div>

          {/* Transactions Section */}
          {matchedTransactions.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-secondary uppercase tracking-wider flex items-center justify-between">
                <span>Transactions</span>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setCurrentRoute('/transactions');
                  }}
                  className="text-[11px] text-accent hover:underline lowercase font-normal"
                >
                  view all ledger
                </button>
              </div>
              <div className="space-y-1 mt-1">
                {matchedTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      openTransactionDetail(tx);
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-subtle cursor-pointer transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-primary group-hover:text-accent truncate">
                        {tx.merchantNormalized}
                        <span className="text-[11px] text-muted ml-2 font-mono">
                          {tx.merchantRaw}
                        </span>
                      </div>
                      <div className="text-[11px] text-secondary truncate">
                        {formatDate(tx.date)} • {tx.category}
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-primary tabular-nums shrink-0 ml-3">
                      {formatCurrency(tx.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-surface-subtle border-t border-border flex items-center justify-between text-[11px] text-secondary">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px] font-mono">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px] font-mono ml-1">
                ↓
              </kbd>{' '}
              to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px] font-mono">
                ↵
              </kbd>{' '}
              to select
            </span>
          </div>
          <span className="font-mono text-muted text-[10px]">SubSentry</span>
        </div>
      </div>
    </div>
  );
};
