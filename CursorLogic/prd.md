# Product Overview

Agreement Tracker is a contract and agreement tracking system for fund managers (specifically KKR's wealth management division) to manage Limited Partner (LP) investments. It serves as the golden source of truth for investor terms by extracting and organizing data directly from legal documents rather than relying on manual data entry.

**Market Gap:** No existing systems track investor commitments with varying fee structures across different investors while maintaining document-level traceability.

**Target Users:**

- **Investor Relations:** Look up investor profiles and applicable terms
- **Legal/Compliance:** Upload agreements and verify clause accuracy
- **Finance:** Model fee calculations and understand discount structures

---

# Core Features

## 1. Investor Directory

**Purpose:** Central repository for all LP information with relationship management capabilities.

**Data Fields:**

- Investor name
- Investor type (LP, Family Office, Institutional, etc.)
- Commitment amount
- Fund vehicle
- Relationship notes ("Has side letter," "Co-invest rights," etc.)
- Internal team notes

**Key Capabilities:**

- Search and filter functionality
- Display finalized/effective terms aggregated across all documents
- One-to-many relationship: each investor can have multiple documents

**Data Display Logic:**

- Shows the "winning" values after applying all document hierarchy rules
- Aggregated view represents final state after conflict resolution

---

## 2. Agreements & Documents

### Document Management

**Document Upload Options:**

- Direct file upload
- Email forwarding to dedicated address (privacy-first approach)
- Email timestamps establish document chronology

**Document Metadata:**

- Document title/name
- Associated investor
- Associated fund
- Document type (Side Letter, Amendment, Subscription Agreement, PPM)
- Effective date
- Supersedes relationship (which older agreement it replaces)
- Original file attachment

### AI Extraction Engine

**Extraction Capabilities:**

- Management fees and fee structures
- Fund information
- Investment amounts and commitment details
- Effective terms and dates
- Co-investment rights
- MFN (Most Favored Nation) protections
- Carry terms
- Fee waivers and discounts

**Auto-Suggest Feature:**

- AI suggests values during manual entry
- Display as gray text/numbers showing AI-suggested values
- User can accept or override suggestions

### Citation & Source Tracking

**Critical Requirement:** Every extracted data point must include source citation.

**Implementation:**

- Two-stage extraction: extract data, then identify source location in document
- Tooltip/popup interaction: click any number or value to see source
- Highlights exact text in original document when citation is clicked
- Translation layer converts AI's natural language location references into programmatic highlighting
- Fallback mechanisms to ensure 100% citation accuracy

**User Experience:**

- "Click any number to see the source clause it came from"
- Visual indicator that values are clickable/have sources

### Clause Management

**Clause Structure:**

- Clause type (Management Fee, Carry, MFN, Fee Waiver, Co-investment Rights, etc.)
- Full clause text (copied from document)
- Structured data fields:
    - Rate/percentage
    - Threshold amounts
    - Discount values
    - Effective dates
- Link to source location in document

**Per-Document View:**

- Shows all fields and clauses extracted from that specific document
- No conflict resolution applied (raw document data)

---

## 3. Effective Terms View

**Purpose:** The "magic" feature that determines which terms actually apply to each investor.

**Conflict Resolution Rules:**

**Document Type Hierarchy (Priority Order):**

1. Amendments (highest priority)
2. Side Letters
3. Subscription Agreements
4. PPM (lowest priority)

**Date-Based Rules:**

- Later documents generally override earlier ones
- When document types are equal, most recent wins

**Manual Override:**

- Edge case handling: allow manual override of automatic conflict resolution
- Flag when manual override is applied
- Document reason for override

**User Interaction:**

- Select an investor
- System displays the "winning" clause for each term type
- Visual indication of which document provided each winning term
- Ability to drill down and see all competing clauses across documents

---

## 4. Fee Logic View

**Purpose:** Internal profitability calculator for KKR to model fee scenarios.

**Core Functionality:**

**Fee Rule Configuration:**

- Base management fee rates
- Tier thresholds (e.g., different rates above $100M, $250M, etc.)
- Discount structures
- Time-based changes (e.g., discount starting in year 4)

**Scenario Testing:**

- Adjust commitment amount dynamically
- See real-time fee calculations
- Display annual fee impact in dollars
- Model "what-if" scenarios

**Source Traceability:**

- Every number in the calculator is clickable
- Click to see the source clause that determined that value
- Maintains citation chain from calculation back to original document

**Calculation Display:**

- Show breakdown of fee calculation
- Tier-by-tier computation when applicable
- Before/after discount views

---

# Technical Requirements

## Document Processing Pipeline

1. **Ingest:** Email forwarding or direct upload
2. **Extract:** AI processes document for key data points
3. **Locate:** AI identifies source location for each extracted value
4. **Store:** Save extracted data with citations
5. **Resolve:** Apply business rules to determine effective terms
6. **Display:** Present aggregated and per-document views

## Email Integration

- Dedicated email address (e.g., [contracts@agreement-tracker.com](mailto:contracts@agreement-tracker.com))
- Accept forwarded emails with PDF attachments
- Extract timestamp from email metadata
- Privacy-first: no full inbox integration required

## Data Model

**Key Relationships:**

- Investor (1) → Documents (many)
- Document (1) → Clauses (many)
- Document (1) → Investor (1)
- Each clause belongs to one document only

## Deployment

- Deploy on Render
- Demo mode with login requirement
- Demo credentials: [demo@agreement-tracker.com](mailto:demo@agreement-tracker.com) / Demo123!

---

# Sample Data & Demo

**Pre-loaded Mock Investors:**

**Mock Capital LP:**

- $250M commitment
- Subscription agreement with standard 1.0% management fee
- Side letter with 0.25% fee discount starting year 4
- Demonstrates document hierarchy (side letter overrides subscription agreement)

**Atlas Family Office:**

- $75M commitment
- Co-investment rights clause
- MFN protection clause
- Demonstrates multiple clause types

**Demo Controls:**

- "Reset demo data" button: restore original examples
- "Clear mock data" button: start with clean slate

---

# Out of Scope (MVP Exclusions)

**Deliberately excluded to maintain focus:**

- Contract modification/editing
- Version control and document comparison
- Workflow approvals
- E-signature integration
- Full contract lifecycle management

**Rationale:** Position as interim solution while KKR evaluates larger platforms (Juniper Square, Palantir Foundry). Focus on core value proposition: contracts as golden source.

---

# Product Positioning

**Key Differentiators:**

- Documents as source of truth (not manual data entry)
- Citation-based transparency
- Purpose-built for PE/fund management fee structures
- Lightweight vs. enterprise CLM platforms

**Competitive Context:**

- KKR evaluating Juniper Square for fee tracking
- Palantir building similar in Foundry
- Advantage: dedicated focus and faster deployment

**Pricing Strategy:**

- Freemium model: free trial to get embedded in workflows
- Modest annual fee (~$100K) for maintenance
- Goal: adoption over aggressive monetization

---

# Success Metrics

**User Adoption:**

- Number of investors tracked
- Number of documents processed
- Daily active users by role

**System Performance:**

- AI extraction accuracy rate
- Citation availability (target: 100%)
- Document processing time

**Business Impact:**

- Time saved vs. manual lookup
- Reduction in fee calculation errors
- User satisfaction scores

---

# Development Priorities

**Phase 1 (MVP for Thursday Demo):**

1. Investor directory with basic CRUD
2. Document upload (file upload first, email later)
3. Manual clause entry with type tagging
4. Document hierarchy logic implementation
5. Effective terms calculation
6. Basic fee calculator
7. Demo data with Mock Capital LP and Atlas Family Office

**Phase 2 (Post-Demo Enhancements):**

1. AI extraction engine integration
2. Citation system with document highlighting
3. Auto-suggest during manual entry
4. Email forwarding integration
5. Advanced fee modeling scenarios

**Phase 3 (Future):**

1. Manual override workflow with documentation
2. Audit trail for changes
3. Enhanced reporting and analytics
4. Multi-fund support

---

# User Flows

## Flow 1: Upload New Agreement

1. User navigates to "Agreements & Documents" tab
2. Clicks "Add Agreement" or forwards email
3. Enters/confirms metadata (investor, fund, type, date)
4. AI extracts clauses (or user enters manually)
5. User reviews extracted data and citations
6. Saves agreement
7. System recalculates effective terms for investor
8. Updated terms appear in Investor Directory

## Flow 2: Look Up Investor Terms

1. User navigates to "Investor Directory"
2. Searches for investor name
3. Clicks investor to view profile
4. Sees effective terms (aggregated view)
5. Clicks any value to see source citation
6. Popup shows clause text and document source
7. Optional: drill down to see all documents for investor

## Flow 3: Model Fee Scenario

1. User navigates to "Fee Logic View"
2. Selects investor or enters custom parameters
3. Adjusts commitment amount slider
4. Views calculated annual fee
5. Clicks fee components to see source clauses
6. Tests multiple scenarios by changing amounts
7. Optional: exports calculation summary

---

# UI/UX Notes

**Three-Tab Structure:**

1. **Investor Directory** — Browse and search investors
2. **Agreements & Documents** — Manage documents and clauses
3. **Fee Logic View** — Run fee calculations

**Design Principles:**

- Citation transparency: every value should be traceable
- Progressive disclosure: summary view → detail view → source
- Search-first: users should find information quickly
- Professional aesthetic: this is enterprise software

**Citation UI Pattern:**

- Clickable values with subtle indicator (underline, icon, or color)
- Hover shows preview tooltip
- Click opens detailed popup with highlighted source text
- Close popup returns to previous context

---

# Product Name Considerations

**Requirements:**

- Professional and official sounding
- Suitable for enterprise/PE context
- Available domain name

**Candidates discussed:**

- Millie
- TermTrail
- Termivo
- CapTrack
- ClauseLoom
- Million

**Action item:** Select and purchase domain name before demo.

---

# Next Steps

- [ ]  Review this PRD with development team
- [ ]  Prioritize Phase 1 features for Thursday demo
- [ ]  Set up development environment and Render deployment
- [ ]  Build core investor directory functionality
- [ ]  Implement document hierarchy logic
- [ ]  Create demo data (Mock Capital LP, Atlas Family Office)
- [ ]  Build fee calculator
- [ ]  Deploy demo mode to Render
- [ ]  Select and purchase domain name
- [ ]  Prepare demo walkthrough for KKR presentation

---

# Questions for Resolution

1. **AI Provider:** Which LLM/extraction service for document processing?
2. **Document Types:** Full list of document types to support beyond the core four?
3. **Clause Types:** Complete enumeration of clause types to track?
4. **Email Service:** Which email forwarding provider (SendGrid, Mailgun, etc.)?
5. **Authentication:** SSO requirements for KKR deployment?
6. **Storage:** Where to store uploaded PDF files (S3, Render Disk, etc.)?
7. **Database:** Postgres, MySQL, or other for production?