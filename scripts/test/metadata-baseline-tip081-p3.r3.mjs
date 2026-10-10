// TIP-081A R3 TEST-TOOL only. No product API, runner, admission or authority.
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';

/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').Metadata} Metadata */
/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').BaselineContext} BaselineContext */
/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').MetadataBaseline} MetadataBaseline */
/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').BaselineWitness} BaselineWitness */
/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').BaselineReconciliation} BaselineReconciliation */
/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').MetadataKey} MetadataKey */

/** @type {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').AssertCondition} */
const toolAssert = assert.ok.bind(assert);
/** @type {(text: string) => unknown} */
const parseJson = JSON.parse;
const stringifyJson = JSON.stringify;
const ownKeys = Object.keys;
const freeze = Object.freeze;
const nullPrototype = Object.setPrototypeOf;
const sameNumber = Object.is;
const safeInteger = Number.isSafeInteger;
const isArray = Array.isArray;
/** @type {(text: string, index: number) => number} */
const charCode = Function.call.bind(String.prototype.charCodeAt);
const utf8Bytes = Buffer.byteLength.bind(Buffer);
const MapType = WeakMap;
const SetType = WeakSet;
/** @type {(map: WeakMap<object, BaselineContext>, key: object) => BaselineContext | undefined} */
const mapGet = Function.call.bind(WeakMap.prototype.get);
/** @type {(map: WeakMap<object, BaselineContext>, key: object, value: BaselineContext) => WeakMap<object, BaselineContext>} */
const mapSet = Function.call.bind(WeakMap.prototype.set);
/** @type {(map: WeakMap<object, BaselineContext>, key: object) => boolean} */
const mapDelete = Function.call.bind(WeakMap.prototype.delete);
/** @type {(set: WeakSet<object>, key: object) => boolean} */
const setHas = Function.call.bind(WeakSet.prototype.has);
/** @type {(set: WeakSet<object>, key: object) => WeakSet<object>} */
const setAdd = Function.call.bind(WeakSet.prototype.add);

const CAP = 67108864;
const TTL = 120000;
const TEXT_LIMIT = 4096;
const STARTUP = 32228560;
const SOURCE_FIXED = 1536;
const WITNESS_PROVENANCE = 'COMMON_MODE_INITIAL_OBSERVATION_NOT_INDEPENDENT_T';
const RECONCILIATION_PROVENANCE = 'SOURCE_CENSUS_COMPARISON_NOT_AUTHORITY';
/** @type {readonly MetadataKey[]} */
const KEYS = freeze(nullPrototype([
  'version', 'purpose', 'mode', 'phase', 'totalBytes', 'peakBytes',
  'producerParseBytes', 'producerWorkBytes', 'summaryBytes',
  'replayReservedBytes', 'replayLiveBytes', 'scratchBytes',
  'unreclaimedProducerBytes', 'unreclaimedReplayBytes', 'attemptedNodes',
  'internalEntries', 'siteCount', 'grammarPasses', 'metadataEmissions',
  'semanticCoverage', 'allocatorCoverage', 'graphStatus', 'predecessorOpen',
  'fullRuntimeClosure', 'execution', 'materialization', 'realParserDisabled',
], null));

/** @param {unknown} value @returns {value is number} */
function integer(value) {
  return typeof value === 'number' && safeInteger(value) && value >= 0 && !sameNumber(value, -0);
}

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function opaque(value) {
  return typeof value === 'object' && value !== null;
}

/** @param {unknown} value @returns {number} */
function phaseIndex(value) {
  if (value === 'SOURCE_READY') return 0;
  if (value === 'PRODUCER_SUMMARY') return 1;
  if (value === 'PRODUCER_AST_RETIRED') return 2;
  if (value === 'VERIFIED') return 3;
  toolAssert(false, 'metadata phase is outside the fixed schema');
  return -1;
}

