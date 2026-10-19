import {afterEach, describe, expect, it, vi} from "vitest";
import {performance as trustedPerformance} from "node:perf_hooks";
import {createSyntheticScriptP1, createSyntheticModuleP1, P1_LIMITS,
  reserveSyntheticP1, retireProducerSyntheticP1, reserveReplaySyntheticP1,
  readSyntheticP1, retireSyntheticP1, parserEntrySyntheticP1, refuseNativeLiteralP1,
  scanTriviaSyntheticP1, lineBreakAheadSyntheticP1, identifierAheadSyntheticP1,
  strictDirectiveSyntheticP1} from "../../scripts/test/guard-scanners-tip081-p1.mjs";

type Handle = ReturnType<typeof createSyntheticScriptP1>;
const handles: Handle[] = [];
function script(text = "", cap = 1048576, ttl = 120000) {
  const h = createSyntheticScriptP1(text, cap, ttl); handles.push(h); return h;
}
function moduleFixture(text: string) {
  const h = createSyntheticModuleP1(text); handles.push(h); return h;
}
function refused(action: () => unknown, code: string) {
  let caught: unknown;
  try { action(); } catch (error) { caught = error; }
  expect(caught).toMatchObject({code, parserDisabled: true});
}
function retire(h: Handle) { retireSyntheticP1(h); }
afterEach(() => {
  vi.restoreAllMocks(); vi.unstubAllGlobals();
  for (const h of handles.splice(0)) { try { retireSyntheticP1(h); } catch { /* Already revoked on refusal. */ } }
});

