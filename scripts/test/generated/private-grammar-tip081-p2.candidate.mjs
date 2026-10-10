const __HIVE_P2_RUNTIME_STATIC_BYTES=376054;
const __HIVE_P2_RUNTIME_WORKSPACE_BYTES=2732736;
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
function __HIVE_P2_registerFunction(fn, locals, parameters, nested, site) {
  if (__HIVE_P2_getWeak(__HIVE_P2_functions, fn)) return fn;
  __HIVE_P2_reserve(176, 0, 1); //five-field function/frame metadata+WeakMap row.
  __HIVE_P2_setWeak(__HIVE_P2_functions, fn, {__proto__: null, locals, parameters, nested, site, native: null});
  const meta = __HIVE_P2_meta(fn, "FUNCTION", 3);
  meta.keyUnits = 19; //length6 +name4 +prototype9; retained upper bound.
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
        const meta = __HIVE_P2_meta(result, "OBJECT", 1);
        if (meta.keyUnits < 11) meta.keyUnits = 11; //implicit constructor; never reduce retained schema/key bounds.
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
  // constructor, or its private ordinary prototype read through get(). No public
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
  __HIVE_P2_registerFunction(fn, 0, 0, 0, -1);
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

function __HIVE_P2_initialize() {
    var __HIVE_P2_temp0_0, __HIVE_P2_temp0_1, __HIVE_P2_temp0_2, __HIVE_P2_temp0_3, __HIVE_P2_temp0_4, __HIVE_P2_temp0_5, __HIVE_P2_temp0_6, __HIVE_P2_temp0_7, __HIVE_P2_temp0_8, __HIVE_P2_temp0_9, __HIVE_P2_temp0_10, __HIVE_P2_temp0_11, __HIVE_P2_temp0_12, __HIVE_P2_temp0_13, __HIVE_P2_temp0_14, __HIVE_P2_temp0_15, __HIVE_P2_temp0_16, __HIVE_P2_temp0_17, __HIVE_P2_temp0_18, __HIVE_P2_temp0_19, __HIVE_P2_temp0_20, __HIVE_P2_temp0_21, __HIVE_P2_temp0_22, __HIVE_P2_temp0_23, __HIVE_P2_temp0_24, __HIVE_P2_temp0_25, __HIVE_P2_temp0_26, __HIVE_P2_temp0_27, __HIVE_P2_temp0_28, __HIVE_P2_temp0_29, __HIVE_P2_temp0_30, __HIVE_P2_temp0_31, __HIVE_P2_temp0_32, __HIVE_P2_temp0_33, __HIVE_P2_temp0_34, __HIVE_P2_temp0_35, __HIVE_P2_temp0_36, __HIVE_P2_temp0_37, __HIVE_P2_temp0_38, __HIVE_P2_temp0_39, __HIVE_P2_temp0_40, __HIVE_P2_temp0_41, __HIVE_P2_temp0_42, __HIVE_P2_temp0_43, __HIVE_P2_temp0_44, __HIVE_P2_temp0_45, __HIVE_P2_temp0_46, __HIVE_P2_temp0_47, __HIVE_P2_temp0_48, __HIVE_P2_temp0_49, __HIVE_P2_temp0_50, __HIVE_P2_temp0_51, __HIVE_P2_temp0_52, __HIVE_P2_temp0_53, __HIVE_P2_temp0_54, __HIVE_P2_temp0_55, __HIVE_P2_temp0_56, __HIVE_P2_temp0_57, __HIVE_P2_temp0_58, __HIVE_P2_temp0_59, __HIVE_P2_temp0_60, __HIVE_P2_temp0_61, __HIVE_P2_temp0_62, __HIVE_P2_temp0_63, __HIVE_P2_temp0_64, __HIVE_P2_temp0_65, __HIVE_P2_temp0_66, __HIVE_P2_temp0_67, __HIVE_P2_temp0_68, __HIVE_P2_temp0_69, __HIVE_P2_temp0_70, __HIVE_P2_temp0_71, __HIVE_P2_temp0_72, __HIVE_P2_temp0_73, __HIVE_P2_temp0_74, __HIVE_P2_temp0_75, __HIVE_P2_temp0_76, __HIVE_P2_temp0_77, __HIVE_P2_temp0_78, __HIVE_P2_temp0_79, __HIVE_P2_temp0_80, __HIVE_P2_temp0_81, __HIVE_P2_temp0_82, __HIVE_P2_temp0_83, __HIVE_P2_temp0_84, __HIVE_P2_temp0_85, __HIVE_P2_temp0_86, __HIVE_P2_temp0_87, __HIVE_P2_temp0_88, __HIVE_P2_temp0_89, __HIVE_P2_temp0_90, __HIVE_P2_temp0_91, __HIVE_P2_temp0_92, __HIVE_P2_temp0_93, __HIVE_P2_temp0_94, __HIVE_P2_temp0_95, __HIVE_P2_temp0_96, __HIVE_P2_temp0_97, __HIVE_P2_temp0_98, __HIVE_P2_temp0_99, __HIVE_P2_temp0_100, __HIVE_P2_temp0_101, __HIVE_P2_temp0_102, __HIVE_P2_temp0_103, __HIVE_P2_temp0_104, __HIVE_P2_temp0_105, __HIVE_P2_temp0_106, __HIVE_P2_temp0_107, __HIVE_P2_temp0_108, __HIVE_P2_temp0_109, __HIVE_P2_temp0_110, __HIVE_P2_temp0_111, __HIVE_P2_temp0_112, __HIVE_P2_temp0_113, __HIVE_P2_temp0_114, __HIVE_P2_temp0_115, __HIVE_P2_temp0_116, __HIVE_P2_temp0_117, __HIVE_P2_temp0_118, __HIVE_P2_temp0_119, __HIVE_P2_temp0_120, __HIVE_P2_temp0_121, __HIVE_P2_temp0_122, __HIVE_P2_temp0_123, __HIVE_P2_temp0_124, __HIVE_P2_temp0_125, __HIVE_P2_temp0_126, __HIVE_P2_temp0_127, __HIVE_P2_temp0_128, __HIVE_P2_temp0_129, __HIVE_P2_temp0_130, __HIVE_P2_temp0_131, __HIVE_P2_temp0_132, __HIVE_P2_temp0_133, __HIVE_P2_temp0_134, __HIVE_P2_temp0_135, __HIVE_P2_temp0_136, __HIVE_P2_temp0_137, __HIVE_P2_temp0_138, __HIVE_P2_temp0_139, __HIVE_P2_temp0_140, __HIVE_P2_temp0_141, __HIVE_P2_temp0_142, __HIVE_P2_temp0_143, __HIVE_P2_temp0_144, __HIVE_P2_temp0_145, __HIVE_P2_temp0_146, __HIVE_P2_temp0_147, __HIVE_P2_temp0_148, __HIVE_P2_temp0_149, __HIVE_P2_temp0_150, __HIVE_P2_temp0_151, __HIVE_P2_temp0_152, __HIVE_P2_temp0_153, __HIVE_P2_temp0_154, __HIVE_P2_temp0_155, __HIVE_P2_temp0_156, __HIVE_P2_temp0_157, __HIVE_P2_temp0_158, __HIVE_P2_temp0_159, __HIVE_P2_temp0_160, __HIVE_P2_temp0_161, __HIVE_P2_temp0_162, __HIVE_P2_temp0_163, __HIVE_P2_temp0_164, __HIVE_P2_temp0_165, __HIVE_P2_temp0_166, __HIVE_P2_temp0_167, __HIVE_P2_temp0_168, __HIVE_P2_temp0_169, __HIVE_P2_temp0_170, __HIVE_P2_temp0_171, __HIVE_P2_temp0_172, __HIVE_P2_temp0_173, __HIVE_P2_temp0_174, __HIVE_P2_temp0_175, __HIVE_P2_temp0_176, __HIVE_P2_temp0_177, __HIVE_P2_temp0_178, __HIVE_P2_temp0_179, __HIVE_P2_temp0_180, __HIVE_P2_temp0_181, __HIVE_P2_temp0_182, __HIVE_P2_temp0_183, __HIVE_P2_temp0_184, __HIVE_P2_temp0_185, __HIVE_P2_temp0_186, __HIVE_P2_temp0_187, __HIVE_P2_temp0_188, __HIVE_P2_temp0_189, __HIVE_P2_temp0_190, __HIVE_P2_temp0_191, __HIVE_P2_temp0_192, __HIVE_P2_temp0_193, __HIVE_P2_temp0_194, __HIVE_P2_temp0_195, __HIVE_P2_temp0_196, __HIVE_P2_temp0_197, __HIVE_P2_temp0_198, __HIVE_P2_temp0_199, __HIVE_P2_temp0_200, __HIVE_P2_temp0_201, __HIVE_P2_temp0_202, __HIVE_P2_temp0_203, __HIVE_P2_temp0_204, __HIVE_P2_temp0_205, __HIVE_P2_temp0_206, __HIVE_P2_temp0_207, __HIVE_P2_temp0_208, __HIVE_P2_temp0_209, __HIVE_P2_temp0_210, __HIVE_P2_temp0_211, __HIVE_P2_temp0_212, __HIVE_P2_temp0_213, __HIVE_P2_temp0_214, __HIVE_P2_temp0_215, __HIVE_P2_temp0_216, __HIVE_P2_temp0_217, __HIVE_P2_temp0_218, __HIVE_P2_temp0_219, __HIVE_P2_temp0_220, __HIVE_P2_temp0_221, __HIVE_P2_temp0_222, __HIVE_P2_temp0_223, __HIVE_P2_temp0_224, __HIVE_P2_temp0_225, __HIVE_P2_temp0_226, __HIVE_P2_temp0_227, __HIVE_P2_temp0_228, __HIVE_P2_temp0_229, __HIVE_P2_temp0_230, __HIVE_P2_temp0_231, __HIVE_P2_temp0_232, __HIVE_P2_temp0_233, __HIVE_P2_temp0_234, __HIVE_P2_temp0_235, __HIVE_P2_temp0_236, __HIVE_P2_temp0_237, __HIVE_P2_temp0_238, __HIVE_P2_temp0_239, __HIVE_P2_temp0_240, __HIVE_P2_temp0_241, __HIVE_P2_temp0_242, __HIVE_P2_temp0_243, __HIVE_P2_temp0_244, __HIVE_P2_temp0_245, __HIVE_P2_temp0_246, __HIVE_P2_temp0_247, __HIVE_P2_temp0_248, __HIVE_P2_temp0_249, __HIVE_P2_temp0_250, __HIVE_P2_temp0_251, __HIVE_P2_temp0_252, __HIVE_P2_temp0_253, __HIVE_P2_temp0_254, __HIVE_P2_temp0_255, __HIVE_P2_temp0_256, __HIVE_P2_temp0_257, __HIVE_P2_temp0_258, __HIVE_P2_temp0_259, __HIVE_P2_temp0_260, __HIVE_P2_temp0_261, __HIVE_P2_temp0_262, __HIVE_P2_temp0_263, __HIVE_P2_temp0_264, __HIVE_P2_temp0_265, __HIVE_P2_temp0_266, __HIVE_P2_temp0_267, __HIVE_P2_temp0_268, __HIVE_P2_temp0_269, __HIVE_P2_temp0_270, __HIVE_P2_temp0_271, __HIVE_P2_temp0_272, __HIVE_P2_temp0_273, __HIVE_P2_temp0_274, __HIVE_P2_temp0_275, __HIVE_P2_temp0_276, __HIVE_P2_temp0_277, __HIVE_P2_temp0_278, __HIVE_P2_temp0_279, __HIVE_P2_temp0_280, __HIVE_P2_temp0_281, __HIVE_P2_temp0_282, __HIVE_P2_temp0_283, __HIVE_P2_temp0_284, __HIVE_P2_temp0_285, __HIVE_P2_temp0_286, __HIVE_P2_temp0_287, __HIVE_P2_temp0_288, __HIVE_P2_temp0_289, __HIVE_P2_temp0_290, __HIVE_P2_temp0_291, __HIVE_P2_temp0_292, __HIVE_P2_temp0_293, __HIVE_P2_temp0_294, __HIVE_P2_temp0_295, __HIVE_P2_temp0_296, __HIVE_P2_temp0_297, __HIVE_P2_temp0_298, __HIVE_P2_temp0_299, __HIVE_P2_temp0_300, __HIVE_P2_temp0_301, __HIVE_P2_temp0_302, __HIVE_P2_temp0_303, __HIVE_P2_temp0_304, __HIVE_P2_temp0_305, __HIVE_P2_temp0_306, __HIVE_P2_temp0_307, __HIVE_P2_temp0_308, __HIVE_P2_temp0_309, __HIVE_P2_temp0_310, __HIVE_P2_temp0_311, __HIVE_P2_temp0_312, __HIVE_P2_temp0_313, __HIVE_P2_temp0_314, __HIVE_P2_temp0_315, __HIVE_P2_temp0_316, __HIVE_P2_temp0_317, __HIVE_P2_temp0_318, __HIVE_P2_temp0_319, __HIVE_P2_temp0_320, __HIVE_P2_temp0_321, __HIVE_P2_temp0_322, __HIVE_P2_temp0_323, __HIVE_P2_temp0_324, __HIVE_P2_temp0_325, __HIVE_P2_temp0_326, __HIVE_P2_temp0_327, __HIVE_P2_temp0_328, __HIVE_P2_temp0_329, __HIVE_P2_temp0_330, __HIVE_P2_temp0_331, __HIVE_P2_temp0_332, __HIVE_P2_temp0_333, __HIVE_P2_temp0_334, __HIVE_P2_temp0_335, __HIVE_P2_temp0_336, __HIVE_P2_temp0_337, __HIVE_P2_temp0_338, __HIVE_P2_temp0_339, __HIVE_P2_temp0_340, __HIVE_P2_temp0_341, __HIVE_P2_temp0_342, __HIVE_P2_temp0_343, __HIVE_P2_temp0_344, __HIVE_P2_temp0_345, __HIVE_P2_temp0_346, __HIVE_P2_temp0_347, __HIVE_P2_temp0_348, __HIVE_P2_temp0_349, __HIVE_P2_temp0_350, __HIVE_P2_temp0_351, __HIVE_P2_temp0_352, __HIVE_P2_temp0_353, __HIVE_P2_temp0_354, __HIVE_P2_temp0_355, __HIVE_P2_temp0_356, __HIVE_P2_temp0_357, __HIVE_P2_temp0_358, __HIVE_P2_temp0_359, __HIVE_P2_temp0_360, __HIVE_P2_temp0_361, __HIVE_P2_temp0_362, __HIVE_P2_temp0_363, __HIVE_P2_temp0_364, __HIVE_P2_temp0_365, __HIVE_P2_temp0_366, __HIVE_P2_temp0_367, __HIVE_P2_temp0_368, __HIVE_P2_temp0_369, __HIVE_P2_temp0_370, __HIVE_P2_temp0_371, __HIVE_P2_temp0_372, __HIVE_P2_temp0_373, __HIVE_P2_temp0_374, __HIVE_P2_temp0_375, __HIVE_P2_temp0_376, __HIVE_P2_temp0_377, __HIVE_P2_temp0_378, __HIVE_P2_temp0_379, __HIVE_P2_temp0_380, __HIVE_P2_temp0_381, __HIVE_P2_temp0_382, __HIVE_P2_temp0_383, __HIVE_P2_temp0_384, __HIVE_P2_temp0_385, __HIVE_P2_temp0_386, __HIVE_P2_temp0_387, __HIVE_P2_temp0_388, __HIVE_P2_temp0_389, __HIVE_P2_temp0_390, __HIVE_P2_temp0_391, __HIVE_P2_temp0_392, __HIVE_P2_temp0_393, __HIVE_P2_temp0_394, __HIVE_P2_temp0_395, __HIVE_P2_temp0_396, __HIVE_P2_temp0_397, __HIVE_P2_temp0_398, __HIVE_P2_temp0_399, __HIVE_P2_temp0_400, __HIVE_P2_temp0_401, __HIVE_P2_temp0_402, __HIVE_P2_temp0_403, __HIVE_P2_temp0_404, __HIVE_P2_temp0_405, __HIVE_P2_temp0_406, __HIVE_P2_temp0_407, __HIVE_P2_temp0_408, __HIVE_P2_temp0_409, __HIVE_P2_temp0_410, __HIVE_P2_temp0_411, __HIVE_P2_temp0_412, __HIVE_P2_temp0_413, __HIVE_P2_temp0_414, __HIVE_P2_temp0_415, __HIVE_P2_temp0_416, __HIVE_P2_temp0_417, __HIVE_P2_temp0_418, __HIVE_P2_temp0_419, __HIVE_P2_temp0_420, __HIVE_P2_temp0_421, __HIVE_P2_temp0_422, __HIVE_P2_temp0_423, __HIVE_P2_temp0_424, __HIVE_P2_temp0_425, __HIVE_P2_temp0_426, __HIVE_P2_temp0_427, __HIVE_P2_temp0_428, __HIVE_P2_temp0_429, __HIVE_P2_temp0_430, __HIVE_P2_temp0_431, __HIVE_P2_temp0_432, __HIVE_P2_temp0_433, __HIVE_P2_temp0_434, __HIVE_P2_temp0_435, __HIVE_P2_temp0_436, __HIVE_P2_temp0_437, __HIVE_P2_temp0_438, __HIVE_P2_temp0_439, __HIVE_P2_temp0_440, __HIVE_P2_temp0_441, __HIVE_P2_temp0_442, __HIVE_P2_temp0_443, __HIVE_P2_temp0_444, __HIVE_P2_temp0_445, __HIVE_P2_temp0_446, __HIVE_P2_temp0_447, __HIVE_P2_temp0_448, __HIVE_P2_temp0_449, __HIVE_P2_temp0_450, __HIVE_P2_temp0_451, __HIVE_P2_temp0_452, __HIVE_P2_temp0_453, __HIVE_P2_temp0_454, __HIVE_P2_temp0_455, __HIVE_P2_temp0_456, __HIVE_P2_temp0_457, __HIVE_P2_temp0_458, __HIVE_P2_temp0_459, __HIVE_P2_temp0_460, __HIVE_P2_temp0_461, __HIVE_P2_temp0_462, __HIVE_P2_temp0_463, __HIVE_P2_temp0_464, __HIVE_P2_temp0_465, __HIVE_P2_temp0_466, __HIVE_P2_temp0_467, __HIVE_P2_temp0_468, __HIVE_P2_temp0_469, __HIVE_P2_temp0_470, __HIVE_P2_temp0_471, __HIVE_P2_temp0_472, __HIVE_P2_temp0_473, __HIVE_P2_temp0_474, __HIVE_P2_temp0_475, __HIVE_P2_temp0_476, __HIVE_P2_temp0_477, __HIVE_P2_temp0_478, __HIVE_P2_temp0_479, __HIVE_P2_temp0_480, __HIVE_P2_temp0_481, __HIVE_P2_temp0_482, __HIVE_P2_temp0_483, __HIVE_P2_temp0_484, __HIVE_P2_temp0_485, __HIVE_P2_temp0_486, __HIVE_P2_temp0_487, __HIVE_P2_temp0_488, __HIVE_P2_temp0_489, __HIVE_P2_temp0_490, __HIVE_P2_temp0_491, __HIVE_P2_temp0_492, __HIVE_P2_temp0_493, __HIVE_P2_temp0_494, __HIVE_P2_temp0_495, __HIVE_P2_temp0_496, __HIVE_P2_temp0_497, __HIVE_P2_temp0_498, __HIVE_P2_temp0_499, __HIVE_P2_temp0_500, __HIVE_P2_temp0_501, __HIVE_P2_temp0_502, __HIVE_P2_temp0_503, __HIVE_P2_temp0_504, __HIVE_P2_temp0_505, __HIVE_P2_temp0_506, __HIVE_P2_temp0_507, __HIVE_P2_temp0_508, __HIVE_P2_temp0_509, __HIVE_P2_temp0_510, __HIVE_P2_temp0_511, __HIVE_P2_temp0_512, __HIVE_P2_temp0_513, __HIVE_P2_temp0_514, __HIVE_P2_temp0_515, __HIVE_P2_temp0_516, __HIVE_P2_temp0_517, __HIVE_P2_temp0_518, __HIVE_P2_temp0_519, __HIVE_P2_temp0_520, __HIVE_P2_temp0_521, __HIVE_P2_temp0_522, __HIVE_P2_temp0_523, __HIVE_P2_temp0_524, __HIVE_P2_temp0_525, __HIVE_P2_temp0_526, __HIVE_P2_temp0_527, __HIVE_P2_temp0_528, __HIVE_P2_temp0_529, __HIVE_P2_temp0_530, __HIVE_P2_temp0_531, __HIVE_P2_temp0_532, __HIVE_P2_temp0_533, __HIVE_P2_temp0_534, __HIVE_P2_temp0_535, __HIVE_P2_temp0_536, __HIVE_P2_temp0_537, __HIVE_P2_temp0_538, __HIVE_P2_temp0_539, __HIVE_P2_temp0_540, __HIVE_P2_temp0_541, __HIVE_P2_temp0_542, __HIVE_P2_temp0_543, __HIVE_P2_temp0_544, __HIVE_P2_temp0_545, __HIVE_P2_temp0_546, __HIVE_P2_temp0_547, __HIVE_P2_temp0_548, __HIVE_P2_temp0_549, __HIVE_P2_temp0_550, __HIVE_P2_temp0_551, __HIVE_P2_temp0_552, __HIVE_P2_temp0_553, __HIVE_P2_temp0_554, __HIVE_P2_temp0_555, __HIVE_P2_temp0_556, __HIVE_P2_temp0_557, __HIVE_P2_temp0_558, __HIVE_P2_temp0_559, __HIVE_P2_temp0_560, __HIVE_P2_temp0_561, __HIVE_P2_temp0_562, __HIVE_P2_temp0_563, __HIVE_P2_temp0_564, __HIVE_P2_temp0_565, __HIVE_P2_temp0_566, __HIVE_P2_temp0_567, __HIVE_P2_temp0_568, __HIVE_P2_temp0_569, __HIVE_P2_temp0_570, __HIVE_P2_temp0_571, __HIVE_P2_temp0_572, __HIVE_P2_temp0_573, __HIVE_P2_temp0_574, __HIVE_P2_temp0_575, __HIVE_P2_temp0_576, __HIVE_P2_temp0_577, __HIVE_P2_temp0_578, __HIVE_P2_temp0_579, __HIVE_P2_temp0_580, __HIVE_P2_temp0_581, __HIVE_P2_temp0_582, __HIVE_P2_temp0_583, __HIVE_P2_temp0_584, __HIVE_P2_temp0_585, __HIVE_P2_temp0_586, __HIVE_P2_temp0_587, __HIVE_P2_temp0_588, __HIVE_P2_temp0_589, __HIVE_P2_temp0_590, __HIVE_P2_temp0_591, __HIVE_P2_temp0_592, __HIVE_P2_temp0_593, __HIVE_P2_temp0_594, __HIVE_P2_temp0_595, __HIVE_P2_temp0_596, __HIVE_P2_temp0_597, __HIVE_P2_temp0_598, __HIVE_P2_temp0_599, __HIVE_P2_temp0_600, __HIVE_P2_temp0_601, __HIVE_P2_temp0_602, __HIVE_P2_temp0_603, __HIVE_P2_temp0_604, __HIVE_P2_temp0_605, __HIVE_P2_temp0_606, __HIVE_P2_temp0_607, __HIVE_P2_temp0_608, __HIVE_P2_temp0_609, __HIVE_P2_temp0_610, __HIVE_P2_temp0_611, __HIVE_P2_temp0_612, __HIVE_P2_temp0_613, __HIVE_P2_temp0_614, __HIVE_P2_temp0_615, __HIVE_P2_temp0_616, __HIVE_P2_temp0_617, __HIVE_P2_temp0_618, __HIVE_P2_temp0_619, __HIVE_P2_temp0_620, __HIVE_P2_temp0_621, __HIVE_P2_temp0_622, __HIVE_P2_temp0_623, __HIVE_P2_temp0_624, __HIVE_P2_temp0_625, __HIVE_P2_temp0_626, __HIVE_P2_temp0_627, __HIVE_P2_temp0_628, __HIVE_P2_temp0_629, __HIVE_P2_temp0_630, __HIVE_P2_temp0_631, __HIVE_P2_temp0_632, __HIVE_P2_temp0_633, __HIVE_P2_temp0_634, __HIVE_P2_temp0_635, __HIVE_P2_temp0_636, __HIVE_P2_temp0_637, __HIVE_P2_temp0_638, __HIVE_P2_temp0_639, __HIVE_P2_temp0_640, __HIVE_P2_temp0_641, __HIVE_P2_temp0_642, __HIVE_P2_temp0_643, __HIVE_P2_temp0_644, __HIVE_P2_temp0_645, __HIVE_P2_temp0_646, __HIVE_P2_temp0_647, __HIVE_P2_temp0_648, __HIVE_P2_temp0_649, __HIVE_P2_temp0_650, __HIVE_P2_temp0_651, __HIVE_P2_temp0_652, __HIVE_P2_temp0_653, __HIVE_P2_temp0_654, __HIVE_P2_temp0_655, __HIVE_P2_temp0_656, __HIVE_P2_temp0_657, __HIVE_P2_temp0_658, __HIVE_P2_temp0_659, __HIVE_P2_temp0_660, __HIVE_P2_temp0_661, __HIVE_P2_temp0_662, __HIVE_P2_temp0_663, __HIVE_P2_temp0_664, __HIVE_P2_temp0_665, __HIVE_P2_temp0_666, __HIVE_P2_temp0_667, __HIVE_P2_temp0_668, __HIVE_P2_temp0_669, __HIVE_P2_temp0_670, __HIVE_P2_temp0_671, __HIVE_P2_temp0_672, __HIVE_P2_temp0_673, __HIVE_P2_temp0_674, __HIVE_P2_temp0_675, __HIVE_P2_temp0_676, __HIVE_P2_temp0_677, __HIVE_P2_temp0_678, __HIVE_P2_temp0_679, __HIVE_P2_temp0_680, __HIVE_P2_temp0_681, __HIVE_P2_temp0_682, __HIVE_P2_temp0_683, __HIVE_P2_temp0_684, __HIVE_P2_temp0_685, __HIVE_P2_temp0_686, __HIVE_P2_temp0_687, __HIVE_P2_temp0_688, __HIVE_P2_temp0_689, __HIVE_P2_temp0_690, __HIVE_P2_temp0_691, __HIVE_P2_temp0_692, __HIVE_P2_temp0_693, __HIVE_P2_temp0_694, __HIVE_P2_temp0_695, __HIVE_P2_temp0_696, __HIVE_P2_temp0_697, __HIVE_P2_temp0_698, __HIVE_P2_temp0_699, __HIVE_P2_temp0_700, __HIVE_P2_temp0_701, __HIVE_P2_temp0_702, __HIVE_P2_temp0_703, __HIVE_P2_temp0_704, __HIVE_P2_temp0_705, __HIVE_P2_temp0_706, __HIVE_P2_temp0_707, __HIVE_P2_temp0_708, __HIVE_P2_temp0_709, __HIVE_P2_temp0_710, __HIVE_P2_temp0_711, __HIVE_P2_temp0_712, __HIVE_P2_temp0_713, __HIVE_P2_temp0_714, __HIVE_P2_temp0_715, __HIVE_P2_temp0_716, __HIVE_P2_temp0_717, __HIVE_P2_temp0_718, __HIVE_P2_temp0_719, __HIVE_P2_temp0_720, __HIVE_P2_temp0_721, __HIVE_P2_temp0_722, __HIVE_P2_temp0_723, __HIVE_P2_temp0_724, __HIVE_P2_temp0_725, __HIVE_P2_temp0_726, __HIVE_P2_temp0_727, __HIVE_P2_temp0_728, __HIVE_P2_temp0_729, __HIVE_P2_temp0_730, __HIVE_P2_temp0_731, __HIVE_P2_temp0_732, __HIVE_P2_temp0_733, __HIVE_P2_temp0_734, __HIVE_P2_temp0_735, __HIVE_P2_temp0_736, __HIVE_P2_temp0_737, __HIVE_P2_temp0_738, __HIVE_P2_temp0_739, __HIVE_P2_temp0_740, __HIVE_P2_temp0_741, __HIVE_P2_temp0_742, __HIVE_P2_temp0_743, __HIVE_P2_temp0_744, __HIVE_P2_temp0_745, __HIVE_P2_temp0_746, __HIVE_P2_temp0_747, __HIVE_P2_temp0_748, __HIVE_P2_temp0_749, __HIVE_P2_temp0_750, __HIVE_P2_temp0_751, __HIVE_P2_temp0_752, __HIVE_P2_temp0_753, __HIVE_P2_temp0_754, __HIVE_P2_temp0_755, __HIVE_P2_temp0_756, __HIVE_P2_temp0_757, __HIVE_P2_temp0_758, __HIVE_P2_temp0_759, __HIVE_P2_temp0_760, __HIVE_P2_temp0_761, __HIVE_P2_temp0_762, __HIVE_P2_temp0_763, __HIVE_P2_temp0_764, __HIVE_P2_temp0_765, __HIVE_P2_temp0_766, __HIVE_P2_temp0_767, __HIVE_P2_temp0_768, __HIVE_P2_temp0_769, __HIVE_P2_temp0_770, __HIVE_P2_temp0_771, __HIVE_P2_temp0_772, __HIVE_P2_temp0_773, __HIVE_P2_temp0_774, __HIVE_P2_temp0_775, __HIVE_P2_temp0_776, __HIVE_P2_temp0_777, __HIVE_P2_temp0_778, __HIVE_P2_temp0_779, __HIVE_P2_temp0_780, __HIVE_P2_temp0_781, __HIVE_P2_temp0_782, __HIVE_P2_temp0_783, __HIVE_P2_temp0_784, __HIVE_P2_temp0_785, __HIVE_P2_temp0_786, __HIVE_P2_temp0_787, __HIVE_P2_temp0_788, __HIVE_P2_temp0_789, __HIVE_P2_temp0_790, __HIVE_P2_temp0_791, __HIVE_P2_temp0_792, __HIVE_P2_temp0_793, __HIVE_P2_temp0_794, __HIVE_P2_temp0_795, __HIVE_P2_temp0_796, __HIVE_P2_temp0_797, __HIVE_P2_temp0_798, __HIVE_P2_temp0_799, __HIVE_P2_temp0_800, __HIVE_P2_temp0_801, __HIVE_P2_temp0_802, __HIVE_P2_temp0_803, __HIVE_P2_temp0_804, __HIVE_P2_temp0_805, __HIVE_P2_temp0_806, __HIVE_P2_temp0_807, __HIVE_P2_temp0_808, __HIVE_P2_temp0_809, __HIVE_P2_temp0_810, __HIVE_P2_temp0_811, __HIVE_P2_temp0_812, __HIVE_P2_temp0_813, __HIVE_P2_temp0_814, __HIVE_P2_temp0_815, __HIVE_P2_temp0_816, __HIVE_P2_temp0_817, __HIVE_P2_temp0_818, __HIVE_P2_temp0_819, __HIVE_P2_temp0_820, __HIVE_P2_temp0_821, __HIVE_P2_temp0_822, __HIVE_P2_temp0_823, __HIVE_P2_temp0_824, __HIVE_P2_temp0_825, __HIVE_P2_temp0_826, __HIVE_P2_temp0_827, __HIVE_P2_temp0_828, __HIVE_P2_temp0_829, __HIVE_P2_temp0_830, __HIVE_P2_temp0_831, __HIVE_P2_temp0_832, __HIVE_P2_temp0_833, __HIVE_P2_temp0_834, __HIVE_P2_temp0_835, __HIVE_P2_temp0_836, __HIVE_P2_temp0_837, __HIVE_P2_temp0_838, __HIVE_P2_temp0_839, __HIVE_P2_temp0_840, __HIVE_P2_temp0_841, __HIVE_P2_temp0_842, __HIVE_P2_temp0_843, __HIVE_P2_temp0_844, __HIVE_P2_temp0_845, __HIVE_P2_temp0_846, __HIVE_P2_temp0_847, __HIVE_P2_temp0_848, __HIVE_P2_temp0_849, __HIVE_P2_temp0_850, __HIVE_P2_temp0_851, __HIVE_P2_temp0_852, __HIVE_P2_temp0_853, __HIVE_P2_temp0_854, __HIVE_P2_temp0_855, __HIVE_P2_temp0_856, __HIVE_P2_temp0_857, __HIVE_P2_temp0_858, __HIVE_P2_temp0_859, __HIVE_P2_temp0_860, __HIVE_P2_temp0_861, __HIVE_P2_temp0_862, __HIVE_P2_temp0_863, __HIVE_P2_temp0_864, __HIVE_P2_temp0_865, __HIVE_P2_temp0_866, __HIVE_P2_temp0_867, __HIVE_P2_temp0_868, __HIVE_P2_temp0_869, __HIVE_P2_temp0_870, __HIVE_P2_temp0_871, __HIVE_P2_temp0_872, __HIVE_P2_temp0_873, __HIVE_P2_temp0_874, __HIVE_P2_temp0_875, __HIVE_P2_temp0_876, __HIVE_P2_temp0_877, __HIVE_P2_temp0_878, __HIVE_P2_temp0_879, __HIVE_P2_temp0_880, __HIVE_P2_temp0_881, __HIVE_P2_temp0_882, __HIVE_P2_temp0_883, __HIVE_P2_temp0_884, __HIVE_P2_temp0_885, __HIVE_P2_temp0_886, __HIVE_P2_temp0_887, __HIVE_P2_temp0_888, __HIVE_P2_temp0_889, __HIVE_P2_temp0_890, __HIVE_P2_temp0_891, __HIVE_P2_temp0_892, __HIVE_P2_temp0_893, __HIVE_P2_temp0_894, __HIVE_P2_temp0_895, __HIVE_P2_temp0_896, __HIVE_P2_temp0_897, __HIVE_P2_temp0_898, __HIVE_P2_temp0_899, __HIVE_P2_temp0_900, __HIVE_P2_temp0_901, __HIVE_P2_temp0_902, __HIVE_P2_temp0_903, __HIVE_P2_temp0_904, __HIVE_P2_temp0_905, __HIVE_P2_temp0_906, __HIVE_P2_temp0_907, __HIVE_P2_temp0_908, __HIVE_P2_temp0_909, __HIVE_P2_temp0_910, __HIVE_P2_temp0_911, __HIVE_P2_temp0_912, __HIVE_P2_temp0_913, __HIVE_P2_temp0_914, __HIVE_P2_temp0_915, __HIVE_P2_temp0_916, __HIVE_P2_temp0_917, __HIVE_P2_temp0_918, __HIVE_P2_temp0_919, __HIVE_P2_temp0_920, __HIVE_P2_temp0_921, __HIVE_P2_temp0_922, __HIVE_P2_temp0_923, __HIVE_P2_temp0_924, __HIVE_P2_temp0_925, __HIVE_P2_temp0_926, __HIVE_P2_temp0_927, __HIVE_P2_temp0_928, __HIVE_P2_temp0_929, __HIVE_P2_temp0_930, __HIVE_P2_temp0_931, __HIVE_P2_temp0_932, __HIVE_P2_temp0_933, __HIVE_P2_temp0_934, __HIVE_P2_temp0_935, __HIVE_P2_temp0_936, __HIVE_P2_temp0_937, __HIVE_P2_temp0_938, __HIVE_P2_temp0_939, __HIVE_P2_temp0_940, __HIVE_P2_temp0_941, __HIVE_P2_temp0_942, __HIVE_P2_temp0_943, __HIVE_P2_temp0_944, __HIVE_P2_temp0_945, __HIVE_P2_temp0_946, __HIVE_P2_temp0_947, __HIVE_P2_temp0_948, __HIVE_P2_temp0_949, __HIVE_P2_temp0_950, __HIVE_P2_temp0_951, __HIVE_P2_temp0_952, __HIVE_P2_temp0_953, __HIVE_P2_temp0_954, __HIVE_P2_temp0_955, __HIVE_P2_temp0_956, __HIVE_P2_temp0_957, __HIVE_P2_temp0_958, __HIVE_P2_temp0_959, __HIVE_P2_temp0_960, __HIVE_P2_temp0_961, __HIVE_P2_temp0_962, __HIVE_P2_temp0_963, __HIVE_P2_temp0_964, __HIVE_P2_temp0_965, __HIVE_P2_temp0_966, __HIVE_P2_temp0_967, __HIVE_P2_temp0_968, __HIVE_P2_temp0_969, __HIVE_P2_temp0_970, __HIVE_P2_temp0_971, __HIVE_P2_temp0_972, __HIVE_P2_temp0_973, __HIVE_P2_temp0_974, __HIVE_P2_temp0_975, __HIVE_P2_temp0_976, __HIVE_P2_temp0_977, __HIVE_P2_temp0_978, __HIVE_P2_temp0_979, __HIVE_P2_temp0_980, __HIVE_P2_temp0_981, __HIVE_P2_temp0_982, __HIVE_P2_temp0_983, __HIVE_P2_temp0_984, __HIVE_P2_temp0_985, __HIVE_P2_temp0_986, __HIVE_P2_temp0_987, __HIVE_P2_temp0_988, __HIVE_P2_temp0_989, __HIVE_P2_temp0_990, __HIVE_P2_temp0_991, __HIVE_P2_temp0_992, __HIVE_P2_temp0_993, __HIVE_P2_temp0_994, __HIVE_P2_temp0_995, __HIVE_P2_temp0_996, __HIVE_P2_temp0_997, __HIVE_P2_temp0_998, __HIVE_P2_temp0_999, __HIVE_P2_temp0_1000, __HIVE_P2_temp0_1001, __HIVE_P2_temp0_1002, __HIVE_P2_temp0_1003, __HIVE_P2_temp0_1004, __HIVE_P2_temp0_1005, __HIVE_P2_temp0_1006, __HIVE_P2_temp0_1007, __HIVE_P2_temp0_1008, __HIVE_P2_temp0_1009, __HIVE_P2_temp0_1010, __HIVE_P2_temp0_1011, __HIVE_P2_temp0_1012, __HIVE_P2_temp0_1013, __HIVE_P2_temp0_1014, __HIVE_P2_temp0_1015, __HIVE_P2_temp0_1016, __HIVE_P2_temp0_1017, __HIVE_P2_temp0_1018, __HIVE_P2_temp0_1019, __HIVE_P2_temp0_1020, __HIVE_P2_temp0_1021, __HIVE_P2_temp0_1022, __HIVE_P2_temp0_1023, __HIVE_P2_temp0_1024, __HIVE_P2_temp0_1025, __HIVE_P2_temp0_1026, __HIVE_P2_temp0_1027, __HIVE_P2_temp0_1028, __HIVE_P2_temp0_1029, __HIVE_P2_temp0_1030, __HIVE_P2_temp0_1031, __HIVE_P2_temp0_1032, __HIVE_P2_temp0_1033, __HIVE_P2_temp0_1034, __HIVE_P2_temp0_1035, __HIVE_P2_temp0_1036, __HIVE_P2_temp0_1037, __HIVE_P2_temp0_1038, __HIVE_P2_temp0_1039, __HIVE_P2_temp0_1040, __HIVE_P2_temp0_1041, __HIVE_P2_temp0_1042, __HIVE_P2_temp0_1043, __HIVE_P2_temp0_1044, __HIVE_P2_temp0_1045, __HIVE_P2_temp0_1046, __HIVE_P2_temp0_1047, __HIVE_P2_temp0_1048, __HIVE_P2_temp0_1049, __HIVE_P2_temp0_1050, __HIVE_P2_temp0_1051, __HIVE_P2_temp0_1052, __HIVE_P2_temp0_1053, __HIVE_P2_temp0_1054, __HIVE_P2_temp0_1055, __HIVE_P2_temp0_1056, __HIVE_P2_temp0_1057, __HIVE_P2_temp0_1058, __HIVE_P2_temp0_1059, __HIVE_P2_temp0_1060, __HIVE_P2_temp0_1061, __HIVE_P2_temp0_1062, __HIVE_P2_temp0_1063, __HIVE_P2_temp0_1064, __HIVE_P2_temp0_1065, __HIVE_P2_temp0_1066, __HIVE_P2_temp0_1067, __HIVE_P2_temp0_1068, __HIVE_P2_temp0_1069, __HIVE_P2_temp0_1070, __HIVE_P2_temp0_1071, __HIVE_P2_temp0_1072, __HIVE_P2_temp0_1073, __HIVE_P2_temp0_1074, __HIVE_P2_temp0_1075, __HIVE_P2_temp0_1076, __HIVE_P2_temp0_1077, __HIVE_P2_temp0_1078, __HIVE_P2_temp0_1079, __HIVE_P2_temp0_1080, __HIVE_P2_temp0_1081, __HIVE_P2_temp0_1082, __HIVE_P2_temp0_1083, __HIVE_P2_temp0_1084, __HIVE_P2_temp0_1085, __HIVE_P2_temp0_1086, __HIVE_P2_temp0_1087, __HIVE_P2_temp0_1088, __HIVE_P2_temp0_1089, __HIVE_P2_temp0_1090, __HIVE_P2_temp0_1091, __HIVE_P2_temp0_1092, __HIVE_P2_temp0_1093, __HIVE_P2_temp0_1094, __HIVE_P2_temp0_1095, __HIVE_P2_temp0_1096, __HIVE_P2_temp0_1097, __HIVE_P2_temp0_1098, __HIVE_P2_temp0_1099, __HIVE_P2_temp0_1100, __HIVE_P2_temp0_1101, __HIVE_P2_temp0_1102, __HIVE_P2_temp0_1103, __HIVE_P2_temp0_1104, __HIVE_P2_temp0_1105, __HIVE_P2_temp0_1106, __HIVE_P2_temp0_1107, __HIVE_P2_temp0_1108, __HIVE_P2_temp0_1109, __HIVE_P2_temp0_1110, __HIVE_P2_temp0_1111, __HIVE_P2_temp0_1112, __HIVE_P2_temp0_1113, __HIVE_P2_temp0_1114, __HIVE_P2_temp0_1115, __HIVE_P2_temp0_1116, __HIVE_P2_temp0_1117, __HIVE_P2_temp0_1118, __HIVE_P2_temp0_1119, __HIVE_P2_temp0_1120, __HIVE_P2_temp0_1121, __HIVE_P2_temp0_1122, __HIVE_P2_temp0_1123, __HIVE_P2_temp0_1124, __HIVE_P2_temp0_1125, __HIVE_P2_temp0_1126, __HIVE_P2_temp0_1127, __HIVE_P2_temp0_1128, __HIVE_P2_temp0_1129, __HIVE_P2_temp0_1130, __HIVE_P2_temp0_1131, __HIVE_P2_temp0_1132, __HIVE_P2_temp0_1133, __HIVE_P2_temp0_1134, __HIVE_P2_temp0_1135, __HIVE_P2_temp0_1136, __HIVE_P2_temp0_1137, __HIVE_P2_temp0_1138, __HIVE_P2_temp0_1139, __HIVE_P2_temp0_1140, __HIVE_P2_temp0_1141, __HIVE_P2_temp0_1142, __HIVE_P2_temp0_1143, __HIVE_P2_temp0_1144, __HIVE_P2_temp0_1145, __HIVE_P2_temp0_1146, __HIVE_P2_temp0_1147, __HIVE_P2_temp0_1148, __HIVE_P2_temp0_1149, __HIVE_P2_temp0_1150, __HIVE_P2_temp0_1151, __HIVE_P2_temp0_1152, __HIVE_P2_temp0_1153, __HIVE_P2_temp0_1154, __HIVE_P2_temp0_1155, __HIVE_P2_temp0_1156, __HIVE_P2_temp0_1157, __HIVE_P2_temp0_1158, __HIVE_P2_temp0_1159, __HIVE_P2_temp0_1160, __HIVE_P2_temp0_1161, __HIVE_P2_temp0_1162, __HIVE_P2_temp0_1163, __HIVE_P2_temp0_1164, __HIVE_P2_temp0_1165, __HIVE_P2_temp0_1166, __HIVE_P2_temp0_1167, __HIVE_P2_temp0_1168, __HIVE_P2_temp0_1169, __HIVE_P2_temp0_1170, __HIVE_P2_temp0_1171, __HIVE_P2_temp0_1172, __HIVE_P2_temp0_1173, __HIVE_P2_temp0_1174, __HIVE_P2_temp0_1175, __HIVE_P2_temp0_1176, __HIVE_P2_temp0_1177, __HIVE_P2_temp0_1178, __HIVE_P2_temp0_1179, __HIVE_P2_temp0_1180, __HIVE_P2_temp0_1181, __HIVE_P2_temp0_1182, __HIVE_P2_temp0_1183, __HIVE_P2_temp0_1184, __HIVE_P2_temp0_1185, __HIVE_P2_temp0_1186, __HIVE_P2_temp0_1187, __HIVE_P2_temp0_1188, __HIVE_P2_temp0_1189, __HIVE_P2_temp0_1190, __HIVE_P2_temp0_1191, __HIVE_P2_temp0_1192, __HIVE_P2_temp0_1193, __HIVE_P2_temp0_1194, __HIVE_P2_temp0_1195, __HIVE_P2_temp0_1196, __HIVE_P2_temp0_1197, __HIVE_P2_temp0_1198, __HIVE_P2_temp0_1199, __HIVE_P2_temp0_1200, __HIVE_P2_temp0_1201, __HIVE_P2_temp0_1202, __HIVE_P2_temp0_1203, __HIVE_P2_temp0_1204, __HIVE_P2_temp0_1205, __HIVE_P2_temp0_1206, __HIVE_P2_temp0_1207, __HIVE_P2_temp0_1208, __HIVE_P2_temp0_1209, __HIVE_P2_temp0_1210, __HIVE_P2_temp0_1211, __HIVE_P2_temp0_1212, __HIVE_P2_temp0_1213, __HIVE_P2_temp0_1214, __HIVE_P2_temp0_1215, __HIVE_P2_temp0_1216, __HIVE_P2_temp0_1217, __HIVE_P2_temp0_1218, __HIVE_P2_temp0_1219, __HIVE_P2_temp0_1220, __HIVE_P2_temp0_1221, __HIVE_P2_temp0_1222, __HIVE_P2_temp0_1223, __HIVE_P2_temp0_1224, __HIVE_P2_temp0_1225, __HIVE_P2_temp0_1226, __HIVE_P2_temp0_1227, __HIVE_P2_temp0_1228, __HIVE_P2_temp0_1229, __HIVE_P2_temp0_1230, __HIVE_P2_temp0_1231, __HIVE_P2_temp0_1232, __HIVE_P2_temp0_1233, __HIVE_P2_temp0_1234, __HIVE_P2_temp0_1235, __HIVE_P2_temp0_1236, __HIVE_P2_temp0_1237, __HIVE_P2_temp0_1238, __HIVE_P2_temp0_1239, __HIVE_P2_temp0_1240, __HIVE_P2_temp0_1241, __HIVE_P2_temp0_1242, __HIVE_P2_temp0_1243, __HIVE_P2_temp0_1244, __HIVE_P2_temp0_1245, __HIVE_P2_temp0_1246, __HIVE_P2_temp0_1247, __HIVE_P2_temp0_1248, __HIVE_P2_temp0_1249, __HIVE_P2_temp0_1250, __HIVE_P2_temp0_1251, __HIVE_P2_temp0_1252, __HIVE_P2_temp0_1253, __HIVE_P2_temp0_1254, __HIVE_P2_temp0_1255, __HIVE_P2_temp0_1256, __HIVE_P2_temp0_1257, __HIVE_P2_temp0_1258, __HIVE_P2_temp0_1259, __HIVE_P2_temp0_1260, __HIVE_P2_temp0_1261, __HIVE_P2_temp0_1262, __HIVE_P2_temp0_1263, __HIVE_P2_temp0_1264, __HIVE_P2_temp0_1265, __HIVE_P2_temp0_1266, __HIVE_P2_temp0_1267, __HIVE_P2_temp0_1268, __HIVE_P2_temp0_1269, __HIVE_P2_temp0_1270, __HIVE_P2_temp0_1271, __HIVE_P2_temp0_1272, __HIVE_P2_temp0_1273, __HIVE_P2_temp0_1274, __HIVE_P2_temp0_1275, __HIVE_P2_temp0_1276, __HIVE_P2_temp0_1277, __HIVE_P2_temp0_1278, __HIVE_P2_temp0_1279, __HIVE_P2_temp0_1280, __HIVE_P2_temp0_1281, __HIVE_P2_temp0_1282, __HIVE_P2_temp0_1283, __HIVE_P2_temp0_1284, __HIVE_P2_temp0_1285, __HIVE_P2_temp0_1286, __HIVE_P2_temp0_1287, __HIVE_P2_temp0_1288, __HIVE_P2_temp0_1289, __HIVE_P2_temp0_1290, __HIVE_P2_temp0_1291, __HIVE_P2_temp0_1292, __HIVE_P2_temp0_1293, __HIVE_P2_temp0_1294, __HIVE_P2_temp0_1295, __HIVE_P2_temp0_1296, __HIVE_P2_temp0_1297, __HIVE_P2_temp0_1298, __HIVE_P2_temp0_1299, __HIVE_P2_temp0_1300, __HIVE_P2_temp0_1301, __HIVE_P2_temp0_1302, __HIVE_P2_temp0_1303, __HIVE_P2_temp0_1304, __HIVE_P2_temp0_1305, __HIVE_P2_temp0_1306, __HIVE_P2_temp0_1307, __HIVE_P2_temp0_1308, __HIVE_P2_temp0_1309, __HIVE_P2_temp0_1310, __HIVE_P2_temp0_1311, __HIVE_P2_temp0_1312, __HIVE_P2_temp0_1313, __HIVE_P2_temp0_1314, __HIVE_P2_temp0_1315, __HIVE_P2_temp0_1316, __HIVE_P2_temp0_1317, __HIVE_P2_temp0_1318, __HIVE_P2_temp0_1319, __HIVE_P2_temp0_1320, __HIVE_P2_temp0_1321, __HIVE_P2_temp0_1322, __HIVE_P2_temp0_1323, __HIVE_P2_temp0_1324, __HIVE_P2_temp0_1325, __HIVE_P2_temp0_1326, __HIVE_P2_temp0_1327, __HIVE_P2_temp0_1328, __HIVE_P2_temp0_1329, __HIVE_P2_temp0_1330, __HIVE_P2_temp0_1331, __HIVE_P2_temp0_1332, __HIVE_P2_temp0_1333, __HIVE_P2_temp0_1334, __HIVE_P2_temp0_1335, __HIVE_P2_temp0_1336, __HIVE_P2_temp0_1337, __HIVE_P2_temp0_1338, __HIVE_P2_temp0_1339, __HIVE_P2_temp0_1340, __HIVE_P2_temp0_1341, __HIVE_P2_temp0_1342, __HIVE_P2_temp0_1343, __HIVE_P2_temp0_1344, __HIVE_P2_temp0_1345, __HIVE_P2_temp0_1346, __HIVE_P2_temp0_1347, __HIVE_P2_temp0_1348, __HIVE_P2_temp0_1349, __HIVE_P2_temp0_1350, __HIVE_P2_temp0_1351, __HIVE_P2_temp0_1352, __HIVE_P2_temp0_1353, __HIVE_P2_temp0_1354, __HIVE_P2_temp0_1355, __HIVE_P2_temp0_1356, __HIVE_P2_temp0_1357, __HIVE_P2_temp0_1358, __HIVE_P2_temp0_1359, __HIVE_P2_temp0_1360, __HIVE_P2_temp0_1361, __HIVE_P2_temp0_1362, __HIVE_P2_temp0_1363, __HIVE_P2_temp0_1364, __HIVE_P2_temp0_1365, __HIVE_P2_temp0_1366, __HIVE_P2_temp0_1367, __HIVE_P2_temp0_1368, __HIVE_P2_temp0_1369, __HIVE_P2_temp0_1370, __HIVE_P2_temp0_1371, __HIVE_P2_temp0_1372, __HIVE_P2_temp0_1373, __HIVE_P2_temp0_1374, __HIVE_P2_temp0_1375, __HIVE_P2_temp0_1376, __HIVE_P2_temp0_1377, __HIVE_P2_temp0_1378, __HIVE_P2_temp0_1379, __HIVE_P2_temp0_1380, __HIVE_P2_temp0_1381, __HIVE_P2_temp0_1382, __HIVE_P2_temp0_1383, __HIVE_P2_temp0_1384, __HIVE_P2_temp0_1385, __HIVE_P2_temp0_1386, __HIVE_P2_temp0_1387, __HIVE_P2_temp0_1388, __HIVE_P2_temp0_1389, __HIVE_P2_temp0_1390, __HIVE_P2_temp0_1391, __HIVE_P2_temp0_1392, __HIVE_P2_temp0_1393, __HIVE_P2_temp0_1394, __HIVE_P2_temp0_1395, __HIVE_P2_temp0_1396, __HIVE_P2_temp0_1397, __HIVE_P2_temp0_1398, __HIVE_P2_temp0_1399, __HIVE_P2_temp0_1400, __HIVE_P2_temp0_1401, __HIVE_P2_temp0_1402, __HIVE_P2_temp0_1403, __HIVE_P2_temp0_1404, __HIVE_P2_temp0_1405, __HIVE_P2_temp0_1406, __HIVE_P2_temp0_1407, __HIVE_P2_temp0_1408, __HIVE_P2_temp0_1409, __HIVE_P2_temp0_1410, __HIVE_P2_temp0_1411, __HIVE_P2_temp0_1412, __HIVE_P2_temp0_1413, __HIVE_P2_temp0_1414, __HIVE_P2_temp0_1415, __HIVE_P2_temp0_1416, __HIVE_P2_temp0_1417, __HIVE_P2_temp0_1418, __HIVE_P2_temp0_1419, __HIVE_P2_temp0_1420, __HIVE_P2_temp0_1421, __HIVE_P2_temp0_1422, __HIVE_P2_temp0_1423, __HIVE_P2_temp0_1424, __HIVE_P2_temp0_1425, __HIVE_P2_temp0_1426, __HIVE_P2_temp0_1427, __HIVE_P2_temp0_1428, __HIVE_P2_temp0_1429, __HIVE_P2_temp0_1430, __HIVE_P2_temp0_1431, __HIVE_P2_temp0_1432, __HIVE_P2_temp0_1433, __HIVE_P2_temp0_1434, __HIVE_P2_temp0_1435, __HIVE_P2_temp0_1436, __HIVE_P2_temp0_1437, __HIVE_P2_temp0_1438, __HIVE_P2_temp0_1439, __HIVE_P2_temp0_1440, __HIVE_P2_temp0_1441, __HIVE_P2_temp0_1442, __HIVE_P2_temp0_1443, __HIVE_P2_temp0_1444, __HIVE_P2_temp0_1445, __HIVE_P2_temp0_1446, __HIVE_P2_temp0_1447, __HIVE_P2_temp0_1448, __HIVE_P2_temp0_1449, __HIVE_P2_temp0_1450, __HIVE_P2_temp0_1451, __HIVE_P2_temp0_1452, __HIVE_P2_temp0_1453, __HIVE_P2_temp0_1454, __HIVE_P2_temp0_1455, __HIVE_P2_temp0_1456, __HIVE_P2_temp0_1457, __HIVE_P2_temp0_1458, __HIVE_P2_temp0_1459, __HIVE_P2_temp0_1460, __HIVE_P2_temp0_1461, __HIVE_P2_temp0_1462, __HIVE_P2_temp0_1463, __HIVE_P2_temp0_1464, __HIVE_P2_temp0_1465, __HIVE_P2_temp0_1466, __HIVE_P2_temp0_1467, __HIVE_P2_temp0_1468, __HIVE_P2_temp0_1469, __HIVE_P2_temp0_1470, __HIVE_P2_temp0_1471, __HIVE_P2_temp0_1472, __HIVE_P2_temp0_1473, __HIVE_P2_temp0_1474, __HIVE_P2_temp0_1475, __HIVE_P2_temp0_1476, __HIVE_P2_temp0_1477, __HIVE_P2_temp0_1478, __HIVE_P2_temp0_1479, __HIVE_P2_temp0_1480, __HIVE_P2_temp0_1481, __HIVE_P2_temp0_1482, __HIVE_P2_temp0_1483, __HIVE_P2_temp0_1484, __HIVE_P2_temp0_1485, __HIVE_P2_temp0_1486, __HIVE_P2_temp0_1487, __HIVE_P2_temp0_1488, __HIVE_P2_temp0_1489, __HIVE_P2_temp0_1490, __HIVE_P2_temp0_1491, __HIVE_P2_temp0_1492, __HIVE_P2_temp0_1493, __HIVE_P2_temp0_1494, __HIVE_P2_temp0_1495, __HIVE_P2_temp0_1496, __HIVE_P2_temp0_1497, __HIVE_P2_temp0_1498, __HIVE_P2_temp0_1499, __HIVE_P2_temp0_1500, __HIVE_P2_temp0_1501, __HIVE_P2_temp0_1502, __HIVE_P2_temp0_1503, __HIVE_P2_temp0_1504, __HIVE_P2_temp0_1505, __HIVE_P2_temp0_1506, __HIVE_P2_temp0_1507, __HIVE_P2_temp0_1508, __HIVE_P2_temp0_1509, __HIVE_P2_temp0_1510, __HIVE_P2_temp0_1511, __HIVE_P2_temp0_1512, __HIVE_P2_temp0_1513, __HIVE_P2_temp0_1514, __HIVE_P2_temp0_1515, __HIVE_P2_temp0_1516, __HIVE_P2_temp0_1517, __HIVE_P2_temp0_1518, __HIVE_P2_temp0_1519, __HIVE_P2_temp0_1520, __HIVE_P2_temp0_1521, __HIVE_P2_temp0_1522, __HIVE_P2_temp0_1523, __HIVE_P2_temp0_1524, __HIVE_P2_temp0_1525, __HIVE_P2_temp0_1526, __HIVE_P2_temp0_1527, __HIVE_P2_temp0_1528, __HIVE_P2_temp0_1529, __HIVE_P2_temp0_1530;
    __HIVE_P2_registerFunction(__scalarLine, 0, 1, 0, 1);
    __HIVE_P2_registerFunction(__scalarSpace, 0, 1, 0, 2);
    __HIVE_P2_registerFunction(__scalarStart, 0, 1, 0, 5);
    __HIVE_P2_registerFunction(__scalarContinue, 0, 1, 0, 10);
    __HIVE_P2_registerFunction(__scalarHex, 0, 1, 0, 14);
    __HIVE_P2_registerFunction(__scalarGapLine, 3, 3, 0, 25);
    __HIVE_P2_registerFunction(__scalarTrivia, 19, 5, 0, 32);
    __HIVE_P2_registerFunction(__scalarPeekWord, 24, 2, 0, 90);
    __HIVE_P2_registerFunction(__scalarNumericSpelling, 9, 3, 0, 146);
    __HIVE_P2_registerFunction(isInAstralSet, 2, 2, 0, 183);
    __HIVE_P2_registerFunction(isIdentifierStart, 0, 2, 0, 196);
    __HIVE_P2_registerFunction(isIdentifierChar, 0, 2, 0, 204);
    __HIVE_P2_registerFunction(binop, 0, 2, 0, 244);
    __HIVE_P2_registerFunction(kw, 6, 2, 0, 250);
    __HIVE_P2_registerFunction(isNewLine, 0, 1, 0, 358);
    __HIVE_P2_registerFunction(nextLineBreak, 8, 3, 0, 359);
    __HIVE_P2_registerFunction(wordsRegexp, 2, 1, 0, 392);
    __HIVE_P2_registerFunction(codePointToString, 0, 1, 0, 400);
    __HIVE_P2_registerFunction(getLineInfo, 0, 2, 0, 426);
    __HIVE_P2_registerFunction(getOptions, 0, 1, 0, 430);
    __HIVE_P2_registerFunction(pushComment, 0, 2, 0, 431);
    __HIVE_P2_registerFunction(functionFlags, 0, 2, 0, 446);
    __HIVE_P2_registerFunction(isPrivateNameConflicted, 9, 2, 0, 2252);
    __HIVE_P2_registerFunction(checkKeyName, 2, 2, 0, 2267);
    __HIVE_P2_registerFunction(isLocalVariableAccess, 0, 1, 0, 3713);
    __HIVE_P2_registerFunction(isPrivateFieldAccess, 0, 1, 0, 3718);
    __HIVE_P2_registerFunction(finishNodeAt, 12, 4, 0, 5459);
    __HIVE_P2_registerFunction(buildUnicodeData, 16, 1, 0, 5508);
    __HIVE_P2_registerFunction(hasProp, 0, 1, 0, 5696);
    __HIVE_P2_registerFunction(isRegularExpressionModifier, 0, 1, 0, 5768);
    __HIVE_P2_registerFunction(isSyntaxCharacter, 0, 1, 0, 5784);
    __HIVE_P2_registerFunction(isRegExpIdentifierStart, 0, 1, 0, 5821);
    __HIVE_P2_registerFunction(isRegExpIdentifierPart, 0, 1, 0, 5828);
    __HIVE_P2_registerFunction(isControlLetter, 0, 1, 0, 5870);
    __HIVE_P2_registerFunction(isValidUnicode, 0, 1, 0, 5880);
    __HIVE_P2_registerFunction(isCharacterClassEscape, 0, 1, 0, 5898);
    __HIVE_P2_registerFunction(isUnicodePropertyNameCharacter, 0, 1, 0, 5919);
    __HIVE_P2_registerFunction(isUnicodePropertyValueCharacter, 0, 1, 0, 5926);
    __HIVE_P2_registerFunction(isClassSetReservedDoublePunctuatorCharacter, 0, 1, 0, 5999);
    __HIVE_P2_registerFunction(isClassSetSyntaxCharacter, 0, 1, 0, 6006);
    __HIVE_P2_registerFunction(isClassSetReservedPunctuator, 0, 1, 0, 6016);
    __HIVE_P2_registerFunction(isDecimalDigit, 0, 1, 0, 6034);
    __HIVE_P2_registerFunction(isHexDigit, 0, 1, 0, 6042);
    __HIVE_P2_registerFunction(hexToInt, 0, 1, 0, 6049);
    __HIVE_P2_registerFunction(isOctalDigit, 0, 1, 0, 6069);
    __HIVE_P2_registerFunction(stringToNumber, 0, 2, 0, 6769);
    __HIVE_P2_registerFunction(stringToBigInt, 0, 1, 0, 6772);
    __HIVE_P2_registerFunction(parse, 2, 2, 0, 7237);
    __HIVE_P2_registerFunction(parseExpressionAt, 2, 3, 0, 7240);
    __HIVE_P2_registerFunction(tokenizer, 2, 2, 0, 7243);
    function __scalarLine(c) {
        return c === 10 || c === 13 || c === 8232 || c === 8233;
    }
    function __scalarSpace(c) {
        return c === 9 || c === 11 || c === 12 || c === 32 || c === 160 || c === 5760 || __HIVE_P2_binary(">=", c, 8192, 3) && __HIVE_P2_binary("<=", c, 8202, 4) || c === 8239 || c === 8287 || c === 12288 || c === 65279;
    }
    function __scalarStart(c) {
        return c === 36 || c === 95 || __HIVE_P2_binary(">=", c, 65, 6) && __HIVE_P2_binary("<=", c, 90, 7) || __HIVE_P2_binary(">=", c, 97, 8) && __HIVE_P2_binary("<=", c, 122, 9);
    }
    function __scalarContinue(c) {
        return __HIVE_P2_invoke(__scalarStart, void 0, (__HIVE_P2_reserveArray(1, 11), __HIVE_P2_ownArray([c], 11, "CONTROL_ARRAY")), 11) || __HIVE_P2_binary(">=", c, 48, 12) && __HIVE_P2_binary("<=", c, 57, 13);
    }
    function __scalarHex(c) {
        return __HIVE_P2_binary(">=", c, 48, 15) && __HIVE_P2_binary("<=", c, 57, 16) ? __HIVE_P2_binary("-", c, 48, 17) : __HIVE_P2_binary(">=", c, 65, 18) && __HIVE_P2_binary("<=", c, 70, 19) ? __HIVE_P2_binary("-", c, 55, 20) : __HIVE_P2_binary(">=", c, 97, 21) && __HIVE_P2_binary("<=", c, 102, 22) ? __HIVE_P2_binary("-", c, 87, 23) : __HIVE_P2_unary("-", 1, 24);
    }
    function __scalarGapLine(text, start, end) {
        var __HIVE_P2_temp25_0, __HIVE_P2_temp25_1;
        for (var i = start; __HIVE_P2_binary("<", i, end, 27); (__HIVE_P2_temp25_0 = __HIVE_P2_numeric(i, 28), __HIVE_P2_temp25_1 = __HIVE_P2_temp25_0 + 1, i = __HIVE_P2_temp25_1, __HIVE_P2_temp25_0)) {
            __HIVE_P2_tick(26);
            __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 29), __HIVE_P2_ownArray([], 29, "CONTROL_ARRAY")), 29);
            if (__HIVE_P2_invoke(__scalarLine, void 0, (__HIVE_P2_reserveArray(1, 30), __HIVE_P2_ownArray([__HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 31), __HIVE_P2_ownArray([text, i], 31, "CONTROL_ARRAY")), 31)], 30, "CONTROL_ARRAY")), 30))
                return true;
        }
        return false;
    }
    function __scalarTrivia(text, start, inModule, lastTokenEnd, hashBang) {
        var __HIVE_P2_temp32_0, __HIVE_P2_temp32_1, __HIVE_P2_temp32_2, __HIVE_P2_temp32_3, __HIVE_P2_temp32_4, __HIVE_P2_temp32_5, __HIVE_P2_temp32_6, __HIVE_P2_temp32_7, __HIVE_P2_temp32_8, __HIVE_P2_temp32_9, __HIVE_P2_temp32_10, __HIVE_P2_temp32_11;
        var i = start, sawLine = false;
        while (__HIVE_P2_binary("<", i, __HIVE_P2_get(text, "length", 35), 34)) {
            __HIVE_P2_tick(33);
            __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 36), __HIVE_P2_ownArray([], 36, "CONTROL_ARRAY")), 36);
            var c = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 37), __HIVE_P2_ownArray([text, i], 37, "CONTROL_ARRAY")), 37), width = 0, block = false;
            if (__HIVE_P2_invoke(__scalarSpace, void 0, (__HIVE_P2_reserveArray(1, 38), __HIVE_P2_ownArray([c], 38, "CONTROL_ARRAY")), 38)) {
                (__HIVE_P2_temp32_0 = __HIVE_P2_numeric(i, 39), __HIVE_P2_temp32_1 = __HIVE_P2_temp32_0 + 1, i = __HIVE_P2_temp32_1, __HIVE_P2_temp32_0);
                continue;
            }
            if (__HIVE_P2_invoke(__scalarLine, void 0, (__HIVE_P2_reserveArray(1, 40), __HIVE_P2_ownArray([c], 40, "CONTROL_ARRAY")), 40)) {
                sawLine = true;
                (__HIVE_P2_temp32_2 = __HIVE_P2_numeric(i, 42), __HIVE_P2_temp32_3 = __HIVE_P2_temp32_2 + 1, i = __HIVE_P2_temp32_3, __HIVE_P2_temp32_2);
                if (c === 13 && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 43), __HIVE_P2_ownArray([text, i], 43, "CONTROL_ARRAY")), 43) === 10)
                    (__HIVE_P2_temp32_4 = __HIVE_P2_numeric(i, 44), __HIVE_P2_temp32_5 = __HIVE_P2_temp32_4 + 1, i = __HIVE_P2_temp32_5, __HIVE_P2_temp32_4);
                continue;
            }
            if (i === 0 && hashBang && c === 35 && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 45), __HIVE_P2_ownArray([text, __HIVE_P2_binary("+", i, 1, 46)], 45, "CONTROL_ARRAY")), 45) === 33)
                width = 2;
            else if (c === 47 && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 48), __HIVE_P2_ownArray([text, __HIVE_P2_binary("+", i, 1, 49)], 48, "CONTROL_ARRAY")), 48) === 47)
                width = 2;
            else if (c === 47 && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 51), __HIVE_P2_ownArray([text, __HIVE_P2_binary("+", i, 1, 52)], 51, "CONTROL_ARRAY")), 51) === 42) {
                width = 2;
                block = true;
            }
            else if (!inModule && c === 60 && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 55), __HIVE_P2_ownArray([text, __HIVE_P2_binary("+", i, 1, 56)], 55, "CONTROL_ARRAY")), 55) === 33 && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 57), __HIVE_P2_ownArray([text, __HIVE_P2_binary("+", i, 2, 58)], 57, "CONTROL_ARRAY")), 57) === 45 && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 59), __HIVE_P2_ownArray([text, __HIVE_P2_binary("+", i, 3, 60)], 59, "CONTROL_ARRAY")), 59) === 45)
                width = 4;
            else if (!inModule && c === 45 && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 62), __HIVE_P2_ownArray([text, __HIVE_P2_binary("+", i, 1, 63)], 62, "CONTROL_ARRAY")), 62) === 45 && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 64), __HIVE_P2_ownArray([text, __HIVE_P2_binary("+", i, 2, 65)], 64, "CONTROL_ARRAY")), 64) === 62 && (lastTokenEnd === 0 || __HIVE_P2_invoke(__scalarGapLine, void 0, (__HIVE_P2_reserveArray(3, 66), __HIVE_P2_ownArray([text, lastTokenEnd, i], 66, "CONTROL_ARRAY")), 66)))
                width = 3;
            if (width === 0)
                break;
            i = __HIVE_P2_binary("+", i, width, 68);
            if (!block) {
                while (__HIVE_P2_binary("<", i, __HIVE_P2_get(text, "length", 71), 70) && !__HIVE_P2_invoke(__scalarLine, void 0, (__HIVE_P2_reserveArray(1, 72), __HIVE_P2_ownArray([__HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 73), __HIVE_P2_ownArray([text, i], 73, "CONTROL_ARRAY")), 73)], 72, "CONTROL_ARRAY")), 72)) {
                    __HIVE_P2_tick(69);
                    __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 74), __HIVE_P2_ownArray([], 74, "CONTROL_ARRAY")), 74);
                    (__HIVE_P2_temp32_6 = __HIVE_P2_numeric(i, 75), __HIVE_P2_temp32_7 = __HIVE_P2_temp32_6 + 1, i = __HIVE_P2_temp32_7, __HIVE_P2_temp32_6);
                }
                continue;
            }
            var closed = false;
            while (__HIVE_P2_binary("<", i, __HIVE_P2_get(text, "length", 78), 77)) {
                __HIVE_P2_tick(76);
                __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 79), __HIVE_P2_ownArray([], 79, "CONTROL_ARRAY")), 79);
                var b = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 80), __HIVE_P2_ownArray([text, (__HIVE_P2_temp32_8 = __HIVE_P2_numeric(i, 81), __HIVE_P2_temp32_9 = __HIVE_P2_temp32_8 + 1, i = __HIVE_P2_temp32_9, __HIVE_P2_temp32_8)], 80, "CONTROL_ARRAY")), 80);
                if (__HIVE_P2_invoke(__scalarLine, void 0, (__HIVE_P2_reserveArray(1, 82), __HIVE_P2_ownArray([b], 82, "CONTROL_ARRAY")), 82))
                    sawLine = true;
                if (b === 42 && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 84), __HIVE_P2_ownArray([text, i], 84, "CONTROL_ARRAY")), 84) === 47) {
                    (__HIVE_P2_temp32_10 = __HIVE_P2_numeric(i, 85), __HIVE_P2_temp32_11 = __HIVE_P2_temp32_10 + 1, i = __HIVE_P2_temp32_11, __HIVE_P2_temp32_10);
                    closed = true;
                    break;
                }
            }
            if (!closed)
                __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 87), __HIVE_P2_ownArray(["SYNTAX_REFUSED"], 87, "CONTROL_ARRAY")), 87);
        }
        return __HIVE_P2_binary("+", __HIVE_P2_binary("*", i, 2, 89), (sawLine ? 1 : 0), 88);
    }
    function __scalarPeekWord(text, start) {
        var __HIVE_P2_temp90_0, __HIVE_P2_temp90_1, __HIVE_P2_temp90_2, __HIVE_P2_temp90_3, __HIVE_P2_temp90_4, __HIVE_P2_temp90_5, __HIVE_P2_temp90_6, __HIVE_P2_temp90_7, __HIVE_P2_temp90_8, __HIVE_P2_temp90_9, __HIVE_P2_temp90_10, __HIVE_P2_temp90_11, __HIVE_P2_temp90_12, __HIVE_P2_temp90_13;
        var i = start, first = true, value = "", chunk = start, escaped = false;
        while (__HIVE_P2_binary("<", i, __HIVE_P2_get(text, "length", 93), 92)) {
            __HIVE_P2_tick(91);
            __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 94), __HIVE_P2_ownArray([], 94, "CONTROL_ARRAY")), 94);
            var c = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 95), __HIVE_P2_ownArray([text, i], 95, "CONTROL_ARRAY")), 95);
            if (__HIVE_P2_invoke(__scalarSpace, void 0, (__HIVE_P2_reserveArray(1, 96), __HIVE_P2_ownArray([c], 96, "CONTROL_ARRAY")), 96) || __HIVE_P2_invoke(__scalarLine, void 0, (__HIVE_P2_reserveArray(1, 97), __HIVE_P2_ownArray([c], 97, "CONTROL_ARRAY")), 97))
                break;
            if (__HIVE_P2_binary(">=", c, 128, 98))
                __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 99), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 99, "CONTROL_ARRAY")), 99);
            if (c === 92) {
                value = __HIVE_P2_invoke(__concat, void 0, (__HIVE_P2_reserveArray(2, 101), __HIVE_P2_ownArray([value, __HIVE_P2_invoke(__slice, void 0, (__HIVE_P2_reserveArray(3, 102), __HIVE_P2_ownArray([text, chunk, i], 102, "CONTROL_ARRAY")), 102)], 101, "CONTROL_ARRAY")), 101);
                escaped = true;
                if (__HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 104), __HIVE_P2_ownArray([text, (__HIVE_P2_temp90_0 = __HIVE_P2_numeric(i, 105), __HIVE_P2_temp90_1 = __HIVE_P2_temp90_0 + 1, i = __HIVE_P2_temp90_1, __HIVE_P2_temp90_1)], 104, "CONTROL_ARRAY")), 104) !== 117)
                    __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 106), __HIVE_P2_ownArray(["SYNTAX_REFUSED"], 106, "CONTROL_ARRAY")), 106);
                (__HIVE_P2_temp90_2 = __HIVE_P2_numeric(i, 107), __HIVE_P2_temp90_3 = __HIVE_P2_temp90_2 + 1, i = __HIVE_P2_temp90_3, __HIVE_P2_temp90_2);
                var point = 0, digits = 0, braced = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 108), __HIVE_P2_ownArray([text, i], 108, "CONTROL_ARRAY")), 108) === 123;
                if (braced)
                    (__HIVE_P2_temp90_4 = __HIVE_P2_numeric(i, 109), __HIVE_P2_temp90_5 = __HIVE_P2_temp90_4 + 1, i = __HIVE_P2_temp90_5, __HIVE_P2_temp90_4);
                while (braced ? __HIVE_P2_binary("<", i, __HIVE_P2_get(text, "length", 112), 111) && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 113), __HIVE_P2_ownArray([text, i], 113, "CONTROL_ARRAY")), 113) !== 125 : __HIVE_P2_binary("<", digits, 4, 114)) {
                    __HIVE_P2_tick(110);
                    __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 115), __HIVE_P2_ownArray([], 115, "CONTROL_ARRAY")), 115);
                    var d = __HIVE_P2_invoke(__scalarHex, void 0, (__HIVE_P2_reserveArray(1, 116), __HIVE_P2_ownArray([__HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 117), __HIVE_P2_ownArray([text, i], 117, "CONTROL_ARRAY")), 117)], 116, "CONTROL_ARRAY")), 116);
                    if (__HIVE_P2_binary("<", d, 0, 118))
                        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 119), __HIVE_P2_ownArray(["SYNTAX_REFUSED"], 119, "CONTROL_ARRAY")), 119);
                    point = __HIVE_P2_binary("+", __HIVE_P2_binary("*", point, 16, 122), d, 121);
                    (__HIVE_P2_temp90_6 = __HIVE_P2_numeric(digits, 123), __HIVE_P2_temp90_7 = __HIVE_P2_temp90_6 + 1, digits = __HIVE_P2_temp90_7, __HIVE_P2_temp90_6);
                    (__HIVE_P2_temp90_8 = __HIVE_P2_numeric(i, 124), __HIVE_P2_temp90_9 = __HIVE_P2_temp90_8 + 1, i = __HIVE_P2_temp90_9, __HIVE_P2_temp90_8);
                    if (__HIVE_P2_binary(">", point, 1114111, 125))
                        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 126), __HIVE_P2_ownArray(["SYNTAX_REFUSED"], 126, "CONTROL_ARRAY")), 126);
                }
                if (braced) {
                    if (digits === 0 || __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 127), __HIVE_P2_ownArray([text, i], 127, "CONTROL_ARRAY")), 127) !== 125)
                        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 128), __HIVE_P2_ownArray(["SYNTAX_REFUSED"], 128, "CONTROL_ARRAY")), 128);
                    (__HIVE_P2_temp90_10 = __HIVE_P2_numeric(i, 129), __HIVE_P2_temp90_11 = __HIVE_P2_temp90_10 + 1, i = __HIVE_P2_temp90_11, __HIVE_P2_temp90_10);
                }
                if (__HIVE_P2_binary(">", point, 127, 130))
                    __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 131), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 131, "CONTROL_ARRAY")), 131);
                if (!(first ? __HIVE_P2_invoke(__scalarStart, void 0, (__HIVE_P2_reserveArray(1, 132), __HIVE_P2_ownArray([point], 132, "CONTROL_ARRAY")), 132) : __HIVE_P2_invoke(__scalarContinue, void 0, (__HIVE_P2_reserveArray(1, 133), __HIVE_P2_ownArray([point], 133, "CONTROL_ARRAY")), 133)))
                    __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 134), __HIVE_P2_ownArray(["SYNTAX_REFUSED"], 134, "CONTROL_ARRAY")), 134);
                value = __HIVE_P2_invoke(__concat, void 0, (__HIVE_P2_reserveArray(2, 136), __HIVE_P2_ownArray([value, __HIVE_P2_invoke(__codePoint, void 0, (__HIVE_P2_reserveArray(1, 137), __HIVE_P2_ownArray([point], 137, "CONTROL_ARRAY")), 137)], 136, "CONTROL_ARRAY")), 136);
                chunk = i;
            }
            else {
                if (!(first ? __HIVE_P2_invoke(__scalarStart, void 0, (__HIVE_P2_reserveArray(1, 139), __HIVE_P2_ownArray([c], 139, "CONTROL_ARRAY")), 139) : __HIVE_P2_invoke(__scalarContinue, void 0, (__HIVE_P2_reserveArray(1, 140), __HIVE_P2_ownArray([c], 140, "CONTROL_ARRAY")), 140)))
                    break;
                (__HIVE_P2_temp90_12 = __HIVE_P2_numeric(i, 141), __HIVE_P2_temp90_13 = __HIVE_P2_temp90_12 + 1, i = __HIVE_P2_temp90_13, __HIVE_P2_temp90_12);
            }
            first = false;
        }
        return (__HIVE_P2_reserveObject(3, 143), __HIVE_P2_ownObject({ value: __HIVE_P2_invoke(__concat, void 0, (__HIVE_P2_reserveArray(2, 144), __HIVE_P2_ownArray([value, __HIVE_P2_invoke(__slice, void 0, (__HIVE_P2_reserveArray(3, 145), __HIVE_P2_ownArray([text, chunk, i], 145, "CONTROL_ARRAY")), 145)], 144, "CONTROL_ARRAY")), 144), end: i, escaped: escaped }, 143, 3, 15));
    }
    function __scalarNumericSpelling(text, start, end) {
        var __HIVE_P2_temp146_0, __HIVE_P2_temp146_1, __HIVE_P2_temp146_2, __HIVE_P2_temp146_3;
        if (__HIVE_P2_binary(">", __HIVE_P2_binary("-", end, start, 148), 1024, 147))
            __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 149), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 149, "CONTROL_ARRAY")), 149);
        var separator = false;
        for (var i = start; __HIVE_P2_binary("<", i, end, 151); (__HIVE_P2_temp146_0 = __HIVE_P2_numeric(i, 152), __HIVE_P2_temp146_1 = __HIVE_P2_temp146_0 + 1, i = __HIVE_P2_temp146_1, __HIVE_P2_temp146_0)) {
            __HIVE_P2_tick(150);
            __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 153), __HIVE_P2_ownArray([], 153, "CONTROL_ARRAY")), 153);
            if (__HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 154), __HIVE_P2_ownArray([text, i], 154, "CONTROL_ARRAY")), 154) === 95)
                separator = true;
        }
        if (!separator)
            return __HIVE_P2_invoke(__slice, void 0, (__HIVE_P2_reserveArray(3, 156), __HIVE_P2_ownArray([text, start, end], 156, "CONTROL_ARRAY")), 156);
        var spelling = "", chunk = start;
        for (var p = start; __HIVE_P2_binary("<", p, end, 158); (__HIVE_P2_temp146_2 = __HIVE_P2_numeric(p, 159), __HIVE_P2_temp146_3 = __HIVE_P2_temp146_2 + 1, p = __HIVE_P2_temp146_3, __HIVE_P2_temp146_2)) {
            __HIVE_P2_tick(157);
            __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 160), __HIVE_P2_ownArray([], 160, "CONTROL_ARRAY")), 160);
            if (__HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 161), __HIVE_P2_ownArray([text, p], 161, "CONTROL_ARRAY")), 161) === 95) {
                spelling = __HIVE_P2_invoke(__concat, void 0, (__HIVE_P2_reserveArray(2, 163), __HIVE_P2_ownArray([spelling, __HIVE_P2_invoke(__slice, void 0, (__HIVE_P2_reserveArray(3, 164), __HIVE_P2_ownArray([text, chunk, p], 164, "CONTROL_ARRAY")), 164)], 163, "CONTROL_ARRAY")), 163);
                chunk = __HIVE_P2_binary("+", p, 1, 166);
            }
        }
        return __HIVE_P2_invoke(__concat, void 0, (__HIVE_P2_reserveArray(2, 167), __HIVE_P2_ownArray([spelling, __HIVE_P2_invoke(__slice, void 0, (__HIVE_P2_reserveArray(3, 168), __HIVE_P2_ownArray([text, chunk, end], 168, "CONTROL_ARRAY")), 168)], 167, "CONTROL_ARRAY")), 167);
    }
    "use strict";
    var t = (__HIVE_P2_temp0_0 = 0, __HIVE_P2_temp0_1 = 509, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_1, 169), __HIVE_P2_temp0_2 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_2, 169), __HIVE_P2_temp0_3 = 227, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_3, 169), __HIVE_P2_temp0_4 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_4, 169), __HIVE_P2_temp0_5 = 150, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_5, 169), __HIVE_P2_temp0_6 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_6, 169), __HIVE_P2_temp0_7 = 294, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_7, 169), __HIVE_P2_temp0_8 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_8, 169), __HIVE_P2_temp0_9 = 1368, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_9, 169), __HIVE_P2_temp0_10 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_10, 169), __HIVE_P2_temp0_11 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_11, 169), __HIVE_P2_temp0_12 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_12, 169), __HIVE_P2_temp0_13 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_13, 169), __HIVE_P2_temp0_14 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_14, 169), __HIVE_P2_temp0_15 = 41, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_15, 169), __HIVE_P2_temp0_16 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_16, 169), __HIVE_P2_temp0_17 = 5, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_17, 169), __HIVE_P2_temp0_18 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_18, 169), __HIVE_P2_temp0_19 = 166, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_19, 169), __HIVE_P2_temp0_20 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_20, 169), __HIVE_P2_temp0_21 = 574, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_21, 169), __HIVE_P2_temp0_22 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_22, 169), __HIVE_P2_temp0_23 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_23, 169), __HIVE_P2_temp0_24 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_24, 169), __HIVE_P2_temp0_25 = 7, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_25, 169), __HIVE_P2_temp0_26 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_26, 169), __HIVE_P2_temp0_27 = 32, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_27, 169), __HIVE_P2_temp0_28 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_28, 169), __HIVE_P2_temp0_29 = 318, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_29, 169), __HIVE_P2_temp0_30 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_30, 169), __HIVE_P2_temp0_31 = 80, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_31, 169), __HIVE_P2_temp0_32 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_32, 169), __HIVE_P2_temp0_33 = 71, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_33, 169), __HIVE_P2_temp0_34 = 10, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_34, 169), __HIVE_P2_temp0_35 = 50, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_35, 169), __HIVE_P2_temp0_36 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_36, 169), __HIVE_P2_temp0_37 = 123, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_37, 169), __HIVE_P2_temp0_38 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_38, 169), __HIVE_P2_temp0_39 = 54, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_39, 169), __HIVE_P2_temp0_40 = 14, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_40, 169), __HIVE_P2_temp0_41 = 32, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_41, 169), __HIVE_P2_temp0_42 = 10, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_42, 169), __HIVE_P2_temp0_43 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_43, 169), __HIVE_P2_temp0_44 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_44, 169), __HIVE_P2_temp0_45 = 11, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_45, 169), __HIVE_P2_temp0_46 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_46, 169), __HIVE_P2_temp0_47 = 46, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_47, 169), __HIVE_P2_temp0_48 = 10, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_48, 169), __HIVE_P2_temp0_49 = 8, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_49, 169), __HIVE_P2_temp0_50 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_50, 169), __HIVE_P2_temp0_51 = 46, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_51, 169), __HIVE_P2_temp0_52 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_52, 169), __HIVE_P2_temp0_53 = 7, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_53, 169), __HIVE_P2_temp0_54 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_54, 169), __HIVE_P2_temp0_55 = 37, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_55, 169), __HIVE_P2_temp0_56 = 13, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_56, 169), __HIVE_P2_temp0_57 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_57, 169), __HIVE_P2_temp0_58 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_58, 169), __HIVE_P2_temp0_59 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_59, 169), __HIVE_P2_temp0_60 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_60, 169), __HIVE_P2_temp0_61 = 45, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_61, 169), __HIVE_P2_temp0_62 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_62, 169), __HIVE_P2_temp0_63 = 13, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_63, 169), __HIVE_P2_temp0_64 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_64, 169), __HIVE_P2_temp0_65 = 49, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_65, 169), __HIVE_P2_temp0_66 = 13, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_66, 169), __HIVE_P2_temp0_67 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_67, 169), __HIVE_P2_temp0_68 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_68, 169), __HIVE_P2_temp0_69 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_69, 169), __HIVE_P2_temp0_70 = 11, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_70, 169), __HIVE_P2_temp0_71 = 83, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_71, 169), __HIVE_P2_temp0_72 = 11, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_72, 169), __HIVE_P2_temp0_73 = 7, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_73, 169), __HIVE_P2_temp0_74 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_74, 169), __HIVE_P2_temp0_75 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_75, 169), __HIVE_P2_temp0_76 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_76, 169), __HIVE_P2_temp0_77 = 158, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_77, 169), __HIVE_P2_temp0_78 = 11, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_78, 169), __HIVE_P2_temp0_79 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_79, 169), __HIVE_P2_temp0_80 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_80, 169), __HIVE_P2_temp0_81 = 7, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_81, 169), __HIVE_P2_temp0_82 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_82, 169), __HIVE_P2_temp0_83 = 56, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_83, 169), __HIVE_P2_temp0_84 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_84, 169), __HIVE_P2_temp0_85 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_85, 169), __HIVE_P2_temp0_86 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_86, 169), __HIVE_P2_temp0_87 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_87, 169), __HIVE_P2_temp0_88 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_88, 169), __HIVE_P2_temp0_89 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_89, 169), __HIVE_P2_temp0_90 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_90, 169), __HIVE_P2_temp0_91 = 10, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_91, 169), __HIVE_P2_temp0_92 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_92, 169), __HIVE_P2_temp0_93 = 11, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_93, 169), __HIVE_P2_temp0_94 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_94, 169), __HIVE_P2_temp0_95 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_95, 169), __HIVE_P2_temp0_96 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_96, 169), __HIVE_P2_temp0_97 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_97, 169), __HIVE_P2_temp0_98 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_98, 169), __HIVE_P2_temp0_99 = 68, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_99, 169), __HIVE_P2_temp0_100 = 8, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_100, 169), __HIVE_P2_temp0_101 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_101, 169), __HIVE_P2_temp0_102 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_102, 169), __HIVE_P2_temp0_103 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_103, 169), __HIVE_P2_temp0_104 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_104, 169), __HIVE_P2_temp0_105 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_105, 169), __HIVE_P2_temp0_106 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_106, 169), __HIVE_P2_temp0_107 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_107, 169), __HIVE_P2_temp0_108 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_108, 169), __HIVE_P2_temp0_109 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_109, 169), __HIVE_P2_temp0_110 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_110, 169), __HIVE_P2_temp0_111 = 15, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_111, 169), __HIVE_P2_temp0_112 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_112, 169), __HIVE_P2_temp0_113 = 83, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_113, 169), __HIVE_P2_temp0_114 = 17, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_114, 169), __HIVE_P2_temp0_115 = 10, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_115, 169), __HIVE_P2_temp0_116 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_116, 169), __HIVE_P2_temp0_117 = 5, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_117, 169), __HIVE_P2_temp0_118 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_118, 169), __HIVE_P2_temp0_119 = 82, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_119, 169), __HIVE_P2_temp0_120 = 19, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_120, 169), __HIVE_P2_temp0_121 = 13, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_121, 169), __HIVE_P2_temp0_122 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_122, 169), __HIVE_P2_temp0_123 = 214, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_123, 169), __HIVE_P2_temp0_124 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_124, 169), __HIVE_P2_temp0_125 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_125, 169), __HIVE_P2_temp0_126 = 8, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_126, 169), __HIVE_P2_temp0_127 = 28, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_127, 169), __HIVE_P2_temp0_128 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_128, 169), __HIVE_P2_temp0_129 = 83, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_129, 169), __HIVE_P2_temp0_130 = 16, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_130, 169), __HIVE_P2_temp0_131 = 16, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_131, 169), __HIVE_P2_temp0_132 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_132, 169), __HIVE_P2_temp0_133 = 82, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_133, 169), __HIVE_P2_temp0_134 = 12, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_134, 169), __HIVE_P2_temp0_135 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_135, 169), __HIVE_P2_temp0_136 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_136, 169), __HIVE_P2_temp0_137 = 7, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_137, 169), __HIVE_P2_temp0_138 = 19, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_138, 169), __HIVE_P2_temp0_139 = 58, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_139, 169), __HIVE_P2_temp0_140 = 14, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_140, 169), __HIVE_P2_temp0_141 = 5, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_141, 169), __HIVE_P2_temp0_142 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_142, 169), __HIVE_P2_temp0_143 = 243, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_143, 169), __HIVE_P2_temp0_144 = 14, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_144, 169), __HIVE_P2_temp0_145 = 166, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_145, 169), __HIVE_P2_temp0_146 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_146, 169), __HIVE_P2_temp0_147 = 71, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_147, 169), __HIVE_P2_temp0_148 = 5, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_148, 169), __HIVE_P2_temp0_149 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_149, 169), __HIVE_P2_temp0_150 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_150, 169), __HIVE_P2_temp0_151 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_151, 169), __HIVE_P2_temp0_152 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_152, 169), __HIVE_P2_temp0_153 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_153, 169), __HIVE_P2_temp0_154 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_154, 169), __HIVE_P2_temp0_155 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_155, 169), __HIVE_P2_temp0_156 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_156, 169), __HIVE_P2_temp0_157 = 13, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_157, 169), __HIVE_P2_temp0_158 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_158, 169), __HIVE_P2_temp0_159 = 120, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_159, 169), __HIVE_P2_temp0_160 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_160, 169), __HIVE_P2_temp0_161 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_161, 169), __HIVE_P2_temp0_162 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_162, 169), __HIVE_P2_temp0_163 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_163, 169), __HIVE_P2_temp0_164 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_164, 169), __HIVE_P2_temp0_165 = 29, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_165, 169), __HIVE_P2_temp0_166 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_166, 169), __HIVE_P2_temp0_167 = 41, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_167, 169), __HIVE_P2_temp0_168 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_168, 169), __HIVE_P2_temp0_169 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_169, 169), __HIVE_P2_temp0_170 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_170, 169), __HIVE_P2_temp0_171 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_171, 169), __HIVE_P2_temp0_172 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_172, 169), __HIVE_P2_temp0_173 = 10, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_173, 169), __HIVE_P2_temp0_174 = 10, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_174, 169), __HIVE_P2_temp0_175 = 47, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_175, 169), __HIVE_P2_temp0_176 = 15, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_176, 169), __HIVE_P2_temp0_177 = 343, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_177, 169), __HIVE_P2_temp0_178 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_178, 169), __HIVE_P2_temp0_179 = 54, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_179, 169), __HIVE_P2_temp0_180 = 7, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_180, 169), __HIVE_P2_temp0_181 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_181, 169), __HIVE_P2_temp0_182 = 7, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_182, 169), __HIVE_P2_temp0_183 = 17, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_183, 169), __HIVE_P2_temp0_184 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_184, 169), __HIVE_P2_temp0_185 = 57, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_185, 169), __HIVE_P2_temp0_186 = 21, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_186, 169), __HIVE_P2_temp0_187 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_187, 169), __HIVE_P2_temp0_188 = 13, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_188, 169), __HIVE_P2_temp0_189 = 123, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_189, 169), __HIVE_P2_temp0_190 = 5, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_190, 169), __HIVE_P2_temp0_191 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_191, 169), __HIVE_P2_temp0_192 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_192, 169), __HIVE_P2_temp0_193 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_193, 169), __HIVE_P2_temp0_194 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_194, 169), __HIVE_P2_temp0_195 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_195, 169), __HIVE_P2_temp0_196 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_196, 169), __HIVE_P2_temp0_197 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_197, 169), __HIVE_P2_temp0_198 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_198, 169), __HIVE_P2_temp0_199 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_199, 169), __HIVE_P2_temp0_200 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_200, 169), __HIVE_P2_temp0_201 = 49, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_201, 169), __HIVE_P2_temp0_202 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_202, 169), __HIVE_P2_temp0_203 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_203, 169), __HIVE_P2_temp0_204 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_204, 169), __HIVE_P2_temp0_205 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_205, 169), __HIVE_P2_temp0_206 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_206, 169), __HIVE_P2_temp0_207 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_207, 169), __HIVE_P2_temp0_208 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_208, 169), __HIVE_P2_temp0_209 = 330, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_209, 169), __HIVE_P2_temp0_210 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_210, 169), __HIVE_P2_temp0_211 = 10, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_211, 169), __HIVE_P2_temp0_212 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_212, 169), __HIVE_P2_temp0_213 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_213, 169), __HIVE_P2_temp0_214 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_214, 169), __HIVE_P2_temp0_215 = 49, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_215, 169), __HIVE_P2_temp0_216 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_216, 169), __HIVE_P2_temp0_217 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_217, 169), __HIVE_P2_temp0_218 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_218, 169), __HIVE_P2_temp0_219 = 14, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_219, 169), __HIVE_P2_temp0_220 = 10, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_220, 169), __HIVE_P2_temp0_221 = 5350, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_221, 169), __HIVE_P2_temp0_222 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_222, 169), __HIVE_P2_temp0_223 = 7, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_223, 169), __HIVE_P2_temp0_224 = 14, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_224, 169), __HIVE_P2_temp0_225 = 11465, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_225, 169), __HIVE_P2_temp0_226 = 27, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_226, 169), __HIVE_P2_temp0_227 = 2343, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_227, 169), __HIVE_P2_temp0_228 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_228, 169), __HIVE_P2_temp0_229 = 87, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_229, 169), __HIVE_P2_temp0_230 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_230, 169), __HIVE_P2_temp0_231 = 39, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_231, 169), __HIVE_P2_temp0_232 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_232, 169), __HIVE_P2_temp0_233 = 60, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_233, 169), __HIVE_P2_temp0_234 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_234, 169), __HIVE_P2_temp0_235 = 26, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_235, 169), __HIVE_P2_temp0_236 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_236, 169), __HIVE_P2_temp0_237 = 535, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_237, 169), __HIVE_P2_temp0_238 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_238, 169), __HIVE_P2_temp0_239 = 470, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_239, 169), __HIVE_P2_temp0_240 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_240, 169), __HIVE_P2_temp0_241 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_241, 169), __HIVE_P2_temp0_242 = 54, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_242, 169), __HIVE_P2_temp0_243 = 8, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_243, 169), __HIVE_P2_temp0_244 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_244, 169), __HIVE_P2_temp0_245 = 82, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_245, 169), __HIVE_P2_temp0_246 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_246, 169), __HIVE_P2_temp0_247 = 12, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_247, 169), __HIVE_P2_temp0_248 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_248, 169), __HIVE_P2_temp0_249 = 19628, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_249, 169), __HIVE_P2_temp0_250 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_250, 169), __HIVE_P2_temp0_251 = 4178, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_251, 169), __HIVE_P2_temp0_252 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_252, 169), __HIVE_P2_temp0_253 = 519, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_253, 169), __HIVE_P2_temp0_254 = 45, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_254, 169), __HIVE_P2_temp0_255 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_255, 169), __HIVE_P2_temp0_256 = 22, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_256, 169), __HIVE_P2_temp0_257 = 543, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_257, 169), __HIVE_P2_temp0_258 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_258, 169), __HIVE_P2_temp0_259 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_259, 169), __HIVE_P2_temp0_260 = 5, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_260, 169), __HIVE_P2_temp0_261 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_261, 169), __HIVE_P2_temp0_262 = 7, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_262, 169), __HIVE_P2_temp0_263 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_263, 169), __HIVE_P2_temp0_264 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_264, 169), __HIVE_P2_temp0_265 = 31, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_265, 169), __HIVE_P2_temp0_266 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_266, 169), __HIVE_P2_temp0_267 = 149, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_267, 169), __HIVE_P2_temp0_268 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_268, 169), __HIVE_P2_temp0_269 = 1418, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_269, 169), __HIVE_P2_temp0_270 = 49, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_270, 169), __HIVE_P2_temp0_271 = 513, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_271, 169), __HIVE_P2_temp0_272 = 54, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_272, 169), __HIVE_P2_temp0_273 = 5, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_273, 169), __HIVE_P2_temp0_274 = 49, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_274, 169), __HIVE_P2_temp0_275 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_275, 169), __HIVE_P2_temp0_276 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_276, 169), __HIVE_P2_temp0_277 = 15, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_277, 169), __HIVE_P2_temp0_278 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_278, 169), __HIVE_P2_temp0_279 = 23, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_279, 169), __HIVE_P2_temp0_280 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_280, 169), __HIVE_P2_temp0_281 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_281, 169), __HIVE_P2_temp0_282 = 14, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_282, 169), __HIVE_P2_temp0_283 = 1361, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_283, 169), __HIVE_P2_temp0_284 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_284, 169), __HIVE_P2_temp0_285 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_285, 169), __HIVE_P2_temp0_286 = 16, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_286, 169), __HIVE_P2_temp0_287 = 3, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_287, 169), __HIVE_P2_temp0_288 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_288, 169), __HIVE_P2_temp0_289 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_289, 169), __HIVE_P2_temp0_290 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_290, 169), __HIVE_P2_temp0_291 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_291, 169), __HIVE_P2_temp0_292 = 4, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_292, 169), __HIVE_P2_temp0_293 = 101, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_293, 169), __HIVE_P2_temp0_294 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_294, 169), __HIVE_P2_temp0_295 = 161, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_295, 169), __HIVE_P2_temp0_296 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_296, 169), __HIVE_P2_temp0_297 = 10, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_297, 169), __HIVE_P2_temp0_298 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_298, 169), __HIVE_P2_temp0_299 = 357, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_299, 169), __HIVE_P2_temp0_300 = 0, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_300, 169), __HIVE_P2_temp0_301 = 62, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_301, 169), __HIVE_P2_temp0_302 = 13, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_302, 169), __HIVE_P2_temp0_303 = 499, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_303, 169), __HIVE_P2_temp0_304 = 13, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_304, 169), __HIVE_P2_temp0_305 = 245, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_305, 169), __HIVE_P2_temp0_306 = 1, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_306, 169), __HIVE_P2_temp0_307 = 2, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_307, 169), __HIVE_P2_temp0_308 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_308, 169), __HIVE_P2_temp0_309 = 726, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_309, 169), __HIVE_P2_temp0_310 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_310, 169), __HIVE_P2_temp0_311 = 110, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_311, 169), __HIVE_P2_temp0_312 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_312, 169), __HIVE_P2_temp0_313 = 6, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_313, 169), __HIVE_P2_temp0_314 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_314, 169), __HIVE_P2_temp0_315 = 4759, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_315, 169), __HIVE_P2_temp0_316 = 9, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_316, 169), __HIVE_P2_temp0_317 = 787719, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_317, 169), __HIVE_P2_temp0_318 = 239, __HIVE_P2_temp0_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_0, __HIVE_P2_temp0_318, 169), __HIVE_P2_checkArrayDepth(__HIVE_P2_temp0_0, 169), __HIVE_P2_reserveArray(318, 169, 318), __HIVE_P2_ownArray([__HIVE_P2_temp0_1, __HIVE_P2_temp0_2, __HIVE_P2_temp0_3, __HIVE_P2_temp0_4, __HIVE_P2_temp0_5, __HIVE_P2_temp0_6, __HIVE_P2_temp0_7, __HIVE_P2_temp0_8, __HIVE_P2_temp0_9, __HIVE_P2_temp0_10, __HIVE_P2_temp0_11, __HIVE_P2_temp0_12, __HIVE_P2_temp0_13, __HIVE_P2_temp0_14, __HIVE_P2_temp0_15, __HIVE_P2_temp0_16, __HIVE_P2_temp0_17, __HIVE_P2_temp0_18, __HIVE_P2_temp0_19, __HIVE_P2_temp0_20, __HIVE_P2_temp0_21, __HIVE_P2_temp0_22, __HIVE_P2_temp0_23, __HIVE_P2_temp0_24, __HIVE_P2_temp0_25, __HIVE_P2_temp0_26, __HIVE_P2_temp0_27, __HIVE_P2_temp0_28, __HIVE_P2_temp0_29, __HIVE_P2_temp0_30, __HIVE_P2_temp0_31, __HIVE_P2_temp0_32, __HIVE_P2_temp0_33, __HIVE_P2_temp0_34, __HIVE_P2_temp0_35, __HIVE_P2_temp0_36, __HIVE_P2_temp0_37, __HIVE_P2_temp0_38, __HIVE_P2_temp0_39, __HIVE_P2_temp0_40, __HIVE_P2_temp0_41, __HIVE_P2_temp0_42, __HIVE_P2_temp0_43, __HIVE_P2_temp0_44, __HIVE_P2_temp0_45, __HIVE_P2_temp0_46, __HIVE_P2_temp0_47, __HIVE_P2_temp0_48, __HIVE_P2_temp0_49, __HIVE_P2_temp0_50, __HIVE_P2_temp0_51, __HIVE_P2_temp0_52, __HIVE_P2_temp0_53, __HIVE_P2_temp0_54, __HIVE_P2_temp0_55, __HIVE_P2_temp0_56, __HIVE_P2_temp0_57, __HIVE_P2_temp0_58, __HIVE_P2_temp0_59, __HIVE_P2_temp0_60, __HIVE_P2_temp0_61, __HIVE_P2_temp0_62, __HIVE_P2_temp0_63, __HIVE_P2_temp0_64, __HIVE_P2_temp0_65, __HIVE_P2_temp0_66, __HIVE_P2_temp0_67, __HIVE_P2_temp0_68, __HIVE_P2_temp0_69, __HIVE_P2_temp0_70, __HIVE_P2_temp0_71, __HIVE_P2_temp0_72, __HIVE_P2_temp0_73, __HIVE_P2_temp0_74, __HIVE_P2_temp0_75, __HIVE_P2_temp0_76, __HIVE_P2_temp0_77, __HIVE_P2_temp0_78, __HIVE_P2_temp0_79, __HIVE_P2_temp0_80, __HIVE_P2_temp0_81, __HIVE_P2_temp0_82, __HIVE_P2_temp0_83, __HIVE_P2_temp0_84, __HIVE_P2_temp0_85, __HIVE_P2_temp0_86, __HIVE_P2_temp0_87, __HIVE_P2_temp0_88, __HIVE_P2_temp0_89, __HIVE_P2_temp0_90, __HIVE_P2_temp0_91, __HIVE_P2_temp0_92, __HIVE_P2_temp0_93, __HIVE_P2_temp0_94, __HIVE_P2_temp0_95, __HIVE_P2_temp0_96, __HIVE_P2_temp0_97, __HIVE_P2_temp0_98, __HIVE_P2_temp0_99, __HIVE_P2_temp0_100, __HIVE_P2_temp0_101, __HIVE_P2_temp0_102, __HIVE_P2_temp0_103, __HIVE_P2_temp0_104, __HIVE_P2_temp0_105, __HIVE_P2_temp0_106, __HIVE_P2_temp0_107, __HIVE_P2_temp0_108, __HIVE_P2_temp0_109, __HIVE_P2_temp0_110, __HIVE_P2_temp0_111, __HIVE_P2_temp0_112, __HIVE_P2_temp0_113, __HIVE_P2_temp0_114, __HIVE_P2_temp0_115, __HIVE_P2_temp0_116, __HIVE_P2_temp0_117, __HIVE_P2_temp0_118, __HIVE_P2_temp0_119, __HIVE_P2_temp0_120, __HIVE_P2_temp0_121, __HIVE_P2_temp0_122, __HIVE_P2_temp0_123, __HIVE_P2_temp0_124, __HIVE_P2_temp0_125, __HIVE_P2_temp0_126, __HIVE_P2_temp0_127, __HIVE_P2_temp0_128, __HIVE_P2_temp0_129, __HIVE_P2_temp0_130, __HIVE_P2_temp0_131, __HIVE_P2_temp0_132, __HIVE_P2_temp0_133, __HIVE_P2_temp0_134, __HIVE_P2_temp0_135, __HIVE_P2_temp0_136, __HIVE_P2_temp0_137, __HIVE_P2_temp0_138, __HIVE_P2_temp0_139, __HIVE_P2_temp0_140, __HIVE_P2_temp0_141, __HIVE_P2_temp0_142, __HIVE_P2_temp0_143, __HIVE_P2_temp0_144, __HIVE_P2_temp0_145, __HIVE_P2_temp0_146, __HIVE_P2_temp0_147, __HIVE_P2_temp0_148, __HIVE_P2_temp0_149, __HIVE_P2_temp0_150, __HIVE_P2_temp0_151, __HIVE_P2_temp0_152, __HIVE_P2_temp0_153, __HIVE_P2_temp0_154, __HIVE_P2_temp0_155, __HIVE_P2_temp0_156, __HIVE_P2_temp0_157, __HIVE_P2_temp0_158, __HIVE_P2_temp0_159, __HIVE_P2_temp0_160, __HIVE_P2_temp0_161, __HIVE_P2_temp0_162, __HIVE_P2_temp0_163, __HIVE_P2_temp0_164, __HIVE_P2_temp0_165, __HIVE_P2_temp0_166, __HIVE_P2_temp0_167, __HIVE_P2_temp0_168, __HIVE_P2_temp0_169, __HIVE_P2_temp0_170, __HIVE_P2_temp0_171, __HIVE_P2_temp0_172, __HIVE_P2_temp0_173, __HIVE_P2_temp0_174, __HIVE_P2_temp0_175, __HIVE_P2_temp0_176, __HIVE_P2_temp0_177, __HIVE_P2_temp0_178, __HIVE_P2_temp0_179, __HIVE_P2_temp0_180, __HIVE_P2_temp0_181, __HIVE_P2_temp0_182, __HIVE_P2_temp0_183, __HIVE_P2_temp0_184, __HIVE_P2_temp0_185, __HIVE_P2_temp0_186, __HIVE_P2_temp0_187, __HIVE_P2_temp0_188, __HIVE_P2_temp0_189, __HIVE_P2_temp0_190, __HIVE_P2_temp0_191, __HIVE_P2_temp0_192, __HIVE_P2_temp0_193, __HIVE_P2_temp0_194, __HIVE_P2_temp0_195, __HIVE_P2_temp0_196, __HIVE_P2_temp0_197, __HIVE_P2_temp0_198, __HIVE_P2_temp0_199, __HIVE_P2_temp0_200, __HIVE_P2_temp0_201, __HIVE_P2_temp0_202, __HIVE_P2_temp0_203, __HIVE_P2_temp0_204, __HIVE_P2_temp0_205, __HIVE_P2_temp0_206, __HIVE_P2_temp0_207, __HIVE_P2_temp0_208, __HIVE_P2_temp0_209, __HIVE_P2_temp0_210, __HIVE_P2_temp0_211, __HIVE_P2_temp0_212, __HIVE_P2_temp0_213, __HIVE_P2_temp0_214, __HIVE_P2_temp0_215, __HIVE_P2_temp0_216, __HIVE_P2_temp0_217, __HIVE_P2_temp0_218, __HIVE_P2_temp0_219, __HIVE_P2_temp0_220, __HIVE_P2_temp0_221, __HIVE_P2_temp0_222, __HIVE_P2_temp0_223, __HIVE_P2_temp0_224, __HIVE_P2_temp0_225, __HIVE_P2_temp0_226, __HIVE_P2_temp0_227, __HIVE_P2_temp0_228, __HIVE_P2_temp0_229, __HIVE_P2_temp0_230, __HIVE_P2_temp0_231, __HIVE_P2_temp0_232, __HIVE_P2_temp0_233, __HIVE_P2_temp0_234, __HIVE_P2_temp0_235, __HIVE_P2_temp0_236, __HIVE_P2_temp0_237, __HIVE_P2_temp0_238, __HIVE_P2_temp0_239, __HIVE_P2_temp0_240, __HIVE_P2_temp0_241, __HIVE_P2_temp0_242, __HIVE_P2_temp0_243, __HIVE_P2_temp0_244, __HIVE_P2_temp0_245, __HIVE_P2_temp0_246, __HIVE_P2_temp0_247, __HIVE_P2_temp0_248, __HIVE_P2_temp0_249, __HIVE_P2_temp0_250, __HIVE_P2_temp0_251, __HIVE_P2_temp0_252, __HIVE_P2_temp0_253, __HIVE_P2_temp0_254, __HIVE_P2_temp0_255, __HIVE_P2_temp0_256, __HIVE_P2_temp0_257, __HIVE_P2_temp0_258, __HIVE_P2_temp0_259, __HIVE_P2_temp0_260, __HIVE_P2_temp0_261, __HIVE_P2_temp0_262, __HIVE_P2_temp0_263, __HIVE_P2_temp0_264, __HIVE_P2_temp0_265, __HIVE_P2_temp0_266, __HIVE_P2_temp0_267, __HIVE_P2_temp0_268, __HIVE_P2_temp0_269, __HIVE_P2_temp0_270, __HIVE_P2_temp0_271, __HIVE_P2_temp0_272, __HIVE_P2_temp0_273, __HIVE_P2_temp0_274, __HIVE_P2_temp0_275, __HIVE_P2_temp0_276, __HIVE_P2_temp0_277, __HIVE_P2_temp0_278, __HIVE_P2_temp0_279, __HIVE_P2_temp0_280, __HIVE_P2_temp0_281, __HIVE_P2_temp0_282, __HIVE_P2_temp0_283, __HIVE_P2_temp0_284, __HIVE_P2_temp0_285, __HIVE_P2_temp0_286, __HIVE_P2_temp0_287, __HIVE_P2_temp0_288, __HIVE_P2_temp0_289, __HIVE_P2_temp0_290, __HIVE_P2_temp0_291, __HIVE_P2_temp0_292, __HIVE_P2_temp0_293, __HIVE_P2_temp0_294, __HIVE_P2_temp0_295, __HIVE_P2_temp0_296, __HIVE_P2_temp0_297, __HIVE_P2_temp0_298, __HIVE_P2_temp0_299, __HIVE_P2_temp0_300, __HIVE_P2_temp0_301, __HIVE_P2_temp0_302, __HIVE_P2_temp0_303, __HIVE_P2_temp0_304, __HIVE_P2_temp0_305, __HIVE_P2_temp0_306, __HIVE_P2_temp0_307, __HIVE_P2_temp0_308, __HIVE_P2_temp0_309, __HIVE_P2_temp0_310, __HIVE_P2_temp0_311, __HIVE_P2_temp0_312, __HIVE_P2_temp0_313, __HIVE_P2_temp0_314, __HIVE_P2_temp0_315, __HIVE_P2_temp0_316, __HIVE_P2_temp0_317, __HIVE_P2_temp0_318], 169, "ARRAY", __HIVE_P2_temp0_0));
    var i = (__HIVE_P2_temp0_319 = 0, __HIVE_P2_temp0_320 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_320, 170), __HIVE_P2_temp0_321 = 11, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_321, 170), __HIVE_P2_temp0_322 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_322, 170), __HIVE_P2_temp0_323 = 25, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_323, 170), __HIVE_P2_temp0_324 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_324, 170), __HIVE_P2_temp0_325 = 18, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_325, 170), __HIVE_P2_temp0_326 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_326, 170), __HIVE_P2_temp0_327 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_327, 170), __HIVE_P2_temp0_328 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_328, 170), __HIVE_P2_temp0_329 = 14, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_329, 170), __HIVE_P2_temp0_330 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_330, 170), __HIVE_P2_temp0_331 = 13, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_331, 170), __HIVE_P2_temp0_332 = 35, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_332, 170), __HIVE_P2_temp0_333 = 122, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_333, 170), __HIVE_P2_temp0_334 = 70, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_334, 170), __HIVE_P2_temp0_335 = 52, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_335, 170), __HIVE_P2_temp0_336 = 268, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_336, 170), __HIVE_P2_temp0_337 = 28, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_337, 170), __HIVE_P2_temp0_338 = 4, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_338, 170), __HIVE_P2_temp0_339 = 48, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_339, 170), __HIVE_P2_temp0_340 = 48, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_340, 170), __HIVE_P2_temp0_341 = 31, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_341, 170), __HIVE_P2_temp0_342 = 14, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_342, 170), __HIVE_P2_temp0_343 = 29, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_343, 170), __HIVE_P2_temp0_344 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_344, 170), __HIVE_P2_temp0_345 = 37, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_345, 170), __HIVE_P2_temp0_346 = 11, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_346, 170), __HIVE_P2_temp0_347 = 29, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_347, 170), __HIVE_P2_temp0_348 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_348, 170), __HIVE_P2_temp0_349 = 35, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_349, 170), __HIVE_P2_temp0_350 = 5, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_350, 170), __HIVE_P2_temp0_351 = 7, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_351, 170), __HIVE_P2_temp0_352 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_352, 170), __HIVE_P2_temp0_353 = 4, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_353, 170), __HIVE_P2_temp0_354 = 43, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_354, 170), __HIVE_P2_temp0_355 = 157, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_355, 170), __HIVE_P2_temp0_356 = 19, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_356, 170), __HIVE_P2_temp0_357 = 35, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_357, 170), __HIVE_P2_temp0_358 = 5, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_358, 170), __HIVE_P2_temp0_359 = 35, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_359, 170), __HIVE_P2_temp0_360 = 5, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_360, 170), __HIVE_P2_temp0_361 = 39, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_361, 170), __HIVE_P2_temp0_362 = 9, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_362, 170), __HIVE_P2_temp0_363 = 51, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_363, 170), __HIVE_P2_temp0_364 = 13, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_364, 170), __HIVE_P2_temp0_365 = 10, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_365, 170), __HIVE_P2_temp0_366 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_366, 170), __HIVE_P2_temp0_367 = 14, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_367, 170), __HIVE_P2_temp0_368 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_368, 170), __HIVE_P2_temp0_369 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_369, 170), __HIVE_P2_temp0_370 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_370, 170), __HIVE_P2_temp0_371 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_371, 170), __HIVE_P2_temp0_372 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_372, 170), __HIVE_P2_temp0_373 = 10, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_373, 170), __HIVE_P2_temp0_374 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_374, 170), __HIVE_P2_temp0_375 = 14, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_375, 170), __HIVE_P2_temp0_376 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_376, 170), __HIVE_P2_temp0_377 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_377, 170), __HIVE_P2_temp0_378 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_378, 170), __HIVE_P2_temp0_379 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_379, 170), __HIVE_P2_temp0_380 = 4, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_380, 170), __HIVE_P2_temp0_381 = 51, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_381, 170), __HIVE_P2_temp0_382 = 13, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_382, 170), __HIVE_P2_temp0_383 = 310, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_383, 170), __HIVE_P2_temp0_384 = 10, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_384, 170), __HIVE_P2_temp0_385 = 21, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_385, 170), __HIVE_P2_temp0_386 = 11, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_386, 170), __HIVE_P2_temp0_387 = 7, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_387, 170), __HIVE_P2_temp0_388 = 25, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_388, 170), __HIVE_P2_temp0_389 = 5, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_389, 170), __HIVE_P2_temp0_390 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_390, 170), __HIVE_P2_temp0_391 = 41, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_391, 170), __HIVE_P2_temp0_392 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_392, 170), __HIVE_P2_temp0_393 = 8, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_393, 170), __HIVE_P2_temp0_394 = 70, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_394, 170), __HIVE_P2_temp0_395 = 5, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_395, 170), __HIVE_P2_temp0_396 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_396, 170), __HIVE_P2_temp0_397 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_397, 170), __HIVE_P2_temp0_398 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_398, 170), __HIVE_P2_temp0_399 = 43, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_399, 170), __HIVE_P2_temp0_400 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_400, 170), __HIVE_P2_temp0_401 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_401, 170), __HIVE_P2_temp0_402 = 4, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_402, 170), __HIVE_P2_temp0_403 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_403, 170), __HIVE_P2_temp0_404 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_404, 170), __HIVE_P2_temp0_405 = 22, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_405, 170), __HIVE_P2_temp0_406 = 11, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_406, 170), __HIVE_P2_temp0_407 = 22, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_407, 170), __HIVE_P2_temp0_408 = 10, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_408, 170), __HIVE_P2_temp0_409 = 30, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_409, 170), __HIVE_P2_temp0_410 = 66, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_410, 170), __HIVE_P2_temp0_411 = 18, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_411, 170), __HIVE_P2_temp0_412 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_412, 170), __HIVE_P2_temp0_413 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_413, 170), __HIVE_P2_temp0_414 = 11, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_414, 170), __HIVE_P2_temp0_415 = 21, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_415, 170), __HIVE_P2_temp0_416 = 11, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_416, 170), __HIVE_P2_temp0_417 = 25, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_417, 170), __HIVE_P2_temp0_418 = 71, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_418, 170), __HIVE_P2_temp0_419 = 55, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_419, 170), __HIVE_P2_temp0_420 = 7, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_420, 170), __HIVE_P2_temp0_421 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_421, 170), __HIVE_P2_temp0_422 = 65, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_422, 170), __HIVE_P2_temp0_423 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_423, 170), __HIVE_P2_temp0_424 = 16, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_424, 170), __HIVE_P2_temp0_425 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_425, 170), __HIVE_P2_temp0_426 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_426, 170), __HIVE_P2_temp0_427 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_427, 170), __HIVE_P2_temp0_428 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_428, 170), __HIVE_P2_temp0_429 = 28, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_429, 170), __HIVE_P2_temp0_430 = 43, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_430, 170), __HIVE_P2_temp0_431 = 28, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_431, 170), __HIVE_P2_temp0_432 = 4, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_432, 170), __HIVE_P2_temp0_433 = 28, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_433, 170), __HIVE_P2_temp0_434 = 36, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_434, 170), __HIVE_P2_temp0_435 = 7, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_435, 170), __HIVE_P2_temp0_436 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_436, 170), __HIVE_P2_temp0_437 = 27, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_437, 170), __HIVE_P2_temp0_438 = 28, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_438, 170), __HIVE_P2_temp0_439 = 53, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_439, 170), __HIVE_P2_temp0_440 = 11, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_440, 170), __HIVE_P2_temp0_441 = 21, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_441, 170), __HIVE_P2_temp0_442 = 11, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_442, 170), __HIVE_P2_temp0_443 = 18, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_443, 170), __HIVE_P2_temp0_444 = 14, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_444, 170), __HIVE_P2_temp0_445 = 17, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_445, 170), __HIVE_P2_temp0_446 = 111, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_446, 170), __HIVE_P2_temp0_447 = 72, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_447, 170), __HIVE_P2_temp0_448 = 56, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_448, 170), __HIVE_P2_temp0_449 = 50, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_449, 170), __HIVE_P2_temp0_450 = 14, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_450, 170), __HIVE_P2_temp0_451 = 50, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_451, 170), __HIVE_P2_temp0_452 = 14, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_452, 170), __HIVE_P2_temp0_453 = 35, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_453, 170), __HIVE_P2_temp0_454 = 39, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_454, 170), __HIVE_P2_temp0_455 = 27, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_455, 170), __HIVE_P2_temp0_456 = 10, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_456, 170), __HIVE_P2_temp0_457 = 22, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_457, 170), __HIVE_P2_temp0_458 = 251, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_458, 170), __HIVE_P2_temp0_459 = 41, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_459, 170), __HIVE_P2_temp0_460 = 7, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_460, 170), __HIVE_P2_temp0_461 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_461, 170), __HIVE_P2_temp0_462 = 17, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_462, 170), __HIVE_P2_temp0_463 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_463, 170), __HIVE_P2_temp0_464 = 60, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_464, 170), __HIVE_P2_temp0_465 = 28, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_465, 170), __HIVE_P2_temp0_466 = 11, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_466, 170), __HIVE_P2_temp0_467 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_467, 170), __HIVE_P2_temp0_468 = 9, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_468, 170), __HIVE_P2_temp0_469 = 21, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_469, 170), __HIVE_P2_temp0_470 = 43, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_470, 170), __HIVE_P2_temp0_471 = 17, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_471, 170), __HIVE_P2_temp0_472 = 47, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_472, 170), __HIVE_P2_temp0_473 = 20, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_473, 170), __HIVE_P2_temp0_474 = 28, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_474, 170), __HIVE_P2_temp0_475 = 22, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_475, 170), __HIVE_P2_temp0_476 = 13, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_476, 170), __HIVE_P2_temp0_477 = 52, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_477, 170), __HIVE_P2_temp0_478 = 58, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_478, 170), __HIVE_P2_temp0_479 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_479, 170), __HIVE_P2_temp0_480 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_480, 170), __HIVE_P2_temp0_481 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_481, 170), __HIVE_P2_temp0_482 = 14, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_482, 170), __HIVE_P2_temp0_483 = 44, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_483, 170), __HIVE_P2_temp0_484 = 33, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_484, 170), __HIVE_P2_temp0_485 = 24, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_485, 170), __HIVE_P2_temp0_486 = 27, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_486, 170), __HIVE_P2_temp0_487 = 35, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_487, 170), __HIVE_P2_temp0_488 = 30, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_488, 170), __HIVE_P2_temp0_489 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_489, 170), __HIVE_P2_temp0_490 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_490, 170), __HIVE_P2_temp0_491 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_491, 170), __HIVE_P2_temp0_492 = 9, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_492, 170), __HIVE_P2_temp0_493 = 34, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_493, 170), __HIVE_P2_temp0_494 = 4, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_494, 170), __HIVE_P2_temp0_495 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_495, 170), __HIVE_P2_temp0_496 = 13, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_496, 170), __HIVE_P2_temp0_497 = 47, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_497, 170), __HIVE_P2_temp0_498 = 15, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_498, 170), __HIVE_P2_temp0_499 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_499, 170), __HIVE_P2_temp0_500 = 22, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_500, 170), __HIVE_P2_temp0_501 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_501, 170), __HIVE_P2_temp0_502 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_502, 170), __HIVE_P2_temp0_503 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_503, 170), __HIVE_P2_temp0_504 = 36, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_504, 170), __HIVE_P2_temp0_505 = 17, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_505, 170), __HIVE_P2_temp0_506 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_506, 170), __HIVE_P2_temp0_507 = 24, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_507, 170), __HIVE_P2_temp0_508 = 20, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_508, 170), __HIVE_P2_temp0_509 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_509, 170), __HIVE_P2_temp0_510 = 64, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_510, 170), __HIVE_P2_temp0_511 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_511, 170), __HIVE_P2_temp0_512 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_512, 170), __HIVE_P2_temp0_513 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_513, 170), __HIVE_P2_temp0_514 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_514, 170), __HIVE_P2_temp0_515 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_515, 170), __HIVE_P2_temp0_516 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_516, 170), __HIVE_P2_temp0_517 = 14, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_517, 170), __HIVE_P2_temp0_518 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_518, 170), __HIVE_P2_temp0_519 = 9, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_519, 170), __HIVE_P2_temp0_520 = 8, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_520, 170), __HIVE_P2_temp0_521 = 46, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_521, 170), __HIVE_P2_temp0_522 = 39, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_522, 170), __HIVE_P2_temp0_523 = 7, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_523, 170), __HIVE_P2_temp0_524 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_524, 170), __HIVE_P2_temp0_525 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_525, 170), __HIVE_P2_temp0_526 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_526, 170), __HIVE_P2_temp0_527 = 21, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_527, 170), __HIVE_P2_temp0_528 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_528, 170), __HIVE_P2_temp0_529 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_529, 170), __HIVE_P2_temp0_530 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_530, 170), __HIVE_P2_temp0_531 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_531, 170), __HIVE_P2_temp0_532 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_532, 170), __HIVE_P2_temp0_533 = 4, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_533, 170), __HIVE_P2_temp0_534 = 4, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_534, 170), __HIVE_P2_temp0_535 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_535, 170), __HIVE_P2_temp0_536 = 19, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_536, 170), __HIVE_P2_temp0_537 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_537, 170), __HIVE_P2_temp0_538 = 13, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_538, 170), __HIVE_P2_temp0_539 = 4, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_539, 170), __HIVE_P2_temp0_540 = 31, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_540, 170), __HIVE_P2_temp0_541 = 9, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_541, 170), __HIVE_P2_temp0_542 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_542, 170), __HIVE_P2_temp0_543 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_543, 170), __HIVE_P2_temp0_544 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_544, 170), __HIVE_P2_temp0_545 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_545, 170), __HIVE_P2_temp0_546 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_546, 170), __HIVE_P2_temp0_547 = 37, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_547, 170), __HIVE_P2_temp0_548 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_548, 170), __HIVE_P2_temp0_549 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_549, 170), __HIVE_P2_temp0_550 = 26, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_550, 170), __HIVE_P2_temp0_551 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_551, 170), __HIVE_P2_temp0_552 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_552, 170), __HIVE_P2_temp0_553 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_553, 170), __HIVE_P2_temp0_554 = 45, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_554, 170), __HIVE_P2_temp0_555 = 52, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_555, 170), __HIVE_P2_temp0_556 = 19, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_556, 170), __HIVE_P2_temp0_557 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_557, 170), __HIVE_P2_temp0_558 = 21, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_558, 170), __HIVE_P2_temp0_559 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_559, 170), __HIVE_P2_temp0_560 = 31, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_560, 170), __HIVE_P2_temp0_561 = 47, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_561, 170), __HIVE_P2_temp0_562 = 21, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_562, 170), __HIVE_P2_temp0_563 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_563, 170), __HIVE_P2_temp0_564 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_564, 170), __HIVE_P2_temp0_565 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_565, 170), __HIVE_P2_temp0_566 = 185, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_566, 170), __HIVE_P2_temp0_567 = 46, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_567, 170), __HIVE_P2_temp0_568 = 42, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_568, 170), __HIVE_P2_temp0_569 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_569, 170), __HIVE_P2_temp0_570 = 37, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_570, 170), __HIVE_P2_temp0_571 = 47, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_571, 170), __HIVE_P2_temp0_572 = 21, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_572, 170), __HIVE_P2_temp0_573 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_573, 170), __HIVE_P2_temp0_574 = 60, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_574, 170), __HIVE_P2_temp0_575 = 42, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_575, 170), __HIVE_P2_temp0_576 = 14, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_576, 170), __HIVE_P2_temp0_577 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_577, 170), __HIVE_P2_temp0_578 = 72, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_578, 170), __HIVE_P2_temp0_579 = 26, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_579, 170), __HIVE_P2_temp0_580 = 38, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_580, 170), __HIVE_P2_temp0_581 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_581, 170), __HIVE_P2_temp0_582 = 186, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_582, 170), __HIVE_P2_temp0_583 = 43, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_583, 170), __HIVE_P2_temp0_584 = 117, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_584, 170), __HIVE_P2_temp0_585 = 63, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_585, 170), __HIVE_P2_temp0_586 = 32, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_586, 170), __HIVE_P2_temp0_587 = 7, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_587, 170), __HIVE_P2_temp0_588 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_588, 170), __HIVE_P2_temp0_589 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_589, 170), __HIVE_P2_temp0_590 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_590, 170), __HIVE_P2_temp0_591 = 7, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_591, 170), __HIVE_P2_temp0_592 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_592, 170), __HIVE_P2_temp0_593 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_593, 170), __HIVE_P2_temp0_594 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_594, 170), __HIVE_P2_temp0_595 = 23, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_595, 170), __HIVE_P2_temp0_596 = 16, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_596, 170), __HIVE_P2_temp0_597 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_597, 170), __HIVE_P2_temp0_598 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_598, 170), __HIVE_P2_temp0_599 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_599, 170), __HIVE_P2_temp0_600 = 95, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_600, 170), __HIVE_P2_temp0_601 = 7, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_601, 170), __HIVE_P2_temp0_602 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_602, 170), __HIVE_P2_temp0_603 = 38, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_603, 170), __HIVE_P2_temp0_604 = 17, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_604, 170), __HIVE_P2_temp0_605 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_605, 170), __HIVE_P2_temp0_606 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_606, 170), __HIVE_P2_temp0_607 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_607, 170), __HIVE_P2_temp0_608 = 29, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_608, 170), __HIVE_P2_temp0_609 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_609, 170), __HIVE_P2_temp0_610 = 11, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_610, 170), __HIVE_P2_temp0_611 = 39, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_611, 170), __HIVE_P2_temp0_612 = 8, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_612, 170), __HIVE_P2_temp0_613 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_613, 170), __HIVE_P2_temp0_614 = 22, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_614, 170), __HIVE_P2_temp0_615 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_615, 170), __HIVE_P2_temp0_616 = 12, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_616, 170), __HIVE_P2_temp0_617 = 45, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_617, 170), __HIVE_P2_temp0_618 = 20, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_618, 170), __HIVE_P2_temp0_619 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_619, 170), __HIVE_P2_temp0_620 = 19, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_620, 170), __HIVE_P2_temp0_621 = 72, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_621, 170), __HIVE_P2_temp0_622 = 200, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_622, 170), __HIVE_P2_temp0_623 = 32, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_623, 170), __HIVE_P2_temp0_624 = 32, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_624, 170), __HIVE_P2_temp0_625 = 8, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_625, 170), __HIVE_P2_temp0_626 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_626, 170), __HIVE_P2_temp0_627 = 36, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_627, 170), __HIVE_P2_temp0_628 = 18, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_628, 170), __HIVE_P2_temp0_629 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_629, 170), __HIVE_P2_temp0_630 = 50, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_630, 170), __HIVE_P2_temp0_631 = 29, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_631, 170), __HIVE_P2_temp0_632 = 113, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_632, 170), __HIVE_P2_temp0_633 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_633, 170), __HIVE_P2_temp0_634 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_634, 170), __HIVE_P2_temp0_635 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_635, 170), __HIVE_P2_temp0_636 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_636, 170), __HIVE_P2_temp0_637 = 37, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_637, 170), __HIVE_P2_temp0_638 = 22, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_638, 170), __HIVE_P2_temp0_639 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_639, 170), __HIVE_P2_temp0_640 = 26, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_640, 170), __HIVE_P2_temp0_641 = 5, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_641, 170), __HIVE_P2_temp0_642 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_642, 170), __HIVE_P2_temp0_643 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_643, 170), __HIVE_P2_temp0_644 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_644, 170), __HIVE_P2_temp0_645 = 31, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_645, 170), __HIVE_P2_temp0_646 = 15, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_646, 170), __HIVE_P2_temp0_647 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_647, 170), __HIVE_P2_temp0_648 = 328, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_648, 170), __HIVE_P2_temp0_649 = 18, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_649, 170), __HIVE_P2_temp0_650 = 16, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_650, 170), __HIVE_P2_temp0_651 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_651, 170), __HIVE_P2_temp0_652 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_652, 170), __HIVE_P2_temp0_653 = 12, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_653, 170), __HIVE_P2_temp0_654 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_654, 170), __HIVE_P2_temp0_655 = 33, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_655, 170), __HIVE_P2_temp0_656 = 125, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_656, 170), __HIVE_P2_temp0_657 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_657, 170), __HIVE_P2_temp0_658 = 80, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_658, 170), __HIVE_P2_temp0_659 = 921, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_659, 170), __HIVE_P2_temp0_660 = 103, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_660, 170), __HIVE_P2_temp0_661 = 110, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_661, 170), __HIVE_P2_temp0_662 = 18, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_662, 170), __HIVE_P2_temp0_663 = 195, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_663, 170), __HIVE_P2_temp0_664 = 2637, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_664, 170), __HIVE_P2_temp0_665 = 96, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_665, 170), __HIVE_P2_temp0_666 = 16, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_666, 170), __HIVE_P2_temp0_667 = 1071, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_667, 170), __HIVE_P2_temp0_668 = 18, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_668, 170), __HIVE_P2_temp0_669 = 5, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_669, 170), __HIVE_P2_temp0_670 = 26, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_670, 170), __HIVE_P2_temp0_671 = 3994, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_671, 170), __HIVE_P2_temp0_672 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_672, 170), __HIVE_P2_temp0_673 = 582, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_673, 170), __HIVE_P2_temp0_674 = 6842, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_674, 170), __HIVE_P2_temp0_675 = 29, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_675, 170), __HIVE_P2_temp0_676 = 1763, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_676, 170), __HIVE_P2_temp0_677 = 568, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_677, 170), __HIVE_P2_temp0_678 = 8, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_678, 170), __HIVE_P2_temp0_679 = 30, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_679, 170), __HIVE_P2_temp0_680 = 18, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_680, 170), __HIVE_P2_temp0_681 = 78, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_681, 170), __HIVE_P2_temp0_682 = 18, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_682, 170), __HIVE_P2_temp0_683 = 29, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_683, 170), __HIVE_P2_temp0_684 = 19, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_684, 170), __HIVE_P2_temp0_685 = 47, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_685, 170), __HIVE_P2_temp0_686 = 17, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_686, 170), __HIVE_P2_temp0_687 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_687, 170), __HIVE_P2_temp0_688 = 32, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_688, 170), __HIVE_P2_temp0_689 = 20, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_689, 170), __HIVE_P2_temp0_690 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_690, 170), __HIVE_P2_temp0_691 = 18, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_691, 170), __HIVE_P2_temp0_692 = 433, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_692, 170), __HIVE_P2_temp0_693 = 44, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_693, 170), __HIVE_P2_temp0_694 = 212, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_694, 170), __HIVE_P2_temp0_695 = 63, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_695, 170), __HIVE_P2_temp0_696 = 129, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_696, 170), __HIVE_P2_temp0_697 = 74, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_697, 170), __HIVE_P2_temp0_698 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_698, 170), __HIVE_P2_temp0_699 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_699, 170), __HIVE_P2_temp0_700 = 67, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_700, 170), __HIVE_P2_temp0_701 = 12, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_701, 170), __HIVE_P2_temp0_702 = 65, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_702, 170), __HIVE_P2_temp0_703 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_703, 170), __HIVE_P2_temp0_704 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_704, 170), __HIVE_P2_temp0_705 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_705, 170), __HIVE_P2_temp0_706 = 29, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_706, 170), __HIVE_P2_temp0_707 = 6135, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_707, 170), __HIVE_P2_temp0_708 = 9, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_708, 170), __HIVE_P2_temp0_709 = 1237, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_709, 170), __HIVE_P2_temp0_710 = 42, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_710, 170), __HIVE_P2_temp0_711 = 9, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_711, 170), __HIVE_P2_temp0_712 = 8936, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_712, 170), __HIVE_P2_temp0_713 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_713, 170), __HIVE_P2_temp0_714 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_714, 170), __HIVE_P2_temp0_715 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_715, 170), __HIVE_P2_temp0_716 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_716, 170), __HIVE_P2_temp0_717 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_717, 170), __HIVE_P2_temp0_718 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_718, 170), __HIVE_P2_temp0_719 = 290, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_719, 170), __HIVE_P2_temp0_720 = 16, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_720, 170), __HIVE_P2_temp0_721 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_721, 170), __HIVE_P2_temp0_722 = 30, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_722, 170), __HIVE_P2_temp0_723 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_723, 170), __HIVE_P2_temp0_724 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_724, 170), __HIVE_P2_temp0_725 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_725, 170), __HIVE_P2_temp0_726 = 15, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_726, 170), __HIVE_P2_temp0_727 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_727, 170), __HIVE_P2_temp0_728 = 9, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_728, 170), __HIVE_P2_temp0_729 = 395, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_729, 170), __HIVE_P2_temp0_730 = 2309, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_730, 170), __HIVE_P2_temp0_731 = 106, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_731, 170), __HIVE_P2_temp0_732 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_732, 170), __HIVE_P2_temp0_733 = 12, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_733, 170), __HIVE_P2_temp0_734 = 4, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_734, 170), __HIVE_P2_temp0_735 = 8, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_735, 170), __HIVE_P2_temp0_736 = 8, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_736, 170), __HIVE_P2_temp0_737 = 9, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_737, 170), __HIVE_P2_temp0_738 = 5991, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_738, 170), __HIVE_P2_temp0_739 = 84, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_739, 170), __HIVE_P2_temp0_740 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_740, 170), __HIVE_P2_temp0_741 = 70, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_741, 170), __HIVE_P2_temp0_742 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_742, 170), __HIVE_P2_temp0_743 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_743, 170), __HIVE_P2_temp0_744 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_744, 170), __HIVE_P2_temp0_745 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_745, 170), __HIVE_P2_temp0_746 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_746, 170), __HIVE_P2_temp0_747 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_747, 170), __HIVE_P2_temp0_748 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_748, 170), __HIVE_P2_temp0_749 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_749, 170), __HIVE_P2_temp0_750 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_750, 170), __HIVE_P2_temp0_751 = 11, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_751, 170), __HIVE_P2_temp0_752 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_752, 170), __HIVE_P2_temp0_753 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_753, 170), __HIVE_P2_temp0_754 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_754, 170), __HIVE_P2_temp0_755 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_755, 170), __HIVE_P2_temp0_756 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_756, 170), __HIVE_P2_temp0_757 = 64, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_757, 170), __HIVE_P2_temp0_758 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_758, 170), __HIVE_P2_temp0_759 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_759, 170), __HIVE_P2_temp0_760 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_760, 170), __HIVE_P2_temp0_761 = 7, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_761, 170), __HIVE_P2_temp0_762 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_762, 170), __HIVE_P2_temp0_763 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_763, 170), __HIVE_P2_temp0_764 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_764, 170), __HIVE_P2_temp0_765 = 27, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_765, 170), __HIVE_P2_temp0_766 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_766, 170), __HIVE_P2_temp0_767 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_767, 170), __HIVE_P2_temp0_768 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_768, 170), __HIVE_P2_temp0_769 = 4, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_769, 170), __HIVE_P2_temp0_770 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_770, 170), __HIVE_P2_temp0_771 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_771, 170), __HIVE_P2_temp0_772 = 4, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_772, 170), __HIVE_P2_temp0_773 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_773, 170), __HIVE_P2_temp0_774 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_774, 170), __HIVE_P2_temp0_775 = 339, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_775, 170), __HIVE_P2_temp0_776 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_776, 170), __HIVE_P2_temp0_777 = 24, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_777, 170), __HIVE_P2_temp0_778 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_778, 170), __HIVE_P2_temp0_779 = 24, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_779, 170), __HIVE_P2_temp0_780 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_780, 170), __HIVE_P2_temp0_781 = 30, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_781, 170), __HIVE_P2_temp0_782 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_782, 170), __HIVE_P2_temp0_783 = 24, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_783, 170), __HIVE_P2_temp0_784 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_784, 170), __HIVE_P2_temp0_785 = 30, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_785, 170), __HIVE_P2_temp0_786 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_786, 170), __HIVE_P2_temp0_787 = 24, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_787, 170), __HIVE_P2_temp0_788 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_788, 170), __HIVE_P2_temp0_789 = 30, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_789, 170), __HIVE_P2_temp0_790 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_790, 170), __HIVE_P2_temp0_791 = 24, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_791, 170), __HIVE_P2_temp0_792 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_792, 170), __HIVE_P2_temp0_793 = 30, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_793, 170), __HIVE_P2_temp0_794 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_794, 170), __HIVE_P2_temp0_795 = 24, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_795, 170), __HIVE_P2_temp0_796 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_796, 170), __HIVE_P2_temp0_797 = 7, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_797, 170), __HIVE_P2_temp0_798 = 1845, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_798, 170), __HIVE_P2_temp0_799 = 30, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_799, 170), __HIVE_P2_temp0_800 = 7, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_800, 170), __HIVE_P2_temp0_801 = 5, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_801, 170), __HIVE_P2_temp0_802 = 262, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_802, 170), __HIVE_P2_temp0_803 = 61, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_803, 170), __HIVE_P2_temp0_804 = 147, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_804, 170), __HIVE_P2_temp0_805 = 44, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_805, 170), __HIVE_P2_temp0_806 = 11, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_806, 170), __HIVE_P2_temp0_807 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_807, 170), __HIVE_P2_temp0_808 = 17, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_808, 170), __HIVE_P2_temp0_809 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_809, 170), __HIVE_P2_temp0_810 = 322, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_810, 170), __HIVE_P2_temp0_811 = 29, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_811, 170), __HIVE_P2_temp0_812 = 19, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_812, 170), __HIVE_P2_temp0_813 = 43, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_813, 170), __HIVE_P2_temp0_814 = 485, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_814, 170), __HIVE_P2_temp0_815 = 27, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_815, 170), __HIVE_P2_temp0_816 = 229, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_816, 170), __HIVE_P2_temp0_817 = 29, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_817, 170), __HIVE_P2_temp0_818 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_818, 170), __HIVE_P2_temp0_819 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_819, 170), __HIVE_P2_temp0_820 = 496, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_820, 170), __HIVE_P2_temp0_821 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_821, 170), __HIVE_P2_temp0_822 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_822, 170), __HIVE_P2_temp0_823 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_823, 170), __HIVE_P2_temp0_824 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_824, 170), __HIVE_P2_temp0_825 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_825, 170), __HIVE_P2_temp0_826 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_826, 170), __HIVE_P2_temp0_827 = 14, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_827, 170), __HIVE_P2_temp0_828 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_828, 170), __HIVE_P2_temp0_829 = 196, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_829, 170), __HIVE_P2_temp0_830 = 60, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_830, 170), __HIVE_P2_temp0_831 = 67, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_831, 170), __HIVE_P2_temp0_832 = 8, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_832, 170), __HIVE_P2_temp0_833 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_833, 170), __HIVE_P2_temp0_834 = 1205, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_834, 170), __HIVE_P2_temp0_835 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_835, 170), __HIVE_P2_temp0_836 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_836, 170), __HIVE_P2_temp0_837 = 26, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_837, 170), __HIVE_P2_temp0_838 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_838, 170), __HIVE_P2_temp0_839 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_839, 170), __HIVE_P2_temp0_840 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_840, 170), __HIVE_P2_temp0_841 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_841, 170), __HIVE_P2_temp0_842 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_842, 170), __HIVE_P2_temp0_843 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_843, 170), __HIVE_P2_temp0_844 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_844, 170), __HIVE_P2_temp0_845 = 9, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_845, 170), __HIVE_P2_temp0_846 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_846, 170), __HIVE_P2_temp0_847 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_847, 170), __HIVE_P2_temp0_848 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_848, 170), __HIVE_P2_temp0_849 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_849, 170), __HIVE_P2_temp0_850 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_850, 170), __HIVE_P2_temp0_851 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_851, 170), __HIVE_P2_temp0_852 = 7, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_852, 170), __HIVE_P2_temp0_853 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_853, 170), __HIVE_P2_temp0_854 = 5, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_854, 170), __HIVE_P2_temp0_855 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_855, 170), __HIVE_P2_temp0_856 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_856, 170), __HIVE_P2_temp0_857 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_857, 170), __HIVE_P2_temp0_858 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_858, 170), __HIVE_P2_temp0_859 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_859, 170), __HIVE_P2_temp0_860 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_860, 170), __HIVE_P2_temp0_861 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_861, 170), __HIVE_P2_temp0_862 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_862, 170), __HIVE_P2_temp0_863 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_863, 170), __HIVE_P2_temp0_864 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_864, 170), __HIVE_P2_temp0_865 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_865, 170), __HIVE_P2_temp0_866 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_866, 170), __HIVE_P2_temp0_867 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_867, 170), __HIVE_P2_temp0_868 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_868, 170), __HIVE_P2_temp0_869 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_869, 170), __HIVE_P2_temp0_870 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_870, 170), __HIVE_P2_temp0_871 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_871, 170), __HIVE_P2_temp0_872 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_872, 170), __HIVE_P2_temp0_873 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_873, 170), __HIVE_P2_temp0_874 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_874, 170), __HIVE_P2_temp0_875 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_875, 170), __HIVE_P2_temp0_876 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_876, 170), __HIVE_P2_temp0_877 = 1, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_877, 170), __HIVE_P2_temp0_878 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_878, 170), __HIVE_P2_temp0_879 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_879, 170), __HIVE_P2_temp0_880 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_880, 170), __HIVE_P2_temp0_881 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_881, 170), __HIVE_P2_temp0_882 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_882, 170), __HIVE_P2_temp0_883 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_883, 170), __HIVE_P2_temp0_884 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_884, 170), __HIVE_P2_temp0_885 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_885, 170), __HIVE_P2_temp0_886 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_886, 170), __HIVE_P2_temp0_887 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_887, 170), __HIVE_P2_temp0_888 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_888, 170), __HIVE_P2_temp0_889 = 0, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_889, 170), __HIVE_P2_temp0_890 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_890, 170), __HIVE_P2_temp0_891 = 9, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_891, 170), __HIVE_P2_temp0_892 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_892, 170), __HIVE_P2_temp0_893 = 16, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_893, 170), __HIVE_P2_temp0_894 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_894, 170), __HIVE_P2_temp0_895 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_895, 170), __HIVE_P2_temp0_896 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_896, 170), __HIVE_P2_temp0_897 = 4, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_897, 170), __HIVE_P2_temp0_898 = 2, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_898, 170), __HIVE_P2_temp0_899 = 16, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_899, 170), __HIVE_P2_temp0_900 = 4421, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_900, 170), __HIVE_P2_temp0_901 = 42719, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_901, 170), __HIVE_P2_temp0_902 = 33, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_902, 170), __HIVE_P2_temp0_903 = 4153, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_903, 170), __HIVE_P2_temp0_904 = 7, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_904, 170), __HIVE_P2_temp0_905 = 221, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_905, 170), __HIVE_P2_temp0_906 = 3, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_906, 170), __HIVE_P2_temp0_907 = 5761, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_907, 170), __HIVE_P2_temp0_908 = 15, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_908, 170), __HIVE_P2_temp0_909 = 7472, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_909, 170), __HIVE_P2_temp0_910 = 16, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_910, 170), __HIVE_P2_temp0_911 = 621, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_911, 170), __HIVE_P2_temp0_912 = 2467, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_912, 170), __HIVE_P2_temp0_913 = 541, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_913, 170), __HIVE_P2_temp0_914 = 1507, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_914, 170), __HIVE_P2_temp0_915 = 4938, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_915, 170), __HIVE_P2_temp0_916 = 6, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_916, 170), __HIVE_P2_temp0_917 = 4191, __HIVE_P2_temp0_319 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_319, __HIVE_P2_temp0_917, 170), __HIVE_P2_checkArrayDepth(__HIVE_P2_temp0_319, 170), __HIVE_P2_reserveArray(598, 170, 598), __HIVE_P2_ownArray([__HIVE_P2_temp0_320, __HIVE_P2_temp0_321, __HIVE_P2_temp0_322, __HIVE_P2_temp0_323, __HIVE_P2_temp0_324, __HIVE_P2_temp0_325, __HIVE_P2_temp0_326, __HIVE_P2_temp0_327, __HIVE_P2_temp0_328, __HIVE_P2_temp0_329, __HIVE_P2_temp0_330, __HIVE_P2_temp0_331, __HIVE_P2_temp0_332, __HIVE_P2_temp0_333, __HIVE_P2_temp0_334, __HIVE_P2_temp0_335, __HIVE_P2_temp0_336, __HIVE_P2_temp0_337, __HIVE_P2_temp0_338, __HIVE_P2_temp0_339, __HIVE_P2_temp0_340, __HIVE_P2_temp0_341, __HIVE_P2_temp0_342, __HIVE_P2_temp0_343, __HIVE_P2_temp0_344, __HIVE_P2_temp0_345, __HIVE_P2_temp0_346, __HIVE_P2_temp0_347, __HIVE_P2_temp0_348, __HIVE_P2_temp0_349, __HIVE_P2_temp0_350, __HIVE_P2_temp0_351, __HIVE_P2_temp0_352, __HIVE_P2_temp0_353, __HIVE_P2_temp0_354, __HIVE_P2_temp0_355, __HIVE_P2_temp0_356, __HIVE_P2_temp0_357, __HIVE_P2_temp0_358, __HIVE_P2_temp0_359, __HIVE_P2_temp0_360, __HIVE_P2_temp0_361, __HIVE_P2_temp0_362, __HIVE_P2_temp0_363, __HIVE_P2_temp0_364, __HIVE_P2_temp0_365, __HIVE_P2_temp0_366, __HIVE_P2_temp0_367, __HIVE_P2_temp0_368, __HIVE_P2_temp0_369, __HIVE_P2_temp0_370, __HIVE_P2_temp0_371, __HIVE_P2_temp0_372, __HIVE_P2_temp0_373, __HIVE_P2_temp0_374, __HIVE_P2_temp0_375, __HIVE_P2_temp0_376, __HIVE_P2_temp0_377, __HIVE_P2_temp0_378, __HIVE_P2_temp0_379, __HIVE_P2_temp0_380, __HIVE_P2_temp0_381, __HIVE_P2_temp0_382, __HIVE_P2_temp0_383, __HIVE_P2_temp0_384, __HIVE_P2_temp0_385, __HIVE_P2_temp0_386, __HIVE_P2_temp0_387, __HIVE_P2_temp0_388, __HIVE_P2_temp0_389, __HIVE_P2_temp0_390, __HIVE_P2_temp0_391, __HIVE_P2_temp0_392, __HIVE_P2_temp0_393, __HIVE_P2_temp0_394, __HIVE_P2_temp0_395, __HIVE_P2_temp0_396, __HIVE_P2_temp0_397, __HIVE_P2_temp0_398, __HIVE_P2_temp0_399, __HIVE_P2_temp0_400, __HIVE_P2_temp0_401, __HIVE_P2_temp0_402, __HIVE_P2_temp0_403, __HIVE_P2_temp0_404, __HIVE_P2_temp0_405, __HIVE_P2_temp0_406, __HIVE_P2_temp0_407, __HIVE_P2_temp0_408, __HIVE_P2_temp0_409, __HIVE_P2_temp0_410, __HIVE_P2_temp0_411, __HIVE_P2_temp0_412, __HIVE_P2_temp0_413, __HIVE_P2_temp0_414, __HIVE_P2_temp0_415, __HIVE_P2_temp0_416, __HIVE_P2_temp0_417, __HIVE_P2_temp0_418, __HIVE_P2_temp0_419, __HIVE_P2_temp0_420, __HIVE_P2_temp0_421, __HIVE_P2_temp0_422, __HIVE_P2_temp0_423, __HIVE_P2_temp0_424, __HIVE_P2_temp0_425, __HIVE_P2_temp0_426, __HIVE_P2_temp0_427, __HIVE_P2_temp0_428, __HIVE_P2_temp0_429, __HIVE_P2_temp0_430, __HIVE_P2_temp0_431, __HIVE_P2_temp0_432, __HIVE_P2_temp0_433, __HIVE_P2_temp0_434, __HIVE_P2_temp0_435, __HIVE_P2_temp0_436, __HIVE_P2_temp0_437, __HIVE_P2_temp0_438, __HIVE_P2_temp0_439, __HIVE_P2_temp0_440, __HIVE_P2_temp0_441, __HIVE_P2_temp0_442, __HIVE_P2_temp0_443, __HIVE_P2_temp0_444, __HIVE_P2_temp0_445, __HIVE_P2_temp0_446, __HIVE_P2_temp0_447, __HIVE_P2_temp0_448, __HIVE_P2_temp0_449, __HIVE_P2_temp0_450, __HIVE_P2_temp0_451, __HIVE_P2_temp0_452, __HIVE_P2_temp0_453, __HIVE_P2_temp0_454, __HIVE_P2_temp0_455, __HIVE_P2_temp0_456, __HIVE_P2_temp0_457, __HIVE_P2_temp0_458, __HIVE_P2_temp0_459, __HIVE_P2_temp0_460, __HIVE_P2_temp0_461, __HIVE_P2_temp0_462, __HIVE_P2_temp0_463, __HIVE_P2_temp0_464, __HIVE_P2_temp0_465, __HIVE_P2_temp0_466, __HIVE_P2_temp0_467, __HIVE_P2_temp0_468, __HIVE_P2_temp0_469, __HIVE_P2_temp0_470, __HIVE_P2_temp0_471, __HIVE_P2_temp0_472, __HIVE_P2_temp0_473, __HIVE_P2_temp0_474, __HIVE_P2_temp0_475, __HIVE_P2_temp0_476, __HIVE_P2_temp0_477, __HIVE_P2_temp0_478, __HIVE_P2_temp0_479, __HIVE_P2_temp0_480, __HIVE_P2_temp0_481, __HIVE_P2_temp0_482, __HIVE_P2_temp0_483, __HIVE_P2_temp0_484, __HIVE_P2_temp0_485, __HIVE_P2_temp0_486, __HIVE_P2_temp0_487, __HIVE_P2_temp0_488, __HIVE_P2_temp0_489, __HIVE_P2_temp0_490, __HIVE_P2_temp0_491, __HIVE_P2_temp0_492, __HIVE_P2_temp0_493, __HIVE_P2_temp0_494, __HIVE_P2_temp0_495, __HIVE_P2_temp0_496, __HIVE_P2_temp0_497, __HIVE_P2_temp0_498, __HIVE_P2_temp0_499, __HIVE_P2_temp0_500, __HIVE_P2_temp0_501, __HIVE_P2_temp0_502, __HIVE_P2_temp0_503, __HIVE_P2_temp0_504, __HIVE_P2_temp0_505, __HIVE_P2_temp0_506, __HIVE_P2_temp0_507, __HIVE_P2_temp0_508, __HIVE_P2_temp0_509, __HIVE_P2_temp0_510, __HIVE_P2_temp0_511, __HIVE_P2_temp0_512, __HIVE_P2_temp0_513, __HIVE_P2_temp0_514, __HIVE_P2_temp0_515, __HIVE_P2_temp0_516, __HIVE_P2_temp0_517, __HIVE_P2_temp0_518, __HIVE_P2_temp0_519, __HIVE_P2_temp0_520, __HIVE_P2_temp0_521, __HIVE_P2_temp0_522, __HIVE_P2_temp0_523, __HIVE_P2_temp0_524, __HIVE_P2_temp0_525, __HIVE_P2_temp0_526, __HIVE_P2_temp0_527, __HIVE_P2_temp0_528, __HIVE_P2_temp0_529, __HIVE_P2_temp0_530, __HIVE_P2_temp0_531, __HIVE_P2_temp0_532, __HIVE_P2_temp0_533, __HIVE_P2_temp0_534, __HIVE_P2_temp0_535, __HIVE_P2_temp0_536, __HIVE_P2_temp0_537, __HIVE_P2_temp0_538, __HIVE_P2_temp0_539, __HIVE_P2_temp0_540, __HIVE_P2_temp0_541, __HIVE_P2_temp0_542, __HIVE_P2_temp0_543, __HIVE_P2_temp0_544, __HIVE_P2_temp0_545, __HIVE_P2_temp0_546, __HIVE_P2_temp0_547, __HIVE_P2_temp0_548, __HIVE_P2_temp0_549, __HIVE_P2_temp0_550, __HIVE_P2_temp0_551, __HIVE_P2_temp0_552, __HIVE_P2_temp0_553, __HIVE_P2_temp0_554, __HIVE_P2_temp0_555, __HIVE_P2_temp0_556, __HIVE_P2_temp0_557, __HIVE_P2_temp0_558, __HIVE_P2_temp0_559, __HIVE_P2_temp0_560, __HIVE_P2_temp0_561, __HIVE_P2_temp0_562, __HIVE_P2_temp0_563, __HIVE_P2_temp0_564, __HIVE_P2_temp0_565, __HIVE_P2_temp0_566, __HIVE_P2_temp0_567, __HIVE_P2_temp0_568, __HIVE_P2_temp0_569, __HIVE_P2_temp0_570, __HIVE_P2_temp0_571, __HIVE_P2_temp0_572, __HIVE_P2_temp0_573, __HIVE_P2_temp0_574, __HIVE_P2_temp0_575, __HIVE_P2_temp0_576, __HIVE_P2_temp0_577, __HIVE_P2_temp0_578, __HIVE_P2_temp0_579, __HIVE_P2_temp0_580, __HIVE_P2_temp0_581, __HIVE_P2_temp0_582, __HIVE_P2_temp0_583, __HIVE_P2_temp0_584, __HIVE_P2_temp0_585, __HIVE_P2_temp0_586, __HIVE_P2_temp0_587, __HIVE_P2_temp0_588, __HIVE_P2_temp0_589, __HIVE_P2_temp0_590, __HIVE_P2_temp0_591, __HIVE_P2_temp0_592, __HIVE_P2_temp0_593, __HIVE_P2_temp0_594, __HIVE_P2_temp0_595, __HIVE_P2_temp0_596, __HIVE_P2_temp0_597, __HIVE_P2_temp0_598, __HIVE_P2_temp0_599, __HIVE_P2_temp0_600, __HIVE_P2_temp0_601, __HIVE_P2_temp0_602, __HIVE_P2_temp0_603, __HIVE_P2_temp0_604, __HIVE_P2_temp0_605, __HIVE_P2_temp0_606, __HIVE_P2_temp0_607, __HIVE_P2_temp0_608, __HIVE_P2_temp0_609, __HIVE_P2_temp0_610, __HIVE_P2_temp0_611, __HIVE_P2_temp0_612, __HIVE_P2_temp0_613, __HIVE_P2_temp0_614, __HIVE_P2_temp0_615, __HIVE_P2_temp0_616, __HIVE_P2_temp0_617, __HIVE_P2_temp0_618, __HIVE_P2_temp0_619, __HIVE_P2_temp0_620, __HIVE_P2_temp0_621, __HIVE_P2_temp0_622, __HIVE_P2_temp0_623, __HIVE_P2_temp0_624, __HIVE_P2_temp0_625, __HIVE_P2_temp0_626, __HIVE_P2_temp0_627, __HIVE_P2_temp0_628, __HIVE_P2_temp0_629, __HIVE_P2_temp0_630, __HIVE_P2_temp0_631, __HIVE_P2_temp0_632, __HIVE_P2_temp0_633, __HIVE_P2_temp0_634, __HIVE_P2_temp0_635, __HIVE_P2_temp0_636, __HIVE_P2_temp0_637, __HIVE_P2_temp0_638, __HIVE_P2_temp0_639, __HIVE_P2_temp0_640, __HIVE_P2_temp0_641, __HIVE_P2_temp0_642, __HIVE_P2_temp0_643, __HIVE_P2_temp0_644, __HIVE_P2_temp0_645, __HIVE_P2_temp0_646, __HIVE_P2_temp0_647, __HIVE_P2_temp0_648, __HIVE_P2_temp0_649, __HIVE_P2_temp0_650, __HIVE_P2_temp0_651, __HIVE_P2_temp0_652, __HIVE_P2_temp0_653, __HIVE_P2_temp0_654, __HIVE_P2_temp0_655, __HIVE_P2_temp0_656, __HIVE_P2_temp0_657, __HIVE_P2_temp0_658, __HIVE_P2_temp0_659, __HIVE_P2_temp0_660, __HIVE_P2_temp0_661, __HIVE_P2_temp0_662, __HIVE_P2_temp0_663, __HIVE_P2_temp0_664, __HIVE_P2_temp0_665, __HIVE_P2_temp0_666, __HIVE_P2_temp0_667, __HIVE_P2_temp0_668, __HIVE_P2_temp0_669, __HIVE_P2_temp0_670, __HIVE_P2_temp0_671, __HIVE_P2_temp0_672, __HIVE_P2_temp0_673, __HIVE_P2_temp0_674, __HIVE_P2_temp0_675, __HIVE_P2_temp0_676, __HIVE_P2_temp0_677, __HIVE_P2_temp0_678, __HIVE_P2_temp0_679, __HIVE_P2_temp0_680, __HIVE_P2_temp0_681, __HIVE_P2_temp0_682, __HIVE_P2_temp0_683, __HIVE_P2_temp0_684, __HIVE_P2_temp0_685, __HIVE_P2_temp0_686, __HIVE_P2_temp0_687, __HIVE_P2_temp0_688, __HIVE_P2_temp0_689, __HIVE_P2_temp0_690, __HIVE_P2_temp0_691, __HIVE_P2_temp0_692, __HIVE_P2_temp0_693, __HIVE_P2_temp0_694, __HIVE_P2_temp0_695, __HIVE_P2_temp0_696, __HIVE_P2_temp0_697, __HIVE_P2_temp0_698, __HIVE_P2_temp0_699, __HIVE_P2_temp0_700, __HIVE_P2_temp0_701, __HIVE_P2_temp0_702, __HIVE_P2_temp0_703, __HIVE_P2_temp0_704, __HIVE_P2_temp0_705, __HIVE_P2_temp0_706, __HIVE_P2_temp0_707, __HIVE_P2_temp0_708, __HIVE_P2_temp0_709, __HIVE_P2_temp0_710, __HIVE_P2_temp0_711, __HIVE_P2_temp0_712, __HIVE_P2_temp0_713, __HIVE_P2_temp0_714, __HIVE_P2_temp0_715, __HIVE_P2_temp0_716, __HIVE_P2_temp0_717, __HIVE_P2_temp0_718, __HIVE_P2_temp0_719, __HIVE_P2_temp0_720, __HIVE_P2_temp0_721, __HIVE_P2_temp0_722, __HIVE_P2_temp0_723, __HIVE_P2_temp0_724, __HIVE_P2_temp0_725, __HIVE_P2_temp0_726, __HIVE_P2_temp0_727, __HIVE_P2_temp0_728, __HIVE_P2_temp0_729, __HIVE_P2_temp0_730, __HIVE_P2_temp0_731, __HIVE_P2_temp0_732, __HIVE_P2_temp0_733, __HIVE_P2_temp0_734, __HIVE_P2_temp0_735, __HIVE_P2_temp0_736, __HIVE_P2_temp0_737, __HIVE_P2_temp0_738, __HIVE_P2_temp0_739, __HIVE_P2_temp0_740, __HIVE_P2_temp0_741, __HIVE_P2_temp0_742, __HIVE_P2_temp0_743, __HIVE_P2_temp0_744, __HIVE_P2_temp0_745, __HIVE_P2_temp0_746, __HIVE_P2_temp0_747, __HIVE_P2_temp0_748, __HIVE_P2_temp0_749, __HIVE_P2_temp0_750, __HIVE_P2_temp0_751, __HIVE_P2_temp0_752, __HIVE_P2_temp0_753, __HIVE_P2_temp0_754, __HIVE_P2_temp0_755, __HIVE_P2_temp0_756, __HIVE_P2_temp0_757, __HIVE_P2_temp0_758, __HIVE_P2_temp0_759, __HIVE_P2_temp0_760, __HIVE_P2_temp0_761, __HIVE_P2_temp0_762, __HIVE_P2_temp0_763, __HIVE_P2_temp0_764, __HIVE_P2_temp0_765, __HIVE_P2_temp0_766, __HIVE_P2_temp0_767, __HIVE_P2_temp0_768, __HIVE_P2_temp0_769, __HIVE_P2_temp0_770, __HIVE_P2_temp0_771, __HIVE_P2_temp0_772, __HIVE_P2_temp0_773, __HIVE_P2_temp0_774, __HIVE_P2_temp0_775, __HIVE_P2_temp0_776, __HIVE_P2_temp0_777, __HIVE_P2_temp0_778, __HIVE_P2_temp0_779, __HIVE_P2_temp0_780, __HIVE_P2_temp0_781, __HIVE_P2_temp0_782, __HIVE_P2_temp0_783, __HIVE_P2_temp0_784, __HIVE_P2_temp0_785, __HIVE_P2_temp0_786, __HIVE_P2_temp0_787, __HIVE_P2_temp0_788, __HIVE_P2_temp0_789, __HIVE_P2_temp0_790, __HIVE_P2_temp0_791, __HIVE_P2_temp0_792, __HIVE_P2_temp0_793, __HIVE_P2_temp0_794, __HIVE_P2_temp0_795, __HIVE_P2_temp0_796, __HIVE_P2_temp0_797, __HIVE_P2_temp0_798, __HIVE_P2_temp0_799, __HIVE_P2_temp0_800, __HIVE_P2_temp0_801, __HIVE_P2_temp0_802, __HIVE_P2_temp0_803, __HIVE_P2_temp0_804, __HIVE_P2_temp0_805, __HIVE_P2_temp0_806, __HIVE_P2_temp0_807, __HIVE_P2_temp0_808, __HIVE_P2_temp0_809, __HIVE_P2_temp0_810, __HIVE_P2_temp0_811, __HIVE_P2_temp0_812, __HIVE_P2_temp0_813, __HIVE_P2_temp0_814, __HIVE_P2_temp0_815, __HIVE_P2_temp0_816, __HIVE_P2_temp0_817, __HIVE_P2_temp0_818, __HIVE_P2_temp0_819, __HIVE_P2_temp0_820, __HIVE_P2_temp0_821, __HIVE_P2_temp0_822, __HIVE_P2_temp0_823, __HIVE_P2_temp0_824, __HIVE_P2_temp0_825, __HIVE_P2_temp0_826, __HIVE_P2_temp0_827, __HIVE_P2_temp0_828, __HIVE_P2_temp0_829, __HIVE_P2_temp0_830, __HIVE_P2_temp0_831, __HIVE_P2_temp0_832, __HIVE_P2_temp0_833, __HIVE_P2_temp0_834, __HIVE_P2_temp0_835, __HIVE_P2_temp0_836, __HIVE_P2_temp0_837, __HIVE_P2_temp0_838, __HIVE_P2_temp0_839, __HIVE_P2_temp0_840, __HIVE_P2_temp0_841, __HIVE_P2_temp0_842, __HIVE_P2_temp0_843, __HIVE_P2_temp0_844, __HIVE_P2_temp0_845, __HIVE_P2_temp0_846, __HIVE_P2_temp0_847, __HIVE_P2_temp0_848, __HIVE_P2_temp0_849, __HIVE_P2_temp0_850, __HIVE_P2_temp0_851, __HIVE_P2_temp0_852, __HIVE_P2_temp0_853, __HIVE_P2_temp0_854, __HIVE_P2_temp0_855, __HIVE_P2_temp0_856, __HIVE_P2_temp0_857, __HIVE_P2_temp0_858, __HIVE_P2_temp0_859, __HIVE_P2_temp0_860, __HIVE_P2_temp0_861, __HIVE_P2_temp0_862, __HIVE_P2_temp0_863, __HIVE_P2_temp0_864, __HIVE_P2_temp0_865, __HIVE_P2_temp0_866, __HIVE_P2_temp0_867, __HIVE_P2_temp0_868, __HIVE_P2_temp0_869, __HIVE_P2_temp0_870, __HIVE_P2_temp0_871, __HIVE_P2_temp0_872, __HIVE_P2_temp0_873, __HIVE_P2_temp0_874, __HIVE_P2_temp0_875, __HIVE_P2_temp0_876, __HIVE_P2_temp0_877, __HIVE_P2_temp0_878, __HIVE_P2_temp0_879, __HIVE_P2_temp0_880, __HIVE_P2_temp0_881, __HIVE_P2_temp0_882, __HIVE_P2_temp0_883, __HIVE_P2_temp0_884, __HIVE_P2_temp0_885, __HIVE_P2_temp0_886, __HIVE_P2_temp0_887, __HIVE_P2_temp0_888, __HIVE_P2_temp0_889, __HIVE_P2_temp0_890, __HIVE_P2_temp0_891, __HIVE_P2_temp0_892, __HIVE_P2_temp0_893, __HIVE_P2_temp0_894, __HIVE_P2_temp0_895, __HIVE_P2_temp0_896, __HIVE_P2_temp0_897, __HIVE_P2_temp0_898, __HIVE_P2_temp0_899, __HIVE_P2_temp0_900, __HIVE_P2_temp0_901, __HIVE_P2_temp0_902, __HIVE_P2_temp0_903, __HIVE_P2_temp0_904, __HIVE_P2_temp0_905, __HIVE_P2_temp0_906, __HIVE_P2_temp0_907, __HIVE_P2_temp0_908, __HIVE_P2_temp0_909, __HIVE_P2_temp0_910, __HIVE_P2_temp0_911, __HIVE_P2_temp0_912, __HIVE_P2_temp0_913, __HIVE_P2_temp0_914, __HIVE_P2_temp0_915, __HIVE_P2_temp0_916, __HIVE_P2_temp0_917], 170, "ARRAY", __HIVE_P2_temp0_319));
    var s = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-ᫎᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･";
    var r = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-ࢎࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೝೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꟍꟐꟑꟓꟕ-Ƛꟲ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";
    var a = (__HIVE_P2_reserveObject(5, 171), __HIVE_P2_ownObject({ 3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile", 5: "class enum extends super const export import", 6: "enum", strict: "implements interface let package private protected public static yield", strictBind: "eval arguments" }, 171, 5, 19));
    var n = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
    var o = (__HIVE_P2_reserveObject(3, 172), __HIVE_P2_ownObject({ 5: n, "5module": __HIVE_P2_binary("+", n, " export import", 173), 6: __HIVE_P2_binary("+", n, " const class extends export import super", 174) }, 172, 3, 9));
    var h = __HIVE_P2_toolRegex("/^in(stanceof)?$/", 175);
    var p = __HIVE_P2_construct(__HIVE_P2_RegExp, (__HIVE_P2_reserveArray(1, 176), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_binary("+", "[", r, 178), "]", 177)], 176, "CONTROL_ARRAY")), 176);
    var c = __HIVE_P2_construct(__HIVE_P2_RegExp, (__HIVE_P2_reserveArray(1, 179), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_binary("+", __HIVE_P2_binary("+", "[", r, 182), s, 181), "]", 180)], 179, "CONTROL_ARRAY")), 179);
    function isInAstralSet(e, t) {
        var i = 65536;
        for (var s = 0; __HIVE_P2_binary("<", s, __HIVE_P2_get(t, "length", 186), 185); s = __HIVE_P2_binary("+", s, 2, 187)) {
            __HIVE_P2_tick(184);
            i = __HIVE_P2_binary("+", i, __HIVE_P2_get(t, s, 189), 188);
            if (__HIVE_P2_binary(">", i, e, 190)) {
                return false;
            }
            i = __HIVE_P2_binary("+", i, __HIVE_P2_get(t, __HIVE_P2_binary("+", s, 1, 193), 192), 191);
            if (__HIVE_P2_binary(">=", i, e, 194)) {
                return true;
            }
        }
        return false;
    }
    function isIdentifierStart(e, t) {
        if (__HIVE_P2_binary(">", e, 127, 197))
            __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 198), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 198, "CONTROL_ARRAY")), 198);
        return e === 36 || e === 95 || __HIVE_P2_binary(">=", e, 65, 199) && __HIVE_P2_binary("<=", e, 90, 200) || __HIVE_P2_binary(">=", e, 97, 201) && __HIVE_P2_binary("<=", e, 122, 202);
    }
    function isIdentifierChar(e, s) {
        if (__HIVE_P2_binary(">", e, 127, 205))
            __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 206), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 206, "CONTROL_ARRAY")), 206);
        return e === 36 || e === 95 || __HIVE_P2_binary(">=", e, 48, 207) && __HIVE_P2_binary("<=", e, 57, 208) || __HIVE_P2_binary(">=", e, 65, 209) && __HIVE_P2_binary("<=", e, 90, 210) || __HIVE_P2_binary(">=", e, 97, 211) && __HIVE_P2_binary("<=", e, 122, 212);
    }
    var l = (__HIVE_P2_reserveFunction(213), __HIVE_P2_registerFunction(function TokenType(e, t) {
        var __HIVE_P2_temp213_0, __HIVE_P2_temp213_1, __HIVE_P2_temp213_2, __HIVE_P2_temp213_3, __HIVE_P2_temp213_4, __HIVE_P2_temp213_5, __HIVE_P2_temp213_6, __HIVE_P2_temp213_7, __HIVE_P2_temp213_8, __HIVE_P2_temp213_9, __HIVE_P2_temp213_10, __HIVE_P2_temp213_11, __HIVE_P2_temp213_12, __HIVE_P2_temp213_13, __HIVE_P2_temp213_14, __HIVE_P2_temp213_15, __HIVE_P2_temp213_16, __HIVE_P2_temp213_17, __HIVE_P2_temp213_18, __HIVE_P2_temp213_19, __HIVE_P2_temp213_20, __HIVE_P2_temp213_21, __HIVE_P2_temp213_22, __HIVE_P2_temp213_23, __HIVE_P2_temp213_24, __HIVE_P2_temp213_25, __HIVE_P2_temp213_26, __HIVE_P2_temp213_27, __HIVE_P2_temp213_28, __HIVE_P2_temp213_29;
        if (t === void 0)
            t = (__HIVE_P2_reserveObject(0, 215), __HIVE_P2_ownObject({}, 215, 0, 0));
        (__HIVE_P2_temp213_0 = this, __HIVE_P2_temp213_1 = "label", __HIVE_P2_set(__HIVE_P2_temp213_0, __HIVE_P2_temp213_1, e, 216));
        (__HIVE_P2_temp213_3 = this, __HIVE_P2_temp213_4 = "keyword", __HIVE_P2_set(__HIVE_P2_temp213_3, __HIVE_P2_temp213_4, __HIVE_P2_get(t, "keyword", 220), 218));
        (__HIVE_P2_temp213_6 = this, __HIVE_P2_temp213_7 = "beforeExpr", __HIVE_P2_set(__HIVE_P2_temp213_6, __HIVE_P2_temp213_7, !!__HIVE_P2_get(t, "beforeExpr", 223), 221));
        (__HIVE_P2_temp213_9 = this, __HIVE_P2_temp213_10 = "startsExpr", __HIVE_P2_set(__HIVE_P2_temp213_9, __HIVE_P2_temp213_10, !!__HIVE_P2_get(t, "startsExpr", 226), 224));
        (__HIVE_P2_temp213_12 = this, __HIVE_P2_temp213_13 = "isLoop", __HIVE_P2_set(__HIVE_P2_temp213_12, __HIVE_P2_temp213_13, !!__HIVE_P2_get(t, "isLoop", 229), 227));
        (__HIVE_P2_temp213_15 = this, __HIVE_P2_temp213_16 = "isAssign", __HIVE_P2_set(__HIVE_P2_temp213_15, __HIVE_P2_temp213_16, !!__HIVE_P2_get(t, "isAssign", 232), 230));
        (__HIVE_P2_temp213_18 = this, __HIVE_P2_temp213_19 = "prefix", __HIVE_P2_set(__HIVE_P2_temp213_18, __HIVE_P2_temp213_19, !!__HIVE_P2_get(t, "prefix", 235), 233));
        (__HIVE_P2_temp213_21 = this, __HIVE_P2_temp213_22 = "postfix", __HIVE_P2_set(__HIVE_P2_temp213_21, __HIVE_P2_temp213_22, !!__HIVE_P2_get(t, "postfix", 238), 236));
        (__HIVE_P2_temp213_24 = this, __HIVE_P2_temp213_25 = "binop", __HIVE_P2_set(__HIVE_P2_temp213_24, __HIVE_P2_temp213_25, __HIVE_P2_get(t, "binop", 241) || null, 239));
        (__HIVE_P2_temp213_27 = this, __HIVE_P2_temp213_28 = "updateContext", __HIVE_P2_set(__HIVE_P2_temp213_27, __HIVE_P2_temp213_28, null, 242));
    }, 30, 2, 0, 213));
    function binop(e, t) {
        return __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 245), __HIVE_P2_ownArray([e, (__HIVE_P2_reserveObject(2, 246), __HIVE_P2_ownObject({ beforeExpr: true, binop: t }, 246, 2, 15))], 245, "CONTROL_ARRAY")), 245);
    }
    var u = (__HIVE_P2_reserveObject(1, 247), __HIVE_P2_ownObject({ beforeExpr: true }, 247, 1, 10)), f = (__HIVE_P2_reserveObject(1, 248), __HIVE_P2_ownObject({ startsExpr: true }, 248, 1, 10));
    var d = (__HIVE_P2_reserveObject(0, 249), __HIVE_P2_ownObject({}, 249, 0, 0));
    function kw(e, t) {
        var __HIVE_P2_temp250_0, __HIVE_P2_temp250_1, __HIVE_P2_temp250_2, __HIVE_P2_temp250_3, __HIVE_P2_temp250_4, __HIVE_P2_temp250_5;
        if (t === void 0)
            t = (__HIVE_P2_reserveObject(0, 252), __HIVE_P2_ownObject({}, 252, 0, 0));
        (__HIVE_P2_temp250_0 = t, __HIVE_P2_temp250_1 = "keyword", __HIVE_P2_set(__HIVE_P2_temp250_0, __HIVE_P2_temp250_1, e, 253));
        return (__HIVE_P2_temp250_3 = d, __HIVE_P2_temp250_4 = e, __HIVE_P2_set(__HIVE_P2_temp250_3, __HIVE_P2_temp250_4, __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 257), __HIVE_P2_ownArray([e, t], 257, "CONTROL_ARRAY")), 257), 255));
    }
    var m = (__HIVE_P2_reserveObject(77, 258), __HIVE_P2_ownObject({ num: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 259), __HIVE_P2_ownArray(["num", f], 259, "CONTROL_ARRAY")), 259), regexp: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 260), __HIVE_P2_ownArray(["regexp", f], 260, "CONTROL_ARRAY")), 260), string: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 261), __HIVE_P2_ownArray(["string", f], 261, "CONTROL_ARRAY")), 261), name: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 262), __HIVE_P2_ownArray(["name", f], 262, "CONTROL_ARRAY")), 262), privateId: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 263), __HIVE_P2_ownArray(["privateId", f], 263, "CONTROL_ARRAY")), 263), eof: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(1, 264), __HIVE_P2_ownArray(["eof"], 264, "CONTROL_ARRAY")), 264), bracketL: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 265), __HIVE_P2_ownArray(["[", (__HIVE_P2_reserveObject(2, 266), __HIVE_P2_ownObject({ beforeExpr: true, startsExpr: true }, 266, 2, 20))], 265, "CONTROL_ARRAY")), 265), bracketR: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(1, 267), __HIVE_P2_ownArray(["]"], 267, "CONTROL_ARRAY")), 267), braceL: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 268), __HIVE_P2_ownArray(["{", (__HIVE_P2_reserveObject(2, 269), __HIVE_P2_ownObject({ beforeExpr: true, startsExpr: true }, 269, 2, 20))], 268, "CONTROL_ARRAY")), 268), braceR: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(1, 270), __HIVE_P2_ownArray(["}"], 270, "CONTROL_ARRAY")), 270), parenL: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 271), __HIVE_P2_ownArray(["(", (__HIVE_P2_reserveObject(2, 272), __HIVE_P2_ownObject({ beforeExpr: true, startsExpr: true }, 272, 2, 20))], 271, "CONTROL_ARRAY")), 271), parenR: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(1, 273), __HIVE_P2_ownArray([")"], 273, "CONTROL_ARRAY")), 273), comma: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 274), __HIVE_P2_ownArray([",", u], 274, "CONTROL_ARRAY")), 274), semi: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 275), __HIVE_P2_ownArray([";", u], 275, "CONTROL_ARRAY")), 275), colon: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 276), __HIVE_P2_ownArray([":", u], 276, "CONTROL_ARRAY")), 276), dot: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(1, 277), __HIVE_P2_ownArray(["."], 277, "CONTROL_ARRAY")), 277), question: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 278), __HIVE_P2_ownArray(["?", u], 278, "CONTROL_ARRAY")), 278), questionDot: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(1, 279), __HIVE_P2_ownArray(["?."], 279, "CONTROL_ARRAY")), 279), arrow: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 280), __HIVE_P2_ownArray(["=>", u], 280, "CONTROL_ARRAY")), 280), template: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(1, 281), __HIVE_P2_ownArray(["template"], 281, "CONTROL_ARRAY")), 281), invalidTemplate: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(1, 282), __HIVE_P2_ownArray(["invalidTemplate"], 282, "CONTROL_ARRAY")), 282), ellipsis: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 283), __HIVE_P2_ownArray(["...", u], 283, "CONTROL_ARRAY")), 283), backQuote: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 284), __HIVE_P2_ownArray(["`", f], 284, "CONTROL_ARRAY")), 284), dollarBraceL: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 285), __HIVE_P2_ownArray(["${", (__HIVE_P2_reserveObject(2, 286), __HIVE_P2_ownObject({ beforeExpr: true, startsExpr: true }, 286, 2, 20))], 285, "CONTROL_ARRAY")), 285), eq: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 287), __HIVE_P2_ownArray(["=", (__HIVE_P2_reserveObject(2, 288), __HIVE_P2_ownObject({ beforeExpr: true, isAssign: true }, 288, 2, 18))], 287, "CONTROL_ARRAY")), 287), assign: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 289), __HIVE_P2_ownArray(["_=", (__HIVE_P2_reserveObject(2, 290), __HIVE_P2_ownObject({ beforeExpr: true, isAssign: true }, 290, 2, 18))], 289, "CONTROL_ARRAY")), 289), incDec: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 291), __HIVE_P2_ownArray(["++/--", (__HIVE_P2_reserveObject(3, 292), __HIVE_P2_ownObject({ prefix: true, postfix: true, startsExpr: true }, 292, 3, 23))], 291, "CONTROL_ARRAY")), 291), prefix: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 293), __HIVE_P2_ownArray(["!/~", (__HIVE_P2_reserveObject(3, 294), __HIVE_P2_ownObject({ beforeExpr: true, prefix: true, startsExpr: true }, 294, 3, 26))], 293, "CONTROL_ARRAY")), 293), logicalOR: __HIVE_P2_invoke(binop, void 0, (__HIVE_P2_reserveArray(2, 295), __HIVE_P2_ownArray(["||", 1], 295, "CONTROL_ARRAY")), 295), logicalAND: __HIVE_P2_invoke(binop, void 0, (__HIVE_P2_reserveArray(2, 296), __HIVE_P2_ownArray(["&&", 2], 296, "CONTROL_ARRAY")), 296), bitwiseOR: __HIVE_P2_invoke(binop, void 0, (__HIVE_P2_reserveArray(2, 297), __HIVE_P2_ownArray(["|", 3], 297, "CONTROL_ARRAY")), 297), bitwiseXOR: __HIVE_P2_invoke(binop, void 0, (__HIVE_P2_reserveArray(2, 298), __HIVE_P2_ownArray(["^", 4], 298, "CONTROL_ARRAY")), 298), bitwiseAND: __HIVE_P2_invoke(binop, void 0, (__HIVE_P2_reserveArray(2, 299), __HIVE_P2_ownArray(["&", 5], 299, "CONTROL_ARRAY")), 299), equality: __HIVE_P2_invoke(binop, void 0, (__HIVE_P2_reserveArray(2, 300), __HIVE_P2_ownArray(["==/!=/===/!==", 6], 300, "CONTROL_ARRAY")), 300), relational: __HIVE_P2_invoke(binop, void 0, (__HIVE_P2_reserveArray(2, 301), __HIVE_P2_ownArray(["</>/<=/>=", 7], 301, "CONTROL_ARRAY")), 301), bitShift: __HIVE_P2_invoke(binop, void 0, (__HIVE_P2_reserveArray(2, 302), __HIVE_P2_ownArray(["<</>>/>>>", 8], 302, "CONTROL_ARRAY")), 302), plusMin: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 303), __HIVE_P2_ownArray(["+/-", (__HIVE_P2_reserveObject(4, 304), __HIVE_P2_ownObject({ beforeExpr: true, binop: 9, prefix: true, startsExpr: true }, 304, 4, 31))], 303, "CONTROL_ARRAY")), 303), modulo: __HIVE_P2_invoke(binop, void 0, (__HIVE_P2_reserveArray(2, 305), __HIVE_P2_ownArray(["%", 10], 305, "CONTROL_ARRAY")), 305), star: __HIVE_P2_invoke(binop, void 0, (__HIVE_P2_reserveArray(2, 306), __HIVE_P2_ownArray(["*", 10], 306, "CONTROL_ARRAY")), 306), slash: __HIVE_P2_invoke(binop, void 0, (__HIVE_P2_reserveArray(2, 307), __HIVE_P2_ownArray(["/", 10], 307, "CONTROL_ARRAY")), 307), starstar: __HIVE_P2_construct(l, (__HIVE_P2_reserveArray(2, 308), __HIVE_P2_ownArray(["**", (__HIVE_P2_reserveObject(1, 309), __HIVE_P2_ownObject({ beforeExpr: true }, 309, 1, 10))], 308, "CONTROL_ARRAY")), 308), coalesce: __HIVE_P2_invoke(binop, void 0, (__HIVE_P2_reserveArray(2, 310), __HIVE_P2_ownArray(["??", 1], 310, "CONTROL_ARRAY")), 310), _break: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(1, 311), __HIVE_P2_ownArray(["break"], 311, "CONTROL_ARRAY")), 311), _case: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 312), __HIVE_P2_ownArray(["case", u], 312, "CONTROL_ARRAY")), 312), _catch: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(1, 313), __HIVE_P2_ownArray(["catch"], 313, "CONTROL_ARRAY")), 313), _continue: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(1, 314), __HIVE_P2_ownArray(["continue"], 314, "CONTROL_ARRAY")), 314), _debugger: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(1, 315), __HIVE_P2_ownArray(["debugger"], 315, "CONTROL_ARRAY")), 315), _default: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 316), __HIVE_P2_ownArray(["default", u], 316, "CONTROL_ARRAY")), 316), _do: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 317), __HIVE_P2_ownArray(["do", (__HIVE_P2_reserveObject(2, 318), __HIVE_P2_ownObject({ isLoop: true, beforeExpr: true }, 318, 2, 16))], 317, "CONTROL_ARRAY")), 317), _else: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 319), __HIVE_P2_ownArray(["else", u], 319, "CONTROL_ARRAY")), 319), _finally: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(1, 320), __HIVE_P2_ownArray(["finally"], 320, "CONTROL_ARRAY")), 320), _for: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 321), __HIVE_P2_ownArray(["for", (__HIVE_P2_reserveObject(1, 322), __HIVE_P2_ownObject({ isLoop: true }, 322, 1, 6))], 321, "CONTROL_ARRAY")), 321), _function: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 323), __HIVE_P2_ownArray(["function", f], 323, "CONTROL_ARRAY")), 323), _if: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(1, 324), __HIVE_P2_ownArray(["if"], 324, "CONTROL_ARRAY")), 324), _return: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 325), __HIVE_P2_ownArray(["return", u], 325, "CONTROL_ARRAY")), 325), _switch: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(1, 326), __HIVE_P2_ownArray(["switch"], 326, "CONTROL_ARRAY")), 326), _throw: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 327), __HIVE_P2_ownArray(["throw", u], 327, "CONTROL_ARRAY")), 327), _try: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(1, 328), __HIVE_P2_ownArray(["try"], 328, "CONTROL_ARRAY")), 328), _var: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(1, 329), __HIVE_P2_ownArray(["var"], 329, "CONTROL_ARRAY")), 329), _const: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(1, 330), __HIVE_P2_ownArray(["const"], 330, "CONTROL_ARRAY")), 330), _while: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 331), __HIVE_P2_ownArray(["while", (__HIVE_P2_reserveObject(1, 332), __HIVE_P2_ownObject({ isLoop: true }, 332, 1, 6))], 331, "CONTROL_ARRAY")), 331), _with: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(1, 333), __HIVE_P2_ownArray(["with"], 333, "CONTROL_ARRAY")), 333), _new: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 334), __HIVE_P2_ownArray(["new", (__HIVE_P2_reserveObject(2, 335), __HIVE_P2_ownObject({ beforeExpr: true, startsExpr: true }, 335, 2, 20))], 334, "CONTROL_ARRAY")), 334), _this: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 336), __HIVE_P2_ownArray(["this", f], 336, "CONTROL_ARRAY")), 336), _super: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 337), __HIVE_P2_ownArray(["super", f], 337, "CONTROL_ARRAY")), 337), _class: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 338), __HIVE_P2_ownArray(["class", f], 338, "CONTROL_ARRAY")), 338), _extends: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 339), __HIVE_P2_ownArray(["extends", u], 339, "CONTROL_ARRAY")), 339), _export: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(1, 340), __HIVE_P2_ownArray(["export"], 340, "CONTROL_ARRAY")), 340), _import: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 341), __HIVE_P2_ownArray(["import", f], 341, "CONTROL_ARRAY")), 341), _null: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 342), __HIVE_P2_ownArray(["null", f], 342, "CONTROL_ARRAY")), 342), _true: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 343), __HIVE_P2_ownArray(["true", f], 343, "CONTROL_ARRAY")), 343), _false: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 344), __HIVE_P2_ownArray(["false", f], 344, "CONTROL_ARRAY")), 344), _in: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 345), __HIVE_P2_ownArray(["in", (__HIVE_P2_reserveObject(2, 346), __HIVE_P2_ownObject({ beforeExpr: true, binop: 7 }, 346, 2, 15))], 345, "CONTROL_ARRAY")), 345), _instanceof: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 347), __HIVE_P2_ownArray(["instanceof", (__HIVE_P2_reserveObject(2, 348), __HIVE_P2_ownObject({ beforeExpr: true, binop: 7 }, 348, 2, 15))], 347, "CONTROL_ARRAY")), 347), _typeof: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 349), __HIVE_P2_ownArray(["typeof", (__HIVE_P2_reserveObject(3, 350), __HIVE_P2_ownObject({ beforeExpr: true, prefix: true, startsExpr: true }, 350, 3, 26))], 349, "CONTROL_ARRAY")), 349), _void: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 351), __HIVE_P2_ownArray(["void", (__HIVE_P2_reserveObject(3, 352), __HIVE_P2_ownObject({ beforeExpr: true, prefix: true, startsExpr: true }, 352, 3, 26))], 351, "CONTROL_ARRAY")), 351), _delete: __HIVE_P2_invoke(kw, void 0, (__HIVE_P2_reserveArray(2, 353), __HIVE_P2_ownArray(["delete", (__HIVE_P2_reserveObject(3, 354), __HIVE_P2_ownObject({ beforeExpr: true, prefix: true, startsExpr: true }, 354, 3, 26))], 353, "CONTROL_ARRAY")), 353) }, 258, 77, 508));
    var g = __HIVE_P2_toolRegex("/\\r\\n?|\\n|\\u2028|\\u2029/", 355);
    var v = __HIVE_P2_construct(__HIVE_P2_RegExp, (__HIVE_P2_reserveArray(2, 356), __HIVE_P2_ownArray([__HIVE_P2_get(g, "source", 357), "g"], 356, "CONTROL_ARRAY")), 356);
    function isNewLine(e) {
        return e === 10 || e === 13 || e === 8232 || e === 8233;
    }
    function nextLineBreak(e, t, i) {
        var __HIVE_P2_temp359_0, __HIVE_P2_temp359_1, __HIVE_P2_temp359_2, __HIVE_P2_temp359_3, __HIVE_P2_temp359_4, __HIVE_P2_temp359_5;
        if (i === void 0)
            i = __HIVE_P2_get(e, "length", 361);
        for (var s = t; __HIVE_P2_binary("<", s, i, 363); (__HIVE_P2_temp359_0 = __HIVE_P2_numeric(s, 364), __HIVE_P2_temp359_1 = __HIVE_P2_temp359_0 + 1, s = __HIVE_P2_temp359_1, __HIVE_P2_temp359_0)) {
            __HIVE_P2_tick(362);
            var r = (__HIVE_P2_temp359_2 = e, __HIVE_P2_temp359_3 = __HIVE_P2_get(__HIVE_P2_temp359_2, "charCodeAt", 365), __HIVE_P2_invoke(__HIVE_P2_temp359_3, __HIVE_P2_temp359_2, (__HIVE_P2_reserveArray(1, 365), __HIVE_P2_ownArray([s], 365, "CONTROL_ARRAY")), 365));
            if (__HIVE_P2_invoke(isNewLine, void 0, (__HIVE_P2_reserveArray(1, 367), __HIVE_P2_ownArray([r], 367, "CONTROL_ARRAY")), 367)) {
                return __HIVE_P2_binary("<", s, __HIVE_P2_binary("-", i, 1, 369), 368) && r === 13 && (__HIVE_P2_temp359_4 = e, __HIVE_P2_temp359_5 = __HIVE_P2_get(__HIVE_P2_temp359_4, "charCodeAt", 370), __HIVE_P2_invoke(__HIVE_P2_temp359_5, __HIVE_P2_temp359_4, (__HIVE_P2_reserveArray(1, 370), __HIVE_P2_ownArray([__HIVE_P2_binary("+", s, 1, 371)], 370, "CONTROL_ARRAY")), 370)) === 10 ? __HIVE_P2_binary("+", s, 2, 373) : __HIVE_P2_binary("+", s, 1, 374);
            }
        }
        return __HIVE_P2_unary("-", 1, 375);
    }
    var x = __HIVE_P2_toolRegex("/[\\u1680\\u2000-\\u200a\\u202f\\u205f\\u3000\\ufeff]/", 376);
    var y = __HIVE_P2_toolRegex("/(?:\\s|\\/\\/.*|\\/\\*[^]*?\\*\\/)*/g", 377);
    var b = __HIVE_P2_get(__HIVE_P2_Object, "prototype", 378);
    var k = __HIVE_P2_get(b, "hasOwnProperty", 379);
    var _ = __HIVE_P2_get(b, "toString", 380);
    var S = __HIVE_P2_get(__HIVE_P2_Object, "hasOwn", 381) || (__HIVE_P2_reserveFunction(382), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp382_0, __HIVE_P2_temp382_1;
        return (__HIVE_P2_temp382_0 = k, __HIVE_P2_temp382_1 = __HIVE_P2_get(__HIVE_P2_temp382_0, "call", 383), __HIVE_P2_invoke(__HIVE_P2_temp382_1, __HIVE_P2_temp382_0, (__HIVE_P2_reserveArray(2, 383), __HIVE_P2_ownArray([e, t], 383, "CONTROL_ARRAY")), 383));
    }, 2, 2, 0, 382));
    var C = __HIVE_P2_get(__HIVE_P2_Array, "isArray", 385) || (__HIVE_P2_reserveFunction(386), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp386_0, __HIVE_P2_temp386_1;
        return (__HIVE_P2_temp386_0 = _, __HIVE_P2_temp386_1 = __HIVE_P2_get(__HIVE_P2_temp386_0, "call", 387), __HIVE_P2_invoke(__HIVE_P2_temp386_1, __HIVE_P2_temp386_0, (__HIVE_P2_reserveArray(1, 387), __HIVE_P2_ownArray([e], 387, "CONTROL_ARRAY")), 387)) === "[object Array]";
    }, 2, 1, 0, 386));
    var w = (__HIVE_P2_temp0_918 = __HIVE_P2_Object, __HIVE_P2_temp0_919 = __HIVE_P2_get(__HIVE_P2_temp0_918, "create", 389), __HIVE_P2_invoke(__HIVE_P2_temp0_919, __HIVE_P2_temp0_918, (__HIVE_P2_reserveArray(1, 389), __HIVE_P2_ownArray([null], 389, "CONTROL_ARRAY")), 389));
    function wordsRegexp(e) {
        var __HIVE_P2_temp392_0, __HIVE_P2_temp392_1;
        return __HIVE_P2_construct(__HIVE_P2_RegExp, (__HIVE_P2_reserveArray(1, 393), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_binary("+", "^(?:", (__HIVE_P2_temp392_0 = e, __HIVE_P2_temp392_1 = __HIVE_P2_get(__HIVE_P2_temp392_0, "replace", 396), __HIVE_P2_invoke(__HIVE_P2_temp392_1, __HIVE_P2_temp392_0, (__HIVE_P2_reserveArray(2, 396), __HIVE_P2_ownArray([__HIVE_P2_toolRegex("/ /g", 397), "|"], 396, "CONTROL_ARRAY")), 396)), 395), ")$", 394)], 393, "CONTROL_ARRAY")), 393);
    }
    function codePointToString(e) {
        return __HIVE_P2_invoke(__codePoint, void 0, (__HIVE_P2_reserveArray(1, 401), __HIVE_P2_ownArray([e], 401, "CONTROL_ARRAY")), 401);
    }
    var E = __HIVE_P2_toolRegex("/(?:[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF])/", 402);
    var I = (__HIVE_P2_reserveFunction(403), __HIVE_P2_registerFunction(function Position(e, t) {
        var __HIVE_P2_temp403_0, __HIVE_P2_temp403_1, __HIVE_P2_temp403_2, __HIVE_P2_temp403_3, __HIVE_P2_temp403_4, __HIVE_P2_temp403_5;
        (__HIVE_P2_temp403_0 = this, __HIVE_P2_temp403_1 = "line", __HIVE_P2_set(__HIVE_P2_temp403_0, __HIVE_P2_temp403_1, e, 404));
        (__HIVE_P2_temp403_3 = this, __HIVE_P2_temp403_4 = "column", __HIVE_P2_set(__HIVE_P2_temp403_3, __HIVE_P2_temp403_4, t, 406));
    }, 6, 2, 0, 403));
    (__HIVE_P2_temp0_920 = __HIVE_P2_get(I, "prototype", 410), __HIVE_P2_temp0_921 = "offset", __HIVE_P2_set(__HIVE_P2_temp0_920, __HIVE_P2_temp0_921, (__HIVE_P2_reserveFunction(411), __HIVE_P2_registerFunction(function offset(e) {
        return __HIVE_P2_construct(I, (__HIVE_P2_reserveArray(2, 412), __HIVE_P2_ownArray([__HIVE_P2_get(this, "line", 413), __HIVE_P2_binary("+", __HIVE_P2_get(this, "column", 415), e, 414)], 412, "CONTROL_ARRAY")), 412);
    }, 0, 1, 0, 411)), 408));
    var A = (__HIVE_P2_reserveFunction(416), __HIVE_P2_registerFunction(function SourceLocation(e, t, i) {
        var __HIVE_P2_temp416_0, __HIVE_P2_temp416_1, __HIVE_P2_temp416_2, __HIVE_P2_temp416_3, __HIVE_P2_temp416_4, __HIVE_P2_temp416_5, __HIVE_P2_temp416_6, __HIVE_P2_temp416_7, __HIVE_P2_temp416_8;
        (__HIVE_P2_temp416_0 = this, __HIVE_P2_temp416_1 = "start", __HIVE_P2_set(__HIVE_P2_temp416_0, __HIVE_P2_temp416_1, t, 417));
        (__HIVE_P2_temp416_3 = this, __HIVE_P2_temp416_4 = "end", __HIVE_P2_set(__HIVE_P2_temp416_3, __HIVE_P2_temp416_4, i, 419));
        if (__HIVE_P2_get(e, "sourceFile", 421) !== null) {
            (__HIVE_P2_temp416_6 = this, __HIVE_P2_temp416_7 = "source", __HIVE_P2_set(__HIVE_P2_temp416_6, __HIVE_P2_temp416_7, __HIVE_P2_get(e, "sourceFile", 424), 422));
        }
    }, 9, 3, 0, 416));
    function getLineInfo(e, t) {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 427), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 427, "CONTROL_ARRAY")), 427);
    }
    var P = (__HIVE_P2_reserveObject(19, 428), __HIVE_P2_ownObject({ ecmaVersion: null, sourceType: "script", onInsertedSemicolon: null, onTrailingComma: null, allowReserved: null, allowReturnOutsideFunction: false, allowImportExportEverywhere: false, allowAwaitOutsideFunction: null, allowSuperOutsideMethod: null, allowHashBang: false, checkPrivateFields: true, locations: false, onToken: null, onComment: null, ranges: false, program: null, sourceFile: null, directSourceFile: null, preserveParens: false }, 428, 19, 278));
    var N = false;
    function getOptions(e) {
        return e;
    }
    function pushComment(e, t) {
        return (__HIVE_P2_reserveFunction(432), __HIVE_P2_registerFunction(function (i, s, r, a, n, o) {
            var __HIVE_P2_temp432_0, __HIVE_P2_temp432_1, __HIVE_P2_temp432_2, __HIVE_P2_temp432_3, __HIVE_P2_temp432_4, __HIVE_P2_temp432_5, __HIVE_P2_temp432_6, __HIVE_P2_temp432_7, __HIVE_P2_temp432_8, __HIVE_P2_temp432_9, __HIVE_P2_temp432_10;
            var h = (__HIVE_P2_reserveObject(4, 433), __HIVE_P2_ownObject({ type: i ? "Block" : "Line", value: s, start: r, end: a }, 433, 4, 17));
            if (__HIVE_P2_get(e, "locations", 434)) {
                (__HIVE_P2_temp432_0 = h, __HIVE_P2_temp432_1 = "loc", __HIVE_P2_set(__HIVE_P2_temp432_0, __HIVE_P2_temp432_1, __HIVE_P2_construct(A, (__HIVE_P2_reserveArray(3, 437), __HIVE_P2_ownArray([this, n, o], 437, "CONTROL_ARRAY")), 437), 435));
            }
            if (__HIVE_P2_get(e, "ranges", 438)) {
                (__HIVE_P2_temp432_3 = h, __HIVE_P2_temp432_4 = "range", __HIVE_P2_set(__HIVE_P2_temp432_3, __HIVE_P2_temp432_4, (__HIVE_P2_temp432_6 = 0, __HIVE_P2_temp432_7 = r, __HIVE_P2_temp432_6 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp432_6, __HIVE_P2_temp432_7, 441), __HIVE_P2_temp432_8 = a, __HIVE_P2_temp432_6 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp432_6, __HIVE_P2_temp432_8, 441), __HIVE_P2_checkArrayDepth(__HIVE_P2_temp432_6, 441), __HIVE_P2_reserveArray(2, 441, 2), __HIVE_P2_ownArray([__HIVE_P2_temp432_7, __HIVE_P2_temp432_8], 441, "ARRAY", __HIVE_P2_temp432_6)), 439));
            }
            (__HIVE_P2_temp432_9 = t, __HIVE_P2_temp432_10 = __HIVE_P2_get(__HIVE_P2_temp432_9, "push", 442), __HIVE_P2_invoke(__HIVE_P2_temp432_10, __HIVE_P2_temp432_9, (__HIVE_P2_reserveArray(1, 442), __HIVE_P2_ownArray([h], 442, "CONTROL_ARRAY")), 442));
        }, 12, 6, 0, 432));
    }
    var T = 1, V = 2, L = 4, R = 8, D = 16, O = 32, B = 64, M = 128, F = 256, U = __HIVE_P2_binary("|", __HIVE_P2_binary("|", T, V, 445), F, 444);
    function functionFlags(e, t) {
        return __HIVE_P2_binary("|", __HIVE_P2_binary("|", V, (e ? L : 0), 448), (t ? R : 0), 447);
    }
    var q = 0, j = 1, G = 2, H = 3, W = 4, z = 5;
    var K = (__HIVE_P2_reserveFunction(449), __HIVE_P2_registerFunction(function Parser(e, t, i) {
        var __HIVE_P2_temp449_0, __HIVE_P2_temp449_1, __HIVE_P2_temp449_2, __HIVE_P2_temp449_3, __HIVE_P2_temp449_4, __HIVE_P2_temp449_5, __HIVE_P2_temp449_6, __HIVE_P2_temp449_7, __HIVE_P2_temp449_8, __HIVE_P2_temp449_9, __HIVE_P2_temp449_10, __HIVE_P2_temp449_11, __HIVE_P2_temp449_12, __HIVE_P2_temp449_13, __HIVE_P2_temp449_14, __HIVE_P2_temp449_15, __HIVE_P2_temp449_16, __HIVE_P2_temp449_17, __HIVE_P2_temp449_18, __HIVE_P2_temp449_19, __HIVE_P2_temp449_20, __HIVE_P2_temp449_21, __HIVE_P2_temp449_22, __HIVE_P2_temp449_23, __HIVE_P2_temp449_24, __HIVE_P2_temp449_25, __HIVE_P2_temp449_26, __HIVE_P2_temp449_27, __HIVE_P2_temp449_28, __HIVE_P2_temp449_29, __HIVE_P2_temp449_30, __HIVE_P2_temp449_31, __HIVE_P2_temp449_32, __HIVE_P2_temp449_33, __HIVE_P2_temp449_34, __HIVE_P2_temp449_35, __HIVE_P2_temp449_36, __HIVE_P2_temp449_37, __HIVE_P2_temp449_38, __HIVE_P2_temp449_39, __HIVE_P2_temp449_40, __HIVE_P2_temp449_41, __HIVE_P2_temp449_42, __HIVE_P2_temp449_43, __HIVE_P2_temp449_44, __HIVE_P2_temp449_45, __HIVE_P2_temp449_46, __HIVE_P2_temp449_47, __HIVE_P2_temp449_48, __HIVE_P2_temp449_49, __HIVE_P2_temp449_50, __HIVE_P2_temp449_51, __HIVE_P2_temp449_52, __HIVE_P2_temp449_53, __HIVE_P2_temp449_54, __HIVE_P2_temp449_55, __HIVE_P2_temp449_56, __HIVE_P2_temp449_57, __HIVE_P2_temp449_58, __HIVE_P2_temp449_59, __HIVE_P2_temp449_60, __HIVE_P2_temp449_61, __HIVE_P2_temp449_62, __HIVE_P2_temp449_63, __HIVE_P2_temp449_64, __HIVE_P2_temp449_65, __HIVE_P2_temp449_66, __HIVE_P2_temp449_67, __HIVE_P2_temp449_68, __HIVE_P2_temp449_69, __HIVE_P2_temp449_70, __HIVE_P2_temp449_71, __HIVE_P2_temp449_72, __HIVE_P2_temp449_73, __HIVE_P2_temp449_74, __HIVE_P2_temp449_75, __HIVE_P2_temp449_76, __HIVE_P2_temp449_77, __HIVE_P2_temp449_78, __HIVE_P2_temp449_79, __HIVE_P2_temp449_80, __HIVE_P2_temp449_81, __HIVE_P2_temp449_82, __HIVE_P2_temp449_83, __HIVE_P2_temp449_84, __HIVE_P2_temp449_85, __HIVE_P2_temp449_86, __HIVE_P2_temp449_87, __HIVE_P2_temp449_88, __HIVE_P2_temp449_89, __HIVE_P2_temp449_90, __HIVE_P2_temp449_91, __HIVE_P2_temp449_92, __HIVE_P2_temp449_93, __HIVE_P2_temp449_94, __HIVE_P2_temp449_95, __HIVE_P2_temp449_96, __HIVE_P2_temp449_97, __HIVE_P2_temp449_98, __HIVE_P2_temp449_99, __HIVE_P2_temp449_100, __HIVE_P2_temp449_101, __HIVE_P2_temp449_102, __HIVE_P2_temp449_103, __HIVE_P2_temp449_104, __HIVE_P2_temp449_105, __HIVE_P2_temp449_106, __HIVE_P2_temp449_107, __HIVE_P2_temp449_108, __HIVE_P2_temp449_109, __HIVE_P2_temp449_110, __HIVE_P2_temp449_111, __HIVE_P2_temp449_112, __HIVE_P2_temp449_113, __HIVE_P2_temp449_114, __HIVE_P2_temp449_115, __HIVE_P2_temp449_116, __HIVE_P2_temp449_117, __HIVE_P2_temp449_118, __HIVE_P2_temp449_119, __HIVE_P2_temp449_120, __HIVE_P2_temp449_121, __HIVE_P2_temp449_122, __HIVE_P2_temp449_123, __HIVE_P2_temp449_124, __HIVE_P2_temp449_125, __HIVE_P2_temp449_126, __HIVE_P2_temp449_127, __HIVE_P2_temp449_128, __HIVE_P2_temp449_129, __HIVE_P2_temp449_130, __HIVE_P2_temp449_131, __HIVE_P2_temp449_132, __HIVE_P2_temp449_133, __HIVE_P2_temp449_134, __HIVE_P2_temp449_135, __HIVE_P2_temp449_136;
        (__HIVE_P2_temp449_0 = this, __HIVE_P2_temp449_1 = "options", __HIVE_P2_set(__HIVE_P2_temp449_0, __HIVE_P2_temp449_1, e = __HIVE_P2_invoke(getOptions, void 0, (__HIVE_P2_reserveArray(1, 453), __HIVE_P2_ownArray([e], 453, "CONTROL_ARRAY")), 453), 450));
        (__HIVE_P2_temp449_3 = this, __HIVE_P2_temp449_4 = "sourceFile", __HIVE_P2_set(__HIVE_P2_temp449_3, __HIVE_P2_temp449_4, __HIVE_P2_get(e, "sourceFile", 456), 454));
        (__HIVE_P2_temp449_6 = this, __HIVE_P2_temp449_7 = "keywords", __HIVE_P2_set(__HIVE_P2_temp449_6, __HIVE_P2_temp449_7, __HIVE_P2_invoke(wordsRegexp, void 0, (__HIVE_P2_reserveArray(1, 459), __HIVE_P2_ownArray([__HIVE_P2_get(o, __HIVE_P2_binary(">=", __HIVE_P2_get(e, "ecmaVersion", 462), 6, 461) ? 6 : __HIVE_P2_get(e, "sourceType", 463) === "module" ? "5module" : 5, 460)], 459, "CONTROL_ARRAY")), 459), 457));
        var s = "";
        if (__HIVE_P2_get(e, "allowReserved", 464) !== true) {
            s = __HIVE_P2_get(a, __HIVE_P2_binary(">=", __HIVE_P2_get(e, "ecmaVersion", 468), 6, 467) ? 6 : __HIVE_P2_get(e, "ecmaVersion", 469) === 5 ? 5 : 3, 466);
            if (__HIVE_P2_get(e, "sourceType", 470) === "module") {
                s = __HIVE_P2_binary("+", s, " await", 471);
            }
        }
        (__HIVE_P2_temp449_9 = this, __HIVE_P2_temp449_10 = "reservedWords", __HIVE_P2_set(__HIVE_P2_temp449_9, __HIVE_P2_temp449_10, __HIVE_P2_invoke(wordsRegexp, void 0, (__HIVE_P2_reserveArray(1, 474), __HIVE_P2_ownArray([s], 474, "CONTROL_ARRAY")), 474), 472));
        var r = __HIVE_P2_binary("+", (s ? __HIVE_P2_binary("+", s, " ", 476) : ""), __HIVE_P2_get(a, "strict", 477), 475);
        (__HIVE_P2_temp449_12 = this, __HIVE_P2_temp449_13 = "reservedWordsStrict", __HIVE_P2_set(__HIVE_P2_temp449_12, __HIVE_P2_temp449_13, __HIVE_P2_invoke(wordsRegexp, void 0, (__HIVE_P2_reserveArray(1, 480), __HIVE_P2_ownArray([r], 480, "CONTROL_ARRAY")), 480), 478));
        (__HIVE_P2_temp449_15 = this, __HIVE_P2_temp449_16 = "reservedWordsStrictBind", __HIVE_P2_set(__HIVE_P2_temp449_15, __HIVE_P2_temp449_16, __HIVE_P2_invoke(wordsRegexp, void 0, (__HIVE_P2_reserveArray(1, 483), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_binary("+", r, " ", 485), __HIVE_P2_get(a, "strictBind", 486), 484)], 483, "CONTROL_ARRAY")), 483), 481));
        (__HIVE_P2_temp449_18 = this, __HIVE_P2_temp449_19 = "input", __HIVE_P2_set(__HIVE_P2_temp449_18, __HIVE_P2_temp449_19, __HIVE_P2_invoke(__HIVE_P2_String, void 0, (__HIVE_P2_reserveArray(1, 489), __HIVE_P2_ownArray([t], 489, "CONTROL_ARRAY")), 489), 487));
        (__HIVE_P2_temp449_21 = this, __HIVE_P2_temp449_22 = "containsEsc", __HIVE_P2_set(__HIVE_P2_temp449_21, __HIVE_P2_temp449_22, false, 490));
        if (i) {
            (__HIVE_P2_temp449_24 = this, __HIVE_P2_temp449_25 = "pos", __HIVE_P2_set(__HIVE_P2_temp449_24, __HIVE_P2_temp449_25, i, 492));
            (__HIVE_P2_temp449_27 = this, __HIVE_P2_temp449_28 = "lineStart", __HIVE_P2_set(__HIVE_P2_temp449_27, __HIVE_P2_temp449_28, __HIVE_P2_binary("+", (__HIVE_P2_temp449_30 = __HIVE_P2_get(this, "input", 500), __HIVE_P2_temp449_31 = __HIVE_P2_get(__HIVE_P2_temp449_30, "lastIndexOf", 497), __HIVE_P2_invoke(__HIVE_P2_temp449_31, __HIVE_P2_temp449_30, (__HIVE_P2_reserveArray(2, 497), __HIVE_P2_ownArray(["\n", __HIVE_P2_binary("-", i, 1, 498)], 497, "CONTROL_ARRAY")), 497)), 1, 496), 494));
            (__HIVE_P2_temp449_32 = this, __HIVE_P2_temp449_33 = "curLine", __HIVE_P2_set(__HIVE_P2_temp449_32, __HIVE_P2_temp449_33, __HIVE_P2_get((__HIVE_P2_temp449_35 = (__HIVE_P2_temp449_37 = __HIVE_P2_get(this, "input", 509), __HIVE_P2_temp449_38 = __HIVE_P2_get(__HIVE_P2_temp449_37, "slice", 506), __HIVE_P2_invoke(__HIVE_P2_temp449_38, __HIVE_P2_temp449_37, (__HIVE_P2_reserveArray(2, 506), __HIVE_P2_ownArray([0, __HIVE_P2_get(this, "lineStart", 507)], 506, "CONTROL_ARRAY")), 506)), __HIVE_P2_temp449_36 = __HIVE_P2_get(__HIVE_P2_temp449_35, "split", 504), __HIVE_P2_invoke(__HIVE_P2_temp449_36, __HIVE_P2_temp449_35, (__HIVE_P2_reserveArray(1, 504), __HIVE_P2_ownArray([g], 504, "CONTROL_ARRAY")), 504)), "length", 503), 501));
        }
        else {
            (__HIVE_P2_temp449_39 = this, __HIVE_P2_temp449_40 = "pos", __HIVE_P2_set(__HIVE_P2_temp449_39, __HIVE_P2_temp449_40, (__HIVE_P2_temp449_42 = this, __HIVE_P2_temp449_43 = "lineStart", __HIVE_P2_set(__HIVE_P2_temp449_42, __HIVE_P2_temp449_43, 0, 512)), 510));
            (__HIVE_P2_temp449_45 = this, __HIVE_P2_temp449_46 = "curLine", __HIVE_P2_set(__HIVE_P2_temp449_45, __HIVE_P2_temp449_46, 1, 514));
        }
        (__HIVE_P2_temp449_48 = this, __HIVE_P2_temp449_49 = "type", __HIVE_P2_set(__HIVE_P2_temp449_48, __HIVE_P2_temp449_49, __HIVE_P2_get(m, "eof", 518), 516));
        (__HIVE_P2_temp449_51 = this, __HIVE_P2_temp449_52 = "value", __HIVE_P2_set(__HIVE_P2_temp449_51, __HIVE_P2_temp449_52, null, 519));
        (__HIVE_P2_temp449_54 = this, __HIVE_P2_temp449_55 = "start", __HIVE_P2_set(__HIVE_P2_temp449_54, __HIVE_P2_temp449_55, (__HIVE_P2_temp449_57 = this, __HIVE_P2_temp449_58 = "end", __HIVE_P2_set(__HIVE_P2_temp449_57, __HIVE_P2_temp449_58, __HIVE_P2_get(this, "pos", 525), 523)), 521));
        (__HIVE_P2_temp449_60 = this, __HIVE_P2_temp449_61 = "startLoc", __HIVE_P2_set(__HIVE_P2_temp449_60, __HIVE_P2_temp449_61, (__HIVE_P2_temp449_63 = this, __HIVE_P2_temp449_64 = "endLoc", __HIVE_P2_set(__HIVE_P2_temp449_63, __HIVE_P2_temp449_64, (__HIVE_P2_temp449_66 = this, __HIVE_P2_temp449_67 = __HIVE_P2_get(__HIVE_P2_temp449_66, "curPosition", 530), __HIVE_P2_invoke(__HIVE_P2_temp449_67, __HIVE_P2_temp449_66, (__HIVE_P2_reserveArray(0, 530), __HIVE_P2_ownArray([], 530, "CONTROL_ARRAY")), 530)), 528)), 526));
        (__HIVE_P2_temp449_68 = this, __HIVE_P2_temp449_69 = "lastTokEndLoc", __HIVE_P2_set(__HIVE_P2_temp449_68, __HIVE_P2_temp449_69, (__HIVE_P2_temp449_71 = this, __HIVE_P2_temp449_72 = "lastTokStartLoc", __HIVE_P2_set(__HIVE_P2_temp449_71, __HIVE_P2_temp449_72, null, 534)), 532));
        (__HIVE_P2_temp449_74 = this, __HIVE_P2_temp449_75 = "lastTokStart", __HIVE_P2_set(__HIVE_P2_temp449_74, __HIVE_P2_temp449_75, (__HIVE_P2_temp449_77 = this, __HIVE_P2_temp449_78 = "lastTokEnd", __HIVE_P2_set(__HIVE_P2_temp449_77, __HIVE_P2_temp449_78, __HIVE_P2_get(this, "pos", 540), 538)), 536));
        (__HIVE_P2_temp449_80 = this, __HIVE_P2_temp449_81 = "context", __HIVE_P2_set(__HIVE_P2_temp449_80, __HIVE_P2_temp449_81, (__HIVE_P2_temp449_83 = this, __HIVE_P2_temp449_84 = __HIVE_P2_get(__HIVE_P2_temp449_83, "initialContext", 543), __HIVE_P2_invoke(__HIVE_P2_temp449_84, __HIVE_P2_temp449_83, (__HIVE_P2_reserveArray(0, 543), __HIVE_P2_ownArray([], 543, "CONTROL_ARRAY")), 543)), 541));
        (__HIVE_P2_temp449_85 = this, __HIVE_P2_temp449_86 = "exprAllowed", __HIVE_P2_set(__HIVE_P2_temp449_85, __HIVE_P2_temp449_86, true, 545));
        (__HIVE_P2_temp449_88 = this, __HIVE_P2_temp449_89 = "inModule", __HIVE_P2_set(__HIVE_P2_temp449_88, __HIVE_P2_temp449_89, __HIVE_P2_get(e, "sourceType", 549) === "module", 547));
        (__HIVE_P2_temp449_91 = this, __HIVE_P2_temp449_92 = "strict", __HIVE_P2_set(__HIVE_P2_temp449_91, __HIVE_P2_temp449_92, __HIVE_P2_get(this, "inModule", 552) || (__HIVE_P2_temp449_94 = this, __HIVE_P2_temp449_95 = __HIVE_P2_get(__HIVE_P2_temp449_94, "strictDirective", 553), __HIVE_P2_invoke(__HIVE_P2_temp449_95, __HIVE_P2_temp449_94, (__HIVE_P2_reserveArray(1, 553), __HIVE_P2_ownArray([__HIVE_P2_get(this, "pos", 554)], 553, "CONTROL_ARRAY")), 553)), 550));
        (__HIVE_P2_temp449_96 = this, __HIVE_P2_temp449_97 = "potentialArrowAt", __HIVE_P2_set(__HIVE_P2_temp449_96, __HIVE_P2_temp449_97, __HIVE_P2_unary("-", 1, 558), 556));
        (__HIVE_P2_temp449_99 = this, __HIVE_P2_temp449_100 = "potentialArrowInForAwait", __HIVE_P2_set(__HIVE_P2_temp449_99, __HIVE_P2_temp449_100, false, 559));
        (__HIVE_P2_temp449_102 = this, __HIVE_P2_temp449_103 = "yieldPos", __HIVE_P2_set(__HIVE_P2_temp449_102, __HIVE_P2_temp449_103, (__HIVE_P2_temp449_105 = this, __HIVE_P2_temp449_106 = "awaitPos", __HIVE_P2_set(__HIVE_P2_temp449_105, __HIVE_P2_temp449_106, (__HIVE_P2_temp449_108 = this, __HIVE_P2_temp449_109 = "awaitIdentPos", __HIVE_P2_set(__HIVE_P2_temp449_108, __HIVE_P2_temp449_109, 0, 565)), 563)), 561));
        (__HIVE_P2_temp449_111 = this, __HIVE_P2_temp449_112 = "labels", __HIVE_P2_set(__HIVE_P2_temp449_111, __HIVE_P2_temp449_112, (__HIVE_P2_temp449_114 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp449_114, 569), __HIVE_P2_reserveArray(0, 569, 0), __HIVE_P2_ownArray([], 569, "ARRAY", __HIVE_P2_temp449_114)), 567));
        (__HIVE_P2_temp449_115 = this, __HIVE_P2_temp449_116 = "undefinedExports", __HIVE_P2_set(__HIVE_P2_temp449_115, __HIVE_P2_temp449_116, (__HIVE_P2_temp449_118 = __HIVE_P2_Object, __HIVE_P2_temp449_119 = __HIVE_P2_get(__HIVE_P2_temp449_118, "create", 572), __HIVE_P2_invoke(__HIVE_P2_temp449_119, __HIVE_P2_temp449_118, (__HIVE_P2_reserveArray(1, 572), __HIVE_P2_ownArray([null], 572, "CONTROL_ARRAY")), 572)), 570));
        if (__HIVE_P2_get(this, "pos", 574) === 0 && __HIVE_P2_get(e, "allowHashBang", 575) && (__HIVE_P2_temp449_120 = __HIVE_P2_get(this, "input", 578), __HIVE_P2_temp449_121 = __HIVE_P2_get(__HIVE_P2_temp449_120, "slice", 576), __HIVE_P2_invoke(__HIVE_P2_temp449_121, __HIVE_P2_temp449_120, (__HIVE_P2_reserveArray(2, 576), __HIVE_P2_ownArray([0, 2], 576, "CONTROL_ARRAY")), 576)) === "#!") {
            (__HIVE_P2_temp449_122 = this, __HIVE_P2_temp449_123 = __HIVE_P2_get(__HIVE_P2_temp449_122, "skipLineComment", 579), __HIVE_P2_invoke(__HIVE_P2_temp449_123, __HIVE_P2_temp449_122, (__HIVE_P2_reserveArray(1, 579), __HIVE_P2_ownArray([2], 579, "CONTROL_ARRAY")), 579));
        }
        (__HIVE_P2_temp449_124 = this, __HIVE_P2_temp449_125 = "scopeStack", __HIVE_P2_set(__HIVE_P2_temp449_124, __HIVE_P2_temp449_125, (__HIVE_P2_temp449_127 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp449_127, 583), __HIVE_P2_reserveArray(0, 583, 0), __HIVE_P2_ownArray([], 583, "ARRAY", __HIVE_P2_temp449_127)), 581));
        (__HIVE_P2_temp449_128 = this, __HIVE_P2_temp449_129 = __HIVE_P2_get(__HIVE_P2_temp449_128, "enterScope", 584), __HIVE_P2_invoke(__HIVE_P2_temp449_129, __HIVE_P2_temp449_128, (__HIVE_P2_reserveArray(1, 584), __HIVE_P2_ownArray([T], 584, "CONTROL_ARRAY")), 584));
        (__HIVE_P2_temp449_130 = this, __HIVE_P2_temp449_131 = "regexpState", __HIVE_P2_set(__HIVE_P2_temp449_130, __HIVE_P2_temp449_131, null, 586));
        (__HIVE_P2_temp449_133 = this, __HIVE_P2_temp449_134 = "privateNameStack", __HIVE_P2_set(__HIVE_P2_temp449_133, __HIVE_P2_temp449_134, (__HIVE_P2_temp449_136 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp449_136, 590), __HIVE_P2_reserveArray(0, 590, 0), __HIVE_P2_ownArray([], 590, "ARRAY", __HIVE_P2_temp449_136)), 588));
    }, 139, 3, 0, 449));
    var Q = (__HIVE_P2_reserveObject(9, 591), __HIVE_P2_ownObject({ inFunction: (__HIVE_P2_reserveObject(1, 592), __HIVE_P2_ownObject({ configurable: true }, 592, 1, 12)), inGenerator: (__HIVE_P2_reserveObject(1, 593), __HIVE_P2_ownObject({ configurable: true }, 593, 1, 12)), inAsync: (__HIVE_P2_reserveObject(1, 594), __HIVE_P2_ownObject({ configurable: true }, 594, 1, 12)), canAwait: (__HIVE_P2_reserveObject(1, 595), __HIVE_P2_ownObject({ configurable: true }, 595, 1, 12)), allowSuper: (__HIVE_P2_reserveObject(1, 596), __HIVE_P2_ownObject({ configurable: true }, 596, 1, 12)), allowDirectSuper: (__HIVE_P2_reserveObject(1, 597), __HIVE_P2_ownObject({ configurable: true }, 597, 1, 12)), treatFunctionsAsVar: (__HIVE_P2_reserveObject(1, 598), __HIVE_P2_ownObject({ configurable: true }, 598, 1, 12)), allowNewDotTarget: (__HIVE_P2_reserveObject(1, 599), __HIVE_P2_ownObject({ configurable: true }, 599, 1, 12)), inClassStaticBlock: (__HIVE_P2_reserveObject(1, 600), __HIVE_P2_ownObject({ configurable: true }, 600, 1, 12)) }, 591, 9, 116));
    (__HIVE_P2_temp0_923 = __HIVE_P2_get(K, "prototype", 603), __HIVE_P2_temp0_924 = "parse", __HIVE_P2_set(__HIVE_P2_temp0_923, __HIVE_P2_temp0_924, (__HIVE_P2_reserveFunction(604), __HIVE_P2_registerFunction(function parse() {
        var __HIVE_P2_temp604_0, __HIVE_P2_temp604_1, __HIVE_P2_temp604_2, __HIVE_P2_temp604_3, __HIVE_P2_temp604_4, __HIVE_P2_temp604_5;
        var e = __HIVE_P2_get(__HIVE_P2_get(this, "options", 606), "program", 605) || (__HIVE_P2_temp604_0 = this, __HIVE_P2_temp604_1 = __HIVE_P2_get(__HIVE_P2_temp604_0, "startNode", 607), __HIVE_P2_invoke(__HIVE_P2_temp604_1, __HIVE_P2_temp604_0, (__HIVE_P2_reserveArray(0, 607), __HIVE_P2_ownArray([], 607, "CONTROL_ARRAY")), 607));
        (__HIVE_P2_temp604_2 = this, __HIVE_P2_temp604_3 = __HIVE_P2_get(__HIVE_P2_temp604_2, "nextToken", 609), __HIVE_P2_invoke(__HIVE_P2_temp604_3, __HIVE_P2_temp604_2, (__HIVE_P2_reserveArray(0, 609), __HIVE_P2_ownArray([], 609, "CONTROL_ARRAY")), 609));
        return (__HIVE_P2_temp604_4 = this, __HIVE_P2_temp604_5 = __HIVE_P2_get(__HIVE_P2_temp604_4, "parseTopLevel", 611), __HIVE_P2_invoke(__HIVE_P2_temp604_5, __HIVE_P2_temp604_4, (__HIVE_P2_reserveArray(1, 611), __HIVE_P2_ownArray([e], 611, "CONTROL_ARRAY")), 611));
    }, 7, 0, 0, 604)), 601));
    (__HIVE_P2_temp0_926 = __HIVE_P2_get(Q, "inFunction", 615), __HIVE_P2_temp0_927 = "get", __HIVE_P2_set(__HIVE_P2_temp0_926, __HIVE_P2_temp0_927, (__HIVE_P2_reserveFunction(616), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp616_0, __HIVE_P2_temp616_1;
        return __HIVE_P2_binary(">", (__HIVE_P2_binary("&", __HIVE_P2_get((__HIVE_P2_temp616_0 = this, __HIVE_P2_temp616_1 = __HIVE_P2_get(__HIVE_P2_temp616_0, "currentVarScope", 620), __HIVE_P2_invoke(__HIVE_P2_temp616_1, __HIVE_P2_temp616_0, (__HIVE_P2_reserveArray(0, 620), __HIVE_P2_ownArray([], 620, "CONTROL_ARRAY")), 620)), "flags", 619), V, 618)), 0, 617);
    }, 2, 0, 0, 616)), 613));
    (__HIVE_P2_temp0_929 = __HIVE_P2_get(Q, "inGenerator", 624), __HIVE_P2_temp0_930 = "get", __HIVE_P2_set(__HIVE_P2_temp0_929, __HIVE_P2_temp0_930, (__HIVE_P2_reserveFunction(625), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp625_0, __HIVE_P2_temp625_1, __HIVE_P2_temp625_2, __HIVE_P2_temp625_3;
        return __HIVE_P2_binary(">", (__HIVE_P2_binary("&", __HIVE_P2_get((__HIVE_P2_temp625_0 = this, __HIVE_P2_temp625_1 = __HIVE_P2_get(__HIVE_P2_temp625_0, "currentVarScope", 629), __HIVE_P2_invoke(__HIVE_P2_temp625_1, __HIVE_P2_temp625_0, (__HIVE_P2_reserveArray(0, 629), __HIVE_P2_ownArray([], 629, "CONTROL_ARRAY")), 629)), "flags", 628), R, 627)), 0, 626) && !__HIVE_P2_get((__HIVE_P2_temp625_2 = this, __HIVE_P2_temp625_3 = __HIVE_P2_get(__HIVE_P2_temp625_2, "currentVarScope", 632), __HIVE_P2_invoke(__HIVE_P2_temp625_3, __HIVE_P2_temp625_2, (__HIVE_P2_reserveArray(0, 632), __HIVE_P2_ownArray([], 632, "CONTROL_ARRAY")), 632)), "inClassFieldInit", 631);
    }, 4, 0, 0, 625)), 622));
    (__HIVE_P2_temp0_932 = __HIVE_P2_get(Q, "inAsync", 636), __HIVE_P2_temp0_933 = "get", __HIVE_P2_set(__HIVE_P2_temp0_932, __HIVE_P2_temp0_933, (__HIVE_P2_reserveFunction(637), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp637_0, __HIVE_P2_temp637_1, __HIVE_P2_temp637_2, __HIVE_P2_temp637_3;
        return __HIVE_P2_binary(">", (__HIVE_P2_binary("&", __HIVE_P2_get((__HIVE_P2_temp637_0 = this, __HIVE_P2_temp637_1 = __HIVE_P2_get(__HIVE_P2_temp637_0, "currentVarScope", 641), __HIVE_P2_invoke(__HIVE_P2_temp637_1, __HIVE_P2_temp637_0, (__HIVE_P2_reserveArray(0, 641), __HIVE_P2_ownArray([], 641, "CONTROL_ARRAY")), 641)), "flags", 640), L, 639)), 0, 638) && !__HIVE_P2_get((__HIVE_P2_temp637_2 = this, __HIVE_P2_temp637_3 = __HIVE_P2_get(__HIVE_P2_temp637_2, "currentVarScope", 644), __HIVE_P2_invoke(__HIVE_P2_temp637_3, __HIVE_P2_temp637_2, (__HIVE_P2_reserveArray(0, 644), __HIVE_P2_ownArray([], 644, "CONTROL_ARRAY")), 644)), "inClassFieldInit", 643);
    }, 4, 0, 0, 637)), 634));
    (__HIVE_P2_temp0_935 = __HIVE_P2_get(Q, "canAwait", 648), __HIVE_P2_temp0_936 = "get", __HIVE_P2_set(__HIVE_P2_temp0_935, __HIVE_P2_temp0_936, (__HIVE_P2_reserveFunction(649), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp649_0, __HIVE_P2_temp649_1;
        for (var e = __HIVE_P2_binary("-", __HIVE_P2_get(__HIVE_P2_get(this, "scopeStack", 653), "length", 652), 1, 651); __HIVE_P2_binary(">=", e, 0, 654); (__HIVE_P2_temp649_0 = __HIVE_P2_numeric(e, 655), __HIVE_P2_temp649_1 = __HIVE_P2_temp649_0 + -1, e = __HIVE_P2_temp649_1, __HIVE_P2_temp649_0)) {
            __HIVE_P2_tick(650);
            var t = __HIVE_P2_get(__HIVE_P2_get(this, "scopeStack", 657), e, 656);
            if (__HIVE_P2_get(t, "inClassFieldInit", 658) || __HIVE_P2_binary("&", __HIVE_P2_get(t, "flags", 660), F, 659)) {
                return false;
            }
            if (__HIVE_P2_binary("&", __HIVE_P2_get(t, "flags", 662), V, 661)) {
                return __HIVE_P2_binary(">", (__HIVE_P2_binary("&", __HIVE_P2_get(t, "flags", 665), L, 664)), 0, 663);
            }
        }
        return __HIVE_P2_get(this, "inModule", 666) && __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 669), "ecmaVersion", 668), 13, 667) || __HIVE_P2_get(__HIVE_P2_get(this, "options", 671), "allowAwaitOutsideFunction", 670);
    }, 4, 0, 0, 649)), 646));
    (__HIVE_P2_temp0_938 = __HIVE_P2_get(Q, "allowSuper", 674), __HIVE_P2_temp0_939 = "get", __HIVE_P2_set(__HIVE_P2_temp0_938, __HIVE_P2_temp0_939, (__HIVE_P2_reserveFunction(675), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp675_0, __HIVE_P2_temp675_1;
        var e = (__HIVE_P2_temp675_0 = this, __HIVE_P2_temp675_1 = __HIVE_P2_get(__HIVE_P2_temp675_0, "currentThisScope", 676), __HIVE_P2_invoke(__HIVE_P2_temp675_1, __HIVE_P2_temp675_0, (__HIVE_P2_reserveArray(0, 676), __HIVE_P2_ownArray([], 676, "CONTROL_ARRAY")), 676));
        var t = __HIVE_P2_get(e, "flags", 678);
        var i = __HIVE_P2_get(e, "inClassFieldInit", 679);
        return __HIVE_P2_binary(">", (__HIVE_P2_binary("&", t, B, 681)), 0, 680) || i || __HIVE_P2_get(__HIVE_P2_get(this, "options", 683), "allowSuperOutsideMethod", 682);
    }, 5, 0, 0, 675)), 672));
    (__HIVE_P2_temp0_941 = __HIVE_P2_get(Q, "allowDirectSuper", 686), __HIVE_P2_temp0_942 = "get", __HIVE_P2_set(__HIVE_P2_temp0_941, __HIVE_P2_temp0_942, (__HIVE_P2_reserveFunction(687), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp687_0, __HIVE_P2_temp687_1;
        return __HIVE_P2_binary(">", (__HIVE_P2_binary("&", __HIVE_P2_get((__HIVE_P2_temp687_0 = this, __HIVE_P2_temp687_1 = __HIVE_P2_get(__HIVE_P2_temp687_0, "currentThisScope", 691), __HIVE_P2_invoke(__HIVE_P2_temp687_1, __HIVE_P2_temp687_0, (__HIVE_P2_reserveArray(0, 691), __HIVE_P2_ownArray([], 691, "CONTROL_ARRAY")), 691)), "flags", 690), M, 689)), 0, 688);
    }, 2, 0, 0, 687)), 684));
    (__HIVE_P2_temp0_944 = __HIVE_P2_get(Q, "treatFunctionsAsVar", 695), __HIVE_P2_temp0_945 = "get", __HIVE_P2_set(__HIVE_P2_temp0_944, __HIVE_P2_temp0_945, (__HIVE_P2_reserveFunction(696), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp696_0, __HIVE_P2_temp696_1, __HIVE_P2_temp696_2, __HIVE_P2_temp696_3;
        return (__HIVE_P2_temp696_2 = this, __HIVE_P2_temp696_3 = __HIVE_P2_get(__HIVE_P2_temp696_2, "treatFunctionsAsVarInScope", 697), __HIVE_P2_invoke(__HIVE_P2_temp696_3, __HIVE_P2_temp696_2, (__HIVE_P2_reserveArray(1, 697), __HIVE_P2_ownArray([(__HIVE_P2_temp696_0 = this, __HIVE_P2_temp696_1 = __HIVE_P2_get(__HIVE_P2_temp696_0, "currentScope", 698), __HIVE_P2_invoke(__HIVE_P2_temp696_1, __HIVE_P2_temp696_0, (__HIVE_P2_reserveArray(0, 698), __HIVE_P2_ownArray([], 698, "CONTROL_ARRAY")), 698))], 697, "CONTROL_ARRAY")), 697));
    }, 4, 0, 0, 696)), 693));
    (__HIVE_P2_temp0_947 = __HIVE_P2_get(Q, "allowNewDotTarget", 703), __HIVE_P2_temp0_948 = "get", __HIVE_P2_set(__HIVE_P2_temp0_947, __HIVE_P2_temp0_948, (__HIVE_P2_reserveFunction(704), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp704_0, __HIVE_P2_temp704_1;
        var e = (__HIVE_P2_temp704_0 = this, __HIVE_P2_temp704_1 = __HIVE_P2_get(__HIVE_P2_temp704_0, "currentThisScope", 705), __HIVE_P2_invoke(__HIVE_P2_temp704_1, __HIVE_P2_temp704_0, (__HIVE_P2_reserveArray(0, 705), __HIVE_P2_ownArray([], 705, "CONTROL_ARRAY")), 705));
        var t = __HIVE_P2_get(e, "flags", 707);
        var i = __HIVE_P2_get(e, "inClassFieldInit", 708);
        return __HIVE_P2_binary(">", (__HIVE_P2_binary("&", t, (__HIVE_P2_binary("|", V, F, 711)), 710)), 0, 709) || i;
    }, 5, 0, 0, 704)), 701));
    (__HIVE_P2_temp0_950 = __HIVE_P2_get(Q, "inClassStaticBlock", 714), __HIVE_P2_temp0_951 = "get", __HIVE_P2_set(__HIVE_P2_temp0_950, __HIVE_P2_temp0_951, (__HIVE_P2_reserveFunction(715), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp715_0, __HIVE_P2_temp715_1;
        return __HIVE_P2_binary(">", (__HIVE_P2_binary("&", __HIVE_P2_get((__HIVE_P2_temp715_0 = this, __HIVE_P2_temp715_1 = __HIVE_P2_get(__HIVE_P2_temp715_0, "currentVarScope", 719), __HIVE_P2_invoke(__HIVE_P2_temp715_1, __HIVE_P2_temp715_0, (__HIVE_P2_reserveArray(0, 719), __HIVE_P2_ownArray([], 719, "CONTROL_ARRAY")), 719)), "flags", 718), F, 717)), 0, 716);
    }, 2, 0, 0, 715)), 712));
    (__HIVE_P2_temp0_953 = __HIVE_P2_Object, __HIVE_P2_temp0_954 = __HIVE_P2_get(__HIVE_P2_temp0_953, "defineProperties", 725), __HIVE_P2_invoke(__HIVE_P2_temp0_954, __HIVE_P2_temp0_953, (__HIVE_P2_reserveArray(2, 725), __HIVE_P2_ownArray([__HIVE_P2_get(K, "prototype", 726), Q], 725, "CONTROL_ARRAY")), 725));
    var Y = __HIVE_P2_get(K, "prototype", 728);
    var X = __HIVE_P2_toolRegex("/^(?:'((?:\\\\[^]|[^'\\\\])*?)'|\"((?:\\\\[^]|[^\"\\\\])*?)\")/", 729);
    __HIVE_P2_set(Y, "strictDirective", (__HIVE_P2_reserveFunction(731), __HIVE_P2_registerFunction(function (start) {
        var __HIVE_P2_temp731_0, __HIVE_P2_temp731_1, __HIVE_P2_temp731_2, __HIVE_P2_temp731_3, __HIVE_P2_temp731_4, __HIVE_P2_temp731_5, __HIVE_P2_temp731_6, __HIVE_P2_temp731_7;
        var i = start, previousEnd = start, text = __HIVE_P2_get(this, "input", 732);
        for (;;) {
            __HIVE_P2_tick(733);
            __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 734), __HIVE_P2_ownArray([], 734, "CONTROL_ARRAY")), 734);
            var trivia = __HIVE_P2_invoke(__scalarTrivia, void 0, (__HIVE_P2_reserveArray(5, 735), __HIVE_P2_ownArray([text, i, __HIVE_P2_get(this, "inModule", 736), previousEnd, __HIVE_P2_get(__HIVE_P2_get(this, "options", 738), "allowHashBang", 737)], 735, "CONTROL_ARRAY")), 735);
            i = __HIVE_P2_binary("/", (__HIVE_P2_binary("-", trivia, __HIVE_P2_binary("%", trivia, 2, 742), 741)), 2, 740);
            var quote = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 743), __HIVE_P2_ownArray([text, i], 743, "CONTROL_ARRAY")), 743);
            if (quote !== 34 && quote !== 39)
                return false;
            var p = __HIVE_P2_binary("+", i, 1, 744), raw = true, length = 0, closed = false;
            while (__HIVE_P2_binary("<", p, __HIVE_P2_get(text, "length", 747), 746)) {
                __HIVE_P2_tick(745);
                __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 748), __HIVE_P2_ownArray([], 748, "CONTROL_ARRAY")), 748);
                var c = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 749), __HIVE_P2_ownArray([text, (__HIVE_P2_temp731_0 = __HIVE_P2_numeric(p, 750), __HIVE_P2_temp731_1 = __HIVE_P2_temp731_0 + 1, p = __HIVE_P2_temp731_1, __HIVE_P2_temp731_0)], 749, "CONTROL_ARRAY")), 749);
                if (c === quote) {
                    closed = true;
                    break;
                }
                if (c === 10 || c === 13)
                    __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 752), __HIVE_P2_ownArray(["SYNTAX_REFUSED"], 752, "CONTROL_ARRAY")), 752);
                if (c === 92) {
                    raw = false;
                    var escaped = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 754), __HIVE_P2_ownArray([text, (__HIVE_P2_temp731_2 = __HIVE_P2_numeric(p, 755), __HIVE_P2_temp731_3 = __HIVE_P2_temp731_2 + 1, p = __HIVE_P2_temp731_3, __HIVE_P2_temp731_2)], 754, "CONTROL_ARRAY")), 754);
                    if (escaped !== escaped)
                        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 756), __HIVE_P2_ownArray(["SYNTAX_REFUSED"], 756, "CONTROL_ARRAY")), 756);
                    if (escaped === 13 && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 757), __HIVE_P2_ownArray([text, p], 757, "CONTROL_ARRAY")), 757) === 10)
                        (__HIVE_P2_temp731_4 = __HIVE_P2_numeric(p, 758), __HIVE_P2_temp731_5 = __HIVE_P2_temp731_4 + 1, p = __HIVE_P2_temp731_5, __HIVE_P2_temp731_4);
                }
                else if (__HIVE_P2_binary(">=", length, 10, 759) || c !== __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 760), __HIVE_P2_ownArray(["use strict", length], 760, "CONTROL_ARRAY")), 760))
                    raw = false;
                (__HIVE_P2_temp731_6 = __HIVE_P2_numeric(length, 762), __HIVE_P2_temp731_7 = __HIVE_P2_temp731_6 + 1, length = __HIVE_P2_temp731_7, __HIVE_P2_temp731_6);
            }
            if (!closed)
                __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 763), __HIVE_P2_ownArray(["SYNTAX_REFUSED"], 763, "CONTROL_ARRAY")), 763);
            var gap = __HIVE_P2_invoke(__scalarTrivia, void 0, (__HIVE_P2_reserveArray(5, 764), __HIVE_P2_ownArray([text, p, __HIVE_P2_get(this, "inModule", 765), p, __HIVE_P2_get(__HIVE_P2_get(this, "options", 767), "allowHashBang", 766)], 764, "CONTROL_ARRAY")), 764);
            var end = __HIVE_P2_binary("/", (__HIVE_P2_binary("-", gap, __HIVE_P2_binary("%", gap, 2, 770), 769)), 2, 768), hasLine = __HIVE_P2_binary("%", gap, 2, 771) === 1, next = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 772), __HIVE_P2_ownArray([text, end], 772, "CONTROL_ARRAY")), 772);
            var continued = next === 40 || next === 91 || next === 46 || next === 96 || next === 42 || next === 47 || next === 37 || next === 60 || next === 62 || next === 61 || next === 38 || next === 124 || next === 94 || next === 63 || next === 44;
            if (next === 43 || next === 45) {
                continued = !(hasLine && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 774), __HIVE_P2_ownArray([text, __HIVE_P2_binary("+", end, 1, 775)], 774, "CONTROL_ARRAY")), 774) === next);
            }
            if (next === 33 && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 776), __HIVE_P2_ownArray([text, __HIVE_P2_binary("+", end, 1, 777)], 776, "CONTROL_ARRAY")), 776) === 61)
                continued = true;
            if (__HIVE_P2_invoke(__scalarStart, void 0, (__HIVE_P2_reserveArray(1, 779), __HIVE_P2_ownArray([next], 779, "CONTROL_ARRAY")), 779) || next === 92 || __HIVE_P2_binary(">=", next, 128, 780)) {
                var word = __HIVE_P2_invoke(__scalarPeekWord, void 0, (__HIVE_P2_reserveArray(2, 781), __HIVE_P2_ownArray([text, end], 781, "CONTROL_ARRAY")), 781);
                if (__HIVE_P2_get(word, "value", 782) === "in" || __HIVE_P2_get(word, "value", 783) === "instanceof")
                    continued = true;
            }
            if (continued)
                return false;
            if (!(next === 59 || next === 125 || end === __HIVE_P2_get(text, "length", 785) || hasLine))
                return false;
            if (raw && length === 10)
                return true;
            if (next === 59) {
                i = __HIVE_P2_binary("+", end, 1, 787);
                previousEnd = i;
            }
            else if (next === 125 || end === __HIVE_P2_get(text, "length", 789))
                return false;
            else {
                i = end;
                previousEnd = p;
            }
        }
    }, 25, 1, 0, 731)), 792);
    (__HIVE_P2_temp0_955 = Y, __HIVE_P2_temp0_956 = "eat", __HIVE_P2_set(__HIVE_P2_temp0_955, __HIVE_P2_temp0_956, (__HIVE_P2_reserveFunction(796), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp796_0, __HIVE_P2_temp796_1;
        if (__HIVE_P2_get(this, "type", 797) === e) {
            (__HIVE_P2_temp796_0 = this, __HIVE_P2_temp796_1 = __HIVE_P2_get(__HIVE_P2_temp796_0, "next", 798), __HIVE_P2_invoke(__HIVE_P2_temp796_1, __HIVE_P2_temp796_0, (__HIVE_P2_reserveArray(0, 798), __HIVE_P2_ownArray([], 798, "CONTROL_ARRAY")), 798));
            return true;
        }
        else {
            return false;
        }
    }, 2, 1, 0, 796)), 794));
    (__HIVE_P2_temp0_958 = Y, __HIVE_P2_temp0_959 = "isContextual", __HIVE_P2_set(__HIVE_P2_temp0_958, __HIVE_P2_temp0_959, (__HIVE_P2_reserveFunction(802), __HIVE_P2_registerFunction(function (e) {
        return __HIVE_P2_get(this, "type", 803) === __HIVE_P2_get(m, "name", 804) && __HIVE_P2_get(this, "value", 805) === e && !__HIVE_P2_get(this, "containsEsc", 806);
    }, 0, 1, 0, 802)), 800));
    (__HIVE_P2_temp0_961 = Y, __HIVE_P2_temp0_962 = "eatContextual", __HIVE_P2_set(__HIVE_P2_temp0_961, __HIVE_P2_temp0_962, (__HIVE_P2_reserveFunction(809), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp809_0, __HIVE_P2_temp809_1, __HIVE_P2_temp809_2, __HIVE_P2_temp809_3;
        if (!(__HIVE_P2_temp809_0 = this, __HIVE_P2_temp809_1 = __HIVE_P2_get(__HIVE_P2_temp809_0, "isContextual", 810), __HIVE_P2_invoke(__HIVE_P2_temp809_1, __HIVE_P2_temp809_0, (__HIVE_P2_reserveArray(1, 810), __HIVE_P2_ownArray([e], 810, "CONTROL_ARRAY")), 810))) {
            return false;
        }
        (__HIVE_P2_temp809_2 = this, __HIVE_P2_temp809_3 = __HIVE_P2_get(__HIVE_P2_temp809_2, "next", 812), __HIVE_P2_invoke(__HIVE_P2_temp809_3, __HIVE_P2_temp809_2, (__HIVE_P2_reserveArray(0, 812), __HIVE_P2_ownArray([], 812, "CONTROL_ARRAY")), 812));
        return true;
    }, 4, 1, 0, 809)), 807));
    (__HIVE_P2_temp0_964 = Y, __HIVE_P2_temp0_965 = "expectContextual", __HIVE_P2_set(__HIVE_P2_temp0_964, __HIVE_P2_temp0_965, (__HIVE_P2_reserveFunction(816), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp816_0, __HIVE_P2_temp816_1;
        if (!(__HIVE_P2_temp816_0 = this, __HIVE_P2_temp816_1 = __HIVE_P2_get(__HIVE_P2_temp816_0, "eatContextual", 817), __HIVE_P2_invoke(__HIVE_P2_temp816_1, __HIVE_P2_temp816_0, (__HIVE_P2_reserveArray(1, 817), __HIVE_P2_ownArray([e], 817, "CONTROL_ARRAY")), 817))) {
            __HIVE_P2_syntaxRefusal(819);
        }
    }, 2, 1, 0, 816)), 814));
    __HIVE_P2_set(Y, "canInsertSemicolon", (__HIVE_P2_reserveFunction(821), __HIVE_P2_registerFunction(function () {
        return __HIVE_P2_get(this, "type", 822) === __HIVE_P2_get(m, "eof", 823) || __HIVE_P2_get(this, "type", 824) === __HIVE_P2_get(m, "braceR", 825) || __HIVE_P2_invoke(__scalarGapLine, void 0, (__HIVE_P2_reserveArray(3, 826), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 827), __HIVE_P2_get(this, "lastTokEnd", 828), __HIVE_P2_get(this, "start", 829)], 826, "CONTROL_ARRAY")), 826);
    }, 0, 0, 0, 821)), 830);
    (__HIVE_P2_temp0_967 = Y, __HIVE_P2_temp0_968 = "insertSemicolon", __HIVE_P2_set(__HIVE_P2_temp0_967, __HIVE_P2_temp0_968, (__HIVE_P2_reserveFunction(834), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp834_0, __HIVE_P2_temp834_1, __HIVE_P2_temp834_2, __HIVE_P2_temp834_3;
        if ((__HIVE_P2_temp834_0 = this, __HIVE_P2_temp834_1 = __HIVE_P2_get(__HIVE_P2_temp834_0, "canInsertSemicolon", 835), __HIVE_P2_invoke(__HIVE_P2_temp834_1, __HIVE_P2_temp834_0, (__HIVE_P2_reserveArray(0, 835), __HIVE_P2_ownArray([], 835, "CONTROL_ARRAY")), 835))) {
            if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 838), "onInsertedSemicolon", 837)) {
                (__HIVE_P2_temp834_2 = __HIVE_P2_get(this, "options", 843), __HIVE_P2_temp834_3 = __HIVE_P2_get(__HIVE_P2_temp834_2, "onInsertedSemicolon", 839), __HIVE_P2_invoke(__HIVE_P2_temp834_3, __HIVE_P2_temp834_2, (__HIVE_P2_reserveArray(2, 839), __HIVE_P2_ownArray([__HIVE_P2_get(this, "lastTokEnd", 840), __HIVE_P2_get(this, "lastTokEndLoc", 841)], 839, "CONTROL_ARRAY")), 839));
            }
            return true;
        }
    }, 4, 0, 0, 834)), 832));
    (__HIVE_P2_temp0_970 = Y, __HIVE_P2_temp0_971 = "semicolon", __HIVE_P2_set(__HIVE_P2_temp0_970, __HIVE_P2_temp0_971, (__HIVE_P2_reserveFunction(846), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp846_0, __HIVE_P2_temp846_1, __HIVE_P2_temp846_2, __HIVE_P2_temp846_3;
        if (!(__HIVE_P2_temp846_0 = this, __HIVE_P2_temp846_1 = __HIVE_P2_get(__HIVE_P2_temp846_0, "eat", 847), __HIVE_P2_invoke(__HIVE_P2_temp846_1, __HIVE_P2_temp846_0, (__HIVE_P2_reserveArray(1, 847), __HIVE_P2_ownArray([__HIVE_P2_get(m, "semi", 848)], 847, "CONTROL_ARRAY")), 847)) && !(__HIVE_P2_temp846_2 = this, __HIVE_P2_temp846_3 = __HIVE_P2_get(__HIVE_P2_temp846_2, "insertSemicolon", 850), __HIVE_P2_invoke(__HIVE_P2_temp846_3, __HIVE_P2_temp846_2, (__HIVE_P2_reserveArray(0, 850), __HIVE_P2_ownArray([], 850, "CONTROL_ARRAY")), 850))) {
            __HIVE_P2_syntaxRefusal(852);
        }
    }, 4, 0, 0, 846)), 844));
    (__HIVE_P2_temp0_973 = Y, __HIVE_P2_temp0_974 = "afterTrailingComma", __HIVE_P2_set(__HIVE_P2_temp0_973, __HIVE_P2_temp0_974, (__HIVE_P2_reserveFunction(855), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp855_0, __HIVE_P2_temp855_1, __HIVE_P2_temp855_2, __HIVE_P2_temp855_3;
        if (__HIVE_P2_get(this, "type", 856) === e) {
            if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 858), "onTrailingComma", 857)) {
                (__HIVE_P2_temp855_0 = __HIVE_P2_get(this, "options", 863), __HIVE_P2_temp855_1 = __HIVE_P2_get(__HIVE_P2_temp855_0, "onTrailingComma", 859), __HIVE_P2_invoke(__HIVE_P2_temp855_1, __HIVE_P2_temp855_0, (__HIVE_P2_reserveArray(2, 859), __HIVE_P2_ownArray([__HIVE_P2_get(this, "lastTokStart", 860), __HIVE_P2_get(this, "lastTokStartLoc", 861)], 859, "CONTROL_ARRAY")), 859));
            }
            if (!t) {
                (__HIVE_P2_temp855_2 = this, __HIVE_P2_temp855_3 = __HIVE_P2_get(__HIVE_P2_temp855_2, "next", 864), __HIVE_P2_invoke(__HIVE_P2_temp855_3, __HIVE_P2_temp855_2, (__HIVE_P2_reserveArray(0, 864), __HIVE_P2_ownArray([], 864, "CONTROL_ARRAY")), 864));
            }
            return true;
        }
    }, 4, 2, 0, 855)), 853));
    (__HIVE_P2_temp0_976 = Y, __HIVE_P2_temp0_977 = "expect", __HIVE_P2_set(__HIVE_P2_temp0_976, __HIVE_P2_temp0_977, (__HIVE_P2_reserveFunction(868), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp868_0, __HIVE_P2_temp868_1;
        (__HIVE_P2_temp868_0 = this, __HIVE_P2_temp868_1 = __HIVE_P2_get(__HIVE_P2_temp868_0, "eat", 869), __HIVE_P2_invoke(__HIVE_P2_temp868_1, __HIVE_P2_temp868_0, (__HIVE_P2_reserveArray(1, 869), __HIVE_P2_ownArray([e], 869, "CONTROL_ARRAY")), 869)) || __HIVE_P2_syntaxRefusal(871);
    }, 2, 1, 0, 868)), 866));
    __HIVE_P2_set(Y, "unexpected", (__HIVE_P2_reserveFunction(873), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 874), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 874, "CONTROL_ARRAY")), 874);
    }, 0, 0, 0, 873)), 875);
    var Z = (__HIVE_P2_reserveFunction(877), __HIVE_P2_registerFunction(function DestructuringErrors() {
        var __HIVE_P2_temp877_0, __HIVE_P2_temp877_1, __HIVE_P2_temp877_2, __HIVE_P2_temp877_3, __HIVE_P2_temp877_4, __HIVE_P2_temp877_5, __HIVE_P2_temp877_6, __HIVE_P2_temp877_7, __HIVE_P2_temp877_8, __HIVE_P2_temp877_9, __HIVE_P2_temp877_10, __HIVE_P2_temp877_11, __HIVE_P2_temp877_12, __HIVE_P2_temp877_13, __HIVE_P2_temp877_14;
        (__HIVE_P2_temp877_0 = this, __HIVE_P2_temp877_1 = "shorthandAssign", __HIVE_P2_set(__HIVE_P2_temp877_0, __HIVE_P2_temp877_1, (__HIVE_P2_temp877_3 = this, __HIVE_P2_temp877_4 = "trailingComma", __HIVE_P2_set(__HIVE_P2_temp877_3, __HIVE_P2_temp877_4, (__HIVE_P2_temp877_6 = this, __HIVE_P2_temp877_7 = "parenthesizedAssign", __HIVE_P2_set(__HIVE_P2_temp877_6, __HIVE_P2_temp877_7, (__HIVE_P2_temp877_9 = this, __HIVE_P2_temp877_10 = "parenthesizedBind", __HIVE_P2_set(__HIVE_P2_temp877_9, __HIVE_P2_temp877_10, (__HIVE_P2_temp877_12 = this, __HIVE_P2_temp877_13 = "doubleProto", __HIVE_P2_set(__HIVE_P2_temp877_12, __HIVE_P2_temp877_13, __HIVE_P2_unary("-", 1, 888), 886)), 884)), 882)), 880)), 878));
    }, 15, 0, 0, 877));
    (__HIVE_P2_temp0_979 = Y, __HIVE_P2_temp0_980 = "checkPatternErrors", __HIVE_P2_set(__HIVE_P2_temp0_979, __HIVE_P2_temp0_980, (__HIVE_P2_reserveFunction(891), __HIVE_P2_registerFunction(function (e, t) {
        if (!e) {
            return;
        }
        if (__HIVE_P2_binary(">", __HIVE_P2_get(e, "trailingComma", 893), __HIVE_P2_unary("-", 1, 894), 892)) {
            __HIVE_P2_syntaxRefusal(895);
        }
        var i = t ? __HIVE_P2_get(e, "parenthesizedAssign", 896) : __HIVE_P2_get(e, "parenthesizedBind", 897);
        if (__HIVE_P2_binary(">", i, __HIVE_P2_unary("-", 1, 899), 898)) {
            __HIVE_P2_syntaxRefusal(900);
        }
    }, 1, 2, 0, 891)), 889));
    (__HIVE_P2_temp0_982 = Y, __HIVE_P2_temp0_983 = "checkExpressionErrors", __HIVE_P2_set(__HIVE_P2_temp0_982, __HIVE_P2_temp0_983, (__HIVE_P2_reserveFunction(903), __HIVE_P2_registerFunction(function (e, t) {
        if (!e) {
            return false;
        }
        var i = __HIVE_P2_get(e, "shorthandAssign", 904);
        var s = __HIVE_P2_get(e, "doubleProto", 905);
        if (!t) {
            return __HIVE_P2_binary(">=", i, 0, 906) || __HIVE_P2_binary(">=", s, 0, 907);
        }
        if (__HIVE_P2_binary(">=", i, 0, 908)) {
            __HIVE_P2_syntaxRefusal(909);
        }
        if (__HIVE_P2_binary(">=", s, 0, 910)) {
            __HIVE_P2_syntaxRefusal(911);
        }
    }, 2, 2, 0, 903)), 901));
    (__HIVE_P2_temp0_985 = Y, __HIVE_P2_temp0_986 = "checkYieldAwaitInDefaultParams", __HIVE_P2_set(__HIVE_P2_temp0_985, __HIVE_P2_temp0_986, (__HIVE_P2_reserveFunction(914), __HIVE_P2_registerFunction(function () {
        if (__HIVE_P2_get(this, "yieldPos", 915) && (!__HIVE_P2_get(this, "awaitPos", 916) || __HIVE_P2_binary("<", __HIVE_P2_get(this, "yieldPos", 918), __HIVE_P2_get(this, "awaitPos", 919), 917))) {
            __HIVE_P2_syntaxRefusal(920);
        }
        if (__HIVE_P2_get(this, "awaitPos", 921)) {
            __HIVE_P2_syntaxRefusal(922);
        }
    }, 0, 0, 0, 914)), 912));
    (__HIVE_P2_temp0_988 = Y, __HIVE_P2_temp0_989 = "isSimpleAssignTarget", __HIVE_P2_set(__HIVE_P2_temp0_988, __HIVE_P2_temp0_989, (__HIVE_P2_reserveFunction(925), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp925_0, __HIVE_P2_temp925_1;
        if (__HIVE_P2_get(e, "type", 926) === "ParenthesizedExpression") {
            return (__HIVE_P2_temp925_0 = this, __HIVE_P2_temp925_1 = __HIVE_P2_get(__HIVE_P2_temp925_0, "isSimpleAssignTarget", 927), __HIVE_P2_invoke(__HIVE_P2_temp925_1, __HIVE_P2_temp925_0, (__HIVE_P2_reserveArray(1, 927), __HIVE_P2_ownArray([__HIVE_P2_get(e, "expression", 928)], 927, "CONTROL_ARRAY")), 927));
        }
        return __HIVE_P2_get(e, "type", 930) === "Identifier" || __HIVE_P2_get(e, "type", 931) === "MemberExpression";
    }, 2, 1, 0, 925)), 923));
    var $ = __HIVE_P2_get(K, "prototype", 932);
    (__HIVE_P2_temp0_991 = $, __HIVE_P2_temp0_992 = "parseTopLevel", __HIVE_P2_set(__HIVE_P2_temp0_991, __HIVE_P2_temp0_992, (__HIVE_P2_reserveFunction(935), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp935_0, __HIVE_P2_temp935_1, __HIVE_P2_temp935_2, __HIVE_P2_temp935_3, __HIVE_P2_temp935_4, __HIVE_P2_temp935_5, __HIVE_P2_temp935_6, __HIVE_P2_temp935_7, __HIVE_P2_temp935_8, __HIVE_P2_temp935_9, __HIVE_P2_temp935_10, __HIVE_P2_temp935_11, __HIVE_P2_temp935_12, __HIVE_P2_temp935_13, __HIVE_P2_temp935_14, __HIVE_P2_temp935_15, __HIVE_P2_temp935_16, __HIVE_P2_temp935_17, __HIVE_P2_temp935_18, __HIVE_P2_temp935_19, __HIVE_P2_temp935_20;
        var t = (__HIVE_P2_temp935_0 = __HIVE_P2_Object, __HIVE_P2_temp935_1 = __HIVE_P2_get(__HIVE_P2_temp935_0, "create", 936), __HIVE_P2_invoke(__HIVE_P2_temp935_1, __HIVE_P2_temp935_0, (__HIVE_P2_reserveArray(1, 936), __HIVE_P2_ownArray([null], 936, "CONTROL_ARRAY")), 936));
        if (!__HIVE_P2_get(e, "body", 938)) {
            (__HIVE_P2_temp935_2 = e, __HIVE_P2_temp935_3 = "body", __HIVE_P2_set(__HIVE_P2_temp935_2, __HIVE_P2_temp935_3, (__HIVE_P2_temp935_5 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp935_5, 941), __HIVE_P2_reserveArray(0, 941, 0), __HIVE_P2_ownArray([], 941, "ARRAY", __HIVE_P2_temp935_5)), 939));
        }
        while (__HIVE_P2_get(this, "type", 943) !== __HIVE_P2_get(m, "eof", 944)) {
            __HIVE_P2_tick(942);
            var i = (__HIVE_P2_temp935_6 = this, __HIVE_P2_temp935_7 = __HIVE_P2_get(__HIVE_P2_temp935_6, "parseStatement", 945), __HIVE_P2_invoke(__HIVE_P2_temp935_7, __HIVE_P2_temp935_6, (__HIVE_P2_reserveArray(3, 945), __HIVE_P2_ownArray([null, true, t], 945, "CONTROL_ARRAY")), 945));
            (__HIVE_P2_temp935_8 = __HIVE_P2_get(e, "body", 949), __HIVE_P2_temp935_9 = __HIVE_P2_get(__HIVE_P2_temp935_8, "push", 947), __HIVE_P2_invoke(__HIVE_P2_temp935_9, __HIVE_P2_temp935_8, (__HIVE_P2_reserveArray(1, 947), __HIVE_P2_ownArray([i], 947, "CONTROL_ARRAY")), 947));
        }
        if (__HIVE_P2_get(this, "inModule", 950)) {
            for (var s = 0, r = (__HIVE_P2_temp935_10 = __HIVE_P2_Object, __HIVE_P2_temp935_11 = __HIVE_P2_get(__HIVE_P2_temp935_10, "keys", 952), __HIVE_P2_invoke(__HIVE_P2_temp935_11, __HIVE_P2_temp935_10, (__HIVE_P2_reserveArray(1, 952), __HIVE_P2_ownArray([__HIVE_P2_get(this, "undefinedExports", 953)], 952, "CONTROL_ARRAY")), 952)); __HIVE_P2_binary("<", s, __HIVE_P2_get(r, "length", 956), 955); s = __HIVE_P2_binary("+", s, 1, 957)) {
                __HIVE_P2_tick(951);
                var a = __HIVE_P2_get(r, s, 958);
                __HIVE_P2_syntaxRefusal(959);
            }
        }
        (__HIVE_P2_temp935_12 = this, __HIVE_P2_temp935_13 = __HIVE_P2_get(__HIVE_P2_temp935_12, "adaptDirectivePrologue", 960), __HIVE_P2_invoke(__HIVE_P2_temp935_13, __HIVE_P2_temp935_12, (__HIVE_P2_reserveArray(1, 960), __HIVE_P2_ownArray([__HIVE_P2_get(e, "body", 961)], 960, "CONTROL_ARRAY")), 960));
        (__HIVE_P2_temp935_14 = this, __HIVE_P2_temp935_15 = __HIVE_P2_get(__HIVE_P2_temp935_14, "next", 963), __HIVE_P2_invoke(__HIVE_P2_temp935_15, __HIVE_P2_temp935_14, (__HIVE_P2_reserveArray(0, 963), __HIVE_P2_ownArray([], 963, "CONTROL_ARRAY")), 963));
        (__HIVE_P2_temp935_16 = e, __HIVE_P2_temp935_17 = "sourceType", __HIVE_P2_set(__HIVE_P2_temp935_16, __HIVE_P2_temp935_17, __HIVE_P2_get(__HIVE_P2_get(this, "options", 968), "sourceType", 967), 965));
        return (__HIVE_P2_temp935_19 = this, __HIVE_P2_temp935_20 = __HIVE_P2_get(__HIVE_P2_temp935_19, "finishNode", 969), __HIVE_P2_invoke(__HIVE_P2_temp935_20, __HIVE_P2_temp935_19, (__HIVE_P2_reserveArray(2, 969), __HIVE_P2_ownArray([e, "Program"], 969, "CONTROL_ARRAY")), 969));
    }, 26, 1, 0, 935)), 933));
    var J = (__HIVE_P2_reserveObject(1, 971), __HIVE_P2_ownObject({ kind: "loop" }, 971, 1, 4)), ee = (__HIVE_P2_reserveObject(1, 972), __HIVE_P2_ownObject({ kind: "switch" }, 972, 1, 4));
    __HIVE_P2_set($, "isLet", (__HIVE_P2_reserveFunction(974), __HIVE_P2_registerFunction(function (context) {
        var __HIVE_P2_temp974_0, __HIVE_P2_temp974_1;
        if (!(__HIVE_P2_temp974_0 = this, __HIVE_P2_temp974_1 = __HIVE_P2_get(__HIVE_P2_temp974_0, "isContextual", 975), __HIVE_P2_invoke(__HIVE_P2_temp974_1, __HIVE_P2_temp974_0, (__HIVE_P2_reserveArray(1, 975), __HIVE_P2_ownArray(["let"], 975, "CONTROL_ARRAY")), 975)))
            return false;
        var packed = __HIVE_P2_invoke(__scalarTrivia, void 0, (__HIVE_P2_reserveArray(5, 977), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 978), __HIVE_P2_get(this, "pos", 979), __HIVE_P2_get(this, "inModule", 980), __HIVE_P2_get(this, "lastTokEnd", 981), __HIVE_P2_get(__HIVE_P2_get(this, "options", 983), "allowHashBang", 982)], 977, "CONTROL_ARRAY")), 977);
        var i = __HIVE_P2_binary("/", (__HIVE_P2_binary("-", packed, __HIVE_P2_binary("%", packed, 2, 986), 985)), 2, 984), c = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 987), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 988), i], 987, "CONTROL_ARRAY")), 987);
        if (c === 91 || c === 92)
            return true;
        if (context)
            return false;
        if (c === 123)
            return true;
        if (__HIVE_P2_binary(">=", c, 128, 989))
            __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 990), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 990, "CONTROL_ARRAY")), 990);
        if (__HIVE_P2_invoke(__scalarStart, void 0, (__HIVE_P2_reserveArray(1, 991), __HIVE_P2_ownArray([c], 991, "CONTROL_ARRAY")), 991)) {
            var word = __HIVE_P2_invoke(__scalarPeekWord, void 0, (__HIVE_P2_reserveArray(2, 992), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 993), i], 992, "CONTROL_ARRAY")), 992);
            return __HIVE_P2_get(word, "escaped", 994) || __HIVE_P2_get(word, "value", 995) !== "in" && __HIVE_P2_get(word, "value", 996) !== "instanceof";
        }
        return false;
    }, 6, 1, 0, 974)), 997);
    __HIVE_P2_set($, "isAsyncFunction", (__HIVE_P2_reserveFunction(1000), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp1000_0, __HIVE_P2_temp1000_1;
        if (!(__HIVE_P2_temp1000_0 = this, __HIVE_P2_temp1000_1 = __HIVE_P2_get(__HIVE_P2_temp1000_0, "isContextual", 1001), __HIVE_P2_invoke(__HIVE_P2_temp1000_1, __HIVE_P2_temp1000_0, (__HIVE_P2_reserveArray(1, 1001), __HIVE_P2_ownArray(["async"], 1001, "CONTROL_ARRAY")), 1001)))
            return false;
        var packed = __HIVE_P2_invoke(__scalarTrivia, void 0, (__HIVE_P2_reserveArray(5, 1003), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 1004), __HIVE_P2_get(this, "pos", 1005), __HIVE_P2_get(this, "inModule", 1006), __HIVE_P2_get(this, "lastTokEnd", 1007), __HIVE_P2_get(__HIVE_P2_get(this, "options", 1009), "allowHashBang", 1008)], 1003, "CONTROL_ARRAY")), 1003);
        if (__HIVE_P2_binary("%", packed, 2, 1010) === 1)
            return false;
        var i = __HIVE_P2_binary("/", (__HIVE_P2_binary("-", packed, __HIVE_P2_binary("%", packed, 2, 1013), 1012)), 2, 1011);
        if (!__HIVE_P2_invoke(__scalarStart, void 0, (__HIVE_P2_reserveArray(1, 1014), __HIVE_P2_ownArray([__HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 1015), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 1016), i], 1015, "CONTROL_ARRAY")), 1015)], 1014, "CONTROL_ARRAY")), 1014)) {
            if (__HIVE_P2_binary(">=", __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 1018), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 1019), i], 1018, "CONTROL_ARRAY")), 1018), 128, 1017))
                __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 1020), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 1020, "CONTROL_ARRAY")), 1020);
            return false;
        }
        var word = __HIVE_P2_invoke(__scalarPeekWord, void 0, (__HIVE_P2_reserveArray(2, 1021), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 1022), i], 1021, "CONTROL_ARRAY")), 1021);
        return !__HIVE_P2_get(word, "escaped", 1023) && __HIVE_P2_get(word, "value", 1024) === "function";
    }, 5, 0, 0, 1000)), 1025);
    (__HIVE_P2_temp0_994 = $, __HIVE_P2_temp0_995 = "parseStatement", __HIVE_P2_set(__HIVE_P2_temp0_994, __HIVE_P2_temp0_995, (__HIVE_P2_reserveFunction(1029), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp1029_0, __HIVE_P2_temp1029_1, __HIVE_P2_temp1029_2, __HIVE_P2_temp1029_3, __HIVE_P2_temp1029_4, __HIVE_P2_temp1029_5, __HIVE_P2_temp1029_6, __HIVE_P2_temp1029_7, __HIVE_P2_temp1029_8, __HIVE_P2_temp1029_9, __HIVE_P2_temp1029_10, __HIVE_P2_temp1029_11, __HIVE_P2_temp1029_12, __HIVE_P2_temp1029_13, __HIVE_P2_temp1029_14, __HIVE_P2_temp1029_15, __HIVE_P2_temp1029_16, __HIVE_P2_temp1029_17, __HIVE_P2_temp1029_18, __HIVE_P2_temp1029_19, __HIVE_P2_temp1029_20, __HIVE_P2_temp1029_21, __HIVE_P2_temp1029_22, __HIVE_P2_temp1029_23, __HIVE_P2_temp1029_24, __HIVE_P2_temp1029_25, __HIVE_P2_temp1029_26, __HIVE_P2_temp1029_27, __HIVE_P2_temp1029_28, __HIVE_P2_temp1029_29, __HIVE_P2_temp1029_30, __HIVE_P2_temp1029_31, __HIVE_P2_temp1029_32, __HIVE_P2_temp1029_33, __HIVE_P2_temp1029_34, __HIVE_P2_temp1029_35, __HIVE_P2_temp1029_36, __HIVE_P2_temp1029_37, __HIVE_P2_temp1029_38, __HIVE_P2_temp1029_39, __HIVE_P2_temp1029_40, __HIVE_P2_temp1029_41, __HIVE_P2_temp1029_42, __HIVE_P2_temp1029_43, __HIVE_P2_temp1029_44, __HIVE_P2_temp1029_45, __HIVE_P2_temp1029_46, __HIVE_P2_temp1029_47, __HIVE_P2_temp1029_48, __HIVE_P2_temp1029_49, __HIVE_P2_temp1029_50, __HIVE_P2_temp1029_51, __HIVE_P2_temp1029_52, __HIVE_P2_temp1029_53, __HIVE_P2_temp1029_54, __HIVE_P2_temp1029_55, __HIVE_P2_temp1029_56, __HIVE_P2_temp1029_57, __HIVE_P2_temp1029_58, __HIVE_P2_temp1029_59, __HIVE_P2_temp1029_60, __HIVE_P2_temp1029_61, __HIVE_P2_temp1029_62, __HIVE_P2_temp1029_63, __HIVE_P2_temp1029_64;
        var s = __HIVE_P2_get(this, "type", 1030), r = (__HIVE_P2_temp1029_0 = this, __HIVE_P2_temp1029_1 = __HIVE_P2_get(__HIVE_P2_temp1029_0, "startNode", 1031), __HIVE_P2_invoke(__HIVE_P2_temp1029_1, __HIVE_P2_temp1029_0, (__HIVE_P2_reserveArray(0, 1031), __HIVE_P2_ownArray([], 1031, "CONTROL_ARRAY")), 1031)), a;
        if ((__HIVE_P2_temp1029_2 = this, __HIVE_P2_temp1029_3 = __HIVE_P2_get(__HIVE_P2_temp1029_2, "isLet", 1033), __HIVE_P2_invoke(__HIVE_P2_temp1029_3, __HIVE_P2_temp1029_2, (__HIVE_P2_reserveArray(1, 1033), __HIVE_P2_ownArray([e], 1033, "CONTROL_ARRAY")), 1033))) {
            s = __HIVE_P2_get(m, "_var", 1036);
            a = "let";
        }
        switch (s) {
            case __HIVE_P2_get(m, "_break", 1038):
            case __HIVE_P2_get(m, "_continue", 1039): return (__HIVE_P2_temp1029_4 = this, __HIVE_P2_temp1029_5 = __HIVE_P2_get(__HIVE_P2_temp1029_4, "parseBreakContinueStatement", 1040), __HIVE_P2_invoke(__HIVE_P2_temp1029_5, __HIVE_P2_temp1029_4, (__HIVE_P2_reserveArray(2, 1040), __HIVE_P2_ownArray([r, __HIVE_P2_get(s, "keyword", 1041)], 1040, "CONTROL_ARRAY")), 1040));
            case __HIVE_P2_get(m, "_debugger", 1043): return (__HIVE_P2_temp1029_6 = this, __HIVE_P2_temp1029_7 = __HIVE_P2_get(__HIVE_P2_temp1029_6, "parseDebuggerStatement", 1044), __HIVE_P2_invoke(__HIVE_P2_temp1029_7, __HIVE_P2_temp1029_6, (__HIVE_P2_reserveArray(1, 1044), __HIVE_P2_ownArray([r], 1044, "CONTROL_ARRAY")), 1044));
            case __HIVE_P2_get(m, "_do", 1046): return (__HIVE_P2_temp1029_8 = this, __HIVE_P2_temp1029_9 = __HIVE_P2_get(__HIVE_P2_temp1029_8, "parseDoStatement", 1047), __HIVE_P2_invoke(__HIVE_P2_temp1029_9, __HIVE_P2_temp1029_8, (__HIVE_P2_reserveArray(1, 1047), __HIVE_P2_ownArray([r], 1047, "CONTROL_ARRAY")), 1047));
            case __HIVE_P2_get(m, "_for", 1049): return (__HIVE_P2_temp1029_10 = this, __HIVE_P2_temp1029_11 = __HIVE_P2_get(__HIVE_P2_temp1029_10, "parseForStatement", 1050), __HIVE_P2_invoke(__HIVE_P2_temp1029_11, __HIVE_P2_temp1029_10, (__HIVE_P2_reserveArray(1, 1050), __HIVE_P2_ownArray([r], 1050, "CONTROL_ARRAY")), 1050));
            case __HIVE_P2_get(m, "_function", 1052):
                if (e && (__HIVE_P2_get(this, "strict", 1053) || e !== "if" && e !== "label") && __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1056), "ecmaVersion", 1055), 6, 1054)) {
                    __HIVE_P2_syntaxRefusal(1057);
                }
                return (__HIVE_P2_temp1029_12 = this, __HIVE_P2_temp1029_13 = __HIVE_P2_get(__HIVE_P2_temp1029_12, "parseFunctionStatement", 1058), __HIVE_P2_invoke(__HIVE_P2_temp1029_13, __HIVE_P2_temp1029_12, (__HIVE_P2_reserveArray(3, 1058), __HIVE_P2_ownArray([r, false, !e], 1058, "CONTROL_ARRAY")), 1058));
            case __HIVE_P2_get(m, "_class", 1060):
                if (e) {
                    __HIVE_P2_syntaxRefusal(1061);
                }
                return (__HIVE_P2_temp1029_14 = this, __HIVE_P2_temp1029_15 = __HIVE_P2_get(__HIVE_P2_temp1029_14, "parseClass", 1062), __HIVE_P2_invoke(__HIVE_P2_temp1029_15, __HIVE_P2_temp1029_14, (__HIVE_P2_reserveArray(2, 1062), __HIVE_P2_ownArray([r, true], 1062, "CONTROL_ARRAY")), 1062));
            case __HIVE_P2_get(m, "_if", 1064): return (__HIVE_P2_temp1029_16 = this, __HIVE_P2_temp1029_17 = __HIVE_P2_get(__HIVE_P2_temp1029_16, "parseIfStatement", 1065), __HIVE_P2_invoke(__HIVE_P2_temp1029_17, __HIVE_P2_temp1029_16, (__HIVE_P2_reserveArray(1, 1065), __HIVE_P2_ownArray([r], 1065, "CONTROL_ARRAY")), 1065));
            case __HIVE_P2_get(m, "_return", 1067): return (__HIVE_P2_temp1029_18 = this, __HIVE_P2_temp1029_19 = __HIVE_P2_get(__HIVE_P2_temp1029_18, "parseReturnStatement", 1068), __HIVE_P2_invoke(__HIVE_P2_temp1029_19, __HIVE_P2_temp1029_18, (__HIVE_P2_reserveArray(1, 1068), __HIVE_P2_ownArray([r], 1068, "CONTROL_ARRAY")), 1068));
            case __HIVE_P2_get(m, "_switch", 1070): return (__HIVE_P2_temp1029_20 = this, __HIVE_P2_temp1029_21 = __HIVE_P2_get(__HIVE_P2_temp1029_20, "parseSwitchStatement", 1071), __HIVE_P2_invoke(__HIVE_P2_temp1029_21, __HIVE_P2_temp1029_20, (__HIVE_P2_reserveArray(1, 1071), __HIVE_P2_ownArray([r], 1071, "CONTROL_ARRAY")), 1071));
            case __HIVE_P2_get(m, "_throw", 1073): return (__HIVE_P2_temp1029_22 = this, __HIVE_P2_temp1029_23 = __HIVE_P2_get(__HIVE_P2_temp1029_22, "parseThrowStatement", 1074), __HIVE_P2_invoke(__HIVE_P2_temp1029_23, __HIVE_P2_temp1029_22, (__HIVE_P2_reserveArray(1, 1074), __HIVE_P2_ownArray([r], 1074, "CONTROL_ARRAY")), 1074));
            case __HIVE_P2_get(m, "_try", 1076): return (__HIVE_P2_temp1029_24 = this, __HIVE_P2_temp1029_25 = __HIVE_P2_get(__HIVE_P2_temp1029_24, "parseTryStatement", 1077), __HIVE_P2_invoke(__HIVE_P2_temp1029_25, __HIVE_P2_temp1029_24, (__HIVE_P2_reserveArray(1, 1077), __HIVE_P2_ownArray([r], 1077, "CONTROL_ARRAY")), 1077));
            case __HIVE_P2_get(m, "_const", 1079):
            case __HIVE_P2_get(m, "_var", 1080):
                a = a || __HIVE_P2_get(this, "value", 1082);
                if (e && a !== "var") {
                    __HIVE_P2_syntaxRefusal(1083);
                }
                return (__HIVE_P2_temp1029_26 = this, __HIVE_P2_temp1029_27 = __HIVE_P2_get(__HIVE_P2_temp1029_26, "parseVarStatement", 1084), __HIVE_P2_invoke(__HIVE_P2_temp1029_27, __HIVE_P2_temp1029_26, (__HIVE_P2_reserveArray(2, 1084), __HIVE_P2_ownArray([r, a], 1084, "CONTROL_ARRAY")), 1084));
            case __HIVE_P2_get(m, "_while", 1086): return (__HIVE_P2_temp1029_28 = this, __HIVE_P2_temp1029_29 = __HIVE_P2_get(__HIVE_P2_temp1029_28, "parseWhileStatement", 1087), __HIVE_P2_invoke(__HIVE_P2_temp1029_29, __HIVE_P2_temp1029_28, (__HIVE_P2_reserveArray(1, 1087), __HIVE_P2_ownArray([r], 1087, "CONTROL_ARRAY")), 1087));
            case __HIVE_P2_get(m, "_with", 1089): return (__HIVE_P2_temp1029_30 = this, __HIVE_P2_temp1029_31 = __HIVE_P2_get(__HIVE_P2_temp1029_30, "parseWithStatement", 1090), __HIVE_P2_invoke(__HIVE_P2_temp1029_31, __HIVE_P2_temp1029_30, (__HIVE_P2_reserveArray(1, 1090), __HIVE_P2_ownArray([r], 1090, "CONTROL_ARRAY")), 1090));
            case __HIVE_P2_get(m, "braceL", 1092): return (__HIVE_P2_temp1029_32 = this, __HIVE_P2_temp1029_33 = __HIVE_P2_get(__HIVE_P2_temp1029_32, "parseBlock", 1093), __HIVE_P2_invoke(__HIVE_P2_temp1029_33, __HIVE_P2_temp1029_32, (__HIVE_P2_reserveArray(2, 1093), __HIVE_P2_ownArray([true, r], 1093, "CONTROL_ARRAY")), 1093));
            case __HIVE_P2_get(m, "semi", 1095): return (__HIVE_P2_temp1029_34 = this, __HIVE_P2_temp1029_35 = __HIVE_P2_get(__HIVE_P2_temp1029_34, "parseEmptyStatement", 1096), __HIVE_P2_invoke(__HIVE_P2_temp1029_35, __HIVE_P2_temp1029_34, (__HIVE_P2_reserveArray(1, 1096), __HIVE_P2_ownArray([r], 1096, "CONTROL_ARRAY")), 1096));
            case __HIVE_P2_get(m, "_export", 1098):
            case __HIVE_P2_get(m, "_import", 1099):
                if (__HIVE_P2_binary(">", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1102), "ecmaVersion", 1101), 10, 1100) && s === __HIVE_P2_get(m, "_import", 1103)) {
                    (__HIVE_P2_temp1029_36 = y, __HIVE_P2_temp1029_37 = "lastIndex", __HIVE_P2_set(__HIVE_P2_temp1029_36, __HIVE_P2_temp1029_37, __HIVE_P2_get(this, "pos", 1106), 1104));
                    var n = (__HIVE_P2_temp1029_39 = y, __HIVE_P2_temp1029_40 = __HIVE_P2_get(__HIVE_P2_temp1029_39, "exec", 1107), __HIVE_P2_invoke(__HIVE_P2_temp1029_40, __HIVE_P2_temp1029_39, (__HIVE_P2_reserveArray(1, 1107), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 1108)], 1107, "CONTROL_ARRAY")), 1107));
                    var o = __HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 1111), __HIVE_P2_get(__HIVE_P2_get(n, 0, 1113), "length", 1112), 1110), h = (__HIVE_P2_temp1029_41 = __HIVE_P2_get(this, "input", 1116), __HIVE_P2_temp1029_42 = __HIVE_P2_get(__HIVE_P2_temp1029_41, "charCodeAt", 1114), __HIVE_P2_invoke(__HIVE_P2_temp1029_42, __HIVE_P2_temp1029_41, (__HIVE_P2_reserveArray(1, 1114), __HIVE_P2_ownArray([o], 1114, "CONTROL_ARRAY")), 1114));
                    if (h === 40 || h === 46) {
                        return (__HIVE_P2_temp1029_45 = this, __HIVE_P2_temp1029_46 = __HIVE_P2_get(__HIVE_P2_temp1029_45, "parseExpressionStatement", 1117), __HIVE_P2_invoke(__HIVE_P2_temp1029_46, __HIVE_P2_temp1029_45, (__HIVE_P2_reserveArray(2, 1117), __HIVE_P2_ownArray([r, (__HIVE_P2_temp1029_43 = this, __HIVE_P2_temp1029_44 = __HIVE_P2_get(__HIVE_P2_temp1029_43, "parseExpression", 1118), __HIVE_P2_invoke(__HIVE_P2_temp1029_44, __HIVE_P2_temp1029_43, (__HIVE_P2_reserveArray(0, 1118), __HIVE_P2_ownArray([], 1118, "CONTROL_ARRAY")), 1118))], 1117, "CONTROL_ARRAY")), 1117));
                    }
                }
                if (!__HIVE_P2_get(__HIVE_P2_get(this, "options", 1122), "allowImportExportEverywhere", 1121)) {
                    if (!t) {
                        __HIVE_P2_syntaxRefusal(1123);
                    }
                    if (!__HIVE_P2_get(this, "inModule", 1124)) {
                        __HIVE_P2_syntaxRefusal(1125);
                    }
                }
                return s === __HIVE_P2_get(m, "_import", 1126) ? (__HIVE_P2_temp1029_47 = this, __HIVE_P2_temp1029_48 = __HIVE_P2_get(__HIVE_P2_temp1029_47, "parseImport", 1127), __HIVE_P2_invoke(__HIVE_P2_temp1029_48, __HIVE_P2_temp1029_47, (__HIVE_P2_reserveArray(1, 1127), __HIVE_P2_ownArray([r], 1127, "CONTROL_ARRAY")), 1127)) : (__HIVE_P2_temp1029_49 = this, __HIVE_P2_temp1029_50 = __HIVE_P2_get(__HIVE_P2_temp1029_49, "parseExport", 1129), __HIVE_P2_invoke(__HIVE_P2_temp1029_50, __HIVE_P2_temp1029_49, (__HIVE_P2_reserveArray(2, 1129), __HIVE_P2_ownArray([r, i], 1129, "CONTROL_ARRAY")), 1129));
            default:
                if ((__HIVE_P2_temp1029_51 = this, __HIVE_P2_temp1029_52 = __HIVE_P2_get(__HIVE_P2_temp1029_51, "isAsyncFunction", 1131), __HIVE_P2_invoke(__HIVE_P2_temp1029_52, __HIVE_P2_temp1029_51, (__HIVE_P2_reserveArray(0, 1131), __HIVE_P2_ownArray([], 1131, "CONTROL_ARRAY")), 1131))) {
                    if (e) {
                        __HIVE_P2_syntaxRefusal(1133);
                    }
                    (__HIVE_P2_temp1029_53 = this, __HIVE_P2_temp1029_54 = __HIVE_P2_get(__HIVE_P2_temp1029_53, "next", 1134), __HIVE_P2_invoke(__HIVE_P2_temp1029_54, __HIVE_P2_temp1029_53, (__HIVE_P2_reserveArray(0, 1134), __HIVE_P2_ownArray([], 1134, "CONTROL_ARRAY")), 1134));
                    return (__HIVE_P2_temp1029_55 = this, __HIVE_P2_temp1029_56 = __HIVE_P2_get(__HIVE_P2_temp1029_55, "parseFunctionStatement", 1136), __HIVE_P2_invoke(__HIVE_P2_temp1029_56, __HIVE_P2_temp1029_55, (__HIVE_P2_reserveArray(3, 1136), __HIVE_P2_ownArray([r, true, !e], 1136, "CONTROL_ARRAY")), 1136));
                }
                var p = __HIVE_P2_get(this, "value", 1138), c = (__HIVE_P2_temp1029_57 = this, __HIVE_P2_temp1029_58 = __HIVE_P2_get(__HIVE_P2_temp1029_57, "parseExpression", 1139), __HIVE_P2_invoke(__HIVE_P2_temp1029_58, __HIVE_P2_temp1029_57, (__HIVE_P2_reserveArray(0, 1139), __HIVE_P2_ownArray([], 1139, "CONTROL_ARRAY")), 1139));
                if (s === __HIVE_P2_get(m, "name", 1141) && __HIVE_P2_get(c, "type", 1142) === "Identifier" && (__HIVE_P2_temp1029_59 = this, __HIVE_P2_temp1029_60 = __HIVE_P2_get(__HIVE_P2_temp1029_59, "eat", 1143), __HIVE_P2_invoke(__HIVE_P2_temp1029_60, __HIVE_P2_temp1029_59, (__HIVE_P2_reserveArray(1, 1143), __HIVE_P2_ownArray([__HIVE_P2_get(m, "colon", 1144)], 1143, "CONTROL_ARRAY")), 1143))) {
                    return (__HIVE_P2_temp1029_61 = this, __HIVE_P2_temp1029_62 = __HIVE_P2_get(__HIVE_P2_temp1029_61, "parseLabeledStatement", 1146), __HIVE_P2_invoke(__HIVE_P2_temp1029_62, __HIVE_P2_temp1029_61, (__HIVE_P2_reserveArray(4, 1146), __HIVE_P2_ownArray([r, p, c, e], 1146, "CONTROL_ARRAY")), 1146));
                }
                else {
                    return (__HIVE_P2_temp1029_63 = this, __HIVE_P2_temp1029_64 = __HIVE_P2_get(__HIVE_P2_temp1029_63, "parseExpressionStatement", 1148), __HIVE_P2_invoke(__HIVE_P2_temp1029_64, __HIVE_P2_temp1029_63, (__HIVE_P2_reserveArray(2, 1148), __HIVE_P2_ownArray([r, c], 1148, "CONTROL_ARRAY")), 1148));
                }
        }
    }, 73, 3, 0, 1029)), 1027));
    (__HIVE_P2_temp0_997 = $, __HIVE_P2_temp0_998 = "parseBreakContinueStatement", __HIVE_P2_set(__HIVE_P2_temp0_997, __HIVE_P2_temp0_998, (__HIVE_P2_reserveFunction(1152), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp1152_0, __HIVE_P2_temp1152_1, __HIVE_P2_temp1152_2, __HIVE_P2_temp1152_3, __HIVE_P2_temp1152_4, __HIVE_P2_temp1152_5, __HIVE_P2_temp1152_6, __HIVE_P2_temp1152_7, __HIVE_P2_temp1152_8, __HIVE_P2_temp1152_9, __HIVE_P2_temp1152_10, __HIVE_P2_temp1152_11, __HIVE_P2_temp1152_12, __HIVE_P2_temp1152_13, __HIVE_P2_temp1152_14, __HIVE_P2_temp1152_15, __HIVE_P2_temp1152_16, __HIVE_P2_temp1152_17, __HIVE_P2_temp1152_18, __HIVE_P2_temp1152_19;
        var i = t === "break";
        (__HIVE_P2_temp1152_0 = this, __HIVE_P2_temp1152_1 = __HIVE_P2_get(__HIVE_P2_temp1152_0, "next", 1153), __HIVE_P2_invoke(__HIVE_P2_temp1152_1, __HIVE_P2_temp1152_0, (__HIVE_P2_reserveArray(0, 1153), __HIVE_P2_ownArray([], 1153, "CONTROL_ARRAY")), 1153));
        if ((__HIVE_P2_temp1152_2 = this, __HIVE_P2_temp1152_3 = __HIVE_P2_get(__HIVE_P2_temp1152_2, "eat", 1155), __HIVE_P2_invoke(__HIVE_P2_temp1152_3, __HIVE_P2_temp1152_2, (__HIVE_P2_reserveArray(1, 1155), __HIVE_P2_ownArray([__HIVE_P2_get(m, "semi", 1156)], 1155, "CONTROL_ARRAY")), 1155)) || (__HIVE_P2_temp1152_4 = this, __HIVE_P2_temp1152_5 = __HIVE_P2_get(__HIVE_P2_temp1152_4, "insertSemicolon", 1158), __HIVE_P2_invoke(__HIVE_P2_temp1152_5, __HIVE_P2_temp1152_4, (__HIVE_P2_reserveArray(0, 1158), __HIVE_P2_ownArray([], 1158, "CONTROL_ARRAY")), 1158))) {
            (__HIVE_P2_temp1152_6 = e, __HIVE_P2_temp1152_7 = "label", __HIVE_P2_set(__HIVE_P2_temp1152_6, __HIVE_P2_temp1152_7, null, 1160));
        }
        else if (__HIVE_P2_get(this, "type", 1162) !== __HIVE_P2_get(m, "name", 1163)) {
            __HIVE_P2_syntaxRefusal(1164);
        }
        else {
            (__HIVE_P2_temp1152_9 = e, __HIVE_P2_temp1152_10 = "label", __HIVE_P2_set(__HIVE_P2_temp1152_9, __HIVE_P2_temp1152_10, (__HIVE_P2_temp1152_12 = this, __HIVE_P2_temp1152_13 = __HIVE_P2_get(__HIVE_P2_temp1152_12, "parseIdent", 1167), __HIVE_P2_invoke(__HIVE_P2_temp1152_13, __HIVE_P2_temp1152_12, (__HIVE_P2_reserveArray(0, 1167), __HIVE_P2_ownArray([], 1167, "CONTROL_ARRAY")), 1167)), 1165));
            (__HIVE_P2_temp1152_14 = this, __HIVE_P2_temp1152_15 = __HIVE_P2_get(__HIVE_P2_temp1152_14, "semicolon", 1169), __HIVE_P2_invoke(__HIVE_P2_temp1152_15, __HIVE_P2_temp1152_14, (__HIVE_P2_reserveArray(0, 1169), __HIVE_P2_ownArray([], 1169, "CONTROL_ARRAY")), 1169));
        }
        var s = 0;
        for (; __HIVE_P2_binary("<", s, __HIVE_P2_get(__HIVE_P2_get(this, "labels", 1174), "length", 1173), 1172); (__HIVE_P2_temp1152_16 = __HIVE_P2_numeric(s, 1175), __HIVE_P2_temp1152_17 = __HIVE_P2_temp1152_16 + 1, s = __HIVE_P2_temp1152_17, __HIVE_P2_temp1152_17)) {
            __HIVE_P2_tick(1171);
            var r = __HIVE_P2_get(__HIVE_P2_get(this, "labels", 1177), s, 1176);
            if (__HIVE_P2_binary("==", __HIVE_P2_get(e, "label", 1179), null, 1178) || __HIVE_P2_get(r, "name", 1180) === __HIVE_P2_get(__HIVE_P2_get(e, "label", 1182), "name", 1181)) {
                if (__HIVE_P2_binary("!=", __HIVE_P2_get(r, "kind", 1184), null, 1183) && (i || __HIVE_P2_get(r, "kind", 1185) === "loop")) {
                    break;
                }
                if (__HIVE_P2_get(e, "label", 1186) && i) {
                    break;
                }
            }
        }
        if (s === __HIVE_P2_get(__HIVE_P2_get(this, "labels", 1188), "length", 1187)) {
            __HIVE_P2_syntaxRefusal(1189);
        }
        return (__HIVE_P2_temp1152_18 = this, __HIVE_P2_temp1152_19 = __HIVE_P2_get(__HIVE_P2_temp1152_18, "finishNode", 1190), __HIVE_P2_invoke(__HIVE_P2_temp1152_19, __HIVE_P2_temp1152_18, (__HIVE_P2_reserveArray(2, 1190), __HIVE_P2_ownArray([e, i ? "BreakStatement" : "ContinueStatement"], 1190, "CONTROL_ARRAY")), 1190));
    }, 23, 2, 0, 1152)), 1150));
    (__HIVE_P2_temp0_1000 = $, __HIVE_P2_temp0_1001 = "parseDebuggerStatement", __HIVE_P2_set(__HIVE_P2_temp0_1000, __HIVE_P2_temp0_1001, (__HIVE_P2_reserveFunction(1194), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp1194_0, __HIVE_P2_temp1194_1, __HIVE_P2_temp1194_2, __HIVE_P2_temp1194_3, __HIVE_P2_temp1194_4, __HIVE_P2_temp1194_5;
        (__HIVE_P2_temp1194_0 = this, __HIVE_P2_temp1194_1 = __HIVE_P2_get(__HIVE_P2_temp1194_0, "next", 1195), __HIVE_P2_invoke(__HIVE_P2_temp1194_1, __HIVE_P2_temp1194_0, (__HIVE_P2_reserveArray(0, 1195), __HIVE_P2_ownArray([], 1195, "CONTROL_ARRAY")), 1195));
        (__HIVE_P2_temp1194_2 = this, __HIVE_P2_temp1194_3 = __HIVE_P2_get(__HIVE_P2_temp1194_2, "semicolon", 1197), __HIVE_P2_invoke(__HIVE_P2_temp1194_3, __HIVE_P2_temp1194_2, (__HIVE_P2_reserveArray(0, 1197), __HIVE_P2_ownArray([], 1197, "CONTROL_ARRAY")), 1197));
        return (__HIVE_P2_temp1194_4 = this, __HIVE_P2_temp1194_5 = __HIVE_P2_get(__HIVE_P2_temp1194_4, "finishNode", 1199), __HIVE_P2_invoke(__HIVE_P2_temp1194_5, __HIVE_P2_temp1194_4, (__HIVE_P2_reserveArray(2, 1199), __HIVE_P2_ownArray([e, "DebuggerStatement"], 1199, "CONTROL_ARRAY")), 1199));
    }, 6, 1, 0, 1194)), 1192));
    (__HIVE_P2_temp0_1003 = $, __HIVE_P2_temp0_1004 = "parseDoStatement", __HIVE_P2_set(__HIVE_P2_temp0_1003, __HIVE_P2_temp0_1004, (__HIVE_P2_reserveFunction(1203), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp1203_0, __HIVE_P2_temp1203_1, __HIVE_P2_temp1203_2, __HIVE_P2_temp1203_3, __HIVE_P2_temp1203_4, __HIVE_P2_temp1203_5, __HIVE_P2_temp1203_6, __HIVE_P2_temp1203_7, __HIVE_P2_temp1203_8, __HIVE_P2_temp1203_9, __HIVE_P2_temp1203_10, __HIVE_P2_temp1203_11, __HIVE_P2_temp1203_12, __HIVE_P2_temp1203_13, __HIVE_P2_temp1203_14, __HIVE_P2_temp1203_15, __HIVE_P2_temp1203_16, __HIVE_P2_temp1203_17, __HIVE_P2_temp1203_18, __HIVE_P2_temp1203_19, __HIVE_P2_temp1203_20, __HIVE_P2_temp1203_21, __HIVE_P2_temp1203_22, __HIVE_P2_temp1203_23;
        (__HIVE_P2_temp1203_0 = this, __HIVE_P2_temp1203_1 = __HIVE_P2_get(__HIVE_P2_temp1203_0, "next", 1204), __HIVE_P2_invoke(__HIVE_P2_temp1203_1, __HIVE_P2_temp1203_0, (__HIVE_P2_reserveArray(0, 1204), __HIVE_P2_ownArray([], 1204, "CONTROL_ARRAY")), 1204));
        (__HIVE_P2_temp1203_2 = __HIVE_P2_get(this, "labels", 1208), __HIVE_P2_temp1203_3 = __HIVE_P2_get(__HIVE_P2_temp1203_2, "push", 1206), __HIVE_P2_invoke(__HIVE_P2_temp1203_3, __HIVE_P2_temp1203_2, (__HIVE_P2_reserveArray(1, 1206), __HIVE_P2_ownArray([J], 1206, "CONTROL_ARRAY")), 1206));
        (__HIVE_P2_temp1203_4 = e, __HIVE_P2_temp1203_5 = "body", __HIVE_P2_set(__HIVE_P2_temp1203_4, __HIVE_P2_temp1203_5, (__HIVE_P2_temp1203_7 = this, __HIVE_P2_temp1203_8 = __HIVE_P2_get(__HIVE_P2_temp1203_7, "parseStatement", 1211), __HIVE_P2_invoke(__HIVE_P2_temp1203_8, __HIVE_P2_temp1203_7, (__HIVE_P2_reserveArray(1, 1211), __HIVE_P2_ownArray(["do"], 1211, "CONTROL_ARRAY")), 1211)), 1209));
        (__HIVE_P2_temp1203_9 = __HIVE_P2_get(this, "labels", 1215), __HIVE_P2_temp1203_10 = __HIVE_P2_get(__HIVE_P2_temp1203_9, "pop", 1213), __HIVE_P2_invoke(__HIVE_P2_temp1203_10, __HIVE_P2_temp1203_9, (__HIVE_P2_reserveArray(0, 1213), __HIVE_P2_ownArray([], 1213, "CONTROL_ARRAY")), 1213));
        (__HIVE_P2_temp1203_11 = this, __HIVE_P2_temp1203_12 = __HIVE_P2_get(__HIVE_P2_temp1203_11, "expect", 1216), __HIVE_P2_invoke(__HIVE_P2_temp1203_12, __HIVE_P2_temp1203_11, (__HIVE_P2_reserveArray(1, 1216), __HIVE_P2_ownArray([__HIVE_P2_get(m, "_while", 1217)], 1216, "CONTROL_ARRAY")), 1216));
        (__HIVE_P2_temp1203_13 = e, __HIVE_P2_temp1203_14 = "test", __HIVE_P2_set(__HIVE_P2_temp1203_13, __HIVE_P2_temp1203_14, (__HIVE_P2_temp1203_16 = this, __HIVE_P2_temp1203_17 = __HIVE_P2_get(__HIVE_P2_temp1203_16, "parseParenExpression", 1221), __HIVE_P2_invoke(__HIVE_P2_temp1203_17, __HIVE_P2_temp1203_16, (__HIVE_P2_reserveArray(0, 1221), __HIVE_P2_ownArray([], 1221, "CONTROL_ARRAY")), 1221)), 1219));
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1225), "ecmaVersion", 1224), 6, 1223)) {
            (__HIVE_P2_temp1203_18 = this, __HIVE_P2_temp1203_19 = __HIVE_P2_get(__HIVE_P2_temp1203_18, "eat", 1226), __HIVE_P2_invoke(__HIVE_P2_temp1203_19, __HIVE_P2_temp1203_18, (__HIVE_P2_reserveArray(1, 1226), __HIVE_P2_ownArray([__HIVE_P2_get(m, "semi", 1227)], 1226, "CONTROL_ARRAY")), 1226));
        }
        else {
            (__HIVE_P2_temp1203_20 = this, __HIVE_P2_temp1203_21 = __HIVE_P2_get(__HIVE_P2_temp1203_20, "semicolon", 1229), __HIVE_P2_invoke(__HIVE_P2_temp1203_21, __HIVE_P2_temp1203_20, (__HIVE_P2_reserveArray(0, 1229), __HIVE_P2_ownArray([], 1229, "CONTROL_ARRAY")), 1229));
        }
        return (__HIVE_P2_temp1203_22 = this, __HIVE_P2_temp1203_23 = __HIVE_P2_get(__HIVE_P2_temp1203_22, "finishNode", 1231), __HIVE_P2_invoke(__HIVE_P2_temp1203_23, __HIVE_P2_temp1203_22, (__HIVE_P2_reserveArray(2, 1231), __HIVE_P2_ownArray([e, "DoWhileStatement"], 1231, "CONTROL_ARRAY")), 1231));
    }, 24, 1, 0, 1203)), 1201));
    (__HIVE_P2_temp0_1006 = $, __HIVE_P2_temp0_1007 = "parseForStatement", __HIVE_P2_set(__HIVE_P2_temp0_1006, __HIVE_P2_temp0_1007, (__HIVE_P2_reserveFunction(1235), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp1235_0, __HIVE_P2_temp1235_1, __HIVE_P2_temp1235_2, __HIVE_P2_temp1235_3, __HIVE_P2_temp1235_4, __HIVE_P2_temp1235_5, __HIVE_P2_temp1235_6, __HIVE_P2_temp1235_7, __HIVE_P2_temp1235_8, __HIVE_P2_temp1235_9, __HIVE_P2_temp1235_10, __HIVE_P2_temp1235_11, __HIVE_P2_temp1235_12, __HIVE_P2_temp1235_13, __HIVE_P2_temp1235_14, __HIVE_P2_temp1235_15, __HIVE_P2_temp1235_16, __HIVE_P2_temp1235_17, __HIVE_P2_temp1235_18, __HIVE_P2_temp1235_19, __HIVE_P2_temp1235_20, __HIVE_P2_temp1235_21, __HIVE_P2_temp1235_22, __HIVE_P2_temp1235_23, __HIVE_P2_temp1235_24, __HIVE_P2_temp1235_25, __HIVE_P2_temp1235_26, __HIVE_P2_temp1235_27, __HIVE_P2_temp1235_28, __HIVE_P2_temp1235_29, __HIVE_P2_temp1235_30, __HIVE_P2_temp1235_31, __HIVE_P2_temp1235_32, __HIVE_P2_temp1235_33, __HIVE_P2_temp1235_34, __HIVE_P2_temp1235_35, __HIVE_P2_temp1235_36, __HIVE_P2_temp1235_37, __HIVE_P2_temp1235_38, __HIVE_P2_temp1235_39, __HIVE_P2_temp1235_40, __HIVE_P2_temp1235_41, __HIVE_P2_temp1235_42, __HIVE_P2_temp1235_43, __HIVE_P2_temp1235_44, __HIVE_P2_temp1235_45, __HIVE_P2_temp1235_46, __HIVE_P2_temp1235_47, __HIVE_P2_temp1235_48, __HIVE_P2_temp1235_49, __HIVE_P2_temp1235_50, __HIVE_P2_temp1235_51, __HIVE_P2_temp1235_52, __HIVE_P2_temp1235_53, __HIVE_P2_temp1235_54;
        (__HIVE_P2_temp1235_0 = this, __HIVE_P2_temp1235_1 = __HIVE_P2_get(__HIVE_P2_temp1235_0, "next", 1236), __HIVE_P2_invoke(__HIVE_P2_temp1235_1, __HIVE_P2_temp1235_0, (__HIVE_P2_reserveArray(0, 1236), __HIVE_P2_ownArray([], 1236, "CONTROL_ARRAY")), 1236));
        var t = __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1240), "ecmaVersion", 1239), 9, 1238) && __HIVE_P2_get(this, "canAwait", 1241) && (__HIVE_P2_temp1235_2 = this, __HIVE_P2_temp1235_3 = __HIVE_P2_get(__HIVE_P2_temp1235_2, "eatContextual", 1242), __HIVE_P2_invoke(__HIVE_P2_temp1235_3, __HIVE_P2_temp1235_2, (__HIVE_P2_reserveArray(1, 1242), __HIVE_P2_ownArray(["await"], 1242, "CONTROL_ARRAY")), 1242)) ? __HIVE_P2_get(this, "lastTokStart", 1244) : __HIVE_P2_unary("-", 1, 1245);
        (__HIVE_P2_temp1235_4 = __HIVE_P2_get(this, "labels", 1248), __HIVE_P2_temp1235_5 = __HIVE_P2_get(__HIVE_P2_temp1235_4, "push", 1246), __HIVE_P2_invoke(__HIVE_P2_temp1235_5, __HIVE_P2_temp1235_4, (__HIVE_P2_reserveArray(1, 1246), __HIVE_P2_ownArray([J], 1246, "CONTROL_ARRAY")), 1246));
        (__HIVE_P2_temp1235_6 = this, __HIVE_P2_temp1235_7 = __HIVE_P2_get(__HIVE_P2_temp1235_6, "enterScope", 1249), __HIVE_P2_invoke(__HIVE_P2_temp1235_7, __HIVE_P2_temp1235_6, (__HIVE_P2_reserveArray(1, 1249), __HIVE_P2_ownArray([0], 1249, "CONTROL_ARRAY")), 1249));
        (__HIVE_P2_temp1235_8 = this, __HIVE_P2_temp1235_9 = __HIVE_P2_get(__HIVE_P2_temp1235_8, "expect", 1251), __HIVE_P2_invoke(__HIVE_P2_temp1235_9, __HIVE_P2_temp1235_8, (__HIVE_P2_reserveArray(1, 1251), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenL", 1252)], 1251, "CONTROL_ARRAY")), 1251));
        if (__HIVE_P2_get(this, "type", 1254) === __HIVE_P2_get(m, "semi", 1255)) {
            if (__HIVE_P2_binary(">", t, __HIVE_P2_unary("-", 1, 1257), 1256)) {
                __HIVE_P2_syntaxRefusal(1258);
            }
            return (__HIVE_P2_temp1235_10 = this, __HIVE_P2_temp1235_11 = __HIVE_P2_get(__HIVE_P2_temp1235_10, "parseFor", 1259), __HIVE_P2_invoke(__HIVE_P2_temp1235_11, __HIVE_P2_temp1235_10, (__HIVE_P2_reserveArray(2, 1259), __HIVE_P2_ownArray([e, null], 1259, "CONTROL_ARRAY")), 1259));
        }
        var i = (__HIVE_P2_temp1235_12 = this, __HIVE_P2_temp1235_13 = __HIVE_P2_get(__HIVE_P2_temp1235_12, "isLet", 1261), __HIVE_P2_invoke(__HIVE_P2_temp1235_13, __HIVE_P2_temp1235_12, (__HIVE_P2_reserveArray(0, 1261), __HIVE_P2_ownArray([], 1261, "CONTROL_ARRAY")), 1261));
        if (__HIVE_P2_get(this, "type", 1263) === __HIVE_P2_get(m, "_var", 1264) || __HIVE_P2_get(this, "type", 1265) === __HIVE_P2_get(m, "_const", 1266) || i) {
            var s = (__HIVE_P2_temp1235_14 = this, __HIVE_P2_temp1235_15 = __HIVE_P2_get(__HIVE_P2_temp1235_14, "startNode", 1267), __HIVE_P2_invoke(__HIVE_P2_temp1235_15, __HIVE_P2_temp1235_14, (__HIVE_P2_reserveArray(0, 1267), __HIVE_P2_ownArray([], 1267, "CONTROL_ARRAY")), 1267)), r = i ? "let" : __HIVE_P2_get(this, "value", 1269);
            (__HIVE_P2_temp1235_16 = this, __HIVE_P2_temp1235_17 = __HIVE_P2_get(__HIVE_P2_temp1235_16, "next", 1270), __HIVE_P2_invoke(__HIVE_P2_temp1235_17, __HIVE_P2_temp1235_16, (__HIVE_P2_reserveArray(0, 1270), __HIVE_P2_ownArray([], 1270, "CONTROL_ARRAY")), 1270));
            (__HIVE_P2_temp1235_18 = this, __HIVE_P2_temp1235_19 = __HIVE_P2_get(__HIVE_P2_temp1235_18, "parseVar", 1272), __HIVE_P2_invoke(__HIVE_P2_temp1235_19, __HIVE_P2_temp1235_18, (__HIVE_P2_reserveArray(3, 1272), __HIVE_P2_ownArray([s, true, r], 1272, "CONTROL_ARRAY")), 1272));
            (__HIVE_P2_temp1235_20 = this, __HIVE_P2_temp1235_21 = __HIVE_P2_get(__HIVE_P2_temp1235_20, "finishNode", 1274), __HIVE_P2_invoke(__HIVE_P2_temp1235_21, __HIVE_P2_temp1235_20, (__HIVE_P2_reserveArray(2, 1274), __HIVE_P2_ownArray([s, "VariableDeclaration"], 1274, "CONTROL_ARRAY")), 1274));
            if ((__HIVE_P2_get(this, "type", 1276) === __HIVE_P2_get(m, "_in", 1277) || __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1280), "ecmaVersion", 1279), 6, 1278) && (__HIVE_P2_temp1235_22 = this, __HIVE_P2_temp1235_23 = __HIVE_P2_get(__HIVE_P2_temp1235_22, "isContextual", 1281), __HIVE_P2_invoke(__HIVE_P2_temp1235_23, __HIVE_P2_temp1235_22, (__HIVE_P2_reserveArray(1, 1281), __HIVE_P2_ownArray(["of"], 1281, "CONTROL_ARRAY")), 1281))) && __HIVE_P2_get(__HIVE_P2_get(s, "declarations", 1284), "length", 1283) === 1) {
                if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1287), "ecmaVersion", 1286), 9, 1285)) {
                    if (__HIVE_P2_get(this, "type", 1288) === __HIVE_P2_get(m, "_in", 1289)) {
                        if (__HIVE_P2_binary(">", t, __HIVE_P2_unary("-", 1, 1291), 1290)) {
                            __HIVE_P2_syntaxRefusal(1292);
                        }
                    }
                    else {
                        (__HIVE_P2_temp1235_24 = e, __HIVE_P2_temp1235_25 = "await", __HIVE_P2_set(__HIVE_P2_temp1235_24, __HIVE_P2_temp1235_25, __HIVE_P2_binary(">", t, __HIVE_P2_unary("-", 1, 1296), 1295), 1293));
                    }
                }
                return (__HIVE_P2_temp1235_27 = this, __HIVE_P2_temp1235_28 = __HIVE_P2_get(__HIVE_P2_temp1235_27, "parseForIn", 1297), __HIVE_P2_invoke(__HIVE_P2_temp1235_28, __HIVE_P2_temp1235_27, (__HIVE_P2_reserveArray(2, 1297), __HIVE_P2_ownArray([e, s], 1297, "CONTROL_ARRAY")), 1297));
            }
            if (__HIVE_P2_binary(">", t, __HIVE_P2_unary("-", 1, 1300), 1299)) {
                __HIVE_P2_syntaxRefusal(1301);
            }
            return (__HIVE_P2_temp1235_29 = this, __HIVE_P2_temp1235_30 = __HIVE_P2_get(__HIVE_P2_temp1235_29, "parseFor", 1302), __HIVE_P2_invoke(__HIVE_P2_temp1235_30, __HIVE_P2_temp1235_29, (__HIVE_P2_reserveArray(2, 1302), __HIVE_P2_ownArray([e, s], 1302, "CONTROL_ARRAY")), 1302));
        }
        var a = (__HIVE_P2_temp1235_31 = this, __HIVE_P2_temp1235_32 = __HIVE_P2_get(__HIVE_P2_temp1235_31, "isContextual", 1304), __HIVE_P2_invoke(__HIVE_P2_temp1235_32, __HIVE_P2_temp1235_31, (__HIVE_P2_reserveArray(1, 1304), __HIVE_P2_ownArray(["let"], 1304, "CONTROL_ARRAY")), 1304)), n = false;
        var o = __HIVE_P2_get(this, "containsEsc", 1306);
        var h = __HIVE_P2_construct(Z, (__HIVE_P2_reserveArray(0, 1307), __HIVE_P2_ownArray([], 1307, "CONTROL_ARRAY")), 1307);
        var p = __HIVE_P2_get(this, "start", 1308);
        var c = __HIVE_P2_binary(">", t, __HIVE_P2_unary("-", 1, 1310), 1309) ? (__HIVE_P2_temp1235_33 = this, __HIVE_P2_temp1235_34 = __HIVE_P2_get(__HIVE_P2_temp1235_33, "parseExprSubscripts", 1311), __HIVE_P2_invoke(__HIVE_P2_temp1235_34, __HIVE_P2_temp1235_33, (__HIVE_P2_reserveArray(2, 1311), __HIVE_P2_ownArray([h, "await"], 1311, "CONTROL_ARRAY")), 1311)) : (__HIVE_P2_temp1235_35 = this, __HIVE_P2_temp1235_36 = __HIVE_P2_get(__HIVE_P2_temp1235_35, "parseExpression", 1313), __HIVE_P2_invoke(__HIVE_P2_temp1235_36, __HIVE_P2_temp1235_35, (__HIVE_P2_reserveArray(2, 1313), __HIVE_P2_ownArray([true, h], 1313, "CONTROL_ARRAY")), 1313));
        if (__HIVE_P2_get(this, "type", 1315) === __HIVE_P2_get(m, "_in", 1316) || (n = __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1320), "ecmaVersion", 1319), 6, 1318) && (__HIVE_P2_temp1235_37 = this, __HIVE_P2_temp1235_38 = __HIVE_P2_get(__HIVE_P2_temp1235_37, "isContextual", 1321), __HIVE_P2_invoke(__HIVE_P2_temp1235_38, __HIVE_P2_temp1235_37, (__HIVE_P2_reserveArray(1, 1321), __HIVE_P2_ownArray(["of"], 1321, "CONTROL_ARRAY")), 1321)))) {
            if (__HIVE_P2_binary(">", t, __HIVE_P2_unary("-", 1, 1324), 1323)) {
                if (__HIVE_P2_get(this, "type", 1325) === __HIVE_P2_get(m, "_in", 1326)) {
                    __HIVE_P2_syntaxRefusal(1327);
                }
                (__HIVE_P2_temp1235_39 = e, __HIVE_P2_temp1235_40 = "await", __HIVE_P2_set(__HIVE_P2_temp1235_39, __HIVE_P2_temp1235_40, true, 1328));
            }
            else if (n && __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1332), "ecmaVersion", 1331), 8, 1330)) {
                if (__HIVE_P2_get(c, "start", 1333) === p && !o && __HIVE_P2_get(c, "type", 1334) === "Identifier" && __HIVE_P2_get(c, "name", 1335) === "async") {
                    __HIVE_P2_syntaxRefusal(1336);
                }
                else if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1339), "ecmaVersion", 1338), 9, 1337)) {
                    (__HIVE_P2_temp1235_42 = e, __HIVE_P2_temp1235_43 = "await", __HIVE_P2_set(__HIVE_P2_temp1235_42, __HIVE_P2_temp1235_43, false, 1340));
                }
            }
            if (a && n) {
                __HIVE_P2_syntaxRefusal(1342);
            }
            (__HIVE_P2_temp1235_45 = this, __HIVE_P2_temp1235_46 = __HIVE_P2_get(__HIVE_P2_temp1235_45, "toAssignable", 1343), __HIVE_P2_invoke(__HIVE_P2_temp1235_46, __HIVE_P2_temp1235_45, (__HIVE_P2_reserveArray(3, 1343), __HIVE_P2_ownArray([c, false, h], 1343, "CONTROL_ARRAY")), 1343));
            (__HIVE_P2_temp1235_47 = this, __HIVE_P2_temp1235_48 = __HIVE_P2_get(__HIVE_P2_temp1235_47, "checkLValPattern", 1345), __HIVE_P2_invoke(__HIVE_P2_temp1235_48, __HIVE_P2_temp1235_47, (__HIVE_P2_reserveArray(1, 1345), __HIVE_P2_ownArray([c], 1345, "CONTROL_ARRAY")), 1345));
            return (__HIVE_P2_temp1235_49 = this, __HIVE_P2_temp1235_50 = __HIVE_P2_get(__HIVE_P2_temp1235_49, "parseForIn", 1347), __HIVE_P2_invoke(__HIVE_P2_temp1235_50, __HIVE_P2_temp1235_49, (__HIVE_P2_reserveArray(2, 1347), __HIVE_P2_ownArray([e, c], 1347, "CONTROL_ARRAY")), 1347));
        }
        else {
            (__HIVE_P2_temp1235_51 = this, __HIVE_P2_temp1235_52 = __HIVE_P2_get(__HIVE_P2_temp1235_51, "checkExpressionErrors", 1349), __HIVE_P2_invoke(__HIVE_P2_temp1235_52, __HIVE_P2_temp1235_51, (__HIVE_P2_reserveArray(2, 1349), __HIVE_P2_ownArray([h, true], 1349, "CONTROL_ARRAY")), 1349));
        }
        if (__HIVE_P2_binary(">", t, __HIVE_P2_unary("-", 1, 1352), 1351)) {
            __HIVE_P2_syntaxRefusal(1353);
        }
        return (__HIVE_P2_temp1235_53 = this, __HIVE_P2_temp1235_54 = __HIVE_P2_get(__HIVE_P2_temp1235_53, "parseFor", 1354), __HIVE_P2_invoke(__HIVE_P2_temp1235_54, __HIVE_P2_temp1235_53, (__HIVE_P2_reserveArray(2, 1354), __HIVE_P2_ownArray([e, c], 1354, "CONTROL_ARRAY")), 1354));
    }, 65, 1, 0, 1235)), 1233));
    (__HIVE_P2_temp0_1009 = $, __HIVE_P2_temp0_1010 = "parseFunctionStatement", __HIVE_P2_set(__HIVE_P2_temp0_1009, __HIVE_P2_temp0_1010, (__HIVE_P2_reserveFunction(1358), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp1358_0, __HIVE_P2_temp1358_1, __HIVE_P2_temp1358_2, __HIVE_P2_temp1358_3;
        (__HIVE_P2_temp1358_0 = this, __HIVE_P2_temp1358_1 = __HIVE_P2_get(__HIVE_P2_temp1358_0, "next", 1359), __HIVE_P2_invoke(__HIVE_P2_temp1358_1, __HIVE_P2_temp1358_0, (__HIVE_P2_reserveArray(0, 1359), __HIVE_P2_ownArray([], 1359, "CONTROL_ARRAY")), 1359));
        return (__HIVE_P2_temp1358_2 = this, __HIVE_P2_temp1358_3 = __HIVE_P2_get(__HIVE_P2_temp1358_2, "parseFunction", 1361), __HIVE_P2_invoke(__HIVE_P2_temp1358_3, __HIVE_P2_temp1358_2, (__HIVE_P2_reserveArray(4, 1361), __HIVE_P2_ownArray([e, __HIVE_P2_binary("|", ie, (i ? 0 : se), 1362), false, t], 1361, "CONTROL_ARRAY")), 1361));
    }, 4, 3, 0, 1358)), 1356));
    (__HIVE_P2_temp0_1012 = $, __HIVE_P2_temp0_1013 = "parseIfStatement", __HIVE_P2_set(__HIVE_P2_temp0_1012, __HIVE_P2_temp0_1013, (__HIVE_P2_reserveFunction(1366), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp1366_0, __HIVE_P2_temp1366_1, __HIVE_P2_temp1366_2, __HIVE_P2_temp1366_3, __HIVE_P2_temp1366_4, __HIVE_P2_temp1366_5, __HIVE_P2_temp1366_6, __HIVE_P2_temp1366_7, __HIVE_P2_temp1366_8, __HIVE_P2_temp1366_9, __HIVE_P2_temp1366_10, __HIVE_P2_temp1366_11, __HIVE_P2_temp1366_12, __HIVE_P2_temp1366_13, __HIVE_P2_temp1366_14, __HIVE_P2_temp1366_15, __HIVE_P2_temp1366_16, __HIVE_P2_temp1366_17, __HIVE_P2_temp1366_18, __HIVE_P2_temp1366_19, __HIVE_P2_temp1366_20;
        (__HIVE_P2_temp1366_0 = this, __HIVE_P2_temp1366_1 = __HIVE_P2_get(__HIVE_P2_temp1366_0, "next", 1367), __HIVE_P2_invoke(__HIVE_P2_temp1366_1, __HIVE_P2_temp1366_0, (__HIVE_P2_reserveArray(0, 1367), __HIVE_P2_ownArray([], 1367, "CONTROL_ARRAY")), 1367));
        (__HIVE_P2_temp1366_2 = e, __HIVE_P2_temp1366_3 = "test", __HIVE_P2_set(__HIVE_P2_temp1366_2, __HIVE_P2_temp1366_3, (__HIVE_P2_temp1366_5 = this, __HIVE_P2_temp1366_6 = __HIVE_P2_get(__HIVE_P2_temp1366_5, "parseParenExpression", 1371), __HIVE_P2_invoke(__HIVE_P2_temp1366_6, __HIVE_P2_temp1366_5, (__HIVE_P2_reserveArray(0, 1371), __HIVE_P2_ownArray([], 1371, "CONTROL_ARRAY")), 1371)), 1369));
        (__HIVE_P2_temp1366_7 = e, __HIVE_P2_temp1366_8 = "consequent", __HIVE_P2_set(__HIVE_P2_temp1366_7, __HIVE_P2_temp1366_8, (__HIVE_P2_temp1366_10 = this, __HIVE_P2_temp1366_11 = __HIVE_P2_get(__HIVE_P2_temp1366_10, "parseStatement", 1375), __HIVE_P2_invoke(__HIVE_P2_temp1366_11, __HIVE_P2_temp1366_10, (__HIVE_P2_reserveArray(1, 1375), __HIVE_P2_ownArray(["if"], 1375, "CONTROL_ARRAY")), 1375)), 1373));
        (__HIVE_P2_temp1366_12 = e, __HIVE_P2_temp1366_13 = "alternate", __HIVE_P2_set(__HIVE_P2_temp1366_12, __HIVE_P2_temp1366_13, (__HIVE_P2_temp1366_15 = this, __HIVE_P2_temp1366_16 = __HIVE_P2_get(__HIVE_P2_temp1366_15, "eat", 1379), __HIVE_P2_invoke(__HIVE_P2_temp1366_16, __HIVE_P2_temp1366_15, (__HIVE_P2_reserveArray(1, 1379), __HIVE_P2_ownArray([__HIVE_P2_get(m, "_else", 1380)], 1379, "CONTROL_ARRAY")), 1379)) ? (__HIVE_P2_temp1366_17 = this, __HIVE_P2_temp1366_18 = __HIVE_P2_get(__HIVE_P2_temp1366_17, "parseStatement", 1382), __HIVE_P2_invoke(__HIVE_P2_temp1366_18, __HIVE_P2_temp1366_17, (__HIVE_P2_reserveArray(1, 1382), __HIVE_P2_ownArray(["if"], 1382, "CONTROL_ARRAY")), 1382)) : null, 1377));
        return (__HIVE_P2_temp1366_19 = this, __HIVE_P2_temp1366_20 = __HIVE_P2_get(__HIVE_P2_temp1366_19, "finishNode", 1384), __HIVE_P2_invoke(__HIVE_P2_temp1366_20, __HIVE_P2_temp1366_19, (__HIVE_P2_reserveArray(2, 1384), __HIVE_P2_ownArray([e, "IfStatement"], 1384, "CONTROL_ARRAY")), 1384));
    }, 21, 1, 0, 1366)), 1364));
    (__HIVE_P2_temp0_1015 = $, __HIVE_P2_temp0_1016 = "parseReturnStatement", __HIVE_P2_set(__HIVE_P2_temp0_1015, __HIVE_P2_temp0_1016, (__HIVE_P2_reserveFunction(1388), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp1388_0, __HIVE_P2_temp1388_1, __HIVE_P2_temp1388_2, __HIVE_P2_temp1388_3, __HIVE_P2_temp1388_4, __HIVE_P2_temp1388_5, __HIVE_P2_temp1388_6, __HIVE_P2_temp1388_7, __HIVE_P2_temp1388_8, __HIVE_P2_temp1388_9, __HIVE_P2_temp1388_10, __HIVE_P2_temp1388_11, __HIVE_P2_temp1388_12, __HIVE_P2_temp1388_13, __HIVE_P2_temp1388_14, __HIVE_P2_temp1388_15, __HIVE_P2_temp1388_16, __HIVE_P2_temp1388_17;
        if (!__HIVE_P2_get(this, "inFunction", 1389) && !__HIVE_P2_get(__HIVE_P2_get(this, "options", 1391), "allowReturnOutsideFunction", 1390)) {
            __HIVE_P2_syntaxRefusal(1392);
        }
        (__HIVE_P2_temp1388_0 = this, __HIVE_P2_temp1388_1 = __HIVE_P2_get(__HIVE_P2_temp1388_0, "next", 1393), __HIVE_P2_invoke(__HIVE_P2_temp1388_1, __HIVE_P2_temp1388_0, (__HIVE_P2_reserveArray(0, 1393), __HIVE_P2_ownArray([], 1393, "CONTROL_ARRAY")), 1393));
        if ((__HIVE_P2_temp1388_2 = this, __HIVE_P2_temp1388_3 = __HIVE_P2_get(__HIVE_P2_temp1388_2, "eat", 1395), __HIVE_P2_invoke(__HIVE_P2_temp1388_3, __HIVE_P2_temp1388_2, (__HIVE_P2_reserveArray(1, 1395), __HIVE_P2_ownArray([__HIVE_P2_get(m, "semi", 1396)], 1395, "CONTROL_ARRAY")), 1395)) || (__HIVE_P2_temp1388_4 = this, __HIVE_P2_temp1388_5 = __HIVE_P2_get(__HIVE_P2_temp1388_4, "insertSemicolon", 1398), __HIVE_P2_invoke(__HIVE_P2_temp1388_5, __HIVE_P2_temp1388_4, (__HIVE_P2_reserveArray(0, 1398), __HIVE_P2_ownArray([], 1398, "CONTROL_ARRAY")), 1398))) {
            (__HIVE_P2_temp1388_6 = e, __HIVE_P2_temp1388_7 = "argument", __HIVE_P2_set(__HIVE_P2_temp1388_6, __HIVE_P2_temp1388_7, null, 1400));
        }
        else {
            (__HIVE_P2_temp1388_9 = e, __HIVE_P2_temp1388_10 = "argument", __HIVE_P2_set(__HIVE_P2_temp1388_9, __HIVE_P2_temp1388_10, (__HIVE_P2_temp1388_12 = this, __HIVE_P2_temp1388_13 = __HIVE_P2_get(__HIVE_P2_temp1388_12, "parseExpression", 1404), __HIVE_P2_invoke(__HIVE_P2_temp1388_13, __HIVE_P2_temp1388_12, (__HIVE_P2_reserveArray(0, 1404), __HIVE_P2_ownArray([], 1404, "CONTROL_ARRAY")), 1404)), 1402));
            (__HIVE_P2_temp1388_14 = this, __HIVE_P2_temp1388_15 = __HIVE_P2_get(__HIVE_P2_temp1388_14, "semicolon", 1406), __HIVE_P2_invoke(__HIVE_P2_temp1388_15, __HIVE_P2_temp1388_14, (__HIVE_P2_reserveArray(0, 1406), __HIVE_P2_ownArray([], 1406, "CONTROL_ARRAY")), 1406));
        }
        return (__HIVE_P2_temp1388_16 = this, __HIVE_P2_temp1388_17 = __HIVE_P2_get(__HIVE_P2_temp1388_16, "finishNode", 1408), __HIVE_P2_invoke(__HIVE_P2_temp1388_17, __HIVE_P2_temp1388_16, (__HIVE_P2_reserveArray(2, 1408), __HIVE_P2_ownArray([e, "ReturnStatement"], 1408, "CONTROL_ARRAY")), 1408));
    }, 18, 1, 0, 1388)), 1386));
    (__HIVE_P2_temp0_1018 = $, __HIVE_P2_temp0_1019 = "parseSwitchStatement", __HIVE_P2_set(__HIVE_P2_temp0_1018, __HIVE_P2_temp0_1019, (__HIVE_P2_reserveFunction(1412), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp1412_0, __HIVE_P2_temp1412_1, __HIVE_P2_temp1412_2, __HIVE_P2_temp1412_3, __HIVE_P2_temp1412_4, __HIVE_P2_temp1412_5, __HIVE_P2_temp1412_6, __HIVE_P2_temp1412_7, __HIVE_P2_temp1412_8, __HIVE_P2_temp1412_9, __HIVE_P2_temp1412_10, __HIVE_P2_temp1412_11, __HIVE_P2_temp1412_12, __HIVE_P2_temp1412_13, __HIVE_P2_temp1412_14, __HIVE_P2_temp1412_15, __HIVE_P2_temp1412_16, __HIVE_P2_temp1412_17, __HIVE_P2_temp1412_18, __HIVE_P2_temp1412_19, __HIVE_P2_temp1412_20, __HIVE_P2_temp1412_21, __HIVE_P2_temp1412_22, __HIVE_P2_temp1412_23, __HIVE_P2_temp1412_24, __HIVE_P2_temp1412_25, __HIVE_P2_temp1412_26, __HIVE_P2_temp1412_27, __HIVE_P2_temp1412_28, __HIVE_P2_temp1412_29, __HIVE_P2_temp1412_30, __HIVE_P2_temp1412_31, __HIVE_P2_temp1412_32, __HIVE_P2_temp1412_33, __HIVE_P2_temp1412_34, __HIVE_P2_temp1412_35, __HIVE_P2_temp1412_36, __HIVE_P2_temp1412_37, __HIVE_P2_temp1412_38, __HIVE_P2_temp1412_39, __HIVE_P2_temp1412_40, __HIVE_P2_temp1412_41, __HIVE_P2_temp1412_42, __HIVE_P2_temp1412_43, __HIVE_P2_temp1412_44, __HIVE_P2_temp1412_45, __HIVE_P2_temp1412_46, __HIVE_P2_temp1412_47, __HIVE_P2_temp1412_48, __HIVE_P2_temp1412_49, __HIVE_P2_temp1412_50, __HIVE_P2_temp1412_51, __HIVE_P2_temp1412_52;
        (__HIVE_P2_temp1412_0 = this, __HIVE_P2_temp1412_1 = __HIVE_P2_get(__HIVE_P2_temp1412_0, "next", 1413), __HIVE_P2_invoke(__HIVE_P2_temp1412_1, __HIVE_P2_temp1412_0, (__HIVE_P2_reserveArray(0, 1413), __HIVE_P2_ownArray([], 1413, "CONTROL_ARRAY")), 1413));
        (__HIVE_P2_temp1412_2 = e, __HIVE_P2_temp1412_3 = "discriminant", __HIVE_P2_set(__HIVE_P2_temp1412_2, __HIVE_P2_temp1412_3, (__HIVE_P2_temp1412_5 = this, __HIVE_P2_temp1412_6 = __HIVE_P2_get(__HIVE_P2_temp1412_5, "parseParenExpression", 1417), __HIVE_P2_invoke(__HIVE_P2_temp1412_6, __HIVE_P2_temp1412_5, (__HIVE_P2_reserveArray(0, 1417), __HIVE_P2_ownArray([], 1417, "CONTROL_ARRAY")), 1417)), 1415));
        (__HIVE_P2_temp1412_7 = e, __HIVE_P2_temp1412_8 = "cases", __HIVE_P2_set(__HIVE_P2_temp1412_7, __HIVE_P2_temp1412_8, (__HIVE_P2_temp1412_10 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp1412_10, 1421), __HIVE_P2_reserveArray(0, 1421, 0), __HIVE_P2_ownArray([], 1421, "ARRAY", __HIVE_P2_temp1412_10)), 1419));
        (__HIVE_P2_temp1412_11 = this, __HIVE_P2_temp1412_12 = __HIVE_P2_get(__HIVE_P2_temp1412_11, "expect", 1422), __HIVE_P2_invoke(__HIVE_P2_temp1412_12, __HIVE_P2_temp1412_11, (__HIVE_P2_reserveArray(1, 1422), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceL", 1423)], 1422, "CONTROL_ARRAY")), 1422));
        (__HIVE_P2_temp1412_13 = __HIVE_P2_get(this, "labels", 1427), __HIVE_P2_temp1412_14 = __HIVE_P2_get(__HIVE_P2_temp1412_13, "push", 1425), __HIVE_P2_invoke(__HIVE_P2_temp1412_14, __HIVE_P2_temp1412_13, (__HIVE_P2_reserveArray(1, 1425), __HIVE_P2_ownArray([ee], 1425, "CONTROL_ARRAY")), 1425));
        (__HIVE_P2_temp1412_15 = this, __HIVE_P2_temp1412_16 = __HIVE_P2_get(__HIVE_P2_temp1412_15, "enterScope", 1428), __HIVE_P2_invoke(__HIVE_P2_temp1412_16, __HIVE_P2_temp1412_15, (__HIVE_P2_reserveArray(1, 1428), __HIVE_P2_ownArray([0], 1428, "CONTROL_ARRAY")), 1428));
        var t;
        for (var i = false; __HIVE_P2_get(this, "type", 1431) !== __HIVE_P2_get(m, "braceR", 1432);) {
            __HIVE_P2_tick(1430);
            if (__HIVE_P2_get(this, "type", 1433) === __HIVE_P2_get(m, "_case", 1434) || __HIVE_P2_get(this, "type", 1435) === __HIVE_P2_get(m, "_default", 1436)) {
                var s = __HIVE_P2_get(this, "type", 1437) === __HIVE_P2_get(m, "_case", 1438);
                if (t) {
                    (__HIVE_P2_temp1412_17 = this, __HIVE_P2_temp1412_18 = __HIVE_P2_get(__HIVE_P2_temp1412_17, "finishNode", 1439), __HIVE_P2_invoke(__HIVE_P2_temp1412_18, __HIVE_P2_temp1412_17, (__HIVE_P2_reserveArray(2, 1439), __HIVE_P2_ownArray([t, "SwitchCase"], 1439, "CONTROL_ARRAY")), 1439));
                }
                (__HIVE_P2_temp1412_21 = __HIVE_P2_get(e, "cases", 1446), __HIVE_P2_temp1412_22 = __HIVE_P2_get(__HIVE_P2_temp1412_21, "push", 1441), __HIVE_P2_invoke(__HIVE_P2_temp1412_22, __HIVE_P2_temp1412_21, (__HIVE_P2_reserveArray(1, 1441), __HIVE_P2_ownArray([t = (__HIVE_P2_temp1412_19 = this, __HIVE_P2_temp1412_20 = __HIVE_P2_get(__HIVE_P2_temp1412_19, "startNode", 1443), __HIVE_P2_invoke(__HIVE_P2_temp1412_20, __HIVE_P2_temp1412_19, (__HIVE_P2_reserveArray(0, 1443), __HIVE_P2_ownArray([], 1443, "CONTROL_ARRAY")), 1443))], 1441, "CONTROL_ARRAY")), 1441));
                (__HIVE_P2_temp1412_23 = t, __HIVE_P2_temp1412_24 = "consequent", __HIVE_P2_set(__HIVE_P2_temp1412_23, __HIVE_P2_temp1412_24, (__HIVE_P2_temp1412_26 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp1412_26, 1449), __HIVE_P2_reserveArray(0, 1449, 0), __HIVE_P2_ownArray([], 1449, "ARRAY", __HIVE_P2_temp1412_26)), 1447));
                (__HIVE_P2_temp1412_27 = this, __HIVE_P2_temp1412_28 = __HIVE_P2_get(__HIVE_P2_temp1412_27, "next", 1450), __HIVE_P2_invoke(__HIVE_P2_temp1412_28, __HIVE_P2_temp1412_27, (__HIVE_P2_reserveArray(0, 1450), __HIVE_P2_ownArray([], 1450, "CONTROL_ARRAY")), 1450));
                if (s) {
                    (__HIVE_P2_temp1412_29 = t, __HIVE_P2_temp1412_30 = "test", __HIVE_P2_set(__HIVE_P2_temp1412_29, __HIVE_P2_temp1412_30, (__HIVE_P2_temp1412_32 = this, __HIVE_P2_temp1412_33 = __HIVE_P2_get(__HIVE_P2_temp1412_32, "parseExpression", 1454), __HIVE_P2_invoke(__HIVE_P2_temp1412_33, __HIVE_P2_temp1412_32, (__HIVE_P2_reserveArray(0, 1454), __HIVE_P2_ownArray([], 1454, "CONTROL_ARRAY")), 1454)), 1452));
                }
                else {
                    if (i) {
                        __HIVE_P2_syntaxRefusal(1456);
                    }
                    i = true;
                    (__HIVE_P2_temp1412_34 = t, __HIVE_P2_temp1412_35 = "test", __HIVE_P2_set(__HIVE_P2_temp1412_34, __HIVE_P2_temp1412_35, null, 1458));
                }
                (__HIVE_P2_temp1412_37 = this, __HIVE_P2_temp1412_38 = __HIVE_P2_get(__HIVE_P2_temp1412_37, "expect", 1460), __HIVE_P2_invoke(__HIVE_P2_temp1412_38, __HIVE_P2_temp1412_37, (__HIVE_P2_reserveArray(1, 1460), __HIVE_P2_ownArray([__HIVE_P2_get(m, "colon", 1461)], 1460, "CONTROL_ARRAY")), 1460));
            }
            else {
                if (!t) {
                    __HIVE_P2_syntaxRefusal(1463);
                }
                (__HIVE_P2_temp1412_41 = __HIVE_P2_get(t, "consequent", 1468), __HIVE_P2_temp1412_42 = __HIVE_P2_get(__HIVE_P2_temp1412_41, "push", 1464), __HIVE_P2_invoke(__HIVE_P2_temp1412_42, __HIVE_P2_temp1412_41, (__HIVE_P2_reserveArray(1, 1464), __HIVE_P2_ownArray([(__HIVE_P2_temp1412_39 = this, __HIVE_P2_temp1412_40 = __HIVE_P2_get(__HIVE_P2_temp1412_39, "parseStatement", 1465), __HIVE_P2_invoke(__HIVE_P2_temp1412_40, __HIVE_P2_temp1412_39, (__HIVE_P2_reserveArray(1, 1465), __HIVE_P2_ownArray([null], 1465, "CONTROL_ARRAY")), 1465))], 1464, "CONTROL_ARRAY")), 1464));
            }
        }
        (__HIVE_P2_temp1412_43 = this, __HIVE_P2_temp1412_44 = __HIVE_P2_get(__HIVE_P2_temp1412_43, "exitScope", 1469), __HIVE_P2_invoke(__HIVE_P2_temp1412_44, __HIVE_P2_temp1412_43, (__HIVE_P2_reserveArray(0, 1469), __HIVE_P2_ownArray([], 1469, "CONTROL_ARRAY")), 1469));
        if (t) {
            (__HIVE_P2_temp1412_45 = this, __HIVE_P2_temp1412_46 = __HIVE_P2_get(__HIVE_P2_temp1412_45, "finishNode", 1471), __HIVE_P2_invoke(__HIVE_P2_temp1412_46, __HIVE_P2_temp1412_45, (__HIVE_P2_reserveArray(2, 1471), __HIVE_P2_ownArray([t, "SwitchCase"], 1471, "CONTROL_ARRAY")), 1471));
        }
        (__HIVE_P2_temp1412_47 = this, __HIVE_P2_temp1412_48 = __HIVE_P2_get(__HIVE_P2_temp1412_47, "next", 1473), __HIVE_P2_invoke(__HIVE_P2_temp1412_48, __HIVE_P2_temp1412_47, (__HIVE_P2_reserveArray(0, 1473), __HIVE_P2_ownArray([], 1473, "CONTROL_ARRAY")), 1473));
        (__HIVE_P2_temp1412_49 = __HIVE_P2_get(this, "labels", 1477), __HIVE_P2_temp1412_50 = __HIVE_P2_get(__HIVE_P2_temp1412_49, "pop", 1475), __HIVE_P2_invoke(__HIVE_P2_temp1412_50, __HIVE_P2_temp1412_49, (__HIVE_P2_reserveArray(0, 1475), __HIVE_P2_ownArray([], 1475, "CONTROL_ARRAY")), 1475));
        return (__HIVE_P2_temp1412_51 = this, __HIVE_P2_temp1412_52 = __HIVE_P2_get(__HIVE_P2_temp1412_51, "finishNode", 1478), __HIVE_P2_invoke(__HIVE_P2_temp1412_52, __HIVE_P2_temp1412_51, (__HIVE_P2_reserveArray(2, 1478), __HIVE_P2_ownArray([e, "SwitchStatement"], 1478, "CONTROL_ARRAY")), 1478));
    }, 56, 1, 0, 1412)), 1410));
    (__HIVE_P2_temp0_1021 = $, __HIVE_P2_temp0_1022 = "parseThrowStatement", __HIVE_P2_set(__HIVE_P2_temp0_1021, __HIVE_P2_temp0_1022, (__HIVE_P2_reserveFunction(1482), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp1482_0, __HIVE_P2_temp1482_1, __HIVE_P2_temp1482_2, __HIVE_P2_temp1482_3, __HIVE_P2_temp1482_4, __HIVE_P2_temp1482_5, __HIVE_P2_temp1482_6, __HIVE_P2_temp1482_7, __HIVE_P2_temp1482_8, __HIVE_P2_temp1482_9, __HIVE_P2_temp1482_10, __HIVE_P2_temp1482_11, __HIVE_P2_temp1482_12, __HIVE_P2_temp1482_13, __HIVE_P2_temp1482_14;
        (__HIVE_P2_temp1482_0 = this, __HIVE_P2_temp1482_1 = __HIVE_P2_get(__HIVE_P2_temp1482_0, "next", 1483), __HIVE_P2_invoke(__HIVE_P2_temp1482_1, __HIVE_P2_temp1482_0, (__HIVE_P2_reserveArray(0, 1483), __HIVE_P2_ownArray([], 1483, "CONTROL_ARRAY")), 1483));
        if ((__HIVE_P2_temp1482_4 = g, __HIVE_P2_temp1482_5 = __HIVE_P2_get(__HIVE_P2_temp1482_4, "test", 1485), __HIVE_P2_invoke(__HIVE_P2_temp1482_5, __HIVE_P2_temp1482_4, (__HIVE_P2_reserveArray(1, 1485), __HIVE_P2_ownArray([(__HIVE_P2_temp1482_2 = __HIVE_P2_get(this, "input", 1490), __HIVE_P2_temp1482_3 = __HIVE_P2_get(__HIVE_P2_temp1482_2, "slice", 1486), __HIVE_P2_invoke(__HIVE_P2_temp1482_3, __HIVE_P2_temp1482_2, (__HIVE_P2_reserveArray(2, 1486), __HIVE_P2_ownArray([__HIVE_P2_get(this, "lastTokEnd", 1487), __HIVE_P2_get(this, "start", 1488)], 1486, "CONTROL_ARRAY")), 1486))], 1485, "CONTROL_ARRAY")), 1485))) {
            __HIVE_P2_syntaxRefusal(1492);
        }
        (__HIVE_P2_temp1482_6 = e, __HIVE_P2_temp1482_7 = "argument", __HIVE_P2_set(__HIVE_P2_temp1482_6, __HIVE_P2_temp1482_7, (__HIVE_P2_temp1482_9 = this, __HIVE_P2_temp1482_10 = __HIVE_P2_get(__HIVE_P2_temp1482_9, "parseExpression", 1495), __HIVE_P2_invoke(__HIVE_P2_temp1482_10, __HIVE_P2_temp1482_9, (__HIVE_P2_reserveArray(0, 1495), __HIVE_P2_ownArray([], 1495, "CONTROL_ARRAY")), 1495)), 1493));
        (__HIVE_P2_temp1482_11 = this, __HIVE_P2_temp1482_12 = __HIVE_P2_get(__HIVE_P2_temp1482_11, "semicolon", 1497), __HIVE_P2_invoke(__HIVE_P2_temp1482_12, __HIVE_P2_temp1482_11, (__HIVE_P2_reserveArray(0, 1497), __HIVE_P2_ownArray([], 1497, "CONTROL_ARRAY")), 1497));
        return (__HIVE_P2_temp1482_13 = this, __HIVE_P2_temp1482_14 = __HIVE_P2_get(__HIVE_P2_temp1482_13, "finishNode", 1499), __HIVE_P2_invoke(__HIVE_P2_temp1482_14, __HIVE_P2_temp1482_13, (__HIVE_P2_reserveArray(2, 1499), __HIVE_P2_ownArray([e, "ThrowStatement"], 1499, "CONTROL_ARRAY")), 1499));
    }, 15, 1, 0, 1482)), 1480));
    var te = (__HIVE_P2_temp0_1024 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp0_1024, 1501), __HIVE_P2_reserveArray(0, 1501, 0), __HIVE_P2_ownArray([], 1501, "ARRAY", __HIVE_P2_temp0_1024));
    (__HIVE_P2_temp0_1025 = $, __HIVE_P2_temp0_1026 = "parseCatchClauseParam", __HIVE_P2_set(__HIVE_P2_temp0_1025, __HIVE_P2_temp0_1026, (__HIVE_P2_reserveFunction(1504), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp1504_0, __HIVE_P2_temp1504_1, __HIVE_P2_temp1504_2, __HIVE_P2_temp1504_3, __HIVE_P2_temp1504_4, __HIVE_P2_temp1504_5, __HIVE_P2_temp1504_6, __HIVE_P2_temp1504_7;
        var e = (__HIVE_P2_temp1504_0 = this, __HIVE_P2_temp1504_1 = __HIVE_P2_get(__HIVE_P2_temp1504_0, "parseBindingAtom", 1505), __HIVE_P2_invoke(__HIVE_P2_temp1504_1, __HIVE_P2_temp1504_0, (__HIVE_P2_reserveArray(0, 1505), __HIVE_P2_ownArray([], 1505, "CONTROL_ARRAY")), 1505));
        var t = __HIVE_P2_get(e, "type", 1507) === "Identifier";
        (__HIVE_P2_temp1504_2 = this, __HIVE_P2_temp1504_3 = __HIVE_P2_get(__HIVE_P2_temp1504_2, "enterScope", 1508), __HIVE_P2_invoke(__HIVE_P2_temp1504_3, __HIVE_P2_temp1504_2, (__HIVE_P2_reserveArray(1, 1508), __HIVE_P2_ownArray([t ? O : 0], 1508, "CONTROL_ARRAY")), 1508));
        (__HIVE_P2_temp1504_4 = this, __HIVE_P2_temp1504_5 = __HIVE_P2_get(__HIVE_P2_temp1504_4, "checkLValPattern", 1510), __HIVE_P2_invoke(__HIVE_P2_temp1504_5, __HIVE_P2_temp1504_4, (__HIVE_P2_reserveArray(2, 1510), __HIVE_P2_ownArray([e, t ? W : G], 1510, "CONTROL_ARRAY")), 1510));
        (__HIVE_P2_temp1504_6 = this, __HIVE_P2_temp1504_7 = __HIVE_P2_get(__HIVE_P2_temp1504_6, "expect", 1512), __HIVE_P2_invoke(__HIVE_P2_temp1504_7, __HIVE_P2_temp1504_6, (__HIVE_P2_reserveArray(1, 1512), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 1513)], 1512, "CONTROL_ARRAY")), 1512));
        return e;
    }, 10, 0, 0, 1504)), 1502));
    (__HIVE_P2_temp0_1028 = $, __HIVE_P2_temp0_1029 = "parseTryStatement", __HIVE_P2_set(__HIVE_P2_temp0_1028, __HIVE_P2_temp0_1029, (__HIVE_P2_reserveFunction(1517), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp1517_0, __HIVE_P2_temp1517_1, __HIVE_P2_temp1517_2, __HIVE_P2_temp1517_3, __HIVE_P2_temp1517_4, __HIVE_P2_temp1517_5, __HIVE_P2_temp1517_6, __HIVE_P2_temp1517_7, __HIVE_P2_temp1517_8, __HIVE_P2_temp1517_9, __HIVE_P2_temp1517_10, __HIVE_P2_temp1517_11, __HIVE_P2_temp1517_12, __HIVE_P2_temp1517_13, __HIVE_P2_temp1517_14, __HIVE_P2_temp1517_15, __HIVE_P2_temp1517_16, __HIVE_P2_temp1517_17, __HIVE_P2_temp1517_18, __HIVE_P2_temp1517_19, __HIVE_P2_temp1517_20, __HIVE_P2_temp1517_21, __HIVE_P2_temp1517_22, __HIVE_P2_temp1517_23, __HIVE_P2_temp1517_24, __HIVE_P2_temp1517_25, __HIVE_P2_temp1517_26, __HIVE_P2_temp1517_27, __HIVE_P2_temp1517_28, __HIVE_P2_temp1517_29, __HIVE_P2_temp1517_30, __HIVE_P2_temp1517_31, __HIVE_P2_temp1517_32, __HIVE_P2_temp1517_33, __HIVE_P2_temp1517_34, __HIVE_P2_temp1517_35, __HIVE_P2_temp1517_36, __HIVE_P2_temp1517_37, __HIVE_P2_temp1517_38, __HIVE_P2_temp1517_39, __HIVE_P2_temp1517_40, __HIVE_P2_temp1517_41, __HIVE_P2_temp1517_42, __HIVE_P2_temp1517_43, __HIVE_P2_temp1517_44, __HIVE_P2_temp1517_45, __HIVE_P2_temp1517_46;
        (__HIVE_P2_temp1517_0 = this, __HIVE_P2_temp1517_1 = __HIVE_P2_get(__HIVE_P2_temp1517_0, "next", 1518), __HIVE_P2_invoke(__HIVE_P2_temp1517_1, __HIVE_P2_temp1517_0, (__HIVE_P2_reserveArray(0, 1518), __HIVE_P2_ownArray([], 1518, "CONTROL_ARRAY")), 1518));
        (__HIVE_P2_temp1517_2 = e, __HIVE_P2_temp1517_3 = "block", __HIVE_P2_set(__HIVE_P2_temp1517_2, __HIVE_P2_temp1517_3, (__HIVE_P2_temp1517_5 = this, __HIVE_P2_temp1517_6 = __HIVE_P2_get(__HIVE_P2_temp1517_5, "parseBlock", 1522), __HIVE_P2_invoke(__HIVE_P2_temp1517_6, __HIVE_P2_temp1517_5, (__HIVE_P2_reserveArray(0, 1522), __HIVE_P2_ownArray([], 1522, "CONTROL_ARRAY")), 1522)), 1520));
        (__HIVE_P2_temp1517_7 = e, __HIVE_P2_temp1517_8 = "handler", __HIVE_P2_set(__HIVE_P2_temp1517_7, __HIVE_P2_temp1517_8, null, 1524));
        if (__HIVE_P2_get(this, "type", 1526) === __HIVE_P2_get(m, "_catch", 1527)) {
            var t = (__HIVE_P2_temp1517_10 = this, __HIVE_P2_temp1517_11 = __HIVE_P2_get(__HIVE_P2_temp1517_10, "startNode", 1528), __HIVE_P2_invoke(__HIVE_P2_temp1517_11, __HIVE_P2_temp1517_10, (__HIVE_P2_reserveArray(0, 1528), __HIVE_P2_ownArray([], 1528, "CONTROL_ARRAY")), 1528));
            (__HIVE_P2_temp1517_12 = this, __HIVE_P2_temp1517_13 = __HIVE_P2_get(__HIVE_P2_temp1517_12, "next", 1530), __HIVE_P2_invoke(__HIVE_P2_temp1517_13, __HIVE_P2_temp1517_12, (__HIVE_P2_reserveArray(0, 1530), __HIVE_P2_ownArray([], 1530, "CONTROL_ARRAY")), 1530));
            if ((__HIVE_P2_temp1517_14 = this, __HIVE_P2_temp1517_15 = __HIVE_P2_get(__HIVE_P2_temp1517_14, "eat", 1532), __HIVE_P2_invoke(__HIVE_P2_temp1517_15, __HIVE_P2_temp1517_14, (__HIVE_P2_reserveArray(1, 1532), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenL", 1533)], 1532, "CONTROL_ARRAY")), 1532))) {
                (__HIVE_P2_temp1517_16 = t, __HIVE_P2_temp1517_17 = "param", __HIVE_P2_set(__HIVE_P2_temp1517_16, __HIVE_P2_temp1517_17, (__HIVE_P2_temp1517_19 = this, __HIVE_P2_temp1517_20 = __HIVE_P2_get(__HIVE_P2_temp1517_19, "parseCatchClauseParam", 1537), __HIVE_P2_invoke(__HIVE_P2_temp1517_20, __HIVE_P2_temp1517_19, (__HIVE_P2_reserveArray(0, 1537), __HIVE_P2_ownArray([], 1537, "CONTROL_ARRAY")), 1537)), 1535));
            }
            else {
                if (__HIVE_P2_binary("<", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1541), "ecmaVersion", 1540), 10, 1539)) {
                    __HIVE_P2_syntaxRefusal(1542);
                }
                (__HIVE_P2_temp1517_21 = t, __HIVE_P2_temp1517_22 = "param", __HIVE_P2_set(__HIVE_P2_temp1517_21, __HIVE_P2_temp1517_22, null, 1543));
                (__HIVE_P2_temp1517_24 = this, __HIVE_P2_temp1517_25 = __HIVE_P2_get(__HIVE_P2_temp1517_24, "enterScope", 1545), __HIVE_P2_invoke(__HIVE_P2_temp1517_25, __HIVE_P2_temp1517_24, (__HIVE_P2_reserveArray(1, 1545), __HIVE_P2_ownArray([0], 1545, "CONTROL_ARRAY")), 1545));
            }
            (__HIVE_P2_temp1517_26 = t, __HIVE_P2_temp1517_27 = "body", __HIVE_P2_set(__HIVE_P2_temp1517_26, __HIVE_P2_temp1517_27, (__HIVE_P2_temp1517_29 = this, __HIVE_P2_temp1517_30 = __HIVE_P2_get(__HIVE_P2_temp1517_29, "parseBlock", 1549), __HIVE_P2_invoke(__HIVE_P2_temp1517_30, __HIVE_P2_temp1517_29, (__HIVE_P2_reserveArray(1, 1549), __HIVE_P2_ownArray([false], 1549, "CONTROL_ARRAY")), 1549)), 1547));
            (__HIVE_P2_temp1517_31 = this, __HIVE_P2_temp1517_32 = __HIVE_P2_get(__HIVE_P2_temp1517_31, "exitScope", 1551), __HIVE_P2_invoke(__HIVE_P2_temp1517_32, __HIVE_P2_temp1517_31, (__HIVE_P2_reserveArray(0, 1551), __HIVE_P2_ownArray([], 1551, "CONTROL_ARRAY")), 1551));
            (__HIVE_P2_temp1517_33 = e, __HIVE_P2_temp1517_34 = "handler", __HIVE_P2_set(__HIVE_P2_temp1517_33, __HIVE_P2_temp1517_34, (__HIVE_P2_temp1517_36 = this, __HIVE_P2_temp1517_37 = __HIVE_P2_get(__HIVE_P2_temp1517_36, "finishNode", 1555), __HIVE_P2_invoke(__HIVE_P2_temp1517_37, __HIVE_P2_temp1517_36, (__HIVE_P2_reserveArray(2, 1555), __HIVE_P2_ownArray([t, "CatchClause"], 1555, "CONTROL_ARRAY")), 1555)), 1553));
        }
        (__HIVE_P2_temp1517_38 = e, __HIVE_P2_temp1517_39 = "finalizer", __HIVE_P2_set(__HIVE_P2_temp1517_38, __HIVE_P2_temp1517_39, (__HIVE_P2_temp1517_41 = this, __HIVE_P2_temp1517_42 = __HIVE_P2_get(__HIVE_P2_temp1517_41, "eat", 1559), __HIVE_P2_invoke(__HIVE_P2_temp1517_42, __HIVE_P2_temp1517_41, (__HIVE_P2_reserveArray(1, 1559), __HIVE_P2_ownArray([__HIVE_P2_get(m, "_finally", 1560)], 1559, "CONTROL_ARRAY")), 1559)) ? (__HIVE_P2_temp1517_43 = this, __HIVE_P2_temp1517_44 = __HIVE_P2_get(__HIVE_P2_temp1517_43, "parseBlock", 1562), __HIVE_P2_invoke(__HIVE_P2_temp1517_44, __HIVE_P2_temp1517_43, (__HIVE_P2_reserveArray(0, 1562), __HIVE_P2_ownArray([], 1562, "CONTROL_ARRAY")), 1562)) : null, 1557));
        if (!__HIVE_P2_get(e, "handler", 1564) && !__HIVE_P2_get(e, "finalizer", 1565)) {
            __HIVE_P2_syntaxRefusal(1566);
        }
        return (__HIVE_P2_temp1517_45 = this, __HIVE_P2_temp1517_46 = __HIVE_P2_get(__HIVE_P2_temp1517_45, "finishNode", 1567), __HIVE_P2_invoke(__HIVE_P2_temp1517_46, __HIVE_P2_temp1517_45, (__HIVE_P2_reserveArray(2, 1567), __HIVE_P2_ownArray([e, "TryStatement"], 1567, "CONTROL_ARRAY")), 1567));
    }, 48, 1, 0, 1517)), 1515));
    (__HIVE_P2_temp0_1031 = $, __HIVE_P2_temp0_1032 = "parseVarStatement", __HIVE_P2_set(__HIVE_P2_temp0_1031, __HIVE_P2_temp0_1032, (__HIVE_P2_reserveFunction(1571), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp1571_0, __HIVE_P2_temp1571_1, __HIVE_P2_temp1571_2, __HIVE_P2_temp1571_3, __HIVE_P2_temp1571_4, __HIVE_P2_temp1571_5, __HIVE_P2_temp1571_6, __HIVE_P2_temp1571_7;
        (__HIVE_P2_temp1571_0 = this, __HIVE_P2_temp1571_1 = __HIVE_P2_get(__HIVE_P2_temp1571_0, "next", 1572), __HIVE_P2_invoke(__HIVE_P2_temp1571_1, __HIVE_P2_temp1571_0, (__HIVE_P2_reserveArray(0, 1572), __HIVE_P2_ownArray([], 1572, "CONTROL_ARRAY")), 1572));
        (__HIVE_P2_temp1571_2 = this, __HIVE_P2_temp1571_3 = __HIVE_P2_get(__HIVE_P2_temp1571_2, "parseVar", 1574), __HIVE_P2_invoke(__HIVE_P2_temp1571_3, __HIVE_P2_temp1571_2, (__HIVE_P2_reserveArray(4, 1574), __HIVE_P2_ownArray([e, false, t, i], 1574, "CONTROL_ARRAY")), 1574));
        (__HIVE_P2_temp1571_4 = this, __HIVE_P2_temp1571_5 = __HIVE_P2_get(__HIVE_P2_temp1571_4, "semicolon", 1576), __HIVE_P2_invoke(__HIVE_P2_temp1571_5, __HIVE_P2_temp1571_4, (__HIVE_P2_reserveArray(0, 1576), __HIVE_P2_ownArray([], 1576, "CONTROL_ARRAY")), 1576));
        return (__HIVE_P2_temp1571_6 = this, __HIVE_P2_temp1571_7 = __HIVE_P2_get(__HIVE_P2_temp1571_6, "finishNode", 1578), __HIVE_P2_invoke(__HIVE_P2_temp1571_7, __HIVE_P2_temp1571_6, (__HIVE_P2_reserveArray(2, 1578), __HIVE_P2_ownArray([e, "VariableDeclaration"], 1578, "CONTROL_ARRAY")), 1578));
    }, 8, 3, 0, 1571)), 1569));
    (__HIVE_P2_temp0_1034 = $, __HIVE_P2_temp0_1035 = "parseWhileStatement", __HIVE_P2_set(__HIVE_P2_temp0_1034, __HIVE_P2_temp0_1035, (__HIVE_P2_reserveFunction(1582), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp1582_0, __HIVE_P2_temp1582_1, __HIVE_P2_temp1582_2, __HIVE_P2_temp1582_3, __HIVE_P2_temp1582_4, __HIVE_P2_temp1582_5, __HIVE_P2_temp1582_6, __HIVE_P2_temp1582_7, __HIVE_P2_temp1582_8, __HIVE_P2_temp1582_9, __HIVE_P2_temp1582_10, __HIVE_P2_temp1582_11, __HIVE_P2_temp1582_12, __HIVE_P2_temp1582_13, __HIVE_P2_temp1582_14, __HIVE_P2_temp1582_15, __HIVE_P2_temp1582_16, __HIVE_P2_temp1582_17;
        (__HIVE_P2_temp1582_0 = this, __HIVE_P2_temp1582_1 = __HIVE_P2_get(__HIVE_P2_temp1582_0, "next", 1583), __HIVE_P2_invoke(__HIVE_P2_temp1582_1, __HIVE_P2_temp1582_0, (__HIVE_P2_reserveArray(0, 1583), __HIVE_P2_ownArray([], 1583, "CONTROL_ARRAY")), 1583));
        (__HIVE_P2_temp1582_2 = e, __HIVE_P2_temp1582_3 = "test", __HIVE_P2_set(__HIVE_P2_temp1582_2, __HIVE_P2_temp1582_3, (__HIVE_P2_temp1582_5 = this, __HIVE_P2_temp1582_6 = __HIVE_P2_get(__HIVE_P2_temp1582_5, "parseParenExpression", 1587), __HIVE_P2_invoke(__HIVE_P2_temp1582_6, __HIVE_P2_temp1582_5, (__HIVE_P2_reserveArray(0, 1587), __HIVE_P2_ownArray([], 1587, "CONTROL_ARRAY")), 1587)), 1585));
        (__HIVE_P2_temp1582_7 = __HIVE_P2_get(this, "labels", 1591), __HIVE_P2_temp1582_8 = __HIVE_P2_get(__HIVE_P2_temp1582_7, "push", 1589), __HIVE_P2_invoke(__HIVE_P2_temp1582_8, __HIVE_P2_temp1582_7, (__HIVE_P2_reserveArray(1, 1589), __HIVE_P2_ownArray([J], 1589, "CONTROL_ARRAY")), 1589));
        (__HIVE_P2_temp1582_9 = e, __HIVE_P2_temp1582_10 = "body", __HIVE_P2_set(__HIVE_P2_temp1582_9, __HIVE_P2_temp1582_10, (__HIVE_P2_temp1582_12 = this, __HIVE_P2_temp1582_13 = __HIVE_P2_get(__HIVE_P2_temp1582_12, "parseStatement", 1594), __HIVE_P2_invoke(__HIVE_P2_temp1582_13, __HIVE_P2_temp1582_12, (__HIVE_P2_reserveArray(1, 1594), __HIVE_P2_ownArray(["while"], 1594, "CONTROL_ARRAY")), 1594)), 1592));
        (__HIVE_P2_temp1582_14 = __HIVE_P2_get(this, "labels", 1598), __HIVE_P2_temp1582_15 = __HIVE_P2_get(__HIVE_P2_temp1582_14, "pop", 1596), __HIVE_P2_invoke(__HIVE_P2_temp1582_15, __HIVE_P2_temp1582_14, (__HIVE_P2_reserveArray(0, 1596), __HIVE_P2_ownArray([], 1596, "CONTROL_ARRAY")), 1596));
        return (__HIVE_P2_temp1582_16 = this, __HIVE_P2_temp1582_17 = __HIVE_P2_get(__HIVE_P2_temp1582_16, "finishNode", 1599), __HIVE_P2_invoke(__HIVE_P2_temp1582_17, __HIVE_P2_temp1582_16, (__HIVE_P2_reserveArray(2, 1599), __HIVE_P2_ownArray([e, "WhileStatement"], 1599, "CONTROL_ARRAY")), 1599));
    }, 18, 1, 0, 1582)), 1580));
    (__HIVE_P2_temp0_1037 = $, __HIVE_P2_temp0_1038 = "parseWithStatement", __HIVE_P2_set(__HIVE_P2_temp0_1037, __HIVE_P2_temp0_1038, (__HIVE_P2_reserveFunction(1603), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp1603_0, __HIVE_P2_temp1603_1, __HIVE_P2_temp1603_2, __HIVE_P2_temp1603_3, __HIVE_P2_temp1603_4, __HIVE_P2_temp1603_5, __HIVE_P2_temp1603_6, __HIVE_P2_temp1603_7, __HIVE_P2_temp1603_8, __HIVE_P2_temp1603_9, __HIVE_P2_temp1603_10, __HIVE_P2_temp1603_11, __HIVE_P2_temp1603_12, __HIVE_P2_temp1603_13;
        if (__HIVE_P2_get(this, "strict", 1604)) {
            __HIVE_P2_syntaxRefusal(1605);
        }
        (__HIVE_P2_temp1603_0 = this, __HIVE_P2_temp1603_1 = __HIVE_P2_get(__HIVE_P2_temp1603_0, "next", 1606), __HIVE_P2_invoke(__HIVE_P2_temp1603_1, __HIVE_P2_temp1603_0, (__HIVE_P2_reserveArray(0, 1606), __HIVE_P2_ownArray([], 1606, "CONTROL_ARRAY")), 1606));
        (__HIVE_P2_temp1603_2 = e, __HIVE_P2_temp1603_3 = "object", __HIVE_P2_set(__HIVE_P2_temp1603_2, __HIVE_P2_temp1603_3, (__HIVE_P2_temp1603_5 = this, __HIVE_P2_temp1603_6 = __HIVE_P2_get(__HIVE_P2_temp1603_5, "parseParenExpression", 1610), __HIVE_P2_invoke(__HIVE_P2_temp1603_6, __HIVE_P2_temp1603_5, (__HIVE_P2_reserveArray(0, 1610), __HIVE_P2_ownArray([], 1610, "CONTROL_ARRAY")), 1610)), 1608));
        (__HIVE_P2_temp1603_7 = e, __HIVE_P2_temp1603_8 = "body", __HIVE_P2_set(__HIVE_P2_temp1603_7, __HIVE_P2_temp1603_8, (__HIVE_P2_temp1603_10 = this, __HIVE_P2_temp1603_11 = __HIVE_P2_get(__HIVE_P2_temp1603_10, "parseStatement", 1614), __HIVE_P2_invoke(__HIVE_P2_temp1603_11, __HIVE_P2_temp1603_10, (__HIVE_P2_reserveArray(1, 1614), __HIVE_P2_ownArray(["with"], 1614, "CONTROL_ARRAY")), 1614)), 1612));
        return (__HIVE_P2_temp1603_12 = this, __HIVE_P2_temp1603_13 = __HIVE_P2_get(__HIVE_P2_temp1603_12, "finishNode", 1616), __HIVE_P2_invoke(__HIVE_P2_temp1603_13, __HIVE_P2_temp1603_12, (__HIVE_P2_reserveArray(2, 1616), __HIVE_P2_ownArray([e, "WithStatement"], 1616, "CONTROL_ARRAY")), 1616));
    }, 14, 1, 0, 1603)), 1601));
    (__HIVE_P2_temp0_1040 = $, __HIVE_P2_temp0_1041 = "parseEmptyStatement", __HIVE_P2_set(__HIVE_P2_temp0_1040, __HIVE_P2_temp0_1041, (__HIVE_P2_reserveFunction(1620), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp1620_0, __HIVE_P2_temp1620_1, __HIVE_P2_temp1620_2, __HIVE_P2_temp1620_3;
        (__HIVE_P2_temp1620_0 = this, __HIVE_P2_temp1620_1 = __HIVE_P2_get(__HIVE_P2_temp1620_0, "next", 1621), __HIVE_P2_invoke(__HIVE_P2_temp1620_1, __HIVE_P2_temp1620_0, (__HIVE_P2_reserveArray(0, 1621), __HIVE_P2_ownArray([], 1621, "CONTROL_ARRAY")), 1621));
        return (__HIVE_P2_temp1620_2 = this, __HIVE_P2_temp1620_3 = __HIVE_P2_get(__HIVE_P2_temp1620_2, "finishNode", 1623), __HIVE_P2_invoke(__HIVE_P2_temp1620_3, __HIVE_P2_temp1620_2, (__HIVE_P2_reserveArray(2, 1623), __HIVE_P2_ownArray([e, "EmptyStatement"], 1623, "CONTROL_ARRAY")), 1623));
    }, 4, 1, 0, 1620)), 1618));
    (__HIVE_P2_temp0_1043 = $, __HIVE_P2_temp0_1044 = "parseLabeledStatement", __HIVE_P2_set(__HIVE_P2_temp0_1043, __HIVE_P2_temp0_1044, (__HIVE_P2_reserveFunction(1627), __HIVE_P2_registerFunction(function (e, t, i, s) {
        var __HIVE_P2_temp1627_0, __HIVE_P2_temp1627_1, __HIVE_P2_temp1627_2, __HIVE_P2_temp1627_3, __HIVE_P2_temp1627_4, __HIVE_P2_temp1627_5, __HIVE_P2_temp1627_6, __HIVE_P2_temp1627_7, __HIVE_P2_temp1627_8, __HIVE_P2_temp1627_9, __HIVE_P2_temp1627_10, __HIVE_P2_temp1627_11, __HIVE_P2_temp1627_12, __HIVE_P2_temp1627_13, __HIVE_P2_temp1627_14, __HIVE_P2_temp1627_15, __HIVE_P2_temp1627_16, __HIVE_P2_temp1627_17, __HIVE_P2_temp1627_18, __HIVE_P2_temp1627_19, __HIVE_P2_temp1627_20, __HIVE_P2_temp1627_21, __HIVE_P2_temp1627_22, __HIVE_P2_temp1627_23;
        for (var r = 0, a = __HIVE_P2_get(this, "labels", 1629); __HIVE_P2_binary("<", r, __HIVE_P2_get(a, "length", 1631), 1630); r = __HIVE_P2_binary("+", r, 1, 1632)) {
            __HIVE_P2_tick(1628);
            var n = __HIVE_P2_get(a, r, 1633);
            if (__HIVE_P2_get(n, "name", 1634) === t) {
                __HIVE_P2_syntaxRefusal(1635);
            }
        }
        var o = __HIVE_P2_get(__HIVE_P2_get(this, "type", 1637), "isLoop", 1636) ? "loop" : __HIVE_P2_get(this, "type", 1638) === __HIVE_P2_get(m, "_switch", 1639) ? "switch" : null;
        for (var h = __HIVE_P2_binary("-", __HIVE_P2_get(__HIVE_P2_get(this, "labels", 1643), "length", 1642), 1, 1641); __HIVE_P2_binary(">=", h, 0, 1644); (__HIVE_P2_temp1627_0 = __HIVE_P2_numeric(h, 1645), __HIVE_P2_temp1627_1 = __HIVE_P2_temp1627_0 + -1, h = __HIVE_P2_temp1627_1, __HIVE_P2_temp1627_0)) {
            __HIVE_P2_tick(1640);
            var p = __HIVE_P2_get(__HIVE_P2_get(this, "labels", 1647), h, 1646);
            if (__HIVE_P2_get(p, "statementStart", 1648) === __HIVE_P2_get(e, "start", 1649)) {
                (__HIVE_P2_temp1627_2 = p, __HIVE_P2_temp1627_3 = "statementStart", __HIVE_P2_set(__HIVE_P2_temp1627_2, __HIVE_P2_temp1627_3, __HIVE_P2_get(this, "start", 1652), 1650));
                (__HIVE_P2_temp1627_5 = p, __HIVE_P2_temp1627_6 = "kind", __HIVE_P2_set(__HIVE_P2_temp1627_5, __HIVE_P2_temp1627_6, o, 1653));
            }
            else {
                break;
            }
        }
        (__HIVE_P2_temp1627_8 = __HIVE_P2_get(this, "labels", 1659), __HIVE_P2_temp1627_9 = __HIVE_P2_get(__HIVE_P2_temp1627_8, "push", 1655), __HIVE_P2_invoke(__HIVE_P2_temp1627_9, __HIVE_P2_temp1627_8, (__HIVE_P2_reserveArray(1, 1655), __HIVE_P2_ownArray([(__HIVE_P2_reserveObject(3, 1656), __HIVE_P2_ownObject({ name: t, kind: o, statementStart: __HIVE_P2_get(this, "start", 1657) }, 1656, 3, 22))], 1655, "CONTROL_ARRAY")), 1655));
        (__HIVE_P2_temp1627_10 = e, __HIVE_P2_temp1627_11 = "body", __HIVE_P2_set(__HIVE_P2_temp1627_10, __HIVE_P2_temp1627_11, (__HIVE_P2_temp1627_15 = this, __HIVE_P2_temp1627_16 = __HIVE_P2_get(__HIVE_P2_temp1627_15, "parseStatement", 1662), __HIVE_P2_invoke(__HIVE_P2_temp1627_16, __HIVE_P2_temp1627_15, (__HIVE_P2_reserveArray(1, 1662), __HIVE_P2_ownArray([s ? (__HIVE_P2_temp1627_13 = s, __HIVE_P2_temp1627_14 = __HIVE_P2_get(__HIVE_P2_temp1627_13, "indexOf", 1663), __HIVE_P2_invoke(__HIVE_P2_temp1627_14, __HIVE_P2_temp1627_13, (__HIVE_P2_reserveArray(1, 1663), __HIVE_P2_ownArray(["label"], 1663, "CONTROL_ARRAY")), 1663)) === __HIVE_P2_unary("-", 1, 1665) ? __HIVE_P2_binary("+", s, "label", 1666) : s : "label"], 1662, "CONTROL_ARRAY")), 1662)), 1660));
        (__HIVE_P2_temp1627_17 = __HIVE_P2_get(this, "labels", 1670), __HIVE_P2_temp1627_18 = __HIVE_P2_get(__HIVE_P2_temp1627_17, "pop", 1668), __HIVE_P2_invoke(__HIVE_P2_temp1627_18, __HIVE_P2_temp1627_17, (__HIVE_P2_reserveArray(0, 1668), __HIVE_P2_ownArray([], 1668, "CONTROL_ARRAY")), 1668));
        (__HIVE_P2_temp1627_19 = e, __HIVE_P2_temp1627_20 = "label", __HIVE_P2_set(__HIVE_P2_temp1627_19, __HIVE_P2_temp1627_20, i, 1671));
        return (__HIVE_P2_temp1627_22 = this, __HIVE_P2_temp1627_23 = __HIVE_P2_get(__HIVE_P2_temp1627_22, "finishNode", 1673), __HIVE_P2_invoke(__HIVE_P2_temp1627_23, __HIVE_P2_temp1627_22, (__HIVE_P2_reserveArray(2, 1673), __HIVE_P2_ownArray([e, "LabeledStatement"], 1673, "CONTROL_ARRAY")), 1673));
    }, 30, 4, 0, 1627)), 1625));
    (__HIVE_P2_temp0_1046 = $, __HIVE_P2_temp0_1047 = "parseExpressionStatement", __HIVE_P2_set(__HIVE_P2_temp0_1046, __HIVE_P2_temp0_1047, (__HIVE_P2_reserveFunction(1677), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp1677_0, __HIVE_P2_temp1677_1, __HIVE_P2_temp1677_2, __HIVE_P2_temp1677_3, __HIVE_P2_temp1677_4, __HIVE_P2_temp1677_5, __HIVE_P2_temp1677_6;
        (__HIVE_P2_temp1677_0 = e, __HIVE_P2_temp1677_1 = "expression", __HIVE_P2_set(__HIVE_P2_temp1677_0, __HIVE_P2_temp1677_1, t, 1678));
        (__HIVE_P2_temp1677_3 = this, __HIVE_P2_temp1677_4 = __HIVE_P2_get(__HIVE_P2_temp1677_3, "semicolon", 1680), __HIVE_P2_invoke(__HIVE_P2_temp1677_4, __HIVE_P2_temp1677_3, (__HIVE_P2_reserveArray(0, 1680), __HIVE_P2_ownArray([], 1680, "CONTROL_ARRAY")), 1680));
        return (__HIVE_P2_temp1677_5 = this, __HIVE_P2_temp1677_6 = __HIVE_P2_get(__HIVE_P2_temp1677_5, "finishNode", 1682), __HIVE_P2_invoke(__HIVE_P2_temp1677_6, __HIVE_P2_temp1677_5, (__HIVE_P2_reserveArray(2, 1682), __HIVE_P2_ownArray([e, "ExpressionStatement"], 1682, "CONTROL_ARRAY")), 1682));
    }, 7, 2, 0, 1677)), 1675));
    (__HIVE_P2_temp0_1049 = $, __HIVE_P2_temp0_1050 = "parseBlock", __HIVE_P2_set(__HIVE_P2_temp0_1049, __HIVE_P2_temp0_1050, (__HIVE_P2_reserveFunction(1686), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp1686_0, __HIVE_P2_temp1686_1, __HIVE_P2_temp1686_2, __HIVE_P2_temp1686_3, __HIVE_P2_temp1686_4, __HIVE_P2_temp1686_5, __HIVE_P2_temp1686_6, __HIVE_P2_temp1686_7, __HIVE_P2_temp1686_8, __HIVE_P2_temp1686_9, __HIVE_P2_temp1686_10, __HIVE_P2_temp1686_11, __HIVE_P2_temp1686_12, __HIVE_P2_temp1686_13, __HIVE_P2_temp1686_14, __HIVE_P2_temp1686_15, __HIVE_P2_temp1686_16, __HIVE_P2_temp1686_17, __HIVE_P2_temp1686_18, __HIVE_P2_temp1686_19, __HIVE_P2_temp1686_20, __HIVE_P2_temp1686_21, __HIVE_P2_temp1686_22;
        if (e === void 0)
            e = true;
        if (t === void 0)
            t = (__HIVE_P2_temp1686_0 = this, __HIVE_P2_temp1686_1 = __HIVE_P2_get(__HIVE_P2_temp1686_0, "startNode", 1689), __HIVE_P2_invoke(__HIVE_P2_temp1686_1, __HIVE_P2_temp1686_0, (__HIVE_P2_reserveArray(0, 1689), __HIVE_P2_ownArray([], 1689, "CONTROL_ARRAY")), 1689));
        (__HIVE_P2_temp1686_2 = t, __HIVE_P2_temp1686_3 = "body", __HIVE_P2_set(__HIVE_P2_temp1686_2, __HIVE_P2_temp1686_3, (__HIVE_P2_temp1686_5 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp1686_5, 1693), __HIVE_P2_reserveArray(0, 1693, 0), __HIVE_P2_ownArray([], 1693, "ARRAY", __HIVE_P2_temp1686_5)), 1691));
        (__HIVE_P2_temp1686_6 = this, __HIVE_P2_temp1686_7 = __HIVE_P2_get(__HIVE_P2_temp1686_6, "expect", 1694), __HIVE_P2_invoke(__HIVE_P2_temp1686_7, __HIVE_P2_temp1686_6, (__HIVE_P2_reserveArray(1, 1694), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceL", 1695)], 1694, "CONTROL_ARRAY")), 1694));
        if (e) {
            (__HIVE_P2_temp1686_8 = this, __HIVE_P2_temp1686_9 = __HIVE_P2_get(__HIVE_P2_temp1686_8, "enterScope", 1697), __HIVE_P2_invoke(__HIVE_P2_temp1686_9, __HIVE_P2_temp1686_8, (__HIVE_P2_reserveArray(1, 1697), __HIVE_P2_ownArray([0], 1697, "CONTROL_ARRAY")), 1697));
        }
        while (__HIVE_P2_get(this, "type", 1700) !== __HIVE_P2_get(m, "braceR", 1701)) {
            __HIVE_P2_tick(1699);
            var s = (__HIVE_P2_temp1686_10 = this, __HIVE_P2_temp1686_11 = __HIVE_P2_get(__HIVE_P2_temp1686_10, "parseStatement", 1702), __HIVE_P2_invoke(__HIVE_P2_temp1686_11, __HIVE_P2_temp1686_10, (__HIVE_P2_reserveArray(1, 1702), __HIVE_P2_ownArray([null], 1702, "CONTROL_ARRAY")), 1702));
            (__HIVE_P2_temp1686_12 = __HIVE_P2_get(t, "body", 1706), __HIVE_P2_temp1686_13 = __HIVE_P2_get(__HIVE_P2_temp1686_12, "push", 1704), __HIVE_P2_invoke(__HIVE_P2_temp1686_13, __HIVE_P2_temp1686_12, (__HIVE_P2_reserveArray(1, 1704), __HIVE_P2_ownArray([s], 1704, "CONTROL_ARRAY")), 1704));
        }
        if (i) {
            (__HIVE_P2_temp1686_14 = this, __HIVE_P2_temp1686_15 = "strict", __HIVE_P2_set(__HIVE_P2_temp1686_14, __HIVE_P2_temp1686_15, false, 1707));
        }
        (__HIVE_P2_temp1686_17 = this, __HIVE_P2_temp1686_18 = __HIVE_P2_get(__HIVE_P2_temp1686_17, "next", 1709), __HIVE_P2_invoke(__HIVE_P2_temp1686_18, __HIVE_P2_temp1686_17, (__HIVE_P2_reserveArray(0, 1709), __HIVE_P2_ownArray([], 1709, "CONTROL_ARRAY")), 1709));
        if (e) {
            (__HIVE_P2_temp1686_19 = this, __HIVE_P2_temp1686_20 = __HIVE_P2_get(__HIVE_P2_temp1686_19, "exitScope", 1711), __HIVE_P2_invoke(__HIVE_P2_temp1686_20, __HIVE_P2_temp1686_19, (__HIVE_P2_reserveArray(0, 1711), __HIVE_P2_ownArray([], 1711, "CONTROL_ARRAY")), 1711));
        }
        return (__HIVE_P2_temp1686_21 = this, __HIVE_P2_temp1686_22 = __HIVE_P2_get(__HIVE_P2_temp1686_21, "finishNode", 1713), __HIVE_P2_invoke(__HIVE_P2_temp1686_22, __HIVE_P2_temp1686_21, (__HIVE_P2_reserveArray(2, 1713), __HIVE_P2_ownArray([t, "BlockStatement"], 1713, "CONTROL_ARRAY")), 1713));
    }, 24, 3, 0, 1686)), 1684));
    (__HIVE_P2_temp0_1052 = $, __HIVE_P2_temp0_1053 = "parseFor", __HIVE_P2_set(__HIVE_P2_temp0_1052, __HIVE_P2_temp0_1053, (__HIVE_P2_reserveFunction(1717), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp1717_0, __HIVE_P2_temp1717_1, __HIVE_P2_temp1717_2, __HIVE_P2_temp1717_3, __HIVE_P2_temp1717_4, __HIVE_P2_temp1717_5, __HIVE_P2_temp1717_6, __HIVE_P2_temp1717_7, __HIVE_P2_temp1717_8, __HIVE_P2_temp1717_9, __HIVE_P2_temp1717_10, __HIVE_P2_temp1717_11, __HIVE_P2_temp1717_12, __HIVE_P2_temp1717_13, __HIVE_P2_temp1717_14, __HIVE_P2_temp1717_15, __HIVE_P2_temp1717_16, __HIVE_P2_temp1717_17, __HIVE_P2_temp1717_18, __HIVE_P2_temp1717_19, __HIVE_P2_temp1717_20, __HIVE_P2_temp1717_21, __HIVE_P2_temp1717_22, __HIVE_P2_temp1717_23, __HIVE_P2_temp1717_24, __HIVE_P2_temp1717_25, __HIVE_P2_temp1717_26, __HIVE_P2_temp1717_27, __HIVE_P2_temp1717_28, __HIVE_P2_temp1717_29;
        (__HIVE_P2_temp1717_0 = e, __HIVE_P2_temp1717_1 = "init", __HIVE_P2_set(__HIVE_P2_temp1717_0, __HIVE_P2_temp1717_1, t, 1718));
        (__HIVE_P2_temp1717_3 = this, __HIVE_P2_temp1717_4 = __HIVE_P2_get(__HIVE_P2_temp1717_3, "expect", 1720), __HIVE_P2_invoke(__HIVE_P2_temp1717_4, __HIVE_P2_temp1717_3, (__HIVE_P2_reserveArray(1, 1720), __HIVE_P2_ownArray([__HIVE_P2_get(m, "semi", 1721)], 1720, "CONTROL_ARRAY")), 1720));
        (__HIVE_P2_temp1717_5 = e, __HIVE_P2_temp1717_6 = "test", __HIVE_P2_set(__HIVE_P2_temp1717_5, __HIVE_P2_temp1717_6, __HIVE_P2_get(this, "type", 1725) === __HIVE_P2_get(m, "semi", 1726) ? null : (__HIVE_P2_temp1717_8 = this, __HIVE_P2_temp1717_9 = __HIVE_P2_get(__HIVE_P2_temp1717_8, "parseExpression", 1727), __HIVE_P2_invoke(__HIVE_P2_temp1717_9, __HIVE_P2_temp1717_8, (__HIVE_P2_reserveArray(0, 1727), __HIVE_P2_ownArray([], 1727, "CONTROL_ARRAY")), 1727)), 1723));
        (__HIVE_P2_temp1717_10 = this, __HIVE_P2_temp1717_11 = __HIVE_P2_get(__HIVE_P2_temp1717_10, "expect", 1729), __HIVE_P2_invoke(__HIVE_P2_temp1717_11, __HIVE_P2_temp1717_10, (__HIVE_P2_reserveArray(1, 1729), __HIVE_P2_ownArray([__HIVE_P2_get(m, "semi", 1730)], 1729, "CONTROL_ARRAY")), 1729));
        (__HIVE_P2_temp1717_12 = e, __HIVE_P2_temp1717_13 = "update", __HIVE_P2_set(__HIVE_P2_temp1717_12, __HIVE_P2_temp1717_13, __HIVE_P2_get(this, "type", 1734) === __HIVE_P2_get(m, "parenR", 1735) ? null : (__HIVE_P2_temp1717_15 = this, __HIVE_P2_temp1717_16 = __HIVE_P2_get(__HIVE_P2_temp1717_15, "parseExpression", 1736), __HIVE_P2_invoke(__HIVE_P2_temp1717_16, __HIVE_P2_temp1717_15, (__HIVE_P2_reserveArray(0, 1736), __HIVE_P2_ownArray([], 1736, "CONTROL_ARRAY")), 1736)), 1732));
        (__HIVE_P2_temp1717_17 = this, __HIVE_P2_temp1717_18 = __HIVE_P2_get(__HIVE_P2_temp1717_17, "expect", 1738), __HIVE_P2_invoke(__HIVE_P2_temp1717_18, __HIVE_P2_temp1717_17, (__HIVE_P2_reserveArray(1, 1738), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 1739)], 1738, "CONTROL_ARRAY")), 1738));
        (__HIVE_P2_temp1717_19 = e, __HIVE_P2_temp1717_20 = "body", __HIVE_P2_set(__HIVE_P2_temp1717_19, __HIVE_P2_temp1717_20, (__HIVE_P2_temp1717_22 = this, __HIVE_P2_temp1717_23 = __HIVE_P2_get(__HIVE_P2_temp1717_22, "parseStatement", 1743), __HIVE_P2_invoke(__HIVE_P2_temp1717_23, __HIVE_P2_temp1717_22, (__HIVE_P2_reserveArray(1, 1743), __HIVE_P2_ownArray(["for"], 1743, "CONTROL_ARRAY")), 1743)), 1741));
        (__HIVE_P2_temp1717_24 = this, __HIVE_P2_temp1717_25 = __HIVE_P2_get(__HIVE_P2_temp1717_24, "exitScope", 1745), __HIVE_P2_invoke(__HIVE_P2_temp1717_25, __HIVE_P2_temp1717_24, (__HIVE_P2_reserveArray(0, 1745), __HIVE_P2_ownArray([], 1745, "CONTROL_ARRAY")), 1745));
        (__HIVE_P2_temp1717_26 = __HIVE_P2_get(this, "labels", 1749), __HIVE_P2_temp1717_27 = __HIVE_P2_get(__HIVE_P2_temp1717_26, "pop", 1747), __HIVE_P2_invoke(__HIVE_P2_temp1717_27, __HIVE_P2_temp1717_26, (__HIVE_P2_reserveArray(0, 1747), __HIVE_P2_ownArray([], 1747, "CONTROL_ARRAY")), 1747));
        return (__HIVE_P2_temp1717_28 = this, __HIVE_P2_temp1717_29 = __HIVE_P2_get(__HIVE_P2_temp1717_28, "finishNode", 1750), __HIVE_P2_invoke(__HIVE_P2_temp1717_29, __HIVE_P2_temp1717_28, (__HIVE_P2_reserveArray(2, 1750), __HIVE_P2_ownArray([e, "ForStatement"], 1750, "CONTROL_ARRAY")), 1750));
    }, 30, 2, 0, 1717)), 1715));
    (__HIVE_P2_temp0_1055 = $, __HIVE_P2_temp0_1056 = "parseForIn", __HIVE_P2_set(__HIVE_P2_temp0_1055, __HIVE_P2_temp0_1056, (__HIVE_P2_reserveFunction(1754), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp1754_0, __HIVE_P2_temp1754_1, __HIVE_P2_temp1754_2, __HIVE_P2_temp1754_3, __HIVE_P2_temp1754_4, __HIVE_P2_temp1754_5, __HIVE_P2_temp1754_6, __HIVE_P2_temp1754_7, __HIVE_P2_temp1754_8, __HIVE_P2_temp1754_9, __HIVE_P2_temp1754_10, __HIVE_P2_temp1754_11, __HIVE_P2_temp1754_12, __HIVE_P2_temp1754_13, __HIVE_P2_temp1754_14, __HIVE_P2_temp1754_15, __HIVE_P2_temp1754_16, __HIVE_P2_temp1754_17, __HIVE_P2_temp1754_18, __HIVE_P2_temp1754_19, __HIVE_P2_temp1754_20, __HIVE_P2_temp1754_21, __HIVE_P2_temp1754_22, __HIVE_P2_temp1754_23, __HIVE_P2_temp1754_24;
        var i = __HIVE_P2_get(this, "type", 1755) === __HIVE_P2_get(m, "_in", 1756);
        (__HIVE_P2_temp1754_0 = this, __HIVE_P2_temp1754_1 = __HIVE_P2_get(__HIVE_P2_temp1754_0, "next", 1757), __HIVE_P2_invoke(__HIVE_P2_temp1754_1, __HIVE_P2_temp1754_0, (__HIVE_P2_reserveArray(0, 1757), __HIVE_P2_ownArray([], 1757, "CONTROL_ARRAY")), 1757));
        if (__HIVE_P2_get(t, "type", 1759) === "VariableDeclaration" && __HIVE_P2_binary("!=", __HIVE_P2_get(__HIVE_P2_get(__HIVE_P2_get(t, "declarations", 1763), 0, 1762), "init", 1761), null, 1760) && (!i || __HIVE_P2_binary("<", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1766), "ecmaVersion", 1765), 8, 1764) || __HIVE_P2_get(this, "strict", 1767) || __HIVE_P2_get(t, "kind", 1768) !== "var" || __HIVE_P2_get(__HIVE_P2_get(__HIVE_P2_get(__HIVE_P2_get(t, "declarations", 1772), 0, 1771), "id", 1770), "type", 1769) !== "Identifier")) {
            __HIVE_P2_syntaxRefusal(1773);
        }
        (__HIVE_P2_temp1754_2 = e, __HIVE_P2_temp1754_3 = "left", __HIVE_P2_set(__HIVE_P2_temp1754_2, __HIVE_P2_temp1754_3, t, 1774));
        (__HIVE_P2_temp1754_5 = e, __HIVE_P2_temp1754_6 = "right", __HIVE_P2_set(__HIVE_P2_temp1754_5, __HIVE_P2_temp1754_6, i ? (__HIVE_P2_temp1754_8 = this, __HIVE_P2_temp1754_9 = __HIVE_P2_get(__HIVE_P2_temp1754_8, "parseExpression", 1778), __HIVE_P2_invoke(__HIVE_P2_temp1754_9, __HIVE_P2_temp1754_8, (__HIVE_P2_reserveArray(0, 1778), __HIVE_P2_ownArray([], 1778, "CONTROL_ARRAY")), 1778)) : (__HIVE_P2_temp1754_10 = this, __HIVE_P2_temp1754_11 = __HIVE_P2_get(__HIVE_P2_temp1754_10, "parseMaybeAssign", 1780), __HIVE_P2_invoke(__HIVE_P2_temp1754_11, __HIVE_P2_temp1754_10, (__HIVE_P2_reserveArray(0, 1780), __HIVE_P2_ownArray([], 1780, "CONTROL_ARRAY")), 1780)), 1776));
        (__HIVE_P2_temp1754_12 = this, __HIVE_P2_temp1754_13 = __HIVE_P2_get(__HIVE_P2_temp1754_12, "expect", 1782), __HIVE_P2_invoke(__HIVE_P2_temp1754_13, __HIVE_P2_temp1754_12, (__HIVE_P2_reserveArray(1, 1782), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 1783)], 1782, "CONTROL_ARRAY")), 1782));
        (__HIVE_P2_temp1754_14 = e, __HIVE_P2_temp1754_15 = "body", __HIVE_P2_set(__HIVE_P2_temp1754_14, __HIVE_P2_temp1754_15, (__HIVE_P2_temp1754_17 = this, __HIVE_P2_temp1754_18 = __HIVE_P2_get(__HIVE_P2_temp1754_17, "parseStatement", 1787), __HIVE_P2_invoke(__HIVE_P2_temp1754_18, __HIVE_P2_temp1754_17, (__HIVE_P2_reserveArray(1, 1787), __HIVE_P2_ownArray(["for"], 1787, "CONTROL_ARRAY")), 1787)), 1785));
        (__HIVE_P2_temp1754_19 = this, __HIVE_P2_temp1754_20 = __HIVE_P2_get(__HIVE_P2_temp1754_19, "exitScope", 1789), __HIVE_P2_invoke(__HIVE_P2_temp1754_20, __HIVE_P2_temp1754_19, (__HIVE_P2_reserveArray(0, 1789), __HIVE_P2_ownArray([], 1789, "CONTROL_ARRAY")), 1789));
        (__HIVE_P2_temp1754_21 = __HIVE_P2_get(this, "labels", 1793), __HIVE_P2_temp1754_22 = __HIVE_P2_get(__HIVE_P2_temp1754_21, "pop", 1791), __HIVE_P2_invoke(__HIVE_P2_temp1754_22, __HIVE_P2_temp1754_21, (__HIVE_P2_reserveArray(0, 1791), __HIVE_P2_ownArray([], 1791, "CONTROL_ARRAY")), 1791));
        return (__HIVE_P2_temp1754_23 = this, __HIVE_P2_temp1754_24 = __HIVE_P2_get(__HIVE_P2_temp1754_23, "finishNode", 1794), __HIVE_P2_invoke(__HIVE_P2_temp1754_24, __HIVE_P2_temp1754_23, (__HIVE_P2_reserveArray(2, 1794), __HIVE_P2_ownArray([e, i ? "ForInStatement" : "ForOfStatement"], 1794, "CONTROL_ARRAY")), 1794));
    }, 26, 2, 0, 1754)), 1752));
    (__HIVE_P2_temp0_1058 = $, __HIVE_P2_temp0_1059 = "parseVar", __HIVE_P2_set(__HIVE_P2_temp0_1058, __HIVE_P2_temp0_1059, (__HIVE_P2_reserveFunction(1798), __HIVE_P2_registerFunction(function (e, t, i, s) {
        var __HIVE_P2_temp1798_0, __HIVE_P2_temp1798_1, __HIVE_P2_temp1798_2, __HIVE_P2_temp1798_3, __HIVE_P2_temp1798_4, __HIVE_P2_temp1798_5, __HIVE_P2_temp1798_6, __HIVE_P2_temp1798_7, __HIVE_P2_temp1798_8, __HIVE_P2_temp1798_9, __HIVE_P2_temp1798_10, __HIVE_P2_temp1798_11, __HIVE_P2_temp1798_12, __HIVE_P2_temp1798_13, __HIVE_P2_temp1798_14, __HIVE_P2_temp1798_15, __HIVE_P2_temp1798_16, __HIVE_P2_temp1798_17, __HIVE_P2_temp1798_18, __HIVE_P2_temp1798_19, __HIVE_P2_temp1798_20, __HIVE_P2_temp1798_21, __HIVE_P2_temp1798_22, __HIVE_P2_temp1798_23, __HIVE_P2_temp1798_24, __HIVE_P2_temp1798_25, __HIVE_P2_temp1798_26, __HIVE_P2_temp1798_27, __HIVE_P2_temp1798_28, __HIVE_P2_temp1798_29, __HIVE_P2_temp1798_30;
        (__HIVE_P2_temp1798_0 = e, __HIVE_P2_temp1798_1 = "declarations", __HIVE_P2_set(__HIVE_P2_temp1798_0, __HIVE_P2_temp1798_1, (__HIVE_P2_temp1798_3 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp1798_3, 1801), __HIVE_P2_reserveArray(0, 1801, 0), __HIVE_P2_ownArray([], 1801, "ARRAY", __HIVE_P2_temp1798_3)), 1799));
        (__HIVE_P2_temp1798_4 = e, __HIVE_P2_temp1798_5 = "kind", __HIVE_P2_set(__HIVE_P2_temp1798_4, __HIVE_P2_temp1798_5, i, 1802));
        for (;;) {
            __HIVE_P2_tick(1804);
            var r = (__HIVE_P2_temp1798_7 = this, __HIVE_P2_temp1798_8 = __HIVE_P2_get(__HIVE_P2_temp1798_7, "startNode", 1805), __HIVE_P2_invoke(__HIVE_P2_temp1798_8, __HIVE_P2_temp1798_7, (__HIVE_P2_reserveArray(0, 1805), __HIVE_P2_ownArray([], 1805, "CONTROL_ARRAY")), 1805));
            (__HIVE_P2_temp1798_9 = this, __HIVE_P2_temp1798_10 = __HIVE_P2_get(__HIVE_P2_temp1798_9, "parseVarId", 1807), __HIVE_P2_invoke(__HIVE_P2_temp1798_10, __HIVE_P2_temp1798_9, (__HIVE_P2_reserveArray(2, 1807), __HIVE_P2_ownArray([r, i], 1807, "CONTROL_ARRAY")), 1807));
            if ((__HIVE_P2_temp1798_11 = this, __HIVE_P2_temp1798_12 = __HIVE_P2_get(__HIVE_P2_temp1798_11, "eat", 1809), __HIVE_P2_invoke(__HIVE_P2_temp1798_12, __HIVE_P2_temp1798_11, (__HIVE_P2_reserveArray(1, 1809), __HIVE_P2_ownArray([__HIVE_P2_get(m, "eq", 1810)], 1809, "CONTROL_ARRAY")), 1809))) {
                (__HIVE_P2_temp1798_13 = r, __HIVE_P2_temp1798_14 = "init", __HIVE_P2_set(__HIVE_P2_temp1798_13, __HIVE_P2_temp1798_14, (__HIVE_P2_temp1798_16 = this, __HIVE_P2_temp1798_17 = __HIVE_P2_get(__HIVE_P2_temp1798_16, "parseMaybeAssign", 1814), __HIVE_P2_invoke(__HIVE_P2_temp1798_17, __HIVE_P2_temp1798_16, (__HIVE_P2_reserveArray(1, 1814), __HIVE_P2_ownArray([t], 1814, "CONTROL_ARRAY")), 1814)), 1812));
            }
            else if (!s && i === "const" && !(__HIVE_P2_get(this, "type", 1816) === __HIVE_P2_get(m, "_in", 1817) || __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1820), "ecmaVersion", 1819), 6, 1818) && (__HIVE_P2_temp1798_18 = this, __HIVE_P2_temp1798_19 = __HIVE_P2_get(__HIVE_P2_temp1798_18, "isContextual", 1821), __HIVE_P2_invoke(__HIVE_P2_temp1798_19, __HIVE_P2_temp1798_18, (__HIVE_P2_reserveArray(1, 1821), __HIVE_P2_ownArray(["of"], 1821, "CONTROL_ARRAY")), 1821)))) {
                __HIVE_P2_syntaxRefusal(1823);
            }
            else if (!s && __HIVE_P2_get(__HIVE_P2_get(r, "id", 1825), "type", 1824) !== "Identifier" && !(t && (__HIVE_P2_get(this, "type", 1826) === __HIVE_P2_get(m, "_in", 1827) || (__HIVE_P2_temp1798_20 = this, __HIVE_P2_temp1798_21 = __HIVE_P2_get(__HIVE_P2_temp1798_20, "isContextual", 1828), __HIVE_P2_invoke(__HIVE_P2_temp1798_21, __HIVE_P2_temp1798_20, (__HIVE_P2_reserveArray(1, 1828), __HIVE_P2_ownArray(["of"], 1828, "CONTROL_ARRAY")), 1828))))) {
                __HIVE_P2_syntaxRefusal(1830);
            }
            else {
                (__HIVE_P2_temp1798_22 = r, __HIVE_P2_temp1798_23 = "init", __HIVE_P2_set(__HIVE_P2_temp1798_22, __HIVE_P2_temp1798_23, null, 1831));
            }
            (__HIVE_P2_temp1798_27 = __HIVE_P2_get(e, "declarations", 1837), __HIVE_P2_temp1798_28 = __HIVE_P2_get(__HIVE_P2_temp1798_27, "push", 1833), __HIVE_P2_invoke(__HIVE_P2_temp1798_28, __HIVE_P2_temp1798_27, (__HIVE_P2_reserveArray(1, 1833), __HIVE_P2_ownArray([(__HIVE_P2_temp1798_25 = this, __HIVE_P2_temp1798_26 = __HIVE_P2_get(__HIVE_P2_temp1798_25, "finishNode", 1834), __HIVE_P2_invoke(__HIVE_P2_temp1798_26, __HIVE_P2_temp1798_25, (__HIVE_P2_reserveArray(2, 1834), __HIVE_P2_ownArray([r, "VariableDeclarator"], 1834, "CONTROL_ARRAY")), 1834))], 1833, "CONTROL_ARRAY")), 1833));
            if (!(__HIVE_P2_temp1798_29 = this, __HIVE_P2_temp1798_30 = __HIVE_P2_get(__HIVE_P2_temp1798_29, "eat", 1838), __HIVE_P2_invoke(__HIVE_P2_temp1798_30, __HIVE_P2_temp1798_29, (__HIVE_P2_reserveArray(1, 1838), __HIVE_P2_ownArray([__HIVE_P2_get(m, "comma", 1839)], 1838, "CONTROL_ARRAY")), 1838))) {
                break;
            }
        }
        return e;
    }, 32, 4, 0, 1798)), 1796));
    (__HIVE_P2_temp0_1061 = $, __HIVE_P2_temp0_1062 = "parseVarId", __HIVE_P2_set(__HIVE_P2_temp0_1061, __HIVE_P2_temp0_1062, (__HIVE_P2_reserveFunction(1843), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp1843_0, __HIVE_P2_temp1843_1, __HIVE_P2_temp1843_2, __HIVE_P2_temp1843_3, __HIVE_P2_temp1843_4, __HIVE_P2_temp1843_5, __HIVE_P2_temp1843_6;
        (__HIVE_P2_temp1843_0 = e, __HIVE_P2_temp1843_1 = "id", __HIVE_P2_set(__HIVE_P2_temp1843_0, __HIVE_P2_temp1843_1, (__HIVE_P2_temp1843_3 = this, __HIVE_P2_temp1843_4 = __HIVE_P2_get(__HIVE_P2_temp1843_3, "parseBindingAtom", 1846), __HIVE_P2_invoke(__HIVE_P2_temp1843_4, __HIVE_P2_temp1843_3, (__HIVE_P2_reserveArray(0, 1846), __HIVE_P2_ownArray([], 1846, "CONTROL_ARRAY")), 1846)), 1844));
        (__HIVE_P2_temp1843_5 = this, __HIVE_P2_temp1843_6 = __HIVE_P2_get(__HIVE_P2_temp1843_5, "checkLValPattern", 1848), __HIVE_P2_invoke(__HIVE_P2_temp1843_6, __HIVE_P2_temp1843_5, (__HIVE_P2_reserveArray(3, 1848), __HIVE_P2_ownArray([__HIVE_P2_get(e, "id", 1849), t === "var" ? j : G, false], 1848, "CONTROL_ARRAY")), 1848));
    }, 7, 2, 0, 1843)), 1841));
    var ie = 1, se = 2, re = 4;
    (__HIVE_P2_temp0_1064 = $, __HIVE_P2_temp0_1065 = "parseFunction", __HIVE_P2_set(__HIVE_P2_temp0_1064, __HIVE_P2_temp0_1065, (__HIVE_P2_reserveFunction(1853), __HIVE_P2_registerFunction(function (e, t, i, s, r) {
        var __HIVE_P2_temp1853_0, __HIVE_P2_temp1853_1, __HIVE_P2_temp1853_2, __HIVE_P2_temp1853_3, __HIVE_P2_temp1853_4, __HIVE_P2_temp1853_5, __HIVE_P2_temp1853_6, __HIVE_P2_temp1853_7, __HIVE_P2_temp1853_8, __HIVE_P2_temp1853_9, __HIVE_P2_temp1853_10, __HIVE_P2_temp1853_11, __HIVE_P2_temp1853_12, __HIVE_P2_temp1853_13, __HIVE_P2_temp1853_14, __HIVE_P2_temp1853_15, __HIVE_P2_temp1853_16, __HIVE_P2_temp1853_17, __HIVE_P2_temp1853_18, __HIVE_P2_temp1853_19, __HIVE_P2_temp1853_20, __HIVE_P2_temp1853_21, __HIVE_P2_temp1853_22, __HIVE_P2_temp1853_23, __HIVE_P2_temp1853_24, __HIVE_P2_temp1853_25, __HIVE_P2_temp1853_26, __HIVE_P2_temp1853_27, __HIVE_P2_temp1853_28, __HIVE_P2_temp1853_29, __HIVE_P2_temp1853_30, __HIVE_P2_temp1853_31, __HIVE_P2_temp1853_32, __HIVE_P2_temp1853_33, __HIVE_P2_temp1853_34, __HIVE_P2_temp1853_35, __HIVE_P2_temp1853_36, __HIVE_P2_temp1853_37, __HIVE_P2_temp1853_38, __HIVE_P2_temp1853_39, __HIVE_P2_temp1853_40, __HIVE_P2_temp1853_41, __HIVE_P2_temp1853_42, __HIVE_P2_temp1853_43, __HIVE_P2_temp1853_44, __HIVE_P2_temp1853_45, __HIVE_P2_temp1853_46, __HIVE_P2_temp1853_47;
        (__HIVE_P2_temp1853_0 = this, __HIVE_P2_temp1853_1 = __HIVE_P2_get(__HIVE_P2_temp1853_0, "initFunction", 1854), __HIVE_P2_invoke(__HIVE_P2_temp1853_1, __HIVE_P2_temp1853_0, (__HIVE_P2_reserveArray(1, 1854), __HIVE_P2_ownArray([e], 1854, "CONTROL_ARRAY")), 1854));
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1858), "ecmaVersion", 1857), 9, 1856) || __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1861), "ecmaVersion", 1860), 6, 1859) && !s) {
            if (__HIVE_P2_get(this, "type", 1862) === __HIVE_P2_get(m, "star", 1863) && __HIVE_P2_binary("&", t, se, 1864)) {
                __HIVE_P2_syntaxRefusal(1865);
            }
            (__HIVE_P2_temp1853_2 = e, __HIVE_P2_temp1853_3 = "generator", __HIVE_P2_set(__HIVE_P2_temp1853_2, __HIVE_P2_temp1853_3, (__HIVE_P2_temp1853_5 = this, __HIVE_P2_temp1853_6 = __HIVE_P2_get(__HIVE_P2_temp1853_5, "eat", 1868), __HIVE_P2_invoke(__HIVE_P2_temp1853_6, __HIVE_P2_temp1853_5, (__HIVE_P2_reserveArray(1, 1868), __HIVE_P2_ownArray([__HIVE_P2_get(m, "star", 1869)], 1868, "CONTROL_ARRAY")), 1868)), 1866));
        }
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1873), "ecmaVersion", 1872), 8, 1871)) {
            (__HIVE_P2_temp1853_7 = e, __HIVE_P2_temp1853_8 = "async", __HIVE_P2_set(__HIVE_P2_temp1853_7, __HIVE_P2_temp1853_8, !!s, 1874));
        }
        if (__HIVE_P2_binary("&", t, ie, 1876)) {
            (__HIVE_P2_temp1853_10 = e, __HIVE_P2_temp1853_11 = "id", __HIVE_P2_set(__HIVE_P2_temp1853_10, __HIVE_P2_temp1853_11, __HIVE_P2_binary("&", t, re, 1879) && __HIVE_P2_get(this, "type", 1880) !== __HIVE_P2_get(m, "name", 1881) ? null : (__HIVE_P2_temp1853_13 = this, __HIVE_P2_temp1853_14 = __HIVE_P2_get(__HIVE_P2_temp1853_13, "parseIdent", 1882), __HIVE_P2_invoke(__HIVE_P2_temp1853_14, __HIVE_P2_temp1853_13, (__HIVE_P2_reserveArray(0, 1882), __HIVE_P2_ownArray([], 1882, "CONTROL_ARRAY")), 1882)), 1877));
            if (__HIVE_P2_get(e, "id", 1884) && !(__HIVE_P2_binary("&", t, se, 1885))) {
                (__HIVE_P2_temp1853_15 = this, __HIVE_P2_temp1853_16 = __HIVE_P2_get(__HIVE_P2_temp1853_15, "checkLValSimple", 1886), __HIVE_P2_invoke(__HIVE_P2_temp1853_16, __HIVE_P2_temp1853_15, (__HIVE_P2_reserveArray(2, 1886), __HIVE_P2_ownArray([__HIVE_P2_get(e, "id", 1887), __HIVE_P2_get(this, "strict", 1888) || __HIVE_P2_get(e, "generator", 1889) || __HIVE_P2_get(e, "async", 1890) ? __HIVE_P2_get(this, "treatFunctionsAsVar", 1891) ? j : G : H], 1886, "CONTROL_ARRAY")), 1886));
            }
        }
        var a = __HIVE_P2_get(this, "yieldPos", 1893), n = __HIVE_P2_get(this, "awaitPos", 1894), o = __HIVE_P2_get(this, "awaitIdentPos", 1895);
        (__HIVE_P2_temp1853_17 = this, __HIVE_P2_temp1853_18 = "yieldPos", __HIVE_P2_set(__HIVE_P2_temp1853_17, __HIVE_P2_temp1853_18, 0, 1896));
        (__HIVE_P2_temp1853_20 = this, __HIVE_P2_temp1853_21 = "awaitPos", __HIVE_P2_set(__HIVE_P2_temp1853_20, __HIVE_P2_temp1853_21, 0, 1898));
        (__HIVE_P2_temp1853_23 = this, __HIVE_P2_temp1853_24 = "awaitIdentPos", __HIVE_P2_set(__HIVE_P2_temp1853_23, __HIVE_P2_temp1853_24, 0, 1900));
        (__HIVE_P2_temp1853_26 = this, __HIVE_P2_temp1853_27 = __HIVE_P2_get(__HIVE_P2_temp1853_26, "enterScope", 1902), __HIVE_P2_invoke(__HIVE_P2_temp1853_27, __HIVE_P2_temp1853_26, (__HIVE_P2_reserveArray(1, 1902), __HIVE_P2_ownArray([__HIVE_P2_invoke(functionFlags, void 0, (__HIVE_P2_reserveArray(2, 1903), __HIVE_P2_ownArray([__HIVE_P2_get(e, "async", 1904), __HIVE_P2_get(e, "generator", 1905)], 1903, "CONTROL_ARRAY")), 1903)], 1902, "CONTROL_ARRAY")), 1902));
        if (!(__HIVE_P2_binary("&", t, ie, 1907))) {
            (__HIVE_P2_temp1853_28 = e, __HIVE_P2_temp1853_29 = "id", __HIVE_P2_set(__HIVE_P2_temp1853_28, __HIVE_P2_temp1853_29, __HIVE_P2_get(this, "type", 1910) === __HIVE_P2_get(m, "name", 1911) ? (__HIVE_P2_temp1853_31 = this, __HIVE_P2_temp1853_32 = __HIVE_P2_get(__HIVE_P2_temp1853_31, "parseIdent", 1912), __HIVE_P2_invoke(__HIVE_P2_temp1853_32, __HIVE_P2_temp1853_31, (__HIVE_P2_reserveArray(0, 1912), __HIVE_P2_ownArray([], 1912, "CONTROL_ARRAY")), 1912)) : null, 1908));
        }
        (__HIVE_P2_temp1853_33 = this, __HIVE_P2_temp1853_34 = __HIVE_P2_get(__HIVE_P2_temp1853_33, "parseFunctionParams", 1914), __HIVE_P2_invoke(__HIVE_P2_temp1853_34, __HIVE_P2_temp1853_33, (__HIVE_P2_reserveArray(1, 1914), __HIVE_P2_ownArray([e], 1914, "CONTROL_ARRAY")), 1914));
        (__HIVE_P2_temp1853_35 = this, __HIVE_P2_temp1853_36 = __HIVE_P2_get(__HIVE_P2_temp1853_35, "parseFunctionBody", 1916), __HIVE_P2_invoke(__HIVE_P2_temp1853_36, __HIVE_P2_temp1853_35, (__HIVE_P2_reserveArray(4, 1916), __HIVE_P2_ownArray([e, i, false, r], 1916, "CONTROL_ARRAY")), 1916));
        (__HIVE_P2_temp1853_37 = this, __HIVE_P2_temp1853_38 = "yieldPos", __HIVE_P2_set(__HIVE_P2_temp1853_37, __HIVE_P2_temp1853_38, a, 1918));
        (__HIVE_P2_temp1853_40 = this, __HIVE_P2_temp1853_41 = "awaitPos", __HIVE_P2_set(__HIVE_P2_temp1853_40, __HIVE_P2_temp1853_41, n, 1920));
        (__HIVE_P2_temp1853_43 = this, __HIVE_P2_temp1853_44 = "awaitIdentPos", __HIVE_P2_set(__HIVE_P2_temp1853_43, __HIVE_P2_temp1853_44, o, 1922));
        return (__HIVE_P2_temp1853_46 = this, __HIVE_P2_temp1853_47 = __HIVE_P2_get(__HIVE_P2_temp1853_46, "finishNode", 1924), __HIVE_P2_invoke(__HIVE_P2_temp1853_47, __HIVE_P2_temp1853_46, (__HIVE_P2_reserveArray(2, 1924), __HIVE_P2_ownArray([e, __HIVE_P2_binary("&", t, ie, 1925) ? "FunctionDeclaration" : "FunctionExpression"], 1924, "CONTROL_ARRAY")), 1924));
    }, 51, 5, 0, 1853)), 1851));
    (__HIVE_P2_temp0_1067 = $, __HIVE_P2_temp0_1068 = "parseFunctionParams", __HIVE_P2_set(__HIVE_P2_temp0_1067, __HIVE_P2_temp0_1068, (__HIVE_P2_reserveFunction(1929), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp1929_0, __HIVE_P2_temp1929_1, __HIVE_P2_temp1929_2, __HIVE_P2_temp1929_3, __HIVE_P2_temp1929_4, __HIVE_P2_temp1929_5, __HIVE_P2_temp1929_6, __HIVE_P2_temp1929_7, __HIVE_P2_temp1929_8;
        (__HIVE_P2_temp1929_0 = this, __HIVE_P2_temp1929_1 = __HIVE_P2_get(__HIVE_P2_temp1929_0, "expect", 1930), __HIVE_P2_invoke(__HIVE_P2_temp1929_1, __HIVE_P2_temp1929_0, (__HIVE_P2_reserveArray(1, 1930), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenL", 1931)], 1930, "CONTROL_ARRAY")), 1930));
        (__HIVE_P2_temp1929_2 = e, __HIVE_P2_temp1929_3 = "params", __HIVE_P2_set(__HIVE_P2_temp1929_2, __HIVE_P2_temp1929_3, (__HIVE_P2_temp1929_5 = this, __HIVE_P2_temp1929_6 = __HIVE_P2_get(__HIVE_P2_temp1929_5, "parseBindingList", 1935), __HIVE_P2_invoke(__HIVE_P2_temp1929_6, __HIVE_P2_temp1929_5, (__HIVE_P2_reserveArray(3, 1935), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 1936), false, __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 1939), "ecmaVersion", 1938), 8, 1937)], 1935, "CONTROL_ARRAY")), 1935)), 1933));
        (__HIVE_P2_temp1929_7 = this, __HIVE_P2_temp1929_8 = __HIVE_P2_get(__HIVE_P2_temp1929_7, "checkYieldAwaitInDefaultParams", 1941), __HIVE_P2_invoke(__HIVE_P2_temp1929_8, __HIVE_P2_temp1929_7, (__HIVE_P2_reserveArray(0, 1941), __HIVE_P2_ownArray([], 1941, "CONTROL_ARRAY")), 1941));
    }, 9, 1, 0, 1929)), 1927));
    (__HIVE_P2_temp0_1070 = $, __HIVE_P2_temp0_1071 = "parseClass", __HIVE_P2_set(__HIVE_P2_temp0_1070, __HIVE_P2_temp0_1071, (__HIVE_P2_reserveFunction(1945), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp1945_0, __HIVE_P2_temp1945_1, __HIVE_P2_temp1945_2, __HIVE_P2_temp1945_3, __HIVE_P2_temp1945_4, __HIVE_P2_temp1945_5, __HIVE_P2_temp1945_6, __HIVE_P2_temp1945_7, __HIVE_P2_temp1945_8, __HIVE_P2_temp1945_9, __HIVE_P2_temp1945_10, __HIVE_P2_temp1945_11, __HIVE_P2_temp1945_12, __HIVE_P2_temp1945_13, __HIVE_P2_temp1945_14, __HIVE_P2_temp1945_15, __HIVE_P2_temp1945_16, __HIVE_P2_temp1945_17, __HIVE_P2_temp1945_18, __HIVE_P2_temp1945_19, __HIVE_P2_temp1945_20, __HIVE_P2_temp1945_21, __HIVE_P2_temp1945_22, __HIVE_P2_temp1945_23, __HIVE_P2_temp1945_24, __HIVE_P2_temp1945_25, __HIVE_P2_temp1945_26, __HIVE_P2_temp1945_27, __HIVE_P2_temp1945_28, __HIVE_P2_temp1945_29, __HIVE_P2_temp1945_30, __HIVE_P2_temp1945_31, __HIVE_P2_temp1945_32, __HIVE_P2_temp1945_33, __HIVE_P2_temp1945_34, __HIVE_P2_temp1945_35, __HIVE_P2_temp1945_36;
        (__HIVE_P2_temp1945_0 = this, __HIVE_P2_temp1945_1 = __HIVE_P2_get(__HIVE_P2_temp1945_0, "next", 1946), __HIVE_P2_invoke(__HIVE_P2_temp1945_1, __HIVE_P2_temp1945_0, (__HIVE_P2_reserveArray(0, 1946), __HIVE_P2_ownArray([], 1946, "CONTROL_ARRAY")), 1946));
        var i = __HIVE_P2_get(this, "strict", 1948);
        (__HIVE_P2_temp1945_2 = this, __HIVE_P2_temp1945_3 = "strict", __HIVE_P2_set(__HIVE_P2_temp1945_2, __HIVE_P2_temp1945_3, true, 1949));
        (__HIVE_P2_temp1945_5 = this, __HIVE_P2_temp1945_6 = __HIVE_P2_get(__HIVE_P2_temp1945_5, "parseClassId", 1951), __HIVE_P2_invoke(__HIVE_P2_temp1945_6, __HIVE_P2_temp1945_5, (__HIVE_P2_reserveArray(2, 1951), __HIVE_P2_ownArray([e, t], 1951, "CONTROL_ARRAY")), 1951));
        (__HIVE_P2_temp1945_7 = this, __HIVE_P2_temp1945_8 = __HIVE_P2_get(__HIVE_P2_temp1945_7, "parseClassSuper", 1953), __HIVE_P2_invoke(__HIVE_P2_temp1945_8, __HIVE_P2_temp1945_7, (__HIVE_P2_reserveArray(1, 1953), __HIVE_P2_ownArray([e], 1953, "CONTROL_ARRAY")), 1953));
        var s = (__HIVE_P2_temp1945_9 = this, __HIVE_P2_temp1945_10 = __HIVE_P2_get(__HIVE_P2_temp1945_9, "enterClassBody", 1955), __HIVE_P2_invoke(__HIVE_P2_temp1945_10, __HIVE_P2_temp1945_9, (__HIVE_P2_reserveArray(0, 1955), __HIVE_P2_ownArray([], 1955, "CONTROL_ARRAY")), 1955));
        var r = (__HIVE_P2_temp1945_11 = this, __HIVE_P2_temp1945_12 = __HIVE_P2_get(__HIVE_P2_temp1945_11, "startNode", 1957), __HIVE_P2_invoke(__HIVE_P2_temp1945_12, __HIVE_P2_temp1945_11, (__HIVE_P2_reserveArray(0, 1957), __HIVE_P2_ownArray([], 1957, "CONTROL_ARRAY")), 1957));
        var a = false;
        (__HIVE_P2_temp1945_13 = r, __HIVE_P2_temp1945_14 = "body", __HIVE_P2_set(__HIVE_P2_temp1945_13, __HIVE_P2_temp1945_14, (__HIVE_P2_temp1945_16 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp1945_16, 1961), __HIVE_P2_reserveArray(0, 1961, 0), __HIVE_P2_ownArray([], 1961, "ARRAY", __HIVE_P2_temp1945_16)), 1959));
        (__HIVE_P2_temp1945_17 = this, __HIVE_P2_temp1945_18 = __HIVE_P2_get(__HIVE_P2_temp1945_17, "expect", 1962), __HIVE_P2_invoke(__HIVE_P2_temp1945_18, __HIVE_P2_temp1945_17, (__HIVE_P2_reserveArray(1, 1962), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceL", 1963)], 1962, "CONTROL_ARRAY")), 1962));
        while (__HIVE_P2_get(this, "type", 1966) !== __HIVE_P2_get(m, "braceR", 1967)) {
            __HIVE_P2_tick(1965);
            var n = (__HIVE_P2_temp1945_19 = this, __HIVE_P2_temp1945_20 = __HIVE_P2_get(__HIVE_P2_temp1945_19, "parseClassElement", 1968), __HIVE_P2_invoke(__HIVE_P2_temp1945_20, __HIVE_P2_temp1945_19, (__HIVE_P2_reserveArray(1, 1968), __HIVE_P2_ownArray([__HIVE_P2_get(e, "superClass", 1969) !== null], 1968, "CONTROL_ARRAY")), 1968));
            if (n) {
                (__HIVE_P2_temp1945_21 = __HIVE_P2_get(r, "body", 1973), __HIVE_P2_temp1945_22 = __HIVE_P2_get(__HIVE_P2_temp1945_21, "push", 1971), __HIVE_P2_invoke(__HIVE_P2_temp1945_22, __HIVE_P2_temp1945_21, (__HIVE_P2_reserveArray(1, 1971), __HIVE_P2_ownArray([n], 1971, "CONTROL_ARRAY")), 1971));
                if (__HIVE_P2_get(n, "type", 1974) === "MethodDefinition" && __HIVE_P2_get(n, "kind", 1975) === "constructor") {
                    if (a) {
                        __HIVE_P2_syntaxRefusal(1976);
                    }
                    a = true;
                }
                else if (__HIVE_P2_get(n, "key", 1978) && __HIVE_P2_get(__HIVE_P2_get(n, "key", 1980), "type", 1979) === "PrivateIdentifier" && __HIVE_P2_invoke(isPrivateNameConflicted, void 0, (__HIVE_P2_reserveArray(2, 1981), __HIVE_P2_ownArray([s, n], 1981, "CONTROL_ARRAY")), 1981)) {
                    __HIVE_P2_syntaxRefusal(1982);
                }
            }
        }
        (__HIVE_P2_temp1945_23 = this, __HIVE_P2_temp1945_24 = "strict", __HIVE_P2_set(__HIVE_P2_temp1945_23, __HIVE_P2_temp1945_24, i, 1983));
        (__HIVE_P2_temp1945_26 = this, __HIVE_P2_temp1945_27 = __HIVE_P2_get(__HIVE_P2_temp1945_26, "next", 1985), __HIVE_P2_invoke(__HIVE_P2_temp1945_27, __HIVE_P2_temp1945_26, (__HIVE_P2_reserveArray(0, 1985), __HIVE_P2_ownArray([], 1985, "CONTROL_ARRAY")), 1985));
        (__HIVE_P2_temp1945_28 = e, __HIVE_P2_temp1945_29 = "body", __HIVE_P2_set(__HIVE_P2_temp1945_28, __HIVE_P2_temp1945_29, (__HIVE_P2_temp1945_31 = this, __HIVE_P2_temp1945_32 = __HIVE_P2_get(__HIVE_P2_temp1945_31, "finishNode", 1989), __HIVE_P2_invoke(__HIVE_P2_temp1945_32, __HIVE_P2_temp1945_31, (__HIVE_P2_reserveArray(2, 1989), __HIVE_P2_ownArray([r, "ClassBody"], 1989, "CONTROL_ARRAY")), 1989)), 1987));
        (__HIVE_P2_temp1945_33 = this, __HIVE_P2_temp1945_34 = __HIVE_P2_get(__HIVE_P2_temp1945_33, "exitClassBody", 1991), __HIVE_P2_invoke(__HIVE_P2_temp1945_34, __HIVE_P2_temp1945_33, (__HIVE_P2_reserveArray(0, 1991), __HIVE_P2_ownArray([], 1991, "CONTROL_ARRAY")), 1991));
        return (__HIVE_P2_temp1945_35 = this, __HIVE_P2_temp1945_36 = __HIVE_P2_get(__HIVE_P2_temp1945_35, "finishNode", 1993), __HIVE_P2_invoke(__HIVE_P2_temp1945_36, __HIVE_P2_temp1945_35, (__HIVE_P2_reserveArray(2, 1993), __HIVE_P2_ownArray([e, t ? "ClassDeclaration" : "ClassExpression"], 1993, "CONTROL_ARRAY")), 1993));
    }, 42, 2, 0, 1945)), 1943));
    (__HIVE_P2_temp0_1073 = $, __HIVE_P2_temp0_1074 = "parseClassElement", __HIVE_P2_set(__HIVE_P2_temp0_1073, __HIVE_P2_temp0_1074, (__HIVE_P2_reserveFunction(1997), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp1997_0, __HIVE_P2_temp1997_1, __HIVE_P2_temp1997_2, __HIVE_P2_temp1997_3, __HIVE_P2_temp1997_4, __HIVE_P2_temp1997_5, __HIVE_P2_temp1997_6, __HIVE_P2_temp1997_7, __HIVE_P2_temp1997_8, __HIVE_P2_temp1997_9, __HIVE_P2_temp1997_10, __HIVE_P2_temp1997_11, __HIVE_P2_temp1997_12, __HIVE_P2_temp1997_13, __HIVE_P2_temp1997_14, __HIVE_P2_temp1997_15, __HIVE_P2_temp1997_16, __HIVE_P2_temp1997_17, __HIVE_P2_temp1997_18, __HIVE_P2_temp1997_19, __HIVE_P2_temp1997_20, __HIVE_P2_temp1997_21, __HIVE_P2_temp1997_22, __HIVE_P2_temp1997_23, __HIVE_P2_temp1997_24, __HIVE_P2_temp1997_25, __HIVE_P2_temp1997_26, __HIVE_P2_temp1997_27, __HIVE_P2_temp1997_28, __HIVE_P2_temp1997_29, __HIVE_P2_temp1997_30, __HIVE_P2_temp1997_31, __HIVE_P2_temp1997_32, __HIVE_P2_temp1997_33, __HIVE_P2_temp1997_34, __HIVE_P2_temp1997_35, __HIVE_P2_temp1997_36, __HIVE_P2_temp1997_37, __HIVE_P2_temp1997_38, __HIVE_P2_temp1997_39, __HIVE_P2_temp1997_40, __HIVE_P2_temp1997_41, __HIVE_P2_temp1997_42, __HIVE_P2_temp1997_43, __HIVE_P2_temp1997_44, __HIVE_P2_temp1997_45, __HIVE_P2_temp1997_46, __HIVE_P2_temp1997_47, __HIVE_P2_temp1997_48, __HIVE_P2_temp1997_49, __HIVE_P2_temp1997_50;
        if ((__HIVE_P2_temp1997_0 = this, __HIVE_P2_temp1997_1 = __HIVE_P2_get(__HIVE_P2_temp1997_0, "eat", 1998), __HIVE_P2_invoke(__HIVE_P2_temp1997_1, __HIVE_P2_temp1997_0, (__HIVE_P2_reserveArray(1, 1998), __HIVE_P2_ownArray([__HIVE_P2_get(m, "semi", 1999)], 1998, "CONTROL_ARRAY")), 1998))) {
            return null;
        }
        var t = __HIVE_P2_get(__HIVE_P2_get(this, "options", 2002), "ecmaVersion", 2001);
        var i = (__HIVE_P2_temp1997_2 = this, __HIVE_P2_temp1997_3 = __HIVE_P2_get(__HIVE_P2_temp1997_2, "startNode", 2003), __HIVE_P2_invoke(__HIVE_P2_temp1997_3, __HIVE_P2_temp1997_2, (__HIVE_P2_reserveArray(0, 2003), __HIVE_P2_ownArray([], 2003, "CONTROL_ARRAY")), 2003));
        var s = "";
        var r = false;
        var a = false;
        var n = "method";
        var o = false;
        if ((__HIVE_P2_temp1997_4 = this, __HIVE_P2_temp1997_5 = __HIVE_P2_get(__HIVE_P2_temp1997_4, "eatContextual", 2005), __HIVE_P2_invoke(__HIVE_P2_temp1997_5, __HIVE_P2_temp1997_4, (__HIVE_P2_reserveArray(1, 2005), __HIVE_P2_ownArray(["static"], 2005, "CONTROL_ARRAY")), 2005))) {
            if (__HIVE_P2_binary(">=", t, 13, 2007) && (__HIVE_P2_temp1997_6 = this, __HIVE_P2_temp1997_7 = __HIVE_P2_get(__HIVE_P2_temp1997_6, "eat", 2008), __HIVE_P2_invoke(__HIVE_P2_temp1997_7, __HIVE_P2_temp1997_6, (__HIVE_P2_reserveArray(1, 2008), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceL", 2009)], 2008, "CONTROL_ARRAY")), 2008))) {
                (__HIVE_P2_temp1997_8 = this, __HIVE_P2_temp1997_9 = __HIVE_P2_get(__HIVE_P2_temp1997_8, "parseClassStaticBlock", 2011), __HIVE_P2_invoke(__HIVE_P2_temp1997_9, __HIVE_P2_temp1997_8, (__HIVE_P2_reserveArray(1, 2011), __HIVE_P2_ownArray([i], 2011, "CONTROL_ARRAY")), 2011));
                return i;
            }
            if ((__HIVE_P2_temp1997_10 = this, __HIVE_P2_temp1997_11 = __HIVE_P2_get(__HIVE_P2_temp1997_10, "isClassElementNameStart", 2013), __HIVE_P2_invoke(__HIVE_P2_temp1997_11, __HIVE_P2_temp1997_10, (__HIVE_P2_reserveArray(0, 2013), __HIVE_P2_ownArray([], 2013, "CONTROL_ARRAY")), 2013)) || __HIVE_P2_get(this, "type", 2015) === __HIVE_P2_get(m, "star", 2016)) {
                o = true;
            }
            else {
                s = "static";
            }
        }
        (__HIVE_P2_temp1997_12 = i, __HIVE_P2_temp1997_13 = "static", __HIVE_P2_set(__HIVE_P2_temp1997_12, __HIVE_P2_temp1997_13, o, 2019));
        if (!s && __HIVE_P2_binary(">=", t, 8, 2021) && (__HIVE_P2_temp1997_15 = this, __HIVE_P2_temp1997_16 = __HIVE_P2_get(__HIVE_P2_temp1997_15, "eatContextual", 2022), __HIVE_P2_invoke(__HIVE_P2_temp1997_16, __HIVE_P2_temp1997_15, (__HIVE_P2_reserveArray(1, 2022), __HIVE_P2_ownArray(["async"], 2022, "CONTROL_ARRAY")), 2022))) {
            if (((__HIVE_P2_temp1997_17 = this, __HIVE_P2_temp1997_18 = __HIVE_P2_get(__HIVE_P2_temp1997_17, "isClassElementNameStart", 2024), __HIVE_P2_invoke(__HIVE_P2_temp1997_18, __HIVE_P2_temp1997_17, (__HIVE_P2_reserveArray(0, 2024), __HIVE_P2_ownArray([], 2024, "CONTROL_ARRAY")), 2024)) || __HIVE_P2_get(this, "type", 2026) === __HIVE_P2_get(m, "star", 2027)) && !(__HIVE_P2_temp1997_19 = this, __HIVE_P2_temp1997_20 = __HIVE_P2_get(__HIVE_P2_temp1997_19, "canInsertSemicolon", 2028), __HIVE_P2_invoke(__HIVE_P2_temp1997_20, __HIVE_P2_temp1997_19, (__HIVE_P2_reserveArray(0, 2028), __HIVE_P2_ownArray([], 2028, "CONTROL_ARRAY")), 2028))) {
                a = true;
            }
            else {
                s = "async";
            }
        }
        if (!s && (__HIVE_P2_binary(">=", t, 9, 2032) || !a) && (__HIVE_P2_temp1997_21 = this, __HIVE_P2_temp1997_22 = __HIVE_P2_get(__HIVE_P2_temp1997_21, "eat", 2033), __HIVE_P2_invoke(__HIVE_P2_temp1997_22, __HIVE_P2_temp1997_21, (__HIVE_P2_reserveArray(1, 2033), __HIVE_P2_ownArray([__HIVE_P2_get(m, "star", 2034)], 2033, "CONTROL_ARRAY")), 2033))) {
            r = true;
        }
        if (!s && !a && !r) {
            var h = __HIVE_P2_get(this, "value", 2037);
            if ((__HIVE_P2_temp1997_23 = this, __HIVE_P2_temp1997_24 = __HIVE_P2_get(__HIVE_P2_temp1997_23, "eatContextual", 2038), __HIVE_P2_invoke(__HIVE_P2_temp1997_24, __HIVE_P2_temp1997_23, (__HIVE_P2_reserveArray(1, 2038), __HIVE_P2_ownArray(["get"], 2038, "CONTROL_ARRAY")), 2038)) || (__HIVE_P2_temp1997_25 = this, __HIVE_P2_temp1997_26 = __HIVE_P2_get(__HIVE_P2_temp1997_25, "eatContextual", 2040), __HIVE_P2_invoke(__HIVE_P2_temp1997_26, __HIVE_P2_temp1997_25, (__HIVE_P2_reserveArray(1, 2040), __HIVE_P2_ownArray(["set"], 2040, "CONTROL_ARRAY")), 2040))) {
                if ((__HIVE_P2_temp1997_27 = this, __HIVE_P2_temp1997_28 = __HIVE_P2_get(__HIVE_P2_temp1997_27, "isClassElementNameStart", 2042), __HIVE_P2_invoke(__HIVE_P2_temp1997_28, __HIVE_P2_temp1997_27, (__HIVE_P2_reserveArray(0, 2042), __HIVE_P2_ownArray([], 2042, "CONTROL_ARRAY")), 2042))) {
                    n = h;
                }
                else {
                    s = h;
                }
            }
        }
        if (s) {
            (__HIVE_P2_temp1997_29 = i, __HIVE_P2_temp1997_30 = "computed", __HIVE_P2_set(__HIVE_P2_temp1997_29, __HIVE_P2_temp1997_30, false, 2046));
            (__HIVE_P2_temp1997_32 = i, __HIVE_P2_temp1997_33 = "key", __HIVE_P2_set(__HIVE_P2_temp1997_32, __HIVE_P2_temp1997_33, (__HIVE_P2_temp1997_35 = this, __HIVE_P2_temp1997_36 = __HIVE_P2_get(__HIVE_P2_temp1997_35, "startNodeAt", 2050), __HIVE_P2_invoke(__HIVE_P2_temp1997_36, __HIVE_P2_temp1997_35, (__HIVE_P2_reserveArray(2, 2050), __HIVE_P2_ownArray([__HIVE_P2_get(this, "lastTokStart", 2051), __HIVE_P2_get(this, "lastTokStartLoc", 2052)], 2050, "CONTROL_ARRAY")), 2050)), 2048));
            (__HIVE_P2_temp1997_37 = __HIVE_P2_get(i, "key", 2056), __HIVE_P2_temp1997_38 = "name", __HIVE_P2_set(__HIVE_P2_temp1997_37, __HIVE_P2_temp1997_38, s, 2054));
            (__HIVE_P2_temp1997_40 = this, __HIVE_P2_temp1997_41 = __HIVE_P2_get(__HIVE_P2_temp1997_40, "finishNode", 2057), __HIVE_P2_invoke(__HIVE_P2_temp1997_41, __HIVE_P2_temp1997_40, (__HIVE_P2_reserveArray(2, 2057), __HIVE_P2_ownArray([__HIVE_P2_get(i, "key", 2058), "Identifier"], 2057, "CONTROL_ARRAY")), 2057));
        }
        else {
            (__HIVE_P2_temp1997_42 = this, __HIVE_P2_temp1997_43 = __HIVE_P2_get(__HIVE_P2_temp1997_42, "parseClassElementName", 2060), __HIVE_P2_invoke(__HIVE_P2_temp1997_43, __HIVE_P2_temp1997_42, (__HIVE_P2_reserveArray(1, 2060), __HIVE_P2_ownArray([i], 2060, "CONTROL_ARRAY")), 2060));
        }
        if (__HIVE_P2_binary("<", t, 13, 2062) || __HIVE_P2_get(this, "type", 2063) === __HIVE_P2_get(m, "parenL", 2064) || n !== "method" || r || a) {
            var p = !__HIVE_P2_get(i, "static", 2065) && __HIVE_P2_invoke(checkKeyName, void 0, (__HIVE_P2_reserveArray(2, 2066), __HIVE_P2_ownArray([i, "constructor"], 2066, "CONTROL_ARRAY")), 2066);
            var c = p && e;
            if (p && n !== "method") {
                __HIVE_P2_syntaxRefusal(2067);
            }
            (__HIVE_P2_temp1997_44 = i, __HIVE_P2_temp1997_45 = "kind", __HIVE_P2_set(__HIVE_P2_temp1997_44, __HIVE_P2_temp1997_45, p ? "constructor" : n, 2068));
            (__HIVE_P2_temp1997_47 = this, __HIVE_P2_temp1997_48 = __HIVE_P2_get(__HIVE_P2_temp1997_47, "parseClassMethod", 2070), __HIVE_P2_invoke(__HIVE_P2_temp1997_48, __HIVE_P2_temp1997_47, (__HIVE_P2_reserveArray(4, 2070), __HIVE_P2_ownArray([i, r, a, c], 2070, "CONTROL_ARRAY")), 2070));
        }
        else {
            (__HIVE_P2_temp1997_49 = this, __HIVE_P2_temp1997_50 = __HIVE_P2_get(__HIVE_P2_temp1997_49, "parseClassField", 2072), __HIVE_P2_invoke(__HIVE_P2_temp1997_50, __HIVE_P2_temp1997_49, (__HIVE_P2_reserveArray(1, 2072), __HIVE_P2_ownArray([i], 2072, "CONTROL_ARRAY")), 2072));
        }
        return i;
    }, 61, 1, 0, 1997)), 1995));
    (__HIVE_P2_temp0_1076 = $, __HIVE_P2_temp0_1077 = "isClassElementNameStart", __HIVE_P2_set(__HIVE_P2_temp0_1076, __HIVE_P2_temp0_1077, (__HIVE_P2_reserveFunction(2076), __HIVE_P2_registerFunction(function () {
        return __HIVE_P2_get(this, "type", 2077) === __HIVE_P2_get(m, "name", 2078) || __HIVE_P2_get(this, "type", 2079) === __HIVE_P2_get(m, "privateId", 2080) || __HIVE_P2_get(this, "type", 2081) === __HIVE_P2_get(m, "num", 2082) || __HIVE_P2_get(this, "type", 2083) === __HIVE_P2_get(m, "string", 2084) || __HIVE_P2_get(this, "type", 2085) === __HIVE_P2_get(m, "bracketL", 2086) || __HIVE_P2_get(__HIVE_P2_get(this, "type", 2088), "keyword", 2087);
    }, 0, 0, 0, 2076)), 2074));
    (__HIVE_P2_temp0_1079 = $, __HIVE_P2_temp0_1080 = "parseClassElementName", __HIVE_P2_set(__HIVE_P2_temp0_1079, __HIVE_P2_temp0_1080, (__HIVE_P2_reserveFunction(2091), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp2091_0, __HIVE_P2_temp2091_1, __HIVE_P2_temp2091_2, __HIVE_P2_temp2091_3, __HIVE_P2_temp2091_4, __HIVE_P2_temp2091_5, __HIVE_P2_temp2091_6, __HIVE_P2_temp2091_7, __HIVE_P2_temp2091_8, __HIVE_P2_temp2091_9;
        if (__HIVE_P2_get(this, "type", 2092) === __HIVE_P2_get(m, "privateId", 2093)) {
            if (__HIVE_P2_get(this, "value", 2094) === "constructor") {
                __HIVE_P2_syntaxRefusal(2095);
            }
            (__HIVE_P2_temp2091_0 = e, __HIVE_P2_temp2091_1 = "computed", __HIVE_P2_set(__HIVE_P2_temp2091_0, __HIVE_P2_temp2091_1, false, 2096));
            (__HIVE_P2_temp2091_3 = e, __HIVE_P2_temp2091_4 = "key", __HIVE_P2_set(__HIVE_P2_temp2091_3, __HIVE_P2_temp2091_4, (__HIVE_P2_temp2091_6 = this, __HIVE_P2_temp2091_7 = __HIVE_P2_get(__HIVE_P2_temp2091_6, "parsePrivateIdent", 2100), __HIVE_P2_invoke(__HIVE_P2_temp2091_7, __HIVE_P2_temp2091_6, (__HIVE_P2_reserveArray(0, 2100), __HIVE_P2_ownArray([], 2100, "CONTROL_ARRAY")), 2100)), 2098));
        }
        else {
            (__HIVE_P2_temp2091_8 = this, __HIVE_P2_temp2091_9 = __HIVE_P2_get(__HIVE_P2_temp2091_8, "parsePropertyName", 2102), __HIVE_P2_invoke(__HIVE_P2_temp2091_9, __HIVE_P2_temp2091_8, (__HIVE_P2_reserveArray(1, 2102), __HIVE_P2_ownArray([e], 2102, "CONTROL_ARRAY")), 2102));
        }
    }, 10, 1, 0, 2091)), 2089));
    (__HIVE_P2_temp0_1082 = $, __HIVE_P2_temp0_1083 = "parseClassMethod", __HIVE_P2_set(__HIVE_P2_temp0_1082, __HIVE_P2_temp0_1083, (__HIVE_P2_reserveFunction(2106), __HIVE_P2_registerFunction(function (e, t, i, s) {
        var __HIVE_P2_temp2106_0, __HIVE_P2_temp2106_1, __HIVE_P2_temp2106_2, __HIVE_P2_temp2106_3, __HIVE_P2_temp2106_4, __HIVE_P2_temp2106_5, __HIVE_P2_temp2106_6;
        var r = __HIVE_P2_get(e, "key", 2107);
        if (__HIVE_P2_get(e, "kind", 2108) === "constructor") {
            if (t) {
                __HIVE_P2_syntaxRefusal(2109);
            }
            if (i) {
                __HIVE_P2_syntaxRefusal(2110);
            }
        }
        else if (__HIVE_P2_get(e, "static", 2111) && __HIVE_P2_invoke(checkKeyName, void 0, (__HIVE_P2_reserveArray(2, 2112), __HIVE_P2_ownArray([e, "prototype"], 2112, "CONTROL_ARRAY")), 2112)) {
            __HIVE_P2_syntaxRefusal(2113);
        }
        var a = (__HIVE_P2_temp2106_0 = e, __HIVE_P2_temp2106_1 = "value", __HIVE_P2_set(__HIVE_P2_temp2106_0, __HIVE_P2_temp2106_1, (__HIVE_P2_temp2106_3 = this, __HIVE_P2_temp2106_4 = __HIVE_P2_get(__HIVE_P2_temp2106_3, "parseMethod", 2116), __HIVE_P2_invoke(__HIVE_P2_temp2106_4, __HIVE_P2_temp2106_3, (__HIVE_P2_reserveArray(3, 2116), __HIVE_P2_ownArray([t, i, s], 2116, "CONTROL_ARRAY")), 2116)), 2114));
        if (__HIVE_P2_get(e, "kind", 2118) === "get" && __HIVE_P2_get(__HIVE_P2_get(a, "params", 2120), "length", 2119) !== 0) {
            __HIVE_P2_syntaxRefusal(2121);
        }
        if (__HIVE_P2_get(e, "kind", 2122) === "set" && __HIVE_P2_get(__HIVE_P2_get(a, "params", 2124), "length", 2123) !== 1) {
            __HIVE_P2_syntaxRefusal(2125);
        }
        if (__HIVE_P2_get(e, "kind", 2126) === "set" && __HIVE_P2_get(__HIVE_P2_get(__HIVE_P2_get(a, "params", 2129), 0, 2128), "type", 2127) === "RestElement") {
            __HIVE_P2_syntaxRefusal(2130);
        }
        return (__HIVE_P2_temp2106_5 = this, __HIVE_P2_temp2106_6 = __HIVE_P2_get(__HIVE_P2_temp2106_5, "finishNode", 2131), __HIVE_P2_invoke(__HIVE_P2_temp2106_6, __HIVE_P2_temp2106_5, (__HIVE_P2_reserveArray(2, 2131), __HIVE_P2_ownArray([e, "MethodDefinition"], 2131, "CONTROL_ARRAY")), 2131));
    }, 9, 4, 0, 2106)), 2104));
    (__HIVE_P2_temp0_1085 = $, __HIVE_P2_temp0_1086 = "parseClassField", __HIVE_P2_set(__HIVE_P2_temp0_1085, __HIVE_P2_temp0_1086, (__HIVE_P2_reserveFunction(2135), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp2135_0, __HIVE_P2_temp2135_1, __HIVE_P2_temp2135_2, __HIVE_P2_temp2135_3, __HIVE_P2_temp2135_4, __HIVE_P2_temp2135_5, __HIVE_P2_temp2135_6, __HIVE_P2_temp2135_7, __HIVE_P2_temp2135_8, __HIVE_P2_temp2135_9, __HIVE_P2_temp2135_10, __HIVE_P2_temp2135_11, __HIVE_P2_temp2135_12, __HIVE_P2_temp2135_13, __HIVE_P2_temp2135_14, __HIVE_P2_temp2135_15, __HIVE_P2_temp2135_16, __HIVE_P2_temp2135_17, __HIVE_P2_temp2135_18, __HIVE_P2_temp2135_19, __HIVE_P2_temp2135_20, __HIVE_P2_temp2135_21;
        if (__HIVE_P2_invoke(checkKeyName, void 0, (__HIVE_P2_reserveArray(2, 2136), __HIVE_P2_ownArray([e, "constructor"], 2136, "CONTROL_ARRAY")), 2136)) {
            __HIVE_P2_syntaxRefusal(2137);
        }
        else if (__HIVE_P2_get(e, "static", 2138) && __HIVE_P2_invoke(checkKeyName, void 0, (__HIVE_P2_reserveArray(2, 2139), __HIVE_P2_ownArray([e, "prototype"], 2139, "CONTROL_ARRAY")), 2139)) {
            __HIVE_P2_syntaxRefusal(2140);
        }
        if ((__HIVE_P2_temp2135_0 = this, __HIVE_P2_temp2135_1 = __HIVE_P2_get(__HIVE_P2_temp2135_0, "eat", 2141), __HIVE_P2_invoke(__HIVE_P2_temp2135_1, __HIVE_P2_temp2135_0, (__HIVE_P2_reserveArray(1, 2141), __HIVE_P2_ownArray([__HIVE_P2_get(m, "eq", 2142)], 2141, "CONTROL_ARRAY")), 2141))) {
            var t = (__HIVE_P2_temp2135_2 = this, __HIVE_P2_temp2135_3 = __HIVE_P2_get(__HIVE_P2_temp2135_2, "currentThisScope", 2144), __HIVE_P2_invoke(__HIVE_P2_temp2135_3, __HIVE_P2_temp2135_2, (__HIVE_P2_reserveArray(0, 2144), __HIVE_P2_ownArray([], 2144, "CONTROL_ARRAY")), 2144));
            var i = __HIVE_P2_get(t, "inClassFieldInit", 2146);
            (__HIVE_P2_temp2135_4 = t, __HIVE_P2_temp2135_5 = "inClassFieldInit", __HIVE_P2_set(__HIVE_P2_temp2135_4, __HIVE_P2_temp2135_5, true, 2147));
            (__HIVE_P2_temp2135_7 = e, __HIVE_P2_temp2135_8 = "value", __HIVE_P2_set(__HIVE_P2_temp2135_7, __HIVE_P2_temp2135_8, (__HIVE_P2_temp2135_10 = this, __HIVE_P2_temp2135_11 = __HIVE_P2_get(__HIVE_P2_temp2135_10, "parseMaybeAssign", 2151), __HIVE_P2_invoke(__HIVE_P2_temp2135_11, __HIVE_P2_temp2135_10, (__HIVE_P2_reserveArray(0, 2151), __HIVE_P2_ownArray([], 2151, "CONTROL_ARRAY")), 2151)), 2149));
            (__HIVE_P2_temp2135_12 = t, __HIVE_P2_temp2135_13 = "inClassFieldInit", __HIVE_P2_set(__HIVE_P2_temp2135_12, __HIVE_P2_temp2135_13, i, 2153));
        }
        else {
            (__HIVE_P2_temp2135_15 = e, __HIVE_P2_temp2135_16 = "value", __HIVE_P2_set(__HIVE_P2_temp2135_15, __HIVE_P2_temp2135_16, null, 2155));
        }
        (__HIVE_P2_temp2135_18 = this, __HIVE_P2_temp2135_19 = __HIVE_P2_get(__HIVE_P2_temp2135_18, "semicolon", 2157), __HIVE_P2_invoke(__HIVE_P2_temp2135_19, __HIVE_P2_temp2135_18, (__HIVE_P2_reserveArray(0, 2157), __HIVE_P2_ownArray([], 2157, "CONTROL_ARRAY")), 2157));
        return (__HIVE_P2_temp2135_20 = this, __HIVE_P2_temp2135_21 = __HIVE_P2_get(__HIVE_P2_temp2135_20, "finishNode", 2159), __HIVE_P2_invoke(__HIVE_P2_temp2135_21, __HIVE_P2_temp2135_20, (__HIVE_P2_reserveArray(2, 2159), __HIVE_P2_ownArray([e, "PropertyDefinition"], 2159, "CONTROL_ARRAY")), 2159));
    }, 24, 1, 0, 2135)), 2133));
    (__HIVE_P2_temp0_1088 = $, __HIVE_P2_temp0_1089 = "parseClassStaticBlock", __HIVE_P2_set(__HIVE_P2_temp0_1088, __HIVE_P2_temp0_1089, (__HIVE_P2_reserveFunction(2163), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp2163_0, __HIVE_P2_temp2163_1, __HIVE_P2_temp2163_2, __HIVE_P2_temp2163_3, __HIVE_P2_temp2163_4, __HIVE_P2_temp2163_5, __HIVE_P2_temp2163_6, __HIVE_P2_temp2163_7, __HIVE_P2_temp2163_8, __HIVE_P2_temp2163_9, __HIVE_P2_temp2163_10, __HIVE_P2_temp2163_11, __HIVE_P2_temp2163_12, __HIVE_P2_temp2163_13, __HIVE_P2_temp2163_14, __HIVE_P2_temp2163_15, __HIVE_P2_temp2163_16, __HIVE_P2_temp2163_17, __HIVE_P2_temp2163_18, __HIVE_P2_temp2163_19, __HIVE_P2_temp2163_20, __HIVE_P2_temp2163_21, __HIVE_P2_temp2163_22;
        (__HIVE_P2_temp2163_0 = e, __HIVE_P2_temp2163_1 = "body", __HIVE_P2_set(__HIVE_P2_temp2163_0, __HIVE_P2_temp2163_1, (__HIVE_P2_temp2163_3 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp2163_3, 2166), __HIVE_P2_reserveArray(0, 2166, 0), __HIVE_P2_ownArray([], 2166, "ARRAY", __HIVE_P2_temp2163_3)), 2164));
        var t = __HIVE_P2_get(this, "labels", 2167);
        (__HIVE_P2_temp2163_4 = this, __HIVE_P2_temp2163_5 = "labels", __HIVE_P2_set(__HIVE_P2_temp2163_4, __HIVE_P2_temp2163_5, (__HIVE_P2_temp2163_7 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp2163_7, 2170), __HIVE_P2_reserveArray(0, 2170, 0), __HIVE_P2_ownArray([], 2170, "ARRAY", __HIVE_P2_temp2163_7)), 2168));
        (__HIVE_P2_temp2163_8 = this, __HIVE_P2_temp2163_9 = __HIVE_P2_get(__HIVE_P2_temp2163_8, "enterScope", 2171), __HIVE_P2_invoke(__HIVE_P2_temp2163_9, __HIVE_P2_temp2163_8, (__HIVE_P2_reserveArray(1, 2171), __HIVE_P2_ownArray([__HIVE_P2_binary("|", F, B, 2172)], 2171, "CONTROL_ARRAY")), 2171));
        while (__HIVE_P2_get(this, "type", 2175) !== __HIVE_P2_get(m, "braceR", 2176)) {
            __HIVE_P2_tick(2174);
            var i = (__HIVE_P2_temp2163_10 = this, __HIVE_P2_temp2163_11 = __HIVE_P2_get(__HIVE_P2_temp2163_10, "parseStatement", 2177), __HIVE_P2_invoke(__HIVE_P2_temp2163_11, __HIVE_P2_temp2163_10, (__HIVE_P2_reserveArray(1, 2177), __HIVE_P2_ownArray([null], 2177, "CONTROL_ARRAY")), 2177));
            (__HIVE_P2_temp2163_12 = __HIVE_P2_get(e, "body", 2181), __HIVE_P2_temp2163_13 = __HIVE_P2_get(__HIVE_P2_temp2163_12, "push", 2179), __HIVE_P2_invoke(__HIVE_P2_temp2163_13, __HIVE_P2_temp2163_12, (__HIVE_P2_reserveArray(1, 2179), __HIVE_P2_ownArray([i], 2179, "CONTROL_ARRAY")), 2179));
        }
        (__HIVE_P2_temp2163_14 = this, __HIVE_P2_temp2163_15 = __HIVE_P2_get(__HIVE_P2_temp2163_14, "next", 2182), __HIVE_P2_invoke(__HIVE_P2_temp2163_15, __HIVE_P2_temp2163_14, (__HIVE_P2_reserveArray(0, 2182), __HIVE_P2_ownArray([], 2182, "CONTROL_ARRAY")), 2182));
        (__HIVE_P2_temp2163_16 = this, __HIVE_P2_temp2163_17 = __HIVE_P2_get(__HIVE_P2_temp2163_16, "exitScope", 2184), __HIVE_P2_invoke(__HIVE_P2_temp2163_17, __HIVE_P2_temp2163_16, (__HIVE_P2_reserveArray(0, 2184), __HIVE_P2_ownArray([], 2184, "CONTROL_ARRAY")), 2184));
        (__HIVE_P2_temp2163_18 = this, __HIVE_P2_temp2163_19 = "labels", __HIVE_P2_set(__HIVE_P2_temp2163_18, __HIVE_P2_temp2163_19, t, 2186));
        return (__HIVE_P2_temp2163_21 = this, __HIVE_P2_temp2163_22 = __HIVE_P2_get(__HIVE_P2_temp2163_21, "finishNode", 2188), __HIVE_P2_invoke(__HIVE_P2_temp2163_22, __HIVE_P2_temp2163_21, (__HIVE_P2_reserveArray(2, 2188), __HIVE_P2_ownArray([e, "StaticBlock"], 2188, "CONTROL_ARRAY")), 2188));
    }, 25, 1, 0, 2163)), 2161));
    (__HIVE_P2_temp0_1091 = $, __HIVE_P2_temp0_1092 = "parseClassId", __HIVE_P2_set(__HIVE_P2_temp0_1091, __HIVE_P2_temp0_1092, (__HIVE_P2_reserveFunction(2192), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp2192_0, __HIVE_P2_temp2192_1, __HIVE_P2_temp2192_2, __HIVE_P2_temp2192_3, __HIVE_P2_temp2192_4, __HIVE_P2_temp2192_5, __HIVE_P2_temp2192_6, __HIVE_P2_temp2192_7, __HIVE_P2_temp2192_8, __HIVE_P2_temp2192_9;
        if (__HIVE_P2_get(this, "type", 2193) === __HIVE_P2_get(m, "name", 2194)) {
            (__HIVE_P2_temp2192_0 = e, __HIVE_P2_temp2192_1 = "id", __HIVE_P2_set(__HIVE_P2_temp2192_0, __HIVE_P2_temp2192_1, (__HIVE_P2_temp2192_3 = this, __HIVE_P2_temp2192_4 = __HIVE_P2_get(__HIVE_P2_temp2192_3, "parseIdent", 2197), __HIVE_P2_invoke(__HIVE_P2_temp2192_4, __HIVE_P2_temp2192_3, (__HIVE_P2_reserveArray(0, 2197), __HIVE_P2_ownArray([], 2197, "CONTROL_ARRAY")), 2197)), 2195));
            if (t) {
                (__HIVE_P2_temp2192_5 = this, __HIVE_P2_temp2192_6 = __HIVE_P2_get(__HIVE_P2_temp2192_5, "checkLValSimple", 2199), __HIVE_P2_invoke(__HIVE_P2_temp2192_6, __HIVE_P2_temp2192_5, (__HIVE_P2_reserveArray(3, 2199), __HIVE_P2_ownArray([__HIVE_P2_get(e, "id", 2200), G, false], 2199, "CONTROL_ARRAY")), 2199));
            }
        }
        else {
            if (t === true) {
                __HIVE_P2_syntaxRefusal(2202);
            }
            (__HIVE_P2_temp2192_7 = e, __HIVE_P2_temp2192_8 = "id", __HIVE_P2_set(__HIVE_P2_temp2192_7, __HIVE_P2_temp2192_8, null, 2203));
        }
    }, 10, 2, 0, 2192)), 2190));
    (__HIVE_P2_temp0_1094 = $, __HIVE_P2_temp0_1095 = "parseClassSuper", __HIVE_P2_set(__HIVE_P2_temp0_1094, __HIVE_P2_temp0_1095, (__HIVE_P2_reserveFunction(2207), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp2207_0, __HIVE_P2_temp2207_1, __HIVE_P2_temp2207_2, __HIVE_P2_temp2207_3, __HIVE_P2_temp2207_4, __HIVE_P2_temp2207_5, __HIVE_P2_temp2207_6;
        (__HIVE_P2_temp2207_0 = e, __HIVE_P2_temp2207_1 = "superClass", __HIVE_P2_set(__HIVE_P2_temp2207_0, __HIVE_P2_temp2207_1, (__HIVE_P2_temp2207_3 = this, __HIVE_P2_temp2207_4 = __HIVE_P2_get(__HIVE_P2_temp2207_3, "eat", 2210), __HIVE_P2_invoke(__HIVE_P2_temp2207_4, __HIVE_P2_temp2207_3, (__HIVE_P2_reserveArray(1, 2210), __HIVE_P2_ownArray([__HIVE_P2_get(m, "_extends", 2211)], 2210, "CONTROL_ARRAY")), 2210)) ? (__HIVE_P2_temp2207_5 = this, __HIVE_P2_temp2207_6 = __HIVE_P2_get(__HIVE_P2_temp2207_5, "parseExprSubscripts", 2213), __HIVE_P2_invoke(__HIVE_P2_temp2207_6, __HIVE_P2_temp2207_5, (__HIVE_P2_reserveArray(2, 2213), __HIVE_P2_ownArray([null, false], 2213, "CONTROL_ARRAY")), 2213)) : null, 2208));
    }, 7, 1, 0, 2207)), 2205));
    (__HIVE_P2_temp0_1097 = $, __HIVE_P2_temp0_1098 = "enterClassBody", __HIVE_P2_set(__HIVE_P2_temp0_1097, __HIVE_P2_temp0_1098, (__HIVE_P2_reserveFunction(2217), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp2217_0, __HIVE_P2_temp2217_1, __HIVE_P2_temp2217_2, __HIVE_P2_temp2217_3, __HIVE_P2_temp2217_4;
        var e = (__HIVE_P2_reserveObject(2, 2218), __HIVE_P2_ownObject({ declared: (__HIVE_P2_temp2217_0 = __HIVE_P2_Object, __HIVE_P2_temp2217_1 = __HIVE_P2_get(__HIVE_P2_temp2217_0, "create", 2219), __HIVE_P2_invoke(__HIVE_P2_temp2217_1, __HIVE_P2_temp2217_0, (__HIVE_P2_reserveArray(1, 2219), __HIVE_P2_ownArray([null], 2219, "CONTROL_ARRAY")), 2219)), used: (__HIVE_P2_temp2217_2 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp2217_2, 2221), __HIVE_P2_reserveArray(0, 2221, 0), __HIVE_P2_ownArray([], 2221, "ARRAY", __HIVE_P2_temp2217_2)) }, 2218, 2, 12));
        (__HIVE_P2_temp2217_3 = __HIVE_P2_get(this, "privateNameStack", 2224), __HIVE_P2_temp2217_4 = __HIVE_P2_get(__HIVE_P2_temp2217_3, "push", 2222), __HIVE_P2_invoke(__HIVE_P2_temp2217_4, __HIVE_P2_temp2217_3, (__HIVE_P2_reserveArray(1, 2222), __HIVE_P2_ownArray([e], 2222, "CONTROL_ARRAY")), 2222));
        return __HIVE_P2_get(e, "declared", 2225);
    }, 6, 0, 0, 2217)), 2215));
    (__HIVE_P2_temp0_1100 = $, __HIVE_P2_temp0_1101 = "exitClassBody", __HIVE_P2_set(__HIVE_P2_temp0_1100, __HIVE_P2_temp0_1101, (__HIVE_P2_reserveFunction(2228), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp2228_0, __HIVE_P2_temp2228_1, __HIVE_P2_temp2228_2, __HIVE_P2_temp2228_3, __HIVE_P2_temp2228_4, __HIVE_P2_temp2228_5;
        var e = (__HIVE_P2_temp2228_0 = __HIVE_P2_get(this, "privateNameStack", 2231), __HIVE_P2_temp2228_1 = __HIVE_P2_get(__HIVE_P2_temp2228_0, "pop", 2229), __HIVE_P2_invoke(__HIVE_P2_temp2228_1, __HIVE_P2_temp2228_0, (__HIVE_P2_reserveArray(0, 2229), __HIVE_P2_ownArray([], 2229, "CONTROL_ARRAY")), 2229));
        var t = __HIVE_P2_get(e, "declared", 2232);
        var i = __HIVE_P2_get(e, "used", 2233);
        if (!__HIVE_P2_get(__HIVE_P2_get(this, "options", 2235), "checkPrivateFields", 2234)) {
            return;
        }
        var s = __HIVE_P2_get(__HIVE_P2_get(this, "privateNameStack", 2237), "length", 2236);
        var r = s === 0 ? null : __HIVE_P2_get(__HIVE_P2_get(this, "privateNameStack", 2239), __HIVE_P2_binary("-", s, 1, 2240), 2238);
        for (var a = 0; __HIVE_P2_binary("<", a, __HIVE_P2_get(i, "length", 2243), 2242); (__HIVE_P2_temp2228_2 = __HIVE_P2_numeric(a, 2244), __HIVE_P2_temp2228_3 = __HIVE_P2_temp2228_2 + 1, a = __HIVE_P2_temp2228_3, __HIVE_P2_temp2228_3)) {
            __HIVE_P2_tick(2241);
            var n = __HIVE_P2_get(i, a, 2245);
            if (!__HIVE_P2_invoke(S, void 0, (__HIVE_P2_reserveArray(2, 2246), __HIVE_P2_ownArray([t, __HIVE_P2_get(n, "name", 2247)], 2246, "CONTROL_ARRAY")), 2246)) {
                if (r) {
                    (__HIVE_P2_temp2228_4 = __HIVE_P2_get(r, "used", 2250), __HIVE_P2_temp2228_5 = __HIVE_P2_get(__HIVE_P2_temp2228_4, "push", 2248), __HIVE_P2_invoke(__HIVE_P2_temp2228_5, __HIVE_P2_temp2228_4, (__HIVE_P2_reserveArray(1, 2248), __HIVE_P2_ownArray([n], 2248, "CONTROL_ARRAY")), 2248));
                }
                else {
                    __HIVE_P2_syntaxRefusal(2251);
                }
            }
        }
    }, 13, 0, 0, 2228)), 2226));
    function isPrivateNameConflicted(e, t) {
        var __HIVE_P2_temp2252_0, __HIVE_P2_temp2252_1, __HIVE_P2_temp2252_2, __HIVE_P2_temp2252_3, __HIVE_P2_temp2252_4, __HIVE_P2_temp2252_5;
        var i = __HIVE_P2_get(__HIVE_P2_get(t, "key", 2254), "name", 2253);
        var s = __HIVE_P2_get(e, i, 2255);
        var r = "true";
        if (__HIVE_P2_get(t, "type", 2256) === "MethodDefinition" && (__HIVE_P2_get(t, "kind", 2257) === "get" || __HIVE_P2_get(t, "kind", 2258) === "set")) {
            r = __HIVE_P2_binary("+", (__HIVE_P2_get(t, "static", 2261) ? "s" : "i"), __HIVE_P2_get(t, "kind", 2262), 2260);
        }
        if (s === "iget" && r === "iset" || s === "iset" && r === "iget" || s === "sget" && r === "sset" || s === "sset" && r === "sget") {
            (__HIVE_P2_temp2252_0 = e, __HIVE_P2_temp2252_1 = i, __HIVE_P2_set(__HIVE_P2_temp2252_0, __HIVE_P2_temp2252_1, "true", 2263));
            return false;
        }
        else if (!s) {
            (__HIVE_P2_temp2252_3 = e, __HIVE_P2_temp2252_4 = i, __HIVE_P2_set(__HIVE_P2_temp2252_3, __HIVE_P2_temp2252_4, r, 2265));
            return false;
        }
        else {
            return true;
        }
    }
    function checkKeyName(e, t) {
        var i = __HIVE_P2_get(e, "computed", 2268);
        var s = __HIVE_P2_get(e, "key", 2269);
        return !i && (__HIVE_P2_get(s, "type", 2270) === "Identifier" && __HIVE_P2_get(s, "name", 2271) === t || __HIVE_P2_get(s, "type", 2272) === "Literal" && __HIVE_P2_get(s, "value", 2273) === t);
    }
    (__HIVE_P2_temp0_1103 = $, __HIVE_P2_temp0_1104 = "parseExportAllDeclaration", __HIVE_P2_set(__HIVE_P2_temp0_1103, __HIVE_P2_temp0_1104, (__HIVE_P2_reserveFunction(2276), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp2276_0, __HIVE_P2_temp2276_1, __HIVE_P2_temp2276_2, __HIVE_P2_temp2276_3, __HIVE_P2_temp2276_4, __HIVE_P2_temp2276_5, __HIVE_P2_temp2276_6, __HIVE_P2_temp2276_7, __HIVE_P2_temp2276_8, __HIVE_P2_temp2276_9, __HIVE_P2_temp2276_10, __HIVE_P2_temp2276_11, __HIVE_P2_temp2276_12, __HIVE_P2_temp2276_13, __HIVE_P2_temp2276_14, __HIVE_P2_temp2276_15, __HIVE_P2_temp2276_16, __HIVE_P2_temp2276_17, __HIVE_P2_temp2276_18, __HIVE_P2_temp2276_19, __HIVE_P2_temp2276_20, __HIVE_P2_temp2276_21, __HIVE_P2_temp2276_22, __HIVE_P2_temp2276_23, __HIVE_P2_temp2276_24, __HIVE_P2_temp2276_25, __HIVE_P2_temp2276_26, __HIVE_P2_temp2276_27;
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 2279), "ecmaVersion", 2278), 11, 2277)) {
            if ((__HIVE_P2_temp2276_0 = this, __HIVE_P2_temp2276_1 = __HIVE_P2_get(__HIVE_P2_temp2276_0, "eatContextual", 2280), __HIVE_P2_invoke(__HIVE_P2_temp2276_1, __HIVE_P2_temp2276_0, (__HIVE_P2_reserveArray(1, 2280), __HIVE_P2_ownArray(["as"], 2280, "CONTROL_ARRAY")), 2280))) {
                (__HIVE_P2_temp2276_2 = e, __HIVE_P2_temp2276_3 = "exported", __HIVE_P2_set(__HIVE_P2_temp2276_2, __HIVE_P2_temp2276_3, (__HIVE_P2_temp2276_5 = this, __HIVE_P2_temp2276_6 = __HIVE_P2_get(__HIVE_P2_temp2276_5, "parseModuleExportName", 2284), __HIVE_P2_invoke(__HIVE_P2_temp2276_6, __HIVE_P2_temp2276_5, (__HIVE_P2_reserveArray(0, 2284), __HIVE_P2_ownArray([], 2284, "CONTROL_ARRAY")), 2284)), 2282));
                (__HIVE_P2_temp2276_7 = this, __HIVE_P2_temp2276_8 = __HIVE_P2_get(__HIVE_P2_temp2276_7, "checkExport", 2286), __HIVE_P2_invoke(__HIVE_P2_temp2276_8, __HIVE_P2_temp2276_7, (__HIVE_P2_reserveArray(3, 2286), __HIVE_P2_ownArray([t, __HIVE_P2_get(e, "exported", 2287), __HIVE_P2_get(this, "lastTokStart", 2288)], 2286, "CONTROL_ARRAY")), 2286));
            }
            else {
                (__HIVE_P2_temp2276_9 = e, __HIVE_P2_temp2276_10 = "exported", __HIVE_P2_set(__HIVE_P2_temp2276_9, __HIVE_P2_temp2276_10, null, 2290));
            }
        }
        (__HIVE_P2_temp2276_12 = this, __HIVE_P2_temp2276_13 = __HIVE_P2_get(__HIVE_P2_temp2276_12, "expectContextual", 2292), __HIVE_P2_invoke(__HIVE_P2_temp2276_13, __HIVE_P2_temp2276_12, (__HIVE_P2_reserveArray(1, 2292), __HIVE_P2_ownArray(["from"], 2292, "CONTROL_ARRAY")), 2292));
        if (__HIVE_P2_get(this, "type", 2294) !== __HIVE_P2_get(m, "string", 2295)) {
            __HIVE_P2_syntaxRefusal(2296);
        }
        (__HIVE_P2_temp2276_14 = e, __HIVE_P2_temp2276_15 = "source", __HIVE_P2_set(__HIVE_P2_temp2276_14, __HIVE_P2_temp2276_15, (__HIVE_P2_temp2276_17 = this, __HIVE_P2_temp2276_18 = __HIVE_P2_get(__HIVE_P2_temp2276_17, "parseExprAtom", 2299), __HIVE_P2_invoke(__HIVE_P2_temp2276_18, __HIVE_P2_temp2276_17, (__HIVE_P2_reserveArray(0, 2299), __HIVE_P2_ownArray([], 2299, "CONTROL_ARRAY")), 2299)), 2297));
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 2303), "ecmaVersion", 2302), 16, 2301)) {
            (__HIVE_P2_temp2276_19 = e, __HIVE_P2_temp2276_20 = "attributes", __HIVE_P2_set(__HIVE_P2_temp2276_19, __HIVE_P2_temp2276_20, (__HIVE_P2_temp2276_22 = this, __HIVE_P2_temp2276_23 = __HIVE_P2_get(__HIVE_P2_temp2276_22, "parseWithClause", 2306), __HIVE_P2_invoke(__HIVE_P2_temp2276_23, __HIVE_P2_temp2276_22, (__HIVE_P2_reserveArray(0, 2306), __HIVE_P2_ownArray([], 2306, "CONTROL_ARRAY")), 2306)), 2304));
        }
        (__HIVE_P2_temp2276_24 = this, __HIVE_P2_temp2276_25 = __HIVE_P2_get(__HIVE_P2_temp2276_24, "semicolon", 2308), __HIVE_P2_invoke(__HIVE_P2_temp2276_25, __HIVE_P2_temp2276_24, (__HIVE_P2_reserveArray(0, 2308), __HIVE_P2_ownArray([], 2308, "CONTROL_ARRAY")), 2308));
        return (__HIVE_P2_temp2276_26 = this, __HIVE_P2_temp2276_27 = __HIVE_P2_get(__HIVE_P2_temp2276_26, "finishNode", 2310), __HIVE_P2_invoke(__HIVE_P2_temp2276_27, __HIVE_P2_temp2276_26, (__HIVE_P2_reserveArray(2, 2310), __HIVE_P2_ownArray([e, "ExportAllDeclaration"], 2310, "CONTROL_ARRAY")), 2310));
    }, 28, 2, 0, 2276)), 2274));
    (__HIVE_P2_temp0_1106 = $, __HIVE_P2_temp0_1107 = "parseExport", __HIVE_P2_set(__HIVE_P2_temp0_1106, __HIVE_P2_temp0_1107, (__HIVE_P2_reserveFunction(2314), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp2314_0, __HIVE_P2_temp2314_1, __HIVE_P2_temp2314_2, __HIVE_P2_temp2314_3, __HIVE_P2_temp2314_4, __HIVE_P2_temp2314_5, __HIVE_P2_temp2314_6, __HIVE_P2_temp2314_7, __HIVE_P2_temp2314_8, __HIVE_P2_temp2314_9, __HIVE_P2_temp2314_10, __HIVE_P2_temp2314_11, __HIVE_P2_temp2314_12, __HIVE_P2_temp2314_13, __HIVE_P2_temp2314_14, __HIVE_P2_temp2314_15, __HIVE_P2_temp2314_16, __HIVE_P2_temp2314_17, __HIVE_P2_temp2314_18, __HIVE_P2_temp2314_19, __HIVE_P2_temp2314_20, __HIVE_P2_temp2314_21, __HIVE_P2_temp2314_22, __HIVE_P2_temp2314_23, __HIVE_P2_temp2314_24, __HIVE_P2_temp2314_25, __HIVE_P2_temp2314_26, __HIVE_P2_temp2314_27, __HIVE_P2_temp2314_28, __HIVE_P2_temp2314_29, __HIVE_P2_temp2314_30, __HIVE_P2_temp2314_31, __HIVE_P2_temp2314_32, __HIVE_P2_temp2314_33, __HIVE_P2_temp2314_34, __HIVE_P2_temp2314_35, __HIVE_P2_temp2314_36, __HIVE_P2_temp2314_37, __HIVE_P2_temp2314_38, __HIVE_P2_temp2314_39, __HIVE_P2_temp2314_40, __HIVE_P2_temp2314_41, __HIVE_P2_temp2314_42, __HIVE_P2_temp2314_43, __HIVE_P2_temp2314_44, __HIVE_P2_temp2314_45, __HIVE_P2_temp2314_46, __HIVE_P2_temp2314_47, __HIVE_P2_temp2314_48, __HIVE_P2_temp2314_49, __HIVE_P2_temp2314_50, __HIVE_P2_temp2314_51, __HIVE_P2_temp2314_52, __HIVE_P2_temp2314_53, __HIVE_P2_temp2314_54, __HIVE_P2_temp2314_55, __HIVE_P2_temp2314_56, __HIVE_P2_temp2314_57, __HIVE_P2_temp2314_58, __HIVE_P2_temp2314_59, __HIVE_P2_temp2314_60, __HIVE_P2_temp2314_61, __HIVE_P2_temp2314_62, __HIVE_P2_temp2314_63, __HIVE_P2_temp2314_64, __HIVE_P2_temp2314_65;
        (__HIVE_P2_temp2314_0 = this, __HIVE_P2_temp2314_1 = __HIVE_P2_get(__HIVE_P2_temp2314_0, "next", 2315), __HIVE_P2_invoke(__HIVE_P2_temp2314_1, __HIVE_P2_temp2314_0, (__HIVE_P2_reserveArray(0, 2315), __HIVE_P2_ownArray([], 2315, "CONTROL_ARRAY")), 2315));
        if ((__HIVE_P2_temp2314_2 = this, __HIVE_P2_temp2314_3 = __HIVE_P2_get(__HIVE_P2_temp2314_2, "eat", 2317), __HIVE_P2_invoke(__HIVE_P2_temp2314_3, __HIVE_P2_temp2314_2, (__HIVE_P2_reserveArray(1, 2317), __HIVE_P2_ownArray([__HIVE_P2_get(m, "star", 2318)], 2317, "CONTROL_ARRAY")), 2317))) {
            return (__HIVE_P2_temp2314_4 = this, __HIVE_P2_temp2314_5 = __HIVE_P2_get(__HIVE_P2_temp2314_4, "parseExportAllDeclaration", 2320), __HIVE_P2_invoke(__HIVE_P2_temp2314_5, __HIVE_P2_temp2314_4, (__HIVE_P2_reserveArray(2, 2320), __HIVE_P2_ownArray([e, t], 2320, "CONTROL_ARRAY")), 2320));
        }
        if ((__HIVE_P2_temp2314_6 = this, __HIVE_P2_temp2314_7 = __HIVE_P2_get(__HIVE_P2_temp2314_6, "eat", 2322), __HIVE_P2_invoke(__HIVE_P2_temp2314_7, __HIVE_P2_temp2314_6, (__HIVE_P2_reserveArray(1, 2322), __HIVE_P2_ownArray([__HIVE_P2_get(m, "_default", 2323)], 2322, "CONTROL_ARRAY")), 2322))) {
            (__HIVE_P2_temp2314_8 = this, __HIVE_P2_temp2314_9 = __HIVE_P2_get(__HIVE_P2_temp2314_8, "checkExport", 2325), __HIVE_P2_invoke(__HIVE_P2_temp2314_9, __HIVE_P2_temp2314_8, (__HIVE_P2_reserveArray(3, 2325), __HIVE_P2_ownArray([t, "default", __HIVE_P2_get(this, "lastTokStart", 2326)], 2325, "CONTROL_ARRAY")), 2325));
            (__HIVE_P2_temp2314_10 = e, __HIVE_P2_temp2314_11 = "declaration", __HIVE_P2_set(__HIVE_P2_temp2314_10, __HIVE_P2_temp2314_11, (__HIVE_P2_temp2314_13 = this, __HIVE_P2_temp2314_14 = __HIVE_P2_get(__HIVE_P2_temp2314_13, "parseExportDefaultDeclaration", 2330), __HIVE_P2_invoke(__HIVE_P2_temp2314_14, __HIVE_P2_temp2314_13, (__HIVE_P2_reserveArray(0, 2330), __HIVE_P2_ownArray([], 2330, "CONTROL_ARRAY")), 2330)), 2328));
            return (__HIVE_P2_temp2314_15 = this, __HIVE_P2_temp2314_16 = __HIVE_P2_get(__HIVE_P2_temp2314_15, "finishNode", 2332), __HIVE_P2_invoke(__HIVE_P2_temp2314_16, __HIVE_P2_temp2314_15, (__HIVE_P2_reserveArray(2, 2332), __HIVE_P2_ownArray([e, "ExportDefaultDeclaration"], 2332, "CONTROL_ARRAY")), 2332));
        }
        if ((__HIVE_P2_temp2314_17 = this, __HIVE_P2_temp2314_18 = __HIVE_P2_get(__HIVE_P2_temp2314_17, "shouldParseExportStatement", 2334), __HIVE_P2_invoke(__HIVE_P2_temp2314_18, __HIVE_P2_temp2314_17, (__HIVE_P2_reserveArray(0, 2334), __HIVE_P2_ownArray([], 2334, "CONTROL_ARRAY")), 2334))) {
            (__HIVE_P2_temp2314_19 = e, __HIVE_P2_temp2314_20 = "declaration", __HIVE_P2_set(__HIVE_P2_temp2314_19, __HIVE_P2_temp2314_20, (__HIVE_P2_temp2314_22 = this, __HIVE_P2_temp2314_23 = __HIVE_P2_get(__HIVE_P2_temp2314_22, "parseExportDeclaration", 2338), __HIVE_P2_invoke(__HIVE_P2_temp2314_23, __HIVE_P2_temp2314_22, (__HIVE_P2_reserveArray(1, 2338), __HIVE_P2_ownArray([e], 2338, "CONTROL_ARRAY")), 2338)), 2336));
            if (__HIVE_P2_get(__HIVE_P2_get(e, "declaration", 2341), "type", 2340) === "VariableDeclaration") {
                (__HIVE_P2_temp2314_24 = this, __HIVE_P2_temp2314_25 = __HIVE_P2_get(__HIVE_P2_temp2314_24, "checkVariableExport", 2342), __HIVE_P2_invoke(__HIVE_P2_temp2314_25, __HIVE_P2_temp2314_24, (__HIVE_P2_reserveArray(2, 2342), __HIVE_P2_ownArray([t, __HIVE_P2_get(__HIVE_P2_get(e, "declaration", 2344), "declarations", 2343)], 2342, "CONTROL_ARRAY")), 2342));
            }
            else {
                (__HIVE_P2_temp2314_26 = this, __HIVE_P2_temp2314_27 = __HIVE_P2_get(__HIVE_P2_temp2314_26, "checkExport", 2346), __HIVE_P2_invoke(__HIVE_P2_temp2314_27, __HIVE_P2_temp2314_26, (__HIVE_P2_reserveArray(3, 2346), __HIVE_P2_ownArray([t, __HIVE_P2_get(__HIVE_P2_get(e, "declaration", 2348), "id", 2347), __HIVE_P2_get(__HIVE_P2_get(__HIVE_P2_get(e, "declaration", 2351), "id", 2350), "start", 2349)], 2346, "CONTROL_ARRAY")), 2346));
            }
            (__HIVE_P2_temp2314_28 = e, __HIVE_P2_temp2314_29 = "specifiers", __HIVE_P2_set(__HIVE_P2_temp2314_28, __HIVE_P2_temp2314_29, (__HIVE_P2_temp2314_31 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp2314_31, 2355), __HIVE_P2_reserveArray(0, 2355, 0), __HIVE_P2_ownArray([], 2355, "ARRAY", __HIVE_P2_temp2314_31)), 2353));
            (__HIVE_P2_temp2314_32 = e, __HIVE_P2_temp2314_33 = "source", __HIVE_P2_set(__HIVE_P2_temp2314_32, __HIVE_P2_temp2314_33, null, 2356));
        }
        else {
            (__HIVE_P2_temp2314_35 = e, __HIVE_P2_temp2314_36 = "declaration", __HIVE_P2_set(__HIVE_P2_temp2314_35, __HIVE_P2_temp2314_36, null, 2358));
            (__HIVE_P2_temp2314_38 = e, __HIVE_P2_temp2314_39 = "specifiers", __HIVE_P2_set(__HIVE_P2_temp2314_38, __HIVE_P2_temp2314_39, (__HIVE_P2_temp2314_41 = this, __HIVE_P2_temp2314_42 = __HIVE_P2_get(__HIVE_P2_temp2314_41, "parseExportSpecifiers", 2362), __HIVE_P2_invoke(__HIVE_P2_temp2314_42, __HIVE_P2_temp2314_41, (__HIVE_P2_reserveArray(1, 2362), __HIVE_P2_ownArray([t], 2362, "CONTROL_ARRAY")), 2362)), 2360));
            if ((__HIVE_P2_temp2314_43 = this, __HIVE_P2_temp2314_44 = __HIVE_P2_get(__HIVE_P2_temp2314_43, "eatContextual", 2364), __HIVE_P2_invoke(__HIVE_P2_temp2314_44, __HIVE_P2_temp2314_43, (__HIVE_P2_reserveArray(1, 2364), __HIVE_P2_ownArray(["from"], 2364, "CONTROL_ARRAY")), 2364))) {
                if (__HIVE_P2_get(this, "type", 2366) !== __HIVE_P2_get(m, "string", 2367)) {
                    __HIVE_P2_syntaxRefusal(2368);
                }
                (__HIVE_P2_temp2314_45 = e, __HIVE_P2_temp2314_46 = "source", __HIVE_P2_set(__HIVE_P2_temp2314_45, __HIVE_P2_temp2314_46, (__HIVE_P2_temp2314_48 = this, __HIVE_P2_temp2314_49 = __HIVE_P2_get(__HIVE_P2_temp2314_48, "parseExprAtom", 2371), __HIVE_P2_invoke(__HIVE_P2_temp2314_49, __HIVE_P2_temp2314_48, (__HIVE_P2_reserveArray(0, 2371), __HIVE_P2_ownArray([], 2371, "CONTROL_ARRAY")), 2371)), 2369));
                if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 2375), "ecmaVersion", 2374), 16, 2373)) {
                    (__HIVE_P2_temp2314_50 = e, __HIVE_P2_temp2314_51 = "attributes", __HIVE_P2_set(__HIVE_P2_temp2314_50, __HIVE_P2_temp2314_51, (__HIVE_P2_temp2314_53 = this, __HIVE_P2_temp2314_54 = __HIVE_P2_get(__HIVE_P2_temp2314_53, "parseWithClause", 2378), __HIVE_P2_invoke(__HIVE_P2_temp2314_54, __HIVE_P2_temp2314_53, (__HIVE_P2_reserveArray(0, 2378), __HIVE_P2_ownArray([], 2378, "CONTROL_ARRAY")), 2378)), 2376));
                }
            }
            else {
                for (var i = 0, s = __HIVE_P2_get(e, "specifiers", 2381); __HIVE_P2_binary("<", i, __HIVE_P2_get(s, "length", 2383), 2382); i = __HIVE_P2_binary("+", i, 1, 2384)) {
                    __HIVE_P2_tick(2380);
                    var r = __HIVE_P2_get(s, i, 2385);
                    (__HIVE_P2_temp2314_55 = this, __HIVE_P2_temp2314_56 = __HIVE_P2_get(__HIVE_P2_temp2314_55, "checkUnreserved", 2386), __HIVE_P2_invoke(__HIVE_P2_temp2314_56, __HIVE_P2_temp2314_55, (__HIVE_P2_reserveArray(1, 2386), __HIVE_P2_ownArray([__HIVE_P2_get(r, "local", 2387)], 2386, "CONTROL_ARRAY")), 2386));
                    (__HIVE_P2_temp2314_57 = this, __HIVE_P2_temp2314_58 = __HIVE_P2_get(__HIVE_P2_temp2314_57, "checkLocalExport", 2389), __HIVE_P2_invoke(__HIVE_P2_temp2314_58, __HIVE_P2_temp2314_57, (__HIVE_P2_reserveArray(1, 2389), __HIVE_P2_ownArray([__HIVE_P2_get(r, "local", 2390)], 2389, "CONTROL_ARRAY")), 2389));
                    if (__HIVE_P2_get(__HIVE_P2_get(r, "local", 2393), "type", 2392) === "Literal") {
                        __HIVE_P2_syntaxRefusal(2394);
                    }
                }
                (__HIVE_P2_temp2314_59 = e, __HIVE_P2_temp2314_60 = "source", __HIVE_P2_set(__HIVE_P2_temp2314_59, __HIVE_P2_temp2314_60, null, 2395));
            }
            (__HIVE_P2_temp2314_62 = this, __HIVE_P2_temp2314_63 = __HIVE_P2_get(__HIVE_P2_temp2314_62, "semicolon", 2397), __HIVE_P2_invoke(__HIVE_P2_temp2314_63, __HIVE_P2_temp2314_62, (__HIVE_P2_reserveArray(0, 2397), __HIVE_P2_ownArray([], 2397, "CONTROL_ARRAY")), 2397));
        }
        return (__HIVE_P2_temp2314_64 = this, __HIVE_P2_temp2314_65 = __HIVE_P2_get(__HIVE_P2_temp2314_64, "finishNode", 2399), __HIVE_P2_invoke(__HIVE_P2_temp2314_65, __HIVE_P2_temp2314_64, (__HIVE_P2_reserveArray(2, 2399), __HIVE_P2_ownArray([e, "ExportNamedDeclaration"], 2399, "CONTROL_ARRAY")), 2399));
    }, 69, 2, 0, 2314)), 2312));
    (__HIVE_P2_temp0_1109 = $, __HIVE_P2_temp0_1110 = "parseExportDeclaration", __HIVE_P2_set(__HIVE_P2_temp0_1109, __HIVE_P2_temp0_1110, (__HIVE_P2_reserveFunction(2403), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp2403_0, __HIVE_P2_temp2403_1;
        return (__HIVE_P2_temp2403_0 = this, __HIVE_P2_temp2403_1 = __HIVE_P2_get(__HIVE_P2_temp2403_0, "parseStatement", 2404), __HIVE_P2_invoke(__HIVE_P2_temp2403_1, __HIVE_P2_temp2403_0, (__HIVE_P2_reserveArray(1, 2404), __HIVE_P2_ownArray([null], 2404, "CONTROL_ARRAY")), 2404));
    }, 2, 1, 0, 2403)), 2401));
    (__HIVE_P2_temp0_1112 = $, __HIVE_P2_temp0_1113 = "parseExportDefaultDeclaration", __HIVE_P2_set(__HIVE_P2_temp0_1112, __HIVE_P2_temp0_1113, (__HIVE_P2_reserveFunction(2408), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp2408_0, __HIVE_P2_temp2408_1, __HIVE_P2_temp2408_2, __HIVE_P2_temp2408_3, __HIVE_P2_temp2408_4, __HIVE_P2_temp2408_5, __HIVE_P2_temp2408_6, __HIVE_P2_temp2408_7, __HIVE_P2_temp2408_8, __HIVE_P2_temp2408_9, __HIVE_P2_temp2408_10, __HIVE_P2_temp2408_11, __HIVE_P2_temp2408_12, __HIVE_P2_temp2408_13, __HIVE_P2_temp2408_14, __HIVE_P2_temp2408_15, __HIVE_P2_temp2408_16, __HIVE_P2_temp2408_17;
        var e;
        if (__HIVE_P2_get(this, "type", 2409) === __HIVE_P2_get(m, "_function", 2410) || (e = (__HIVE_P2_temp2408_0 = this, __HIVE_P2_temp2408_1 = __HIVE_P2_get(__HIVE_P2_temp2408_0, "isAsyncFunction", 2412), __HIVE_P2_invoke(__HIVE_P2_temp2408_1, __HIVE_P2_temp2408_0, (__HIVE_P2_reserveArray(0, 2412), __HIVE_P2_ownArray([], 2412, "CONTROL_ARRAY")), 2412)))) {
            var t = (__HIVE_P2_temp2408_2 = this, __HIVE_P2_temp2408_3 = __HIVE_P2_get(__HIVE_P2_temp2408_2, "startNode", 2414), __HIVE_P2_invoke(__HIVE_P2_temp2408_3, __HIVE_P2_temp2408_2, (__HIVE_P2_reserveArray(0, 2414), __HIVE_P2_ownArray([], 2414, "CONTROL_ARRAY")), 2414));
            (__HIVE_P2_temp2408_4 = this, __HIVE_P2_temp2408_5 = __HIVE_P2_get(__HIVE_P2_temp2408_4, "next", 2416), __HIVE_P2_invoke(__HIVE_P2_temp2408_5, __HIVE_P2_temp2408_4, (__HIVE_P2_reserveArray(0, 2416), __HIVE_P2_ownArray([], 2416, "CONTROL_ARRAY")), 2416));
            if (e) {
                (__HIVE_P2_temp2408_6 = this, __HIVE_P2_temp2408_7 = __HIVE_P2_get(__HIVE_P2_temp2408_6, "next", 2418), __HIVE_P2_invoke(__HIVE_P2_temp2408_7, __HIVE_P2_temp2408_6, (__HIVE_P2_reserveArray(0, 2418), __HIVE_P2_ownArray([], 2418, "CONTROL_ARRAY")), 2418));
            }
            return (__HIVE_P2_temp2408_8 = this, __HIVE_P2_temp2408_9 = __HIVE_P2_get(__HIVE_P2_temp2408_8, "parseFunction", 2420), __HIVE_P2_invoke(__HIVE_P2_temp2408_9, __HIVE_P2_temp2408_8, (__HIVE_P2_reserveArray(4, 2420), __HIVE_P2_ownArray([t, __HIVE_P2_binary("|", ie, re, 2421), false, e], 2420, "CONTROL_ARRAY")), 2420));
        }
        else if (__HIVE_P2_get(this, "type", 2423) === __HIVE_P2_get(m, "_class", 2424)) {
            var i = (__HIVE_P2_temp2408_10 = this, __HIVE_P2_temp2408_11 = __HIVE_P2_get(__HIVE_P2_temp2408_10, "startNode", 2425), __HIVE_P2_invoke(__HIVE_P2_temp2408_11, __HIVE_P2_temp2408_10, (__HIVE_P2_reserveArray(0, 2425), __HIVE_P2_ownArray([], 2425, "CONTROL_ARRAY")), 2425));
            return (__HIVE_P2_temp2408_12 = this, __HIVE_P2_temp2408_13 = __HIVE_P2_get(__HIVE_P2_temp2408_12, "parseClass", 2427), __HIVE_P2_invoke(__HIVE_P2_temp2408_13, __HIVE_P2_temp2408_12, (__HIVE_P2_reserveArray(2, 2427), __HIVE_P2_ownArray([i, "nullableID"], 2427, "CONTROL_ARRAY")), 2427));
        }
        else {
            var s = (__HIVE_P2_temp2408_14 = this, __HIVE_P2_temp2408_15 = __HIVE_P2_get(__HIVE_P2_temp2408_14, "parseMaybeAssign", 2429), __HIVE_P2_invoke(__HIVE_P2_temp2408_15, __HIVE_P2_temp2408_14, (__HIVE_P2_reserveArray(0, 2429), __HIVE_P2_ownArray([], 2429, "CONTROL_ARRAY")), 2429));
            (__HIVE_P2_temp2408_16 = this, __HIVE_P2_temp2408_17 = __HIVE_P2_get(__HIVE_P2_temp2408_16, "semicolon", 2431), __HIVE_P2_invoke(__HIVE_P2_temp2408_17, __HIVE_P2_temp2408_16, (__HIVE_P2_reserveArray(0, 2431), __HIVE_P2_ownArray([], 2431, "CONTROL_ARRAY")), 2431));
            return s;
        }
    }, 22, 0, 0, 2408)), 2406));
    (__HIVE_P2_temp0_1115 = $, __HIVE_P2_temp0_1116 = "checkExport", __HIVE_P2_set(__HIVE_P2_temp0_1115, __HIVE_P2_temp0_1116, (__HIVE_P2_reserveFunction(2435), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp2435_0, __HIVE_P2_temp2435_1, __HIVE_P2_temp2435_2;
        if (!e) {
            return;
        }
        if (typeof t !== "string") {
            t = __HIVE_P2_get(t, "type", 2437) === "Identifier" ? __HIVE_P2_get(t, "name", 2438) : __HIVE_P2_get(t, "value", 2439);
        }
        if (__HIVE_P2_invoke(S, void 0, (__HIVE_P2_reserveArray(2, 2440), __HIVE_P2_ownArray([e, t], 2440, "CONTROL_ARRAY")), 2440)) {
            __HIVE_P2_syntaxRefusal(2441);
        }
        (__HIVE_P2_temp2435_0 = e, __HIVE_P2_temp2435_1 = t, __HIVE_P2_set(__HIVE_P2_temp2435_0, __HIVE_P2_temp2435_1, true, 2442));
    }, 3, 3, 0, 2435)), 2433));
    (__HIVE_P2_temp0_1118 = $, __HIVE_P2_temp0_1119 = "checkPatternExport", __HIVE_P2_set(__HIVE_P2_temp0_1118, __HIVE_P2_temp0_1119, (__HIVE_P2_reserveFunction(2446), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp2446_0, __HIVE_P2_temp2446_1, __HIVE_P2_temp2446_2, __HIVE_P2_temp2446_3, __HIVE_P2_temp2446_4, __HIVE_P2_temp2446_5, __HIVE_P2_temp2446_6, __HIVE_P2_temp2446_7, __HIVE_P2_temp2446_8, __HIVE_P2_temp2446_9, __HIVE_P2_temp2446_10, __HIVE_P2_temp2446_11;
        var i = __HIVE_P2_get(t, "type", 2447);
        if (i === "Identifier") {
            (__HIVE_P2_temp2446_0 = this, __HIVE_P2_temp2446_1 = __HIVE_P2_get(__HIVE_P2_temp2446_0, "checkExport", 2448), __HIVE_P2_invoke(__HIVE_P2_temp2446_1, __HIVE_P2_temp2446_0, (__HIVE_P2_reserveArray(3, 2448), __HIVE_P2_ownArray([e, t, __HIVE_P2_get(t, "start", 2449)], 2448, "CONTROL_ARRAY")), 2448));
        }
        else if (i === "ObjectPattern") {
            for (var s = 0, r = __HIVE_P2_get(t, "properties", 2452); __HIVE_P2_binary("<", s, __HIVE_P2_get(r, "length", 2454), 2453); s = __HIVE_P2_binary("+", s, 1, 2455)) {
                __HIVE_P2_tick(2451);
                var a = __HIVE_P2_get(r, s, 2456);
                (__HIVE_P2_temp2446_2 = this, __HIVE_P2_temp2446_3 = __HIVE_P2_get(__HIVE_P2_temp2446_2, "checkPatternExport", 2457), __HIVE_P2_invoke(__HIVE_P2_temp2446_3, __HIVE_P2_temp2446_2, (__HIVE_P2_reserveArray(2, 2457), __HIVE_P2_ownArray([e, a], 2457, "CONTROL_ARRAY")), 2457));
            }
        }
        else if (i === "ArrayPattern") {
            for (var n = 0, o = __HIVE_P2_get(t, "elements", 2460); __HIVE_P2_binary("<", n, __HIVE_P2_get(o, "length", 2462), 2461); n = __HIVE_P2_binary("+", n, 1, 2463)) {
                __HIVE_P2_tick(2459);
                var h = __HIVE_P2_get(o, n, 2464);
                if (h) {
                    (__HIVE_P2_temp2446_4 = this, __HIVE_P2_temp2446_5 = __HIVE_P2_get(__HIVE_P2_temp2446_4, "checkPatternExport", 2465), __HIVE_P2_invoke(__HIVE_P2_temp2446_5, __HIVE_P2_temp2446_4, (__HIVE_P2_reserveArray(2, 2465), __HIVE_P2_ownArray([e, h], 2465, "CONTROL_ARRAY")), 2465));
                }
            }
        }
        else if (i === "Property") {
            (__HIVE_P2_temp2446_6 = this, __HIVE_P2_temp2446_7 = __HIVE_P2_get(__HIVE_P2_temp2446_6, "checkPatternExport", 2467), __HIVE_P2_invoke(__HIVE_P2_temp2446_7, __HIVE_P2_temp2446_6, (__HIVE_P2_reserveArray(2, 2467), __HIVE_P2_ownArray([e, __HIVE_P2_get(t, "value", 2468)], 2467, "CONTROL_ARRAY")), 2467));
        }
        else if (i === "AssignmentPattern") {
            (__HIVE_P2_temp2446_8 = this, __HIVE_P2_temp2446_9 = __HIVE_P2_get(__HIVE_P2_temp2446_8, "checkPatternExport", 2470), __HIVE_P2_invoke(__HIVE_P2_temp2446_9, __HIVE_P2_temp2446_8, (__HIVE_P2_reserveArray(2, 2470), __HIVE_P2_ownArray([e, __HIVE_P2_get(t, "left", 2471)], 2470, "CONTROL_ARRAY")), 2470));
        }
        else if (i === "RestElement") {
            (__HIVE_P2_temp2446_10 = this, __HIVE_P2_temp2446_11 = __HIVE_P2_get(__HIVE_P2_temp2446_10, "checkPatternExport", 2473), __HIVE_P2_invoke(__HIVE_P2_temp2446_11, __HIVE_P2_temp2446_10, (__HIVE_P2_reserveArray(2, 2473), __HIVE_P2_ownArray([e, __HIVE_P2_get(t, "argument", 2474)], 2473, "CONTROL_ARRAY")), 2473));
        }
    }, 19, 2, 0, 2446)), 2444));
    (__HIVE_P2_temp0_1121 = $, __HIVE_P2_temp0_1122 = "checkVariableExport", __HIVE_P2_set(__HIVE_P2_temp0_1121, __HIVE_P2_temp0_1122, (__HIVE_P2_reserveFunction(2478), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp2478_0, __HIVE_P2_temp2478_1;
        if (!e) {
            return;
        }
        for (var i = 0, s = t; __HIVE_P2_binary("<", i, __HIVE_P2_get(s, "length", 2481), 2480); i = __HIVE_P2_binary("+", i, 1, 2482)) {
            __HIVE_P2_tick(2479);
            var r = __HIVE_P2_get(s, i, 2483);
            (__HIVE_P2_temp2478_0 = this, __HIVE_P2_temp2478_1 = __HIVE_P2_get(__HIVE_P2_temp2478_0, "checkPatternExport", 2484), __HIVE_P2_invoke(__HIVE_P2_temp2478_1, __HIVE_P2_temp2478_0, (__HIVE_P2_reserveArray(2, 2484), __HIVE_P2_ownArray([e, __HIVE_P2_get(r, "id", 2485)], 2484, "CONTROL_ARRAY")), 2484));
        }
    }, 5, 2, 0, 2478)), 2476));
    (__HIVE_P2_temp0_1124 = $, __HIVE_P2_temp0_1125 = "shouldParseExportStatement", __HIVE_P2_set(__HIVE_P2_temp0_1124, __HIVE_P2_temp0_1125, (__HIVE_P2_reserveFunction(2489), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp2489_0, __HIVE_P2_temp2489_1, __HIVE_P2_temp2489_2, __HIVE_P2_temp2489_3;
        return __HIVE_P2_get(__HIVE_P2_get(this, "type", 2491), "keyword", 2490) === "var" || __HIVE_P2_get(__HIVE_P2_get(this, "type", 2493), "keyword", 2492) === "const" || __HIVE_P2_get(__HIVE_P2_get(this, "type", 2495), "keyword", 2494) === "class" || __HIVE_P2_get(__HIVE_P2_get(this, "type", 2497), "keyword", 2496) === "function" || (__HIVE_P2_temp2489_0 = this, __HIVE_P2_temp2489_1 = __HIVE_P2_get(__HIVE_P2_temp2489_0, "isLet", 2498), __HIVE_P2_invoke(__HIVE_P2_temp2489_1, __HIVE_P2_temp2489_0, (__HIVE_P2_reserveArray(0, 2498), __HIVE_P2_ownArray([], 2498, "CONTROL_ARRAY")), 2498)) || (__HIVE_P2_temp2489_2 = this, __HIVE_P2_temp2489_3 = __HIVE_P2_get(__HIVE_P2_temp2489_2, "isAsyncFunction", 2500), __HIVE_P2_invoke(__HIVE_P2_temp2489_3, __HIVE_P2_temp2489_2, (__HIVE_P2_reserveArray(0, 2500), __HIVE_P2_ownArray([], 2500, "CONTROL_ARRAY")), 2500));
    }, 4, 0, 0, 2489)), 2487));
    (__HIVE_P2_temp0_1127 = $, __HIVE_P2_temp0_1128 = "parseExportSpecifier", __HIVE_P2_set(__HIVE_P2_temp0_1127, __HIVE_P2_temp0_1128, (__HIVE_P2_reserveFunction(2504), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp2504_0, __HIVE_P2_temp2504_1, __HIVE_P2_temp2504_2, __HIVE_P2_temp2504_3, __HIVE_P2_temp2504_4, __HIVE_P2_temp2504_5, __HIVE_P2_temp2504_6, __HIVE_P2_temp2504_7, __HIVE_P2_temp2504_8, __HIVE_P2_temp2504_9, __HIVE_P2_temp2504_10, __HIVE_P2_temp2504_11, __HIVE_P2_temp2504_12, __HIVE_P2_temp2504_13, __HIVE_P2_temp2504_14, __HIVE_P2_temp2504_15, __HIVE_P2_temp2504_16, __HIVE_P2_temp2504_17;
        var t = (__HIVE_P2_temp2504_0 = this, __HIVE_P2_temp2504_1 = __HIVE_P2_get(__HIVE_P2_temp2504_0, "startNode", 2505), __HIVE_P2_invoke(__HIVE_P2_temp2504_1, __HIVE_P2_temp2504_0, (__HIVE_P2_reserveArray(0, 2505), __HIVE_P2_ownArray([], 2505, "CONTROL_ARRAY")), 2505));
        (__HIVE_P2_temp2504_2 = t, __HIVE_P2_temp2504_3 = "local", __HIVE_P2_set(__HIVE_P2_temp2504_2, __HIVE_P2_temp2504_3, (__HIVE_P2_temp2504_5 = this, __HIVE_P2_temp2504_6 = __HIVE_P2_get(__HIVE_P2_temp2504_5, "parseModuleExportName", 2509), __HIVE_P2_invoke(__HIVE_P2_temp2504_6, __HIVE_P2_temp2504_5, (__HIVE_P2_reserveArray(0, 2509), __HIVE_P2_ownArray([], 2509, "CONTROL_ARRAY")), 2509)), 2507));
        (__HIVE_P2_temp2504_7 = t, __HIVE_P2_temp2504_8 = "exported", __HIVE_P2_set(__HIVE_P2_temp2504_7, __HIVE_P2_temp2504_8, (__HIVE_P2_temp2504_10 = this, __HIVE_P2_temp2504_11 = __HIVE_P2_get(__HIVE_P2_temp2504_10, "eatContextual", 2513), __HIVE_P2_invoke(__HIVE_P2_temp2504_11, __HIVE_P2_temp2504_10, (__HIVE_P2_reserveArray(1, 2513), __HIVE_P2_ownArray(["as"], 2513, "CONTROL_ARRAY")), 2513)) ? (__HIVE_P2_temp2504_12 = this, __HIVE_P2_temp2504_13 = __HIVE_P2_get(__HIVE_P2_temp2504_12, "parseModuleExportName", 2515), __HIVE_P2_invoke(__HIVE_P2_temp2504_13, __HIVE_P2_temp2504_12, (__HIVE_P2_reserveArray(0, 2515), __HIVE_P2_ownArray([], 2515, "CONTROL_ARRAY")), 2515)) : __HIVE_P2_get(t, "local", 2517), 2511));
        (__HIVE_P2_temp2504_14 = this, __HIVE_P2_temp2504_15 = __HIVE_P2_get(__HIVE_P2_temp2504_14, "checkExport", 2518), __HIVE_P2_invoke(__HIVE_P2_temp2504_15, __HIVE_P2_temp2504_14, (__HIVE_P2_reserveArray(3, 2518), __HIVE_P2_ownArray([e, __HIVE_P2_get(t, "exported", 2519), __HIVE_P2_get(__HIVE_P2_get(t, "exported", 2521), "start", 2520)], 2518, "CONTROL_ARRAY")), 2518));
        return (__HIVE_P2_temp2504_16 = this, __HIVE_P2_temp2504_17 = __HIVE_P2_get(__HIVE_P2_temp2504_16, "finishNode", 2523), __HIVE_P2_invoke(__HIVE_P2_temp2504_17, __HIVE_P2_temp2504_16, (__HIVE_P2_reserveArray(2, 2523), __HIVE_P2_ownArray([t, "ExportSpecifier"], 2523, "CONTROL_ARRAY")), 2523));
    }, 19, 1, 0, 2504)), 2502));
    (__HIVE_P2_temp0_1130 = $, __HIVE_P2_temp0_1131 = "parseExportSpecifiers", __HIVE_P2_set(__HIVE_P2_temp0_1130, __HIVE_P2_temp0_1131, (__HIVE_P2_reserveFunction(2527), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp2527_0, __HIVE_P2_temp2527_1, __HIVE_P2_temp2527_2, __HIVE_P2_temp2527_3, __HIVE_P2_temp2527_4, __HIVE_P2_temp2527_5, __HIVE_P2_temp2527_6, __HIVE_P2_temp2527_7, __HIVE_P2_temp2527_8, __HIVE_P2_temp2527_9, __HIVE_P2_temp2527_10, __HIVE_P2_temp2527_11, __HIVE_P2_temp2527_12;
        var t = (__HIVE_P2_temp2527_0 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp2527_0, 2528), __HIVE_P2_reserveArray(0, 2528, 0), __HIVE_P2_ownArray([], 2528, "ARRAY", __HIVE_P2_temp2527_0)), i = true;
        (__HIVE_P2_temp2527_1 = this, __HIVE_P2_temp2527_2 = __HIVE_P2_get(__HIVE_P2_temp2527_1, "expect", 2529), __HIVE_P2_invoke(__HIVE_P2_temp2527_2, __HIVE_P2_temp2527_1, (__HIVE_P2_reserveArray(1, 2529), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceL", 2530)], 2529, "CONTROL_ARRAY")), 2529));
        while (!(__HIVE_P2_temp2527_3 = this, __HIVE_P2_temp2527_4 = __HIVE_P2_get(__HIVE_P2_temp2527_3, "eat", 2533), __HIVE_P2_invoke(__HIVE_P2_temp2527_4, __HIVE_P2_temp2527_3, (__HIVE_P2_reserveArray(1, 2533), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceR", 2534)], 2533, "CONTROL_ARRAY")), 2533))) {
            __HIVE_P2_tick(2532);
            if (!i) {
                (__HIVE_P2_temp2527_5 = this, __HIVE_P2_temp2527_6 = __HIVE_P2_get(__HIVE_P2_temp2527_5, "expect", 2536), __HIVE_P2_invoke(__HIVE_P2_temp2527_6, __HIVE_P2_temp2527_5, (__HIVE_P2_reserveArray(1, 2536), __HIVE_P2_ownArray([__HIVE_P2_get(m, "comma", 2537)], 2536, "CONTROL_ARRAY")), 2536));
                if ((__HIVE_P2_temp2527_7 = this, __HIVE_P2_temp2527_8 = __HIVE_P2_get(__HIVE_P2_temp2527_7, "afterTrailingComma", 2539), __HIVE_P2_invoke(__HIVE_P2_temp2527_8, __HIVE_P2_temp2527_7, (__HIVE_P2_reserveArray(1, 2539), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceR", 2540)], 2539, "CONTROL_ARRAY")), 2539))) {
                    break;
                }
            }
            else {
                i = false;
            }
            (__HIVE_P2_temp2527_11 = t, __HIVE_P2_temp2527_12 = __HIVE_P2_get(__HIVE_P2_temp2527_11, "push", 2543), __HIVE_P2_invoke(__HIVE_P2_temp2527_12, __HIVE_P2_temp2527_11, (__HIVE_P2_reserveArray(1, 2543), __HIVE_P2_ownArray([(__HIVE_P2_temp2527_9 = this, __HIVE_P2_temp2527_10 = __HIVE_P2_get(__HIVE_P2_temp2527_9, "parseExportSpecifier", 2544), __HIVE_P2_invoke(__HIVE_P2_temp2527_10, __HIVE_P2_temp2527_9, (__HIVE_P2_reserveArray(1, 2544), __HIVE_P2_ownArray([e], 2544, "CONTROL_ARRAY")), 2544))], 2543, "CONTROL_ARRAY")), 2543));
        }
        return t;
    }, 15, 1, 0, 2527)), 2525));
    (__HIVE_P2_temp0_1133 = $, __HIVE_P2_temp0_1134 = "parseImport", __HIVE_P2_set(__HIVE_P2_temp0_1133, __HIVE_P2_temp0_1134, (__HIVE_P2_reserveFunction(2549), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp2549_0, __HIVE_P2_temp2549_1, __HIVE_P2_temp2549_2, __HIVE_P2_temp2549_3, __HIVE_P2_temp2549_4, __HIVE_P2_temp2549_5, __HIVE_P2_temp2549_6, __HIVE_P2_temp2549_7, __HIVE_P2_temp2549_8, __HIVE_P2_temp2549_9, __HIVE_P2_temp2549_10, __HIVE_P2_temp2549_11, __HIVE_P2_temp2549_12, __HIVE_P2_temp2549_13, __HIVE_P2_temp2549_14, __HIVE_P2_temp2549_15, __HIVE_P2_temp2549_16, __HIVE_P2_temp2549_17, __HIVE_P2_temp2549_18, __HIVE_P2_temp2549_19, __HIVE_P2_temp2549_20, __HIVE_P2_temp2549_21, __HIVE_P2_temp2549_22, __HIVE_P2_temp2549_23, __HIVE_P2_temp2549_24, __HIVE_P2_temp2549_25, __HIVE_P2_temp2549_26, __HIVE_P2_temp2549_27, __HIVE_P2_temp2549_28, __HIVE_P2_temp2549_29, __HIVE_P2_temp2549_30;
        (__HIVE_P2_temp2549_0 = this, __HIVE_P2_temp2549_1 = __HIVE_P2_get(__HIVE_P2_temp2549_0, "next", 2550), __HIVE_P2_invoke(__HIVE_P2_temp2549_1, __HIVE_P2_temp2549_0, (__HIVE_P2_reserveArray(0, 2550), __HIVE_P2_ownArray([], 2550, "CONTROL_ARRAY")), 2550));
        if (__HIVE_P2_get(this, "type", 2552) === __HIVE_P2_get(m, "string", 2553)) {
            (__HIVE_P2_temp2549_2 = e, __HIVE_P2_temp2549_3 = "specifiers", __HIVE_P2_set(__HIVE_P2_temp2549_2, __HIVE_P2_temp2549_3, te, 2554));
            (__HIVE_P2_temp2549_5 = e, __HIVE_P2_temp2549_6 = "source", __HIVE_P2_set(__HIVE_P2_temp2549_5, __HIVE_P2_temp2549_6, (__HIVE_P2_temp2549_8 = this, __HIVE_P2_temp2549_9 = __HIVE_P2_get(__HIVE_P2_temp2549_8, "parseExprAtom", 2558), __HIVE_P2_invoke(__HIVE_P2_temp2549_9, __HIVE_P2_temp2549_8, (__HIVE_P2_reserveArray(0, 2558), __HIVE_P2_ownArray([], 2558, "CONTROL_ARRAY")), 2558)), 2556));
        }
        else {
            (__HIVE_P2_temp2549_10 = e, __HIVE_P2_temp2549_11 = "specifiers", __HIVE_P2_set(__HIVE_P2_temp2549_10, __HIVE_P2_temp2549_11, (__HIVE_P2_temp2549_13 = this, __HIVE_P2_temp2549_14 = __HIVE_P2_get(__HIVE_P2_temp2549_13, "parseImportSpecifiers", 2562), __HIVE_P2_invoke(__HIVE_P2_temp2549_14, __HIVE_P2_temp2549_13, (__HIVE_P2_reserveArray(0, 2562), __HIVE_P2_ownArray([], 2562, "CONTROL_ARRAY")), 2562)), 2560));
            (__HIVE_P2_temp2549_15 = this, __HIVE_P2_temp2549_16 = __HIVE_P2_get(__HIVE_P2_temp2549_15, "expectContextual", 2564), __HIVE_P2_invoke(__HIVE_P2_temp2549_16, __HIVE_P2_temp2549_15, (__HIVE_P2_reserveArray(1, 2564), __HIVE_P2_ownArray(["from"], 2564, "CONTROL_ARRAY")), 2564));
            (__HIVE_P2_temp2549_17 = e, __HIVE_P2_temp2549_18 = "source", __HIVE_P2_set(__HIVE_P2_temp2549_17, __HIVE_P2_temp2549_18, __HIVE_P2_get(this, "type", 2568) === __HIVE_P2_get(m, "string", 2569) ? (__HIVE_P2_temp2549_20 = this, __HIVE_P2_temp2549_21 = __HIVE_P2_get(__HIVE_P2_temp2549_20, "parseExprAtom", 2570), __HIVE_P2_invoke(__HIVE_P2_temp2549_21, __HIVE_P2_temp2549_20, (__HIVE_P2_reserveArray(0, 2570), __HIVE_P2_ownArray([], 2570, "CONTROL_ARRAY")), 2570)) : __HIVE_P2_syntaxRefusal(2572), 2566));
        }
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 2575), "ecmaVersion", 2574), 16, 2573)) {
            (__HIVE_P2_temp2549_22 = e, __HIVE_P2_temp2549_23 = "attributes", __HIVE_P2_set(__HIVE_P2_temp2549_22, __HIVE_P2_temp2549_23, (__HIVE_P2_temp2549_25 = this, __HIVE_P2_temp2549_26 = __HIVE_P2_get(__HIVE_P2_temp2549_25, "parseWithClause", 2578), __HIVE_P2_invoke(__HIVE_P2_temp2549_26, __HIVE_P2_temp2549_25, (__HIVE_P2_reserveArray(0, 2578), __HIVE_P2_ownArray([], 2578, "CONTROL_ARRAY")), 2578)), 2576));
        }
        (__HIVE_P2_temp2549_27 = this, __HIVE_P2_temp2549_28 = __HIVE_P2_get(__HIVE_P2_temp2549_27, "semicolon", 2580), __HIVE_P2_invoke(__HIVE_P2_temp2549_28, __HIVE_P2_temp2549_27, (__HIVE_P2_reserveArray(0, 2580), __HIVE_P2_ownArray([], 2580, "CONTROL_ARRAY")), 2580));
        return (__HIVE_P2_temp2549_29 = this, __HIVE_P2_temp2549_30 = __HIVE_P2_get(__HIVE_P2_temp2549_29, "finishNode", 2582), __HIVE_P2_invoke(__HIVE_P2_temp2549_30, __HIVE_P2_temp2549_29, (__HIVE_P2_reserveArray(2, 2582), __HIVE_P2_ownArray([e, "ImportDeclaration"], 2582, "CONTROL_ARRAY")), 2582));
    }, 31, 1, 0, 2549)), 2547));
    (__HIVE_P2_temp0_1136 = $, __HIVE_P2_temp0_1137 = "parseImportSpecifier", __HIVE_P2_set(__HIVE_P2_temp0_1136, __HIVE_P2_temp0_1137, (__HIVE_P2_reserveFunction(2586), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp2586_0, __HIVE_P2_temp2586_1, __HIVE_P2_temp2586_2, __HIVE_P2_temp2586_3, __HIVE_P2_temp2586_4, __HIVE_P2_temp2586_5, __HIVE_P2_temp2586_6, __HIVE_P2_temp2586_7, __HIVE_P2_temp2586_8, __HIVE_P2_temp2586_9, __HIVE_P2_temp2586_10, __HIVE_P2_temp2586_11, __HIVE_P2_temp2586_12, __HIVE_P2_temp2586_13, __HIVE_P2_temp2586_14, __HIVE_P2_temp2586_15, __HIVE_P2_temp2586_16, __HIVE_P2_temp2586_17, __HIVE_P2_temp2586_18, __HIVE_P2_temp2586_19, __HIVE_P2_temp2586_20, __HIVE_P2_temp2586_21, __HIVE_P2_temp2586_22;
        var e = (__HIVE_P2_temp2586_0 = this, __HIVE_P2_temp2586_1 = __HIVE_P2_get(__HIVE_P2_temp2586_0, "startNode", 2587), __HIVE_P2_invoke(__HIVE_P2_temp2586_1, __HIVE_P2_temp2586_0, (__HIVE_P2_reserveArray(0, 2587), __HIVE_P2_ownArray([], 2587, "CONTROL_ARRAY")), 2587));
        (__HIVE_P2_temp2586_2 = e, __HIVE_P2_temp2586_3 = "imported", __HIVE_P2_set(__HIVE_P2_temp2586_2, __HIVE_P2_temp2586_3, (__HIVE_P2_temp2586_5 = this, __HIVE_P2_temp2586_6 = __HIVE_P2_get(__HIVE_P2_temp2586_5, "parseModuleExportName", 2591), __HIVE_P2_invoke(__HIVE_P2_temp2586_6, __HIVE_P2_temp2586_5, (__HIVE_P2_reserveArray(0, 2591), __HIVE_P2_ownArray([], 2591, "CONTROL_ARRAY")), 2591)), 2589));
        if ((__HIVE_P2_temp2586_7 = this, __HIVE_P2_temp2586_8 = __HIVE_P2_get(__HIVE_P2_temp2586_7, "eatContextual", 2593), __HIVE_P2_invoke(__HIVE_P2_temp2586_8, __HIVE_P2_temp2586_7, (__HIVE_P2_reserveArray(1, 2593), __HIVE_P2_ownArray(["as"], 2593, "CONTROL_ARRAY")), 2593))) {
            (__HIVE_P2_temp2586_9 = e, __HIVE_P2_temp2586_10 = "local", __HIVE_P2_set(__HIVE_P2_temp2586_9, __HIVE_P2_temp2586_10, (__HIVE_P2_temp2586_12 = this, __HIVE_P2_temp2586_13 = __HIVE_P2_get(__HIVE_P2_temp2586_12, "parseIdent", 2597), __HIVE_P2_invoke(__HIVE_P2_temp2586_13, __HIVE_P2_temp2586_12, (__HIVE_P2_reserveArray(0, 2597), __HIVE_P2_ownArray([], 2597, "CONTROL_ARRAY")), 2597)), 2595));
        }
        else {
            (__HIVE_P2_temp2586_14 = this, __HIVE_P2_temp2586_15 = __HIVE_P2_get(__HIVE_P2_temp2586_14, "checkUnreserved", 2599), __HIVE_P2_invoke(__HIVE_P2_temp2586_15, __HIVE_P2_temp2586_14, (__HIVE_P2_reserveArray(1, 2599), __HIVE_P2_ownArray([__HIVE_P2_get(e, "imported", 2600)], 2599, "CONTROL_ARRAY")), 2599));
            (__HIVE_P2_temp2586_16 = e, __HIVE_P2_temp2586_17 = "local", __HIVE_P2_set(__HIVE_P2_temp2586_16, __HIVE_P2_temp2586_17, __HIVE_P2_get(e, "imported", 2604), 2602));
        }
        (__HIVE_P2_temp2586_19 = this, __HIVE_P2_temp2586_20 = __HIVE_P2_get(__HIVE_P2_temp2586_19, "checkLValSimple", 2605), __HIVE_P2_invoke(__HIVE_P2_temp2586_20, __HIVE_P2_temp2586_19, (__HIVE_P2_reserveArray(2, 2605), __HIVE_P2_ownArray([__HIVE_P2_get(e, "local", 2606), G], 2605, "CONTROL_ARRAY")), 2605));
        return (__HIVE_P2_temp2586_21 = this, __HIVE_P2_temp2586_22 = __HIVE_P2_get(__HIVE_P2_temp2586_21, "finishNode", 2608), __HIVE_P2_invoke(__HIVE_P2_temp2586_22, __HIVE_P2_temp2586_21, (__HIVE_P2_reserveArray(2, 2608), __HIVE_P2_ownArray([e, "ImportSpecifier"], 2608, "CONTROL_ARRAY")), 2608));
    }, 24, 0, 0, 2586)), 2584));
    (__HIVE_P2_temp0_1139 = $, __HIVE_P2_temp0_1140 = "parseImportDefaultSpecifier", __HIVE_P2_set(__HIVE_P2_temp0_1139, __HIVE_P2_temp0_1140, (__HIVE_P2_reserveFunction(2612), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp2612_0, __HIVE_P2_temp2612_1, __HIVE_P2_temp2612_2, __HIVE_P2_temp2612_3, __HIVE_P2_temp2612_4, __HIVE_P2_temp2612_5, __HIVE_P2_temp2612_6, __HIVE_P2_temp2612_7, __HIVE_P2_temp2612_8, __HIVE_P2_temp2612_9, __HIVE_P2_temp2612_10;
        var e = (__HIVE_P2_temp2612_0 = this, __HIVE_P2_temp2612_1 = __HIVE_P2_get(__HIVE_P2_temp2612_0, "startNode", 2613), __HIVE_P2_invoke(__HIVE_P2_temp2612_1, __HIVE_P2_temp2612_0, (__HIVE_P2_reserveArray(0, 2613), __HIVE_P2_ownArray([], 2613, "CONTROL_ARRAY")), 2613));
        (__HIVE_P2_temp2612_2 = e, __HIVE_P2_temp2612_3 = "local", __HIVE_P2_set(__HIVE_P2_temp2612_2, __HIVE_P2_temp2612_3, (__HIVE_P2_temp2612_5 = this, __HIVE_P2_temp2612_6 = __HIVE_P2_get(__HIVE_P2_temp2612_5, "parseIdent", 2617), __HIVE_P2_invoke(__HIVE_P2_temp2612_6, __HIVE_P2_temp2612_5, (__HIVE_P2_reserveArray(0, 2617), __HIVE_P2_ownArray([], 2617, "CONTROL_ARRAY")), 2617)), 2615));
        (__HIVE_P2_temp2612_7 = this, __HIVE_P2_temp2612_8 = __HIVE_P2_get(__HIVE_P2_temp2612_7, "checkLValSimple", 2619), __HIVE_P2_invoke(__HIVE_P2_temp2612_8, __HIVE_P2_temp2612_7, (__HIVE_P2_reserveArray(2, 2619), __HIVE_P2_ownArray([__HIVE_P2_get(e, "local", 2620), G], 2619, "CONTROL_ARRAY")), 2619));
        return (__HIVE_P2_temp2612_9 = this, __HIVE_P2_temp2612_10 = __HIVE_P2_get(__HIVE_P2_temp2612_9, "finishNode", 2622), __HIVE_P2_invoke(__HIVE_P2_temp2612_10, __HIVE_P2_temp2612_9, (__HIVE_P2_reserveArray(2, 2622), __HIVE_P2_ownArray([e, "ImportDefaultSpecifier"], 2622, "CONTROL_ARRAY")), 2622));
    }, 12, 0, 0, 2612)), 2610));
    (__HIVE_P2_temp0_1142 = $, __HIVE_P2_temp0_1143 = "parseImportNamespaceSpecifier", __HIVE_P2_set(__HIVE_P2_temp0_1142, __HIVE_P2_temp0_1143, (__HIVE_P2_reserveFunction(2626), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp2626_0, __HIVE_P2_temp2626_1, __HIVE_P2_temp2626_2, __HIVE_P2_temp2626_3, __HIVE_P2_temp2626_4, __HIVE_P2_temp2626_5, __HIVE_P2_temp2626_6, __HIVE_P2_temp2626_7, __HIVE_P2_temp2626_8, __HIVE_P2_temp2626_9, __HIVE_P2_temp2626_10, __HIVE_P2_temp2626_11, __HIVE_P2_temp2626_12, __HIVE_P2_temp2626_13, __HIVE_P2_temp2626_14;
        var e = (__HIVE_P2_temp2626_0 = this, __HIVE_P2_temp2626_1 = __HIVE_P2_get(__HIVE_P2_temp2626_0, "startNode", 2627), __HIVE_P2_invoke(__HIVE_P2_temp2626_1, __HIVE_P2_temp2626_0, (__HIVE_P2_reserveArray(0, 2627), __HIVE_P2_ownArray([], 2627, "CONTROL_ARRAY")), 2627));
        (__HIVE_P2_temp2626_2 = this, __HIVE_P2_temp2626_3 = __HIVE_P2_get(__HIVE_P2_temp2626_2, "next", 2629), __HIVE_P2_invoke(__HIVE_P2_temp2626_3, __HIVE_P2_temp2626_2, (__HIVE_P2_reserveArray(0, 2629), __HIVE_P2_ownArray([], 2629, "CONTROL_ARRAY")), 2629));
        (__HIVE_P2_temp2626_4 = this, __HIVE_P2_temp2626_5 = __HIVE_P2_get(__HIVE_P2_temp2626_4, "expectContextual", 2631), __HIVE_P2_invoke(__HIVE_P2_temp2626_5, __HIVE_P2_temp2626_4, (__HIVE_P2_reserveArray(1, 2631), __HIVE_P2_ownArray(["as"], 2631, "CONTROL_ARRAY")), 2631));
        (__HIVE_P2_temp2626_6 = e, __HIVE_P2_temp2626_7 = "local", __HIVE_P2_set(__HIVE_P2_temp2626_6, __HIVE_P2_temp2626_7, (__HIVE_P2_temp2626_9 = this, __HIVE_P2_temp2626_10 = __HIVE_P2_get(__HIVE_P2_temp2626_9, "parseIdent", 2635), __HIVE_P2_invoke(__HIVE_P2_temp2626_10, __HIVE_P2_temp2626_9, (__HIVE_P2_reserveArray(0, 2635), __HIVE_P2_ownArray([], 2635, "CONTROL_ARRAY")), 2635)), 2633));
        (__HIVE_P2_temp2626_11 = this, __HIVE_P2_temp2626_12 = __HIVE_P2_get(__HIVE_P2_temp2626_11, "checkLValSimple", 2637), __HIVE_P2_invoke(__HIVE_P2_temp2626_12, __HIVE_P2_temp2626_11, (__HIVE_P2_reserveArray(2, 2637), __HIVE_P2_ownArray([__HIVE_P2_get(e, "local", 2638), G], 2637, "CONTROL_ARRAY")), 2637));
        return (__HIVE_P2_temp2626_13 = this, __HIVE_P2_temp2626_14 = __HIVE_P2_get(__HIVE_P2_temp2626_13, "finishNode", 2640), __HIVE_P2_invoke(__HIVE_P2_temp2626_14, __HIVE_P2_temp2626_13, (__HIVE_P2_reserveArray(2, 2640), __HIVE_P2_ownArray([e, "ImportNamespaceSpecifier"], 2640, "CONTROL_ARRAY")), 2640));
    }, 16, 0, 0, 2626)), 2624));
    (__HIVE_P2_temp0_1145 = $, __HIVE_P2_temp0_1146 = "parseImportSpecifiers", __HIVE_P2_set(__HIVE_P2_temp0_1145, __HIVE_P2_temp0_1146, (__HIVE_P2_reserveFunction(2644), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp2644_0, __HIVE_P2_temp2644_1, __HIVE_P2_temp2644_2, __HIVE_P2_temp2644_3, __HIVE_P2_temp2644_4, __HIVE_P2_temp2644_5, __HIVE_P2_temp2644_6, __HIVE_P2_temp2644_7, __HIVE_P2_temp2644_8, __HIVE_P2_temp2644_9, __HIVE_P2_temp2644_10, __HIVE_P2_temp2644_11, __HIVE_P2_temp2644_12, __HIVE_P2_temp2644_13, __HIVE_P2_temp2644_14, __HIVE_P2_temp2644_15, __HIVE_P2_temp2644_16, __HIVE_P2_temp2644_17, __HIVE_P2_temp2644_18, __HIVE_P2_temp2644_19, __HIVE_P2_temp2644_20, __HIVE_P2_temp2644_21, __HIVE_P2_temp2644_22;
        var e = (__HIVE_P2_temp2644_0 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp2644_0, 2645), __HIVE_P2_reserveArray(0, 2645, 0), __HIVE_P2_ownArray([], 2645, "ARRAY", __HIVE_P2_temp2644_0)), t = true;
        if (__HIVE_P2_get(this, "type", 2646) === __HIVE_P2_get(m, "name", 2647)) {
            (__HIVE_P2_temp2644_3 = e, __HIVE_P2_temp2644_4 = __HIVE_P2_get(__HIVE_P2_temp2644_3, "push", 2648), __HIVE_P2_invoke(__HIVE_P2_temp2644_4, __HIVE_P2_temp2644_3, (__HIVE_P2_reserveArray(1, 2648), __HIVE_P2_ownArray([(__HIVE_P2_temp2644_1 = this, __HIVE_P2_temp2644_2 = __HIVE_P2_get(__HIVE_P2_temp2644_1, "parseImportDefaultSpecifier", 2649), __HIVE_P2_invoke(__HIVE_P2_temp2644_2, __HIVE_P2_temp2644_1, (__HIVE_P2_reserveArray(0, 2649), __HIVE_P2_ownArray([], 2649, "CONTROL_ARRAY")), 2649))], 2648, "CONTROL_ARRAY")), 2648));
            if (!(__HIVE_P2_temp2644_5 = this, __HIVE_P2_temp2644_6 = __HIVE_P2_get(__HIVE_P2_temp2644_5, "eat", 2652), __HIVE_P2_invoke(__HIVE_P2_temp2644_6, __HIVE_P2_temp2644_5, (__HIVE_P2_reserveArray(1, 2652), __HIVE_P2_ownArray([__HIVE_P2_get(m, "comma", 2653)], 2652, "CONTROL_ARRAY")), 2652))) {
                return e;
            }
        }
        if (__HIVE_P2_get(this, "type", 2655) === __HIVE_P2_get(m, "star", 2656)) {
            (__HIVE_P2_temp2644_9 = e, __HIVE_P2_temp2644_10 = __HIVE_P2_get(__HIVE_P2_temp2644_9, "push", 2657), __HIVE_P2_invoke(__HIVE_P2_temp2644_10, __HIVE_P2_temp2644_9, (__HIVE_P2_reserveArray(1, 2657), __HIVE_P2_ownArray([(__HIVE_P2_temp2644_7 = this, __HIVE_P2_temp2644_8 = __HIVE_P2_get(__HIVE_P2_temp2644_7, "parseImportNamespaceSpecifier", 2658), __HIVE_P2_invoke(__HIVE_P2_temp2644_8, __HIVE_P2_temp2644_7, (__HIVE_P2_reserveArray(0, 2658), __HIVE_P2_ownArray([], 2658, "CONTROL_ARRAY")), 2658))], 2657, "CONTROL_ARRAY")), 2657));
            return e;
        }
        (__HIVE_P2_temp2644_11 = this, __HIVE_P2_temp2644_12 = __HIVE_P2_get(__HIVE_P2_temp2644_11, "expect", 2661), __HIVE_P2_invoke(__HIVE_P2_temp2644_12, __HIVE_P2_temp2644_11, (__HIVE_P2_reserveArray(1, 2661), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceL", 2662)], 2661, "CONTROL_ARRAY")), 2661));
        while (!(__HIVE_P2_temp2644_13 = this, __HIVE_P2_temp2644_14 = __HIVE_P2_get(__HIVE_P2_temp2644_13, "eat", 2665), __HIVE_P2_invoke(__HIVE_P2_temp2644_14, __HIVE_P2_temp2644_13, (__HIVE_P2_reserveArray(1, 2665), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceR", 2666)], 2665, "CONTROL_ARRAY")), 2665))) {
            __HIVE_P2_tick(2664);
            if (!t) {
                (__HIVE_P2_temp2644_15 = this, __HIVE_P2_temp2644_16 = __HIVE_P2_get(__HIVE_P2_temp2644_15, "expect", 2668), __HIVE_P2_invoke(__HIVE_P2_temp2644_16, __HIVE_P2_temp2644_15, (__HIVE_P2_reserveArray(1, 2668), __HIVE_P2_ownArray([__HIVE_P2_get(m, "comma", 2669)], 2668, "CONTROL_ARRAY")), 2668));
                if ((__HIVE_P2_temp2644_17 = this, __HIVE_P2_temp2644_18 = __HIVE_P2_get(__HIVE_P2_temp2644_17, "afterTrailingComma", 2671), __HIVE_P2_invoke(__HIVE_P2_temp2644_18, __HIVE_P2_temp2644_17, (__HIVE_P2_reserveArray(1, 2671), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceR", 2672)], 2671, "CONTROL_ARRAY")), 2671))) {
                    break;
                }
            }
            else {
                t = false;
            }
            (__HIVE_P2_temp2644_21 = e, __HIVE_P2_temp2644_22 = __HIVE_P2_get(__HIVE_P2_temp2644_21, "push", 2675), __HIVE_P2_invoke(__HIVE_P2_temp2644_22, __HIVE_P2_temp2644_21, (__HIVE_P2_reserveArray(1, 2675), __HIVE_P2_ownArray([(__HIVE_P2_temp2644_19 = this, __HIVE_P2_temp2644_20 = __HIVE_P2_get(__HIVE_P2_temp2644_19, "parseImportSpecifier", 2676), __HIVE_P2_invoke(__HIVE_P2_temp2644_20, __HIVE_P2_temp2644_19, (__HIVE_P2_reserveArray(0, 2676), __HIVE_P2_ownArray([], 2676, "CONTROL_ARRAY")), 2676))], 2675, "CONTROL_ARRAY")), 2675));
        }
        return e;
    }, 25, 0, 0, 2644)), 2642));
    (__HIVE_P2_temp0_1148 = $, __HIVE_P2_temp0_1149 = "parseWithClause", __HIVE_P2_set(__HIVE_P2_temp0_1148, __HIVE_P2_temp0_1149, (__HIVE_P2_reserveFunction(2681), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp2681_0, __HIVE_P2_temp2681_1, __HIVE_P2_temp2681_2, __HIVE_P2_temp2681_3, __HIVE_P2_temp2681_4, __HIVE_P2_temp2681_5, __HIVE_P2_temp2681_6, __HIVE_P2_temp2681_7, __HIVE_P2_temp2681_8, __HIVE_P2_temp2681_9, __HIVE_P2_temp2681_10, __HIVE_P2_temp2681_11, __HIVE_P2_temp2681_12, __HIVE_P2_temp2681_13, __HIVE_P2_temp2681_14, __HIVE_P2_temp2681_15, __HIVE_P2_temp2681_16, __HIVE_P2_temp2681_17;
        var e = (__HIVE_P2_temp2681_0 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp2681_0, 2682), __HIVE_P2_reserveArray(0, 2682, 0), __HIVE_P2_ownArray([], 2682, "ARRAY", __HIVE_P2_temp2681_0));
        if (!(__HIVE_P2_temp2681_1 = this, __HIVE_P2_temp2681_2 = __HIVE_P2_get(__HIVE_P2_temp2681_1, "eat", 2683), __HIVE_P2_invoke(__HIVE_P2_temp2681_2, __HIVE_P2_temp2681_1, (__HIVE_P2_reserveArray(1, 2683), __HIVE_P2_ownArray([__HIVE_P2_get(m, "_with", 2684)], 2683, "CONTROL_ARRAY")), 2683))) {
            return e;
        }
        (__HIVE_P2_temp2681_3 = this, __HIVE_P2_temp2681_4 = __HIVE_P2_get(__HIVE_P2_temp2681_3, "expect", 2686), __HIVE_P2_invoke(__HIVE_P2_temp2681_4, __HIVE_P2_temp2681_3, (__HIVE_P2_reserveArray(1, 2686), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceL", 2687)], 2686, "CONTROL_ARRAY")), 2686));
        var t = (__HIVE_P2_reserveObject(0, 2689), __HIVE_P2_ownObject({}, 2689, 0, 0));
        var i = true;
        while (!(__HIVE_P2_temp2681_5 = this, __HIVE_P2_temp2681_6 = __HIVE_P2_get(__HIVE_P2_temp2681_5, "eat", 2691), __HIVE_P2_invoke(__HIVE_P2_temp2681_6, __HIVE_P2_temp2681_5, (__HIVE_P2_reserveArray(1, 2691), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceR", 2692)], 2691, "CONTROL_ARRAY")), 2691))) {
            __HIVE_P2_tick(2690);
            if (!i) {
                (__HIVE_P2_temp2681_7 = this, __HIVE_P2_temp2681_8 = __HIVE_P2_get(__HIVE_P2_temp2681_7, "expect", 2694), __HIVE_P2_invoke(__HIVE_P2_temp2681_8, __HIVE_P2_temp2681_7, (__HIVE_P2_reserveArray(1, 2694), __HIVE_P2_ownArray([__HIVE_P2_get(m, "comma", 2695)], 2694, "CONTROL_ARRAY")), 2694));
                if ((__HIVE_P2_temp2681_9 = this, __HIVE_P2_temp2681_10 = __HIVE_P2_get(__HIVE_P2_temp2681_9, "afterTrailingComma", 2697), __HIVE_P2_invoke(__HIVE_P2_temp2681_10, __HIVE_P2_temp2681_9, (__HIVE_P2_reserveArray(1, 2697), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceR", 2698)], 2697, "CONTROL_ARRAY")), 2697))) {
                    break;
                }
            }
            else {
                i = false;
            }
            var s = (__HIVE_P2_temp2681_11 = this, __HIVE_P2_temp2681_12 = __HIVE_P2_get(__HIVE_P2_temp2681_11, "parseImportAttribute", 2701), __HIVE_P2_invoke(__HIVE_P2_temp2681_12, __HIVE_P2_temp2681_11, (__HIVE_P2_reserveArray(0, 2701), __HIVE_P2_ownArray([], 2701, "CONTROL_ARRAY")), 2701));
            var r = __HIVE_P2_get(__HIVE_P2_get(s, "key", 2704), "type", 2703) === "Identifier" ? __HIVE_P2_get(__HIVE_P2_get(s, "key", 2706), "name", 2705) : __HIVE_P2_get(__HIVE_P2_get(s, "key", 2708), "value", 2707);
            if (__HIVE_P2_invoke(S, void 0, (__HIVE_P2_reserveArray(2, 2709), __HIVE_P2_ownArray([t, r], 2709, "CONTROL_ARRAY")), 2709)) {
                __HIVE_P2_syntaxRefusal(2710);
            }
            (__HIVE_P2_temp2681_13 = t, __HIVE_P2_temp2681_14 = r, __HIVE_P2_set(__HIVE_P2_temp2681_13, __HIVE_P2_temp2681_14, true, 2711));
            (__HIVE_P2_temp2681_16 = e, __HIVE_P2_temp2681_17 = __HIVE_P2_get(__HIVE_P2_temp2681_16, "push", 2713), __HIVE_P2_invoke(__HIVE_P2_temp2681_17, __HIVE_P2_temp2681_16, (__HIVE_P2_reserveArray(1, 2713), __HIVE_P2_ownArray([s], 2713, "CONTROL_ARRAY")), 2713));
        }
        return e;
    }, 23, 0, 0, 2681)), 2679));
    (__HIVE_P2_temp0_1151 = $, __HIVE_P2_temp0_1152 = "parseImportAttribute", __HIVE_P2_set(__HIVE_P2_temp0_1151, __HIVE_P2_temp0_1152, (__HIVE_P2_reserveFunction(2717), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp2717_0, __HIVE_P2_temp2717_1, __HIVE_P2_temp2717_2, __HIVE_P2_temp2717_3, __HIVE_P2_temp2717_4, __HIVE_P2_temp2717_5, __HIVE_P2_temp2717_6, __HIVE_P2_temp2717_7, __HIVE_P2_temp2717_8, __HIVE_P2_temp2717_9, __HIVE_P2_temp2717_10, __HIVE_P2_temp2717_11, __HIVE_P2_temp2717_12, __HIVE_P2_temp2717_13, __HIVE_P2_temp2717_14, __HIVE_P2_temp2717_15, __HIVE_P2_temp2717_16, __HIVE_P2_temp2717_17;
        var e = (__HIVE_P2_temp2717_0 = this, __HIVE_P2_temp2717_1 = __HIVE_P2_get(__HIVE_P2_temp2717_0, "startNode", 2718), __HIVE_P2_invoke(__HIVE_P2_temp2717_1, __HIVE_P2_temp2717_0, (__HIVE_P2_reserveArray(0, 2718), __HIVE_P2_ownArray([], 2718, "CONTROL_ARRAY")), 2718));
        (__HIVE_P2_temp2717_2 = e, __HIVE_P2_temp2717_3 = "key", __HIVE_P2_set(__HIVE_P2_temp2717_2, __HIVE_P2_temp2717_3, __HIVE_P2_get(this, "type", 2722) === __HIVE_P2_get(m, "string", 2723) ? (__HIVE_P2_temp2717_5 = this, __HIVE_P2_temp2717_6 = __HIVE_P2_get(__HIVE_P2_temp2717_5, "parseExprAtom", 2724), __HIVE_P2_invoke(__HIVE_P2_temp2717_6, __HIVE_P2_temp2717_5, (__HIVE_P2_reserveArray(0, 2724), __HIVE_P2_ownArray([], 2724, "CONTROL_ARRAY")), 2724)) : (__HIVE_P2_temp2717_7 = this, __HIVE_P2_temp2717_8 = __HIVE_P2_get(__HIVE_P2_temp2717_7, "parseIdent", 2726), __HIVE_P2_invoke(__HIVE_P2_temp2717_8, __HIVE_P2_temp2717_7, (__HIVE_P2_reserveArray(1, 2726), __HIVE_P2_ownArray([__HIVE_P2_get(__HIVE_P2_get(this, "options", 2728), "allowReserved", 2727) !== "never"], 2726, "CONTROL_ARRAY")), 2726)), 2720));
        (__HIVE_P2_temp2717_9 = this, __HIVE_P2_temp2717_10 = __HIVE_P2_get(__HIVE_P2_temp2717_9, "expect", 2730), __HIVE_P2_invoke(__HIVE_P2_temp2717_10, __HIVE_P2_temp2717_9, (__HIVE_P2_reserveArray(1, 2730), __HIVE_P2_ownArray([__HIVE_P2_get(m, "colon", 2731)], 2730, "CONTROL_ARRAY")), 2730));
        if (__HIVE_P2_get(this, "type", 2733) !== __HIVE_P2_get(m, "string", 2734)) {
            __HIVE_P2_syntaxRefusal(2735);
        }
        (__HIVE_P2_temp2717_11 = e, __HIVE_P2_temp2717_12 = "value", __HIVE_P2_set(__HIVE_P2_temp2717_11, __HIVE_P2_temp2717_12, (__HIVE_P2_temp2717_14 = this, __HIVE_P2_temp2717_15 = __HIVE_P2_get(__HIVE_P2_temp2717_14, "parseExprAtom", 2738), __HIVE_P2_invoke(__HIVE_P2_temp2717_15, __HIVE_P2_temp2717_14, (__HIVE_P2_reserveArray(0, 2738), __HIVE_P2_ownArray([], 2738, "CONTROL_ARRAY")), 2738)), 2736));
        return (__HIVE_P2_temp2717_16 = this, __HIVE_P2_temp2717_17 = __HIVE_P2_get(__HIVE_P2_temp2717_16, "finishNode", 2740), __HIVE_P2_invoke(__HIVE_P2_temp2717_17, __HIVE_P2_temp2717_16, (__HIVE_P2_reserveArray(2, 2740), __HIVE_P2_ownArray([e, "ImportAttribute"], 2740, "CONTROL_ARRAY")), 2740));
    }, 19, 0, 0, 2717)), 2715));
    (__HIVE_P2_temp0_1154 = $, __HIVE_P2_temp0_1155 = "parseModuleExportName", __HIVE_P2_set(__HIVE_P2_temp0_1154, __HIVE_P2_temp0_1155, (__HIVE_P2_reserveFunction(2744), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp2744_0, __HIVE_P2_temp2744_1, __HIVE_P2_temp2744_2, __HIVE_P2_temp2744_3, __HIVE_P2_temp2744_4, __HIVE_P2_temp2744_5;
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 2747), "ecmaVersion", 2746), 13, 2745) && __HIVE_P2_get(this, "type", 2748) === __HIVE_P2_get(m, "string", 2749)) {
            var e = (__HIVE_P2_temp2744_0 = this, __HIVE_P2_temp2744_1 = __HIVE_P2_get(__HIVE_P2_temp2744_0, "parseLiteral", 2750), __HIVE_P2_invoke(__HIVE_P2_temp2744_1, __HIVE_P2_temp2744_0, (__HIVE_P2_reserveArray(1, 2750), __HIVE_P2_ownArray([__HIVE_P2_get(this, "value", 2751)], 2750, "CONTROL_ARRAY")), 2750));
            if ((__HIVE_P2_temp2744_2 = E, __HIVE_P2_temp2744_3 = __HIVE_P2_get(__HIVE_P2_temp2744_2, "test", 2753), __HIVE_P2_invoke(__HIVE_P2_temp2744_3, __HIVE_P2_temp2744_2, (__HIVE_P2_reserveArray(1, 2753), __HIVE_P2_ownArray([__HIVE_P2_get(e, "value", 2754)], 2753, "CONTROL_ARRAY")), 2753))) {
                __HIVE_P2_syntaxRefusal(2756);
            }
            return e;
        }
        return (__HIVE_P2_temp2744_4 = this, __HIVE_P2_temp2744_5 = __HIVE_P2_get(__HIVE_P2_temp2744_4, "parseIdent", 2757), __HIVE_P2_invoke(__HIVE_P2_temp2744_5, __HIVE_P2_temp2744_4, (__HIVE_P2_reserveArray(1, 2757), __HIVE_P2_ownArray([true], 2757, "CONTROL_ARRAY")), 2757));
    }, 7, 0, 0, 2744)), 2742));
    (__HIVE_P2_temp0_1157 = $, __HIVE_P2_temp0_1158 = "adaptDirectivePrologue", __HIVE_P2_set(__HIVE_P2_temp0_1157, __HIVE_P2_temp0_1158, (__HIVE_P2_reserveFunction(2761), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp2761_0, __HIVE_P2_temp2761_1, __HIVE_P2_temp2761_2, __HIVE_P2_temp2761_3, __HIVE_P2_temp2761_4, __HIVE_P2_temp2761_5, __HIVE_P2_temp2761_6, __HIVE_P2_temp2761_7, __HIVE_P2_temp2761_8;
        for (var t = 0; __HIVE_P2_binary("<", t, __HIVE_P2_get(e, "length", 2764), 2763) && (__HIVE_P2_temp2761_0 = this, __HIVE_P2_temp2761_1 = __HIVE_P2_get(__HIVE_P2_temp2761_0, "isDirectiveCandidate", 2765), __HIVE_P2_invoke(__HIVE_P2_temp2761_1, __HIVE_P2_temp2761_0, (__HIVE_P2_reserveArray(1, 2765), __HIVE_P2_ownArray([__HIVE_P2_get(e, t, 2766)], 2765, "CONTROL_ARRAY")), 2765)); (__HIVE_P2_temp2761_2 = __HIVE_P2_numeric(t, 2768), __HIVE_P2_temp2761_3 = __HIVE_P2_temp2761_2 + 1, t = __HIVE_P2_temp2761_3, __HIVE_P2_temp2761_3)) {
            __HIVE_P2_tick(2762);
            (__HIVE_P2_temp2761_4 = __HIVE_P2_get(e, t, 2771), __HIVE_P2_temp2761_5 = "directive", __HIVE_P2_set(__HIVE_P2_temp2761_4, __HIVE_P2_temp2761_5, (__HIVE_P2_temp2761_7 = __HIVE_P2_get(__HIVE_P2_get(__HIVE_P2_get(e, t, 2777), "expression", 2776), "raw", 2775), __HIVE_P2_temp2761_8 = __HIVE_P2_get(__HIVE_P2_temp2761_7, "slice", 2772), __HIVE_P2_invoke(__HIVE_P2_temp2761_8, __HIVE_P2_temp2761_7, (__HIVE_P2_reserveArray(2, 2772), __HIVE_P2_ownArray([1, __HIVE_P2_unary("-", 1, 2773)], 2772, "CONTROL_ARRAY")), 2772)), 2769));
        }
    }, 10, 1, 0, 2761)), 2759));
    (__HIVE_P2_temp0_1160 = $, __HIVE_P2_temp0_1161 = "isDirectiveCandidate", __HIVE_P2_set(__HIVE_P2_temp0_1160, __HIVE_P2_temp0_1161, (__HIVE_P2_reserveFunction(2780), __HIVE_P2_registerFunction(function (e) {
        return __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 2783), "ecmaVersion", 2782), 5, 2781) && __HIVE_P2_get(e, "type", 2784) === "ExpressionStatement" && __HIVE_P2_get(__HIVE_P2_get(e, "expression", 2786), "type", 2785) === "Literal" && typeof __HIVE_P2_get(__HIVE_P2_get(e, "expression", 2788), "value", 2787) === "string" && (__HIVE_P2_get(__HIVE_P2_get(this, "input", 2790), __HIVE_P2_get(e, "start", 2791), 2789) === '"' || __HIVE_P2_get(__HIVE_P2_get(this, "input", 2793), __HIVE_P2_get(e, "start", 2794), 2792) === "'");
    }, 0, 1, 0, 2780)), 2778));
    var ae = __HIVE_P2_get(K, "prototype", 2795);
    (__HIVE_P2_temp0_1163 = ae, __HIVE_P2_temp0_1164 = "toAssignable", __HIVE_P2_set(__HIVE_P2_temp0_1163, __HIVE_P2_temp0_1164, (__HIVE_P2_reserveFunction(2798), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp2798_0, __HIVE_P2_temp2798_1, __HIVE_P2_temp2798_2, __HIVE_P2_temp2798_3, __HIVE_P2_temp2798_4, __HIVE_P2_temp2798_5, __HIVE_P2_temp2798_6, __HIVE_P2_temp2798_7, __HIVE_P2_temp2798_8, __HIVE_P2_temp2798_9, __HIVE_P2_temp2798_10, __HIVE_P2_temp2798_11, __HIVE_P2_temp2798_12, __HIVE_P2_temp2798_13, __HIVE_P2_temp2798_14, __HIVE_P2_temp2798_15, __HIVE_P2_temp2798_16, __HIVE_P2_temp2798_17, __HIVE_P2_temp2798_18, __HIVE_P2_temp2798_19, __HIVE_P2_temp2798_20, __HIVE_P2_temp2798_21, __HIVE_P2_temp2798_22, __HIVE_P2_temp2798_23, __HIVE_P2_temp2798_24, __HIVE_P2_temp2798_25, __HIVE_P2_temp2798_26, __HIVE_P2_temp2798_27, __HIVE_P2_temp2798_28, __HIVE_P2_temp2798_29;
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 2801), "ecmaVersion", 2800), 6, 2799) && e) {
            switch (__HIVE_P2_get(e, "type", 2802)) {
                case "Identifier":
                    if (__HIVE_P2_get(this, "inAsync", 2803) && __HIVE_P2_get(e, "name", 2804) === "await") {
                        __HIVE_P2_syntaxRefusal(2805);
                    }
                    break;
                case "ObjectPattern":
                case "ArrayPattern":
                case "AssignmentPattern":
                case "RestElement": break;
                case "ObjectExpression":
                    (__HIVE_P2_temp2798_0 = e, __HIVE_P2_temp2798_1 = "type", __HIVE_P2_set(__HIVE_P2_temp2798_0, __HIVE_P2_temp2798_1, "ObjectPattern", 2806));
                    if (i) {
                        (__HIVE_P2_temp2798_3 = this, __HIVE_P2_temp2798_4 = __HIVE_P2_get(__HIVE_P2_temp2798_3, "checkPatternErrors", 2808), __HIVE_P2_invoke(__HIVE_P2_temp2798_4, __HIVE_P2_temp2798_3, (__HIVE_P2_reserveArray(2, 2808), __HIVE_P2_ownArray([i, true], 2808, "CONTROL_ARRAY")), 2808));
                    }
                    for (var s = 0, r = __HIVE_P2_get(e, "properties", 2811); __HIVE_P2_binary("<", s, __HIVE_P2_get(r, "length", 2813), 2812); s = __HIVE_P2_binary("+", s, 1, 2814)) {
                        __HIVE_P2_tick(2810);
                        var a = __HIVE_P2_get(r, s, 2815);
                        (__HIVE_P2_temp2798_5 = this, __HIVE_P2_temp2798_6 = __HIVE_P2_get(__HIVE_P2_temp2798_5, "toAssignable", 2816), __HIVE_P2_invoke(__HIVE_P2_temp2798_6, __HIVE_P2_temp2798_5, (__HIVE_P2_reserveArray(2, 2816), __HIVE_P2_ownArray([a, t], 2816, "CONTROL_ARRAY")), 2816));
                        if (__HIVE_P2_get(a, "type", 2818) === "RestElement" && (__HIVE_P2_get(__HIVE_P2_get(a, "argument", 2820), "type", 2819) === "ArrayPattern" || __HIVE_P2_get(__HIVE_P2_get(a, "argument", 2822), "type", 2821) === "ObjectPattern")) {
                            __HIVE_P2_syntaxRefusal(2823);
                        }
                    }
                    break;
                case "Property":
                    if (__HIVE_P2_get(e, "kind", 2824) !== "init") {
                        __HIVE_P2_syntaxRefusal(2825);
                    }
                    (__HIVE_P2_temp2798_7 = this, __HIVE_P2_temp2798_8 = __HIVE_P2_get(__HIVE_P2_temp2798_7, "toAssignable", 2826), __HIVE_P2_invoke(__HIVE_P2_temp2798_8, __HIVE_P2_temp2798_7, (__HIVE_P2_reserveArray(2, 2826), __HIVE_P2_ownArray([__HIVE_P2_get(e, "value", 2827), t], 2826, "CONTROL_ARRAY")), 2826));
                    break;
                case "ArrayExpression":
                    (__HIVE_P2_temp2798_9 = e, __HIVE_P2_temp2798_10 = "type", __HIVE_P2_set(__HIVE_P2_temp2798_9, __HIVE_P2_temp2798_10, "ArrayPattern", 2829));
                    if (i) {
                        (__HIVE_P2_temp2798_12 = this, __HIVE_P2_temp2798_13 = __HIVE_P2_get(__HIVE_P2_temp2798_12, "checkPatternErrors", 2831), __HIVE_P2_invoke(__HIVE_P2_temp2798_13, __HIVE_P2_temp2798_12, (__HIVE_P2_reserveArray(2, 2831), __HIVE_P2_ownArray([i, true], 2831, "CONTROL_ARRAY")), 2831));
                    }
                    (__HIVE_P2_temp2798_14 = this, __HIVE_P2_temp2798_15 = __HIVE_P2_get(__HIVE_P2_temp2798_14, "toAssignableList", 2833), __HIVE_P2_invoke(__HIVE_P2_temp2798_15, __HIVE_P2_temp2798_14, (__HIVE_P2_reserveArray(2, 2833), __HIVE_P2_ownArray([__HIVE_P2_get(e, "elements", 2834), t], 2833, "CONTROL_ARRAY")), 2833));
                    break;
                case "SpreadElement":
                    (__HIVE_P2_temp2798_16 = e, __HIVE_P2_temp2798_17 = "type", __HIVE_P2_set(__HIVE_P2_temp2798_16, __HIVE_P2_temp2798_17, "RestElement", 2836));
                    (__HIVE_P2_temp2798_19 = this, __HIVE_P2_temp2798_20 = __HIVE_P2_get(__HIVE_P2_temp2798_19, "toAssignable", 2838), __HIVE_P2_invoke(__HIVE_P2_temp2798_20, __HIVE_P2_temp2798_19, (__HIVE_P2_reserveArray(2, 2838), __HIVE_P2_ownArray([__HIVE_P2_get(e, "argument", 2839), t], 2838, "CONTROL_ARRAY")), 2838));
                    if (__HIVE_P2_get(__HIVE_P2_get(e, "argument", 2842), "type", 2841) === "AssignmentPattern") {
                        __HIVE_P2_syntaxRefusal(2843);
                    }
                    break;
                case "AssignmentExpression":
                    if (__HIVE_P2_get(e, "operator", 2844) !== "=") {
                        __HIVE_P2_syntaxRefusal(2845);
                    }
                    (__HIVE_P2_temp2798_21 = e, __HIVE_P2_temp2798_22 = "type", __HIVE_P2_set(__HIVE_P2_temp2798_21, __HIVE_P2_temp2798_22, "AssignmentPattern", 2846));
                    __HIVE_P2_remove(e, "operator", 2848);
                    (__HIVE_P2_temp2798_24 = this, __HIVE_P2_temp2798_25 = __HIVE_P2_get(__HIVE_P2_temp2798_24, "toAssignable", 2850), __HIVE_P2_invoke(__HIVE_P2_temp2798_25, __HIVE_P2_temp2798_24, (__HIVE_P2_reserveArray(2, 2850), __HIVE_P2_ownArray([__HIVE_P2_get(e, "left", 2851), t], 2850, "CONTROL_ARRAY")), 2850));
                    break;
                case "ParenthesizedExpression":
                    (__HIVE_P2_temp2798_26 = this, __HIVE_P2_temp2798_27 = __HIVE_P2_get(__HIVE_P2_temp2798_26, "toAssignable", 2853), __HIVE_P2_invoke(__HIVE_P2_temp2798_27, __HIVE_P2_temp2798_26, (__HIVE_P2_reserveArray(3, 2853), __HIVE_P2_ownArray([__HIVE_P2_get(e, "expression", 2854), t, i], 2853, "CONTROL_ARRAY")), 2853));
                    break;
                case "ChainExpression":
                    __HIVE_P2_syntaxRefusal(2856);
                    break;
                case "MemberExpression": if (!t) {
                    break;
                }
                default: __HIVE_P2_syntaxRefusal(2857);
            }
        }
        else if (i) {
            (__HIVE_P2_temp2798_28 = this, __HIVE_P2_temp2798_29 = __HIVE_P2_get(__HIVE_P2_temp2798_28, "checkPatternErrors", 2858), __HIVE_P2_invoke(__HIVE_P2_temp2798_29, __HIVE_P2_temp2798_28, (__HIVE_P2_reserveArray(2, 2858), __HIVE_P2_ownArray([i, true], 2858, "CONTROL_ARRAY")), 2858));
        }
        return e;
    }, 33, 3, 0, 2798)), 2796));
    (__HIVE_P2_temp0_1166 = ae, __HIVE_P2_temp0_1167 = "toAssignableList", __HIVE_P2_set(__HIVE_P2_temp0_1166, __HIVE_P2_temp0_1167, (__HIVE_P2_reserveFunction(2862), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp2862_0, __HIVE_P2_temp2862_1, __HIVE_P2_temp2862_2, __HIVE_P2_temp2862_3;
        var i = __HIVE_P2_get(e, "length", 2863);
        for (var s = 0; __HIVE_P2_binary("<", s, i, 2865); (__HIVE_P2_temp2862_0 = __HIVE_P2_numeric(s, 2866), __HIVE_P2_temp2862_1 = __HIVE_P2_temp2862_0 + 1, s = __HIVE_P2_temp2862_1, __HIVE_P2_temp2862_0)) {
            __HIVE_P2_tick(2864);
            var r = __HIVE_P2_get(e, s, 2867);
            if (r) {
                (__HIVE_P2_temp2862_2 = this, __HIVE_P2_temp2862_3 = __HIVE_P2_get(__HIVE_P2_temp2862_2, "toAssignable", 2868), __HIVE_P2_invoke(__HIVE_P2_temp2862_3, __HIVE_P2_temp2862_2, (__HIVE_P2_reserveArray(2, 2868), __HIVE_P2_ownArray([r, t], 2868, "CONTROL_ARRAY")), 2868));
            }
        }
        if (i) {
            var a = __HIVE_P2_get(e, __HIVE_P2_binary("-", i, 1, 2871), 2870);
            if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 2873), "ecmaVersion", 2872) === 6 && t && a && __HIVE_P2_get(a, "type", 2874) === "RestElement" && __HIVE_P2_get(__HIVE_P2_get(a, "argument", 2876), "type", 2875) !== "Identifier") {
                __HIVE_P2_syntaxRefusal(2877);
            }
        }
        return e;
    }, 8, 2, 0, 2862)), 2860));
    (__HIVE_P2_temp0_1169 = ae, __HIVE_P2_temp0_1170 = "parseSpread", __HIVE_P2_set(__HIVE_P2_temp0_1169, __HIVE_P2_temp0_1170, (__HIVE_P2_reserveFunction(2880), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp2880_0, __HIVE_P2_temp2880_1, __HIVE_P2_temp2880_2, __HIVE_P2_temp2880_3, __HIVE_P2_temp2880_4, __HIVE_P2_temp2880_5, __HIVE_P2_temp2880_6, __HIVE_P2_temp2880_7, __HIVE_P2_temp2880_8, __HIVE_P2_temp2880_9, __HIVE_P2_temp2880_10;
        var t = (__HIVE_P2_temp2880_0 = this, __HIVE_P2_temp2880_1 = __HIVE_P2_get(__HIVE_P2_temp2880_0, "startNode", 2881), __HIVE_P2_invoke(__HIVE_P2_temp2880_1, __HIVE_P2_temp2880_0, (__HIVE_P2_reserveArray(0, 2881), __HIVE_P2_ownArray([], 2881, "CONTROL_ARRAY")), 2881));
        (__HIVE_P2_temp2880_2 = this, __HIVE_P2_temp2880_3 = __HIVE_P2_get(__HIVE_P2_temp2880_2, "next", 2883), __HIVE_P2_invoke(__HIVE_P2_temp2880_3, __HIVE_P2_temp2880_2, (__HIVE_P2_reserveArray(0, 2883), __HIVE_P2_ownArray([], 2883, "CONTROL_ARRAY")), 2883));
        (__HIVE_P2_temp2880_4 = t, __HIVE_P2_temp2880_5 = "argument", __HIVE_P2_set(__HIVE_P2_temp2880_4, __HIVE_P2_temp2880_5, (__HIVE_P2_temp2880_7 = this, __HIVE_P2_temp2880_8 = __HIVE_P2_get(__HIVE_P2_temp2880_7, "parseMaybeAssign", 2887), __HIVE_P2_invoke(__HIVE_P2_temp2880_8, __HIVE_P2_temp2880_7, (__HIVE_P2_reserveArray(2, 2887), __HIVE_P2_ownArray([false, e], 2887, "CONTROL_ARRAY")), 2887)), 2885));
        return (__HIVE_P2_temp2880_9 = this, __HIVE_P2_temp2880_10 = __HIVE_P2_get(__HIVE_P2_temp2880_9, "finishNode", 2889), __HIVE_P2_invoke(__HIVE_P2_temp2880_10, __HIVE_P2_temp2880_9, (__HIVE_P2_reserveArray(2, 2889), __HIVE_P2_ownArray([t, "SpreadElement"], 2889, "CONTROL_ARRAY")), 2889));
    }, 12, 1, 0, 2880)), 2878));
    (__HIVE_P2_temp0_1172 = ae, __HIVE_P2_temp0_1173 = "parseRestBinding", __HIVE_P2_set(__HIVE_P2_temp0_1172, __HIVE_P2_temp0_1173, (__HIVE_P2_reserveFunction(2893), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp2893_0, __HIVE_P2_temp2893_1, __HIVE_P2_temp2893_2, __HIVE_P2_temp2893_3, __HIVE_P2_temp2893_4, __HIVE_P2_temp2893_5, __HIVE_P2_temp2893_6, __HIVE_P2_temp2893_7, __HIVE_P2_temp2893_8, __HIVE_P2_temp2893_9, __HIVE_P2_temp2893_10;
        var e = (__HIVE_P2_temp2893_0 = this, __HIVE_P2_temp2893_1 = __HIVE_P2_get(__HIVE_P2_temp2893_0, "startNode", 2894), __HIVE_P2_invoke(__HIVE_P2_temp2893_1, __HIVE_P2_temp2893_0, (__HIVE_P2_reserveArray(0, 2894), __HIVE_P2_ownArray([], 2894, "CONTROL_ARRAY")), 2894));
        (__HIVE_P2_temp2893_2 = this, __HIVE_P2_temp2893_3 = __HIVE_P2_get(__HIVE_P2_temp2893_2, "next", 2896), __HIVE_P2_invoke(__HIVE_P2_temp2893_3, __HIVE_P2_temp2893_2, (__HIVE_P2_reserveArray(0, 2896), __HIVE_P2_ownArray([], 2896, "CONTROL_ARRAY")), 2896));
        if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 2899), "ecmaVersion", 2898) === 6 && __HIVE_P2_get(this, "type", 2900) !== __HIVE_P2_get(m, "name", 2901)) {
            __HIVE_P2_syntaxRefusal(2902);
        }
        (__HIVE_P2_temp2893_4 = e, __HIVE_P2_temp2893_5 = "argument", __HIVE_P2_set(__HIVE_P2_temp2893_4, __HIVE_P2_temp2893_5, (__HIVE_P2_temp2893_7 = this, __HIVE_P2_temp2893_8 = __HIVE_P2_get(__HIVE_P2_temp2893_7, "parseBindingAtom", 2905), __HIVE_P2_invoke(__HIVE_P2_temp2893_8, __HIVE_P2_temp2893_7, (__HIVE_P2_reserveArray(0, 2905), __HIVE_P2_ownArray([], 2905, "CONTROL_ARRAY")), 2905)), 2903));
        return (__HIVE_P2_temp2893_9 = this, __HIVE_P2_temp2893_10 = __HIVE_P2_get(__HIVE_P2_temp2893_9, "finishNode", 2907), __HIVE_P2_invoke(__HIVE_P2_temp2893_10, __HIVE_P2_temp2893_9, (__HIVE_P2_reserveArray(2, 2907), __HIVE_P2_ownArray([e, "RestElement"], 2907, "CONTROL_ARRAY")), 2907));
    }, 12, 0, 0, 2893)), 2891));
    (__HIVE_P2_temp0_1175 = ae, __HIVE_P2_temp0_1176 = "parseBindingAtom", __HIVE_P2_set(__HIVE_P2_temp0_1175, __HIVE_P2_temp0_1176, (__HIVE_P2_reserveFunction(2911), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp2911_0, __HIVE_P2_temp2911_1, __HIVE_P2_temp2911_2, __HIVE_P2_temp2911_3, __HIVE_P2_temp2911_4, __HIVE_P2_temp2911_5, __HIVE_P2_temp2911_6, __HIVE_P2_temp2911_7, __HIVE_P2_temp2911_8, __HIVE_P2_temp2911_9, __HIVE_P2_temp2911_10, __HIVE_P2_temp2911_11, __HIVE_P2_temp2911_12, __HIVE_P2_temp2911_13, __HIVE_P2_temp2911_14;
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 2914), "ecmaVersion", 2913), 6, 2912)) {
            switch (__HIVE_P2_get(this, "type", 2915)) {
                case __HIVE_P2_get(m, "bracketL", 2916):
                    var e = (__HIVE_P2_temp2911_0 = this, __HIVE_P2_temp2911_1 = __HIVE_P2_get(__HIVE_P2_temp2911_0, "startNode", 2917), __HIVE_P2_invoke(__HIVE_P2_temp2911_1, __HIVE_P2_temp2911_0, (__HIVE_P2_reserveArray(0, 2917), __HIVE_P2_ownArray([], 2917, "CONTROL_ARRAY")), 2917));
                    (__HIVE_P2_temp2911_2 = this, __HIVE_P2_temp2911_3 = __HIVE_P2_get(__HIVE_P2_temp2911_2, "next", 2919), __HIVE_P2_invoke(__HIVE_P2_temp2911_3, __HIVE_P2_temp2911_2, (__HIVE_P2_reserveArray(0, 2919), __HIVE_P2_ownArray([], 2919, "CONTROL_ARRAY")), 2919));
                    (__HIVE_P2_temp2911_4 = e, __HIVE_P2_temp2911_5 = "elements", __HIVE_P2_set(__HIVE_P2_temp2911_4, __HIVE_P2_temp2911_5, (__HIVE_P2_temp2911_7 = this, __HIVE_P2_temp2911_8 = __HIVE_P2_get(__HIVE_P2_temp2911_7, "parseBindingList", 2923), __HIVE_P2_invoke(__HIVE_P2_temp2911_8, __HIVE_P2_temp2911_7, (__HIVE_P2_reserveArray(3, 2923), __HIVE_P2_ownArray([__HIVE_P2_get(m, "bracketR", 2924), true, true], 2923, "CONTROL_ARRAY")), 2923)), 2921));
                    return (__HIVE_P2_temp2911_9 = this, __HIVE_P2_temp2911_10 = __HIVE_P2_get(__HIVE_P2_temp2911_9, "finishNode", 2926), __HIVE_P2_invoke(__HIVE_P2_temp2911_10, __HIVE_P2_temp2911_9, (__HIVE_P2_reserveArray(2, 2926), __HIVE_P2_ownArray([e, "ArrayPattern"], 2926, "CONTROL_ARRAY")), 2926));
                case __HIVE_P2_get(m, "braceL", 2928): return (__HIVE_P2_temp2911_11 = this, __HIVE_P2_temp2911_12 = __HIVE_P2_get(__HIVE_P2_temp2911_11, "parseObj", 2929), __HIVE_P2_invoke(__HIVE_P2_temp2911_12, __HIVE_P2_temp2911_11, (__HIVE_P2_reserveArray(1, 2929), __HIVE_P2_ownArray([true], 2929, "CONTROL_ARRAY")), 2929));
            }
        }
        return (__HIVE_P2_temp2911_13 = this, __HIVE_P2_temp2911_14 = __HIVE_P2_get(__HIVE_P2_temp2911_13, "parseIdent", 2931), __HIVE_P2_invoke(__HIVE_P2_temp2911_14, __HIVE_P2_temp2911_13, (__HIVE_P2_reserveArray(0, 2931), __HIVE_P2_ownArray([], 2931, "CONTROL_ARRAY")), 2931));
    }, 16, 0, 0, 2911)), 2909));
    (__HIVE_P2_temp0_1178 = ae, __HIVE_P2_temp0_1179 = "parseBindingList", __HIVE_P2_set(__HIVE_P2_temp0_1178, __HIVE_P2_temp0_1179, (__HIVE_P2_reserveFunction(2935), __HIVE_P2_registerFunction(function (e, t, i, s) {
        var __HIVE_P2_temp2935_0, __HIVE_P2_temp2935_1, __HIVE_P2_temp2935_2, __HIVE_P2_temp2935_3, __HIVE_P2_temp2935_4, __HIVE_P2_temp2935_5, __HIVE_P2_temp2935_6, __HIVE_P2_temp2935_7, __HIVE_P2_temp2935_8, __HIVE_P2_temp2935_9, __HIVE_P2_temp2935_10, __HIVE_P2_temp2935_11, __HIVE_P2_temp2935_12, __HIVE_P2_temp2935_13, __HIVE_P2_temp2935_14, __HIVE_P2_temp2935_15, __HIVE_P2_temp2935_16, __HIVE_P2_temp2935_17, __HIVE_P2_temp2935_18, __HIVE_P2_temp2935_19, __HIVE_P2_temp2935_20;
        var r = (__HIVE_P2_temp2935_0 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp2935_0, 2936), __HIVE_P2_reserveArray(0, 2936, 0), __HIVE_P2_ownArray([], 2936, "ARRAY", __HIVE_P2_temp2935_0)), a = true;
        while (!(__HIVE_P2_temp2935_1 = this, __HIVE_P2_temp2935_2 = __HIVE_P2_get(__HIVE_P2_temp2935_1, "eat", 2938), __HIVE_P2_invoke(__HIVE_P2_temp2935_2, __HIVE_P2_temp2935_1, (__HIVE_P2_reserveArray(1, 2938), __HIVE_P2_ownArray([e], 2938, "CONTROL_ARRAY")), 2938))) {
            __HIVE_P2_tick(2937);
            if (a) {
                a = false;
            }
            else {
                (__HIVE_P2_temp2935_3 = this, __HIVE_P2_temp2935_4 = __HIVE_P2_get(__HIVE_P2_temp2935_3, "expect", 2941), __HIVE_P2_invoke(__HIVE_P2_temp2935_4, __HIVE_P2_temp2935_3, (__HIVE_P2_reserveArray(1, 2941), __HIVE_P2_ownArray([__HIVE_P2_get(m, "comma", 2942)], 2941, "CONTROL_ARRAY")), 2941));
            }
            if (t && __HIVE_P2_get(this, "type", 2944) === __HIVE_P2_get(m, "comma", 2945)) {
                (__HIVE_P2_temp2935_5 = r, __HIVE_P2_temp2935_6 = __HIVE_P2_get(__HIVE_P2_temp2935_5, "push", 2946), __HIVE_P2_invoke(__HIVE_P2_temp2935_6, __HIVE_P2_temp2935_5, (__HIVE_P2_reserveArray(1, 2946), __HIVE_P2_ownArray([null], 2946, "CONTROL_ARRAY")), 2946));
            }
            else if (i && (__HIVE_P2_temp2935_7 = this, __HIVE_P2_temp2935_8 = __HIVE_P2_get(__HIVE_P2_temp2935_7, "afterTrailingComma", 2948), __HIVE_P2_invoke(__HIVE_P2_temp2935_8, __HIVE_P2_temp2935_7, (__HIVE_P2_reserveArray(1, 2948), __HIVE_P2_ownArray([e], 2948, "CONTROL_ARRAY")), 2948))) {
                break;
            }
            else if (__HIVE_P2_get(this, "type", 2950) === __HIVE_P2_get(m, "ellipsis", 2951)) {
                var n = (__HIVE_P2_temp2935_9 = this, __HIVE_P2_temp2935_10 = __HIVE_P2_get(__HIVE_P2_temp2935_9, "parseRestBinding", 2952), __HIVE_P2_invoke(__HIVE_P2_temp2935_10, __HIVE_P2_temp2935_9, (__HIVE_P2_reserveArray(0, 2952), __HIVE_P2_ownArray([], 2952, "CONTROL_ARRAY")), 2952));
                (__HIVE_P2_temp2935_11 = this, __HIVE_P2_temp2935_12 = __HIVE_P2_get(__HIVE_P2_temp2935_11, "parseBindingListItem", 2954), __HIVE_P2_invoke(__HIVE_P2_temp2935_12, __HIVE_P2_temp2935_11, (__HIVE_P2_reserveArray(1, 2954), __HIVE_P2_ownArray([n], 2954, "CONTROL_ARRAY")), 2954));
                (__HIVE_P2_temp2935_13 = r, __HIVE_P2_temp2935_14 = __HIVE_P2_get(__HIVE_P2_temp2935_13, "push", 2956), __HIVE_P2_invoke(__HIVE_P2_temp2935_14, __HIVE_P2_temp2935_13, (__HIVE_P2_reserveArray(1, 2956), __HIVE_P2_ownArray([n], 2956, "CONTROL_ARRAY")), 2956));
                if (__HIVE_P2_get(this, "type", 2958) === __HIVE_P2_get(m, "comma", 2959)) {
                    __HIVE_P2_syntaxRefusal(2960);
                }
                (__HIVE_P2_temp2935_15 = this, __HIVE_P2_temp2935_16 = __HIVE_P2_get(__HIVE_P2_temp2935_15, "expect", 2961), __HIVE_P2_invoke(__HIVE_P2_temp2935_16, __HIVE_P2_temp2935_15, (__HIVE_P2_reserveArray(1, 2961), __HIVE_P2_ownArray([e], 2961, "CONTROL_ARRAY")), 2961));
                break;
            }
            else {
                (__HIVE_P2_temp2935_19 = r, __HIVE_P2_temp2935_20 = __HIVE_P2_get(__HIVE_P2_temp2935_19, "push", 2963), __HIVE_P2_invoke(__HIVE_P2_temp2935_20, __HIVE_P2_temp2935_19, (__HIVE_P2_reserveArray(1, 2963), __HIVE_P2_ownArray([(__HIVE_P2_temp2935_17 = this, __HIVE_P2_temp2935_18 = __HIVE_P2_get(__HIVE_P2_temp2935_17, "parseAssignableListItem", 2964), __HIVE_P2_invoke(__HIVE_P2_temp2935_18, __HIVE_P2_temp2935_17, (__HIVE_P2_reserveArray(1, 2964), __HIVE_P2_ownArray([s], 2964, "CONTROL_ARRAY")), 2964))], 2963, "CONTROL_ARRAY")), 2963));
            }
        }
        return r;
    }, 24, 4, 0, 2935)), 2933));
    (__HIVE_P2_temp0_1181 = ae, __HIVE_P2_temp0_1182 = "parseAssignableListItem", __HIVE_P2_set(__HIVE_P2_temp0_1181, __HIVE_P2_temp0_1182, (__HIVE_P2_reserveFunction(2969), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp2969_0, __HIVE_P2_temp2969_1, __HIVE_P2_temp2969_2, __HIVE_P2_temp2969_3;
        var t = (__HIVE_P2_temp2969_0 = this, __HIVE_P2_temp2969_1 = __HIVE_P2_get(__HIVE_P2_temp2969_0, "parseMaybeDefault", 2970), __HIVE_P2_invoke(__HIVE_P2_temp2969_1, __HIVE_P2_temp2969_0, (__HIVE_P2_reserveArray(2, 2970), __HIVE_P2_ownArray([__HIVE_P2_get(this, "start", 2971), __HIVE_P2_get(this, "startLoc", 2972)], 2970, "CONTROL_ARRAY")), 2970));
        (__HIVE_P2_temp2969_2 = this, __HIVE_P2_temp2969_3 = __HIVE_P2_get(__HIVE_P2_temp2969_2, "parseBindingListItem", 2974), __HIVE_P2_invoke(__HIVE_P2_temp2969_3, __HIVE_P2_temp2969_2, (__HIVE_P2_reserveArray(1, 2974), __HIVE_P2_ownArray([t], 2974, "CONTROL_ARRAY")), 2974));
        return t;
    }, 5, 1, 0, 2969)), 2967));
    (__HIVE_P2_temp0_1184 = ae, __HIVE_P2_temp0_1185 = "parseBindingListItem", __HIVE_P2_set(__HIVE_P2_temp0_1184, __HIVE_P2_temp0_1185, (__HIVE_P2_reserveFunction(2978), __HIVE_P2_registerFunction(function (e) {
        return e;
    }, 0, 1, 0, 2978)), 2976));
    (__HIVE_P2_temp0_1187 = ae, __HIVE_P2_temp0_1188 = "parseMaybeDefault", __HIVE_P2_set(__HIVE_P2_temp0_1187, __HIVE_P2_temp0_1188, (__HIVE_P2_reserveFunction(2981), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp2981_0, __HIVE_P2_temp2981_1, __HIVE_P2_temp2981_2, __HIVE_P2_temp2981_3, __HIVE_P2_temp2981_4, __HIVE_P2_temp2981_5, __HIVE_P2_temp2981_6, __HIVE_P2_temp2981_7, __HIVE_P2_temp2981_8, __HIVE_P2_temp2981_9, __HIVE_P2_temp2981_10, __HIVE_P2_temp2981_11, __HIVE_P2_temp2981_12, __HIVE_P2_temp2981_13, __HIVE_P2_temp2981_14, __HIVE_P2_temp2981_15;
        i = i || (__HIVE_P2_temp2981_0 = this, __HIVE_P2_temp2981_1 = __HIVE_P2_get(__HIVE_P2_temp2981_0, "parseBindingAtom", 2983), __HIVE_P2_invoke(__HIVE_P2_temp2981_1, __HIVE_P2_temp2981_0, (__HIVE_P2_reserveArray(0, 2983), __HIVE_P2_ownArray([], 2983, "CONTROL_ARRAY")), 2983));
        if (__HIVE_P2_binary("<", __HIVE_P2_get(__HIVE_P2_get(this, "options", 2987), "ecmaVersion", 2986), 6, 2985) || !(__HIVE_P2_temp2981_2 = this, __HIVE_P2_temp2981_3 = __HIVE_P2_get(__HIVE_P2_temp2981_2, "eat", 2988), __HIVE_P2_invoke(__HIVE_P2_temp2981_3, __HIVE_P2_temp2981_2, (__HIVE_P2_reserveArray(1, 2988), __HIVE_P2_ownArray([__HIVE_P2_get(m, "eq", 2989)], 2988, "CONTROL_ARRAY")), 2988))) {
            return i;
        }
        var s = (__HIVE_P2_temp2981_4 = this, __HIVE_P2_temp2981_5 = __HIVE_P2_get(__HIVE_P2_temp2981_4, "startNodeAt", 2991), __HIVE_P2_invoke(__HIVE_P2_temp2981_5, __HIVE_P2_temp2981_4, (__HIVE_P2_reserveArray(2, 2991), __HIVE_P2_ownArray([e, t], 2991, "CONTROL_ARRAY")), 2991));
        (__HIVE_P2_temp2981_6 = s, __HIVE_P2_temp2981_7 = "left", __HIVE_P2_set(__HIVE_P2_temp2981_6, __HIVE_P2_temp2981_7, i, 2993));
        (__HIVE_P2_temp2981_9 = s, __HIVE_P2_temp2981_10 = "right", __HIVE_P2_set(__HIVE_P2_temp2981_9, __HIVE_P2_temp2981_10, (__HIVE_P2_temp2981_12 = this, __HIVE_P2_temp2981_13 = __HIVE_P2_get(__HIVE_P2_temp2981_12, "parseMaybeAssign", 2997), __HIVE_P2_invoke(__HIVE_P2_temp2981_13, __HIVE_P2_temp2981_12, (__HIVE_P2_reserveArray(0, 2997), __HIVE_P2_ownArray([], 2997, "CONTROL_ARRAY")), 2997)), 2995));
        return (__HIVE_P2_temp2981_14 = this, __HIVE_P2_temp2981_15 = __HIVE_P2_get(__HIVE_P2_temp2981_14, "finishNode", 2999), __HIVE_P2_invoke(__HIVE_P2_temp2981_15, __HIVE_P2_temp2981_14, (__HIVE_P2_reserveArray(2, 2999), __HIVE_P2_ownArray([s, "AssignmentPattern"], 2999, "CONTROL_ARRAY")), 2999));
    }, 17, 3, 0, 2981)), 2979));
    (__HIVE_P2_temp0_1190 = ae, __HIVE_P2_temp0_1191 = "checkLValSimple", __HIVE_P2_set(__HIVE_P2_temp0_1190, __HIVE_P2_temp0_1191, (__HIVE_P2_reserveFunction(3003), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp3003_0, __HIVE_P2_temp3003_1, __HIVE_P2_temp3003_2, __HIVE_P2_temp3003_3, __HIVE_P2_temp3003_4, __HIVE_P2_temp3003_5, __HIVE_P2_temp3003_6, __HIVE_P2_temp3003_7, __HIVE_P2_temp3003_8;
        if (t === void 0)
            t = q;
        var s = t !== q;
        switch (__HIVE_P2_get(e, "type", 3005)) {
            case "Identifier":
                if (__HIVE_P2_get(this, "strict", 3006) && (__HIVE_P2_temp3003_0 = __HIVE_P2_get(this, "reservedWordsStrictBind", 3010), __HIVE_P2_temp3003_1 = __HIVE_P2_get(__HIVE_P2_temp3003_0, "test", 3007), __HIVE_P2_invoke(__HIVE_P2_temp3003_1, __HIVE_P2_temp3003_0, (__HIVE_P2_reserveArray(1, 3007), __HIVE_P2_ownArray([__HIVE_P2_get(e, "name", 3008)], 3007, "CONTROL_ARRAY")), 3007))) {
                    __HIVE_P2_syntaxRefusal(3011);
                }
                if (s) {
                    if (t === G && __HIVE_P2_get(e, "name", 3012) === "let") {
                        __HIVE_P2_syntaxRefusal(3013);
                    }
                    if (i) {
                        if (__HIVE_P2_invoke(S, void 0, (__HIVE_P2_reserveArray(2, 3014), __HIVE_P2_ownArray([i, __HIVE_P2_get(e, "name", 3015)], 3014, "CONTROL_ARRAY")), 3014)) {
                            __HIVE_P2_syntaxRefusal(3016);
                        }
                        (__HIVE_P2_temp3003_2 = i, __HIVE_P2_temp3003_3 = __HIVE_P2_get(e, "name", 3019), __HIVE_P2_set(__HIVE_P2_temp3003_2, __HIVE_P2_temp3003_3, true, 3017));
                    }
                    if (t !== z) {
                        (__HIVE_P2_temp3003_5 = this, __HIVE_P2_temp3003_6 = __HIVE_P2_get(__HIVE_P2_temp3003_5, "declareName", 3020), __HIVE_P2_invoke(__HIVE_P2_temp3003_6, __HIVE_P2_temp3003_5, (__HIVE_P2_reserveArray(3, 3020), __HIVE_P2_ownArray([__HIVE_P2_get(e, "name", 3021), t, __HIVE_P2_get(e, "start", 3022)], 3020, "CONTROL_ARRAY")), 3020));
                    }
                }
                break;
            case "ChainExpression":
                __HIVE_P2_syntaxRefusal(3024);
                break;
            case "MemberExpression":
                if (s) {
                    __HIVE_P2_syntaxRefusal(3025);
                }
                break;
            case "ParenthesizedExpression":
                if (s) {
                    __HIVE_P2_syntaxRefusal(3026);
                }
                return (__HIVE_P2_temp3003_7 = this, __HIVE_P2_temp3003_8 = __HIVE_P2_get(__HIVE_P2_temp3003_7, "checkLValSimple", 3027), __HIVE_P2_invoke(__HIVE_P2_temp3003_8, __HIVE_P2_temp3003_7, (__HIVE_P2_reserveArray(3, 3027), __HIVE_P2_ownArray([__HIVE_P2_get(e, "expression", 3028), t, i], 3027, "CONTROL_ARRAY")), 3027));
            default: __HIVE_P2_syntaxRefusal(3030);
        }
    }, 10, 3, 0, 3003)), 3001));
    (__HIVE_P2_temp0_1193 = ae, __HIVE_P2_temp0_1194 = "checkLValPattern", __HIVE_P2_set(__HIVE_P2_temp0_1193, __HIVE_P2_temp0_1194, (__HIVE_P2_reserveFunction(3033), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp3033_0, __HIVE_P2_temp3033_1, __HIVE_P2_temp3033_2, __HIVE_P2_temp3033_3, __HIVE_P2_temp3033_4, __HIVE_P2_temp3033_5;
        if (t === void 0)
            t = q;
        switch (__HIVE_P2_get(e, "type", 3035)) {
            case "ObjectPattern":
                for (var s = 0, r = __HIVE_P2_get(e, "properties", 3037); __HIVE_P2_binary("<", s, __HIVE_P2_get(r, "length", 3039), 3038); s = __HIVE_P2_binary("+", s, 1, 3040)) {
                    __HIVE_P2_tick(3036);
                    var a = __HIVE_P2_get(r, s, 3041);
                    (__HIVE_P2_temp3033_0 = this, __HIVE_P2_temp3033_1 = __HIVE_P2_get(__HIVE_P2_temp3033_0, "checkLValInnerPattern", 3042), __HIVE_P2_invoke(__HIVE_P2_temp3033_1, __HIVE_P2_temp3033_0, (__HIVE_P2_reserveArray(3, 3042), __HIVE_P2_ownArray([a, t, i], 3042, "CONTROL_ARRAY")), 3042));
                }
                break;
            case "ArrayPattern":
                for (var n = 0, o = __HIVE_P2_get(e, "elements", 3045); __HIVE_P2_binary("<", n, __HIVE_P2_get(o, "length", 3047), 3046); n = __HIVE_P2_binary("+", n, 1, 3048)) {
                    __HIVE_P2_tick(3044);
                    var h = __HIVE_P2_get(o, n, 3049);
                    if (h) {
                        (__HIVE_P2_temp3033_2 = this, __HIVE_P2_temp3033_3 = __HIVE_P2_get(__HIVE_P2_temp3033_2, "checkLValInnerPattern", 3050), __HIVE_P2_invoke(__HIVE_P2_temp3033_3, __HIVE_P2_temp3033_2, (__HIVE_P2_reserveArray(3, 3050), __HIVE_P2_ownArray([h, t, i], 3050, "CONTROL_ARRAY")), 3050));
                    }
                }
                break;
            default: (__HIVE_P2_temp3033_4 = this, __HIVE_P2_temp3033_5 = __HIVE_P2_get(__HIVE_P2_temp3033_4, "checkLValSimple", 3052), __HIVE_P2_invoke(__HIVE_P2_temp3033_5, __HIVE_P2_temp3033_4, (__HIVE_P2_reserveArray(3, 3052), __HIVE_P2_ownArray([e, t, i], 3052, "CONTROL_ARRAY")), 3052));
        }
    }, 12, 3, 0, 3033)), 3031));
    (__HIVE_P2_temp0_1196 = ae, __HIVE_P2_temp0_1197 = "checkLValInnerPattern", __HIVE_P2_set(__HIVE_P2_temp0_1196, __HIVE_P2_temp0_1197, (__HIVE_P2_reserveFunction(3056), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp3056_0, __HIVE_P2_temp3056_1, __HIVE_P2_temp3056_2, __HIVE_P2_temp3056_3, __HIVE_P2_temp3056_4, __HIVE_P2_temp3056_5, __HIVE_P2_temp3056_6, __HIVE_P2_temp3056_7;
        if (t === void 0)
            t = q;
        switch (__HIVE_P2_get(e, "type", 3058)) {
            case "Property":
                (__HIVE_P2_temp3056_0 = this, __HIVE_P2_temp3056_1 = __HIVE_P2_get(__HIVE_P2_temp3056_0, "checkLValInnerPattern", 3059), __HIVE_P2_invoke(__HIVE_P2_temp3056_1, __HIVE_P2_temp3056_0, (__HIVE_P2_reserveArray(3, 3059), __HIVE_P2_ownArray([__HIVE_P2_get(e, "value", 3060), t, i], 3059, "CONTROL_ARRAY")), 3059));
                break;
            case "AssignmentPattern":
                (__HIVE_P2_temp3056_2 = this, __HIVE_P2_temp3056_3 = __HIVE_P2_get(__HIVE_P2_temp3056_2, "checkLValPattern", 3062), __HIVE_P2_invoke(__HIVE_P2_temp3056_3, __HIVE_P2_temp3056_2, (__HIVE_P2_reserveArray(3, 3062), __HIVE_P2_ownArray([__HIVE_P2_get(e, "left", 3063), t, i], 3062, "CONTROL_ARRAY")), 3062));
                break;
            case "RestElement":
                (__HIVE_P2_temp3056_4 = this, __HIVE_P2_temp3056_5 = __HIVE_P2_get(__HIVE_P2_temp3056_4, "checkLValPattern", 3065), __HIVE_P2_invoke(__HIVE_P2_temp3056_5, __HIVE_P2_temp3056_4, (__HIVE_P2_reserveArray(3, 3065), __HIVE_P2_ownArray([__HIVE_P2_get(e, "argument", 3066), t, i], 3065, "CONTROL_ARRAY")), 3065));
                break;
            default: (__HIVE_P2_temp3056_6 = this, __HIVE_P2_temp3056_7 = __HIVE_P2_get(__HIVE_P2_temp3056_6, "checkLValPattern", 3068), __HIVE_P2_invoke(__HIVE_P2_temp3056_7, __HIVE_P2_temp3056_6, (__HIVE_P2_reserveArray(3, 3068), __HIVE_P2_ownArray([e, t, i], 3068, "CONTROL_ARRAY")), 3068));
        }
    }, 8, 3, 0, 3056)), 3054));
    var ne = (__HIVE_P2_reserveFunction(3070), __HIVE_P2_registerFunction(function TokContext(e, t, i, s, r) {
        var __HIVE_P2_temp3070_0, __HIVE_P2_temp3070_1, __HIVE_P2_temp3070_2, __HIVE_P2_temp3070_3, __HIVE_P2_temp3070_4, __HIVE_P2_temp3070_5, __HIVE_P2_temp3070_6, __HIVE_P2_temp3070_7, __HIVE_P2_temp3070_8, __HIVE_P2_temp3070_9, __HIVE_P2_temp3070_10, __HIVE_P2_temp3070_11, __HIVE_P2_temp3070_12, __HIVE_P2_temp3070_13, __HIVE_P2_temp3070_14;
        (__HIVE_P2_temp3070_0 = this, __HIVE_P2_temp3070_1 = "token", __HIVE_P2_set(__HIVE_P2_temp3070_0, __HIVE_P2_temp3070_1, e, 3071));
        (__HIVE_P2_temp3070_3 = this, __HIVE_P2_temp3070_4 = "isExpr", __HIVE_P2_set(__HIVE_P2_temp3070_3, __HIVE_P2_temp3070_4, !!t, 3073));
        (__HIVE_P2_temp3070_6 = this, __HIVE_P2_temp3070_7 = "preserveSpace", __HIVE_P2_set(__HIVE_P2_temp3070_6, __HIVE_P2_temp3070_7, !!i, 3075));
        (__HIVE_P2_temp3070_9 = this, __HIVE_P2_temp3070_10 = "override", __HIVE_P2_set(__HIVE_P2_temp3070_9, __HIVE_P2_temp3070_10, s, 3077));
        (__HIVE_P2_temp3070_12 = this, __HIVE_P2_temp3070_13 = "generator", __HIVE_P2_set(__HIVE_P2_temp3070_12, __HIVE_P2_temp3070_13, !!r, 3079));
    }, 15, 5, 0, 3070));
    var oe = (__HIVE_P2_reserveObject(10, 3081), __HIVE_P2_ownObject({ b_stat: __HIVE_P2_construct(ne, (__HIVE_P2_reserveArray(2, 3082), __HIVE_P2_ownArray(["{", false], 3082, "CONTROL_ARRAY")), 3082), b_expr: __HIVE_P2_construct(ne, (__HIVE_P2_reserveArray(2, 3083), __HIVE_P2_ownArray(["{", true], 3083, "CONTROL_ARRAY")), 3083), b_tmpl: __HIVE_P2_construct(ne, (__HIVE_P2_reserveArray(2, 3084), __HIVE_P2_ownArray(["${", false], 3084, "CONTROL_ARRAY")), 3084), p_stat: __HIVE_P2_construct(ne, (__HIVE_P2_reserveArray(2, 3085), __HIVE_P2_ownArray(["(", false], 3085, "CONTROL_ARRAY")), 3085), p_expr: __HIVE_P2_construct(ne, (__HIVE_P2_reserveArray(2, 3086), __HIVE_P2_ownArray(["(", true], 3086, "CONTROL_ARRAY")), 3086), q_tmpl: __HIVE_P2_construct(ne, (__HIVE_P2_reserveArray(4, 3087), __HIVE_P2_ownArray(["`", true, true, ((__HIVE_P2_reserveFunction(3088), __HIVE_P2_registerFunction(function (e) {
                var __HIVE_P2_temp3088_0, __HIVE_P2_temp3088_1;
                return (__HIVE_P2_temp3088_0 = e, __HIVE_P2_temp3088_1 = __HIVE_P2_get(__HIVE_P2_temp3088_0, "tryReadTemplateToken", 3089), __HIVE_P2_invoke(__HIVE_P2_temp3088_1, __HIVE_P2_temp3088_0, (__HIVE_P2_reserveArray(0, 3089), __HIVE_P2_ownArray([], 3089, "CONTROL_ARRAY")), 3089));
            }, 2, 1, 0, 3088)))], 3087, "CONTROL_ARRAY")), 3087), f_stat: __HIVE_P2_construct(ne, (__HIVE_P2_reserveArray(2, 3091), __HIVE_P2_ownArray(["function", false], 3091, "CONTROL_ARRAY")), 3091), f_expr: __HIVE_P2_construct(ne, (__HIVE_P2_reserveArray(2, 3092), __HIVE_P2_ownArray(["function", true], 3092, "CONTROL_ARRAY")), 3092), f_expr_gen: __HIVE_P2_construct(ne, (__HIVE_P2_reserveArray(5, 3093), __HIVE_P2_ownArray(["function", true, false, null, true], 3093, "CONTROL_ARRAY")), 3093), f_gen: __HIVE_P2_construct(ne, (__HIVE_P2_reserveArray(5, 3094), __HIVE_P2_ownArray(["function", false, false, null, true], 3094, "CONTROL_ARRAY")), 3094) }, 3081, 10, 63));
    var he = __HIVE_P2_get(K, "prototype", 3095);
    (__HIVE_P2_temp0_1199 = he, __HIVE_P2_temp0_1200 = "initialContext", __HIVE_P2_set(__HIVE_P2_temp0_1199, __HIVE_P2_temp0_1200, (__HIVE_P2_reserveFunction(3098), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp3098_0, __HIVE_P2_temp3098_1;
        return (__HIVE_P2_temp3098_0 = 0, __HIVE_P2_temp3098_1 = __HIVE_P2_get(oe, "b_stat", 3100), __HIVE_P2_temp3098_0 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp3098_0, __HIVE_P2_temp3098_1, 3099), __HIVE_P2_checkArrayDepth(__HIVE_P2_temp3098_0, 3099), __HIVE_P2_reserveArray(1, 3099, 1), __HIVE_P2_ownArray([__HIVE_P2_temp3098_1], 3099, "ARRAY", __HIVE_P2_temp3098_0));
    }, 2, 0, 0, 3098)), 3096));
    (__HIVE_P2_temp0_1202 = he, __HIVE_P2_temp0_1203 = "curContext", __HIVE_P2_set(__HIVE_P2_temp0_1202, __HIVE_P2_temp0_1203, (__HIVE_P2_reserveFunction(3103), __HIVE_P2_registerFunction(function () {
        return __HIVE_P2_get(__HIVE_P2_get(this, "context", 3105), __HIVE_P2_binary("-", __HIVE_P2_get(__HIVE_P2_get(this, "context", 3108), "length", 3107), 1, 3106), 3104);
    }, 0, 0, 0, 3103)), 3101));
    (__HIVE_P2_temp0_1205 = he, __HIVE_P2_temp0_1206 = "braceIsBlock", __HIVE_P2_set(__HIVE_P2_temp0_1205, __HIVE_P2_temp0_1206, (__HIVE_P2_reserveFunction(3111), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp3111_0, __HIVE_P2_temp3111_1, __HIVE_P2_temp3111_2, __HIVE_P2_temp3111_3, __HIVE_P2_temp3111_4, __HIVE_P2_temp3111_5;
        var t = (__HIVE_P2_temp3111_0 = this, __HIVE_P2_temp3111_1 = __HIVE_P2_get(__HIVE_P2_temp3111_0, "curContext", 3112), __HIVE_P2_invoke(__HIVE_P2_temp3111_1, __HIVE_P2_temp3111_0, (__HIVE_P2_reserveArray(0, 3112), __HIVE_P2_ownArray([], 3112, "CONTROL_ARRAY")), 3112));
        if (t === __HIVE_P2_get(oe, "f_expr", 3114) || t === __HIVE_P2_get(oe, "f_stat", 3115)) {
            return true;
        }
        if (e === __HIVE_P2_get(m, "colon", 3116) && (t === __HIVE_P2_get(oe, "b_stat", 3117) || t === __HIVE_P2_get(oe, "b_expr", 3118))) {
            return !__HIVE_P2_get(t, "isExpr", 3119);
        }
        if (e === __HIVE_P2_get(m, "_return", 3120) || e === __HIVE_P2_get(m, "name", 3121) && __HIVE_P2_get(this, "exprAllowed", 3122)) {
            return (__HIVE_P2_temp3111_4 = g, __HIVE_P2_temp3111_5 = __HIVE_P2_get(__HIVE_P2_temp3111_4, "test", 3123), __HIVE_P2_invoke(__HIVE_P2_temp3111_5, __HIVE_P2_temp3111_4, (__HIVE_P2_reserveArray(1, 3123), __HIVE_P2_ownArray([(__HIVE_P2_temp3111_2 = __HIVE_P2_get(this, "input", 3128), __HIVE_P2_temp3111_3 = __HIVE_P2_get(__HIVE_P2_temp3111_2, "slice", 3124), __HIVE_P2_invoke(__HIVE_P2_temp3111_3, __HIVE_P2_temp3111_2, (__HIVE_P2_reserveArray(2, 3124), __HIVE_P2_ownArray([__HIVE_P2_get(this, "lastTokEnd", 3125), __HIVE_P2_get(this, "start", 3126)], 3124, "CONTROL_ARRAY")), 3124))], 3123, "CONTROL_ARRAY")), 3123));
        }
        if (e === __HIVE_P2_get(m, "_else", 3130) || e === __HIVE_P2_get(m, "semi", 3131) || e === __HIVE_P2_get(m, "eof", 3132) || e === __HIVE_P2_get(m, "parenR", 3133) || e === __HIVE_P2_get(m, "arrow", 3134)) {
            return true;
        }
        if (e === __HIVE_P2_get(m, "braceL", 3135)) {
            return t === __HIVE_P2_get(oe, "b_stat", 3136);
        }
        if (e === __HIVE_P2_get(m, "_var", 3137) || e === __HIVE_P2_get(m, "_const", 3138) || e === __HIVE_P2_get(m, "name", 3139)) {
            return false;
        }
        return !__HIVE_P2_get(this, "exprAllowed", 3140);
    }, 7, 1, 0, 3111)), 3109));
    (__HIVE_P2_temp0_1208 = he, __HIVE_P2_temp0_1209 = "inGeneratorContext", __HIVE_P2_set(__HIVE_P2_temp0_1208, __HIVE_P2_temp0_1209, (__HIVE_P2_reserveFunction(3143), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp3143_0, __HIVE_P2_temp3143_1;
        for (var e = __HIVE_P2_binary("-", __HIVE_P2_get(__HIVE_P2_get(this, "context", 3147), "length", 3146), 1, 3145); __HIVE_P2_binary(">=", e, 1, 3148); (__HIVE_P2_temp3143_0 = __HIVE_P2_numeric(e, 3149), __HIVE_P2_temp3143_1 = __HIVE_P2_temp3143_0 + -1, e = __HIVE_P2_temp3143_1, __HIVE_P2_temp3143_0)) {
            __HIVE_P2_tick(3144);
            var t = __HIVE_P2_get(__HIVE_P2_get(this, "context", 3151), e, 3150);
            if (__HIVE_P2_get(t, "token", 3152) === "function") {
                return __HIVE_P2_get(t, "generator", 3153);
            }
        }
        return false;
    }, 4, 0, 0, 3143)), 3141));
    (__HIVE_P2_temp0_1211 = he, __HIVE_P2_temp0_1212 = "updateContext", __HIVE_P2_set(__HIVE_P2_temp0_1211, __HIVE_P2_temp0_1212, (__HIVE_P2_reserveFunction(3156), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp3156_0, __HIVE_P2_temp3156_1, __HIVE_P2_temp3156_2, __HIVE_P2_temp3156_3, __HIVE_P2_temp3156_4, __HIVE_P2_temp3156_5, __HIVE_P2_temp3156_6, __HIVE_P2_temp3156_7;
        var t, i = __HIVE_P2_get(this, "type", 3157);
        if (__HIVE_P2_get(i, "keyword", 3158) && e === __HIVE_P2_get(m, "dot", 3159)) {
            (__HIVE_P2_temp3156_0 = this, __HIVE_P2_temp3156_1 = "exprAllowed", __HIVE_P2_set(__HIVE_P2_temp3156_0, __HIVE_P2_temp3156_1, false, 3160));
        }
        else if (t = __HIVE_P2_get(i, "updateContext", 3163)) {
            (__HIVE_P2_temp3156_3 = t, __HIVE_P2_temp3156_4 = __HIVE_P2_get(__HIVE_P2_temp3156_3, "call", 3164), __HIVE_P2_invoke(__HIVE_P2_temp3156_4, __HIVE_P2_temp3156_3, (__HIVE_P2_reserveArray(2, 3164), __HIVE_P2_ownArray([this, e], 3164, "CONTROL_ARRAY")), 3164));
        }
        else {
            (__HIVE_P2_temp3156_5 = this, __HIVE_P2_temp3156_6 = "exprAllowed", __HIVE_P2_set(__HIVE_P2_temp3156_5, __HIVE_P2_temp3156_6, __HIVE_P2_get(i, "beforeExpr", 3168), 3166));
        }
    }, 10, 1, 0, 3156)), 3154));
    (__HIVE_P2_temp0_1214 = he, __HIVE_P2_temp0_1215 = "overrideContext", __HIVE_P2_set(__HIVE_P2_temp0_1214, __HIVE_P2_temp0_1215, (__HIVE_P2_reserveFunction(3171), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp3171_0, __HIVE_P2_temp3171_1, __HIVE_P2_temp3171_2, __HIVE_P2_temp3171_3, __HIVE_P2_temp3171_4;
        if ((__HIVE_P2_temp3171_0 = this, __HIVE_P2_temp3171_1 = __HIVE_P2_get(__HIVE_P2_temp3171_0, "curContext", 3172), __HIVE_P2_invoke(__HIVE_P2_temp3171_1, __HIVE_P2_temp3171_0, (__HIVE_P2_reserveArray(0, 3172), __HIVE_P2_ownArray([], 3172, "CONTROL_ARRAY")), 3172)) !== e) {
            (__HIVE_P2_temp3171_2 = __HIVE_P2_get(this, "context", 3176), __HIVE_P2_temp3171_3 = __HIVE_P2_binary("-", __HIVE_P2_get(__HIVE_P2_get(this, "context", 3179), "length", 3178), 1, 3177), __HIVE_P2_set(__HIVE_P2_temp3171_2, __HIVE_P2_temp3171_3, e, 3174));
        }
    }, 5, 1, 0, 3171)), 3169));
    (__HIVE_P2_temp0_1217 = __HIVE_P2_get(m, "parenR", 3182), __HIVE_P2_temp0_1218 = "updateContext", __HIVE_P2_set(__HIVE_P2_temp0_1217, __HIVE_P2_temp0_1218, (__HIVE_P2_temp0_1220 = __HIVE_P2_get(m, "braceR", 3185), __HIVE_P2_temp0_1221 = "updateContext", __HIVE_P2_set(__HIVE_P2_temp0_1220, __HIVE_P2_temp0_1221, (__HIVE_P2_reserveFunction(3186), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp3186_0, __HIVE_P2_temp3186_1, __HIVE_P2_temp3186_2, __HIVE_P2_temp3186_3, __HIVE_P2_temp3186_4, __HIVE_P2_temp3186_5, __HIVE_P2_temp3186_6, __HIVE_P2_temp3186_7, __HIVE_P2_temp3186_8, __HIVE_P2_temp3186_9, __HIVE_P2_temp3186_10, __HIVE_P2_temp3186_11;
        if (__HIVE_P2_get(__HIVE_P2_get(this, "context", 3188), "length", 3187) === 1) {
            (__HIVE_P2_temp3186_0 = this, __HIVE_P2_temp3186_1 = "exprAllowed", __HIVE_P2_set(__HIVE_P2_temp3186_0, __HIVE_P2_temp3186_1, true, 3189));
            return;
        }
        var e = (__HIVE_P2_temp3186_3 = __HIVE_P2_get(this, "context", 3193), __HIVE_P2_temp3186_4 = __HIVE_P2_get(__HIVE_P2_temp3186_3, "pop", 3191), __HIVE_P2_invoke(__HIVE_P2_temp3186_4, __HIVE_P2_temp3186_3, (__HIVE_P2_reserveArray(0, 3191), __HIVE_P2_ownArray([], 3191, "CONTROL_ARRAY")), 3191));
        if (e === __HIVE_P2_get(oe, "b_stat", 3194) && __HIVE_P2_get((__HIVE_P2_temp3186_5 = this, __HIVE_P2_temp3186_6 = __HIVE_P2_get(__HIVE_P2_temp3186_5, "curContext", 3196), __HIVE_P2_invoke(__HIVE_P2_temp3186_6, __HIVE_P2_temp3186_5, (__HIVE_P2_reserveArray(0, 3196), __HIVE_P2_ownArray([], 3196, "CONTROL_ARRAY")), 3196)), "token", 3195) === "function") {
            e = (__HIVE_P2_temp3186_7 = __HIVE_P2_get(this, "context", 3201), __HIVE_P2_temp3186_8 = __HIVE_P2_get(__HIVE_P2_temp3186_7, "pop", 3199), __HIVE_P2_invoke(__HIVE_P2_temp3186_8, __HIVE_P2_temp3186_7, (__HIVE_P2_reserveArray(0, 3199), __HIVE_P2_ownArray([], 3199, "CONTROL_ARRAY")), 3199));
        }
        (__HIVE_P2_temp3186_9 = this, __HIVE_P2_temp3186_10 = "exprAllowed", __HIVE_P2_set(__HIVE_P2_temp3186_9, __HIVE_P2_temp3186_10, !__HIVE_P2_get(e, "isExpr", 3204), 3202));
    }, 13, 0, 0, 3186)), 3183)), 3180));
    (__HIVE_P2_temp0_1223 = __HIVE_P2_get(m, "braceL", 3207), __HIVE_P2_temp0_1224 = "updateContext", __HIVE_P2_set(__HIVE_P2_temp0_1223, __HIVE_P2_temp0_1224, (__HIVE_P2_reserveFunction(3208), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp3208_0, __HIVE_P2_temp3208_1, __HIVE_P2_temp3208_2, __HIVE_P2_temp3208_3, __HIVE_P2_temp3208_4, __HIVE_P2_temp3208_5, __HIVE_P2_temp3208_6;
        (__HIVE_P2_temp3208_2 = __HIVE_P2_get(this, "context", 3215), __HIVE_P2_temp3208_3 = __HIVE_P2_get(__HIVE_P2_temp3208_2, "push", 3209), __HIVE_P2_invoke(__HIVE_P2_temp3208_3, __HIVE_P2_temp3208_2, (__HIVE_P2_reserveArray(1, 3209), __HIVE_P2_ownArray([(__HIVE_P2_temp3208_0 = this, __HIVE_P2_temp3208_1 = __HIVE_P2_get(__HIVE_P2_temp3208_0, "braceIsBlock", 3210), __HIVE_P2_invoke(__HIVE_P2_temp3208_1, __HIVE_P2_temp3208_0, (__HIVE_P2_reserveArray(1, 3210), __HIVE_P2_ownArray([e], 3210, "CONTROL_ARRAY")), 3210)) ? __HIVE_P2_get(oe, "b_stat", 3212) : __HIVE_P2_get(oe, "b_expr", 3213)], 3209, "CONTROL_ARRAY")), 3209));
        (__HIVE_P2_temp3208_4 = this, __HIVE_P2_temp3208_5 = "exprAllowed", __HIVE_P2_set(__HIVE_P2_temp3208_4, __HIVE_P2_temp3208_5, true, 3216));
    }, 7, 1, 0, 3208)), 3205));
    (__HIVE_P2_temp0_1226 = __HIVE_P2_get(m, "dollarBraceL", 3220), __HIVE_P2_temp0_1227 = "updateContext", __HIVE_P2_set(__HIVE_P2_temp0_1226, __HIVE_P2_temp0_1227, (__HIVE_P2_reserveFunction(3221), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp3221_0, __HIVE_P2_temp3221_1, __HIVE_P2_temp3221_2, __HIVE_P2_temp3221_3, __HIVE_P2_temp3221_4;
        (__HIVE_P2_temp3221_0 = __HIVE_P2_get(this, "context", 3225), __HIVE_P2_temp3221_1 = __HIVE_P2_get(__HIVE_P2_temp3221_0, "push", 3222), __HIVE_P2_invoke(__HIVE_P2_temp3221_1, __HIVE_P2_temp3221_0, (__HIVE_P2_reserveArray(1, 3222), __HIVE_P2_ownArray([__HIVE_P2_get(oe, "b_tmpl", 3223)], 3222, "CONTROL_ARRAY")), 3222));
        (__HIVE_P2_temp3221_2 = this, __HIVE_P2_temp3221_3 = "exprAllowed", __HIVE_P2_set(__HIVE_P2_temp3221_2, __HIVE_P2_temp3221_3, true, 3226));
    }, 5, 0, 0, 3221)), 3218));
    (__HIVE_P2_temp0_1229 = __HIVE_P2_get(m, "parenL", 3230), __HIVE_P2_temp0_1230 = "updateContext", __HIVE_P2_set(__HIVE_P2_temp0_1229, __HIVE_P2_temp0_1230, (__HIVE_P2_reserveFunction(3231), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp3231_0, __HIVE_P2_temp3231_1, __HIVE_P2_temp3231_2, __HIVE_P2_temp3231_3, __HIVE_P2_temp3231_4;
        var t = e === __HIVE_P2_get(m, "_if", 3232) || e === __HIVE_P2_get(m, "_for", 3233) || e === __HIVE_P2_get(m, "_with", 3234) || e === __HIVE_P2_get(m, "_while", 3235);
        (__HIVE_P2_temp3231_0 = __HIVE_P2_get(this, "context", 3240), __HIVE_P2_temp3231_1 = __HIVE_P2_get(__HIVE_P2_temp3231_0, "push", 3236), __HIVE_P2_invoke(__HIVE_P2_temp3231_1, __HIVE_P2_temp3231_0, (__HIVE_P2_reserveArray(1, 3236), __HIVE_P2_ownArray([t ? __HIVE_P2_get(oe, "p_stat", 3237) : __HIVE_P2_get(oe, "p_expr", 3238)], 3236, "CONTROL_ARRAY")), 3236));
        (__HIVE_P2_temp3231_2 = this, __HIVE_P2_temp3231_3 = "exprAllowed", __HIVE_P2_set(__HIVE_P2_temp3231_2, __HIVE_P2_temp3231_3, true, 3241));
    }, 6, 1, 0, 3231)), 3228));
    (__HIVE_P2_temp0_1232 = __HIVE_P2_get(m, "incDec", 3245), __HIVE_P2_temp0_1233 = "updateContext", __HIVE_P2_set(__HIVE_P2_temp0_1232, __HIVE_P2_temp0_1233, (__HIVE_P2_reserveFunction(3246), __HIVE_P2_registerFunction(function () {
    }, 0, 0, 0, 3246)), 3243));
    (__HIVE_P2_temp0_1235 = __HIVE_P2_get(m, "_function", 3249), __HIVE_P2_temp0_1236 = "updateContext", __HIVE_P2_set(__HIVE_P2_temp0_1235, __HIVE_P2_temp0_1236, (__HIVE_P2_temp0_1238 = __HIVE_P2_get(m, "_class", 3252), __HIVE_P2_temp0_1239 = "updateContext", __HIVE_P2_set(__HIVE_P2_temp0_1238, __HIVE_P2_temp0_1239, (__HIVE_P2_reserveFunction(3253), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp3253_0, __HIVE_P2_temp3253_1, __HIVE_P2_temp3253_2, __HIVE_P2_temp3253_3, __HIVE_P2_temp3253_4, __HIVE_P2_temp3253_5, __HIVE_P2_temp3253_6, __HIVE_P2_temp3253_7, __HIVE_P2_temp3253_8, __HIVE_P2_temp3253_9, __HIVE_P2_temp3253_10, __HIVE_P2_temp3253_11, __HIVE_P2_temp3253_12, __HIVE_P2_temp3253_13, __HIVE_P2_temp3253_14;
        if (__HIVE_P2_get(e, "beforeExpr", 3254) && e !== __HIVE_P2_get(m, "_else", 3255) && !(e === __HIVE_P2_get(m, "semi", 3256) && (__HIVE_P2_temp3253_0 = this, __HIVE_P2_temp3253_1 = __HIVE_P2_get(__HIVE_P2_temp3253_0, "curContext", 3257), __HIVE_P2_invoke(__HIVE_P2_temp3253_1, __HIVE_P2_temp3253_0, (__HIVE_P2_reserveArray(0, 3257), __HIVE_P2_ownArray([], 3257, "CONTROL_ARRAY")), 3257)) !== __HIVE_P2_get(oe, "p_stat", 3259)) && !(e === __HIVE_P2_get(m, "_return", 3260) && (__HIVE_P2_temp3253_4 = g, __HIVE_P2_temp3253_5 = __HIVE_P2_get(__HIVE_P2_temp3253_4, "test", 3261), __HIVE_P2_invoke(__HIVE_P2_temp3253_5, __HIVE_P2_temp3253_4, (__HIVE_P2_reserveArray(1, 3261), __HIVE_P2_ownArray([(__HIVE_P2_temp3253_2 = __HIVE_P2_get(this, "input", 3266), __HIVE_P2_temp3253_3 = __HIVE_P2_get(__HIVE_P2_temp3253_2, "slice", 3262), __HIVE_P2_invoke(__HIVE_P2_temp3253_3, __HIVE_P2_temp3253_2, (__HIVE_P2_reserveArray(2, 3262), __HIVE_P2_ownArray([__HIVE_P2_get(this, "lastTokEnd", 3263), __HIVE_P2_get(this, "start", 3264)], 3262, "CONTROL_ARRAY")), 3262))], 3261, "CONTROL_ARRAY")), 3261))) && !((e === __HIVE_P2_get(m, "colon", 3268) || e === __HIVE_P2_get(m, "braceL", 3269)) && (__HIVE_P2_temp3253_6 = this, __HIVE_P2_temp3253_7 = __HIVE_P2_get(__HIVE_P2_temp3253_6, "curContext", 3270), __HIVE_P2_invoke(__HIVE_P2_temp3253_7, __HIVE_P2_temp3253_6, (__HIVE_P2_reserveArray(0, 3270), __HIVE_P2_ownArray([], 3270, "CONTROL_ARRAY")), 3270)) === __HIVE_P2_get(oe, "b_stat", 3272))) {
            (__HIVE_P2_temp3253_8 = __HIVE_P2_get(this, "context", 3276), __HIVE_P2_temp3253_9 = __HIVE_P2_get(__HIVE_P2_temp3253_8, "push", 3273), __HIVE_P2_invoke(__HIVE_P2_temp3253_9, __HIVE_P2_temp3253_8, (__HIVE_P2_reserveArray(1, 3273), __HIVE_P2_ownArray([__HIVE_P2_get(oe, "f_expr", 3274)], 3273, "CONTROL_ARRAY")), 3273));
        }
        else {
            (__HIVE_P2_temp3253_10 = __HIVE_P2_get(this, "context", 3280), __HIVE_P2_temp3253_11 = __HIVE_P2_get(__HIVE_P2_temp3253_10, "push", 3277), __HIVE_P2_invoke(__HIVE_P2_temp3253_11, __HIVE_P2_temp3253_10, (__HIVE_P2_reserveArray(1, 3277), __HIVE_P2_ownArray([__HIVE_P2_get(oe, "f_stat", 3278)], 3277, "CONTROL_ARRAY")), 3277));
        }
        (__HIVE_P2_temp3253_12 = this, __HIVE_P2_temp3253_13 = "exprAllowed", __HIVE_P2_set(__HIVE_P2_temp3253_12, __HIVE_P2_temp3253_13, false, 3281));
    }, 15, 1, 0, 3253)), 3250)), 3247));
    (__HIVE_P2_temp0_1241 = __HIVE_P2_get(m, "colon", 3285), __HIVE_P2_temp0_1242 = "updateContext", __HIVE_P2_set(__HIVE_P2_temp0_1241, __HIVE_P2_temp0_1242, (__HIVE_P2_reserveFunction(3286), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp3286_0, __HIVE_P2_temp3286_1, __HIVE_P2_temp3286_2, __HIVE_P2_temp3286_3, __HIVE_P2_temp3286_4, __HIVE_P2_temp3286_5, __HIVE_P2_temp3286_6;
        if (__HIVE_P2_get((__HIVE_P2_temp3286_0 = this, __HIVE_P2_temp3286_1 = __HIVE_P2_get(__HIVE_P2_temp3286_0, "curContext", 3288), __HIVE_P2_invoke(__HIVE_P2_temp3286_1, __HIVE_P2_temp3286_0, (__HIVE_P2_reserveArray(0, 3288), __HIVE_P2_ownArray([], 3288, "CONTROL_ARRAY")), 3288)), "token", 3287) === "function") {
            (__HIVE_P2_temp3286_2 = __HIVE_P2_get(this, "context", 3292), __HIVE_P2_temp3286_3 = __HIVE_P2_get(__HIVE_P2_temp3286_2, "pop", 3290), __HIVE_P2_invoke(__HIVE_P2_temp3286_3, __HIVE_P2_temp3286_2, (__HIVE_P2_reserveArray(0, 3290), __HIVE_P2_ownArray([], 3290, "CONTROL_ARRAY")), 3290));
        }
        (__HIVE_P2_temp3286_4 = this, __HIVE_P2_temp3286_5 = "exprAllowed", __HIVE_P2_set(__HIVE_P2_temp3286_4, __HIVE_P2_temp3286_5, true, 3293));
    }, 7, 0, 0, 3286)), 3283));
    (__HIVE_P2_temp0_1244 = __HIVE_P2_get(m, "backQuote", 3297), __HIVE_P2_temp0_1245 = "updateContext", __HIVE_P2_set(__HIVE_P2_temp0_1244, __HIVE_P2_temp0_1245, (__HIVE_P2_reserveFunction(3298), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp3298_0, __HIVE_P2_temp3298_1, __HIVE_P2_temp3298_2, __HIVE_P2_temp3298_3, __HIVE_P2_temp3298_4, __HIVE_P2_temp3298_5, __HIVE_P2_temp3298_6, __HIVE_P2_temp3298_7, __HIVE_P2_temp3298_8;
        if ((__HIVE_P2_temp3298_0 = this, __HIVE_P2_temp3298_1 = __HIVE_P2_get(__HIVE_P2_temp3298_0, "curContext", 3299), __HIVE_P2_invoke(__HIVE_P2_temp3298_1, __HIVE_P2_temp3298_0, (__HIVE_P2_reserveArray(0, 3299), __HIVE_P2_ownArray([], 3299, "CONTROL_ARRAY")), 3299)) === __HIVE_P2_get(oe, "q_tmpl", 3301)) {
            (__HIVE_P2_temp3298_2 = __HIVE_P2_get(this, "context", 3304), __HIVE_P2_temp3298_3 = __HIVE_P2_get(__HIVE_P2_temp3298_2, "pop", 3302), __HIVE_P2_invoke(__HIVE_P2_temp3298_3, __HIVE_P2_temp3298_2, (__HIVE_P2_reserveArray(0, 3302), __HIVE_P2_ownArray([], 3302, "CONTROL_ARRAY")), 3302));
        }
        else {
            (__HIVE_P2_temp3298_4 = __HIVE_P2_get(this, "context", 3308), __HIVE_P2_temp3298_5 = __HIVE_P2_get(__HIVE_P2_temp3298_4, "push", 3305), __HIVE_P2_invoke(__HIVE_P2_temp3298_5, __HIVE_P2_temp3298_4, (__HIVE_P2_reserveArray(1, 3305), __HIVE_P2_ownArray([__HIVE_P2_get(oe, "q_tmpl", 3306)], 3305, "CONTROL_ARRAY")), 3305));
        }
        (__HIVE_P2_temp3298_6 = this, __HIVE_P2_temp3298_7 = "exprAllowed", __HIVE_P2_set(__HIVE_P2_temp3298_6, __HIVE_P2_temp3298_7, false, 3309));
    }, 9, 0, 0, 3298)), 3295));
    (__HIVE_P2_temp0_1247 = __HIVE_P2_get(m, "star", 3313), __HIVE_P2_temp0_1248 = "updateContext", __HIVE_P2_set(__HIVE_P2_temp0_1247, __HIVE_P2_temp0_1248, (__HIVE_P2_reserveFunction(3314), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp3314_0, __HIVE_P2_temp3314_1, __HIVE_P2_temp3314_2, __HIVE_P2_temp3314_3, __HIVE_P2_temp3314_4, __HIVE_P2_temp3314_5, __HIVE_P2_temp3314_6, __HIVE_P2_temp3314_7, __HIVE_P2_temp3314_8;
        if (e === __HIVE_P2_get(m, "_function", 3315)) {
            var t = __HIVE_P2_binary("-", __HIVE_P2_get(__HIVE_P2_get(this, "context", 3318), "length", 3317), 1, 3316);
            if (__HIVE_P2_get(__HIVE_P2_get(this, "context", 3320), t, 3319) === __HIVE_P2_get(oe, "f_expr", 3321)) {
                (__HIVE_P2_temp3314_0 = __HIVE_P2_get(this, "context", 3324), __HIVE_P2_temp3314_1 = t, __HIVE_P2_set(__HIVE_P2_temp3314_0, __HIVE_P2_temp3314_1, __HIVE_P2_get(oe, "f_expr_gen", 3325), 3322));
            }
            else {
                (__HIVE_P2_temp3314_3 = __HIVE_P2_get(this, "context", 3328), __HIVE_P2_temp3314_4 = t, __HIVE_P2_set(__HIVE_P2_temp3314_3, __HIVE_P2_temp3314_4, __HIVE_P2_get(oe, "f_gen", 3329), 3326));
            }
        }
        (__HIVE_P2_temp3314_6 = this, __HIVE_P2_temp3314_7 = "exprAllowed", __HIVE_P2_set(__HIVE_P2_temp3314_6, __HIVE_P2_temp3314_7, true, 3330));
    }, 10, 1, 0, 3314)), 3311));
    (__HIVE_P2_temp0_1250 = __HIVE_P2_get(m, "name", 3334), __HIVE_P2_temp0_1251 = "updateContext", __HIVE_P2_set(__HIVE_P2_temp0_1250, __HIVE_P2_temp0_1251, (__HIVE_P2_reserveFunction(3335), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp3335_0, __HIVE_P2_temp3335_1, __HIVE_P2_temp3335_2, __HIVE_P2_temp3335_3, __HIVE_P2_temp3335_4;
        var t = false;
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 3338), "ecmaVersion", 3337), 6, 3336) && e !== __HIVE_P2_get(m, "dot", 3339)) {
            if (__HIVE_P2_get(this, "value", 3340) === "of" && !__HIVE_P2_get(this, "exprAllowed", 3341) || __HIVE_P2_get(this, "value", 3342) === "yield" && (__HIVE_P2_temp3335_0 = this, __HIVE_P2_temp3335_1 = __HIVE_P2_get(__HIVE_P2_temp3335_0, "inGeneratorContext", 3343), __HIVE_P2_invoke(__HIVE_P2_temp3335_1, __HIVE_P2_temp3335_0, (__HIVE_P2_reserveArray(0, 3343), __HIVE_P2_ownArray([], 3343, "CONTROL_ARRAY")), 3343))) {
                t = true;
            }
        }
        (__HIVE_P2_temp3335_2 = this, __HIVE_P2_temp3335_3 = "exprAllowed", __HIVE_P2_set(__HIVE_P2_temp3335_2, __HIVE_P2_temp3335_3, t, 3346));
    }, 6, 1, 0, 3335)), 3332));
    var pe = __HIVE_P2_get(K, "prototype", 3348);
    (__HIVE_P2_temp0_1253 = pe, __HIVE_P2_temp0_1254 = "checkPropClash", __HIVE_P2_set(__HIVE_P2_temp0_1253, __HIVE_P2_temp0_1254, (__HIVE_P2_reserveFunction(3351), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp3351_0, __HIVE_P2_temp3351_1, __HIVE_P2_temp3351_2, __HIVE_P2_temp3351_3, __HIVE_P2_temp3351_4, __HIVE_P2_temp3351_5, __HIVE_P2_temp3351_6, __HIVE_P2_temp3351_7, __HIVE_P2_temp3351_8, __HIVE_P2_temp3351_9, __HIVE_P2_temp3351_10, __HIVE_P2_temp3351_11;
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 3354), "ecmaVersion", 3353), 9, 3352) && __HIVE_P2_get(e, "type", 3355) === "SpreadElement") {
            return;
        }
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 3358), "ecmaVersion", 3357), 6, 3356) && (__HIVE_P2_get(e, "computed", 3359) || __HIVE_P2_get(e, "method", 3360) || __HIVE_P2_get(e, "shorthand", 3361))) {
            return;
        }
        var s = __HIVE_P2_get(e, "key", 3362);
        var r;
        switch (__HIVE_P2_get(s, "type", 3363)) {
            case "Identifier":
                r = __HIVE_P2_get(s, "name", 3365);
                break;
            case "Literal":
                r = __HIVE_P2_invoke(__HIVE_P2_String, void 0, (__HIVE_P2_reserveArray(1, 3367), __HIVE_P2_ownArray([__HIVE_P2_get(s, "value", 3368)], 3367, "CONTROL_ARRAY")), 3367);
                break;
            default: return;
        }
        var a = __HIVE_P2_get(e, "kind", 3369);
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 3372), "ecmaVersion", 3371), 6, 3370)) {
            if (r === "__proto__" && a === "init") {
                if (__HIVE_P2_get(t, "proto", 3373)) {
                    if (i) {
                        if (__HIVE_P2_binary("<", __HIVE_P2_get(i, "doubleProto", 3375), 0, 3374)) {
                            (__HIVE_P2_temp3351_0 = i, __HIVE_P2_temp3351_1 = "doubleProto", __HIVE_P2_set(__HIVE_P2_temp3351_0, __HIVE_P2_temp3351_1, __HIVE_P2_get(s, "start", 3378), 3376));
                        }
                    }
                    else {
                        __HIVE_P2_syntaxRefusal(3379);
                    }
                }
                (__HIVE_P2_temp3351_3 = t, __HIVE_P2_temp3351_4 = "proto", __HIVE_P2_set(__HIVE_P2_temp3351_3, __HIVE_P2_temp3351_4, true, 3380));
            }
            return;
        }
        r = __HIVE_P2_binary("+", "$", r, 3383);
        var n = __HIVE_P2_get(t, r, 3384);
        if (n) {
            var o;
            if (a === "init") {
                o = __HIVE_P2_get(this, "strict", 3386) && __HIVE_P2_get(n, "init", 3387) || __HIVE_P2_get(n, "get", 3388) || __HIVE_P2_get(n, "set", 3389);
            }
            else {
                o = __HIVE_P2_get(n, "init", 3391) || __HIVE_P2_get(n, a, 3392);
            }
            if (o) {
                __HIVE_P2_syntaxRefusal(3393);
            }
        }
        else {
            n = (__HIVE_P2_temp3351_6 = t, __HIVE_P2_temp3351_7 = r, __HIVE_P2_set(__HIVE_P2_temp3351_6, __HIVE_P2_temp3351_7, (__HIVE_P2_reserveObject(3, 3397), __HIVE_P2_ownObject({ init: false, get: false, set: false }, 3397, 3, 10)), 3395));
        }
        (__HIVE_P2_temp3351_9 = n, __HIVE_P2_temp3351_10 = a, __HIVE_P2_set(__HIVE_P2_temp3351_9, __HIVE_P2_temp3351_10, true, 3398));
    }, 17, 3, 0, 3351)), 3349));
    (__HIVE_P2_temp0_1256 = pe, __HIVE_P2_temp0_1257 = "parseExpression", __HIVE_P2_set(__HIVE_P2_temp0_1256, __HIVE_P2_temp0_1257, (__HIVE_P2_reserveFunction(3402), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp3402_0, __HIVE_P2_temp3402_1, __HIVE_P2_temp3402_2, __HIVE_P2_temp3402_3, __HIVE_P2_temp3402_4, __HIVE_P2_temp3402_5, __HIVE_P2_temp3402_6, __HIVE_P2_temp3402_7, __HIVE_P2_temp3402_8, __HIVE_P2_temp3402_9, __HIVE_P2_temp3402_10, __HIVE_P2_temp3402_11, __HIVE_P2_temp3402_12, __HIVE_P2_temp3402_13, __HIVE_P2_temp3402_14, __HIVE_P2_temp3402_15, __HIVE_P2_temp3402_16;
        var i = __HIVE_P2_get(this, "start", 3403), s = __HIVE_P2_get(this, "startLoc", 3404);
        var r = (__HIVE_P2_temp3402_0 = this, __HIVE_P2_temp3402_1 = __HIVE_P2_get(__HIVE_P2_temp3402_0, "parseMaybeAssign", 3405), __HIVE_P2_invoke(__HIVE_P2_temp3402_1, __HIVE_P2_temp3402_0, (__HIVE_P2_reserveArray(2, 3405), __HIVE_P2_ownArray([e, t], 3405, "CONTROL_ARRAY")), 3405));
        if (__HIVE_P2_get(this, "type", 3407) === __HIVE_P2_get(m, "comma", 3408)) {
            var a = (__HIVE_P2_temp3402_2 = this, __HIVE_P2_temp3402_3 = __HIVE_P2_get(__HIVE_P2_temp3402_2, "startNodeAt", 3409), __HIVE_P2_invoke(__HIVE_P2_temp3402_3, __HIVE_P2_temp3402_2, (__HIVE_P2_reserveArray(2, 3409), __HIVE_P2_ownArray([i, s], 3409, "CONTROL_ARRAY")), 3409));
            (__HIVE_P2_temp3402_4 = a, __HIVE_P2_temp3402_5 = "expressions", __HIVE_P2_set(__HIVE_P2_temp3402_4, __HIVE_P2_temp3402_5, (__HIVE_P2_temp3402_7 = 0, __HIVE_P2_temp3402_8 = r, __HIVE_P2_temp3402_7 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp3402_7, __HIVE_P2_temp3402_8, 3413), __HIVE_P2_checkArrayDepth(__HIVE_P2_temp3402_7, 3413), __HIVE_P2_reserveArray(1, 3413, 1), __HIVE_P2_ownArray([__HIVE_P2_temp3402_8], 3413, "ARRAY", __HIVE_P2_temp3402_7)), 3411));
            while ((__HIVE_P2_temp3402_9 = this, __HIVE_P2_temp3402_10 = __HIVE_P2_get(__HIVE_P2_temp3402_9, "eat", 3415), __HIVE_P2_invoke(__HIVE_P2_temp3402_10, __HIVE_P2_temp3402_9, (__HIVE_P2_reserveArray(1, 3415), __HIVE_P2_ownArray([__HIVE_P2_get(m, "comma", 3416)], 3415, "CONTROL_ARRAY")), 3415))) {
                __HIVE_P2_tick(3414);
                (__HIVE_P2_temp3402_13 = __HIVE_P2_get(a, "expressions", 3422), __HIVE_P2_temp3402_14 = __HIVE_P2_get(__HIVE_P2_temp3402_13, "push", 3418), __HIVE_P2_invoke(__HIVE_P2_temp3402_14, __HIVE_P2_temp3402_13, (__HIVE_P2_reserveArray(1, 3418), __HIVE_P2_ownArray([(__HIVE_P2_temp3402_11 = this, __HIVE_P2_temp3402_12 = __HIVE_P2_get(__HIVE_P2_temp3402_11, "parseMaybeAssign", 3419), __HIVE_P2_invoke(__HIVE_P2_temp3402_12, __HIVE_P2_temp3402_11, (__HIVE_P2_reserveArray(2, 3419), __HIVE_P2_ownArray([e, t], 3419, "CONTROL_ARRAY")), 3419))], 3418, "CONTROL_ARRAY")), 3418));
            }
            return (__HIVE_P2_temp3402_15 = this, __HIVE_P2_temp3402_16 = __HIVE_P2_get(__HIVE_P2_temp3402_15, "finishNode", 3423), __HIVE_P2_invoke(__HIVE_P2_temp3402_16, __HIVE_P2_temp3402_15, (__HIVE_P2_reserveArray(2, 3423), __HIVE_P2_ownArray([a, "SequenceExpression"], 3423, "CONTROL_ARRAY")), 3423));
        }
        return r;
    }, 21, 2, 0, 3402)), 3400));
    (__HIVE_P2_temp0_1259 = pe, __HIVE_P2_temp0_1260 = "parseMaybeAssign", __HIVE_P2_set(__HIVE_P2_temp0_1259, __HIVE_P2_temp0_1260, (__HIVE_P2_reserveFunction(3427), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp3427_0, __HIVE_P2_temp3427_1, __HIVE_P2_temp3427_2, __HIVE_P2_temp3427_3, __HIVE_P2_temp3427_4, __HIVE_P2_temp3427_5, __HIVE_P2_temp3427_6, __HIVE_P2_temp3427_7, __HIVE_P2_temp3427_8, __HIVE_P2_temp3427_9, __HIVE_P2_temp3427_10, __HIVE_P2_temp3427_11, __HIVE_P2_temp3427_12, __HIVE_P2_temp3427_13, __HIVE_P2_temp3427_14, __HIVE_P2_temp3427_15, __HIVE_P2_temp3427_16, __HIVE_P2_temp3427_17, __HIVE_P2_temp3427_18, __HIVE_P2_temp3427_19, __HIVE_P2_temp3427_20, __HIVE_P2_temp3427_21, __HIVE_P2_temp3427_22, __HIVE_P2_temp3427_23, __HIVE_P2_temp3427_24, __HIVE_P2_temp3427_25, __HIVE_P2_temp3427_26, __HIVE_P2_temp3427_27, __HIVE_P2_temp3427_28, __HIVE_P2_temp3427_29, __HIVE_P2_temp3427_30, __HIVE_P2_temp3427_31, __HIVE_P2_temp3427_32, __HIVE_P2_temp3427_33, __HIVE_P2_temp3427_34, __HIVE_P2_temp3427_35, __HIVE_P2_temp3427_36, __HIVE_P2_temp3427_37, __HIVE_P2_temp3427_38, __HIVE_P2_temp3427_39, __HIVE_P2_temp3427_40, __HIVE_P2_temp3427_41, __HIVE_P2_temp3427_42, __HIVE_P2_temp3427_43, __HIVE_P2_temp3427_44, __HIVE_P2_temp3427_45, __HIVE_P2_temp3427_46, __HIVE_P2_temp3427_47, __HIVE_P2_temp3427_48, __HIVE_P2_temp3427_49, __HIVE_P2_temp3427_50, __HIVE_P2_temp3427_51, __HIVE_P2_temp3427_52, __HIVE_P2_temp3427_53, __HIVE_P2_temp3427_54, __HIVE_P2_temp3427_55, __HIVE_P2_temp3427_56, __HIVE_P2_temp3427_57, __HIVE_P2_temp3427_58, __HIVE_P2_temp3427_59, __HIVE_P2_temp3427_60, __HIVE_P2_temp3427_61, __HIVE_P2_temp3427_62, __HIVE_P2_temp3427_63, __HIVE_P2_temp3427_64, __HIVE_P2_temp3427_65, __HIVE_P2_temp3427_66, __HIVE_P2_temp3427_67, __HIVE_P2_temp3427_68;
        if ((__HIVE_P2_temp3427_0 = this, __HIVE_P2_temp3427_1 = __HIVE_P2_get(__HIVE_P2_temp3427_0, "isContextual", 3428), __HIVE_P2_invoke(__HIVE_P2_temp3427_1, __HIVE_P2_temp3427_0, (__HIVE_P2_reserveArray(1, 3428), __HIVE_P2_ownArray(["yield"], 3428, "CONTROL_ARRAY")), 3428))) {
            if (__HIVE_P2_get(this, "inGenerator", 3430)) {
                return (__HIVE_P2_temp3427_2 = this, __HIVE_P2_temp3427_3 = __HIVE_P2_get(__HIVE_P2_temp3427_2, "parseYield", 3431), __HIVE_P2_invoke(__HIVE_P2_temp3427_3, __HIVE_P2_temp3427_2, (__HIVE_P2_reserveArray(1, 3431), __HIVE_P2_ownArray([e], 3431, "CONTROL_ARRAY")), 3431));
            }
            else {
                (__HIVE_P2_temp3427_4 = this, __HIVE_P2_temp3427_5 = "exprAllowed", __HIVE_P2_set(__HIVE_P2_temp3427_4, __HIVE_P2_temp3427_5, false, 3433));
            }
        }
        var s = false, r = __HIVE_P2_unary("-", 1, 3435), a = __HIVE_P2_unary("-", 1, 3436), n = __HIVE_P2_unary("-", 1, 3437);
        if (t) {
            r = __HIVE_P2_get(t, "parenthesizedAssign", 3439);
            a = __HIVE_P2_get(t, "trailingComma", 3441);
            n = __HIVE_P2_get(t, "doubleProto", 3443);
            (__HIVE_P2_temp3427_7 = t, __HIVE_P2_temp3427_8 = "parenthesizedAssign", __HIVE_P2_set(__HIVE_P2_temp3427_7, __HIVE_P2_temp3427_8, (__HIVE_P2_temp3427_10 = t, __HIVE_P2_temp3427_11 = "trailingComma", __HIVE_P2_set(__HIVE_P2_temp3427_10, __HIVE_P2_temp3427_11, __HIVE_P2_unary("-", 1, 3448), 3446)), 3444));
        }
        else {
            t = __HIVE_P2_construct(Z, (__HIVE_P2_reserveArray(0, 3450), __HIVE_P2_ownArray([], 3450, "CONTROL_ARRAY")), 3450);
            s = true;
        }
        var o = __HIVE_P2_get(this, "start", 3452), h = __HIVE_P2_get(this, "startLoc", 3453);
        if (__HIVE_P2_get(this, "type", 3454) === __HIVE_P2_get(m, "parenL", 3455) || __HIVE_P2_get(this, "type", 3456) === __HIVE_P2_get(m, "name", 3457)) {
            (__HIVE_P2_temp3427_13 = this, __HIVE_P2_temp3427_14 = "potentialArrowAt", __HIVE_P2_set(__HIVE_P2_temp3427_13, __HIVE_P2_temp3427_14, __HIVE_P2_get(this, "start", 3460), 3458));
            (__HIVE_P2_temp3427_16 = this, __HIVE_P2_temp3427_17 = "potentialArrowInForAwait", __HIVE_P2_set(__HIVE_P2_temp3427_16, __HIVE_P2_temp3427_17, e === "await", 3461));
        }
        var p = (__HIVE_P2_temp3427_19 = this, __HIVE_P2_temp3427_20 = __HIVE_P2_get(__HIVE_P2_temp3427_19, "parseMaybeConditional", 3463), __HIVE_P2_invoke(__HIVE_P2_temp3427_20, __HIVE_P2_temp3427_19, (__HIVE_P2_reserveArray(2, 3463), __HIVE_P2_ownArray([e, t], 3463, "CONTROL_ARRAY")), 3463));
        if (i) {
            p = (__HIVE_P2_temp3427_21 = i, __HIVE_P2_temp3427_22 = __HIVE_P2_get(__HIVE_P2_temp3427_21, "call", 3466), __HIVE_P2_invoke(__HIVE_P2_temp3427_22, __HIVE_P2_temp3427_21, (__HIVE_P2_reserveArray(4, 3466), __HIVE_P2_ownArray([this, p, o, h], 3466, "CONTROL_ARRAY")), 3466));
        }
        if (__HIVE_P2_get(__HIVE_P2_get(this, "type", 3469), "isAssign", 3468)) {
            var c = (__HIVE_P2_temp3427_23 = this, __HIVE_P2_temp3427_24 = __HIVE_P2_get(__HIVE_P2_temp3427_23, "startNodeAt", 3470), __HIVE_P2_invoke(__HIVE_P2_temp3427_24, __HIVE_P2_temp3427_23, (__HIVE_P2_reserveArray(2, 3470), __HIVE_P2_ownArray([o, h], 3470, "CONTROL_ARRAY")), 3470));
            (__HIVE_P2_temp3427_25 = c, __HIVE_P2_temp3427_26 = "operator", __HIVE_P2_set(__HIVE_P2_temp3427_25, __HIVE_P2_temp3427_26, __HIVE_P2_get(this, "value", 3474), 3472));
            if (__HIVE_P2_get(this, "type", 3475) === __HIVE_P2_get(m, "eq", 3476)) {
                p = (__HIVE_P2_temp3427_28 = this, __HIVE_P2_temp3427_29 = __HIVE_P2_get(__HIVE_P2_temp3427_28, "toAssignable", 3478), __HIVE_P2_invoke(__HIVE_P2_temp3427_29, __HIVE_P2_temp3427_28, (__HIVE_P2_reserveArray(3, 3478), __HIVE_P2_ownArray([p, false, t], 3478, "CONTROL_ARRAY")), 3478));
            }
            if (!s) {
                (__HIVE_P2_temp3427_30 = t, __HIVE_P2_temp3427_31 = "parenthesizedAssign", __HIVE_P2_set(__HIVE_P2_temp3427_30, __HIVE_P2_temp3427_31, (__HIVE_P2_temp3427_33 = t, __HIVE_P2_temp3427_34 = "trailingComma", __HIVE_P2_set(__HIVE_P2_temp3427_33, __HIVE_P2_temp3427_34, (__HIVE_P2_temp3427_36 = t, __HIVE_P2_temp3427_37 = "doubleProto", __HIVE_P2_set(__HIVE_P2_temp3427_36, __HIVE_P2_temp3427_37, __HIVE_P2_unary("-", 1, 3486), 3484)), 3482)), 3480));
            }
            if (__HIVE_P2_binary(">=", __HIVE_P2_get(t, "shorthandAssign", 3488), __HIVE_P2_get(p, "start", 3489), 3487)) {
                (__HIVE_P2_temp3427_39 = t, __HIVE_P2_temp3427_40 = "shorthandAssign", __HIVE_P2_set(__HIVE_P2_temp3427_39, __HIVE_P2_temp3427_40, __HIVE_P2_unary("-", 1, 3492), 3490));
            }
            if (__HIVE_P2_get(this, "type", 3493) === __HIVE_P2_get(m, "eq", 3494)) {
                (__HIVE_P2_temp3427_42 = this, __HIVE_P2_temp3427_43 = __HIVE_P2_get(__HIVE_P2_temp3427_42, "checkLValPattern", 3495), __HIVE_P2_invoke(__HIVE_P2_temp3427_43, __HIVE_P2_temp3427_42, (__HIVE_P2_reserveArray(1, 3495), __HIVE_P2_ownArray([p], 3495, "CONTROL_ARRAY")), 3495));
            }
            else {
                (__HIVE_P2_temp3427_44 = this, __HIVE_P2_temp3427_45 = __HIVE_P2_get(__HIVE_P2_temp3427_44, "checkLValSimple", 3497), __HIVE_P2_invoke(__HIVE_P2_temp3427_45, __HIVE_P2_temp3427_44, (__HIVE_P2_reserveArray(1, 3497), __HIVE_P2_ownArray([p], 3497, "CONTROL_ARRAY")), 3497));
            }
            (__HIVE_P2_temp3427_46 = c, __HIVE_P2_temp3427_47 = "left", __HIVE_P2_set(__HIVE_P2_temp3427_46, __HIVE_P2_temp3427_47, p, 3499));
            (__HIVE_P2_temp3427_49 = this, __HIVE_P2_temp3427_50 = __HIVE_P2_get(__HIVE_P2_temp3427_49, "next", 3501), __HIVE_P2_invoke(__HIVE_P2_temp3427_50, __HIVE_P2_temp3427_49, (__HIVE_P2_reserveArray(0, 3501), __HIVE_P2_ownArray([], 3501, "CONTROL_ARRAY")), 3501));
            (__HIVE_P2_temp3427_51 = c, __HIVE_P2_temp3427_52 = "right", __HIVE_P2_set(__HIVE_P2_temp3427_51, __HIVE_P2_temp3427_52, (__HIVE_P2_temp3427_54 = this, __HIVE_P2_temp3427_55 = __HIVE_P2_get(__HIVE_P2_temp3427_54, "parseMaybeAssign", 3505), __HIVE_P2_invoke(__HIVE_P2_temp3427_55, __HIVE_P2_temp3427_54, (__HIVE_P2_reserveArray(1, 3505), __HIVE_P2_ownArray([e], 3505, "CONTROL_ARRAY")), 3505)), 3503));
            if (__HIVE_P2_binary(">", n, __HIVE_P2_unary("-", 1, 3508), 3507)) {
                (__HIVE_P2_temp3427_56 = t, __HIVE_P2_temp3427_57 = "doubleProto", __HIVE_P2_set(__HIVE_P2_temp3427_56, __HIVE_P2_temp3427_57, n, 3509));
            }
            return (__HIVE_P2_temp3427_59 = this, __HIVE_P2_temp3427_60 = __HIVE_P2_get(__HIVE_P2_temp3427_59, "finishNode", 3511), __HIVE_P2_invoke(__HIVE_P2_temp3427_60, __HIVE_P2_temp3427_59, (__HIVE_P2_reserveArray(2, 3511), __HIVE_P2_ownArray([c, "AssignmentExpression"], 3511, "CONTROL_ARRAY")), 3511));
        }
        else {
            if (s) {
                (__HIVE_P2_temp3427_61 = this, __HIVE_P2_temp3427_62 = __HIVE_P2_get(__HIVE_P2_temp3427_61, "checkExpressionErrors", 3513), __HIVE_P2_invoke(__HIVE_P2_temp3427_62, __HIVE_P2_temp3427_61, (__HIVE_P2_reserveArray(2, 3513), __HIVE_P2_ownArray([t, true], 3513, "CONTROL_ARRAY")), 3513));
            }
        }
        if (__HIVE_P2_binary(">", r, __HIVE_P2_unary("-", 1, 3516), 3515)) {
            (__HIVE_P2_temp3427_63 = t, __HIVE_P2_temp3427_64 = "parenthesizedAssign", __HIVE_P2_set(__HIVE_P2_temp3427_63, __HIVE_P2_temp3427_64, r, 3517));
        }
        if (__HIVE_P2_binary(">", a, __HIVE_P2_unary("-", 1, 3520), 3519)) {
            (__HIVE_P2_temp3427_66 = t, __HIVE_P2_temp3427_67 = "trailingComma", __HIVE_P2_set(__HIVE_P2_temp3427_66, __HIVE_P2_temp3427_67, a, 3521));
        }
        return p;
    }, 77, 3, 0, 3427)), 3425));
    (__HIVE_P2_temp0_1262 = pe, __HIVE_P2_temp0_1263 = "parseMaybeConditional", __HIVE_P2_set(__HIVE_P2_temp0_1262, __HIVE_P2_temp0_1263, (__HIVE_P2_reserveFunction(3525), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp3525_0, __HIVE_P2_temp3525_1, __HIVE_P2_temp3525_2, __HIVE_P2_temp3525_3, __HIVE_P2_temp3525_4, __HIVE_P2_temp3525_5, __HIVE_P2_temp3525_6, __HIVE_P2_temp3525_7, __HIVE_P2_temp3525_8, __HIVE_P2_temp3525_9, __HIVE_P2_temp3525_10, __HIVE_P2_temp3525_11, __HIVE_P2_temp3525_12, __HIVE_P2_temp3525_13, __HIVE_P2_temp3525_14, __HIVE_P2_temp3525_15, __HIVE_P2_temp3525_16, __HIVE_P2_temp3525_17, __HIVE_P2_temp3525_18, __HIVE_P2_temp3525_19, __HIVE_P2_temp3525_20, __HIVE_P2_temp3525_21, __HIVE_P2_temp3525_22, __HIVE_P2_temp3525_23, __HIVE_P2_temp3525_24;
        var i = __HIVE_P2_get(this, "start", 3526), s = __HIVE_P2_get(this, "startLoc", 3527);
        var r = (__HIVE_P2_temp3525_0 = this, __HIVE_P2_temp3525_1 = __HIVE_P2_get(__HIVE_P2_temp3525_0, "parseExprOps", 3528), __HIVE_P2_invoke(__HIVE_P2_temp3525_1, __HIVE_P2_temp3525_0, (__HIVE_P2_reserveArray(2, 3528), __HIVE_P2_ownArray([e, t], 3528, "CONTROL_ARRAY")), 3528));
        if ((__HIVE_P2_temp3525_2 = this, __HIVE_P2_temp3525_3 = __HIVE_P2_get(__HIVE_P2_temp3525_2, "checkExpressionErrors", 3530), __HIVE_P2_invoke(__HIVE_P2_temp3525_3, __HIVE_P2_temp3525_2, (__HIVE_P2_reserveArray(1, 3530), __HIVE_P2_ownArray([t], 3530, "CONTROL_ARRAY")), 3530))) {
            return r;
        }
        if ((__HIVE_P2_temp3525_4 = this, __HIVE_P2_temp3525_5 = __HIVE_P2_get(__HIVE_P2_temp3525_4, "eat", 3532), __HIVE_P2_invoke(__HIVE_P2_temp3525_5, __HIVE_P2_temp3525_4, (__HIVE_P2_reserveArray(1, 3532), __HIVE_P2_ownArray([__HIVE_P2_get(m, "question", 3533)], 3532, "CONTROL_ARRAY")), 3532))) {
            var a = (__HIVE_P2_temp3525_6 = this, __HIVE_P2_temp3525_7 = __HIVE_P2_get(__HIVE_P2_temp3525_6, "startNodeAt", 3535), __HIVE_P2_invoke(__HIVE_P2_temp3525_7, __HIVE_P2_temp3525_6, (__HIVE_P2_reserveArray(2, 3535), __HIVE_P2_ownArray([i, s], 3535, "CONTROL_ARRAY")), 3535));
            (__HIVE_P2_temp3525_8 = a, __HIVE_P2_temp3525_9 = "test", __HIVE_P2_set(__HIVE_P2_temp3525_8, __HIVE_P2_temp3525_9, r, 3537));
            (__HIVE_P2_temp3525_11 = a, __HIVE_P2_temp3525_12 = "consequent", __HIVE_P2_set(__HIVE_P2_temp3525_11, __HIVE_P2_temp3525_12, (__HIVE_P2_temp3525_14 = this, __HIVE_P2_temp3525_15 = __HIVE_P2_get(__HIVE_P2_temp3525_14, "parseMaybeAssign", 3541), __HIVE_P2_invoke(__HIVE_P2_temp3525_15, __HIVE_P2_temp3525_14, (__HIVE_P2_reserveArray(0, 3541), __HIVE_P2_ownArray([], 3541, "CONTROL_ARRAY")), 3541)), 3539));
            (__HIVE_P2_temp3525_16 = this, __HIVE_P2_temp3525_17 = __HIVE_P2_get(__HIVE_P2_temp3525_16, "expect", 3543), __HIVE_P2_invoke(__HIVE_P2_temp3525_17, __HIVE_P2_temp3525_16, (__HIVE_P2_reserveArray(1, 3543), __HIVE_P2_ownArray([__HIVE_P2_get(m, "colon", 3544)], 3543, "CONTROL_ARRAY")), 3543));
            (__HIVE_P2_temp3525_18 = a, __HIVE_P2_temp3525_19 = "alternate", __HIVE_P2_set(__HIVE_P2_temp3525_18, __HIVE_P2_temp3525_19, (__HIVE_P2_temp3525_21 = this, __HIVE_P2_temp3525_22 = __HIVE_P2_get(__HIVE_P2_temp3525_21, "parseMaybeAssign", 3548), __HIVE_P2_invoke(__HIVE_P2_temp3525_22, __HIVE_P2_temp3525_21, (__HIVE_P2_reserveArray(1, 3548), __HIVE_P2_ownArray([e], 3548, "CONTROL_ARRAY")), 3548)), 3546));
            return (__HIVE_P2_temp3525_23 = this, __HIVE_P2_temp3525_24 = __HIVE_P2_get(__HIVE_P2_temp3525_23, "finishNode", 3550), __HIVE_P2_invoke(__HIVE_P2_temp3525_24, __HIVE_P2_temp3525_23, (__HIVE_P2_reserveArray(2, 3550), __HIVE_P2_ownArray([a, "ConditionalExpression"], 3550, "CONTROL_ARRAY")), 3550));
        }
        return r;
    }, 29, 2, 0, 3525)), 3523));
    (__HIVE_P2_temp0_1265 = pe, __HIVE_P2_temp0_1266 = "parseExprOps", __HIVE_P2_set(__HIVE_P2_temp0_1265, __HIVE_P2_temp0_1266, (__HIVE_P2_reserveFunction(3554), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp3554_0, __HIVE_P2_temp3554_1, __HIVE_P2_temp3554_2, __HIVE_P2_temp3554_3, __HIVE_P2_temp3554_4, __HIVE_P2_temp3554_5;
        var i = __HIVE_P2_get(this, "start", 3555), s = __HIVE_P2_get(this, "startLoc", 3556);
        var r = (__HIVE_P2_temp3554_0 = this, __HIVE_P2_temp3554_1 = __HIVE_P2_get(__HIVE_P2_temp3554_0, "parseMaybeUnary", 3557), __HIVE_P2_invoke(__HIVE_P2_temp3554_1, __HIVE_P2_temp3554_0, (__HIVE_P2_reserveArray(4, 3557), __HIVE_P2_ownArray([t, false, false, e], 3557, "CONTROL_ARRAY")), 3557));
        if ((__HIVE_P2_temp3554_2 = this, __HIVE_P2_temp3554_3 = __HIVE_P2_get(__HIVE_P2_temp3554_2, "checkExpressionErrors", 3559), __HIVE_P2_invoke(__HIVE_P2_temp3554_3, __HIVE_P2_temp3554_2, (__HIVE_P2_reserveArray(1, 3559), __HIVE_P2_ownArray([t], 3559, "CONTROL_ARRAY")), 3559))) {
            return r;
        }
        return __HIVE_P2_get(r, "start", 3561) === i && __HIVE_P2_get(r, "type", 3562) === "ArrowFunctionExpression" ? r : (__HIVE_P2_temp3554_4 = this, __HIVE_P2_temp3554_5 = __HIVE_P2_get(__HIVE_P2_temp3554_4, "parseExprOp", 3563), __HIVE_P2_invoke(__HIVE_P2_temp3554_5, __HIVE_P2_temp3554_4, (__HIVE_P2_reserveArray(5, 3563), __HIVE_P2_ownArray([r, i, s, __HIVE_P2_unary("-", 1, 3564), e], 3563, "CONTROL_ARRAY")), 3563));
    }, 9, 2, 0, 3554)), 3552));
    (__HIVE_P2_temp0_1268 = pe, __HIVE_P2_temp0_1269 = "parseExprOp", __HIVE_P2_set(__HIVE_P2_temp0_1268, __HIVE_P2_temp0_1269, (__HIVE_P2_reserveFunction(3568), __HIVE_P2_registerFunction(function (e, t, i, s, r) {
        var __HIVE_P2_temp3568_0, __HIVE_P2_temp3568_1, __HIVE_P2_temp3568_2, __HIVE_P2_temp3568_3, __HIVE_P2_temp3568_4, __HIVE_P2_temp3568_5, __HIVE_P2_temp3568_6, __HIVE_P2_temp3568_7, __HIVE_P2_temp3568_8, __HIVE_P2_temp3568_9;
        var a = __HIVE_P2_get(__HIVE_P2_get(this, "type", 3570), "binop", 3569);
        if (__HIVE_P2_binary("!=", a, null, 3571) && (!r || __HIVE_P2_get(this, "type", 3572) !== __HIVE_P2_get(m, "_in", 3573))) {
            if (__HIVE_P2_binary(">", a, s, 3574)) {
                var n = __HIVE_P2_get(this, "type", 3575) === __HIVE_P2_get(m, "logicalOR", 3576) || __HIVE_P2_get(this, "type", 3577) === __HIVE_P2_get(m, "logicalAND", 3578);
                var o = __HIVE_P2_get(this, "type", 3579) === __HIVE_P2_get(m, "coalesce", 3580);
                if (o) {
                    a = __HIVE_P2_get(__HIVE_P2_get(m, "logicalAND", 3583), "binop", 3582);
                }
                var h = __HIVE_P2_get(this, "value", 3584);
                (__HIVE_P2_temp3568_0 = this, __HIVE_P2_temp3568_1 = __HIVE_P2_get(__HIVE_P2_temp3568_0, "next", 3585), __HIVE_P2_invoke(__HIVE_P2_temp3568_1, __HIVE_P2_temp3568_0, (__HIVE_P2_reserveArray(0, 3585), __HIVE_P2_ownArray([], 3585, "CONTROL_ARRAY")), 3585));
                var p = __HIVE_P2_get(this, "start", 3587), c = __HIVE_P2_get(this, "startLoc", 3588);
                var l = (__HIVE_P2_temp3568_4 = this, __HIVE_P2_temp3568_5 = __HIVE_P2_get(__HIVE_P2_temp3568_4, "parseExprOp", 3589), __HIVE_P2_invoke(__HIVE_P2_temp3568_5, __HIVE_P2_temp3568_4, (__HIVE_P2_reserveArray(5, 3589), __HIVE_P2_ownArray([(__HIVE_P2_temp3568_2 = this, __HIVE_P2_temp3568_3 = __HIVE_P2_get(__HIVE_P2_temp3568_2, "parseMaybeUnary", 3590), __HIVE_P2_invoke(__HIVE_P2_temp3568_3, __HIVE_P2_temp3568_2, (__HIVE_P2_reserveArray(4, 3590), __HIVE_P2_ownArray([null, false, false, r], 3590, "CONTROL_ARRAY")), 3590)), p, c, a, r], 3589, "CONTROL_ARRAY")), 3589));
                var u = (__HIVE_P2_temp3568_6 = this, __HIVE_P2_temp3568_7 = __HIVE_P2_get(__HIVE_P2_temp3568_6, "buildBinary", 3593), __HIVE_P2_invoke(__HIVE_P2_temp3568_7, __HIVE_P2_temp3568_6, (__HIVE_P2_reserveArray(6, 3593), __HIVE_P2_ownArray([t, i, e, l, h, n || o], 3593, "CONTROL_ARRAY")), 3593));
                if (n && __HIVE_P2_get(this, "type", 3595) === __HIVE_P2_get(m, "coalesce", 3596) || o && (__HIVE_P2_get(this, "type", 3597) === __HIVE_P2_get(m, "logicalOR", 3598) || __HIVE_P2_get(this, "type", 3599) === __HIVE_P2_get(m, "logicalAND", 3600))) {
                    __HIVE_P2_syntaxRefusal(3601);
                }
                return (__HIVE_P2_temp3568_8 = this, __HIVE_P2_temp3568_9 = __HIVE_P2_get(__HIVE_P2_temp3568_8, "parseExprOp", 3602), __HIVE_P2_invoke(__HIVE_P2_temp3568_9, __HIVE_P2_temp3568_8, (__HIVE_P2_reserveArray(5, 3602), __HIVE_P2_ownArray([u, t, i, s, r], 3602, "CONTROL_ARRAY")), 3602));
            }
        }
        return e;
    }, 18, 5, 0, 3568)), 3566));
    (__HIVE_P2_temp0_1271 = pe, __HIVE_P2_temp0_1272 = "buildBinary", __HIVE_P2_set(__HIVE_P2_temp0_1271, __HIVE_P2_temp0_1272, (__HIVE_P2_reserveFunction(3606), __HIVE_P2_registerFunction(function (e, t, i, s, r, a) {
        var __HIVE_P2_temp3606_0, __HIVE_P2_temp3606_1, __HIVE_P2_temp3606_2, __HIVE_P2_temp3606_3, __HIVE_P2_temp3606_4, __HIVE_P2_temp3606_5, __HIVE_P2_temp3606_6, __HIVE_P2_temp3606_7, __HIVE_P2_temp3606_8, __HIVE_P2_temp3606_9, __HIVE_P2_temp3606_10, __HIVE_P2_temp3606_11, __HIVE_P2_temp3606_12;
        if (__HIVE_P2_get(s, "type", 3607) === "PrivateIdentifier") {
            __HIVE_P2_syntaxRefusal(3608);
        }
        var n = (__HIVE_P2_temp3606_0 = this, __HIVE_P2_temp3606_1 = __HIVE_P2_get(__HIVE_P2_temp3606_0, "startNodeAt", 3609), __HIVE_P2_invoke(__HIVE_P2_temp3606_1, __HIVE_P2_temp3606_0, (__HIVE_P2_reserveArray(2, 3609), __HIVE_P2_ownArray([e, t], 3609, "CONTROL_ARRAY")), 3609));
        (__HIVE_P2_temp3606_2 = n, __HIVE_P2_temp3606_3 = "left", __HIVE_P2_set(__HIVE_P2_temp3606_2, __HIVE_P2_temp3606_3, i, 3611));
        (__HIVE_P2_temp3606_5 = n, __HIVE_P2_temp3606_6 = "operator", __HIVE_P2_set(__HIVE_P2_temp3606_5, __HIVE_P2_temp3606_6, r, 3613));
        (__HIVE_P2_temp3606_8 = n, __HIVE_P2_temp3606_9 = "right", __HIVE_P2_set(__HIVE_P2_temp3606_8, __HIVE_P2_temp3606_9, s, 3615));
        return (__HIVE_P2_temp3606_11 = this, __HIVE_P2_temp3606_12 = __HIVE_P2_get(__HIVE_P2_temp3606_11, "finishNode", 3617), __HIVE_P2_invoke(__HIVE_P2_temp3606_12, __HIVE_P2_temp3606_11, (__HIVE_P2_reserveArray(2, 3617), __HIVE_P2_ownArray([n, a ? "LogicalExpression" : "BinaryExpression"], 3617, "CONTROL_ARRAY")), 3617));
    }, 14, 6, 0, 3606)), 3604));
    (__HIVE_P2_temp0_1274 = pe, __HIVE_P2_temp0_1275 = "parseMaybeUnary", __HIVE_P2_set(__HIVE_P2_temp0_1274, __HIVE_P2_temp0_1275, (__HIVE_P2_reserveFunction(3621), __HIVE_P2_registerFunction(function (e, t, i, s) {
        var __HIVE_P2_temp3621_0, __HIVE_P2_temp3621_1, __HIVE_P2_temp3621_2, __HIVE_P2_temp3621_3, __HIVE_P2_temp3621_4, __HIVE_P2_temp3621_5, __HIVE_P2_temp3621_6, __HIVE_P2_temp3621_7, __HIVE_P2_temp3621_8, __HIVE_P2_temp3621_9, __HIVE_P2_temp3621_10, __HIVE_P2_temp3621_11, __HIVE_P2_temp3621_12, __HIVE_P2_temp3621_13, __HIVE_P2_temp3621_14, __HIVE_P2_temp3621_15, __HIVE_P2_temp3621_16, __HIVE_P2_temp3621_17, __HIVE_P2_temp3621_18, __HIVE_P2_temp3621_19, __HIVE_P2_temp3621_20, __HIVE_P2_temp3621_21, __HIVE_P2_temp3621_22, __HIVE_P2_temp3621_23, __HIVE_P2_temp3621_24, __HIVE_P2_temp3621_25, __HIVE_P2_temp3621_26, __HIVE_P2_temp3621_27, __HIVE_P2_temp3621_28, __HIVE_P2_temp3621_29, __HIVE_P2_temp3621_30, __HIVE_P2_temp3621_31, __HIVE_P2_temp3621_32, __HIVE_P2_temp3621_33, __HIVE_P2_temp3621_34, __HIVE_P2_temp3621_35, __HIVE_P2_temp3621_36, __HIVE_P2_temp3621_37, __HIVE_P2_temp3621_38, __HIVE_P2_temp3621_39, __HIVE_P2_temp3621_40, __HIVE_P2_temp3621_41, __HIVE_P2_temp3621_42, __HIVE_P2_temp3621_43, __HIVE_P2_temp3621_44, __HIVE_P2_temp3621_45, __HIVE_P2_temp3621_46, __HIVE_P2_temp3621_47, __HIVE_P2_temp3621_48, __HIVE_P2_temp3621_49, __HIVE_P2_temp3621_50, __HIVE_P2_temp3621_51, __HIVE_P2_temp3621_52, __HIVE_P2_temp3621_53, __HIVE_P2_temp3621_54, __HIVE_P2_temp3621_55;
        var r = __HIVE_P2_get(this, "start", 3622), a = __HIVE_P2_get(this, "startLoc", 3623), n;
        if ((__HIVE_P2_temp3621_0 = this, __HIVE_P2_temp3621_1 = __HIVE_P2_get(__HIVE_P2_temp3621_0, "isContextual", 3624), __HIVE_P2_invoke(__HIVE_P2_temp3621_1, __HIVE_P2_temp3621_0, (__HIVE_P2_reserveArray(1, 3624), __HIVE_P2_ownArray(["await"], 3624, "CONTROL_ARRAY")), 3624)) && __HIVE_P2_get(this, "canAwait", 3626)) {
            n = (__HIVE_P2_temp3621_2 = this, __HIVE_P2_temp3621_3 = __HIVE_P2_get(__HIVE_P2_temp3621_2, "parseAwait", 3628), __HIVE_P2_invoke(__HIVE_P2_temp3621_3, __HIVE_P2_temp3621_2, (__HIVE_P2_reserveArray(1, 3628), __HIVE_P2_ownArray([s], 3628, "CONTROL_ARRAY")), 3628));
            t = true;
        }
        else if (__HIVE_P2_get(__HIVE_P2_get(this, "type", 3632), "prefix", 3631)) {
            var o = (__HIVE_P2_temp3621_4 = this, __HIVE_P2_temp3621_5 = __HIVE_P2_get(__HIVE_P2_temp3621_4, "startNode", 3633), __HIVE_P2_invoke(__HIVE_P2_temp3621_5, __HIVE_P2_temp3621_4, (__HIVE_P2_reserveArray(0, 3633), __HIVE_P2_ownArray([], 3633, "CONTROL_ARRAY")), 3633)), h = __HIVE_P2_get(this, "type", 3635) === __HIVE_P2_get(m, "incDec", 3636);
            (__HIVE_P2_temp3621_6 = o, __HIVE_P2_temp3621_7 = "operator", __HIVE_P2_set(__HIVE_P2_temp3621_6, __HIVE_P2_temp3621_7, __HIVE_P2_get(this, "value", 3639), 3637));
            (__HIVE_P2_temp3621_9 = o, __HIVE_P2_temp3621_10 = "prefix", __HIVE_P2_set(__HIVE_P2_temp3621_9, __HIVE_P2_temp3621_10, true, 3640));
            (__HIVE_P2_temp3621_12 = this, __HIVE_P2_temp3621_13 = __HIVE_P2_get(__HIVE_P2_temp3621_12, "next", 3642), __HIVE_P2_invoke(__HIVE_P2_temp3621_13, __HIVE_P2_temp3621_12, (__HIVE_P2_reserveArray(0, 3642), __HIVE_P2_ownArray([], 3642, "CONTROL_ARRAY")), 3642));
            (__HIVE_P2_temp3621_14 = o, __HIVE_P2_temp3621_15 = "argument", __HIVE_P2_set(__HIVE_P2_temp3621_14, __HIVE_P2_temp3621_15, (__HIVE_P2_temp3621_17 = this, __HIVE_P2_temp3621_18 = __HIVE_P2_get(__HIVE_P2_temp3621_17, "parseMaybeUnary", 3646), __HIVE_P2_invoke(__HIVE_P2_temp3621_18, __HIVE_P2_temp3621_17, (__HIVE_P2_reserveArray(4, 3646), __HIVE_P2_ownArray([null, true, h, s], 3646, "CONTROL_ARRAY")), 3646)), 3644));
            (__HIVE_P2_temp3621_19 = this, __HIVE_P2_temp3621_20 = __HIVE_P2_get(__HIVE_P2_temp3621_19, "checkExpressionErrors", 3648), __HIVE_P2_invoke(__HIVE_P2_temp3621_20, __HIVE_P2_temp3621_19, (__HIVE_P2_reserveArray(2, 3648), __HIVE_P2_ownArray([e, true], 3648, "CONTROL_ARRAY")), 3648));
            if (h) {
                (__HIVE_P2_temp3621_21 = this, __HIVE_P2_temp3621_22 = __HIVE_P2_get(__HIVE_P2_temp3621_21, "checkLValSimple", 3650), __HIVE_P2_invoke(__HIVE_P2_temp3621_22, __HIVE_P2_temp3621_21, (__HIVE_P2_reserveArray(1, 3650), __HIVE_P2_ownArray([__HIVE_P2_get(o, "argument", 3651)], 3650, "CONTROL_ARRAY")), 3650));
            }
            else if (__HIVE_P2_get(this, "strict", 3653) && __HIVE_P2_get(o, "operator", 3654) === "delete" && __HIVE_P2_invoke(isLocalVariableAccess, void 0, (__HIVE_P2_reserveArray(1, 3655), __HIVE_P2_ownArray([__HIVE_P2_get(o, "argument", 3656)], 3655, "CONTROL_ARRAY")), 3655)) {
                __HIVE_P2_syntaxRefusal(3657);
            }
            else if (__HIVE_P2_get(o, "operator", 3658) === "delete" && __HIVE_P2_invoke(isPrivateFieldAccess, void 0, (__HIVE_P2_reserveArray(1, 3659), __HIVE_P2_ownArray([__HIVE_P2_get(o, "argument", 3660)], 3659, "CONTROL_ARRAY")), 3659)) {
                __HIVE_P2_syntaxRefusal(3661);
            }
            else {
                t = true;
            }
            n = (__HIVE_P2_temp3621_23 = this, __HIVE_P2_temp3621_24 = __HIVE_P2_get(__HIVE_P2_temp3621_23, "finishNode", 3664), __HIVE_P2_invoke(__HIVE_P2_temp3621_24, __HIVE_P2_temp3621_23, (__HIVE_P2_reserveArray(2, 3664), __HIVE_P2_ownArray([o, h ? "UpdateExpression" : "UnaryExpression"], 3664, "CONTROL_ARRAY")), 3664));
        }
        else if (!t && __HIVE_P2_get(this, "type", 3666) === __HIVE_P2_get(m, "privateId", 3667)) {
            if ((s || __HIVE_P2_get(__HIVE_P2_get(this, "privateNameStack", 3669), "length", 3668) === 0) && __HIVE_P2_get(__HIVE_P2_get(this, "options", 3671), "checkPrivateFields", 3670)) {
                __HIVE_P2_syntaxRefusal(3672);
            }
            n = (__HIVE_P2_temp3621_25 = this, __HIVE_P2_temp3621_26 = __HIVE_P2_get(__HIVE_P2_temp3621_25, "parsePrivateIdent", 3674), __HIVE_P2_invoke(__HIVE_P2_temp3621_26, __HIVE_P2_temp3621_25, (__HIVE_P2_reserveArray(0, 3674), __HIVE_P2_ownArray([], 3674, "CONTROL_ARRAY")), 3674));
            if (__HIVE_P2_get(this, "type", 3676) !== __HIVE_P2_get(m, "_in", 3677)) {
                __HIVE_P2_syntaxRefusal(3678);
            }
        }
        else {
            n = (__HIVE_P2_temp3621_27 = this, __HIVE_P2_temp3621_28 = __HIVE_P2_get(__HIVE_P2_temp3621_27, "parseExprSubscripts", 3680), __HIVE_P2_invoke(__HIVE_P2_temp3621_28, __HIVE_P2_temp3621_27, (__HIVE_P2_reserveArray(2, 3680), __HIVE_P2_ownArray([e, s], 3680, "CONTROL_ARRAY")), 3680));
            if ((__HIVE_P2_temp3621_29 = this, __HIVE_P2_temp3621_30 = __HIVE_P2_get(__HIVE_P2_temp3621_29, "checkExpressionErrors", 3682), __HIVE_P2_invoke(__HIVE_P2_temp3621_30, __HIVE_P2_temp3621_29, (__HIVE_P2_reserveArray(1, 3682), __HIVE_P2_ownArray([e], 3682, "CONTROL_ARRAY")), 3682))) {
                return n;
            }
            while (__HIVE_P2_get(__HIVE_P2_get(this, "type", 3686), "postfix", 3685) && !(__HIVE_P2_temp3621_31 = this, __HIVE_P2_temp3621_32 = __HIVE_P2_get(__HIVE_P2_temp3621_31, "canInsertSemicolon", 3687), __HIVE_P2_invoke(__HIVE_P2_temp3621_32, __HIVE_P2_temp3621_31, (__HIVE_P2_reserveArray(0, 3687), __HIVE_P2_ownArray([], 3687, "CONTROL_ARRAY")), 3687))) {
                __HIVE_P2_tick(3684);
                var p = (__HIVE_P2_temp3621_33 = this, __HIVE_P2_temp3621_34 = __HIVE_P2_get(__HIVE_P2_temp3621_33, "startNodeAt", 3689), __HIVE_P2_invoke(__HIVE_P2_temp3621_34, __HIVE_P2_temp3621_33, (__HIVE_P2_reserveArray(2, 3689), __HIVE_P2_ownArray([r, a], 3689, "CONTROL_ARRAY")), 3689));
                (__HIVE_P2_temp3621_35 = p, __HIVE_P2_temp3621_36 = "operator", __HIVE_P2_set(__HIVE_P2_temp3621_35, __HIVE_P2_temp3621_36, __HIVE_P2_get(this, "value", 3693), 3691));
                (__HIVE_P2_temp3621_38 = p, __HIVE_P2_temp3621_39 = "prefix", __HIVE_P2_set(__HIVE_P2_temp3621_38, __HIVE_P2_temp3621_39, false, 3694));
                (__HIVE_P2_temp3621_41 = p, __HIVE_P2_temp3621_42 = "argument", __HIVE_P2_set(__HIVE_P2_temp3621_41, __HIVE_P2_temp3621_42, n, 3696));
                (__HIVE_P2_temp3621_44 = this, __HIVE_P2_temp3621_45 = __HIVE_P2_get(__HIVE_P2_temp3621_44, "checkLValSimple", 3698), __HIVE_P2_invoke(__HIVE_P2_temp3621_45, __HIVE_P2_temp3621_44, (__HIVE_P2_reserveArray(1, 3698), __HIVE_P2_ownArray([n], 3698, "CONTROL_ARRAY")), 3698));
                (__HIVE_P2_temp3621_46 = this, __HIVE_P2_temp3621_47 = __HIVE_P2_get(__HIVE_P2_temp3621_46, "next", 3700), __HIVE_P2_invoke(__HIVE_P2_temp3621_47, __HIVE_P2_temp3621_46, (__HIVE_P2_reserveArray(0, 3700), __HIVE_P2_ownArray([], 3700, "CONTROL_ARRAY")), 3700));
                n = (__HIVE_P2_temp3621_48 = this, __HIVE_P2_temp3621_49 = __HIVE_P2_get(__HIVE_P2_temp3621_48, "finishNode", 3703), __HIVE_P2_invoke(__HIVE_P2_temp3621_49, __HIVE_P2_temp3621_48, (__HIVE_P2_reserveArray(2, 3703), __HIVE_P2_ownArray([p, "UpdateExpression"], 3703, "CONTROL_ARRAY")), 3703));
            }
        }
        if (!i && (__HIVE_P2_temp3621_50 = this, __HIVE_P2_temp3621_51 = __HIVE_P2_get(__HIVE_P2_temp3621_50, "eat", 3705), __HIVE_P2_invoke(__HIVE_P2_temp3621_51, __HIVE_P2_temp3621_50, (__HIVE_P2_reserveArray(1, 3705), __HIVE_P2_ownArray([__HIVE_P2_get(m, "starstar", 3706)], 3705, "CONTROL_ARRAY")), 3705))) {
            if (t) {
                __HIVE_P2_syntaxRefusal(3708);
            }
            else {
                return (__HIVE_P2_temp3621_54 = this, __HIVE_P2_temp3621_55 = __HIVE_P2_get(__HIVE_P2_temp3621_54, "buildBinary", 3709), __HIVE_P2_invoke(__HIVE_P2_temp3621_55, __HIVE_P2_temp3621_54, (__HIVE_P2_reserveArray(6, 3709), __HIVE_P2_ownArray([r, a, n, (__HIVE_P2_temp3621_52 = this, __HIVE_P2_temp3621_53 = __HIVE_P2_get(__HIVE_P2_temp3621_52, "parseMaybeUnary", 3710), __HIVE_P2_invoke(__HIVE_P2_temp3621_53, __HIVE_P2_temp3621_52, (__HIVE_P2_reserveArray(4, 3710), __HIVE_P2_ownArray([null, false, false, s], 3710, "CONTROL_ARRAY")), 3710)), "**", false], 3709, "CONTROL_ARRAY")), 3709));
            }
        }
        else {
            return n;
        }
    }, 62, 4, 0, 3621)), 3619));
    function isLocalVariableAccess(e) {
        return __HIVE_P2_get(e, "type", 3714) === "Identifier" || __HIVE_P2_get(e, "type", 3715) === "ParenthesizedExpression" && __HIVE_P2_invoke(isLocalVariableAccess, void 0, (__HIVE_P2_reserveArray(1, 3716), __HIVE_P2_ownArray([__HIVE_P2_get(e, "expression", 3717)], 3716, "CONTROL_ARRAY")), 3716);
    }
    function isPrivateFieldAccess(e) {
        return __HIVE_P2_get(e, "type", 3719) === "MemberExpression" && __HIVE_P2_get(__HIVE_P2_get(e, "property", 3721), "type", 3720) === "PrivateIdentifier" || __HIVE_P2_get(e, "type", 3722) === "ChainExpression" && __HIVE_P2_invoke(isPrivateFieldAccess, void 0, (__HIVE_P2_reserveArray(1, 3723), __HIVE_P2_ownArray([__HIVE_P2_get(e, "expression", 3724)], 3723, "CONTROL_ARRAY")), 3723) || __HIVE_P2_get(e, "type", 3725) === "ParenthesizedExpression" && __HIVE_P2_invoke(isPrivateFieldAccess, void 0, (__HIVE_P2_reserveArray(1, 3726), __HIVE_P2_ownArray([__HIVE_P2_get(e, "expression", 3727)], 3726, "CONTROL_ARRAY")), 3726);
    }
    (__HIVE_P2_temp0_1277 = pe, __HIVE_P2_temp0_1278 = "parseExprSubscripts", __HIVE_P2_set(__HIVE_P2_temp0_1277, __HIVE_P2_temp0_1278, (__HIVE_P2_reserveFunction(3730), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp3730_0, __HIVE_P2_temp3730_1, __HIVE_P2_temp3730_2, __HIVE_P2_temp3730_3, __HIVE_P2_temp3730_4, __HIVE_P2_temp3730_5, __HIVE_P2_temp3730_6, __HIVE_P2_temp3730_7, __HIVE_P2_temp3730_8, __HIVE_P2_temp3730_9, __HIVE_P2_temp3730_10, __HIVE_P2_temp3730_11, __HIVE_P2_temp3730_12, __HIVE_P2_temp3730_13, __HIVE_P2_temp3730_14;
        var i = __HIVE_P2_get(this, "start", 3731), s = __HIVE_P2_get(this, "startLoc", 3732);
        var r = (__HIVE_P2_temp3730_0 = this, __HIVE_P2_temp3730_1 = __HIVE_P2_get(__HIVE_P2_temp3730_0, "parseExprAtom", 3733), __HIVE_P2_invoke(__HIVE_P2_temp3730_1, __HIVE_P2_temp3730_0, (__HIVE_P2_reserveArray(2, 3733), __HIVE_P2_ownArray([e, t], 3733, "CONTROL_ARRAY")), 3733));
        if (__HIVE_P2_get(r, "type", 3735) === "ArrowFunctionExpression" && (__HIVE_P2_temp3730_2 = __HIVE_P2_get(this, "input", 3740), __HIVE_P2_temp3730_3 = __HIVE_P2_get(__HIVE_P2_temp3730_2, "slice", 3736), __HIVE_P2_invoke(__HIVE_P2_temp3730_3, __HIVE_P2_temp3730_2, (__HIVE_P2_reserveArray(2, 3736), __HIVE_P2_ownArray([__HIVE_P2_get(this, "lastTokStart", 3737), __HIVE_P2_get(this, "lastTokEnd", 3738)], 3736, "CONTROL_ARRAY")), 3736)) !== ")") {
            return r;
        }
        var a = (__HIVE_P2_temp3730_4 = this, __HIVE_P2_temp3730_5 = __HIVE_P2_get(__HIVE_P2_temp3730_4, "parseSubscripts", 3741), __HIVE_P2_invoke(__HIVE_P2_temp3730_5, __HIVE_P2_temp3730_4, (__HIVE_P2_reserveArray(5, 3741), __HIVE_P2_ownArray([r, i, s, false, t], 3741, "CONTROL_ARRAY")), 3741));
        if (e && __HIVE_P2_get(a, "type", 3743) === "MemberExpression") {
            if (__HIVE_P2_binary(">=", __HIVE_P2_get(e, "parenthesizedAssign", 3745), __HIVE_P2_get(a, "start", 3746), 3744)) {
                (__HIVE_P2_temp3730_6 = e, __HIVE_P2_temp3730_7 = "parenthesizedAssign", __HIVE_P2_set(__HIVE_P2_temp3730_6, __HIVE_P2_temp3730_7, __HIVE_P2_unary("-", 1, 3749), 3747));
            }
            if (__HIVE_P2_binary(">=", __HIVE_P2_get(e, "parenthesizedBind", 3751), __HIVE_P2_get(a, "start", 3752), 3750)) {
                (__HIVE_P2_temp3730_9 = e, __HIVE_P2_temp3730_10 = "parenthesizedBind", __HIVE_P2_set(__HIVE_P2_temp3730_9, __HIVE_P2_temp3730_10, __HIVE_P2_unary("-", 1, 3755), 3753));
            }
            if (__HIVE_P2_binary(">=", __HIVE_P2_get(e, "trailingComma", 3757), __HIVE_P2_get(a, "start", 3758), 3756)) {
                (__HIVE_P2_temp3730_12 = e, __HIVE_P2_temp3730_13 = "trailingComma", __HIVE_P2_set(__HIVE_P2_temp3730_12, __HIVE_P2_temp3730_13, __HIVE_P2_unary("-", 1, 3761), 3759));
            }
        }
        return a;
    }, 19, 2, 0, 3730)), 3728));
    (__HIVE_P2_temp0_1280 = pe, __HIVE_P2_temp0_1281 = "parseSubscripts", __HIVE_P2_set(__HIVE_P2_temp0_1280, __HIVE_P2_temp0_1281, (__HIVE_P2_reserveFunction(3764), __HIVE_P2_registerFunction(function (e, t, i, s, r) {
        var __HIVE_P2_temp3764_0, __HIVE_P2_temp3764_1, __HIVE_P2_temp3764_2, __HIVE_P2_temp3764_3, __HIVE_P2_temp3764_4, __HIVE_P2_temp3764_5, __HIVE_P2_temp3764_6, __HIVE_P2_temp3764_7, __HIVE_P2_temp3764_8, __HIVE_P2_temp3764_9, __HIVE_P2_temp3764_10;
        var a = __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 3767), "ecmaVersion", 3766), 8, 3765) && __HIVE_P2_get(e, "type", 3768) === "Identifier" && __HIVE_P2_get(e, "name", 3769) === "async" && __HIVE_P2_get(this, "lastTokEnd", 3770) === __HIVE_P2_get(e, "end", 3771) && !(__HIVE_P2_temp3764_0 = this, __HIVE_P2_temp3764_1 = __HIVE_P2_get(__HIVE_P2_temp3764_0, "canInsertSemicolon", 3772), __HIVE_P2_invoke(__HIVE_P2_temp3764_1, __HIVE_P2_temp3764_0, (__HIVE_P2_reserveArray(0, 3772), __HIVE_P2_ownArray([], 3772, "CONTROL_ARRAY")), 3772)) && __HIVE_P2_binary("-", __HIVE_P2_get(e, "end", 3775), __HIVE_P2_get(e, "start", 3776), 3774) === 5 && __HIVE_P2_get(this, "potentialArrowAt", 3777) === __HIVE_P2_get(e, "start", 3778);
        var n = false;
        while (true) {
            __HIVE_P2_tick(3779);
            var o = (__HIVE_P2_temp3764_2 = this, __HIVE_P2_temp3764_3 = __HIVE_P2_get(__HIVE_P2_temp3764_2, "parseSubscript", 3780), __HIVE_P2_invoke(__HIVE_P2_temp3764_3, __HIVE_P2_temp3764_2, (__HIVE_P2_reserveArray(7, 3780), __HIVE_P2_ownArray([e, t, i, s, a, n, r], 3780, "CONTROL_ARRAY")), 3780));
            if (__HIVE_P2_get(o, "optional", 3782)) {
                n = true;
            }
            if (o === e || __HIVE_P2_get(o, "type", 3784) === "ArrowFunctionExpression") {
                if (n) {
                    var h = (__HIVE_P2_temp3764_4 = this, __HIVE_P2_temp3764_5 = __HIVE_P2_get(__HIVE_P2_temp3764_4, "startNodeAt", 3785), __HIVE_P2_invoke(__HIVE_P2_temp3764_5, __HIVE_P2_temp3764_4, (__HIVE_P2_reserveArray(2, 3785), __HIVE_P2_ownArray([t, i], 3785, "CONTROL_ARRAY")), 3785));
                    (__HIVE_P2_temp3764_6 = h, __HIVE_P2_temp3764_7 = "expression", __HIVE_P2_set(__HIVE_P2_temp3764_6, __HIVE_P2_temp3764_7, o, 3787));
                    o = (__HIVE_P2_temp3764_9 = this, __HIVE_P2_temp3764_10 = __HIVE_P2_get(__HIVE_P2_temp3764_9, "finishNode", 3790), __HIVE_P2_invoke(__HIVE_P2_temp3764_10, __HIVE_P2_temp3764_9, (__HIVE_P2_reserveArray(2, 3790), __HIVE_P2_ownArray([h, "ChainExpression"], 3790, "CONTROL_ARRAY")), 3790));
                }
                return o;
            }
            e = o;
        }
    }, 15, 5, 0, 3764)), 3762));
    (__HIVE_P2_temp0_1283 = pe, __HIVE_P2_temp0_1284 = "shouldParseAsyncArrow", __HIVE_P2_set(__HIVE_P2_temp0_1283, __HIVE_P2_temp0_1284, (__HIVE_P2_reserveFunction(3795), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp3795_0, __HIVE_P2_temp3795_1, __HIVE_P2_temp3795_2, __HIVE_P2_temp3795_3;
        return !(__HIVE_P2_temp3795_0 = this, __HIVE_P2_temp3795_1 = __HIVE_P2_get(__HIVE_P2_temp3795_0, "canInsertSemicolon", 3796), __HIVE_P2_invoke(__HIVE_P2_temp3795_1, __HIVE_P2_temp3795_0, (__HIVE_P2_reserveArray(0, 3796), __HIVE_P2_ownArray([], 3796, "CONTROL_ARRAY")), 3796)) && (__HIVE_P2_temp3795_2 = this, __HIVE_P2_temp3795_3 = __HIVE_P2_get(__HIVE_P2_temp3795_2, "eat", 3798), __HIVE_P2_invoke(__HIVE_P2_temp3795_3, __HIVE_P2_temp3795_2, (__HIVE_P2_reserveArray(1, 3798), __HIVE_P2_ownArray([__HIVE_P2_get(m, "arrow", 3799)], 3798, "CONTROL_ARRAY")), 3798));
    }, 4, 0, 0, 3795)), 3793));
    (__HIVE_P2_temp0_1286 = pe, __HIVE_P2_temp0_1287 = "parseSubscriptAsyncArrow", __HIVE_P2_set(__HIVE_P2_temp0_1286, __HIVE_P2_temp0_1287, (__HIVE_P2_reserveFunction(3803), __HIVE_P2_registerFunction(function (e, t, i, s) {
        var __HIVE_P2_temp3803_0, __HIVE_P2_temp3803_1, __HIVE_P2_temp3803_2, __HIVE_P2_temp3803_3;
        return (__HIVE_P2_temp3803_2 = this, __HIVE_P2_temp3803_3 = __HIVE_P2_get(__HIVE_P2_temp3803_2, "parseArrowExpression", 3804), __HIVE_P2_invoke(__HIVE_P2_temp3803_3, __HIVE_P2_temp3803_2, (__HIVE_P2_reserveArray(4, 3804), __HIVE_P2_ownArray([(__HIVE_P2_temp3803_0 = this, __HIVE_P2_temp3803_1 = __HIVE_P2_get(__HIVE_P2_temp3803_0, "startNodeAt", 3805), __HIVE_P2_invoke(__HIVE_P2_temp3803_1, __HIVE_P2_temp3803_0, (__HIVE_P2_reserveArray(2, 3805), __HIVE_P2_ownArray([e, t], 3805, "CONTROL_ARRAY")), 3805)), i, true, s], 3804, "CONTROL_ARRAY")), 3804));
    }, 4, 4, 0, 3803)), 3801));
    (__HIVE_P2_temp0_1289 = pe, __HIVE_P2_temp0_1290 = "parseSubscript", __HIVE_P2_set(__HIVE_P2_temp0_1289, __HIVE_P2_temp0_1290, (__HIVE_P2_reserveFunction(3810), __HIVE_P2_registerFunction(function (e, t, i, s, r, a, n) {
        var __HIVE_P2_temp3810_0, __HIVE_P2_temp3810_1, __HIVE_P2_temp3810_2, __HIVE_P2_temp3810_3, __HIVE_P2_temp3810_4, __HIVE_P2_temp3810_5, __HIVE_P2_temp3810_6, __HIVE_P2_temp3810_7, __HIVE_P2_temp3810_8, __HIVE_P2_temp3810_9, __HIVE_P2_temp3810_10, __HIVE_P2_temp3810_11, __HIVE_P2_temp3810_12, __HIVE_P2_temp3810_13, __HIVE_P2_temp3810_14, __HIVE_P2_temp3810_15, __HIVE_P2_temp3810_16, __HIVE_P2_temp3810_17, __HIVE_P2_temp3810_18, __HIVE_P2_temp3810_19, __HIVE_P2_temp3810_20, __HIVE_P2_temp3810_21, __HIVE_P2_temp3810_22, __HIVE_P2_temp3810_23, __HIVE_P2_temp3810_24, __HIVE_P2_temp3810_25, __HIVE_P2_temp3810_26, __HIVE_P2_temp3810_27, __HIVE_P2_temp3810_28, __HIVE_P2_temp3810_29, __HIVE_P2_temp3810_30, __HIVE_P2_temp3810_31, __HIVE_P2_temp3810_32, __HIVE_P2_temp3810_33, __HIVE_P2_temp3810_34, __HIVE_P2_temp3810_35, __HIVE_P2_temp3810_36, __HIVE_P2_temp3810_37, __HIVE_P2_temp3810_38, __HIVE_P2_temp3810_39, __HIVE_P2_temp3810_40, __HIVE_P2_temp3810_41, __HIVE_P2_temp3810_42, __HIVE_P2_temp3810_43, __HIVE_P2_temp3810_44, __HIVE_P2_temp3810_45, __HIVE_P2_temp3810_46, __HIVE_P2_temp3810_47, __HIVE_P2_temp3810_48, __HIVE_P2_temp3810_49, __HIVE_P2_temp3810_50, __HIVE_P2_temp3810_51, __HIVE_P2_temp3810_52, __HIVE_P2_temp3810_53, __HIVE_P2_temp3810_54, __HIVE_P2_temp3810_55, __HIVE_P2_temp3810_56, __HIVE_P2_temp3810_57, __HIVE_P2_temp3810_58, __HIVE_P2_temp3810_59, __HIVE_P2_temp3810_60, __HIVE_P2_temp3810_61, __HIVE_P2_temp3810_62, __HIVE_P2_temp3810_63, __HIVE_P2_temp3810_64, __HIVE_P2_temp3810_65, __HIVE_P2_temp3810_66, __HIVE_P2_temp3810_67, __HIVE_P2_temp3810_68, __HIVE_P2_temp3810_69, __HIVE_P2_temp3810_70, __HIVE_P2_temp3810_71, __HIVE_P2_temp3810_72, __HIVE_P2_temp3810_73, __HIVE_P2_temp3810_74, __HIVE_P2_temp3810_75, __HIVE_P2_temp3810_76, __HIVE_P2_temp3810_77, __HIVE_P2_temp3810_78, __HIVE_P2_temp3810_79, __HIVE_P2_temp3810_80, __HIVE_P2_temp3810_81, __HIVE_P2_temp3810_82, __HIVE_P2_temp3810_83, __HIVE_P2_temp3810_84, __HIVE_P2_temp3810_85, __HIVE_P2_temp3810_86, __HIVE_P2_temp3810_87, __HIVE_P2_temp3810_88, __HIVE_P2_temp3810_89, __HIVE_P2_temp3810_90, __HIVE_P2_temp3810_91, __HIVE_P2_temp3810_92, __HIVE_P2_temp3810_93, __HIVE_P2_temp3810_94, __HIVE_P2_temp3810_95, __HIVE_P2_temp3810_96, __HIVE_P2_temp3810_97, __HIVE_P2_temp3810_98, __HIVE_P2_temp3810_99, __HIVE_P2_temp3810_100, __HIVE_P2_temp3810_101;
        var o = __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 3813), "ecmaVersion", 3812), 11, 3811);
        var h = o && (__HIVE_P2_temp3810_0 = this, __HIVE_P2_temp3810_1 = __HIVE_P2_get(__HIVE_P2_temp3810_0, "eat", 3814), __HIVE_P2_invoke(__HIVE_P2_temp3810_1, __HIVE_P2_temp3810_0, (__HIVE_P2_reserveArray(1, 3814), __HIVE_P2_ownArray([__HIVE_P2_get(m, "questionDot", 3815)], 3814, "CONTROL_ARRAY")), 3814));
        if (s && h) {
            __HIVE_P2_syntaxRefusal(3817);
        }
        var p = (__HIVE_P2_temp3810_2 = this, __HIVE_P2_temp3810_3 = __HIVE_P2_get(__HIVE_P2_temp3810_2, "eat", 3818), __HIVE_P2_invoke(__HIVE_P2_temp3810_3, __HIVE_P2_temp3810_2, (__HIVE_P2_reserveArray(1, 3818), __HIVE_P2_ownArray([__HIVE_P2_get(m, "bracketL", 3819)], 3818, "CONTROL_ARRAY")), 3818));
        if (p || h && __HIVE_P2_get(this, "type", 3821) !== __HIVE_P2_get(m, "parenL", 3822) && __HIVE_P2_get(this, "type", 3823) !== __HIVE_P2_get(m, "backQuote", 3824) || (__HIVE_P2_temp3810_4 = this, __HIVE_P2_temp3810_5 = __HIVE_P2_get(__HIVE_P2_temp3810_4, "eat", 3825), __HIVE_P2_invoke(__HIVE_P2_temp3810_5, __HIVE_P2_temp3810_4, (__HIVE_P2_reserveArray(1, 3825), __HIVE_P2_ownArray([__HIVE_P2_get(m, "dot", 3826)], 3825, "CONTROL_ARRAY")), 3825))) {
            var c = (__HIVE_P2_temp3810_6 = this, __HIVE_P2_temp3810_7 = __HIVE_P2_get(__HIVE_P2_temp3810_6, "startNodeAt", 3828), __HIVE_P2_invoke(__HIVE_P2_temp3810_7, __HIVE_P2_temp3810_6, (__HIVE_P2_reserveArray(2, 3828), __HIVE_P2_ownArray([t, i], 3828, "CONTROL_ARRAY")), 3828));
            (__HIVE_P2_temp3810_8 = c, __HIVE_P2_temp3810_9 = "object", __HIVE_P2_set(__HIVE_P2_temp3810_8, __HIVE_P2_temp3810_9, e, 3830));
            if (p) {
                (__HIVE_P2_temp3810_11 = c, __HIVE_P2_temp3810_12 = "property", __HIVE_P2_set(__HIVE_P2_temp3810_11, __HIVE_P2_temp3810_12, (__HIVE_P2_temp3810_14 = this, __HIVE_P2_temp3810_15 = __HIVE_P2_get(__HIVE_P2_temp3810_14, "parseExpression", 3834), __HIVE_P2_invoke(__HIVE_P2_temp3810_15, __HIVE_P2_temp3810_14, (__HIVE_P2_reserveArray(0, 3834), __HIVE_P2_ownArray([], 3834, "CONTROL_ARRAY")), 3834)), 3832));
                (__HIVE_P2_temp3810_16 = this, __HIVE_P2_temp3810_17 = __HIVE_P2_get(__HIVE_P2_temp3810_16, "expect", 3836), __HIVE_P2_invoke(__HIVE_P2_temp3810_17, __HIVE_P2_temp3810_16, (__HIVE_P2_reserveArray(1, 3836), __HIVE_P2_ownArray([__HIVE_P2_get(m, "bracketR", 3837)], 3836, "CONTROL_ARRAY")), 3836));
            }
            else if (__HIVE_P2_get(this, "type", 3839) === __HIVE_P2_get(m, "privateId", 3840) && __HIVE_P2_get(e, "type", 3841) !== "Super") {
                (__HIVE_P2_temp3810_18 = c, __HIVE_P2_temp3810_19 = "property", __HIVE_P2_set(__HIVE_P2_temp3810_18, __HIVE_P2_temp3810_19, (__HIVE_P2_temp3810_21 = this, __HIVE_P2_temp3810_22 = __HIVE_P2_get(__HIVE_P2_temp3810_21, "parsePrivateIdent", 3844), __HIVE_P2_invoke(__HIVE_P2_temp3810_22, __HIVE_P2_temp3810_21, (__HIVE_P2_reserveArray(0, 3844), __HIVE_P2_ownArray([], 3844, "CONTROL_ARRAY")), 3844)), 3842));
            }
            else {
                (__HIVE_P2_temp3810_23 = c, __HIVE_P2_temp3810_24 = "property", __HIVE_P2_set(__HIVE_P2_temp3810_23, __HIVE_P2_temp3810_24, (__HIVE_P2_temp3810_26 = this, __HIVE_P2_temp3810_27 = __HIVE_P2_get(__HIVE_P2_temp3810_26, "parseIdent", 3848), __HIVE_P2_invoke(__HIVE_P2_temp3810_27, __HIVE_P2_temp3810_26, (__HIVE_P2_reserveArray(1, 3848), __HIVE_P2_ownArray([__HIVE_P2_get(__HIVE_P2_get(this, "options", 3850), "allowReserved", 3849) !== "never"], 3848, "CONTROL_ARRAY")), 3848)), 3846));
            }
            (__HIVE_P2_temp3810_28 = c, __HIVE_P2_temp3810_29 = "computed", __HIVE_P2_set(__HIVE_P2_temp3810_28, __HIVE_P2_temp3810_29, !!p, 3852));
            if (o) {
                (__HIVE_P2_temp3810_31 = c, __HIVE_P2_temp3810_32 = "optional", __HIVE_P2_set(__HIVE_P2_temp3810_31, __HIVE_P2_temp3810_32, h, 3854));
            }
            e = (__HIVE_P2_temp3810_34 = this, __HIVE_P2_temp3810_35 = __HIVE_P2_get(__HIVE_P2_temp3810_34, "finishNode", 3857), __HIVE_P2_invoke(__HIVE_P2_temp3810_35, __HIVE_P2_temp3810_34, (__HIVE_P2_reserveArray(2, 3857), __HIVE_P2_ownArray([c, "MemberExpression"], 3857, "CONTROL_ARRAY")), 3857));
        }
        else if (!s && (__HIVE_P2_temp3810_36 = this, __HIVE_P2_temp3810_37 = __HIVE_P2_get(__HIVE_P2_temp3810_36, "eat", 3859), __HIVE_P2_invoke(__HIVE_P2_temp3810_37, __HIVE_P2_temp3810_36, (__HIVE_P2_reserveArray(1, 3859), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenL", 3860)], 3859, "CONTROL_ARRAY")), 3859))) {
            var l = __HIVE_P2_construct(Z, (__HIVE_P2_reserveArray(0, 3862), __HIVE_P2_ownArray([], 3862, "CONTROL_ARRAY")), 3862), u = __HIVE_P2_get(this, "yieldPos", 3863), f = __HIVE_P2_get(this, "awaitPos", 3864), d = __HIVE_P2_get(this, "awaitIdentPos", 3865);
            (__HIVE_P2_temp3810_38 = this, __HIVE_P2_temp3810_39 = "yieldPos", __HIVE_P2_set(__HIVE_P2_temp3810_38, __HIVE_P2_temp3810_39, 0, 3866));
            (__HIVE_P2_temp3810_41 = this, __HIVE_P2_temp3810_42 = "awaitPos", __HIVE_P2_set(__HIVE_P2_temp3810_41, __HIVE_P2_temp3810_42, 0, 3868));
            (__HIVE_P2_temp3810_44 = this, __HIVE_P2_temp3810_45 = "awaitIdentPos", __HIVE_P2_set(__HIVE_P2_temp3810_44, __HIVE_P2_temp3810_45, 0, 3870));
            var g = (__HIVE_P2_temp3810_47 = this, __HIVE_P2_temp3810_48 = __HIVE_P2_get(__HIVE_P2_temp3810_47, "parseExprList", 3872), __HIVE_P2_invoke(__HIVE_P2_temp3810_48, __HIVE_P2_temp3810_47, (__HIVE_P2_reserveArray(4, 3872), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 3873), __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 3876), "ecmaVersion", 3875), 8, 3874), false, l], 3872, "CONTROL_ARRAY")), 3872));
            if (r && !h && (__HIVE_P2_temp3810_49 = this, __HIVE_P2_temp3810_50 = __HIVE_P2_get(__HIVE_P2_temp3810_49, "shouldParseAsyncArrow", 3878), __HIVE_P2_invoke(__HIVE_P2_temp3810_50, __HIVE_P2_temp3810_49, (__HIVE_P2_reserveArray(0, 3878), __HIVE_P2_ownArray([], 3878, "CONTROL_ARRAY")), 3878))) {
                (__HIVE_P2_temp3810_51 = this, __HIVE_P2_temp3810_52 = __HIVE_P2_get(__HIVE_P2_temp3810_51, "checkPatternErrors", 3880), __HIVE_P2_invoke(__HIVE_P2_temp3810_52, __HIVE_P2_temp3810_51, (__HIVE_P2_reserveArray(2, 3880), __HIVE_P2_ownArray([l, false], 3880, "CONTROL_ARRAY")), 3880));
                (__HIVE_P2_temp3810_53 = this, __HIVE_P2_temp3810_54 = __HIVE_P2_get(__HIVE_P2_temp3810_53, "checkYieldAwaitInDefaultParams", 3882), __HIVE_P2_invoke(__HIVE_P2_temp3810_54, __HIVE_P2_temp3810_53, (__HIVE_P2_reserveArray(0, 3882), __HIVE_P2_ownArray([], 3882, "CONTROL_ARRAY")), 3882));
                if (__HIVE_P2_binary(">", __HIVE_P2_get(this, "awaitIdentPos", 3885), 0, 3884)) {
                    __HIVE_P2_syntaxRefusal(3886);
                }
                (__HIVE_P2_temp3810_55 = this, __HIVE_P2_temp3810_56 = "yieldPos", __HIVE_P2_set(__HIVE_P2_temp3810_55, __HIVE_P2_temp3810_56, u, 3887));
                (__HIVE_P2_temp3810_58 = this, __HIVE_P2_temp3810_59 = "awaitPos", __HIVE_P2_set(__HIVE_P2_temp3810_58, __HIVE_P2_temp3810_59, f, 3889));
                (__HIVE_P2_temp3810_61 = this, __HIVE_P2_temp3810_62 = "awaitIdentPos", __HIVE_P2_set(__HIVE_P2_temp3810_61, __HIVE_P2_temp3810_62, d, 3891));
                return (__HIVE_P2_temp3810_64 = this, __HIVE_P2_temp3810_65 = __HIVE_P2_get(__HIVE_P2_temp3810_64, "parseSubscriptAsyncArrow", 3893), __HIVE_P2_invoke(__HIVE_P2_temp3810_65, __HIVE_P2_temp3810_64, (__HIVE_P2_reserveArray(4, 3893), __HIVE_P2_ownArray([t, i, g, n], 3893, "CONTROL_ARRAY")), 3893));
            }
            (__HIVE_P2_temp3810_66 = this, __HIVE_P2_temp3810_67 = __HIVE_P2_get(__HIVE_P2_temp3810_66, "checkExpressionErrors", 3895), __HIVE_P2_invoke(__HIVE_P2_temp3810_67, __HIVE_P2_temp3810_66, (__HIVE_P2_reserveArray(2, 3895), __HIVE_P2_ownArray([l, true], 3895, "CONTROL_ARRAY")), 3895));
            (__HIVE_P2_temp3810_68 = this, __HIVE_P2_temp3810_69 = "yieldPos", __HIVE_P2_set(__HIVE_P2_temp3810_68, __HIVE_P2_temp3810_69, u || __HIVE_P2_get(this, "yieldPos", 3899), 3897));
            (__HIVE_P2_temp3810_71 = this, __HIVE_P2_temp3810_72 = "awaitPos", __HIVE_P2_set(__HIVE_P2_temp3810_71, __HIVE_P2_temp3810_72, f || __HIVE_P2_get(this, "awaitPos", 3902), 3900));
            (__HIVE_P2_temp3810_74 = this, __HIVE_P2_temp3810_75 = "awaitIdentPos", __HIVE_P2_set(__HIVE_P2_temp3810_74, __HIVE_P2_temp3810_75, d || __HIVE_P2_get(this, "awaitIdentPos", 3905), 3903));
            var v = (__HIVE_P2_temp3810_77 = this, __HIVE_P2_temp3810_78 = __HIVE_P2_get(__HIVE_P2_temp3810_77, "startNodeAt", 3906), __HIVE_P2_invoke(__HIVE_P2_temp3810_78, __HIVE_P2_temp3810_77, (__HIVE_P2_reserveArray(2, 3906), __HIVE_P2_ownArray([t, i], 3906, "CONTROL_ARRAY")), 3906));
            (__HIVE_P2_temp3810_79 = v, __HIVE_P2_temp3810_80 = "callee", __HIVE_P2_set(__HIVE_P2_temp3810_79, __HIVE_P2_temp3810_80, e, 3908));
            (__HIVE_P2_temp3810_82 = v, __HIVE_P2_temp3810_83 = "arguments", __HIVE_P2_set(__HIVE_P2_temp3810_82, __HIVE_P2_temp3810_83, g, 3910));
            if (o) {
                (__HIVE_P2_temp3810_85 = v, __HIVE_P2_temp3810_86 = "optional", __HIVE_P2_set(__HIVE_P2_temp3810_85, __HIVE_P2_temp3810_86, h, 3912));
            }
            e = (__HIVE_P2_temp3810_88 = this, __HIVE_P2_temp3810_89 = __HIVE_P2_get(__HIVE_P2_temp3810_88, "finishNode", 3915), __HIVE_P2_invoke(__HIVE_P2_temp3810_89, __HIVE_P2_temp3810_88, (__HIVE_P2_reserveArray(2, 3915), __HIVE_P2_ownArray([v, "CallExpression"], 3915, "CONTROL_ARRAY")), 3915));
        }
        else if (__HIVE_P2_get(this, "type", 3917) === __HIVE_P2_get(m, "backQuote", 3918)) {
            if (h || a) {
                __HIVE_P2_syntaxRefusal(3919);
            }
            var x = (__HIVE_P2_temp3810_90 = this, __HIVE_P2_temp3810_91 = __HIVE_P2_get(__HIVE_P2_temp3810_90, "startNodeAt", 3920), __HIVE_P2_invoke(__HIVE_P2_temp3810_91, __HIVE_P2_temp3810_90, (__HIVE_P2_reserveArray(2, 3920), __HIVE_P2_ownArray([t, i], 3920, "CONTROL_ARRAY")), 3920));
            (__HIVE_P2_temp3810_92 = x, __HIVE_P2_temp3810_93 = "tag", __HIVE_P2_set(__HIVE_P2_temp3810_92, __HIVE_P2_temp3810_93, e, 3922));
            (__HIVE_P2_temp3810_95 = x, __HIVE_P2_temp3810_96 = "quasi", __HIVE_P2_set(__HIVE_P2_temp3810_95, __HIVE_P2_temp3810_96, (__HIVE_P2_temp3810_98 = this, __HIVE_P2_temp3810_99 = __HIVE_P2_get(__HIVE_P2_temp3810_98, "parseTemplate", 3926), __HIVE_P2_invoke(__HIVE_P2_temp3810_99, __HIVE_P2_temp3810_98, (__HIVE_P2_reserveArray(1, 3926), __HIVE_P2_ownArray([(__HIVE_P2_reserveObject(1, 3927), __HIVE_P2_ownObject({ isTagged: true }, 3927, 1, 8))], 3926, "CONTROL_ARRAY")), 3926)), 3924));
            e = (__HIVE_P2_temp3810_100 = this, __HIVE_P2_temp3810_101 = __HIVE_P2_get(__HIVE_P2_temp3810_100, "finishNode", 3930), __HIVE_P2_invoke(__HIVE_P2_temp3810_101, __HIVE_P2_temp3810_100, (__HIVE_P2_reserveArray(2, 3930), __HIVE_P2_ownArray([x, "TaggedTemplateExpression"], 3930, "CONTROL_ARRAY")), 3930));
        }
        return e;
    }, 113, 7, 0, 3810)), 3808));
    (__HIVE_P2_temp0_1292 = pe, __HIVE_P2_temp0_1293 = "parseExprAtom", __HIVE_P2_set(__HIVE_P2_temp0_1292, __HIVE_P2_temp0_1293, (__HIVE_P2_reserveFunction(3934), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp3934_0, __HIVE_P2_temp3934_1, __HIVE_P2_temp3934_2, __HIVE_P2_temp3934_3, __HIVE_P2_temp3934_4, __HIVE_P2_temp3934_5, __HIVE_P2_temp3934_6, __HIVE_P2_temp3934_7, __HIVE_P2_temp3934_8, __HIVE_P2_temp3934_9, __HIVE_P2_temp3934_10, __HIVE_P2_temp3934_11, __HIVE_P2_temp3934_12, __HIVE_P2_temp3934_13, __HIVE_P2_temp3934_14, __HIVE_P2_temp3934_15, __HIVE_P2_temp3934_16, __HIVE_P2_temp3934_17, __HIVE_P2_temp3934_18, __HIVE_P2_temp3934_19, __HIVE_P2_temp3934_20, __HIVE_P2_temp3934_21, __HIVE_P2_temp3934_22, __HIVE_P2_temp3934_23, __HIVE_P2_temp3934_24, __HIVE_P2_temp3934_25, __HIVE_P2_temp3934_26, __HIVE_P2_temp3934_27, __HIVE_P2_temp3934_28, __HIVE_P2_temp3934_29, __HIVE_P2_temp3934_30, __HIVE_P2_temp3934_31, __HIVE_P2_temp3934_32, __HIVE_P2_temp3934_33, __HIVE_P2_temp3934_34, __HIVE_P2_temp3934_35, __HIVE_P2_temp3934_36, __HIVE_P2_temp3934_37, __HIVE_P2_temp3934_38, __HIVE_P2_temp3934_39, __HIVE_P2_temp3934_40, __HIVE_P2_temp3934_41, __HIVE_P2_temp3934_42, __HIVE_P2_temp3934_43, __HIVE_P2_temp3934_44, __HIVE_P2_temp3934_45, __HIVE_P2_temp3934_46, __HIVE_P2_temp3934_47, __HIVE_P2_temp3934_48, __HIVE_P2_temp3934_49, __HIVE_P2_temp3934_50, __HIVE_P2_temp3934_51, __HIVE_P2_temp3934_52, __HIVE_P2_temp3934_53, __HIVE_P2_temp3934_54, __HIVE_P2_temp3934_55, __HIVE_P2_temp3934_56, __HIVE_P2_temp3934_57, __HIVE_P2_temp3934_58, __HIVE_P2_temp3934_59, __HIVE_P2_temp3934_60, __HIVE_P2_temp3934_61, __HIVE_P2_temp3934_62, __HIVE_P2_temp3934_63, __HIVE_P2_temp3934_64, __HIVE_P2_temp3934_65, __HIVE_P2_temp3934_66, __HIVE_P2_temp3934_67, __HIVE_P2_temp3934_68, __HIVE_P2_temp3934_69, __HIVE_P2_temp3934_70, __HIVE_P2_temp3934_71, __HIVE_P2_temp3934_72, __HIVE_P2_temp3934_73, __HIVE_P2_temp3934_74, __HIVE_P2_temp3934_75, __HIVE_P2_temp3934_76, __HIVE_P2_temp3934_77, __HIVE_P2_temp3934_78, __HIVE_P2_temp3934_79, __HIVE_P2_temp3934_80, __HIVE_P2_temp3934_81, __HIVE_P2_temp3934_82, __HIVE_P2_temp3934_83, __HIVE_P2_temp3934_84, __HIVE_P2_temp3934_85, __HIVE_P2_temp3934_86, __HIVE_P2_temp3934_87, __HIVE_P2_temp3934_88, __HIVE_P2_temp3934_89, __HIVE_P2_temp3934_90, __HIVE_P2_temp3934_91, __HIVE_P2_temp3934_92, __HIVE_P2_temp3934_93, __HIVE_P2_temp3934_94, __HIVE_P2_temp3934_95, __HIVE_P2_temp3934_96, __HIVE_P2_temp3934_97, __HIVE_P2_temp3934_98, __HIVE_P2_temp3934_99, __HIVE_P2_temp3934_100, __HIVE_P2_temp3934_101, __HIVE_P2_temp3934_102, __HIVE_P2_temp3934_103, __HIVE_P2_temp3934_104, __HIVE_P2_temp3934_105, __HIVE_P2_temp3934_106, __HIVE_P2_temp3934_107, __HIVE_P2_temp3934_108, __HIVE_P2_temp3934_109;
        if (__HIVE_P2_get(this, "type", 3935) === __HIVE_P2_get(m, "slash", 3936)) {
            (__HIVE_P2_temp3934_0 = this, __HIVE_P2_temp3934_1 = __HIVE_P2_get(__HIVE_P2_temp3934_0, "readRegexp", 3937), __HIVE_P2_invoke(__HIVE_P2_temp3934_1, __HIVE_P2_temp3934_0, (__HIVE_P2_reserveArray(0, 3937), __HIVE_P2_ownArray([], 3937, "CONTROL_ARRAY")), 3937));
        }
        var s, r = __HIVE_P2_get(this, "potentialArrowAt", 3939) === __HIVE_P2_get(this, "start", 3940);
        switch (__HIVE_P2_get(this, "type", 3941)) {
            case __HIVE_P2_get(m, "_super", 3942):
                if (!__HIVE_P2_get(this, "allowSuper", 3943)) {
                    __HIVE_P2_syntaxRefusal(3944);
                }
                s = (__HIVE_P2_temp3934_2 = this, __HIVE_P2_temp3934_3 = __HIVE_P2_get(__HIVE_P2_temp3934_2, "startNode", 3946), __HIVE_P2_invoke(__HIVE_P2_temp3934_3, __HIVE_P2_temp3934_2, (__HIVE_P2_reserveArray(0, 3946), __HIVE_P2_ownArray([], 3946, "CONTROL_ARRAY")), 3946));
                (__HIVE_P2_temp3934_4 = this, __HIVE_P2_temp3934_5 = __HIVE_P2_get(__HIVE_P2_temp3934_4, "next", 3948), __HIVE_P2_invoke(__HIVE_P2_temp3934_5, __HIVE_P2_temp3934_4, (__HIVE_P2_reserveArray(0, 3948), __HIVE_P2_ownArray([], 3948, "CONTROL_ARRAY")), 3948));
                if (__HIVE_P2_get(this, "type", 3950) === __HIVE_P2_get(m, "parenL", 3951) && !__HIVE_P2_get(this, "allowDirectSuper", 3952)) {
                    __HIVE_P2_syntaxRefusal(3953);
                }
                if (__HIVE_P2_get(this, "type", 3954) !== __HIVE_P2_get(m, "dot", 3955) && __HIVE_P2_get(this, "type", 3956) !== __HIVE_P2_get(m, "bracketL", 3957) && __HIVE_P2_get(this, "type", 3958) !== __HIVE_P2_get(m, "parenL", 3959)) {
                    __HIVE_P2_syntaxRefusal(3960);
                }
                return (__HIVE_P2_temp3934_6 = this, __HIVE_P2_temp3934_7 = __HIVE_P2_get(__HIVE_P2_temp3934_6, "finishNode", 3961), __HIVE_P2_invoke(__HIVE_P2_temp3934_7, __HIVE_P2_temp3934_6, (__HIVE_P2_reserveArray(2, 3961), __HIVE_P2_ownArray([s, "Super"], 3961, "CONTROL_ARRAY")), 3961));
            case __HIVE_P2_get(m, "_this", 3963):
                s = (__HIVE_P2_temp3934_8 = this, __HIVE_P2_temp3934_9 = __HIVE_P2_get(__HIVE_P2_temp3934_8, "startNode", 3965), __HIVE_P2_invoke(__HIVE_P2_temp3934_9, __HIVE_P2_temp3934_8, (__HIVE_P2_reserveArray(0, 3965), __HIVE_P2_ownArray([], 3965, "CONTROL_ARRAY")), 3965));
                (__HIVE_P2_temp3934_10 = this, __HIVE_P2_temp3934_11 = __HIVE_P2_get(__HIVE_P2_temp3934_10, "next", 3967), __HIVE_P2_invoke(__HIVE_P2_temp3934_11, __HIVE_P2_temp3934_10, (__HIVE_P2_reserveArray(0, 3967), __HIVE_P2_ownArray([], 3967, "CONTROL_ARRAY")), 3967));
                return (__HIVE_P2_temp3934_12 = this, __HIVE_P2_temp3934_13 = __HIVE_P2_get(__HIVE_P2_temp3934_12, "finishNode", 3969), __HIVE_P2_invoke(__HIVE_P2_temp3934_13, __HIVE_P2_temp3934_12, (__HIVE_P2_reserveArray(2, 3969), __HIVE_P2_ownArray([s, "ThisExpression"], 3969, "CONTROL_ARRAY")), 3969));
            case __HIVE_P2_get(m, "name", 3971):
                var a = __HIVE_P2_get(this, "start", 3972), n = __HIVE_P2_get(this, "startLoc", 3973), o = __HIVE_P2_get(this, "containsEsc", 3974);
                var h = (__HIVE_P2_temp3934_14 = this, __HIVE_P2_temp3934_15 = __HIVE_P2_get(__HIVE_P2_temp3934_14, "parseIdent", 3975), __HIVE_P2_invoke(__HIVE_P2_temp3934_15, __HIVE_P2_temp3934_14, (__HIVE_P2_reserveArray(1, 3975), __HIVE_P2_ownArray([false], 3975, "CONTROL_ARRAY")), 3975));
                if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 3979), "ecmaVersion", 3978), 8, 3977) && !o && __HIVE_P2_get(h, "name", 3980) === "async" && !(__HIVE_P2_temp3934_16 = this, __HIVE_P2_temp3934_17 = __HIVE_P2_get(__HIVE_P2_temp3934_16, "canInsertSemicolon", 3981), __HIVE_P2_invoke(__HIVE_P2_temp3934_17, __HIVE_P2_temp3934_16, (__HIVE_P2_reserveArray(0, 3981), __HIVE_P2_ownArray([], 3981, "CONTROL_ARRAY")), 3981)) && (__HIVE_P2_temp3934_18 = this, __HIVE_P2_temp3934_19 = __HIVE_P2_get(__HIVE_P2_temp3934_18, "eat", 3983), __HIVE_P2_invoke(__HIVE_P2_temp3934_19, __HIVE_P2_temp3934_18, (__HIVE_P2_reserveArray(1, 3983), __HIVE_P2_ownArray([__HIVE_P2_get(m, "_function", 3984)], 3983, "CONTROL_ARRAY")), 3983))) {
                    (__HIVE_P2_temp3934_20 = this, __HIVE_P2_temp3934_21 = __HIVE_P2_get(__HIVE_P2_temp3934_20, "overrideContext", 3986), __HIVE_P2_invoke(__HIVE_P2_temp3934_21, __HIVE_P2_temp3934_20, (__HIVE_P2_reserveArray(1, 3986), __HIVE_P2_ownArray([__HIVE_P2_get(oe, "f_expr", 3987)], 3986, "CONTROL_ARRAY")), 3986));
                    return (__HIVE_P2_temp3934_24 = this, __HIVE_P2_temp3934_25 = __HIVE_P2_get(__HIVE_P2_temp3934_24, "parseFunction", 3989), __HIVE_P2_invoke(__HIVE_P2_temp3934_25, __HIVE_P2_temp3934_24, (__HIVE_P2_reserveArray(5, 3989), __HIVE_P2_ownArray([(__HIVE_P2_temp3934_22 = this, __HIVE_P2_temp3934_23 = __HIVE_P2_get(__HIVE_P2_temp3934_22, "startNodeAt", 3990), __HIVE_P2_invoke(__HIVE_P2_temp3934_23, __HIVE_P2_temp3934_22, (__HIVE_P2_reserveArray(2, 3990), __HIVE_P2_ownArray([a, n], 3990, "CONTROL_ARRAY")), 3990)), 0, false, true, t], 3989, "CONTROL_ARRAY")), 3989));
                }
                if (r && !(__HIVE_P2_temp3934_26 = this, __HIVE_P2_temp3934_27 = __HIVE_P2_get(__HIVE_P2_temp3934_26, "canInsertSemicolon", 3993), __HIVE_P2_invoke(__HIVE_P2_temp3934_27, __HIVE_P2_temp3934_26, (__HIVE_P2_reserveArray(0, 3993), __HIVE_P2_ownArray([], 3993, "CONTROL_ARRAY")), 3993))) {
                    if ((__HIVE_P2_temp3934_28 = this, __HIVE_P2_temp3934_29 = __HIVE_P2_get(__HIVE_P2_temp3934_28, "eat", 3995), __HIVE_P2_invoke(__HIVE_P2_temp3934_29, __HIVE_P2_temp3934_28, (__HIVE_P2_reserveArray(1, 3995), __HIVE_P2_ownArray([__HIVE_P2_get(m, "arrow", 3996)], 3995, "CONTROL_ARRAY")), 3995))) {
                        return (__HIVE_P2_temp3934_34 = this, __HIVE_P2_temp3934_35 = __HIVE_P2_get(__HIVE_P2_temp3934_34, "parseArrowExpression", 3998), __HIVE_P2_invoke(__HIVE_P2_temp3934_35, __HIVE_P2_temp3934_34, (__HIVE_P2_reserveArray(4, 3998), __HIVE_P2_ownArray([(__HIVE_P2_temp3934_30 = this, __HIVE_P2_temp3934_31 = __HIVE_P2_get(__HIVE_P2_temp3934_30, "startNodeAt", 3999), __HIVE_P2_invoke(__HIVE_P2_temp3934_31, __HIVE_P2_temp3934_30, (__HIVE_P2_reserveArray(2, 3999), __HIVE_P2_ownArray([a, n], 3999, "CONTROL_ARRAY")), 3999)), (__HIVE_P2_temp3934_32 = 0, __HIVE_P2_temp3934_33 = h, __HIVE_P2_temp3934_32 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp3934_32, __HIVE_P2_temp3934_33, 4001), __HIVE_P2_checkArrayDepth(__HIVE_P2_temp3934_32, 4001), __HIVE_P2_reserveArray(1, 4001, 1), __HIVE_P2_ownArray([__HIVE_P2_temp3934_33], 4001, "ARRAY", __HIVE_P2_temp3934_32)), false, t], 3998, "CONTROL_ARRAY")), 3998));
                    }
                    if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4005), "ecmaVersion", 4004), 8, 4003) && __HIVE_P2_get(h, "name", 4006) === "async" && __HIVE_P2_get(this, "type", 4007) === __HIVE_P2_get(m, "name", 4008) && !o && (!__HIVE_P2_get(this, "potentialArrowInForAwait", 4009) || __HIVE_P2_get(this, "value", 4010) !== "of" || __HIVE_P2_get(this, "containsEsc", 4011))) {
                        h = (__HIVE_P2_temp3934_36 = this, __HIVE_P2_temp3934_37 = __HIVE_P2_get(__HIVE_P2_temp3934_36, "parseIdent", 4013), __HIVE_P2_invoke(__HIVE_P2_temp3934_37, __HIVE_P2_temp3934_36, (__HIVE_P2_reserveArray(1, 4013), __HIVE_P2_ownArray([false], 4013, "CONTROL_ARRAY")), 4013));
                        if ((__HIVE_P2_temp3934_38 = this, __HIVE_P2_temp3934_39 = __HIVE_P2_get(__HIVE_P2_temp3934_38, "canInsertSemicolon", 4015), __HIVE_P2_invoke(__HIVE_P2_temp3934_39, __HIVE_P2_temp3934_38, (__HIVE_P2_reserveArray(0, 4015), __HIVE_P2_ownArray([], 4015, "CONTROL_ARRAY")), 4015)) || !(__HIVE_P2_temp3934_40 = this, __HIVE_P2_temp3934_41 = __HIVE_P2_get(__HIVE_P2_temp3934_40, "eat", 4017), __HIVE_P2_invoke(__HIVE_P2_temp3934_41, __HIVE_P2_temp3934_40, (__HIVE_P2_reserveArray(1, 4017), __HIVE_P2_ownArray([__HIVE_P2_get(m, "arrow", 4018)], 4017, "CONTROL_ARRAY")), 4017))) {
                            __HIVE_P2_syntaxRefusal(4020);
                        }
                        return (__HIVE_P2_temp3934_46 = this, __HIVE_P2_temp3934_47 = __HIVE_P2_get(__HIVE_P2_temp3934_46, "parseArrowExpression", 4021), __HIVE_P2_invoke(__HIVE_P2_temp3934_47, __HIVE_P2_temp3934_46, (__HIVE_P2_reserveArray(4, 4021), __HIVE_P2_ownArray([(__HIVE_P2_temp3934_42 = this, __HIVE_P2_temp3934_43 = __HIVE_P2_get(__HIVE_P2_temp3934_42, "startNodeAt", 4022), __HIVE_P2_invoke(__HIVE_P2_temp3934_43, __HIVE_P2_temp3934_42, (__HIVE_P2_reserveArray(2, 4022), __HIVE_P2_ownArray([a, n], 4022, "CONTROL_ARRAY")), 4022)), (__HIVE_P2_temp3934_44 = 0, __HIVE_P2_temp3934_45 = h, __HIVE_P2_temp3934_44 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp3934_44, __HIVE_P2_temp3934_45, 4024), __HIVE_P2_checkArrayDepth(__HIVE_P2_temp3934_44, 4024), __HIVE_P2_reserveArray(1, 4024, 1), __HIVE_P2_ownArray([__HIVE_P2_temp3934_45], 4024, "ARRAY", __HIVE_P2_temp3934_44)), true, t], 4021, "CONTROL_ARRAY")), 4021));
                    }
                }
                return h;
            case __HIVE_P2_get(m, "regexp", 4026):
                var p = __HIVE_P2_get(this, "value", 4027);
                s = (__HIVE_P2_temp3934_48 = this, __HIVE_P2_temp3934_49 = __HIVE_P2_get(__HIVE_P2_temp3934_48, "parseLiteral", 4029), __HIVE_P2_invoke(__HIVE_P2_temp3934_49, __HIVE_P2_temp3934_48, (__HIVE_P2_reserveArray(1, 4029), __HIVE_P2_ownArray([__HIVE_P2_get(p, "value", 4030)], 4029, "CONTROL_ARRAY")), 4029));
                (__HIVE_P2_temp3934_50 = s, __HIVE_P2_temp3934_51 = "regex", __HIVE_P2_set(__HIVE_P2_temp3934_50, __HIVE_P2_temp3934_51, (__HIVE_P2_reserveObject(2, 4034), __HIVE_P2_ownObject({ pattern: __HIVE_P2_get(p, "pattern", 4035), flags: __HIVE_P2_get(p, "flags", 4036) }, 4034, 2, 12)), 4032));
                return s;
            case __HIVE_P2_get(m, "num", 4037):
            case __HIVE_P2_get(m, "string", 4038): return (__HIVE_P2_temp3934_53 = this, __HIVE_P2_temp3934_54 = __HIVE_P2_get(__HIVE_P2_temp3934_53, "parseLiteral", 4039), __HIVE_P2_invoke(__HIVE_P2_temp3934_54, __HIVE_P2_temp3934_53, (__HIVE_P2_reserveArray(1, 4039), __HIVE_P2_ownArray([__HIVE_P2_get(this, "value", 4040)], 4039, "CONTROL_ARRAY")), 4039));
            case __HIVE_P2_get(m, "_null", 4042):
            case __HIVE_P2_get(m, "_true", 4043):
            case __HIVE_P2_get(m, "_false", 4044):
                s = (__HIVE_P2_temp3934_55 = this, __HIVE_P2_temp3934_56 = __HIVE_P2_get(__HIVE_P2_temp3934_55, "startNode", 4046), __HIVE_P2_invoke(__HIVE_P2_temp3934_56, __HIVE_P2_temp3934_55, (__HIVE_P2_reserveArray(0, 4046), __HIVE_P2_ownArray([], 4046, "CONTROL_ARRAY")), 4046));
                (__HIVE_P2_temp3934_57 = s, __HIVE_P2_temp3934_58 = "value", __HIVE_P2_set(__HIVE_P2_temp3934_57, __HIVE_P2_temp3934_58, __HIVE_P2_get(this, "type", 4050) === __HIVE_P2_get(m, "_null", 4051) ? null : __HIVE_P2_get(this, "type", 4052) === __HIVE_P2_get(m, "_true", 4053), 4048));
                (__HIVE_P2_temp3934_60 = s, __HIVE_P2_temp3934_61 = "raw", __HIVE_P2_set(__HIVE_P2_temp3934_60, __HIVE_P2_temp3934_61, __HIVE_P2_get(__HIVE_P2_get(this, "type", 4057), "keyword", 4056), 4054));
                (__HIVE_P2_temp3934_63 = this, __HIVE_P2_temp3934_64 = __HIVE_P2_get(__HIVE_P2_temp3934_63, "next", 4058), __HIVE_P2_invoke(__HIVE_P2_temp3934_64, __HIVE_P2_temp3934_63, (__HIVE_P2_reserveArray(0, 4058), __HIVE_P2_ownArray([], 4058, "CONTROL_ARRAY")), 4058));
                return (__HIVE_P2_temp3934_65 = this, __HIVE_P2_temp3934_66 = __HIVE_P2_get(__HIVE_P2_temp3934_65, "finishNode", 4060), __HIVE_P2_invoke(__HIVE_P2_temp3934_66, __HIVE_P2_temp3934_65, (__HIVE_P2_reserveArray(2, 4060), __HIVE_P2_ownArray([s, "Literal"], 4060, "CONTROL_ARRAY")), 4060));
            case __HIVE_P2_get(m, "parenL", 4062):
                var c = __HIVE_P2_get(this, "start", 4063), l = (__HIVE_P2_temp3934_67 = this, __HIVE_P2_temp3934_68 = __HIVE_P2_get(__HIVE_P2_temp3934_67, "parseParenAndDistinguishExpression", 4064), __HIVE_P2_invoke(__HIVE_P2_temp3934_68, __HIVE_P2_temp3934_67, (__HIVE_P2_reserveArray(2, 4064), __HIVE_P2_ownArray([r, t], 4064, "CONTROL_ARRAY")), 4064));
                if (e) {
                    if (__HIVE_P2_binary("<", __HIVE_P2_get(e, "parenthesizedAssign", 4067), 0, 4066) && !(__HIVE_P2_temp3934_69 = this, __HIVE_P2_temp3934_70 = __HIVE_P2_get(__HIVE_P2_temp3934_69, "isSimpleAssignTarget", 4068), __HIVE_P2_invoke(__HIVE_P2_temp3934_70, __HIVE_P2_temp3934_69, (__HIVE_P2_reserveArray(1, 4068), __HIVE_P2_ownArray([l], 4068, "CONTROL_ARRAY")), 4068))) {
                        (__HIVE_P2_temp3934_71 = e, __HIVE_P2_temp3934_72 = "parenthesizedAssign", __HIVE_P2_set(__HIVE_P2_temp3934_71, __HIVE_P2_temp3934_72, c, 4070));
                    }
                    if (__HIVE_P2_binary("<", __HIVE_P2_get(e, "parenthesizedBind", 4073), 0, 4072)) {
                        (__HIVE_P2_temp3934_74 = e, __HIVE_P2_temp3934_75 = "parenthesizedBind", __HIVE_P2_set(__HIVE_P2_temp3934_74, __HIVE_P2_temp3934_75, c, 4074));
                    }
                }
                return l;
            case __HIVE_P2_get(m, "bracketL", 4076):
                s = (__HIVE_P2_temp3934_77 = this, __HIVE_P2_temp3934_78 = __HIVE_P2_get(__HIVE_P2_temp3934_77, "startNode", 4078), __HIVE_P2_invoke(__HIVE_P2_temp3934_78, __HIVE_P2_temp3934_77, (__HIVE_P2_reserveArray(0, 4078), __HIVE_P2_ownArray([], 4078, "CONTROL_ARRAY")), 4078));
                (__HIVE_P2_temp3934_79 = this, __HIVE_P2_temp3934_80 = __HIVE_P2_get(__HIVE_P2_temp3934_79, "next", 4080), __HIVE_P2_invoke(__HIVE_P2_temp3934_80, __HIVE_P2_temp3934_79, (__HIVE_P2_reserveArray(0, 4080), __HIVE_P2_ownArray([], 4080, "CONTROL_ARRAY")), 4080));
                (__HIVE_P2_temp3934_81 = s, __HIVE_P2_temp3934_82 = "elements", __HIVE_P2_set(__HIVE_P2_temp3934_81, __HIVE_P2_temp3934_82, (__HIVE_P2_temp3934_84 = this, __HIVE_P2_temp3934_85 = __HIVE_P2_get(__HIVE_P2_temp3934_84, "parseExprList", 4084), __HIVE_P2_invoke(__HIVE_P2_temp3934_85, __HIVE_P2_temp3934_84, (__HIVE_P2_reserveArray(4, 4084), __HIVE_P2_ownArray([__HIVE_P2_get(m, "bracketR", 4085), true, true, e], 4084, "CONTROL_ARRAY")), 4084)), 4082));
                return (__HIVE_P2_temp3934_86 = this, __HIVE_P2_temp3934_87 = __HIVE_P2_get(__HIVE_P2_temp3934_86, "finishNode", 4087), __HIVE_P2_invoke(__HIVE_P2_temp3934_87, __HIVE_P2_temp3934_86, (__HIVE_P2_reserveArray(2, 4087), __HIVE_P2_ownArray([s, "ArrayExpression"], 4087, "CONTROL_ARRAY")), 4087));
            case __HIVE_P2_get(m, "braceL", 4089):
                (__HIVE_P2_temp3934_88 = this, __HIVE_P2_temp3934_89 = __HIVE_P2_get(__HIVE_P2_temp3934_88, "overrideContext", 4090), __HIVE_P2_invoke(__HIVE_P2_temp3934_89, __HIVE_P2_temp3934_88, (__HIVE_P2_reserveArray(1, 4090), __HIVE_P2_ownArray([__HIVE_P2_get(oe, "b_expr", 4091)], 4090, "CONTROL_ARRAY")), 4090));
                return (__HIVE_P2_temp3934_90 = this, __HIVE_P2_temp3934_91 = __HIVE_P2_get(__HIVE_P2_temp3934_90, "parseObj", 4093), __HIVE_P2_invoke(__HIVE_P2_temp3934_91, __HIVE_P2_temp3934_90, (__HIVE_P2_reserveArray(2, 4093), __HIVE_P2_ownArray([false, e], 4093, "CONTROL_ARRAY")), 4093));
            case __HIVE_P2_get(m, "_function", 4095):
                s = (__HIVE_P2_temp3934_92 = this, __HIVE_P2_temp3934_93 = __HIVE_P2_get(__HIVE_P2_temp3934_92, "startNode", 4097), __HIVE_P2_invoke(__HIVE_P2_temp3934_93, __HIVE_P2_temp3934_92, (__HIVE_P2_reserveArray(0, 4097), __HIVE_P2_ownArray([], 4097, "CONTROL_ARRAY")), 4097));
                (__HIVE_P2_temp3934_94 = this, __HIVE_P2_temp3934_95 = __HIVE_P2_get(__HIVE_P2_temp3934_94, "next", 4099), __HIVE_P2_invoke(__HIVE_P2_temp3934_95, __HIVE_P2_temp3934_94, (__HIVE_P2_reserveArray(0, 4099), __HIVE_P2_ownArray([], 4099, "CONTROL_ARRAY")), 4099));
                return (__HIVE_P2_temp3934_96 = this, __HIVE_P2_temp3934_97 = __HIVE_P2_get(__HIVE_P2_temp3934_96, "parseFunction", 4101), __HIVE_P2_invoke(__HIVE_P2_temp3934_97, __HIVE_P2_temp3934_96, (__HIVE_P2_reserveArray(2, 4101), __HIVE_P2_ownArray([s, 0], 4101, "CONTROL_ARRAY")), 4101));
            case __HIVE_P2_get(m, "_class", 4103): return (__HIVE_P2_temp3934_100 = this, __HIVE_P2_temp3934_101 = __HIVE_P2_get(__HIVE_P2_temp3934_100, "parseClass", 4104), __HIVE_P2_invoke(__HIVE_P2_temp3934_101, __HIVE_P2_temp3934_100, (__HIVE_P2_reserveArray(2, 4104), __HIVE_P2_ownArray([(__HIVE_P2_temp3934_98 = this, __HIVE_P2_temp3934_99 = __HIVE_P2_get(__HIVE_P2_temp3934_98, "startNode", 4105), __HIVE_P2_invoke(__HIVE_P2_temp3934_99, __HIVE_P2_temp3934_98, (__HIVE_P2_reserveArray(0, 4105), __HIVE_P2_ownArray([], 4105, "CONTROL_ARRAY")), 4105)), false], 4104, "CONTROL_ARRAY")), 4104));
            case __HIVE_P2_get(m, "_new", 4108): return (__HIVE_P2_temp3934_102 = this, __HIVE_P2_temp3934_103 = __HIVE_P2_get(__HIVE_P2_temp3934_102, "parseNew", 4109), __HIVE_P2_invoke(__HIVE_P2_temp3934_103, __HIVE_P2_temp3934_102, (__HIVE_P2_reserveArray(0, 4109), __HIVE_P2_ownArray([], 4109, "CONTROL_ARRAY")), 4109));
            case __HIVE_P2_get(m, "backQuote", 4111): return (__HIVE_P2_temp3934_104 = this, __HIVE_P2_temp3934_105 = __HIVE_P2_get(__HIVE_P2_temp3934_104, "parseTemplate", 4112), __HIVE_P2_invoke(__HIVE_P2_temp3934_105, __HIVE_P2_temp3934_104, (__HIVE_P2_reserveArray(0, 4112), __HIVE_P2_ownArray([], 4112, "CONTROL_ARRAY")), 4112));
            case __HIVE_P2_get(m, "_import", 4114): if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4117), "ecmaVersion", 4116), 11, 4115)) {
                return (__HIVE_P2_temp3934_106 = this, __HIVE_P2_temp3934_107 = __HIVE_P2_get(__HIVE_P2_temp3934_106, "parseExprImport", 4118), __HIVE_P2_invoke(__HIVE_P2_temp3934_107, __HIVE_P2_temp3934_106, (__HIVE_P2_reserveArray(1, 4118), __HIVE_P2_ownArray([i], 4118, "CONTROL_ARRAY")), 4118));
            }
            else {
                return __HIVE_P2_syntaxRefusal(4120);
            }
            default: return (__HIVE_P2_temp3934_108 = this, __HIVE_P2_temp3934_109 = __HIVE_P2_get(__HIVE_P2_temp3934_108, "parseExprAtomDefault", 4121), __HIVE_P2_invoke(__HIVE_P2_temp3934_109, __HIVE_P2_temp3934_108, (__HIVE_P2_reserveArray(0, 4121), __HIVE_P2_ownArray([], 4121, "CONTROL_ARRAY")), 4121));
        }
    }, 119, 3, 0, 3934)), 3932));
    (__HIVE_P2_temp0_1295 = pe, __HIVE_P2_temp0_1296 = "parseExprAtomDefault", __HIVE_P2_set(__HIVE_P2_temp0_1295, __HIVE_P2_temp0_1296, (__HIVE_P2_reserveFunction(4125), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_syntaxRefusal(4126);
    }, 0, 0, 0, 4125)), 4123));
    (__HIVE_P2_temp0_1298 = pe, __HIVE_P2_temp0_1299 = "parseExprImport", __HIVE_P2_set(__HIVE_P2_temp0_1298, __HIVE_P2_temp0_1299, (__HIVE_P2_reserveFunction(4129), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp4129_0, __HIVE_P2_temp4129_1, __HIVE_P2_temp4129_2, __HIVE_P2_temp4129_3, __HIVE_P2_temp4129_4, __HIVE_P2_temp4129_5, __HIVE_P2_temp4129_6, __HIVE_P2_temp4129_7, __HIVE_P2_temp4129_8, __HIVE_P2_temp4129_9, __HIVE_P2_temp4129_10, __HIVE_P2_temp4129_11, __HIVE_P2_temp4129_12, __HIVE_P2_temp4129_13, __HIVE_P2_temp4129_14, __HIVE_P2_temp4129_15, __HIVE_P2_temp4129_16, __HIVE_P2_temp4129_17;
        var t = (__HIVE_P2_temp4129_0 = this, __HIVE_P2_temp4129_1 = __HIVE_P2_get(__HIVE_P2_temp4129_0, "startNode", 4130), __HIVE_P2_invoke(__HIVE_P2_temp4129_1, __HIVE_P2_temp4129_0, (__HIVE_P2_reserveArray(0, 4130), __HIVE_P2_ownArray([], 4130, "CONTROL_ARRAY")), 4130));
        if (__HIVE_P2_get(this, "containsEsc", 4132)) {
            __HIVE_P2_syntaxRefusal(4133);
        }
        (__HIVE_P2_temp4129_2 = this, __HIVE_P2_temp4129_3 = __HIVE_P2_get(__HIVE_P2_temp4129_2, "next", 4134), __HIVE_P2_invoke(__HIVE_P2_temp4129_3, __HIVE_P2_temp4129_2, (__HIVE_P2_reserveArray(0, 4134), __HIVE_P2_ownArray([], 4134, "CONTROL_ARRAY")), 4134));
        if (__HIVE_P2_get(this, "type", 4136) === __HIVE_P2_get(m, "parenL", 4137) && !e) {
            return (__HIVE_P2_temp4129_4 = this, __HIVE_P2_temp4129_5 = __HIVE_P2_get(__HIVE_P2_temp4129_4, "parseDynamicImport", 4138), __HIVE_P2_invoke(__HIVE_P2_temp4129_5, __HIVE_P2_temp4129_4, (__HIVE_P2_reserveArray(1, 4138), __HIVE_P2_ownArray([t], 4138, "CONTROL_ARRAY")), 4138));
        }
        else if (__HIVE_P2_get(this, "type", 4140) === __HIVE_P2_get(m, "dot", 4141)) {
            var i = (__HIVE_P2_temp4129_6 = this, __HIVE_P2_temp4129_7 = __HIVE_P2_get(__HIVE_P2_temp4129_6, "startNodeAt", 4142), __HIVE_P2_invoke(__HIVE_P2_temp4129_7, __HIVE_P2_temp4129_6, (__HIVE_P2_reserveArray(2, 4142), __HIVE_P2_ownArray([__HIVE_P2_get(t, "start", 4143), __HIVE_P2_get(t, "loc", 4144) && __HIVE_P2_get(__HIVE_P2_get(t, "loc", 4146), "start", 4145)], 4142, "CONTROL_ARRAY")), 4142));
            (__HIVE_P2_temp4129_8 = i, __HIVE_P2_temp4129_9 = "name", __HIVE_P2_set(__HIVE_P2_temp4129_8, __HIVE_P2_temp4129_9, "import", 4148));
            (__HIVE_P2_temp4129_11 = t, __HIVE_P2_temp4129_12 = "meta", __HIVE_P2_set(__HIVE_P2_temp4129_11, __HIVE_P2_temp4129_12, (__HIVE_P2_temp4129_14 = this, __HIVE_P2_temp4129_15 = __HIVE_P2_get(__HIVE_P2_temp4129_14, "finishNode", 4152), __HIVE_P2_invoke(__HIVE_P2_temp4129_15, __HIVE_P2_temp4129_14, (__HIVE_P2_reserveArray(2, 4152), __HIVE_P2_ownArray([i, "Identifier"], 4152, "CONTROL_ARRAY")), 4152)), 4150));
            return (__HIVE_P2_temp4129_16 = this, __HIVE_P2_temp4129_17 = __HIVE_P2_get(__HIVE_P2_temp4129_16, "parseImportMeta", 4154), __HIVE_P2_invoke(__HIVE_P2_temp4129_17, __HIVE_P2_temp4129_16, (__HIVE_P2_reserveArray(1, 4154), __HIVE_P2_ownArray([t], 4154, "CONTROL_ARRAY")), 4154));
        }
        else {
            __HIVE_P2_syntaxRefusal(4156);
        }
    }, 20, 1, 0, 4129)), 4127));
    (__HIVE_P2_temp0_1301 = pe, __HIVE_P2_temp0_1302 = "parseDynamicImport", __HIVE_P2_set(__HIVE_P2_temp0_1301, __HIVE_P2_temp0_1302, (__HIVE_P2_reserveFunction(4159), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp4159_0, __HIVE_P2_temp4159_1, __HIVE_P2_temp4159_2, __HIVE_P2_temp4159_3, __HIVE_P2_temp4159_4, __HIVE_P2_temp4159_5, __HIVE_P2_temp4159_6, __HIVE_P2_temp4159_7, __HIVE_P2_temp4159_8, __HIVE_P2_temp4159_9, __HIVE_P2_temp4159_10, __HIVE_P2_temp4159_11, __HIVE_P2_temp4159_12, __HIVE_P2_temp4159_13, __HIVE_P2_temp4159_14, __HIVE_P2_temp4159_15, __HIVE_P2_temp4159_16, __HIVE_P2_temp4159_17, __HIVE_P2_temp4159_18, __HIVE_P2_temp4159_19, __HIVE_P2_temp4159_20, __HIVE_P2_temp4159_21, __HIVE_P2_temp4159_22, __HIVE_P2_temp4159_23, __HIVE_P2_temp4159_24, __HIVE_P2_temp4159_25, __HIVE_P2_temp4159_26, __HIVE_P2_temp4159_27, __HIVE_P2_temp4159_28, __HIVE_P2_temp4159_29, __HIVE_P2_temp4159_30, __HIVE_P2_temp4159_31, __HIVE_P2_temp4159_32, __HIVE_P2_temp4159_33, __HIVE_P2_temp4159_34, __HIVE_P2_temp4159_35, __HIVE_P2_temp4159_36, __HIVE_P2_temp4159_37;
        (__HIVE_P2_temp4159_0 = this, __HIVE_P2_temp4159_1 = __HIVE_P2_get(__HIVE_P2_temp4159_0, "next", 4160), __HIVE_P2_invoke(__HIVE_P2_temp4159_1, __HIVE_P2_temp4159_0, (__HIVE_P2_reserveArray(0, 4160), __HIVE_P2_ownArray([], 4160, "CONTROL_ARRAY")), 4160));
        (__HIVE_P2_temp4159_2 = e, __HIVE_P2_temp4159_3 = "source", __HIVE_P2_set(__HIVE_P2_temp4159_2, __HIVE_P2_temp4159_3, (__HIVE_P2_temp4159_5 = this, __HIVE_P2_temp4159_6 = __HIVE_P2_get(__HIVE_P2_temp4159_5, "parseMaybeAssign", 4164), __HIVE_P2_invoke(__HIVE_P2_temp4159_6, __HIVE_P2_temp4159_5, (__HIVE_P2_reserveArray(0, 4164), __HIVE_P2_ownArray([], 4164, "CONTROL_ARRAY")), 4164)), 4162));
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4168), "ecmaVersion", 4167), 16, 4166)) {
            if (!(__HIVE_P2_temp4159_7 = this, __HIVE_P2_temp4159_8 = __HIVE_P2_get(__HIVE_P2_temp4159_7, "eat", 4169), __HIVE_P2_invoke(__HIVE_P2_temp4159_8, __HIVE_P2_temp4159_7, (__HIVE_P2_reserveArray(1, 4169), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 4170)], 4169, "CONTROL_ARRAY")), 4169))) {
                (__HIVE_P2_temp4159_9 = this, __HIVE_P2_temp4159_10 = __HIVE_P2_get(__HIVE_P2_temp4159_9, "expect", 4172), __HIVE_P2_invoke(__HIVE_P2_temp4159_10, __HIVE_P2_temp4159_9, (__HIVE_P2_reserveArray(1, 4172), __HIVE_P2_ownArray([__HIVE_P2_get(m, "comma", 4173)], 4172, "CONTROL_ARRAY")), 4172));
                if (!(__HIVE_P2_temp4159_11 = this, __HIVE_P2_temp4159_12 = __HIVE_P2_get(__HIVE_P2_temp4159_11, "afterTrailingComma", 4175), __HIVE_P2_invoke(__HIVE_P2_temp4159_12, __HIVE_P2_temp4159_11, (__HIVE_P2_reserveArray(1, 4175), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 4176)], 4175, "CONTROL_ARRAY")), 4175))) {
                    (__HIVE_P2_temp4159_13 = e, __HIVE_P2_temp4159_14 = "options", __HIVE_P2_set(__HIVE_P2_temp4159_13, __HIVE_P2_temp4159_14, (__HIVE_P2_temp4159_16 = this, __HIVE_P2_temp4159_17 = __HIVE_P2_get(__HIVE_P2_temp4159_16, "parseMaybeAssign", 4180), __HIVE_P2_invoke(__HIVE_P2_temp4159_17, __HIVE_P2_temp4159_16, (__HIVE_P2_reserveArray(0, 4180), __HIVE_P2_ownArray([], 4180, "CONTROL_ARRAY")), 4180)), 4178));
                    if (!(__HIVE_P2_temp4159_18 = this, __HIVE_P2_temp4159_19 = __HIVE_P2_get(__HIVE_P2_temp4159_18, "eat", 4182), __HIVE_P2_invoke(__HIVE_P2_temp4159_19, __HIVE_P2_temp4159_18, (__HIVE_P2_reserveArray(1, 4182), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 4183)], 4182, "CONTROL_ARRAY")), 4182))) {
                        (__HIVE_P2_temp4159_20 = this, __HIVE_P2_temp4159_21 = __HIVE_P2_get(__HIVE_P2_temp4159_20, "expect", 4185), __HIVE_P2_invoke(__HIVE_P2_temp4159_21, __HIVE_P2_temp4159_20, (__HIVE_P2_reserveArray(1, 4185), __HIVE_P2_ownArray([__HIVE_P2_get(m, "comma", 4186)], 4185, "CONTROL_ARRAY")), 4185));
                        if (!(__HIVE_P2_temp4159_22 = this, __HIVE_P2_temp4159_23 = __HIVE_P2_get(__HIVE_P2_temp4159_22, "afterTrailingComma", 4188), __HIVE_P2_invoke(__HIVE_P2_temp4159_23, __HIVE_P2_temp4159_22, (__HIVE_P2_reserveArray(1, 4188), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 4189)], 4188, "CONTROL_ARRAY")), 4188))) {
                            __HIVE_P2_syntaxRefusal(4191);
                        }
                    }
                }
                else {
                    (__HIVE_P2_temp4159_24 = e, __HIVE_P2_temp4159_25 = "options", __HIVE_P2_set(__HIVE_P2_temp4159_24, __HIVE_P2_temp4159_25, null, 4192));
                }
            }
            else {
                (__HIVE_P2_temp4159_27 = e, __HIVE_P2_temp4159_28 = "options", __HIVE_P2_set(__HIVE_P2_temp4159_27, __HIVE_P2_temp4159_28, null, 4194));
            }
        }
        else {
            if (!(__HIVE_P2_temp4159_30 = this, __HIVE_P2_temp4159_31 = __HIVE_P2_get(__HIVE_P2_temp4159_30, "eat", 4196), __HIVE_P2_invoke(__HIVE_P2_temp4159_31, __HIVE_P2_temp4159_30, (__HIVE_P2_reserveArray(1, 4196), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 4197)], 4196, "CONTROL_ARRAY")), 4196))) {
                var t = __HIVE_P2_get(this, "start", 4199);
                if ((__HIVE_P2_temp4159_32 = this, __HIVE_P2_temp4159_33 = __HIVE_P2_get(__HIVE_P2_temp4159_32, "eat", 4200), __HIVE_P2_invoke(__HIVE_P2_temp4159_33, __HIVE_P2_temp4159_32, (__HIVE_P2_reserveArray(1, 4200), __HIVE_P2_ownArray([__HIVE_P2_get(m, "comma", 4201)], 4200, "CONTROL_ARRAY")), 4200)) && (__HIVE_P2_temp4159_34 = this, __HIVE_P2_temp4159_35 = __HIVE_P2_get(__HIVE_P2_temp4159_34, "eat", 4203), __HIVE_P2_invoke(__HIVE_P2_temp4159_35, __HIVE_P2_temp4159_34, (__HIVE_P2_reserveArray(1, 4203), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 4204)], 4203, "CONTROL_ARRAY")), 4203))) {
                    __HIVE_P2_syntaxRefusal(4206);
                }
                else {
                    __HIVE_P2_syntaxRefusal(4207);
                }
            }
        }
        return (__HIVE_P2_temp4159_36 = this, __HIVE_P2_temp4159_37 = __HIVE_P2_get(__HIVE_P2_temp4159_36, "finishNode", 4208), __HIVE_P2_invoke(__HIVE_P2_temp4159_37, __HIVE_P2_temp4159_36, (__HIVE_P2_reserveArray(2, 4208), __HIVE_P2_ownArray([e, "ImportExpression"], 4208, "CONTROL_ARRAY")), 4208));
    }, 39, 1, 0, 4159)), 4157));
    (__HIVE_P2_temp0_1304 = pe, __HIVE_P2_temp0_1305 = "parseImportMeta", __HIVE_P2_set(__HIVE_P2_temp0_1304, __HIVE_P2_temp0_1305, (__HIVE_P2_reserveFunction(4212), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp4212_0, __HIVE_P2_temp4212_1, __HIVE_P2_temp4212_2, __HIVE_P2_temp4212_3, __HIVE_P2_temp4212_4, __HIVE_P2_temp4212_5, __HIVE_P2_temp4212_6, __HIVE_P2_temp4212_7, __HIVE_P2_temp4212_8;
        (__HIVE_P2_temp4212_0 = this, __HIVE_P2_temp4212_1 = __HIVE_P2_get(__HIVE_P2_temp4212_0, "next", 4213), __HIVE_P2_invoke(__HIVE_P2_temp4212_1, __HIVE_P2_temp4212_0, (__HIVE_P2_reserveArray(0, 4213), __HIVE_P2_ownArray([], 4213, "CONTROL_ARRAY")), 4213));
        var t = __HIVE_P2_get(this, "containsEsc", 4215);
        (__HIVE_P2_temp4212_2 = e, __HIVE_P2_temp4212_3 = "property", __HIVE_P2_set(__HIVE_P2_temp4212_2, __HIVE_P2_temp4212_3, (__HIVE_P2_temp4212_5 = this, __HIVE_P2_temp4212_6 = __HIVE_P2_get(__HIVE_P2_temp4212_5, "parseIdent", 4218), __HIVE_P2_invoke(__HIVE_P2_temp4212_6, __HIVE_P2_temp4212_5, (__HIVE_P2_reserveArray(1, 4218), __HIVE_P2_ownArray([true], 4218, "CONTROL_ARRAY")), 4218)), 4216));
        if (__HIVE_P2_get(__HIVE_P2_get(e, "property", 4221), "name", 4220) !== "meta") {
            __HIVE_P2_syntaxRefusal(4222);
        }
        if (t) {
            __HIVE_P2_syntaxRefusal(4223);
        }
        if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 4225), "sourceType", 4224) !== "module" && !__HIVE_P2_get(__HIVE_P2_get(this, "options", 4227), "allowImportExportEverywhere", 4226)) {
            __HIVE_P2_syntaxRefusal(4228);
        }
        return (__HIVE_P2_temp4212_7 = this, __HIVE_P2_temp4212_8 = __HIVE_P2_get(__HIVE_P2_temp4212_7, "finishNode", 4229), __HIVE_P2_invoke(__HIVE_P2_temp4212_8, __HIVE_P2_temp4212_7, (__HIVE_P2_reserveArray(2, 4229), __HIVE_P2_ownArray([e, "MetaProperty"], 4229, "CONTROL_ARRAY")), 4229));
    }, 10, 1, 0, 4212)), 4210));
    (__HIVE_P2_temp0_1307 = pe, __HIVE_P2_temp0_1308 = "parseLiteral", __HIVE_P2_set(__HIVE_P2_temp0_1307, __HIVE_P2_temp0_1308, (__HIVE_P2_reserveFunction(4233), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp4233_0, __HIVE_P2_temp4233_1, __HIVE_P2_temp4233_2, __HIVE_P2_temp4233_3, __HIVE_P2_temp4233_4, __HIVE_P2_temp4233_5, __HIVE_P2_temp4233_6, __HIVE_P2_temp4233_7, __HIVE_P2_temp4233_8, __HIVE_P2_temp4233_9, __HIVE_P2_temp4233_10, __HIVE_P2_temp4233_11, __HIVE_P2_temp4233_12, __HIVE_P2_temp4233_13, __HIVE_P2_temp4233_14, __HIVE_P2_temp4233_15, __HIVE_P2_temp4233_16, __HIVE_P2_temp4233_17, __HIVE_P2_temp4233_18, __HIVE_P2_temp4233_19, __HIVE_P2_temp4233_20, __HIVE_P2_temp4233_21, __HIVE_P2_temp4233_22;
        var t = (__HIVE_P2_temp4233_0 = this, __HIVE_P2_temp4233_1 = __HIVE_P2_get(__HIVE_P2_temp4233_0, "startNode", 4234), __HIVE_P2_invoke(__HIVE_P2_temp4233_1, __HIVE_P2_temp4233_0, (__HIVE_P2_reserveArray(0, 4234), __HIVE_P2_ownArray([], 4234, "CONTROL_ARRAY")), 4234));
        (__HIVE_P2_temp4233_2 = t, __HIVE_P2_temp4233_3 = "value", __HIVE_P2_set(__HIVE_P2_temp4233_2, __HIVE_P2_temp4233_3, e, 4236));
        (__HIVE_P2_temp4233_5 = t, __HIVE_P2_temp4233_6 = "raw", __HIVE_P2_set(__HIVE_P2_temp4233_5, __HIVE_P2_temp4233_6, (__HIVE_P2_temp4233_8 = __HIVE_P2_get(this, "input", 4244), __HIVE_P2_temp4233_9 = __HIVE_P2_get(__HIVE_P2_temp4233_8, "slice", 4240), __HIVE_P2_invoke(__HIVE_P2_temp4233_9, __HIVE_P2_temp4233_8, (__HIVE_P2_reserveArray(2, 4240), __HIVE_P2_ownArray([__HIVE_P2_get(this, "start", 4241), __HIVE_P2_get(this, "end", 4242)], 4240, "CONTROL_ARRAY")), 4240)), 4238));
        if ((__HIVE_P2_temp4233_10 = __HIVE_P2_get(t, "raw", 4250), __HIVE_P2_temp4233_11 = __HIVE_P2_get(__HIVE_P2_temp4233_10, "charCodeAt", 4245), __HIVE_P2_invoke(__HIVE_P2_temp4233_11, __HIVE_P2_temp4233_10, (__HIVE_P2_reserveArray(1, 4245), __HIVE_P2_ownArray([__HIVE_P2_binary("-", __HIVE_P2_get(__HIVE_P2_get(t, "raw", 4248), "length", 4247), 1, 4246)], 4245, "CONTROL_ARRAY")), 4245)) === 110) {
            (__HIVE_P2_temp4233_12 = t, __HIVE_P2_temp4233_13 = "bigint", __HIVE_P2_set(__HIVE_P2_temp4233_12, __HIVE_P2_temp4233_13, (__HIVE_P2_temp4233_15 = (__HIVE_P2_temp4233_17 = __HIVE_P2_get(t, "raw", 4259), __HIVE_P2_temp4233_18 = __HIVE_P2_get(__HIVE_P2_temp4233_17, "slice", 4256), __HIVE_P2_invoke(__HIVE_P2_temp4233_18, __HIVE_P2_temp4233_17, (__HIVE_P2_reserveArray(2, 4256), __HIVE_P2_ownArray([0, __HIVE_P2_unary("-", 1, 4257)], 4256, "CONTROL_ARRAY")), 4256)), __HIVE_P2_temp4233_16 = __HIVE_P2_get(__HIVE_P2_temp4233_15, "replace", 4253), __HIVE_P2_invoke(__HIVE_P2_temp4233_16, __HIVE_P2_temp4233_15, (__HIVE_P2_reserveArray(2, 4253), __HIVE_P2_ownArray([__HIVE_P2_toolRegex("/_/g", 4254), ""], 4253, "CONTROL_ARRAY")), 4253)), 4251));
        }
        (__HIVE_P2_temp4233_19 = this, __HIVE_P2_temp4233_20 = __HIVE_P2_get(__HIVE_P2_temp4233_19, "next", 4260), __HIVE_P2_invoke(__HIVE_P2_temp4233_20, __HIVE_P2_temp4233_19, (__HIVE_P2_reserveArray(0, 4260), __HIVE_P2_ownArray([], 4260, "CONTROL_ARRAY")), 4260));
        return (__HIVE_P2_temp4233_21 = this, __HIVE_P2_temp4233_22 = __HIVE_P2_get(__HIVE_P2_temp4233_21, "finishNode", 4262), __HIVE_P2_invoke(__HIVE_P2_temp4233_22, __HIVE_P2_temp4233_21, (__HIVE_P2_reserveArray(2, 4262), __HIVE_P2_ownArray([t, "Literal"], 4262, "CONTROL_ARRAY")), 4262));
    }, 24, 1, 0, 4233)), 4231));
    (__HIVE_P2_temp0_1310 = pe, __HIVE_P2_temp0_1311 = "parseParenExpression", __HIVE_P2_set(__HIVE_P2_temp0_1310, __HIVE_P2_temp0_1311, (__HIVE_P2_reserveFunction(4266), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp4266_0, __HIVE_P2_temp4266_1, __HIVE_P2_temp4266_2, __HIVE_P2_temp4266_3, __HIVE_P2_temp4266_4, __HIVE_P2_temp4266_5;
        (__HIVE_P2_temp4266_0 = this, __HIVE_P2_temp4266_1 = __HIVE_P2_get(__HIVE_P2_temp4266_0, "expect", 4267), __HIVE_P2_invoke(__HIVE_P2_temp4266_1, __HIVE_P2_temp4266_0, (__HIVE_P2_reserveArray(1, 4267), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenL", 4268)], 4267, "CONTROL_ARRAY")), 4267));
        var e = (__HIVE_P2_temp4266_2 = this, __HIVE_P2_temp4266_3 = __HIVE_P2_get(__HIVE_P2_temp4266_2, "parseExpression", 4270), __HIVE_P2_invoke(__HIVE_P2_temp4266_3, __HIVE_P2_temp4266_2, (__HIVE_P2_reserveArray(0, 4270), __HIVE_P2_ownArray([], 4270, "CONTROL_ARRAY")), 4270));
        (__HIVE_P2_temp4266_4 = this, __HIVE_P2_temp4266_5 = __HIVE_P2_get(__HIVE_P2_temp4266_4, "expect", 4272), __HIVE_P2_invoke(__HIVE_P2_temp4266_5, __HIVE_P2_temp4266_4, (__HIVE_P2_reserveArray(1, 4272), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 4273)], 4272, "CONTROL_ARRAY")), 4272));
        return e;
    }, 7, 0, 0, 4266)), 4264));
    (__HIVE_P2_temp0_1313 = pe, __HIVE_P2_temp0_1314 = "shouldParseArrow", __HIVE_P2_set(__HIVE_P2_temp0_1313, __HIVE_P2_temp0_1314, (__HIVE_P2_reserveFunction(4277), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp4277_0, __HIVE_P2_temp4277_1;
        return !(__HIVE_P2_temp4277_0 = this, __HIVE_P2_temp4277_1 = __HIVE_P2_get(__HIVE_P2_temp4277_0, "canInsertSemicolon", 4278), __HIVE_P2_invoke(__HIVE_P2_temp4277_1, __HIVE_P2_temp4277_0, (__HIVE_P2_reserveArray(0, 4278), __HIVE_P2_ownArray([], 4278, "CONTROL_ARRAY")), 4278));
    }, 2, 1, 0, 4277)), 4275));
    (__HIVE_P2_temp0_1316 = pe, __HIVE_P2_temp0_1317 = "parseParenAndDistinguishExpression", __HIVE_P2_set(__HIVE_P2_temp0_1316, __HIVE_P2_temp0_1317, (__HIVE_P2_reserveFunction(4282), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp4282_0, __HIVE_P2_temp4282_1, __HIVE_P2_temp4282_2, __HIVE_P2_temp4282_3, __HIVE_P2_temp4282_4, __HIVE_P2_temp4282_5, __HIVE_P2_temp4282_6, __HIVE_P2_temp4282_7, __HIVE_P2_temp4282_8, __HIVE_P2_temp4282_9, __HIVE_P2_temp4282_10, __HIVE_P2_temp4282_11, __HIVE_P2_temp4282_12, __HIVE_P2_temp4282_13, __HIVE_P2_temp4282_14, __HIVE_P2_temp4282_15, __HIVE_P2_temp4282_16, __HIVE_P2_temp4282_17, __HIVE_P2_temp4282_18, __HIVE_P2_temp4282_19, __HIVE_P2_temp4282_20, __HIVE_P2_temp4282_21, __HIVE_P2_temp4282_22, __HIVE_P2_temp4282_23, __HIVE_P2_temp4282_24, __HIVE_P2_temp4282_25, __HIVE_P2_temp4282_26, __HIVE_P2_temp4282_27, __HIVE_P2_temp4282_28, __HIVE_P2_temp4282_29, __HIVE_P2_temp4282_30, __HIVE_P2_temp4282_31, __HIVE_P2_temp4282_32, __HIVE_P2_temp4282_33, __HIVE_P2_temp4282_34, __HIVE_P2_temp4282_35, __HIVE_P2_temp4282_36, __HIVE_P2_temp4282_37, __HIVE_P2_temp4282_38, __HIVE_P2_temp4282_39, __HIVE_P2_temp4282_40, __HIVE_P2_temp4282_41, __HIVE_P2_temp4282_42, __HIVE_P2_temp4282_43, __HIVE_P2_temp4282_44, __HIVE_P2_temp4282_45, __HIVE_P2_temp4282_46, __HIVE_P2_temp4282_47, __HIVE_P2_temp4282_48, __HIVE_P2_temp4282_49, __HIVE_P2_temp4282_50, __HIVE_P2_temp4282_51, __HIVE_P2_temp4282_52, __HIVE_P2_temp4282_53, __HIVE_P2_temp4282_54, __HIVE_P2_temp4282_55, __HIVE_P2_temp4282_56, __HIVE_P2_temp4282_57, __HIVE_P2_temp4282_58, __HIVE_P2_temp4282_59, __HIVE_P2_temp4282_60, __HIVE_P2_temp4282_61, __HIVE_P2_temp4282_62, __HIVE_P2_temp4282_63, __HIVE_P2_temp4282_64;
        var i = __HIVE_P2_get(this, "start", 4283), s = __HIVE_P2_get(this, "startLoc", 4284), r, a = __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4287), "ecmaVersion", 4286), 8, 4285);
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4290), "ecmaVersion", 4289), 6, 4288)) {
            (__HIVE_P2_temp4282_0 = this, __HIVE_P2_temp4282_1 = __HIVE_P2_get(__HIVE_P2_temp4282_0, "next", 4291), __HIVE_P2_invoke(__HIVE_P2_temp4282_1, __HIVE_P2_temp4282_0, (__HIVE_P2_reserveArray(0, 4291), __HIVE_P2_ownArray([], 4291, "CONTROL_ARRAY")), 4291));
            var n = __HIVE_P2_get(this, "start", 4293), o = __HIVE_P2_get(this, "startLoc", 4294);
            var h = (__HIVE_P2_temp4282_2 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp4282_2, 4295), __HIVE_P2_reserveArray(0, 4295, 0), __HIVE_P2_ownArray([], 4295, "ARRAY", __HIVE_P2_temp4282_2)), p = true, c = false;
            var l = __HIVE_P2_construct(Z, (__HIVE_P2_reserveArray(0, 4296), __HIVE_P2_ownArray([], 4296, "CONTROL_ARRAY")), 4296), u = __HIVE_P2_get(this, "yieldPos", 4297), f = __HIVE_P2_get(this, "awaitPos", 4298), d;
            (__HIVE_P2_temp4282_3 = this, __HIVE_P2_temp4282_4 = "yieldPos", __HIVE_P2_set(__HIVE_P2_temp4282_3, __HIVE_P2_temp4282_4, 0, 4299));
            (__HIVE_P2_temp4282_6 = this, __HIVE_P2_temp4282_7 = "awaitPos", __HIVE_P2_set(__HIVE_P2_temp4282_6, __HIVE_P2_temp4282_7, 0, 4301));
            while (__HIVE_P2_get(this, "type", 4304) !== __HIVE_P2_get(m, "parenR", 4305)) {
                __HIVE_P2_tick(4303);
                p ? p = false : (__HIVE_P2_temp4282_9 = this, __HIVE_P2_temp4282_10 = __HIVE_P2_get(__HIVE_P2_temp4282_9, "expect", 4307), __HIVE_P2_invoke(__HIVE_P2_temp4282_10, __HIVE_P2_temp4282_9, (__HIVE_P2_reserveArray(1, 4307), __HIVE_P2_ownArray([__HIVE_P2_get(m, "comma", 4308)], 4307, "CONTROL_ARRAY")), 4307));
                if (a && (__HIVE_P2_temp4282_11 = this, __HIVE_P2_temp4282_12 = __HIVE_P2_get(__HIVE_P2_temp4282_11, "afterTrailingComma", 4310), __HIVE_P2_invoke(__HIVE_P2_temp4282_12, __HIVE_P2_temp4282_11, (__HIVE_P2_reserveArray(2, 4310), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 4311), true], 4310, "CONTROL_ARRAY")), 4310))) {
                    c = true;
                    break;
                }
                else if (__HIVE_P2_get(this, "type", 4314) === __HIVE_P2_get(m, "ellipsis", 4315)) {
                    d = __HIVE_P2_get(this, "start", 4317);
                    (__HIVE_P2_temp4282_17 = h, __HIVE_P2_temp4282_18 = __HIVE_P2_get(__HIVE_P2_temp4282_17, "push", 4318), __HIVE_P2_invoke(__HIVE_P2_temp4282_18, __HIVE_P2_temp4282_17, (__HIVE_P2_reserveArray(1, 4318), __HIVE_P2_ownArray([(__HIVE_P2_temp4282_15 = this, __HIVE_P2_temp4282_16 = __HIVE_P2_get(__HIVE_P2_temp4282_15, "parseParenItem", 4319), __HIVE_P2_invoke(__HIVE_P2_temp4282_16, __HIVE_P2_temp4282_15, (__HIVE_P2_reserveArray(1, 4319), __HIVE_P2_ownArray([(__HIVE_P2_temp4282_13 = this, __HIVE_P2_temp4282_14 = __HIVE_P2_get(__HIVE_P2_temp4282_13, "parseRestBinding", 4320), __HIVE_P2_invoke(__HIVE_P2_temp4282_14, __HIVE_P2_temp4282_13, (__HIVE_P2_reserveArray(0, 4320), __HIVE_P2_ownArray([], 4320, "CONTROL_ARRAY")), 4320))], 4319, "CONTROL_ARRAY")), 4319))], 4318, "CONTROL_ARRAY")), 4318));
                    if (__HIVE_P2_get(this, "type", 4324) === __HIVE_P2_get(m, "comma", 4325)) {
                        __HIVE_P2_syntaxRefusal(4326);
                    }
                    break;
                }
                else {
                    (__HIVE_P2_temp4282_21 = h, __HIVE_P2_temp4282_22 = __HIVE_P2_get(__HIVE_P2_temp4282_21, "push", 4327), __HIVE_P2_invoke(__HIVE_P2_temp4282_22, __HIVE_P2_temp4282_21, (__HIVE_P2_reserveArray(1, 4327), __HIVE_P2_ownArray([(__HIVE_P2_temp4282_19 = this, __HIVE_P2_temp4282_20 = __HIVE_P2_get(__HIVE_P2_temp4282_19, "parseMaybeAssign", 4328), __HIVE_P2_invoke(__HIVE_P2_temp4282_20, __HIVE_P2_temp4282_19, (__HIVE_P2_reserveArray(3, 4328), __HIVE_P2_ownArray([false, l, __HIVE_P2_get(this, "parseParenItem", 4329)], 4328, "CONTROL_ARRAY")), 4328))], 4327, "CONTROL_ARRAY")), 4327));
                }
            }
            var g = __HIVE_P2_get(this, "lastTokEnd", 4332), v = __HIVE_P2_get(this, "lastTokEndLoc", 4333);
            (__HIVE_P2_temp4282_23 = this, __HIVE_P2_temp4282_24 = __HIVE_P2_get(__HIVE_P2_temp4282_23, "expect", 4334), __HIVE_P2_invoke(__HIVE_P2_temp4282_24, __HIVE_P2_temp4282_23, (__HIVE_P2_reserveArray(1, 4334), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 4335)], 4334, "CONTROL_ARRAY")), 4334));
            if (e && (__HIVE_P2_temp4282_25 = this, __HIVE_P2_temp4282_26 = __HIVE_P2_get(__HIVE_P2_temp4282_25, "shouldParseArrow", 4337), __HIVE_P2_invoke(__HIVE_P2_temp4282_26, __HIVE_P2_temp4282_25, (__HIVE_P2_reserveArray(1, 4337), __HIVE_P2_ownArray([h], 4337, "CONTROL_ARRAY")), 4337)) && (__HIVE_P2_temp4282_27 = this, __HIVE_P2_temp4282_28 = __HIVE_P2_get(__HIVE_P2_temp4282_27, "eat", 4339), __HIVE_P2_invoke(__HIVE_P2_temp4282_28, __HIVE_P2_temp4282_27, (__HIVE_P2_reserveArray(1, 4339), __HIVE_P2_ownArray([__HIVE_P2_get(m, "arrow", 4340)], 4339, "CONTROL_ARRAY")), 4339))) {
                (__HIVE_P2_temp4282_29 = this, __HIVE_P2_temp4282_30 = __HIVE_P2_get(__HIVE_P2_temp4282_29, "checkPatternErrors", 4342), __HIVE_P2_invoke(__HIVE_P2_temp4282_30, __HIVE_P2_temp4282_29, (__HIVE_P2_reserveArray(2, 4342), __HIVE_P2_ownArray([l, false], 4342, "CONTROL_ARRAY")), 4342));
                (__HIVE_P2_temp4282_31 = this, __HIVE_P2_temp4282_32 = __HIVE_P2_get(__HIVE_P2_temp4282_31, "checkYieldAwaitInDefaultParams", 4344), __HIVE_P2_invoke(__HIVE_P2_temp4282_32, __HIVE_P2_temp4282_31, (__HIVE_P2_reserveArray(0, 4344), __HIVE_P2_ownArray([], 4344, "CONTROL_ARRAY")), 4344));
                (__HIVE_P2_temp4282_33 = this, __HIVE_P2_temp4282_34 = "yieldPos", __HIVE_P2_set(__HIVE_P2_temp4282_33, __HIVE_P2_temp4282_34, u, 4346));
                (__HIVE_P2_temp4282_36 = this, __HIVE_P2_temp4282_37 = "awaitPos", __HIVE_P2_set(__HIVE_P2_temp4282_36, __HIVE_P2_temp4282_37, f, 4348));
                return (__HIVE_P2_temp4282_39 = this, __HIVE_P2_temp4282_40 = __HIVE_P2_get(__HIVE_P2_temp4282_39, "parseParenArrowList", 4350), __HIVE_P2_invoke(__HIVE_P2_temp4282_40, __HIVE_P2_temp4282_39, (__HIVE_P2_reserveArray(4, 4350), __HIVE_P2_ownArray([i, s, h, t], 4350, "CONTROL_ARRAY")), 4350));
            }
            if (!__HIVE_P2_get(h, "length", 4352) || c) {
                __HIVE_P2_syntaxRefusal(4353);
            }
            if (d) {
                __HIVE_P2_syntaxRefusal(4354);
            }
            (__HIVE_P2_temp4282_41 = this, __HIVE_P2_temp4282_42 = __HIVE_P2_get(__HIVE_P2_temp4282_41, "checkExpressionErrors", 4355), __HIVE_P2_invoke(__HIVE_P2_temp4282_42, __HIVE_P2_temp4282_41, (__HIVE_P2_reserveArray(2, 4355), __HIVE_P2_ownArray([l, true], 4355, "CONTROL_ARRAY")), 4355));
            (__HIVE_P2_temp4282_43 = this, __HIVE_P2_temp4282_44 = "yieldPos", __HIVE_P2_set(__HIVE_P2_temp4282_43, __HIVE_P2_temp4282_44, u || __HIVE_P2_get(this, "yieldPos", 4359), 4357));
            (__HIVE_P2_temp4282_46 = this, __HIVE_P2_temp4282_47 = "awaitPos", __HIVE_P2_set(__HIVE_P2_temp4282_46, __HIVE_P2_temp4282_47, f || __HIVE_P2_get(this, "awaitPos", 4362), 4360));
            if (__HIVE_P2_binary(">", __HIVE_P2_get(h, "length", 4364), 1, 4363)) {
                r = (__HIVE_P2_temp4282_49 = this, __HIVE_P2_temp4282_50 = __HIVE_P2_get(__HIVE_P2_temp4282_49, "startNodeAt", 4366), __HIVE_P2_invoke(__HIVE_P2_temp4282_50, __HIVE_P2_temp4282_49, (__HIVE_P2_reserveArray(2, 4366), __HIVE_P2_ownArray([n, o], 4366, "CONTROL_ARRAY")), 4366));
                (__HIVE_P2_temp4282_51 = r, __HIVE_P2_temp4282_52 = "expressions", __HIVE_P2_set(__HIVE_P2_temp4282_51, __HIVE_P2_temp4282_52, h, 4368));
                (__HIVE_P2_temp4282_54 = this, __HIVE_P2_temp4282_55 = __HIVE_P2_get(__HIVE_P2_temp4282_54, "finishNodeAt", 4370), __HIVE_P2_invoke(__HIVE_P2_temp4282_55, __HIVE_P2_temp4282_54, (__HIVE_P2_reserveArray(4, 4370), __HIVE_P2_ownArray([r, "SequenceExpression", g, v], 4370, "CONTROL_ARRAY")), 4370));
            }
            else {
                r = __HIVE_P2_get(h, 0, 4373);
            }
        }
        else {
            r = (__HIVE_P2_temp4282_56 = this, __HIVE_P2_temp4282_57 = __HIVE_P2_get(__HIVE_P2_temp4282_56, "parseParenExpression", 4375), __HIVE_P2_invoke(__HIVE_P2_temp4282_57, __HIVE_P2_temp4282_56, (__HIVE_P2_reserveArray(0, 4375), __HIVE_P2_ownArray([], 4375, "CONTROL_ARRAY")), 4375));
        }
        if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 4378), "preserveParens", 4377)) {
            var x = (__HIVE_P2_temp4282_58 = this, __HIVE_P2_temp4282_59 = __HIVE_P2_get(__HIVE_P2_temp4282_58, "startNodeAt", 4379), __HIVE_P2_invoke(__HIVE_P2_temp4282_59, __HIVE_P2_temp4282_58, (__HIVE_P2_reserveArray(2, 4379), __HIVE_P2_ownArray([i, s], 4379, "CONTROL_ARRAY")), 4379));
            (__HIVE_P2_temp4282_60 = x, __HIVE_P2_temp4282_61 = "expression", __HIVE_P2_set(__HIVE_P2_temp4282_60, __HIVE_P2_temp4282_61, r, 4381));
            return (__HIVE_P2_temp4282_63 = this, __HIVE_P2_temp4282_64 = __HIVE_P2_get(__HIVE_P2_temp4282_63, "finishNode", 4383), __HIVE_P2_invoke(__HIVE_P2_temp4282_64, __HIVE_P2_temp4282_63, (__HIVE_P2_reserveArray(2, 4383), __HIVE_P2_ownArray([x, "ParenthesizedExpression"], 4383, "CONTROL_ARRAY")), 4383));
        }
        else {
            return r;
        }
    }, 81, 2, 0, 4282)), 4280));
    (__HIVE_P2_temp0_1319 = pe, __HIVE_P2_temp0_1320 = "parseParenItem", __HIVE_P2_set(__HIVE_P2_temp0_1319, __HIVE_P2_temp0_1320, (__HIVE_P2_reserveFunction(4387), __HIVE_P2_registerFunction(function (e) {
        return e;
    }, 0, 1, 0, 4387)), 4385));
    (__HIVE_P2_temp0_1322 = pe, __HIVE_P2_temp0_1323 = "parseParenArrowList", __HIVE_P2_set(__HIVE_P2_temp0_1322, __HIVE_P2_temp0_1323, (__HIVE_P2_reserveFunction(4390), __HIVE_P2_registerFunction(function (e, t, i, s) {
        var __HIVE_P2_temp4390_0, __HIVE_P2_temp4390_1, __HIVE_P2_temp4390_2, __HIVE_P2_temp4390_3;
        return (__HIVE_P2_temp4390_2 = this, __HIVE_P2_temp4390_3 = __HIVE_P2_get(__HIVE_P2_temp4390_2, "parseArrowExpression", 4391), __HIVE_P2_invoke(__HIVE_P2_temp4390_3, __HIVE_P2_temp4390_2, (__HIVE_P2_reserveArray(4, 4391), __HIVE_P2_ownArray([(__HIVE_P2_temp4390_0 = this, __HIVE_P2_temp4390_1 = __HIVE_P2_get(__HIVE_P2_temp4390_0, "startNodeAt", 4392), __HIVE_P2_invoke(__HIVE_P2_temp4390_1, __HIVE_P2_temp4390_0, (__HIVE_P2_reserveArray(2, 4392), __HIVE_P2_ownArray([e, t], 4392, "CONTROL_ARRAY")), 4392)), i, false, s], 4391, "CONTROL_ARRAY")), 4391));
    }, 4, 4, 0, 4390)), 4388));
    var ce = (__HIVE_P2_temp0_1325 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp0_1325, 4395), __HIVE_P2_reserveArray(0, 4395, 0), __HIVE_P2_ownArray([], 4395, "ARRAY", __HIVE_P2_temp0_1325));
    (__HIVE_P2_temp0_1326 = pe, __HIVE_P2_temp0_1327 = "parseNew", __HIVE_P2_set(__HIVE_P2_temp0_1326, __HIVE_P2_temp0_1327, (__HIVE_P2_reserveFunction(4398), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp4398_0, __HIVE_P2_temp4398_1, __HIVE_P2_temp4398_2, __HIVE_P2_temp4398_3, __HIVE_P2_temp4398_4, __HIVE_P2_temp4398_5, __HIVE_P2_temp4398_6, __HIVE_P2_temp4398_7, __HIVE_P2_temp4398_8, __HIVE_P2_temp4398_9, __HIVE_P2_temp4398_10, __HIVE_P2_temp4398_11, __HIVE_P2_temp4398_12, __HIVE_P2_temp4398_13, __HIVE_P2_temp4398_14, __HIVE_P2_temp4398_15, __HIVE_P2_temp4398_16, __HIVE_P2_temp4398_17, __HIVE_P2_temp4398_18, __HIVE_P2_temp4398_19, __HIVE_P2_temp4398_20, __HIVE_P2_temp4398_21, __HIVE_P2_temp4398_22, __HIVE_P2_temp4398_23, __HIVE_P2_temp4398_24, __HIVE_P2_temp4398_25, __HIVE_P2_temp4398_26, __HIVE_P2_temp4398_27, __HIVE_P2_temp4398_28, __HIVE_P2_temp4398_29, __HIVE_P2_temp4398_30, __HIVE_P2_temp4398_31, __HIVE_P2_temp4398_32, __HIVE_P2_temp4398_33, __HIVE_P2_temp4398_34, __HIVE_P2_temp4398_35, __HIVE_P2_temp4398_36, __HIVE_P2_temp4398_37, __HIVE_P2_temp4398_38, __HIVE_P2_temp4398_39, __HIVE_P2_temp4398_40, __HIVE_P2_temp4398_41;
        if (__HIVE_P2_get(this, "containsEsc", 4399)) {
            __HIVE_P2_syntaxRefusal(4400);
        }
        var e = (__HIVE_P2_temp4398_0 = this, __HIVE_P2_temp4398_1 = __HIVE_P2_get(__HIVE_P2_temp4398_0, "startNode", 4401), __HIVE_P2_invoke(__HIVE_P2_temp4398_1, __HIVE_P2_temp4398_0, (__HIVE_P2_reserveArray(0, 4401), __HIVE_P2_ownArray([], 4401, "CONTROL_ARRAY")), 4401));
        (__HIVE_P2_temp4398_2 = this, __HIVE_P2_temp4398_3 = __HIVE_P2_get(__HIVE_P2_temp4398_2, "next", 4403), __HIVE_P2_invoke(__HIVE_P2_temp4398_3, __HIVE_P2_temp4398_2, (__HIVE_P2_reserveArray(0, 4403), __HIVE_P2_ownArray([], 4403, "CONTROL_ARRAY")), 4403));
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4407), "ecmaVersion", 4406), 6, 4405) && __HIVE_P2_get(this, "type", 4408) === __HIVE_P2_get(m, "dot", 4409)) {
            var t = (__HIVE_P2_temp4398_4 = this, __HIVE_P2_temp4398_5 = __HIVE_P2_get(__HIVE_P2_temp4398_4, "startNodeAt", 4410), __HIVE_P2_invoke(__HIVE_P2_temp4398_5, __HIVE_P2_temp4398_4, (__HIVE_P2_reserveArray(2, 4410), __HIVE_P2_ownArray([__HIVE_P2_get(e, "start", 4411), __HIVE_P2_get(e, "loc", 4412) && __HIVE_P2_get(__HIVE_P2_get(e, "loc", 4414), "start", 4413)], 4410, "CONTROL_ARRAY")), 4410));
            (__HIVE_P2_temp4398_6 = t, __HIVE_P2_temp4398_7 = "name", __HIVE_P2_set(__HIVE_P2_temp4398_6, __HIVE_P2_temp4398_7, "new", 4416));
            (__HIVE_P2_temp4398_9 = e, __HIVE_P2_temp4398_10 = "meta", __HIVE_P2_set(__HIVE_P2_temp4398_9, __HIVE_P2_temp4398_10, (__HIVE_P2_temp4398_12 = this, __HIVE_P2_temp4398_13 = __HIVE_P2_get(__HIVE_P2_temp4398_12, "finishNode", 4420), __HIVE_P2_invoke(__HIVE_P2_temp4398_13, __HIVE_P2_temp4398_12, (__HIVE_P2_reserveArray(2, 4420), __HIVE_P2_ownArray([t, "Identifier"], 4420, "CONTROL_ARRAY")), 4420)), 4418));
            (__HIVE_P2_temp4398_14 = this, __HIVE_P2_temp4398_15 = __HIVE_P2_get(__HIVE_P2_temp4398_14, "next", 4422), __HIVE_P2_invoke(__HIVE_P2_temp4398_15, __HIVE_P2_temp4398_14, (__HIVE_P2_reserveArray(0, 4422), __HIVE_P2_ownArray([], 4422, "CONTROL_ARRAY")), 4422));
            var i = __HIVE_P2_get(this, "containsEsc", 4424);
            (__HIVE_P2_temp4398_16 = e, __HIVE_P2_temp4398_17 = "property", __HIVE_P2_set(__HIVE_P2_temp4398_16, __HIVE_P2_temp4398_17, (__HIVE_P2_temp4398_19 = this, __HIVE_P2_temp4398_20 = __HIVE_P2_get(__HIVE_P2_temp4398_19, "parseIdent", 4427), __HIVE_P2_invoke(__HIVE_P2_temp4398_20, __HIVE_P2_temp4398_19, (__HIVE_P2_reserveArray(1, 4427), __HIVE_P2_ownArray([true], 4427, "CONTROL_ARRAY")), 4427)), 4425));
            if (__HIVE_P2_get(__HIVE_P2_get(e, "property", 4430), "name", 4429) !== "target") {
                __HIVE_P2_syntaxRefusal(4431);
            }
            if (i) {
                __HIVE_P2_syntaxRefusal(4432);
            }
            if (!__HIVE_P2_get(this, "allowNewDotTarget", 4433)) {
                __HIVE_P2_syntaxRefusal(4434);
            }
            return (__HIVE_P2_temp4398_21 = this, __HIVE_P2_temp4398_22 = __HIVE_P2_get(__HIVE_P2_temp4398_21, "finishNode", 4435), __HIVE_P2_invoke(__HIVE_P2_temp4398_22, __HIVE_P2_temp4398_21, (__HIVE_P2_reserveArray(2, 4435), __HIVE_P2_ownArray([e, "MetaProperty"], 4435, "CONTROL_ARRAY")), 4435));
        }
        var s = __HIVE_P2_get(this, "start", 4437), r = __HIVE_P2_get(this, "startLoc", 4438);
        (__HIVE_P2_temp4398_23 = e, __HIVE_P2_temp4398_24 = "callee", __HIVE_P2_set(__HIVE_P2_temp4398_23, __HIVE_P2_temp4398_24, (__HIVE_P2_temp4398_28 = this, __HIVE_P2_temp4398_29 = __HIVE_P2_get(__HIVE_P2_temp4398_28, "parseSubscripts", 4441), __HIVE_P2_invoke(__HIVE_P2_temp4398_29, __HIVE_P2_temp4398_28, (__HIVE_P2_reserveArray(5, 4441), __HIVE_P2_ownArray([(__HIVE_P2_temp4398_26 = this, __HIVE_P2_temp4398_27 = __HIVE_P2_get(__HIVE_P2_temp4398_26, "parseExprAtom", 4442), __HIVE_P2_invoke(__HIVE_P2_temp4398_27, __HIVE_P2_temp4398_26, (__HIVE_P2_reserveArray(3, 4442), __HIVE_P2_ownArray([null, false, true], 4442, "CONTROL_ARRAY")), 4442)), s, r, true, false], 4441, "CONTROL_ARRAY")), 4441)), 4439));
        if ((__HIVE_P2_temp4398_30 = this, __HIVE_P2_temp4398_31 = __HIVE_P2_get(__HIVE_P2_temp4398_30, "eat", 4445), __HIVE_P2_invoke(__HIVE_P2_temp4398_31, __HIVE_P2_temp4398_30, (__HIVE_P2_reserveArray(1, 4445), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenL", 4446)], 4445, "CONTROL_ARRAY")), 4445))) {
            (__HIVE_P2_temp4398_32 = e, __HIVE_P2_temp4398_33 = "arguments", __HIVE_P2_set(__HIVE_P2_temp4398_32, __HIVE_P2_temp4398_33, (__HIVE_P2_temp4398_35 = this, __HIVE_P2_temp4398_36 = __HIVE_P2_get(__HIVE_P2_temp4398_35, "parseExprList", 4450), __HIVE_P2_invoke(__HIVE_P2_temp4398_36, __HIVE_P2_temp4398_35, (__HIVE_P2_reserveArray(3, 4450), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 4451), __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4454), "ecmaVersion", 4453), 8, 4452), false], 4450, "CONTROL_ARRAY")), 4450)), 4448));
        }
        else {
            (__HIVE_P2_temp4398_37 = e, __HIVE_P2_temp4398_38 = "arguments", __HIVE_P2_set(__HIVE_P2_temp4398_37, __HIVE_P2_temp4398_38, ce, 4456));
        }
        return (__HIVE_P2_temp4398_40 = this, __HIVE_P2_temp4398_41 = __HIVE_P2_get(__HIVE_P2_temp4398_40, "finishNode", 4458), __HIVE_P2_invoke(__HIVE_P2_temp4398_41, __HIVE_P2_temp4398_40, (__HIVE_P2_reserveArray(2, 4458), __HIVE_P2_ownArray([e, "NewExpression"], 4458, "CONTROL_ARRAY")), 4458));
    }, 47, 0, 0, 4398)), 4396));
    (__HIVE_P2_temp0_1329 = pe, __HIVE_P2_temp0_1330 = "parseTemplateElement", __HIVE_P2_set(__HIVE_P2_temp0_1329, __HIVE_P2_temp0_1330, (__HIVE_P2_reserveFunction(4462), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp4462_0, __HIVE_P2_temp4462_1, __HIVE_P2_temp4462_2, __HIVE_P2_temp4462_3, __HIVE_P2_temp4462_4, __HIVE_P2_temp4462_5, __HIVE_P2_temp4462_6, __HIVE_P2_temp4462_7, __HIVE_P2_temp4462_8, __HIVE_P2_temp4462_9, __HIVE_P2_temp4462_10, __HIVE_P2_temp4462_11, __HIVE_P2_temp4462_12, __HIVE_P2_temp4462_13, __HIVE_P2_temp4462_14, __HIVE_P2_temp4462_15, __HIVE_P2_temp4462_16, __HIVE_P2_temp4462_17, __HIVE_P2_temp4462_18, __HIVE_P2_temp4462_19, __HIVE_P2_temp4462_20;
        var t = __HIVE_P2_get(e, "isTagged", 4463);
        var i = (__HIVE_P2_temp4462_0 = this, __HIVE_P2_temp4462_1 = __HIVE_P2_get(__HIVE_P2_temp4462_0, "startNode", 4464), __HIVE_P2_invoke(__HIVE_P2_temp4462_1, __HIVE_P2_temp4462_0, (__HIVE_P2_reserveArray(0, 4464), __HIVE_P2_ownArray([], 4464, "CONTROL_ARRAY")), 4464));
        if (__HIVE_P2_get(this, "type", 4466) === __HIVE_P2_get(m, "invalidTemplate", 4467)) {
            if (!t) {
                __HIVE_P2_syntaxRefusal(4468);
            }
            (__HIVE_P2_temp4462_2 = i, __HIVE_P2_temp4462_3 = "value", __HIVE_P2_set(__HIVE_P2_temp4462_2, __HIVE_P2_temp4462_3, (__HIVE_P2_reserveObject(2, 4471), __HIVE_P2_ownObject({ raw: (__HIVE_P2_temp4462_5 = __HIVE_P2_get(this, "value", 4475), __HIVE_P2_temp4462_6 = __HIVE_P2_get(__HIVE_P2_temp4462_5, "replace", 4472), __HIVE_P2_invoke(__HIVE_P2_temp4462_6, __HIVE_P2_temp4462_5, (__HIVE_P2_reserveArray(2, 4472), __HIVE_P2_ownArray([__HIVE_P2_toolRegex("/\\r\\n?/g", 4473), "\n"], 4472, "CONTROL_ARRAY")), 4472)), cooked: null }, 4471, 2, 9)), 4469));
        }
        else {
            (__HIVE_P2_temp4462_7 = i, __HIVE_P2_temp4462_8 = "value", __HIVE_P2_set(__HIVE_P2_temp4462_7, __HIVE_P2_temp4462_8, (__HIVE_P2_reserveObject(2, 4478), __HIVE_P2_ownObject({ raw: (__HIVE_P2_temp4462_10 = (__HIVE_P2_temp4462_12 = __HIVE_P2_get(this, "input", 4486), __HIVE_P2_temp4462_13 = __HIVE_P2_get(__HIVE_P2_temp4462_12, "slice", 4482), __HIVE_P2_invoke(__HIVE_P2_temp4462_13, __HIVE_P2_temp4462_12, (__HIVE_P2_reserveArray(2, 4482), __HIVE_P2_ownArray([__HIVE_P2_get(this, "start", 4483), __HIVE_P2_get(this, "end", 4484)], 4482, "CONTROL_ARRAY")), 4482)), __HIVE_P2_temp4462_11 = __HIVE_P2_get(__HIVE_P2_temp4462_10, "replace", 4479), __HIVE_P2_invoke(__HIVE_P2_temp4462_11, __HIVE_P2_temp4462_10, (__HIVE_P2_reserveArray(2, 4479), __HIVE_P2_ownArray([__HIVE_P2_toolRegex("/\\r\\n?/g", 4480), "\n"], 4479, "CONTROL_ARRAY")), 4479)), cooked: __HIVE_P2_get(this, "value", 4487) }, 4478, 2, 9)), 4476));
        }
        (__HIVE_P2_temp4462_14 = this, __HIVE_P2_temp4462_15 = __HIVE_P2_get(__HIVE_P2_temp4462_14, "next", 4488), __HIVE_P2_invoke(__HIVE_P2_temp4462_15, __HIVE_P2_temp4462_14, (__HIVE_P2_reserveArray(0, 4488), __HIVE_P2_ownArray([], 4488, "CONTROL_ARRAY")), 4488));
        (__HIVE_P2_temp4462_16 = i, __HIVE_P2_temp4462_17 = "tail", __HIVE_P2_set(__HIVE_P2_temp4462_16, __HIVE_P2_temp4462_17, __HIVE_P2_get(this, "type", 4492) === __HIVE_P2_get(m, "backQuote", 4493), 4490));
        return (__HIVE_P2_temp4462_19 = this, __HIVE_P2_temp4462_20 = __HIVE_P2_get(__HIVE_P2_temp4462_19, "finishNode", 4494), __HIVE_P2_invoke(__HIVE_P2_temp4462_20, __HIVE_P2_temp4462_19, (__HIVE_P2_reserveArray(2, 4494), __HIVE_P2_ownArray([i, "TemplateElement"], 4494, "CONTROL_ARRAY")), 4494));
    }, 23, 1, 0, 4462)), 4460));
    (__HIVE_P2_temp0_1332 = pe, __HIVE_P2_temp0_1333 = "parseTemplate", __HIVE_P2_set(__HIVE_P2_temp0_1332, __HIVE_P2_temp0_1333, (__HIVE_P2_reserveFunction(4498), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp4498_0, __HIVE_P2_temp4498_1, __HIVE_P2_temp4498_2, __HIVE_P2_temp4498_3, __HIVE_P2_temp4498_4, __HIVE_P2_temp4498_5, __HIVE_P2_temp4498_6, __HIVE_P2_temp4498_7, __HIVE_P2_temp4498_8, __HIVE_P2_temp4498_9, __HIVE_P2_temp4498_10, __HIVE_P2_temp4498_11, __HIVE_P2_temp4498_12, __HIVE_P2_temp4498_13, __HIVE_P2_temp4498_14, __HIVE_P2_temp4498_15, __HIVE_P2_temp4498_16, __HIVE_P2_temp4498_17, __HIVE_P2_temp4498_18, __HIVE_P2_temp4498_19, __HIVE_P2_temp4498_20, __HIVE_P2_temp4498_21, __HIVE_P2_temp4498_22, __HIVE_P2_temp4498_23, __HIVE_P2_temp4498_24, __HIVE_P2_temp4498_25, __HIVE_P2_temp4498_26, __HIVE_P2_temp4498_27, __HIVE_P2_temp4498_28, __HIVE_P2_temp4498_29, __HIVE_P2_temp4498_30;
        if (e === void 0)
            e = (__HIVE_P2_reserveObject(0, 4500), __HIVE_P2_ownObject({}, 4500, 0, 0));
        var t = __HIVE_P2_get(e, "isTagged", 4501);
        if (t === void 0)
            t = false;
        var i = (__HIVE_P2_temp4498_0 = this, __HIVE_P2_temp4498_1 = __HIVE_P2_get(__HIVE_P2_temp4498_0, "startNode", 4503), __HIVE_P2_invoke(__HIVE_P2_temp4498_1, __HIVE_P2_temp4498_0, (__HIVE_P2_reserveArray(0, 4503), __HIVE_P2_ownArray([], 4503, "CONTROL_ARRAY")), 4503));
        (__HIVE_P2_temp4498_2 = this, __HIVE_P2_temp4498_3 = __HIVE_P2_get(__HIVE_P2_temp4498_2, "next", 4505), __HIVE_P2_invoke(__HIVE_P2_temp4498_3, __HIVE_P2_temp4498_2, (__HIVE_P2_reserveArray(0, 4505), __HIVE_P2_ownArray([], 4505, "CONTROL_ARRAY")), 4505));
        (__HIVE_P2_temp4498_4 = i, __HIVE_P2_temp4498_5 = "expressions", __HIVE_P2_set(__HIVE_P2_temp4498_4, __HIVE_P2_temp4498_5, (__HIVE_P2_temp4498_7 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp4498_7, 4509), __HIVE_P2_reserveArray(0, 4509, 0), __HIVE_P2_ownArray([], 4509, "ARRAY", __HIVE_P2_temp4498_7)), 4507));
        var s = (__HIVE_P2_temp4498_8 = this, __HIVE_P2_temp4498_9 = __HIVE_P2_get(__HIVE_P2_temp4498_8, "parseTemplateElement", 4510), __HIVE_P2_invoke(__HIVE_P2_temp4498_9, __HIVE_P2_temp4498_8, (__HIVE_P2_reserveArray(1, 4510), __HIVE_P2_ownArray([(__HIVE_P2_reserveObject(1, 4511), __HIVE_P2_ownObject({ isTagged: t }, 4511, 1, 8))], 4510, "CONTROL_ARRAY")), 4510));
        (__HIVE_P2_temp4498_10 = i, __HIVE_P2_temp4498_11 = "quasis", __HIVE_P2_set(__HIVE_P2_temp4498_10, __HIVE_P2_temp4498_11, (__HIVE_P2_temp4498_13 = 0, __HIVE_P2_temp4498_14 = s, __HIVE_P2_temp4498_13 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp4498_13, __HIVE_P2_temp4498_14, 4515), __HIVE_P2_checkArrayDepth(__HIVE_P2_temp4498_13, 4515), __HIVE_P2_reserveArray(1, 4515, 1), __HIVE_P2_ownArray([__HIVE_P2_temp4498_14], 4515, "ARRAY", __HIVE_P2_temp4498_13)), 4513));
        while (!__HIVE_P2_get(s, "tail", 4517)) {
            __HIVE_P2_tick(4516);
            if (__HIVE_P2_get(this, "type", 4518) === __HIVE_P2_get(m, "eof", 4519)) {
                __HIVE_P2_syntaxRefusal(4520);
            }
            (__HIVE_P2_temp4498_15 = this, __HIVE_P2_temp4498_16 = __HIVE_P2_get(__HIVE_P2_temp4498_15, "expect", 4521), __HIVE_P2_invoke(__HIVE_P2_temp4498_16, __HIVE_P2_temp4498_15, (__HIVE_P2_reserveArray(1, 4521), __HIVE_P2_ownArray([__HIVE_P2_get(m, "dollarBraceL", 4522)], 4521, "CONTROL_ARRAY")), 4521));
            (__HIVE_P2_temp4498_19 = __HIVE_P2_get(i, "expressions", 4528), __HIVE_P2_temp4498_20 = __HIVE_P2_get(__HIVE_P2_temp4498_19, "push", 4524), __HIVE_P2_invoke(__HIVE_P2_temp4498_20, __HIVE_P2_temp4498_19, (__HIVE_P2_reserveArray(1, 4524), __HIVE_P2_ownArray([(__HIVE_P2_temp4498_17 = this, __HIVE_P2_temp4498_18 = __HIVE_P2_get(__HIVE_P2_temp4498_17, "parseExpression", 4525), __HIVE_P2_invoke(__HIVE_P2_temp4498_18, __HIVE_P2_temp4498_17, (__HIVE_P2_reserveArray(0, 4525), __HIVE_P2_ownArray([], 4525, "CONTROL_ARRAY")), 4525))], 4524, "CONTROL_ARRAY")), 4524));
            (__HIVE_P2_temp4498_21 = this, __HIVE_P2_temp4498_22 = __HIVE_P2_get(__HIVE_P2_temp4498_21, "expect", 4529), __HIVE_P2_invoke(__HIVE_P2_temp4498_22, __HIVE_P2_temp4498_21, (__HIVE_P2_reserveArray(1, 4529), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceR", 4530)], 4529, "CONTROL_ARRAY")), 4529));
            (__HIVE_P2_temp4498_25 = __HIVE_P2_get(i, "quasis", 4538), __HIVE_P2_temp4498_26 = __HIVE_P2_get(__HIVE_P2_temp4498_25, "push", 4532), __HIVE_P2_invoke(__HIVE_P2_temp4498_26, __HIVE_P2_temp4498_25, (__HIVE_P2_reserveArray(1, 4532), __HIVE_P2_ownArray([s = (__HIVE_P2_temp4498_23 = this, __HIVE_P2_temp4498_24 = __HIVE_P2_get(__HIVE_P2_temp4498_23, "parseTemplateElement", 4534), __HIVE_P2_invoke(__HIVE_P2_temp4498_24, __HIVE_P2_temp4498_23, (__HIVE_P2_reserveArray(1, 4534), __HIVE_P2_ownArray([(__HIVE_P2_reserveObject(1, 4535), __HIVE_P2_ownObject({ isTagged: t }, 4535, 1, 8))], 4534, "CONTROL_ARRAY")), 4534))], 4532, "CONTROL_ARRAY")), 4532));
        }
        (__HIVE_P2_temp4498_27 = this, __HIVE_P2_temp4498_28 = __HIVE_P2_get(__HIVE_P2_temp4498_27, "next", 4539), __HIVE_P2_invoke(__HIVE_P2_temp4498_28, __HIVE_P2_temp4498_27, (__HIVE_P2_reserveArray(0, 4539), __HIVE_P2_ownArray([], 4539, "CONTROL_ARRAY")), 4539));
        return (__HIVE_P2_temp4498_29 = this, __HIVE_P2_temp4498_30 = __HIVE_P2_get(__HIVE_P2_temp4498_29, "finishNode", 4541), __HIVE_P2_invoke(__HIVE_P2_temp4498_30, __HIVE_P2_temp4498_29, (__HIVE_P2_reserveArray(2, 4541), __HIVE_P2_ownArray([i, "TemplateLiteral"], 4541, "CONTROL_ARRAY")), 4541));
    }, 34, 1, 0, 4498)), 4496));
    (__HIVE_P2_temp0_1335 = pe, __HIVE_P2_temp0_1336 = "isAsyncProp", __HIVE_P2_set(__HIVE_P2_temp0_1335, __HIVE_P2_temp0_1336, (__HIVE_P2_reserveFunction(4545), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp4545_0, __HIVE_P2_temp4545_1, __HIVE_P2_temp4545_2, __HIVE_P2_temp4545_3;
        return !__HIVE_P2_get(e, "computed", 4546) && __HIVE_P2_get(__HIVE_P2_get(e, "key", 4548), "type", 4547) === "Identifier" && __HIVE_P2_get(__HIVE_P2_get(e, "key", 4550), "name", 4549) === "async" && (__HIVE_P2_get(this, "type", 4551) === __HIVE_P2_get(m, "name", 4552) || __HIVE_P2_get(this, "type", 4553) === __HIVE_P2_get(m, "num", 4554) || __HIVE_P2_get(this, "type", 4555) === __HIVE_P2_get(m, "string", 4556) || __HIVE_P2_get(this, "type", 4557) === __HIVE_P2_get(m, "bracketL", 4558) || __HIVE_P2_get(__HIVE_P2_get(this, "type", 4560), "keyword", 4559) || __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4563), "ecmaVersion", 4562), 9, 4561) && __HIVE_P2_get(this, "type", 4564) === __HIVE_P2_get(m, "star", 4565)) && !(__HIVE_P2_temp4545_2 = g, __HIVE_P2_temp4545_3 = __HIVE_P2_get(__HIVE_P2_temp4545_2, "test", 4566), __HIVE_P2_invoke(__HIVE_P2_temp4545_3, __HIVE_P2_temp4545_2, (__HIVE_P2_reserveArray(1, 4566), __HIVE_P2_ownArray([(__HIVE_P2_temp4545_0 = __HIVE_P2_get(this, "input", 4571), __HIVE_P2_temp4545_1 = __HIVE_P2_get(__HIVE_P2_temp4545_0, "slice", 4567), __HIVE_P2_invoke(__HIVE_P2_temp4545_1, __HIVE_P2_temp4545_0, (__HIVE_P2_reserveArray(2, 4567), __HIVE_P2_ownArray([__HIVE_P2_get(this, "lastTokEnd", 4568), __HIVE_P2_get(this, "start", 4569)], 4567, "CONTROL_ARRAY")), 4567))], 4566, "CONTROL_ARRAY")), 4566));
    }, 4, 1, 0, 4545)), 4543));
    (__HIVE_P2_temp0_1338 = pe, __HIVE_P2_temp0_1339 = "parseObj", __HIVE_P2_set(__HIVE_P2_temp0_1338, __HIVE_P2_temp0_1339, (__HIVE_P2_reserveFunction(4575), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp4575_0, __HIVE_P2_temp4575_1, __HIVE_P2_temp4575_2, __HIVE_P2_temp4575_3, __HIVE_P2_temp4575_4, __HIVE_P2_temp4575_5, __HIVE_P2_temp4575_6, __HIVE_P2_temp4575_7, __HIVE_P2_temp4575_8, __HIVE_P2_temp4575_9, __HIVE_P2_temp4575_10, __HIVE_P2_temp4575_11, __HIVE_P2_temp4575_12, __HIVE_P2_temp4575_13, __HIVE_P2_temp4575_14, __HIVE_P2_temp4575_15, __HIVE_P2_temp4575_16, __HIVE_P2_temp4575_17, __HIVE_P2_temp4575_18, __HIVE_P2_temp4575_19, __HIVE_P2_temp4575_20, __HIVE_P2_temp4575_21;
        var i = (__HIVE_P2_temp4575_0 = this, __HIVE_P2_temp4575_1 = __HIVE_P2_get(__HIVE_P2_temp4575_0, "startNode", 4576), __HIVE_P2_invoke(__HIVE_P2_temp4575_1, __HIVE_P2_temp4575_0, (__HIVE_P2_reserveArray(0, 4576), __HIVE_P2_ownArray([], 4576, "CONTROL_ARRAY")), 4576)), s = true, r = (__HIVE_P2_reserveObject(0, 4578), __HIVE_P2_ownObject({}, 4578, 0, 0));
        (__HIVE_P2_temp4575_2 = i, __HIVE_P2_temp4575_3 = "properties", __HIVE_P2_set(__HIVE_P2_temp4575_2, __HIVE_P2_temp4575_3, (__HIVE_P2_temp4575_5 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp4575_5, 4581), __HIVE_P2_reserveArray(0, 4581, 0), __HIVE_P2_ownArray([], 4581, "ARRAY", __HIVE_P2_temp4575_5)), 4579));
        (__HIVE_P2_temp4575_6 = this, __HIVE_P2_temp4575_7 = __HIVE_P2_get(__HIVE_P2_temp4575_6, "next", 4582), __HIVE_P2_invoke(__HIVE_P2_temp4575_7, __HIVE_P2_temp4575_6, (__HIVE_P2_reserveArray(0, 4582), __HIVE_P2_ownArray([], 4582, "CONTROL_ARRAY")), 4582));
        while (!(__HIVE_P2_temp4575_8 = this, __HIVE_P2_temp4575_9 = __HIVE_P2_get(__HIVE_P2_temp4575_8, "eat", 4585), __HIVE_P2_invoke(__HIVE_P2_temp4575_9, __HIVE_P2_temp4575_8, (__HIVE_P2_reserveArray(1, 4585), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceR", 4586)], 4585, "CONTROL_ARRAY")), 4585))) {
            __HIVE_P2_tick(4584);
            if (!s) {
                (__HIVE_P2_temp4575_10 = this, __HIVE_P2_temp4575_11 = __HIVE_P2_get(__HIVE_P2_temp4575_10, "expect", 4588), __HIVE_P2_invoke(__HIVE_P2_temp4575_11, __HIVE_P2_temp4575_10, (__HIVE_P2_reserveArray(1, 4588), __HIVE_P2_ownArray([__HIVE_P2_get(m, "comma", 4589)], 4588, "CONTROL_ARRAY")), 4588));
                if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4593), "ecmaVersion", 4592), 5, 4591) && (__HIVE_P2_temp4575_12 = this, __HIVE_P2_temp4575_13 = __HIVE_P2_get(__HIVE_P2_temp4575_12, "afterTrailingComma", 4594), __HIVE_P2_invoke(__HIVE_P2_temp4575_13, __HIVE_P2_temp4575_12, (__HIVE_P2_reserveArray(1, 4594), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceR", 4595)], 4594, "CONTROL_ARRAY")), 4594))) {
                    break;
                }
            }
            else {
                s = false;
            }
            var a = (__HIVE_P2_temp4575_14 = this, __HIVE_P2_temp4575_15 = __HIVE_P2_get(__HIVE_P2_temp4575_14, "parseProperty", 4598), __HIVE_P2_invoke(__HIVE_P2_temp4575_15, __HIVE_P2_temp4575_14, (__HIVE_P2_reserveArray(2, 4598), __HIVE_P2_ownArray([e, t], 4598, "CONTROL_ARRAY")), 4598));
            if (!e) {
                (__HIVE_P2_temp4575_16 = this, __HIVE_P2_temp4575_17 = __HIVE_P2_get(__HIVE_P2_temp4575_16, "checkPropClash", 4600), __HIVE_P2_invoke(__HIVE_P2_temp4575_17, __HIVE_P2_temp4575_16, (__HIVE_P2_reserveArray(3, 4600), __HIVE_P2_ownArray([a, r, t], 4600, "CONTROL_ARRAY")), 4600));
            }
            (__HIVE_P2_temp4575_18 = __HIVE_P2_get(i, "properties", 4604), __HIVE_P2_temp4575_19 = __HIVE_P2_get(__HIVE_P2_temp4575_18, "push", 4602), __HIVE_P2_invoke(__HIVE_P2_temp4575_19, __HIVE_P2_temp4575_18, (__HIVE_P2_reserveArray(1, 4602), __HIVE_P2_ownArray([a], 4602, "CONTROL_ARRAY")), 4602));
        }
        return (__HIVE_P2_temp4575_20 = this, __HIVE_P2_temp4575_21 = __HIVE_P2_get(__HIVE_P2_temp4575_20, "finishNode", 4605), __HIVE_P2_invoke(__HIVE_P2_temp4575_21, __HIVE_P2_temp4575_20, (__HIVE_P2_reserveArray(2, 4605), __HIVE_P2_ownArray([i, e ? "ObjectPattern" : "ObjectExpression"], 4605, "CONTROL_ARRAY")), 4605));
    }, 26, 2, 0, 4575)), 4573));
    (__HIVE_P2_temp0_1341 = pe, __HIVE_P2_temp0_1342 = "parseProperty", __HIVE_P2_set(__HIVE_P2_temp0_1341, __HIVE_P2_temp0_1342, (__HIVE_P2_reserveFunction(4609), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp4609_0, __HIVE_P2_temp4609_1, __HIVE_P2_temp4609_2, __HIVE_P2_temp4609_3, __HIVE_P2_temp4609_4, __HIVE_P2_temp4609_5, __HIVE_P2_temp4609_6, __HIVE_P2_temp4609_7, __HIVE_P2_temp4609_8, __HIVE_P2_temp4609_9, __HIVE_P2_temp4609_10, __HIVE_P2_temp4609_11, __HIVE_P2_temp4609_12, __HIVE_P2_temp4609_13, __HIVE_P2_temp4609_14, __HIVE_P2_temp4609_15, __HIVE_P2_temp4609_16, __HIVE_P2_temp4609_17, __HIVE_P2_temp4609_18, __HIVE_P2_temp4609_19, __HIVE_P2_temp4609_20, __HIVE_P2_temp4609_21, __HIVE_P2_temp4609_22, __HIVE_P2_temp4609_23, __HIVE_P2_temp4609_24, __HIVE_P2_temp4609_25, __HIVE_P2_temp4609_26, __HIVE_P2_temp4609_27, __HIVE_P2_temp4609_28, __HIVE_P2_temp4609_29, __HIVE_P2_temp4609_30, __HIVE_P2_temp4609_31, __HIVE_P2_temp4609_32, __HIVE_P2_temp4609_33, __HIVE_P2_temp4609_34, __HIVE_P2_temp4609_35, __HIVE_P2_temp4609_36, __HIVE_P2_temp4609_37, __HIVE_P2_temp4609_38, __HIVE_P2_temp4609_39, __HIVE_P2_temp4609_40;
        var i = (__HIVE_P2_temp4609_0 = this, __HIVE_P2_temp4609_1 = __HIVE_P2_get(__HIVE_P2_temp4609_0, "startNode", 4610), __HIVE_P2_invoke(__HIVE_P2_temp4609_1, __HIVE_P2_temp4609_0, (__HIVE_P2_reserveArray(0, 4610), __HIVE_P2_ownArray([], 4610, "CONTROL_ARRAY")), 4610)), s, r, a, n;
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4614), "ecmaVersion", 4613), 9, 4612) && (__HIVE_P2_temp4609_2 = this, __HIVE_P2_temp4609_3 = __HIVE_P2_get(__HIVE_P2_temp4609_2, "eat", 4615), __HIVE_P2_invoke(__HIVE_P2_temp4609_3, __HIVE_P2_temp4609_2, (__HIVE_P2_reserveArray(1, 4615), __HIVE_P2_ownArray([__HIVE_P2_get(m, "ellipsis", 4616)], 4615, "CONTROL_ARRAY")), 4615))) {
            if (e) {
                (__HIVE_P2_temp4609_4 = i, __HIVE_P2_temp4609_5 = "argument", __HIVE_P2_set(__HIVE_P2_temp4609_4, __HIVE_P2_temp4609_5, (__HIVE_P2_temp4609_7 = this, __HIVE_P2_temp4609_8 = __HIVE_P2_get(__HIVE_P2_temp4609_7, "parseIdent", 4620), __HIVE_P2_invoke(__HIVE_P2_temp4609_8, __HIVE_P2_temp4609_7, (__HIVE_P2_reserveArray(1, 4620), __HIVE_P2_ownArray([false], 4620, "CONTROL_ARRAY")), 4620)), 4618));
                if (__HIVE_P2_get(this, "type", 4622) === __HIVE_P2_get(m, "comma", 4623)) {
                    __HIVE_P2_syntaxRefusal(4624);
                }
                return (__HIVE_P2_temp4609_9 = this, __HIVE_P2_temp4609_10 = __HIVE_P2_get(__HIVE_P2_temp4609_9, "finishNode", 4625), __HIVE_P2_invoke(__HIVE_P2_temp4609_10, __HIVE_P2_temp4609_9, (__HIVE_P2_reserveArray(2, 4625), __HIVE_P2_ownArray([i, "RestElement"], 4625, "CONTROL_ARRAY")), 4625));
            }
            (__HIVE_P2_temp4609_11 = i, __HIVE_P2_temp4609_12 = "argument", __HIVE_P2_set(__HIVE_P2_temp4609_11, __HIVE_P2_temp4609_12, (__HIVE_P2_temp4609_14 = this, __HIVE_P2_temp4609_15 = __HIVE_P2_get(__HIVE_P2_temp4609_14, "parseMaybeAssign", 4629), __HIVE_P2_invoke(__HIVE_P2_temp4609_15, __HIVE_P2_temp4609_14, (__HIVE_P2_reserveArray(2, 4629), __HIVE_P2_ownArray([false, t], 4629, "CONTROL_ARRAY")), 4629)), 4627));
            if (__HIVE_P2_get(this, "type", 4631) === __HIVE_P2_get(m, "comma", 4632) && t && __HIVE_P2_binary("<", __HIVE_P2_get(t, "trailingComma", 4634), 0, 4633)) {
                (__HIVE_P2_temp4609_16 = t, __HIVE_P2_temp4609_17 = "trailingComma", __HIVE_P2_set(__HIVE_P2_temp4609_16, __HIVE_P2_temp4609_17, __HIVE_P2_get(this, "start", 4637), 4635));
            }
            return (__HIVE_P2_temp4609_19 = this, __HIVE_P2_temp4609_20 = __HIVE_P2_get(__HIVE_P2_temp4609_19, "finishNode", 4638), __HIVE_P2_invoke(__HIVE_P2_temp4609_20, __HIVE_P2_temp4609_19, (__HIVE_P2_reserveArray(2, 4638), __HIVE_P2_ownArray([i, "SpreadElement"], 4638, "CONTROL_ARRAY")), 4638));
        }
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4642), "ecmaVersion", 4641), 6, 4640)) {
            (__HIVE_P2_temp4609_21 = i, __HIVE_P2_temp4609_22 = "method", __HIVE_P2_set(__HIVE_P2_temp4609_21, __HIVE_P2_temp4609_22, false, 4643));
            (__HIVE_P2_temp4609_24 = i, __HIVE_P2_temp4609_25 = "shorthand", __HIVE_P2_set(__HIVE_P2_temp4609_24, __HIVE_P2_temp4609_25, false, 4645));
            if (e || t) {
                a = __HIVE_P2_get(this, "start", 4648);
                n = __HIVE_P2_get(this, "startLoc", 4650);
            }
            if (!e) {
                s = (__HIVE_P2_temp4609_27 = this, __HIVE_P2_temp4609_28 = __HIVE_P2_get(__HIVE_P2_temp4609_27, "eat", 4652), __HIVE_P2_invoke(__HIVE_P2_temp4609_28, __HIVE_P2_temp4609_27, (__HIVE_P2_reserveArray(1, 4652), __HIVE_P2_ownArray([__HIVE_P2_get(m, "star", 4653)], 4652, "CONTROL_ARRAY")), 4652));
            }
        }
        var o = __HIVE_P2_get(this, "containsEsc", 4655);
        (__HIVE_P2_temp4609_29 = this, __HIVE_P2_temp4609_30 = __HIVE_P2_get(__HIVE_P2_temp4609_29, "parsePropertyName", 4656), __HIVE_P2_invoke(__HIVE_P2_temp4609_30, __HIVE_P2_temp4609_29, (__HIVE_P2_reserveArray(1, 4656), __HIVE_P2_ownArray([i], 4656, "CONTROL_ARRAY")), 4656));
        if (!e && !o && __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4660), "ecmaVersion", 4659), 8, 4658) && !s && (__HIVE_P2_temp4609_31 = this, __HIVE_P2_temp4609_32 = __HIVE_P2_get(__HIVE_P2_temp4609_31, "isAsyncProp", 4661), __HIVE_P2_invoke(__HIVE_P2_temp4609_32, __HIVE_P2_temp4609_31, (__HIVE_P2_reserveArray(1, 4661), __HIVE_P2_ownArray([i], 4661, "CONTROL_ARRAY")), 4661))) {
            r = true;
            s = __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4667), "ecmaVersion", 4666), 9, 4665) && (__HIVE_P2_temp4609_33 = this, __HIVE_P2_temp4609_34 = __HIVE_P2_get(__HIVE_P2_temp4609_33, "eat", 4668), __HIVE_P2_invoke(__HIVE_P2_temp4609_34, __HIVE_P2_temp4609_33, (__HIVE_P2_reserveArray(1, 4668), __HIVE_P2_ownArray([__HIVE_P2_get(m, "star", 4669)], 4668, "CONTROL_ARRAY")), 4668));
            (__HIVE_P2_temp4609_35 = this, __HIVE_P2_temp4609_36 = __HIVE_P2_get(__HIVE_P2_temp4609_35, "parsePropertyName", 4671), __HIVE_P2_invoke(__HIVE_P2_temp4609_36, __HIVE_P2_temp4609_35, (__HIVE_P2_reserveArray(1, 4671), __HIVE_P2_ownArray([i], 4671, "CONTROL_ARRAY")), 4671));
        }
        else {
            r = false;
        }
        (__HIVE_P2_temp4609_37 = this, __HIVE_P2_temp4609_38 = __HIVE_P2_get(__HIVE_P2_temp4609_37, "parsePropertyValue", 4674), __HIVE_P2_invoke(__HIVE_P2_temp4609_38, __HIVE_P2_temp4609_37, (__HIVE_P2_reserveArray(8, 4674), __HIVE_P2_ownArray([i, e, s, r, a, n, t, o], 4674, "CONTROL_ARRAY")), 4674));
        return (__HIVE_P2_temp4609_39 = this, __HIVE_P2_temp4609_40 = __HIVE_P2_get(__HIVE_P2_temp4609_39, "finishNode", 4676), __HIVE_P2_invoke(__HIVE_P2_temp4609_40, __HIVE_P2_temp4609_39, (__HIVE_P2_reserveArray(2, 4676), __HIVE_P2_ownArray([i, "Property"], 4676, "CONTROL_ARRAY")), 4676));
    }, 47, 2, 0, 4609)), 4607));
    (__HIVE_P2_temp0_1344 = pe, __HIVE_P2_temp0_1345 = "parseGetterSetter", __HIVE_P2_set(__HIVE_P2_temp0_1344, __HIVE_P2_temp0_1345, (__HIVE_P2_reserveFunction(4680), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp4680_0, __HIVE_P2_temp4680_1, __HIVE_P2_temp4680_2, __HIVE_P2_temp4680_3, __HIVE_P2_temp4680_4, __HIVE_P2_temp4680_5, __HIVE_P2_temp4680_6, __HIVE_P2_temp4680_7, __HIVE_P2_temp4680_8, __HIVE_P2_temp4680_9;
        (__HIVE_P2_temp4680_0 = e, __HIVE_P2_temp4680_1 = "kind", __HIVE_P2_set(__HIVE_P2_temp4680_0, __HIVE_P2_temp4680_1, __HIVE_P2_get(__HIVE_P2_get(e, "key", 4684), "name", 4683), 4681));
        (__HIVE_P2_temp4680_3 = this, __HIVE_P2_temp4680_4 = __HIVE_P2_get(__HIVE_P2_temp4680_3, "parsePropertyName", 4685), __HIVE_P2_invoke(__HIVE_P2_temp4680_4, __HIVE_P2_temp4680_3, (__HIVE_P2_reserveArray(1, 4685), __HIVE_P2_ownArray([e], 4685, "CONTROL_ARRAY")), 4685));
        (__HIVE_P2_temp4680_5 = e, __HIVE_P2_temp4680_6 = "value", __HIVE_P2_set(__HIVE_P2_temp4680_5, __HIVE_P2_temp4680_6, (__HIVE_P2_temp4680_8 = this, __HIVE_P2_temp4680_9 = __HIVE_P2_get(__HIVE_P2_temp4680_8, "parseMethod", 4689), __HIVE_P2_invoke(__HIVE_P2_temp4680_9, __HIVE_P2_temp4680_8, (__HIVE_P2_reserveArray(1, 4689), __HIVE_P2_ownArray([false], 4689, "CONTROL_ARRAY")), 4689)), 4687));
        var t = __HIVE_P2_get(e, "kind", 4691) === "get" ? 0 : 1;
        if (__HIVE_P2_get(__HIVE_P2_get(__HIVE_P2_get(e, "value", 4694), "params", 4693), "length", 4692) !== t) {
            var i = __HIVE_P2_get(__HIVE_P2_get(e, "value", 4696), "start", 4695);
            if (__HIVE_P2_get(e, "kind", 4697) === "get") {
                __HIVE_P2_syntaxRefusal(4698);
            }
            else {
                __HIVE_P2_syntaxRefusal(4699);
            }
        }
        else {
            if (__HIVE_P2_get(e, "kind", 4700) === "set" && __HIVE_P2_get(__HIVE_P2_get(__HIVE_P2_get(__HIVE_P2_get(e, "value", 4704), "params", 4703), 0, 4702), "type", 4701) === "RestElement") {
                __HIVE_P2_syntaxRefusal(4705);
            }
        }
    }, 12, 1, 0, 4680)), 4678));
    (__HIVE_P2_temp0_1347 = pe, __HIVE_P2_temp0_1348 = "parsePropertyValue", __HIVE_P2_set(__HIVE_P2_temp0_1347, __HIVE_P2_temp0_1348, (__HIVE_P2_reserveFunction(4708), __HIVE_P2_registerFunction(function (e, t, i, s, r, a, n, o) {
        var __HIVE_P2_temp4708_0, __HIVE_P2_temp4708_1, __HIVE_P2_temp4708_2, __HIVE_P2_temp4708_3, __HIVE_P2_temp4708_4, __HIVE_P2_temp4708_5, __HIVE_P2_temp4708_6, __HIVE_P2_temp4708_7, __HIVE_P2_temp4708_8, __HIVE_P2_temp4708_9, __HIVE_P2_temp4708_10, __HIVE_P2_temp4708_11, __HIVE_P2_temp4708_12, __HIVE_P2_temp4708_13, __HIVE_P2_temp4708_14, __HIVE_P2_temp4708_15, __HIVE_P2_temp4708_16, __HIVE_P2_temp4708_17, __HIVE_P2_temp4708_18, __HIVE_P2_temp4708_19, __HIVE_P2_temp4708_20, __HIVE_P2_temp4708_21, __HIVE_P2_temp4708_22, __HIVE_P2_temp4708_23, __HIVE_P2_temp4708_24, __HIVE_P2_temp4708_25, __HIVE_P2_temp4708_26, __HIVE_P2_temp4708_27, __HIVE_P2_temp4708_28, __HIVE_P2_temp4708_29, __HIVE_P2_temp4708_30, __HIVE_P2_temp4708_31, __HIVE_P2_temp4708_32, __HIVE_P2_temp4708_33, __HIVE_P2_temp4708_34, __HIVE_P2_temp4708_35, __HIVE_P2_temp4708_36, __HIVE_P2_temp4708_37, __HIVE_P2_temp4708_38, __HIVE_P2_temp4708_39, __HIVE_P2_temp4708_40, __HIVE_P2_temp4708_41, __HIVE_P2_temp4708_42, __HIVE_P2_temp4708_43, __HIVE_P2_temp4708_44, __HIVE_P2_temp4708_45, __HIVE_P2_temp4708_46, __HIVE_P2_temp4708_47, __HIVE_P2_temp4708_48, __HIVE_P2_temp4708_49, __HIVE_P2_temp4708_50, __HIVE_P2_temp4708_51, __HIVE_P2_temp4708_52, __HIVE_P2_temp4708_53, __HIVE_P2_temp4708_54, __HIVE_P2_temp4708_55, __HIVE_P2_temp4708_56, __HIVE_P2_temp4708_57;
        if ((i || s) && __HIVE_P2_get(this, "type", 4709) === __HIVE_P2_get(m, "colon", 4710)) {
            __HIVE_P2_syntaxRefusal(4711);
        }
        if ((__HIVE_P2_temp4708_0 = this, __HIVE_P2_temp4708_1 = __HIVE_P2_get(__HIVE_P2_temp4708_0, "eat", 4712), __HIVE_P2_invoke(__HIVE_P2_temp4708_1, __HIVE_P2_temp4708_0, (__HIVE_P2_reserveArray(1, 4712), __HIVE_P2_ownArray([__HIVE_P2_get(m, "colon", 4713)], 4712, "CONTROL_ARRAY")), 4712))) {
            (__HIVE_P2_temp4708_2 = e, __HIVE_P2_temp4708_3 = "value", __HIVE_P2_set(__HIVE_P2_temp4708_2, __HIVE_P2_temp4708_3, t ? (__HIVE_P2_temp4708_5 = this, __HIVE_P2_temp4708_6 = __HIVE_P2_get(__HIVE_P2_temp4708_5, "parseMaybeDefault", 4717), __HIVE_P2_invoke(__HIVE_P2_temp4708_6, __HIVE_P2_temp4708_5, (__HIVE_P2_reserveArray(2, 4717), __HIVE_P2_ownArray([__HIVE_P2_get(this, "start", 4718), __HIVE_P2_get(this, "startLoc", 4719)], 4717, "CONTROL_ARRAY")), 4717)) : (__HIVE_P2_temp4708_7 = this, __HIVE_P2_temp4708_8 = __HIVE_P2_get(__HIVE_P2_temp4708_7, "parseMaybeAssign", 4721), __HIVE_P2_invoke(__HIVE_P2_temp4708_8, __HIVE_P2_temp4708_7, (__HIVE_P2_reserveArray(2, 4721), __HIVE_P2_ownArray([false, n], 4721, "CONTROL_ARRAY")), 4721)), 4715));
            (__HIVE_P2_temp4708_9 = e, __HIVE_P2_temp4708_10 = "kind", __HIVE_P2_set(__HIVE_P2_temp4708_9, __HIVE_P2_temp4708_10, "init", 4723));
        }
        else if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4727), "ecmaVersion", 4726), 6, 4725) && __HIVE_P2_get(this, "type", 4728) === __HIVE_P2_get(m, "parenL", 4729)) {
            if (t) {
                __HIVE_P2_syntaxRefusal(4730);
            }
            (__HIVE_P2_temp4708_12 = e, __HIVE_P2_temp4708_13 = "kind", __HIVE_P2_set(__HIVE_P2_temp4708_12, __HIVE_P2_temp4708_13, "init", 4731));
            (__HIVE_P2_temp4708_15 = e, __HIVE_P2_temp4708_16 = "method", __HIVE_P2_set(__HIVE_P2_temp4708_15, __HIVE_P2_temp4708_16, true, 4733));
            (__HIVE_P2_temp4708_18 = e, __HIVE_P2_temp4708_19 = "value", __HIVE_P2_set(__HIVE_P2_temp4708_18, __HIVE_P2_temp4708_19, (__HIVE_P2_temp4708_21 = this, __HIVE_P2_temp4708_22 = __HIVE_P2_get(__HIVE_P2_temp4708_21, "parseMethod", 4737), __HIVE_P2_invoke(__HIVE_P2_temp4708_22, __HIVE_P2_temp4708_21, (__HIVE_P2_reserveArray(2, 4737), __HIVE_P2_ownArray([i, s], 4737, "CONTROL_ARRAY")), 4737)), 4735));
        }
        else if (!t && !o && __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4741), "ecmaVersion", 4740), 5, 4739) && !__HIVE_P2_get(e, "computed", 4742) && __HIVE_P2_get(__HIVE_P2_get(e, "key", 4744), "type", 4743) === "Identifier" && (__HIVE_P2_get(__HIVE_P2_get(e, "key", 4746), "name", 4745) === "get" || __HIVE_P2_get(__HIVE_P2_get(e, "key", 4748), "name", 4747) === "set") && (__HIVE_P2_get(this, "type", 4749) !== __HIVE_P2_get(m, "comma", 4750) && __HIVE_P2_get(this, "type", 4751) !== __HIVE_P2_get(m, "braceR", 4752) && __HIVE_P2_get(this, "type", 4753) !== __HIVE_P2_get(m, "eq", 4754))) {
            if (i || s) {
                __HIVE_P2_syntaxRefusal(4755);
            }
            (__HIVE_P2_temp4708_23 = this, __HIVE_P2_temp4708_24 = __HIVE_P2_get(__HIVE_P2_temp4708_23, "parseGetterSetter", 4756), __HIVE_P2_invoke(__HIVE_P2_temp4708_24, __HIVE_P2_temp4708_23, (__HIVE_P2_reserveArray(1, 4756), __HIVE_P2_ownArray([e], 4756, "CONTROL_ARRAY")), 4756));
        }
        else if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4760), "ecmaVersion", 4759), 6, 4758) && !__HIVE_P2_get(e, "computed", 4761) && __HIVE_P2_get(__HIVE_P2_get(e, "key", 4763), "type", 4762) === "Identifier") {
            if (i || s) {
                __HIVE_P2_syntaxRefusal(4764);
            }
            (__HIVE_P2_temp4708_25 = this, __HIVE_P2_temp4708_26 = __HIVE_P2_get(__HIVE_P2_temp4708_25, "checkUnreserved", 4765), __HIVE_P2_invoke(__HIVE_P2_temp4708_26, __HIVE_P2_temp4708_25, (__HIVE_P2_reserveArray(1, 4765), __HIVE_P2_ownArray([__HIVE_P2_get(e, "key", 4766)], 4765, "CONTROL_ARRAY")), 4765));
            if (__HIVE_P2_get(__HIVE_P2_get(e, "key", 4769), "name", 4768) === "await" && !__HIVE_P2_get(this, "awaitIdentPos", 4770)) {
                (__HIVE_P2_temp4708_27 = this, __HIVE_P2_temp4708_28 = "awaitIdentPos", __HIVE_P2_set(__HIVE_P2_temp4708_27, __HIVE_P2_temp4708_28, r, 4771));
            }
            (__HIVE_P2_temp4708_30 = e, __HIVE_P2_temp4708_31 = "kind", __HIVE_P2_set(__HIVE_P2_temp4708_30, __HIVE_P2_temp4708_31, "init", 4773));
            if (t) {
                (__HIVE_P2_temp4708_33 = e, __HIVE_P2_temp4708_34 = "value", __HIVE_P2_set(__HIVE_P2_temp4708_33, __HIVE_P2_temp4708_34, (__HIVE_P2_temp4708_38 = this, __HIVE_P2_temp4708_39 = __HIVE_P2_get(__HIVE_P2_temp4708_38, "parseMaybeDefault", 4777), __HIVE_P2_invoke(__HIVE_P2_temp4708_39, __HIVE_P2_temp4708_38, (__HIVE_P2_reserveArray(3, 4777), __HIVE_P2_ownArray([r, a, (__HIVE_P2_temp4708_36 = this, __HIVE_P2_temp4708_37 = __HIVE_P2_get(__HIVE_P2_temp4708_36, "copyNode", 4778), __HIVE_P2_invoke(__HIVE_P2_temp4708_37, __HIVE_P2_temp4708_36, (__HIVE_P2_reserveArray(1, 4778), __HIVE_P2_ownArray([__HIVE_P2_get(e, "key", 4779)], 4778, "CONTROL_ARRAY")), 4778))], 4777, "CONTROL_ARRAY")), 4777)), 4775));
            }
            else if (__HIVE_P2_get(this, "type", 4782) === __HIVE_P2_get(m, "eq", 4783) && n) {
                if (__HIVE_P2_binary("<", __HIVE_P2_get(n, "shorthandAssign", 4785), 0, 4784)) {
                    (__HIVE_P2_temp4708_40 = n, __HIVE_P2_temp4708_41 = "shorthandAssign", __HIVE_P2_set(__HIVE_P2_temp4708_40, __HIVE_P2_temp4708_41, __HIVE_P2_get(this, "start", 4788), 4786));
                }
                (__HIVE_P2_temp4708_43 = e, __HIVE_P2_temp4708_44 = "value", __HIVE_P2_set(__HIVE_P2_temp4708_43, __HIVE_P2_temp4708_44, (__HIVE_P2_temp4708_48 = this, __HIVE_P2_temp4708_49 = __HIVE_P2_get(__HIVE_P2_temp4708_48, "parseMaybeDefault", 4791), __HIVE_P2_invoke(__HIVE_P2_temp4708_49, __HIVE_P2_temp4708_48, (__HIVE_P2_reserveArray(3, 4791), __HIVE_P2_ownArray([r, a, (__HIVE_P2_temp4708_46 = this, __HIVE_P2_temp4708_47 = __HIVE_P2_get(__HIVE_P2_temp4708_46, "copyNode", 4792), __HIVE_P2_invoke(__HIVE_P2_temp4708_47, __HIVE_P2_temp4708_46, (__HIVE_P2_reserveArray(1, 4792), __HIVE_P2_ownArray([__HIVE_P2_get(e, "key", 4793)], 4792, "CONTROL_ARRAY")), 4792))], 4791, "CONTROL_ARRAY")), 4791)), 4789));
            }
            else {
                (__HIVE_P2_temp4708_50 = e, __HIVE_P2_temp4708_51 = "value", __HIVE_P2_set(__HIVE_P2_temp4708_50, __HIVE_P2_temp4708_51, (__HIVE_P2_temp4708_53 = this, __HIVE_P2_temp4708_54 = __HIVE_P2_get(__HIVE_P2_temp4708_53, "copyNode", 4798), __HIVE_P2_invoke(__HIVE_P2_temp4708_54, __HIVE_P2_temp4708_53, (__HIVE_P2_reserveArray(1, 4798), __HIVE_P2_ownArray([__HIVE_P2_get(e, "key", 4799)], 4798, "CONTROL_ARRAY")), 4798)), 4796));
            }
            (__HIVE_P2_temp4708_55 = e, __HIVE_P2_temp4708_56 = "shorthand", __HIVE_P2_set(__HIVE_P2_temp4708_55, __HIVE_P2_temp4708_56, true, 4801));
        }
        else {
            __HIVE_P2_syntaxRefusal(4803);
        }
    }, 58, 8, 0, 4708)), 4706));
    (__HIVE_P2_temp0_1350 = pe, __HIVE_P2_temp0_1351 = "parsePropertyName", __HIVE_P2_set(__HIVE_P2_temp0_1350, __HIVE_P2_temp0_1351, (__HIVE_P2_reserveFunction(4806), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp4806_0, __HIVE_P2_temp4806_1, __HIVE_P2_temp4806_2, __HIVE_P2_temp4806_3, __HIVE_P2_temp4806_4, __HIVE_P2_temp4806_5, __HIVE_P2_temp4806_6, __HIVE_P2_temp4806_7, __HIVE_P2_temp4806_8, __HIVE_P2_temp4806_9, __HIVE_P2_temp4806_10, __HIVE_P2_temp4806_11, __HIVE_P2_temp4806_12, __HIVE_P2_temp4806_13, __HIVE_P2_temp4806_14, __HIVE_P2_temp4806_15, __HIVE_P2_temp4806_16, __HIVE_P2_temp4806_17, __HIVE_P2_temp4806_18, __HIVE_P2_temp4806_19, __HIVE_P2_temp4806_20, __HIVE_P2_temp4806_21;
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4809), "ecmaVersion", 4808), 6, 4807)) {
            if ((__HIVE_P2_temp4806_0 = this, __HIVE_P2_temp4806_1 = __HIVE_P2_get(__HIVE_P2_temp4806_0, "eat", 4810), __HIVE_P2_invoke(__HIVE_P2_temp4806_1, __HIVE_P2_temp4806_0, (__HIVE_P2_reserveArray(1, 4810), __HIVE_P2_ownArray([__HIVE_P2_get(m, "bracketL", 4811)], 4810, "CONTROL_ARRAY")), 4810))) {
                (__HIVE_P2_temp4806_2 = e, __HIVE_P2_temp4806_3 = "computed", __HIVE_P2_set(__HIVE_P2_temp4806_2, __HIVE_P2_temp4806_3, true, 4813));
                (__HIVE_P2_temp4806_5 = e, __HIVE_P2_temp4806_6 = "key", __HIVE_P2_set(__HIVE_P2_temp4806_5, __HIVE_P2_temp4806_6, (__HIVE_P2_temp4806_8 = this, __HIVE_P2_temp4806_9 = __HIVE_P2_get(__HIVE_P2_temp4806_8, "parseMaybeAssign", 4817), __HIVE_P2_invoke(__HIVE_P2_temp4806_9, __HIVE_P2_temp4806_8, (__HIVE_P2_reserveArray(0, 4817), __HIVE_P2_ownArray([], 4817, "CONTROL_ARRAY")), 4817)), 4815));
                (__HIVE_P2_temp4806_10 = this, __HIVE_P2_temp4806_11 = __HIVE_P2_get(__HIVE_P2_temp4806_10, "expect", 4819), __HIVE_P2_invoke(__HIVE_P2_temp4806_11, __HIVE_P2_temp4806_10, (__HIVE_P2_reserveArray(1, 4819), __HIVE_P2_ownArray([__HIVE_P2_get(m, "bracketR", 4820)], 4819, "CONTROL_ARRAY")), 4819));
                return __HIVE_P2_get(e, "key", 4822);
            }
            else {
                (__HIVE_P2_temp4806_12 = e, __HIVE_P2_temp4806_13 = "computed", __HIVE_P2_set(__HIVE_P2_temp4806_12, __HIVE_P2_temp4806_13, false, 4823));
            }
        }
        return (__HIVE_P2_temp4806_15 = e, __HIVE_P2_temp4806_16 = "key", __HIVE_P2_set(__HIVE_P2_temp4806_15, __HIVE_P2_temp4806_16, __HIVE_P2_get(this, "type", 4827) === __HIVE_P2_get(m, "num", 4828) || __HIVE_P2_get(this, "type", 4829) === __HIVE_P2_get(m, "string", 4830) ? (__HIVE_P2_temp4806_18 = this, __HIVE_P2_temp4806_19 = __HIVE_P2_get(__HIVE_P2_temp4806_18, "parseExprAtom", 4831), __HIVE_P2_invoke(__HIVE_P2_temp4806_19, __HIVE_P2_temp4806_18, (__HIVE_P2_reserveArray(0, 4831), __HIVE_P2_ownArray([], 4831, "CONTROL_ARRAY")), 4831)) : (__HIVE_P2_temp4806_20 = this, __HIVE_P2_temp4806_21 = __HIVE_P2_get(__HIVE_P2_temp4806_20, "parseIdent", 4833), __HIVE_P2_invoke(__HIVE_P2_temp4806_21, __HIVE_P2_temp4806_20, (__HIVE_P2_reserveArray(1, 4833), __HIVE_P2_ownArray([__HIVE_P2_get(__HIVE_P2_get(this, "options", 4835), "allowReserved", 4834) !== "never"], 4833, "CONTROL_ARRAY")), 4833)), 4825));
    }, 22, 1, 0, 4806)), 4804));
    (__HIVE_P2_temp0_1353 = pe, __HIVE_P2_temp0_1354 = "initFunction", __HIVE_P2_set(__HIVE_P2_temp0_1353, __HIVE_P2_temp0_1354, (__HIVE_P2_reserveFunction(4839), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp4839_0, __HIVE_P2_temp4839_1, __HIVE_P2_temp4839_2, __HIVE_P2_temp4839_3, __HIVE_P2_temp4839_4, __HIVE_P2_temp4839_5, __HIVE_P2_temp4839_6, __HIVE_P2_temp4839_7, __HIVE_P2_temp4839_8, __HIVE_P2_temp4839_9, __HIVE_P2_temp4839_10, __HIVE_P2_temp4839_11;
        (__HIVE_P2_temp4839_0 = e, __HIVE_P2_temp4839_1 = "id", __HIVE_P2_set(__HIVE_P2_temp4839_0, __HIVE_P2_temp4839_1, null, 4840));
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4844), "ecmaVersion", 4843), 6, 4842)) {
            (__HIVE_P2_temp4839_3 = e, __HIVE_P2_temp4839_4 = "generator", __HIVE_P2_set(__HIVE_P2_temp4839_3, __HIVE_P2_temp4839_4, (__HIVE_P2_temp4839_6 = e, __HIVE_P2_temp4839_7 = "expression", __HIVE_P2_set(__HIVE_P2_temp4839_6, __HIVE_P2_temp4839_7, false, 4847)), 4845));
        }
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4851), "ecmaVersion", 4850), 8, 4849)) {
            (__HIVE_P2_temp4839_9 = e, __HIVE_P2_temp4839_10 = "async", __HIVE_P2_set(__HIVE_P2_temp4839_9, __HIVE_P2_temp4839_10, false, 4852));
        }
    }, 12, 1, 0, 4839)), 4837));
    (__HIVE_P2_temp0_1356 = pe, __HIVE_P2_temp0_1357 = "parseMethod", __HIVE_P2_set(__HIVE_P2_temp0_1356, __HIVE_P2_temp0_1357, (__HIVE_P2_reserveFunction(4856), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp4856_0, __HIVE_P2_temp4856_1, __HIVE_P2_temp4856_2, __HIVE_P2_temp4856_3, __HIVE_P2_temp4856_4, __HIVE_P2_temp4856_5, __HIVE_P2_temp4856_6, __HIVE_P2_temp4856_7, __HIVE_P2_temp4856_8, __HIVE_P2_temp4856_9, __HIVE_P2_temp4856_10, __HIVE_P2_temp4856_11, __HIVE_P2_temp4856_12, __HIVE_P2_temp4856_13, __HIVE_P2_temp4856_14, __HIVE_P2_temp4856_15, __HIVE_P2_temp4856_16, __HIVE_P2_temp4856_17, __HIVE_P2_temp4856_18, __HIVE_P2_temp4856_19, __HIVE_P2_temp4856_20, __HIVE_P2_temp4856_21, __HIVE_P2_temp4856_22, __HIVE_P2_temp4856_23, __HIVE_P2_temp4856_24, __HIVE_P2_temp4856_25, __HIVE_P2_temp4856_26, __HIVE_P2_temp4856_27, __HIVE_P2_temp4856_28, __HIVE_P2_temp4856_29, __HIVE_P2_temp4856_30, __HIVE_P2_temp4856_31, __HIVE_P2_temp4856_32, __HIVE_P2_temp4856_33, __HIVE_P2_temp4856_34, __HIVE_P2_temp4856_35, __HIVE_P2_temp4856_36, __HIVE_P2_temp4856_37, __HIVE_P2_temp4856_38, __HIVE_P2_temp4856_39, __HIVE_P2_temp4856_40, __HIVE_P2_temp4856_41, __HIVE_P2_temp4856_42;
        var s = (__HIVE_P2_temp4856_0 = this, __HIVE_P2_temp4856_1 = __HIVE_P2_get(__HIVE_P2_temp4856_0, "startNode", 4857), __HIVE_P2_invoke(__HIVE_P2_temp4856_1, __HIVE_P2_temp4856_0, (__HIVE_P2_reserveArray(0, 4857), __HIVE_P2_ownArray([], 4857, "CONTROL_ARRAY")), 4857)), r = __HIVE_P2_get(this, "yieldPos", 4859), a = __HIVE_P2_get(this, "awaitPos", 4860), n = __HIVE_P2_get(this, "awaitIdentPos", 4861);
        (__HIVE_P2_temp4856_2 = this, __HIVE_P2_temp4856_3 = __HIVE_P2_get(__HIVE_P2_temp4856_2, "initFunction", 4862), __HIVE_P2_invoke(__HIVE_P2_temp4856_3, __HIVE_P2_temp4856_2, (__HIVE_P2_reserveArray(1, 4862), __HIVE_P2_ownArray([s], 4862, "CONTROL_ARRAY")), 4862));
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4866), "ecmaVersion", 4865), 6, 4864)) {
            (__HIVE_P2_temp4856_4 = s, __HIVE_P2_temp4856_5 = "generator", __HIVE_P2_set(__HIVE_P2_temp4856_4, __HIVE_P2_temp4856_5, e, 4867));
        }
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4871), "ecmaVersion", 4870), 8, 4869)) {
            (__HIVE_P2_temp4856_7 = s, __HIVE_P2_temp4856_8 = "async", __HIVE_P2_set(__HIVE_P2_temp4856_7, __HIVE_P2_temp4856_8, !!t, 4872));
        }
        (__HIVE_P2_temp4856_10 = this, __HIVE_P2_temp4856_11 = "yieldPos", __HIVE_P2_set(__HIVE_P2_temp4856_10, __HIVE_P2_temp4856_11, 0, 4874));
        (__HIVE_P2_temp4856_13 = this, __HIVE_P2_temp4856_14 = "awaitPos", __HIVE_P2_set(__HIVE_P2_temp4856_13, __HIVE_P2_temp4856_14, 0, 4876));
        (__HIVE_P2_temp4856_16 = this, __HIVE_P2_temp4856_17 = "awaitIdentPos", __HIVE_P2_set(__HIVE_P2_temp4856_16, __HIVE_P2_temp4856_17, 0, 4878));
        (__HIVE_P2_temp4856_19 = this, __HIVE_P2_temp4856_20 = __HIVE_P2_get(__HIVE_P2_temp4856_19, "enterScope", 4880), __HIVE_P2_invoke(__HIVE_P2_temp4856_20, __HIVE_P2_temp4856_19, (__HIVE_P2_reserveArray(1, 4880), __HIVE_P2_ownArray([__HIVE_P2_binary("|", __HIVE_P2_binary("|", __HIVE_P2_invoke(functionFlags, void 0, (__HIVE_P2_reserveArray(2, 4883), __HIVE_P2_ownArray([t, __HIVE_P2_get(s, "generator", 4884)], 4883, "CONTROL_ARRAY")), 4883), B, 4882), (i ? M : 0), 4881)], 4880, "CONTROL_ARRAY")), 4880));
        (__HIVE_P2_temp4856_21 = this, __HIVE_P2_temp4856_22 = __HIVE_P2_get(__HIVE_P2_temp4856_21, "expect", 4886), __HIVE_P2_invoke(__HIVE_P2_temp4856_22, __HIVE_P2_temp4856_21, (__HIVE_P2_reserveArray(1, 4886), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenL", 4887)], 4886, "CONTROL_ARRAY")), 4886));
        (__HIVE_P2_temp4856_23 = s, __HIVE_P2_temp4856_24 = "params", __HIVE_P2_set(__HIVE_P2_temp4856_23, __HIVE_P2_temp4856_24, (__HIVE_P2_temp4856_26 = this, __HIVE_P2_temp4856_27 = __HIVE_P2_get(__HIVE_P2_temp4856_26, "parseBindingList", 4891), __HIVE_P2_invoke(__HIVE_P2_temp4856_27, __HIVE_P2_temp4856_26, (__HIVE_P2_reserveArray(3, 4891), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 4892), false, __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4895), "ecmaVersion", 4894), 8, 4893)], 4891, "CONTROL_ARRAY")), 4891)), 4889));
        (__HIVE_P2_temp4856_28 = this, __HIVE_P2_temp4856_29 = __HIVE_P2_get(__HIVE_P2_temp4856_28, "checkYieldAwaitInDefaultParams", 4897), __HIVE_P2_invoke(__HIVE_P2_temp4856_29, __HIVE_P2_temp4856_28, (__HIVE_P2_reserveArray(0, 4897), __HIVE_P2_ownArray([], 4897, "CONTROL_ARRAY")), 4897));
        (__HIVE_P2_temp4856_30 = this, __HIVE_P2_temp4856_31 = __HIVE_P2_get(__HIVE_P2_temp4856_30, "parseFunctionBody", 4899), __HIVE_P2_invoke(__HIVE_P2_temp4856_31, __HIVE_P2_temp4856_30, (__HIVE_P2_reserveArray(4, 4899), __HIVE_P2_ownArray([s, false, true, false], 4899, "CONTROL_ARRAY")), 4899));
        (__HIVE_P2_temp4856_32 = this, __HIVE_P2_temp4856_33 = "yieldPos", __HIVE_P2_set(__HIVE_P2_temp4856_32, __HIVE_P2_temp4856_33, r, 4901));
        (__HIVE_P2_temp4856_35 = this, __HIVE_P2_temp4856_36 = "awaitPos", __HIVE_P2_set(__HIVE_P2_temp4856_35, __HIVE_P2_temp4856_36, a, 4903));
        (__HIVE_P2_temp4856_38 = this, __HIVE_P2_temp4856_39 = "awaitIdentPos", __HIVE_P2_set(__HIVE_P2_temp4856_38, __HIVE_P2_temp4856_39, n, 4905));
        return (__HIVE_P2_temp4856_41 = this, __HIVE_P2_temp4856_42 = __HIVE_P2_get(__HIVE_P2_temp4856_41, "finishNode", 4907), __HIVE_P2_invoke(__HIVE_P2_temp4856_42, __HIVE_P2_temp4856_41, (__HIVE_P2_reserveArray(2, 4907), __HIVE_P2_ownArray([s, "FunctionExpression"], 4907, "CONTROL_ARRAY")), 4907));
    }, 47, 3, 0, 4856)), 4854));
    (__HIVE_P2_temp0_1359 = pe, __HIVE_P2_temp0_1360 = "parseArrowExpression", __HIVE_P2_set(__HIVE_P2_temp0_1359, __HIVE_P2_temp0_1360, (__HIVE_P2_reserveFunction(4911), __HIVE_P2_registerFunction(function (e, t, i, s) {
        var __HIVE_P2_temp4911_0, __HIVE_P2_temp4911_1, __HIVE_P2_temp4911_2, __HIVE_P2_temp4911_3, __HIVE_P2_temp4911_4, __HIVE_P2_temp4911_5, __HIVE_P2_temp4911_6, __HIVE_P2_temp4911_7, __HIVE_P2_temp4911_8, __HIVE_P2_temp4911_9, __HIVE_P2_temp4911_10, __HIVE_P2_temp4911_11, __HIVE_P2_temp4911_12, __HIVE_P2_temp4911_13, __HIVE_P2_temp4911_14, __HIVE_P2_temp4911_15, __HIVE_P2_temp4911_16, __HIVE_P2_temp4911_17, __HIVE_P2_temp4911_18, __HIVE_P2_temp4911_19, __HIVE_P2_temp4911_20, __HIVE_P2_temp4911_21, __HIVE_P2_temp4911_22, __HIVE_P2_temp4911_23, __HIVE_P2_temp4911_24, __HIVE_P2_temp4911_25, __HIVE_P2_temp4911_26, __HIVE_P2_temp4911_27, __HIVE_P2_temp4911_28, __HIVE_P2_temp4911_29, __HIVE_P2_temp4911_30, __HIVE_P2_temp4911_31, __HIVE_P2_temp4911_32, __HIVE_P2_temp4911_33;
        var r = __HIVE_P2_get(this, "yieldPos", 4912), a = __HIVE_P2_get(this, "awaitPos", 4913), n = __HIVE_P2_get(this, "awaitIdentPos", 4914);
        (__HIVE_P2_temp4911_0 = this, __HIVE_P2_temp4911_1 = __HIVE_P2_get(__HIVE_P2_temp4911_0, "enterScope", 4915), __HIVE_P2_invoke(__HIVE_P2_temp4911_1, __HIVE_P2_temp4911_0, (__HIVE_P2_reserveArray(1, 4915), __HIVE_P2_ownArray([__HIVE_P2_binary("|", __HIVE_P2_invoke(functionFlags, void 0, (__HIVE_P2_reserveArray(2, 4917), __HIVE_P2_ownArray([i, false], 4917, "CONTROL_ARRAY")), 4917), D, 4916)], 4915, "CONTROL_ARRAY")), 4915));
        (__HIVE_P2_temp4911_2 = this, __HIVE_P2_temp4911_3 = __HIVE_P2_get(__HIVE_P2_temp4911_2, "initFunction", 4919), __HIVE_P2_invoke(__HIVE_P2_temp4911_3, __HIVE_P2_temp4911_2, (__HIVE_P2_reserveArray(1, 4919), __HIVE_P2_ownArray([e], 4919, "CONTROL_ARRAY")), 4919));
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4923), "ecmaVersion", 4922), 8, 4921)) {
            (__HIVE_P2_temp4911_4 = e, __HIVE_P2_temp4911_5 = "async", __HIVE_P2_set(__HIVE_P2_temp4911_4, __HIVE_P2_temp4911_5, !!i, 4924));
        }
        (__HIVE_P2_temp4911_7 = this, __HIVE_P2_temp4911_8 = "yieldPos", __HIVE_P2_set(__HIVE_P2_temp4911_7, __HIVE_P2_temp4911_8, 0, 4926));
        (__HIVE_P2_temp4911_10 = this, __HIVE_P2_temp4911_11 = "awaitPos", __HIVE_P2_set(__HIVE_P2_temp4911_10, __HIVE_P2_temp4911_11, 0, 4928));
        (__HIVE_P2_temp4911_13 = this, __HIVE_P2_temp4911_14 = "awaitIdentPos", __HIVE_P2_set(__HIVE_P2_temp4911_13, __HIVE_P2_temp4911_14, 0, 4930));
        (__HIVE_P2_temp4911_16 = e, __HIVE_P2_temp4911_17 = "params", __HIVE_P2_set(__HIVE_P2_temp4911_16, __HIVE_P2_temp4911_17, (__HIVE_P2_temp4911_19 = this, __HIVE_P2_temp4911_20 = __HIVE_P2_get(__HIVE_P2_temp4911_19, "toAssignableList", 4934), __HIVE_P2_invoke(__HIVE_P2_temp4911_20, __HIVE_P2_temp4911_19, (__HIVE_P2_reserveArray(2, 4934), __HIVE_P2_ownArray([t, true], 4934, "CONTROL_ARRAY")), 4934)), 4932));
        (__HIVE_P2_temp4911_21 = this, __HIVE_P2_temp4911_22 = __HIVE_P2_get(__HIVE_P2_temp4911_21, "parseFunctionBody", 4936), __HIVE_P2_invoke(__HIVE_P2_temp4911_22, __HIVE_P2_temp4911_21, (__HIVE_P2_reserveArray(4, 4936), __HIVE_P2_ownArray([e, true, false, s], 4936, "CONTROL_ARRAY")), 4936));
        (__HIVE_P2_temp4911_23 = this, __HIVE_P2_temp4911_24 = "yieldPos", __HIVE_P2_set(__HIVE_P2_temp4911_23, __HIVE_P2_temp4911_24, r, 4938));
        (__HIVE_P2_temp4911_26 = this, __HIVE_P2_temp4911_27 = "awaitPos", __HIVE_P2_set(__HIVE_P2_temp4911_26, __HIVE_P2_temp4911_27, a, 4940));
        (__HIVE_P2_temp4911_29 = this, __HIVE_P2_temp4911_30 = "awaitIdentPos", __HIVE_P2_set(__HIVE_P2_temp4911_29, __HIVE_P2_temp4911_30, n, 4942));
        return (__HIVE_P2_temp4911_32 = this, __HIVE_P2_temp4911_33 = __HIVE_P2_get(__HIVE_P2_temp4911_32, "finishNode", 4944), __HIVE_P2_invoke(__HIVE_P2_temp4911_33, __HIVE_P2_temp4911_32, (__HIVE_P2_reserveArray(2, 4944), __HIVE_P2_ownArray([e, "ArrowFunctionExpression"], 4944, "CONTROL_ARRAY")), 4944));
    }, 37, 4, 0, 4911)), 4909));
    (__HIVE_P2_temp0_1362 = pe, __HIVE_P2_temp0_1363 = "parseFunctionBody", __HIVE_P2_set(__HIVE_P2_temp0_1362, __HIVE_P2_temp0_1363, (__HIVE_P2_reserveFunction(4948), __HIVE_P2_registerFunction(function (e, t, i, s) {
        var __HIVE_P2_temp4948_0, __HIVE_P2_temp4948_1, __HIVE_P2_temp4948_2, __HIVE_P2_temp4948_3, __HIVE_P2_temp4948_4, __HIVE_P2_temp4948_5, __HIVE_P2_temp4948_6, __HIVE_P2_temp4948_7, __HIVE_P2_temp4948_8, __HIVE_P2_temp4948_9, __HIVE_P2_temp4948_10, __HIVE_P2_temp4948_11, __HIVE_P2_temp4948_12, __HIVE_P2_temp4948_13, __HIVE_P2_temp4948_14, __HIVE_P2_temp4948_15, __HIVE_P2_temp4948_16, __HIVE_P2_temp4948_17, __HIVE_P2_temp4948_18, __HIVE_P2_temp4948_19, __HIVE_P2_temp4948_20, __HIVE_P2_temp4948_21, __HIVE_P2_temp4948_22, __HIVE_P2_temp4948_23, __HIVE_P2_temp4948_24, __HIVE_P2_temp4948_25, __HIVE_P2_temp4948_26, __HIVE_P2_temp4948_27, __HIVE_P2_temp4948_28, __HIVE_P2_temp4948_29, __HIVE_P2_temp4948_30, __HIVE_P2_temp4948_31, __HIVE_P2_temp4948_32, __HIVE_P2_temp4948_33, __HIVE_P2_temp4948_34, __HIVE_P2_temp4948_35, __HIVE_P2_temp4948_36, __HIVE_P2_temp4948_37, __HIVE_P2_temp4948_38, __HIVE_P2_temp4948_39, __HIVE_P2_temp4948_40, __HIVE_P2_temp4948_41;
        var r = t && __HIVE_P2_get(this, "type", 4949) !== __HIVE_P2_get(m, "braceL", 4950);
        var a = __HIVE_P2_get(this, "strict", 4951), n = false;
        if (r) {
            (__HIVE_P2_temp4948_0 = e, __HIVE_P2_temp4948_1 = "body", __HIVE_P2_set(__HIVE_P2_temp4948_0, __HIVE_P2_temp4948_1, (__HIVE_P2_temp4948_3 = this, __HIVE_P2_temp4948_4 = __HIVE_P2_get(__HIVE_P2_temp4948_3, "parseMaybeAssign", 4954), __HIVE_P2_invoke(__HIVE_P2_temp4948_4, __HIVE_P2_temp4948_3, (__HIVE_P2_reserveArray(1, 4954), __HIVE_P2_ownArray([s], 4954, "CONTROL_ARRAY")), 4954)), 4952));
            (__HIVE_P2_temp4948_5 = e, __HIVE_P2_temp4948_6 = "expression", __HIVE_P2_set(__HIVE_P2_temp4948_5, __HIVE_P2_temp4948_6, true, 4956));
            (__HIVE_P2_temp4948_8 = this, __HIVE_P2_temp4948_9 = __HIVE_P2_get(__HIVE_P2_temp4948_8, "checkParams", 4958), __HIVE_P2_invoke(__HIVE_P2_temp4948_9, __HIVE_P2_temp4948_8, (__HIVE_P2_reserveArray(2, 4958), __HIVE_P2_ownArray([e, false], 4958, "CONTROL_ARRAY")), 4958));
        }
        else {
            var o = __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 4962), "ecmaVersion", 4961), 7, 4960) && !(__HIVE_P2_temp4948_10 = this, __HIVE_P2_temp4948_11 = __HIVE_P2_get(__HIVE_P2_temp4948_10, "isSimpleParamList", 4963), __HIVE_P2_invoke(__HIVE_P2_temp4948_11, __HIVE_P2_temp4948_10, (__HIVE_P2_reserveArray(1, 4963), __HIVE_P2_ownArray([__HIVE_P2_get(e, "params", 4964)], 4963, "CONTROL_ARRAY")), 4963));
            if (!a || o) {
                n = (__HIVE_P2_temp4948_12 = this, __HIVE_P2_temp4948_13 = __HIVE_P2_get(__HIVE_P2_temp4948_12, "strictDirective", 4967), __HIVE_P2_invoke(__HIVE_P2_temp4948_13, __HIVE_P2_temp4948_12, (__HIVE_P2_reserveArray(1, 4967), __HIVE_P2_ownArray([__HIVE_P2_get(this, "end", 4968)], 4967, "CONTROL_ARRAY")), 4967));
                if (n && o) {
                    __HIVE_P2_syntaxRefusal(4970);
                }
            }
            var h = __HIVE_P2_get(this, "labels", 4971);
            (__HIVE_P2_temp4948_14 = this, __HIVE_P2_temp4948_15 = "labels", __HIVE_P2_set(__HIVE_P2_temp4948_14, __HIVE_P2_temp4948_15, (__HIVE_P2_temp4948_17 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp4948_17, 4974), __HIVE_P2_reserveArray(0, 4974, 0), __HIVE_P2_ownArray([], 4974, "ARRAY", __HIVE_P2_temp4948_17)), 4972));
            if (n) {
                (__HIVE_P2_temp4948_18 = this, __HIVE_P2_temp4948_19 = "strict", __HIVE_P2_set(__HIVE_P2_temp4948_18, __HIVE_P2_temp4948_19, true, 4975));
            }
            (__HIVE_P2_temp4948_23 = this, __HIVE_P2_temp4948_24 = __HIVE_P2_get(__HIVE_P2_temp4948_23, "checkParams", 4977), __HIVE_P2_invoke(__HIVE_P2_temp4948_24, __HIVE_P2_temp4948_23, (__HIVE_P2_reserveArray(2, 4977), __HIVE_P2_ownArray([e, !a && !n && !t && !i && (__HIVE_P2_temp4948_21 = this, __HIVE_P2_temp4948_22 = __HIVE_P2_get(__HIVE_P2_temp4948_21, "isSimpleParamList", 4978), __HIVE_P2_invoke(__HIVE_P2_temp4948_22, __HIVE_P2_temp4948_21, (__HIVE_P2_reserveArray(1, 4978), __HIVE_P2_ownArray([__HIVE_P2_get(e, "params", 4979)], 4978, "CONTROL_ARRAY")), 4978))], 4977, "CONTROL_ARRAY")), 4977));
            if (__HIVE_P2_get(this, "strict", 4982) && __HIVE_P2_get(e, "id", 4983)) {
                (__HIVE_P2_temp4948_25 = this, __HIVE_P2_temp4948_26 = __HIVE_P2_get(__HIVE_P2_temp4948_25, "checkLValSimple", 4984), __HIVE_P2_invoke(__HIVE_P2_temp4948_26, __HIVE_P2_temp4948_25, (__HIVE_P2_reserveArray(2, 4984), __HIVE_P2_ownArray([__HIVE_P2_get(e, "id", 4985), z], 4984, "CONTROL_ARRAY")), 4984));
            }
            (__HIVE_P2_temp4948_27 = e, __HIVE_P2_temp4948_28 = "body", __HIVE_P2_set(__HIVE_P2_temp4948_27, __HIVE_P2_temp4948_28, (__HIVE_P2_temp4948_30 = this, __HIVE_P2_temp4948_31 = __HIVE_P2_get(__HIVE_P2_temp4948_30, "parseBlock", 4989), __HIVE_P2_invoke(__HIVE_P2_temp4948_31, __HIVE_P2_temp4948_30, (__HIVE_P2_reserveArray(3, 4989), __HIVE_P2_ownArray([false, undefined, n && !a], 4989, "CONTROL_ARRAY")), 4989)), 4987));
            (__HIVE_P2_temp4948_32 = e, __HIVE_P2_temp4948_33 = "expression", __HIVE_P2_set(__HIVE_P2_temp4948_32, __HIVE_P2_temp4948_33, false, 4991));
            (__HIVE_P2_temp4948_35 = this, __HIVE_P2_temp4948_36 = __HIVE_P2_get(__HIVE_P2_temp4948_35, "adaptDirectivePrologue", 4993), __HIVE_P2_invoke(__HIVE_P2_temp4948_36, __HIVE_P2_temp4948_35, (__HIVE_P2_reserveArray(1, 4993), __HIVE_P2_ownArray([__HIVE_P2_get(__HIVE_P2_get(e, "body", 4995), "body", 4994)], 4993, "CONTROL_ARRAY")), 4993));
            (__HIVE_P2_temp4948_37 = this, __HIVE_P2_temp4948_38 = "labels", __HIVE_P2_set(__HIVE_P2_temp4948_37, __HIVE_P2_temp4948_38, h, 4997));
        }
        (__HIVE_P2_temp4948_40 = this, __HIVE_P2_temp4948_41 = __HIVE_P2_get(__HIVE_P2_temp4948_40, "exitScope", 4999), __HIVE_P2_invoke(__HIVE_P2_temp4948_41, __HIVE_P2_temp4948_40, (__HIVE_P2_reserveArray(0, 4999), __HIVE_P2_ownArray([], 4999, "CONTROL_ARRAY")), 4999));
    }, 47, 4, 0, 4948)), 4946));
    (__HIVE_P2_temp0_1365 = pe, __HIVE_P2_temp0_1366 = "isSimpleParamList", __HIVE_P2_set(__HIVE_P2_temp0_1365, __HIVE_P2_temp0_1366, (__HIVE_P2_reserveFunction(5003), __HIVE_P2_registerFunction(function (e) {
        for (var t = 0, i = e; __HIVE_P2_binary("<", t, __HIVE_P2_get(i, "length", 5006), 5005); t = __HIVE_P2_binary("+", t, 1, 5007)) {
            __HIVE_P2_tick(5004);
            var s = __HIVE_P2_get(i, t, 5008);
            if (__HIVE_P2_get(s, "type", 5009) !== "Identifier") {
                return false;
            }
        }
        return true;
    }, 3, 1, 0, 5003)), 5001));
    (__HIVE_P2_temp0_1368 = pe, __HIVE_P2_temp0_1369 = "checkParams", __HIVE_P2_set(__HIVE_P2_temp0_1368, __HIVE_P2_temp0_1369, (__HIVE_P2_reserveFunction(5012), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp5012_0, __HIVE_P2_temp5012_1, __HIVE_P2_temp5012_2, __HIVE_P2_temp5012_3;
        var i = (__HIVE_P2_temp5012_0 = __HIVE_P2_Object, __HIVE_P2_temp5012_1 = __HIVE_P2_get(__HIVE_P2_temp5012_0, "create", 5013), __HIVE_P2_invoke(__HIVE_P2_temp5012_1, __HIVE_P2_temp5012_0, (__HIVE_P2_reserveArray(1, 5013), __HIVE_P2_ownArray([null], 5013, "CONTROL_ARRAY")), 5013));
        for (var s = 0, r = __HIVE_P2_get(e, "params", 5016); __HIVE_P2_binary("<", s, __HIVE_P2_get(r, "length", 5018), 5017); s = __HIVE_P2_binary("+", s, 1, 5019)) {
            __HIVE_P2_tick(5015);
            var a = __HIVE_P2_get(r, s, 5020);
            (__HIVE_P2_temp5012_2 = this, __HIVE_P2_temp5012_3 = __HIVE_P2_get(__HIVE_P2_temp5012_2, "checkLValInnerPattern", 5021), __HIVE_P2_invoke(__HIVE_P2_temp5012_3, __HIVE_P2_temp5012_2, (__HIVE_P2_reserveArray(3, 5021), __HIVE_P2_ownArray([a, j, t ? null : i], 5021, "CONTROL_ARRAY")), 5021));
        }
    }, 8, 2, 0, 5012)), 5010));
    (__HIVE_P2_temp0_1371 = pe, __HIVE_P2_temp0_1372 = "parseExprList", __HIVE_P2_set(__HIVE_P2_temp0_1371, __HIVE_P2_temp0_1372, (__HIVE_P2_reserveFunction(5025), __HIVE_P2_registerFunction(function (e, t, i, s) {
        var __HIVE_P2_temp5025_0, __HIVE_P2_temp5025_1, __HIVE_P2_temp5025_2, __HIVE_P2_temp5025_3, __HIVE_P2_temp5025_4, __HIVE_P2_temp5025_5, __HIVE_P2_temp5025_6, __HIVE_P2_temp5025_7, __HIVE_P2_temp5025_8, __HIVE_P2_temp5025_9, __HIVE_P2_temp5025_10, __HIVE_P2_temp5025_11, __HIVE_P2_temp5025_12, __HIVE_P2_temp5025_13, __HIVE_P2_temp5025_14, __HIVE_P2_temp5025_15;
        var r = (__HIVE_P2_temp5025_0 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp5025_0, 5026), __HIVE_P2_reserveArray(0, 5026, 0), __HIVE_P2_ownArray([], 5026, "ARRAY", __HIVE_P2_temp5025_0)), a = true;
        while (!(__HIVE_P2_temp5025_1 = this, __HIVE_P2_temp5025_2 = __HIVE_P2_get(__HIVE_P2_temp5025_1, "eat", 5028), __HIVE_P2_invoke(__HIVE_P2_temp5025_2, __HIVE_P2_temp5025_1, (__HIVE_P2_reserveArray(1, 5028), __HIVE_P2_ownArray([e], 5028, "CONTROL_ARRAY")), 5028))) {
            __HIVE_P2_tick(5027);
            if (!a) {
                (__HIVE_P2_temp5025_3 = this, __HIVE_P2_temp5025_4 = __HIVE_P2_get(__HIVE_P2_temp5025_3, "expect", 5030), __HIVE_P2_invoke(__HIVE_P2_temp5025_4, __HIVE_P2_temp5025_3, (__HIVE_P2_reserveArray(1, 5030), __HIVE_P2_ownArray([__HIVE_P2_get(m, "comma", 5031)], 5030, "CONTROL_ARRAY")), 5030));
                if (t && (__HIVE_P2_temp5025_5 = this, __HIVE_P2_temp5025_6 = __HIVE_P2_get(__HIVE_P2_temp5025_5, "afterTrailingComma", 5033), __HIVE_P2_invoke(__HIVE_P2_temp5025_6, __HIVE_P2_temp5025_5, (__HIVE_P2_reserveArray(1, 5033), __HIVE_P2_ownArray([e], 5033, "CONTROL_ARRAY")), 5033))) {
                    break;
                }
            }
            else {
                a = false;
            }
            var n = void 0;
            if (i && __HIVE_P2_get(this, "type", 5036) === __HIVE_P2_get(m, "comma", 5037)) {
                n = null;
            }
            else if (__HIVE_P2_get(this, "type", 5039) === __HIVE_P2_get(m, "ellipsis", 5040)) {
                n = (__HIVE_P2_temp5025_7 = this, __HIVE_P2_temp5025_8 = __HIVE_P2_get(__HIVE_P2_temp5025_7, "parseSpread", 5042), __HIVE_P2_invoke(__HIVE_P2_temp5025_8, __HIVE_P2_temp5025_7, (__HIVE_P2_reserveArray(1, 5042), __HIVE_P2_ownArray([s], 5042, "CONTROL_ARRAY")), 5042));
                if (s && __HIVE_P2_get(this, "type", 5044) === __HIVE_P2_get(m, "comma", 5045) && __HIVE_P2_binary("<", __HIVE_P2_get(s, "trailingComma", 5047), 0, 5046)) {
                    (__HIVE_P2_temp5025_9 = s, __HIVE_P2_temp5025_10 = "trailingComma", __HIVE_P2_set(__HIVE_P2_temp5025_9, __HIVE_P2_temp5025_10, __HIVE_P2_get(this, "start", 5050), 5048));
                }
            }
            else {
                n = (__HIVE_P2_temp5025_12 = this, __HIVE_P2_temp5025_13 = __HIVE_P2_get(__HIVE_P2_temp5025_12, "parseMaybeAssign", 5052), __HIVE_P2_invoke(__HIVE_P2_temp5025_13, __HIVE_P2_temp5025_12, (__HIVE_P2_reserveArray(2, 5052), __HIVE_P2_ownArray([false, s], 5052, "CONTROL_ARRAY")), 5052));
            }
            (__HIVE_P2_temp5025_14 = r, __HIVE_P2_temp5025_15 = __HIVE_P2_get(__HIVE_P2_temp5025_14, "push", 5054), __HIVE_P2_invoke(__HIVE_P2_temp5025_15, __HIVE_P2_temp5025_14, (__HIVE_P2_reserveArray(1, 5054), __HIVE_P2_ownArray([n], 5054, "CONTROL_ARRAY")), 5054));
        }
        return r;
    }, 19, 4, 0, 5025)), 5023));
    (__HIVE_P2_temp0_1374 = pe, __HIVE_P2_temp0_1375 = "checkUnreserved", __HIVE_P2_set(__HIVE_P2_temp0_1374, __HIVE_P2_temp0_1375, (__HIVE_P2_reserveFunction(5058), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp5058_0, __HIVE_P2_temp5058_1, __HIVE_P2_temp5058_2, __HIVE_P2_temp5058_3, __HIVE_P2_temp5058_4, __HIVE_P2_temp5058_5, __HIVE_P2_temp5058_6, __HIVE_P2_temp5058_7, __HIVE_P2_temp5058_8, __HIVE_P2_temp5058_9;
        var t = __HIVE_P2_get(e, "start", 5059);
        var i = __HIVE_P2_get(e, "end", 5060);
        var s = __HIVE_P2_get(e, "name", 5061);
        if (__HIVE_P2_get(this, "inGenerator", 5062) && s === "yield") {
            __HIVE_P2_syntaxRefusal(5063);
        }
        if (__HIVE_P2_get(this, "inAsync", 5064) && s === "await") {
            __HIVE_P2_syntaxRefusal(5065);
        }
        if (__HIVE_P2_get((__HIVE_P2_temp5058_0 = this, __HIVE_P2_temp5058_1 = __HIVE_P2_get(__HIVE_P2_temp5058_0, "currentThisScope", 5067), __HIVE_P2_invoke(__HIVE_P2_temp5058_1, __HIVE_P2_temp5058_0, (__HIVE_P2_reserveArray(0, 5067), __HIVE_P2_ownArray([], 5067, "CONTROL_ARRAY")), 5067)), "inClassFieldInit", 5066) && s === "arguments") {
            __HIVE_P2_syntaxRefusal(5069);
        }
        if (__HIVE_P2_get(this, "inClassStaticBlock", 5070) && (s === "arguments" || s === "await")) {
            __HIVE_P2_syntaxRefusal(5071);
        }
        if ((__HIVE_P2_temp5058_2 = __HIVE_P2_get(this, "keywords", 5074), __HIVE_P2_temp5058_3 = __HIVE_P2_get(__HIVE_P2_temp5058_2, "test", 5072), __HIVE_P2_invoke(__HIVE_P2_temp5058_3, __HIVE_P2_temp5058_2, (__HIVE_P2_reserveArray(1, 5072), __HIVE_P2_ownArray([s], 5072, "CONTROL_ARRAY")), 5072))) {
            __HIVE_P2_syntaxRefusal(5075);
        }
        if (__HIVE_P2_binary("<", __HIVE_P2_get(__HIVE_P2_get(this, "options", 5078), "ecmaVersion", 5077), 6, 5076) && (__HIVE_P2_temp5058_4 = (__HIVE_P2_temp5058_6 = __HIVE_P2_get(this, "input", 5083), __HIVE_P2_temp5058_7 = __HIVE_P2_get(__HIVE_P2_temp5058_6, "slice", 5081), __HIVE_P2_invoke(__HIVE_P2_temp5058_7, __HIVE_P2_temp5058_6, (__HIVE_P2_reserveArray(2, 5081), __HIVE_P2_ownArray([t, i], 5081, "CONTROL_ARRAY")), 5081)), __HIVE_P2_temp5058_5 = __HIVE_P2_get(__HIVE_P2_temp5058_4, "indexOf", 5079), __HIVE_P2_invoke(__HIVE_P2_temp5058_5, __HIVE_P2_temp5058_4, (__HIVE_P2_reserveArray(1, 5079), __HIVE_P2_ownArray(["\\"], 5079, "CONTROL_ARRAY")), 5079)) !== __HIVE_P2_unary("-", 1, 5084)) {
            return;
        }
        var r = __HIVE_P2_get(this, "strict", 5085) ? __HIVE_P2_get(this, "reservedWordsStrict", 5086) : __HIVE_P2_get(this, "reservedWords", 5087);
        if ((__HIVE_P2_temp5058_8 = r, __HIVE_P2_temp5058_9 = __HIVE_P2_get(__HIVE_P2_temp5058_8, "test", 5088), __HIVE_P2_invoke(__HIVE_P2_temp5058_9, __HIVE_P2_temp5058_8, (__HIVE_P2_reserveArray(1, 5088), __HIVE_P2_ownArray([s], 5088, "CONTROL_ARRAY")), 5088))) {
            if (!__HIVE_P2_get(this, "inAsync", 5090) && s === "await") {
                __HIVE_P2_syntaxRefusal(5091);
            }
            __HIVE_P2_syntaxRefusal(5092);
        }
    }, 14, 1, 0, 5058)), 5056));
    (__HIVE_P2_temp0_1377 = pe, __HIVE_P2_temp0_1378 = "parseIdent", __HIVE_P2_set(__HIVE_P2_temp0_1377, __HIVE_P2_temp0_1378, (__HIVE_P2_reserveFunction(5095), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp5095_0, __HIVE_P2_temp5095_1, __HIVE_P2_temp5095_2, __HIVE_P2_temp5095_3, __HIVE_P2_temp5095_4, __HIVE_P2_temp5095_5, __HIVE_P2_temp5095_6, __HIVE_P2_temp5095_7, __HIVE_P2_temp5095_8, __HIVE_P2_temp5095_9, __HIVE_P2_temp5095_10;
        var t = (__HIVE_P2_temp5095_0 = this, __HIVE_P2_temp5095_1 = __HIVE_P2_get(__HIVE_P2_temp5095_0, "parseIdentNode", 5096), __HIVE_P2_invoke(__HIVE_P2_temp5095_1, __HIVE_P2_temp5095_0, (__HIVE_P2_reserveArray(0, 5096), __HIVE_P2_ownArray([], 5096, "CONTROL_ARRAY")), 5096));
        (__HIVE_P2_temp5095_2 = this, __HIVE_P2_temp5095_3 = __HIVE_P2_get(__HIVE_P2_temp5095_2, "next", 5098), __HIVE_P2_invoke(__HIVE_P2_temp5095_3, __HIVE_P2_temp5095_2, (__HIVE_P2_reserveArray(1, 5098), __HIVE_P2_ownArray([!!e], 5098, "CONTROL_ARRAY")), 5098));
        (__HIVE_P2_temp5095_4 = this, __HIVE_P2_temp5095_5 = __HIVE_P2_get(__HIVE_P2_temp5095_4, "finishNode", 5100), __HIVE_P2_invoke(__HIVE_P2_temp5095_5, __HIVE_P2_temp5095_4, (__HIVE_P2_reserveArray(2, 5100), __HIVE_P2_ownArray([t, "Identifier"], 5100, "CONTROL_ARRAY")), 5100));
        if (!e) {
            (__HIVE_P2_temp5095_6 = this, __HIVE_P2_temp5095_7 = __HIVE_P2_get(__HIVE_P2_temp5095_6, "checkUnreserved", 5102), __HIVE_P2_invoke(__HIVE_P2_temp5095_7, __HIVE_P2_temp5095_6, (__HIVE_P2_reserveArray(1, 5102), __HIVE_P2_ownArray([t], 5102, "CONTROL_ARRAY")), 5102));
            if (__HIVE_P2_get(t, "name", 5104) === "await" && !__HIVE_P2_get(this, "awaitIdentPos", 5105)) {
                (__HIVE_P2_temp5095_8 = this, __HIVE_P2_temp5095_9 = "awaitIdentPos", __HIVE_P2_set(__HIVE_P2_temp5095_8, __HIVE_P2_temp5095_9, __HIVE_P2_get(t, "start", 5108), 5106));
            }
        }
        return t;
    }, 12, 1, 0, 5095)), 5093));
    (__HIVE_P2_temp0_1380 = pe, __HIVE_P2_temp0_1381 = "parseIdentNode", __HIVE_P2_set(__HIVE_P2_temp0_1380, __HIVE_P2_temp0_1381, (__HIVE_P2_reserveFunction(5111), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp5111_0, __HIVE_P2_temp5111_1, __HIVE_P2_temp5111_2, __HIVE_P2_temp5111_3, __HIVE_P2_temp5111_4, __HIVE_P2_temp5111_5, __HIVE_P2_temp5111_6, __HIVE_P2_temp5111_7, __HIVE_P2_temp5111_8, __HIVE_P2_temp5111_9, __HIVE_P2_temp5111_10, __HIVE_P2_temp5111_11, __HIVE_P2_temp5111_12, __HIVE_P2_temp5111_13, __HIVE_P2_temp5111_14;
        var e = (__HIVE_P2_temp5111_0 = this, __HIVE_P2_temp5111_1 = __HIVE_P2_get(__HIVE_P2_temp5111_0, "startNode", 5112), __HIVE_P2_invoke(__HIVE_P2_temp5111_1, __HIVE_P2_temp5111_0, (__HIVE_P2_reserveArray(0, 5112), __HIVE_P2_ownArray([], 5112, "CONTROL_ARRAY")), 5112));
        if (__HIVE_P2_get(this, "type", 5114) === __HIVE_P2_get(m, "name", 5115)) {
            (__HIVE_P2_temp5111_2 = e, __HIVE_P2_temp5111_3 = "name", __HIVE_P2_set(__HIVE_P2_temp5111_2, __HIVE_P2_temp5111_3, __HIVE_P2_get(this, "value", 5118), 5116));
        }
        else if (__HIVE_P2_get(__HIVE_P2_get(this, "type", 5120), "keyword", 5119)) {
            (__HIVE_P2_temp5111_5 = e, __HIVE_P2_temp5111_6 = "name", __HIVE_P2_set(__HIVE_P2_temp5111_5, __HIVE_P2_temp5111_6, __HIVE_P2_get(__HIVE_P2_get(this, "type", 5124), "keyword", 5123), 5121));
            if ((__HIVE_P2_get(e, "name", 5125) === "class" || __HIVE_P2_get(e, "name", 5126) === "function") && (__HIVE_P2_get(this, "lastTokEnd", 5127) !== __HIVE_P2_binary("+", __HIVE_P2_get(this, "lastTokStart", 5129), 1, 5128) || (__HIVE_P2_temp5111_8 = __HIVE_P2_get(this, "input", 5133), __HIVE_P2_temp5111_9 = __HIVE_P2_get(__HIVE_P2_temp5111_8, "charCodeAt", 5130), __HIVE_P2_invoke(__HIVE_P2_temp5111_9, __HIVE_P2_temp5111_8, (__HIVE_P2_reserveArray(1, 5130), __HIVE_P2_ownArray([__HIVE_P2_get(this, "lastTokStart", 5131)], 5130, "CONTROL_ARRAY")), 5130)) !== 46)) {
                (__HIVE_P2_temp5111_10 = __HIVE_P2_get(this, "context", 5136), __HIVE_P2_temp5111_11 = __HIVE_P2_get(__HIVE_P2_temp5111_10, "pop", 5134), __HIVE_P2_invoke(__HIVE_P2_temp5111_11, __HIVE_P2_temp5111_10, (__HIVE_P2_reserveArray(0, 5134), __HIVE_P2_ownArray([], 5134, "CONTROL_ARRAY")), 5134));
            }
            (__HIVE_P2_temp5111_12 = this, __HIVE_P2_temp5111_13 = "type", __HIVE_P2_set(__HIVE_P2_temp5111_12, __HIVE_P2_temp5111_13, __HIVE_P2_get(m, "name", 5139), 5137));
        }
        else {
            __HIVE_P2_syntaxRefusal(5140);
        }
        return e;
    }, 16, 0, 0, 5111)), 5109));
    (__HIVE_P2_temp0_1383 = pe, __HIVE_P2_temp0_1384 = "parsePrivateIdent", __HIVE_P2_set(__HIVE_P2_temp0_1383, __HIVE_P2_temp0_1384, (__HIVE_P2_reserveFunction(5143), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp5143_0, __HIVE_P2_temp5143_1, __HIVE_P2_temp5143_2, __HIVE_P2_temp5143_3, __HIVE_P2_temp5143_4, __HIVE_P2_temp5143_5, __HIVE_P2_temp5143_6, __HIVE_P2_temp5143_7, __HIVE_P2_temp5143_8, __HIVE_P2_temp5143_9, __HIVE_P2_temp5143_10;
        var e = (__HIVE_P2_temp5143_0 = this, __HIVE_P2_temp5143_1 = __HIVE_P2_get(__HIVE_P2_temp5143_0, "startNode", 5144), __HIVE_P2_invoke(__HIVE_P2_temp5143_1, __HIVE_P2_temp5143_0, (__HIVE_P2_reserveArray(0, 5144), __HIVE_P2_ownArray([], 5144, "CONTROL_ARRAY")), 5144));
        if (__HIVE_P2_get(this, "type", 5146) === __HIVE_P2_get(m, "privateId", 5147)) {
            (__HIVE_P2_temp5143_2 = e, __HIVE_P2_temp5143_3 = "name", __HIVE_P2_set(__HIVE_P2_temp5143_2, __HIVE_P2_temp5143_3, __HIVE_P2_get(this, "value", 5150), 5148));
        }
        else {
            __HIVE_P2_syntaxRefusal(5151);
        }
        (__HIVE_P2_temp5143_5 = this, __HIVE_P2_temp5143_6 = __HIVE_P2_get(__HIVE_P2_temp5143_5, "next", 5152), __HIVE_P2_invoke(__HIVE_P2_temp5143_6, __HIVE_P2_temp5143_5, (__HIVE_P2_reserveArray(0, 5152), __HIVE_P2_ownArray([], 5152, "CONTROL_ARRAY")), 5152));
        (__HIVE_P2_temp5143_7 = this, __HIVE_P2_temp5143_8 = __HIVE_P2_get(__HIVE_P2_temp5143_7, "finishNode", 5154), __HIVE_P2_invoke(__HIVE_P2_temp5143_8, __HIVE_P2_temp5143_7, (__HIVE_P2_reserveArray(2, 5154), __HIVE_P2_ownArray([e, "PrivateIdentifier"], 5154, "CONTROL_ARRAY")), 5154));
        if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 5157), "checkPrivateFields", 5156)) {
            if (__HIVE_P2_get(__HIVE_P2_get(this, "privateNameStack", 5159), "length", 5158) === 0) {
                __HIVE_P2_syntaxRefusal(5160);
            }
            else {
                (__HIVE_P2_temp5143_9 = __HIVE_P2_get(__HIVE_P2_get(__HIVE_P2_get(this, "privateNameStack", 5165), __HIVE_P2_binary("-", __HIVE_P2_get(__HIVE_P2_get(this, "privateNameStack", 5168), "length", 5167), 1, 5166), 5164), "used", 5163), __HIVE_P2_temp5143_10 = __HIVE_P2_get(__HIVE_P2_temp5143_9, "push", 5161), __HIVE_P2_invoke(__HIVE_P2_temp5143_10, __HIVE_P2_temp5143_9, (__HIVE_P2_reserveArray(1, 5161), __HIVE_P2_ownArray([e], 5161, "CONTROL_ARRAY")), 5161));
            }
        }
        return e;
    }, 12, 0, 0, 5143)), 5141));
    (__HIVE_P2_temp0_1386 = pe, __HIVE_P2_temp0_1387 = "parseYield", __HIVE_P2_set(__HIVE_P2_temp0_1386, __HIVE_P2_temp0_1387, (__HIVE_P2_reserveFunction(5171), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp5171_0, __HIVE_P2_temp5171_1, __HIVE_P2_temp5171_2, __HIVE_P2_temp5171_3, __HIVE_P2_temp5171_4, __HIVE_P2_temp5171_5, __HIVE_P2_temp5171_6, __HIVE_P2_temp5171_7, __HIVE_P2_temp5171_8, __HIVE_P2_temp5171_9, __HIVE_P2_temp5171_10, __HIVE_P2_temp5171_11, __HIVE_P2_temp5171_12, __HIVE_P2_temp5171_13, __HIVE_P2_temp5171_14, __HIVE_P2_temp5171_15, __HIVE_P2_temp5171_16, __HIVE_P2_temp5171_17, __HIVE_P2_temp5171_18, __HIVE_P2_temp5171_19, __HIVE_P2_temp5171_20, __HIVE_P2_temp5171_21, __HIVE_P2_temp5171_22, __HIVE_P2_temp5171_23, __HIVE_P2_temp5171_24, __HIVE_P2_temp5171_25, __HIVE_P2_temp5171_26;
        if (!__HIVE_P2_get(this, "yieldPos", 5172)) {
            (__HIVE_P2_temp5171_0 = this, __HIVE_P2_temp5171_1 = "yieldPos", __HIVE_P2_set(__HIVE_P2_temp5171_0, __HIVE_P2_temp5171_1, __HIVE_P2_get(this, "start", 5175), 5173));
        }
        var t = (__HIVE_P2_temp5171_3 = this, __HIVE_P2_temp5171_4 = __HIVE_P2_get(__HIVE_P2_temp5171_3, "startNode", 5176), __HIVE_P2_invoke(__HIVE_P2_temp5171_4, __HIVE_P2_temp5171_3, (__HIVE_P2_reserveArray(0, 5176), __HIVE_P2_ownArray([], 5176, "CONTROL_ARRAY")), 5176));
        (__HIVE_P2_temp5171_5 = this, __HIVE_P2_temp5171_6 = __HIVE_P2_get(__HIVE_P2_temp5171_5, "next", 5178), __HIVE_P2_invoke(__HIVE_P2_temp5171_6, __HIVE_P2_temp5171_5, (__HIVE_P2_reserveArray(0, 5178), __HIVE_P2_ownArray([], 5178, "CONTROL_ARRAY")), 5178));
        if (__HIVE_P2_get(this, "type", 5180) === __HIVE_P2_get(m, "semi", 5181) || (__HIVE_P2_temp5171_7 = this, __HIVE_P2_temp5171_8 = __HIVE_P2_get(__HIVE_P2_temp5171_7, "canInsertSemicolon", 5182), __HIVE_P2_invoke(__HIVE_P2_temp5171_8, __HIVE_P2_temp5171_7, (__HIVE_P2_reserveArray(0, 5182), __HIVE_P2_ownArray([], 5182, "CONTROL_ARRAY")), 5182)) || __HIVE_P2_get(this, "type", 5184) !== __HIVE_P2_get(m, "star", 5185) && !__HIVE_P2_get(__HIVE_P2_get(this, "type", 5187), "startsExpr", 5186)) {
            (__HIVE_P2_temp5171_9 = t, __HIVE_P2_temp5171_10 = "delegate", __HIVE_P2_set(__HIVE_P2_temp5171_9, __HIVE_P2_temp5171_10, false, 5188));
            (__HIVE_P2_temp5171_12 = t, __HIVE_P2_temp5171_13 = "argument", __HIVE_P2_set(__HIVE_P2_temp5171_12, __HIVE_P2_temp5171_13, null, 5190));
        }
        else {
            (__HIVE_P2_temp5171_15 = t, __HIVE_P2_temp5171_16 = "delegate", __HIVE_P2_set(__HIVE_P2_temp5171_15, __HIVE_P2_temp5171_16, (__HIVE_P2_temp5171_18 = this, __HIVE_P2_temp5171_19 = __HIVE_P2_get(__HIVE_P2_temp5171_18, "eat", 5194), __HIVE_P2_invoke(__HIVE_P2_temp5171_19, __HIVE_P2_temp5171_18, (__HIVE_P2_reserveArray(1, 5194), __HIVE_P2_ownArray([__HIVE_P2_get(m, "star", 5195)], 5194, "CONTROL_ARRAY")), 5194)), 5192));
            (__HIVE_P2_temp5171_20 = t, __HIVE_P2_temp5171_21 = "argument", __HIVE_P2_set(__HIVE_P2_temp5171_20, __HIVE_P2_temp5171_21, (__HIVE_P2_temp5171_23 = this, __HIVE_P2_temp5171_24 = __HIVE_P2_get(__HIVE_P2_temp5171_23, "parseMaybeAssign", 5199), __HIVE_P2_invoke(__HIVE_P2_temp5171_24, __HIVE_P2_temp5171_23, (__HIVE_P2_reserveArray(1, 5199), __HIVE_P2_ownArray([e], 5199, "CONTROL_ARRAY")), 5199)), 5197));
        }
        return (__HIVE_P2_temp5171_25 = this, __HIVE_P2_temp5171_26 = __HIVE_P2_get(__HIVE_P2_temp5171_25, "finishNode", 5201), __HIVE_P2_invoke(__HIVE_P2_temp5171_26, __HIVE_P2_temp5171_25, (__HIVE_P2_reserveArray(2, 5201), __HIVE_P2_ownArray([t, "YieldExpression"], 5201, "CONTROL_ARRAY")), 5201));
    }, 28, 1, 0, 5171)), 5169));
    (__HIVE_P2_temp0_1389 = pe, __HIVE_P2_temp0_1390 = "parseAwait", __HIVE_P2_set(__HIVE_P2_temp0_1389, __HIVE_P2_temp0_1390, (__HIVE_P2_reserveFunction(5205), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp5205_0, __HIVE_P2_temp5205_1, __HIVE_P2_temp5205_2, __HIVE_P2_temp5205_3, __HIVE_P2_temp5205_4, __HIVE_P2_temp5205_5, __HIVE_P2_temp5205_6, __HIVE_P2_temp5205_7, __HIVE_P2_temp5205_8, __HIVE_P2_temp5205_9, __HIVE_P2_temp5205_10, __HIVE_P2_temp5205_11, __HIVE_P2_temp5205_12, __HIVE_P2_temp5205_13;
        if (!__HIVE_P2_get(this, "awaitPos", 5206)) {
            (__HIVE_P2_temp5205_0 = this, __HIVE_P2_temp5205_1 = "awaitPos", __HIVE_P2_set(__HIVE_P2_temp5205_0, __HIVE_P2_temp5205_1, __HIVE_P2_get(this, "start", 5209), 5207));
        }
        var t = (__HIVE_P2_temp5205_3 = this, __HIVE_P2_temp5205_4 = __HIVE_P2_get(__HIVE_P2_temp5205_3, "startNode", 5210), __HIVE_P2_invoke(__HIVE_P2_temp5205_4, __HIVE_P2_temp5205_3, (__HIVE_P2_reserveArray(0, 5210), __HIVE_P2_ownArray([], 5210, "CONTROL_ARRAY")), 5210));
        (__HIVE_P2_temp5205_5 = this, __HIVE_P2_temp5205_6 = __HIVE_P2_get(__HIVE_P2_temp5205_5, "next", 5212), __HIVE_P2_invoke(__HIVE_P2_temp5205_6, __HIVE_P2_temp5205_5, (__HIVE_P2_reserveArray(0, 5212), __HIVE_P2_ownArray([], 5212, "CONTROL_ARRAY")), 5212));
        (__HIVE_P2_temp5205_7 = t, __HIVE_P2_temp5205_8 = "argument", __HIVE_P2_set(__HIVE_P2_temp5205_7, __HIVE_P2_temp5205_8, (__HIVE_P2_temp5205_10 = this, __HIVE_P2_temp5205_11 = __HIVE_P2_get(__HIVE_P2_temp5205_10, "parseMaybeUnary", 5216), __HIVE_P2_invoke(__HIVE_P2_temp5205_11, __HIVE_P2_temp5205_10, (__HIVE_P2_reserveArray(4, 5216), __HIVE_P2_ownArray([null, true, false, e], 5216, "CONTROL_ARRAY")), 5216)), 5214));
        return (__HIVE_P2_temp5205_12 = this, __HIVE_P2_temp5205_13 = __HIVE_P2_get(__HIVE_P2_temp5205_12, "finishNode", 5218), __HIVE_P2_invoke(__HIVE_P2_temp5205_13, __HIVE_P2_temp5205_12, (__HIVE_P2_reserveArray(2, 5218), __HIVE_P2_ownArray([t, "AwaitExpression"], 5218, "CONTROL_ARRAY")), 5218));
    }, 15, 1, 0, 5205)), 5203));
    var le = __HIVE_P2_get(K, "prototype", 5220);
    __HIVE_P2_set(le, "raise", (__HIVE_P2_reserveFunction(5222), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5223), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5223, "CONTROL_ARRAY")), 5223);
    }, 0, 0, 0, 5222)), 5224);
    (__HIVE_P2_temp0_1392 = le, __HIVE_P2_temp0_1393 = "raiseRecoverable", __HIVE_P2_set(__HIVE_P2_temp0_1392, __HIVE_P2_temp0_1393, __HIVE_P2_get(le, "raise", 5228), 5226));
    (__HIVE_P2_temp0_1395 = le, __HIVE_P2_temp0_1396 = "curPosition", __HIVE_P2_set(__HIVE_P2_temp0_1395, __HIVE_P2_temp0_1396, (__HIVE_P2_reserveFunction(5231), __HIVE_P2_registerFunction(function () {
        if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 5233), "locations", 5232)) {
            return __HIVE_P2_construct(I, (__HIVE_P2_reserveArray(2, 5234), __HIVE_P2_ownArray([__HIVE_P2_get(this, "curLine", 5235), __HIVE_P2_binary("-", __HIVE_P2_get(this, "pos", 5237), __HIVE_P2_get(this, "lineStart", 5238), 5236)], 5234, "CONTROL_ARRAY")), 5234);
        }
    }, 0, 0, 0, 5231)), 5229));
    var ue = __HIVE_P2_get(K, "prototype", 5239);
    var fe = (__HIVE_P2_reserveFunction(5240), __HIVE_P2_registerFunction(function Scope(e) {
        var __HIVE_P2_temp5240_0, __HIVE_P2_temp5240_1, __HIVE_P2_temp5240_2, __HIVE_P2_temp5240_3, __HIVE_P2_temp5240_4, __HIVE_P2_temp5240_5, __HIVE_P2_temp5240_6, __HIVE_P2_temp5240_7, __HIVE_P2_temp5240_8, __HIVE_P2_temp5240_9, __HIVE_P2_temp5240_10, __HIVE_P2_temp5240_11, __HIVE_P2_temp5240_12, __HIVE_P2_temp5240_13, __HIVE_P2_temp5240_14, __HIVE_P2_temp5240_15, __HIVE_P2_temp5240_16, __HIVE_P2_temp5240_17;
        (__HIVE_P2_temp5240_0 = this, __HIVE_P2_temp5240_1 = "flags", __HIVE_P2_set(__HIVE_P2_temp5240_0, __HIVE_P2_temp5240_1, e, 5241));
        (__HIVE_P2_temp5240_3 = this, __HIVE_P2_temp5240_4 = "var", __HIVE_P2_set(__HIVE_P2_temp5240_3, __HIVE_P2_temp5240_4, (__HIVE_P2_temp5240_6 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp5240_6, 5245), __HIVE_P2_reserveArray(0, 5245, 0), __HIVE_P2_ownArray([], 5245, "ARRAY", __HIVE_P2_temp5240_6)), 5243));
        (__HIVE_P2_temp5240_7 = this, __HIVE_P2_temp5240_8 = "lexical", __HIVE_P2_set(__HIVE_P2_temp5240_7, __HIVE_P2_temp5240_8, (__HIVE_P2_temp5240_10 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp5240_10, 5248), __HIVE_P2_reserveArray(0, 5248, 0), __HIVE_P2_ownArray([], 5248, "ARRAY", __HIVE_P2_temp5240_10)), 5246));
        (__HIVE_P2_temp5240_11 = this, __HIVE_P2_temp5240_12 = "functions", __HIVE_P2_set(__HIVE_P2_temp5240_11, __HIVE_P2_temp5240_12, (__HIVE_P2_temp5240_14 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp5240_14, 5251), __HIVE_P2_reserveArray(0, 5251, 0), __HIVE_P2_ownArray([], 5251, "ARRAY", __HIVE_P2_temp5240_14)), 5249));
        (__HIVE_P2_temp5240_15 = this, __HIVE_P2_temp5240_16 = "inClassFieldInit", __HIVE_P2_set(__HIVE_P2_temp5240_15, __HIVE_P2_temp5240_16, false, 5252));
    }, 18, 1, 0, 5240));
    (__HIVE_P2_temp0_1398 = ue, __HIVE_P2_temp0_1399 = "enterScope", __HIVE_P2_set(__HIVE_P2_temp0_1398, __HIVE_P2_temp0_1399, (__HIVE_P2_reserveFunction(5256), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp5256_0, __HIVE_P2_temp5256_1;
        (__HIVE_P2_temp5256_0 = __HIVE_P2_get(this, "scopeStack", 5260), __HIVE_P2_temp5256_1 = __HIVE_P2_get(__HIVE_P2_temp5256_0, "push", 5257), __HIVE_P2_invoke(__HIVE_P2_temp5256_1, __HIVE_P2_temp5256_0, (__HIVE_P2_reserveArray(1, 5257), __HIVE_P2_ownArray([__HIVE_P2_construct(fe, (__HIVE_P2_reserveArray(1, 5258), __HIVE_P2_ownArray([e], 5258, "CONTROL_ARRAY")), 5258)], 5257, "CONTROL_ARRAY")), 5257));
    }, 2, 1, 0, 5256)), 5254));
    (__HIVE_P2_temp0_1401 = ue, __HIVE_P2_temp0_1402 = "exitScope", __HIVE_P2_set(__HIVE_P2_temp0_1401, __HIVE_P2_temp0_1402, (__HIVE_P2_reserveFunction(5263), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp5263_0, __HIVE_P2_temp5263_1;
        (__HIVE_P2_temp5263_0 = __HIVE_P2_get(this, "scopeStack", 5266), __HIVE_P2_temp5263_1 = __HIVE_P2_get(__HIVE_P2_temp5263_0, "pop", 5264), __HIVE_P2_invoke(__HIVE_P2_temp5263_1, __HIVE_P2_temp5263_0, (__HIVE_P2_reserveArray(0, 5264), __HIVE_P2_ownArray([], 5264, "CONTROL_ARRAY")), 5264));
    }, 2, 0, 0, 5263)), 5261));
    (__HIVE_P2_temp0_1404 = ue, __HIVE_P2_temp0_1405 = "treatFunctionsAsVarInScope", __HIVE_P2_set(__HIVE_P2_temp0_1404, __HIVE_P2_temp0_1405, (__HIVE_P2_reserveFunction(5269), __HIVE_P2_registerFunction(function (e) {
        return __HIVE_P2_binary("&", __HIVE_P2_get(e, "flags", 5271), V, 5270) || !__HIVE_P2_get(this, "inModule", 5272) && __HIVE_P2_binary("&", __HIVE_P2_get(e, "flags", 5274), T, 5273);
    }, 0, 1, 0, 5269)), 5267));
    (__HIVE_P2_temp0_1407 = ue, __HIVE_P2_temp0_1408 = "declareName", __HIVE_P2_set(__HIVE_P2_temp0_1407, __HIVE_P2_temp0_1408, (__HIVE_P2_reserveFunction(5277), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp5277_0, __HIVE_P2_temp5277_1, __HIVE_P2_temp5277_2, __HIVE_P2_temp5277_3, __HIVE_P2_temp5277_4, __HIVE_P2_temp5277_5, __HIVE_P2_temp5277_6, __HIVE_P2_temp5277_7, __HIVE_P2_temp5277_8, __HIVE_P2_temp5277_9, __HIVE_P2_temp5277_10, __HIVE_P2_temp5277_11, __HIVE_P2_temp5277_12, __HIVE_P2_temp5277_13, __HIVE_P2_temp5277_14, __HIVE_P2_temp5277_15, __HIVE_P2_temp5277_16, __HIVE_P2_temp5277_17, __HIVE_P2_temp5277_18, __HIVE_P2_temp5277_19, __HIVE_P2_temp5277_20, __HIVE_P2_temp5277_21, __HIVE_P2_temp5277_22, __HIVE_P2_temp5277_23, __HIVE_P2_temp5277_24, __HIVE_P2_temp5277_25, __HIVE_P2_temp5277_26, __HIVE_P2_temp5277_27, __HIVE_P2_temp5277_28, __HIVE_P2_temp5277_29, __HIVE_P2_temp5277_30, __HIVE_P2_temp5277_31, __HIVE_P2_temp5277_32, __HIVE_P2_temp5277_33;
        var s = false;
        if (t === G) {
            var r = (__HIVE_P2_temp5277_0 = this, __HIVE_P2_temp5277_1 = __HIVE_P2_get(__HIVE_P2_temp5277_0, "currentScope", 5278), __HIVE_P2_invoke(__HIVE_P2_temp5277_1, __HIVE_P2_temp5277_0, (__HIVE_P2_reserveArray(0, 5278), __HIVE_P2_ownArray([], 5278, "CONTROL_ARRAY")), 5278));
            s = __HIVE_P2_binary(">", (__HIVE_P2_temp5277_2 = __HIVE_P2_get(r, "lexical", 5284), __HIVE_P2_temp5277_3 = __HIVE_P2_get(__HIVE_P2_temp5277_2, "indexOf", 5282), __HIVE_P2_invoke(__HIVE_P2_temp5277_3, __HIVE_P2_temp5277_2, (__HIVE_P2_reserveArray(1, 5282), __HIVE_P2_ownArray([e], 5282, "CONTROL_ARRAY")), 5282)), __HIVE_P2_unary("-", 1, 5285), 5281) || __HIVE_P2_binary(">", (__HIVE_P2_temp5277_4 = __HIVE_P2_get(r, "functions", 5289), __HIVE_P2_temp5277_5 = __HIVE_P2_get(__HIVE_P2_temp5277_4, "indexOf", 5287), __HIVE_P2_invoke(__HIVE_P2_temp5277_5, __HIVE_P2_temp5277_4, (__HIVE_P2_reserveArray(1, 5287), __HIVE_P2_ownArray([e], 5287, "CONTROL_ARRAY")), 5287)), __HIVE_P2_unary("-", 1, 5290), 5286) || __HIVE_P2_binary(">", (__HIVE_P2_temp5277_6 = __HIVE_P2_get(r, "var", 5294), __HIVE_P2_temp5277_7 = __HIVE_P2_get(__HIVE_P2_temp5277_6, "indexOf", 5292), __HIVE_P2_invoke(__HIVE_P2_temp5277_7, __HIVE_P2_temp5277_6, (__HIVE_P2_reserveArray(1, 5292), __HIVE_P2_ownArray([e], 5292, "CONTROL_ARRAY")), 5292)), __HIVE_P2_unary("-", 1, 5295), 5291);
            (__HIVE_P2_temp5277_8 = __HIVE_P2_get(r, "lexical", 5298), __HIVE_P2_temp5277_9 = __HIVE_P2_get(__HIVE_P2_temp5277_8, "push", 5296), __HIVE_P2_invoke(__HIVE_P2_temp5277_9, __HIVE_P2_temp5277_8, (__HIVE_P2_reserveArray(1, 5296), __HIVE_P2_ownArray([e], 5296, "CONTROL_ARRAY")), 5296));
            if (__HIVE_P2_get(this, "inModule", 5299) && __HIVE_P2_binary("&", __HIVE_P2_get(r, "flags", 5301), T, 5300)) {
                __HIVE_P2_remove(__HIVE_P2_get(this, "undefinedExports", 5304), e, 5302);
            }
        }
        else if (t === W) {
            var a = (__HIVE_P2_temp5277_10 = this, __HIVE_P2_temp5277_11 = __HIVE_P2_get(__HIVE_P2_temp5277_10, "currentScope", 5305), __HIVE_P2_invoke(__HIVE_P2_temp5277_11, __HIVE_P2_temp5277_10, (__HIVE_P2_reserveArray(0, 5305), __HIVE_P2_ownArray([], 5305, "CONTROL_ARRAY")), 5305));
            (__HIVE_P2_temp5277_12 = __HIVE_P2_get(a, "lexical", 5309), __HIVE_P2_temp5277_13 = __HIVE_P2_get(__HIVE_P2_temp5277_12, "push", 5307), __HIVE_P2_invoke(__HIVE_P2_temp5277_13, __HIVE_P2_temp5277_12, (__HIVE_P2_reserveArray(1, 5307), __HIVE_P2_ownArray([e], 5307, "CONTROL_ARRAY")), 5307));
        }
        else if (t === H) {
            var n = (__HIVE_P2_temp5277_14 = this, __HIVE_P2_temp5277_15 = __HIVE_P2_get(__HIVE_P2_temp5277_14, "currentScope", 5310), __HIVE_P2_invoke(__HIVE_P2_temp5277_15, __HIVE_P2_temp5277_14, (__HIVE_P2_reserveArray(0, 5310), __HIVE_P2_ownArray([], 5310, "CONTROL_ARRAY")), 5310));
            if (__HIVE_P2_get(this, "treatFunctionsAsVar", 5312)) {
                s = __HIVE_P2_binary(">", (__HIVE_P2_temp5277_16 = __HIVE_P2_get(n, "lexical", 5317), __HIVE_P2_temp5277_17 = __HIVE_P2_get(__HIVE_P2_temp5277_16, "indexOf", 5315), __HIVE_P2_invoke(__HIVE_P2_temp5277_17, __HIVE_P2_temp5277_16, (__HIVE_P2_reserveArray(1, 5315), __HIVE_P2_ownArray([e], 5315, "CONTROL_ARRAY")), 5315)), __HIVE_P2_unary("-", 1, 5318), 5314);
            }
            else {
                s = __HIVE_P2_binary(">", (__HIVE_P2_temp5277_18 = __HIVE_P2_get(n, "lexical", 5323), __HIVE_P2_temp5277_19 = __HIVE_P2_get(__HIVE_P2_temp5277_18, "indexOf", 5321), __HIVE_P2_invoke(__HIVE_P2_temp5277_19, __HIVE_P2_temp5277_18, (__HIVE_P2_reserveArray(1, 5321), __HIVE_P2_ownArray([e], 5321, "CONTROL_ARRAY")), 5321)), __HIVE_P2_unary("-", 1, 5324), 5320) || __HIVE_P2_binary(">", (__HIVE_P2_temp5277_20 = __HIVE_P2_get(n, "var", 5328), __HIVE_P2_temp5277_21 = __HIVE_P2_get(__HIVE_P2_temp5277_20, "indexOf", 5326), __HIVE_P2_invoke(__HIVE_P2_temp5277_21, __HIVE_P2_temp5277_20, (__HIVE_P2_reserveArray(1, 5326), __HIVE_P2_ownArray([e], 5326, "CONTROL_ARRAY")), 5326)), __HIVE_P2_unary("-", 1, 5329), 5325);
            }
            (__HIVE_P2_temp5277_22 = __HIVE_P2_get(n, "functions", 5332), __HIVE_P2_temp5277_23 = __HIVE_P2_get(__HIVE_P2_temp5277_22, "push", 5330), __HIVE_P2_invoke(__HIVE_P2_temp5277_23, __HIVE_P2_temp5277_22, (__HIVE_P2_reserveArray(1, 5330), __HIVE_P2_ownArray([e], 5330, "CONTROL_ARRAY")), 5330));
        }
        else {
            for (var o = __HIVE_P2_binary("-", __HIVE_P2_get(__HIVE_P2_get(this, "scopeStack", 5336), "length", 5335), 1, 5334); __HIVE_P2_binary(">=", o, 0, 5337); (__HIVE_P2_temp5277_24 = __HIVE_P2_numeric(o, 5338), __HIVE_P2_temp5277_25 = __HIVE_P2_temp5277_24 + -1, o = __HIVE_P2_temp5277_25, __HIVE_P2_temp5277_25)) {
                __HIVE_P2_tick(5333);
                var h = __HIVE_P2_get(__HIVE_P2_get(this, "scopeStack", 5340), o, 5339);
                if (__HIVE_P2_binary(">", (__HIVE_P2_temp5277_26 = __HIVE_P2_get(h, "lexical", 5344), __HIVE_P2_temp5277_27 = __HIVE_P2_get(__HIVE_P2_temp5277_26, "indexOf", 5342), __HIVE_P2_invoke(__HIVE_P2_temp5277_27, __HIVE_P2_temp5277_26, (__HIVE_P2_reserveArray(1, 5342), __HIVE_P2_ownArray([e], 5342, "CONTROL_ARRAY")), 5342)), __HIVE_P2_unary("-", 1, 5345), 5341) && !(__HIVE_P2_binary("&", __HIVE_P2_get(h, "flags", 5347), O, 5346) && __HIVE_P2_get(__HIVE_P2_get(h, "lexical", 5349), 0, 5348) === e) || !(__HIVE_P2_temp5277_28 = this, __HIVE_P2_temp5277_29 = __HIVE_P2_get(__HIVE_P2_temp5277_28, "treatFunctionsAsVarInScope", 5350), __HIVE_P2_invoke(__HIVE_P2_temp5277_29, __HIVE_P2_temp5277_28, (__HIVE_P2_reserveArray(1, 5350), __HIVE_P2_ownArray([h], 5350, "CONTROL_ARRAY")), 5350)) && __HIVE_P2_binary(">", (__HIVE_P2_temp5277_30 = __HIVE_P2_get(h, "functions", 5355), __HIVE_P2_temp5277_31 = __HIVE_P2_get(__HIVE_P2_temp5277_30, "indexOf", 5353), __HIVE_P2_invoke(__HIVE_P2_temp5277_31, __HIVE_P2_temp5277_30, (__HIVE_P2_reserveArray(1, 5353), __HIVE_P2_ownArray([e], 5353, "CONTROL_ARRAY")), 5353)), __HIVE_P2_unary("-", 1, 5356), 5352)) {
                    s = true;
                    break;
                }
                (__HIVE_P2_temp5277_32 = __HIVE_P2_get(h, "var", 5360), __HIVE_P2_temp5277_33 = __HIVE_P2_get(__HIVE_P2_temp5277_32, "push", 5358), __HIVE_P2_invoke(__HIVE_P2_temp5277_33, __HIVE_P2_temp5277_32, (__HIVE_P2_reserveArray(1, 5358), __HIVE_P2_ownArray([e], 5358, "CONTROL_ARRAY")), 5358));
                if (__HIVE_P2_get(this, "inModule", 5361) && __HIVE_P2_binary("&", __HIVE_P2_get(h, "flags", 5363), T, 5362)) {
                    __HIVE_P2_remove(__HIVE_P2_get(this, "undefinedExports", 5366), e, 5364);
                }
                if (__HIVE_P2_binary("&", __HIVE_P2_get(h, "flags", 5368), U, 5367)) {
                    break;
                }
            }
        }
        if (s) {
            __HIVE_P2_syntaxRefusal(5369);
        }
    }, 40, 3, 0, 5277)), 5275));
    (__HIVE_P2_temp0_1410 = ue, __HIVE_P2_temp0_1411 = "checkLocalExport", __HIVE_P2_set(__HIVE_P2_temp0_1410, __HIVE_P2_temp0_1411, (__HIVE_P2_reserveFunction(5372), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp5372_0, __HIVE_P2_temp5372_1, __HIVE_P2_temp5372_2, __HIVE_P2_temp5372_3, __HIVE_P2_temp5372_4, __HIVE_P2_temp5372_5, __HIVE_P2_temp5372_6;
        if ((__HIVE_P2_temp5372_0 = __HIVE_P2_get(__HIVE_P2_get(__HIVE_P2_get(this, "scopeStack", 5378), 0, 5377), "lexical", 5376), __HIVE_P2_temp5372_1 = __HIVE_P2_get(__HIVE_P2_temp5372_0, "indexOf", 5373), __HIVE_P2_invoke(__HIVE_P2_temp5372_1, __HIVE_P2_temp5372_0, (__HIVE_P2_reserveArray(1, 5373), __HIVE_P2_ownArray([__HIVE_P2_get(e, "name", 5374)], 5373, "CONTROL_ARRAY")), 5373)) === __HIVE_P2_unary("-", 1, 5379) && (__HIVE_P2_temp5372_2 = __HIVE_P2_get(__HIVE_P2_get(__HIVE_P2_get(this, "scopeStack", 5385), 0, 5384), "var", 5383), __HIVE_P2_temp5372_3 = __HIVE_P2_get(__HIVE_P2_temp5372_2, "indexOf", 5380), __HIVE_P2_invoke(__HIVE_P2_temp5372_3, __HIVE_P2_temp5372_2, (__HIVE_P2_reserveArray(1, 5380), __HIVE_P2_ownArray([__HIVE_P2_get(e, "name", 5381)], 5380, "CONTROL_ARRAY")), 5380)) === __HIVE_P2_unary("-", 1, 5386)) {
            (__HIVE_P2_temp5372_4 = __HIVE_P2_get(this, "undefinedExports", 5389), __HIVE_P2_temp5372_5 = __HIVE_P2_get(e, "name", 5390), __HIVE_P2_set(__HIVE_P2_temp5372_4, __HIVE_P2_temp5372_5, e, 5387));
        }
    }, 7, 1, 0, 5372)), 5370));
    (__HIVE_P2_temp0_1413 = ue, __HIVE_P2_temp0_1414 = "currentScope", __HIVE_P2_set(__HIVE_P2_temp0_1413, __HIVE_P2_temp0_1414, (__HIVE_P2_reserveFunction(5393), __HIVE_P2_registerFunction(function () {
        return __HIVE_P2_get(__HIVE_P2_get(this, "scopeStack", 5395), __HIVE_P2_binary("-", __HIVE_P2_get(__HIVE_P2_get(this, "scopeStack", 5398), "length", 5397), 1, 5396), 5394);
    }, 0, 0, 0, 5393)), 5391));
    (__HIVE_P2_temp0_1416 = ue, __HIVE_P2_temp0_1417 = "currentVarScope", __HIVE_P2_set(__HIVE_P2_temp0_1416, __HIVE_P2_temp0_1417, (__HIVE_P2_reserveFunction(5401), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp5401_0, __HIVE_P2_temp5401_1;
        for (var e = __HIVE_P2_binary("-", __HIVE_P2_get(__HIVE_P2_get(this, "scopeStack", 5405), "length", 5404), 1, 5403);; (__HIVE_P2_temp5401_0 = __HIVE_P2_numeric(e, 5406), __HIVE_P2_temp5401_1 = __HIVE_P2_temp5401_0 + -1, e = __HIVE_P2_temp5401_1, __HIVE_P2_temp5401_0)) {
            __HIVE_P2_tick(5402);
            var t = __HIVE_P2_get(__HIVE_P2_get(this, "scopeStack", 5408), e, 5407);
            if (__HIVE_P2_binary("&", __HIVE_P2_get(t, "flags", 5410), U, 5409)) {
                return t;
            }
        }
    }, 4, 0, 0, 5401)), 5399));
    (__HIVE_P2_temp0_1419 = ue, __HIVE_P2_temp0_1420 = "currentThisScope", __HIVE_P2_set(__HIVE_P2_temp0_1419, __HIVE_P2_temp0_1420, (__HIVE_P2_reserveFunction(5413), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp5413_0, __HIVE_P2_temp5413_1;
        for (var e = __HIVE_P2_binary("-", __HIVE_P2_get(__HIVE_P2_get(this, "scopeStack", 5417), "length", 5416), 1, 5415);; (__HIVE_P2_temp5413_0 = __HIVE_P2_numeric(e, 5418), __HIVE_P2_temp5413_1 = __HIVE_P2_temp5413_0 + -1, e = __HIVE_P2_temp5413_1, __HIVE_P2_temp5413_0)) {
            __HIVE_P2_tick(5414);
            var t = __HIVE_P2_get(__HIVE_P2_get(this, "scopeStack", 5420), e, 5419);
            if (__HIVE_P2_binary("&", __HIVE_P2_get(t, "flags", 5422), U, 5421) && !(__HIVE_P2_binary("&", __HIVE_P2_get(t, "flags", 5424), D, 5423))) {
                return t;
            }
        }
    }, 4, 0, 0, 5413)), 5411));
    var de = (__HIVE_P2_reserveFunction(5425), __HIVE_P2_registerFunction(function Node(e, t, i) {
        var __HIVE_P2_temp5425_0, __HIVE_P2_temp5425_1, __HIVE_P2_temp5425_2, __HIVE_P2_temp5425_3, __HIVE_P2_temp5425_4, __HIVE_P2_temp5425_5, __HIVE_P2_temp5425_6, __HIVE_P2_temp5425_7, __HIVE_P2_temp5425_8, __HIVE_P2_temp5425_9, __HIVE_P2_temp5425_10, __HIVE_P2_temp5425_11, __HIVE_P2_temp5425_12, __HIVE_P2_temp5425_13, __HIVE_P2_temp5425_14, __HIVE_P2_temp5425_15, __HIVE_P2_temp5425_16, __HIVE_P2_temp5425_17, __HIVE_P2_temp5425_18, __HIVE_P2_temp5425_19, __HIVE_P2_temp5425_20;
        (__HIVE_P2_temp5425_0 = this, __HIVE_P2_temp5425_1 = "type", __HIVE_P2_set(__HIVE_P2_temp5425_0, __HIVE_P2_temp5425_1, "", 5426));
        (__HIVE_P2_temp5425_3 = this, __HIVE_P2_temp5425_4 = "start", __HIVE_P2_set(__HIVE_P2_temp5425_3, __HIVE_P2_temp5425_4, t, 5428));
        (__HIVE_P2_temp5425_6 = this, __HIVE_P2_temp5425_7 = "end", __HIVE_P2_set(__HIVE_P2_temp5425_6, __HIVE_P2_temp5425_7, 0, 5430));
        if (__HIVE_P2_get(__HIVE_P2_get(e, "options", 5433), "locations", 5432)) {
            (__HIVE_P2_temp5425_9 = this, __HIVE_P2_temp5425_10 = "loc", __HIVE_P2_set(__HIVE_P2_temp5425_9, __HIVE_P2_temp5425_10, __HIVE_P2_construct(A, (__HIVE_P2_reserveArray(2, 5436), __HIVE_P2_ownArray([e, i], 5436, "CONTROL_ARRAY")), 5436), 5434));
        }
        if (__HIVE_P2_get(__HIVE_P2_get(e, "options", 5438), "directSourceFile", 5437)) {
            (__HIVE_P2_temp5425_12 = this, __HIVE_P2_temp5425_13 = "sourceFile", __HIVE_P2_set(__HIVE_P2_temp5425_12, __HIVE_P2_temp5425_13, __HIVE_P2_get(__HIVE_P2_get(e, "options", 5442), "directSourceFile", 5441), 5439));
        }
        if (__HIVE_P2_get(__HIVE_P2_get(e, "options", 5444), "ranges", 5443)) {
            (__HIVE_P2_temp5425_15 = this, __HIVE_P2_temp5425_16 = "range", __HIVE_P2_set(__HIVE_P2_temp5425_15, __HIVE_P2_temp5425_16, (__HIVE_P2_temp5425_18 = 0, __HIVE_P2_temp5425_19 = t, __HIVE_P2_temp5425_18 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp5425_18, __HIVE_P2_temp5425_19, 5447), __HIVE_P2_temp5425_20 = 0, __HIVE_P2_temp5425_18 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp5425_18, __HIVE_P2_temp5425_20, 5447), __HIVE_P2_checkArrayDepth(__HIVE_P2_temp5425_18, 5447), __HIVE_P2_reserveArray(2, 5447, 2), __HIVE_P2_ownArray([__HIVE_P2_temp5425_19, __HIVE_P2_temp5425_20], 5447, "ARRAY", __HIVE_P2_temp5425_18)), 5445));
        }
    }, 21, 3, 0, 5425));
    var me = __HIVE_P2_get(K, "prototype", 5448);
    (__HIVE_P2_temp0_1422 = me, __HIVE_P2_temp0_1423 = "startNode", __HIVE_P2_set(__HIVE_P2_temp0_1422, __HIVE_P2_temp0_1423, (__HIVE_P2_reserveFunction(5451), __HIVE_P2_registerFunction(function () {
        return __HIVE_P2_construct(de, (__HIVE_P2_reserveArray(3, 5452), __HIVE_P2_ownArray([this, __HIVE_P2_get(this, "start", 5453), __HIVE_P2_get(this, "startLoc", 5454)], 5452, "CONTROL_ARRAY")), 5452);
    }, 0, 0, 0, 5451)), 5449));
    (__HIVE_P2_temp0_1425 = me, __HIVE_P2_temp0_1426 = "startNodeAt", __HIVE_P2_set(__HIVE_P2_temp0_1425, __HIVE_P2_temp0_1426, (__HIVE_P2_reserveFunction(5457), __HIVE_P2_registerFunction(function (e, t) {
        return __HIVE_P2_construct(de, (__HIVE_P2_reserveArray(3, 5458), __HIVE_P2_ownArray([this, e, t], 5458, "CONTROL_ARRAY")), 5458);
    }, 0, 2, 0, 5457)), 5455));
    function finishNodeAt(e, t, i, s) {
        var __HIVE_P2_temp5459_0, __HIVE_P2_temp5459_1, __HIVE_P2_temp5459_2, __HIVE_P2_temp5459_3, __HIVE_P2_temp5459_4, __HIVE_P2_temp5459_5, __HIVE_P2_temp5459_6, __HIVE_P2_temp5459_7, __HIVE_P2_temp5459_8, __HIVE_P2_temp5459_9, __HIVE_P2_temp5459_10, __HIVE_P2_temp5459_11;
        (__HIVE_P2_temp5459_0 = e, __HIVE_P2_temp5459_1 = "type", __HIVE_P2_set(__HIVE_P2_temp5459_0, __HIVE_P2_temp5459_1, t, 5460));
        (__HIVE_P2_temp5459_3 = e, __HIVE_P2_temp5459_4 = "end", __HIVE_P2_set(__HIVE_P2_temp5459_3, __HIVE_P2_temp5459_4, i, 5462));
        if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 5465), "locations", 5464)) {
            (__HIVE_P2_temp5459_6 = __HIVE_P2_get(e, "loc", 5468), __HIVE_P2_temp5459_7 = "end", __HIVE_P2_set(__HIVE_P2_temp5459_6, __HIVE_P2_temp5459_7, s, 5466));
        }
        if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 5470), "ranges", 5469)) {
            (__HIVE_P2_temp5459_9 = __HIVE_P2_get(e, "range", 5473), __HIVE_P2_temp5459_10 = 1, __HIVE_P2_set(__HIVE_P2_temp5459_9, __HIVE_P2_temp5459_10, i, 5471));
        }
        return e;
    }
    (__HIVE_P2_temp0_1428 = me, __HIVE_P2_temp0_1429 = "finishNode", __HIVE_P2_set(__HIVE_P2_temp0_1428, __HIVE_P2_temp0_1429, (__HIVE_P2_reserveFunction(5476), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp5476_0, __HIVE_P2_temp5476_1;
        return (__HIVE_P2_temp5476_0 = finishNodeAt, __HIVE_P2_temp5476_1 = __HIVE_P2_get(__HIVE_P2_temp5476_0, "call", 5477), __HIVE_P2_invoke(__HIVE_P2_temp5476_1, __HIVE_P2_temp5476_0, (__HIVE_P2_reserveArray(5, 5477), __HIVE_P2_ownArray([this, e, t, __HIVE_P2_get(this, "lastTokEnd", 5478), __HIVE_P2_get(this, "lastTokEndLoc", 5479)], 5477, "CONTROL_ARRAY")), 5477));
    }, 2, 2, 0, 5476)), 5474));
    (__HIVE_P2_temp0_1431 = me, __HIVE_P2_temp0_1432 = "finishNodeAt", __HIVE_P2_set(__HIVE_P2_temp0_1431, __HIVE_P2_temp0_1432, (__HIVE_P2_reserveFunction(5483), __HIVE_P2_registerFunction(function (e, t, i, s) {
        var __HIVE_P2_temp5483_0, __HIVE_P2_temp5483_1;
        return (__HIVE_P2_temp5483_0 = finishNodeAt, __HIVE_P2_temp5483_1 = __HIVE_P2_get(__HIVE_P2_temp5483_0, "call", 5484), __HIVE_P2_invoke(__HIVE_P2_temp5483_1, __HIVE_P2_temp5483_0, (__HIVE_P2_reserveArray(5, 5484), __HIVE_P2_ownArray([this, e, t, i, s], 5484, "CONTROL_ARRAY")), 5484));
    }, 2, 4, 0, 5483)), 5481));
    (__HIVE_P2_temp0_1434 = me, __HIVE_P2_temp0_1435 = "copyNode", __HIVE_P2_set(__HIVE_P2_temp0_1434, __HIVE_P2_temp0_1435, (__HIVE_P2_reserveFunction(5488), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp5488_0, __HIVE_P2_temp5488_1, __HIVE_P2_temp5488_2, __HIVE_P2_temp5488_3, __HIVE_P2_temp5488_4, __HIVE_P2_temp5488_5;
        var t = __HIVE_P2_construct(de, (__HIVE_P2_reserveArray(3, 5489), __HIVE_P2_ownArray([this, __HIVE_P2_get(e, "start", 5490), __HIVE_P2_get(this, "startLoc", 5491)], 5489, "CONTROL_ARRAY")), 5489);
        {
            __HIVE_P2_temp5488_0 = e;
            __HIVE_P2_temp5488_1 = __HIVE_P2_copyKeys(__HIVE_P2_temp5488_0, 5492);
            for (__HIVE_P2_temp5488_2 = 0; __HIVE_P2_temp5488_2 < __HIVE_P2_get(__HIVE_P2_temp5488_1, "length", 5492); __HIVE_P2_temp5488_2++) {
                __HIVE_P2_tick(5492);
                var i = __HIVE_P2_get(__HIVE_P2_temp5488_1, __HIVE_P2_temp5488_2, 5492);
                (__HIVE_P2_temp5488_3 = t, __HIVE_P2_temp5488_4 = i, __HIVE_P2_set(__HIVE_P2_temp5488_3, __HIVE_P2_temp5488_4, __HIVE_P2_get(e, i, 5495), 5493));
            }
        }
        return t;
    }, 8, 1, 0, 5488)), 5486));
    var ge = "Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sunu Sunuwar Todhri Todr Tulu_Tigalari Tutg Unknown Zzzz";
    var ve = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
    var xe = __HIVE_P2_binary("+", ve, " Extended_Pictographic", 5496);
    var ye = xe;
    var be = __HIVE_P2_binary("+", ye, " EBase EComp EMod EPres ExtPict", 5497);
    var ke = be;
    var _e = ke;
    var Se = (__HIVE_P2_reserveObject(6, 5498), __HIVE_P2_ownObject({ 9: ve, 10: xe, 11: ye, 12: be, 13: ke, 14: _e }, 5498, 6, 11));
    var Ce = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji";
    var we = (__HIVE_P2_reserveObject(6, 5499), __HIVE_P2_ownObject({ 9: "", 10: "", 11: "", 12: "", 13: "", 14: Ce }, 5499, 6, 11));
    var Ee = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
    var Ie = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
    var Ae = __HIVE_P2_binary("+", Ie, " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd", 5500);
    var Pe = __HIVE_P2_binary("+", Ae, " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho", 5501);
    var Ne = __HIVE_P2_binary("+", Pe, " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi", 5502);
    var Te = __HIVE_P2_binary("+", Ne, " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith", 5503);
    var Ve = __HIVE_P2_binary("+", __HIVE_P2_binary("+", Te, " ", 5505), ge, 5504);
    var Le = (__HIVE_P2_reserveObject(6, 5506), __HIVE_P2_ownObject({ 9: Ie, 10: Ae, 11: Pe, 12: Ne, 13: Te, 14: Ve }, 5506, 6, 11));
    var Re = (__HIVE_P2_reserveObject(0, 5507), __HIVE_P2_ownObject({}, 5507, 0, 0));
    function buildUnicodeData(e) {
        var __HIVE_P2_temp5508_0, __HIVE_P2_temp5508_1, __HIVE_P2_temp5508_2, __HIVE_P2_temp5508_3, __HIVE_P2_temp5508_4, __HIVE_P2_temp5508_5, __HIVE_P2_temp5508_6, __HIVE_P2_temp5508_7, __HIVE_P2_temp5508_8, __HIVE_P2_temp5508_9, __HIVE_P2_temp5508_10, __HIVE_P2_temp5508_11, __HIVE_P2_temp5508_12, __HIVE_P2_temp5508_13, __HIVE_P2_temp5508_14;
        var t = (__HIVE_P2_temp5508_0 = Re, __HIVE_P2_temp5508_1 = e, __HIVE_P2_set(__HIVE_P2_temp5508_0, __HIVE_P2_temp5508_1, (__HIVE_P2_reserveObject(3, 5511), __HIVE_P2_ownObject({ binary: __HIVE_P2_invoke(wordsRegexp, void 0, (__HIVE_P2_reserveArray(1, 5512), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_binary("+", __HIVE_P2_get(Se, e, 5515), " ", 5514), Ee, 5513)], 5512, "CONTROL_ARRAY")), 5512), binaryOfStrings: __HIVE_P2_invoke(wordsRegexp, void 0, (__HIVE_P2_reserveArray(1, 5516), __HIVE_P2_ownArray([__HIVE_P2_get(we, e, 5517)], 5516, "CONTROL_ARRAY")), 5516), nonBinary: (__HIVE_P2_reserveObject(2, 5518), __HIVE_P2_ownObject({ General_Category: __HIVE_P2_invoke(wordsRegexp, void 0, (__HIVE_P2_reserveArray(1, 5519), __HIVE_P2_ownArray([Ee], 5519, "CONTROL_ARRAY")), 5519), Script: __HIVE_P2_invoke(wordsRegexp, void 0, (__HIVE_P2_reserveArray(1, 5520), __HIVE_P2_ownArray([__HIVE_P2_get(Le, e, 5521)], 5520, "CONTROL_ARRAY")), 5520) }, 5518, 2, 22)) }, 5511, 3, 30)), 5509));
        (__HIVE_P2_temp5508_3 = __HIVE_P2_get(t, "nonBinary", 5524), __HIVE_P2_temp5508_4 = "Script_Extensions", __HIVE_P2_set(__HIVE_P2_temp5508_3, __HIVE_P2_temp5508_4, __HIVE_P2_get(__HIVE_P2_get(t, "nonBinary", 5526), "Script", 5525), 5522));
        (__HIVE_P2_temp5508_6 = __HIVE_P2_get(t, "nonBinary", 5529), __HIVE_P2_temp5508_7 = "gc", __HIVE_P2_set(__HIVE_P2_temp5508_6, __HIVE_P2_temp5508_7, __HIVE_P2_get(__HIVE_P2_get(t, "nonBinary", 5531), "General_Category", 5530), 5527));
        (__HIVE_P2_temp5508_9 = __HIVE_P2_get(t, "nonBinary", 5534), __HIVE_P2_temp5508_10 = "sc", __HIVE_P2_set(__HIVE_P2_temp5508_9, __HIVE_P2_temp5508_10, __HIVE_P2_get(__HIVE_P2_get(t, "nonBinary", 5536), "Script", 5535), 5532));
        (__HIVE_P2_temp5508_12 = __HIVE_P2_get(t, "nonBinary", 5539), __HIVE_P2_temp5508_13 = "scx", __HIVE_P2_set(__HIVE_P2_temp5508_12, __HIVE_P2_temp5508_13, __HIVE_P2_get(__HIVE_P2_get(t, "nonBinary", 5541), "Script_Extensions", 5540), 5537));
    }
    for (var De = 0, Oe = (__HIVE_P2_temp0_1437 = 0, __HIVE_P2_temp0_1438 = 9, __HIVE_P2_temp0_1437 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_1437, __HIVE_P2_temp0_1438, 5543), __HIVE_P2_temp0_1439 = 10, __HIVE_P2_temp0_1437 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_1437, __HIVE_P2_temp0_1439, 5543), __HIVE_P2_temp0_1440 = 11, __HIVE_P2_temp0_1437 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_1437, __HIVE_P2_temp0_1440, 5543), __HIVE_P2_temp0_1441 = 12, __HIVE_P2_temp0_1437 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_1437, __HIVE_P2_temp0_1441, 5543), __HIVE_P2_temp0_1442 = 13, __HIVE_P2_temp0_1437 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_1437, __HIVE_P2_temp0_1442, 5543), __HIVE_P2_temp0_1443 = 14, __HIVE_P2_temp0_1437 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp0_1437, __HIVE_P2_temp0_1443, 5543), __HIVE_P2_checkArrayDepth(__HIVE_P2_temp0_1437, 5543), __HIVE_P2_reserveArray(6, 5543, 6), __HIVE_P2_ownArray([__HIVE_P2_temp0_1438, __HIVE_P2_temp0_1439, __HIVE_P2_temp0_1440, __HIVE_P2_temp0_1441, __HIVE_P2_temp0_1442, __HIVE_P2_temp0_1443], 5543, "ARRAY", __HIVE_P2_temp0_1437)); __HIVE_P2_binary("<", De, __HIVE_P2_get(Oe, "length", 5545), 5544); De = __HIVE_P2_binary("+", De, 1, 5546)) {
        __HIVE_P2_tick(5542);
        var Be = __HIVE_P2_get(Oe, De, 5547);
        __HIVE_P2_invoke(buildUnicodeData, void 0, (__HIVE_P2_reserveArray(1, 5548), __HIVE_P2_ownArray([Be], 5548, "CONTROL_ARRAY")), 5548);
    }
    var Me = __HIVE_P2_get(K, "prototype", 5549);
    var Fe = (__HIVE_P2_reserveFunction(5550), __HIVE_P2_registerFunction(function BranchID(e, t) {
        var __HIVE_P2_temp5550_0, __HIVE_P2_temp5550_1, __HIVE_P2_temp5550_2, __HIVE_P2_temp5550_3, __HIVE_P2_temp5550_4, __HIVE_P2_temp5550_5;
        (__HIVE_P2_temp5550_0 = this, __HIVE_P2_temp5550_1 = "parent", __HIVE_P2_set(__HIVE_P2_temp5550_0, __HIVE_P2_temp5550_1, e, 5551));
        (__HIVE_P2_temp5550_3 = this, __HIVE_P2_temp5550_4 = "base", __HIVE_P2_set(__HIVE_P2_temp5550_3, __HIVE_P2_temp5550_4, t || this, 5553));
    }, 6, 2, 0, 5550));
    (__HIVE_P2_temp0_1444 = __HIVE_P2_get(Fe, "prototype", 5557), __HIVE_P2_temp0_1445 = "separatedFrom", __HIVE_P2_set(__HIVE_P2_temp0_1444, __HIVE_P2_temp0_1445, (__HIVE_P2_reserveFunction(5558), __HIVE_P2_registerFunction(function separatedFrom(e) {
        for (var t = this; t; t = __HIVE_P2_get(t, "parent", 5561)) {
            __HIVE_P2_tick(5559);
            for (var i = e; i; i = __HIVE_P2_get(i, "parent", 5564)) {
                __HIVE_P2_tick(5562);
                if (__HIVE_P2_get(t, "base", 5565) === __HIVE_P2_get(i, "base", 5566) && t !== i) {
                    return true;
                }
            }
        }
        return false;
    }, 2, 1, 0, 5558)), 5555));
    (__HIVE_P2_temp0_1447 = __HIVE_P2_get(Fe, "prototype", 5569), __HIVE_P2_temp0_1448 = "sibling", __HIVE_P2_set(__HIVE_P2_temp0_1447, __HIVE_P2_temp0_1448, (__HIVE_P2_reserveFunction(5570), __HIVE_P2_registerFunction(function sibling() {
        return __HIVE_P2_construct(Fe, (__HIVE_P2_reserveArray(2, 5571), __HIVE_P2_ownArray([__HIVE_P2_get(this, "parent", 5572), __HIVE_P2_get(this, "base", 5573)], 5571, "CONTROL_ARRAY")), 5571);
    }, 0, 0, 0, 5570)), 5567));
    var Ue = (__HIVE_P2_reserveFunction(5574), __HIVE_P2_registerFunction(function RegExpValidationState(e) {
        var __HIVE_P2_temp5574_0, __HIVE_P2_temp5574_1, __HIVE_P2_temp5574_2, __HIVE_P2_temp5574_3, __HIVE_P2_temp5574_4, __HIVE_P2_temp5574_5, __HIVE_P2_temp5574_6, __HIVE_P2_temp5574_7, __HIVE_P2_temp5574_8, __HIVE_P2_temp5574_9, __HIVE_P2_temp5574_10, __HIVE_P2_temp5574_11, __HIVE_P2_temp5574_12, __HIVE_P2_temp5574_13, __HIVE_P2_temp5574_14, __HIVE_P2_temp5574_15, __HIVE_P2_temp5574_16, __HIVE_P2_temp5574_17, __HIVE_P2_temp5574_18, __HIVE_P2_temp5574_19, __HIVE_P2_temp5574_20, __HIVE_P2_temp5574_21, __HIVE_P2_temp5574_22, __HIVE_P2_temp5574_23, __HIVE_P2_temp5574_24, __HIVE_P2_temp5574_25, __HIVE_P2_temp5574_26, __HIVE_P2_temp5574_27, __HIVE_P2_temp5574_28, __HIVE_P2_temp5574_29, __HIVE_P2_temp5574_30, __HIVE_P2_temp5574_31, __HIVE_P2_temp5574_32, __HIVE_P2_temp5574_33, __HIVE_P2_temp5574_34, __HIVE_P2_temp5574_35, __HIVE_P2_temp5574_36, __HIVE_P2_temp5574_37, __HIVE_P2_temp5574_38, __HIVE_P2_temp5574_39, __HIVE_P2_temp5574_40, __HIVE_P2_temp5574_41, __HIVE_P2_temp5574_42, __HIVE_P2_temp5574_43, __HIVE_P2_temp5574_44, __HIVE_P2_temp5574_45, __HIVE_P2_temp5574_46, __HIVE_P2_temp5574_47, __HIVE_P2_temp5574_48, __HIVE_P2_temp5574_49, __HIVE_P2_temp5574_50, __HIVE_P2_temp5574_51, __HIVE_P2_temp5574_52, __HIVE_P2_temp5574_53, __HIVE_P2_temp5574_54, __HIVE_P2_temp5574_55, __HIVE_P2_temp5574_56;
        (__HIVE_P2_temp5574_0 = this, __HIVE_P2_temp5574_1 = "parser", __HIVE_P2_set(__HIVE_P2_temp5574_0, __HIVE_P2_temp5574_1, e, 5575));
        (__HIVE_P2_temp5574_3 = this, __HIVE_P2_temp5574_4 = "validFlags", __HIVE_P2_set(__HIVE_P2_temp5574_3, __HIVE_P2_temp5574_4, __HIVE_P2_binary("+", __HIVE_P2_binary("+", __HIVE_P2_binary("+", __HIVE_P2_binary("+", "gim", (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(e, "options", 5585), "ecmaVersion", 5584), 6, 5583) ? "uy" : ""), 5582), (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(e, "options", 5588), "ecmaVersion", 5587), 9, 5586) ? "s" : ""), 5581), (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(e, "options", 5591), "ecmaVersion", 5590), 13, 5589) ? "d" : ""), 5580), (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(e, "options", 5594), "ecmaVersion", 5593), 15, 5592) ? "v" : ""), 5579), 5577));
        (__HIVE_P2_temp5574_6 = this, __HIVE_P2_temp5574_7 = "unicodeProperties", __HIVE_P2_set(__HIVE_P2_temp5574_6, __HIVE_P2_temp5574_7, __HIVE_P2_get(Re, __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(e, "options", 5600), "ecmaVersion", 5599), 14, 5598) ? 14 : __HIVE_P2_get(__HIVE_P2_get(e, "options", 5602), "ecmaVersion", 5601), 5597), 5595));
        (__HIVE_P2_temp5574_9 = this, __HIVE_P2_temp5574_10 = "source", __HIVE_P2_set(__HIVE_P2_temp5574_9, __HIVE_P2_temp5574_10, "", 5603));
        (__HIVE_P2_temp5574_12 = this, __HIVE_P2_temp5574_13 = "flags", __HIVE_P2_set(__HIVE_P2_temp5574_12, __HIVE_P2_temp5574_13, "", 5605));
        (__HIVE_P2_temp5574_15 = this, __HIVE_P2_temp5574_16 = "start", __HIVE_P2_set(__HIVE_P2_temp5574_15, __HIVE_P2_temp5574_16, 0, 5607));
        (__HIVE_P2_temp5574_18 = this, __HIVE_P2_temp5574_19 = "switchU", __HIVE_P2_set(__HIVE_P2_temp5574_18, __HIVE_P2_temp5574_19, false, 5609));
        (__HIVE_P2_temp5574_21 = this, __HIVE_P2_temp5574_22 = "switchV", __HIVE_P2_set(__HIVE_P2_temp5574_21, __HIVE_P2_temp5574_22, false, 5611));
        (__HIVE_P2_temp5574_24 = this, __HIVE_P2_temp5574_25 = "switchN", __HIVE_P2_set(__HIVE_P2_temp5574_24, __HIVE_P2_temp5574_25, false, 5613));
        (__HIVE_P2_temp5574_27 = this, __HIVE_P2_temp5574_28 = "pos", __HIVE_P2_set(__HIVE_P2_temp5574_27, __HIVE_P2_temp5574_28, 0, 5615));
        (__HIVE_P2_temp5574_30 = this, __HIVE_P2_temp5574_31 = "lastIntValue", __HIVE_P2_set(__HIVE_P2_temp5574_30, __HIVE_P2_temp5574_31, 0, 5617));
        (__HIVE_P2_temp5574_33 = this, __HIVE_P2_temp5574_34 = "lastStringValue", __HIVE_P2_set(__HIVE_P2_temp5574_33, __HIVE_P2_temp5574_34, "", 5619));
        (__HIVE_P2_temp5574_36 = this, __HIVE_P2_temp5574_37 = "lastAssertionIsQuantifiable", __HIVE_P2_set(__HIVE_P2_temp5574_36, __HIVE_P2_temp5574_37, false, 5621));
        (__HIVE_P2_temp5574_39 = this, __HIVE_P2_temp5574_40 = "numCapturingParens", __HIVE_P2_set(__HIVE_P2_temp5574_39, __HIVE_P2_temp5574_40, 0, 5623));
        (__HIVE_P2_temp5574_42 = this, __HIVE_P2_temp5574_43 = "maxBackReference", __HIVE_P2_set(__HIVE_P2_temp5574_42, __HIVE_P2_temp5574_43, 0, 5625));
        (__HIVE_P2_temp5574_45 = this, __HIVE_P2_temp5574_46 = "groupNames", __HIVE_P2_set(__HIVE_P2_temp5574_45, __HIVE_P2_temp5574_46, (__HIVE_P2_temp5574_48 = __HIVE_P2_Object, __HIVE_P2_temp5574_49 = __HIVE_P2_get(__HIVE_P2_temp5574_48, "create", 5629), __HIVE_P2_invoke(__HIVE_P2_temp5574_49, __HIVE_P2_temp5574_48, (__HIVE_P2_reserveArray(1, 5629), __HIVE_P2_ownArray([null], 5629, "CONTROL_ARRAY")), 5629)), 5627));
        (__HIVE_P2_temp5574_50 = this, __HIVE_P2_temp5574_51 = "backReferenceNames", __HIVE_P2_set(__HIVE_P2_temp5574_50, __HIVE_P2_temp5574_51, (__HIVE_P2_temp5574_53 = 0, __HIVE_P2_checkArrayDepth(__HIVE_P2_temp5574_53, 5633), __HIVE_P2_reserveArray(0, 5633, 0), __HIVE_P2_ownArray([], 5633, "ARRAY", __HIVE_P2_temp5574_53)), 5631));
        (__HIVE_P2_temp5574_54 = this, __HIVE_P2_temp5574_55 = "branchID", __HIVE_P2_set(__HIVE_P2_temp5574_54, __HIVE_P2_temp5574_55, null, 5634));
    }, 57, 1, 0, 5574));
    __HIVE_P2_set(__HIVE_P2_get(Ue, "prototype", 5641), "reset", (__HIVE_P2_reserveFunction(5637), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5638), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5638, "CONTROL_ARRAY")), 5638);
    }, 0, 0, 0, 5637)), 5639);
    __HIVE_P2_set(__HIVE_P2_get(Ue, "prototype", 5647), "raise", (__HIVE_P2_reserveFunction(5643), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5644), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5644, "CONTROL_ARRAY")), 5644);
    }, 0, 0, 0, 5643)), 5645);
    __HIVE_P2_set(__HIVE_P2_get(Ue, "prototype", 5653), "at", (__HIVE_P2_reserveFunction(5649), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5650), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5650, "CONTROL_ARRAY")), 5650);
    }, 0, 0, 0, 5649)), 5651);
    __HIVE_P2_set(__HIVE_P2_get(Ue, "prototype", 5659), "nextIndex", (__HIVE_P2_reserveFunction(5655), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5656), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5656, "CONTROL_ARRAY")), 5656);
    }, 0, 0, 0, 5655)), 5657);
    __HIVE_P2_set(__HIVE_P2_get(Ue, "prototype", 5665), "current", (__HIVE_P2_reserveFunction(5661), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5662), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5662, "CONTROL_ARRAY")), 5662);
    }, 0, 0, 0, 5661)), 5663);
    __HIVE_P2_set(__HIVE_P2_get(Ue, "prototype", 5671), "lookahead", (__HIVE_P2_reserveFunction(5667), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5668), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5668, "CONTROL_ARRAY")), 5668);
    }, 0, 0, 0, 5667)), 5669);
    __HIVE_P2_set(__HIVE_P2_get(Ue, "prototype", 5677), "advance", (__HIVE_P2_reserveFunction(5673), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5674), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5674, "CONTROL_ARRAY")), 5674);
    }, 0, 0, 0, 5673)), 5675);
    __HIVE_P2_set(__HIVE_P2_get(Ue, "prototype", 5683), "eat", (__HIVE_P2_reserveFunction(5679), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5680), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5680, "CONTROL_ARRAY")), 5680);
    }, 0, 0, 0, 5679)), 5681);
    __HIVE_P2_set(__HIVE_P2_get(Ue, "prototype", 5689), "eatChars", (__HIVE_P2_reserveFunction(5685), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5686), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5686, "CONTROL_ARRAY")), 5686);
    }, 0, 0, 0, 5685)), 5687);
    __HIVE_P2_set(Me, "validateRegExpFlags", (__HIVE_P2_reserveFunction(5691), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5692), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5692, "CONTROL_ARRAY")), 5692);
    }, 0, 0, 0, 5691)), 5693);
    function hasProp(e) {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5697), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5697, "CONTROL_ARRAY")), 5697);
    }
    __HIVE_P2_set(Me, "validateRegExpPattern", (__HIVE_P2_reserveFunction(5699), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5700), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5700, "CONTROL_ARRAY")), 5700);
    }, 0, 0, 0, 5699)), 5701);
    __HIVE_P2_set(Me, "regexp_pattern", (__HIVE_P2_reserveFunction(5704), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5705), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5705, "CONTROL_ARRAY")), 5705);
    }, 0, 0, 0, 5704)), 5706);
    __HIVE_P2_set(Me, "regexp_disjunction", (__HIVE_P2_reserveFunction(5709), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5710), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5710, "CONTROL_ARRAY")), 5710);
    }, 0, 0, 0, 5709)), 5711);
    __HIVE_P2_set(Me, "regexp_alternative", (__HIVE_P2_reserveFunction(5714), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5715), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5715, "CONTROL_ARRAY")), 5715);
    }, 0, 0, 0, 5714)), 5716);
    __HIVE_P2_set(Me, "regexp_eatTerm", (__HIVE_P2_reserveFunction(5719), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5720), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5720, "CONTROL_ARRAY")), 5720);
    }, 0, 0, 0, 5719)), 5721);
    __HIVE_P2_set(Me, "regexp_eatAssertion", (__HIVE_P2_reserveFunction(5724), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5725), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5725, "CONTROL_ARRAY")), 5725);
    }, 0, 0, 0, 5724)), 5726);
    __HIVE_P2_set(Me, "regexp_eatQuantifier", (__HIVE_P2_reserveFunction(5729), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5730), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5730, "CONTROL_ARRAY")), 5730);
    }, 0, 0, 0, 5729)), 5731);
    __HIVE_P2_set(Me, "regexp_eatQuantifierPrefix", (__HIVE_P2_reserveFunction(5734), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5735), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5735, "CONTROL_ARRAY")), 5735);
    }, 0, 0, 0, 5734)), 5736);
    __HIVE_P2_set(Me, "regexp_eatBracedQuantifier", (__HIVE_P2_reserveFunction(5739), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5740), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5740, "CONTROL_ARRAY")), 5740);
    }, 0, 0, 0, 5739)), 5741);
    __HIVE_P2_set(Me, "regexp_eatAtom", (__HIVE_P2_reserveFunction(5744), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5745), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5745, "CONTROL_ARRAY")), 5745);
    }, 0, 0, 0, 5744)), 5746);
    __HIVE_P2_set(Me, "regexp_eatReverseSolidusAtomEscape", (__HIVE_P2_reserveFunction(5749), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5750), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5750, "CONTROL_ARRAY")), 5750);
    }, 0, 0, 0, 5749)), 5751);
    __HIVE_P2_set(Me, "regexp_eatUncapturingGroup", (__HIVE_P2_reserveFunction(5754), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5755), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5755, "CONTROL_ARRAY")), 5755);
    }, 0, 0, 0, 5754)), 5756);
    __HIVE_P2_set(Me, "regexp_eatCapturingGroup", (__HIVE_P2_reserveFunction(5759), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5760), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5760, "CONTROL_ARRAY")), 5760);
    }, 0, 0, 0, 5759)), 5761);
    __HIVE_P2_set(Me, "regexp_eatModifiers", (__HIVE_P2_reserveFunction(5764), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5765), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5765, "CONTROL_ARRAY")), 5765);
    }, 0, 0, 0, 5764)), 5766);
    function isRegularExpressionModifier(e) {
        return e === 105 || e === 109 || e === 115;
    }
    __HIVE_P2_set(Me, "regexp_eatExtendedAtom", (__HIVE_P2_reserveFunction(5770), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5771), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5771, "CONTROL_ARRAY")), 5771);
    }, 0, 0, 0, 5770)), 5772);
    __HIVE_P2_set(Me, "regexp_eatInvalidBracedQuantifier", (__HIVE_P2_reserveFunction(5775), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5776), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5776, "CONTROL_ARRAY")), 5776);
    }, 0, 0, 0, 5775)), 5777);
    __HIVE_P2_set(Me, "regexp_eatSyntaxCharacter", (__HIVE_P2_reserveFunction(5780), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5781), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5781, "CONTROL_ARRAY")), 5781);
    }, 0, 0, 0, 5780)), 5782);
    function isSyntaxCharacter(e) {
        return e === 36 || __HIVE_P2_binary(">=", e, 40, 5785) && __HIVE_P2_binary("<=", e, 43, 5786) || e === 46 || e === 63 || __HIVE_P2_binary(">=", e, 91, 5787) && __HIVE_P2_binary("<=", e, 94, 5788) || __HIVE_P2_binary(">=", e, 123, 5789) && __HIVE_P2_binary("<=", e, 125, 5790);
    }
    __HIVE_P2_set(Me, "regexp_eatPatternCharacters", (__HIVE_P2_reserveFunction(5792), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5793), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5793, "CONTROL_ARRAY")), 5793);
    }, 0, 0, 0, 5792)), 5794);
    __HIVE_P2_set(Me, "regexp_eatExtendedPatternCharacter", (__HIVE_P2_reserveFunction(5797), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5798), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5798, "CONTROL_ARRAY")), 5798);
    }, 0, 0, 0, 5797)), 5799);
    __HIVE_P2_set(Me, "regexp_groupSpecifier", (__HIVE_P2_reserveFunction(5802), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5803), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5803, "CONTROL_ARRAY")), 5803);
    }, 0, 0, 0, 5802)), 5804);
    __HIVE_P2_set(Me, "regexp_eatGroupName", (__HIVE_P2_reserveFunction(5807), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5808), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5808, "CONTROL_ARRAY")), 5808);
    }, 0, 0, 0, 5807)), 5809);
    __HIVE_P2_set(Me, "regexp_eatRegExpIdentifierName", (__HIVE_P2_reserveFunction(5812), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5813), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5813, "CONTROL_ARRAY")), 5813);
    }, 0, 0, 0, 5812)), 5814);
    __HIVE_P2_set(Me, "regexp_eatRegExpIdentifierStart", (__HIVE_P2_reserveFunction(5817), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5818), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5818, "CONTROL_ARRAY")), 5818);
    }, 0, 0, 0, 5817)), 5819);
    function isRegExpIdentifierStart(e) {
        return __HIVE_P2_invoke(isIdentifierStart, void 0, (__HIVE_P2_reserveArray(2, 5822), __HIVE_P2_ownArray([e, true], 5822, "CONTROL_ARRAY")), 5822) || e === 36 || e === 95;
    }
    __HIVE_P2_set(Me, "regexp_eatRegExpIdentifierPart", (__HIVE_P2_reserveFunction(5824), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5825), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5825, "CONTROL_ARRAY")), 5825);
    }, 0, 0, 0, 5824)), 5826);
    function isRegExpIdentifierPart(e) {
        return __HIVE_P2_invoke(isIdentifierChar, void 0, (__HIVE_P2_reserveArray(2, 5829), __HIVE_P2_ownArray([e, true], 5829, "CONTROL_ARRAY")), 5829) || e === 36 || e === 95 || e === 8204 || e === 8205;
    }
    __HIVE_P2_set(Me, "regexp_eatAtomEscape", (__HIVE_P2_reserveFunction(5831), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5832), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5832, "CONTROL_ARRAY")), 5832);
    }, 0, 0, 0, 5831)), 5833);
    __HIVE_P2_set(Me, "regexp_eatBackReference", (__HIVE_P2_reserveFunction(5836), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5837), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5837, "CONTROL_ARRAY")), 5837);
    }, 0, 0, 0, 5836)), 5838);
    __HIVE_P2_set(Me, "regexp_eatKGroupName", (__HIVE_P2_reserveFunction(5841), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5842), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5842, "CONTROL_ARRAY")), 5842);
    }, 0, 0, 0, 5841)), 5843);
    __HIVE_P2_set(Me, "regexp_eatCharacterEscape", (__HIVE_P2_reserveFunction(5846), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5847), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5847, "CONTROL_ARRAY")), 5847);
    }, 0, 0, 0, 5846)), 5848);
    __HIVE_P2_set(Me, "regexp_eatCControlLetter", (__HIVE_P2_reserveFunction(5851), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5852), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5852, "CONTROL_ARRAY")), 5852);
    }, 0, 0, 0, 5851)), 5853);
    __HIVE_P2_set(Me, "regexp_eatZero", (__HIVE_P2_reserveFunction(5856), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5857), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5857, "CONTROL_ARRAY")), 5857);
    }, 0, 0, 0, 5856)), 5858);
    __HIVE_P2_set(Me, "regexp_eatControlEscape", (__HIVE_P2_reserveFunction(5861), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5862), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5862, "CONTROL_ARRAY")), 5862);
    }, 0, 0, 0, 5861)), 5863);
    __HIVE_P2_set(Me, "regexp_eatControlLetter", (__HIVE_P2_reserveFunction(5866), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5867), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5867, "CONTROL_ARRAY")), 5867);
    }, 0, 0, 0, 5866)), 5868);
    function isControlLetter(e) {
        return __HIVE_P2_binary(">=", e, 65, 5871) && __HIVE_P2_binary("<=", e, 90, 5872) || __HIVE_P2_binary(">=", e, 97, 5873) && __HIVE_P2_binary("<=", e, 122, 5874);
    }
    __HIVE_P2_set(Me, "regexp_eatRegExpUnicodeEscapeSequence", (__HIVE_P2_reserveFunction(5876), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5877), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5877, "CONTROL_ARRAY")), 5877);
    }, 0, 0, 0, 5876)), 5878);
    function isValidUnicode(e) {
        return __HIVE_P2_binary(">=", e, 0, 5881) && __HIVE_P2_binary("<=", e, 1114111, 5882);
    }
    __HIVE_P2_set(Me, "regexp_eatIdentityEscape", (__HIVE_P2_reserveFunction(5884), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5885), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5885, "CONTROL_ARRAY")), 5885);
    }, 0, 0, 0, 5884)), 5886);
    __HIVE_P2_set(Me, "regexp_eatDecimalEscape", (__HIVE_P2_reserveFunction(5889), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5890), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5890, "CONTROL_ARRAY")), 5890);
    }, 0, 0, 0, 5889)), 5891);
    var qe = 0;
    var je = 1;
    var Ge = 2;
    __HIVE_P2_set(Me, "regexp_eatCharacterClassEscape", (__HIVE_P2_reserveFunction(5894), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5895), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5895, "CONTROL_ARRAY")), 5895);
    }, 0, 0, 0, 5894)), 5896);
    function isCharacterClassEscape(e) {
        return e === 100 || e === 68 || e === 115 || e === 83 || e === 119 || e === 87;
    }
    __HIVE_P2_set(Me, "regexp_eatUnicodePropertyValueExpression", (__HIVE_P2_reserveFunction(5900), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5901), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5901, "CONTROL_ARRAY")), 5901);
    }, 0, 0, 0, 5900)), 5902);
    __HIVE_P2_set(Me, "regexp_validateUnicodePropertyNameAndValue", (__HIVE_P2_reserveFunction(5905), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5906), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5906, "CONTROL_ARRAY")), 5906);
    }, 0, 0, 0, 5905)), 5907);
    __HIVE_P2_set(Me, "regexp_validateUnicodePropertyNameOrValue", (__HIVE_P2_reserveFunction(5910), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5911), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5911, "CONTROL_ARRAY")), 5911);
    }, 0, 0, 0, 5910)), 5912);
    __HIVE_P2_set(Me, "regexp_eatUnicodePropertyName", (__HIVE_P2_reserveFunction(5915), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5916), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5916, "CONTROL_ARRAY")), 5916);
    }, 0, 0, 0, 5915)), 5917);
    function isUnicodePropertyNameCharacter(e) {
        return __HIVE_P2_invoke(isControlLetter, void 0, (__HIVE_P2_reserveArray(1, 5920), __HIVE_P2_ownArray([e], 5920, "CONTROL_ARRAY")), 5920) || e === 95;
    }
    __HIVE_P2_set(Me, "regexp_eatUnicodePropertyValue", (__HIVE_P2_reserveFunction(5922), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5923), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5923, "CONTROL_ARRAY")), 5923);
    }, 0, 0, 0, 5922)), 5924);
    function isUnicodePropertyValueCharacter(e) {
        return __HIVE_P2_invoke(isUnicodePropertyNameCharacter, void 0, (__HIVE_P2_reserveArray(1, 5927), __HIVE_P2_ownArray([e], 5927, "CONTROL_ARRAY")), 5927) || __HIVE_P2_invoke(isDecimalDigit, void 0, (__HIVE_P2_reserveArray(1, 5928), __HIVE_P2_ownArray([e], 5928, "CONTROL_ARRAY")), 5928);
    }
    __HIVE_P2_set(Me, "regexp_eatLoneUnicodePropertyNameOrValue", (__HIVE_P2_reserveFunction(5930), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5931), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5931, "CONTROL_ARRAY")), 5931);
    }, 0, 0, 0, 5930)), 5932);
    __HIVE_P2_set(Me, "regexp_eatCharacterClass", (__HIVE_P2_reserveFunction(5935), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5936), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5936, "CONTROL_ARRAY")), 5936);
    }, 0, 0, 0, 5935)), 5937);
    __HIVE_P2_set(Me, "regexp_classContents", (__HIVE_P2_reserveFunction(5940), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5941), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5941, "CONTROL_ARRAY")), 5941);
    }, 0, 0, 0, 5940)), 5942);
    __HIVE_P2_set(Me, "regexp_nonEmptyClassRanges", (__HIVE_P2_reserveFunction(5945), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5946), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5946, "CONTROL_ARRAY")), 5946);
    }, 0, 0, 0, 5945)), 5947);
    __HIVE_P2_set(Me, "regexp_eatClassAtom", (__HIVE_P2_reserveFunction(5950), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5951), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5951, "CONTROL_ARRAY")), 5951);
    }, 0, 0, 0, 5950)), 5952);
    __HIVE_P2_set(Me, "regexp_eatClassEscape", (__HIVE_P2_reserveFunction(5955), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5956), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5956, "CONTROL_ARRAY")), 5956);
    }, 0, 0, 0, 5955)), 5957);
    __HIVE_P2_set(Me, "regexp_classSetExpression", (__HIVE_P2_reserveFunction(5960), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5961), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5961, "CONTROL_ARRAY")), 5961);
    }, 0, 0, 0, 5960)), 5962);
    __HIVE_P2_set(Me, "regexp_eatClassSetRange", (__HIVE_P2_reserveFunction(5965), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5966), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5966, "CONTROL_ARRAY")), 5966);
    }, 0, 0, 0, 5965)), 5967);
    __HIVE_P2_set(Me, "regexp_eatClassSetOperand", (__HIVE_P2_reserveFunction(5970), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5971), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5971, "CONTROL_ARRAY")), 5971);
    }, 0, 0, 0, 5970)), 5972);
    __HIVE_P2_set(Me, "regexp_eatNestedClass", (__HIVE_P2_reserveFunction(5975), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5976), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5976, "CONTROL_ARRAY")), 5976);
    }, 0, 0, 0, 5975)), 5977);
    __HIVE_P2_set(Me, "regexp_eatClassStringDisjunction", (__HIVE_P2_reserveFunction(5980), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5981), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5981, "CONTROL_ARRAY")), 5981);
    }, 0, 0, 0, 5980)), 5982);
    __HIVE_P2_set(Me, "regexp_classStringDisjunctionContents", (__HIVE_P2_reserveFunction(5985), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5986), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5986, "CONTROL_ARRAY")), 5986);
    }, 0, 0, 0, 5985)), 5987);
    __HIVE_P2_set(Me, "regexp_classString", (__HIVE_P2_reserveFunction(5990), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5991), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5991, "CONTROL_ARRAY")), 5991);
    }, 0, 0, 0, 5990)), 5992);
    __HIVE_P2_set(Me, "regexp_eatClassSetCharacter", (__HIVE_P2_reserveFunction(5995), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 5996), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 5996, "CONTROL_ARRAY")), 5996);
    }, 0, 0, 0, 5995)), 5997);
    function isClassSetReservedDoublePunctuatorCharacter(e) {
        return e === 33 || __HIVE_P2_binary(">=", e, 35, 6000) && __HIVE_P2_binary("<=", e, 38, 6001) || __HIVE_P2_binary(">=", e, 42, 6002) && __HIVE_P2_binary("<=", e, 44, 6003) || e === 46 || __HIVE_P2_binary(">=", e, 58, 6004) && __HIVE_P2_binary("<=", e, 64, 6005) || e === 94 || e === 96 || e === 126;
    }
    function isClassSetSyntaxCharacter(e) {
        return e === 40 || e === 41 || e === 45 || e === 47 || __HIVE_P2_binary(">=", e, 91, 6007) && __HIVE_P2_binary("<=", e, 93, 6008) || __HIVE_P2_binary(">=", e, 123, 6009) && __HIVE_P2_binary("<=", e, 125, 6010);
    }
    __HIVE_P2_set(Me, "regexp_eatClassSetReservedPunctuator", (__HIVE_P2_reserveFunction(6012), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6013), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6013, "CONTROL_ARRAY")), 6013);
    }, 0, 0, 0, 6012)), 6014);
    function isClassSetReservedPunctuator(e) {
        return e === 33 || e === 35 || e === 37 || e === 38 || e === 44 || e === 45 || __HIVE_P2_binary(">=", e, 58, 6017) && __HIVE_P2_binary("<=", e, 62, 6018) || e === 64 || e === 96 || e === 126;
    }
    __HIVE_P2_set(Me, "regexp_eatClassControlLetter", (__HIVE_P2_reserveFunction(6020), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6021), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6021, "CONTROL_ARRAY")), 6021);
    }, 0, 0, 0, 6020)), 6022);
    __HIVE_P2_set(Me, "regexp_eatHexEscapeSequence", (__HIVE_P2_reserveFunction(6025), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6026), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6026, "CONTROL_ARRAY")), 6026);
    }, 0, 0, 0, 6025)), 6027);
    __HIVE_P2_set(Me, "regexp_eatDecimalDigits", (__HIVE_P2_reserveFunction(6030), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6031), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6031, "CONTROL_ARRAY")), 6031);
    }, 0, 0, 0, 6030)), 6032);
    function isDecimalDigit(e) {
        return __HIVE_P2_binary(">=", e, 48, 6035) && __HIVE_P2_binary("<=", e, 57, 6036);
    }
    __HIVE_P2_set(Me, "regexp_eatHexDigits", (__HIVE_P2_reserveFunction(6038), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6039), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6039, "CONTROL_ARRAY")), 6039);
    }, 0, 0, 0, 6038)), 6040);
    function isHexDigit(e) {
        return __HIVE_P2_binary(">=", e, 48, 6043) && __HIVE_P2_binary("<=", e, 57, 6044) || __HIVE_P2_binary(">=", e, 65, 6045) && __HIVE_P2_binary("<=", e, 70, 6046) || __HIVE_P2_binary(">=", e, 97, 6047) && __HIVE_P2_binary("<=", e, 102, 6048);
    }
    function hexToInt(e) {
        if (__HIVE_P2_binary(">=", e, 65, 6050) && __HIVE_P2_binary("<=", e, 70, 6051)) {
            return __HIVE_P2_binary("+", 10, (__HIVE_P2_binary("-", e, 65, 6053)), 6052);
        }
        if (__HIVE_P2_binary(">=", e, 97, 6054) && __HIVE_P2_binary("<=", e, 102, 6055)) {
            return __HIVE_P2_binary("+", 10, (__HIVE_P2_binary("-", e, 97, 6057)), 6056);
        }
        return __HIVE_P2_binary("-", e, 48, 6058);
    }
    __HIVE_P2_set(Me, "regexp_eatLegacyOctalEscapeSequence", (__HIVE_P2_reserveFunction(6060), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6061), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6061, "CONTROL_ARRAY")), 6061);
    }, 0, 0, 0, 6060)), 6062);
    __HIVE_P2_set(Me, "regexp_eatOctalDigit", (__HIVE_P2_reserveFunction(6065), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6066), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6066, "CONTROL_ARRAY")), 6066);
    }, 0, 0, 0, 6065)), 6067);
    function isOctalDigit(e) {
        return __HIVE_P2_binary(">=", e, 48, 6070) && __HIVE_P2_binary("<=", e, 55, 6071);
    }
    __HIVE_P2_set(Me, "regexp_eatFixedHexDigits", (__HIVE_P2_reserveFunction(6073), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6074), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6074, "CONTROL_ARRAY")), 6074);
    }, 0, 0, 0, 6073)), 6075);
    var He = (__HIVE_P2_reserveFunction(6077), __HIVE_P2_registerFunction(function Token(e) {
        var __HIVE_P2_temp6077_0, __HIVE_P2_temp6077_1, __HIVE_P2_temp6077_2, __HIVE_P2_temp6077_3, __HIVE_P2_temp6077_4, __HIVE_P2_temp6077_5, __HIVE_P2_temp6077_6, __HIVE_P2_temp6077_7, __HIVE_P2_temp6077_8, __HIVE_P2_temp6077_9, __HIVE_P2_temp6077_10, __HIVE_P2_temp6077_11, __HIVE_P2_temp6077_12, __HIVE_P2_temp6077_13, __HIVE_P2_temp6077_14, __HIVE_P2_temp6077_15, __HIVE_P2_temp6077_16, __HIVE_P2_temp6077_17, __HIVE_P2_temp6077_18, __HIVE_P2_temp6077_19, __HIVE_P2_temp6077_20;
        (__HIVE_P2_temp6077_0 = this, __HIVE_P2_temp6077_1 = "type", __HIVE_P2_set(__HIVE_P2_temp6077_0, __HIVE_P2_temp6077_1, __HIVE_P2_get(e, "type", 6080), 6078));
        (__HIVE_P2_temp6077_3 = this, __HIVE_P2_temp6077_4 = "value", __HIVE_P2_set(__HIVE_P2_temp6077_3, __HIVE_P2_temp6077_4, __HIVE_P2_get(e, "value", 6083), 6081));
        (__HIVE_P2_temp6077_6 = this, __HIVE_P2_temp6077_7 = "start", __HIVE_P2_set(__HIVE_P2_temp6077_6, __HIVE_P2_temp6077_7, __HIVE_P2_get(e, "start", 6086), 6084));
        (__HIVE_P2_temp6077_9 = this, __HIVE_P2_temp6077_10 = "end", __HIVE_P2_set(__HIVE_P2_temp6077_9, __HIVE_P2_temp6077_10, __HIVE_P2_get(e, "end", 6089), 6087));
        if (__HIVE_P2_get(__HIVE_P2_get(e, "options", 6091), "locations", 6090)) {
            (__HIVE_P2_temp6077_12 = this, __HIVE_P2_temp6077_13 = "loc", __HIVE_P2_set(__HIVE_P2_temp6077_12, __HIVE_P2_temp6077_13, __HIVE_P2_construct(A, (__HIVE_P2_reserveArray(3, 6094), __HIVE_P2_ownArray([e, __HIVE_P2_get(e, "startLoc", 6095), __HIVE_P2_get(e, "endLoc", 6096)], 6094, "CONTROL_ARRAY")), 6094), 6092));
        }
        if (__HIVE_P2_get(__HIVE_P2_get(e, "options", 6098), "ranges", 6097)) {
            (__HIVE_P2_temp6077_15 = this, __HIVE_P2_temp6077_16 = "range", __HIVE_P2_set(__HIVE_P2_temp6077_15, __HIVE_P2_temp6077_16, (__HIVE_P2_temp6077_18 = 0, __HIVE_P2_temp6077_19 = __HIVE_P2_get(e, "start", 6102), __HIVE_P2_temp6077_18 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp6077_18, __HIVE_P2_temp6077_19, 6101), __HIVE_P2_temp6077_20 = __HIVE_P2_get(e, "end", 6103), __HIVE_P2_temp6077_18 = __HIVE_P2_maximumChildDepth(__HIVE_P2_temp6077_18, __HIVE_P2_temp6077_20, 6101), __HIVE_P2_checkArrayDepth(__HIVE_P2_temp6077_18, 6101), __HIVE_P2_reserveArray(2, 6101, 2), __HIVE_P2_ownArray([__HIVE_P2_temp6077_19, __HIVE_P2_temp6077_20], 6101, "ARRAY", __HIVE_P2_temp6077_18)), 6099));
        }
    }, 21, 1, 0, 6077));
    var We = __HIVE_P2_get(K, "prototype", 6104);
    (__HIVE_P2_temp0_1450 = We, __HIVE_P2_temp0_1451 = "next", __HIVE_P2_set(__HIVE_P2_temp0_1450, __HIVE_P2_temp0_1451, (__HIVE_P2_reserveFunction(6107), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp6107_0, __HIVE_P2_temp6107_1, __HIVE_P2_temp6107_2, __HIVE_P2_temp6107_3, __HIVE_P2_temp6107_4, __HIVE_P2_temp6107_5, __HIVE_P2_temp6107_6, __HIVE_P2_temp6107_7, __HIVE_P2_temp6107_8, __HIVE_P2_temp6107_9, __HIVE_P2_temp6107_10, __HIVE_P2_temp6107_11, __HIVE_P2_temp6107_12, __HIVE_P2_temp6107_13, __HIVE_P2_temp6107_14, __HIVE_P2_temp6107_15;
        if (!e && __HIVE_P2_get(__HIVE_P2_get(this, "type", 6109), "keyword", 6108) && __HIVE_P2_get(this, "containsEsc", 6110)) {
            __HIVE_P2_syntaxRefusal(6111);
        }
        if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 6113), "onToken", 6112)) {
            (__HIVE_P2_temp6107_0 = __HIVE_P2_get(this, "options", 6117), __HIVE_P2_temp6107_1 = __HIVE_P2_get(__HIVE_P2_temp6107_0, "onToken", 6114), __HIVE_P2_invoke(__HIVE_P2_temp6107_1, __HIVE_P2_temp6107_0, (__HIVE_P2_reserveArray(1, 6114), __HIVE_P2_ownArray([__HIVE_P2_construct(He, (__HIVE_P2_reserveArray(1, 6115), __HIVE_P2_ownArray([this], 6115, "CONTROL_ARRAY")), 6115)], 6114, "CONTROL_ARRAY")), 6114));
        }
        (__HIVE_P2_temp6107_2 = this, __HIVE_P2_temp6107_3 = "lastTokEnd", __HIVE_P2_set(__HIVE_P2_temp6107_2, __HIVE_P2_temp6107_3, __HIVE_P2_get(this, "end", 6120), 6118));
        (__HIVE_P2_temp6107_5 = this, __HIVE_P2_temp6107_6 = "lastTokStart", __HIVE_P2_set(__HIVE_P2_temp6107_5, __HIVE_P2_temp6107_6, __HIVE_P2_get(this, "start", 6123), 6121));
        (__HIVE_P2_temp6107_8 = this, __HIVE_P2_temp6107_9 = "lastTokEndLoc", __HIVE_P2_set(__HIVE_P2_temp6107_8, __HIVE_P2_temp6107_9, __HIVE_P2_get(this, "endLoc", 6126), 6124));
        (__HIVE_P2_temp6107_11 = this, __HIVE_P2_temp6107_12 = "lastTokStartLoc", __HIVE_P2_set(__HIVE_P2_temp6107_11, __HIVE_P2_temp6107_12, __HIVE_P2_get(this, "startLoc", 6129), 6127));
        (__HIVE_P2_temp6107_14 = this, __HIVE_P2_temp6107_15 = __HIVE_P2_get(__HIVE_P2_temp6107_14, "nextToken", 6130), __HIVE_P2_invoke(__HIVE_P2_temp6107_15, __HIVE_P2_temp6107_14, (__HIVE_P2_reserveArray(0, 6130), __HIVE_P2_ownArray([], 6130, "CONTROL_ARRAY")), 6130));
    }, 16, 1, 0, 6107)), 6105));
    (__HIVE_P2_temp0_1453 = We, __HIVE_P2_temp0_1454 = "getToken", __HIVE_P2_set(__HIVE_P2_temp0_1453, __HIVE_P2_temp0_1454, (__HIVE_P2_reserveFunction(6134), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp6134_0, __HIVE_P2_temp6134_1;
        (__HIVE_P2_temp6134_0 = this, __HIVE_P2_temp6134_1 = __HIVE_P2_get(__HIVE_P2_temp6134_0, "next", 6135), __HIVE_P2_invoke(__HIVE_P2_temp6134_1, __HIVE_P2_temp6134_0, (__HIVE_P2_reserveArray(0, 6135), __HIVE_P2_ownArray([], 6135, "CONTROL_ARRAY")), 6135));
        return __HIVE_P2_construct(He, (__HIVE_P2_reserveArray(1, 6137), __HIVE_P2_ownArray([this], 6137, "CONTROL_ARRAY")), 6137);
    }, 2, 0, 0, 6134)), 6132));
    (__HIVE_P2_temp0_1456 = We, __HIVE_P2_temp0_1457 = "nextToken", __HIVE_P2_set(__HIVE_P2_temp0_1456, __HIVE_P2_temp0_1457, (__HIVE_P2_reserveFunction(6141), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp6141_0, __HIVE_P2_temp6141_1, __HIVE_P2_temp6141_2, __HIVE_P2_temp6141_3, __HIVE_P2_temp6141_4, __HIVE_P2_temp6141_5, __HIVE_P2_temp6141_6, __HIVE_P2_temp6141_7, __HIVE_P2_temp6141_8, __HIVE_P2_temp6141_9, __HIVE_P2_temp6141_10, __HIVE_P2_temp6141_11, __HIVE_P2_temp6141_12, __HIVE_P2_temp6141_13, __HIVE_P2_temp6141_14, __HIVE_P2_temp6141_15, __HIVE_P2_temp6141_16, __HIVE_P2_temp6141_17, __HIVE_P2_temp6141_18, __HIVE_P2_temp6141_19;
        var e = (__HIVE_P2_temp6141_0 = this, __HIVE_P2_temp6141_1 = __HIVE_P2_get(__HIVE_P2_temp6141_0, "curContext", 6142), __HIVE_P2_invoke(__HIVE_P2_temp6141_1, __HIVE_P2_temp6141_0, (__HIVE_P2_reserveArray(0, 6142), __HIVE_P2_ownArray([], 6142, "CONTROL_ARRAY")), 6142));
        if (!e || !__HIVE_P2_get(e, "preserveSpace", 6144)) {
            (__HIVE_P2_temp6141_2 = this, __HIVE_P2_temp6141_3 = __HIVE_P2_get(__HIVE_P2_temp6141_2, "skipSpace", 6145), __HIVE_P2_invoke(__HIVE_P2_temp6141_3, __HIVE_P2_temp6141_2, (__HIVE_P2_reserveArray(0, 6145), __HIVE_P2_ownArray([], 6145, "CONTROL_ARRAY")), 6145));
        }
        (__HIVE_P2_temp6141_4 = this, __HIVE_P2_temp6141_5 = "start", __HIVE_P2_set(__HIVE_P2_temp6141_4, __HIVE_P2_temp6141_5, __HIVE_P2_get(this, "pos", 6149), 6147));
        if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 6151), "locations", 6150)) {
            (__HIVE_P2_temp6141_7 = this, __HIVE_P2_temp6141_8 = "startLoc", __HIVE_P2_set(__HIVE_P2_temp6141_7, __HIVE_P2_temp6141_8, (__HIVE_P2_temp6141_10 = this, __HIVE_P2_temp6141_11 = __HIVE_P2_get(__HIVE_P2_temp6141_10, "curPosition", 6154), __HIVE_P2_invoke(__HIVE_P2_temp6141_11, __HIVE_P2_temp6141_10, (__HIVE_P2_reserveArray(0, 6154), __HIVE_P2_ownArray([], 6154, "CONTROL_ARRAY")), 6154)), 6152));
        }
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(this, "pos", 6157), __HIVE_P2_get(__HIVE_P2_get(this, "input", 6159), "length", 6158), 6156)) {
            return (__HIVE_P2_temp6141_12 = this, __HIVE_P2_temp6141_13 = __HIVE_P2_get(__HIVE_P2_temp6141_12, "finishToken", 6160), __HIVE_P2_invoke(__HIVE_P2_temp6141_13, __HIVE_P2_temp6141_12, (__HIVE_P2_reserveArray(1, 6160), __HIVE_P2_ownArray([__HIVE_P2_get(m, "eof", 6161)], 6160, "CONTROL_ARRAY")), 6160));
        }
        if (__HIVE_P2_get(e, "override", 6163)) {
            return (__HIVE_P2_temp6141_14 = e, __HIVE_P2_temp6141_15 = __HIVE_P2_get(__HIVE_P2_temp6141_14, "override", 6164), __HIVE_P2_invoke(__HIVE_P2_temp6141_15, __HIVE_P2_temp6141_14, (__HIVE_P2_reserveArray(1, 6164), __HIVE_P2_ownArray([this], 6164, "CONTROL_ARRAY")), 6164));
        }
        else {
            (__HIVE_P2_temp6141_18 = this, __HIVE_P2_temp6141_19 = __HIVE_P2_get(__HIVE_P2_temp6141_18, "readToken", 6166), __HIVE_P2_invoke(__HIVE_P2_temp6141_19, __HIVE_P2_temp6141_18, (__HIVE_P2_reserveArray(1, 6166), __HIVE_P2_ownArray([(__HIVE_P2_temp6141_16 = this, __HIVE_P2_temp6141_17 = __HIVE_P2_get(__HIVE_P2_temp6141_16, "fullCharCodeAtPos", 6167), __HIVE_P2_invoke(__HIVE_P2_temp6141_17, __HIVE_P2_temp6141_16, (__HIVE_P2_reserveArray(0, 6167), __HIVE_P2_ownArray([], 6167, "CONTROL_ARRAY")), 6167))], 6166, "CONTROL_ARRAY")), 6166));
        }
    }, 21, 0, 0, 6141)), 6139));
    (__HIVE_P2_temp0_1459 = We, __HIVE_P2_temp0_1460 = "readToken", __HIVE_P2_set(__HIVE_P2_temp0_1459, __HIVE_P2_temp0_1460, (__HIVE_P2_reserveFunction(6172), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp6172_0, __HIVE_P2_temp6172_1, __HIVE_P2_temp6172_2, __HIVE_P2_temp6172_3;
        if (__HIVE_P2_invoke(isIdentifierStart, void 0, (__HIVE_P2_reserveArray(2, 6173), __HIVE_P2_ownArray([e, __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 6176), "ecmaVersion", 6175), 6, 6174)], 6173, "CONTROL_ARRAY")), 6173) || e === 92) {
            return (__HIVE_P2_temp6172_0 = this, __HIVE_P2_temp6172_1 = __HIVE_P2_get(__HIVE_P2_temp6172_0, "readWord", 6177), __HIVE_P2_invoke(__HIVE_P2_temp6172_1, __HIVE_P2_temp6172_0, (__HIVE_P2_reserveArray(0, 6177), __HIVE_P2_ownArray([], 6177, "CONTROL_ARRAY")), 6177));
        }
        return (__HIVE_P2_temp6172_2 = this, __HIVE_P2_temp6172_3 = __HIVE_P2_get(__HIVE_P2_temp6172_2, "getTokenFromCode", 6179), __HIVE_P2_invoke(__HIVE_P2_temp6172_3, __HIVE_P2_temp6172_2, (__HIVE_P2_reserveArray(1, 6179), __HIVE_P2_ownArray([e], 6179, "CONTROL_ARRAY")), 6179));
    }, 4, 1, 0, 6172)), 6170));
    (__HIVE_P2_temp0_1462 = We, __HIVE_P2_temp0_1463 = "fullCharCodeAtPos", __HIVE_P2_set(__HIVE_P2_temp0_1462, __HIVE_P2_temp0_1463, (__HIVE_P2_reserveFunction(6183), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp6183_0, __HIVE_P2_temp6183_1, __HIVE_P2_temp6183_2, __HIVE_P2_temp6183_3;
        var e = (__HIVE_P2_temp6183_0 = __HIVE_P2_get(this, "input", 6187), __HIVE_P2_temp6183_1 = __HIVE_P2_get(__HIVE_P2_temp6183_0, "charCodeAt", 6184), __HIVE_P2_invoke(__HIVE_P2_temp6183_1, __HIVE_P2_temp6183_0, (__HIVE_P2_reserveArray(1, 6184), __HIVE_P2_ownArray([__HIVE_P2_get(this, "pos", 6185)], 6184, "CONTROL_ARRAY")), 6184));
        if (__HIVE_P2_binary("<=", e, 55295, 6188) || __HIVE_P2_binary(">=", e, 56320, 6189)) {
            return e;
        }
        var t = (__HIVE_P2_temp6183_2 = __HIVE_P2_get(this, "input", 6194), __HIVE_P2_temp6183_3 = __HIVE_P2_get(__HIVE_P2_temp6183_2, "charCodeAt", 6190), __HIVE_P2_invoke(__HIVE_P2_temp6183_3, __HIVE_P2_temp6183_2, (__HIVE_P2_reserveArray(1, 6190), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6192), 1, 6191)], 6190, "CONTROL_ARRAY")), 6190));
        return __HIVE_P2_binary("<=", t, 56319, 6195) || __HIVE_P2_binary(">=", t, 57344, 6196) ? e : __HIVE_P2_binary("-", __HIVE_P2_binary("+", (__HIVE_P2_binary("<<", e, 10, 6199)), t, 6198), 56613888, 6197);
    }, 6, 0, 0, 6183)), 6181));
    (__HIVE_P2_temp0_1465 = We, __HIVE_P2_temp0_1466 = "skipBlockComment", __HIVE_P2_set(__HIVE_P2_temp0_1465, __HIVE_P2_temp0_1466, (__HIVE_P2_reserveFunction(6202), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp6202_0, __HIVE_P2_temp6202_1, __HIVE_P2_temp6202_2, __HIVE_P2_temp6202_3, __HIVE_P2_temp6202_4, __HIVE_P2_temp6202_5, __HIVE_P2_temp6202_6, __HIVE_P2_temp6202_7, __HIVE_P2_temp6202_8, __HIVE_P2_temp6202_9, __HIVE_P2_temp6202_10, __HIVE_P2_temp6202_11, __HIVE_P2_temp6202_12, __HIVE_P2_temp6202_13, __HIVE_P2_temp6202_14, __HIVE_P2_temp6202_15, __HIVE_P2_temp6202_16, __HIVE_P2_temp6202_17, __HIVE_P2_temp6202_18;
        var e = __HIVE_P2_get(__HIVE_P2_get(this, "options", 6204), "onComment", 6203) && (__HIVE_P2_temp6202_0 = this, __HIVE_P2_temp6202_1 = __HIVE_P2_get(__HIVE_P2_temp6202_0, "curPosition", 6205), __HIVE_P2_invoke(__HIVE_P2_temp6202_1, __HIVE_P2_temp6202_0, (__HIVE_P2_reserveArray(0, 6205), __HIVE_P2_ownArray([], 6205, "CONTROL_ARRAY")), 6205));
        var t = __HIVE_P2_get(this, "pos", 6207), i = (__HIVE_P2_temp6202_5 = __HIVE_P2_get(this, "input", 6212), __HIVE_P2_temp6202_6 = __HIVE_P2_get(__HIVE_P2_temp6202_5, "indexOf", 6208), __HIVE_P2_invoke(__HIVE_P2_temp6202_6, __HIVE_P2_temp6202_5, (__HIVE_P2_reserveArray(2, 6208), __HIVE_P2_ownArray(["*/", (__HIVE_P2_temp6202_2 = this, __HIVE_P2_temp6202_3 = "pos", __HIVE_P2_temp6202_4 = __HIVE_P2_get(__HIVE_P2_temp6202_2, __HIVE_P2_temp6202_3, 6209), __HIVE_P2_set(__HIVE_P2_temp6202_2, __HIVE_P2_temp6202_3, __HIVE_P2_binary("+", __HIVE_P2_temp6202_4, 2, 6209), 6209))], 6208, "CONTROL_ARRAY")), 6208));
        if (i === __HIVE_P2_unary("-", 1, 6213)) {
            __HIVE_P2_syntaxRefusal(6214);
        }
        (__HIVE_P2_temp6202_7 = this, __HIVE_P2_temp6202_8 = "pos", __HIVE_P2_set(__HIVE_P2_temp6202_7, __HIVE_P2_temp6202_8, __HIVE_P2_binary("+", i, 2, 6217), 6215));
        if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 6219), "locations", 6218)) {
            for (var s = void 0, r = t; __HIVE_P2_binary(">", (s = __HIVE_P2_invoke(nextLineBreak, void 0, (__HIVE_P2_reserveArray(3, 6223), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6224), r, __HIVE_P2_get(this, "pos", 6225)], 6223, "CONTROL_ARRAY")), 6223)), __HIVE_P2_unary("-", 1, 6226), 6221);) {
                __HIVE_P2_tick(6220);
                __HIVE_P2_increment(this, "curLine", 1, false, 6227);
                r = (__HIVE_P2_temp6202_10 = this, __HIVE_P2_temp6202_11 = "lineStart", __HIVE_P2_set(__HIVE_P2_temp6202_10, __HIVE_P2_temp6202_11, s, 6230));
            }
        }
        if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 6233), "onComment", 6232)) {
            (__HIVE_P2_temp6202_17 = __HIVE_P2_get(this, "options", 6243), __HIVE_P2_temp6202_18 = __HIVE_P2_get(__HIVE_P2_temp6202_17, "onComment", 6234), __HIVE_P2_invoke(__HIVE_P2_temp6202_18, __HIVE_P2_temp6202_17, (__HIVE_P2_reserveArray(6, 6234), __HIVE_P2_ownArray([true, (__HIVE_P2_temp6202_13 = __HIVE_P2_get(this, "input", 6238), __HIVE_P2_temp6202_14 = __HIVE_P2_get(__HIVE_P2_temp6202_13, "slice", 6235), __HIVE_P2_invoke(__HIVE_P2_temp6202_14, __HIVE_P2_temp6202_13, (__HIVE_P2_reserveArray(2, 6235), __HIVE_P2_ownArray([__HIVE_P2_binary("+", t, 2, 6236), i], 6235, "CONTROL_ARRAY")), 6235)), t, __HIVE_P2_get(this, "pos", 6239), e, (__HIVE_P2_temp6202_15 = this, __HIVE_P2_temp6202_16 = __HIVE_P2_get(__HIVE_P2_temp6202_15, "curPosition", 6240), __HIVE_P2_invoke(__HIVE_P2_temp6202_16, __HIVE_P2_temp6202_15, (__HIVE_P2_reserveArray(0, 6240), __HIVE_P2_ownArray([], 6240, "CONTROL_ARRAY")), 6240))], 6234, "CONTROL_ARRAY")), 6234));
        }
    }, 24, 0, 0, 6202)), 6200));
    (__HIVE_P2_temp0_1468 = We, __HIVE_P2_temp0_1469 = "skipLineComment", __HIVE_P2_set(__HIVE_P2_temp0_1468, __HIVE_P2_temp0_1469, (__HIVE_P2_reserveFunction(6246), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp6246_0, __HIVE_P2_temp6246_1, __HIVE_P2_temp6246_2, __HIVE_P2_temp6246_3, __HIVE_P2_temp6246_4, __HIVE_P2_temp6246_5, __HIVE_P2_temp6246_6, __HIVE_P2_temp6246_7, __HIVE_P2_temp6246_8, __HIVE_P2_temp6246_9, __HIVE_P2_temp6246_10, __HIVE_P2_temp6246_11, __HIVE_P2_temp6246_12, __HIVE_P2_temp6246_13, __HIVE_P2_temp6246_14;
        var t = __HIVE_P2_get(this, "pos", 6247);
        var i = __HIVE_P2_get(__HIVE_P2_get(this, "options", 6249), "onComment", 6248) && (__HIVE_P2_temp6246_0 = this, __HIVE_P2_temp6246_1 = __HIVE_P2_get(__HIVE_P2_temp6246_0, "curPosition", 6250), __HIVE_P2_invoke(__HIVE_P2_temp6246_1, __HIVE_P2_temp6246_0, (__HIVE_P2_reserveArray(0, 6250), __HIVE_P2_ownArray([], 6250, "CONTROL_ARRAY")), 6250));
        var s = (__HIVE_P2_temp6246_5 = __HIVE_P2_get(this, "input", 6256), __HIVE_P2_temp6246_6 = __HIVE_P2_get(__HIVE_P2_temp6246_5, "charCodeAt", 6252), __HIVE_P2_invoke(__HIVE_P2_temp6246_6, __HIVE_P2_temp6246_5, (__HIVE_P2_reserveArray(1, 6252), __HIVE_P2_ownArray([(__HIVE_P2_temp6246_2 = this, __HIVE_P2_temp6246_3 = "pos", __HIVE_P2_temp6246_4 = __HIVE_P2_get(__HIVE_P2_temp6246_2, __HIVE_P2_temp6246_3, 6253), __HIVE_P2_set(__HIVE_P2_temp6246_2, __HIVE_P2_temp6246_3, __HIVE_P2_binary("+", __HIVE_P2_temp6246_4, e, 6253), 6253))], 6252, "CONTROL_ARRAY")), 6252));
        while (__HIVE_P2_binary("<", __HIVE_P2_get(this, "pos", 6259), __HIVE_P2_get(__HIVE_P2_get(this, "input", 6261), "length", 6260), 6258) && !__HIVE_P2_invoke(isNewLine, void 0, (__HIVE_P2_reserveArray(1, 6262), __HIVE_P2_ownArray([s], 6262, "CONTROL_ARRAY")), 6262)) {
            __HIVE_P2_tick(6257);
            s = (__HIVE_P2_temp6246_7 = __HIVE_P2_get(this, "input", 6268), __HIVE_P2_temp6246_8 = __HIVE_P2_get(__HIVE_P2_temp6246_7, "charCodeAt", 6264), __HIVE_P2_invoke(__HIVE_P2_temp6246_8, __HIVE_P2_temp6246_7, (__HIVE_P2_reserveArray(1, 6264), __HIVE_P2_ownArray([__HIVE_P2_increment(this, "pos", 1, false, 6265)], 6264, "CONTROL_ARRAY")), 6264));
        }
        if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 6270), "onComment", 6269)) {
            (__HIVE_P2_temp6246_13 = __HIVE_P2_get(this, "options", 6281), __HIVE_P2_temp6246_14 = __HIVE_P2_get(__HIVE_P2_temp6246_13, "onComment", 6271), __HIVE_P2_invoke(__HIVE_P2_temp6246_14, __HIVE_P2_temp6246_13, (__HIVE_P2_reserveArray(6, 6271), __HIVE_P2_ownArray([false, (__HIVE_P2_temp6246_9 = __HIVE_P2_get(this, "input", 6276), __HIVE_P2_temp6246_10 = __HIVE_P2_get(__HIVE_P2_temp6246_9, "slice", 6272), __HIVE_P2_invoke(__HIVE_P2_temp6246_10, __HIVE_P2_temp6246_9, (__HIVE_P2_reserveArray(2, 6272), __HIVE_P2_ownArray([__HIVE_P2_binary("+", t, e, 6273), __HIVE_P2_get(this, "pos", 6274)], 6272, "CONTROL_ARRAY")), 6272)), t, __HIVE_P2_get(this, "pos", 6277), i, (__HIVE_P2_temp6246_11 = this, __HIVE_P2_temp6246_12 = __HIVE_P2_get(__HIVE_P2_temp6246_11, "curPosition", 6278), __HIVE_P2_invoke(__HIVE_P2_temp6246_12, __HIVE_P2_temp6246_11, (__HIVE_P2_reserveArray(0, 6278), __HIVE_P2_ownArray([], 6278, "CONTROL_ARRAY")), 6278))], 6271, "CONTROL_ARRAY")), 6271));
        }
    }, 18, 1, 0, 6246)), 6244));
    __HIVE_P2_set(We, "skipSpace", (__HIVE_P2_reserveFunction(6283), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp6283_0, __HIVE_P2_temp6283_1, __HIVE_P2_temp6283_2;
        var packed = __HIVE_P2_invoke(__scalarTrivia, void 0, (__HIVE_P2_reserveArray(5, 6284), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6285), __HIVE_P2_get(this, "pos", 6286), __HIVE_P2_get(this, "inModule", 6287), __HIVE_P2_get(this, "lastTokEnd", 6288), __HIVE_P2_get(__HIVE_P2_get(this, "options", 6290), "allowHashBang", 6289)], 6284, "CONTROL_ARRAY")), 6284);
        (__HIVE_P2_temp6283_0 = this, __HIVE_P2_temp6283_1 = "pos", __HIVE_P2_set(__HIVE_P2_temp6283_0, __HIVE_P2_temp6283_1, __HIVE_P2_binary("/", (__HIVE_P2_binary("-", packed, __HIVE_P2_binary("%", packed, 2, 6295), 6294)), 2, 6293), 6291));
    }, 4, 0, 0, 6283)), 6296);
    (__HIVE_P2_temp0_1471 = We, __HIVE_P2_temp0_1472 = "finishToken", __HIVE_P2_set(__HIVE_P2_temp0_1471, __HIVE_P2_temp0_1472, (__HIVE_P2_reserveFunction(6300), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp6300_0, __HIVE_P2_temp6300_1, __HIVE_P2_temp6300_2, __HIVE_P2_temp6300_3, __HIVE_P2_temp6300_4, __HIVE_P2_temp6300_5, __HIVE_P2_temp6300_6, __HIVE_P2_temp6300_7, __HIVE_P2_temp6300_8, __HIVE_P2_temp6300_9, __HIVE_P2_temp6300_10, __HIVE_P2_temp6300_11, __HIVE_P2_temp6300_12, __HIVE_P2_temp6300_13, __HIVE_P2_temp6300_14, __HIVE_P2_temp6300_15;
        (__HIVE_P2_temp6300_0 = this, __HIVE_P2_temp6300_1 = "end", __HIVE_P2_set(__HIVE_P2_temp6300_0, __HIVE_P2_temp6300_1, __HIVE_P2_get(this, "pos", 6303), 6301));
        if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 6305), "locations", 6304)) {
            (__HIVE_P2_temp6300_3 = this, __HIVE_P2_temp6300_4 = "endLoc", __HIVE_P2_set(__HIVE_P2_temp6300_3, __HIVE_P2_temp6300_4, (__HIVE_P2_temp6300_6 = this, __HIVE_P2_temp6300_7 = __HIVE_P2_get(__HIVE_P2_temp6300_6, "curPosition", 6308), __HIVE_P2_invoke(__HIVE_P2_temp6300_7, __HIVE_P2_temp6300_6, (__HIVE_P2_reserveArray(0, 6308), __HIVE_P2_ownArray([], 6308, "CONTROL_ARRAY")), 6308)), 6306));
        }
        var i = __HIVE_P2_get(this, "type", 6310);
        (__HIVE_P2_temp6300_8 = this, __HIVE_P2_temp6300_9 = "type", __HIVE_P2_set(__HIVE_P2_temp6300_8, __HIVE_P2_temp6300_9, e, 6311));
        (__HIVE_P2_temp6300_11 = this, __HIVE_P2_temp6300_12 = "value", __HIVE_P2_set(__HIVE_P2_temp6300_11, __HIVE_P2_temp6300_12, t, 6313));
        (__HIVE_P2_temp6300_14 = this, __HIVE_P2_temp6300_15 = __HIVE_P2_get(__HIVE_P2_temp6300_14, "updateContext", 6315), __HIVE_P2_invoke(__HIVE_P2_temp6300_15, __HIVE_P2_temp6300_14, (__HIVE_P2_reserveArray(1, 6315), __HIVE_P2_ownArray([i], 6315, "CONTROL_ARRAY")), 6315));
    }, 17, 2, 0, 6300)), 6298));
    (__HIVE_P2_temp0_1474 = We, __HIVE_P2_temp0_1475 = "readToken_dot", __HIVE_P2_set(__HIVE_P2_temp0_1474, __HIVE_P2_temp0_1475, (__HIVE_P2_reserveFunction(6319), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp6319_0, __HIVE_P2_temp6319_1, __HIVE_P2_temp6319_2, __HIVE_P2_temp6319_3, __HIVE_P2_temp6319_4, __HIVE_P2_temp6319_5, __HIVE_P2_temp6319_6, __HIVE_P2_temp6319_7, __HIVE_P2_temp6319_8, __HIVE_P2_temp6319_9, __HIVE_P2_temp6319_10, __HIVE_P2_temp6319_11, __HIVE_P2_temp6319_12;
        var e = (__HIVE_P2_temp6319_0 = __HIVE_P2_get(this, "input", 6324), __HIVE_P2_temp6319_1 = __HIVE_P2_get(__HIVE_P2_temp6319_0, "charCodeAt", 6320), __HIVE_P2_invoke(__HIVE_P2_temp6319_1, __HIVE_P2_temp6319_0, (__HIVE_P2_reserveArray(1, 6320), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6322), 1, 6321)], 6320, "CONTROL_ARRAY")), 6320));
        if (__HIVE_P2_binary(">=", e, 48, 6325) && __HIVE_P2_binary("<=", e, 57, 6326)) {
            return (__HIVE_P2_temp6319_2 = this, __HIVE_P2_temp6319_3 = __HIVE_P2_get(__HIVE_P2_temp6319_2, "readNumber", 6327), __HIVE_P2_invoke(__HIVE_P2_temp6319_3, __HIVE_P2_temp6319_2, (__HIVE_P2_reserveArray(1, 6327), __HIVE_P2_ownArray([true], 6327, "CONTROL_ARRAY")), 6327));
        }
        var t = (__HIVE_P2_temp6319_4 = __HIVE_P2_get(this, "input", 6333), __HIVE_P2_temp6319_5 = __HIVE_P2_get(__HIVE_P2_temp6319_4, "charCodeAt", 6329), __HIVE_P2_invoke(__HIVE_P2_temp6319_5, __HIVE_P2_temp6319_4, (__HIVE_P2_reserveArray(1, 6329), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6331), 2, 6330)], 6329, "CONTROL_ARRAY")), 6329));
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 6336), "ecmaVersion", 6335), 6, 6334) && e === 46 && t === 46) {
            (__HIVE_P2_temp6319_6 = this, __HIVE_P2_temp6319_7 = "pos", __HIVE_P2_temp6319_8 = __HIVE_P2_get(__HIVE_P2_temp6319_6, __HIVE_P2_temp6319_7, 6337), __HIVE_P2_set(__HIVE_P2_temp6319_6, __HIVE_P2_temp6319_7, __HIVE_P2_binary("+", __HIVE_P2_temp6319_8, 3, 6337), 6337));
            return (__HIVE_P2_temp6319_9 = this, __HIVE_P2_temp6319_10 = __HIVE_P2_get(__HIVE_P2_temp6319_9, "finishToken", 6339), __HIVE_P2_invoke(__HIVE_P2_temp6319_10, __HIVE_P2_temp6319_9, (__HIVE_P2_reserveArray(1, 6339), __HIVE_P2_ownArray([__HIVE_P2_get(m, "ellipsis", 6340)], 6339, "CONTROL_ARRAY")), 6339));
        }
        else {
            __HIVE_P2_increment(this, "pos", 1, false, 6342);
            return (__HIVE_P2_temp6319_11 = this, __HIVE_P2_temp6319_12 = __HIVE_P2_get(__HIVE_P2_temp6319_11, "finishToken", 6344), __HIVE_P2_invoke(__HIVE_P2_temp6319_12, __HIVE_P2_temp6319_11, (__HIVE_P2_reserveArray(1, 6344), __HIVE_P2_ownArray([__HIVE_P2_get(m, "dot", 6345)], 6344, "CONTROL_ARRAY")), 6344));
        }
    }, 15, 0, 0, 6319)), 6317));
    (__HIVE_P2_temp0_1477 = We, __HIVE_P2_temp0_1478 = "readToken_slash", __HIVE_P2_set(__HIVE_P2_temp0_1477, __HIVE_P2_temp0_1478, (__HIVE_P2_reserveFunction(6349), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp6349_0, __HIVE_P2_temp6349_1, __HIVE_P2_temp6349_2, __HIVE_P2_temp6349_3, __HIVE_P2_temp6349_4, __HIVE_P2_temp6349_5, __HIVE_P2_temp6349_6, __HIVE_P2_temp6349_7;
        var e = (__HIVE_P2_temp6349_0 = __HIVE_P2_get(this, "input", 6354), __HIVE_P2_temp6349_1 = __HIVE_P2_get(__HIVE_P2_temp6349_0, "charCodeAt", 6350), __HIVE_P2_invoke(__HIVE_P2_temp6349_1, __HIVE_P2_temp6349_0, (__HIVE_P2_reserveArray(1, 6350), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6352), 1, 6351)], 6350, "CONTROL_ARRAY")), 6350));
        if (__HIVE_P2_get(this, "exprAllowed", 6355)) {
            __HIVE_P2_increment(this, "pos", 1, false, 6356);
            return (__HIVE_P2_temp6349_2 = this, __HIVE_P2_temp6349_3 = __HIVE_P2_get(__HIVE_P2_temp6349_2, "readRegexp", 6358), __HIVE_P2_invoke(__HIVE_P2_temp6349_3, __HIVE_P2_temp6349_2, (__HIVE_P2_reserveArray(0, 6358), __HIVE_P2_ownArray([], 6358, "CONTROL_ARRAY")), 6358));
        }
        if (e === 61) {
            return (__HIVE_P2_temp6349_4 = this, __HIVE_P2_temp6349_5 = __HIVE_P2_get(__HIVE_P2_temp6349_4, "finishOp", 6360), __HIVE_P2_invoke(__HIVE_P2_temp6349_5, __HIVE_P2_temp6349_4, (__HIVE_P2_reserveArray(2, 6360), __HIVE_P2_ownArray([__HIVE_P2_get(m, "assign", 6361), 2], 6360, "CONTROL_ARRAY")), 6360));
        }
        return (__HIVE_P2_temp6349_6 = this, __HIVE_P2_temp6349_7 = __HIVE_P2_get(__HIVE_P2_temp6349_6, "finishOp", 6363), __HIVE_P2_invoke(__HIVE_P2_temp6349_7, __HIVE_P2_temp6349_6, (__HIVE_P2_reserveArray(2, 6363), __HIVE_P2_ownArray([__HIVE_P2_get(m, "slash", 6364), 1], 6363, "CONTROL_ARRAY")), 6363));
    }, 9, 0, 0, 6349)), 6347));
    (__HIVE_P2_temp0_1480 = We, __HIVE_P2_temp0_1481 = "readToken_mult_modulo_exp", __HIVE_P2_set(__HIVE_P2_temp0_1480, __HIVE_P2_temp0_1481, (__HIVE_P2_reserveFunction(6368), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp6368_0, __HIVE_P2_temp6368_1, __HIVE_P2_temp6368_2, __HIVE_P2_temp6368_3, __HIVE_P2_temp6368_4, __HIVE_P2_temp6368_5, __HIVE_P2_temp6368_6, __HIVE_P2_temp6368_7, __HIVE_P2_temp6368_8, __HIVE_P2_temp6368_9;
        var t = (__HIVE_P2_temp6368_0 = __HIVE_P2_get(this, "input", 6373), __HIVE_P2_temp6368_1 = __HIVE_P2_get(__HIVE_P2_temp6368_0, "charCodeAt", 6369), __HIVE_P2_invoke(__HIVE_P2_temp6368_1, __HIVE_P2_temp6368_0, (__HIVE_P2_reserveArray(1, 6369), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6371), 1, 6370)], 6369, "CONTROL_ARRAY")), 6369));
        var i = 1;
        var s = e === 42 ? __HIVE_P2_get(m, "star", 6374) : __HIVE_P2_get(m, "modulo", 6375);
        if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 6378), "ecmaVersion", 6377), 7, 6376) && e === 42 && t === 42) {
            (__HIVE_P2_temp6368_2 = __HIVE_P2_numeric(i, 6379), __HIVE_P2_temp6368_3 = __HIVE_P2_temp6368_2 + 1, i = __HIVE_P2_temp6368_3, __HIVE_P2_temp6368_3);
            s = __HIVE_P2_get(m, "starstar", 6381);
            t = (__HIVE_P2_temp6368_4 = __HIVE_P2_get(this, "input", 6387), __HIVE_P2_temp6368_5 = __HIVE_P2_get(__HIVE_P2_temp6368_4, "charCodeAt", 6383), __HIVE_P2_invoke(__HIVE_P2_temp6368_5, __HIVE_P2_temp6368_4, (__HIVE_P2_reserveArray(1, 6383), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6385), 2, 6384)], 6383, "CONTROL_ARRAY")), 6383));
        }
        if (t === 61) {
            return (__HIVE_P2_temp6368_6 = this, __HIVE_P2_temp6368_7 = __HIVE_P2_get(__HIVE_P2_temp6368_6, "finishOp", 6388), __HIVE_P2_invoke(__HIVE_P2_temp6368_7, __HIVE_P2_temp6368_6, (__HIVE_P2_reserveArray(2, 6388), __HIVE_P2_ownArray([__HIVE_P2_get(m, "assign", 6389), __HIVE_P2_binary("+", i, 1, 6390)], 6388, "CONTROL_ARRAY")), 6388));
        }
        return (__HIVE_P2_temp6368_8 = this, __HIVE_P2_temp6368_9 = __HIVE_P2_get(__HIVE_P2_temp6368_8, "finishOp", 6392), __HIVE_P2_invoke(__HIVE_P2_temp6368_9, __HIVE_P2_temp6368_8, (__HIVE_P2_reserveArray(2, 6392), __HIVE_P2_ownArray([s, i], 6392, "CONTROL_ARRAY")), 6392));
    }, 13, 1, 0, 6368)), 6366));
    (__HIVE_P2_temp0_1483 = We, __HIVE_P2_temp0_1484 = "readToken_pipe_amp", __HIVE_P2_set(__HIVE_P2_temp0_1483, __HIVE_P2_temp0_1484, (__HIVE_P2_reserveFunction(6396), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp6396_0, __HIVE_P2_temp6396_1, __HIVE_P2_temp6396_2, __HIVE_P2_temp6396_3, __HIVE_P2_temp6396_4, __HIVE_P2_temp6396_5, __HIVE_P2_temp6396_6, __HIVE_P2_temp6396_7, __HIVE_P2_temp6396_8, __HIVE_P2_temp6396_9, __HIVE_P2_temp6396_10, __HIVE_P2_temp6396_11;
        var t = (__HIVE_P2_temp6396_0 = __HIVE_P2_get(this, "input", 6401), __HIVE_P2_temp6396_1 = __HIVE_P2_get(__HIVE_P2_temp6396_0, "charCodeAt", 6397), __HIVE_P2_invoke(__HIVE_P2_temp6396_1, __HIVE_P2_temp6396_0, (__HIVE_P2_reserveArray(1, 6397), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6399), 1, 6398)], 6397, "CONTROL_ARRAY")), 6397));
        if (t === e) {
            if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 6404), "ecmaVersion", 6403), 12, 6402)) {
                var i = (__HIVE_P2_temp6396_2 = __HIVE_P2_get(this, "input", 6409), __HIVE_P2_temp6396_3 = __HIVE_P2_get(__HIVE_P2_temp6396_2, "charCodeAt", 6405), __HIVE_P2_invoke(__HIVE_P2_temp6396_3, __HIVE_P2_temp6396_2, (__HIVE_P2_reserveArray(1, 6405), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6407), 2, 6406)], 6405, "CONTROL_ARRAY")), 6405));
                if (i === 61) {
                    return (__HIVE_P2_temp6396_4 = this, __HIVE_P2_temp6396_5 = __HIVE_P2_get(__HIVE_P2_temp6396_4, "finishOp", 6410), __HIVE_P2_invoke(__HIVE_P2_temp6396_5, __HIVE_P2_temp6396_4, (__HIVE_P2_reserveArray(2, 6410), __HIVE_P2_ownArray([__HIVE_P2_get(m, "assign", 6411), 3], 6410, "CONTROL_ARRAY")), 6410));
                }
            }
            return (__HIVE_P2_temp6396_6 = this, __HIVE_P2_temp6396_7 = __HIVE_P2_get(__HIVE_P2_temp6396_6, "finishOp", 6413), __HIVE_P2_invoke(__HIVE_P2_temp6396_7, __HIVE_P2_temp6396_6, (__HIVE_P2_reserveArray(2, 6413), __HIVE_P2_ownArray([e === 124 ? __HIVE_P2_get(m, "logicalOR", 6414) : __HIVE_P2_get(m, "logicalAND", 6415), 2], 6413, "CONTROL_ARRAY")), 6413));
        }
        if (t === 61) {
            return (__HIVE_P2_temp6396_8 = this, __HIVE_P2_temp6396_9 = __HIVE_P2_get(__HIVE_P2_temp6396_8, "finishOp", 6417), __HIVE_P2_invoke(__HIVE_P2_temp6396_9, __HIVE_P2_temp6396_8, (__HIVE_P2_reserveArray(2, 6417), __HIVE_P2_ownArray([__HIVE_P2_get(m, "assign", 6418), 2], 6417, "CONTROL_ARRAY")), 6417));
        }
        return (__HIVE_P2_temp6396_10 = this, __HIVE_P2_temp6396_11 = __HIVE_P2_get(__HIVE_P2_temp6396_10, "finishOp", 6420), __HIVE_P2_invoke(__HIVE_P2_temp6396_11, __HIVE_P2_temp6396_10, (__HIVE_P2_reserveArray(2, 6420), __HIVE_P2_ownArray([e === 124 ? __HIVE_P2_get(m, "bitwiseOR", 6421) : __HIVE_P2_get(m, "bitwiseAND", 6422), 1], 6420, "CONTROL_ARRAY")), 6420));
    }, 14, 1, 0, 6396)), 6394));
    (__HIVE_P2_temp0_1486 = We, __HIVE_P2_temp0_1487 = "readToken_caret", __HIVE_P2_set(__HIVE_P2_temp0_1486, __HIVE_P2_temp0_1487, (__HIVE_P2_reserveFunction(6426), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp6426_0, __HIVE_P2_temp6426_1, __HIVE_P2_temp6426_2, __HIVE_P2_temp6426_3, __HIVE_P2_temp6426_4, __HIVE_P2_temp6426_5;
        var e = (__HIVE_P2_temp6426_0 = __HIVE_P2_get(this, "input", 6431), __HIVE_P2_temp6426_1 = __HIVE_P2_get(__HIVE_P2_temp6426_0, "charCodeAt", 6427), __HIVE_P2_invoke(__HIVE_P2_temp6426_1, __HIVE_P2_temp6426_0, (__HIVE_P2_reserveArray(1, 6427), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6429), 1, 6428)], 6427, "CONTROL_ARRAY")), 6427));
        if (e === 61) {
            return (__HIVE_P2_temp6426_2 = this, __HIVE_P2_temp6426_3 = __HIVE_P2_get(__HIVE_P2_temp6426_2, "finishOp", 6432), __HIVE_P2_invoke(__HIVE_P2_temp6426_3, __HIVE_P2_temp6426_2, (__HIVE_P2_reserveArray(2, 6432), __HIVE_P2_ownArray([__HIVE_P2_get(m, "assign", 6433), 2], 6432, "CONTROL_ARRAY")), 6432));
        }
        return (__HIVE_P2_temp6426_4 = this, __HIVE_P2_temp6426_5 = __HIVE_P2_get(__HIVE_P2_temp6426_4, "finishOp", 6435), __HIVE_P2_invoke(__HIVE_P2_temp6426_5, __HIVE_P2_temp6426_4, (__HIVE_P2_reserveArray(2, 6435), __HIVE_P2_ownArray([__HIVE_P2_get(m, "bitwiseXOR", 6436), 1], 6435, "CONTROL_ARRAY")), 6435));
    }, 7, 0, 0, 6426)), 6424));
    (__HIVE_P2_temp0_1489 = We, __HIVE_P2_temp0_1490 = "readToken_plus_min", __HIVE_P2_set(__HIVE_P2_temp0_1489, __HIVE_P2_temp0_1490, (__HIVE_P2_reserveFunction(6440), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp6440_0, __HIVE_P2_temp6440_1, __HIVE_P2_temp6440_2, __HIVE_P2_temp6440_3, __HIVE_P2_temp6440_4, __HIVE_P2_temp6440_5, __HIVE_P2_temp6440_6, __HIVE_P2_temp6440_7, __HIVE_P2_temp6440_8, __HIVE_P2_temp6440_9, __HIVE_P2_temp6440_10, __HIVE_P2_temp6440_11, __HIVE_P2_temp6440_12, __HIVE_P2_temp6440_13, __HIVE_P2_temp6440_14, __HIVE_P2_temp6440_15, __HIVE_P2_temp6440_16, __HIVE_P2_temp6440_17, __HIVE_P2_temp6440_18, __HIVE_P2_temp6440_19;
        var t = (__HIVE_P2_temp6440_0 = __HIVE_P2_get(this, "input", 6445), __HIVE_P2_temp6440_1 = __HIVE_P2_get(__HIVE_P2_temp6440_0, "charCodeAt", 6441), __HIVE_P2_invoke(__HIVE_P2_temp6440_1, __HIVE_P2_temp6440_0, (__HIVE_P2_reserveArray(1, 6441), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6443), 1, 6442)], 6441, "CONTROL_ARRAY")), 6441));
        if (t === e) {
            if (t === 45 && !__HIVE_P2_get(this, "inModule", 6446) && (__HIVE_P2_temp6440_2 = __HIVE_P2_get(this, "input", 6451), __HIVE_P2_temp6440_3 = __HIVE_P2_get(__HIVE_P2_temp6440_2, "charCodeAt", 6447), __HIVE_P2_invoke(__HIVE_P2_temp6440_3, __HIVE_P2_temp6440_2, (__HIVE_P2_reserveArray(1, 6447), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6449), 2, 6448)], 6447, "CONTROL_ARRAY")), 6447)) === 62 && (__HIVE_P2_get(this, "lastTokEnd", 6452) === 0 || (__HIVE_P2_temp6440_6 = g, __HIVE_P2_temp6440_7 = __HIVE_P2_get(__HIVE_P2_temp6440_6, "test", 6453), __HIVE_P2_invoke(__HIVE_P2_temp6440_7, __HIVE_P2_temp6440_6, (__HIVE_P2_reserveArray(1, 6453), __HIVE_P2_ownArray([(__HIVE_P2_temp6440_4 = __HIVE_P2_get(this, "input", 6458), __HIVE_P2_temp6440_5 = __HIVE_P2_get(__HIVE_P2_temp6440_4, "slice", 6454), __HIVE_P2_invoke(__HIVE_P2_temp6440_5, __HIVE_P2_temp6440_4, (__HIVE_P2_reserveArray(2, 6454), __HIVE_P2_ownArray([__HIVE_P2_get(this, "lastTokEnd", 6455), __HIVE_P2_get(this, "pos", 6456)], 6454, "CONTROL_ARRAY")), 6454))], 6453, "CONTROL_ARRAY")), 6453)))) {
                (__HIVE_P2_temp6440_8 = this, __HIVE_P2_temp6440_9 = __HIVE_P2_get(__HIVE_P2_temp6440_8, "skipLineComment", 6460), __HIVE_P2_invoke(__HIVE_P2_temp6440_9, __HIVE_P2_temp6440_8, (__HIVE_P2_reserveArray(1, 6460), __HIVE_P2_ownArray([3], 6460, "CONTROL_ARRAY")), 6460));
                (__HIVE_P2_temp6440_10 = this, __HIVE_P2_temp6440_11 = __HIVE_P2_get(__HIVE_P2_temp6440_10, "skipSpace", 6462), __HIVE_P2_invoke(__HIVE_P2_temp6440_11, __HIVE_P2_temp6440_10, (__HIVE_P2_reserveArray(0, 6462), __HIVE_P2_ownArray([], 6462, "CONTROL_ARRAY")), 6462));
                return (__HIVE_P2_temp6440_12 = this, __HIVE_P2_temp6440_13 = __HIVE_P2_get(__HIVE_P2_temp6440_12, "nextToken", 6464), __HIVE_P2_invoke(__HIVE_P2_temp6440_13, __HIVE_P2_temp6440_12, (__HIVE_P2_reserveArray(0, 6464), __HIVE_P2_ownArray([], 6464, "CONTROL_ARRAY")), 6464));
            }
            return (__HIVE_P2_temp6440_14 = this, __HIVE_P2_temp6440_15 = __HIVE_P2_get(__HIVE_P2_temp6440_14, "finishOp", 6466), __HIVE_P2_invoke(__HIVE_P2_temp6440_15, __HIVE_P2_temp6440_14, (__HIVE_P2_reserveArray(2, 6466), __HIVE_P2_ownArray([__HIVE_P2_get(m, "incDec", 6467), 2], 6466, "CONTROL_ARRAY")), 6466));
        }
        if (t === 61) {
            return (__HIVE_P2_temp6440_16 = this, __HIVE_P2_temp6440_17 = __HIVE_P2_get(__HIVE_P2_temp6440_16, "finishOp", 6469), __HIVE_P2_invoke(__HIVE_P2_temp6440_17, __HIVE_P2_temp6440_16, (__HIVE_P2_reserveArray(2, 6469), __HIVE_P2_ownArray([__HIVE_P2_get(m, "assign", 6470), 2], 6469, "CONTROL_ARRAY")), 6469));
        }
        return (__HIVE_P2_temp6440_18 = this, __HIVE_P2_temp6440_19 = __HIVE_P2_get(__HIVE_P2_temp6440_18, "finishOp", 6472), __HIVE_P2_invoke(__HIVE_P2_temp6440_19, __HIVE_P2_temp6440_18, (__HIVE_P2_reserveArray(2, 6472), __HIVE_P2_ownArray([__HIVE_P2_get(m, "plusMin", 6473), 1], 6472, "CONTROL_ARRAY")), 6472));
    }, 21, 1, 0, 6440)), 6438));
    (__HIVE_P2_temp0_1492 = We, __HIVE_P2_temp0_1493 = "readToken_lt_gt", __HIVE_P2_set(__HIVE_P2_temp0_1492, __HIVE_P2_temp0_1493, (__HIVE_P2_reserveFunction(6477), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp6477_0, __HIVE_P2_temp6477_1, __HIVE_P2_temp6477_2, __HIVE_P2_temp6477_3, __HIVE_P2_temp6477_4, __HIVE_P2_temp6477_5, __HIVE_P2_temp6477_6, __HIVE_P2_temp6477_7, __HIVE_P2_temp6477_8, __HIVE_P2_temp6477_9, __HIVE_P2_temp6477_10, __HIVE_P2_temp6477_11, __HIVE_P2_temp6477_12, __HIVE_P2_temp6477_13, __HIVE_P2_temp6477_14, __HIVE_P2_temp6477_15, __HIVE_P2_temp6477_16, __HIVE_P2_temp6477_17, __HIVE_P2_temp6477_18, __HIVE_P2_temp6477_19, __HIVE_P2_temp6477_20, __HIVE_P2_temp6477_21;
        var t = (__HIVE_P2_temp6477_0 = __HIVE_P2_get(this, "input", 6482), __HIVE_P2_temp6477_1 = __HIVE_P2_get(__HIVE_P2_temp6477_0, "charCodeAt", 6478), __HIVE_P2_invoke(__HIVE_P2_temp6477_1, __HIVE_P2_temp6477_0, (__HIVE_P2_reserveArray(1, 6478), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6480), 1, 6479)], 6478, "CONTROL_ARRAY")), 6478));
        var i = 1;
        if (t === e) {
            i = e === 62 && (__HIVE_P2_temp6477_2 = __HIVE_P2_get(this, "input", 6488), __HIVE_P2_temp6477_3 = __HIVE_P2_get(__HIVE_P2_temp6477_2, "charCodeAt", 6484), __HIVE_P2_invoke(__HIVE_P2_temp6477_3, __HIVE_P2_temp6477_2, (__HIVE_P2_reserveArray(1, 6484), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6486), 2, 6485)], 6484, "CONTROL_ARRAY")), 6484)) === 62 ? 3 : 2;
            if ((__HIVE_P2_temp6477_4 = __HIVE_P2_get(this, "input", 6493), __HIVE_P2_temp6477_5 = __HIVE_P2_get(__HIVE_P2_temp6477_4, "charCodeAt", 6489), __HIVE_P2_invoke(__HIVE_P2_temp6477_5, __HIVE_P2_temp6477_4, (__HIVE_P2_reserveArray(1, 6489), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6491), i, 6490)], 6489, "CONTROL_ARRAY")), 6489)) === 61) {
                return (__HIVE_P2_temp6477_6 = this, __HIVE_P2_temp6477_7 = __HIVE_P2_get(__HIVE_P2_temp6477_6, "finishOp", 6494), __HIVE_P2_invoke(__HIVE_P2_temp6477_7, __HIVE_P2_temp6477_6, (__HIVE_P2_reserveArray(2, 6494), __HIVE_P2_ownArray([__HIVE_P2_get(m, "assign", 6495), __HIVE_P2_binary("+", i, 1, 6496)], 6494, "CONTROL_ARRAY")), 6494));
            }
            return (__HIVE_P2_temp6477_8 = this, __HIVE_P2_temp6477_9 = __HIVE_P2_get(__HIVE_P2_temp6477_8, "finishOp", 6498), __HIVE_P2_invoke(__HIVE_P2_temp6477_9, __HIVE_P2_temp6477_8, (__HIVE_P2_reserveArray(2, 6498), __HIVE_P2_ownArray([__HIVE_P2_get(m, "bitShift", 6499), i], 6498, "CONTROL_ARRAY")), 6498));
        }
        if (t === 33 && e === 60 && !__HIVE_P2_get(this, "inModule", 6501) && (__HIVE_P2_temp6477_10 = __HIVE_P2_get(this, "input", 6506), __HIVE_P2_temp6477_11 = __HIVE_P2_get(__HIVE_P2_temp6477_10, "charCodeAt", 6502), __HIVE_P2_invoke(__HIVE_P2_temp6477_11, __HIVE_P2_temp6477_10, (__HIVE_P2_reserveArray(1, 6502), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6504), 2, 6503)], 6502, "CONTROL_ARRAY")), 6502)) === 45 && (__HIVE_P2_temp6477_12 = __HIVE_P2_get(this, "input", 6511), __HIVE_P2_temp6477_13 = __HIVE_P2_get(__HIVE_P2_temp6477_12, "charCodeAt", 6507), __HIVE_P2_invoke(__HIVE_P2_temp6477_13, __HIVE_P2_temp6477_12, (__HIVE_P2_reserveArray(1, 6507), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6509), 3, 6508)], 6507, "CONTROL_ARRAY")), 6507)) === 45) {
            (__HIVE_P2_temp6477_14 = this, __HIVE_P2_temp6477_15 = __HIVE_P2_get(__HIVE_P2_temp6477_14, "skipLineComment", 6512), __HIVE_P2_invoke(__HIVE_P2_temp6477_15, __HIVE_P2_temp6477_14, (__HIVE_P2_reserveArray(1, 6512), __HIVE_P2_ownArray([4], 6512, "CONTROL_ARRAY")), 6512));
            (__HIVE_P2_temp6477_16 = this, __HIVE_P2_temp6477_17 = __HIVE_P2_get(__HIVE_P2_temp6477_16, "skipSpace", 6514), __HIVE_P2_invoke(__HIVE_P2_temp6477_17, __HIVE_P2_temp6477_16, (__HIVE_P2_reserveArray(0, 6514), __HIVE_P2_ownArray([], 6514, "CONTROL_ARRAY")), 6514));
            return (__HIVE_P2_temp6477_18 = this, __HIVE_P2_temp6477_19 = __HIVE_P2_get(__HIVE_P2_temp6477_18, "nextToken", 6516), __HIVE_P2_invoke(__HIVE_P2_temp6477_19, __HIVE_P2_temp6477_18, (__HIVE_P2_reserveArray(0, 6516), __HIVE_P2_ownArray([], 6516, "CONTROL_ARRAY")), 6516));
        }
        if (t === 61) {
            i = 2;
        }
        return (__HIVE_P2_temp6477_20 = this, __HIVE_P2_temp6477_21 = __HIVE_P2_get(__HIVE_P2_temp6477_20, "finishOp", 6519), __HIVE_P2_invoke(__HIVE_P2_temp6477_21, __HIVE_P2_temp6477_20, (__HIVE_P2_reserveArray(2, 6519), __HIVE_P2_ownArray([__HIVE_P2_get(m, "relational", 6520), i], 6519, "CONTROL_ARRAY")), 6519));
    }, 24, 1, 0, 6477)), 6475));
    (__HIVE_P2_temp0_1495 = We, __HIVE_P2_temp0_1496 = "readToken_eq_excl", __HIVE_P2_set(__HIVE_P2_temp0_1495, __HIVE_P2_temp0_1496, (__HIVE_P2_reserveFunction(6524), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp6524_0, __HIVE_P2_temp6524_1, __HIVE_P2_temp6524_2, __HIVE_P2_temp6524_3, __HIVE_P2_temp6524_4, __HIVE_P2_temp6524_5, __HIVE_P2_temp6524_6, __HIVE_P2_temp6524_7, __HIVE_P2_temp6524_8, __HIVE_P2_temp6524_9, __HIVE_P2_temp6524_10, __HIVE_P2_temp6524_11, __HIVE_P2_temp6524_12;
        var t = (__HIVE_P2_temp6524_0 = __HIVE_P2_get(this, "input", 6529), __HIVE_P2_temp6524_1 = __HIVE_P2_get(__HIVE_P2_temp6524_0, "charCodeAt", 6525), __HIVE_P2_invoke(__HIVE_P2_temp6524_1, __HIVE_P2_temp6524_0, (__HIVE_P2_reserveArray(1, 6525), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6527), 1, 6526)], 6525, "CONTROL_ARRAY")), 6525));
        if (t === 61) {
            return (__HIVE_P2_temp6524_4 = this, __HIVE_P2_temp6524_5 = __HIVE_P2_get(__HIVE_P2_temp6524_4, "finishOp", 6530), __HIVE_P2_invoke(__HIVE_P2_temp6524_5, __HIVE_P2_temp6524_4, (__HIVE_P2_reserveArray(2, 6530), __HIVE_P2_ownArray([__HIVE_P2_get(m, "equality", 6531), (__HIVE_P2_temp6524_2 = __HIVE_P2_get(this, "input", 6536), __HIVE_P2_temp6524_3 = __HIVE_P2_get(__HIVE_P2_temp6524_2, "charCodeAt", 6532), __HIVE_P2_invoke(__HIVE_P2_temp6524_3, __HIVE_P2_temp6524_2, (__HIVE_P2_reserveArray(1, 6532), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6534), 2, 6533)], 6532, "CONTROL_ARRAY")), 6532)) === 61 ? 3 : 2], 6530, "CONTROL_ARRAY")), 6530));
        }
        if (e === 61 && t === 62 && __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 6540), "ecmaVersion", 6539), 6, 6538)) {
            (__HIVE_P2_temp6524_6 = this, __HIVE_P2_temp6524_7 = "pos", __HIVE_P2_temp6524_8 = __HIVE_P2_get(__HIVE_P2_temp6524_6, __HIVE_P2_temp6524_7, 6541), __HIVE_P2_set(__HIVE_P2_temp6524_6, __HIVE_P2_temp6524_7, __HIVE_P2_binary("+", __HIVE_P2_temp6524_8, 2, 6541), 6541));
            return (__HIVE_P2_temp6524_9 = this, __HIVE_P2_temp6524_10 = __HIVE_P2_get(__HIVE_P2_temp6524_9, "finishToken", 6543), __HIVE_P2_invoke(__HIVE_P2_temp6524_10, __HIVE_P2_temp6524_9, (__HIVE_P2_reserveArray(1, 6543), __HIVE_P2_ownArray([__HIVE_P2_get(m, "arrow", 6544)], 6543, "CONTROL_ARRAY")), 6543));
        }
        return (__HIVE_P2_temp6524_11 = this, __HIVE_P2_temp6524_12 = __HIVE_P2_get(__HIVE_P2_temp6524_11, "finishOp", 6546), __HIVE_P2_invoke(__HIVE_P2_temp6524_12, __HIVE_P2_temp6524_11, (__HIVE_P2_reserveArray(2, 6546), __HIVE_P2_ownArray([e === 61 ? __HIVE_P2_get(m, "eq", 6547) : __HIVE_P2_get(m, "prefix", 6548), 1], 6546, "CONTROL_ARRAY")), 6546));
    }, 14, 1, 0, 6524)), 6522));
    (__HIVE_P2_temp0_1498 = We, __HIVE_P2_temp0_1499 = "readToken_question", __HIVE_P2_set(__HIVE_P2_temp0_1498, __HIVE_P2_temp0_1499, (__HIVE_P2_reserveFunction(6552), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp6552_0, __HIVE_P2_temp6552_1, __HIVE_P2_temp6552_2, __HIVE_P2_temp6552_3, __HIVE_P2_temp6552_4, __HIVE_P2_temp6552_5, __HIVE_P2_temp6552_6, __HIVE_P2_temp6552_7, __HIVE_P2_temp6552_8, __HIVE_P2_temp6552_9, __HIVE_P2_temp6552_10, __HIVE_P2_temp6552_11, __HIVE_P2_temp6552_12, __HIVE_P2_temp6552_13;
        var e = __HIVE_P2_get(__HIVE_P2_get(this, "options", 6554), "ecmaVersion", 6553);
        if (__HIVE_P2_binary(">=", e, 11, 6555)) {
            var t = (__HIVE_P2_temp6552_0 = __HIVE_P2_get(this, "input", 6560), __HIVE_P2_temp6552_1 = __HIVE_P2_get(__HIVE_P2_temp6552_0, "charCodeAt", 6556), __HIVE_P2_invoke(__HIVE_P2_temp6552_1, __HIVE_P2_temp6552_0, (__HIVE_P2_reserveArray(1, 6556), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6558), 1, 6557)], 6556, "CONTROL_ARRAY")), 6556));
            if (t === 46) {
                var i = (__HIVE_P2_temp6552_2 = __HIVE_P2_get(this, "input", 6565), __HIVE_P2_temp6552_3 = __HIVE_P2_get(__HIVE_P2_temp6552_2, "charCodeAt", 6561), __HIVE_P2_invoke(__HIVE_P2_temp6552_3, __HIVE_P2_temp6552_2, (__HIVE_P2_reserveArray(1, 6561), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6563), 2, 6562)], 6561, "CONTROL_ARRAY")), 6561));
                if (__HIVE_P2_binary("<", i, 48, 6566) || __HIVE_P2_binary(">", i, 57, 6567)) {
                    return (__HIVE_P2_temp6552_4 = this, __HIVE_P2_temp6552_5 = __HIVE_P2_get(__HIVE_P2_temp6552_4, "finishOp", 6568), __HIVE_P2_invoke(__HIVE_P2_temp6552_5, __HIVE_P2_temp6552_4, (__HIVE_P2_reserveArray(2, 6568), __HIVE_P2_ownArray([__HIVE_P2_get(m, "questionDot", 6569), 2], 6568, "CONTROL_ARRAY")), 6568));
                }
            }
            if (t === 63) {
                if (__HIVE_P2_binary(">=", e, 12, 6571)) {
                    var s = (__HIVE_P2_temp6552_6 = __HIVE_P2_get(this, "input", 6576), __HIVE_P2_temp6552_7 = __HIVE_P2_get(__HIVE_P2_temp6552_6, "charCodeAt", 6572), __HIVE_P2_invoke(__HIVE_P2_temp6552_7, __HIVE_P2_temp6552_6, (__HIVE_P2_reserveArray(1, 6572), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6574), 2, 6573)], 6572, "CONTROL_ARRAY")), 6572));
                    if (s === 61) {
                        return (__HIVE_P2_temp6552_8 = this, __HIVE_P2_temp6552_9 = __HIVE_P2_get(__HIVE_P2_temp6552_8, "finishOp", 6577), __HIVE_P2_invoke(__HIVE_P2_temp6552_9, __HIVE_P2_temp6552_8, (__HIVE_P2_reserveArray(2, 6577), __HIVE_P2_ownArray([__HIVE_P2_get(m, "assign", 6578), 3], 6577, "CONTROL_ARRAY")), 6577));
                    }
                }
                return (__HIVE_P2_temp6552_10 = this, __HIVE_P2_temp6552_11 = __HIVE_P2_get(__HIVE_P2_temp6552_10, "finishOp", 6580), __HIVE_P2_invoke(__HIVE_P2_temp6552_11, __HIVE_P2_temp6552_10, (__HIVE_P2_reserveArray(2, 6580), __HIVE_P2_ownArray([__HIVE_P2_get(m, "coalesce", 6581), 2], 6580, "CONTROL_ARRAY")), 6580));
            }
        }
        return (__HIVE_P2_temp6552_12 = this, __HIVE_P2_temp6552_13 = __HIVE_P2_get(__HIVE_P2_temp6552_12, "finishOp", 6583), __HIVE_P2_invoke(__HIVE_P2_temp6552_13, __HIVE_P2_temp6552_12, (__HIVE_P2_reserveArray(2, 6583), __HIVE_P2_ownArray([__HIVE_P2_get(m, "question", 6584), 1], 6583, "CONTROL_ARRAY")), 6583));
    }, 18, 0, 0, 6552)), 6550));
    (__HIVE_P2_temp0_1501 = We, __HIVE_P2_temp0_1502 = "readToken_numberSign", __HIVE_P2_set(__HIVE_P2_temp0_1501, __HIVE_P2_temp0_1502, (__HIVE_P2_reserveFunction(6588), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp6588_0, __HIVE_P2_temp6588_1, __HIVE_P2_temp6588_2, __HIVE_P2_temp6588_3, __HIVE_P2_temp6588_4, __HIVE_P2_temp6588_5;
        var e = __HIVE_P2_get(__HIVE_P2_get(this, "options", 6590), "ecmaVersion", 6589);
        var t = 35;
        if (__HIVE_P2_binary(">=", e, 13, 6591)) {
            __HIVE_P2_increment(this, "pos", 1, false, 6592);
            t = (__HIVE_P2_temp6588_0 = this, __HIVE_P2_temp6588_1 = __HIVE_P2_get(__HIVE_P2_temp6588_0, "fullCharCodeAtPos", 6595), __HIVE_P2_invoke(__HIVE_P2_temp6588_1, __HIVE_P2_temp6588_0, (__HIVE_P2_reserveArray(0, 6595), __HIVE_P2_ownArray([], 6595, "CONTROL_ARRAY")), 6595));
            if (__HIVE_P2_invoke(isIdentifierStart, void 0, (__HIVE_P2_reserveArray(2, 6597), __HIVE_P2_ownArray([t, true], 6597, "CONTROL_ARRAY")), 6597) || t === 92) {
                return (__HIVE_P2_temp6588_4 = this, __HIVE_P2_temp6588_5 = __HIVE_P2_get(__HIVE_P2_temp6588_4, "finishToken", 6598), __HIVE_P2_invoke(__HIVE_P2_temp6588_5, __HIVE_P2_temp6588_4, (__HIVE_P2_reserveArray(2, 6598), __HIVE_P2_ownArray([__HIVE_P2_get(m, "privateId", 6599), (__HIVE_P2_temp6588_2 = this, __HIVE_P2_temp6588_3 = __HIVE_P2_get(__HIVE_P2_temp6588_2, "readWord1", 6600), __HIVE_P2_invoke(__HIVE_P2_temp6588_3, __HIVE_P2_temp6588_2, (__HIVE_P2_reserveArray(0, 6600), __HIVE_P2_ownArray([], 6600, "CONTROL_ARRAY")), 6600))], 6598, "CONTROL_ARRAY")), 6598));
            }
        }
        __HIVE_P2_syntaxRefusal(6603);
    }, 8, 0, 0, 6588)), 6586));
    (__HIVE_P2_temp0_1504 = We, __HIVE_P2_temp0_1505 = "getTokenFromCode", __HIVE_P2_set(__HIVE_P2_temp0_1504, __HIVE_P2_temp0_1505, (__HIVE_P2_reserveFunction(6606), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp6606_0, __HIVE_P2_temp6606_1, __HIVE_P2_temp6606_2, __HIVE_P2_temp6606_3, __HIVE_P2_temp6606_4, __HIVE_P2_temp6606_5, __HIVE_P2_temp6606_6, __HIVE_P2_temp6606_7, __HIVE_P2_temp6606_8, __HIVE_P2_temp6606_9, __HIVE_P2_temp6606_10, __HIVE_P2_temp6606_11, __HIVE_P2_temp6606_12, __HIVE_P2_temp6606_13, __HIVE_P2_temp6606_14, __HIVE_P2_temp6606_15, __HIVE_P2_temp6606_16, __HIVE_P2_temp6606_17, __HIVE_P2_temp6606_18, __HIVE_P2_temp6606_19, __HIVE_P2_temp6606_20, __HIVE_P2_temp6606_21, __HIVE_P2_temp6606_22, __HIVE_P2_temp6606_23, __HIVE_P2_temp6606_24, __HIVE_P2_temp6606_25, __HIVE_P2_temp6606_26, __HIVE_P2_temp6606_27, __HIVE_P2_temp6606_28, __HIVE_P2_temp6606_29, __HIVE_P2_temp6606_30, __HIVE_P2_temp6606_31, __HIVE_P2_temp6606_32, __HIVE_P2_temp6606_33, __HIVE_P2_temp6606_34, __HIVE_P2_temp6606_35, __HIVE_P2_temp6606_36, __HIVE_P2_temp6606_37, __HIVE_P2_temp6606_38, __HIVE_P2_temp6606_39, __HIVE_P2_temp6606_40, __HIVE_P2_temp6606_41, __HIVE_P2_temp6606_42, __HIVE_P2_temp6606_43, __HIVE_P2_temp6606_44, __HIVE_P2_temp6606_45, __HIVE_P2_temp6606_46, __HIVE_P2_temp6606_47, __HIVE_P2_temp6606_48, __HIVE_P2_temp6606_49, __HIVE_P2_temp6606_50, __HIVE_P2_temp6606_51, __HIVE_P2_temp6606_52, __HIVE_P2_temp6606_53;
        switch (e) {
            case 46: return (__HIVE_P2_temp6606_0 = this, __HIVE_P2_temp6606_1 = __HIVE_P2_get(__HIVE_P2_temp6606_0, "readToken_dot", 6607), __HIVE_P2_invoke(__HIVE_P2_temp6606_1, __HIVE_P2_temp6606_0, (__HIVE_P2_reserveArray(0, 6607), __HIVE_P2_ownArray([], 6607, "CONTROL_ARRAY")), 6607));
            case 40:
                __HIVE_P2_increment(this, "pos", 1, false, 6609);
                return (__HIVE_P2_temp6606_2 = this, __HIVE_P2_temp6606_3 = __HIVE_P2_get(__HIVE_P2_temp6606_2, "finishToken", 6611), __HIVE_P2_invoke(__HIVE_P2_temp6606_3, __HIVE_P2_temp6606_2, (__HIVE_P2_reserveArray(1, 6611), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenL", 6612)], 6611, "CONTROL_ARRAY")), 6611));
            case 41:
                __HIVE_P2_increment(this, "pos", 1, false, 6614);
                return (__HIVE_P2_temp6606_4 = this, __HIVE_P2_temp6606_5 = __HIVE_P2_get(__HIVE_P2_temp6606_4, "finishToken", 6616), __HIVE_P2_invoke(__HIVE_P2_temp6606_5, __HIVE_P2_temp6606_4, (__HIVE_P2_reserveArray(1, 6616), __HIVE_P2_ownArray([__HIVE_P2_get(m, "parenR", 6617)], 6616, "CONTROL_ARRAY")), 6616));
            case 59:
                __HIVE_P2_increment(this, "pos", 1, false, 6619);
                return (__HIVE_P2_temp6606_6 = this, __HIVE_P2_temp6606_7 = __HIVE_P2_get(__HIVE_P2_temp6606_6, "finishToken", 6621), __HIVE_P2_invoke(__HIVE_P2_temp6606_7, __HIVE_P2_temp6606_6, (__HIVE_P2_reserveArray(1, 6621), __HIVE_P2_ownArray([__HIVE_P2_get(m, "semi", 6622)], 6621, "CONTROL_ARRAY")), 6621));
            case 44:
                __HIVE_P2_increment(this, "pos", 1, false, 6624);
                return (__HIVE_P2_temp6606_8 = this, __HIVE_P2_temp6606_9 = __HIVE_P2_get(__HIVE_P2_temp6606_8, "finishToken", 6626), __HIVE_P2_invoke(__HIVE_P2_temp6606_9, __HIVE_P2_temp6606_8, (__HIVE_P2_reserveArray(1, 6626), __HIVE_P2_ownArray([__HIVE_P2_get(m, "comma", 6627)], 6626, "CONTROL_ARRAY")), 6626));
            case 91:
                __HIVE_P2_increment(this, "pos", 1, false, 6629);
                return (__HIVE_P2_temp6606_10 = this, __HIVE_P2_temp6606_11 = __HIVE_P2_get(__HIVE_P2_temp6606_10, "finishToken", 6631), __HIVE_P2_invoke(__HIVE_P2_temp6606_11, __HIVE_P2_temp6606_10, (__HIVE_P2_reserveArray(1, 6631), __HIVE_P2_ownArray([__HIVE_P2_get(m, "bracketL", 6632)], 6631, "CONTROL_ARRAY")), 6631));
            case 93:
                __HIVE_P2_increment(this, "pos", 1, false, 6634);
                return (__HIVE_P2_temp6606_12 = this, __HIVE_P2_temp6606_13 = __HIVE_P2_get(__HIVE_P2_temp6606_12, "finishToken", 6636), __HIVE_P2_invoke(__HIVE_P2_temp6606_13, __HIVE_P2_temp6606_12, (__HIVE_P2_reserveArray(1, 6636), __HIVE_P2_ownArray([__HIVE_P2_get(m, "bracketR", 6637)], 6636, "CONTROL_ARRAY")), 6636));
            case 123:
                __HIVE_P2_increment(this, "pos", 1, false, 6639);
                return (__HIVE_P2_temp6606_14 = this, __HIVE_P2_temp6606_15 = __HIVE_P2_get(__HIVE_P2_temp6606_14, "finishToken", 6641), __HIVE_P2_invoke(__HIVE_P2_temp6606_15, __HIVE_P2_temp6606_14, (__HIVE_P2_reserveArray(1, 6641), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceL", 6642)], 6641, "CONTROL_ARRAY")), 6641));
            case 125:
                __HIVE_P2_increment(this, "pos", 1, false, 6644);
                return (__HIVE_P2_temp6606_16 = this, __HIVE_P2_temp6606_17 = __HIVE_P2_get(__HIVE_P2_temp6606_16, "finishToken", 6646), __HIVE_P2_invoke(__HIVE_P2_temp6606_17, __HIVE_P2_temp6606_16, (__HIVE_P2_reserveArray(1, 6646), __HIVE_P2_ownArray([__HIVE_P2_get(m, "braceR", 6647)], 6646, "CONTROL_ARRAY")), 6646));
            case 58:
                __HIVE_P2_increment(this, "pos", 1, false, 6649);
                return (__HIVE_P2_temp6606_18 = this, __HIVE_P2_temp6606_19 = __HIVE_P2_get(__HIVE_P2_temp6606_18, "finishToken", 6651), __HIVE_P2_invoke(__HIVE_P2_temp6606_19, __HIVE_P2_temp6606_18, (__HIVE_P2_reserveArray(1, 6651), __HIVE_P2_ownArray([__HIVE_P2_get(m, "colon", 6652)], 6651, "CONTROL_ARRAY")), 6651));
            case 96:
                if (__HIVE_P2_binary("<", __HIVE_P2_get(__HIVE_P2_get(this, "options", 6656), "ecmaVersion", 6655), 6, 6654)) {
                    break;
                }
                __HIVE_P2_increment(this, "pos", 1, false, 6657);
                return (__HIVE_P2_temp6606_20 = this, __HIVE_P2_temp6606_21 = __HIVE_P2_get(__HIVE_P2_temp6606_20, "finishToken", 6659), __HIVE_P2_invoke(__HIVE_P2_temp6606_21, __HIVE_P2_temp6606_20, (__HIVE_P2_reserveArray(1, 6659), __HIVE_P2_ownArray([__HIVE_P2_get(m, "backQuote", 6660)], 6659, "CONTROL_ARRAY")), 6659));
            case 48:
                var t = (__HIVE_P2_temp6606_22 = __HIVE_P2_get(this, "input", 6666), __HIVE_P2_temp6606_23 = __HIVE_P2_get(__HIVE_P2_temp6606_22, "charCodeAt", 6662), __HIVE_P2_invoke(__HIVE_P2_temp6606_23, __HIVE_P2_temp6606_22, (__HIVE_P2_reserveArray(1, 6662), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6664), 1, 6663)], 6662, "CONTROL_ARRAY")), 6662));
                if (t === 120 || t === 88) {
                    return (__HIVE_P2_temp6606_24 = this, __HIVE_P2_temp6606_25 = __HIVE_P2_get(__HIVE_P2_temp6606_24, "readRadixNumber", 6667), __HIVE_P2_invoke(__HIVE_P2_temp6606_25, __HIVE_P2_temp6606_24, (__HIVE_P2_reserveArray(1, 6667), __HIVE_P2_ownArray([16], 6667, "CONTROL_ARRAY")), 6667));
                }
                if (__HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 6671), "ecmaVersion", 6670), 6, 6669)) {
                    if (t === 111 || t === 79) {
                        return (__HIVE_P2_temp6606_26 = this, __HIVE_P2_temp6606_27 = __HIVE_P2_get(__HIVE_P2_temp6606_26, "readRadixNumber", 6672), __HIVE_P2_invoke(__HIVE_P2_temp6606_27, __HIVE_P2_temp6606_26, (__HIVE_P2_reserveArray(1, 6672), __HIVE_P2_ownArray([8], 6672, "CONTROL_ARRAY")), 6672));
                    }
                    if (t === 98 || t === 66) {
                        return (__HIVE_P2_temp6606_28 = this, __HIVE_P2_temp6606_29 = __HIVE_P2_get(__HIVE_P2_temp6606_28, "readRadixNumber", 6674), __HIVE_P2_invoke(__HIVE_P2_temp6606_29, __HIVE_P2_temp6606_28, (__HIVE_P2_reserveArray(1, 6674), __HIVE_P2_ownArray([2], 6674, "CONTROL_ARRAY")), 6674));
                    }
                }
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57: return (__HIVE_P2_temp6606_30 = this, __HIVE_P2_temp6606_31 = __HIVE_P2_get(__HIVE_P2_temp6606_30, "readNumber", 6676), __HIVE_P2_invoke(__HIVE_P2_temp6606_31, __HIVE_P2_temp6606_30, (__HIVE_P2_reserveArray(1, 6676), __HIVE_P2_ownArray([false], 6676, "CONTROL_ARRAY")), 6676));
            case 34:
            case 39: return (__HIVE_P2_temp6606_32 = this, __HIVE_P2_temp6606_33 = __HIVE_P2_get(__HIVE_P2_temp6606_32, "readString", 6678), __HIVE_P2_invoke(__HIVE_P2_temp6606_33, __HIVE_P2_temp6606_32, (__HIVE_P2_reserveArray(1, 6678), __HIVE_P2_ownArray([e], 6678, "CONTROL_ARRAY")), 6678));
            case 47: return (__HIVE_P2_temp6606_34 = this, __HIVE_P2_temp6606_35 = __HIVE_P2_get(__HIVE_P2_temp6606_34, "readToken_slash", 6680), __HIVE_P2_invoke(__HIVE_P2_temp6606_35, __HIVE_P2_temp6606_34, (__HIVE_P2_reserveArray(0, 6680), __HIVE_P2_ownArray([], 6680, "CONTROL_ARRAY")), 6680));
            case 37:
            case 42: return (__HIVE_P2_temp6606_36 = this, __HIVE_P2_temp6606_37 = __HIVE_P2_get(__HIVE_P2_temp6606_36, "readToken_mult_modulo_exp", 6682), __HIVE_P2_invoke(__HIVE_P2_temp6606_37, __HIVE_P2_temp6606_36, (__HIVE_P2_reserveArray(1, 6682), __HIVE_P2_ownArray([e], 6682, "CONTROL_ARRAY")), 6682));
            case 124:
            case 38: return (__HIVE_P2_temp6606_38 = this, __HIVE_P2_temp6606_39 = __HIVE_P2_get(__HIVE_P2_temp6606_38, "readToken_pipe_amp", 6684), __HIVE_P2_invoke(__HIVE_P2_temp6606_39, __HIVE_P2_temp6606_38, (__HIVE_P2_reserveArray(1, 6684), __HIVE_P2_ownArray([e], 6684, "CONTROL_ARRAY")), 6684));
            case 94: return (__HIVE_P2_temp6606_40 = this, __HIVE_P2_temp6606_41 = __HIVE_P2_get(__HIVE_P2_temp6606_40, "readToken_caret", 6686), __HIVE_P2_invoke(__HIVE_P2_temp6606_41, __HIVE_P2_temp6606_40, (__HIVE_P2_reserveArray(0, 6686), __HIVE_P2_ownArray([], 6686, "CONTROL_ARRAY")), 6686));
            case 43:
            case 45: return (__HIVE_P2_temp6606_42 = this, __HIVE_P2_temp6606_43 = __HIVE_P2_get(__HIVE_P2_temp6606_42, "readToken_plus_min", 6688), __HIVE_P2_invoke(__HIVE_P2_temp6606_43, __HIVE_P2_temp6606_42, (__HIVE_P2_reserveArray(1, 6688), __HIVE_P2_ownArray([e], 6688, "CONTROL_ARRAY")), 6688));
            case 60:
            case 62: return (__HIVE_P2_temp6606_44 = this, __HIVE_P2_temp6606_45 = __HIVE_P2_get(__HIVE_P2_temp6606_44, "readToken_lt_gt", 6690), __HIVE_P2_invoke(__HIVE_P2_temp6606_45, __HIVE_P2_temp6606_44, (__HIVE_P2_reserveArray(1, 6690), __HIVE_P2_ownArray([e], 6690, "CONTROL_ARRAY")), 6690));
            case 61:
            case 33: return (__HIVE_P2_temp6606_46 = this, __HIVE_P2_temp6606_47 = __HIVE_P2_get(__HIVE_P2_temp6606_46, "readToken_eq_excl", 6692), __HIVE_P2_invoke(__HIVE_P2_temp6606_47, __HIVE_P2_temp6606_46, (__HIVE_P2_reserveArray(1, 6692), __HIVE_P2_ownArray([e], 6692, "CONTROL_ARRAY")), 6692));
            case 63: return (__HIVE_P2_temp6606_48 = this, __HIVE_P2_temp6606_49 = __HIVE_P2_get(__HIVE_P2_temp6606_48, "readToken_question", 6694), __HIVE_P2_invoke(__HIVE_P2_temp6606_49, __HIVE_P2_temp6606_48, (__HIVE_P2_reserveArray(0, 6694), __HIVE_P2_ownArray([], 6694, "CONTROL_ARRAY")), 6694));
            case 126: return (__HIVE_P2_temp6606_50 = this, __HIVE_P2_temp6606_51 = __HIVE_P2_get(__HIVE_P2_temp6606_50, "finishOp", 6696), __HIVE_P2_invoke(__HIVE_P2_temp6606_51, __HIVE_P2_temp6606_50, (__HIVE_P2_reserveArray(2, 6696), __HIVE_P2_ownArray([__HIVE_P2_get(m, "prefix", 6697), 1], 6696, "CONTROL_ARRAY")), 6696));
            case 35: return (__HIVE_P2_temp6606_52 = this, __HIVE_P2_temp6606_53 = __HIVE_P2_get(__HIVE_P2_temp6606_52, "readToken_numberSign", 6699), __HIVE_P2_invoke(__HIVE_P2_temp6606_53, __HIVE_P2_temp6606_52, (__HIVE_P2_reserveArray(0, 6699), __HIVE_P2_ownArray([], 6699, "CONTROL_ARRAY")), 6699));
        }
        __HIVE_P2_syntaxRefusal(6701);
    }, 55, 1, 0, 6606)), 6604));
    (__HIVE_P2_temp0_1507 = We, __HIVE_P2_temp0_1508 = "finishOp", __HIVE_P2_set(__HIVE_P2_temp0_1507, __HIVE_P2_temp0_1508, (__HIVE_P2_reserveFunction(6704), __HIVE_P2_registerFunction(function (e, t) {
        var __HIVE_P2_temp6704_0, __HIVE_P2_temp6704_1, __HIVE_P2_temp6704_2, __HIVE_P2_temp6704_3, __HIVE_P2_temp6704_4, __HIVE_P2_temp6704_5, __HIVE_P2_temp6704_6;
        var i = (__HIVE_P2_temp6704_0 = __HIVE_P2_get(this, "input", 6710), __HIVE_P2_temp6704_1 = __HIVE_P2_get(__HIVE_P2_temp6704_0, "slice", 6705), __HIVE_P2_invoke(__HIVE_P2_temp6704_1, __HIVE_P2_temp6704_0, (__HIVE_P2_reserveArray(2, 6705), __HIVE_P2_ownArray([__HIVE_P2_get(this, "pos", 6706), __HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 6708), t, 6707)], 6705, "CONTROL_ARRAY")), 6705));
        (__HIVE_P2_temp6704_2 = this, __HIVE_P2_temp6704_3 = "pos", __HIVE_P2_temp6704_4 = __HIVE_P2_get(__HIVE_P2_temp6704_2, __HIVE_P2_temp6704_3, 6711), __HIVE_P2_set(__HIVE_P2_temp6704_2, __HIVE_P2_temp6704_3, __HIVE_P2_binary("+", __HIVE_P2_temp6704_4, t, 6711), 6711));
        return (__HIVE_P2_temp6704_5 = this, __HIVE_P2_temp6704_6 = __HIVE_P2_get(__HIVE_P2_temp6704_5, "finishToken", 6713), __HIVE_P2_invoke(__HIVE_P2_temp6704_6, __HIVE_P2_temp6704_5, (__HIVE_P2_reserveArray(2, 6713), __HIVE_P2_ownArray([e, i], 6713, "CONTROL_ARRAY")), 6713));
    }, 8, 2, 0, 6704)), 6702));
    __HIVE_P2_set(We, "readRegexp", (__HIVE_P2_reserveFunction(6716), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6717), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6717, "CONTROL_ARRAY")), 6717);
    }, 0, 0, 0, 6716)), 6718);
    (__HIVE_P2_temp0_1510 = We, __HIVE_P2_temp0_1511 = "readInt", __HIVE_P2_set(__HIVE_P2_temp0_1510, __HIVE_P2_temp0_1511, (__HIVE_P2_reserveFunction(6722), __HIVE_P2_registerFunction(function (e, t, i) {
        var __HIVE_P2_temp6722_0, __HIVE_P2_temp6722_1, __HIVE_P2_temp6722_2, __HIVE_P2_temp6722_3, __HIVE_P2_temp6722_4, __HIVE_P2_temp6722_5;
        var s = __HIVE_P2_binary(">=", __HIVE_P2_get(__HIVE_P2_get(this, "options", 6725), "ecmaVersion", 6724), 12, 6723) && t === undefined;
        var r = i && (__HIVE_P2_temp6722_0 = __HIVE_P2_get(this, "input", 6729), __HIVE_P2_temp6722_1 = __HIVE_P2_get(__HIVE_P2_temp6722_0, "charCodeAt", 6726), __HIVE_P2_invoke(__HIVE_P2_temp6722_1, __HIVE_P2_temp6722_0, (__HIVE_P2_reserveArray(1, 6726), __HIVE_P2_ownArray([__HIVE_P2_get(this, "pos", 6727)], 6726, "CONTROL_ARRAY")), 6726)) === 48;
        var a = __HIVE_P2_get(this, "pos", 6730), n = 0, o = 0;
        for (var h = 0, p = __HIVE_P2_binary("==", t, null, 6732) ? Infinity : t; __HIVE_P2_binary("<", h, p, 6733); (__HIVE_P2_temp6722_2 = __HIVE_P2_numeric(h, 6734), __HIVE_P2_temp6722_3 = __HIVE_P2_temp6722_2 + 1, h = __HIVE_P2_temp6722_3, __HIVE_P2_temp6722_3), __HIVE_P2_increment(this, "pos", 1, false, 6735)) {
            __HIVE_P2_tick(6731);
            var c = (__HIVE_P2_temp6722_4 = __HIVE_P2_get(this, "input", 6740), __HIVE_P2_temp6722_5 = __HIVE_P2_get(__HIVE_P2_temp6722_4, "charCodeAt", 6737), __HIVE_P2_invoke(__HIVE_P2_temp6722_5, __HIVE_P2_temp6722_4, (__HIVE_P2_reserveArray(1, 6737), __HIVE_P2_ownArray([__HIVE_P2_get(this, "pos", 6738)], 6737, "CONTROL_ARRAY")), 6737)), l = void 0;
            if (s && c === 95) {
                if (r) {
                    __HIVE_P2_syntaxRefusal(6741);
                }
                if (o === 95) {
                    __HIVE_P2_syntaxRefusal(6742);
                }
                if (h === 0) {
                    __HIVE_P2_syntaxRefusal(6743);
                }
                o = c;
                continue;
            }
            if (__HIVE_P2_binary(">=", c, 97, 6745)) {
                l = __HIVE_P2_binary("+", __HIVE_P2_binary("-", c, 97, 6748), 10, 6747);
            }
            else if (__HIVE_P2_binary(">=", c, 65, 6749)) {
                l = __HIVE_P2_binary("+", __HIVE_P2_binary("-", c, 65, 6752), 10, 6751);
            }
            else if (__HIVE_P2_binary(">=", c, 48, 6753) && __HIVE_P2_binary("<=", c, 57, 6754)) {
                l = __HIVE_P2_binary("-", c, 48, 6756);
            }
            else {
                l = Infinity;
            }
            if (__HIVE_P2_binary(">=", l, e, 6758)) {
                break;
            }
            o = c;
            n = __HIVE_P2_binary("+", __HIVE_P2_binary("*", n, e, 6762), l, 6761);
        }
        if (s && o === 95) {
            __HIVE_P2_syntaxRefusal(6763);
        }
        if (__HIVE_P2_get(this, "pos", 6764) === a || __HIVE_P2_binary("!=", t, null, 6765) && __HIVE_P2_binary("-", __HIVE_P2_get(this, "pos", 6767), a, 6766) !== t) {
            return null;
        }
        return n;
    }, 15, 3, 0, 6722)), 6720));
    function stringToNumber(e, t) {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6770), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6770, "CONTROL_ARRAY")), 6770);
    }
    function stringToBigInt(e) {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6773), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6773, "CONTROL_ARRAY")), 6773);
    }
    __HIVE_P2_set(We, "readRadixNumber", (__HIVE_P2_reserveFunction(6775), __HIVE_P2_registerFunction(function (radix) {
        var __HIVE_P2_temp6775_0, __HIVE_P2_temp6775_1, __HIVE_P2_temp6775_2, __HIVE_P2_temp6775_3, __HIVE_P2_temp6775_4, __HIVE_P2_temp6775_5, __HIVE_P2_temp6775_6;
        var start = __HIVE_P2_get(this, "pos", 6776);
        (__HIVE_P2_temp6775_0 = this, __HIVE_P2_temp6775_1 = "pos", __HIVE_P2_temp6775_2 = __HIVE_P2_get(__HIVE_P2_temp6775_0, __HIVE_P2_temp6775_1, 6777), __HIVE_P2_set(__HIVE_P2_temp6775_0, __HIVE_P2_temp6775_1, __HIVE_P2_binary("+", __HIVE_P2_temp6775_2, 2, 6777), 6777));
        var digitsStart = __HIVE_P2_get(this, "pos", 6779), value = (__HIVE_P2_temp6775_3 = this, __HIVE_P2_temp6775_4 = __HIVE_P2_get(__HIVE_P2_temp6775_3, "readInt", 6780), __HIVE_P2_invoke(__HIVE_P2_temp6775_4, __HIVE_P2_temp6775_3, (__HIVE_P2_reserveArray(1, 6780), __HIVE_P2_ownArray([radix], 6780, "CONTROL_ARRAY")), 6780));
        if (value === null)
            __HIVE_P2_syntaxRefusal(6782);
        var next = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 6783), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6784), __HIVE_P2_get(this, "pos", 6785)], 6783, "CONTROL_ARRAY")), 6783);
        if (next === 110)
            __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6786), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6786, "CONTROL_ARRAY")), 6786);
        if (__HIVE_P2_binary(">=", next, 128, 6787) && !__HIVE_P2_invoke(__scalarSpace, void 0, (__HIVE_P2_reserveArray(1, 6788), __HIVE_P2_ownArray([next], 6788, "CONTROL_ARRAY")), 6788) && !__HIVE_P2_invoke(__scalarLine, void 0, (__HIVE_P2_reserveArray(1, 6789), __HIVE_P2_ownArray([next], 6789, "CONTROL_ARRAY")), 6789))
            __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6790), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6790, "CONTROL_ARRAY")), 6790);
        if (__HIVE_P2_invoke(__scalarStart, void 0, (__HIVE_P2_reserveArray(1, 6791), __HIVE_P2_ownArray([next], 6791, "CONTROL_ARRAY")), 6791) || next === 92)
            __HIVE_P2_syntaxRefusal(6792);
        if (__HIVE_P2_binary(">", __HIVE_P2_binary("-", __HIVE_P2_get(this, "pos", 6795), digitsStart, 6794), 1024, 6793))
            __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6796), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6796, "CONTROL_ARRAY")), 6796);
        return (__HIVE_P2_temp6775_5 = this, __HIVE_P2_temp6775_6 = __HIVE_P2_get(__HIVE_P2_temp6775_5, "finishToken", 6797), __HIVE_P2_invoke(__HIVE_P2_temp6775_6, __HIVE_P2_temp6775_5, (__HIVE_P2_reserveArray(2, 6797), __HIVE_P2_ownArray([__HIVE_P2_get(m, "num", 6798), value], 6797, "CONTROL_ARRAY")), 6797));
    }, 11, 1, 0, 6775)), 6800);
    __HIVE_P2_set(We, "readNumber", (__HIVE_P2_reserveFunction(6803), __HIVE_P2_registerFunction(function (startsWithDot) {
        var __HIVE_P2_temp6803_0, __HIVE_P2_temp6803_1, __HIVE_P2_temp6803_2, __HIVE_P2_temp6803_3, __HIVE_P2_temp6803_4, __HIVE_P2_temp6803_5, __HIVE_P2_temp6803_6, __HIVE_P2_temp6803_7, __HIVE_P2_temp6803_8, __HIVE_P2_temp6803_9;
        var start = __HIVE_P2_get(this, "pos", 6804);
        if (!startsWithDot && (__HIVE_P2_temp6803_0 = this, __HIVE_P2_temp6803_1 = __HIVE_P2_get(__HIVE_P2_temp6803_0, "readInt", 6805), __HIVE_P2_invoke(__HIVE_P2_temp6803_1, __HIVE_P2_temp6803_0, (__HIVE_P2_reserveArray(3, 6805), __HIVE_P2_ownArray([10, undefined, true], 6805, "CONTROL_ARRAY")), 6805)) === null) {
            __HIVE_P2_syntaxRefusal(6807);
        }
        var legacyOctal = __HIVE_P2_binary(">=", __HIVE_P2_binary("-", __HIVE_P2_get(this, "pos", 6810), start, 6809), 2, 6808) && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 6811), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6812), start], 6811, "CONTROL_ARRAY")), 6811) === 48;
        if (legacyOctal && __HIVE_P2_get(this, "strict", 6813))
            __HIVE_P2_syntaxRefusal(6814);
        var next = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 6815), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6816), __HIVE_P2_get(this, "pos", 6817)], 6815, "CONTROL_ARRAY")), 6815);
        if (!legacyOctal && !startsWithDot && next === 110)
            __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6818), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6818, "CONTROL_ARRAY")), 6818);
        if (legacyOctal) {
            for (var i = start; __HIVE_P2_binary("<", i, __HIVE_P2_get(this, "pos", 6821), 6820); (__HIVE_P2_temp6803_2 = __HIVE_P2_numeric(i, 6822), __HIVE_P2_temp6803_3 = __HIVE_P2_temp6803_2 + 1, i = __HIVE_P2_temp6803_3, __HIVE_P2_temp6803_2)) {
                __HIVE_P2_tick(6819);
                __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 6823), __HIVE_P2_ownArray([], 6823, "CONTROL_ARRAY")), 6823);
                var digit = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 6824), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6825), i], 6824, "CONTROL_ARRAY")), 6824);
                if (digit === 56 || digit === 57)
                    legacyOctal = false;
            }
        }
        if (next === 46 && !legacyOctal) {
            __HIVE_P2_increment(this, "pos", 1, true, 6827);
            (__HIVE_P2_temp6803_4 = this, __HIVE_P2_temp6803_5 = __HIVE_P2_get(__HIVE_P2_temp6803_4, "readInt", 6829), __HIVE_P2_invoke(__HIVE_P2_temp6803_5, __HIVE_P2_temp6803_4, (__HIVE_P2_reserveArray(1, 6829), __HIVE_P2_ownArray([10], 6829, "CONTROL_ARRAY")), 6829));
            next = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 6832), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6833), __HIVE_P2_get(this, "pos", 6834)], 6832, "CONTROL_ARRAY")), 6832);
        }
        if ((next === 69 || next === 101) && !legacyOctal) {
            next = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 6836), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6837), __HIVE_P2_increment(this, "pos", 1, false, 6838)], 6836, "CONTROL_ARRAY")), 6836);
            if (next === 43 || next === 45)
                __HIVE_P2_increment(this, "pos", 1, true, 6840);
            if ((__HIVE_P2_temp6803_6 = this, __HIVE_P2_temp6803_7 = __HIVE_P2_get(__HIVE_P2_temp6803_6, "readInt", 6842), __HIVE_P2_invoke(__HIVE_P2_temp6803_7, __HIVE_P2_temp6803_6, (__HIVE_P2_reserveArray(1, 6842), __HIVE_P2_ownArray([10], 6842, "CONTROL_ARRAY")), 6842)) === null)
                __HIVE_P2_syntaxRefusal(6844);
        }
        var trailing = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 6845), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6846), __HIVE_P2_get(this, "pos", 6847)], 6845, "CONTROL_ARRAY")), 6845);
        if (__HIVE_P2_binary(">=", trailing, 128, 6848) && !__HIVE_P2_invoke(__scalarSpace, void 0, (__HIVE_P2_reserveArray(1, 6849), __HIVE_P2_ownArray([trailing], 6849, "CONTROL_ARRAY")), 6849) && !__HIVE_P2_invoke(__scalarLine, void 0, (__HIVE_P2_reserveArray(1, 6850), __HIVE_P2_ownArray([trailing], 6850, "CONTROL_ARRAY")), 6850))
            __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6851), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6851, "CONTROL_ARRAY")), 6851);
        if (__HIVE_P2_invoke(__scalarStart, void 0, (__HIVE_P2_reserveArray(1, 6852), __HIVE_P2_ownArray([trailing], 6852, "CONTROL_ARRAY")), 6852) || trailing === 92)
            __HIVE_P2_syntaxRefusal(6853);
        var spelling = __HIVE_P2_invoke(__scalarNumericSpelling, void 0, (__HIVE_P2_reserveArray(3, 6854), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6855), start, __HIVE_P2_get(this, "pos", 6856)], 6854, "CONTROL_ARRAY")), 6854);
        return (__HIVE_P2_temp6803_8 = this, __HIVE_P2_temp6803_9 = __HIVE_P2_get(__HIVE_P2_temp6803_8, "finishToken", 6857), __HIVE_P2_invoke(__HIVE_P2_temp6803_9, __HIVE_P2_temp6803_8, (__HIVE_P2_reserveArray(2, 6857), __HIVE_P2_ownArray([__HIVE_P2_get(m, "num", 6858), __HIVE_P2_invoke(__number, void 0, (__HIVE_P2_reserveArray(2, 6859), __HIVE_P2_ownArray([spelling, legacyOctal ? 8 : 10], 6859, "CONTROL_ARRAY")), 6859)], 6857, "CONTROL_ARRAY")), 6857));
    }, 17, 1, 0, 6803)), 6861);
    __HIVE_P2_set(We, "readCodePoint", (__HIVE_P2_reserveFunction(6864), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp6864_0, __HIVE_P2_temp6864_1, __HIVE_P2_temp6864_2, __HIVE_P2_temp6864_3;
        var start = __HIVE_P2_get(this, "pos", 6865), value = 0, digits = 0;
        if (__HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 6866), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6867), __HIVE_P2_get(this, "pos", 6868)], 6866, "CONTROL_ARRAY")), 6866) === 123) {
            __HIVE_P2_increment(this, "pos", 1, true, 6869);
            start = __HIVE_P2_get(this, "pos", 6872);
            while (__HIVE_P2_binary("<", __HIVE_P2_get(this, "pos", 6875), __HIVE_P2_get(__HIVE_P2_get(this, "input", 6877), "length", 6876), 6874) && __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 6878), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6879), __HIVE_P2_get(this, "pos", 6880)], 6878, "CONTROL_ARRAY")), 6878) !== 125) {
                __HIVE_P2_tick(6873);
                __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 6881), __HIVE_P2_ownArray([], 6881, "CONTROL_ARRAY")), 6881);
                var digit = __HIVE_P2_invoke(__scalarHex, void 0, (__HIVE_P2_reserveArray(1, 6882), __HIVE_P2_ownArray([__HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 6883), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6884), __HIVE_P2_get(this, "pos", 6885)], 6883, "CONTROL_ARRAY")), 6883)], 6882, "CONTROL_ARRAY")), 6882);
                if (__HIVE_P2_binary("<", digit, 0, 6886))
                    __HIVE_P2_invalidTemplate(this, 6887);
                value = __HIVE_P2_binary("+", __HIVE_P2_binary("*", value, 16, 6890), digit, 6889);
                (__HIVE_P2_temp6864_0 = __HIVE_P2_numeric(digits, 6891), __HIVE_P2_temp6864_1 = __HIVE_P2_temp6864_0 + 1, digits = __HIVE_P2_temp6864_1, __HIVE_P2_temp6864_0);
                __HIVE_P2_increment(this, "pos", 1, true, 6892);
            }
            if (digits === 0 || __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 6894), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6895), __HIVE_P2_get(this, "pos", 6896)], 6894, "CONTROL_ARRAY")), 6894) !== 125) {
                __HIVE_P2_invalidTemplate(this, 6897);
            }
            __HIVE_P2_increment(this, "pos", 1, true, 6898);
            if (__HIVE_P2_binary(">", value, 1114111, 6900))
                __HIVE_P2_invalidTemplate(this, 6901);
            return value;
        }
        for (var i = 0; __HIVE_P2_binary("<", i, 4, 6903); (__HIVE_P2_temp6864_2 = __HIVE_P2_numeric(i, 6904), __HIVE_P2_temp6864_3 = __HIVE_P2_temp6864_2 + 1, i = __HIVE_P2_temp6864_3, __HIVE_P2_temp6864_2)) {
            __HIVE_P2_tick(6902);
            __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 6905), __HIVE_P2_ownArray([], 6905, "CONTROL_ARRAY")), 6905);
            var digit = __HIVE_P2_invoke(__scalarHex, void 0, (__HIVE_P2_reserveArray(1, 6906), __HIVE_P2_ownArray([__HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 6907), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 6908), __HIVE_P2_get(this, "pos", 6909)], 6907, "CONTROL_ARRAY")), 6907)], 6906, "CONTROL_ARRAY")), 6906);
            if (__HIVE_P2_binary("<", digit, 0, 6910))
                __HIVE_P2_invalidTemplate(this, 6911);
            value = __HIVE_P2_binary("+", __HIVE_P2_binary("*", value, 16, 6914), digit, 6913);
            __HIVE_P2_increment(this, "pos", 1, true, 6915);
        }
        return value;
    }, 10, 0, 0, 6864)), 6917);
    (__HIVE_P2_temp0_1513 = We, __HIVE_P2_temp0_1514 = "readString", __HIVE_P2_set(__HIVE_P2_temp0_1513, __HIVE_P2_temp0_1514, (__HIVE_P2_reserveFunction(6921), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp6921_0, __HIVE_P2_temp6921_1, __HIVE_P2_temp6921_2, __HIVE_P2_temp6921_3, __HIVE_P2_temp6921_4, __HIVE_P2_temp6921_5, __HIVE_P2_temp6921_6, __HIVE_P2_temp6921_7, __HIVE_P2_temp6921_8, __HIVE_P2_temp6921_9, __HIVE_P2_temp6921_10, __HIVE_P2_temp6921_11, __HIVE_P2_temp6921_12;
        var t = "", i = __HIVE_P2_increment(this, "pos", 1, false, 6922);
        for (;;) {
            __HIVE_P2_tick(6924);
            if (__HIVE_P2_binary(">=", __HIVE_P2_get(this, "pos", 6926), __HIVE_P2_get(__HIVE_P2_get(this, "input", 6928), "length", 6927), 6925)) {
                __HIVE_P2_syntaxRefusal(6929);
            }
            var s = (__HIVE_P2_temp6921_0 = __HIVE_P2_get(this, "input", 6933), __HIVE_P2_temp6921_1 = __HIVE_P2_get(__HIVE_P2_temp6921_0, "charCodeAt", 6930), __HIVE_P2_invoke(__HIVE_P2_temp6921_1, __HIVE_P2_temp6921_0, (__HIVE_P2_reserveArray(1, 6930), __HIVE_P2_ownArray([__HIVE_P2_get(this, "pos", 6931)], 6930, "CONTROL_ARRAY")), 6930));
            if (s === e) {
                break;
            }
            if (s === 92) {
                t = __HIVE_P2_binary("+", t, (__HIVE_P2_temp6921_2 = __HIVE_P2_get(this, "input", 6938), __HIVE_P2_temp6921_3 = __HIVE_P2_get(__HIVE_P2_temp6921_2, "slice", 6935), __HIVE_P2_invoke(__HIVE_P2_temp6921_3, __HIVE_P2_temp6921_2, (__HIVE_P2_reserveArray(2, 6935), __HIVE_P2_ownArray([i, __HIVE_P2_get(this, "pos", 6936)], 6935, "CONTROL_ARRAY")), 6935)), 6934);
                t = __HIVE_P2_binary("+", t, (__HIVE_P2_temp6921_4 = this, __HIVE_P2_temp6921_5 = __HIVE_P2_get(__HIVE_P2_temp6921_4, "readEscapedChar", 6940), __HIVE_P2_invoke(__HIVE_P2_temp6921_5, __HIVE_P2_temp6921_4, (__HIVE_P2_reserveArray(1, 6940), __HIVE_P2_ownArray([false], 6940, "CONTROL_ARRAY")), 6940)), 6939);
                i = __HIVE_P2_get(this, "pos", 6943);
            }
            else if (s === 8232 || s === 8233) {
                if (__HIVE_P2_binary("<", __HIVE_P2_get(__HIVE_P2_get(this, "options", 6946), "ecmaVersion", 6945), 10, 6944)) {
                    __HIVE_P2_syntaxRefusal(6947);
                }
                __HIVE_P2_increment(this, "pos", 1, false, 6948);
                if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 6951), "locations", 6950)) {
                    __HIVE_P2_increment(this, "curLine", 1, true, 6952);
                    (__HIVE_P2_temp6921_6 = this, __HIVE_P2_temp6921_7 = "lineStart", __HIVE_P2_set(__HIVE_P2_temp6921_6, __HIVE_P2_temp6921_7, __HIVE_P2_get(this, "pos", 6956), 6954));
                }
            }
            else {
                if (__HIVE_P2_invoke(isNewLine, void 0, (__HIVE_P2_reserveArray(1, 6957), __HIVE_P2_ownArray([s], 6957, "CONTROL_ARRAY")), 6957)) {
                    __HIVE_P2_syntaxRefusal(6958);
                }
                __HIVE_P2_increment(this, "pos", 1, false, 6959);
            }
        }
        t = __HIVE_P2_binary("+", t, (__HIVE_P2_temp6921_9 = __HIVE_P2_get(this, "input", 6966), __HIVE_P2_temp6921_10 = __HIVE_P2_get(__HIVE_P2_temp6921_9, "slice", 6962), __HIVE_P2_invoke(__HIVE_P2_temp6921_10, __HIVE_P2_temp6921_9, (__HIVE_P2_reserveArray(2, 6962), __HIVE_P2_ownArray([i, __HIVE_P2_increment(this, "pos", 1, true, 6963)], 6962, "CONTROL_ARRAY")), 6962)), 6961);
        return (__HIVE_P2_temp6921_11 = this, __HIVE_P2_temp6921_12 = __HIVE_P2_get(__HIVE_P2_temp6921_11, "finishToken", 6967), __HIVE_P2_invoke(__HIVE_P2_temp6921_12, __HIVE_P2_temp6921_11, (__HIVE_P2_reserveArray(2, 6967), __HIVE_P2_ownArray([__HIVE_P2_get(m, "string", 6968), t], 6967, "CONTROL_ARRAY")), 6967));
    }, 16, 1, 0, 6921)), 6919));
    var ze = (__HIVE_P2_reserveObject(0, 6970), __HIVE_P2_ownObject({}, 6970, 0, 0));
    (__HIVE_P2_temp0_1516 = We, __HIVE_P2_temp0_1517 = "tryReadTemplateToken", __HIVE_P2_set(__HIVE_P2_temp0_1516, __HIVE_P2_temp0_1517, (__HIVE_P2_reserveFunction(6973), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp6973_0, __HIVE_P2_temp6973_1, __HIVE_P2_temp6973_2, __HIVE_P2_temp6973_3, __HIVE_P2_temp6973_4, __HIVE_P2_temp6973_5, __HIVE_P2_temp6973_6, __HIVE_P2_temp6973_7, __HIVE_P2_temp6973_8, __HIVE_P2_temp6973_9;
        (__HIVE_P2_temp6973_0 = this, __HIVE_P2_temp6973_1 = "inTemplateElement", __HIVE_P2_set(__HIVE_P2_temp6973_0, __HIVE_P2_temp6973_1, true, 6974));
        try {
            (__HIVE_P2_temp6973_3 = this, __HIVE_P2_temp6973_4 = __HIVE_P2_get(__HIVE_P2_temp6973_3, "readTmplToken", 6976), __HIVE_P2_invoke(__HIVE_P2_temp6973_4, __HIVE_P2_temp6973_3, (__HIVE_P2_reserveArray(0, 6976), __HIVE_P2_ownArray([], 6976, "CONTROL_ARRAY")), 6976));
        }
        catch (e) {
            if (e === ze) {
                (__HIVE_P2_temp6973_5 = this, __HIVE_P2_temp6973_6 = __HIVE_P2_get(__HIVE_P2_temp6973_5, "readInvalidTemplateToken", 6978), __HIVE_P2_invoke(__HIVE_P2_temp6973_6, __HIVE_P2_temp6973_5, (__HIVE_P2_reserveArray(0, 6978), __HIVE_P2_ownArray([], 6978, "CONTROL_ARRAY")), 6978));
            }
            else {
                throw e;
            }
        }
        (__HIVE_P2_temp6973_7 = this, __HIVE_P2_temp6973_8 = "inTemplateElement", __HIVE_P2_set(__HIVE_P2_temp6973_7, __HIVE_P2_temp6973_8, false, 6980));
    }, 11, 0, 0, 6973)), 6971));
    __HIVE_P2_set(We, "invalidStringToken", (__HIVE_P2_reserveFunction(6983), __HIVE_P2_registerFunction(function () {
        __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 6984), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 6984, "CONTROL_ARRAY")), 6984);
    }, 0, 0, 0, 6983)), 6985);
    (__HIVE_P2_temp0_1519 = We, __HIVE_P2_temp0_1520 = "readTmplToken", __HIVE_P2_set(__HIVE_P2_temp0_1519, __HIVE_P2_temp0_1520, (__HIVE_P2_reserveFunction(6989), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp6989_0, __HIVE_P2_temp6989_1, __HIVE_P2_temp6989_2, __HIVE_P2_temp6989_3, __HIVE_P2_temp6989_4, __HIVE_P2_temp6989_5, __HIVE_P2_temp6989_6, __HIVE_P2_temp6989_7, __HIVE_P2_temp6989_8, __HIVE_P2_temp6989_9, __HIVE_P2_temp6989_10, __HIVE_P2_temp6989_11, __HIVE_P2_temp6989_12, __HIVE_P2_temp6989_13, __HIVE_P2_temp6989_14, __HIVE_P2_temp6989_15, __HIVE_P2_temp6989_16, __HIVE_P2_temp6989_17, __HIVE_P2_temp6989_18, __HIVE_P2_temp6989_19, __HIVE_P2_temp6989_20, __HIVE_P2_temp6989_21, __HIVE_P2_temp6989_22, __HIVE_P2_temp6989_23, __HIVE_P2_temp6989_24, __HIVE_P2_temp6989_25, __HIVE_P2_temp6989_26, __HIVE_P2_temp6989_27;
        var e = "", t = __HIVE_P2_get(this, "pos", 6990);
        for (;;) {
            __HIVE_P2_tick(6991);
            if (__HIVE_P2_binary(">=", __HIVE_P2_get(this, "pos", 6993), __HIVE_P2_get(__HIVE_P2_get(this, "input", 6995), "length", 6994), 6992)) {
                __HIVE_P2_syntaxRefusal(6996);
            }
            var i = (__HIVE_P2_temp6989_0 = __HIVE_P2_get(this, "input", 7000), __HIVE_P2_temp6989_1 = __HIVE_P2_get(__HIVE_P2_temp6989_0, "charCodeAt", 6997), __HIVE_P2_invoke(__HIVE_P2_temp6989_1, __HIVE_P2_temp6989_0, (__HIVE_P2_reserveArray(1, 6997), __HIVE_P2_ownArray([__HIVE_P2_get(this, "pos", 6998)], 6997, "CONTROL_ARRAY")), 6997));
            if (i === 96 || i === 36 && (__HIVE_P2_temp6989_2 = __HIVE_P2_get(this, "input", 7005), __HIVE_P2_temp6989_3 = __HIVE_P2_get(__HIVE_P2_temp6989_2, "charCodeAt", 7001), __HIVE_P2_invoke(__HIVE_P2_temp6989_3, __HIVE_P2_temp6989_2, (__HIVE_P2_reserveArray(1, 7001), __HIVE_P2_ownArray([__HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 7003), 1, 7002)], 7001, "CONTROL_ARRAY")), 7001)) === 123) {
                if (__HIVE_P2_get(this, "pos", 7006) === __HIVE_P2_get(this, "start", 7007) && (__HIVE_P2_get(this, "type", 7008) === __HIVE_P2_get(m, "template", 7009) || __HIVE_P2_get(this, "type", 7010) === __HIVE_P2_get(m, "invalidTemplate", 7011))) {
                    if (i === 36) {
                        (__HIVE_P2_temp6989_4 = this, __HIVE_P2_temp6989_5 = "pos", __HIVE_P2_temp6989_6 = __HIVE_P2_get(__HIVE_P2_temp6989_4, __HIVE_P2_temp6989_5, 7012), __HIVE_P2_set(__HIVE_P2_temp6989_4, __HIVE_P2_temp6989_5, __HIVE_P2_binary("+", __HIVE_P2_temp6989_6, 2, 7012), 7012));
                        return (__HIVE_P2_temp6989_7 = this, __HIVE_P2_temp6989_8 = __HIVE_P2_get(__HIVE_P2_temp6989_7, "finishToken", 7014), __HIVE_P2_invoke(__HIVE_P2_temp6989_8, __HIVE_P2_temp6989_7, (__HIVE_P2_reserveArray(1, 7014), __HIVE_P2_ownArray([__HIVE_P2_get(m, "dollarBraceL", 7015)], 7014, "CONTROL_ARRAY")), 7014));
                    }
                    else {
                        __HIVE_P2_increment(this, "pos", 1, false, 7017);
                        return (__HIVE_P2_temp6989_9 = this, __HIVE_P2_temp6989_10 = __HIVE_P2_get(__HIVE_P2_temp6989_9, "finishToken", 7019), __HIVE_P2_invoke(__HIVE_P2_temp6989_10, __HIVE_P2_temp6989_9, (__HIVE_P2_reserveArray(1, 7019), __HIVE_P2_ownArray([__HIVE_P2_get(m, "backQuote", 7020)], 7019, "CONTROL_ARRAY")), 7019));
                    }
                }
                e = __HIVE_P2_binary("+", e, (__HIVE_P2_temp6989_11 = __HIVE_P2_get(this, "input", 7026), __HIVE_P2_temp6989_12 = __HIVE_P2_get(__HIVE_P2_temp6989_11, "slice", 7023), __HIVE_P2_invoke(__HIVE_P2_temp6989_12, __HIVE_P2_temp6989_11, (__HIVE_P2_reserveArray(2, 7023), __HIVE_P2_ownArray([t, __HIVE_P2_get(this, "pos", 7024)], 7023, "CONTROL_ARRAY")), 7023)), 7022);
                return (__HIVE_P2_temp6989_13 = this, __HIVE_P2_temp6989_14 = __HIVE_P2_get(__HIVE_P2_temp6989_13, "finishToken", 7027), __HIVE_P2_invoke(__HIVE_P2_temp6989_14, __HIVE_P2_temp6989_13, (__HIVE_P2_reserveArray(2, 7027), __HIVE_P2_ownArray([__HIVE_P2_get(m, "template", 7028), e], 7027, "CONTROL_ARRAY")), 7027));
            }
            if (i === 92) {
                e = __HIVE_P2_binary("+", e, (__HIVE_P2_temp6989_15 = __HIVE_P2_get(this, "input", 7034), __HIVE_P2_temp6989_16 = __HIVE_P2_get(__HIVE_P2_temp6989_15, "slice", 7031), __HIVE_P2_invoke(__HIVE_P2_temp6989_16, __HIVE_P2_temp6989_15, (__HIVE_P2_reserveArray(2, 7031), __HIVE_P2_ownArray([t, __HIVE_P2_get(this, "pos", 7032)], 7031, "CONTROL_ARRAY")), 7031)), 7030);
                e = __HIVE_P2_binary("+", e, (__HIVE_P2_temp6989_17 = this, __HIVE_P2_temp6989_18 = __HIVE_P2_get(__HIVE_P2_temp6989_17, "readEscapedChar", 7036), __HIVE_P2_invoke(__HIVE_P2_temp6989_18, __HIVE_P2_temp6989_17, (__HIVE_P2_reserveArray(1, 7036), __HIVE_P2_ownArray([true], 7036, "CONTROL_ARRAY")), 7036)), 7035);
                t = __HIVE_P2_get(this, "pos", 7039);
            }
            else if (__HIVE_P2_invoke(isNewLine, void 0, (__HIVE_P2_reserveArray(1, 7040), __HIVE_P2_ownArray([i], 7040, "CONTROL_ARRAY")), 7040)) {
                e = __HIVE_P2_binary("+", e, (__HIVE_P2_temp6989_19 = __HIVE_P2_get(this, "input", 7045), __HIVE_P2_temp6989_20 = __HIVE_P2_get(__HIVE_P2_temp6989_19, "slice", 7042), __HIVE_P2_invoke(__HIVE_P2_temp6989_20, __HIVE_P2_temp6989_19, (__HIVE_P2_reserveArray(2, 7042), __HIVE_P2_ownArray([t, __HIVE_P2_get(this, "pos", 7043)], 7042, "CONTROL_ARRAY")), 7042)), 7041);
                __HIVE_P2_increment(this, "pos", 1, false, 7046);
                switch (i) {
                    case 13: if ((__HIVE_P2_temp6989_21 = __HIVE_P2_get(this, "input", 7051), __HIVE_P2_temp6989_22 = __HIVE_P2_get(__HIVE_P2_temp6989_21, "charCodeAt", 7048), __HIVE_P2_invoke(__HIVE_P2_temp6989_22, __HIVE_P2_temp6989_21, (__HIVE_P2_reserveArray(1, 7048), __HIVE_P2_ownArray([__HIVE_P2_get(this, "pos", 7049)], 7048, "CONTROL_ARRAY")), 7048)) === 10) {
                        __HIVE_P2_increment(this, "pos", 1, false, 7052);
                    }
                    case 10:
                        e = __HIVE_P2_binary("+", e, "\n", 7054);
                        break;
                    default:
                        e = __HIVE_P2_binary("+", e, (__HIVE_P2_temp6989_23 = __HIVE_P2_String, __HIVE_P2_temp6989_24 = __HIVE_P2_get(__HIVE_P2_temp6989_23, "fromCharCode", 7056), __HIVE_P2_invoke(__HIVE_P2_temp6989_24, __HIVE_P2_temp6989_23, (__HIVE_P2_reserveArray(1, 7056), __HIVE_P2_ownArray([i], 7056, "CONTROL_ARRAY")), 7056)), 7055);
                        break;
                }
                if (__HIVE_P2_get(__HIVE_P2_get(this, "options", 7059), "locations", 7058)) {
                    __HIVE_P2_increment(this, "curLine", 1, false, 7060);
                    (__HIVE_P2_temp6989_25 = this, __HIVE_P2_temp6989_26 = "lineStart", __HIVE_P2_set(__HIVE_P2_temp6989_25, __HIVE_P2_temp6989_26, __HIVE_P2_get(this, "pos", 7064), 7062));
                }
                t = __HIVE_P2_get(this, "pos", 7066);
            }
            else {
                __HIVE_P2_increment(this, "pos", 1, false, 7067);
            }
        }
    }, 31, 0, 0, 6989)), 6987));
    (__HIVE_P2_temp0_1522 = We, __HIVE_P2_temp0_1523 = "readInvalidTemplateToken", __HIVE_P2_set(__HIVE_P2_temp0_1522, __HIVE_P2_temp0_1523, (__HIVE_P2_reserveFunction(7071), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp7071_0, __HIVE_P2_temp7071_1, __HIVE_P2_temp7071_2, __HIVE_P2_temp7071_3, __HIVE_P2_temp7071_4, __HIVE_P2_temp7071_5, __HIVE_P2_temp7071_6;
        for (; __HIVE_P2_binary("<", __HIVE_P2_get(this, "pos", 7074), __HIVE_P2_get(__HIVE_P2_get(this, "input", 7076), "length", 7075), 7073); __HIVE_P2_increment(this, "pos", 1, true, 7077)) {
            __HIVE_P2_tick(7072);
            switch (__HIVE_P2_get(__HIVE_P2_get(this, "input", 7080), __HIVE_P2_get(this, "pos", 7081), 7079)) {
                case "\\":
                    __HIVE_P2_increment(this, "pos", 1, false, 7082);
                    break;
                case "$": if (__HIVE_P2_get(__HIVE_P2_get(this, "input", 7085), __HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 7087), 1, 7086), 7084) !== "{") {
                    break;
                }
                case "`": return (__HIVE_P2_temp7071_2 = this, __HIVE_P2_temp7071_3 = __HIVE_P2_get(__HIVE_P2_temp7071_2, "finishToken", 7088), __HIVE_P2_invoke(__HIVE_P2_temp7071_3, __HIVE_P2_temp7071_2, (__HIVE_P2_reserveArray(2, 7088), __HIVE_P2_ownArray([__HIVE_P2_get(m, "invalidTemplate", 7089), (__HIVE_P2_temp7071_0 = __HIVE_P2_get(this, "input", 7094), __HIVE_P2_temp7071_1 = __HIVE_P2_get(__HIVE_P2_temp7071_0, "slice", 7090), __HIVE_P2_invoke(__HIVE_P2_temp7071_1, __HIVE_P2_temp7071_0, (__HIVE_P2_reserveArray(2, 7090), __HIVE_P2_ownArray([__HIVE_P2_get(this, "start", 7091), __HIVE_P2_get(this, "pos", 7092)], 7090, "CONTROL_ARRAY")), 7090))], 7088, "CONTROL_ARRAY")), 7088));
                case "\r": if (__HIVE_P2_get(__HIVE_P2_get(this, "input", 7097), __HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 7099), 1, 7098), 7096) === "\n") {
                    __HIVE_P2_increment(this, "pos", 1, false, 7100);
                }
                case "\n":
                case "\u2028":
                case "\u2029":
                    __HIVE_P2_increment(this, "curLine", 1, false, 7102);
                    (__HIVE_P2_temp7071_4 = this, __HIVE_P2_temp7071_5 = "lineStart", __HIVE_P2_set(__HIVE_P2_temp7071_4, __HIVE_P2_temp7071_5, __HIVE_P2_binary("+", __HIVE_P2_get(this, "pos", 7107), 1, 7106), 7104));
                    break;
            }
        }
        __HIVE_P2_syntaxRefusal(7108);
    }, 7, 0, 0, 7071)), 7069));
    __HIVE_P2_set(We, "readEscapedChar", (__HIVE_P2_reserveFunction(7110), __HIVE_P2_registerFunction(function (inTemplate) {
        var __HIVE_P2_temp7110_0, __HIVE_P2_temp7110_1, __HIVE_P2_temp7110_2, __HIVE_P2_temp7110_3, __HIVE_P2_temp7110_4, __HIVE_P2_temp7110_5;
        var c = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 7111), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 7112), __HIVE_P2_increment(this, "pos", 1, false, 7113)], 7111, "CONTROL_ARRAY")), 7111);
        __HIVE_P2_increment(this, "pos", 1, true, 7115);
        switch (c) {
            case 110: return "\n";
            case 114: return "\r";
            case 116: return "\t";
            case 98: return "\b";
            case 118: return "\v";
            case 102: return "\f";
            case 120: return __HIVE_P2_invoke(__codePoint, void 0, (__HIVE_P2_reserveArray(1, 7117), __HIVE_P2_ownArray([(__HIVE_P2_temp7110_0 = this, __HIVE_P2_temp7110_1 = __HIVE_P2_get(__HIVE_P2_temp7110_0, "readHexChar", 7118), __HIVE_P2_invoke(__HIVE_P2_temp7110_1, __HIVE_P2_temp7110_0, (__HIVE_P2_reserveArray(1, 7118), __HIVE_P2_ownArray([2], 7118, "CONTROL_ARRAY")), 7118))], 7117, "CONTROL_ARRAY")), 7117);
            case 117: return __HIVE_P2_invoke(__codePoint, void 0, (__HIVE_P2_reserveArray(1, 7120), __HIVE_P2_ownArray([(__HIVE_P2_temp7110_2 = this, __HIVE_P2_temp7110_3 = __HIVE_P2_get(__HIVE_P2_temp7110_2, "readCodePoint", 7121), __HIVE_P2_invoke(__HIVE_P2_temp7110_3, __HIVE_P2_temp7110_2, (__HIVE_P2_reserveArray(0, 7121), __HIVE_P2_ownArray([], 7121, "CONTROL_ARRAY")), 7121))], 7120, "CONTROL_ARRAY")), 7120);
            case 13:
                if (__HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 7123), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 7124), __HIVE_P2_get(this, "pos", 7125)], 7123, "CONTROL_ARRAY")), 7123) === 10)
                    __HIVE_P2_increment(this, "pos", 1, true, 7126);
                return "";
            case 10:
            case 8232:
            case 8233: return "";
            case 56:
            case 57:
                if (__HIVE_P2_get(this, "strict", 7128) || inTemplate) {
                    __HIVE_P2_invalidTemplate(this, 7129);
                }
                return __HIVE_P2_invoke(__codePoint, void 0, (__HIVE_P2_reserveArray(1, 7130), __HIVE_P2_ownArray([c], 7130, "CONTROL_ARRAY")), 7130);
        }
        if (c !== c)
            __HIVE_P2_invalidTemplate(this, 7131);
        if (__HIVE_P2_binary(">=", c, 48, 7132) && __HIVE_P2_binary("<=", c, 55, 7133)) {
            var value = __HIVE_P2_binary("-", c, 48, 7134), digits = 1;
            while (__HIVE_P2_binary("<", digits, 3, 7136)) {
                __HIVE_P2_tick(7135);
                __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 7137), __HIVE_P2_ownArray([], 7137, "CONTROL_ARRAY")), 7137);
                var next = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 7138), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 7139), __HIVE_P2_get(this, "pos", 7140)], 7138, "CONTROL_ARRAY")), 7138);
                if (__HIVE_P2_binary("<", next, 48, 7141) || __HIVE_P2_binary(">", next, 55, 7142) || next !== next)
                    break;
                var candidate = __HIVE_P2_binary("-", __HIVE_P2_binary("+", __HIVE_P2_binary("*", value, 8, 7145), next, 7144), 48, 7143);
                if (__HIVE_P2_binary(">", candidate, 255, 7146))
                    break;
                value = candidate;
                (__HIVE_P2_temp7110_4 = __HIVE_P2_numeric(digits, 7148), __HIVE_P2_temp7110_5 = __HIVE_P2_temp7110_4 + 1, digits = __HIVE_P2_temp7110_5, __HIVE_P2_temp7110_4);
                __HIVE_P2_increment(this, "pos", 1, true, 7149);
            }
            var following = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 7151), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 7152), __HIVE_P2_get(this, "pos", 7153)], 7151, "CONTROL_ARRAY")), 7151);
            if ((digits !== 1 || c !== 48 || following === 56 || following === 57) && (__HIVE_P2_get(this, "strict", 7154) || inTemplate)) {
                __HIVE_P2_invalidTemplate(this, 7155);
            }
            return __HIVE_P2_invoke(__codePoint, void 0, (__HIVE_P2_reserveArray(1, 7156), __HIVE_P2_ownArray([value], 7156, "CONTROL_ARRAY")), 7156);
        }
        return __HIVE_P2_invoke(__codePoint, void 0, (__HIVE_P2_reserveArray(1, 7157), __HIVE_P2_ownArray([c], 7157, "CONTROL_ARRAY")), 7157);
    }, 12, 1, 0, 7110)), 7158);
    (__HIVE_P2_temp0_1525 = We, __HIVE_P2_temp0_1526 = "readHexChar", __HIVE_P2_set(__HIVE_P2_temp0_1525, __HIVE_P2_temp0_1526, (__HIVE_P2_reserveFunction(7162), __HIVE_P2_registerFunction(function (e) {
        var __HIVE_P2_temp7162_0, __HIVE_P2_temp7162_1;
        var t = __HIVE_P2_get(this, "pos", 7163);
        var i = (__HIVE_P2_temp7162_0 = this, __HIVE_P2_temp7162_1 = __HIVE_P2_get(__HIVE_P2_temp7162_0, "readInt", 7164), __HIVE_P2_invoke(__HIVE_P2_temp7162_1, __HIVE_P2_temp7162_0, (__HIVE_P2_reserveArray(2, 7164), __HIVE_P2_ownArray([16, e], 7164, "CONTROL_ARRAY")), 7164));
        if (i === null) {
            __HIVE_P2_invalidTemplate(this, 7166);
        }
        return i;
    }, 4, 1, 0, 7162)), 7160));
    __HIVE_P2_set(We, "readWord1", (__HIVE_P2_reserveFunction(7168), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp7168_0, __HIVE_P2_temp7168_1, __HIVE_P2_temp7168_2, __HIVE_P2_temp7168_3, __HIVE_P2_temp7168_4, __HIVE_P2_temp7168_5, __HIVE_P2_temp7168_6, __HIVE_P2_temp7168_7;
        (__HIVE_P2_temp7168_0 = this, __HIVE_P2_temp7168_1 = "containsEsc", __HIVE_P2_set(__HIVE_P2_temp7168_0, __HIVE_P2_temp7168_1, false, 7169));
        var word = "", first = true, chunk = __HIVE_P2_get(this, "pos", 7171);
        while (__HIVE_P2_binary("<", __HIVE_P2_get(this, "pos", 7174), __HIVE_P2_get(__HIVE_P2_get(this, "input", 7176), "length", 7175), 7173)) {
            __HIVE_P2_tick(7172);
            __HIVE_P2_invoke(__tick, void 0, (__HIVE_P2_reserveArray(0, 7177), __HIVE_P2_ownArray([], 7177, "CONTROL_ARRAY")), 7177);
            var c = __HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 7178), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 7179), __HIVE_P2_get(this, "pos", 7180)], 7178, "CONTROL_ARRAY")), 7178);
            if (__HIVE_P2_invoke(__scalarSpace, void 0, (__HIVE_P2_reserveArray(1, 7181), __HIVE_P2_ownArray([c], 7181, "CONTROL_ARRAY")), 7181) || __HIVE_P2_invoke(__scalarLine, void 0, (__HIVE_P2_reserveArray(1, 7182), __HIVE_P2_ownArray([c], 7182, "CONTROL_ARRAY")), 7182))
                break;
            if (__HIVE_P2_binary(">=", c, 128, 7183))
                __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 7184), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 7184, "CONTROL_ARRAY")), 7184);
            if (c === 92) {
                (__HIVE_P2_temp7168_3 = this, __HIVE_P2_temp7168_4 = "containsEsc", __HIVE_P2_set(__HIVE_P2_temp7168_3, __HIVE_P2_temp7168_4, true, 7185));
                word = __HIVE_P2_invoke(__concat, void 0, (__HIVE_P2_reserveArray(2, 7188), __HIVE_P2_ownArray([word, __HIVE_P2_invoke(__slice, void 0, (__HIVE_P2_reserveArray(3, 7189), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 7190), chunk, __HIVE_P2_get(this, "pos", 7191)], 7189, "CONTROL_ARRAY")), 7189)], 7188, "CONTROL_ARRAY")), 7188);
                var escapeStart = __HIVE_P2_get(this, "pos", 7192);
                if (__HIVE_P2_invoke(__char, void 0, (__HIVE_P2_reserveArray(2, 7193), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 7194), __HIVE_P2_increment(this, "pos", 1, false, 7195)], 7193, "CONTROL_ARRAY")), 7193) !== 117) {
                    __HIVE_P2_invalidTemplate(this, 7197);
                }
                __HIVE_P2_increment(this, "pos", 1, true, 7198);
                var point = (__HIVE_P2_temp7168_6 = this, __HIVE_P2_temp7168_7 = __HIVE_P2_get(__HIVE_P2_temp7168_6, "readCodePoint", 7200), __HIVE_P2_invoke(__HIVE_P2_temp7168_7, __HIVE_P2_temp7168_6, (__HIVE_P2_reserveArray(0, 7200), __HIVE_P2_ownArray([], 7200, "CONTROL_ARRAY")), 7200));
                if (__HIVE_P2_binary(">", point, 127, 7202))
                    __HIVE_P2_invoke(__refuse, void 0, (__HIVE_P2_reserveArray(1, 7203), __HIVE_P2_ownArray(["UNSUPPORTED_BOUNDED_SYNTAX"], 7203, "CONTROL_ARRAY")), 7203);
                if (!(first ? __HIVE_P2_invoke(__scalarStart, void 0, (__HIVE_P2_reserveArray(1, 7204), __HIVE_P2_ownArray([point], 7204, "CONTROL_ARRAY")), 7204) : __HIVE_P2_invoke(__scalarContinue, void 0, (__HIVE_P2_reserveArray(1, 7205), __HIVE_P2_ownArray([point], 7205, "CONTROL_ARRAY")), 7205))) {
                    __HIVE_P2_invalidTemplate(this, 7206);
                }
                word = __HIVE_P2_invoke(__concat, void 0, (__HIVE_P2_reserveArray(2, 7208), __HIVE_P2_ownArray([word, __HIVE_P2_invoke(__codePoint, void 0, (__HIVE_P2_reserveArray(1, 7209), __HIVE_P2_ownArray([point], 7209, "CONTROL_ARRAY")), 7209)], 7208, "CONTROL_ARRAY")), 7208);
                chunk = __HIVE_P2_get(this, "pos", 7211);
            }
            else {
                if (!(first ? __HIVE_P2_invoke(__scalarStart, void 0, (__HIVE_P2_reserveArray(1, 7212), __HIVE_P2_ownArray([c], 7212, "CONTROL_ARRAY")), 7212) : __HIVE_P2_invoke(__scalarContinue, void 0, (__HIVE_P2_reserveArray(1, 7213), __HIVE_P2_ownArray([c], 7213, "CONTROL_ARRAY")), 7213)))
                    break;
                __HIVE_P2_increment(this, "pos", 1, true, 7214);
            }
            first = false;
        }
        return __HIVE_P2_invoke(__concat, void 0, (__HIVE_P2_reserveArray(2, 7217), __HIVE_P2_ownArray([word, __HIVE_P2_invoke(__slice, void 0, (__HIVE_P2_reserveArray(3, 7218), __HIVE_P2_ownArray([__HIVE_P2_get(this, "input", 7219), chunk, __HIVE_P2_get(this, "pos", 7220)], 7218, "CONTROL_ARRAY")), 7218)], 7217, "CONTROL_ARRAY")), 7217);
    }, 14, 0, 0, 7168)), 7221);
    (__HIVE_P2_temp0_1528 = We, __HIVE_P2_temp0_1529 = "readWord", __HIVE_P2_set(__HIVE_P2_temp0_1528, __HIVE_P2_temp0_1529, (__HIVE_P2_reserveFunction(7225), __HIVE_P2_registerFunction(function () {
        var __HIVE_P2_temp7225_0, __HIVE_P2_temp7225_1, __HIVE_P2_temp7225_2, __HIVE_P2_temp7225_3, __HIVE_P2_temp7225_4, __HIVE_P2_temp7225_5;
        var e = (__HIVE_P2_temp7225_0 = this, __HIVE_P2_temp7225_1 = __HIVE_P2_get(__HIVE_P2_temp7225_0, "readWord1", 7226), __HIVE_P2_invoke(__HIVE_P2_temp7225_1, __HIVE_P2_temp7225_0, (__HIVE_P2_reserveArray(0, 7226), __HIVE_P2_ownArray([], 7226, "CONTROL_ARRAY")), 7226));
        var t = __HIVE_P2_get(m, "name", 7228);
        if ((__HIVE_P2_temp7225_2 = __HIVE_P2_get(this, "keywords", 7231), __HIVE_P2_temp7225_3 = __HIVE_P2_get(__HIVE_P2_temp7225_2, "test", 7229), __HIVE_P2_invoke(__HIVE_P2_temp7225_3, __HIVE_P2_temp7225_2, (__HIVE_P2_reserveArray(1, 7229), __HIVE_P2_ownArray([e], 7229, "CONTROL_ARRAY")), 7229))) {
            t = __HIVE_P2_get(d, e, 7233);
        }
        return (__HIVE_P2_temp7225_4 = this, __HIVE_P2_temp7225_5 = __HIVE_P2_get(__HIVE_P2_temp7225_4, "finishToken", 7234), __HIVE_P2_invoke(__HIVE_P2_temp7225_5, __HIVE_P2_temp7225_4, (__HIVE_P2_reserveArray(2, 7234), __HIVE_P2_ownArray([t, e], 7234, "CONTROL_ARRAY")), 7234));
    }, 8, 0, 0, 7225)), 7223));
    var Ke = "8.14.0";
    function parse(e, t) {
        var __HIVE_P2_temp7237_0, __HIVE_P2_temp7237_1;
        return (__HIVE_P2_temp7237_0 = K, __HIVE_P2_temp7237_1 = __HIVE_P2_get(__HIVE_P2_temp7237_0, "parse", 7238), __HIVE_P2_invoke(__HIVE_P2_temp7237_1, __HIVE_P2_temp7237_0, (__HIVE_P2_reserveArray(2, 7238), __HIVE_P2_ownArray([e, t], 7238, "CONTROL_ARRAY")), 7238));
    }
    function parseExpressionAt(e, t, i) {
        var __HIVE_P2_temp7240_0, __HIVE_P2_temp7240_1;
        return (__HIVE_P2_temp7240_0 = K, __HIVE_P2_temp7240_1 = __HIVE_P2_get(__HIVE_P2_temp7240_0, "parseExpressionAt", 7241), __HIVE_P2_invoke(__HIVE_P2_temp7240_1, __HIVE_P2_temp7240_0, (__HIVE_P2_reserveArray(3, 7241), __HIVE_P2_ownArray([e, t, i], 7241, "CONTROL_ARRAY")), 7241));
    }
    function tokenizer(e, t) {
        var __HIVE_P2_temp7243_0, __HIVE_P2_temp7243_1;
        return (__HIVE_P2_temp7243_0 = K, __HIVE_P2_temp7243_1 = __HIVE_P2_get(__HIVE_P2_temp7243_0, "tokenizer", 7244), __HIVE_P2_invoke(__HIVE_P2_temp7243_1, __HIVE_P2_temp7243_0, (__HIVE_P2_reserveArray(2, 7244), __HIVE_P2_ownArray([e, t], 7244, "CONTROL_ARRAY")), 7244));
    }
    __HIVE_P2_Parser = K;
    __HIVE_P2_NodeConstructor = de;
    __HIVE_P2_templateSentinel = ze;
}
__HIVE_P2_registerFunction(__char,0,2,0,-1);
__HIVE_P2_registerFunction(__slice,0,3,0,-1);
__HIVE_P2_registerFunction(__concat,0,2,0,-1);
__HIVE_P2_registerFunction(__codePoint,0,1,0,-1);
__HIVE_P2_registerFunction(__tick,0,0,0,-1);
__HIVE_P2_registerFunction(__refuse,0,1,0,-1);
__HIVE_P2_registerFunction(__number,0,2,0,-1);
__HIVE_P2_registerFunction(__HIVE_P2_initialize,1632,0,50,0);
__HIVE_P2_invoke(__HIVE_P2_initialize,undefined,__HIVE_P2_emptyArguments(),0);
