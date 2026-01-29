# Agreement Tracker - Implementation Phases

This document breaks down the PRD into logical implementation phases. Each phase builds on the previous one and delivers testable, demonstrable value.

---

## Phase 1: Foundation & Project Setup

**Goal:** Establish the technical foundation and core data model.

**Deliverables:**
- [ ] Project structure (React + TypeScript frontend, Python/Flask backend)
- [ ] Database schema design and setup (PostgreSQL)
- [ ] Basic authentication with demo mode login
- [ ] UI shell with three-tab navigation structure:
  - Investor Directory (empty)
  - Agreements & Documents (empty)
  - Fee Logic View (empty)
- [ ] Render deployment configuration
- [ ] Basic styling/design system setup

**Database Tables:**
- `users` - Authentication
- `investors` - Core investor data
- `documents` - Agreement metadata
- `clauses` - Extracted clause data

**Definition of Done:** App deploys to Render, demo login works, three tabs visible (empty content).

---

## Phase 2: Investor Directory (CRUD)

**Goal:** Build the core investor management functionality.

**Deliverables:**
- [ ] Investor list view with search and filter
- [ ] Investor detail view/profile page
- [ ] Create new investor form
- [ ] Edit investor functionality
- [ ] Delete investor (with confirmation)

**Data Fields:**
- Investor name
- Investor type (LP, Family Office, Institutional, etc.)
- Commitment amount
- Fund vehicle
- Relationship notes
- Internal team notes

**Definition of Done:** Users can create, view, edit, delete, and search investors.

---

## Phase 3: Document Management

**Goal:** Enable document upload and association with investors.

**Deliverables:**
- [ ] Document upload interface (file upload)
- [ ] Document metadata entry form:
  - Document title/name
  - Associated investor (dropdown)
  - Associated fund
  - Document type (Side Letter, Amendment, Subscription Agreement, PPM)
  - Effective date
  - Supersedes relationship (optional - which older doc it replaces)
- [ ] Document list view (all documents)
- [ ] Documents-per-investor view (on investor profile)
- [ ] PDF storage (Render Disk or S3)
- [ ] PDF viewer/download capability

**Definition of Done:** Users can upload PDFs, attach metadata, associate with investors, and view uploaded documents.

---

## Phase 4: Clause Management & Data Entry

**Goal:** Enable manual clause extraction and entry.

**Deliverables:**
- [ ] Clause entry form per document
- [ ] Clause type selection:
  - Management Fee
  - Carry Terms
  - MFN (Most Favored Nation)
  - Fee Waiver/Discount
  - Co-investment Rights
  - Other/Custom
- [ ] Structured data fields per clause type:
  - Rate/percentage
  - Threshold amounts
  - Discount values
  - Effective dates
  - Duration/time-based conditions
- [ ] Full clause text field (copy from document)
- [ ] Per-document clause list view
- [ ] Edit/delete clauses

**Definition of Done:** Users can manually enter multiple clauses per document with structured data and full text.

---

## Phase 5: Effective Terms Engine

**Goal:** Implement the "magic" - automatic conflict resolution across documents.

**Deliverables:**
- [ ] Document hierarchy logic implementation:
  1. Amendments (highest priority)
  2. Side Letters
  3. Side Letters
  4. Subscription Agreements
  5. PPM (lowest priority)
- [ ] Date-based resolution (when types are equal, most recent wins)
- [ ] Supersedes relationship handling
- [ ] Effective Terms calculation engine
- [ ] Effective Terms display view per investor:
  - Show "winning" clause for each term type
  - Indicate which document provided each term
  - Show competing clauses that were overridden
- [ ] Visual indicators for term sources

**Definition of Done:** When viewing an investor, users see the final "effective" terms after all hierarchy rules are applied, with visibility into which document each term came from.

---

## Phase 6: Fee Calculator (Basic)

**Goal:** Enable fee modeling and scenario testing.

**Deliverables:**
- [ ] Fee Logic View interface
- [ ] Investor selection (pulls effective terms)
- [ ] Fee rule display:
  - Base management fee rate
  - Applicable discounts
  - Time-based changes
- [ ] Commitment amount slider/input for scenario testing
- [ ] Real-time fee calculation display:
  - Annual fee in dollars
  - Fee breakdown by tier (if applicable)
  - Before/after discount views
- [ ] Custom parameter mode (not tied to specific investor)

**Definition of Done:** Users can select an investor (or enter custom params), adjust commitment amount, and see calculated annual fees update in real-time.

---

## Phase 7: Demo Data & MVP Polish

**Goal:** Prepare for demo with realistic sample data and polished UX.

**Deliverables:**
- [ ] Mock Capital LP:
  - $250M commitment
  - Subscription agreement with 1.0% management fee
  - Side letter with 0.25% fee discount starting year 4
  - Demonstrates hierarchy (side letter overrides subscription)
- [ ] Atlas Family Office:
  - $75M commitment
  - Co-investment rights clause
  - MFN protection clause
  - Demonstrates multiple clause types
- [ ] "Reset demo data" button
- [ ] "Clear mock data" button
- [ ] UI polish:
  - Loading states
  - Error handling
  - Empty states
  - Responsive design
- [ ] Demo walkthrough preparation

**Definition of Done:** Demo is ready to present to KKR with two realistic investor scenarios demonstrating core value proposition.

---

## Phase 8: Citation & Source Tracking

**Goal:** Every value traceable back to its source document.

**Deliverables:**
- [ ] Source location field for each clause (page number, section)
- [ ] Clickable values UI pattern:
  - Subtle visual indicator (underline/icon)
  - Hover shows preview tooltip
  - Click opens detailed popup
