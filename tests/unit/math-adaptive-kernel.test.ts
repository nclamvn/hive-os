import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { digestMathPilotContract, resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { executeMathResearchCycleRound, validateMathCycleTrace, type MathCycleAgents } from "@/modules/research-sandbox/math-cycle-kernel";
import { mathCycleEventDigest, type MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";
import { runMixedCoreAgentEvidence, type MixedCoreAgentEvidence } from "@/modules/research-sandbox/math-mixed-core-agent";
import * as mixedModule from "@/modules/research-sandbox/math-mixed-core-agent";
import * as reviewModule from "@/modules/research-sandbox/agent-review";
import type { AdaptivePolicy, AdaptiveResearchContext } from "@/modules/research-sandbox/math-adaptive-strategy";
import type { FrontierDossier } from "@/modules/research-sandbox/math-frontier";
import * as methodModule from "@/modules/research-sandbox/math-method-map";
import { lemmaDraft } from "../fixtures/math-lemma-graph";
import { sealMathPortfolio } from "@/modules/research-sandbox/math-portfolio";

// Real cycle composition with only tenant/database and model-result boundaries
// replaced. No live database, provider, worker process, or source network calls.
vi.mock("@/server/tenant-context", () => ({ withOrganizationTenant: vi.fn(async (_org, _actor, callback) => callback(tx)) }));
vi.mock("@/modules/research-sandbox/math-method-map", async (original) => {
  const actual = await original<typeof import("@/modules/research-sandbox/math-method-map")>();
  return { ...actual, buildResearchMethodPacket: (root: Parameters<typeof actual.buildResearchMethodPacket>[0], digest: string) =>
    actual.buildResearchMethodPacket(root, digest, { statusLoader: async () => { throw new Error("offline fixed fixture"); } }) };
});
const root = resolveMathPilotContract({ caseType: "OPEN", statement: "For every prime p ≡ 1 (mod 840), does 4/p = 1/x + 1/y + 1/z hold?",
  definitions: "p is prime and x, y, z are strictly positive integers.", assumptions: "Exact arithmetic applies.",
  falsificationCriterion: "A checked counterexample is required.", successCriterion: "A general proof is required.",
  exclusions: "Finite computation is not a universal proof." });
const rootDigest = digestMathPilotContract(root), reviewDigest = "a".repeat(64), attemptDigest = "b".repeat(64);
const gap = "The residual prime domain lacks a general support bridge.";
const policy: AdaptivePolicy = { policyId: "ADAPTIVE_RESEARCH_V1", cycleId: "00000000-0000-4000-8000-000000000034",
  rootContractDigest: rootDigest, rootReviewDigest: reviewDigest };
const usage = { inputTokens: 5, cachedInputTokens: 0, outputTokens: 2, reasoningOutputTokens: 0 };
const attempt = { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "root-solver", attemptType: "INCONCLUSIVE" as const,
  argument: "The structural bridge remains unproved in this scoped attempt.", candidateCounterexample: null, selfChecks: [], limitations: [], usage };
const sourceText = "The residual prime question needs an exact structural bridge, not a finite count.";
const dossierBody = { coverage: "PARTIAL_NOT_NOVELTY_CERTIFICATE" as const, sources: [{ id: "composition-source",
  canonicalUri: "https://example.org/primary/structural-bridge", title: "Structural bridge background", authors: "Fixture author",
  publicationYear: 2025, version: "v1", captureMethod: "CURATED_PRIMARY_EXCERPT" as const, scope: "ROOT_DOMAIN" as const,
  content: sourceText, contentDigest: sha256(sourceText), exactQuote: sourceText, startOffset: 0, endOffset: sourceText.length }],
  discovery: { provider: "CROSSREF" as const, query: "residual prime structural bridge", status: "COMPLETE" as const, candidates: [] } };
const dossier: FrontierDossier = { ...dossierBody, dossierDigest: sha256(canonicalJson(dossierBody)) };
const proposal = { sourceGap: gap, hypothesis: "A target-sensitive support partition may bridge the residual prime domain.",
  taskStatement: "Derive a target-sensitive partition for every prime p congruent to 1 modulo 840.",
  falsificationPlan: "Check whether an exact normalized pair violates the proposed partition.",
  successEvidence: "A complete derivation preserving every premise and quantifier.",
  rationale: "This attacks the structural support obstruction instead of collecting more counts.",
  exactSurveyPlan: null, structuralProbePlan: null };
const branch = { strategy: "STRUCTURAL_LEMMA" as const, proposal,
  anticipatedFalsifier: "A normalized pair meets every premise but violates the proposed partition.",
  expectedInformationGain: "HIGH" as const, toolNeeds: ["SOURCE_REVIEW" as const], methodId: "SUPPORT_UNIFORM_BRIDGE" as const,
  methodFamily: "GLOBAL_BRIDGE" as const, rootContribution: { kind: "ROOT_BRIDGE" as const, statement: "Remove a target-sensitive root bottleneck without assuming finite counts suffice." },
  applicabilityAssumptions: "All normalized parameters are positive and prime quantifiers remain intact.",
  discriminatingExperiment: { question: "Does the exact support partition remove the residual prime obstruction?",
    supportOutcome: "Seek independent proof checking before any theorem certification.",
    refutationOutcome: "Abandon the exact partition and choose a different method family.",
    inconclusiveOutcome: "Retain the missing estimate and route to a distinct local obstruction." },
  requiredTools: ["PROOF_ATTEMPT" as const], evaluationScope: "UNVALIDATED_RESEARCH" as const };
type Event = { sequence: number; round: number; phase: string; payload: MathCycleEventPayload; previousDigest: string | null; digest: string };
let events: Event[] = [], cycle: Record<string, unknown>, job: Record<string, unknown>, evidence: MixedCoreAgentEvidence;
let priorCycles: unknown[] = [], outbox: unknown[] = [];
function updateRecord(record: Record<string, unknown>, data: Record<string, unknown>) {
  for (const [key, value] of Object.entries(data)) record[key] = value && typeof value === "object" && "increment" in value
    ? Number(record[key]) + Number(value.increment) : value;
  return record;
}
const tx = {
  $queryRaw: vi.fn(async () => [{ locked: 1 }]),
  durableJob: { findFirst: vi.fn(async () => job), update: vi.fn(async ({ data }) => updateRecord(job, data)) },
  durableJobEvent: { create: vi.fn(async () => ({})) },
  outboxEvent: { create: vi.fn(async ({ data }) => { outbox.push(data); return data; }) },
  mathResearchCycle: { findFirstOrThrow: vi.fn(async () => cycle), findMany: vi.fn(async ({ where }) => where.rootCaseId?.not ? [] : priorCycles),
    update: vi.fn(async ({ data }) => updateRecord(cycle, data)) },
  mathResearchCycleEvent: { findMany: vi.fn(async () => [...events]),
    findFirst: vi.fn(async ({ where }) => events.filter((event) => (!where.phase || event.phase === where.phase) &&
      (!where.round || event.round === where.round)).at(-1) ?? null),
    create: vi.fn(async ({ data }) => { events.push(data); return data; }) },
  mathPilotCase: { findFirst: vi.fn(async () => ({ id: "root-case", workspaceId: "workspace", contract: root, contractDigest: rootDigest,
    researchRun: { mathModelAttempt: attempt, mathModelAttemptDigest: attemptDigest, providerName: "codex-local", modelName: "gpt-6-sol",
      status: "AWAITING_REVIEW", sources: [], findings: [] }, agentReview: { ledgerDigest: reviewDigest } })) },
};
beforeAll(async () => { evidence = await runMixedCoreAgentEvidence(rootDigest, "MIXED_CORE_REPLAY_V3"); }, 45_000);
beforeEach(() => {
  vi.restoreAllMocks(); events = []; priorCycles = []; outbox = [];
  cycle = { id: policy.cycleId, organizationId: "org", workspaceId: "workspace", missionId: "mission", rootCaseId: "root-case",
    rootContractDigest: rootDigest, rootReviewDigest: reviewDigest, rootAttemptDigest: attemptDigest, commandId: "command",
    status: "QUEUED", completedRounds: 0, maxRounds: 2, maxCalls: 14, callsStarted: 0, observedTokens: 0,
    maxObservedTokens: 60_000, deadlineAt: new Date(Date.now() + 3_000_000), command: { outcome: { strategyPolicy: policy } } };
  job = { id: "claimed-job", workspaceId: "workspace", attempts: 1, status: "RUNNING", payload: { cycleId: policy.cycleId, round: 1, strategyPolicy: policy } };
  vi.spyOn(reviewModule, "validateRecordedMathAgentReview").mockReturnValue({ reports: [{ unresolvedGap: gap }, { unresolvedGap: gap }] } as never);
  vi.spyOn(mixedModule, "runMixedCoreAgentEvidence").mockResolvedValue(evidence);
});
function agents() {
  const seen: { role: string; strategy: AdaptiveResearchContext }[] = [];
  const capture = (role: string, strategy?: AdaptiveResearchContext | null) => {
    expect(strategy?.packet.rootDigest).toBe(rootDigest);
    expect(events.findIndex((event) => event.phase === "RESEARCH_METHOD_MAP")).toBeLessThan(
      events.findIndex((event) => event.phase === "CALL_STARTED"));
    seen.push({ role, strategy: strategy! });
  };
  let round = 0;
  const result: MathCycleAgents = { modelName: "gpt-6-sol",
    proposePortfolio: vi.fn(async (_root, gaps, _tasks, _art, _findings, _gate, _obligations, _mixed, strategy) => {
      capture("PLANNER", strategy); expect(gaps).toContain(gap); round += 1;
      return { output: { version: 2, branches: [branch, { ...branch, methodId: "TAO_LOCAL_OBSTRUCTION", methodFamily: "LOCAL_OBSTRUCTION",
        rootContribution: { kind: "STRUCTURAL_REDUCTION", statement: "A different local obstruction tests the missing premise independently." },
        proposal: { ...proposal, hypothesis: "A distinct local obstruction may separate survivors in the sealed prime domain.",
          taskStatement: "Derive a different local obstruction criterion for every prime p congruent to 1 modulo 840." } }] },
      threadId: "composition-planner", usage };
    }),
    propose: vi.fn(async () => { throw new Error("immutable portfolio must be reused"); }),
    buildFrontierDossier: vi.fn(async () => dossier),
    assessFrontier: vi.fn(async (role, _root, _proposal, _dossier, _mixed, strategy) => {
      capture(role, strategy); return { output: { sourceIds: ["composition-source"], relevance: "RELEVANT" as const, quantifiers: "MATCH" as const,
        overlap: "NOT_SHOWN_IN_CAPTURED_SOURCES" as const, explanation: "The captured background does not establish the proposed universal partition." },
      threadId: `${role}-${job.payload && (job.payload as { round: number }).round}`, usage };
    }),
    verify: vi.fn(async (_root, _gaps, _tasks, proposal, _art, _steer, _findings, _assessments, _gate, _probe, _obligations, _mixed, strategy) => {
      capture("VERIFIER", strategy); return { output: { decision: "ACCEPT" as const, sourceGap: proposal.sourceGap,
        scopeCheck: "The prime domain and all positive parameters are retained.", noveltyCheck: "A partial source catalog cannot establish novelty.",
        falsifiabilityCheck: "The partition has a precisely stated finite counterexample criterion.", unresolvedRisk: "A symbolic attempt is not a checked universal theorem." },
      threadId: `verifier-${(job.payload as { round: number }).round}`, usage };
    }),
    solve: vi.fn(async (_root, _computation, _replay, _gate, _mixed, strategy) => {
      capture("SOLVER", strategy); round = (job.payload as { round: number }).round;
      return { ...attempt, threadId: `solver-${round}` };
    }),
    reviewRole: vi.fn(async (role, _root, attempt, _computation, _replay, _counterexample, _gate, _mixed, strategy) => {
      capture(role, strategy); return { role, verdict: "INCONCLUSIVE" as const, candidateConclusion: "INCONCLUSIVE" as const, exactQuote: attempt.argument,
        reasoning: "The symbolic bridge has no complete derivation yet; source status does not fix the mathematical gap.",
        checks: ["Check each structural assumption rather than assuming source health is proof."], unresolvedGap: null,
        threadId: `${role}-${round}`, usage };
    }) };
  return { result, seen };
}
async function execute(result: MathCycleAgents) { return executeMathResearchCycleRound({ organizationId: "org", actorUserId: "actor",
  workerId: "worker", jobId: "claimed-job", expectedVersion: 1, agents: result }); }

describe("TIP074 historical adaptive execution is not a live commitment grant", () => {
  it.each([
    "historical default job", "historical V2 graph portfolio", "outbox policy mismatch",
  ])("%s cannot newly dispatch without an authenticated commitment", async scenario => {
    if (scenario.includes("V2")) {
      const graphPolicy = { ...policy, policyId: "ADAPTIVE_RESEARCH_V2" };
      cycle.command = { outcome: { strategyPolicy: graphPolicy } };
      job.payload = { cycleId: policy.cycleId, round: 1, strategyPolicy: graphPolicy };
    }
    if (scenario === "outbox policy mismatch") job.payload = { cycleId: policy.cycleId, round: 1,
      strategyPolicy: { ...policy, rootReviewDigest: "f".repeat(64) } };
    const { result } = agents();
    await expect(execute(result)).rejects.toMatchObject({ code: "INTEGRITY_FAILURE" });
    for (const fn of [result.proposePortfolio, result.buildFrontierDossier, result.assessFrontier,
      result.verify, result.solve, result.reviewRole]) expect(fn).not.toHaveBeenCalled();
    expect(events).toEqual([]); expect(outbox).toEqual([]);
  });
  it("keeps historical policy/source/evidence prefix readable without giving it execution authority", async () => {
    const graphPolicy: AdaptivePolicy = { ...policy, policyId: "ADAPTIVE_RESEARCH_V2" };
    const packet = await methodModule.buildResearchMethodPacket(root, dossier.dossierDigest);
    const payloads: MathCycleEventPayload[] = [
      { phase: "ADAPTIVE_POLICY_DECLARED", round: 1, policy: graphPolicy },
      { phase: "PRIOR_ART", round: 1, facts: [], coverage: "CURATED_PARTIAL", researchMethod: "MIXED_CORE_REPLAY_V3" },
      { phase: "MIXED_CORE_EVIDENCE", round: 1, evidence },
      { phase: "RESEARCH_FRONTIER_BASELINE", round: 1, dossier },
      { phase: "RESEARCH_METHOD_MAP", round: 1, packet, rootContract: root,
        admittedAt: packet.observedAt, priorOutcomes: [], priorClaims: [] },
      { phase: "CALL_STARTED", round: 1, role: "PLANNER" },
    ];
    const chain = (items: MathCycleEventPayload[]) => {
      let previous: string | null = null;
      return items.map((payload, index) => {
        const digest = mathCycleEventDigest(previous, payload);
        const event = { sequence: index + 1, round: payload.round, phase: payload.phase, payload,
          previousDigest: previous, digest }; previous = digest; return event;
      });
    };
    expect(validateMathCycleTrace(chain(payloads), rootDigest, graphPolicy)).not.toBeNull();
    expect(validateMathCycleTrace(chain(payloads.slice(1)), rootDigest, graphPolicy)).toBeNull();
    const old = sealMathPortfolio({ draft: { version: 3, branches: [
      { ...branch, lemmaGraph: lemmaDraft(branch.proposal.hypothesis) },
      { ...branch, methodId: "TAO_LOCAL_OBSTRUCTION", methodFamily: "LOCAL_OBSTRUCTION",
        proposal: { ...proposal, hypothesis: "A distinct local obstruction may separate survivors in the sealed prime domain." },
        lemmaGraph: lemmaDraft("A distinct local obstruction may separate survivors in the sealed prime domain.") },
    ] }, rootReviewDigest: reviewDigest, availableGaps: [gap], priorObligations: [], maxObservedTokens: 60000,
      maxRounds: 2, methodPacket: packet, graphPolicy: { cycleId: policy.cycleId, root } });
    expect(old.version).toBe(3);
    if (old.version !== 3) throw new Error("historical fixture");
    expect(old.branches.every(b => b.lemmaGraph.rootContractDigest === rootDigest)).toBe(true);
    expect(old.branches.every(b => b.lemmaGraph.edges.every(e => e.status === "CLAIMED"))).toBe(true);
  });
});
