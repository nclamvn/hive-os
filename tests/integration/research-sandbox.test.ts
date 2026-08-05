import { randomUUID } from "node:crypto";

import { beforeEach, describe, expect, it } from "vitest";

import { claimJobs, dispatchOutboxBatch } from "@/modules/command-runtime";
import { createMission } from "@/modules/mission-kernel";
import {
  executeResearchJob,
  executeSandboxJob,
  getApprovedResearchBundle,
  requestComputationRun,
  requestResearchRun,
  reviewComputationRun,
  reviewResearchRun,
  sha256,
  type ResearchProvider,
  type SandboxExecutor,
} from "@/modules/research-sandbox";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";

import {
  asOwner,
  contextForMembership,
  createUser,
  ownerQuery,
  truncateAll,
} from "./helpers";

beforeEach(async () => {
  await truncateAll();
});

async function addAdmin(owner: Awaited<ReturnType<typeof asOwner>>) {
  const user = await createUser("research-reviewer");
  const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
  await withOrganizationTenant(workspace.organizationId, owner.user.id, async (tx) => {
    const ownerOrgMembership = await tx.organizationMembership.findUniqueOrThrow({
      where: { organizationId_userId: { organizationId: workspace.organizationId, userId: owner.user.id } },
    });
    await tx.organizationMembership.create({
      data: { organizationId: workspace.organizationId, userId: user.id, role: "ADMIN", createdById: owner.user.id },
    });
    await tx.membership.create({
      data: { workspaceId: workspace.id, userId: user.id, role: "ADMIN", createdById: owner.user.id },
    });
    await tx.scopedGrant.create({
      data: {
        organizationId: workspace.organizationId,
        subjectType: "USER",
        subjectUserId: user.id,
        role: "ORG_ADMIN",
        effect: "ALLOW",
        scopeType: "ORGANIZATION",
        grantedByOrganizationMembershipId: ownerOrgMembership.id,
        reason: "Independent research reviewer",
      },
    });
  });
  return contextForMembership(user, workspace.id);
}

