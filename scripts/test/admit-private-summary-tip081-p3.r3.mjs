// TIP-081A R3 trusted TEST-TOOL admission. No caller-selected artifact or authority.
// Source-only release: all pins/context remain NOT_ISSUED until Main's A review.
import {openSync, fstatSync, readSync, closeSync, constants, Stats} from 'node:fs';
import {Buffer} from 'node:buffer';
import {createHash, Hash} from 'node:crypto';
import {TextDecoder} from 'node:util';

/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').ArtifactTuple} ArtifactTuple */
/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').Pin} Pin */
/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').SyntheticAPI} SyntheticAPI */
/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').KernelAPI} KernelAPI */
/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').ReviewedContext} ReviewedContext */

const cOpen = openSync;
const cStat = fstatSync;
const cRead = readSync;
const cClose = closeSync;
const cFlags = constants.O_RDONLY | constants.O_NOFOLLOW;
/** @type {(stat: Stats) => boolean} */
const cIsFile = Function.call.bind(Stats.prototype.isFile);
const cAlloc = Buffer.alloc.bind(Buffer);
const cFrom = Buffer.from.bind(Buffer);
/** @type {(bytes: Buffer, encoding: BufferEncoding) => string} */
const cBase64 = Function.call.bind(Buffer.prototype.toString);
const cHash = createHash;
/** @type {(state: Hash, value: string | Buffer, encoding?: import('node:crypto').Encoding) => Hash} */
const cHashUpdate = Function.call.bind(Hash.prototype.update);
/** @type {(state: Hash, encoding: import('node:crypto').BinaryToTextEncoding) => string} */
const cHashDigest = Function.call.bind(Hash.prototype.digest);
const cDecoder = TextDecoder;
/** @type {(decoder: TextDecoder, bytes: Uint8Array) => string} */
const cDecode = Function.call.bind(TextDecoder.prototype.decode);
/** @type {(text: string, index: number) => number} */
const cChar = Function.call.bind(String.prototype.charCodeAt);
const cSafe = Number.isSafeInteger;
const cIs = Object.is;
const cFreeze = Object.freeze;
const cSetProto = Object.setPrototypeOf;
const cKeys = Object.keys;

const decoder = new cDecoder('utf-8', {__proto__: null, fatal: true, ignoreBOM: true});
const FAILURE = cFreeze({__proto__: null, code: 'ALLOCATION_COVERAGE_OPEN', realParserDisabled: true});
const ARTIFACT_LIMIT = 2228288;
const INVENTORY_LIMIT = 16777216;
const PROFILE_LIMIT = 65536;

/** @type {Readonly<ArtifactTuple>} */
const NORMAL = cFreeze({
  __proto__: null, status: 'NOT_ISSUED', domain: 'TIP081_P3_SYNTHETIC_ONLY',
  candidate: cFreeze({__proto__: null,
    path: '/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.r3.candidate.mjs',
    bytes: 0, sha256: 'NOT_ISSUED'}),
  inventory: cFreeze({__proto__: null,
    path: '/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.r3.inventory.json',
    bytes: 0, sha256: 'NOT_ISSUED'}),
  profile: cFreeze({__proto__: null,
    path: '/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.r3.profile.json',
    bytes: 0, sha256: 'NOT_ISSUED'}),
});
/** @type {Readonly<ArtifactTuple>} */
const ALIAS = cFreeze({
  __proto__: null, status: 'NOT_ISSUED', domain: 'TIP081_P3_ALIAS_FAULT_TEST_ONLY',
  candidate: cFreeze({__proto__: null,
    path: '/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.r3.alias-fault.candidate.mjs',
    bytes: 0, sha256: 'NOT_ISSUED'}),
  inventory: cFreeze({__proto__: null,
    path: '/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.r3.alias-fault.inventory.json',
    bytes: 0, sha256: 'NOT_ISSUED'}),
  profile: cFreeze({__proto__: null,
    path: '/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.r3.alias-fault.profile.json',
    bytes: 0, sha256: 'NOT_ISSUED'}),
});
/** @type {Readonly<ArtifactTuple>} */
const KERNEL = cFreeze({
  __proto__: null, status: 'NOT_ISSUED', domain: 'TIP081_P3_BOUNDARY_KERNEL_UNIT_ONLY',
  candidate: cFreeze({__proto__: null,
    path: '/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.r3.boundary-kernel.candidate.mjs',
    bytes: 0, sha256: 'NOT_ISSUED'}),
  inventory: cFreeze({__proto__: null,
    path: '/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.r3.boundary-kernel.inventory.json',
    bytes: 0, sha256: 'NOT_ISSUED'}),
  profile: cFreeze({__proto__: null,
    path: '/Users/os/hiveos/scripts/test/generated/private-summary-tip081-p3.r3.boundary-kernel.profile.json',
    bytes: 0, sha256: 'NOT_ISSUED'}),
});

