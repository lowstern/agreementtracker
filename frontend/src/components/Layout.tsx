import { ReactNode, useState, useCallback, useEffect, useRef, createContext, useContext } from 'react';
import type { TabId, User } from '../types';
import { api } from '../services/api';
import styles from './Layout.module.css';

// Context for sharing right panel width
interface RightPanelContextType {
  width: number;
  setWidth: (width: number) => void;
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
}

const RightPanelContext = createContext<RightPanelContextType>({
  width: 420,
  setWidth: () => {},
  isResizing: false,
  setIsResizing: () => {},
});

interface LayoutProps {
  user: User;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  children: ReactNode;
  rightPanelOpen?: boolean;
}

const MIN_WIDTH = 280;
const MAX_WIDTH = 800;
const DEFAULT_WIDTH = 420;

export function Layout({ user: _user, activeTab: _activeTab, onTabChange: _onTabChange, children, rightPanelOpen = false }: LayoutProps) {
  const [rightPanelWidth, setRightPanelWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  const gridStyle = rightPanelOpen 
    ? { gridTemplateColumns: `280px 1fr ${rightPanelWidth}px` }
    : undefined;

  return (
    <RightPanelContext.Provider value={{ 
      width: rightPanelWidth, 
      setWidth: setRightPanelWidth,
      isResizing,
      setIsResizing 
    }}>
      <div 
        className={`${styles.app} ${rightPanelOpen ? styles.threePanelOpen : ''} ${isResizing ? styles.resizing : ''}`}
        style={gridStyle}
      >
        <div className={styles.demoBanner}>
          <div className={styles.demoBannerContent}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>Demo Mode - Explore the platform with sample data</span>
          </div>
        </div>
        {children}
      </div>
    </RightPanelContext.Provider>
  );
}

// Shared components for the three-panel layout
export function LeftPanel({ children }: { children: ReactNode }) {
  return <aside className={styles.leftPanel}>{children}</aside>;
}

export function PanelHeader({ 
  searchPlaceholder, 
  searchValue, 
  onSearchChange,
  onDataChange,
}: { 
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onDataChange?: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSeedDemo = async () => {
    setLoading(true);
    try {
      const result = await api.seedDemoData();
      alert(`Demo data seeded!\n\nCreated:\n• ${result.created.investors} investors\n• ${result.created.documents} documents\n• ${result.created.clauses} clauses`);
      onDataChange?.();
    } catch (err) {
      alert('Failed to seed demo data: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
      return;
    }
    setLoading(true);
    try {
      await api.clearAllData();
      alert('All data has been cleared.');
      onDataChange?.();
    } catch (err) {
      alert('Failed to clear data: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  return (
    <div className={styles.panelHeader}>
      <div className={styles.logoRow}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/>
            </svg>
          </div>
          <h1>Agreement Tracker</h1>
        </div>
        <div className={styles.menuContainer}>
          <button 
            className={styles.menuBtn} 
            onClick={() => setShowMenu(!showMenu)}
            title="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </button>
          {showMenu && (
            <div className={styles.menuDropdown}>
              <div className={styles.menuSection}>
                <div className={styles.menuLabel}>Demo Data</div>
                <button 
                  className={styles.menuItem}
                  onClick={handleSeedDemo}
                  disabled={loading}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                  {loading ? 'Loading...' : 'Load Demo Data'}
                </button>
                <button 
                  className={`${styles.menuItem} ${styles.danger}`}
                  onClick={handleClearData}
                  disabled={loading}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                  {loading ? 'Loading...' : 'Clear All Data'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {onSearchChange && (
        <input
          type="search"
          className={styles.searchBox}
          placeholder={searchPlaceholder || "Search..."}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      )}
    </div>
  );
}

export function NavTabs({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: TabId; 
  onTabChange: (tab: TabId) => void;
}) {
  return (
    <div className={styles.navTabs}>
      <button 
        className={`${styles.navTab} ${activeTab === 'investors' ? styles.active : ''}`}
        onClick={() => onTabChange('investors')}
      >
        Investors
      </button>
      <button 
        className={`${styles.navTab} ${activeTab === 'agreements' ? styles.active : ''}`}
        onClick={() => onTabChange('agreements')}
      >
        Documents
      </button>
      <button 
        className={`${styles.navTab} ${activeTab === 'fees' ? styles.active : ''}`}
        onClick={() => onTabChange('fees')}
      >
        Fees
      </button>
    </div>
  );
}

export function ListHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className={styles.listHeader}>
      <span className={styles.listTitle}>{title}</span>
      {count !== undefined && (
        <span className={styles.listCount}>{count} total</span>
      )}
    </div>
  );
}

export function CenterPanel({ children }: { children: ReactNode }) {
  return <main className={styles.centerPanel}>{children}</main>;
}

export function RightPanel({ children, isOpen = true }: { children: ReactNode; isOpen?: boolean }) {
  const { width: _width, setWidth, isResizing, setIsResizing } = useContext(RightPanelContext);
  const panelRef = useRef<HTMLElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, [setIsResizing]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelRef.current) return;
      
      const windowWidth = window.innerWidth;
      const newWidth = windowWidth - e.clientX;
      
      // Clamp width between min and max
      const clampedWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth));
      setWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setWidth, setIsResizing]);

  return (
    <aside 
      ref={panelRef}
      className={`${styles.rightPanel} ${isOpen ? styles.open : styles.closed}`}
    >
      <div 
        className={`${styles.resizeHandle} ${isResizing ? styles.active : ''}`}
        onMouseDown={handleMouseDown}
      />
      {children}
    </aside>
  );
}

export function DetailHeader({ 
  title, 
  subtitle, 
  badge,
  actions 
}: { 
  title: string; 
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className={styles.detailHeader}>
      <div>
        {badge}
        <h2 className={styles.detailTitle}>{title}</h2>
        {subtitle && <p className={styles.detailSubtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.headerActions}>{actions}</div>}
    </div>
  );
}

export function TabsBar({ 
  tabs, 
  activeTab, 
  onTabChange 
}: { 
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <nav className={styles.tabsBar}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
