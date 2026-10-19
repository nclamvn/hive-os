-- Historical five-call cycles remain readable and immutable. New cycles reserve
-- two independent source-assessment calls per round before solver dispatch.
ALTER TABLE "math_research_cycle" DROP CONSTRAINT "math_research_cycle_limits_check";
ALTER TABLE "math_research_cycle" ADD CONSTRAINT "math_research_cycle_limits_check" CHECK (
  "max_rounds" BETWEEN 1 AND 2 AND
  "max_calls" IN (5 * "max_rounds", 7 * "max_rounds") AND
  "max_observed_tokens" BETWEEN 10000 AND 120000 AND
  "calls_started" BETWEEN 0 AND "max_calls" AND "observed_tokens" >= 0 AND
  "completed_rounds" BETWEEN 0 AND "max_rounds"
);
