# TIP-081A v2 codec/admission allocation inventory

2026-10-07. Synthetic codec/scaffold ONLY. Tests authored, UNRUN by Builder.
Parser/AST/traversal/replay NOT_IMPLEMENTED/UNRUN; ALLOCATION_COVERAGE_OPEN.
The 62 predecessor OPEN obligations and whole-runtime NOT_ACCEPTED are unchanged.

## Input surface and decisions

Contractor approved JSON TEXT ONLY for every public wire/metadata input. Object
holders, boxed strings, proxies, getters, cycles and symbols refuse on primitive
type before reflection or user hooks. The codec's only internal objects come from
the bounded, duplicate-decoded-key scanner plus JSON.parse. No object adoption
helper exists. decodeSourceV2 returns immutable inert data; that data is not a
source/lease authority and cannot be passed back as metadata. Dense-array and
nesting syntax may be scanned but exact v2 schemas contain no arrays and reject it.
Codec schema validation precedes canonical/hash body construction. All hash
scratch fits the fixed admitted codec envelope; no body Buffer is assembled.

The fixture-byte entry accepts only an exact, nonproxy, nonshared Uint8Array.
Typed-array intrinsic getters and copy are captured at module initialization.
The full original backing ArrayBuffer byte length PLUS private copy length is
charged, not merely twice the visible view. No bytes, decoded source text, AST or
callback escapes. Synthetic metadata is declared fixture data, not authenticated
v1/current-filesystem identity. Its seal and bytes/hash/unit agreement do not mint
real authority. Real-mode descriptor codec data may exist, but synthetic creation
refuses it; real accepted receipts always ALLOCATION_COVERAGE_OPEN.

Synthetic pins are SHA256 UTF8 of these fixed domain labels:

- adapterHash: `TIP081_V2_SYNTHETIC_ONLY_DISABLED_ADAPTER_V1`.
- allocationAuditHash: `TIP081_V2_SYNTHETIC_ONLY_CODEC_INVENTORY_V1`.

They are NOT hashes of an implemented adapter or complete allocation audit.
V2_SYNTHETIC_PINS exports their fixed deterministic hashes; real grammar/package
pins are literal design pins. No caller-selected profile/pin/cap is admitted.

## Logical conventions

Wire UTF8 bytes <=16384, depth<=128, fields/object<=64, visited values<=4096;
key<=2048 units, scanner string<=8192 units. The schema tightens individual strings.
Native parse, scanner/key tables, canonical output, copied keys, string escapes,
sorting scratch, hashing state and overlapping temporaries share a guarded
524288-byte logical codec envelope. The convention uses a 65536-byte
metadata/control reserve and 65536-byte tool/native-fixed reserve per owner.
These are documented logical costs, not measured V8 object sizes or OS RSS bounds.
An actual parser's costs/audit are NOT derived from these constants.

### Numerical codec derivation and dynamic guard

The scanner owns a monotone `budget.used` counter. `charge` uses subtraction
before addition and refuses CAP_REFUSED BEFORE each enabled dynamic site. No
scanner or canonical temporary is refunded before the public codec call returns.
The integer ledger is NOT a measured native heap counter. Its explicit convention:

- Initial fixed65536 = frames16384 (128*128 bytes) + bounded reflection/schema
  arrays16384 + trusted hash/error/native fixed state32768 (four8192 contexts,
  including small digest/error control; explicitly logical costs, not measured
  OpenSSL allocations).
- Initial text payload allowance `8*text.length` = four disjoint UTF16 copies at
  2 bytes/unit: original input representation, token-slice payload, decoded scanner
  key/value payload, and decoded owned-tree string payload. Tokens are disjoint
  slices of the admitted input, so their summed unit length cannot exceed input
  units. Initial total <=65536+8*16384 =196608.
- Every scanned value reserves64 for the future owned JSON value/container plus
  its parent slot. Every object additionally reserves64 BEFORE constructing its
  scanner Set. Every property reserves96 = Set entry32 + future property32 + key
  header32 BEFORE key scan/insertion. Every token-string parse reserves an extra32
  for its scanner decoded string header BEFORE slice/JSON.parse.
- Canonicalization first independently measures canonical bytes `B<=16384` and
  counts flat output tokens `T`. BEFORE the `pieces` array/write/join/hash, it
  reserves `4096+6*B+40*T`: key sorting/filter arrays4096 (exact schema has fewer
  than128 total keys; three arrays*128*8 plus512 headers <=3584), token payload2B
  + final string2B + UTF8 hashing/encoding scratch2B, and each token header32 plus
  array slot8. `pieces` has exact
  preallocated T slots and indexed assignment, so no backing resize or old/new
  capacity overlap. Canonical construction is flat pieces plus one join, NOT a
  recursively assembled map/join tree. All canonical calls share the same budget.
