import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { twoCoreTargetAtlas, twoCoreTargetAudit, twoCoreTargetPacket } from "../../scripts/operations/two-core-target";
import { compareTwoCoreTargetReplay, replayTwoCoreTargetPacket, TWO_CORE_TARGET_REPLAY_LIMITS } from "../../scripts/operations/two-core-target-replay";
import { mixedCoreCollisionAtlas, searchTwoCoreDivisor } from "@/modules/research-sandbox/math-mixed-core";
import { verifyErdos242StrictWitness } from "@/modules/research-sandbox/math-certificates";

describe("bounded exact two-core target diagnostics", () => {
  it("reproduces all 1336 signed-box set/cutoff controls", () => {
    const packet = twoCoreTargetPacket();
    expect(packet.finiteAtlas).toEqual({ minA: 1, maxA: 8, maxOddPrime: 997, rowCount: 1336,
      rowsDigest: "c1d4916f901fa2958e54906dd70be40e184487bfb3fe70b303e9588788082758" });
    for (let a = 2; a <= 8; a++) expect(twoCoreTargetAtlas(a, 3)[5]).toBe(3 * 2 ** a - 1);
  });
  it("exhausts a1..4 criterion integers without an s ceiling", () => {
    const packet = twoCoreTargetPacket();
    expect(packet.targetAudits.map((a) => a.manifestDigest)).toEqual([
      "dd9dbf6fad33777fee6c6a283c12f2a719ae6674ff777ca25bf3f14f57c6fbe7",
      "c8916bbb5c5df7f538e65100bfdd6bfc27b7d492744a6e3d2029b8df0f67d9fb",
      "7b3044385060a9302a895f3ff682b1df0f6677fbc16a7d4670554ed68e293433",
      "42db9a004759eb4389322798f54226d5c396dd6f695d6d3ed57ad86baab66b20",
    ]);
    expect(packet.targetAudits[0].manifest).toEqual([[1, [[164407, 20551]]], [2, []], [3, [[12536095, 391753]]], [4, []]]);
    expect(packet.targetAudits[1].manifest).toEqual([[1, []], [2, [[1135, 71], [5007, 313]]], [3, []], [4, []]]);
    expect(packet.scope).toContain("larger a remain uncomputed");
    expect(packet.targetAudits.every((a) => a.sCeiling === null && a.auditedExponents.join() === "1,2,3,4")).toBe(true);
  });
  it("verifies all twelve retained normalized strict Type II identities", () => {
    const packet = twoCoreTargetPacket();
    const all = packet.targetAudits.flatMap((audit) => audit.witnesses);
    expect(all).toHaveLength(12);
    expect(all.slice(0, 4).map((w) => w.strictDigest)).toEqual([
      "8034dd394c6b7ec41fc4af0f7cd2d99fc4af3c737b1b04be48e023bea5913f03",
      "22d1727e7880f89720ce01338d41e00d478f9b98e7e898354e37466c5c28fa63",
      "1aa4d4eb3b4465019d778a7085409bb6ca2c71f0590227d486cde4e4bcf6addc",
      "200af215039f2f6e0b37f0bcc5ba1a9bfb32ee392b1c59650d94ccd63942fce9",
    ]);
    for (const w of all) {
      expect(verifyErdos242StrictWitness(w.witness).benchmarkDigest).toBe(w.strictDigest);
      const p = BigInt(w.witness.n), A = BigInt(w.construction.a), U = BigInt(w.construction.u),
        S = BigInt(w.construction.s), V = BigInt(w.construction.v), K = BigInt(w.construction.k);
      expect(A * p + U).toBe(S * V);
      expect(BigInt(2 ** w.exponent * w.ell)).toBe(A * U * K);
      expect([w.witness.x, w.witness.y, w.witness.z].filter((d) => BigInt(d) % p === BigInt(0))).toHaveLength(2);
    }
  });
  it("replays a different integer-divisor implementation and rejects comparison tampering", () => {
    const packet = twoCoreTargetPacket(), replay = replayTwoCoreTargetPacket(packet);
    expect(replay.status).toBe("PASS");
    expect(replay.primaryDigest).toBe(replay.outputDigest);
    const changed = structuredClone(packet);
    changed.finiteAtlas.rowCount++;
    expect(compareTwoCoreTargetReplay(packet, changed)).toBe("MISMATCH");
    expect(compareTwoCoreTargetReplay(packet, null)).toBe("MISMATCH");
    expect(replayTwoCoreTargetPacket(changed).status).toBe("MISMATCH");
    expect(TWO_CORE_TARGET_REPLAY_LIMITS).toEqual({ timeout: 10000, maxBuffer: 262144 });
  });
  it("CLI exits nonzero when Python is unavailable and does not leak process diagnostics", () => {
    const result = spawnSync(process.execPath, ["--import", "tsx", "scripts/operations/two-core-target-audit.ts"], {
      encoding: "utf8", timeout: 10000, env: { ...process.env, PATH: "/nonexistent-two-core-target" },
    });
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout).replay).toMatchObject({ status: "UNAVAILABLE", outputDigest: null });
    expect(result.stderr).toBe("");
  });
  it("rejects scope widening and preserves historical search/atlas bounds", () => {
    for (const a of [0, 9, 1.5, NaN, Infinity]) expect(() => twoCoreTargetAtlas(a, 3)).toThrow();
    for (const ell of [2, 9, 1009, NaN]) expect(() => twoCoreTargetAtlas(2, ell)).toThrow();
    expect(() => twoCoreTargetAudit(2521)).toThrow();
    expect(() => mixedCoreCollisionAtlas(132840)).toThrow();
    expect(() => searchTwoCoreDivisor(131433121, 164407)).toThrow();
  });
});