- [ ] Citation popup component:
  - Shows clause text
  - Shows document name and page
  - Link to open full document
- [ ] PDF highlighting (highlight relevant text when citation clicked)
- [ ] Citation indicators throughout:
  - Investor Directory effective terms
  - Fee Calculator values
  - Document detail views

**Definition of Done:** Users can click any fee, rate, or term value and see exactly which document clause it came from with highlighted source text.

---

## Phase 9: AI Extraction Engine

**Goal:** Automate clause extraction from uploaded documents.

**Deliverables:**
- [ ] AI integration (OpenAI GPT-4 or Claude)
- [ ] PDF text extraction pipeline
- [ ] Prompt engineering for legal document extraction:
  - Management fees
  - Fund information
  - Investment amounts
  - Effective terms/dates
  - Co-investment rights
  - MFN protections
  - Carry terms
  - Fee waivers/discounts
- [ ] Two-stage extraction:
  1. Extract data values
  2. Identify source location in document
- [ ] Auto-populate clause forms after upload
- [ ] User review/approval workflow for AI extractions
- [ ] Auto-suggest feature (gray text showing AI suggestions during manual entry)
- [ ] Confidence scores for extracted values

**Definition of Done:** When a document is uploaded, AI extracts key clauses with source citations, user reviews and approves before saving.

---

## Phase 10: Email Integration

**Goal:** Enable document ingestion via email forwarding.

**Deliverables:**
- [ ] Dedicated email address setup (e.g., contracts@agreement-tracker.com)
- [ ] Email service integration (SendGrid or Mailgun)
- [ ] Email parsing:
  - Extract PDF attachments
  - Extract timestamp from email metadata
  - Handle multiple attachments
- [ ] Automatic document creation from email
- [ ] Email sender notification/confirmation
- [ ] Document queue for processing
- [ ] Error handling for invalid emails

**Definition of Done:** Users can forward emails with PDF attachments; documents are automatically created with correct timestamps.

---

## Phase 11: Advanced Features

**Goal:** Enterprise-ready features and edge case handling.

**Deliverables:**
- [ ] Manual override system:
  - Override automatic conflict resolution
  - Flag overridden values
  - Document reason for override
  - Approval workflow (optional)
- [ ] Audit trail:
  - Log all changes to investors, documents, clauses
  - User attribution
  - Timestamp tracking
  - Change history view
- [ ] Advanced fee modeling:
  - Multiple scenario comparison
  - Export calculation summaries
  - Batch fee calculations
- [ ] Multi-fund support:
  - Fund entity management
  - Cross-fund investor views
  - Fund-specific fee rules

**Definition of Done:** System handles edge cases, maintains full audit trail, and supports complex multi-fund scenarios.

---

## Phase 12: Reporting & Analytics

**Goal:** Provide insights and operational metrics.

**Deliverables:**
- [ ] Dashboard with key metrics:
  - Total investors tracked
  - Total documents processed
  - AI extraction accuracy rate
  - Recent activity
- [ ] Investor reports:
  - Full terms summary export
  - Document history
  - Fee projection
- [ ] System health metrics:
  - Document processing time
  - Citation availability rate
  - User activity tracking
- [ ] Export capabilities (CSV, PDF reports)

**Definition of Done:** Users have visibility into system usage and can generate reports for stakeholders.

---

# Phase Summary & Dependencies

| Phase | Name | Dependencies | Estimated Effort |
|-------|------|--------------|------------------|
| 1 | Foundation & Setup | None | Foundation |
| 2 | Investor Directory | Phase 1 | Core |
| 3 | Document Management | Phases 1, 2 | Core |
| 4 | Clause Management | Phases 1-3 | Core |
| 5 | Effective Terms Engine | Phases 1-4 | Core |
| 6 | Fee Calculator | Phases 1-5 | Core |
| 7 | Demo Data & Polish | Phases 1-6 | MVP Complete |
| 8 | Citation System | Phases 1-6 | Enhancement |
| 9 | AI Extraction | Phases 1-4, 8 | Enhancement |
| 10 | Email Integration | Phases 1-4 | Enhancement |
| 11 | Advanced Features | Phases 1-7 | Enterprise |
| 12 | Reporting & Analytics | Phases 1-7 | Enterprise |

---

# Recommended Groupings

## MVP Demo (Phases 1-7)
Everything needed for the Thursday KKR demo. Manual data entry, hierarchy logic, fee calculations, sample data.

## Post-Demo Enhancement (Phases 8-10)
Citation system, AI extraction, and email integration. These add significant value but require more development time.

## Enterprise Ready (Phases 11-12)
Audit trails, manual overrides, advanced reporting. Required for production deployment at scale.

---

# Critical Path Notes

1. **Phase 5 (Effective Terms Engine) is the core differentiator** - This is the "magic" that makes the product valuable. Ensure adequate time for this.

2. **Phase 9 (AI Extraction) requires careful prompt engineering** - Legal documents are complex. Plan for iteration on extraction accuracy.

3. **Phases 8 and 9 are tightly coupled** - Citation system design should anticipate AI extraction needs.

4. **Demo data quality matters** - Phases 7's mock data should demonstrate the full value proposition clearly.

---

# Questions to Resolve Before Starting

1. **Database:** PostgreSQL hosted where? (Supabase, Railway, AWS RDS?)
2. **File Storage:** Render Disk vs S3 for PDFs?
3. **AI Provider:** OpenAI vs Anthropic for extraction?
4. **Email Service:** SendGrid vs Mailgun vs Postmark?
5. **Authentication:** Simple demo auth vs SSO for KKR?
6. **Domain:** Final product name and domain purchase?
