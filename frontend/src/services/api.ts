import type { Investor, Document, Clause, EffectiveTermsResponse, ExtractionResult, ExtractedClause } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// =============================================================================
// MOCK DATA FALLBACKS (used when API is unavailable)
// =============================================================================

const MOCK_INVESTORS: Investor[] = [
  {
    id: 1,
    name: 'Atlas Capital Partners',
    investorType: 'Institutional',
    commitmentAmount: 250000000,
    currency: 'USD',
    fund: 'Atlas Growth Fund III',
    relationshipNotes: 'Long-term strategic partner since 2019',
    internalNotes: 'Key account - prioritize requests',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-01T14:30:00Z',
  },
  {
    id: 2,
    name: 'Meridian Wealth Management',
    investorType: 'Wealth Management',
    commitmentAmount: 75000000,
    currency: 'USD',
    fund: 'Atlas Growth Fund III',
    relationshipNotes: 'Fee schedule updated Q2 2024',
    internalNotes: 'Multiple sub-accounts',
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-05-15T11:00:00Z',
  },
  {
    id: 3,
    name: 'Cornerstone Family Office',
    investorType: 'Family Office',
    commitmentAmount: 120000000,
    currency: 'USD',
    fund: 'Atlas Growth Fund III',
    relationshipNotes: 'Bespoke side letter arrangements',
    internalNotes: 'MFN rights holder',
    createdAt: '2024-03-10T08:00:00Z',
    updatedAt: '2024-04-20T16:45:00Z',
  },
];

const MOCK_CLAUSES: Clause[] = [
  {
    id: 1,
    documentId: 1,
    clauseType: 'management_fee',
    clauseText: 'The Management Fee shall be 1.50% per annum of committed capital.',
    rate: 1.5,
    threshold: null,
    thresholdAmount: null,
    discount: null,
    effectiveDate: '2024-01-15',
    notes: 'Annual management fee on committed capital',
    pageNumber: 12,
    sectionRef: 'Section 4.1(a)',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    documentId: 1,
    clauseType: 'performance_fee',
    clauseText: 'Carried Interest shall be 20% of profits above the Preferred Return.',
    rate: 20,
    threshold: 'preferred_return',
    thresholdAmount: 8,
    discount: null,
    effectiveDate: '2024-01-15',
    notes: 'Subject to 8% preferred return hurdle',
    pageNumber: 15,
    sectionRef: 'Section 4.2',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 3,
    documentId: 2,
    clauseType: 'management_fee',
    clauseText: 'Notwithstanding Section 4.1(a), the Management Fee shall be reduced to 1.25%.',
    rate: 1.25,
    threshold: null,
    thresholdAmount: null,
    discount: 0.25,
    effectiveDate: '2024-03-01',
    notes: 'Reduced rate per side letter effective March 2024',
    pageNumber: 1,
    sectionRef: 'Amendment Section 1',
    createdAt: '2024-03-01T09:00:00Z',
  },
  {
    id: 4,
    documentId: 3,
    clauseType: 'fee_step_down',
    clauseText: 'Management fees shall be tiered: 1.50% on first $50M, 1.25% on next $50M, 1.00% above $100M.',
    rate: 1.5,
    threshold: 'aum_breakpoint',
    thresholdAmount: 50000000,
    discount: null,
    effectiveDate: '2024-02-20',
    notes: 'Tiered based on AUM breakpoints',
    pageNumber: 3,
    sectionRef: 'Schedule A',
    createdAt: '2024-02-20T09:00:00Z',
  },
  {
    id: 5,
    documentId: 4,
    clauseType: 'mfn_protection',
    clauseText: 'Investor shall be entitled to the most favorable terms offered to any similar investor.',
    rate: null,
    threshold: null,
    thresholdAmount: null,
    discount: null,
    effectiveDate: '2024-03-10',
    notes: 'Most Favored Nation rights',
    pageNumber: 8,
    sectionRef: 'Section 8.3',
    createdAt: '2024-03-10T08:00:00Z',
  },
];

