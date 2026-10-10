/** Local-only TIP-062 bindings. Import only after CLI local-database guard. */
import { randomUUID } from "node:crypto";
import { getDb } from "@/server/db";
import { getEnv } from "@/server/env";
import { withOrganizationTenant } from "@/server/tenant-context";
import { authorize } from "@/modules/authorization";
import type { WorkspaceContext } from "@/modules/identity-workspace/context";
import { claimJobs, failJob } from "@/modules/command-runtime/jobs";
import { dispatchOutboxBatch } from "@/modules/command-runtime/kernel";
import { requestResearchRun, listMathPilotCases } from "@/modules/research-sandbox/kernel";
import { resolveMathPilotContract, mathPilotScope, digestMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { loadMathCalibrationReadiness } from "@/modules/research-sandbox/math-dossier-loader";
import { validateRecordedMathAgentReview } from "@/modules/research-sandbox/agent-review";
import { executeResearchJob } from "@/modules/research-sandbox/worker";
import { executeMathPilotAgentReviewJob } from "@/modules/research-sandbox/agent-review-kernel";
import { CodexLocalMathProvider, runCodex } from "@/modules/research-sandbox/adapters/codex-local-math";
import { CodexLocalMathReviewer } from "@/modules/research-sandbox/adapters/codex-local-review";
import { LRC_OBSERVATION_TARGET as target, ObservationStop,
  assertObservationLocalEnvironment,
  type ObservationRuntime, type ObservationIdentity, type ObservationReceipt, type ObservationBudget } from "./lrc-controlled-observation";

export function createObservationRuntime(options: {
  actor: { userId: string } | { email: string }; receipt: ObservationReceipt; budget: ObservationBudget; mode: "preflight" | "run";
}): ObservationRuntime {
  let context: WorkspaceContext;
  let exactCreated: { caseId: string; runId: string; commandId: string; outboxId: string };
  const workerId = `tip062:${randomUUID()}`;
  const common = (identity: ObservationIdentity) => ({ organizationId: identity.organizationId,
    actorUserId: identity.actorUserId, workerId, correlationId: context.correlationId });
  const tenant = <T>(identity: ObservationIdentity, work: Parameters<typeof withOrganizationTenant<T>>[2]) =>
    withOrganizationTenant(identity.organizationId, identity.actorUserId, work);
  const provider = new CodexLocalMathProvider("codex", options.budget.controller.signal);
  const reviewer = new CodexLocalMathReviewer("codex", target.modelName, target.modelName, options.budget.controller.signal);
  let attemptedRoles = 0;
  return {
    async preflight() {
      assertObservationLocalEnvironment(process.env);
      const db = getDb();
      const user = await db.user.findUnique({ where: "userId" in options.actor ? { id: options.actor.userId } : { email: options.actor.email },
        select: { id: true, name: true, email: true } });
      if (!user) throw new ObservationStop("EXACT_ACTOR_NOT_FOUND");
      const workspaces = await db.workspace.findMany({ where: { slug: target.workspaceSlug, status: "ACTIVE" }, take: 2 });
      if (workspaces.length !== 1) throw new ObservationStop("FIXED_WORKSPACE_MISSING_OR_AMBIGUOUS");
      const workspace = workspaces[0];
      const membership = await db.membership.findUnique({ where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
        select: { id: true, role: true, status: true } });
      if (!membership || membership.status !== "ACTIVE") throw new ObservationStop("ACTOR_MEMBERSHIP_INACTIVE");
      context = { user, workspace, membership, correlationId: randomUUID() };
      const identity = { organizationId: workspace.organizationId, workspaceId: workspace.id,
        actorUserId: user.id, membershipId: membership.id };
      const resource = { organizationId: workspace.organizationId, workspaceId: workspace.id, missionId: target.missionId };
      // authorize is read-only. requireWorkspaceAuthorization would append a denial audit.
      for (const capability of ["research.read", "research.request", "jobs.manage"] as const) {
        if (!(await authorize(user.id, capability, resource)).allowed) throw new ObservationStop("ACTOR_CAPABILITY_DENIED");
      }
      const orgMembership = await tenant(identity, tx => tx.organizationMembership.findUnique({
        where: { organizationId_userId: { organizationId: workspace.organizationId, userId: user.id } }, select: { status: true } }));
      if (orgMembership?.status !== "ACTIVE") throw new ObservationStop("ACTOR_ORGANIZATION_MEMBERSHIP_INACTIVE");
      const calibration = await loadMathCalibrationReadiness(context, target.missionId, target.providerName, target.modelName);
      const calibrated = calibration.passed;
      const conflicts = await tenant(identity, tx => tx.mathPilotCase.findMany({ where: {
        organizationId: identity.organizationId, workspaceId: identity.workspaceId, missionId: target.missionId, caseType: "OPEN",
        researchRun: { providerName: target.providerName, modelName: target.modelName }, OR: [
          { researchRun: { status: { in: ["QUEUED", "RUNNING"] } } },
          { researchRun: { status: "AWAITING_REVIEW" }, agentReview: { is: null } },
          { researchCycles: { some: { status: { in: ["QUEUED", "RUNNING"] } } } },
        ] }, select: { id: true, researchRun: { select: { status: true } }, agentReview: { select: { id: true } },
          researchCycles: { where: { status: { in: ["QUEUED", "RUNNING"] } }, select: { id: true }, take: 1 } }, take: 500 }));
      let conflictingActiveCase = conflicts.length === 500;
      for (const item of conflicts) {
        // A terminal old review does not authorize overlap with an active cycle.
        // This prospective driver fence is stricter than the legacy exception;
        // no historical record or existing request kernel is rewritten.
        if (item.researchCycles.length > 0) { conflictingActiveCase = true; break; }
        if (item.researchRun.status === "AWAITING_REVIEW" && !item.agentReview) {
          const terminalReview = await tenant(identity, tx => tx.durableJob.findFirst({ where: { organizationId: identity.organizationId,
            workspaceId: identity.workspaceId, jobType: "math-pilot.codex-local.review", status: "DEAD_LETTER",
            payload: { path: ["caseId"], equals: item.id } }, select: { id: true } }));
          if (terminalReview) continue;
        }
        conflictingActiveCase = true; break;
      }
      const env = getEnv();
      await options.receipt.append({ event: "DISPATCH_CAPABILITIES", queueEnabled: env.MATH_PILOT_QUEUE_ENABLED,
        campaignEnabled: env.LRC_CAMPAIGN_LOCAL_ENABLED, sharedWorkerEnabled: env.RESEARCH_WORKER_ENABLED,
        note: options.mode === "preflight" ? "Read-only readiness; dispatch authority remains closed" : "Process-local one-shot activation" });
      return { identity, authorized: true, capabilities: env.RESEARCH_CODEX_LOCAL_ENABLED &&
        (options.mode === "preflight" ? !env.MATH_PILOT_QUEUE_ENABLED && !env.LRC_CAMPAIGN_LOCAL_ENABLED : env.MATH_PILOT_QUEUE_ENABLED && env.LRC_CAMPAIGN_LOCAL_ENABLED),
        calibrationProof: calibrated.has("CALIBRATION_PROOF"), calibrationCounterexample: calibrated.has("CALIBRATION_COUNTEREXAMPLE"),
        conflictingActiveCase };
    },
    async login(signal) {
      const status = await runCodex("codex", ["login", "status"], "/private/tmp", "", true, signal);
      if (!/Logged in using ChatGPT/i.test(status)) throw new ObservationStop("SUBSCRIPTION_LOGIN_REQUIRED");
    },
    async create(identity) {
      const mathPilot = { caseType: "LRC_CAMPAIGN" as const, preset: "ALLIKVERE_P83_14_V1" as const };
      const contract = resolveMathPilotContract(mathPilot);
      const outcome = await requestResearchRun(context, { missionId: target.missionId, documentId: null,
        question: contract.statement, scope: mathPilotScope(contract), providerName: target.providerName, modelName: target.modelName,
        sourcePolicy: { allowedDomains: [], primaryDomains: [], requirePrimary: false, maxSources: 1 },
        queryPlan: { queries: [contract.statement], languages: ["en"] }, mathPilot, idempotencyKey: `tip062:${randomUUID()}` });
      if (outcome.status !== "SUCCEEDED" || typeof outcome.outcome.runId !== "string" || outcome.outboxEventIds.length !== 1) {
        await options.receipt.append({ event: "COMMAND_OUTCOME", commandId: outcome.commandId, status: outcome.status, outboxIds: outcome.outboxEventIds });
        throw new ObservationStop("AUTHORIZED_COMMAND_FAILED_OR_AMBIGUOUS");
      }
      const runId = outcome.outcome.runId;
      const knownIds = { commandId: outcome.commandId, runId, outboxId: outcome.outboxEventIds[0] };
      const pilotCase = await tenant(identity, tx => tx.mathPilotCase.findFirst({ where: { organizationId: identity.organizationId,
        workspaceId: identity.workspaceId, missionId: target.missionId, researchRunId: runId }, select: { id: true } }))
        .catch(() => { throw new ObservationStop("CREATED_CASE_ID_UNAVAILABLE", knownIds); });
      if (!pilotCase) throw new ObservationStop("CREATED_CASE_ID_UNAVAILABLE", knownIds);
      // Return the exact known target before any failure-prone success journal.
      // The outer callback captures it immediately, then emits CREATED.
      exactCreated = { commandId: outcome.commandId, runId, caseId: pilotCase.id, outboxId: outcome.outboxEventIds[0] };
      return exactCreated;
    },
    async dispatch(identity, outboxId) {
      const event = await tenant(identity, tx => tx.outboxEvent.findFirst({ where: { id: outboxId,
        organizationId: identity.organizationId, workspaceId: identity.workspaceId, commandId: exactCreated.commandId },
        select: { topic: true, aggregateId: true, aggregateType: true, status: true } }));
      const solver = outboxId === exactCreated.outboxId;
      if (!event || event.status !== "PENDING" || event.topic !== (solver ? "math-pilot.codex-local.execute" : "math-pilot.codex-local.review") ||
        event.aggregateId !== (solver ? exactCreated.runId : exactCreated.caseId) || event.aggregateType !== (solver ? "ResearchRun" : "MathPilotCase")) throw new ObservationStop("EXACT_OUTBOX_BINDING_INVALID");
      const result = await dispatchOutboxBatch({ ...common(identity), outboxIds: [outboxId], first: 1 });
      if (result.dispatched !== 1) throw new ObservationStop("EXACT_OUTBOX_NOT_DISPATCHED");
      const jobs = await tenant(identity, tx => tx.durableJob.findMany({ where: { organizationId: identity.organizationId,
        workspaceId: identity.workspaceId, outboxEventId: outboxId, jobType: event.topic }, select: { id: true, version: true, attempts: true }, take: 2 }));
      if (jobs.length !== 1 || jobs[0].attempts !== 0) throw new ObservationStop("EXACT_JOB_MISSING_OR_PREVIOUSLY_ATTEMPTED");
      await options.receipt.append({ event: "DISPATCHED_JOB", ...jobs[0], outboxId });
      return { ...jobs[0], outboxId };
    },
    async claim(identity, job) {
      const jobs = await claimJobs({ ...common(identity), jobIds: [job.id], first: 1, leaseSeconds: target.leaseSeconds,
        jobTypes: [job.outboxId === exactCreated.outboxId ? "math-pilot.codex-local.execute" : "math-pilot.codex-local.review"] });
      if (jobs.length !== 1 || jobs[0].id !== job.id || jobs[0].outboxEventId !== job.outboxId) throw new ObservationStop("EXACT_JOB_CLAIM_FAILED");
      return { id: jobs[0].id, version: jobs[0].version, attempts: jobs[0].attempts, outboxId: job.outboxId };
    },
    async solver(identity, created, job) {
      await executeResearchJob({ ...common(identity), jobId: job.id, expectedVersion: job.version, provider: {
        providerName: provider.providerName, modelName: provider.modelName,
        async execute(input) {
          options.budget.require(510_000); attemptedRoles++;
          await options.receipt.append({ event: "ROLE_STARTED", role: "SOLVER", attemptedRoles });
          const result = await provider.execute(input);
          await options.receipt.append({ event: "ROLE_RETURNED", role: "SOLVER", threadId: result.mathAttempt?.threadId ?? null,
            usage: result.mathAttempt?.usage ?? null });
          options.budget.require(1); return result;
        },
      } });
      const retained = await tenant(identity, tx => tx.durableJob.findFirst({ where: { id: job.id, organizationId: identity.organizationId,
        workspaceId: identity.workspaceId, status: "SUCCEEDED" }, select: { id: true } }));
      if (!retained || created.runId !== exactCreated.runId) throw new ObservationStop("SOLVER_NOT_RETAINED");
    },
    async automaticReview(identity, created) {
      const events = await tenant(identity, tx => tx.outboxEvent.findMany({ where: { organizationId: identity.organizationId,
        workspaceId: identity.workspaceId, commandId: created.commandId, topic: "math-pilot.codex-local.review",
        aggregateType: "MathPilotCase", aggregateId: created.caseId }, select: { id: true }, take: 2 }));
      if (events.length !== 1) throw new ObservationStop("AUTOMATIC_REVIEW_MISSING_OR_AMBIGUOUS");
      return events[0].id;
    },
    async review(identity, _created, job, _signal, beforeRole) {
      await executeMathPilotAgentReviewJob({ ...common(identity), jobId: job.id, expectedVersion: job.version, reviewer: {
        modelName: target.modelName, roleModels: reviewer.roleModels, review: reviewer.review.bind(reviewer),
        async reviewRole(...args) {
          beforeRole(args[0]); attemptedRoles++;
          if (attemptedRoles > 3) throw new ObservationStop("ROLE_COUNT_EXCEEDED");
          await options.receipt.append({ event: "ROLE_STARTED", role: args[0], attemptedRoles });
          const report = await reviewer.reviewRole(...args);
          await options.receipt.append({ event: "ROLE_RETURNED", role: args[0], threadId: report.threadId, usage: report.usage });
          options.budget.require(1); return report;
        },
      } });
    },
    async inspect(identity, created) {
      const cases = await listMathPilotCases(context, target.missionId, { ids: [created.caseId], take: 1, includeJobs: false });
      const item = cases[0];
      if (!item || item.researchRun.id !== created.runId) throw new ObservationStop("RETAINED_CASE_IDENTITY_INVALID");
      const valid = validateRecordedMathAgentReview({ contract: item.contract, contractDigest: item.contractDigest,
        attempt: item.researchRun.mathModelAttempt, attemptDigest: item.researchRun.mathModelAttemptDigest,
        researchDigest: item.researchIntegrityDigest, review: item.agentReview });
      if (item.agentReview && !valid) throw new ObservationStop("RETAINED_REVIEW_INVALID");
      const jobs = await tenant(identity, tx => tx.durableJob.findMany({ where: { organizationId: identity.organizationId,
        workspaceId: identity.workspaceId, OR: [{ outboxEventId: created.outboxId },
          { outboxEvent: { topic: "math-pilot.codex-local.review", aggregateType: "MathPilotCase", aggregateId: created.caseId } }] },
        select: { id: true, jobType: true, status: true, attempts: true, lastErrorCode: true }, take: 3 }));
      const expectedContract = resolveMathPilotContract({ caseType: "LRC_CAMPAIGN", preset: "ALLIKVERE_P83_14_V1" });
      const ledger = item.agentReview?.ledger as Record<string, unknown> | undefined;
      return { attemptedRoles, runStatus: item.researchRun.status, jobs, attemptDigest: item.researchRun.mathModelAttemptDigest,
        caseId: item.id, runId: item.researchRun.id, contractDigest: item.contractDigest,
        contractBindingValid: item.contractDigest === digestMathPilotContract(expectedContract), reviewVersion: ledger?.version ?? null,
        reviewId: item.agentReview?.id ?? null, reviewDigest: item.agentReview?.ledgerDigest ?? null,
        reviewConclusion: item.agentReview?.conclusion ?? null, reviewIntegrityValid: Boolean(valid),
        url: `http://127.0.0.1:3001/w/${target.workspaceSlug}/research/math-pilot?missionId=${target.missionId}&caseId=${created.caseId}` };
    },
    async failOwned(identity, job) {
      await failJob({ ...common(identity), jobId: job.id, expectedVersion: job.version,
        errorCode: "TIP062_OBSERVATION_STOPPED", errorMessage: "Bounded one-shot observation stopped; no retry authorized", retryable: false });
    },
  };
}
