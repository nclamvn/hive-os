-- TIP-023D: enterprise assignments, SLA policy, approval chains and
-- transaction-local RLS for the workflow accountability plane.

CREATE TYPE "WorkItemType" AS ENUM (
  'MISSION',
  'RUNTIME_OBLIGATION',
  'DECISION',
  'ESCALATION',
  'EXECUTION_TIP',
  'VERIFICATION_REPORT'
);
CREATE TYPE "AccountabilityRole" AS ENUM (
  'ACCOUNTABLE',
  'RESPONSIBLE',
  'REVIEWER',
  'APPROVER',
  'OBSERVER'
);
CREATE TYPE "WorkAssignmentStatus" AS ENUM ('ACTIVE', 'ENDED');
CREATE TYPE "WorkflowDefinitionStatus" AS ENUM ('ACTIVE', 'RETIRED');
CREATE TYPE "ApprovalWorkflowType" AS ENUM (
  'CONTRACT',
  'VERIFICATION',
  'RELEASE',
  'EXCEPTION',
  'CUSTOM'
);
CREATE TYPE "WorkflowApprovalStatus" AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CANCELLED'
);
CREATE TYPE "WorkflowApprovalDecision" AS ENUM ('APPROVED', 'REJECTED');

CREATE UNIQUE INDEX "mission_workspace_id_id_key"
  ON "mission"("workspace_id", "id");

CREATE TABLE "sla_policy" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT,
  "policy_key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "target_type" "WorkItemType" NOT NULL,
  "assurance_profile" "AssuranceProfile",
  "due_after_minutes" INTEGER NOT NULL,
  "warning_before_minutes" INTEGER NOT NULL,
  "escalate_after_minutes" INTEGER NOT NULL,
  "escalation_severity" "EscalationSeverity" NOT NULL,
  "status" "WorkflowDefinitionStatus" NOT NULL DEFAULT 'ACTIVE',
  "created_by_organization_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "sla_policy_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "sla_policy_thresholds" CHECK (
    "due_after_minutes" BETWEEN 1 AND 525600
    AND "warning_before_minutes" BETWEEN 0 AND "due_after_minutes"
    AND "escalate_after_minutes" BETWEEN 0 AND 525600
  ),
  CONSTRAINT "sla_policy_key_name" CHECK (
    length(btrim("policy_key")) BETWEEN 1 AND 100
    AND length(btrim("name")) BETWEEN 1 AND 200
  )
);

CREATE TABLE "workflow_assignment" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "target_type" "WorkItemType" NOT NULL,
  "target_id" TEXT NOT NULL,
  "accountability_role" "AccountabilityRole" NOT NULL,
  "assignee_organization_membership_id" TEXT NOT NULL,
  "assigned_by_organization_membership_id" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "due_at" TIMESTAMP(3),
  "sla_policy_id" TEXT,
  "sla_policy_version" INTEGER,
  "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "valid_until" TIMESTAMP(3),
  "status" "WorkAssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
  "ended_at" TIMESTAMP(3),
  "ended_by_organization_membership_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "workflow_assignment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "workflow_assignment_reason" CHECK (
    length(btrim("reason")) BETWEEN 1 AND 500
  ),
  CONSTRAINT "workflow_assignment_validity" CHECK (
    "valid_until" IS NULL OR "valid_until" > "valid_from"
  ),
  CONSTRAINT "workflow_assignment_sla_shape" CHECK (
    ("sla_policy_id" IS NULL AND "sla_policy_version" IS NULL)
    OR
    ("sla_policy_id" IS NOT NULL AND "sla_policy_version" IS NOT NULL)
  ),
  CONSTRAINT "workflow_assignment_status_shape" CHECK (
    (
      "status" = 'ACTIVE'
      AND "ended_at" IS NULL
      AND "ended_by_organization_membership_id" IS NULL
    )
    OR
    (
      "status" = 'ENDED'
      AND "ended_at" IS NOT NULL
      AND "ended_by_organization_membership_id" IS NOT NULL
    )
  )
);

CREATE TABLE "approval_chain_definition" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT,
  "chain_key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "workflow_type" "ApprovalWorkflowType" NOT NULL,
  "status" "WorkflowDefinitionStatus" NOT NULL DEFAULT 'ACTIVE',
  "created_by_organization_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "approval_chain_definition_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "approval_chain_definition_key_name" CHECK (
    length(btrim("chain_key")) BETWEEN 1 AND 100
    AND length(btrim("name")) BETWEEN 1 AND 200
  )
);

