import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { 
  LeftPanel, 
  PanelHeader, 
  NavTabs, 
  ListHeader,
  CenterPanel
} from '../components/Layout';
import type { TabId, TabChangeHandler, Investor, EffectiveTermsResponse } from '../types';
import styles from './FeeLogicView.module.css';

interface FeeLogicViewProps {
  activeTab: TabId;
  onTabChange: TabChangeHandler;
}

function formatCurrency(amount: number, compact = false): string {
  if (compact && amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 2)}M`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCommitmentInput(value: string): string {
  // Remove non-numeric characters except decimal
  const numeric = value.replace(/[^0-9]/g, '');
  if (!numeric) return '';
  return formatCurrency(parseInt(numeric, 10));
}

function parseCommitmentInput(value: string): number {
  const numeric = value.replace(/[^0-9]/g, '');
  return parseInt(numeric, 10) || 0;
}

interface FeeCalculation {
  baseRate: number;
  discounts: { label: string; rate: number; source: string; documentId?: number }[];
  effectiveRate: number;
  annualFee: number;
  stepDowns: { year: string; rate: number; annualFee: number }[];
}

function calculateFees(
  commitment: number,
  terms: EffectiveTermsResponse | null,
  year: number
): FeeCalculation {
  // Default values if no terms
  let baseRate = 2.0; // Default PPM rate
  const discounts: { label: string; rate: number; source: string; documentId?: number }[] = [];
  const stepDowns: { year: string; rate: number; annualFee: number }[] = [];

  // Get management fee from effective terms
  const managementFeeTerm = terms?.terms?.['Management Fee'];
  if (managementFeeTerm?.rate) {
    baseRate = managementFeeTerm.rate;
  }

  // Check for fee waivers/discounts
  const feeWaiverTerm = terms?.terms?.['Fee Waiver/Discount'];
  if (feeWaiverTerm?.discount) {
    discounts.push({
      label: 'Fee Discount',
      rate: -feeWaiverTerm.discount,
      source: `${feeWaiverTerm.source.documentType} §${feeWaiverTerm.sectionRef || '—'}`,
      documentId: feeWaiverTerm.source.documentId,
    });
  }

  // Check for step-downs
  const stepDownTerm = terms?.terms?.['Fee Step-Down'];
  if (stepDownTerm?.discount && stepDownTerm?.threshold) {
    // Parse the threshold to get the year
    const yearMatch = stepDownTerm.threshold.match(/(\d+)/);
    const stepDownYear = yearMatch ? parseInt(yearMatch[1], 10) : 4;
    
    // Calculate rates for different periods
    const preStepDownRate = baseRate - discounts.reduce((sum, d) => sum + d.rate, 0);
    const postStepDownRate = preStepDownRate - stepDownTerm.discount;
    
    if (year < stepDownYear) {
      stepDowns.push({
        year: `Years 1-${stepDownYear - 1}`,
        rate: preStepDownRate,
        annualFee: commitment * (preStepDownRate / 100),
      });
    }
    stepDowns.push({
      year: `Years ${stepDownYear}+`,
      rate: postStepDownRate,
      annualFee: commitment * (postStepDownRate / 100),
    });
  }

  // Calculate effective rate
  const totalDiscount = discounts.reduce((sum, d) => sum + d.rate, 0);
  let effectiveRate = baseRate + totalDiscount; // totalDiscount is negative

  // Apply step-down if current year qualifies
  if (stepDownTerm?.discount && stepDownTerm?.threshold) {
    const yearMatch = stepDownTerm.threshold.match(/(\d+)/);
    const stepDownYear = yearMatch ? parseInt(yearMatch[1], 10) : 4;
    if (year >= stepDownYear) {
      discounts.push({
        label: `Step-Down (Year ${stepDownYear}+)`,
        rate: -stepDownTerm.discount,
        source: `${stepDownTerm.source.documentType} §${stepDownTerm.sectionRef || '—'}`,
        documentId: stepDownTerm.source.documentId,
      });
      effectiveRate -= stepDownTerm.discount;
    }
  }

  const annualFee = commitment * (effectiveRate / 100);

  return {
    baseRate,
    discounts,
    effectiveRate,
    annualFee,
    stepDowns,
  };
}

export function FeeLogicView({ activeTab, onTabChange }: FeeLogicViewProps) {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected investor
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [effectiveTerms, setEffectiveTerms] = useState<EffectiveTermsResponse | null>(null);
  
  // Calculator inputs
  const [commitmentInput, setCommitmentInput] = useState('');
  const [investmentYear, setInvestmentYear] = useState(1);
  const [customMode, setCustomMode] = useState(false);

  useEffect(() => {
    loadInvestors();
  }, []);

  // Load effective terms when investor changes
  useEffect(() => {
    if (selectedInvestor) {
      loadEffectiveTerms(selectedInvestor.id);
      setCommitmentInput(formatCurrency(selectedInvestor.commitmentAmount || 0));
      setCustomMode(false);
    }
  }, [selectedInvestor?.id]);

  const loadInvestors = async () => {
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

  const loadEffectiveTerms = async (investorId: number) => {
    try {
      const terms = await api.getEffectiveTerms(investorId);
      setEffectiveTerms(terms);
    } catch (err) {
      console.error('Failed to load effective terms:', err);
      setEffectiveTerms(null);
    }
  };

  const filteredInvestors = useMemo(() => {
    if (!searchQuery) return investors;
    const query = searchQuery.toLowerCase();
    return investors.filter((inv) =>
      inv.name.toLowerCase().includes(query) ||
      inv.fund?.toLowerCase().includes(query)
    );
  }, [investors, searchQuery]);

  // Calculate fees based on current inputs
  const calculation = useMemo(() => {
    const commitment = parseCommitmentInput(commitmentInput);
    return calculateFees(commitment, effectiveTerms, investmentYear);
  }, [commitmentInput, effectiveTerms, investmentYear]);

  const handleCommitmentChange = (value: string) => {
    setCommitmentInput(formatCommitmentInput(value));
  };

  const enterCustomMode = () => {
    setSelectedInvestor(null);
    setEffectiveTerms(null);
    setCustomMode(true);
    setCommitmentInput('$100,000,000');
  };

  return (
    <>
      <LeftPanel>
        <PanelHeader
          searchPlaceholder="Search investors..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onDataChange={() => {
            loadInvestors();
            setSelectedInvestor(null);
            setEffectiveTerms(null);
          }}
        />
        <NavTabs activeTab={activeTab} onTabChange={onTabChange} />
        <ListHeader title="Select Investor" count={filteredInvestors.length} />
        
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
                className={`${styles.investorItem} ${selectedInvestor?.id === investor.id && !customMode ? styles.active : ''}`}
                onClick={() => {
                  setSelectedInvestor(investor);
                  setCustomMode(false);
                }}
              >
                <div className={styles.investorName}>{investor.name}</div>
                <div className={styles.investorMeta}>
                  {formatCurrency(investor.commitmentAmount || 0, true)} · {investor.fund || 'No fund'}
                </div>
              </div>
            ))
          )}
        </div>
        
        <button className={styles.addBtn} onClick={enterCustomMode}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Custom Calculation
        </button>
      </LeftPanel>

      <CenterPanel>
        <div className={styles.detailHeader}>
          <h2 className={styles.detailTitle}>Fee Calculator</h2>
          <p className={styles.detailSubtitle}>
            {customMode 
              ? 'Custom Parameters' 
              : selectedInvestor 
                ? `${selectedInvestor.name} · ${selectedInvestor.fund || 'No fund'}`
                : 'Select an investor'}
          </p>
        </div>
        
        <div className={styles.detailContent}>
          {/* Scenario Parameters */}
          <div className={styles.calcSection}>
            <h3 className={styles.sectionTitle}>Scenario Parameters</h3>
            <div className={styles.inputGroup}>
              <div className={styles.inputItem}>
                <label className={styles.inputLabel}>Commitment Amount</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={commitmentInput}
                  onChange={(e) => handleCommitmentChange(e.target.value)}
                  placeholder="$0"
                />
              </div>
              <div className={styles.inputItem}>
                <label className={styles.inputLabel}>Investment Year</label>
                <select
                  className={styles.inputField}
                  value={investmentYear}
                  onChange={(e) => setInvestmentYear(parseInt(e.target.value, 10))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(y => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Calculated Results */}
          <div className={styles.calcSection}>
            <h3 className={styles.sectionTitle}>Calculated Results</h3>
            <div className={styles.resultsGrid}>
              <div className={styles.resultCard}>
                <div className={styles.resultLabel}>Base Rate</div>
                <div className={styles.resultValue}>{calculation.baseRate.toFixed(2)}%</div>
                <div className={styles.resultNote}>Standard rate</div>
              </div>
              <div className={`${styles.resultCard} ${styles.highlight}`}>
                <div className={styles.resultLabel}>Effective Rate</div>
                <div className={`${styles.resultValue} ${styles.accent}`}>
                  {calculation.effectiveRate.toFixed(2)}%
                </div>
                <div className={styles.resultNote}>After discounts</div>
              </div>
              <div className={styles.resultCard}>
                <div className={styles.resultLabel}>Annual Fee</div>
                <div className={styles.resultValue}>
                  {formatCurrency(calculation.annualFee, true)}
                </div>
                <div className={styles.resultNote}>Per year</div>
              </div>
            </div>
          </div>
          
          {/* Fee Breakdown */}
          <div className={styles.calcSection}>
            <h3 className={styles.sectionTitle}>Fee Breakdown</h3>
            <div className={styles.breakdown}>
              <div className={styles.breakdownHeader}>Calculation Steps</div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Base Management Fee</span>
                <span className={styles.breakdownRight}>
                  <span className={styles.breakdownValue}>{calculation.baseRate.toFixed(2)}%</span>
                  {effectiveTerms?.terms?.['Management Fee'] && (
                    <button 
                      className={styles.breakdownSource}
                      onClick={() => {
                        const docId = effectiveTerms.terms['Management Fee'].source.documentId;
                        const url = `${window.location.origin}?tab=agreements&documentId=${docId}`;
                        window.open(url, '_blank');
                      }}
                      title="View source document"
                    >
                      {effectiveTerms.terms['Management Fee'].source.documentType} §{effectiveTerms.terms['Management Fee'].sectionRef || '—'}
                      <svg className={styles.sourceIcon} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </button>
                  )}
                </span>
              </div>
              
              {calculation.discounts.map((discount, idx) => (
                <div key={idx} className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>{discount.label}</span>
                  <span className={styles.breakdownRight}>
                    <span className={styles.breakdownValue}>{discount.rate.toFixed(2)}%</span>
                    {discount.documentId ? (
                      <button 
                        className={styles.breakdownSource}
                        onClick={() => {
                          const url = `${window.location.origin}?tab=agreements&documentId=${discount.documentId}`;
                          window.open(url, '_blank');
                        }}
                        title="View source document"
                      >
                        {discount.source}
                        <svg className={styles.sourceIcon} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      </button>
                    ) : (
                      <span className={styles.breakdownSource}>{discount.source}</span>
                    )}
                  </span>
                </div>
              ))}
              
              <div className={`${styles.breakdownRow} ${styles.total}`}>
                <span className={styles.breakdownLabel}>Effective Rate</span>
                <span className={styles.breakdownValue}>{calculation.effectiveRate.toFixed(2)}%</span>
              </div>
              
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>× Commitment</span>
                <span className={styles.breakdownValue}>{commitmentInput || '$0'}</span>
              </div>
              
              <div className={`${styles.breakdownRow} ${styles.total}`}>
                <span className={styles.breakdownLabel}>Annual Fee</span>
                <span className={styles.breakdownValue}>{formatCurrency(calculation.annualFee)}</span>
              </div>
            </div>
          </div>
          
          {/* Future Projections */}
          {calculation.stepDowns.length > 0 && (
            <div className={styles.calcSection}>
              <h3 className={styles.sectionTitle}>Future Projections</h3>
              <div className={styles.breakdown}>
                <div className={styles.breakdownHeader}>Year-by-Year</div>
                {calculation.stepDowns.map((step, idx) => (
                  <div key={idx} className={styles.breakdownRow}>
                    <span className={styles.breakdownLabel}>{step.year}</span>
                    <span className={styles.breakdownValue}>
                      {formatCurrency(step.annualFee, true)} /yr @ {step.rate.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CenterPanel>
    </>
  );
}
