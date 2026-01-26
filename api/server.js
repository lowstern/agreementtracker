import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

const s3 =
  process.env.AWS_REGION && process.env.AWS_BUCKET
    ? new S3Client({ region: process.env.AWS_REGION })
    : null;

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: "database_unavailable" });
  }
});

// Investors
app.get("/investors", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT id, name, type, metadata, created_at, updated_at FROM investors ORDER BY created_at DESC"
  );
  res.json(rows);
});

app.post("/investors", async (req, res) => {
  const { rows } = await pool.query(
    "INSERT INTO investors (name, type, metadata) VALUES ($1, $2, $3) RETURNING *",
    [req.body.name?.trim() || "Unnamed investor", req.body.type || "LP", req.body.metadata || {}]
  );
  res.status(201).json(rows[0]);
});

app.delete("/investors/:id", async (req, res) => {
  await pool.query("DELETE FROM investors WHERE id = $1", [req.params.id]);
  res.status(204).end();
});

// Funds
app.get("/funds", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT id, name, vehicle_type, vintage_year, metadata FROM funds ORDER BY created_at DESC"
  );
  res.json(rows);
});

app.post("/funds", async (req, res) => {
  const { rows } = await pool.query(
    "INSERT INTO funds (name, vehicle_type, vintage_year, metadata) VALUES ($1, $2, $3, $4) RETURNING *",
    [
      req.body.name?.trim() || "Untitled fund",
      req.body.vehicleType || "Fund",
      req.body.vintageYear || null,
      req.body.metadata || {},
    ]
  );
  res.status(201).json(rows[0]);
});

app.delete("/funds/:id", async (req, res) => {
  await pool.query("DELETE FROM funds WHERE id = $1", [req.params.id]);
  res.status(204).end();
});

// Commitments
app.get("/commitments", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM commitments ORDER BY created_at DESC"
  );
  res.json(rows);
});

app.post("/commitments", async (req, res) => {
  const { rows } = await pool.query(
    "INSERT INTO commitments (investor_id, fund_id, amount, currency, commitment_date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      req.body.investorId,
      req.body.fundId,
      Number(req.body.amount || 0),
      req.body.currency || "USD",
      req.body.commitmentDate || null,
      req.body.status || "Active",
    ]
  );
  res.status(201).json(rows[0]);
});

app.delete("/commitments/:id", async (req, res) => {
  await pool.query("DELETE FROM commitments WHERE id = $1", [req.params.id]);
  res.status(204).end();
});

// Agreements
app.get("/agreements", async (_req, res) => {
  const agreements = await pool.query(
    "SELECT * FROM agreements ORDER BY effective_date DESC NULLS LAST"
  );
  const clauses = await pool.query(
    `SELECT c.*, ct.name AS clause_type_name
     FROM clauses c
     JOIN clause_types ct ON ct.id = c.clause_type_id
     ORDER BY c.created_at DESC`
  );
  const documents = await pool.query(
    "SELECT * FROM documents ORDER BY uploaded_at DESC"
  );
  const tags = await pool.query(
    `SELECT ctm.clause_id, t.name
     FROM clause_tag_map ctm
     JOIN clause_tags t ON t.id = ctm.tag_id`
  );
  const terms = await pool.query("SELECT * FROM terms");

  const tagMap = new Map();
  tags.rows.forEach((row) => {
    if (!tagMap.has(row.clause_id)) tagMap.set(row.clause_id, []);
    tagMap.get(row.clause_id).push(row.name);
  });
  const termMap = new Map();
  terms.rows.forEach((row) => {
    if (!termMap.has(row.clause_id)) termMap.set(row.clause_id, []);
    termMap.get(row.clause_id).push(row);
  });

  const clausesByAgreement = new Map();
  clauses.rows.forEach((clause) => {
    const mapped = {
      id: clause.id,
      clauseType: clause.clause_type_name,
      tags: tagMap.get(clause.id) || [],
      text: clause.text,
      term: normalizeTerms(termMap.get(clause.id) || []),
    };
    if (!clausesByAgreement.has(clause.agreement_id)) {
      clausesByAgreement.set(clause.agreement_id, []);
    }
    clausesByAgreement.get(clause.agreement_id).push(mapped);
  });

  const docsByAgreement = new Map();
  documents.rows.forEach((doc) => {
    if (!docsByAgreement.has(doc.agreement_id)) docsByAgreement.set(doc.agreement_id, []);
    docsByAgreement.get(doc.agreement_id).push({
      id: doc.id,
      fileName: doc.file_name,
      fileType: doc.file_type,
      storageUrl: doc.storage_url,
      checksum: doc.checksum,
      uploadedAt: doc.uploaded_at,
    });
  });

  const payload = agreements.rows.map((agreement) => ({
    id: agreement.id,
    investorId: agreement.investor_id,
    fundId: agreement.fund_id,
    title: agreement.title || "Agreement",
    docType: agreement.doc_type,
    status: agreement.status,
    effectiveDate: agreement.effective_date,
    supersedesId: agreement.supersedes_id,
    priority: agreement.priority,
    clauses: clausesByAgreement.get(agreement.id) || [],
    documents: docsByAgreement.get(agreement.id) || [],
  }));
  res.json(payload);
});