CREATE TABLE "approval_chain_step" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "chain_definition_id" TEXT NOT NULL,
  "sequence" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "required_capability" TEXT NOT NULL,
  "minimum_approvals" INTEGER NOT NULL DEFAULT 1,
  "require_independent_from_previous" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "approval_chain_step_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "approval_chain_step_shape" CHECK (
    "sequence" BETWEEN 1 AND 100
    AND "minimum_approvals" BETWEEN 1 AND 20
    AND length(btrim("name")) BETWEEN 1 AND 200
    AND length(btrim("required_capability")) BETWEEN 1 AND 100
  )
);

CREATE TABLE "workflow_approval_request" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "mission_id" TEXT NOT NULL,
  "chain_definition_id" TEXT NOT NULL,
  "target_type" "WorkItemType" NOT NULL,
  "target_id" TEXT NOT NULL,
  "status" "WorkflowApprovalStatus" NOT NULL DEFAULT 'PENDING',
  "current_step_sequence" INTEGER NOT NULL DEFAULT 1,
  "requested_by_organization_membership_id" TEXT NOT NULL,
  "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completed_at" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "workflow_approval_request_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "workflow_approval_request_step"
    CHECK ("current_step_sequence" BETWEEN 1 AND 100),
  CONSTRAINT "workflow_approval_request_completion" CHECK (
    ("status" = 'PENDING' AND "completed_at" IS NULL)
    OR
    ("status" <> 'PENDING' AND "completed_at" IS NOT NULL)
  )
);

CREATE TABLE "workflow_approval_action" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "request_id" TEXT NOT NULL,
  "step_id" TEXT NOT NULL,
  "decision" "WorkflowApprovalDecision" NOT NULL,
  "rationale" TEXT NOT NULL,
  "actor_organization_membership_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "workflow_approval_action_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "workflow_approval_action_rationale" CHECK (
    length(btrim("rationale")) BETWEEN 1 AND 2000
  )
);

CREATE UNIQUE INDEX "sla_policy_organization_id_id_key"
  ON "sla_policy"("organization_id", "id");
CREATE UNIQUE INDEX "sla_policy_organization_id_policy_key_version_key"
  ON "sla_policy"("organization_id", "policy_key", "version");
CREATE INDEX "sla_policy_scope_idx"
  ON "sla_policy"(
    "organization_id", "workspace_id", "target_type",
    "assurance_profile", "status"
  );

CREATE UNIQUE INDEX "workflow_assignment_organization_id_id_key"
  ON "workflow_assignment"("organization_id", "id");
CREATE UNIQUE INDEX "workflow_assignment_one_active_role"
  ON "workflow_assignment"(
    "organization_id", "target_type", "target_id", "accountability_role"
  ) WHERE "status" = 'ACTIVE';
CREATE INDEX "workflow_assignment_target_idx"
  ON "workflow_assignment"(
    "organization_id", "workspace_id", "mission_id",
    "target_type", "target_id", "status"
  );
CREATE INDEX "workflow_assignment_inbox_idx"
  ON "workflow_assignment"(
    "organization_id", "assignee_organization_membership_id",
    "status", "due_at", "id"
  );

CREATE UNIQUE INDEX "approval_chain_definition_organization_id_id_key"
  ON "approval_chain_definition"("organization_id", "id");
CREATE UNIQUE INDEX "approval_chain_definition_key_version_key"
  ON "approval_chain_definition"("organization_id", "chain_key", "version");
CREATE INDEX "approval_chain_definition_scope_idx"
  ON "approval_chain_definition"(
    "organization_id", "workspace_id", "workflow_type", "status"
  );

CREATE UNIQUE INDEX "approval_chain_step_organization_id_id_key"
  ON "approval_chain_step"("organization_id", "id");
CREATE UNIQUE INDEX "approval_chain_step_chain_definition_id_sequence_key"
  ON "approval_chain_step"("chain_definition_id", "sequence");
CREATE INDEX "approval_chain_step_sequence_idx"
  ON "approval_chain_step"(
    "organization_id", "chain_definition_id", "sequence"
  );

CREATE UNIQUE INDEX "workflow_approval_request_organization_id_id_key"
  ON "workflow_approval_request"("organization_id", "id");
CREATE INDEX "workflow_approval_request_inbox_idx"
  ON "workflow_approval_request"(
    "organization_id", "workspace_id", "status", "requested_at", "id"
  );
CREATE INDEX "workflow_approval_request_target_idx"
  ON "workflow_approval_request"(
    "organization_id", "mission_id", "target_type", "target_id"
  );

CREATE UNIQUE INDEX "workflow_approval_action_organization_id_id_key"
  ON "workflow_approval_action"("organization_id", "id");
CREATE UNIQUE INDEX "workflow_approval_action_actor_key"
  ON "workflow_approval_action"(
    "request_id", "step_id", "actor_organization_membership_id"
  );
CREATE INDEX "workflow_approval_action_request_idx"
  ON "workflow_approval_action"(
    "organization_id", "workspace_id", "request_id", "created_at"
  );

