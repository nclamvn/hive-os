# P3 R3 harness mapping — independent source-only review

2026-10-08 · SAME081D8 · Back reviewer · MAPPING_REPAIRS_REQUIRED.

Active milestone is P3_SYNTHETIC_PRIVATE_SUMMARY_REPLAY, engineering R3. This
bounded review addresses assertion preservation and a possible inert-core source
seam, NOT parser FIT, executable port acceptance or authority. Read the complete
original `tests/unit/private-summary-tip081-p3.test.ts`, TOOL_PRECODE, current
metadata-baseline helper and its BASELINE_FREEZE/SOURCE_REPORT, R3 design and
latest handoff/ACTIVE. Read only named normal classifier/schema/retirement regions
and checked-P2 import/finishNode anchors as needed. No effects/hashes/imports/
parsers/checks/derivation/tests/protected-source/tree/Git/API/network actions.
Only this report is authored. Product/predecessor source is unchanged.

## 1. Five inherited expectation fields require explicit Main L2 repair

These are assertion defects, not requested product changes. Preserve their exact
old source in R2 history; do not label R2 PASS. Main must record the old→correct
map before port. Correcting an impossible span and aligning the existing frozen
classification semantics is a narrow requirement-preserving repair, not a new
fixture, dropped assertion or strategic acceptance revision.

| Scenario / exact source | Old field | Correct field | Named source evidence |
| --- | --- | --- | --- |
| P305.IMPORT / `import x from "m";` | IMPORT.end18 | end17 | Literal has17 UTF16 units; checked-P2 parseImport2770–2787 consumes semicolon at2785 then finishNode2786; finishNode4590–4593 passes lastTokEnd to finishNodeAt, which writes end at4581–4582 |
| P305.MEMBER_CALL / `obj.run();` | MEMBER.binding NONE | NO_LOCAL_BINDING | Producer localBinding317–322 and site362–364; independent verifier vBinding205–212 and vSite229–234 bind identifier object `obj`; no declaration exists |
| P306.OPTIONAL / `obj?.run?.();` | MEMBER.binding NONE | NO_LOCAL_BINDING | Same two independently authored classifier paths; optional remains true/OPTIONAL, not a binding exemption |
| P306.COMPUTED / `obj["x"]();` | MEMBER.binding NONE | NO_LOCAL_BINDING | Same identifier-object classification; MEMBER loaderCOMPUTED/computedtrue unchanged |
| P306.COMPUTED / same source | CALL.computed false | true | Producer357–358 inherits callee MemberExpression.computed; independent verifier236–237 does so for non-MEMBER target; both loaderCOMPUTED |

All classifier anchors above refer to the current `.r3.mjs` producer/verifier
templates. Their bodies agree on these values; this is not expectation masking
of a producer/verifier divergence. CALL.binding stays NONE in these member-call
examples. Other optional/computed/conditional/span fields stay unchanged.
The separate literal `export * from "m";` has18 units and its expected end18 is
correct; do not apply the import repair indiscriminately to exports.

Manual named-fixture comparison found no additional interval/length discrepancy
in the P305/P306/P307 table. Import binding source24 units before the trailing
call, function-parameter calls20..32/34..46, class-new17..34, optional member0..8/
call0..12 and computed member0..8/call0..10 are consistent. This is source-only
literal arithmetic, not observed parser results or a general grammar proof.

## 2. Coverage and predecessor assertion disposition

The registry's36 IDs and205 rows reconcile as181 NORMAL/input/admission,
20 COMPONENT and4 SOURCE. Source rows are P319.C_SOURCE, P321.C_P2_LINK,
P321.C_P3_CALLS and P322.C_COUNTER_CALLS, never unit PASS. Twenty kernel IDs and
their fixed inputs agree with the frozen kernel registry; no second denominator
or hidden21st case is proposed. Aggregate row arithmetic is the frozen table,
not freshly executable counting.

