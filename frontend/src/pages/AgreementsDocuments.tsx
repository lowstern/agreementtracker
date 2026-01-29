import { useState, useEffect, useMemo, useRef } from 'react';
import { api } from '../services/api';
import { 
  LeftPanel, 
  PanelHeader, 
  NavTabs, 
  ListHeader,
  CenterPanel,
  RightPanel,
  DetailHeader,
  TabsBar
} from '../components/Layout';
import { DocumentForm } from '../components/DocumentForm';
import { ClauseForm } from '../components/ClauseForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ExtractionModal } from '../components/ExtractionModal';
import type { Document, Investor, Clause, TabId, TabChangeHandler, ExtractedClause } from '../types';
import styles from './AgreementsDocuments.module.css';

interface AgreementsDocumentsProps {
  activeTab: TabId;
  onTabChange: TabChangeHandler;
  onRightPanelChange?: (isOpen: boolean) => void;
  initialDocumentId?: number | null;
  onDocumentIdConsumed?: () => void;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '—';
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

function getPriorityLabel(priority: number): string {
  const labels: Record<number, string> = {
    4: '4 (Highest)',
    3: '3 (High)',
    2: '2 (Medium)',
    1: '1 (Low)',
  };
  return labels[priority] || `${priority}`;
}

export function AgreementsDocuments({ activeTab, onTabChange, onRightPanelChange, initialDocumentId, onDocumentIdConsumed }: AgreementsDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInvestorId, setFilterInvestorId] = useState<string>('all');
  
  // Selected document
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [detailTab, setDetailTab] = useState('clauses');
  
  // Document modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Clause state
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [isClauseFormOpen, setIsClauseFormOpen] = useState(false);
  const [editingClause, setEditingClause] = useState<Clause | null>(null);
  const [isClauseDeleteOpen, setIsClauseDeleteOpen] = useState(false);
  const [clauseDeleteLoading, setClauseDeleteLoading] = useState(false);
  
  // Extraction state
  const [isExtractionOpen, setIsExtractionOpen] = useState(false);
  const [autoExtractOnOpen, setAutoExtractOnOpen] = useState(false);
  
  // Track if we've already consumed the initialDocumentId
  const initialDocIdConsumed = useRef(false);

  useEffect(() => {
    loadData();
  }, []);
  
  // Handle deep link to specific document via URL param
  useEffect(() => {
    if (initialDocumentId && documents.length > 0 && !initialDocIdConsumed.current) {
      const targetDoc = documents.find(d => d.id === initialDocumentId);
      if (targetDoc) {
        setSelectedDocument(targetDoc);
        // Clear any filters that might hide the document
        setSearchQuery('');
        setFilterInvestorId('all');
        initialDocIdConsumed.current = true;
        // Notify parent that we've consumed the documentId
        onDocumentIdConsumed?.();
      }
    }
  }, [initialDocumentId, documents, onDocumentIdConsumed]);
  
  // Reset the consumed flag when initialDocumentId changes
  useEffect(() => {
    if (!initialDocumentId) {
      initialDocIdConsumed.current = false;
    }
  }, [initialDocumentId]);