describe("P1 scalar guards: literal independent logical-cost expectations", () => {
  it("P101 exact total byte boundary and +1 refuse with cleanup", () => {
    const h = script("", 82048);
    expect(reserveSyntheticP1(h, "bytes", 128, 0, 0)).toBe(true);
    refused(() => reserveSyntheticP1(h, "bytes", 1, 0, 0), "CAP_REFUSED");
    refused(() => readSyntheticP1(h), "AUTHORITY_REFUSED");
    expect(script()).toHaveProperty("parserDisabled", true);
  });
  it("P102 source reserve includes caller and retained UTF16 payloads", () => {
    const h = script("é😀");
    expect(readSyntheticP1(h).totalBytes).toBe(82956); // 81920 + 3*4 +1024
    expect(P1_LIMITS.moduleBytes).toBe(65536);
    expect(P1_LIMITS.scratchBytes).toBe(8192);
    expect(Object.keys(readSyntheticP1(h))).not.toContain("text");
  });
  it("P103 source exact startup cap and +1 UTF16 unit", () => {
    const h = script("x", 81924); retire(h);
    refused(() => createSyntheticScriptP1("xx", 81924), "CAP_REFUSED");
    refused(() => createSyntheticScriptP1("", 81919), "CAP_REFUSED");
  });
  it("P104 safe integer and overflow refusal precede arithmetic growth", () => {
    for (const n of [-0, -1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      const h = script();
      refused(() => reserveSyntheticP1(h, "bytes", n, 0, 0), "SCHEMA_REFUSED"); retire(h);
    }
    const h = script();
    refused(() => reserveSyntheticP1(h, "array", Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 0), "CAP_REFUSED");
  });
  it("P105 resize charges old+new backing plus header/resize record", () => {
    const h = script(); reserveSyntheticP1(h, "array", 8, 16, 2);
    const q = readSyntheticP1(h);
    expect(q.producerBytes).toBe(280); // 88 + (8+16)*8
    expect(q.entries).toBe(2);
  });
  it("P106 invalid resize shape refuses and does not retain an owner", () => {
    const h = script(); refused(() => reserveSyntheticP1(h, "array", 9, 8, 0), "SCHEMA_REFUSED");
    expect(script()).toHaveProperty("parserDisabled", true);
  });
  it("P107 dictionary key/row/fanout charges each retained reference", () => {
    const h = script(); reserveSyntheticP1(h, "dictionary", 5, 3, 4);
    const q = readSyntheticP1(h); expect(q.producerBytes).toBe(234); expect(q.entries).toBe(7);
  });
  it("P108 attempted derived-string work retains old/new overlap each time", () => {
    const h = script(); reserveSyntheticP1(h, "string", 10, 20, 2);
    expect(readSyntheticP1(h).producerBytes).toBe(248); // (64+(10+20)*2)*2
    reserveSyntheticP1(h, "string", 10, 20, 1);
    expect(readSyntheticP1(h).producerBytes).toBe(372);
  });
  it("P109 retirement transfers without refund; replay is additive", () => {
    const h = script(); reserveSyntheticP1(h, "bytes", 4096, 0, 0);
    const before = readSyntheticP1(h); retireProducerSyntheticP1(h);
    reserveReplaySyntheticP1(h, 2048); const after = readSyntheticP1(h);
    expect(after.producerBytes).toBe(0); expect(after.unreclaimedProducerBytes).toBe(4096);
    expect(after.replayBytes).toBe(2048); expect(after.totalBytes - before.totalBytes).toBe(3072);
    refused(() => retireProducerSyntheticP1(h), "AUTHORITY_REFUSED");
  });
  it("P110 producer overlap leaves no credit for replay", () => {
    const h = script("", 82048); reserveSyntheticP1(h, "bytes", 128, 0, 0);
    retireProducerSyntheticP1(h); refused(() => reserveReplaySyntheticP1(h, 1), "CAP_REFUSED");
  });
  it("P111 node exact 200000 and +1 cap is conjunctive", () => {
    const h = script("", 67108864); reserveSyntheticP1(h, "node", 0, 200000, 128);
    expect(readSyntheticP1(h).nodes).toBe(200000);
    refused(() => reserveSyntheticP1(h, "node", 0, 1, 1), "NODE_REFUSED");
  });
  it("P112 entry exact 20000 and +1 independent of bytes", () => {
    const h = script(); reserveSyntheticP1(h, "bytes", 0, 0, 20000);
    expect(readSyntheticP1(h).entries).toBe(20000);
    refused(() => reserveSyntheticP1(h, "bytes", 0, 0, 1), "ENTRY_REFUSED");
  });
  it("P113 helper depth 128 and +1 independent of AST", () => {
    const h = script(); reserveSyntheticP1(h, "frame", 128, 0, 0);
    expect(readSyntheticP1(h).depth).toBe(128);
    refused(() => reserveSyntheticP1(h, "frame", 129, 0, 0), "DEPTH_REFUSED");
  });
  it("P114 output allocation admitted before creation on exhausted cap", () => {
    const h = script("", 81920); refused(() => readSyntheticP1(h), "CAP_REFUSED");
    refused(() => retireSyntheticP1(h), "AUTHORITY_REFUSED");
  });
  it("P115 private captured clock survives global replacement", () => {
    let touches = 0;
    vi.stubGlobal("performance", {now() { touches++; throw Error("hostile global clock"); }});
    const h = script(); expect(readSyntheticP1(h).mode).toBe("SYNTHETIC_ONLY"); expect(touches).toBe(0);
  });
  it("P116 actual expiry revokes source and allows a fresh fixture", async () => {
    const h = script("", 1048576, 20);
    await new Promise(resolve => setTimeout(resolve, 40));
    refused(() => readSyntheticP1(h), "TIME_REFUSED");
    refused(() => readSyntheticP1(h), "AUTHORITY_REFUSED");
    expect(script()).toHaveProperty("parserDisabled", true);
  });
  it("P117 reads and reservations do not renew initial deadline", async () => {
    const startedAt = trustedPerformance.now();
    const h = script("", 1048576, 1000);
    await new Promise(resolve => setTimeout(resolve, 600));
    const beforeReadAt = trustedPerformance.now();
    readSyntheticP1(h);
    reserveSyntheticP1(h, "bytes", 0, 0, 0);
    // Original lifetime expires near1000ms; renewal by the read at600ms would
    // instead remain live near1200ms. Audit the actual observation window.
    await new Promise(resolve => setTimeout(resolve, 600));
    const observedAt = trustedPerformance.now();
    const originalElapsedMs = observedAt - startedAt;
    const sinceBeforeReadMs = observedAt - beforeReadAt;
    console.info("P117 trusted timing", {startedAt, beforeReadAt, observedAt,
      originalElapsedMs, sinceBeforeReadMs, lifetimeMs: 1000});
    expect(originalElapsedMs).toBeGreaterThanOrEqual(1000);
    expect(sinceBeforeReadMs).toBeLessThan(1000);
    refused(() => scanTriviaSyntheticP1(h, 0), "TIME_REFUSED");
  });
  it("P118 primitive metadata rejection invokes no getter/proxy/clock", () => {
    let touches = 0;
    const proxy = new Proxy({}, {get() { touches++; throw Error("get"); }, ownKeys() { touches++; throw Error("keys"); }});
    for (const text of [proxy, {get length() { touches++; return 0; }}, Object(""), () => ""]) {
      refused(() => Reflect.apply(createSyntheticScriptP1, null, [text]), "SCHEMA_REFUSED");
    }
    const h = script();
    refused(() => Reflect.apply(reserveSyntheticP1, null, [h, proxy, 0, 0, 0]), "SCHEMA_REFUSED");
    refused(() => Reflect.apply(scanTriviaSyntheticP1, null, [h, proxy]), "SCHEMA_REFUSED");
    refused(() => Reflect.apply(readSyntheticP1, null, [proxy]), "AUTHORITY_REFUSED");
    expect(touches).toBe(0);
  });
  it("P119 exact arity and caller options/callbacks refuse", () => {
    const h = script();
    for (const [api, args] of [
      [createSyntheticScriptP1, ["", 1048576, 120000, {}]],
      [createSyntheticModuleP1, ["", undefined]],
      [scanTriviaSyntheticP1, [h, 0, () => 0]],
      [readSyntheticP1, [h, {}]], [retireSyntheticP1, [h, {}]],
      [reserveSyntheticP1, [h, "bytes", 0, 0, 0, {}]],
      [parserEntrySyntheticP1, [h, true]],
    ] as const) refused(() => Reflect.apply(api, null, [...args]), args[0] === "" || api === reserveSyntheticP1 || api === scanTriviaSyntheticP1 ? "SCHEMA_REFUSED" : "AUTHORITY_REFUSED");
  });
  it("P120 forged, proxied and retired handles cannot adopt authority", () => {
    const h = script(); let touches = 0;
    const proxy = new Proxy(h, {get() { touches++; return true; }});
    for (const foreign of [{...h}, {}, proxy]) refused(() => readSyntheticP1(foreign), "AUTHORITY_REFUSED");
    retire(h); refused(() => readSyntheticP1(h), "AUTHORITY_REFUSED"); expect(touches).toBe(0);
  });
  it("P121 separate fixed module instance has a foreign private brand", async () => {
    const url = new URL("../../scripts/test/guard-scanners-tip081-p1.mjs?fixture=p121", import.meta.url).href;
    const foreign = await import(/* @vite-ignore */ url);
    const h = foreign.createSyntheticScriptP1("");
    try { refused(() => readSyntheticP1(h), "AUTHORITY_REFUSED"); }
    finally { foreign.retireSyntheticP1(h); }
  });
  it("P122 single active owner and all parser/native entries remain OFF", () => {
    const h = script(); refused(() => createSyntheticModuleP1(""), "BUSY_REFUSED");
    refused(() => parserEntrySyntheticP1(h), "ALLOCATION_COVERAGE_OPEN");
    refused(() => readSyntheticP1(h), "AUTHORITY_REFUSED");
    for (const kind of ["REGEXP", "BIGINT", "CONTEXT_AMBIGUOUS"]) {
      const next = script();
      refused(() => refuseNativeLiteralP1(next, kind), kind === "CONTEXT_AMBIGUOUS" ? "ALLOCATION_COVERAGE_OPEN" : "UNSUPPORTED_BOUNDED_SYNTAX");
      refused(() => readSyntheticP1(next), "AUTHORITY_REFUSED");
    }
    expect(readSyntheticP1(script()).allocationCoverage).toBe("ALLOCATION_COVERAGE_OPEN");
  });
});

describe("P1 span scanners: literal semantics, no parser oracle", () => {
  it("P123 CRLF, CR/LF/LS/PS and block comment line facts", () => {
    const h = script(" \r\n/*a\u2028b*/\r\nX");
    expect(scanTriviaSyntheticP1(h, 0)).toMatchObject({start: 0, end: 12, lineBreak: true, comments: 1});
    expect(lineBreakAheadSyntheticP1(h, 12)).toMatchObject({lineBreak: false, end: 12, eof: false});
  });
  it("P124 fixed nonASCII whitespace and excluded U200B/U180E", () => {
    const h = script("\t\v\f\u00a0\uFEFF\u1680\u2000\u200a\u202f\u205f\u3000\u200b");
    expect(scanTriviaSyntheticP1(h, 0)).toMatchObject({end: 11, lineBreak: false}); retire(h);
    const next = script("\u180e"); expect(scanTriviaSyntheticP1(next, 0).end).toBe(0);
  });
  it("P125 iterative script legacy open and close comments", () => {
    const h = script("<!--a\n-->b\n/*c*/X");
    expect(scanTriviaSyntheticP1(h, 0)).toMatchObject({end: 16, comments: 3, lineBreak: true});
  });
  it("P126 module legacy HTML comments are never skipped", () => {
    for (const text of ["<!--x\nX", "-->x\nX"]) {
      const h = moduleFixture(text); refused(() => scanTriviaSyntheticP1(h, 0), "UNSUPPORTED_BOUNDED_SYNTAX");
    }
  });
  it("P127 EOF line comments and unterminated block comments", () => {
    const h = script("//EOF"); expect(scanTriviaSyntheticP1(h, 0)).toMatchObject({end: 5, comments: 1, lineBreak: false}); retire(h);
    const bad = script("/*unterminated"); refused(() => scanTriviaSyntheticP1(bad, 0), "UNSUPPORTED_BOUNDED_SYNTAX");
  });
  it("P128 long comments scan iteratively without recursive HTML chains", () => {
    const h = script("<!--x\n".repeat(2048) + "X");
    expect(scanTriviaSyntheticP1(h, 0)).toMatchObject({end: 12288, comments: 2048, lineBreak: true});
  });
  it("P129 raw exact strict directive at semicolon, EOF and brace", () => {
    for (const text of ['"use strict";', "'use strict'", '"use strict"}']) {
      const h = script(text); expect(strictDirectiveSyntheticP1(h, 0)).toMatchObject({status: "RAW_STRICT_DIRECTIVE", strictStart: 0, strictEnd: 12, grammarComplete: false}); retire(h);
    }
  });
  it("P130 escaped spellings are not raw strict directives", () => {
    for (const text of ['"use\\x20strict";', '"use\\u0020strict";', '"use\\\n strict";', '"use\\tstrict";']) {
      const h = script(text); expect(strictDirectiveSyntheticP1(h, 0).status).toBe("NO_RAW_STRICT_DIRECTIVE_IN_SUPPORTED_PREFIX"); retire(h);
    }
  });
  it("P131 earlier directives terminate before inspecting later raw strict", () => {
    const h = script('"other"; "use strict";');
    expect(strictDirectiveSyntheticP1(h, 0)).toMatchObject({status: "RAW_STRICT_DIRECTIVE", directives: 2, strictStart: 9, strictEnd: 21}); retire(h);
    const stopped = script('const x=0; "use strict";'); expect(strictDirectiveSyntheticP1(stopped, 0).status).toBe("NO_RAW_STRICT_DIRECTIVE_IN_SUPPORTED_PREFIX");
  });
  it("P132 line break inside comment can separate directive strings", () => {
    const h = script('"other"/*\n*/"use strict"');
    expect(strictDirectiveSyntheticP1(h, 0)).toMatchObject({status: "RAW_STRICT_DIRECTIVE", directives: 2, strictStart: 12, strictEnd: 24});
  });
  it("P133 quoted expression continuations remain OPEN rather than false strict", () => {
    for (const suffix of ["(", "[", ".", "`", "+", "-", "*", "/", "%", "<", ">", "=", "&", "|", "^", "?", ",", "!="]) {
      const h = script('"use strict"\n' + suffix + "x");
      refused(() => strictDirectiveSyntheticP1(h, 0), "UNSUPPORTED_BOUNDED_SYNTAX");
    }
  });
  it("P134 earlier continued expression cannot skip forward to strict", () => {
    const h = script('"other"+x; "use strict";'); refused(() => strictDirectiveSyntheticP1(h, 0), "UNSUPPORTED_BOUNDED_SYNTAX");
  });
  it("P135 unary ! after newline terminates; postfix ++/-- newline pinned", () => {
    for (const suffix of ["!x", "++x", "--x"]) {
      const h = script('"use strict"\n' + suffix);
      expect(strictDirectiveSyntheticP1(h, 0).status).toBe("RAW_STRICT_DIRECTIVE"); retire(h);
    }
    const h = script('"use strict"!x'); refused(() => strictDirectiveSyntheticP1(h, 0), "UNSUPPORTED_BOUNDED_SYNTAX");
  });
  it("P136 unterminated quotes/legacy escapes never skip to later strict", () => {
    for (const text of ['"broken\n"use strict";', '"broken', '"\\1"; "use strict";']) {
      const h = script(text); refused(() => strictDirectiveSyntheticP1(h, 0), "UNSUPPORTED_BOUNDED_SYNTAX");
    }
  });
  it("P137 ASCII identifiers have full boundary and escaped words stay distinct", () => {
    const h = script("asyncValue "); expect(identifierAheadSyntheticP1(h, 0)).toMatchObject({end: 10, keyword: "OTHER", containsEscape: false}); retire(h);
    const escaped = script("as\\u0079nc("); expect(identifierAheadSyntheticP1(escaped, 0)).toMatchObject({end: 10, keyword: "ESCAPED_WORD", containsEscape: true}); retire(escaped);
    const letWord = script("let;"); expect(identifierAheadSyntheticP1(letWord, 0)).toMatchObject({end: 3, keyword: "LET"});
  });
  it("P138 braced ASCII escapes, dollar/underscore and digit-start", () => {
    const h = script("\\u{61}bc_9$"); expect(identifierAheadSyntheticP1(h, 0)).toMatchObject({end: 11, keyword: "ESCAPED_WORD"}); retire(h);
    const digit = script("9abc"); expect(identifierAheadSyntheticP1(digit, 0)).toMatchObject({status: "NO_IDENTIFIER", end: 0});
  });
  it("P139 Unicode boundaries and invalid escaped IDStart honestly refuse", () => {
    for (const text of ["é", "aé", "\\u00e9", "\\u0030abc", "\\u{}", "\\u0x00", "a\\x61"]) {
      const h = script(text); refused(() => identifierAheadSyntheticP1(h, 0), "UNSUPPORTED_BOUNDED_SYNTAX");
    }
  });
  it("P140 padding at checkpoint boundaries preserves classification/spans", () => {
    for (const count of [63, 64, 65, 127, 128, 129]) {
      const h = script(" ".repeat(count) + '"use strict";');
      expect(strictDirectiveSyntheticP1(h, 0)).toMatchObject({status: "RAW_STRICT_DIRECTIVE", strictStart: count, strictEnd: count + 12}); retire(h);
    }
  });
  it("P141 ASI lookahead reports facts only, closing brace/EOF separately", () => {
    const h = script("\r\n}"); expect(lineBreakAheadSyntheticP1(h, 0)).toMatchObject({end: 2, lineBreak: true, closingBrace: true, eof: false}); retire(h);
    const eof = script("\u2029"); expect(lineBreakAheadSyntheticP1(eof, 0)).toMatchObject({end: 1, lineBreak: true, eof: true});
  });
  it("P142 position exact EOF, +1 and noninteger metadata refuse", () => {
    const h = script("x"); expect(scanTriviaSyntheticP1(h, 1).end).toBe(1);
    refused(() => scanTriviaSyntheticP1(h, 2), "SCHEMA_REFUSED");
    refused(() => readSyntheticP1(h), "AUTHORITY_REFUSED");
    refused(() => identifierAheadSyntheticP1(h, -0), "SCHEMA_REFUSED");
  });
  it("P143 in/instanceof continuation uses full identifier boundary", () => {
    for (const suffix of ["in obj", "instanceof X", "\\u0069n obj"]) {
      const h = script('"use strict"\n' + suffix);
      refused(() => strictDirectiveSyntheticP1(h, 0), "UNSUPPORTED_BOUNDED_SYNTAX");
    }
    for (const suffix of ["inside", "instanceofX"]) {
      const h = script('"use strict"\n' + suffix);
      expect(strictDirectiveSyntheticP1(h, 0).status).toBe("RAW_STRICT_DIRECTIVE"); retire(h);
    }
  });
  it("P144 captured WeakMap operations do not expose private owner rows", () => {
    const h = script("private fixture"); let touches = 0;
    const originalGet = WeakMap.prototype.get, originalSet = WeakMap.prototype.set, originalDelete = WeakMap.prototype.delete;
    let q: ReturnType<typeof readSyntheticP1> | undefined;
    try {
      WeakMap.prototype.get = function(key) { touches++; return originalGet.call(this, key); };
      WeakMap.prototype.set = function(key, value) { touches++; return originalSet.call(this, key, value); };
      WeakMap.prototype.delete = function(key) { touches++; return originalDelete.call(this, key); };
      q = readSyntheticP1(h); retire(h);
    } finally { WeakMap.prototype.get = originalGet; WeakMap.prototype.set = originalSet; WeakMap.prototype.delete = originalDelete; }
    expect(touches).toBe(0); expect(q?.parserDisabled).toBe(true);
  });
  it("P145 absolute-zero hashbang is skipped without losing strictness", () => {
    for (const create of [script, moduleFixture]) {
      const h = create('#!x\n"use strict";');
      expect(strictDirectiveSyntheticP1(h, 0)).toMatchObject({status: "RAW_STRICT_DIRECTIVE", strictStart: 4, strictEnd: 16}); retire(h);
    }
  });
  it("P146 fresh creation cleans up a lost expired owner", async () => {
    const h = script("expired retained text", 1048576, 20);
    await new Promise(resolve => setTimeout(resolve, 40));
    const next = script("fresh");
    refused(() => readSyntheticP1(h), "AUTHORITY_REFUSED");
    expect(readSyntheticP1(next).mode).toBe("SYNTHETIC_ONLY");
  });
  it("P147 ambiguous HTML close context refuses rather than acting as no-match", () => {
    const h = script("x -->suffix");
    refused(() => scanTriviaSyntheticP1(h, 2), "UNSUPPORTED_BOUNDED_SYNTAX");
  });
  it("P148 captured actual perf_hooks.now survives replacement", () => {
    let touches = 0;
    const spy = vi.spyOn(trustedPerformance, "now").mockImplementation(() => { touches++; return 0; });
    let disabled: boolean | undefined;
    try { const h = script(); disabled = readSyntheticP1(h).parserDisabled; retire(h); }
    finally { spy.mockRestore(); }
    expect(touches).toBe(0); expect(disabled).toBe(true);
  });
  it("P149 captured numeric functions and maximum survive global Number replacement", () => {
    vi.stubGlobal("Number", () => { throw Error("untrusted Number"); });
    let debit: number | undefined;
    try { const h = script(); reserveSyntheticP1(h, "string", 10, 20, 1); debit = readSyntheticP1(h).producerBytes; retire(h); }
    finally { vi.unstubAllGlobals(); }
    expect(debit).toBe(124);
  });
  it("P150 comment-line operator continuations and known HTML-gap states", () => {
    for (const operator of ["in obj", "instanceof X"]) {
      const h = script('"use strict"/*\n*/' + operator);
      refused(() => strictDirectiveSyntheticP1(h, 0), "UNSUPPORTED_BOUNDED_SYNTAX");
    }
    const gap = script("x\n/*c*/-->tail\nz");
    expect(scanTriviaSyntheticP1(gap, 1)).toMatchObject({end: 15, comments: 2, lineBreak: true});
    retire(gap);
    const ambiguous = script("x\n/*c*/-->tail\nz");
    refused(() => scanTriviaSyntheticP1(ambiguous, 7), "UNSUPPORTED_BOUNDED_SYNTAX");
  });
});
