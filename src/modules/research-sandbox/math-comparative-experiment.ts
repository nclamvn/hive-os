import { performance } from "node:perf_hooks";

import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { sha256 } from "./integrity";
import { digestMathPilotContract, mathPilotContractSchema, MATH_PILOT_CALIBRATIONS } from "./math-pilot";

const digest = z.string().regex(/^[a-f0-9]{64}$/);
const id = z.string().regex(/^[A-Za-z0-9_-]{1,80}$/);
const boundedInteger = z.number().int().min(0).max(1_000_000_000);
export const comparativeLaneSchema = z.enum(["SINGLE_LLM", "TOOL_FIRST", "ADAPTIVE"]);
export type ComparativeLane = z.infer<typeof comparativeLaneSchema>;
export const COMPARATIVE_LANES = ["SINGLE_LLM", "TOOL_FIRST", "ADAPTIVE"] as const;

const tokenCount = z.number().int().min(0).max(100_000_000);
const usageSchema = z.object({ inputTokens: tokenCount, outputTokens: tokenCount,
  cachedInputTokens: tokenCount, reasoningOutputTokens: tokenCount }).strict().superRefine((v, c) => {
  if (v.cachedInputTokens > v.inputTokens || v.reasoningOutputTokens > v.outputTokens)
    c.addIssue({ code: "custom", message: "Cached/reasoning usage must be subsets" });
});
export type ComparativeUsage = z.infer<typeof usageSchema>;
const envelopeSchema = z.object({ maxObservedTokens: z.number().int().min(1).max(200_000),
  maxWallMs: z.number().int().min(1).max(60_000), maxOperationMs: z.number().int().min(1).max(60_000),
  maxModelCalls: z.number().int().min(1).max(32), maxToolCalls: z.number().int().min(0).max(32),
  maxOutputBytes: z.number().int().min(64).max(65_536) }).strict();
const snapshotSchema = z.object({ id, content: z.string().min(1).max(32_768), contentDigest: digest }).strict();
const toolSchema = z.object({ id: z.literal("PARITY_WITNESS"), version: z.literal(1), sourceDigest: digest }).strict();
const settingsSchema = z.object({ requestedProvider: z.literal("OFFLINE_FIXTURE"),
  requestedModel: z.literal("FIXED_RESPONSE_V1"), sampling: z.literal("DETERMINISTIC_FIXTURE"),
  executorAuthority: z.literal("TRUSTED_TEST_SEAM_NOT_MODEL_ATTESTATION") }).strict();
const caseSchema = z.object({ id, contract: mathPilotContractSchema, contractDigest: digest,
  exposure: z.literal("PUBLIC_DEVELOPMENT"), referenceDigest: digest }).strict();
const planBodySchema = z.object({ version: z.literal(1), mode: z.literal("OFFLINE_FIXTURE"),
  suiteId: id, cases: z.array(caseSchema).min(1).max(8), sources: z.array(snapshotSchema).max(8),
  tools: z.array(toolSchema).max(1), settings: settingsSchema, envelope: envelopeSchema,
  repetitions: z.number().int().min(1).max(3),
  ordering: z.literal("REPETITION_CASE_THEN_SEALED_LANE_ORDER"),
  laneOrder: z.tuple([comparativeLaneSchema, comparativeLaneSchema, comparativeLaneSchema]),
  lanes: z.array(z.object({ lane: comparativeLaneSchema, inputsDigest: digest,
    sourcesDigest: digest, toolsDigest: digest, settingsDigest: digest, envelopeDigest: digest }).strict()).length(3),
  stopRules: z.literal("STOP_ON_UNKNOWN_ACCOUNTING_OR_THRESHOLD_OR_DEADLINE_NO_RETRY"),
  exposureWarning: z.literal("PUBLIC_FIXED_CONTROLS_NOT_HELD_OUT_OR_UNCONTAMINATED"),
}).strict();
export const comparativePlanSchema = planBodySchema.extend({ planDigest: digest }).strict();
export type ComparativePlan = z.infer<typeof comparativePlanSchema>;
const hash = (v: unknown) => sha256(canonicalJson(v));
export function comparativePlanBody(v: ComparativePlan) {
  const { planDigest, lanes, ...body } = v; void planDigest; void lanes; return body;
}
const withoutDigest = <T extends { planDigest: string }>(v: T) => {
  const { planDigest, ...body } = v; void planDigest; return body;
};

export function verifyComparativePlan(raw: unknown): raw is ComparativePlan {
  const parsed = comparativePlanSchema.safeParse(raw);
  if (!parsed.success) return false;
  const p = parsed.data;
  if (hash(withoutDigest(p)) !== p.planDigest || new Set(p.cases.map(c => c.id)).size !== p.cases.length ||
    new Set(p.sources.map(s => s.id)).size !== p.sources.length ||
    new Set(p.laneOrder).size !== 3 || new Set(p.lanes.map(l => l.lane)).size !== 3 ||
    p.envelope.maxOperationMs > p.envelope.maxWallMs ||
    p.cases.some(c => digestMathPilotContract(c.contract) !== c.contractDigest) ||
    p.sources.some(s => sha256(s.content) !== s.contentDigest) ||
    p.tools.some(t => t.sourceDigest !== sha256(FIXTURE_TOOL_SOURCE))) return false;
  const bindings = { inputsDigest: hash(p.cases), sourcesDigest: hash(p.sources), toolsDigest: hash(p.tools),
    settingsDigest: hash(p.settings), envelopeDigest: hash(p.envelope) };
  return p.lanes.every((l, i) => l.lane === p.laneOrder[i] &&
    Object.entries(bindings).every(([key, value]) => l[key as keyof typeof l] === value));
}

