import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";
import {
  BASE_BUNDLE_DIGEST, BASE_REVIEW_DIGEST, MANIFEST_LIMITS, PARSER_PINS,
  analyzeManifestSource, buildManifestCandidate, canonicalManifest,
  createManifestSnapshot, loadManifestParser, manifestDigest, manifestPath,
  readManifestSnapshot, resolveManifestSpecifier,
} from "../../scripts/test/runtime-tip081-manifest.mjs";

const profile = () => ({ runtime: "node", mode: "production", nodeVersion: process.version, platform: process.platform, arch: process.arch, distDir: ".next-tip080" });
const epoch = () => ({ kind: "SYNTHETIC", id: "owned-manifest-unit", digest: "a".repeat(64) });
function snapshot(rows: Record<string, string | Buffer>, entries = ["entry.cjs"]) {
  return createManifestSnapshot({ files: new Map(Object.entries(rows).map(([f, b]) => [f, Buffer.isBuffer(b) ? b : Buffer.from(b)])), entries, profile: profile(), epoch: epoch() });
}
const packageRows = () => ({
  "entry.cjs": "module.exports = require('pkg');",
  "node_modules/pkg/package.json": '{"name":"pkg","type":"commonjs","main":"index.js"}',
  "node_modules/pkg/index.js": "module.exports = 81;",
});
const codes = (analysis: ReturnType<typeof analyzeManifestSource>) => analysis.obligations.map((o: { code: string }) => o.code);

