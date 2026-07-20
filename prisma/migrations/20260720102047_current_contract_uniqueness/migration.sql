-- At most one contract per mission may be DRAFT or IN_REVIEW at a time.
-- Enforced at the database level so concurrent amendments cannot create two.
CREATE UNIQUE INDEX "mission_contract_one_current"
  ON "mission_contract" ("mission_id")
  WHERE status IN ('DRAFT', 'IN_REVIEW');
