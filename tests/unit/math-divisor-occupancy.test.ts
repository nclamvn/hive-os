import { describe, expect, it } from "vitest";
import { auditAllDyadicEligibility, auditAllPrimePowerCoreEligibility, classifyDivisorOccupancy, divisorOccupancyAtlas } from "@/modules/research-sandbox/math-divisor-occupancy";

describe("normalized subgroup occupancy", () => {
  it("partitions negative-character misses without equating subgroup membership with eligibility", () => {
    expect(classifyDivisorOccupancy(131433121, 11)).toMatchObject({ classification: "EXPONENT_WINDOW_OBSTRUCTION", subgroupOrder: 5 });
    expect(classifyDivisorOccupancy(159727681, 31)).toMatchObject({ classification: "SUBGROUP_OBSTRUCTION", subgroupOrder: 5, primePowerTest: 25 });
    expect(classifyDivisorOccupancy(159727681, 791)).toMatchObject({ classification: "ELIGIBLE", primePowerTest: null });
    expect(classifyDivisorOccupancy(1, 31).classification).toBe("CHARACTER_OBSTRUCTION");
    for (let s = 3; s <= 255; s += 4) {
      const a = divisorOccupancyAtlas(s);
      expect(a.negativeCharacterCount).toBe(a.subgroupObstructions.length + a.exponentWindowObstructions.length + a.usableResidues.length);
      expect(a.subgroup).not.toContain(s - 1);
    }
  });
  it("has exact dyadic saturation even for composite Mersenne-type moduli", () => {
    expect(divisorOccupancyAtlas(3)).toMatchObject({ subgroup: [1], usableResidues: [2], saturated: true, primePowerCore: null });
    for (const e of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const a = divisorOccupancyAtlas(2 ** (e + 2) - 1);
      expect(a.primePowerCore).toMatchObject({ prime: 2, exponent: e, order: e + 2, predictedResidues: e + 2, saturated: true });
      expect(a.exponentWindowObstructions).toHaveLength(0);
    }
  });
  it("keeps an odd-prime-power exponent window strictly smaller than its full cyclic envelope", () => {
    for (const [q, e] of [[3, 1], [3, 2], [3, 3], [5, 1], [5, 2], [7, 2], [11, 2]]) {
      const a = divisorOccupancyAtlas(4 * q ** e - 1);
      expect(a.primePowerCore).toMatchObject({ prime: q, exponent: e, predictedResidues: 2 * e + 1, saturated: false });
      expect(a.primePowerCore!.order).toBeGreaterThan(2 * e + 1);
    }
  });
  it("does not use the prime power membership equation as a composite-modulus certificate", () => {
    const a = divisorOccupancyAtlas(15);
    // 7^4=1 mod15, but 7 is outside <2>; this test would be unsound on composites.
    expect(a.subgroup).not.toContain(7);
    expect(classifyDivisorOccupancy(8, 15).primePowerTest).toBeNull();
    for (const p of [-1, 200000001, 1.5]) expect(() => classifyDivisorOccupancy(p, 31)).toThrow();
    for (const s of [0, 4, 4099]) expect(() => divisorOccupancyAtlas(s)).toThrow();
  });
  it("excludes the entire dyadic subfamily for named primes using finite rows plus a proven tail cutoff", () => {
    const hard = auditAllDyadicEligibility(159727681);
    expect(hard).toMatchObject({ firstT: null, hits: [], cutoffT: 29, tailMinimumResidue: "268435455",
      status: "NO_DYADIC_ELIGIBILITY_FOR_THIS_P" });
    expect(hard.rows[0]).toEqual({ t: 2, s: "3", residue: "1", matchingPower: null });
    expect(auditAllDyadicEligibility(131433121)).toMatchObject({ firstT: null, hits: [], cutoffT: 28 });
    expect(auditAllDyadicEligibility(351121)).toMatchObject({ firstT: 5 });
    expect(auditAllDyadicEligibility(171348241)).toMatchObject({ firstT: 7 });
    for (const p of [841, 2522, 200000001]) expect(() => auditAllDyadicEligibility(p)).toThrow();
  });
  it("exhausts all single-prime cores without scanning millions of degree-one bases", () => {
    for (const p of [131433121, 159727681]) expect(auditAllPrimePowerCoreEligibility(p)).toMatchObject({
      hits: [], status: "NO_PRIME_POWER_CORE_ELIGIBILITY_FOR_THIS_P", tailFromS: 2 * p + 2 });
    expect(auditAllPrimePowerCoreEligibility(351121).hits.map((h) => h.s)).toEqual([31]);
    expect(auditAllPrimePowerCoreEligibility(171348241).hits.map((h) => h.s)).toEqual([127, 3235]);
    expect(() => auditAllPrimePowerCoreEligibility(841)).toThrow();
  });
});
