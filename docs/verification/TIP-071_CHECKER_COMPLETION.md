# TIP-071 checker completion

Date: 2026-10-04. Builder: CHECKER. Status: DONE for the owned checker slice;
whole TIP-071 acceptance remains with Main. SEALED G1 offline implementation only.

## Implemented boundary

`replayLrcShiftFiniteCertificate(unknown, remainingBudget)` reconstructs the finite
shift certificate using its own integer-lattice arithmetic. The only old module
import is a TypeScript result type. No original producer, consumer, rational helper,
computed mask, or original canonical-phase validator executes in product code.

The checker covers exactly d=3/e=2 and d=5/e=2,3,4 for 15 total runners. It rebuilds
every partition boundary, boundary/open cell, adjacency, midpoint, strict BAD mask,
and tuple GOOD complement. Equality at distance 1/15 is GOOD. All BigInt
intermediates are capped at 256 bits. Descriptor-based plain-JSON preflight occurs
before schema, hash, or BigInt work; limits are 32 KiB UTF-8, depth 32 and 12,000
nodes. Remaining time and operations are bounded by 5 s / 2,000,000, never reset by
the checker. Actual elapsed milliseconds and logical charged operations are returned.

API outcomes are ACCEPTED / CERTIFICATE_REFUSED / UNSUPPORTED / RESOURCE_REFUSED.
Every outcome retains globalProof=false, realTimeProof=false, novelty=false and
executionAuthority=false. Result proof axes remain NOT_ESTABLISHED.

## Acceptance accounting

- A1, A2, A3: 3/3 accepted for this owned slice.
- A6: checker remaining-budget and actual-metric side accepted; aggregate bridge
  accounting belongs to the Bridge Builder/Main.
- A4, A5, A7: Store/Bridge ownership, not claimed by this report.
- A8: owned tests and lint accepted; frozen peer review, aggregate regression,
  whole types/lint/build remain Main responsibilities.

## Verification

All six execution flags were OFF for the explicit owned unit selector:

```sh
RESEARCH_WORKER_ENABLED=false MATH_PILOT_QUEUE_ENABLED=false LRC_CAMPAIGN_LOCAL_ENABLED=false RESEARCH_OPENAI_ENABLED=false RESEARCH_CODEX_LOCAL_ENABLED=false SANDBOX_DOCKER_ENABLED=false node node_modules/vitest/vitest.mjs run --project unit --maxWorkers=1 --no-file-parallelism tests/unit/math-lrc-shift-replay.test.ts
```

Final: 79/79 tests PASS; start 21:20:47 local; total 898 ms; test time 710 ms.
Four parameterized sweep tests contain 96 deterministic cross-check inputs across
all four supported scopes, including +/- epsilon around 1/15 and 14/15,
wraparound, repeated phases, varying unit residues, and large coprime rational
phases. Fresh results and canonical result digests equal the original consumer.
Coherently rehashed corruptions cover omitted/reordered cells and boundaries,
wrong adjacency, midpoint, kind, masks, tuple union, maximum, and scope.

The standalone guard checks the product imports and absence of original arithmetic
calls. Byte/depth/node/bit/intermediate/elapsed/operation limits and no-invocation
accessor/toJSON/symbol/prototype/cycle/sparse/extra-array controls are explicit.

Known historical control: d=3/e=2, units [1,1], offsets [1/30,1/3] reconstructs
BAD masks [[0],[2]] and exactly GOOD [1]. This reproduces the old refutation of a
bare >=2 survivors statement; it is **not** a new LRC counterexample. The d=5/e=4
one-survivor and equality/wrap controls likewise do not imply continuous-time LRC.

Owned lint:

```sh
node node_modules/eslint/bin/eslint.js src/modules/research-sandbox/math-lrc-shift-replay.ts tests/unit/math-lrc-shift-replay.test.ts tests/unit/math-lrc-shift-replay-fixture.ts
```

Exit 0, zero warnings/errors on final bytes.

### Honest failure trail

Initial 75/75 tests passed. After adding the deterministic sweep and final elapsed
hardening, an overly broad patch placed the elapsed check in `reconstruct` instead
of the public entry point: 78 failed / 1 passed with ReferenceError. The placement
was repaired without changing scope, caps, arithmetic, old files, or any external
state. The final 79/79 pass above supersedes that failed intermediate run.

Main's first whole typecheck then exposed ES2017 target incompatibility with BigInt
literals and TypeScript control-flow narrowing of arrow-form never helpers. Only
owned files were changed to BigInt(n), function declarations, and explicit typeof
budget guards; no arithmetic/scope/cap/tsconfig change. The final 79/79 run and lint
pass above cover this repair. Builder's first repeated whole `npm run typecheck`
reported zero checker errors; five remaining Store-fixture errors were sent to its
owner, not edited here. After owner fixture narrowing repairs, the next whole
typecheck passed exit 0 in 4.987 s with all six flags OFF. Final aggregate acceptance
still remains Main's gate.

### Actual local observations

One pure, no-write fixture invocation per scope on frozen bytes gave:

| d/e | Cells | Charged operations | Elapsed ms |
| --- | ---: | ---: | ---: |
| 3/2 | 24 | 8,865 | 5.122292 |
| 5/2 | 80 | 29,721 | 6.552250 |
| 5/3 | 80 | 29,824 | 5.219125 |
| 5/4 | 80 | 29,931 | 4.856917 |

These are observed local finite-fixture metrics, not CPU attestation, model usage,
novel mathematical results, or a scientific M1 run. The fixture uses the original
producer solely to generate test wire inputs; the new product checker does not.

## Frozen owned bytes

| File | SHA-256 |
| --- | --- |
| src/modules/research-sandbox/math-lrc-shift-replay.ts | f3db6c7aeda285d9d32506b0d36a23830c4c0e21092926339dd7fe77373ea6b4 |
| tests/unit/math-lrc-shift-replay.test.ts | 0eef45d5cefcebd63d1cd53688ad78e39f833db167c4603a1398b078d30c9747 |
| tests/unit/math-lrc-shift-replay-fixture.ts | c3c9ea181cf9a694b8b39957c0e6c9f43c2558b3a78ec5d5b00c7e7f45aa98b3 |

## Cross-review and residual gates

Read-only peer review is complete on the frozen Store/Bridge bytes recorded in
TIP-071_INDEPENDENT_REVIEW.md, with zero remaining P0/P1. Two early Store gaps
(inherited array toJSON and mismatched descriptor/finite predicate identity) were
reported to the Store Builder and Main, repaired by the owner, and closed after
final source/test inspection. No peer product edits were made by CHECKER.

No old product/source registry/helper/authority/parser/history/proposal/pins were
edited. No DB, model, network, forest, private production root, browser, server,
Git write, install, migration, environment file, or campaign was used by this slice.
Production replay authority remains refused. TIP-072 authenticated ingress/actual
agent-loop/UI wiring and TIP-073 fresh M1 human gates remain pending. G2/M1/campaign
are not authorized by these offline tests; lower-case/continuous analytic proof
debts remain unchanged. No claim of a perfect method or LRC14/15 proof is made.
