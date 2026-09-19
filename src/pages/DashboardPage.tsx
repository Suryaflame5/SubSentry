import React from 'react';
import { useSubSentry } from '../context/SubSentryContext';
import { HeroSection } from '../components/dashboard/HeroSection';
import { MetricCard } from '../components/common/MetricCard';
import { RecurringSpendChart } from '../components/dashboard/RecurringSpendChart';
import { RepeatingMerchantsTable } from '../components/dashboard/RepeatingMerchantsTable';
import { CandidateHighlightCard } from '../components/dashboard/CandidateHighlightCard';
import { formatCurrency } from '../utils/currency';
import { UploadCloud, Shield, ArrowRight, Download } from 'lucide-react';
import { generateCSVTemplate } from '../utils/csvParser';

export const DashboardPage: React.FC = () => {
  const {
    monthlyRecurringSpend,
    recurringMerchantsCount,
    reviewCandidatesCount,
    detectionConfidence,
    totalTransactionsCount,
    setCurrentRoute,
  } = useSubSentry();

  const handleDownloadTemplate = () => {
    const csvContent = generateCSVTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'subsentry_statement_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Production Empty State (Section 9)
  if (totalTransactionsCount === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-8 animate-in fade-in duration-200">
        <div className="bg-surface rounded-lg border border-border p-8 md:p-10 text-center space-y-5 shadow-xs">
          <div className="w-12 h-12 rounded-lg bg-surface-subtle border border-border flex items-center justify-center mx-auto text-primary">
            <UploadCloud className="w-6 h-6 text-accent" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-primary">
              Import your transaction history
            </h2>
            <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
              Bring in a transaction statement to identify recurring payments and patterns worth reviewing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentRoute('/import')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-surface bg-primary hover:bg-primary/90 rounded-md transition-all shadow-xs"
            >
              <span>Import transactions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDownloadTemplate}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium text-primary hover:text-primary bg-surface-subtle hover:bg-surface-hover border border-border rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-secondary" />
              <span>Download CSV template</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-surface-subtle border border-border flex items-center justify-center gap-2.5 text-xs text-secondary text-center">
          <Shield className="w-4 h-4 text-positive shrink-0" />
          <span>SubSentry works with transaction data. No bank credentials are required.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Hero Headline Section */}
      <HeroSection />

      {/* Key Figures - Clear Financial Hierarchy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Recurring spend"
          value={formatCurrency(monthlyRecurringSpend)}
          delta={{ text: '+₹480 from previous period', isPositive: false }}
          subtext="₹74,880 estimated annual recurring spend"
          indicator="accent"
          onClick={() => setCurrentRoute('/recurring')}
        />

        <MetricCard
          label="Review candidates"
          value={reviewCandidatesCount}
          subtext={reviewCandidatesCount > 0 ? "Payments requiring your decision" : "All review candidates resolved"}
          indicator={reviewCandidatesCount > 0 ? 'warning' : 'default'}
          delta={{
            text: reviewCandidatesCount > 0 ? `${reviewCandidatesCount} need review` : '0 pending',
            isPositive: reviewCandidatesCount === 0,
          }}
          onClick={() => setCurrentRoute('/review')}
        />

        <MetricCard
          label="Recurring merchants"
          value={recurringMerchantsCount}
          subtext="Across 5 categorized services"
          delta={{ text: '7 active patterns', isNeutral: true }}
          onClick={() => setCurrentRoute('/recurring')}
        />

        <MetricCard
          label="Average recurrence confidence"
          value={`${detectionConfidence}%`}
          subtext="Calculated from payment evidence"
          delta={{ text: '4-factor formula', isPositive: true }}
        />
      </div>

      {/* Flagship Candidate Spotlight: Adobe Creative Cloud */}
      <CandidateHighlightCard />

      {/* Proportional Recurring Spend Breakdown */}
      <RecurringSpendChart />

      {/* Recurring Merchants Ledger Table */}
      <RepeatingMerchantsTable />
    </div>
  );
};
