import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { InvestorDirectory } from './pages/InvestorDirectory';
import { AgreementsDocuments } from './pages/AgreementsDocuments';
import { FeeLogicView } from './pages/FeeLogicView';
import { AuditLog } from './pages/AuditLog';
import type { TabId } from './types';

function App() {
  const { user, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  // Read tab from URL params, default to 'investors'
  const urlTab = searchParams.get('tab') as TabId | null;
  const activeTab: TabId = urlTab && ['investors', 'agreements', 'fees', 'audit'].includes(urlTab) 
    ? urlTab 
    : 'investors';
  
  // Read document ID from URL params (for deep linking to specific documents)
  const documentIdParam = searchParams.get('documentId');
  const selectedDocumentId = documentIdParam ? parseInt(documentIdParam, 10) : null;

  // Reset right panel when switching tabs
  const handleTabChange = (tab: TabId, options?: { documentId?: number }) => {
    const newParams = new URLSearchParams();
    newParams.set('tab', tab);
    if (options?.documentId) {
      newParams.set('documentId', options.documentId.toString());
    }
    setSearchParams(newParams);
    setRightPanelOpen(false);
  };

  if (loading || !user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#1c1c1c',
        color: '#808080'
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Clear documentId param after it's been used (to allow normal navigation)
  const clearDocumentId = () => {
    if (documentIdParam) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('documentId');
      setSearchParams(newParams, { replace: true });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'investors':
        return <InvestorDirectory activeTab={activeTab} onTabChange={handleTabChange} />;
      case 'agreements':
        return (
          <AgreementsDocuments 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            onRightPanelChange={setRightPanelOpen}
            initialDocumentId={selectedDocumentId}
            onDocumentIdConsumed={clearDocumentId}
          />
        );
      case 'fees':
        return <FeeLogicView activeTab={activeTab} onTabChange={handleTabChange} />;
      case 'audit':
        return <AuditLog activeTab={activeTab} onTabChange={handleTabChange} />;
      default:
        return <InvestorDirectory activeTab={activeTab} onTabChange={handleTabChange} />;
    }
  };

  return (
    <Layout
      user={user}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      rightPanelOpen={rightPanelOpen}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
