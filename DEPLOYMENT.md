# Deployment (Vercel + Render + S3)

## Frontend (Vercel)
1. Push the repo to GitHub.
2. Go to Vercel → New Project → import the repo.
3. Framework preset: **Other**.
4. Root directory: repo root.
5. Build command: leave empty.
6. Output directory: leave empty.
7. Deploy.

Optional: set `API_BASE` by editing the header input in the UI.

## API (Render)
1. Create a new Web Service from the same repo.
2. Root directory: `api`.
3. Build command: `npm install`.
4. Start command: `npm run dev`.
5. Add environment variables:
   - `DATABASE_URL`
   - `DATABASE_SSL=true`
   - `AWS_REGION`
   - `AWS_BUCKET`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

## Database (Postgres)
1. Create a Postgres instance (Neon, Supabase, Render, etc.).
2. Run:
   - `sql/schema.sql`
   - `sql/seed.sql`

## S3
1. Create an S3 bucket.
2. Create IAM user with limited S3 write access.
3. Add the AWS env vars to Render.
4. The UI uploads via `/uploads/presign` → PUT to S3 → stores metadata in `documents`.

## Inbound email (optional)
1. Configure AWS SES or SendGrid Inbound Parse to accept emails.
2. Save raw `.eml` into S3.
3. Trigger a webhook to `POST /emails/ingest` with the S3 key and extracted clauses.
4. Agreements + clauses are created with provenance.

