import { describe, expect, it } from "vitest";

import { A19_CAPS, A19_CLOSED_MAXIMA, a19ObstructionBoxes, analyzeA19ResidualPrime, validateA19Profile, type A19Weights } from "@/modules/research-sandbox/math-a19-structure";
import { verifyErdos242StrictWitness } from "@/modules/research-sandbox/math-certificates";

function reachable(w: A19Weights): Set<number> {
  let rs = new Set([0]);
  w.forEach((bound, i) => {
    const next = new Set<number>();
    for (const r of rs) for (let t = -bound; t <= bound; t++) next.add(((r + (i + 1) * t) % 18 + 18) % 18);
    rs = next;
  });
  return rs;
}

describe("exact A=19 forced-factor antichain", () => {
  it("reconstructs all 230 closed profiles and checks every capped boundary transition", () => {
    const profiles = new Map<string, A19Weights>();
    const visit = (box: Readonly<A19Weights>, w: number[]) => {
      if (w.length === 9) {
        if (w[1]! >= 1) profiles.set(w.join(","), w as A19Weights);
        return;
      }
      for (let v = 0; v <= box[w.length]!; v++) visit(box, [...w, v]);
    };
    A19_CLOSED_MAXIMA.forEach((box) => visit(box, []));
    A19_CLOSED_MAXIMA.forEach((box, i) => {
      if (i === 4) return; // Pure QR box alone may conceal uncapped even valuation.
      expect(box.reduce((sum, e) => sum + e, 0)).toBeLessThanOrEqual(7);
      box.forEach((e, j) => expect(e).toBeLessThan(A19_CAPS[j]!));
    });
    expect(profiles.size).toBe(230);
    expect(profiles.has("0,1,0,0,0,0,0,0,0")).toBe(true);
    for (const w of profiles.values()) {
      const rs = reachable(w);
      expect(rs.has(9)).toBe(false);
      expect(a19ObstructionBoxes(w).length).toBeGreaterThan(0);
      if (w.some((e, i) => i % 2 === 0 && e > 0)) {
        const stabilizer = Array.from({ length: 18 }, (_, h) => h)
          .filter((h) => [...rs].every((r) => rs.has((r + h) % 18)));
        expect(stabilizer).toEqual([0]);
        expect(rs.size).toBeGreaterThanOrEqual(2 * w.reduce((sum, e) => sum + e, 0) + 3);
      }
      for (let i = 0; i < 9; i++) {
        const v = w.map((e, j) => Math.min(e + Number(j === i), A19_CAPS[j]!)) as A19Weights;
        expect(a19ObstructionBoxes(v).length > 0).toBe(profiles.has(v.join(",")));
        if (!profiles.has(v.join(","))) expect(reachable(v).has(9), v.join(",")).toBe(true);
      }
    }
    expect(a19ObstructionBoxes([0, 100, 0, 100, 0, 100, 0, 100, 0])).toEqual([5]);
    expect(a19ObstructionBoxes([7, 1, 0, 0, 0, 0, 0, 0, 0])).toEqual([]);
    expect(() => a19ObstructionBoxes([0, 0, 0, 0, 0, 0, 0, 0, 0])).toThrow();
    expect(() => a19ObstructionBoxes([-1, 1, 0, 0, 0, 0, 0, 0, 0])).toThrow();
  });

  it("does not infer an A19 rescue from a forced five and a nonresidue", () => {
    expect(analyzeA19ResidualPrime(2521)).toMatchObject({ x: 635,
      weights: [0, 1, 0, 0, 2, 0, 0, 0, 0], nonIdentityValuation: 3,
      status: "OBSTRUCTED", obstructionBoxes: [1, 2] });
    expect(analyzeA19ResidualPrime(131041)).toMatchObject({ status: "OBSTRUCTED", obstructionBoxes: [5] });
  });

  it("constructs a strict Type I rescue for a surviving early-gate prime", () => {
    const result = analyzeA19ResidualPrime(47041);
    expect(result).toMatchObject({ status: "WITNESS", typeIIStatus: "OBSTRUCTED", divisor: "905" });
    expect(verifyErdos242StrictWitness(result.witness!).valid).toBe(true);
    expect(BigInt(result.witness!.y) % BigInt(47041)).not.toBe(BigInt(0));
    expect(validateA19Profile(result)).toBe(true);
    expect(validateA19Profile({ ...result, obstructionBoxes: [5] })).toBe(false);
    expect(() => analyzeA19ResidualPrime(841)).toThrow();
    expect(() => analyzeA19ResidualPrime(200_000_001)).toThrow();
  });
});
