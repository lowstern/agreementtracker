"""
Effective Terms Engine

This module implements the core conflict resolution logic for determining
the "winning" terms across multiple documents for an investor.

Priority Rules:
1. Document type hierarchy: Amendment (4) > Side Letter (3) > Fee Schedule (3) > Subscription (2) > PPM (1)
2. For same priority: Most recent effective date wins
3. Supersedes relationship: If doc A supersedes doc B, A's clauses override B's
"""

from collections import defaultdict
from datetime import date
from models import Document, Clause


def calculate_effective_terms(investor_id):
    """
    Calculate the effective terms for an investor by resolving conflicts
    across all their documents.
    
    Returns a dict with:
    - terms: Dict of clause_type -> winning clause info
    - overridden: Dict of clause_type -> list of overridden clauses
    """
    # Get all documents for this investor, ordered by priority desc, then date desc
    documents = Document.query.filter_by(investor_id=investor_id).all()
    
    if not documents:
        return {"terms": {}, "overridden": {}, "summary": {}}
    
    # Build supersedes map (doc_id -> superseded_doc_id)
    supersedes_map = {}
    superseded_by_map = {}  # reverse: doc_id -> doc that supersedes it
    for doc in documents:
        if doc.supersedes_id:
            supersedes_map[doc.id] = doc.supersedes_id
            superseded_by_map[doc.supersedes_id] = doc.id
    
    # Collect all clauses grouped by type
    clauses_by_type = defaultdict(list)
    
    for doc in documents:
        for clause in doc.clauses:
            clauses_by_type[clause.clause_type].append({
                "clause": clause,
                "document": doc,
                "priority": doc.priority,
                "effective_date": doc.effective_date,
                "is_superseded": doc.id in superseded_by_map,
                "superseded_by_doc_id": superseded_by_map.get(doc.id),
            })
    
    # Resolve conflicts for each clause type
    effective_terms = {}
    overridden_terms = {}
    
    for clause_type, candidates in clauses_by_type.items():
        if not candidates:
            continue
        
        # Filter out superseded documents (unless they're the only source)
        active_candidates = [c for c in candidates if not c["is_superseded"]]
        if not active_candidates:
            active_candidates = candidates  # Fall back to superseded if no active
        
        # Sort by priority (desc), then effective_date (desc, nulls last)
        def sort_key(c):
            priority = c["priority"] or 0
            eff_date = c["effective_date"] or date.min
            return (-priority, -eff_date.toordinal() if eff_date != date.min else float('inf'))
        
        sorted_candidates = sorted(active_candidates, key=sort_key)
        
        # Winner is the first one
        winner = sorted_candidates[0]
        losers = sorted_candidates[1:] + [c for c in candidates if c["is_superseded"] and c not in sorted_candidates]
        
        # Build the effective term entry
        effective_terms[clause_type] = {
            "clauseId": winner["clause"].id,
            "clauseType": clause_type,
            "rate": float(winner["clause"].rate) if winner["clause"].rate else None,
            "discount": float(winner["clause"].discount) if winner["clause"].discount else None,
            "threshold": winner["clause"].threshold,
            "thresholdAmount": float(winner["clause"].threshold_amount) if winner["clause"].threshold_amount else None,
            "effectiveDate": winner["clause"].effective_date.isoformat() if winner["clause"].effective_date else None,
            "clauseText": winner["clause"].clause_text,
            "notes": winner["clause"].notes,
            "sectionRef": winner["clause"].section_ref,
            "source": {
                "documentId": winner["document"].id,
                "documentTitle": winner["document"].title,
                "documentType": winner["document"].doc_type,
                "priority": winner["priority"],
                "effectiveDate": winner["document"].effective_date.isoformat() if winner["document"].effective_date else None,
            }
        }
        
        # Build overridden list
        if losers:
            overridden_terms[clause_type] = []
            for loser in losers:
                overridden_terms[clause_type].append({
                    "clauseId": loser["clause"].id,
                    "rate": float(loser["clause"].rate) if loser["clause"].rate else None,
                    "discount": float(loser["clause"].discount) if loser["clause"].discount else None,
                    "threshold": loser["clause"].threshold,
                    "clauseText": loser["clause"].clause_text,
                    "source": {
                        "documentId": loser["document"].id,
                        "documentTitle": loser["document"].title,
                        "documentType": loser["document"].doc_type,
                        "priority": loser["priority"],
                        "effectiveDate": loser["document"].effective_date.isoformat() if loser["document"].effective_date else None,
                    },
                    "reason": get_override_reason(winner, loser),
                })
    
    # Build summary for quick display
    summary = build_terms_summary(effective_terms)
    
    return {
        "terms": effective_terms,
        "overridden": overridden_terms,
        "summary": summary,
    }


