// Trusted, separately versioned P3 synthetic admission. Main issues both fixed
// tuples ONLY after complete emitted source review. No caller path/URL/hash/flag.
import {openSync, fstatSync, readSync, closeSync, constants} from "node:fs";
import {createHash} from "node:crypto";

const NORMAL = Object.freeze({
  status: "NOT_ISSUED", domain: "TIP081_P3_SYNTHETIC_ONLY",
  candidate: Object.freeze({path: "/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.candidate.mjs", bytes: 0, sha256: "NOT_ISSUED"}),
  inventory: Object.freeze({path: "/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.inventory.json", bytes: 0, sha256: "NOT_ISSUED"}),
  profile: Object.freeze({path: "/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.profile.json", bytes: 0, sha256: "NOT_ISSUED"}),
});
const ALIAS_FAULT = Object.freeze({
  status: "NOT_ISSUED", domain: "TIP081_P3_ALIAS_FAULT_TEST_ONLY",
  candidate: Object.freeze({path: "/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.alias-fault.candidate.mjs", bytes: 0, sha256: "NOT_ISSUED"}),
  inventory: Object.freeze({path: "/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.alias-fault.inventory.json", bytes: 0, sha256: "NOT_ISSUED"}),
  profile: Object.freeze({path: "/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.alias-fault.profile.json", bytes: 0, sha256: "NOT_ISSUED"}),
});
const FAILURE = Object.freeze({code: "ALLOCATION_COVERAGE_OPEN", realParserDisabled: true});
const ARTIFACT_LIMIT = 2228288, INVENTORY_LIMIT = 16777216, PROFILE_LIMIT = 65536;
const charCode = Function.prototype.call.bind(String.prototype.charCodeAt);
const encode = Function.prototype.call.bind(TextEncoder.prototype.encode), encoder = new TextEncoder();
const decode = Function.prototype.call.bind(TextDecoder.prototype.decode), decoder = new TextDecoder("utf-8", {fatal: true});
const hashNative = createHash, hashUpdate = Function.prototype.call.bind(Object.getPrototypeOf(createHash("sha256")).update);
const hashDigest = Function.prototype.call.bind(Object.getPrototypeOf(createHash("sha256")).digest);
const safe = Number.isSafeInteger, freeze = Object.freeze, bufferFrom = Buffer.from;
const base64 = Function.prototype.call.bind(Buffer.prototype.toString);
let normalModule = null, aliasFaultModule = null;

