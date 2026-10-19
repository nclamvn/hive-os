-- A target/chain has at most one live approval, and an assignment can produce
-- at most one retained SLA escalation even after that escalation is resolved.

CREATE UNIQUE INDEX "workflow_approval_request_one_pending"
  ON "workflow_approval_request"(
    "organization_id", "chain_definition_id", "target_type", "target_id"
  )
  WHERE "status" = 'PENDING';

DROP INDEX "escalation_open_workflow_assignment";

CREATE UNIQUE INDEX "escalation_workflow_assignment_once"
  ON "escalation"("workspace_id", "source_id")
  WHERE "source_type" = 'WORKFLOW_ASSIGNMENT';
