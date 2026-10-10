# TIP-071 BRIDGE071 completion

Date 2026-10-04. STATUS: DONE for the fixture-only Bridge071 slice.
OVERALL: READY_WITH_DEFERRED pending independent review and Main whole-repository QA.
This is not completed TIP-072 authenticated ingress/current agent integration or TIP-073 M1 E2E.
No actual scientific M1, provider/model call, research database write or new theorem occurred.

## Files and ownership

Created only:
- src/server/operations/math-method-unit-durable-replay.ts
- tests/unit/math-method-unit-durable-replay.test.ts
- tests/unit/math-method-unit-durable-replay-fixture.ts
- this report.

No old product, authority, parser, kernel, source registry, package, environment,
history, proposal, worker/controller/route, ledger7 or capture was edited by this Builder.
Other Builders own the new independent checker and V2 schemas/store dependencies.

## Implementation and scope

Vitest/test-only MethodUnitDurableReplayFixtureHost uses real uniquely allocated
private temporary capture files and opaque Store-owned handles. The production
authorizeMethodUnitDurableReplay entrypoint always AUTHENTICATION_REQUIRED.
Even successful critic permission and admission return dispatchAllowed=false.
No callback/fence injection can construct production authority.

The fixture host starts the outer finite clock before invoking the original
producer+consumer host callback. Original supported evidence must have measured
elapsed/operation metrics; original elapsed cannot exceed the actual host callback
observation. Fractional remaining milliseconds are floored for the original
integer-only Budget without resetting or expanding its ceiling. Its actual shared
producer+consumer operations are deducted before the independent checker receives
the remainder. Durable finite write, fresh finite read-back, independent arithmetic,
precritic receipt file+parent fsync, receipt read-back, and the immediately-before-
critic fresh finite/receipt read are under the SAME 5s / 2,000,000 operation ceiling.

Actual fixture original attempt and adversary artifacts are read through fresh
before/after fences, bounded, parsed and validated against exact case/run/contract.
The solver seed, solver attempt digest, adversary report digest and exact prepared
adversary lineage must match before finite replay or critic permission. Finite
record source pins match exact named original/replay paths, not arbitrary values.
Fresh independent checker is imported directly, cannot be replaced by a caller
callback; original/replay independently derived results and digests must match.

Missing/unsupported/semantically refused original controls stop with no positive
permit, and no synthetic seed or elapsed/operations default. Resource, integrity,
storage or authority failure stops the one attempt permanently; no retry or cleanup
is used to manufacture a pass.

Precritic receipt is noncircular and excludes later ledger. Its elapsed projection
is honestly the pre-serialization observation; it does not pretend to contain its
own future fsync duration. After receipt fsync/readback and the final critic gate
read, actual finalFiniteMetrics are retained and later placed in the postledger
receipt, with the same two calls and operation totals under the unchanged cap.

Post-commit Store purpose is different from active capture. Fixture retained
solver+review jobs must be terminal SUCCEEDED and exactly bound. Complete ledger7
is passively revalidated with the actual attempt, reports, original pins and exact
review job. It must retain exactly the same finite record. Scoped review, dossier,
worker result and three role transport bodies are recomputed and bound to actual
case/run/context/job/binding/results, not only arbitrary digest strings.

Full old prepared renderer/input/schema/stdin records are captured, not fake
payload-only substitutes. V2 transport and receipt separately preserve the old
roleInputDigest=hash(payload) and new preparedByteDigest=hash(full file). The Store
checks the three actual prepared/stdout/transport files before durable final seal.
Fixture stdout is coherent synthetic attempt/review JSON, not actual model output
or actual Codex transport parser certification.

A process-local WeakMap critic permit is one-use, with fresh actual finite/replay
disk read before use. A different opaque admission is minted only after postledger
receipt + final seal + fresh read-back. Consumption rereads actual Store seal and
fresh fixture retained ledger snapshot after authorization; changed/deleted/
coherently rehashed retained evidence cannot be accepted from an unchanged receipt.
Copied/deserialized tokens, foreign registries, duplicate/concurrent calls and
restart JSON cannot grant permission. One admitted finite control consumes once
then STOP; information/batch remain NOT_BOUND, relations/associations empty,
proofClosure=false, novelty and global/real-time/formal/external NOT_ESTABLISHED.
It never feeds checkerCalls=2 into frozen V1/069 pretending one call.

## Requirement coverage for this Builder's eight named obligations

