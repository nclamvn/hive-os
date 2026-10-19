import { describe, expect, it } from "vitest";

import { analyzeA11ResidualPrime } from "@/modules/research-sandbox/math-a11-structure";
import { analyzeA19ResidualPrime } from "@/modules/research-sandbox/math-a19-structure";
import { analyzeNeutralCorridor, neutralCorridorFamily, neutralModulatorFamily, searchModulatorBox, validateModulatorEvidence } from "@/modules/research-sandbox/math-adaptive-corridor";
import { searchResidualPrime, verifyErdos242StrictWitness } from "@/modules/research-sandbox/math-certificates";

describe("neutral cross-shift barriers and free modulator search", () => {
  it("constructs admissible linear forms without claiming simultaneous primality", () => {
    const family = neutralCorridorFamily([3, 7, 11, 15, 19]);
    expect(family.spacing).toBe("351120");
    expect(family.infinitePrimeStatus).toBe("CONDITIONAL_ON_DICKSON_NOT_PROVED");
    const all = neutralCorridorFamily(Array.from({ length: 16 }, (_, i) => 4 * i + 3));
    for (const { a, core, slope } of all.cofactorSlopes) {
      expect(BigInt(slope) % BigInt(a)).toBe(BigInt(0));
      expect(BigInt(slope) * BigInt(4 * core)).toBe(BigInt(all.spacing));
    }
    expect(() => neutralCorridorFamily([11, 11])).toThrow();
    expect(() => neutralCorridorFamily([19, 11])).toThrow();
    expect(() => neutralCorridorFamily([67])).toThrow();
  });

  it("independently matches the exact A11 and A19 obstructions on a neutral tuple", () => {
    const result = analyzeNeutralCorridor([11, 19], 102)!;
    expect(result.n).toBe(17907121);
    expect(result.rows).toMatchObject([{ a: 11, cofactor: 1492261 }, { a: 19, cofactor: 895357 }]);
    expect(analyzeA11ResidualPrime(result.n).obstruction).toBe("QR_ONLY");
    const a19 = analyzeA19ResidualPrime(result.n);
    expect(a19.weights).toEqual([0, 1, 0, 0, 0, 0, 0, 0, 0]);
    expect(a19.obstructionBoxes).toContain(5); // Boxes overlap at the forced-factor base.
    expect(analyzeNeutralCorridor([11, 19], 1)).toBeNull();
    expect(() => analyzeNeutralCorridor([11, 19], 0)).toThrow();
    expect(() => analyzeNeutralCorridor([11, 19], 100000)).toThrow();
  });

  it("escapes the hard small-shift control with a verified, distinct Type II tuple", () => {
    const result = searchModulatorBox(171348241, 8);
    expect(result).toMatchObject({ status: "WITNESS", minimumDepth: 4,
      construction: { a: 4, u: 1, s: 127, v: 5396795, k: 8, shift: 1349199 } });
    expect(result.witness).toEqual({ n: "171348241", x: "43174360", y: "5483143712", z: "29591402569203040" });
    expect(verifyErdos242StrictWitness(result.witness!).valid).toBe(true);
    expect(validateModulatorEvidence(result)).toBe(true);
    expect(validateModulatorEvidence({ ...result, minimumDepth: 1 })).toBe(false);
    expect(validateModulatorEvidence({ ...result, digest: "0".repeat(64) })).toBe(false);
  });

  it("reports a finite unit-slice miss, not global impossibility or a theorem", () => {
    expect(searchModulatorBox(131041, 1)).toMatchObject({ status: "NOT_FOUND_IN_BOX", minimumDepth: null, witness: null });
    expect(searchModulatorBox(1726201, 8, "UNIT_MODULATOR")).toMatchObject({ status: "NOT_FOUND_IN_BOX", pairsChecked: 8 });
    expect(searchModulatorBox(1726201, 8)).toMatchObject({ status: "WITNESS", minimumDepth: 2,
      construction: { a: 2, u: 1 } });
    expect(() => searchModulatorBox(841, 8)).toThrow();
    expect(() => searchModulatorBox(171348241, 9)).toThrow();
    expect(() => searchModulatorBox(200000001, 1)).toThrow();
  });

  it("retains the full-box refutation and does not increase the declared bound to conceal it", () => {
    const miss = searchModulatorBox(131433121, 8);
    expect(miss).toMatchObject({ status: "NOT_FOUND_IN_BOX", pairsChecked: 43, witness: null });
    expect(validateModulatorEvidence(miss)).toBe(true);
    const otherBranch = searchResidualPrime(131433121, 63);
    expect(otherBranch.firstA).toBe(27);
    expect(verifyErdos242StrictWitness(otherBranch.witness!).valid).toBe(true);
  });

  it("also exposes the conditional blind corridor of fixed modulator boxes", () => {
    const family = neutralModulatorFamily(8);
    expect(family.cofactorSlopes).toHaveLength(43);
    const slopes = new Set([family.primeSlope]);
    for (const { a, core, modulus, slope } of family.cofactorSlopes) {
      expect(BigInt(slope) % BigInt(modulus)).toBe(BigInt(0));
      expect(BigInt(slope) * BigInt(core)).toBe(BigInt(a) * BigInt(family.spacing));
      expect(core).toBeLessThan(modulus - 1);
      slopes.add(slope);
    }
    expect(slopes.size).toBe(44);
    expect(family.infinitePrimeStatus).toBe("CONDITIONAL_ON_DICKSON_NOT_PROVED");
    expect(() => neutralModulatorFamily(9)).toThrow();
    expect(() => neutralModulatorFamily(1.5)).toThrow();
  });
});
