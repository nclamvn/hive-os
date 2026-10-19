-- Retain one model-authored mathematical attempt separately from evidence.
-- The attempt is not a source, an approved argument or a proof certificate.
ALTER TABLE "research_run" ADD COLUMN "math_model_attempt" JSONB;
ALTER TABLE "research_run" ADD COLUMN "math_model_attempt_digest" TEXT;
ALTER TABLE "research_run" ADD CONSTRAINT "research_math_attempt_pair"
  CHECK (("math_model_attempt" IS NULL) = ("math_model_attempt_digest" IS NULL));
ALTER TABLE "research_run" ADD CONSTRAINT "research_math_attempt_object"
  CHECK ("math_model_attempt" IS NULL OR jsonb_typeof("math_model_attempt") = 'object');
ALTER TABLE "research_run" ADD CONSTRAINT "research_math_attempt_digest_shape"
  CHECK ("math_model_attempt_digest" IS NULL OR "math_model_attempt_digest" ~ '^[a-f0-9]{64}$');

CREATE OR REPLACE FUNCTION hiveos_freeze_research_math_attempt()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.math_model_attempt IS NOT NULL AND (
    NEW.math_model_attempt IS DISTINCT FROM OLD.math_model_attempt OR
    NEW.math_model_attempt_digest IS DISTINCT FROM OLD.math_model_attempt_digest
  ) THEN
    RAISE EXCEPTION 'research math model attempt is immutable';
  END IF;
  IF OLD.math_model_attempt IS NULL AND NEW.math_model_attempt IS NOT NULL AND OLD.status <> 'RUNNING' THEN
    RAISE EXCEPTION 'research math model attempt may only be recorded during execution';
  END IF;
  RETURN NEW;
END
$$;
REVOKE ALL ON FUNCTION hiveos_freeze_research_math_attempt() FROM PUBLIC;
CREATE TRIGGER research_math_model_attempt_immutable BEFORE UPDATE ON "research_run"
  FOR EACH ROW EXECUTE FUNCTION hiveos_freeze_research_math_attempt();
