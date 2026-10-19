import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { validateRecordedMathAgentReview } from "./agent-review";
import { LRC_FEW_EXCEPTION_SHIFT_UNIT, LRC_METHOD_UNIT_DIGEST, lrcMethodUnitSourcePinsSchema } from "./math-lrc-method-unit";
import { lrcMethodUnitFeedbackSchema } from "./math-lrc-method-unit-live";
import { lrcMethodUnitLedgerSchema } from "./math-lrc-method-unit-review";
import { freezeLrcData, LRC_SHIFT_METHOD_PREMISES } from "./math-lrc-research-program";
import { admitCommittedWork, commitmentContext, commitmentWorkBinding, type ResearchCommitment } from "./math-research-commitment";

/** Offline sidecar only. Never imported by the pinned live registry or an executor. */
export const LRC_LOOP_LIMITS = freezeLrcData({ records: 16, candidates: 32, tasks: 64, relations: 64, inputBytes: 2097152, outputBytes: 262144, depth: 32 } as const);
const id = z.string().min(1).max(160), hash = z.string().regex(/^[a-f0-9]{64}$/);
const text = z.string().min(1).max(4096), count = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const assumptionSet = z.array(text).max(32).superRefine((v, ctx) => { if (new Set(v).size !== v.length) ctx.addIssue({ code: "custom", message: "Duplicate assumption" }); }).transform(v => [...v].sort());
const predicate = z.object({ statement: text, domain: text, orderedQuantifiers: z.array(id).min(1).max(32), assumptions: assumptionSet }).strict();
export type LrcLoopPredicate = z.infer<typeof predicate>;
export const LRC_LOOP_FIXED_REPRODUCTION_PREDICATE = freezeLrcData(predicate.parse({ statement: LRC_FEW_EXCEPTION_SHIFT_UNIT.statement, domain: "u in Z_{>0}^{14}; prime d; e=#{i:d does not divide u_i}; m_d=ceil(2d/15); e>=2; e*m_d<d; t in R", orderedQuantifiers: ["FORALL_POSITIVE_INTEGER_14_SPEED_TUPLE", "FORALL_PRIME_D_WITH_SUFFICIENT_EXCEPTION_CONDITION", "EXISTS_REAL_TIME", "FORALL_14_COORDINATES"], assumptions: LRC_SHIFT_METHOD_PREMISES.filter(p => p.id === "LOWER_LRC_1_TO_12").map(p => p.statement) }));
const key = (v: unknown) => canonicalJson(v);
export function digestLrcLoopPredicate(raw: unknown): string { bounded(raw); return sha256(key(predicate.parse(raw))); }

// Additive axes: calls/tokens count actual roles (cached/reasoning are subsets), tool/checker
// calls include the host finite invocation, primeChecks counts its supported d. Wall/stream
// observations are explicit trusted-host metadata, not inferred from a ledger/hash.
// Candidate usage is an approved worst-case reservation, not a predicted/model cost.
const resources = z.object({ roleCalls: count, inputTokens: count, outputTokens: count, wallMs: count, toolCalls: count, checkerCalls: count, primeChecks: count }).strict();
const invocation = z.object({ roleWallMs: count.max(240000), inputBytes: count.max(49152), streamBytes: count.max(1048576), finiteBytes: count.max(32768), integerBits: count.max(256), checkerMs: count.max(5000), checkerOperations: count.max(2000000), primes: z.array(z.union([z.literal(3), z.literal(5)])).max(2) }).strict();
const usage = resources.extend({ invocation }).strict();
const reservation = usage.superRefine((v, ctx) => { if (v.roleCalls !== 3 || v.inputTokens < 3 || v.outputTokens < 3 || v.wallMs < 1 || v.toolCalls < 1 || v.checkerCalls !== 1 || v.primeChecks < 1 || !v.invocation.primes.length) ctx.addIssue({ code: "custom", message: "Three-role bounded checker reservation cannot be zero/unknown" }); });
const externalBinding = z.object({ id, caseId: id, runId: id, solverJobId: id, reviewJobId: id, attemptNumber: z.literal(1), runStatus: id, reviewJobStatus: id, contractDigest: hash, attemptDigest: hash, researchDigest: hash, ledgerDigest: hash, finiteSourcePins: lrcMethodUnitSourcePinsSchema }).strict();
const candidate = z.object({ id, predicate, targetedObligationId: id, mode: z.enum(["REPRODUCTION", "DISCOVERY"]), eligible: z.boolean(), requiredUsage: reservation,
  discovery: z.object({ differenceFromSource: text, falsification: text, expectedGain: text, strongestObjection: text, novelty: z.literal("PENDING") }).strict().nullable() }).strict();
