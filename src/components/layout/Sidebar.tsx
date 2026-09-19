import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  RotateCcw,
  AlertTriangle,
  PieChart,
  Store,
  UploadCloud,
  Database,
  FileText,
  Settings,
  Info,
} from 'lucide-react';
import { useSubSentry } from '../../context/SubSentryContext';
import { UserMenu } from '../auth/UserMenu';
import { PageRoute } from '../../types';

interface NavItem {
  label: string;
  route: PageRoute;
  icon: React.ReactNode;
  badgeCount?: number;
}

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = false,
  onClose,
}) => {
  const { currentRoute, setCurrentRoute, reviewCandidatesCount, totalTransactionsCount } = useSubSentry();

  const overviewItems: NavItem[] = [
    { label: 'Dashboard', route: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  const analyzeItems: NavItem[] = [
    { label: 'Transactions', route: '/transactions', icon: <Receipt className="w-4 h-4" /> },
    { label: 'Recurring payments', route: '/recurring', icon: <RotateCcw className="w-4 h-4" /> },
    {
      label: 'Review',
      route: '/review',
      icon: <AlertTriangle className="w-4 h-4" />,
      badgeCount: reviewCandidatesCount > 0 ? reviewCandidatesCount : undefined,
    },
  ];

  const understandItems: NavItem[] = [
    { label: 'Spending patterns', route: '/insights', icon: <PieChart className="w-4 h-4" /> },
    { label: 'Merchants', route: '/merchants', icon: <Store className="w-4 h-4" /> },
  ];

  const dataItems: NavItem[] = [
    { label: 'Import', route: '/import', icon: <UploadCloud className="w-4 h-4" /> },
    { label: 'Datasets', route: '/datasets', icon: <Database className="w-4 h-4" /> },
  ];

  const outputItems: NavItem[] = [
    { label: 'Reports', route: '/report', icon: <FileText className="w-4 h-4" /> },
  ];

  const systemItems: NavItem[] = [
    { label: 'Settings', route: '/settings', icon: <Settings className="w-4 h-4" /> },
    { label: 'About', route: '/about', icon: <Info className="w-4 h-4" /> },
  ];

  const handleNavClick = (route: PageRoute) => {
    setCurrentRoute(route);
    if (onClose) onClose();
  };

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-5">
      <div className="px-3 mb-1.5 text-[10px] font-semibold tracking-wider text-secondary/70 uppercase">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => {
          const isActive = currentRoute === item.route;
          return (
            <button
              key={item.route}
              onClick={() => handleNavClick(item.route)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-accent/10 text-primary font-semibold'
                  : 'text-secondary hover:text-primary hover:bg-surface-subtle'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`${
                    isActive ? 'text-accent' : 'text-secondary group-hover:text-primary'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badgeCount !== undefined && (
                <span className="text-[11px] font-mono font-semibold text-warning">
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-primary/20 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Section */}
        <div className="p-4 border-b border-border/70 flex items-center justify-between">
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-md bg-primary text-surface font-mono font-bold text-xs flex items-center justify-center tracking-tight shadow-xs">
              SS
            </div>
            <div>
              <div className="text-xs font-bold tracking-tight text-primary uppercase">
                SUBSENTRY
              </div>
              <div className="text-[10px] text-secondary tracking-tight font-normal">
                Recurring Payment Analysis
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {renderNavGroup('Overview', overviewItems)}
          {renderNavGroup('Analyze', analyzeItems)}
          {renderNavGroup('Understand', understandItems)}
          {renderNavGroup('Data', dataItems)}
          {renderNavGroup('Output', outputItems)}
          {renderNavGroup('System', systemItems)}
        </div>

        {/* Authenticated User Area in Sidebar */}
        <div className="p-3 border-t border-border/70 bg-surface-subtle/30">
          <UserMenu direction="up" fullWidth={true} />
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted">
            <span>Transaction history</span>
            <span className="font-mono text-secondary tabular-nums">
              {totalTransactionsCount > 0 ? `${totalTransactionsCount} txs` : 'Empty'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
