// P3 R3 inert TEST-TOOL expectations. No runner, product import or authority.
// Native crypto handles require the reviewed clean trusted TOOL bootstrap.
import assert from 'node:assert/strict';
import {Buffer} from 'node:buffer';
import {createHash} from 'node:crypto';

/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').Site} Site */
/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').ModelBody} ModelBody */
/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').ModelWire} ModelWire */
/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').BoundaryExpectations} BoundaryExpectations */
/** @typedef {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').BoundaryVector} BoundaryVector */

/** @type {import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').AssertCondition} */
const cAssert = assert.ok.bind(assert);
/** @type {(text: string) => unknown} */
const cParse = JSON.parse;
const cStringify = JSON.stringify;
const cKeys = Object.keys;
const cSetPrototype = Object.setPrototypeOf;
const cFreeze = Object.freeze;
const cIs = Object.is;
const cSafe = Number.isSafeInteger;
const cArray = Array;
/** @type {(value: unknown) => value is unknown[]} */
const cIsArray = Array.isArray;
/** @type {(text: string, index: number) => number} */
const cCharCode = Function.call.bind(String.prototype.charCodeAt);
const cUtf8 = Buffer.byteLength.bind(Buffer);
const cCreateHash = createHash;

const SUM_KEYS = cFreeze(cSetPrototype(['version','purpose','mode','profile',
  'syntheticUtf16Hash','utf16Units','astOccurrences','grammarAttempts','sites','ledger','summaryHash'], null));
const SITE_KEYS = cFreeze(cSetPrototype(['kind','start','end','binding','loader',
  'conditional','optional','computed','status'], null));
const LEDGER_KEYS = cFreeze(cSetPrototype(['baseBytes','producerParseBytes','producerWorkBytes',
  'summaryBytes','replayReservedBytes','replayLiveBytes','scratchBytes',
  'unreclaimedProducerBytes','unreclaimedReplayBytes','totalBytes','peakBytes',
  'producerEntries','producerAttempts','siteCount'], null));
const ROOT_KEYS = cFreeze(cSetPrototype(['version','purpose','scope','parserImported',
  'targetExecution','realParserDisabled','cases'], null));
const CASE_KEYS = cFreeze(cSetPrototype(['caseId','kind','outcome','encodedBytes',
  'attemptedByteOffset','wireSha256','actualSummaryHash','parentIndex','modelUsed',
  'modelDelta','guardAdmitted','actualBytesBefore','actualBytesAfter',
  'actualEntriesBefore','actualEntriesAfter'], null));

