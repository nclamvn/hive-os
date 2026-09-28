CREATE TABLE "math_pilot_agent_review" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "case_id" TEXT NOT NULL,
  "conclusion" "MathPilotConclusion" NOT NULL,
  "disposition" TEXT NOT NULL,
  "contract_digest" TEXT NOT NULL,
  "attempt_digest" TEXT NOT NULL,
  "research_digest" TEXT NOT NULL,
  "ledger" JSONB NOT NULL,
  "ledger_digest" TEXT NOT NULL,
  "job_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "math_pilot_agent_review_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "math_pilot_agent_review_disposition_check" CHECK ("disposition" IN ('AI_REVIEWED', 'INCONCLUSIVE')),
  CONSTRAINT "math_pilot_agent_review_ledger_object" CHECK (jsonb_typeof("ledger") = 'object'),
  CONSTRAINT "math_pilot_agent_review_digests_shape" CHECK (
    "contract_digest" ~ '^[a-f0-9]{64}$' AND
    "attempt_digest" ~ '^[a-f0-9]{64}$' AND
    "research_digest" ~ '^[a-f0-9]{64}$' AND
    "ledger_digest" ~ '^[a-f0-9]{64}$'
  )
);

CREATE UNIQUE INDEX "math_pilot_agent_review_case_id_key" ON "math_pilot_agent_review"("case_id");
CREATE UNIQUE INDEX "math_pilot_agent_review_job_id_key" ON "math_pilot_agent_review"("job_id");
CREATE UNIQUE INDEX "math_pilot_agent_review_workspace_id_id_key" ON "math_pilot_agent_review"("workspace_id", "id");
CREATE UNIQUE INDEX "math_pilot_agent_review_workspace_id_case_id_key" ON "math_pilot_agent_review"("workspace_id", "case_id");
CREATE INDEX "math_pilot_agent_review_org_workspace_mission_created_idx"
  ON "math_pilot_agent_review"("organization_id", "workspace_id", "mission_id", "created_at");

ALTER TABLE "math_pilot_agent_review"
  ADD CONSTRAINT "math_pilot_agent_review_case_fkey"
  FOREIGN KEY ("workspace_id", "case_id") REFERENCES "math_pilot_case"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "math_pilot_agent_review"
  ADD CONSTRAINT "math_pilot_agent_review_job_fkey"
  FOREIGN KEY ("job_id") REFERENCES "durable_job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TRIGGER math_pilot_agent_review_append_only BEFORE UPDATE OR DELETE ON "math_pilot_agent_review"
  FOR EACH ROW EXECUTE FUNCTION hiveos_reject_research_retained_mutation();

ALTER TABLE "math_pilot_agent_review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "math_pilot_agent_review" FORCE ROW LEVEL SECURITY;
CREATE POLICY "math_pilot_agent_review_tenant_isolation" ON "math_pilot_agent_review"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());

CREATE TRIGGER math_pilot_agent_review_source_revision AFTER INSERT OR UPDATE OR DELETE ON "math_pilot_agent_review"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('direct');
