-- Preserve historical cycles while allowing a bounded seven-call structural
-- campaign to complete both peer-review contexts. This is an observed-token
-- threshold checked between calls, not a provider or USD spending ceiling.
ALTER TABLE "math_research_cycle" DROP CONSTRAINT "math_research_cycle_limits_check";
ALTER TABLE "math_research_cycle" ADD CONSTRAINT "math_research_cycle_limits_check" CHECK (
  "max_rounds" BETWEEN 1 AND 2 AND
  "max_calls" IN (5 * "max_rounds", 7 * "max_rounds") AND
  "max_observed_tokens" BETWEEN 10000 AND 200000 AND
  "calls_started" BETWEEN 0 AND "max_calls" AND "observed_tokens" >= 0 AND
  "completed_rounds" BETWEEN 0 AND "max_rounds"
);
