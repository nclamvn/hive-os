import { describe, expect, it } from "vitest";
import { normalizedCoreFiniteBound } from "@/modules/research-sandbox/math-normalized-core-bound";

const B = BigInt;
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
describe("exact universal normalized-core finite bound", () => {
  it("checks the four residual constants with exact BigInt arithmetic", () => {
    const ps = ["131433121", "159727681", "351121", "171348241"].map(B);
    expect(ps.map((p) => String(normalizedCoreFiniteBound(p).maxCore))).toEqual([
      "359888887711080", "531519451560720", "2568530580", "611671279318260"]);
    for (const p of ps) expect(normalizedCoreFiniteBound(p).maxCore).toBe((p + B(3)) * (p + B(7)) / B(48));
    const large = B("100000000000000000000000000000000000000000000000001");
    expect(normalizedCoreFiniteBound(large).maxCore).toBe((large + B(3)) * (large + B(7)) / B(48));
  });
  it("is sharp for p3mod4 and valid at the non-strict p2 monotonicity boundary", () => {
    for (let p = B(3); p < B(1000); p += B(4)) {
      const t = (p + B(1)) / B(4), A = t + B(1), u = t, m = A * u;
      expect(A * p + u).toBe(B(4) * m - B(1));
      expect(normalizedCoreFiniteBound(p).maxCore).toBe(m);
    }
    expect(normalizedCoreFiniteBound(B(2))).toEqual({ t0: B(1), denominator: B(2), maxCore: B(1) });
    expect(() => normalizedCoreFiniteBound(B(1))).toThrow(RangeError);
  });
  it("independently scans finite positive divisor pairs and Q1..8 without signed vectors", () => {
    let checked = 0;
    for (let m = 1; m <= 512; m++) {
      const ds = Array.from({ length: m }, (_, i) => i + 1).filter((d) => m % d === 0);
      for (const A of ds) for (const u of ds) {
        if (m % (A * u) || gcd(A, u) !== 1) continue;
        for (let Q = 1; Q <= 8; Q++) {
          const numerator = (4 * m - 1) * Q - u;
          if (numerator < 2 * A || numerator % A) continue;
          const p = B(numerator / A);
          expect(B(m)).toBeLessThanOrEqual(normalizedCoreFiniteBound(p).maxCore);
          checked++;
        }
      }
    }
    expect(checked).toBeGreaterThan(10000);
  });
});