def get_override_reason(winner, loser):
    """Generate a human-readable reason why this clause was overridden."""
    if loser.get("is_superseded"):
        return f"Superseded by {winner['document'].title}"
    
    if winner["priority"] > loser["priority"]:
        return f"Lower priority document type ({loser['document'].doc_type})"
    
    if winner["priority"] == loser["priority"]:
        winner_date = winner["effective_date"]
        loser_date = loser["effective_date"]
        if winner_date and loser_date and winner_date > loser_date:
            return f"Older effective date ({loser_date.isoformat()})"
        elif winner_date and not loser_date:
            return "No effective date specified"
    
    return "Lower priority"


def build_terms_summary(effective_terms):
    """Build a simplified summary for display in the investor overview."""
    summary = {}
    
    # Management Fee
    if "Management Fee" in effective_terms:
        term = effective_terms["Management Fee"]
        rate = term.get("rate")
        summary["managementFee"] = {
            "value": f"{rate}%" if rate else "—",
            "source": term["source"]["documentTitle"],
            "documentType": term["source"]["documentType"],
        }
    
    # Fee Step-Down
    if "Fee Step-Down" in effective_terms:
        term = effective_terms["Fee Step-Down"]
        threshold = term.get("threshold") or "—"
        discount = term.get("discount")
        value = f"{threshold}" if threshold != "—" else "—"
        if discount:
            value = f"−{discount}% at {threshold}" if threshold != "—" else f"−{discount}%"
        summary["feeStepDown"] = {
            "value": value,
            "source": term["source"]["documentTitle"],
            "documentType": term["source"]["documentType"],
        }
    
    # MFN Protection
    if "MFN (Most Favored Nation)" in effective_terms:
        term = effective_terms["MFN (Most Favored Nation)"]
        summary["mfnProtection"] = {
            "value": "Enabled",
            "source": term["source"]["documentTitle"],
            "documentType": term["source"]["documentType"],
        }
    
    # Carry Terms
    if "Carry Terms" in effective_terms:
        term = effective_terms["Carry Terms"]
        rate = term.get("rate")
        summary["carryTerms"] = {
            "value": f"{rate}%" if rate else "—",
            "source": term["source"]["documentTitle"],
            "documentType": term["source"]["documentType"],
        }
    
    # Preferred Return
    if "Preferred Return" in effective_terms:
        term = effective_terms["Preferred Return"]
        rate = term.get("rate")
        summary["preferredReturn"] = {
            "value": f"{rate}%" if rate else "—",
            "source": term["source"]["documentTitle"],
            "documentType": term["source"]["documentType"],
        }
    
    # Fee Waiver/Discount
    if "Fee Waiver/Discount" in effective_terms:
        term = effective_terms["Fee Waiver/Discount"]
        discount = term.get("discount")
        summary["feeWaiver"] = {
            "value": f"{discount}% discount" if discount else "—",
            "source": term["source"]["documentTitle"],
            "documentType": term["source"]["documentType"],
        }
    
    # Co-investment Rights
    if "Co-investment Rights" in effective_terms:
        term = effective_terms["Co-investment Rights"]
        summary["coInvestment"] = {
            "value": "Enabled",
            "source": term["source"]["documentTitle"],
            "documentType": term["source"]["documentType"],
        }
    
    return summary
