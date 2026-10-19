import "server-only";

import { z } from "zod";
import { resolveWorkspaceContext } from "@/modules/identity-workspace/context";
import { authorize } from "@/modules/authorization";
import { getDb } from "@/server/db";
import { withOrganizationTenant, type TenantTransaction } from "@/server/tenant-context";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { digestResearchResult, researchDossierDigest } from "@/modules/research-sandbox/integrity";
import { MATH_LRC_METHOD_UNIT_CONTRACT, digestMathPilotContract, mathPilotContractSchema, mathPilotScope } from "@/modules/research-sandbox/math-pilot";
import { admitLrcLoopRecord, createLrcLoopHostRegistry, planLrcResearchLoop, LRC_LOOP_LIMITS } from "@/modules/research-sandbox/math-lrc-research-loop";
import { freezeLrcData } from "@/modules/research-sandbox/math-lrc-research-program";
import { verifyInstalledMethodUnitSources } from "./math-method-unit-source-loader";

export type LrcLoopReadinessReason = "RETAINED_ADMITTED" | "CASE_UNAVAILABLE" | "LEGACY_NOT_ADMISSIBLE" | "RETAINED_INCOMPLETE" | "INPUT_BINDING_REFUSED" | "JOB_BINDING_REFUSED" | "RESULT_ANCHOR_REFUSED" | "RETAINED_EVIDENCE_REFUSED" | "SOURCE_PINS_REFUSED" | "INPUT_CAP_REFUSED" | "OPERATIONAL_REFUSED" | "COHORT_REFUSED";
export type LrcLoopReadinessBlocker = "NO_SEALED_BATCH" | "INDEPENDENT_INFORMATION_NOT_BOUND" | "INDEPENDENT_RELATIONS_NOT_BOUND" | "ROOT_ASSOCIATIONS_NOT_BOUND" | "FRESH_FINITE_REPLAY_NOT_RUN" | "G2_NOT_AUTHORIZED" | "NO_ADMITTED_METHOD_RECORD" | "INPUT_REFUSED" | "ACCESS_UNAVAILABLE" | "SOURCE_PINS_REFUSED" | "OPERATIONAL_REFUSED";
export interface LrcLoopReadinessCase {
  readonly caseId: string;
  readonly status: "ADMITTED" | "UNAVAILABLE" | "LEGACY_NOT_ADMISSIBLE" | "MISSING" | "REFUSED";
  readonly reason: LrcLoopReadinessReason;
  readonly retainedJobs: "VERIFIED" | "NOT_ADMITTED";
}
type ReadonlyData<T> = T extends readonly (infer U)[] ? readonly ReadonlyData<U>[] : T extends object ? { readonly [K in keyof T]: ReadonlyData<T[K]> } : T;
export type LrcLoopReadinessTask = ReadonlyData<ReturnType<typeof planLrcResearchLoop>["tasks"][number]>;
export interface LrcLoopReadinessDto {
  readonly version: 1;
  readonly status: "AUTHENTICATED_READ_ONLY" | "UNAVAILABLE" | "INVALID_INPUT" | "SOURCE_REFUSED" | "OPERATIONAL_REFUSED";
  readonly session: "AUTHORIZED" | "UNAVAILABLE";
  readonly sources: "VERIFIED_FIXED_37" | "NOT_VERIFIED";
  readonly cases: readonly LrcLoopReadinessCase[];
  readonly admittedCount: number;
  readonly tasks: readonly LrcLoopReadinessTask[];
  readonly decision: "PLANNING_ONLY";
  readonly blockers: readonly LrcLoopReadinessBlocker[];
  readonly freshFiniteReplay: "NOT_RUN";
  readonly independentInformation: "NOT_BOUND";
  readonly batch: "NOT_BOUND";
  readonly executionGate: "G2_NOT_AUTHORIZED";
  readonly dispatchAllowed: false;
  readonly proofClosure: false;
  readonly globalLrc: "NOT_ESTABLISHED";
  readonly formalProof: "NOT_ESTABLISHED";
  readonly externalAcceptance: "NOT_ESTABLISHED";
  readonly novelty: "NOT_ESTABLISHED";
}
const fixedBlockers: LrcLoopReadinessBlocker[] = ["NO_SEALED_BATCH", "INDEPENDENT_INFORMATION_NOT_BOUND", "INDEPENDENT_RELATIONS_NOT_BOUND", "ROOT_ASSOCIATIONS_NOT_BOUND", "FRESH_FINITE_REPLAY_NOT_RUN", "G2_NOT_AUTHORIZED"];
const identifier = z.uuid();
const requestSchema = z.object({ headers: z.instanceof(Headers), workspaceSlug: z.string().min(1).max(160).regex(/^[a-z0-9-]+$/), missionId: identifier, caseIds: z.array(identifier).min(1).max(16).refine(ids => new Set(ids).size === ids.length) }).strict();
class Refusal extends Error { constructor(readonly reason: LrcLoopReadinessReason) { super(reason); } }
function refuse(reason: LrcLoopReadinessReason): never { throw new Refusal(reason); }
function dto(input: Pick<LrcLoopReadinessDto, "status" | "session" | "sources" | "cases"> & { tasks?: LrcLoopReadinessTask[]; blockers?: LrcLoopReadinessBlocker[] }): LrcLoopReadinessDto {
  const tasks = input.tasks ?? [], admittedCount = input.cases.filter(c => c.status === "ADMITTED").length;
  const result: LrcLoopReadinessDto = { version: 1, ...input, tasks, admittedCount, decision: "PLANNING_ONLY", blockers: [...fixedBlockers, ...(admittedCount ? [] : ["NO_ADMITTED_METHOD_RECORD" as const]), ...(input.blockers ?? [])], freshFiniteReplay: "NOT_RUN", independentInformation: "NOT_BOUND", batch: "NOT_BOUND", executionGate: "G2_NOT_AUTHORIZED", dispatchAllowed: false, proofClosure: false, globalLrc: "NOT_ESTABLISHED", formalProof: "NOT_ESTABLISHED", externalAcceptance: "NOT_ESTABLISHED", novelty: "NOT_ESTABLISHED" };
  if (Buffer.byteLength(canonicalJson(result)) > LRC_LOOP_LIMITS.outputBytes) refuse("INPUT_CAP_REFUSED");
  return freezeLrcData(result);
}