export function sealComparativePlan(input: Omit<z.infer<typeof planBodySchema>, "lanes">): ComparativePlan {
  const bindings = { inputsDigest: hash(input.cases), sourcesDigest: hash(input.sources), toolsDigest: hash(input.tools),
    settingsDigest: hash(input.settings), envelopeDigest: hash(input.envelope) };
  const body = planBodySchema.parse({ ...input, lanes: input.laneOrder.map(lane => ({ lane, ...bindings })) });
  const p = comparativePlanSchema.parse({ ...body, planDigest: hash(body) });
  if (!verifyComparativePlan(p)) throw new Error("Invalid comparative plan binding");
  return p;
}

export function comparativeSolverProjection(plan: ComparativePlan, caseId: string) {
  if (!verifyComparativePlan(plan)) throw new Error("Invalid sealed plan");
  const c = plan.cases.find(c => c.id === caseId);
  if (!c) throw new Error("Unknown sealed case");
  return structuredClone({ contract: c.contract, contractDigest: c.contractDigest, sources: plan.sources, tools: plan.tools,
    settings: plan.settings, envelope: plan.envelope, exposure: c.exposure,
    exposureWarning: plan.exposureWarning });
}

export function comparativeReviewerProjection(plan: ComparativePlan, caseId: string, attempt: string) {
  const solver = comparativeSolverProjection(plan, caseId);
  if (!attempt.trim() || Buffer.byteLength(attempt) > plan.envelope.maxOutputBytes) throw new Error("Invalid attempt");
  return { contract: solver.contract, contractDigest: solver.contractDigest, attempt,
    attemptDigest: hash({ contractDigest: solver.contractDigest, attempt }), exposure: solver.exposure,
    blinding: "LANE_POLICY_SESSION_USAGE_FIELDS_REMOVED_PROSE_MAY_REVEAL_METHOD" as const };
}

const decisionSchema = z.enum(["ACCEPT", "REJECT", "ABSTAIN"]);
const referenceSchema = z.object({ caseId: id, meaning: z.literal("FIXTURE_RESPONSE_LABEL_NOT_MATHEMATICAL_ORACLE"),
  expectedDecision: decisionSchema, rubric: z.string().min(1).max(2_000) }).strict();
export type ComparativeReference = z.infer<typeof referenceSchema>;
export function comparativeReferenceDigest(reference: ComparativeReference): string { return hash(referenceSchema.parse(reference)); }
export function scoreComparativeFixture(reference: ComparativeReference, decision: z.infer<typeof decisionSchema>) {
  referenceSchema.parse(reference); decisionSchema.parse(decision);
  return { decision, expectedDecision: reference.expectedDecision,
    falseAccept: reference.expectedDecision === "REJECT" && decision === "ACCEPT",
    falseReject: reference.expectedDecision === "ACCEPT" && decision === "REJECT",
    abstention: decision === "ABSTAIN", labelAgreement: decision === reference.expectedDecision,
    authority: "FIXTURE_LABEL_FIDELITY_ONLY_NOT_MODEL_ACCURACY" as const,
    informalProofValidity: "NOT_ASSESSED" as const, formalKernel: "NOT_RUN" as const,
    semanticAlignment: "NOT_ATTESTED" as const, rootContribution: "NOT_ESTABLISHED" as const,
    novelty: "NOT_ESTABLISHED" as const };
}

const operationSchema = z.object({ callId: id, kind: z.enum(["MODEL", "TOOL"]),
  role: z.enum(["PLAN", "SOURCE", "SOLVE", "REVIEW", "VERIFY"]), requestDigest: digest,
  toolId: z.literal("PARITY_WITNESS").nullable(), startedMs: z.number().finite().nonnegative(),
  finishedMs: z.number().finite().nonnegative(), elapsedMs: z.number().finite().nonnegative(),
  state: z.enum(["SUCCEEDED", "FAILED", "CANCELLED", "AMBIGUOUS", "OUTPUT_LIMIT", "INVALID_RECEIPT"]),
  usageState: z.enum(["KNOWN", "UNKNOWN", "NOT_APPLICABLE"]), usage: usageSchema.nullable(),
  tokenProvenance: z.enum(["SIMULATED", "UNKNOWN", "NOT_APPLICABLE"]),
  sessionId: id.nullable(), output: z.string().max(65_536).nullable(), outputDigest: digest.nullable(),
  observedOutputBytes: boundedInteger, cancelRequested: z.boolean(), executorSettled: z.boolean(),
  reason: z.string().min(1).max(120) }).strict();
