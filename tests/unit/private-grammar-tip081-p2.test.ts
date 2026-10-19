import {afterEach, describe, expect, it, vi} from "vitest";
import {performance as trustedPerformance} from "node:perf_hooks";
import {openSync, fstatSync, readSync, closeSync, constants} from "node:fs";
import {loadAdmittedSyntheticGrammarP2,
  verifySyntheticGrammarArtifactP2} from "../../scripts/test/admit-private-grammar-tip081-p2.mjs";

// Main must issue the trusted fixed manifest only after independent emitted-source
// review. This loader has no path/pin/source/flag arguments. No Acorn oracle exists.
const grammar = await loadAdmittedSyntheticGrammarP2();
const CAP = 67108864;
type Profile = "SCRIPT" | "MODULE";
type Handle = ReturnType<typeof grammar.createSyntheticGrammarFixtureP2>;
const handles: Handle[] = [];
function fixture(text: string, profile: Profile = "SCRIPT", cap = CAP, ttl = 120000) {
  const handle = grammar.createSyntheticGrammarFixtureP2(text, profile, cap, ttl);
  handles.push(handle);
  return handle;
}
function refused(action: () => unknown, code: string) {
  let caught: unknown;
  try { action(); } catch (error) { caught = error; }
  expect(caught).toMatchObject({code, realParserDisabled: true});
}
// New generated artifacts only, after the trusted loader admitted the fixed tuple.
// Same-FD type/size/read/identity discipline. This helper is private test code;
// it never reads installed parser text, target roots or environment files.
function artifact(path: string, maximum: number) {
  const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = fstatSync(fd);
    if (!before.isFile() || !Number.isSafeInteger(before.size) || before.size < 1 || before.size > maximum) {
      throw new Error("TRUSTED_ARTIFACT_SIZE");
    }
    const bytes = Buffer.alloc(before.size);
    let position = 0;
    while (position < bytes.length) {
      const amount = Math.min(32768, bytes.length - position);
      const read = readSync(fd, bytes, position, amount, position);
      if (read === 0) throw new Error("TRUSTED_ARTIFACT_SHORT_READ");
      position += read;
    }
    const probe = Buffer.alloc(1);
    if (readSync(fd, probe, 0, 1, bytes.length) !== 0) throw new Error("TRUSTED_ARTIFACT_GROWTH");
    const after = fstatSync(fd);
    if (after.dev !== before.dev || after.ino !== before.ino || after.size !== before.size ||
        after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs) throw new Error("TRUSTED_ARTIFACT_IDENTITY");
    return new TextDecoder("utf-8", {fatal: true}).decode(bytes);
  } finally { closeSync(fd); }
}
function admittedArtifacts() {
  const candidate = artifact("/Users/os/hiveos/scripts/test/generated/private-grammar-tip081-p2.checked.candidate.mjs", 8913152);
  const inventory = artifact("/Users/os/hiveos/scripts/test/generated/private-grammar-tip081-p2.checked.inventory.json", 16777216);
  const profile = artifact("/Users/os/hiveos/scripts/test/generated/private-grammar-tip081-p2.checked.profile.json", 65536);
  expect(verifySyntheticGrammarArtifactP2(candidate, inventory, profile)).toBe(true);
  return {candidate, inventory, profile};
}
afterEach(() => {
  vi.restoreAllMocks(); vi.unstubAllGlobals();
  for (const handle of handles.splice(0)) {
    try { grammar.retireSyntheticGrammarFixtureP2(handle); }
    catch { /* A completed owned refusal already retired this private handle. */ }
  }
});

