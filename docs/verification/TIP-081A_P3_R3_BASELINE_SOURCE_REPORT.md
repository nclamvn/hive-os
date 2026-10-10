# P3 R3 metadata helper — authored inert source report

2026-10-08 · SAME081D8 · SOURCE_AUTHORED_PENDING_NONOWN_REVIEW.

Authorized by TIP-081A_P3_R3_BASELINE_SOURCE_RELEASE; implements the repaired
BASELINE_FREEZE in scripts/test/metadata-baseline-tip081-p3.r3.mjs. No import,
syntax/lint/type check, parser, hash, unit run or other execution was performed.
No helper integration, full205 port, product/schema/authority change, fresh T or
runtime FIT is claimed. All source review gates remain Main/non-own decisions.
R2/P2/artifacts and existing narrow normal R3 copies were not edited.

## Actual dependency / capture / state inventory

Only imports node:assert/strict (default assert) and node:buffer (Buffer).
Module captures: toolAssert, parseJson, stringifyJson, ownKeys, freeze,
nullPrototype, sameNumber, safeInteger, isArray, charCode, utf8Bytes, MapType,
SetType, mapGet, mapSet, mapDelete, setHas, setAdd. Eight bound-function objects:
assert.ok, charCodeAt, Buffer.byteLength, WeakMap get/set/delete, WeakSet has/add.
No product module, API getter/callback, parser/loader, filesystem, crypto, clock,
timer, child process, enumeration of opaque inputs or foreign-object diagnostics.
The native opaque WeakMap/WeakSet identity operations invoke no handle trap.

Constants: CAP67108864,TTL120000,TEXT_LIMIT4096,STARTUP32228560,
SOURCE_FIXED1536, both literal provenance strings, KEYS27. KEYS is a single
null-prototype frozen raw array; no iteration/array callback is used. Each factory
creates exactly one WeakMap/WeakSet and two scalar strong live slots. The map has
at most two live contexts, one per captured domain. Weak tombstones accumulate
per distinct successful registration but hold no strong handle/source roots;
cumulative native weak-table storage is not claimed bounded by two. The held
driver must account its fixed run's registration count, factory count and host
allocation budget. The module itself exposes no run/reset or product authority.

Actual context fields9: domain,sourceUnits,mode,cap,ttl,witness,lastPhase,
lastEmissions,reconciliation. Frozen witness fields7: initialBase,
initialTotalBytes,sourceUnits,mode,cap,ttl,provenance. Separate reconciliation
fields4: expectedToolBytes,expectedInitialBase,sourceUnits,provenance. Helper
method record5 fields. Every authored record uses __proto__:null syntax; that
syntax is not an extra runtime own field. External witness/reconciliation records
contain only scalars, no owner/domain/text/AST. Context retains no parsed JSON.

## Actual named functions and binding inventory

Every function is named; there are no callbacks, anonymous/nested-in-expression
functions, recursive calls, dynamic dispatch tables or hidden rest parameters.
Nested method definitions capture only the factory's private state/intrinsics.
All six public factory/method arities check arguments.length explicitly.

| Function | Parameters | Local binding declarations |
| --- | --- | --- |
| integer | value | none |
| opaque | value | none |
| phaseIndex | value | none |
| decodeMetadata | text,context | index,decoded,keys,value |
| categoryTotal | record,initialBase,cap | total,index,value |
| createMetadataBaselineP3R3 | normalDomain,aliasDomain | contexts,seenHandles,normalHandle,aliasHandle; named nested declarations listed below |
| knownDomain | domain | none |
| contextFor | handle,domain | context |
| register | handle,domain,sourceUnits,mode,cap,ttl | context |
| read | handle,domain,text | context,record,phase,passes,boundWitness,initialBase |
| witness | handle,domain | context |
| reconcile | handle,domain,expectedToolBytes | context,sourceBytes,expectedInitialBase,result |
| forget | handle,domain | context |

