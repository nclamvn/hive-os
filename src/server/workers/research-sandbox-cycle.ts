import { claimJobs, dispatchOutboxBatch, failJob } from "@/modules/command-runtime";
import {
  DockerSandboxExecutor,
  executeResearchJob,
  executeSandboxJob,
  OpenAIResearchProvider,
  type DockerRuntimeDefinition,
} from "@/modules/research-sandbox";
import { getObjectStorage } from "@/server/storage";
import { withOrganizationTenant } from "@/server/tenant-context";

export interface ResearchSandboxWorkerConfig {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  correlationId: string;
  openai?: { apiKey: string; projectId?: string };
  dockerRuntimes?: DockerRuntimeDefinition[];
  claimFirst?: number;
}

/** One bounded tenant cycle. Unsupported jobs are never claimed. */
export async function runResearchSandboxWorkerCycle(config: ResearchSandboxWorkerConfig) {
  const jobTypes = [
    ...(config.openai ? ["research.run.execute"] : []),
    ...(config.dockerRuntimes?.length ? ["sandbox.run.execute"] : []),
  ];
  if (!jobTypes.length) throw new Error("Research sandbox worker has no enabled adapters");
  const dispatched = await dispatchOutboxBatch({
    organizationId: config.organizationId,
    actorUserId: config.actorUserId,
    workerId: `${config.workerId}:dispatcher`,
    first: 50,
  });
  const jobs = await claimJobs({
    organizationId: config.organizationId,
    actorUserId: config.actorUserId,
    workerId: config.workerId,
    jobTypes,
    first: config.claimFirst ?? 4,
    leaseSeconds: 600,
  });
  let succeeded = 0;
  let failed = 0;
  for (const job of jobs) {
    try {
      const payload = job.payload as Record<string, unknown>;
      if (typeof payload.runId !== "string") throw new Error("Durable job payload has no runId");
      if (job.jobType === "research.run.execute") {
        const run = await withOrganizationTenant(config.organizationId, config.actorUserId, (tx) =>
          tx.researchRun.findFirstOrThrow({ where: { id: payload.runId as string, organizationId: config.organizationId } }),
        );
        if (!config.openai || run.providerName !== "openai") {
          throw new Error("No governed research adapter is registered for the requested provider");
        }
        await executeResearchJob({
          organizationId: config.organizationId,
          actorUserId: config.actorUserId,
          workerId: config.workerId,
          jobId: job.id,
          expectedVersion: job.version,
          correlationId: config.correlationId,
          provider: new OpenAIResearchProvider({
            apiKey: config.openai.apiKey,
            projectId: config.openai.projectId,
            modelName: run.modelName,
          }),
        });
      } else {
        const run = await withOrganizationTenant(config.organizationId, config.actorUserId, (tx) =>
          tx.computationRun.findFirstOrThrow({ where: { id: payload.runId as string, organizationId: config.organizationId } }),
        );
        const runtime = config.dockerRuntimes?.find(
          (candidate) => candidate.kind === run.kind && candidate.runtimeId === run.runtimeId && candidate.runtimeVersion === run.runtimeVersion,
        );
        if (!runtime) throw new Error("No governed Docker runtime is registered for the requested computation");
        await executeSandboxJob({
          organizationId: config.organizationId,
          actorUserId: config.actorUserId,
          workerId: config.workerId,
          jobId: job.id,
          expectedVersion: job.version,
          correlationId: config.correlationId,
          executor: new DockerSandboxExecutor({ runtime, storage: getObjectStorage() }),
        });
      }
      succeeded += 1;
    } catch {
      // Domain handlers bound retries/dead-lettering and retain only sanitized
      // failure codes. The process log intentionally does not echo secrets,
      // provider bodies, source content, or submitted computation code.
      await failJob({
        organizationId: config.organizationId,
        actorUserId: config.actorUserId,
        workerId: config.workerId,
        jobId: job.id,
        expectedVersion: job.version,
        errorCode: "ADAPTER_EXECUTION_FAILED",
        errorMessage: "The governed adapter could not execute this job",
        retryable: false,
      }).catch(() => undefined);
      failed += 1;
    }
  }
  return { dispatched: dispatched.dispatched, claimed: jobs.length, succeeded, failed };
}
