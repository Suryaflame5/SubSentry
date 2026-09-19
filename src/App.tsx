import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { PageRoute } from './types';

const PUBLIC_ROUTES: PageRoute[] = [
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/privacy',
  '/terms',
];

const RouterView: React.FC = () => {
  const { currentRoute, setCurrentRoute } = useSubSentry();
  const { user, isLoading } = useAuth();

  // Route Guard: Redirect unauthenticated requests to /signin
  useEffect(() => {
    if (!isLoading && !user && !PUBLIC_ROUTES.includes(currentRoute)) {
      window.location.hash = `#/signin?returnTo=${encodeURIComponent(currentRoute)}`;
      setCurrentRoute('/signin');
    }
  }, [isLoading, user, currentRoute, setCurrentRoute]);

  // If already authenticated and visiting signin/signup, redirect to workspace
  useEffect(() => {
    if (!isLoading && user && (currentRoute === '/signin' || currentRoute === '/signup')) {
      setCurrentRoute('/');
    }
  }, [isLoading, user, currentRoute, setCurrentRoute]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 rounded-md bg-primary text-surface font-mono font-bold text-xs flex items-center justify-center tracking-tight shadow-xs">
          SS
        </div>
      </div>
    );
  }

  // Unauthenticated fallback
  if (!user && !PUBLIC_ROUTES.includes(currentRoute)) {
    return <SignInPage />;
  }

  switch (currentRoute) {
    // Protected Workspace Routes
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

    // Public Authentication Routes
    case '/signin':
      return <SignInPage />;
    case '/signup':
      return <SignUpPage />;
    case '/verify-email':
      return <VerifyEmailPage />;
    case '/forgot-password':
      return <ForgotPasswordPage />;
    case '/reset-password':
      return <ResetPasswordPage />;

    // Public Legal Routes
    case '/privacy':
      return <PrivacyPage />;
    case '/terms':
      return <TermsPage />;

    default:
      return <DashboardPage />;
  }
};

export function App() {
  return (
    <AuthProvider>
      <SubSentryProvider>
        <AppShell>
          <RouterView />
        </AppShell>
      </SubSentryProvider>
    </AuthProvider>
  );
}

export default App;
