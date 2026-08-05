import { completeJob, failJob } from "@/modules/command-runtime";
import {
  AuditEventType,
  enforceManualProviderPolicy,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import { withOrganizationTenant } from "@/server/tenant-context";

import {
  queryPlanSchema,
  resourceLimitsSchema,
  sourcePolicySchema,
  type ResearchProvider,
  type SandboxExecutor,
} from "./contracts";
import { ResearchSandboxError } from "./errors";
import {
  digestResearchResult,
  validateResearchProviderResult,
  validateSandboxExecutorResult,
} from "./integrity";

interface WorkerJobInput {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  jobId: string;
  expectedVersion: number;
  correlationId: string;
}

async function failWorkerJob(
  input: WorkerJobInput,
  run: { id: string; kind: "research" | "sandbox" },
  error: unknown,
) {
  const code = error instanceof ResearchSandboxError ? error.code : "INVALID_INPUT";
  const failed = await failJob({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    workerId: input.workerId,
    jobId: input.jobId,
    expectedVersion: input.expectedVersion,
    errorCode: code,
    errorMessage: run.kind === "research" ? "Research worker result was rejected" : "Sandbox worker result was rejected",
    retryable: !["INTEGRITY_FAILURE", "PROVIDER_MISMATCH", "SANDBOX_LIMIT_EXCEEDED"].includes(code),
  });
  await withOrganizationTenant(input.organizationId, input.actorUserId, (tx) =>
    run.kind === "research"
      ? tx.researchRun.updateMany({
          where: { id: run.id, organizationId: input.organizationId, status: { in: ["QUEUED", "RUNNING"] } },
          data: { status: failed.status === "DEAD_LETTER" ? "FAILED" : "QUEUED", failureCode: code, version: { increment: 1 } },
        })
      : tx.computationRun.updateMany({
          where: { id: run.id, organizationId: input.organizationId, status: { in: ["QUEUED", "RUNNING"] } },
          data: { status: failed.status === "DEAD_LETTER" ? "FAILED" : "QUEUED", failureCode: code, version: { increment: 1 } },
        }),
  );
}

export async function executeResearchJob(
  input: WorkerJobInput & { provider: ResearchProvider },
) {
  const loaded = await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const job = await tx.durableJob.findFirst({
      where: {
        id: input.jobId,
        organizationId: input.organizationId,
        status: "RUNNING",
        lockedBy: input.workerId,
        version: input.expectedVersion,
        leaseExpiresAt: { gt: new Date() },
        jobType: "research.run.execute",
      },
    });
    if (!job) throw new ResearchSandboxError("JOB_CONFLICT", "Research job lease is invalid");
    const payload = job.payload as Record<string, unknown>;
    if (typeof payload.runId !== "string") throw new ResearchSandboxError("INVALID_INPUT", "Research job payload is invalid");
    const run = await tx.researchRun.findFirst({ where: { id: payload.runId, organizationId: input.organizationId } });
    if (!run) throw new ResearchSandboxError("NOT_FOUND", "Research run not found");
    await enforceManualProviderPolicy(tx, run.workspaceId, run.providerName, run.modelName);
    if (run.status === "AWAITING_REVIEW") return { job, run, alreadyComplete: true as const };
    if (!['QUEUED', 'RUNNING'].includes(run.status)) throw new ResearchSandboxError("INVALID_TRANSITION", "Research run cannot be executed in its current state");
    await tx.researchRun.update({
      where: { id: run.id },
      data: { status: "RUNNING", jobId: job.id, startedAt: run.startedAt ?? new Date(), failureCode: null, version: { increment: 1 } },
    });
    return { job, run, alreadyComplete: false as const };
  });

  try {
    if (loaded.alreadyComplete) {
      return completeJob({
        organizationId: input.organizationId,
        actorUserId: input.actorUserId,
        workerId: input.workerId,
        jobId: input.jobId,
        expectedVersion: input.expectedVersion,
        result: { runId: loaded.run.id, status: "AWAITING_REVIEW" },
      });
    }
    if (input.provider.providerName !== loaded.run.providerName || input.provider.modelName !== loaded.run.modelName) {
      throw new ResearchSandboxError("PROVIDER_MISMATCH", "Connected research adapter does not match the requested provider identity");
    }
    const sourcePolicy = sourcePolicySchema.parse(loaded.run.sourcePolicy);
    const queryPlan = queryPlanSchema.parse(loaded.run.queryPlan);
    const result = validateResearchProviderResult(
      await input.provider.execute({
        missionId: loaded.run.missionId,
        documentId: loaded.run.documentId,
        question: loaded.run.question,
        scope: loaded.run.scope,
        providerName: loaded.run.providerName,
        modelName: loaded.run.modelName,
        sourcePolicy,
        queryPlan,
      }),
      { providerName: loaded.run.providerName, modelName: loaded.run.modelName, sourcePolicy },
    );
    const resultDigest = digestResearchResult({
      provider: result.providerName,
      model: result.modelName,
      sources: result.sources.map((source, index) => ({
        key: source.key,
        canonicalUri: source.canonicalUri,
        title: source.title,
        publisher: source.publisher,
        mediaType: source.mediaType,
        contentDigest: source.contentDigest,
        sourceClass: source.sourceClass,
        capturedAt: source.capturedAt.toISOString(),
        provenance: result.provenances[index],
      })),
      findings: result.findings,
    });
    await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
      await tx.$queryRaw`SELECT id FROM research_run WHERE organization_id = ${input.organizationId} AND id = ${loaded.run.id} FOR UPDATE`;
      const current = await tx.researchRun.findUniqueOrThrow({ where: { id: loaded.run.id } });
      if (current.status === "AWAITING_REVIEW") return;
      if (current.status !== "RUNNING" || current.jobId !== input.jobId) {
        throw new ResearchSandboxError("JOB_CONFLICT", "Research run is no longer owned by this job");
      }
      const sourceIds = new Map<string, string>();
      for (let index = 0; index < result.sources.length; index += 1) {
        const source = result.sources[index]!;
        const created = await tx.researchSourceSnapshot.create({
          data: {
            organizationId: input.organizationId,
            workspaceId: current.workspaceId,
            missionId: current.missionId,
            researchRunId: current.id,
            canonicalUri: source.canonicalUri,
            title: source.title,
            publisher: source.publisher,
            mediaType: source.mediaType,
            content: source.content,
            contentDigest: source.contentDigest,
            provenance: result.provenances[index]!,
            capturedAt: source.capturedAt,
          },
        });
        sourceIds.set(source.key, created.id);
      }
      for (const finding of result.findings) {
        await tx.researchFinding.create({
          data: {
            organizationId: input.organizationId,
            workspaceId: current.workspaceId,
            missionId: current.missionId,
            researchRunId: current.id,
            sourceId: finding.sourceKey ? sourceIds.get(finding.sourceKey) : null,
            findingKey: finding.key,
            kind: finding.kind,
            claim: finding.claim,
            exactExcerpt: finding.exactExcerpt,
            startOffset: finding.startOffset,
            endOffset: finding.endOffset,
            confidence: finding.confidence,
          },
        });
      }
      await tx.researchRun.update({
        where: { id: current.id },
        data: { status: "AWAITING_REVIEW", completedAt: new Date(), version: { increment: 1 } },
      });
      await writeAuditEvent(tx, {
        workspaceId: current.workspaceId,
        actorUserId: input.actorUserId,
        actorMembershipId: null,
        eventType: AuditEventType.ResearchCompleted,
        entityType: "ResearchRun",
        entityId: current.id,
        correlationId: input.correlationId,
        payload: { runId: current.id, sourceCount: result.sources.length, findingCount: result.findings.length, resultDigest },
      });
    });
    return completeJob({
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      workerId: input.workerId,
      jobId: input.jobId,
      expectedVersion: input.expectedVersion,
      result: { runId: loaded.run.id, resultDigest, sourceCount: result.sources.length, findingCount: result.findings.length },
    });
  } catch (error) {
    await failWorkerJob(input, { id: loaded.run.id, kind: "research" }, error);
    throw error;
  }
}