/** Bound plain database JSON before schemas, recursion or digest work. No getters/prototypes. */
function boundJson(raw: unknown) {
  let nodes = 0, bytes = 0;
  const active = new WeakSet<object>();
  const visit = (v: unknown, depth: number): void => {
    if (++nodes > 150000 || depth > LRC_LOOP_LIMITS.depth) refuse("INPUT_CAP_REFUSED");
    if (v === null || typeof v === "boolean") bytes += 5;
    else if (typeof v === "number") { if (!Number.isFinite(v)) refuse("INPUT_CAP_REFUSED"); bytes += 24; }
    else if (typeof v === "string") bytes += Buffer.byteLength(v) + 2;
    else if (typeof v === "object") {
      if (active.has(v)) refuse("INPUT_CAP_REFUSED");
      if (Array.isArray(v)) {
        if (Object.getPrototypeOf(v) !== Array.prototype || v.length > 150000 || Reflect.ownKeys(v).length !== v.length + 1) refuse("INPUT_CAP_REFUSED");
      } else if (![Object.prototype, null].includes(Object.getPrototypeOf(v))) refuse("INPUT_CAP_REFUSED");
      active.add(v); bytes += 2;
      for (const k of Reflect.ownKeys(v)) {
        if (Array.isArray(v) && k === "length") continue;
        const d = Object.getOwnPropertyDescriptor(v, k)!;
        if (typeof k !== "string" || !d.enumerable || !("value" in d)) refuse("INPUT_CAP_REFUSED");
        bytes += Buffer.byteLength(k as string) + 4; visit(d.value, depth + 1);
      }
      active.delete(v);
    } else refuse("INPUT_CAP_REFUSED");
    if (bytes > LRC_LOOP_LIMITS.inputBytes) refuse("INPUT_CAP_REFUSED");
  };
  visit(raw, 0);
}

