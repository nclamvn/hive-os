/** TIP-062 orchestration. No imports with DB/provider side effects; offline seams are mandatory. */
export const LRC_OBSERVATION_TARGET = Object.freeze({
  workspaceSlug: "mathematics-pilot-lab-156de0",
  missionId: "31943653-4a30-462a-af11-ecd99f9ebfa2",
  preset: "ALLIKVERE_P83_14_V1", providerName: "codex-local", modelName: "gpt-6-sol",
  outerBudgetMs: 1_800_000, childBudgetMs: 240_000, streamBytes: 1_048_576,
  importBudgetMs: 10_000, leaseSeconds: 1_800,
});

export class ObservationStop extends Error {
  constructor(readonly code: string, readonly knownIds?: Partial<ObservationCreated>) { super(code); }
}
/** Pure guard: must run before loading runtime/auth/DB modules. */
export function assertObservationLocalEnvironment(env: NodeJS.ProcessEnv) {
  if (!["development", "test"].includes(env.NODE_ENV ?? "") ||
    (env.DEPLOYMENT_ENV && !["development", "test"].includes(env.DEPLOYMENT_ENV))) throw new ObservationStop("LOCAL_ENVIRONMENT_REQUIRED");
  let database: URL;
  try { database = new URL(env.DATABASE_URL ?? ""); } catch { throw new ObservationStop("LOCAL_DATABASE_REQUIRED"); }
  if (!["postgres:", "postgresql:"].includes(database.protocol) ||
    !["localhost", "127.0.0.1", "[::1]"].includes(database.hostname) ||
    !["/hiveos_dev", "/hiveos_test"].includes(database.pathname)) throw new ObservationStop("LOCAL_DATABASE_REQUIRED");
  // pg-connection-string copies arbitrary URL query entries into connection
  // config before its hostname fallback. Never admit host/service/port/SSL-file
  // or other overrides through an apparently local URL. Only Prisma's ordinary
  // schema=public annotation is permitted; duplicate/unknown fields refuse.
  const parameters = [...database.searchParams.entries()];
  if (parameters.length > 1 || parameters.some(([key, value]) => key !== "schema" || value !== "public")) {
    throw new ObservationStop("DATABASE_CONNECTION_OVERRIDE_FORBIDDEN");
  }
  if (env.RESEARCH_WORKER_ENABLED === "true" || env.RESEARCH_OPENAI_ENABLED === "true" ||
    env.SANDBOX_DOCKER_ENABLED === "true" ||
    (env.MATH_REVIEW_ADVERSARY_MODEL && env.MATH_REVIEW_ADVERSARY_MODEL !== LRC_OBSERVATION_TARGET.modelName)) throw new ObservationStop("UNSAFE_SHARED_CAPABILITY_OR_MODEL");
}
export interface ObservationIdentity {
  organizationId: string; workspaceId: string; actorUserId: string; membershipId: string;
}
export interface ObservationPrerequisites {
  identity: ObservationIdentity; authorized: boolean; capabilities: boolean;
  calibrationProof: boolean; calibrationCounterexample: boolean; conflictingActiveCase: boolean;
}
export interface ObservationCreated { commandId: string; caseId: string; runId: string; outboxId: string }
export interface ObservationJob { id: string; version: number; attempts: number; outboxId: string }
export interface ObservationRuntime {
  preflight(): Promise<ObservationPrerequisites>;
  login(signal: AbortSignal): Promise<void>;
  create(identity: ObservationIdentity): Promise<ObservationCreated>;
  dispatch(identity: ObservationIdentity, outboxId: string): Promise<ObservationJob>;
  claim(identity: ObservationIdentity, job: ObservationJob): Promise<ObservationJob>;
  solver(identity: ObservationIdentity, created: ObservationCreated, job: ObservationJob, signal: AbortSignal): Promise<void>;
  automaticReview(identity: ObservationIdentity, created: ObservationCreated): Promise<string>;
  review(identity: ObservationIdentity, created: ObservationCreated, job: ObservationJob, signal: AbortSignal,
    beforeRole: (role: "CRITIC" | "ADVERSARY") => void): Promise<void>;
  inspect(identity: ObservationIdentity, created: ObservationCreated): Promise<Record<string, unknown>>;
  failOwned(identity: ObservationIdentity, job: ObservationJob): Promise<void>;
}
export interface ObservationReceipt {
  append(record: Record<string, unknown>): Promise<void>;
}

/** Complete one UTF-8 journal record on a serial handle before syncing it.
 * Partial write failure remains visible/uncertain; never replay an invocation. */
export async function writeCompleteObservationReceipt(text: string, io: {
  write: (buffer: Buffer, offset: number, length: number) => Promise<{ bytesWritten: number }>;
  sync: () => Promise<void>;
}) {
  const buffer = Buffer.from(text, "utf8");
  let offset = 0;
  while (offset < buffer.byteLength) {
    const remaining = buffer.byteLength - offset;
    const { bytesWritten } = await io.write(buffer, offset, remaining);
    if (!Number.isInteger(bytesWritten) || bytesWritten <= 0 || bytesWritten > remaining) {
      throw new ObservationStop("RECEIPT_WRITE_NO_PROGRESS_OR_INVALID_COUNT");
    }
    offset += bytesWritten;
  }
  await io.sync();
}

/** One original monotonic clock; caller starts it before dynamic runtime imports. */
export class ObservationBudget {
  readonly controller = new AbortController();
  constructor(readonly started: number, readonly now: () => number = () => performance.now()) {}
  remaining() { return LRC_OBSERVATION_TARGET.outerBudgetMs - (this.now() - this.started); }
  require(milliseconds: number) {
    if (this.controller.signal.aborted || this.remaining() < milliseconds) {
      this.controller.abort(); throw new ObservationStop("ORIGINAL_BUDGET_INSUFFICIENT");
    }
  }
}

export async function observeLrcOnce(options: {
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
    await receipt.append({ event: "BEGIN", mode: options.mode, target: LRC_OBSERVATION_TARGET,
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
    if (outcomes.reviewIntegrityValid !== true || typeof outcomes.reviewId !== "string" || outcomes.reviewVersion !== 5 ||
      outcomes.attemptedRoles !== 3 || outcomes.caseId !== created.caseId || outcomes.runId !== created.runId ||
      outcomes.contractBindingValid !== true || !["PARTIAL", "INCONCLUSIVE"].includes(String(outcomes.reviewConclusion)) ||
      !Array.isArray(jobs) || jobs.length !== 2 || !jobs.some(job => job.id === solverJob.id && job.jobType === "math-pilot.codex-local.execute" && job.status === "SUCCEEDED" && job.attempts === 1) ||
      !jobs.some(job => job.id === reviewJob.id && job.jobType === "math-pilot.codex-local.review" && job.status === "SUCCEEDED" && job.attempts === 1)) throw new ObservationStop("RETAINED_V5_REVIEW_MISSING_OR_UNSAFE");
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