// Hand-derived production controls. Success/type/count is finite evidence only,
// not deep AST equivalence, complete grammar proof or resource closure.
const positives: readonly [string, string, Profile, number, string, number | null][] = [
  ["P2G001 empty program", "", "SCRIPT", 0, "NONE", null],
  ["P2G002 numeric literal", "42;", "SCRIPT", 1, "ExpressionStatement", 42],
  ["P2G003 binary precedence production, not evaluation", "a + b * c;", "SCRIPT", 1, "ExpressionStatement", null],
  ["P2G004 assignment destructuring and member target", "({x: obj.x} = value);", "SCRIPT", 1, "ExpressionStatement", null],
  ["P2G005 lexical declaration pattern/default/rest", "const [a=1,...rest] = xs;", "SCRIPT", 1, "VariableDeclaration", null],
  ["P2G006 object binding pattern/default/rest", "let {x:y=1,...rest} = obj;", "SCRIPT", 1, "VariableDeclaration", null],
  ["P2G007 block and nested scopes", "{let x=1; {const y=x;}}", "SCRIPT", 1, "BlockStatement", null],
  ["P2G008 if and else", "if(ok) foo(); else bar();", "SCRIPT", 1, "IfStatement", null],
  ["P2G009 while break", "while(ok){break;}", "SCRIPT", 1, "WhileStatement", null],
  ["P2G010 do while continue", "do{continue;}while(ok);", "SCRIPT", 1, "DoWhileStatement", null],
  ["P2G011 classic for update", "for(let i=0;i<3;i++){use(i);}", "SCRIPT", 1, "ForStatement", null],
  ["P2G012 for in", "for(const key in obj){use(key);}", "SCRIPT", 1, "ForInStatement", null],
  ["P2G013 for of", "for(const value of xs){use(value);}", "SCRIPT", 1, "ForOfStatement", null],
  ["P2G014 top module for await", "for await(const value of xs){use(value);}", "MODULE", 1, "ForOfStatement", null],
  ["P2G015 labelled break/continue scopes", "outer: for(;;){inner: while(ok){continue outer;}break outer;}", "SCRIPT", 1, "LabeledStatement", null],
  ["P2G016 switch/default", "switch(x){case 1: run(); break; default: stop();}", "SCRIPT", 1, "SwitchStatement", null],
  ["P2G017 try destructuring catch finally", "try{run();}catch({message}){use(message);}finally{cleanup();}", "SCRIPT", 1, "TryStatement", null],
  ["P2G018 throw/new/spread", "throw new Error(...args);", "SCRIPT", 1, "ThrowStatement", null],
  ["P2G019 sloppy with", "with(obj){x;}", "SCRIPT", 1, "WithStatement", null],
  ["P2G020 debugger and empty statement", "debugger;;", "SCRIPT", 2, "DebuggerStatement", null],
  ["P2G021 function parameters/return/default/rest", "function f(a=1,...rest){return a;}", "SCRIPT", 1, "FunctionDeclaration", null],
  ["P2G022 async generator/yield/await", "async function* f(){yield await value;}", "SCRIPT", 1, "FunctionDeclaration", null],
  ["P2G023 named function expression", "const f=function named(x){return x;};", "SCRIPT", 1, "VariableDeclaration", null],
  ["P2G024 async arrow and rest", "const f=async(a=1,...rest)=>await a;", "SCRIPT", 1, "VariableDeclaration", null],
  ["P2G025 parenthesis tentative fallback sequence", "(a,b);", "SCRIPT", 1, "ExpressionStatement", null],
  ["P2G026 async tentative ordinary call", "async(x);", "SCRIPT", 1, "ExpressionStatement", null],
  ["P2G027 class derived/private/static/getter/setter", "class C extends B{#x=1;static #y=2;constructor(...xs){super(...xs);}get x(){return this.#x;}set x(v){this.#x=v;}has(o){return #x in o;}static{this.z=3;}}", "SCRIPT", 1, "ClassDeclaration", null],
  ["P2G028 class expression/method async generator", "const C=class{async *m(){yield await x;}};", "SCRIPT", 1, "VariableDeclaration", null],
  ["P2G029 optional chaining/coalesce", "obj?.method?.(arg) ?? fallback;", "SCRIPT", 1, "ExpressionStatement", null],
  ["P2G030 object methods/computed/accessors/spread", "({[key]:value,get x(){return 1;},set x(v){},...rest});", "SCRIPT", 1, "ExpressionStatement", null],
  ["P2G031 array holes/spread", "[1,,...xs];", "SCRIPT", 1, "ExpressionStatement", null],
  ["P2G032 tagged template interpolation", "tag`a${value}b`;", "SCRIPT", 1, "ExpressionStatement", null],
  ["P2G033 untagged multiline template", "`a\r\nb`;", "SCRIPT", 1, "ExpressionStatement", null],
  ["P2G034 tagged invalid escape fallback", "tag`\\xZ1`;", "SCRIPT", 1, "ExpressionStatement", null],
  ["P2G035 import clauses/default/namespace/side effect", "import x,{y as z} from 'm';import * as ns from 'n';import 'side';", "MODULE", 3, "ImportDeclaration", null],
  ["P2G036 string imported module name", "import {'x-y' as x} from 'm';", "MODULE", 1, "ImportDeclaration", null],
  ["P2G037 export named declaration", "export const x=1;", "MODULE", 1, "ExportNamedDeclaration", null],
  ["P2G038 export default anonymous function", "export default function(){}", "MODULE", 1, "ExportDefaultDeclaration", null],
  ["P2G039 export default anonymous class", "export default class{}", "MODULE", 1, "ExportDefaultDeclaration", null],
  ["P2G040 export namespace", "export * as ns from 'm';", "MODULE", 1, "ExportAllDeclaration", null],
  ["P2G041 local export and surrogate-pair string name", "const x=1;export{x as '\\uD83D\\uDE00'};", "MODULE", 2, "VariableDeclaration", null],
  ["P2G042 dynamic import trivia exec", "import /*c*/ ('m');", "SCRIPT", 1, "ExpressionStatement", null],
  ["P2G043 import meta", "import.meta;", "MODULE", 1, "ExpressionStatement", null],
  ["P2G044 module top await", "await promise;", "MODULE", 1, "ExpressionStatement", null],
  ["P2G045 raw strict EOF repair", "'use strict'", "SCRIPT", 1, "ExpressionStatement", null],
  ["P2G046 escaped directive does not enable strict", "'use\\x20strict';with(obj){}", "SCRIPT", 2, "ExpressionStatement", null],
  ["P2G047 word operator directive continuation", "'use strict'\nin obj;with(obj){}", "SCRIPT", 2, "ExpressionStatement", null],
  ["P2G048 earlier quote continuation blocks later directive", "'x'\ninstanceof C;'use strict';with(obj){}", "SCRIPT", 3, "ExpressionStatement", null],
  ["P2G049 escaped ASCII identifier", "var \\u0061=1;a;", "SCRIPT", 2, "VariableDeclaration", null],
  ["P2G050 Unicode space identifier/number boundary", "let x\u00a0=1\u2028x;", "SCRIPT", 2, "VariableDeclaration", null],
  ["P2G051 hashbang absolute start", "#!/usr/bin/env node\n1;", "SCRIPT", 1, "ExpressionStatement", 1],
  ["P2G052 Script HTML comments and actual newline gap", "<!--open\nx\n/*c*/-->tail\nz;", "SCRIPT", 2, "ExpressionStatement", null],
  ["P2G053 Script non-comment decrement relational", "a-- > b;", "SCRIPT", 1, "ExpressionStatement", null],
  ["P2G054 decimal exponent value, not parseInt", "1.25e2;", "SCRIPT", 1, "ExpressionStatement", 125],
  ["P2G055 decimal fraction", ".5;", "SCRIPT", 1, "ExpressionStatement", 0.5],
  ["P2G056 radix number", "0xff;", "SCRIPT", 1, "ExpressionStatement", 255],
  ["P2G057 numeric separators", "1_000;", "SCRIPT", 1, "ExpressionStatement", 1000],
  ["P2G058 legacy octal sloppy branch", "077;", "SCRIPT", 1, "ExpressionStatement", 63],
  ["P2G059 literal overflow is allowed value", "1e999;", "SCRIPT", 1, "ExpressionStatement", Infinity],
  ["P2G060 lone surrogate ordinary string allowed", "'\\uD800';", "SCRIPT", 1, "ExpressionStatement", null],
  ["P2G061 unary/update/new/conditional/this", "function f(){++x;x--;return this.x?new C():~x;}", "SCRIPT", 1, "FunctionDeclaration", null],
  ["P2G062 async function Unicode line terminator boundary", "async function\u2028f(){}", "SCRIPT", 1, "FunctionDeclaration", null],
  ["P2G063 anonymous default expression", "export default (a=>a);", "MODULE", 1, "ExportDefaultDeclaration", null],
];

