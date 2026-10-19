import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { factorTransferPacket } from "../../scripts/operations/factor-transfer-partitions";
import { factorTransferHash, factorTransferPacketSchema, factorTransferGraphSummary, factorTransferPow,
  compareFactorTransferReplay, verifyFactorTransferPacket, type FactorTransferPacket } from "../../scripts/operations/factor-transfer-check";
import { FACTOR_TRANSFER_REPLAY_SHA256, replayFactorTransfer } from "../../scripts/operations/factor-transfer-replay";
vi.mock("node:child_process", { spy: true }); vi.mock("node:fs", { spy: true });
vi.mock("node:perf_hooks", async importOriginal => {
  const actual = await importOriginal<typeof import("node:perf_hooks")>();
  return { ...actual, performance: { now: vi.fn(() => actual.performance.now()) } };
});
let primary: FactorTransferPacket, replay: FactorTransferPacket;
function seal(p: FactorTransferPacket, derive = true) {
  for (const n of p.nodes) {
    n.count = String(n.image.length); n.imageDigest = factorTransferHash(n.image); n.witnessDigest = n.canonical ? factorTransferHash(n.canonical) : null;
    n.defectDigest = n.defect ? factorTransferHash(n.defect) : null; const { nodeDigest, ...body } = n; void nodeDigest; n.nodeDigest = factorTransferHash(body);
  }
  for (const r of p.records) { const { recordDigest, ...body } = r; void recordDigest; r.recordDigest = factorTransferHash(body); }
  if (derive) Object.assign(p, factorTransferGraphSummary(p.nodes, p.records, p.status === "COMPLETE"));
  const graph = { nodes: p.nodes, records: p.records, frontier: p.frontier, reachability: p.reachability, cycles: p.cycles, progress: p.progress };
  p.graphDigest = factorTransferHash(graph); p.contentDigest = factorTransferHash({ inputs: p.inputs, ...graph, graphDigest: p.graphDigest });
  for (let i = 0; i < 16; i++) { const { packetDigest, ...body } = p; void packetDigest; p.packetDigest = factorTransferHash(body);
    const bytes = String(Buffer.byteLength(canonicalJson(p))); if (bytes === p.runtime.outputBytes) return p; p.runtime.outputBytes = bytes; }
  throw new Error("Output fixed point");
}
function python(code: string) { return spawnSync("python3", ["-I", "-S", "-B", "-c", `import runpy,json\nm=runpy.run_path('scripts/operations/factor-transfer-replay.py')\ng=m['packet'].__globals__\n${code}`],
  { encoding: "utf8", timeout: 60000, maxBuffer: 2097152, env: { PATH: process.env.PATH ?? "/usr/bin:/bin", NODE_ENV: "test" } }); }
function pyPacket(code: string) { const r = python(code); expect(r.status).toBe(0); return JSON.parse(r.stdout) as FactorTransferPacket; }