app.post("/agreements", async (req, res) => {
  const { rows } = await pool.query(
    `INSERT INTO agreements (investor_id, fund_id, title, doc_type, status, effective_date, supersedes_id, priority)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      req.body.investorId,
      req.body.fundId || null,
      req.body.title?.trim() || "Agreement",
      req.body.docType || "Side Letter",
      req.body.status || "Active",
      req.body.effectiveDate || null,
      req.body.supersedesId || null,
      Number(req.body.priority || 0) || derivePriority(req.body.docType),
    ]
  );
  res.status(201).json(rows[0]);
});

app.delete("/agreements/:id", async (req, res) => {
  await pool.query("DELETE FROM agreements WHERE id = $1", [req.params.id]);
  res.status(204).end();
});

app.post("/agreements/:agreementId/clauses", async (req, res) => {
  const clauseTypeId = await getClauseTypeId(req.body.clauseType || "Other");
  const { rows } = await pool.query(
    "INSERT INTO clauses (agreement_id, clause_type_id, text) VALUES ($1, $2, $3) RETURNING *",
    [req.params.agreementId, clauseTypeId, req.body.text || ""]
  );
  const clause = rows[0];
  await upsertTags(clause.id, req.body.tags || []);
  await upsertTerms(clause.id, req.body.term || {});
  res.status(201).json(clause);
});

app.post("/agreements/:agreementId/documents", async (req, res) => {
  const { rows } = await pool.query(
    `INSERT INTO documents (agreement_id, file_name, file_type, storage_url, checksum, source, source_ref, metadata, uploaded_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      req.params.agreementId,
      req.body.fileName,
      req.body.fileType || null,
      req.body.storageUrl || null,
      req.body.checksum || null,
      req.body.source || "upload",
      req.body.sourceRef || null,
      req.body.metadata || {},
      req.body.uploadedBy || null,
    ]
  );
  res.status(201).json(rows[0]);
});

app.delete("/agreements/:agreementId/clauses/:clauseId", async (req, res) => {
  await pool.query("DELETE FROM clauses WHERE id = $1 AND agreement_id = $2", [
    req.params.clauseId,
    req.params.agreementId,
  ]);
  res.status(204).end();
});

// Fee models (stores structured formulas)
app.get("/fee-models", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM fee_models ORDER BY created_at DESC"
  );
  res.json(rows);
});

app.post("/fee-models", async (req, res) => {
  const { rows } = await pool.query(
    "INSERT INTO fee_models (investor_id, fund_id, name, model_json) VALUES ($1, $2, $3, $4) RETURNING *",
    [req.body.investorId, req.body.fundId, req.body.name, req.body.modelJson || {}]
  );
  res.status(201).json(rows[0]);
});

app.delete("/fee-models/:id", async (req, res) => {
  await pool.query("DELETE FROM fee_models WHERE id = $1", [req.params.id]);
  res.status(204).end();
});

// Effective terms
app.get("/effective-terms", async (req, res) => {
  const investorId = req.query.investorId;
  const fundId = req.query.fundId;
  if (!investorId) {
    res.status(400).json({ error: "investorId is required" });
    return;
  }
  const { rows } = await pool.query(
    "SELECT * FROM agreements WHERE investor_id = $1",
    [investorId]
  );
  const eligible = rows.filter((agreement) => {
    if (fundId && agreement.fund_id !== fundId) return false;
    return agreement.status !== "Superseded";
  });
  const agreements = eligible.sort((a, b) => {
    const dateA = a.effective_date ? new Date(a.effective_date).getTime() : 0;
    const dateB = b.effective_date ? new Date(b.effective_date).getTime() : 0;
    if (dateA !== dateB) return dateA - dateB;
    return (a.priority || derivePriority(a.doc_type)) - (b.priority || derivePriority(b.doc_type));
  });
  const clauseRows = await pool.query(
    `SELECT c.*, ct.name AS clause_type_name
     FROM clauses c
     JOIN clause_types ct ON ct.id = c.clause_type_id
     WHERE c.agreement_id = ANY($1::uuid[])`,
    [agreements.map((item) => item.id)]
  );
  const termsRows = await pool.query("SELECT * FROM terms");
  const termMap = new Map();
  termsRows.rows.forEach((row) => {
    if (!termMap.has(row.clause_id)) termMap.set(row.clause_id, []);
    termMap.get(row.clause_id).push(row);
  });
  const clauseMap = new Map();
  clauseRows.rows.forEach((row) => {
    clauseMap.set(row.id, {
      clauseType: row.clause_type_name,
      text: row.text,
      term: normalizeTerms(termMap.get(row.id) || []),
      agreementId: row.agreement_id,
    });
  });
  const effectiveMap = new Map();
  agreements.forEach((agreement) => {
    clauseRows.rows
      .filter((row) => row.agreement_id === agreement.id)
      .forEach((row) => {
        effectiveMap.set(row.clause_type_name, {
          clause: clauseMap.get(row.id),
          agreementId: agreement.id,
          agreementTitle: agreement.title,
          effectiveDate: agreement.effective_date,
        });
      });
  });
  res.json(Object.fromEntries(effectiveMap.entries()));
});

