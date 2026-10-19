# Completion report — TIP-074 Research Commitment Guard

2026-10-05. Builder `/root/period_builder`, Vibecode Kit v6.2.

## Status and scope

Implementation and offline self-verification COMPLETE; Contractor acceptance
and independent frozen-source review remain separate. This is engineering
METHOD_REPAIR_074, not mathematical progress, an LRC campaign, G2, native M1,
browser E2E, source adoption or scientific operational readiness.

Authoritative TIP SHA-256:
`f3517cb0a379d9eaeee0b4fbb556546ec1dc0c544d2d9de662cf7863ae4f118e`.
The durable Contractor protocol/active charter and AGENTS changes are Main-owned.
No new scientific milestone is activated by this completion.

## Implementation and trust boundaries

One bounded pure commitment core binds exact tenant/workspace/root digests,
human-selected mode/milestone/source identifier, predicates, ordered quantifiers,
assumptions, approved typed operations and finite work/no-closure ceilings.
Authenticated host code owns actor/time/cycle/command; a model's JSON, matching
prose or copied WeakMap token is not a grant. Explicit human revision preserves
the exact predecessor and declares a new epoch. Ordinary continuation preserves
semantics and budget history. The source identifier is human-choice semantic
data, NOT source-loader/capture attestation or independent source verification.

Actual request, command outcome, event marker, worker job load, every role
reservation, proposal-before-tool admission, separate pre-planner dossier and
method-packet acquisition, survey/replay and next-outbox seams use the core.
Root advisory lock precedes cycle lock; commands use generated cycle-bound
idempotency keys rather than an unsteered static case key that would swallow
legitimate continuation/revision. Missing/malformed/downgraded legacy execution
refuses, while append-only historical traces remain readable.

Complete host-loaded root history is bounded at 32 cycles/64 events per cycle;
overflow/incomplete/invalid/ambiguous accounting refuses instead of resetting.
Attempted work is charged before tools/models; no-closure survives candidate,
batch/branch renames and failed/restarted work. The last already-started work
slot may finish, not start another. Two no-closure rounds suppress a third job
even when a model offers a new gap. Identity is exact declared root identity;
arbitrary semantically equivalent root clones are NOT automatically detected.

Finite closure requires a canonical typed FINITE_SURVEY predicate, exact full
plan and approved INDEPENDENT_REPLAY, same-round unique ordered host marker,
work-start, proposal, acceptance, computation and validated independent replay.
Partial/reordered/duplicate evidence cannot close. A later-round closure is not
credited to an earlier round; one closed obligation does not label all complete.
Tests, source adoption, model votes, receipts, hashes and TIP-072U's conditional
local-family theorem cannot close the complete-prime chain. Universal proof and
new structural/refutation adapters remain unsupported/OPEN, not fabricated.

Offline sealed LRC batches also require the exact opaque commitment: root,
method-unit source digest, batch identity, all candidate predicates/obligations
and mode. Passive `batch:null` diagnostics survive. That sidecar cannot attest
durable cross-batch history, so CONTINUE/HUMAN_REVISED refuse conservatively;
only exact INITIAL fixed-batch planning is supported. Its dispatch/proof closure
flags remain false. Actual queued cycles, unlike the offline sidecar, load the
complete durable root history.

## Requirements and acceptance coverage

| Requirement | Fresh evidence and limitation |
|---|---|
| R1 / A3,A4,A11 | New core; independent hostile identity/rehash/predicate/finite-scope/getter/copy controls; local072U/full-chain negative. |
| R2 / A1,A2,A8 | Actual kernel INITIAL command/outbox, missing/foreign/downgraded worker jobs, seven guarded role reservations, action/adapter/worker transport checks; no real database/provider. |
| R3 / A3,A8 | Proposal drift refuses before source/verifier/solver; each packet/dossier gate and every reservation; unsupported mixed/probe/replay refusal is explicit. |
| R4 / A4,A11 | Independent canonical finite closure positive and malformed/duplicate/reversed/later-round controls; universal remains OPEN. Scientific ES route currently stops before its unsupported mixed-core tool. |
| R5 / A5,A6 | Actual two-round no-closure stop/no-next-outbox, complete history overflow/malformed/missing/order/failed/rename controls. |
| R6 / A7 | Independent real request INITIAL, exact confirmed HUMAN_REVISED new epoch, stale predecessor and QUEUED/RUNNING/FAILED conflicts; caller-auth/foreign host negatives. |
| R7 / A9 | Exact INITIAL offline positive, missing/cloned/renamed/predicate/mode/obligation/CONTINUE negatives; old accounting and exact refutation/equivalence semantics retained. |
| R8 / A12 | Main-owned AGENTS/protocol/active engineering charter; this report stops for Contractor/human routing, no research activation. |
| A10 | Actual unchanged fixed37 loader rejects edited executable sources; six flags OFF; no real scientific state mutation. |

