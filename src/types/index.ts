export type CadenceType = "Monthly" | "Annual" | "Weekly" | "Variable";

export type EntityStatus = "active" | "review" | "intentional" | "dismissed" | "non-recurring";

export interface EvidenceScore {
  frequencyConsistency: number; // 30% weight
  intervalConsistency: number;  // 30% weight
  amountStability: number;      // 25% weight
  merchantConsistency: number;  // 15% weight
  totalConfidence: number;      // Calculated composite (0-100)
  consecutivePayments: number;
  averageInterval: number;
  amountVariance: number;
  observations: string[];
}

export interface Transaction {
  id: string;
  date: string; // ISO format YYYY-MM-DD
  merchantRaw: string;
  merchantNormalized: string;
  description: string;
  amount: number;
  category: string;
  isRecurring: boolean;
  recurrenceConfidence: number;
  status: EntityStatus;
  paymentMethod?: string;
  notes?: string;
}

export interface RecurringPayment {
  id: string;
  merchant: string;
  category: string;
  averageAmount: number;
  monthlyCost: number;
  cadence: CadenceType;
  averageIntervalDays: number;
  transactionCount: number;
  consecutivePayments: number;
  recurrenceConfidence: number;
  lastPaymentDate: string;
  nextExpectedDate: string;
  status: "active" | "review" | "intentional" | "dismissed";
  evidence: EvidenceScore;
  rawDescriptors: string[];
  transactionIds: string[];
  logoText: string;
  badgeTone?: "positive" | "amber" | "warning";
  isFlagship?: boolean;
}

export interface ReviewCandidate {
  id: string;
  recurringPaymentId: string;
  merchant: string;
  category: string;
  reason: string;
  confidence: number;
  monthlyCost: number;
  totalSpent: number;
  averageIntervalDays: number;
  consecutivePayments: number;
  status: "review" | "intentional" | "dismissed";
  evidenceChecklist: string[];
  alertLevel: "high" | "medium";
  notes: string;
}

export interface MerchantNormalizationSummary {
  normalizedName: string;
  category: string;
  rawVariants: string[];
  totalTransactions: number;
  totalSpent: number;
  isRecurring: boolean;
  confidence: number;
}

export type PageRoute = 
  | "/"
  | "/transactions"
  | "/recurring"
  | "/review"
  | "/insights"
  | "/merchants"
  | "/import"
  | "/datasets"
  | "/report"
  | "/settings"
  | "/about";
