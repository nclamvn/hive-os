// Lexical runtime template. Offline generator embeds it; NEVER import standalone.
// Its generated trusted loader must admit exact adapter/inventory/profile pins first.
import {performance as __HIVE_P2_performance} from "node:perf_hooks";
const __HIVE_P2_clock = __HIVE_P2_performance.now.bind(__HIVE_P2_performance);
const __HIVE_P2_charCode = Function.prototype.call.bind(String.prototype.charCodeAt);
const __HIVE_P2_sliceNative = Function.prototype.call.bind(String.prototype.slice);
const __HIVE_P2_fromCharCode = String.fromCharCode;
const __HIVE_P2_parseInt = parseInt;
const __HIVE_P2_parseFloat = parseFloat;
const __HIVE_P2_numberNative = Number;
const __HIVE_P2_safe = Number.isSafeInteger;
const __HIVE_P2_maxInteger = Number.MAX_SAFE_INTEGER;
const __HIVE_P2_finite = Number.isFinite;
const __HIVE_P2_is = Object.is;
const __HIVE_P2_freeze = Object.freeze;
const __HIVE_P2_setPrototype = Object.setPrototypeOf;
const __HIVE_P2_descriptor = Object.getOwnPropertyDescriptor;
const __HIVE_P2_define = Object.defineProperty;
const __HIVE_P2_setNative = Reflect.set;
const __HIVE_P2_create = Object.create;
const __HIVE_P2_proto = Object.getPrototypeOf;
const __HIVE_P2_keysNative = Object.keys;
const __HIVE_P2_hasOwnNative = Object.prototype.hasOwnProperty;
const __HIVE_P2_toStringNative = Object.prototype.toString;
const __HIVE_P2_defineProperties = Object.defineProperties;
const __HIVE_P2_hasOwn = Object.hasOwn;
const __HIVE_P2_isArray = Array.isArray;
const __HIVE_P2_removeNative = Reflect.deleteProperty;
const __HIVE_P2_apply = Reflect.apply;
const __HIVE_P2_constructNative = Reflect.construct;
const __HIVE_P2_Array = Array;
const __HIVE_P2_Object = Object;
const __HIVE_P2_String = String;
const __HIVE_P2_RegExp = RegExp;
const __HIVE_P2_Math = Math;
const __HIVE_P2_Number = Number;
const __HIVE_P2_mathFloor = Math.floor;
const __HIVE_P2_mathMin = Math.min;
const __HIVE_P2_mathMax = Math.max;
const __HIVE_P2_getWeak = Function.prototype.call.bind(WeakMap.prototype.get);
const __HIVE_P2_setWeak = Function.prototype.call.bind(WeakMap.prototype.set);
const __HIVE_P2_deleteWeak = Function.prototype.call.bind(WeakMap.prototype.delete);
const __HIVE_P2_objectPrototype = Object.prototype;
const __HIVE_P2_functionPrototype = Function.prototype;
const __HIVE_P2_arrayPrototype = Array.prototype;
// The generator must inject an exact reviewed startup-site inventory and this sum.
// It is NOT a guessed fixed65536 whole-function allowance.
let __HIVE_P2_toolBytes = __HIVE_P2_RUNTIME_STATIC_BYTES + __HIVE_P2_RUNTIME_WORKSPACE_BYTES;
const __HIVE_P2_values = new WeakMap();
const __HIVE_P2_functions = new WeakMap();
const __HIVE_P2_owners = new WeakMap();
let __HIVE_P2_active = null;
let __HIVE_P2_owner = null;
let __HIVE_P2_Parser = null;
let __HIVE_P2_NodeConstructor = null;
let __HIVE_P2_templateSentinel = null;
let __HIVE_P2_constructing = 0;
// Only a newly reviewed/pinned synthetic artifact may change this compile-time
// constant. No caller metadata, flag, hash or old synthetic receipt can change it.
const __HIVE_P2_COVERAGE_RELEASED = false;
const __HIVE_P2_errors = __HIVE_P2_freeze({
  __proto__: null,
  SCHEMA_REFUSED: __HIVE_P2_freeze({code: "SCHEMA_REFUSED", realParserDisabled: true}),
  MODE_OPEN: __HIVE_P2_freeze({code: "MODE_OPEN", realParserDisabled: true}),
  AUTHORITY_REFUSED: __HIVE_P2_freeze({code: "AUTHORITY_REFUSED", realParserDisabled: true}),
  BUSY_REFUSED: __HIVE_P2_freeze({code: "BUSY_REFUSED", realParserDisabled: true}),
  CAP_REFUSED: __HIVE_P2_freeze({code: "CAP_REFUSED", realParserDisabled: true}),
  NODE_REFUSED: __HIVE_P2_freeze({code: "NODE_REFUSED", realParserDisabled: true}),
  ENTRY_REFUSED: __HIVE_P2_freeze({code: "ENTRY_REFUSED", realParserDisabled: true}),
  DEPTH_REFUSED: __HIVE_P2_freeze({code: "DEPTH_REFUSED", realParserDisabled: true}),
  TIME_REFUSED: __HIVE_P2_freeze({code: "TIME_REFUSED", realParserDisabled: true}),
  SYNTAX_REFUSED: __HIVE_P2_freeze({code: "SYNTAX_REFUSED", realParserDisabled: true}),
  UNSUPPORTED_BOUNDED_SYNTAX: __HIVE_P2_freeze({code: "UNSUPPORTED_BOUNDED_SYNTAX", realParserDisabled: true}),
  ALLOCATION_COVERAGE_OPEN: __HIVE_P2_freeze({code: "ALLOCATION_COVERAGE_OPEN", realParserDisabled: true}),
});
function __HIVE_P2_integer(value) {
  return typeof value === "number" && __HIVE_P2_safe(value) && value >= 0 && !__HIVE_P2_is(value, -0);
}
function __HIVE_P2_dispose() {
  if (__HIVE_P2_owner) { __HIVE_P2_owner.text = null; __HIVE_P2_owner.ast = null; __HIVE_P2_owner.parser = null; __HIVE_P2_owner.phase = "RETIRED"; }
  if (__HIVE_P2_active !== null) __HIVE_P2_deleteWeak(__HIVE_P2_owners, __HIVE_P2_active);
  __HIVE_P2_owner = null;
  __HIVE_P2_active = null;
}
/** @returns {never} */
function __HIVE_P2_fail(code) { throw __HIVE_P2_errors[code] || __HIVE_P2_errors.ALLOCATION_COVERAGE_OPEN; }
/** @returns {never} */
function __HIVE_P2_refuse(code) {
  __HIVE_P2_dispose();
  throw __HIVE_P2_errors[code] || __HIVE_P2_errors.ALLOCATION_COVERAGE_OPEN;
}
function __HIVE_P2_tick() {
  if (!__HIVE_P2_owner) return;
  if (++__HIVE_P2_owner.ticks < 64) return;
  __HIVE_P2_owner.ticks = 0;
  __HIVE_P2_timed();
}
function __HIVE_P2_timed() {
  if (!__HIVE_P2_owner) return;
  const t = __HIVE_P2_clock();
  if (!__HIVE_P2_finite(t) || t < __HIVE_P2_owner.lastNow || t - __HIVE_P2_owner.started >= __HIVE_P2_owner.ttl) __HIVE_P2_refuse("TIME_REFUSED");
  __HIVE_P2_owner.lastNow = t;
}
function __HIVE_P2_plus(a, b) {
  if (!__HIVE_P2_integer(a) || !__HIVE_P2_integer(b) || b > __HIVE_P2_maxInteger - a) __HIVE_P2_refuse("CAP_REFUSED");
  return a + b;
}
function __HIVE_P2_product(a, b) {
  if (!__HIVE_P2_integer(a) || !__HIVE_P2_integer(b) || a !== 0 && b > __HIVE_P2_maxInteger / a) __HIVE_P2_refuse("CAP_REFUSED");
  const result = a * b;
  if (!__HIVE_P2_integer(result)) __HIVE_P2_refuse("CAP_REFUSED");
  return result;
}
function __HIVE_P2_reserve(bytes, nodes = 0, entries = 0) {
  __HIVE_P2_timed();
  if (!__HIVE_P2_integer(bytes) || !__HIVE_P2_integer(nodes) || !__HIVE_P2_integer(entries)) __HIVE_P2_refuse("CAP_REFUSED");
  if (!__HIVE_P2_owner) {
    if (bytes > 67108864 - __HIVE_P2_toolBytes) __HIVE_P2_refuse("CAP_REFUSED");
    __HIVE_P2_toolBytes += bytes;
    return;
  }
  const s = __HIVE_P2_owner;
  if (bytes > s.limit - s.total) __HIVE_P2_refuse("CAP_REFUSED");
  if (nodes > 200000 - s.nodes) __HIVE_P2_refuse("NODE_REFUSED");
  if (entries > 20000 - s.entries) __HIVE_P2_refuse("ENTRY_REFUSED");
  s.total += bytes; s.producerBytes += bytes; s.nodes += nodes; s.entries += entries;
}
function __HIVE_P2_meta(value, kind, fields, capacity = 0) {
  let meta = __HIVE_P2_getWeak(__HIVE_P2_values, value);
  if (meta) return meta;
  // Exact eight-field metadata record+WeakMap row; no all-node mirror/catalogue.
  __HIVE_P2_reserve(224, 0, 1);
  meta = {__proto__: null, kind, fields, keyUnits: 0, capacity, depth: kind === "NODE" ? 1 : 0,
    parents: null, initialized: true, site: -1};
  __HIVE_P2_setWeak(__HIVE_P2_values, value, meta);
  return meta;
}
function __HIVE_P2_reserveObject(fields) {
  __HIVE_P2_reserve(__HIVE_P2_plus(64, __HIVE_P2_product(fields, 16)));
}
function __HIVE_P2_ownObject(value, site, fields, keyUnits) {
  __HIVE_P2_reserve(16);
  __HIVE_P2_setPrototype(value, null);
  const meta = __HIVE_P2_meta(value, "OBJECT", fields);
  meta.keyUnits = keyUnits;
  meta.site = site;
  // Keys are enumerated only after their exact reservation in keys().
  return value;
}
function __HIVE_P2_reserveArray(capacity, site, occupied = capacity) {
  __HIVE_P2_reserve(__HIVE_P2_plus(88, __HIVE_P2_product(capacity, 8)), 0, occupied);
}
function __HIVE_P2_ownArray(value, site, role = "ARRAY", depth = 0) {
  __HIVE_P2_reserve(16);
  __HIVE_P2_setPrototype(value, null);
  const meta = __HIVE_P2_meta(value, role, value.length, value.length);
  meta.keyUnits = __HIVE_P2_product(value.length, 10); //retained upperbound percanonicaluint32 index.
  meta.depth = depth;
  meta.site = site;
  if (role === "ARRAY") {
    for (let i = 0; i < value.length; i++) {
      __HIVE_P2_tick();
      const child = value[i];
      if (child && typeof child === "object") __HIVE_P2_linkDepth(value, child);
    }
  }
  return value;
}
function __HIVE_P2_maximumChildDepth(maximum, value) {
  if (!__HIVE_P2_integer(maximum)) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  if (value === null || typeof value !== "object") return maximum;
  const meta = __HIVE_P2_getWeak(__HIVE_P2_values, value);
  if (!meta || meta.kind !== "NODE" && meta.kind !== "ARRAY") return maximum;
  return meta.depth > maximum ? meta.depth : maximum;
}
function __HIVE_P2_checkArrayDepth(maximum) {
  if (!__HIVE_P2_integer(maximum) || maximum > 128) __HIVE_P2_refuse("DEPTH_REFUSED");
}
// Ordinary function96 + own prototype slot16 + implicit prototype object80.
// Captured bound intrinsics are separately nonconstructible96 startup rows.
function __HIVE_P2_reserveFunction() { __HIVE_P2_reserve(192); }
function __HIVE_P2_registerFunction(fn, locals, parameters, nested, site, adoptPrivatePrototype = true) {
  if (__HIVE_P2_getWeak(__HIVE_P2_functions, fn)) return fn;
  if (adoptPrivatePrototype !== true && adoptPrivatePrototype !== false) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  __HIVE_P2_reserve(176, 0, 1); //five-field function/frame metadata+WeakMap row.
  __HIVE_P2_setWeak(__HIVE_P2_functions, fn, {__proto__: null, locals, parameters, nested, site, native: null});
  const meta = __HIVE_P2_meta(fn, "FUNCTION", 3);
  meta.keyUnits = 19; //length6 +name4 +prototype9; retained upper bound.
  if (adoptPrivatePrototype) {
    // Generated five-argument registrations are fresh ordinary private functions.
    // Their implicit prototype backing80/slot16 was reserved before creation.
    // Adopt metadata NOW, in that function's lifetime, never on a first owner
    // instance lookup. Native markers explicitly skip this internal-only branch.
    __HIVE_P2_reserve(128);
    const ownPrototype = __HIVE_P2_descriptor(fn, "prototype");
    if (!ownPrototype) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
    __HIVE_P2_reserve(16); __HIVE_P2_setPrototype(ownPrototype, null);
    const prototype = ownPrototype.value;
    if (ownPrototype.get || ownPrototype.set || ownPrototype.writable !== true ||
        ownPrototype.enumerable !== false || ownPrototype.configurable !== false ||
        prototype === null || typeof prototype !== "object" ||
        __HIVE_P2_proto(prototype) !== __HIVE_P2_objectPrototype) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
    __HIVE_P2_reserve(128);
    const ownConstructor = __HIVE_P2_descriptor(prototype, "constructor");
    if (!ownConstructor) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
    __HIVE_P2_reserve(16); __HIVE_P2_setPrototype(ownConstructor, null);
    if (ownConstructor.get || ownConstructor.set || ownConstructor.value !== fn ||
        ownConstructor.writable !== true || ownConstructor.enumerable !== false ||
        ownConstructor.configurable !== true) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
    const prototypeMeta = __HIVE_P2_meta(prototype, "OBJECT", 1);
    if (prototypeMeta.kind !== "OBJECT") __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
    if (prototypeMeta.keyUnits < 11) prototypeMeta.keyUnits = 11;
    // Exact512 = two descriptor128 +two sanitize16 +metadata224; one weak entry.
    // No second prototype backing/header reservation or caller adoption flag.
  }
  return fn;
}
function __HIVE_P2_frame(fn, arity) {
  const descriptor = __HIVE_P2_getWeak(__HIVE_P2_functions, fn);
  if (!descriptor || !__HIVE_P2_integer(arity)) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  if (__HIVE_P2_owner && __HIVE_P2_owner.callDepth >= 128) __HIVE_P2_refuse("DEPTH_REFUSED");
  const scalarFields = __HIVE_P2_plus(arity, __HIVE_P2_plus(descriptor.locals, descriptor.parameters));
  __HIVE_P2_reserve(__HIVE_P2_plus(64, __HIVE_P2_product(scalarFields, 16)));
  // Nested hoisted function objects exist at callee entry; reserve BEFORE re-entry.
  __HIVE_P2_reserve(__HIVE_P2_product(descriptor.nested, 192));
  if (__HIVE_P2_owner) __HIVE_P2_owner.callDepth++;
  return descriptor;
}
function __HIVE_P2_invoke(fn, receiver, args) {
  const descriptor = __HIVE_P2_frame(fn, args.length);
  try {
    if (descriptor.native !== null) return __HIVE_P2_native(descriptor.native, receiver, args);
    return __HIVE_P2_apply(fn, receiver, args);
  } finally { if (__HIVE_P2_owner) __HIVE_P2_owner.callDepth--; }
}
function __HIVE_P2_construct(fn, args, site) {
  if (fn === __HIVE_P2_RegExp) {
    // Fixed keyword/table descriptors only. Target readRegexp body must refuse first.
    return __HIVE_P2_regexNew(args, site);
  }
  if (fn === __HIVE_P2_Array) {
    if (args.length !== 1 || !__HIVE_P2_integer(args[0])) __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
    __HIVE_P2_reserveArray(args[0], site, 0);
    return __HIVE_P2_ownArray(new __HIVE_P2_Array(args[0]), site);
  }
  const isNode = fn === __HIVE_P2_NodeConstructor;
  __HIVE_P2_frame(fn, args.length);
  __HIVE_P2_reserve(80, isNode ? 1 : 0); //node cap BEFORE actual constructor entry.
  __HIVE_P2_constructing++;
  try {
    const value = __HIVE_P2_constructNative(fn, args);
    const meta = __HIVE_P2_meta(value, isNode ? "NODE" : "OBJECT", 0);
    if (isNode) { meta.kind = "NODE"; meta.depth = 1; }
    meta.site = site;
    return value;
  } finally { __HIVE_P2_constructing--; if (__HIVE_P2_owner) __HIVE_P2_owner.callDepth--; }
}
function __HIVE_P2_get(value, key) {
  __HIVE_P2_tick();
  if (typeof key !== "string" && typeof key !== "number") __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  key = __HIVE_P2_primitiveString(key);
  if (typeof value === "string") return __HIVE_P2_stringProperty(value, key);
  if (value === null || value === undefined) __HIVE_P2_refuse("SYNTAX_REFUSED");
  const intrinsic = __HIVE_P2_intrinsicProperty(value, key);
  if (intrinsic !== __HIVE_P2_NO_INTRINSIC) return intrinsic;
  const known = __HIVE_P2_getWeak(__HIVE_P2_values, value);
  if (!known && typeof value !== "function") __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  let current = value;
  for (let steps = 0; current !== null && steps < 128; steps++) {
    __HIVE_P2_tick();
    __HIVE_P2_reserve(128); //native own-property descriptor logical envelope before reflection.
    const descriptor = __HIVE_P2_descriptor(current, key);
    if (descriptor) {
      __HIVE_P2_reserve(16); __HIVE_P2_setPrototype(descriptor, null);
      if (descriptor.get) return __HIVE_P2_invoke(descriptor.get, value, __HIVE_P2_emptyArguments());
      const result = descriptor.value;
      if (key === "prototype" && typeof value === "function" && result && typeof result === "object") {
        const callable = __HIVE_P2_getWeak(__HIVE_P2_functions, value);
        const meta = __HIVE_P2_getWeak(__HIVE_P2_values, result);
        // Private ordinary prototypes were branded at function registration.
        // A late read cannot adopt a host/native or unknown replacement prototype
        // into an active owner's ledger. Object.prototype bootstrap is the exact
        // captured intrinsic case above, not this generic adoption path.
        if (!callable || callable.native !== null || !meta || meta.kind !== "OBJECT")
          __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
        if (meta.keyUnits < 11) meta.keyUnits = 11;
      }
      return result;
    }
    const parent = __HIVE_P2_proto(current);
    // Unknown host prototypes/setters are never called as grammar callbacks.
    if (parent === __HIVE_P2_objectPrototype || parent === __HIVE_P2_functionPrototype || parent === __HIVE_P2_arrayPrototype) return undefined;
    if (parent && !__HIVE_P2_getWeak(__HIVE_P2_values, parent)) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
    current = parent;
  }
  return undefined;
}
function __HIVE_P2_defineData(value, key, content) {
  __HIVE_P2_reserve(128);
  const previous = __HIVE_P2_descriptor(value, key);
  let writable = true, enumerable = true, configurable = true;
  if (previous) {
    __HIVE_P2_reserve(16); __HIVE_P2_setPrototype(previous, null);
    if (previous.set) {
      __HIVE_P2_reserveArray(1, -1);
      const args = __HIVE_P2_ownArray(new __HIVE_P2_Array(1), -1, "CONTROL_ARRAY");
      __HIVE_P2_set(args, 0, content);
      __HIVE_P2_invoke(previous.set, value, args);
      return;
    }
    if (previous.get || previous.writable === false) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
    writable = previous.writable; enumerable = previous.enumerable; configurable = previous.configurable;
  }
  __HIVE_P2_reserve(128);
  const descriptor = {__proto__: null, value: content, writable, enumerable, configurable};
  __HIVE_P2_define(value, key, descriptor);
}
function __HIVE_P2_set(value, key, content) {
  if (typeof key !== "string" && typeof key !== "number") __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  if ((typeof value !== "object" || value === null) && typeof value !== "function") __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  // The only lazily adopted objects are the fresh `this` of a guarded private
  // constructor. Ordinary prototypes were branded at function registration. No public
  // object/options/AST is accepted by this lexical helper or owner API.
  if (!__HIVE_P2_getWeak(__HIVE_P2_values, value) && !__HIVE_P2_constructing) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  const meta = __HIVE_P2_meta(value, "OBJECT", 0);
  __HIVE_P2_reserve(16); //all replacement/schema attempts remain debited.
  // Retained upper bounds are never decremented on overwrite/delete. They bound
  // later own-key materialization before Object.keys, without keeping key mirrors.
  const keyString = __HIVE_P2_primitiveString(key);
  const index = __HIVE_P2_arrayIndex(keyString);
  key = keyString;
  __HIVE_P2_reserve(128);
  const previous = __HIVE_P2_descriptor(value, key);
  if (!previous) {
    if ((meta.kind === "ARRAY" || meta.kind === "CONTROL_ARRAY") && (index >= 0 || key === "length")) {
      if (key !== "length") __HIVE_P2_reserve(0, 0, 1);
    } else __HIVE_P2_reserve(__HIVE_P2_plus(72, __HIVE_P2_product(keyString.length, 2)), 0, 2);
    meta.fields = __HIVE_P2_plus(meta.fields, 1);
    meta.keyUnits = __HIVE_P2_plus(meta.keyUnits, keyString.length);
  }
  if ((meta.kind === "ARRAY" || meta.kind === "CONTROL_ARRAY") && index >= meta.capacity) {
    const next = __HIVE_P2_plus(index, 1);
    __HIVE_P2_reserve(__HIVE_P2_plus(88, __HIVE_P2_product(__HIVE_P2_plus(meta.capacity, next), 8)));
    meta.capacity = next;
  }
  __HIVE_P2_linkDepth(value, content);
  if ((meta.kind === "ARRAY" || meta.kind === "CONTROL_ARRAY") && key === "length") {
    if (!__HIVE_P2_integer(content) || content > 4294967295) __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
    if (content > meta.capacity) {
      __HIVE_P2_reserve(__HIVE_P2_plus(88, __HIVE_P2_product(__HIVE_P2_plus(meta.capacity, content), 8)));
      meta.capacity = content;
    }
    __HIVE_P2_setNative(value, key, content);
    return content;
  }
  __HIVE_P2_defineData(value, key, content);
  return content;
}
function __HIVE_P2_remove(value, key) {
  if (typeof key !== "string" && typeof key !== "number") __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  key = __HIVE_P2_primitiveString(key);
  if (!__HIVE_P2_getWeak(__HIVE_P2_values, value)) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  __HIVE_P2_reserve(16);
  return __HIVE_P2_removeNative(value, key);
}
function __HIVE_P2_increment(value, key, delta, postfix) {
  const old = __HIVE_P2_numeric(__HIVE_P2_get(value, key));
  const next = old + delta;
  __HIVE_P2_set(value, key, next);
  return postfix ? old : next;
}
function __HIVE_P2_primitiveString(value) {
  if (typeof value === "string") return value;
  if (value === null || typeof value === "number" || typeof value === "boolean" || value === undefined) {
    __HIVE_P2_reserve(96); //<=32UTF16 scalar spellings, before captured conversion.
    return __HIVE_P2_String(value);
  }
  __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
}
function __HIVE_P2_concat(a, b) {
  const left = __HIVE_P2_primitiveString(a), right = __HIVE_P2_primitiveString(b);
  const newUnits = __HIVE_P2_plus(left.length, right.length);
  __HIVE_P2_reserve(__HIVE_P2_plus(64, __HIVE_P2_product(__HIVE_P2_plus(left.length, newUnits), 2)));
  return left + right;
}
function __HIVE_P2_binary(operator, a, b) {
  if (operator === "in") return __HIVE_P2_hasProperty(b, a);
  if (operator === "instanceof") return __HIVE_P2_instance(a, b);
  if (operator === "==" || operator === "!=") {
    const result = __HIVE_P2_equal(a, b);
    return operator === "==" ? result : !result;
  }
  if (operator === "<" || operator === "<=" || operator === ">" || operator === ">=") {
    __HIVE_P2_primitive(a); __HIVE_P2_primitive(b);
    if (operator === "<") return a < b;
    if (operator === "<=") return a <= b;
    if (operator === ">") return a > b;
    return a >= b;
  }
  if (operator === "+") {
    if (typeof a === "string" || typeof b === "string") return __HIVE_P2_concat(a, b);
    return __HIVE_P2_numeric(a) + __HIVE_P2_numeric(b);
  }
  a = __HIVE_P2_numeric(a); b = __HIVE_P2_numeric(b);
  if (operator === "-") return a - b;
  if (operator === "*") return a * b;
  if (operator === "/") return a / b;
  if (operator === "%") return a % b;
  if (operator === "**") return a ** b;
  if (operator === "|") return a | b;
  if (operator === "&") return a & b;
  if (operator === "^") return a ^ b;
  if (operator === "<<") return a << b;
  if (operator === ">>") return a >> b;
  if (operator === ">>>") return a >>> b;
  __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
}
function __HIVE_P2_primitive(value) {
  if (value !== null && typeof value !== "string" && typeof value !== "number" &&
      typeof value !== "boolean" && value !== undefined) __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  if (typeof value === "string") __HIVE_P2_reserve(__HIVE_P2_plus(32, __HIVE_P2_product(value.length, 2)));
  return value;
}
function __HIVE_P2_numeric(value) {
  __HIVE_P2_primitive(value);
  return __HIVE_P2_numberNative(value);
}
function __HIVE_P2_unary(operator, value) {
  const numeric = __HIVE_P2_numeric(value);
  if (operator === "+") return numeric;
  if (operator === "-") return -numeric;
  if (operator === "~") return ~numeric;
  __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
}
function __HIVE_P2_equal(a, b) {
  if (typeof a === typeof b) return a === b;
  if (a === null || a === undefined) return b === null || b === undefined;
  if (b === null || b === undefined) return false;
  if (typeof a === "object" || typeof a === "function" || typeof b === "object" || typeof b === "function")
    __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  __HIVE_P2_primitive(a); __HIVE_P2_primitive(b);
  // Both values are closed primitives. No object ToPrimitive callback is possible.
  return a == b;
}
function __HIVE_P2_hasProperty(value, key) {
  key = __HIVE_P2_primitiveString(key);
  if (!value || !__HIVE_P2_getWeak(__HIVE_P2_values, value)) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  let current = value;
  for (let depth = 0; current !== null && depth < 128; depth++) {
    __HIVE_P2_tick(); __HIVE_P2_reserve(128);
    if (__HIVE_P2_descriptor(current, key)) return true;
    const parent = __HIVE_P2_proto(current);
    if (parent === __HIVE_P2_objectPrototype || parent === __HIVE_P2_functionPrototype || parent === __HIVE_P2_arrayPrototype) return false;
    if (parent && !__HIVE_P2_getWeak(__HIVE_P2_values, parent)) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
    current = parent;
  }
  return false;
}
function __HIVE_P2_instance(value, constructor) {
  if (!__HIVE_P2_getWeak(__HIVE_P2_functions, constructor)) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  if (value === null || typeof value !== "object" && typeof value !== "function") return false;
  if (!__HIVE_P2_getWeak(__HIVE_P2_values, value)) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  const prototype = __HIVE_P2_get(constructor, "prototype");
  let current = value;
  for (let depth = 0; depth < 128; depth++) {
    __HIVE_P2_tick(); current = __HIVE_P2_proto(current);
    if (current === prototype) return true;
    if (current === null || current === __HIVE_P2_objectPrototype || current === __HIVE_P2_functionPrototype || current === __HIVE_P2_arrayPrototype) return false;
    if (!__HIVE_P2_getWeak(__HIVE_P2_values, current)) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  }
  __HIVE_P2_refuse("DEPTH_REFUSED");
}
function __HIVE_P2_char(value, position) {
  __HIVE_P2_tick();
  if (typeof value !== "string" || typeof position !== "number") __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  return __HIVE_P2_charCode(value, position);
}
function __HIVE_P2_slice(value, start = 0, end) {
  if (typeof value !== "string") __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  if (end === undefined) end = value.length;
  if (typeof value !== "string" || !__HIVE_P2_safe(start) || !__HIVE_P2_safe(end)) __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  let a = start < 0 ? value.length + start : start;
  let b = end < 0 ? value.length + end : end;
  if (a < 0) a = 0; else if (a > value.length) a = value.length;
  if (b < 0) b = 0; else if (b > value.length) b = value.length;
  const units = b > a ? b - a : 0;
  __HIVE_P2_reserve(__HIVE_P2_plus(64, __HIVE_P2_product(units, 2)));
  return __HIVE_P2_sliceNative(value, a, b);
}
function __HIVE_P2_codePoint(value) {
  if (!__HIVE_P2_integer(value) || value > 1114111) __HIVE_P2_refuse("SYNTAX_REFUSED");
  __HIVE_P2_reserve(value <= 65535 ? 34 : 36);
  if (value <= 65535) return __HIVE_P2_fromCharCode(value);
  const n = value - 65536;
  return __HIVE_P2_fromCharCode(55296 + (n >> 10), 56320 + (n & 1023));
}
function __HIVE_P2_number(value, radix) {
  if (typeof value !== "string" || value.length > 1024 ||
      (radix !== 2 && radix !== 8 && radix !== 10 && radix !== 16)) __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  __HIVE_P2_reserve(__HIVE_P2_plus(32, __HIVE_P2_product(value.length, 2)));
  return radix === 10 ? __HIVE_P2_numberNative(value) : __HIVE_P2_parseInt(value, radix);
}
function __HIVE_P2_syntaxRefusal() { __HIVE_P2_refuse("SYNTAX_REFUSED"); }
function __HIVE_P2_invalidTemplate(parser) {
  if (__HIVE_P2_get(parser, "inTemplateElement")) throw __HIVE_P2_templateSentinel;
  __HIVE_P2_syntaxRefusal();
}

