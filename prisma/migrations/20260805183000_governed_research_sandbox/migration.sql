-- TIP-024B — Governed Research Agent and Computational Sandbox.
-- Provider workers are external to the web process. This migration retains
-- bounded requests, immutable source/finding/review records and sandbox output
-- manifests under organization-scoped row-level security.

CREATE TYPE "ResearchRunStatus" AS ENUM (
  'QUEUED', 'RUNNING', 'AWAITING_REVIEW', 'APPROVED', 'REJECTED', 'FAILED', 'CANCELLED'
);
CREATE TYPE "ResearchProvenance" AS ENUM ('VERIFIED_PRIMARY', 'CLAIM', 'FLAGGED');
CREATE TYPE "ResearchFindingKind" AS ENUM ('SUPPORTING', 'CONFLICTING', 'CONTEXT', 'HONEST_NULL');
CREATE TYPE "ResearchDecision" AS ENUM ('ACCEPTED', 'REJECTED', 'FLAGGED');
CREATE TYPE "ComputationKind" AS ENUM ('LATEX_BUILD', 'CAS', 'JUPYTER');
CREATE TYPE "ComputationRunStatus" AS ENUM (
  'QUEUED', 'RUNNING', 'AWAITING_REVIEW', 'APPROVED', 'REJECTED', 'FAILED', 'CANCELLED'
);
CREATE TYPE "SandboxNetworkPolicy" AS ENUM ('DENY_ALL', 'ALLOWLIST');

CREATE TABLE "research_run" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "document_id" TEXT,
  "question" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "source_policy" JSONB NOT NULL,
  "query_plan" JSONB NOT NULL,
  "provider_name" TEXT NOT NULL,
  "model_name" TEXT NOT NULL,
  "status" "ResearchRunStatus" NOT NULL DEFAULT 'QUEUED',
  "command_id" TEXT NOT NULL,
  "job_id" TEXT,
  "requested_by_membership_id" TEXT NOT NULL,
  "reviewed_by_membership_id" TEXT,
  "review_rationale" TEXT,
  "approved_digest" TEXT,
  "failure_code" TEXT,
  "started_at" TIMESTAMP(3),
  "completed_at" TIMESTAMP(3),
  "reviewed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "research_run_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "research_run_question_bounded" CHECK (char_length("question") BETWEEN 1 AND 8000),
  CONSTRAINT "research_run_scope_bounded" CHECK (char_length("scope") BETWEEN 1 AND 8000),
  CONSTRAINT "research_run_digest_shape" CHECK ("approved_digest" IS NULL OR "approved_digest" ~ '^[a-f0-9]{64}$'),
  CONSTRAINT "research_run_version_positive" CHECK ("version" > 0)
);

CREATE TABLE "research_source_snapshot" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "research_run_id" TEXT NOT NULL,
  "canonical_uri" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "publisher" TEXT NOT NULL,
  "media_type" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "content_digest" TEXT NOT NULL,
  "provenance" "ResearchProvenance" NOT NULL,
  "captured_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "research_source_snapshot_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "research_source_digest_shape" CHECK ("content_digest" ~ '^[a-f0-9]{64}$'),
  CONSTRAINT "research_source_content_bounded" CHECK (octet_length("content") BETWEEN 1 AND 1048576)
);

CREATE TABLE "research_finding" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "research_run_id" TEXT NOT NULL,
  "source_id" TEXT,
  "finding_key" TEXT NOT NULL,
  "kind" "ResearchFindingKind" NOT NULL,
  "claim" TEXT NOT NULL,
  "exact_excerpt" TEXT NOT NULL,
  "start_offset" INTEGER,
  "end_offset" INTEGER,
  "confidence" DECIMAL(5,4) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "research_finding_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "research_finding_confidence_range" CHECK ("confidence" BETWEEN 0 AND 1),
  CONSTRAINT "research_finding_claim_bounded" CHECK (char_length("claim") BETWEEN 1 AND 8000),
  CONSTRAINT "research_finding_span_shape" CHECK (
    ("kind" = 'HONEST_NULL' AND "source_id" IS NULL AND "start_offset" IS NULL AND "end_offset" IS NULL AND "exact_excerpt" = '')
    OR
    ("kind" <> 'HONEST_NULL' AND "source_id" IS NOT NULL AND "start_offset" >= 0 AND "end_offset" > "start_offset" AND char_length("exact_excerpt") > 0)
  )
);

CREATE TABLE "research_finding_decision" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "research_run_id" TEXT NOT NULL,
  "finding_id" TEXT NOT NULL,
  "decision" "ResearchDecision" NOT NULL,
  "rationale" TEXT NOT NULL,
  "reviewed_by_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "research_finding_decision_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "research_decision_rationale_bounded" CHECK (char_length("rationale") BETWEEN 1 AND 4000)
);

