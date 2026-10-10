// NEW fixed synthetic controls only. Literal expectations predate every output.
// Main alone runs this file, after exact artifact/source admission and review.
import {beforeAll, afterEach, afterAll, describe, it, expect} from "vitest";
import {readFileSync, writeFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {performance} from "node:perf_hooks";
import {loadAdmittedSyntheticSummaryP3, loadAliasFaultSyntheticSummaryP3,
  verifySyntheticSummaryArtifactP3} from "../../scripts/test/admit-private-summary-tip081-p3.mjs";

type API = Awaited<ReturnType<typeof loadAdmittedSyntheticSummaryP3>>;
type Site = {kind: string; start: number; end: number; binding: string; loader: string;
  conditional: string; optional: boolean; computed: boolean; status: string};
type Summary = {version: number; purpose: string; mode: string; profile: string;
  syntheticUtf16Hash: string; utf16Units: number; astOccurrences: number; grammarAttempts: number;
  sites: Site[]; ledger: Record<string, number>; summaryHash: string};
type Metadata = Record<string, string | number | boolean>;
const CAP = 67108864, TTL = 120000;
const ROOT = "/Users/os/hiveos/";
const SUM_KEYS = ["version", "purpose", "mode", "profile", "syntheticUtf16Hash", "utf16Units",
  "astOccurrences", "grammarAttempts", "sites", "ledger", "summaryHash"];
const SITE_KEYS = ["kind", "start", "end", "binding", "loader", "conditional", "optional", "computed", "status"];
const LEDGER_KEYS = ["baseBytes", "producerParseBytes", "producerWorkBytes", "summaryBytes", "replayReservedBytes",
  "replayLiveBytes", "scratchBytes", "unreclaimedProducerBytes", "unreclaimedReplayBytes", "totalBytes", "peakBytes",
  "producerEntries", "producerAttempts", "siteCount"];
const META_KEYS = ["version", "purpose", "mode", "phase", "totalBytes", "peakBytes", "producerParseBytes", "producerWorkBytes",
  "summaryBytes", "replayReservedBytes", "replayLiveBytes", "scratchBytes", "unreclaimedProducerBytes", "unreclaimedReplayBytes",
  "attemptedNodes", "internalEntries", "siteCount", "grammarPasses", "metadataEmissions", "semanticCoverage", "allocatorCoverage",
  "graphStatus", "predecessorOpen", "fullRuntimeClosure", "execution", "materialization", "realParserDisabled"];
const CATEGORY_KEYS = ["baseBytes", "producerParseBytes", "producerWorkBytes", "summaryBytes", "replayReservedBytes",
  "replayLiveBytes", "scratchBytes", "unreclaimedProducerBytes", "unreclaimedReplayBytes"];
let api: API, fault: API;
let active: {api: API; handle: unknown} | null = null;
const raw: Array<Record<string, unknown>> = [];

function make(text: string, mode = "SCRIPT", cap = CAP, ttl = TTL, domain = api) {
  const handle: unknown = domain.createSyntheticSummaryP3(text, mode, cap, ttl);
  active = {api: domain, handle}; return handle;
}
function drop() {
  if (active !== null) {
    try { active.api.retireSyntheticSummaryP3(active.handle); }
    catch (error) { expect(error).toEqual({code: "AUTHORITY_REFUSED", realParserDisabled: true}); }
    active = null;
  }
}
function refusal(work: () => unknown, code: string) {
  let failed = false;
  try { work(); }
  catch (error) {
    failed = true;
    const descriptor = error !== null && typeof error === "object" ? Object.getOwnPropertyDescriptor(error, "code") : undefined;
    raw.push({variation: "REFUSAL", expectedCode: code, actualCode: descriptor && "value" in descriptor ? descriptor.value : "UNEXPECTED_ERROR"});
    expect(error).toEqual({code, realParserDisabled: true});
  }
  expect(failed, "exact named refusal, not any exception").toBe(true);
}
function invoke(fn: (...args: unknown[]) => unknown, args: unknown[]) { return Reflect.apply(fn, undefined, args); }
function stale(handle: unknown, domain = api) { refusal(() => domain.observeSyntheticSummaryP3(handle), "AUTHORITY_REFUSED"); }
function metadata(text: unknown): Metadata {
  expect(typeof text).toBe("string"); expect(Buffer.byteLength(text as string)).toBeLessThanOrEqual(4096);
  const result = JSON.parse(text as string) as Metadata;
  expect(Object.keys(result)).toEqual(META_KEYS);
  for (const value of Object.values(result)) expect(["string", "number", "boolean"]).toContain(typeof value);
  expect(result.totalBytes).toBe(CATEGORY_KEYS.reduce((n, key) => n + Number(result[key]), 0));
  expect(result.peakBytes).toBe(result.totalBytes);
  return result;
}
function readSummary(wire: unknown): Summary {
  expect(typeof wire).toBe("string"); expect(Buffer.byteLength(wire as string)).toBeLessThanOrEqual(16384);
  const decoded = JSON.parse(wire as string) as Summary;
  expect(Object.keys(decoded)).toEqual(SUM_KEYS); expect(Object.keys(decoded.ledger)).toEqual(LEDGER_KEYS);
  for (const row of decoded.sites) expect(Object.keys(row)).toEqual(SITE_KEYS);
  expect(decoded.ledger.siteCount).toBe(decoded.sites.length);
  expect(decoded.summaryHash).toBe(seal(decoded).summaryHash);
  return decoded;
}
function utf16Hash(text: string) {
  const bytes = Buffer.alloc(text.length * 2);
  for (let i = 0; i < text.length; i++) bytes.writeUInt16LE(text.charCodeAt(i), i * 2);
  return createHash("sha256").update(bytes).digest("hex");
}
function seal(s: Summary): Summary {
  // Independent TEST scalar seal, never a producer/verifier implementation import.
  const ledger: Record<string, number> = {};
  for (const key of LEDGER_KEYS) ledger[key] = s.ledger[key];
  const sites = s.sites.map(r => ({kind: r.kind, start: r.start, end: r.end, binding: r.binding,
    loader: r.loader, conditional: r.conditional, optional: r.optional, computed: r.computed, status: r.status}));
  const body = {version: s.version, purpose: s.purpose, mode: s.mode, profile: s.profile,
    syntheticUtf16Hash: s.syntheticUtf16Hash, utf16Units: s.utf16Units,
    astOccurrences: s.astOccurrences, grammarAttempts: s.grammarAttempts, sites, ledger};
  return {...body, summaryHash: createHash("sha256").update(JSON.stringify(body), "ascii").digest("hex")};
}
function site(kind: string, start: number, end: number, binding = "NONE", loader = "NONE",
    conditional = "CERTAIN", optional = false, computed = false): Site {
  return {kind, start, end, binding, loader, conditional, optional, computed, status: "OPEN"};
}
function positive(text: string, mode: string, expected: Site[], occurrences?: number) {
  const h = make(text, mode), wire = api.analyzeSyntheticSummaryP3(h), s = readSummary(wire);
  expect(s.sites).toEqual(expected); expect(s.syntheticUtf16Hash).toBe(utf16Hash(text));
  expect(s.utf16Units).toBe(text.length); if (occurrences !== undefined) expect(s.astOccurrences).toBe(occurrences);
  api.retireProducerSummaryP3(h); const result = metadata(api.verifySyntheticSummaryP3(h, wire));
  expect(result.phase).toBe("VERIFIED"); expect(result.grammarPasses).toBe(2);
  drop(); return s;
}
function changed(mutator: (s: Summary) => void, label: string, code = "REPLAY_MISMATCH") {
  const h = make("f();"), s = readSummary(api.analyzeSyntheticSummaryP3(h));
  mutator(s); const wire = JSON.stringify(seal(s));
  api.retireProducerSummaryP3(h); refusal(() => api.verifySyntheticSummaryP3(h, wire), code);
  raw.push({variation: label, incomingBytes: Buffer.byteLength(wire), expectedCode: code}); stale(h); drop();
}
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

beforeAll(async () => { api = await loadAdmittedSyntheticSummaryP3(); fault = await loadAliasFaultSyntheticSummaryP3(); });
afterEach(drop);
afterAll(() => {
  // Raw first unit observations survive reporter console filtering. Fixed NEW file.
  writeFileSync(ROOT + "docs/verification/TIP-081A_P3_UNIT_RAW_OBSERVATIONS.json", JSON.stringify({
    purpose: "TIP081_P3_FIRST_UNIT_RAW_OBSERVATIONS", raw, sourceExpectedSitesLearnedFromOutput: false,
    knownOpen: ["P319.PRODUCER_EXACT_16384_ACCEPTED", "P321.TRAVERSAL_DEPTH_128_129_DISCRIMINATOR"]}), {flag: "wx", mode: 0o600});
});

describe("P3 new synthetic controls; named OPEN variations are not closure", () => {
  it("P301 opaque same-owner positive sequence", () => {
    const h = make("f();"); expect(Object.isFrozen(h)).toBe(true); expect(Object.getOwnPropertySymbols(h as object)).toEqual([]);
    expect(metadata(api.observeSyntheticSummaryP3(h)).phase).toBe("SOURCE_READY");
    const wire = api.analyzeSyntheticSummaryP3(h); expect(readSummary(wire).sites).toEqual([site("CALL", 0, 3, "NO_LOCAL_BINDING", "OTHER")]);
    expect(metadata(api.observeSyntheticSummaryP3(h)).phase).toBe("PRODUCER_SUMMARY");
    expect(typeof api.retireProducerSummaryP3(h)).toBe("string");
    expect(metadata(api.observeSyntheticSummaryP3(h)).phase).toBe("PRODUCER_AST_RETIRED");
    expect(metadata(api.verifySyntheticSummaryP3(h, wire)).phase).toBe("VERIFIED");
    api.retireSyntheticSummaryP3(h); stale(h); active = null;
  });
  it("P302 forged, proxy, foreign getters/coercion never reflected", () => {
    const h = make("f();"); let touched = 0;
    const forged = {get phase() { touched++; throw Error("GETTER"); }, valueOf() { touched++; throw Error("COERCION"); }};
    const proxy = new Proxy({}, {get() { touched++; throw Error("PROXY"); }, ownKeys() { touched++; throw Error("KEYS"); }});
    for (const foreign of [forged, proxy, {}, null, "handle", 1]) refusal(() => api.analyzeSyntheticSummaryP3(foreign), "AUTHORITY_REFUSED");
    expect(touched).toBe(0); expect(metadata(api.observeSyntheticSummaryP3(h)).phase).toBe("SOURCE_READY");
    const foreignHandle = fault.createSyntheticSummaryP3("", "SCRIPT", CAP, TTL);
    refusal(() => api.observeSyntheticSummaryP3(foreignHandle), "AUTHORITY_REFUSED"); fault.retireSyntheticSummaryP3(foreignHandle);
  });
  it("P303 retired and expired handles refuse and cleanup after original expiry", async () => {
    const old = make(""); api.retireSyntheticSummaryP3(old); active = null; stale(old);
    const h = make("", "SCRIPT", CAP, 25), start = performance.now(); await delay(40);
    refusal(() => api.observeSyntheticSummaryP3(h), "TIME_REFUSED"); stale(h);
    raw.push({variation: "P303.EXPIRY", elapsed: performance.now() - start});
  });
  it("P304 exact arity and parser/options/callback substitution deny without revoking valid owner", () => {
    let touched = 0; const plugin = {get parser() { touched++; throw Error("GETTER"); }, toString() { touched++; throw Error("COERCE"); }};
    refusal(() => invoke(api.createSyntheticSummaryP3, ["", "SCRIPT", CAP, TTL, plugin]), "AUTHORITY_REFUSED");
    refusal(() => api.createSyntheticSummaryP3(plugin, "SCRIPT", CAP, TTL), "SCHEMA_REFUSED");
    refusal(() => api.createSyntheticSummaryP3(() => "", "SCRIPT", CAP, TTL), "SCHEMA_REFUSED");
    const h = make("f();");
    for (const fn of [api.analyzeSyntheticSummaryP3, api.observeSyntheticSummaryP3, api.retireProducerSummaryP3, api.retireSyntheticSummaryP3]) {
      refusal(() => invoke(fn, [h, plugin]), "AUTHORITY_REFUSED");
      refusal(() => invoke(fn, []), "AUTHORITY_REFUSED");
    }
    refusal(() => invoke(api.verifySyntheticSummaryP3, [h, "", plugin]), "AUTHORITY_REFUSED");
    expect(touched).toBe(0); expect(metadata(api.observeSyntheticSummaryP3(h)).phase).toBe("SOURCE_READY");
  });
  it("P305 independent literal import/export/call/new/member sites and UTF16 spans", () => {
    positive('import x from "m";', "MODULE", [site("IMPORT", 0, 18, "NONE", "STATIC_LITERAL")]);
    positive("const x=1;export {x};", "MODULE", [site("EXPORT", 10, 21)], 9);
    positive("export default 1;", "MODULE", [site("EXPORT", 0, 17)], 3);
    positive('export * from "m";', "MODULE", [site("EXPORT", 0, 18, "NONE", "STATIC_LITERAL")]);
    positive('import("m");', "SCRIPT", [site("DYNAMIC_IMPORT", 0, 11, "NONE", "STATIC_LITERAL")]);
    positive('require("x");', "SCRIPT", [site("CALL", 0, 12, "NO_LOCAL_BINDING", "BARE_REQUIRE")], 5);
    positive("obj.run();", "SCRIPT", [site("MEMBER", 0, 7, "NONE", "OTHER"), site("CALL", 0, 9, "NONE", "OTHER")], 6);
    positive('new Function("x");', "SCRIPT", [site("NEW", 0, 17, "NO_LOCAL_BINDING", "FUNCTION")]);
    positive('eval("x");', "SCRIPT", [site("CALL", 0, 9, "NO_LOCAL_BINDING", "EVAL")]);
    positive("const o={x};", "SCRIPT", [], 8); // reused shorthand Identifier counted per reachable edge.
  });
  it("P306 dynamic, every shadowing family, conditional/deferred/optional/computed remain OPEN", () => {
    positive("import(x);", "SCRIPT", [site("DYNAMIC_IMPORT", 0, 9, "NONE", "DYNAMIC")]);
    positive('function f(require){require("x");}require("x");', "SCRIPT", [
      site("CALL", 20, 32, "AMBIGUOUS", "BARE_REQUIRE", "CONTROL_OR_DEFERRED"), site("CALL", 34, 46, "AMBIGUOUS", "BARE_REQUIRE")]);
    positive('var require;require("x");', "SCRIPT", [site("CALL", 12, 24, "AMBIGUOUS", "BARE_REQUIRE")]);
    positive('let require;require("x");', "SCRIPT", [site("CALL", 12, 24, "AMBIGUOUS", "BARE_REQUIRE")]);
    positive('const require=x;require("x");', "SCRIPT", [site("CALL", 16, 28, "AMBIGUOUS", "BARE_REQUIRE")]);
    positive('function require(){}require("x");', "SCRIPT", [site("CALL", 20, 32, "AMBIGUOUS", "BARE_REQUIRE")]);
    positive('import require from "m";require("x");', "MODULE", [site("IMPORT", 0, 24, "NONE", "STATIC_LITERAL"), site("CALL", 24, 36, "AMBIGUOUS", "BARE_REQUIRE")]);
    positive("const {require:r}=x;r();", "SCRIPT", [site("CALL", 20, 23, "AMBIGUOUS", "OTHER")]);
    positive("function f({r}){r();}", "SCRIPT", [site("CALL", 16, 19, "AMBIGUOUS", "OTHER", "CONTROL_OR_DEFERRED")]);
    positive("try{f();}catch(e){e();}", "SCRIPT", [site("CALL", 4, 7, "NO_LOCAL_BINDING", "OTHER", "CONTROL_OR_DEFERRED"),
      site("CALL", 18, 21, "AMBIGUOUS", "OTHER", "CONTROL_OR_DEFERRED")]);
    positive('if(x){require("m");}', "SCRIPT", [site("CALL", 6, 18, "NO_LOCAL_BINDING", "BARE_REQUIRE", "CONTROL_OR_DEFERRED")]);
    positive('x&&require("m");', "SCRIPT", [site("CALL", 3, 15, "NO_LOCAL_BINDING", "BARE_REQUIRE", "CONTROL_OR_DEFERRED")]);
    positive('x?require("m"):f();', "SCRIPT", [site("CALL", 2, 14, "NO_LOCAL_BINDING", "BARE_REQUIRE", "CONTROL_OR_DEFERRED"),
      site("CALL", 15, 18, "NO_LOCAL_BINDING", "OTHER", "CONTROL_OR_DEFERRED")]);
    positive("while(x){f();}", "SCRIPT", [site("CALL", 9, 12, "NO_LOCAL_BINDING", "OTHER", "CONTROL_OR_DEFERRED")]);
    positive("class C{m(){f();}}", "SCRIPT", [site("CALL", 12, 15, "NO_LOCAL_BINDING", "OTHER", "CONTROL_OR_DEFERRED")]);
    positive('class Function{};new Function("x");', "SCRIPT", [site("NEW", 17, 34, "AMBIGUOUS", "FUNCTION")]);
    positive("obj?.run?.();", "SCRIPT", [site("MEMBER", 0, 8, "NONE", "OTHER", "OPTIONAL", true), site("CALL", 0, 12, "NONE", "OTHER", "OPTIONAL", true)]);
    positive('obj["x"]();', "SCRIPT", [site("MEMBER", 0, 8, "NONE", "COMPUTED", "CERTAIN", false, true), site("CALL", 0, 10, "NONE", "COMPUTED")]);
  });
  it("P307 exact UTF16 Unicode and lone-surrogate identity, not UTF8 replacement collision", () => {
    const a = positive('"😀";', "SCRIPT", [], 3); expect(a.utf16Units).toBe(5);
    const one = '"\ud800";', two = '"\ufffd";';
    expect(Buffer.from(one).equals(Buffer.from(two))).toBe(true);
    const p = positive(one, "SCRIPT", [], 3), q = positive(two, "SCRIPT", [], 3);
    expect(p.syntheticUtf16Hash).not.toBe(q.syntheticUtf16Hash);
    expect(p.syntheticUtf16Hash).toBe(utf16Hash(one)); expect(q.syntheticUtf16Hash).toBe(utf16Hash(two));
  });
  it("P308 duplicate/extra/noncanonical/unsafe/deep/escaped wire variants refuse before decode", () => {
    const transforms: Array<[string, (wire: string) => string]> = [
      ["DUPLICATE", w => w.replace('{"version":1,', '{"version":1,"version":1,')],
      ["EXTRA", w => w.replace('{"version":1,', '{"version":1,"extra":0,')],
      ["WHITESPACE", w => " " + w], ["BOM", w => "\ufeff" + w],
      ["KEY_ORDER", w => w.replace('"version":1,"purpose":"TIP081_P3_SYNTHETIC_SYNTAX_SUMMARY"', '"purpose":"TIP081_P3_SYNTHETIC_SYNTAX_SUMMARY","version":1')],
      ["UNSAFE_INTEGER", w => w.replace('"utf16Units":4', '"utf16Units":9007199254740992')],
      ["NEGATIVE_ZERO", w => w.replace('"start":0', '"start":-0')],
      ["FRACTION", w => w.replace('"start":0', '"start":0.5')],
      ["DEPTH", w => "[[[[[[[[[" + w + "]]]]]]]]]"], ["ESCAPE", w => w.replace('"SCRIPT"', '"SCRI\\u0050T"')],
    ];
    for (const [label, mutate] of transforms) {
      const h = make("f();"), wire = api.analyzeSyntheticSummaryP3(h); api.retireProducerSummaryP3(h);
      refusal(() => api.verifySyntheticSummaryP3(h, mutate(wire)), "SUMMARY_REFUSED"); raw.push({variation: "P308." + label}); stale(h); drop();
    }
    changed(s => { s.purpose = "TIP081_BOUNDED_SOURCE_CONSUMER_RECEIPT"; }, "P308.WRONG_PURPOSE", "SUMMARY_REFUSED");
  });
  it("P309 full successful transition has additive unreclaimed producer and replay reservations", () => {
    const h = make("f();"), first = metadata(api.observeSyntheticSummaryP3(h));
    const wire = api.analyzeSyntheticSummaryP3(h), analyzed = metadata(api.observeSyntheticSummaryP3(h));
    api.retireProducerSummaryP3(h); const retired = metadata(api.observeSyntheticSummaryP3(h));
    const verified = metadata(api.verifySyntheticSummaryP3(h, wire));
    expect(first.grammarPasses).toBe(0); expect(analyzed.grammarPasses).toBe(1); expect(verified.grammarPasses).toBe(2);
    expect(retired.totalBytes).toBe(analyzed.totalBytes); expect(verified.totalBytes).toBe(retired.totalBytes);
    expect(Number(verified.unreclaimedProducerBytes)).toBeGreaterThan(0);
    expect(Number(verified.unreclaimedReplayBytes)).toBeGreaterThan(0);
    expect(verified.replayLiveBytes).toBe(0);
  });
  it("P310 premature verify denies before second grammar pass and disposes owner", () => {
    const h = make("f();"), wire = api.analyzeSyntheticSummaryP3(h);
    expect(metadata(api.observeSyntheticSummaryP3(h)).grammarPasses).toBe(1);
    refusal(() => api.verifySyntheticSummaryP3(h, wire), "PHASE_REFUSED"); stale(h);
    drop(); const fresh = make(""); expect(metadata(api.observeSyntheticSummaryP3(fresh)).grammarPasses).toBe(0);
  });
  it("P311 fixed negative alias derivative advances legitimate phase but denies retained producerRoot", () => {
    const h = make("f();", "SCRIPT", CAP, TTL, fault), wire = fault.analyzeSyntheticSummaryP3(h);
    fault.retireProducerSummaryP3(h); const m = metadata(fault.observeSyntheticSummaryP3(h));
    expect(m.phase).toBe("PRODUCER_AST_RETIRED"); expect(m.grammarPasses).toBe(1);
    refusal(() => fault.verifySyntheticSummaryP3(h, wire), "ALIAS_REFUSED"); stale(h, fault);
  });
  it("P312 retirement transfers parse/work once without refund/reset/doublecount", () => {
    const h = make("f();"), wire = api.analyzeSyntheticSummaryP3(h), s = readSummary(wire);
    const before = metadata(api.observeSyntheticSummaryP3(h)); api.retireProducerSummaryP3(h);
    const after = metadata(api.observeSyntheticSummaryP3(h));
    expect(after.totalBytes).toBe(before.totalBytes); expect(after.peakBytes).toBe(before.peakBytes);
    expect(after.unreclaimedProducerBytes).toBe(s.ledger.producerParseBytes + s.ledger.producerWorkBytes);
    expect(after.producerParseBytes).toBe(0); expect(after.producerWorkBytes).toBe(0);
    expect(after.attemptedNodes).toBe(before.attemptedNodes); expect(after.internalEntries).toBe(before.internalEntries);
    refusal(() => api.retireProducerSummaryP3(h), "PHASE_REFUSED"); stale(h);
  });
  it("P313 replay slots retired before VERIFIED; no reuse/stale acceptance", () => {
    const h = make("f();"), wire = api.analyzeSyntheticSummaryP3(h); api.retireProducerSummaryP3(h);
    const m = metadata(api.verifySyntheticSummaryP3(h, wire)); expect(m.replayLiveBytes).toBe(0);
    expect(Number(m.unreclaimedReplayBytes)).toBeGreaterThan(0);
    refusal(() => api.verifySyntheticSummaryP3(h, wire), "PHASE_REFUSED"); stale(h);
  });
  it("P314 resealed omitted site with coherent site/count/membership changes fails actual replay", () => {
    changed(s => { s.sites = []; s.ledger.siteCount = 0; s.ledger.producerEntries -= 2; }, "P314.OMITTED");
  });
  it("P315 resealed duplicate site with coherent count/memberships fails actual replay", () => {
    changed(s => { s.sites.push({...s.sites[0]}); s.ledger.siteCount++; s.ledger.producerEntries += 2; }, "P315.DUPLICATE");
  });
  it("P316 resealed shifted start/end and out-of-source spans fail replay", () => {
    changed(s => { s.sites[0].start = 1; }, "P316.START");
    changed(s => { s.sites[0].end = 2; }, "P316.END");
    changed(s => { s.sites[0].end = 5; }, "P316.OUT_OF_SOURCE");
  });
  it("P317 each resealed binding/loader/conditional/optional/computed classification mutation fails replay", () => {
    changed(s => { s.sites[0].binding = "AMBIGUOUS"; }, "P317.BINDING");
    changed(s => { s.sites[0].loader = "BARE_REQUIRE"; }, "P317.LOADER");
    changed(s => { s.sites[0].conditional = "CONTROL_OR_DEFERRED"; }, "P317.CONDITIONAL");
    changed(s => { s.sites[0].optional = true; }, "P317.OPTIONAL");
    changed(s => { s.sites[0].computed = true; }, "P317.COMPUTED");
  });
  it("P318 source/mode/occurrences/attempts/count/seal substitution variations fail", () => {
    changed(s => { s.syntheticUtf16Hash = utf16Hash("g();"); }, "P318.SOURCE");
    changed(s => { s.mode = "MODULE"; }, "P318.MODE");
    changed(s => { s.utf16Units++; }, "P318.LENGTH");
    changed(s => { s.astOccurrences++; }, "P318.OCCURRENCES");
    changed(s => { s.grammarAttempts++; s.ledger.producerAttempts++; }, "P318.ATTEMPTS");
    const h = make("f();"), s = readSummary(api.analyzeSyntheticSummaryP3(h));
    s.summaryHash = "0".repeat(64); api.retireProducerSummaryP3(h);
    refusal(() => api.verifySyntheticSummaryP3(h, JSON.stringify(s)), "REPLAY_MISMATCH"); stale(h);
  });
  it("P319 INPUT exact16384 reaches replay mismatch; +1 refuses; PRODUCER boundary remains OPEN", () => {
    // Fixed bounded synthetic hostile wire construction, not target source search.
    const first = make("f();"), base = readSummary(api.analyzeSyntheticSummaryP3(first)); drop();
    let chosen: Summary | null = null;
    for (let n = 1; n <= 128; n++) {
      const s: Summary = {...base, ledger: {...base.ledger}, sites: Array.from({length: n}, () => site("CALL", 0, 3, "NONE", "EVAL"))};
      s.ledger.siteCount = n; s.ledger.producerEntries += 2 * (n - 1);
      const initial = JSON.stringify(seal(s)).length, remaining = 16384 - initial;
      if (remaining < 0 || remaining > 13 * n - 1) continue;
      let delta = remaining;
      for (let i = 0; i < n && delta; i++) {
        if (delta >= 12) { s.sites[i].binding = "NO_LOCAL_BINDING"; delta -= 12; }
        if (delta) { s.sites[i].loader = "OTHER"; delta--; }
      }
      if (delta === 0 && JSON.stringify(seal(s)).length === 16384) { chosen = s; break; }
    }
    expect(chosen).not.toBeNull();
    const exact = JSON.stringify(seal(chosen as Summary)); expect(Buffer.byteLength(exact)).toBe(16384);
    // +1 is also canonical/sealed: grow one EVAL(4) to OTHER(5).
    const plus = seal(chosen as Summary), shorter = plus.sites.find(r => r.loader === "EVAL");
    expect(shorter).toBeDefined(); (shorter as Site).loader = "OTHER";
    const over = JSON.stringify(seal(plus)); expect(Buffer.byteLength(over)).toBe(16385);
    for (const [label, wire, code] of [["EXACT", exact, "REPLAY_MISMATCH"], ["PLUS_ONE", over, "SUMMARY_REFUSED"]]) {
      const h = make("f();"); api.analyzeSyntheticSummaryP3(h); api.retireProducerSummaryP3(h);
      refusal(() => api.verifySyntheticSummaryP3(h, wire), code); raw.push({variation: "P319.INPUT." + label, bytes: wire.length}); stale(h); drop();
    }
    raw.push({variation: "P319.PRODUCER", status: "OPEN", reason: "No source justified exact16384 accepted producer fixture"});
  });
  it("P320 total logical cap exact/minus1 and 32 metadata emissions/+1 discriminate independent axes", () => {
    const h = make("f();"), wire = api.analyzeSyntheticSummaryP3(h); api.retireProducerSummaryP3(h);
    const m = metadata(api.verifySyntheticSummaryP3(h, wire)), exact = Number(m.totalBytes); drop();
    const boundary = make("f();", "SCRIPT", exact), bw = api.analyzeSyntheticSummaryP3(boundary); api.retireProducerSummaryP3(boundary);
    expect(metadata(api.verifySyntheticSummaryP3(boundary, bw)).totalBytes).toBe(exact); drop();
    const below = make("f();", "SCRIPT", exact - 1); refusal(() => api.analyzeSyntheticSummaryP3(below), "CAP_REFUSED"); stale(below); drop();
    const output = make(""); for (let i = 0; i < 32; i++) expect(metadata(api.observeSyntheticSummaryP3(output)).metadataEmissions).toBe(i + 1);
    refusal(() => api.observeSyntheticSummaryP3(output), "VERIFY_RESOURCE_REFUSED"); stale(output);
    raw.push({variation: "P320.CAP", exact, minusOne: exact - 1});
  });
  it.todo("P321 OPEN: independently discriminating traversal-depth128 positive/129 refusal; P2 hybrid is masked by P3 combined cap/entries");
  it("P322 combined original cumulative memberships plus replay/sites cannot reset", () => {
    // Source-derived fixed grammar family. Every attempt/counter/first refusal is
    // retained; no broadened any-error. This finite boundary family is not a root.
    let found = false, previousPassed = false;
    for (let count = 16; count <= 48 && !found; count++) {
      const text = "f();".repeat(count), h = make(text); let code = "PASS";
      try {
        const wire = api.analyzeSyntheticSummaryP3(h), s = readSummary(wire);
        expect(s.sites).toEqual(Array.from({length: count}, (_, i) => site("CALL", i * 4, i * 4 + 3, "NO_LOCAL_BINDING", "OTHER")));
        api.retireProducerSummaryP3(h); const result = metadata(api.verifySyntheticSummaryP3(h, wire));
        expect(Number(result.internalEntries)).toBeGreaterThan(s.ledger.producerEntries); previousPassed = true;
      } catch (error) {
        const descriptor = error !== null && typeof error === "object" ? Object.getOwnPropertyDescriptor(error, "code") : undefined;
        code = descriptor && "value" in descriptor && typeof descriptor.value === "string" ? descriptor.value : "ASSERTION_OR_UNEXPECTED";
        expect(error).toEqual({code: "ENTRY_REFUSED", realParserDisabled: true}); found = true;
        expect(previousPassed).toBe(true); stale(h);
      } finally { raw.push({variation: "P322.CUMULATIVE", count, code}); drop(); }
    }
    expect(found).toBe(true);
  });
  it("P323 resealed total/peak/category/retirement arithmetic mutations rejected independently", () => {
    changed(s => { s.ledger.totalBytes--; }, "P323.TOTAL");
    changed(s => { s.ledger.peakBytes--; }, "P323.PEAK");
    changed(s => { s.ledger.producerParseBytes--; s.ledger.producerWorkBytes++; }, "P323.CATEGORY_SHIFT");
    changed(s => { s.ledger.unreclaimedProducerBytes++; s.ledger.producerParseBytes--; }, "P323.RETIREMENT");
    changed(s => { s.ledger.replayReservedBytes--; s.ledger.replayLiveBytes++; }, "P323.REPLAY_ESCROW");
    changed(s => { s.ledger.producerEntries--; }, "P323.COUNTERS");
  });
  it("P324 observation cannot renew original deadline; raw inequalities preserved", async () => {
    const h = make("", "SCRIPT", CAP, 1000), started = performance.now(); await delay(600);
    const first = performance.now() - started; metadata(api.observeSyntheticSummaryP3(h)); await delay(600);
    const last = performance.now() - started; refusal(() => api.observeSyntheticSummaryP3(h), "TIME_REFUSED");
    const post = performance.now() - started; expect(first).toBeLessThan(1000); expect(last).toBeGreaterThanOrEqual(1000); expect(post).toBeGreaterThanOrEqual(last);
    raw.push({variation: "P324.ORIGINAL_TTL", first, last, post, ttl: 1000}); stale(h);
  });
  it("P325 verifier cannot restart deadline after producer retirement", async () => {
    const h = make("f();", "SCRIPT", CAP, 1000), started = performance.now(), wire = api.analyzeSyntheticSummaryP3(h);
    api.retireProducerSummaryP3(h); await delay(1100);
    const before = performance.now() - started; refusal(() => api.verifySyntheticSummaryP3(h, wire), "TIME_REFUSED");
    const post = performance.now() - started; expect(before).toBeGreaterThanOrEqual(1000); expect(post).toBeGreaterThanOrEqual(before);
    raw.push({variation: "P325.NO_REPLAY_RENEWAL", before, post, ttl: 1000}); stale(h);
  });
  it("P326 captured trusted clock ignores later performance.now replacement", async () => {
    const saved = Object.getOwnPropertyDescriptor(performance, "now"), original = performance.now.bind(performance);
    const h = make("", "SCRIPT", CAP, 25), start = original();
    try {
      Object.defineProperty(performance, "now", {configurable: true, value: () => 0}); await delay(40);
      refusal(() => api.observeSyntheticSummaryP3(h), "TIME_REFUSED"); stale(h);
      raw.push({variation: "P326.CAPTURED_CLOCK", elapsed: original() - start});
    } finally { if (saved) Object.defineProperty(performance, "now", saved); else Reflect.deleteProperty(performance, "now"); }
  });
  it("P327 syntax/error/resource replay refusal disposes every stage with no partial salvage", () => {
    const broken = make("let ="); refusal(() => api.analyzeSyntheticSummaryP3(broken), "SYNTAX_REFUSED"); stale(broken); drop();
    const exhausted = make(""); for (let i = 0; i < 32; i++) api.observeSyntheticSummaryP3(exhausted);
    refusal(() => api.observeSyntheticSummaryP3(exhausted), "VERIFY_RESOURCE_REFUSED"); stale(exhausted); drop();
    changed(s => { s.sites[0].loader = "EVAL"; }, "P327.REPLAY_ERROR");
    const fresh = make(""); expect(metadata(api.observeSyntheticSummaryP3(fresh)).phase).toBe("SOURCE_READY");
  });
  it("P328 only the exact new three-file normal tuple admits; loader arities deny substitutes", async () => {
    const a = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.candidate.mjs", "utf8");
    const b = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.inventory.json", "utf8");
    const c = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.profile.json", "utf8");
    expect(verifySyntheticSummaryArtifactP3(a, b, c)).toBe(true); expect(verifySyntheticSummaryArtifactP3(a + " ", b, c)).toBe(false);
    await expect(invoke(loadAdmittedSyntheticSummaryP3, ["file:///tmp/caller-parser.mjs"])).rejects.toEqual({code: "ALLOCATION_COVERAGE_OPEN", realParserDisabled: true});
    expect(Object.keys(api)).toEqual(["createSyntheticSummaryP3", "analyzeSyntheticSummaryP3", "retireProducerSummaryP3",
      "verifySyntheticSummaryP3", "observeSyntheticSummaryP3", "retireSyntheticSummaryP3"]);
  });
  it("P329 actual fixed emitted array guard-removal text denied before import", () => {
    const a = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.candidate.mjs", "utf8");
    const b = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.inventory.json", "utf8");
    const c = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.profile.json", "utf8");
    const guard = "__HIVE_P2_reserveArray(2, -1);"; expect(a.split(guard).length - 1).toBe(1);
    const changedSource = a.replace(guard, "/* P3 actual fixed guard removed */"); expect(changedSource).not.toBe(a);
    expect(verifySyntheticSummaryArtifactP3(changedSource, b, c)).toBe(false);
    raw.push({variation: "P329.REAL_GUARD_REMOVAL", removed: guard, modifiedSourceImported: false});
  });
  it("P330 altered profile/inventory/pin flags cannot self-admit", () => {
    const a = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.candidate.mjs", "utf8");
    const b = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.inventory.json", "utf8");
    const c = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.profile.json", "utf8");
    expect(verifySyntheticSummaryArtifactP3(a, b + " ", c)).toBe(false);
    expect(verifySyntheticSummaryArtifactP3(a, b, c + " ")).toBe(false);
    const p = JSON.parse(c); p.authority = "APPROVED"; p.fullP3Accepted = true; p.realParserDisabled = false;
    expect(verifySyntheticSummaryArtifactP3(a, b, JSON.stringify(p))).toBe(false);
    expect(verifySyntheticSummaryArtifactP3({candidateHash: "approved"}, b, c)).toBe(false);
    expect(invoke(verifySyntheticSummaryArtifactP3, [a, b])).toBe(false);
    expect(invoke(verifySyntheticSummaryArtifactP3, [a, b, c, "APPROVED"])).toBe(false);
    let touched = 0;
    const forged = {get candidate() { touched++; throw Error("GETTER"); }, toString() { touched++; throw Error("COERCE"); }};
    expect(verifySyntheticSummaryArtifactP3(forged, b, c)).toBe(false);
    expect(verifySyntheticSummaryArtifactP3(() => a, b, c)).toBe(false);
    expect(verifySyntheticSummaryArtifactP3(Object(a), b, c)).toBe(false);
    expect(touched).toBe(0);
  });
  it("P331 P2 and alias/real receipt domain confusion refuses without importing another domain", () => {
    const normalInventory = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.inventory.json", "utf8");
    const normalProfile = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.profile.json", "utf8");
    const alias = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.alias-fault.candidate.mjs", "utf8");
    expect(verifySyntheticSummaryArtifactP3(alias, normalInventory, normalProfile)).toBe(false);
    const p2 = readFileSync(ROOT + "scripts/test/generated/private-grammar-tip081-p2.checked.candidate.mjs", "utf8");
    expect(verifySyntheticSummaryArtifactP3(p2, normalInventory, normalProfile)).toBe(false);
    changed(s => { s.purpose = "TIP081_BOUNDED_SOURCE_CONSUMER_RECEIPT"; }, "P331.REAL_RECEIPT", "SUMMARY_REFUSED");
  });
  it("P332 OFF/UNRUN capture flags are history not authority; fixed issued tuple alone controls admission", () => {
    const a = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.candidate.mjs", "utf8");
    const b = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.inventory.json", "utf8");
    const c = readFileSync(ROOT + "scripts/test/generated/private-summary-tip081-p3.profile.json", "utf8"), p = JSON.parse(c);
    expect(p.checks).toBe("UNRUN"); expect(p.authority).toBe("NOT_ISSUED");
    expect(verifySyntheticSummaryArtifactP3(a, b, c)).toBe(true);
    const flags = JSON.stringify({...p, checks: "PASS", authority: "SOURCE_REVIEWED_SYNTHETIC_ONLY"});
    expect(verifySyntheticSummaryArtifactP3(a, b, flags)).toBe(false);
  });
  it("P333 JSON-only bounded scalar metadata; no source/name/specifier/AST export", () => {
    const secret = 'const __p3_private_name="__p3_private_specifier";f();';
    const h = make(secret), wire = api.analyzeSyntheticSummaryP3(h); readSummary(wire);
    expect(wire).not.toContain("__p3_private_name"); expect(wire).not.toContain("__p3_private_specifier");
    api.retireProducerSummaryP3(h); const text = api.verifySyntheticSummaryP3(h, wire), m = metadata(text);
    expect(text).not.toContain(secret); expect(Object.keys(m)).not.toContain("ast"); expect(Object.keys(m)).not.toContain("source");
  });
  it("P334 common-mode/open62/fullRuntimeClosure/flags preserved; no graph authority", () => {
    const h = make("f();"), wire = api.analyzeSyntheticSummaryP3(h); api.retireProducerSummaryP3(h);
    const m = metadata(api.verifySyntheticSummaryP3(h, wire));
    expect(m.semanticCoverage).toBe("OPEN_COMMON_GRAMMAR_RISK"); expect(m.allocatorCoverage).toBe("COMMON_MODE");
    expect(m.graphStatus).toBe("OPEN"); expect(m.predecessorOpen).toBe(62); expect(m.fullRuntimeClosure).toBe("NOT_ACCEPTED");
    expect(m.execution).toBe(false); expect(m.materialization).toBe(false); expect(m.realParserDisabled).toBe(true);
  });
  it("P335 unsupported mode and native branches refuse, no automatic second parse", () => {
    refusal(() => api.createSyntheticSummaryP3("", "UNKNOWN", CAP, TTL), "MODE_OPEN");
    for (const text of ["/x/;", "1n;", "let π=1;"]) {
      const h = make(text); refusal(() => api.analyzeSyntheticSummaryP3(h), "UNSUPPORTED_BOUNDED_SYNTAX"); stale(h); drop();
    }
    const h = make("import x from 'm';", "SCRIPT"); refusal(() => api.analyzeSyntheticSummaryP3(h), "SYNTAX_REFUSED"); stale(h);
  });
  it("P336 oversized/failed wire cannot yield a partial result or retry the same owner", () => {
    const h = make("f();"), wire = api.analyzeSyntheticSummaryP3(h); api.retireProducerSummaryP3(h);
    refusal(() => api.verifySyntheticSummaryP3(h, wire + " ".repeat(16385)), "SUMMARY_REFUSED"); stale(h);
    refusal(() => api.verifySyntheticSummaryP3(h, wire), "AUTHORITY_REFUSED");
    refusal(() => api.analyzeSyntheticSummaryP3(h), "AUTHORITY_REFUSED");
    expect(Object.keys(api)).not.toContain("retry"); expect(Object.keys(api)).not.toContain("reset");
  });
});
