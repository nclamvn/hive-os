// Main's one-shot mechanical synthetic-check release capture. NEVER run by Builder.
// Reads only the reviewed OFF V6 tuple, imports no grammar, and preserves predecessors.
import {openSync, fstatSync, readSync, writeSync, closeSync, lstatSync, constants} from "node:fs";
import {createHash} from "node:crypto";

const ROOT = "/Users/os/hiveos/";
const INPUTS = Object.freeze([
  Object.freeze({path: "scripts/test/generated/private-grammar-tip081-p2.v6.candidate.mjs", bytes: 931985,
    sha256: "dac5bda74d57e9e9f0fcfefa614c0802aa6458670307bd610a479923da8fa47a"}),
  Object.freeze({path: "scripts/test/generated/private-grammar-tip081-p2.v6.inventory.json", bytes: 5709412,
    sha256: "989f367de85e4b6fa9728e23accc198a3763b72c459d257d4dcf3726a82f8c90"}),
]);
const DIRECTORY = ROOT + "scripts/test/generated";
const OUTPUTS = Object.freeze({
  candidate: DIRECTORY + "/private-grammar-tip081-p2.checked.candidate.mjs",
  inventory: DIRECTORY + "/private-grammar-tip081-p2.checked.inventory.json",
  profile: DIRECTORY + "/private-grammar-tip081-p2.checked.profile.json",
});
const CANDIDATE_MAX = 8913152, INVENTORY_MAX = 16777216, PROFILE_MAX = 65536;
const BEFORE = "const __HIVE_P2_COVERAGE_RELEASED = false;";
const AFTER = "const __HIVE_P2_COVERAGE_RELEASED = true ;";
const REVIEW_PATH = "docs/verification/TIP-081A_P2_CLOSURE_SOURCE_REVIEW.md";
const CUT_PATH = "docs/verification/TIP-081A_P2_INERT_V6_CUT.json";
const codeAt = Function.prototype.call.bind(String.prototype.charCodeAt);
const slice = Function.prototype.call.bind(String.prototype.slice);
const indexOf = Function.prototype.call.bind(String.prototype.indexOf);
const stringify = JSON.stringify, parse = JSON.parse;
const encoder = new TextEncoder();
const encode = Function.prototype.call.bind(TextEncoder.prototype.encode);
const decoder = new TextDecoder("utf-8", {fatal: true});
const decode = Function.prototype.call.bind(TextDecoder.prototype.decode);