/** @param {unknown} text @param {BaselineContext} context @returns {Readonly<Metadata>} */
function decodeMetadata(text, context) {
  toolAssert(typeof text === 'string', 'metadata text must be a primitive string');
  toolAssert(text.length > 0 && text.length <= TEXT_LIMIT, 'metadata text length is outside the fixed bound');
  let index;
  for (index = 0; index < text.length; index += 1) {
    toolAssert(charCode(text, index) <= 127, 'metadata text must be ASCII');
  }
  toolAssert(utf8Bytes(text, 'utf8') <= TEXT_LIMIT, 'metadata UTF8 length is outside the fixed bound');
  const decoded = parseJson(text);
  toolAssert(opaque(decoded) && !isArray(decoded), 'metadata root must be a JSON record');
  const keys = nullPrototype(ownKeys(decoded), null);
  toolAssert(keys.length === 27, 'metadata own-key count must be exactly 27');
  let value;
  for (index = 0; index < 27; index += 1) {
    toolAssert(keys[index] === KEYS[index], 'metadata own-key order differs from the fixed schema');
    value = decoded[keys[index]];
    toolAssert(typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean',
      'metadata values must be supported JSON scalars');
    if (index === 0 || (index >= 4 && index <= 18) || index === 22) {
      toolAssert(integer(value), 'metadata numeric field must be a canonical nonnegative safe integer');
    }
    if (index >= 4 && index <= 13) {
      toolAssert(/** @type {number} */ (value) <= context.cap, 'metadata byte field exceeds the registered cap');
    }
  }
  toolAssert(decoded.version === 1, 'metadata version differs from the fixed schema');
  toolAssert(decoded.purpose === 'TIP081_P3_SYNTHETIC_METADATA', 'metadata purpose differs from the fixed schema');
  toolAssert(decoded.mode === context.mode, 'metadata mode differs from the registered mode');
  toolAssert(decoded.phase === 'SOURCE_READY' || decoded.phase === 'PRODUCER_SUMMARY' ||
    decoded.phase === 'PRODUCER_AST_RETIRED' || decoded.phase === 'VERIFIED',
  'metadata phase is outside the fixed schema');
  toolAssert(/** @type {number} */ (decoded.attemptedNodes) <= 200000, 'metadata attempted-node count exceeds the fixed bound');
  toolAssert(/** @type {number} */ (decoded.internalEntries) <= 20000, 'metadata entry count exceeds the fixed bound');
  toolAssert(/** @type {number} */ (decoded.siteCount) <= 512, 'metadata site count exceeds the fixed bound');
  toolAssert(/** @type {number} */ (decoded.grammarPasses) <= 2, 'metadata grammar-pass count exceeds the fixed bound');
  toolAssert(/** @type {number} */ (decoded.metadataEmissions) >= 1 && /** @type {number} */ (decoded.metadataEmissions) <= 32,
    'metadata emission count is outside the fixed bound');
  toolAssert(decoded.semanticCoverage === 'OPEN_COMMON_GRAMMAR_RISK', 'metadata semantic label differs from the fixed schema');
  toolAssert(decoded.allocatorCoverage === 'COMMON_MODE', 'metadata allocator label differs from the fixed schema');
  toolAssert(decoded.graphStatus === 'OPEN', 'metadata graph label differs from the fixed schema');
  toolAssert(decoded.predecessorOpen === 62, 'metadata predecessor count differs from the fixed schema');
  toolAssert(decoded.fullRuntimeClosure === 'NOT_ACCEPTED', 'metadata closure label differs from the fixed schema');
  toolAssert(decoded.execution === false && decoded.materialization === false && decoded.realParserDisabled === true,
    'metadata execution flags differ from the fixed schema');
  // Every value is scalar. Remove inherited toJSON/getters BEFORE stringify.
  nullPrototype(decoded, null);
  toolAssert(stringifyJson(decoded) === text, 'metadata text must be exactly canonical JSON');
  return freeze(/** @type {Metadata} */ (/** @type {unknown} */ (decoded)));
}

/** @param {Readonly<Metadata>} record @param {number} initialBase @param {number} cap @returns {number} */
function categoryTotal(record, initialBase, cap) {
  let total = initialBase;
  let index;
  let value;
  for (index = 6; index <= 13; index += 1) {
    value = /** @type {number} */ (record[KEYS[index]]);
    toolAssert(value <= cap - total, 'metadata category addition exceeds the registered cap');
    total += value;
  }
  return total;
}