// Main alone replaces this null with the complete reviewed frozen literal graph,
// coupled to all three exact tuple pins. No runtime/model/metadata census source.
/** @type {ReviewedContext | null} */
const ISSUED_CONTEXT = null;

const API_NAMES = cFreeze(cSetProto(['createSyntheticSummaryP3', 'analyzeSyntheticSummaryP3',
  'retireProducerSummaryP3', 'verifySyntheticSummaryP3', 'observeSyntheticSummaryP3',
  'retireSyntheticSummaryP3'], null));
const API_ARITIES = cFreeze(cSetProto([4, 1, 1, 2, 1, 1], null));
const KERNEL_NAMES = cFreeze(cSetProto(['runFixedBoundaryCasesP3'], null));
const KERNEL_ARITIES = cFreeze(cSetProto([0], null));
const ROOT_KEYS = cFreeze(cSetProto(['version', 'purpose', 'scope', 'status', 'normal',
  'alias', 'kernel', 'fixtureProof', 'counterProof', 'composition', 'tuples'], null));
const DOMAIN_KEYS = cFreeze(cSetProto(['toolBytes', 'sourceCensusHash'], null));
const TUPLE_KEYS = cFreeze(cSetProto(['normal', 'alias', 'kernel'], null));
const PIN_KEYS = cFreeze(cSetProto(['candidateBytes', 'candidateHash', 'inventoryBytes',
  'inventoryHash', 'profileBytes', 'profileHash'], null));
const FIXTURE_KEYS = cFreeze(cSetProto(['fixtureId', 'sourceUnits', 'Qp', 'Pp',
  'nodeSchema', 'arrayBacking', 'derivedString', 'callFrame', 'bookkeeping',
  'privateCallDepth', 'maxToolBytes', 'proofHash'], null));
const COUNTER_KEYS = cFreeze(cSetProto(['fixtureId', 'producerGrammarEntries',
  'replayGrammarEntries', 'producerConstant', 'finalConstant', 'proofHash'], null));
const COMPOSITION_KEYS = cFreeze(cSetProto(['caseId', 'handSourceHash', 'emittedSourceHash', 'status'], null));

/** @type {Readonly<SyntheticAPI> | null} */
let normalModule = null;
/** @type {Readonly<SyntheticAPI> | null} */
let aliasModule = null;
/** @type {Readonly<KernelAPI> | null} */
let kernelModule = null;

/** @param {unknown} value @returns {value is number} */
function integer(value) {
  return typeof value === 'number' && cSafe(value) && value >= 0 && !cIs(value, -0);
}

/** @param {unknown} value @returns {value is string} */
function hex(value) {
  if (typeof value !== 'string' || value.length !== 64) return false;
  let index;
  for (index = 0; index < 64; index += 1) {
    if (!((cChar(value, index) >= 48 && cChar(value, index) <= 57) ||
      (cChar(value, index) >= 97 && cChar(value, index) <= 102))) return false;
  }
  return true;
}