function hash(bytes) { return createHash("sha256").update(bytes).digest("hex"); }
function readFixed(pin) {
  let fd = null;
  try {
    fd = openSync(ROOT + pin.path, constants.O_RDONLY | constants.O_NOFOLLOW);
    const before = fstatSync(fd);
    if (!before.isFile() || before.size !== pin.bytes) throw new Error("CHECK_RELEASE_INPUT_SIZE_DRIFT");
    const bytes = Buffer.alloc(pin.bytes);
    let offset = 0;
    while (offset < bytes.length) {
      const remaining = bytes.length - offset;
      const amount = remaining > 32768 ? 32768 : remaining;
      const read = readSync(fd, bytes, offset, amount, offset);
      if (read === 0) throw new Error("CHECK_RELEASE_SHORT_READ");
      offset += read;
    }
    const probe = Buffer.alloc(1);
    if (readSync(fd, probe, 0, 1, bytes.length) !== 0) throw new Error("CHECK_RELEASE_INPUT_GROWTH");
    const after = fstatSync(fd);
    if (after.dev !== before.dev || after.ino !== before.ino || after.size !== before.size ||
        after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs || hash(bytes) !== pin.sha256)
      throw new Error("CHECK_RELEASE_INPUT_PIN_DRIFT");
    return decode(decoder, bytes);
  } finally { if (fd !== null) closeSync(fd); }
}
function utf8Length(value, maximum) {
  let bytes = 0;
  for (let i = 0; i < value.length; i++) {
    const code = codeAt(value, i);
    if (code < 128) bytes++;
    else if (code < 2048) bytes += 2;
    else if (code >= 55296 && code <= 56319 && i + 1 < value.length &&
        codeAt(value, i + 1) >= 56320 && codeAt(value, i + 1) <= 57343) { bytes += 4; i++; }
    else bytes += 3;
    if (bytes > maximum) throw new Error("CHECK_RELEASE_UTF8_CAP");
  }
  return bytes;
}
function quotedUnits(value, maximum) {
  let units = 2;
  for (let i = 0; i < value.length; i++) {
    const code = codeAt(value, i);
    units += code === 34 || code === 92 ? 2 : code < 32 || code >= 55296 && code <= 57343 ? 6 : 1;
    if (units > maximum) throw new Error("CHECK_RELEASE_JSON_STRING_CAP");
  }
  return units;
}
function jsonUnits(value, maximum, depth = 0) {
  if (depth > 16) throw new Error("CHECK_RELEASE_JSON_DEPTH_CAP");
  if (value === null) return 4;
  if (typeof value === "string") return quotedUnits(value, maximum);
  if (typeof value === "boolean") return 5;
  if (typeof value === "number" && Number.isFinite(value)) return 32;
  let units = 2;
  if (Array.isArray(value)) {
    if (value.length > 40000) throw new Error("CHECK_RELEASE_JSON_ARRAY_CAP");
    for (let i = 0; i < value.length; i++) {
      units += jsonUnits(value[i], maximum, depth + 1) + 1;
      if (units > maximum) throw new Error("CHECK_RELEASE_JSON_CAP");
    }
    return units;
  }
  if (typeof value !== "object" || value === undefined) throw new Error("CHECK_RELEASE_JSON_SCHEMA");
  const keys = Object.keys(value);
  if (keys.length > 32) throw new Error("CHECK_RELEASE_JSON_RECORD_CAP");
  for (let i = 0; i < keys.length; i++) {
    units += quotedUnits(keys[i], maximum) + 2 + jsonUnits(value[keys[i]], maximum, depth + 1);
    if (units > maximum) throw new Error("CHECK_RELEASE_JSON_CAP");
  }
  return units;
}
function boundedEncoding(text, maximum) {
  const expected = utf8Length(text, maximum);
  const bytes = encode(encoder, text);
  if (bytes.length !== expected) throw new Error("CHECK_RELEASE_ENCODING_DRIFT");
  return bytes;
}
function jsonEncoding(value, maximum) {
  if (jsonUnits(value, maximum) > maximum) throw new Error("CHECK_RELEASE_PRESTRINGIFY_CAP");
  return boundedEncoding(stringify(value), maximum);
}
function writeNew(path, bytes) {
  // Exact new destinations only; a failure leaves evidence and cannot be retried
  // or truncated blindly. Parent must review any partial artifact first.
  const fd = openSync(path, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
  try {
    let offset = 0;
    while (offset < bytes.length) {
      const remaining = bytes.length - offset;
      const amount = remaining > 32768 ? 32768 : remaining;
      const written = writeSync(fd, bytes, offset, amount, offset);
      if (!written) throw new Error("CHECK_RELEASE_SHORT_WRITE");
      offset += written;
    }
  } finally { closeSync(fd); }
}
function fixedOptions(sourceType) {
  return {ecmaVersion: 15, sourceType, allowReserved: false,
    allowReturnOutsideFunction: false, allowImportExportEverywhere: false,
    allowAwaitOutsideFunction: false, allowSuperOutsideMethod: false,
    allowHashBang: true, locations: false, ranges: false, program: null,
    sourceFile: null, directSourceFile: null, preserveParens: false,
    onToken: null, onComment: null, onInsertedSemicolon: null, onTrailingComma: null,
    checkPrivateFields: true};
}

export function captureCheckedPrivateGrammarP2() {
  if (arguments.length !== 0 || process.argv.length !== 2) throw new Error("CHECK_RELEASE_FIXED_ARITY");
  const directory = lstatSync(DIRECTORY);
  if (!directory.isDirectory() || directory.isSymbolicLink()) throw new Error("CHECK_RELEASE_DIRECTORY_DRIFT");
  const candidate = readFixed(INPUTS[0]), inventoryText = readFixed(INPUTS[1]);
  const inventory = parse(inventoryText); //bounded exact-hash trusted JSON, not caller input.
  if (inventory.purpose !== "TIP081_P2_OFFLINE_DERIVATION_CANDIDATE_ONLY" ||
      inventory.parserAdmission !== "ALLOCATION_COVERAGE_OPEN" ||
      inventory.candidateHash !== INPUTS[0].sha256 || inventory.installedParserImported !== false ||
      !Array.isArray(inventory.rows) || inventory.rows.length !== 7274 ||
      !Array.isArray(inventory.open) || inventory.open.length !== 0 ||
      !Array.isArray(inventory.unmatched) || inventory.unmatched.length !== 0 ||
      !Array.isArray(inventory.emittedUnknown) || inventory.emittedUnknown.length !== 0 ||
      !Array.isArray(inventory.ruleManifest) || inventory.ruleManifest.length !== 31 ||
      inventory.provenance.syntheticAdapterEnabled !== false || inventory.provenance.realParserDisabled !== true ||
      inventory.releaseReview !== undefined) throw new Error("CHECK_RELEASE_INERT_SCHEMA_DRIFT");
  // Counts are schema cross-checks, NEVER a substitute for the recorded source
  // review. The exact fixed tuple and source-reviewed new loader pin are authority.
  const start = indexOf(candidate, BEFORE, 0);
  if (BEFORE.length !== AFTER.length || start < 0 || indexOf(candidate, BEFORE, start + 1) !== -1 ||
      indexOf(candidate, AFTER, 0) !== -1) throw new Error("CHECK_RELEASE_UNIQUE_CONSTANT_DRIFT");
  const checkedCandidate = slice(candidate, 0, start) + AFTER + slice(candidate, start + BEFORE.length);
  if (checkedCandidate.length !== candidate.length) throw new Error("CHECK_RELEASE_SPAN_DRIFT");
  const candidateBytes = boundedEncoding(checkedCandidate, CANDIDATE_MAX);
  if (candidateBytes.length !== INPUTS[0].bytes) throw new Error("CHECK_RELEASE_BYTE_OFFSET_DRIFT");
  const candidateHash = hash(candidateBytes);
  inventory.candidateHash = candidateHash;
  inventory.releaseReview = {
    status: "SOURCE_REVIEWED_SYNTHETIC_CHECK_ONLY", sourceScopedCheck: true,
    realParserDisabled: true, syntheticAdapterEnabled: true, fullP2Accepted: false, checks: "UNRUN",
    sourceReviewPath: REVIEW_PATH, sourceCutPath: CUT_PATH,
    inertCandidateSha256: INPUTS[0].sha256, inertInventorySha256: INPUTS[1].sha256,
    compileConstantChangedOnce: true, allSpanOffsetsPreserved: true,
    authority: "fixed loader source-issued exact tuple only; no caller flags or hashes",
  };
  // Original inert provenance, spans, cost rows, UNRUN controls and history remain
  // untouched. This releaseReview authorizes scoped checks, NOT full P2 closure.
  const profile = {
    purpose: "TIP081_P2_SOURCE_REVIEWED_SYNTHETIC_CHECK_PROFILE",
    profileId: "P2_ECMA15_SCRIPT_MODULE_PRIVATE_FIXED19",
    sourceScopedCheck: true, realParserDisabled: true, syntheticAdapterEnabled: true,
    fullP2Accepted: false, checks: "UNRUN", controlCount: 109,
    sourceReviewPath: REVIEW_PATH, sourceCutPath: CUT_PATH,
    optionsByProfile: {SCRIPT: fixedOptions("script"), MODULE: fixedOptions("module")},
    caps: {totalLogicalBytes: 67108864, attemptedNodes: 200000, conservativeInternalEntries: 20000,
      structuralDepth: 128, privateCallDepth: 128, maximumTTLMilliseconds: 120000,
      numericSpellingUTF16Units: 1024, retainedSourceHeader: 32, syntheticSourceUTF16Multiplier: 4},
    originalPins: {sourceBytes: 121634, sourceSha256: "3c141146168735659c30b29c925fbf9fdf4d12ad85eb83d68e2afb26a1cc248d",
      packageBytes: 51, packageSha256: "aa6eff9593179bc7379017992eda314ce97bd7c6576869d82d514139ce612cca"},
    reviewedSourceCut: {generatorBytes: 85462, generatorSha256: "fd5c46b72a919d35f9d55282164989dae5cd4169f165740d885dd94dde5f272b",
      runtimeBytes: 58100, runtimeSha256: "84802f210e63cbb2ea9d1f069056abb9e785490bed03280b836514cf3f0e2531",
      scalarBytes: 14174, scalarSha256: "f3b22a9e9e44c084fd74bea0918baba0c6d2453dc87166b8c888a7d6eef3ad41"},
    unsupportedBeforeNative: ["target RegExp literals", "target BigInt literals", "Unicode identifiers"],
    trustLimits: "logical cost/depth/ownership model; native/VM/RSS limits unknown; no deep AST equivalence or mathematical result claimed",
    authority: "only independently reviewed fixed loader source pins; profile flags cannot issue admission",
  };
  const inventoryBytes = jsonEncoding(inventory, INVENTORY_MAX);
  const profileBytes = jsonEncoding(profile, PROFILE_MAX);
  // All three bounded payloads are finalized BEFORE opening any new destination.
  writeNew(OUTPUTS.candidate, candidateBytes);
  writeNew(OUTPUTS.inventory, inventoryBytes);
  writeNew(OUTPUTS.profile, profileBytes);
  const summary = stringify({purpose: "TIP081_P2_SYNTHETIC_CHECK_RELEASE_CAPTURE", importedCandidate: false,
    fullP2Accepted: false, checks: "UNRUN", candidateBytes: candidateBytes.length, candidateSha256: candidateHash,
    inventoryBytes: inventoryBytes.length, inventorySha256: hash(inventoryBytes),
    profileBytes: profileBytes.length, profileSha256: hash(profileBytes), allSpanOffsetsPreserved: true});
  if (summary.length > 4096) throw new Error("CHECK_RELEASE_SUMMARY_CAP");
  return summary;
}

if (process.argv.length === 2 && process.argv[1] === ROOT + "scripts/test/release-private-grammar-tip081-p2.mjs") {
  process.stdout.write(captureCheckedPrivateGrammarP2() + "\n");
}