| Obligation | Verification | Result |
|---|---|---|
| B1 Fresh original artifact/source/binding checks before critic | Exact six finite binding drift controls; measured usage; scoped attempt/adversary preparation validation | PASS |
| B2 Actual durable staged read and independent checker before critic | Real finite.json + replay.json bytes/digests, original vs replay result; disk tamper/delete controls | PASS |
| B3 Two checker calls under unchanged aggregate ceiling | Original remaining subtraction, original-work/finite-fsync/receipt-fsync deadline faults, actual metrics2 | PASS |
| B4 Honest missing/refused state without authority | MISSING no replay/permit, unknown usage refusal, resource refusal, production/fixture environment guards | PASS |
| B5 Noncircular pre/post receipts and different Store purposes | No future ledger in pre; post terminal purpose; finalFiniteMetrics/fsync observation; exact ledger7 validation | PASS |
| B6 Final retained/transport/commit binding before admission | Ledger/result/input/manifest/job drift, missing actual role files, final sync failure, postseal actual retained and FS drift | PASS |
| B7 Process-local one-use zero-execution admission | Forged/cloned/foreign/restart/duplicate/concurrent controls, consumed once STOP, no novel/global promotion | PASS |
| B8 Owned verification and preservation | Only new owned files; declared selector52/52 and owned lint0; Main whole QA/review deferred below | PASS scoped |

Coverage: 8/8 Builder obligations implemented and exercised offline (100%).
This is NOT a claim that 8/8 whole TIP-071 acceptance criteria or 20 blueprint
criteria are completely certified by this Builder. Checker arithmetic attacks and
Store quota/path/fsync matrices are separate owned reports; Main must verify all.

## Exact final test command and results

```sh
RESEARCH_WORKER_ENABLED=false MATH_PILOT_QUEUE_ENABLED=false LRC_CAMPAIGN_LOCAL_ENABLED=false RESEARCH_OPENAI_ENABLED=false RESEARCH_CODEX_LOCAL_ENABLED=false SANDBOX_DOCKER_ENABLED=false npx vitest run --project unit tests/unit/math-method-unit-durable-replay.test.ts --maxWorkers=1 --no-file-parallelism --reporter=dot
```

Final: 1 suite, 52/52 PASS, 0 FAIL. Start21:20:23 local.
Duration10.81s (transform190ms, import286ms, tests10.45s).
Counts are unique tests, not sums of repeated checkpoints.

Owned lint:
```sh
npx eslint src/server/operations/math-method-unit-durable-replay.ts tests/unit/math-method-unit-durable-replay.test.ts tests/unit/math-method-unit-durable-replay-fixture.ts
```
Final exit0, 0 errors, 0 warnings.
Builder did not run whole typecheck/build or other old test selectors; Main owns those.

## Failure trail and clarifications

- Initial51 controls:1 PASS /50 FAIL due fixture root based on realpath(tmpdir)
  differing from the Store's admitted temp prefixes. Fixture changed to explicit
  unique mkdtemp beneath /private/tmp; actual/private production root untouched.
- Next51:13 PASS /38 FAIL because fractional remainingMs was passed to the frozen
  original integer-only Budget. Floor the remaining ceiling (never round up).
- Checkpoint51/51 PASS21:16:41 duration11.44s.
- Main review requested immediately-before-critic actual disk freshness and fresh
  terminal readback at consumption; both added with tamper/deletion/drift controls.
- Main review requested original solver/adversary digests rejected PRE-critic,
  not only at ledger seal. Mandatory fresh actual artifact callback + full passive
  lineage validation added; the two negative tests now refuse before critic.
- Store/Bridge integration explicitly separated fullprepared file hash from old
  prepared.inputDigest payload hash. No immutable old metadata is rewritten.
- Intermediate41 PASS /10 FAIL used Store schema before its preparedByteDigests
  field reached disk; rerun only after owning Builder completed schema update.
- Checkpoint51/51 PASS21:19:40 duration10.67s.
- Main early typecheck found fixture spread of unknown base.attempt. Repaired by
  existing mathModelAttemptSchema.parse before spread; no old type/schema changed.
- Final extra actual-original-elapsed control gave52/52 PASS above.

Approved L2 implementation detail (Main): a receipt cannot bind its own future
serialization/fsync time. Enforce the same outer clock after fsync; append observed
finalFiniteMetrics in postledger without authority/cap change or circular hashing.
No material blueprint deviation or new executor was introduced.

## Frozen ownership hashes

- Product: 47406316d7c81217aec7d3773b9e4d65567814feab54b7ad1cba819f22e6ffa2
- Owned test: 6addce66d290f08d02da04c7c0d441bd2bd6592ff7b25625a76d7c952f566202
- Owned fixture: 0fd6118587041d80cc05146d7f597fd059b59de7f414d97e3ea72af7cf5cf065

## Remaining boundaries and recommendations

Independent review and Main frozen-byte regression/types/lint/build are required
before claiming release readiness. Actual request/session/tenant/job ingress,
executable closure verification, production private-root permission and actual
worker/controller integration are TIP-072/073, not completed by test callbacks.
Current pipeline has NOT been wired; no M1 is authorized or executed. Fixture
known finite pass cannot be scientific retention, held-out benchmark, lower-LRC
proof, analytic real-time alignment, global14/15 closure or research novelty.

No DB, model, API, network, browser/server, shared worker, forest, Git, install,
migration, environment file, production private-root or old history operation was
performed by this Builder. Test-owned validated unique temp roots were removed
after their controls; this is recoverability-irrelevant synthetic fixture cleanup,
not deletion of user data or retained scientific evidence.

