export interface User {
  email: string;
  displayName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Investor {
  id: number;
  name: string;
  investorType: string;
  commitmentAmount: number | null;
  currency: string;
  fund: string;
  relationshipNotes: string;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Clause {
  id: number;
  documentId: number;
  clauseType: string;
  clauseText: string;
  rate: number | null;
  threshold: string | null;
  thresholdAmount: number | null;
  discount: number | null;
  effectiveDate: string | null;
  notes: string | null;
  pageNumber: number | null;
  sectionRef: string | null;
  createdAt: string;
}

export interface Document {
  id: number;
  investorId: number;
  title: string;
  docType: string;
  status: string;
  effectiveDate: string | null;
  supersedesId: number | null;
  priority: number;
  fileName: string | null;
  fileUrl: string | null;
  sourceText: string | null;
  createdAt: string;
  updatedAt: string;
  clauses: Clause[];
}

export type TabId = 'investors' | 'agreements' | 'fees';

// Tab change options for navigation with deep linking
export interface TabChangeOptions {
  documentId?: number;
}

export type TabChangeHandler = (tab: TabId, options?: TabChangeOptions) => void;

// Effective Terms types
export interface TermSource {
  documentId: number;
  documentTitle: string;
  documentType: string;
  priority: number;
  effectiveDate: string | null;
}

export interface EffectiveTerm {
  clauseId: number;
  clauseType: string;
  rate: number | null;
  discount: number | null;
  threshold: string | null;
  thresholdAmount: number | null;
  effectiveDate: string | null;
  clauseText: string | null;
  notes: string | null;
  sectionRef: string | null;
  source: TermSource;
}

export interface OverriddenTerm {
  clauseId: number;
  rate: number | null;
  discount: number | null;
  threshold: string | null;
  clauseText: string | null;
  source: TermSource;
  reason: string;
}

export interface TermSummaryItem {
  value: string;
  source: string;
  documentType: string;
}

export interface TermsSummary {
  managementFee?: TermSummaryItem;
  feeStepDown?: TermSummaryItem;
  mfnProtection?: TermSummaryItem;
  carryTerms?: TermSummaryItem;
  preferredReturn?: TermSummaryItem;
  feeWaiver?: TermSummaryItem;
  coInvestment?: TermSummaryItem;
}

export interface EffectiveTermsResponse {
  terms: Record<string, EffectiveTerm>;
  overridden: Record<string, OverriddenTerm[]>;
  summary: TermsSummary;
}

// AI Extraction types
export interface ExtractedClause {
  clause_type: string;
  rate: number | null;
  discount: number | null;
  threshold: string | null;
  threshold_amount: number | null;
  effective_date: string | null;
  section_ref: string | null;
  page_number: number | null;
  clause_text: string;
  confidence: number;
  notes: string | null;
  approved?: boolean;
}

export interface DocumentInfo {
  detected_type: string;
  detected_investor: string | null;
  detected_fund: string | null;
  effective_date: string | null;
}

export interface ExtractionResult {
  document_info: DocumentInfo;
  clauses: ExtractedClause[];
  extraction_notes?: string;
  error?: string;
  ai_error?: string;
}
