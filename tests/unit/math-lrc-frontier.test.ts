import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import childProcess from "node:child_process";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { lrcCoverCertificateDigest, lrcCoverScopeDigest, verifyLrcCoverCertificate,
  type LrcCoverCertificate } from "@/modules/research-sandbox/math-lrc-cover-bound";
import { LRC_COVER_REPLAY_SCRIPT_SHA256, type LrcCoverEvidence } from "@/modules/research-sandbox/math-lrc-cover-replay";
import { allikvereCoverReportDigest, type AllikvereCoverReport } from "@/modules/research-sandbox/math-lrc-cover-report";
import * as coverReports from "@/modules/research-sandbox/math-lrc-cover-report";
import { LRC_FRONTIER_BASE, LRC_FRONTIER_CONTRACT_DIGEST, LRC_FRONTIER_LIMITS, LRC_FRONTIER_METHOD,
  deriveResumeChildScope, deriveResumeChildRoot, lrcResumeJobDigest, lrcResumePlanDigest,
  lrcFrontierPacketDigest, lrcFrontierOutputBytes, mapResumeChildPrefix, selectResumePlan, verifyResumeComposition,
  type LrcFrontierPacket, type LrcResumePlan } from "@/modules/research-sandbox/math-lrc-frontier";

vi.mock("@/modules/research-sandbox/math-lrc-cover-report", async (original) => {
  const actual = await original<typeof import("@/modules/research-sandbox/math-lrc-cover-report")>();
  return { ...actual, validateRetainedAllikvereCoverReport: vi.fn(actual.validateRetainedAllikvereCoverReport) };
});

let base: AllikvereCoverReport, plan: LrcResumePlan, packet: LrcFrontierPacket;
const bytes = readFileSync(LRC_FRONTIER_BASE.path, "utf8");
/** Mock receipt construction only: no independent process is claimed here.
 * A root UNRESOLVED certificate is actually rerun by the bounded primary
 * checker, while the envelope duplicates its result to exercise pure admission. */
function unresolvedEvidence(job: LrcResumePlan["jobs"][number]): LrcCoverEvidence {
  const body = { version: 1 as const, method: "LRC_MODULAR_BOUND_TREE_V1" as const,
    rootContractDigest: job.childRootContractDigest, scopeDigest: lrcCoverScopeDigest(job.childScope), rootNodeId: "r",
    nodes: [{ id: "r", prefix: [], kind: "UNRESOLVED" as const, reason: "NODE_LIMIT" as const }] };
  const certificate: LrcCoverCertificate = { ...body, certificateDigest: lrcCoverCertificateDigest(body) };
  const primary = verifyLrcCoverCertificate(certificate, job.childScope, job.childRootContractDigest);
  expect(primary.status).toBe("PARTIAL");
  const ordered = { status: primary.status, scopeDigest: primary.scopeDigest, certificateDigest: primary.certificateDigest,
    totalTuples: primary.totalTuples, classifiedTuples: primary.classifiedTuples, witnessTuples: primary.witnessTuples,
    gcdTuples: primary.gcdTuples, survivorTuples: primary.survivorTuples, unresolvedTuples: primary.unresolvedTuples,
    nodeCount: primary.nodeCount, leafCount: primary.leafCount, coverLeaves: primary.coverLeaves,
    gcdLeaves: primary.gcdLeaves, survivorLeaves: primary.survivorLeaves, unresolvedLeaves: primary.unresolvedLeaves,
    survivors: primary.survivors.map((s) => ({ digits: s.digits, residues: s.residues })), lowerDependency: primary.lowerDependency, errors: primary.errors };
  const envelope = { version: 1 as const, rootContractDigest: job.childRootContractDigest, scopeDigest: body.scopeDigest,
    certificate, primary, independent: { method: "LRC_COVER_PYTHON_TREE_REPLAY_V1" as const, status: "PARTIAL" as const,
      scriptDigest: LRC_COVER_REPLAY_SCRIPT_SHA256,
      outputDigest: sha256(`${JSON.stringify({ method: "LRC_COVER_PYTHON_TREE_REPLAY_V1", summary: ordered })}\n`), summary: primary } };
  return { ...envelope, evidenceDigest: sha256(canonicalJson(envelope)) };
}
function reseal(value: LrcFrontierPacket): LrcFrontierPacket {
  for (const job of value.plan.jobs) {
    const { childRootContractDigest: _root, jobDigest: _job, ...binding } = job; void _root; void _job;
    job.childRootContractDigest = deriveResumeChildRoot(binding); job.jobDigest = lrcResumeJobDigest(job);
  }
  value.plan.planDigest = lrcResumePlanDigest(value.plan);
  value.packetDigest = lrcFrontierPacketDigest(value); return value;
}
function sealEvidence(value: LrcCoverEvidence): void {
  value.certificate.certificateDigest = lrcCoverCertificateDigest(value.certificate);
  const { evidenceDigest: _ignored, ...body } = value; void _ignored;
  value.evidenceDigest = sha256(canonicalJson(body));
}
beforeAll(() => {
  base = JSON.parse(bytes); plan = selectResumePlan(base);
  const body = { version: 1 as const, method: LRC_FRONTIER_METHOD, contractDigest: LRC_FRONTIER_CONTRACT_DIGEST,
    baseReportDigest: base.reportDigest, plan, children: plan.jobs.map((job) => ({ jobDigest: job.jobDigest, evidence: unresolvedEvidence(job) })) };
  packet = { ...body, packetDigest: lrcFrontierPacketDigest(body) };
}, 15000);