type OperationRecord = z.infer<typeof operationSchema>;
const startSchema = z.object({ phase: z.literal("PENDING"), callId: id, kind: z.enum(["MODEL", "TOOL"]),
  role: operationSchema.shape.role, requestDigest: digest, toolId: z.literal("PARITY_WITNESS").nullable(),
  startedMs: z.number().finite().nonnegative() }).strict();
const finishSchema = z.object({ phase: z.literal("SETTLED"), record: operationSchema }).strict();
const eventSchema = z.discriminatedUnion("phase", [startSchema, finishSchema]);
type OperationEvent = z.infer<typeof eventSchema>;
const laneRunSchema = z.object({ lane: comparativeLaneSchema, caseId: id,
  repetition: z.number().int().min(1).max(3), planDigest: digest,
  state: z.enum(["COMPLETE", "STOPPED", "AMBIGUOUS", "NOT_RUN"]),
  reason: z.string().min(1).max(120), elapsedMs: z.number().finite().nonnegative(),
  events: z.array(eventSchema).max(128), observedTokens: boundedInteger,
  modelCalls: boundedInteger, toolCalls: boundedInteger, thresholdOvershoot: boundedInteger,
  accounting: z.enum(["COMPLETE_SIMULATED", "INCOMPLETE", "NOT_RUN"]),
  attempt: z.string().max(65_536).nullable(), attemptDigest: digest.nullable(),
  decision: decisionSchema, score: z.unknown().nullable() }).strict();
type LaneRun = z.infer<typeof laneRunSchema>;
export const comparativeResultSchema = z.object({ version: z.literal(1), mode: z.literal("OFFLINE_FIXTURE"),
  plan: comparativePlanSchema, references: z.array(referenceSchema).min(1).max(8),
  runs: z.array(laneRunSchema).min(3).max(72),
  executionProvenance: z.literal("TRUSTED_TEST_SEAM_NOT_LIVE_ATTESTATION"),
  tokenProvenance: z.literal("SIMULATED"), wallTimeProvenance: z.literal("OBSERVED_MONOTONIC_FRAMEWORK_TIME"),
  accounting: z.enum(["COMPLETE_SIMULATED", "INCOMPLETE"]),
  comparison: z.enum(["FIXTURE_WORKFLOW_ONLY", "INCOMPLETE"]),
  scientificYield: z.literal("NOT_MEASURED"), resultDigest: digest }).strict();
export type ComparativeResult = z.infer<typeof comparativeResultSchema>;

type Request = { kind: "MODEL" | "TOOL"; role: OperationRecord["role"]; input: unknown;
  toolId: "PARITY_WITNESS" | null; callId: string; signal: AbortSignal };
export type ComparativeExecutor = (request: Request) => Promise<unknown>;
const modelReceiptSchema = z.object({ sessionId: id, usage: usageSchema, body: z.string() }).strict();
const toolReceiptSchema = z.object({ body: z.string() }).strict();
export class ComparativeOperationFailure extends Error {
  constructor(public readonly usage: ComparativeUsage | null = null) { super("Executor failed"); }
}
class BrokerStop extends Error {}