function __HIVE_P2_authenticate(handle, timed = true) {
  if (handle === null || typeof handle !== "object" || handle !== __HIVE_P2_active) __HIVE_P2_fail("AUTHORITY_REFUSED");
  const state = __HIVE_P2_getWeak(__HIVE_P2_owners, handle);
  if (!state || state !== __HIVE_P2_owner) __HIVE_P2_fail("AUTHORITY_REFUSED");
  if (timed) __HIVE_P2_timed();
  return state;
}
function __HIVE_P2_fixedOptions(profile) {
  // Exact closed profile. No arbitrary caller object/plugin/program/token/comment API.
  __HIVE_P2_reserveObject(19);
  return __HIVE_P2_ownObject({__proto__: null, ecmaVersion: 15,
    sourceType: profile === "SCRIPT" ? "script" : "module", allowReserved: false,
    allowReturnOutsideFunction: false, allowImportExportEverywhere: false,
    allowAwaitOutsideFunction: false, allowSuperOutsideMethod: false,
    allowHashBang: true, locations: false, ranges: false, program: null,
    sourceFile: null, directSourceFile: null, preserveParens: false,
    onToken: null, onComment: null, onInsertedSemicolon: null, onTrailingComma: null,
    checkPrivateFields: true}, -1, 19, 278);
}
export function createSyntheticGrammarFixtureP2(text, profile, cap, ttl) {
  if (arguments.length !== 4 || typeof text !== "string" || typeof profile !== "string" ||
      !__HIVE_P2_integer(cap) || cap > 67108864 || !__HIVE_P2_integer(ttl) || ttl < 1 || ttl > 120000) __HIVE_P2_fail("SCHEMA_REFUSED");
  if (profile !== "SCRIPT" && profile !== "MODULE") __HIVE_P2_fail("MODE_OPEN");
  if (!__HIVE_P2_COVERAGE_RELEASED) __HIVE_P2_fail("ALLOCATION_COVERAGE_OPEN");
  if (__HIVE_P2_active !== null) {
    const prior = __HIVE_P2_owner, now = __HIVE_P2_clock();
    if (!__HIVE_P2_finite(now) || now < prior.lastNow) __HIVE_P2_refuse("TIME_REFUSED");
    prior.lastNow = now; //observation advances monotone clock, never started/ttl.
    if (now - prior.started < prior.ttl) __HIVE_P2_fail("BUSY_REFUSED");
    __HIVE_P2_dispose();
  }
  // State16 fields(320), handle2 fields(96), one opaque-owner WeakMap row32.
  // The separately generated workspace is an itemized runtime-helper frame sum
  // for the fixed re-entry/control-bookkeeping bounds, not an anonymous cushion.
  const base = __HIVE_P2_plus(__HIVE_P2_toolBytes, 480); //448 control +32 retained source header.
  if (cap < base || text.length > (cap - base) / 4) __HIVE_P2_fail("CAP_REFUSED");
  const started = __HIVE_P2_clock();
  if (!__HIVE_P2_finite(started)) __HIVE_P2_fail("TIME_REFUSED");
  const state = {__proto__: null, text, profile, limit: cap, ttl, started, lastNow: started,
    total: base + text.length * 4, producerBytes: 0, outputBytes: 0, nodes: 0,
    entries: 1, callDepth: 0, ticks: 0, ast: null, parser: null, phase: "SOURCE_READY"};
  const handle = __HIVE_P2_freeze({purpose: "TIP081_P2_SYNTHETIC_GRAMMAR_ONLY", realParserDisabled: true});
  __HIVE_P2_setWeak(__HIVE_P2_owners, handle, state);
  __HIVE_P2_owner = state; __HIVE_P2_active = handle;
  __HIVE_P2_timed();
  return handle;
}
function __HIVE_P2_observe(state) {
  __HIVE_P2_timed();
  if (288 > state.limit - state.total) __HIVE_P2_refuse("CAP_REFUSED");
  state.total += 288; state.outputBytes += 288; //header64 +14 fixed slots16.
  let firstType = "NONE", firstNumber = null, bodyLength = 0;
  if (state.ast !== null) {
    const body = __HIVE_P2_get(state.ast, "body");
    bodyLength = body.length;
    if (body.length) {
      const first = __HIVE_P2_get(body, 0);
      firstType = __HIVE_P2_get(first, "type");
      const expression = __HIVE_P2_get(first, "expression");
      if (expression && __HIVE_P2_get(expression, "type") === "Literal") {
        const value = __HIVE_P2_get(expression, "value");
        if (typeof value === "number") firstNumber = value;
      }
    }
  }
  return __HIVE_P2_freeze({purpose: "TIP081_P2_SYNTHETIC_GRAMMAR_ONLY", realParserDisabled: true,
    syntheticAdapterEnabled: __HIVE_P2_COVERAGE_RELEASED, profile: state.profile,
    phase: state.phase, totalBytes: state.total, producerBytes: state.producerBytes,
    outputBytes: state.outputBytes, attemptedNodes: state.nodes,
    conservativeInternalEntries: state.entries, catalogueSitesMeasured: false,
    bodyLength, firstStatementType: firstType, firstNumericLiteral: firstNumber});
}
export function analyzeSyntheticGrammarFixtureP2(handle) {
  if (arguments.length !== 1) __HIVE_P2_fail("AUTHORITY_REFUSED");
  const state = __HIVE_P2_authenticate(handle);
  if (!__HIVE_P2_COVERAGE_RELEASED || state.phase !== "SOURCE_READY") __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  state.phase = "ANALYZING";
  try {
    const options = __HIVE_P2_fixedOptions(state.profile);
    __HIVE_P2_reserveArray(2, -1);
    const constructorArguments = __HIVE_P2_ownArray(new __HIVE_P2_Array(2), -1, "CONTROL_ARRAY");
    __HIVE_P2_set(constructorArguments, 0, options); __HIVE_P2_set(constructorArguments, 1, state.text);
    const parser = __HIVE_P2_construct(__HIVE_P2_Parser, constructorArguments, -1);
    state.parser = parser;
    const ast = __HIVE_P2_invoke(__HIVE_P2_get(parser, "parse"), parser, __HIVE_P2_emptyArguments());
    // Allocation/call/depth guards ran BEFORE grammar growth, not post-counting.
    state.ast = ast; state.phase = "SYNTHETIC_ANALYZED";
    return __HIVE_P2_observe(state);
  } catch (error) {
    __HIVE_P2_dispose();
    // Identity only, never read a thrown object's getter/message/stack.
    if (error === __HIVE_P2_errors.SCHEMA_REFUSED || error === __HIVE_P2_errors.MODE_OPEN ||
        error === __HIVE_P2_errors.AUTHORITY_REFUSED || error === __HIVE_P2_errors.BUSY_REFUSED ||
        error === __HIVE_P2_errors.CAP_REFUSED || error === __HIVE_P2_errors.NODE_REFUSED ||
        error === __HIVE_P2_errors.ENTRY_REFUSED || error === __HIVE_P2_errors.DEPTH_REFUSED ||
        error === __HIVE_P2_errors.TIME_REFUSED || error === __HIVE_P2_errors.SYNTAX_REFUSED ||
        error === __HIVE_P2_errors.UNSUPPORTED_BOUNDED_SYNTAX || error === __HIVE_P2_errors.ALLOCATION_COVERAGE_OPEN) throw error;
    __HIVE_P2_fail("ALLOCATION_COVERAGE_OPEN");
  }
}
export function observeSyntheticGrammarFixtureP2(handle) {
  if (arguments.length !== 1) __HIVE_P2_fail("AUTHORITY_REFUSED");
  return __HIVE_P2_observe(__HIVE_P2_authenticate(handle));
}
export function retireSyntheticGrammarFixtureP2(handle) {
  if (arguments.length !== 1) __HIVE_P2_fail("AUTHORITY_REFUSED");
  __HIVE_P2_authenticate(handle, false); __HIVE_P2_dispose();
  return "SYNTHETIC_GRAMMAR_OWNER_RETIRED";
}