function hash(bytes) { const state = hashNative("sha256"); hashUpdate(state, bytes); return hashDigest(state, "hex"); }
function issued(tuple, domain) {
  return tuple.status === "SOURCE_REVIEWED_SYNTHETIC_ONLY" && tuple.domain === domain &&
    tuple.candidate.bytes > 0 && tuple.inventory.bytes > 0 && tuple.profile.bytes > 0 &&
    tuple.candidate.sha256 !== "NOT_ISSUED" && tuple.inventory.sha256 !== "NOT_ISSUED" && tuple.profile.sha256 !== "NOT_ISSUED";
}
function utf8Size(text, maximum) {
  let n = 0;
  for (let i = 0; i < text.length; i++) {
    const c = charCode(text, i);
    if (c < 128) n++;
    else if (c < 2048) n += 2;
    else if (c >= 55296 && c <= 56319 && i + 1 < text.length && charCode(text, i + 1) >= 56320 && charCode(text, i + 1) <= 57343) { n += 4; i++; }
    else n += 3;
    if (n > maximum) return -1;
  }
  return n;
}
function exactText(text, pin, maximum) {
  if (typeof text !== "string" || !safe(pin.bytes) || pin.bytes < 1 || pin.bytes > maximum || text.length > pin.bytes ||
      utf8Size(text, pin.bytes) !== pin.bytes) return false;
  const bytes = encode(encoder, text);
  return bytes.length === pin.bytes && hash(bytes) === pin.sha256;
}
function exactTuple(candidate, inventory, profile, tuple) {
  return exactText(candidate, tuple.candidate, ARTIFACT_LIMIT) && exactText(inventory, tuple.inventory, INVENTORY_LIMIT) &&
    exactText(profile, tuple.profile, PROFILE_LIMIT);
}
export function verifySyntheticSummaryArtifactP3(candidate, inventory, profile) {
  if (arguments.length !== 3 || !issued(NORMAL, "TIP081_P3_SYNTHETIC_ONLY")) return false;
  try { return exactTuple(candidate, inventory, profile, NORMAL); } catch { return false; }
}
function readFixed(pin, maximum) {
  let fd = null;
  try {
    if (!safe(pin.bytes) || pin.bytes < 1 || pin.bytes > maximum) throw FAILURE;
    fd = openSync(pin.path, constants.O_RDONLY | constants.O_NOFOLLOW);
    const before = fstatSync(fd);
    if (!before.isFile() || before.size !== pin.bytes) throw FAILURE;
    const bytes = Buffer.alloc(pin.bytes); let offset = 0;
    while (offset < bytes.length) {
      const n = readSync(fd, bytes, offset, Math.min(32768, bytes.length - offset), offset);
      if (!n) throw FAILURE;
      offset += n;
    }
    if (readSync(fd, Buffer.alloc(1), 0, 1, bytes.length)) throw FAILURE;
    const after = fstatSync(fd);
    if (after.dev !== before.dev || after.ino !== before.ino || after.size !== before.size ||
        after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs || hash(bytes) !== pin.sha256) throw FAILURE;
    return decode(decoder, bytes);
  } catch { throw FAILURE; }
  finally { if (fd !== null) { try { closeSync(fd); } catch { throw FAILURE; } } }
}
async function fixedLoad(tuple) {
  const candidate = readFixed(tuple.candidate, ARTIFACT_LIMIT), inventory = readFixed(tuple.inventory, INVENTORY_LIMIT),
    profile = readFixed(tuple.profile, PROFILE_LIMIT);
  if (!exactTuple(candidate, inventory, profile, tuple)) throw FAILURE;
  const prior = tuple === NORMAL ? normalModule : aliasFaultModule;
  if (prior !== null) return prior;
  const rounded = tuple.candidate.bytes + 2, units = 4 * (rounded - rounded % 3) / 3;
  if (!safe(units) || units > 2971052) throw FAILURE;
  const encoded = base64(bufferFrom(candidate, "utf8"), "base64");
  if (encoded.length !== units) throw FAILURE;
  let admitted;
  try { admitted = await import("data:text/javascript;base64," + encoded); } catch { throw FAILURE; }
  const names = ["createSyntheticSummaryP3", "analyzeSyntheticSummaryP3", "retireProducerSummaryP3",
    "verifySyntheticSummaryP3", "observeSyntheticSummaryP3", "retireSyntheticSummaryP3"];
  const arities = [4, 1, 1, 2, 1, 1];
  if (Object.keys(admitted).length !== names.length) throw FAILURE;
  for (let i = 0; i < names.length; i++) if (typeof admitted[names[i]] !== "function" || admitted[names[i]].length !== arities[i]) throw FAILURE;
  const api = freeze({createSyntheticSummaryP3: admitted.createSyntheticSummaryP3,
    analyzeSyntheticSummaryP3: admitted.analyzeSyntheticSummaryP3,
    retireProducerSummaryP3: admitted.retireProducerSummaryP3, verifySyntheticSummaryP3: admitted.verifySyntheticSummaryP3,
    observeSyntheticSummaryP3: admitted.observeSyntheticSummaryP3, retireSyntheticSummaryP3: admitted.retireSyntheticSummaryP3});
  if (tuple === NORMAL) normalModule = api; else aliasFaultModule = api;
  return api;
}
export async function loadAdmittedSyntheticSummaryP3() {
  if (arguments.length !== 0 || !issued(NORMAL, "TIP081_P3_SYNTHETIC_ONLY")) throw FAILURE;
  try { return await fixedLoad(NORMAL); } catch { throw FAILURE; }
}
// Dedicated fixed negative-control domain; no caller fault option or selectable
// path. Its only source mutation retains producerRoot; ALIAS denial precedes replay.
export async function loadAliasFaultSyntheticSummaryP3() {
  if (arguments.length !== 0 || !issued(ALIAS_FAULT, "TIP081_P3_ALIAS_FAULT_TEST_ONLY")) throw FAILURE;
  try { return await fixedLoad(ALIAS_FAULT); } catch { throw FAILURE; }
}