Full predecessor comparisons, including its helpers/loops:

- P301–P304 preserve frozen/symbol observations, exact opaque/foreign/arity
  refusals, zero getter/coercion/proxy touches, surviving valid owner and cleanup.
- P305–P307 preserve full site object equality, original specified per-edge N,
  independent LE-UTF16 hash/sourceUnits and Unicode pair postconditions, subject
  only to the five explicitly recorded expectation repairs above.
- P308 retains all ten raw noncanonical transformations plus resealed wrong
  purpose; exact named refusal, stale and drop are retained. Assert each fixed
  replacement actually changes its intended token before invoking the product.
- P309–P318 retain original phase/pass/retirement/no-refund/stale assertions and
  every literal coherent omission/duplicate/span/classification/source/mode/
  length/N/attempt/seal mutation. GROSS_SEAL remains deliberately unresealed.
- P319's producer-base/search/chosen/non-null/shorter/EVAL→OTHER construction is
  explicitly replaced by the approved R3 fixed independent MODEL pair, not
  silently ported or claimed passed. Exact input16384/+1 assertions remain in
  their INPUT lane; actual component writer assertions are additional scoped
  evidence. Historical normal-producer reachability stays OPEN.
- P320 retains exact cap reference/exact/minus1, all32 actual emission values and
  exact33rd refusal/stale; baseline setup must not turn this into33 successes.
- P321 old TODO remains UNRUN history. R3 normal fixture plus two independent
  depth predicates and composition evidence are approved scoped replacements.
- P322 count16..48/previousPassed/first-refusal search assertions are explicitly
  superseded UNRUN history by the approved exact normal counter reconstruction
  and component entry predicate; do not report that old adjacency experiment PASS.
- P323–P327 retain every ledger tamper, all original real-clock inequalities/raw
  operands/restoration, exact syntax/resource/replay refusals and fresh owner.
- P328–P332 preserve original exact tuple/arity/ordered export/tamper/zero-touch/
  cross-domain/flags assertions and add the explicitly named R3 domain vectors.
- P333–P336 preserve private source/name/specifier exclusions, exact OPEN flags,
  mode/native/syntax refusals and no salvage/retry/reset.

No other predecessor assertion is dropped in the proposed mapping. This verdict
requires the entire universal bundle on EACH mapped call, including all JSON
own-key/value-type loops, scalar inequalities, actual throw/fulfillment distinction,
independent canonical seal, H_STALE and H_DROP. Summary prose is not a license to
port only selected expects. Future complete code must be independently compared.

## 3. Two mapping clarifications before the complete port

**BASELINE vector binding.** TOOL_PRECODE's short P309.BASELINE_WITNESS row must
explicitly incorporate the complete existing BASELINE_FREEZE numbered vector.
That includes duplicate/wrong-domain/repeated-M1 rejection, eight specified
malformed M2 sub-assertions and atomic trackers, accepting real unchanged M2,
same witness identity, M3/M4/M5 stage accounting, source-census provenance gate,
forget/tombstone/idempotence and fresh-handle isolation. These stay subassertions
of the existing row, not added rows. Reconcile uses independently source-derived
T only when that separate gate closes; a witness-derived T is not acceptable.

**ONE_SHOT assertion binding.** Existing P329.NORMAL_NO_KERNEL_SWITCH must include
the second legitimate zero-argument kernel call's exact ALLOCATION_COVERAGE_OPEN
refusal after the one fixed twenty-case invocation. Its bad-arity assertion runs
before that invocation and must not consume it. These are the frozen lifecycle
requirements inside the existing assertion vector, not new cases or a second
twenty-case run. No unknown code/any exception is accepted.

## 4. Baseline integration / snapshot arithmetic

The current helper requires exact register6/read3/witness2/reconcile3/forget2
arities and one factory with distinct normal/alias identities. Its private map
has at most two live contexts, but weak tombstone growth must be counted for the
complete fixed driver; it is not globally bounded by two. The port must register
every managed successful create, then read EVERY actual metadata result in order.
RetireProducer returns a fixed string, NOT metadata; do not feed it to read.
Verify returns metadata and DOES advance the tracked emission count.

Ordinary make's additional M1 is mandatory. Do not replace any original observe
with that cached M1. For example P301's old SOURCE_READY observe remains M2;
P309.ADDITIVE's original first observe also remains M2. These original calls
continue to assert their original phase/pass values, while the historical wire
snapshot uses the actual number of pre-analyze emissions. P320 META and P327
META_EXHAUSTION instead use their first EXISTING loop observe as M1, with no
additional initial observe; all32 returned strings must be read/validated.
Unmanaged foreign alias identity tests may create/retire a handle without inventing
a witness if they inspect no metadata.

Source-only snapshot formulas agree with current metadata580–635 and
create636–692: startup25165824+6758296+304440=32228560; first M1 categories
summary12864/scratch6745432, entries257/nodes0/pass0. Immutable initialBase is
initial.total−32228560, not a later residual. The eight-category checksum replaces
only the impossible old missing-baseBytes/NaN assertion; product27-schema unchanged.
Wire-time categories before other work transfers are summary90656+12864*M and
scratch6667640−12864*M. Ordinary positive M1 gives103520/6654776; original extra
pre-analyze observation gives M2=116384/6641912. Later metadata transfers do not
retroactively alter producerMetadataEmissions. Total and memberships do not
change from metadata consumption; deadline does not renew. Cleanup retires the
actual owner first and forgets context in finally, preserving the first failure.

P321 literal `!!!f()()()()()()()();` hand shape is21 units: identifier1+calls8+
unary3+ExpressionStatement1+Program1 =14 occurrences/distinct Nodes and Node
depth14. Eight CALL end positions6,8,10,12,14,16,18,20 start at3; only innermost
identifier callee has NO_LOCAL_BINDING. A1 is the sole Program.body slot; empty
argument arrays contribute zero slots, not absent arrays. These are structural
expectations only; private-call/five-family/whole parser resource FIT remains OPEN.

P322 hand category algebra is internally consistent: producer257+66*4+2*1+
2*1+Pp=525+Pp; combined545+66*8+2*2+2*2+10*1+Pp+Pr=1091+Pp+Pr. Pp/Pr remain
actual private-grammar entry deltas, not guessed N counts. Constant545/source
coverage and grammarAttempt4 factory paths require the Main named source proof;
this algebra alone neither establishes the parse deltas nor independent grammar.

## 5. Initial inert-core proposal — superseded by Main's concrete seam below

Recommend ONE new pure TEST-TOOL module, prospectively
`scripts/test/private-summary-harness-core-tip081-p3.r3.mjs`, independent of
producer/kernel modules. It contains only the fixed MODEL expected pair and a
closed twenty-case observation validator. No runner/admission/filesystem/timer/
clock/process/environment/normal API, metadata-baseline factory, installed tool,
product hash/writer/classifier or generated artifact import. The complete205 port,
CLI/preservation graph and normal P321 FIT remain held.

Exact prospective imports: node:assert/strict, node:buffer Buffer.byteLength,
node:crypto createHash. Hashing is confined to future called functions inside
the already reserved unit effect; no hash/parse/fixture invocation at module
evaluation. Captures: assert.ok, JSON.parse/stringify, Object.keys,
Object.setPrototypeOf/freeze/is, Number.isSafeInteger, Array/Array.isArray,
String.charCodeAt, Buffer.byteLength, createHash. Native hash calls operate only
on fixed expected public MODEL ASCII, under the explicit trusted TOOL bootstrap
premise, not a hostile-host/private SOURCE certificate. No callbacks/options.

Seven exact prospective named functions, nonrecursive/direct graph:

| Function | Arity | Closed data / direct dependencies |
| --- | --- | --- |
| coreIntegerR3(value) |1| typeof/safeInteger/Object.is, no allocation |
| coreModelSiteR3(index) |1| assert fixed canonical0..105 before one null-prototype9-field row; frozen piecewise106 EXPORT spans/eleven STATIC_LITERAL rows |
| coreModelBodyR3(variant) |1| assert primitive0/1; captured Array106/null sanitation;106 coreModelSite calls; null ledger14/root10; exact TOOL_PRECODE MODEL scalars, no source text or producer observations |
| coreAsciiHashR3(text) |1| primitive ASCII<=16385 precheck; createHash SHA256/update ascii/digest hex; no product hash call, no retained native Hash/context |
| fixedExpectedPairP3R3() |0| explicit arguments.length; two model bodies in order; captured stringify/seal/hash; returns frozen null-prototype array2 of four-field expected records wire,bytes,summaryHash,wireSha256 |
| coreExactKeysR3(record,expected) |2| private-only bounded sanitized parsed record/closed key array; ownKeys null sanitation; exact order, loops<=15 |
| assertFixedKernelObservationP3R3(text) |1| explicit arity/primitiveASCII1..16384 before JSON.parse; root7/array20/row15 validation; integer/digest/null/closed literal checks; fixedExpectedPair and exact twenty-input/outcome table; returns true only after every assertion, no authority |

coreModelBody uses the fixed two ledger vectors30000000/1000000/2282968/
90656-or103520/25165824/0/6667640-or6654776/0/0/65207088/65207088/
10000/118/106. MODEL identity64 zeros, units1053,N/G118,MODULE; no dynamic
padding/search, expected from actual wire or caller fixture. Canonical body key
order is exact H_SUM without summaryHash, then seal field last. Body lengths
16303/16304, final expected wires16384/16385 are fixed algebra to assert later,
not freshly observed. The same pair supplies P319 INPUT witnesses without parsing
`f();` or importing a product. The core does not claim those wires are real source.

The module's static tables are exact SUM11/SITE9/LEDGER14/outputRoot7/outputRow15,
plus twenty null-prototype six-field fixed kernel input records. Full canonical
caseId strings are those in KERNEL_FREEZE; no short-name caller switch. Expected
outcomes are test data, never product output/PASS flags. Validate actual K byte/
entry snapshots canonically, cap67108864/entry20000, after>=before and next.before
>=prior.after. Do not compare actual K snapshots to the MODEL ledger, invent T,
claim observing the unreported final OUTPUT K, or use modeled used/depth as real
allocation counts. Successful CODEC compares actual wire digest AND actual seal
to independent expected values; refused CODEC requires actual offset16384/null
digests; scalar guard cases compare the exact fixed predicate outcomes and
invalid-null observation fields. All15-key rows must be checked, not partial match.

Per expectedPair call: exactly2 array106 lists/212 site records/2 ledgers14/
2 body roots10/2 sealed roots11/one array2/2 expected records4; at most4 hash
objects/digest strings64, two body strings<=16304 and two wire strings<=16385.
All records/arrays are null-sanitized before stringify; no inherited toJSON,
iterators or source-bearing values. No persistent pair cache/reset/owner roots;
caller may retain at most one pair for the single fixed unit run, then drop it.
The validator creates one bounded native JSON graph from<=16384 ASCII input,
then rejects/sanitizes exact root/array/rows before any canonical stringify or
diagnostics; only fixed boolean/literal assert messages on foreign inputs.
Retain no decoded/output text in module globals. At most one pair construction
inside each validator invocation; exactly one valid kernel invocation is the
planned use, not a per205-row loop. Unexpected host/assertion error stops.

These are prospective field/capacity/lifetime bounds, NOT exact physical/native
heap bytes or a guessed guest T. Main must freeze actual helper parameter/local
rows and complete TOOL host allocation inventory before release, then actual
source review before effects. Normal-owner source/counter/FIT and fulltooling
precode do not need to be falsely declared closed to author this narrow core.

## Stop / next routing

Mapping verdict: repairs required before complete205 port; no execution or full
mapping acceptance. Exactfive expectation field repairs, full baseline vector
binding and ONE_SHOT subassertion are actionable without new scenarios/caps.
The proposed fixed expected/validator core is a narrow source-authoring option,
not permission to implement it. Wait Main's explicit closed source release.
Aggregate870882.767416/900000ms; P3remaining21440.727166 unchanged; effects0,
all36/205UNRUN/runtime0/8/compileOFF/tuplesNOT_ISSUED. R2/P2 history,62OPEN,
callergraphOPEN/fullRuntimeClosureNOT_ACCEPTED and all protected boundaries remain.

## 6. Main concrete IO-free seam — current prospective contract

Main subsequently routed the narrower named
`scripts/test/boundary-expectations-tip081-p3.r3.mjs`. This supersedes section5's
file/export proposal BEFORE implementation. Keep section5 as proposal history,
not a second module/helper inventory. No code is authorized by this amendment.

Sole export `createBoundaryExpectationsP3R3(kernelToolBytes)`, exact arity1;
returns a frozen null-prototype TWO-method record `wire(variant)` arity1 and
`check(text)` arity1. No T getter/observer residual, caller fixture/callback/options/
source/AST/lease/domain/loader/file/runner/reset. The trusted driver supplies the
exact kernel T from separately reviewed later source/initialization census; it
MUST NOT derive T from any actual snapshot, wire model ledger or vote. The helper
checks primitive canonical safe T and T<=66797576 BEFORE expected fixture/hash
growth. It cannot authenticate caller provenance or mint authority; trusted
driver source/census binding remains a separate mandatory gate.

Factory captures T plus one independently built pair of canonical expected wires.
Build those using the complete fixed MODEL/table/key orders in section5 and
TOOL_PRECODE, null-sanitation before canonical JSON, and Nodecrypto body+wire
hashes. Never import producer/kernel/hash/writer/normal APIs or learn fixture
values from actual output. `wire(0/1)` returns only the appropriate fixed expected
primitive string16384/16385; exact arity/type0/1 checks precede selection. No
hash/growth is repeated by wire access. Factory has no top-level invocation.

`check(text)` accepts primitive ASCII1..16384 only before JSON.parse, then exact
root7/array20/ordered row15 and scalar schema. Actual text is an observation,
not T evidence. Every expected vector below must compare strict equality, plus
global root literals, exact digest formats and canonical ASCII reserialization
AFTER root/array/all rows are sanitized. Any unknown/missing/additional/nested
field, wrong key order/case order/value or numeric width rejects a TOOL assertion.
Never pass unvalidated objects to diagnostic assert inspection; primitive boolean
and fixed literal messages only. Successful check returns true; no PASS record,
metadata lease or parser acceptance escapes.

### All twenty exact expected scalar vectors

Full IDs use the literal prefixes shown; table abbreviation is display-only.
In ALL rows actualBytesAfter=actualBytesBefore and
actualEntriesAfter=actualEntriesBefore. K observes guard admission without actually
allocating modeled depth/used memberships. CODEC consumes prepaid buckets without
changing K.total/K.entries. Digests E0 denote independently computed actual expected
wire0 SHA256 / body0 summaryHash, not values copied from the kernel.