/** @param {Readonly<ArtifactTuple>} tuple @param {ArtifactTuple['domain']} domain @returns {boolean} */
function gate(tuple, domain) {
  // Fast literal hold: no context traversal, FS, hash or target import.
  if (ISSUED_CONTEXT === null || tuple.status !== 'SOURCE_REVIEWED_SYNTHETIC_ONLY') return false;
  if ((tuple !== NORMAL && tuple !== ALIAS && tuple !== KERNEL) || tuple.domain !== domain ||
    (tuple === NORMAL && domain !== 'TIP081_P3_SYNTHETIC_ONLY') ||
    (tuple === ALIAS && domain !== 'TIP081_P3_ALIAS_FAULT_TEST_ONLY') ||
    (tuple === KERNEL && domain !== 'TIP081_P3_BOUNDARY_KERNEL_UNIT_ONLY')) return false;
  let domainRecord = /** @type {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').DomainCensus | ReviewedContext['composition'] | null} */ (null), pins = /** @type {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').TuplePins | null} */ (null), index, keys = /** @type {string[] | null} */ (null), field, proof = /** @type {ArtifactTuple | ReviewedContext['fixtureProof'] | ReviewedContext['counterProof'] | import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').CompositionReceipt | null} */ (null);
  try {
    keys = cSetProto(cKeys(ISSUED_CONTEXT), null);
    if (keys.length !== 11) return false;
    for (index = 0; index < 11; index += 1) if (keys[index] !== ROOT_KEYS[index]) return false;
    if (ISSUED_CONTEXT.version !== 1 || !integer(ISSUED_CONTEXT.version) ||
      ISSUED_CONTEXT.purpose !== 'TIP081_P3_R3_REVIEWED_TOOL_CONTEXT' ||
      ISSUED_CONTEXT.scope !== 'TOOL_DATA_ONLY' ||
      ISSUED_CONTEXT.status !== 'REVIEWED_CONTEXT_BOUND') return false;
    keys = cSetProto(cKeys(ISSUED_CONTEXT.tuples), null);
    if (keys.length !== 3) return false;
    for (index = 0; index < 3; index += 1) if (keys[index] !== TUPLE_KEYS[index]) return false;
    for (index = 0; index < 3; index += 1) {
      domainRecord = index === 0 ? ISSUED_CONTEXT.normal : index === 1 ? ISSUED_CONTEXT.alias : ISSUED_CONTEXT.kernel;
      pins = index === 0 ? ISSUED_CONTEXT.tuples.normal : index === 1 ? ISSUED_CONTEXT.tuples.alias : ISSUED_CONTEXT.tuples.kernel;
      proof = index === 0 ? NORMAL : index === 1 ? ALIAS : KERNEL;
      if (proof.status !== 'SOURCE_REVIEWED_SYNTHETIC_ONLY' ||
        proof.domain !== (index === 0 ? 'TIP081_P3_SYNTHETIC_ONLY' : index === 1 ?
          'TIP081_P3_ALIAS_FAULT_TEST_ONLY' : 'TIP081_P3_BOUNDARY_KERNEL_UNIT_ONLY')) return false;
      keys = cSetProto(cKeys(domainRecord), null);
      if (keys.length !== 2 || keys[0] !== DOMAIN_KEYS[0] || keys[1] !== DOMAIN_KEYS[1] ||
        !integer(domainRecord.toolBytes) || domainRecord.toolBytes > (index === 2 ? 66797576 : 33262238) ||
        !hex(domainRecord.sourceCensusHash)) return false;
      keys = cSetProto(cKeys(pins), null);
      if (keys.length !== 6) return false;
      for (field = 0; field < 6; field += 1) if (keys[field] !== PIN_KEYS[field]) return false;
      if (!integer(pins.candidateBytes) || pins.candidateBytes < 1 || pins.candidateBytes > ARTIFACT_LIMIT ||
        !integer(pins.inventoryBytes) || pins.inventoryBytes < 1 || pins.inventoryBytes > INVENTORY_LIMIT ||
        !integer(pins.profileBytes) || pins.profileBytes < 1 || pins.profileBytes > PROFILE_LIMIT ||
        !hex(pins.candidateHash) || !hex(pins.inventoryHash) || !hex(pins.profileHash) ||
        pins.candidateBytes !== proof.candidate.bytes || pins.candidateHash !== proof.candidate.sha256 ||
        pins.inventoryBytes !== proof.inventory.bytes || pins.inventoryHash !== proof.inventory.sha256 ||
        pins.profileBytes !== proof.profile.bytes || pins.profileHash !== proof.profile.sha256 ||
        domainRecord.sourceCensusHash !== pins.inventoryHash) return false;
    }
    proof = ISSUED_CONTEXT.fixtureProof;
    keys = cSetProto(cKeys(proof), null);
    if (keys.length !== 12) return false;
    for (index = 0; index < 12; index += 1) if (keys[index] !== FIXTURE_KEYS[index]) return false;
    if (proof.fixtureId !== 'P321.A_NORMAL' || proof.sourceUnits !== 21 ||
      proof.Qp !== 1387262 || proof.Pp !== 2165 || proof.nodeSchema !== 27680 ||
      proof.arrayBacking !== 75344 || proof.derivedString !== 185070 ||
      proof.callFrame !== 172592 || proof.bookkeeping !== 926576 ||
      proof.privateCallDepth !== 25 || proof.maxToolBytes !== 33262238 || !hex(proof.proofHash)) return false;
    proof = ISSUED_CONTEXT.counterProof;
    keys = cSetProto(cKeys(proof), null);
    if (keys.length !== 6) return false;
    for (index = 0; index < 6; index += 1) if (keys[index] !== COUNTER_KEYS[index]) return false;
    if (proof.fixtureId !== 'P322.A_MONOTONE' || proof.producerGrammarEntries !== 715 ||
      proof.replayGrammarEntries !== 715 || proof.producerConstant !== 525 ||
      proof.finalConstant !== 1091 || !hex(proof.proofHash)) return false;
    domainRecord = ISSUED_CONTEXT.composition;
    keys = cSetProto(cKeys(domainRecord), null);
    if (domainRecord.length !== 4 || keys.length !== 4 || keys[0] !== '0' ||
      keys[1] !== '1' || keys[2] !== '2' || keys[3] !== '3') return false;
    for (index = 0; index < 4; index += 1) {
      proof = domainRecord[index];
      keys = cSetProto(cKeys(proof), null);
      if (keys.length !== 4) return false;
      for (field = 0; field < 4; field += 1) if (keys[field] !== COMPOSITION_KEYS[field]) return false;
      if (proof.caseId !== (index === 0 ? 'P319.C_SOURCE' : index === 1 ? 'P321.C_P2_LINK' :
        index === 2 ? 'P321.C_P3_CALLS' : 'P322.C_COUNTER_CALLS') ||
        proof.status !== 'SOURCE_REVIEWED' || !hex(proof.handSourceHash) || !hex(proof.emittedSourceHash)) return false;
    }
    return true;
  } finally {domainRecord = null; pins = null; keys = null; proof = null;}
}

