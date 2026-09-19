import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Transaction,
  RecurringPayment,
  ReviewCandidate,
  PageRoute,
} from '../types';
import {
  INITIAL_TRANSACTIONS,
} from '../data/syntheticDataset';
import { analyzeTransactions } from '../utils/recurrenceEngine';

interface ToastData {
  id: string;
  title: string;
  description?: string;
  type: 'info' | 'success' | 'warning';
}

interface SubSentryContextType {
  currentRoute: PageRoute;
  setCurrentRoute: (route: PageRoute) => void;
  transactions: Transaction[];
  recurringPayments: RecurringPayment[];
  reviewCandidates: ReviewCandidate[];
  selectedEvidenceMerchant: RecurringPayment | null;
  openEvidenceDrawer: (merchantOrId: RecurringPayment | string) => void;
  closeEvidenceDrawer: () => void;
  selectedTransaction: Transaction | null;
  openTransactionDetail: (tx: Transaction) => void;
  closeTransactionDetail: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toast: ToastData | null;
  showToast: (title: string, description?: string, type?: 'info' | 'success' | 'warning') => void;
  dismissToast: () => void;
  keepCandidate: (candidateId: string) => void;
  dismissCandidate: (candidateId: string) => void;
  markCandidateForReview: (candidateId: string) => void;
  resetToSampleData: () => void;
  importCustomTransactions: (imported: Transaction[]) => void;
  clearDataset: () => void;
  datasetName: string;
  datasetImportDate: string;
  dataSource: string;
  // Summary Metrics
  monthlyRecurringSpend: number;
  annualizedRecurringSpend: number;
  recurringMerchantsCount: number;
  reviewCandidatesCount: number;
  detectionConfidence: number;
  totalTransactionsCount: number;
}

const SubSentryContext = createContext<SubSentryContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'subsentry_v1_';