/** @type {readonly BoundaryVector[]} */
const VECTORS = cFreeze(cSetPrototype([
  cFreeze({__proto__:null,caseId:'P319.R3.C16384',kind:'CODEC',outcome:'EMITTED',encodedBytes:16384,attemptedByteOffset:null,parentIndex:null,modelUsed:null,modelDelta:null,guardAdmitted:null,bytesBeforeOffset:127968,entriesBefore:257}),
  cFreeze({__proto__:null,caseId:'P319.R3.C16385',kind:'CODEC',outcome:'SUMMARY_REFUSED',encodedBytes:16384,attemptedByteOffset:16384,parentIndex:null,modelUsed:null,modelDelta:null,guardAdmitted:null,bytesBeforeOffset:249416,entriesBefore:472}),
  cFreeze({__proto__:null,caseId:'P321.R3.B.P126',kind:'PRODUCER_DEPTH',outcome:'ADMIT',encodedBytes:null,attemptedByteOffset:null,parentIndex:126,modelUsed:null,modelDelta:null,guardAdmitted:true,bytesBeforeOffset:250072,entriesBefore:473}),
  cFreeze({__proto__:null,caseId:'P321.R3.B.P127',kind:'PRODUCER_DEPTH',outcome:'REFUSE',encodedBytes:null,attemptedByteOffset:null,parentIndex:127,modelUsed:null,modelDelta:null,guardAdmitted:false,bytesBeforeOffset:250728,entriesBefore:474}),
  cFreeze({__proto__:null,caseId:'P321.R3.B.PNEG',kind:'PRODUCER_DEPTH',outcome:'INVALID_ARGUMENT_REFUSED',encodedBytes:null,attemptedByteOffset:null,parentIndex:null,modelUsed:null,modelDelta:null,guardAdmitted:false,bytesBeforeOffset:251384,entriesBefore:475}),
  cFreeze({__proto__:null,caseId:'P321.R3.B.P128',kind:'PRODUCER_DEPTH',outcome:'INVALID_ARGUMENT_REFUSED',encodedBytes:null,attemptedByteOffset:null,parentIndex:128,modelUsed:null,modelDelta:null,guardAdmitted:false,bytesBeforeOffset:252040,entriesBefore:476}),
  cFreeze({__proto__:null,caseId:'P321.R3.B.V126',kind:'VERIFIER_DEPTH',outcome:'ADMIT',encodedBytes:null,attemptedByteOffset:null,parentIndex:126,modelUsed:null,modelDelta:null,guardAdmitted:true,bytesBeforeOffset:252696,entriesBefore:477}),
  cFreeze({__proto__:null,caseId:'P321.R3.B.V127',kind:'VERIFIER_DEPTH',outcome:'REFUSE',encodedBytes:null,attemptedByteOffset:null,parentIndex:127,modelUsed:null,modelDelta:null,guardAdmitted:false,bytesBeforeOffset:253352,entriesBefore:478}),
  cFreeze({__proto__:null,caseId:'P321.R3.B.VNEG',kind:'VERIFIER_DEPTH',outcome:'INVALID_ARGUMENT_REFUSED',encodedBytes:null,attemptedByteOffset:null,parentIndex:null,modelUsed:null,modelDelta:null,guardAdmitted:false,bytesBeforeOffset:254008,entriesBefore:479}),
  cFreeze({__proto__:null,caseId:'P321.R3.B.V128',kind:'VERIFIER_DEPTH',outcome:'INVALID_ARGUMENT_REFUSED',encodedBytes:null,attemptedByteOffset:null,parentIndex:128,modelUsed:null,modelDelta:null,guardAdmitted:false,bytesBeforeOffset:254664,entriesBefore:480}),
  cFreeze({__proto__:null,caseId:'P322.R3.B.E19999_1',kind:'ENTRY',outcome:'ADMIT',encodedBytes:null,attemptedByteOffset:null,parentIndex:null,modelUsed:19999,modelDelta:1,guardAdmitted:true,bytesBeforeOffset:255320,entriesBefore:481}),
  cFreeze({__proto__:null,caseId:'P322.R3.B.E20000_1',kind:'ENTRY',outcome:'REFUSE',encodedBytes:null,attemptedByteOffset:null,parentIndex:null,modelUsed:20000,modelDelta:1,guardAdmitted:false,bytesBeforeOffset:255976,entriesBefore:482}),
  cFreeze({__proto__:null,caseId:'P322.R3.B.E20000_0',kind:'ENTRY',outcome:'ADMIT',encodedBytes:null,attemptedByteOffset:null,parentIndex:null,modelUsed:20000,modelDelta:0,guardAdmitted:true,bytesBeforeOffset:256632,entriesBefore:483}),
  cFreeze({__proto__:null,caseId:'P322.R3.B.E0_MAX',kind:'ENTRY',outcome:'REFUSE',encodedBytes:null,attemptedByteOffset:null,parentIndex:null,modelUsed:0,modelDelta:9007199254740991,guardAdmitted:false,bytesBeforeOffset:257288,entriesBefore:484}),
  cFreeze({__proto__:null,caseId:'P322.R3.B.EMAX_1',kind:'ENTRY',outcome:'INVALID_ARGUMENT_REFUSED',encodedBytes:null,attemptedByteOffset:null,parentIndex:null,modelUsed:9007199254740991,modelDelta:1,guardAdmitted:false,bytesBeforeOffset:257944,entriesBefore:485}),
  cFreeze({__proto__:null,caseId:'P322.R3.B.ENEGZERO_1',kind:'ENTRY',outcome:'INVALID_ARGUMENT_REFUSED',encodedBytes:null,attemptedByteOffset:null,parentIndex:null,modelUsed:null,modelDelta:1,guardAdmitted:false,bytesBeforeOffset:258600,entriesBefore:486}),
  cFreeze({__proto__:null,caseId:'P322.R3.B.E0_NEG',kind:'ENTRY',outcome:'INVALID_ARGUMENT_REFUSED',encodedBytes:null,attemptedByteOffset:null,parentIndex:null,modelUsed:0,modelDelta:null,guardAdmitted:false,bytesBeforeOffset:259256,entriesBefore:487}),
  cFreeze({__proto__:null,caseId:'P322.R3.B.E19999_FRACTION',kind:'ENTRY',outcome:'INVALID_ARGUMENT_REFUSED',encodedBytes:null,attemptedByteOffset:null,parentIndex:null,modelUsed:19999,modelDelta:null,guardAdmitted:false,bytesBeforeOffset:259912,entriesBefore:488}),
  cFreeze({__proto__:null,caseId:'P322.R3.B.EUNSAFE_1',kind:'ENTRY',outcome:'INVALID_ARGUMENT_REFUSED',encodedBytes:null,attemptedByteOffset:null,parentIndex:null,modelUsed:null,modelDelta:1,guardAdmitted:false,bytesBeforeOffset:260568,entriesBefore:489}),
  cFreeze({__proto__:null,caseId:'P322.R3.B.E0_INFINITY',kind:'ENTRY',outcome:'INVALID_ARGUMENT_REFUSED',encodedBytes:null,attemptedByteOffset:null,parentIndex:null,modelUsed:0,modelDelta:null,guardAdmitted:false,bytesBeforeOffset:261224,entriesBefore:490}),
], null));

