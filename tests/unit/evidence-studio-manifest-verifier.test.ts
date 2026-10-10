import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { buildManifestCandidate, createManifestSnapshot, manifestDigest } from "../../scripts/test/runtime-tip081-manifest.mjs";
import { buildLauncherContract, verifyManifestCandidate, LAUNCHER_UTILS_DIGEST, MANIFEST_BASE_BUNDLE_DIGEST } from "../../scripts/test/verify-tip081-manifest.mjs";

const sha = (bytes: string | Buffer) => createHash("sha256").update(bytes).digest("hex");
type GraphSite = { id: string; file: string; start: number; end: number; kind: string; mode: string | null; specifier: string | null; expression: string; sourceDigest: string; binding: string };
type GraphObligation = { id: string; file: string; start: number; end: number; code: string; siteId: string | null };
type GraphAnalysis = { file: string; digest: string; format: string; offsetEncoding: string; sourceType: string | null; sites: GraphSite[]; obligations: GraphObligation[] };
type GraphEdge = { siteId: string; importer: string; mode: string; specifier: string | null; status: string; target: string | null; packageFiles: { path: string; digest: string }[]; conditions: string[]; absentCandidates: string[]; reason: string | null };
type TestCandidate = { version: number; purpose: string; snapshotDigest: string; profile: { runtime: string; mode: string; nodeVersion: string; platform: string; arch: string; distDir: string }; epoch: { kind: string; id: string; digest: string }; entries: string[]; files: { path: string; size: number; digest: string; kind: string }[]; analyses: GraphAnalysis[]; edges: GraphEdge[]; obligations: GraphObligation[]; status: string; fullRuntimeClosure: string; digest: string };
function fixture(rows: Record<string, string | Buffer>, entries = ["entry.cjs"]) {
  const snapshot = createManifestSnapshot({
    files: new Map(Object.entries(rows).map(([file, body]) => [file, Buffer.isBuffer(body) ? body : Buffer.from(body)])), entries,
    profile: { runtime: "node", mode: "production", nodeVersion: process.version, platform: process.platform, arch: process.arch, distDir: ".next-tip080" },
    epoch: { kind: "SYNTHETIC", id: "independent-verifier-unit", digest: "b".repeat(64) },
  });
  const candidate: TestCandidate = buildManifestCandidate(snapshot); return { snapshot, candidate };
}
function rehash(candidate: TestCandidate) {
  const { digest: previous, ...body } = candidate;
  expect(previous).toMatch(/^[a-f0-9]{64}$/);
  return { ...body, digest: manifestDigest(body) };
}
function verified(rows: Record<string, string | Buffer>, entries = ["entry.cjs"]) {
  const f = fixture(rows, entries); return { ...f, receipt: verifyManifestCandidate(f.snapshot, f.candidate) };
}
const twoEdges = () => fixture({ "entry.cjs": "require('./a');require('./missing');unknown();", "a.js": "module.exports=81;" });
function launcher(config = "{}", moduleType = "commonjs") {
  const configBytes = Buffer.from(config);
  return { utilsBytes: readFileSync(new URL("../../node_modules/next/dist/build/utils.js", import.meta.url)), configBytes,
    packageJsonBytes: Buffer.from(JSON.stringify({ type: moduleType })), distDir: ".next-tip080",
    binding: { sourceBundleDigest: MANIFEST_BASE_BUNDLE_DIGEST, configDigest: sha(configBytes), reviewDigest: "c".repeat(64), epochDigest: "d".repeat(64) } };
}

