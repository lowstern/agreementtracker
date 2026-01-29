import { useState, FormEvent, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import type { Document, Investor } from '../types';
import styles from './DocumentForm.module.css';

interface DocumentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Document> & { sourceText?: string; autoExtract?: boolean }) => Promise<void>;
  document?: Document | null;
  investors: Investor[];
  documents: Document[];
}

const DOCUMENT_TYPES = ['Side Letter', 'Subscription Agreement', 'Amendment', 'Fee Schedule', 'PPM', 'Other'];
const STATUSES = ['Active', 'Draft', 'Superseded'];

export function DocumentForm({ isOpen, onClose, onSubmit, document, investors, documents }: DocumentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [autoExtract, setAutoExtract] = useState(true);
  const [extractingText, setExtractingText] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    investorId: '',
    docType: 'Side Letter',
    status: 'Active',
    effectiveDate: '',
    supersedesId: '',
  });

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title || '',
        investorId: document.investorId?.toString() || '',
        docType: document.docType || 'Side Letter',
        status: document.status || 'Active',
        effectiveDate: document.effectiveDate || '',
        supersedesId: document.supersedesId?.toString() || '',
      });
    } else {
      setFormData({
        title: '',
        investorId: '',
        docType: 'Side Letter',
        status: 'Active',
        effectiveDate: '',
        supersedesId: '',
      });
    }
    setSelectedFile(null);
    setExtractedText('');
    setAutoExtract(true);
    setError('');
  }, [document, isOpen]);

  // Read text from file
  const extractTextFromFile = async (file: File): Promise<string> => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'txt') {
      return await file.text();
    }
    
    // For PDF/DOCX, we'd need server-side processing
    // For now, return empty and show a message
    return '';
  };

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setExtractingText(true);
    
    if (!formData.title) {
      // Auto-fill title from filename
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setFormData(prev => ({ ...prev, title: nameWithoutExt }));
    }
    
    try {
      const text = await extractTextFromFile(file);
      setExtractedText(text);
    } catch (err) {
      console.error('Failed to extract text:', err);
    } finally {
      setExtractingText(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.investorId) {
      setError('Please select an investor');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        title: formData.title.trim() || 'Untitled Document',
        investorId: parseInt(formData.investorId),
        docType: formData.docType,
        status: formData.status,
        effectiveDate: formData.effectiveDate || null,
        supersedesId: formData.supersedesId ? parseInt(formData.supersedesId) : null,
        fileName: selectedFile?.name || document?.fileName || null,
        sourceText: extractedText || undefined,
        autoExtract: autoExtract && extractedText.length > 50,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save document');
    } finally {
      setLoading(false);
    }
  };

  // Get documents for the selected investor (for supersedes dropdown)
  const investorDocuments = documents.filter(
    d => d.investorId === parseInt(formData.investorId) && d.id !== document?.id
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document ? 'Edit Document' : 'Add Document'}
      size="md"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* File Upload Section */}
        {!document && (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Upload File</h2>
            
            <div 
              className={`${styles.fileUpload} ${selectedFile ? styles.hasFile : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              {selectedFile ? (
                <>
                  <div className={styles.fileIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div className={styles.fileName}>{selectedFile.name}</div>
                  <div className={styles.fileSize}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    {extractingText && ' · Reading...'}
                    {!extractingText && extractedText && ` · ${extractedText.length.toLocaleString()} chars`}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.uploadIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                  </div>
                  <div className={styles.uploadText}>Drop a file here or click to upload</div>
                  <div className={styles.uploadHint}>TXT, PDF, DOC, DOCX up to 50MB</div>
                </>
              )}
            </div>

            {/* Auto-extract option */}
            {selectedFile && extractedText && (
              <label className={styles.autoExtractOption}>
                <input
                  type="checkbox"
                  checked={autoExtract}
                  onChange={(e) => setAutoExtract(e.target.checked)}
                />
                <span className={styles.checkboxLabel}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Automatically extract clauses with AI
                </span>
              </label>
            )}

            {selectedFile && !extractedText && !extractingText && (
              <div className={styles.noTextWarning}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>PDF/DOCX text extraction coming soon. For now, use .txt files for auto-extraction.</span>
              </div>
            )}
          </div>
        )}

        {/* Document Details Section */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Document Details</h2>
          
          <div className={`${styles.row} ${styles.full}`}>
            <div className={styles.field}>
              <label className="label" htmlFor="title">Document Title *</label>
              <input
                id="title"
                type="text"
                className="input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Mock Capital Side Letter"
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className="label" htmlFor="investorId">Investor *</label>
              <select
                id="investorId"
                className="select"
                value={formData.investorId}
                onChange={(e) => setFormData({ ...formData, investorId: e.target.value, supersedesId: '' })}
                required
              >
                <option value="">Select investor...</option>
                {investors.map((inv) => (
                  <option key={inv.id} value={inv.id}>{inv.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className="label" htmlFor="docType">Document Type *</label>
              <select
                id="docType"
                className="select"
                value={formData.docType}
                onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
              >
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className="label" htmlFor="effectiveDate">Effective Date</label>
              <input
                id="effectiveDate"
                type="date"
                className="input"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className="label" htmlFor="status">Status</label>
              <select
                id="status"
                className="select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={`${styles.row} ${styles.full}`}>
            <div className={styles.field}>
              <label className="label" htmlFor="supersedesId">Supersedes</label>
              <select
                id="supersedesId"
                className="select"
                value={formData.supersedesId}
                onChange={(e) => setFormData({ ...formData, supersedesId: e.target.value })}
                disabled={!formData.investorId}
              >
                <option value="">None (new agreement)</option>
                {investorDocuments.map((doc) => (
                  <option key={doc.id} value={doc.id}>{doc.title}</option>
                ))}
              </select>
              <p className={styles.hint}>Select if this document replaces an older one</p>
            </div>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : document ? 'Save Changes' : 'Save Document'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
