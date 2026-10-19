import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { verifyLrcShiftFiniteCertificate, type LrcShiftFiniteInput } from "@/modules/research-sandbox/math-lrc-method-unit";
import { LRC_SHIFT_REPLAY_VERSION, replayLrcShiftFiniteCertificate } from "@/modules/research-sandbox/math-lrc-shift-replay";
import { copyShiftInput, resealShiftInput, shiftReplayCustom, shiftReplayFixture } from "./math-lrc-shift-replay-fixture";

const budget = () => ({ remainingMs: 5000, remainingOperations: 2000000 });
const check = (value: unknown) => replayLrcShiftFiniteCertificate(value, budget());
afterEach(() => vi.restoreAllMocks());

describe("TIP-071 independent finite shift replay", () => {
  it.each([[3, 2, 24], [5, 2, 80], [5, 3, 80], [5, 4, 80]] as const)("independently reconstructs full d%s/e%s partition", (d, e, cells) => {
    const input = shiftReplayFixture(d, e), report = check(input);
    expect(report.status).toBe("ACCEPTED");
    expect(report.version).toBe(LRC_SHIFT_REPLAY_VERSION);
    expect(report.result?.partitions).toBe(d - 1);
    expect(report.result?.cells).toBe(cells);
    expect(report.result).toEqual(verifyLrcShiftFiniteCertificate(input).result);
    expect(report.resultDigest).toBe(sha256(canonicalJson(report.result)));
    expect(report.chargedOperations).toBeGreaterThan(0);
    expect(report.chargedOperations).toBeLessThanOrEqual(2000000);
    expect(report.elapsedMs).toBeGreaterThanOrEqual(0);
    expect(report.elapsedMs).toBeLessThanOrEqual(5000);
    expect(report).toMatchObject({ globalProof: false, realTimeProof: false, novelty: false, executionAuthority: false });
  });
  it("does not import/call producer, consumer, canonicalPhase, author or IO arithmetic", () => {
    const source = readFileSync("src/modules/research-sandbox/math-lrc-shift-replay.ts", "utf8");
    const imports = [...source.matchAll(/import[\s\S]*?from\s+["']([^"']+)["'];/g)].map(x => x[0]);
    expect(imports).toHaveLength(3);
    expect(imports[2]).toContain("import type");
    expect(source).not.toMatch(/buildLrcShiftPhaseCertificate|verifyLrcShiftFiniteCertificate|canonicalPhase|prepareLrcMethodUnitFiniteEvidence|node:fs|child_process|fetch\(|getDb\(/);
  });
  it("keeps exact d3 single-survivor refutation of >=2, not LRC", () => {
    const report = check(shiftReplayCustom({ d: 3, e: 2, unitResidues: [1, 1], offsets: [
      { numerator: "1", denominator: "30" }, { numerator: "1", denominator: "3" },
    ] }));
    expect(report.status).toBe("ACCEPTED");
    expect(report.result?.tupleBadMasks).toEqual([[0], [2]]);
    expect(report.result?.goodShiftIndices).toEqual([1]);
    expect(report.result?.globalLrc).toBe("NOT_ESTABLISHED");
    expect(report.result?.realTimeProof).toBe("NOT_ESTABLISHED");
  });
  it("keeps d5/e4 exact one survivor without false >=2 inference", () => {
    const report = check(shiftReplayCustom({ d: 5, e: 4, unitResidues: [1, 1, 1, 1], offsets: [
      { numerator: "1", denominator: "75" }, { numerator: "1", denominator: "5" },
      { numerator: "2", denominator: "5" }, { numerator: "3", denominator: "5" },
    ] }));
    expect(report.result?.tupleBadMasks).toEqual([[0], [4], [3], [2]]);
    expect(report.result?.goodShiftIndices).toEqual([1]);
  });
  it("accepts equality at both 1/15 and 14/15 as GOOD", () => {
    const report = check(shiftReplayCustom({ d: 3, e: 2, unitResidues: [1, 2], offsets: [
      { numerator: "1", denominator: "15" }, { numerator: "14", denominator: "15" },
    ] }));
    expect(report.status).toBe("ACCEPTED");
    expect(report.result?.tupleBadMasks).toEqual([[], []]);
    expect(report.result?.goodShiftIndices).toEqual([0, 1, 2]);
  });
  it("independently checks cyclic wrap cell with right >1 and midpoint mod1", () => {
    const input = shiftReplayFixture(5, 4);
    for (const p of input.certificate.partitions) {
      const last = p.cells.at(-1)!;
      expect(BigInt(last.right.numerator)).toBeGreaterThan(BigInt(last.right.denominator));
      expect(BigInt(last.representative.numerator)).toBeLessThan(BigInt(last.representative.denominator));
    }
    expect(check(input).status).toBe("ACCEPTED");
  });
  it("accepts repeated phases/residues and real canonical zero", () => {
    expect(check(shiftReplayCustom({ d: 3, e: 2, unitResidues: [1, 1], offsets: [
      { numerator: "0", denominator: "1" }, { numerator: "0", denominator: "1" },
    ] })).result?.goodShiftIndices).toEqual([1, 2]);
  });
  it.each([[3, 2], [5, 2], [5, 3], [5, 4]] as const)("bounded deterministic phase/residue sweep d%s/e%s agrees independently", (d, e) => {
    const reduced = (numerator: bigint, denominator: bigint) => {
      let a = numerator, b = denominator;
      while (b) { const c = a % b; a = b; b = c; }
      return { numerator: String(numerator / a), denominator: String(denominator / a) };
    };
    const largeDenominator = (BigInt(1) << BigInt(120)) + BigInt(7);
    const phases = [
      reduced(BigInt(0), BigInt(1)), reduced(BigInt(1), BigInt(15)), reduced(BigInt(14), BigInt(15)),
      reduced(BigInt(1000), BigInt(15015)), reduced(BigInt(1002), BigInt(15015)),
      reduced(BigInt(14013), BigInt(15015)), reduced(BigInt(14015), BigInt(15015)),
      reduced(BigInt(1), BigInt(30)), reduced(BigInt(29), BigInt(30)),
      reduced(BigInt(1), largeDenominator), reduced(largeDenominator - BigInt(1), largeDenominator),
      reduced(BigInt(233), BigInt(1001)),
    ];
    for (let round = 0; round < 24; round++) {
      const raw = shiftReplayCustom({ d, e,
        unitResidues: Array.from({ length: e }, (_, i) => 1 + (round + 3 * i) % (d - 1)),
        offsets: Array.from({ length: e }, (_, i) => phases[(round + 5 * i) % phases.length]),
      });
      const original = verifyLrcShiftFiniteCertificate(raw), independent = check(raw);
      expect(original.status).toBe("FINITE_CERTIFICATE_ACCEPTED");
      expect(independent.status).toBe("ACCEPTED");
      expect(independent.result).toEqual(original.result);
      expect(independent.resultDigest).toBe(sha256(canonicalJson(original.result)));
      expect(independent.chargedOperations).toBeGreaterThan(0);
    }
  });

  const mutations: [string, (input: LrcShiftFiniteInput) => void][] = [
    ["missing cell", x => x.certificate.partitions[0].cells.pop()],
    ["reordered cells", x => x.certificate.partitions[0].cells.reverse()],
    ["missing boundary", x => x.certificate.partitions[0].boundaries.pop()],
    ["reordered boundaries", x => x.certificate.partitions[0].boundaries.reverse()],
    ["duplicate boundary", x => { x.certificate.partitions[0].boundaries[1] = x.certificate.partitions[0].boundaries[0]; }],
    ["missing unit partition", x => x.certificate.partitions.pop()],
    ["reordered units", x => x.certificate.partitions.reverse()],
    ["wrong unit", x => { x.certificate.partitions[0].unitResidue = 2; }],
    ["boundary classified open", x => { x.certificate.partitions[0].cells[0].kind = "OPEN"; }],
    ["open classified boundary", x => { x.certificate.partitions[0].cells[1].kind = "BOUNDARY"; }],
    ["wrong adjacency", x => { x.certificate.partitions[0].cells[1].right = { numerator: "1", denominator: "1" }; }],
    ["wrong midpoint", x => { x.certificate.partitions[0].cells[1].representative = { numerator: "0", denominator: "1" }; }],
    ["wrong boundary mask", x => { x.certificate.partitions[0].cells[0].badShiftIndices = [0]; }],
    ["wrong open mask", x => { x.certificate.partitions[0].cells[1].badShiftIndices = [4]; }],
    ["duplicate mask indices", x => { x.certificate.partitions[0].cells[1].badShiftIndices = [0, 0]; }],
    ["wrong tuple mask", x => { x.certificate.tupleBadMasks[0] = []; }],
    ["wrong good union", x => { x.certificate.goodShiftIndices = []; }],
    ["false maximum", x => { x.certificate.maximumBadPerException = 0; }],
    ["changed top scope", x => { x.d = 5; }],
    ["changed total runners", x => { Object.assign(x.certificate, { totalRunners: 14 }); }],
    ["changed m_d", x => { Object.assign(x.certificate, { m_d: 2 }); }],
    ["noncanonical boundary", x => { x.certificate.partitions[0].boundaries[0] = { numerator: "2", denominator: "30" }; }],
    ["noncanonical cell zero", x => { x.certificate.partitions[0].cells[0].representative = { numerator: "0", denominator: "2" }; }],
  ];
  it.each(mutations)("refuses coherently rehashed %s", (_, mutate) => {
    const value = copyShiftInput(); mutate(value); resealShiftInput(value);
    expect(check(value)).toMatchObject({ status: "CERTIFICATE_REFUSED", result: null, resultDigest: null });
  });
  it("refuses missing/wrong certificate digest", () => {
    const input = copyShiftInput(); input.certificate.certificateDigest = "0".repeat(64);
    expect(check(input).status).toBe("CERTIFICATE_REFUSED");
  });
  it.each([
    ["noncanonical phase", { numerator: "2", denominator: "6" }],
    ["phase >=1", { numerator: "1", denominator: "1" }],
    ["zero denominator", { numerator: "0", denominator: "0" }],
    ["leading zero", { numerator: "01", denominator: "3" }],
    ["negative phase", { numerator: "-1", denominator: "3" }],
  ])("refuses %s", (_, offset) => {
    const input = copyShiftInput(); input.offsets[0] = offset as { numerator: string; denominator: string };
    expect(check(input).status).toBe("CERTIFICATE_REFUSED");
  });
  it.each([7, 11])("returns UNSUPPORTED for well-formed d%s, no mathematical result", d => {
    const value = copyShiftInput(); Object.assign(value, { d });
    expect(check(value)).toMatchObject({ status: "UNSUPPORTED", result: null, resultDigest: null });
  });
  it("returns UNSUPPORTED for d3/e3 rather than expand union-bound scope", () => {
    const value = copyShiftInput();
    value.e = 3; value.unitResidues.push(1); value.offsets.push({ numerator: "0", denominator: "1" });
    expect(check(value).status).toBe("UNSUPPORTED");
  });
  it("refuses mismatched tuple lengths and nonunit residue", () => {
    const value = copyShiftInput(); value.unitResidues.pop();
    expect(check(value).status).toBe("CERTIFICATE_REFUSED");
    const other = copyShiftInput(); other.unitResidues[0] = 3;
    expect(check(other).status).toBe("CERTIFICATE_REFUSED");
  });
  it.each(["offset", "certificate"] as const)("refuses %s over256bits BEFORE hash/BigInt arithmetic", kind => {
    const value = copyShiftInput(), oversized = (BigInt(1) << BigInt(256)).toString();
    if (kind === "offset") value.offsets[0].denominator = oversized;
    else value.certificate.partitions[0].boundaries[0].denominator = oversized;
    expect(check(value).status).toBe("RESOURCE_REFUSED");
  });
  it("refuses bounded input whose tuple denominator*d intermediate exceeds256bits", () => {
    const value = copyShiftInput(); value.offsets[0] = { numerator: "1", denominator: ((BigInt(1) << BigInt(256)) - BigInt(1)).toString() };
    expect(check(value).status).toBe("RESOURCE_REFUSED");
  });
  it("caps UTF8 input before schema/hash/arithmetic", () => {
    const value = { ...copyShiftInput(), oversized: "é".repeat(20000) };
    expect(check(value).status).toBe("RESOURCE_REFUSED");
  });
  it("caps deeply nested input before schema/hash/arithmetic", () => {
    let raw: unknown = 1; for (let i = 0; i < 34; i++) raw = [raw];
    expect(check(raw).status).toBe("RESOURCE_REFUSED");
  });
  it("caps wide node/descriptor counts", () => {
    expect(check(Array.from({ length: 13000 }, () => 0)).status).toBe("RESOURCE_REFUSED");
  });
  it("refuses accessor input without invoking getter", () => {
    let calls = 0; const raw = copyShiftInput();
    Object.defineProperty(raw, "d", { enumerable: true, get: () => { calls++; return 3; } });
    expect(check(raw).status).toBe("CERTIFICATE_REFUSED"); expect(calls).toBe(0);
  });
  it.each([new Date(), Object.create(null), [,,], new Map(), BigInt(1), undefined, NaN, Infinity, -0])("refuses nonplain JSON %s", raw => {
    expect(check(raw).status).toBe("CERTIFICATE_REFUSED");
  });
  it("refuses cycles, symbols, nonenumerable extra and toJSON without invocation", () => {
    const raw = { child: null as unknown }; raw.child = raw;
    expect(check(raw).status).toBe("CERTIFICATE_REFUSED");
    const symbol = { [Symbol("unsafe")]: 3 };
    expect(check(symbol).status).toBe("CERTIFICATE_REFUSED");
    const extra = copyShiftInput(); Object.defineProperty(extra, "unsafe", { value: 1 });
    expect(check(extra).status).toBe("CERTIFICATE_REFUSED");
    let calls = 0; const withJson = { toJSON: () => { calls++; return shiftReplayFixture(); } };
    expect(check(withJson).status).toBe("CERTIFICATE_REFUSED"); expect(calls).toBe(0);
  });
  it("refuses array extra property", () => {
    const input = copyShiftInput(); Object.assign(input.offsets, { unsafe: 1 });
    expect(check(input).status).toBe("CERTIFICATE_REFUSED");
  });
  it.each([0, -1, 5001, Infinity, NaN])("refuses invalid remainingMs %s", remainingMs => {
    expect(replayLrcShiftFiniteCertificate(copyShiftInput(), { remainingMs, remainingOperations: 2000000 }).status).toBe("RESOURCE_REFUSED");
  });
  it.each([0, -1, 2000001, 1.5, Infinity])("refuses invalid remainingOperations %s", remainingOperations => {
    expect(replayLrcShiftFiniteCertificate(copyShiftInput(), { remainingMs: 5000, remainingOperations }).status).toBe("RESOURCE_REFUSED");
  });
  it("charges exhausted remaining budget without resetting operations", () => {
    const report = replayLrcShiftFiniteCertificate(copyShiftInput(), { remainingMs: 5000, remainingOperations: 20 });
    expect(report.status).toBe("RESOURCE_REFUSED");
    expect(report.chargedOperations).toBeGreaterThan(0);
    expect(report.chargedOperations).toBeLessThanOrEqual(20);
  });
  it("charges actual remaining monotonic time through input validation", () => {
    const raw = copyShiftInput(); let ms = 0;
    vi.spyOn(performance, "now").mockImplementation(() => ++ms);
    const report = replayLrcShiftFiniteCertificate(raw, { remainingMs: 0.5, remainingOperations: 2000000 });
    expect(report.status).toBe("RESOURCE_REFUSED"); expect(report.elapsedMs).toBeGreaterThan(0.5);
  });
  it("does not invoke budget getters", () => {
    let called = false;
    const raw = { remainingMs: 5000, get remainingOperations() { called = true; return 2000000; } };
    expect(replayLrcShiftFiniteCertificate(copyShiftInput(), raw).status).toBe("RESOURCE_REFUSED");
    expect(called).toBe(false);
  });
  it("counts/refuses stale hash despite correct mathematical cells", () => {
    const input = copyShiftInput(); input.certificate.certificateDigest = "f".repeat(64);
    const report = check(input);
    expect(report.status).toBe("CERTIFICATE_REFUSED"); expect(report.chargedOperations).toBeGreaterThan(0);
  });
});
