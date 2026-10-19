// One-shot mechanical TEXT capture. Main owns its supervised effect budget.
// No output is imported, parsed as target grammar, or executed by this runner.
import {openSync, fstatSync, readSync, writeSync, closeSync, mkdirSync, lstatSync, constants} from "node:fs";
import {createHash} from "node:crypto";
import {pathToFileURL} from "node:url";

const ROOT = "/Users/os/hiveos/";
const PINS = Object.freeze([
  {path: "scripts/test/derive-private-grammar-tip081-p2.mjs", bytes: 85462, sha256: "fd5c46b72a919d35f9d55282164989dae5cd4169f165740d885dd94dde5f272b"},
  {path: "scripts/test/private-grammar-runtime-tip081-p2.mjs", bytes: 58100, sha256: "84802f210e63cbb2ea9d1f069056abb9e785490bed03280b836514cf3f0e2531"},
  {path: "scripts/test/scalar-grammar-bodies-tip081-p2.mjs", bytes: 14174, sha256: "f3b22a9e9e44c084fd74bea0918baba0c6d2453dc87166b8c888a7d6eef3ad41"},
  {path: "node_modules/next/dist/compiled/acorn/acorn.js", bytes: 121634, sha256: "3c141146168735659c30b29c925fbf9fdf4d12ad85eb83d68e2afb26a1cc248d"},
  {path: "node_modules/next/dist/compiled/acorn/package.json", bytes: 51, sha256: "aa6eff9593179bc7379017992eda314ce97bd7c6576869d82d514139ce612cca"},
  {path: "node_modules/typescript/lib/typescript.js", bytes: 9112572, sha256: "3ae902c92cc44dace175c0e69e13a4b0899f6983c6121d76b9ab8dd5795e7675"},
  {path: "node_modules/typescript/package.json", bytes: 3620, sha256: "822ef7ca6452205657b6288b066481ecf508bfbf43455d715cf7d3ec457561e6"},
]);
const CANDIDATE_PATH = ROOT + "scripts/test/generated/private-grammar-tip081-p2.v6.candidate.mjs";
const INVENTORY_PATH = ROOT + "scripts/test/generated/private-grammar-tip081-p2.v6.inventory.json";
const OUTPUT_DIRECTORY = ROOT + "scripts/test/generated";
const INPUT_SNAPSHOT_PATH = ROOT + "docs/verification/TIP-081A_P2_INERT_V6_INPUTS.json";
const CANDIDATE_MAX = 8913152;
const INVENTORY_MAX = 16777216;
const sourceCode = Function.prototype.call.bind(String.prototype.charCodeAt);
const Encoder = TextEncoder;
const encode = Function.prototype.call.bind(TextEncoder.prototype.encode);
const encoder = new Encoder();
const stringify = JSON.stringify;
const decoder = new TextDecoder("utf-8", {fatal: true});

