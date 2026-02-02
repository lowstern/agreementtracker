import { useState } from 'react';
import { 
  LeftPanel, 
  PanelHeader, 
  NavTabs, 
  ListHeader,
  CenterPanel,
} from '../components/Layout';
import type { TabId, TabChangeHandler } from '../types';
import styles from './AuditLog.module.css';

interface AuditLogProps {
  activeTab: TabId;
  onTabChange: TabChangeHandler;
}

// Mock audit log entries for demo
const mockAuditEntries = [
  {
    id: 1,
    action: 'Document Created',
    entityType: 'Document',
    entityName: 'Blackstone Side Letter - Fund IX',
    user: 'Sarah Chen',
    timestamp: '2026-01-28T14:32:00Z',
    details: 'New side letter uploaded and clauses extracted',
    changes: null,
  },
  {
    id: 2,
    action: 'Clause Modified',
    entityType: 'Clause',
    entityName: 'Management Fee - 1.25%',
    user: 'Michael Torres',
    timestamp: '2026-01-28T11:15:00Z',
    details: 'Updated fee rate from 1.50% to 1.25%',
    changes: { field: 'rate', oldValue: '1.50%', newValue: '1.25%' },
  },
  {
    id: 3,
    action: 'Investor Added',
    entityType: 'Investor',
    entityName: 'Meridian Capital Partners',
    user: 'Sarah Chen',
    timestamp: '2026-01-27T16:45:00Z',
    details: 'New investor profile created',
    changes: null,
  },
  {
    id: 4,
    action: 'Document Deleted',
    entityType: 'Document',
    entityName: 'Draft Agreement v1',
    user: 'Admin',
    timestamp: '2026-01-27T09:20:00Z',
    details: 'Removed outdated draft document',
    changes: null,
  },
  {
    id: 5,
    action: 'AI Extraction',
    entityType: 'Document',
    entityName: 'Atlas Fund Subscription Agreement',
    user: 'System',
    timestamp: '2026-01-26T13:00:00Z',
    details: 'Automated clause extraction completed - 8 clauses identified',
    changes: null,
  },
  {
    id: 6,
    action: 'Clause Created',
    entityType: 'Clause',
    entityName: 'MFN Protection',
    user: 'Jessica Park',
    timestamp: '2026-01-26T10:30:00Z',
    details: 'Manual clause entry for MFN terms',
    changes: null,
  },
  {
    id: 7,
    action: 'Investor Updated',
    entityType: 'Investor',
    entityName: 'Wellington Management',
    user: 'Michael Torres',
    timestamp: '2026-01-25T15:45:00Z',
    details: 'Updated commitment amount',
    changes: { field: 'commitmentAmount', oldValue: '$50M', newValue: '$75M' },
  },
];

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return 'Just now';
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}