| Exact caseId | outcome | encoded / attempted | wire / seal | parent | used / delta | admitted | actual bytes before | entries before |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P319.R3.C16384 |EMITTED|16384/null|E0/E0 seal|null|null/null|null|T+127968|257 |
| P319.R3.C16385 |SUMMARY_REFUSED|16384/16384|null/null|null|null/null|null|T+249416|472 |
| P321.R3.B.P126 |ADMIT|null/null|null/null|126|null/null|true|T+250072|473 |
| P321.R3.B.P127 |REFUSE|null/null|null/null|127|null/null|false|T+250728|474 |
| P321.R3.B.PNEG |INVALID_ARGUMENT_REFUSED|null/null|null/null|null|null/null|false|T+251384|475 |
| P321.R3.B.P128 |INVALID_ARGUMENT_REFUSED|null/null|null/null|128|null/null|false|T+252040|476 |
| P321.R3.B.V126 |ADMIT|null/null|null/null|126|null/null|true|T+252696|477 |
| P321.R3.B.V127 |REFUSE|null/null|null/null|127|null/null|false|T+253352|478 |
| P321.R3.B.VNEG |INVALID_ARGUMENT_REFUSED|null/null|null/null|null|null/null|false|T+254008|479 |
| P321.R3.B.V128 |INVALID_ARGUMENT_REFUSED|null/null|null/null|128|null/null|false|T+254664|480 |
| P322.R3.B.E19999_1 |ADMIT|null/null|null/null|null|19999/1|true|T+255320|481 |
| P322.R3.B.E20000_1 |REFUSE|null/null|null/null|null|20000/1|false|T+255976|482 |
| P322.R3.B.E20000_0 |ADMIT|null/null|null/null|null|20000/0|true|T+256632|483 |
| P322.R3.B.E0_MAX |REFUSE|null/null|null/null|null|0/9007199254740991|false|T+257288|484 |
| P322.R3.B.EMAX_1 |INVALID_ARGUMENT_REFUSED|null/null|null/null|null|9007199254740991/1|false|T+257944|485 |
| P322.R3.B.ENEGZERO_1 |INVALID_ARGUMENT_REFUSED|null/null|null/null|null|null/1|false|T+258600|486 |
| P322.R3.B.E0_NEG |INVALID_ARGUMENT_REFUSED|null/null|null/null|null|0/null|false|T+259256|487 |
| P322.R3.B.E19999_FRACTION |INVALID_ARGUMENT_REFUSED|null/null|null/null|null|19999/null|false|T+259912|488 |
| P322.R3.B.EUNSAFE_1 |INVALID_ARGUMENT_REFUSED|null/null|null/null|null|null/1|false|T+260568|489 |
| P322.R3.B.E0_INFINITY |INVALID_ARGUMENT_REFUSED|null/null|null/null|null|0/null|false|T+261224|490 |

Kind is CODEC for first2, PRODUCER_DEPTH for next4, VERIFIER_DEPTH for next4,
ENTRY for last10, exactly matching case IDs. Source derivation of real snapshot
offsets: initial observation prepayment6520/42; first K656+quota97328 plus model
23464/214 gives T+127968 and257. Second adds121448 and215, giving T+249416/472.
Each of eighteen guard K adds656/1, no guard allocation increment. Consequently
last published row ends T+261224/490. OUTPUT later adds50064 and2 memberships,
but its accounting record is NOT published. Never infer an observed492 from490
or claim this checker sees/validates the unreported final output ledger. Complete
source/emitted review must still establish that final cleanup/allocation path.

### Closed native/helper/lifetime bounds for this seam

Retain only the section5 import/capture list and fixed-model operations; no new
TOOL dependency. Proposed eight named functions are coreIntegerR3 arity1,
coreModelSiteR3 arity1, coreModelBodyR3 arity1, coreAsciiHashR3 arity1,
coreExactKeysR3 arity2, createBoundaryExpectationsP3R3 arity1, and its two named
private closures wire arity1/check arity1. section5's public fixedExpectedPair /
assertFixedKernelObservation exports DO NOT exist in this revised inventory.
Graph: factory→model/hash; wire→integer; check→integer/exactKeys, private pair
and fixed scalar table. No parser/re-entry/recursion/dynamic callback exists.
Main must freeze actual prospective local/capture/C02 names before source release;
these are roles/arities/record capacities, not fabricated emitted frame counts.

