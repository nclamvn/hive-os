import type { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

/** A Prisma client or an interactive-transaction client. */
export type DbClient = PrismaClient | Prisma.TransactionClient;

const role = z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]);

/**
 * Strict payload contract per event type. `.strict()` rejects unknown keys, so
 * the event type is the ONLY valid payload shape — a request-shaped object with
 * extra fields cannot pass through. Correlation and actor attribution live
 * outside the payload and are never accepted as arbitrary input.
 */
const AUDIT_PAYLOAD_SCHEMAS = {
  "workspace.created": z
    .object({ name: z.string(), slug: z.string() })
    .strict(),
  "workspace.updated": z.object({ name: z.string() }).strict(),
  "organization.provisioned": z
    .object({
      name: z.string(),
      slug: z.string(),
      rootUnitId: z.string(),
    })
    .strict(),
  "organization.unit_created": z
    .object({
      unitKey: z.string(),
      name: z.string(),
      type: z.string(),
      parentId: z.string(),
    })
    .strict(),
  "organization.unit_moved": z
    .object({
      fromParentId: z.string(),
      toParentId: z.string(),
      version: z.number().int().positive(),
    })
    .strict(),
  "organization.portfolio_created": z
    .object({
      portfolioKey: z.string(),
      name: z.string(),
      orgUnitId: z.string(),
    })
    .strict(),
  "organization.group_created": z
    .object({ groupKey: z.string(), name: z.string() })
    .strict(),
  "organization.group_member_added": z
    .object({ groupId: z.string(), organizationMembershipId: z.string() })
    .strict(),
  "workspace.policy_updated": z
    .object({
      defaultAssuranceProfile: z.string(),
      providerPolicyMode: z.string(),
      allowedProviderCount: z.number().int().nonnegative(),
      artifactRetentionDays: z.number().int().positive(),
      evidenceRetentionDays: z.number().int().positive(),
      auditRetentionDays: z.number().int().positive(),
      publicReleasePolicy: z.string(),
    })
    .strict(),
  "authorization.grant_created": z
    .object({
      role: z.string(),
      effect: z.string(),
      scopeType: z.string(),
      subjectType: z.string(),
    })
    .strict(),
  "authorization.grant_revoked": z
    .object({ reason: z.string(), version: z.number().int().positive() })
    .strict(),
  "authorization.denied": z
    .object({
      capability: z.string(),
      reasonCodes: z.array(z.string()).max(8),
      policyVersion: z.number().int().nonnegative(),
    })
    .strict(),
  "membership.created": z
    .object({ role, via: z.enum(["onboarding", "invitation"]) })
    .strict(),
  "membership.role_changed": z.object({ from: role, to: role }).strict(),
  "membership.suspended": z.object({ role }).strict(),
  "invitation.created": z.object({ email: z.string(), role }).strict(),
  "invitation.accepted": z.object({ role }).strict(),
  "invitation.revoked": z.object({ email: z.string() }).strict(),

  // Mission Kernel (TIP-004). Actor/correlation live in dedicated columns.
  "mission.created": z
    .object({
      referenceCode: z.string(),
      title: z.string(),
      assuranceProfile: z.string(),
    })
    .strict(),
  "mission.transitioned": z
    .object({
      from: z.string(),
      to: z.string(),
      reason: z.string(),
      version: z.number().int(),
    })
    .strict(),
  "mission.blocked": z
    .object({ from: z.string(), reason: z.string(), version: z.number().int() })
    .strict(),
  "mission.resumed": z
    .object({ to: z.string(), reason: z.string(), version: z.number().int() })
    .strict(),
  "mission.archived": z
    .object({ from: z.string(), reason: z.string(), version: z.number().int() })
    .strict(),
  "contract.created": z.object({ versionNumber: z.number().int() }).strict(),
  "contract.submitted": z.object({ versionNumber: z.number().int() }).strict(),
  "contract.approved": z.object({ versionNumber: z.number().int() }).strict(),
  "contract.superseded": z
    .object({ versionNumber: z.number().int(), supersededBy: z.number().int() })
    .strict(),
  "obligation.started": z.object({ code: z.string() }).strict(),
  "obligation.satisfied": z
    .object({ code: z.string(), reason: z.string() })
    .strict(),
  "obligation.blocked": z
    .object({ code: z.string(), reason: z.string() })
    .strict(),
  "obligation.waived": z
    .object({ code: z.string(), decisionId: z.string() })
    .strict(),
  "gate.evaluated": z
    .object({
      code: z.string(),
      result: z.string(),
      reason: z.string(),
      linkedArtifactId: z.string().optional(),
    })
    .strict(),
  "gate.waived": z
    .object({ code: z.string(), decisionId: z.string() })
    .strict(),
  "decision.required": z.object({ decisionType: z.string() }).strict(),
  "decision.resolved": z
    .object({ decisionType: z.string(), status: z.string() })
    .strict(),
  "escalation.created": z
    .object({ severity: z.string(), reason: z.string() })
    .strict(),
  "escalation.acknowledged": z.object({ severity: z.string() }).strict(),
  "escalation.resolved": z.object({ severity: z.string() }).strict(),
  // Enterprise Workflow (TIP-023D)
  "workflow.assignment_created": z
    .object({
      targetType: z.string(),
      targetId: z.string(),
      accountabilityRole: z.string(),
      assigneeOrganizationMembershipId: z.string(),
      dueAt: z.string().nullable(),
      slaPolicyVersion: z.number().int().nullable(),
    })
    .strict(),
  "workflow.assignment_ended": z
    .object({
      targetType: z.string(),
      targetId: z.string(),
      replacementAssignmentId: z.string().nullable(),
      reason: z.string(),
    })
    .strict(),
  "workflow.sla_policy_created": z
    .object({
      policyKey: z.string(),
      targetType: z.string(),
      version: z.number().int(),
    })
    .strict(),
  "workflow.sla_escalated": z
    .object({
      assignmentId: z.string(),
      dueAt: z.string(),
      severity: z.string(),
    })
    .strict(),
  "workflow.approval_chain_created": z
    .object({
      chainKey: z.string(),
      workflowType: z.string(),
      stepCount: z.number().int(),
      version: z.number().int(),
    })
    .strict(),
  "workflow.approval_requested": z
    .object({
      chainDefinitionId: z.string(),
      targetType: z.string(),
      targetId: z.string(),
    })
    .strict(),
  "workflow.approval_action_recorded": z
    .object({
      stepSequence: z.number().int(),
      decision: z.string(),
      requestStatus: z.string(),
    })
    .strict(),
  // Durable Command, Job and Projection Plane (TIP-023E)
  "command.succeeded": z
    .object({
      commandType: z.string(),
      commandId: z.string(),
      outboxEventId: z.string(),
    })
    .strict(),
  "command.failed": z
    .object({
      commandType: z.string(),
      commandId: z.string(),
      errorCode: z.string(),
    })
    .strict(),
  "job.dead_letter_disposed": z
    .object({
      jobId: z.string(),
      action: z.enum(["REQUEUE", "CANCEL"]),
      reason: z.string(),
    })
    .strict(),
  "projection.rebuilt": z
    .object({
      projectionKey: z.string(),
      jobId: z.string(),
      sourceWatermarkAt: z.string(),
    })
    .strict(),
  // Lifecycle, streaming exports and observability (TIP-023G)
  "lifecycle.legal_hold_placed": z
    .object({ scope: z.string(), missionId: z.string().nullable() })
    .strict(),
  "lifecycle.legal_hold_released": z
    .object({ scope: z.string(), missionId: z.string().nullable() })
    .strict(),
  "lifecycle.disposition_created": z
    .object({ snapshotId: z.string(), eligibleAt: z.string() })
    .strict(),
  "lifecycle.disposition_approved": z
    .object({ snapshotId: z.string(), policyVersion: z.number().int() })
    .strict(),
  "lifecycle.disposition_executed": z
    .object({ snapshotId: z.string(), objectBodyRemoved: z.boolean() })
    .strict(),
  "export.dossier_requested": z
    .object({ exportId: z.string(), missionId: z.string() })
    .strict(),
  "export.dossier_completed": z
    .object({ exportId: z.string(), partCount: z.number().int(), rowCount: z.number().int() })
    .strict(),
  // Truth Kernel (TIP-005)
  "evidence.source_created": z
    .object({ title: z.string(), sourceType: z.string() })
    .strict(),
  "evidence.snapshot_captured": z
    .object({ sourceId: z.string(), digest: z.string() })
    .strict(),
  "evidence.span_created": z
    .object({
      snapshotId: z.string(),
      startOffset: z.number().int(),
      endOffset: z.number().int(),
    })
    .strict(),
  "claim.created": z
    .object({ claimKey: z.string(), state: z.string() })
    .strict(),
  "claim.version_added": z
    .object({ versionNumber: z.number().int(), state: z.string() })
    .strict(),
  "claim.state_changed": z
    .object({ from: z.string(), to: z.string(), reason: z.string() })
    .strict(),
  "claim.honest_null_asserted": z
    .object({ searchCompleteness: z.string() })
    .strict(),
  "claim.reviewed": z
    .object({ accessLevel: z.string(), reason: z.string() })
    .strict(),
  // Skill Registry (TIP-006)
  "skill.created": z
    .object({ skillKey: z.string(), activeVersion: z.string() })
    .strict(),
  "skill.version_registered": z
    .object({
      skillKey: z.string(),
      semanticVersion: z.string(),
      digest: z.string(),
    })
    .strict(),
  "skill.version_activated": z
    .object({
      skillKey: z.string(),
      fromVersion: z.string(),
      toVersion: z.string(),
      reason: z.string(),
    })
    .strict(),
  "skill.status_changed": z
    .object({
      skillKey: z.string(),
      from: z.string(),
      to: z.string(),
      reason: z.string(),
    })
    .strict(),
  // Execution Fabric (TIP-007). Report contents remain in immutable artifacts;
  // audit payloads carry identifiers and safe state only.
  "execution.tip_created": z
    .object({
      code: z.string(),
      dependencyCount: z.number().int().nonnegative(),
    })
    .strict(),
  "execution.run_started": z
    .object({
      attemptNumber: z.number().int().positive(),
      role: z.string(),
      provider: z.string(),
      model: z.string(),
      inputArtifactId: z.string(),
    })
    .strict(),
  "execution.report_imported": z
    .object({
      result: z.string(),
      overallStatus: z.string(),
      outputArtifactId: z.string(),
      deviationCount: z.number().int().nonnegative(),
      resourceRecordCount: z.number().int().nonnegative(),
    })
    .strict(),
  "execution.deviation_resolved": z
    .object({ code: z.string(), resolution: z.string() })
    .strict(),
  // Verification & Governance (TIP-008)
  "verification.scenario_created": z
    .object({ code: z.string(), kind: z.string(), required: z.boolean() })
    .strict(),
  "verification.run_begun": z
    .object({
      independenceStatus: z.string(),
      verifierRunId: z.string(),
    })
    .strict(),
  "verification.report_completed": z
    .object({
      overallStatus: z.string(),
      reportArtifactId: z.string(),
      requirementCount: z.number().int().nonnegative(),
      scenarioCount: z.number().int().nonnegative(),
      corruptionCount: z.number().int().nonnegative(),
    })
    .strict(),
  "governance.signoff_recorded": z
    .object({
      signoffType: z.string(),
      decision: z.string(),
    })
    .strict(),
  "release.approved": z
    .object({
      visibility: z.string(),
      manifestId: z.string(),
      claimCount: z.number().int().nonnegative(),
      artifactCount: z.number().int().nonnegative(),
    })
    .strict(),
  "authoring.document_created": z
    .object({
      documentKey: z.string(),
      documentType: z.string(),
      missionId: z.string(),
      revisionNumber: z.number().int().positive(),
    })
    .strict(),
  "authoring.revision_created": z
    .object({
      revisionNumber: z.number().int().positive(),
      digest: z.string().regex(/^[a-f0-9]{64}$/),
      qualityStatus: z.string(),
      blockerCount: z.number().int().nonnegative(),
      warningCount: z.number().int().nonnegative(),
    })
    .strict(),
  "authoring.exported": z
    .object({
      revisionNumber: z.number().int().positive(),
      format: z.enum(["DOCX", "PDF"]),
      digest: z.string().regex(/^[a-f0-9]{64}$/),
    })
    .strict(),
  "research.requested": z
    .object({
      runId: z.string(),
      missionId: z.string(),
      provider: z.string(),
      model: z.string(),
    })
    .strict(),
  "research.completed": z
    .object({
      runId: z.string(),
      sourceCount: z.number().int().nonnegative(),
      findingCount: z.number().int().nonnegative(),
      resultDigest: z.string().regex(/^[a-f0-9]{64}$/),
    })
    .strict(),
  "research.reviewed": z
    .object({
      runId: z.string(),
      decision: z.enum(["APPROVED", "REJECTED"]),
      acceptedCount: z.number().int().nonnegative(),
      rejectedCount: z.number().int().nonnegative(),
      flaggedCount: z.number().int().nonnegative(),
      resultDigest: z.string().regex(/^[a-f0-9]{64}$/),
    })
    .strict(),
  "sandbox.requested": z
    .object({
      runId: z.string(),
      missionId: z.string(),
      kind: z.string(),
      runtimeId: z.string(),
      networkPolicy: z.string(),
    })
    .strict(),
  "sandbox.completed": z
    .object({
      runId: z.string(),
      outputDigest: z.string().regex(/^[a-f0-9]{64}$/),
      outputBytes: z.number().int().nonnegative(),
      isolationAttestation: z
        .object({
          engine: z.literal("docker"),
          imageReference: z.string(),
          imageDigest: z.string().regex(/^sha256:[a-f0-9]{64}$/),
          networkMode: z.literal("none"),
          readOnlyRootfs: z.literal(true),
          noNewPrivileges: z.literal(true),
          capDropAll: z.literal(true),
          pidsLimit: z.number().int().positive(),
          metricBasis: z.literal("ENFORCED_CEILING"),
        })
        .strict(),
    })
    .strict(),
  "sandbox.reviewed": z
    .object({
      runId: z.string(),
      decision: z.enum(["APPROVED", "REJECTED"]),
      outputDigest: z.string().regex(/^[a-f0-9]{64}$/),
    })
    .strict(),
} as const;