const criterion = z.object({ id, obligationId: id, uncertainty: z.object({ id, baseline: z.number().finite(), minimumDelta: z.number().positive().finite() }).strict().nullable(), baselineEvidenceDigests: z.array(hash).max(64) }).strict();
const experiment = z.object({ id, candidateId: id, recordBindingId: id.nullable(), state: z.enum(["COMPLETED", "IN_FLIGHT", "NOT_RUN", "TOOL_MISSING", "REFUSED", "OPERATIONAL_FAILED", "INTEGRITY_FAILED", "ACCOUNTING_FAILED", "RESOURCE_FAILED"]), usage: usage.nullable(), criterion }).strict();
const batch = z.object({ id, sealed: z.literal(true), currentCandidateId: id, cap: resources.extend({ experiments: z.number().int().min(1).max(16) }).strict(), candidates: z.array(candidate).min(1).max(32), experiments: z.array(experiment).max(16) }).strict();
const association = z.object({ id, findingKind: z.enum(["PREMISE", "STEP"]), findingId: id, findingDigest: hash, sourceUnitDigest: hash, targetedObligationId: z.literal("FEW_EXCEPTION_SHIFT_14"), rootId: z.literal("ROOT_LRC_14_MOVING_15_TOTAL"), contribution: text, evidenceDigest: hash }).strict();
const relation = z.discriminatedUnion("kind", [
  z.object({ id, kind: z.literal("EXACT_REFUTATION"), predicate, evidenceDigest: hash, admission: z.literal("INDEPENDENT_HOST_ADMISSION") }).strict(),
  z.object({ id, kind: z.literal("BIDIRECTIONAL_EQUIVALENCE"), left: predicate, right: predicate, directionEvidenceDigests: z.tuple([hash, hash]), admission: z.literal("INDEPENDENT_HOST_ADMISSION") }).strict(),
]);
const information = z.object({ id, batchId: id, experimentId: id, criterionId: id, recordLedgerDigest: hash, predicate, targetedObligationId: id, kind: z.enum(["NEW_ALIGNED_OBLIGATION", "EXACT_PREDICATE_REFUTATION", "PREDEFINED_UNCERTAINTY_DELTA", "KNOWN_FINITE_PASS", "REVIEWER_VOTE", "PROSE_CHANGE", "SOURCE_ADOPTION"]), evidenceDigest: hash, independentReviewerId: id, admission: z.literal("INDEPENDENT_HOST_ADMISSION"), previousStatus: z.literal("OPEN").nullable(), resultStatus: z.enum(["REVIEWED_CONDITIONAL", "FINITE_CHECKED"]).nullable(), relationId: id.nullable(), uncertainty: z.object({ id, before: z.number().finite(), after: z.number().finite() }).strict().nullable() }).strict();
const registrySchema = z.object({ version: z.literal(1), bindings: z.array(externalBinding).max(16), associations: z.array(association).max(64), batch: batch.nullable(), information: z.array(information).max(64), relations: z.array(relation).max(64) }).strict();
type RegistryData = z.infer<typeof registrySchema>;
type Binding = z.infer<typeof externalBinding>;
type Information = z.infer<typeof information>;
type Relation = z.infer<typeof relation>;
export type LrcLoopHostRegistry = Readonly<{ version: 1; registryDigest: string }>;
export type LrcLoopAdmittedRecord = Readonly<{ version: 1; bindingId: string; ledgerDigest: string }>;
export type LrcLoopAdmittedInformation = Readonly<{ version: 1; receiptId: string }>;
export type LrcLoopAdmittedRelation = Readonly<{ version: 1; receiptId: string }>;
const registries = new WeakMap<object, RegistryData>();
const records = new WeakMap<object, { registry: LrcLoopHostRegistry; binding: Binding; raw: Record<string, unknown>; ledger: z.infer<typeof lrcMethodUnitLedgerSchema> }>();
const infos = new WeakMap<object, { registry: LrcLoopHostRegistry; value: Information }>();
const relations = new WeakMap<object, { registry: LrcLoopHostRegistry; value: Relation }>();

