import { describe, expect, it } from "vitest";

import { verifyErdosStrausPolynomialFamily } from "@/modules/research-sandbox/math-parametric";
import { verifyErdosStrausWitness } from "@/modules/research-sandbox/math-certificates";
import { mathCycleEventDigest, type MathCycleEventPayload } from "@/modules/research-sandbox/math-cycle";
import { validateMathCycleTrace } from "@/modules/research-sandbox/math-cycle-kernel";
import { resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";

const family = {
  method: "ERDOS_STRAUS_POLYNOMIAL_FAMILY_V1" as const,
  parameter: "t>=0" as const,
  n: ["73921", "85680"] as [string, string],
  x: ["18496", "21420"],
  y: ["21702268", "50287700", "29131200"],
  z: ["436356911969216", "2022220537292500", "3514361388457500",
    "2714449585680000", "786227783040000"],
};

const secondFamily = {
  method: "ERDOS_STRAUS_POLYNOMIAL_FAMILY_V1" as const,
  parameter: "t>=0" as const,
  n: ["10051441", "1239000"] as [string, string],
  x: ["2512875", "309750"],
  y: ["429699102750", "105737315250", "6504750000"],
  z: ["115176547501110", "42539088334470", "5237094085860", "214916940000"],
};

const usage = { inputTokens: 10, cachedInputTokens: 0, outputTokens: 10, reasoningOutputTokens: 0 };
const contract = resolveMathPilotContract({ caseType: "OPEN",
  statement: "Does every integer n at least two have an Erdős–Straus decomposition?",
  definitions: "Find positive integer denominators x, y, z for 4/n=1/x+1/y+1/z.",
  assumptions: "Integers and exact arithmetic only.",
  falsificationCriterion: "Give a rigorously checked counterexample to the universal claim.",
  successCriterion: "A general proof with exact quantifiers is required.",
  exclusions: "Finite computation and single progressions do not prove the universal statement." });

function chain(payloads: MathCycleEventPayload[]) {
  return payloads.reduce<Array<{ sequence: number; round: number; phase: string;
    payload: MathCycleEventPayload; previousDigest: string | null; digest: string }>>((events, payload) => {
    const previousDigest = events.at(-1)?.digest ?? null;
    events.push({ sequence: events.length + 1, round: 1, phase: payload.phase,
      payload, previousDigest, digest: mathCycleEventDigest(previousDigest, payload) });
    return events;
  }, []);
}

describe("parametric Erdős–Straus certificate", () => {
  it("proves one primitive infinite progression by a coefficient identity", () => {
    const result = verifyErdosStrausPolynomialFamily(family);
    expect(result).toMatchObject({ valid: true, classification: "PROGRESSION_IDENTITY",
      firstDenominatorOffset: "63" });
    expect(result.identityDigest).toMatch(/^[a-f0-9]{64}$/);
    const at = (coefficients: string[], t: bigint) => coefficients.reduceRight(
      (accumulator, coefficient) => accumulator * t + BigInt(coefficient), BigInt(0));
    const t = BigInt(1999);
    const n = at(family.n, t);
    const x = at(family.x, t);
    expect(n).toBe(BigInt(171348241));
    expect(BigInt(4) * x - n).toBe(BigInt(63));
    expect(verifyErdosStrausWitness({ n: String(n), x: String(x),
      y: String(at(family.y, t)), z: String(at(family.z, t)) }).valid).toBe(true);
  });

  it("rejects a perturbed coefficient and a nonprimitive progression", () => {
    expect(verifyErdosStrausPolynomialFamily({ ...family, z: ["436356911969217", ...family.z.slice(1)] }).valid).toBe(false);
    expect(verifyErdosStrausPolynomialFamily({ ...family, n: ["73921", "62093640"] }).reason)
      .toContain("primitive");
    expect(verifyErdosStrausPolynomialFamily({ ...family, x: ["0", ...family.x.slice(1)] }).valid).toBe(false);
  });

  it("lifts the independently replayed A≤47 failure into a checked A=59 progression", () => {
    expect(verifyErdosStrausPolynomialFamily(secondFamily)).toMatchObject({ valid: true,
      firstDenominatorOffset: "59",
      identityDigest: "26047ecb97cbbc92706e9c506bbc061018b522a2b0a77aa897611dcc4466fe9c" });
    expect(verifyErdosStrausWitness({ n: secondFamily.n[0], x: secondFamily.x[0]!,
      y: secondFamily.y[0]!, z: secondFamily.z[0]! }).valid).toBe(true);
  });

  it("recomputes retained certificate even when an attacker rebuilds the event digest chain", () => {
    const attempted: MathCycleEventPayload = { phase: "ATTEMPTED", round: 1, contract,
      attempt: { providerName: "codex-local", modelName: "gpt-6-sol", threadId: "solver-1",
        attemptType: "PARTIAL", argument: "This covers one progression, not the entire conjecture.",
        candidateCounterexample: null, selfChecks: [], limitations: ["Literature novelty unverified."],
        erdosStrausPolynomialFamilies: [family], usage } };
    const checked: MathCycleEventPayload = { phase: "PARAMETRIC_CHECKED", round: 1,
      checks: [{ family, certificate: verifyErdosStrausPolynomialFamily(family) }] };
    expect(validateMathCycleTrace(chain([attempted, checked]))?.at(-1)?.phase).toBe("PARAMETRIC_CHECKED");
    const forged: MathCycleEventPayload = { ...checked, checks: [{ family,
      certificate: { ...verifyErdosStrausPolynomialFamily(family), identityDigest: "0".repeat(64) } }] };
    expect(validateMathCycleTrace(chain([attempted, forged]))).toBeNull();
    expect(validateMathCycleTrace(chain([{ ...checked, checks: [] }]))).toBeNull();
  });
});
