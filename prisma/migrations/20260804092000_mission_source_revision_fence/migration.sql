-- TIP-023G: a monotonic source-revision fence makes a streamed dossier either
-- internally consistent or retryable when any governed source changes.
CREATE TABLE "mission_source_revision" (
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "revision" BIGINT NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "mission_source_revision_pkey" PRIMARY KEY ("workspace_id", "mission_id")
);

CREATE UNIQUE INDEX "mission_source_revision_organization_id_workspace_id_mission_id_key"
  ON "mission_source_revision"("organization_id", "workspace_id", "mission_id");
CREATE INDEX "mission_source_revision_organization_id_workspace_id_idx"
  ON "mission_source_revision"("organization_id", "workspace_id");

ALTER TABLE "mission_source_revision"
  ADD CONSTRAINT "mission_source_revision_organization_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "mission_source_revision_workspace_fkey"
    FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "mission_source_revision_mission_fkey"
    FOREIGN KEY ("workspace_id", "mission_id")
    REFERENCES "mission"("workspace_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "mission_source_revision"
  ("organization_id", "workspace_id", "mission_id", "revision", "updated_at")
SELECT w."organization_id", m."workspace_id", m."id", 0, CURRENT_TIMESTAMP
FROM "mission" m
JOIN "workspace" w ON w."id" = m."workspace_id";

ALTER TABLE "dossier_export"
  ADD COLUMN "source_revision" BIGINT NOT NULL DEFAULT 0;

UPDATE "dossier_export" de
SET "source_revision" = sr."revision"
FROM "mission_source_revision" sr
WHERE sr."workspace_id" = de."workspace_id"
  AND sr."mission_id" = de."mission_id";

ALTER TABLE "mission_source_revision" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "mission_source_revision" FORCE ROW LEVEL SECURITY;
CREATE POLICY "mission_source_revision_tenant_isolation"
  ON "mission_source_revision"
  USING (organization_id = hiveos_rls_organization_id())
  WITH CHECK (organization_id = hiveos_rls_organization_id());

CREATE OR REPLACE FUNCTION hiveos_bump_mission_source_revision()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_row jsonb;
  v_workspace_id text;
  v_mission_id text;
  v_organization_id text;
BEGIN
  v_row := CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END;

  IF TG_ARGV[0] = 'mission' THEN
    v_workspace_id := v_row->>'workspace_id';
    v_mission_id := v_row->>'id';
  ELSIF TG_ARGV[0] = 'direct' THEN
    v_workspace_id := v_row->>'workspace_id';
    v_mission_id := v_row->>'mission_id';
  ELSIF TG_ARGV[0] = 'contract' THEN
    SELECT mc.workspace_id, mc.mission_id
      INTO v_workspace_id, v_mission_id
    FROM mission_contract mc
    WHERE mc.id = v_row->>'contract_id';
  ELSIF TG_ARGV[0] = 'claim_version' THEN
    SELECT cv.workspace_id, cv.mission_id
      INTO v_workspace_id, v_mission_id
    FROM claim_version cv
    WHERE cv.id = v_row->>'claim_version_id';
  ELSIF TG_ARGV[0] = 'workflow_request' THEN
    SELECT wr.workspace_id, wr.mission_id
      INTO v_workspace_id, v_mission_id
    FROM workflow_approval_request wr
    WHERE wr.id = v_row->>'request_id';
  ELSE
    RAISE EXCEPTION 'unknown mission source revision scope';
  END IF;

  IF v_workspace_id IS NULL OR v_mission_id IS NULL THEN
    RAISE EXCEPTION 'cannot resolve mission source revision scope';
  END IF;

  SELECT w.organization_id INTO STRICT v_organization_id
  FROM workspace w WHERE w.id = v_workspace_id;

  INSERT INTO mission_source_revision
    (organization_id, workspace_id, mission_id, revision, updated_at)
  VALUES
    (v_organization_id, v_workspace_id, v_mission_id,
     CASE WHEN TG_ARGV[0] = 'mission' THEN 0 ELSE 1 END, CURRENT_TIMESTAMP)
  ON CONFLICT (workspace_id, mission_id) DO UPDATE
    SET revision = mission_source_revision.revision
      + CASE WHEN TG_ARGV[0] = 'mission' THEN 0 ELSE 1 END,
        updated_at = CURRENT_TIMESTAMP;

  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END
$$;
REVOKE ALL ON FUNCTION hiveos_bump_mission_source_revision() FROM PUBLIC;

CREATE TRIGGER mission_source_revision_seed
  AFTER INSERT ON "mission"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('mission');

DO $$
DECLARE v_table text;
BEGIN
  FOREACH v_table IN ARRAY ARRAY[
    'mission_contract', 'runtime_obligation', 'runtime_gate', 'gate_run',
    'decision', 'escalation', 'evidence_source', 'snapshot', 'evidence_span',
    'claim', 'claim_version', 'dispute', 'honest_null_record',
    'provenance_edge', 'execution_tip', 'execution_tip_dependency',
    'execution_artifact', 'skill_run', 'agent_run', 'completion_report',
    'execution_deviation', 'resource_usage_record', 'verification_scenario',
    'verification_run', 'verification_requirement_coverage',
    'verification_scenario_result', 'verification_technical_health',
    'corruption_test_run', 'verification_report', 'governance_signoff',
    'evidence_ceiling_assessment', 'governed_release', 'release_manifest',
    'workflow_assignment', 'workflow_approval_request'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision(''direct'')',
      v_table || '_source_revision', v_table
    );
  END LOOP;

  FOREACH v_table IN ARRAY ARRAY[
    'requirement', 'assumption', 'constraint', 'mission_input',
    'contract_obligation', 'contract_gate'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision(''contract'')',
      v_table || '_source_revision', v_table
    );
  END LOOP;
END
$$;

CREATE TRIGGER claim_evidence_source_revision
  AFTER INSERT OR UPDATE OR DELETE ON "claim_evidence"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('claim_version');
CREATE TRIGGER workflow_approval_action_source_revision
  AFTER INSERT OR UPDATE OR DELETE ON "workflow_approval_action"
  FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('workflow_request');

