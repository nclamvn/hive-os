-- TIP-007 — provider-independent Execution Fabric and Manual Provider Bridge.

CREATE TYPE "ExecutionRole" AS ENUM ('CONTRACTOR', 'BUILDER', 'VERIFIER');
CREATE TYPE "ExecutionTipStatus" AS ENUM ('READY', 'IN_PROGRESS', 'BLOCKED', 'BLOCKED_DEVIATION', 'DONE', 'PARTIAL', 'CANCELLED');
CREATE TYPE "SkillRunStatus" AS ENUM ('READY', 'IN_PROGRESS', 'DONE', 'PARTIAL', 'BLOCKED');
CREATE TYPE "AgentRunStatus" AS ENUM ('AWAITING_REPORT', 'DONE', 'PARTIAL', 'BLOCKED');
CREATE TYPE "ExecutionArtifactKind" AS ENUM ('INSTRUCTION', 'COMPLETION_REPORT', 'OUTPUT', 'RECEIPT');
CREATE TYPE "CompletionResult" AS ENUM ('DONE', 'PARTIAL', 'BLOCKED');
CREATE TYPE "ExecutionOverallStatus" AS ENUM ('READY', 'READY_WITH_DEFERRED', 'NOT_READY');
CREATE TYPE "ExecutionDeviationStatus" AS ENUM ('OPEN', 'RESOLVED');

