import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { aggregateOddCoreAtlas, aggregateOddCoreDecision, verifyAggregateOddCore } from "../../scripts/operations/aggregate-odd-core-check";
import { compareAggregateOddCoreReplay, replayAggregateOddCore, AGGREGATE_ODD_CORE_REPLAY_LIMITS } from "../../scripts/operations/aggregate-odd-core-replay";
import { loadCertifiedTwoCoreArtifact, verifyCertifiedTwoCoreArtifact } from "../../scripts/operations/certified-two-core-check";
import { verifyErdos242StrictWitness } from "@/modules/research-sandbox/math-certificates";

type MutatedArtifact = { targets: Array<{ p: string; maxA: number;
  criterionFactors: Array<{ factors: Array<[string, number]> }>;
  candidateEllFactors: unknown[] }>;
  primes: Array<{ n: string; witnesses: Array<[string, string]> }> };
const artifact = () => loadCertifiedTwoCoreArtifact() as MutatedArtifact;
describe("certified aggregate odd whole-block family", () => {
  it("checks the pure-two image/cutoff for prime and composite blocks without partial factors", () => {
    for (let a = 1; a <= 8; a++) for (let q = 3; q <= 99; q += 2) {
      const atlas = aggregateOddCoreAtlas(a, q);
      expect(atlas.pairs).toHaveLength(3 * (2 * a + 1));
      for (const pair of atlas.pairs) for (const value of [pair.a, pair.u]) {
        let oddPart = BigInt(value); while (oddPart % BigInt(2) === BigInt(0)) oddPart /= BigInt(2);
        expect([BigInt(1), BigInt(q)]).toContain(oddPart);
      }
    }
    expect(aggregateOddCoreAtlas(2, 9).pairs).not.toContainEqual({ a: "1", u: "3" });
    expect(aggregateOddCoreAtlas(1, 9).pairs).not.toContainEqual({ a: "1", u: "3" });
    for (const q of [0, 2, 10, 1001, NaN]) expect(() => aggregateOddCoreAtlas(2, q)).toThrow();
    expect(() => aggregateOddCoreAtlas(9, 9)).toThrow();
  });
  it("regenerates all aggregate cores and separates distinct tuples from core count", () => {
    const result = aggregateOddCoreDecision();
    expect(result).toMatchObject({ coreWitnessCount: 55, compositeCoreWitnessCount: 40,
      distinctTupleCount: 40, primeBaselineDistinctTupleCount: 14, additionalDistinctTupleCount: 26,
      primeCertificatesChecked: 1185 });
    expect(result.targets.map((t) => [t.coreWitnessCount, t.compositeCoreWitnessCount, t.distinctTupleCount])).toEqual([[13, 11, 7], [10, 8, 7], [14, 6, 11], [18, 15, 15]]);
    expect(result.targets.map((t) => t.manifestDigest)).toEqual([
      "a0123753c49693d8d52df6c8fda6aa9aedfca44848531c4c2e9d3a71b47fabb9",
      "8f3dd2dd7799db7ed8f9f8f1706d38bef33c309ad565b6fe65e48a7baf0b1f2e",
      "eef98ac54f9c792a39751a5b40f91d3bb75f6fafe1f417d3e33dcd92d5c4b1ce",
      "1a7d52c63bab82fef7bb215a054108247140c364084a23bb0a5d178db19cba38",
    ]);
    expect(result.scope).toContain("Not all normalized composite-core divisors");
  });
  it("excludes a full mixed-core rescue that uses proper q factors", () => {
    const p = BigInt(159727681), m = BigInt(198), s = BigInt(791);
    const A = BigInt(3), u = BigInt(11), v = BigInt(605794), k = BigInt(6);
    expect(p % s).toBe(BigInt(260));
    expect(A * p + u).toBe(s * v);
    expect(A * u * k).toBe(m);
    const witness = { n: String(p), x: "39982404", y: "31626080838", z: "1741717274106852" };
    expect(verifyErdos242StrictWitness(witness).valid).toBe(true);
    const aggregate = aggregateOddCoreAtlas(1, 99);
    expect(aggregate.residues).not.toContain("260");
    expect(aggregate.pairs).not.toContainEqual({ a: "3", u: "11" });
    expect(aggregateOddCoreDecision().targets[1].manifest[0][1]).not.toContainEqual(expect.arrayContaining(["791", "99"]));
  });
  it("retains exact prime-only compatibility and all strict composite witnesses", () => {
    const result = aggregateOddCoreDecision(), baseline = verifyCertifiedTwoCoreArtifact(artifact());
    for (let i = 0; i < 4; i++) {
      const primeRows = result.targets[i].manifest.map(([a, row]) => [a, row.filter((r) => r[2] === "PRIME").map(([s, q]) => [s, q])]);
      expect(primeRows).toEqual(baseline.targets[i].manifest);
      expect(result.targets[i].tailMinimumResidue).toBe(baseline.targets[i].tailMinimumResidue);
      for (const w of result.targets[i].coreWitnesses) {
        expect(verifyErdos242StrictWitness(w.witness).benchmarkDigest).toBe(w.strictDigest);
        expect(w.qFactors.reduce((p, [q, e]) => p * BigInt(q) ** BigInt(e), BigInt(1))).toBe(BigInt(w.q));
        const p = BigInt(w.witness.n), A = BigInt(w.construction.a), U = BigInt(w.construction.u);
        expect(A * p + U).toBe(BigInt(w.construction.s) * BigInt(w.construction.v));
        expect(BigInt(w.q) * (BigInt(1) << BigInt(w.exponent))).toBe(A * U * BigInt(w.construction.k));
        expect([w.witness.x, w.witness.y, w.witness.z].filter((d) => BigInt(d) % p === BigInt(0))).toHaveLength(2);
      }
    }
    expect(result.targets[0].coreWitnesses).toContainEqual(expect.objectContaining({ exponent: 2, q: "9", qClassification: "COMPOSITE", qFactors: [["3", 2]], construction: { a: "4", u: "9", s: "143", v: "3676451", k: "1" } }));
  });
  it("rejects corrupt products/certificates and missing evidence before expansion", () => {
    const factor = artifact(); factor.targets[0].criterionFactors[0].factors[0][1]++;
    expect(() => verifyAggregateOddCore(factor)).toThrow();
    const cert = artifact(); cert.primes.find((p) => p.n === "3")!.witnesses[0][1] = "1";
    expect(() => verifyAggregateOddCore(cert)).toThrow();
    const omitted = artifact(); omitted.targets[0].candidateEllFactors.pop();
    expect(() => verifyAggregateOddCore(omitted)).toThrow();
    const exponent = artifact(); exponent.targets[0].maxA--;
    expect(() => verifyAggregateOddCore(exponent)).toThrow();
    const scope = artifact(); scope.targets[0].p = "2521";
    expect(() => verifyAggregateOddCore(scope)).toThrow();
  });
  it("distinguishes semantic certificate verification from fixed byte provenance", () => {
    const altered = artifact(); altered.primes.find((p) => p.n === "5")!.witnesses[0][1] = "3";
    const semantic = verifyAggregateOddCore(altered);
    expect(semantic.sourceArtifactDigest).toBeNull();
    expect(semantic.expectedSourceArtifactDigest).toBe(aggregateOddCoreDecision().sourceArtifactDigest);
    expect(aggregateOddCoreDecision().sourceArtifactDigest).not.toBeNull();
  });
  it("independent Python replay matches and drift/unavailable results fail closed", () => {
    const result = aggregateOddCoreDecision(), replay = replayAggregateOddCore(result);
    expect(replay.status).toBe("PASS");
    expect(replay.primaryDigest).toBe(replay.outputDigest);
    const bad = structuredClone(result); bad.targets[0].coreWitnesses[0].construction.u = "3";
    expect(compareAggregateOddCoreReplay(result, bad)).toBe("MISMATCH");
    expect(replayAggregateOddCore(bad).status).toBe("UNAVAILABLE");
    expect(AGGREGATE_ODD_CORE_REPLAY_LIMITS).toEqual({ timeout: 30000, maxBuffer: 262144 });
    const cli = spawnSync(process.execPath, ["--import", "tsx", "scripts/operations/aggregate-odd-core-audit.ts"], {
      encoding: "utf8", timeout: 10000, env: { ...process.env, PATH: "/nonexistent-aggregate-odd-core" },
    });
    expect(cli.status).toBe(1);
    expect(JSON.parse(cli.stdout).replay.status).toBe("UNAVAILABLE");
    expect(cli.stderr).toBe("");
  });
});