CREATE TABLE "computation_run" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "document_id" TEXT,
  "research_run_id" TEXT,
  "kind" "ComputationKind" NOT NULL,
  "runtime_id" TEXT NOT NULL,
  "runtime_version" TEXT NOT NULL,
  "entrypoint" TEXT NOT NULL,
  "network_policy" "SandboxNetworkPolicy" NOT NULL DEFAULT 'DENY_ALL',
  "network_allowlist" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "resource_limits" JSONB NOT NULL,
  "input_reference" TEXT NOT NULL,
  "input_digest" TEXT NOT NULL,
  "status" "ComputationRunStatus" NOT NULL DEFAULT 'QUEUED',
  "command_id" TEXT NOT NULL,
  "job_id" TEXT,
  "output_reference" TEXT,
  "output_digest" TEXT,
  "output_media_type" TEXT,
  "output_bytes" INTEGER,
  "requested_by_membership_id" TEXT NOT NULL,
  "reviewed_by_membership_id" TEXT,
  "review_rationale" TEXT,
  "failure_code" TEXT,
  "started_at" TIMESTAMP(3),
  "completed_at" TIMESTAMP(3),
  "reviewed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "computation_run_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "computation_input_digest_shape" CHECK ("input_digest" ~ '^[a-f0-9]{64}$'),
  CONSTRAINT "computation_output_digest_shape" CHECK ("output_digest" IS NULL OR "output_digest" ~ '^[a-f0-9]{64}$'),
  CONSTRAINT "computation_output_bytes_nonnegative" CHECK ("output_bytes" IS NULL OR "output_bytes" >= 0),
  CONSTRAINT "computation_allowlist_shape" CHECK (jsonb_typeof("network_allowlist") = 'array'),
  CONSTRAINT "computation_resource_limits_shape" CHECK (jsonb_typeof("resource_limits") = 'object'),
  CONSTRAINT "computation_version_positive" CHECK ("version" > 0)
);

CREATE UNIQUE INDEX "research_run_command_id_key" ON "research_run"("command_id");
CREATE UNIQUE INDEX "research_run_job_id_key" ON "research_run"("job_id");
CREATE UNIQUE INDEX "research_run_workspace_id_id_key" ON "research_run"("workspace_id", "id");
CREATE INDEX "research_run_organization_workspace_status_created_idx" ON "research_run"("organization_id", "workspace_id", "status", "created_at");
CREATE INDEX "research_run_workspace_mission_created_idx" ON "research_run"("workspace_id", "mission_id", "created_at");

CREATE UNIQUE INDEX "research_source_run_uri_digest_key" ON "research_source_snapshot"("research_run_id", "canonical_uri", "content_digest");
CREATE UNIQUE INDEX "research_source_workspace_id_id_key" ON "research_source_snapshot"("workspace_id", "id");
CREATE INDEX "research_source_org_workspace_run_captured_idx" ON "research_source_snapshot"("organization_id", "workspace_id", "research_run_id", "captured_at");

CREATE UNIQUE INDEX "research_finding_run_key_key" ON "research_finding"("research_run_id", "finding_key");
CREATE UNIQUE INDEX "research_finding_workspace_id_id_key" ON "research_finding"("workspace_id", "id");
CREATE INDEX "research_finding_org_workspace_run_kind_idx" ON "research_finding"("organization_id", "workspace_id", "research_run_id", "kind");

CREATE UNIQUE INDEX "research_decision_finding_key" ON "research_finding_decision"("finding_id");
CREATE UNIQUE INDEX "research_decision_workspace_finding_key" ON "research_finding_decision"("workspace_id", "finding_id");
CREATE INDEX "research_decision_org_workspace_run_created_idx" ON "research_finding_decision"("organization_id", "workspace_id", "research_run_id", "created_at");

CREATE UNIQUE INDEX "computation_run_command_id_key" ON "computation_run"("command_id");
CREATE UNIQUE INDEX "computation_run_job_id_key" ON "computation_run"("job_id");
CREATE UNIQUE INDEX "computation_run_workspace_id_id_key" ON "computation_run"("workspace_id", "id");
CREATE INDEX "computation_run_org_workspace_status_created_idx" ON "computation_run"("organization_id", "workspace_id", "status", "created_at");
CREATE INDEX "computation_run_workspace_mission_created_idx" ON "computation_run"("workspace_id", "mission_id", "created_at");

