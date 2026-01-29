import os
import jwt
from datetime import datetime, timedelta, date
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import config
from models import db, User, Investor, Document, Clause
from terms_engine import calculate_effective_terms
from extraction_service import extract_clauses, mock_extract_clauses


def parse_date(date_string):
    """Parse a date string to a Python date object."""
    if not date_string:
        return None
    if isinstance(date_string, date):
        return date_string
    try:
        return datetime.strptime(date_string, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return None


def create_app(config_name=None):
    """Application factory."""
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "default")
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app)
    db.init_app(app)
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    # Register routes
    register_routes(app)
    
    return app


def token_required(f):
    """Decorator to require valid JWT token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization")
        
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        
        try:
            from flask import current_app
            data = jwt.decode(token, current_app.config["JWT_SECRET"], algorithms=["HS256"])
            request.user_email = data["email"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        
        return f(*args, **kwargs)
    return decorated


def register_routes(app):
    """Register all API routes."""
    
    # Health check
    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"ok": True, "message": "Agreement Tracker API is running"})
    
    # Authentication
    @app.route("/auth/login", methods=["POST"])
    def login():
        data = request.get_json() or {}
        email = data.get("email", "").strip()
        password = data.get("password", "")
        
        # Check demo credentials
        if email == app.config["DEMO_EMAIL"] and password == app.config["DEMO_PASSWORD"]:
            token = jwt.encode(
                {
                    "email": email,
                    "exp": datetime.utcnow() + timedelta(days=7)
                },
                app.config["JWT_SECRET"],
                algorithm="HS256"
            )
            return jsonify({
                "token": token,
                "user": {
                    "email": email,
                    "displayName": "Demo User"
                }
            })
        
        return jsonify({"error": "Invalid email or password"}), 401
    
    @app.route("/auth/me", methods=["GET"])
    @token_required
    def get_current_user():
        return jsonify({
            "email": request.user_email,
            "displayName": "Demo User"
        })
    
    # Investors
    @app.route("/investors", methods=["GET"])
    @token_required
    def list_investors():
        investors = Investor.query.order_by(Investor.created_at.desc()).all()
        return jsonify([inv.to_dict() for inv in investors])
    
    @app.route("/investors", methods=["POST"])
    @token_required
    def create_investor():
        data = request.get_json() or {}
        investor = Investor(
            name=data.get("name", "").strip() or "Unnamed Investor",
            investor_type=data.get("investorType", "LP"),
            commitment_amount=data.get("commitmentAmount"),
            currency=data.get("currency", "USD"),
            fund=data.get("fund", ""),
            relationship_notes=data.get("relationshipNotes", ""),
            internal_notes=data.get("internalNotes", ""),
        )
        db.session.add(investor)
        db.session.commit()
        return jsonify(investor.to_dict()), 201
    
    @app.route("/investors/<int:investor_id>", methods=["GET"])
    @token_required
    def get_investor(investor_id):
        investor = Investor.query.get_or_404(investor_id)
        return jsonify(investor.to_dict())
    
    @app.route("/investors/<int:investor_id>", methods=["PUT"])
    @token_required
    def update_investor(investor_id):
        investor = Investor.query.get_or_404(investor_id)
        data = request.get_json() or {}
        
        if "name" in data:
            investor.name = data["name"].strip()
        if "investorType" in data:
            investor.investor_type = data["investorType"]
        if "commitmentAmount" in data:
            investor.commitment_amount = data["commitmentAmount"]
        if "currency" in data:
            investor.currency = data["currency"]
        if "fund" in data:
            investor.fund = data["fund"]
        if "relationshipNotes" in data:
            investor.relationship_notes = data["relationshipNotes"]
        if "internalNotes" in data:
            investor.internal_notes = data["internalNotes"]
        
        db.session.commit()
        return jsonify(investor.to_dict())
    
    @app.route("/investors/<int:investor_id>", methods=["DELETE"])
    @token_required
    def delete_investor(investor_id):
        investor = Investor.query.get_or_404(investor_id)
        db.session.delete(investor)
        db.session.commit()
        return "", 204
    
    # Documents
    @app.route("/documents", methods=["GET"])
    @token_required
    def list_documents():
        investor_id = request.args.get("investorId")
        query = Document.query
        if investor_id:
            query = query.filter_by(investor_id=investor_id)
        documents = query.order_by(Document.effective_date.desc().nullslast()).all()
        return jsonify([doc.to_dict() for doc in documents])
    
    @app.route("/documents", methods=["POST"])
    @token_required
    def create_document():
        data = request.get_json() or {}
        doc_type = data.get("docType", "Side Letter")
        
        # Validate investor exists
        investor_id = data.get("investorId")
        if investor_id:
            investor = Investor.query.get(investor_id)
            if not investor:
                return jsonify({"error": "Investor not found"}), 404
        
        document = Document(
            investor_id=investor_id,
            title=data.get("title", "").strip() or "Untitled Document",
            doc_type=doc_type,
            status=data.get("status", "Active"),
            effective_date=parse_date(data.get("effectiveDate")),
            supersedes_id=data.get("supersedesId"),
            priority=data.get("priority") or derive_priority(doc_type),
            source_text=data.get("sourceText"),
            file_name=data.get("fileName"),
            file_url=data.get("fileUrl"),
        )
        db.session.add(document)
        db.session.commit()
        return jsonify(document.to_dict()), 201
    
    @app.route("/documents/<int:document_id>", methods=["GET"])
    @token_required
    def get_document(document_id):
        document = Document.query.get_or_404(document_id)
        return jsonify(document.to_dict())
    
    @app.route("/documents/<int:document_id>", methods=["DELETE"])
    @token_required
    def delete_document(document_id):
        document = Document.query.get_or_404(document_id)
        db.session.delete(document)
        db.session.commit()
        return "", 204
    
    # Clauses
    @app.route("/documents/<int:document_id>/clauses", methods=["POST"])
    @token_required
    def create_clause(document_id):
        Document.query.get_or_404(document_id)
        data = request.get_json() or {}
        
        clause = Clause(
            document_id=document_id,
            clause_type=data.get("clauseType", "Other"),
            clause_text=data.get("clauseText", ""),
            rate=data.get("rate"),
            threshold=data.get("threshold"),
            threshold_amount=data.get("thresholdAmount"),
            discount=data.get("discount"),
            effective_date=parse_date(data.get("effectiveDate")),
            notes=data.get("notes"),
            page_number=data.get("pageNumber"),
            section_ref=data.get("sectionRef"),
        )
        db.session.add(clause)
        db.session.commit()
        return jsonify(clause.to_dict()), 201
    
    @app.route("/clauses/<int:clause_id>", methods=["GET"])
    @token_required
    def get_clause(clause_id):
        clause = Clause.query.get_or_404(clause_id)
        return jsonify(clause.to_dict())
    
    @app.route("/clauses/<int:clause_id>", methods=["PUT"])
    @token_required
    def update_clause(clause_id):
        clause = Clause.query.get_or_404(clause_id)
        data = request.get_json() or {}
        
        if "clauseType" in data:
            clause.clause_type = data["clauseType"]
        if "clauseText" in data:
            clause.clause_text = data["clauseText"]
        if "rate" in data:
            clause.rate = data["rate"]
        if "threshold" in data:
            clause.threshold = data["threshold"]
        if "thresholdAmount" in data:
            clause.threshold_amount = data["thresholdAmount"]
        if "discount" in data:
            clause.discount = data["discount"]
        if "effectiveDate" in data:
            clause.effective_date = parse_date(data["effectiveDate"])
        if "notes" in data:
            clause.notes = data["notes"]
        if "pageNumber" in data:
            clause.page_number = data["pageNumber"]
        if "sectionRef" in data:
            clause.section_ref = data["sectionRef"]
        
        db.session.commit()
        return jsonify(clause.to_dict())
    
    @app.route("/clauses/<int:clause_id>", methods=["DELETE"])
    @token_required
    def delete_clause(clause_id):
        clause = Clause.query.get_or_404(clause_id)
        db.session.delete(clause)
        db.session.commit()
        return "", 204
    
    # Effective Terms
    @app.route("/investors/<int:investor_id>/effective-terms", methods=["GET"])
    @token_required
    def get_effective_terms(investor_id):
        """Get calculated effective terms for an investor."""
        # Verify investor exists
        Investor.query.get_or_404(investor_id)
        
        # Calculate effective terms
        result = calculate_effective_terms(investor_id)
        return jsonify(result)
    
    # Demo Data Management
    @app.route("/demo/seed", methods=["POST"])
    @token_required
    def seed_demo_data():
        """Seed the database with demo data for presentation."""
        created = seed_demo_investors()
        return jsonify({
            "message": "Demo data seeded successfully",
            "created": created
        })
    
    @app.route("/demo/clear", methods=["POST"])
    @token_required
    def clear_demo_data():
        """Clear all data from the database."""
        # Delete in order to handle foreign keys
        Clause.query.delete()
        Document.query.delete()
        Investor.query.delete()
        db.session.commit()
        return jsonify({"message": "All data cleared successfully"})
    
    # AI Extraction
    @app.route("/extract", methods=["POST"])
    @token_required
    def extract_from_text():
        """Extract clauses from document text using AI."""
        data = request.get_json() or {}
        text = data.get("text", "")
        use_mock = data.get("mock", False)
        
        if not text or len(text.strip()) < 50:
            return jsonify({"error": "Document text is too short (minimum 50 characters)"}), 400
        
        if len(text) > 100000:
            return jsonify({"error": "Document text is too long (maximum 100,000 characters)"}), 400
        
        try:
            if use_mock:
                result = mock_extract_clauses(text)
            else:
                result = extract_clauses(text)
                # Fall back to mock if AI fails
                if "error" in result and not result.get("clauses"):
                    mock_result = mock_extract_clauses(text)
                    mock_result["ai_error"] = result.get("error")
                    result = mock_result
            
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": f"Extraction failed: {str(e)}"}), 500
    
    @app.route("/extract/apply", methods=["POST"])
    @token_required
    def apply_extraction():
        """Apply extracted clauses to a document."""
        data = request.get_json() or {}
        document_id = data.get("documentId")
        clauses = data.get("clauses", [])
        source_text = data.get("sourceText")  # Save the source text for highlighting
        
        if not document_id:
            return jsonify({"error": "documentId is required"}), 400
        
        document = Document.query.get_or_404(document_id)
        
        # Save the source text to the document if provided
        if source_text:
            document.source_text = source_text
        
        created_clauses = []
        
        for clause_data in clauses:
            # Skip if not approved or low confidence
            if not clause_data.get("approved", True):
                continue
            
            clause = Clause(
                document_id=document_id,
                clause_type=clause_data.get("clause_type", "Other"),
                rate=clause_data.get("rate"),
                threshold=clause_data.get("threshold"),
                threshold_amount=clause_data.get("threshold_amount"),
                discount=clause_data.get("discount"),
                effective_date=parse_date(clause_data.get("effective_date")),
                section_ref=clause_data.get("section_ref"),
                page_number=clause_data.get("page_number"),
                clause_text=clause_data.get("clause_text"),
                notes=clause_data.get("notes", "")
            )
            db.session.add(clause)
            created_clauses.append(clause)
        
        db.session.commit()
        
        # Refresh the document to get the updated data with all clauses
        db.session.refresh(document)
        
        return jsonify({
            "message": f"Created {len(created_clauses)} clauses",
            "clauses": [c.to_dict() for c in created_clauses],
            "document": document.to_dict()  # Return full document with sourceText
        })


def seed_demo_investors():
    """Create demo investors with documents and clauses."""
    created = {"investors": 0, "documents": 0, "clauses": 0}
    
    # Sample document texts
    SAMPLE_PPM_TEXT = """PRIVATE PLACEMENT MEMORANDUM

