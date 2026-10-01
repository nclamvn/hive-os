CREATE TABLE "math_pilot_formal_attempt" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "case_id" TEXT NOT NULL,
  "contract_digest" TEXT NOT NULL,
  "attempt_digest" TEXT NOT NULL,
  "research_digest" TEXT NOT NULL,
  "target" JSONB NOT NULL,
  "target_digest" TEXT NOT NULL,
  "proof_tactics" TEXT NOT NULL,
  "proof_source_digest" TEXT NOT NULL,
  "model_name" TEXT NOT NULL,
  "model_thread_id" TEXT NOT NULL,
  "model_usage" JSONB NOT NULL,
  "check" JSONB NOT NULL,
  "check_digest" TEXT NOT NULL,
  "job_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "math_pilot_formal_attempt_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "math_pilot_formal_attempt_json_shape" CHECK (
    jsonb_typeof("target") = 'object' AND jsonb_typeof("model_usage") = 'object' AND jsonb_typeof("check") = 'object'
  ),
  CONSTRAINT "math_pilot_formal_attempt_digests_shape" CHECK (
    "contract_digest" ~ '^[a-f0-9]{64}$' AND "attempt_digest" ~ '^[a-f0-9]{64}$' AND
    "research_digest" ~ '^[a-f0-9]{64}$' AND "target_digest" ~ '^[a-f0-9]{64}$' AND
    "proof_source_digest" ~ '^[a-f0-9]{64}$' AND "check_digest" ~ '^[a-f0-9]{64}$'
  )
);

CREATE UNIQUE INDEX "math_pilot_formal_attempt_job_id_key" ON "math_pilot_formal_attempt"("job_id");
CREATE UNIQUE INDEX "math_pilot_formal_attempt_workspace_id_id_key" ON "math_pilot_formal_attempt"("workspace_id", "id");
CREATE INDEX "math_pilot_formal_attempt_org_workspace_mission_created_idx"
  ON "math_pilot_formal_attempt"("organization_id", "workspace_id", "mission_id", "created_at");
CREATE INDEX "math_pilot_formal_attempt_workspace_case_created_idx"
  ON "math_pilot_formal_attempt"("workspace_id", "case_id", "created_at");

ALTER TABLE "math_pilot_formal_attempt" ADD CONSTRAINT "math_pilot_formal_attempt_case_fkey"
  FOREIGN KEY ("workspace_id", "case_id") REFERENCES "math_pilot_case"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "math_pilot_formal_attempt" ADD CONSTRAINT "math_pilot_formal_attempt_job_fkey"
  FOREIGN KEY ("job_id") REFERENCES "durable_job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TRIGGER math_pilot_formal_attempt_append_only BEFORE UPDATE OR DELETE ON "math_pilot_formal_attempt"
  FOR EACH ROW EXECUTE FUNCTION hiveos_reject_research_retained_mutation();

ALTER TABLE "math_pilot_formal_attempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "math_pilot_formal_attempt" FORCE ROW LEVEL SECURITY;
CREATE POLICY "math_pilot_formal_attempt_tenant_isolation" ON "math_pilot_formal_attempt"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());

CREATE TRIGGER math_pilot_formal_attempt_source_revision AFTER INSERT OR UPDATE OR DELETE ON "math_pilot_formal_attempt"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('direct');
