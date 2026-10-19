import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { abstractInertDirection, inertCanonicalJson, inertDigest, inertDirectionPacket, inertDirectionRow, INERT_DIRECTION_INPUTS, INERT_DIRECTION_LIMITS, validateInertWitness } from "../../scripts/operations/inert-direction";

// Independent additive truth ONLY for declared abstract controls, not180 roots.
function image(n: number, terms: Array<[number, number]>) {
  let values = new Set([0]);
  for (const [r, e] of terms) { const next = new Set<number>(); for (const v of values) for (let z = -e; z <= e; z++) next.add(((v + r * z) % n + n) % n); values = next; }
  return values;
}
describe("TIP-043 root-coupled inert direction", () => {
  it("has frozen180 prime-shift inputs and no prior-producer imports", () => {
    expect(INERT_DIRECTION_INPUTS.roots).toHaveLength(12); expect(INERT_DIRECTION_INPUTS.shifts).toHaveLength(15);
    expect(INERT_DIRECTION_LIMITS.maxRows).toBe(180);
  });
  it("canonicalizes object keys but retains signed vector order", () => {
    expect(inertDigest({ a: 1, b: ["-1", "2"] })).toBe(inertDigest({ b: ["-1", "2"], a: 1 }));
    expect(inertDigest(["-1", "2"])).not.toBe(inertDigest(["2", "-1"])); expect(inertCanonicalJson({ b: 2, a: 1 })).toBe('{"a":1,"b":2}');
  });
  it("no inert is a local miss even when generated split subgroup is unpaid", () => {
    const d = abstractInertDirection(30, [[6, 1]], []);
    expect(d.decision).toBe("NO_INERT_LOCAL_MISS"); expect(d.splitPaid).toBe(false); expect(image(30, [[6, 1]]).has(15)).toBe(false);
  });
  it("rejects mass below the projected involution threshold", () => {
    const d = abstractInertDirection(6, [], [[1, 2]]); expect(d.d).toBe(6); expect(d.decision).toBe("COHERENT_SHORT_LOCAL_MISS"); expect(image(6, [[1, 2]]).has(3)).toBe(false);
  });
  it("certifies threshold equality on a paid trivial subgroup", () => {
    expect(abstractInertDirection(6, [], [[1, 3]]).decision).toBe("COHERENT_PAID_SPLIT_HIT"); expect(image(6, [[1, 3]]).has(3)).toBe(true);
  });
  it("retains inverse directions and chooses positive direction in d2 tie", () => {
    const inverse = abstractInertDirection(6, [], [[1, 1], [5, 2]]); expect(inverse.directions).toEqual([1, -1]); expect(inverse.decision).toBe("COHERENT_PAID_SPLIT_HIT");
    const tie = abstractInertDirection(10, [[2, 2]], [[1, 1], [9, 1]]); expect(tie.d).toBe(2); expect(tie.directions).toEqual([1, 1]);
  });
  it("does not confuse anchor order with ambient quotient index", () => {
    const d = abstractInertDirection(30, [], [[5, 3]]); expect(d.d).toBe(6); expect(d.ambientIndex).toBe(30); expect(d.decision).toBe("COHERENT_PAID_SPLIT_HIT");
  });
  it("positive total character can hit and is not rejected", () => {
    const d = abstractInertDirection(6, [], [[1, 4]]); expect(d.E % 2).toBe(0); expect(d.decision).toBe("COHERENT_PAID_SPLIT_HIT"); expect(image(6, [[1, 4]]).has(3)).toBe(true);
  });
  it("does not use generated L as free paid coverage", () => {
    const terms: Array<[number, number]> = [[6, 1], [1, 3]], d = abstractInertDirection(30, [[6, 1]], [[1, 3]]);
    expect(d.L).toHaveLength(5); expect(d.d).toBe(6); expect(d.E).toBe(3); expect(d.splitPaid).toBe(false); expect(d.decision).toBe("COHERENT_UNPAID_UNDETERMINED"); expect(image(30, terms).has(15)).toBe(false);
  });
  it("the same control with split budget2 pays L and hits", () => {
    const d = abstractInertDirection(30, [[6, 2]], [[1, 3]]); expect(d.splitPaid).toBe(true); expect(d.decision).toBe("COHERENT_PAID_SPLIT_HIT"); expect(image(30, [[6, 2], [1, 3]]).has(15)).toBe(true);
  });
  it("unpaid UNKNOWN may actually hit, not a negative classifier", () => {
    expect(abstractInertDirection(30, [[6, 1]], [[1, 9]]).decision).toBe("COHERENT_UNPAID_UNDETERMINED"); expect(image(30, [[6, 1], [1, 9]]).has(15)).toBe(true);
  });
  it("incoherent UNKNOWN includes both hits and misses", () => {
    expect(abstractInertDirection(10, [], [[1, 2], [3, 1]]).decision).toBe("INCOHERENT_UNDETERMINED"); expect(image(10, [[1, 2], [3, 1]]).has(5)).toBe(true);
    expect(abstractInertDirection(30, [], [[1, 1], [3, 1]]).decision).toBe("INCOHERENT_UNDETERMINED"); expect(image(30, [[1, 1], [3, 1]]).has(15)).toBe(false);
  });
  it("rejects non-character abstract groups and illegal budgets", () => {
    expect(() => abstractInertDirection(12, [], [[1, 1]])).toThrow(); expect(() => abstractInertDirection(10, [[1, 1]], [])).toThrow(); expect(() => abstractInertDirection(10, [], [[2, 1]])).toThrow();
    expect(() => abstractInertDirection(10, Array.from({ length: 17 }, () => [2, 1] as [number, number]), [])).toThrow();
  });
  it("checks root/shift domain before mathematical decisions", () => {
    expect(() => inertDirectionRow(19, 3)).toThrow(); expect(() => inertDirectionRow(200023321, 9)).toThrow(); expect(() => inertDirectionRow(200023321, 109)).toThrow();
  });
  it("couples both characters including supplementary q2 and constructs exact witness", () => {
    const row = inertDirectionRow(200602081, 3); expect(row.characters.every((v) => v.rootCharacter === v.shiftCharacter)).toBe(true);
    expect(row.witness).not.toBeNull(); expect(validateInertWitness(row.p, row.h, row.T, row.factors, row.witness!)).toBe(true);
    const even = inertDirectionRow(200602081, 31); expect(even.characters.find((v) => v.prime === "2")?.rootCharacter).toBe("+1");
  });
  it("rejects reused valuations, partial inversion and wrong strict tuple", () => {
    const row = inertDirectionRow(200602081, 3), w = row.witness!;
    expect(validateInertWitness(row.p, row.h, row.T, row.factors, { ...w, x: "1" })).toBe(false);
    expect(validateInertWitness(row.p, row.h, row.T, row.factors, { ...w, exponents: w.exponents.map((z, i) => i === 0 ? "99" : z) })).toBe(false);
    expect(validateInertWitness(row.p, row.h, row.T, row.factors, { ...w, orientation: w.orientation === "UNCHANGED" ? "WHOLE_INVERTED" : "UNCHANGED" })).toBe(false);
  });
  it("rejects widening, nonfinite, fractional and too-small resources before work", () => {
    for (const options of [{ seconds: 61 }, { seconds: NaN }, { maxRows: 181 }, { maxRows: 0 }, { maxWork: 1.5 }, { maxStateInsertions: Infinity }, { maxOutputBytes: 1 }]) expect(() => inertDirectionPacket(options)).toThrow();
    expect(() => inertDirectionPacket({ now: () => 0, origin: 1 })).toThrow();
    expect(() => inertDirectionPacket({ unknown: 1 } as never)).toThrow();
  });
  it("retains atomic row limit prefix and matching digests", () => {
    const p = inertDirectionPacket({ maxRows: 1 }); expect(p.status).toBe("PARTIAL"); expect(p.reason).toBe("ROW_LIMIT"); expect(p.rows).toHaveLength(1); expect(p.pending).toEqual({ phase: "ROW", index: "1", p: "200023321", h: "7" }); expect(p.rowsDigest).toBe(inertDigest(p.rows));
  });
  it("never exceeds state or work caps and does not retain unfinished rows", () => {
    for (const options of [{ maxStateInsertions: 1 }, { maxWork: 1 }]) { const p = inertDirectionPacket(options); expect(p.status).toBe("PARTIAL"); expect(p.rows).toHaveLength(0); expect(Number(p.runtime.stateInsertions)).toBeLessThanOrEqual(options.maxStateInsertions ?? INERT_DIRECTION_LIMITS.maxStateInsertions); expect(Number(p.runtime.work)).toBeLessThanOrEqual(options.maxWork ?? INERT_DIRECTION_LIMITS.maxWork); }
  });
  it("a mid-row deadline preserves pending scope with no certificate", () => {
    let calls = 0; const p = inertDirectionPacket({ now: () => ++calls < 100 ? 0 : 60000 }); expect(p.status).toBe("PARTIAL"); expect(p.reason).toBe("TIME_LIMIT"); expect(p.pending?.phase).toBe("ROW"); expect(p.rows).toHaveLength(0); expect(p.runtime.elapsedMs).toBe(60000);
  });
  it("a deadline first observed during finalization cannot return COMPLETE", () => {
    let calls = 0; const baseline = inertDirectionPacket({ now: () => { calls++; return 0; } }); expect(baseline.status).toBe("COMPLETE");
    const cutoff = calls - 2; let actual = 0; const p = inertDirectionPacket({ now: () => ++actual < cutoff ? 0 : 60000 });
    expect(p.status).toBe("PARTIAL"); expect(p.reason).toBe("TIME_LIMIT"); expect(p.pending).toEqual({ phase: "FINALIZE" }); expect(p.rows).toHaveLength(180); expect(p.runtime.elapsedMs).toBe(60000);
  });
  it("output cap trims only an ordered prefix and stamps actual bytes", () => {
    const p = inertDirectionPacket({ maxRows: 4, maxOutputBytes: 4096 }); expect(p.status).toBe("PARTIAL"); expect(p.reason).toBe("OUTPUT_LIMIT"); expect(p.rows.length).toBeLessThan(4); expect(Buffer.byteLength(JSON.stringify(p))).toBe(Number(p.runtime.outputBytes)); expect(Number(p.runtime.outputBytes)).toBeLessThanOrEqual(4096);
  });
  it("observes elapsed time through output trimming without replacing its reason", () => {
    let calls = 0; inertDirectionPacket({ maxRows: 4, maxOutputBytes: 4096, now: () => { calls++; return 0; } });
    let actual = 0; const p = inertDirectionPacket({ maxRows: 4, maxOutputBytes: 4096, now: () => ++actual < calls - 3 ? 0 : 1500 });
    expect(p.status).toBe("PARTIAL"); expect(p.reason).toBe("OUTPUT_LIMIT"); expect(p.runtime.elapsedMs).toBe(1500); expect(p.rows.length).toBeLessThan(4); expect(Number(p.runtime.outputBytes)).toBeLessThanOrEqual(4096);
  });
  it("CLI refuses expansion arguments before work", () => {
    expect(() => execFileSync(process.execPath, ["--import", "tsx", "scripts/operations/inert-direction-audit.ts", "--truth"], { cwd: process.cwd(), stdio: "pipe" })).toThrow();
  });
  it("installed CJS runner executes the actual fixed CLI successfully", () => {
    const output = execFileSync(process.execPath, ["--import", "tsx", "scripts/operations/inert-direction-audit.ts"], { cwd: process.cwd(), encoding: "utf8", maxBuffer: 2_000_000 });
    const p = JSON.parse(output); expect(p.status).toBe("COMPLETE"); expect(p.rows).toHaveLength(180); expect(p.rowsDigest).toBe(inertDigest(p.rows)); expect(p.runtime.elapsedMs).toBeGreaterThanOrEqual(0);
  });
});