MOCK FUND I, LP

Confidential Private Placement Memorandum dated January 1, 2024.

SECTION 6. MANAGEMENT FEE AND EXPENSES

6.1 Management Fee. The Management Fee shall be 2.00% per annum of each Limited Partner's Capital Commitment during the Investment Period. Following the Investment Period, the Management Fee shall be calculated based on invested capital.

6.2 Payment. The Management Fee shall be payable quarterly in advance.

6.3 Expenses. The Partnership shall bear all organizational expenses and operating expenses."""

    SAMPLE_SUBSCRIPTION_TEXT = """SUBSCRIPTION AGREEMENT

This Subscription Agreement is entered into by and between the undersigned investor ("Limited Partner") and Mock Fund I GP, LLC ("General Partner").

SECTION 4. ACKNOWLEDGMENTS

4.1 PPM Review. The Limited Partner acknowledges receipt and review of the Private Placement Memorandum.

4.2 Management Fee. Limited Partner acknowledges the Management Fee as set forth in the PPM.

4.3 Commitment. The Limited Partner hereby commits to contribute capital as set forth in Schedule A."""

    SAMPLE_SIDE_LETTER_TEXT = """SIDE LETTER AGREEMENT

This Side Letter Agreement ("Agreement") is entered into as of February 1, 2024.

