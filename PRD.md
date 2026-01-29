# Agreement Tracker — Product Requirements Document

## What Is Agreement Tracker?

Agreement Tracker is a tool for fund managers to organize and make sense of all the legal agreements they have with investors. Instead of digging through PDFs, spreadsheets, and emails to figure out "what fee rate does this investor actually get?", everything lives in one place.

---

## The Problem We're Solving

When you manage a fund, every investor can have different terms:
- One LP gets a management fee discount after year 4
- Another has co-investment rights in a side letter
- A third has MFN (most favored nation) protections

These terms are scattered across dozens of documents—side letters, subscription agreements, amendments. Figuring out which terms actually apply to a specific investor is a nightmare. Agreement Tracker fixes that.

---

## Who Uses This?

| Role | What they do with it |
|------|---------------------|
| **Investor Relations** | Look up investor profiles, see what terms apply |
| **Legal/Compliance** | Upload agreements, tag the important clauses |
| **Finance** | Model fee calculations, understand who gets discounts |

---

## Main Features

### 1. Investor Directory

Keep track of all your investors in one place:
- Name and type (LP, Family Office, Institutional, etc.)
- How much they've committed and to which fund
- Relationship notes ("Has side letter," "Co-invest rights," etc.)
- Internal notes for your team

You can search and filter to quickly find who you're looking for.

### 2. Agreements & Documents

This is where you manage the actual legal documents:

**Create an agreement** by entering:
- What it's called
- Which investor and fund it's for
- What type of document (Side Letter, Amendment, Subscription Agreement, etc.)
- When it became effective
- Whether it replaces an older agreement

**Add clauses** to each agreement:
- Tag the clause type (Management Fee, Carry, MFN, Fee Waiver, etc.)
- Paste the actual text from the document (so you always know where a term came from)
- Enter the structured details: rate, threshold, discount

You can also upload the original file for reference.

### 3. Effective Terms View

This is the magic part. Select an investor, and Agreement Tracker figures out which clause "wins" for each term type.

**How it decides:**
1. Later documents override earlier ones
2. Some document types take priority (Amendments > Side Letters > Subscription Agreements > PPM)

So if an investor has a fee rate in their original subscription agreement but a later side letter gives them a discount, the side letter wins.

### 4. Fee Logic View

Model out fee calculations with scenario testing:
- Set up fee rules with base rates, tier thresholds, and discounts
- Adjust the commitment amount to see how fees change
- See the annual fee impact in real dollars
- Click any number to see the source clause it came from

---

## How It Works (Behind the Scenes)

The app has three layers:
- **Frontend**: A simple web interface that works right in your browser
- **Backend API**: Handles data storage and the "effective terms" calculations
- **Database**: Stores everything—investors, funds, agreements, clauses, terms

Data can be stored locally in your browser for quick demos, or in a proper database for production use.

---

## Current State & Limitations

This is an MVP (minimum viable product). Here's what's working and what's not yet:

**Working:**
- Full investor and agreement management
- Clause extraction and tagging
- Effective terms calculation
- Fee scenario modeling
- File uploads
- Demo mode with sample data

**Not yet implemented:**
- Real user accounts and login (currently uses demo credentials)
- Automatic document parsing (clauses are entered manually)
- Team collaboration features
- Email integration for automatic agreement capture
- Audit trail and change history

---

## Sample Data

The app comes preloaded with mock data so you can see how it works:

- **Mock Capital LP**: $250M commitment with a side letter giving them a 0.25% management fee discount starting in year 4
- **Atlas Family Office**: $75M commitment with co-investment rights and MFN protection

Click "Reset demo data" to restore these examples, or "Clear mock data" to start fresh.

---

## Quick Start

1. Open the app
2. Sign in with: `demo@agreement-tracker.com` / `Demo123!`
3. Explore the three tabs:
   - **Investor Directory** — see who's in the fund
   - **Agreements & Documents** — view agreements and their clauses
   - **Fee Logic View** — play with fee scenarios

---

*This document reflects the current state of Agreement Tracker as of January 2026.*
