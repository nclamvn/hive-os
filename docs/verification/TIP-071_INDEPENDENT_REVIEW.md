# TIP-071 consequential frozen-byte review

Date: 2026-10-04. Reviewer: CHECKER Builder, independently reviewing Store/Bridge
ownership. Scope: SEALED G1 offline implementation only. Status: **0 remaining
P0/P1 findings** on the frozen peer bytes below. This is not production/M1
certification, whole-release acceptance, or independent review of the reviewer's
own checker implementation; Main owns the latter and final aggregate gates.

All four new product modules and all six new test/fixture files were read. Final
SHA-256 values were independently read from local bytes and checked against owner
freeze messages. No peer product/test files were edited by this reviewer.

## Consequential findings and disposition

1. **P1, closed — inherited array toJSON could run during serialization.** The
   initial `durableJson` descriptor walk accepted array subclasses/prototype
   substitutions, allowing an inherited toJSON to execute in JSON.stringify. The
   Store owner now requires Array.prototype before serialization. Its explicit
   modified-prototype control verifies refusal with zero toJSON invocations.
2. **P1, closed — original finite and method descriptor predicates are distinct.**
   The initial Store compared the original finite predicate directly against the
   descriptor's method predicate, rejecting all valid precritic receipts. The
   frozen Store explicitly requires
   SHIFT_PHASE_PARTITION_AND_COMMON_SHIFT_FINITE_V1 for finite evidence, while the
   strict descriptor still requires FEW_EXCEPTION_SHIFT_14_V1. Positive seam
   tests pass without broadening either predicate.

Both counterexamples were communicated to the owner and Main before freeze; the
owner performed the repairs. No outstanding P0/P1 was found on final bytes.

## Reviewed invariant seams

- Complete finite arithmetic is a separate integer-lattice checker, not a replay
  of original producer/consumer helpers. Known single-survivor controls remain
  valid; equality at 1/15 is GOOD, not strict BAD. Arithmetic acceptance is limited
  to d3/e2 and d5/e2..4, with universal/continuous/formal/novelty axes unestablished.
- Descriptor and binding snapshots are immutable and checked against the
  fixture-host fences before/after IO. Opaque handles, critic permits and final
  admissions belong to process-local registries, are purpose-bound/one-use, and
  cannot be recreated from copied JSON. Production constructors/mint refuse.
- Original actual attempt and adversary are read before permitting the critic
  stage. Their hashes, finite seed, role-prepared input and original finite binding
  must agree. Source pins use exact original/replay source paths, not any matching
  arbitrary value in the pin map.
- Prepared byte SHA-256 is distinct from the old semantic inputDigest. Retained
  role input digests agree with ledger7 audit payload digests; prepared byte hashes
  agree with exact retained prepared wire bytes. The Store revalidates prepared
  role/case/run/contract and critic finite/source binding, and compares fresh
  prepared/stdout/transport files against postledger anchors.
- All three roles are allocated under the same exclusive quota.lock. V1/V2,
  expired, partial and orphan slots share the same quota domain; each slot is
  charged at least 1,146,880 bytes. Unknown names/formats, mismatched V2 slot groups,
  duplicate intents and combined per-slot control overflow fail closed. No stale
  lock cleanup, alternate root, hidden journal or restart authority is introduced.
- Create-only 0600 files/0700 directories use no-follow, ownership/inode/ancestor
  checks, complete writes and file+parent fsync. Bounded fresh reads check
  identity/content before and after. Revocation after file open closes the acquired
  descriptor; faults quarantine rather than retry or admit partial evidence.
- The bridge clock starts before original producer+consumer host invocation.
  Their original shared-budget operations are subtracted, not reset; fractional
  remaining milliseconds are conservatively floored for the old integer-budget
  interface and passed unchanged to the independent checker. Staged/readback and
  precritic receipt fsync/readback run under the same outer 5 s / 2 M operations.
  Unknown, inconsistent or over-ceiling metrics refuse. Missing seed returns
  MISSING, without a second checker, permission or manufactured success.
- Precritic receipt excludes the future ledger and post-fsync self-reference.
  Postledger admission binds actual retained ledger7/review/dossier/worker result
  and all transport anchors, then requires a fresh final durable seal. Fresh
  finite/receipt bytes are checked again at critic claim; retained terminal snapshot
  and committed files are checked again before one-use admission consumption.
