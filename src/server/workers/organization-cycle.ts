import {
  claimJobs,
  dispatchOutboxBatch,
  failJob,
} from "@/modules/command-runtime";
import { executeMissionDossierExportJob } from "@/modules/dossier-export";
import { executeProjectionRebuildJob } from "@/modules/projections";
import { writeOperationalEvent } from "@/server/observability/operational-log";

const REGISTERED_JOB_TYPES = [
  "projection.workspace.rebuild",
  "export.mission.dossier",
] as const;

export async function runOrganizationWorkerCycle(input: {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  correlationId: string;
  dispatchFirst?: number;
  claimFirst?: number;
}) {
  const started = performance.now();
  const dispatched = await dispatchOutboxBatch({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    workerId: `${input.workerId}:dispatcher`,
    first: input.dispatchFirst ?? 50,
  });
  const jobs = await claimJobs({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    workerId: input.workerId,
    first: input.claimFirst ?? 10,
    leaseSeconds: 300,
    jobTypes: [...REGISTERED_JOB_TYPES],
  });
  let succeeded = 0;
  let failed = 0;
  for (const job of jobs) {
    try {
      if (job.jobType === "projection.workspace.rebuild") {
        await executeProjectionRebuildJob({
          organizationId: input.organizationId,
          actorUserId: input.actorUserId,
          workerId: input.workerId,
          jobId: job.id,
          expectedVersion: job.version,
        });
      } else if (job.jobType === "export.mission.dossier") {
        await executeMissionDossierExportJob({
          organizationId: input.organizationId,
          actorUserId: input.actorUserId,
          workerId: input.workerId,
          jobId: job.id,
          expectedVersion: job.version,
          correlationId: input.correlationId,
        });
      }
      succeeded += 1;
    } catch (error) {
      failed += 1;
      // Export handlers retain their own bounded failure. A routing-level
      // failure is disposed here only while the original lease is still valid.
      if (job.jobType !== "export.mission.dossier") {
        await failJob({
          organizationId: input.organizationId,
          actorUserId: input.actorUserId,
          workerId: input.workerId,
          jobId: job.id,
          expectedVersion: job.version,
          errorCode: "WORKER_HANDLER_FAILED",
          errorMessage: "Registered worker handler failed",
        }).catch(() => undefined);
      }
      writeOperationalEvent({
        level: "error",
        event: "worker.job",
        outcome: "failure",
        correlationId: input.correlationId,
        component: "organization_worker",
        errorType: error instanceof Error ? error.name : "UnknownError",
      });
    }
  }
  const durationMs = Math.round(performance.now() - started);
  writeOperationalEvent({
    level: failed ? "warn" : "info",
    event: "worker.cycle",
    outcome: failed ? "failure" : "success",
    correlationId: input.correlationId,
    component: "organization_worker",
    durationMs,
    count: jobs.length,
    queueDepth: dispatched.dispatched,
  });
  return {
    dispatched: dispatched.dispatched,
    claimed: jobs.length,
    succeeded,
    failed,
    durationMs,
  };
}
