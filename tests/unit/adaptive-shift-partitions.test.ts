import { beforeAll, describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { ADAPTIVE_SHIFT_INPUTS, ADAPTIVE_SHIFT_LIMITS, adaptiveShiftPacket, adaptiveShiftRow,
  reconstructShiftWitness, shiftedFactorCandidate, signedResidueImage, shiftDigest, validateFactors,
  assertShiftCandidate, ShiftCandidateContradictionError, type AdaptiveShiftPacket } from "../../scripts/operations/adaptive-shift-partitions";

const B = BigInt;
let packet: AdaptiveShiftPacket, baselineClockCalls = 0;
beforeAll(() => { packet = adaptiveShiftPacket({ now: () => { baselineClockCalls++; return 0; } }); });
function pairReference(T: number, h: number) {
  const divisors: number[] = [];
  for (let d = 1; d * d <= T; d++) if (T % d === 0) { divisors.push(d); if (d * d !== T) divisors.push(T / d); }
  divisors.sort((a, b) => a - b);
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  const image = new Set<number>(), hits: Array<[number, number]> = [];
  for (const u of divisors) for (const v of divisors) {
    if (u * v > T || T % (u * v) || gcd(u, v) !== 1) continue;
    let inverse = 1; while (inverse * (v % h) % h !== 1) inverse++;
    image.add(u % h * inverse % h);
    if (u <= v && (u + v) % h === 0) hits.push([u, v]);
  }
  hits.sort(([a, b], [c, d]) => a - c || b - d);
  return { image: [...image].sort((a, b) => a - b).map(String), pair: hits[0]?.map(String) ?? null };
}
describe("frozen adaptive shifted-factor partitions", () => {
  it("completes every declared row and retains explicit failures, not a new root theorem", () => {
    expect(packet.status).toBe("COMPLETE"); expect(packet.primes).toHaveLength(275); expect(packet.rows).toHaveLength(1953);
    expect(packet.rows.filter((r) => r.hit)).toHaveLength(971);
    expect(packet.inputs).toEqual(ADAPTIVE_SHIFT_INPUTS); expect(packet.limits).toEqual(ADAPTIVE_SHIFT_LIMITS);
    expect(packet.primeManifestDigest).toBe("c0a2a8a449bc9eafb46860ba076e40e67b8a1f13c257ab700776b6e2aa5cfa10");
    expect(packet.contentDigest).toBe("ca0edf6ce6ab31d22e801a63db8301039efc20eb3c9d9ee7a613318ef2fcb913");
    expect(packet.scannedThrough).toBe("200999401");
    expect(packet.primes.filter((p) => !packet.rows.some((r) => r.p === p && r.hit))).toEqual(["200023321", "200602081", "200656681"]);
    expect(packet.rows.filter((r) => r.p === "131433121").every((r) => !r.hit)).toBe(true);
    expect(packet.scope).toContain("not an exhaustive shift menu");
    expect(packet.separateControl).toMatchObject({ p: "19", menuRejected: true, menuDomain: "NONINTEGER_T" });
  });
  it("checks complete images and smallest ordered witness against a distinct positive-pair oracle", () => {
    for (const [p, h] of [[159727681, 47], [351121, 11], [171348241, 83], [200023321, 107]]) {
      const row = adaptiveShiftRow(p, h), reference = pairReference(Number(row.T), h);
      expect(row.image).toEqual(reference.image); expect(row.canonical ? [row.canonical.u, row.canonical.v] : null).toEqual(reference.pair);
      expect(row.imageDigest).toBe(shiftDigest(row.image));
      expect(row.witnessDigest).toBe(row.canonical ? shiftDigest(row.canonical) : null);
    }
  });
  it("retains unused and repeated prime valuation mass in actual warmup reconstructions", () => {
    const repeated = packet.rows.find((r) => r.factors.some(([, e]) => Number(e) > 1))!;
    expect(repeated.factors.reduce((product, [q, e]) => product * B(q) ** B(e), B(1))).toBe(B(repeated.T));
    const row = packet.rows.find((r) => r.p === "159727681" && r.h === "47")!;
    expect(row.canonical?.k).toBe("61058");
    const c = row.canonical!;
    expect(reconstructShiftWitness(B(row.p), B(row.h), B(row.T), B(c.u), B(c.v))).toEqual(c);
    expect(B(4) * B(c.x) * B(c.y) * B(c.z)).toBe(B(row.p) * (B(c.x) * B(c.y) + B(c.x) * B(c.z) + B(c.y) * B(c.z)));
  });
  it("keeps safe-prime threshold tightness, QR subgroup and minus-one controls separate", () => {
    const thin = [{ residue: 3, exponent: 2 }];
    expect(shiftedFactorCandidate(7, thin)).toMatchObject({ weight: "2", boundaryApplicable: true, inversePairPrimitive: true, predictedHit: false });
    expect(signedResidueImage(7, thin)).not.toContain(6);
    expect(signedResidueImage(7, [{ residue: 3, exponent: 3 }])).toContain(6);
    expect(shiftedFactorCandidate(7, [{ residue: 1, exponent: 5 }, ...thin]).weight).toBe("2");
    expect(signedResidueImage(7, [{ residue: 2, exponent: 20 }])).toEqual([1, 2, 4]);
    expect(shiftedFactorCandidate(7, [{ residue: 6, exponent: 1 }]).predictedHit).toBe(true);
    expect(signedResidueImage(7, [{ residue: 6, exponent: 1 }])).toContain(6);
  });
  it("preserves q15/q99 countercontrols to the old invalid arbitrary-composite-core bound", () => {
    // These are independently reconstructed historical auxiliary-bound controls,
    // not additional rows or evidence of coverage in the frozen shift menu.
    for (const [p, A, u, k, Q, q] of [["19", "6", "5", "1", "1", "15"],
      ["159727681", "3", "11", "6", "605794", "99"]].map((tuple) => tuple.map(B))) {
      const m = A * u * k, s = B(4) * m - B(1), Q0 = (A - u % A) % A || A, h0 = (u + Q0) / A;
      const p0 = B(4) * u * k * Q0 - h0;
      expect(A * p + u).toBe(s * Q);
      expect(m).toBe(B(2) * q);
      expect(p0).toBeLessThan((B(8) * q + B(2)) / B(3) - B(1));
      const ds = [u * Q * k, A * p * u * k, A * p * Q * k].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
      expect(ds[0] < ds[1] && ds[1] < ds[2]).toBe(true);
      expect(ds.filter((d) => d % p === B(0))).toHaveLength(2);
      expect(B(4) * ds[0] * ds[1] * ds[2]).toBe(p * (ds[0] * ds[1] + ds[1] * ds[2] + ds[2] * ds[0]));
    }
    expect(packet.rows.some((r) => r.p === "19")).toBe(false);
  });
  it("exhausts the approved h7/h11 boundary profiles and matches independent manifests", () => {
    expect(packet.groupControls).toMatchObject([{ h: "7", profiles: "15", applicableProfiles: "12", misses: "6", classificationMismatches: "0",
      profilesDigest: "d897706f4e59c5fcb2bb330a0dfb087c86b9e56785a163906d68708af8c15dae" },
    { h: "11", profiles: "495", applicableProfiles: "460", misses: "45", classificationMismatches: "0",
      profilesDigest: "c3c464023621b168f4db239b548330a82b770a4aea45ceb857b49377a83887d6" }]);
    const distinct = [{ residue: 2, exponent: 1 }, { residue: 7, exponent: 1 }];
    expect(signedResidueImage(11, distinct)).not.toContain(10); // W=ell-3 abstract sharpness only
    expect(signedResidueImage(11, [...distinct, { residue: 2, exponent: 1 }])).toContain(10);
  });
  it.each([[19, 7], [1, 7], [200000001, 7], [351121, 19], [201000841, 7], [351121.5, 7]])("rejects wrong or oversized row domain (%s,%s)", (p, h) => {
    expect(() => adaptiveShiftRow(p, h)).toThrow();
  });
  it("rejects malformed factorization, unsafe safe-prime group and bad witness reconstruction", () => {
    for (const bad of [[["4", "3"]], [["2", "3"], ["2", "3"]], [["2", "0"]], [["2", "1000000000"]]]) expect(() => validateFactors(bad, B(64))).toThrow();
    expect(() => signedResidueImage(19, [{ residue: 2, exponent: 1 }])).toThrow();
    expect(() => signedResidueImage(7, Array.from({ length: 33 }, () => ({ residue: 2, exponent: 1 })))).toThrow();
    expect(() => reconstructShiftWitness(B(351121), B(11), B(87783), B(3), B(3))).toThrow();
    expect(() => reconstructShiftWitness(B(351121), B(11), B(87784), B(1), B(87))).toThrow();
    expect(() => adaptiveShiftPacket({ seconds: 61 })).toThrow();
    expect(() => adaptiveShiftPacket({ maxRows: 10001 })).toThrow();
  });
  it("retains precise completed control prefix on a state cap, and row prefix on output cap", () => {
    const partial = adaptiveShiftPacket({ maxStateInsertions: 1000 });
    expect(partial).toMatchObject({ status: "PARTIAL", reason: "STATE_LIMIT", pending: { phase: "GROUP_CONTROLS", h: "11" } });
    expect(partial.groupControls).toHaveLength(1); expect(partial.rows).toHaveLength(0);
    const output = adaptiveShiftPacket({ maxOutputBytes: 12000 });
    expect(output).toMatchObject({ status: "PARTIAL", reason: "OUTPUT_LIMIT", pending: { phase: "ROW" } });
    expect(Number(output.runtime.outputBytes)).toBeLessThanOrEqual(12000);
  });
  it("does not label late digest/serialization completion as COMPLETE", () => {
    let calls = 0;
    const late = adaptiveShiftPacket({ now: () => ++calls >= baselineClockCalls - 1 ? 60000 : 0 });
    expect(late).toMatchObject({ status: "PARTIAL", reason: "TIME_LIMIT", pending: { phase: "FINALIZE" } });
    expect(late.rows).toHaveLength(1953); expect(late.runtime.elapsedMs).toBe("60000");
    const { packetDigest, ...body } = late;
    expect(packetDigest).toBe(shiftDigest(body));
    expect(Number(late.runtime.outputBytes)).toBe(Buffer.byteLength(JSON.stringify(late)));
  });
  it("retains explicit early deadline and row-limit stops without fabricated completeness", () => {
    let calls = 0;
    const deadline = adaptiveShiftPacket({ now: () => calls++ ? 60000 : 0 });
    expect(deadline).toMatchObject({ status: "PARTIAL", reason: "TIME_LIMIT", pending: { phase: "PRIME_SCAN", p: "200000641" } });
    const rowLimit = adaptiveShiftPacket({ maxRows: 1 });
    expect(rowLimit).toMatchObject({ status: "PARTIAL", reason: "ROW_LIMIT", pending: { phase: "ROW", p: "131433121", h: "11" } });
    expect(rowLimit.rows).toHaveLength(1);
  });
  it("retains an injected candidate disagreement in a bounded error, not a COMPLETE packet", () => {
    const actual = adaptiveShiftRow(131433121, 7);
    const { rowDigest, ...body } = { ...actual, candidate: { ...actual.candidate, predictedHit: !actual.hit } }; void rowDigest;
    const changed = { ...body, rowDigest: shiftDigest(body) };
    try { assertShiftCandidate(changed); throw new Error("fixture must reject"); }
    catch (error) {
      expect(error).toBeInstanceOf(ShiftCandidateContradictionError);
      if (!(error instanceof ShiftCandidateContradictionError)) throw error;
      expect(error.row).toEqual(changed); expect(error.row).not.toBe(changed);
      expect(error).not.toHaveProperty("status", "COMPLETE");
      expect(Buffer.byteLength(JSON.stringify(error.row))).toBeLessThanOrEqual(65536);
    }
  });
  it("CLI permits only frozen execution, rejects input expansion and importing stays inert", () => {
    const result = spawnSync(process.execPath, ["--import", "tsx", "scripts/operations/adaptive-shift-audit.ts", "--upper=202000000"], { encoding: "utf8", timeout: 5000 });
    expect(result.status).toBe(2); expect(result.stdout).toBe("");
    const inert = spawnSync(process.execPath, ["--import", "tsx", "--input-type=module", "-e", "await import('./scripts/operations/adaptive-shift-partitions.ts'); console.log('INERT');"], { encoding: "utf8", timeout: 5000 });
    expect(inert.status).toBe(0); expect(inert.stdout.trim()).toBe("INERT");
  });
});
