import { describe, expect, it } from "vitest";
import { minimumCoreSupportCertificate, mixedCoreCollisionAtlas, mixedCoreReplayProjection, mixedCoreResearchPacket, searchTwoCoreDivisor } from "@/modules/research-sandbox/math-mixed-core";
import { compareMixedCoreReplay, replayMixedCorePacket } from "@/modules/research-sandbox/math-mixed-core-replay";
import { divisorCharacterAtlas } from "@/modules/research-sandbox/math-divisor-character";

describe("mixed-core structural research diagnostics", () => {
  it("agrees with the historical signed atlas without widening its domain", () => {
    for (let m = 1; m <= 128; m++) {
      const newAtlas = mixedCoreCollisionAtlas(m), old = divisorCharacterAtlas(4 * m - 1);
      expect(newAtlas.pairCount).toBe(old.pairCount);
      expect(newAtlas.residueCount).toBe(old.usableResidues.length);
      expect(newAtlas.residueCount).toBeLessThanOrEqual(newAtlas.knownRelationBound);
    }
    for (let a = 2; a <= 10; a++) expect(mixedCoreCollisionAtlas(2 ** a)).toMatchObject({ knownRelationBound: a + 2, residueCount: a + 2 });
    expect(() => divisorCharacterAtlas(4895)).toThrow();
  });
  it("retains a Pell collision disproving equality with the universal-relation bound", () => {
    expect(mixedCoreCollisionAtlas(36)).toMatchObject({ pairCount: 25, knownEdges: 3, knownRelationBound: 22, residueCount: 22 });
    expect(mixedCoreCollisionAtlas(1224)).toMatchObject({ s: 4895, pairCount: 105, knownEdges: 12,
      knownRelationBound: 93, residueCount: 92, extraCollisions: 1 });
  });
  it("distinguishes a bounded two-core miss from exact minimum support", () => {
    expect(searchTwoCoreDivisor(159727681, 1134)).toMatchObject({ status: "NOT_FOUND_IN_TWO_CORE_S_INTERVAL", witness: null });
    expect(searchTwoCoreDivisor(159727681, 1135)).toMatchObject({ status: "WITNESS", firstS: 1135,
      construction: { a: 4, u: 71, v: 562917, k: 1 },
      witness: { n: "159727681", x: "39967107", y: "45362661404", z: "359653708021908" } });
    expect(minimumCoreSupportCertificate(159727681, 1134)).toMatchObject({ minimumSupport: null, status: "UNRESOLVED" });
    for (const [p, s] of [[131433121, 143], [159727681, 1135]]) {
      expect(minimumCoreSupportCertificate(p, s)).toMatchObject({ minimumSupport: 2, status: "EXACT_FOR_THIS_NORMALIZED_FAMILY", singleCore: { hitS: [] } });
    }
    for (const p of [351121, 171348241]) expect(minimumCoreSupportCertificate(p, 4095).minimumSupport).toBe(1);
  });
  it("fails closed on invalid arithmetic domains", () => {
    for (const m of [0, -1, 1.5, 4097, NaN]) expect(() => mixedCoreCollisionAtlas(m)).toThrow();
    for (const p of [841, 2522, 200000001, NaN]) expect(() => searchTwoCoreDivisor(p, 143)).toThrow();
    for (const s of [2, 4096, 1135.5, Infinity]) expect(() => searchTwoCoreDivisor(159727681, s)).toThrow();
  });
  it("replays all negative/positive controls and collision hashes independently", async () => {
    const packet = mixedCoreResearchPacket();
    expect(packet.finiteCollisionAudit).toMatchObject({ maxM: 1024, rows: 1024, extraCollisionRows: 0 });
    expect(packet.pellCounterexample.residue).toBe(3739);
    expect((await replayMixedCorePacket(packet)).status).toBe("PASS");
    const projection = mixedCoreReplayProjection(packet);
    expect(compareMixedCoreReplay(packet, projection)).toBe("PASS");
    const corrupt = structuredClone(projection);
    corrupt.certificates[1].minimumSupport = 1;
    expect(compareMixedCoreReplay(packet, corrupt)).toBe("MISMATCH");
    const collision = structuredClone(projection);
    collision.pellCounterexample.atlas.residueCount = 93;
    expect(compareMixedCoreReplay(packet, collision)).toBe("MISMATCH");
    expect(compareMixedCoreReplay(packet, { ...projection, unknown: true })).toBe("MISMATCH");
    expect(compareMixedCoreReplay(packet, null)).toBe("MISMATCH");
  });
});