  // Notify parent when right panel should open/close
  useEffect(() => {
    onRightPanelChange?.(!!selectedDocument);
  }, [selectedDocument, onRightPanelChange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [docsData, investorsData] = await Promise.all([
        api.getDocuments(),
        api.getInvestors(),
      ]);
      setDocuments(docsData);
      setInvestors(investorsData);
      if (docsData.length > 0 && !selectedDocument) {
        setSelectedDocument(docsData[0]);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = 
        searchQuery === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.docType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesInvestor = 
        filterInvestorId === 'all' || 
        doc.investorId === parseInt(filterInvestorId);

      return matchesSearch && matchesInvestor;
    });
  }, [documents, searchQuery, filterInvestorId]);

  const getInvestorName = (investorId: number): string => {
    return investors.find(i => i.id === investorId)?.name || 'Unknown';
  };

  const handleCreateDocument = async (data: Partial<Document> & { sourceText?: string; autoExtract?: boolean }) => {
    const { autoExtract, ...docData } = data;
    let newDoc = await api.createDocument(docData);
    
    // If sourceText was sent but not returned, fetch full document
    // This ensures highlighting works for newly uploaded documents
    if (docData.sourceText && !newDoc.sourceText) {
      console.log('Fetching full document after creation (sourceText was not returned)...');
      newDoc = await api.getDocument(newDoc.id);
    }
    
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocument(newDoc);
    
    // If auto-extract is enabled and we have source text, open extraction modal
    if (autoExtract && docData.sourceText && docData.sourceText.length > 50) {
      setAutoExtractOnOpen(true);
      setIsExtractionOpen(true);
    }
  };

  const handleUpdateDocument = async (data: Partial<Document>) => {
    if (!editingDocument) return;
    // Note: We'd need an update endpoint - for now just refresh
    await api.createDocument({ ...editingDocument, ...data });
    loadData();
  };

  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;
    setDeleteLoading(true);
    try {
      await api.deleteDocument(selectedDocument.id);
      const remaining = documents.filter((d) => d.id !== selectedDocument.id);
      setDocuments(remaining);
      setSelectedDocument(remaining[0] || null);
      setIsDeleteOpen(false);
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openCreate = () => {
    setEditingDocument(null);
    setIsFormOpen(true);
  };

  const openEdit = () => {
    setEditingDocument(selectedDocument);
    setIsFormOpen(true);
  };

  // Clause handlers
  const handleCreateClause = async (data: Partial<Clause>) => {
    if (!selectedDocument) return;
    const newClause = await api.createClause(selectedDocument.id, data);
    
    // Update the selected document with the new clause
    const updatedDoc = {
      ...selectedDocument,
      clauses: [...(selectedDocument.clauses || []), newClause],
    };
    setSelectedDocument(updatedDoc);
    setDocuments((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
  };

  const handleUpdateClause = async (data: Partial<Clause>) => {
    if (!editingClause) return;
    const updatedClause = await api.updateClause(editingClause.id, data);
    
    // Update the selected document with the updated clause
    if (selectedDocument) {
      const updatedDoc = {
        ...selectedDocument,
        clauses: selectedDocument.clauses?.map((c) =>
          c.id === updatedClause.id ? updatedClause : c
        ) || [],
      };
      setSelectedDocument(updatedDoc);
      setDocuments((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
    }
  };

  const handleDeleteClause = async () => {
    if (!selectedClause || !selectedDocument) return;
    setClauseDeleteLoading(true);
    try {
      await api.deleteClause(selectedClause.id);
      
      // Update the selected document without the deleted clause
      const updatedDoc = {
        ...selectedDocument,
        clauses: selectedDocument.clauses?.filter((c) => c.id !== selectedClause.id) || [],
      };
      setSelectedDocument(updatedDoc);
      setDocuments((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
      setSelectedClause(null);
      setIsClauseDeleteOpen(false);
    } catch (err) {
      console.error('Failed to delete clause:', err);
    } finally {
      setClauseDeleteLoading(false);
    }
  };

  const openClauseCreate = () => {
    setEditingClause(null);
    setIsClauseFormOpen(true);
  };

  const openClauseEdit = (clause: Clause) => {
    setEditingClause(clause);
    setIsClauseFormOpen(true);
  };

  const openClauseDelete = (clause: Clause) => {
    setSelectedClause(clause);
    setIsClauseDeleteOpen(true);
  };

  // Extraction handler
  const handleApplyExtraction = async (extractedClauses: ExtractedClause[], sourceText: string) => {
    if (!selectedDocument) return;
    
    try {
      const result = await api.applyExtraction(selectedDocument.id, extractedClauses, sourceText);
      
      // Use the full document returned from the API (includes sourceText and all clauses)
      let updatedDoc = result.document;
      
      // If backend didn't return document or it's missing critical data, fetch it from API
      if (!updatedDoc || !updatedDoc.sourceText || !updatedDoc.clauses || updatedDoc.clauses.length === 0) {
        console.log('Fetching full document after extraction (missing sourceText or clauses)...');
        updatedDoc = await api.getDocument(selectedDocument.id);
      }
      
      console.log('Updated document after extraction:', {
        id: updatedDoc.id,
        title: updatedDoc.title,
        hasSourceText: !!updatedDoc.sourceText,
        sourceTextLength: updatedDoc.sourceText?.length || 0,
        clausesCount: updatedDoc.clauses?.length || 0,
        clauseTexts: updatedDoc.clauses?.map(c => c.clauseText?.substring(0, 50))
      });
      
      setSelectedDocument(updatedDoc);
      setDocuments((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
    } catch (err) {
      console.error('Failed to apply extraction:', err);
    }
  };

  const getClauseIcon = (clauseType: string): string => {
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
  };

  // State for highlighted clause (selected from center panel)
  const [selectedClauseId, setSelectedClauseId] = useState<number | null>(null);

  // Scroll to highlighted clause when selected
  useEffect(() => {
    if (selectedClauseId) {
      const element = document.getElementById(`clause-highlight-${selectedClauseId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedClauseId]);

  // Clear selection when document changes
  useEffect(() => {
    setSelectedClauseId(null);
  }, [selectedDocument?.id]);

  // Handle clause click in center panel
  const handleClauseClick = (clauseId: number) => {
    setSelectedClauseId(selectedClauseId === clauseId ? null : clauseId);
  };

  // Helper function to find text with normalized whitespace matching
  const findTextWithNormalizedMatch = (sourceText: string, searchText: string): { start: number; end: number } | null => {
    // First try exact match
    let index = sourceText.indexOf(searchText);
    if (index !== -1) {
      return { start: index, end: index + searchText.length };
    }
    
    // Try with normalized whitespace - replace multiple spaces/newlines with single space
    const normalizeWhitespace = (s: string) => s.replace(/\s+/g, ' ').trim();
    const normalizedSearch = normalizeWhitespace(searchText);
    
    // Create a version of sourceText where we track original positions
    // We'll search in normalized space but map back to original positions
    let normalizedSource = '';
    const positionMap: number[] = []; // normalizedSource index -> sourceText index
    let lastWasSpace = false;
    
    for (let i = 0; i < sourceText.length; i++) {
      const char = sourceText[i];
      const isWhitespace = /\s/.test(char);
      
      if (isWhitespace) {
        if (!lastWasSpace && normalizedSource.length > 0) {
          normalizedSource += ' ';
          positionMap.push(i);
        }
        lastWasSpace = true;
      } else {
        normalizedSource += char;
        positionMap.push(i);
        lastWasSpace = false;
      }
    }
    
    // Search in normalized text
    const normalizedIndex = normalizedSource.indexOf(normalizedSearch);
    if (normalizedIndex !== -1) {
      // Map back to original positions
      const originalStart = positionMap[normalizedIndex];
      const originalEnd = positionMap[normalizedIndex + normalizedSearch.length - 1] + 1;
      return { start: originalStart, end: originalEnd };
    }
    
    // Last resort: try case-insensitive match
    const lowerSearch = normalizedSearch.toLowerCase();
    const lowerNormalizedSource = normalizedSource.toLowerCase();
    const lowerIndex = lowerNormalizedSource.indexOf(lowerSearch);
    if (lowerIndex !== -1) {
      const originalStart = positionMap[lowerIndex];
      const originalEnd = positionMap[lowerIndex + lowerSearch.length - 1] + 1;
      return { start: originalStart, end: originalEnd };
    }
    
    return null;
  };

  // Render document text with highlighted clauses
  const renderHighlightedText = (text: string, clauses: Clause[]) => {
    if (!text || clauses.length === 0) {
      return <span>{text}</span>;
    }

    // Find all clause positions in the text
    const highlights: Array<{ start: number; end: number; clause: Clause }> = [];
    
    clauses.forEach((clause) => {
      if (clause.clauseText) {
        // Clean up the clause text for matching (remove extra quotes)
        const cleanClauseText = clause.clauseText.replace(/^["']|["']$/g, '');
        const match = findTextWithNormalizedMatch(text, cleanClauseText);
        if (match) {
          highlights.push({
            start: match.start,
            end: match.end,
            clause,
          });
        } else {
          console.log('Clause text not found in document:', {
            clauseType: clause.clauseType,
            clauseTextPreview: cleanClauseText.substring(0, 100),
            documentTextPreview: text.substring(0, 100)
          });
        }
      }
    });

    // Sort highlights by start position
    highlights.sort((a, b) => a.start - b.start);

    // Build the highlighted text
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    highlights.forEach((highlight, i) => {
      // Add text before this highlight
      if (highlight.start > lastIndex) {
        parts.push(
          <span key={`text-${i}`}>{text.slice(lastIndex, highlight.start)}</span>
        );
      }

      // Add the highlighted clause with ID for scrolling
      const isActive = selectedClauseId === highlight.clause.id;
      parts.push(
        <span
          key={`highlight-${i}`}
          id={`clause-highlight-${highlight.clause.id}`}
          className={`${styles.highlightedClause} ${isActive ? styles.active : ''}`}
          onClick={() => handleClauseClick(highlight.clause.id)}
          title={`${highlight.clause.clauseType}${highlight.clause.sectionRef ? ` (§${highlight.clause.sectionRef})` : ''}`}
        >
          {text.slice(highlight.start, highlight.end)}
          <span className={styles.highlightBadge}>{getClauseIcon(highlight.clause.clauseType)}</span>
        </span>
      );

      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
    }

    return <>{parts}</>;
  };

  return (
    <>
      {/* Left Panel - Document List */}
      <LeftPanel>
        <PanelHeader
          searchPlaceholder="Search documents..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onDataChange={() => {
            loadData();
            setSelectedDocument(null);
          }}
        />
        
        <NavTabs activeTab={activeTab} onTabChange={onTabChange} />
        
        <div className={styles.filterBar}>
          <select
            className={styles.filterSelect}
            value={filterInvestorId}
            onChange={(e) => setFilterInvestorId(e.target.value)}
          >
            <option value="all">All Investors</option>
            {investors.map((inv) => (
              <option key={inv.id} value={inv.id}>{inv.name}</option>
            ))}
          </select>
        </div>
        
        <ListHeader title="All Documents" count={filteredDocuments.length} />
        
        <div className={styles.docList}>
          {loading ? (
            <div className={styles.loadingState}>Loading...</div>
          ) : filteredDocuments.length === 0 ? (
            <div className={styles.emptyState}>
              {searchQuery || filterInvestorId !== 'all' ? 'No documents found' : 'No documents yet'}
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`${styles.docItem} ${selectedDocument?.id === doc.id ? styles.active : ''}`}
                onClick={() => setSelectedDocument(doc)}
              >
                <div className={styles.docName}>{doc.title}</div>
                <div className={styles.docMeta}>
                  {getInvestorName(doc.investorId)} · {formatDate(doc.effectiveDate)}
                </div>
                <div className={styles.docTags}>
                  <span className={`${styles.docTag} ${styles[getDocTypeBadgeClass(doc.docType)]}`}>
                    {doc.docType}
                  </span>
                  <span className={styles.docTagCount}>
                    {doc.clauses?.length || 0} clauses
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <button className={styles.addBtn} onClick={openCreate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Document
        </button>
      </LeftPanel>

      {/* Center Panel - Document Detail */}
      <CenterPanel>
        {selectedDocument ? (
          <>
            <DetailHeader
              title={selectedDocument.title}
              subtitle={`${getInvestorName(selectedDocument.investorId)} · Effective ${formatDate(selectedDocument.effectiveDate)}`}
              badge={
                <span className={`${styles.typeBadge} ${styles[getDocTypeBadgeClass(selectedDocument.docType)]}`}>
                  {selectedDocument.docType}
                </span>
              }
              actions={
                <>
                  <button className="btn btn-secondary" onClick={openEdit}>Edit</button>
                  <button className="btn btn-secondary" onClick={() => setIsDeleteOpen(true)}>Delete</button>
                </>
              }
            />
            
            <TabsBar
              tabs={[
                { id: 'clauses', label: `Clauses (${selectedDocument.clauses?.length || 0})` },
                { id: 'details', label: 'Details' },
                { id: 'history', label: 'History' },
              ]}
              activeTab={detailTab}
              onTabChange={setDetailTab}
            />
            
            <div className={styles.detailContent}>
              {detailTab === 'clauses' && (
                <>
                  <div className={styles.infoRow}>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Investor</div>
                      <div className={styles.infoValue}>{getInvestorName(selectedDocument.investorId)}</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Fund</div>
                      <div className={styles.infoValue}>—</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Effective Date</div>
                      <div className={styles.infoValue}>{formatDate(selectedDocument.effectiveDate)}</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Priority</div>
                      <div className={styles.infoValue}>{getPriorityLabel(selectedDocument.priority)}</div>
                    </div>
                  </div>
                  
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Extracted Clauses</h3>
                    <div className={styles.sectionActions}>
                      <button className={styles.extractBtn} onClick={() => setIsExtractionOpen(true)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                        Extract with AI
                      </button>
                      <button className={styles.sectionAction} onClick={openClauseCreate}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add Clause
                      </button>
                    </div>
                  </div>
                  
                  {selectedDocument.clauses && selectedDocument.clauses.length > 0 ? (
                    <div className={styles.clauseList}>
                      {selectedDocument.clauses.map((clause) => (
                        <div 
                          key={clause.id} 
                          className={`${styles.clauseItem} ${selectedClause?.id === clause.id ? styles.selected : ''} ${selectedClauseId === clause.id ? styles.linked : ''}`}
                          onClick={() => {
                            setSelectedClause(clause);
                            handleClauseClick(clause.id);
                          }}
                        >
                          <div className={styles.clauseHeader}>
                            <span className={styles.clauseType}>
                              <span className={styles.clauseIcon}>
                                {getClauseIcon(clause.clauseType)}
                              </span>
                              {clause.clauseType}
                            </span>
                            <div className={styles.clauseActions}>
                              {clause.sectionRef && (
                                <span className={styles.clauseSource}>§{clause.sectionRef}</span>
                              )}
                              <button 
                                className={styles.clauseEditBtn}
                                onClick={(e) => { e.stopPropagation(); openClauseEdit(clause); }}
                                title="Edit clause"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                              </button>
                              <button 
                                className={styles.clauseDeleteBtn}
                                onClick={(e) => { e.stopPropagation(); openClauseDelete(clause); }}
                                title="Delete clause"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className={styles.clauseValueRow}>
                            {clause.rate !== null && (
                              <div className={styles.clauseValue}>{clause.rate}%</div>
                            )}
                            {clause.discount !== null && (
                              <div className={styles.clauseDiscount}>
                                {clause.clauseType === 'Fee Step-Down' ? `−${clause.discount}%` : `${clause.discount}% discount`}
                              </div>
                            )}
                            {clause.threshold && (
                              <div className={styles.clauseThreshold}>{clause.threshold}</div>
                            )}
                          </div>
                          {clause.clauseText && (
                            <div className={styles.clauseText}>"{clause.clauseText}"</div>
                          )}
                          {clause.notes && (
                            <div className={styles.clauseNotes}>{clause.notes}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.placeholderState}>
                      <p>No clauses extracted yet.</p>
                      <button className="btn btn-primary" onClick={openClauseCreate}>
                        Add First Clause
                      </button>
                    </div>
                  )}
                </>
              )}
              
              {detailTab === 'details' && (
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <div className={styles.infoLabel}>Document Title</div>
                    <div className={styles.infoValue}>{selectedDocument.title}</div>
                  </div>
                  <div className={styles.detailItem}>
                    <div className={styles.infoLabel}>Document Type</div>
                    <div className={styles.infoValue}>{selectedDocument.docType}</div>
                  </div>
                  <div className={styles.detailItem}>
                    <div className={styles.infoLabel}>Status</div>
                    <div className={styles.infoValue}>{selectedDocument.status}</div>
                  </div>
                  <div className={styles.detailItem}>
                    <div className={styles.infoLabel}>Priority</div>
                    <div className={styles.infoValue}>{getPriorityLabel(selectedDocument.priority)}</div>
                  </div>
                  <div className={styles.detailItem}>
                    <div className={styles.infoLabel}>Created</div>
                    <div className={styles.infoValue}>{formatDate(selectedDocument.createdAt)}</div>
                  </div>
                  <div className={styles.detailItem}>
                    <div className={styles.infoLabel}>Last Updated</div>
                    <div className={styles.infoValue}>{formatDate(selectedDocument.updatedAt)}</div>
                  </div>
                  {selectedDocument.fileName && (
                    <div className={`${styles.detailItem} ${styles.full}`}>
                      <div className={styles.infoLabel}>File</div>
                      <div className={styles.infoValue}>{selectedDocument.fileName}</div>
                    </div>
                  )}
                </div>
              )}
              
              {detailTab === 'history' && (
                <div className={styles.placeholderState}>
                  <p>Audit history will show all changes to this document.</p>
                  <span>Coming in Phase 11</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={styles.noSelection}>
            <p>Select a document to view details</p>
            <button className="btn btn-primary" onClick={openCreate}>
              Add Your First Document
            </button>
          </div>
        )}
      </CenterPanel>

      {/* Right Panel - Document Text Viewer */}
      <RightPanel isOpen={!!selectedDocument}>
        {selectedDocument ? (
          <>
            <div className={styles.docHeader}>
              <div>
                <div className={styles.docTitle}>Document Preview</div>
                <div className={styles.docMeta}>{selectedDocument.title}</div>
              </div>
            </div>
            <div className={styles.previewContent}>
              {/* Document Text with Highlights */}
              {selectedDocument.sourceText ? (
                <div className={styles.documentTextViewer}>
                  <div className={styles.documentText}>
                    {renderHighlightedText(selectedDocument.sourceText, selectedDocument.clauses || [])}
                  </div>
                </div>
              ) : (
                /* No source text - prompt to extract */
                <div className={styles.noSourceText}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <line x1="10" y1="9" x2="8" y2="9"/>
                  </svg>
                  <p>No document text</p>
                  <span>Use "Extract with AI" in the clauses section to add document text</span>
                </div>
              )}

              {/* File Preview (if file exists) */}
              {selectedDocument.fileName && (
                <div className={styles.previewSection}>
                  <h4 className={styles.previewSectionTitle}>Attached File</h4>
                  <div className={styles.filePreview}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span>{selectedDocument.fileName}</span>
                    <button className={styles.downloadBtn}>Download</button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className={styles.docHeader}>
              <div>
                <div className={styles.docTitle}>Document Preview</div>
                <div className={styles.docMeta}>Select a document to preview</div>
              </div>
            </div>
            <div className={styles.docPreview}>
              <div className={styles.docPlaceholder}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p>No document selected</p>
                <span>Select a document from the list</span>
              </div>
            </div>
          </>
        )}
      </RightPanel>

      {/* Modals */}
      <DocumentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDocument(null);
        }}
        onSubmit={editingDocument ? handleUpdateDocument : handleCreateDocument}
        document={editingDocument}
        investors={investors}
        documents={documents}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteDocument}
        title="Delete Document"
        message={`Are you sure you want to delete "${selectedDocument?.title}"? This will also delete all associated clauses.`}
        confirmText="Delete"
        loading={deleteLoading}
      />

      {/* Clause Modals */}
      <ClauseForm
        isOpen={isClauseFormOpen}
        onClose={() => {
          setIsClauseFormOpen(false);
          setEditingClause(null);
        }}
        onSubmit={editingClause ? handleUpdateClause : handleCreateClause}
        clause={editingClause}
      />

      <ConfirmDialog
        isOpen={isClauseDeleteOpen}
        onClose={() => {
          setIsClauseDeleteOpen(false);
          setSelectedClause(null);
        }}
        onConfirm={handleDeleteClause}
        title="Delete Clause"
        message={`Are you sure you want to delete this ${selectedClause?.clauseType} clause? This action cannot be undone.`}
        confirmText="Delete"
        loading={clauseDeleteLoading}
      />

      {/* AI Extraction Modal */}
      <ExtractionModal
        isOpen={isExtractionOpen}
        onClose={() => {
          setIsExtractionOpen(false);
          setAutoExtractOnOpen(false);
        }}
        document={selectedDocument}
        onApply={handleApplyExtraction}
        autoExtract={autoExtractOnOpen}
      />
    </>
  );
}