- Maximum canonical calls per receipt operation is4: profile, descriptor body,
  named-seal body, final wire. Descriptor/refusal have2. Their exact measured costs
  accumulate; overlapping prior strings/arrays are not presumed reclaimed.

Therefore every accepted codec call satisfies the executable inequality:
`65536 + 8*N + 64*V + 64*O + 96*K + 32*S +
 SUM_i(4096 + 6*B_i + 40*T_i) <=524288`,
where N=input units, V=visited values, O=objects, K=property keys, S=string tokens.
The separate wire/node/field/depth ceilings are simultaneous caps; they are not a
promise that all nominally cap-sized objects fit scratch. A wide malformed object
can honestly CAP_REFUSE sooner. Complete scanner reservations precede the whole
native JSON.parse; canonical growth beyond16KiB or scratch refuses BEFORE assembly
and hash. Standalone profile hashing has a finite literal profile and the same
canonical guard; no caller profile object is adopted. Physical native allocator
sizes/RSS are outside this explicitly charged logical convention.

Owner initial fixed reservation=655360. Source adds full caller backing bytes +
private visible bytes +2*declaredUTF16Units (decoded text reservation, although no
decoded string is constructed). Capacity is fixed1048576; scalar nodes200000,
sites128, depth128 and lifetime120000ms apply independently. An exact primitive
third constructor argument may shorten only SYNTHETIC lifetime to1..120000ms;
arity2 uses120000. Objects/callbacks/undefined are not accepted as that third
argument. The clock is captured/bound from node:perf_hooks at module initialization,
not dynamically read from mutable global performance. Source DFA counts
UTF16 units from the owned bytes, without decoding a text object. Open lease adds
512 control bytes; each public metadata read adds4096 output bytes BEFORE copying
the ledger. Shared frozen descriptor aliases are charged once in base; each new
view/ledger has its own monotone output charge. Repeated reads can CAP_REFUSE.
Parser-off refusal output reserves65536 within an active owner before codec use.

Every active-owner reservation is monotone across source/producer/replay and
refusals. Producer retirement moves a disjoint charge into unreclaimedProducerBytes;
it never reduces the total or peak. No GC/reference-disposal refund occurs within
an envelope. Full owner retirement ends that logical envelope, removes private
references and invalidates brands; a future synthetic owner has a new envelope.
This is NOT process-cumulative physical memory or immediate-GC certification.
Aggregate execution budget is a separate Main-controlled historical900000ms
ceiling; no owner creation resets that budget. Runtime entry always refuses and
cross-version exclusion remains UNKNOWN_NOT_AUTHORITY.

## Exact enabled site inventory

