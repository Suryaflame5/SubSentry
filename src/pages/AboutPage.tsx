import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { useSubSentry } from '../context/SubSentryContext';

export const AboutPage: React.FC = () => {
  const { setCurrentRoute } = useSubSentry();

  return (
    <div className="space-y-8 max-w-3xl animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-primary">
          About SubSentry
        </h2>
        <p className="text-xs text-secondary mt-0.5">
          Explainable financial pattern intelligence and recurring spend analysis.
        </p>
      </div>

      {/* Core Mission Banner */}
      <div className="bg-surface rounded-lg border border-border p-6 md:p-8 shadow-xs space-y-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Product Philosophy
          </div>
          <h3 className="text-2xl font-bold text-primary tracking-tight">
            See what repeats. Understand why. Decide for yourself.
          </h3>
        </div>

        <p className="text-xs md:text-sm text-secondary leading-relaxed">
          Most subscription dashboards rely on opaque black-box classifiers or claim impossible automated accuracy. SubSentry takes the opposite approach: <strong>pure explainability</strong>.
        </p>

        <p className="text-xs text-secondary leading-relaxed">
          SubSentry analyzes raw, messy transaction statements to normalize merchant tokens, compute inter-payment intervals, measure amount stability, and calculate transparent recurrence confidence scores. The system discovers patterns; you make the decision.
        </p>
      </div>

      {/* 4-Factor Explainability Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
          Deterministic Scoring Model
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-lg bg-surface border border-border space-y-1">
            <div className="font-semibold text-primary">30% Frequency Consistency</div>
            <p className="text-[11px] text-secondary leading-relaxed">
              Measures regular recurrence across consecutive monthly, quarterly, or annual billing cycles.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface border border-border space-y-1">
            <div className="font-semibold text-primary">30% Interval Consistency</div>
            <p className="text-[11px] text-secondary leading-relaxed">
              Calculates interval variance standard deviation between payments (e.g. strict 30-day cadence).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface border border-border space-y-1">
            <div className="font-semibold text-primary">25% Amount Stability</div>
            <p className="text-[11px] text-secondary leading-relaxed">
              Measures coefficient of price variance to distinguish fixed subscriptions from fluctuating utility bills.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface border border-border space-y-1">
            <div className="font-semibold text-primary">15% Merchant Consistency</div>
            <p className="text-[11px] text-secondary leading-relaxed">
              Normalizes raw, obfuscated bank descriptor tokens into clean, verified merchant entities.
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Privacy Card */}
      <div className="p-5 rounded-lg bg-surface-subtle border border-border flex items-start gap-3.5 text-xs text-secondary">
        <Shield className="w-5 h-5 text-positive shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-primary text-sm">Privacy by Architecture</div>
          <p className="text-xs leading-relaxed text-secondary">
            SubSentry runs entirely client-side. The application operates on exported transaction ledgers without requiring sensitive OAuth credentials, Plaid connections, or third-party bank logins.
          </p>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setCurrentRoute('/')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-surface bg-primary hover:bg-primary/90 rounded-md transition-all shadow-xs"
        >
          <span>Return to overview</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <span className="font-mono text-[11px] text-muted">
          SubSentry v1.0
        </span>
      </div>
    </div>
  );
};
