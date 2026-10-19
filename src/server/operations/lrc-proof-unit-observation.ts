/** Prospective TIP-064 one-shot. Existing worker/job executors only; never a shared loop. */
import { LRC_OBSERVATION_TARGET, ObservationStop, type ObservationRuntime, type ObservationReceipt,
  type ObservationBudget, type ObservationIdentity, type ObservationCreated, type ObservationJob } from "./lrc-controlled-observation";
export const LRC_PROOF_UNIT_OBSERVATION_TARGET = Object.freeze({ ...LRC_OBSERVATION_TARGET,
  preset: "ALLIKVERE_P83_PROOF_UNIT_V1", packetDigest: "43debef344eb14197d28e9e20446a7d48ee5bcd33758e3d7c8657e0e8a269062" });
export async function observeLrcProofUnitOnce(options: {
  mode: "preflight" | "run"; runtime: ObservationRuntime; receipt: ObservationReceipt;
  budget: ObservationBudget;
}) {
  const { runtime, receipt, budget } = options;
  let identity: ObservationIdentity | undefined;
  let created: ObservationCreated | undefined;
  let ownedJob: ObservationJob | undefined;
  let creationAttempted = false;
  const stage = async <T>(name: string, reserve: number, work: () => Promise<T>): Promise<T> => {
    budget.require(reserve);
    await receipt.append({ event: "STAGE_STARTED", name, elapsedMs: budget.now() - budget.started });
    const value = await work();
    await receipt.append({ event: "STAGE_FINISHED", name, elapsedMs: budget.now() - budget.started });
    budget.require(1);
    return value;
  };
  const timer = setTimeout(() => budget.controller.abort(), Math.max(1, budget.remaining()));
  try {
    await receipt.append({ event: "BEGIN", mode: options.mode, target: LRC_PROOF_UNIT_OBSERVATION_TARGET,
      usage: "UNAVAILABLE_UNTIL_RETAINED", noRetry: true });
    const ready = await stage("preflight", 30_000, () => runtime.preflight());
    identity = ready.identity;
    await receipt.append({ event: "IDENTITY", ...identity });
    if (!ready.authorized) throw new ObservationStop("ACTOR_OR_TENANT_UNAUTHORIZED");
    if (!ready.capabilities) throw new ObservationStop("LOCAL_CAPABILITY_DISABLED");
    if (!ready.calibrationProof || !ready.calibrationCounterexample) throw new ObservationStop("SEALED_CALIBRATION_MISSING_OR_INVALID");
    if (ready.conflictingActiveCase) throw new ObservationStop("CONFLICTING_ACTIVE_CASE");
    await stage("subscription-login", 250_000, () => runtime.login(budget.controller.signal));
    if (options.mode === "preflight") {
      budget.require(1);
      await receipt.append({ event: "FINAL", status: "READY_READ_ONLY", modelCalls: 0 });
      budget.require(1);
      return { status: "READY_READ_ONLY" as const, identity };
    }
    // Reserve both full login/exec pairs for three roles plus import and retention,
    // before creating a prospective case. No deadline reset after creation.
    budget.require(1_510_000);
    creationAttempted = true;
    await stage("authorized-create", 30_000, async () => { created = await runtime.create(identity!); return created; });
    if (!created) throw new ObservationStop("CREATED_ID_UNAVAILABLE");
    await receipt.append({ event: "CREATED", ...created });
    const solverJob = await stage("solver-exact-dispatch", 30_000, () => runtime.dispatch(identity!, created!.outboxId));
    const claimedSolver = await stage("solver-exact-claim", 30_000, async () => { ownedJob = await runtime.claim(identity!, solverJob); return ownedJob; });
    ownedJob = claimedSolver;
    if (!ownedJob) throw new ObservationStop("SOLVER_CLAIM_ID_UNAVAILABLE");
    if (ownedJob.id !== solverJob.id || ownedJob.outboxId !== created.outboxId || ownedJob.attempts !== 1) throw new ObservationStop("SOLVER_JOB_IDENTITY_OR_ATTEMPT_MISMATCH");
    await receipt.append({ event: "SOLVER_JOB", ...ownedJob });
    await stage("solver-once", 520_000, () => runtime.solver(identity!, created!, ownedJob!, budget.controller.signal));
    ownedJob = undefined;
    const reviewOutbox = await stage("automatic-review-only", 30_000, () => runtime.automaticReview(identity!, created!));
    if (reviewOutbox === created.outboxId) throw new ObservationStop("REVIEW_OUTBOX_COLLISION");
    const reviewJob = await stage("review-exact-dispatch", 30_000, () => runtime.dispatch(identity!, reviewOutbox));
    const claimedReview = await stage("review-exact-claim", 30_000, async () => { ownedJob = await runtime.claim(identity!, reviewJob); return ownedJob; });
    ownedJob = claimedReview;
    if (!ownedJob) throw new ObservationStop("REVIEW_CLAIM_ID_UNAVAILABLE");
    if (ownedJob.id !== reviewJob.id || ownedJob.id === solverJob.id || ownedJob.outboxId !== reviewOutbox || ownedJob.attempts !== 1) throw new ObservationStop("REVIEW_JOB_IDENTITY_OR_ATTEMPT_MISMATCH");
    await receipt.append({ event: "REVIEW_JOB", ...ownedJob });
    let roles = 0;
    await stage("review-once", 990_000, () => runtime.review(identity!, created!, ownedJob!, budget.controller.signal, role => {
      if (role !== (roles === 0 ? "CRITIC" : "ADVERSARY") || roles >= 2) throw new ObservationStop("ROLE_ORDER_OR_COUNT_INVALID");
      budget.require(510_000); roles += 1;
    }));
    if (roles !== 2) throw new ObservationStop("REVIEW_ROLES_INCOMPLETE");
    ownedJob = undefined;
    const outcomes = await stage("retained-outcomes", 30_000, () => runtime.inspect(identity!, created!));
    const jobs = outcomes.jobs as Array<{ id: string; jobType: string; status: string; attempts: number }> | undefined;
    if (outcomes.reviewIntegrityValid !== true || typeof outcomes.reviewId !== "string" || outcomes.reviewVersion !== 6 ||
      outcomes.proofUnitBindingsValid !== true || outcomes.packetDigest !== LRC_PROOF_UNIT_OBSERVATION_TARGET.packetDigest || outcomes.attemptedRoles !== 3 || outcomes.caseId !== created.caseId || outcomes.runId !== created.runId ||
      outcomes.contractBindingValid !== true || !["PARTIAL", "INCONCLUSIVE"].includes(String(outcomes.reviewConclusion)) ||
      !Array.isArray(jobs) || jobs.length !== 2 || !jobs.some(job => job.id === solverJob.id && job.jobType === "math-pilot.codex-local.execute" && job.status === "SUCCEEDED" && job.attempts === 1) ||
      !jobs.some(job => job.id === reviewJob.id && job.jobType === "math-pilot.codex-local.review" && job.status === "SUCCEEDED" && job.attempts === 1)) throw new ObservationStop("RETAINED_V6_REVIEW_MISSING_OR_UNSAFE");
    budget.require(1);
    await receipt.append({ event: "FINAL", status: "COMPLETED_LOCAL_OBSERVATION", ...outcomes });
    budget.require(1);
    return { status: "COMPLETED_LOCAL_OBSERVATION" as const, identity, created, outcomes };
  } catch (error) {
    budget.controller.abort();
    if (identity && ownedJob) await runtime.failOwned(identity, ownedJob).catch(() => undefined);
    // Sanitized receipt only: exception messages may contain DB/provider secrets.
    const code = error instanceof ObservationStop ? error.code : "BOUNDED_OPERATION_FAILED";
    const knownIds = error instanceof ObservationStop ? error.knownIds : undefined;
    let outcomes: Record<string, unknown> = { usage: "UNAVAILABLE" };
    if (identity && created && budget.remaining() > 30_000) outcomes = await runtime.inspect(identity, created).catch(() => outcomes);
    await receipt.append({ event: "FINAL", status: creationAttempted ? "PARTIAL_OR_FAILED" : "NOT_RUN", code,
      elapsedMs: budget.now() - budget.started, ...(knownIds ?? {}), ...(created ?? {}), ownedJob: ownedJob ?? null, ...outcomes });
    return { status: creationAttempted ? "PARTIAL_OR_FAILED" as const : "NOT_RUN" as const, code };
  } finally { clearTimeout(timer); }
}