/** Refuse before recursive schemas/hashing: plain JSON data only, bounded nodes/depth/bytes. */
function bounded(raw: unknown): void {
  const active = new WeakSet<object>(); let nodes = 0, bytes = 0;
  const visit = (v: unknown, depth: number): void => {
    if (++nodes > 150000 || depth > LRC_LOOP_LIMITS.depth) throw new Error("LRC_LOOP_INPUT_CAP");
    if (v === null || typeof v === "boolean") { bytes += 5; }
    else if (typeof v === "string") { bytes += Buffer.byteLength(v) + 2; }
    else if (typeof v === "number") { if (!Number.isFinite(v)) throw new Error("LRC_LOOP_MALFORMED"); bytes += 24; }
    else if (typeof v === "object") {
      if (active.has(v)) throw new Error("LRC_LOOP_CYCLE");
      if (Array.isArray(v)) {
        if (Object.getPrototypeOf(v) !== Array.prototype || v.length > 150000 || Reflect.ownKeys(v).length !== v.length + 1) throw new Error("LRC_LOOP_MALFORMED_ARRAY");
        for (let i = 0; i < v.length; i++) if (!Object.hasOwn(v, String(i))) throw new Error("LRC_LOOP_MALFORMED_ARRAY");
      }
      if (!Array.isArray(v) && Object.getPrototypeOf(v) !== Object.prototype && Object.getPrototypeOf(v) !== null) throw new Error("LRC_LOOP_MALFORMED");
      active.add(v); bytes += 2;
      for (const k of Reflect.ownKeys(v)) {
        if (Array.isArray(v) && k === "length") continue;
        if (typeof k !== "string") throw new Error("LRC_LOOP_MALFORMED");
        const d = Object.getOwnPropertyDescriptor(v, k)!;
        if (!d.enumerable || !("value" in d)) throw new Error("LRC_LOOP_MALFORMED");
        bytes += Buffer.byteLength(k) + 4; visit(d.value, depth + 1);
      }
      active.delete(v);
    } else throw new Error("LRC_LOOP_MALFORMED");
    if (bytes > LRC_LOOP_LIMITS.inputBytes) throw new Error("LRC_LOOP_INPUT_CAP");
  };
  visit(raw, 0);
  if (Buffer.byteLength(key(raw)) > LRC_LOOP_LIMITS.inputBytes) throw new Error("LRC_LOOP_INPUT_CAP");
}
function unique(rows: readonly { id: string }[]): void { if (new Set(rows.map(r => r.id)).size !== rows.length) throw new Error("LRC_LOOP_DUPLICATE_ID"); }
function host(registry: LrcLoopHostRegistry): RegistryData { const value = registries.get(registry); if (!value) throw new Error("LRC_LOOP_UNTRUSTED_REGISTRY"); return value; }

/** SECURITY: this constructor is the trusted HOST boundary, not authorization for arbitrary callers.
 * No route/runtime is wired to it; a malicious host fabricating all external evidence is out of scope.
 * It grants no execution authority and cannot attest filesystem/runtime source authenticity. */
export function createLrcLoopHostRegistry(rawTrustedHostData: unknown): LrcLoopHostRegistry {
  bounded(rawTrustedHostData); const data = registrySchema.parse(rawTrustedHostData);
  for (const rows of [data.bindings, data.associations, data.information, data.relations]) unique(rows);
  for (const a of data.associations) {
    const fixed = a.findingKind === "PREMISE" ? LRC_FEW_EXCEPTION_SHIFT_UNIT.premiseIds : LRC_FEW_EXCEPTION_SHIFT_UNIT.stepIds;
    if (!(fixed as readonly string[]).includes(a.findingId) || a.sourceUnitDigest !== sha256(key(LRC_FEW_EXCEPTION_SHIFT_UNIT))) throw new Error("LRC_LOOP_ASSOCIATION_SCOPE");
  }
  if (data.batch) {
    const b = data.batch; unique(b.candidates); unique(b.experiments);
    if (!b.candidates.some(c => c.id === b.currentCandidateId) || b.cap.wallMs > 1800000 || b.experiments.length > b.cap.experiments) throw new Error("LRC_LOOP_BATCH_CAP");
    const lastStarted = b.experiments.filter(e => e.state !== "NOT_RUN").at(-1);
    if (lastStarted && lastStarted.candidateId !== b.currentCandidateId) throw new Error("LRC_LOOP_CURRENT_CANDIDATE_DRIFT");
    for (const c of b.candidates) {
      if ((c.mode === "DISCOVERY") !== (c.discovery !== null) || c.requiredUsage.wallMs > 1800000) throw new Error("LRC_LOOP_CANDIDATE_SCOPE");
    }
    for (const e of b.experiments) {
      if (!b.candidates.some(c => c.id === e.candidateId && c.targetedObligationId === e.criterion.obligationId) || e.recordBindingId !== null && !data.bindings.some(r => r.id === e.recordBindingId)) throw new Error("LRC_LOOP_EXPERIMENT_SCOPE");
    }
    const criteria = new Map<string, string>();
    for (const e of b.experiments) { const definition = key(e.criterion); if (criteria.has(e.criterion.id) && criteria.get(e.criterion.id) !== definition) throw new Error("LRC_LOOP_CRITERION_DEFINITION_DRIFT"); criteria.set(e.criterion.id, definition); }
  } else if (data.information.length) throw new Error("LRC_LOOP_INFORMATION_WITHOUT_BATCH");
  const token = freezeLrcData({ version: 1 as const, registryDigest: sha256(key(data)) });
  registries.set(token, freezeLrcData(data)); return token;
}