// S3 presign for uploads
app.post("/uploads/presign", async (req, res) => {
  if (!s3) {
    res.status(400).json({ error: "s3_not_configured" });
    return;
  }
  const key = req.body.key || `uploads/${Date.now()}-${req.body.fileName || "file"}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ContentType: req.body.contentType || "application/octet-stream",
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
  const region = process.env.AWS_REGION;
  const publicUrl = `https://${process.env.AWS_BUCKET}.s3.${region}.amazonaws.com/${key}`;
  res.json({ url, key, publicUrl });
});

// Email ingestion webhook (SendGrid/SES -> S3 -> API)
app.post("/emails/ingest", async (req, res) => {
  const {
    investorId,
    fundId,
    agreementTitle,
    subject,
    from,
    s3Key,
    fileName,
    contentType,
    clauses = [],
  } = req.body || {};

  if (!investorId) {
    res.status(400).json({ error: "investorId is required" });
    return;
  }

  const agreement = await pool.query(
    `INSERT INTO agreements (investor_id, fund_id, title, doc_type, status, effective_date, priority)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      investorId,
      fundId || null,
      agreementTitle || subject || "Inbound Email",
      "Email",
      "Active",
      null,
      3,
    ]
  );

  if (s3Key || fileName) {
    await pool.query(
      `INSERT INTO documents (agreement_id, file_name, file_type, storage_url, source, source_ref, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        agreement.rows[0].id,
        fileName || "email.eml",
        contentType || "message/rfc822",
        s3Key || null,
        "email",
        from || null,
        { subject },
      ]
    );
  }

  for (const clause of clauses) {
    const clauseTypeId = await getClauseTypeId(clause.clauseType || "Other");
    const clauseInsert = await pool.query(
      "INSERT INTO clauses (agreement_id, clause_type_id, text) VALUES ($1, $2, $3) RETURNING *",
      [agreement.rows[0].id, clauseTypeId, clause.text || ""]
    );
    await upsertTags(clauseInsert.rows[0].id, clause.tags || []);
    await upsertTerms(clauseInsert.rows[0].id, clause.term || {});
  }

  res.status(201).json({
    agreementId: agreement.rows[0].id,
    clausesCreated: clauses.length,
  });
});

app.listen(PORT, () => {
  console.log(`Agreement Tracker API running on http://localhost:${PORT}`);
});

async function getClauseTypeId(name) {
  const { rows } = await pool.query("SELECT id FROM clause_types WHERE name = $1", [
    name,
  ]);
  if (rows[0]) return rows[0].id;
  const insert = await pool.query(
    "INSERT INTO clause_types (name) VALUES ($1) RETURNING id",
    [name]
  );
  return insert.rows[0].id;
}

async function upsertTags(clauseId, tags) {
  await pool.query("DELETE FROM clause_tag_map WHERE clause_id = $1", [clauseId]);
  for (const tag of tags) {
    if (!tag) continue;
    const existing = await pool.query("SELECT id FROM clause_tags WHERE name = $1", [
      tag,
    ]);
    const tagId = existing.rows[0]
      ? existing.rows[0].id
      : (
          await pool.query("INSERT INTO clause_tags (name) VALUES ($1) RETURNING id", [
            tag,
          ])
        ).rows[0].id;
    await pool.query(
      "INSERT INTO clause_tag_map (clause_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [clauseId, tagId]
    );
  }
}

async function upsertTerms(clauseId, term) {
  await pool.query("DELETE FROM terms WHERE clause_id = $1", [clauseId]);
  const inserts = [];
  if (term.rate) {
    inserts.push(["rate", term.rate, null, "percent"]);
  }
  if (term.threshold) {
    inserts.push(["threshold", null, term.threshold, null]);
  }
  if (term.discount) {
    inserts.push(["discount", term.discount, null, "percent"]);
  }
  if (term.notes) {
    inserts.push(["notes", null, term.notes, null]);
  }
  for (const [termType, valueNumeric, valueText, unit] of inserts) {
    await pool.query(
      "INSERT INTO terms (clause_id, term_type, value_numeric, value_text, unit) VALUES ($1, $2, $3, $4, $5)",
      [clauseId, termType, valueNumeric, valueText, unit]
    );
  }
}

function normalizeTerms(rows) {
  const term = { rate: 0, threshold: "", discount: 0, notes: "" };
  rows.forEach((row) => {
    if (row.term_type === "rate") term.rate = Number(row.value_numeric || 0);
    if (row.term_type === "threshold") term.threshold = row.value_text || "";
    if (row.term_type === "discount") term.discount = Number(row.value_numeric || 0);
    if (row.term_type === "notes") term.notes = row.value_text || "";
  });
  return term;
}

function derivePriority(docType = "") {
  const map = {
    Amendment: 4,
    "Side Letter": 3,
    "Fee Schedule": 3,
    "Subscription Agreement": 2,
    PPM: 1,
  };
  return map[docType] || 1;
}