export const SubSentryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentRoute, setCurrentRouteState] = useState<PageRoute>(() => {
    const hash = window.location.hash.replace('#', '') as PageRoute;
    const validRoutes: PageRoute[] = [
      '/',
      '/transactions',
      '/recurring',
      '/review',
      '/insights',
      '/merchants',
      '/import',
      '/datasets',
      '/report',
      '/settings',
      '/about',
    ];
    return validRoutes.includes(hash) ? hash : '/';
  });

  const setCurrentRoute = (route: PageRoute) => {
    setCurrentRouteState(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageRoute;
      const validRoutes: PageRoute[] = [
        '/',
        '/transactions',
        '/recurring',
        '/review',
        '/insights',
        '/merchants',
        '/import',
        '/datasets',
        '/report',
        '/settings',
        '/about',
      ];
      if (validRoutes.includes(hash)) {
        setCurrentRouteState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Data States (Boots empty unless a dataset has been imported / saved)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}transactions`);
    return saved ? JSON.parse(saved) : [];
  });

  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}recurring`);
    return saved ? JSON.parse(saved) : [];
  });

  const [reviewCandidates, setReviewCandidates] = useState<ReviewCandidate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}candidates`);
    return saved ? JSON.parse(saved) : [];
  });

  // Evidence Drawer & Details
  const [selectedEvidenceMerchant, setSelectedEvidenceMerchant] = useState<RecurringPayment | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}transactions`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}recurring`, JSON.stringify(recurringPayments));
  }, [recurringPayments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}candidates`, JSON.stringify(reviewCandidates));
  }, [reviewCandidates]);

  // Global keyboard shortcuts (Ctrl+K, Cmd+K, /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        if (selectedEvidenceMerchant) setSelectedEvidenceMerchant(null);
        if (selectedTransaction) setSelectedTransaction(null);
        if (isSearchOpen) setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvidenceMerchant, selectedTransaction, isSearchOpen]);

  const showToast = (title: string, description?: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, title, description, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  };

  const dismissToast = () => setToast(null);

  const openEvidenceDrawer = (merchantOrId: RecurringPayment | string) => {
    if (typeof merchantOrId === 'string') {
      const found = recurringPayments.find(
        (r) => r.id === merchantOrId || r.merchant.toLowerCase() === merchantOrId.toLowerCase()
      );
      if (found) {
        setSelectedEvidenceMerchant(found);
      }
    } else {
      setSelectedEvidenceMerchant(merchantOrId);
    }
  };

  const closeEvidenceDrawer = () => setSelectedEvidenceMerchant(null);

  const openTransactionDetail = (tx: Transaction) => setSelectedTransaction(tx);
  const closeTransactionDetail = () => setSelectedTransaction(null);

  // Candidate Decisions
  const keepCandidate = (candidateId: string) => {
    const cand = reviewCandidates.find((c) => c.id === candidateId);
    if (!cand) return;

    setReviewCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: 'intentional' } : c))
    );

    setRecurringPayments((prev) =>
      prev.map((r) =>
        r.id === cand.recurringPaymentId || r.merchant === cand.merchant
          ? { ...r, status: 'intentional' }
          : r
      )
    );

    setTransactions((prev) =>
      prev.map((t) =>
        t.merchantNormalized === cand.merchant ? { ...t, status: 'intentional' } : t
      )
    );

    showToast('Marked as intentional.', undefined, 'success');
  };

  const dismissCandidate = (candidateId: string) => {
    const cand = reviewCandidates.find((c) => c.id === candidateId);
    if (!cand) return;

    setReviewCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: 'dismissed' } : c))
    );

    setRecurringPayments((prev) =>
      prev.map((r) =>
        r.id === cand.recurringPaymentId || r.merchant === cand.merchant
          ? { ...r, status: 'dismissed' }
          : r
      )
    );

    setTransactions((prev) =>
      prev.map((t) =>
        t.merchantNormalized === cand.merchant ? { ...t, status: 'dismissed' } : t
      )
    );

    showToast('Candidate dismissed.', undefined, 'info');
  };

  const markCandidateForReview = (candidateId: string) => {
    const cand = reviewCandidates.find((c) => c.id === candidateId);
    if (!cand) return;

    setReviewCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: 'review' } : c))
    );

    setRecurringPayments((prev) =>
      prev.map((r) =>
        r.id === cand.recurringPaymentId || r.merchant === cand.merchant
          ? { ...r, status: 'review' }
          : r
      )
    );

    showToast('Queued for review.', undefined, 'warning');
  };

  const resetToSampleData = () => {
    const { transactions: analyzedTx, recurringPayments: analyzedRec, reviewCandidates: analyzedCand } =
      analyzeTransactions(INITIAL_TRANSACTIONS);
    setTransactions(analyzedTx);
    setRecurringPayments(analyzedRec);
    setReviewCandidates(analyzedCand);
    showToast('Transactions loaded.', '40 transactions analyzed.', 'success');
  };

  const clearDataset = () => {
    setTransactions([]);
    setRecurringPayments([]);
    setReviewCandidates([]);
    setSelectedEvidenceMerchant(null);
    setSelectedTransaction(null);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}transactions`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}recurring`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}candidates`);
    showToast('Transaction history cleared.', undefined, 'info');
  };

  const importCustomTransactions = (imported: Transaction[]) => {
    const { transactions: analyzedTx, recurringPayments: analyzedRec, reviewCandidates: analyzedCand } =
      analyzeTransactions(imported);
    setTransactions(analyzedTx);
    setRecurringPayments(analyzedRec);
    setReviewCandidates(analyzedCand);
    showToast('Transactions analyzed.', `${analyzedTx.length} transactions processed, ${analyzedRec.length} recurring merchants identified.`, 'success');
  };

  const datasetName = transactions.length > 0 ? 'Transaction statement (CSV)' : 'No active dataset';
  const datasetImportDate = 'Today, 10:42 AM';
  const dataSource = transactions.length > 0 ? 'User statement import' : 'None';

  // Metrics
  const activeAndReviewRecurrings = recurringPayments.filter(
    (r) => r.status === 'active' || r.status === 'review' || r.status === 'intentional'
  );
  const monthlyRecurringSpend = activeAndReviewRecurrings.reduce((sum, r) => sum + r.monthlyCost, 0);
  const annualizedRecurringSpend = monthlyRecurringSpend * 12;
  const recurringMerchantsCount = activeAndReviewRecurrings.length;
  const reviewCandidatesCount = reviewCandidates.filter((c) => c.status === 'review').length;
  
  // Composite detection confidence: real average confidence across detected recurring patterns
  const detectionConfidence = recurringPayments.length > 0
    ? Math.round(recurringPayments.reduce((acc, r) => acc + r.recurrenceConfidence, 0) / recurringPayments.length)
    : 0;
  const totalTransactionsCount = transactions.length;

  return (
    <SubSentryContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        transactions,
        recurringPayments,
        reviewCandidates,
        selectedEvidenceMerchant,
        openEvidenceDrawer,
        closeEvidenceDrawer,
        selectedTransaction,
        openTransactionDetail,
        closeTransactionDetail,
        isSearchOpen,
        setIsSearchOpen,
        toast,
        showToast,
        dismissToast,
        keepCandidate,
        dismissCandidate,
        markCandidateForReview,
        resetToSampleData,
        clearDataset,
        importCustomTransactions,
        datasetName,
        datasetImportDate,
        dataSource,
        monthlyRecurringSpend,
        annualizedRecurringSpend,
        recurringMerchantsCount,
        reviewCandidatesCount,
        detectionConfidence,
        totalTransactionsCount,
      }}
    >
      {children}
    </SubSentryContext.Provider>
  );
};

export const useSubSentry = () => {
  const context = useContext(SubSentryContext);
  if (!context) {
    throw new Error('useSubSentry must be used within a SubSentryProvider');
  }
  return context;
};