describe("P2 independent literal enabled-production controls, not an oracle", () => {
  for (const [name, text, profile, bodyLength, firstStatementType, firstNumericLiteral] of positives) {
    it(name, () => {
      const result = grammar.analyzeSyntheticGrammarFixtureP2(fixture(text, profile));
      expect(result).toMatchObject({purpose: "TIP081_P2_SYNTHETIC_GRAMMAR_ONLY",
        realParserDisabled: true, syntheticAdapterEnabled: true,
        profile, phase: "SYNTHETIC_ANALYZED", catalogueSitesMeasured: false,
        bodyLength, firstStatementType, firstNumericLiteral});
      expect(Object.keys(result).sort()).toEqual(["attemptedNodes", "bodyLength",
        "catalogueSitesMeasured", "conservativeInternalEntries", "firstNumericLiteral",
        "firstStatementType", "outputBytes", "phase", "producerBytes", "profile",
        "purpose", "realParserDisabled", "syntheticAdapterEnabled", "totalBytes"].sort());
      expect(Object.isFrozen(result)).toBe(true);
      expect(result.totalBytes).toBeLessThanOrEqual(CAP);
      expect(result.attemptedNodes).toBeGreaterThan(0);
    });
  }
});

const negatives: readonly [string, string, Profile, string][] = [
  ["P2G064 raw strict forbids with", "'use strict';with(obj){}", "SCRIPT", "SYNTAX_REFUSED"],
  ["P2G065 LF prefix update ends directive", "'use strict'\n++x;with(obj){}", "SCRIPT", "SYNTAX_REFUSED"],
  ["P2G066 module always strict", "with(obj){}", "MODULE", "SYNTAX_REFUSED"],
  ["P2G067 throw restricted newline", "throw\nx;", "SCRIPT", "SYNTAX_REFUSED"],
  ["P2G068 undefined local export", "export{x};", "MODULE", "SYNTAX_REFUSED"],
  ["P2G069 duplicate lexical declaration", "let x;let x;", "SCRIPT", "SYNTAX_REFUSED"],
  ["P2G070 duplicate private class name", "class C{#x;#x;}", "SCRIPT", "SYNTAX_REFUSED"],
  ["P2G071 unbound private name", "class C{m(){return this.#x;}}", "SCRIPT", "SYNTAX_REFUSED"],
  ["P2G072 invalid lone surrogate export name", "const x=1;export{x as '\\uD800'};", "MODULE", "SYNTAX_REFUSED"],
  ["P2G073 untagged invalid template escape", "`\\xZ1`;", "SCRIPT", "SYNTAX_REFUSED"],
  ["P2G074 escaped keyword remains invalid", "\\u0069f(x){}", "SCRIPT", "SYNTAX_REFUSED"],
  ["P2G075 invalid escaped identifier start", "var \\u0030x;", "SCRIPT", "SYNTAX_REFUSED"],
  ["P2G076 native RegExp target excluded", "/a/g;", "SCRIPT", "UNSUPPORTED_BOUNDED_SYNTAX"],
  ["P2G077 native BigInt target excluded", "1n;", "SCRIPT", "UNSUPPORTED_BOUNDED_SYNTAX"],
  ["P2G078 radix BigInt target excluded", "0xffn;", "SCRIPT", "UNSUPPORTED_BOUNDED_SYNTAX"],
  ["P2G079 raw Unicode identifier excluded", "let \u00e9=1;", "SCRIPT", "UNSUPPORTED_BOUNDED_SYNTAX"],
  ["P2G080 escaped Unicode identifier excluded", "let \\u00e9=1;", "SCRIPT", "UNSUPPORTED_BOUNDED_SYNTAX"],
  ["P2G081 module HTML opening is not a comment", "<!--x\n1;", "MODULE", "SYNTAX_REFUSED"],
  ["P2G082 noninitial hashbang is not a comment", "1;\n#!x", "SCRIPT", "SYNTAX_REFUSED"],
  ["P2G083 separator syntax", "1__0;", "SCRIPT", "SYNTAX_REFUSED"],
  ["P2G084 strict legacy octal", "'use strict';077;", "SCRIPT", "SYNTAX_REFUSED"],
  ["P2G085 return outside function", "return 1;", "SCRIPT", "SYNTAX_REFUSED"],
  ["P2G086 import meta outside Module", "import.meta;", "SCRIPT", "SYNTAX_REFUSED"],
];
describe("P2 literal refusals and private-owner cleanup", () => {
  for (const [name, text, profile, code] of negatives) {
    it(name, () => {
      const handle = fixture(text, profile);
      refused(() => grammar.analyzeSyntheticGrammarFixtureP2(handle), code);
      refused(() => grammar.observeSyntheticGrammarFixtureP2(handle), "AUTHORITY_REFUSED");
      expect(grammar.analyzeSyntheticGrammarFixtureP2(fixture("0;")).firstNumericLiteral).toBe(0);
    });
  }
});

