import { useState, useRef, useEffect } from 'react';
import type { EffectiveTerm } from '../types';
import styles from './CitationPopup.module.css';

interface CitationPopupProps {
  term: EffectiveTerm;
  isOpen: boolean;
  onClose: () => void;
  onViewDocument?: (documentId: number) => void;
  anchorRect?: DOMRect | null;
}

export function CitationPopup({ 
  term, 
  isOpen, 
  onClose, 
  onViewDocument,
  anchorRect 
}: CitationPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Position the popup near the anchor
  const style: React.CSSProperties = {};
  if (anchorRect) {
    style.position = 'fixed';
    style.left = Math.min(anchorRect.left, window.innerWidth - 420);
    style.top = anchorRect.bottom + 8;
    
    // If popup would go off bottom, show above
    if (anchorRect.bottom + 300 > window.innerHeight) {
      style.top = anchorRect.top - 8;
      style.transform = 'translateY(-100%)';
    }
  }

  const formatValue = () => {
    if (term.rate !== null) return `${term.rate}%`;
    if (term.discount !== null) return `${term.discount}% discount`;
    if (term.threshold) return term.threshold;
    return 'Enabled';
  };

  return (
    <div className={styles.overlay}>
      <div ref={popupRef} className={styles.popup} style={style}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.clauseType}>{term.clauseType}</span>
            <span className={styles.clauseValue}>{formatValue()}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div className={styles.source}>
          <div className={styles.sourceIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div className={styles.sourceInfo}>
            <div className={styles.documentName}>{term.source.documentTitle}</div>
            <div className={styles.documentMeta}>
              <span className={styles.docTypeBadge}>{term.source.documentType}</span>
              {term.sectionRef && <span>Section §{term.sectionRef}</span>}
              {term.source.effectiveDate && (
                <span>Effective {new Date(term.source.effectiveDate).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
        
        {term.clauseText && (
          <div className={styles.clauseTextSection}>
            <div className={styles.sectionLabel}>Source Clause</div>
            <blockquote className={styles.clauseText}>
              "{term.clauseText}"
            </blockquote>
          </div>
        )}
        
        <div className={styles.footer}>
          <div className={styles.location}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Priority Level: {term.source.priority}
          </div>
          {onViewDocument && (
            <button 
              className={styles.viewBtn}
              onClick={() => onViewDocument(term.source.documentId)}
            >
              View Document
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Tooltip component for hover preview
interface CitationTooltipProps {
  term: EffectiveTerm;
  children: React.ReactNode;
}

export function CitationTooltip({ term, children }: CitationTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltipPos({ x: rect.left, y: rect.bottom + 8 });
    timeoutRef.current = window.setTimeout(() => setShowTooltip(true), 300);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
  };

  return (
    <span 
      className={styles.tooltipWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && (
        <div 
          className={styles.tooltip}
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipType}>{term.clauseType}</span>
          </div>
          <div className={styles.tooltipSource}>
            {term.source.documentTitle}
            {term.sectionRef && ` · §${term.sectionRef}`}
          </div>
          {term.clauseText && (
            <div className={styles.tooltipText}>
              "{term.clauseText.slice(0, 100)}{term.clauseText.length > 100 ? '...' : ''}"
            </div>
          )}
          <div className={styles.tooltipHint}>Click to view full citation</div>
        </div>
      )}
    </span>
  );
}

// Clickable value wrapper
interface CitationValueProps {
  term: EffectiveTerm;
  children: React.ReactNode;
  onViewDocument?: (documentId: number) => void;
}

export function CitationValue({ term, children, onViewDocument }: CitationValueProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    if (valueRef.current) {
      setAnchorRect(valueRef.current.getBoundingClientRect());
    }
    setIsPopupOpen(true);
  };

  return (
    <>
      <CitationTooltip term={term}>
        <span 
          ref={valueRef}
          className={styles.citationValue}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
          {children}
          <svg className={styles.citationIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </span>
      </CitationTooltip>
      <CitationPopup
        term={term}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onViewDocument={onViewDocument}
        anchorRect={anchorRect}
      />
    </>
  );
}
