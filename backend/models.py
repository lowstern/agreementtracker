from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    """User model for authentication."""
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    display_name = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "displayName": self.display_name,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class Investor(db.Model):
    """Investor entity - LP, Family Office, etc."""
    __tablename__ = "investors"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    investor_type = db.Column(db.String(100))  # LP, Family Office, Institutional, etc.
    commitment_amount = db.Column(db.Numeric(18, 2))
    currency = db.Column(db.String(10), default="USD")
    fund = db.Column(db.String(255))
    relationship_notes = db.Column(db.Text)
    internal_notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    documents = db.relationship("Document", backref="investor", lazy=True, cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "investorType": self.investor_type,
            "commitmentAmount": float(self.commitment_amount) if self.commitment_amount else None,
            "currency": self.currency,
            "fund": self.fund,
            "relationshipNotes": self.relationship_notes,
            "internalNotes": self.internal_notes,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }


class Document(db.Model):
    """Agreement/document metadata."""
    __tablename__ = "documents"
    
    id = db.Column(db.Integer, primary_key=True)
    investor_id = db.Column(db.Integer, db.ForeignKey("investors.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    doc_type = db.Column(db.String(100))  # Side Letter, Amendment, Subscription Agreement, PPM
    status = db.Column(db.String(50), default="Active")  # Draft, Active, Superseded
    effective_date = db.Column(db.Date)
    supersedes_id = db.Column(db.Integer, db.ForeignKey("documents.id"), nullable=True)
    priority = db.Column(db.Integer, default=1)  # Higher = more authoritative
    file_name = db.Column(db.String(255))
    file_url = db.Column(db.String(500))
    source_text = db.Column(db.Text)  # Raw document text for display/highlighting
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    clauses = db.relationship("Clause", backref="document", lazy=True, cascade="all, delete-orphan")
    supersedes = db.relationship("Document", remote_side=[id], backref="superseded_by")
    
    def to_dict(self):
        return {
            "id": self.id,
            "investorId": self.investor_id,
            "title": self.title,
            "docType": self.doc_type,
            "status": self.status,
            "effectiveDate": self.effective_date.isoformat() if self.effective_date else None,
            "supersedesId": self.supersedes_id,
            "priority": self.priority,
            "fileName": self.file_name,
            "fileUrl": self.file_url,
            "sourceText": self.source_text,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
            "clauses": [clause.to_dict() for clause in self.clauses],
        }


class Clause(db.Model):
    """Extracted clause from a document."""
    __tablename__ = "clauses"
    
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey("documents.id"), nullable=False)
    clause_type = db.Column(db.String(100))  # Management Fee, Carry, MFN, Fee Waiver, etc.
    clause_text = db.Column(db.Text)  # Original text from document
    
    # Structured term fields
    rate = db.Column(db.Numeric(10, 4))  # Percentage rate
    threshold = db.Column(db.String(255))  # e.g., "Commitment >= $250M"
    threshold_amount = db.Column(db.Numeric(18, 2))
    discount = db.Column(db.Numeric(10, 4))  # Discount percentage
    effective_date = db.Column(db.Date)
    notes = db.Column(db.Text)
    
    # Source tracking
    page_number = db.Column(db.Integer)
    section_ref = db.Column(db.String(100))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "documentId": self.document_id,
            "clauseType": self.clause_type,
            "clauseText": self.clause_text,
            "rate": float(self.rate) if self.rate else None,
            "threshold": self.threshold,
            "thresholdAmount": float(self.threshold_amount) if self.threshold_amount else None,
            "discount": float(self.discount) if self.discount else None,
            "effectiveDate": self.effective_date.isoformat() if self.effective_date else None,
            "notes": self.notes,
            "pageNumber": self.page_number,
            "sectionRef": self.section_ref,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }
