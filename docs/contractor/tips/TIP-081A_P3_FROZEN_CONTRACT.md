# P3 implementation contract — pre-code freeze

2026-10-08 · SAME081D8 · Owner approved revision2 P3, R1–R8/P301–P336.
Main settles within-contract details here. Product code waits for independent
design CLEAR. This is synthetic-only; predecessor P2 and real v2 are frozen.

## Exact public operations and lifecycle

Six exports, with exact arity checked before reflection:

| Operation | Arity | Result / transition |
| --- | --- | --- |
| createSyntheticSummaryP3(text, mode, cap, ttl) | 4 | Opaque frozen brand; SOURCE_READY |
| analyzeSyntheticSummaryP3(handle) | 1 | Canonical summary JSON text; PRODUCER_SUMMARY |
| retireProducerSummaryP3(handle) | 1 | Fixed string; PRODUCER_AST_RETIRED |
| verifySyntheticSummaryP3(handle, wire) | 2 | Bounded scalar metadata JSON text; VERIFIED |
| observeSyntheticSummaryP3(handle) | 1 | Bounded scalar metadata JSON text, no renewal |
| retireSyntheticSummaryP3(handle) | 1 | Fixed string; RETIRED, including after expiry |

Primitive text/mode only; SCRIPT/MODULE; safe nonnegative cap<=67108864;
ttl1..120000; no caller object/options/callback/URL/hash/path/fault input.
Authentication by exact same live handle/WeakMap identity precedes owned mutation.
Bad arity/foreign objects cannot revoke a valid owner or invoke getters/coercion.
One active owner, same module instance. Error singletons expose code and
realParserDisabled:true only; preserve existing refusal codes and add
PHASE_REFUSED, ALIAS_REFUSED, SUMMARY_REFUSED, REPLAY_MISMATCH,
VERIFY_RESOURCE_REFUSED. Owned operational errors dispose all roots; no prefix.

Before verify, independently check phase and ALL producer root slots: ast, parser,
producerRoot, producerFrames, producerScopes, producerBindings and traversalActive.
Retirement clears their transitive references/arrays and nulls slots; stack locals
have returned before the public retirement call. Replay has separate root/frame/
scope/binding slots, disposed BEFORE VERIFIED output. Weak metadata is not a
strong global node catalogue; audit any metadata value/closure that can retain
nodes. No claim of immediate GC.

## Exact data wire and syntax taxonomy

Version1; purpose TIP081_P3_SYNTHETIC_SYNTAX_SUMMARY. Top-level keys in the
following exact order, no extensions:
version,purpose,mode,profile,syntheticUtf16Hash,utf16Units,astOccurrences,
grammarAttempts,sites,ledger,summaryHash.
profile=P3_ECMA15_FIXED19_COMMON_GRAMMAR. Hashes64 lowercase hex.
syntheticUtf16Hash=SHA256 of exact little-endian16-bit code units, including lone
surrogates, no normalization/replacement. It is NOT authentic UTF8 sourceHash.
summaryHash=SHA256 of ASCII canonical JSON body omitting only summaryHash, then
append summaryHash last. Arrays preserve canonical order, integers shortest decimal
U excluding -0/unsafe/fractional. No raw source/name/specifier/AST/path export.

Site exact field order: kind,start,end,binding,loader,conditional,optional,computed,
status. kind IMPORT/EXPORT/DYNAMIC_IMPORT/CALL/NEW/MEMBER. Emit every corresponding
AST occurrence, including ExportNamed/Default/All, not just source-bearing exports.
Canonical ascending (start,end,kind ordinal above), stable per-occurrence order for
equal tuples. Shared shorthand AST nodes count per reachable edge; grammarAttempts
is separate attempted allocation count including tentative work.
start/end are source UTF16 offsets, 0<=start<=end<=utf16Units.
binding NONE/NO_LOCAL_BINDING/LOCAL_BINDING/AMBIGUOUS; loader NONE/STATIC_LITERAL/
DYNAMIC/BARE_REQUIRE/EVAL/FUNCTION/OTHER/COMPUTED; conditional CERTAIN/
CONTROL_OR_DEFERRED/OPTIONAL. optional/computed boolean; status always OPEN.

Complete supported AST child coverage: independently authored producer/verifier
child schemas or bounded trusted-own enumeration of ALL children, with unknown
node kinds refusing before extraction acceptance. Binding collection includes
import/var/let/const/function/class/params/catch/destructuring. Conservative global
name collection MAY mark any declared reference AMBIGUOUS rather than claiming a
lexical scope proof; it must never mark a locally declared/shadowed name unbound.
For genuinely undeclared names use NO_LOCAL_BINDING, still OPEN. Function/class/
branch/loop/logical/conditional/try uncertainty propagates CONTROL_OR_DEFERRED;
optional chain propagates OPTIONAL. Bare require/eval/Function classify syntax,
not privileged authority. All unknown calls/computed/native/file resolution OPEN.
No target RegExp/BigInt or unsupported P2 syntax branch is enabled by P3.
CERTAIN means only absence of syntactic control/deferred/optional ancestors,
never guaranteed execution. NO_LOCAL_BINDING means only no syntactic declaration
in the complete conservative inventory, not an ambient loader/builtin authority.
Visits<=200000 per stage, counted per edge including reused nodes; reject a cycle
on the bounded current-ancestor path, do not globally dedup occurrences. Binding
storage<=512 names and65536 cumulative UTF16 name units per stage; exhausting it
refuses, never publishes an incomplete declaration inventory.

Ledger exact U fields/order: baseBytes,producerParseBytes,producerWorkBytes,
summaryBytes,replayReservedBytes,replayLiveBytes,scratchBytes,
unreclaimedProducerBytes,unreclaimedReplayBytes,totalBytes,peakBytes,
producerEntries,producerAttempts,siteCount.
The wire is captured at PRODUCER_SUMMARY. Verifier independently reconstructs
that historical arithmetic from authenticated initial categories, separately
parsed common-grammar operation deltas and independent extraction counts/known
cost rules; wire totals/phase/seal alone never authorize success. Current metadata
reports current category sum and historical maximum, not summed category maxima.
Common allocator deltas are repeatability evidence, NOT independently verified
grammar allocation correctness. Label this dependency explicitly.

Metadata exact27 keys/order: version,purpose,mode,phase,totalBytes,peakBytes,
producerParseBytes,producerWorkBytes,summaryBytes,replayReservedBytes,
replayLiveBytes,scratchBytes,unreclaimedProducerBytes,unreclaimedReplayBytes,
attemptedNodes,internalEntries,siteCount,grammarPasses,metadataEmissions,
semanticCoverage,allocatorCoverage,graphStatus,predecessorOpen,
fullRuntimeClosure,execution,materialization,realParserDisabled.
version1; purpose TIP081_P3_SYNTHETIC_METADATA; primitive enums/U/booleans only.
At most32 metadata emissions per owner, INCLUDING successful verify and observe.
Each consumes its own pre-reserved object64+16*27, string32+2*4096, UTF8 buffer4096.
Exhaustion VERIFY_RESOURCE_REFUSED disposes owner before another representation.
Analyze emits exactly one summary with two prepaid body/wire representations;
retire operations emit only shared fixed strings, no per-call representation.

## Decoder/output and cost/lifetime rows

Wire<=16384 UTF8 bytes, no BOM/whitespace/duplicate/extra fields/noncanonical keys;
preflight exact encoded size before decode/clone/hash. Decoder depth<=8,
objectFields<=16,arrayLength<=512,totalValues<=8192,stringUnits<=128. Site count
<=512 and inherited cumulative internal memberships+sites<=20000; byte limit may
refuse earlier. These are limits, never a truncation policy. Independent verifier
decoder/preflight/canonicalizer must not call producer equivalents. Bounded scalar
preflight validates duplicate keys/structure before native no-reviver JSON.parse.
No caller objects are reflected. Raw JSON/native errors never escape.
Wire strings are closed ASCII literals/enums/hash64 only, with no escapes or
arbitrary free text. Captured-charCode scalar preflight checks exact keys/order/
punctuation/numbers/array counts/structure before any token slice/JSON.parse/hash.
Decoded objects/arrays are null-sanitized before reads/writes; source identities
have independently authored explicit UTF16-unit streaming implementations.

Costs below are LOGICAL conventions/capacity policies, NOT V8/native/RSS sizes:

| Row | Pre-operation charge/reservation and lifetime |
| --- | --- |
| C00 | Inherited exact reviewed grammar static/workspace sites; source4*units+header32 and expanded control slots64+16*actualFields+handle96+weakrow32 |
| C01 | Every new fixed literal/property key32+2*units, module binding16, ordinary function/prototype192, captured bound function96, weak header96; derive exact source-site inventory before import |
| C02 | Helper frame64+16*(locals+parameters), inventory every direct helper; bounded128 re-entry, itemized max coexistence, no anonymous whole-function cushion |
| C03 | Before first parse reserve replay allocation family capacities: NODE_SCHEMA8MiB, ARRAY_BACKING4MiB, DERIVED_STRING4MiB, CALL_FRAME4MiB, BOOKKEEPING4MiB. They are consumable policy ceilings, NOT estimates of a whole parse. Each actual grammar operation retains inherited cost formula and consumes only its mapped family; exhaustion refuses before allocation. No guaranteed fit for every producer-success source |
| C04 | Traversal frame64+16*actualFields; list88+8*capacity; keys32+2*keyUnits plus vector backing; object64+16*fields. Producer/replay separately reserve their bounded128-frame/storage capacities before construction; only bounded frames, no all-node array |
| C05 | Site object64+16*9 + array slot8 (=216/site), each stage capacity512; membership charged at actual use before growth, cumulative not refunded |
| C06 | Binding table/list costs as C04; private name copy32+2*units, copied/concatenated backing charged before work. Any fixed capacity must state concrete slots/units and deny exhaustion; no hidden unbounded scope table |
| C07 | Summary string32+2*16384, seal body same bound, UTF8 buffer16384, hash native-state logical4096, source-hash chunk buffer2048. Reserve itemized producer+verifier counterparts before first parse; unused escrow remains charged |
| C08 | Decoder value records<=8192 each max64+16*16; index backing88+8*8192; duplicate-key scratch explicit bounded fields/depth, string backing<=2*16384. Reserve BEFORE parse/decode/clone/hash. Guard counts BEFORE child growth, reject noncanonical/duplicate keys without unbounded native work |
| C09 | Output metadata64+16*actualFields plus bounded JSON string/UTF8 scratch<=4096 each; fixed errors64+16*2 each; reserve all permitted emissions before first parse, no repeated uncharged observation |
| C10 | Escrow consumption transfers exactly once into live category. Retirement transfers ONLY relevant live categories into unreclaimed without refund/reset/double-count. Source/tool/summary remain live, replay allocation additive; category sum=monotone total and peak, original TTL/counters retained |

C03 family mapping is closed: NODE_SCHEMA=node/object backing and schema/dictionary
slots; ARRAY_BACKING=list/vector backing and resize overlap; DERIVED_STRING=slice/
concat/key spelling/conversion strings; CALL_FRAME=argument/frame/closure creation;
BOOKKEEPING=metadata/weak membership/descriptors/sanitization/depth-queue controls.
Every inherited reserve occurrence needs explicit source mapping; unknown/ambiguous
cost cannot consume a convenient family or borrow another family's quota.

### Within-contract concrete C04 node capacity choice (before product traversal)

Main approves8168 logical bytes per reachable AST occurrence as itemized finite
key/read capacity: key-vector88+8*32=344; key strings32*32+2*512=2048;
vector sanitization16; at most40 descriptor reads*(128+16)=5760.
Check own AST key count<=32,keyUnits<=512 and reads<=40 BEFORE work. Unused quota
stays charged. Front reconstructs this cost independently as8168*occurrences plus
the separately itemized fixed frames/sites/bindings, not producer helper traces.
This is not a guessed whole-function reserve or a physical-size claim.
Array containers are trusted private dense arrays, not AST node key dictionaries;
do not impose32 keys or40 children on an array and thereby silently shrink the
pinned supported grammar. Array-element/edge reads must be separately itemized or
precisely assigned to each child node's finite read quota; unknown work refuses.

Producer uses two complete passes (declarations then sites), independently counted
equal N AST occurrences/A array slots. Fixed producer capacity304440:
42088=128*(64+16*16)+(88+8*128)+16 frames;
151656=(88+8*512)+16+512*32+2*65536 bindings;
110696=512*216+88+16 sites. Historical producerWorkBytes is independently
reconstructed as304440+16336*N+288*A. Each array-slot descriptor consumes144 per
pass; no array fanout cap. Both pass visit/read counters are enforced before
growth and must agree; cumulative producer visits2*N<=200000. Unused per-node
and fixed capacities remain charged, not refunded. Verifier has its own separately
itemized traversal/work costs, not an assumption of identical helper behavior.

### Within-contract concrete verifier capacities (before decoder/traversal)

Main approves VERIFY_CODEC3612704 from named capacities:
8192*320=2621440 records;88+8*8192+16=65640 index;
32768 strings;88+8*(8*16)+16=1128 duplicate-key stack;
5150*144=741600 descriptors;512*96=49152 index spellings;
515*16=8240 object sanitizations;92736 two-hash/body/wire/buffer/view overlap.
These rows must correspond to actual source operations, no hidden allocation.
VERIFY_WORK2542904=304440 fixed traversal/binding/site capacity+
256*8168 node visits+1024*144 array-slot reads. These are finite permitted
allocation capacities, not acceptance of the first256 nodes. If complete traversal
cannot fit, VERIFY_RESOURCE_REFUSED before growth, dispose, no accepted prefix.
Inherited larger grammar/node/entry/depth ceilings remain simultaneous bounds.

New P3 helper workspace must be independently bounded from its actual call graph,
separate from inherited P2's2*129 segment argument. Iterative private traversal
storage is C04, not automatically128 JavaScript recursive helper invocations.
Do not multiply all new helpers by258 without a proof, or lower a multiplier to
force fitting. Record each reachable re-entry/SCC/path and coexistence factor.

### Pre-effect privacy repair / same wire contract

Non-own source review found native Node Hash wrappers can traverse mutable host
prototypes and handle methods; capturing update/digest alone does not establish
private-source noninterference. Main routes independently authored bounded pure
JavaScript SHA256 implementations for producer/verifier source identity and ASCII
seal. Direct captured-charCode processing of exact UTF16 units; guarded private
uint32 state/block/word capacities under named4096 hash workspace, not raw source
buffers/views passed through native Hash objects. Hash outputs/schema stay exact.
Every new word/backing/helper/constants allocation remains source-inventoried.

ASCII metadata decoding may use a captured closed TextDecoder bootstrap with an
explicit4096 logical context row, closed fatal/ignoreBOM options and no caller
input. Views use captured native TypedArray backing/offset getters plus an exact
new captured Uint8Array view (48 logical bytes), not species-sensitive subarray or
Buffer wrappers. Final concrete codec/metadata consumption must be reviewed and
frozen before effects; unused approved capacity stays charged. No cap reduction
or implicit credit to force fitting.

Tool/admission hashing of fixed public artifact bytes remains under clean trusted
bootstrap assumptions; no claim against hostile arbitrary mutation of Node's
internal crypto handles. Private source never enters those tooling hash paths.

### Concrete codec amendment after non-own source findings, before effects

Main freezes SUMMARY_CODEC92736 policy unchanged; actual pure producer SHA/ASCII
codec consumption90656: source SHA state/work4096+hex160; encoding backing16384+
header64+body/wire strings65600+seal SHA4096+hex160+two safe views48 each=86400.
Unused2080 remains charged scratch, not relabelled summary or borrowed elsewhere.
Metadata per emission12864=496 object+8224 string+4096 backing+safe view48;
max32 gives411648. Initial scratch6659992; at PRODUCER_SUMMARY historical
summaryBytes=90656+12864*M and scratchBytes=6569336-12864*M, where M is the
authenticated pre-summary metadata-emission snapshot, not a wire assertion.
Initial replay/work/source/deadline/node/entry ceilings stay unchanged.
Verifier's itemized codec3564360 must fit unchanged3612704 capacity; unused48344
stays charged. Source inventories/reviews must bind every component before effects.

Masked control obligations remain OPEN: a P2 AST-depth refusal is not P3 traversal
guard evidence, and a16384 input-decoder boundary is not an accepted producer
summary boundary. No internal fault result silently replaces normal reachability
evidence or changes the all36-control acceptance gate.

### Native numeric-key conversion repair, before effects

Peer allocation review identified missing96 logical numeric-to-property-key cost
before native Object.getOwnPropertyDescriptor(array,index). Array-slot capacity
is therefore240=96+128+16 per pass, not144. Historical producer work is
304440+16336*N+480*A. VERIFY_WORK becomes2641208=304440+256*8168+1024*240;
increase98304 remains inside the unchanged64MiB ceiling, with no fit promise.
Initial scratch6758296; historical scratch6667640-12864*M; summary consumption
90656+12864*M unchanged. Source rows/counters/formulas supersede earlier array
costs while preserving the finding history. Input decoder numeric-index spelling
capacity is512*96=49152, not merely3072 payload bytes; verifier consumes46080 more
from its unchanged3612704 codec quota, total3610440, remaining2264 charged/unused.
No parser/check has run; this repairs accounting before growth, not a test waiver.

Concrete source-derived C00/C01/C02 values and C04/C06 storage choices must be
present in source inventory and independently reviewed before effects. Builder
cannot invent unknown costs, exceed these limits or replace formulas by an opaque
reserve. Subtraction-before-addition safe-integer checks precede allocation.

## Derivation and test-only alias fault

New fixed derivation uses accepted checked P2 candidate as TEXT; verifies exact
P2 tuple before replacing only its reviewed runtime prefix and cost prelude.
Grammar/scalar initializer suffix remains BYTE-FOR-BYTE unchanged. New inventory
binds old grammar map/hash plus explicit offset delta, new runtime/source/cost
rows and full emitted delta review. No installed parser invocation or old patch.
New normal admission tuple/profile issued by Main only after emitted review.

R311 has a distinct fixed negative-control derivative: one reviewed retirement
clear is replaced to retain producerRoot while phase legitimately advances to
PRODUCER_AST_RETIRED. Fixed zero-arg test-only loader, separate purpose/profile/
pins, normal admission rejects its tuple. NO caller fault flag/path/callback and
NO possible VERIFIED output from the fault. Verify checks all alias slots before
second parser construction: expected ALIAS_REFUSED then stale authority refusal.
This actually exercises alias denial, separately from R310 phase denial; all
mutation bytes/deltas reviewed before a test import.

## Verification / authority

Separate producer and verifier Builders; non-own source review. Main alone owns
capture/derivation/hash/import/check effects. Complete first cuts retained before
effects; emitted suffix equivalence/pins checked; no effects until source CLEAR.
All36 controls and named variations required for READY. Exact wire/depth/cap
boundary fixtures must discriminate that axis; masked/refused fixtures remain
unclosed, not broadened to any error. No auto retries or old-suite reruns.
Output semanticCoverage=OPEN_COMMON_GRAMMAR_RISK, allocatorCoverage=COMMON_MODE,
graphStatus=OPEN, predecessorOpen=62, fullRuntimeClosure=NOT_ACCEPTED,
execution=false,materialization=false; synthetic acceptance only.

Start867323.494582/900000ms; remaining32676.505418; incremental effects<=25000ms
INCLUDING every wrapper/child1000ms allowance; unit hard timeout<=8000ms.
Main reserves concrete commands before each effect. Budget does not reset.
No protected attempt5/grant/failed-root/.env/actual source/native scans, target
eval/import, API/server/build/E2E/Git mutations/math/P4/P5. Stop at scoped P3 or
concrete coverage/resource refusal; material departures require human routing.

### C03 mapping clarification before first inert derivation

Vector BACKING, including argument-vector backing, consumes ARRAY_BACKING;
actual helper-frame/function/closure storage consumes CALL_FRAME. These distinct
operations are not charged twice because of the earlier broad word "argument".
No family borrowing, component-cost change or quota change is authorized.