describe("TIP081 independent graph verifier and unadmitted launcher contracts", () => {
  it("V01 independently verifies only the supplied static inventory", () => {
    const f = verified({ "entry.cjs": "require('./dep');", "dep.js": "module.exports=81;" });
    expect(f.receipt.status).toBe("STATIC_GRAPH_VERIFIED"); expect(f.receipt.scope).toBe("SUPPLIED_INVENTORY_ONLY");
    expect(f.receipt.fullRuntimeClosure).toBe("NOT_ACCEPTED"); expect(f.receipt.executionAllowed).toBe(false); expect(f.receipt.materializationAllowed).toBe(false);
  });
  it("V02 rejects a cloned snapshot even with unchanged public digest", () => {
    const f = twoEdges(); expect(() => verifyManifestCandidate({ ...f.snapshot }, f.candidate)).toThrow("SNAPSHOT_AUTHORITY_REFUSED");
  });
  it("V03 rejects rehashed omitted source sites", () => {
    const f = twoEdges(), changed = structuredClone(f.candidate); changed.analyses.find(a => a.file === "entry.cjs")?.sites.pop();
    expect(() => verifyManifestCandidate(f.snapshot, rehash(changed))).toThrow("INDEPENDENT_MISMATCH");
  });
  it("V04 rejects rehashed omitted or reordered edges", () => {
    const f = twoEdges(); for (const operation of ["omit", "reverse"]) {
      const changed = structuredClone(f.candidate); if (operation === "omit") changed.edges.pop(); else changed.edges.reverse();
      expect(() => verifyManifestCandidate(f.snapshot, rehash(changed))).toThrow("INDEPENDENT_MISMATCH");
    }
  });
  it("V05 rejects cleared OPEN obligations at both evidence levels", () => {
    const f = twoEdges(), changed = structuredClone(f.candidate); changed.obligations = []; for (const a of changed.analyses) a.obligations = [];
    expect(() => verifyManifestCandidate(f.snapshot, rehash(changed))).toThrow("INDEPENDENT_MISMATCH");
  });
  it("V06 rejects fabricated target, condition and absence claims", () => {
    const f = twoEdges(), original = f.candidate.edges.find(e => e.importer === "entry.cjs" && e.specifier === "./missing");
    if (!original) throw new Error("fixture missing-entry edge missing");
    expect(verifyManifestCandidate(f.snapshot, f.candidate).status).toBe("STATIC_GRAPH_VERIFIED");
    expect(original.absentCandidates.length).toBeGreaterThan(0);
    for (const property of ["target", "conditions", "absentCandidates"]) {
      const changed = structuredClone(f.candidate), edge = changed.edges.find(e => e.siteId === original.siteId); if (!edge) throw new Error("cloned fixture edge missing");
      if (property === "target") edge.target = "forged.js"; else if (property === "conditions") edge.conditions = ["browser", "default"]; else edge.absentCandidates = [];
      expect(edge).not.toEqual(original);
      expect(() => verifyManifestCandidate(f.snapshot, rehash(changed))).toThrow("INDEPENDENT_MISMATCH");
    }
  });
  it("V07 rejects rehashed source digest and extra analysis records", () => {
    const f = twoEdges(), changed = structuredClone(f.candidate), analysis = changed.analyses[0]; if (!analysis) throw new Error("fixture analysis missing");
    analysis.digest = "0".repeat(64); expect(() => verifyManifestCandidate(f.snapshot, rehash(changed))).toThrow("INDEPENDENT_MISMATCH");
    const extra = structuredClone(f.candidate); extra.analyses.push(structuredClone(analysis)); expect(() => verifyManifestCandidate(f.snapshot, rehash(extra))).toThrow("INDEPENDENT_MISMATCH");
  });
  it("V08 refuses caller status, successful epoch or entry alterations", () => {
    const f = twoEdges(); for (const property of ["status", "epoch", "entries"]) {
      const changed = structuredClone(f.candidate); if (property === "status") changed.status = "ACCEPTED"; else if (property === "epoch") changed.epoch.kind = "SUCCESSFUL_BUILD"; else changed.entries = ["a.js"];
      expect(() => verifyManifestCandidate(f.snapshot, rehash(changed))).toThrow("INDEPENDENT_MISMATCH");
    }
  });
  it("V09 never invokes candidate getters, proxies or callbacks", () => {
    const f = twoEdges(); let touched = false;
    const getter = { ...f.candidate, get status() { touched = true; throw new Error("must not invoke"); } };
    expect(() => verifyManifestCandidate(f.snapshot, getter)).toThrow("ACCESSOR_REFUSED");
    expect(() => verifyManifestCandidate(f.snapshot, new Proxy(f.candidate, { ownKeys() { touched = true; throw new Error("must not invoke"); } }))).toThrow("DATA_REFUSED");
    expect(touched).toBe(false);
  });
  it("V10 preserves unknown calls, constructors, tagged templates and hostile target text as OPEN data", () => {
    const f = verified({ "entry.cjs": "throw new Error('NEVER_EXECUTE'); unknown();new Thing();tag`value`;" });
    expect(f.receipt.openObligations.map(o => o.code)).toEqual(expect.arrayContaining(["UNKNOWN_CALL", "UNKNOWN_NEW", "UNKNOWN_TAGGED_TEMPLATE_OPEN"]));
  });
  it("V11 aliases, shadowed requires and computed loaders cannot claim builtin binding", () => {
    for (const source of ["const alias=require;alias('./x');", "function f(require){require('./x')}f();", "class require{};require('./x');", "module.require('./x');__webpack_require__(81);"]) {
      const f = verified({ "entry.cjs": source, "x.js": "module.exports=81;" });
      expect(f.receipt.openObligations.map(o => o.code)).toContain("LOADER_BINDING_OPEN"); expect(f.candidate.edges.every(e => e.status !== "RESOLVED")).toBe(true);
    }
  });
  it("V12 distinguishes import module semantics from CJS extension and directory fallbacks", () => {
    const f = verified({ "entry.mjs": "import './dep';import './dir';", "dep.js": "export {};", "dir/index.js": "export {};" }, ["entry.mjs"]);
    expect(f.candidate.edges.every(e => e.status === "UNRESOLVED")).toBe(true);
    const c = verified({ "entry.cjs": "require('./dep');require('./dir');", "dep.js": "module.exports=81;", "dir/index.js": "module.exports=81;" });
    const entryEdges = c.candidate.edges.filter(e => e.importer === "entry.cjs");
    expect(entryEdges.map(e => e.target)).toEqual(["dep.js", "dir/index.js"]);
    const secondaryEdges = c.candidate.edges.filter(e => e.importer !== "entry.cjs");
    expect(secondaryEdges).toHaveLength(2); expect(secondaryEdges.every(e => e.status === "UNRESOLVED" && e.reason === "LOADER_BINDING_OPEN")).toBe(true);
    expect(c.receipt.openObligations.some(o => o.file === "dep.js" && o.code === "COMPUTED_LOADER_OPEN")).toBe(true);
  });
  it("V13 records exact package metadata and refuses its altered digest", () => {
    const f = verified({ "entry.cjs": "require('pkg');", "node_modules/pkg/package.json": '{"main":"index.js"}', "node_modules/pkg/index.js": "module.exports=81;" });
    const changed = structuredClone(f.candidate), row = changed.edges[0]?.packageFiles[0]; if (!row) throw new Error("fixture package row missing"); row.digest = "0".repeat(64);
    expect(() => verifyManifestCandidate(f.snapshot, rehash(changed))).toThrow("INDEPENDENT_MISMATCH");
  });
  it("V14 honors modeled conditions and refuses unknown conditions instead of certifying fallback", () => {
    const f = verified({ "entry.cjs": "require('pkg');", "node_modules/pkg/package.json": '{"exports":{"import":"./esm.mjs","require":"./cjs.js","default":"./fallback.js"}}', "node_modules/pkg/cjs.js": "module.exports=81;" });
    expect(f.candidate.edges[0]?.target).toBe("node_modules/pkg/cjs.js");
    for (const mechanism of ["exports", "imports"]) for (const mode of ["require", "import"]) for (const condition of ["node-addons", "module-sync", "custom"]) for (const nested of [false, true]) {
      const entry = mode === "require" ? "entry.cjs" : "entry.mjs", specifier = mechanism === "imports" ? "#x" : "pkg", root = mechanism === "imports" ? "" : "node_modules/pkg/";
      const source = mode === "require" ? `require('${specifier}');` : `import '${specifier}';`;
      const unsupported = { [condition]: "./special.cjs", default: "./fallback.cjs" };
      const conditional = nested ? { node: unsupported, default: "./fallback.cjs" } : unsupported;
      const metadata = mechanism === "imports" ? { imports: { "#x": conditional } } : { exports: conditional };
      const checked = verified({ [entry]: source, [`${root}package.json`]: JSON.stringify(metadata), [`${root}special.cjs`]: "module.exports=81;", [`${root}fallback.cjs`]: "module.exports=81;" }, [entry]);
      const original = checked.candidate.edges.find(e => e.importer === entry && e.specifier === specifier);
      if (!original) throw new Error("fixture conditional entry edge missing");
      expect(original.status).toBe("UNRESOLVED"); expect(original.reason).toBe(mechanism === "imports" ? "UNSUPPORTED_IMPORTS" : "UNSUPPORTED_EXPORTS"); expect(original.target).toBe(null);
      const changed = structuredClone(checked.candidate), claimed = changed.edges.find(e => e.siteId === original.siteId);
      if (!claimed) throw new Error("cloned conditional entry edge missing");
      claimed.status = "RESOLVED"; claimed.target = `${root}fallback.cjs`; claimed.reason = null;
      changed.obligations = changed.obligations.filter(o => !(o.siteId === original.siteId && o.code === "UNRESOLVED_EDGE"));
      expect(claimed).not.toEqual(original); expect(() => verifyManifestCandidate(checked.snapshot, rehash(changed))).toThrow("INDEPENDENT_MISMATCH");
    }
    for (const mode of ["require", "import"]) {
      const entry = mode === "require" ? "entry.cjs" : "entry.mjs", opposite = mode === "require" ? "import" : "require";
      const exports = { [opposite]: { custom: "./unvisited.cjs" }, [mode]: "./selected.cjs", default: "./fallback.cjs" };
      const checked = verified({ [entry]: mode === "require" ? "require('pkg');" : "import 'pkg';", "node_modules/pkg/package.json": JSON.stringify({ exports }), "node_modules/pkg/selected.cjs": "module.exports=81;" }, [entry]);
      expect(checked.candidate.edges.find(e => e.importer === entry && e.specifier === "pkg")?.target).toBe("node_modules/pkg/selected.cjs");
      expect(checked.receipt.sharedAssumptions).toContain("Only node/import/require/default keys in visited condition objects; skipped opposite-mode branch contents are not certified");
    }
  });
  it("V15 null exports block defaults and missing selected exports never use main", () => {
    for (const exports of ['{"node":null,"default":"./index.js"}', '"./missing.js"']) {
      const f = verified({ "entry.cjs": "require('pkg');", "node_modules/pkg/package.json": `{"exports":${exports},"main":"index.js"}`, "node_modules/pkg/index.js": "module.exports=81;" });
      expect(f.candidate.edges[0]?.status).toBe("UNRESOLVED");
    }
  });
  it("V16 nearest scoped package wins without importing either target", () => {
    const f = verified({ "src/entry.cjs": "require('@scope/pkg');", "src/node_modules/@scope/pkg/package.json": '{"main":"near.cjs"}', "src/node_modules/@scope/pkg/near.cjs": "throw Error('never near');", "node_modules/@scope/pkg/package.json": '{"main":"far.cjs"}', "node_modules/@scope/pkg/far.cjs": "throw Error('never far');" }, ["src/entry.cjs"]);
    expect(f.candidate.edges.find(e => e.importer === "src/entry.cjs")?.target).toBe("src/node_modules/@scope/pkg/near.cjs");
  });
  it("V17 unsupported URL-like export targets remain unresolved", () => {
    for (const target of ["./file.js?x", "./file.js#x", "./file%2ejs", "./dir/./file.js"]) {
      const f = verified({ "entry.cjs": "require('pkg');", "node_modules/pkg/package.json": JSON.stringify({ exports: target }), "node_modules/pkg/file.js": "module.exports=81;" });
      expect(f.candidate.edges[0]?.reason).toBe("UNSUPPORTED_EXPORTS");
    }
    for (const main of ["file.js?x", "dir/./file.js", "dir//file.js", "file.js#x"]) {
      const f = verified({ "entry.cjs": "require('pkg');", "node_modules/pkg/package.json": JSON.stringify({ main }), "node_modules/pkg/index.js": "module.exports=81;" });
      expect(f.candidate.edges[0]?.reason).toBe("UNSUPPORTED_PACKAGE_METADATA");
    }
  });
  it("V18 uses exact builtin identity, not stripped node prefixes", () => {
    const f = verified({ "entry.cjs": "require('node:test');require('test');require('node:fs');" });
    expect(f.candidate.edges.find(e => e.specifier === "node:test")?.status).toBe("BUILTIN"); expect(f.candidate.edges.find(e => e.specifier === "test")?.status).not.toBe("BUILTIN");
    const invalid = verified({ "entry.cjs": "require('.foo');require('#');require('#/x');", ".foo": "never-imported-data", "x.cjs": "module.exports=81;", "package.json": '{"imports":{"#":"./x.cjs","#/x":"./x.cjs"}}' });
    const invalidEntries = invalid.candidate.edges.filter(e => e.importer === "entry.cjs" && [".foo", "#", "#/x"].includes(e.specifier ?? ""));
    expect(invalidEntries).toHaveLength(3); expect(invalidEntries.every(e => e.reason === "INVALID_SPECIFIER" && e.target === null)).toBe(true);
    const root = verified({ "entry.cjs": "require('.');", "index.js": "module.exports=81;" });
    const rootEntry = root.candidate.edges.find(e => e.importer === "entry.cjs" && e.specifier === ".");
    expect(rootEntry?.reason).toBe("UNSUPPORTED_RESOLUTION"); expect(rootEntry?.target).toBe(null);
  });
  it("V19 preserves branch, optional, signature and dynamic-site obligations", () => {
    const f = verified({ "entry.cjs": "if(flag)require('./x');require?.('./x');require('./x',{});require(name);", "x.js": "module.exports=81;" });
    expect(f.receipt.openObligations.map(o => o.code)).toEqual(expect.arrayContaining(["CONDITIONAL_BRANCH_OPEN", "OPTIONAL_CALL_OPEN", "CALL_SIGNATURE_OPEN", "DYNAMIC_SPECIFIER"]));
  });
  it("V20 explicitly keeps filesystem, native loading, eval and Function coverage OPEN", () => {
    const f = verified({ "entry.cjs": "fs.readFileSync('x');process.dlopen(a,'x');eval('x');new Function('x');" });
    expect(f.receipt.openObligations.map(o => o.code)).toEqual(expect.arrayContaining(["FILESYSTEM_ASSET_OPEN", "NATIVE_LOADER_OPEN", "EVAL_OPEN", "FUNCTION_OPEN"]));
  });
  it("V21 Unicode source ranges are UTF16 code units rather than bytes", () => {
    const source = "const label='😀';require('node:fs');", f = verified({ "entry.cjs": source });
    const analysis = f.candidate.analyses[0], site = analysis?.sites.find(s => s.kind === "require");
    expect(analysis?.offsetEncoding).toBe("UTF16_CODE_UNITS"); expect(site?.start).toBe(source.indexOf("require")); expect(site?.start).not.toBe(Buffer.byteLength(source.slice(0, source.indexOf("require"))));
  });
  it("V22 JSON duplicate keys, invalid UTF8 and prototypes are parse OPEN, finite floats remain valid", () => {
    const f = verified({ "entry.cjs": "", "duplicate.json": '{"x":1,"x":2}', "bad.json": Buffer.from([0xff]), "prototype.json": '{"__proto__":{}}', "finite.json": '{"password":"ordinary-metadata","value":1.25}' });
    for (const file of ["duplicate.json", "bad.json", "prototype.json"]) expect(f.candidate.analyses.find(a => a.file === file)?.obligations.map(o => o.code)).toContain("PARSE_ERROR");
    expect(f.candidate.analyses.find(a => a.file === "finite.json")?.obligations).toEqual([]);
  });
  it("V23 unknown JS source mode, malformed syntax, native and assets all remain explicit OPEN", () => {
    const f = verified({ "entry.cjs": "", "unknown.js": "const x=1;", "syntax.mjs": "import {", "addon.node": "native-data", "asset.txt": "asset-data", "source.ts": "const x:number=1;" });
    expect(f.receipt.openObligations.map(o => o.code)).toEqual(expect.arrayContaining(["SOURCE_MODE_OPEN", "PARSE_ERROR", "NATIVE_COVERAGE_OPEN", "ASSET_COVERAGE_OPEN", "UNSUPPORTED_FORMAT"]));
  });
  it("V24 deeply freezes the receipt so OPEN evidence cannot be cleared after digest", () => {
    const f = verified({ "entry.cjs": "unknown();" }), digest = f.receipt.digest;
    expect(Object.isFrozen(f.receipt.openObligations)).toBe(true); expect(() => f.receipt.openObligations.pop()).toThrow();
    expect(() => Object.assign(f.receipt.openObligations[0] ?? {}, { code: "CLOSED" })).toThrow(); expect(f.receipt.digest).toBe(digest);
  });
  it("L01 CJS launcher binds pinned utils, exact seeds and honest non-admission", () => {
    const result = buildLauncherContract(launcher('{"distDir":".next-tip080","env":{}}'));
    expect(result.utilsDigest).toBe(LAUNCHER_UTILS_DIGEST); expect(result.moduleType).toBe("CJS"); expect(result.seeds.map(s => s.specifier)).toEqual(["path", "next", "next/dist/server/lib/start-server"]);
    expect(result.scope).toBe("SOURCE_CONTRACT_ONLY"); expect(result.status).toBe("GENERATED_CONTRACT_UNADMITTED"); expect(result.reviewedConfigAuthority).toBe("NOT_ESTABLISHED"); expect(result.fullRuntimeClosure).toBe("NOT_ACCEPTED"); expect(result.executed).toBe(false);
  });
  it("L02 ESM header, production cwd and keepalive contract match pinned generation", () => {
    const result = buildLauncherContract(launcher("{}", "module"));
    expect(result.source).toContain("module.createRequire(import.meta.url)"); expect(result.source).toContain("process.chdir(__dirname)"); expect(result.source).toContain("process.env.NODE_ENV = 'production'"); expect(result.source).toContain("keepAliveTimeout < 0");
    expect(result.seeds.map(s => s.specifier)).toEqual(["node:path", "node:url", "node:module", "next", "next/dist/server/lib/start-server"]); expect(result.allowRetry).toBe(false); expect(result.isDev).toBe(false);
  });
  it("L03 mutated utils, config hash and base bundle cannot mint a launcher contract", () => {
    const input = launcher(); input.utilsBytes.writeUInt8(input.utilsBytes.readUInt8(0) ^ 1, 0); expect(() => buildLauncherContract(input)).toThrow("SOURCE_REFUSED");
    const mismatch = launcher(); mismatch.binding.configDigest = "0".repeat(64); expect(() => buildLauncherContract(mismatch)).toThrow("BINDING_REFUSED");
    const base = launcher(); base.binding.sourceBundleDigest = "0".repeat(64); expect(() => buildLauncherContract(base)).toThrow("BINDING_REFUSED");
  });
  it("L04 caller approval flags are rejected rather than converted to authority", () => {
    expect(() => buildLauncherContract({ ...launcher(), reviewed: true })).toThrow("DATA_REFUSED");
    const result = buildLauncherContract(launcher()); expect(result.executionAllowed).toBe(false); expect(result.materializationAllowed).toBe(false); expect(result.reviewedConfigAuthority).toBe("NOT_ESTABLISHED");
  });
  it("L05 secrets, nonempty env and credential URLs never enter generated source", () => {
    for (const config of ['{"env":{"MY_VALUE":"private"}}', '{"MY_SECRET":"foo"}', '{"privateKey":"foo"}', '{"passphrase":"foo"}', '{"imageUrl":"https://user:pass@example.test/x"}', '{"serverRuntimeConfig":{"value":"private"}}', '{"publicRuntimeConfig":{"value":"private"}}']) expect(() => buildLauncherContract(launcher(config))).toThrow();
  });
  it("L06 prototype keys, duplicate config and unsupported distDir are refused", () => {
    for (const config of ['{"__proto__":{}}', '{"distDir":"a","distDir":"b"}', '{"distDir":"other"}', '{"webpack":null}']) expect(() => buildLauncherContract(launcher(config))).toThrow();
    expect(() => buildLauncherContract({ ...launcher(), distDir: "other" })).toThrow("SOURCE_REFUSED");
  });
  it("L07 accessors, proxies, functions and toJSON cannot execute during admission", () => {
    let touched = false; const input = launcher();
    expect(() => buildLauncherContract({ ...input, get configBytes() { touched = true; throw Error("never getter"); } })).toThrow("ACCESSOR_REFUSED");
    expect(() => buildLauncherContract(new Proxy(input, { ownKeys() { touched = true; throw Error("never proxy"); } }))).toThrow("DATA_REFUSED");
    expect(() => buildLauncherContract({ ...input, configBytes: { toJSON() { touched = true; throw Error("never serializer"); } } })).toThrow("BYTES_REFUSED");
    expect(() => buildLauncherContract({ ...input, binding: { ...input.binding, reviewDigest: () => { touched = true; } } })).toThrow();
    expect(() => buildLauncherContract({ ...input, [Symbol("extra")]: "data" })).toThrow("DATA_REFUSED");
    expect(() => buildLauncherContract(Object.assign(Object.create(null), input))).toThrow("DATA_REFUSED");
    for (const key of ["utilsBytes", "configBytes"]) {
      const fresh = launcher(), bytes = key === "utilsBytes" ? fresh.utilsBytes : fresh.configBytes;
      Object.defineProperty(bytes, "length", { get() { touched = true; throw Error("never Buffer length getter"); } });
      expect(() => buildLauncherContract(fresh)).toThrow("BYTES_REFUSED");
    }
    const coercion = launcher(); Object.defineProperty(coercion.configBytes, Symbol.toPrimitive, { value() { touched = true; throw Error("never Buffer coercion"); } });
    expect(() => buildLauncherContract(coercion)).toThrow("BYTES_REFUSED"); expect(touched).toBe(false);
  });
  it("L08 deeply freezes launcher seeds and binding without executing its source", () => {
    const result = buildLauncherContract(launcher()), digest = result.digest;
    expect(() => result.seeds.pop()).toThrow(); expect(() => Object.assign(result.seeds[0] ?? {}, { builtin: false })).toThrow(); expect(() => Object.assign(result.binding, { reviewDigest: "0".repeat(64) })).toThrow(); expect(result.digest).toBe(digest); expect(result.executed).toBe(false);
  });
  it("V25 verifier shares only immutable accessor/parser/schema helpers, not producer semantics", () => {
    const source = readFileSync(new URL("../../scripts/test/verify-tip081-manifest.mjs", import.meta.url), "utf8");
    expect(source).not.toMatch(/\b(?:analyzeManifestSource|buildManifestCandidate|resolveManifestSpecifier)\b/); expect(source).not.toMatch(/\beval\s*\(/); expect(source).toContain("analyzeIndependently"); expect(source).toContain("independentResolution");
  });
  it("V26 dependency scopes do not borrow application imports or module type across node_modules", () => {
    const f = verified({ "package.json": '{"type":"module","imports":{"#x":"./x.mjs"}}', "x.mjs": "export const x=81;", "node_modules/pkg/entry.cjs": "require('#x');", "node_modules/pkg/other.js": "const x=81;" }, ["node_modules/pkg/entry.cjs"]);
    expect(f.candidate.edges[0]?.reason).toBe("UNSUPPORTED_IMPORTS"); expect(f.candidate.edges[0]?.target).toBe(null);
    expect(f.candidate.analyses.find(a => a.file === "node_modules/pkg/other.js")?.obligations.map(o => o.code)).toContain("SOURCE_MODE_OPEN");
  });
  it("V27 module sources cannot claim implicit CommonJS require binding", () => {
    const f = verified({ "entry.mjs": "require('./x.mjs');", "x.mjs": "export const x=81;" }, ["entry.mjs"]);
    expect(f.candidate.edges[0]?.reason).toBe("LOADER_BINDING_OPEN"); expect(f.candidate.edges[0]?.status).toBe("UNRESOLVED");
  });
  it("V28 with scopes cannot establish literal CommonJS loader authority", () => {
    const f = verified({ "entry.cjs": "with(obj){require('./x.cjs')}require('./x.cjs');", "x.cjs": "module.exports=81;" });
    expect(f.candidate.edges.every(e => e.reason === "LOADER_BINDING_OPEN")).toBe(true);
    expect(f.receipt.openObligations.map(o => o.code)).toContain("DYNAMIC_SCOPE_OPEN");
  });
});
