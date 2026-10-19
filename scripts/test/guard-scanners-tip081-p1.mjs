// P1 fixture building blocks only. No parser, source authority, AST or native literal.
import {performance as monotonicPerformance} from "node:perf_hooks";

// G00: fixed logical module reserve is declared BEFORE the fixed tables/maps/binds.
// This is an accounting convention, not a V8 allocation/RSS bound.
const MODULE_BYTES = 65536;
const now = monotonicPerformance.now.bind(monotonicPerformance);
const codeAt = Function.prototype.call.bind(String.prototype.charCodeAt);
const safeInteger = Number.isSafeInteger;
const finite = Number.isFinite;
const is = Object.is;
const freeze = Object.freeze;
const maximumInteger = Number.MAX_SAFE_INTEGER;
const weakGet = Function.prototype.call.bind(WeakMap.prototype.get);
const weakSet = Function.prototype.call.bind(WeakMap.prototype.set);
const weakDelete = Function.prototype.call.bind(WeakMap.prototype.delete);
const owners = new WeakMap();
let active = null;
const refusals = freeze({
  SCHEMA_REFUSED: freeze({code: "SCHEMA_REFUSED", parserDisabled: true}),
  AUTHORITY_REFUSED: freeze({code: "AUTHORITY_REFUSED", parserDisabled: true}),
  BUSY_REFUSED: freeze({code: "BUSY_REFUSED", parserDisabled: true}),
  CAP_REFUSED: freeze({code: "CAP_REFUSED", parserDisabled: true}),
  NODE_REFUSED: freeze({code: "NODE_REFUSED", parserDisabled: true}),
  ENTRY_REFUSED: freeze({code: "ENTRY_REFUSED", parserDisabled: true}),
  DEPTH_REFUSED: freeze({code: "DEPTH_REFUSED", parserDisabled: true}),
  TIME_REFUSED: freeze({code: "TIME_REFUSED", parserDisabled: true}),
  UNSUPPORTED_BOUNDED_SYNTAX: freeze({code: "UNSUPPORTED_BOUNDED_SYNTAX", parserDisabled: true}),
  ALLOCATION_COVERAGE_OPEN: freeze({code: "ALLOCATION_COVERAGE_OPEN", parserDisabled: true}),
});
export const P1_LIMITS = freeze({moduleBytes: MODULE_BYTES, stateBytes: 4096,
  scratchBytes: 8192, errorBytes: 4096, outputRecordBytes: 1024,
  maximumBytes: 67108864, defaultBytes: 1048576, nodes: 200000,
  entries: 20000, depth: 128, lifetimeMs: 120000, checkpointOperations: 64});