/** Trusted in-process test seam only. It does not authenticate a model or enforce isolation. */
export class ComparativeBudgetBroker {
  readonly events: OperationEvent[] = [];
  readonly startedAt = performance.now();
  observedTokens = 0;
  modelCalls = 0;
  toolCalls = 0;
  stopReason: string | null = null;
  ambiguous = false;
  unknownUsage = false;
  private active = false;
  private sessions: Set<string>;
  private closed = false;
  private inFlight = new Set<Promise<unknown>>();
  private interruptActive: (() => void) | null = null;
  constructor(private readonly plan: ComparativePlan, private readonly executor: ComparativeExecutor,
    private readonly externalSignal?: AbortSignal, private readonly contextPrefix = "run", sessions?: Set<string>) {
    if (!verifyComparativePlan(plan)) throw new Error("Invalid plan");
    this.sessions = sessions ?? new Set<string>();
  }
  elapsed() { return Math.max(0, performance.now() - this.startedAt); }
  async close() {
    this.closed = true;
    this.interruptActive?.();
    await Promise.all([...this.inFlight]);
  }
  private boundary(kind: Request["kind"]) {
    const e = this.plan.envelope;
    if (this.closed || this.stopReason) throw new BrokerStop(this.stopReason ?? "BROKER_CLOSED");
    if (this.active) { this.stopReason = "CONCURRENT_OPERATION_REJECTED"; throw new BrokerStop(this.stopReason); }
    if (this.externalSignal?.aborted) this.stopReason = "EXTERNAL_CANCEL";
    else if (this.elapsed() >= e.maxWallMs) this.stopReason = "WALL_LIMIT";
    else if (this.observedTokens >= e.maxObservedTokens) this.stopReason = "TOKEN_THRESHOLD";
    else if (kind === "MODEL" && this.modelCalls >= e.maxModelCalls) this.stopReason = "MODEL_CALL_LIMIT";
    else if (kind === "TOOL" && this.toolCalls >= e.maxToolCalls) this.stopReason = "TOOL_CALL_LIMIT";
    if (this.stopReason) throw new BrokerStop(this.stopReason);
  }
  private track(operation: Promise<string>) {
    const tracked = operation.catch(() => undefined);
    this.inFlight.add(tracked);
    void tracked.then(() => this.inFlight.delete(tracked));
    return operation;
  }
  model(role: Request["role"], input: unknown) { return this.track(this.perform("MODEL", role, input, null)); }
  tool(input: unknown) { return this.track(this.perform("TOOL", "VERIFY", input, "PARITY_WITNESS")); }
  private async perform(kind: Request["kind"], role: Request["role"], input: unknown,
    toolId: Request["toolId"]): Promise<string> {
    this.boundary(kind);
    if (toolId && !this.plan.tools.some(t => t.id === toolId)) {
      this.stopReason = "TOOL_NOT_ADMITTED"; throw new BrokerStop(this.stopReason);
    }
    const requestText = canonicalJson(input);
    if (Buffer.byteLength(requestText) > 131_072) { this.stopReason = "INPUT_LIMIT"; throw new BrokerStop(this.stopReason); }
    this.active = true;
    if (kind === "MODEL") this.modelCalls++; else this.toolCalls++;
    const callId = `call-${hash({ context: this.contextPrefix, ordinal: this.modelCalls + this.toolCalls })}`;
    const startedMs = this.elapsed();
    const pending = { phase: "PENDING" as const, callId, kind, role, requestDigest: sha256(requestText), toolId, startedMs };
    this.events.push(pending); // Must precede executor invocation, including synchronous failure.
    const controller = new AbortController();
    let executorSettled = false;
    let result: unknown;
    let failure: unknown;
    let interrupted = false;
    let interruptReason = "OPERATION_TIMEOUT";
    let trigger: (() => void) | undefined;
    const interrupt = () => { interrupted = true; controller.abort(); trigger?.(); };
    this.interruptActive = interrupt;
    const externalCancel = () => { interruptReason = "EXTERNAL_CANCEL"; interrupt(); };
    this.externalSignal?.addEventListener("abort", externalCancel, { once: true });
    const remaining = this.plan.envelope.maxWallMs - this.elapsed();
    const timeout = Math.min(this.plan.envelope.maxOperationMs, remaining);
    const timer = setTimeout(interrupt, Math.max(0, timeout));
    const work = Promise.resolve().then(() => this.executor({ kind, role, input, toolId, callId, signal: controller.signal }))
      .then(value => { executorSettled = true; result = value; }, error => { executorSettled = true; failure = error; });
    const interruption = new Promise<void>(resolve => { trigger = resolve; });
    await Promise.race([work, interruption]);
    if (interrupted && !executorSettled) {
      // Bounded cancellation acknowledgement. An unacknowledged executor remains ambiguous, never cleanly stopped.
      await Promise.race([work, new Promise<void>(resolve => setTimeout(resolve, 20))]);
    }
    clearTimeout(timer);
    this.externalSignal?.removeEventListener("abort", externalCancel);
    const finishedMs = this.elapsed();
    this.active = false;
    this.interruptActive = null;
    let state: OperationRecord["state"] = "SUCCEEDED";
    let reason = "RESULT_RETAINED";
    let usage: ComparativeUsage | null = null;
    let sessionId: string | null = null;
    let output: string | null = null;
    let observedOutputBytes = 0;
    const receipt = kind === "MODEL" ? modelReceiptSchema.safeParse(result) : toolReceiptSchema.safeParse(result);
    if (kind === "MODEL") {
      const modelReceipt = modelReceiptSchema.safeParse(result);
      if (modelReceipt.success) { usage = modelReceipt.data.usage; sessionId = modelReceipt.data.sessionId; }
      else if (failure instanceof ComparativeOperationFailure && failure.usage) {
        const parsedUsage = usageSchema.safeParse(failure.usage);
        if (parsedUsage.success) usage = parsedUsage.data;
      }
      if (usage) this.observedTokens += usage.inputTokens + usage.outputTokens;
      else this.unknownUsage = true;
    }
    if (interrupted) {
      state = executorSettled ? "CANCELLED" : "AMBIGUOUS"; reason = interruptReason;
      this.ambiguous ||= !executorSettled;
    } else if (finishedMs - startedMs >= timeout) {
      state = "FAILED"; reason = "OPERATION_DEADLINE_EXCEEDED";
    } else if (failure) { state = "FAILED"; reason = "EXECUTOR_FAILED"; }
    else if (!receipt.success) { state = "INVALID_RECEIPT"; reason = "RECEIPT_INVALID"; }
    else {
      output = receipt.data.body; observedOutputBytes = Buffer.byteLength(output);
      if (observedOutputBytes > this.plan.envelope.maxOutputBytes) {
        state = "OUTPUT_LIMIT"; reason = "OUTPUT_LIMIT"; output = null;
      } else if (sessionId && this.sessions.has(sessionId)) {
        state = "INVALID_RECEIPT"; reason = "REPEATED_SESSION"; output = null;
      }
    }
    if (sessionId) this.sessions.add(sessionId);
    const record: OperationRecord = { callId, kind, role, requestDigest: pending.requestDigest, toolId,
      startedMs, finishedMs, elapsedMs: finishedMs - startedMs, state, reason,
      usageState: kind === "TOOL" ? "NOT_APPLICABLE" : usage ? "KNOWN" : "UNKNOWN", usage,
      tokenProvenance: kind === "TOOL" ? "NOT_APPLICABLE" : usage ? "SIMULATED" : "UNKNOWN",
      sessionId, output, outputDigest: output === null ? null : sha256(output), observedOutputBytes,
      cancelRequested: interrupted, executorSettled };
    this.events.push({ phase: "SETTLED", record });
    if (state !== "SUCCEEDED") this.stopReason = reason;
    else if (this.observedTokens >= this.plan.envelope.maxObservedTokens) this.stopReason = "TOKEN_THRESHOLD";
    else if (this.elapsed() >= this.plan.envelope.maxWallMs) this.stopReason = "WALL_LIMIT";
    if (state !== "SUCCEEDED") throw new BrokerStop(reason);
    return output!;
  }
}

