import { describe, expect, it } from "vitest";

import {
  compatibleResidualPrimeRoots, cycleResourceStopReason, mathCycleEventDigest, mathCycleLimitsSchema, mathCycleSteeringDigest,
  mathCycleSteeringSchema, steeringProposalIssue, taskContract,
  verifyMathCycleProposal, type MathCycleEventPayload,
} from "@/modules/research-sandbox/math-cycle";
import { validateMathCycleTrace } from "@/modules/research-sandbox/math-cycle-kernel";
import { surveyResidualInterval } from "@/modules/research-sandbox/math-certificates";
import { hasErdosStrausEquation } from "@/modules/research-sandbox/math-certificates";
import { runIndependentResidualReplay } from "@/modules/research-sandbox/math-independent-replay";
import { digestMathPilotContract, resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { explicitCongruences, knownScopeForTask, mathPriorArtFor } from "@/modules/research-sandbox/math-prior-art";

const root = resolveMathPilotContract({ caseType: "OPEN", statement: "Does every admissible object have property P?",
  definitions: "Admissible means a finite object satisfying axiom A.", assumptions: "Classical logic applies.",
  falsificationCriterion: "A single admissible object lacking P is a counterexample.",
  successCriterion: "A general argument or checked counterexample is required.",
  exclusions: "Finite positive samples alone cannot establish a universal statement." });
const gap = "The argument has not established the missing implication from axiom A to property P.";
const proposal = { sourceGap: gap, hypothesis: "A restricted subclass may reveal where the implication fails.",
  taskStatement: "For admissible objects of size at most four, locate the first obstruction to property P.",
  falsificationPlan: "Give a concrete admissible object of size at most four without property P.",
  successEvidence: "Provide a checked finite witness or a documented exhaustive bound, not a proof of the root claim.",
  rationale: "A small obstruction could localize the missing implication without changing the root quantifier." };
const verification = { decision: "ACCEPT" as const, sourceGap: gap,
  scopeCheck: "The task retains the original admissibility definition and does not claim the universal statement.",
  noveltyCheck: "This task differs from the original root theorem and prior tasks.",
  falsifiabilityCheck: "A finite counterexample would directly refute this bounded subtask.",
  unresolvedRisk: "A bounded result cannot establish the universal root theorem." };

describe("controlled math research cycle", () => {
  it("transfers finite evidence only between prime-residual Erdős–Straus roots", () => {
    const primeRoot = resolveMathPilotContract({ caseType: "OPEN",
      statement: "For every prime p ≡ 1 (mod 840), does 4/p = 1/x + 1/y + 1/z hold?",
      definitions: "p is prime and x, y, z are strictly positive integers.",
      assumptions: "Exact arithmetic applies.", falsificationCriterion: "A counterexample would refute it.",
      successCriterion: "A proof or a checked counterexample is required.",
      exclusions: "Finite evidence is not a universal proof." });
    const boundedRoot = resolveMathPilotContract({ caseType: "OPEN",
      statement: "For every prime p ≡ 1 (mod 840), does 4/p = 1/x + 1/y + 1/z hold with A≤47?",
      definitions: "p is prime and x, y, z are strictly positive integers.",
      assumptions: "Exact arithmetic applies.", falsificationCriterion: "A counterexample would refute it.",
      successCriterion: "A proof or a checked counterexample is required.",
      exclusions: "Finite evidence is not a universal proof." });
    const other = resolveMathPilotContract({ caseType: "OPEN",
      statement: "For every integer n ≥ 2, does 4/n = 1/x + 1/y + 1/z hold?",
      definitions: "n is an integer and x, y, z are strictly positive integers.",
      assumptions: "Exact arithmetic applies.", falsificationCriterion: "A counterexample would refute it.",
      successCriterion: "A proof or a checked counterexample is required.",
      exclusions: "Finite evidence is not a universal proof." });
    expect(compatibleResidualPrimeRoots(primeRoot, boundedRoot)).toBe(true);
    expect(compatibleResidualPrimeRoots(primeRoot, other)).toBe(false);
    expect(compatibleResidualPrimeRoots(other, boundedRoot)).toBe(false);
  });
  it("binds a human-confirmed structural target before accepting an AI task", () => {
    const erdos = resolveMathPilotContract({ caseType: "OPEN",
      statement: "For every prime p ≡ 1 (mod 840), does 4/p = 1/x + 1/y + 1/z hold?",
      definitions: "p is prime and x, y, z are strictly positive integers.",
      assumptions: "Exact integer arithmetic applies.",
      falsificationCriterion: "A rigorously checked prime counterexample.",
      successCriterion: "A general proof or counterexample.",
      exclusions: "No universal inference from a finite sample." });
    const steering = mathCycleSteeringSchema.parse({ method: "HUMAN_STEERED_TWO_GATE_V1",
      focus: "STRUCTURAL_LEMMA", targetA: 11, note: "Seek a conditional theorem.",
      approvedByUserId: "human-1", approvedAt: "2026-09-29T00:00:00.000Z",
      rootContractDigest: digestMathPilotContract(erdos) });
    const structural = { ...proposal,
      hypothesis: "For prime p≡1 (mod 840) whose A=3 and A=7 gates fail, A=11 may admit a structural criterion.",
      taskStatement: "For every prime p≡1 (mod 840) with A=3 and A=7 obstructed, prove or refute a sufficient condition opening A=11.",
      exactSurveyPlan: null };
    const base = { rootContract: erdos, availableGaps: [gap], priorTasks: [], proposal: structural,
      verification, plannerThreadId: "planner", verifierThreadId: "verifier", steering };
    expect(verifyMathCycleProposal(base).accepted).toBe(true);
    const priorFindings = [{ sourceCycleId: "11735863-a80f-496e-b4b9-592d5ebed830",
      sourceLedgerDigest: "a".repeat(64), replayDigest: "b".repeat(64),
      prime: 10_051_441, failedThroughA: 47, firstSuccessA: 59 }];
    const alreadyFalsified = { ...structural,
      hypothesis: "For every prime p≡1 (mod 840), if no solution exists at A=3 and none at A=7, then positive integers exist at A=11.",
      taskStatement: "For every prime p≡1 (mod 840) obstructed at A=3 and A=7, prove A=11 always succeeds." };
    expect(verifyMathCycleProposal({ ...base, proposal: alreadyFalsified, priorFindings })).toMatchObject({
      accepted: false, reason: expect.stringContaining("independently replayed prior failure") });
    expect(verifyMathCycleProposal({ ...base, priorFindings }).accepted).toBe(true);
    expect(steeringProposalIssue(steering, { ...structural,
      hypothesis: "For prime p≡1 (mod 840), if A=3 and A=7 fail, let u=(p+3)/4 and w=(p+11)/4; then A=11 succeeds.",
      successEvidence: "Verify the resulting identity 4/p=1/u+1/y+1/z for every qualifying prime."
    })).toContain("different first denominator");
    expect(steeringProposalIssue(steering, { ...structural,
      hypothesis: "For every prime p≡1 (mod 840), if no solution exists at A=3 and none at A=7 and p>10051441, then a solution may exist at A=11.",
    }, priorFindings)).toBeNull();
    const seeded = { ...steering, targetA: 23, replayCandidate: { prime: 131_041, failedThroughA: 11 } };
    expect(steeringProposalIssue(seeded, { ...structural,
      hypothesis: "For prime p≡1 (mod 840), A=3 and A=7 obstructions plus a prime-power x3 may force A=23.",
      taskStatement: "For prime p≡1 (mod 840) with A=3 and A=7 obstructed, test prime-power x3 at A=23.",
    })).toContain("intervening survivor gate");
    expect(steeringProposalIssue(seeded, { ...structural,
      hypothesis: "For prime p≡1 (mod 840) surviving A=3, A=7, A=11, A=15 and A=19, seek a cross-gate criterion for A=23.",
      taskStatement: "For prime p≡1 (mod 840) with A=3, A=7, A=11, A=15 and A=19 obstructed, prove or refute a condition at A=23.",
    })).toBeNull();
    expect(verifyMathCycleProposal({ ...base, proposal: { ...structural,
      taskStatement: "For prime p≡1 (mod 840), investigate A=15 after A=3 and A=7." } }).accepted).toBe(false);
    expect(verifyMathCycleProposal({ ...base, proposal: { ...structural, exactSurveyPlan: {
      kind: "ERDOS_STRAUS_RESIDUAL_A" as const, lowerExclusive: 10_000_000,
      upperInclusive: 10_001_000, maxA: 11 } } }).accepted).toBe(false);
    expect(verifyMathCycleProposal({ ...base, steering: { ...steering,
      rootContractDigest: "0".repeat(64) } }).accepted).toBe(false);
    const event = { phase: "HUMAN_STEERED" as const, round: 1 as const,
      steering, steeringDigest: mathCycleSteeringDigest(steering) };
    const ledger = { sequence: 1, round: 1, phase: event.phase, payload: event, previousDigest: null,
      digest: mathCycleEventDigest(null, event) };
    expect(validateMathCycleTrace([ledger])).toEqual([event]);
    const memory = { phase: "PRIOR_FINDINGS" as const, round: 1, findings: priorFindings };
    const memoryLedger = { sequence: 2, round: 1, phase: memory.phase, payload: memory,
      previousDigest: ledger.digest, digest: mathCycleEventDigest(ledger.digest, memory) };
    expect(validateMathCycleTrace([ledger, memoryLedger])).toEqual([event, memory]);
    expect(validateMathCycleTrace([{ ...ledger, payload: { ...event, steeringDigest: "0".repeat(64) },
      digest: mathCycleEventDigest(null, { ...event, steeringDigest: "0".repeat(64) }) }])).toBeNull();
    const divergent = { phase: "PROPOSED" as const, round: 1, proposal: { ...structural,
      taskStatement: "For prime p≡1 (mod 840), investigate A=15 after A=3 and A=7." },
    context: { threadId: "planner", usage: { inputTokens: 100, cachedInputTokens: 0,
      outputTokens: 50, reasoningOutputTokens: 0 } } };
    expect(validateMathCycleTrace([ledger, { sequence: 2, round: 1, phase: "PROPOSED", payload: divergent,
      previousDigest: ledger.digest, digest: mathCycleEventDigest(ledger.digest, divergent) }])).toBeNull();
    const historicallyAccepted = { ...divergent, proposal: { ...structural,
      hypothesis: "For prime p≡1 (mod 840), if A=3 and A=7 fail, let u=(p+3)/4 and w=(p+11)/4; then A=11 succeeds.",
      successEvidence: "Verify the resulting identity 4/p=1/u+1/y+1/z for every qualifying prime." } };
    expect(steeringProposalIssue(steering, historicallyAccepted.proposal)).toContain("different first denominator");
    expect(validateMathCycleTrace([ledger, { sequence: 2, round: 1, phase: "PROPOSED", payload: historicallyAccepted,
      previousDigest: ledger.digest, digest: mathCycleEventDigest(ledger.digest, historicallyAccepted) }]))
      .toEqual([event, historicallyAccepted]);
  });
  it("screens a sourced, already solved Erdős–Straus subclass before the solver call", () => {
    const erdos = resolveMathPilotContract({ caseType: "OPEN",
      statement: "For every integer n >= 2, do there exist positive integers x, y, z such that 4/n = 1/x + 1/y + 1/z?",
      definitions: "n is an integer at least 2. x, y, z are strictly positive integers.",
      assumptions: "Ordinary integer and rational arithmetic applies.",
      falsificationCriterion: "A proven counterexample would refute the conjecture.",
      successCriterion: "A complete proof or a checked counterexample is required.",
      exclusions: "Finite examples are not a general proof." });
    const knownTask = "Prove the construction for every n≡5 (mod 12) or find a counterexample.";
    expect(mathPriorArtFor(erdos).map((fact) => fact.id)).toContain("erdos-straus-n-2-mod-3");
    expect(knownScopeForTask(erdos, knownTask)?.id).toBe("erdos-straus-n-2-mod-3");
    expect(knownScopeForTask(erdos, "Set n=120k+97")?.id).toBe("erdos-straus-n-2-mod-5");
    expect(knownScopeForTask(erdos, "Investigate n≡13 (mod 24)")?.id).toBe("erdos-straus-n-5-mod-8");
    expect(knownScopeForTask(erdos,
      "Let x=(n+3)/4 and suppose x has a prime divisor d≡2 (mod 3).")?.id)
      .toBe("erdos-straus-first-gate-divisor-mod-3");
    expect(knownScopeForTask(erdos,
      "For prime n≡1 (mod 840), let X=(n+7)/4 and suppose X has a divisor q≡5 (mod 7).")?.id)
      .toBe("erdos-straus-second-gate-divisor-mod-7");
    expect(knownScopeForTask(erdos,
      "For prime p≡1 (mod 840), if A=3 fails because x=(p+3)/4 has no prime divisor ≡2 (mod 3) " +
      "and A=7 fails, prove an additional condition for A=11 with x=(p+11)/4.")).toBeNull();
    expect(knownScopeForTask(erdos,
      "For prime p≡1 (mod 840), if A=7 has x=(p+7)/4 and a divisor q≡5 (mod 7), " +
      "explain whether A=11 follows.")).toBeNull();
    expect(knownScopeForTask(erdos,
      "Does every prime n≡1 (mod 840) have x=(n+3)/4 containing a divisor d≡2 (mod 3)?"))
      .toBeNull();
    expect(explicitCongruences("Check n\\equiv 5 (mod 12)")).toEqual([{ modulus: 12, residue: 5 }]);
    expect(explicitCongruences("Let n=12k+5")).toEqual([{ modulus: 12, residue: 5 }]);
    expect(verifyMathCycleProposal({ rootContract: erdos, availableGaps: [gap], priorTasks: [],
      proposal: { ...proposal, sourceGap: gap, taskStatement: knownTask }, verification,
      plannerThreadId: "planner", verifierThreadId: "verifier" })).toMatchObject({ accepted: false });
    expect(verifyMathCycleProposal({ rootContract: erdos, availableGaps: [gap], priorTasks: [],
      proposal: { ...proposal, sourceGap: gap, hypothesis: "For every k≥0, n=120k+97 has a solution." }, verification,
      plannerThreadId: "planner", verifierThreadId: "verifier" })).toMatchObject({ accepted: false });
    expect(verifyMathCycleProposal({ rootContract: erdos, availableGaps: [gap], priorTasks: [],
      proposal: { ...proposal, hypothesis: "Set x=(n+3)/4 for a prime n≡1 (mod 840).",
        taskStatement: "Prove a solution if x has a prime divisor d≡2 (mod 3)." }, verification,
      plannerThreadId: "planner", verifierThreadId: "verifier" })).toMatchObject({ accepted: false });
    expect(verifyMathCycleProposal({ rootContract: erdos, availableGaps: [gap], priorTasks: [],
      proposal: { ...proposal, hypothesis: "For prime n≡1 (mod 840), let X=(n+7)/4.",
        taskStatement: "Prove a solution if X has a divisor q≡5 (mod 7)." }, verification,
      plannerThreadId: "planner", verifierThreadId: "verifier" })).toMatchObject({ accepted: false });
    expect(knownScopeForTask(erdos, "Investigate n≡1 (mod 24) with an explicit divisor criterion.")).toBeNull();
    const bounded = { ...proposal,
      hypothesis: "Within a finite interval, each residual prime may admit an A at most 47.",
      taskStatement: "Test each prime p congruent to 1 modulo 840 with 10000000 < p <= 20000000 and A <= 47.",
      exactSurveyPlan: { kind: "ERDOS_STRAUS_RESIDUAL_A" as const,
        lowerExclusive: 10_000_000, upperInclusive: 20_000_000, maxA: 47 } };
    expect(verifyMathCycleProposal({ rootContract: erdos, availableGaps: [gap], priorTasks: [],
      proposal: bounded, verification, plannerThreadId: "planner", verifierThreadId: "verifier" }).accepted).toBe(true);
    expect(taskContract(erdos, bounded).statement).toContain("10000000 < p <= 20000000");
    expect(verifyMathCycleProposal({ rootContract: erdos, availableGaps: [gap], priorTasks: [],
      proposal: { ...bounded, taskStatement: "Survey p in this finite interval for an auxiliary denominator bound." },
      verification, plannerThreadId: "planner", verifierThreadId: "verifier" }).accepted).toBe(false);
    expect(verifyMathCycleProposal({ rootContract: erdos, availableGaps: [gap], priorTasks: [],
      proposal: { ...bounded, exactSurveyPlan: { ...bounded.exactSurveyPlan, upperInclusive: 31_000_000 } },
      verification, plannerThreadId: "planner", verifierThreadId: "verifier" }).accepted).toBe(false);
    expect(mathPriorArtFor(root)).toEqual([]);
  });

  it("enforces bounded configuration and builds a linked, narrower task", () => {
    expect(mathCycleLimitsSchema.safeParse({ maxRounds: 3, maxObservedTokens: 60_000 }).success).toBe(false);
    expect(mathCycleLimitsSchema.safeParse({ maxRounds: 2, maxObservedTokens: 9_999 }).success).toBe(false);
    expect(taskContract(root, proposal)).toMatchObject({ caseType: "OPEN",
      statement: `Hypothesis: ${proposal.hypothesis}\nTask: ${proposal.taskStatement}`,
      definitions: root.definitions, assumptions: root.assumptions });
    expect(verifyMathCycleProposal({ rootContract: root, availableGaps: [gap], priorTasks: [],
      proposal: { ...proposal, hypothesis: "H".repeat(2_000), taskStatement: "T".repeat(2_000) }, verification,
      plannerThreadId: "planner", verifierThreadId: "verifier" }).accepted).toBe(false);
  });

  it("recognizes equivalent p-notation and ordinary positive-integer definitions without changing the domain", () => {
    const pContract = resolveMathPilotContract({ caseType: "OPEN",
      statement: "For each prime p ≡ 1 (mod 840), does 4/p = 1/x + 1/y + 1/z hold for positive denominators?",
      definitions: "p is a prime at least 2; x, y, z are positive integers.",
      assumptions: "Ordinary exact integer arithmetic applies.",
      falsificationCriterion: "A prime with exhaustive exclusion refutes this restricted claim.",
      successCriterion: "A general proof or checked counterexample is required.",
      exclusions: "Finite samples cannot establish the universal claim." });
    expect(hasErdosStrausEquation(pContract)).toBe(true);
    expect(mathPriorArtFor(pContract).length).toBeGreaterThan(0);
    expect(explicitCongruences("prime p ≡ 1 (mod 840)")).toEqual([{ modulus: 840, residue: 1 }]);
    expect(hasErdosStrausEquation({ ...pContract, statement: "Does 5/p=1/x+1/y+1/z hold?" })).toBe(false);
    expect(hasErdosStrausEquation({ ...pContract, statement: "Does 14/p=1/x+1/y+1/z hold?" })).toBe(false);
  });

  it("fails closed on fabricated gaps, duplicate tasks, verifier rejection or shared context", () => {
    const base = { rootContract: root, availableGaps: [gap], priorTasks: [], proposal, verification,
      plannerThreadId: "planner", verifierThreadId: "verifier" };
    expect(verifyMathCycleProposal(base).accepted).toBe(true);
    expect(verifyMathCycleProposal({ ...base, availableGaps: ["Other actual gap"] }).accepted).toBe(false);
    expect(verifyMathCycleProposal({ ...base, priorTasks: [proposal.taskStatement] }).accepted).toBe(false);
    expect(verifyMathCycleProposal({ ...base, verification: { ...verification, decision: "REJECT" } }).accepted).toBe(false);
    expect(verifyMathCycleProposal({ ...base, verifierThreadId: "planner" }).accepted).toBe(false);
    expect(verifyMathCycleProposal({ ...base, proposal: { ...proposal, exactSurveyPlan: {
      kind: "ERDOS_STRAUS_RESIDUAL_A", lowerExclusive: 10_000_000,
      upperInclusive: 20_000_000, maxA: 47 } } }).accepted).toBe(false);
  });

  it("validates sequence, previous digest, payload and phase of append-only events", () => {
    const payload = { phase: "CALL_STARTED" as const, role: "PLANNER" as const, round: 1 };
    const event = { sequence: 1, round: 1, phase: payload.phase, payload, previousDigest: null,
      digest: mathCycleEventDigest(null, payload) };
    expect(validateMathCycleTrace([event])).toEqual([payload]);
    expect(validateMathCycleTrace([{ ...event, digest: "0".repeat(64) }])).toBeNull();
    expect(validateMathCycleTrace([{ ...event, sequence: 2 }])).toBeNull();
    expect(validateMathCycleTrace([{ ...event, payload: { ...payload, round: 2 } }])).toBeNull();
  });

  it("recomputes retained finite certificates rather than trusting a digest-consistent claim", () => {
    const witness = { n: "2521", x: "636", y: "69748", z: "131876031" };
    const attempted = { phase: "ATTEMPTED" as const, round: 1, contract: root,
      attempt: { providerName: "codex-local" as const, modelName: "gpt-6-sol", threadId: "solver-1",
        attemptType: "PARTIAL" as const, argument: "A finite example only.", candidateCounterexample: null,
        selfChecks: [], limitations: ["No general proof."], erdosStrausWitnesses: [witness],
        usage: { inputTokens: 10, cachedInputTokens: 0, outputTokens: 10, reasoningOutputTokens: 0 } } };
    const first = { sequence: 1, round: 1, phase: attempted.phase, payload: attempted, previousDigest: null,
      digest: mathCycleEventDigest(null, attempted) };
    const checked = { phase: "CERTIFICATE_CHECKED" as const, round: 1,
      method: "ERDOS_STRAUS_EXACT_IDENTITY_V1" as const,
      checks: [{ witness, valid: false, identityDigest: null }] };
    const second = { sequence: 2, round: 1, phase: checked.phase, payload: checked, previousDigest: first.digest,
      digest: mathCycleEventDigest(first.digest, checked) };
    expect(validateMathCycleTrace([first, second])).toBeNull();
  });

  it("recomputes a bounded computation and requires independent replay before a V3 attempt", async () => {
    const exactSurveyPlan = { kind: "ERDOS_STRAUS_RESIDUAL_A" as const,
      lowerExclusive: 10_050_000, upperInclusive: 10_052_000, maxA: 47 };
    const context = { threadId: "independent-context", usage: {
      inputTokens: 10, cachedInputTokens: 0, outputTokens: 10, reasoningOutputTokens: 0 } };
    const evidence = surveyResidualInterval(exactSurveyPlan);
    const payloads: MathCycleEventPayload[] = [
      { phase: "PROPOSED" as const, round: 1, proposal: { ...proposal, exactSurveyPlan }, context },
      { phase: "VERIFIED" as const, round: 1, verification, context, accepted: true,
        reason: "The bounded task passed the independent context checks." },
      { phase: "COMPUTED" as const, round: 1, evidence },
    ];
    const chain = (items: MathCycleEventPayload[]) => items.reduce<Array<{ sequence: number; round: number; phase: string;
      payload: MathCycleEventPayload; previousDigest: string | null; digest: string }>>((events, payload) => {
      const previousDigest = events.at(-1)?.digest ?? null;
      events.push({ sequence: events.length + 1, round: 1, phase: payload.phase,
        payload, previousDigest, digest: mathCycleEventDigest(previousDigest, payload) });
      return events;
    }, []);
    expect(validateMathCycleTrace(chain(payloads))?.at(-1)?.phase).toBe("COMPUTED");
    const attempted: MathCycleEventPayload = { phase: "ATTEMPTED", round: 1, contract: root,
      attempt: { providerName: "codex-local", modelName: "gpt-6-sol", threadId: "solver-1",
        attemptType: "PARTIAL", argument: "The finite interval does not prove the root claim.",
        candidateCounterexample: null, selfChecks: [], limitations: ["No general theorem."],
        usage: context.usage } };
    expect(validateMathCycleTrace(chain([...payloads, attempted]))).toBeNull();
    const replay = await runIndependentResidualReplay(evidence);
    expect(replay.status).toBe("PASS");
    expect(validateMathCycleTrace(chain([...payloads,
      { phase: "INDEPENDENT_REPLAY", round: 1, report: replay }, attempted]))?.at(-1)?.phase).toBe("ATTEMPTED");
    const forged = [...payloads];
    forged[2] = { phase: "COMPUTED", round: 1, evidence: { ...evidence, failureCount: 0 } };
    expect(validateMathCycleTrace(chain(forged))).toBeNull();
    const forgedAudit = [...payloads];
    forgedAudit[2] = { phase: "COMPUTED", round: 1, evidence: {
      ...evidence, firstFailureAudit: evidence.firstFailureAudit && {
        ...evidence.firstFailureAudit,
        rows: evidence.firstFailureAudit.rows.map((row, index) => index === 0 ? { ...row, factorPairsChecked: 0 } : row),
      },
    } };
    expect(validateMathCycleTrace(chain(forgedAudit))).toBeNull();
    const downgraded = [...payloads];
    const withoutAudit = { ...evidence };
    delete withoutAudit.firstFailureAudit;
    downgraded[2] = { phase: "COMPUTED", round: 1, evidence: withoutAudit };
    expect(() => chain(downgraded)).toThrow();
    const historicalEvidence = { ...surveyResidualInterval(exactSurveyPlan, "ERDOS_STRAUS_RESIDUAL_SURVEY_V2") };
    delete historicalEvidence.firstFailureAudit;
    const historical = [...payloads];
    historical[2] = { phase: "COMPUTED", round: 1, evidence: historicalEvidence };
    expect(validateMathCycleTrace(chain(historical))?.at(-1)?.phase).toBe("COMPUTED");
  });

  it("stops before a model call at call, observed-token or deadline limits", () => {
    const now = new Date("2026-09-28T00:00:00Z");
    const base = { callsStarted: 4, maxCalls: 5, observedTokens: 9_000,
      maxObservedTokens: 10_000, deadlineAt: new Date("2026-09-28T00:01:00Z"), now };
    expect(cycleResourceStopReason(base)).toBeNull();
    expect(cycleResourceStopReason({ ...base, callsStarted: 5 })).toBe("ROUND_LIMIT");
    expect(cycleResourceStopReason({ ...base, observedTokens: 10_000 })).toBe("TOKEN_LIMIT");
    expect(cycleResourceStopReason({ ...base, now: new Date("2026-09-28T00:01:00Z") })).toBe("TIME_LIMIT");
  });
});
