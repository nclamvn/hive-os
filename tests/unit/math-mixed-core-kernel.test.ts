import { describe, expect, it } from "vitest";
import { mixedCoreKernelAtlas, mixedCoreKernelPacket } from "../../scripts/operations/mixed-core-kernel";
import { mixedCoreCollisionAtlas } from "@/modules/research-sandbox/math-mixed-core";

describe("fixed-core kernel research certificates", () => {
  it("preserves old caps and reproduces historical occupancy", () => {
    for (let m = 1; m <= 128; m++) {
      const old = mixedCoreCollisionAtlas(m), next = mixedCoreKernelAtlas(m);
      expect(next.residueCount).toBe(old.residueCount);
      expect(next.residuesDigest).toBe(old.residuesDigest);
      expect(next.knownEdges).toBe(old.knownEdges);
      expect(next.lowerBound).toBeLessThanOrEqual(next.residueCount);
    }
    expect(() => mixedCoreCollisionAtlas(132840)).toThrow();
  });
  it("falsifies exact known-relation occupancy even for prime moduli", () => {
    expect(mixedCoreKernelAtlas(132840)).toMatchObject({ s: 531359, sIsPrime: true,
      pairCount: 567, knownEdges: 40, knownRelationBound: 527, residueCount: 525,
      lowerBound: 525, energy: 651, maxFiber: 2, extraCollisions: 2,
      positiveKernel: [{ A: "531360", U: "1", weight: 40 },
        { A: "537920", U: "6561", h: [6, -8, 1, 2], weight: 2 }] });
    expect(mixedCoreKernelAtlas(360696)).toMatchObject({ s: 1442783, sIsPrime: true,
      pairCount: 567, knownRelationBound: 535, residueCount: 533, lowerBound: 533,
      energy: 635, maxFiber: 2, extraCollisions: 2 });
  });
  it("checks every reported kernel identity with exact integers", () => {
    for (const row of mixedCoreKernelPacket().rows) {
      for (const h of row.positiveKernel) {
        const A = BigInt(h.A), U = BigInt(h.U), m = BigInt(row.m);
        expect(A - U).toBe(BigInt(h.k) * BigInt(row.s));
        expect(m * m % (A * U)).toBe(BigInt(0));
        expect(h.weight).toBeGreaterThan(0);
      }
      expect(row.energy).toBe(row.pairCount + 2 * row.collisionPairs);
      expect(row.residueCount).toBeGreaterThanOrEqual(row.lowerBound);
      expect(row.residueCount).toBeLessThanOrEqual(row.knownRelationBound);
    }
  });
  it("replays the polynomial family's additional matching, not an equality conjecture", () => {
    for (const f of mixedCoreKernelPacket().polynomialFamily) {
      const row = mixedCoreKernelAtlas(Number(f.m));
      expect(BigInt(f.A) - BigInt(f.U)).toBe(BigInt(f.s));
      expect(row.extraCollisions).toBeGreaterThanOrEqual(f.extraMatchingEdges);
      expect(row.positiveKernel).toContainEqual(expect.objectContaining({ A: f.A, U: f.U, weight: f.extraMatchingEdges }));
    }
  });
  it("fails closed outside its separate research domain", () => {
    for (const m of [0, -1, 1.5, NaN, Infinity, 1000001]) expect(() => mixedCoreKernelAtlas(m)).toThrow();
  });
});
