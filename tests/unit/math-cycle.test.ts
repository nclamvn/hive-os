import { describe, expect, it } from "vitest";

import {
  cycleResourceStopReason, mathCycleEventDigest, mathCycleLimitsSchema, taskContract,
  verifyMathCycleProposal,
} from "@/modules/research-sandbox/math-cycle";
import { validateMathCycleTrace } from "@/modules/research-sandbox/math-cycle-kernel";
import { surveyResidualInterval } from "@/modules/research-sandbox/math-certificates";
import { resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
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

  it("recomputes a bounded computation event even if a forged result has a valid chain digest", () => {
    const exactSurveyPlan = { kind: "ERDOS_STRAUS_RESIDUAL_A" as const,
      lowerExclusive: 10_050_000, upperInclusive: 10_052_000, maxA: 47 };
    const context = { threadId: "independent-context", usage: {
      inputTokens: 10, cachedInputTokens: 0, outputTokens: 10, reasoningOutputTokens: 0 } };
    const evidence = surveyResidualInterval(exactSurveyPlan);
    const payloads = [
      { phase: "PROPOSED" as const, round: 1, proposal: { ...proposal, exactSurveyPlan }, context },
      { phase: "VERIFIED" as const, round: 1, verification, context, accepted: true,
        reason: "The bounded task passed the independent context checks." },
      { phase: "COMPUTED" as const, round: 1, evidence },
    ];
    const chain = (items: typeof payloads) => items.reduce<Array<{ sequence: number; round: number; phase: string;
      payload: (typeof payloads)[number]; previousDigest: string | null; digest: string }>>((events, payload) => {
      const previousDigest = events.at(-1)?.digest ?? null;
      events.push({ sequence: events.length + 1, round: 1, phase: payload.phase,
        payload, previousDigest, digest: mathCycleEventDigest(previousDigest, payload) });
      return events;
    }, []);
    expect(validateMathCycleTrace(chain(payloads))?.at(-1)?.phase).toBe("COMPUTED");
    const forged = [...payloads];
    forged[2] = { phase: "COMPUTED", round: 1, evidence: { ...evidence, failureCount: 0 } };
    expect(validateMathCycleTrace(chain(forged))).toBeNull();
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
