-- Terminal cycles remain immutable. A new, human-confirmed campaign can be
-- launched on the same sealed case only after the previous cycle terminates.
DROP INDEX "math_research_cycle_root_case_id_key";
DROP INDEX "math_research_cycle_workspace_id_root_case_id_key";
CREATE INDEX "math_research_cycle_workspace_root_created_idx"
  ON "math_research_cycle"("workspace_id", "root_case_id", "created_at");
CREATE UNIQUE INDEX "math_research_cycle_one_active_root"
  ON "math_research_cycle"("organization_id", "workspace_id", "root_case_id")
  WHERE "status" IN ('QUEUED', 'RUNNING');
