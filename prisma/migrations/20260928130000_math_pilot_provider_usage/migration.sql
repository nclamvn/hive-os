-- Provider accounting is captured once, as soon as a response with verifiable
-- usage returns. It survives a later source-validation failure or worker crash.
ALTER TABLE "research_run" ADD COLUMN "provider_usage" JSONB;
ALTER TABLE "research_run" ADD CONSTRAINT "research_provider_usage_object"
  CHECK ("provider_usage" IS NULL OR jsonb_typeof("provider_usage") = 'object');

CREATE OR REPLACE FUNCTION hiveos_freeze_research_provider_usage()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.provider_usage IS NOT NULL AND NEW.provider_usage IS DISTINCT FROM OLD.provider_usage THEN
    RAISE EXCEPTION 'research provider usage is immutable';
  END IF;
  IF OLD.provider_usage IS NULL AND NEW.provider_usage IS NOT NULL AND OLD.status <> 'RUNNING' THEN
    RAISE EXCEPTION 'research provider usage may only be recorded during execution';
  END IF;
  RETURN NEW;
END
$$;
REVOKE ALL ON FUNCTION hiveos_freeze_research_provider_usage() FROM PUBLIC;
CREATE TRIGGER research_provider_usage_immutable BEFORE UPDATE ON "research_run"
  FOR EACH ROW EXECUTE FUNCTION hiveos_freeze_research_provider_usage();