function __HIVE_P2_emptyArguments() {
  __HIVE_P2_reserveArray(0, -1);
  return __HIVE_P2_ownArray(new __HIVE_P2_Array(0), -1, "CONTROL_ARRAY");
}
function __HIVE_P2_keys(value) {
  const meta = __HIVE_P2_getWeak(__HIVE_P2_values, value);
  if (!meta) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  // Guard upper key count and UTF16 payload BEFORE native enumeration. Retained
  // metadata deliberately does not claim a freshly exact live-key count.
  __HIVE_P2_reserveArray(meta.fields, -1);
  __HIVE_P2_reserve(__HIVE_P2_plus(__HIVE_P2_product(meta.fields, 32), __HIVE_P2_product(meta.keyUnits, 2)));
  return __HIVE_P2_ownArray(__HIVE_P2_keysNative(value), -1, "CONTROL_ARRAY");
}
function __HIVE_P2_copyKeys(value) {
  const meta = __HIVE_P2_getWeak(__HIVE_P2_values, value);
  if (!meta || meta.kind !== "NODE" || __HIVE_P2_proto(value) !== __HIVE_P2_get(__HIVE_P2_NodeConstructor, "prototype"))
    __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  return __HIVE_P2_keys(value);
}
function __HIVE_P2_linkDepth(parent, child) {
  if (child === null || typeof child !== "object") return;
  const childMeta = __HIVE_P2_getWeak(__HIVE_P2_values, child);
  const parentMeta = __HIVE_P2_getWeak(__HIVE_P2_values, parent);
  if (!childMeta || !parentMeta || (parentMeta.kind !== "NODE" && parentMeta.kind !== "ARRAY") ||
      (childMeta.kind !== "NODE" && childMeta.kind !== "ARRAY")) return;
  __HIVE_P2_reserveArray(0, -1);
  const queue = __HIVE_P2_ownArray(new __HIVE_P2_Array(0), -1, "CONTROL_ARRAY");
  __HIVE_P2_depthItem(queue, parent, childMeta.depth + (parentMeta.kind === "NODE" ? 1 : 0));
  for (let position = 0; position < queue.length; position++) {
    __HIVE_P2_tick();
    const item = queue[position], current = item.value, proposed = item.proposed;
    if (current === child) __HIVE_P2_refuse("DEPTH_REFUSED"); //cycle before AST edge commit.
    const currentMeta = __HIVE_P2_getWeak(__HIVE_P2_values, current);
    if (proposed > 128) __HIVE_P2_refuse("DEPTH_REFUSED");
    if (proposed > currentMeta.depth) currentMeta.depth = proposed;
    if (currentMeta.parents !== null) {
      for (let i = 0; i < currentMeta.parents.length; i++) {
        __HIVE_P2_tick();
        const ancestor = currentMeta.parents[i], ancestorMeta = __HIVE_P2_getWeak(__HIVE_P2_values, ancestor);
        // Even equal-depth zero-contribution arrays must traverse ancestry:
        // otherwise an A->B->A array cycle could evade the pre-link guard.
        __HIVE_P2_depthItem(queue, ancestor, currentMeta.depth + (ancestorMeta.kind === "NODE" ? 1 : 0));
      }
    }
  }
  if (childMeta.parents === null) {
    __HIVE_P2_reserveArray(0, -1);
    childMeta.parents = __HIVE_P2_ownArray(new __HIVE_P2_Array(0), -1, "CONTROL_ARRAY");
  }
  // After ancestor admission, commit charged reverse bookkeeping; CONTROL_ARRAY
  // deliberately does not create structural AST links or recursive bookkeeping.
  __HIVE_P2_push(childMeta.parents, parent);
}
function __HIVE_P2_depthItem(queue, value, proposed) {
  if (!__HIVE_P2_integer(proposed) || proposed > 128) __HIVE_P2_refuse("DEPTH_REFUSED");
  __HIVE_P2_reserveObject(2);
  const item = __HIVE_P2_ownObject({__proto__: null, value, proposed}, -1, 2, 13);
  __HIVE_P2_push(queue, item);
}
function __HIVE_P2_push(array, value) {
  const meta = __HIVE_P2_getWeak(__HIVE_P2_values, array);
  if (!meta || meta.kind !== "ARRAY" && meta.kind !== "CONTROL_ARRAY") __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  const index = array.length;
  __HIVE_P2_set(array, index, value);
  return array.length;
}

