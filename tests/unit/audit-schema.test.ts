import { describe, expect, it } from "vitest";

import {
  AuditEventType,
  validateAuditPayload,
} from "@/modules/identity-workspace/audit";

const VALID: Record<string, Record<string, unknown>> = {
  [AuditEventType.WorkspaceCreated]: { name: "Acme", slug: "acme" },
  [AuditEventType.WorkspaceUpdated]: { name: "Acme" },
  [AuditEventType.WorkspacePolicyUpdated]: {
    defaultAssuranceProfile: "RESEARCH",
    providerPolicyMode: "ALLOWLIST_MANUAL",
    allowedProviderCount: 2,
    artifactRetentionDays: 2555,
    evidenceRetentionDays: 2555,
    auditRetentionDays: 2555,
    publicReleasePolicy: "INTERNAL_ONLY",
  },
  [AuditEventType.MembershipCreated]: { role: "OWNER", via: "onboarding" },
  [AuditEventType.MembershipRoleChanged]: { from: "OWNER", to: "ADMIN" },
  [AuditEventType.MembershipSuspended]: { role: "MEMBER" },
  [AuditEventType.InvitationCreated]: { email: "a@b.co", role: "MEMBER" },
  [AuditEventType.InvitationAccepted]: { role: "ADMIN" },
  [AuditEventType.InvitationRevoked]: { email: "a@b.co" },
  [AuditEventType.SkillCreated]: {
    skillKey: "refinery",
    activeVersion: "1.0.0",
  },
  [AuditEventType.SkillVersionRegistered]: {
    skillKey: "refinery",
    semanticVersion: "1.1.0",
    digest: "abc123",
  },
  [AuditEventType.SkillVersionActivated]: {
    skillKey: "refinery",
    fromVersion: "1.0.0",
    toVersion: "1.1.0",
    reason: "Approved contract revision",
  },
  [AuditEventType.SkillStatusChanged]: {
    skillKey: "refinery",
    from: "ACTIVE",
    to: "DEPRECATED",
    reason: "Superseded operating method",
  },
  [AuditEventType.ExecutionTipCreated]: {
    code: "TIP-007",
    dependencyCount: 1,
  },
  [AuditEventType.ExecutionRunStarted]: {
    attemptNumber: 1,
    role: "BUILDER",
    provider: "manual",
    model: "external-model",
    inputArtifactId: "artifact-id",
  },
  [AuditEventType.ExecutionReportImported]: {
    result: "DONE",
    overallStatus: "READY",
    outputArtifactId: "artifact-id",
    deviationCount: 0,
    resourceRecordCount: 2,
  },
  [AuditEventType.ExecutionDeviationResolved]: {
    code: "DEV-1",
    resolution: "Accepted implementation correction",
  },
  [AuditEventType.VerificationScenarioCreated]: {
    code: "VG-01",
    kind: "REQUIREMENT",
    required: true,
  },
  [AuditEventType.VerificationRunBegun]: {
    independenceStatus: "INDEPENDENT",
    verifierRunId: "verifier-run-id",
  },
  [AuditEventType.VerificationReportCompleted]: {
    overallStatus: "READY",
    reportArtifactId: "report-artifact-id",
    requirementCount: 1,
    scenarioCount: 1,
    corruptionCount: 1,
  },
  [AuditEventType.GovernanceSignoffRecorded]: {
    signoffType: "VERIFICATION",
    decision: "APPROVED",
  },
  [AuditEventType.ReleaseApproved]: {
    visibility: "PUBLIC",
    manifestId: "manifest-id",
    claimCount: 1,
    artifactCount: 3,
  },
  [AuditEventType.AuthoringDocumentCreated]: {
    documentKey: "DOC-1234ABCD",
    documentType: "RESEARCH_PROPOSAL",
    missionId: "mission-id",
    revisionNumber: 1,
  },
  [AuditEventType.AuthoringRevisionCreated]: {
    revisionNumber: 2,
    digest: "a".repeat(64),
    qualityStatus: "PASS",
    blockerCount: 0,
    warningCount: 0,
  },
  [AuditEventType.AuthoringExported]: {
    revisionNumber: 2,
    format: "PDF",
    digest: "a".repeat(64),
  },
  [AuditEventType.ResearchRequested]: {
    runId: "research-run",
    missionId: "mission-id",
    provider: "manual-research",
    model: "research-v1",
  },
  [AuditEventType.ResearchCompleted]: {
    runId: "research-run",
    sourceCount: 2,
    findingCount: 3,
    resultDigest: "b".repeat(64),
  },
  [AuditEventType.ResearchReviewed]: {
    runId: "research-run",
    decision: "APPROVED",
    acceptedCount: 2,
    rejectedCount: 1,
    flaggedCount: 0,
    resultDigest: "c".repeat(64),
  },
  [AuditEventType.SandboxRequested]: {
    runId: "sandbox-run",
    missionId: "mission-id",
    kind: "JUPYTER",
    runtimeId: "jupyter-python",
    networkPolicy: "DENY_ALL",
  },
  [AuditEventType.SandboxCompleted]: {
    runId: "sandbox-run",
    outputDigest: "d".repeat(64),
    outputBytes: 1024,
    isolationAttestation: {
      engine: "docker",
      imageReference: "example.invalid/runtime@sha256:" + "1".repeat(64),
      imageDigest: "sha256:" + "1".repeat(64),
      networkMode: "none",
      readOnlyRootfs: true,
      noNewPrivileges: true,
      capDropAll: true,
      pidsLimit: 128,
      metricBasis: "ENFORCED_CEILING",
    },
  },
  [AuditEventType.SandboxReviewed]: {
    runId: "sandbox-run",
    decision: "APPROVED",
    outputDigest: "d".repeat(64),
  },
};

describe("audit payload contract (SEC-02)", () => {
  it("AUD-PAYLOAD-01 accepts a valid payload for every event type", () => {
    for (const [eventType, payload] of Object.entries(VALID)) {
      expect(() =>
        validateAuditPayload(eventType as never, payload),
      ).not.toThrow();
    }
  });

  it("AUD-PAYLOAD-02 rejects an unknown field", () => {
    expect(() =>
      validateAuditPayload(AuditEventType.WorkspaceUpdated, {
        name: "Acme",
        extra: "nope",
      }),
    ).toThrow(/invalid shape/);
  });

  it("AUD-PAYLOAD-03 rejects a credential/token/secret-like field", () => {
    for (const key of ["password", "token", "secret", "sessionToken"]) {
      expect(() =>
        validateAuditPayload(AuditEventType.MembershipSuspended, {
          role: "MEMBER",
          [key]: "x",
        }),
      ).toThrow(/invalid shape/);
    }
  });

  it("AUD-PAYLOAD-04 rejects an arbitrary request-shaped object", () => {
    expect(() =>
      validateAuditPayload(AuditEventType.InvitationCreated, {
        email: "a@b.co",
        role: "MEMBER",
        headers: { cookie: "session=abc" },
        body: { password: "p" },
      }),
    ).toThrow(/invalid shape/);
  });

  it("rejects an unknown event type", () => {
    expect(() =>
      validateAuditPayload("totally.unknown.event" as never, {}),
    ).toThrow(/unknown event type/);
  });
});
