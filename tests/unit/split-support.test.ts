import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { performance } from "node:perf_hooks";
import { describe, expect, it, vi } from "vitest";
import { splitSupportCanonicalResidue, splitSupportPacket, splitSupportRayBound } from "../../scripts/operations/split-support-check";
import { compareSplitSupportReplay, replaySplitSupport } from "../../scripts/operations/split-support-replay";
import { verifyErdos242StrictWitness } from "../../src/modules/research-sandbox/math-certificates";

const packet = splitSupportPacket();
if (packet.status !== "COMPLETE_FOR_35_FIXED_RAYS") throw new Error("Fixed ray packet incomplete");
const complete = packet;
describe("H05 split-support canonical quotient and exact all-k rays", () => {
  it("reconstructs 2544 canonical residues and all35 fixed complete rays", () => {
    expect(complete.controls).toMatchObject({ rows: 2544, rowsDigest: "25218e37a94605d1a689468a209c9881ddab20b706660f119fc859b91cc7b65c" });
    expect(complete).toMatchObject({ checkedRays: 35, checkedDivisorRows: 366, hitRows: 12,
      rayManifestDigest: "99469d36791bf21dd8e6ed8d60b493ea5eceba4039c74b6a5279f23fbc50aaab" });
    expect(createHash("sha256").update(JSON.stringify(complete)).digest("hex")).toBe("d1fb21ec5ae382ddbf26a26e33ebd61b3d0731ef6e319bc386ede5bbad39952a");
    expect(complete.limits).toEqual({ secondsPerRun: 30, maxCoreRows: 100000, maxSqrtDivisorIterationsPerRay: 166608 });
  });
  it("handles A1 and U>A and rejects noncoprime/nonpositive partitions", () => {
    expect(splitSupportCanonicalResidue(BigInt(1), BigInt(1), BigInt(1))).toMatchObject({ Q0: "1", h0: "2", residue: "2", s: "3" });
    expect(splitSupportCanonicalResidue(BigInt(3), BigInt(11), BigInt(6))).toMatchObject({ Q0: "1", h0: "4", residue: "260", s: "791" });
    for (const args of [[0, 1, 1], [1, 0, 1], [1, 1, 0], [3, 6, 1]]) expect(() => splitSupportCanonicalResidue(...args.map(BigInt) as [bigint, bigint, bigint])).toThrow();
  });
  it("proves the next-k exclusion on all35 rays, without sufficiency from the bound", () => {
    for (const ray of complete.rays) {
      const p = BigInt(ray.p), A = BigInt(ray.A), U = BigInt(ray.U), bound = splitSupportRayBound(p, A, U);
      expect(String(bound)).toBe(ray.kMax);
      expect(BigInt(splitSupportCanonicalResidue(A, U, bound + BigInt(1)).residue) > p).toBe(true);
      if (bound > BigInt(0)) expect(BigInt(splitSupportCanonicalResidue(A, U, bound).residue) <= p).toBe(true);
    }
    const miss = complete.rays.find((r) => r.p === "19" && r.A === 1 && r.U === 1)!;
    expect(miss.kMax).toBe("5"); expect(miss.hits).toEqual([]);
  });
  it("preserves q15/q99 escapes and wrap counts, rather than extending the power-core bound", () => {
    const small = complete.rays.find((r) => r.p === "19" && r.A === 6 && r.U === 5)!;
    expect(small.hits[0]).toMatchObject({ m: "30", k: "1", s: "119", canonicalResidue: "19", wrapCount: "0" });
    const hard = complete.rays.find((r) => r.p === "159727681" && r.A === 3 && r.U === 11)!;
    expect(hard.hits[0]).toMatchObject({ m: "198", k: "6", s: "791", canonicalResidue: "260", canonicalQuotient: "1", wrapCount: "201931" });
    expect(BigInt(260) < (BigInt(8 * 99 + 2) / BigInt(3) - BigInt(1))).toBe(true);
    expect(BigInt(19) < (BigInt(8 * 15 + 2) / BigInt(3) - BigInt(1))).toBe(true);
  });
  it("checks every original divisor criterion, product and exact strict identity", () => {
    for (const ray of complete.rays) {
      expect(ray.numeratorFactors.reduce((n, [q, e]) => n * BigInt(q) ** BigInt(e), BigInt(1))).toBe(BigInt(ray.numerator));
      for (const hit of ray.hits) {
        expect(verifyErdos242StrictWitness(hit.witness).benchmarkDigest).toBe(hit.strictDigest);
        expect(hit.classification).toBe("STRICT_TYPE_II");
        const p = BigInt(ray.p), s = BigInt(hit.s), Q = BigInt(hit.Q), q0 = BigInt(hit.canonicalQuotient), t = BigInt(hit.wrapCount);
        expect(BigInt(ray.A) * p + BigInt(ray.U)).toBe(s * Q);
        expect(s + BigInt(1)).toBe(BigInt(4 * ray.A * ray.U) * BigInt(hit.k));
        expect(Q).toBe(q0 + BigInt(ray.A) * t);
        expect(p).toBe(BigInt(hit.canonicalResidue) + s * t);
      }
    }
  });
  it("reports an exact pending first-control or ray on timeout, never complete", () => {
    const first = vi.spyOn(performance, "now").mockReturnValueOnce(0).mockReturnValue(30001);
    try { expect(splitSupportPacket()).toMatchObject({ status: "PARTIAL", checkedControlRows: 0, pending: { phase: "CONTROLS", a: 1, u: 1, k: 1 } }); }
    finally { first.mockRestore(); }
    let count = 0;
    const ray = vi.spyOn(performance, "now").mockImplementation(() => ++count <= 2545 ? 0 : 30001);
    try { expect(splitSupportPacket()).toMatchObject({ status: "PARTIAL", checkedRays: 0,
      pending: { phase: "FACTOR_RAY", p: "19", A: 6, U: 5, value: "119" } }); }
    finally { ray.mockRestore(); }
    let total = 0;
    const measure = vi.spyOn(performance, "now").mockImplementation(() => { total++; return 0; });
    try { expect(splitSupportPacket().status).toBe("COMPLETE_FOR_35_FIXED_RAYS"); } finally { measure.mockRestore(); }
    let calls = 0;
    const final = vi.spyOn(performance, "now").mockImplementation(() => ++calls < total ? 0 : 30001);
    try { expect(splitSupportPacket()).toMatchObject({ status: "PARTIAL", checkedRays: 35, pending: { phase: "FINALIZE" } }); }
    finally { final.mockRestore(); }
  });
  it("independently replays and rejects corrupted, partial or unavailable evidence", () => {
    const replay = replaySplitSupport(complete);
    expect(replay.status).toBe("PASS"); expect(replay.outputDigest).toBe(replay.primaryDigest);
    const bad = structuredClone(complete); bad.rays[0].hits[0].k = "2";
    expect(compareSplitSupportReplay(complete, bad)).toBe("MISMATCH"); expect(replaySplitSupport(bad).status).toBe("UNAVAILABLE");
    const clock = vi.spyOn(performance, "now").mockReturnValueOnce(0).mockReturnValue(30001);
    let partial;
    try { partial = splitSupportPacket(); } finally { clock.mockRestore(); }
    expect(compareSplitSupportReplay(partial, partial)).toBe("MISMATCH"); expect(replaySplitSupport(partial).status).toBe("UNAVAILABLE");
    const cli = spawnSync(process.execPath, ["--import", "tsx", "scripts/operations/split-support-audit.ts"], {
      encoding: "utf8", timeout: 10000, env: { ...process.env, PATH: "/nonexistent-split-support" },
    });
    expect(cli.status).toBe(1); expect(JSON.parse(cli.stdout).replay).toMatchObject({ status: "UNAVAILABLE", scriptDigest: null });
    expect(cli.stderr).toBe("");
  });
});
