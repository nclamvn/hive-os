# TIP-071 Main verification — independent finite replay, offline release

Date: 2026-10-04. Overall: READY_OFFLINE_WITH_EXPLICIT_DEFERRED.
This closes TIP-071 only. TIP-072 actual authenticated ingestion/worker/UI connection
and TIP-073 fresh scientific M1 acceptance are NOT complete or authorized by fixture tests.
No new LRC-14/15 theorem, article-proof reproduction, formal proof, research novelty,
external institutional verification, or live agent E2E is claimed.

## Outcome and decisions

Human “triển khai tập trung vào bài toán” contextually approved the previously reviewed
G1 architecture/privacy blueprint for 071–072. Main released the dependent TIP-071
slice first, using Vibecode Kit v6.2: three separate Builders implemented the checker,
store and bridge; Main contracted, inspected and verified, without product coding.
No G2, actual private-root access, model/campaign or scientific M1 authority was inferred.

The mathematical focus stays on the known few-exception shift unit, 14 moving /15 total:
only d=3,e=2 and d=5,e=2..4. The replay uses its own exact integer lattice rather than
calling original producer/consumer arithmetic. It independently reconstructs every phase
boundary/open cell, cyclic adjacency, strict bad mask and common-shift complement.
Equality at 1/15 is GOOD. Known single-survivor cases remain valid; a stronger “at least
two good shifts” assertion is not silently restored. The 96 deterministic rational/
residue sweep controls are bounded regression examples, not a universal proof or benchmark score.

Durable fixture captures use create-only bounded files, per-IO fences, a shared allocator,
all-three-role reservation and noncircular precritic/postledger receipts. Critic permission
requires fresh arithmetic replay and actual fixture attempt/adversary binding, then fresh
finite/receipt read immediately before use. Final admission requires retained ledger7/result
anchors, all actual fixture role files and the final fsynced seal; consumption rereads
both files and retained terminal snapshot. Opaque permissions are process-local, one-use
and cannot be copied from JSON. Every admitted fixture result is KNOWN_FINITE_PASS then STOP,
with dispatchAllowed=false, proofClosure=false and no new information/batch/relation/
association/novelty claim.

L2 clarifications adopted without cap or authority expansion:
- A receipt cannot serialize its own future fsync duration. Precritic timing records the
  serialization observation; the unchanged outer clock is enforced after fsync/readback.
  Postledger finalFiniteMetrics preserves the final observed same-two-call phase.
- Existing roleInputDigest hashes the mathematical payload; new preparedByteDigest hashes
  the full prepared input/schema/stdin file. Both are retained separately, without rewriting
  original ledger7 metadata.
- Original method preset and finite-check predicate are different literals and explicitly
  mapped. Exact named original/replay source pins are required, not arbitrary map membership.
- Caller-declared solver/adversary digests cannot pass the critic gate: the fixture host
  reads and validates actual original artifacts before issuing permission.
- ES2017 compatibility was repaired within new owned files using BigInt(n), without changing
  tsconfig, the mathematical algorithm, the domains or the legacy source pack.

## Requirement coverage and scenarios

Coverage: 8/8 scoped TIP-071 acceptance criteria implemented and verified offline (100%).
Missing inside the released offline scope: 0. This is NOT 20/20 implementation of the
parent blueprint, not completion of 072/073, and not production authentication certification.

| AC | Exercised evidence | Result |
| --- | --- | --- |
| A1 | Separate integer-lattice arithmetic; all four supported finite scopes and independent result/hash comparison; no original arithmetic calls | PASS offline |
| A2 | Complete-cell/boundary/unit/adjacency/mask attacks with coherent rehashing, equality GOOD, cyclic wrap, repeated phases, exact one survivor | PASS |
| A3 | Plain JSON getter/prototype/toJSON/cycle/depth/node/UTF-8, rational/intermediate 256-bit, operation/time/unsupported scope refusals | PASS |
| A4 | Test-only constructors; opaque purpose/registry checks, immutable pre/post receipts, exact finite/source/actor-context fixtures, expiry/revocation before and after IO | PASS fixture only |
| A5 | Concurrent/duplicate spent intent, complete three-role slot groups, actual 98-slot V1 and 95 V1+3 V2 quota refusal, combined control cap, path/link/mode/partial/fsync faults | PASS |
| A6 | Original actual usage plus fresh independent checker, same aggregate 5s/2M, original-work and finite/receipt fsync deadline controls, honest missing seed | PASS |
| A7 | Exact original artifacts/finite/ledger7/dossier/job/role prepared/stdout/transport anchors, no-seal and postseal drift refusal, copied/foreign/restart tokens, one consumption then STOP | PASS fixture only |
| A8 | Frozen peer reviews, Main final 38-suite regression, whole types/lint/build, original-byte preservation audit | PASS |

The 128-MiB guard is retained. Under 100 slots and fixed per-slot 1,146,880-byte maxima,
valid slot-only history is at most 114,688,000 bytes; an independently unreachable larger
byte cap is not presented as a fabricated positive test. Unsupported V1 maintenance layouts,
missing reservations or unknown history conservatively STOP and remain in place; no cleanup,
purge, stale-lock removal, resume or recovery API was added.

## Main execution evidence

All six execution flags were explicitly OFF: research worker, math pilot queue,
LRC campaign, OpenAI, Codex-local and Docker sandbox.

Final combined frozen-byte command:

```sh
RESEARCH_WORKER_ENABLED=false MATH_PILOT_QUEUE_ENABLED=false LRC_CAMPAIGN_LOCAL_ENABLED=false RESEARCH_OPENAI_ENABLED=false RESEARCH_CODEX_LOCAL_ENABLED=false SANDBOX_DOCKER_ENABLED=false node ./node_modules/vitest/vitest.mjs run --project unit tests/unit/math-lrc-method-unit.test.ts tests/unit/math-lrc-research-program.test.ts tests/unit/math-lrc-method-unit-live.test.ts tests/unit/math-lrc-matched-benchmark.test.ts tests/unit/math-lrc-matched-benchmark-finite.test.ts tests/unit/math-lrc-research-cockpit-family.test.ts tests/unit/math-lrc-research-cockpit-panel.test.ts tests/unit/math-lrc-research-cockpit-page.test.ts tests/unit/math-lrc-proof-unit-run-page.test.ts tests/unit/math-pilot.test.ts tests/unit/math-agent-review.test.ts tests/unit/math-lrc-proof-unit-live.test.ts tests/unit/research-lrc-proof-unit-audit.test.ts tests/unit/math-lrc-proof-plan.test.ts tests/unit/math-method-map.test.ts tests/unit/math-adaptive-strategy.test.ts tests/unit/math-portfolio.test.ts tests/unit/math-proof-obligations.test.ts tests/unit/math-transport-diagnostics.test.ts tests/unit/math-diagnostic-capture.test.ts tests/unit/math-diagnostic-codex-transport.test.ts tests/unit/math-diagnostic-session-auth.test.ts tests/unit/math-method-unit-worker.test.ts tests/unit/lrc-method-unit-observation.test.ts tests/unit/codex-local-math.test.ts tests/unit/codex-local-proof-unit.test.ts tests/unit/math-lrc-proof-unit-worker.test.ts tests/unit/math-lrc-proof-unit-cycle-refusal.test.ts tests/unit/math-lrc-proof-unit-request.test.ts tests/unit/math-lrc-research-loop.test.ts tests/unit/math-lrc-research-loop-review.test.ts tests/unit/math-lrc-loop-readiness.test.ts tests/unit/math-lrc-loop-readiness-review.test.ts tests/unit/math-lrc-loop-readiness-panel.test.ts tests/unit/math-lrc-loop-readiness-page.test.ts tests/unit/math-lrc-shift-replay.test.ts tests/unit/math-diagnostic-capture-v2.test.ts tests/unit/math-method-unit-durable-replay.test.ts --maxWorkers=1 --no-file-parallelism
```

Final result: 38/38 suites, 1,071/1,071 unique tests PASS, 0 FAIL.
Start 21:25:01 local; duration61.96s (transform1.19s/import4.87s/tests53.82s).
The count comprises 882 unchanged legacy tests and 189 new tests (79 checker,
58 store,52 bridge). Earlier/repeated checkpoints are NOT added to this total.
Earlier Main legacy35/882 PASS37.70s and new3/189 PASS17.87s support development
verification but are not a larger test count.

Whole `npm run typecheck`: exit0,0 type errors after new-file compatibility repairs.
Whole `npm run lint`: exit0,0 errors/0 warnings.
Whole all-flags-OFF `npm run build`: exit0; compiled5.9s, TypeScript25.8s,
3 static pages generated; standalone environment scrub and assets prepared.
Initial sandbox build failed only because Google Fonts could not be fetched
(Inter/IBM Plex Mono). The identical build succeeded with the public-font network
exception; no model/DB/private-capture permission was enabled.

