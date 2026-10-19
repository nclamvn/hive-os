# P3 R3 metadata baseline helper — narrow pre-code freeze proposal

2026-10-08 · SAME081D8 · P3_SYNTHETIC_PRIVATE_SUMMARY_REPLAY.
STATUS: PRECODE_FOR_NONOWN_REVIEW; NOT IMPLEMENTED/RELEASED/EXECUTED.

Read: latest handoff/ACTIVE, R3 plan, Main R3_SOURCE_COMPLETION and TOOL_PRECODE.
Only this ONE new document is written. No product/test-tool code, hashes,
imports/parsers/checks/tests/effects, installed-tool scan or protected/source/
native/NFT/API/Git/network access. Aggregate870882.767416/900000ms and P3
remainder21440.727166 unchanged. Main freeze/non-own review precede authoring;
this proposal does not release the withheld205-row harness or any effect.

## Defect and exact invariant

R2 metadata() sums baseBytes although the frozen27-key metadata omits it;
Number(undefined)=NaN makes that assertion impossible. Retain that diagnosis as
unclosed R2 history. Do NOT add baseBytes to product metadata or derive a fresh
residual from each later result. The repair is TEST-TOOL accounting only.

The first actual SOURCE_READY observation establishes exactly ONE immutable
initialBase per handle/domain/sourceUnits. Fixed startup prepay is
25165824+6758296+304440=32228560. InitialBase=initial.totalBytes−32228560;
all later successful metadata obeys:

    totalBytes = the SAME initialBase
               + producerParseBytes + producerWorkBytes + summaryBytes
               + replayReservedBytes + replayLiveBytes + scratchBytes
               + unreclaimedProducerBytes + unreclaimedReplayBytes.

No later total/category residual replaces initialBase. Producer wire base is
not an independent initial derivation. Source formula is
initialBase=T+1536+4*sourceUnits. T/initialization census is still pending;
provenance remains COMMON_MODE_INITIAL_OBSERVATION_NOT_INDEPENDENT_T until
independent source/census reconciliation. A witness is not a lease, normal
brand, acceptance flag or proof that metadata was cryptographically authenticated.
The trusted harness must supply the immediate actual API result, not caller JSON.

## Future helper module, imports and arities

Proposed new file ONLY: scripts/test/metadata-baseline-tip081-p3.r3.mjs.
It is an inert standalone TEST-TOOL helper; no automatic runner/main entry.
Imports only node:assert/strict and node:buffer. Captured JS intrinsics are
JSON.parse/stringify, Object.keys/freeze/setPrototypeOf/is, Number.isSafeInteger,
Array.isArray, WeakMap/WeakSet methods and String charCodeAt. No filesystem, crypto,
clock, timer, child process, installed package, product module, loader or parser
import. It never calls a domain API, retires a product owner or renews a clock.

| Function/method | Exact declared/invocation arity | Role |
| --- | --- | --- |
| createMetadataBaselineP3R3(normalDomain,aliasDomain) |2| sole export; captures TWO distinct known admitted API object identities; returns frozen helper, no owner creation |
| register(handle,domain,sourceUnits,mode,cap,ttl) |6| register PENDING_INITIAL context after successful actual create; cannot replace an existing registration |
| read(handle,domain,text) |3| bounded metadata validation; first SOURCE_READY binds once; subsequent reads use the same witness |
| witness(handle,domain) |2| return SAME frozen scalar witness identity, only after binding; no handle/API/source string in returned witness |
| reconcile(handle,domain,expectedToolBytes) |3| future source-derived T comparison, never an observation-derived T; returns separate frozen reconciliation record, does not change witness |
| forget(handle,domain) |2| delete registered context/strong slot; idempotent false for absent registration, true when deleted; no product call |

Check arguments.length, not merely function.length. Internal schema/integer/sum
helpers have fixed bounded bodies and no callbacks/recursion. Exact implementation
locals/captures/constants/native allocation bounds receive later source review;
no invented whole-tool census is supplied before that file exists. The helper is
not embedded in normal/kernel artifacts, so it cannot alter product toolBytes or
the six-API/private-owner schema. Its host allocations/time are part of the
already planned unit child, NOT a free process or owner-ledger exemption.

Domain values are the exact two frozen loader return objects supplied by the
trusted unit driver after their own admission gates. Factory compares identity,
not caller flags. No domain getter/callback/options is invoked by this helper.
No use of a kernel/model domain. A fabricated context cannot authorize a product
owner or admit a tuple; the helper is not an authority verifier.