function unsigned(n) { return typeof n === "number" && safeInteger(n) && n >= 0 && !is(n, -0); }
/** @returns {never} */
function fail(code) { throw refusals[code]; }
function dispose(s) { s.text = null; weakDelete(owners, active); active = null; s.phase = "RETIRED"; }
/** @returns {never} */
function abort(s, code) { dispose(s); fail(code); }
function timed(s) {
  const t = now();
  if (!finite(t) || t < s.lastNow || t - s.started >= s.ttl) abort(s, "TIME_REFUSED");
  s.lastNow = t;
}
function owner(handle, checkTime = true) {
  // WeakMap.get does not invoke proxy/getter/coercion hooks; no reflection occurs.
  if (handle === null || typeof handle !== "object" || handle !== active) fail("AUTHORITY_REFUSED");
  const s = weakGet(owners, handle);
  if (!s) fail("AUTHORITY_REFUSED");
  if (checkTime) timed(s);
  return s;
}
function producer(handle) {
  const s = owner(handle);
  if (s.phase !== "PRODUCER") abort(s, "AUTHORITY_REFUSED");
  return s;
}
function tick(s) {
  s.operations++;
  if (s.operations === 64) { s.operations = 0; timed(s); }
}
function add(s, a, b) {
  if (!unsigned(a) || !unsigned(b) || b > maximumInteger - a) abort(s, "CAP_REFUSED");
  return a + b;
}
function multiply(s, a, b) {
  if (!unsigned(a) || !unsigned(b) || (a !== 0 && b > maximumInteger / a)) abort(s, "CAP_REFUSED");
  const product = a * b;
  if (!unsigned(product)) abort(s, "CAP_REFUSED");
  return product;
}
function debit(s, category, bytes) {
  timed(s);
  if (!unsigned(bytes) || bytes > s.limit - s.total) abort(s, "CAP_REFUSED");
  s.total += bytes;
  if (category === "producer") s.producerBytes += bytes;
  else if (category === "replay") s.replayBytes += bytes;
  else s.outputBytes += bytes;
  // Monotone total includes old backing, discarded work and retired reservations.
}
function counters(s, nodes, entries, depth) {
  if (nodes > 200000 - s.nodes) abort(s, "NODE_REFUSED");
  if (entries > 20000 - s.entries) abort(s, "ENTRY_REFUSED");
  if (depth > 128) abort(s, "DEPTH_REFUSED");
}
function create(text, cap, ttl, mode) {
  if (typeof text !== "string" || !unsigned(cap) || cap > 67108864 ||
      !unsigned(ttl) || ttl < 1 || ttl > 120000) fail("SCHEMA_REFUSED");
  if (active !== null) {
    const previous = weakGet(owners, active), t = now();
    if (!finite(t) || t < previous.lastNow) abort(previous, "TIME_REFUSED");
    if (t - previous.started < previous.ttl) fail("BUSY_REFUSED");
    dispose(previous); // Expired lost handles cannot pin an owner across creation.
  }
  // G01: reserve fixed owner/schema/WeakMap row/opaque handle, helper-frame scratch,
  // error/output reserve and BOTH caller+retained UTF16 string payloads first.
  const base = 65536 + 4096 + 8192 + 4096;
  if (cap < base || text.length > (cap - base) / 4) fail("CAP_REFUSED");
  const total = base + text.length * 4;
  const started = now();
  if (!finite(started)) fail("TIME_REFUSED");
  const s = {text, mode, limit: cap, ttl, started, lastNow: started, total,
    producerBytes: 0, replayBytes: 0, unreclaimedProducerBytes: 0, outputBytes: 0,
    nodes: 0, entries: 0, depth: 0, phase: "PRODUCER", operations: 0,
    triviaLine: false, triviaComments: 0, identifierKeyword: "OTHER", identifierEscape: false,
    escapeValue: 0, escapeEnd: 0, quoteRawStrict: false};
  const handle = freeze({purpose: "TIP081_P1_SYNTHETIC_ONLY", parserDisabled: true});
  weakSet(owners, handle, s); active = handle;
  timed(s);
  return handle;
}
export function createSyntheticScriptP1(text, cap = 1048576, ttl = 120000) {
  if (arguments.length < 1 || arguments.length > 3 ||
      (arguments.length > 1 && typeof arguments[1] !== "number") ||
      (arguments.length > 2 && typeof arguments[2] !== "number")) fail("SCHEMA_REFUSED");
  return create(text, cap, ttl, "SCRIPT");
}
export function createSyntheticModuleP1(text, cap = 1048576, ttl = 120000) {
  if (arguments.length < 1 || arguments.length > 3 ||
      (arguments.length > 1 && typeof arguments[1] !== "number") ||
      (arguments.length > 2 && typeof arguments[2] !== "number")) fail("SCHEMA_REFUSED");
  return create(text, cap, ttl, "MODULE");
}