export async function executeSandboxJob(
  input: WorkerJobInput & { executor: SandboxExecutor },
) {
  const loaded = await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const job = await tx.durableJob.findFirst({
      where: {
        id: input.jobId,
        organizationId: input.organizationId,
        status: "RUNNING",
        lockedBy: input.workerId,
        version: input.expectedVersion,
        leaseExpiresAt: { gt: new Date() },
        jobType: "sandbox.run.execute",
      },
    });
    if (!job) throw new ResearchSandboxError("JOB_CONFLICT", "Sandbox job lease is invalid");
    const payload = job.payload as Record<string, unknown>;
    if (typeof payload.runId !== "string") throw new ResearchSandboxError("INVALID_INPUT", "Sandbox job payload is invalid");
    const run = await tx.computationRun.findFirst({ where: { id: payload.runId, organizationId: input.organizationId } });
    if (!run) throw new ResearchSandboxError("NOT_FOUND", "Computation run not found");
    if (run.status === "AWAITING_REVIEW") return { job, run, alreadyComplete: true as const };
    if (!['QUEUED', 'RUNNING'].includes(run.status)) throw new ResearchSandboxError("INVALID_TRANSITION", "Computation run cannot execute in its current state");
    await tx.computationRun.update({
      where: { id: run.id },
      data: { status: "RUNNING", jobId: job.id, startedAt: run.startedAt ?? new Date(), failureCode: null, version: { increment: 1 } },
    });
    return { job, run, alreadyComplete: false as const };
  });

  try {
    if (loaded.alreadyComplete) {
      return completeJob({
        organizationId: input.organizationId,
        actorUserId: input.actorUserId,
        workerId: input.workerId,
        jobId: input.jobId,
        expectedVersion: input.expectedVersion,
        result: { runId: loaded.run.id, status: "AWAITING_REVIEW", outputDigest: loaded.run.outputDigest ?? "" },
      });
    }
    if (input.executor.runtimeId !== loaded.run.runtimeId || input.executor.runtimeVersion !== loaded.run.runtimeVersion) {
      throw new ResearchSandboxError("PROVIDER_MISMATCH", "Connected sandbox adapter does not match the requested runtime identity");
    }
    const limits = resourceLimitsSchema.parse(loaded.run.resourceLimits);
    const networkAllowlist = Array.isArray(loaded.run.networkAllowlist)
      ? loaded.run.networkAllowlist.filter((item): item is string => typeof item === "string")
      : [];
    const result = validateSandboxExecutorResult(
      await input.executor.execute({
        missionId: loaded.run.missionId,
        documentId: loaded.run.documentId,
        researchRunId: loaded.run.researchRunId,
        kind: loaded.run.kind,
        runtimeId: loaded.run.runtimeId,
        runtimeVersion: loaded.run.runtimeVersion,
        entrypoint: loaded.run.entrypoint,
        networkPolicy: loaded.run.networkPolicy,
        networkAllowlist,
        resourceLimits: limits,
        inputReference: loaded.run.inputReference,
        inputDigest: loaded.run.inputDigest,
      }),
      {
        runtimeId: loaded.run.runtimeId,
        runtimeVersion: loaded.run.runtimeVersion,
        networkPolicy: loaded.run.networkPolicy,
        networkAllowlist,
        resourceLimits: limits,
      },
    );
    await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
      await tx.$queryRaw`SELECT id FROM computation_run WHERE organization_id = ${input.organizationId} AND id = ${loaded.run.id} FOR UPDATE`;
      const current = await tx.computationRun.findUniqueOrThrow({ where: { id: loaded.run.id } });
      if (current.status === "AWAITING_REVIEW") return;
      if (current.status !== "RUNNING" || current.jobId !== input.jobId) throw new ResearchSandboxError("JOB_CONFLICT", "Computation run is no longer owned by this job");
      await tx.computationRun.update({
        where: { id: current.id },
        data: {
          status: "AWAITING_REVIEW",
          outputReference: result.outputReference,
          outputDigest: result.outputDigest,
          outputMediaType: result.outputMediaType,
          outputBytes: result.outputBytes,
          completedAt: new Date(),
          version: { increment: 1 },
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: current.workspaceId,
        actorUserId: input.actorUserId,
        actorMembershipId: null,
        eventType: AuditEventType.SandboxCompleted,
        entityType: "ComputationRun",
        entityId: current.id,
        correlationId: input.correlationId,
        payload: {
          runId: current.id,
          outputDigest: result.outputDigest,
          outputBytes: result.outputBytes,
          isolationAttestation: result.isolationAttestation,
        },
      });
    });
    return completeJob({
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      workerId: input.workerId,
      jobId: input.jobId,
      expectedVersion: input.expectedVersion,
      result: {
        runId: loaded.run.id,
        outputDigest: result.outputDigest,
        outputBytes: result.outputBytes,
        isolationAttestation: result.isolationAttestation,
      },
    });
  } catch (error) {
    await failWorkerJob(input, { id: loaded.run.id, kind: "sandbox" }, error);
    throw error;
  }
}
