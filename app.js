const STORAGE_KEY = "agreement-tracker-state";

const seedState = {
  investors: [
    {
      id: crypto.randomUUID(),
      name: "Mock Capital LP",
      type: "LP",
      commitment: 250000000,
      currency: "USD",
      fund: "Mock Fund I",
      relationship: "Side letter for fee break",
      notes: "Preferred terms on management fee after year 4.",
    },
    {
      id: crypto.randomUUID(),
      name: "Atlas Family Office",
      type: "Family Office",
      commitment: 75000000,
      currency: "USD",
      fund: "Mock Fund I",
      relationship: "Co-investment rights",
      notes: "Has MFN clause for related entities.",
    },
  ],
  agreements: [
    {
      id: crypto.randomUUID(),
      title: "Mock Capital Side Letter",
      investor: "Mock Capital LP",
      fund: "Mock Fund I",
      docType: "Side Letter",
      effectiveDate: "2024-02-01",
      status: "Active",
      supersedesId: "",
      priority: 3,
      fileName: "mock-capital-side-letter.pdf",
      fileType: "application/pdf",
      fileDataUrl: "",
      clauses: [
        {
          id: crypto.randomUUID(),
          clauseType: "Management Fee",
          tags: ["mgmt fee", "discount", "year 4 step-down"],
          clauseText:
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
  feeRules: [
    {
      id: crypto.randomUUID(),
      investor: "Mock Capital LP",
      fund: "Mock Fund I",
      feeType: "Management Fee",
      baseRate: 2.0,
      tierThreshold: "Commitment >= $250M",
      tierThresholdAmount: 250000000,
      tierRate: 1.75,
      discount: 0.25,
      triggers: "Step-down after year 4; MFN clause applies.",
      sourceClause:
        "Management Fee shall be reduced by 0.25% beginning in year four for commitments >= $250,000,000.",
    },
  ],
};

const emptyState = {
  investors: [],
  agreements: [],
  feeRules: [],
};

const defaultState = loadState();
let state = defaultState;

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");
const resetButton = document.getElementById("resetData");
const clearMockButton = document.getElementById("clearMockData");

const investorForm = document.getElementById("investorForm");
const investorList = document.getElementById("investorList");
const investorSearch = document.getElementById("investorSearch");

const agreementForm = document.getElementById("agreementForm");
const agreementList = document.getElementById("agreementList");
const clauseForm = document.getElementById("clauseForm");
const agreementSelect = document.getElementById("agreementSelect");
const parentAgreementSelect = document.getElementById("parentAgreementSelect");
const effectiveInvestor = document.getElementById("effectiveInvestor");
const effectiveFund = document.getElementById("effectiveFund");
const effectiveTerms = document.getElementById("effectiveTerms");

const feeForm = document.getElementById("feeForm");
const feeList = document.getElementById("feeList");
const scenarioCommitment = document.getElementById("scenarioCommitment");
const scenarioCurrency = document.getElementById("scenarioCurrency");
const modal = document.getElementById("provenanceModal");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

resetButton.addEventListener("click", () => {
  state = structuredClone(seedState);
  saveState(state);
  renderAll();
});

clearMockButton.addEventListener("click", () => {
  state = structuredClone(emptyState);
  saveState(state);
  renderAll();
});

investorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(investorForm);
  state.investors.unshift({
    id: crypto.randomUUID(),
    name: formData.get("name").trim(),
    type: formData.get("type"),
    commitment: Number(formData.get("commitment") || 0),
    currency: formData.get("currency").trim() || "USD",
    fund: formData.get("fund").trim(),
    relationship: formData.get("relationship").trim(),
    notes: formData.get("notes").trim(),
  });
  saveState(state);
  investorForm.reset();
  renderInvestors();
});

agreementForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(agreementForm);
  const file = formData.get("file");
  const docType = formData.get("docType");
  const priorityInput = Number(formData.get("priority") || 0);
  const agreement = {
    id: crypto.randomUUID(),
    title: formData.get("title").trim(),
    investor: formData.get("investor").trim(),
    fund: formData.get("fund").trim(),
    docType,
    effectiveDate: formData.get("effectiveDate"),
    status: formData.get("status"),
    supersedesId: formData.get("supersedesId"),
    priority: priorityInput || derivePriority(docType),
    fileName: "",
    fileType: "",
    fileDataUrl: "",
    clauses: [],
  };

  if (file && file.name) {
    agreement.fileName = file.name;
    agreement.fileType = file.type;
    agreement.fileDataUrl = await fileToDataUrl(file);
  }

  state.agreements.unshift(agreement);
  saveState(state);
  agreementForm.reset();
  renderAgreements();
  refreshAgreementSelects();
  renderEffectiveTerms();
});

clauseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(clauseForm);
  const agreementId = formData.get("agreementId");
  const agreement = state.agreements.find((item) => item.id === agreementId);
  if (!agreement) return;
  agreement.clauses.unshift({
    id: crypto.randomUUID(),
    clauseType: formData.get("clauseType"),
    tags: toTags(formData.get("tags")),
    clauseText: formData.get("clauseText").trim(),
    term: {
      rate: Number(formData.get("termRate") || 0),
      threshold: formData.get("termThreshold").trim(),
      discount: Number(formData.get("termDiscount") || 0),
      notes: formData.get("termNotes").trim(),
    },
  });
  saveState(state);
  clauseForm.reset();
  renderAgreements();
  renderEffectiveTerms();
});

feeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(feeForm);
  state.feeRules.unshift({
    id: crypto.randomUUID(),
    investor: formData.get("investor").trim(),
    fund: formData.get("fund").trim(),
    feeType: formData.get("feeType"),
    baseRate: Number(formData.get("baseRate") || 0),
    tierThreshold: formData.get("tierThreshold").trim(),
    tierThresholdAmount: Number(formData.get("tierThresholdAmount") || 0),
    tierRate: Number(formData.get("tierRate") || 0),
    discount: Number(formData.get("discount") || 0),
    triggers: formData.get("triggers").trim(),
    sourceClause: formData.get("sourceClause").trim(),
  });
  saveState(state);
  feeForm.reset();
  renderFees();
});

investorSearch.addEventListener("input", renderInvestors);
scenarioCommitment.addEventListener("input", renderFees);
scenarioCurrency.addEventListener("input", renderFees);
closeModal.addEventListener("click", closeProvenance);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeProvenance();
});
effectiveInvestor.addEventListener("change", renderEffectiveTerms);
effectiveFund.addEventListener("input", renderEffectiveTerms);

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const seeded = structuredClone(seedState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to parse stored data", error);
    const seeded = structuredClone(seedState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function saveState(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function switchTab(tabId) {
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabId);
  });
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });
}

function renderAll() {
  renderInvestors();
  renderAgreements();
  renderFees();
  refreshAgreementSelects();
  renderEffectiveTerms();
}

function renderInvestors() {
  const query = investorSearch.value.trim().toLowerCase();
  const filtered = state.investors.filter((investor) => {
    if (!query) return true;
    return (
      investor.name.toLowerCase().includes(query) ||
      investor.fund.toLowerCase().includes(query) ||
      investor.relationship.toLowerCase().includes(query)
    );
  });
  investorList.innerHTML = renderTable(
    ["Investor", "Commitment", "Fund", "Relationship", "Notes", ""],
    filtered.map((investor) => [
      `<strong>${escapeHtml(investor.name)}</strong><br /><span class="muted">${escapeHtml(investor.type)}</span>`,
      formatCurrency(investor.commitment, investor.currency),
      escapeHtml(investor.fund || "—"),
      escapeHtml(investor.relationship || "—"),
      escapeHtml(investor.notes || "—"),
      actionButtons("investor", investor.id),
    ])
  );
  wireDeleteButtons("investor");
}

