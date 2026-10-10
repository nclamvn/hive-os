# Completion Report — TIP-072A Core

Date: 2026-10-04. Builder: tip072_replay_scan.
STATUS: DONE within assigned pure-core scope; full TIP-072A awaits Integration,
independent consequential review and Main verification. Full072/M1 NOT COMPLETE.
Sealed TIP SHA256: dbe979f4148b61625b8ebc0a421c42c884a441516072fa56138e6ff2b1ff90f5.

## Files changed

Created only:
- src/modules/research-sandbox/math-lrc-phase-binding.ts: strict bounded four-phase
  assertions, safe constant errors, detached deeply frozen parsing, effective
  immutable lifetime and exact-next-phase append-only validation.
- tests/unit/math-lrc-phase-binding.test.ts: 123 pure-core adversarial scenarios.
- tests/unit/math-lrc-phase-binding-fixture.ts: explicitly Vitest/test-only,
  synthetic assertions, no authenticated/scientific evidence.
- This completion report.

No prior product, test, TIP071, registry, ledger, proposal or history file modified.
No filesystem capture, private-root access, database access/write, worker, route,
action, UI, command dispatch, provider/model/API, install/schema/migration/envfile,
Git/billing/deploy operation performed by this Builder.

## API / behavior

Exports lrcPhaseReadRequestSchema, parseLrcPhaseReadRequest,
LrcPhaseReadRequest/LrcReadPhase, effectiveLrcPhaseReadExpiry,
assertLrcPhaseProgression and LrcPhaseBindingError with constant reason codes.
Schema bounds plain JSON at16KiB BEFORE field schemas or comparison work.
Own/nested getters are refused without invoking them; unsafe prototypes/cycles/
symbols/hidden fields/accessor arrays/sparse arrays/size/depth controls are tested.
All assertions select server rows only; no grant/token/admission/execution mint.

PROSPECTIVE has no created IDs, claims or results. SOLVER_ACTIVE introduces only
actual created binding and SOLVER claim. REVIEW_ACTIVE appends distinct actual
review claim and solver attempt digest. TERMINAL appends only ledger digest.
Claims require one attempt, distinct solver/review job/outbox and all three role
dispatch IDs. claimedVersion is capped below MAX_SAFE_INTEGER for safe terminal+1.

Original descriptor/input is detached and deeply frozen by parse helper.
sourceExpiresAt/grantExpiresAt must be after descriptor creation and no later than
descriptor expiry (Contractor explicitly confirmed this interpretation).
Effective read lifetime is min descriptor/source/grant/mandatory original session/
all present historical claim leases. Review may shorten but never renew a solver
deadline. The helper is pure: live expiry/authentication is a subsequent DAL check.
Progression permits exactly one next phase and compares every prior field using
canonical bounded data. Reordering object keys is harmless; changed claims,
created IDs, nonce, actor/pins, digests or lifetime anchors are not renewal paths.

Integration Builder received the final API and fixture; fixture uses60s descriptor,
45s solver and55s review lifetime, intentionally proving historical solver ceiling
remains45s rather than being extended by a later review lease.

## Test results

Latest named regression run (six execution flags OFF):
node ./node_modules/vitest/vitest.mjs run --project unit
tests/unit/math-lrc-phase-binding.test.ts tests/unit/math-lrc-shift-replay.test.ts
--maxWorkers=1 --no-file-parallelism

Start22:02:46 local; duration1.10s;2 suites202/202PASS =123 new core +79 unchanged
TIP071 independent checker scenarios. This is one latest result, not a sum of
repeated checkpoints. Prior initial core run had2 error-classification expectation
failures; classification was repaired and both are covered in the passing run.
ESLint on exactly the three new source/test/fixture files: exit0,0errors,0warnings.
Whole type/lint/build and broad declared regressions remain Main responsibilities;
this report does not claim them.

| Scoped AC | Core contribution / evidence | Status |
| --- | --- | --- |
| A1 | Four strict phase unions; append-only/nonrenewing progression; 123 core controls | PASS within pure scope |
| A2 | Descriptor assertions expose original actor/tenant only as row selectors | Actual-session DAL deferred to Integration |
| A3 | Solver structural role/attempt/outbox/version/lifetime constraints, no future review | Actual owned-row validation deferred to Integration |
| A4 | Review distinct jobs/outboxes/dispatches; retained solver digest assertion and immutable original claim | Actual terminal-solver/current-review DAL deferred |
| A5 | Terminal strict ledger-digest assertion, no synthetic worker fields admitted | Native payload hashes and DB state deferred |
| A6 | Constant error secrecy, getters0calls, cloned/frozen data, session lifetime mandatory | Core PASS; opaque handles/auth post-IO deferred |
| A7 | Pure validation only, test-only fixture refuses production, prior production refusal unchanged | PASS within pure scope; Main preservation audit pending |
| A8 | Named202tests and scoped ESLint pass on frozen files; review notified | Independent review/Main full QA pending |

Requirement coverage: assigned core deliverables3/3 implemented; primary core AC
A1 verified. This is NOT8/8 whole-TIP acceptance, authenticated live ingress,
durable replay inspection or mathematical acceptance.

## Issues / deviations / deferred

No known remaining P0/P1 in assigned pure-core scope at freeze; independent review
may identify consequential issues. No architecture deviation. Claim safe increment
cap is an implementation safety refinement requested by Main.
As sealed, sourceClosure remains UNSEALED and all execution/admission deferred.
The wire descriptor/claim/digest—even a valid one—is not actual authentication,
source attestation, proof or authority. No private-root or M1 result was observed.

## Frozen file SHA256

- math-lrc-phase-binding.ts:
  b034c4eca6722dcb9bf99c76688a908565af17eff0edf17c91e1067c9ba9f908
- math-lrc-phase-binding.test.ts:
  011d810d86f05c5a993e7c51b0138baa95b6a25b7cbf633e0b0aac5c16fcb46e
- math-lrc-phase-binding-fixture.ts:
  eb497d9a48220a5471803c73bcf1fd23ae299543608a286ade38d795dae09063

Suggestions: keep072B phased storage/transport/new native result projections and
restart read-only inspection separate from these row-selection assertions. Do not
unlock production because the pure assertions or an authenticated read pass.