/** @param {string} text @param {number} maximum @returns {number} */
function utf8Size(text, maximum) {
  let count = 0, index, unit, next;
  for (index = 0; index < text.length; index += 1) {
    unit = cChar(text, index);
    if (unit < 128) count += 1;
    else if (unit < 2048) count += 2;
    else if (unit >= 55296 && unit <= 56319) {
      if (index + 1 >= text.length) return -1;
      next = cChar(text, index + 1);
      if (next < 56320 || next > 57343) return -1;
      count += 4;
      index += 1;
    } else if (unit >= 56320 && unit <= 57343) return -1;
    else count += 3;
    if (count > maximum) return -1;
  }
  return count;
}

/** @param {Buffer} bytes @returns {string} */
function hash(bytes) {
  let state = /** @type {Hash | null} */ (null), result = /** @type {string | null} */ (null);
  try {
    state = cHash('sha256');
    cHashUpdate(state, bytes);
    result = cHashDigest(state, 'hex');
    state = null;
    if (!hex(result)) throw FAILURE;
    return result;
  } finally {state = null; result = null;}
}

/** @param {unknown} text @param {Readonly<Pin>} pin @param {number} maximum @returns {boolean} */
function exactText(text, pin, maximum) {
  let bytes = /** @type {Buffer | null} */ (null), size;
  try {
    if (typeof text !== 'string' || !integer(pin.bytes) || pin.bytes < 1 ||
      pin.bytes > maximum || text.length > pin.bytes || !hex(pin.sha256)) return false;
    size = utf8Size(text, pin.bytes);
    if (size !== pin.bytes) return false;
    bytes = cFrom(text, 'utf8');
    return bytes.length === pin.bytes && hash(bytes) === pin.sha256;
  } finally {bytes = null;}
}

