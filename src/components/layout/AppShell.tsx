import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { Toast } from '../common/Toast';
import { EvidenceDrawer } from '../evidence/EvidenceDrawer';
import { TransactionDetailDrawer } from '../transactions/TransactionDetailDrawer';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-primary flex">
      {/* Sidebar - fixed width 240px */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Workspace Area */}
      <div className="flex-1 md:pl-[240px] flex flex-col min-w-0 min-h-screen">
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
