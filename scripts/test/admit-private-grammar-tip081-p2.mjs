// Trusted synthetic-only admission boundary. This file never accepts a path,
// module URL, expected hash, options object or runtime release flag from a caller.
import {openSync, fstatSync, readSync, closeSync, constants} from "node:fs";
import {createHash} from "node:crypto";

// Issuance is an independently reviewed source change AFTER emitted coverage,
// not an Owner/Builder metadata assertion and not a caller-selectable pin.
// Main independently reviewed and freshly disk-pinned this tuple for bounded
// synthetic controls only. This is NOT full P2 acceptance or a real parser/root lane.
const TRUSTED = Object.freeze({
  status: "SOURCE_REVIEWED_SYNTHETIC_ONLY",
  candidate: Object.freeze({path: "/Users/os/hiveos/scripts/test/generated/private-grammar-tip081-p2.checked.candidate.mjs", bytes: 931985, sha256: "114334cd56f1edd181acf27e89fda40d6fca9c96e6f1a311532f346f43ae62ef"}),
  inventory: Object.freeze({path: "/Users/os/hiveos/scripts/test/generated/private-grammar-tip081-p2.checked.inventory.json", bytes: 5710072, sha256: "41cfffe1f86a1499a490345ca059a54ace1f33d75bf77f8c8093fe19db3843e9"}),
  profile: Object.freeze({path: "/Users/os/hiveos/scripts/test/generated/private-grammar-tip081-p2.checked.profile.json", bytes: 2491, sha256: "9bc54a3542094a08a3d45fbf5b66c2feb8ffde72de4ca6efedfeac57ed6f47b8"}),
});
const FAIL = Object.freeze({code: "ALLOCATION_COVERAGE_OPEN", realParserDisabled: true});
const Encoder = TextEncoder;
const Decoder = TextDecoder;
const encodeNative = Function.prototype.call.bind(TextEncoder.prototype.encode);
const decodeNative = Function.prototype.call.bind(TextDecoder.prototype.decode);
const encoder = new Encoder();
const decoder = new Decoder("utf-8", {fatal: true});
const safeInteger = Number.isSafeInteger;
const freeze = Object.freeze;
const bufferFrom = Buffer.from;
const base64 = Function.prototype.call.bind(Buffer.prototype.toString);
const codeAt = Function.prototype.call.bind(String.prototype.charCodeAt);
const candidateMaximum = 8913152; //4 bytes per at-most2228288 emitted UTF16 units.
const inventoryMaximum = 16777216;
const profileMaximum = 65536;
let admittedModule = null;

