import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { loadSquareCoreArtifact, verifySquareCoreArtifact, squareCoreOriginalPairs } from "../../scripts/operations/square-core-check";
import { compareSquareCoreReplay, replaySquareCore, SQUARE_CORE_REPLAY_LIMITS } from "../../scripts/operations/square-core-replay";
import { verifyErdos242StrictWitness } from "@/modules/research-sandbox/math-certificates";

type Artifact = { scope: { b: number; maxA: number }; targets: Array<{ p: string; maxCore: string; status: string; unresolved: unknown[];
  criterionFactors: Array<{ value: string; t: number; factors: Array<[string, number]> }>;
  candidateEllFactors: Array<{ value: string; factors: Array<[string, number]> }> }>;
  primes: Array<{ n: string; minusOneFactors: Array<[string, number]>; witnesses: Array<[string, string]> }> };
const artifact = () => loadSquareCoreArtifact() as Artifact;
const B = BigInt;
describe("certified square-core b2 a1..4 slice", () => {
  it("certifies all 256 inputs/1399 Lucas nodes and precisely bounded decision scope", () => {
    const result = verifySquareCoreArtifact(artifact());
    expect(result.primeCertificatesChecked).toBe(1399);
    expect(result.targets.map((t) => t.criterionEntries)).toEqual([64, 64, 64, 64]);
    expect(result.targets.map((t) => t.candidateEllEntries)).toEqual([2, 2, 3, 4]);
    expect(result.targets.map((t) => t.manifestDigest)).toEqual([
      "31bf52bf43e3d2d3cb404b645ebb2e8f8bca96a82a6f6ce90c57be3053a931a9",
      "4ce7bfddabc25ec589e89019d7c09d5fd74918a291578578f26173f1db5758a4",
      "d2f5cbc0fcfe39ef2bcd8e93ec01d42c105d1dc219562cad034f94e137d01b11",
      "5de588363e77517c9032b750d7252c6eff75055bfe5bfc0ae9bb938fd772ef64"]);
    expect(result.higherAorB).toBe("UNCOMPUTED");
    expect(result.targets.every((t) => t.status === "COMPLETE_FOR_B2_A1_TO_A4_ONLY")).toBe(true);
  });
  it("checks both strict Type II tuples and refuses certified composite ell9", () => {
    const result = verifySquareCoreArtifact(artifact());
    const ws = result.targets.flatMap((t) => t.witnesses);
    expect(ws).toHaveLength(2);
    for (const w of ws) {
      expect(verifyErdos242StrictWitness(w.witness).benchmarkDigest).toBe(w.strictDigest);
      const c = w.construction, p = B(w.witness.n), m = (B(1) << B(w.exponent)) * B(w.ell) ** B(2);
      expect(B(c.a) * p + B(c.u)).toBe(B(c.s) * B(c.v));
      expect(B(c.a) * B(c.u) * B(c.k)).toBe(m);
      expect([w.witness.x, w.witness.y, w.witness.z].filter((d) => B(d) % p === B(0))).toHaveLength(2);
    }
    expect(JSON.stringify(result.targets[3].manifest)).toContain('"s":"647","ell":"9","reason":"COMPOSITE_ELL"');
  });
  it("does not promote in-bound raised roots to original normalized hits", () => {
    // Prime p109201 (independently trial divided here), ell3, a1, m18, s71.
    const p = B(109201), s = B(71);
    for (let d = 2; d * d <= Number(p); d++) expect(Number(p) % d).not.toBe(0);
    expect((B(8) * p * p - B(1)) % s).toBe(B(0));
    expect(p % s).toBe(B(3));
    expect(squareCoreOriginalPairs(p, 1, B(3))).toEqual([]);
    const result = verifySquareCoreArtifact(artifact());
    expect(JSON.stringify(result.targets[1].manifest)).toContain('"s":"399","ell":"5","reason":"ORIGINAL_CONGRUENCE_MISS"');
    expect(result.targets[1].witnesses).toEqual([]);
  });
  it("independently matches the exact pure/translated image on small composite and prime moduli", () => {
    const inverse = (a: number, s: number) => {
      for (let x = 1; x < s; x++) if (a * x % s === 1) return x;
      throw new Error("Nonunit control");
    };
    for (let a = 1; a <= 4; a++) for (const ell of [3, 5, 7]) {
      const m = 2 ** a * ell * ell, s = 4 * m - 1;
      const ds = Array.from({ length: m }, (_, i) => i + 1).filter((d) => m % d === 0);
      const gcd = (x: number, y: number): number => y ? gcd(y, x % y) : x;
      const actual = new Set<number>();
      for (const A of ds) for (const u of ds) if (m % (A * u) === 0 && gcd(A, u) === 1) actual.add((s - u * inverse(A, s) % s) % s);
      const expected = new Set<number>();
      const pow2 = (t: number) => t < 0 ? inverse(2 ** -t, s) : 2 ** t % s;
      for (let t = -2 * a - 2; t <= 2 * a + 2; t++) expected.add((s - pow2(t)) % s);
      for (let t = -a; t <= 2 * a + 2; t++) expected.add((s - ell * pow2(t) % s) % s);
      expect([...actual].sort((x, y) => x - y)).toEqual([...expected].sort((x, y) => x - y));
    }
  });
  it("rejects corrupt/missing products, recursive dependencies and candidate decisions", () => {
    const product = artifact(); product.targets[0].criterionFactors[0].factors[0][1]++;
    expect(() => verifySquareCoreArtifact(product)).toThrow("Factor product mismatch");
    const missing = artifact(); missing.targets[0].criterionFactors.pop();
    expect(() => verifySquareCoreArtifact(missing)).toThrow("Missing criterion");
    const ell = artifact(); ell.targets[0].candidateEllFactors.pop();
    expect(() => verifySquareCoreArtifact(ell)).toThrow("Missing candidate ell");
    const dependency = artifact(); dependency.primes.shift();
    expect(() => verifySquareCoreArtifact(dependency)).toThrow("Uncertified");
    const lucas = artifact(); lucas.primes.find((x) => x.n === "3")!.witnesses[0][1] = "1";
    expect(() => verifySquareCoreArtifact(lucas)).toThrow("Lucas order witness");
  });
  it("rejects scope, criterion and finite-bound drift", () => {
    const scope = artifact(); scope.scope.b = 3;
    expect(() => verifySquareCoreArtifact(scope)).toThrow();
    const target = artifact(); target.targets[0].p = "109201";
    expect(() => verifySquareCoreArtifact(target)).toThrow("Target scope");
    const criterion = artifact(); criterion.targets[0].criterionFactors[22].t++;
    expect(() => verifySquareCoreArtifact(criterion)).toThrow("Criterion scope");
    const bound = artifact(); bound.targets[0].maxCore = "1";
    expect(() => verifySquareCoreArtifact(bound)).toThrow("Finite bound");
  });
  it("retains a PARTIAL target as uncomputed, not a negative slice decision", () => {
    const partial = artifact();
    const last = partial.targets[0].criterionFactors.pop()!;
    partial.targets[0].status = "PARTIAL";
    partial.targets[0].unresolved = [{ value: last.value, purpose: "TRANSLATED:4:10", reason: "TARGET_120_SECOND_DISCOVERY_LIMIT" }];
    const result = verifySquareCoreArtifact(partial);
    expect(result.targets[0].status).toBe("PARTIAL");
    expect(result.targets[0].manifest).toEqual([]);
    expect(result.targets[0].witnesses).toEqual([]);
    partial.targets[0].unresolved = [];
    expect(() => verifySquareCoreArtifact(partial)).toThrow("PARTIAL requires unresolved");
  });
  it("catches real SIGALRM across every discovery phase and clears the timer", () => {
    const code = `import json,runpy,signal
module=runpy.run_path("scripts/operations/square-core-generate.py",run_name="fault_injection")
reports=[]
for phase in ("TARGET_PRIME","CRITERION_FACTOR","CANDIDATE_ENUMERATION","CANDIDATE_FACTOR","FINALIZE_TARGET"):
 def interrupt(current):
  if current==phase: signal.raise_signal(signal.SIGALRM)
 record=module["generate_target"](131433121,interrupt)
 assert signal.getitimer(signal.ITIMER_REAL)==(0.0,0.0)
 assert record["status"]=="PARTIAL" and record["unresolved"]
 reports.append({"phase":phase,"first":record["unresolved"][0]})
print(json.dumps(reports))`;
    const run = spawnSync("python3", ["-I", "-S", "-B", "-c", code], { encoding: "utf8", timeout: 10000 });
    expect(run.status).toBe(0); expect(run.stderr).toBe("");
    const rows = JSON.parse(run.stdout);
    expect(rows).toHaveLength(5);
    for (const row of rows) expect(row.first.reason).toBe("TARGET_120_SECOND_DISCOVERY_LIMIT");
    expect(rows[0].first).toMatchObject({ value: "131433121", purpose: "TARGET_PRIME" });
    expect(rows[2].first.purpose).toBe("ENUMERATION:1:0");
    expect(rows[4].first.purpose).toBe("FINALIZE_TARGET");
  });
  it("independently replays and rejects tampered output or unavailable Python", () => {
    const result = verifySquareCoreArtifact(artifact()), replay = replaySquareCore(result);
    expect(replay.status).toBe("PASS"); expect(replay.primaryDigest).toBe(replay.outputDigest);
    const bad = structuredClone(result); bad.targets[0].witnesses[0].witness.x = "1";
    expect(compareSquareCoreReplay(result, bad)).toBe("MISMATCH");
    expect(replaySquareCore(bad).status).toBe("UNAVAILABLE");
    expect(SQUARE_CORE_REPLAY_LIMITS).toEqual({ timeout: 30000, maxBuffer: 262144 });
    const cli = spawnSync(process.execPath, ["--import", "tsx", "scripts/operations/square-core-audit.ts"], {
      encoding: "utf8", timeout: 10000, env: { ...process.env, PATH: "/nonexistent-square-core" },
    });
    expect(cli.status).toBe(1); expect(cli.stderr).toBe("");
    expect(JSON.parse(cli.stdout).replay.status).toBe("UNAVAILABLE");
  });
  it("independent Python rejects corrupt/missing/scope certificates and preserves PARTIAL", () => {
    const code = `import copy,json,math,runpy
verify=runpy.run_path("scripts/operations/square-core-replay.py",run_name="certificate_control")["verify_artifact"]
source=json.load(open("scripts/operations/square-core-artifact.json"))
bad=[]
x=copy.deepcopy(source);x["targets"][0]["criterionFactors"][0]["factors"][0][1]+=1;bad.append(x)
x=copy.deepcopy(source);x["targets"][0]["criterionFactors"].pop();bad.append(x)
x=copy.deepcopy(source);x["scope"]["b"]=3;bad.append(x)
x=copy.deepcopy(source);x["targets"][0]["candidateEllFactors"].pop();bad.append(x)
x=copy.deepcopy(source);x["primes"][1]["witnesses"][0][1]="1";bad.append(x)
for x in bad:
 try:verify(x)
 except AssertionError:pass
 else:raise RuntimeError("corruption accepted")
x=copy.deepcopy(source);last=x["targets"][0]["criterionFactors"].pop();x["targets"][0]["status"]="PARTIAL"
x["targets"][0]["unresolved"]=[{"value":last["value"],"purpose":"TRANSLATED:4:10","reason":"TARGET_120_SECOND_DISCOVERY_LIMIT"}]
r=verify(x)["targets"][0];assert r["status"]=="PARTIAL" and not r["manifest"] and not r["witnesses"]
p,m,s=109201,18,71;ds=[d for d in range(1,m+1) if m%d==0]
assert (8*p*p-1)%s==0 and not [(A,u) for A in ds for u in ds if m%(A*u)==0 and math.gcd(A,u)==1 and (A*p+u)%s==0]
print(json.dumps({"corruptionsRejected":len(bad),"partial":r["status"],"falseRootRejected":True}))`;
    const run = spawnSync("python3", ["-I", "-S", "-B", "-c", code], { encoding: "utf8", timeout: 10000 });
    expect(run.status).toBe(0); expect(run.stderr).toBe("");
    expect(JSON.parse(run.stdout)).toEqual({ corruptionsRejected: 5, partial: "PARTIAL", falseRootRejected: true });
  });
});