/** Canonical governed event types for Identity & Workspace. */
export const AuditEventType = {
  WorkspaceCreated: "workspace.created",
  WorkspaceUpdated: "workspace.updated",
  OrganizationProvisioned: "organization.provisioned",
  OrganizationUnitCreated: "organization.unit_created",
  OrganizationUnitMoved: "organization.unit_moved",
  OrganizationPortfolioCreated: "organization.portfolio_created",
  OrganizationGroupCreated: "organization.group_created",
  OrganizationGroupMemberAdded: "organization.group_member_added",
  AuthorizationGrantCreated: "authorization.grant_created",
  AuthorizationGrantRevoked: "authorization.grant_revoked",
  AuthorizationDenied: "authorization.denied",
  WorkspacePolicyUpdated: "workspace.policy_updated",
  MembershipCreated: "membership.created",
  MembershipRoleChanged: "membership.role_changed",
  MembershipSuspended: "membership.suspended",
  InvitationCreated: "invitation.created",
  InvitationAccepted: "invitation.accepted",
  InvitationRevoked: "invitation.revoked",
  // Mission Kernel (TIP-004)
  MissionCreated: "mission.created",
  MissionTransitioned: "mission.transitioned",
  MissionBlocked: "mission.blocked",
  MissionResumed: "mission.resumed",
  MissionArchived: "mission.archived",
  ContractCreated: "contract.created",
  ContractSubmitted: "contract.submitted",
  ContractApproved: "contract.approved",
  ContractSuperseded: "contract.superseded",
  ObligationStarted: "obligation.started",
  ObligationSatisfied: "obligation.satisfied",
  ObligationBlocked: "obligation.blocked",
  ObligationWaived: "obligation.waived",
  GateEvaluated: "gate.evaluated",
  GateWaived: "gate.waived",
  DecisionRequired: "decision.required",
  DecisionResolved: "decision.resolved",
  EscalationCreated: "escalation.created",
  EscalationAcknowledged: "escalation.acknowledged",
  EscalationResolved: "escalation.resolved",
  WorkflowAssignmentCreated: "workflow.assignment_created",
  WorkflowAssignmentEnded: "workflow.assignment_ended",
  WorkflowSlaPolicyCreated: "workflow.sla_policy_created",
  WorkflowSlaEscalated: "workflow.sla_escalated",
  WorkflowApprovalChainCreated: "workflow.approval_chain_created",
  WorkflowApprovalRequested: "workflow.approval_requested",
  WorkflowApprovalActionRecorded: "workflow.approval_action_recorded",
  CommandSucceeded: "command.succeeded",
  CommandFailed: "command.failed",
  JobDeadLetterDisposed: "job.dead_letter_disposed",
  ProjectionRebuilt: "projection.rebuilt",
  LegalHoldPlaced: "lifecycle.legal_hold_placed",
  LegalHoldReleased: "lifecycle.legal_hold_released",
  LifecycleDispositionCreated: "lifecycle.disposition_created",
  LifecycleDispositionApproved: "lifecycle.disposition_approved",
  LifecycleDispositionExecuted: "lifecycle.disposition_executed",
  DossierExportRequested: "export.dossier_requested",
  DossierExportCompleted: "export.dossier_completed",
  EvidenceSourceCreated: "evidence.source_created",
  EvidenceSnapshotCaptured: "evidence.snapshot_captured",
  EvidenceSpanCreated: "evidence.span_created",
  ClaimCreated: "claim.created",
  ClaimVersionAdded: "claim.version_added",
  ClaimStateChanged: "claim.state_changed",
  ClaimHonestNullAsserted: "claim.honest_null_asserted",
  ClaimReviewed: "claim.reviewed",
  SkillCreated: "skill.created",
  SkillVersionRegistered: "skill.version_registered",
  SkillVersionActivated: "skill.version_activated",
  SkillStatusChanged: "skill.status_changed",
  ExecutionTipCreated: "execution.tip_created",
  ExecutionRunStarted: "execution.run_started",
  ExecutionReportImported: "execution.report_imported",
  ExecutionDeviationResolved: "execution.deviation_resolved",
  VerificationScenarioCreated: "verification.scenario_created",
  VerificationRunBegun: "verification.run_begun",
  VerificationReportCompleted: "verification.report_completed",
  GovernanceSignoffRecorded: "governance.signoff_recorded",
  ReleaseApproved: "release.approved",
  AuthoringDocumentCreated: "authoring.document_created",
  AuthoringRevisionCreated: "authoring.revision_created",
  AuthoringExported: "authoring.exported",
  ResearchRequested: "research.requested",
  ResearchCompleted: "research.completed",
  ResearchReviewed: "research.reviewed",
  SandboxRequested: "sandbox.requested",
  SandboxCompleted: "sandbox.completed",
  SandboxReviewed: "sandbox.reviewed",
} as const;