/** @param {unknown} value @returns {value is number} */
function coreIntegerR3(value) {
  return typeof value === 'number' && cSafe(value) && value >= 0 && !cIs(value, -0);
}

/** @param {number} index @returns {Readonly<Site>} */
function coreModelSiteR3(index) {
  cAssert(coreIntegerR3(index) && index < 106, 'MODEL index is outside the fixed range');
  cAssert(SITE_KEYS.length === 9 && SITE_KEYS[0] === 'kind' && SITE_KEYS[8] === 'status',
    'MODEL site schema changed');
  const start = index < 12 ? 9 * index : index < 23 ? 108 + 18 * (index - 12) : 306 + 9 * (index - 23);
  const loader = index >= 12 && index < 23 ? 'STATIC_LITERAL' : 'NONE';
  return cFreeze({__proto__:null,kind:'EXPORT',start,
    end:start + (index >= 12 && index < 23 ? 18 : 9),binding:'NONE',loader,
    conditional:'CERTAIN',optional:false,computed:false,status:'OPEN'});
}

/** @param {number} variant @returns {Readonly<ModelBody>} */
function coreModelBodyR3(variant) {
  cAssert(variant === 0 || variant === 1, 'MODEL variant is outside the fixed range');
  let sites = /** @type {Readonly<Site>[] | null} */ (null), index, ledger = /** @type {Readonly<import('../../tests/unit/private-summary-tip081-p3.r3.d.ts').Ledger> | null} */ (null), body = /** @type {Readonly<ModelBody> | null} */ (null);
  try {
    sites = cSetPrototype(new cArray(106), null);
    for (index = 0; index < 106; index++) sites[index] = coreModelSiteR3(index);
    cFreeze(sites);
    ledger = cFreeze({__proto__:null,baseBytes:30000000,producerParseBytes:1000000,
      producerWorkBytes:2282968,summaryBytes:variant === 0 ? 90656 : 103520,
      replayReservedBytes:25165824,replayLiveBytes:0,scratchBytes:variant === 0 ? 6667640 : 6654776,
      unreclaimedProducerBytes:0,unreclaimedReplayBytes:0,totalBytes:65207088,
      peakBytes:65207088,producerEntries:10000,producerAttempts:118,siteCount:106});
    cAssert(coreExactKeysR3(ledger, LEDGER_KEYS), 'MODEL ledger schema changed');
    body = cFreeze({__proto__:null,version:1,purpose:'TIP081_P3_SYNTHETIC_SYNTAX_SUMMARY',
      mode:'MODULE',profile:'P3_ECMA15_FIXED19_COMMON_GRAMMAR',
      syntheticUtf16Hash:'0000000000000000000000000000000000000000000000000000000000000000',
      utf16Units:1053,astOccurrences:118,grammarAttempts:118,sites,ledger});
    return body;
  } finally {sites=null;ledger=null;body=null;}
}

