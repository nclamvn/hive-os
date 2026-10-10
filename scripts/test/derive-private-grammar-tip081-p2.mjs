// Offline fixed-input derivation only. Main must review this tool before running it.
// TypeScript parses pinned TOOL SOURCE as text; installed Acorn is never imported.
import ts from "typescript";
import {openSync, fstatSync, readSync, closeSync, constants as fsConstants} from "node:fs";
import {createHash} from "node:crypto";
import {SCALAR_GRAMMAR_BODIES, SCALAR_GRAMMAR_HELPERS,
  SCALAR_GRAMMAR_PARAMETER_NAMES} from "./scalar-grammar-bodies-tip081-p2.mjs";

const PIN = "3c141146168735659c30b29c925fbf9fdf4d12ad85eb83d68e2afb26a1cc248d";
const PACKAGE_PIN = "aa6eff9593179bc7379017992eda314ce97bd7c6576869d82d514139ce612cca";
const PREFIX = "__HIVE_P2_";
const SOURCE_PATH = "/Users/os/hiveos/node_modules/next/dist/compiled/acorn/acorn.js";
const PACKAGE_PATH = "/Users/os/hiveos/node_modules/next/dist/compiled/acorn/package.json";
const RUNTIME_PATH = "/Users/os/hiveos/scripts/test/private-grammar-runtime-tip081-p2.mjs";
const f = ts.factory;
function digest(bytes) { return createHash("sha256").update(bytes).digest("hex"); }
function boundedToolRead(path, exact, maximum) {
  const fd = openSync(path, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW);
  try {
    const before = fstatSync(fd);
    if (!before.isFile() || !Number.isSafeInteger(before.size) || before.size < 1 ||
        before.size > maximum || exact !== null && before.size !== exact) throw new Error("FIXED_TOOL_SIZE_DRIFT");
    // Tool input allocation occurs only AFTER same-FD regular-file/size admission.
    const bytes = Buffer.alloc(before.size);
    let offset = 0;
    while (offset < bytes.length) {
      const read = readSync(fd, bytes, offset, Math.min(32768, bytes.length - offset), offset);
      if (read === 0) throw new Error("FIXED_TOOL_SHORT_READ");
      offset += read;
    }
    const probe = Buffer.alloc(1);
    if (readSync(fd, probe, 0, 1, bytes.length) !== 0) throw new Error("FIXED_TOOL_GROWTH_DRIFT");
    const after = fstatSync(fd);
    if (after.dev !== before.dev || after.ino !== before.ino || after.size !== before.size ||
        after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs) throw new Error("FIXED_TOOL_IDENTITY_DRIFT");
    return bytes;
  } finally { closeSync(fd); }
}
function identifier(name) { return f.createIdentifier(PREFIX + name); }
function text(value) { return f.createStringLiteral(value); }
function number(value) {
  if (!Number.isSafeInteger(value) || Object.is(value, -0)) throw new Error("DERIVATION_INTEGER_LITERAL_DRIFT");
  return value < 0 ? f.createPrefixUnaryExpression(ts.SyntaxKind.MinusToken, f.createNumericLiteral(-value)) : f.createNumericLiteral(value);
}
function call(name, args) { return f.createCallExpression(identifier(name), undefined, args); }
function comma(expressions) {
  let result = expressions[0];
  for (let i = 1; i < expressions.length; i++) result = f.createBinaryExpression(result, f.createToken(ts.SyntaxKind.CommaToken), expressions[i]);
  return f.createParenthesizedExpression(result);
}
function functionNode(node) {
  return ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) || ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node);
}
function assignmentOperator(kind) {
  return kind >= ts.SyntaxKind.FirstAssignment && kind <= ts.SyntaxKind.LastAssignment;
}
function methodName(node) {
  if (ts.isPropertyAccessExpression(node)) return node.name.text;
  if (ts.isElementAccessExpression(node) && node.argumentExpression && ts.isStringLiteral(node.argumentExpression)) return node.argumentExpression.text;
  return null;
}
const CAPTURED_SOURCE_NAMES = new Set(["Object", "Array", "String", "RegExp", "Math", "Number", "parseInt", "parseFloat"]);
const BINARY_COERCIVE = new Set(["+", "-", "*", "/", "%", "**", "|", "&", "^", "<<", ">>", ">>>", "==", "!=", "<", "<=", ">", ">=", "in", "instanceof"]);
// Literal signatures only. Byte counts/native helper arguments must never be
// guessed to be original source IDs (e.g runtime reserve(16) is NOT site16).
const GUARD_SIGNATURES = new Map([
  ["registerFunction", 4], ["reserveFunction", 0], ["reserveObject", 1], ["ownObject", 1],
  ["reserveArray", 1], ["ownArray", 1], ["maximumChildDepth", 2], ["checkArrayDepth", 1],
  ["toolRegex", 1], ["construct", 2], ["invoke", 3], ["syntaxRefusal", 0],
  ["invalidTemplate", 1], ["set", 3], ["binary", 3], ["unary", 2], ["numeric", 1],
  ["increment", 4], ["remove", 2], ["get", 2], ["tick", 0], ["copyKeys", 1],
]);
const GUARD_FAMILIES = new Map([
  ["function/frame", new Set(["reserveFunction", "registerFunction"])],
  ["private-initializer/pre-entry-frame", new Set(["registerFunction", "invoke"])],
  ["object/header/schema", new Set(["reserveObject", "ownObject"])],
  ["array/header/backing", new Set(["reserveArray", "ownArray", "maximumChildDepth", "checkArrayDepth"])],
  ["fixed-regex-descriptor", new Set(["toolRegex"])],
  ["constructor/header/frame", new Set(["construct", "reserveArray", "ownArray"])],
  ["closed-call/pre-entry", new Set(["invoke", "get", "reserveArray", "ownArray"])],
  ["bounded-error/no-diagnostics", new Set(["syntaxRefusal"])],
  ["template-sentinel-or-bounded-error", new Set(["invalidTemplate"])],
  ["schema/compound-write", new Set(["set", "get", "binary"])],
  ["closed-primitive-or-brand-binary", new Set(["binary"])],
  ["closed-primitive-unary", new Set(["unary"])],
  ["closed-primitive-binding-increment", new Set(["numeric"])],
  ["schema-numeric-increment", new Set(["increment"])],
  ["schema-delete/no-refund", new Set(["remove"])],
  ["closed-property-read/getter-call", new Set(["get"])],
  ["loop-clock-checkpoint", new Set(["tick", "copyKeys", "get"])],
  ["replacement-method-schema", new Set(["set"])],
  ["owner-local-empty-ast-list", new Set(["reserveArray", "ownArray", "checkArrayDepth"])],
]);
// Closed normative rule manifest. Fixture references are independent finite
// controls only, not proof that every path/site was executed. All dynamic helper
// allocations add their separately guarded transitive costs; no unknown cost is
// waived by these classes. Physical native/VM/RSS costs remain outside this ledger.
const RULES = Object.freeze({
  "function/frame": {id: "R01", guard: "reserveFunction/registerFunction/frame/invoke",
    cost: "ordinary function192; function metadata176+value metadata224 (one weak membership each); eager ordinary-prototype adoption512=2*(descriptor128+sanitize16)+metadata224 and membership1; pre-entry64+16*(arity+locals+parameters)+192*nested; direct-runtime workspace2*129*sum(exact helper frames)",
    lifetime: "module or active owner at actual function creation/registration; all attempts retained, no first-owner static-prototype adoption or refund", alias: "private callable; implicit prototype80 plus slot16 prepaid exactly once; own data prototype/constructor shape checked; registerNative internal false skips host prototypes; no callback export", fixtures: ["P2G005", "P2G021", "P2G027", "P2G095", "P2G106"]},
  "private-initializer/pre-entry-frame": {id: "R02", guard: "registerFunction/frame/invoke",
    cost: "exact static-site pool/binding/object/function192/weak-header rows; root64+16*actualLocals+192*actualHoisted; runtime workspace itemized once", lifetime: "fixed tool lifetime; reserved before source overlap", alias: "private root namespace only; no public Parser", fixtures: ["P2G001", "P2G099", "P2G104"]},
  "object/header/schema": {id: "R03", guard: "reserveObject/ownObject",
    cost: "64+16*literalProperties BEFORE literal; prototype mutation16; metadata224 and one weak membership; exact literal key pool32+2*units/module", lifetime: "tool or owner monotone; no reclamation credit", alias: "literal property16 contains value reference; null prototype; private object only", fixtures: ["P2G006", "P2G030", "P2G106"]},
  "array/header/backing": {id: "R04", guard: "maximumChildDepth/checkArrayDepth/reserveArray/ownArray",
    cost: "88+8*capacity BEFORE literal/backing; occupied memberships; prototype16+metadata224; growth88+8*(oldCapacity+newCapacity); schema16 separately; structural control allocations separately guarded", lifetime: "old/new backings and abandoned arrays retained logically", alias: "one8-byte backing reference per slot; child depth admitted before attach; CONTROL never AST", fixtures: ["P2G025", "P2G031", "P2G095", "P2G106", "P2G107"]},
  "fixed-regex-descriptor": {id: "R05", guard: "toolRegex/slice/regexDescriptor",
    cost: "source pattern/flags slice64+2*units each; descriptor64+16*4+prototype16+metadata224; raw fixed literal pool prepaid", lifetime: "module or owner; uncached keyword descriptors retire with owner", alias: "fixed scalar tool pattern only; no native RegExp or target pattern compile", fixtures: ["P2G035", "P2G041", "P2G042", "P2G072", "P2G076"]},
  "constructor/header/frame": {id: "R06", guard: "construct/frame/reserve",
    cost: "private frame R01 before Reflect.construct; header80; node1 before actual Node entry; each default/schema cost R09; Array R04; fixed RegExp descriptor R05", lifetime: "every attempted constructor/Node/tentative copy retained logically", alias: "fresh private this; source options/profile internally produced; no returned AST", fixtures: ["P2G004", "P2G025", "P2G027", "P2G087", "P2G095"]},
  "closed-call/pre-entry": {id: "R07", guard: "get/reserveArray/ownArray/invoke/frame/native",
    cost: "argument CONTROL backing R04 before creation; callee frame R01 before call/reentry; descriptor R15; closed native string/array helpers each guard own transitive costs", lifetime: "argument vectors and all frames monotonically debited", alias: "evaluate receiver/callee/arguments exactly once in original order; only registered private callable/native marker", fixtures: ["P2G021", "P2G027", "P2G042", "P2G095", "P2G106"]},
  "bounded-error/no-diagnostics": {id: "R08", guard: "WHOLE syntaxRefusal/refuse/dispose",
    cost: "fixed preloaded singleton; runtime workspace only; removed diagnostic argument work is NOT evaluated", lifetime: "operational failure retires owner and clears text/AST/Parser", alias: "no thrown native/source message/getter/stack export", fixtures: ["P2G064", "P2G070", "P2G091", "P2G093"]},
  "schema/compound-write": {id: "R09", guard: "get/binary/set/linkDepth/defineData",
    cost: "schema16 before every attempt; scalar key conversion96 if numeric; descriptor128 (+sanitize16 if present); data descriptor128; previous descriptor128 (+sanitize16 if present); new dictionary72+2*keyUnits and two memberships; array-first-slot membership; R04 growth; separately guarded pre-link depth control graph", lifetime: "replace/delete/failed attempts never refund; key/schema bounds never decrease", alias: "old value retained during compound RHS; getter/key/receiver evaluated once; data attributes preserved; no inherited setter callback", fixtures: ["P2G004", "P2G061", "P2G087", "P2G106", "P2G107"]},
  "closed-primitive-or-brand-binary": {id: "R10", guard: "binary/primitive/numeric/hasProperty/instance/concat",
    cost: "primitive string conversion32+2*units; primitive spell96; concat64+2*(oldUnits+newUnits) before growth; in/prototype reflection128 per step; no object ToPrimitive/Symbol.hasInstance", lifetime: "pieces/old/new overlap and reflection attempts retained", alias: "primitive or registered private-brand comparison only", fixtures: ["P2G003", "P2G027", "P2G054", "P2G059", "P2G091"]},
  "closed-primitive-unary": {id: "R11", guard: "unary/numeric/primitive",
    cost: "closed primitive conversion; string32+2*units before captured Number; arithmetic scalar result; itemized helper workspace", lifetime: "all conversion attempts debited", alias: "no object coercion or native target BigInt", fixtures: ["P2G061", "P2G077", "P2G098"]},
  "closed-primitive-binding-increment": {id: "R12", guard: "numeric plus precharged frame slots",
    cost: "R11 conversion before scalar old+/-1; fixed local/temporary slots included in exact pre-entry frame R01", lifetime: "frame scalar bookkeeping only, not allocation refund", alias: "old/next retained in private slots; postfix/prefix value order preserved", fixtures: ["P2G011", "P2G053", "P2G061"]},
  "schema-numeric-increment": {id: "R13", guard: "increment/get/numeric/set",
    cost: "R15 read +R11 conversion +R09 write BEFORE mutation; exact scalar delta", lifetime: "read/write attempts monotone", alias: "receiver/key evaluated once; postfix old value returned", fixtures: ["P2G011", "P2G053", "P2G061", "P2G106"]},
  "schema-delete/no-refund": {id: "R14", guard: "remove/primitiveString/captured delete",
    cost: "schema16; primitive numeric key96; no decrement of fields/keyUnits/capacity/entries/bytes", lifetime: "deleted previous payload remains in logical ledger", alias: "private own data only; no caller key coercion", fixtures: ["P2G004", "P2G005", "P2G087", "P2G106"]},
  "closed-property-read/getter-call": {id: "R15", guard: "get/intrinsicProperty/descriptor/invoke",
    cost: "primitive numeric key96; descriptor128 before each lookup +null-prototype16 before optional fields; private getter R07 before entry; ordinary prototype backing and eager512 adoption prepaid R01; monotone minimum constructor key11, no lazy metadata allocation", lifetime: "descriptor attempts and getter frames retained logically; known private prototype only", alias: "never look up arbitrary host prototype getter or adopt native-host/unknown prototype; no descriptor.get inherited callback", fixtures: ["P2G005", "P2G027", "P2G089", "P2G090", "P2G106"]},
  "loop-clock-checkpoint": {id: "R16", guard: "first tick/timed; copyKeys/keys",
    cost: "fixed scalar tick/clock slots in workspace; own-key backing88+8*retainedFieldBound plus32*fields+2*retainedKeyUnits BEFORE Object.keys; metadata/prototype R04", lifetime: "original TTL never renewed; key materialization remains debited", alias: "only exact owned Node copy loop; fresh destination; unchanged source; no enumerable grammar prototype", fixtures: ["P2G025", "P2G050", "P2G052", "P2G097", "P2G105"]},
  "replacement-method-schema": {id: "R17", guard: "set after source-replaced guarded function creation",
    cost: "R01 ordinary function before creation +R09 prototype method schema before install", lifetime: "fixed tool initialization only", alias: "actual source/replacement anchors retained; parameters explicitly renamed; original source nodes immutable", fixtures: ["P2G034", "P2G045", "P2G049", "P2G054", "P2G100"]},
  "template-sentinel-or-bounded-error": {id: "R18", guard: "WHOLE invalidTemplate/get/refuse",
    cost: "R15 private boolean lookup; fixed private sentinel or R08 singleton; diagnostic arguments removed whole", lifetime: "sentinel caught only by private tagged-template fallback; other failure retires", alias: "no public sentinel/text pointer; tagged cooked:null retained", fixtures: ["P2G034", "P2G073"]},
  "fixed-profile-function-replacement": {id: "R19", guard: "exact original region removed; separately mapped FIXED tree",
    cost: "original removed body performs ZERO work; normalized replacement functions/ops use their own total R01-R18 rows", lifetime: "fixed derivation lineage; no dynamic caller-selected replacement", alias: "exact19 internal options only; ASCII-ID/native exclusions; uncached words; code-point helper", fixtures: ["P2G001", "P2G045", "P2G049", "P2G076", "P2G080", "P2G092"]},
  "scalar-body-replacement": {id: "R20", guard: "original whole region removed; separately mapped SCALAR tree",
    cost: "original regex/string/native body performs ZERO work; replacement/shared-helper all effects independently mapped to R01-R18", lifetime: "original anchors and normalized source spans retained", alias: "fixed named parameters; private scanner text/records; no original callback/wrapper execution", fixtures: ["P2G034", "P2G045", "P2G047", "P2G049", "P2G054", "P2G079", "P2G096"]},
  "private-public-iterator-removal": {id: "R21", guard: "entire pinned Symbol.iterator statement removed",
    cost: "ZERO removed allocation/work; no Symbol-key/native iterator is initialized", lifetime: "removed region and descendants bound in original inventory", alias: "no public token iterator", fixtures: ["P2G093", "P2G099", "P2G104"]},
  "private-surface-removal": {id: "R22", guard: "exact namespace/static parse/token/plugin assignment removed",
    cost: "ZERO removed body/export work; private initializer R02 remains", lifetime: "fixed derived module; no public namespace/Parser callback surface", alias: "only four owner APIs and scalar observations; no AST/source getter", fixtures: ["P2G090", "P2G093", "P2G099", "P2G104"]},
  "method-reference/evaluate-receiver-once": {id: "R23", guard: "LOWERED_CHILD inherits exact enclosing R07 site",
    cost: "not an extra allocation; parent R07 accounts get/argument/frame and precharged temporaries", lifetime: "same owned parent debit, not duplicated missing cost", alias: "original member span +ownerSite link; receiver/callee evaluated once", fixtures: ["P2G021", "P2G027", "P2G106"]},
  "member-write-target/evaluate-key-once": {id: "R24", guard: "LOWERED_CHILD inherits exact enclosing R09 site",
    cost: "parent R09, or R17->R09, key/descriptor/schema/oldvalue costs; fixed temp slots R01", lifetime: "same monotone parent ledger", alias: "original target span retained; no key/receiver re-evaluation", fixtures: ["P2G004", "P2G061", "P2G106"]},
  "member-increment-target/evaluate-key-once": {id: "R25", guard: "LOWERED_CHILD inherits exact enclosing R13 site",
    cost: "parent R13 read/convert/write; no duplicated allocation credit", lifetime: "same monotone parent ledger", alias: "exact member occurrence links to increment guard", fixtures: ["P2G061", "P2G106"]},
  "member-delete-target/evaluate-key-once": {id: "R26", guard: "LOWERED_CHILD inherits exact enclosing R14 site",
    cost: "parent R14 schema/key debit; no refund", lifetime: "same retained parent attempt", alias: "exact member occurrence links to delete guard", fixtures: ["P2G004", "P2G087", "P2G106"]},
  "fixed-frame-local-write": {id: "R27", guard: "exact containing pre-entry frame; fixed local/temp slot only",
    cost: "scalar/reference local slot16 prepaid in R01 actualLocals; RHS allocations separately mapped; not object schema R09", lifetime: "frame/bookkeeping slot precharged; does not refund RHS allocations", alias: "identifier binding only; no computed/member assignment; enclosing ownerSite required", fixtures: ["P2G021", "P2G027", "P2G061"]},
  "runtime-control-and-metadata": {id: "R28", guard: "reserve/meta/registerFunction/timed/dispose",
    cost: "value metadata8fields192+Weakrow32=224; Fn metadata5fields144+Weakrow32=176; row membership1 each; eager own ordinary prototype2*(128+16)+224=512 and membership1 at registration; registerNative explicitly skips; scalar-control updates prepaid; source state16fields320+handle2fields96+ownerrow32+sourceHeader32=480", lifetime: "tool or owner at creation; no later owner pays permanent private-constructor metadata; no source/Parser/AST retained after retirement; immutable captures +original deadline", alias: "private weak brands, no all-node mirror; internal adoption boolean never public; unknown own prototype/constructor shape refuses; control scalar fields precharged, no callback/issuer/export", fixtures: ["P2G005", "P2G087", "P2G089", "P2G090", "P2G093", "P2G097", "P2G105"]},
  "runtime-derived-string": {id: "R29", guard: "primitiveString/slice/concat/codePoint/number",
    cost: "scalar numeric key/String spell96; slice64+2*units; concat64+2*(oldUnits+newUnits); codepoint34/36; Number parse32+2*spellingUnits <=1024; native-to-property-key normalized once", lifetime: "all pieces/overlap/native conversion attempts retained; no reclamation credit", alias: "primitive only; captured intrinsics; target BigInt/RegExp conversion excluded before native work", fixtures: ["P2G034", "P2G049", "P2G054", "P2G056", "P2G077", "P2G096", "P2G098"]},
  "runtime-structural-link": {id: "R30", guard: "maximumChildDepth/checkArrayDepth/linkDepth/depthItem/push/set",
    cost: "Node+1/list+0 depth <=128 before attach; work/reverse CONTROL arrays R04; each work-item object2fields96+prototype16+metadata224; every append R09; alias parents retained; attempted memberships monotone", lifetime: "historical reverse edges retained; may conservatively refuse earlier, never refund/delete to earn capacity", alias: "CONTROL does not track its own AST edges; accumulated ancestors; cycles checked even at equal list-depth before link", fixtures: ["P2G025", "P2G027", "P2G095", "P2G107"]},
  "owner-local-empty-ast-list": {id: "R31", guard: "checkArrayDepth/reserveArray/ownArray before enclosing set/linkDepth",
    cost: "fresh empty ARRAY: backing88+prototype16+metadata224 and weak membership1 before AST attach; enclosing schema R09 and reverse-edge R30 separately guarded", lifetime: "each owner gets its own empty AST list; no module-rooted reverse parent edge or cross-owner retention; no refund", alias: "only pinned ce->NewExpression.arguments and te->ImportDeclaration.specifiers reads; empty-list contents preserved, private list identity intentionally no longer shared", fixtures: ["P2G108", "P2G109", "P2G093"]},
});
const RULE_DEPENDENCIES = Object.freeze({
  R01: ["R28"], R02: ["R01", "R03", "R04", "R05", "R07", "R09", "R15", "R28"],
  R03: ["R28"], R04: ["R09", "R28", "R30"], R05: ["R03", "R28", "R29"],
  R06: ["R01", "R04", "R05", "R09", "R28"], R07: ["R01", "R04", "R15", "R28", "R29"],
  R08: ["R28"], R09: ["R04", "R10", "R15", "R28", "R29", "R30"],
  R10: ["R15", "R28", "R29"], R11: ["R28", "R29"], R12: ["R01", "R11"],
  R13: ["R09", "R11", "R15"], R14: ["R28", "R29"], R15: ["R07", "R28", "R29"],
  R16: ["R04", "R28", "R29"], R17: ["R01", "R09"], R18: ["R08", "R15", "R28"],
  R19: ["R01", "R07", "R28", "R29"], R20: ["R01", "R07", "R28", "R29"],
  R21: [], R22: ["R02"], R23: ["R07"], R24: ["R09"], R25: ["R13"], R26: ["R14"],
  R27: ["R01"], R28: [], R29: ["R28"], R30: ["R03", "R04", "R09", "R28"],
  R31: ["R04", "R09", "R28", "R30"],
});
function member(node) {
  return ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node);
}
function propertyName(node, visit) {
  if (ts.isPropertyAccessExpression(node)) return text(node.name.text);
  if (!node.argumentExpression) throw new Error("EMPTY_ELEMENT_KEY");
  return visit(node.argumentExpression);
}
function updateFunction(node, body) {
  if (ts.isFunctionDeclaration(node)) return f.updateFunctionDeclaration(node, node.modifiers, node.asteriskToken, node.name,
    node.typeParameters, node.parameters, node.type, body);
  if (ts.isFunctionExpression(node)) return f.updateFunctionExpression(node, node.modifiers, node.asteriskToken, node.name,
    node.typeParameters, node.parameters, node.type, body);
  if (ts.isArrowFunction(node)) return f.updateArrowFunction(node, node.modifiers, node.typeParameters, node.parameters,
    node.type, node.equalsGreaterThanToken, body);
  if (ts.isMethodDeclaration(node)) return f.updateMethodDeclaration(node, node.modifiers, node.asteriskToken, node.name,
    node.questionToken, node.typeParameters, node.parameters, node.type, body);
  if (ts.isGetAccessorDeclaration(node)) return f.updateGetAccessorDeclaration(node, node.modifiers, node.name,
    node.parameters, node.type, body);
  return f.updateSetAccessorDeclaration(node, node.modifiers, node.name, node.parameters, body);
}