export type AuditEventTypeValue =
  (typeof AuditEventType)[keyof typeof AuditEventType];

export interface AuditInput {
  workspaceId: string;
  actorUserId?: string | null;
  actorMembershipId?: string | null;
  eventType: AuditEventTypeValue;
  entityType: string;
  entityId: string;
  correlationId: string;
  payload: Record<string, unknown>;
}

// Keys whose presence anywhere in a payload indicates a secret leaked in.
const FORBIDDEN_KEY =
  /pass|token|secret|hash|cookie|authorization|session|credential|api[-_]?key|database[-_]?url/i;

/**
 * Fail closed: reject any payload that contains a key resembling a credential
 * or secret. Callers build payloads from an explicit safe allowlist; this is
 * defense in depth against accidental serialization of sensitive fields.
 */
export function assertRedactedPayload(
  payload: Record<string, unknown>,
  path = "payload",
): void {
  for (const [key, value] of Object.entries(payload)) {
    if (FORBIDDEN_KEY.test(key)) {
      throw new Error(
        `Audit payload rejected: forbidden key "${path}.${key}" may contain a secret`,
      );
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
      assertRedactedPayload(value as Record<string, unknown>, `${path}.${key}`);
    }
  }
}

/**
 * Append an audit event. There is deliberately no update/delete counterpart;
 * the `audit_event` table also rejects UPDATE/DELETE at the database level.
 */
