CREATE TABLE research_campaign (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL, workspace_id TEXT NOT NULL, mission_id TEXT NOT NULL,
  command_id TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,
  contract JSONB NOT NULL, contract_digest TEXT NOT NULL,
  envelope JSONB NOT NULL, envelope_digest TEXT NOT NULL,
  source_bundle_digest TEXT NOT NULL, authority_epoch TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'QUEUED', state JSONB NOT NULL, state_digest TEXT NOT NULL,
  sequence INTEGER NOT NULL DEFAULT 0, tail_digest TEXT, revoked_at TIMESTAMP(3),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP(3) NOT NULL,
  CONSTRAINT research_campaign_shape CHECK (
    jsonb_typeof(contract)='object' AND jsonb_typeof(envelope)='object' AND jsonb_typeof(state)='object' AND
    version>0 AND sequence>=0 AND contract_digest ~ '^[a-f0-9]{64}$' AND
    envelope_digest ~ '^[a-f0-9]{64}$' AND source_bundle_digest ~ '^[a-f0-9]{64}$' AND
    state_digest ~ '^[a-f0-9]{64}$' AND (tail_digest IS NULL OR tail_digest ~ '^[a-f0-9]{64}$') AND
    status IN ('QUEUED','RUNNING','VERIFYING','PAUSED_FOR_DECISION','RESOURCE_STOP','FAILED','COMPLETED')),
  FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id,workspace_id) REFERENCES workspace(organization_id,id) ON DELETE RESTRICT,
  FOREIGN KEY (workspace_id,mission_id) REFERENCES mission(workspace_id,id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id,command_id) REFERENCES command_record(organization_id,id) ON DELETE RESTRICT,
  UNIQUE(organization_id,workspace_id,id)
);
CREATE INDEX research_campaign_tenant_mission_created ON research_campaign(organization_id,workspace_id,mission_id,created_at);
CREATE TABLE research_campaign_event (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL, workspace_id TEXT NOT NULL, campaign_id TEXT NOT NULL,
  sequence INTEGER NOT NULL, event_type TEXT NOT NULL, action_key TEXT NOT NULL,
  payload JSONB NOT NULL, previous_digest TEXT, digest TEXT NOT NULL, job_id TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT research_campaign_event_shape CHECK (sequence>0 AND jsonb_typeof(payload)='object' AND
    digest ~ '^[a-f0-9]{64}$' AND (previous_digest IS NULL OR previous_digest ~ '^[a-f0-9]{64}$')),
  FOREIGN KEY (organization_id,workspace_id,campaign_id) REFERENCES research_campaign(organization_id,workspace_id,id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id,job_id) REFERENCES durable_job(organization_id,id) ON DELETE RESTRICT,
  UNIQUE(campaign_id,sequence), UNIQUE(campaign_id,action_key)
);
CREATE INDEX research_campaign_event_tenant_sequence ON research_campaign_event(organization_id,workspace_id,campaign_id,sequence);
CREATE TRIGGER research_campaign_event_append_only BEFORE UPDATE OR DELETE ON research_campaign_event
  FOR EACH ROW EXECUTE FUNCTION hiveos_reject_research_retained_mutation();
ALTER TABLE research_campaign ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_campaign FORCE ROW LEVEL SECURITY;
CREATE POLICY research_campaign_tenant ON research_campaign
 USING (organization_id=hiveos_rls_organization_id()) WITH CHECK (organization_id=hiveos_rls_organization_id());
ALTER TABLE research_campaign_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_campaign_event FORCE ROW LEVEL SECURITY;
CREATE POLICY research_campaign_event_tenant ON research_campaign_event
 USING (organization_id=hiveos_rls_organization_id()) WITH CHECK (organization_id=hiveos_rls_organization_id());
CREATE FUNCTION hiveos_guard_research_campaign() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE resource_name TEXT;
BEGIN
 IF ROW(NEW.organization_id,NEW.workspace_id,NEW.mission_id,NEW.command_id,NEW.contract,NEW.contract_digest,
        NEW.envelope,NEW.envelope_digest,NEW.source_bundle_digest,NEW.authority_epoch,NEW.created_at)
    IS DISTINCT FROM ROW(OLD.organization_id,OLD.workspace_id,OLD.mission_id,OLD.command_id,OLD.contract,OLD.contract_digest,
        OLD.envelope,OLD.envelope_digest,OLD.source_bundle_digest,OLD.authority_epoch,OLD.created_at) THEN
   RAISE EXCEPTION 'research campaign envelope is sealed';
 END IF;
 IF NEW.version<>OLD.version+1 OR NEW.sequence<>OLD.sequence+1 OR NEW.tail_digest IS NULL THEN
   RAISE EXCEPTION 'research campaign transition requires next event';
 END IF;
 IF OLD.revoked_at IS NOT NULL AND NEW.revoked_at IS DISTINCT FROM OLD.revoked_at THEN
   RAISE EXCEPTION 'research campaign revocation is permanent';
 END IF;
 IF OLD.status IN ('RESOURCE_STOP','FAILED','COMPLETED') AND NEW.status<>OLD.status THEN
   RAISE EXCEPTION 'research campaign terminal state cannot reopen';
 END IF;
 FOR resource_name IN SELECT jsonb_object_keys(OLD.state->'spent') LOOP
   IF NOT (NEW.state->'spent' ? resource_name) OR
      (NEW.state->'spent'->>resource_name)::BIGINT < (OLD.state->'spent'->>resource_name)::BIGINT THEN
     RAISE EXCEPTION 'research campaign accounting is permanent';
   END IF;
 END LOOP;
 RETURN NEW;
END;
$$;
CREATE TRIGGER research_campaign_guard BEFORE UPDATE ON research_campaign
 FOR EACH ROW EXECUTE FUNCTION hiveos_guard_research_campaign();
CREATE TRIGGER research_campaign_source_revision AFTER INSERT OR UPDATE OR DELETE ON research_campaign
 FOR EACH ROW EXECUTE FUNCTION hiveos_bump_mission_source_revision('direct');
DO $$ BEGIN
 IF EXISTS(SELECT FROM pg_roles WHERE rolname='hiveos_app') THEN
  REVOKE UPDATE,DELETE,TRUNCATE ON research_campaign_event FROM hiveos_app;
  REVOKE DELETE,TRUNCATE ON research_campaign FROM hiveos_app;
 END IF;
END $$;
