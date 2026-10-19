// Source-reviewed fixed one-shot tooling. Main alone runs it. Capture complete new
// hand-authored cuts BEFORE importing the deriver. Create-only destinations.
import {openSync, fstatSync, readSync, writeSync, closeSync, constants} from "node:fs";
import {createHash} from "node:crypto";
import {pathToFileURL} from "node:url";
import {performance} from "node:perf_hooks";

const ROOT = "/Users/os/hiveos/";
const TOOL_PINS = Object.freeze([
  {path: "node_modules/typescript/lib/typescript.js", bytes: 9112572,
    sha256: "3ae902c92cc44dace175c0e69e13a4b0899f6983c6121d76b9ab8dd5795e7675"},
  {path: "node_modules/typescript/package.json", bytes: 3620,
    sha256: "822ef7ca6452205657b6288b066481ecf508bfbf43455d715cf7d3ec457561e6"},
]);
const utf8Decoder = new TextDecoder("utf-8", {fatal: true, ignoreBOM: true});
const decodeUtf8 = Function.prototype.call.bind(TextDecoder.prototype.decode, utf8Decoder);
export const P3_HAND_SOURCE_NAMES = Object.freeze([
  "scripts/test/derive-private-summary-tip081-p3.mjs",
  "scripts/test/private-summary-runtime-tip081-p3.mjs",
  "scripts/test/private-summary-verifier-tip081-p3.mjs",
  "scripts/test/admit-private-summary-tip081-p3.mjs",
  "scripts/test/capture-private-summary-tip081-p3.mjs",
  "scripts/test/check-private-summary-tip081-p3.mjs",
  "scripts/test/preserve-private-summary-tip081-p3.mjs",
  "tests/unit/private-summary-tip081-p3.test.ts",
  "vitest-tip081-p3.config.ts", "tsconfig-tip081-p3.json",
  "docs/verification/TIP-081A_P3_TOOL_HARNESS_REPORT.md",
  "docs/contractor/tips/TIP-081A_P3_FROZEN_CONTRACT.md",
]);
export const P3_ARTIFACT_NAMES = Object.freeze([
  "scripts/test/generated/private-summary-tip081-p3.candidate.mjs",
  "scripts/test/generated/private-summary-tip081-p3.inventory.json",
  "scripts/test/generated/private-summary-tip081-p3.profile.json",
  "scripts/test/generated/private-summary-tip081-p3.alias-fault.candidate.mjs",
  "scripts/test/generated/private-summary-tip081-p3.alias-fault.inventory.json",
  "scripts/test/generated/private-summary-tip081-p3.alias-fault.profile.json",
]);
const P2_NAMES = Object.freeze([
  "scripts/test/store-tip081-inventory-source.mjs", "scripts/test/verify-tip081-inventory-source.mjs",
  "scripts/test/runtime-tip081-manifest.mjs", "scripts/test/codec-tip081-source-v2.mjs", "scripts/test/admit-tip081-source-v2.mjs",
  "node_modules/next/dist/compiled/acorn/acorn.js", "node_modules/next/dist/compiled/acorn/package.json",
  "vitest-tip081.config.ts", "tsconfig.json", "next.config.ts", "tests/unit/evidence-studio-source-v2.test.ts",
  "scripts/test/guard-scanners-tip081-p1.mjs", "tests/unit/evidence-studio-p1-guard-scanners.test.ts",
  "vitest-tip081-p1.config.ts", "docs/verification/TIP-081A_P1_ALLOCATION.md",
  "scripts/test/allocations-tip081-p2.mjs", "tests/unit/evidence-studio-p2-allocation-kernel.test.ts",
  "vitest-tip081-p2.config.ts", "docs/verification/TIP-081A_P2_ALLOCATION.md", "docs/verification/TIP-081A_P2_BUILDER_REPORT.md",
  "scripts/test/derive-private-grammar-tip081-p2.mjs", "scripts/test/private-grammar-runtime-tip081-p2.mjs",
  "scripts/test/scalar-grammar-bodies-tip081-p2.mjs", "scripts/test/capture-private-grammar-tip081-p2.mjs",
  "scripts/test/release-private-grammar-tip081-p2.mjs", "scripts/test/admit-private-grammar-tip081-p2.mjs",
  "tests/unit/private-grammar-tip081-p2.test.ts", "vitest-tip081-p2-grammar.config.ts", "tsconfig-tip081-p2-grammar.json",
  "scripts/test/generated/private-grammar-tip081-p2.checked.candidate.mjs",
  "scripts/test/generated/private-grammar-tip081-p2.checked.inventory.json",
  "scripts/test/generated/private-grammar-tip081-p2.checked.profile.json",
  "scripts/test/generated/private-grammar-tip081-p2.v6.candidate.mjs",
  "scripts/test/generated/private-grammar-tip081-p2.v6.inventory.json",
  "scripts/test/diagnose-private-grammar-depth-tip081-p2.mjs", "scripts/test/diagnose-private-grammar-hybrid-depth-tip081-p2.mjs",
]);
export function p3ToolDigest(bytes) { return createHash("sha256").update(bytes).digest("hex"); }
export function p3FixedRead(path, maximum = 16777216) {
  const fd = openSync(ROOT + path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = fstatSync(fd);
    if (!before.isFile() || !Number.isSafeInteger(before.size) || before.size < 1 || before.size > maximum) throw new Error("P3_CAPTURE_SIZE");
    const bytes = Buffer.alloc(before.size); let offset = 0;
    while (offset < bytes.length) {
      const n = readSync(fd, bytes, offset, Math.min(32768, bytes.length - offset), offset);
      if (!n) throw new Error("P3_CAPTURE_SHORT"); offset += n;
    }
    if (readSync(fd, Buffer.alloc(1), 0, 1, bytes.length)) throw new Error("P3_CAPTURE_GREW");
    const after = fstatSync(fd);
    if (after.dev !== before.dev || after.ino !== before.ino || after.size !== before.size ||
        after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs) throw new Error("P3_CAPTURE_CHANGED");
    return bytes;
  } finally { closeSync(fd); }
}
export function p3CreateOnly(path, text) {
  if (typeof text !== "string" || Buffer.byteLength(text) > 16777216) throw new Error("P3_CAPTURE_OUTPUT_CAP");
  const bytes = Buffer.from(text, "utf8"), fd = openSync(ROOT + path, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
  try {
    let n = 0;
    while (n < bytes.length) {
      const written = writeSync(fd, bytes, n, bytes.length - n);
      if (!Number.isSafeInteger(written) || written <= 0 || written > bytes.length - n) throw new Error("P3_CAPTURE_WRITE_PROGRESS");
      n += written;
    }
  }
  finally { closeSync(fd); }
  return {path, bytes: bytes.length, sha256: p3ToolDigest(bytes)};
}
export function p3PredecessorPins() {
  // DATA only. The historical 'driver' string is NEVER read as code/evaluated.
  const old = JSON.parse(p3FixedRead("docs/verification/TIP-081A_P2_GRAMMAR_AFTER_PINS.json", 65536).toString("utf8"));
  const rows = old.snapshot?.rows;
  if (!Array.isArray(rows) || rows.length !== P2_NAMES.length) throw new Error("P3_PREDECESSOR_ROWS");
  const expected = [];
  for (let i = 0; i < P2_NAMES.length; i++) {
    const row = rows[i];
    if (row.path !== P2_NAMES[i] || !Number.isSafeInteger(row.bytes) || row.bytes < 1 || row.bytes > 16777216 ||
        typeof row.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(row.sha256) || row.match !== true) throw new Error("P3_PREDECESSOR_DOMAIN");
    expected.push({path: P2_NAMES[i], bytes: row.bytes, sha256: row.sha256});
  }
  return expected;
}
export function p3CheckPredecessors(expected) {
  if (expected.length !== P2_NAMES.length) throw new Error("P3_PREDECESSOR_COUNT");
  return expected.map((pin, i) => {
    if (pin.path !== P2_NAMES[i]) throw new Error("P3_PREDECESSOR_PATH");
    const bytes = p3FixedRead(P2_NAMES[i]);
    if (bytes.length !== pin.bytes || p3ToolDigest(bytes) !== pin.sha256) throw new Error("P3_PREDECESSOR_DRIFT");
    return {...pin, match: true};
  });
}
export function p3SourceCut(names) {
  // Caller is fixed trusted tool code below; runtime/user wire never supplies names.
  return names.map(path => { const bytes = p3FixedRead(path); return {path, bytes: bytes.length,
    sha256: p3ToolDigest(bytes), sourceText: decodeUtf8(bytes)}; });
}
function checkToolPins() {
  return TOOL_PINS.map(pin => {
    const bytes = p3FixedRead(pin.path, pin.bytes);
    if (bytes.length !== pin.bytes || p3ToolDigest(bytes) !== pin.sha256) throw new Error("P3_TRUSTED_TOOL_PIN_DRIFT");
    return {...pin, match: true};
  });
}
export function captureP3CheckedSources() {
  if (arguments.length !== 0) throw new Error("P3_CAPTURE_ARITY");
  const cuts = p3SourceCut([...P3_HAND_SOURCE_NAMES, ...P3_ARTIFACT_NAMES]);
  return p3CreateOnly("docs/verification/TIP-081A_P3_CHECKED_SOURCE_CUT.json", JSON.stringify({
    purpose: "TIP081_P3_COMPLETE_PRECHECK_SOURCE_CUT", checks: "UNRUN", cuts}));
}
export async function captureAndDeriveP3() {
  if (arguments.length !== 0) throw new Error("P3_CAPTURE_ARITY");
  const started = performance.now(), predecessorPins = p3PredecessorPins(), predecessor = p3CheckPredecessors(predecessorPins), toolPins = checkToolPins();
  const cuts = p3SourceCut(P3_HAND_SOURCE_NAMES);
  const first = p3CreateOnly("docs/verification/TIP-081A_P3_FIRST_SOURCE_CUT.json", JSON.stringify({
    purpose: "TIP081_P3_COMPLETE_FIRST_HAND_SOURCE_CUT", predecessorPins, toolPins, cuts,
    importedDeriver: false, checks: "UNRUN", realParserDisabled: true}));
  // No static deriver import above: complete strict-UTF8 first source is persisted,
  // and both fixed TS TOOL pins checked BEFORE its static import can execute.
  // Main serial stopped-editing protocol binds the following fixed fileURL read;
  // no global protection against unrelated hostile disk mutation is claimed.
  const derivation = await import(pathToFileURL(ROOT + "scripts/test/derive-private-summary-tip081-p3.mjs").href);
  const result = derivation.derivePrivateSummaryP3(), artifacts = [];
  for (const [domain, stem] of [[result.normal, "private-summary-tip081-p3"], [result.aliasFault, "private-summary-tip081-p3.alias-fault"]]) {
    artifacts.push(p3CreateOnly("scripts/test/generated/" + stem + ".candidate.mjs", domain.candidate));
    artifacts.push(p3CreateOnly("scripts/test/generated/" + stem + ".inventory.json", domain.inventory));
    artifacts.push(p3CreateOnly("scripts/test/generated/" + stem + ".profile.json", domain.profile));
  }
  p3CreateOnly("docs/verification/TIP-081A_P3_FIRST_EMITTED_SOURCE_CUT.json", JSON.stringify({
    purpose: "TIP081_P3_COMPLETE_FIRST_EMITTED_SOURCE_CUT", checks: "UNRUN", cuts: p3SourceCut(P3_ARTIFACT_NAMES)}));
  const evidence = {purpose: "TIP081_P3_SOURCE_CAPTURE_DERIVATION_ONLY", first, predecessor, toolPins, artifacts,
    derivationReview: result.review, parserImported: false, sourceAcquired: false, checks: "UNRUN",
    realParserDisabled: true, milliseconds: performance.now() - started};
  p3CreateOnly("docs/verification/TIP-081A_P3_DERIVATION_EFFECT.json", JSON.stringify(evidence));
  return evidence;
}
if (process.argv.length === 2 && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(await captureAndDeriveP3()));
}
