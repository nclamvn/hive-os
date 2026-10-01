import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { loadCertifiedTwoCoreArtifact, verifyCertifiedTwoCoreArtifact } from "../../scripts/operations/certified-two-core-check";
import { compareCertifiedTwoCoreReplay, replayCertifiedTwoCore, CERTIFIED_TWO_CORE_REPLAY_LIMITS } from "../../scripts/operations/certified-two-core-replay";
import { verifyErdos242StrictWitness } from "@/modules/research-sandbox/math-certificates";
import { twoCoreTargetPacket } from "../../scripts/operations/two-core-target";

// JSON shape used only for mutation controls; the production checker parses unknown.
type Artifact = { targets: Array<{ p: string; maxA: number; status: string; unresolved: unknown[];
  criterionFactors: Array<{ value: string; factors: Array<[string, number]> }>;
  candidateEllFactors: Array<{ value: string; factors: Array<[string, number]> }> }>;
  primes: Array<{ n: string; minusOneFactors: Array<[string, number]>; witnesses: Array<[string, string]> }> };
const artifact = () => loadCertifiedTwoCoreArtifact() as Artifact;

describe("certified complete two-core tail decisions", () => {
  it("checks every tail exponent and all recursive Lucas nodes", () => {
    const result = verifyCertifiedTwoCoreArtifact(artifact());
    expect(result.primeCertificatesChecked).toBe(1185);
    expect(result.targets.map((t) => t.maxA)).toEqual([25, 25, 16, 25]);
    expect(result.targets.map((t) => t.criterionEntries)).toEqual([106, 106, 70, 106]);
    expect(result.targets.map((t) => t.candidateEllEntries)).toEqual([13, 10, 13, 18]);
    expect(result.targets.map((t) => t.manifestDigest)).toEqual([
      "0a721ef33b8fa78f072231e5b9264ca29090deb8849301325659daf0f5f1de66",
      "6d3f7f6af0b8730d102aa3e1b08c6384c6b0bac0e1f307e6b4cd1456cb697b85",
      "c7ca6edb37c97b6baf02fb1ad4c14cc1a6910b391330fabf486276471242efde",
      "60ee993138412342b41da21a92051f5801078af4ff6eb3d0968512c62f1f3765",
    ]);
    for (const t of result.targets) {
      expect(t.manifest).toHaveLength(t.maxA);
      expect(BigInt(t.tailMinimumResidue)).toBeGreaterThan(BigInt(t.p));
    }
  });
  it("retains old a1..4 controls and independently checks fifteen strict witnesses", () => {
    const result = verifyCertifiedTwoCoreArtifact(artifact()), old = twoCoreTargetPacket();
    for (let i = 0; i < 4; i++) expect(result.targets[i].manifest.slice(0, 4)).toEqual(old.targetAudits[i].manifest.map(([a, hits]) => [a, hits.map(([s, ell]) => [String(s), String(ell)])]));
    const all = result.targets.flatMap((t) => t.witnesses);
    expect(all).toHaveLength(15);
    for (const w of all) {
      expect(verifyErdos242StrictWitness(w.witness).benchmarkDigest).toBe(w.strictDigest);
      const p = BigInt(w.witness.n), A = BigInt(w.construction.a), U = BigInt(w.construction.u);
      expect(A * p + U).toBe(BigInt(w.construction.s) * BigInt(w.construction.v));
      expect(BigInt(w.ell) * (BigInt(1) << BigInt(w.exponent))).toBe(A * U * BigInt(w.construction.k));
      expect([w.witness.x, w.witness.y, w.witness.z].filter((d) => BigInt(d) % p === BigInt(0))).toHaveLength(2);
    }
    expect(result.targets[2].manifest[4]).toEqual([5, [["7551", "59"]]]);
    expect(result.targets[3].manifest[6]).toEqual([7, [["3583", "7"]]]);
  });
  it("rejects factor/product corruption and a missing criterion entry", () => {
    const bad = artifact(); bad.targets[0].criterionFactors[0].factors[0][1]++;
    expect(() => verifyCertifiedTwoCoreArtifact(bad)).toThrow("Factor product mismatch");
    const missing = artifact(); missing.targets[0].criterionFactors.pop();
    expect(() => verifyCertifiedTwoCoreArtifact(missing)).toThrow("Missing criterion");
    const ell = artifact(); ell.targets[0].candidateEllFactors.pop();
    expect(() => verifyCertifiedTwoCoreArtifact(ell)).toThrow("Missing candidate ell");
  });
  it("rejects Lucas order/recursive dependency corruption", () => {
    const bad = artifact(); bad.primes.find((c) => c.n === "3")!.witnesses[0][1] = "1";
    expect(() => verifyCertifiedTwoCoreArtifact(bad)).toThrow("Lucas order witness");
    const dependency = artifact(); dependency.primes.shift();
    expect(() => verifyCertifiedTwoCoreArtifact(dependency)).toThrow("Uncertified");
    const product = artifact(); product.primes.find((c) => c.n === "7")!.minusOneFactors[0][1]++;
    expect(() => verifyCertifiedTwoCoreArtifact(product)).toThrow("Factor product mismatch");
  });
  it("rejects scope/exponent drift and explicit incomplete discovery", () => {
    const exponent = artifact(); exponent.targets[0].maxA--;
    expect(() => verifyCertifiedTwoCoreArtifact(exponent)).toThrow("Exponent/tail drift");
    const scope = artifact(); scope.targets[0].p = "2521";
    expect(() => verifyCertifiedTwoCoreArtifact(scope)).toThrow("Target scope");
    const incomplete = artifact(); incomplete.targets[0].status = "PARTIAL";
    expect(() => verifyCertifiedTwoCoreArtifact(incomplete)).toThrow("Incomplete certified artifact");
  });
  it("retains exact PARTIAL evidence if SIGALRM interrupts enumeration or finalization", () => {
    const code = `
import json, runpy, signal
module = runpy.run_path("scripts/operations/certified-two-core-generate.py", run_name="injected_discovery_test")
def run(phase):
    def interrupt(current):
        if current == phase:
            signal.raise_signal(signal.SIGALRM)
    record = module["generate_target"](131433121, interrupt)
    assert signal.getitimer(signal.ITIMER_REAL) == (0.0, 0.0)
    return {"status": record["status"], "criterionEntries": len(record["criterionFactors"]),
            "ellEntries": len(record["candidateEllFactors"]), "pending": len(record["unresolved"]),
            "first": record["unresolved"][0]}
print(json.dumps({"enumeration": run("CANDIDATE_ENUMERATION"), "finalization": run("FINALIZE_TARGET")}))
`;
    const test = spawnSync("python3", ["-I", "-S", "-B", "-c", code], { encoding: "utf8", timeout: 10000 });
    expect(test.status).toBe(0);
    expect(test.stderr).toBe("");
    const output = JSON.parse(test.stdout);
    expect(output.enumeration).toMatchObject({ status: "PARTIAL", criterionEntries: 106, ellEntries: 0,
      first: { value: "131433122", purpose: "CANDIDATE_ENUMERATION:1:PLUS_POWER:0", reason: "TARGET_120_SECOND_DISCOVERY_LIMIT" } });
    expect(output.enumeration.pending).toBeGreaterThan(1);
    expect(output.finalization).toMatchObject({ status: "PARTIAL", criterionEntries: 106, ellEntries: 13, pending: 1,
      first: { value: "131433121", purpose: "FINALIZE_TARGET", reason: "TARGET_120_SECOND_DISCOVERY_LIMIT" } });
  });
  it("replays independent Python exactly and fails closed on unavailable/drifted results", () => {
    const result = verifyCertifiedTwoCoreArtifact(artifact()), replay = replayCertifiedTwoCore(result);
    expect(replay.status).toBe("PASS");
    expect(replay.primaryDigest).toBe(replay.outputDigest);
    const bad = structuredClone(result); bad.targets[0].witnesses[0].witness.x = "1";
    expect(compareCertifiedTwoCoreReplay(result, bad)).toBe("MISMATCH");
    expect(replayCertifiedTwoCore(bad).status).toBe("UNAVAILABLE");
    expect(CERTIFIED_TWO_CORE_REPLAY_LIMITS).toEqual({ timeout: 30000, maxBuffer: 262144 });
    const cli = spawnSync(process.execPath, ["--import", "tsx", "scripts/operations/certified-two-core-audit.ts"], {
      encoding: "utf8", timeout: 10000, env: { ...process.env, PATH: "/nonexistent-certified-two-core" },
    });
    expect(cli.status).toBe(1);
    expect(JSON.parse(cli.stdout).replay.status).toBe("UNAVAILABLE");
    expect(cli.stderr).toBe("");
  });
});