| Site (module/function) | Pre-growth guard/reservation and bound | Lifetime / alias rule | Authored fixture |
| --- | --- | --- | --- |
| Codec module constants, SHA pin digest state, profile factory, typed errors | Fixed tool/control convention65536; finite literal tables/profile/error codes only; hash/whitespace/hex/digit/path regex objects and three JSON literal strings are module constants | No regex construction per character or literal array/iterator construction per visited value; indexed constant-literal scan; error text fixed, no source/stack in wire | V212,V215,V216 |
| Codec `parse` input scan | Primitive string, units<=16384 then countedUTF8<=16384 before slice/Set/parse; fixed codec524288 | Caller string plus inspector state admitted together; no reflection over caller objects | V206,V207 |
| Scanner recursion, literal loop | Before depth129 or value4097; each value64; fixed frames16384 | Control frames in fixed reserve; monotone heap scratch no refund | V208,V209 |
| Scanner key token slice, JSON string parse, name Set | Entire input16KiB admitted; field65 rejected before key insertion; decoded key<=2048; duplicate decoded keys denied | Per-object Set<=64; original input, sliced token and decoded key coexist in scratch | V205,V208 |
| Scanner value-string parse | Input<=16KiB; decoded string<=8192; exact schema tighter | Input/token/decoded string overlap reserved, no Unicode normalization | V201,V207,V209 |
| Scanner number slice/conversion | Input16KiB admitted; lexical integer then safeU/-0 validation | Number token scratch bounded; no target BigInt/RegExp | V209 |
| Codec whole `JSON.parse` owned tree | Complete scanner success BEFORE parse; nodes4096/depth128/fields64 and16KiB input | Owned objects only; caller object/proxy never enumerated | V204–V209 |
| Schema keys/scalar path scan/ledger categories/descriptor body | Only bounded owned tree; exact own keys/schemas; strings capped; integer subtraction-before-addition | Per-object key arrays<=64; path segment checks use scalar indices/charCode only, no split/substring/component arrays; temporary descriptor shares immutable binding | V210–V214,V233 |
| `measure` and `canonical` key/sort/pieces/join/JSON escaping | Exact schema; counted bytes<=16384 and charge4096+6B+40T BEFORE pieces/write/hash | All canonical invocations accrue overlap; fixed-capacity token array/no resize; one join; sort code-unit lexical | V201–V203,V207,V232 |
| Canonical SHA state and hex output | Only premeasured canonical input; three seals plus profile seal bounded by codec envelope | sourceHash never replaced; only named seal omitted | V202,V203,V212 |
| `freeze` traversal; decoded output | Scanner and exact-schema bounded tree only; frozen recursively in place | New owned wire tree immutable; output is data, not source capability | V201,V206 |
| Admission intrinsic inspection | Nonproxy exact Uint8Array prototype; nonshared backing; intrinsic lengths safe and<=cap | External backing parent represented fully in source reservation; detached input native failure maps to typed schema refusal | V221,V222 |
| Admission Q/state/control construction | Fixed initial655360 logical preflight; no data from arbitrary object | Per-owner private state, WeakMap entries and opaque handles inside65536 control | V217,V218,V219 |
| Admission descriptor decode and retain | Codec524288 already in Q BEFORE decode; metadata/control65536 | Parsed frozen descriptor retained; no caller metadata-object alias | V217,V220,V221 |
| Admission private Uint8Array | Safe parent+copy and decoded reservation subtraction checks BEFORE constructor/set | Exact visible-length independent copy; caller parent charged; owned bytes never exported | V217,V220,V222 |
| Source hash / UTF8 scalar DFA | tool/native65536 + scratch524288; source reservation prior hash/DFA; nextCheck thresholds every<=1027 bytes | No source text; captured trusted clock; scalar counts/hash64hex | V217,V220,V226,V229 |
| Lease handle / WeakMap entry | base+512 BEFORE construction; single active owner/lease, trusted deadline | Exact same-module handles only; no copied/foreign/proxy authority | V218,V219,V228 |
| Metadata read result and Q spread | output+4096 BEFORE new immutable view/ledger | Each output charged; descriptor shares previously charged frozen data, no source alias | V217,V223,V224 |
| Scalar request parse | Primitive text<=256; exact lexical four-field grammar BEFORE JSON.parse; codec/control reservation | No getters/hooks/injected clocks; safe integer request only | V225,V228 |
| Synthetic reservation and producer-retire transition | Validate byte cap/counters before mutation; category allowlists; no arrays/parser allocations | Retired category moves to unreclaimed, no refund/duplicate charge | V223–V225 |
| Parser-off refusal builder/codec | Active owner output+65536 before JSON stringify/seal; unowned runtime refusal finite fixed template | No accepted receipt issuance. Analysis finally closes/retire even deadline/refusal | V215,V226,V227 |
| Close/retire output | Fixed literal strings, no object copies; preplanned control capacity | Expiry ignored only for authenticated cleanup; deletion invalidates handles, no renewal | V218,V226,V227 |

Expiry controls await40ms under a20ms primitive synthetic TTL, with no clock
spoofing or120s waits. V229 verifies post-import global clock hooks are not invoked.
V230 rejects hostile TTLs; V231 rejects another new-module instance's opaque handles;
V232 exercises literal lone-surrogate canonical expansion beyond the wire cap.
V233 uses three valid2047-unit paths with1024 slash-separated components each;
the segment validator does no per-component string or array allocation. Empty,
dot/dotdot, absolute and forbidden path semantics remain unchanged.

Native allocator internals, module-loading internals and trusted primitive runtime
operations are common-mode logical-convention assumptions, not a physical hard
sandbox. Public APIs accept no allocation hooks, clock injection or plugins.
Runtime refusal cannot prove prior v1-owner retirement or prevent hostile v1
importers; actual cross-version coordinator/driver evidence is absent.

## Parser precursor (NOT enabled; NOT full adapter audit)

Pinned parser sites requiring later exact guards: startNode/startNodeAt/copyNode;
parseExprList/body-array growth; enterScope/declareName/binding arrays;
readString/readWord1/readTmplToken derived strings; parseLiteral raw/BigInt text;
readRegexp native validation/construction; next Token before callbacks. Plus all
recursion/control/private-name/label stacks, resized backing old/new overlap,
producer summary, traversal/dedup and independent replay allocations.
This precursor list licenses none of them. Stock parser is not imported/invoked.
No full adapter admission, actual source acquisition/parse, real replay, graph
closure, authority grant or mathematical closure follows from synthetic tests.