/** @param {string | null} text @returns {string} */
function coreAsciiHashR3(text) {
  cAssert(typeof text === 'string' && text.length <= 16385, 'hash input is outside the fixed ASCII bound');
  let index, hash = /** @type {import('node:crypto').Hash | null} */ (null), result = /** @type {string | null} */ (null);
  try {
    for (index = 0; index < text.length; index++)
      cAssert(cCharCode(text,index) <= 127, 'hash input must be ASCII');
    hash = cCreateHash('sha256');
    hash.update(text,'ascii');
    result = hash.digest('hex');
    hash = null;
    cAssert(typeof result === 'string' && result.length === 64, 'SHA256 result has the wrong shape');
    for (index = 0; index < 64; index++)
      cAssert(cCharCode(result,index) >= 48 && cCharCode(result,index) <= 57 ||
        cCharCode(result,index) >= 97 && cCharCode(result,index) <= 102,
      'SHA256 result must be lowercase hex');
    return result;
  } finally {hash=null;result=null;text=null;}
}

/** @param {unknown} record @param {readonly string[]} expected @returns {record is Record<string, unknown>} */
function coreExactKeysR3(record, expected) {
  if (record === null || typeof record !== 'object' || cIsArray(record)) return false;
  let keys = /** @type {string[] | null} */ (null), index;
  try {
    keys = cSetPrototype(cKeys(record), null);
    if (keys.length !== expected.length) return false;
    for (index = 0; index < keys.length; index++) if (keys[index] !== expected[index]) return false;
    return true;
  } finally {keys=null;}
}