// Closed intrinsic marker functions; their bodies are never used as callbacks.
function __HIVE_P2_markerSlice() {}
function __HIVE_P2_markerCharCode() {}
function __HIVE_P2_markerCharAt() {}
function __HIVE_P2_markerIndexOf() {}
function __HIVE_P2_markerPush() {}
function __HIVE_P2_markerPop() {}
function __HIVE_P2_markerCall() {}
function __HIVE_P2_markerSubstring() {}
function __HIVE_P2_markerSubstr() {}
function __HIVE_P2_markerTest() {}
function __HIVE_P2_markerExec() {}
function __HIVE_P2_markerReplace() {}
function __HIVE_P2_markerSplit() {}
const __HIVE_P2_NO_INTRINSIC = __HIVE_P2_freeze({__proto__: null});
function __HIVE_P2_registerNative(fn, tag) {
  __HIVE_P2_registerFunction(fn, 0, 0, 0, -1, false);
  __HIVE_P2_getWeak(__HIVE_P2_functions, fn).native = tag;
  return fn;
}
function __HIVE_P2_stringProperty(value, key) {
  if (key === "length") return value.length;
  const index = __HIVE_P2_arrayIndex(key);
  if (index >= 0) {
    const code = __HIVE_P2_char(value, index);
    return __HIVE_P2_finite(code) ? __HIVE_P2_codePoint(code) : undefined;
  }
  if (key === "slice") return __HIVE_P2_markerSlice;
  if (key === "charCodeAt") return __HIVE_P2_markerCharCode;
  if (key === "charAt") return __HIVE_P2_markerCharAt;
  if (key === "indexOf") return __HIVE_P2_markerIndexOf;
  if (key === "substring") return __HIVE_P2_markerSubstring;
  if (key === "substr") return __HIVE_P2_markerSubstr;
  if (key === "replace") return __HIVE_P2_markerReplace;
  if (key === "split") return __HIVE_P2_markerSplit;
  __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
}
function __HIVE_P2_arrayIndex(key) {
  if (typeof key !== "string" || key.length === 0 || key.length > 10 || key.length > 1 && __HIVE_P2_char(key, 0) === 48) return -1;
  let value = 0;
  for (let i = 0; i < key.length; i++) {
    const digit = __HIVE_P2_char(key, i) - 48;
    if (digit < 0 || digit > 9) return -1;
    value = value * 10 + digit;
  }
  return value < 4294967295 ? value : -1;
}
function __HIVE_P2_intrinsicProperty(value, key) {
  const meta = value && (typeof value === "object" || typeof value === "function") ? __HIVE_P2_getWeak(__HIVE_P2_values, value) : null;
  if (meta && (meta.kind === "ARRAY" || meta.kind === "CONTROL_ARRAY")) {
    if (key === "push") return __HIVE_P2_markerPush;
    if (key === "pop") return __HIVE_P2_markerPop;
    if (key === "slice") return __HIVE_P2_markerSlice;
    if (key === "indexOf") return __HIVE_P2_markerIndexOf;
  }
  if (meta && meta.kind === "REGEX") {
    if (key === "test") return __HIVE_P2_markerTest;
    if (key === "exec") return __HIVE_P2_markerExec;
    if (key === "source") return value.pattern;
  }
  if (typeof value === "function" && key === "call") return __HIVE_P2_markerCall;
  if (value === __HIVE_P2_Object) {
    if (key === "create") return __HIVE_P2_create;
    if (key === "keys") return __HIVE_P2_keysNative;
    if (key === "defineProperties") return __HIVE_P2_defineProperties;
    if (key === "prototype") return __HIVE_P2_objectPrototype;
    if (key === "hasOwn") return __HIVE_P2_hasOwn;
  }
  if (value === __HIVE_P2_Array && key === "isArray") return __HIVE_P2_isArray;
  if (value === __HIVE_P2_Math) {
    if (key === "floor") return __HIVE_P2_mathFloor;
    if (key === "min") return __HIVE_P2_mathMin;
    if (key === "max") return __HIVE_P2_mathMax;
  }
  if (value === __HIVE_P2_objectPrototype && key === "hasOwnProperty") return __HIVE_P2_hasOwnNative;
  if (value === __HIVE_P2_objectPrototype && key === "toString") return __HIVE_P2_toStringNative;
  if (value === __HIVE_P2_String && key === "fromCharCode") return __HIVE_P2_fromCharCode;
  return __HIVE_P2_NO_INTRINSIC;
}
function __HIVE_P2_indexOf(value, needle, start = 0) {
  const meta = value && typeof value === "object" ? __HIVE_P2_getWeak(__HIVE_P2_values, value) : null;
  if (meta && (meta.kind === "ARRAY" || meta.kind === "CONTROL_ARRAY")) {
    if (!__HIVE_P2_safe(start)) __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
    for (let i = start < 0 ? value.length + start < 0 ? 0 : value.length + start : start; i < value.length; i++) {
      __HIVE_P2_tick(); __HIVE_P2_reserve(128);
      if (__HIVE_P2_descriptor(value, __HIVE_P2_primitiveString(i)) && __HIVE_P2_get(value, i) === needle) return i;
    }
    return -1;
  }
  if (typeof value !== "string" || typeof needle !== "string" || !__HIVE_P2_safe(start)) __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  for (let i = start < 0 ? 0 : start; i <= value.length - needle.length; i++) {
    __HIVE_P2_tick();
    let matches = true;
    for (let j = 0; j < needle.length; j++) if (__HIVE_P2_char(value, i + j) !== __HIVE_P2_char(needle, j)) { matches = false; break; }
    if (matches) return i;
  }
  return -1;
}
function __HIVE_P2_native(tag, receiver, args) {
  if (tag === "scalarString") return __HIVE_P2_primitiveString(args[0]);
  if (tag === "objectTag") {
    if (receiver === null) return "[object Null]";
    if (receiver === undefined) return "[object Undefined]";
    if (typeof receiver === "string") return "[object String]";
    if (typeof receiver === "number") return "[object Number]";
    if (typeof receiver === "boolean") return "[object Boolean]";
    const meta = __HIVE_P2_getWeak(__HIVE_P2_values, receiver);
    if (!meta) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
    if (meta.kind === "ARRAY" || meta.kind === "CONTROL_ARRAY") return "[object Array]";
    if (meta.kind === "REGEX") return "[object RegExp]";
    if (meta.kind === "FUNCTION") return "[object Function]";
    return "[object Object]"; //No generic native toString/Symbol.toStringTag invocation.
  }
  if (tag === "isArray") {
    const meta = args[0] && typeof args[0] === "object" ? __HIVE_P2_getWeak(__HIVE_P2_values, args[0]) : null;
    return !!meta && (meta.kind === "ARRAY" || meta.kind === "CONTROL_ARRAY");
  }
  if (tag === "staticHasOwn") {
    if (!args[0] || !__HIVE_P2_getWeak(__HIVE_P2_values, args[0])) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
    const key = __HIVE_P2_primitiveString(args[1]);
    __HIVE_P2_reserve(128);
    return __HIVE_P2_descriptor(args[0], key) !== undefined;
  }
  if (tag === "floor") return __HIVE_P2_mathFloor(__HIVE_P2_numeric(args[0]));
  if (tag === "min" || tag === "max") {
    if (!args.length) return tag === "min" ? Infinity : -Infinity;
    let result = __HIVE_P2_numeric(args[0]);
    for (let i = 1; i < args.length; i++) {
      __HIVE_P2_tick(); const next = __HIVE_P2_numeric(args[i]);
      result = tag === "min" ? __HIVE_P2_mathMin(result, next) : __HIVE_P2_mathMax(result, next);
    }
    return result;
  }
  if (tag === "charCode") return __HIVE_P2_char(receiver, args.length ? args[0] : 0);
  if (tag === "charAt") {
    const code = __HIVE_P2_char(receiver, args.length ? args[0] : 0);
    return __HIVE_P2_finite(code) ? __HIVE_P2_codePoint(code) : "";
  }
  if (tag === "slice") {
    if (typeof receiver === "string") return __HIVE_P2_slice(receiver, args.length ? args[0] : 0, args.length > 1 ? args[1] : undefined);
    const meta = __HIVE_P2_getWeak(__HIVE_P2_values, receiver);
    if (!meta || meta.kind !== "ARRAY" && meta.kind !== "CONTROL_ARRAY") __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
    const length = receiver.length;
    let start = args.length ? args[0] : 0, end = args.length > 1 ? args[1] : length;
    if (!__HIVE_P2_safe(start) || !__HIVE_P2_safe(end)) __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
    if (start < 0) start = length + start;
    if (end < 0) end = length + end;
    if (start < 0) start = 0; else if (start > length) start = length;
    if (end < start) end = start; else if (end > length) end = length;
    __HIVE_P2_reserveArray(end - start, -1, 0);
    const copy = __HIVE_P2_ownArray(new __HIVE_P2_Array(end - start), -1, meta.kind);
    for (let i = start; i < end; i++) {
      __HIVE_P2_tick();
      const key = __HIVE_P2_primitiveString(i);
      __HIVE_P2_reserve(128);
      if (__HIVE_P2_descriptor(receiver, key)) __HIVE_P2_set(copy, i - start, __HIVE_P2_get(receiver, key));
    }
    return copy;
  }
  if (tag === "indexOf") return __HIVE_P2_indexOf(receiver, args[0], args.length > 1 ? args[1] : 0);
  if (tag === "push") { for (let i = 0; i < args.length; i++) { __HIVE_P2_tick(); __HIVE_P2_push(receiver, args[i]); } return receiver.length; }
  if (tag === "pop") {
    if (receiver.length === 0) return undefined;
    const result = __HIVE_P2_get(receiver, receiver.length - 1);
    __HIVE_P2_remove(receiver, receiver.length - 1);
    __HIVE_P2_set(receiver, "length", receiver.length - 1);
    return result;
  }
  if (tag === "call") {
    __HIVE_P2_reserveArray(args.length ? args.length - 1 : 0, -1);
    const rest = __HIVE_P2_ownArray(new __HIVE_P2_Array(args.length ? args.length - 1 : 0), -1, "CONTROL_ARRAY");
    for (let i = 1; i < args.length; i++) { __HIVE_P2_tick(); __HIVE_P2_set(rest, i - 1, args[i]); }
    return __HIVE_P2_invoke(receiver, args[0], rest);
  }
  if (tag === "keys") return __HIVE_P2_keys(args[0]);
  if (tag === "create") {
    if (args.length !== 1 || args[0] !== null) __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
    __HIVE_P2_reserveObject(0);
    return __HIVE_P2_ownObject(__HIVE_P2_create(null), -1, 0, 0);
  }
  if (tag === "fromCharCode") {
    if (args.length !== 1 || !__HIVE_P2_integer(args[0]) || args[0] > 65535) __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
    return __HIVE_P2_codePoint(args[0]);
  }
  if (tag === "hasOwn") {
    if (!receiver || !__HIVE_P2_getWeak(__HIVE_P2_values, receiver)) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
    const key = __HIVE_P2_primitiveString(args[0]);
    __HIVE_P2_reserve(128);
    return __HIVE_P2_descriptor(receiver, key) !== undefined;
  }
  if (tag === "defineProperties") {
    if (__HIVE_P2_owner !== null) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN"); //fixed initialization only.
    const target = args[0], declarations = args[1];
    const names = __HIVE_P2_keys(declarations);
    for (let i = 0; i < names.length; i++) {
      __HIVE_P2_tick();
      const source = __HIVE_P2_get(declarations, names[i]);
      const getter = __HIVE_P2_get(source, "get"), setter = __HIVE_P2_get(source, "set");
      if (getter !== undefined && !__HIVE_P2_getWeak(__HIVE_P2_functions, getter) ||
          setter !== undefined && !__HIVE_P2_getWeak(__HIVE_P2_functions, setter)) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
      __HIVE_P2_reserve(128);
      const descriptor = {__proto__: null, get: getter, set: setter,
        enumerable: !!__HIVE_P2_get(source, "enumerable"), configurable: !!__HIVE_P2_get(source, "configurable")};
      const targetMeta = __HIVE_P2_meta(target, "OBJECT", 0);
      __HIVE_P2_reserve(__HIVE_P2_plus(88, __HIVE_P2_product(names[i].length, 2)), 0, 2);
      targetMeta.fields = __HIVE_P2_plus(targetMeta.fields, 1);
      targetMeta.keyUnits = __HIVE_P2_plus(targetMeta.keyUnits, names[i].length);
      __HIVE_P2_define(target, names[i], descriptor);
    }
    return target;
  }
  if (tag === "substring") {
    let start = args.length ? args[0] : 0, end = args.length > 1 ? args[1] : receiver.length;
    if (!__HIVE_P2_safe(start) || !__HIVE_P2_safe(end)) __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
    if (start < 0) start = 0; if (end < 0) end = 0;
    if (start > end) { const swap = start; start = end; end = swap; }
    return __HIVE_P2_slice(receiver, start, end);
  }
  if (tag === "substr") {
    let start = args.length ? args[0] : 0;
    if (!__HIVE_P2_safe(start)) __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
    if (start < 0) start = receiver.length + start;
    if (start < 0) start = 0;
    const count = args.length > 1 ? args[1] : receiver.length - start;
    if (!__HIVE_P2_safe(count)) __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
    return __HIVE_P2_slice(receiver, start, count < 0 ? start : start + count);
  }
  if (tag === "test") return __HIVE_P2_testRegex(receiver, args[0]);
  if (tag === "exec") return __HIVE_P2_execRegex(receiver, args[0]);
  if (tag === "replace") return __HIVE_P2_replace(receiver, args[0], args[1]);
  if (tag === "split") return __HIVE_P2_split(receiver, args[0]);
  __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
}