## Fresh verification

All shell verification used:
`RESEARCH_WORKER_ENABLED=false MATH_PILOT_QUEUE_ENABLED=false LRC_CAMPAIGN_LOCAL_ENABLED=false RESEARCH_OPENAI_ENABLED=false RESEARCH_CODEX_LOCAL_ENABLED=false SANDBOX_DOCKER_ENABLED=false`.
Explicit test-only env mocks exercise disabled dispatch boundaries without real
execution. Core commitment/history/replay validation is NOT mocked. Positive
non-ES tests mock existing DAL/auth/source/model transport; the synthetic
RESEARCH_ONLY frontier is an isolated admission/transport fixture, not scholarly
source or novelty acceptance.

- Expanded fresh Vitest: **442/442 PASS, 16 files**, start 11:33:53,
  duration 8.48s. Includes separate reviewer's 91 controls; those are not Builder
  tests and not an added second count of the same run.
- Cohort: math-research-commitment-kernel, math-research-commitment-review,
  math-lrc-commitment, math-cycle-action, math-adaptive-kernel,
  math-lrc-research-loop, math-cycle-worker-transport, codex-local-cycle,
  math-cycle, math-adaptive-strategy, math-adaptive-corridor, math-lemma-graph,
  math-lrc-research-loop-review, math-lrc-loop-readiness,
  math-lrc-loop-readiness-review, math-lrc-proof-unit-cycle-refusal.
- Scoped ESLint: **PASS, 0 errors/0 warnings**, seven product files plus eight
  Builder fixture/test files. `git diff --check` scoped tracked edits PASS.
- TypeScript: final fresh `tsc --noEmit --incremental false` **PASS, exit0**
  after all product and legacy fixture corrections; no emitted files.
- Build **SKIP**: no UI/routes/schema/dependency changes; active local `.next`
  server must not be overwritten. Fresh installed-guide-compliant action,
  adapter import, worker transport, real-kernel tests and full typecheck are the
  proportional offline verification. No network/build activation inferred.

Exact final cohort command (prepend the six OFF assignments above):

```sh
./node_modules/.bin/vitest run tests/unit/math-research-commitment-kernel.test.ts tests/unit/math-research-commitment-review.test.ts tests/unit/math-lrc-commitment.test.ts tests/unit/math-cycle-action.test.ts tests/unit/math-adaptive-kernel.test.ts tests/unit/math-lrc-research-loop.test.ts tests/unit/math-cycle-worker-transport.test.ts tests/unit/codex-local-cycle.test.ts tests/unit/math-cycle.test.ts tests/unit/math-adaptive-strategy.test.ts tests/unit/math-adaptive-corridor.test.ts tests/unit/math-lemma-graph.test.ts tests/unit/math-lrc-research-loop-review.test.ts tests/unit/math-lrc-loop-readiness.test.ts tests/unit/math-lrc-loop-readiness-review.test.ts tests/unit/math-lrc-proof-unit-cycle-refusal.test.ts
```

## Issues, corrections and deviations

No TIP/authority expansion. Contractor-approved L2 choices: deliberate fixed37
SOURCE_REFUSED; unsupported adapters fail closed; offline LRC continuation
refuses without authoritative history; necessary historical fixture corrections.

Draft failures were not hidden: mock call accumulation and widened enum/empty
mock argument types; unused imports/prefer-const lint; frozen fixture mutation;
whole-input/strict-host validation; root history comparison accidentally used
full object identity rather than five root scalars; source packet gate separate
from dossier; work-accounting phases/order; epoch recomputation; closure plan,
approved replay/order, later-round provenance and partial-completion semantics.
Reviewer caught marker-after-work and tool-before-work helper holes; fixed and
fresh negative controls passed. Earlier expanded cohort was 434/441 PASS with
seven genuine historical expectation failures; final corrected cohort is above.

Historical test accounting is explicit: **11 old ES runtime scenarios were
superseded**, not claimed as retained live coverage. They are replaced by three
distinct accurate legacy default/V2/outbox refusal cases plus one passive
historical policy/source/ledger/prefix/graph-seal control. Their old specialized
runtime fault checks are NOT exercised by those three refusals. Existing
strategy/corridor/graph tests verify their own layers only. Three old LRC loop
actionable-pivot expectations and two TIP069 review expectations now retain
exact accounting/refutation/equivalence semantics but require no next selection
without commitment. Five TIP064 proof-unit exclusions gained an explicit typed
choice so all five original exclusion seams still execute and refuse distinctly.