// This tool has NO caller-selected path, pin, output destination or source text.
// It returns an inert complete-code/inventory candidate; it never imports output.
export function derivePrivateGrammarP2() {
  if (arguments.length !== 0) throw new Error("FIXED_TOOL_ARITY");
  const originalBytes = boundedToolRead(SOURCE_PATH, 121634, 121634);
  const packageBytes = boundedToolRead(PACKAGE_PATH, 51, 51);
  if (originalBytes.length !== 121634 || packageBytes.length !== 51 ||
      digest(originalBytes) !== PIN || digest(packageBytes) !== PACKAGE_PIN) throw new Error("GRAMMAR_PIN_DRIFT");
  const original = new TextDecoder("utf-8", {fatal: true}).decode(originalBytes);
  const runtimeBytes = boundedToolRead(RUNTIME_PATH, null, 131072);
  const runtime = new TextDecoder("utf-8", {fatal: true}).decode(runtimeBytes);
  if (original.length !== 119565) throw new Error("FIXED_TOOL_READ_DRIFT");
  if (original.indexOf(PREFIX) !== -1) throw new Error("PRIVATE_NAME_COLLISION");
  const file = ts.createSourceFile("fixed-acorn-tool.js", original, ts.ScriptTarget.ESNext, true, ts.ScriptKind.JS);
  if (file.parseDiagnostics.length !== 0) throw new Error("TOOL_SOURCE_PARSE_DIAGNOSTICS");
  let core = null;
  function find(node) {
    if (ts.isFunctionExpression(node) && node.getStart(file) === 66) core = node;
    ts.forEachChild(node, find);
  }
  find(file);
  if (!core || core.parameters.length !== 1 || !core.body || !ts.isBlock(core.body)) throw new Error("PINNED_CORE_SHAPE_DRIFT");
  // Four direct module ARRAY bindings exist in this pinned source. The numeric
  // tables are read only by the two WHOLE-replaced Unicode identifier helpers.
  // The two shared empty lists instead attach to owner ASTs and must be made
  // owner-local: a permanent child with reverse parent edges would root old ASTs.
  const staticArrayDeclarations = new Map();
  for (const statement of core.body.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!declaration.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) continue;
      if (!ts.isIdentifier(declaration.name) || !["t", "i", "te", "ce"].includes(declaration.name.text) ||
          staticArrayDeclarations.has(declaration.name.text)) throw new Error("STATIC_ARRAY_BINDING_DRIFT");
      const elements = declaration.initializer.elements;
      if (["ce", "te"].includes(declaration.name.text) ? elements.length !== 0 :
          elements.some(element => !ts.isNumericLiteral(element))) throw new Error("STATIC_ARRAY_CONTENT_DRIFT");
      staticArrayDeclarations.set(declaration.name.text, declaration);
    }
  }
  if (staticArrayDeclarations.size !== 4) throw new Error("STATIC_ARRAY_INVENTORY_DRIFT");
  const freshEmptyUses = new Map(), staticArrayAudit = [];
  for (const [name, property, method, prototypeReceiver] of [
    ["ce", "arguments", "parseNew", "pe"], ["te", "specifiers", "parseImport", "$"],
  ]) {
    const occurrences = [];
    function collect(node) {
      if (ts.isIdentifier(node) && node.text === name) occurrences.push(node);
      ts.forEachChild(node, collect);
    }
    collect(core.body);
    const declaration = staticArrayDeclarations.get(name);
    if (occurrences.length !== 2 || !occurrences.includes(declaration.name)) throw new Error("SHARED_EMPTY_REFERENCE_DRIFT");
    const use = occurrences.find(node => node !== declaration.name), assignment = use.parent;
    if (!ts.isBinaryExpression(assignment) || assignment.operatorToken.kind !== ts.SyntaxKind.EqualsToken ||
        assignment.right !== use || !ts.isPropertyAccessExpression(assignment.left) ||
        !ts.isIdentifier(assignment.left.expression) || assignment.left.expression.text !== "e" ||
        assignment.left.name.text !== property) throw new Error("SHARED_EMPTY_ATTACHMENT_DRIFT");
    let ownerFunction = assignment.parent;
    while (ownerFunction && !functionNode(ownerFunction)) ownerFunction = ownerFunction.parent;
    const ownerAssignment = ownerFunction && ownerFunction.parent;
    if (!ownerAssignment || !ts.isBinaryExpression(ownerAssignment) || ownerAssignment.right !== ownerFunction ||
        !ts.isPropertyAccessExpression(ownerAssignment.left) || ownerAssignment.left.name.text !== method ||
        !ts.isIdentifier(ownerAssignment.left.expression) || ownerAssignment.left.expression.text !== prototypeReceiver)
      throw new Error("SHARED_EMPTY_OWNER_METHOD_DRIFT");
    freshEmptyUses.set(use, {name, property, method, prototypeReceiver});
    staticArrayAudit.push({name, declarationStart: declaration.getStart(file), declarationEnd: declaration.end,
      attachmentStart: use.getStart(file), attachmentEnd: use.end, method, property, prototypeReceiver,
      referenceCount: 2, disposition: "OWNER_LOCAL_FRESH_EMPTY_LIST", ruleId: "R31"});
  }
  function boundNames(fn) {
    const names = new Set(fn.parameters.map(parameter => {
      if (!ts.isIdentifier(parameter.name)) throw new Error("STATIC_ARRAY_SCOPE_PATTERN_OPEN");
      return parameter.name.text;
    }));
    if (fn.name && ts.isIdentifier(fn.name)) names.add(fn.name.text);
    function bind(node) {
      if (node !== fn && functionNode(node)) {
        if (ts.isFunctionDeclaration(node) && node.name) names.add(node.name.text);
        return;
      }
      if (ts.isVariableDeclaration(node)) {
        if (!ts.isIdentifier(node.name)) throw new Error("STATIC_ARRAY_LOCAL_PATTERN_OPEN");
        names.add(node.name.text);
      }
      if (ts.isCatchClause(node) && node.variableDeclaration) names.add(node.variableDeclaration.name.text);
      ts.forEachChild(node, bind);
    }
    bind(fn.body);
    return names;
  }
  const numericReferences = {t: [], i: []};
  function numericArrayWalk(node, lexical = [], nearestFunction = null) {
    if (functionNode(node)) {
      const local = boundNames(node);
      lexical = [...lexical, local]; nearestFunction = node;
    }
    if (ts.isIdentifier(node) && (node.text === "t" || node.text === "i") &&
        !lexical.some(scope => scope.has(node.text))) {
      const parent = node.parent;
      const bindingOrKey = ts.isVariableDeclaration(parent) && parent.name === node ||
        ts.isParameter(parent) && parent.name === node ||
        ts.isPropertyAccessExpression(parent) && parent.name === node ||
        ts.isPropertyAssignment(parent) && parent.name === node;
      if (!bindingOrKey) {
        if (!nearestFunction || !nearestFunction.name ||
            !["isIdentifierStart", "isIdentifierChar"].includes(nearestFunction.name.text))
          throw new Error("STATIC_NUMERIC_ARRAY_REACHABILITY_OPEN");
        numericReferences[node.text].push({start: node.getStart(file), end: node.end, functionName: nearestFunction.name.text});
      }
    }
    ts.forEachChild(node, child => numericArrayWalk(child, lexical, nearestFunction));
  }
  // Start at body, not the root function, so root bindings are not mistaken for
  // local shadows. The closed declaration inventory above fixes root identities.
  numericArrayWalk(core.body);
  if (numericReferences.t.length !== 1 || numericReferences.i.length !== 2) throw new Error("STATIC_NUMERIC_ARRAY_REFERENCE_DRIFT");
  for (const name of ["t", "i"]) {
    const declaration = staticArrayDeclarations.get(name);
    staticArrayAudit.push({name, declarationStart: declaration.getStart(file), declarationEnd: declaration.end,
      references: numericReferences[name], disposition: "ONLY_WHOLE_REPLACED_UNICODE_HELPERS", ruleId: "R19"});
  }
  const offsets = new Uint32Array(original.length + 1);
  let utf8 = 0;
  for (let i = 0; i < original.length; i++) {
    offsets[i] = utf8;
    const code = original.charCodeAt(i);
    if (code < 128) utf8++;
    else if (code < 2048) utf8 += 2;
    else if (code >= 55296 && code <= 56319 && i + 1 < original.length &&
        original.charCodeAt(i + 1) >= 56320 && original.charCodeAt(i + 1) <= 57343) {
      offsets[++i] = utf8; //No original AST boundary may split a surrogate pair.
      utf8 += 4;
    } else utf8 += 3;
  }
  offsets[original.length] = utf8;
  if (utf8 !== originalBytes.length) throw new Error("OFFSET_MAP_DRIFT");
  const rows = [], open = [], scopes = [], emittedFrames = new Map(), mappedOriginal = new Set(), mappedAll = new Set(), alternateTrees = [];
  let sourceContext = {file, origin: "ACORN", anchor: null};
  let nextSite = 0;
  function row(node, operation, hook, details = "") {
    const start = node.getStart(sourceContext.file), end = node.end;
    if (rows.length >= 20000 || details.length > 2048) throw new Error("DERIVATION_INVENTORY_CAP");
    const isOriginal = sourceContext.origin === "ACORN";
    if (isOriginal) mappedOriginal.add(start + ":" + end + ":" + node.kind);
    mappedAll.add(sourceContext.origin + ":" + start + ":" + end + ":" + node.kind);
    const record = {id: nextSite++, sourceOrigin: sourceContext.origin,
      sourceUtf16Start: start, sourceUtf16End: end,
      originalUtf16Start: isOriginal ? start : sourceContext.anchor,
      originalUtf16End: isOriginal ? end : sourceContext.anchor,
      originalUtf8Start: offsets[isOriginal ? start : sourceContext.anchor],
      originalUtf8End: offsets[isOriginal ? end : sourceContext.anchor],
      originalKind: ts.SyntaxKind[node.kind], operation, hook, details,
      ruleId: RULES[operation] ? RULES[operation].id : "OPEN_RULE",
      profileId: "P2_ECMA15_SCRIPT_MODULE_PRIVATE_FIXED19"};
    if (!RULES[operation]) open.push({site: record.id, reason: "UNMAPPED_NORMATIVE_RULE_CLASS"});
    rows.push(record);
    return record.id;
  }
  function loweredOccurrence(node, ownerSite, operation) {
    const site = row(node, operation, "LOWERED_CHILD");
    rows[site].ownerSite = ownerSite;
    return site;
  }
  const rootSite = row(core, "private-initializer/pre-entry-frame", "registerFunction/invoke");
  function temporary() {
    const scope = scopes[scopes.length - 1];
    if (!scope) throw new Error("NO_TEMPORARY_SCOPE");
    const name = identifier("temp" + scope.id + "_" + scope.temps.length);
    scope.temps.push(name);
    return name;
  }
  function setTemporary(name, value) { return f.createBinaryExpression(name, f.createToken(ts.SyntaxKind.EqualsToken), value); }
  function argumentArray(args, visit, site) {
    if (args.some(ts.isSpreadElement)) { open.push({site, reason: "CALL_SPREAD_NEEDS_REVIEW"}); throw new Error("SOURCE_CALL_SPREAD_OPEN"); }
    return comma([call("reserveArray", [number(args.length), number(site)]),
      call("ownArray", [f.createArrayLiteralExpression(args.map(visit)), number(site), text("CONTROL_ARRAY")])]);
  }
  function functionFrame(node) {
    let locals = 0, nested = 0;
    function count(n) {
      if (n !== node && functionNode(n)) { if (ts.isFunctionDeclaration(n)) nested++; return; }
      if (ts.isVariableDeclaration(n)) locals++;
      ts.forEachChild(n, count);
    }
    count(node);
    return {locals, nested, parameters: node.parameters.length};
  }
  let transformer;
  const transformed = ts.transform(core.body, [context => inputRoot => {
    if (inputRoot !== core.body) throw new Error("FIXED_TRANSFORM_ROOT_DRIFT");
    function visitFunction(node) {
      if (!node.body || !ts.isBlock(node.body) || node.parameters.some(p => p.dotDotDotToken || p.initializer)) {
        throw new Error("SOURCE_FUNCTION_PARAMETER_OR_BODY_OPEN");
      }
      const site = row(node, "function/frame", "registerFunction/invoke"), shape = functionFrame(node);
      const scope = {id: site, temps: []};
      scopes.push(scope);
      const statements = node.body.statements.map(statement => ts.visitNode(statement, visit));
      const registrations = node.body.statements.filter(ts.isFunctionDeclaration).map(declaration => {
        if (!declaration.name) throw new Error("ANONYMOUS_HOIST_OPEN");
        const frame = emittedFrames.get(sourceContext.origin + ":" + declaration.getStart(sourceContext.file));
        if (!frame) throw new Error("EMITTED_HOIST_FRAME_MISSING");
        return f.createExpressionStatement(call("registerFunction", [declaration.name, number(frame.locals),
          number(frame.parameters), number(frame.nested), number(frame.site)]));
      });
      const temporaries = scope.temps.length === 0 ? [] : [f.createVariableStatement(undefined,
        f.createVariableDeclarationList(scope.temps.map(name => f.createVariableDeclaration(name)), ts.NodeFlags.None))];
      scopes.pop();
      emittedFrames.set(sourceContext.origin + ":" + node.getStart(sourceContext.file), {...shape, locals: shape.locals + scope.temps.length, site});
      // No function-body allocation guard is used as a substitute for pre-call entry.
      // invoke/construct reserves this known scalar frame BEFORE Reflect.apply/construct.
      const body = f.createBlock([...temporaries, ...registrations, ...statements], true);
      let printable = node;
      if (sourceContext.origin !== "ACORN") {
        const parameters = node.parameters.map(parameter => {
          if (!ts.isIdentifier(parameter.name)) throw new Error("FOREIGN_PARAMETER_PATTERN_OPEN");
          return f.createParameterDeclaration(undefined, undefined, f.createIdentifier(parameter.name.text));
        });
        if (ts.isFunctionDeclaration(node)) printable = f.createFunctionDeclaration(undefined, undefined,
          node.name ? f.createIdentifier(node.name.text) : undefined, undefined, parameters, undefined, body);
        else if (ts.isFunctionExpression(node)) printable = f.createFunctionExpression(undefined, undefined,
          node.name ? f.createIdentifier(node.name.text) : undefined, undefined, parameters, undefined, body);
        else throw new Error("FOREIGN_FUNCTION_FORM_OPEN");
      }
      const updated = updateFunction(printable, body);
      if (ts.isFunctionDeclaration(node)) return updated;
      return comma([call("reserveFunction", [number(site)]), call("registerFunction", [updated,
        number(shape.locals + scope.temps.length), number(shape.parameters), number(shape.nested), number(site)])]);
    }
    function visit(node) {
      if (sourceContext.origin === "ACORN" && freshEmptyUses.has(node)) {
        const use = freshEmptyUses.get(node);
        const site = row(node, "owner-local-empty-ast-list", "reserveArray/ownArray",
          use.name + " -> fresh empty " + use.method + "." + use.property + "; module alias not retained by owner AST");
        return comma([call("checkArrayDepth", [number(0), number(site)]),
          call("reserveArray", [number(0), number(site), number(0)]),
          call("ownArray", [f.createArrayLiteralExpression([]), number(site), text("ARRAY"), number(0)])]);
      }
      if (ts.isFunctionDeclaration(node) && node.name &&
          ["getOptions", "wordsRegexp", "codePointToString", "getLineInfo", "stringToBigInt", "stringToNumber", "hasProp", "isIdentifierStart", "isIdentifierChar"].includes(node.name.text)) {
        const name = node.name.text;
        row(node, "fixed-profile-function-replacement", "SCALAR_REPLACEMENT", name);
        let body;
        if (name === "getOptions") body = "return e;";
        else if (name === "wordsRegexp") body = 'return new RegExp("^(?:"+e.replace(/ /g,"|")+")$");';
        else if (name === "codePointToString") body = "return __codePoint(e);";
        else if (name === "isIdentifierStart") body = 'if(e>127)__refuse("UNSUPPORTED_BOUNDED_SYNTAX");return e===36||e===95||e>=65&&e<=90||e>=97&&e<=122;';
        else if (name === "isIdentifierChar") body = 'if(e>127)__refuse("UNSUPPORTED_BOUNDED_SYNTAX");return e===36||e===95||e>=48&&e<=57||e>=65&&e<=90||e>=97&&e<=122;';
        else body = '__refuse("UNSUPPORTED_BOUNDED_SYNTAX");';
        const parameterNames = node.parameters.map(parameter => parameter.name.text);
        const parsed = ts.createSourceFile("fixed-profile-function.js", "function " + name + "(" + parameterNames.join(",") + "){" + body + "}",
          ts.ScriptTarget.ESNext, true, ts.ScriptKind.JS);
        if (parsed.parseDiagnostics.length) throw new Error("FIXED_FUNCTION_DIAGNOSTICS");
        const prior = sourceContext;
        sourceContext = {file: parsed, origin: "FIXED:" + name, anchor: node.getStart(file)};
        alternateTrees.push({file: parsed, origin: sourceContext.origin, root: parsed.statements[0]});
        const updated = visitFunction(parsed.statements[0]);
        const emitted = emittedFrames.get(sourceContext.origin + ":0");
        if (!emitted) throw new Error("FIXED_FUNCTION_FRAME_MISSING");
        sourceContext = prior;
        emittedFrames.set(prior.origin + ":" + node.getStart(file), emitted);
        return updated;
      }
      if (ts.isIdentifier(node) && CAPTURED_SOURCE_NAMES.has(node.text)) {
        // Pinned grammar has no binding with one of these host names. Property
        // names are handled separately and must not be rewritten as bindings.
        if (node.parent && (ts.isVariableDeclaration(node.parent) && node.parent.name === node ||
            ts.isParameter(node.parent) && node.parent.name === node ||
            functionNode(node.parent) && node.parent.name === node)) throw new Error("CAPTURED_HOST_BINDING_DRIFT");
        if (!(node.parent && ts.isPropertyAssignment(node.parent) && node.parent.name === node)) return identifier(node.text);
      }
      if (sourceContext.origin !== "ACORN") {
        if (ts.isIdentifier(node)) return f.createIdentifier(node.text);
        if (ts.isStringLiteral(node)) return f.createStringLiteral(node.text);
        if (ts.isNumericLiteral(node)) return f.createNumericLiteral(node.text);
      }
      if (functionNode(node)) return visitFunction(node);
      if (ts.isObjectLiteralExpression(node)) {
        if (node.properties.some(p => ts.isSpreadAssignment(p) || ts.isMethodDeclaration(p) || ts.isGetAccessorDeclaration(p) || ts.isSetAccessorDeclaration(p))) {
          throw new Error("SOURCE_OBJECT_METHOD_OR_SPREAD_OPEN");
        }
        const site = row(node, "object/header/schema", "reserveObject/ownObject");
        const object = ts.visitEachChild(node, visit, context);
        let keyUnits = 0;
        for (const property of node.properties) {
          if (ts.isComputedPropertyName(property.name)) throw new Error("COMPUTED_LITERAL_KEYS_OPEN");
          keyUnits += property.name.text.length;
        }
        return comma([call("reserveObject", [number(node.properties.length), number(site)]),
          call("ownObject", [object, number(site), number(node.properties.length), number(keyUnits)])]);
      }
      if (ts.isArrayLiteralExpression(node)) {
        if (node.elements.some(ts.isSpreadElement)) throw new Error("SOURCE_ARRAY_SPREAD_OPEN");
        const site = row(node, "array/header/backing", "reserveArray/ownArray");
        const steps = [], elements = [], maximum = temporary();
        steps.push(setTemporary(maximum, number(0)));
        let occupied = 0;
        for (const element of node.elements) {
          if (ts.isOmittedExpression(element)) { elements.push(element); continue; }
          occupied++;
          const value = temporary();
          steps.push(setTemporary(value, ts.visitNode(element, visit)));
          steps.push(setTemporary(maximum, call("maximumChildDepth", [maximum, value, number(site)])));
          elements.push(value);
        }
        // Evaluate each element once, left-to-right; admit child depth BEFORE the
        // actual literal attaches references. No closure/vector is created first.
        steps.push(call("checkArrayDepth", [maximum, number(site)]));
        steps.push(call("reserveArray", [number(node.elements.length), number(site), number(occupied)]));
        steps.push(call("ownArray", [f.createArrayLiteralExpression(elements), number(site), text("ARRAY"), maximum]));
        return comma(steps);
      }
      if (ts.isRegularExpressionLiteral(node)) {
        const site = row(node, "fixed-regex-descriptor", "toolRegex", node.text);
        return call("toolRegex", [text(node.text), number(site)]);
      }
      if (ts.isNewExpression(node)) {
        const site = row(node, "constructor/header/frame", "construct", node.expression.getText(sourceContext.file));
        return call("construct", [ts.visitNode(node.expression, visit), argumentArray(node.arguments || [],
          arg => ts.visitNode(arg, visit), site), number(site)]);
      }
      if (ts.isCallExpression(node)) {
        const calleeName = methodName(node.expression);
        // WHOLE error-call replacement: diagnostic argument expressions are not evaluated.
        if (calleeName === "raise" || calleeName === "raiseRecoverable" || calleeName === "unexpected") {
          const site = row(node, "bounded-error/no-diagnostics", "syntaxRefusal", calleeName);
          rows[site].wholeReplacement = true;
          return call("syntaxRefusal", [number(site)]);
        }
        if (calleeName === "invalidStringToken") {
          const site = row(node, "template-sentinel-or-bounded-error", "invalidTemplate", calleeName);
          rows[site].wholeReplacement = true;
          return call("invalidTemplate", [ts.visitNode(node.expression.expression, visit), number(site)]);
        }
        const site = row(node, "closed-call/pre-entry", "invoke", node.expression.getText(sourceContext.file));
        const args = argumentArray(node.arguments, arg => ts.visitNode(arg, visit), site);
        if (member(node.expression)) {
          loweredOccurrence(node.expression, site, "method-reference/evaluate-receiver-once");
          const receiver = temporary(), target = temporary();
          return comma([setTemporary(receiver, ts.visitNode(node.expression.expression, visit)),
            setTemporary(target, call("get", [receiver, propertyName(node.expression, arg => ts.visitNode(arg, visit)), number(site)])),
            call("invoke", [target, receiver, args, number(site)])]);
        }
        return call("invoke", [ts.visitNode(node.expression, visit), f.createVoidZero(), args, number(site)]);
      }
      if (ts.isBinaryExpression(node) && assignmentOperator(node.operatorToken.kind)) {
        const site = row(node, "schema/compound-write", "set/binary");
        if (member(node.left)) {
          loweredOccurrence(node.left, site, "member-write-target/evaluate-key-once");
          const target = temporary(), key = temporary(), old = temporary();
          const setup = [setTemporary(target, ts.visitNode(node.left.expression, visit)),
            setTemporary(key, propertyName(node.left, arg => ts.visitNode(arg, visit)))];
          if (node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
            return comma([...setup, call("set", [target, key, ts.visitNode(node.right, visit), number(site)])]);
          }
          const operator = ts.tokenToString(node.operatorToken.kind).slice(0, -1);
          if (operator === "&&" || operator === "||" || operator === "??") throw new Error("LOGICAL_COMPOUND_ORDER_OPEN");
          return comma([...setup, setTemporary(old, call("get", [target, key, number(site)])),
            call("set", [target, key, call("binary", [text(operator), old, ts.visitNode(node.right, visit), number(site)]), number(site)])]);
        }
        if (node.operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
          if (!ts.isIdentifier(node.left)) throw new Error("VARIABLE_COMPOUND_BINDING_OPEN");
          const operator = ts.tokenToString(node.operatorToken.kind).slice(0, -1);
          if (!BINARY_COERCIVE.has(operator)) throw new Error("VARIABLE_COMPOUND_OPERATOR_OPEN");
          return f.createBinaryExpression(ts.visitNode(node.left, visit), f.createToken(ts.SyntaxKind.EqualsToken),
            call("binary", [text(operator), ts.visitNode(node.left, visit), ts.visitNode(node.right, visit), number(site)]));
        }
        if (!ts.isIdentifier(node.left)) throw new Error("ASSIGNMENT_BINDING_OPEN");
        rows[site].hook = "FIXED_FRAME_SLOT";
        rows[site].ruleId = RULES["fixed-frame-local-write"].id;
        rows[site].ownerSite = scopes[scopes.length - 1].id;
        return ts.visitEachChild(node, visit, context);
      }
      if (ts.isBinaryExpression(node) && BINARY_COERCIVE.has(ts.tokenToString(node.operatorToken.kind))) {
        const operator = ts.tokenToString(node.operatorToken.kind);
        const site = row(node, "closed-primitive-or-brand-binary", "binary", operator);
        return call("binary", [text(operator), ts.visitNode(node.left, visit), ts.visitNode(node.right, visit), number(site)]);
      }
      if ((ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) &&
          (node.operator === ts.SyntaxKind.PlusPlusToken || node.operator === ts.SyntaxKind.MinusMinusToken) && member(node.operand)) {
        const site = row(node, "schema-numeric-increment", "increment");
        loweredOccurrence(node.operand, site, "member-increment-target/evaluate-key-once");
        return call("increment", [ts.visitNode(node.operand.expression, visit),
          propertyName(node.operand, arg => ts.visitNode(arg, visit)), number(node.operator === ts.SyntaxKind.PlusPlusToken ? 1 : -1),
          node.kind === ts.SyntaxKind.PostfixUnaryExpression ? f.createTrue() : f.createFalse(), number(site)]);
      }
      if (ts.isPrefixUnaryExpression(node) && [ts.SyntaxKind.PlusToken, ts.SyntaxKind.MinusToken, ts.SyntaxKind.TildeToken].includes(node.operator)) {
        const site = row(node, "closed-primitive-unary", "unary", ts.tokenToString(node.operator));
        return call("unary", [text(ts.tokenToString(node.operator)), ts.visitNode(node.operand, visit), number(site)]);
      }
      if ((ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) &&
          [ts.SyntaxKind.PlusPlusToken, ts.SyntaxKind.MinusMinusToken].includes(node.operator)) {
        if (!ts.isIdentifier(node.operand)) throw new Error("SCALAR_INCREMENT_BINDING_OPEN");
        const site = row(node, "closed-primitive-binding-increment", "numeric", ts.tokenToString(node.operator));
        const old = temporary(), next = temporary();
        const step = node.operator === ts.SyntaxKind.PlusPlusToken ? 1 : -1;
        return comma([setTemporary(old, call("numeric", [ts.visitNode(node.operand, visit), number(site)])),
          setTemporary(next, f.createBinaryExpression(old, f.createToken(ts.SyntaxKind.PlusToken), number(step))),
          setTemporary(ts.visitNode(node.operand, visit), next),
          ts.isPostfixUnaryExpression(node) ? old : next]);
      }
      if (ts.isDeleteExpression(node)) {
        if (!member(node.expression)) throw new Error("NONMEMBER_DELETE_OPEN");
        const site = row(node, "schema-delete/no-refund", "remove");
        loweredOccurrence(node.expression, site, "member-delete-target/evaluate-key-once");
        return call("remove", [ts.visitNode(node.expression.expression, visit),
          propertyName(node.expression, arg => ts.visitNode(arg, visit)), number(site)]);
      }
      if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
        const site = row(node, "closed-property-read/getter-call", "get");
        return call("get", [ts.visitNode(node.expression, visit), propertyName(node, arg => ts.visitNode(arg, visit)), number(site)]);
      }
      if (ts.isForStatement(node) || ts.isWhileStatement(node) || ts.isDoStatement(node) ||
          ts.isForInStatement(node) || ts.isForOfStatement(node)) {
        const site = row(node, "loop-clock-checkpoint", "tick");
        if (ts.isForOfStatement(node)) throw new Error("FOR_OF_IMPLICIT_ITERATOR_OPEN");
        if (ts.isForInStatement(node)) {
          if (ts.isLabeledStatement(node.parent)) throw new Error("LABELED_FOR_IN_CONTROL_OPEN");
          // Pinned getOptions and regexp-only hasProp are whole-body replaced.
          // The only enabled original for-in is copying a private Node into a
          // separately fresh Node. Source is not mutated; Node prototype has no
          // enumerable grammar fields (constructor is preserved non-enumerable).
          if (sourceContext.origin !== "ACORN" || node.getText(file) !== "for(var i in e){t[i]=e[i]}")
            throw new Error("FOR_IN_SEMANTIC_PREMISE_OPEN");
          rows[site].details = "copyNode only: owned NODE; fresh destination; source invariant; no enumerable grammar prototype fields; host prototypes excluded";
          const target = temporary(), keys = temporary(), index = temporary();
          const iterable = ts.visitNode(node.expression, visit);
          const originalBody = ts.visitNode(node.statement, visit);
          const statements = ts.isBlock(originalBody) ? originalBody.statements : [originalBody];
          let assignment;
          if (ts.isVariableDeclarationList(node.initializer)) {
            if (node.initializer.declarations.length !== 1 || !ts.isIdentifier(node.initializer.declarations[0].name)) throw new Error("FOR_IN_BINDING_PATTERN_OPEN");
            assignment = f.createVariableStatement(undefined, f.createVariableDeclarationList([
              f.createVariableDeclaration(node.initializer.declarations[0].name, undefined, undefined, call("get", [keys, index, number(site)]))], ts.NodeFlags.None));
          } else if (ts.isIdentifier(node.initializer)) {
            assignment = f.createExpressionStatement(f.createBinaryExpression(node.initializer,
              f.createToken(ts.SyntaxKind.EqualsToken), call("get", [keys, index, number(site)])));
          } else throw new Error("FOR_IN_ASSIGNMENT_MEMBER_OPEN");
          const setup = [f.createExpressionStatement(setTemporary(target, iterable)),
            f.createExpressionStatement(setTemporary(keys, call("copyKeys", [target, number(site)])))];
          const loop = f.createForStatement(setTemporary(index, number(0)),
            f.createBinaryExpression(index, f.createToken(ts.SyntaxKind.LessThanToken), call("get", [keys, text("length"), number(site)])),
            f.createPostfixUnaryExpression(index, ts.SyntaxKind.PlusPlusToken),
            f.createBlock([f.createExpressionStatement(call("tick", [number(site)])), assignment, ...statements], true));
          return f.createBlock([...setup, loop], true);
        }
        const updated = ts.visitEachChild(node, visit, context);
        const statements = ts.isBlock(updated.statement) ? updated.statement.statements : [updated.statement];
        const body = f.createBlock([f.createExpressionStatement(call("tick", [number(site)])), ...statements], true);
        if (ts.isForStatement(updated)) return f.updateForStatement(updated, updated.initializer, updated.condition, updated.incrementor, body);
        if (ts.isWhileStatement(updated)) return f.updateWhileStatement(updated, updated.expression, body);
        return f.updateDoStatement(updated, body, updated.expression);
      }
      const allowed = new Set([
        ts.SyntaxKind.Block, ts.SyntaxKind.ExpressionStatement, ts.SyntaxKind.VariableStatement,
        ts.SyntaxKind.VariableDeclarationList, ts.SyntaxKind.VariableDeclaration,
        ts.SyntaxKind.IfStatement, ts.SyntaxKind.SwitchStatement, ts.SyntaxKind.CaseBlock,
        ts.SyntaxKind.CaseClause, ts.SyntaxKind.DefaultClause, ts.SyntaxKind.BreakStatement,
        ts.SyntaxKind.ContinueStatement, ts.SyntaxKind.ReturnStatement, ts.SyntaxKind.ThrowStatement,
        ts.SyntaxKind.TryStatement, ts.SyntaxKind.CatchClause, ts.SyntaxKind.LabeledStatement,
        ts.SyntaxKind.EmptyStatement, ts.SyntaxKind.DebuggerStatement, ts.SyntaxKind.ParenthesizedExpression,
        ts.SyntaxKind.ConditionalExpression, ts.SyntaxKind.TypeOfExpression, ts.SyntaxKind.VoidExpression,
        ts.SyntaxKind.BinaryExpression, ts.SyntaxKind.PrefixUnaryExpression, ts.SyntaxKind.PostfixUnaryExpression,
        ts.SyntaxKind.Identifier, ts.SyntaxKind.NumericLiteral, ts.SyntaxKind.StringLiteral,
        ts.SyntaxKind.ThisKeyword, ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword,
        ts.SyntaxKind.NullKeyword, ts.SyntaxKind.PropertyAssignment, ts.SyntaxKind.ShorthandPropertyAssignment,
        ts.SyntaxKind.OmittedExpression, ts.SyntaxKind.Parameter, ts.SyntaxKind.EndOfFileToken,
      ]);
      if (!allowed.has(node.kind) && !ts.isToken(node)) throw new Error("UNCLASSIFIED_SOURCE_KIND_" + ts.SyntaxKind[node.kind]);
      const updated = ts.visitEachChild(node, visit, context);
      if (sourceContext.origin !== "ACORN") {
        // visitEachChild returns the ORIGINAL object when its children did not
        // change. Never mutate that independently reviewed source occurrence's
        // positions to synthesize printer nodes: clone before changing its range.
        const printable = updated === node ? f.cloneNode(updated) : updated;
        ts.setTextRange(printable, {pos: -1, end: -1});
        return printable;
      }
      return updated;
    }
    transformer = visit;
    scopes.push({id: rootSite, temps: []});
    // Complete body replacement is explicit fixed-profile/native-scanner lineage.
    const statements = [], helperDeclarations = [];
    if (typeof SCALAR_GRAMMAR_HELPERS !== "string" || SCALAR_GRAMMAR_HELPERS.length > 131072) throw new Error("SCALAR_HELPER_CAP");
    const helpers = ts.createSourceFile("fixed-scalar-helpers.js", SCALAR_GRAMMAR_HELPERS,
      ts.ScriptTarget.ESNext, true, ts.ScriptKind.JS);
    if (helpers.parseDiagnostics.length) throw new Error("SCALAR_HELPER_DIAGNOSTICS");
    alternateTrees.push({file: helpers, origin: "SCALAR_SHARED", root: helpers});
    const originalContext = sourceContext;
    sourceContext = {file: helpers, origin: "SCALAR_SHARED", anchor: 66};
    for (const statement of helpers.statements) {
      if (!ts.isFunctionDeclaration(statement)) throw new Error("SCALAR_SHARED_TOPLEVEL_SHAPE");
      helperDeclarations.push(statement);
      statements.push(ts.visitNode(statement, visit));
    }
    sourceContext = originalContext;
    for (const statement of core.body.statements) {
      if (ts.isIfStatement(statement) && statement.expression.getText(file) === 'typeof Symbol!=="undefined"') {
        row(statement, "private-public-iterator-removal", "REMOVED", "Symbol.iterator token iterator surface");
        continue;
      }
      if (ts.isExpressionStatement(statement) && ts.isBinaryExpression(statement.expression) &&
          statement.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
          ts.isPropertyAccessExpression(statement.expression.left)) {
        const left = statement.expression.left, receiver = left.expression.getText(file);
        if (receiver === "e" || receiver === "K" && ["acorn", "extend", "parse", "parseExpressionAt", "tokenizer"].includes(left.name.text)) {
          row(statement, "private-surface-removal", "REMOVED", receiver + "." + left.name.text);
          continue;
        }
        const excluded = receiver === "Ue.prototype" || left.name.text === "readRegexp" || left.name.text.startsWith("regexp_") ||
          ["validateRegExpFlags", "validateRegExpPattern", "raise", "raiseRecoverable", "unexpected", "invalidStringToken"].includes(left.name.text);
        const diagnostic = ["raise", "raiseRecoverable", "unexpected"].includes(left.name.text);
        const replacement = left.name.text === "invalidStringToken" ?
          'if(this.inTemplateElement&&this.options.ecmaVersion>=9){throw ze}__refuse("SYNTAX_REFUSED");' :
          diagnostic ? '__refuse("SYNTAX_REFUSED");' :
          excluded ? '__refuse("UNSUPPORTED_BOUNDED_SYNTAX");' : SCALAR_GRAMMAR_BODIES[left.name.text];
        if (typeof replacement === "string" && ts.isFunctionExpression(statement.expression.right)) {
          const parameterName = excluded ? "" : SCALAR_GRAMMAR_PARAMETER_NAMES[left.name.text];
          if (typeof parameterName !== "string") throw new Error("SCALAR_PARAMETER_MAP_OPEN");
          const parameterNames = parameterName === "" ? [] : [parameterName];
          const parsed = ts.createSourceFile("fixed-scalar-body.js", "function body(" + parameterNames.join(",") + "){" + replacement + "}",
            ts.ScriptTarget.ESNext, true, ts.ScriptKind.JS);
          if (parsed.parseDiagnostics.length) throw new Error("REPLACEMENT_BODY_DIAGNOSTICS");
          row(statement.expression.right, "scalar-body-replacement", "SCALAR_REPLACEMENT", left.name.text);
          const previousContext = sourceContext;
          sourceContext = {file: parsed, origin: "SCALAR:" + left.name.text, anchor: statement.expression.right.getStart(file)};
          const replacementFunction = parsed.statements[0];
          const expression = f.createFunctionExpression(undefined, undefined, undefined, undefined,
            replacementFunction.parameters, undefined, replacementFunction.body);
          ts.setTextRange(expression, replacementFunction);
          alternateTrees.push({file: parsed, origin: sourceContext.origin, root: expression});
          const transformedFunction = visitFunction(expression);
          sourceContext = previousContext;
          const site = row(statement.expression, "replacement-method-schema", "set", left.name.text);
          loweredOccurrence(left, site, "member-write-target/evaluate-key-once");
          statements.push(f.createExpressionStatement(call("set", [ts.visitNode(left.expression, visit),
            text(left.name.text), transformedFunction, number(site)])));
          continue;
        }
      }
      statements.push(ts.visitNode(statement, visit));
    }
    const scope = scopes.pop();
    const temps = scope.temps.length ? [f.createVariableStatement(undefined,
      f.createVariableDeclarationList(scope.temps.map(name => f.createVariableDeclaration(name)), ts.NodeFlags.None))] : [];
    const hoisted = [...helperDeclarations.map(node => ({node, context: {file: helpers, origin: "SCALAR_SHARED", anchor: 66}})),
      ...core.body.statements.filter(ts.isFunctionDeclaration).map(node => ({node, context: originalContext}))];
    const registrations = hoisted.map(({node, context: location}) => {
      const frame = emittedFrames.get(location.origin + ":" + node.getStart(location.file));
      if (!node.name || !frame) throw new Error("ROOT_HOIST_FRAME_MISSING");
      return f.createExpressionStatement(call("registerFunction", [node.name, number(frame.locals), number(frame.parameters),
        number(frame.nested), number(frame.site)]));
    });
    return f.createBlock([...temps, ...registrations, ...statements,
      f.createExpressionStatement(f.createBinaryExpression(identifier("Parser"), f.createToken(ts.SyntaxKind.EqualsToken), f.createIdentifier("K"))),
      f.createExpressionStatement(f.createBinaryExpression(identifier("NodeConstructor"), f.createToken(ts.SyntaxKind.EqualsToken), f.createIdentifier("de"))),
      f.createExpressionStatement(f.createBinaryExpression(identifier("templateSentinel"), f.createToken(ts.SyntaxKind.EqualsToken), f.createIdentifier("ze")))], true);
  }]);
  if (!transformer) throw new Error("TRANSFORM_NOT_CREATED");
  const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed, removeComments: true});
  const block = printer.printNode(ts.EmitHint.Unspecified, transformed.transformed[0], file);
  transformed.dispose();
  // The generated source is an inert candidate until ALL open rows are resolved,
  // complete output/source map is independently reviewed and trusted pins admitted.
  if (block.length > 2097152 || runtime.length > 131072 || SCALAR_GRAMMAR_HELPERS.length > 131072) throw new Error("DERIVATION_OUTPUT_CAP");
  const rootShape = functionFrame(core);
  const emittedRoot = ts.createSourceFile("private-root-shape.js", "function initialize() " + block,
    ts.ScriptTarget.ESNext, true, ts.ScriptKind.JS);
  if (emittedRoot.parseDiagnostics.length) throw new Error("ROOT_EMIT_DIAGNOSTICS");
  const rootFinal = functionFrame(emittedRoot.statements[0]);
  if (rootFinal.parameters !== 0 || rootShape.parameters !== 1) throw new Error("ROOT_ENTRY_PROFILE_DRIFT");
  const runtimeFile = ts.createSourceFile("private-runtime-template.js", runtime,
    ts.ScriptTarget.ESNext, true, ts.ScriptKind.JS);
  if (runtimeFile.parseDiagnostics.length) throw new Error("RUNTIME_TEMPLATE_DIAGNOSTICS");
  const scannerHooks = new Set(["__char", "__slice", "__concat", "__codePoint", "__tick", "__refuse", "__number"]);
  const hookRegistrations = [];
  const workspace = [];
  let workspaceSegmentBytes = 0;
  for (const statement of runtimeFile.statements) {
    if (ts.isFunctionDeclaration(statement)) {
      const shape = functionFrame(statement), bytes = 64 + 16 * (shape.locals + shape.parameters);
      if (!Number.isSafeInteger(bytes) || bytes > 67108864 - workspaceSegmentBytes) throw new Error("WORKSPACE_SITE_CAP");
      workspaceSegmentBytes += bytes;
      workspace.push({name: statement.name.text, start: statement.getStart(runtimeFile), end: statement.end,
        locals: shape.locals, parameters: shape.parameters, bytes});
    }
    if (ts.isFunctionDeclaration(statement) && statement.name && scannerHooks.has(statement.name.text)) {
      const shape = functionFrame(statement);
      hookRegistrations.push(PREFIX + "registerFunction(" + statement.name.text + "," + shape.locals + "," +
        shape.parameters + "," + shape.nested + ",-1);");
      scannerHooks.delete(statement.name.text);
    }
  }
  if (scannerHooks.size) throw new Error("RUNTIME_SCANNER_HOOK_MISSING");
  const suffix = "\nfunction " + PREFIX + "initialize() " + block + "\n" + hookRegistrations.join("\n") + "\n" +
    PREFIX + "registerFunction(" + PREFIX + "initialize," + rootFinal.locals + ",0," + rootFinal.nested + "," + rootSite + ");\n" +
    PREFIX + "invoke(" + PREFIX + "initialize,undefined," + PREFIX + "emptyArguments()," + rootSite + ");\n";
  // Complete fixed module cost derives from actual emitted sites, not from any
  // whole-function reserve. Constants/functions are trusted preload source; this
  // is a logical module envelope, not a native-compiler/RSS allocation guarantee.
  const costSource = runtime + suffix;
  if (costSource.length > 2228224) throw new Error("CANDIDATE_SOURCE_CAP");
  const costFile = ts.createSourceFile("private-static-sites.js", costSource, ts.ScriptTarget.ESNext, true, ts.ScriptKind.JS);
  if (costFile.parseDiagnostics.length) throw new Error("STATIC_SOURCE_DIAGNOSTICS");
  const startup = [];
  let staticBytes = 0;
  function staticSite(node, kind, bytes) {
    if (startup.length >= 20000 || !Number.isSafeInteger(bytes) || bytes < 0 || bytes > 67108864 - staticBytes)
      throw new Error("STATIC_SITE_CAP");
    startup.push({start: node.getStart(costFile), end: node.end, kind, bytes}); staticBytes += bytes;
  }
  function staticWalk(node, dynamicFunctionDepth) {
    if (ts.isStringLiteral(node)) staticSite(node, "literal-string-pool", 32 + 2 * node.text.length);
    if (ts.isPropertyAssignment(node) && !ts.isComputedPropertyName(node.name))
      staticSite(node.name, "literal-property-key-pool", 32 + 2 * node.name.text.length);
    // Root/runtime declarations exist before module statements. Inner grammar
    // declarations are guarded at entry; expression functions are guarded inline.
    if (ts.isFunctionDeclaration(node) && dynamicFunctionDepth === 0) staticSite(node, "module-function-and-implicit-prototype", 192);
    if (ts.isVariableDeclaration(node) && dynamicFunctionDepth === 0) staticSite(node, "module-binding-slot", 16);
    if (dynamicFunctionDepth === 0 && ts.isObjectLiteralExpression(node)) staticSite(node, "module-object-schema", 64 + 16 * node.properties.length);
    if (dynamicFunctionDepth === 0 && ts.isCallExpression(node) && member(node.expression) && methodName(node.expression) === "bind")
      staticSite(node, "captured-bound-intrinsic", 96);
    if (dynamicFunctionDepth === 0 && ts.isNewExpression(node)) {
      if (!ts.isIdentifier(node.expression) || node.expression.text !== "WeakMap") throw new Error("UNCLASSIFIED_STATIC_CONSTRUCTOR");
      staticSite(node, "module-weakmap-header", 96);
    }
    const next = functionNode(node) ? dynamicFunctionDepth + 1 : dynamicFunctionDepth;
    ts.forEachChild(node, child => staticWalk(child, next));
  }
  staticWalk(costFile, 0);
  // Between guarded grammar/native re-entry boundaries, direct helper paths are
  // acyclic except linkDepth->push->set->linkDepth, whose second call returns for
  // CONTROL_ARRAY. Thus each helper appears at most twice per segment; at most
  //128 admitted frames plus the public owner segment coexist. Native stack sizes
  //remain unknown; this is an explicit logical workspace upper bound.
  const workspaceBytes = workspaceSegmentBytes * 2 * 129;
  if (!Number.isSafeInteger(workspaceBytes) || workspaceBytes > 67108864 - staticBytes - 32) throw new Error("WORKSPACE_CAP");
  const prelude = "const " + PREFIX + "RUNTIME_STATIC_BYTES=" + (staticBytes + 32) + ";\n" +
    "const " + PREFIX + "RUNTIME_WORKSPACE_BYTES=" + workspaceBytes + ";\n";
  const candidate = prelude + runtime + suffix;
  if (candidate.length > 2228288) throw new Error("CANDIDATE_FINAL_CAP");
  // A separate original-tree walk does not call the transformer. Removed whole
  // regions cover descendants explicitly; every other effectful site must have
  // an exact original occurrence row. This is not a runtime fallback test.
  const removed = rows.filter(record => record.sourceOrigin === "ACORN" &&
    (record.hook === "REMOVED" || record.hook === "SCALAR_REPLACEMENT" || record.wholeReplacement));
  function effectful(node) {
    if (functionNode(node) || ts.isCallExpression(node) || ts.isNewExpression(node) ||
        ts.isObjectLiteralExpression(node) || ts.isArrayLiteralExpression(node) ||
        ts.isRegularExpressionLiteral(node) || member(node) || ts.isDeleteExpression(node) ||
        ts.isForStatement(node) || ts.isWhileStatement(node) || ts.isDoStatement(node) || ts.isForInStatement(node) || ts.isForOfStatement(node)) return true;
    if (ts.isBinaryExpression(node)) return assignmentOperator(node.operatorToken.kind) || BINARY_COERCIVE.has(ts.tokenToString(node.operatorToken.kind));
    if (ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) return node.operator !== ts.SyntaxKind.ExclamationToken;
    return false;
  }
  const unmatched = [];
  function independentWalk(node) {
    const start = node.getStart(file), end = node.end;
    for (const region of removed) if (start >= region.originalUtf16Start && end <= region.originalUtf16End) return;
    if (effectful(node) && !mappedOriginal.has(start + ":" + end + ":" + node.kind)) {
      if (unmatched.length >= 20000) throw new Error("UNMATCHED_CAP");
      unmatched.push({start, end, kind: ts.SyntaxKind[node.kind]});
    }
    ts.forEachChild(node, independentWalk);
  }
  // Root body is not an exposed function occurrence; its entry is separately
  // guarded by the fixed initializer frame above.
  for (const statement of core.body.statements) independentWalk(statement);
  for (const tree of alternateTrees) {
    function alternateWalk(node) {
      if (node.kind === ts.SyntaxKind.SourceFile) { ts.forEachChild(node, alternateWalk); return; }
      const start = node.getStart(tree.file), end = node.end;
      const replaced = rows.some(record => record.sourceOrigin === tree.origin && record.wholeReplacement &&
        start >= record.sourceUtf16Start && end <= record.sourceUtf16End);
      if (replaced) return;
      if (effectful(node) && !mappedAll.has(tree.origin + ":" + start + ":" + end + ":" + node.kind)) {
        if (unmatched.length >= 20000) throw new Error("UNMATCHED_HELPER_CAP");
        unmatched.push({origin: tree.origin, start, end, kind: ts.SyntaxKind[node.kind]});
      }
      ts.forEachChild(node, alternateWalk);
    }
    alternateWalk(tree.root);
  }
  const emitted = ts.createSourceFile("private-derived-candidate.js", candidate,
    ts.ScriptTarget.ESNext, true, ts.ScriptKind.JS);
  if (emitted.parseDiagnostics.length) throw new Error("CANDIDATE_EMIT_DIAGNOSTICS");
  const hookSites = [], emittedEffects = [], emittedUnknown = [];
  const grammarStart = prelude.length + runtime.length;
  function emittedIssue(node, reason) {
    if (emittedUnknown.length >= 20000) throw new Error("EMITTED_UNKNOWN_CAP");
    emittedUnknown.push({start: node.getStart(emitted), end: node.end, kind: ts.SyntaxKind[node.kind], reason});
  }
  function hookName(node) {
    return node && ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text.startsWith(PREFIX) ?
      node.expression.text.slice(PREFIX.length) : null;
  }
  function literalSite(node, hook) {
    if (!GUARD_SIGNATURES.has(hook)) return null;
    const arg = node.arguments[GUARD_SIGNATURES.get(hook)];
    if (!arg || !ts.isNumericLiteral(arg)) return null;
    const site = Number(arg.text);
    return Number.isSafeInteger(site) && site >= 0 && site < rows.length ? site : null;
  }
  function flattened(node, output) {
    if (ts.isParenthesizedExpression(node)) return flattened(node.expression, output);
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.CommaToken) {
      flattened(node.left, output); flattened(node.right, output);
    } else output.push(node);
  }
  function commaDominates(node, hook, site, check) {
    let current = node;
    while (current.parent && !functionNode(current.parent) && !ts.isStatement(current.parent)) {
      const parent = current.parent;
      if (ts.isParenthesizedExpression(parent) || ts.isBinaryExpression(parent) && parent.operatorToken.kind === ts.SyntaxKind.CommaToken) {
        const steps = []; flattened(parent, steps);
        for (const step of steps) {
          if (step.getStart(emitted) >= node.getStart(emitted)) break;
          if (hookName(step) === hook && literalSite(step, hook) === site && (!check || check(step))) return true;
        }
      }
      current = parent;
    }
    return false;
  }
  function matchesFrameRegistration(node, registration) {
    if (hookName(registration) !== "registerFunction" || registration.arguments.length !== 5) return false;
    const shape = functionFrame(node);
    const expected = [shape.locals, shape.parameters, shape.nested];
    for (let i = 0; i < expected.length; i++) {
      const argument = registration.arguments[i + 1];
      if (!argument || !ts.isNumericLiteral(argument) || Number(argument.text) !== expected[i]) return false;
    }
    return true;
  }
  function scalarIncrementOrigin(node) {
    let current = node;
    while (current.parent && !functionNode(current.parent) && !ts.isStatement(current.parent)) {
      const parent = current.parent;
      if (ts.isParenthesizedExpression(parent) || ts.isBinaryExpression(parent) && parent.operatorToken.kind === ts.SyntaxKind.CommaToken) {
        const steps = []; flattened(parent, steps);
        for (const step of steps) {
          if (step.getStart(emitted) >= node.getStart(emitted)) break;
          if (!ts.isBinaryExpression(step) || step.operatorToken.kind !== ts.SyntaxKind.EqualsToken ||
              !ts.isIdentifier(step.left) || step.left.text !== node.left.text || hookName(step.right) !== "numeric") continue;
          const site = literalSite(step.right, "numeric");
          if (site !== null && rows[site].operation === "closed-primitive-binding-increment") return true;
        }
      }
      current = parent;
    }
    return false;
  }
  function scalarKeyLoop(node) {
    const loop = node.parent;
    if (!ts.isForStatement(loop) || loop.condition !== node || !ts.isIdentifier(node.left) ||
        hookName(node.right) !== "get" || !ts.isStringLiteral(node.right.arguments[1]) || node.right.arguments[1].text !== "length") return false;
    const site = literalSite(node.right, "get"), init = loop.initializer, increment = loop.incrementor;
    return site !== null && rows[site].operation === "loop-clock-checkpoint" &&
      ts.isBinaryExpression(init) && init.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isIdentifier(init.left) && init.left.text === node.left.text && ts.isNumericLiteral(init.right) && init.right.text === "0" &&
      ts.isPostfixUnaryExpression(increment) && increment.operator === ts.SyntaxKind.PlusPlusToken &&
      ts.isIdentifier(increment.operand) && increment.operand.text === node.left.text;
  }
  function emittedWalk(node) {
    if (node.kind === ts.SyntaxKind.SourceFile) { ts.forEachChild(node, emittedWalk); return; }
    if (node.getStart(emitted) < grammarStart) return; //exact reviewed runtime prefix, never credited to grammar IDs.
    const kind = ts.SyntaxKind[node.kind], start = node.getStart(emitted), end = node.end;
    if (effectful(node)) {
      if (emittedEffects.length >= 40000) throw new Error("EMITTED_EFFECT_CAP");
      emittedEffects.push({kind, start, end});
    }
    if (ts.isCallExpression(node)) {
      const hook = hookName(node), site = hook === null ? null : literalSite(node, hook);
      const parentFunction = (() => { let p = node.parent; while (p && !functionNode(p)) p = p.parent; return p; })();
      const bootstrap = !parentFunction;
      if (bootstrap && hook === "emptyArguments" && node.arguments.length === 0) {
        // One fixed zero-argument initializer vector; reviewed runtime guards it.
      } else if (bootstrap && hook === "registerFunction" && node.arguments.length === 5 &&
          ts.isPrefixUnaryExpression(node.arguments[4]) && node.arguments[4].operator === ts.SyntaxKind.MinusToken &&
          ts.isNumericLiteral(node.arguments[4].operand) && node.arguments[4].operand.text === "1" &&
          ts.isIdentifier(node.arguments[0]) && ["__char", "__slice", "__concat", "__codePoint", "__tick", "__refuse", "__number"].includes(node.arguments[0].text)) {
        // Exact private scanner-hook registration, runtime source lineage.
      } else if (site === null) emittedIssue(node, "RAW_CALL_OR_UNKNOWN_HOOK_SIGNATURE");
      else {
        const family = GUARD_FAMILIES.get(rows[site].operation);
        if (!family || !family.has(hook)) emittedIssue(node, "HOOK_NOT_IN_SOURCE_SITE_FAMILY");
        else {
          if (hookSites.length >= 40000) throw new Error("GENERATED_SITE_CAP");
          const span = {hook, start, end}; hookSites.push({site, ...span});
          if (!rows[site].generated) rows[site].generated = [];
          rows[site].generated.push(span);
        }
      }
    } else if (ts.isNewExpression(node) || ts.isRegularExpressionLiteral(node) || member(node) || ts.isDeleteExpression(node)) {
      emittedIssue(node, "RAW_NEW_REGEX_MEMBER_OR_DELETE");
    } else if (ts.isObjectLiteralExpression(node) || ts.isArrayLiteralExpression(node) || ts.isFunctionExpression(node)) {
      const parent = node.parent;
      const expected = ts.isObjectLiteralExpression(node) ? "ownObject" : ts.isArrayLiteralExpression(node) ? "ownArray" : "registerFunction";
      const reserve = ts.isObjectLiteralExpression(node) ? "reserveObject" : ts.isArrayLiteralExpression(node) ? "reserveArray" : "reserveFunction";
      const site = parent && hookName(parent) === expected ? literalSite(parent, expected) : null;
      if (site === null || parent.arguments[0] !== node || !commaDominates(node, reserve, site,
          step => !ts.isObjectLiteralExpression(node) && !ts.isArrayLiteralExpression(node) ||
            ts.isNumericLiteral(step.arguments[0]) && Number(step.arguments[0].text) ===
              (ts.isObjectLiteralExpression(node) ? node.properties.length : node.elements.length)))
        emittedIssue(node, "ALLOCATION_BEFORE_RESERVE_OR_WRONG_LITERAL_SHAPE");
      if (ts.isFunctionExpression(node) && !matchesFrameRegistration(node, parent)) emittedIssue(node, "FUNCTION_FRAME_SHAPE_DRIFT");
    } else if (ts.isFunctionDeclaration(node)) {
      let owner = node.parent;
      while (owner && !functionNode(owner) && owner.kind !== ts.SyntaxKind.SourceFile) owner = owner.parent;
      const statements = owner && functionNode(owner) && ts.isBlock(owner.body) ? owner.body.statements : emitted.statements;
      let registration = null;
      for (const statement of statements) {
        if (!ts.isExpressionStatement(statement) || hookName(statement.expression) !== "registerFunction") continue;
        const target = statement.expression.arguments[0];
        if (target && ts.isIdentifier(target) && node.name && target.text === node.name.text) {
          if (registration !== null) { emittedIssue(node, "DUPLICATE_HOIST_REGISTRATION"); break; }
          registration = statement.expression;
        }
      }
      if (!registration || !matchesFrameRegistration(node, registration)) emittedIssue(node, "HOIST_FRAME_REGISTRATION_MISSING_OR_DRIFT");
      if (!owner || owner.kind === ts.SyntaxKind.SourceFile) {
        if (!node.name || node.name.text !== PREFIX + "initialize") emittedIssue(node, "UNREVIEWED_MODULE_HOIST");
      } else {
        // The containing private function's frame reserves exactly its actual
        // hoisted declaration count before entry, checked when that function is
        // visited. All descendant function expressions have their own inline guard.
        const shape = functionFrame(owner);
        if (shape.nested < 1) emittedIssue(node, "HOIST_NOT_IN_OWNER_PREENTRY_COUNT");
      }
    } else if (ts.isBinaryExpression(node)) {
      const operator = ts.tokenToString(node.operatorToken.kind);
      if (assignmentOperator(node.operatorToken.kind)) {
        if (!ts.isIdentifier(node.left) || node.operatorToken.kind !== ts.SyntaxKind.EqualsToken)
          emittedIssue(node, "RAW_COMPOUND_OR_MEMBER_WRITE");
      } else if (BINARY_COERCIVE.has(operator)) {
        // Only generated scalar temp+/-1 and bounded own-key iteration relations
        // may remain raw. Original coercive operations all use typed helpers.
        const leftTemp = ts.isIdentifier(node.left) && node.left.text.startsWith(PREFIX + "temp");
        const unitStep = ts.isNumericLiteral(node.right) && node.right.text === "1" ||
          ts.isPrefixUnaryExpression(node.right) && node.right.operator === ts.SyntaxKind.MinusToken &&
          ts.isNumericLiteral(node.right.operand) && node.right.operand.text === "1";
        const scalarStep = leftTemp && operator === "+" && unitStep && scalarIncrementOrigin(node);
        const scalarLoop = leftTemp && operator === "<" && scalarKeyLoop(node);
        if (!scalarStep && !scalarLoop) emittedIssue(node, "RAW_COERCIVE_BINARY");
      }
    } else if (ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) {
      if (node.operator === ts.SyntaxKind.ExclamationToken) { /*truthiness has no user coercion*/ }
      else if (node.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(node.operand)) { /*canonical negative numeric constant*/ }
      else if (node.operator === ts.SyntaxKind.PlusPlusToken && ts.isIdentifier(node.operand) && node.operand.text.startsWith(PREFIX + "temp") &&
          ts.isForStatement(node.parent) && scalarKeyLoop(node.parent.condition)) { /*bounded generated own-key index*/ }
      else emittedIssue(node, "RAW_COERCIVE_UNARY");
    } else if (ts.isForInStatement(node) || ts.isForOfStatement(node)) emittedIssue(node, "RAW_IMPLICIT_ENUMERATION");
    else if (ts.isForStatement(node) || ts.isWhileStatement(node) || ts.isDoStatement(node)) {
      const first = ts.isBlock(node.statement) ? node.statement.statements[0] : null;
      if (!first || !ts.isExpressionStatement(first) || hookName(first.expression) !== "tick" || literalSite(first.expression, "tick") === null)
        emittedIssue(node, "LOOP_WITHOUT_FIRST_CLOCK_GUARD");
    }
    ts.forEachChild(node, emittedWalk);
  }
  emittedWalk(emitted);
  for (const record of rows) {
    if (record.hook !== "LOWERED_CHILD" && record.hook !== "FIXED_FRAME_SLOT") continue;
    const owner = rows[record.ownerSite];
    if (owner && owner.generated) record.generated = owner.generated;
  }
  for (const record of rows) {
    if (record.hook === "REMOVED" || record.hook === "SCALAR_REPLACEMENT") continue;
    if (!record.generated || !record.generated.length) open.push({site: record.id, reason: "GENERATED_GUARD_SPAN_MISSING"});
  }
  if (unmatched.length) open.push({reason: "UNMATCHED_ORIGINAL_OCCURRENCES", count: unmatched.length});
  if (emittedUnknown.length) open.push({reason: "UNCLASSIFIED_OR_NONDOMINATED_GENERATED_EFFECTS", count: emittedUnknown.length});
  const ruleManifest = [];
  const knownRules = new Set(Object.values(RULES).map(rule => rule.id));
  for (const [operation, rule] of Object.entries(RULES)) {
    const dependencies = RULE_DEPENDENCIES[rule.id];
    if (!Array.isArray(dependencies) || dependencies.some(id => !knownRules.has(id))) throw new Error("RULE_TRANSITIVE_REFERENCE_DRIFT");
    ruleManifest.push({operation, ...rule, transitiveRuleIds: dependencies,
      runtimeRuleVersion: "TIP081_P2_PRIVATE_GUARD_RULES_V6_UNADMITTED",
      profileId: "P2_ECMA15_SCRIPT_MODULE_PRIVATE_FIXED19",
      precondition: "fixed private ownership/registered callable and closed supported profile; typed bounds checked before each applicable runtime operation",
      actualMissingGuardControl: "P2G100 removes a real array reserve in emitted source; exact tuple refuses BEFORE modified import",
      fixtureEvidence: "UNRUN; finite literal/control family references, not per-path/site execution or deep AST semantic proof"});
  }
  for (const record of rows) if (!knownRules.has(record.ruleId)) open.push({site: record.id, reason: "MISSING_TOTAL_RULE_REFERENCE"});
  return {purpose: "TIP081_P2_OFFLINE_DERIVATION_CANDIDATE_ONLY", parserAdmission: "ALLOCATION_COVERAGE_OPEN",
    installedParserImported: false, sourcePin: PIN, packagePin: PACKAGE_PIN,
    sourceBytes: originalBytes.length, candidate, rows, open, unmatched, startup,
    staticBytes: staticBytes + 32, workspace, workspaceSegmentBytes, workspaceBytes, hookSites, emittedEffects, emittedUnknown, ruleManifest, staticArrayAudit,
    scalarHelperSource: SCALAR_GRAMMAR_HELPERS, candidateHash: digest(candidate),
    inventoryHash: digest(JSON.stringify(rows)), runtimeHash: digest(runtime)};
}
