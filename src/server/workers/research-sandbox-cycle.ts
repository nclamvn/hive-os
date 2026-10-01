import type { Prisma } from "@prisma/client";

import {
  claimJobs,
  failJob,
} from "@/modules/command-runtime/jobs";
import { dispatchOutboxBatch } from "@/modules/command-runtime/kernel";
import {
  DockerSandboxExecutor,
  type DockerRuntimeDefinition,
} from "@/modules/research-sandbox/adapters/docker-sandbox";
import { OpenAIResearchProvider } from "@/modules/research-sandbox/adapters/openai-research";
import { CodexLocalMathProvider } from "@/modules/research-sandbox/adapters/codex-local-math";
import { CodexLocalMathReviewer } from "@/modules/research-sandbox/adapters/codex-local-review";
import { executeMathPilotAgentReviewJob } from "@/modules/research-sandbox/agent-review-kernel";
import { executeMathExactNumericVerificationJob } from "@/modules/research-sandbox/math-exact-numeric-kernel";
import { executeMathPilotFormalAttemptJob } from "@/modules/research-sandbox/math-formal-kernel";
import { executeMathPilotFormalReplayJob } from "@/modules/research-sandbox/math-formal-replay-kernel";
import { CodexLocalMathCycleAgent } from "@/modules/research-sandbox/adapters/codex-local-cycle";
import { executeMathResearchCycleRound, markMathResearchCycleFailed } from "@/modules/research-sandbox/math-cycle-kernel";
import { mathPilotScope } from "@/modules/research-sandbox/math-pilot";
import { ResearchSandboxError } from "@/modules/research-sandbox/errors";
import { mixedCoreAgentMandate } from "@/modules/research-sandbox/math-mixed-core-agent";
import { adaptiveAgentMandate } from "@/modules/research-sandbox/math-adaptive-strategy";
import {
  executeResearchJob,
  executeSandboxJob,
} from "@/modules/research-sandbox/worker";
import { getObjectStorage } from "@/server/storage";
import { getEnv } from "@/server/env";
import { withOrganizationTenant } from "@/server/tenant-context";

export interface ResearchSandboxWorkerConfig {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  correlationId: string;
  openai?: { apiKey: string; projectId?: string };
  codexLocal?: boolean;
  dockerRuntimes?: DockerRuntimeDefinition[];
  claimFirst?: number;
}