PARTIES:
- Mock Capital LP ("Limited Partner")
- Mock Fund I GP, LLC ("General Partner")

SECTION 3. MANAGEMENT FEE REDUCTION

3.1 Base Fee. The standard Management Fee is 2.00% per annum as set forth in the PPM.

3.2 Reduced Rate. Notwithstanding Section 6.1 of the PPM, the Management Fee payable by the Limited Partner shall be reduced to 1.75% per annum of the Capital Commitment.

3.3 Fee Step-Down. Beginning on the fourth anniversary of the final closing, the Management Fee shall be further reduced by 0.25% per annum.

SECTION 5. MOST FAVORED NATION

5.1 MFN Rights. If the Partnership enters into a side letter with any other Limited Partner granting more favorable economic terms, the Partnership shall promptly notify the Limited Partner and offer equivalent terms."""

    # ========================================
    # Mock Capital LP - Demonstrates Hierarchy
    # ========================================
    mock_capital = Investor(
        name="Mock Capital LP",
        investor_type="Limited Partner",
        commitment_amount=250000000,  # $250M
        currency="USD",
        fund="Mock Fund I",
        relationship_notes="Long-standing institutional investor. Key relationship.",
        internal_notes="Negotiated favorable terms due to anchor commitment."
    )
    db.session.add(mock_capital)
    db.session.flush()  # Get ID
    created["investors"] += 1
    
    # PPM (base document)
    ppm = Document(
        investor_id=mock_capital.id,
        title="Mock Fund I PPM",
        doc_type="PPM",
        status="Active",
        effective_date=date(2024, 1, 1),
        priority=derive_priority("PPM"),
        source_text=SAMPLE_PPM_TEXT
    )
    db.session.add(ppm)
    db.session.flush()
    created["documents"] += 1
    
    # PPM clause - Base management fee
    ppm_fee = Clause(
        document_id=ppm.id,
        clause_type="Management Fee",
        rate=2.0,
        section_ref="6.1",
        page_number=42,
        clause_text="The Management Fee shall be 2.00% per annum of each Limited Partner's Capital Commitment during the Investment Period.",
        notes="Standard PPM rate"
    )
    db.session.add(ppm_fee)
    created["clauses"] += 1
    
    # Subscription Agreement
    sub_agreement = Document(
        investor_id=mock_capital.id,
        title="Mock Capital Subscription Agreement",
        doc_type="Subscription Agreement",
        status="Active",
        effective_date=date(2024, 1, 15),
        priority=derive_priority("Subscription Agreement"),
        source_text=SAMPLE_SUBSCRIPTION_TEXT
    )
    db.session.add(sub_agreement)
    db.session.flush()
    created["documents"] += 1
    
    # Subscription clause - confirms PPM rate
    sub_fee = Clause(
        document_id=sub_agreement.id,
        clause_type="Management Fee",
        rate=2.0,
        section_ref="4.2",
        page_number=8,
        clause_text="Limited Partner acknowledges the Management Fee as set forth in the PPM.",
        notes="References PPM terms"
    )
    db.session.add(sub_fee)
    created["clauses"] += 1
    
    # Side Letter (overrides subscription)
    side_letter = Document(
        investor_id=mock_capital.id,
        title="Mock Capital Side Letter",
        doc_type="Side Letter",
        status="Active",
        effective_date=date(2024, 2, 1),
        priority=derive_priority("Side Letter"),
        source_text=SAMPLE_SIDE_LETTER_TEXT
    )
    db.session.add(side_letter)
    db.session.flush()
    created["documents"] += 1
    
    # Side Letter clause - Reduced management fee
    sl_fee = Clause(
        document_id=side_letter.id,
        clause_type="Management Fee",
        rate=1.75,
        section_ref="3.2",
        page_number=2,
        clause_text="Notwithstanding Section 6.1 of the PPM, the Management Fee payable by the Limited Partner shall be reduced to 1.75% per annum of the Capital Commitment.",
        notes="Negotiated reduction for anchor investor"
    )
    db.session.add(sl_fee)
    created["clauses"] += 1
    
    # Side Letter clause - Fee step-down
    sl_stepdown = Clause(
        document_id=side_letter.id,
        clause_type="Fee Step-Down",
        discount=0.25,
        threshold="Year 4",
        section_ref="3.3",
        page_number=2,
        clause_text="Beginning on the fourth anniversary of the final closing, the Management Fee shall be further reduced by 0.25% per annum.",
        notes="Time-based reduction"
    )
    db.session.add(sl_stepdown)
    created["clauses"] += 1
    
    # Side Letter clause - MFN
    sl_mfn = Clause(
        document_id=side_letter.id,
        clause_type="MFN (Most Favored Nation)",
        section_ref="5.1",
        page_number=3,
        clause_text="If the Partnership enters into a side letter with any other Limited Partner granting more favorable economic terms, the Partnership shall promptly notify the Limited Partner and offer equivalent terms.",
        notes="Full MFN protection"
    )
    db.session.add(sl_mfn)
    created["clauses"] += 1
    
    # ========================================
    # Atlas Family Office - Multiple Clause Types
    # ========================================
    ATLAS_SUBSCRIPTION_TEXT = """SUBSCRIPTION AGREEMENT