describe("P2 private resource/authority controls", () => {
  it("P2G087 observations are charged and never decrease counters", () => {
    const handle = fixture("1;");
    const first = grammar.observeSyntheticGrammarFixtureP2(handle);
    const second = grammar.observeSyntheticGrammarFixtureP2(handle);
    expect(second.totalBytes).toBe(first.totalBytes + 288); //header64 +14slots16.
    expect(second.outputBytes).toBe(first.outputBytes + 288);
    const analyzed = grammar.analyzeSyntheticGrammarFixtureP2(handle);
    expect(analyzed.totalBytes).toBeGreaterThan(second.totalBytes);
    expect(analyzed.producerBytes).toBeGreaterThan(0);
    const last = grammar.observeSyntheticGrammarFixtureP2(handle);
    expect(last.totalBytes).toBeGreaterThan(analyzed.totalBytes);
    expect(last.producerBytes).toBeGreaterThanOrEqual(analyzed.producerBytes);
    expect(last.attemptedNodes).toBe(analyzed.attemptedNodes);
  });
  it("P2G088 output cap minus one refuses atomically and retires owner", () => {
    const probe = fixture("");
    const before = grammar.observeSyntheticGrammarFixtureP2(probe);
    grammar.retireSyntheticGrammarFixtureP2(probe);
    const short = fixture("", "SCRIPT", before.totalBytes - 1);
    refused(() => grammar.observeSyntheticGrammarFixtureP2(short), "CAP_REFUSED");
    refused(() => grammar.observeSyntheticGrammarFixtureP2(short), "AUTHORITY_REFUSED");
  });
  it("P2G089 busy foreign request leaves existing owner usable", () => {
    const handle = fixture("1;");
    refused(() => grammar.createSyntheticGrammarFixtureP2("2;", "SCRIPT", CAP, 120000), "BUSY_REFUSED");
    expect(grammar.analyzeSyntheticGrammarFixtureP2(handle).firstNumericLiteral).toBe(1);
  });
  it("P2G090 foreign handle/preauthorization does not read its properties", () => {
    const handle = fixture("1;");
    const getter = vi.fn(() => { throw new Error("FOREIGN_PROPERTY_READ"); });
    const foreign = Object.create(null, {purpose: {get: getter}, parserDisabled: {get: getter}});
    refused(() => grammar.analyzeSyntheticGrammarFixtureP2(foreign), "AUTHORITY_REFUSED");
    refused(() => grammar.observeSyntheticGrammarFixtureP2(foreign), "AUTHORITY_REFUSED");
    refused(() => grammar.retireSyntheticGrammarFixtureP2(foreign), "AUTHORITY_REFUSED");
    expect(getter).not.toHaveBeenCalled();
    expect(grammar.analyzeSyntheticGrammarFixtureP2(handle).firstNumericLiteral).toBe(1);
  });
  it("P2G091 source object is refused before coercion", () => {
    const coercion = vi.fn(() => { throw new Error("SOURCE_COERCION"); });
    const foreign = {toString: coercion, [Symbol.toPrimitive]: coercion};
    refused(() => grammar.createSyntheticGrammarFixtureP2(foreign, "SCRIPT", CAP, 120000), "SCHEMA_REFUSED");
    expect(coercion).not.toHaveBeenCalled();
  });
  it("P2G092 invalid profile and fractional cap refuse before ownership", () => {
    refused(() => grammar.createSyntheticGrammarFixtureP2("", "AUTO", CAP, 120000), "MODE_OPEN");
    refused(() => grammar.createSyntheticGrammarFixtureP2("", "SCRIPT", 1.5, 120000), "SCHEMA_REFUSED");
    refused(() => grammar.createSyntheticGrammarFixtureP2("", "SCRIPT", 0, 120000), "CAP_REFUSED");
  });
  it("P2G093 same-owner retirement and stale authority", () => {
    const handle = fixture("1;");
    expect(grammar.retireSyntheticGrammarFixtureP2(handle)).toBe("SYNTHETIC_GRAMMAR_OWNER_RETIRED");
    refused(() => grammar.observeSyntheticGrammarFixtureP2(handle), "AUTHORITY_REFUSED");
    expect(grammar.analyzeSyntheticGrammarFixtureP2(fixture("2;")).firstNumericLiteral).toBe(2);
  });
  it("P2G094 repeated analyze is not a source/AST salvage entry", () => {
    const handle = fixture("1;");
    grammar.analyzeSyntheticGrammarFixtureP2(handle);
    refused(() => grammar.analyzeSyntheticGrammarFixtureP2(handle), "ALLOCATION_COVERAGE_OPEN");
    refused(() => grammar.observeSyntheticGrammarFixtureP2(handle), "AUTHORITY_REFUSED");
  });
  it("P2G095 pre-call recursion depth refuses and cleans up", () => {
    const handle = fixture("(".repeat(160) + "0" + ")".repeat(160));
    refused(() => grammar.analyzeSyntheticGrammarFixtureP2(handle), "DEPTH_REFUSED");
    refused(() => grammar.observeSyntheticGrammarFixtureP2(handle), "AUTHORITY_REFUSED");
  });
  it("P2G096 numeric spelling support limit is explicit", () => {
    const handle = fixture("1".repeat(1025) + ";");
    refused(() => grammar.analyzeSyntheticGrammarFixtureP2(handle), "UNSUPPORTED_BOUNDED_SYNTAX");
  });
  it("P2G097 observation does not renew original trusted TTL", async () => {
    const handle = fixture("1;", "SCRIPT", CAP, 1000);
    const start = trustedPerformance.now();
    await new Promise(resolve => setTimeout(resolve, 600));
    const firstElapsed = trustedPerformance.now() - start;
    expect(firstElapsed).toBeGreaterThanOrEqual(550);
    expect(firstElapsed).toBeLessThan(800);
    expect(grammar.observeSyntheticGrammarFixtureP2(handle).phase).toBe("SOURCE_READY");
    await new Promise(resolve => setTimeout(resolve, 600));
    const lastElapsed = trustedPerformance.now() - start;
    expect(lastElapsed).toBeGreaterThanOrEqual(1100);
    expect(lastElapsed).toBeLessThan(1500);
    expect(lastElapsed).toBeLessThan(firstElapsed + 1000);
    refused(() => grammar.observeSyntheticGrammarFixtureP2(handle), "TIME_REFUSED");
    const postCallElapsed = trustedPerformance.now() - start;
    // Bracket the actual refusal, not merely the time before invoking it. A
    // scheduler pause must not let a renewed deadline expire and falsely pass.
    expect(postCallElapsed).toBeGreaterThanOrEqual(lastElapsed);
    expect(postCallElapsed).toBeLessThan(1500);
    expect(postCallElapsed).toBeLessThan(firstElapsed + 1000);
    console.info("TIP081_P2G097_RAW_TIMING", JSON.stringify({start, firstElapsed,
      lastElapsed, postCallElapsed, ttl: 1000, waits: [600, 600]}));
    refused(() => grammar.observeSyntheticGrammarFixtureP2(handle), "AUTHORITY_REFUSED");
  });
  it("P2G098 captured Number conversion ignores later global replacement", () => {
    const replacement = vi.fn(() => { throw new Error("LATE_NUMBER_GLOBAL"); });
    let result;
    vi.stubGlobal("Number", replacement);
    try {
      const handle = grammar.createSyntheticGrammarFixtureP2("1.25e2;", "SCRIPT", CAP, 120000);
      result = grammar.analyzeSyntheticGrammarFixtureP2(handle);
      grammar.retireSyntheticGrammarFixtureP2(handle);
    } finally { vi.unstubAllGlobals(); }
    expect(replacement).not.toHaveBeenCalled();
    expect(result?.firstNumericLiteral).toBe(125);
  });
  it("P2G099 verifier is boolean-only and malformed text is never imported", () => {
    expect(verifySyntheticGrammarArtifactP2("invalid candidate", "{}", "{}")).toBe(false);
  });
  it("P2G100 actual emitted before-array guard removal is denied", () => {
    const {candidate, inventory, profile} = admittedArtifacts();
    // Numeric fixed-site call, not a declaration or a caller-authored marker.
    const initializer = candidate.indexOf("function __HIVE_P2_initialize()");
    expect(initializer).toBeGreaterThanOrEqual(0);
    const guard = candidate.slice(initializer).match(/__HIVE_P2_reserveArray\(\d+, \d+(?:, \d+)?\)/);
    expect(guard).not.toBeNull();
    if (guard === null) throw new Error("ACTUAL_EMITTED_GUARD_MISSING");
    const position = initializer + (guard.index ?? -1);
    expect(position).toBeGreaterThanOrEqual(initializer);
    const removed = candidate.slice(0, position) + "0" + candidate.slice(position + guard[0].length);
    expect(removed).not.toBe(candidate);
    expect(verifySyntheticGrammarArtifactP2(removed, inventory, profile)).toBe(false);
    // The verifier returns a boolean only. No supplied candidate is imported,
    // repaired, granted flags or passed to a parser; fixed load remains usable.
    expect(grammar.analyzeSyntheticGrammarFixtureP2(fixture("0;")).firstNumericLiteral).toBe(0);
  });
  it("P2G101 actual inventory text tamper is denied", () => {
    const {candidate, inventory, profile} = admittedArtifacts();
    // Hash-bound bytes, not caller JSON flags; no parse/reconstruction is needed.
    expect(verifySyntheticGrammarArtifactP2(candidate, inventory + "\n", profile)).toBe(false);
  });
  it("P2G102 actual fixed profile text tamper is denied", () => {
    const {candidate, inventory, profile} = admittedArtifacts();
    expect(verifySyntheticGrammarArtifactP2(candidate, inventory, profile + "\n")).toBe(false);
  });
  it("P2G103 no source getter/coercion from verifier foreign arguments", () => {
    const coercion = vi.fn(() => { throw new Error("VERIFIER_COERCION"); });
    const foreign = {toString: coercion, [Symbol.toPrimitive]: coercion};
    expect(verifySyntheticGrammarArtifactP2(foreign, "{}", "{}")).toBe(false);
    expect(coercion).not.toHaveBeenCalled();
  });
  it("P2G104 loader tuple reread cannot accept caller-selected text or profile", async () => {
    await expect(Reflect.apply(loadAdmittedSyntheticGrammarP2, undefined, ["caller-source"])).rejects.toMatchObject({
      code: "ALLOCATION_COVERAGE_OPEN", realParserDisabled: true});
    const again = await loadAdmittedSyntheticGrammarP2();
    expect(again).toBe(grammar);
    expect(Object.isFrozen(again)).toBe(true);
    expect(Object.keys(again).sort()).toEqual(["analyzeSyntheticGrammarFixtureP2",
      "createSyntheticGrammarFixtureP2", "observeSyntheticGrammarFixtureP2",
      "retireSyntheticGrammarFixtureP2"].sort());
  });
  it("P2G105 captured perf_hooks clock ignores a later method spy", async () => {
    const handle = fixture("0;", "SCRIPT", CAP, 50);
    let caught: unknown;
    const spy = vi.spyOn(trustedPerformance, "now").mockReturnValue(0);
    try {
      await new Promise(resolve => setTimeout(resolve, 75));
      try { grammar.observeSyntheticGrammarFixtureP2(handle); } catch (error) { caught = error; }
    } finally { spy.mockRestore(); }
    expect(caught).toMatchObject({code: "TIME_REFUSED", realParserDisabled: true});
    refused(() => grammar.observeSyntheticGrammarFixtureP2(handle), "AUTHORITY_REFUSED");
  });
  it("P2G106 inherited schema/array setters are not parser callbacks", () => {
    const setter = vi.fn(() => { throw new Error("INHERITED_PARSER_SETTER"); });
    const oldStart = Object.getOwnPropertyDescriptor(Object.prototype, "start");
    const oldZero = Object.getOwnPropertyDescriptor(Array.prototype, "0");
    let handle: Handle | undefined;
    let result;
    // No test-vector push or assertion runs while the inherited index is poisoned.
    Object.defineProperty(Object.prototype, "start", {set: setter, configurable: true});
    Object.defineProperty(Array.prototype, "0", {set: setter, configurable: true});
    try {
      handle = grammar.createSyntheticGrammarFixtureP2("let x=1;x;", "SCRIPT", CAP, 120000);
      result = grammar.analyzeSyntheticGrammarFixtureP2(handle);
    } finally {
      if (oldStart) Object.defineProperty(Object.prototype, "start", oldStart);
      else Reflect.deleteProperty(Object.prototype, "start");
      if (oldZero) Object.defineProperty(Array.prototype, "0", oldZero);
      else Reflect.deleteProperty(Array.prototype, "0");
      if (handle !== undefined) handles.push(handle);
    }
    expect(setter).not.toHaveBeenCalled();
    expect(result?.bodyLength).toBe(2);
    expect(result?.firstStatementType).toBe("VariableDeclaration");
  });
  it("P2G107 member entry conjunction and hybrid structural depth boundary", () => {
    // The preserved first check found ENTRY_REFUSED before the member chain's
    // proposed AST boundary. Keep that exact conjunction, not an any-refusal test.
    const member = fixture("a" + ".x".repeat(140) + ";");
    refused(() => grammar.analyzeSyntheticGrammarFixtureP2(member), "ENTRY_REFUSED");
    refused(() => grammar.observeSyntheticGrammarFixtureP2(member), "AUTHORITY_REFUSED");

    // Hand shape: Identifier1 + Call94 + Unary31 + ExpressionStatement1 +
    // Program1 =128 nodes/depth. Array containers add no structural depth.
    // The reviewed unary/call path has private call depth <64; this is not
    // observed private AST metadata or a deep AST-equivalence assertion.
    const boundary = fixture("!".repeat(31) + "a" + "()".repeat(94) + ";");
    const result = grammar.analyzeSyntheticGrammarFixtureP2(boundary);
    expect(result.phase).toBe("SYNTHETIC_ANALYZED");
    expect(result.bodyLength).toBe(1);
    expect(result.firstStatementType).toBe("ExpressionStatement");
    expect(result.firstNumericLiteral).toBeNull();
    expect(result.attemptedNodes).toBe(128);
    expect(result.conservativeInternalEntries).toBeLessThan(20000);
    expect(result.totalBytes).toBeLessThanOrEqual(CAP);
    grammar.retireSyntheticGrammarFixtureP2(boundary);
    refused(() => grammar.observeSyntheticGrammarFixtureP2(boundary), "AUTHORITY_REFUSED");

    // One additional unary wrapper gives hand-derived depth129, while keeping
    // the same fixed profile, caps and shallow iterative call-production path.
    const beyond = fixture("!".repeat(32) + "a" + "()".repeat(94) + ";");
    refused(() => grammar.analyzeSyntheticGrammarFixtureP2(beyond), "DEPTH_REFUSED");
    refused(() => grammar.observeSyntheticGrammarFixtureP2(beyond), "AUTHORITY_REFUSED");
  });
  it("P2G108 no-parentheses new has fresh owner-local empty argument lists", () => {
    let priorProducer: number | undefined;
    let priorEntries: number | undefined;
    for (let owner = 0; owner < 3; owner++) {
      const handle = fixture("new A; new A;");
      const before = grammar.observeSyntheticGrammarFixtureP2(handle);
      expect(before.phase).toBe("SOURCE_READY");
      const result = grammar.analyzeSyntheticGrammarFixtureP2(handle);
      expect(result.phase).toBe("SYNTHETIC_ANALYZED");
      expect(result.bodyLength).toBe(2);
      expect(result.firstStatementType).toBe("ExpressionStatement");
      expect(result.firstNumericLiteral).toBeNull();
      expect(result.producerBytes).toBeGreaterThanOrEqual(before.producerBytes);
      expect(result.conservativeInternalEntries).toBeGreaterThanOrEqual(before.conservativeInternalEntries);
      if (priorProducer !== undefined) expect(result.producerBytes).toBe(priorProducer);
      if (priorEntries !== undefined) expect(result.conservativeInternalEntries).toBe(priorEntries);
      priorProducer = result.producerBytes;
      priorEntries = result.conservativeInternalEntries;
      grammar.retireSyntheticGrammarFixtureP2(handle);
      refused(() => grammar.observeSyntheticGrammarFixtureP2(handle), "AUTHORITY_REFUSED");
    }
    // Repeated finite accounting/authority evidence, not a physical GC proof.
  });
  it("P2G109 side-effect import has fresh owner-local empty specifier lists", () => {
    let priorProducer: number | undefined;
    let priorEntries: number | undefined;
    for (let owner = 0; owner < 3; owner++) {
      const handle = fixture("import 'm';", "MODULE");
      const before = grammar.observeSyntheticGrammarFixtureP2(handle);
      expect(before.phase).toBe("SOURCE_READY");
      const result = grammar.analyzeSyntheticGrammarFixtureP2(handle);
      expect(result.phase).toBe("SYNTHETIC_ANALYZED");
      expect(result.profile).toBe("MODULE");
      expect(result.bodyLength).toBe(1);
      expect(result.firstStatementType).toBe("ImportDeclaration");
      expect(result.firstNumericLiteral).toBeNull();
      expect(result.producerBytes).toBeGreaterThanOrEqual(before.producerBytes);
      expect(result.conservativeInternalEntries).toBeGreaterThanOrEqual(before.conservativeInternalEntries);
      if (priorProducer !== undefined) expect(result.producerBytes).toBe(priorProducer);
      if (priorEntries !== undefined) expect(result.conservativeInternalEntries).toBe(priorEntries);
      priorProducer = result.producerBytes;
      priorEntries = result.conservativeInternalEntries;
      grammar.retireSyntheticGrammarFixtureP2(handle);
      refused(() => grammar.observeSyntheticGrammarFixtureP2(handle), "AUTHORITY_REFUSED");
    }
  });
});

// No isolated 200000-node boundary fixture is claimed: each ordinary node adds
// an internal metadata entry, so the conservative20000-entry guard dominates.
// A unique wide ENTRY_REFUSED expectation requires a reviewed byte upper bound;
// array resize old/new retention and emitted frames can otherwise hit CAP first.
