import { useState, FormEvent, useEffect } from 'react';
import { Modal } from './Modal';
import type { Investor } from '../types';
import styles from './InvestorForm.module.css';

interface InvestorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Investor>) => Promise<void>;
  investor?: Investor | null;
}

const INVESTOR_TYPES = ['LP', 'Family Office', 'Institutional', 'GP', 'Endowment', 'Sovereign Wealth', 'Other'];

export function InvestorForm({ isOpen, onClose, onSubmit, investor }: InvestorFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    investorType: 'LP',
    commitmentAmount: '',
    currency: 'USD',
    fund: '',
    relationshipNotes: '',
    internalNotes: '',
  });

  useEffect(() => {
    if (investor) {
      setFormData({
        name: investor.name || '',
        investorType: investor.investorType || 'LP',
        commitmentAmount: investor.commitmentAmount?.toString() || '',
        currency: investor.currency || 'USD',
        fund: investor.fund || '',
        relationshipNotes: investor.relationshipNotes || '',
        internalNotes: investor.internalNotes || '',
      });
    } else {
      setFormData({
        name: '',
        investorType: 'LP',
        commitmentAmount: '',
        currency: 'USD',
        fund: '',
        relationshipNotes: '',
        internalNotes: '',
      });
    }
    setError('');
  }, [investor, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({
        name: formData.name.trim(),
        investorType: formData.investorType,
        commitmentAmount: formData.commitmentAmount ? parseFloat(formData.commitmentAmount) : null,
        currency: formData.currency,
        fund: formData.fund.trim(),
        relationshipNotes: formData.relationshipNotes.trim(),
        internalNotes: formData.internalNotes.trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save investor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={investor ? 'Edit Investor' : 'Add Investor'}
      size="md"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Basic Information</h2>
          
          <div className={`${styles.row} ${styles.full}`}>
            <div className={styles.field}>
              <label className="label" htmlFor="name">Investor Name *</label>
              <input
                id="name"
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Mock Capital LP"
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className="label" htmlFor="investorType">Investor Type *</label>
              <select
                id="investorType"
                className="select"
                value={formData.investorType}
                onChange={(e) => setFormData({ ...formData, investorType: e.target.value })}
              >
                {INVESTOR_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className="label" htmlFor="fund">Fund *</label>
              <input
                id="fund"
                type="text"
                className="input"
                value={formData.fund}
                onChange={(e) => setFormData({ ...formData, fund: e.target.value })}
                placeholder="e.g., Mock Fund I"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Commitment Details</h2>
          
          <div className={styles.row}>
            <div className={styles.field}>
              <label className="label" htmlFor="commitmentAmount">Commitment Amount *</label>
              <div className={styles.inputWithPrefix}>
                <span className={styles.inputPrefix}>$</span>
                <input
                  id="commitmentAmount"
                  type="text"
                  className="input"
                  value={formData.commitmentAmount}
                  onChange={(e) => setFormData({ ...formData, commitmentAmount: e.target.value.replace(/[^0-9]/g, '') })}
                  placeholder="250,000,000"
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className="label" htmlFor="currency">Currency</label>
              <select
                id="currency"
                className="select"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Notes</h2>
          
          <div className={`${styles.row} ${styles.full}`}>
            <div className={styles.field}>
              <label className="label" htmlFor="relationshipNotes">Relationship Notes</label>
              <textarea
                id="relationshipNotes"
                className="textarea"
                value={formData.relationshipNotes}
                onChange={(e) => setFormData({ ...formData, relationshipNotes: e.target.value })}
                placeholder="Side letter details, special terms, key relationships..."
              />
              <p className={styles.hint}>Visible to all team members. Include relationship context and special arrangements.</p>
            </div>
          </div>

          <div className={`${styles.row} ${styles.full}`}>
            <div className={styles.field}>
              <label className="label" htmlFor="internalNotes">Internal Notes</label>
              <textarea
                id="internalNotes"
                className="textarea"
                value={formData.internalNotes}
                onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                placeholder="Internal team notes, contact info, reminders..."
              />
              <p className={styles.hint}>For internal use only. Contact information, follow-up tasks, etc.</p>
            </div>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : investor ? 'Save Changes' : 'Save Investor'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
