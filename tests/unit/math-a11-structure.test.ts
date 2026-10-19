import { describe, expect, it } from "vitest";

import { a11SignedBoxIsClosed, analyzeA11ResidualPrime, validateA11Profile, type A11Weights } from "@/modules/research-sandbox/math-a11-structure";
import { verifyErdos242StrictWitness } from "@/modules/research-sandbox/math-certificates";

describe("exact fixed-A=11 obstruction structure", () => {
  it("matches every saturation-capped finite-group profile with direct signed-sum enumeration", () => {
    let checked = 0;
    for (let a = 0; a <= 5; a++) for (let b = 0; b <= 2; b++)
      for (let c = 0; c <= 5; c++) for (let d = 0; d <= 2; d++) for (let e = 0; e <= 1; e++) {
        const weights: A11Weights = [a, b, c, d, e];
        let sums = new Set([0]);
        weights.forEach((bound, index) => {
          const next = new Set<number>();
          for (const sum of sums) for (let t = -bound; t <= bound; t++) next.add(((sum + (index + 1) * t) % 10 + 10) % 10);
          sums = next;
        });
        expect(a11SignedBoxIsClosed(weights), weights.join(",")).toBe(!sums.has(5));
        checked++;
      }
    expect(checked).toBe(648);
    expect(a11SignedBoxIsClosed([10, 0, 0, 0, 0])).toBe(false);
    expect(() => a11SignedBoxIsClosed([-1, 0, 0, 0, 0])).toThrow();
  });

  it("retains a thin obstruction despite nonresidue factors, and a pure QR obstruction", () => {
    expect(analyzeA11ResidualPrime(2521)).toMatchObject({ x: 633, weights: [2, 1, 0, 0, 0],
      status: "OBSTRUCTED", obstruction: "THIN_PRIMITIVE", witness: null });
    expect(analyzeA11ResidualPrime(171_348_241)).toMatchObject({ status: "OBSTRUCTED", obstruction: "QR_ONLY" });
  });

  it("detects a Type I rescue that an x-only Type II filter would miss", () => {
    const result = analyzeA11ResidualPrime(26041);
    expect(result).toMatchObject({ x: 6513, weights: [2, 2, 0, 0, 0],
      status: "WITNESS", typeIIStatus: "OBSTRUCTED", obstruction: null });
    expect(verifyErdos242StrictWitness(result.witness!).valid).toBe(true);
    expect(BigInt(result.witness!.y) % BigInt(26041)).not.toBe(BigInt(0));
    expect(result.profileDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(validateA11Profile(result)).toBe(true);
    expect(validateA11Profile({ ...result, status: "OBSTRUCTED", witness: null })).toBe(false);
    expect(() => analyzeA11ResidualPrime(841)).toThrow();
  });
});
