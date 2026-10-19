// Main-owned OFFLINE derivation. Inputs are fixed reviewed TOOL SOURCE, never a
// target/source lease. Do not import this tool until complete source capture/review.
import ts from "typescript";
import {openSync, fstatSync, readSync, closeSync, constants} from "node:fs";
import {createHash} from "node:crypto";

const ROOT = "/Users/os/hiveos/";
const P2 = Object.freeze({
  candidate: {path: "scripts/test/generated/private-grammar-tip081-p2.checked.candidate.mjs", bytes: 931985,
    sha256: "114334cd56f1edd181acf27e89fda40d6fca9c96e6f1a311532f346f43ae62ef"},
  inventory: {path: "scripts/test/generated/private-grammar-tip081-p2.checked.inventory.json", bytes: 5710072,
    sha256: "41cfffe1f86a1499a490345ca059a54ace1f33d75bf77f8c8093fe19db3843e9"},
  profile: {path: "scripts/test/generated/private-grammar-tip081-p2.checked.profile.json", bytes: 2491,
    sha256: "9bc54a3542094a08a3d45fbf5b66c2feb8ffde72de4ca6efedfeac57ed6f47b8"},
});
const PREFIX = "__HIVE_P2_";
const FAMILY = ["NODE_SCHEMA", "ARRAY_BACKING", "DERIVED_STRING", "CALL_FRAME", "BOOKKEEPING"];
const REMOVED = new Set(["createSyntheticGrammarFixtureP2", "analyzeSyntheticGrammarFixtureP2",
  "observeSyntheticGrammarFixtureP2", "retireSyntheticGrammarFixtureP2", "__HIVE_P2_observe"]);
const SEAM = "\nfunction __HIVE_P2_initialize() ";
const PRELUDE = "const __HIVE_P2_RUNTIME_STATIC_BYTES=377040;\nconst __HIVE_P2_RUNTIME_WORKSPACE_BYTES=2757504;\n";
const ALIAS_CLEAR = "state.producerRoot = null; // P3_ALIAS_CLEAR";
const ALIAS_RETAIN = "state.producerRoot = state.producerRoot; // P3_ALIAS_FAULT_RETAIN";
const TOOL_DECODER = new TextDecoder("utf-8", {fatal: true, ignoreBOM: true});
const TOOL_DECODE = Function.prototype.call.bind(TextDecoder.prototype.decode, TOOL_DECODER);

export function hashP3Tool(bytes) { return createHash("sha256").update(bytes).digest("hex"); }
export function readP3Tool(path, maximum, pin = null) {
  // All callers below supply literal reviewed paths. No path from wire/profile/env.
  let fd = null;
  try {
    fd = openSync(ROOT + path, constants.O_RDONLY | constants.O_NOFOLLOW);
    const before = fstatSync(fd);
    if (!before.isFile() || !Number.isSafeInteger(before.size) || before.size < 1 || before.size > maximum ||
        pin !== null && before.size !== pin.bytes) throw new Error("P3_TOOL_SIZE_DRIFT");
    const bytes = Buffer.alloc(before.size);
    let offset = 0;
    while (offset < bytes.length) {
      const n = readSync(fd, bytes, offset, Math.min(32768, bytes.length - offset), offset);
      if (!n) throw new Error("P3_TOOL_SHORT_READ");
      offset += n;
    }
    const probe = Buffer.alloc(1);
    if (readSync(fd, probe, 0, 1, bytes.length)) throw new Error("P3_TOOL_GREW");
    const after = fstatSync(fd);
    if (after.dev !== before.dev || after.ino !== before.ino || after.size !== before.size ||
        after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs ||
        pin !== null && hashP3Tool(bytes) !== pin.sha256) throw new Error("P3_TOOL_PIN_DRIFT");
    return bytes;
  } finally { if (fd !== null) closeSync(fd); }
}
function parsed(text, label) {
  if (text.length > 2228288) throw new Error("P3_TOOL_TEXT_CAP");
  const tree = ts.createSourceFile(label, text, ts.ScriptTarget.ESNext, true, ts.ScriptKind.JS);
  if (tree.parseDiagnostics.length) throw new Error("P3_TOOL_SOURCE_SYNTAX");
  return tree;
}
function onlySeam(text, seam) {
  const at = text.indexOf(seam);
  if (at < 0 || text.indexOf(seam, at + 1) >= 0) throw new Error("P3_TOOL_SEAM_DRIFT");
  return at;
}
function literalVerifier(template) {
  const tree = parsed(template, "fixed-p3-verifier-template.mjs");
  let found = null;
  for (const statement of tree.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== "PRIVATE_SUMMARY_VERIFIER_P3") continue;
      const init = declaration.initializer;
      if (found !== null || !init || !ts.isTaggedTemplateExpression(init) ||
          init.tag.getText(tree) !== "String.raw" || !ts.isNoSubstitutionTemplateLiteral(init.template))
        throw new Error("P3_VERIFIER_TEMPLATE_DRIFT");
      found = init.template.getText(tree).slice(1, -1);
      if (found.includes("\\`")) throw new Error("P3_VERIFIER_TEMPLATE_ESCAPE_OPEN");
    }
  }
  if (found === null) throw new Error("P3_VERIFIER_TEMPLATE_MISSING");
  return found;
}

