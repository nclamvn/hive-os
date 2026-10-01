import { describe, expect, it } from "vitest";
import { divisorCharacterAtlas, divisorMenuCharacterBarrier, firstCharacterDivisor, jacobiSymbol, searchCharacterFiltered } from "@/modules/research-sandbox/math-divisor-character";
import { primeDivisorResidueAtlas, searchDivisorLed } from "@/modules/research-sandbox/math-divisor-led";

describe("composite character obstruction", () => {
  it("keeps a Jacobi +1 value distinct from quadratic residuosity", () => {
    expect(jacobiSymbol(2, 15)).toBe(1); // 2 is not a square modulo 15.
    expect(jacobiSymbol(3, 15)).toBe(0);
    expect(jacobiSymbol(131433121, 143)).toBe(-1);
    for (const args of [[1, 2], [-1, 3], [1, 0], [1.5, 3]]) expect(() => jacobiSymbol(args[0], args[1])).toThrow();
  });
  it("extends exact signed-factor eligibility to composite s without promoting the character", () => {
    for (const q of [7, 11, 19, 23, 127]) expect(divisorCharacterAtlas(q).usableResidues).toEqual(primeDivisorResidueAtlas(q).usableResidues);
    const composite = divisorCharacterAtlas(143);
    expect(composite.usableResidues).toContain(131433121 % 143);
    expect(composite.negativeCharacterMisses.length).toBeGreaterThan(0);
    expect(divisorCharacterAtlas(11).negativeCharacterMisses).toContain(2);
    for (let s = 3; s <= 255; s += 4) {
      const a = divisorCharacterAtlas(s);
      expect(a.pairCount).toBe(a.core.reduce((n, f) => n * (2 * f.exponent + 1), 1));
      expect(a.usableResidues.every((r) => jacobiSymbol(r, s) === -1)).toBe(true);
    }
    expect(() => divisorCharacterAtlas(4099)).toThrow();
    expect(() => divisorCharacterAtlas(4)).toThrow();
  });
  it("counts independent character coordinates, not all obstruction classes", () => {
    expect(divisorMenuCharacterBarrier(19)).toMatchObject({ rank: 2, externalPrimes: [11, 19], blindClassDenominator: "4" });
    expect(divisorMenuCharacterBarrier(63)).toMatchObject({ rank: 9, blindClassDenominator: "512" });
    expect(divisorMenuCharacterBarrier(143)).toMatchObject({ rank: 21, blindClassDenominator: "2097152" });
    expect(divisorMenuCharacterBarrier(39).generators).toContainEqual({ q: 13, s: 39 });
    expect(divisorMenuCharacterBarrier(38).externalPrimes).not.toContain(13);
    expect(() => divisorMenuCharacterBarrier(4096)).toThrow();
  });
  it("proves the exact least character divisor formula while retaining witness gaps", () => {
    expect(firstCharacterDivisor(131433121, 143)).toMatchObject({ firstS: 11, q3: 11 });
    expect(firstCharacterDivisor(171348241, 83)).toMatchObject({ firstS: 51, q1: 17 });
    expect(firstCharacterDivisor(351121, 19)).toMatchObject({ firstS: null, negativeCount: 0 });
    expect(firstCharacterDivisor(351121, 31)).toMatchObject({ firstS: 31 });
    expect(firstCharacterDivisor(159727681, 791)).toMatchObject({ firstS: 31 });
    expect(() => firstCharacterDivisor(841, 143)).toThrow();
  });
  it("prunes losslessly without rewriting the original search or its bounded misses", () => {
    for (const p of [2521, 351121, 131041, 131433121, 171348241, 159727681]) for (const bound of [19, 143, 791]) {
      const raw = searchDivisorLed(p, bound), filtered = searchCharacterFiltered(p, bound);
      for (const key of ["status", "firstS", "construction", "witness", "strictDigest"] as const) expect(filtered[key]).toEqual(raw[key]);
      expect(filtered.checkedS + filtered.skippedS).toBe(Math.floor(((filtered.firstS ?? bound) + 1) / 4));
    }
    expect(searchCharacterFiltered(159727681, 791).skippedS).toBeGreaterThan(0);
  });
});
