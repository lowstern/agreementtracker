# Deployment Guide

## Quick Deploy with Render Blueprint

The easiest way to deploy both the backend and frontend is using Render's Blueprint feature.

### One-Click Deploy

1. Push this repo to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **New** → **Blueprint**
4. Connect your GitHub repo
5. Render will automatically detect `render.yaml` and create:
   - **agreement-tracker-api**: Node.js backend
   - **agreement-tracker-frontend**: React static site
   - **agreement-tracker-db**: PostgreSQL database

### Post-Deployment Setup

1. **Initialize the database**: After the database is created, connect and run:
   ```bash
   psql $DATABASE_URL -f sql/schema.sql
   psql $DATABASE_URL -f sql/seed.sql
   ```

2. **Set the frontend API URL**:
   - Go to the `agreement-tracker-frontend` service in Render
   - Navigate to **Environment** tab
   - Set `VITE_API_URL` to your API URL (e.g., `https://agreement-tracker-api.onrender.com`)
   - Trigger a redeploy

---

## Manual Deployment

### Backend API (Render Web Service)

1. Create a new **Web Service** from your repo
2. Configure:
   - **Name**: `agreement-tracker-api`
   - **Root Directory**: `api`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. Add environment variables:
   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | Your PostgreSQL connection string |
   | `DATABASE_SSL` | `true` |
   | `AWS_REGION` | (optional) e.g., `us-east-1` |
   | `AWS_BUCKET` | (optional) Your S3 bucket name |
   | `AWS_ACCESS_KEY_ID` | (optional) AWS credentials |
   | `AWS_SECRET_ACCESS_KEY` | (optional) AWS credentials |

### Frontend (Render Static Site)

1. Create a new **Static Site** from your repo
2. Configure:
   - **Name**: `agreement-tracker-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. Add environment variables:
   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | Your backend URL (e.g., `https://agreement-tracker-api.onrender.com`) |

4. Add a rewrite rule for SPA routing:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: Rewrite

### Database (PostgreSQL)

1. Create a PostgreSQL instance on Render (or Neon, Supabase, etc.)
2. Initialize the schema:
   ```bash
   psql $DATABASE_URL -f sql/schema.sql
   psql $DATABASE_URL -f sql/seed.sql
   ```

---

## S3 Document Storage (Optional)

For document upload functionality:

1. Create an S3 bucket in AWS
2. Create an IAM user with S3 write permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["s3:PutObject", "s3:GetObject"],
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```
3. Add the AWS environment variables to your API service
4. The frontend uploads via presigned URLs from `/uploads/presign`

---

## Inbound Email Integration (Optional)

To automatically ingest agreements from email:

1. Configure AWS SES or SendGrid Inbound Parse
2. Save raw `.eml` files to S3
3. Trigger a webhook to `POST /emails/ingest`:
   ```json
   {
     "investorId": "uuid",
     "fundId": "uuid",
     "agreementTitle": "Email Subject",
     "subject": "Original subject",
     "from": "sender@example.com",
     "s3Key": "emails/123.eml",
     "fileName": "agreement.eml",
     "clauses": [
       { "clauseType": "Management Fee", "text": "...", "term": { "rate": 1.5 } }
     ]
   }
   ```

---

## Environment Variables Reference

### Backend (api/)
| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 8080) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DATABASE_SSL` | No | Enable SSL for database (default: false) |
| `AWS_REGION` | No | AWS region for S3 |
| `AWS_BUCKET` | No | S3 bucket name |
| `AWS_ACCESS_KEY_ID` | No | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | No | AWS credentials |

### Frontend (frontend/)
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes* | Backend API URL (empty for local dev proxy) |

\* Required for production builds