function hash(bytes) { return createHash("sha256").update(bytes).digest("hex"); }
function issued() {
  return TRUSTED.status === "SOURCE_REVIEWED_SYNTHETIC_ONLY" &&
    TRUSTED.candidate.bytes > 0 && TRUSTED.inventory.bytes > 0 && TRUSTED.profile.bytes > 0 &&
    TRUSTED.candidate.sha256 !== "NOT_ISSUED" && TRUSTED.inventory.sha256 !== "NOT_ISSUED" && TRUSTED.profile.sha256 !== "NOT_ISSUED";
}
function utf8Length(value, maximum) {
  let bytes = 0;
  for (let i = 0; i < value.length; i++) {
    const code = codeAt(value, i);
    if (code < 128) bytes++;
    else if (code < 2048) bytes += 2;
    else if (code >= 55296 && code <= 56319 && i + 1 < value.length &&
        codeAt(value, i + 1) >= 56320 && codeAt(value, i + 1) <= 57343) { bytes += 4; i++; }
    else bytes += 3; //TextEncoder's UTF8 replacement for lone surrogates too.
    if (bytes > maximum) return -1;
  }
  return bytes;
}
function admittedText(value, pin, maximum) {
  // Only primitive text enters the public negative-control verifier. No property
  // reads, iterator, coercion, Proxy, toJSON, options or user hook is consulted.
  if (typeof value !== "string" || !issued() || !safeInteger(pin.bytes) || pin.bytes > maximum ||
      value.length > pin.bytes || value.length > maximum) return false;
  if (utf8Length(value, pin.bytes) !== pin.bytes) return false;
  const bytes = encodeNative(encoder, value);
  return bytes.length === pin.bytes && hash(bytes) === pin.sha256;
}
export function verifySyntheticGrammarArtifactP2(candidateText, inventoryText, profileText) {
  if (arguments.length !== 3) return false;
  return admittedText(candidateText, TRUSTED.candidate, candidateMaximum) &&
    admittedText(inventoryText, TRUSTED.inventory, inventoryMaximum) &&
    admittedText(profileText, TRUSTED.profile, profileMaximum);
}
function readFixed(pin, maximum) {
  if (!issued() || !safeInteger(pin.bytes) || pin.bytes < 1 || pin.bytes > maximum) throw FAIL;
  let fd = null;
  try {
    fd = openSync(pin.path, constants.O_RDONLY | constants.O_NOFOLLOW);
    const before = fstatSync(fd);
    if (!before.isFile() || before.size !== pin.bytes) throw FAIL;
    const bytes = Buffer.alloc(pin.bytes);
    let offset = 0;
    while (offset < bytes.length) {
      const available = bytes.length - offset;
      const amount = available > 32768 ? 32768 : available;
      const read = readSync(fd, bytes, offset, amount, offset);
      if (read === 0) throw FAIL;
      offset += read;
    }
    const probe = Buffer.alloc(1);
    if (readSync(fd, probe, 0, 1, bytes.length) !== 0) throw FAIL;
    const after = fstatSync(fd);
    if (after.dev !== before.dev || after.ino !== before.ino || after.size !== before.size ||
        after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs || hash(bytes) !== pin.sha256) throw FAIL;
    return decodeNative(decoder, bytes);
  } catch { throw FAIL; }
  finally {
    if (fd !== null) {
      try { closeSync(fd); } catch { throw FAIL; }
    }
  }
}
export async function loadAdmittedSyntheticGrammarP2() {
  if (arguments.length !== 0 || !issued()) throw FAIL;
  // Recheck the ENTIRE tuple on every load, even after Node has cached a module.
  // The verifier never imports caller-supplied text or a guard-removed candidate.
  const candidate = readFixed(TRUSTED.candidate, candidateMaximum);
  const inventory = readFixed(TRUSTED.inventory, inventoryMaximum);
  const profile = readFixed(TRUSTED.profile, profileMaximum);
  if (!verifySyntheticGrammarArtifactP2(candidate, inventory, profile)) throw FAIL;
  if (admittedModule === null) {
    // Import only the just-verified fixed-FD bytes, not a second pathname read.
    // No caller-selected candidate enters this code path. Base64/data-URL/Node
    // compilation allocations are bounded by the fixed file cap and remain
    // honest native/VM costs outside the parser's logical producer ledger.
    const rounded = TRUSTED.candidate.bytes + 2;
    const encodedUnits = 4 * (rounded - rounded % 3) / 3;
    if (!safeInteger(encodedUnits) || encodedUnits > 11884204) throw FAIL;
    const encoded = base64(bufferFrom(candidate, "utf-8"), "base64");
    if (encoded.length !== encodedUnits) throw FAIL;
    let admitted;
    try { admitted = await import("data:text/javascript;base64," + encoded); }
    catch { throw FAIL; }
    if (typeof admitted.createSyntheticGrammarFixtureP2 !== "function" ||
        typeof admitted.analyzeSyntheticGrammarFixtureP2 !== "function" ||
        typeof admitted.observeSyntheticGrammarFixtureP2 !== "function" ||
        typeof admitted.retireSyntheticGrammarFixtureP2 !== "function") throw FAIL;
    admittedModule = freeze({
      createSyntheticGrammarFixtureP2: admitted.createSyntheticGrammarFixtureP2,
      analyzeSyntheticGrammarFixtureP2: admitted.analyzeSyntheticGrammarFixtureP2,
      observeSyntheticGrammarFixtureP2: admitted.observeSyntheticGrammarFixtureP2,
      retireSyntheticGrammarFixtureP2: admitted.retireSyntheticGrammarFixtureP2,
    });
  }
  return admittedModule;
}
