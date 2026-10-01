import { spawnSync } from "node:child_process";
import { performance } from "node:perf_hooks";
import { describe, expect, it, vi } from "vitest";
import { higherpowerCorePacket, higherpowerResidueLowerBound, higherpowerTargetAudit } from "../../scripts/operations/higherpower-core-check";
import { compareHigherpowerReplay, replayHigherpowerCore } from "../../scripts/operations/higherpower-core-replay";
import { loadSquareCoreArtifact, verifySquareCoreArtifact } from "../../scripts/operations/square-core-check";
import { verifyErdos242StrictWitness } from "../../src/modules/research-sandbox/math-certificates";

const packet = higherpowerCorePacket();
const completeTargets = packet.targets.map((target) => {
  if (target.status !== "COMPLETE_FOR_FULL_ODD_PRIME_POWER_CORE") throw new Error("Unexpected partial fixed audit");
  return target;
});
describe("G03 all higher odd-prime-power core audit", () => {
  it("checks 480 image/bound controls and all 71951 cores without a prime/modulus ceiling", () => {
    expect(packet.status).toBe("COMPLETE");
    expect(packet.finiteBoundControls).toMatchObject({ rows: 480, rowsDigest: "891056b800637fa6c37cb6b585215b3035ca92fc84e2eeaf7fad8d97def5a245" });
    expect(completeTargets.map((t) => [t.checkedCores, t.signedPairSlots, t.coreWitnessCount, t.translatedOnlyCoreCount])).toEqual([
      [22060, 3322548, 2, 1], [23891, 3572941, 0, 0], [1462, 172150, 1, 1], [24538, 3671226, 2, 0],
    ]);
    expect(completeTargets.map((t) => t.rowsDigest)).toEqual([
      "0e743cbf0edd472ecde641443ce06888aa82817cf3c0bdfd846d73068b398ba1",
      "f6048beeee6ad12f01bf04f6f973e24ffd0482034bd2d00cdaa36e47e7bbae10",
      "397f43819c6b46b2e8f679d2a65adadd1a8651e78a48bc59b6f0da0a4bd5a8f5",
      "859aa2556ed4760281c39cd324e1b2bad61b4496ec52292144ba4a51d386d6b9",
    ]);
  });
  it("checks the excluded next dyadic exponent and exact ceiling boundary", () => {
    for (const target of packet.targets) if (target.status === "COMPLETE_FOR_FULL_ODD_PRIME_POWER_CORE") {
      const p = BigInt(target.p), B = BigInt(1) << BigInt(target.maxA);
      expect(BigInt(3) * B - BigInt(1) <= p).toBe(true);
      expect(BigInt(6) * B - BigInt(1) > p).toBe(true);
      for (const B of [BigInt(2), BigInt(4), BigInt(1) << BigInt(target.maxA)]) {
        const qMax = (p + BigInt(1)) * (B + BigInt(1)) / (BigInt(4) * B);
        const min = (q: bigint) => (BigInt(4) * B * q + B) / (B + BigInt(1)) - BigInt(1);
        expect(min(qMax) <= p).toBe(true); expect(min(qMax + BigInt(1)) > p).toBe(true);
      }
    }
    expect(() => higherpowerResidueLowerBound(1, 2, 15)).toThrow();
    expect(() => higherpowerResidueLowerBound(26, 2, 3)).toThrow();
    expect(() => higherpowerResidueLowerBound(1, 17, 3)).toThrow();
    expect(() => higherpowerTargetAudit(109201)).toThrow();
  });
  it("does not generalize the bound to several odd primes", () => {
    // q=15 has two odd-prime supports; a genuine residue 19 is below the would-be bound 39.
    const p = BigInt(19), A = BigInt(6), U = BigInt(5), s = BigInt(119);
    expect(A * p + U).toBe(s);
    expect(verifyErdos242StrictWitness({ n: "19", x: "5", y: "114", z: "570" }).valid).toBe(true);
    expect(BigInt(19) < (BigInt(8 * 15 + 2) / BigInt(3) - BigInt(1))).toBe(true);
  });
  it("checks all canonical strict identities and the two translated-only cores", () => {
    const translated = [];
    for (const target of completeTargets) for (const w of target.coreWitnesses) {
      expect(verifyErdos242StrictWitness(w.witness).benchmarkDigest).toBe(w.strictDigest);
      const A = BigInt(w.construction.A), U = BigInt(w.construction.U), p = BigInt(target.p);
      expect(A * p + U).toBe(BigInt(w.s) * BigInt(w.construction.v));
      expect(A * U * BigInt(w.construction.k)).toBe(BigInt(w.m));
      if (w.translatedOnly) translated.push([target.p, w.a, w.b, w.ell, w.construction.A, w.construction.U]);
    }
    expect(translated).toEqual([["131433121", 3, 3, 5, "2", "25"], ["351121", 2, 3, 3, "3", "1"]]);
  });
  it("retains every exact original hit in the immutable F b2/a1..4 slice", () => {
    const f = verifySquareCoreArtifact(loadSquareCoreArtifact());
    for (let i = 0; i < 4; i++) {
      const restricted = completeTargets[i].coreWitnesses.filter((w) => w.b === 2 && w.a <= 4).map((w) => w.witness);
      expect(restricted).toEqual(f.targets[i].witnesses.map((w) => w.witness));
    }
  });
  it("fails closed on monotonic timeout at planning/first-core and finalization", () => {
    const clock = vi.spyOn(performance, "now").mockReturnValueOnce(0).mockReturnValue(30001);
    try {
      expect(higherpowerTargetAudit(351121)).toMatchObject({ status: "PARTIAL", checkedCores: 0, pendingFirstCore: { a: 1, b: 2, ell: 3 } });
    } finally { clock.mockRestore(); }
    let calls = 0;
    const finalize = vi.spyOn(performance, "now").mockImplementation(() => ++calls <= 1463 ? 0 : 30001);
    try {
      const result = higherpowerTargetAudit(351121);
      expect(result).toMatchObject({ status: "PARTIAL", checkedCores: 1462, pendingFirstCore: null, reason: "TARGET_30_SECOND_LIMIT_FINALIZE" });
      expect(result).not.toHaveProperty("coreWitnesses"); expect(result).not.toHaveProperty("rowsDigest");
    } finally { finalize.mockRestore(); }
  });
  it("independently replays, rejects mutated evidence, and never passes PARTIAL", () => {
    const replay = replayHigherpowerCore(packet);
    expect(replay.status).toBe("PASS"); expect(replay.outputDigest).toBe(replay.primaryDigest);
    const changed = structuredClone(packet);
    if (changed.targets[0].status !== "COMPLETE_FOR_FULL_ODD_PRIME_POWER_CORE") throw new Error("Unexpected partial");
    changed.targets[0].rowsDigest = "0".repeat(64);
    expect(compareHigherpowerReplay(packet, changed)).toBe("MISMATCH");
    expect(replayHigherpowerCore(changed).status).toBe("UNAVAILABLE");
    const partial = { ...packet, status: "PARTIAL" as const };
    expect(compareHigherpowerReplay(partial, partial)).toBe("MISMATCH");
    expect(replayHigherpowerCore(partial).status).toBe("UNAVAILABLE");
    const cli = spawnSync(process.execPath, ["--import", "tsx", "scripts/operations/higherpower-core-audit.ts"], {
      encoding: "utf8", timeout: 10000, env: { ...process.env, PATH: "/nonexistent-higherpower-core" },
    });
    expect(cli.status).toBe(1);
    expect(JSON.parse(cli.stdout).replay).toMatchObject({ status: "UNAVAILABLE", scriptDigest: null,
      expectedScriptDigest: "4cfbb8c77a2d09c624eb9e2771de2efaea7fbe318d7e617c3ee0b7d57c582fad" });
    expect(cli.stderr).toBe("");
  }, 30000);
});
