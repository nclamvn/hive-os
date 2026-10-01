import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { resolveMathPilotContract, digestMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { buildFrontierDossier, type FrontierDossier } from "@/modules/research-sandbox/math-frontier";
import { buildResearchMethodPacket, type ResearchMethodPacket } from "@/modules/research-sandbox/math-method-map";
import { adaptiveSelection, commandAdaptivePolicy, projectResearchOutcomes, researchOutcomeSchema, type AdaptivePolicy,
  type ResearchOutcome } from "@/modules/research-sandbox/math-adaptive-strategy";
import { sealMathPortfolio, validMathPortfolio } from "@/modules/research-sandbox/math-portfolio";
import { mathCycleEventDigest, type MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";
import { validateMathCycleTrace } from "@/modules/research-sandbox/math-cycle-kernel";
import { runStructuralProbe } from "@/modules/research-sandbox/math-structural-probe";
import { MathAdaptiveStrategyPanel } from "@/components/research/math-adaptive-strategy-panel";
import { runMixedCoreAgentEvidence, type MixedCoreAgentEvidence } from "@/modules/research-sandbox/math-mixed-core-agent";

const root = resolveMathPilotContract({ caseType: "OPEN", statement: "For every prime p ≡ 1 (mod 840), does 4/p = 1/x + 1/y + 1/z hold?",
  definitions: "p is prime and x, y, z are strictly positive integers.", assumptions: "Exact arithmetic applies.",
  falsificationCriterion: "A checked counterexample is required.", successCriterion: "A general proof is required.",
  exclusions: "Finite computation is not a universal proof." });
const rootDigest = digestMathPilotContract(root);
const gap = "The residual prime domain lacks a general support bridge.";
const usage = { inputTokens: 2, cachedInputTokens: 0, outputTokens: 1, reasoningOutputTokens: 0 };
const context = { threadId: "adaptive-planner", usage };
const policy: AdaptivePolicy = { policyId: "ADAPTIVE_RESEARCH_V1", cycleId: "00000000-0000-4000-8000-000000000034",
  rootContractDigest: rootDigest, rootReviewDigest: "a".repeat(64) };
const base = { strategy: "STRUCTURAL_LEMMA" as const, proposal: { sourceGap: gap,
  hypothesis: "A support-uniform relation may bridge the remaining prime domain.",
  taskStatement: "Derive a support-uniform structural relation for every residual prime.",
  falsificationPlan: "Find an exact normalized pair that violates the relation.",
  successEvidence: "An explicit proof with each quantifier and domain checked.",
  rationale: "The relation would remove a structural bottleneck rather than repeat a finite count.",
  exactSurveyPlan: null, structuralProbePlan: null },
  anticipatedFalsifier: "A normalized pair satisfies all premises but misses the claimed conclusion.",
  expectedInformationGain: "HIGH" as const, toolNeeds: ["SOURCE_REVIEW" as const],
  methodId: "SUPPORT_UNIFORM_BRIDGE" as const, methodFamily: "GLOBAL_BRIDGE" as const,
  rootContribution: { kind: "ROOT_BRIDGE" as const, statement: "Remove the arbitrary-support bottleneck for the sealed prime domain." },
  applicabilityAssumptions: "All normalized parameters remain positive and target-sensitive.",
  discriminatingExperiment: { question: "Does a target-sensitive support-uniform reduction hold?",
    supportOutcome: "Keep the lemma as an unverified proof attempt and seek independent checking.",
    refutationOutcome: "Discard the exact statement and route to a different support condition.",
    inconclusiveOutcome: "Identify the missing estimate and route to a different method family." },
  requiredTools: ["PROOF_ATTEMPT" as const], evaluationScope: "UNVALIDATED_RESEARCH" as const };
const second = { ...base, proposal: { ...base.proposal, hypothesis: "A local obstruction relation may discriminate survivors without claiming a universal proof." },
  methodId: "TAO_LOCAL_OBSTRUCTION" as const, methodFamily: "LOCAL_OBSTRUCTION" as const,
  rootContribution: { kind: "DISCRIMINATING_FALSIFICATION" as const,
    statement: "Separate a scoped survivor obstruction from a known elementary construction." } };
let packet: ResearchMethodPacket, dossier: FrontierDossier, mixedEvidence: MixedCoreAgentEvidence;
beforeAll(async () => {
  dossier = await buildFrontierDossier(root, async () => { throw new Error("offline fixture"); });
  packet = await buildResearchMethodPacket(root, dossier.dossierDigest, {
    now: new Date("2026-10-01T00:00:00.000Z"), statusLoader: async () => { throw new Error("offline fixture"); } });
  mixedEvidence = await runMixedCoreAgentEvidence(rootDigest, "MIXED_CORE_REPLAY_V3");
}, 45_000);
function seal(branches = [base, second]) {
  const result = sealMathPortfolio({ draft: { version: 2, branches }, methodPacket: packet,
    rootReviewDigest: policy.rootReviewDigest, availableGaps: [gap], priorObligations: [], maxRounds: 2, maxObservedTokens: 60_000 });
  if (result.version !== 2) throw new Error("fixture must seal V2");
  return result;
}
function chain(payloads: MathCycleEventPayload[]) {
  let previousDigest: string | null = null;
  return payloads.map((payload, index) => { const digest = mathCycleEventDigest(previousDigest, payload);
    const event = { sequence: index + 1, round: payload.round, phase: payload.phase, payload, previousDigest, digest };
    previousDigest = digest; return event; });
}
function prefix(): MathCycleEventPayload[] { return [
  { phase: "ADAPTIVE_POLICY_DECLARED", round: 1, policy },
  { phase: "RESEARCH_FRONTIER_BASELINE", round: 1, dossier },
  { phase: "RESEARCH_METHOD_MAP", round: 1, packet, rootContract: root, admittedAt: packet.observedAt, priorOutcomes: [], priorClaims: [] },
  { phase: "PRIOR_ART", round: 1, facts: [], coverage: "CURATED_PARTIAL", researchMethod: "MIXED_CORE_REPLAY_V3" },
  { phase: "MIXED_CORE_EVIDENCE", round: 1, evidence: mixedEvidence },
]; }
function select(portfolio = seal(), outcomes: ResearchOutcome[] = []) { return adaptiveSelection({ packet, root,
  portfolioDigest: portfolio.portfolioDigest, branches: portfolio.branches, selectedBranchIds: [], priorClaims: [], outcomes }); }

describe("adaptive research policy V1 and portfolio V2", () => {
  it("prefers a root structural bridge over a ready easy survey without any tool bonus", () => {
    const survey = { ...second, expectedInformationGain: "HIGH", proposal: { ...second.proposal,
      taskStatement: "Survey prime p congruent to 1 modulo 840 with 840 < p <= 1681 through maxA 11.",
      exactSurveyPlan: { kind: "ERDOS_STRAUS_RESIDUAL_A", lowerExclusive: 840, upperInclusive: 1681, maxA: 11 } },
      toolNeeds: ["RESIDUAL_SURVEY"], requiredTools: ["RESIDUAL_SURVEY"] };
    const portfolio = seal([{ ...base, expectedInformationGain: "LOW" } as never, survey as never]);
    expect(validMathPortfolio(portfolio, packet)).toBe(true);
    expect(select(portfolio).selectedBranchId).toBe(portfolio.branches[0].branchId);
    expect(select(portfolio).meaning).toBe("PROPOSED_ROUTING_NOT_VERIFIED_SCIENCE");
  });
  it("retains higher-value missing tool direction but executes the ready alternative", () => {
    const portfolio = seal([{ ...base, requiredTools: ["GLOBAL_SUPPORT_CERTIFICATE"] } as never, second]);
    const selection = select(portfolio);
    expect(selection.ranking[0]).toMatchObject({ state: "DEFERRED", missingTools: ["GLOBAL_SUPPORT_CERTIFICATE"] });
    expect(selection.selectedBranchId).toBe(portfolio.branches[1].branchId);
  });
  it("excludes exact repetitions and warmup tasks even when tools are ready", () => {
    const portfolio = seal();
    const selection = adaptiveSelection({ packet, portfolioDigest: portfolio.portfolioDigest, branches: portfolio.branches,
      selectedBranchIds: [], priorClaims: [base.proposal.hypothesis], outcomes: [] });
    expect(selection.selectedBranchId).toBe(portfolio.branches[1].branchId);
    const warmup = seal([{ ...base, rootContribution: { ...base.rootContribution, kind: "DEVELOPMENT_WARMUP" },
      evaluationScope: "DEVELOPMENT_WARMUP" } as never, second]);
    expect(select(warmup).ranking.find((row) => row.branchId === warmup.branches[0].branchId)?.state).toBe("EXCLUDED");
  });
  it("excludes known conditional constructions from scientific selection regardless of readiness", () => {
    const known = { ...base, proposal: { ...base.proposal,
      hypothesis: "For prime p, if x=(p+3)/4 has a divisor congruent to 2 (mod 3), the first gate opens.",
      taskStatement: "Prove the conditional first-gate construction when x=(p+3)/4 has a prime divisor congruent to 2 (mod 3)." } };
    const portfolio = seal([known, second]);
    const selection = select(portfolio);
    expect(selection.ranking.find((row) => row.branchId === portfolio.branches[0].branchId)?.state).toBe("EXCLUDED");
    expect(selection.selectedBranchId).toBe(portfolio.branches[1].branchId);
  });
  it("replays missing-tool and diversity invariants even after full digest recomputation", () => {
    expect(() => seal([base, { ...second, methodId: base.methodId, methodFamily: base.methodFamily } as never])).toThrow();
    const portfolio = seal();
    portfolio.branches[0].requiredTools = ["STRUCTURAL_PROBE"];
    portfolio.branches.forEach((branch, index) => {
      const { branchId: _id, parentObligationIds: _parents, maxObservedTokens: _tokens, maxWallSeconds: _seconds, ...draft } = branch;
      void _id; void _parents; void _tokens; void _seconds;
      branch.branchId = sha256(canonicalJson({ rootReviewDigest: portfolio.rootReviewDigest, index, branch: draft }));
    });
    const { portfolioDigest: _digest, ...body } = portfolio; void _digest;
    portfolio.portfolioDigest = sha256(canonicalJson(body));
    expect(validMathPortfolio(portfolio, packet)).toBe(false);
  });
  it("does not promote ROUND_CLOSED without a real attempt/review", () => {
    const records = projectResearchOutcomes({ cycleId: policy.cycleId, ledgerDigest: "b".repeat(64), trace: [
      { phase: "PROPOSED", round: 1, proposal: base.proposal, context },
      { phase: "ROUND_CLOSED", round: 1, disposition: "AI_REVIEWED", conclusion: "PARTIAL", nextGap: gap }] });
    expect(records[0].outcome).toBe("PRUNED");
  });
  it("prior inconclusive family diversifies routing and an unchanged refuted-origin task is not repeated", () => {
    const portfolio = seal([base, { ...second, rootContribution: base.rootContribution } as never]);
    const initial = select(portfolio), chosen = portfolio.branches.find((branch) => branch.branchId === initial.selectedBranchId)!;
    const record: ResearchOutcome = { sourceCycleId: "old-cycle", sourceLedgerDigest: "b".repeat(64),
      hypothesis: "A different older hypothesis from the same method was inconclusive.", methodFamily: chosen.methodFamily,
      outcome: "INCONCLUSIVE", refutation: null, authority: "RECORDED_EVENTS_NOT_THEOREM_CERTIFICATION" };
    expect(select(portfolio, [record]).selectedBranchId).not.toBe(initial.selectedBranchId);
    const repeated = { ...record, hypothesis: chosen.proposal.hypothesis };
    expect(select(portfolio, [repeated]).ranking.find((row) => row.branchId === chosen.branchId)?.state).toBe("EXCLUDED");
  });
  it("exact refutation memory binds registered predicate without certifying prose equivalence", () => {
    const records = projectResearchOutcomes({ cycleId: policy.cycleId, ledgerDigest: "b".repeat(64), trace: [
      { phase: "PROPOSED", round: 1, proposal: base.proposal, context },
      { phase: "MIXED_CORE_CLAIM_REFUTED", round: 1, claim: "ALL_RESIDUAL_PRIMES_HAVE_NORMALIZED_SINGLE_CORE_RESCUE", evidenceDigest: "c".repeat(64) }] });
    expect(records[0]).toMatchObject({ outcome: "TYPED_PREDICATE_REFUTED", hypothesis: base.proposal.hypothesis,
      refutation: { kind: "MIXED_CORE_CLAIM", scope: "REGISTERED_PREDICATE_ONLY",
        claimId: "ALL_RESIDUAL_PRIMES_HAVE_NORMALIZED_SINGLE_CORE_RESCUE", evidenceDigest: "c".repeat(64) } });
    expect(researchOutcomeSchema.safeParse({ ...records[0], refutation: null }).success).toBe(false);
    expect(researchOutcomeSchema.safeParse({ ...records[0], refutation: { ...records[0].refutation,
      scope: "PROSE_HYPOTHESIS_CERTIFIED_FALSE" } }).success).toBe(false);
    const plan = { kind: "GATE_MUST_OPEN" as const, targetA: 11, failedThroughA: 7, upperInclusive: 131_041,
      expectedPrimeResidue: null, divisorConditions: [], nonmultipleConditions: [] };
    expect(researchOutcomeSchema.safeParse({ ...records[0], refutation: { kind: "STRUCTURAL_PROBE",
      scope: "REGISTERED_PREDICATE_ONLY", plan, planDigest: "f".repeat(64), reportDigest: "e".repeat(64) } }).success).toBe(false);
  });
  it("generic replay PASS plus inconclusive reviewers is not a bound refutation", () => {
    const attempt = { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "solver", attemptType: "INCONCLUSIVE" as const,
      argument: "A finite result is checked but premises remain unverified.", candidateCounterexample: null, selfChecks: [], limitations: [], usage };
    const report = { role: "CRITIC" as const, verdict: "INCONCLUSIVE" as const, candidateConclusion: "INCONCLUSIVE" as const,
      exactQuote: "premises remain unverified", reasoning: "The finite gate exclusion does not show the natural-language premises hold.",
      checks: ["Check the hypothesis premises separately."], unresolvedGap: gap, threadId: "critic", usage };
    const trace: MathCycleEventPayload[] = [{ phase: "PROPOSED", round: 1, proposal: base.proposal, context },
      { phase: "ATTEMPTED", round: 1, contract: root, attempt },
      { phase: "COUNTEREXAMPLE_REPLAY", round: 1, report: { status: "PASS" } } as never,
      { phase: "REVIEWED", round: 1, role: "CRITIC", report },
      { phase: "REVIEWED", round: 1, role: "ADVERSARY", report: { ...report, role: "ADVERSARY", threadId: "adversary" } }];
    expect(projectResearchOutcomes({ cycleId: policy.cycleId, ledgerDigest: "b".repeat(64), trace })[0].outcome).toBe("INCONCLUSIVE");
  });
  it("new command policy prevents marker stripping, rehashed downgrade and out-of-order admission", () => {
    const events = [...prefix(), { phase: "CALL_STARTED", round: 1, role: "PLANNER" } as const];
    expect(validateMathCycleTrace(chain(events), rootDigest, policy)).not.toBeNull();
    expect(validateMathCycleTrace(chain(events.slice(1)), rootDigest, policy)).toBeNull();
    expect(validateMathCycleTrace(chain([events[0], events[5], ...events.slice(1, 5)]), rootDigest, policy)).toBeNull();
    expect(validateMathCycleTrace(chain(events), "f".repeat(64), policy)).toBeNull();
    expect(commandAdaptivePolicy({ strategyPolicy: policy }, { id: policy.cycleId, rootContractDigest: rootDigest,
      rootReviewDigest: policy.rootReviewDigest })).toEqual(policy);
    expect(() => commandAdaptivePolicy({ strategyPolicy: { ...policy, cycleId: "00000000-0000-4000-8000-000000000099" } },
      { id: policy.cycleId, rootContractDigest: rootDigest, rootReviewDigest: policy.rootReviewDigest })).toThrow();
    expect(commandAdaptivePolicy({}, { id: policy.cycleId, rootContractDigest: rootDigest, rootReviewDigest: policy.rootReviewDigest })).toBeNull();
  });
  it("new adaptive policy cannot strip or downgrade the arithmetic V3 replay gate", () => {
    const call = { phase: "CALL_STARTED", round: 1, role: "PLANNER" } as const;
    expect(validateMathCycleTrace(chain([...prefix(), call]), rootDigest, policy)).not.toBeNull();
    expect(validateMathCycleTrace(chain([...prefix().filter((event) => !["PRIOR_ART", "MIXED_CORE_EVIDENCE"].includes(event.phase)), call]),
      rootDigest, policy)).toBeNull();
    const downgraded = prefix().map((event) => event.phase === "PRIOR_ART"
      ? { ...event, researchMethod: "MIXED_CORE_REPLAY_V2" as const } : event);
    expect(validateMathCycleTrace(chain([...downgraded, call]), rootDigest, policy)).toBeNull();
  });
  it("frozen selection rationale must replay exactly and old freshness is not regraded today", () => {
    const portfolio = seal(), selection = select(portfolio);
    const events: MathCycleEventPayload[] = [...prefix(), { phase: "CALL_STARTED", round: 1, role: "PLANNER" },
      { phase: "PORTFOLIO_PLANNED", round: 1, portfolio, context },
      { phase: "BRANCH_SELECTED", round: 1, portfolioDigest: portfolio.portfolioDigest, branchId: portfolio.branches[0].branchId,
        baselineObservedTokens: 3, selectedAt: packet.observedAt, adaptiveSelection: selection }];
    expect(validateMathCycleTrace(chain(events), rootDigest, policy)).not.toBeNull();
    selection.ranking[0].priority += 1;
    expect(validateMathCycleTrace(chain(events), rootDigest, policy)).toBeNull();
    const stale = prefix();
    const staleMap = stale.find((event) => event.phase === "RESEARCH_METHOD_MAP");
    if (!staleMap) throw new Error("fixture must contain retained method admission");
    staleMap.admittedAt = "2026-10-03T00:00:00.000Z";
    expect(validateMathCycleTrace(chain(stale), rootDigest, policy)).toBeNull();
  });
  it.each(["https://arxiv.org/html/2609.09204v1", "https://arxiv.org/pdf/2609.09204v1.pdf", "https://doi.org/10.48550/arXiv.2609.09204",
    "http://arxiv.org/abs/2609.09204v1", "https://dx.doi.org/10.48550/arXiv.2609.09204", "https://doi.org/10.48550%2FarXiv.2609.09204",
    "https://user@arxiv.org/abs/2609.09204v1", "https://arxiv.org:8080/abs/2609.09204v1"])("quarantines rehashed frontier alias %s before planning", (alias) => {
    const changed = structuredClone(dossier);
    changed.sources[0].canonicalUri = alias;
    const { dossierDigest: _ignored, ...body } = changed; void _ignored;
    changed.dossierDigest = sha256(canonicalJson(body));
    expect(validateMathCycleTrace(chain([{ phase: "ADAPTIVE_POLICY_DECLARED", round: 1, policy },
      { phase: "RESEARCH_FRONTIER_BASELINE", round: 1, dossier: changed }]), rootDigest, policy)).toBeNull();
  });
  it("preplanner baseline does not invalidate a typed refutation before the solver", async () => {
    const probePlan = { kind: "GATE_MUST_OPEN" as const, targetA: 11, failedThroughA: 7, upperInclusive: 131_041,
      expectedPrimeResidue: null, divisorConditions: [], nonmultipleConditions: [] };
    const report = await runStructuralProbe(probePlan);
    expect(report.status).toBe("REFUTED");
    const proposal = { ...base.proposal, structuralProbePlan: probePlan };
    const events: MathCycleEventPayload[] = [...prefix(), { phase: "CALL_STARTED", round: 1, role: "PLANNER" },
      { phase: "PROPOSED", round: 1, proposal, context }, { phase: "STRUCTURAL_PROBED", round: 1, report },
      { phase: "STOPPED", round: 1, reason: "STRUCTURAL_REFUTED" }];
    expect(validateMathCycleTrace(chain(events), rootDigest, policy)).not.toBeNull();
  });
  it("renders retained strategy/deferred fields and explicit historical absence without fetching", () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("render must not fetch"));
    const portfolio = seal([{ ...base, requiredTools: ["GLOBAL_SUPPORT_CERTIFICATE"] } as never, second]);
    const selection = select(portfolio);
    const events: MathCycleEventPayload[] = [...prefix(), { phase: "PORTFOLIO_PLANNED", round: 1, portfolio, context },
      { phase: "BRANCH_SELECTED", round: 1, portfolioDigest: portfolio.portfolioDigest, branchId: portfolio.branches[1].branchId,
        baselineObservedTokens: 0, selectedAt: packet.observedAt, adaptiveSelection: selection }];
    for (const vi of [true, false]) {
      const html = renderToStaticMarkup(createElement(MathAdaptiveStrategyPanel, { trace: events, vi }));
      expect(html).toContain(packet.packetDigest);
      expect(html).toContain("DEFERRED");
      expect(html).toContain("GLOBAL_SUPPORT_CERTIFICATE");
      expect(html).toContain("UNAVAILABLE");
      expect(html).toContain("WITHDRAWN");
    }
    expect(renderToStaticMarkup(createElement(MathAdaptiveStrategyPanel, { trace: [], vi: false }))).toContain("no retained adaptive method packet");
    expect(fetch).not.toHaveBeenCalled(); fetch.mockRestore();
  });
  it("escapes source/assumption text while retaining bounded KaTeX formulas", () => {
    const retained = prefix();
    if (retained[2].phase !== "RESEARCH_METHOD_MAP") throw new Error("fixture packet missing");
    retained[2] = { ...retained[2], packet: structuredClone(retained[2].packet) };
    retained[2].packet.methods[0].missingBridgeToRoot = "$p\\equiv 1\\pmod{840}$ <script>alert(1)</script>";
    const html = renderToStaticMarkup(createElement(MathAdaptiveStrategyPanel, { trace: retained, vi: false }));
    expect(html).toContain("katex"); expect(html).not.toContain("<script>"); expect(html).toContain("&lt;script&gt;");
  });
});
