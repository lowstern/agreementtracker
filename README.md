# Agreement Tracker API (Minimal)

Lightweight Express API with in-memory storage to demonstrate the core data model.

## Run

```bash
cd "/Users/lowellstern/Desktop/Agreement Tracker/api"
npm install
npm run dev
```

Server: `http://localhost:8080`

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

### Effective terms
`GET /effective-terms?investorId=<id>&fundId=<optional>`

Returns the latest clause per clause type (date + priority precedence).

## Notes
- In-memory only; restart resets data.
- Production: connect to Postgres schema in `../sql/schema.sql`.