/** @param {unknown} expectedKernelToolBytes @returns {Readonly<BoundaryExpectations>} */
export function createBoundaryExpectationsP3R3(expectedKernelToolBytes) {
  cAssert(arguments.length === 1, 'expectations factory requires exactly one argument');
  cAssert(coreIntegerR3(expectedKernelToolBytes) && expectedKernelToolBytes <= 66797576,
    'trusted kernel census is outside the fixed logical cap');
  let pair = /** @type {Readonly<ModelWire>[] | null} */ (null), variant, body = /** @type {Readonly<ModelBody> | Readonly<BoundaryExpectations> | null} */ (null), bodyText = /** @type {string | null} */ (null), seal = /** @type {string | null} */ (null),
    sealed = /** @type {(Readonly<ModelBody> & {readonly summaryHash: string}) | null} */ (null), wireText = /** @type {string | null} */ (null), wireHash = /** @type {string | null} */ (null);
  try {
    pair = cSetPrototype(new cArray(2), null);
    for (variant = 0; variant < 2; variant++) {
      body = coreModelBodyR3(variant);
      bodyText = cStringify(body);
      cAssert(typeof bodyText === 'string' && bodyText.length === 16303 + variant,
        'fixed MODEL canonical body length changed');
      seal = coreAsciiHashR3(bodyText);
      sealed = cFreeze({__proto__:null,version:body.version,purpose:body.purpose,
        mode:body.mode,profile:body.profile,syntheticUtf16Hash:body.syntheticUtf16Hash,
        utf16Units:body.utf16Units,astOccurrences:body.astOccurrences,
        grammarAttempts:body.grammarAttempts,sites:body.sites,ledger:body.ledger,summaryHash:seal});
      cAssert(coreExactKeysR3(sealed,SUM_KEYS), 'MODEL summary schema changed');
      wireText = cStringify(sealed);
      cAssert(typeof wireText === 'string' && wireText.length === 16384 + variant &&
        cUtf8(wireText,'utf8') === 16384 + variant, 'fixed MODEL wire length changed');
      wireHash = coreAsciiHashR3(wireText);
      pair[variant] = cFreeze({__proto__:null,wire:wireText,bytes:16384 + variant,
        summaryHash:seal,wireSha256:wireHash});
      body=null;bodyText=null;sealed=null;seal=null;wireText=null;wireHash=null;
    }
    cFreeze(pair);
    body = cFreeze({__proto__:null,wire,check});
    // Existing loop variable marks success only after all fallible construction.
    variant = 3;
    return body;
  } finally {
    body=null;bodyText=null;sealed=null;seal=null;wireText=null;wireHash=null;
    if (variant !== 3) pair=null;
  }

  /** @param {unknown} variant @returns {string} */
  function wire(variant) {
    cAssert(arguments.length === 1, 'wire requires exactly one argument');
    cAssert(coreIntegerR3(variant) && variant <= 1, 'wire variant must be zero or one');
    return /** @type {Readonly<ModelWire>[]} */ (pair)[variant].wire;
  }

  /** @param {unknown} actualText @returns {true} */
  function check(actualText) {
    cAssert(arguments.length === 1, 'check requires exactly one argument');
    cAssert(typeof actualText === 'string' && actualText.length >= 1 && actualText.length <= 16384,
      'kernel observation text is outside the fixed bound');
    let decoded = /** @type {unknown} */ (null), cases = /** @type {unknown} */ (null), keys = /** @type {readonly string[] | null} */ (null), row = /** @type {unknown} */ (null),
      index, field, expected = /** @type {BoundaryVector | null} */ (null), serialized = /** @type {string | null} */ (null);
    try {
      for (index = 0; index < actualText.length; index++)
        cAssert(cCharCode(actualText,index) <= 127, 'kernel observation text must be ASCII');
      cAssert(cUtf8(actualText,'utf8') <= 16384, 'kernel observation UTF8 length exceeds the fixed bound');
      decoded = cParse(actualText);
      cAssert(coreExactKeysR3(decoded,ROOT_KEYS), 'kernel root schema changed');
      cSetPrototype(decoded,null);
      cAssert(decoded.version === 1 && coreIntegerR3(decoded.version) &&
        decoded.purpose === 'TIP081_P3_BOUNDARY_COMPONENT_ONLY' && decoded.scope === 'UNIT_ONLY' &&
        decoded.parserImported === false && decoded.targetExecution === false &&
        decoded.realParserDisabled === true, 'kernel root scalar values changed');
      cases = decoded.cases;
      cAssert(cIsArray(cases) && cases.length === 20, 'kernel must contain exactly twenty observations');
      cSetPrototype(cases,null);
      keys = CASE_KEYS;
      for (index = 0; index < 20; index++) {
        row = cases[index];expected = VECTORS[index];
        cAssert(coreExactKeysR3(row,keys), 'kernel observation schema or key order changed');
        cSetPrototype(row,null);
        for (field = 0; field < 15; field++) {
          cAssert(row[keys[field]] === null || typeof row[keys[field]] === 'string' ||
            typeof row[keys[field]] === 'boolean' || coreIntegerR3(row[keys[field]]),
          'kernel observation must contain only canonical bounded scalars');
        }
        cAssert(row.caseId === expected.caseId && row.kind === expected.kind &&
          row.outcome === expected.outcome, 'kernel case identity or outcome changed');
        cAssert(row.encodedBytes === expected.encodedBytes &&
          row.attemptedByteOffset === expected.attemptedByteOffset,
        'kernel actual encoded length or denial offset changed');
        cAssert(row.wireSha256 === (index === 0 ? /** @type {Readonly<ModelWire>[]} */ (pair)[0].wireSha256 : null) &&
          row.actualSummaryHash === (index === 0 ? /** @type {Readonly<ModelWire>[]} */ (pair)[0].summaryHash : null),
        'kernel actual wire digest or seal changed');
        cAssert(row.parentIndex === expected.parentIndex && row.modelUsed === expected.modelUsed &&
          row.modelDelta === expected.modelDelta && row.guardAdmitted === expected.guardAdmitted,
        'kernel modeled guard input or actual admission changed');
        cAssert(row.actualBytesBefore === expectedKernelToolBytes + expected.bytesBeforeOffset &&
          row.actualBytesAfter === row.actualBytesBefore && /** @type {number} */ (row.actualBytesAfter) <= 67108864,
        'kernel real cumulative byte snapshots changed');
        cAssert(row.actualEntriesBefore === expected.entriesBefore &&
          row.actualEntriesAfter === row.actualEntriesBefore && /** @type {number} */ (row.actualEntriesAfter) <= 20000,
        'kernel real cumulative entry snapshots changed');
      }
      serialized = cStringify(decoded);
      cAssert(typeof serialized === 'string' && serialized.length <= 16384 && serialized === actualText,
        'kernel observation must be exact canonical sanitized JSON');
      return true;
    } finally {
      decoded=null;cases=null;keys=null;row=null;expected=null;serialized=null;actualText=null;
    }
  }
}