describe("TIP038 independent all-factor two-hop transfer graph", () => {
  beforeAll(() => {
    const p = factorTransferPacket(); expect(verifyFactorTransferPacket(p)).toBe(true); primary = factorTransferPacketSchema.parse(p);
    const r = replayFactorTransfer(primary); expect(r.status).toBe("PASS"); expect(verifyFactorTransferPacket(r.replay)).toBe(true); replay = r.replay as FactorTransferPacket;
  }, 60000);
  it("fresh verified bytes agree on fullnodes/records/images/H/orders/witnesses/reachability and scoped progress refutations", () => {
    expect(primary.nodes).toHaveLength(17); expect(primary.records).toHaveLength(15); expect(primary.nodes.filter(n => n.hit)).toHaveLength(2);
    expect(primary.records.filter(r => r.kind === "EDGE")).toHaveLength(4); expect(primary.records.filter(r => r.kind === "BLOCKER")).toHaveLength(11);
    expect(primary.frontier).toHaveLength(0); expect(primary.cycles).toHaveLength(0);
    expect(replay.runtime).toMatchObject({ pairChecks: "8076", workSteps: "6252" }); expect(compareFactorTransferReplay(primary, replay)).toBe("PASS");
    expect(replay.contentDigest).toBe("952de09e31ded70c7f9f498a6ca9933ba3ca70c404f194712b491dbf00eb9bc4");
    expect(primary.progress).toMatchObject({ C1: { status: "REFUTED", firstRefutation: { recordId: "r9", from: "200656681:103", to: "200656681:2027" } },
      C2: { status: "NO_REFUTATION_IN_COMPUTED_EDGES", firstRefutation: null }, C3: { status: "NO_REFUTATION_IN_COMPUTED_EDGES", firstRefutation: null } });
    expect(primary.reachability.filter(r => r.status === "HIT_REACHABLE")).toHaveLength(2);
    expect(primary.reachability.find(r => r.seed === "131433121:31")!.firstHitPath).toEqual(["131433121:31", "131433121:2053643", "131433121:103"]);
    expect(primary.nodes.find(n => n.id === "200656681:2027")).toMatchObject({ hit: false, count: "39", defect: { stabilizer: ["1"], visibleMass: "7", index: "2026" } });
    expect(primary.nodes.find(n => n.id === "131433121:2053643")).toMatchObject({ hit: false, count: "27", defect: { stabilizer: ["1"], visibleMass: "3", index: "2053642" } });
  });

  it("rejects fully rehashed seed/domain/factor/QNR/H/order/mass/witness/edge/blocker and discovery attacks", () => {
    const mutations: ((p: FactorTransferPacket) => void)[] = [
      p => { (p.inputs as { maxDepth: string }).maxDepth = "3"; }, p => { (p.inputs as { seeds: unknown[] }).seeds.pop(); },
      p => { (p.inputs as { seedContentDigest: string }).seedContentDigest = "0".repeat(64); }, p => { p.scope = "forged" as never; },
      p => { p.nodes[0].p = "19"; }, p => { p.nodes[0].h = "15"; }, p => { p.nodes[0].depth = "1"; },
      p => { p.nodes[0].factors[0][1] = "10"; }, p => { p.nodes[0].qnrFactors.pop(); },
      p => { p.nodes[0].qnrFactors[0].q = "2"; },
      p => { p.nodes[0].qnrFactors[0].eligible = true; }, p => { p.nodes[0].character.legendre = "+1"; },
      p => { p.nodes[0].defect!.stabilizer = ["1"]; }, p => { p.nodes[0].defect!.visibleMass = "99"; },
      p => { p.nodes[0].defect!.visibleFactors[0].quotientOrder = "3"; }, p => { p.nodes.find(n => n.canonical)!.canonical!.x = "1"; },
      p => { const e = p.records.find(r => r.kind === "EDGE")!; if (e.kind === "EDGE") e.to = "200656681:3"; },
      p => { const e = p.records.find(r => r.kind === "EDGE")!; if (e.kind === "EDGE") e.disposition = "REVISIT"; },
      p => { const e = p.records.find(r => r.kind === "EDGE")!; if (e.kind === "EDGE") { e.targetComputed = false; e.toDepth = null; } },
      p => { p.records[0].q = "2"; }, p => { p.records.splice(1, 1); },
    ];
    for (const mutate of mutations) { const p = structuredClone(primary); mutate(p); seal(p, false); expect(compareFactorTransferReplay(p, replay)).toBe("MISMATCH"); }
    const plausible = structuredClone(primary), hit = plausible.nodes.find(n => n.hit && n.image.length > 3)!;
    hit.image.splice(1, 1); seal(plausible); expect(compareFactorTransferReplay(plausible, replay)).toBe("MISMATCH");
  }, 30000);

  it("rejects fully rehashed fabricated C2proof/refutation, reachability/resetdistance, cycle/frontier and resource receipts", () => {
    for (const mutate of [
      (p: FactorTransferPacket) => { p.progress.C1.status = "NO_REFUTATION_IN_COMPUTED_EDGES"; p.progress.C1.firstRefutation = null; },
      (p: FactorTransferPacket) => { p.progress.C2 = structuredClone(p.progress.C1); },
      (p: FactorTransferPacket) => { p.reachability[0].reachableHitIds = [primary.nodes.find(n => n.hit)!.id]; p.reachability[0].status = "HIT_REACHABLE"; },
      (p: FactorTransferPacket) => { p.frontier = [{ recordId: "r0", from: p.nodes[0].id, to: p.nodes[1].id, reason: "DEPTH_LIMIT" }]; },
      (p: FactorTransferPacket) => { const c = { nodeIds: [p.nodes[0].id, p.nodes[1].id, p.nodes[0].id], recordIds: ["r0", "r1"] }; p.cycles = [{ ...c, cycleDigest: factorTransferHash(c) }]; },
    ]) { const p = structuredClone(primary); mutate(p); seal(p, false); expect(verifyFactorTransferPacket(p)).toBe(false); }
    for (const elapsed of ["60000", "60001"]) { const p = structuredClone(primary); p.runtime.elapsedMs = elapsed; seal(p); expect(verifyFactorTransferPacket(p)).toBe(false); }
    const p = structuredClone(replay); p.runtime.workSteps = "50000001"; seal(p); expect(verifyFactorTransferPacket(p)).toBe(false);
    const q = structuredClone(replay); if ("pairChecks" in q.runtime) q.runtime.pairChecks = "50000001"; seal(q); expect(verifyFactorTransferPacket(q)).toBe(false);
  }, 30000);

  it("graph semantics synthetic controls: merged seed cannot reset2hopdistance; revisit is not a cycle; outerfrontier remains explicit", () => {
    const nodes = [structuredClone(primary.nodes[0]), structuredClone(primary.nodes[1]), structuredClone(primary.nodes.find(n => n.id === "200656681:2027")!), structuredClone(primary.nodes.find(n => n.hit)!)];
    const edge = (i: number, from: string, to: string, computed = true): FactorTransferPacket["records"][number] => ({ id: `r${i}`, kind: "EDGE", from, to,
      q: "3", exponent: "1", requestedDepth: "1", disposition: computed ? "REVISIT" : "DEPTH_LIMIT", targetComputed: computed, toDepth: computed ? "0" : null, recordDigest: "0".repeat(64) });
    const records = [edge(0, nodes[0].id, nodes[1].id), edge(1, nodes[1].id, nodes[2].id), edge(2, nodes[2].id, nodes[3].id), edge(3, nodes[2].id, "200023321:3", false)];
    const summary = factorTransferGraphSummary(nodes, records, true);
    expect(summary.reachability[0]).toMatchObject({ reachableHitIds: [], firstHitPath: null, frontierRecordIds: ["r3"] });
    expect(summary.reachability[1].firstHitPath).toEqual([nodes[1].id, nodes[2].id, nodes[3].id]);
    expect(summary.cycles).toHaveLength(0);
    const cycle = factorTransferGraphSummary(nodes.slice(0, 2), [edge(0, nodes[0].id, nodes[1].id), edge(1, nodes[1].id, nodes[0].id)], true);
    expect(cycle.cycles).toMatchObject([{ nodeIds: [nodes[0].id, nodes[1].id, nodes[0].id], recordIds: ["r0", "r1"] }]);
    // These abstract records test graph mechanics only; they are not claimed admissible arithmetic transfers.
  });

  it("BigInt modular arithmetic is exact above Number product precision, without expanding experiment inputs", () => {
    const h = 200023321, r = h - 2, exponent = 12345;
    let value = BigInt(1); for (let i = 0; i < exponent; i++) value = value * BigInt(r) % BigInt(h);
    expect(factorTransferPow(r, exponent, h)).toBe(Number(value));
  });

  it("NODE/FACTOR partials retain exact atomic prefixes, incomplete summaries and noPASS", () => {
    for (const options of [{ maxNodes: 1 }, { maxRecords: 1 }, { maxWorkSteps: 1 }]) {
      const p = factorTransferPacket(options); expect(verifyFactorTransferPacket(p)).toBe(true); expect(replayFactorTransfer(p).status).toBe("PARTIAL");
      expect(p.reachability.every(r => !r.complete)).toBe(true);
    }
    const pending = factorTransferPacketSchema.parse(factorTransferPacket({ maxRecords: 1 })); pending.pending = { phase: "FACTOR", id: "200023321:31", q: "2" };
    seal(pending); expect(verifyFactorTransferPacket(pending)).toBe(false);
    for (const args of ["pair_limit=0", "work_limit=0"]) {
      const p = pyPacket(`p=m['packet'](${args})\nprint(m['compact'](p),end='')`); expect(p.status).toBe("PARTIAL"); expect(verifyFactorTransferPacket(p)).toBe(true);
      expect(compareFactorTransferReplay(primary, p)).toBe("PARTIAL"); expect(p.pending).toEqual({ phase: "NODE", id: "200023321:31" });
    }
  });

  it("independent NODE,FACTOR,internalpair,midpoint andFINALIZE expiry preserve exact prefixes", () => {
    for (const condition of ["self.pending.get('id')=='200023321:31'", "self.pending.get('phase')=='FACTOR'", "self.pending.get('id')=='131433121:2053643'", "self.pending.get('phase')=='FINALIZE'"]) {
      const p = pyPacket(`original=g['Budget'].check\ndef check(self):\n    if ${condition}: raise g['Stop']('REPLAY_TIME_LIMIT')\n    original(self)\ng['Budget'].check=check\np=m['packet']()\nprint(m['compact'](p),end='')`);
      expect(p.status).toBe("PARTIAL"); expect(verifyFactorTransferPacket(p)).toBe(true); expect(compareFactorTransferReplay(primary, p)).toBe("PARTIAL");
      if (condition.includes("FINALIZE")) expect(p.nodes).toHaveLength(17);
    }
    const internal = pyPacket("original=g['Budget'].pair\ndef pair(self):\n    if self.pairs==100: raise g['Stop']('REPLAY_TIME_LIMIT')\n    original(self)\ng['Budget'].pair=pair\np=m['packet']()\nprint(m['compact'](p),end='')");
    expect(verifyFactorTransferPacket(internal)).toBe(true); expect(internal.status).toBe("PARTIAL");
  }, 30000);

  it("constructor/stdout serialization deadlines and outputprefix/head caps failclosed", () => {
    const late = pyPacket("clock=[0.0]\noriginal=g['compact']\ndef compact(v):\n    if isinstance(v,dict) and v.get('packetDigest') and v.get('status')=='COMPLETE': clock[0]=61.0\n    return original(v)\ng['compact']=compact\np=m['packet'](clock=lambda:clock[0])\nprint(original(p),end='')");
    expect(late).toMatchObject({ status: "PARTIAL", reason: "REPLAY_TIME_LIMIT", pending: { phase: "FINALIZE" } }); expect(verifyFactorTransferPacket(late)).toBe(true);
    const stdout = pyPacket("clock=[0.0]\nreturned=[False]\noriginal_packet=g['packet']\noriginal_compact=g['compact']\ndef packet(clock):\n    p=original_packet(clock=clock)\n    returned[0]=True\n    return p\ndef compact(v):\n    if returned[0]: clock[0]=61.0\n    return original_compact(v)\ng['packet']=packet\ng['compact']=compact\ng['time'].monotonic=lambda:clock[0]\ng['main']()");
    expect(stdout.status).toBe("PARTIAL"); expect(verifyFactorTransferPacket(stdout)).toBe(true);
    const small = pyPacket("g['MAX_OUTPUT']=10000\np=m['packet']()\nprint(m['compact'](p),end='')");
    expect(small.status).toBe("PARTIAL"); expect(Number(small.runtime.outputBytes)).toBeLessThanOrEqual(10000); expect(verifyFactorTransferPacket(small)).toBe(true);
    const head = python("g['MAX_OUTPUT']=10\nm['packet']()"); expect(head.status).not.toBe(0); expect(head.stdout).toBe("");
  }, 30000);

  it("simulated contradiction retains offending node in nonCOMPLETE investigation and exits1", () => {
    const r = python("original=g['defect']\ndef bad(fs,image,h,b):\n    d=original(fs,image,h,b)\n    d['conditions']['visibleMassBound']=False\n    return d\ng['defect']=bad\ng['main']()");
    expect(r.status).toBe(1); const d = JSON.parse(r.stdout); expect(d).toMatchObject({ status: "INVESTIGATION", reason: "TRANSFER_ARITHMETIC_CONTRADICTION" });
    expect(d.node.nodeDigest).toMatch(/^[a-f0-9]{64}$/); expect(verifyFactorTransferPacket(d)).toBe(false);
  });

  it("source drift/missingIO retain actualexpected pin distinctions, nochildexecution", () => {
    const source = readFileSync("scripts/operations/factor-transfer-replay.py"), file = vi.mocked(readFileSync), child = vi.mocked(spawnSync); child.mockClear();
    try { file.mockReturnValueOnce(Buffer.concat([source, Buffer.from("\n# drift\n")])); const r = replayFactorTransfer(primary);
      expect(r).toMatchObject({ status: "UNAVAILABLE", reason: "SOURCE_PIN_MISMATCH", expectedScriptDigest: FACTOR_TRANSFER_REPLAY_SHA256, verifiedScriptDigest: null });
      expect(r.observedScriptDigest).not.toBe(r.expectedScriptDigest); expect(child).not.toHaveBeenCalled();
      file.mockImplementationOnce(() => { throw new Error("ENOENT"); }); expect(replayFactorTransfer(primary)).toMatchObject({ status: "UNAVAILABLE", reason: "REPLAY_IO_UNAVAILABLE", observedScriptDigest: null });
    } finally { file.mockReset(); child.mockClear(); }
  });

  it("only isolated fixedverified bytes/env execute; missingtool/timeouts/oversized/invalidoutputs failclosed", () => {
    const source = readFileSync("scripts/operations/factor-transfer-replay.py", "utf8"), child = vi.mocked(spawnSync);
    try {
      child.mockImplementation((...args) => { expect(args[0]).toBe("python3"); expect(args[1]).toEqual(["-I", "-S", "-B", "-c", source]);
        expect(Object.keys((args[2] as { env: object }).env).sort()).toEqual(["NODE_ENV", "PATH", "PYTHONDONTWRITEBYTECODE"]);
        return { error: new Error("ENOENT"), status: null, stdout: "", output: [], pid: 0 } as never; }); expect(replayFactorTransfer(primary).status).toBe("UNAVAILABLE");
      child.mockReturnValue({ error: new Error("ETIMEDOUT"), status: null, stdout: "", output: [], pid: 0 } as never); expect(replayFactorTransfer(primary).status).toBe("UNAVAILABLE");
      child.mockReturnValue({ status: 0, stdout: "x".repeat(2097153), output: [], pid: 0 } as never); expect(replayFactorTransfer(primary)).toMatchObject({ status: "UNAVAILABLE", reason: "REPLAY_OUTPUT_LIMIT" });
      child.mockReturnValue({ status: 0, stdout: "invalid", output: [], pid: 0 } as never); expect(replayFactorTransfer(primary)).toMatchObject({ status: "MISMATCH", reason: "REPLAY_JSON_INVALID" });
      child.mockReturnValue({ status: 0, stdout: "{}", output: [], pid: 0 } as never); expect(replayFactorTransfer(primary)).toMatchObject({ status: "MISMATCH", reason: "REPLAY_INVARIANT_INVALID" });
    } finally { child.mockReset(); }
  });

  it("finalobservedreceipt deadline cannotreportPASS afterchildCOMPLETE/comparison", () => {
    const child = vi.mocked(spawnSync), clock = vi.mocked(performance.now), ticks = [0, 0, 59999, 60000];
    try { child.mockReturnValue({ status: 0, stdout: canonicalJson(replay), output: [], pid: 0 } as never); clock.mockImplementation(() => ticks.shift() ?? 60000);
      expect(replayFactorTransfer(primary)).toMatchObject({ status: "UNAVAILABLE", reason: "WRAPPER_TIME_LIMIT", elapsedMs: 60000 }); expect(ticks).toHaveLength(0);
    } finally { child.mockReset(); clock.mockReset(); }
  });
});