describe("TIP-024B governed research and sandbox persistence", () => {
  it("executes through durable jobs, blocks self-review and publishes only a digest-valid approved bundle", async () => {
    const owner = await asOwner(await createUser("research-owner"));
    const reviewer = await addAdmin(owner);
    const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
    const mission = await createMission(owner, { title: "UAV forest evidence" });
    const body = "The primary protocol requires georeferenced imagery and a retained field log.";
    const excerpt = "georeferenced imagery";
    const requested = await requestResearchRun(owner, {
      missionId: mission.id,
      documentId: null,
      question: "Which evidence is required for accountable UAV inspection?",
      scope: "Primary operational protocols only.",
      providerName: "test-research",
      modelName: "research-v1",
      sourcePolicy: {
        allowedDomains: ["authority.example"],
        primaryDomains: ["authority.example"],
        requirePrimary: true,
        maxSources: 5,
      },
      queryPlan: { queries: ["UAV retained inspection evidence"], languages: ["en"] },
      idempotencyKey: `research:${randomUUID()}`,
    });
    expect(requested.status).toBe("SUCCEEDED");
    const runId = String(requested.status === "SUCCEEDED" ? requested.outcome.runId : "");

    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "dispatcher" });
    const [job] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "research-worker", jobTypes: ["research.run.execute"] });
    expect(job).toBeDefined();
    const provider: ResearchProvider = {
      providerName: "test-research",
      modelName: "research-v1",
      async execute() {
        const start = body.indexOf(excerpt);
        return {
          providerName: this.providerName,
          modelName: this.modelName,
          sources: [{ key: "protocol", canonicalUri: "https://authority.example/protocol", title: "Inspection protocol", publisher: "Authority", mediaType: "text/plain", content: body, contentDigest: sha256(body), sourceClass: "PRIMARY", capturedAt: new Date("2026-08-05T00:00:00.000Z") }],
          findings: [{ key: "required-record", kind: "SUPPORTING", claim: "Georeferenced imagery is required.", sourceKey: "protocol", exactExcerpt: excerpt, startOffset: start, endOffset: start + excerpt.length, confidence: 0.95 }],
        };
      },
    };
    await executeResearchJob({
      organizationId: workspace.organizationId,
      actorUserId: owner.user.id,
      workerId: "research-worker",
      jobId: job!.id,
      expectedVersion: job!.version,
      correlationId: owner.correlationId,
      provider,
    });
    const retained = await withOrganizationTenant(workspace.organizationId, owner.user.id, (tx) =>
      tx.researchRun.findUniqueOrThrow({ where: { id: runId }, include: { findings: true } }),
    );
    expect(retained.status).toBe("AWAITING_REVIEW");
    expect(retained.findings).toHaveLength(1);
    const review = {
      runId,
      decision: "APPROVED" as const,
      rationale: "Primary protocol and exact span independently checked.",
      findings: [{ findingId: retained.findings[0]!.id, decision: "ACCEPTED" as const, rationale: "Exact source span supports the claim." }],
    };
    await expect(reviewResearchRun(owner, review)).rejects.toMatchObject({ code: "SEPARATION_OF_DUTIES" });
    await reviewResearchRun(reviewer, review);
    const bundle = await getApprovedResearchBundle(reviewer, runId);
    expect(bundle.digest).toMatch(/^[a-f0-9]{64}$/);
    expect(bundle.findings).toHaveLength(1);
    await expect(
      ownerQuery(`UPDATE research_finding SET claim = 'tampered' WHERE id = '${retained.findings[0]!.id}'`),
    ).rejects.toThrow(/append-only/i);
  });

  it("validates actual sandbox bytes and requires an independent approval", async () => {
    const owner = await asOwner(await createUser("sandbox-owner"));
    const reviewer = await addAdmin(owner);
    const workspace = await getDb().workspace.findUniqueOrThrow({ where: { id: owner.workspace.id } });
    const mission = await createMission(owner, { title: "CAS verification" });
    const requested = await requestComputationRun(owner, {
      missionId: mission.id,
      documentId: null,
      researchRunId: null,
      kind: "CAS",
      runtimeId: "sympy",
      runtimeVersion: "1.14",
      entrypoint: "verify.py",
      networkPolicy: "DENY_ALL",
      networkAllowlist: [],
      resourceLimits: { maxCpuMillis: 10_000, maxWallSeconds: 30, maxMemoryMb: 256, maxOutputBytes: 10_000 },
      inputReference: "artifact://input/1",
      inputDigest: "a".repeat(64),
      idempotencyKey: `sandbox:${randomUUID()}`,
    });
    const runId = String(requested.status === "SUCCEEDED" ? requested.outcome.runId : "");
    await dispatchOutboxBatch({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "dispatcher" });
    const [job] = await claimJobs({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "sandbox-worker", jobTypes: ["sandbox.run.execute"] });
    const outputBody = Buffer.from('{"verified":true}');
    const executor: SandboxExecutor = {
      runtimeId: "sympy",
      runtimeVersion: "1.14",
      async execute() {
        return { runtimeId: this.runtimeId, runtimeVersion: this.runtimeVersion, outputReference: "artifact://output/1", outputDigest: sha256(outputBody), outputMediaType: "application/json", outputBody, outputBytes: outputBody.byteLength, cpuMillis: 250, wallSeconds: 1, peakMemoryMb: 80, observedNetworkHosts: [], isolationAttestation: { engine: "docker", imageReference: "example.invalid/sympy@sha256:" + "1".repeat(64), imageDigest: "sha256:" + "1".repeat(64), networkMode: "none", readOnlyRootfs: true, noNewPrivileges: true, capDropAll: true, pidsLimit: 128, metricBasis: "ENFORCED_CEILING" } };
      },
    };
    await executeSandboxJob({ organizationId: workspace.organizationId, actorUserId: owner.user.id, workerId: "sandbox-worker", jobId: job!.id, expectedVersion: job!.version, correlationId: owner.correlationId, executor });
    await expect(reviewComputationRun(owner, { runId, decision: "APPROVED", rationale: "Checked." })).rejects.toMatchObject({ code: "SEPARATION_OF_DUTIES" });
    const approved = await reviewComputationRun(reviewer, { runId, decision: "APPROVED", rationale: "Output digest and method independently checked." });
    expect(approved.status).toBe("APPROVED");
    expect(approved.outputDigest).toBe(sha256(outputBody));
  });
});
