# P3 R3 metadata helper — independent actual source review

2026-10-08 · SAME081D8 · SOURCE_REVIEWED_NARROW_UTILITY_ONLY.
Verdict: CLEAR against repaired BASELINE_FREEZE and BASELINE_SOURCE_RELEASE for
the authored stdlib helper. This is not integration, syntax/type/lint/unit PASS,
full205-port readiness, independent T, normal parser FIT or execution authority.

## Actual review coverage

Read the entire `scripts/test/metadata-baseline-tip081-p3.r3.mjs` and its
BASELINE_SOURCE_REPORT as plain text, the full narrow source release and the
complete repaired proposal. Author then confirmed SOURCE_FROZEN; independently
reread the final closed four-phase-label check in its actual pre-stringify
context. No source hash, parser/import, syntax check, generator, program, test,
effect or broad scan was used. Author self-report was not treated as acceptance.

## Exact actual interface and retained state

Only imports assert from node:assert/strict and Buffer from node:buffer. Eighteen
captured bindings, of which eight are bound functions, match the author report:
assert.ok, JSON parse/stringify, Object keys/freeze/setPrototypeOf/is,
Number.isSafeInteger, Array.isArray, String.charCodeAt, Buffer.byteLength,
WeakMap/WeakSet constructors and their captured get/set/delete/has/add methods.
Eight module constant bindings include the fixed27-element KEYS array. No
product/loader/parser/filesystem/crypto/clock/timer/process API is imported.

Sole export factory arity2 and all five returned methods check arguments.length:
register6, read3, witness2, reconcile3, forget2. Thirteen named declarations are
six module-level functions (including factory) and seven factory-local functions;
no anonymous callbacks, native iteration callback, recursion or dynamic dispatch.
Actual parameter/local inventories agree with the report:

| Function | Parameters | Ordinary local bindings |
| --- | ---: | --- |
| integer, opaque, phaseIndex | 1 each | none |
| decodeMetadata | 2 | index, decoded, keys, value |
| categoryTotal | 3 | total, index, value |
| factory | 2 | contexts, seenHandles, normalHandle, aliasHandle; seven named local functions |
| knownDomain | 1 | none |
| contextFor | 2 | context |
| register | 6 | context |
| read | 3 | context, record, phase, passes, boundWitness, initialBase |
| witness | 2 | context |
| reconcile | 3 | context, sourceBytes, expectedInitialBase, result |
| forget | 2 | context |

Actual record fields: context9, witness7, reconciliation4, helper-method record5.
These use null-prototype literal syntax. One factory creates one WeakMap, one
WeakSet and two live strong handle slots. Captured domains remain private; external
witness/reconciliation contain scalars only. Successful weak tombstones may
accumulate across registrations; their total native storage is NOT bounded by
two live contexts. Fixed harness factory/registration/read/retention counts and
host allocation/process closure remain separately required.

## Concrete contract findings

All opaque validations/diagnostics receive primitive boolean and fixed messages.
No foreign handle/domain is supplied as an assert actual/expected value or
reflected, enumerated, stringified or inspected. Captured weak operations compare
opaque identity without invoking proxy/getter hooks. Mode/numeric wrappers fail
strict/no-coercion predicates. Duplicate/seen-handle and occupied-slot checks
precede registration mutation. Forget removes map/live-slot roots, clears context
witness/reconciliation/domain, retains weak seen identity, and cannot rebind that
identity. Wrong live domain fails before deletion; absent known-domain forget is
idempotent false.

Primitive text is bounded1..4096 UTF16 units before ASCII loop/UTF8 byte check
and native JSON.parse. Object.keys applies only to the fresh parsed root, not
opaque inputs; its result is null-sanitized. Exact27 ordered own keys, supported
scalar types, numeric indices0/4..18/22, byte indices4..13, fixed labels and
booleans all match the product schema. Phase now has its closed label validation
BEFORE stringify. All accepted values are scalar, the root is null-sanitized
BEFORE canonical stringify, then frozen before accounting/sequence checks.
Inherited toJSON/getter and nested stringify hooks cannot be invoked on accepted
data. Duplicate keys, whitespace, escaped/noncanonical spellings and -0 fail
literal canonical/no-negative-zero checks. Native parse/assert failures remain
raw TOOL failures, not manufactured product refusals.

The first binding requires SOURCE_READY/M1, exact startup vector/counters and
32228560 category reserve. Source units were previously bounded against the
cap remainder, so4*units and fixed additions are safe. InitialBase is computed
only once, in that first-binding branch. Later categoryTotal starts at the same
frozen base, checks each of indices6..13 against cap minus accumulator BEFORE
addition, and compares the result to total. No later residual or baseBytes
metadata lookup exists. This preserves the intended non-tautological check.

GrammarPasses matches phases0/1/1/2; phase cannot reverse; emission must advance
exactly1 and stays within1..32; peak equals total. All validation precedes witness
and phase/emission commit. Invalid reads therefore leave their previous tracker
and witness unchanged. This utility does NOT independently enforce every
cross-stage byte/node/entry monotonicity: the held harness must retain those
separate assertions. Equality to a once-bound base is not such a theorem.

Reconcile checks a primitive safe supplied T, bounds its addition, compares to
the original witness and makes a separate immutable record once. The witness
keeps COMMON_MODE_INITIAL_OBSERVATION_NOT_INDEPENDENT_T. The utility cannot
authenticate the supplied T's origin; Main's independently reviewed census gate
is still mandatory. Reconcile is not called by this inert module.

## Allocation scope, held integration and stop

Host allocations are explicit: boot27-key array/eight bound captures; per-factory
two weak collections, seven function objects and one5-field method record;
per-register one9-field context; per-first-bind one7-field witness; optional one
4-field reconciliation. Each read has bounded native parse graph/key-array /
canonical result, returned frozen record and possible raw native/assert failure.
No product guest-ledger/T or physical-memory bound is invented for these host
operations. At most two contexts are strongly live, but external accepted record
retention and cumulative weak-table entries require the held driver's bounds.

The module contains no fixture/API invocation. Ordinary M1 extra observation and
the32-emission groups' existing first-observation exception are correctly held
integration obligations, not silently executed by this helper. Driver retirement
and finally-forget, original-error preservation, source-census provenance,
immutable-base mutation controls and full205 literal port require their own
source/evidence review. No product schema or clock behavior was changed here.

No remaining blocker found in this actual narrow source. Full helper integration,
run-count/host-cost closure, actual syntax/type/lint/unit evidence, full kernel /
tooling/emitted/admission/reservation and normal FIT remain OPEN. All36 UNRUN,
runtime0/8, compile OFF/tuples NOT_ISSUED. R2/P2/history preserved; aggregate
870882.767416/900000ms and P3 remaining21440.727166 unchanged. STOP after this
one new independent review document; no effects performed.
