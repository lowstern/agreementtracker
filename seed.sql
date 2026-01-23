-- Agreement Tracker MVP seed data (PostgreSQL)

INSERT INTO users (id, email, display_name)
VALUES ('11111111-1111-1111-1111-111111111111', 'demo@agreement-tracker.com', 'Demo User');

INSERT INTO investors (id, name, type, sf_account_id)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'Mock Capital LP', 'LP', 'SF-ACC-0001'),
  ('33333333-3333-3333-3333-333333333333', 'Atlas Family Office', 'Family Office', 'SF-ACC-0002');

INSERT INTO funds (id, name, vehicle_type, vintage_year, sf_fund_id)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'Mock Fund I', 'Fund', 2024, 'SF-FUND-1001'),
  ('55555555-5555-5555-5555-555555555555', 'Mock Co-Invest Vehicle', 'SPV', 2025, 'SF-FUND-1002');

INSERT INTO commitments (investor_id, fund_id, amount, currency, commitment_date, status, sf_commitment_id)
VALUES
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 250000000, 'USD', '2024-01-15', 'Active', 'SF-COM-2001'),
  ('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 75000000, 'USD', '2024-02-01', 'Active', 'SF-COM-2002');

INSERT INTO agreements (id, investor_id, fund_id, doc_type, status, effective_date, supersedes_id, priority, created_by)
VALUES
  ('66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Subscription Agreement', 'Active', '2024-01-10', NULL, 2, '11111111-1111-1111-1111-111111111111'),
  ('77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Side Letter', 'Active', '2024-02-01', '66666666-6666-6666-6666-666666666666', 3, '11111111-1111-1111-1111-111111111111');

INSERT INTO documents (id, agreement_id, file_name, file_type, storage_url, checksum, uploaded_by)
VALUES
  ('88888888-8888-8888-8888-888888888888', '77777777-7777-7777-7777-777777777777', 'mock-capital-side-letter.pdf', 'application/pdf', 's3://agreements/mock-capital-side-letter.pdf', 'abc123', '11111111-1111-1111-1111-111111111111');

INSERT INTO clause_types (id, name)
VALUES
  ('99999999-9999-9999-9999-999999999999', 'Management Fee'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Hurdle'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Carry'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'MFN');

INSERT INTO clause_tags (id, name)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'tiered discount'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'step-down'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'retroactive trigger');

INSERT INTO clauses (id, agreement_id, document_id, clause_type_id, text, location_ref, created_by)
VALUES
  ('11111111-2222-3333-4444-555555555555', '77777777-7777-7777-7777-777777777777', '88888888-8888-8888-8888-888888888888', '99999999-9999-9999-9999-999999999999',
   'Management Fee shall be reduced by 0.25% beginning in year four for commitments >= $250,000,000.',
   'Page 4, Section 2.1', '11111111-1111-1111-1111-111111111111');

INSERT INTO clause_tag_map (clause_id, tag_id)
VALUES
  ('11111111-2222-3333-4444-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  ('11111111-2222-3333-4444-555555555555', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee');

INSERT INTO terms (clause_id, term_type, value_numeric, value_text, unit)
VALUES
  ('11111111-2222-3333-4444-555555555555', 'rate', 1.75, NULL, 'percent'),
  ('11111111-2222-3333-4444-555555555555', 'threshold', NULL, 'Commitment >= $250M', NULL),
  ('11111111-2222-3333-4444-555555555555', 'discount', 0.25, NULL, 'percent');

INSERT INTO fee_models (investor_id, fund_id, name, model_json)
VALUES
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Management Fee Model',
   '{"baseRate":2.0,"tierRate":1.75,"threshold":"Commitment >= $250M","discount":0.25,"triggers":["Year 4 step-down"]}');

INSERT INTO effective_terms (investor_id, fund_id, clause_type_id, term_snapshot, source_clause_id)
VALUES
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999',
   '{"rate":1.75,"threshold":"Commitment >= $250M","discount":0.25}', '11111111-2222-3333-4444-555555555555');

