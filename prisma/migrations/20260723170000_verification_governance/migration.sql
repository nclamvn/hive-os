CREATE TYPE "VerificationScenarioKind" AS ENUM ('REQUIREMENT', 'FUNCTIONAL', 'SECURITY', 'ACCESSIBILITY', 'PERFORMANCE', 'OTHER');
CREATE TYPE "VerificationRunStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');
CREATE TYPE "VerificationResult" AS ENUM ('PASS', 'FAIL', 'DEFERRED');
CREATE TYPE "VerifierIndependenceStatus" AS ENUM ('NOT_REQUIRED', 'INDEPENDENT', 'NOT_INDEPENDENT');
CREATE TYPE "CorruptionResult" AS ENUM ('PASS', 'FAIL', 'INCONCLUSIVE');
CREATE TYPE "GovernanceSignoffType" AS ENUM ('VERIFICATION', 'RELEASE');
CREATE TYPE "GovernanceDecision" AS ENUM ('APPROVED', 'REJECTED');
CREATE TYPE "GovernedReleaseStatus" AS ENUM ('APPROVED');
CREATE TYPE "ReleaseVisibility" AS ENUM ('INTERNAL', 'PUBLIC');

CREATE TABLE "verification_scenario" (
  "id" TEXT NOT NULL, "workspace_id" TEXT NOT NULL, "mission_id" TEXT NOT NULL,
  "requirement_id" TEXT, "code" TEXT NOT NULL, "title" TEXT NOT NULL,
  "kind" "VerificationScenarioKind" NOT NULL, "method" TEXT NOT NULL,
  "expected_outcome" TEXT NOT NULL, "required" BOOLEAN NOT NULL DEFAULT true,
  "created_by_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "verification_scenario_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "verification_run" (
  "id" TEXT NOT NULL, "workspace_id" TEXT NOT NULL, "mission_id" TEXT NOT NULL,
  "verifier_agent_run_id" TEXT NOT NULL,
  "status" "VerificationRunStatus" NOT NULL DEFAULT 'IN_PROGRESS',
  "independence_status" "VerifierIndependenceStatus" NOT NULL,
  "created_by_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completed_at" TIMESTAMP(3), "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "verification_run_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "verification_requirement_coverage" (
  "id" TEXT NOT NULL, "workspace_id" TEXT NOT NULL, "mission_id" TEXT NOT NULL,
  "verification_run_id" TEXT NOT NULL, "requirement_id" TEXT NOT NULL,
  "result" "VerificationResult" NOT NULL, "method" TEXT NOT NULL,
  "evidence_artifact_ids" TEXT[] NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "verification_requirement_coverage_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "verification_scenario_result" (
  "id" TEXT NOT NULL, "workspace_id" TEXT NOT NULL, "mission_id" TEXT NOT NULL,
  "verification_run_id" TEXT NOT NULL, "scenario_id" TEXT NOT NULL,
  "result" "VerificationResult" NOT NULL, "severity" "EscalationSeverity",
  "detail" TEXT NOT NULL, "evidence_artifact_ids" TEXT[] NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "verification_scenario_result_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "verification_technical_health" (
  "id" TEXT NOT NULL, "workspace_id" TEXT NOT NULL, "mission_id" TEXT NOT NULL,
  "verification_run_id" TEXT NOT NULL, "content" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "verification_technical_health_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "corruption_test_run" (
  "id" TEXT NOT NULL, "workspace_id" TEXT NOT NULL, "mission_id" TEXT NOT NULL,
  "verification_run_id" TEXT NOT NULL, "code" TEXT NOT NULL, "title" TEXT NOT NULL,
  "method" TEXT NOT NULL, "result" "CorruptionResult" NOT NULL,
  "severity" "EscalationSeverity" NOT NULL, "detail" TEXT NOT NULL,
  "evidence_artifact_ids" TEXT[] NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "corruption_test_run_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "verification_report" (
  "id" TEXT NOT NULL, "workspace_id" TEXT NOT NULL, "mission_id" TEXT NOT NULL,
  "verification_run_id" TEXT NOT NULL, "artifact_id" TEXT NOT NULL,
  "requirement_coverage" JSONB NOT NULL, "scenario_results" JSONB NOT NULL,
  "technical_health" JSONB NOT NULL,
  "overall_status" "ExecutionOverallStatus" NOT NULL,
  "deferred_items" TEXT[] NOT NULL, "content_hash" TEXT NOT NULL,
  "created_by_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "verification_report_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "governance_signoff" (
  "id" TEXT NOT NULL, "workspace_id" TEXT NOT NULL, "mission_id" TEXT NOT NULL,
  "verification_report_id" TEXT NOT NULL,
  "signoff_type" "GovernanceSignoffType" NOT NULL,
  "decision" "GovernanceDecision" NOT NULL, "rationale" TEXT NOT NULL,
  "signed_by_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "governance_signoff_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "evidence_ceiling_assessment" (
  "id" TEXT NOT NULL, "workspace_id" TEXT NOT NULL, "mission_id" TEXT NOT NULL,
  "verification_report_id" TEXT NOT NULL, "claim_version_id" TEXT NOT NULL,
  "ceiling" "AccessLevel" NOT NULL, "eligible_public" BOOLEAN NOT NULL,
  "reasons" TEXT[] NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "evidence_ceiling_assessment_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "governed_release" (
  "id" TEXT NOT NULL, "workspace_id" TEXT NOT NULL, "mission_id" TEXT NOT NULL,
  "verification_report_id" TEXT NOT NULL,
  "status" "GovernedReleaseStatus" NOT NULL DEFAULT 'APPROVED',
  "visibility" "ReleaseVisibility" NOT NULL,
  "approved_by_membership_id" TEXT NOT NULL,
  "approved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "governed_release_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "release_manifest" (
  "id" TEXT NOT NULL, "workspace_id" TEXT NOT NULL, "mission_id" TEXT NOT NULL,
  "release_id" TEXT NOT NULL, "claim_versions" JSONB NOT NULL,
  "artifacts" JSONB NOT NULL, "methods" TEXT[] NOT NULL,
  "limitations" TEXT[] NOT NULL, "approver_membership_ids" TEXT[] NOT NULL,
  "content_hash" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "release_manifest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "verification_scenario_workspace_id_mission_id_idx" ON "verification_scenario"("workspace_id", "mission_id");
CREATE UNIQUE INDEX "verification_scenario_mission_id_code_key" ON "verification_scenario"("mission_id", "code");
CREATE UNIQUE INDEX "verification_run_verifier_agent_run_id_key" ON "verification_run"("verifier_agent_run_id");
CREATE INDEX "verification_run_workspace_id_mission_id_status_idx" ON "verification_run"("workspace_id", "mission_id", "status");
CREATE INDEX "verification_requirement_coverage_workspace_id_mission_id_idx" ON "verification_requirement_coverage"("workspace_id", "mission_id");
CREATE UNIQUE INDEX "verification_requirement_coverage_run_requirement_key" ON "verification_requirement_coverage"("verification_run_id", "requirement_id");
CREATE INDEX "verification_scenario_result_workspace_id_mission_id_idx" ON "verification_scenario_result"("workspace_id", "mission_id");
CREATE UNIQUE INDEX "verification_scenario_result_run_scenario_key" ON "verification_scenario_result"("verification_run_id", "scenario_id");
CREATE UNIQUE INDEX "verification_technical_health_verification_run_id_key" ON "verification_technical_health"("verification_run_id");
CREATE INDEX "verification_technical_health_workspace_id_mission_id_idx" ON "verification_technical_health"("workspace_id", "mission_id");
CREATE INDEX "corruption_test_run_workspace_id_mission_id_idx" ON "corruption_test_run"("workspace_id", "mission_id");
CREATE UNIQUE INDEX "corruption_test_run_verification_run_id_code_key" ON "corruption_test_run"("verification_run_id", "code");
CREATE UNIQUE INDEX "verification_report_verification_run_id_key" ON "verification_report"("verification_run_id");
CREATE UNIQUE INDEX "verification_report_artifact_id_key" ON "verification_report"("artifact_id");
CREATE INDEX "verification_report_workspace_id_mission_id_overall_status_idx" ON "verification_report"("workspace_id", "mission_id", "overall_status");
CREATE INDEX "governance_signoff_workspace_id_mission_id_signoff_type_idx" ON "governance_signoff"("workspace_id", "mission_id", "signoff_type");
CREATE UNIQUE INDEX "governance_signoff_report_type_member_key" ON "governance_signoff"("verification_report_id", "signoff_type", "signed_by_membership_id");
CREATE INDEX "evidence_ceiling_assessment_workspace_id_mission_id_idx" ON "evidence_ceiling_assessment"("workspace_id", "mission_id");
CREATE UNIQUE INDEX "evidence_ceiling_assessment_report_claim_key" ON "evidence_ceiling_assessment"("verification_report_id", "claim_version_id");
CREATE UNIQUE INDEX "governed_release_verification_report_id_key" ON "governed_release"("verification_report_id");
CREATE INDEX "governed_release_workspace_id_mission_id_status_visibility_idx" ON "governed_release"("workspace_id", "mission_id", "status", "visibility");
CREATE UNIQUE INDEX "release_manifest_release_id_key" ON "release_manifest"("release_id");
CREATE UNIQUE INDEX "release_manifest_content_hash_key" ON "release_manifest"("content_hash");
CREATE INDEX "release_manifest_workspace_id_mission_id_idx" ON "release_manifest"("workspace_id", "mission_id");

ALTER TABLE "verification_scenario" ADD CONSTRAINT "verification_scenario_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "verification_scenario" ADD CONSTRAINT "verification_scenario_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "verification_scenario" ADD CONSTRAINT "verification_scenario_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "requirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "verification_run" ADD CONSTRAINT "verification_run_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "verification_run" ADD CONSTRAINT "verification_run_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "verification_run" ADD CONSTRAINT "verification_run_verifier_agent_run_id_fkey" FOREIGN KEY ("verifier_agent_run_id") REFERENCES "agent_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "verification_requirement_coverage" ADD CONSTRAINT "verification_requirement_coverage_run_fkey" FOREIGN KEY ("verification_run_id") REFERENCES "verification_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "verification_requirement_coverage" ADD CONSTRAINT "verification_requirement_coverage_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "requirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "verification_scenario_result" ADD CONSTRAINT "verification_scenario_result_run_fkey" FOREIGN KEY ("verification_run_id") REFERENCES "verification_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "verification_scenario_result" ADD CONSTRAINT "verification_scenario_result_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "verification_scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "verification_technical_health" ADD CONSTRAINT "verification_technical_health_run_fkey" FOREIGN KEY ("verification_run_id") REFERENCES "verification_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "corruption_test_run" ADD CONSTRAINT "corruption_test_run_run_fkey" FOREIGN KEY ("verification_run_id") REFERENCES "verification_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "verification_report" ADD CONSTRAINT "verification_report_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "verification_report" ADD CONSTRAINT "verification_report_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "verification_report" ADD CONSTRAINT "verification_report_run_fkey" FOREIGN KEY ("verification_run_id") REFERENCES "verification_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "verification_report" ADD CONSTRAINT "verification_report_artifact_id_fkey" FOREIGN KEY ("artifact_id") REFERENCES "execution_artifact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "governance_signoff" ADD CONSTRAINT "governance_signoff_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "governance_signoff" ADD CONSTRAINT "governance_signoff_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "governance_signoff" ADD CONSTRAINT "governance_signoff_report_fkey" FOREIGN KEY ("verification_report_id") REFERENCES "verification_report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "evidence_ceiling_assessment" ADD CONSTRAINT "evidence_ceiling_assessment_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "evidence_ceiling_assessment" ADD CONSTRAINT "evidence_ceiling_assessment_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "evidence_ceiling_assessment" ADD CONSTRAINT "evidence_ceiling_assessment_report_fkey" FOREIGN KEY ("verification_report_id") REFERENCES "verification_report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "evidence_ceiling_assessment" ADD CONSTRAINT "evidence_ceiling_assessment_claim_version_id_fkey" FOREIGN KEY ("claim_version_id") REFERENCES "claim_version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "governed_release" ADD CONSTRAINT "governed_release_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "governed_release" ADD CONSTRAINT "governed_release_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "governed_release" ADD CONSTRAINT "governed_release_report_fkey" FOREIGN KEY ("verification_report_id") REFERENCES "verification_report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "release_manifest" ADD CONSTRAINT "release_manifest_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "release_manifest" ADD CONSTRAINT "release_manifest_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "release_manifest" ADD CONSTRAINT "release_manifest_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "governed_release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "verification_run" ADD CONSTRAINT "verification_run_version_positive" CHECK ("version" > 0);
ALTER TABLE "verification_report" ADD CONSTRAINT "verification_report_digest_valid" CHECK ("content_hash" ~ '^[0-9a-f]{64}$');
ALTER TABLE "release_manifest" ADD CONSTRAINT "release_manifest_digest_valid" CHECK ("content_hash" ~ '^[0-9a-f]{64}$');
ALTER TABLE "release_manifest" ADD CONSTRAINT "release_manifest_methods_nonempty" CHECK (cardinality("methods") > 0);
ALTER TABLE "release_manifest" ADD CONSTRAINT "release_manifest_limitations_nonempty" CHECK (cardinality("limitations") > 0);
ALTER TABLE "release_manifest" ADD CONSTRAINT "release_manifest_approvers_nonempty" CHECK (cardinality("approver_membership_ids") > 0);

CREATE OR REPLACE FUNCTION hiveos_verification_ledger_append_only()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% is append-only: % is not permitted', TG_TABLE_NAME, TG_OP
    USING ERRCODE = 'restrict_violation';
END;
$$;

CREATE TRIGGER verification_scenario_no_update_delete BEFORE UPDATE OR DELETE ON "verification_scenario" FOR EACH ROW EXECUTE FUNCTION hiveos_verification_ledger_append_only();
CREATE TRIGGER verification_requirement_coverage_no_update_delete BEFORE UPDATE OR DELETE ON "verification_requirement_coverage" FOR EACH ROW EXECUTE FUNCTION hiveos_verification_ledger_append_only();
CREATE TRIGGER verification_scenario_result_no_update_delete BEFORE UPDATE OR DELETE ON "verification_scenario_result" FOR EACH ROW EXECUTE FUNCTION hiveos_verification_ledger_append_only();
CREATE TRIGGER verification_technical_health_no_update_delete BEFORE UPDATE OR DELETE ON "verification_technical_health" FOR EACH ROW EXECUTE FUNCTION hiveos_verification_ledger_append_only();
CREATE TRIGGER corruption_test_run_no_update_delete BEFORE UPDATE OR DELETE ON "corruption_test_run" FOR EACH ROW EXECUTE FUNCTION hiveos_verification_ledger_append_only();
CREATE TRIGGER verification_report_no_update_delete BEFORE UPDATE OR DELETE ON "verification_report" FOR EACH ROW EXECUTE FUNCTION hiveos_verification_ledger_append_only();
CREATE TRIGGER governance_signoff_no_update_delete BEFORE UPDATE OR DELETE ON "governance_signoff" FOR EACH ROW EXECUTE FUNCTION hiveos_verification_ledger_append_only();
CREATE TRIGGER evidence_ceiling_assessment_no_update_delete BEFORE UPDATE OR DELETE ON "evidence_ceiling_assessment" FOR EACH ROW EXECUTE FUNCTION hiveos_verification_ledger_append_only();
CREATE TRIGGER governed_release_no_update_delete BEFORE UPDATE OR DELETE ON "governed_release" FOR EACH ROW EXECUTE FUNCTION hiveos_verification_ledger_append_only();
CREATE TRIGGER release_manifest_no_update_delete BEFORE UPDATE OR DELETE ON "release_manifest" FOR EACH ROW EXECUTE FUNCTION hiveos_verification_ledger_append_only();
CREATE TRIGGER verification_run_no_delete BEFORE DELETE ON "verification_run" FOR EACH ROW EXECUTE FUNCTION hiveos_verification_ledger_append_only();

CREATE OR REPLACE FUNCTION hiveos_verification_run_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD."status" <> 'IN_PROGRESS'
     OR NEW."status" <> 'COMPLETED'
     OR NEW."workspace_id" IS DISTINCT FROM OLD."workspace_id"
     OR NEW."mission_id" IS DISTINCT FROM OLD."mission_id"
     OR NEW."verifier_agent_run_id" IS DISTINCT FROM OLD."verifier_agent_run_id"
     OR NEW."independence_status" IS DISTINCT FROM OLD."independence_status"
     OR NEW."created_by_membership_id" IS DISTINCT FROM OLD."created_by_membership_id"
     OR NEW."created_at" IS DISTINCT FROM OLD."created_at"
     OR NEW."completed_at" IS NULL
     OR NEW."version" <> OLD."version" + 1 THEN
    RAISE EXCEPTION 'verification_run may only receive one governed completion'
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER verification_run_guard BEFORE UPDATE ON "verification_run" FOR EACH ROW EXECUTE FUNCTION hiveos_verification_run_guard();

-- Align the TIP-007 index name with the Prisma schema's deterministic name.
ALTER INDEX "execution_tip_dependency_predecessor_tip_id_dependent_tip_id_ke"
  RENAME TO "execution_tip_dependency_predecessor_tip_id_dependent_tip_i_key";