Opaque input validation uses ONLY boolean primitive predicates and
assert.ok(booleanResult,FIXED_LITERAL_MESSAGE). Never supply a foreign handle,
domain, mode/number wrapper or callback/object as actual/expected in assert.equal,
deepEqual or a diagnostic/log record: its inspection might call customInspect,
proxy traps or getters. Factory/register/read/witness/reconcile/forget perform no
API-property/owner/symbol/descriptor reflection. typeof/non-null/strict identity
and captured no-coercion integer checks are sufficient; fixed error diagnostics
retain no foreign object. Parsed/sanitized JSON scalar values may be compared
normally after data-shape validation.

## Private state / atomic failure / cleanup

One helper factory instance for the entire serial unit run, not one per owner.
One private WeakMap keyed by opaque handle identity and one weak seen-handle set;
at most TWO live strong slots, one per captured domain. The weak seen set retains
no owner/domain/source roots and prevents re-registering an identity after forget.
No reflection/getter/symbol/proxy trap on handle.
At registration validate object/non-null handle, exact known domain identity,
sourceUnits nonnegative safe integer, mode SCRIPT/MODULE, cap positive safe
integer<=67108864 and ttl positive safe integer<=120000. The source byte formula
is checked without unsafe multiplication: sourceUnits must fit the fixed cap
remainder after1536+32228560; otherwise fail the TOOL assertion. This does not
replace normal create validation. Reject previously seen handle/occupied domain slot
before changing any state or consuming any product observation.

Context binds domain/sourceUnits/mode/cap/ttl; no source text. Mutable tracking
contains only PENDING_INITIAL/BOUND state, last phase, last checked metadata
emission count and optional separate reconciliation record. Frozen witness fields
are initialBase,initialTotalBytes,sourceUnits,mode,cap,ttl,provenance. Domain/handle
remain private identity bindings. No raw JSON/summaries/AST retained in state.

Validate everything using local temporaries BEFORE committing a first witness or
updating phase/emission trackers. Failed wire/domain/schema/numeric/sum checks
leave the prior witness and trackers unchanged. Helper failures are ordinary
node:assert AssertionError/code ERR_ASSERTION, NOT manufactured product refusal
singletons. Unexpected host errors are failures, never a satisfied refusal test.

forget with wrong domain for a registered handle fails without deleting it.
For absent handle in a known domain it returns false without creating state.
After forget, register/witness/read/reconcile cannot resurrect that identity.
The seen-set tombstone remains weak; it is not an active owner reference. Clear both
live slots and every WeakMap entry via per-handle cleanup in the driver's finally;
there is no broad reset/rebind function. External scalar witness references may
survive as raw evidence, but contain no owner/source roots.

## Bounded JSON and exact27-field checks

read first validates registered handle/domain, then primitive string; no coercion.
Before JSON.parse require <=4096 UTF16 units AND <=4096 UTF8 bytes, all code units
ASCII, and nonempty text. Never allocate a source-sized Buffer. JSON parsing is
only a future stdlib TOOL action on this bounded result, not parser execution
authorized now. Reject null/array/non-record roots.

Require exact ordered own keys, no extras/missing keys:
version,purpose,mode,phase,totalBytes,peakBytes,producerParseBytes,producerWorkBytes,
summaryBytes,replayReservedBytes,replayLiveBytes,scratchBytes,
unreclaimedProducerBytes,unreclaimedReplayBytes,attemptedNodes,internalEntries,
siteCount,grammarPasses,metadataEmissions,semanticCoverage,allocatorCoverage,
graphStatus,predecessorOpen,fullRuntimeClosure,execution,materialization,
realParserDisabled. Exact validation order is bounded primitive/ASCII preflight
→ native parse → boolean record check → own-key/scalar/numeric validation
→ captured setPrototypeOf(decoded,null) → canonical stringify comparison
→ freeze → remaining arithmetic/sequence checks → atomic state commit.
Require captured JSON.stringify(decoded)===actual text ONLY AFTER null-prototype
sanitization: an inherited Object.prototype.toJSON/getter must never run.
Duplicate keys, whitespace, escapes/noncanonical numeric text cannot hide behind
native JSON's last-key normalization. All27 accepted values are scalar, so root
sanitization suffices; returned record is immutable. Do not stringify a root or
nested value before rejecting unsupported data types.