ALTER TABLE "research_run"
  ADD CONSTRAINT "research_run_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_run_workspace_fkey" FOREIGN KEY ("organization_id", "workspace_id") REFERENCES "workspace"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_run_mission_fkey" FOREIGN KEY ("workspace_id", "mission_id") REFERENCES "mission"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_run_document_fkey" FOREIGN KEY ("workspace_id", "document_id") REFERENCES "authoring_document"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_run_requester_fkey" FOREIGN KEY ("requested_by_membership_id") REFERENCES "membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_run_reviewer_fkey" FOREIGN KEY ("reviewed_by_membership_id") REFERENCES "membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "research_source_snapshot"
  ADD CONSTRAINT "research_source_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_source_workspace_fkey" FOREIGN KEY ("organization_id", "workspace_id") REFERENCES "workspace"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_source_mission_fkey" FOREIGN KEY ("workspace_id", "mission_id") REFERENCES "mission"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_source_run_fkey" FOREIGN KEY ("workspace_id", "research_run_id") REFERENCES "research_run"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "research_finding"
  ADD CONSTRAINT "research_finding_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_finding_workspace_fkey" FOREIGN KEY ("organization_id", "workspace_id") REFERENCES "workspace"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_finding_mission_fkey" FOREIGN KEY ("workspace_id", "mission_id") REFERENCES "mission"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_finding_run_fkey" FOREIGN KEY ("workspace_id", "research_run_id") REFERENCES "research_run"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_finding_source_fkey" FOREIGN KEY ("workspace_id", "source_id") REFERENCES "research_source_snapshot"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "research_finding_decision"
  ADD CONSTRAINT "research_decision_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_decision_workspace_fkey" FOREIGN KEY ("organization_id", "workspace_id") REFERENCES "workspace"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_decision_mission_fkey" FOREIGN KEY ("workspace_id", "mission_id") REFERENCES "mission"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_decision_run_fkey" FOREIGN KEY ("workspace_id", "research_run_id") REFERENCES "research_run"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_decision_finding_fkey" FOREIGN KEY ("workspace_id", "finding_id") REFERENCES "research_finding"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "research_decision_reviewer_fkey" FOREIGN KEY ("reviewed_by_membership_id") REFERENCES "membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "computation_run"
  ADD CONSTRAINT "computation_run_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "computation_run_workspace_fkey" FOREIGN KEY ("organization_id", "workspace_id") REFERENCES "workspace"("organization_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "computation_run_mission_fkey" FOREIGN KEY ("workspace_id", "mission_id") REFERENCES "mission"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "computation_run_document_fkey" FOREIGN KEY ("workspace_id", "document_id") REFERENCES "authoring_document"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "computation_run_research_fkey" FOREIGN KEY ("workspace_id", "research_run_id") REFERENCES "research_run"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "computation_run_requester_fkey" FOREIGN KEY ("requested_by_membership_id") REFERENCES "membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "computation_run_reviewer_fkey" FOREIGN KEY ("reviewed_by_membership_id") REFERENCES "membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION hiveos_reject_research_retained_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'research retained record is append-only';
END
$$;
REVOKE ALL ON FUNCTION hiveos_reject_research_retained_mutation() FROM PUBLIC;

CREATE TRIGGER research_source_append_only BEFORE UPDATE OR DELETE ON "research_source_snapshot"
  FOR EACH ROW EXECUTE FUNCTION hiveos_reject_research_retained_mutation();
CREATE TRIGGER research_finding_append_only BEFORE UPDATE OR DELETE ON "research_finding"
  FOR EACH ROW EXECUTE FUNCTION hiveos_reject_research_retained_mutation();
CREATE TRIGGER research_decision_append_only BEFORE UPDATE OR DELETE ON "research_finding_decision"
  FOR EACH ROW EXECUTE FUNCTION hiveos_reject_research_retained_mutation();

ALTER TABLE "research_run" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "research_run" FORCE ROW LEVEL SECURITY;
CREATE POLICY "research_run_tenant_isolation" ON "research_run"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());

ALTER TABLE "research_source_snapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "research_source_snapshot" FORCE ROW LEVEL SECURITY;
CREATE POLICY "research_source_tenant_isolation" ON "research_source_snapshot"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());

ALTER TABLE "research_finding" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "research_finding" FORCE ROW LEVEL SECURITY;
CREATE POLICY "research_finding_tenant_isolation" ON "research_finding"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());

ALTER TABLE "research_finding_decision" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "research_finding_decision" FORCE ROW LEVEL SECURITY;
CREATE POLICY "research_decision_tenant_isolation" ON "research_finding_decision"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());

ALTER TABLE "computation_run" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "computation_run" FORCE ROW LEVEL SECURITY;
CREATE POLICY "computation_run_tenant_isolation" ON "computation_run"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());

CREATE TRIGGER research_run_source_revision AFTER INSERT OR UPDATE OR DELETE ON "research_run"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('direct');
CREATE TRIGGER research_source_source_revision AFTER INSERT OR UPDATE OR DELETE ON "research_source_snapshot"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('direct');
CREATE TRIGGER research_finding_source_revision AFTER INSERT OR UPDATE OR DELETE ON "research_finding"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('direct');
CREATE TRIGGER research_decision_source_revision AFTER INSERT OR UPDATE OR DELETE ON "research_finding_decision"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('direct');
CREATE TRIGGER computation_run_source_revision AFTER INSERT OR UPDATE OR DELETE ON "computation_run"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('direct');
