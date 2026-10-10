// P2 prerequisite ONLY: actual private allocation exercises, NOT a grammar/parser.
// Every grammar entry remains disabled. No Acorn import, AST/source getter or hooks.
import {performance as monotonicPerformance} from "node:perf_hooks";

// A00: fixed trusted-module logical reserve precedes tables/binds below.
// This is P1's declared logical convention, never native/VM/RSS isolation.
const MODULE_BYTES = 65536;
const now = monotonicPerformance.now.bind(monotonicPerformance);
const codeAt = Function.prototype.call.bind(String.prototype.charCodeAt);
const slice = Function.prototype.call.bind(String.prototype.slice);
const fromCode = String.fromCharCode;
const ArrayConstructor = Array;
const createDictionary = Object.create;
const setPrototype = Object.setPrototypeOf;
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const freeze = Object.freeze;
const safeInteger = Number.isSafeInteger;
const finite = Number.isFinite;
const is = Object.is;
const maximumInteger = Number.MAX_SAFE_INTEGER;
const weakGet = Function.prototype.call.bind(WeakMap.prototype.get);
const weakSet = Function.prototype.call.bind(WeakMap.prototype.set);
const weakDelete = Function.prototype.call.bind(WeakMap.prototype.delete);
const owners = new WeakMap();
let active = null;
const refusals = freeze({
  SCHEMA_REFUSED: freeze({code: "SCHEMA_REFUSED", parserDisabled: true}),
  MODE_OPEN: freeze({code: "MODE_OPEN", parserDisabled: true}),
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
export const P2_KERNEL_STATUS = freeze({
  purpose: "TIP081_P2_PRIVATE_ALLOCATION_EXERCISES_ONLY",
  parserDisabled: true,
  grammarImplemented: false,
  occurrenceCoverageComplete: false,
  adapterPin: "NOT_ISSUED",
  inventoryPin: "NOT_ISSUED",
  grammarSourcePin: "3c141146168735659c30b29c925fbf9fdf4d12ad85eb83d68e2afb26a1cc248d",
  grammarPackagePin: "aa6eff9593179bc7379017992eda314ce97bd7c6576869d82d514139ce612cca",
  maximumBytes: 67108864,
  maximumNodes: 200000,
  maximumEntries: 20000,
  maximumScopeDepth: 128,
  maximumLifetimeMs: 120000,
});

function unsigned(n) {
  return typeof n === "number" && safeInteger(n) && n >= 0 && !is(n, -0);
}
/** @returns {never} */
function fail(code) { throw refusals[code]; }
function dispose(s) {
  // A15: fixed fields only. Removal of references NEVER refunds a debit.
  s.text = null;
  s.root = null;
  weakDelete(owners, active);
  active = null;
  s.phase = "RETIRED";
}
/** @returns {never} */
function abort(s, code) { dispose(s); fail(code); }
function timed(s) {
  const t = now();
  if (!finite(t) || t < s.lastNow || t - s.started >= s.ttl) abort(s, "TIME_REFUSED");
  s.lastNow = t;
}
function tick(s) {
  if (++s.operations === 64) { s.operations = 0; timed(s); }
}
function owner(handle, checkTime = true) {
  if (handle === null || typeof handle !== "object" || handle !== active) fail("AUTHORITY_REFUSED");
  const s = weakGet(owners, handle);
  if (!s) fail("AUTHORITY_REFUSED");
  if (checkTime) timed(s);
  return s;
}
function plus(s, a, b) {
  if (!unsigned(a) || !unsigned(b) || b > maximumInteger - a) abort(s, "CAP_REFUSED");
  return a + b;
}
function times(s, a, b) {
  if (!unsigned(a) || !unsigned(b) || (a !== 0 && b > maximumInteger / a)) abort(s, "CAP_REFUSED");
  const product = a * b;
  if (!unsigned(product)) abort(s, "CAP_REFUSED");
  return product;
}
function guard(s, bytes, nodes = 0, entries = 0, depth = 0) {
  timed(s);
  if (!unsigned(bytes) || !unsigned(nodes) || !unsigned(entries) || !unsigned(depth)) abort(s, "CAP_REFUSED");
  if (bytes > s.limit - s.total) abort(s, "CAP_REFUSED");
  if (nodes > 200000 - s.nodes) abort(s, "NODE_REFUSED");
  if (entries > 20000 - s.entries) abort(s, "ENTRY_REFUSED");
  if (depth > 128) abort(s, "DEPTH_REFUSED");
  s.total += bytes;
  s.producerBytes += bytes;
  s.nodes += nodes;
  s.entries += entries;
  if (depth > s.scopeDepth) s.scopeDepth = depth;
}
function schema(s) {
  // A03: one attempted slot mutation costs16, including overwrite/delete.
  // Engine hidden-class transitions are outside this logical convention.
  guard(s, 16);
  s.schemaMutations++;
}
function retainRoot(s, root, kind) {
  schema(s); // old root reservation survives replacement/abandonment.
  s.root = root;
  // Fixed precharged control-state literal, not an allocated payload/reference.
  s.rootKind = kind;
}

export function createAllocationFixtureP2(text, profile, cap, ttl) {
  if (arguments.length !== 4 || typeof text !== "string" || typeof profile !== "string" ||
      !unsigned(cap) || cap > 67108864 || !unsigned(ttl) || ttl < 1 || ttl > 120000) fail("SCHEMA_REFUSED");
  if (profile !== "SCRIPT" && profile !== "MODULE") fail("MODE_OPEN");
  if (active !== null) {
    const previous = weakGet(owners, active), t = now();
    if (!finite(t) || t < previous.lastNow) abort(previous, "TIME_REFUSED");
    if (t - previous.started < previous.ttl) fail("BUSY_REFUSED");
    dispose(previous);
  }
  // A01: P1 base+both caller/retained immutable UTF16 payload conventions.
  // No claim that retaining a primitive string physically clones its backing.
  const base = MODULE_BYTES + 4096 + 8192 + 4096;
  if (cap < base || text.length > (cap - base) / 4) fail("CAP_REFUSED");
  const total = base + text.length * 4, started = now();
  if (!finite(started)) fail("TIME_REFUSED");
  const s = {text, profile, limit: cap, ttl, started, lastNow: started, total,
    producerBytes: 0, outputBytes: 0, nodes: 0, entries: 0, scopeDepth: 0,
    phase: "ALLOCATIONS_ONLY", operations: 0, root: null, rootKind: "NONE",
    arrays: 0, dictionaryRows: 0, stringOperations: 0, schemaMutations: 0,
    fixtures: 0};
  const handle = freeze({purpose: "TIP081_P2_SYNTHETIC_KERNEL_ONLY", parserDisabled: true});
  weakSet(owners, handle, s);
  active = handle;
  timed(s);
  return handle;
}

function node(s, start, end) {
  // A02: actual Node-shaped record, five fixed fields; P1 G05=80+16*5.
  guard(s, 160, 1);
  return {__proto__: null, type: "FixtureNode", start, end, left: null, right: null};
}
function copyNode(s, original) {
  const copied = node(s, 0, 0); // Defaults remain permanently charged.
  // A04: overwrite each copied slot BEFORE mutation; only closed private fields.
  schema(s); copied.type = original.type;
  schema(s); copied.start = original.start;
  schema(s); copied.end = original.end;
  schema(s); copied.left = original.left;
  schema(s); copied.right = original.right;
  return copied;
}
function nodeScenario(s, count) {
  const root = node(s, 0, 0);
  retainRoot(s, root, "NODE_COPY_SCHEMA");
  for (let i = 0; i < count; i++) {
    tick(s);
    const copied = copyNode(s, root);
    // A05: successful add/rewrite/delete and abandoned shape reservation.
    schema(s); copied.operator = "+";
    schema(s); copied.type = "FixtureAssignmentPattern";
    schema(s); delete copied.operator;
    schema(s); root.right = copied;
  }
}
function list(s) {
  // A06: actual list controller plus actual empty backing, independently guarded.
  guard(s, 112);
  guard(s, 88);
  const items = new ArrayConstructor(0);
  // A16: remove inherited numeric setters BEFORE private values enter backing.
  schema(s); setPrototype(items, null);
  s.arrays++;
  return {__proto__: null, items, capacity: 0, length: 0};
}
function append(s, target, value) {
  if (target.length === target.capacity) {
    const oldCapacity = target.capacity;
    const newCapacity = oldCapacity === 0 ? 1 : times(s, oldCapacity, 2);
    // A07: exact P1 G02 convention, both old+new backing without refund.
    guard(s, plus(s, 88, times(s, plus(s, oldCapacity, newCapacity), 8)));
    const items = new ArrayConstructor(newCapacity);
    schema(s); setPrototype(items, null);
    s.arrays++;
    for (let i = 0; i < newCapacity; i++) { tick(s); items[i] = i < target.length ? target.items[i] : undefined; }
    schema(s); target.items = items;
    schema(s); target.capacity = newCapacity;
  }
  // A08: backing bytes already reserved; new occupied slot has independent entry cap.
  guard(s, 0, 0, 1);
  target.items[target.length] = value;
  schema(s); target.length++;
}
function arrayScenario(s, count) {
  const target = list(s);
  retainRoot(s, target, "ARRAY_RESIZE");
  for (let i = 0; i < count; i++) { tick(s); append(s, target, node(s, i, i + 1)); }
}
function sourceSlice(s, start, end) {
  if (!unsigned(start) || !unsigned(end) || start > end || end > s.text.length) abort(s, "SCHEMA_REFUSED");
  // A09: actual derived slice, P1 G04 old=0/new=end-start/attempts=1.
  guard(s, plus(s, 64, times(s, end - start, 2)));
  s.stringOperations++;
  return slice(s.text, start, end);
}
function scope(s, parent, depth) {
  // A10: actual five-field scope, three independently guarded binding arrays/map.
  guard(s, 144, 0, 0, depth);
  const varNames = list(s), lexicalNames = list(s), functionNames = list(s);
  guard(s, 64);
  const dictionary = createDictionary(null);
  return {__proto__: null, parent, varNames, lexicalNames, functionNames, dictionary};
}
function insertName(s, target, key) {
  if (hasOwn(target.dictionary, key)) abort(s, "SCHEMA_REFUSED");
  // A11: P1 G03 key/header+one row+one aliased value/fanout slot.
  // Shared key payload is deliberately re-reserved; no interning credit.
  guard(s, plus(s, 136, times(s, key.length, 2)), 0, 2);
  target.dictionary[key] = key;
  s.dictionaryRows++;
  append(s, target.varNames, key); // actual additional slot per enclosing scope.
}
function scopeScenario(s, count) {
  if (count > 128) abort(s, "DEPTH_REFUSED");
  const key = sourceSlice(s, 0, s.text.length);
  let current = null;
  for (let i = 0; i < count; i++) { tick(s); current = scope(s, current, i + 1); }
  retainRoot(s, current, "SCOPE_MAP_FANOUT");
  for (let currentScope = current; currentScope !== null; currentScope = currentScope.parent) {
    tick(s); insertName(s, currentScope, key);
  }
}
function cookedASCII(s, raw) {
  let cooked = "";
  for (let i = 0; i < raw.length; i++) {
    tick(s);
    let c = codeAt(raw, i);
    if (c > 127) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
    if (c === 92) {
      if (++i >= raw.length) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
      c = codeAt(raw, i);
      if (c === 110) c = 10;
      else if (c === 114) c = 13;
      else if (c === 116) c = 9;
      else if (c !== 92 && c !== 34 && c !== 39) abort(s, "UNSUPPORTED_BOUNDED_SYNTAX");
    }
    // A12: actual one-unit string, then old+new concatenation overlap, BEFORE work.
    guard(s, 34);
    const piece = fromCode(c);
    s.stringOperations++;
    const newUnits = plus(s, cooked.length, 1);
    guard(s, plus(s, 64, times(s, plus(s, cooked.length, newUnits), 2)));
    cooked = cooked + piece;
    s.stringOperations++;
  }
  return cooked;
}
function stringAttempt(s, count) {
  const raw = sourceSlice(s, 0, count);
  const cooked = cookedASCII(s, raw);
  // A13: actual private raw/cooked pair; no source string is returned publicly.
  guard(s, 96);
  retainRoot(s, {__proto__: null, raw, cooked}, "RAW_COOKED");
}
function observation(s) {
  // A14: reserve fixed1024 output before constructing<=18 scalar/literal fields.
  timed(s);
  if (1024 > s.limit - s.total) abort(s, "CAP_REFUSED");
  s.total += 1024;
  s.outputBytes += 1024;
  return freeze({purpose: "TIP081_P2_SYNTHETIC_KERNEL_ONLY", parserDisabled: true,
    grammarImplemented: false, occurrenceCoverageComplete: false,
    profile: s.profile, phase: s.phase, rootKind: s.rootKind, totalBytes: s.total,
    producerBytes: s.producerBytes, outputBytes: s.outputBytes, nodes: s.nodes,
    entries: s.entries, scopeDepth: s.scopeDepth, arrays: s.arrays,
    dictionaryRows: s.dictionaryRows, stringOperations: s.stringOperations,
    schemaMutations: s.schemaMutations, fixtures: s.fixtures});
}
export function runAllocationFixtureP2(handle, scenario, count) {
  if (arguments.length !== 3 || typeof scenario !== "string" || !unsigned(count)) fail("SCHEMA_REFUSED");
  if (scenario !== "NODE_COPY_SCHEMA" && scenario !== "ARRAY_RESIZE" &&
      scenario !== "SCOPE_MAP_FANOUT" && scenario !== "RAW_COOKED" &&
      scenario !== "RAW_COOKED_TENTATIVE") fail("SCHEMA_REFUSED");
  const s = owner(handle);
  if (scenario === "NODE_COPY_SCHEMA") nodeScenario(s, count);
  else if (scenario === "ARRAY_RESIZE") arrayScenario(s, count);
  else if (scenario === "SCOPE_MAP_FANOUT") scopeScenario(s, count);
  else {
    if (count > s.text.length) abort(s, "SCHEMA_REFUSED");
    stringAttempt(s, count);
    if (scenario === "RAW_COOKED_TENTATIVE") stringAttempt(s, count);
  }
  s.fixtures++;
  return observation(s);
}
export function readAllocationFixtureP2(handle) {
  if (arguments.length !== 1) fail("AUTHORITY_REFUSED");
  return observation(owner(handle));
}
export function retireAllocationFixtureP2(handle) {
  if (arguments.length !== 1) fail("AUTHORITY_REFUSED");
  const s = owner(handle, false);
  dispose(s);
  return "SYNTHETIC_ALLOCATION_OWNER_RETIRED";
}
export function parserEntryAllocationFixtureP2(handle) {
  if (arguments.length !== 1) fail("AUTHORITY_REFUSED");
  // No parser exists and no public flag/hash/metadata can create admission.
  abort(owner(handle), "ALLOCATION_COVERAGE_OPEN");
}
