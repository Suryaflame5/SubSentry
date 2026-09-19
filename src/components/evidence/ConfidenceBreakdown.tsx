import React, { useState } from 'react';
import { EvidenceScore } from '../../types';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface ConfidenceBreakdownProps {
  evidence: EvidenceScore;
  merchantName?: string;
}

export const ConfidenceBreakdown: React.FC<ConfidenceBreakdownProps> = ({ evidence, merchantName = 'Adobe Creative Cloud' }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>('interval');

  const toggleItem = (key: string) => {
    setExpandedItem((prev) => (prev === key ? null : key));
  };

  // Factors with their exact formula weightings
  const factors = [
    {
      name: 'Frequency consistency',
      weight: '30%',
      score: evidence.frequencyConsistency,
      description: 'Cadence detected across billing cycles',
    },
    {
      name: 'Interval consistency',
      weight: '30%',
      score: evidence.intervalConsistency,
      description: 'Variance in days between consecutive payments',
    },
    {
      name: 'Amount stability',
      weight: '25%',
      score: evidence.amountStability,
      description: 'Variance of charged amounts across periods',
    },
    {
      name: 'Merchant consistency',
      weight: '15%',
      score: evidence.merchantConsistency,
      description: 'Match on raw transaction descriptor tokens',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Why this was detected - Inspectable Evidence Cards */}
      <div className="bg-surface rounded-lg border border-border p-4 space-y-3">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Why this was detected
          </h4>
          <p className="text-xs text-secondary mt-0.5">
            Click any evidence factor to inspect the underlying calculation.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          {/* Item 1: Consecutive payments */}
          <div className="border border-border rounded-lg overflow-hidden transition-colors">
            <button
              onClick={() => toggleItem('consecutive')}
              className="w-full flex items-center justify-between p-3 text-left text-xs font-medium text-primary hover:bg-surface-subtle transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-positive shrink-0" />
                <span>{evidence.consecutivePayments} consecutive payments</span>
              </div>
              <div className="flex items-center gap-1.5 text-secondary text-[11px]">
                <span>Inspect</span>
                {expandedItem === 'consecutive' ? (
                  <ChevronUp className="w-3.5 h-3.5 text-secondary" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-secondary" />
                )}
              </div>
            </button>
            {expandedItem === 'consecutive' && (
              <div className="px-3 pb-3 pt-1 text-xs border-t border-border/60 bg-surface-subtle/50 space-y-1 animate-in fade-in duration-150">
                <div className="text-[11px] text-secondary mb-1">
                  Consecutive billing occurrences without missed periods:
                </div>
                <div className="grid grid-cols-5 gap-1.5 font-mono text-[11px] text-center">
                  <span className="p-1.5 rounded bg-surface border border-border">P1 (Jan)</span>
                  <span className="p-1.5 rounded bg-surface border border-border">P2 (Feb)</span>
                  <span className="p-1.5 rounded bg-surface border border-border">P3 (Mar)</span>
                  <span className="p-1.5 rounded bg-surface border border-border">P4 (Apr)</span>
                  <span className="p-1.5 rounded bg-surface border border-border">P5 (May)</span>
                </div>
              </div>
            )}
          </div>

          {/* Item 2: Average interval */}
          <div className="border border-border rounded-lg overflow-hidden transition-colors">
            <button
              onClick={() => toggleItem('interval')}
              className="w-full flex items-center justify-between p-3 text-left text-xs font-medium text-primary hover:bg-surface-subtle transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-positive shrink-0" />
                <span>~{evidence.averageInterval}-day average interval</span>
              </div>
              <div className="flex items-center gap-1.5 text-secondary text-[11px]">
                <span>Inspect</span>
                {expandedItem === 'interval' ? (
                  <ChevronUp className="w-3.5 h-3.5 text-secondary" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-secondary" />
                )}
              </div>
            </button>
            {expandedItem === 'interval' && (
              <div className="px-3 pb-3 pt-1 text-xs border-t border-border/60 bg-surface-subtle/50 space-y-1 animate-in fade-in duration-150">
                <div className="text-[11px] text-secondary mb-1">
                  Interval spacing between consecutive charges:
                </div>
                <div className="flex items-center justify-between font-mono text-[11px] p-2 rounded bg-surface border border-border">
                  <span>Cycle 1→2: 30d</span>
                  <span>Cycle 2→3: 30d</span>
                  <span>Cycle 3→4: 30d</span>
                  <span>Cycle 4→5: 30d</span>
                </div>
                <div className="text-[10px] text-positive font-medium mt-1">
                  Standard deviation: 0.0 days (Strict monthly cadence)
                </div>
              </div>
            )}
          </div>

          {/* Item 3: Amount stability */}
          <div className="border border-border rounded-lg overflow-hidden transition-colors">
            <button
              onClick={() => toggleItem('amount')}
              className="w-full flex items-center justify-between p-3 text-left text-xs font-medium text-primary hover:bg-surface-subtle transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-positive shrink-0" />
                <span>Very stable payment amount</span>
              </div>
              <div className="flex items-center gap-1.5 text-secondary text-[11px]">
                <span>Inspect</span>
                {expandedItem === 'amount' ? (
                  <ChevronUp className="w-3.5 h-3.5 text-secondary" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-secondary" />
                )}
              </div>
            </button>
            {expandedItem === 'amount' && (
              <div className="px-3 pb-3 pt-1 text-xs border-t border-border/60 bg-surface-subtle/50 space-y-1 animate-in fade-in duration-150">
                <div className="text-[11px] text-secondary mb-1">
                  Recorded charge amounts across all periods:
                </div>
                <div className="flex items-center justify-around font-mono text-[11px] p-2 rounded bg-surface border border-border font-semibold text-primary">
                  <span>₹1,675</span>
                  <span>₹1,675</span>
                  <span>₹1,675</span>
                  <span>₹1,675</span>
                  <span>₹1,675</span>
                </div>
                <div className="text-[10px] text-positive font-medium mt-1">
                  Amount variance: 0.0% (Zero price drift detected)
                </div>
              </div>
            )}
          </div>

          {/* Item 4: Consistent merchant identity */}
          <div className="border border-border rounded-lg overflow-hidden transition-colors">
            <button
              onClick={() => toggleItem('merchant')}
              className="w-full flex items-center justify-between p-3 text-left text-xs font-medium text-primary hover:bg-surface-subtle transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-positive shrink-0" />
                <span>Consistent merchant identity</span>
              </div>
              <div className="flex items-center gap-1.5 text-secondary text-[11px]">
                <span>Inspect</span>
                {expandedItem === 'merchant' ? (
                  <ChevronUp className="w-3.5 h-3.5 text-secondary" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-secondary" />
                )}
              </div>
            </button>
            {expandedItem === 'merchant' && (
              <div className="px-3 pb-3 pt-1 text-xs border-t border-border/60 bg-surface-subtle/50 space-y-1 animate-in fade-in duration-150">
                <div className="text-[11px] text-secondary mb-1">
                  Raw banking descriptor token match:
                </div>
                <div className="font-mono text-[11px] p-2 rounded bg-surface border border-border text-primary break-all">
                  ADOBE *CREATIVE CLOUD 800-833-6687 US → {merchantName}
                </div>
                <div className="text-[10px] text-positive font-medium mt-1">
                  Token resolution confidence: 100%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scoring Formula Header */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Recurrence confidence
            </h4>
            <div className="text-xl font-bold text-primary mt-0.5">
              {evidence.totalConfidence}%
            </div>
          </div>
          <span className="text-xs font-mono font-medium px-2 py-1 rounded bg-positive-subtle text-positive border border-positive-border">
            Strong recurrence pattern
          </span>
        </div>

        {/* 4-Factor Bars */}
        <div className="space-y-3 pt-2">
          {factors.map((factor) => (
            <div key={factor.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-primary">
                  {factor.name}
                </span>
                <span className="font-mono text-secondary tabular-nums">
                  {factor.weight} • <strong className="text-primary font-semibold">{factor.score}%</strong>
                </span>
              </div>
              <div className="w-full h-2 bg-surface-subtle rounded overflow-hidden border border-border">
                <div
                  className="h-full bg-accent rounded transition-all duration-500"
                  style={{ width: `${Math.min(100, factor.score)}%` }}
                />
              </div>
              <p className="text-[11px] text-muted">
                {factor.description}
              </p>
            </div>
          ))}
        </div>

        {/* Scoring Methodology Note */}
        <div className="mt-4 pt-3 border-t border-border/70 text-[11px] text-secondary font-mono bg-surface-subtle/50 p-2.5 rounded border border-border">
          <div className="text-primary font-semibold font-sans mb-1 text-xs">
            Detection formula:
          </div>
          <div className="text-secondary leading-relaxed">
            Recurrence Score = 30% Frequency + 30% Interval + 25% Amount + 15% Merchant
          </div>
        </div>
      </div>
    </div>
  );
};
