import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { validateIndependentReplayReport } from "./math-independent-replay";
import type { MathCycleEventPayload, MathCycleProposal } from "./math-cycle";

export const RESEARCH_COMMITMENT_LIMITS = Object.freeze({ bytes: 131072, nodes: 10000, depth: 20, cycles: 32, events: 64 });
const id = z.string().trim().min(1).max(160), hash = z.string().regex(/^[a-f0-9]{64}$/);
const text = z.string().trim().min(1).max(4096);
export const researchPredicateSchema = z.object({ statement: text, domain: text,
  orderedQuantifiers: z.array(id).min(1).max(32), assumptions: z.array(text).max(32)
    .refine(v => new Set(v).size === v.length, "Duplicate assumptions").transform(v => [...v].sort()) }).strict();
export const committedSurveyPlanSchema = z.object({ kind: z.literal("ERDOS_STRAUS_RESIDUAL_A"),
  lowerExclusive: z.number().int().min(840).max(200000000), upperInclusive: z.number().int().min(841).max(200000000),
  maxA: z.number().int().min(3).max(107) }).strict().refine(p => p.upperInclusive > p.lowerExclusive &&
  p.upperInclusive - p.lowerExclusive <= 20000000 && p.maxA % 4 === 3, "Invalid finite scope");
export function committedFiniteSurveyPredicate(plan: z.infer<typeof committedSurveyPlanSchema>) {
  const p = committedSurveyPlanSchema.parse(plan);
  return { statement: `For every prime p congruent to 1 modulo 840 with ${p.lowerExclusive} < p <= ${p.upperInclusive}, exhibit positive integers x,y,z with 4/p = 1/x + 1/y + 1/z and an admissible A <= ${p.maxA}.`,
    domain: `Prime integers p in (${p.lowerExclusive},${p.upperInclusive}]; positive integer x,y,z; A in {3,7,...,${p.maxA}}`,
    orderedQuantifiers: ["FORALL_PRIME_P_IN_DECLARED_FINITE_INTERVAL", "EXISTS_POSITIVE_INTEGER_X_Y_Z_WITH_DECLARED_A_BOUND"],
    assumptions: ["Exact integer arithmetic", "p mod 840 = 1"] };
}
export const commitmentOperationSchema = z.enum(["PLANNER", "SOURCE_REVIEW", "VERIFIER", "PROOF_ATTEMPT", "CRITIC", "ADVERSARY",
  "FINITE_SURVEY", "INDEPENDENT_REPLAY", "PREPLANNER_FRONTIER", "LRC_OFFLINE_PLANNING"]);
const obligationSchema = z.object({ id, predicate: researchPredicateSchema, scope: z.enum(["FINITE", "UNIVERSAL"]),
  evidence: z.discriminatedUnion("kind", [z.object({ kind: z.literal("FINITE_SURVEY_NO_FAILURES"), plan: committedSurveyPlanSchema }).strict(),
    z.object({ kind: z.literal("UNIVERSAL_PROOF_UNSUPPORTED") }).strict()]),
  operations: z.array(commitmentOperationSchema).min(1).max(10).refine(v => new Set(v).size === v.length, "Duplicate operations")
}).strict().refine(o => o.evidence.kind !== "FINITE_SURVEY_NO_FAILURES" || o.scope === "FINITE" &&
  canonicalJson(o.predicate) === canonicalJson(committedFiniteSurveyPredicate(o.evidence.plan)), "Finite certificate requires its exact typed finite predicate");
export const researchCommitmentChoiceSchema = z.object({ mode: z.enum(["REPRODUCTION", "DISCOVERY", "METHOD_REPAIR"]),
  milestone: text, sourceDigest: hash, obligations: z.array(obligationSchema).min(1).max(16),
  maxNoClosure: z.number().int().min(1).max(2), maxWork: z.number().int().min(1).max(16),
  revision: z.enum(["INITIAL", "CONTINUE", "HUMAN_REVISED"]), expectedPreviousDigest: hash.nullable(), reason: text,
}).strict().superRefine((v, ctx) => {
  if (new Set(v.obligations.map(o => o.id)).size !== v.obligations.length) ctx.addIssue({ code: "custom", message: "Duplicate obligation" });
  if ((v.revision === "INITIAL") !== (v.expectedPreviousDigest === null)) ctx.addIssue({ code: "custom", message: "Exact predecessor required" });
});
export const researchCommitmentBindingSchema = z.object({ version: z.literal(1), policy: z.literal("RESEARCH_COMMITMENT_V1"),
  organizationId: id, workspaceId: id, rootCaseId: id, rootContractDigest: hash, rootReviewDigest: hash,
  cycleId: id, commandId: id, approvedByUserId: id, approvedAt: z.iso.datetime(),
  choice: researchCommitmentChoiceSchema, epochDigest: hash, commitmentDigest: hash }).strict();