Operational prerequisites remain: old UI lacks confirmed typed choice and
therefore refuses; fixed37/LRC readiness source loader deliberately refuses
changed source bytes (the ES kernel does not automatically import that loader).
New ES runs refuse before unsupported pre-planner mixed-core V3; structural
probe, steering replay and solver-authored arithmetic tools need later typed
adapter work. No generic universal certificate claims are admitted. This task
does not certify a scientific reproduction or live campaign. Separate reviewed
source closure and exact human gates remain necessary. The preexisting
Contractor XC07 seven-file inventory gap is Main-owned and untouched.

## Exact Builder file freeze

Created core, fixture, two tests and this report; modified six actual product
seams and five necessary legacy test files. No other Builder writes.
SHA-256 of the 15 source/fixture/test files (report hash is external, avoiding
self-reference):

| File | SHA-256 |
|---|---|
| src/modules/research-sandbox/math-research-commitment.ts | 8a2b14fcd169898eb8a31947e8d7735257fa24aeba91d73fa0bcb804f10c1dae |
| src/modules/research-sandbox/math-cycle.ts | 4d4c805af62d5bca8d92c721ec585a0b05b64e90613cab1be1180660115c8099 |
| src/modules/research-sandbox/math-cycle-kernel.ts | 1b9968c57e86cabeed4a39429861c62467d08094a843e8121be17fed7f48a46b |
| src/modules/research-sandbox/math-lrc-research-loop.ts | f3ec6861223d31900f9ad80f68b61fff2180e2d0e0c6f010a6f09b0fbccf22e2 |
| src/modules/research-sandbox/adapters/codex-local-cycle.ts | 142fe870fc5ead469adbc7b3b94c3a9314716a9f97d960d08d93c110f23b25c3 |
| src/server/workers/research-sandbox-cycle.ts | dedada6c512b22da37c2e124a57d1eb8f5740464e640d6330a8fff6f83d1f8ff |
| src/app/actions/research-sandbox.ts | 1227ad6e23b3d74804cc267c1420dde1f35a653bc670cb8a3bddeaa1dd79d7e8 |
| tests/fixtures/math-research-commitment.ts | 47514e8e8206f0d2ee7f8d50e76c09be159f8c690535e10ebf6ea5761f50883f |
| tests/unit/math-research-commitment-kernel.test.ts | 86c5ed4b8f1a06091001d79934bf2d9d135453344eacbf2b843d430addf676f9 |
| tests/unit/math-lrc-commitment.test.ts | f0b804798497e85aff4c552c85e07d0cc43601c229e83332d43d7a369eefd5e3 |
| tests/unit/math-cycle-action.test.ts | f7f62b498db721cfdeb379cd3ceefdaeac9fced7c411f83dd09253b14e312ee6 |
| tests/unit/math-adaptive-kernel.test.ts | 876075b14ffaebb28ad8ac9e7eda6a3377b1087b75b8d9446483f6a73e6787f7 |
| tests/unit/math-lrc-research-loop.test.ts | b059a55e6c3899e5eade9adaf4e9c2495f60f8a920507550528b6f78c4a90c17 |
| tests/unit/math-lrc-research-loop-review.test.ts | 9082966cf627d537a5a6da977eca7ab9a5b9c2ceaddd1570aaac7109c3b27581 |
| tests/unit/math-lrc-proof-unit-cycle-refusal.test.ts | 715aa96dd3e735b55b0237b6b305bf23ec47baea87bcb5d2435f8cdbdeba3db5 |

Reviewer-owned new test inspected SHA
`70266a2c3db3fedaf222517690f586995793a0c8a7f98aef0a1f6013f2d30690`.
No Builder edits to it or Main-owned charter/TIP/manifest/handoff.
HEAD `4d108227498d3578c9ac3fe60305c10da5aa905b`, branch
`codex/tip-023a-organization-graph` unchanged. No commit/push/deploy/billing,
DB/session/API/model/native worker/M1/private diagnostic access. Main separately
audits dirty-checkout preservation and unrelated inventory gaps.

## Suggestions and next routing

Accept only engineering anti-drift behavior after independent frozen review.
Do not silently repair pins or turn unsupported adapter refusal into science
authority. A next reviewed task may add exact typed adapters/UI explicit-choice
support and source closure; a research target/milestone must be chosen and
confirmed separately. Stop now for Contractor/human routing.