export type ComparativeLaneDriver = (input: {
  solver: ReturnType<typeof comparativeSolverProjection>; broker: ComparativeBudgetBroker;
  reviewer: (attempt: string) => ReturnType<typeof comparativeReviewerProjection>;
}) => Promise<{ attempt: string; decision: z.infer<typeof decisionSchema> }>;

function expectedOrder(plan: ComparativePlan) {
  const order: { lane: ComparativeLane; caseId: string; repetition: number }[] = [];
  for (let repetition = 1; repetition <= plan.repetitions; repetition++)
    for (const c of plan.cases) for (const lane of plan.laneOrder) order.push({ lane, caseId: c.id, repetition });
  return order;
}

export async function runComparativeExperiment(input: { plan: ComparativePlan; references: ComparativeReference[];
  drivers: Record<ComparativeLane, ComparativeLaneDriver>; executor: ComparativeExecutor; signal?: AbortSignal }): Promise<ComparativeResult> {
  const plan = structuredClone(input.plan);
  const references = structuredClone(input.references);
  if (!verifyComparativePlan(plan) || !validReferences(plan, references)) throw new Error("Unsealed/mismatched comparative inputs");
  const runs: LaneRun[] = [];
  const sessions = new Set<string>();
  let unsafeExecutor = false;
  for (const item of expectedOrder(plan)) {
    const base = { ...item, planDigest: plan.planDigest, events: [], observedTokens: 0, modelCalls: 0, toolCalls: 0,
      thresholdOvershoot: 0, attempt: null, attemptDigest: null, decision: "ABSTAIN" as const, score: null };
    if (unsafeExecutor || input.signal?.aborted) {
      runs.push({ ...base, state: "NOT_RUN", reason: unsafeExecutor ? "PRIOR_EXECUTOR_UNSETTLED" : "EXTERNAL_CANCEL",
        elapsedMs: 0, accounting: "NOT_RUN" }); continue;
    }
    const broker = new ComparativeBudgetBroker(plan, input.executor, input.signal,
      `${item.repetition}-${item.caseId}-${item.lane}`, sessions);
    let output: Awaited<ReturnType<ComparativeLaneDriver>> | null = null;
    let driverSettled = false;
    let driverError = false;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    const driver = Promise.resolve().then(() => input.drivers[item.lane]({
      solver: comparativeSolverProjection(plan, item.caseId), broker,
      reviewer: attempt => comparativeReviewerProjection(plan, item.caseId, attempt),
    })).then(value => { driverSettled = true; output = value; }, () => { driverSettled = true; driverError = true; });
    await Promise.race([driver, new Promise<void>(resolve => {
      timeoutHandle = setTimeout(resolve, plan.envelope.maxWallMs + 25);
    })]);
    if (timeoutHandle) clearTimeout(timeoutHandle);
    await broker.close();
    if (!driverSettled) { broker.ambiguous = true; broker.stopReason = "DRIVER_UNSETTLED"; }
    const attempted = output as { attempt: string; decision: z.infer<typeof decisionSchema> } | null;
    const validOutput = z.object({ attempt: z.string().trim().min(1).max(65_536), decision: decisionSchema }).strict().safeParse(attempted);
    const elapsedMs = broker.elapsed();
    if (elapsedMs >= plan.envelope.maxWallMs && !broker.stopReason) broker.stopReason = "WALL_LIMIT";
    if (validOutput.success && Buffer.byteLength(validOutput.data.attempt) > plan.envelope.maxOutputBytes) broker.stopReason = "OUTPUT_LIMIT";
    if (validOutput.success && !broker.stopReason && !completeOperations(plan, item, broker.events,
      validOutput.data.attempt, validOutput.data.decision)) broker.stopReason = "REQUIRED_OPERATION_BINDING_MISSING";
    const complete = validOutput.success && !driverError && !broker.stopReason && !broker.unknownUsage;
    unsafeExecutor ||= broker.ambiguous;
    const attempt = validOutput.success && !broker.ambiguous && Buffer.byteLength(validOutput.data.attempt) <= plan.envelope.maxOutputBytes
      ? validOutput.data.attempt : null;
    const decision = complete ? validOutput.data.decision : "ABSTAIN";
    runs.push({ ...item, planDigest: plan.planDigest, state: broker.ambiguous ? "AMBIGUOUS" : complete ? "COMPLETE" : "STOPPED",
      reason: broker.stopReason ?? (driverError ? "DRIVER_FAILED" : validOutput.success ? "COMPLETE" : "DRIVER_OUTPUT_INVALID"),
      elapsedMs, events: structuredClone(broker.events), observedTokens: broker.observedTokens,
      modelCalls: broker.modelCalls, toolCalls: broker.toolCalls,
      thresholdOvershoot: Math.max(0, broker.observedTokens - plan.envelope.maxObservedTokens),
      accounting: broker.unknownUsage || broker.ambiguous ? "INCOMPLETE" : "COMPLETE_SIMULATED",
      attempt, attemptDigest: attempt === null ? null : comparativeReviewerProjection(plan, item.caseId, attempt).attemptDigest,
      decision, score: complete ? scoreComparativeFixture(references.find(r => r.caseId === item.caseId)!, decision) : null });
  }
  const complete = runs.every(r => r.state === "COMPLETE" && r.accounting === "COMPLETE_SIMULATED");
  const body = { version: 1 as const, mode: "OFFLINE_FIXTURE" as const, plan, references, runs,
    executionProvenance: "TRUSTED_TEST_SEAM_NOT_LIVE_ATTESTATION" as const, tokenProvenance: "SIMULATED" as const,
    wallTimeProvenance: "OBSERVED_MONOTONIC_FRAMEWORK_TIME" as const,
    accounting: complete ? "COMPLETE_SIMULATED" as const : "INCOMPLETE" as const,
    comparison: complete ? "FIXTURE_WORKFLOW_ONLY" as const : "INCOMPLETE" as const,
    scientificYield: "NOT_MEASURED" as const };
  const result = comparativeResultSchema.parse({ ...body, resultDigest: hash(body) });
  if (!verifyComparativeResult(result)) throw new Error("Runner produced invalid retained comparison");
  return result;
}