All numeric fields are primitive, nonnegative safe integers and not−0:
version,ten byte fields(total/peak plus eight categories),attemptedNodes,
internalEntries,siteCount,grammarPasses,metadataEmissions,predecessorOpen.
Each byte field<=registered cap; attempts<=200000; entries<=20000; sites<=512;
grammarPasses0..2; emissions1..32. Never Number() a possibly missing/string field.
Fixed values: version1,purpose TIP081_P3_SYNTHETIC_METADATA,mode equals registered
mode,semanticCoverage OPEN_COMMON_GRAMMAR_RISK,allocatorCoverage COMMON_MODE,
graphStatus OPEN,predecessorOpen62,fullRuntimeClosure NOT_ACCEPTED,
executionfalse,materializationfalse,realParserDisabledtrue. These preserve OPEN,
not imply full semantic/native/physical closure.

Allowed observable phases SOURCE_READY,PRODUCER_SUMMARY,PRODUCER_AST_RETIRED,
VERIFIED with grammarPasses0,1,1,2 respectively. Phase may repeat but not reverse;
each actual metadata result advances checked emission count exactly1, including
verify's returned metadata. All successful metadata outputs must pass read;
discarding a result cannot silently skip tracking. Refused calls emit no accepted
metadata and change no helper emission tracker.

## First binding / later arithmetic / future T reconciliation

PENDING_INITIAL accepts only the FIRST actual SOURCE_READY observation. Require
literal vector: producerParseBytes0,producerWorkBytes304440,summaryBytes12864,
replayReservedBytes25165824,replayLiveBytes0,scratchBytes6745432,
unreclaimedProducerBytes0,unreclaimedReplayBytes0; grammarPasses0,
attemptedNodes0,internalEntries257,siteCount0,metadataEmissions1.
The eight categories sum32228560. Require peakBytes=totalBytes and
totalBytes>=32228560+1536+4*registered sourceUnits. Compute initialBase once;
all operands/results safe/cap bounded. Bind only after every check passes.

For BOUND, begin accumulator at frozen initialBase, add each numeric category
only if value<=cap−accumulator, then require final==totalBytes and peak==total.
This pre-addition check excludes unsafe overflow and avoids a current residual
tautology. No baseBytes lookup in metadata. The initially registered scalar
bindings and frozen witness identity are unchanged across every accepted stage.

reconcile is held until Main's separately reviewed source/initialization census
supplies exact expectedToolBytes. It must be a primitive safe integer>=0;
compare initialBase to that value+1536+4*registered units using safe arithmetic.
Expected T must NOT be calculated from this witness, a later metadata residual,
producer wire base or an observed module vote. Before this gate closes, the
existing witness retains its COMMON_MODE provenance; do not invent a numeric T.
One successful source comparison creates a SEPARATE immutable source-census
reconciliation record; it never mutates/replaces the initial witness or promotes
normal/module/runtime authority. Duplicate/different reconciliations refuse.
COMMON_MODE grammar and physical/native/RSS OPEN labels remain regardless.

## Make binding and32-emission exceptions

Driver integration (future full harness, NOT released here):

- Ordinary trusted make uses actual create(text,mode,cap,ttl); after success
  register(h,domain,text.length,mode,cap,ttl); actual observe(h) ONCE; read it to
  bind before analyze. That extra observation is M1, not free/no-op. Negative
  create cases never register/observe. Unmanaged foreign-handle authority tests
  that inspect no metadata need no fabricated witness.
- P320 META01..META32 and P327 META_EXHAUSTION use explicit unobserved registration;
  their FIRST EXISTING observe call is read/bound as M1. Read all32 existing
  successful outputs;33rd exact VERIFY_RESOURCE_REFUSED remains the refused
  call. Never auto-add an initial33rd observation.
- Driver drop/finally first retires the actual product owner as its existing
  cleanup contract requires (only stale AUTHORITY_REFUSED is tolerated), then
  forgets helper context in a finally even on product/refusal/assertion failure.
  Log secondary cleanup failure without replacing the original raw failure.
- Other first metadata observations in P301/309/310/etc remain their ORIGINAL
  calls in addition to M1; do not substitute a cached record for those actual
  calls. Their expected phases remain, emission/transfer snapshots update
  explicitly. For positives with no prior original observation, analyze history
  uses M1: summaryBytes103520 and scratchBytes6654776 at wire time. This is
 90656+12864 and6667640−12864, not a changed total/quota/schema.
