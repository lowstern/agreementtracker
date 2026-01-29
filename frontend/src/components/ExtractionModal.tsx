import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Modal } from './Modal';
import type { ExtractedClause, ExtractionResult, Document } from '../types';
import styles from './ExtractionModal.module.css';

interface ExtractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onApply: (clauses: ExtractedClause[], sourceText: string) => void;
  autoExtract?: boolean; // If true, start extraction immediately
}

const SAMPLE_TEXT = `SIDE LETTER

This Side Letter Agreement ("Agreement") is entered into as of February 1, 2024.

PARTIES:
- Mock Capital LP ("Limited Partner")
- Mock Fund I GP, LLC ("General Partner")

SECTION 3. MANAGEMENT FEE REDUCTION

3.1 Notwithstanding Section 6.1 of the Partnership Agreement, the Management Fee payable by the Limited Partner shall be reduced from 2.00% to 1.75% per annum of the Capital Commitment.

3.2 Fee Step-Down. Beginning on the fourth anniversary of the final closing, the Management Fee shall be further reduced by 0.25% per annum.

SECTION 4. CO-INVESTMENT RIGHTS

4.1 The Limited Partner shall have the right to participate in co-investment opportunities alongside the Fund on a no-fee, no-carry basis.

SECTION 5. MOST FAVORED NATION

5.1 If the Partnership enters into a side letter with any other Limited Partner granting more favorable economic terms, the Partnership shall promptly notify the Limited Partner and offer equivalent terms.
`;

function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return styles.high;
  if (confidence >= 0.6) return styles.medium;
  return styles.low;
}

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return 'High';
  if (confidence >= 0.6) return 'Medium';
  return 'Low';
}

