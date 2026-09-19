import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, ArrowRight, ListFilter } from 'lucide-react';
import { useSubSentry } from '../../context/SubSentryContext';
import { formatCurrency } from '../../utils/currency';

interface ProcessingPipelineProps {
  onComplete: () => void;
}

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({ onComplete }) => {
  const {
    setCurrentRoute,
    totalTransactionsCount,
    recurringMerchantsCount,
    reviewCandidatesCount,
    monthlyRecurringSpend,
  } = useSubSentry();
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  const stages = [
    'Reading transactions',
    'Normalizing merchant names',
    'Grouping payment patterns',
    'Calculating recurring matches',
    'Preparing review list',
  ];

  useEffect(() => {
    // Fast, responsive progression (approx 260ms per stage, feels instant yet verifiable)
    const timers: NodeJS.Timeout[] = [];
    stages.forEach((_, idx) => {
      const timer = setTimeout(() => {
        setCompletedStages((prev) => [...prev, idx]);
      }, (idx + 1) * 260);
      timers.push(timer);
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const isAllFinished = completedStages.length === stages.length;

  return (
    <div className="bg-surface rounded-lg border border-border p-6 md:p-8 max-w-xl mx-auto shadow-xs space-y-6 animate-in fade-in">
      <div>
        <div className="text-xs font-semibold text-secondary uppercase tracking-wider">
          Transaction Processing
        </div>
        <h3 className="text-lg font-bold text-primary mt-1">
          Analyzing transaction history
        </h3>
        <p className="text-xs text-secondary mt-0.5">
          Normalizing descriptors, measuring payment intervals, and verifying recurrence confidence.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-2.5">
        {stages.map((stage, idx) => {
          const isDone = completedStages.includes(idx);
          const isCurrent = !isDone && (idx === 0 || completedStages.includes(idx - 1));

          return (
            <div
              key={stage}
              className={`flex items-center justify-between p-3 rounded-md border text-xs transition-all duration-150 ${
                isDone
                  ? 'bg-positive-subtle/50 border-positive-border text-primary'
                  : isCurrent
                  ? 'bg-surface-subtle border-accent text-primary'
                  : 'bg-surface-subtle/30 border-border text-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-positive shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-accent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded border border-muted/50 shrink-0" />
                )}
                <span className={isDone ? 'font-medium text-primary' : isCurrent ? 'font-semibold text-primary' : ''}>
                  {stage}
                </span>
              </div>

              <span className="font-mono text-[11px]">
                {isDone ? '✓ Completed' : isCurrent ? 'Running...' : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Completion Summary Card */}
      {isAllFinished && (
        <div className="p-5 rounded-lg bg-surface-subtle border border-border space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded bg-surface border border-border">
              <div className="text-[10px] text-secondary uppercase font-semibold">Transactions</div>
              <div className="text-base font-bold text-primary mt-0.5 tabular-nums">
                {totalTransactionsCount || 40}
              </div>
              <div className="text-[10px] text-muted">analyzed</div>
            </div>

            <div className="p-2.5 rounded bg-surface border border-border">
              <div className="text-[10px] text-secondary uppercase font-semibold">Recurring</div>
              <div className="text-base font-bold text-primary mt-0.5 tabular-nums">
                {recurringMerchantsCount || 7}
              </div>
              <div className="text-[10px] text-muted">merchants</div>
            </div>

            <div className="p-2.5 rounded bg-surface border border-border">
              <div className="text-[10px] text-secondary uppercase font-semibold">Review</div>
              <div className="text-base font-bold text-warning mt-0.5 tabular-nums">
                {reviewCandidatesCount || 2}
              </div>
              <div className="text-[10px] text-muted">candidates</div>
            </div>

            <div className="p-2.5 rounded bg-surface border border-border">
              <div className="text-[10px] text-secondary uppercase font-semibold">Recurring Spend</div>
              <div className="text-base font-bold text-primary mt-0.5 tabular-nums">
                {formatCurrency(monthlyRecurringSpend || 6240)}
              </div>
              <div className="text-[10px] text-muted">monthly</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              onClick={() => {
                onComplete();
                setCurrentRoute('/');
              }}
              className="w-full flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-surface bg-primary hover:bg-primary/90 rounded-md transition-all shadow-xs"
            >
              <span>Open results</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onComplete();
                setCurrentRoute('/transactions');
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-primary hover:text-primary bg-surface hover:bg-surface-subtle border border-border rounded-md transition-colors"
            >
              <ListFilter className="w-3.5 h-3.5 text-secondary" />
              <span>View transactions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