Sole module export factory declared arity2; returned methods declared arities
register6/read3/witness2/reconcile3/forget2. Private graph is acyclic; read calls
contextFor/decodeMetadata/phaseIndex/categoryTotal, all terminating bounded loops.
The baseline context cannot renew product clocks, create handles or call APIs.

## Bounded host allocation / parse order

Bootstrap: imports/native initialization, eight bound captures, one27-element
array,13 ordinary function declarations (seven factory-local functions are
created per factory), closed literal strings/numbers. This is TOOL host scope,
not a guest owner C01/C02/T claim. The captured Array.isArray is not a constructor.

Per factory: two native weak collections, seven nested named function objects,
one frozen5-field helper record. Per successful registration: one9-field context;
one first-bind7-field witness; at most one4-field reconciliation. At most two
registered contexts are strongly retained. All witness/read/reconcile/forget
validation diagnostics receive primitive boolean and fixed literal message only.
AssertionError/native parse failure allocation is a bounded TOOL failure path,
not an expected product refusal or new authority singleton.

Each read bounds primitive text before parsing to1..4096 UTF16/UTF8 units and
ASCII, with no Buffer allocation. Native JSON.parse graph is confined to that
text bound, even malformed-schema nested data. Native Object.keys creates a
single bounded root-key array (at most the bounded text can encode); it is
null-sanitized before reads, with exact27 required. Nested/non-scalar values are
rejected before stringify. Exact ordered schema, numeric/fixed scalar checks
precede captured setPrototypeOf(decoded,null); canonical stringify occurs ONLY
after sanitation. All accepted string fields (including phase) use closed
literal labels before stringify; numeric fields use the fixed caps. Thus its
result is bounded by the exact27 scalar schema, not an arbitrary phase string
or source-sized payload; parsed record freezes before arithmetic/sequence.
No parsed graph/string is retained by private context. read returns the frozen
record; external retention is the held driver's responsibility. No owner ledger
charges or unreviewed whole-tool memory/RSS estimates are invented here.

## Once binding / atomic checks / cleanup and held integration

First SOURCE_READY/M1 requires the exact frozen vector. It binds initialBase
once from total−32228560. Later arithmetic starts from that frozen value and
prechecks each of eight additions against cap; no later residual or wire base.
Initial source reservation is bounded before4*units. Reconciliation compares a
future separately supplied expected T to the original witness, creates a separate
record and cannot promote witness provenance. Its caller-supplied T provenance
cannot be authenticated by this utility; trusted Main/driver source-census gate
remains mandatory and currently OPEN. No reconcile calls exist in this module.

All domain/schema/numeric/sum/sequence checks precede private read commits;
failed reads leave witness/phase/emissions unchanged. Duplicate registrations
and occupied slots reject before state changes. forget clears map/live slot/
strong context witness/reconciliation/domain roots; weak seen identity remains
so re-registration after forget fails. Absent known-domain forget returnsfalse;
wrong-domain registered-handle forget fails without deleting. No reset exists.
Unexpected native/host failure is a raw tool failure, not a satisfied refusal.

No fixture calls or baseline scenario runner were authored. The existing
P309.BASELINE_WITNESS row's mutation/stage vector is unchanged (denominator205).
Future integration must bind ordinary make's actual M1 and retain both original
observations and their costs. P320/P32732-emission cases use their FIRST EXISTING
observe for binding, never an added33rd success. Every actual metadata result,
including verify metadata, must pass read in order. Driver finally must retire
the actual owner first, then forget even on failure, preserving the original raw
failure. The utility never performs that product cleanup on the driver's behalf.

Known held gates: independent non-own full-source review, helper allocation/run
count closure in A first capture/B preservation and syntax/lint/type/unit scope,
independent T initialization census, full205 harness port/normal FIT, kernel/tool/
process/admission/reservation gates. All36UNRUN/runtime0/8/compileOFF/tuples
NOT_ISSUED; predecessor62OPEN/callergraphOPEN/fullRuntimeClosureNOT_ACCEPTED.
Aggregate870882.767416/900000ms/P3remaining21440.727166 unchanged, effects0.
