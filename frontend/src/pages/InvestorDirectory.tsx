import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { 
  LeftPanel, 
  PanelHeader, 
  NavTabs, 
  ListHeader,
  CenterPanel,
  DetailHeader,
  TabsBar
} from '../components/Layout';
import { InvestorForm } from '../components/InvestorForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { CitationPopup } from '../components/CitationPopup';
import type { Investor, Document, TabId, TabChangeHandler, EffectiveTermsResponse, EffectiveTerm } from '../types';
import styles from './InvestorDirectory.module.css';

interface InvestorDirectoryProps {
  activeTab: TabId;
  onTabChange: TabChangeHandler;
}

function formatCurrency(amount: number | null, currency: string = 'USD'): string {
  if (amount === null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getDocTypeBadgeClass(docType: string): string {
  const map: Record<string, string> = {
    'Side Letter': 'green',
    'Amendment': 'orange',
    'Subscription Agreement': 'blue',
    'Fee Schedule': 'purple',
    'PPM': 'blue',
  };
  return map[docType] || 'default';
}

function getClauseIcon(clauseType: string): string {
  const icons: Record<string, string> = {
    'Management Fee': '%',
    'Carry Terms': '↗',
    'MFN (Most Favored Nation)': '★',
    'Fee Waiver/Discount': '↓',
    'Co-investment Rights': '⊕',
    'Fee Step-Down': '↘',
    'Preferred Return': '⟳',
  };
  return icons[clauseType] || '•';
}

export function InvestorDirectory({ activeTab, onTabChange }: InvestorDirectoryProps) {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [effectiveTerms, setEffectiveTerms] = useState<EffectiveTermsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected investor
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [detailTab, setDetailTab] = useState('overview');
  const [selectedTerm, setSelectedTerm] = useState<EffectiveTerm | null>(null);
  const [citationAnchor, setCitationAnchor] = useState<DOMRect | null>(null);
  const [isCitationOpen, setIsCitationOpen] = useState(false);
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Load documents and effective terms when selected investor changes
  useEffect(() => {
    if (selectedInvestor) {
      loadInvestorDocuments(selectedInvestor.id);
      loadEffectiveTerms(selectedInvestor.id);
    } else {
      setEffectiveTerms(null);
    }
  }, [selectedInvestor?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getInvestors();
      setInvestors(data);
      if (data.length > 0 && !selectedInvestor) {
        setSelectedInvestor(data[0]);
      }
    } catch (err) {
      console.error('Failed to load investors:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadInvestorDocuments = async (investorId: number) => {
    try {
      const docs = await api.getDocuments(investorId);
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const loadEffectiveTerms = async (investorId: number) => {
    try {
      const terms = await api.getEffectiveTerms(investorId);
      setEffectiveTerms(terms);
    } catch (err) {
      console.error('Failed to load effective terms:', err);
      setEffectiveTerms(null);
    }
  };

  // Get documents for selected investor
  const investorDocuments = useMemo(() => {
    if (!selectedInvestor) return [];
    return documents.filter(d => d.investorId === selectedInvestor.id);
  }, [documents, selectedInvestor]);

  const filteredInvestors = useMemo(() => {
    if (!searchQuery) return investors;
    const query = searchQuery.toLowerCase();
    return investors.filter((inv) =>
      inv.name.toLowerCase().includes(query) ||
      inv.fund?.toLowerCase().includes(query) ||
      inv.investorType?.toLowerCase().includes(query)
    );
  }, [investors, searchQuery]);

  const handleCreateInvestor = async (data: Partial<Investor>) => {
    const newInvestor = await api.createInvestor(data);
    setInvestors((prev) => [newInvestor, ...prev]);
    setSelectedInvestor(newInvestor);
  };

  const handleUpdateInvestor = async (data: Partial<Investor>) => {
    if (!editingInvestor) return;
    const updated = await api.updateInvestor(editingInvestor.id, data);
    setInvestors((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    if (selectedInvestor?.id === updated.id) {
      setSelectedInvestor(updated);
    }
  };

  const handleDeleteInvestor = async () => {
    if (!selectedInvestor) return;
    setDeleteLoading(true);
    try {
      await api.deleteInvestor(selectedInvestor.id);
      const remaining = investors.filter((i) => i.id !== selectedInvestor.id);
      setInvestors(remaining);
      setSelectedInvestor(remaining[0] || null);
      setIsDeleteOpen(false);
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openCreate = () => {
    setEditingInvestor(null);
    setIsFormOpen(true);
  };

  const openEdit = () => {
    setEditingInvestor(selectedInvestor);
    setIsFormOpen(true);
  };

  return (
    <>
      {/* Left Panel - Investor List */}
      <LeftPanel>
        <PanelHeader
          searchPlaceholder="Search..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onDataChange={() => {
            loadData();
            setSelectedInvestor(null);
          }}
        />
        
        <NavTabs activeTab={activeTab} onTabChange={onTabChange} />
        
        <ListHeader title="All Investors" count={filteredInvestors.length} />
        
        <div className={styles.investorList}>
          {loading ? (
            <div className={styles.loadingState}>Loading...</div>
          ) : filteredInvestors.length === 0 ? (
            <div className={styles.emptyState}>
              {searchQuery ? 'No investors found' : 'No investors yet'}
            </div>
          ) : (
            filteredInvestors.map((investor) => (
              <div
                key={investor.id}
                className={`${styles.investorItem} ${selectedInvestor?.id === investor.id ? styles.active : ''}`}
                onClick={() => setSelectedInvestor(investor)}
              >
                <div className={styles.investorName}>{investor.name}</div>
                <div className={styles.investorMeta}>
                  {investor.investorType} · {investor.fund || 'No fund'}
                </div>
                <div className={styles.investorCommitment}>
                  {formatCurrency(investor.commitmentAmount, investor.currency)}
                </div>
              </div>
            ))
          )}
        </div>
        
        <button className={styles.addBtn} onClick={openCreate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Investor
        </button>
      </LeftPanel>

      {/* Center Panel - Investor Detail */}
      <CenterPanel>
        {selectedInvestor ? (
          <>
            <DetailHeader
              title={selectedInvestor.name}
              subtitle={`${selectedInvestor.investorType} · Since ${formatDate(selectedInvestor.createdAt)}`}
              badge={<span className={styles.statusBadge}>Active</span>}
              actions={
                <>
                  <button className="btn btn-secondary" onClick={openEdit}>Edit</button>
                  <button className="btn btn-secondary" onClick={() => setIsDeleteOpen(true)}>Delete</button>
                </>
              }
            />
            
            <TabsBar
              tabs={[
                { id: 'overview', label: 'Overview' },
                { id: 'terms', label: 'Effective Terms' },
                { id: 'documents', label: `Documents (${investorDocuments.length})` },
                { id: 'history', label: 'History' },
              ]}
              activeTab={detailTab}
              onTabChange={setDetailTab}
            />
            
            <div className={styles.detailContent}>
              {detailTab === 'overview' && (
                <>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                      <div className={styles.infoLabel}>Commitment</div>
                      <div className={`${styles.infoValue} ${styles.large}`}>
                        {formatCurrency(selectedInvestor.commitmentAmount, selectedInvestor.currency)}
                      </div>
                    </div>
                    <div className={styles.infoCard}>
                      <div className={styles.infoLabel}>Currency</div>
                      <div className={styles.infoValue}>{selectedInvestor.currency}</div>
                    </div>
                    <div className={styles.infoCard}>
                      <div className={styles.infoLabel}>Investor Type</div>
                      <div className={styles.infoValue}>{selectedInvestor.investorType}</div>
                    </div>
                    <div className={styles.infoCard}>
                      <div className={styles.infoLabel}>Fund</div>
                      <div className={styles.infoValue}>{selectedInvestor.fund || '—'}</div>
                    </div>
                    {selectedInvestor.relationshipNotes && (
                      <div className={`${styles.infoCard} ${styles.full}`}>
                        <div className={styles.infoLabel}>Relationship Notes</div>
                        <div className={`${styles.infoValue} ${styles.muted}`}>
                          {selectedInvestor.relationshipNotes}
                        </div>
                      </div>
                    )}
                    {selectedInvestor.internalNotes && (
                      <div className={`${styles.infoCard} ${styles.full}`}>
                        <div className={styles.infoLabel}>Internal Notes</div>
                        <div className={`${styles.infoValue} ${styles.muted}`}>
                          {selectedInvestor.internalNotes}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <h3 className={styles.sectionTitle}>Effective Terms Summary</h3>
                  <div className={styles.termsSummary}>
                    <div 
                      className={`${styles.termCard} ${effectiveTerms?.summary?.managementFee ? styles.hasValue : ''}`}
                      onClick={(e) => {
                        const term = effectiveTerms?.terms?.['Management Fee'];
                        if (term) {
                          setSelectedTerm(term);
                          setCitationAnchor((e.currentTarget as HTMLElement).getBoundingClientRect());
                          setIsCitationOpen(true);
                        }
                      }}
                    >
                      <div className={styles.termType}>Management Fee</div>
                      <div className={styles.termValue}>
                        {effectiveTerms?.summary?.managementFee?.value || '—'}
                        {effectiveTerms?.summary?.managementFee && (
                          <svg className={styles.citationIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                          </svg>
                        )}
                      </div>
                      <div className={styles.termSource}>
                        {effectiveTerms?.summary?.managementFee ? (
                          <span className={styles.sourceTag}>
                            {effectiveTerms.summary.managementFee.source}
                          </span>
                        ) : 'No terms yet'}
                      </div>
                    </div>
                    <div 
                      className={`${styles.termCard} ${effectiveTerms?.summary?.feeStepDown ? styles.hasValue : ''}`}
                      onClick={(e) => {
                        const term = effectiveTerms?.terms?.['Fee Step-Down'];
                        if (term) {
                          setSelectedTerm(term);
                          setCitationAnchor((e.currentTarget as HTMLElement).getBoundingClientRect());
                          setIsCitationOpen(true);
                        }
                      }}
                    >
                      <div className={styles.termType}>Fee Step-Down</div>
                      <div className={styles.termValue}>
                        {effectiveTerms?.summary?.feeStepDown?.value || '—'}
                        {effectiveTerms?.summary?.feeStepDown && (
                          <svg className={styles.citationIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                          </svg>
                        )}
                      </div>
                      <div className={styles.termSource}>
                        {effectiveTerms?.summary?.feeStepDown ? (
                          <span className={styles.sourceTag}>
                            {effectiveTerms.summary.feeStepDown.source}
                          </span>
                        ) : 'No terms yet'}
                      </div>
                    </div>
                    <div 
                      className={`${styles.termCard} ${effectiveTerms?.summary?.mfnProtection ? styles.hasValue : ''}`}
                      onClick={(e) => {
                        const term = effectiveTerms?.terms?.['MFN (Most Favored Nation)'];
                        if (term) {
                          setSelectedTerm(term);
                          setCitationAnchor((e.currentTarget as HTMLElement).getBoundingClientRect());
                          setIsCitationOpen(true);
                        }
                      }}
                    >
                      <div className={styles.termType}>MFN Protection</div>
                      <div className={styles.termValue}>
                        {effectiveTerms?.summary?.mfnProtection?.value || '—'}
                        {effectiveTerms?.summary?.mfnProtection && (
                          <svg className={styles.citationIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                          </svg>
                        )}
                      </div>
                      <div className={styles.termSource}>
                        {effectiveTerms?.summary?.mfnProtection ? (
                          <span className={styles.sourceTag}>
                            {effectiveTerms.summary.mfnProtection.source}
                          </span>
                        ) : 'No terms yet'}
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {detailTab === 'terms' && (
                effectiveTerms && Object.keys(effectiveTerms.terms).length > 0 ? (
                  <div className={styles.effectiveTermsList}>
                    {Object.entries(effectiveTerms.terms).map(([clauseType, term]) => (
                      <div key={clauseType} className={styles.effectiveTermItem}>
                        <div className={styles.termHeader}>
                          <div className={styles.termTypeLabel}>
                            <span className={styles.termIcon}>{getClauseIcon(clauseType)}</span>
                            {clauseType}
                          </div>
                          <button 
                            className={styles.termSourceBadge}
                            onClick={() => {
                              // Open source document in new tab
                              const url = `${window.location.origin}?tab=agreements&documentId=${term.source.documentId}`;
                              window.open(url, '_blank');
                            }}
                            title="View source document in new tab"
                          >
                            <span className={`${styles.docTypeBadge} ${styles[getDocTypeBadgeClass(term.source.documentType)]}`}>
                              {term.source.documentType}
                            </span>
                            {term.source.documentTitle}
                            <svg className={styles.sourceLinkIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                              <polyline points="15 3 21 3 21 9"/>
                              <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                          </button>
                        </div>
                        
                        <div className={styles.termDetails}>
                          {term.rate !== null && (
                            <div className={styles.termDetailItem}>
                              <span className={styles.termDetailLabel}>Rate</span>
                              <span className={styles.termDetailValue}>{term.rate}%</span>
                            </div>
                          )}
                          {term.discount !== null && (
                            <div className={styles.termDetailItem}>
                              <span className={styles.termDetailLabel}>Discount/Step-Down</span>
                              <span className={styles.termDetailValue}>{term.discount}%</span>
                            </div>
                          )}
                          {term.threshold && (
                            <div className={styles.termDetailItem}>
                              <span className={styles.termDetailLabel}>Condition</span>
                              <span className={styles.termDetailValue}>{term.threshold}</span>
                            </div>
                          )}
                          {term.sectionRef && (
                            <div className={styles.termDetailItem}>
                              <span className={styles.termDetailLabel}>Section</span>
                              <span className={styles.termDetailValue}>§{term.sectionRef}</span>
                            </div>
                          )}
                        </div>
                        
                        {term.clauseText && (
                          <div className={styles.termClauseText}>
                            "{term.clauseText}"
                          </div>
                        )}
                        
                        {effectiveTerms.overridden[clauseType] && effectiveTerms.overridden[clauseType].length > 0 && (
                          <div className={styles.overriddenSection}>
                            <div className={styles.overriddenLabel}>
                              Overrides {effectiveTerms.overridden[clauseType].length} other clause(s)
                            </div>
                            <div className={styles.overriddenList}>
                              {effectiveTerms.overridden[clauseType].map((overridden, idx) => (
                                <div key={idx} className={styles.overriddenItem}>
                                  <span className={styles.overriddenValue}>
                                    {overridden.rate !== null ? `${overridden.rate}%` : 
                                     overridden.discount !== null ? `${overridden.discount}% discount` : 
                                     'Clause'}
                                  </span>
                                  <span className={styles.overriddenSource}>
                                    from {overridden.source.documentTitle}
                                  </span>
                                  <span className={styles.overriddenReason}>
                                    ({overridden.reason})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.placeholderState}>
                    <p>No effective terms calculated yet.</p>
                    <span>Add clauses to documents to see effective terms</span>
                  </div>
                )
              )}
              
              {detailTab === 'documents' && (
                investorDocuments.length > 0 ? (
                  <div className={styles.documentsList}>
                    {investorDocuments.map((doc) => (
                      <div 
                        key={doc.id} 
                        className={styles.documentItem}
                        onClick={() => {
                          // Open document in new tab
                          const url = `${window.location.origin}?tab=agreements&documentId=${doc.id}`;
                          window.open(url, '_blank');
                        }}
                        style={{ cursor: 'pointer' }}
                        title="Click to view document in new tab"
                      >
                        <div className={styles.documentIcon}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                        </div>
                        <div className={styles.documentInfo}>
                          <div className={styles.documentName}>{doc.title}</div>
                          <div className={styles.documentMeta}>
                            {doc.docType} · {doc.effectiveDate ? formatDate(doc.effectiveDate) : 'No date'}
                          </div>
                        </div>
                        <div className={styles.documentActions}>
                          <span className={`${styles.documentBadge} ${styles[getDocTypeBadgeClass(doc.docType)]}`}>
                            {doc.clauses?.length || 0} clauses
                          </span>
                          <svg className={styles.openIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </div>
                      </div>
                    ))}
                    <button 
                      className={styles.viewAllBtn}
                      onClick={() => onTabChange('agreements')}
                    >
                      View all documents →
                    </button>
                  </div>
                ) : (
                  <div className={styles.placeholderState}>
                    <p>No documents linked to this investor yet.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => onTabChange('agreements')}
                    >
                      Add Document
                    </button>
                  </div>
                )
              )}
              
              {detailTab === 'history' && (
                <div className={styles.placeholderState}>
                  <p>Audit history will show all changes to this investor.</p>
                  <span>Coming in Phase 11</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={styles.noSelection}>
            <p>Select an investor to view details</p>
            <button className="btn btn-primary" onClick={openCreate}>
              Add Your First Investor
            </button>
          </div>
        )}
      </CenterPanel>


      {/* Modals */}
      <InvestorForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingInvestor(null);
        }}
        onSubmit={editingInvestor ? handleUpdateInvestor : handleCreateInvestor}
        investor={editingInvestor}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteInvestor}
        title="Delete Investor"
        message={`Are you sure you want to delete "${selectedInvestor?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleteLoading}
      />

      {selectedTerm && (
        <CitationPopup
          term={selectedTerm}
          isOpen={isCitationOpen}
          onClose={() => {
            setIsCitationOpen(false);
            setSelectedTerm(null);
          }}
          onViewDocument={(docId) => {
            setIsCitationOpen(false);
            setSelectedTerm(null);
            // Open document in a new tab with deep link
            const url = `${window.location.origin}?tab=agreements&documentId=${docId}`;
            window.open(url, '_blank');
          }}
          anchorRect={citationAnchor}
        />
      )}
    </>
  );
}