/** One bounded tenant cycle. Unsupported jobs are never claimed. */
export async function runResearchSandboxWorkerCycle(config: ResearchSandboxWorkerConfig) {
  const jobTypes = [
    ...(config.openai ? ["research.run.execute"] : []),
    ...(config.codexLocal ? ["math-pilot.codex-local.execute", "math-pilot.codex-local.review", "math-pilot.exact-interval.verify", "math-pilot.formalize.check", "math-pilot.formal-replay.check", "math-pilot.cycle.round"] : []),
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
    // Subscription-backed calls may occupy the full lease. Do not claim a
    // second local job which would expire while waiting behind the first.
    first: config.codexLocal ? 1 : config.claimFirst ?? 4,
    leaseSeconds: 1_800,
  });
  let succeeded = 0;
  let failed = 0;
  for (const job of jobs) {
    try {
      const payload = job.payload as Record<string, unknown>;
      if (job.jobType === "math-pilot.cycle.round") {
        const planner = new CodexLocalMathCycleAgent();
        const solver = new CodexLocalMathProvider();
        const reviewer = new CodexLocalMathReviewer("codex", solver.modelName,
          getEnv().MATH_REVIEW_ADVERSARY_MODEL ?? solver.modelName);
        await executeMathResearchCycleRound({
          organizationId: config.organizationId, actorUserId: config.actorUserId,
          workerId: config.workerId, jobId: job.id, expectedVersion: job.version,
          agents: {
            modelName: solver.modelName,
            reviewRoleModels: reviewer.roleModels,
            proposePortfolio: (root, gaps, prior, priorArt, findings, gateDossier, priorObligations, mixed, strategy) =>
              planner.proposePortfolio(root, gaps, prior, priorArt, findings, gateDossier, priorObligations, mixed, strategy),
            propose: (root, gaps, prior, priorArt, steering, findings, gateDossier, priorObligations, mixed, strategy) =>
              planner.propose(root, gaps, prior, priorArt, steering, findings, gateDossier, priorObligations, mixed, strategy),
            verify: (root, gaps, prior, proposal, priorArt, steering, findings, assessments, gateDossier, structuralProbe, priorObligations, mixed, strategy) =>
              planner.verify(root, gaps, prior, proposal, priorArt, steering, findings, assessments, gateDossier, structuralProbe, priorObligations, mixed, strategy),
            buildFrontierDossier: (root) => planner.buildFrontierDossier(root),
            assessFrontier: (role, root, proposal, dossier, mixed, strategy) => planner.assessFrontier(role, root, proposal, dossier, mixed, strategy),
            solve: async (contract, evidence, replay, gateDossier, mixed, strategy) => {
              const result = await solver.execute({ missionId: "cycle-subtask", documentId: null,
                question: contract.statement,
                scope: mathPilotScope(contract) + (evidence ? `\n\nExact bounded computation evidence (data, not a universal proof): ${JSON.stringify(evidence)}` : "") +
                  (replay ? `\n\nIndependent fixed-tool arithmetic replay (finite scope only): ${JSON.stringify(replay)}` : "") +
                  (gateDossier ? `\n\nIndependently replayed prior gate dossier for one prime (finite evidence, not proof): ${JSON.stringify(gateDossier)}` : "") +
                  (mixed ? `\n\n${mixedCoreAgentMandate(mixed)}\nBound mixedCoreEvidence (data): ${JSON.stringify(mixed)}` : "") +
                  (strategy ? `\n\n${adaptiveAgentMandate(strategy)}` : ""),
                providerName: solver.providerName,
                modelName: solver.modelName, sourcePolicy: { allowedDomains: [], primaryDomains: [], requirePrimary: false, maxSources: 1 },
                queryPlan: { queries: [contract.statement], languages: ["en"] } });
              if (!result.mathAttempt) throw new Error("Cycle solver did not return a math attempt");
              return result.mathAttempt;
            },
            reviewRole: (role, contract, attempt, evidence, replay, counterexampleReplay, gateDossier, mixed, strategy) =>
              reviewer.reviewRole(role, contract, attempt, evidence, replay, counterexampleReplay, gateDossier, undefined, undefined, mixed, strategy),
          },
        });
        succeeded += 1;
        continue;
      }
      if (job.jobType === "math-pilot.codex-local.review") {
        await executeMathPilotAgentReviewJob({
          organizationId: config.organizationId, actorUserId: config.actorUserId,
          workerId: config.workerId, jobId: job.id, expectedVersion: job.version,
          correlationId: config.correlationId,
          reviewer: new CodexLocalMathReviewer("codex", "gpt-6-sol",
            getEnv().MATH_REVIEW_ADVERSARY_MODEL ?? "gpt-6-sol"),
        });
        succeeded += 1;
        continue;
      }
      if (job.jobType === "math-pilot.exact-interval.verify") {
        await executeMathExactNumericVerificationJob({
          organizationId: config.organizationId, actorUserId: config.actorUserId,
          workerId: config.workerId, jobId: job.id, expectedVersion: job.version,
        });
        succeeded += 1;
        continue;
      }
      if (job.jobType === "math-pilot.formalize.check") {
        await executeMathPilotFormalAttemptJob({
          organizationId: config.organizationId, actorUserId: config.actorUserId,
          workerId: config.workerId, jobId: job.id, expectedVersion: job.version,
        });
        succeeded += 1;
        continue;
      }
      if (job.jobType === "math-pilot.formal-replay.check") {
        await executeMathPilotFormalReplayJob({
          organizationId: config.organizationId, actorUserId: config.actorUserId,
          workerId: config.workerId, jobId: job.id, expectedVersion: job.version,
        });
        succeeded += 1;
        continue;
      }
      if (typeof payload.runId !== "string") throw new Error("Durable job payload has no runId");
      if (job.jobType === "research.run.execute" || job.jobType === "math-pilot.codex-local.execute") {
        const run = await withOrganizationTenant(config.organizationId, config.actorUserId, (tx) =>
          tx.researchRun.findFirstOrThrow({ where: { id: payload.runId as string, organizationId: config.organizationId } }),
        );
        const codexJob = job.jobType === "math-pilot.codex-local.execute";
        if (codexJob ? !config.codexLocal || run.providerName !== "codex-local" : !config.openai || run.providerName !== "openai") {
          throw new Error("No governed research adapter is registered for the requested provider");
        }
        await executeResearchJob({
          organizationId: config.organizationId,
          actorUserId: config.actorUserId,
          workerId: config.workerId,
          jobId: job.id,
          expectedVersion: job.version,
          correlationId: config.correlationId,
          provider: codexJob ? new CodexLocalMathProvider() : new OpenAIResearchProvider({
            apiKey: config.openai!.apiKey,
            projectId: config.openai!.projectId,
            modelName: run.modelName,
            onUsage: async (usage) => {
              await withOrganizationTenant(config.organizationId, config.actorUserId, async (tx) => {
                await tx.$queryRaw`SELECT id FROM research_run WHERE organization_id = ${config.organizationId} AND id = ${run.id} FOR UPDATE`;
                const current = await tx.researchRun.findUniqueOrThrow({ where: { id: run.id } });
                if (current.status !== "RUNNING" || current.jobId !== job.id || current.providerUsage !== null) {
                  throw new Error("Provider usage cannot be recorded outside the active research job");
                }
                await tx.researchRun.update({
                  where: { id: run.id },
                  data: { providerUsage: usage as Prisma.InputJsonValue, version: { increment: 1 } },
                });
              });
            },
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
    } catch (error) {
      if (job.jobType === "math-pilot.cycle.round") {
        await markMathResearchCycleFailed({ organizationId: config.organizationId,
          actorUserId: config.actorUserId, workerId: config.workerId, jobId: job.id,
          expectedVersion: job.version }, error instanceof ResearchSandboxError && error.code === "INTEGRITY_FAILURE"
          ? "INTEGRITY_FAILURE" : "MODEL_FAILURE").catch(() => undefined);
      }
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