export function ExtractionModal({ isOpen, onClose, document, onApply, autoExtract = false }: ExtractionModalProps) {
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [selectedClauses, setSelectedClauses] = useState<Set<number>>(new Set());
  const [hasAutoExtracted, setHasAutoExtracted] = useState(false);

  // Pre-populate text from document's sourceText when modal opens
  useEffect(() => {
    if (isOpen && document?.sourceText) {
      setText(document.sourceText);
    }
  }, [isOpen, document]);

  // Auto-extract when modal opens with autoExtract flag
  useEffect(() => {
    if (isOpen && autoExtract && document?.sourceText && !hasAutoExtracted && !loading) {
      setHasAutoExtracted(true);
      // Delay slightly to ensure modal is visible
      setTimeout(() => {
        handleExtractInternal(document.sourceText || '');
      }, 100);
    }
  }, [isOpen, autoExtract, document?.sourceText, hasAutoExtracted, loading]);

  // Reset hasAutoExtracted when modal closes
  useEffect(() => {
    if (!isOpen) {
      setHasAutoExtracted(false);
    }
  }, [isOpen]);

  const handleExtractInternal = async (textToExtract: string) => {
    if (textToExtract.trim().length < 50) {
      setError('Please enter at least 50 characters of document text.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const extractionResult = await api.extractClauses(textToExtract);
      
      if (extractionResult.error && !extractionResult.clauses?.length) {
        setError(extractionResult.error);
        return;
      }

      setResult(extractionResult);
      // Select all clauses by default
      setSelectedClauses(new Set(extractionResult.clauses.map((_, i) => i)));
      setStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = () => {
    handleExtractInternal(text);
  };

  const handleApply = () => {
    if (!result) return;

    const clausesToApply = result.clauses
      .filter((_, i) => selectedClauses.has(i))
      .map(c => ({ ...c, approved: true }));

    onApply(clausesToApply, text);
    handleClose();
  };

  const handleClose = () => {
    setStep('input');
    setText('');
    setResult(null);
    setError(null);
    setSelectedClauses(new Set());
    onClose();
  };

  const toggleClause = (index: number) => {
    const newSelected = new Set(selectedClauses);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedClauses(newSelected);
  };

  const loadSample = () => {
    setText(SAMPLE_TEXT);
  };

  const hasExistingText = document?.sourceText && document.sourceText.length > 50;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="AI Clause Extraction" size="lg">
      {step === 'input' ? (
        <div className={styles.inputStep}>
          <div className={styles.instructions}>
            {hasExistingText ? (
              <>
                <p>Document text is loaded and ready for extraction.</p>
                <p className={styles.hint}>
                  Click "Extract Clauses" to analyze the document with AI.
                </p>
              </>
            ) : (
              <>
                <p>Paste document text below to automatically extract clauses using AI.</p>
                <p className={styles.hint}>
                  The AI will identify management fees, discounts, MFN clauses, co-investment rights, and more.
                </p>
              </>
            )}
          </div>

          {hasExistingText && (
            <div className={styles.textLoaded}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <div>
                <div className={styles.textLoadedTitle}>Document text loaded</div>
                <div className={styles.textLoadedMeta}>
                  {text.length.toLocaleString()} characters from "{document?.title}"
                </div>
              </div>
            </div>
          )}

          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your document text here..."
              rows={hasExistingText ? 8 : 15}
            />
            <div className={styles.charCount}>
              {text.length.toLocaleString()} characters
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <div className={styles.actions}>
            {!hasExistingText && (
              <button className={styles.sampleBtn} onClick={loadSample}>
                Load Sample
              </button>
            )}
            <div className={styles.rightActions}>
              <button className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleExtract}
                disabled={loading || text.trim().length < 50}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} />
                    Extracting...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    Extract Clauses
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.reviewStep}>
          {result?.ai_error && (
            <div className={styles.warning}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              AI unavailable: {result.ai_error}. Using pattern matching instead.
            </div>
          )}

          {result?.document_info && (
            <div className={styles.docInfo}>
              <div className={styles.docInfoItem}>
                <span className={styles.docInfoLabel}>Detected Type</span>
                <span className={styles.docInfoValue}>
                  {result.document_info.detected_type || 'Unknown'}
                </span>
              </div>
              {result.document_info.detected_investor && (
                <div className={styles.docInfoItem}>
                  <span className={styles.docInfoLabel}>Investor</span>
                  <span className={styles.docInfoValue}>
                    {result.document_info.detected_investor}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className={styles.clauseList}>
            <div className={styles.clauseListHeader}>
              <span>Extracted Clauses ({result?.clauses.length || 0})</span>
              <span className={styles.selectedCount}>
                {selectedClauses.size} selected
              </span>
            </div>

            {result?.clauses.length === 0 ? (
              <div className={styles.noResults}>
                <p>No clauses were extracted from the document.</p>
                <p className={styles.hint}>Try providing more detailed document text.</p>
              </div>
            ) : (
              result?.clauses.map((clause, index) => (
                <div 
                  key={index}
                  className={`${styles.clauseItem} ${selectedClauses.has(index) ? styles.selected : ''}`}
                  onClick={() => toggleClause(index)}
                >
                  <div className={styles.clauseHeader}>
                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={selectedClauses.has(index)}
                        onChange={() => toggleClause(index)}
                      />
                      <span className={styles.checkmark} />
                    </label>
                    <span className={styles.clauseType}>{clause.clause_type}</span>
                    <span className={`${styles.confidence} ${getConfidenceColor(clause.confidence)}`}>
                      {getConfidenceLabel(clause.confidence)} ({Math.round(clause.confidence * 100)}%)
                    </span>
                  </div>
                  
                  <div className={styles.clauseDetails}>
                    {clause.rate !== null && (
                      <span className={styles.clauseValue}>Rate: {clause.rate}%</span>
                    )}
                    {clause.discount !== null && (
                      <span className={styles.clauseValue}>Discount: {clause.discount}%</span>
                    )}
                    {clause.threshold && (
                      <span className={styles.clauseValue}>Condition: {clause.threshold}</span>
                    )}
                    {clause.section_ref && (
                      <span className={styles.clauseValue}>Section: §{clause.section_ref}</span>
                    )}
                  </div>
                  
                  {clause.clause_text && (
                    <div className={styles.clauseText}>
                      "{clause.clause_text}"
                    </div>
                  )}
                  
                  {clause.notes && (
                    <div className={styles.clauseNotes}>{clause.notes}</div>
                  )}
                </div>
              ))
            )}
          </div>

          {result?.extraction_notes && (
            <div className={styles.extractionNotes}>
              {result.extraction_notes}
            </div>
          )}

          <div className={styles.actions}>
            <button className="btn btn-secondary" onClick={() => setStep('input')}>
              ← Back
            </button>
            <div className={styles.rightActions}>
              <button className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleApply}
                disabled={selectedClauses.size === 0}
              >
                Apply {selectedClauses.size} Clause{selectedClauses.size !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
