CREATE TABLE "math_research_cycle" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "root_case_id" TEXT NOT NULL,
  "root_contract_digest" TEXT NOT NULL,
  "root_attempt_digest" TEXT NOT NULL,
  "root_review_digest" TEXT NOT NULL,
  "command_id" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'QUEUED',
  "stop_reason" TEXT,
  "max_rounds" INTEGER NOT NULL,
  "max_calls" INTEGER NOT NULL,
  "max_observed_tokens" INTEGER NOT NULL,
  "calls_started" INTEGER NOT NULL DEFAULT 0,
  "observed_tokens" INTEGER NOT NULL DEFAULT 0,
  "completed_rounds" INTEGER NOT NULL DEFAULT 0,
  "deadline_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "math_research_cycle_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "math_research_cycle_status_check" CHECK ("status" IN ('QUEUED', 'RUNNING', 'STOPPED', 'FAILED')),
  CONSTRAINT "math_research_cycle_limits_check" CHECK (
    "max_rounds" BETWEEN 1 AND 2 AND "max_calls" = 5 * "max_rounds" AND
    "max_observed_tokens" BETWEEN 10000 AND 120000 AND
    "calls_started" BETWEEN 0 AND "max_calls" AND "observed_tokens" >= 0 AND
    "completed_rounds" BETWEEN 0 AND "max_rounds"
  ),
  CONSTRAINT "math_research_cycle_digest_check" CHECK (
    "root_contract_digest" ~ '^[a-f0-9]{64}$' AND
    "root_attempt_digest" ~ '^[a-f0-9]{64}$' AND
    "root_review_digest" ~ '^[a-f0-9]{64}$'
  )
);
CREATE UNIQUE INDEX "math_research_cycle_root_case_id_key" ON "math_research_cycle"("root_case_id");
CREATE UNIQUE INDEX "math_research_cycle_workspace_id_id_key" ON "math_research_cycle"("workspace_id", "id");
CREATE UNIQUE INDEX "math_research_cycle_workspace_id_root_case_id_key" ON "math_research_cycle"("workspace_id", "root_case_id");
CREATE INDEX "math_research_cycle_org_workspace_mission_created_idx" ON "math_research_cycle"("organization_id", "workspace_id", "mission_id", "created_at");
ALTER TABLE "math_research_cycle" ADD CONSTRAINT "math_research_cycle_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "math_research_cycle" ADD CONSTRAINT "math_research_cycle_workspace_fkey" FOREIGN KEY ("organization_id", "workspace_id") REFERENCES "workspace"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "math_research_cycle" ADD CONSTRAINT "math_research_cycle_mission_fkey" FOREIGN KEY ("workspace_id", "mission_id") REFERENCES "mission"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "math_research_cycle" ADD CONSTRAINT "math_research_cycle_root_case_fkey" FOREIGN KEY ("workspace_id", "root_case_id") REFERENCES "math_pilot_case"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "math_research_cycle" ADD CONSTRAINT "math_research_cycle_command_fkey" FOREIGN KEY ("organization_id", "command_id") REFERENCES "command_record"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "math_research_cycle_event" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "cycle_id" TEXT NOT NULL,
  "sequence" INTEGER NOT NULL,
  "round" INTEGER NOT NULL,
  "phase" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "previous_digest" TEXT,
  "digest" TEXT NOT NULL,
  "job_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "math_research_cycle_event_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "math_research_cycle_event_shape_check" CHECK (
    "sequence" > 0 AND "round" >= 0 AND jsonb_typeof("payload") = 'object' AND
    "digest" ~ '^[a-f0-9]{64}$' AND
    ("previous_digest" IS NULL OR "previous_digest" ~ '^[a-f0-9]{64}$')
  )
);
CREATE UNIQUE INDEX "math_research_cycle_event_cycle_id_sequence_key" ON "math_research_cycle_event"("cycle_id", "sequence");
CREATE INDEX "math_research_cycle_event_org_workspace_cycle_sequence_idx" ON "math_research_cycle_event"("organization_id", "workspace_id", "cycle_id", "sequence");
ALTER TABLE "math_research_cycle_event" ADD CONSTRAINT "math_research_cycle_event_cycle_fkey" FOREIGN KEY ("workspace_id", "cycle_id") REFERENCES "math_research_cycle"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "math_research_cycle_event" ADD CONSTRAINT "math_research_cycle_event_job_fkey" FOREIGN KEY ("job_id") REFERENCES "durable_job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE TRIGGER math_research_cycle_event_append_only BEFORE UPDATE OR DELETE ON "math_research_cycle_event"
  FOR EACH ROW EXECUTE FUNCTION hiveos_reject_research_retained_mutation();

ALTER TABLE "math_research_cycle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "math_research_cycle" FORCE ROW LEVEL SECURITY;
CREATE POLICY "math_research_cycle_tenant_isolation" ON "math_research_cycle"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());
ALTER TABLE "math_research_cycle_event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "math_research_cycle_event" FORCE ROW LEVEL SECURITY;
CREATE POLICY "math_research_cycle_event_tenant_isolation" ON "math_research_cycle_event"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());

CREATE TRIGGER math_research_cycle_source_revision AFTER INSERT OR UPDATE OR DELETE ON "math_research_cycle"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('direct');
