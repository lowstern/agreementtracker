# Agreement Tracker API (Minimal)

Lightweight Express API with in-memory storage to demonstrate the core data model.

## Run

```bash
cd "/Users/lowellstern/Desktop/Agreement Tracker/api"
npm install
npm run dev
```

Server: `http://localhost:8080`

## Environment

Create `api/.env` (see `api/env.example`):

- `DATABASE_URL` (Postgres connection string)
- `DATABASE_SSL` (`true` for hosted Postgres)
- `AWS_REGION`, `AWS_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` for S3 uploads

## Endpoints

### Health
`GET /health`

### Investors
- `GET /investors`
- `POST /investors`

Body example:
```json
{
  "name": "Mock Capital LP",
  "type": "LP",
  "notes": "Preferred terms on management fee after year 4."
}
```

### Funds
- `GET /funds`
- `POST /funds`

Body example:
```json
{
  "name": "Mock Fund I",
  "vehicleType": "Fund",
  "vintageYear": 2024
}
```

### Commitments
- `GET /commitments`
- `POST /commitments`

Body example:
```json
{
  "investorId": "inv_mock_capital",
  "fundId": "fund_mock_1",
  "amount": 250000000,
  "currency": "USD",
  "commitmentDate": "2024-01-15",
  "status": "Active"
}
```

### Agreements
- `GET /agreements`
- `POST /agreements`

Body example:
```json
{
  "investorId": "inv_mock_capital",
  "fundId": "fund_mock_1",
  "title": "Mock Capital Side Letter",
  "docType": "Side Letter",
  "status": "Active",
  "effectiveDate": "2024-02-01",
  "supersedesId": "",
  "priority": 3
}
```

### Clauses (nested under agreements)
- `POST /agreements/:agreementId/clauses`

Body example:
```json
{
  "clauseType": "Management Fee",
  "tags": ["tiered discount", "step-down"],
  "text": "Management Fee shall be reduced by 0.25% beginning in year four...",
  "term": {
    "rate": 1.75,
    "threshold": "Commitment >= $250M",
    "discount": 0.25,
    "notes": "Step-down after year 4."
  }
}
```

### Documents (S3 metadata)
- `POST /agreements/:agreementId/documents`

Body example:
```json
{
  "fileName": "side-letter.pdf",
  "fileType": "application/pdf",
  "storageUrl": "s3://agreements/side-letter.pdf",
  "checksum": "abc123"
}
```

### Email ingestion
`POST /emails/ingest`

Body example:
```json
{
  "investorId": "inv_mock_capital",
  "fundId": "fund_mock_1",
  "agreementTitle": "Inbound Email - Fee Clarification",
  "subject": "Fee clarification for Mock Fund I",
  "from": "ops@lp.com",
  "s3Key": "emails/2024-07-01/inbound.eml",
  "fileName": "inbound.eml",
  "contentType": "message/rfc822",
  "clauses": [
    {
      "clauseType": "Management Fee",
      "tags": ["retroactive trigger"],
      "text": "Management Fee reduced to 1.50% after year 5.",
      "term": { "rate": 1.5, "notes": "Step-down after year 5." }
    }
  ]
}
```

### Effective terms
`GET /effective-terms?investorId=<id>&fundId=<optional>`

Returns the latest clause per clause type (date + priority precedence).

## Upload flow (S3)

1. Call `POST /uploads/presign` with `{ "fileName": "...", "contentType": "application/pdf" }`.
2. PUT the file to the returned `url`.
3. Call `POST /agreements/:agreementId/documents` with the returned `key` as `storageUrl`.

## Email → S3 → API (high-level)
1. Configure inbound email (AWS SES or SendGrid Inbound Parse) to store `.eml` in S3.
2. Trigger a webhook to `POST /emails/ingest` with the S3 key + extracted clauses.
3. The API creates an agreement + document + clauses with provenance.

## Notes
- This API expects the Postgres schema in `../sql/schema.sql`.

