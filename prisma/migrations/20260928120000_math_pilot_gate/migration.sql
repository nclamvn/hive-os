-- Local math-pilot gate: immutable problem contract and independent conclusion.
CREATE TYPE "MathPilotCaseType" AS ENUM ('CALIBRATION_PROOF', 'CALIBRATION_COUNTEREXAMPLE', 'OPEN');
CREATE TYPE "MathPilotConclusion" AS ENUM ('SUPPORTED_ARGUMENT', 'VALID_COUNTEREXAMPLE', 'PARTIAL', 'INCONCLUSIVE');

CREATE TABLE "math_pilot_case" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "research_run_id" TEXT NOT NULL,
  "case_type" "MathPilotCaseType" NOT NULL,
  "contract" JSONB NOT NULL,
  "contract_digest" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "math_pilot_case_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "math_pilot_contract_object" CHECK (jsonb_typeof("contract") = 'object'),
  CONSTRAINT "math_pilot_contract_digest_shape" CHECK ("contract_digest" ~ '^[a-f0-9]{64}$')
);

CREATE TABLE "math_pilot_assessment" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "case_id" TEXT NOT NULL,
  "conclusion" "MathPilotConclusion" NOT NULL,
  "rationale" TEXT NOT NULL,
  "verification_notes" TEXT NOT NULL,
  "research_digest" TEXT NOT NULL,
  "reviewer_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "math_pilot_assessment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "math_pilot_assessment_rationale_bounded" CHECK (char_length("rationale") BETWEEN 1 AND 4000),
  CONSTRAINT "math_pilot_assessment_notes_bounded" CHECK (char_length("verification_notes") BETWEEN 1 AND 8000),
  CONSTRAINT "math_pilot_assessment_research_digest_shape" CHECK ("research_digest" ~ '^[a-f0-9]{64}$')
);

CREATE UNIQUE INDEX "math_pilot_case_research_run_id_key" ON "math_pilot_case"("research_run_id");
CREATE UNIQUE INDEX "math_pilot_case_workspace_id_id_key" ON "math_pilot_case"("workspace_id", "id");
CREATE UNIQUE INDEX "math_pilot_case_workspace_id_research_run_id_key" ON "math_pilot_case"("workspace_id", "research_run_id");
CREATE INDEX "math_pilot_case_org_workspace_mission_type_created_idx"
  ON "math_pilot_case"("organization_id", "workspace_id", "mission_id", "case_type", "created_at");
CREATE UNIQUE INDEX "math_pilot_assessment_case_id_key" ON "math_pilot_assessment"("case_id");
CREATE UNIQUE INDEX "math_pilot_assessment_workspace_id_id_key" ON "math_pilot_assessment"("workspace_id", "id");
CREATE UNIQUE INDEX "math_pilot_assessment_workspace_id_case_id_key" ON "math_pilot_assessment"("workspace_id", "case_id");
CREATE INDEX "math_pilot_assessment_org_workspace_mission_created_idx"
  ON "math_pilot_assessment"("organization_id", "workspace_id", "mission_id", "created_at");

ALTER TABLE "math_pilot_case"
  ADD CONSTRAINT "math_pilot_case_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "math_pilot_case_workspace_fkey" FOREIGN KEY ("organization_id", "workspace_id") REFERENCES "workspace"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "math_pilot_case_mission_fkey" FOREIGN KEY ("workspace_id", "mission_id") REFERENCES "mission"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "math_pilot_case_research_run_fkey" FOREIGN KEY ("workspace_id", "research_run_id") REFERENCES "research_run"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "math_pilot_assessment"
  ADD CONSTRAINT "math_pilot_assessment_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "math_pilot_assessment_workspace_fkey" FOREIGN KEY ("organization_id", "workspace_id") REFERENCES "workspace"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "math_pilot_assessment_mission_fkey" FOREIGN KEY ("workspace_id", "mission_id") REFERENCES "mission"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "math_pilot_assessment_case_fkey" FOREIGN KEY ("workspace_id", "case_id") REFERENCES "math_pilot_case"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "math_pilot_assessment_reviewer_fkey" FOREIGN KEY ("reviewer_membership_id") REFERENCES "membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TRIGGER math_pilot_case_append_only BEFORE UPDATE OR DELETE ON "math_pilot_case"
  FOR EACH ROW EXECUTE FUNCTION hiveos_reject_research_retained_mutation();
CREATE TRIGGER math_pilot_assessment_append_only BEFORE UPDATE OR DELETE ON "math_pilot_assessment"
  FOR EACH ROW EXECUTE FUNCTION hiveos_reject_research_retained_mutation();

-- Research request fields are part of the frozen pilot contract. Normal
-- status/lease/review transitions remain writable.
CREATE OR REPLACE FUNCTION hiveos_freeze_research_request()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.organization_id IS DISTINCT FROM NEW.organization_id
     OR OLD.workspace_id IS DISTINCT FROM NEW.workspace_id
     OR OLD.mission_id IS DISTINCT FROM NEW.mission_id
     OR OLD.document_id IS DISTINCT FROM NEW.document_id
     OR OLD.question IS DISTINCT FROM NEW.question
     OR OLD.scope IS DISTINCT FROM NEW.scope
     OR OLD.source_policy IS DISTINCT FROM NEW.source_policy
     OR OLD.query_plan IS DISTINCT FROM NEW.query_plan
     OR OLD.provider_name IS DISTINCT FROM NEW.provider_name
     OR OLD.model_name IS DISTINCT FROM NEW.model_name
     OR OLD.requested_by_membership_id IS DISTINCT FROM NEW.requested_by_membership_id
  THEN
    RAISE EXCEPTION 'research request contract is immutable';
  END IF;
  RETURN NEW;
END
$$;
REVOKE ALL ON FUNCTION hiveos_freeze_research_request() FROM PUBLIC;
CREATE TRIGGER research_request_immutable BEFORE UPDATE ON "research_run"
  FOR EACH ROW EXECUTE FUNCTION hiveos_freeze_research_request();

ALTER TABLE "math_pilot_case" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "math_pilot_case" FORCE ROW LEVEL SECURITY;
CREATE POLICY "math_pilot_case_tenant_isolation" ON "math_pilot_case"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());

ALTER TABLE "math_pilot_assessment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "math_pilot_assessment" FORCE ROW LEVEL SECURITY;
CREATE POLICY "math_pilot_assessment_tenant_isolation" ON "math_pilot_assessment"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());

CREATE TRIGGER math_pilot_case_source_revision AFTER INSERT OR UPDATE OR DELETE ON "math_pilot_case"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('direct');
CREATE TRIGGER math_pilot_assessment_source_revision AFTER INSERT OR UPDATE OR DELETE ON "math_pilot_assessment"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('direct');
