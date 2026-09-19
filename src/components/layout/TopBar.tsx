import React from 'react';
import { Menu, Search, Upload } from 'lucide-react';
import { useSubSentry } from '../../context/SubSentryContext';
import { PageRoute } from '../../types';

interface TopBarProps {
  onMenuToggle: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuToggle }) => {
  const {
    currentRoute,
    setCurrentRoute,
    totalTransactionsCount,
    setIsSearchOpen,
  } = useSubSentry();

  const getPageMeta = (route: PageRoute): { title: string; subtitle: string } => {
    switch (route) {
      case '/':
        return {
          title: 'Overview',
          subtitle: 'Your recurring spending at a glance.',
        };
      case '/transactions':
        return {
          title: 'Transactions',
          subtitle: 'Every transaction behind the analysis.',
        };
      case '/recurring':
        return {
          title: 'Recurring payments',
          subtitle: 'Recurring merchants and billing patterns.',
        };
      case '/review':
        return {
          title: 'Review candidates',
          subtitle: 'Recurring payments that may deserve another look.',
        };
      case '/insights':
        return {
          title: 'Spending patterns',
          subtitle: 'Where recurring commitments go.',
        };
      case '/merchants':
        return {
          title: 'Merchants',
          subtitle: 'Normalized merchant identities from transaction descriptions.',
        };
      case '/import':
        return {
          title: 'Import transactions',
          subtitle: 'Bring your transaction history into SubSentry.',
        };
      case '/datasets':
        return {
          title: 'Datasets',
          subtitle: 'Active transaction history and sources.',
        };
      case '/report':
        return {
          title: 'Report',
          subtitle: 'Summary of recurring spend and review candidates.',
        };
      case '/settings':
        return {
          title: 'Settings',
          subtitle: 'Detection sensitivity and preferences.',
        };
      case '/about':
        return {
          title: 'About SubSentry',
          subtitle: 'Explainable financial pattern detection.',
        };
      default:
        return {
          title: 'Overview',
          subtitle: 'Your recurring spending at a glance.',
        };
    }
  };

  const meta = getPageMeta(currentRoute);

  return (
    <header className="sticky top-0 z-30 bg-surface/85 backdrop-blur-md border-b border-border px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1.5 text-secondary hover:text-primary rounded hover:bg-surface-subtle"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Page Header */}
        <div>
          <h1 className="text-base font-semibold text-primary tracking-tight leading-tight">
            {meta.title}
          </h1>
          <p className="text-xs text-secondary leading-tight mt-0.5">
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* Global Search Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-surface-subtle hover:bg-surface-hover border border-border text-xs text-secondary hover:text-primary transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick search...</span>
          <kbd className="text-[10px] font-mono border border-border px-1.5 py-0.5 rounded bg-surface text-muted">
            ⌘K
          </kbd>
        </button>

        {/* Transaction Count (Plain typography, no capsule, no colored dot) */}
        {totalTransactionsCount > 0 ? (
          <span className="hidden md:inline text-xs text-secondary font-medium tabular-nums">
            {totalTransactionsCount} transactions analyzed
          </span>
        ) : (
          <span className="hidden md:inline text-xs text-muted font-normal">
            No transactions loaded
          </span>
        )}

        {/* Import Data CTA */}
        <button
          onClick={() => setCurrentRoute('/import')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-surface bg-primary hover:bg-primary/90 rounded-md transition-all shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import data</span>
        </button>
      </div>
    </header>
  );
};