const MOCK_DOCUMENTS: Document[] = [
  {
    id: 1,
    investorId: 1,
    title: 'Master Subscription Agreement',
    docType: 'Subscription Agreement',
    status: 'Active',
    effectiveDate: '2024-01-15',
    supersedesId: null,
    priority: 1,
    fileName: 'atlas_subscription_2024.pdf',
    fileUrl: null,
    sourceText: 'This Master Subscription Agreement is entered into as of January 15, 2024...',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    clauses: MOCK_CLAUSES.filter(c => c.documentId === 1),
  },
  {
    id: 2,
    investorId: 1,
    title: 'Side Letter - Fee Reduction',
    docType: 'Side Letter',
    status: 'Active',
    effectiveDate: '2024-03-01',
    supersedesId: null,
    priority: 2,
    fileName: 'atlas_side_letter_fees.pdf',
    fileUrl: null,
    sourceText: 'This Side Letter amends the Master Subscription Agreement to provide reduced management fees...',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    clauses: MOCK_CLAUSES.filter(c => c.documentId === 2),
  },
  {
    id: 3,
    investorId: 2,
    title: 'Fee Schedule Agreement',
    docType: 'Fee Schedule',
    status: 'Active',
    effectiveDate: '2024-02-20',
    supersedesId: null,
    priority: 1,
    fileName: 'meridian_fee_schedule.pdf',
    fileUrl: null,
    sourceText: 'Fee Schedule for Meridian Wealth Management accounts...',
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-05-15T11:00:00Z',
    clauses: MOCK_CLAUSES.filter(c => c.documentId === 3),
  },
  {
    id: 4,
    investorId: 3,
    title: 'Limited Partnership Agreement',
    docType: 'LPA',
    status: 'Active',
    effectiveDate: '2024-03-10',
    supersedesId: null,
    priority: 1,
    fileName: 'cornerstone_lpa.pdf',
    fileUrl: null,
    sourceText: 'Limited Partnership Agreement for Cornerstone Family Office...',
    createdAt: '2024-03-10T08:00:00Z',
    updatedAt: '2024-03-10T08:00:00Z',
    clauses: MOCK_CLAUSES.filter(c => c.documentId === 4),
  },
];

// In-memory state for mock mode modifications
let mockInvestors = [...MOCK_INVESTORS];
let mockDocuments = [...MOCK_DOCUMENTS];
let mockClauses = [...MOCK_CLAUSES];
let nextMockInvestorId = 4;
let nextMockDocumentId = 5;
let nextMockClauseId = 6;

// =============================================================================
// API REQUEST HELPER
// =============================================================================

const REQUEST_TIMEOUT_MS = 5000; // 5 second timeout for API requests

