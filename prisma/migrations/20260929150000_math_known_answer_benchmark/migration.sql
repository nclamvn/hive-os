-- Add a prospective known-answer lane. Historical OPEN cases are immutable
-- and are deliberately not reclassified by this migration.
ALTER TYPE "MathPilotCaseType" ADD VALUE 'BENCHMARK_PROOF';
