-- Least-privilege runtime role for the HIVE OS application.
-- Applied by the OWNER connection AFTER migrations (tables must exist).
-- Authentication material is deliberately absent from this committed file.
-- apply-app-role.mjs sets the password from the runtime DATABASE_URL after the
-- role and grants have been established through the owner connection.

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'hiveos_app') THEN
    CREATE ROLE hiveos_app LOGIN
      NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
  ELSE
    -- Managed PostgreSQL owner roles are deliberately not SUPERUSER. PostgreSQL
    -- therefore rejects `ALTER ROLE ... NOSUPERUSER` even when the target is
    -- already non-superuser. Assert the invariant first, then alter only the
    -- attributes a managed owner is allowed to govern.
    IF EXISTS (
      SELECT FROM pg_roles
      WHERE rolname = 'hiveos_app' AND rolsuper
    ) THEN
      RAISE EXCEPTION 'hiveos_app must not be a superuser';
    END IF;
    ALTER ROLE hiveos_app LOGIN
      NOCREATEDB NOCREATEROLE NOBYPASSRLS;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO hiveos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO hiveos_app;

-- Append-only tables for the runtime role: SELECT + INSERT only. The role
-- never receives UPDATE/DELETE/TRUNCATE (and cannot ALTER/own them), so the
-- append-only database triggers cannot be dropped or bypassed by it.
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE audit_event FROM hiveos_app;
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gate_run') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE gate_run FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'snapshot') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE
      snapshot, evidence_span, claim_version, claim_evidence, dispute,
      honest_null_record, provenance_edge
    FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'skill_version') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE skill_version FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'execution_artifact') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE
      execution_tip_dependency, execution_artifact, completion_report,
      resource_usage_record
    FROM hiveos_app;
    -- These two projections receive one governed terminal transition but are
    -- never deleted by the runtime role.
    REVOKE DELETE, TRUNCATE ON TABLE
      agent_run, execution_deviation
    FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'verification_report') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE
      verification_scenario, verification_requirement_coverage,
      verification_scenario_result, verification_technical_health,
      corruption_test_run, verification_report, governance_signoff,
      evidence_ceiling_assessment, governed_release, release_manifest
    FROM hiveos_app;
    REVOKE DELETE, TRUNCATE ON TABLE verification_run FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workflow_approval_action') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE
      workflow_approval_action, sla_policy, approval_chain_definition,
      approval_chain_step
    FROM hiveos_app;
    REVOKE DELETE, TRUNCATE ON TABLE
      workflow_assignment, workflow_approval_request
    FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'durable_job_event') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE durable_job_event FROM hiveos_app;
    REVOKE DELETE, TRUNCATE ON TABLE
      command_record, outbox_event, durable_job,
      workspace_operational_projection, portfolio_operational_projection
    FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'dossier_export_part') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE dossier_export_part FROM hiveos_app;
    REVOKE DELETE, TRUNCATE ON TABLE
      legal_hold, lifecycle_disposition, dossier_export
    FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'mission_source_revision') THEN
    REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE mission_source_revision FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'authoring_revision') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE authoring_revision FROM hiveos_app;
    REVOKE DELETE, TRUNCATE ON TABLE authoring_document FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'research_source_snapshot') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE
      research_source_snapshot, research_finding, research_finding_decision
    FROM hiveos_app;
    REVOKE DELETE, TRUNCATE ON TABLE research_run, computation_run FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'math_pilot_case') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE
      math_pilot_case, math_pilot_assessment
    FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'math_pilot_agent_review') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE math_pilot_agent_review FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'math_research_cycle_event') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE math_research_cycle_event FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'research_campaign_event') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE research_campaign_event FROM hiveos_app;
    REVOKE DELETE, TRUNCATE ON TABLE research_campaign FROM hiveos_app;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'research_showcase_event') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE research_showcase_event FROM hiveos_app;
    REVOKE DELETE, TRUNCATE ON TABLE research_showcase_run FROM hiveos_app;
  END IF;
  -- TIP-021A: the identity security ledger is append-only for the runtime role
  -- (SELECT + INSERT only); it never receives UPDATE/DELETE/TRUNCATE, so its
  -- append-only triggers cannot be bypassed. auth_throttle_counter keeps full
  -- DML (atomic increment + expiry pruning).
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'identity_security_event') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON TABLE identity_security_event FROM hiveos_app;
  END IF;
END
$$;

-- The runtime role has no business with the migration ledger.
REVOKE ALL ON TABLE _prisma_migrations FROM hiveos_app;

-- Tables created later by the owner auto-grant runtime DML.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO hiveos_app;