const retained = z.object({ caseId: id, runId: id, solverJobId: id, attemptNumber: z.literal(1), requestedModelName: z.literal("gpt-6-sol"), contract: z.unknown(), contractDigest: hash, attempt: z.unknown(), attemptDigest: hash, researchDigest: hash, finiteSourcePins: lrcMethodUnitSourcePinsSchema, reviewJobId: id, runStatus: id, reviewJobStatus: id,
  review: z.object({ disposition: id, conclusion: id, contractDigest: hash, attemptDigest: hash, researchDigest: hash, ledger: z.unknown(), ledgerDigest: hash }).strict() }).strict();
export function admitLrcLoopRecord(registry: LrcLoopHostRegistry, bindingId: string, raw: unknown): LrcLoopAdmittedRecord {
  const data = host(registry); bounded(raw); const v = retained.parse(raw), b = data.bindings.find(row => row.id === bindingId);
  if (!b || ["caseId", "runId", "solverJobId", "attemptNumber", "runStatus", "reviewJobStatus", "contractDigest", "attemptDigest", "researchDigest", "reviewJobId"].some(k => v[k as keyof typeof v] !== b[k as keyof Binding]) || v.review.ledgerDigest !== b.ledgerDigest || key(v.finiteSourcePins) !== key(b.finiteSourcePins)) throw new Error("LRC_LOOP_EXTERNAL_BINDING");
  const checked = validateRecordedMathAgentReview({ ...v, caseId: b.caseId, runId: b.runId, reviewJobId: b.reviewJobId, finiteSourcePins: b.finiteSourcePins });
  if (!checked || checked.version !== 7) throw new Error("LRC_LOOP_RECORD_REFUSED");
  const ledger = lrcMethodUnitLedgerSchema.parse(checked);
  const token = freezeLrcData({ version: 1 as const, bindingId, ledgerDigest: b.ledgerDigest });
  records.set(token, { registry, binding: b, raw: freezeLrcData(structuredClone(v)), ledger: freezeLrcData(ledger) }); return token;
}
export function admitLrcLoopRelation(registry: LrcLoopHostRegistry, raw: unknown): LrcLoopAdmittedRelation {
  const data = host(registry); bounded(raw); const value = relation.parse(raw);
  if (!data.relations.some(r => key(r) === key(value)) || value.kind === "BIDIRECTIONAL_EQUIVALENCE" && value.directionEvidenceDigests[0] === value.directionEvidenceDigests[1]) throw new Error("LRC_LOOP_RELATION_REFUSED");
  const token = freezeLrcData({ version: 1 as const, receiptId: value.id }); relations.set(token, { registry, value: freezeLrcData(value) }); return token;
}
export function admitLrcLoopInformation(registry: LrcLoopHostRegistry, record: LrcLoopAdmittedRecord, raw: unknown): LrcLoopAdmittedInformation {
  const data = host(registry), r = records.get(record); bounded(raw); const value = information.parse(raw), b = data.batch;
  const e = b?.experiments.find(e => e.id === value.experimentId), c = b?.candidates.find(c => c.id === e?.candidateId);
  if (!r || r.registry !== registry || !b || !e || !c || e.state !== "COMPLETED" || e.recordBindingId !== r.binding.id || value.batchId !== b.id || value.criterionId !== e.criterion.id || value.recordLedgerDigest !== r.binding.ledgerDigest || key(value.predicate) !== key(c.predicate) || value.targetedObligationId !== c.targetedObligationId || !data.information.some(i => key(i) === key(value))) throw new Error("LRC_LOOP_INFORMATION_REFUSED");
  const contexts = [(r.raw.attempt as { threadId: string }).threadId, ...r.ledger.reports.map(report => report.threadId)];
  if (contexts.includes(value.independentReviewerId) || e.criterion.baselineEvidenceDigests.includes(value.evidenceDigest)) throw new Error("LRC_LOOP_INFORMATION_NOT_NEW_INDEPENDENT");
  if (value.kind === "NEW_ALIGNED_OBLIGATION" && (value.previousStatus !== "OPEN" || value.resultStatus !== "REVIEWED_CONDITIONAL" || value.uncertainty !== null || value.relationId !== null)) throw new Error("LRC_LOOP_INFORMATION_ALIGNMENT");
  if (value.kind === "EXACT_PREDICATE_REFUTATION" && !data.relations.some(rel => rel.kind === "EXACT_REFUTATION" && rel.id === value.relationId && key(rel.predicate) === key(c.predicate) && rel.evidenceDigest === value.evidenceDigest)) throw new Error("LRC_LOOP_INFORMATION_ALIGNMENT");
  if (value.kind === "PREDEFINED_UNCERTAINTY_DELTA") {
    const u = value.uncertainty, criterion = e.criterion.uncertainty;
    if (!u || !criterion || u.id !== criterion.id || u.before !== criterion.baseline || !Number.isFinite(u.before - u.after) || u.before - u.after < criterion.minimumDelta) throw new Error("LRC_LOOP_INFORMATION_ALIGNMENT");
  }
  const token = freezeLrcData({ version: 1 as const, receiptId: value.id }); infos.set(token, { registry, value: freezeLrcData(value) }); return token;
}