function __HIVE_P2_toolRegex(raw, site) {
  if (typeof raw !== "string" || __HIVE_P2_char(raw, 0) !== 47) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  let closing = raw.length - 1;
  while (closing > 0 && __HIVE_P2_char(raw, closing) !== 47) { __HIVE_P2_tick(); closing--; }
  if (closing < 1) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  const pattern = __HIVE_P2_slice(raw, 1, closing), flags = __HIVE_P2_slice(raw, closing + 1, raw.length);
  return __HIVE_P2_regexDescriptor(raw, pattern, flags, site);
}
function __HIVE_P2_regexDescriptor(raw, pattern, flags, site) {
  __HIVE_P2_reserveObject(4);
  const value = __HIVE_P2_ownObject({__proto__: null, raw, pattern, flags, lastIndex: 0}, site, 4, 24);
  __HIVE_P2_getWeak(__HIVE_P2_values, value).kind = "REGEX";
  return value;
}
function __HIVE_P2_regexNew(args, site) {
  if (args.length < 1 || args.length > 2 || typeof args[0] !== "string" || args.length > 1 && typeof args[1] !== "string") __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  // No native RegExp is ever constructed. Keywords/Unicode-tool descriptors only;
  // target literal readRegexp is replaced with refusal BEFORE this point.
  return __HIVE_P2_regexDescriptor("", args[0], args.length > 1 ? args[1] : "", site);
}
function __HIVE_P2_testRegex(regex, value) {
  const meta = __HIVE_P2_getWeak(__HIVE_P2_values, regex);
  if (!meta || meta.kind !== "REGEX" || typeof value !== "string") __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  const pattern = regex.pattern;
  if (pattern === "^in(stanceof)?$") return value === "in" || value === "instanceof";
  if (pattern === "(?:[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF])") {
    for (let i = 0; i < value.length; i++) {
      const c = __HIVE_P2_char(value, i);
      if (c >= 55296 && c <= 56319) {
        const next = __HIVE_P2_char(value, i + 1);
        if (!(next >= 56320 && next <= 57343)) return true;
        i++;
      } else if (c >= 56320 && c <= 57343) return true;
    }
    return false;
  }
  if (pattern === "[89]") {
    for (let i = 0; i < value.length; i++) { const c = __HIVE_P2_char(value, i); if (c === 56 || c === 57) return true; }
    return false;
  }
  if (pattern === "\\r\\n?|[\\n\\u2028\\u2029]" || pattern === "[\\n\\r\\u2028\\u2029]" ||
      pattern === "\\r\\n?|\\n|\\u2028|\\u2029") {
    for (let i = 0; i < value.length; i++) { const c = __HIVE_P2_char(value, i); if (c === 10 || c === 13 || c === 8232 || c === 8233) return true; }
    return false;
  }
  if (__HIVE_P2_indexOf(pattern, "^(?:", 0) === 0 && __HIVE_P2_slice(pattern, pattern.length - 2, pattern.length) === ")$") {
    let start = 4;
    for (let i = start; i <= pattern.length - 2; i++) {
      __HIVE_P2_tick();
      if (i !== pattern.length - 2 && __HIVE_P2_char(pattern, i) !== 124) continue;
      if (i - start === value.length) {
        let equal = true;
        for (let j = 0; j < value.length; j++) if (__HIVE_P2_char(pattern, start + j) !== __HIVE_P2_char(value, j)) { equal = false; break; }
        if (equal) return true;
      }
      start = i + 1;
    }
    return false;
  }
  // Known input-independent ASCII/simple lookahead cases still need exact source
  // class rows before admission. This explicit OPEN refusal is not regex equivalence.
  __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
}
function __HIVE_P2_regexSpace(code) {
  return code === 9 || code === 10 || code === 11 || code === 12 || code === 13 ||
    code === 32 || code === 160 || code === 5760 || code >= 8192 && code <= 8202 ||
    code === 8232 || code === 8233 || code === 8239 || code === 8287 || code === 12288 || code === 65279;
}
function __HIVE_P2_execRegex(regex, value) {
  const meta = __HIVE_P2_getWeak(__HIVE_P2_values, regex);
  if (!meta || meta.kind !== "REGEX" || typeof value !== "string" ||
      regex.pattern !== "(?:\\s|\\/\\/.*|\\/\\*[^]*?\\*\\/)*" || regex.flags !== "g")
    __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  // Only the pinned global trivia expression. Unlike the Script scanner, this
  // expression never consumes HTML comments. Dot stops on all four line endings.
  let start = __HIVE_P2_numeric(regex.lastIndex);
  if (!__HIVE_P2_integer(start)) __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  if (start > value.length) { __HIVE_P2_set(regex, "lastIndex", 0); return null; }
  let position = start;
  for (;;) {
    __HIVE_P2_tick();
    const code = __HIVE_P2_char(value, position);
    if (__HIVE_P2_regexSpace(code)) { position++; continue; }
    if (code !== 47) break;
    const next = __HIVE_P2_char(value, position + 1);
    if (next === 47) {
      position += 2;
      while (position < value.length) {
        const c = __HIVE_P2_char(value, position);
        if (c === 10 || c === 13 || c === 8232 || c === 8233) break;
        position++;
      }
      continue;
    }
    if (next === 42) {
      let end = position + 2;
      while (end < value.length && !(__HIVE_P2_char(value, end) === 42 && __HIVE_P2_char(value, end + 1) === 47)) {
        __HIVE_P2_tick(); end++;
      }
      if (end >= value.length) break; //unterminated group does not match.
      position = end + 2; continue;
    }
    break;
  }
  const matched = __HIVE_P2_slice(value, start, position);
  __HIVE_P2_reserveArray(1, -1);
  const result = __HIVE_P2_ownArray(new __HIVE_P2_Array(1), -1, "CONTROL_ARRAY");
  __HIVE_P2_set(result, 0, matched); //schema16 +canonical key+occupied guard before actual fill.
  __HIVE_P2_set(result, "index", start);
  __HIVE_P2_set(result, "input", value);
  __HIVE_P2_set(regex, "lastIndex", position);
  return result;
}
function __HIVE_P2_replace(value, needle, replacement) {
  if (typeof value !== "string" || typeof replacement !== "string") __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  const meta = needle && typeof needle === "object" ? __HIVE_P2_getWeak(__HIVE_P2_values, needle) : null;
  if (!meta || meta.kind !== "REGEX") __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  const pattern = needle.pattern;
  if (pattern !== " " && pattern !== "_" && pattern !== "\\r\\n?") __HIVE_P2_refuse("ALLOCATION_COVERAGE_OPEN");
  let result = "", chunk = 0;
  for (let i = 0; i < value.length; i++) {
    __HIVE_P2_tick();
    const c = __HIVE_P2_char(value, i);
    if (pattern === " " ? c !== 32 : pattern === "_" ? c !== 95 : c !== 13) continue;
    result = __HIVE_P2_concat(result, __HIVE_P2_slice(value, chunk, i));
    result = __HIVE_P2_concat(result, replacement);
    if (pattern === "\\r\\n?" && __HIVE_P2_char(value, i + 1) === 10) i++;
    chunk = i + 1;
    if (needle.flags !== "g") break;
  }
  return __HIVE_P2_concat(result, __HIVE_P2_slice(value, chunk, value.length));
}
function __HIVE_P2_split(value, separator) {
  if (typeof value !== "string" || typeof separator !== "string" || separator.length !== 1) __HIVE_P2_refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  __HIVE_P2_reserveArray(0, -1);
  const result = __HIVE_P2_ownArray(new __HIVE_P2_Array(0), -1, "CONTROL_ARRAY");
  let start = 0;
  for (let i = 0; i <= value.length; i++) {
    __HIVE_P2_tick();
    if (i === value.length || __HIVE_P2_char(value, i) === __HIVE_P2_char(separator, 0)) {
      __HIVE_P2_push(result, __HIVE_P2_slice(value, start, i)); start = i + 1;
    }
  }
  return result;
}

