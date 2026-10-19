import { describe, expect, it } from "vitest";

import { auditResidualFailure, hasErdosStrausEquation, isPrimeInSurvey, searchResidualPrime, surveyResidualInterval, verifyErdos242StrictWitness, verifyErdosStrausWitness } from "@/modules/research-sandbox/math-certificates";
import { resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { mathPriorArtFor } from "@/modules/research-sandbox/math-prior-art";

describe("exact Erdős–Straus finite certificates", () => {
  it("accepts a finite witness using an independent BigInt identity", () => {
    const witness = { n: "2521", x: "636", y: "69748", z: "131876031" };
    const checked = verifyErdosStrausWitness(witness);
    expect(checked.classification).toBe("EXACT_IDENTITY");
    expect(checked.identityDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(verifyErdosStrausWitness({ ...witness, z: "131876032" }).valid).toBe(false);
  });

  it("enforces the ordered and distinct public Erdős 242 contract separately from the historical identity", () => {
    const repeated = { n: "4", x: "3", y: "3", z: "3" };
    expect(verifyErdosStrausWitness(repeated).valid).toBe(true);
    expect(verifyErdos242StrictWitness(repeated)).toMatchObject({ valid: false, classification: "INVALID" });
    expect(verifyErdos242StrictWitness({ n: "2", x: "1", y: "2", z: "2" }).valid).toBe(false);
    const witness = { n: "2521", x: "636", y: "69748", z: "131876031" };
    expect(verifyErdos242StrictWitness(witness)).toMatchObject({ valid: true, classification: "STRICT_EXACT_IDENTITY" });
    expect(verifyErdos242StrictWitness({ ...witness, y: witness.z, z: witness.y }).valid).toBe(false);
    expect(verifyErdos242StrictWitness({ ...witness, z: "131876032" }).valid).toBe(false);
    expect(verifyErdos242StrictWitness(witness).benchmarkDigest).toMatch(/^[a-f0-9]{64}$/);
  });

  it("recognizes the scoped residual-prime case without treating it as a general theorem", () => {
    const contract = resolveMathPilotContract({ caseType: "OPEN",
      statement: "For every prime n ≡ 1 (mod 840), do x,y,z exist with 4/n = 1/x + 1/y + 1/z?",
      definitions: "n is prime. x, y, z are strictly positive integers.",
      assumptions: "Ordinary arithmetic.", falsificationCriterion: "A rigorous counterexample.",
      successCriterion: "A universal proof or counterexample.", exclusions: "No finite-to-infinite inference." });
    expect(hasErdosStrausEquation(contract)).toBe(true);
    expect(mathPriorArtFor(contract).length).toBeGreaterThan(0);
  });

  it("rejects malformed values and never equates a finite witness with a theorem", () => {
    expect(verifyErdosStrausWitness({ n: "01", x: "1", y: "1", z: "1" }).valid).toBe(false);
    expect(verifyErdosStrausWitness({ n: "1", x: "1", y: "1", z: "1" }).valid).toBe(false);
    expect(verifyErdosStrausWitness({ n: "3", x: "-1", y: "1", z: "1" }).valid).toBe(false);
  });

  it("exhausts A=3,7,... within a declared bound, and checks its produced tuple", () => {
    expect(isPrimeInSurvey(2521)).toBe(true);
    expect(searchResidualPrime(2521, 19)).toMatchObject({ firstA: null, witness: null });
    const found = searchResidualPrime(2521, 23);
    expect(found.firstA).toBe(23);
    expect(found.witness && verifyErdosStrausWitness(found.witness).valid).toBe(true);
    expect(found.witness && verifyErdos242StrictWitness(found.witness).valid).toBe(true);
    expect(() => searchResidualPrime(841)).toThrow(); // 841 = 29².
    expect(() => searchResidualPrime(2521, 108)).toThrow();
  });

  it("agrees with an independent direct-y scan for the first hard residual prime", () => {
    const n = 2521;
    let firstA: number | null = null;
    for (let a = 3; a <= 23 && firstA === null; a += 4) {
      const x = (n + a) / 4;
      const b = BigInt(n * x);
      const lower = Math.floor(n * x / a) + 1;
      const upper = Math.floor(2 * n * x / a);
      for (let y = lower; y <= upper; y += 1) {
        const denominator = BigInt(a * y) - b;
        if (b * BigInt(y) % denominator === BigInt(0)) { firstA = a; break; }
      }
    }
    expect(firstA).toBe(23);
    expect(searchResidualPrime(n, 23).firstA).toBe(firstA);
  });

  it("finds a prime beyond the baseline that refutes the A≤47 subclaim but not Erdős–Straus", () => {
    expect(isPrimeInSurvey(10_051_441)).toBe(true);
    expect(searchResidualPrime(10_051_441, 47)).toMatchObject({ firstA: null, witness: null });
    const result = searchResidualPrime(10_051_441, 59);
    expect(result.firstA).toBe(59);
    expect(result.witness).toEqual({ n: "10051441", x: "2512875", y: "429699102750", z: "115176547501110" });
    expect(verifyErdosStrausWitness(result.witness!).valid).toBe(true);
  });

  it("finds the first independent-audit failure of A≤59 above 100 million without changing older evidence", () => {
    const n = 171_348_241;
    expect(isPrimeInSurvey(n)).toBe(true);
    expect(searchResidualPrime(n, 59)).toMatchObject({ firstA: null, witness: null });
    const rescue = searchResidualPrime(n, 63);
    expect(rescue.firstA).toBe(63);
    expect(rescue.witness && verifyErdosStrausWitness(rescue.witness).valid).toBe(true);
    expect(() => isPrimeInSurvey(200_000_001)).toThrow();
    const audit = auditResidualFailure(n, 59);
    expect(audit.rows.map((row) => row.a)).toEqual([3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51, 55, 59]);
    expect(audit.rows.every((row) => row.factorPairsChecked > 0 && row.admissiblePairs === 0)).toBe(true);
    expect(audit.auditDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(() => auditResidualFailure(171_348_243, 59)).toThrow();
    expect(() => auditResidualFailure(n, 60)).toThrow();
  });

  it("keeps the newly extended live interval bounded and replayable", () => {
    const plan = { kind: "ERDOS_STRAUS_RESIDUAL_A" as const,
      lowerExclusive: 160_000_000, upperInclusive: 180_000_000, maxA: 59 };
    const evidence = surveyResidualInterval(plan);
    expect(evidence).toMatchObject({ primeCount: 5_483, failureCount: 1,
      firstFailure: { n: 171_348_241, firstA: null },
      firstFailureRescue: { n: 171_348_241, firstA: 63 } });
    expect(evidence.firstFailureAudit?.rows).toHaveLength(15);
    expect(surveyResidualInterval(plan)).toEqual(evidence);
    expect(() => surveyResidualInterval({ ...plan, upperInclusive: 180_000_001 })).toThrow();
    expect(() => surveyResidualInterval({ ...plan, upperInclusive: 200_000_001 })).toThrow();
  });

  it("produces replayable finite interval evidence and rejects resource escape", () => {
    const plan = { kind: "ERDOS_STRAUS_RESIDUAL_A" as const,
      lowerExclusive: 10_000_000, upperInclusive: 10_060_000, maxA: 47 };
    const evidence = surveyResidualInterval(plan);
    expect(evidence).toMatchObject({ method: "ERDOS_STRAUS_RESIDUAL_SURVEY_V3",
      failureCount: 1, firstFailure: { n: 10_051_441, firstA: null },
      firstFailureRescue: { n: 10_051_441, firstA: 59 } });
    expect(evidence.manifestDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(surveyResidualInterval(plan)).toEqual(evidence);
    expect(() => surveyResidualInterval({ ...plan, upperInclusive: 31_000_001 })).toThrow();
    expect(() => surveyResidualInterval({ ...plan, maxA: 48 })).toThrow();
    expect(surveyResidualInterval({ ...plan, lowerExclusive: 840, upperInclusive: 2_521, maxA: 19 })
      .firstFailure?.n).toBe(2_521);
  });
});