- The only positive fixture outcome is KNOWN_FINITE_PASS followed by STOP,
  dispatchAllowed=false and proofClosure=false. Batch/information remain NOT_BOUND;
  relations/associations are empty; no subsequent candidate/model task is dispatched.

## Verification evidence and limits

Owners reported exact named selectors with all six execution flags OFF:

| Slice | Final tests | Owner-reported final observation |
| --- | ---: | --- |
| Checker | 79/79 | 21:20:47, total 898 ms, test time 710 ms; owned lint exit 0 |
| Store | 58/58 | 21:21:32, total 5.77 s; owned lint exit 0 |
| Bridge | 52/52 | 21:20:23, total 10.81 s; owned lint exit 0 |

Total unique new tests: 189. Peer tests were inspected and their owner-reported
results retained, not presented as a second independent execution by this reviewer.
Main must run the final aggregate selector/baseline regression on these pins.

Following owner compatibility repairs, this reviewer ran:

```sh
RESEARCH_WORKER_ENABLED=false MATH_PILOT_QUEUE_ENABLED=false LRC_CAMPAIGN_LOCAL_ENABLED=false RESEARCH_OPENAI_ENABLED=false RESEARCH_CODEX_LOCAL_ENABLED=false SANDBOX_DOCKER_ENABLED=false npm run typecheck
```

Exit 0, duration 4.987 s. The earlier typecheck failures and owner repairs are
retained in slice reports; no tsconfig or old product change was used. Whole lint,
build and aggregate regressions remain Main's separately reported gates.

Fixtures use synthetic actor/tenant/source/claim observations and uniquely
allocated temporary paths. Even where stdout contains complete JSON model-shaped
records, there was no model execution, actual parser/transport attestation, DB
terminal-state verification, request-header authentication, production filesystem
ingress or live scientific M1. Those are TIP-072/073 obligations, not certified by
these offline tests. Callback fences are allowed only in actual Vitest/test fixture
mode; they are not generic production authorization injection.

## Exact frozen product bytes

| Product file | SHA-256 |
| --- | --- |
| src/modules/research-sandbox/math-lrc-shift-replay.ts | f3db6c7aeda285d9d32506b0d36a23830c4c0e21092926339dd7fe77373ea6b4 |
| src/modules/research-sandbox/math-lrc-durable-replay.ts | aa32e8cb90d6470460c8b37083109b814c7fd968b77817a9275300e97538c9c4 |
| src/server/operations/math-diagnostic-capture-v2.ts | 29897c95057f9c09e48e9534052b0b072d15049d81a84b5b260ab5e84b590286 |
| src/server/operations/math-method-unit-durable-replay.ts | 47406316d7c81217aec7d3773b9e4d65567814feab54b7ad1cba819f22e6ffa2 |

## Exact frozen test and fixture bytes

| Test/fixture | SHA-256 |
| --- | --- |
| tests/unit/math-lrc-shift-replay.test.ts | 0eef45d5cefcebd63d1cd53688ad78e39f833db167c4603a1398b078d30c9747 |
| tests/unit/math-lrc-shift-replay-fixture.ts | c3c9ea181cf9a694b8b39957c0e6c9f43c2558b3a78ec5d5b00c7e7f45aa98b3 |
| tests/unit/math-diagnostic-capture-v2.test.ts | 24115840c7e5e34d3182bd2c4c28e2984e6551f671802675c2f0dacd43d71365 |
| tests/unit/math-diagnostic-capture-v2-fixture.ts | c3e1011e84e3459eac644bdfe965fc75b0524e321797c3b12484cd187f1fd157 |
| tests/unit/math-method-unit-durable-replay.test.ts | 6addce66d290f08d02da04c7c0d441bd2bd6592ff7b25625a76d7c952f566202 |
| tests/unit/math-method-unit-durable-replay-fixture.ts | 0fd6118587041d80cc05146d7f597fd059b59de7f414d97e3ea72af7cf5cf065 |

Separate unchanged legacy original method-unit source pin, verified locally:
`src/modules/research-sandbox/math-lrc-method-unit.ts`
SHA-256 72300a2c56ff21e449126fed3d57be247e3abc116e248b96777fc0b9b00812c5.

Any later product/test byte change invalidates this frozen-byte review until
re-reviewed. Existing lower-case/continuous analytic debt, historic refutations,
source/history pins and 064 UNKNOWN status remain unchanged. G2, a fresh M1 and any
LRC campaign remain unauthorized; no claim of LRC14/15 proof or novelty is made.
