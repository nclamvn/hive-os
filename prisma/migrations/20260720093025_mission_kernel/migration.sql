-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('DRAFT', 'INTAKE', 'SCOPED', 'CONTRACT_REVIEW', 'APPROVED', 'EXPLORING', 'BUILDING', 'VERIFYING', 'REVIEW', 'RELEASED', 'PARTIAL', 'BLOCKED', 'REFUTED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AssuranceProfile" AS ENUM ('QUICK', 'PROFESSIONAL', 'RESEARCH', 'REGULATED');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "RequirementPriority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "ConstraintType" AS ENUM ('TECHNICAL', 'LEGAL', 'RESOURCE', 'SCHEDULE', 'OTHER');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "MissionInputType" AS ENUM ('TEXT', 'LINK', 'FILE', 'DATASET', 'OTHER');

-- CreateEnum
CREATE TYPE "ObligationStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'SATISFIED', 'WAIVED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "GateStatus" AS ENUM ('OPEN', 'PASSED', 'FAILED', 'WAIVED');

-- CreateEnum
CREATE TYPE "GateResult" AS ENUM ('PASS', 'FAIL', 'INCOMPLETE');

-- CreateEnum
CREATE TYPE "GateEvaluationMode" AS ENUM ('MANUAL', 'DETERMINISTIC');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('HUMAN_COMMAND', 'DETERMINISTIC_KERNEL');

-- CreateEnum
CREATE TYPE "DecisionType" AS ENUM ('CONTRACT_AMENDMENT', 'SCOPE_CHANGE', 'ASSURANCE_DOWNGRADE', 'OBLIGATION_WAIVER', 'GATE_WAIVER', 'CANCELLATION', 'REFUTATION', 'RELEASE_EXCEPTION');

-- CreateEnum
CREATE TYPE "DecisionStatus" AS ENUM ('REQUIRED', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EscalationSeverity" AS ENUM ('P0', 'P1', 'P2', 'P3');

-- CreateEnum
CREATE TYPE "EscalationStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED');

-- CreateTable
CREATE TABLE "workspace_mission_counter" (
    "workspace_id" TEXT NOT NULL,
    "next_ref" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "workspace_mission_counter_pkey" PRIMARY KEY ("workspace_id")
);

-- CreateTable
CREATE TABLE "mission" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "reference_code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "MissionStatus" NOT NULL DEFAULT 'DRAFT',
    "assurance_profile" "AssuranceProfile" NOT NULL DEFAULT 'PROFESSIONAL',
    "current_contract_id" TEXT,
    "approved_contract_id" TEXT,
    "blocked_from_status" "MissionStatus",
    "idempotency_key" TEXT,
    "created_by_membership_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_contract" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "objective" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "success_definition" TEXT NOT NULL,
    "assurance_profile" "AssuranceProfile" NOT NULL,
    "supersedes_contract_id" TEXT,
    "created_by_membership_id" TEXT NOT NULL,
    "submitted_by_membership_id" TEXT,
    "approved_by_membership_id" TEXT,
    "submitted_at" TIMESTAMP(3),
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "mission_contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requirement" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "acceptance_criteria" TEXT NOT NULL,
    "priority" "RequirementPriority" NOT NULL DEFAULT 'MEDIUM',
    "required" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assumption" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "validation_method" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ASSUMED',

    CONSTRAINT "assumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constraint" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "constraint_type" "ConstraintType" NOT NULL DEFAULT 'OTHER',
    "severity" "Severity" NOT NULL DEFAULT 'MEDIUM',

    CONSTRAINT "constraint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_input" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "input_type" "MissionInputType" NOT NULL DEFAULT 'TEXT',
    "description" TEXT NOT NULL,
    "storage_reference" TEXT,
    "content_hash" TEXT,

    CONSTRAINT "mission_input_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_obligation" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "closure_rule" TEXT NOT NULL,

    CONSTRAINT "contract_obligation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_gate" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "required_before_status" "MissionStatus" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "evaluation_mode" "GateEvaluationMode" NOT NULL DEFAULT 'MANUAL',

    CONSTRAINT "contract_gate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "runtime_obligation" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "contract_obligation_id" TEXT NOT NULL,
    "status" "ObligationStatus" NOT NULL DEFAULT 'OPEN',
    "closed_by_membership_id" TEXT,
    "closed_at" TIMESTAMP(3),
    "closure_reason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "runtime_obligation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "runtime_gate" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "contract_gate_id" TEXT NOT NULL,
    "status" "GateStatus" NOT NULL DEFAULT 'OPEN',
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "runtime_gate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gate_run" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "runtime_gate_id" TEXT NOT NULL,
    "result" "GateResult" NOT NULL,
    "actor_type" "ActorType" NOT NULL,
    "actor_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "linked_artifact_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gate_run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "decision_type" "DecisionType" NOT NULL,
    "materiality" TEXT NOT NULL DEFAULT 'MATERIAL',
    "status" "DecisionStatus" NOT NULL DEFAULT 'REQUIRED',
    "question" TEXT NOT NULL,
    "proposed_action" TEXT NOT NULL,
    "resolution" TEXT,
    "requested_by_membership_id" TEXT NOT NULL,
    "decided_by_membership_id" TEXT,
    "due_at" TIMESTAMP(3),
    "decided_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escalation" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "severity" "EscalationSeverity" NOT NULL,
    "status" "EscalationStatus" NOT NULL DEFAULT 'OPEN',
    "reason" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_id" TEXT,
    "created_by_membership_id" TEXT NOT NULL,
    "acknowledged_by_membership_id" TEXT,
    "resolved_by_membership_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "escalation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mission_workspace_id_status_idx" ON "mission"("workspace_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "mission_workspace_id_reference_code_key" ON "mission"("workspace_id", "reference_code");

-- CreateIndex
CREATE UNIQUE INDEX "mission_workspace_id_idempotency_key_key" ON "mission"("workspace_id", "idempotency_key");

-- CreateIndex
CREATE INDEX "mission_contract_workspace_id_status_idx" ON "mission_contract"("workspace_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "mission_contract_mission_id_version_number_key" ON "mission_contract"("mission_id", "version_number");

-- CreateIndex
CREATE UNIQUE INDEX "requirement_contract_id_code_key" ON "requirement"("contract_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "contract_obligation_contract_id_code_key" ON "contract_obligation"("contract_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "contract_gate_contract_id_code_key" ON "contract_gate"("contract_id", "code");

-- CreateIndex
CREATE INDEX "runtime_obligation_workspace_id_mission_id_idx" ON "runtime_obligation"("workspace_id", "mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "runtime_obligation_mission_id_contract_obligation_id_key" ON "runtime_obligation"("mission_id", "contract_obligation_id");

-- CreateIndex
CREATE INDEX "runtime_gate_workspace_id_mission_id_idx" ON "runtime_gate"("workspace_id", "mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "runtime_gate_mission_id_contract_gate_id_key" ON "runtime_gate"("mission_id", "contract_gate_id");

-- CreateIndex
CREATE INDEX "gate_run_workspace_id_mission_id_idx" ON "gate_run"("workspace_id", "mission_id");

-- CreateIndex
CREATE INDEX "decision_workspace_id_status_idx" ON "decision"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "decision_workspace_id_mission_id_idx" ON "decision"("workspace_id", "mission_id");

-- CreateIndex
CREATE INDEX "escalation_workspace_id_status_idx" ON "escalation"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "escalation_workspace_id_mission_id_idx" ON "escalation"("workspace_id", "mission_id");

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_contract" ADD CONSTRAINT "mission_contract_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirement" ADD CONSTRAINT "requirement_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "mission_contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assumption" ADD CONSTRAINT "assumption_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "mission_contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constraint" ADD CONSTRAINT "constraint_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "mission_contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_input" ADD CONSTRAINT "mission_input_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "mission_contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_obligation" ADD CONSTRAINT "contract_obligation_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "mission_contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_gate" ADD CONSTRAINT "contract_gate_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "mission_contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "runtime_obligation" ADD CONSTRAINT "runtime_obligation_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "runtime_obligation" ADD CONSTRAINT "runtime_obligation_contract_obligation_id_fkey" FOREIGN KEY ("contract_obligation_id") REFERENCES "contract_obligation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "runtime_gate" ADD CONSTRAINT "runtime_gate_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "runtime_gate" ADD CONSTRAINT "runtime_gate_contract_gate_id_fkey" FOREIGN KEY ("contract_gate_id") REFERENCES "contract_gate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gate_run" ADD CONSTRAINT "gate_run_runtime_gate_id_fkey" FOREIGN KEY ("runtime_gate_id") REFERENCES "runtime_gate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision" ADD CONSTRAINT "decision_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalation" ADD CONSTRAINT "escalation_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