async function principal(headers: Headers, workspaceSlug: string, missionId: string) {
  const ctx = await resolveWorkspaceContext(new Headers(headers), workspaceSlug);
  const workspace = await getDb().workspace.findFirst({ where: { id: ctx.workspace.id, slug: workspaceSlug, status: "ACTIVE" }, select: { organizationId: true } });
  if (!workspace || ctx.membership.status !== "ACTIVE" || ctx.workspace.status !== "ACTIVE") throw new Error("UNAVAILABLE");
  const resource = { organizationId: workspace.organizationId, workspaceId: ctx.workspace.id, missionId };
  if (!(await authorize(ctx.user.id, "research.read", resource)).allowed) throw new Error("UNAVAILABLE");
  return { actorUserId: ctx.user.id, membershipId: ctx.membership.id, workspaceId: ctx.workspace.id, organizationId: workspace.organizationId };
}
async function readRows(tx: TenantTransaction, tenant: { organizationId: string; workspaceId: string }, missionId: string, caseIds: string[]) {
  const mission = await tx.mission.findFirst({ where: { id: missionId, workspaceId: tenant.workspaceId, workspace: { organizationId: tenant.organizationId } }, select: { id: true } });
  if (!mission) throw new Error("UNAVAILABLE");
  return tx.mathPilotCase.findMany({ where: { ...tenant, missionId, id: { in: caseIds } }, take: 16, orderBy: [{ id: "asc" }], select: {
    id: true, organizationId: true, workspaceId: true, missionId: true, researchRunId: true, caseType: true, contract: true, contractDigest: true,
    researchRun: { select: { id: true, organizationId: true, workspaceId: true, missionId: true, jobId: true, commandId: true, requestedByMembershipId: true, requestedBy: { select: { id: true, userId: true, workspaceId: true } }, providerName: true, modelName: true, status: true, question: true, scope: true, mathModelAttempt: true, mathModelAttemptDigest: true,
      sources: { take: 51, orderBy: [{ canonicalUri: "asc" }, { id: "asc" }], select: { canonicalUri: true, contentDigest: true, provenance: true } },
      findings: { take: 101, orderBy: [{ findingKey: "asc" }, { id: "asc" }], select: { findingKey: true, kind: true, claim: true, sourceId: true, exactExcerpt: true, startOffset: true, endOffset: true, confidence: true, decision: { select: { decision: true, rationale: true } } } },
    } }, agentReview: { select: { organizationId: true, workspaceId: true, missionId: true, caseId: true, jobId: true, disposition: true, conclusion: true, contractDigest: true, attemptDigest: true, researchDigest: true, ledger: true, ledgerDigest: true } },
  } });
}
type Row = Awaited<ReturnType<typeof readRows>>[number];
async function readJobs(tx: TenantTransaction, tenant: { organizationId: string; workspaceId: string }, ids: string[]) {
  return tx.durableJob.findMany({ where: { ...tenant, id: { in: ids } }, take: 32, select: { id: true, organizationId: true, workspaceId: true, jobType: true, payload: true, status: true, attempts: true, maxAttempts: true, outboxEventId: true, result: true,
    outboxEvent: { select: { id: true, organizationId: true, workspaceId: true, commandId: true, topic: true, aggregateType: true, aggregateId: true, payload: true, status: true, command: { select: { id: true, organizationId: true, workspaceId: true, commandType: true, actorUserId: true, status: true, outcome: true } } } },
  } });
}
type Job = Awaited<ReturnType<typeof readJobs>>[number];
function oneKey(raw: unknown, key: string, expected: string) {
  return !!raw && typeof raw === "object" && !Array.isArray(raw) && Object.keys(raw).length === 1 && (raw as Record<string, unknown>)[key] === expected;
}
function checkJob(job: Job | undefined, row: Row, solver: boolean) {
  const run = row.researchRun, expected = solver ? run.id : row.id, key = solver ? "runId" : "caseId", topic = solver ? "math-pilot.codex-local.execute" : "math-pilot.codex-local.review";
  const outbox = job?.outboxEvent;
  if (!job || job.organizationId !== row.organizationId || job.workspaceId !== row.workspaceId || job.status !== "SUCCEEDED" || job.attempts !== 1 || job.maxAttempts !== 1 || job.jobType !== topic || !oneKey(job.payload, key, expected) || !outbox || job.outboxEventId !== outbox.id || outbox.organizationId !== row.organizationId || outbox.workspaceId !== row.workspaceId || outbox.commandId !== run.commandId || outbox.topic !== topic || outbox.aggregateType !== (solver ? "ResearchRun" : "MathPilotCase") || outbox.aggregateId !== expected || outbox.status !== "DISPATCHED" || !oneKey(outbox.payload, key, expected)) refuse("JOB_BINDING_REFUSED");
  const command = outbox.command;
  if (command.id !== run.commandId || command.organizationId !== row.organizationId || command.workspaceId !== row.workspaceId || command.commandType !== "research.run.request" || command.status !== "SUCCEEDED" || command.actorUserId !== run.requestedBy.userId || (command.outcome as Record<string, unknown> | null)?.runId !== run.id) refuse("JOB_BINDING_REFUSED");
  return job;
}
function retained(row: Row, jobs: Job[], tenant: { organizationId: string; workspaceId: string }, missionId: string, finiteSourcePins: Awaited<ReturnType<typeof verifyInstalledMethodUnitSources>>["finiteSourcePins"]) {
  const run = row.researchRun, review = row.agentReview;
  if (row.organizationId !== tenant.organizationId || row.workspaceId !== tenant.workspaceId || row.missionId !== missionId || run.organizationId !== tenant.organizationId || run.workspaceId !== tenant.workspaceId || run.missionId !== missionId || row.researchRunId !== run.id || run.requestedBy.id !== run.requestedByMembershipId || run.requestedBy.workspaceId !== tenant.workspaceId) refuse("INPUT_BINDING_REFUSED");
  if ((row.contract as { version?: unknown } | null)?.version !== 4) refuse("LEGACY_NOT_ADMISSIBLE");
  const contract = mathPilotContractSchema.safeParse(row.contract);
  if (!contract.success || canonicalJson(contract.data) !== canonicalJson(MATH_LRC_METHOD_UNIT_CONTRACT) || row.caseType !== "OPEN" || digestMathPilotContract(contract.data) !== row.contractDigest || run.providerName !== "codex-local" || run.modelName !== "gpt-6-sol" || run.question !== contract.data.statement || run.scope !== mathPilotScope(contract.data)) refuse("INPUT_BINDING_REFUSED");
  if (!review || !run.mathModelAttempt || !run.mathModelAttemptDigest || !run.jobId || !["AWAITING_REVIEW", "APPROVED"].includes(run.status)) refuse("RETAINED_INCOMPLETE");
  if (review.organizationId !== tenant.organizationId || review.workspaceId !== tenant.workspaceId || review.missionId !== missionId || review.caseId !== row.id || review.jobId === run.jobId) refuse("INPUT_BINDING_REFUSED");
  const solver = checkJob(jobs.find(j => j.id === run.jobId), row, true), reviewer = checkJob(jobs.find(j => j.id === review.jobId), row, false);
  if (solver.outboxEventId === reviewer.outboxEventId) refuse("JOB_BINDING_REFUSED");
  // The frozen method adapter emits exactly this source-free payload. Generic
  // provider source keys/classes are not durably retained and cannot be invented.
  const f = run.findings[0];
  if (run.sources.length !== 0 || run.findings.length !== 1 || !f || f.findingKey !== "no-external-source" || f.kind !== "HONEST_NULL" || f.claim !== "Conditional method feedback only; no independently captured external source span." || f.sourceId !== null || f.exactExcerpt !== "" || f.startOffset !== null || f.endOffset !== null || Number(f.confidence) !== 0) refuse("INPUT_BINDING_REFUSED");
  const researchDigest = researchDossierDigest(run);
  const resultDigest = digestResearchResult({ provider: run.providerName, model: run.modelName, sources: [], findings: [{ key: f.findingKey, kind: f.kind, claim: f.claim, sourceKey: null, exactExcerpt: f.exactExcerpt, startOffset: f.startOffset, endOffset: f.endOffset, confidence: 0 }] });
  const solverResult = solver.result as Record<string, unknown> | null, reviewResult = reviewer.result as Record<string, unknown> | null;
  if (!solverResult || solverResult.runId !== run.id || solverResult.resultDigest !== resultDigest || solverResult.mathModelAttemptDigest !== run.mathModelAttemptDigest || !reviewResult || reviewResult.caseId !== row.id || reviewResult.ledgerDigest !== review.ledgerDigest || reviewResult.disposition !== review.disposition || review.contractDigest !== row.contractDigest || review.attemptDigest !== run.mathModelAttemptDigest || review.researchDigest !== researchDigest) refuse("RESULT_ANCHOR_REFUSED");
  const reviewData = { disposition: review.disposition, conclusion: review.conclusion, contractDigest: review.contractDigest, attemptDigest: review.attemptDigest, researchDigest: review.researchDigest, ledger: review.ledger, ledgerDigest: review.ledgerDigest };
  const record = { caseId: row.id, runId: run.id, solverJobId: solver.id, reviewJobId: reviewer.id, attemptNumber: 1 as const, requestedModelName: "gpt-6-sol" as const, runStatus: run.status, reviewJobStatus: reviewer.status, contract: row.contract, contractDigest: row.contractDigest, attempt: run.mathModelAttempt, attemptDigest: run.mathModelAttemptDigest, researchDigest, finiteSourcePins, review: reviewData };
  const binding = { id: row.id, caseId: row.id, runId: run.id, solverJobId: solver.id, reviewJobId: reviewer.id, attemptNumber: 1 as const, runStatus: run.status, reviewJobStatus: reviewer.status, contractDigest: row.contractDigest, attemptDigest: run.mathModelAttemptDigest, researchDigest, ledgerDigest: review.ledgerDigest, finiteSourcePins };
  return { record, binding };
}