/** @param {unknown} candidate @param {unknown} inventory @param {unknown} profile @param {Readonly<ArtifactTuple>} tuple @returns {boolean} */
function exactTuple(candidate, inventory, profile, tuple) {
  return exactText(candidate, tuple.candidate, ARTIFACT_LIMIT) &&
    exactText(inventory, tuple.inventory, INVENTORY_LIMIT) &&
    exactText(profile, tuple.profile, PROFILE_LIMIT);
}

/** @param {Readonly<Pin>} pin @param {number} maximum @returns {string} */
function readFixed(pin, maximum) {
  let fd = /** @type {number | null} */ (null), before = /** @type {Stats | null} */ (null), after = /** @type {Stats | null} */ (null), bytes = /** @type {Buffer | null} */ (null), offset = 0,
    count, calls = 0, limit, text = /** @type {string | Buffer | null} */ (null), failed = false, first;
  try {
    try {
      if ((pin !== NORMAL.candidate && pin !== NORMAL.inventory && pin !== NORMAL.profile &&
        pin !== ALIAS.candidate && pin !== ALIAS.inventory && pin !== ALIAS.profile &&
        pin !== KERNEL.candidate && pin !== KERNEL.inventory && pin !== KERNEL.profile) ||
        !integer(pin.bytes) || pin.bytes < 1 || pin.bytes > maximum || !hex(pin.sha256)) throw FAILURE;
      limit = (pin.bytes + 32767 - (pin.bytes + 32767) % 32768) / 32768 + 1;
      fd = cOpen(pin.path, cFlags);
      before = cStat(fd);
      if (!cIsFile(before) || before.size !== pin.bytes) throw FAILURE;
      bytes = cAlloc(pin.bytes);
      while (offset < pin.bytes) {
        if (calls >= limit) throw FAILURE;
        calls += 1;
        count = cRead(fd, bytes, offset, pin.bytes - offset > 32768 ? 32768 : pin.bytes - offset, offset);
        if (!integer(count) || count < 1 || count > (pin.bytes - offset > 32768 ? 32768 : pin.bytes - offset)) throw FAILURE;
        offset += count;
      }
      // Reuse text until decode: main bytes PLUS one separately priced EOF byte.
      text = cAlloc(1);
      count = cRead(fd, text, 0, 1, pin.bytes);
      if (count !== 0 || !integer(count)) throw FAILURE;
      text = null;
      after = cStat(fd);
      if (!cIsFile(after) || after.dev !== before.dev || after.ino !== before.ino ||
        after.size !== before.size || after.mtimeMs !== before.mtimeMs ||
        after.ctimeMs !== before.ctimeMs || hash(bytes) !== pin.sha256) throw FAILURE;
      text = cDecode(decoder, bytes);
      if (typeof text !== 'string' || text.length > pin.bytes) throw FAILURE;
    } catch (caught) {failed = true; first = caught;}
    finally {
      try {if (fd !== null) cClose(fd);}
      catch (closeCaught) {if (!failed) {failed = true; first = closeCaught;}}
      finally {fd = null; bytes = null; before = null; after = null;}
    }
    if (failed) throw first;
    return /** @type {string} */ (text);
  } finally {fd = null; bytes = null; before = null; after = null; text = null; first = null;}
}

