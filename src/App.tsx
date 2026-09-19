import React from 'react';
import { SubSentryProvider, useSubSentry } from './context/SubSentryContext';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { RecurringPage } from './pages/RecurringPage';
import { ReviewPage } from './pages/ReviewPage';
import { InsightsPage } from './pages/InsightsPage';
import { MerchantsPage } from './pages/MerchantsPage';
import { ImportPage } from './pages/ImportPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { ReportPage } from './pages/ReportPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

const RouterView: React.FC = () => {
  const { currentRoute } = useSubSentry();

  switch (currentRoute) {
    case '/':
      return <DashboardPage />;
    case '/transactions':
      return <TransactionsPage />;
    case '/recurring':
      return <RecurringPage />;
    case '/review':
      return <ReviewPage />;
    case '/insights':
      return <InsightsPage />;
    case '/merchants':
      return <MerchantsPage />;
    case '/import':
      return <ImportPage />;
    case '/datasets':
      return <DatasetsPage />;
    case '/report':
      return <ReportPage />;
    case '/settings':
      return <SettingsPage />;
    case '/about':
      return <AboutPage />;
    default:
      return <DashboardPage />;
  }
};

export function App() {
  return (
    <SubSentryProvider>
      <AppShell>
        <RouterView />
      </AppShell>
    </SubSentryProvider>
  );
}

export default App;