describe("sealed resumable frontier composition (mock independent child receipts, genuine primary rerun)", () => {
  it("pins immutable contract and base bytes and selects the eight preregistered roles without child outcomes", () => {
    expect(sha256(bytes)).toBe(LRC_FRONTIER_BASE.rawSha256);
    expect(base.reportDigest).toBe(LRC_FRONTIER_BASE.reportDigest);
    expect(sha256(readFileSync("docs/contractor/tips/TIP-049_LRC_FRONTIER_COMPOSITION.json", "utf8"))).toBe(LRC_FRONTIER_CONTRACT_DIGEST);
    expect(plan.jobs.map((j) => [j.nodeId, j.prefix, j.totalTuples])).toEqual([
      ["n12437", [0,0,0,3,2,6,1], "117649"], ["n12462", [1], "13841287201"],
      ["n12012", [0,0,0,3,6,5,3,3], "16807"], ["n12035", [1], "13841287201"],
      ["n13929", [0,0,0,1,5,2,2,2], "16807"], ["n13960", [1], "13841287201"],
      ["n13466", [0,0,0,2,2,3,6,5], "16807"], ["n13491", [1], "13841287201"],
    ]);
    expect(plan.jobs.map((j) => j.role)).toEqual(Array.from({ length: 4 }, () => ["closure-control", "strategic-mass"]).flat());
    expect(new Set(plan.jobs.map((j) => j.jobDigest)).size).toBe(8);
  });
  it("fixes only original prefix axes and preserves ordered repeated residues, source and all trailing choices", () => {
    for (const job of plan.jobs) {
      const parent = base.rows.find((r) => r.id === job.parentId)!;
      expect(job.childScope.parentResidues).toEqual(parent.scope.parentResidues);
      expect(job.childScope.sourceDigest).toBe(parent.scope.sourceDigest);
      expect(job.childScope.digitAxes).toEqual(parent.scope.digitAxes.map((axis, i) => i < job.prefix.length ? [job.prefix[i]] : axis));
      expect(job.childScope.digitAxes.reduce((n, a) => n * BigInt(a.length), BigInt(1)).toString()).toBe(job.totalTuples);
    }
    expect(() => deriveResumeChildScope(plan.jobs[0].childScope, [1])).toThrow();
  });
  it("does not concatenate child prefixes; early unresolved nodes retain the entire singleton-fixed parent region", () => {
    expect(mapResumeChildPrefix([0,0,0,3], [])).toEqual([0,0,0,3]);
    expect(mapResumeChildPrefix([0,0,0,3], [0,0])).toEqual([0,0,0,3]);
    expect(mapResumeChildPrefix([0,0,0,3], [0,0,0,3,6])).toEqual([0,0,0,3,6]);
    expect(() => mapResumeChildPrefix([0,0,0,3], [0,1])).toThrow();
    expect(() => mapResumeChildPrefix([7], [])).toThrow();
  });
  it("replays real base and all eight bounded child certificates; exact BigInt frontier replacement leaves counts unchanged", () => {
    const result = verifyResumeComposition(packet, base);
    expect(result?.status).toBe("PARTIAL");
    expect(result?.globalVerdict).toBe("NOT_ESTABLISHED");
    expect(result?.uncoveredObligations).toEqual(base.uncoveredObligations);
    for (const row of result!.rows) {
      expect(row.current).toEqual(row.previous);
      expect(row.delta).toEqual({ witnessTuples: "0", gcdTuples: "0", survivorTuples: "0", classifiedTuples: "0" });
      expect(row.remainingFrontier.filter((leaf) => leaf.origin === "CHILD")).toHaveLength(2);
      expect(row.remainingFrontier.reduce((n, leaf) => n + BigInt(leaf.totalTuples), BigInt(0)).toString()).toBe(row.current.unresolvedTuples);
      expect(row.remainingFrontier.every((leaf) => leaf.prefix.length > 0)).toBe(true);
    }
    expect(lrcFrontierOutputBytes(result!)).toBe(`${canonicalJson({ method: "LRC_FRONTIER_PYTHON_COMPOSITION_V1", summary: result })}\n`);
    expect(sha256(bytes)).toBe(LRC_FRONTIER_BASE.rawSha256);
  }, 15000);
  it.each([
    ["changed role", (x: LrcFrontierPacket) => { x.plan.jobs[0].role = "strategic-mass"; }],
    ["resolved target", (x: LrcFrontierPacket) => { const n = base.rows[4].evidence.certificate.nodes.find((n) => n.kind === "COVER_BOUND")!; x.plan.jobs[0].nodeId = n.id; x.plan.jobs[0].prefix = n.prefix; }],
    ["off-policy unknown target", (x: LrcFrontierPacket) => { const n = base.rows[4].evidence.certificate.nodes.find((n) => n.kind === "UNRESOLVED" && n.id !== x.plan.jobs[0].nodeId && n.id !== x.plan.jobs[1].nodeId)!; x.plan.jobs[0].nodeId = n.id; x.plan.jobs[0].prefix = n.prefix; }],
    ["cross-parent root", (x: LrcFrontierPacket) => { x.plan.jobs[0].parentRootContractDigest = x.plan.jobs[2].parentRootContractDigest; }],
    ["trailing-axis narrowing", (x: LrcFrontierPacket) => { x.plan.jobs[0].childScope.digitAxes[12] = [0]; }],
    ["ordered residue permutation", (x: LrcFrontierPacket) => { x.plan.jobs[0].childScope.parentResidues.reverse(); }],
    ["source drift", (x: LrcFrontierPacket) => { x.plan.jobs[0].childScope.sourceDigest = "a".repeat(64); }],
    ["wrong cardinality", (x: LrcFrontierPacket) => { x.plan.jobs[0].totalTuples = "1"; }],
    ["leaf hash drift", (x: LrcFrontierPacket) => { x.plan.jobs[0].targetNodeDigest = "a".repeat(64); }],
    ["duplicate substitution", (x: LrcFrontierPacket) => { x.plan.jobs[1] = structuredClone(x.plan.jobs[0]); }],
  ] as const)("rejects coherently rehashed %s before replacing any unknown region", (_name, mutate) => {
    const changed = structuredClone(packet); mutate(changed); reseal(changed);
    expect(verifyResumeComposition(changed, base)).toBeNull();
  }, 15000);
  it("rejects missing jobs, foreign packet keys and duplicate or misordered child receipts", () => {
    const missing = structuredClone(packet); missing.children.pop(); missing.packetDigest = lrcFrontierPacketDigest(missing);
    expect(verifyResumeComposition(missing, base)).toBeNull();
    expect(verifyResumeComposition({ ...packet, arbitraryCode: "exec" }, base)).toBeNull();
    for (const order of [[0,0,2,3,4,5,6,7], [1,0,2,3,4,5,6,7]]) {
      const changed = structuredClone(packet); changed.children = order.map((i) => packet.children[i]); changed.packetDigest = lrcFrontierPacketDigest(changed);
      expect(verifyResumeComposition(changed, base)).toBeNull();
    }
  }, 15000);
  it("rejects rehashed stale base even if its own old report checksum is updated", () => {
    const changed = structuredClone(base); changed.generatedAt = "2026-10-03T01:00:00.000Z";
    changed.reportDigest = allikvereCoverReportDigest(changed);
    expect(() => selectResumePlan(changed)).toThrow("stale");
    expect(verifyResumeComposition(packet, changed)).toBeNull();
  }, 15000);
  it("rejects rehashed child false proof, count drift and cross-domain root", () => {
    for (const mutation of [
      (x: LrcCoverEvidence) => { x.certificate.rootContractDigest = plan.jobs[2].childRootContractDigest; },
      (x: LrcCoverEvidence) => { x.certificate.nodes[0] = { id: "r", prefix: [], kind: "COVER_BOUND", uncoveredCount: 0, maxBad: Array(13).fill(0) }; },
      (x: LrcCoverEvidence) => { x.primary.unresolvedTuples = "0"; x.primary.classifiedTuples = x.primary.totalTuples; },
    ]) {
      const changed = structuredClone(packet); mutation(changed.children[0].evidence); sealEvidence(changed.children[0].evidence);
      changed.packetDigest = lrcFrontierPacketDigest(changed);
      expect(verifyResumeComposition(changed, base)).toBeNull();
    }
  }, 15000);
  it("respects stricter-only clock/byte limits including serialization and rejects observed expiry", () => {
    expect(verifyResumeComposition(packet, base, { timeoutMs: 0 })).toBeNull();
    expect(verifyResumeComposition(packet, base, { timeoutMs: 30001 })).toBeNull();
    expect(verifyResumeComposition(packet, base, { timeoutMs: -1 })).toBeNull();
    let reads = 0;
    const clock = vi.spyOn(performance, "now").mockImplementation(() => reads++ === 0 ? 0 : 30001);
    try { expect(verifyResumeComposition(packet, base)).toBeNull(); } finally { clock.mockRestore(); }
    expect(verifyResumeComposition({ data: "x".repeat(LRC_FRONTIER_LIMITS.compositionBytes) }, base)).toBeNull();
  }, 15000);
  it("pure admission performs no producer, Python, model or network dispatch", () => {
    const execute = vi.spyOn(childProcess, "execFile"), fetch = vi.spyOn(globalThis, "fetch");
    vi.mocked(coverReports.validateRetainedAllikvereCoverReport).mockClear();
    try { expect(verifyResumeComposition(packet, base)).not.toBeNull(); expect(execute).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
      expect(coverReports.validateRetainedAllikvereCoverReport).toHaveBeenCalledTimes(1); }
    finally { execute.mockRestore(); fetch.mockRestore(); }
    expect(sha256(readFileSync(LRC_FRONTIER_BASE.path, "utf8"))).toBe(LRC_FRONTIER_BASE.rawSha256);
  }, 15000);
});