/** @param {unknown} admitted @param {Readonly<ArtifactTuple>} tuple @returns {Readonly<SyntheticAPI> | Readonly<KernelAPI>} */
function moduleShape(admitted, tuple) {
  let keys = /** @type {string[] | null} */ (null), names = /** @type {readonly string[] | null} */ (null), arities = /** @type {readonly number[] | null} */ (null), index, api = /** @type {Readonly<SyntheticAPI> | Readonly<KernelAPI> | null} */ (null);
  try {
    names = tuple === KERNEL ? KERNEL_NAMES : API_NAMES;
    arities = tuple === KERNEL ? KERNEL_ARITIES : API_ARITIES;
    keys = cSetProto(cKeys(/** @type {object} */ (admitted)), null);
    if (keys.length !== names.length) throw FAILURE;
    // Module namespace keys are sorted; validate set, not API insertion order.
    for (index = 0; index < names.length; index += 1) {
      if (typeof /** @type {Record<string, unknown>} */ (admitted)[names[index]] !== 'function' || /** @type {Function} */ (/** @type {Record<string, unknown>} */ (admitted)[names[index]]).length !== arities[index]) throw FAILURE;
    }
    api = tuple === KERNEL ? cFreeze({__proto__: null,
      runFixedBoundaryCasesP3: /** @type {KernelAPI} */ (admitted).runFixedBoundaryCasesP3}) : cFreeze({__proto__: null,
      createSyntheticSummaryP3: /** @type {SyntheticAPI} */ (admitted).createSyntheticSummaryP3,
      analyzeSyntheticSummaryP3: /** @type {SyntheticAPI} */ (admitted).analyzeSyntheticSummaryP3,
      retireProducerSummaryP3: /** @type {SyntheticAPI} */ (admitted).retireProducerSummaryP3,
      verifySyntheticSummaryP3: /** @type {SyntheticAPI} */ (admitted).verifySyntheticSummaryP3,
      observeSyntheticSummaryP3: /** @type {SyntheticAPI} */ (admitted).observeSyntheticSummaryP3,
      retireSyntheticSummaryP3: /** @type {SyntheticAPI} */ (admitted).retireSyntheticSummaryP3});
    return api;
  } finally {keys = null; names = null; arities = null; api = null;}
}