function getActionIcon(action: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    'Document Created': (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="18" x2="12" y2="12"/>
        <line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    ),
    'Document Deleted': (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
      </svg>
    ),
    'Clause Modified': (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    'Clause Created': (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
    'Investor Added': (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="8.5" cy="7" r="4"/>
        <line x1="20" y1="8" x2="20" y2="14"/>
        <line x1="23" y1="11" x2="17" y2="11"/>
      </svg>
    ),
    'Investor Updated': (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="8.5" cy="7" r="4"/>
        <polyline points="17 11 19 13 23 9"/>
      </svg>
    ),
    'AI Extraction': (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  };
  return iconMap[action] || (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  );
}

function getActionColor(action: string): string {
  if (action.includes('Created') || action.includes('Added')) return 'green';
  if (action.includes('Modified') || action.includes('Updated')) return 'blue';
  if (action.includes('Deleted')) return 'red';
  if (action.includes('AI')) return 'purple';
  return 'default';
}

export function AuditLog({ activeTab, onTabChange }: AuditLogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<typeof mockAuditEntries[0] | null>(null);

  const filteredEntries = mockAuditEntries.filter((entry) => {
    const matchesSearch = 
      searchQuery === '' ||
      entry.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterType === 'all' || 
      entry.entityType.toLowerCase() === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Left Panel - Audit Entries */}
      <LeftPanel>
        <PanelHeader
          searchPlaceholder="Search audit log..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <NavTabs activeTab={activeTab} onTabChange={onTabChange} />
        
        <div className={styles.filterBar}>
          <select
            className={styles.filterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Activity</option>
            <option value="document">Documents</option>
            <option value="clause">Clauses</option>
            <option value="investor">Investors</option>
          </select>
        </div>
        
        <ListHeader title="Recent Activity" count={filteredEntries.length} />
        
        <div className={styles.entryList}>
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className={`${styles.entryItem} ${selectedEntry?.id === entry.id ? styles.active : ''}`}
              onClick={() => setSelectedEntry(entry)}
            >
              <div className={`${styles.entryIcon} ${styles[getActionColor(entry.action)]}`}>
                {getActionIcon(entry.action)}
              </div>
              <div className={styles.entryContent}>
                <div className={styles.entryAction}>{entry.action}</div>
                <div className={styles.entryEntity}>{entry.entityName}</div>
                <div className={styles.entryMeta}>
                  {entry.user} · {formatTimestamp(entry.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </LeftPanel>

      {/* Center Panel - Demo Notice & Entry Details */}
      <CenterPanel>
        {/* Demo Mode Notice */}
        <div className={styles.demoNotice}>
          <div className={styles.demoNoticeIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div className={styles.demoNoticeContent}>
            <h3>Demo Environment</h3>
            <p>
              You're viewing a preview of the Audit Log feature. In production, this displays 
              real-time tracking of all system changes with full compliance reporting, user 
              attribution, and data retention policies.
            </p>
            <div className={styles.demoFeatures}>
              <div className={styles.demoFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>SOC 2 compliant logging</span>
              </div>
              <div className={styles.demoFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Immutable audit trail</span>
              </div>
              <div className={styles.demoFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Export to PDF/CSV</span>
              </div>
              <div className={styles.demoFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Role-based access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Entry Detail */}
        {selectedEntry ? (
          <div className={styles.entryDetail}>
            <div className={styles.detailHeader}>
              <div className={`${styles.detailIcon} ${styles[getActionColor(selectedEntry.action)]}`}>
                {getActionIcon(selectedEntry.action)}
              </div>
              <div>
                <h2 className={styles.detailTitle}>{selectedEntry.action}</h2>
                <p className={styles.detailSubtitle}>{selectedEntry.entityName}</p>
              </div>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Entity Type</div>
                <div className={styles.detailValue}>{selectedEntry.entityType}</div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Performed By</div>
                <div className={styles.detailValue}>{selectedEntry.user}</div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Timestamp</div>
                <div className={styles.detailValue}>
                  {new Date(selectedEntry.timestamp).toLocaleString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Entry ID</div>
                <div className={styles.detailValue}>#{selectedEntry.id.toString().padStart(6, '0')}</div>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h4 className={styles.sectionTitle}>Description</h4>
              <p className={styles.detailDescription}>{selectedEntry.details}</p>
            </div>

            {selectedEntry.changes && (
              <div className={styles.detailSection}>
                <h4 className={styles.sectionTitle}>Changes</h4>
                <div className={styles.changeItem}>
                  <div className={styles.changeField}>{selectedEntry.changes.field}</div>
                  <div className={styles.changeValues}>
                    <span className={styles.oldValue}>{selectedEntry.changes.oldValue}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                    <span className={styles.newValue}>{selectedEntry.changes.newValue}</span>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.demoOverlay}>
              <div className={styles.demoOverlayContent}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <span>Full audit details available in production</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.noSelection}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <line x1="10" y1="9" x2="8" y2="9"/>
            </svg>
            <p>Select an entry to view details</p>
            <span>Click on any activity item in the list</span>
          </div>
        )}
      </CenterPanel>
    </>
  );
}