CREATE TABLE "execution_tip" (
  "id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "skill_version_id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "ExecutionTipStatus" NOT NULL DEFAULT 'READY',
  "created_by_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "execution_tip_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "execution_tip_dependency" (
  "id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "predecessor_tip_id" TEXT NOT NULL,
  "dependent_tip_id" TEXT NOT NULL,
  "created_by_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "execution_tip_dependency_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "execution_artifact" (
  "id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "tip_id" TEXT,
  "kind" "ExecutionArtifactKind" NOT NULL,
  "media_type" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "content_hash" TEXT NOT NULL,
  "size_bytes" INTEGER NOT NULL,
  "created_by_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "execution_artifact_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "skill_run" (
  "id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "tip_id" TEXT NOT NULL,
  "skill_version_id" TEXT NOT NULL,
  "status" "SkillRunStatus" NOT NULL DEFAULT 'READY',
  "created_by_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "skill_run_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "agent_run" (
  "id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "skill_run_id" TEXT NOT NULL,
  "attempt_number" INTEGER NOT NULL,
  "execution_role" "ExecutionRole" NOT NULL,
  "provider_name" TEXT NOT NULL,
  "model_name" TEXT NOT NULL,
  "provider_mode" TEXT NOT NULL DEFAULT 'MANUAL_BRIDGE',
  "status" "AgentRunStatus" NOT NULL DEFAULT 'AWAITING_REPORT',
  "input_artifact_id" TEXT NOT NULL,
  "output_artifact_id" TEXT,
  "previous_run_id" TEXT,
  "created_by_membership_id" TEXT NOT NULL,
  "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completed_at" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "agent_run_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "completion_report" (
  "id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "run_id" TEXT NOT NULL,
  "artifact_id" TEXT NOT NULL,
  "result" "CompletionResult" NOT NULL,
  "summary" TEXT NOT NULL,
  "requirement_coverage" JSONB NOT NULL,
  "scenario_results" JSONB NOT NULL,
  "technical_health" JSONB NOT NULL,
  "overall_status" "ExecutionOverallStatus" NOT NULL,
  "imported_by_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "completion_report_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "execution_deviation" (
  "id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "tip_id" TEXT NOT NULL,
  "report_id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "materiality" TEXT NOT NULL,
  "proposed_resolution" TEXT NOT NULL,
  "status" "ExecutionDeviationStatus" NOT NULL DEFAULT 'OPEN',
  "resolved_by_membership_id" TEXT,
  "resolution" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolved_at" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "execution_deviation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "resource_usage_record" (
  "id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "run_id" TEXT NOT NULL,
  "report_id" TEXT NOT NULL,
  "metric" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unit" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "resource_usage_record_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "execution_tip_mission_id_code_key" ON "execution_tip"("mission_id", "code");
CREATE INDEX "execution_tip_workspace_id_mission_id_status_idx" ON "execution_tip"("workspace_id", "mission_id", "status");
CREATE UNIQUE INDEX "execution_tip_dependency_predecessor_tip_id_dependent_tip_id_key" ON "execution_tip_dependency"("predecessor_tip_id", "dependent_tip_id");
CREATE INDEX "execution_tip_dependency_workspace_id_mission_id_idx" ON "execution_tip_dependency"("workspace_id", "mission_id");
CREATE INDEX "execution_artifact_workspace_id_content_hash_idx" ON "execution_artifact"("workspace_id", "content_hash");
CREATE INDEX "execution_artifact_workspace_id_mission_id_kind_idx" ON "execution_artifact"("workspace_id", "mission_id", "kind");
CREATE INDEX "skill_run_workspace_id_mission_id_status_idx" ON "skill_run"("workspace_id", "mission_id", "status");
CREATE UNIQUE INDEX "agent_run_output_artifact_id_key" ON "agent_run"("output_artifact_id");
CREATE UNIQUE INDEX "agent_run_skill_run_id_attempt_number_key" ON "agent_run"("skill_run_id", "attempt_number");
CREATE INDEX "agent_run_workspace_id_mission_id_status_idx" ON "agent_run"("workspace_id", "mission_id", "status");
CREATE UNIQUE INDEX "completion_report_run_id_key" ON "completion_report"("run_id");
CREATE UNIQUE INDEX "completion_report_artifact_id_key" ON "completion_report"("artifact_id");
CREATE INDEX "completion_report_workspace_id_mission_id_idx" ON "completion_report"("workspace_id", "mission_id");
CREATE UNIQUE INDEX "execution_deviation_report_id_code_key" ON "execution_deviation"("report_id", "code");
CREATE INDEX "execution_deviation_workspace_id_mission_id_status_idx" ON "execution_deviation"("workspace_id", "mission_id", "status");
CREATE UNIQUE INDEX "resource_usage_record_report_id_metric_unit_key" ON "resource_usage_record"("report_id", "metric", "unit");
CREATE INDEX "resource_usage_record_workspace_id_mission_id_idx" ON "resource_usage_record"("workspace_id", "mission_id");

ALTER TABLE "execution_tip" ADD CONSTRAINT "execution_tip_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "execution_tip" ADD CONSTRAINT "execution_tip_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "execution_tip" ADD CONSTRAINT "execution_tip_skill_version_id_fkey" FOREIGN KEY ("skill_version_id") REFERENCES "skill_version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "execution_tip_dependency" ADD CONSTRAINT "execution_tip_dependency_predecessor_tip_id_fkey" FOREIGN KEY ("predecessor_tip_id") REFERENCES "execution_tip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "execution_tip_dependency" ADD CONSTRAINT "execution_tip_dependency_dependent_tip_id_fkey" FOREIGN KEY ("dependent_tip_id") REFERENCES "execution_tip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "execution_artifact" ADD CONSTRAINT "execution_artifact_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "execution_artifact" ADD CONSTRAINT "execution_artifact_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "execution_artifact" ADD CONSTRAINT "execution_artifact_tip_id_fkey" FOREIGN KEY ("tip_id") REFERENCES "execution_tip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "skill_run" ADD CONSTRAINT "skill_run_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "skill_run" ADD CONSTRAINT "skill_run_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "skill_run" ADD CONSTRAINT "skill_run_tip_id_fkey" FOREIGN KEY ("tip_id") REFERENCES "execution_tip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "skill_run" ADD CONSTRAINT "skill_run_skill_version_id_fkey" FOREIGN KEY ("skill_version_id") REFERENCES "skill_version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "agent_run" ADD CONSTRAINT "agent_run_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "agent_run" ADD CONSTRAINT "agent_run_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "agent_run" ADD CONSTRAINT "agent_run_skill_run_id_fkey" FOREIGN KEY ("skill_run_id") REFERENCES "skill_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "agent_run" ADD CONSTRAINT "agent_run_input_artifact_id_fkey" FOREIGN KEY ("input_artifact_id") REFERENCES "execution_artifact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "agent_run" ADD CONSTRAINT "agent_run_output_artifact_id_fkey" FOREIGN KEY ("output_artifact_id") REFERENCES "execution_artifact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "agent_run" ADD CONSTRAINT "agent_run_previous_run_id_fkey" FOREIGN KEY ("previous_run_id") REFERENCES "agent_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "completion_report" ADD CONSTRAINT "completion_report_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "completion_report" ADD CONSTRAINT "completion_report_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "completion_report" ADD CONSTRAINT "completion_report_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "agent_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "completion_report" ADD CONSTRAINT "completion_report_artifact_id_fkey" FOREIGN KEY ("artifact_id") REFERENCES "execution_artifact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "execution_deviation" ADD CONSTRAINT "execution_deviation_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "execution_deviation" ADD CONSTRAINT "execution_deviation_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "execution_deviation" ADD CONSTRAINT "execution_deviation_tip_id_fkey" FOREIGN KEY ("tip_id") REFERENCES "execution_tip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "execution_deviation" ADD CONSTRAINT "execution_deviation_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "completion_report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "resource_usage_record" ADD CONSTRAINT "resource_usage_record_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resource_usage_record" ADD CONSTRAINT "resource_usage_record_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resource_usage_record" ADD CONSTRAINT "resource_usage_record_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "agent_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "resource_usage_record" ADD CONSTRAINT "resource_usage_record_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "completion_report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "execution_tip" ADD CONSTRAINT "execution_tip_version_positive" CHECK ("version" > 0);
ALTER TABLE "execution_tip_dependency" ADD CONSTRAINT "execution_tip_dependency_not_self" CHECK ("predecessor_tip_id" <> "dependent_tip_id");
ALTER TABLE "execution_artifact" ADD CONSTRAINT "execution_artifact_digest_valid" CHECK ("content_hash" ~ '^[0-9a-f]{64}$');
ALTER TABLE "execution_artifact" ADD CONSTRAINT "execution_artifact_size_nonnegative" CHECK ("size_bytes" >= 0);
ALTER TABLE "skill_run" ADD CONSTRAINT "skill_run_version_positive" CHECK ("version" > 0);
ALTER TABLE "agent_run" ADD CONSTRAINT "agent_run_attempt_positive" CHECK ("attempt_number" > 0);
ALTER TABLE "agent_run" ADD CONSTRAINT "agent_run_mode_manual" CHECK ("provider_mode" = 'MANUAL_BRIDGE');
ALTER TABLE "resource_usage_record" ADD CONSTRAINT "resource_usage_quantity_nonnegative" CHECK ("quantity" >= 0);

CREATE OR REPLACE FUNCTION hiveos_execution_ledger_append_only()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% is append-only: % is not permitted', TG_TABLE_NAME, TG_OP
    USING ERRCODE = 'restrict_violation';
END;
$$;

CREATE TRIGGER execution_tip_dependency_no_update_delete
  BEFORE UPDATE OR DELETE ON "execution_tip_dependency"
  FOR EACH ROW EXECUTE FUNCTION hiveos_execution_ledger_append_only();
CREATE TRIGGER execution_artifact_no_update_delete
  BEFORE UPDATE OR DELETE ON "execution_artifact"
  FOR EACH ROW EXECUTE FUNCTION hiveos_execution_ledger_append_only();
CREATE TRIGGER completion_report_no_update_delete
  BEFORE UPDATE OR DELETE ON "completion_report"
  FOR EACH ROW EXECUTE FUNCTION hiveos_execution_ledger_append_only();
CREATE TRIGGER resource_usage_record_no_update_delete
  BEFORE UPDATE OR DELETE ON "resource_usage_record"
  FOR EACH ROW EXECUTE FUNCTION hiveos_execution_ledger_append_only();

-- Agent attempts may only receive their terminal result once. Stable provider,
-- role, input, attempt number and retry lineage can never be rewritten.
CREATE OR REPLACE FUNCTION hiveos_agent_run_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD."status" <> 'AWAITING_REPORT' THEN
    RAISE EXCEPTION 'completed agent_run is immutable'
      USING ERRCODE = 'restrict_violation';
  END IF;
  IF NEW."workspace_id" IS DISTINCT FROM OLD."workspace_id"
     OR NEW."mission_id" IS DISTINCT FROM OLD."mission_id"
     OR NEW."skill_run_id" IS DISTINCT FROM OLD."skill_run_id"
     OR NEW."attempt_number" IS DISTINCT FROM OLD."attempt_number"
     OR NEW."execution_role" IS DISTINCT FROM OLD."execution_role"
     OR NEW."provider_name" IS DISTINCT FROM OLD."provider_name"
     OR NEW."model_name" IS DISTINCT FROM OLD."model_name"
     OR NEW."provider_mode" IS DISTINCT FROM OLD."provider_mode"
     OR NEW."input_artifact_id" IS DISTINCT FROM OLD."input_artifact_id"
     OR NEW."previous_run_id" IS DISTINCT FROM OLD."previous_run_id"
     OR NEW."created_by_membership_id" IS DISTINCT FROM OLD."created_by_membership_id"
     OR NEW."started_at" IS DISTINCT FROM OLD."started_at" THEN
    RAISE EXCEPTION 'agent_run stable attempt identity is immutable'
      USING ERRCODE = 'restrict_violation';
  END IF;
  IF NEW."status" = 'AWAITING_REPORT'
     OR NEW."output_artifact_id" IS NULL
     OR NEW."completed_at" IS NULL THEN
    RAISE EXCEPTION 'agent_run may only update to a complete terminal projection'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER agent_run_guard
  BEFORE UPDATE ON "agent_run"
  FOR EACH ROW EXECUTE FUNCTION hiveos_agent_run_guard();
CREATE TRIGGER agent_run_no_delete
  BEFORE DELETE ON "agent_run"
  FOR EACH ROW EXECUTE FUNCTION hiveos_execution_ledger_append_only();

-- Deviation text is retained from the imported report; only the governed
-- resolution projection can move from OPEN to RESOLVED once.
CREATE OR REPLACE FUNCTION hiveos_execution_deviation_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD."status" <> 'OPEN'
     OR NEW."status" <> 'RESOLVED'
     OR NEW."workspace_id" IS DISTINCT FROM OLD."workspace_id"
     OR NEW."mission_id" IS DISTINCT FROM OLD."mission_id"
     OR NEW."tip_id" IS DISTINCT FROM OLD."tip_id"
     OR NEW."report_id" IS DISTINCT FROM OLD."report_id"
     OR NEW."code" IS DISTINCT FROM OLD."code"
     OR NEW."title" IS DISTINCT FROM OLD."title"
     OR NEW."description" IS DISTINCT FROM OLD."description"
     OR NEW."materiality" IS DISTINCT FROM OLD."materiality"
     OR NEW."proposed_resolution" IS DISTINCT FROM OLD."proposed_resolution"
     OR NEW."resolved_by_membership_id" IS NULL
     OR NEW."resolution" IS NULL
     OR NEW."resolved_at" IS NULL
     OR NEW."version" <> OLD."version" + 1 THEN
    RAISE EXCEPTION 'execution_deviation may only receive one governed resolution'
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER execution_deviation_guard
  BEFORE UPDATE ON "execution_deviation"
  FOR EACH ROW EXECUTE FUNCTION hiveos_execution_deviation_guard();
CREATE TRIGGER execution_deviation_no_delete
  BEFORE DELETE ON "execution_deviation"
  FOR EACH ROW EXECUTE FUNCTION hiveos_execution_ledger_append_only();