function validReferences(plan: ComparativePlan, references: ComparativeReference[]) {
  return references.length === plan.cases.length && references.every((r, i) => referenceSchema.safeParse(r).success &&
    r.caseId === plan.cases[i].id && comparativeReferenceDigest(r) === plan.cases[i].referenceDigest);
}

function completeOperations(plan: ComparativePlan, item: { lane: ComparativeLane; caseId: string },
  events: OperationEvent[], attempt: string, decision: z.infer<typeof decisionSchema>) {
  const records = events.flatMap(e => e.phase === "SETTLED" ? [e.record] : []);
  const firstSolve = records.find(c => c.kind === "MODEL" && c.role === "SOLVE");
  const solve = records.filter(c => c.kind === "MODEL" && c.role === "SOLVE").at(-1);
  const review = records.filter(c => c.kind === "MODEL" && c.role === "REVIEW").at(-1);
  const planner = records.find(c => c.kind === "MODEL" && c.role === "PLAN" && c.state === "SUCCEEDED");
  const firstTool = records.find(c => c.kind === "TOOL");
  return Boolean(solve && review && solve.state === "SUCCEEDED" && review.state === "SUCCEEDED" &&
    solve.output === attempt && review.output === decision && review.startedMs >= solve.finishedMs &&
    solve.requestDigest === hash(comparativeSolverProjection(plan, item.caseId)) &&
    review.requestDigest === hash(comparativeReviewerProjection(plan, item.caseId, attempt)) &&
    (item.lane !== "TOOL_FIRST" || firstSolve && records.some(c => c.kind === "TOOL" &&
      c.role === "VERIFY" && c.state === "SUCCEEDED" && c.finishedMs <= firstSolve.startedMs)) &&
    (item.lane !== "ADAPTIVE" || firstSolve && planner && planner.finishedMs <= firstSolve.startedMs &&
      (!firstTool || planner.finishedMs <= firstTool.startedMs) &&
      planner.requestDigest === hash(comparativeSolverProjection(plan, item.caseId))));
}