One factory instance for the future fixed serial unit run, one pair built once,
one valid kernel JSON check. The two closures retain only scalar T/fixed public
expected pair and captured primitives; decoded actual JSON is local to check and
not cached. The driver drops helper/pair/actual JSON roots after the single run.
Arity/type failures have no product calls; any native/hash/schema/assertion error
stops the whole unit attempt, no retry/reset. Per factory expected allocations
are the exact pair field/string/hash bounds in section5, plus TWO named closure
functions and one frozen two-field method record. Per check one bounded native
JSON graph/root-key array/case-key arrays (one reused transient per row), canonical
output string<=16384. Strings/hash graphs are TOOL host accounting, not K/T debit
or a physical/RSS certificate. Full fixed205 host registration/read/tombstone
count remains held independently. No effect, source implementation or admission
follows from this proposal.

### Closed prospective eight-function/capture/state census — Main route

Exact factory parameter spelling is `expectedKernelToolBytes` (replacing the
display shorthand kernelToolBytes above). Every public factory/wire/check call
checks arguments.length; private helpers have the fixed arities below and are
called only by this closed source graph. This is a prospective TOOL inventory,
NOT a claimed source-derived guest T, emitted census or native/RSS bound.

| Function | Parameters | Prospective local binding occurrences | C02 convention |
| --- | --- | --- | --- |
| coreIntegerR3 |value|none|80 |
| coreModelSiteR3 |index|start,loader|112 |
| coreModelBodyR3 |variant|sites,index,ledger,body|144 |
| coreAsciiHashR3 |text|index,hash,result|128 |
| coreExactKeysR3 |record,expected|keys,index|128 |
| createBoundaryExpectationsP3R3 |expectedKernelToolBytes|pair,variant,body,bodyText,seal,sealed,wireText,wireHash plus named local function bindings wire,check|240 |
| wire |variant|none|80 |
| check |actualText|decoded,cases,keys,row,index,field,expected,serialized|208 |

Prospective sum1120 under64+16*(parameters+locals), counting the factory's two
named nested function bindings explicitly. Eight ordinary function/prototype
rows give1536 by the inherited logical convention; six at module bootstrap and
two per factory invocation. These numbers describe rows for later source
validation; they are not a kernel T addition or a host V8 allocation certificate.
Unexpected implementation locals/helpers/captures must be reconciled BEFORE
expansion, never hidden inside this frame table.

Exact native imports remain assert(default) from node:assert/strict, Buffer from
node:buffer and createHash from node:crypto. Exact thirteen module capture names:
cAssert,cParse,cStringify,cKeys,cSetPrototype,cFreeze,cIs,cSafe,cArray,cIsArray,
cCharCode,cUtf8,cCreateHash. They correspond in that order to bound assert.ok,
JSON.parse,JSON.stringify,Object.keys,Object.setPrototypeOf,Object.freeze,
Object.is,Number.isSafeInteger,Array,Array.isArray,bound String.charCodeAt,
bound Buffer.byteLength and imported createHash. Three new bound capture objects
are assert/charCode/byteLength. Native Hash.update(text,"ascii") and digest("hex")
are explicitly closed trusted TOOL calls on each freshly created SHA256 context,
not product callbacks, crypto on private source or mutable guest authority.
The clean captured-TOOL/native-bootstrap assumption must remain explicit; this
core does not certify hostile mutation of Node Hash handles/prototypes.

Only private module DATA globals are the five ordered schema arrays (SUM11,
SITE9,LEDGER14,ROOT7,CASE15), one expected-vector array20, and closed scalar
labels/caps/model constants. All arrays and records are null-prototype frozen.
Expected-vector rows have exactly ELEVEN data fields:
caseId,kind,outcome,encodedBytes,attemptedByteOffset,parentIndex,modelUsed,
modelDelta,guardAdmitted,bytesBeforeOffset,entriesBefore. Values are the twenty
rows in the table above, with actual normalized invalid observations, not the
kernel's separate raw invalid-input records. Digests are derived exclusively
from pair0; after bytes/entries equal their respective before values. This table
has no wire, owner, source, actual observation or PASS field. No second six-field
input registry is needed in the expectation core; the earlier section5 proposal
is superseded. Literal caseId strings remain canonical full names.