ATLAS FAMILY OFFICE

This Subscription Agreement is entered into as of March 1, 2024.

SECTION 4. TERMS AND CONDITIONS

4.1 Capital Commitment. The Limited Partner commits to contribute $75,000,000.

4.2 Management Fee. The Management Fee shall be as set forth in the PPM.

4.3 Investment Period. The Investment Period shall be five years from the final closing."""

    ATLAS_SIDE_LETTER_TEXT = """SIDE LETTER AGREEMENT

This Side Letter Agreement is entered into as of March 15, 2024.

PARTIES:
- Atlas Family Office ("Limited Partner")
- Mock Fund I GP, LLC ("General Partner")

SECTION 4. CO-INVESTMENT RIGHTS

4.1 Co-Investment. The Limited Partner shall have the right to participate in co-investment opportunities alongside the Fund on a no-fee, no-carry basis, subject to allocation procedures determined by the General Partner.

SECTION 5. MOST FAVORED NATION

5.1 MFN Rights. The Limited Partner shall be entitled to receive the benefit of any more favorable terms granted to other Limited Partners with respect to management fees or carried interest.

SECTION 6. PREFERRED RETURN

6.1 Hurdle Rate. The Limited Partner shall receive a preferred return of 8% per annum, compounded annually, before any carried interest is payable to the General Partner."""

    atlas = Investor(
        name="Atlas Family Office",
        investor_type="Family Office",
        commitment_amount=75000000,  # $75M
        currency="USD",
        fund="Mock Fund I",
        relationship_notes="Multi-generational family office. Focus on alternative investments.",
        internal_notes="Interested in co-investment opportunities."
    )
    db.session.add(atlas)
    db.session.flush()
    created["investors"] += 1
    
    # Subscription Agreement for Atlas
    atlas_sub = Document(
        investor_id=atlas.id,
        title="Atlas Family Office Subscription Agreement",
        doc_type="Subscription Agreement",
        status="Active",
        effective_date=date(2024, 3, 1),
        priority=derive_priority("Subscription Agreement"),
        source_text=ATLAS_SUBSCRIPTION_TEXT
    )
    db.session.add(atlas_sub)
    db.session.flush()
    created["documents"] += 1
    
    # Atlas subscription - standard fee
    atlas_sub_fee = Clause(
        document_id=atlas_sub.id,
        clause_type="Management Fee",
        rate=2.0,
        section_ref="4.2",
        page_number=8,
        clause_text="The Management Fee shall be as set forth in the PPM.",
        notes="Standard terms"
    )
    db.session.add(atlas_sub_fee)
    created["clauses"] += 1
    
    # Side Letter for Atlas
    atlas_sl = Document(
        investor_id=atlas.id,
        title="Atlas Family Office Side Letter",
        doc_type="Side Letter",
        status="Active",
        effective_date=date(2024, 3, 15),
        priority=derive_priority("Side Letter"),
        source_text=ATLAS_SIDE_LETTER_TEXT
    )
    db.session.add(atlas_sl)
    db.session.flush()
    created["documents"] += 1
    
    # Atlas - Co-investment rights
    atlas_coinvest = Clause(
        document_id=atlas_sl.id,
        clause_type="Co-investment Rights",
        section_ref="4.1",
        page_number=2,
        clause_text="The Limited Partner shall have the right to participate in co-investment opportunities alongside the Fund on a no-fee, no-carry basis, subject to allocation procedures determined by the General Partner.",
        notes="Priority co-investment rights"
    )
    db.session.add(atlas_coinvest)
    created["clauses"] += 1
    
    # Atlas - MFN protection
    atlas_mfn = Clause(
        document_id=atlas_sl.id,
        clause_type="MFN (Most Favored Nation)",
        section_ref="5.1",
        page_number=3,
        clause_text="The Limited Partner shall be entitled to receive the benefit of any more favorable terms granted to other Limited Partners with respect to management fees or carried interest.",
        notes="Economic MFN only"
    )
    db.session.add(atlas_mfn)
    created["clauses"] += 1
    
    # Atlas - Preferred return
    atlas_pref = Clause(
        document_id=atlas_sl.id,
        clause_type="Preferred Return",
        rate=8.0,
        section_ref="6.1",
        page_number=4,
        clause_text="The Limited Partner shall receive a preferred return of 8% per annum, compounded annually, before any carried interest is payable to the General Partner.",
        notes="Standard hurdle rate"
    )
    db.session.add(atlas_pref)
    created["clauses"] += 1
    
    # ========================================
    # Meridian Pension Fund - Large Institutional
    # ========================================
    MERIDIAN_SUBSCRIPTION_TEXT = """SUBSCRIPTION AGREEMENT