- API TTL start/lastNow and real time inequalities are untouched. Helper adds
  no clock/timer. Extra observations and helper operations are included in the
  held unit6500 envelope; no physical fit promise or new process allowance.

## Existing P309.BASELINE_WITNESS — exact assertion vector, still205 rows

Use ONE fresh actual normal `f();` owner, SCRIPT/CAP67108864/TTL120000. All
assertions below live inside the ALREADY registered P309.BASELINE_WITNESS row;
205 does not change. This is a proposed vector, not executable source/tests.

1. Register and first actual observe bind M1; exact27 schema/initial vector,
   sourceUnits4/mode/domain/cap/ttl binding, frozen witness/same witness identity,
   nonnegative safe initialBase, initialTotal=initialBase+32228560 and initial
   source formula/provenance gate as above. No independent T PASS while OPEN.
2. Duplicate register and wrong-domain read/witness/forget fail TOOL assertions
   without a second product observation or context mutation. Re-reading the
   identical M1 text cannot renew/rebind: emission sequence rejects it.
3. Obtain ONE second actual SOURCE_READY observation M2, but before accepting it
   pass only locally mutated copies through read. Freeze these exact mutations:
   remove `"summaryBytes":25728,`; add `,"extra":0` before final brace;
   duplicate first `"version":1,` via RAW text (not a JS object);
   replace `"summaryBytes":25728` with `"summaryBytes":"25728"`;
   replace `"producerParseBytes":0` with RAW `"producerParseBytes":-0`;
   replace `"metadataEmissions":2` with9007199254740992;
   replace mode SCRIPT with MODULE; separately canonical reserialize ONLY
   totalBytes+1 AND peakBytes+1. Assert original total<cap before that last
   mutation, so all its schema/numeric/cap/emission checks remain valid and the
   frozen-base arithmetic is the discriminator. Raw duplicate/−0 construction
   cannot be erased by JSON.stringify normalization.
   Every copy rejects; original context/witness/emission tracker stays at M1.
   Total+1/peak+1 has otherwise valid structure and expected M2, so its arithmetic
   failure cannot be rescued by recomputing the current residual. No product
   fake metadata/normal result is minted by these local TOOL rejection checks.
4. Accept the actual unmodified M2; witness identity/base unchanged. Source
   categories now summary25728/scratch6732568; sum still32228560. No third
   SOURCE_READY observation is added by these helper checks.
5. Analyze normal source, H_SUM literal CALL0..3/NO_LOCAL_BINDING/OTHER,N4;
   historical snapshot M2 has summary116384/scratch6641912, not M0/M1. One
   actual observe at summary is M3; retireProducer then observe M4; actual verify
   returns M5. read every result with the SAME witness; all totals equal frozen
   base plus actual eight categories, peaks match, phases/pass counts follow
   0→1→1→2, unreclaimed producer/replay positive, verified replayLive0. Producer
   transfer and replay reservations remain unrefunded. No current residual.
6. Retire actual owner; existing exact stale AUTHORITY_REFUSED assertion; forget
   helper in finally. Seen identity cannot register/read/reconcile again; forget is
   idempotent. Fresh later handle/domain registration does NOT inherit this base.
   Do not create another normal integration scenario merely to increase a count.

Each local mutation is a sub-assertion of this existing scenario, with exact
payload/cause/raw rejection recorded, not a hidden scenario denominator. Full
205-row port remains held; source-only helper code (if later released) contains
no actual API fixture invocation or self-PASS exports.

## Stop / next narrow route

Main freezes the helper contract and obtains non-own review; only then may it
release the ONE new stdlib-only helper source, separately from full harness/
kernel/deriver/loader/check/preservation authoring. Future helper must be added
to exact A first hand capture/B preservation/syntax/type/lint scope before any
effect; no new process or hash command. Complete source review precedes effects.
No edits to original R2 test/helper or product schema are proposed.

This document closes a concrete proposal gap: precise once-bound arithmetic,
arities/state/data limits/make/emission/cleanup and the existing scenario vector.
Actual implementation/local inventory/non-own source review, independent T,
normal parser fit/full205 port, kernel fit/process/emitted/admission/reservation
gates remain open. All tests UNRUN/runtime0/8; compileOFF/tuplesNOT_ISSUED.
Predecessor62OPEN/callergraphOPEN/fullRuntimeClosureNOT_ACCEPTED unchanged.
