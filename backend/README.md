# Agreement Tracker - Backend API

Python/Flask backend with PostgreSQL database.

## Setup

### 1. Create virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 4. Run the server

```bash
python app.py
```

Server runs at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /auth/login` - Login with email/password
- `GET /auth/me` - Get current user (requires token)

### Investors
- `GET /investors` - List all investors
- `POST /investors` - Create investor
- `GET /investors/:id` - Get investor
- `PUT /investors/:id` - Update investor
- `DELETE /investors/:id` - Delete investor

### Documents
- `GET /documents` - List documents (optional `?investorId=`)
- `POST /documents` - Create document
- `GET /documents/:id` - Get document with clauses
- `DELETE /documents/:id` - Delete document

### Clauses
- `POST /documents/:id/clauses` - Add clause to document
- `DELETE /clauses/:id` - Delete clause

### Health
- `GET /health` - Health check

## Demo Credentials

- Email: `demo@agreement-tracker.com`
- Password: `Demo123!`

## Database

By default, uses SQLite for development. Configure `DATABASE_URL` for PostgreSQL in production.