type SourceRef = { bindingId: string; ledgerDigest: string; role: "SOLVER" | "ADVERSARY" | "CRITIC"; findingKind: "PREMISE" | "STEP"; findingId: string; findingDigest: string; status: string; reason: string; route: "PROPOSED_ROOT_CONTRIBUTION" | "UNROUTABLE"; associationIds: string[] };
type Task = { id: string; findingKind: "PREMISE" | "STEP"; findingId: string; route: "PROPOSED_ROOT_CONTRIBUTION" | "UNROUTABLE" | "MIXED_ROUTING"; associations: z.infer<typeof association>[]; sources: SourceRef[]; proofClosure: false };
const resourceKeys = ["roleCalls", "inputTokens", "outputTokens", "wallMs", "toolCalls", "checkerCalls", "primeChecks"] as const;
function emptyUsage(): z.infer<typeof resources> { return { roleCalls: 0, inputTokens: 0, outputTokens: 0, wallMs: 0, toolCalls: 0, checkerCalls: 0, primeChecks: 0 }; }

export function planLrcResearchLoop(input: { registry?: LrcLoopHostRegistry; records: readonly LrcLoopAdmittedRecord[]; information?: readonly LrcLoopAdmittedInformation[]; relations?: readonly LrcLoopAdmittedRelation[]; commitment?: ResearchCommitment }) {
  if (input.records.length > 16 || (input.information?.length ?? 0) > 64 || (input.relations?.length ?? 0) > 64) throw new Error("LRC_LOOP_INPUT_CAP");
  const data = input.registry ? host(input.registry) : null;
  const rs = input.records.map(token => { const r = records.get(token); if (!r || input.registry && r.registry !== input.registry) throw new Error("LRC_LOOP_FORGED_ADMISSION"); return r; });
  if (new Set(input.records).size !== input.records.length) throw new Error("LRC_LOOP_DUPLICATE_ADMISSION");
  if (new Set(rs.map(r => r.binding.id)).size !== rs.length) throw new Error("LRC_LOOP_DUPLICATE_ADMISSION");
  const is = (input.information ?? []).map(token => { const i = infos.get(token); if (!i || i.registry !== input.registry) throw new Error("LRC_LOOP_FORGED_INFORMATION"); return i.value; });
  const rels = (input.relations ?? []).map(token => { const r = relations.get(token); if (!r || r.registry !== input.registry) throw new Error("LRC_LOOP_FORGED_RELATION"); return r.value; });
  bounded({ registry: data, records: rs.map(r => r.raw), information: is, relations: rels });
  const taskMap = new Map<string, Task>();
  for (const r of rs) {
    const feedback = [ { role: "SOLVER" as const, feedback: lrcMethodUnitFeedbackSchema.parse((r.raw.attempt as { lrcMethodUnitFeedback: unknown }).lrcMethodUnitFeedback) }, ...r.ledger.reports.map(report => ({ role: report.role, feedback: report.lrcMethodUnitFeedback })) ];
    for (const f of feedback) for (const kind of ["PREMISE", "STEP"] as const) for (const finding of kind === "PREMISE" ? f.feedback.premiseFindings : f.feedback.stepFindings) {
      const taskKey = key({ unitDigest: LRC_METHOD_UNIT_DIGEST, kind, findingId: finding.id });
      const matches = (data?.associations ?? []).filter(a => a.findingKind === kind && a.findingId === finding.id && a.findingDigest === sha256(key(finding))).sort((a, b) => a.id.localeCompare(b.id));
      let task = taskMap.get(taskKey);
      if (!task) {
        task = { id: sha256(taskKey), findingKind: kind, findingId: finding.id, route: "UNROUTABLE", associations: [], sources: [], proofClosure: false }; taskMap.set(taskKey, task);
      }
      for (const a of matches) if (!task.associations.some(existing => existing.id === a.id)) task.associations.push(a);
      task.sources.push({ bindingId: r.binding.id, ledgerDigest: r.binding.ledgerDigest, role: f.role, findingKind: kind, findingId: finding.id, findingDigest: sha256(key(finding)), status: finding.status, reason: finding.reason, route: matches.length ? "PROPOSED_ROOT_CONTRIBUTION" : "UNROUTABLE", associationIds: matches.map(a => a.id) });
    }
  }
  const tasks = [...taskMap.values()].sort((a, b) => a.id.localeCompare(b.id));
  if (tasks.length > 64) throw new Error("LRC_LOOP_TASK_CAP");
  for (const task of tasks) { task.sources.sort((a, b) => key(a).localeCompare(key(b))); task.associations.sort((a, b) => a.id.localeCompare(b.id)); const mapped = task.sources.filter(s => s.route === "PROPOSED_ROOT_CONTRIBUTION").length; task.route = mapped === 0 ? "UNROUTABLE" : mapped === task.sources.length ? "PROPOSED_ROOT_CONTRIBUTION" : "MIXED_ROUTING"; }
  const consumed = emptyUsage(); let chargedExperiments = 0, streak = 0, accountingComplete = true;
  let decision: "PLANNING_ONLY" | "CONTINUE" | "PIVOT" | "STOP_NO_INFORMATION" | "STOP_HARD" | "STOP_CAP" = "PLANNING_ONLY";
  let reason = "NO_SEALED_BATCH", nextCandidateId: string | null = null;
  const excluded = new Set<string>(); const b = data?.batch;
  // Only explicitly admitted bidirectional edges participate, no prose/hash/name equivalence.
  const refuted = new Set(rels.filter(r => r.kind === "EXACT_REFUTATION").map(r => key(r.predicate)));
  for (let changed = true; changed;) {
    changed = false;
    for (const r of rels) if (r.kind === "BIDIRECTIONAL_EQUIVALENCE") {
      const l = key(r.left), right = key(r.right);
      if (refuted.has(l) && !refuted.has(right)) { refuted.add(right); changed = true; }
      if (refuted.has(right) && !refuted.has(l)) { refuted.add(l); changed = true; }
    }
  }
  if (b) {
    for (const c of b.candidates) if (refuted.has(key(c.predicate))) excluded.add(c.id);
    decision = "CONTINUE"; reason = "BOUNDED_PREAPPROVED_PLANNING";
    const lineages = new Set<string>(), seenInformation = new Set<string>(), uncertaintyBest = new Map<string, number>();
    // Charge the entire trusted snapshot, including failures, duplicates and in-flight work.
    for (const e of b.experiments) {
      if (e.state === "NOT_RUN") continue;
      chargedExperiments++;
      if (!e.usage) { decision = "STOP_HARD"; reason = "UNKNOWN_USAGE"; accountingComplete = false; continue; }
      for (const k of resourceKeys) { consumed[k] += e.usage[k]; if (!Number.isSafeInteger(consumed[k])) throw new Error("LRC_LOOP_ACCOUNTING_OVERFLOW"); }
      if (e.usage.wallMs > 1800000 || resourceKeys.some(k => consumed[k] > b.cap[k]) || chargedExperiments > b.cap.experiments) { decision = "STOP_HARD"; reason = "RESOURCE_CAP_EXCEEDED"; }
      if (["REFUSED", "OPERATIONAL_FAILED", "INTEGRITY_FAILED", "ACCOUNTING_FAILED", "RESOURCE_FAILED"].includes(e.state)) { decision = "STOP_HARD"; reason = e.state; }
    }
    for (const e of b.experiments) {
      if (decision === "STOP_HARD") break;
      if (e.state === "NOT_RUN") continue;
      if (e.state !== "COMPLETED") { decision = "PLANNING_ONLY"; reason = "INCOMPLETE_ORDERED_EXPERIMENT"; break; }
      if (!e.usage) break; // Already refused by complete accounting pass above.
      const r = rs.find(r => r.binding.id === e.recordBindingId);
      if (!r) { decision = "STOP_HARD"; reason = "MISSING_COMPLETED_ADMISSION"; break; }
      const c = b.candidates.find(c => c.id === e.candidateId)!;
      if (c.mode !== "REPRODUCTION" || key(c.predicate) !== key(LRC_LOOP_FIXED_REPRODUCTION_PREDICATE)) { decision = "STOP_HARD"; reason = "RECORD_CANDIDATE_ALIGNMENT"; break; }
      const binding = r.binding;
      const lineage = ["run:" + binding.runId, "solverJob:" + binding.solverJobId, "reviewJob:" + binding.reviewJobId, "attempt:" + binding.attemptDigest];
      if (lineage.some(k => lineages.has(k))) { decision = "STOP_HARD"; reason = "DUPLICATE_COMPLETED_LINEAGE"; break; }
      lineage.forEach(k => lineages.add(k));
      if (r.ledger.lrcMethodUnitFiniteEvidence.status === "RESOURCE_REFUSED") { decision = "STOP_HARD"; reason = "RESOURCE_FAILED"; break; }
      if (r.raw.reviewJobStatus !== "SUCCEEDED" || !["AWAITING_REVIEW", "SUCCEEDED", "REVIEWED"].includes(r.raw.runStatus as string) || r.ledger.lrcMethodUnitFiniteEvidence.status !== "CHECKED_FINITE") { decision = "PLANNING_ONLY"; reason = "INCOMPLETE_ORDERED_EXPERIMENT"; break; }
      const tokens = [r.raw.attempt as { usage: { inputTokens: number; outputTokens: number } }, ...r.ledger.reports];
      const preparedBytes = Math.max((r.raw.attempt as { lrcMethodUnitEvidence: { solverInput: { preparedBytes: number } } }).lrcMethodUnitEvidence.solverInput.preparedBytes, ...r.ledger.reports.map(report => report.lrcMethodUnitInput.preparedBytes));
      if (e.usage.invocation.inputBytes < preparedBytes || e.usage.invocation.finiteBytes < Buffer.byteLength(key(r.ledger.lrcMethodUnitFiniteEvidence)) || e.usage.wallMs < 1) { decision = "STOP_HARD"; reason = "ACCOUNTING_MISMATCH"; break; }
      if (e.usage.roleCalls !== 3 || e.usage.inputTokens !== tokens.reduce((n, v) => n + v.usage.inputTokens, 0) || e.usage.outputTokens !== tokens.reduce((n, v) => n + v.usage.outputTokens, 0) || e.usage.checkerCalls !== 1 || e.usage.toolCalls < 1 || e.usage.primeChecks < 1 || !e.usage.invocation.primes.includes(r.ledger.lrcMethodUnitFiniteEvidence.input!.d) || e.usage.invocation.checkerOperations < (r.ledger.lrcMethodUnitFiniteEvidence.checker?.chargedOperations ?? 0) || e.usage.invocation.checkerMs < (r.ledger.lrcMethodUnitFiniteEvidence.checker?.elapsedMs ?? 0)) { decision = "STOP_HARD"; reason = "ACCOUNTING_MISMATCH"; break; }
      let gain = false;
      const experimentInformation = is.filter(i => i.experimentId === e.id).sort((left, right) => {
        if (left.kind !== right.kind) return left.kind.localeCompare(right.kind);
        // A single experiment's strongest admitted measurement is evaluated first, not caller order.
        if (left.kind === "PREDEFINED_UNCERTAINTY_DELTA" && left.uncertainty!.after !== right.uncertainty!.after) return left.uncertainty!.after < right.uncertainty!.after ? -1 : 1;
        return key(left).localeCompare(key(right));
      });
      for (const i of experimentInformation) {
        const semanticInformation = key([i.kind, i.predicate, i.targetedObligationId, i.resultStatus, i.uncertainty]);
        if (seenInformation.has(i.evidenceDigest) || seenInformation.has(semanticInformation)) continue;
        if (i.kind === "PREDEFINED_UNCERTAINTY_DELTA") {
          const u = i.uncertainty!, criterion = e.criterion.uncertainty!;
          const scope = key([e.criterion.id, criterion.id, i.predicate, i.targetedObligationId]);
          const before = uncertaintyBest.get(scope) ?? criterion.baseline, delta = before - u.after;
          if (!Number.isFinite(delta) || delta < criterion.minimumDelta) { seenInformation.add(i.evidenceDigest); seenInformation.add(semanticInformation); continue; }
          uncertaintyBest.set(scope, u.after); // Only a counted gain advances the information frontier.
        }
        if (i.kind === "NEW_ALIGNED_OBLIGATION" || i.kind === "PREDEFINED_UNCERTAINTY_DELTA" || i.kind === "EXACT_PREDICATE_REFUTATION" && rels.some(r => r.kind === "EXACT_REFUTATION" && r.id === i.relationId)) { gain = true; seenInformation.add(i.evidenceDigest); seenInformation.add(semanticInformation); }
      }
      streak = gain ? 0 : streak + 1;
    }
    if (decision !== "STOP_HARD" && decision !== "PLANNING_ONLY") {
      const current = b.candidates.find(c => c.id === b.currentCandidateId)!;
      const equivalent = new Set([key(current.predicate)]);
      for (let changed = true; changed;) { changed = false; for (const r of rels) if (r.kind === "BIDIRECTIONAL_EQUIVALENCE") { const l = key(r.left), right = key(r.right); if (equivalent.has(l) && !equivalent.has(right)) { equivalent.add(right); changed = true; } if (equivalent.has(right) && !equivalent.has(l)) { equivalent.add(l); changed = true; } } }
      const fits = (c: z.infer<typeof candidate>) => chargedExperiments < b.cap.experiments && resourceKeys.every(k => consumed[k] + c.requiredUsage[k] <= b.cap[k]);
      if (streak >= 2 || excluded.has(current.id)) {
        const next = b.candidates.filter(c => c.eligible && !excluded.has(c.id) && !equivalent.has(key(c.predicate)) && fits(c)).sort((a, b) => a.id.localeCompare(b.id))[0];
        decision = next ? "PIVOT" : "STOP_NO_INFORMATION"; reason = next ? "PREAPPROVED_DIFFERENT_PREDICATE" : "NO_ELIGIBLE_BOUNDED_ALTERNATIVE"; nextCandidateId = next?.id ?? null;
      } else if (!current.eligible || !fits(current)) { decision = "STOP_CAP"; reason = "NO_CURRENT_ELIGIBILITY_OR_REMAINING_CAP"; }
      else nextCandidateId = current.id;
    }
  }
  let commitmentStatus = "PASSIVE_DIAGNOSTIC";
  if (b) {
    try {
      if (!input.commitment) throw new Error("COMMITMENT_REQUIRED");
      const binding = commitmentContext(input.commitment);
      if (binding.choice.revision !== "INITIAL") throw new Error("COMMITMENT_LRC_DURABLE_HISTORY_UNSUPPORTED");
      if (binding.rootCaseId !== "ROOT_LRC_14_MOVING_15_TOTAL" || binding.rootContractDigest !== LRC_METHOD_UNIT_DIGEST ||
        binding.choice.sourceDigest !== LRC_METHOD_UNIT_DIGEST || binding.cycleId !== b.id) throw new Error("COMMITMENT_LRC_SCOPE_MISMATCH");
      for (const c of b.candidates) {
        const work = commitmentWorkBinding(input.commitment, c.targetedObligationId);
        if (c.mode !== binding.choice.mode || key(c.predicate) !== key(work.predicate)) throw new Error("COMMITMENT_LRC_PREDICATE_MISMATCH");
        admitCommittedWork(input.commitment, work, "LRC_OFFLINE_PLANNING");
      }
      // None of the old role receipts is a supported universal proof adapter.
      // Batch identity is immutable; a renamed batch needs an explicit host revision.
      if (chargedExperiments >= binding.choice.maxWork || b.experiments.filter(e => e.state !== "NOT_RUN" && e.state !== "IN_FLIGHT").length >= binding.choice.maxNoClosure)
        throw new Error("COMMITMENT_NO_CLOSURE_LIMIT");
      commitmentStatus = "OFFLINE_SCOPE_ALIGNED_NO_EXECUTION_AUTHORITY";
    } catch (error) {
      commitmentStatus = error instanceof Error ? error.message : "COMMITMENT_REFUSED";
      if (["CONTINUE", "PIVOT"].includes(decision)) { decision = "STOP_HARD"; reason = commitmentStatus; }
      nextCandidateId = null;
    }
  }
  const output = { version: 1 as const, decision, reason, commitmentStatus, nextCandidateId, noInformationStreak: streak, chargedExperiments, consumed, accountingComplete, excludedCandidateIds: [...excluded].sort(), tasks, dispatchAllowed: false as const, globalLrc: "NOT_ESTABLISHED" as const, formalProof: "NOT_ESTABLISHED" as const, externalAcceptance: "NOT_ESTABLISHED" as const, novelty: "NOT_ESTABLISHED" as const, proofClosure: false as const };
  if (Buffer.byteLength(key(output)) > LRC_LOOP_LIMITS.outputBytes) throw new Error("LRC_LOOP_OUTPUT_CAP");
  return freezeLrcData(output);
}