export const researchWorkBindingSchema = z.object({ commitmentDigest: hash, obligationId: id,
  mode: researchCommitmentChoiceSchema.shape.mode, sourceDigest: hash, predicate: researchPredicateSchema }).strict();
export type ResearchCommitmentBinding = z.infer<typeof researchCommitmentBindingSchema>;
export type ResearchCommitmentChoice = z.infer<typeof researchCommitmentChoiceSchema>;
export type CommitmentPlanningContext = ResearchCommitmentBinding;
export type ResearchCommitment = Readonly<{ commitmentDigest: string }>;
const admitted = new WeakMap<object, ResearchCommitmentBinding>();
const digest = (v: unknown) => sha256(canonicalJson(v));

/** Refuse getters/cycles/sparse arrays/non-JSON BEFORE parsing/hashing. */
export function boundCommitmentInput(value: unknown): void {
  let nodes = 0, bytes = 0; const active = new WeakSet<object>();
  const visit = (v: unknown, depth: number): void => {
    if (++nodes > RESEARCH_COMMITMENT_LIMITS.nodes || depth > RESEARCH_COMMITMENT_LIMITS.depth) throw new Error("COMMITMENT_INPUT_CAP");
    if (v === null || typeof v === "boolean") bytes += 5;
    else if (typeof v === "string") bytes += Buffer.byteLength(v) + 2;
    else if (typeof v === "number" && Number.isFinite(v)) bytes += 24;
    else if (typeof v === "object") {
      if (active.has(v) || (Object.getPrototypeOf(v) !== Object.prototype && Object.getPrototypeOf(v) !== null &&
        !(Array.isArray(v) && Object.getPrototypeOf(v) === Array.prototype))) throw new Error("COMMITMENT_MALFORMED");
      if (Array.isArray(v) && (Reflect.ownKeys(v).length !== v.length + 1 || v.length > RESEARCH_COMMITMENT_LIMITS.nodes)) throw new Error("COMMITMENT_MALFORMED");
      active.add(v);
      for (const k of Reflect.ownKeys(v)) {
        if (Array.isArray(v) && k === "length") continue;
        const d = Object.getOwnPropertyDescriptor(v, k)!;
        if (typeof k !== "string" || !d.enumerable || !("value" in d)) throw new Error("COMMITMENT_MALFORMED");
        bytes += Buffer.byteLength(k) + 4; visit(d.value, depth + 1);
      }
      active.delete(v);
    } else throw new Error("COMMITMENT_MALFORMED");
    if (bytes > RESEARCH_COMMITMENT_LIMITS.bytes) throw new Error("COMMITMENT_INPUT_CAP");
  }; visit(value, 0);
}
function frozen<T>(v: T): T { if (v && typeof v === "object") { for (const x of Object.values(v)) frozen(x); Object.freeze(v); } return v; }
function semantics(c: ResearchCommitmentChoice) { const { revision, expectedPreviousDigest, reason, ...scope } = c; void revision; void expectedPreviousDigest; void reason; return scope; }
export function parseResearchCommitmentChoice(raw: unknown): ResearchCommitmentChoice { boundCommitmentInput(raw); return researchCommitmentChoiceSchema.parse(raw); }
/** Trusted authenticated HOST ONLY. Not a route, capability grant or model approval adapter. */
export function sealResearchCommitment(input: { choice: unknown; confirmed: boolean; host: Omit<ResearchCommitmentBinding, "version" | "policy" | "choice" | "epochDigest" | "commitmentDigest">;
  previous: ResearchCommitmentBinding | null }): ResearchCommitmentBinding {
  boundCommitmentInput(input);
  if (input.confirmed !== true) throw new Error("COMMITMENT_CONFIRMATION_REQUIRED");
  const host = researchCommitmentBindingSchema.omit({ version: true, policy: true, choice: true, epochDigest: true, commitmentDigest: true }).strict().parse(input.host);
  const choice = parseResearchCommitmentChoice(input.choice), previous = input.previous;
  if (previous) admitResearchCommitment(previous, {});
  if (choice.expectedPreviousDigest !== (previous?.commitmentDigest ?? null)) throw new Error("COMMITMENT_STALE_PREDECESSOR");
  if (previous && ["organizationId", "workspaceId", "rootCaseId", "rootContractDigest", "rootReviewDigest"].some(k =>
    host[k as keyof typeof host] !== previous[k as keyof ResearchCommitmentBinding])) throw new Error("COMMITMENT_ROOT_DRIFT");
  if (choice.revision === "CONTINUE" && (!previous || canonicalJson(semantics(choice)) !== canonicalJson(semantics(previous.choice)))) throw new Error("COMMITMENT_REVISION_REQUIRED");
  const epochDigest = choice.revision === "CONTINUE" ? previous!.epochDigest : digest({ scope: semantics(choice), commandId: host.commandId });
  const body = { version: 1 as const, policy: "RESEARCH_COMMITMENT_V1" as const, ...host, choice, epochDigest };
  return frozen(researchCommitmentBindingSchema.parse({ ...body, commitmentDigest: digest(body) }));
}
/** Rehydrate only from a trusted durable command outcome, with host-owned expected bindings. */
export function admitResearchCommitment(raw: unknown, expected: Partial<ResearchCommitmentBinding>): ResearchCommitment {
  boundCommitmentInput(raw); const v = researchCommitmentBindingSchema.parse(raw), { commitmentDigest, ...body } = v;
  if (digest(body) !== commitmentDigest || v.choice.revision !== "CONTINUE" &&
    v.epochDigest !== digest({ scope: semantics(v.choice), commandId: v.commandId }) ||
    Object.entries(expected).some(([k, x]) => canonicalJson(v[k as keyof typeof v]) !== canonicalJson(x))) throw new Error("COMMITMENT_HOST_BINDING");
  const token = frozen({ commitmentDigest }); admitted.set(token, frozen(v)); return token;
}
export function commitmentContext(token: ResearchCommitment): ResearchCommitmentBinding {
  const v = admitted.get(token); if (!v) throw new Error("COMMITMENT_UNTRUSTED_TOKEN"); return v;
}
export function commitmentWorkBinding(token: ResearchCommitment, obligationId: string) {
  const v = commitmentContext(token), o = v.choice.obligations.find(o => o.id === obligationId);
  if (!o) throw new Error("COMMITMENT_OBLIGATION_MISMATCH");
  return frozen({ commitmentDigest: v.commitmentDigest, obligationId, mode: v.choice.mode, sourceDigest: v.choice.sourceDigest, predicate: o.predicate });
}
export function admitCommittedWork(token: ResearchCommitment, raw: unknown, operation: z.infer<typeof commitmentOperationSchema>, proposal?: Partial<Pick<MathCycleProposal, "taskStatement" | "exactSurveyPlan" | "structuralProbePlan" | "mixedCoreClaim">>): void {
  const v = commitmentContext(token); boundCommitmentInput(raw); const work = researchWorkBindingSchema.parse(raw), o = v.choice.obligations.find(o => o.id === work.obligationId);
  if (!o || canonicalJson(work) !== canonicalJson(commitmentWorkBinding(token, o.id)) || !o.operations.includes(operation)) throw new Error("COMMITMENT_WORK_REFUSED");
  // Unsupported historical tools have no declared typed scope adapter in this version.
  if (proposal?.structuralProbePlan || proposal?.mixedCoreClaim) throw new Error("COMMITMENT_TOOL_SCOPE_UNSUPPORTED");
  if (proposal && proposal.taskStatement !== o.predicate.statement) throw new Error("COMMITMENT_TASK_SCOPE_MISMATCH");
  if (proposal?.exactSurveyPlan && (o.evidence.kind !== "FINITE_SURVEY_NO_FAILURES" ||
    canonicalJson(proposal.exactSurveyPlan) !== canonicalJson(o.evidence.plan))) throw new Error("COMMITMENT_SURVEY_SCOPE_MISMATCH");
  if (["FINITE_SURVEY", "INDEPENDENT_REPLAY"].includes(operation) && o.evidence.kind !== "FINITE_SURVEY_NO_FAILURES") throw new Error("COMMITMENT_TOOL_SCOPE_UNSUPPORTED");
  if (proposal && ["FINITE_SURVEY", "INDEPENDENT_REPLAY"].includes(operation) && o.evidence.kind === "FINITE_SURVEY_NO_FAILURES" &&
    canonicalJson(proposal.exactSurveyPlan ?? null) !== canonicalJson(o.evidence.plan)) throw new Error("COMMITMENT_SURVEY_SCOPE_MISMATCH");
}
export function committedOperationBinding(token: ResearchCommitment, operation: z.infer<typeof commitmentOperationSchema>) {
  const v = commitmentContext(token), o = v.choice.obligations.find(o => o.operations.includes(operation));
  if (!o) throw new Error("COMMITMENT_OPERATION_NOT_APPROVED");
  const work = commitmentWorkBinding(token, o.id); admitCommittedWork(token, work, operation); return work;
}
export function finiteCommitmentClosures(token: ResearchCommitment, trace: readonly MathCycleEventPayload[]): string[] {
  boundCommitmentInput(trace);
  const v = commitmentContext(token), closed: string[] = [];
  if (trace.length > RESEARCH_COMMITMENT_LIMITS.events) throw new Error("COMMITMENT_HISTORY_OVERFLOW");
  // This adapter cannot turn a free-standing partial evidence triple into a closure.
  const markers = trace.filter(e => e.phase === "COMMITMENT_BOUND");
  if (trace.some(e => e.phase === "COMPUTED") && (markers.length !== 1 || canonicalJson(markers[0].binding) !== canonicalJson(v))) throw new Error("COMMITMENT_CLOSURE_TRACE_INVALID");
  for (const event of trace) {
    if (event.phase !== "COMPUTED") continue;
    const round = trace.filter(e => e.round === event.round);
    boundCommitmentInput(round);
    if (!Number.isSafeInteger(event.round) || event.round < 1) throw new Error("COMMITMENT_CLOSURE_TRACE_INVALID");
    const proposed = trace.find(e => e.round === event.round && e.phase === "PROPOSED");
    const replay = trace.find(e => e.round === event.round && e.phase === "INDEPENDENT_REPLAY");
    const started = round.find(e => e.phase === "COMMITMENT_WORK_STARTED");
    const verified = round.find(e => e.phase === "VERIFIED");
    if (proposed?.phase !== "PROPOSED" || replay?.phase !== "INDEPENDENT_REPLAY") continue;
    if (["PROPOSED", "COMPUTED", "INDEPENDENT_REPLAY", "COMMITMENT_WORK_STARTED", "VERIFIED"].some(p => round.filter(e => e.phase === p).length !== 1) ||
      started?.phase !== "COMMITMENT_WORK_STARTED" || started.commitmentDigest !== v.commitmentDigest || verified?.phase !== "VERIFIED" || !verified.accepted ||
      !(trace.indexOf(markers[0]) < trace.indexOf(started) && trace.indexOf(started) < trace.indexOf(proposed) && trace.indexOf(proposed) < trace.indexOf(verified) && trace.indexOf(verified) < trace.indexOf(event) && trace.indexOf(event) < trace.indexOf(replay))) throw new Error("COMMITMENT_CLOSURE_TRACE_INVALID");
    const o = v.choice.obligations.find(o => o.id === proposed.proposal.workBinding?.obligationId);
    if (!o || o.scope !== "FINITE" || o.evidence.kind !== "FINITE_SURVEY_NO_FAILURES") continue;
    admitCommittedWork(token, proposed.proposal.workBinding, "FINITE_SURVEY", proposed.proposal);
    admitCommittedWork(token, proposed.proposal.workBinding, "INDEPENDENT_REPLAY", proposed.proposal);
    if (canonicalJson(event.evidence.plan) === canonicalJson(o.evidence.plan) && event.evidence.failureCount === 0 &&
      validateIndependentReplayReport(event.evidence, replay.report)) closed.push(o.id);
  }
  return [...new Set(closed)].sort();
}
/** Complete host-validated history, within one exact tenant/workspace/root identity only. */
export function projectCommitmentHistory(token: ResearchCommitment, history: readonly { binding: ResearchCommitmentBinding; trace: readonly MathCycleEventPayload[]; status: string }[]) {
  boundCommitmentInput(history);
  const active = commitmentContext(token);
  if (history.length > RESEARCH_COMMITMENT_LIMITS.cycles) throw new Error("COMMITMENT_HISTORY_OVERFLOW");
  if (!history.length && active.choice.revision !== "INITIAL") throw new Error("COMMITMENT_HISTORY_INCOMPLETE");
  let work = 0, noClosure = 0; const closed = new Set<string>(), cycles = new Set<string>();
  let previous: ResearchCommitmentBinding | null = null;
  for (const row of history) {
    if (!["QUEUED", "RUNNING", "STOPPED", "FAILED"].includes(row.status) || row.trace.length > RESEARCH_COMMITMENT_LIMITS.events || cycles.has(row.binding.cycleId)) throw new Error("COMMITMENT_HISTORY_INVALID");
    cycles.add(row.binding.cycleId);
    const t = admitResearchCommitment(row.binding, { organizationId: active.organizationId, workspaceId: active.workspaceId,
      rootCaseId: active.rootCaseId, rootContractDigest: active.rootContractDigest, rootReviewDigest: active.rootReviewDigest });
    if (row.binding.choice.expectedPreviousDigest !== (previous?.commitmentDigest ?? null)) throw new Error("COMMITMENT_HISTORY_INCOMPLETE");
    if (row.binding.choice.revision === "CONTINUE" && (!previous || row.binding.epochDigest !== previous.epochDigest ||
      canonicalJson(semantics(row.binding.choice)) !== canonicalJson(semantics(previous.choice)))) throw new Error("COMMITMENT_HISTORY_DRIFT");
    previous = row.binding;
    if (row.binding.epochDigest !== active.epochDigest) continue;
    const started = row.trace.filter(e => e.phase === "COMMITMENT_WORK_STARTED");
    if (new Set(started.map(e => e.round)).size !== started.length || started.some(e => e.commitmentDigest !== row.binding.commitmentDigest) ||
      row.trace.some(e => ["CALL_STARTED", "COMPUTED", "INDEPENDENT_REPLAY", "FRONTIER_DOSSIER", "FRONTIER_REVIEWED", "RESEARCH_FRONTIER_BASELINE", "RESEARCH_METHOD_MAP", "STRUCTURAL_PROBED", "MIXED_CORE_EVIDENCE", "ATTEMPTED", "PRIOR_COUNTEREXAMPLE_REPLAY", "PRIOR_GATE_DOSSIER", "COUNTEREXAMPLE_REPLAY", "PARAMETRIC_CHECKED", "CERTIFICATE_CHECKED", "REVIEWED", "VERIFIED", "PROPOSED", "PORTFOLIO_PLANNED"].includes(e.phase) && !started.some(s => s.round === e.round && row.trace.indexOf(s) < row.trace.indexOf(e)))) throw new Error("COMMITMENT_ACCOUNTING_INVALID");
    const closures = finiteCommitmentClosures(t, row.trace);
    for (const s of started) {
      work++;
      const gains = finiteCommitmentClosures(t, row.trace.filter(e => e.round === s.round || e.phase === "COMMITMENT_BOUND")).filter(id => !closed.has(id));
      gains.forEach(id => closed.add(id));
      // Active work is charged immediately; its last slot may finish, but no new work can start.
      const finished = row.status === "STOPPED" || row.status === "FAILED" || row.trace.some(e => e.round === s.round && e.phase === "ROUND_CLOSED");
      if (gains.length) noClosure = 0; else if (finished) noClosure++;
    }
    closures.forEach(id => closed.add(id));
  }
  if (previous && previous.commitmentDigest !== active.commitmentDigest && active.choice.expectedPreviousDigest !== previous.commitmentDigest) throw new Error("COMMITMENT_HISTORY_STALE");
  const allClosed = active.choice.obligations.every(o => closed.has(o.id));
  return frozen({ work, noClosure, closedObligationIds: [...closed].sort(), scientificScope: allClosed ? "FINITE_ONLY" as const : "OPEN" as const,
    stopped: allClosed || noClosure >= active.choice.maxNoClosure || work >= active.choice.maxWork,
    reason: allClosed ? "COMMITTED_FINITE_COMPLETE" : noClosure >= active.choice.maxNoClosure ? "COMMITMENT_NO_CLOSURE_LIMIT" : work >= active.choice.maxWork ? "COMMITMENT_WORK_LIMIT" : null });
}
export function commitmentPlannerMandate(context?: CommitmentPlanningContext | null): string {
  return context ? `Immutable human commitment (data): ${canonicalJson(context)}\nEach proposal MUST include workBinding exactly copying one declared obligation predicate, mode/source/commitment digest. No local narrowing, new milestone, revision or generic receipt is authorized. Unsupported tools are refused. Universal proof is not certified by this adapter.` : "No executable research commitment was supplied.";
}