// Scalar cost probes model proposed allocations; no actual AST/list/map is made.
export function reserveSyntheticP1(handle, kind, a, b, c) {
  if (arguments.length !== 5 || typeof kind !== "string" || !unsigned(a) || !unsigned(b) || !unsigned(c)) fail("SCHEMA_REFUSED");
  if (kind !== "bytes" && kind !== "array" && kind !== "dictionary" && kind !== "string" && kind !== "node" && kind !== "frame") fail("SCHEMA_REFUSED");
  const s = producer(handle);
  let bytes, nodes = 0, entries = 0, depth = 0;
  if (kind === "bytes") { bytes = a; nodes = b; entries = c; }
  else if (kind === "array") { // G02: header + BOTH old/new backing + resize record.
    if (b < a || c > b) abort(s, "SCHEMA_REFUSED");
    bytes = add(s, 88, multiply(s, add(s, a, b), 8)); entries = c;
  } else if (kind === "dictionary") { // G03: key payload/header + map header/rows/fanout slots.
    bytes = add(s, add(s, 96, multiply(s, a, 2)), add(s, multiply(s, b, 32), multiply(s, c, 8))); entries = add(s, b, c);
  } else if (kind === "string") { // G04: each attempted old+new string retained in debit.
    bytes = multiply(s, add(s, 64, multiply(s, add(s, a, b), 2)), c);
  } else if (kind === "node") { // G05: node header/schema; count/depth conjunctive.
    bytes = multiply(s, add(s, 80, multiply(s, a, 16)), b); nodes = b; depth = c;
  } else { // G06: helper frame header/schema, independent helper depth.
    bytes = add(s, 64, b); entries = c; depth = a;
  }
  counters(s, nodes, entries, depth);
  debit(s, "producer", bytes);
  s.nodes += nodes; s.entries += entries; if (depth > s.depth) s.depth = depth;
  return true;
}
export function retireProducerSyntheticP1(handle) {
  if (arguments.length !== 1) fail("AUTHORITY_REFUSED");
  const s = producer(handle);
  s.unreclaimedProducerBytes += s.producerBytes; s.producerBytes = 0; s.phase = "PRODUCER_RETIRED";
  return true;
}
export function reserveReplaySyntheticP1(handle, bytes) {
  if (arguments.length !== 2 || !unsigned(bytes)) fail("SCHEMA_REFUSED");
  const s = owner(handle);
  if (s.phase !== "PRODUCER_RETIRED" && s.phase !== "REPLAY_RESERVATION") abort(s, "AUTHORITY_REFUSED");
  debit(s, "replay", bytes); s.phase = "REPLAY_RESERVATION";
  return true;
}
export function readSyntheticP1(handle) {
  if (arguments.length !== 1) fail("AUTHORITY_REFUSED");
  const s = owner(handle);
  debit(s, "output", 1024); // G07 BEFORE bounded metadata record creation.
  return freeze({mode: "SYNTHETIC_ONLY", profile: s.mode, parserDisabled: true,
    phase: s.phase, limit: s.limit, totalBytes: s.total, producerBytes: s.producerBytes,
    unreclaimedProducerBytes: s.unreclaimedProducerBytes, replayBytes: s.replayBytes,
    outputBytes: s.outputBytes, nodes: s.nodes, entries: s.entries, depth: s.depth,
    allocationCoverage: "ALLOCATION_COVERAGE_OPEN"});
}
export function retireSyntheticP1(handle) {
  if (arguments.length !== 1) fail("AUTHORITY_REFUSED");
  const s = owner(handle, false); dispose(s); return "SYNTHETIC_OWNER_RETIRED";
}
export function parserEntrySyntheticP1(handle) {
  if (arguments.length !== 1) fail("AUTHORITY_REFUSED");
  abort(owner(handle), "ALLOCATION_COVERAGE_OPEN");
}
export function refuseNativeLiteralP1(handle, kind) {
  if (arguments.length !== 2 || typeof kind !== "string" ||
      (kind !== "REGEXP" && kind !== "BIGINT" && kind !== "CONTEXT_AMBIGUOUS")) fail("SCHEMA_REFUSED");
  const s = owner(handle);
  // Caller-selected fixture entry, NOT a token/context detector.
  abort(s, kind === "CONTEXT_AMBIGUOUS" ? "ALLOCATION_COVERAGE_OPEN" : "UNSUPPORTED_BOUNDED_SYNTAX");
}

function position(s, start) {
  if (!unsigned(start) || start > s.text.length) abort(s, "SCHEMA_REFUSED");
}
function line(c) { return c === 10 || c === 13 || c === 8232 || c === 8233; }
function space(c) { return c === 9 || c === 11 || c === 12 || c === 32 || c === 160 ||
  c === 5760 || (c >= 8192 && c <= 8202) || c === 8239 || c === 8287 || c === 12288 || c === 65279; }
