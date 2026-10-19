// Offline embedding data ONLY. These declarations are private inside the new
// admitted P3 owner. Never import/evaluate this text as a target or parser API.
export const PRIVATE_SUMMARY_VERIFIER_P3_R3 = String.raw`
// Independently authored verifier. Shared grammar/allocator/primitives are
// COMMON_MODE; no producer traversal, decoder, serializer or ledger is called.
function __HIVE_P3_vEqualAt(text, at, literal) {
  if (at + literal.length > text.length) return false;
  for (let i = 0; i < literal.length; i++) {
    __HIVE_P3_touch();
    if (__HIVE_P3_charCode(text, at + i) !== __HIVE_P3_charCode(literal, i)) return false;
  }
  return true;
}
function __HIVE_P3_vLiteral(scan, literal) {
  if (!__HIVE_P3_vEqualAt(scan.text, scan.at, literal)) __HIVE_P3_abort("SUMMARY_REFUSED");
  scan.at += literal.length;
}
function __HIVE_P3_vUnsigned(scan) {
  const start = scan.at;
  let value = 0, count = 0;
  while (scan.at < scan.text.length) {
    __HIVE_P3_touch();
    const c = __HIVE_P3_charCode(scan.text, scan.at);
    if (c < 48 || c > 57) break;
    if (count && __HIVE_P3_charCode(scan.text, start) === 48) __HIVE_P3_abort("SUMMARY_REFUSED");
    const digit = c - 48;
    if (value > (9007199254740991 - digit) / 10) __HIVE_P3_abort("SUMMARY_REFUSED");
    value = value * 10 + digit;
    scan.at++; count++;
  }
  if (!count) __HIVE_P3_abort("SUMMARY_REFUSED");
  if (!__HIVE_P3_vU(value)) __HIVE_P3_abort("SUMMARY_REFUSED");
  return value;
}
function __HIVE_P3_vEnum(scan, choices) {
  __HIVE_P3_vLiteral(scan, '"');
  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    if (__HIVE_P3_vEqualAt(scan.text, scan.at, choice) &&
        __HIVE_P3_charCode(scan.text, scan.at + choice.length) === 34) {
      scan.at += choice.length + 1;
      return i;
    }
  }
  __HIVE_P3_abort("SUMMARY_REFUSED");
}
function __HIVE_P3_vHashToken(scan) {
  __HIVE_P3_vLiteral(scan, '"');
  for (let i = 0; i < 64; i++) {
    const c = __HIVE_P3_charCode(scan.text, scan.at++);
    if (!(c >= 48 && c <= 57 || c >= 97 && c <= 102)) __HIVE_P3_abort("SUMMARY_REFUSED");
  }
  __HIVE_P3_vLiteral(scan, '"');
}
function __HIVE_P3_vBoolean(scan) {
  if (__HIVE_P3_vEqualAt(scan.text, scan.at, "true")) { scan.at += 4; return; }
  __HIVE_P3_vLiteral(scan, "false");
}
const __HIVE_P3_vKinds = ["IMPORT", "EXPORT", "DYNAMIC_IMPORT", "CALL", "NEW", "MEMBER"];
const __HIVE_P3_vModes = ["SCRIPT", "MODULE"];
const __HIVE_P3_vBindings = ["NONE", "NO_LOCAL_BINDING", "LOCAL_BINDING", "AMBIGUOUS"];
const __HIVE_P3_vLoaders = ["NONE", "STATIC_LITERAL", "DYNAMIC", "BARE_REQUIRE", "EVAL", "FUNCTION", "OTHER", "COMPUTED"];
const __HIVE_P3_vConditions = ["CERTAIN", "CONTROL_OR_DEFERRED", "OPTIONAL"];
const __HIVE_P3_vLedgerKeys = ["baseBytes", "producerParseBytes", "producerWorkBytes", "summaryBytes", "replayReservedBytes", "replayLiveBytes", "scratchBytes", "unreclaimedProducerBytes", "unreclaimedReplayBytes", "totalBytes", "peakBytes", "producerEntries", "producerAttempts", "siteCount"];
function __HIVE_P3_vPreflight(wire) {
  // No substring/token allocation, decode, JSON.parse or hash before this scan.
  if (typeof wire !== "string" || wire.length > 16384) __HIVE_P3_abort("SUMMARY_REFUSED");
  for (let i = 0; i < wire.length; i++) {
    __HIVE_P3_touch();
    const c = __HIVE_P3_charCode(wire, i);
    if (c < 32 || c > 126 || c === 92) __HIVE_P3_abort("SUMMARY_REFUSED");
  }
  // Fixed two-slot scalar cursor is covered by pre-reserved decoder workspace.
  __HIVE_P3_consume("VERIFY_CODEC", 96, 0, 0, "scratchBytes");
  const scan = {__proto__: null, text: wire, at: 0};
  __HIVE_P3_vLiteral(scan, '{"version":1,"purpose":"TIP081_P3_SYNTHETIC_SYNTAX_SUMMARY","mode":');
  __HIVE_P3_vEnum(scan, __HIVE_P3_vModes);
  __HIVE_P3_vLiteral(scan, ',"profile":"P3_ECMA15_FIXED19_COMMON_GRAMMAR","syntheticUtf16Hash":');
  __HIVE_P3_vHashToken(scan);
  __HIVE_P3_vLiteral(scan, ',"utf16Units":'); __HIVE_P3_vUnsigned(scan);
  __HIVE_P3_vLiteral(scan, ',"astOccurrences":'); __HIVE_P3_vUnsigned(scan);
  __HIVE_P3_vLiteral(scan, ',"grammarAttempts":'); __HIVE_P3_vUnsigned(scan);
  __HIVE_P3_vLiteral(scan, ',"sites":[');
  let sites = 0;
  if (__HIVE_P3_charCode(wire, scan.at) !== 93) {
    for (;;) {
      if (++sites > 512) __HIVE_P3_abort("SUMMARY_REFUSED");
      __HIVE_P3_vLiteral(scan, '{"kind":'); __HIVE_P3_vEnum(scan, __HIVE_P3_vKinds);
      __HIVE_P3_vLiteral(scan, ',"start":'); __HIVE_P3_vUnsigned(scan);
      __HIVE_P3_vLiteral(scan, ',"end":'); __HIVE_P3_vUnsigned(scan);
      __HIVE_P3_vLiteral(scan, ',"binding":'); __HIVE_P3_vEnum(scan, __HIVE_P3_vBindings);
      __HIVE_P3_vLiteral(scan, ',"loader":'); __HIVE_P3_vEnum(scan, __HIVE_P3_vLoaders);
      __HIVE_P3_vLiteral(scan, ',"conditional":'); __HIVE_P3_vEnum(scan, __HIVE_P3_vConditions);
      __HIVE_P3_vLiteral(scan, ',"optional":'); __HIVE_P3_vBoolean(scan);
      __HIVE_P3_vLiteral(scan, ',"computed":'); __HIVE_P3_vBoolean(scan);
      __HIVE_P3_vLiteral(scan, ',"status":"OPEN"}');
      if (__HIVE_P3_charCode(wire, scan.at) !== 44) break;
      scan.at++;
    }
  }
  __HIVE_P3_vLiteral(scan, '],"ledger":{');
  for (let i = 0; i < __HIVE_P3_vLedgerKeys.length; i++) {
    if (i) __HIVE_P3_vLiteral(scan, ",");
    __HIVE_P3_vLiteral(scan, '"');
    __HIVE_P3_vLiteral(scan, __HIVE_P3_vLedgerKeys[i]);
    __HIVE_P3_vLiteral(scan, '":'); __HIVE_P3_vUnsigned(scan);
  }
  __HIVE_P3_vLiteral(scan, '},"summaryHash":'); __HIVE_P3_vHashToken(scan);
  __HIVE_P3_vLiteral(scan, "}");
  if (scan.at !== wire.length) __HIVE_P3_abort("SUMMARY_REFUSED");
  // Exact schema has depth4, max14fields, at most512sites/5141 values,
  // and max64 string units. It is stricter than the frozen general decoder caps.
  return sites;
}
function __HIVE_P3_vNodeKeys(type) {
  // Closed child schemas, NOT producer schema reuse. Scalar fields are not AST
  // children. Arrays preserve source order; shorthand aliases count per edge.
  switch (type) {
    case "Program": case "BlockStatement": case "ClassBody": case "StaticBlock": return "body";
    case "ExpressionStatement": return "expression";
    case "WithStatement": return "object,body";
    case "ReturnStatement": case "ThrowStatement": case "UnaryExpression": case "UpdateExpression":
    case "SpreadElement": case "RestElement": case "AwaitExpression": case "YieldExpression": return "argument";
    case "LabeledStatement": return "label,body";
    case "BreakStatement": case "ContinueStatement": return "label";
    case "IfStatement": return "test,consequent,alternate";
    case "SwitchStatement": return "discriminant,cases";
    case "SwitchCase": return "test,consequent";
    case "TryStatement": return "block,handler,finalizer";
    case "CatchClause": return "param,body";
    case "WhileStatement": case "DoWhileStatement": return "test,body";
    case "ForStatement": return "init,test,update,body";
    case "ForInStatement": case "ForOfStatement": return "left,right,body";
    case "FunctionDeclaration": case "FunctionExpression": case "ArrowFunctionExpression": return "id,params,body";
    case "VariableDeclaration": return "declarations";
    case "VariableDeclarator": return "id,init";
    case "ArrayExpression": case "ArrayPattern": return "elements";
    case "ObjectExpression": case "ObjectPattern": return "properties";
    case "Property": case "MethodDefinition": case "PropertyDefinition": return "key,value";
    case "ClassDeclaration": case "ClassExpression": return "id,superClass,body";
    case "SequenceExpression": return "expressions";
    case "BinaryExpression": case "LogicalExpression": case "AssignmentExpression": case "AssignmentPattern": return "left,right";
    case "ConditionalExpression": return "test,consequent,alternate";
    case "NewExpression": case "CallExpression": return "callee,arguments";
    case "MemberExpression": return "object,property";
    case "ChainExpression": return "expression";
    case "TemplateLiteral": return "quasis,expressions";
    case "TaggedTemplateExpression": return "tag,quasi";
    case "MetaProperty": return "meta,property";
    case "ImportDeclaration": return "specifiers,source,attributes";
    case "ImportSpecifier": return "imported,local";
    case "ImportDefaultSpecifier": case "ImportNamespaceSpecifier": return "local";
    case "ImportExpression": return "source,options";
    case "ExportNamedDeclaration": return "declaration,specifiers,source,attributes";
    case "ExportSpecifier": return "local,exported";
    case "ExportDefaultDeclaration": return "declaration";
    case "ExportAllDeclaration": return "exported,source,attributes";
    case "Identifier": case "PrivateIdentifier": case "Literal": case "ThisExpression": case "Super":
    case "TemplateElement": case "EmptyStatement": case "DebuggerStatement": return "";
    default: __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  }
}
function __HIVE_P3_vRead(object, key, meter) {
  if (++meter.reads > 40) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  // The current occurrence's8168 read/key policy was consumed before entry.
  const descriptor = __HIVE_P3_descriptor(object, key);
  if (descriptor === undefined) return undefined;
  __HIVE_P3_setPrototype(descriptor, null);
  if (descriptor.get !== undefined || descriptor.set !== undefined) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  return descriptor.value;
}
function __HIVE_P3_vBindChild(type, key, inherited) {
  if (type === "VariableDeclarator") return key === "id";
  if (type === "FunctionDeclaration" || type === "FunctionExpression" || type === "ArrowFunctionExpression") return key === "id" || key === "params";
  if (type === "ClassDeclaration" || type === "ClassExpression") return key === "id";
  if (type === "CatchClause") return key === "param";
  if (type === "ImportSpecifier" || type === "ImportDefaultSpecifier" || type === "ImportNamespaceSpecifier") return key === "local";
  if (!inherited) return false;
  if (type === "AssignmentPattern") return key === "left";
  if (type === "Property") return key === "value";
  return type === "ArrayPattern" || type === "ObjectPattern" || type === "RestElement";
}
function __HIVE_P3_vCondition(type, inherited, optional) {
  if (optional || type === "ChainExpression" || inherited === "OPTIONAL") return "OPTIONAL";
  if (inherited === "CONTROL_OR_DEFERRED" || type === "FunctionDeclaration" || type === "FunctionExpression" ||
      type === "ArrowFunctionExpression" || type === "ClassDeclaration" || type === "ClassExpression" ||
      type === "MethodDefinition" || type === "PropertyDefinition" || type === "StaticBlock" ||
      type === "IfStatement" || type === "SwitchStatement" || type === "SwitchCase" || type === "ConditionalExpression" ||
      type === "WhileStatement" || type === "DoWhileStatement" || type === "ForStatement" || type === "ForInStatement" ||
      type === "ForOfStatement" || type === "LogicalExpression" || type === "TryStatement" || type === "CatchClause") return "CONTROL_OR_DEFERRED";
  return "CERTAIN";
}
function __HIVE_P3_vRemember(names, name, counts) {
  if (typeof name !== "string") __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  for (let i = 0; i < counts.bindings; i++) {
    __HIVE_P3_touch();
    if (names[i] === name) return;
  }
  if (counts.bindings === 512 || name.length > 65536 - counts.nameUnits) __HIVE_P3_abort("VERIFY_RESOURCE_REFUSED");
  // Fixed name512 headers+65536 UTF16 units and list backing consumed upfront.
  __HIVE_P3_consume("VERIFY_WORK", 0, 1, 0, "replayLiveBytes");
  names[counts.bindings++] = __HIVE_P3_sliceAscii(name, 0, name.length);
  counts.nameUnits += name.length;
}
function __HIVE_P3_vBinding(names, counts, name) {
  if (typeof name !== "string") return "NONE";
  for (let i = 0; i < counts.bindings; i++) {
    __HIVE_P3_touch();
    if (names[i] === name) return "AMBIGUOUS";
  }
  return "NO_LOCAL_BINDING";
}
function __HIVE_P3_vSite(node, type, inherited, names, counts, meter) {
  let kind = "", loader = "NONE", binding = "NONE";
  let optional = __HIVE_P3_vRead(node, "optional", meter) === true;
  let computed = __HIVE_P3_vRead(node, "computed", meter) === true;
  if (type === "ImportDeclaration") kind = "IMPORT";
  else if (type === "ExportNamedDeclaration" || type === "ExportDefaultDeclaration" || type === "ExportAllDeclaration") kind = "EXPORT";
  else if (type === "ImportExpression") kind = "DYNAMIC_IMPORT";
  else if (type === "CallExpression") kind = "CALL";
  else if (type === "NewExpression") kind = "NEW";
  else if (type === "MemberExpression") kind = "MEMBER";
  else return null;
  if (kind === "IMPORT" || kind === "EXPORT" || kind === "DYNAMIC_IMPORT") {
    const source = __HIVE_P3_vRead(node, "source", meter);
    if (source && __HIVE_P3_vRead(source, "type", meter) === "Literal" && typeof __HIVE_P3_vRead(source, "value", meter) === "string") loader = "STATIC_LITERAL";
    else if (kind === "DYNAMIC_IMPORT") loader = "DYNAMIC";
  } else {
    const target = __HIVE_P3_vRead(node, kind === "MEMBER" ? "object" : "callee", meter);
    const targetType = target && __HIVE_P3_vRead(target, "type", meter);
    if (targetType === "Identifier") {
      const name = __HIVE_P3_vRead(target, "name", meter);
      binding = __HIVE_P3_vBinding(names, counts, name);
      loader = kind === "MEMBER" ? "OTHER" : name === "require" ? "BARE_REQUIRE" : name === "eval" ? "EVAL" : name === "Function" ? "FUNCTION" : "OTHER";
    } else loader = "OTHER";
    if (kind !== "MEMBER" && targetType === "MemberExpression") computed = computed || __HIVE_P3_vRead(target, "computed", meter) === true;
    if (computed) loader = "COMPUTED";
  }
  const start = __HIVE_P3_vRead(node, "start", meter), end = __HIVE_P3_vRead(node, "end", meter);
  if (!__HIVE_P3_vU(start) || !__HIVE_P3_vU(end) || start > end || end > __HIVE_P3_currentOwner().text.length) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  if (counts.sites === 512) __HIVE_P3_abort("VERIFY_RESOURCE_REFUSED");
  // Site512 storage was charged before traversal; consume memberships at use.
  __HIVE_P3_consume("VERIFY_WORK", 0, 2, 0, "replayLiveBytes");
  return {__proto__: null, kind, start, end, binding, loader,
    conditional: __HIVE_P3_vCondition(type, inherited, optional), optional, computed, status: "OPEN"};
}
function __HIVE_P3_vU(n) {
  return typeof n === "number" && n >= 0 && n <= 9007199254740991 && __HIVE_P3_floor(n) === n && (n !== 0 || 1 / n === Infinity);
}
function __HIVE_P3_vGuardChild(parentIndex) {
  __HIVE_P3_touch();
  if (!__HIVE_P3_vU(parentIndex) || parentIndex > 127)
    __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  if (parentIndex === 127) __HIVE_P3_abort("DEPTH_REFUSED");
  return true;
}
function __HIVE_P3_vWalk(ast) {
  __HIVE_P3_consume("VERIFY_WORK", 304440, 256, 0, "replayLiveBytes");
  const frames = new __HIVE_P3_Array(128), names = new __HIVE_P3_Array(512), sites = new __HIVE_P3_Array(512);
  __HIVE_P3_setPrototype(frames, null); __HIVE_P3_setPrototype(names, null); __HIVE_P3_setPrototype(sites, null);
  for (let i = 0; i < 128; i++) frames[i] = {__proto__: null, node: null, type: "", keys: "", keyAt: 0,
    array: null, arrayAt: 0, arrayEnd: 0, binding: false, inherited: "CERTAIN", childCondition: "CERTAIN",
    entered: false, reads: 0, childBinding: false, reserved1: 0, reserved2: 0, reserved3: 0};
  __HIVE_P3_consume("VERIFY_WORK", 160, 1, 0, "replayLiveBytes");
  const counts = {__proto__: null, bindings: 0, nameUnits: 0, sites: 0, nodes: 0, arrays: 0, visits: 0};
  const owner = __HIVE_P3_currentOwner();
  owner.replayFrames = frames; owner.replayBindings = names;
  let firstNodes = 0, firstArrays = 0;
  for (let pass = 0; pass < 2; pass++) {
    let top = 0;
    frames[0].node = ast; frames[0].entered = false; frames[0].binding = false; frames[0].inherited = "CERTAIN";
    counts.nodes = 0; counts.arrays = 0;
    while (top >= 0) {
      __HIVE_P3_touch();
      const frame = frames[top], node = frame.node;
      if (!frame.entered) {
        if (++counts.visits > 200000) __HIVE_P3_abort("VERIFY_RESOURCE_REFUSED");
        __HIVE_P3_consume("VERIFY_WORK", 8168, 33, 0, "replayLiveBytes");
        frame.reads = 0;
        const type = __HIVE_P3_vRead(node, "type", frame);
        if (typeof type !== "string") __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
        frame.type = type; frame.keys = __HIVE_P3_vNodeKeys(type); frame.keyAt = 0;
        frame.array = null; frame.arrayAt = 0; frame.arrayEnd = 0; frame.entered = true;
        counts.nodes++;
        frame.childCondition = __HIVE_P3_vCondition(type, frame.inherited, __HIVE_P3_vRead(node, "optional", frame) === true);
        if (pass === 0 && frame.binding && type === "Identifier") __HIVE_P3_vRemember(names, __HIVE_P3_vRead(node, "name", frame), counts);
        if (pass === 1) {
          const site = __HIVE_P3_vSite(node, type, frame.inherited, names, counts, frame);
          if (site !== null) sites[counts.sites++] = site;
        }
      }
      let child = null;
      if (frame.array !== null && frame.arrayAt < frame.arrayEnd) {
        __HIVE_P3_consume("VERIFY_WORK", 240, 1, 0, "replayLiveBytes");
        const indexKey = __HIVE_P2_String(frame.arrayAt++);
        const descriptor = __HIVE_P3_descriptor(frame.array, indexKey);
        counts.arrays++;
        if (descriptor !== undefined) {
          __HIVE_P3_setPrototype(descriptor, null);
          if (descriptor.get !== undefined || descriptor.set !== undefined) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
          child = descriptor.value;
        }
      } else if (frame.keyAt < frame.keys.length) {
        const start = frame.keyAt;
        while (frame.keyAt < frame.keys.length && __HIVE_P3_charCode(frame.keys, frame.keyAt) !== 44) frame.keyAt++;
        const key = __HIVE_P3_sliceAscii(frame.keys, start, frame.keyAt);
        if (frame.keyAt < frame.keys.length) frame.keyAt++;
        frame.childBinding = __HIVE_P3_vBindChild(frame.type, key, frame.binding);
        child = __HIVE_P3_vRead(node, key, frame);
        if (__HIVE_P3_isArray(child)) {
          frame.array = child; frame.arrayAt = 0;
          const length = __HIVE_P3_vRead(child, "length", frame);
          if (!__HIVE_P3_vU(length) || length > 200000) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
          frame.arrayEnd = length; child = null;
        } else frame.array = null;
      } else {
        frame.node = null; frame.array = null; top--; continue;
      }
      if (child === null || child === undefined) continue;
      if (typeof child !== "object" || __HIVE_P3_isArray(child)) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
      for (let i = 0; i <= top; i++) if (frames[i].node === child) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
      __HIVE_P3_vGuardChild(top);
      const next = frames[++top]; next.node = child; next.entered = false;
      next.binding = frame.childBinding; next.inherited = frame.childCondition;
    }
    if (pass === 0) { firstNodes = counts.nodes; firstArrays = counts.arrays; }
    else if (counts.nodes !== firstNodes || counts.arrays !== firstArrays) __HIVE_P3_abort("REPLAY_MISMATCH");
  }
  // Stable insertion ordering; equal tuple occurrences retain traversal order.
  for (let i = 1; i < counts.sites; i++) {
    const value = sites[i]; let j = i;
    while (j > 0 && __HIVE_P3_vAfter(sites[j - 1], value)) {
      __HIVE_P3_touch(); sites[j] = sites[j - 1]; j--;
    }
    sites[j] = value;
  }
  for (let i = 0; i < 128; i++) { frames[i].node = null; frames[i].array = null; }
  owner.replayFrames = null; owner.replayBindings = null;
  __HIVE_P3_consume("VERIFY_WORK", 144, 1, 0, "replayLiveBytes");
  return {__proto__: null, sites, siteCount: counts.sites, astOccurrences: counts.nodes,
    arraySlots: counts.arrays, bindings: counts.bindings};
}
function __HIVE_P3_vAfter(a, b) {
  if (a.start !== b.start) return a.start > b.start;
  if (a.end !== b.end) return a.end > b.end;
  let x = 0, y = 0;
  while (__HIVE_P3_vKinds[x] !== a.kind) x++;
  while (__HIVE_P3_vKinds[y] !== b.kind) y++;
  return x > y;
}
const __HIVE_P3_vRootKeys = ["version", "purpose", "mode", "profile", "syntheticUtf16Hash", "utf16Units", "astOccurrences", "grammarAttempts", "sites", "ledger", "summaryHash"];
const __HIVE_P3_vSiteKeys = ["kind", "start", "end", "binding", "loader", "conditional", "optional", "computed", "status"];
function __HIVE_P3_vDecodedOwn(object, key) {
  // Entire5150*(128+16) envelope and512*96 numeric-key conversion
  // envelope were consumed before JSON.parse.
  const normalizedKey = typeof key === "number" ? __HIVE_P2_String(key) : key;
  const d = __HIVE_P3_descriptor(object, normalizedKey);
  if (d === undefined) __HIVE_P3_abort("SUMMARY_REFUSED");
  __HIVE_P3_setPrototype(d, null);
  if (d.get !== undefined || d.set !== undefined) __HIVE_P3_abort("SUMMARY_REFUSED");
  return d.value;
}
function __HIVE_P3_vDecode(wire, siteCount) {
  // Native decoded records/value slots2621440, index backing65640, strings32768,
  // descriptors5150*144=741600, object/array sanitization8240, numeric-key
  // native key conversions512*96=49152, fixed duplicate/cursor scratch32768:
  // total3551608 bytes. This replaces the insufficient3072 payload-only row.
  // The exact preflight already rejects duplicate keys and all extensions.
  // Exact preflight determines the actual value/slot envelope before decode:
  //25 root/ledger fields, ten per site (ninefields+array slot), three containers.
  const memberships = 28 + siteCount * 10;
  if (memberships > 8192) __HIVE_P3_abort("SUMMARY_REFUSED");
  __HIVE_P3_consume("VERIFY_CODEC", 3551608, memberships, 0, "scratchBytes");
  const result = __HIVE_P3_JSONParse(wire);
  __HIVE_P3_setPrototype(result, null);
  for (let i = 0; i < __HIVE_P3_vRootKeys.length; i++) __HIVE_P3_vDecodedOwn(result, __HIVE_P3_vRootKeys[i]);
  const sites = __HIVE_P3_vDecodedOwn(result, "sites"), ledger = __HIVE_P3_vDecodedOwn(result, "ledger");
  __HIVE_P3_setPrototype(sites, null); __HIVE_P3_setPrototype(ledger, null);
  for (let i = 0; i < __HIVE_P3_vLedgerKeys.length; i++) __HIVE_P3_vDecodedOwn(ledger, __HIVE_P3_vLedgerKeys[i]);
  for (let i = 0; i < siteCount; i++) {
    __HIVE_P3_touch();
    const item = __HIVE_P3_vDecodedOwn(sites, i);
    __HIVE_P3_setPrototype(item, null);
    for (let j = 0; j < __HIVE_P3_vSiteKeys.length; j++) __HIVE_P3_vDecodedOwn(item, __HIVE_P3_vSiteKeys[j]);
  }
  return result;
}
const __HIVE_P3_vShaConstants = [
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
  0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
  0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
  0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
];
function __HIVE_P3_vShaBlock(state, words, bytes) {
  for (let i = 0; i < 16; i++) {
    const j = i * 4;
    words[i] = (bytes[j] << 24 | bytes[j+1] << 16 | bytes[j+2] << 8 | bytes[j+3]) >>> 0;
  }
  for (let i = 16; i < 64; i++) {
    const x = words[i-15], y = words[i-2];
    const a = (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ x >>> 3;
    const b = (y >>> 17 | y << 15) ^ (y >>> 19 | y << 13) ^ y >>> 10;
    words[i] = (words[i-16] + a + words[i-7] + b) >>> 0;
  }
  let a = state[0], b = state[1], c = state[2], d = state[3],
    e = state[4], f = state[5], g = state[6], h = state[7];
  for (let i = 0; i < 64; i++) {
    __HIVE_P3_touch();
    const sigma1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
    const choose = e & f ^ ~e & g;
    const t1 = (h + sigma1 + choose + __HIVE_P3_vShaConstants[i] + words[i]) >>> 0;
    const sigma0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
    const majority = a & b ^ a & c ^ b & c;
    const t2 = (sigma0 + majority) >>> 0;
    h = g; g = f; f = e; e = (d + t1) >>> 0;
    d = c; c = b; b = a; a = (t1 + t2) >>> 0;
  }
  state[0]=(state[0]+a)>>>0; state[1]=(state[1]+b)>>>0;
  state[2]=(state[2]+c)>>>0; state[3]=(state[3]+d)>>>0;
  state[4]=(state[4]+e)>>>0; state[5]=(state[5]+f)>>>0;
  state[6]=(state[6]+g)>>>0; state[7]=(state[7]+h)>>>0;
}
function __HIVE_P3_vSha256(text, utf16) {
  // Pure numeric SHA-256. Private text is NEVER passed to native hash methods.
  //4096 named workspace covers state8*4, words64*4, block64 and their headers;
  //hex backing64+header64/string160 and safe view48 are separate.
  __HIVE_P3_consume("VERIFY_CODEC", 4096 + 64 + 64 + 160 + 48, 0, 0, "scratchBytes");
  const state = new __HIVE_P3_Uint32Array(8), words = new __HIVE_P3_Uint32Array(64), bytes = new __HIVE_P3_Uint8Array(64);
  state[0]=0x6a09e667; state[1]=0xbb67ae85; state[2]=0x3c6ef372; state[3]=0xa54ff53a;
  state[4]=0x510e527f; state[5]=0x9b05688c; state[6]=0x1f83d9ab; state[7]=0x5be0cd19;
  const length = text.length * (utf16 ? 2 : 1);
  if (!__HIVE_P3_vU(length) || length > 2147483647) __HIVE_P3_abort("VERIFY_RESOURCE_REFUSED");
  const blocks = __HIVE_P3_floor((length + 9 + 63) / 64);
  // The low/high length fields are defined explicitly, not truncated to32bits.
  const bitLow = (length * 8) >>> 0, bitHigh = __HIVE_P3_floor(length / 536870912);
  for (let block = 0; block < blocks; block++) {
    __HIVE_P3_touch();
    for (let i = 0; i < 64; i++) {
      const position = block * 64 + i;
      let value = 0;
      if (position < length) {
        const unit = __HIVE_P3_charCode(text, utf16 ? __HIVE_P3_floor(position / 2) : position);
        if (!utf16 && unit > 127) __HIVE_P3_abort("SUMMARY_REFUSED");
        value = utf16 && position % 2 ? unit >>> 8 : unit & 255;
      } else if (position === length) value = 128;
      else if (block === blocks - 1 && i >= 56) {
        value = i < 60 ? bitHigh >>> ((59-i)*8) & 255 : bitLow >>> ((63-i)*8) & 255;
      }
      bytes[i] = value;
    }
    __HIVE_P3_vShaBlock(state, words, bytes);
  }
  const hex = new __HIVE_P3_Uint8Array(64), digits = "0123456789abcdef";
  for (let i = 0; i < 32; i++) {
    const value = state[__HIVE_P3_floor(i/4)] >>> ((3-i%4)*8) & 255;
    hex[i*2]=__HIVE_P3_charCode(digits,value>>>4); hex[i*2+1]=__HIVE_P3_charCode(digits,value&15);
  }
  return __HIVE_P3_decodeAscii(__HIVE_P3_u8View(hex, 0, 64));
}
function __HIVE_P3_vIdentity(text) { return __HIVE_P3_vSha256(text, true); }
function __HIVE_P3_vPut(out, literal) {
  if (literal.length > 16384 - out.used) __HIVE_P3_abort("SUMMARY_REFUSED");
  for (let i = 0; i < literal.length; i++) {
    __HIVE_P3_touch(); const c = __HIVE_P3_charCode(literal, i);
    if (c > 127) __HIVE_P3_abort("SUMMARY_REFUSED");
    out.bytes[out.used++] = c;
  }
}
function __HIVE_P3_vPutU(out, value) {
  if (!__HIVE_P3_vU(value)) __HIVE_P3_abort("REPLAY_MISMATCH");
  let divisor = 1;
  while (__HIVE_P3_floor(value / divisor) >= 10) divisor *= 10;
  for (;;) {
    __HIVE_P3_touch();
    if (out.used === 16384) __HIVE_P3_abort("SUMMARY_REFUSED");
    const digit = __HIVE_P3_floor(value / divisor);
    out.bytes[out.used++] = 48 + digit;
    value -= digit * divisor;
    if (divisor === 1) break;
    divisor /= 10;
  }
}
function __HIVE_P3_vPutString(out, text) {
  __HIVE_P3_vPut(out, '"'); __HIVE_P3_vPut(out, text); __HIVE_P3_vPut(out, '"');
}
function __HIVE_P3_vBody(data) {
  // One fixed ASCII backing, one cursor object, decoded final string and view.
  __HIVE_P3_consume("VERIFY_CODEC", 16384 + 64 + 96 + 32800 + 48, 0, 0, "scratchBytes");
  const out = {__proto__: null, bytes: new __HIVE_P3_Uint8Array(16384), used: 0};
  __HIVE_P3_vPut(out, '{"version":1,"purpose":"TIP081_P3_SYNTHETIC_SYNTAX_SUMMARY","mode":');
  __HIVE_P3_vPutString(out, data.mode);
  __HIVE_P3_vPut(out, ',"profile":"P3_ECMA15_FIXED19_COMMON_GRAMMAR","syntheticUtf16Hash":');
  __HIVE_P3_vPutString(out, data.syntheticUtf16Hash);
  __HIVE_P3_vPut(out, ',"utf16Units":'); __HIVE_P3_vPutU(out, data.utf16Units);
  __HIVE_P3_vPut(out, ',"astOccurrences":'); __HIVE_P3_vPutU(out, data.astOccurrences);
  __HIVE_P3_vPut(out, ',"grammarAttempts":'); __HIVE_P3_vPutU(out, data.grammarAttempts);
  __HIVE_P3_vPut(out, ',"sites":[');
  for (let i = 0; i < data.siteCount; i++) {
    const s = data.sites[i];
    if (i) __HIVE_P3_vPut(out, ",");
    __HIVE_P3_vPut(out, '{"kind":'); __HIVE_P3_vPutString(out, s.kind);
    __HIVE_P3_vPut(out, ',"start":'); __HIVE_P3_vPutU(out, s.start);
    __HIVE_P3_vPut(out, ',"end":'); __HIVE_P3_vPutU(out, s.end);
    __HIVE_P3_vPut(out, ',"binding":'); __HIVE_P3_vPutString(out, s.binding);
    __HIVE_P3_vPut(out, ',"loader":'); __HIVE_P3_vPutString(out, s.loader);
    __HIVE_P3_vPut(out, ',"conditional":'); __HIVE_P3_vPutString(out, s.conditional);
    __HIVE_P3_vPut(out, ',"optional":'); __HIVE_P3_vPut(out, s.optional ? "true" : "false");
    __HIVE_P3_vPut(out, ',"computed":'); __HIVE_P3_vPut(out, s.computed ? "true" : "false");
    __HIVE_P3_vPut(out, ',"status":"OPEN"}');
  }
  __HIVE_P3_vPut(out, '],"ledger":{');
  for (let i = 0; i < __HIVE_P3_vLedgerKeys.length; i++) {
    if (i) __HIVE_P3_vPut(out, ",");
    const key = __HIVE_P3_vLedgerKeys[i];
    __HIVE_P3_vPutString(out, key); __HIVE_P3_vPut(out, ":"); __HIVE_P3_vPutU(out, data.ledger[key]);
  }
  __HIVE_P3_vPut(out, "}}");
  return __HIVE_P3_decodeAscii(__HIVE_P3_u8View(out.bytes, 0, out.used));
}
function __HIVE_P3_vSeal(body) {
  return __HIVE_P3_vSha256(body, false);
}
function __HIVE_P3_vAdd(a, b) {
  if (!__HIVE_P3_vU(a) || !__HIVE_P3_vU(b) || b > 9007199254740991 - a) __HIVE_P3_abort("REPLAY_MISMATCH");
  return a + b;
}
function __HIVE_P3_vMul(a, b) {
  if (!__HIVE_P3_vU(a) || !__HIVE_P3_vU(b) || a !== 0 && b > 9007199254740991 / a) __HIVE_P3_abort("REPLAY_MISMATCH");
  const product = a * b;
  if (!__HIVE_P3_vU(product)) __HIVE_P3_abort("REPLAY_MISMATCH");
  return product;
}
function __HIVE_P3_vLedger(state, parsed, extracted) {
  const initial = state.initialCategories;
  if (!initial || !__HIVE_P3_vU(initial.baseBytes) || initial.producerWorkBytes !== 304440 ||
      initial.summaryBytes !== 0 || initial.replayReservedBytes !== 25165824 ||
      initial.replayLiveBytes !== 0 || initial.scratchBytes !== 6758296 || initial.initialEntries !== 257) __HIVE_P3_abort("REPLAY_MISMATCH");
  if (!__HIVE_P3_vU(parsed.parseBytes) || !__HIVE_P3_vU(parsed.parseEntries) || !__HIVE_P3_vU(parsed.parseAttempts)) __HIVE_P3_abort("REPLAY_MISMATCH");
  // Independent literal historical model, not producer totals or our own work.
  const work = __HIVE_P3_vAdd(304440, __HIVE_P3_vAdd(__HIVE_P3_vMul(16336, extracted.astOccurrences), __HIVE_P3_vMul(480, extracted.arraySlots)));
  const entries = __HIVE_P3_vAdd(257, __HIVE_P3_vAdd(parsed.parseEntries,
    __HIVE_P3_vAdd(__HIVE_P3_vMul(66, extracted.astOccurrences),
      __HIVE_P3_vAdd(__HIVE_P3_vMul(2, extracted.arraySlots),
        __HIVE_P3_vAdd(__HIVE_P3_vMul(2, extracted.siteCount), extracted.bindings)))));
  const emissions = state.producerMetadataEmissions;
  if (!__HIVE_P3_vU(emissions) || emissions > 32) __HIVE_P3_abort("REPLAY_MISMATCH");
  // Authenticated historical output-count, captured at summary construction;
  // later observations do not change this producer-stage snapshot.
  const metadataBytes = __HIVE_P3_vMul(12864, emissions);
  const summaryBytes = __HIVE_P3_vAdd(90656, metadataBytes);
  const scratchBytes = 6667640 - metadataBytes;
  let total = initial.baseBytes;
  total = __HIVE_P3_vAdd(total, parsed.parseBytes);
  total = __HIVE_P3_vAdd(total, work);
  total = __HIVE_P3_vAdd(total, summaryBytes);
  total = __HIVE_P3_vAdd(total, 25165824);
  total = __HIVE_P3_vAdd(total, scratchBytes);
  if (total > state.limit || entries > 20000) __HIVE_P3_abort("REPLAY_MISMATCH");
  __HIVE_P3_consume("VERIFY_CODEC", 288, 1, 0, "scratchBytes");
  return {__proto__: null, baseBytes: initial.baseBytes, producerParseBytes: parsed.parseBytes,
    producerWorkBytes: work, summaryBytes, replayReservedBytes: 25165824,
    replayLiveBytes: 0, scratchBytes, unreclaimedProducerBytes: 0,
    unreclaimedReplayBytes: 0, totalBytes: total, peakBytes: total,
    producerEntries: entries, producerAttempts: parsed.parseAttempts, siteCount: extracted.siteCount};
}
function __HIVE_P3_vCompare(decoded, parsed, extracted, expectedLedger, identity, state) {
  if (decoded.mode !== state.profile || decoded.syntheticUtf16Hash !== identity ||
      decoded.utf16Units !== state.text.length || decoded.astOccurrences !== extracted.astOccurrences ||
      decoded.grammarAttempts !== parsed.parseAttempts || decoded.sites.length !== extracted.siteCount) __HIVE_P3_abort("REPLAY_MISMATCH");
  for (let i = 0; i < extracted.siteCount; i++) {
    __HIVE_P3_touch();
    const a = decoded.sites[i], b = extracted.sites[i];
    for (let j = 0; j < __HIVE_P3_vSiteKeys.length; j++) {
      const key = __HIVE_P3_vSiteKeys[j];
      if (a[key] !== b[key]) __HIVE_P3_abort("REPLAY_MISMATCH");
    }
    if (a.start > a.end || a.end > state.text.length) __HIVE_P3_abort("REPLAY_MISMATCH");
  }
  for (let i = 0; i < __HIVE_P3_vLedgerKeys.length; i++) {
    const key = __HIVE_P3_vLedgerKeys[i];
    if (decoded.ledger[key] !== expectedLedger[key]) __HIVE_P3_abort("REPLAY_MISMATCH");
  }
}
function __HIVE_P3_verifyWire(wire) {
  // Public owner entry authenticates handle, original TTL, phase and all aliases
  // before this private routine. No input source/function/parser is accepted.
  const state = __HIVE_P3_currentOwner();
  const count = __HIVE_P3_vPreflight(wire);
  const decoded = __HIVE_P3_vDecode(wire, count);
  let parsed = null, extracted = null;
  try {
    parsed = __HIVE_P3_replayStart();
    extracted = __HIVE_P3_vWalk(parsed.ast);
    const identity = __HIVE_P3_vIdentity(state.text);
    const ledger = __HIVE_P3_vLedger(state, parsed, extracted);
    __HIVE_P3_vCompare(decoded, parsed, extracted, ledger, identity, state);
    __HIVE_P3_consume("VERIFY_CODEC", 192, 1, 0, "scratchBytes");
    const expected = {__proto__: null, mode: state.profile, syntheticUtf16Hash: identity,
      utf16Units: state.text.length, astOccurrences: extracted.astOccurrences,
      grammarAttempts: parsed.parseAttempts, sites: extracted.sites,
      siteCount: extracted.siteCount, ledger};
    const body = __HIVE_P3_vBody(expected), seal = __HIVE_P3_vSeal(body);
    if (seal !== decoded.summaryHash) __HIVE_P3_abort("REPLAY_MISMATCH");
    // Complete canonical preflight + identical field values + independent body
    // seal establish the exact incoming wire, not a producer helper/hash vote.
    parsed.ast = null;
    for (let i = 0; i < extracted.siteCount; i++) extracted.sites[i] = null;
    extracted = null;
    __HIVE_P3_replayRetire();
    return true;
  } finally {
    // Clear lexical aliases even when native decode/hash/cap/deadline fails.
    if (parsed !== null) parsed.ast = null;
    if (extracted !== null) {
      for (let i = 0; i < extracted.siteCount; i++) extracted.sites[i] = null;
    }
    parsed = null; extracted = null;
    // Owner finally is authoritative on refusal; successful retirement above
    // already disposed replay roots before VERIFIED metadata can be published.
  }
}
`;