function getToken(): string | null {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Helper to try API first, fall back to mock
async function tryApiOrMock<T>(
  apiCall: () => Promise<T>,
  mockFallback: () => T | Promise<T>
): Promise<T> {
  try {
    return await apiCall();
  } catch {
    console.log('API unavailable, using mock data');
    return mockFallback();
  }
}

// =============================================================================
// API EXPORTS
// =============================================================================

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: { email: string; displayName: string } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    ),

  getCurrentUser: () =>
    request<{ email: string; displayName: string }>('/auth/me'),

  // Investors
  getInvestors: (): Promise<Investor[]> =>
    tryApiOrMock(
      () => request<Investor[]>('/investors'),
      () => [...mockInvestors]
    ),
  
  createInvestor: (data: Partial<Investor>): Promise<Investor> =>
    tryApiOrMock(
      () => request<Investor>('/investors', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      () => {
        const newInvestor: Investor = {
          id: nextMockInvestorId++,
          name: data.name || 'New Investor',
          investorType: data.investorType || 'Institutional',
          commitmentAmount: data.commitmentAmount || null,
          currency: data.currency || 'USD',
          fund: data.fund || '',
          relationshipNotes: data.relationshipNotes || '',
          internalNotes: data.internalNotes || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockInvestors.push(newInvestor);
        return newInvestor;
      }
    ),

  getInvestor: (id: number): Promise<Investor> =>
    tryApiOrMock(
      () => request<Investor>(`/investors/${id}`),
      () => {
        const investor = mockInvestors.find(i => i.id === id);
        if (!investor) throw new Error('Investor not found');
        return investor;
      }
    ),

  updateInvestor: (id: number, data: Partial<Investor>): Promise<Investor> =>
    tryApiOrMock(
      () => request<Investor>(`/investors/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
      () => {
        const index = mockInvestors.findIndex(i => i.id === id);
        if (index === -1) throw new Error('Investor not found');
        mockInvestors[index] = { ...mockInvestors[index], ...data, updatedAt: new Date().toISOString() };
        return mockInvestors[index];
      }
    ),

  deleteInvestor: (id: number): Promise<void> =>
    tryApiOrMock(
      () => request<void>(`/investors/${id}`, { method: 'DELETE' }),
      () => {
        mockInvestors = mockInvestors.filter(i => i.id !== id);
        mockDocuments = mockDocuments.filter(d => d.investorId !== id);
      }
    ),

  getEffectiveTerms: (investorId: number): Promise<EffectiveTermsResponse> =>
    tryApiOrMock(
      () => request<EffectiveTermsResponse>(`/investors/${investorId}/effective-terms`),
      () => {
        const investorDocs = mockDocuments.filter(d => d.investorId === investorId);
        const investorClauses = mockClauses.filter(c => investorDocs.some(d => d.id === c.documentId));
        
        const terms: EffectiveTermsResponse['terms'] = {};
        investorClauses.forEach(c => {
          const doc = investorDocs.find(d => d.id === c.documentId);
          terms[c.clauseType] = {
            clauseId: c.id,
            clauseType: c.clauseType,
            rate: c.rate,
            discount: c.discount,
            threshold: c.threshold,
            thresholdAmount: c.thresholdAmount,
            effectiveDate: c.effectiveDate,
            clauseText: c.clauseText,
            notes: c.notes,
            sectionRef: c.sectionRef,
            source: {
              documentId: doc?.id || 0,
              documentTitle: doc?.title || '',
              documentType: doc?.docType || '',
              priority: doc?.priority || 0,
              effectiveDate: doc?.effectiveDate || null,
            },
          };
        });

        return {
          terms,
          overridden: {},
          summary: {},
        };
      }
    ),

  // Documents
  getDocuments: (investorId?: number): Promise<Document[]> =>
    tryApiOrMock(
      () => request<Document[]>(`/documents${investorId ? `?investorId=${investorId}` : ''}`),
      () => {
        let result = [...mockDocuments];
        if (investorId) {
          result = result.filter(d => d.investorId === investorId);
        }
        return result.map(d => ({
          ...d,
          clauses: mockClauses.filter(c => c.documentId === d.id),
        }));
      }
    ),

  createDocument: (data: Partial<Document>): Promise<Document> =>
    tryApiOrMock(
      () => request<Document>('/documents', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      () => {
        const newDoc: Document = {
          id: nextMockDocumentId++,
          investorId: data.investorId || 1,
          title: data.title || 'New Document',
          docType: data.docType || 'Agreement',
          status: data.status || 'Draft',
          effectiveDate: data.effectiveDate || new Date().toISOString().split('T')[0],
          supersedesId: data.supersedesId || null,
          priority: data.priority || 1,
          fileName: data.fileName || null,
          fileUrl: data.fileUrl || null,
          sourceText: data.sourceText || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          clauses: [],
        };
        mockDocuments.push(newDoc);
        return newDoc;
      }
    ),

  getDocument: (id: number): Promise<Document> =>
    tryApiOrMock(
      () => request<Document>(`/documents/${id}`),
      () => {
        const doc = mockDocuments.find(d => d.id === id);
        if (!doc) throw new Error('Document not found');
        return {
          ...doc,
          clauses: mockClauses.filter(c => c.documentId === id),
        };
      }
    ),

  deleteDocument: (id: number): Promise<void> =>
    tryApiOrMock(
      () => request<void>(`/documents/${id}`, { method: 'DELETE' }),
      () => {
        mockDocuments = mockDocuments.filter(d => d.id !== id);
        mockClauses = mockClauses.filter(c => c.documentId !== id);
      }
    ),

  // Clauses
  createClause: (documentId: number, data: Partial<Clause>): Promise<Clause> =>
    tryApiOrMock(
      () => request<Clause>(`/documents/${documentId}/clauses`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      () => {
        const newClause: Clause = {
          id: nextMockClauseId++,
          documentId,
          clauseType: data.clauseType || 'general',
          clauseText: data.clauseText || '',
          rate: data.rate || null,
          threshold: data.threshold || null,
          thresholdAmount: data.thresholdAmount || null,
          discount: data.discount || null,
          effectiveDate: data.effectiveDate || null,
          notes: data.notes || null,
          pageNumber: data.pageNumber || null,
          sectionRef: data.sectionRef || null,
          createdAt: new Date().toISOString(),
        };
        mockClauses.push(newClause);
        return newClause;
      }
    ),

  getClause: (id: number): Promise<Clause> =>
    tryApiOrMock(
      () => request<Clause>(`/clauses/${id}`),
      () => {
        const clause = mockClauses.find(c => c.id === id);
        if (!clause) throw new Error('Clause not found');
        return clause;
      }
    ),

  updateClause: (id: number, data: Partial<Clause>): Promise<Clause> =>
    tryApiOrMock(
      () => request<Clause>(`/clauses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
      () => {
        const index = mockClauses.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Clause not found');
        mockClauses[index] = { ...mockClauses[index], ...data };
        return mockClauses[index];
      }
    ),

  deleteClause: (id: number): Promise<void> =>
    tryApiOrMock(
      () => request<void>(`/clauses/${id}`, { method: 'DELETE' }),
      () => {
        mockClauses = mockClauses.filter(c => c.id !== id);
      }
    ),

  // Demo Data
  seedDemoData: () =>
    tryApiOrMock(
      () => request<{ message: string; created: { investors: number; documents: number; clauses: number } }>(
        '/demo/seed',
        { method: 'POST' }
      ),
      () => {
        mockInvestors = [...MOCK_INVESTORS];
        mockDocuments = [...MOCK_DOCUMENTS];
        mockClauses = [...MOCK_CLAUSES];
        return { message: 'Demo data seeded', created: { investors: 3, documents: 4, clauses: 5 } };
      }
    ),

  clearAllData: () =>
    tryApiOrMock(
      () => request<{ message: string }>('/demo/clear', { method: 'POST' }),
      () => {
        mockInvestors = [];
        mockDocuments = [];
        mockClauses = [];
        return { message: 'All data cleared' };
      }
    ),

  // AI Extraction
  extractClauses: (text: string, mock?: boolean): Promise<ExtractionResult> =>
    tryApiOrMock(
      () => request<ExtractionResult>('/extract', {
        method: 'POST',
        body: JSON.stringify({ text, mock }),
      }),
      () => ({
        document_info: {
          detected_type: 'Side Letter',
          detected_investor: 'Sample Investor',
          detected_fund: 'Sample Fund',
          effective_date: new Date().toISOString().split('T')[0],
        },
        clauses: [
          {
            clause_type: 'management_fee',
            rate: 1.5,
            discount: null,
            threshold: null,
            threshold_amount: null,
            effective_date: new Date().toISOString().split('T')[0],
            section_ref: 'Section 4.1',
            page_number: 5,
            clause_text: 'The Management Fee shall be 1.50% per annum.',
            confidence: 0.95,
            notes: null,
          },
        ],
      })
    ),

  applyExtraction: (documentId: number, clauses: ExtractedClause[], sourceText?: string) =>
    tryApiOrMock(
      () => request<{ message: string; clauses: Clause[]; document?: Document }>('/extract/apply', {
        method: 'POST',
        body: JSON.stringify({ documentId, clauses, sourceText }),
      }),
      () => {
        const newClauses: Clause[] = clauses.map(ec => ({
          id: nextMockClauseId++,
          documentId,
          clauseType: ec.clause_type,
          clauseText: ec.clause_text,
          rate: ec.rate,
          threshold: ec.threshold,
          thresholdAmount: ec.threshold_amount,
          discount: ec.discount,
          effectiveDate: ec.effective_date,
          notes: ec.notes,
          pageNumber: ec.page_number,
          sectionRef: ec.section_ref,
          createdAt: new Date().toISOString(),
        }));
        mockClauses.push(...newClauses);
        
        if (sourceText) {
          const docIndex = mockDocuments.findIndex(d => d.id === documentId);
          if (docIndex !== -1) {
            mockDocuments[docIndex] = { ...mockDocuments[docIndex], sourceText, updatedAt: new Date().toISOString() };
          }
        }
        
        const doc = mockDocuments.find(d => d.id === documentId);
        return { 
          message: 'Clauses applied', 
          clauses: newClauses, 
          document: doc ? { ...doc, clauses: mockClauses.filter(c => c.documentId === documentId) } : undefined 
        };
      }
    ),
};
