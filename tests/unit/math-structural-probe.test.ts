import { describe, expect, it } from "vitest";

import { mathCycleEventDigest, priorFiniteFindingFromTrace,
  type MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";
import { validateMathCycleTrace } from "@/modules/research-sandbox/math-cycle-kernel";
import { runStructuralProbe, scanStructuralProbe, structuralProbePlanSchema,
  validateStructuralProbeReport } from "@/modules/research-sandbox/math-structural-probe";

const residuePlan = structuralProbePlanSchema.parse({
  kind: "FAILED_GATE_FORCES_PRIME_RESIDUE", targetA: 23, failedThroughA: 23,
  upperInclusive: 4_037_881, expectedPrimeResidue: 4,
  divisorConditions: [], nonmultipleConditions: [],
});
const crossGatePlan = structuralProbePlanSchema.parse({
  kind: "GATE_MUST_OPEN", targetA: 23, failedThroughA: 19,
  upperInclusive: 4_037_881, expectedPrimeResidue: null,
  divisorConditions: [{ gateA: 15, modulus: 23, residue: 3 },
    { gateA: 19, modulus: 23, residue: 21 }],
  nonmultipleConditions: [{ gateA: 19, modulus: 23 }],
});

describe("proposal-time structural falsification", () => {
  it("rejects malformed or unbounded predicates", () => {
    expect(structuralProbePlanSchema.safeParse({ ...residuePlan, upperInclusive: 100_000_000 }).success).toBe(false);
    expect(structuralProbePlanSchema.safeParse({ ...crossGatePlan, failedThroughA: 11 }).success).toBe(false);
    expect(structuralProbePlanSchema.safeParse({ ...crossGatePlan, divisorConditions: [
      { gateA: 15, modulus: 23, residue: 23 }] }).success).toBe(false);
  });

  it("finds and independently replays refutations of both A=23 implications", async () => {
    for (const [plan, expectedPrime] of [[residuePlan, 99_961], [crossGatePlan, 4_037_881]] as const) {
      const report = await runStructuralProbe(plan);
      expect(report.status).toBe("REFUTED");
      expect(report.candidate?.prime).toBe(expectedPrime);
      expect(report.independentReplay).toMatchObject({ status: "PASS", candidate: {
        prime: report.candidate?.prime, failedThroughA: 23 } });
      expect(validateStructuralProbeReport(plan, report)).toBe(true);
      expect(priorFiniteFindingFromTrace({ cycleId: "11735863-a80f-496e-b4b9-592d5ebed830",
        sourceLedgerDigest: "a".repeat(64), trace: [{ phase: "STRUCTURAL_PROBED", round: 1, report }] }))
        .toMatchObject({ prime: expectedPrime, failedThroughA: 23,
          replayDigest: report.independentReplay!.reportDigest });
      expect(validateStructuralProbeReport(plan, { ...report, eligiblePrimesTested: 0 })).toBe(false);
      expect(validateStructuralProbeReport(plan, { ...report, candidate: {
        ...report.candidate!, divisorWitnesses: [1, 1] } })).toBe(false);
    }
  }, 30_000);

  it("labels a small negative search as finite only and binds the new event to the proposal", async () => {
    const plan = { ...residuePlan, upperInclusive: 2_521 };
    const scan = scanStructuralProbe(plan);
    expect(scan.candidate).toBeNull();
    const report = await runStructuralProbe(plan);
    expect(report.status).toBe("NOT_REFUTED_IN_BOUND");
    expect(report.independentReplay).toBeNull();
    expect(validateStructuralProbeReport(plan, report)).toBe(true);
    const proposed: MathCycleEventPayload = { phase: "PROPOSED", round: 1,
      proposal: { sourceGap: "The hard survivor relation is not known.",
        hypothesis: "A narrowly typed conditional may open a later fixed gate.",
        taskStatement: "For prime p=1 mod 840, test this conditional at A=23.",
        falsificationPlan: "Search exact finite prime instances and replay a counterexample.",
        successEvidence: "A general proof would be needed beyond finite non-refutation.",
        rationale: "The typed test can reject the candidate without claiming a theorem.",
        structuralProbePlan: plan },
      context: { threadId: "planner", usage: { inputTokens: 1, cachedInputTokens: 0,
        outputTokens: 1, reasoningOutputTokens: 0 } } };
    const probed: MathCycleEventPayload = { phase: "STRUCTURAL_PROBED", round: 1, report };
    const first = { sequence: 1, round: 1, phase: proposed.phase, payload: proposed,
      previousDigest: null, digest: mathCycleEventDigest(null, proposed) };
    const second = { sequence: 2, round: 1, phase: probed.phase, payload: probed,
      previousDigest: first.digest, digest: mathCycleEventDigest(first.digest, probed) };
    expect(validateMathCycleTrace([first, second])).toEqual([proposed, probed]);
    const tampered = { ...probed, report: { ...report, status: "REFUTED" as const } };
    expect(validateMathCycleTrace([first, { ...second, payload: tampered,
      digest: mathCycleEventDigest(first.digest, tampered) }])).toBeNull();
  }, 30_000);
});
