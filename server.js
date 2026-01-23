import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

const store = {
  investors: [
    {
      id: "inv_mock_capital",
      name: "Mock Capital LP",
      type: "LP",
      notes: "Preferred terms on management fee after year 4.",
    },
  ],
  funds: [
    {
      id: "fund_mock_1",
      name: "Mock Fund I",
      vehicleType: "Fund",
      vintageYear: 2024,
    },
  ],
  commitments: [
    {
      id: "commit_mock_1",
      investorId: "inv_mock_capital",
      fundId: "fund_mock_1",
      amount: 250000000,
      currency: "USD",
      commitmentDate: "2024-01-15",
      status: "Active",
    },
  ],
  agreements: [
    {
      id: "agr_side_letter_1",
      investorId: "inv_mock_capital",
      fundId: "fund_mock_1",
      title: "Mock Capital Side Letter",
      docType: "Side Letter",
      status: "Active",
      effectiveDate: "2024-02-01",
      supersedesId: "",
      priority: 3,
      clauses: [
        {
          id: "clause_mgmt_fee_1",
          clauseType: "Management Fee",
          tags: ["tiered discount", "step-down"],
          text:
            "Management Fee shall be reduced by 0.25% beginning in year four for commitments >= $250,000,000.",
          term: {
            rate: 1.75,
            threshold: "Commitment >= $250M",
            discount: 0.25,
            notes: "Step-down after year 4.",
          },
        },
      ],
    },
  ],
};

const id = () => `id_${Math.random().toString(36).slice(2, 10)}`;

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Investors
app.get("/investors", (_req, res) => {
  res.json(store.investors);
});

app.post("/investors", (req, res) => {
  const investor = {
    id: id(),
    name: req.body.name?.trim() || "Unnamed investor",
    type: req.body.type || "LP",
    notes: req.body.notes || "",
  };
  store.investors.unshift(investor);
  res.status(201).json(investor);
});

// Funds
app.get("/funds", (_req, res) => {
  res.json(store.funds);
});

app.post("/funds", (req, res) => {
  const fund = {
    id: id(),
    name: req.body.name?.trim() || "Untitled fund",
    vehicleType: req.body.vehicleType || "Fund",
    vintageYear: req.body.vintageYear || null,
  };
  store.funds.unshift(fund);
  res.status(201).json(fund);
});

// Commitments
app.get("/commitments", (_req, res) => {
  res.json(store.commitments);
});

app.post("/commitments", (req, res) => {
  const commitment = {
    id: id(),
    investorId: req.body.investorId,
    fundId: req.body.fundId,
    amount: Number(req.body.amount || 0),
    currency: req.body.currency || "USD",
    commitmentDate: req.body.commitmentDate || null,
    status: req.body.status || "Active",
  };
  store.commitments.unshift(commitment);
  res.status(201).json(commitment);
});

// Agreements
app.get("/agreements", (_req, res) => {
  res.json(store.agreements);
});

app.post("/agreements", (req, res) => {
  const agreement = {
    id: id(),
    investorId: req.body.investorId,
    fundId: req.body.fundId || null,
    title: req.body.title?.trim() || "Untitled agreement",
    docType: req.body.docType || "Side Letter",
    status: req.body.status || "Active",
    effectiveDate: req.body.effectiveDate || null,
    supersedesId: req.body.supersedesId || "",
    priority: Number(req.body.priority || 0) || derivePriority(req.body.docType),
    clauses: [],
  };
  store.agreements.unshift(agreement);
  res.status(201).json(agreement);
});

app.post("/agreements/:agreementId/clauses", (req, res) => {
  const agreement = store.agreements.find(
    (item) => item.id === req.params.agreementId
  );
  if (!agreement) {
    res.status(404).json({ error: "Agreement not found" });
    return;
  }
  const clause = {
    id: id(),
    clauseType: req.body.clauseType || "Other",
    tags: req.body.tags || [],
    text: req.body.text || "",
    term: {
      rate: Number(req.body.term?.rate || 0),
      threshold: req.body.term?.threshold || "",
      discount: Number(req.body.term?.discount || 0),
      notes: req.body.term?.notes || "",
    },
  };
  agreement.clauses.unshift(clause);
  res.status(201).json(clause);
});

// Effective terms
app.get("/effective-terms", (req, res) => {
  const investorId = req.query.investorId;
  const fundId = req.query.fundId;
  if (!investorId) {
    res.status(400).json({ error: "investorId is required" });
    return;
  }
  const eligible = store.agreements.filter((agreement) => {
    if (agreement.investorId !== investorId) return false;
    if (fundId && agreement.fundId !== fundId) return false;
    return agreement.status !== "Superseded";
  });
  const sorted = eligible.slice().sort((a, b) => {
    const dateA = a.effectiveDate ? new Date(a.effectiveDate).getTime() : 0;
    const dateB = b.effectiveDate ? new Date(b.effectiveDate).getTime() : 0;
    if (dateA !== dateB) return dateA - dateB;
    return (a.priority || derivePriority(a.docType)) - (b.priority || derivePriority(b.docType));
  });
  const effectiveMap = new Map();
  sorted.forEach((agreement) => {
    agreement.clauses.forEach((clause) => {
      effectiveMap.set(clause.clauseType, {
        clause,
        agreementId: agreement.id,
        agreementTitle: agreement.title,
        effectiveDate: agreement.effectiveDate,
      });
    });
  });
  res.json(Object.fromEntries(effectiveMap.entries()));
});

app.listen(PORT, () => {
  console.log(`Agreement Tracker API running on http://localhost:${PORT}`);
});

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