function hash(bytes) { return createHash("sha256").update(bytes).digest("hex"); }
function verifyNamed(pin) {
  const fd = openSync(ROOT + pin.path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = fstatSync(fd);
    if (!before.isFile() || before.size !== pin.bytes) throw new Error("INERT_NAMED_SIZE_DRIFT");
    const buffer = Buffer.alloc(pin.bytes);
    let offset = 0;
    while (offset < buffer.length) {
      const remaining = buffer.length - offset;
      const amount = remaining > 32768 ? 32768 : remaining;
      const read = readSync(fd, buffer, offset, amount, offset);
      if (!read) throw new Error("INERT_NAMED_SHORT_READ");
      offset += read;
    }
    const probe = Buffer.alloc(1);
    if (readSync(fd, probe, 0, 1, buffer.length)) throw new Error("INERT_NAMED_GROWTH");
    const after = fstatSync(fd);
    if (after.dev !== before.dev || after.ino !== before.ino || after.size !== before.size ||
        after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs || hash(buffer) !== pin.sha256)
      throw new Error("INERT_NAMED_PIN_DRIFT");
    return buffer;
  } finally { closeSync(fd); }
}
function utf8Length(value, maximum) {
  let bytes = 0;
  for (let i = 0; i < value.length; i++) {
    const c = sourceCode(value, i);
    if (c < 128) bytes++;
    else if (c < 2048) bytes += 2;
    else if (c >= 55296 && c <= 56319 && i + 1 < value.length &&
        sourceCode(value, i + 1) >= 56320 && sourceCode(value, i + 1) <= 57343) { bytes += 4; i++; }
    else bytes += 3;
    if (bytes > maximum) throw new Error("INERT_UTF8_OUTPUT_CAP");
  }
  return bytes;
}
function quotedJsonUnits(value) {
  let units = 2;
  for (let i = 0; i < value.length; i++) {
    const c = sourceCode(value, i);
    // Exact upper bound before stringify, including escaped lone surrogates.
    units += c === 34 || c === 92 ? 2 : c < 32 ? 6 :
      c >= 55296 && c <= 57343 ? 6 : 1;
    if (units > INVENTORY_MAX) throw new Error("INERT_JSON_STRING_CAP");
  }
  return units;
}
function jsonUnits(value, depth = 0) {
  if (depth > 16) throw new Error("INERT_JSON_DEPTH_CAP");
  if (value === null) return 4;
  if (typeof value === "string") return quotedJsonUnits(value);
  if (typeof value === "boolean") return 5;
  if (typeof value === "number" && Number.isFinite(value)) return 32;
  if (value === undefined) throw new Error("INERT_UNDEFINED_INVENTORY");
  let units = 2;
  if (Array.isArray(value)) {
    if (value.length > 40000) throw new Error("INERT_JSON_ARRAY_CAP");
    for (let i = 0; i < value.length; i++) {
      units += jsonUnits(value[i], depth + 1) + 1;
      if (units > INVENTORY_MAX) throw new Error("INERT_JSON_OUTPUT_CAP");
    }
    return units;
  }
  if (typeof value !== "object") throw new Error("INERT_INVENTORY_SCHEMA");
  const keys = Object.keys(value);
  if (keys.length > 32) throw new Error("INERT_JSON_RECORD_CAP");
  for (let i = 0; i < keys.length; i++) {
    units += quotedJsonUnits(keys[i]) + 2 + jsonUnits(value[keys[i]], depth + 1);
    if (units > INVENTORY_MAX) throw new Error("INERT_JSON_OUTPUT_CAP");
  }
  return units;
}
function writeNew(path, bytes) {
  // No overwrite/retry/truncation. Failure preserves a partial evidence artifact
  // at this exact path; Main must review it before any subsequent capture.
  const fd = openSync(path, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
  try {
    let offset = 0;
    while (offset < bytes.length) {
      const remaining = bytes.length - offset;
      const amount = remaining > 32768 ? 32768 : remaining;
      const written = writeSync(fd, bytes, offset, amount);
      if (!written) throw new Error("INERT_OUTPUT_SHORT_WRITE");
      offset += written;
    }
  } finally { closeSync(fd); }
}

export async function capturePrivateGrammarP2() {
  if (arguments.length !== 0 || process.argv.length !== 2) throw new Error("INERT_FIXED_ARITY");
  // Exactly seven approved fixed inputs, including the two trusted TS tool files,
  // are checked BEFORE importing the derivation tool. Acorn is only read as TEXT.
  const inputSources = [];
  for (let i = 0; i < PINS.length; i++) {
    const pin = PINS[i], bytes = verifyNamed(pin);
    if (i < 3) inputSources.push({path: pin.path, bytes: pin.bytes, sha256: pin.sha256, text: decoder.decode(bytes)});
  }
  // A real same-FD byte snapshot of this REPAIRED cut, before tool import. It is
  // NOT reconstructed first-failure source and cannot overwrite predecessor data.
  const inputSnapshot = {purpose: "TIP081_P2_INERT_V6_INPUT_TEXT", parserAdmission: "ALLOCATION_COVERAGE_OPEN",
    importedCandidate: false, frozenSources: inputSources};
  if (jsonUnits(inputSnapshot) > 2097152) throw new Error("INERT_INPUT_SNAPSHOT_CAP");
  const snapshotText = stringify(inputSnapshot);
  const snapshotLength = utf8Length(snapshotText, 2097152);
  const snapshotBytes = encode(encoder, snapshotText);
  if (snapshotBytes.length !== snapshotLength) throw new Error("INERT_SNAPSHOT_ENCODING_DRIFT");
  writeNew(INPUT_SNAPSHOT_PATH, snapshotBytes);
  const {derivePrivateGrammarP2} = await import(pathToFileURL(ROOT + PINS[0].path).href);
  const result = derivePrivateGrammarP2();
  if (result.purpose !== "TIP081_P2_OFFLINE_DERIVATION_CANDIDATE_ONLY" ||
      result.parserAdmission !== "ALLOCATION_COVERAGE_OPEN" || result.installedParserImported !== false ||
      typeof result.candidate !== "string" || result.candidate.length > 2228288)
    throw new Error("INERT_RESULT_SCHEMA");
  const inventory = {
    purpose: result.purpose, parserAdmission: result.parserAdmission,
    installedParserImported: false, sourcePin: result.sourcePin, packagePin: result.packagePin,
    sourceBytes: result.sourceBytes, candidateHash: result.candidateHash,
    inventoryHash: result.inventoryHash, runtimeHash: result.runtimeHash,
    rows: result.rows, open: result.open, unmatched: result.unmatched,
    startup: result.startup, staticBytes: result.staticBytes,
    workspace: result.workspace, workspaceSegmentBytes: result.workspaceSegmentBytes,
    workspaceBytes: result.workspaceBytes, hookSites: result.hookSites,
    emittedEffects: result.emittedEffects, emittedUnknown: result.emittedUnknown,
    ruleManifest: result.ruleManifest, staticArrayAudit: result.staticArrayAudit,
    provenance: {frozenInputs: PINS, syntheticAdapterEnabled: false, realParserDisabled: true,
      coverageProof: "OPEN", generationOnly: true},
  };
  if (jsonUnits(inventory) > INVENTORY_MAX) throw new Error("INERT_INVENTORY_PRESTRINGIFY_CAP");
  const inventoryText = stringify(inventory);
  const candidateUnits = utf8Length(result.candidate, CANDIDATE_MAX);
  const inventoryUnits = utf8Length(inventoryText, INVENTORY_MAX);
  const candidateBytes = encode(encoder, result.candidate);
  const inventoryBytes = encode(encoder, inventoryText);
  if (candidateBytes.length !== candidateUnits || inventoryBytes.length !== inventoryUnits) throw new Error("INERT_ENCODING_DRIFT");
  // Check both payload caps before opening either output. No profile is invented
  // for this first diagnostic; OFF text is not an acceptance/admission artifact.
  // Only this exact new owned directory may be created; no recursive mkdir.
  try { mkdirSync(OUTPUT_DIRECTORY, {mode: 0o700}); }
  catch (error) { if (!error || error.code !== "EEXIST") throw error; }
  const directory = lstatSync(OUTPUT_DIRECTORY);
  if (!directory.isDirectory() || directory.isSymbolicLink()) throw new Error("INERT_OUTPUT_DIRECTORY_DRIFT");
  writeNew(CANDIDATE_PATH, candidateBytes);
  writeNew(INVENTORY_PATH, inventoryBytes);
  const summary = stringify({purpose: "TIP081_P2_INERT_DIAGNOSTIC_CAPTURE", importedCandidate: false,
    parserAdmission: "ALLOCATION_COVERAGE_OPEN", sourceRows: result.rows.length,
    openRows: result.open.length, unmatchedRows: result.unmatched.length,
    candidateBytes: candidateBytes.length, candidateSha256: hash(candidateBytes),
    inventoryBytes: inventoryBytes.length, inventorySha256: hash(inventoryBytes),
    staticBytes: result.staticBytes, workspaceBytes: result.workspaceBytes});
  if (summary.length > 4096) throw new Error("INERT_SUMMARY_CAP");
  return summary;
}

// Main supervises the only CLI invocation. No ambient run starts on import.
if (process.argv.length === 2 && process.argv[1] === ROOT + "scripts/test/capture-private-grammar-tip081-p2.mjs") {
  const summary = await capturePrivateGrammarP2();
  process.stdout.write(summary + "\n");
}
