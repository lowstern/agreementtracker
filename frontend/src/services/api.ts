const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
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

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

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
  getInvestors: () => request<import('../types').Investor[]>('/investors'),
  
  createInvestor: (data: Partial<import('../types').Investor>) =>
    request<import('../types').Investor>('/investors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getInvestor: (id: number) =>
    request<import('../types').Investor>(`/investors/${id}`),

  updateInvestor: (id: number, data: Partial<import('../types').Investor>) =>
    request<import('../types').Investor>(`/investors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteInvestor: (id: number) =>
    request<void>(`/investors/${id}`, { method: 'DELETE' }),

  getEffectiveTerms: (investorId: number) =>
    request<import('../types').EffectiveTermsResponse>(`/investors/${investorId}/effective-terms`),

  // Documents
  getDocuments: (investorId?: number) =>
    request<import('../types').Document[]>(
      `/documents${investorId ? `?investorId=${investorId}` : ''}`
    ),

  createDocument: (data: Partial<import('../types').Document>) =>
    request<import('../types').Document>('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getDocument: (id: number) =>
    request<import('../types').Document>(`/documents/${id}`),

  deleteDocument: (id: number) =>
    request<void>(`/documents/${id}`, { method: 'DELETE' }),

  // Clauses
  createClause: (documentId: number, data: Partial<import('../types').Clause>) =>
    request<import('../types').Clause>(`/documents/${documentId}/clauses`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getClause: (id: number) =>
    request<import('../types').Clause>(`/clauses/${id}`),

  updateClause: (id: number, data: Partial<import('../types').Clause>) =>
    request<import('../types').Clause>(`/clauses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteClause: (id: number) =>
    request<void>(`/clauses/${id}`, { method: 'DELETE' }),

  // Demo Data
  seedDemoData: () =>
    request<{ message: string; created: { investors: number; documents: number; clauses: number } }>(
      '/demo/seed',
      { method: 'POST' }
    ),

  clearAllData: () =>
    request<{ message: string }>('/demo/clear', { method: 'POST' }),

  // AI Extraction
  extractClauses: (text: string, mock?: boolean) =>
    request<import('../types').ExtractionResult>('/extract', {
      method: 'POST',
      body: JSON.stringify({ text, mock }),
    }),

  applyExtraction: (documentId: number, clauses: import('../types').ExtractedClause[], sourceText?: string) =>
    request<{ message: string; clauses: import('../types').Clause[]; document?: import('../types').Document }>('/extract/apply', {
      method: 'POST',
      body: JSON.stringify({ documentId, clauses, sourceText }),
    }),
};