/**
 * Validate a payload against the strict schema for its event type. Throws on
 * an unknown event type or any shape mismatch (including unknown keys).
 */
export function validateAuditPayload(
  eventType: AuditEventTypeValue,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  const schema = AUDIT_PAYLOAD_SCHEMAS[eventType];
  if (!schema) {
    throw new Error(
      `Audit payload rejected: unknown event type "${eventType}"`,
    );
  }
  const result = schema.safeParse(payload);
  if (!result.success) {
    const keys = result.error.issues
      .map((i) => i.path.join(".") || "(root)")
      .join(", ");
    throw new Error(
      `Audit payload rejected for "${eventType}": invalid shape at ${keys}`,
    );
  }
  return result.data as Record<string, unknown>;
}

export async function writeAuditEvent(
  db: DbClient,
  input: AuditInput,
): Promise<void> {
  // Strict per-event schema (allowlist) first, then fail-closed redaction.
  const payload = validateAuditPayload(input.eventType, input.payload);
  assertRedactedPayload(payload);
  await db.auditEvent.create({
    data: {
      workspaceId: input.workspaceId,
      actorUserId: input.actorUserId ?? null,
      actorMembershipId: input.actorMembershipId ?? null,
      eventType: input.eventType,
      entityType: input.entityType,
      entityId: input.entityId,
      correlationId: input.correlationId,
      payload: payload as Prisma.InputJsonValue,
    },
  });
}
