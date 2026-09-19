import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { Toast } from '../common/Toast';
import { EvidenceDrawer } from '../evidence/EvidenceDrawer';
import { TransactionDetailDrawer } from '../transactions/TransactionDetailDrawer';
import { useSubSentry } from '../../context/SubSentryContext';

const PUBLIC_ROUTES = [
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/privacy',
  '/terms',
];

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentRoute } = useSubSentry();

  if (PUBLIC_ROUTES.includes(currentRoute)) {
    return (
      <div className="min-h-screen bg-canvas text-primary">
        {children}
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Workspace Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        <TopBar onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-6 md:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Modals & Slide-out analytical instruments */}
      <GlobalSearchModal />
      <EvidenceDrawer />
      <TransactionDetailDrawer />
      <Toast />
    </div>
  );
};
