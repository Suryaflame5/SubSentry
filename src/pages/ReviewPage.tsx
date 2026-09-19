import React from 'react';
import { useSubSentry } from '../context/SubSentryContext';
import { ReviewCandidateCard } from '../components/review/ReviewCandidateCard';
import { CheckCircle2 } from 'lucide-react';

export const ReviewPage: React.FC = () => {
  const { reviewCandidates } = useSubSentry();

  const activeCandidates = reviewCandidates.filter((c) => c.status === 'review');
  const resolvedCandidates = reviewCandidates.filter((c) => c.status !== 'review');

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-primary">
            Review candidates
          </h2>
          <p className="text-xs text-secondary mt-0.5">
            Recurring payments that may deserve another look.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-secondary tabular-nums">
            {activeCandidates.length} review candidate{activeCandidates.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Active Candidate Cards */}
      {activeCandidates.length > 0 ? (
        <div className="space-y-4">
          {activeCandidates.map((candidate) => (
            <ReviewCandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-lg border border-border p-12 text-center space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-md bg-surface-subtle border border-border text-positive mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-primary">
            No recurring payment currently needs your attention.
          </h3>
          <p className="text-xs text-secondary max-w-md mx-auto">
            All review candidates have been evaluated or confirmed as intentional. SubSentry will alert you when irregular cadence or idle subscriptions are detected.
          </p>
        </div>
      )}

      {/* Resolved Candidates Archive */}
      {resolvedCandidates.length > 0 && (
        <div className="pt-6 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-secondary flex items-center gap-2">
            <span>Evaluated In This Session</span>
            <span className="text-muted font-normal">({resolvedCandidates.length})</span>
          </div>

          <div className="space-y-3">
            {resolvedCandidates.map((candidate) => (
              <ReviewCandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