/** Integrity, not receipt authenticity. Imported JSON remains UNATTESTED even when this passes. */
export function verifyComparativeResult(raw: unknown): raw is ComparativeResult {
  const parsed = comparativeResultSchema.safeParse(raw);
  if (!parsed.success) return false;
  const r = parsed.data;
  const { resultDigest, ...body } = r;
  if (hash(body) !== resultDigest || !verifyComparativePlan(r.plan) || !validReferences(r.plan, r.references)) return false;
  const order = expectedOrder(r.plan);
  if (order.length !== r.runs.length) return false;
  const allSessions = new Set<string>();
  const allCalls = new Set<string>();
  let priorUnsettled = false;
  for (let i = 0; i < order.length; i++) {
    const run = r.runs[i], expected = order[i], e = r.plan.envelope;
    if (run.lane !== expected.lane || run.caseId !== expected.caseId || run.repetition !== expected.repetition ||
      run.planDigest !== r.plan.planDigest || run.events.length % 2 ||
      (priorUnsettled && run.state !== "NOT_RUN")) return false;
    let tokens = 0, models = 0, tools = 0, unknown = false, ambiguous = false, lastFinish = 0, stopped = false;
    for (let j = 0; j < run.events.length; j += 2) {
      const start = run.events[j], finish = run.events[j + 1];
      if (start.phase !== "PENDING" || finish.phase !== "SETTLED") return false;
      const c = finish.record;
      if (stopped || allCalls.has(c.callId) || start.callId !== c.callId || start.kind !== c.kind ||
        start.role !== c.role || start.requestDigest !== c.requestDigest || start.toolId !== c.toolId ||
        start.startedMs !== c.startedMs || c.startedMs < lastFinish || c.finishedMs < c.startedMs ||
        c.finishedMs > run.elapsedMs || c.elapsedMs !== c.finishedMs - c.startedMs ||
        c.startedMs >= e.maxWallMs || tokens >= e.maxObservedTokens ||
        c.kind === "MODEL" && models >= e.maxModelCalls || c.kind === "TOOL" && tools >= e.maxToolCalls) return false;
      allCalls.add(c.callId); lastFinish = c.finishedMs;
      if (c.kind === "MODEL") {
        models++;
        if (c.toolId !== null || c.usageState === "NOT_APPLICABLE" ||
          (c.usageState === "KNOWN") !== Boolean(c.usage) ||
          c.tokenProvenance !== (c.usage ? "SIMULATED" : "UNKNOWN")) return false;
        if (c.usage) tokens += c.usage.inputTokens + c.usage.outputTokens; else unknown = true;
      } else {
        tools++;
        if (c.role !== "VERIFY" || c.toolId !== "PARITY_WITNESS" || !r.plan.tools.some(t => t.id === c.toolId) ||
          c.usageState !== "NOT_APPLICABLE" || c.usage !== null || c.sessionId !== null || c.tokenProvenance !== "NOT_APPLICABLE") return false;
      }
      if (c.sessionId) {
        if (allSessions.has(c.sessionId) && c.state === "SUCCEEDED" ||
          c.reason === "REPEATED_SESSION" && (!allSessions.has(c.sessionId) || c.state !== "INVALID_RECEIPT")) return false;
        allSessions.add(c.sessionId);
      }
      if ((c.output === null) !== (c.outputDigest === null) ||
        c.output !== null && (sha256(c.output) !== c.outputDigest || Buffer.byteLength(c.output) !== c.observedOutputBytes ||
          c.observedOutputBytes > e.maxOutputBytes) ||
        c.state === "SUCCEEDED" && (c.output === null || !c.executorSettled || c.cancelRequested ||
          c.elapsedMs >= Math.min(e.maxOperationMs, e.maxWallMs - c.startedMs) ||
          c.kind === "MODEL" && (!c.usage || !c.sessionId)) ||
        c.state !== "SUCCEEDED" && c.output !== null ||
        c.state === "AMBIGUOUS" && (c.executorSettled || !c.cancelRequested) ||
        c.state === "CANCELLED" && (!c.executorSettled || !c.cancelRequested) ||
        c.state === "OUTPUT_LIMIT" && c.observedOutputBytes <= e.maxOutputBytes) return false;
      ambiguous ||= c.state === "AMBIGUOUS";
      stopped ||= c.state !== "SUCCEEDED" || tokens >= e.maxObservedTokens || c.finishedMs >= e.maxWallMs;
    }
    if (tokens !== run.observedTokens || models !== run.modelCalls || tools !== run.toolCalls ||
      run.thresholdOvershoot !== Math.max(0, tokens - e.maxObservedTokens) ||
      (run.attempt === null) !== (run.attemptDigest === null) ||
      run.attempt !== null && (Buffer.byteLength(run.attempt) > e.maxOutputBytes ||
        comparativeReviewerProjection(r.plan, run.caseId, run.attempt).attemptDigest !== run.attemptDigest)) return false;
    if (run.state === "NOT_RUN") {
      if (run.events.length || run.elapsedMs || run.accounting !== "NOT_RUN" || run.attempt !== null ||
        run.decision !== "ABSTAIN" || run.score !== null || !["PRIOR_EXECUTOR_UNSETTLED", "EXTERNAL_CANCEL"].includes(run.reason)) return false;
    } else {
      if (run.accounting !== (unknown || ambiguous || run.state === "AMBIGUOUS" ? "INCOMPLETE" : "COMPLETE_SIMULATED")) return false;
      if (run.state === "COMPLETE") {
        if (stopped || unknown || run.elapsedMs >= e.maxWallMs || !run.attempt || run.reason !== "COMPLETE" ||
          !completeOperations(r.plan, run, run.events, run.attempt, run.decision) ||
          hash(run.score) !== hash(scoreComparativeFixture(r.references.find(ref => ref.caseId === run.caseId)!, run.decision))) return false;
      } else if (run.score !== null || run.decision !== "ABSTAIN") return false;
    }
    priorUnsettled ||= run.state === "AMBIGUOUS";
  }
  const complete = r.runs.every(run => run.state === "COMPLETE" && run.accounting === "COMPLETE_SIMULATED");
  return r.accounting === (complete ? "COMPLETE_SIMULATED" : "INCOMPLETE") &&
    r.comparison === (complete ? "FIXTURE_WORKFLOW_ONLY" : "INCOMPLETE");
}