/** @param {unknown} normalDomain @param {unknown} aliasDomain @returns {Readonly<MetadataBaseline>} */
export function createMetadataBaselineP3R3(normalDomain, aliasDomain) {
  toolAssert(arguments.length === 2, 'baseline factory requires exactly two arguments');
  toolAssert(opaque(normalDomain) && opaque(aliasDomain) && normalDomain !== aliasDomain,
    'baseline factory requires two distinct opaque domain identities');
  /** @type {WeakMap<object, BaselineContext>} */
  const contexts = new MapType();
  const seenHandles = new SetType();
  /** @type {object | null} */
  let normalHandle = null;
  /** @type {object | null} */
  let aliasHandle = null;

  /** @param {unknown} domain @returns {void} */
  function knownDomain(domain) {
    toolAssert(domain === normalDomain || domain === aliasDomain, 'baseline domain identity is not registered');
  }

  /** @param {unknown} handle @param {unknown} domain @returns {BaselineContext} */
  function contextFor(handle, domain) {
    toolAssert(opaque(handle), 'baseline handle must be an opaque object identity');
    knownDomain(domain);
    const context = mapGet(contexts, handle);
    toolAssert(context !== undefined, 'baseline handle has no live registration');
    toolAssert(context.domain === domain, 'baseline handle belongs to a different domain identity');
    return context;
  }

  /** @param {unknown} handle @param {unknown} domain @param {unknown} sourceUnits
   * @param {unknown} mode @param {unknown} cap @param {unknown} ttl @returns {void} */
  function register(handle, domain, sourceUnits, mode, cap, ttl) {
    toolAssert(arguments.length === 6, 'baseline register requires exactly six arguments');
    toolAssert(opaque(handle), 'baseline handle must be an opaque object identity');
    knownDomain(domain);
    toolAssert(integer(sourceUnits), 'baseline source units must be a canonical nonnegative safe integer');
    toolAssert(mode === 'SCRIPT' || mode === 'MODULE', 'baseline mode must be SCRIPT or MODULE');
    toolAssert(integer(cap) && cap > 0 && cap <= CAP, 'baseline cap is outside the fixed bound');
    toolAssert(integer(ttl) && ttl > 0 && ttl <= TTL, 'baseline ttl is outside the fixed bound');
    toolAssert(cap >= STARTUP + SOURCE_FIXED && sourceUnits <= (cap - STARTUP - SOURCE_FIXED) / 4,
      'baseline startup and source reservation exceed the registered cap');
    toolAssert(!setHas(seenHandles, handle), 'baseline handle identity cannot be registered twice');
    toolAssert(domain === normalDomain ? normalHandle === null : aliasHandle === null,
      'baseline domain already has a live handle');
    const context = /** @type {BaselineContext} */ ({
      __proto__: null, domain, sourceUnits, mode, cap, ttl,
      witness: null, lastPhase: -1, lastEmissions: 0, reconciliation: null,
    });
    mapSet(contexts, handle, context);
    setAdd(seenHandles, handle);
    if (domain === normalDomain) normalHandle = handle;
    else aliasHandle = handle;
  }

  /** @param {unknown} handle @param {unknown} domain @param {unknown} text @returns {Readonly<Metadata>} */
  function read(handle, domain, text) {
    toolAssert(arguments.length === 3, 'baseline read requires exactly three arguments');
    const context = contextFor(handle, domain);
    const record = decodeMetadata(text, context);
    const phase = phaseIndex(record.phase);
    const passes = phase === 0 ? 0 : phase === 3 ? 2 : 1;
    toolAssert(record.grammarPasses === passes, 'metadata phase and grammar-pass count disagree');
    toolAssert(phase >= context.lastPhase, 'metadata phase cannot move backwards');
    toolAssert(record.metadataEmissions === context.lastEmissions + 1,
      'metadata emission sequence must advance exactly once');
    toolAssert(record.peakBytes === record.totalBytes, 'metadata peak must equal monotone total');
    let boundWitness = context.witness;
    let initialBase;
    if (boundWitness === null) {
      toolAssert(phase === 0 && record.metadataEmissions === 1, 'baseline first metadata must be SOURCE_READY emission one');
      toolAssert(record.producerParseBytes === 0 && record.producerWorkBytes === 304440 &&
        record.summaryBytes === 12864 && record.replayReservedBytes === 25165824 &&
        record.replayLiveBytes === 0 && record.scratchBytes === 6745432 &&
        record.unreclaimedProducerBytes === 0 && record.unreclaimedReplayBytes === 0,
      'baseline first metadata categories differ from the fixed startup vector');
      toolAssert(record.attemptedNodes === 0 && record.internalEntries === 257 && record.siteCount === 0,
        'baseline first metadata counters differ from the fixed startup vector');
      toolAssert(record.totalBytes >= STARTUP + SOURCE_FIXED + 4 * context.sourceUnits,
        'baseline initial total cannot fund the fixed source reservation');
      initialBase = record.totalBytes - STARTUP;
      toolAssert(integer(initialBase) && categoryTotal(record, initialBase, context.cap) === record.totalBytes,
        'baseline initial accounting differs from the fixed startup reservation');
      boundWitness = freeze({
        __proto__: null, initialBase, initialTotalBytes: record.totalBytes,
        sourceUnits: context.sourceUnits, mode: context.mode, cap: context.cap,
        ttl: context.ttl, provenance: WITNESS_PROVENANCE,
      });
    } else {
      toolAssert(categoryTotal(record, boundWitness.initialBase, context.cap) === record.totalBytes,
        'metadata total differs from the once-bound baseline plus categories');
    }
    // No parsed text/record survives in context. All checks precede the commit.
    context.witness = boundWitness;
    context.lastPhase = phase;
    context.lastEmissions = record.metadataEmissions;
    return record;
  }

  /** @param {unknown} handle @param {unknown} domain @returns {BaselineWitness} */
  function witness(handle, domain) {
    toolAssert(arguments.length === 2, 'baseline witness requires exactly two arguments');
    const context = contextFor(handle, domain);
    toolAssert(context.witness !== null, 'baseline witness is not yet bound');
    return context.witness;
  }

  /** @param {unknown} handle @param {unknown} domain @param {unknown} expectedToolBytes @returns {BaselineReconciliation} */
  function reconcile(handle, domain, expectedToolBytes) {
    toolAssert(arguments.length === 3, 'baseline reconcile requires exactly three arguments');
    const context = contextFor(handle, domain);
    toolAssert(context.witness !== null, 'baseline witness is not yet bound');
    toolAssert(context.reconciliation === null, 'baseline reconciliation cannot be repeated');
    toolAssert(integer(expectedToolBytes), 'baseline expected tool bytes must be a canonical nonnegative safe integer');
    const sourceBytes = SOURCE_FIXED + 4 * context.sourceUnits;
    toolAssert(expectedToolBytes <= context.cap - sourceBytes, 'baseline expected tool and source bytes exceed the cap');
    const expectedInitialBase = expectedToolBytes + sourceBytes;
    toolAssert(context.witness.initialBase === expectedInitialBase, 'baseline witness differs from the supplied source census');
    const result = freeze({
      __proto__: null, expectedToolBytes, expectedInitialBase,
      sourceUnits: context.sourceUnits, provenance: RECONCILIATION_PROVENANCE,
    });
    context.reconciliation = result;
    return result;
  }

  /** @param {unknown} handle @param {unknown} domain @returns {boolean} */
  function forget(handle, domain) {
    toolAssert(arguments.length === 2, 'baseline forget requires exactly two arguments');
    toolAssert(opaque(handle), 'baseline handle must be an opaque object identity');
    knownDomain(domain);
    const context = mapGet(contexts, handle);
    if (context === undefined) return false;
    toolAssert(context.domain === domain, 'baseline handle belongs to a different domain identity');
    mapDelete(contexts, handle);
    if (domain === normalDomain) normalHandle = null;
    else aliasHandle = null;
    context.witness = null;
    context.reconciliation = null;
    context.domain = null;
    return true;
  }

  return freeze({ __proto__: null, register, read, witness, reconcile, forget });
}