Main paused only owned dev session60226 before build. Default sandbox restart was denied
EPERM for loopback listen; permitted loopback-only restart restored session97279 at
http://127.0.0.1:3001, READY227ms, all six flags OFF. This is server availability, not
browser E2E or new-agent execution acceptance. No browser mutation was made this turn.

## Reviews and frozen bytes

Consequential cross-review after freeze:
- TIP-071_INDEPENDENT_REVIEW.md: Checker Builder reviews Store/Bridge,0 remaining P0/P1.
- TIP-071_BRIDGE_CROSS_REVIEW.md: Bridge Builder reviews Checker/Store,0 remaining P0/P1.
Main inspected the new product boundaries and requested/verified repairs for per-IO
authorization, post-open handle closure, terminal-purpose transition, earliest expiry,
prepared byte/payload semantics, precritic original artifacts, before-use disk freshness,
after-seal retained drift and reservation intent/group integrity.

Frozen product SHA-256:
```text
f3db6c7aeda285d9d32506b0d36a23830c4c0e21092926339dd7fe77373ea6b4 src/modules/research-sandbox/math-lrc-shift-replay.ts
aa32e8cb90d6470460c8b37083109b814c7fd968b77817a9275300e97538c9c4 src/modules/research-sandbox/math-lrc-durable-replay.ts
29897c95057f9c09e48e9534052b0b072d15049d81a84b5b260ab5e84b590286 src/server/operations/math-diagnostic-capture-v2.ts
47406316d7c81217aec7d3773b9e4d65567814feab54b7ad1cba819f22e6ffa2 src/server/operations/math-method-unit-durable-replay.ts
```

Exact six test/fixture pins are in the independently reread peer-review report.
Slice/report SHA-256:
```text
eb9951c4923b0493495885059233a53715cc5d016e515b099416132b6e30e34b TIP-071_CHECKER_COMPLETION.md
d19f67af0ea12c7ffcfa21201a4131c78c97c9c75e30b2edc6289c16f5da3098 TIP-071_STORE_COMPLETION.md
41a2821fbf78b047e1a5efcecaf8f8580e72ece353c93f6ce71c7642306329ca TIP-071_BRIDGE_COMPLETION.md
ba9a347f18a0878a6d932edb31d374853e50b76f9fd8f43d823cb9fa9a8382aa TIP-071_INDEPENDENT_REVIEW.md
77dc6b483484e7c5bff9a292ae52bfee145299c8c52182668c66ec936b9e2ff4 TIP-071_BRIDGE_CROSS_REVIEW.md
```

## Preservation and remaining gate

Main audited 1,401 pre-existing src/tests/scripts/docs file fingerprints:0 missing,
0 old product/test/history/proposal changes;1,399 unchanged. The only two existing
document changes are the explicit append-only handoff and one new TIP071 manifest entry.
Original 110-entry manifest prefix SHA625a9902c9814f1e3a63263853d261c8d0f0117c383cdf62196d38c719eb7992
is preserved;111-entry manifest SHA93fbcde2e1bbf09c21a5ebd84eabac050e5ca8e2e502588f080b5c60451a2cd0.
Sealed TIP SHAae532004a8a01d448347de9d41e09e2cad6fea3fbf69c84d0203dfb62b75237c.
Approved blueprint SHA5ca4ae11a5f5a353664e94e73464caf3128f49a79cffc6a37cef40591ca999e5
remains verbatim. Legacy original method-unit SHA72300a2c56ff21e449126fed3d57be247e3abc116e248b96777fc0b9b00812c5
and all old source/history/refutations/064 UNKNOWN status remain unchanged.
Original handoff339635-byte prefix SHAb2966468dc36eb75a7e02d0733d82cbe873ad366839026c961275a13395d052c
is preserved before release/final append. `git diff --check` exit0.
HEAD4d108227498d3578c9ac3fe60305c10da5aa905b and branchcodex/tip-023a-organization-graph
are unchanged. Existing dirty work is preserved; no commit/push was requested this turn.

Next, release the dependent TIP-072 design against these verified interfaces:
actual request/session/original actor/tenant/capabilities, fresh row bootstrap,
phase-specific owned job/outbox/lease fences and actual role retention/source closure,
passive UI and bounded read-only V1 maintenance interoperability. These test-only
synthetic callback/source/claim observations do not supply that authority.
Do not treat the all-three-claim fixture timing as a real sequential worker lease protocol;
actual phases, terminal admission lifetime and current-row ownership must be verified in072.
Then obtain exact fresh descriptor/actor/calibration/private-root permission/G2 binding
and accept ONE new M1 before opening a campaign. No old064 retry or P83/forest expansion.
Existing lower-LRC and continuous/analytic debts remain explicit.