MERIDIAN PENSION FUND

This Subscription Agreement is entered into as of June 1, 2024.

SECTION 4. TERMS AND CONDITIONS

4.1 Capital Commitment. The Limited Partner commits to contribute $500,000,000 to Mock Fund II.

4.2 Management Fee. In recognition of the Limited Partner's substantial commitment, the Management Fee shall be 1.50% per annum.

4.3 Governance. All material amendments require board approval from the Limited Partner."""

    MERIDIAN_SIDE_LETTER_TEXT = """SIDE LETTER AGREEMENT

This Side Letter Agreement is entered into as of June 15, 2024.

PARTIES:
- Meridian Pension Fund ("Limited Partner")
- Mock Fund II GP, LLC ("General Partner")

SECTION 3. FEE ARRANGEMENTS

3.1 Volume Discount. As the Limited Partner's Capital Commitment equals or exceeds $500,000,000, the Management Fee shall be further reduced by 0.25%.

SECTION 7. CARRIED INTEREST

7.1 Standard Carry. The standard carried interest is 20% of net profits.

7.2 Reduced Carry. The Carried Interest payable to the General Partner shall be reduced to 15% (from the standard 20%) of net profits."""

    meridian = Investor(
        name="Meridian Pension Fund",
        investor_type="Pension Fund",
        commitment_amount=500000000,  # $500M
        currency="USD",
        fund="Mock Fund II",
        relationship_notes="State pension fund. Strict governance requirements.",
        internal_notes="Largest LP in Fund II. Board approval required for all amendments."
    )
    db.session.add(meridian)
    db.session.flush()
    created["investors"] += 1
    
    # Meridian Subscription
    meridian_sub = Document(
        investor_id=meridian.id,
        title="Meridian Pension Fund Subscription Agreement",
        doc_type="Subscription Agreement",
        status="Active",
        effective_date=date(2024, 6, 1),
        priority=derive_priority("Subscription Agreement"),
        source_text=MERIDIAN_SUBSCRIPTION_TEXT
    )
    db.session.add(meridian_sub)
    db.session.flush()
    created["documents"] += 1
    
    # Meridian - Management fee
    meridian_fee = Clause(
        document_id=meridian_sub.id,
        clause_type="Management Fee",
        rate=1.5,
        section_ref="4.2",
        page_number=12,
        clause_text="In recognition of the Limited Partner's substantial commitment, the Management Fee shall be 1.50% per annum.",
        notes="Reduced fee for large commitment"
    )
    db.session.add(meridian_fee)
    created["clauses"] += 1
    
    # Meridian Side Letter
    meridian_sl = Document(
        investor_id=meridian.id,
        title="Meridian Pension Fund Side Letter",
        doc_type="Side Letter",
        status="Active",
        effective_date=date(2024, 6, 15),
        priority=derive_priority("Side Letter"),
        source_text=MERIDIAN_SIDE_LETTER_TEXT
    )
    db.session.add(meridian_sl)
    db.session.flush()
    created["documents"] += 1
    
    # Meridian - Fee waiver/discount
    meridian_waiver = Clause(
        document_id=meridian_sl.id,
        clause_type="Fee Waiver/Discount",
        discount=0.25,
        threshold="Commitment >= $500M",
        section_ref="3.1",
        page_number=1,
        clause_text="As the Limited Partner's Capital Commitment equals or exceeds $500,000,000, the Management Fee shall be further reduced by 0.25%.",
        notes="Volume discount"
    )
    db.session.add(meridian_waiver)
    created["clauses"] += 1
    
    # Meridian - Carry terms
    meridian_carry = Clause(
        document_id=meridian_sl.id,
        clause_type="Carry Terms",
        rate=15.0,
        section_ref="7.2",
        page_number=5,
        clause_text="The Carried Interest payable to the General Partner shall be reduced to 15% (from the standard 20%) of net profits.",
        notes="Reduced carry for anchor LP"
    )
    db.session.add(meridian_carry)
    created["clauses"] += 1
    
    db.session.commit()
    return created


def derive_priority(doc_type):
    """Derive document priority based on type."""
    priority_map = {
        "Amendment": 4,
        "Side Letter": 3,
        "Fee Schedule": 3,
        "Subscription Agreement": 2,
        "PPM": 1,
    }
    return priority_map.get(doc_type, 1)


# Create app instance for Gunicorn
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)
