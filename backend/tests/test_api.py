"""
Unit tests for Agreement Tracker API
Tests all CRUD endpoints for investors, documents, and clauses.
"""
import pytest
import json
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from models import db, User, Investor, Document, Clause


@pytest.fixture
def app():
    """Create application for testing."""
    app = create_app('testing')
    
    with app.app_context():
        db.create_all()
        # Create test user
        user = User(email='test@example.com', display_name='Test User')
        db.session.add(user)
        db.session.commit()
        
    yield app
    
    with app.app_context():
        db.drop_all()


@pytest.fixture
def client(app):
    """Create test client."""
    return app.test_client()


@pytest.fixture
def auth_headers(client):
    """Get authentication headers by logging in with demo credentials."""
    response = client.post('/auth/login', 
        data=json.dumps({'email': 'demo@agreement-tracker.com', 'password': 'Demo123!'}),
        content_type='application/json'
    )
    data = json.loads(response.data)
    return {'Authorization': f"Bearer {data['token']}", 'Content-Type': 'application/json'}


class TestHealthCheck:
    """Test health check endpoint."""
    
    def test_health_check(self, client):
        """Test that health check returns OK."""
        response = client.get('/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['ok'] is True
        assert 'message' in data


class TestAuthentication:
    """Test authentication endpoints."""
    
    def test_login_success(self, client):
        """Test successful login with demo credentials."""
        response = client.post('/auth/login',
            data=json.dumps({'email': 'demo@agreement-tracker.com', 'password': 'Demo123!'}),
            content_type='application/json'
        )
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'token' in data
        assert 'user' in data
        assert data['user']['email'] == 'demo@agreement-tracker.com'
    
    def test_login_invalid_credentials(self, client):
        """Test that invalid credentials return 401."""
        response = client.post('/auth/login',
            data=json.dumps({'email': 'wrong@example.com', 'password': 'wrongpass'}),
            content_type='application/json'
        )
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_get_current_user(self, client, auth_headers):
        """Test getting current user info."""
        response = client.get('/auth/me', headers=auth_headers)
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['email'] == 'demo@agreement-tracker.com'
    
    def test_unauthorized_without_token(self, client):
        """Test that protected endpoints require auth."""
        response = client.get('/investors')
        assert response.status_code == 401


class TestInvestorCRUD:
    """Test investor CRUD operations."""
    
    def test_create_investor(self, client, auth_headers):
        """Test creating a new investor."""
        investor_data = {
            'name': 'Mock Capital LP',
            'investorType': 'Limited Partner',
            'commitmentAmount': 50000000,
            'currency': 'USD',
            'fund': 'Mock Fund I',
            'relationshipNotes': 'Key investor relationship',
            'internalNotes': 'Internal notes here'
        }
        response = client.post('/investors',
            data=json.dumps(investor_data),
            headers=auth_headers
        )
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['name'] == 'Mock Capital LP'
        assert data['investorType'] == 'Limited Partner'
        assert data['commitmentAmount'] == 50000000
        assert data['currency'] == 'USD'
        assert 'id' in data
        assert 'createdAt' in data
    
    def test_list_investors(self, client, auth_headers):
        """Test listing all investors."""
        # Create some investors first
        for name in ['Investor A', 'Investor B', 'Investor C']:
            client.post('/investors',
                data=json.dumps({'name': name, 'investorType': 'LP'}),
                headers=auth_headers
            )
        
        response = client.get('/investors', headers=auth_headers)
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 3
        # Check that all investors are present (order may vary)
        names = [inv['name'] for inv in data]
        assert 'Investor A' in names
        assert 'Investor B' in names
        assert 'Investor C' in names
    
    def test_get_single_investor(self, client, auth_headers):
        """Test getting a single investor by ID."""
        # Create investor
        create_response = client.post('/investors',
            data=json.dumps({'name': 'Test Investor', 'investorType': 'Family Office'}),
            headers=auth_headers
        )
        investor_id = json.loads(create_response.data)['id']
        
        # Get investor
        response = client.get(f'/investors/{investor_id}', headers=auth_headers)
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['name'] == 'Test Investor'
        assert data['investorType'] == 'Family Office'
    
    def test_get_nonexistent_investor(self, client, auth_headers):
        """Test getting a non-existent investor returns 404."""
        response = client.get('/investors/99999', headers=auth_headers)
        assert response.status_code == 404
    
    def test_update_investor(self, client, auth_headers):
        """Test updating an investor."""
        # Create investor
        create_response = client.post('/investors',
            data=json.dumps({'name': 'Original Name', 'investorType': 'LP'}),
            headers=auth_headers
        )
        investor_id = json.loads(create_response.data)['id']
        
        # Update investor
        response = client.put(f'/investors/{investor_id}',
            data=json.dumps({
                'name': 'Updated Name',
                'commitmentAmount': 75000000
            }),
            headers=auth_headers
        )
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['name'] == 'Updated Name'
        assert data['commitmentAmount'] == 75000000
    
    def test_delete_investor(self, client, auth_headers):
        """Test deleting an investor."""
        # Create investor
        create_response = client.post('/investors',
            data=json.dumps({'name': 'To Delete', 'investorType': 'LP'}),
            headers=auth_headers
        )
        investor_id = json.loads(create_response.data)['id']
        
        # Delete investor
        response = client.delete(f'/investors/{investor_id}', headers=auth_headers)
        assert response.status_code == 204
        
        # Verify deleted
        get_response = client.get(f'/investors/{investor_id}', headers=auth_headers)
        assert get_response.status_code == 404


class TestDocumentCRUD:
    """Test document CRUD operations."""
    
    @pytest.fixture
    def investor(self, client, auth_headers):
        """Create a test investor for document tests."""
        response = client.post('/investors',
            data=json.dumps({'name': 'Doc Test Investor', 'investorType': 'LP'}),
            headers=auth_headers
        )
        return json.loads(response.data)
    
    def test_create_document(self, client, auth_headers, investor):
        """Test creating a new document."""
        doc_data = {
            'investorId': investor['id'],
            'title': 'Side Letter Agreement',
            'docType': 'Side Letter',
            'status': 'Active',
            'effectiveDate': '2024-02-01',
            'fileName': 'side_letter.pdf'
        }
        response = client.post('/documents',
            data=json.dumps(doc_data),
            headers=auth_headers
        )
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['title'] == 'Side Letter Agreement'
        assert data['docType'] == 'Side Letter'
        assert data['investorId'] == investor['id']
        assert data['priority'] == 3  # Side Letter priority
        assert 'id' in data
    
    def test_document_priority_assignment(self, client, auth_headers, investor):
        """Test that document priority is assigned based on type."""
        test_cases = [
            ('Amendment', 4),
            ('Side Letter', 3),
            ('Fee Schedule', 3),
            ('Subscription Agreement', 2),
            ('PPM', 1),
        ]
        
        for doc_type, expected_priority in test_cases:
            response = client.post('/documents',
                data=json.dumps({
                    'investorId': investor['id'],
                    'title': f'Test {doc_type}',
                    'docType': doc_type
                }),
                headers=auth_headers
            )
            data = json.loads(response.data)
            assert data['priority'] == expected_priority, f"Expected {expected_priority} for {doc_type}, got {data['priority']}"
    
    def test_list_documents(self, client, auth_headers, investor):
        """Test listing all documents."""
        # Create some documents
        for title in ['Doc A', 'Doc B', 'Doc C']:
            client.post('/documents',
                data=json.dumps({
                    'investorId': investor['id'],
                    'title': title,
                    'docType': 'Side Letter'
                }),
                headers=auth_headers
            )
        
        response = client.get('/documents', headers=auth_headers)
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 3
    
    def test_list_documents_by_investor(self, client, auth_headers, investor):
        """Test filtering documents by investor ID."""
        # Create another investor
        other_response = client.post('/investors',
            data=json.dumps({'name': 'Other Investor', 'investorType': 'LP'}),
            headers=auth_headers
        )
        other_investor = json.loads(other_response.data)
        
        # Create docs for both investors
        client.post('/documents',
            data=json.dumps({'investorId': investor['id'], 'title': 'Inv1 Doc', 'docType': 'Side Letter'}),
            headers=auth_headers
        )
        client.post('/documents',
            data=json.dumps({'investorId': other_investor['id'], 'title': 'Inv2 Doc', 'docType': 'PPM'}),
            headers=auth_headers
        )
        
        # Filter by investor
        response = client.get(f'/documents?investorId={investor["id"]}', headers=auth_headers)
        data = json.loads(response.data)
        assert len(data) == 1
        assert data[0]['title'] == 'Inv1 Doc'
    
    def test_get_single_document(self, client, auth_headers, investor):
        """Test getting a single document by ID."""
        create_response = client.post('/documents',
            data=json.dumps({
                'investorId': investor['id'],
                'title': 'Get Test Doc',
                'docType': 'Amendment'
            }),
            headers=auth_headers
        )
        doc_id = json.loads(create_response.data)['id']
        
        response = client.get(f'/documents/{doc_id}', headers=auth_headers)
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['title'] == 'Get Test Doc'
        assert 'clauses' in data
    
    def test_delete_document(self, client, auth_headers, investor):
        """Test deleting a document."""
        create_response = client.post('/documents',
            data=json.dumps({
                'investorId': investor['id'],
                'title': 'Delete Me',
                'docType': 'PPM'
            }),
            headers=auth_headers
        )
        doc_id = json.loads(create_response.data)['id']
        
        response = client.delete(f'/documents/{doc_id}', headers=auth_headers)
        assert response.status_code == 204
        
        get_response = client.get(f'/documents/{doc_id}', headers=auth_headers)
        assert get_response.status_code == 404


class TestClauseCRUD:
    """Test clause CRUD operations."""
    
    @pytest.fixture
    def document(self, client, auth_headers):
        """Create a test investor and document for clause tests."""
        inv_response = client.post('/investors',
            data=json.dumps({'name': 'Clause Test Investor', 'investorType': 'LP'}),
            headers=auth_headers
        )
        investor = json.loads(inv_response.data)
        
        doc_response = client.post('/documents',
            data=json.dumps({
                'investorId': investor['id'],
                'title': 'Clause Test Document',
                'docType': 'Side Letter'
            }),
            headers=auth_headers
        )
        return json.loads(doc_response.data)
    
    def test_create_clause(self, client, auth_headers, document):
        """Test creating a new clause."""
        clause_data = {
            'clauseType': 'Management Fee',
            'clauseText': 'The management fee shall be 1.75% per annum.',
            'rate': 1.75,
            'sectionRef': '3.2',
            'pageNumber': 5
        }
        response = client.post(f'/documents/{document["id"]}/clauses',
            data=json.dumps(clause_data),
            headers=auth_headers
        )
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['clauseType'] == 'Management Fee'
        assert data['rate'] == 1.75
        assert data['sectionRef'] == '3.2'
        assert data['pageNumber'] == 5
        assert data['documentId'] == document['id']
    
    def test_create_clause_with_all_fields(self, client, auth_headers, document):
        """Test creating a clause with all structured fields."""
        clause_data = {
            'clauseType': 'Fee Waiver/Discount',
            'clauseText': 'Fee reduced for commitments over $25M.',
            'rate': 2.0,
            'discount': 0.25,
            'threshold': 'Commitment >= $25M',
            'thresholdAmount': 25000000,
            'effectiveDate': '2024-01-01',
            'notes': 'Applies to first year only',
            'sectionRef': '4.1',
            'pageNumber': 8
        }
        response = client.post(f'/documents/{document["id"]}/clauses',
            data=json.dumps(clause_data),
            headers=auth_headers
        )
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['rate'] == 2.0
        assert data['discount'] == 0.25
        assert data['threshold'] == 'Commitment >= $25M'
        assert data['thresholdAmount'] == 25000000
        assert data['effectiveDate'] == '2024-01-01'
        assert data['notes'] == 'Applies to first year only'
    
    def test_get_clause(self, client, auth_headers, document):
        """Test getting a single clause by ID."""
        # Create clause
        create_response = client.post(f'/documents/{document["id"]}/clauses',
            data=json.dumps({
                'clauseType': 'Carry Terms',
                'rate': 20.0
            }),
            headers=auth_headers
        )
        clause_id = json.loads(create_response.data)['id']
        
        response = client.get(f'/clauses/{clause_id}', headers=auth_headers)
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['clauseType'] == 'Carry Terms'
        assert data['rate'] == 20.0
    
    def test_update_clause(self, client, auth_headers, document):
        """Test updating a clause."""
        # Create clause
        create_response = client.post(f'/documents/{document["id"]}/clauses',
            data=json.dumps({
                'clauseType': 'Management Fee',
                'rate': 2.0
            }),
            headers=auth_headers
        )
        clause_id = json.loads(create_response.data)['id']
        
        # Update clause
        response = client.put(f'/clauses/{clause_id}',
            data=json.dumps({
                'rate': 1.5,
                'threshold': 'Year 4+',
                'notes': 'Updated rate'
            }),
            headers=auth_headers
        )
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['rate'] == 1.5
        assert data['threshold'] == 'Year 4+'
        assert data['notes'] == 'Updated rate'
        assert data['clauseType'] == 'Management Fee'  # Unchanged
    
    def test_delete_clause(self, client, auth_headers, document):
        """Test deleting a clause."""
        # Create clause
        create_response = client.post(f'/documents/{document["id"]}/clauses',
            data=json.dumps({'clauseType': 'MFN'}),
            headers=auth_headers
        )
        clause_id = json.loads(create_response.data)['id']
        
        # Delete clause
        response = client.delete(f'/clauses/{clause_id}', headers=auth_headers)
        assert response.status_code == 204
        
        # Verify deleted
        get_response = client.get(f'/clauses/{clause_id}', headers=auth_headers)
        assert get_response.status_code == 404
    
    def test_clauses_included_in_document(self, client, auth_headers, document):
        """Test that clauses are included when fetching a document."""
        # Create multiple clauses
        for clause_type in ['Management Fee', 'Carry Terms', 'MFN (Most Favored Nation)']:
            client.post(f'/documents/{document["id"]}/clauses',
                data=json.dumps({'clauseType': clause_type}),
                headers=auth_headers
            )
        
        # Get document
        response = client.get(f'/documents/{document["id"]}', headers=auth_headers)
        data = json.loads(response.data)
        assert 'clauses' in data
        assert len(data['clauses']) == 3
    
    def test_cascade_delete_clauses_with_document(self, client, auth_headers, document):
        """Test that clauses are deleted when document is deleted."""
        # Create clause
        clause_response = client.post(f'/documents/{document["id"]}/clauses',
            data=json.dumps({'clauseType': 'Test Clause'}),
            headers=auth_headers
        )
        clause_id = json.loads(clause_response.data)['id']
        
        # Delete document
        client.delete(f'/documents/{document["id"]}', headers=auth_headers)
        
        # Verify clause is also deleted
        get_response = client.get(f'/clauses/{clause_id}', headers=auth_headers)
        assert get_response.status_code == 404


class TestEdgeCases:
    """Test edge cases and error handling."""
    
    def test_create_investor_minimal(self, client, auth_headers):
        """Test creating investor with minimal data."""
        response = client.post('/investors',
            data=json.dumps({'name': 'Minimal Investor'}),
            headers=auth_headers
        )
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['name'] == 'Minimal Investor'
        assert data['currency'] == 'USD'  # Default
    
    def test_create_document_requires_investor(self, client, auth_headers):
        """Test that document creation requires valid investor."""
        response = client.post('/documents',
            data=json.dumps({
                'investorId': 99999,  # Non-existent
                'title': 'Orphan Doc',
                'docType': 'Side Letter'
            }),
            headers=auth_headers
        )
        assert response.status_code == 404
    
    def test_create_clause_requires_document(self, client, auth_headers):
        """Test that clause creation requires valid document."""
        response = client.post('/documents/99999/clauses',
            data=json.dumps({'clauseType': 'Test'}),
            headers=auth_headers
        )
        assert response.status_code == 404


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
