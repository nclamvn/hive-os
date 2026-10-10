import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import {
  admitCommittedWork, admitResearchCommitment, commitmentContext, commitmentWorkBinding,
  committedFiniteSurveyPredicate,
  finiteCommitmentClosures, parseResearchCommitmentChoice, projectCommitmentHistory,
  sealResearchCommitment, type ResearchCommitmentBinding,
} from "@/modules/research-sandbox/math-research-commitment";
import type { MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";
import { surveyResidualInterval } from "@/modules/research-sandbox/math-certificates";
import { compareIndependentReplay } from "@/modules/research-sandbox/math-independent-replay";
import { executeMathResearchCycleRound, requestMathResearchCycle, type MathCycleAgents } from "@/modules/research-sandbox/math-cycle-kernel";
import { digestMathPilotContract, resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import * as reviewModule from "@/modules/research-sandbox/agent-review";
import { executeDurableCommand } from "@/modules/command-runtime";
import { requireWorkspaceAuthorization } from "@/modules/authorization";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { createLrcLoopHostRegistry, LRC_LOOP_FIXED_REPRODUCTION_PREDICATE, planLrcResearchLoop } from "@/modules/research-sandbox/math-lrc-research-loop";
import { LRC_METHOD_UNIT_DIGEST } from "@/modules/research-sandbox/math-lrc-method-unit";

const hostMocks = vi.hoisted(() => ({ tx: null as unknown }));
vi.mock("@/server/tenant-context", () => ({ withOrganizationTenant: vi.fn(async (_org, _actor, callback) => callback(hostMocks.tx)) }));
vi.mock("@/modules/authorization", () => ({ requireWorkspaceAuthorization: vi.fn(async () => undefined), organizationIdForWorkspace: vi.fn(async () => "review-org") }));
vi.mock("@/modules/command-runtime", () => ({ executeDurableCommand: vi.fn(async (_ctx, _command, effect) => effect(hostMocks.tx)) }));
// Explicit test-only flag mock; real process flags are false for every command.
vi.mock("@/server/env", () => ({ getEnv: () => ({ RESEARCH_CODEX_LOCAL_ENABLED: true, MATH_PILOT_QUEUE_ENABLED: true }) }));

// Independent reviewer controls. No database, source discovery, provider, native
// worker, private diagnostic capture or scientific experiment is invoked here.
const h = (s: string) => sha256(s);
const clone = <T>(v: T): T => structuredClone(v);
const choice = () => ({ mode: "REPRODUCTION" as const, milestone: "Complete the exact declared root obligation",
  sourceDigest: h("review-source"), obligations: [{ id: "root-obligation", predicate: {
    statement: "For every declared tuple, a witness exists", domain: "positive integer tuples",
    orderedQuantifiers: ["FORALL_TUPLE", "EXISTS_WITNESS"], assumptions: ["exact arithmetic"] },
    scope: "UNIVERSAL" as const, evidence: { kind: "UNIVERSAL_PROOF_UNSUPPORTED" as const },
    operations: ["PLANNER", "PROOF_ATTEMPT", "CRITIC", "ADVERSARY"] as const }],
  maxNoClosure: 2, maxWork: 8, revision: "INITIAL" as const, expectedPreviousDigest: null, reason: "Explicit initial scope" });
const host = (suffix = "1") => ({ organizationId: "review-org", workspaceId: "review-workspace", rootCaseId: "review-root",
  rootContractDigest: h("review-root"), rootReviewDigest: h("review-root-ledger"), cycleId: `review-cycle-${suffix}`,
  commandId: `review-command-${suffix}`, approvedByUserId: "review-human", approvedAt: "2026-10-05T06:00:00.000Z" });
function first(): ResearchCommitmentBinding { return sealResearchCommitment({ choice: choice(), confirmed: true, host: host(), previous: null }); }
function token(binding = first()) { return admitResearchCommitment(binding, host(binding.cycleId.split("-").at(-1))); }
function next(previous: ResearchCommitmentBinding, suffix = "2", revision: "CONTINUE" | "HUMAN_REVISED" = "CONTINUE") {
  return sealResearchCommitment({ choice: { ...choice(), revision, expectedPreviousDigest: previous.commitmentDigest,
    reason: "Explicit chained continuation or revision" }, confirmed: true, host: host(suffix), previous });
}
function workStarted(binding: ResearchCommitmentBinding, round = 1): MathCycleEventPayload {
  return { phase: "COMMITMENT_WORK_STARTED", round, commitmentDigest: binding.commitmentDigest } as MathCycleEventPayload;
}
function rehash(binding: ResearchCommitmentBinding) {
  const { commitmentDigest: _old, ...body } = binding;
  void _old;
  return { ...body, commitmentDigest: sha256(canonicalJson(body)) };
}
function finiteControl(allowReplay = true) {
  const plan = { kind: "ERDOS_STRAUS_RESIDUAL_A" as const, lowerExclusive: 840, upperInclusive: 841, maxA: 3 };
  const c = { ...choice(), obligations: [{ id: "finite-obligation", predicate: committedFiniteSurveyPredicate(plan),
    scope: "FINITE" as const, evidence: { kind: "FINITE_SURVEY_NO_FAILURES" as const, plan },
    operations: allowReplay ? ["PLANNER", "VERIFIER", "FINITE_SURVEY", "INDEPENDENT_REPLAY"] : ["PLANNER", "VERIFIER", "FINITE_SURVEY"] }] };
  const binding = sealResearchCommitment({ choice: c, confirmed: true, host: host(), previous: null }), t = token(binding);
  const evidence = surveyResidualInterval(plan);
  const replay = compareIndependentReplay({ evidence, interval: { scope: plan, primeCount: evidence.primeCount,
    failureCount: evidence.failureCount, failurePrimes: [], firstFailureRescueA: null,
    manifestSha256: h("synthetic-independent-manifest"), productManifestSha256V3: evidence.manifestDigest }, exclusion: null,
    intervalScriptDigest: "4c4cfe9839888720d0a52ce60feb5f6efd69a51fc1bbc72c9d563dad0731fbfe",
    exclusionScriptDigest: null, intervalOutputDigest: h("synthetic-independent-output"), exclusionOutputDigest: null });
  const proposal = { sourceGap: "Exact finite control", hypothesis: "No failure in the exact finite control",
    taskStatement: c.obligations[0].predicate.statement, falsificationPlan: "Find a declared failure",
    successEvidence: "Independent full-plan replay", rationale: "Engineering adapter control, not a discovery",
    exactSurveyPlan: plan, workBinding: clone(commitmentWorkBinding(t, "finite-obligation")) };
  const trace = [{ phase: "COMMITMENT_BOUND", round: 1, binding }, workStarted(binding),
  { phase: "PROPOSED", round: 1, proposal, context: { threadId: "review-planner",
    usage: { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1, reasoningOutputTokens: 0 } } },
  { phase: "VERIFIED", round: 1, accepted: true, reason: "The exact finite control scope is aligned",
    verification: { decision: "ACCEPT", sourceGap: proposal.sourceGap,
      scopeCheck: "The entire explicitly declared finite interval is checked",
      noveltyCheck: "This is a known engineering control, not mathematical novelty",
      falsifiabilityCheck: "Each declared failure is replayed independently",
      unresolvedRisk: "Finite closure never establishes a universal mathematical root" },
    context: { threadId: "review-verifier", usage: { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1, reasoningOutputTokens: 0 } } },
  { phase: "COMPUTED", round: 1, evidence }, { phase: "INDEPENDENT_REPLAY", round: 1, report: replay }] as MathCycleEventPayload[];
  return { t, binding, trace, proposal, evidence, replay };
}
function closedOrRefused(t: ReturnType<typeof token>, trace: MathCycleEventPayload[]) {
  try { return finiteCommitmentClosures(t, trace); } catch { return []; }
}

describe("independent commitment identity and exact work controls", () => {
  it("copies and deeply freezes human-approved semantics", () => {
    const raw = choice(), approved = sealResearchCommitment({ choice: raw, confirmed: true, host: host(), previous: null });
    raw.obligations[0].predicate.statement = "Replaced after approval";
    expect(approved.choice.obligations[0].predicate.statement).not.toBe(raw.obligations[0].predicate.statement);
    expect(Object.isFrozen(approved.choice.obligations[0].predicate.orderedQuantifiers)).toBe(true);
    expect(Object.isFrozen(commitmentContext(token(approved)))).toBe(true);
  });
  it("rejects unconfirmed admission before creating a binding", () => {
    expect(() => sealResearchCommitment({ choice: choice(), confirmed: false, host: host(), previous: null })).toThrow("CONFIRMATION");
  });
  it("rejects a structurally cloned opaque token", () => {
    expect(() => commitmentContext(clone(token()))).toThrow("UNTRUSTED_TOKEN");
  });
  it.each(["organizationId", "workspaceId", "rootCaseId", "rootContractDigest", "rootReviewDigest", "cycleId", "commandId", "approvedByUserId", "approvedAt"] as const)("binds host-owned %s", field => {
    const binding = first(), wrong = { ...host(), [field]: field.endsWith("Digest") ? h("foreign") : field === "approvedAt" ? "2026-10-05T06:01:00.000Z" : "foreign" };
    expect(() => admitResearchCommitment(binding, wrong)).toThrow("HOST_BINDING");
  });
  it.each(["mode", "sourceDigest", "obligationId", "commitmentDigest"] as const)("rejects coherently shaped off-contract work %s", field => {
    const t = token(), raw = clone(commitmentWorkBinding(t, "root-obligation"));
    Object.assign(raw, { [field]: field === "mode" ? "DISCOVERY" : field.endsWith("Digest") ? h("foreign") : "renamed" });
    expect(() => admitCommittedWork(t, raw, "PLANNER")).toThrow();
  });
  it.each(["statement", "domain", "orderedQuantifiers", "assumptions"] as const)("rejects work predicate %s drift", field => {
    const t = token(), raw = clone(commitmentWorkBinding(t, "root-obligation"));
    Object.assign(raw.predicate, { [field]: field === "orderedQuantifiers" ? ["EXISTS_TUPLE", "FORALL_WITNESS"] : field === "assumptions" ? ["unproved source theorem"] : "Narrower local family" });
    expect(() => admitCommittedWork(t, raw, "PLANNER")).toThrow("WORK_REFUSED");
  });
  it("refuses an unapproved operation and unsupported historical tool scope", () => {
    const t = token(), w = commitmentWorkBinding(t, "root-obligation");
    expect(() => admitCommittedWork(t, w, "FINITE_SURVEY")).toThrow();
    expect(() => admitCommittedWork(t, w, "PLANNER", { mixedCoreClaim: "ALL_RESIDUAL_PRIMES_HAVE_NORMALIZED_SINGLE_CORE_RESCUE" })).toThrow("TOOL_SCOPE_UNSUPPORTED");
  });
  it("rejects getters without invoking them", () => {
    let invoked = false;
    const raw = { ...choice() };
    Object.defineProperty(raw, "mode", { enumerable: true, get() { invoked = true; throw new Error("getter invoked"); } });
    expect(() => parseResearchCommitmentChoice(raw)).toThrow("MALFORMED");
    expect(invoked).toBe(false);
  });
  it("rejects sparse arrays, cyclic objects and hostile prototypes", () => {
    const cyclic: Record<string, unknown> = {}; cyclic.self = cyclic;
    for (const raw of [new Array(2 ** 30), cyclic, Object.create({ approved: true })]) expect(() => parseResearchCommitmentChoice(raw)).toThrow();
  });
  it("enforces aggregate byte, depth and node ceilings before schema parsing", () => {
    let deep: unknown = null; for (let i = 0; i < 22; i++) deep = [deep];
    for (const raw of [{ data: "界".repeat(44000) }, deep, Array.from({ length: 10000 }, () => null)])
      expect(() => parseResearchCommitmentChoice(raw)).toThrow("INPUT_CAP");
  });
  it("finite closure refuses a phase getter without invoking it", () => {
    let invoked = false; const event = {};
    Object.defineProperty(event, "phase", { enumerable: true, get() { invoked = true; throw new Error("phase getter invoked"); } });
    expect(() => finiteCommitmentClosures(token(), [event as MathCycleEventPayload])).toThrow(); expect(invoked).toBe(false);
  });
  it.each(["status", "binding", "trace"])("history refuses %s getter without invoking it", field => {
    const one = first(); let invoked = false; const row = { binding: one, trace: [], status: "STOPPED" };
    Object.defineProperty(row, field, { enumerable: true, get() { invoked = true; throw new Error("history getter invoked"); } });
    expect(() => projectCommitmentHistory(token(one), [row])).toThrow(); expect(invoked).toBe(false);
  });
  it("refuses duplicate obligations and assumption wash", () => {
    const raw = choice();
    expect(() => parseResearchCommitmentChoice({ ...raw, obligations: [raw.obligations[0], raw.obligations[0]] })).toThrow();
    raw.obligations[0].predicate.assumptions.push("exact arithmetic");
    expect(() => parseResearchCommitmentChoice(raw)).toThrow();
  });
});

describe("independent durable commitment history controls", () => {
  it("keeps no-closure accounting across renamed cycles and continuation commands", () => {
    const one = first(), two = next(one), three = next(two, "3");
    const out = projectCommitmentHistory(token(three), [
      { binding: one, trace: [workStarted(one)], status: "STOPPED" },
      { binding: two, trace: [workStarted(two)], status: "FAILED" },
    ]);
    expect(out.work).toBe(2); expect(out.noClosure).toBe(2); expect(out.stopped).toBe(true);
    expect(out.reason).toBe("COMMITMENT_NO_CLOSURE_LIMIT");
  });
  it("rejects missing predecessor history rather than resetting it", () => {
    expect(() => projectCommitmentHistory(token(next(first())), [])).toThrow();
  });
  it("rejects omitted middle lineage and duplicate history", () => {
    const one = first(), two = next(one), three = next(two, "3");
    expect(() => projectCommitmentHistory(token(three), [{ binding: two, trace: [], status: "STOPPED" }])).toThrow();
    expect(() => projectCommitmentHistory(token(two), [
      { binding: one, trace: [], status: "STOPPED" }, { binding: one, trace: [], status: "STOPPED" },
    ])).toThrow();
  });
  it("refuses unknown accounting status", () => {
    const one = first();
    expect(() => projectCommitmentHistory(token(one), [{ binding: one, trace: [workStarted(one)], status: "UNOBSERVED" }])).toThrow();
  });
  it("refuses coherent epoch rehash on initial commitment", () => {
    const raw = clone(first()); raw.epochDigest = h("fresh-washed-epoch");
    expect(() => admitResearchCommitment(rehash(raw), host())).toThrow();
  });
  it("refuses semantic revision disguised as ordinary continuation", () => {
    const one = first();
    expect(() => sealResearchCommitment({ choice: { ...choice(), milestone: "Replace global goal with easy local lemma",
      revision: "CONTINUE", expectedPreviousDigest: one.commitmentDigest }, confirmed: true, host: host("2"), previous: one })).toThrow("REVISION_REQUIRED");
  });
  it("explicit host-approved revision retains predecessor but declares a new epoch", () => {
    const one = first(), two = next(one, "2", "HUMAN_REVISED");
    expect(two.choice.expectedPreviousDigest).toBe(one.commitmentDigest); expect(two.epochDigest).not.toBe(one.epochDigest);
    const out = projectCommitmentHistory(token(two), [{ binding: one, trace: [workStarted(one)], status: "STOPPED" }]);
    expect(out.work).toBe(0); expect(out.scientificScope).toBe("OPEN");
  });
  it("rejects cross-root histories and forged work provenance", () => {
    const one = first(), wrong = clone(one); wrong.rootCaseId = "other-root";
    expect(() => projectCommitmentHistory(token(one), [{ binding: rehash(wrong), trace: [], status: "STOPPED" }])).toThrow();
    expect(() => projectCommitmentHistory(token(one), [{ binding: one,
      trace: [{ ...workStarted(one), commitmentDigest: h("foreign") } as MathCycleEventPayload], status: "STOPPED" }])).toThrow();
  });
  it("universal obligation cannot close through finite counters or reviewed prose", () => {
    const t = token();
    expect(finiteCommitmentClosures(t, [])).toEqual([]);
    const one = commitmentContext(t), out = projectCommitmentHistory(t, [{ binding: one, trace: [workStarted(one)], status: "STOPPED" }]);
    expect(out.closedObligationIds).toEqual([]); expect(out.scientificScope).toBe("OPEN"); expect(out.noClosure).toBe(1);
  });
  it.each(["COMPUTED", "INDEPENDENT_REPLAY", "FRONTIER_DOSSIER", "FRONTIER_REVIEWED", "RESEARCH_FRONTIER_BASELINE", "RESEARCH_METHOD_MAP", "STRUCTURAL_PROBED", "MIXED_CORE_EVIDENCE", "PRIOR_COUNTEREXAMPLE_REPLAY", "PRIOR_GATE_DOSSIER", "COUNTEREXAMPLE_REPLAY", "PARAMETRIC_CHECKED", "CERTIFICATE_CHECKED", "PROPOSED", "VERIFIED", "ATTEMPTED", "REVIEWED"])("refuses %s history without prior charged work", phase => {
    const one = first();
    expect(() => projectCommitmentHistory(token(one), [{ binding: one,
      trace: [{ phase, round: 1 } as MathCycleEventPayload], status: "STOPPED" }])).toThrow();
  });
});

describe("independent finite closure alignment controls", () => {
  it("closes one exact approved finite control from the complete canonical positive chain", () => {
    const s = finiteControl(); expect(finiteCommitmentClosures(s.t, s.trace)).toEqual(["finite-obligation"]);
    const out = projectCommitmentHistory(s.t, [{ binding: s.binding, trace: s.trace, status: "STOPPED" }]);
    expect(out.scientificScope).toBe("FINITE_ONLY"); expect(out.noClosure).toBe(0);
  });
  it("retains the original binding marker when a later round closes the obligation", () => {
    const s = finiteControl(), trace = clone(s.trace);
    for (const e of trace) if (e.phase !== "COMMITMENT_BOUND") e.round = 2;
    trace.splice(1, 0, workStarted(s.binding), { phase: "ROUND_CLOSED", round: 1,
      disposition: "INCONCLUSIVE", conclusion: "INCONCLUSIVE", nextGap: "The exact finite obligation remains open" });
    expect(finiteCommitmentClosures(s.t, trace)).toEqual(["finite-obligation"]);
    const out = projectCommitmentHistory(s.t, [{ binding: s.binding, trace, status: "STOPPED" }]);
    expect(out.work).toBe(2); expect(out.closedObligationIds).toEqual(["finite-obligation"]); expect(out.noClosure).toBe(0);
  });
  it("does not close without approving independent replay", () => {
    const s = finiteControl(false); expect(closedOrRefused(s.t, s.trace)).toEqual([]);
  });
  it("does not close when proposal omits its exact survey plan", () => {
    const s = finiteControl(); const proposed = s.trace.find(e => e.phase === "PROPOSED")!;
    if (proposed.phase !== "PROPOSED") throw new Error("fixture scope");
    proposed.proposal.exactSurveyPlan = null;
    expect(closedOrRefused(s.t, s.trace)).toEqual([]);
  });
  it.each(["domain", "orderedQuantifiers", "assumptions"] as const)("does not close coherent replay for changed work %s", field => {
    const s = finiteControl(); s.trace = clone(s.trace); const proposed = s.trace.find(e => e.phase === "PROPOSED")!;
    if (proposed.phase !== "PROPOSED") throw new Error("fixture scope");
    Object.assign(proposed.proposal.workBinding!.predicate, { [field]: field === "domain" ? "all primes" : ["FORALL_ALL_PRIMES"] });
    expect(closedOrRefused(s.t, s.trace)).toEqual([]);
  });
  it.each(["different-round", "duplicate-computation", "replay-before-computation"])("refuses malformed closure trace %s", fault => {
    const s = finiteControl(); let trace = clone(s.trace);
    if (fault === "different-round") trace.find(e => e.phase === "INDEPENDENT_REPLAY")!.round = 2;
    if (fault === "duplicate-computation") trace = [...trace, clone(trace.find(e => e.phase === "COMPUTED")!)];
    if (fault === "replay-before-computation") { const index = trace.findIndex(e => e.phase === "COMPUTED"); [trace[index], trace[index + 1]] = [trace[index + 1], trace[index]]; }
    expect(closedOrRefused(s.t, trace)).toEqual([]);
  });
  it("does not close when the binding marker follows otherwise canonical charged work", () => {
    const s = finiteControl(), trace = clone(s.trace), marker = trace.shift()!;
    trace.splice(1, 0, marker);
    expect(closedOrRefused(s.t, trace)).toEqual([]);
  });
  it("history refuses work charged only after a source tool has already run", () => {
    const one = first();
    expect(() => projectCommitmentHistory(token(one), [{ binding: one, status: "STOPPED", trace: [
      { phase: "FRONTIER_DOSSIER", round: 1 } as MathCycleEventPayload, workStarted(one),
    ] }])).toThrow();
  });
  it.each(["COMMITMENT_BOUND", "COMMITMENT_WORK_STARTED", "VERIFIED", "INDEPENDENT_REPLAY"])("does not close canonical positive after removing %s", phase => {
    const s = finiteControl(); expect(closedOrRefused(s.t, s.trace.filter(e => e.phase !== phase))).toEqual([]);
  });
});

const root = resolveMathPilotContract({ caseType: "OPEN", statement: "For every positive integer tuple, establish the declared structural witness criterion.",
  definitions: "All tuple coordinates are positive integers and the witness criterion is explicitly stated.",
  assumptions: "Only exact integer arithmetic is assumed.", falsificationCriterion: "An exactly checked counterexample meeting all premises.",
  successCriterion: "A general proof retaining every quantifier is required.", exclusions: "Finite checks and model votes do not establish the universal theorem." });
const rootDigest = digestMathPilotContract(root), gap = "The declared structural witness criterion lacks a general proof.";
const ctx = { user: { id: "review-human" }, workspace: { id: "review-workspace", slug: "review-workspace" } } as WorkspaceContext;
function kernelFixture(maxNoClosure = 2) {
  const c = { ...choice(), maxNoClosure, obligations: [{ ...choice().obligations[0],
    operations: ["PLANNER", "SOURCE_REVIEW", "VERIFIER", "PROOF_ATTEMPT", "CRITIC", "ADVERSARY"] }] };
  const binding = sealResearchCommitment({ choice: c, confirmed: true, host: { ...host(), rootContractDigest: rootDigest }, previous: null });
  const events: Array<{ sequence: number; round: number; phase: string; payload: MathCycleEventPayload; previousDigest: string | null; digest: string }> = [];
  const effects: unknown[] = [], outbox: unknown[] = [];
  const cycle: Record<string, unknown> = { id: binding.cycleId, organizationId: binding.organizationId, workspaceId: binding.workspaceId,
    missionId: "review-mission", rootCaseId: binding.rootCaseId, rootContractDigest: rootDigest, rootReviewDigest: binding.rootReviewDigest,
    rootAttemptDigest: h("root-attempt"), commandId: binding.commandId, status: "QUEUED", completedRounds: 0, callsStarted: 0,
    observedTokens: 0, maxRounds: 2, maxCalls: 14, maxObservedTokens: 60000, deadlineAt: new Date(Date.now() + 3000000),
    command: { outcome: { cycleId: binding.cycleId, commitment: binding } } };
  const job: Record<string, unknown> = { id: "review-job", organizationId: "review-org", workspaceId: "review-workspace", attempts: 1,
    status: "RUNNING", lockedBy: "review-worker", version: 1, leaseExpiresAt: new Date(Date.now() + 300000),
    payload: { cycleId: binding.cycleId, round: 1, commitment: binding } };
  const update = (row: Record<string, unknown>, data: Record<string, unknown>) => {
    effects.push(data);
    for (const [k, v] of Object.entries(data)) row[k] = v && typeof v === "object" && "increment" in v ? Number(row[k]) + Number(v.increment) : v;
    return row;
  };
  const rootAttempt = { providerName: "codex-local", modelName: "gpt-6-sol", threadId: "retained-root-solver", attemptType: "INCONCLUSIVE",
    argument: "The retained root proof obligation is still unresolved.", candidateCounterexample: null, selfChecks: [], limitations: [],
    usage: { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1, reasoningOutputTokens: 0 } };
  const tx = {
    $queryRaw: vi.fn(async () => [{ locked: 1 }]),
    mathPilotCase: { findFirst: vi.fn(async () => ({ id: binding.rootCaseId, workspaceId: binding.workspaceId, missionId: "review-mission",
      contract: root, contractDigest: rootDigest, researchRun: { mathModelAttempt: rootAttempt, mathModelAttemptDigest: h("root-attempt"),
        providerName: "codex-local", modelName: "gpt-6-sol", status: "AWAITING_REVIEW", sources: [], findings: [] },
      agentReview: { ledgerDigest: binding.rootReviewDigest } })) },
    mathResearchCycle: { findFirst: vi.fn(async () => null), findFirstOrThrow: vi.fn(async () => cycle),
      findMany: vi.fn(async ({ where }: { where: { id?: unknown; rootCaseId?: unknown } }) => where.id || typeof where.rootCaseId === "object" ? [] : [{ ...cycle, events }]),
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => { effects.push(data); return data; }),
      update: vi.fn(async ({ data }: { data: Record<string, unknown> }) => update(cycle, data)) },
    mathResearchCycleEvent: { findMany: vi.fn(async () => [...events]),
      findFirst: vi.fn(async ({ where }: { where: { phase?: string; round?: number } }) => events.filter(e => (!where.phase || e.phase === where.phase) && (!where.round || e.round === where.round)).at(-1) ?? null),
      create: vi.fn(async ({ data }: { data: typeof events[number] }) => { events.push(data); effects.push(data); return data; }) },
    durableJob: { findFirst: vi.fn(async () => job), update: vi.fn(async ({ data }: { data: Record<string, unknown> }) => update(job, data)) },
    durableJobEvent: { create: vi.fn(async ({ data }: { data: unknown }) => { effects.push(data); return data; }) },
    outboxEvent: { create: vi.fn(async ({ data }: { data: unknown }) => { outbox.push(data); return data; }) },
  };
  hostMocks.tx = tx;
  vi.spyOn(reviewModule, "validateRecordedMathAgentReview").mockReturnValue({ reports: [{ unresolvedGap: gap }, { unresolvedGap: gap }] } as never);
  const agents: MathCycleAgents = { modelName: "gpt-6-sol",
    propose: vi.fn(async () => ({ output: { sourceGap: gap, hypothesis: "A declared exact structural mechanism remains to be established.",
      taskStatement: binding.choice.obligations[0].predicate.statement, falsificationPlan: "Check all premises of any claimed counterexample.",
      successEvidence: "Complete proof preserving every declared quantifier.", rationale: "This is an admitted engineering guard control, not an actual mathematical discovery.",
      workBinding: commitmentWorkBinding(admitResearchCommitment(binding, {}), "root-obligation"), exactSurveyPlan: null, structuralProbePlan: null },
      threadId: "review-planner", usage: rootAttempt.usage })),
    buildFrontierDossier: vi.fn(async () => { throw new Error("review source boundary should not be called for refused work"); }),
    assessFrontier: vi.fn(async () => { throw new Error("review model boundary"); }),
    verify: vi.fn(async () => { throw new Error("review model boundary"); }),
    solve: vi.fn(async () => { throw new Error("review model boundary"); }),
    reviewRole: vi.fn(async () => { throw new Error("review model boundary"); }),
  };
  const execute = () => executeMathResearchCycleRound({ organizationId: "review-org", actorUserId: "review-human", workerId: "review-worker",
    jobId: "review-job", expectedVersion: 1, agents });
  return { tx, binding, cycle, job, events, effects, outbox, agents, execute, c };
}
function admitPositiveModels(s: ReturnType<typeof kernelFixture>) {
  const usage = { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1, reasoningOutputTokens: 0 };
  const content = "The structural criterion is a declared research obligation; this fixture does not establish its general proof.";
  const body = { coverage: "PARTIAL_NOT_NOVELTY_CERTIFICATE" as const, sources: [{ id: "review-primary-source",
    canonicalUri: "https://example.org/review/primary", title: "Explicit offline engineering source fixture", authors: "Fixture only",
    publicationYear: 2025, version: "v1", captureMethod: "CURATED_PRIMARY_EXCERPT" as const, scope: "ROOT_DOMAIN" as const,
    content, contentDigest: sha256(content), exactQuote: content, startOffset: 0, endOffset: content.length }],
    discovery: { provider: "CROSSREF" as const, query: "offline reviewer source fixture", status: "COMPLETE" as const, candidates: [] } };
  vi.mocked(s.agents.buildFrontierDossier).mockResolvedValue({ ...body, dossierDigest: sha256(canonicalJson(body)) });
  vi.mocked(s.agents.assessFrontier).mockImplementation(async role => ({ output: { sourceIds: ["review-primary-source"], relevance: "RELEVANT",
    quantifiers: "MATCH", overlap: "NOT_SHOWN_IN_CAPTURED_SOURCES", explanation: "The engineering source fixture does not provide the declared general proof." },
    threadId: `review-${role}`, usage }));
  vi.mocked(s.agents.verify).mockImplementation(async (_root, _gaps, _prior, proposal) => ({ output: { decision: "ACCEPT", sourceGap: proposal.sourceGap,
    scopeCheck: "All declared scope fields and exact committed predicates remain bound.", noveltyCheck: "This engineering fixture claims no mathematical novelty.",
    falsifiabilityCheck: "A counterexample must meet each exact premise and quantifier.", unresolvedRisk: "The universal proof is still unsupported by this closure adapter." },
    threadId: "review-verifier", usage }));
  const attempt = { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "review-solver", attemptType: "INCONCLUSIVE" as const,
    argument: "This admitted engineering round does not establish the universal proof obligation.", candidateCounterexample: null,
    selfChecks: [], limitations: [], usage };
  vi.mocked(s.agents.solve).mockResolvedValue(attempt);
  vi.mocked(s.agents.reviewRole).mockImplementation(async role => ({ role, verdict: "INCONCLUSIVE", candidateConclusion: "INCONCLUSIVE",
    exactQuote: attempt.argument, reasoning: "The universal obligation remains open; no finite count or model vote discharges it.",
    checks: ["Keep all declared quantifiers and refuse automatic proof promotion."], unresolvedGap: "The declared universal proof still requires independent exact verification.",
    threadId: `review-${role}`, usage }));
}
describe("independent real request and worker refusal seams", () => {
  beforeEach(() => { vi.clearAllMocks(); vi.restoreAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });
  it.each([undefined, { choice: choice(), confirmed: false }])("missing/unconfirmed request has zero command side effects", async commitment => {
    await expect(requestMathResearchCycle(ctx, { caseId: "review-root", maxRounds: 1, maxObservedTokens: 10000, commitment })).rejects.toThrow("confirmation");
    expect(executeDurableCommand).not.toHaveBeenCalled();
  });
  it("authorization failure cannot create a commitment command", async () => {
    vi.mocked(requireWorkspaceAuthorization).mockRejectedValueOnce(new Error("review denied"));
    await expect(requestMathResearchCycle(ctx, { caseId: "review-root", maxRounds: 1, maxObservedTokens: 10000,
      commitment: { choice: choice(), confirmed: true } })).rejects.toThrow("review denied");
    expect(executeDurableCommand).not.toHaveBeenCalled();
  });
  it("authenticated initial request persists exactly one host-bound commitment and outbox", async () => {
    const s = kernelFixture(); s.tx.mathResearchCycle.findMany.mockResolvedValueOnce([]);
    const result = await requestMathResearchCycle(ctx, { caseId: "review-root", maxRounds: 1, maxObservedTokens: 10000,
      commitment: { choice: s.c, confirmed: true } }) as unknown as { outcome: { commitment: ResearchCommitmentBinding }; outbox: Array<{ payload: { commitment: ResearchCommitmentBinding } }> };
    expect(result.outcome.commitment.approvedByUserId).toBe(ctx.user.id);
    expect(result.outcome.commitment.rootContractDigest).toBe(rootDigest);
    expect(result.outcome.commitment.choice.revision).toBe("INITIAL"); expect(result.outcome.commitment.choice.expectedPreviousDigest).toBeNull();
    expect(result.outbox).toHaveLength(1); expect(result.outbox[0].payload.commitment).toEqual(result.outcome.commitment);
    expect(s.tx.mathResearchCycle.create).toHaveBeenCalledTimes(1);
    expect(s.agents.propose).not.toHaveBeenCalled(); expect(s.agents.buildFrontierDossier).not.toHaveBeenCalled();
  });
  it("authenticated strategic revision refuses stale predecessor without creating a cycle", async () => {
    const s = kernelFixture(); s.cycle.status = "STOPPED";
    await expect(requestMathResearchCycle(ctx, { caseId: "review-root", maxRounds: 1, maxObservedTokens: 10000,
      commitment: { choice: { ...s.c, revision: "HUMAN_REVISED", expectedPreviousDigest: h("stale-predecessor"), reason: "Explicit change" }, confirmed: true } })).rejects.toThrow();
    expect(s.tx.mathResearchCycle.create).not.toHaveBeenCalled(); expect(s.outbox).toEqual([]);
  });
  it("authenticated strategic revision with exact predecessor declares a new epoch", async () => {
    const s = kernelFixture(); s.cycle.status = "STOPPED";
    const result = await requestMathResearchCycle(ctx, { caseId: "review-root", maxRounds: 1, maxObservedTokens: 10000,
      commitment: { choice: { ...s.c, revision: "HUMAN_REVISED", expectedPreviousDigest: s.binding.commitmentDigest, reason: "Explicit new bounded strategy" }, confirmed: true } }) as unknown as { outcome: { commitment: ResearchCommitmentBinding } };
    expect(result.outcome.commitment.choice.expectedPreviousDigest).toBe(s.binding.commitmentDigest);
    expect(result.outcome.commitment.epochDigest).not.toBe(s.binding.epochDigest);
    expect(result.outcome.commitment.approvedByUserId).toBe(ctx.user.id); expect(s.tx.mathResearchCycle.create).toHaveBeenCalledTimes(1);
  });
  it.each(["QUEUED", "RUNNING", "FAILED"])("human revision refuses unresolved %s conflict", async status => {
    const s = kernelFixture(); s.tx.mathResearchCycle.findFirst.mockResolvedValueOnce({ ...s.cycle, status } as never);
    await expect(requestMathResearchCycle(ctx, { caseId: "review-root", maxRounds: 1, maxObservedTokens: 10000,
      commitment: { choice: { ...s.c, revision: "HUMAN_REVISED", expectedPreviousDigest: s.binding.commitmentDigest, reason: "Explicit change" }, confirmed: true } })).rejects.toThrow("blocks this request");
    expect(s.tx.mathResearchCycle.create).not.toHaveBeenCalled(); expect(s.outbox).toEqual([]);
  });
  it("legacy executable command without commitment refuses before any retained event, tool or model", async () => {
    const s = kernelFixture(); s.cycle.command = { outcome: {} };
    await expect(s.execute()).rejects.toThrow("lacks research commitment");
    expect(s.effects).toEqual([]); expect(s.events).toEqual([]); expect(s.outbox).toEqual([]);
    for (const fn of [s.agents.propose, s.agents.buildFrontierDossier, s.agents.verify, s.agents.solve]) expect(fn).not.toHaveBeenCalled();
  });
  it("coherently rehashed foreign outbox refuses before tools/models", async () => {
    const s = kernelFixture(), changed = clone(s.binding); changed.choice.mode = "DISCOVERY";
    s.job.payload = { cycleId: s.binding.cycleId, round: 1, commitment: rehash(changed) };
    await expect(s.execute()).rejects.toThrow(); expect(s.effects).toEqual([]); expect(s.outbox).toEqual([]);
    expect(s.agents.propose).not.toHaveBeenCalled(); expect(s.agents.buildFrontierDossier).not.toHaveBeenCalled();
  });
  it("malformed complete history refuses before planner/tool admission", async () => {
    const s = kernelFixture(); s.tx.mathResearchCycle.findMany.mockResolvedValueOnce(Array.from({ length: 33 }, () => ({ ...s.cycle, events: [] })));
    await expect(s.execute()).rejects.toThrow("overflow"); expect(s.effects).toEqual([]); expect(s.outbox).toEqual([]);
    expect(s.agents.propose).not.toHaveBeenCalled(); expect(s.agents.buildFrontierDossier).not.toHaveBeenCalled();
  });
  it("off-contract model proposal cannot reach source/tool/verifier/solver or next outbox", async () => {
    const s = kernelFixture(); const original = s.agents.propose;
    s.agents.propose = vi.fn(async (...args: Parameters<MathCycleAgents["propose"]>) => { const result = await original(...args); return { ...result,
      output: { ...result.output, workBinding: { ...result.output.workBinding!, mode: "DISCOVERY" as const } } }; });
    await expect(s.execute()).rejects.toThrow("WORK_REFUSED"); expect(s.agents.propose).toHaveBeenCalledTimes(1);
    for (const fn of [s.agents.buildFrontierDossier, s.agents.verify, s.agents.solve, s.agents.reviewRole]) expect(fn).not.toHaveBeenCalled();
    expect(s.outbox).toEqual([]);
  });
  it("admitted non-ES round reaches all seven guarded roles without scientific closure", async () => {
    const s = kernelFixture(); admitPositiveModels(s); await s.execute();
    expect(s.agents.propose).toHaveBeenCalledTimes(1); expect(s.agents.buildFrontierDossier).toHaveBeenCalledTimes(1);
    expect(s.agents.assessFrontier).toHaveBeenCalledTimes(2); expect(s.agents.verify).toHaveBeenCalledTimes(1);
    expect(s.agents.solve).toHaveBeenCalledTimes(1); expect(s.agents.reviewRole).toHaveBeenCalledTimes(2);
    expect(s.events.filter(e => e.phase === "CALL_STARTED")).toHaveLength(7);
    expect(s.outbox).toHaveLength(1);
    expect((s.outbox[0] as { payload: { commitment: unknown } }).payload.commitment).toEqual(s.binding);
    const state = projectCommitmentHistory(admitResearchCommitment(s.binding, { ...host(), rootContractDigest: rootDigest }), [{ binding: s.binding, trace: s.events.map(e => e.payload), status: "QUEUED" }]);
    expect(state.scientificScope).toBe("OPEN"); expect(state.closedObligationIds).toEqual([]); expect(state.noClosure).toBe(1);
  });
  it("no-closure stop wins over a new gap and suppresses the next outbox", async () => {
    const s = kernelFixture(1); admitPositiveModels(s); const result = await s.execute();
    expect(s.agents.reviewRole).toHaveBeenCalledTimes(2); expect(result).toEqual({ stopReason: "COMMITMENT_NO_CLOSURE_LIMIT" });
    expect(s.cycle.status).toBe("STOPPED"); expect(s.outbox).toEqual([]);
  });
});

function offlineLrcFixture(batchId = "review-lrc-batch") {
  const usage = { roleCalls: 3, inputTokens: 3, outputTokens: 3, wallMs: 1, toolCalls: 1, checkerCalls: 1, primeChecks: 1,
    invocation: { roleWallMs: 1, inputBytes: 1, streamBytes: 1, finiteBytes: 1, integerBits: 1, checkerMs: 1, checkerOperations: 1, primes: [3] } };
  const raw = { version: 1, bindings: [], associations: [], information: [], relations: [], batch: { id: batchId, sealed: true,
    currentCandidateId: "candidate", cap: { experiments: 2, roleCalls: 6, inputTokens: 6, outputTokens: 6, wallMs: 2, toolCalls: 2, checkerCalls: 2, primeChecks: 2 },
    candidates: [{ id: "candidate", predicate: clone(LRC_LOOP_FIXED_REPRODUCTION_PREDICATE), targetedObligationId: "FEW_EXCEPTION_SHIFT_14",
      mode: "REPRODUCTION", eligible: true, requiredUsage: usage, discovery: null }], experiments: [] } };
  const c = { ...choice(), sourceDigest: LRC_METHOD_UNIT_DIGEST, obligations: [{ id: "FEW_EXCEPTION_SHIFT_14",
    predicate: clone(LRC_LOOP_FIXED_REPRODUCTION_PREDICATE), scope: "UNIVERSAL", evidence: { kind: "UNIVERSAL_PROOF_UNSUPPORTED" }, operations: ["LRC_OFFLINE_PLANNING"] }] };
  const lh = { ...host(), rootCaseId: "ROOT_LRC_14_MOVING_15_TOTAL", rootContractDigest: LRC_METHOD_UNIT_DIGEST, cycleId: batchId };
  const binding = sealResearchCommitment({ choice: c, confirmed: true, host: lh, previous: null });
  return { raw, c, lh, binding, registry: createLrcLoopHostRegistry(raw), commitment: admitResearchCommitment(binding, lh) };
}
describe("independent existing LRC offline planner guard", () => {
  it("missing commitment blocks next candidate while passive batch-null remains readable", () => {
    const s = offlineLrcFixture(), guarded = planLrcResearchLoop({ registry: s.registry, records: [] });
    expect(guarded.nextCandidateId).toBeNull(); expect(guarded.decision).toBe("STOP_HARD"); expect(guarded.dispatchAllowed).toBe(false);
    const passive = planLrcResearchLoop({ registry: createLrcLoopHostRegistry({ ...s.raw, batch: null }), records: [] });
    expect(passive.decision).toBe("PLANNING_ONLY"); expect(passive.commitmentStatus).toBe("PASSIVE_DIAGNOSTIC");
  });
  it("exact initial offline scope can plan but never receives execution authority", () => {
    const s = offlineLrcFixture(), out = planLrcResearchLoop({ registry: s.registry, records: [], commitment: s.commitment });
    expect(out.decision).toBe("CONTINUE"); expect(out.nextCandidateId).toBe("candidate"); expect(out.dispatchAllowed).toBe(false);
    expect(out.proofClosure).toBe(false); expect(out.globalLrc).toBe("NOT_ESTABLISHED");
  });
  it("renamed batch with copied initial commitment cannot wash its identity", () => {
    const s = offlineLrcFixture(), other = offlineLrcFixture("renamed-lrc-batch");
    const out = planLrcResearchLoop({ registry: other.registry, records: [], commitment: s.commitment });
    expect(out.nextCandidateId).toBeNull(); expect(out.decision).toBe("STOP_HARD");
  });
  it("new batch in the same epoch refuses unsupported durable offline history", () => {
    const s = offlineLrcFixture(), other = offlineLrcFixture("continued-lrc-batch");
    const b = sealResearchCommitment({ choice: { ...s.c, revision: "CONTINUE", expectedPreviousDigest: s.binding.commitmentDigest },
      confirmed: true, host: { ...other.lh, commandId: "continued-lrc-command" }, previous: s.binding });
    const out = planLrcResearchLoop({ registry: other.registry, records: [], commitment: admitResearchCommitment(b, {}) });
    expect(out.commitmentStatus).toBe("COMMITMENT_LRC_DURABLE_HISTORY_UNSUPPORTED"); expect(out.nextCandidateId).toBeNull(); expect(out.dispatchAllowed).toBe(false);
  });
  it("cloned offline guard cannot authorize planning", () => {
    const s = offlineLrcFixture(), out = planLrcResearchLoop({ registry: s.registry, records: [], commitment: clone(s.commitment) });
    expect(out.nextCandidateId).toBeNull(); expect(out.dispatchAllowed).toBe(false);
  });
});