describe("TIP081 data-only runtime manifest contracts", () => {
  it("M1-01 binds the accepted base and fixed non-runtime authority labels", () => {
    const s = snapshot({ "entry.cjs": "module.exports=81;" });
    expect(s.baseBundleDigest).toBe(BASE_BUNDLE_DIGEST);
    expect(s.baseReviewDigest).toBe(BASE_REVIEW_DIGEST);
    const candidate = buildManifestCandidate(s);
    expect(candidate.status).toBe("CANDIDATE");
    expect(candidate.fullRuntimeClosure).toBe("NOT_ACCEPTED");
    expect(candidate).not.toHaveProperty("materializationAuthority");
  });
  it("M1-02 copies original buffers, Map, profile and epoch without caller mutation", () => {
    const bytes = Buffer.from("module.exports=81;"), files = new Map([["entry.cjs", bytes]]), p = profile(), e = epoch();
    const s = createManifestSnapshot({ files, entries: ["entry.cjs"], profile: p, epoch: e });
    bytes.fill(0); files.clear(); p.mode = "changed"; e.id = "changed";
    expect(readManifestSnapshot(s).files.get("entry.cjs")?.toString()).toBe("module.exports=81;");
    expect(s.profile.mode).toBe("production");
    expect(s.epoch.id).toBe("owned-manifest-unit");
  });
  it("M1-03 detached inventory reads cannot mutate private bytes or authority", () => {
    const s = snapshot({ "entry.cjs": "module.exports=81;" }), detached = readManifestSnapshot(s);
    detached.files.get("entry.cjs")?.fill(0); detached.files.clear();
    expect(readManifestSnapshot(s).files.get("entry.cjs")?.toString()).toBe("module.exports=81;");
    expect(() => readManifestSnapshot({ ...s })).toThrow("SNAPSHOT_AUTHORITY_REFUSED");
    expect(Object.isFrozen(s.entries)).toBe(true);
  });
  it("M1-04 rejects unsafe paths before any filesystem target access", () => {
    for (const f of ["/absolute", "../escape", "a/../b", "a\\b", ".env", ".git/config", "artifacts/private", "attempt5/file", "x\n.js", "a//b"])
      expect(() => manifestPath(f)).toThrow("PATH_REFUSED");
  });
  it("M1-05 rejects prefixes, duplicate entries and foreign profiles/epochs", () => {
    expect(() => snapshot({ "entry.cjs": "", "entry.cjs/child": "" })).toThrow("PREFIX_COLLISION");
    expect(() => snapshot({ "entry.cjs": "" }, ["entry.cjs", "entry.cjs"])).toThrow("ENTRY_REFUSED");
    expect(() => createManifestSnapshot({ files: new Map([["entry.cjs", Buffer.alloc(0)]]), entries: ["entry.cjs"], profile: { ...profile(), mode: "development" }, epoch: epoch() })).toThrow("INPUT_REFUSED");
    expect(() => createManifestSnapshot({ files: new Map([["entry.cjs", Buffer.alloc(0)]]), entries: ["entry.cjs"], profile: profile(), epoch: { ...epoch(), kind: "SUCCESSFUL_BUILD" } })).toThrow("INPUT_REFUSED");
  });
  it("M1-06 refuses accessors and proxies without invoking them", () => {
    let touched = false;
    const input = { get files() { touched = true; throw new Error("must not execute"); }, entries: ["entry.cjs"], profile: profile(), epoch: epoch() };
    expect(() => createManifestSnapshot(input)).toThrow("INPUT_REFUSED");
    expect(() => canonicalManifest(new Proxy({}, { ownKeys() { touched = true; throw new Error("must not execute"); } }))).toThrow("VALUE_REFUSED");
    expect(touched).toBe(false);
  });
  it("M1-07 canonical JSON rejects cycles, accessors and unbounded nesting", () => {
    const cyclic: Record<string, unknown> = {}; cyclic.self = cyclic;
    expect(() => canonicalManifest(cyclic)).toThrow("VALUE_REFUSED");
    expect(() => canonicalManifest({ get secret() { throw new Error("must not execute"); } })).toThrow("ACCESSOR_REFUSED");
    let nested: unknown = null; for (let i = 0; i < 130; i++) nested = { child: nested };
    expect(() => canonicalManifest(nested)).toThrow("RESOURCE_REFUSED");
    expect(MANIFEST_LIMITS.bytes).toBe(67108864);
    expect(MANIFEST_LIMITS.entries).toBe(20000);
  });
  it("M2-01 admits only the pinned frozen parser interface, not callbacks/plugins", () => {
    const parser = loadManifestParser();
    expect(parser.version).toBe("8.14.0"); expect(Object.isFrozen(parser)).toBe(true);
    expect(PARSER_PINS.source).toBe("3c141146168735659c30b29c925fbf9fdf4d12ad85eb83d68e2afb26a1cc248d");
    expect(() => parser.parse("", { sourceType: "script", onToken: () => undefined })).toThrow("PARSE_OPTIONS_REFUSED");
  });
  it("M2-01b freezes the reachable trusted tool graph and rechecks a held interface", () => {
    const api = loadManifestParser(), require = createRequire(import.meta.url);
    const raw = require.cache["/Users/os/hiveos/node_modules/next/dist/compiled/acorn/acorn.js"]?.exports;
    expect(raw).toBeDefined();
    for (const object of [raw, raw.Parser, raw.Parser.prototype, raw.defaultOptions, raw.tokTypes]) expect(Object.isFrozen(object)).toBe(true);
    expect(() => { raw.Parser.parse = () => ({}); }).toThrow();
    expect(() => { raw.defaultOptions.ecmaVersion = 3; }).toThrow();
    expect(() => { raw.Parser.prototype.parse = () => ({}); }).toThrow();
    expect(api.parse("require('node:fs')", { sourceType: "script" }).type).toBe("Program");
    const cached = require.cache["/Users/os/hiveos/node_modules/next/dist/compiled/acorn/acorn.js"];
    expect(cached).toBeDefined();
    if (!cached) throw new Error("owned parser cache missing");
    const descriptor = Object.getOwnPropertyDescriptor(cached, "exports");
    if (!descriptor) throw new Error("owned parser exports missing");
    let touched = false;
    try {
      Object.defineProperty(cached, "exports", { configurable: true, get() { touched = true; return raw; } });
      expect(() => api.parse("", { sourceType: "script" })).toThrow("TOOL_CACHE_REFUSED");
      expect(touched).toBe(false);
    } finally { Object.defineProperty(cached, "exports", descriptor); }
    expect(api.parse("", { sourceType: "script" }).type).toBe("Program");
  });
  it("M2-02 hostile target text remains data and unknown calls stay OPEN", () => {
    const analysis = analyzeManifestSource(snapshot({ "entry.cjs": "globalThis.__tip081NeverExecute=81; throw new Error('target'); unknownCall();" }), "entry.cjs");
    expect(codes(analysis)).toContain("UNKNOWN_NEW");
    expect(codes(analysis)).toContain("UNKNOWN_CALL");
    expect(globalThis).not.toHaveProperty("__tip081NeverExecute");
  });
  it("M2-03 aliases, computed/destructured/context loaders cannot fabricate edges", () => {
    const c = buildManifestCandidate(snapshot({ "entry.cjs": "const r=require; r('./x'); const {require:q}=module; q('./x'); module['require']('./x'); require.context('./x');", x: "" }));
    expect(c.obligations.some((o: { code: string }) => o.code === "LOADER_REFERENCE_OPEN")).toBe(true);
    expect(c.obligations.some((o: { code: string }) => o.code === "COMPUTED_LOADER_OPEN")).toBe(true);
    expect(c.edges.every((e: { status: string }) => e.status === "UNRESOLVED")).toBe(true);
  });
  it("M2-04 class/parameter/assignment shadowing refuses literal loader resolution", () => {
    for (const text of ["function f(require){require('./x');}", "class require{}; require('./x');", "require=other; require('./x');"]) {
      const c = buildManifestCandidate(snapshot({ "entry.cjs": text, x: "" }));
      expect(c.edges.some((e: { reason: string }) => e.reason === "LOADER_BINDING_OPEN")).toBe(true);
      expect(c.edges.every((e: { status: string }) => e.status !== "RESOLVED")).toBe(true);
    }
  });
  it("M2-05 records unknown dynamic, filesystem, native, eval and Function behavior", () => {
    const a = analyzeManifestSource(snapshot({ "entry.cjs": "require(name); fs.readFile(name); process.dlopen(module,name); eval(code); new Function(code);" }), "entry.cjs");
    for (const code of ["DYNAMIC_SPECIFIER", "FILESYSTEM_ASSET_OPEN", "NATIVE_LOADER_OPEN", "EVAL_OPEN", "FUNCTION_OPEN"]) expect(codes(a)).toContain(code);
  });
  it("M2-06 optional loaders/extra arguments and caught branches retain obligations", () => {
    const c = buildManifestCandidate(snapshot({ "entry.cjs": "require?.('./x'); require('./x',{}); try{require('./x')}catch(e){}", x: "" }));
    expect(c.obligations.some((o: { code: string }) => o.code === "OPTIONAL_CALL_OPEN")).toBe(true);
    expect(c.obligations.some((o: { code: string }) => o.code === "CALL_SIGNATURE_OPEN")).toBe(true);
    expect(c.obligations.some((o: { code: string }) => o.code === "CONDITIONAL_BRANCH_OPEN")).toBe(true);
    expect(c.edges.filter((e: { reason: string }) => ["OPTIONAL_CALL_OPEN", "CALL_SIGNATURE_OPEN"].includes(e.reason))).toHaveLength(2);
  });
  it("M2-07 retains parse failures and invalid UTF8 rather than recovering coverage", () => {
    expect(codes(analyzeManifestSource(snapshot({ "entry.cjs": "require(" }), "entry.cjs"))).toContain("PARSE_ERROR");
    expect(codes(analyzeManifestSource(snapshot({ "entry.cjs": Buffer.from([0xc0, 0xaf]) }), "entry.cjs"))).toContain("PARSE_ERROR");
  });
  it("M2-08 exposes opaque native/assets and unsupported executable formats as OPEN", () => {
    const s = snapshot({ "entry.cjs": "", "asset.txt": "asset", "runtime.node": Buffer.from([1, 2]), "runner.ts": "" });
    expect(codes(analyzeManifestSource(s, "asset.txt"))).toContain("ASSET_COVERAGE_OPEN");
    expect(codes(analyzeManifestSource(s, "runtime.node"))).toContain("NATIVE_COVERAGE_OPEN");
    expect(codes(analyzeManifestSource(s, "runner.ts"))).toContain("UNSUPPORTED_FORMAT");
  });
  it("M2-09 labels UTF16 offsets explicitly for Unicode source", () => {
    const text = "const face='😀'; require('./x');", s = snapshot({ "entry.cjs": text, x: "" }), a = analyzeManifestSource(s, "entry.cjs");
    expect(a.offsetEncoding).toBe("UTF16_CODE_UNITS");
    expect(a.sites.find((site: { kind: string }) => site.kind === "require")?.start).toBe(text.indexOf("require("));
  });
  it("M2-10 honors package mode and marks absent mode assumptions OPEN", () => {
    const s = snapshot({ "entry.cjs": "", "esm/package.json": '{"type":"module"}', "esm/code.js": "export const x=81;", "other.js": "export const x=81;" });
    expect(analyzeManifestSource(s, "esm/code.js").sourceType).toBe("module");
    expect(codes(analyzeManifestSource(s, "other.js"))).toContain("SOURCE_MODE_OPEN");
  });
  it("M2-11 strict JSON rejects duplicate keys and invalid UTF8", () => {
    const s = snapshot({ "entry.cjs": "", "bad.json": '{"x":1,"x":2}', "utf.json": Buffer.from([0xff]) });
    expect(codes(analyzeManifestSource(s, "bad.json"))).toContain("PARSE_ERROR");
    expect(codes(analyzeManifestSource(s, "utf.json"))).toContain("PARSE_ERROR");
  });
  it("M2-12 site growth refuses before exceeding the logical entry envelope", () => {
    const s = snapshot({ "entry.cjs": "f();".repeat(20000) });
    expect(() => analyzeManifestSource(s, "entry.cjs")).toThrow("RESOURCE_REFUSED");
    const split = snapshot({ "entry.cjs": "f();".repeat(11000), "other.cjs": "f();".repeat(11000) });
    expect(() => buildManifestCandidate(split)).toThrow("RESOURCE_REFUSED");
  });
  it("M2-13 tagged templates are invocations with explicit OPEN coverage", () => {
    const c = buildManifestCandidate(snapshot({ "entry.cjs": "tag`asset`; require`./x`;" }));
    expect(c.obligations.filter((o: { code: string }) => o.code === "UNKNOWN_TAGGED_TEMPLATE_OPEN")).toHaveLength(2);
    expect(c.analyses[0].sites.some((s: { kind: string }) => s.kind === "loader-reference")).toBe(true);
  });
  it("M2-14 the AST node envelope is aggregate across candidate files", () => {
    const s = snapshot({ "entry.cjs": ";".repeat(110000), "other.cjs": ";".repeat(110000) });
    expect(() => buildManifestCandidate(s)).toThrow("RESOURCE_REFUSED");
  });
  it("M2-15 module sources have no invented implicit CJS require binding", () => {
    const c = buildManifestCandidate(snapshot({ "entry.mjs": "require('./x.mjs'); require.resolve('./x.mjs');", "x.mjs": "export const x=81;" }, ["entry.mjs"]));
    expect(c.edges).toHaveLength(2);
    expect(c.edges.every((e: { status: string; reason: string }) => e.status === "UNRESOLVED" && e.reason === "LOADER_BINDING_OPEN")).toBe(true);
  });
  it("M2-16 unknown source mode and with scopes never fabricate loader bindings", () => {
    const c = buildManifestCandidate(snapshot({ "entry.cjs": "with(obj){require('./x.cjs')}", "other.js": "require('./x.cjs');", "x.cjs": "" }));
    expect(c.obligations.some((o: { code: string }) => o.code === "DYNAMIC_SCOPE_OPEN")).toBe(true);
    expect(c.edges.every((e: { reason: string }) => e.reason === "LOADER_BINDING_OPEN")).toBe(true);
  });
  it("M3-01 resolves CJS literal extensions/main without executing target", () => {
    const s = snapshot(packageRows()), e = resolveManifestSpecifier(s, "entry.cjs", "pkg", "require");
    expect(e.status).toBe("RESOLVED"); expect(e.target).toBe("node_modules/pkg/index.js");
    expect(e.packageFiles.map((p: { path: string }) => p.path)).toContain("node_modules/pkg/package.json");
  });
  it("M3-02 distinguishes prefix-only Node builtins", () => {
    const s = snapshot({ "entry.cjs": "" });
    expect(resolveManifestSpecifier(s, "entry.cjs", "node:test", "require").status).toBe("BUILTIN");
    expect(resolveManifestSpecifier(s, "entry.cjs", "test", "require").status).toBe("UNRESOLVED");
    expect(resolveManifestSpecifier(s, "entry.cjs", "fs", "require").status).toBe("BUILTIN");
  });
  it("M3-03 ESM does not fabricate extension/directory fallback", () => {
    const s = snapshot({ "entry.cjs": "", "x.js": "", "dir/index.js": "" });
    expect(resolveManifestSpecifier(s, "entry.cjs", "./x", "import").status).toBe("UNRESOLVED");
    expect(resolveManifestSpecifier(s, "entry.cjs", "./dir", "import").status).toBe("UNRESOLVED");
    expect(resolveManifestSpecifier(s, "entry.cjs", "./x", "require").target).toBe("x.js");
    const invalid = snapshot({ "entry.cjs": "", ".foo": "", "package.json": '{"imports":{"#":"./x.js","#/x":"./x.js"}}', "x.js": "" });
    for (const specifier of [".foo", "#", "#/x"]) expect(resolveManifestSpecifier(invalid, "entry.cjs", specifier, "require").reason).toBe("INVALID_SPECIFIER");
  });
  it("M3-04 honors exports condition object order and null encapsulation", () => {
    const s = snapshot({ "entry.cjs": "", "node_modules/pkg/package.json": '{"exports":{".":{"default":"./d.js","require":"./r.js"},"./blocked":null}}', "node_modules/pkg/d.js": "", "node_modules/pkg/r.js": "" });
    expect(resolveManifestSpecifier(s, "entry.cjs", "pkg", "require").target).toBe("node_modules/pkg/d.js");
    expect(resolveManifestSpecifier(s, "entry.cjs", "pkg/blocked", "require").reason).toBe("EXPORTS_BLOCKED");
    expect(resolveManifestSpecifier(s, "entry.cjs", "pkg/unlisted", "require").reason).toBe("EXPORTS_BLOCKED");
    for (const key of ["node-addons", "module-sync", "custom", "browser", "development", "types"]) {
      const unsupported = snapshot({ "entry.cjs": "", "node_modules/pkg/package.json": JSON.stringify({ exports: { [key]: "./special.js", default: "./d.js" } }), "node_modules/pkg/special.js": "", "node_modules/pkg/d.js": "" });
      expect(resolveManifestSpecifier(unsupported, "entry.cjs", "pkg", "require").reason).toBe("UNSUPPORTED_EXPORTS");
    }
    const nested = snapshot({ "entry.cjs": "", "node_modules/pkg/package.json": '{"exports":{"require":{"import":"./i.js","default":"./r.js"},"import":{"require":"./r.js","default":"./i.js"}}}', "node_modules/pkg/r.js": "", "node_modules/pkg/i.js": "" });
    expect(resolveManifestSpecifier(nested, "entry.cjs", "pkg", "require").target).toBe("node_modules/pkg/r.js");
    expect(resolveManifestSpecifier(nested, "entry.cjs", "pkg", "import").target).toBe("node_modules/pkg/i.js");
    const nestedUnknown = snapshot({ "entry.cjs": "", "node_modules/pkg/package.json": '{"exports":{"require":{"module-sync":"./sync.js","default":"./r.js"}}}', "node_modules/pkg/r.js": "", "node_modules/pkg/sync.js": "" });
    expect(resolveManifestSpecifier(nestedUnknown, "entry.cjs", "pkg", "require").reason).toBe("UNSUPPORTED_EXPORTS");
  });
  it("M3-05 resolves scoped/nested packages from the importer", () => {
    const s = snapshot({ "entry.cjs": "", "node_modules/outer/index.cjs": "", "node_modules/outer/node_modules/@scope/pkg/package.json": '{"main":"index.js"}', "node_modules/outer/node_modules/@scope/pkg/index.js": "" });
    expect(resolveManifestSpecifier(s, "node_modules/outer/index.cjs", "@scope/pkg", "require").target).toBe("node_modules/outer/node_modules/@scope/pkg/index.js");
  });
  it("M3-06 unsupported wildcards/arrays/escaping exports stay unresolved", () => {
    for (const metadata of ['{"exports":{"./*":"./*.js"}}', '{"exports":["./index.js"]}', '{"exports":"../escape.js"}']) {
      const s = snapshot({ "entry.cjs": "", "node_modules/pkg/package.json": metadata, "node_modules/pkg/index.js": "" });
      expect(resolveManifestSpecifier(s, "entry.cjs", "pkg", "require").status).toBe("UNRESOLVED");
    }
  });
  it("M3-07 exact imports are data-only; bare/wildcard/self semantics remain OPEN", () => {
    const s = snapshot({ "entry.cjs": "", "package.json": '{"name":"self","imports":{"#x":"./x.js","#external":"pkg"},"exports":"./x.js"}', "x.js": "" });
    expect(resolveManifestSpecifier(s, "entry.cjs", "#x", "require").target).toBe("x.js");
    expect(resolveManifestSpecifier(s, "entry.cjs", "#external", "require").reason).toBe("UNSUPPORTED_IMPORTS");
    expect(resolveManifestSpecifier(s, "entry.cjs", "self", "require").reason).toBe("UNSUPPORTED_SELF_REFERENCE");
    for (const mode of ["require", "import"] as const) {
      for (const condition of ["node-addons", "module-sync", "custom"]) {
        for (const nested of [false, true]) {
          const unsupported = { [condition]: "./x.js", default: "./x.js" };
          const target = nested ? { [mode]: unsupported, default: "./x.js" } : unsupported;
          const conditional = snapshot({ "entry.cjs": "", "package.json": JSON.stringify({ imports: { "#x": target } }), "x.js": "" });
          const edge = resolveManifestSpecifier(conditional, "entry.cjs", "#x", mode);
          expect(edge.status).toBe("UNRESOLVED");
          expect(edge.target).toBeNull();
          expect(edge.reason).toBe("UNSUPPORTED_IMPORTS");
        }
      }
    }
  });
  it("M3-08 duplicate package keys cannot fabricate condition resolution", () => {
    const s = snapshot({ "entry.cjs": "", "node_modules/pkg/package.json": '{"exports":"./a.js","exports":"./b.js"}', "node_modules/pkg/a.js": "", "node_modules/pkg/b.js": "" });
    expect(resolveManifestSpecifier(s, "entry.cjs", "pkg", "require").reason).toBe("UNSUPPORTED_PACKAGE_METADATA");
  });
  it("M3-09 records absence as supplied-inventory assumptions, not actual filesystem facts", () => {
    const s = snapshot({ "entry.cjs": "" }), e = resolveManifestSpecifier(s, "entry.cjs", "./missing", "require");
    expect(e.status).toBe("UNRESOLVED"); expect(e.absentCandidates).toContain("missing.js");
    expect(e).not.toHaveProperty("filesystemAbsent");
  });
  it("M3-09b imports and source mode never inherit across node_modules boundaries", () => {
    const s = snapshot({ "entry.cjs": "", "package.json": '{"type":"module","imports":{"#x":"./x.js"}}', "x.js": "", "node_modules/pkg/entry.js": "require('#x');" });
    expect(resolveManifestSpecifier(s, "node_modules/pkg/entry.js", "#x", "require").reason).toBe("UNSUPPORTED_IMPORTS");
    expect(codes(analyzeManifestSource(s, "node_modules/pkg/entry.js"))).toContain("SOURCE_MODE_OPEN");
  });
  it("M3-09c unmodelled URL targets are unresolved rather than filename matches", () => {
    for (const target of ["./x.js?q", "./x.js#fragment", "./x%2ejs", "././x.js", "./a//x.js"]) {
      const s = snapshot({ "entry.cjs": "", "node_modules/pkg/package.json": JSON.stringify({ exports: target }), "node_modules/pkg/x.js": "" });
      expect(resolveManifestSpecifier(s, "entry.cjs", "pkg", "import").reason).toBe("UNSUPPORTED_EXPORTS");
    }
  });
  it("M3-10 canonical candidate identity is deterministic and never clears OPEN behavior", () => {
    const rows = { "entry.cjs": "unknown();", "asset.txt": "data" }, a = buildManifestCandidate(snapshot(rows)), b = buildManifestCandidate(snapshot({ "asset.txt": "data", "entry.cjs": "unknown();" }));
    expect(a.digest).toBe(b.digest);
    expect(a.obligations.length).toBeGreaterThan(0);
    const { digest, ...body } = a; expect(manifestDigest(body)).toBe(digest);
  });
});