/** @param {Readonly<ArtifactTuple>} tuple @returns {Promise<Readonly<SyntheticAPI> | Readonly<KernelAPI>>} */
async function fixedLoad(tuple) {
  let candidate = /** @type {string | null} */ (null), inventory = /** @type {string | null} */ (null), profile = /** @type {string | null} */ (null), prior = /** @type {Readonly<SyntheticAPI> | Readonly<KernelAPI> | null} */ (null),
    encoded = /** @type {string | Buffer | null} */ (null), uri = /** @type {string | null} */ (null), admitted = /** @type {unknown} */ (null), api = /** @type {Readonly<SyntheticAPI> | Readonly<KernelAPI> | null} */ (null), rounded, units,
    failed = false, first;
  try {
    try {
      if (tuple !== NORMAL && tuple !== ALIAS && tuple !== KERNEL) throw FAILURE;
      prior = tuple === NORMAL ? normalModule : tuple === ALIAS ? aliasModule : kernelModule;
      if (prior !== null) return prior;
      candidate = readFixed(tuple.candidate, ARTIFACT_LIMIT);
      inventory = readFixed(tuple.inventory, INVENTORY_LIMIT);
      profile = readFixed(tuple.profile, PROFILE_LIMIT);
      // All three FD hashes are checked. Do not duplicate native tuple hashes.
      rounded = tuple.candidate.bytes + 2;
      units = 4 * (rounded - rounded % 3) / 3;
      if (!integer(units) || units > 2971052 || !integer(units + 28) || units + 28 > 2971080) throw FAILURE;
      encoded = cFrom(candidate, 'utf8');
      if (encoded.length !== tuple.candidate.bytes) throw FAILURE;
      encoded = cBase64(encoded, 'base64');
      if (encoded.length !== units) throw FAILURE;
      uri = 'data:text/javascript;base64,' + encoded;
      if (uri.length !== units + 28) throw FAILURE;
      admitted = await import(uri);
      api = moduleShape(admitted, tuple);
      if (tuple === NORMAL) normalModule = /** @type {Readonly<SyntheticAPI>} */ (api);
      else if (tuple === ALIAS) aliasModule = /** @type {Readonly<SyntheticAPI>} */ (api);
      else kernelModule = /** @type {Readonly<KernelAPI>} */ (api);
      return api;
    } catch (caught) {failed = true; first = caught;}
    if (failed) throw first;
    throw FAILURE;
  } finally {
    candidate = null; inventory = null; profile = null; prior = null;
    encoded = null; uri = null; admitted = null; api = null; first = null;
  }
}

/** @returns {ReviewedContext} */
export function readReviewedContextP3R3() {
  if (arguments.length !== 0) throw FAILURE;
  try {
    if (!gate(NORMAL, 'TIP081_P3_SYNTHETIC_ONLY') ||
      !gate(ALIAS, 'TIP081_P3_ALIAS_FAULT_TEST_ONLY') ||
      !gate(KERNEL, 'TIP081_P3_BOUNDARY_KERNEL_UNIT_ONLY')) throw FAILURE;
    return /** @type {ReviewedContext} */ (ISSUED_CONTEXT);
  } catch {throw FAILURE;}
}

/** @param {unknown} candidate @param {unknown} inventory @param {unknown} profile @returns {boolean} */
export function verifySyntheticSummaryArtifactP3(candidate, inventory, profile) {
  if (arguments.length !== 3) return false;
  try {
    if (!gate(NORMAL, 'TIP081_P3_SYNTHETIC_ONLY')) return false;
    return exactTuple(candidate, inventory, profile, NORMAL);
  } catch {return false;}
}

/** @returns {Promise<Readonly<SyntheticAPI>>} */
export async function loadAdmittedSyntheticSummaryP3() {
  if (arguments.length !== 0) throw FAILURE;
  try {
    if (!gate(NORMAL, 'TIP081_P3_SYNTHETIC_ONLY')) throw FAILURE;
    return /** @type {Readonly<SyntheticAPI>} */ (await fixedLoad(NORMAL));
  } catch {throw FAILURE;}
}

/** @returns {Promise<Readonly<SyntheticAPI>>} */
export async function loadAliasFaultSyntheticSummaryP3() {
  if (arguments.length !== 0) throw FAILURE;
  try {
    if (!gate(ALIAS, 'TIP081_P3_ALIAS_FAULT_TEST_ONLY')) throw FAILURE;
    return /** @type {Readonly<SyntheticAPI>} */ (await fixedLoad(ALIAS));
  } catch {throw FAILURE;}
}

/** @returns {Promise<Readonly<KernelAPI>>} */
export async function loadBoundaryKernelP3R3() {
  if (arguments.length !== 0) throw FAILURE;
  try {
    if (!gate(KERNEL, 'TIP081_P3_BOUNDARY_KERNEL_UNIT_ONLY')) throw FAILURE;
    return /** @type {Readonly<KernelAPI>} */ (await fixedLoad(KERNEL));
  } catch {throw FAILURE;}
}