function renderAgreements() {
  if (!state.agreements.length) {
    agreementList.innerHTML = `<p class="muted">No agreements yet.</p>`;
    return;
  }
  agreementList.innerHTML = state.agreements
    .map((agreement) => renderAgreementCard(agreement))
    .join("");
  wireDeleteButtons("agreement");
  wireClauseDeleteButtons();
}

function renderFees() {
  if (!state.feeRules.length) {
    feeList.innerHTML = `<p class="muted">No entries yet.</p>`;
    return;
  }
  const scenarioValue = Number(scenarioCommitment.value || 0);
  const currency = scenarioCurrency.value || "USD";
  feeList.innerHTML = state.feeRules
    .map((rule) => renderFeeCard(rule, scenarioValue, currency))
    .join("");
  wireDeleteButtons("fee");
  wireProvenanceButtons();
}

function renderTable(headers, rows) {
  if (rows.length === 0) {
    return `<p class="muted">No entries yet.</p>`;
  }
  const headerHtml = headers.map((header) => `<th>${header}</th>`).join("");
  const rowHtml = rows
    .map(
      (row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
    )
    .join("");
  return `<table class="table"><thead><tr>${headerHtml}</tr></thead><tbody>${rowHtml}</tbody></table>`;
}

function renderTags(tags = []) {
  if (!tags.length) return "—";
  return tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("");
}

function renderFeeCard(rule, scenarioValue, currency) {
  const baseRate = rule.baseRate || 0;
  const tierApplies =
    rule.tierRate && rule.tierThresholdAmount && scenarioValue >= rule.tierThresholdAmount;
  const scenarioRate = tierApplies ? rule.tierRate : baseRate;
  const discountedRate = Math.max(scenarioRate - (rule.discount || 0), 0);
  const feeAmount = (scenarioValue * discountedRate) / 100;
  const sourceClause = rule.sourceClause || "No source clause captured.";

  return `
    <div class="fee-card">
      <div class="fee-header">
        <div>
          <h4>${escapeHtml(rule.investor)}</h4>
          <div class="fee-meta">${escapeHtml(rule.fund)} · ${escapeHtml(rule.feeType)}</div>
        </div>
        ${actionButtons("fee", rule.id)}
      </div>
      <div class="visual-grid">
        <div class="ladder">
          <div class="ladder-step">
            <div class="metric">Base rate: ${renderMetricButton(
              `${baseRate.toFixed(2)}%`,
              sourceClause
            )}</div>
            <div class="muted">Applies to all commitments.</div>
          </div>
          ${
            rule.tierRate
              ? `<div class="ladder-step">
                  <div class="metric">Tier rate: ${renderMetricButton(
                    `${rule.tierRate.toFixed(2)}%`,
                    sourceClause
                  )}</div>
                  <div class="muted">${escapeHtml(
                    rule.tierThreshold || "Tiered threshold"
                  )}</div>
                </div>`
              : ""
          }
        </div>
        <div class="threshold">
          <div class="metric">Trigger</div>
          <div>${escapeHtml(rule.triggers || "—")}</div>
        </div>
        <div class="rule">
          <div class="metric">Discount rule</div>
          <div>${rule.discount ? `${rule.discount.toFixed(2)}% off` : "—"}</div>
        </div>
      </div>
      <div class="scenario-impact">
        <div class="metric">Scenario impact</div>
        <div>Commitment: ${formatCurrency(scenarioValue, currency)}</div>
        <div>Effective rate: ${renderMetricButton(
          `${discountedRate.toFixed(2)}%`,
          sourceClause
        )}</div>
        <div>Annual fee: ${renderMetricButton(
          formatCurrency(feeAmount, currency),
          sourceClause
        )}</div>
      </div>
    </div>
  `;
}

function renderMetricButton(label, sourceClause) {
  return `<button class="metric-button" data-provenance="${escapeHtml(
    sourceClause
  )}">${label}</button>`;
}

function renderFileLink(agreement) {
  if (!agreement.fileName) return "—";
  if (!agreement.fileDataUrl) return escapeHtml(agreement.fileName);
  return `<a href="${agreement.fileDataUrl}" download="${escapeHtml(
    agreement.fileName
  )}">Download</a>`;
}

function renderFormula(rule) {
  const base = `${rule.baseRate.toFixed(2)}%`;
  const tier =
    rule.tierRate && rule.tierThreshold
      ? `; if ${escapeHtml(rule.tierThreshold)} then ${rule.tierRate.toFixed(
          2
        )}%`
      : "";
  const discount = rule.discount
    ? `; discount ${rule.discount.toFixed(2)}%`
    : "";
  return `<div><strong>${base}</strong>${tier}${discount}</div>`;
}

function actionButtons(type, id) {
  return `<div class="row-actions"><button data-delete="${id}" data-type="${type}">Remove</button></div>`;
}

function wireDeleteButtons(type) {
  document.querySelectorAll(`[data-type="${type}"]`).forEach((button) => {
    button.addEventListener("click", () => removeItem(type, button.dataset.delete));
  });
}

function wireClauseDeleteButtons() {
  document.querySelectorAll(".clause-remove").forEach((button) => {
    button.addEventListener("click", () => {
      removeClause(button.dataset.parent, button.dataset.delete);
    });
  });
}

function removeItem(type, id) {
  if (type === "investor") {
    state.investors = state.investors.filter((item) => item.id !== id);
    renderInvestors();
  } else if (type === "agreement") {
    state.agreements = state.agreements.filter((item) => item.id !== id);
    renderAgreements();
    refreshAgreementSelects();
    renderEffectiveTerms();
  } else if (type === "fee") {
    state.feeRules = state.feeRules.filter((item) => item.id !== id);
    renderFees();
  }
  saveState(state);
}

function removeClause(agreementId, clauseId) {
  const agreement = state.agreements.find((item) => item.id === agreementId);
  if (!agreement) return;
  agreement.clauses = agreement.clauses.filter((clause) => clause.id !== clauseId);
  saveState(state);
  renderAgreements();
  renderEffectiveTerms();
}

function wireProvenanceButtons() {
  document.querySelectorAll(".metric-button").forEach((button) => {
    button.addEventListener("click", () => openProvenance(button.dataset.provenance));
  });
}

function openProvenance(text) {
  modalText.textContent = text || "No clause text available.";
  modal.classList.remove("hidden");
}

function closeProvenance() {
  modal.classList.add("hidden");
  modalText.textContent = "";
}

function formatCurrency(value, currency) {
  if (!value) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `· ${date.toLocaleDateString()}`;
}

function toTags(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || "");
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderAgreementCard(agreement) {
  const clauses = agreement.clauses || [];
  return `
    <div class="agreement-card">
      <div class="fee-header">
        <div>
          <h4>${escapeHtml(agreement.title)}</h4>
          <div class="agreement-meta">
            <span>${escapeHtml(agreement.investor)}</span>
            <span>${escapeHtml(agreement.fund || "—")}</span>
            <span>${escapeHtml(agreement.docType)}</span>
            <span>${escapeHtml(agreement.status || "Active")}</span>
            <span>${formatDate(agreement.effectiveDate) || ""}</span>
            <span>Priority ${agreement.priority || derivePriority(agreement.docType)}</span>
          </div>
        </div>
        ${actionButtons("agreement", agreement.id)}
      </div>
      <div>
        <strong>File:</strong> ${renderFileLink(agreement)}
      </div>
      <div class="clause-list">
        ${clauses.length ? clauses.map((clause) => renderClauseCard(agreement, clause)).join("") : `<p class="muted">No clauses yet.</p>`}
      </div>
    </div>
  `;
}

function renderClauseCard(agreement, clause) {
  const term = clause.term || {};
  return `
    <div class="clause-card">
      <div class="fee-header">
        <div>
          <strong>${escapeHtml(clause.clauseType)}</strong>
          <div>${renderTags(clause.tags || [])}</div>
        </div>
        <button class="clause-remove" data-parent="${agreement.id}" data-delete="${clause.id}">Remove</button>
      </div>
      <div class="muted">${escapeHtml(clause.clauseText || "No clause text")}</div>
      <div class="term-grid">
        <div>Rate: ${term.rate ? `${term.rate.toFixed(2)}%` : "—"}</div>
        <div>Threshold: ${escapeHtml(term.threshold || "—")}</div>
        <div>Discount: ${term.discount ? `${term.discount.toFixed(2)}%` : "—"}</div>
        <div>Notes: ${escapeHtml(term.notes || "—")}</div>
      </div>
    </div>
  `;
}

function refreshAgreementSelects() {
  const agreementOptions = state.agreements
    .map(
      (agreement) =>
        `<option value="${agreement.id}">${escapeHtml(agreement.title)} · ${escapeHtml(
          agreement.investor
        )}</option>`
    )
    .join("");
  agreementSelect.innerHTML = `<option value="">Select agreement</option>${agreementOptions}`;
  parentAgreementSelect.innerHTML = `<option value="">None</option>${agreementOptions}`;

  const investorSet = new Set([
    ...state.investors.map((item) => item.name),
    ...state.agreements.map((item) => item.investor),
  ]);
  const investorOptions = Array.from(investorSet)
    .filter(Boolean)
    .map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`)
    .join("");
  effectiveInvestor.innerHTML = investorOptions || `<option value="">No investors</option>`;
  if (!effectiveInvestor.value && investorOptions) {
    effectiveInvestor.value = investorSet.values().next().value || "";
  }
}

function renderEffectiveTerms() {
  const investor = effectiveInvestor.value;
  if (!investor) {
    effectiveTerms.innerHTML = `<p class="muted">Select an investor to view effective terms.</p>`;
    return;
  }
  const fundFilter = effectiveFund.value.trim().toLowerCase();
  const eligible = state.agreements.filter((agreement) => {
    if (agreement.investor !== investor) return false;
    if (fundFilter && !(agreement.fund || "").toLowerCase().includes(fundFilter)) return false;
    return agreement.status !== "Superseded";
  });
  if (!eligible.length) {
    effectiveTerms.innerHTML = `<p class="muted">No agreements match this investor.</p>`;
    return;
  }
  const sorted = eligible.slice().sort((a, b) => {
    const dateA = a.effectiveDate ? new Date(a.effectiveDate).getTime() : 0;
    const dateB = b.effectiveDate ? new Date(b.effectiveDate).getTime() : 0;
    if (dateA !== dateB) return dateA - dateB;
    return (a.priority || derivePriority(a.docType)) - (b.priority || derivePriority(b.docType));
  });
  const effectiveMap = new Map();
  sorted.forEach((agreement) => {
    (agreement.clauses || []).forEach((clause, index) => {
      effectiveMap.set(clause.clauseType, {
        clause,
        agreement,
        index,
      });
    });
  });
  if (!effectiveMap.size) {
    effectiveTerms.innerHTML = `<p class="muted">No clauses available.</p>`;
    return;
  }
  const rows = Array.from(effectiveMap.entries())
    .map(([type, data]) => {
      const term = data.clause.term || {};
      return `
        <div class="clause-card">
          <strong>${escapeHtml(type)}</strong>
          <div class="term-grid">
            <div>Rate: ${term.rate ? `${term.rate.toFixed(2)}%` : "—"}</div>
            <div>Threshold: ${escapeHtml(term.threshold || "—")}</div>
            <div>Discount: ${term.discount ? `${term.discount.toFixed(2)}%` : "—"}</div>
          </div>
          <div class="muted">
            Source: ${escapeHtml(data.agreement.title)} ${formatDate(
              data.agreement.effectiveDate
            )} · Clause ${data.index + 1}
          </div>
        </div>
      `;
    })
    .join("");
  effectiveTerms.innerHTML = rows;
}

function derivePriority(docType) {
  const map = {
    Amendment: 4,
    "Side Letter": 3,
    "Fee Schedule": 3,
    "Subscription Agreement": 2,
    PPM: 1,
  };
  return map[docType] || 1;
}

renderAll();

