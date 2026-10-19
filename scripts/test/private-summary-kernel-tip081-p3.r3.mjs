// P3 R3 lexical UNIT_ONLY kernel template. Never import this handwritten template.

// Fixed offline admission supplies exact reviewed static/workspace constants.

import {performance as __HIVE_P2_performance} from "node:perf_hooks";
const __HIVE_P2_clock = __HIVE_P2_performance.now.bind(__HIVE_P2_performance);
const __HIVE_P2_charCode = Function.prototype.call.bind(String.prototype.charCodeAt);
const __HIVE_P2_sliceNative = Function.prototype.call.bind(String.prototype.slice);

const __HIVE_P2_safe = Number.isSafeInteger;
const __HIVE_P2_maxInteger = Number.MAX_SAFE_INTEGER;
const __HIVE_P2_finite = Number.isFinite;
const __HIVE_P2_is = Object.is;
const __HIVE_P2_freeze = Object.freeze;
const __HIVE_P2_setPrototype = Object.setPrototypeOf;
const __HIVE_P2_descriptor = Object.getOwnPropertyDescriptor;

const __HIVE_P2_proto = Object.getPrototypeOf;

const __HIVE_P2_hasOwn = Object.hasOwn;

const __HIVE_P2_Array = Array;

const __HIVE_P2_mathFloor = Math.floor;

const __HIVE_P2_deleteWeak = Function.prototype.call.bind(WeakMap.prototype.delete);

let __HIVE_P2_toolBytes = __HIVE_P2_RUNTIME_STATIC_BYTES + __HIVE_P2_RUNTIME_WORKSPACE_BYTES;

const __HIVE_P2_owners = new WeakMap();
let __HIVE_P2_active = null;
let __HIVE_P2_owner = null;

const __HIVE_P2_errors = __HIVE_P2_freeze({
  __proto__: null,
  SCHEMA_REFUSED: __HIVE_P2_freeze({code: "SCHEMA_REFUSED", realParserDisabled: true}),
  MODE_OPEN: __HIVE_P2_freeze({code: "MODE_OPEN", realParserDisabled: true}),
  AUTHORITY_REFUSED: __HIVE_P2_freeze({code: "AUTHORITY_REFUSED", realParserDisabled: true}),
  BUSY_REFUSED: __HIVE_P2_freeze({code: "BUSY_REFUSED", realParserDisabled: true}),
  CAP_REFUSED: __HIVE_P2_freeze({code: "CAP_REFUSED", realParserDisabled: true}),
  NODE_REFUSED: __HIVE_P2_freeze({code: "NODE_REFUSED", realParserDisabled: true}),
  ENTRY_REFUSED: __HIVE_P2_freeze({code: "ENTRY_REFUSED", realParserDisabled: true}),
  DEPTH_REFUSED: __HIVE_P2_freeze({code: "DEPTH_REFUSED", realParserDisabled: true}),
  TIME_REFUSED: __HIVE_P2_freeze({code: "TIME_REFUSED", realParserDisabled: true}),
  SYNTAX_REFUSED: __HIVE_P2_freeze({code: "SYNTAX_REFUSED", realParserDisabled: true}),
  UNSUPPORTED_BOUNDED_SYNTAX: __HIVE_P2_freeze({code: "UNSUPPORTED_BOUNDED_SYNTAX", realParserDisabled: true}),
  ALLOCATION_COVERAGE_OPEN: __HIVE_P2_freeze({code: "ALLOCATION_COVERAGE_OPEN", realParserDisabled: true}),
});
function __HIVE_P2_integer(value) {
  return typeof value === "number" && __HIVE_P2_safe(value) && value >= 0 && !__HIVE_P2_is(value, -0);
}

const __HIVE_P3_errors = __HIVE_P2_freeze({__proto__: null,
  PHASE_REFUSED: __HIVE_P2_freeze({code: "PHASE_REFUSED", realParserDisabled: true}),
  ALIAS_REFUSED: __HIVE_P2_freeze({code: "ALIAS_REFUSED", realParserDisabled: true}),
  SUMMARY_REFUSED: __HIVE_P2_freeze({code: "SUMMARY_REFUSED", realParserDisabled: true}),
  REPLAY_MISMATCH: __HIVE_P2_freeze({code: "REPLAY_MISMATCH", realParserDisabled: true}),
  VERIFY_RESOURCE_REFUSED: __HIVE_P2_freeze({code: "VERIFY_RESOURCE_REFUSED", realParserDisabled: true})
});

const __HIVE_P2_dispose = __HIVE_P3_dispose;

import {TextDecoder as __HIVE_P3_TextDecoder} from "node:util";
import {Buffer as __HIVE_P3_Buffer} from "node:buffer";
const __HIVE_P3_allocBuffer = __HIVE_P3_Buffer.alloc.bind(__HIVE_P3_Buffer);
// Explicit trusted bootstrap receiver; it receives only bounded ASCII metadata
// and digests, NEVER source code units. Costed native decoder workspace4096.
const __HIVE_P3_decoder = new __HIVE_P3_TextDecoder("utf-8", {__proto__: null, fatal: true, ignoreBOM: true});
__HIVE_P3_commonReserve(16, 0, 0, 4);
__HIVE_P2_setPrototype(__HIVE_P3_decoder, null);
const __HIVE_P3_decodeAscii = Function.prototype.call.bind(__HIVE_P3_TextDecoder.prototype.decode, __HIVE_P3_decoder);
const __HIVE_P3_sliceAscii = __HIVE_P2_sliceNative;

const __HIVE_P3_setPrototype = __HIVE_P2_setPrototype;
const __HIVE_P3_Array = __HIVE_P2_Array;
const __HIVE_P3_Uint8Array = Uint8Array;
const __HIVE_P3_Uint32Array = Uint32Array;
const __HIVE_P3_charCode = __HIVE_P2_charCode;
const __HIVE_P3_typedPrototype = __HIVE_P2_proto(Uint8Array.prototype);
__HIVE_P3_commonReserve(128, 0, 0, 4);
const __HIVE_P3_bufferSlot = __HIVE_P2_descriptor(__HIVE_P3_typedPrototype, "buffer");
__HIVE_P3_commonReserve(16, 0, 0, 4); __HIVE_P2_setPrototype(__HIVE_P3_bufferSlot, null);
const __HIVE_P3_bufferGetter = Function.prototype.call.bind(__HIVE_P3_bufferSlot.get);
__HIVE_P3_commonReserve(128, 0, 0, 4);
const __HIVE_P3_offsetSlot = __HIVE_P2_descriptor(__HIVE_P3_typedPrototype, "byteOffset");
__HIVE_P3_commonReserve(16, 0, 0, 4); __HIVE_P2_setPrototype(__HIVE_P3_offsetSlot, null);
const __HIVE_P3_offsetGetter = Function.prototype.call.bind(__HIVE_P3_offsetSlot.get);
__HIVE_P3_commonReserve(128, 0, 0, 4);
const __HIVE_P3_lengthSlot = __HIVE_P2_descriptor(__HIVE_P3_typedPrototype, "byteLength");
__HIVE_P3_commonReserve(16, 0, 0, 4); __HIVE_P2_setPrototype(__HIVE_P3_lengthSlot, null);
const __HIVE_P3_lengthGetter = Function.prototype.call.bind(__HIVE_P3_lengthSlot.get);

