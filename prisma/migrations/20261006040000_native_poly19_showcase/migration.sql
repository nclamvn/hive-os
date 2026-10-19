CREATE TABLE research_showcase_run (
 id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
 organization_id TEXT NOT NULL,workspace_id TEXT NOT NULL,mission_id TEXT NOT NULL,command_id TEXT NOT NULL,actor_user_id TEXT NOT NULL,
 provenance TEXT NOT NULL,task_digest TEXT NOT NULL,source_bundle_digest TEXT NOT NULL,authority_epoch TEXT NOT NULL,
 version INTEGER NOT NULL DEFAULT 1,status TEXT NOT NULL DEFAULT 'QUEUED',state JSONB NOT NULL,state_digest TEXT NOT NULL,
 sequence INTEGER NOT NULL DEFAULT 0,tail_digest TEXT,revoked_at TIMESTAMP(3),
 created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP(3) NOT NULL,
 CONSTRAINT research_showcase_shape CHECK (provenance IN ('LIVE_NATIVE','ENGINEERING_ONLY') AND version>0 AND sequence>=0 AND
  status IN ('QUEUED','RUNNING','VERIFYING','PAUSED_FOR_DECISION','RESOURCE_STOP','FAILED','COMPLETED','REVOKED') AND
  jsonb_typeof(state)='object' AND task_digest ~ '^[a-f0-9]{64}$' AND source_bundle_digest ~ '^[a-f0-9]{64}$' AND state_digest ~ '^[a-f0-9]{64}$'),
 FOREIGN KEY(organization_id) REFERENCES organization(id) ON DELETE RESTRICT,
 FOREIGN KEY(organization_id,workspace_id) REFERENCES workspace(organization_id,id) ON DELETE RESTRICT,
 FOREIGN KEY(workspace_id,mission_id) REFERENCES mission(workspace_id,id) ON DELETE RESTRICT,
 FOREIGN KEY(organization_id,command_id) REFERENCES command_record(organization_id,id) ON DELETE RESTRICT,
 UNIQUE(organization_id,workspace_id,id)
);
CREATE INDEX research_showcase_tenant_mission ON research_showcase_run(organization_id,workspace_id,mission_id,created_at);
CREATE TABLE research_showcase_event (
 id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,organization_id TEXT NOT NULL,workspace_id TEXT NOT NULL,run_id TEXT NOT NULL,
 sequence INTEGER NOT NULL,event_type TEXT NOT NULL,action_key TEXT NOT NULL,payload JSONB NOT NULL,previous_digest TEXT,digest TEXT NOT NULL,job_id TEXT,created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT research_showcase_event_shape CHECK(sequence>0 AND jsonb_typeof(payload)='object' AND digest ~ '^[a-f0-9]{64}$'),
 FOREIGN KEY(organization_id,workspace_id,run_id) REFERENCES research_showcase_run(organization_id,workspace_id,id) ON DELETE RESTRICT,
 FOREIGN KEY(organization_id,job_id) REFERENCES durable_job(organization_id,id) ON DELETE RESTRICT,
 UNIQUE(run_id,sequence),UNIQUE(run_id,action_key)
);
CREATE INDEX research_showcase_event_cut ON research_showcase_event(organization_id,workspace_id,run_id,sequence);
CREATE TRIGGER research_showcase_event_append_only BEFORE UPDATE OR DELETE ON research_showcase_event FOR EACH ROW EXECUTE FUNCTION hiveos_reject_research_retained_mutation();
ALTER TABLE research_showcase_run ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_showcase_run FORCE ROW LEVEL SECURITY;
ALTER TABLE research_showcase_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_showcase_event FORCE ROW LEVEL SECURITY;
CREATE POLICY research_showcase_tenant ON research_showcase_run USING(organization_id=hiveos_rls_organization_id()) WITH CHECK(organization_id=hiveos_rls_organization_id());
CREATE POLICY research_showcase_event_tenant ON research_showcase_event USING(organization_id=hiveos_rls_organization_id()) WITH CHECK(organization_id=hiveos_rls_organization_id());
CREATE FUNCTION hiveos_guard_research_showcase() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE resource_name TEXT;
BEGIN
 IF ROW(NEW.organization_id,NEW.workspace_id,NEW.mission_id,NEW.command_id,NEW.actor_user_id,NEW.provenance,NEW.task_digest,NEW.source_bundle_digest,NEW.authority_epoch,NEW.created_at)
 IS DISTINCT FROM ROW(OLD.organization_id,OLD.workspace_id,OLD.mission_id,OLD.command_id,OLD.actor_user_id,OLD.provenance,OLD.task_digest,OLD.source_bundle_digest,OLD.authority_epoch,OLD.created_at) THEN RAISE EXCEPTION 'showcase authority is sealed'; END IF;
 IF NEW.version<>OLD.version+1 OR NEW.sequence<>OLD.sequence+1 OR NEW.tail_digest IS NULL THEN RAISE EXCEPTION 'showcase transition requires event'; END IF;
 IF OLD.revoked_at IS NOT NULL AND NEW.revoked_at IS DISTINCT FROM OLD.revoked_at THEN RAISE EXCEPTION 'showcase revocation is permanent'; END IF;
 IF OLD.status IN ('COMPLETED','FAILED','RESOURCE_STOP','REVOKED','PAUSED_FOR_DECISION') AND NEW.status<>OLD.status THEN RAISE EXCEPTION 'showcase terminal or unknown state cannot reopen'; END IF;
 FOR resource_name IN SELECT jsonb_object_keys(OLD.state->'spent') LOOP
  IF NOT (NEW.state->'spent' ? resource_name) OR (NEW.state->'spent'->>resource_name)::BIGINT < (OLD.state->'spent'->>resource_name)::BIGINT THEN RAISE EXCEPTION 'showcase spend cannot refund'; END IF;
 END LOOP;
 RETURN NEW;
END; $$;
CREATE TRIGGER research_showcase_guard BEFORE UPDATE ON research_showcase_run FOR EACH ROW EXECUTE FUNCTION hiveos_guard_research_showcase();
DO $$ BEGIN IF EXISTS(SELECT FROM pg_roles WHERE rolname='hiveos_app') THEN
 REVOKE UPDATE,DELETE,TRUNCATE ON research_showcase_event FROM hiveos_app;
 REVOKE DELETE,TRUNCATE ON research_showcase_run FROM hiveos_app;
END IF; END $$;
