import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dualCanonicalJson, dualDigest, dualTargetAbstract, dualTargetPacket, dualTargetRow, DUAL_TARGET_INPUTS, DUAL_TARGET_LIMITS, sealDualPacket, validateNormWitness, validateRatioWitness, verifyDualPacket } from "../../scripts/operations/dual-target";

describe("TIP-045 independently paid dual target", () => {
  it("freezes only six exposed controls with inert import and no old producer", () => {
    expect(DUAL_TARGET_INPUTS.controls.map((v) => [v.p, v.h])).toEqual([["13", "7"], ["61", "7"], ["157", "7"], ["401", "31"], ["2521", "31"], ["113", "31"]]);
    const source = readFileSync("scripts/operations/dual-target.ts", "utf8");
    expect([...source.matchAll(/import .*? from "([^"]+)"/g)].map((v) => v[1])).toEqual(["node:crypto", "node:perf_hooks"]);
    expect(source).not.toMatch(/fetch\(|child_process|process\.stdout/);
  });
  it("retains coordinate order while canonicalizing object keys", () => {
    expect(dualCanonicalJson({ b: 2, a: 1 })).toBe('{"a":1,"b":2}');
    expect(dualDigest({ a: ["0", "1"], b: 2 })).toBe(dualDigest({ b: 2, a: ["0", "1"] }));
    expect(dualDigest(["0", "1"])).not.toBe(dualDigest(["1", "0"]));
  });
  it("decodes exact squarefree norm allocations without reusing a valuation", () => {
    const r = dualTargetRow(113, 31), w = r.typeI.witness!;
    expect(w.normExponents).toEqual(["1", "3"]); expect(w.signedExponents).toEqual(["-1", "1"]);
    expect([w.a, w.d, w.c, w.v, w.b, w.x, w.y, w.z]).toEqual(["3", "6", "2", "7", "11", "36", "132", "22374"]);
    expect(w.alpha.map((v, i) => Number(v) + Number(w.delta[i])).every((v, i) => v <= Number(r.factors[i][1]))).toBe(true);
    expect(validateNormWitness(r.p, r.h, r.T, r.factors, w)).toBe(true);
  });
  it("does not whole-invert the canonical Type I target or mix unsigned correction", () => {
    const r = dualTargetRow(113, 31), w = r.typeI.witness!;
    expect(r.typeI.target).not.toBe(r.typeI.inverseTarget); expect(r.typeI.correction!.coordinate).toBe("UNSIGNED_NORM");
    const flipped = w.signedExponents.map((v) => String(-Number(v)));
    expect(validateNormWitness(r.p, r.h, r.T, r.factors, { ...w, signedExponents: flipped })).toBe(false);
    expect(validateNormWitness(r.p, r.h, r.T, r.factors, { ...w, normExponents: ["5", "3"] })).toBe(false);
  });
  it("retains the known quarter-direction control while Type II remains short", () => {
    const r = dualTargetRow(113, 31);
    expect([r.L.length, r.d, r.Eplus, r.Eminus, r.typeI.beta, r.typeI.ell]).toEqual([5, "6", "2", "0", "0", "3"]);
    expect(r.typeI.verdict).toBe("HIT"); expect(r.typeII.verdict).toBe("LOCAL_MISS");
    expect(r.normPaid && r.ratioPaid).toBe(true);
  });
  it("uses quotient rather than full inert order for the known paid control", () => {
    const r = dualTargetRow(401, 31), w = r.typeII.witness!;
    expect(r.d).toBe("6"); expect(r.L).toEqual(["1", "2", "4", "8", "16"]);
    expect([w.x, w.y, w.z]).toEqual(["108", "1604", "10827"]);
    expect(r.typeII.correction!.coordinate).toBe("SIGNED_RATIO");
    expect(validateRatioWitness(r.p, r.h, r.T, r.factors, w)).toBe(true);
  });
  it("incoherence remains UNKNOWN for the exposed p2521 control", () => {
    const r = dualTargetRow(2521, 31); expect(r.coherent).toBe(false);
    expect(r.typeI.verdict).toBe("UNKNOWN"); expect(r.typeII.verdict).toBe("UNKNOWN");
    expect(r.typeI.witness).toBeNull(); expect(r.typeII.witness).toBeNull();
  });
  it("classifies no-inert support as two local misses", () => {
    const r = dualTargetAbstract(7, [[2, 1]]); expect(r.anchor).toBeNull();
    expect(r.typeI.reason).toBe("NO_INERT"); expect(r.typeII.reason).toBe("NO_INERT");
  });
  it("balanced direction mass is not the one-direction quarter theorem", () => {
    const r = dualTargetAbstract(31, [[2, 2], [3, 1], [21, 1]]);
    expect([r.d, r.Eplus, r.Eminus, r.typeI.beta]).toEqual(["6", "1", "1", "0"]);
    expect(r.typeI.projected).toBe(false); expect(r.typeI.verdict).toBe("LOCAL_MISS");
  });
  it("retains the exact four-outside obstruction", () => {
    const r = dualTargetAbstract(7, [[6, 1]]); expect(r.typeI.reason).toBe("FOUR_OUTSIDE");
    expect(r.typeI.verdict).toBe("LOCAL_MISS"); expect(r.typeII.verdict).toBe("HIT");
  });
  it("does not turn generated split L into free correction", () => {
    const r = dualTargetAbstract(31, [[2, 1], [3, 3]]); expect(r.L.length).toBe(5);
    expect(r.normPaid).toBe(false); expect(r.ratioPaid).toBe(false);
    expect(r.typeII.projected).toBe(true); expect(r.typeII.verdict).toBe("UNKNOWN");
    expect(r.typeII.correction!.representation).toBeNull();
  });
  it("can pay a specific point without falsely claiming full coverage", () => {
    const r = dualTargetAbstract(31, [[2, 1], [3, 2]]);
    expect(r.normPaid).toBe(false); expect(r.typeI.projected).toBe(true);
    expect(r.typeI.reason).toBe("POINT_CORRECTION"); expect(r.typeI.verdict).toBe("HIT");
    expect(r.typeI.correction!.representation!.m).toBe("2");
  });
  it("rejects invalid domains and unbounded abstract inputs", () => {
    for (const [p, h] of [[19, 7], [13, 9], [13, 19], [201000001, 7]]) expect(() => dualTargetRow(p, h)).toThrow();
    expect(() => dualTargetAbstract(31, Array.from({ length: 17 }, () => [2, 1] as [number, number]))).toThrow();
    expect(() => dualTargetAbstract(31, [[0, 1]])).toThrow();
  });
  it("rejects widening, fractional, nonfinite and future-clock resources", () => {
    for (const o of [{ seconds: 31 }, { seconds: NaN }, { maxRows: 7 }, { maxRows: 0 }, { maxWork: 1.5 }, { maxStateInsertions: Infinity }, { maxOutputBytes: 4095 }]) expect(() => dualTargetPacket(o)).toThrow();
    expect(() => dualTargetPacket({ now: () => 0, origin: 1 })).toThrow(); expect(() => dualTargetPacket({ unknown: 1 } as never)).toThrow();
    let calls = 2; expect(() => dualTargetPacket({ now: () => --calls })).toThrow();
  });
  it("default packet is complete and structurally freshly reproducible", () => {
    const p = dualTargetPacket(); expect(p.status).toBe("COMPLETE"); expect(p.rows).toHaveLength(6);
    expect(verifyDualPacket(p)).toBe(true); expect(Buffer.byteLength(JSON.stringify(p))).toBe(Number(p.runtime.outputBytes));
  });
  it("row limit retains only completed registered prefix", () => {
    const p = dualTargetPacket({ maxRows: 1 }); expect(p.status).toBe("PARTIAL"); expect(p.reason).toBe("ROW_LIMIT");
    expect(p.rows).toHaveLength(1); expect(p.pending).toEqual({ phase: "ROW", index: "1", p: "61", h: "7" }); expect(verifyDualPacket(p)).toBe(true);
  });
  it("rejects rehashed impossible lowered row caps and resource-stop receipts", () => {
    const p = dualTargetPacket(); p.limits.maxRows = 1; sealDualPacket(p); expect(verifyDualPacket(p)).toBe(false);
    const q = dualTargetPacket({ maxRows: 1 }); q.limits.maxRows = 2; sealDualPacket(q); expect(verifyDualPacket(q)).toBe(false);
    const w = dualTargetPacket({ maxWork: 1 }); w.runtime.work = "0"; sealDualPacket(w); expect(verifyDualPacket(w)).toBe(false);
    const forged = dualTargetPacket(); forged.limits.maxWork = forged.limits.maxStateInsertions = 1; forged.runtime.work = forged.runtime.stateInsertions = "1"; sealDualPacket(forged); expect(verifyDualPacket(forged)).toBe(false);
    const underreported = dualTargetPacket(); underreported.runtime.work = underreported.runtime.stateInsertions = "1"; sealDualPacket(underreported); expect(verifyDualPacket(underreported)).toBe(false);
  });
  it("work/state limits precheck and preserve no unfinished row", () => {
    for (const o of [{ maxWork: 1 }, { maxStateInsertions: 1 }]) { const p = dualTargetPacket(o); expect(p.status).toBe("PARTIAL"); expect(p.rows).toHaveLength(0); expect(Number(p.runtime.work)).toBeLessThanOrEqual(o.maxWork ?? DUAL_TARGET_LIMITS.maxWork); expect(Number(p.runtime.stateInsertions)).toBeLessThanOrEqual(o.maxStateInsertions ?? DUAL_TARGET_LIMITS.maxStateInsertions); expect(verifyDualPacket(p)).toBe(true); }
  });
  it("deadline during a row never returns its unfinished science", () => {
    let calls = 0; const p = dualTargetPacket({ now: () => ++calls < 20 ? 0 : 30000 });
    expect(p.status).toBe("PARTIAL"); expect(p.reason).toBe("TIME_LIMIT"); expect(p.rows).toHaveLength(0); expect(p.pending?.phase).toBe("ROW"); expect(verifyDualPacket(p)).toBe(true);
  });
  it("observes a final-seal deadline and records full completed prefix", () => {
    let calls = 0; dualTargetPacket({ now: () => { calls++; return 0; } });
    let actual = 0; const p = dualTargetPacket({ now: () => ++actual < calls - 1 ? 0 : 30000 });
    expect(p.status).toBe("PARTIAL"); expect(p.reason).toBe("TIME_LIMIT"); expect(p.rows).toHaveLength(6); expect(p.pending).toEqual({ phase: "FINALIZE" }); expect(verifyDualPacket(p)).toBe(true);
  });
  it("output cap retains ordered atomic prefix and exact actual bytes", () => {
    const p = dualTargetPacket({ maxOutputBytes: 4096 }); expect(p.status).toBe("PARTIAL"); expect(p.reason).toBe("OUTPUT_LIMIT");
    expect(p.rows.length).toBeLessThan(6); expect(Number(p.runtime.outputBytes)).toBeLessThanOrEqual(4096); expect(verifyDualPacket(p)).toBe(true);
  });
  it("rejects effective fully resealed science mutations rather than only hashes", () => {
    const p = dualTargetPacket(), mutations: Array<(v: typeof p) => void> = [
      (v) => { v.rows[0].p = "17"; }, (v) => { v.rows[0].h = "11"; }, (v) => { v.rows[0].factors[0][1] = "2"; },
      (v) => { v.rows[0].characters[0].shiftCharacter = "+1"; }, (v) => { v.rows[3].splitNormImage[0].m = "2"; },
      (v) => { v.rows[5].typeI.target = "1"; }, (v) => { v.rows[5].typeI.projected = false; },
      (v) => { v.rows[5].typeI.correction!.residue = "1"; }, (v) => { v.rows[5].typeI.witness!.normExponents[0] = "0"; },
      (v) => { v.rows[5].typeI.witness!.z = "1"; }, (v) => { v.rows.reverse(); }, (v) => { v.rows[4].coherent = true; },
    ];
    for (const change of mutations) { const q = structuredClone(p); change(q); for (const row of q.rows) { const { rowDigest: _digest, ...rest } = row; void _digest; row.rowDigest = dualDigest(rest); } sealDualPacket(q); expect(dualCanonicalJson(q.rows)).not.toBe(dualCanonicalJson(p.rows)); expect(verifyDualPacket(q)).toBe(false); }
    const bad = structuredClone(p); bad.summary.total = "7"; bad.contentDigest = dualDigest({ method: bad.method, inputs: bad.inputs, policy: bad.policy, scope: bad.scope, rows: bad.rows, summary: bad.summary }); bad.runtime.outputBytes = String(Buffer.byteLength(JSON.stringify(bad))); expect(verifyDualPacket(bad)).toBe(false);
  });
  it("CLI rejects flags and actual installed runner executes default successfully", () => {
    expect(() => execFileSync(process.execPath, ["--import", "tsx", "scripts/operations/dual-target-audit.ts", "--truth"], { stdio: "pipe" })).toThrow();
    const text = execFileSync(process.execPath, ["--import", "tsx", "scripts/operations/dual-target-audit.ts"], { encoding: "utf8", maxBuffer: 2_000_000 });
    const p = JSON.parse(text); expect(p.status).toBe("COMPLETE"); expect(p.rows).toHaveLength(6); expect(Number(p.runtime.outputBytes)).toBe(Buffer.byteLength(text)); expect(verifyDualPacket(p)).toBe(true);
  });
  it("all five actual tighter CLI stop scenarios retain exact bounded PARTIAL bytes", () => {
    const scenarios = [[{ seconds: 1e-9 }, "TIME_LIMIT"], [{ maxRows: 1 }, "ROW_LIMIT"], [{ maxWork: 1 }, "WORK_LIMIT"], [{ maxStateInsertions: 1 }, "STATE_LIMIT"], [{ maxOutputBytes: 4096 }, "OUTPUT_LIMIT"]] as const;
    for (const [limits, reason] of scenarios) {
      try { execFileSync(process.execPath, ["--import", "tsx", "scripts/operations/dual-target-audit.ts"], { encoding: "utf8", input: JSON.stringify({ limits }), stdio: "pipe" }); throw new Error("A cap must stop"); }
      catch (error) { const failed = error as { status?: number; stdout?: string }; expect(failed.status).toBe(1); const text = String(failed.stdout), p = JSON.parse(text); expect(p.status).toBe("PARTIAL"); expect(p.reason).toBe(reason); expect(Buffer.byteLength(text)).toBe(Number(p.runtime.outputBytes)); expect(verifyDualPacket(p)).toBe(true); }
    }
  });
  it("stdin cannot widen, change inputs, inject a clock or exceed its byte ceiling", () => {
    for (const input of [{ limits: { seconds: 31 } }, { controls: [] }, { limits: { now: 1 } }, "x".repeat(65537)]) expect(() => execFileSync(process.execPath, ["--import", "tsx", "scripts/operations/dual-target-audit.ts"], { input: typeof input === "string" ? input : JSON.stringify(input), stdio: "pipe" })).toThrow();
  });
});