function at(s, i) { tick(s); return codeAt(s.text, i); }
function startOfLine(s, i) {
  while (i > 0) { const c = at(s, --i); if (line(c)) return true; if (!space(c)) return false; }
  return true;
}
function trivia(s, start) {
  s.triviaLine = false; s.triviaComments = 0;
  let i = start;
  while (i < s.text.length) {
    const c = at(s, i);
    if (space(c)) { i++; continue; }
    if (line(c)) { s.triviaLine = true; i++; if (c === 13 && at(s, i) === 10) i++; continue; }
    let comment = 0, width = 2;
    if (i === 0 && c === 35 && at(s, i + 1) === 33) comment = 1;
    else if (c === 47 && at(s, i + 1) === 47) comment = 1;
    else if (c === 47 && at(s, i + 1) === 42) comment = 2;
    else if (c === 60 && at(s, i + 1) === 33 && at(s, i + 2) === 45 && at(s, i + 3) === 45) { comment = 1; width = 4; }
    else if (c === 45 && at(s, i + 1) === 45 && at(s, i + 2) === 62) {
      if (start !== 0 && !s.triviaLine && !startOfLine(s, i)) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
      comment = 1; width = 3;
    }
    if (comment === 0) break;
    if (width !== 2 && s.mode === "MODULE") abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
    s.triviaComments++;
    i += width;
    if (comment === 1) { while (i < s.text.length && !line(at(s, i))) i++; continue; }
    let closed = false;
    while (i < s.text.length) {
      const q = at(s, i++);
      if (line(q)) s.triviaLine = true;
      if (q === 42 && at(s, i) === 47) { i++; closed = true; break; }
    }
    if (!closed) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
  }
  timed(s); return i;
}
export function scanTriviaSyntheticP1(handle, start) {
  if (arguments.length !== 2 || !unsigned(start)) fail("SCHEMA_REFUSED");
  const s = producer(handle); position(s, start); debit(s, "output", 1024);
  const end = trivia(s, start);
  return freeze({mode: "SYNTHETIC_ONLY", parserDisabled: true, status: "TRIVIA_SPAN",
    start, end, lineBreak: s.triviaLine, comments: s.triviaComments});
}
export function lineBreakAheadSyntheticP1(handle, start) {
  if (arguments.length !== 2 || !unsigned(start)) fail("SCHEMA_REFUSED");
  const s = producer(handle); position(s, start); debit(s, "output", 1024);
  const end = trivia(s, start);
  return freeze({mode: "SYNTHETIC_ONLY", parserDisabled: true, status: "ASI_LOOKAHEAD_ONLY",
    start, end, lineBreak: s.triviaLine, eof: end === s.text.length, closingBrace: at(s, end) === 125});
}
function idStart(c) { return c === 36 || c === 95 || (c >= 65 && c <= 90) || (c >= 97 && c <= 122); }
function idContinue(c) { return idStart(c) || (c >= 48 && c <= 57); }
function hex(c) { return c >= 48 && c <= 57 ? c - 48 : c >= 65 && c <= 70 ? c - 55 : c >= 97 && c <= 102 ? c - 87 : -1; }
function escapeASCII(s, slash) {
  if (at(s, slash + 1) !== 117) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
  let i = slash + 2, value = 0;
  if (at(s, i) === 123) {
    i++; let digits = 0;
    while (i < s.text.length && at(s, i) !== 125) {
      const d = hex(at(s, i++)); if (d < 0 || ++digits > 6) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
      value = value * 16 + d;
    }
    if (digits === 0 || at(s, i) !== 125) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
    i++;
  } else {
    for (let n = 0; n < 4; n++) { const d = hex(at(s, i++)); if (d < 0) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX"); value = value * 16 + d; }
  }
  if (value > 127) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
  // Fixed scratch fields, no decoded source string or temporary record.
  s.escapeValue = value; s.escapeEnd = i;
}
function identifier(s, start) {
  let i = start, n = 0, mask = 31; s.identifierEscape = false;
  while (i < s.text.length) {
    let c = at(s, i), next = i + 1;
    if (c === 92) { escapeASCII(s, i); c = s.escapeValue; next = s.escapeEnd; s.identifierEscape = true; }
    else if (c >= 128) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
    if (!(n === 0 ? idStart(c) : idContinue(c))) {
      if (next !== i + 1) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
      break;
    }
    if (n >= 3 || c !== codeAt("let", n)) mask &= ~1;
    if (n >= 5 || c !== codeAt("async", n)) mask &= ~2;
    if (n >= 8 || c !== codeAt("function", n)) mask &= ~4;
    if (n >= 2 || c !== codeAt("in", n)) mask &= ~8;
    if (n >= 10 || c !== codeAt("instanceof", n)) mask &= ~16;
    n++; i = next;
  }
  s.identifierKeyword = s.identifierEscape ? "ESCAPED_WORD" : n === 3 && (mask & 1) ? "LET" : n === 5 && (mask & 2) ? "ASYNC" : n === 8 && (mask & 4) ? "FUNCTION" : n === 2 && (mask & 8) ? "IN" : n === 10 && (mask & 16) ? "INSTANCEOF" : "OTHER";
  timed(s); return i;
}
export function identifierAheadSyntheticP1(handle, start) {
  if (arguments.length !== 2 || !unsigned(start)) fail("SCHEMA_REFUSED");
  const s = producer(handle); position(s, start); debit(s, "output", 1024);
  const end = identifier(s, start);
  return freeze({mode: "SYNTHETIC_ONLY", parserDisabled: true, status: end === start ? "NO_IDENTIFIER" : "ASCII_IDENTIFIER_SPAN",
    start, end, keyword: s.identifierKeyword, containsEscape: s.identifierEscape});
}
function quoted(s, start) {
  const quote = at(s, start); let i = start + 1, rawStrict = true, n = 0;
  while (i < s.text.length) {
    const c = at(s, i++);
    if (c === quote) { s.quoteRawStrict = rawStrict && n === 10; return i; }
    if (line(c)) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
    if (c === 92) {
      rawStrict = false; const e = at(s, i++);
      if (!finite(e)) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
      if (e === 13 && at(s, i) === 10) i++;
      // We need only raw spelling; ambiguous legacy/octal escapes refuse.
      else if (e >= 48 && e <= 57) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
      else if (e === 117) { escapeASCII(s, i - 2); i = s.escapeEnd; }
      else if (e === 120) {
        for (let k = 0; k < 2; k++) if (hex(at(s, i++)) < 0) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
      }
    } else { if (n >= 10 || c !== codeAt("use strict", n)) rawStrict = false; }
    n++;
  }
  abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
}
function continuation(c) {
  return c === 40 || c === 91 || c === 46 || c === 96 || c === 43 || c === 45 ||
    c === 42 || c === 47 || c === 37 || c === 60 || c === 62 || c === 61 || c === 38 ||
    c === 124 || c === 94 || c === 63 || c === 44;
}
export function strictDirectiveSyntheticP1(handle, start) {
  if (arguments.length !== 2 || !unsigned(start)) fail("SCHEMA_REFUSED");
  const s = producer(handle); position(s, start); debit(s, "output", 1024);
  let i = trivia(s, start), directives = 0, found = false, strictStart = -1, strictEnd = -1;
  while (i < s.text.length) {
    const c = at(s, i);
    if (c !== 34 && c !== 39) {
      if (c >= 128 || c === 92 || c === 96 || c === 47) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
      break;
    }
    const literalStart = i, literalEnd = quoted(s, i), rawStrict = s.quoteRawStrict;
    i = trivia(s, literalEnd);
    const next = at(s, i), hasLine = s.triviaLine;
    if (idStart(next) || next === 92 || next >= 128) {
      identifier(s, i);
      if (s.identifierKeyword === "IN" || s.identifierKeyword === "INSTANCEOF" || s.identifierEscape) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
    }
    const postfixNewline = hasLine && (next === 43 || next === 45) && at(s, i + 1) === next;
    if (next === 33 && at(s, i + 1) === 61) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
    if (continuation(next) && !postfixNewline) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
    if (next !== 59 && next !== 125 && i !== s.text.length && !hasLine) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
    directives++;
    if (rawStrict) { found = true; strictStart = literalStart; strictEnd = literalEnd; break; }
    if (next === 59) i = trivia(s, i + 1);
    else if (next === 125 || i === s.text.length) break;
    // A second quote after ASI is another directive; other tokens end the prologue.
  }
  timed(s);
  return freeze({mode: "SYNTHETIC_ONLY", parserDisabled: true, status: found ? "RAW_STRICT_DIRECTIVE" : "NO_RAW_STRICT_DIRECTIVE_IN_SUPPORTED_PREFIX",
    start, end: i, directives, strictStart, strictEnd, grammarComplete: false});
}