__HIVE_P2_registerNative(__HIVE_P2_markerCharCode, "charCode");
__HIVE_P2_registerNative(__HIVE_P2_markerCharAt, "charAt");
__HIVE_P2_registerNative(__HIVE_P2_markerSlice, "slice");
__HIVE_P2_registerNative(__HIVE_P2_markerIndexOf, "indexOf");
__HIVE_P2_registerNative(__HIVE_P2_markerPush, "push");
__HIVE_P2_registerNative(__HIVE_P2_markerPop, "pop");
__HIVE_P2_registerNative(__HIVE_P2_markerCall, "call");
__HIVE_P2_registerNative(__HIVE_P2_create, "create");
__HIVE_P2_registerNative(__HIVE_P2_keysNative, "keys");
__HIVE_P2_registerNative(__HIVE_P2_fromCharCode, "fromCharCode");
__HIVE_P2_registerNative(__HIVE_P2_markerSubstring, "substring");
__HIVE_P2_registerNative(__HIVE_P2_markerSubstr, "substr");
__HIVE_P2_registerNative(__HIVE_P2_markerTest, "test");
__HIVE_P2_registerNative(__HIVE_P2_markerExec, "exec");
__HIVE_P2_registerNative(__HIVE_P2_markerReplace, "replace");
__HIVE_P2_registerNative(__HIVE_P2_markerSplit, "split");
__HIVE_P2_registerNative(__HIVE_P2_hasOwnNative, "hasOwn");
__HIVE_P2_registerNative(__HIVE_P2_toStringNative, "objectTag");
__HIVE_P2_registerNative(__HIVE_P2_defineProperties, "defineProperties");
__HIVE_P2_registerNative(__HIVE_P2_String, "scalarString");
__HIVE_P2_registerNative(__HIVE_P2_hasOwn, "staticHasOwn");
__HIVE_P2_registerNative(__HIVE_P2_isArray, "isArray");
__HIVE_P2_registerNative(__HIVE_P2_mathFloor, "floor");
__HIVE_P2_registerNative(__HIVE_P2_mathMin, "min");
__HIVE_P2_registerNative(__HIVE_P2_mathMax, "max");

// Closed scalar scanner hooks are private declarations. The generator counts
// their final locals/parameters and registers them before private initialization.
function __char(value, position) { return __HIVE_P2_char(value, position); }
function __slice(value, start, end) { return __HIVE_P2_slice(value, start, end); }
function __concat(left, right) { return __HIVE_P2_concat(left, right); }
function __codePoint(value) { return __HIVE_P2_codePoint(value); }
function __tick() { return __HIVE_P2_tick(); }
function __refuse(code) { return __HIVE_P2_refuse(code); }
function __number(value, radix) { return __HIVE_P2_number(value, radix); }

// Release remains false in this Builder source. The derivative, inventory and
// actual removed-guard mutation must receive independent review and trusted tuple
// admission; no public metadata flag can enable a synthetic or real parser lane.