/** Authenticated passive DAL only: never consumes tasks or creates execution authority. */
export async function loadLrcLoopReadiness(input: { headers: Headers; workspaceSlug: string; missionId: string; caseIds: readonly string[] }): Promise<LrcLoopReadinessDto> {
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) return dto({ status: "INVALID_INPUT", session: "UNAVAILABLE", sources: "NOT_VERIFIED", cases: [], blockers: ["INPUT_REFUSED"] });
  const request = { ...parsed.data, headers: new Headers(parsed.data.headers), caseIds: [...parsed.data.caseIds].sort() };
  let initial: Awaited<ReturnType<typeof principal>>;
  try { initial = await principal(request.headers, request.workspaceSlug, request.missionId); }
  catch { return dto({ status: "UNAVAILABLE", session: "UNAVAILABLE", sources: "NOT_VERIFIED", cases: [], blockers: ["ACCESS_UNAVAILABLE"] }); }
  let result: LrcLoopReadinessDto | undefined;
  try {
    let pins: Awaited<ReturnType<typeof verifyInstalledMethodUnitSources>> | undefined;
    try { pins = await verifyInstalledMethodUnitSources(); }
    catch { result = dto({ status: "SOURCE_REFUSED", session: "AUTHORIZED", sources: "NOT_VERIFIED", cases: [], blockers: ["SOURCE_PINS_REFUSED"] }); }
    if (pins) {
      const verifiedPins = pins;
      const tenant = { organizationId: initial.organizationId, workspaceId: initial.workspaceId };
      result = await withOrganizationTenant(initial.organizationId, initial.actorUserId, async tx => {
        const rows = await readRows(tx, tenant, request.missionId, request.caseIds);
        if (rows.length > 16 || new Set(rows.map(r => r.id)).size !== rows.length || rows.some(r => !request.caseIds.includes(r.id))) refuse("INPUT_BINDING_REFUSED");
        // A foreign/inconsistent row is indistinguishable from an absent case.
        // Never derive job IDs, hash bodies or serialize reasons from it.
        const scopedRows = rows.filter(row => row.organizationId === tenant.organizationId && row.workspaceId === tenant.workspaceId && row.missionId === request.missionId && row.researchRun.organizationId === tenant.organizationId && row.researchRun.workspaceId === tenant.workspaceId && row.researchRun.missionId === request.missionId && row.researchRunId === row.researchRun.id && (!row.agentReview || row.agentReview.organizationId === tenant.organizationId && row.agentReview.workspaceId === tenant.workspaceId && row.agentReview.missionId === request.missionId && row.agentReview.caseId === row.id));
        const ids = [...new Set(scopedRows.flatMap(row => [row.researchRun.jobId, row.agentReview?.jobId].filter((id): id is string => !!id)))];
        const jobs = ids.length ? await readJobs(tx, tenant, ids) : [];
        if (jobs.length > 32 || new Set(jobs.map(j => j.id)).size !== jobs.length || jobs.some(j => !ids.includes(j.id))) refuse("JOB_BINDING_REFUSED");
        boundJson({ rows: scopedRows.map(r => ({ contract: r.contract, attempt: r.researchRun.mathModelAttempt, ledger: r.agentReview?.ledger ?? null, findings: r.researchRun.findings.map(f => ({ ...f, confidence: Number(f.confidence) })), sources: r.researchRun.sources })), jobs: jobs.map(j => ({ payload: j.payload, result: j.result, outboxPayload: j.outboxEvent?.payload ?? null, commandOutcome: j.outboxEvent?.command.outcome ?? null })) });
        const accepted: ReturnType<typeof retained>[] = [], cases: LrcLoopReadinessCase[] = [];
        for (const caseId of request.caseIds) {
          const row = scopedRows.find(r => r.id === caseId);
          if (!row) { cases.push({ caseId, status: "UNAVAILABLE", reason: "CASE_UNAVAILABLE", retainedJobs: "NOT_ADMITTED" }); continue; }
          try { accepted.push(retained(row, jobs, tenant, request.missionId, verifiedPins.finiteSourcePins)); cases.push({ caseId, status: "ADMITTED", reason: "RETAINED_ADMITTED", retainedJobs: "VERIFIED" }); }
          catch (e) { const reason = e instanceof Refusal ? e.reason : "RETAINED_EVIDENCE_REFUSED"; cases.push({ caseId, status: reason === "LEGACY_NOT_ADMISSIBLE" ? "LEGACY_NOT_ADMISSIBLE" : reason === "RETAINED_INCOMPLETE" ? "MISSING" : "REFUSED", reason, retainedJobs: "NOT_ADMITTED" }); }
        }
        // Never return a partially trusted multi-case task cohort.
        if (cases.some(c => c.status !== "ADMITTED")) return dto({ status: "AUTHENTICATED_READ_ONLY", session: "AUTHORIZED", sources: "VERIFIED_FIXED_37", cases: cases.map(c => c.status === "ADMITTED" ? { ...c, status: "REFUSED", reason: "COHORT_REFUSED", retainedJobs: "NOT_ADMITTED" } : c) });
        if (["runId", "solverJobId", "reviewJobId", "attemptDigest"].some(key => new Set(accepted.map(a => a.binding[key as "runId" | "solverJobId" | "reviewJobId" | "attemptDigest"])).size !== accepted.length)) return dto({ status: "AUTHENTICATED_READ_ONLY", session: "AUTHORIZED", sources: "VERIFIED_FIXED_37", cases: cases.map(c => ({ ...c, status: "REFUSED", reason: "COHORT_REFUSED", retainedJobs: "NOT_ADMITTED" })) });
        try {
          const registry = createLrcLoopHostRegistry({ version: 1, bindings: accepted.map(a => a.binding), associations: [], information: [], relations: [], batch: null });
          const records = accepted.map(a => admitLrcLoopRecord(registry, a.binding.id, a.record));
          const plan = planLrcResearchLoop({ registry, records, information: [], relations: [] });
          return dto({ status: "AUTHENTICATED_READ_ONLY", session: "AUTHORIZED", sources: "VERIFIED_FIXED_37", cases, tasks: plan.tasks });
        } catch { return dto({ status: "AUTHENTICATED_READ_ONLY", session: "AUTHORIZED", sources: "VERIFIED_FIXED_37", cases: cases.map(c => ({ ...c, status: "REFUSED", reason: "RETAINED_EVIDENCE_REFUSED", retainedJobs: "NOT_ADMITTED" })) }); }
      });
    }
  } catch (e) { result = dto({ status: "OPERATIONAL_REFUSED", session: "AUTHORIZED", sources: "NOT_VERIFIED", cases: [], blockers: [e instanceof Refusal ? "INPUT_REFUSED" : "OPERATIONAL_REFUSED"] }); }
  try {
    const current = await principal(request.headers, request.workspaceSlug, request.missionId);
    if (canonicalJson(current) !== canonicalJson(initial)) throw new Error("UNAVAILABLE");
  } catch { return dto({ status: "UNAVAILABLE", session: "UNAVAILABLE", sources: "NOT_VERIFIED", cases: [], blockers: ["ACCESS_UNAVAILABLE"] }); }
  return result ?? dto({ status: "OPERATIONAL_REFUSED", session: "AUTHORIZED", sources: "NOT_VERIFIED", cases: [], blockers: ["OPERATIONAL_REFUSED"] });
}
