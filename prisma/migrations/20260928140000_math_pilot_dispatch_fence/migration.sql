-- Fenced before a paid Math Pilot call. A worker crash after this write may
-- leave an ambiguous charge, so the same case must never be replayed blindly.
ALTER TABLE "research_run" ADD COLUMN "provider_dispatch_attempted_at" TIMESTAMP(3);

CREATE OR REPLACE FUNCTION hiveos_freeze_research_provider_dispatch()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.provider_dispatch_attempted_at IS NOT NULL
     AND NEW.provider_dispatch_attempted_at IS DISTINCT FROM OLD.provider_dispatch_attempted_at THEN
    RAISE EXCEPTION 'research provider dispatch fence is immutable';
  END IF;
  IF OLD.provider_dispatch_attempted_at IS NULL
     AND NEW.provider_dispatch_attempted_at IS NOT NULL
     AND OLD.status <> 'RUNNING' THEN
    RAISE EXCEPTION 'research provider dispatch fence requires a running job';
  END IF;
  RETURN NEW;
END
$$;
REVOKE ALL ON FUNCTION hiveos_freeze_research_provider_dispatch() FROM PUBLIC;
CREATE TRIGGER research_provider_dispatch_immutable BEFORE UPDATE ON "research_run"
  FOR EACH ROW EXECUTE FUNCTION hiveos_freeze_research_provider_dispatch();
