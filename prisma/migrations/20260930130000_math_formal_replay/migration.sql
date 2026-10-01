CREATE TABLE "math_pilot_formal_replay" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "case_id" TEXT NOT NULL,
  "formal_attempt_id" TEXT NOT NULL,
  "contract_digest" TEXT NOT NULL,
  "target_digest" TEXT NOT NULL,
  "source_digest" TEXT NOT NULL,
  "primary_check_digest" TEXT NOT NULL,
  "result" JSONB NOT NULL,
  "result_digest" TEXT NOT NULL,
  "job_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "math_pilot_formal_replay_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "math_pilot_formal_replay_result_shape" CHECK (jsonb_typeof("result") = 'object'),
  CONSTRAINT "math_pilot_formal_replay_digests_shape" CHECK (
    "contract_digest" ~ '^[a-f0-9]{64}$' AND "target_digest" ~ '^[a-f0-9]{64}$' AND
    "source_digest" ~ '^[a-f0-9]{64}$' AND "primary_check_digest" ~ '^[a-f0-9]{64}$' AND
    "result_digest" ~ '^[a-f0-9]{64}$'
  )
);

CREATE UNIQUE INDEX "math_pilot_formal_replay_attempt_id_key" ON "math_pilot_formal_replay"("formal_attempt_id");
CREATE UNIQUE INDEX "math_pilot_formal_replay_job_id_key" ON "math_pilot_formal_replay"("job_id");
CREATE UNIQUE INDEX "math_pilot_formal_replay_workspace_id_id_key" ON "math_pilot_formal_replay"("workspace_id", "id");
CREATE UNIQUE INDEX "math_pilot_formal_replay_workspace_attempt_id_key" ON "math_pilot_formal_replay"("workspace_id", "formal_attempt_id");
CREATE INDEX "math_pilot_formal_replay_org_workspace_mission_created_idx"
  ON "math_pilot_formal_replay"("organization_id", "workspace_id", "mission_id", "created_at");

ALTER TABLE "math_pilot_formal_replay" ADD CONSTRAINT "math_pilot_formal_replay_attempt_fkey"
  FOREIGN KEY ("workspace_id", "formal_attempt_id") REFERENCES "math_pilot_formal_attempt"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "math_pilot_formal_replay" ADD CONSTRAINT "math_pilot_formal_replay_job_fkey"
  FOREIGN KEY ("job_id") REFERENCES "durable_job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TRIGGER math_pilot_formal_replay_append_only BEFORE UPDATE OR DELETE ON "math_pilot_formal_replay"
  FOR EACH ROW EXECUTE FUNCTION hiveos_reject_research_retained_mutation();

ALTER TABLE "math_pilot_formal_replay" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "math_pilot_formal_replay" FORCE ROW LEVEL SECURITY;
CREATE POLICY "math_pilot_formal_replay_tenant_isolation" ON "math_pilot_formal_replay"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());

CREATE TRIGGER math_pilot_formal_replay_source_revision AFTER INSERT OR UPDATE OR DELETE ON "math_pilot_formal_replay"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('direct');