ALTER TABLE "sla_policy"
  ADD CONSTRAINT "sla_policy_organization_id_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "sla_policy_organization_id_workspace_id_fkey"
    FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "sla_policy_creator_fkey"
    FOREIGN KEY (
      "organization_id", "created_by_organization_membership_id"
    ) REFERENCES "organization_membership"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "workflow_assignment"
  ADD CONSTRAINT "workflow_assignment_organization_id_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workflow_assignment_workspace_fkey"
    FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workflow_assignment_mission_fkey"
    FOREIGN KEY ("workspace_id", "mission_id")
    REFERENCES "mission"("workspace_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workflow_assignment_assignee_fkey"
    FOREIGN KEY (
      "organization_id", "assignee_organization_membership_id"
    ) REFERENCES "organization_membership"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workflow_assignment_assigner_fkey"
    FOREIGN KEY (
      "organization_id", "assigned_by_organization_membership_id"
    ) REFERENCES "organization_membership"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workflow_assignment_ender_fkey"
    FOREIGN KEY (
      "organization_id", "ended_by_organization_membership_id"
    ) REFERENCES "organization_membership"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workflow_assignment_sla_policy_fkey"
    FOREIGN KEY ("organization_id", "sla_policy_id")
    REFERENCES "sla_policy"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "approval_chain_definition"
  ADD CONSTRAINT "approval_chain_definition_organization_id_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "approval_chain_definition_workspace_fkey"
    FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "approval_chain_definition_creator_fkey"
    FOREIGN KEY (
      "organization_id", "created_by_organization_membership_id"
    ) REFERENCES "organization_membership"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "approval_chain_step"
  ADD CONSTRAINT "approval_chain_step_organization_id_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "approval_chain_step_definition_fkey"
    FOREIGN KEY ("organization_id", "chain_definition_id")
    REFERENCES "approval_chain_definition"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "workflow_approval_request"
  ADD CONSTRAINT "workflow_approval_request_organization_id_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workflow_approval_request_workspace_fkey"
    FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workflow_approval_request_mission_fkey"
    FOREIGN KEY ("workspace_id", "mission_id")
    REFERENCES "mission"("workspace_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workflow_approval_request_definition_fkey"
    FOREIGN KEY ("organization_id", "chain_definition_id")
    REFERENCES "approval_chain_definition"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workflow_approval_request_creator_fkey"
    FOREIGN KEY (
      "organization_id", "requested_by_organization_membership_id"
    ) REFERENCES "organization_membership"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "workflow_approval_action"
  ADD CONSTRAINT "workflow_approval_action_organization_id_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workflow_approval_action_workspace_fkey"
    FOREIGN KEY ("organization_id", "workspace_id")
    REFERENCES "workspace"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workflow_approval_action_request_fkey"
    FOREIGN KEY ("organization_id", "request_id")
    REFERENCES "workflow_approval_request"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workflow_approval_action_step_fkey"
    FOREIGN KEY ("organization_id", "step_id")
    REFERENCES "approval_chain_step"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "workflow_approval_action_actor_fkey"
    FOREIGN KEY (
      "organization_id", "actor_organization_membership_id"
    ) REFERENCES "organization_membership"("organization_id", "id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE UNIQUE INDEX "escalation_open_workflow_assignment"
  ON "escalation"("workspace_id", "source_id")
  WHERE "source_type" = 'WORKFLOW_ASSIGNMENT'
    AND "status" <> 'RESOLVED';

ALTER TABLE "sla_policy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sla_policy" FORCE ROW LEVEL SECURITY;
CREATE POLICY sla_policy_tenant_isolation ON "sla_policy"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "workflow_assignment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workflow_assignment" FORCE ROW LEVEL SECURITY;
CREATE POLICY workflow_assignment_tenant_isolation ON "workflow_assignment"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "approval_chain_definition" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "approval_chain_definition" FORCE ROW LEVEL SECURITY;
CREATE POLICY approval_chain_definition_tenant_isolation
  ON "approval_chain_definition"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "approval_chain_step" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "approval_chain_step" FORCE ROW LEVEL SECURITY;
CREATE POLICY approval_chain_step_tenant_isolation ON "approval_chain_step"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "workflow_approval_request" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workflow_approval_request" FORCE ROW LEVEL SECURITY;
CREATE POLICY workflow_approval_request_tenant_isolation
  ON "workflow_approval_request"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());

ALTER TABLE "workflow_approval_action" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workflow_approval_action" FORCE ROW LEVEL SECURITY;
CREATE POLICY workflow_approval_action_tenant_isolation
  ON "workflow_approval_action"
  USING ("organization_id" = hiveos_rls_organization_id())
  WITH CHECK ("organization_id" = hiveos_rls_organization_id());
