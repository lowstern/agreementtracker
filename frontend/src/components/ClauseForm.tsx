import { useState, FormEvent, useEffect } from 'react';
import { Modal } from './Modal';
import type { Clause } from '../types';
import styles from './ClauseForm.module.css';

interface ClauseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Clause>) => Promise<void>;
  clause?: Clause | null;
}

const CLAUSE_TYPES = [
  'Management Fee',
  'Carry Terms',
  'MFN (Most Favored Nation)',
  'Fee Waiver/Discount',
  'Co-investment Rights',
  'Fee Step-Down',
  'Preferred Return',
  'Other',
];

// Define which fields are relevant for each clause type
const CLAUSE_TYPE_FIELDS: Record<string, string[]> = {
  'Management Fee': ['rate', 'threshold', 'thresholdAmount', 'effectiveDate'],
  'Carry Terms': ['rate', 'threshold', 'effectiveDate'],
  'MFN (Most Favored Nation)': ['effectiveDate'],
  'Fee Waiver/Discount': ['rate', 'discount', 'threshold', 'effectiveDate'],
  'Co-investment Rights': ['threshold', 'effectiveDate'],
  'Fee Step-Down': ['rate', 'discount', 'threshold', 'effectiveDate'],
  'Preferred Return': ['rate', 'effectiveDate'],
  'Other': ['rate', 'threshold', 'thresholdAmount', 'discount', 'effectiveDate'],
};