// Exact inherited source-site classification. No default-family fallback. Mixed
// formulas split into the same component costs before the original allocation;
// nodes/entries debit once. Each occurrence and replacement is emitted for review.
function familyFor(owner, first) {
  if (owner === PREFIX + "meta" && first === "224") return 4;
  if (owner === PREFIX + "reserveObject") return 0;
  if (owner === PREFIX + "ownObject" && first === "16") return 4;
  if (owner === PREFIX + "reserveArray") return 1;
  if (owner === PREFIX + "ownArray" && first === "16") return 4;
  if (owner === PREFIX + "reserveFunction" && first === "192") return 3;
  if (owner === PREFIX + "registerFunction" && ["176", "128", "16"].includes(first)) return 4;
  if (owner === PREFIX + "frame") return 3;
  if (owner === PREFIX + "construct" && first === "80") return 0;
  if (["get", "defineData", "hasProperty", "indexOf"].includes(owner.slice(PREFIX.length)) &&
      (first === "128" || first === "16")) return 4;
  if (owner === PREFIX + "set") {
    if (first === "16") return 0;
    if (first === "128" || first === "0") return 4;
    if (first.startsWith("__HIVE_P2_plus(88,")) return 1;
  }
  if (owner === PREFIX + "remove" && first === "16") return 0;
  if (["primitiveString", "concat", "primitive", "slice", "codePoint", "number", "keys"].includes(owner.slice(PREFIX.length))) return 2;
  if (owner === PREFIX + "native" && first === "128") return 4;
  throw new Error("P3_RESERVE_FAMILY_OPEN:" + owner + ":" + first);
}
function mappedCall(call, tree, owner) {
  const args = call.arguments.map(arg => arg.getText(tree));
  if (args.length < 1 || args.length > 3) throw new Error("P3_RESERVE_ARITY_DRIFT");
  const n = args[1] || "0", e = args[2] || "0";
  if (owner === PREFIX + "set" && args[0] === "__HIVE_P2_plus(72, __HIVE_P2_product(keyString.length, 2))") {
    return {families: [0, 2], replacement: "(__HIVE_P2_reserve(72," + n + "," + e + ",0)," +
      "__HIVE_P2_reserve(__HIVE_P2_product(keyString.length,2),0,0,2))"};
  }
  if (owner === PREFIX + "native" && args[0] === "__HIVE_P2_plus(88, __HIVE_P2_product(names[i].length, 2))") {
    return {families: [0, 2], replacement: "(__HIVE_P2_reserve(88," + n + "," + e + ",0)," +
      "__HIVE_P2_reserve(__HIVE_P2_product(names[i].length,2),0,0,2))"};
  }
  const family = familyFor(owner, args[0]);
  return {families: [family], replacement: "__HIVE_P2_reserve(" + args[0] + "," + n + "," + e + "," + family + ")"};
}
function replaceRuntime(runtime) {
  const tree = parsed(runtime, "fixed-p2-runtime-prefix.mjs"), edits = [], reserves = [], removed = [];
  let disposal = 0, reservation = 0;
  for (const statement of tree.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name) {
      const name = statement.name.text;
      if (REMOVED.has(name)) {
        edits.push({start: statement.getStart(tree), end: statement.end, text: ""}); removed.push(name); continue;
      }
      if (name === PREFIX + "dispose") {
        disposal++;
        edits.push({start: statement.getStart(tree), end: statement.end,
          text: "function __HIVE_P2_dispose() { __HIVE_P3_dispose(); }"}); continue;
      }
      if (name === PREFIX + "reserve") {
        reservation++;
        edits.push({start: statement.getStart(tree), end: statement.end,
          text: "function __HIVE_P2_reserve(bytes,nodes=0,entries=0,family) { __HIVE_P3_commonReserve(bytes,nodes,entries,family); }"}); continue;
      }
    }
    function visit(node, owner) {
      if (ts.isFunctionDeclaration(node) && node.name) owner = node.name.text;
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === PREFIX + "reserve") {
        const mapped = mappedCall(node, tree, owner);
        const row = {owner, start: node.getStart(tree), end: node.end, original: node.getText(tree),
          replacement: mapped.replacement, families: mapped.families.map(f => FAMILY[f])};
        reserves.push(row); edits.push({start: row.start, end: row.end, text: row.replacement});
      }
      ts.forEachChild(node, child => visit(child, owner));
    }
    visit(statement, "MODULE");
  }
  if (removed.length !== REMOVED.size || disposal !== 1 || reservation !== 1) throw new Error("P3_RUNTIME_SURFACE_DRIFT");
  edits.sort((a, b) => a.start - b.start);
  let result = "", prior = 0;
  for (const edit of edits) {
    if (edit.start < prior) throw new Error("P3_OVERLAPPING_EDITS");
    result += runtime.slice(prior, edit.start) + edit.text; prior = edit.end;
  }
  result += runtime.slice(prior);
  return {result, reserves, edits, removed};
}
function functionKind(node) {
  return ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) || ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node);
}
function functionShape(fn) {
  let locals = 0, nested = 0;
  function visit(node) {
    if (node !== fn && functionKind(node)) { nested++; return; }
    if (ts.isVariableDeclaration(node) || ts.isBindingElement(node)) locals++;
    ts.forEachChild(node, visit);
  }
  visit(fn);
  return {locals, parameters: fn.parameters.length, nested};
}
function inventorySource(text, runtimeEnd) {
  const tree = parsed(text, "fixed-new-p3-source.mjs"), startup = [], workspace = [];
  let staticBytes = 0, inheritedSegment = 0, newSegment = 0;
  const newFunctions = new Map();
  function site(node, kind, bytes) {
    if (startup.length >= 20000 || !Number.isSafeInteger(bytes) || bytes < 0 || bytes > 67108864 - staticBytes)
      throw new Error("P3_STATIC_COST_CAP");
    startup.push({start: node.getStart(tree), end: node.end, kind, bytes}); staticBytes += bytes;
  }
  function visit(node, depth) {
    if (ts.isStringLiteral(node)) site(node, "C01_LITERAL_STRING", 32 + 2 * node.text.length);
    if (ts.isPropertyAssignment(node) && !ts.isComputedPropertyName(node.name))
      site(node.name, "C01_PROPERTY_KEY", 32 + 2 * node.name.text.length);
    if (depth === 0 && ts.isFunctionDeclaration(node)) site(node, "C01_FUNCTION_PROTOTYPE", 192);
    if (depth === 0 && ts.isVariableDeclaration(node)) site(node, "C01_BINDING", 16);
    if (depth === 0 && ts.isObjectLiteralExpression(node)) {
      let actualFields = node.properties.length;
      for (const property of node.properties) {
        if (ts.isPropertyAssignment(property) && !ts.isComputedPropertyName(property.name) &&
            (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) && property.name.text === "__proto__") {
          actualFields--; site(property, "C01_LITERAL_NULL_PROTOTYPE_SYNTAX", 16);
        }
      }
      site(node, "C01_OBJECT_SCHEMA", 64 + 16 * actualFields);
    }
    if (depth === 0 && ts.isArrayLiteralExpression(node)) {
      if (node.elements.some(e => ts.isSpreadElement(e) || ts.isOmittedExpression(e))) throw new Error("P3_STATIC_ARRAY_OPEN");
      site(node, "C01_ARRAY_BACKING", 88 + 8 * node.elements.length);
    }
    // Dynamic bootstrap descriptors/sanitizations have explicit commonReserve
    // debits before the operation; do not also charge them as startup pool sites.
    if (depth === 0 && ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === "bind")
      site(node, "C01_CAPTURED_BOUND_FUNCTION", 96);
    if (depth === 0 && ts.isNewExpression(node)) {
      if (!ts.isIdentifier(node.expression)) throw new Error("P3_STATIC_CONSTRUCTOR_OPEN");
      if (node.expression.text === "WeakMap" && (!node.arguments || node.arguments.length === 0)) site(node, "C01_WEAK_HEADER", 96);
      else if (node.expression.text === "__HIVE_P3_TextDecoder") {
        const args = node.arguments;
        if (!args || args.length !== 2 || !ts.isStringLiteral(args[0]) || args[0].text !== "utf-8" ||
            !ts.isObjectLiteralExpression(args[1]) || args[1].properties.length !== 3) throw new Error("P3_STATIC_DECODER_SHAPE");
        const proto = args[1].properties[0];
        if (!ts.isPropertyAssignment(proto) || proto.name.getText(tree) !== "__proto__" ||
            proto.initializer.kind !== ts.SyntaxKind.NullKeyword) throw new Error("P3_STATIC_DECODER_PROTOTYPE");
        const expected = ["fatal", "ignoreBOM"];
        for (let i = 0; i < expected.length; i++) {
          const property = args[1].properties[i + 1];
          if (!ts.isPropertyAssignment(property) || property.name.getText(tree) !== expected[i] ||
              property.initializer.kind !== ts.SyntaxKind.TrueKeyword) throw new Error("P3_STATIC_DECODER_OPTIONS");
        }
        // Closed native ASCII-output context logical convention, not measured RSS.
        // Its two-field literal options are independently charged by OBJECT_SCHEMA.
        site(node, "C01_FIXED_ASCII_DECODER_CONTEXT", 4096);
      } else throw new Error("P3_STATIC_CONSTRUCTOR_OPEN");
    }
    if (depth === 0 && ts.isFunctionDeclaration(node) && node.getStart(tree) < runtimeEnd) {
      const shape = functionShape(node), bytes = 64 + 16 * (shape.locals + shape.parameters);
      if (shape.nested !== 0) throw new Error("P3_DIRECT_HELPER_CLOSURE_OPEN");
      const name = node.name?.text;
      if (!name) throw new Error("P3_DIRECT_HELPER_NAME_OPEN");
      const inherited = name.startsWith(PREFIX);
      workspace.push({name, start: node.getStart(tree), end: node.end, ...shape, bytes,
        domain: inherited ? "INHERITED_P2" : "NEW_P3", coexistence: inherited ? 258 : 1});
      if (inherited) inheritedSegment += bytes;
      else {
        if (newFunctions.has(name)) throw new Error("P3_HELPER_DUPLICATE");
        newFunctions.set(name, node); newSegment += bytes;
      }
    }
    ts.forEachChild(node, child => visit(child, functionKind(node) ? depth + 1 : depth));
  }
  visit(tree, 0);
  const callGraph = [];
  for (const [name, fn] of newFunctions) {
    const edges = new Set();
    function calls(node) {
      if (node !== fn && functionKind(node)) throw new Error("P3_NESTED_HELPER_OPEN");
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && newFunctions.has(node.expression.text))
        edges.add(node.expression.text);
      ts.forEachChild(node, calls);
    }
    calls(fn); callGraph.push({name, calls: [...edges].sort()});
  }
  const colors = new Map(), edges = new Map(callGraph.map(row => [row.name, row.calls]));
  function acyclic(name) {
    if (colors.get(name) === 1) throw new Error("P3_HELPER_REENTRY_OPEN:" + name);
    if (colors.get(name) === 2) return;
    colors.set(name, 1);
    for (const next of edges.get(name)) acyclic(next);
    colors.set(name, 2);
  }
  for (const name of newFunctions.keys()) acyclic(name);
  // P2 retains its previously reviewed control-graph bound. NEW helpers are
  // independently acyclic and use explicit iterative traversal/decoder storage;
  // source review must confirm no dynamic/helper callback or P2->same-P3 reentry.
  // Hence each NEW helper frame can coexist at most once, not 258 times.
  const workspaceBytes = inheritedSegment * 2 * 129 + newSegment;
  if (!Number.isSafeInteger(workspaceBytes) || workspaceBytes > 67108864 - staticBytes - 32)
    throw new Error("P3_WORKSPACE_COST_CAP");
  return {startup, staticBytes: staticBytes + 32, workspace, inheritedWorkspaceSegmentBytes: inheritedSegment,
    newWorkspaceSegmentBytes: newSegment, newHelperCallGraph: callGraph, newHelperRecursion: "NONE_ACYCLIC",
    indirectReentryReview: "REQUIRED_BEFORE_ADMISSION", workspaceBytes};
}
function prelude(cost) {
  return "const __HIVE_P2_RUNTIME_STATIC_BYTES=" + cost.staticBytes + ";\n" +
    "const __HIVE_P2_RUNTIME_WORKSPACE_BYTES=" + cost.workspaceBytes + ";\n";
}
function producerControlShape(source) {
  const tree = parsed(source, "fixed-p3-owner-control-shape.mjs");
  const fields = {}, declarations = new Map();
  function ownFields(object) {
    if (!ts.isObjectLiteralExpression(object)) throw new Error("P3_CONTROL_LITERAL_OPEN");
    let n = 0;
    for (const prop of object.properties) {
      if (ts.isSpreadAssignment(prop) || ts.isComputedPropertyName(prop.name)) throw new Error("P3_CONTROL_FIELD_OPEN");
      if (!(ts.isPropertyAssignment(prop) &&
          (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) && prop.name.text === "__proto__")) n++;
    }
    return n;
  }
  for (const statement of tree.statements) {
    if (ts.isVariableStatement(statement)) for (const d of statement.declarationList.declarations)
      if (ts.isIdentifier(d.name)) declarations.set(d.name.text, d.initializer);
    if (!ts.isFunctionDeclaration(statement) || !statement.name) continue;
    const name = statement.name.text;
    function visit(node) {
      if (node !== statement && functionKind(node)) return;
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
        if (name === "createSyntheticSummaryP3" && node.name.text === "state") fields.owner = ownFields(node.initializer);
        if (name === "createSyntheticSummaryP3" && node.name.text === "handle") {
          if (!ts.isCallExpression(node.initializer) || node.initializer.arguments.length !== 1) throw new Error("P3_HANDLE_SHAPE_OPEN");
          fields.handle = ownFields(node.initializer.arguments[0]);
        }
        if (name === "__HIVE_P3_metadata" && node.name.text === "metadata") fields.metadata = ownFields(node.initializer);
      }
      if (name === "__HIVE_P3_frame" && ts.isReturnStatement(node) && node.expression) fields.frame = ownFields(node.expression);
      ts.forEachChild(node, visit);
    }
    visit(statement);
  }
  const declared = declarations.get("__HIVE_P3_OWNER_FIELDS");
  if (!declared || !ts.isNumericLiteral(declared) || Number(declared.text) !== fields.owner ||
      fields.handle !== 2 || fields.metadata !== 27 || fields.frame !== 16) throw new Error("P3_CONTROL_FIELD_DRIFT");
  return {...fields, ownerBytes: 64 + 16 * fields.owner, handleBytes: 64 + 16 * fields.handle,
    metadataBytes: 64 + 16 * fields.metadata, frameBytes: 64 + 16 * fields.frame};
}
export function derivePrivateSummaryP3() {
  if (arguments.length !== 0) throw new Error("P3_TOOL_ARITY");
  const oldCandidate = TOOL_DECODE(readP3Tool(P2.candidate.path, 2228288, P2.candidate));
  const inventoryBytes = readP3Tool(P2.inventory.path, 16777216, P2.inventory);
  const profileBytes = readP3Tool(P2.profile.path, 65536, P2.profile);
  if (!oldCandidate.startsWith(PRELUDE)) throw new Error("P3_COST_PRELUDE_DRIFT");
  const oldStart = onlySeam(oldCandidate, SEAM), suffix = oldCandidate.slice(oldStart);
  const priorPrefix = oldCandidate.slice(PRELUDE.length, oldStart);
  const change = replaceRuntime(priorPrefix);
  const producerBytes = readP3Tool("scripts/test/private-summary-runtime-tip081-p3.mjs", 131072);
  const verifierBytes = readP3Tool("scripts/test/private-summary-verifier-tip081-p3.mjs", 131072);
  const producer = TOOL_DECODE(producerBytes), verifier = literalVerifier(TOOL_DECODE(verifierBytes));
  const controlShape = producerControlShape(producer);
  const prefix = change.result + "\n" + producer + "\n" + verifier;
  onlySeam(prefix, ALIAS_CLEAR);
  const normalCost = inventorySource(prefix + suffix, prefix.length);
  const normalPrelude = prelude(normalCost), normal = normalPrelude + prefix + suffix;
  const faultPrefix = prefix.replace(ALIAS_CLEAR, ALIAS_RETAIN);
  const faultCost = inventorySource(faultPrefix + suffix, faultPrefix.length);
  const faultPrelude = prelude(faultCost), fault = faultPrelude + faultPrefix + suffix;
  const normalStart = normalPrelude.length + prefix.length, faultStart = faultPrelude.length + faultPrefix.length;
  if (normal.slice(normalStart) !== suffix || fault.slice(faultStart) !== suffix) throw new Error("P3_SUFFIX_BYTE_DRIFT");
  const oldMap = JSON.parse(TOOL_DECODE(inventoryBytes));
  const oldProfile = JSON.parse(TOOL_DECODE(profileBytes));
  if (!Array.isArray(oldMap.rows) || oldMap.rows.length !== 7274) throw new Error("P3_PARENT_MAP_DRIFT");
  const parent = {candidate: P2.candidate, inventory: P2.inventory, profile: P2.profile,
    grammarSuffixHash: hashP3Tool(suffix), oldGrammarUtf16Start: oldStart, grammarBytes: Buffer.byteLength(suffix),
    immutableParentRows: oldMap.rows.length, originalParserHash: oldProfile.originalPins.sourceSha256};
  function artifacts(candidate, cost, grammarStart, domain) {
    const inventory = {version: 1, purpose: "TIP081_P3_SOURCE_ONLY_DERIVATION_INVENTORY", domain,
      authority: "NOT_ISSUED", checks: "UNRUN", realParserDisabled: true, parent,
      candidateHash: hashP3Tool(candidate), grammarUtf16Start: grammarStart, offsetDelta: grammarStart - oldStart,
      byteIdenticalGrammarSuffix: true, runtimeReserves: change.reserves, runtimeEdits: change.edits,
      producerSourceHash: hashP3Tool(producerBytes), verifierSourceHash: hashP3Tool(verifierBytes),
      controlShape, staticAndWorkspace: cost, commonGrammarAllocationRisk: "OPEN", emittedSourceReview: "REQUIRED"};
    const profile = {version: 1, purpose: domain === "NORMAL" ? "TIP081_P3_SYNTHETIC_PROFILE" : "TIP081_P3_ALIAS_FAULT_TEST_ONLY_PROFILE",
      profile: "P3_ECMA15_FIXED19_COMMON_GRAMMAR", domain, authority: "NOT_ISSUED", checks: "UNRUN",
      realParserDisabled: true, optionsByProfile: oldProfile.optionsByProfile, byteLimit: 67108864,
      summaryByteLimit: 16384, visitsPerStage: 200000, entries: 20000, sites: 512, depth: 128,
      ttlMaximum: 120000, semanticCoverage: "OPEN_COMMON_GRAMMAR_RISK", allocatorCoverage: "COMMON_MODE",
      graphStatus: "OPEN", predecessorOpen: 62, fullRuntimeClosure: "NOT_ACCEPTED", execution: false, materialization: false};
    return {candidate, inventory: JSON.stringify(inventory), profile: JSON.stringify(profile)};
  }
  return {normal: artifacts(normal, normalCost, normalStart, "NORMAL"),
    aliasFault: artifacts(fault, faultCost, faultStart, "ALIAS_FAULT_TEST_ONLY"),
    review: {parent, faultMutation: {original: ALIAS_CLEAR, replacement: ALIAS_RETAIN,
      sourceUtf16Offset: normal.indexOf(ALIAS_CLEAR), byteDelta: Buffer.byteLength(ALIAS_RETAIN) - Buffer.byteLength(ALIAS_CLEAR)},
    normalHash: hashP3Tool(normal), faultHash: hashP3Tool(fault), suffixComparison: "BYTE_IDENTICAL", checks: "UNRUN"}};
}
