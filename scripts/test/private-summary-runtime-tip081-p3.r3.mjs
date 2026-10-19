// BEGIN P3 PRODUCER/LIFECYCLE OVERLAY. Lexical TEXT template; NEVER import alone.
// The fixed offline deriver substitutes P2 reserve/dispose and removes P2 APIs.
// Its grammar/scalar initializer suffix must remain byte-for-byte unchanged.
import {TextDecoder as __HIVE_P3_TextDecoder} from "node:util";
import {Buffer as __HIVE_P3_Buffer} from "node:buffer";
const __HIVE_P3_allocBuffer = __HIVE_P3_Buffer.alloc.bind(__HIVE_P3_Buffer);
// Explicit trusted bootstrap receiver; it receives only bounded ASCII metadata
// and digests, NEVER source code units. Costed native decoder workspace4096.
const __HIVE_P3_decoder = new __HIVE_P3_TextDecoder("utf-8", {__proto__: null, fatal: true, ignoreBOM: true});
__HIVE_P3_commonReserve(16, 0, 0, 4);
__HIVE_P2_setPrototype(__HIVE_P3_decoder, null);
const __HIVE_P3_decodeAscii = Function.prototype.call.bind(__HIVE_P3_TextDecoder.prototype.decode, __HIVE_P3_decoder);
const __HIVE_P3_sliceAscii = __HIVE_P2_sliceNative;
const __HIVE_P3_JSONParse = JSON.parse;
const __HIVE_P3_descriptor = __HIVE_P2_descriptor;
const __HIVE_P3_setPrototype = __HIVE_P2_setPrototype;
const __HIVE_P3_Array = __HIVE_P2_Array;
const __HIVE_P3_Uint8Array = Uint8Array;
const __HIVE_P3_Uint32Array = Uint32Array;
const __HIVE_P3_charCode = __HIVE_P2_charCode;
const __HIVE_P3_typedPrototype = __HIVE_P2_proto(Uint8Array.prototype);
__HIVE_P3_commonReserve(128, 0, 0, 4);
const __HIVE_P3_bufferSlot = __HIVE_P2_descriptor(__HIVE_P3_typedPrototype, "buffer");
__HIVE_P3_commonReserve(16, 0, 0, 4); __HIVE_P2_setPrototype(__HIVE_P3_bufferSlot, null);
const __HIVE_P3_bufferGetter = Function.prototype.call.bind(__HIVE_P3_bufferSlot.get);
__HIVE_P3_commonReserve(128, 0, 0, 4);
const __HIVE_P3_offsetSlot = __HIVE_P2_descriptor(__HIVE_P3_typedPrototype, "byteOffset");
__HIVE_P3_commonReserve(16, 0, 0, 4); __HIVE_P2_setPrototype(__HIVE_P3_offsetSlot, null);
const __HIVE_P3_offsetGetter = Function.prototype.call.bind(__HIVE_P3_offsetSlot.get);
__HIVE_P3_commonReserve(128, 0, 0, 4);
const __HIVE_P3_lengthSlot = __HIVE_P2_descriptor(__HIVE_P3_typedPrototype, "byteLength");
__HIVE_P3_commonReserve(16, 0, 0, 4); __HIVE_P2_setPrototype(__HIVE_P3_lengthSlot, null);
const __HIVE_P3_lengthGetter = Function.prototype.call.bind(__HIVE_P3_lengthSlot.get);
const __HIVE_P3_isArray = __HIVE_P2_isArray;
const __HIVE_P3_floor = __HIVE_P2_mathFloor;
// Only Main may issue a new reviewed fixed artifact with this constant changed.
const __HIVE_P3_COVERAGE_RELEASED = false;
const __HIVE_P3_PROFILE = "P3_ECMA15_FIXED19_COMMON_GRAMMAR";
const __HIVE_P3_PRODUCER_CAPACITY = 304440;
const __HIVE_P3_NODE_WORK = 8168;
const __HIVE_P3_SUMMARY_CODEC = 92736;
// BEFORE effects, the independent inventory must confirm this exact field count.
const __HIVE_P3_OWNER_FIELDS = 71;
const __HIVE_P3_shaConstants = [
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
  0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
  0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
  0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
__HIVE_P3_commonReserve(16, 0, 0, 4); __HIVE_P3_setPrototype(__HIVE_P3_shaConstants, null);
const __HIVE_P3_errors = __HIVE_P2_freeze({__proto__: null,
  PHASE_REFUSED: __HIVE_P2_freeze({code: "PHASE_REFUSED", realParserDisabled: true}),
  ALIAS_REFUSED: __HIVE_P2_freeze({code: "ALIAS_REFUSED", realParserDisabled: true}),
  SUMMARY_REFUSED: __HIVE_P2_freeze({code: "SUMMARY_REFUSED", realParserDisabled: true}),
  REPLAY_MISMATCH: __HIVE_P2_freeze({code: "REPLAY_MISMATCH", realParserDisabled: true}),
  VERIFY_RESOURCE_REFUSED: __HIVE_P2_freeze({code: "VERIFY_RESOURCE_REFUSED", realParserDisabled: true})
});
function __HIVE_P3_currentOwner() { return __HIVE_P2_owner; }
function __HIVE_P3_u8View(bytes, start, end) {
  const length = __HIVE_P3_lengthGetter(bytes);
  if (end === undefined) end = length;
  if (!__HIVE_P2_integer(start) || !__HIVE_P2_integer(end) || start > end || end > length)
    __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  // Caller precharges48 BEFORE this construction. No constructor/species lookup.
  return new __HIVE_P3_Uint8Array(__HIVE_P3_bufferGetter(bytes), __HIVE_P3_offsetGetter(bytes) + start, end - start);
}
function __HIVE_P3_error(code) { return __HIVE_P3_errors[code] || __HIVE_P2_errors[code] || __HIVE_P2_errors.ALLOCATION_COVERAGE_OPEN; }
function __HIVE_P3_dispose() {
  const s = __HIVE_P2_owner;
  if (s) {
    s.ast = null; s.parser = null; s.producerRoot = null; s.producerFrames = null;
    s.producerScopes = null; s.producerBindings = null; s.producerSites = null;
    s.replayRoot = null; s.replayFrames = null; s.replayScopes = null; s.replayBindings = null;
    s.replaySites = null; s.codecBuffer = null; s.hashBuffer = null;
    s.summary = null; s.sealBody = null; s.text = null;
    s.traversalActive = false; s.replayTraversalActive = false; s.phase = "RETIRED";
  }
  if (__HIVE_P2_active !== null) __HIVE_P2_deleteWeak(__HIVE_P2_owners, __HIVE_P2_active);
  __HIVE_P2_owner = null; __HIVE_P2_active = null;
}
function __HIVE_P3_abort(code) { __HIVE_P3_dispose(); throw __HIVE_P3_error(code); }
function __HIVE_P3_touch() { __HIVE_P2_timed(); }
function __HIVE_P3_add(a, b) { return __HIVE_P2_plus(a, b); }
function __HIVE_P3_mul(a, b) { return __HIVE_P2_product(a, b); }
function __HIVE_P3_pGuardChild(parentIndex) {
  __HIVE_P3_touch();
  if (!__HIVE_P2_integer(parentIndex) || parentIndex >= 128)
    __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  if (parentIndex + 1 >= 128) __HIVE_P3_abort("DEPTH_REFUSED");
  return true;
}
function __HIVE_P3_guardEntries(used, delta) {
  __HIVE_P3_touch();
  if (!__HIVE_P2_integer(used) || !__HIVE_P2_integer(delta) || used > 20000)
    __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  if (delta > 20000 - used) __HIVE_P3_abort("ENTRY_REFUSED");
  return true;
}
function __HIVE_P3_counters(entries, nodes) {
  const s = __HIVE_P2_owner;
  if (!s || !__HIVE_P2_integer(entries) || !__HIVE_P2_integer(nodes)) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  __HIVE_P3_guardEntries(s.entries, entries);
  if (nodes > 200000 - s.nodes) __HIVE_P3_abort("NODE_REFUSED");
  s.entries += entries; s.nodes += nodes;
}
function __HIVE_P3_debit(bytes, entries = 0, nodes = 0, category = "producerWorkBytes") {
  __HIVE_P3_touch();
  const s = __HIVE_P2_owner;
  if (!s || !__HIVE_P2_integer(bytes) || !__HIVE_P2_hasOwn(s, category)) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  if (bytes > s.limit - s.total) __HIVE_P3_abort("CAP_REFUSED");
  __HIVE_P3_counters(entries, nodes);
  s.total += bytes; s[category] = __HIVE_P3_add(s[category], bytes); s.peakBytes = s.total;
}
function __HIVE_P3_consume(bucket, bytes, entries = 0, nodes = 0, category = "scratchBytes") {
  __HIVE_P3_touch();
  const s = __HIVE_P2_owner;
  if (!s || !__HIVE_P2_integer(bytes)) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  let remaining;
  if (bucket === "SUMMARY_CODEC") remaining = s.summaryRemaining;
  else if (bucket === "VERIFY_CODEC") remaining = s.verifyCodecRemaining;
  else if (bucket === "VERIFY_WORK") remaining = s.verifyWorkRemaining;
  else if (bucket === "META") remaining = s.metadataRemaining;
  else __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  if (bytes > remaining) __HIVE_P3_abort("VERIFY_RESOURCE_REFUSED");
  __HIVE_P3_counters(entries, nodes);
  if (bucket === "SUMMARY_CODEC") s.summaryRemaining -= bytes;
  else if (bucket === "VERIFY_CODEC") s.verifyCodecRemaining -= bytes;
  else if (bucket === "VERIFY_WORK") s.verifyWorkRemaining -= bytes;
  else s.metadataRemaining -= bytes;
  s.scratchBytes -= bytes;
  s[category] = __HIVE_P3_add(s[category], bytes);
  // No total/peak refund; this transfers a disjoint already-debited reservation.
}
function __HIVE_P3_commonReserve(bytes, nodes = 0, entries = 0, family) {
  __HIVE_P3_touch();
  if (!__HIVE_P2_integer(bytes) || !__HIVE_P2_integer(nodes) || !__HIVE_P2_integer(entries) ||
      !__HIVE_P2_integer(family) || family > 4) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  if (!__HIVE_P2_owner) {
    if (bytes > 67108864 - __HIVE_P2_toolBytes) __HIVE_P3_abort("CAP_REFUSED");
    __HIVE_P2_toolBytes += bytes; return;
  }
  const s = __HIVE_P2_owner;
  if (s.commonStage === "PRODUCER") { __HIVE_P3_debit(bytes, entries, nodes, "producerParseBytes"); return; }
  if (s.commonStage !== "REPLAY") __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  let remaining;
  if (family === 0) remaining = s.replayNodeRemaining;
  else if (family === 1) remaining = s.replayArrayRemaining;
  else if (family === 2) remaining = s.replayStringRemaining;
  else if (family === 3) remaining = s.replayFrameRemaining;
  else remaining = s.replayBookRemaining;
  if (bytes > remaining) __HIVE_P3_abort("VERIFY_RESOURCE_REFUSED");
  __HIVE_P3_counters(entries, nodes);
  if (family === 0) s.replayNodeRemaining -= bytes;
  else if (family === 1) s.replayArrayRemaining -= bytes;
  else if (family === 2) s.replayStringRemaining -= bytes;
  else if (family === 3) s.replayFrameRemaining -= bytes;
  else s.replayBookRemaining -= bytes;
  s.replayReservedBytes -= bytes; s.replayLiveBytes += bytes;
}
function __HIVE_P3_auth(handle, timed = true) {
  const s = __HIVE_P2_getWeak(__HIVE_P2_owners, handle);
  if (!s || handle !== __HIVE_P2_active || s.phase === "RETIRED") throw __HIVE_P2_errors.AUTHORITY_REFUSED;
  if (timed) __HIVE_P3_touch(); return s;
}
function __HIVE_P3_knownError(error) {
  return error === __HIVE_P2_errors.SCHEMA_REFUSED || error === __HIVE_P2_errors.MODE_OPEN ||
    error === __HIVE_P2_errors.AUTHORITY_REFUSED || error === __HIVE_P2_errors.BUSY_REFUSED ||
    error === __HIVE_P2_errors.CAP_REFUSED || error === __HIVE_P2_errors.NODE_REFUSED ||
    error === __HIVE_P2_errors.ENTRY_REFUSED || error === __HIVE_P2_errors.DEPTH_REFUSED ||
    error === __HIVE_P2_errors.TIME_REFUSED || error === __HIVE_P2_errors.SYNTAX_REFUSED ||
    error === __HIVE_P2_errors.UNSUPPORTED_BOUNDED_SYNTAX || error === __HIVE_P2_errors.ALLOCATION_COVERAGE_OPEN ||
    error === __HIVE_P3_errors.PHASE_REFUSED || error === __HIVE_P3_errors.ALIAS_REFUSED ||
    error === __HIVE_P3_errors.SUMMARY_REFUSED || error === __HIVE_P3_errors.REPLAY_MISMATCH ||
    error === __HIVE_P3_errors.VERIFY_RESOURCE_REFUSED;
}
// Internal grammar seam: no public AST return and no caller parser/options.
function __HIVE_P3_parse() {
  const s = __HIVE_P2_owner;
  const options = __HIVE_P2_fixedOptions(s.profile);
  __HIVE_P2_reserveArray(2, -1);
  const args = __HIVE_P2_ownArray(new __HIVE_P2_Array(2), -1, "CONTROL_ARRAY");
  __HIVE_P2_set(args, 0, options); __HIVE_P2_set(args, 1, s.text);
  const parser = __HIVE_P2_construct(__HIVE_P2_Parser, args, -1);
  s.parser = parser;
  return __HIVE_P2_invoke(__HIVE_P2_get(parser, "parse"), parser, __HIVE_P2_emptyArguments());
}
function __HIVE_P3_replayStart() {
  const s = __HIVE_P2_owner;
  if (!s || s.phase !== "VERIFYING" || s.ast !== null || s.parser !== null ||
      s.producerRoot !== null || s.producerFrames !== null || s.producerScopes !== null ||
      s.producerBindings !== null || s.producerSites !== null || s.traversalActive)
    __HIVE_P3_abort("ALIAS_REFUSED");
  s.commonStage = "REPLAY";
  const beforeBytes = s.replayLiveBytes, beforeEntries = s.entries, beforeNodes = s.nodes;
  s.replayRoot = __HIVE_P3_parse(); s.parser = null;
  s.commonStage = "NONE";
  __HIVE_P3_consume("VERIFY_WORK", 128, 0, 0, "replayLiveBytes");
  return {__proto__: null, ast: s.replayRoot, parseBytes: s.replayLiveBytes - beforeBytes - 128,
    parseEntries: s.entries - beforeEntries, parseAttempts: s.nodes - beforeNodes};
}
function __HIVE_P3_replayRetire() {
  const s = __HIVE_P2_owner;
  if (!s) __HIVE_P3_abort("AUTHORITY_REFUSED");
  s.replayRoot = null; s.replayFrames = null; s.replayScopes = null;
  s.replayBindings = null; s.replaySites = null; s.replayTraversalActive = false;
  s.unreclaimedReplayBytes += s.replayLiveBytes; s.replayLiveBytes = 0;
}
function __HIVE_P3_frame() {
  return {__proto__: null, node: null, keys: null, index: 0, array: null, arrayIndex: 0,
    conditional: "CERTAIN", reads: 0, type: null, start: 0, end: 0, keysUnits: 0,
    entered: false, parentType: null, parentKey: null, declaring: false, reserved: false};
}
function __HIVE_P3_producerStorage(s) {
  s.producerFrames = new __HIVE_P3_Array(128); __HIVE_P3_setPrototype(s.producerFrames, null);
  for (let i = 0; i < 128; i++) s.producerFrames[i] = __HIVE_P3_frame();
  s.producerBindings = new __HIVE_P3_Array(512); __HIVE_P3_setPrototype(s.producerBindings, null);
  s.producerSites = new __HIVE_P3_Array(512); __HIVE_P3_setPrototype(s.producerSites, null);
}
function __HIVE_P3_nodeRead(frame, node, key) {
  if (frame.reads >= 40) __HIVE_P3_abort("VERIFY_RESOURCE_REFUSED");
  frame.reads++;
  const descriptor = __HIVE_P3_descriptor(node, key);
  if (!descriptor) return undefined;
  __HIVE_P3_setPrototype(descriptor, null);
  if (descriptor.get || descriptor.set) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  return descriptor.value;
}
function __HIVE_P3_arrayRead(array, index) {
  __HIVE_P3_debit(240, 1, 0, "producerWorkBytes");
  const key = __HIVE_P2_String(index);
  const d = __HIVE_P3_descriptor(array, key);
  if (!d) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  __HIVE_P3_setPrototype(d, null);
  if (d.get || d.set) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  __HIVE_P2_owner.producerArrayVisits++;
  return d.value;
}
function __HIVE_P3_knownNode(type) {
  switch (type) {
    case "Program": case "Identifier": case "PrivateIdentifier": case "Literal":
    case "ExpressionStatement": case "BlockStatement": case "EmptyStatement": case "DebuggerStatement":
    case "WithStatement": case "ReturnStatement": case "LabeledStatement": case "BreakStatement":
    case "ContinueStatement": case "IfStatement": case "SwitchStatement": case "SwitchCase":
    case "ThrowStatement": case "TryStatement": case "CatchClause": case "WhileStatement":
    case "DoWhileStatement": case "ForStatement": case "ForInStatement": case "ForOfStatement":
    case "FunctionDeclaration": case "VariableDeclaration": case "VariableDeclarator": case "ThisExpression":
    case "ArrayExpression": case "ObjectExpression": case "Property": case "FunctionExpression":
    case "ArrowFunctionExpression": case "SequenceExpression": case "UnaryExpression": case "UpdateExpression":
    case "BinaryExpression": case "AssignmentExpression": case "LogicalExpression": case "ConditionalExpression":
    case "NewExpression": case "CallExpression": case "MemberExpression": case "YieldExpression":
    case "AwaitExpression": case "TemplateLiteral": case "TaggedTemplateExpression": case "TemplateElement":
    case "SpreadElement": case "RestElement": case "AssignmentPattern": case "ObjectPattern":
    case "ArrayPattern": case "Super": case "MetaProperty": case "ImportDeclaration":
    case "ImportSpecifier": case "ImportDefaultSpecifier": case "ImportNamespaceSpecifier":
    case "ExportNamedDeclaration": case "ExportSpecifier": case "ExportDefaultDeclaration":
    case "ExportAllDeclaration": case "ImportExpression": case "ChainExpression": case "ClassBody":
    case "ClassDeclaration": case "ClassExpression": case "MethodDefinition": case "PropertyDefinition":
    case "StaticBlock": case "ParenthesizedExpression": return true;
    default: return false;
  }
}
function __HIVE_P3_knownKey(key) {
  switch (key) {
    case "type": case "start": case "end": case "sourceType": case "body": case "name":
    case "value": case "raw": case "expression": case "directive": case "argument":
    case "label": case "test": case "consequent": case "alternate": case "discriminant":
    case "cases": case "handler": case "finalizer": case "block": case "param": case "init":
    case "update": case "left": case "right": case "await": case "kind": case "declarations":
    case "id": case "params": case "generator": case "async": case "elements": case "properties":
    case "method": case "shorthand": case "key": case "computed": case "callee": case "arguments":
    case "optional": case "operator": case "prefix": case "delegate": case "expressions":
    case "quasis": case "tag": case "quasi": case "tail": case "meta": case "property":
    case "source": case "specifiers": case "local": case "imported": case "exported": case "object":
    case "declaration": case "superClass": case "static": case "options": case "attributes":
      return true;
    default: return false;
  }
}
function __HIVE_P3_control(type, previous) {
  if (previous === "OPTIONAL" || type === "ChainExpression") return "OPTIONAL";
  if (previous === "CONTROL_OR_DEFERRED") return previous;
  switch (type) {
    case "FunctionDeclaration": case "FunctionExpression": case "ArrowFunctionExpression":
    case "ClassDeclaration": case "ClassExpression": case "MethodDefinition": case "PropertyDefinition":
    case "StaticBlock": case "IfStatement": case "SwitchStatement": case "SwitchCase":
    case "WhileStatement": case "DoWhileStatement": case "ForStatement": case "ForInStatement":
    case "ForOfStatement": case "ConditionalExpression": case "LogicalExpression": case "TryStatement":
    case "CatchClause": return "CONTROL_OR_DEFERRED";
    default: return previous;
  }
}
function __HIVE_P3_declaration(parentType, key, parentDeclaring) {
  if (parentType === "VariableDeclarator") return key === "id";
  if (parentType === "FunctionDeclaration" || parentType === "FunctionExpression" || parentType === "ArrowFunctionExpression") return key === "id" || key === "params";
  if (parentType === "ClassDeclaration" || parentType === "ClassExpression") return key === "id";
  if (parentType === "CatchClause") return key === "param";
  if (parentType === "ImportSpecifier" || parentType === "ImportDefaultSpecifier" || parentType === "ImportNamespaceSpecifier") return key === "local";
  if (!parentDeclaring) return false;
  if (parentType === "AssignmentPattern") return key === "left";
  if (parentType === "RestElement") return key === "argument";
  if (parentType === "Property") return key === "value";
  return parentType === "ArrayPattern" && key === "elements" || parentType === "ObjectPattern" && key === "properties";
}
function __HIVE_P3_binding(s, name) {
  if (typeof name !== "string") __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  for (let i = 0; i < s.producerBindingCount; i++) {
    __HIVE_P3_touch(); if (s.producerBindings[i] === name) return;
  }
  if (s.producerBindingCount >= 512 || name.length > 65536 - s.producerBindingUnits) __HIVE_P3_abort("VERIFY_RESOURCE_REFUSED");
  __HIVE_P3_counters(1, 0);
  s.producerBindingUnits += name.length;
  s.producerBindings[s.producerBindingCount++] = __HIVE_P3_sliceAscii(name, 0, name.length);
}
function __HIVE_P3_localBinding(s, name) {
  for (let i = 0; i < s.producerBindingCount; i++) {
    __HIVE_P3_touch(); if (s.producerBindings[i] === name) return "AMBIGUOUS";
  }
  return "NO_LOCAL_BINDING";
}
function __HIVE_P3_kind(type) {
  if (type === "ImportDeclaration") return "IMPORT";
  if (type === "ExportNamedDeclaration" || type === "ExportDefaultDeclaration" || type === "ExportAllDeclaration") return "EXPORT";
  if (type === "ImportExpression") return "DYNAMIC_IMPORT";
  if (type === "CallExpression") return "CALL";
  if (type === "NewExpression") return "NEW";
  if (type === "MemberExpression") return "MEMBER";
  return null;
}
function __HIVE_P3_site(s, frame) {
  const kind = __HIVE_P3_kind(frame.type);
  if (kind === null) return;
  if (s.producerSiteCount >= 512) __HIVE_P3_abort("VERIFY_RESOURCE_REFUSED");
  let binding = "NONE", loader = "NONE";
  const optional = __HIVE_P3_nodeRead(frame, frame.node, "optional") === true;
  let computed = __HIVE_P3_nodeRead(frame, frame.node, "computed") === true;
  if (kind === "IMPORT" || kind === "EXPORT" || kind === "DYNAMIC_IMPORT") {
    const source = __HIVE_P3_nodeRead(frame, frame.node, "source");
    if (source) {
      const type = __HIVE_P3_nodeRead(frame, source, "type");
      const value = __HIVE_P3_nodeRead(frame, source, "value");
      loader = type === "Literal" && typeof value === "string" ? "STATIC_LITERAL" : "DYNAMIC";
    } else if (kind === "DYNAMIC_IMPORT") loader = "DYNAMIC";
  } else if (kind === "CALL" || kind === "NEW") {
    const callee = __HIVE_P3_nodeRead(frame, frame.node, "callee");
    const type = callee && __HIVE_P3_nodeRead(frame, callee, "type");
    loader = "OTHER";
    if (type === "Identifier") {
      const name = __HIVE_P3_nodeRead(frame, callee, "name");
      binding = __HIVE_P3_localBinding(s, name);
      if (name === "require") loader = "BARE_REQUIRE";
      else if (name === "eval") loader = "EVAL";
      else if (name === "Function") loader = "FUNCTION";
    } else if (type === "MemberExpression") {
      computed = __HIVE_P3_nodeRead(frame, callee, "computed") === true;
      if (computed) loader = "COMPUTED";
    }
  } else {
    loader = computed ? "COMPUTED" : "OTHER";
    const object = __HIVE_P3_nodeRead(frame, frame.node, "object");
    if (object && __HIVE_P3_nodeRead(frame, object, "type") === "Identifier")
      binding = __HIVE_P3_localBinding(s, __HIVE_P3_nodeRead(frame, object, "name"));
  }
  __HIVE_P3_counters(2, 0);
  s.producerSites[s.producerSiteCount++] = {__proto__: null, kind, start: frame.start,
    end: frame.end, binding, loader, conditional: optional ? "OPTIONAL" : frame.conditional,
    optional, computed, status: "OPEN"};
}
function __HIVE_P3_enter(s, frame, depth, secondPass) {
  if (++s.producerVisits > 200000) __HIVE_P3_abort("NODE_REFUSED");
  __HIVE_P3_debit(__HIVE_P3_NODE_WORK, 33, 0, "producerWorkBytes");
  frame.reads = 0;
  for (let i = 0; i < depth; i++) if (s.producerFrames[i].node === frame.node) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  const meta = __HIVE_P2_getWeak(__HIVE_P2_values, frame.node);
  if (!meta || meta.kind !== "NODE" || meta.fields > 32 || meta.keyUnits > 512) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  frame.keys = __HIVE_P2_keysNative(frame.node); __HIVE_P3_setPrototype(frame.keys, null);
  if (frame.keys.length > 32) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  let units = 0;
  for (let i = 0; i < frame.keys.length; i++) {
    __HIVE_P3_touch();
    if (!__HIVE_P3_knownKey(frame.keys[i])) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
    units += frame.keys[i].length;
  }
  if (units > 512) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  frame.type = __HIVE_P3_nodeRead(frame, frame.node, "type");
  if (!__HIVE_P3_knownNode(frame.type)) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  frame.start = __HIVE_P3_nodeRead(frame, frame.node, "start");
  frame.end = __HIVE_P3_nodeRead(frame, frame.node, "end");
  if (!__HIVE_P2_integer(frame.start) || !__HIVE_P2_integer(frame.end) || frame.start > frame.end || frame.end > s.text.length) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  frame.conditional = __HIVE_P3_control(frame.type, frame.conditional);
  if (!secondPass && frame.declaring && frame.type === "Identifier") __HIVE_P3_binding(s, __HIVE_P3_nodeRead(frame, frame.node, "name"));
  if (secondPass) { s.producerOccurrences++; __HIVE_P3_site(s, frame); }
  frame.index = 0; frame.array = null; frame.arrayIndex = 0; frame.entered = true;
}
function __HIVE_P3_walk(s, secondPass) {
  let depth = 0;
  const root = s.producerFrames[0];
  root.node = s.producerRoot; root.entered = false; root.conditional = "CERTAIN"; root.declaring = false;
  s.traversalActive = true;
  while (depth >= 0) {
    __HIVE_P3_touch();
    const f = s.producerFrames[depth];
    if (!f.entered) __HIVE_P3_enter(s, f, depth, secondPass);
    let child = null, key = f.parentKey;
    if (f.array !== null) {
      if (f.arrayIndex < f.array.length) { child = __HIVE_P3_arrayRead(f.array, f.arrayIndex++); key = f.parentKey; }
      else { f.array = null; continue; }
    } else if (f.index < f.keys.length) {
      key = f.keys[f.index++];
      child = __HIVE_P3_nodeRead(f, f.node, key);
      if (child && typeof child === "object" && __HIVE_P3_isArray(child)) {
        const meta = __HIVE_P2_getWeak(__HIVE_P2_values, child);
        if (!meta || meta.kind !== "ARRAY") __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
        f.array = child; f.arrayIndex = 0; f.parentKey = key; continue;
      }
    } else { f.node = null; f.keys = null; f.array = null; f.entered = false; depth--; continue; }
    if (child && typeof child === "object") {
      const meta = __HIVE_P2_getWeak(__HIVE_P2_values, child);
      if (!meta || meta.kind !== "NODE") {
        if (f.type === "TemplateElement" && key === "value" && meta && meta.kind === "OBJECT") continue;
        __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
      }
      __HIVE_P3_pGuardChild(depth);
      const next = s.producerFrames[++depth];
      next.node = child; next.entered = false; next.conditional = f.conditional;
      next.declaring = __HIVE_P3_declaration(f.type, key, f.declaring); next.parentType = f.type; next.parentKey = key;
    }
  }
  s.traversalActive = false;
}
function __HIVE_P3_kindOrder(kind) {
  if (kind === "IMPORT") return 0; if (kind === "EXPORT") return 1;
  if (kind === "DYNAMIC_IMPORT") return 2; if (kind === "CALL") return 3;
  if (kind === "NEW") return 4; return 5;
}
function __HIVE_P3_sortSites(s) {
  for (let i = 1; i < s.producerSiteCount; i++) {
    const row = s.producerSites[i]; let j = i;
    while (j > 0) {
      __HIVE_P3_touch(); const before = s.producerSites[j - 1];
      if (before.start < row.start || before.start === row.start && (before.end < row.end || before.end === row.end && __HIVE_P3_kindOrder(before.kind) <= __HIVE_P3_kindOrder(row.kind))) break;
      s.producerSites[j] = before; j--;
    }
    s.producerSites[j] = row;
  }
}
function __HIVE_P3_put(s, code) {
  if (s.codecPosition >= s.codecLimit) __HIVE_P3_abort("SUMMARY_REFUSED");
  s.codecBuffer[s.codecPosition++] = code;
}
function __HIVE_P3_raw(s, text) {
  for (let i = 0; i < text.length; i++) { __HIVE_P3_touch(); __HIVE_P3_put(s, __HIVE_P2_charCode(text, i)); }
}
function __HIVE_P3_string(s, text) {
  if (typeof text !== "string" || text.length > 128) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  __HIVE_P3_put(s, 34);
  for (let i = 0; i < text.length; i++) {
    const c = __HIVE_P2_charCode(text, i);
    if (c < 32 || c > 126 || c === 34 || c === 92) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
    __HIVE_P3_put(s, c);
  }
  __HIVE_P3_put(s, 34);
}
function __HIVE_P3_unsigned(s, value) {
  if (!__HIVE_P2_integer(value)) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  let divisor = 1;
  while (__HIVE_P3_floor(value / divisor) >= 10) divisor *= 10;
  do {
    const digit = __HIVE_P3_floor(value / divisor);
    __HIVE_P3_put(s, 48 + digit); value -= digit * divisor; divisor /= 10;
  } while (divisor >= 1);
}
function __HIVE_P3_field(s, key, comma) { if (comma) __HIVE_P3_put(s, 44); __HIVE_P3_string(s, key); __HIVE_P3_put(s, 58); }
function __HIVE_P3_rotate(value, shift) { return value >>> shift | value << 32 - shift; }
function __HIVE_P3_sha256(input, utf16, units) {
  // Caller consumes4096 named bounded SHA workspace +160 final digest string
  // BEFORE entry. Native numeric typed arrays receive lengths only; no iterable
  // constructor, species/view, native Hash object, source callback or raw export.
  const state = new __HIVE_P3_Uint32Array(8), words = new __HIVE_P3_Uint32Array(64);
  const block = new __HIVE_P3_Uint8Array(64), hex = new __HIVE_P3_Uint8Array(64);
  state[0]=0x6a09e667;state[1]=0xbb67ae85;state[2]=0x3c6ef372;state[3]=0xa54ff53a;
  state[4]=0x510e527f;state[5]=0x9b05688c;state[6]=0x1f83d9ab;state[7]=0x5be0cd19;
  const byteLength = utf16 ? units * 2 : units;
  const padded = __HIVE_P3_floor((byteLength + 72) / 64) * 64;
  const bitLength = byteLength * 8, high = __HIVE_P3_floor(bitLength / 4294967296), low = bitLength >>> 0;
  for (let offset = 0; offset < padded; offset += 64) {
    __HIVE_P3_touch();
    for (let i = 0; i < 64; i++) {
      const at = offset + i;
      if (at < byteLength) block[i] = utf16 ? __HIVE_P3_charCode(input, __HIVE_P3_floor(at / 2)) >>> ((at & 1) * 8) & 255 : input[at];
      else if (at === byteLength) block[i] = 128;
      else if (at >= padded - 8) {
        const position = at - (padded - 8), word = position < 4 ? high : low;
        block[i] = word >>> ((3 - position % 4) * 8) & 255;
      } else block[i] = 0;
    }
    for (let i = 0; i < 16; i++) words[i] = (block[i*4]<<24 | block[i*4+1]<<16 | block[i*4+2]<<8 | block[i*4+3]) >>> 0;
    for (let i = 16; i < 64; i++) {
      const x=words[i-15], y=words[i-2];
      const a=__HIVE_P3_rotate(x,7)^__HIVE_P3_rotate(x,18)^x>>>3;
      const b=__HIVE_P3_rotate(y,17)^__HIVE_P3_rotate(y,19)^y>>>10;
      words[i]=(words[i-16]+a+words[i-7]+b)>>>0;
    }
    let a=state[0],b=state[1],c=state[2],d=state[3],e=state[4],f=state[5],g=state[6],h=state[7];
    for (let i=0;i<64;i++) {
      __HIVE_P3_touch();
      const sigma1=__HIVE_P3_rotate(e,6)^__HIVE_P3_rotate(e,11)^__HIVE_P3_rotate(e,25);
      const sigma0=__HIVE_P3_rotate(a,2)^__HIVE_P3_rotate(a,13)^__HIVE_P3_rotate(a,22);
      const choose=e&f^~e&g, majority=a&b^a&c^b&c;
      const first=(h+sigma1+choose+__HIVE_P3_shaConstants[i]+words[i])>>>0;
      const second=(sigma0+majority)>>>0;
      h=g;g=f;f=e;e=(d+first)>>>0;d=c;c=b;b=a;a=(first+second)>>>0;
    }
    state[0]=(state[0]+a)>>>0;state[1]=(state[1]+b)>>>0;state[2]=(state[2]+c)>>>0;state[3]=(state[3]+d)>>>0;
    state[4]=(state[4]+e)>>>0;state[5]=(state[5]+f)>>>0;state[6]=(state[6]+g)>>>0;state[7]=(state[7]+h)>>>0;
  }
  for (let i=0;i<64;i++) {
    const nibble=state[__HIVE_P3_floor(i/8)]>>>((7-i%8)*4)&15;
    hex[i]=nibble<10?48+nibble:87+nibble;
  }
  return __HIVE_P3_decodeAscii(hex);
}
function __HIVE_P3_sourceHash(s) {
  __HIVE_P3_consume("SUMMARY_CODEC", 4096 + 160, 0, 0, "summaryBytes");
  return __HIVE_P3_sha256(s.text, true, s.text.length);
}
function __HIVE_P3_ledgerField(s, key, value, comma) { __HIVE_P3_field(s, key, comma); __HIVE_P3_unsigned(s, value); }
function __HIVE_P3_encodeSummary(s) {
  __HIVE_P3_consume("SUMMARY_CODEC", 16384 + 64 + 32800 + 32800 + 4096 + 160 + 96, 0, 0, "summaryBytes");
  s.codecBuffer = __HIVE_P3_allocBuffer(16384); s.codecPosition = 0; s.codecLimit = 16384;
  __HIVE_P3_put(s, 123);
  __HIVE_P3_field(s, "version", false); __HIVE_P3_unsigned(s, 1);
  __HIVE_P3_field(s, "purpose", true); __HIVE_P3_string(s, "TIP081_P3_SYNTHETIC_SYNTAX_SUMMARY");
  __HIVE_P3_field(s, "mode", true); __HIVE_P3_string(s, s.profile);
  __HIVE_P3_field(s, "profile", true); __HIVE_P3_string(s, __HIVE_P3_PROFILE);
  __HIVE_P3_field(s, "syntheticUtf16Hash", true); __HIVE_P3_string(s, s.sourceIdentity);
  __HIVE_P3_field(s, "utf16Units", true); __HIVE_P3_unsigned(s, s.text.length);
  __HIVE_P3_field(s, "astOccurrences", true); __HIVE_P3_unsigned(s, s.producerOccurrences);
  __HIVE_P3_field(s, "grammarAttempts", true); __HIVE_P3_unsigned(s, s.producerParseAttempts);
  __HIVE_P3_field(s, "sites", true); __HIVE_P3_put(s, 91);
  for (let i = 0; i < s.producerSiteCount; i++) {
    __HIVE_P3_touch(); const row = s.producerSites[i];
    if (i) __HIVE_P3_put(s, 44); __HIVE_P3_put(s, 123);
    __HIVE_P3_field(s, "kind", false); __HIVE_P3_string(s, row.kind);
    __HIVE_P3_field(s, "start", true); __HIVE_P3_unsigned(s, row.start);
    __HIVE_P3_field(s, "end", true); __HIVE_P3_unsigned(s, row.end);
    __HIVE_P3_field(s, "binding", true); __HIVE_P3_string(s, row.binding);
    __HIVE_P3_field(s, "loader", true); __HIVE_P3_string(s, row.loader);
    __HIVE_P3_field(s, "conditional", true); __HIVE_P3_string(s, row.conditional);
    __HIVE_P3_field(s, "optional", true); __HIVE_P3_raw(s, row.optional ? "true" : "false");
    __HIVE_P3_field(s, "computed", true); __HIVE_P3_raw(s, row.computed ? "true" : "false");
    __HIVE_P3_field(s, "status", true); __HIVE_P3_string(s, "OPEN"); __HIVE_P3_put(s, 125);
  }
  __HIVE_P3_put(s, 93); __HIVE_P3_field(s, "ledger", true); __HIVE_P3_put(s, 123);
  __HIVE_P3_ledgerField(s, "baseBytes", s.baseBytes, false);
  __HIVE_P3_ledgerField(s, "producerParseBytes", s.producerParseBytes, true);
  __HIVE_P3_ledgerField(s, "producerWorkBytes", s.producerWorkBytes, true);
  __HIVE_P3_ledgerField(s, "summaryBytes", s.summaryBytes, true);
  __HIVE_P3_ledgerField(s, "replayReservedBytes", s.replayReservedBytes, true);
  __HIVE_P3_ledgerField(s, "replayLiveBytes", s.replayLiveBytes, true);
  __HIVE_P3_ledgerField(s, "scratchBytes", s.scratchBytes, true);
  __HIVE_P3_ledgerField(s, "unreclaimedProducerBytes", s.unreclaimedProducerBytes, true);
  __HIVE_P3_ledgerField(s, "unreclaimedReplayBytes", s.unreclaimedReplayBytes, true);
  __HIVE_P3_ledgerField(s, "totalBytes", s.total, true);
  __HIVE_P3_ledgerField(s, "peakBytes", s.peakBytes, true);
  __HIVE_P3_ledgerField(s, "producerEntries", s.historicalProducerEntries, true);
  __HIVE_P3_ledgerField(s, "producerAttempts", s.producerParseAttempts, true);
  __HIVE_P3_ledgerField(s, "siteCount", s.producerSiteCount, true);
  __HIVE_P3_put(s, 125); __HIVE_P3_put(s, 125);
  s.sealBody = __HIVE_P3_decodeAscii(__HIVE_P3_u8View(s.codecBuffer, 0, s.codecPosition));
  const seal = __HIVE_P3_sha256(s.codecBuffer, false, s.codecPosition);
  s.codecPosition--;
  __HIVE_P3_field(s, "summaryHash", true); __HIVE_P3_string(s, seal); __HIVE_P3_put(s, 125);
  s.summary = __HIVE_P3_decodeAscii(__HIVE_P3_u8View(s.codecBuffer, 0, s.codecPosition));
  s.codecBuffer = null; s.hashBuffer = null;
  return s.summary;
}
function __HIVE_P3_metadata(s) {
  __HIVE_P3_touch();
  if (s.metadataEmissions >= 32) __HIVE_P3_abort("VERIFY_RESOURCE_REFUSED");
  __HIVE_P3_consume("META", 12864, 0, 0, "summaryBytes");
  s.metadataEmissions++;
  const metadata = {__proto__: null,
    version: 1, purpose: "TIP081_P3_SYNTHETIC_METADATA", mode: s.profile, phase: s.phase,
    totalBytes: s.total, peakBytes: s.peakBytes, producerParseBytes: s.producerParseBytes,
    producerWorkBytes: s.producerWorkBytes, summaryBytes: s.summaryBytes,
    replayReservedBytes: s.replayReservedBytes, replayLiveBytes: s.replayLiveBytes,
    scratchBytes: s.scratchBytes, unreclaimedProducerBytes: s.unreclaimedProducerBytes,
    unreclaimedReplayBytes: s.unreclaimedReplayBytes, attemptedNodes: s.nodes,
    internalEntries: s.entries, siteCount: s.producerSiteCount, grammarPasses: s.grammarPasses,
    metadataEmissions: s.metadataEmissions, semanticCoverage: "OPEN_COMMON_GRAMMAR_RISK",
    allocatorCoverage: "COMMON_MODE", graphStatus: "OPEN", predecessorOpen: 62,
    fullRuntimeClosure: "NOT_ACCEPTED", execution: false, materialization: false,
    realParserDisabled: true};
  s.codecBuffer = __HIVE_P3_allocBuffer(4096); s.codecPosition = 0; s.codecLimit = 4096;
  __HIVE_P3_put(s, 123);
  __HIVE_P3_ledgerField(s, "version", metadata.version, false);
  __HIVE_P3_field(s, "purpose", true); __HIVE_P3_string(s, metadata.purpose);
  __HIVE_P3_field(s, "mode", true); __HIVE_P3_string(s, metadata.mode);
  __HIVE_P3_field(s, "phase", true); __HIVE_P3_string(s, metadata.phase);
  __HIVE_P3_ledgerField(s, "totalBytes", metadata.totalBytes, true);
  __HIVE_P3_ledgerField(s, "peakBytes", metadata.peakBytes, true);
  __HIVE_P3_ledgerField(s, "producerParseBytes", metadata.producerParseBytes, true);
  __HIVE_P3_ledgerField(s, "producerWorkBytes", metadata.producerWorkBytes, true);
  __HIVE_P3_ledgerField(s, "summaryBytes", metadata.summaryBytes, true);
  __HIVE_P3_ledgerField(s, "replayReservedBytes", metadata.replayReservedBytes, true);
  __HIVE_P3_ledgerField(s, "replayLiveBytes", metadata.replayLiveBytes, true);
  __HIVE_P3_ledgerField(s, "scratchBytes", metadata.scratchBytes, true);
  __HIVE_P3_ledgerField(s, "unreclaimedProducerBytes", metadata.unreclaimedProducerBytes, true);
  __HIVE_P3_ledgerField(s, "unreclaimedReplayBytes", metadata.unreclaimedReplayBytes, true);
  __HIVE_P3_ledgerField(s, "attemptedNodes", metadata.attemptedNodes, true);
  __HIVE_P3_ledgerField(s, "internalEntries", metadata.internalEntries, true);
  __HIVE_P3_ledgerField(s, "siteCount", metadata.siteCount, true);
  __HIVE_P3_ledgerField(s, "grammarPasses", metadata.grammarPasses, true);
  __HIVE_P3_ledgerField(s, "metadataEmissions", metadata.metadataEmissions, true);
  __HIVE_P3_field(s, "semanticCoverage", true); __HIVE_P3_string(s, metadata.semanticCoverage);
  __HIVE_P3_field(s, "allocatorCoverage", true); __HIVE_P3_string(s, metadata.allocatorCoverage);
  __HIVE_P3_field(s, "graphStatus", true); __HIVE_P3_string(s, metadata.graphStatus);
  __HIVE_P3_ledgerField(s, "predecessorOpen", metadata.predecessorOpen, true);
  __HIVE_P3_field(s, "fullRuntimeClosure", true); __HIVE_P3_string(s, metadata.fullRuntimeClosure);
  __HIVE_P3_field(s, "execution", true); __HIVE_P3_raw(s, "false");
  __HIVE_P3_field(s, "materialization", true); __HIVE_P3_raw(s, "false");
  __HIVE_P3_field(s, "realParserDisabled", true); __HIVE_P3_raw(s, "true");
  __HIVE_P3_put(s, 125);
  if (s.codecPosition > 4096) __HIVE_P3_abort("VERIFY_RESOURCE_REFUSED");
  const result = __HIVE_P3_decodeAscii(__HIVE_P3_u8View(s.codecBuffer, 0, s.codecPosition));
  s.codecBuffer = null; return result;
}
export function createSyntheticSummaryP3(text, mode, cap, ttl) {
  if (arguments.length !== 4) throw __HIVE_P2_errors.AUTHORITY_REFUSED;
  if (typeof text !== "string" || typeof mode !== "string" ||
      !__HIVE_P2_integer(cap) || cap > 67108864 || !__HIVE_P2_integer(ttl) || ttl < 1 || ttl > 120000)
    throw __HIVE_P2_errors.SCHEMA_REFUSED;
  if (mode !== "SCRIPT" && mode !== "MODULE") throw __HIVE_P2_errors.MODE_OPEN;
  if (!__HIVE_P3_COVERAGE_RELEASED) throw __HIVE_P2_errors.ALLOCATION_COVERAGE_OPEN;
  if (__HIVE_P2_active !== null) {
    __HIVE_P3_touch(); throw __HIVE_P2_errors.BUSY_REFUSED;
  }
  const control = 64 + 16 * __HIVE_P3_OWNER_FIELDS + 96 + 32 + 32 + 176;
  const initialReserved = 25165824 + 6758296 + __HIVE_P3_PRODUCER_CAPACITY;
  if (__HIVE_P2_toolBytes > cap || control > cap - __HIVE_P2_toolBytes ||
      initialReserved > cap - __HIVE_P2_toolBytes - control ||
      text.length > __HIVE_P3_floor((cap - __HIVE_P2_toolBytes - control - initialReserved) / 4))
    throw __HIVE_P2_errors.CAP_REFUSED;
  const started = __HIVE_P2_clock();
  if (!__HIVE_P2_finite(started)) throw __HIVE_P2_errors.TIME_REFUSED;
  const base = __HIVE_P2_toolBytes + control + 4 * text.length;
  const total = base + initialReserved;
  const state = {__proto__: null,
    text, profile: mode, limit: cap, ttl, started, lastNow: started, total,
    producerBytes: 0, outputBytes: 0, nodes: 0, entries: 1, callDepth: 0, ticks: 0,
    ast: null, parser: null, phase: "SOURCE_READY", baseBytes: base, peakBytes: total,
    producerParseBytes: 0, producerWorkBytes: __HIVE_P3_PRODUCER_CAPACITY,
    summaryBytes: 0, replayReservedBytes: 25165824, replayLiveBytes: 0,
    scratchBytes: 6758296, unreclaimedProducerBytes: 0, unreclaimedReplayBytes: 0,
    commonStage: "NONE", producerRoot: null, producerFrames: null, producerScopes: null,
    producerBindings: null, producerSites: null, traversalActive: false, replayRoot: null,
    replayFrames: null, replayScopes: null, replayBindings: null, replaySites: null,
    replayTraversalActive: false, producerBindingCount: 0, producerBindingUnits: 0,
    producerSiteCount: 0, producerVisits: 0, producerArrayVisits: 0, producerOccurrences: 0,
    producerArraySlots: 0, producerParseEntries: 0, producerParseAttempts: 0,
    historicalProducerEntries: 0, grammarPasses: 0, metadataEmissions: 0,
    summaryRemaining: __HIVE_P3_SUMMARY_CODEC, verifyCodecRemaining: 3612704,
    verifyWorkRemaining: 2641208, metadataRemaining: 411648,
    replayNodeRemaining: 8388608, replayArrayRemaining: 4194304,
    replayStringRemaining: 4194304, replayFrameRemaining: 4194304,
    replayBookRemaining: 4194304, sourceIdentity: null, summary: null, sealBody: null,
    codecBuffer: null, hashBuffer: null, codecPosition: 0, initialCategories: null,
    producerFirstVisits: 0, producerFirstArrayVisits: 0, codecLimit: 0,
    producerMetadataEmissions: 0};
  const handle = __HIVE_P2_freeze({__proto__: null,
    purpose: "TIP081_P3_SYNTHETIC_SYNTAX_SUMMARY", realParserDisabled: true});
  __HIVE_P2_owner = state; __HIVE_P2_active = handle;
  __HIVE_P2_setWeak(__HIVE_P2_owners, handle, state);
  try {
    __HIVE_P3_counters(256, 0);
    __HIVE_P3_producerStorage(state);
    state.initialCategories = __HIVE_P2_freeze({__proto__: null,
      baseBytes: base, producerWorkBytes: __HIVE_P3_PRODUCER_CAPACITY, summaryBytes: 0,
      replayReservedBytes: 25165824, replayLiveBytes: 0, scratchBytes: 6758296,
      initialEntries: 257});
    return handle;
  } catch (error) { __HIVE_P3_dispose(); if (__HIVE_P3_knownError(error)) throw error; throw __HIVE_P2_errors.ALLOCATION_COVERAGE_OPEN; }
}
export function analyzeSyntheticSummaryP3(handle) {
  if (arguments.length !== 1) throw __HIVE_P2_errors.AUTHORITY_REFUSED;
  const state = __HIVE_P3_auth(handle);
  if (state.phase !== "SOURCE_READY") __HIVE_P3_abort("PHASE_REFUSED");
  state.phase = "ANALYZING";
  try {
    state.commonStage = "PRODUCER";
    const beforeEntries = state.entries, beforeNodes = state.nodes;
    state.ast = __HIVE_P3_parse(); state.producerRoot = state.ast;
    state.producerParseEntries = state.entries - beforeEntries;
    state.producerParseAttempts = state.nodes - beforeNodes;
    state.grammarPasses = 1; state.commonStage = "NONE";
    __HIVE_P3_walk(state, false);
    state.producerFirstVisits = state.producerVisits;
    state.producerFirstArrayVisits = state.producerArrayVisits;
    __HIVE_P3_walk(state, true);
    state.producerArraySlots = state.producerArrayVisits - state.producerFirstArrayVisits;
    if (state.producerOccurrences !== state.producerFirstVisits ||
        state.producerArraySlots !== state.producerFirstArrayVisits) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
    __HIVE_P3_sortSites(state);
    state.sourceIdentity = __HIVE_P3_sourceHash(state);
    state.historicalProducerEntries = state.entries;
    state.producerMetadataEmissions = state.metadataEmissions;
    const wire = __HIVE_P3_encodeSummary(state);
    state.phase = "PRODUCER_SUMMARY"; return wire;
  } catch (error) { __HIVE_P3_dispose(); if (__HIVE_P3_knownError(error)) throw error; throw __HIVE_P2_errors.ALLOCATION_COVERAGE_OPEN; }
}
export function retireProducerSummaryP3(handle) {
  if (arguments.length !== 1) throw __HIVE_P2_errors.AUTHORITY_REFUSED;
  const state = __HIVE_P3_auth(handle);
  if (state.phase !== "PRODUCER_SUMMARY") __HIVE_P3_abort("PHASE_REFUSED");
  state.ast = null; state.parser = null;
  state.producerRoot = null; // P3_ALIAS_CLEAR
  state.producerFrames = null; state.producerScopes = null; state.producerBindings = null;
  state.producerSites = null; state.traversalActive = false;
  state.unreclaimedProducerBytes = __HIVE_P3_add(state.producerParseBytes, state.producerWorkBytes);
  state.producerParseBytes = 0; state.producerWorkBytes = 0;
  state.phase = "PRODUCER_AST_RETIRED";
  return "SYNTHETIC_P3_PRODUCER_RETIRED";
}
export function verifySyntheticSummaryP3(handle, wire) {
  if (arguments.length !== 2 || typeof wire !== "string") throw __HIVE_P2_errors.AUTHORITY_REFUSED;
  const state = __HIVE_P3_auth(handle);
  if (state.phase !== "PRODUCER_AST_RETIRED") __HIVE_P3_abort("PHASE_REFUSED");
  if (state.ast !== null || state.parser !== null || state.producerRoot !== null ||
      state.producerFrames !== null || state.producerScopes !== null || state.producerBindings !== null ||
      state.producerSites !== null || state.traversalActive) __HIVE_P3_abort("ALIAS_REFUSED");
  state.phase = "VERIFYING";
  try {
    __HIVE_P3_verifyWire(wire);
    if (state.replayRoot !== null || state.replayFrames !== null || state.replayScopes !== null ||
        state.replayBindings !== null || state.replaySites !== null || state.replayTraversalActive || state.parser !== null)
      __HIVE_P3_abort("ALIAS_REFUSED");
    state.phase = "VERIFIED"; state.grammarPasses = 2;
    return __HIVE_P3_metadata(state);
  } catch (error) { __HIVE_P3_dispose(); if (__HIVE_P3_knownError(error)) throw error; throw __HIVE_P2_errors.ALLOCATION_COVERAGE_OPEN; }
}
export function observeSyntheticSummaryP3(handle) {
  if (arguments.length !== 1) throw __HIVE_P2_errors.AUTHORITY_REFUSED;
  const state = __HIVE_P3_auth(handle);
  try { return __HIVE_P3_metadata(state); }
  catch (error) { __HIVE_P3_dispose(); if (__HIVE_P3_knownError(error)) throw error; throw __HIVE_P2_errors.ALLOCATION_COVERAGE_OPEN; }
}
export function retireSyntheticSummaryP3(handle) {
  if (arguments.length !== 1) throw __HIVE_P2_errors.AUTHORITY_REFUSED;
  __HIVE_P3_auth(handle, false); __HIVE_P3_dispose();
  return "SYNTHETIC_P3_OWNER_RETIRED";
}
// END P3 PRODUCER/LIFECYCLE OVERLAY.
