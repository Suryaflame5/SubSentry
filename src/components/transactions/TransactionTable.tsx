import React, { useState, useMemo } from 'react';
import { useSubSentry } from '../../context/SubSentryContext';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { Search, ArrowUpDown, ChevronRight, X } from 'lucide-react';

export const TransactionTable: React.FC = () => {
  const { transactions, openTransactionDetail } = useSubSentry();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [recurringFilter, setRecurringFilter] = useState<'all' | 'recurring' | 'review' | 'onetime'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return ['All', ...Array.from(set).sort()];
  }, [transactions]);

  // Filtering
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      if (
        q &&
        !t.merchantNormalized.toLowerCase().includes(q) &&
        !t.merchantRaw.toLowerCase().includes(q) &&
        !t.description.toLowerCase().includes(q) &&
        !t.category.toLowerCase().includes(q)
      ) {
        return false;
      }

      // Category
      if (categoryFilter !== 'All' && t.category !== categoryFilter) {
        return false;
      }

      // Recurring filter
      if (recurringFilter === 'recurring' && !t.isRecurring) return false;
      if (recurringFilter === 'onetime' && t.isRecurring) return false;
      if (recurringFilter === 'review' && t.status !== 'review') return false;

      return true;
    });
  }, [transactions, searchQuery, categoryFilter, recurringFilter]);

  // Sorting by date
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [filtered, sortOrder]);

  return (
    <div className="bg-surface rounded-lg border border-border shadow-xs overflow-hidden">
      {/* Search & Filter Bar */}
      <div className="p-4 border-b border-border bg-surface flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchant, description, amount..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-surface-subtle hover:bg-surface-hover focus:bg-surface border border-border rounded-md text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Badges / Selects */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Recurring Pills */}
          <div className="flex items-center bg-surface-subtle p-0.5 rounded-md border border-border">
            <button
              onClick={() => setRecurringFilter('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                recurringFilter === 'all'
                  ? 'bg-surface text-primary shadow-xs font-semibold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              All ({transactions.length})
            </button>
            <button
              onClick={() => setRecurringFilter('recurring')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                recurringFilter === 'recurring'
                  ? 'bg-surface text-primary shadow-xs font-semibold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Recurring
            </button>
            <button
              onClick={() => setRecurringFilter('review')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                recurringFilter === 'review'
                  ? 'bg-surface text-warning shadow-xs font-semibold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Review
            </button>
            <button
              onClick={() => setRecurringFilter('onetime')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                recurringFilter === 'onetime'
                  ? 'bg-surface text-primary shadow-xs font-semibold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              One-time
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-surface-subtle border border-border rounded-md text-primary focus:outline-none focus:border-accent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Date sort toggle */}
          <button
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className="p-1.5 text-secondary hover:text-primary border border-border rounded-md hover:bg-surface-subtle transition-colors flex items-center gap-1"
            title={`Sort date ${sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">{sortOrder === 'desc' ? 'Latest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      {sorted.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/50 text-secondary font-medium uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">Posting Date</th>
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4">Raw Description</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Recurring</th>
                <th className="py-3 px-4 text-center">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {sorted.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => openTransactionDetail(tx)}
                  className="hover:bg-surface-subtle/80 cursor-pointer transition-colors group"
                >
                  {/* Date */}
                  <td className="py-3 px-5 font-mono text-secondary text-[11px] whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>

                  {/* Merchant Normalized */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-primary group-hover:text-accent transition-colors">
                      {tx.merchantNormalized}
                    </span>
                  </td>

                  {/* Raw Description */}
                  <td className="py-3 px-4 text-secondary font-mono text-[11px] truncate max-w-[220px]" title={tx.merchantRaw}>
                    {tx.merchantRaw}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right font-bold text-primary tabular-nums whitespace-nowrap">
                    {formatCurrency(tx.amount)}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-secondary">
                    {tx.category}
                  </td>

                  {/* Recurring Yes/No */}
                  <td className="py-3 px-4 text-center">
                    {tx.isRecurring ? (
                      <span className="text-[11px] font-semibold text-accent">
                        Yes
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted">No</span>
                    )}
                  </td>

                  {/* Confidence */}
                  <td className="py-3 px-4 text-center">
                    {tx.isRecurring ? (
                      <ConfidenceBadge confidence={tx.recurrenceConfidence} size="sm" />
                    ) : (
                      <span className="text-muted font-mono text-[11px]">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <StatusBadge status={tx.status} size="sm" />
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <ChevronRight className="w-3.5 h-3.5 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center text-secondary space-y-2">
          <p className="text-sm font-medium text-primary">No transactions match your filters</p>
          <p className="text-xs text-muted">
            Try resetting your search query or selecting "All Categories".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('All');
              setRecurringFilter('all');
            }}
            className="mt-2 text-xs font-semibold text-accent hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Footer ledger counter */}
      <div className="p-3.5 bg-surface-subtle/50 border-t border-border flex items-center justify-between text-xs text-secondary">
        <span>
          Showing <strong className="text-primary font-semibold">{sorted.length}</strong> of{' '}
          {transactions.length} transactions
        </span>
        <span className="font-mono text-[11px] text-muted">Click any row to inspect normalization trace</span>
      </div>
    </div>
  );
};
