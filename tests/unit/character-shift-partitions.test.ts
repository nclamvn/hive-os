import { beforeAll, describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { CHARACTER_SHIFT_INPUTS, CHARACTER_SHIFT_LIMITS, CharacterCandidateContradictionError, assertCharacterCandidate,
  characterDigest, characterRouting, characterShiftPacket, characterShiftRow, characterSignedImage, generalPrimeDefect,
  reconstructCharacterWitness, validateCharacterFactors, type CharacterShiftPacket } from "../../scripts/operations/character-shift-partitions";

const B = BigInt;
let packet: CharacterShiftPacket, clockCalls = 0;
beforeAll(() => { packet = characterShiftPacket({ now: () => { clockCalls++; return 0; } }); });
function pairs(T: number, h: number) {
  const ds: number[] = []; for (let d = 1; d * d <= T; d++) if (T % d === 0) { ds.push(d); if (d * d !== T) ds.push(T / d); }
  ds.sort((a, b) => a - b); const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  const image = new Set<number>(), hits: number[][] = [];
  for (const u of ds) for (const v of ds) {
    if (u * v > T || T % (u * v) || gcd(u, v) !== 1) continue;
    let inv = 1; while (inv * (v % h) % h !== 1) inv++; image.add(u % h * inv % h);
    if (u <= v && (u + v) % h === 0) hits.push([u, v]);
  }
  hits.sort(([a, b], [c, d]) => a - c || b - d);
  return { image: [...image].sort((a, b) => a - b).map(String), pair: hits[0]?.map(String) ?? null };
}
describe("character-guided general-prime shifted defects", () => {
  it("retains every target and every prime3mod4<=107, not just the preferred pool", () => {
    const primes: string[] = []; for (let h = 3; h <= 107; h += 4) { let ok = true; for (let d = 2; d * d <= h; d++) if (h % d === 0) ok = false; if (ok) primes.push(String(h)); }
    expect(CHARACTER_SHIFT_INPUTS.shifts).toEqual(primes); expect(packet.status).toBe("COMPLETE"); expect(packet.rows).toHaveLength(60);
    expect(packet.rows.filter((r) => r.hit)).toHaveLength(11); expect(packet.limits).toEqual(CHARACTER_SHIFT_LIMITS);
    expect(packet.shiftManifestDigest).toBe("0ba105aa0a26ab5b67d6e0f0dd861948755210a4ad76726c58a05b6207d03ada");
    expect(packet.contentDigest).toBe("a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c");
    expect(packet.scope).toContain("never QR impossibility");
  });
  it("reports matched full/preferred minima without claiming character routing dominates", () => {
    expect(packet.routing.map((r) => [r.p, r.smallestSuccessfulFull, r.smallestSuccessfulPreferred])).toEqual([
      ["200023321", "3", "103"], ["200602081", "3", "31"], ["200656681", "3", "19"], ["131433121", "71", "71"]]);
    expect(packet.rows.filter((r) => r.hit && !r.character.preferred).map((r) => [r.p, r.h])).toEqual([
      ["200023321", "3"], ["200602081", "3"], ["200602081", "79"], ["200656681", "3"], ["200656681", "31"]]);
    expect(packet.routing.every((r) => r.complete)).toBe(true);
    const partial = characterRouting(packet.rows.slice(0, 1)); expect(partial.every((r) => !r.complete)).toBe(true);
    expect(partial[1].smallestSuccessfulFull).toBeNull(); // explicitly uncomputed, not proved absent
  });
  it("keeps h3 simple baseline, even QNR mass and pure-QR miss explicit", () => {
    for (const [p, v] of [[200023321, "29"], [200602081, "89"], [200656681, "29"]] as const) {
      const r = characterShiftRow(p, 3); expect(r.character).toEqual({ legendre: "+1", preferred: false });
      expect(r.canonical).toMatchObject({ u: "1", v }); expect(r.factors).toHaveLength(2);
      expect(r.factors.every(([q]) => Number(q) % 3 === 2)).toBe(true);
    }
    const old = characterShiftRow(131433121, 3); expect(old.hit).toBe(false);
    expect(old.factors.every(([q]) => Number(q) % 3 === 1)).toBe(true);
    expect(old.defect).toMatchObject({ index: "2", visibleMass: "0", nonresidue: false });
  });
  it("compares every exact image and numeric-lex canonical partition to a distinct divisor-pair oracle", () => {
    for (const row of packet.rows) {
      const ref = pairs(Number(row.T), Number(row.h)); expect(row.image).toEqual(ref.image);
      expect(row.canonical ? [row.canonical.u, row.canonical.v] : null).toEqual(ref.pair);
      expect(row.imageDigest).toBe(characterDigest(row.image));
      expect(row.defectDigest).toBe(row.defect ? characterDigest(row.defect) : null);
      if (row.canonical) { const c = row.canonical; expect(reconstructCharacterWitness(B(row.p), B(row.h), B(row.T), B(c.u), B(c.v))).toEqual(c); }
    }
  });
  it("certifies each retained miss including nontrivial quotient6 QNR obstruction", () => {
    for (const row of packet.rows) if (!row.hit) {
      expect(Object.values(row.defect!.conditions).every(Boolean)).toBe(true);
      const h = Number(row.h), S = row.image.map(Number), H = [];
      for (let r = 1; r < h; r++) if (S.every((s) => S.includes(s * r % h))) H.push(String(r));
      expect(row.defect!.stabilizer).toEqual(H); expect(H).not.toContain(String(h - 1));
    }
    for (const p of [200023321, 131433121]) expect(characterShiftRow(p, 31).defect).toMatchObject({
      stabilizer: ["1", "2", "4", "8", "16"], size: "5", index: "6", visibleMass: "1", nonresidue: true,
      visibleFactors: [{ exponent: "1", residue: "17", quotientOrder: "6" }] });
  });
  it("retains repeated/unused mass while quotient-invisible factors do not inflate V", () => {
    const terms = [{ residue: 2, exponent: 2 }, { residue: 17, exponent: 1 }];
    expect(generalPrimeDefect(31, terms)).toMatchObject({ size: "5", index: "6", visibleMass: "1", nonresidue: true,
      visibleFactors: [{ residue: "17", exponent: "1", quotientOrder: "6" }] });
    expect(characterSignedImage(31, [{ residue: 2, exponent: 2 }])).toEqual([1, 2, 4, 8, 16]);
    expect(generalPrimeDefect(31, [{ residue: 2, exponent: 2 }])).toMatchObject({ size: "5", index: "6", visibleMass: "0" });
    const repeated = packet.rows.find((r) => r.factors.some(([, e]) => Number(e) > 1))!;
    expect(repeated.factors.reduce((n, [q, e]) => n * B(q) ** B(e), B(1))).toBe(B(repeated.T));
    expect(packet.rows.some((r) => r.canonical && Number(r.canonical.k) > 1)).toBe(true);
  });
  it("checks character parity and the selected-character quotient6 one-visible-unit corollary", () => {
    for (const row of packet.rows) {
      const h = Number(row.h), pow = (r: number) => { let value = 1; for (let i = 0; i < (h - 1) / 2; i++) value = value * r % h; return value; };
      const oddMass = row.factors.reduce((sum, [q, e]) => sum + (pow(Number(B(q) % B(h))) === h - 1 ? Number(e) : 0), 0) % 2 === 1;
      expect(row.character.preferred).toBe(oddMass);
      if (!row.hit && row.character.preferred && row.defect!.index === "6") {
        expect(row.defect!.visibleMass).toBe("1"); expect(row.defect!.visibleFactors).toHaveLength(1);
        expect(row.defect!.visibleFactors[0].quotientOrder).toBe("6");
        expect(Number(row.count)).toBe(3 * Number(row.defect!.size));
      }
    }
  });
  it("handles nonsafe prime groups, quotient saturation, minus-one and trivial image", () => {
    expect(generalPrimeDefect(19, [{ residue: 2, exponent: 2 }])).toMatchObject({ size: "1", index: "18", visibleMass: "2",
      visibleFactors: [{ quotientOrder: "18" }] });
    expect(generalPrimeDefect(3, [{ residue: 2, exponent: 1 }])).toBeNull();
    expect(generalPrimeDefect(19, [{ residue: 18, exponent: 1 }])).toBeNull();
    expect(generalPrimeDefect(31, [])).toMatchObject({ size: "1", index: "30", visibleMass: "0", nonresidue: false });
    expect(() => generalPrimeDefect(31, [{ residue: 2, exponent: 2 }], [1, 2])).toThrow(/complete signed image/);
  });
  it.each([[19, 3], [1, 3], [200000001, 3], [200023321, 5], [200023321, 15], [201000841, 3]])("rejects wrong domain (%s,%s)", (p, h) => {
    expect(() => characterShiftRow(p, h)).toThrow();
  });
  it("fails closed for malformed factors, terms, reconstruction and scope expansion", () => {
    for (const factors of [[["4", "3"]], [["2", "3"], ["2", "3"]], [["2", "0"]], [["2", "999999999"]]]) expect(() => validateCharacterFactors(factors, B(64))).toThrow();
    expect(() => characterSignedImage(15, [{ residue: 2, exponent: 1 }])).toThrow();
    expect(() => characterSignedImage(31, [{ residue: 0, exponent: 1 }])).toThrow();
    expect(() => characterSignedImage(31, [{ residue: 2, exponent: 65 }])).toThrow();
    expect(() => reconstructCharacterWitness(B(200023321), B(3), B(50005832), B(1), B(29))).toThrow();
    expect(() => characterShiftPacket({ seconds: 61 })).toThrow(); expect(() => characterShiftPacket({ maxRows: 1001 })).toThrow();
  });
  it("keeps exact completed prefix and pending input for row,state,output and early deadline stops", () => {
    expect(characterShiftPacket({ maxRows: 1 })).toMatchObject({ status: "PARTIAL", reason: "ROW_LIMIT", pending: { phase: "ROW", p: "200023321", h: "7" } });
    const state = characterShiftPacket({ maxStateInsertions: 1 }); expect(state).toMatchObject({ status: "PARTIAL", reason: "STATE_LIMIT", pending: { p: "200023321", h: "3" } }); expect(state.rows).toHaveLength(0);
    const output = characterShiftPacket({ maxOutputBytes: 7000 }); expect(output).toMatchObject({ status: "PARTIAL", reason: "OUTPUT_LIMIT" });
    expect(Number(output.runtime.outputBytes)).toBeLessThanOrEqual(7000); expect(output.rows.length).toBeLessThan(60);
    let calls = 0; const time = characterShiftPacket({ now: () => calls++ ? 60000 : 0 });
    expect(time).toMatchObject({ status: "PARTIAL", reason: "TIME_LIMIT", pending: { phase: "ROW", p: "200023321", h: "3" } });
  });
  it("includes finalization in the deadline and does not overwrite an earlier partial stop", () => {
    let calls = 0; const late = characterShiftPacket({ now: () => ++calls >= clockCalls - 1 ? 60000 : 0 });
    expect(late).toMatchObject({ status: "PARTIAL", reason: "TIME_LIMIT", pending: { phase: "FINALIZE" } }); expect(late.rows).toHaveLength(60);
    const { packetDigest, ...body } = late; expect(packetDigest).toBe(characterDigest(body));
    expect(Number(late.runtime.outputBytes)).toBe(Buffer.byteLength(JSON.stringify(late)));
    const partial = characterShiftPacket({ maxRows: 1 }); expect(partial.reason).toBe("ROW_LIMIT");
  });
  it("retains an injected false defect as bounded investigation data, never COMPLETE", () => {
    const actual = characterShiftRow(200023321, 31), changed = { ...actual, defect: { ...actual.defect!, conditions: { ...actual.defect!.conditions, visibleMassBound: false } } };
    try { assertCharacterCandidate(changed); throw new Error("must reject"); }
    catch (error) { expect(error).toBeInstanceOf(CharacterCandidateContradictionError); if (!(error instanceof CharacterCandidateContradictionError)) throw error;
      expect(error.row).toEqual(changed); expect(error.row).not.toBe(changed); expect(error).not.toHaveProperty("status", "COMPLETE"); }
  });
  it("CLI rejects runtime expansion and import is inert", () => {
    const bad = spawnSync(process.execPath, ["--import", "tsx", "scripts/operations/character-shift-audit.ts", "--h=127"], { encoding: "utf8", timeout: 5000 });
    expect(bad.status).toBe(2); expect(bad.stdout).toBe("");
    const inert = spawnSync(process.execPath, ["--import", "tsx", "--input-type=module", "-e", "await import('./scripts/operations/character-shift-partitions.ts');console.log('INERT')"], { encoding: "utf8", timeout: 5000 });
    expect(inert.status).toBe(0); expect(inert.stdout.trim()).toBe("INERT");
  });
});