Factory persistent private storage is exactly the captured canonical scalar T,
one null-prototype frozen array2 and its TWO null-prototype frozen four-field
records wire,bytes,summaryHash,wireSha256. It retains two expected public wire
strings and four digest strings64; body/model/ledger/site/native Hash temporaries
are not retained by either closure. The returned frozen null-prototype two-field
method record owns only wire/check functions; no result records/T getter escape.
No checkInvoked/private flag or extra TOOL ONE_SHOT policy is introduced.
The trusted fixed driver calls one factory/one check, but repeated pure TOOL
check calls are not silently treated as product retry authority or a new policy.
Their actual count must be included if later changed. Kernel ONE_SHOT stays in
the kernel's already frozen source, not this TOOL module.

Per factory concrete creation capacities: array2/records4×2/methodrecord2/
two function closures; two model array106 backings,212 null site records9,
two ledger14 records, two body10 records, two sealed11 records; four sequential
SHA256 contexts, four hex digest strings64, two body strings16303/16304 and
two wire strings16384/16385. Only one native Hash context is locally live in
coreAsciiHash at a time; no native context/view/raw buffer escapes. Null-sanitation
of array/site/ledger/body/sealed records occurs BEFORE native stringify, with no
spread/callback/iterator/toJSON lookup on an unsanitized graph. Factory pair
records freeze before closures are returned; wire accesses do not rebuild/hash.

Per check actualText is bounded before any parse. Its one transient parsed graph
is constrained by ASCII length16384; accepted graph has root7,array20,rows15×20,
no nested scalar fields. Native Object.keys creates at most one transient keys
array per coreExactKeys call; reuse the helper's locals, no keys-array collection.
The exact root/array/rows and scalar fields validate/null-sanitize BEFORE canonical
stringify. Serialized accepted output<=16384; keep no parsed graph/actual text/
serialized string in module/factory state. All native decode, hash and assertion
failures are raw TOOL failures, not expected product refusal or acceptance.

Known logical record/backing rows, if useful to later TOOL accounting, are explicit:
five key arrays968; vector array264+20*240=5064; pair array120+two records128 each;
method record96; per-model array/site23000+ledger288+body224=23512; each sealed
root240. This omits NO fields from these named record rows, but is NOT a complete
TOOL total: all exact literal/key/binding occurrences, actual function frames,
native Hash/JSON/bootstrap and transient string operations must receive actual
source inventory review. No opaque cushion, physical-memory promise, guessed T,
cap change or execution authority follows. Core host rows must not be funded by
K or S. Main can release only this exact inert source seam after non-own proposal
review; full205 port/normal FIT/deriver/loader/effects remain held.

### Mandatory clearable factory/hash-local lifetime repair

The existing factory locals body,bodyText,sealed,seal,wireText,wireHash MUST be
clearable `let` bindings, explicitly assigned null after each cached pair record
is committed and again before returning wire/check closures. On an exceptional
factory exit clear those same locals and pair in finally; no closures are returned.
This prevents their captured factory environment from retaining model/site graphs
or temporary strings in addition to the intentionally cached pair. coreAsciiHash
uses its existing clearable hash/result bindings: assign hash=null after digest
and unconditionally in finally, including native/assertion failure. Return the
digest through the existing result binding; do not add a helper/catch local/native
diagnostic. This is mandatory source cleanup, not a new function/local/capture,
C02 delta, policy or effect release. The eight-function1120 prospective rows and
four hashes/pair-once bounds remain unchanged; actual source review must verify
these paths. Earlier “not retained” prose is conditional on this explicit repair.