const __HIVE_P3_floor = __HIVE_P2_mathFloor;

const __HIVE_P3_PROFILE = "P3_ECMA15_FIXED19_COMMON_GRAMMAR";

const __HIVE_P3_shaConstants = [
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
  0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
  0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
  0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
__HIVE_P3_commonReserve(16, 0, 0, 4); __HIVE_P3_setPrototype(__HIVE_P3_shaConstants, null);

const __HIVE_P3_vShaConstants = [
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
  0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
  0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
  0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
];

__HIVE_P3_commonReserve(16, 0, 0, 4); __HIVE_P2_setPrototype(__HIVE_P3_vShaConstants, null);

function __HIVE_P2_refuse(code) {
  __HIVE_P2_dispose();
  throw __HIVE_P2_errors[code] || __HIVE_P2_errors.ALLOCATION_COVERAGE_OPEN;
}

function __HIVE_P2_timed() {
  if (!__HIVE_P2_owner) return;
  const t = __HIVE_P2_clock();
  if (!__HIVE_P2_finite(t) || t < __HIVE_P2_owner.lastNow || t - __HIVE_P2_owner.started >= __HIVE_P2_owner.ttl) __HIVE_P2_refuse("TIME_REFUSED");
  __HIVE_P2_owner.lastNow = t;
}
function __HIVE_P2_plus(a, b) {
  if (!__HIVE_P2_integer(a) || !__HIVE_P2_integer(b) || b > __HIVE_P2_maxInteger - a) __HIVE_P2_refuse("CAP_REFUSED");
  return a + b;
}
function __HIVE_P2_product(a, b) {
  if (!__HIVE_P2_integer(a) || !__HIVE_P2_integer(b) || a !== 0 && b > __HIVE_P2_maxInteger / a) __HIVE_P2_refuse("CAP_REFUSED");
  const result = a * b;
  if (!__HIVE_P2_integer(result)) __HIVE_P2_refuse("CAP_REFUSED");
  return result;
}

function __HIVE_P3_u8View(bytes, start, end) {
  const length = __HIVE_P3_lengthGetter(bytes);
  if (end === undefined) end = length;
  if (!__HIVE_P2_integer(start) || !__HIVE_P2_integer(end) || start > end || end > length)
    __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  // Caller precharges48 BEFORE this construction. No constructor/species lookup.
  return new __HIVE_P3_Uint8Array(__HIVE_P3_bufferGetter(bytes), __HIVE_P3_offsetGetter(bytes) + start, end - start);
}
function __HIVE_P3_error(code) { return __HIVE_P3_errors[code] || __HIVE_P2_errors[code] || __HIVE_P2_errors.ALLOCATION_COVERAGE_OPEN; }
function __HIVE_P3_dispose() {
  const s = __HIVE_P2_owner;
  if (s) {
    s.ast = null; s.parser = null; s.producerRoot = null; s.producerFrames = null;
    s.producerScopes = null; s.producerBindings = null; s.producerSites = null;
    s.replayRoot = null; s.replayFrames = null; s.replayScopes = null; s.replayBindings = null;
    s.replaySites = null; s.codecBuffer = null; s.hashBuffer = null;
    s.summary = null; s.sealBody = null; s.text = null;
    s.traversalActive = false; s.replayTraversalActive = false; s.phase = "RETIRED";
  }
  if (__HIVE_P2_active !== null) __HIVE_P2_deleteWeak(__HIVE_P2_owners, __HIVE_P2_active);
  __HIVE_P2_owner = null; __HIVE_P2_active = null;
}
function __HIVE_P3_abort(code) { __HIVE_P3_dispose(); throw __HIVE_P3_error(code); }
function __HIVE_P3_touch() { __HIVE_P2_timed(); }
function __HIVE_P3_add(a, b) { return __HIVE_P2_plus(a, b); }
function __HIVE_P3_mul(a, b) { return __HIVE_P2_product(a, b); }
function __HIVE_P3_pGuardChild(parentIndex) {
  __HIVE_P3_touch();
  if (!__HIVE_P2_integer(parentIndex) || parentIndex >= 128)
    __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  if (parentIndex + 1 >= 128) __HIVE_P3_abort("DEPTH_REFUSED");
  return true;
}
function __HIVE_P3_guardEntries(used, delta) {
  __HIVE_P3_touch();
  if (!__HIVE_P2_integer(used) || !__HIVE_P2_integer(delta) || used > 20000)
    __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  if (delta > 20000 - used) __HIVE_P3_abort("ENTRY_REFUSED");
  return true;
}
function __HIVE_P3_counters(entries, nodes) {
  const s = __HIVE_P2_owner;
  if (!s || !__HIVE_P2_integer(entries) || !__HIVE_P2_integer(nodes)) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  __HIVE_P3_guardEntries(s.entries, entries);
  if (nodes > 200000 - s.nodes) __HIVE_P3_abort("NODE_REFUSED");
  s.entries += entries; s.nodes += nodes;
}
function __HIVE_P3_debit(bytes, entries = 0, nodes = 0, category = "producerWorkBytes") {
  __HIVE_P3_touch();
  const s = __HIVE_P2_owner;
  if (!s || !__HIVE_P2_integer(bytes) || !__HIVE_P2_hasOwn(s, category)) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  if (bytes > s.limit - s.total) __HIVE_P3_abort("CAP_REFUSED");
  __HIVE_P3_counters(entries, nodes);
  s.total += bytes; s[category] = __HIVE_P3_add(s[category], bytes); s.peakBytes = s.total;
}
function __HIVE_P3_consume(bucket, bytes, entries = 0, nodes = 0, category = "scratchBytes") {
  __HIVE_P3_touch();
  const s = __HIVE_P2_owner;
  if (!s || !__HIVE_P2_integer(bytes)) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  let remaining;
  if (bucket === "SUMMARY_CODEC") remaining = s.summaryRemaining;
  else if (bucket === "VERIFY_CODEC") remaining = s.verifyCodecRemaining;
  else if (bucket === "VERIFY_WORK") remaining = s.verifyWorkRemaining;
  else if (bucket === "META") remaining = s.metadataRemaining;
  else __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  if (bytes > remaining) __HIVE_P3_abort("VERIFY_RESOURCE_REFUSED");
  __HIVE_P3_counters(entries, nodes);
  if (bucket === "SUMMARY_CODEC") s.summaryRemaining -= bytes;
  else if (bucket === "VERIFY_CODEC") s.verifyCodecRemaining -= bytes;
  else if (bucket === "VERIFY_WORK") s.verifyWorkRemaining -= bytes;
  else s.metadataRemaining -= bytes;
  s.scratchBytes -= bytes;
  s[category] = __HIVE_P3_add(s[category], bytes);
  // No total/peak refund; this transfers a disjoint already-debited reservation.
}
function __HIVE_P3_commonReserve(bytes, nodes = 0, entries = 0, family) {
  __HIVE_P3_touch();
  if (!__HIVE_P2_integer(bytes) || !__HIVE_P2_integer(nodes) || !__HIVE_P2_integer(entries) ||
      !__HIVE_P2_integer(family) || family > 4) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  if (!__HIVE_P2_owner) {
    if (bytes > 67108864 - __HIVE_P2_toolBytes) __HIVE_P3_abort("CAP_REFUSED");
    __HIVE_P2_toolBytes += bytes; return;
  }
  const s = __HIVE_P2_owner;
  if (s.commonStage === "PRODUCER") { __HIVE_P3_debit(bytes, entries, nodes, "producerParseBytes"); return; }
  if (s.commonStage !== "REPLAY") __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  let remaining;
  if (family === 0) remaining = s.replayNodeRemaining;
  else if (family === 1) remaining = s.replayArrayRemaining;
  else if (family === 2) remaining = s.replayStringRemaining;
  else if (family === 3) remaining = s.replayFrameRemaining;
  else remaining = s.replayBookRemaining;
  if (bytes > remaining) __HIVE_P3_abort("VERIFY_RESOURCE_REFUSED");
  __HIVE_P3_counters(entries, nodes);
  if (family === 0) s.replayNodeRemaining -= bytes;
  else if (family === 1) s.replayArrayRemaining -= bytes;
  else if (family === 2) s.replayStringRemaining -= bytes;
  else if (family === 3) s.replayFrameRemaining -= bytes;
  else s.replayBookRemaining -= bytes;
  s.replayReservedBytes -= bytes; s.replayLiveBytes += bytes;
}

function __HIVE_P3_put(s, code) {
  if (s.codecPosition >= s.codecLimit) __HIVE_P3_abort("SUMMARY_REFUSED");
  s.codecBuffer[s.codecPosition++] = code;
}
function __HIVE_P3_raw(s, text) {
  for (let i = 0; i < text.length; i++) { __HIVE_P3_touch(); __HIVE_P3_put(s, __HIVE_P2_charCode(text, i)); }
}
function __HIVE_P3_string(s, text) {
  if (typeof text !== "string" || text.length > 128) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  __HIVE_P3_put(s, 34);
  for (let i = 0; i < text.length; i++) {
    const c = __HIVE_P2_charCode(text, i);
    if (c < 32 || c > 126 || c === 34 || c === 92) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
    __HIVE_P3_put(s, c);
  }
  __HIVE_P3_put(s, 34);
}
function __HIVE_P3_unsigned(s, value) {
  if (!__HIVE_P2_integer(value)) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  let divisor = 1;
  while (__HIVE_P3_floor(value / divisor) >= 10) divisor *= 10;
  do {
    const digit = __HIVE_P3_floor(value / divisor);
    __HIVE_P3_put(s, 48 + digit); value -= digit * divisor; divisor /= 10;
  } while (divisor >= 1);
}
function __HIVE_P3_field(s, key, comma) { if (comma) __HIVE_P3_put(s, 44); __HIVE_P3_string(s, key); __HIVE_P3_put(s, 58); }
function __HIVE_P3_rotate(value, shift) { return value >>> shift | value << 32 - shift; }
function __HIVE_P3_sha256(input, utf16, units) {
  // Caller consumes4096 named bounded SHA workspace +160 final digest string
  // BEFORE entry. Native numeric typed arrays receive lengths only; no iterable
  // constructor, species/view, native Hash object, source callback or raw export.
  const state = new __HIVE_P3_Uint32Array(8), words = new __HIVE_P3_Uint32Array(64);
  const block = new __HIVE_P3_Uint8Array(64), hex = new __HIVE_P3_Uint8Array(64);
  state[0]=0x6a09e667;state[1]=0xbb67ae85;state[2]=0x3c6ef372;state[3]=0xa54ff53a;
  state[4]=0x510e527f;state[5]=0x9b05688c;state[6]=0x1f83d9ab;state[7]=0x5be0cd19;
  const byteLength = utf16 ? units * 2 : units;
  const padded = __HIVE_P3_floor((byteLength + 72) / 64) * 64;
  const bitLength = byteLength * 8, high = __HIVE_P3_floor(bitLength / 4294967296), low = bitLength >>> 0;
  for (let offset = 0; offset < padded; offset += 64) {
    __HIVE_P3_touch();
    for (let i = 0; i < 64; i++) {
      const at = offset + i;
      if (at < byteLength) block[i] = utf16 ? __HIVE_P3_charCode(input, __HIVE_P3_floor(at / 2)) >>> ((at & 1) * 8) & 255 : input[at];
      else if (at === byteLength) block[i] = 128;
      else if (at >= padded - 8) {
        const position = at - (padded - 8), word = position < 4 ? high : low;
        block[i] = word >>> ((3 - position % 4) * 8) & 255;
      } else block[i] = 0;
    }
    for (let i = 0; i < 16; i++) words[i] = (block[i*4]<<24 | block[i*4+1]<<16 | block[i*4+2]<<8 | block[i*4+3]) >>> 0;
    for (let i = 16; i < 64; i++) {
      const x=words[i-15], y=words[i-2];
      const a=__HIVE_P3_rotate(x,7)^__HIVE_P3_rotate(x,18)^x>>>3;
      const b=__HIVE_P3_rotate(y,17)^__HIVE_P3_rotate(y,19)^y>>>10;
      words[i]=(words[i-16]+a+words[i-7]+b)>>>0;
    }
    let a=state[0],b=state[1],c=state[2],d=state[3],e=state[4],f=state[5],g=state[6],h=state[7];
    for (let i=0;i<64;i++) {
      __HIVE_P3_touch();
      const sigma1=__HIVE_P3_rotate(e,6)^__HIVE_P3_rotate(e,11)^__HIVE_P3_rotate(e,25);
      const sigma0=__HIVE_P3_rotate(a,2)^__HIVE_P3_rotate(a,13)^__HIVE_P3_rotate(a,22);
      const choose=e&f^~e&g, majority=a&b^a&c^b&c;
      const first=(h+sigma1+choose+__HIVE_P3_shaConstants[i]+words[i])>>>0;
      const second=(sigma0+majority)>>>0;
      h=g;g=f;f=e;e=(d+first)>>>0;d=c;c=b;b=a;a=(first+second)>>>0;
    }
    state[0]=(state[0]+a)>>>0;state[1]=(state[1]+b)>>>0;state[2]=(state[2]+c)>>>0;state[3]=(state[3]+d)>>>0;
    state[4]=(state[4]+e)>>>0;state[5]=(state[5]+f)>>>0;state[6]=(state[6]+g)>>>0;state[7]=(state[7]+h)>>>0;
  }
  for (let i=0;i<64;i++) {
    const nibble=state[__HIVE_P3_floor(i/8)]>>>((7-i%8)*4)&15;
    hex[i]=nibble<10?48+nibble:87+nibble;
  }
  return __HIVE_P3_decodeAscii(hex);
}

function __HIVE_P3_ledgerField(s, key, value, comma) { __HIVE_P3_field(s, key, comma); __HIVE_P3_unsigned(s, value); }
function __HIVE_P3_encodeSummary(s) {
  __HIVE_P3_consume("SUMMARY_CODEC", 16384 + 64 + 32800 + 32800 + 4096 + 160 + 96, 0, 0, "summaryBytes");
  s.codecBuffer = __HIVE_P3_allocBuffer(16384); s.codecPosition = 0; s.codecLimit = 16384;
  __HIVE_P3_put(s, 123);
  __HIVE_P3_field(s, "version", false); __HIVE_P3_unsigned(s, 1);
  __HIVE_P3_field(s, "purpose", true); __HIVE_P3_string(s, "TIP081_P3_SYNTHETIC_SYNTAX_SUMMARY");
  __HIVE_P3_field(s, "mode", true); __HIVE_P3_string(s, s.profile);
  __HIVE_P3_field(s, "profile", true); __HIVE_P3_string(s, __HIVE_P3_PROFILE);
  __HIVE_P3_field(s, "syntheticUtf16Hash", true); __HIVE_P3_string(s, s.sourceIdentity);
  __HIVE_P3_field(s, "utf16Units", true); __HIVE_P3_unsigned(s, s.text.length);
  __HIVE_P3_field(s, "astOccurrences", true); __HIVE_P3_unsigned(s, s.producerOccurrences);
  __HIVE_P3_field(s, "grammarAttempts", true); __HIVE_P3_unsigned(s, s.producerParseAttempts);
  __HIVE_P3_field(s, "sites", true); __HIVE_P3_put(s, 91);
  for (let i = 0; i < s.producerSiteCount; i++) {
    __HIVE_P3_touch(); const row = s.producerSites[i];
    if (i) __HIVE_P3_put(s, 44); __HIVE_P3_put(s, 123);
    __HIVE_P3_field(s, "kind", false); __HIVE_P3_string(s, row.kind);
    __HIVE_P3_field(s, "start", true); __HIVE_P3_unsigned(s, row.start);
    __HIVE_P3_field(s, "end", true); __HIVE_P3_unsigned(s, row.end);
    __HIVE_P3_field(s, "binding", true); __HIVE_P3_string(s, row.binding);
    __HIVE_P3_field(s, "loader", true); __HIVE_P3_string(s, row.loader);
    __HIVE_P3_field(s, "conditional", true); __HIVE_P3_string(s, row.conditional);
    __HIVE_P3_field(s, "optional", true); __HIVE_P3_raw(s, row.optional ? "true" : "false");
    __HIVE_P3_field(s, "computed", true); __HIVE_P3_raw(s, row.computed ? "true" : "false");
    __HIVE_P3_field(s, "status", true); __HIVE_P3_string(s, "OPEN"); __HIVE_P3_put(s, 125);
  }
  __HIVE_P3_put(s, 93); __HIVE_P3_field(s, "ledger", true); __HIVE_P3_put(s, 123);
  __HIVE_P3_ledgerField(s, "baseBytes", s.baseBytes, false);
  __HIVE_P3_ledgerField(s, "producerParseBytes", s.producerParseBytes, true);
  __HIVE_P3_ledgerField(s, "producerWorkBytes", s.producerWorkBytes, true);
  __HIVE_P3_ledgerField(s, "summaryBytes", s.summaryBytes, true);
  __HIVE_P3_ledgerField(s, "replayReservedBytes", s.replayReservedBytes, true);
  __HIVE_P3_ledgerField(s, "replayLiveBytes", s.replayLiveBytes, true);
  __HIVE_P3_ledgerField(s, "scratchBytes", s.scratchBytes, true);
  __HIVE_P3_ledgerField(s, "unreclaimedProducerBytes", s.unreclaimedProducerBytes, true);
  __HIVE_P3_ledgerField(s, "unreclaimedReplayBytes", s.unreclaimedReplayBytes, true);
  __HIVE_P3_ledgerField(s, "totalBytes", s.total, true);
  __HIVE_P3_ledgerField(s, "peakBytes", s.peakBytes, true);
  __HIVE_P3_ledgerField(s, "producerEntries", s.historicalProducerEntries, true);
  __HIVE_P3_ledgerField(s, "producerAttempts", s.producerParseAttempts, true);
  __HIVE_P3_ledgerField(s, "siteCount", s.producerSiteCount, true);
  __HIVE_P3_put(s, 125); __HIVE_P3_put(s, 125);
  s.sealBody = __HIVE_P3_decodeAscii(__HIVE_P3_u8View(s.codecBuffer, 0, s.codecPosition));
  const seal = __HIVE_P3_sha256(s.codecBuffer, false, s.codecPosition);
  s.codecPosition--;
  __HIVE_P3_field(s, "summaryHash", true); __HIVE_P3_string(s, seal); __HIVE_P3_put(s, 125);
  s.summary = __HIVE_P3_decodeAscii(__HIVE_P3_u8View(s.codecBuffer, 0, s.codecPosition));
  s.codecBuffer = null; s.hashBuffer = null;
  return s.summary;
}

function __HIVE_P3_vU(n) {
  return typeof n === "number" && n >= 0 && n <= 9007199254740991 && __HIVE_P3_floor(n) === n && (n !== 0 || 1 / n === Infinity);
}
function __HIVE_P3_vGuardChild(parentIndex) {
  __HIVE_P3_touch();
  if (!__HIVE_P3_vU(parentIndex) || parentIndex > 127)
    __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  if (parentIndex === 127) __HIVE_P3_abort("DEPTH_REFUSED");
  return true;
}

function __HIVE_P3_vShaBlock(state, words, bytes) {
  for (let i = 0; i < 16; i++) {
    const j = i * 4;
    words[i] = (bytes[j] << 24 | bytes[j+1] << 16 | bytes[j+2] << 8 | bytes[j+3]) >>> 0;
  }
  for (let i = 16; i < 64; i++) {
    const x = words[i-15], y = words[i-2];
    const a = (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ x >>> 3;
    const b = (y >>> 17 | y << 15) ^ (y >>> 19 | y << 13) ^ y >>> 10;
    words[i] = (words[i-16] + a + words[i-7] + b) >>> 0;
  }
  let a = state[0], b = state[1], c = state[2], d = state[3],
    e = state[4], f = state[5], g = state[6], h = state[7];
  for (let i = 0; i < 64; i++) {
    __HIVE_P3_touch();
    const sigma1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
    const choose = e & f ^ ~e & g;
    const t1 = (h + sigma1 + choose + __HIVE_P3_vShaConstants[i] + words[i]) >>> 0;
    const sigma0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
    const majority = a & b ^ a & c ^ b & c;
    const t2 = (sigma0 + majority) >>> 0;
    h = g; g = f; f = e; e = (d + t1) >>> 0;
    d = c; c = b; b = a; a = (t1 + t2) >>> 0;
  }
  state[0]=(state[0]+a)>>>0; state[1]=(state[1]+b)>>>0;
  state[2]=(state[2]+c)>>>0; state[3]=(state[3]+d)>>>0;
  state[4]=(state[4]+e)>>>0; state[5]=(state[5]+f)>>>0;
  state[6]=(state[6]+g)>>>0; state[7]=(state[7]+h)>>>0;
}
function __HIVE_P3_vSha256(text, utf16) {
  // Pure numeric SHA-256. Private text is NEVER passed to native hash methods.
  //4096 named workspace covers state8*4, words64*4, block64 and their headers;
  //hex backing64+header64/string160 and safe view48 are separate.
  __HIVE_P3_consume("VERIFY_CODEC", 4096 + 64 + 64 + 160 + 48, 0, 0, "scratchBytes");
  const state = new __HIVE_P3_Uint32Array(8), words = new __HIVE_P3_Uint32Array(64), bytes = new __HIVE_P3_Uint8Array(64);
  state[0]=0x6a09e667; state[1]=0xbb67ae85; state[2]=0x3c6ef372; state[3]=0xa54ff53a;
  state[4]=0x510e527f; state[5]=0x9b05688c; state[6]=0x1f83d9ab; state[7]=0x5be0cd19;
  const length = text.length * (utf16 ? 2 : 1);
  if (!__HIVE_P3_vU(length) || length > 2147483647) __HIVE_P3_abort("VERIFY_RESOURCE_REFUSED");
  const blocks = __HIVE_P3_floor((length + 9 + 63) / 64);
  // The low/high length fields are defined explicitly, not truncated to32bits.
  const bitLow = (length * 8) >>> 0, bitHigh = __HIVE_P3_floor(length / 536870912);
  for (let block = 0; block < blocks; block++) {
    __HIVE_P3_touch();
    for (let i = 0; i < 64; i++) {
      const position = block * 64 + i;
      let value = 0;
      if (position < length) {
        const unit = __HIVE_P3_charCode(text, utf16 ? __HIVE_P3_floor(position / 2) : position);
        if (!utf16 && unit > 127) __HIVE_P3_abort("SUMMARY_REFUSED");
        value = utf16 && position % 2 ? unit >>> 8 : unit & 255;
      } else if (position === length) value = 128;
      else if (block === blocks - 1 && i >= 56) {
        value = i < 60 ? bitHigh >>> ((59-i)*8) & 255 : bitLow >>> ((63-i)*8) & 255;
      }
      bytes[i] = value;
    }
    __HIVE_P3_vShaBlock(state, words, bytes);
  }
  const hex = new __HIVE_P3_Uint8Array(64), digits = "0123456789abcdef";
  for (let i = 0; i < 32; i++) {
    const value = state[__HIVE_P3_floor(i/4)] >>> ((3-i%4)*8) & 255;
    hex[i*2]=__HIVE_P3_charCode(digits,value>>>4); hex[i*2+1]=__HIVE_P3_charCode(digits,value&15);
  }
  return __HIVE_P3_decodeAscii(__HIVE_P3_u8View(hex, 0, 64));
}


const __HIVE_P3_KERNEL_RELEASED = false;
let __HIVE_P3_unitInvoked = false;
let __HIVE_P3_unitStarted = 0;
let __HIVE_P3_unitLastNow = 0;
let __HIVE_P3_unitTotal = 0;
let __HIVE_P3_unitEntries = 0;
let __HIVE_P3_unitRoot = null;
const __HIVE_P3_unitText = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const __HIVE_P3_unitIdentity = "0000000000000000000000000000000000000000000000000000000000000000";
const __HIVE_P3_unitRootKeys = ["version","purpose","scope","parserImported","targetExecution","realParserDisabled","cases"];
__HIVE_P2_setPrototype(__HIVE_P3_unitRootKeys, null);
const __HIVE_P3_unitCaseKeys = ["caseId","kind","outcome","encodedBytes","attemptedByteOffset","wireSha256","actualSummaryHash","parentIndex","modelUsed","modelDelta","guardAdmitted","actualBytesBefore","actualBytesAfter","actualEntriesBefore","actualEntriesAfter"];
__HIVE_P2_setPrototype(__HIVE_P3_unitCaseKeys, null);
const __HIVE_P3_unitRegistry = [
  {__proto__: null, caseId: "P319.R3.C16384", kind: "CODEC", parentIndex: null, modelUsed: null, modelDelta: null, codecVariant: 0},
  {__proto__: null, caseId: "P319.R3.C16385", kind: "CODEC", parentIndex: null, modelUsed: null, modelDelta: null, codecVariant: 1},
  {__proto__: null, caseId: "P321.R3.B.P126", kind: "PRODUCER_DEPTH", parentIndex: 126, modelUsed: null, modelDelta: null, codecVariant: null},
  {__proto__: null, caseId: "P321.R3.B.P127", kind: "PRODUCER_DEPTH", parentIndex: 127, modelUsed: null, modelDelta: null, codecVariant: null},
  {__proto__: null, caseId: "P321.R3.B.PNEG", kind: "PRODUCER_DEPTH", parentIndex: -1, modelUsed: null, modelDelta: null, codecVariant: null},
  {__proto__: null, caseId: "P321.R3.B.P128", kind: "PRODUCER_DEPTH", parentIndex: 128, modelUsed: null, modelDelta: null, codecVariant: null},
  {__proto__: null, caseId: "P321.R3.B.V126", kind: "VERIFIER_DEPTH", parentIndex: 126, modelUsed: null, modelDelta: null, codecVariant: null},
  {__proto__: null, caseId: "P321.R3.B.V127", kind: "VERIFIER_DEPTH", parentIndex: 127, modelUsed: null, modelDelta: null, codecVariant: null},
  {__proto__: null, caseId: "P321.R3.B.VNEG", kind: "VERIFIER_DEPTH", parentIndex: -1, modelUsed: null, modelDelta: null, codecVariant: null},
  {__proto__: null, caseId: "P321.R3.B.V128", kind: "VERIFIER_DEPTH", parentIndex: 128, modelUsed: null, modelDelta: null, codecVariant: null},
  {__proto__: null, caseId: "P322.R3.B.E19999_1", kind: "ENTRY", parentIndex: null, modelUsed: 19999, modelDelta: 1, codecVariant: null},
  {__proto__: null, caseId: "P322.R3.B.E20000_1", kind: "ENTRY", parentIndex: null, modelUsed: 20000, modelDelta: 1, codecVariant: null},
  {__proto__: null, caseId: "P322.R3.B.E20000_0", kind: "ENTRY", parentIndex: null, modelUsed: 20000, modelDelta: 0, codecVariant: null},
  {__proto__: null, caseId: "P322.R3.B.E0_MAX", kind: "ENTRY", parentIndex: null, modelUsed: 0, modelDelta: 9007199254740991, codecVariant: null},
  {__proto__: null, caseId: "P322.R3.B.EMAX_1", kind: "ENTRY", parentIndex: null, modelUsed: 9007199254740991, modelDelta: 1, codecVariant: null},
  {__proto__: null, caseId: "P322.R3.B.ENEGZERO_1", kind: "ENTRY", parentIndex: null, modelUsed: -0, modelDelta: 1, codecVariant: null},
  {__proto__: null, caseId: "P322.R3.B.E0_NEG", kind: "ENTRY", parentIndex: null, modelUsed: 0, modelDelta: -1, codecVariant: null},
  {__proto__: null, caseId: "P322.R3.B.E19999_FRACTION", kind: "ENTRY", parentIndex: null, modelUsed: 19999, modelDelta: 1.5, codecVariant: null},
  {__proto__: null, caseId: "P322.R3.B.EUNSAFE_1", kind: "ENTRY", parentIndex: null, modelUsed: 9007199254740992, modelDelta: 1, codecVariant: null},
  {__proto__: null, caseId: "P322.R3.B.E0_INFINITY", kind: "ENTRY", parentIndex: null, modelUsed: 0, modelDelta: Infinity, codecVariant: null}
];
__HIVE_P2_setPrototype(__HIVE_P3_unitRegistry, null);

function __HIVE_P3_unitTime() {
  const now = __HIVE_P2_clock();
  if (!__HIVE_P2_finite(now) || now < __HIVE_P3_unitLastNow ||
      now - __HIVE_P3_unitStarted >= 120000) __HIVE_P3_abort("TIME_REFUSED");
  __HIVE_P3_unitLastNow = now;
  return now;
}
function __HIVE_P3_unitCharge(bytes, entries) {
  __HIVE_P3_unitTime();
  if (__HIVE_P2_owner !== null || !__HIVE_P2_integer(bytes) || !__HIVE_P2_integer(entries))
    __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  if (bytes > 67108864 - __HIVE_P3_unitTotal) __HIVE_P3_abort("CAP_REFUSED");
  __HIVE_P3_guardEntries(__HIVE_P3_unitEntries, entries);
  __HIVE_P3_unitTotal = __HIVE_P3_add(__HIVE_P3_unitTotal, bytes);
  __HIVE_P3_unitEntries += entries;
}
function __HIVE_P3_unitNewK(kind) {
  __HIVE_P3_unitTime();
  if (kind !== "CODEC" && kind !== "PRODUCER_DEPTH" && kind !== "VERIFIER_DEPTH" &&
      kind !== "ENTRY" && kind !== "__OUTPUT") __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  const quota = kind === "CODEC" ? 97328 : kind === "__OUTPUT" ? 49408 : 0;
  __HIVE_P3_unitCharge(656 + quota, 1);
  const K = {__proto__: null,
    ast:null, parser:null, producerRoot:null, producerFrames:null, producerScopes:null,
    producerBindings:null, producerSites:null, replayRoot:null, replayFrames:null,
    replayScopes:null, replayBindings:null, replaySites:null, codecBuffer:null,
    hashBuffer:null, summary:null, sealBody:null, text:null, traversalActive:false,
    replayTraversalActive:false, phase:"UNIT_ONLY",
    summaryRemaining:kind === "CODEC" ? 92736 : 0,
    verifyCodecRemaining:kind === "CODEC" ? 4432 : 0,
    verifyWorkRemaining:0,
    metadataRemaining:kind === "CODEC" ? 160 : kind === "__OUTPUT" ? 49408 : 0,
    scratchBytes:quota, summaryBytes:0, replayLiveBytes:0,
    started:__HIVE_P3_unitStarted, lastNow:__HIVE_P3_unitLastNow, ttl:120000,
    entries:__HIVE_P3_unitEntries, nodes:0, limit:67108864,
    total:__HIVE_P3_unitTotal, peakBytes:__HIVE_P3_unitTotal,
    producerWorkBytes:0, baseBytes:__HIVE_P3_unitTotal - quota};
  __HIVE_P2_owner = K;
  return K;
}
function __HIVE_P3_unitSite(index) {
  __HIVE_P3_touch();
  if (!__HIVE_P2_integer(index) || index >= 106) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  const start = index < 12 ? 9 * index : index < 23 ? 108 + 18 * (index - 12) : 306 + 9 * (index - 23);
  const loader = index >= 12 && index < 23 ? "STATIC_LITERAL" : "NONE";
  return {__proto__: null, kind:"EXPORT", start,
    end:start + (index >= 12 && index < 23 ? 18 : 9),
    binding:"NONE", loader, conditional:"CERTAIN", optional:false, computed:false, status:"OPEN"};
}
function __HIVE_P3_unitModel(variant) {
  if (variant !== 0 && variant !== 1) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  __HIVE_P3_debit(23464, 214, 0, "producerWorkBytes");
  const sites = new __HIVE_P3_Array(106);
  __HIVE_P3_setPrototype(sites, null);
  let index, row;
  for (index = 0; index < 106; index++) {
    __HIVE_P3_touch();
    row = __HIVE_P3_unitSite(index); sites[index] = row;
  }
  const S = {__proto__: null, profile:"MODULE", text:__HIVE_P3_unitText,
    sourceIdentity:__HIVE_P3_unitIdentity, producerOccurrences:118, producerParseAttempts:118,
    producerSiteCount:106, producerSites:sites, baseBytes:30000000,
    producerParseBytes:1000000, producerWorkBytes:2282968,
    summaryBytes:variant === 0 ? 90656 : 103520, replayReservedBytes:25165824,
    replayLiveBytes:0, scratchBytes:variant === 0 ? 6667640 : 6654776,
    unreclaimedProducerBytes:0, unreclaimedReplayBytes:0, total:65207088,
    peakBytes:65207088, historicalProducerEntries:10000,
    codecBuffer:null, codecPosition:0, codecLimit:0, sealBody:null, summary:null, hashBuffer:null};
  return S;
}
function __HIVE_P3_unitSafeObservation(value) {
  return __HIVE_P2_integer(value) ? value : null;
}
function __HIVE_P3_unitOutcome(kind, fault, result) {
  if (result !== false) {
    if (kind === "CODEC" && typeof result === "string") return "EMITTED";
    if (kind !== "CODEC" && result === true) return "ADMIT";
    __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  }
  if (kind === "CODEC" && fault === __HIVE_P3_errors.SUMMARY_REFUSED) return "SUMMARY_REFUSED";
  if ((kind === "PRODUCER_DEPTH" || kind === "VERIFIER_DEPTH") &&
      fault === __HIVE_P2_errors.DEPTH_REFUSED) return "REFUSE";
  if (kind === "ENTRY" && fault === __HIVE_P2_errors.ENTRY_REFUSED) return "REFUSE";
  if ((kind === "PRODUCER_DEPTH" || kind === "VERIFIER_DEPTH" || kind === "ENTRY") &&
      fault === __HIVE_P2_errors.ALLOCATION_COVERAGE_OPEN) return "INVALID_ARGUMENT_REFUSED";
  __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
}
function __HIVE_P3_unitReadTail(wire) {
  if (typeof wire !== "string" || wire.length > 16384 || wire.length < 82)
    __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  __HIVE_P3_consume("META", 160, 0, 0, "scratchBytes");
  const at = wire.length - 82;
  let index, code;
  for (index = 0; index < 16; index++) {
    __HIVE_P3_touch();
    if (__HIVE_P3_charCode(wire, at + index) !== __HIVE_P3_charCode(',"summaryHash":"', index))
      __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  }
  for (index = 0; index < 64; index++) {
    __HIVE_P3_touch(); code = __HIVE_P3_charCode(wire, at + 16 + index);
    if (!(code >= 48 && code <= 57 || code >= 97 && code <= 102))
      __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  }
  if (__HIVE_P3_charCode(wire, wire.length - 2) !== 34 ||
      __HIVE_P3_charCode(wire, wire.length - 1) !== 125) __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  return __HIVE_P3_sliceAscii(wire, wire.length - 66, wire.length - 2);
}
function __HIVE_P3_unitObserve(spec, observation, K, S, wire, result, fault, bytesBefore, entriesBefore) {
  const outcome = __HIVE_P3_unitOutcome(spec.kind, fault, result);
  let digest = null, seal = null;
  if (spec.kind === "CODEC" && outcome === "EMITTED") {
    digest = __HIVE_P3_vSha256(wire, false);
    seal = __HIVE_P3_unitReadTail(wire);
  }
  observation.caseId = spec.caseId; observation.kind = spec.kind; observation.outcome = outcome;
  observation.encodedBytes = spec.kind === "CODEC" ? S.codecPosition : null;
  observation.attemptedByteOffset = outcome === "SUMMARY_REFUSED" ? S.codecPosition : null;
  observation.wireSha256 = digest; observation.actualSummaryHash = seal;
  observation.parentIndex = __HIVE_P3_unitSafeObservation(spec.parentIndex);
  observation.modelUsed = __HIVE_P3_unitSafeObservation(spec.modelUsed);
  observation.modelDelta = __HIVE_P3_unitSafeObservation(spec.modelDelta);
  observation.guardAdmitted = spec.kind === "CODEC" ? null : result === true;
  observation.actualBytesBefore = bytesBefore; observation.actualBytesAfter = K.total;
  observation.actualEntriesBefore = entriesBefore; observation.actualEntriesAfter = K.entries;
}
function __HIVE_P3_unitFinish(K, S) {
  try {
    if (K !== null) {
      if (!__HIVE_P2_integer(K.total) || K.total < __HIVE_P3_unitTotal ||
          !__HIVE_P2_integer(K.entries) || K.entries < __HIVE_P3_unitEntries ||
          K.entries > 20000 || K.total > 67108864)
        __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
      if (!__HIVE_P2_finite(K.lastNow) || K.lastNow < __HIVE_P3_unitLastNow ||
          K.lastNow - __HIVE_P3_unitStarted >= 120000 || K.started !== __HIVE_P3_unitStarted ||
          K.ttl !== 120000) __HIVE_P3_abort("TIME_REFUSED");
      __HIVE_P3_unitTotal = K.total; __HIVE_P3_unitEntries = K.entries;
      __HIVE_P3_unitLastNow = K.lastNow;
    }
  } finally {
    try { __HIVE_P3_dispose(); }
    finally {
      if (K !== null) {
        K.ast=null;K.parser=null;K.producerRoot=null;K.producerFrames=null;K.producerScopes=null;
        K.producerBindings=null;K.producerSites=null;K.replayRoot=null;K.replayFrames=null;
        K.replayScopes=null;K.replayBindings=null;K.replaySites=null;K.codecBuffer=null;
        K.hashBuffer=null;K.summary=null;K.sealBody=null;K.text=null;
        K.traversalActive=false;K.replayTraversalActive=false;K.phase="RETIRED";
      }
      if (S !== null) {
        S.text=null;S.sourceIdentity=null;S.producerSites=null;S.codecBuffer=null;
        S.hashBuffer=null;S.sealBody=null;S.summary=null;
      }
    }
  }
}
function __HIVE_P3_unitCase(spec, observation) {
  let K=null,S=null,wire=null,result=null,fault=null,bytesBefore=0,entriesBefore=0;
  let targetStarted=false,failed=false;
  try {
    try {
      K=__HIVE_P3_unitNewK(spec.kind);
      if (spec.kind === "CODEC") S=__HIVE_P3_unitModel(spec.codecVariant);
      bytesBefore=K.total;entriesBefore=K.entries;targetStarted=true;
      if (spec.kind === "CODEC") {result=__HIVE_P3_encodeSummary(S);wire=result;}
      else if (spec.kind === "PRODUCER_DEPTH") result=__HIVE_P3_pGuardChild(spec.parentIndex);
      else if (spec.kind === "VERIFIER_DEPTH") result=__HIVE_P3_vGuardChild(spec.parentIndex);
      else if (spec.kind === "ENTRY") result=__HIVE_P3_guardEntries(spec.modelUsed,spec.modelDelta);
      else __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
    } catch (caught) {fault=caught;result=false;}
    if (!targetStarted) {failed=true;}
    else __HIVE_P3_unitObserve(spec,observation,K,S,wire,result,fault,bytesBefore,entriesBefore);
  } catch (observerCaught) {
    if (result !== false) fault=observerCaught;
    failed=true;
  } finally {
    try {__HIVE_P3_unitFinish(K,S);}
    catch (cleanupCaught) {
      if (!failed && result !== false) fault=cleanupCaught;
      failed=true;
    } finally {K=null;S=null;wire=null;result=null;}
  }
  if (failed) throw fault;
}
function __HIVE_P3_unitValue(out, value) {
  if (value === null) __HIVE_P3_raw(out,"null");
  else if (typeof value === "boolean") __HIVE_P3_raw(out,value ? "true" : "false");
  else if (typeof value === "number") __HIVE_P3_unsigned(out,value);
  else if (typeof value === "string") __HIVE_P3_string(out,value);
  else __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
}
function __HIVE_P3_unitOutput(root) {
  let K=null,out=null,text=null,index,key,row,field,fault=null;
  try {
    K=__HIVE_P3_unitNewK("__OUTPUT");
    __HIVE_P3_consume("META",49408,1,0,"scratchBytes");
    out={__proto__:null,codecBuffer:null,codecPosition:0,codecLimit:16384};
    out.codecBuffer=__HIVE_P3_allocBuffer(16384);
    __HIVE_P3_put(out,123);
    for(index=0;index<7;index++) {
      __HIVE_P3_touch();key=__HIVE_P3_unitRootKeys[index];
      __HIVE_P3_field(out,key,index!==0);
      if(key!=="cases") __HIVE_P3_unitValue(out,root[key]);
      else {
        __HIVE_P3_put(out,91);
        for(field=0;field<20;field++) {
          __HIVE_P3_touch();row=root.cases[field];
          if(field!==0)__HIVE_P3_put(out,44);
          __HIVE_P3_put(out,123);
          for(index=0;index<15;index++) {
            __HIVE_P3_touch();key=__HIVE_P3_unitCaseKeys[index];
            __HIVE_P3_field(out,key,index!==0);__HIVE_P3_unitValue(out,row[key]);
          }
          __HIVE_P3_put(out,125);
        }
        __HIVE_P3_put(out,93);
        index=6;
      }
    }
    __HIVE_P3_put(out,125);
    text=__HIVE_P3_decodeAscii(__HIVE_P3_u8View(out.codecBuffer,0,out.codecPosition));
    if(typeof text!=="string") __HIVE_P3_abort("ALLOCATION_COVERAGE_OPEN");
  } catch(outputCaught) {fault=outputCaught;text=null;}
  finally {
    try {__HIVE_P3_unitFinish(K,null);}
    catch(cleanupCaught) {if(typeof text==="string"){fault=cleanupCaught;text=null;}}
    finally {if(out!==null){out.codecBuffer=null;}K=null;out=null;}
  }
  if(typeof text!=="string")throw fault;
  return text;
}
export function runFixedBoundaryCasesP3() {
  if(arguments.length!==0 || !__HIVE_P3_KERNEL_RELEASED || __HIVE_P3_unitInvoked)
    throw __HIVE_P3_error("ALLOCATION_COVERAGE_OPEN");
  __HIVE_P3_unitInvoked=true;
  let root=null,index,spec,observation,text=null;
  try {
    __HIVE_P3_unitTotal=__HIVE_P2_toolBytes;__HIVE_P3_unitEntries=0;
    __HIVE_P3_unitStarted=__HIVE_P2_clock();__HIVE_P3_unitLastNow=__HIVE_P3_unitStarted;
    if(!__HIVE_P2_finite(__HIVE_P3_unitStarted))__HIVE_P3_abort("TIME_REFUSED");
    __HIVE_P3_unitCharge(6520,42);
    root={__proto__:null,version:1,purpose:"TIP081_P3_BOUNDARY_COMPONENT_ONLY",
      scope:"UNIT_ONLY",parserImported:false,targetExecution:false,realParserDisabled:true,
      cases:new __HIVE_P3_Array(20)};
    __HIVE_P3_setPrototype(root.cases,null);__HIVE_P3_unitRoot=root;
    for(index=0;index<20;index++){
      __HIVE_P3_unitTime();
      root.cases[index]={__proto__:null,caseId:null,kind:null,outcome:null,encodedBytes:null,
        attemptedByteOffset:null,wireSha256:null,actualSummaryHash:null,parentIndex:null,
        modelUsed:null,modelDelta:null,guardAdmitted:null,actualBytesBefore:null,
        actualBytesAfter:null,actualEntriesBefore:null,actualEntriesAfter:null};
    }
    for(index=0;index<20;index++){
      spec=__HIVE_P3_unitRegistry[index];observation=root.cases[index];
      __HIVE_P3_unitCase(spec,observation);
    }
    text=__HIVE_P3_unitOutput(root);
    return text;
  } finally {
    __HIVE_P3_dispose();
    if(root!==null){root.cases=null;}
    __HIVE_P3_unitRoot=null;root=null;spec=null;observation=null;text=null;
  }
}
