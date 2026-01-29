import { Modal } from './Modal';
import type { Investor } from '../types';
import styles from './InvestorDetail.module.css';

interface InvestorDetailProps {
  isOpen: boolean;
  onClose: () => void;
  investor: Investor | null;
  onEdit: () => void;
  onDelete: () => void;
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(type: string): string {
  const colors: Record<string, string> = {
    LP: 'blue',
    'Family Office': 'purple',
    Institutional: 'green',
    Endowment: 'orange',
    'Sovereign Wealth': 'blue',
  };
  return colors[type] || 'blue';
}

export function InvestorDetail({ isOpen, onClose, investor, onEdit, onDelete }: InvestorDetailProps) {
  if (!investor) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Investor Profile" size="lg">
      <div className={styles.profile}>
        <div className={styles.header}>
          <div className={`${styles.avatar} ${styles[getAvatarColor(investor.investorType)]}`}>
            {getInitials(investor.name)}
          </div>
          <div className={styles.headerInfo}>
            <h3 className={styles.name}>{investor.name}</h3>
            <div className={styles.meta}>
              <span className={`${styles.tag} ${styles[getAvatarColor(investor.investorType)]}`}>
                {investor.investorType}
              </span>
              {investor.fund && <span className={styles.fund}>{investor.fund}</span>}
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className="btn btn-secondary" onClick={onEdit}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
            <button className="btn btn-danger" onClick={onDelete}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              Delete
            </button>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Commitment</span>
            <span className={styles.statValue}>
              {formatCurrency(investor.commitmentAmount, investor.currency)}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Currency</span>
            <span className={styles.statValue}>{investor.currency}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Added</span>
            <span className={styles.statValue}>{formatDate(investor.createdAt)}</span>
          </div>
        </div>

        {investor.relationshipNotes && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Relationship Notes</h4>
            <p className={styles.sectionContent}>{investor.relationshipNotes}</p>
          </div>
        )}

        {investor.internalNotes && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Internal Notes</h4>
            <p className={styles.sectionContent}>{investor.internalNotes}</p>
          </div>
        )}

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Agreements</h4>
          <div className={styles.placeholder}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p>No agreements linked yet</p>
            <span className={styles.hint}>Documents will appear here once uploaded in Phase 3</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