const FIXTURE_TOOL_SOURCE = "PARITY_WITNESS_V1: evaluate n=2k and n*n=2*(2*k*k) with BigInt; no model code";
export function defaultComparativeFixturePlan() {
  const references: ComparativeReference[] = [
    { caseId: "even-square", meaning: "FIXTURE_RESPONSE_LABEL_NOT_MATHEMATICAL_ORACLE", expectedDecision: "ACCEPT", rubric: "Fixture gives the elementary even-square identity. This label does not certify a generated proof." },
    { caseId: "prime-two", meaning: "FIXTURE_RESPONSE_LABEL_NOT_MATHEMATICAL_ORACLE", expectedDecision: "ACCEPT", rubric: "Fixture presents prime 2 as a counterexample to every prime being odd. This is a public development control." },
  ];
  const content = "Public elementary parity definitions. No private sources, anticipated solution or scoring rubric supplied.";
  return { references, plan: sealComparativePlan({ version: 1, mode: "OFFLINE_FIXTURE", suiteId: "PUBLIC_DEVELOPMENT_V1",
    cases: references.map((ref, i) => { const contract = i === 0 ? MATH_PILOT_CALIBRATIONS.CALIBRATION_PROOF : MATH_PILOT_CALIBRATIONS.CALIBRATION_COUNTEREXAMPLE;
      return { id: ref.caseId, contract, contractDigest: digestMathPilotContract(contract), exposure: "PUBLIC_DEVELOPMENT" as const, referenceDigest: comparativeReferenceDigest(ref) }; }),
    sources: [{ id: "public-parity", content, contentDigest: sha256(content) }],
    tools: [{ id: "PARITY_WITNESS", version: 1, sourceDigest: sha256(FIXTURE_TOOL_SOURCE) }],
    settings: { requestedProvider: "OFFLINE_FIXTURE", requestedModel: "FIXED_RESPONSE_V1", sampling: "DETERMINISTIC_FIXTURE",
      executorAuthority: "TRUSTED_TEST_SEAM_NOT_MODEL_ATTESTATION" },
    envelope: { maxObservedTokens: 10_000, maxWallMs: 5_000, maxOperationMs: 1_000,
      maxModelCalls: 8, maxToolCalls: 2, maxOutputBytes: 8_192 }, repetitions: 1,
    ordering: "REPETITION_CASE_THEN_SEALED_LANE_ORDER", laneOrder: [...COMPARATIVE_LANES],
    stopRules: "STOP_ON_UNKNOWN_ACCOUNTING_OR_THRESHOLD_OR_DEADLINE_NO_RETRY",
    exposureWarning: "PUBLIC_FIXED_CONTROLS_NOT_HELD_OUT_OR_UNCONTAMINATED" }) };
}

/** Fixed deterministic fixtures: distinct orchestration, identical canned mathematical responses. */
export function comparativeFixtureDrivers(): Record<ComparativeLane, ComparativeLaneDriver> {
  const solve: ComparativeLaneDriver = async ({ solver, broker, reviewer }) => {
    const attempt = await broker.model("SOLVE", solver);
    const review = await broker.model("REVIEW", reviewer(attempt));
    return { attempt, decision: decisionSchema.parse(review) };
  };
  return { SINGLE_LLM: solve,
    TOOL_FIRST: async context => { await context.broker.tool({ k: "3" }); return solve(context); },
    ADAPTIVE: async context => { await context.broker.model("PLAN", context.solver);
      await context.broker.tool({ k: "3" }); return solve(context); } };
}

export const comparativeFixtureExecutor: ComparativeExecutor = async request => {
  if (request.kind === "TOOL") {
    const input = z.object({ k: z.string().regex(/^-?[0-9]{1,6}$/) }).strict().parse(request.input);
    const k = BigInt(input.k), two = BigInt(2), n = two * k;
    return { body: JSON.stringify({ n: String(n), nSquared: String(n * n), twiceInteger: String(two * (two * k * k)), matches: n * n === two * (two * k * k) }) };
  }
  let body = "Fixture planner selects the public calibration and retains its stated scope.";
  if (request.role === "SOLVE") {
    const statement = (request.input as ReturnType<typeof comparativeSolverProjection>).contract.statement;
    body = statement.includes("Every prime") ? "The integer 2 is prime and even; it refutes the claim that every prime is odd."
      : "For every even integer n, write n=2k. Then n squared=4k squared=2(2k squared), hence is even.";
  } else if (request.role === "REVIEW") body = "ACCEPT";
  return { body, sessionId: `fixture-${request.callId}`,
    usage: { inputTokens: 120, outputTokens: 40, cachedInputTokens: 20, reasoningOutputTokens: 10 } };
};