export function ClauseForm({ isOpen, onClose, onSubmit, clause }: ClauseFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    clauseType: 'Management Fee',
    clauseText: '',
    rate: '',
    threshold: '',
    thresholdAmount: '',
    discount: '',
    effectiveDate: '',
    notes: '',
    sectionRef: '',
    pageNumber: '',
  });

  useEffect(() => {
    if (clause) {
      setFormData({
        clauseType: clause.clauseType || 'Management Fee',
        clauseText: clause.clauseText || '',
        rate: clause.rate?.toString() || '',
        threshold: clause.threshold || '',
        thresholdAmount: clause.thresholdAmount?.toString() || '',
        discount: clause.discount?.toString() || '',
        effectiveDate: clause.effectiveDate || '',
        notes: clause.notes || '',
        sectionRef: clause.sectionRef || '',
        pageNumber: clause.pageNumber?.toString() || '',
      });
    } else {
      setFormData({
        clauseType: 'Management Fee',
        clauseText: '',
        rate: '',
        threshold: '',
        thresholdAmount: '',
        discount: '',
        effectiveDate: '',
        notes: '',
        sectionRef: '',
        pageNumber: '',
      });
    }
    setError('');
  }, [clause, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({
        clauseType: formData.clauseType,
        clauseText: formData.clauseText || undefined,
        rate: formData.rate ? parseFloat(formData.rate) : undefined,
        threshold: formData.threshold || undefined,
        thresholdAmount: formData.thresholdAmount ? parseFloat(formData.thresholdAmount) : undefined,
        discount: formData.discount ? parseFloat(formData.discount) : undefined,
        effectiveDate: formData.effectiveDate || undefined,
        notes: formData.notes || undefined,
        sectionRef: formData.sectionRef || undefined,
        pageNumber: formData.pageNumber ? parseInt(formData.pageNumber) : undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save clause');
    } finally {
      setLoading(false);
    }
  };

  // Get visible fields for current clause type
  const visibleFields = CLAUSE_TYPE_FIELDS[formData.clauseType] || CLAUSE_TYPE_FIELDS['Other'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clause ? 'Edit Clause' : 'Add Clause'}
      size="md"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Clause Type Section */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Clause Type</h2>
          
          <div className={styles.typeGrid}>
            {CLAUSE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`${styles.typeBtn} ${formData.clauseType === type ? styles.active : ''}`}
                onClick={() => setFormData({ ...formData, clauseType: type })}
              >
                <span className={styles.typeIcon}>{getClauseIcon(type)}</span>
                <span className={styles.typeLabel}>{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Structured Data Section */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Clause Details</h2>
          
          <div className={styles.fieldsGrid}>
            {visibleFields.includes('rate') && (
              <div className={styles.field}>
                <label className="label" htmlFor="rate">
                  {formData.clauseType === 'Fee Waiver/Discount' ? 'Original Rate (%)' : 'Rate (%)'}
                </label>
                <div className={styles.inputWithSuffix}>
                  <input
                    id="rate"
                    type="number"
                    step="0.01"
                    className="input"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    placeholder="e.g., 1.75"
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>
            )}

            {visibleFields.includes('discount') && (
              <div className={styles.field}>
                <label className="label" htmlFor="discount">
                  {formData.clauseType === 'Fee Step-Down' ? 'Step-Down Rate (%)' : 'Discount (%)'}
                </label>
                <div className={styles.inputWithSuffix}>
                  <input
                    id="discount"
                    type="number"
                    step="0.01"
                    className="input"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="e.g., 0.25"
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>
            )}

            {visibleFields.includes('threshold') && (
              <div className={styles.field}>
                <label className="label" htmlFor="threshold">Condition/Threshold</label>
                <input
                  id="threshold"
                  type="text"
                  className="input"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                  placeholder="e.g., Year 4, Commitment ≥ $25M"
                />
              </div>
            )}

            {visibleFields.includes('thresholdAmount') && (
              <div className={styles.field}>
                <label className="label" htmlFor="thresholdAmount">Threshold Amount ($)</label>
                <div className={styles.inputWithPrefix}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="thresholdAmount"
                    type="number"
                    step="0.01"
                    className="input"
                    value={formData.thresholdAmount}
                    onChange={(e) => setFormData({ ...formData, thresholdAmount: e.target.value })}
                    placeholder="e.g., 25000000"
                  />
                </div>
              </div>
            )}

            {visibleFields.includes('effectiveDate') && (
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
            )}
          </div>
        </div>

        {/* Source Reference Section */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Source Reference</h2>
          
          <div className={styles.row}>
            <div className={styles.field}>
              <label className="label" htmlFor="sectionRef">Section Reference</label>
              <input
                id="sectionRef"
                type="text"
                className="input"
                value={formData.sectionRef}
                onChange={(e) => setFormData({ ...formData, sectionRef: e.target.value })}
                placeholder="e.g., 3.2, Article IV"
              />
            </div>
            <div className={styles.field}>
              <label className="label" htmlFor="pageNumber">Page Number</label>
              <input
                id="pageNumber"
                type="number"
                className="input"
                value={formData.pageNumber}
                onChange={(e) => setFormData({ ...formData, pageNumber: e.target.value })}
                placeholder="e.g., 5"
              />
            </div>
          </div>
        </div>

        {/* Clause Text Section */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Original Clause Text</h2>
          
          <div className={styles.field}>
            <label className="label" htmlFor="clauseText">
              Full Text <span className={styles.hint}>(copy from document)</span>
            </label>
            <textarea
              id="clauseText"
              className={styles.textarea}
              value={formData.clauseText}
              onChange={(e) => setFormData({ ...formData, clauseText: e.target.value })}
              placeholder="Paste the exact clause text from the document..."
              rows={4}
            />
          </div>

          <div className={styles.field}>
            <label className="label" htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              className={styles.textarea}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes or context..."
              rows={2}
            />
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : clause ? 'Save Changes' : 'Add Clause'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function getClauseIcon(type: string): string {
  const icons: Record<string, string> = {
    'Management Fee': '%',
    'Carry Terms': '↗',
    'MFN (Most Favored Nation)': '★',
    'Fee Waiver/Discount': '↓',
    'Co-investment Rights': '⊕',
    'Fee Step-Down': '↘',
    'Preferred Return': '⟳',
    'Other': '•',
  };
  return icons[type] || '•';
}
