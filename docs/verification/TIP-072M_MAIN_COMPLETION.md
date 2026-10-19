# TIP-072M — Main acceptance: sharp shift-margin milestone

Date: 2026-10-04. Status: VERIFIED_CONDITIONAL_METHOD_MILESTONE.
Milestone ID: LRC-SHIFT-MARGIN-01. This accepts the bounded offline task,
not production TIP-072B, actual M1, an autonomous campaign, or a new global theorem.
The TIP requirement labels M1–M6 below are acceptance IDs, not actual M1 runs.

## Outcome and research value

The independently reviewed written argument establishes, for d>=3, 2<=e<d,
r=floor((d-1)/e), arbitrary real independent phases and unit residues:

`inf_(alpha,a) max_(0<=j<d) min_i ||alpha_i+a_i*j/d|| = r/(2d)`.

The lower bound uses a strict open bad arc containing at most r grid points;
the upper construction covers the cyclic grid with e blocks of r+1 vertices.
Equality is good, wrap is covered, and a matching obstruction defeats every
larger uniform threshold. This is an attained sharp minimax bound, not sampled
evidence promoted to a universal proof. Composite d is included only in the
written theorem when every residue is a unit; executable scope remains four
fixed prime classes.

| d,e | sharp exception margin | minimum good shifts | conditional all-14 margin |
|---|---|---:|---|
|3,2|1/6|1|1/13, assuming the required LRC(12) witness|
|5,2|1/5|1|1/13, assuming the required LRC(12) witness|
|5,3|1/10|2|1/12, assuming the required LRC(11) witness|
|5,4|1/10|1|1/11, assuming the required LRC(10) witness|

For fourteen moving speeds (fifteen including the stationary reference), exactly
e exceptions to prime divisibility and a lower witness tau, t0=tau/d preserves
divisible coordinates under j/d shifts. The theorem gives the displayed stronger
margins on all fourteen coordinates. They exceed 1/15 by 2/195,2/195,1/60,4/165.
The 1-Lipschitz distance norm supplies a guaranteed closed valid-time interval
of radius (gamma-1/15)/max(speed) around the constructed witness.

Four explicit tuples d,2d,...,(14-e)d;1,...,e have concrete times
14/39,14/65,13/60,12/55. The independent reviewer recomputed all 56 coordinates
with a separate Fraction scratch calculation; each minimum equals the table's
gamma. These examples require no unconstructed lower witness.

The known 1/15 all-real proof already existed in TIP-052; repeating it is not
progress. This dossier adds a sharp independent-phase limit, matching obstruction
and quantitative conditional separation. It is a SOURCE_DERIVED_QUANTITATIVE_COROLLARY
new to these reviewed program artifacts, not established literature novelty.
Source mechanism: [Allikvere, Lemma4.6](https://arxiv.org/html/2609.02604v2#S4.SS4).
We did not accept or independently reproduce the article's full computation.
Sharp independent exception phases are not a complete speed tuple's optimal
loneliness: correlated phases arising from one time are a separate research target.

Written argument: [dossier](../research/LRC_SHARP_SHIFT_MARGIN_2026-10-04.md).
Consequential review: [independent report](TIP-072M_INDEPENDENT_REVIEW.md).

## Implementation and independent replay

Builders created a pure Core, passive full-report admission checker, independent
stdlib Fraction Python reconstruction and bounded fresh-process CLI. No old
arithmetic/helper import, worker adapter, route/UI or scientific case was changed.
The admission checker rebuilds complete content rather than trusting a hash.
All 132 phase cells (66 boundary/66 open), every unit, cyclic wrap, attainable
mask family, all 1753 family tuples and four distance-sharp witnesses are retained.
The independent scratch reconstruction and actual fresh Python agree.

Main independently executed the final actual CLI with six flags OFF:
`RESEARCH_WORKER_ENABLED=false MATH_PILOT_QUEUE_ENABLED=false LRC_CAMPAIGN_LOCAL_ENABLED=false RESEARCH_OPENAI_ENABLED=false RESEARCH_CODEX_LOCAL_ENABLED=false SANDBOX_DOCKER_ENABLED=false node --import tsx scripts/operations/lrc-shift-margin-audit.ts`

Exit0, MATCH; measured outer 65.655458ms / 80863 charged operations.
Core 9.824166ms / 30852; Python 6.871749996ms / 33867; process wall48.310208ms.
Full audit stdout19515B; semantic envelope18960B, both below32768B.
Semantic digest:
`bc5e0c35ca92175882b6056edf4ddbe13fa169a085cced57edf256fbf88c92ed`.

One shared allowance covers IO/Core/remaining child budget/comparison/rereads;
ceilings stay5s/2M charged operations/32KiB/256-bit components. The fixed child is
isolated Python -I -S -B executing inspected source bytes, shell:false,
minimal external environment, bounded IO/timeout, no writable output option.
Source identity/hash is checked before and after. This establishes
LOCAL_SOURCE_BYTES_AND_PROCESS_CONSISTENCY_NOT_SIGNED_ATTESTATION, not runtime
or host authenticity, OS isolation against a malicious host, or production latency.

Coherent rehashed corruption, missing cells, wrap/equality/nonunit/sharpness/
assumption/promotion/resource/process/source drift fail without positive evidence.
Reviewer independently tested ten controls, including inherited serialization
hooks with zero invocations. A successful hash alone cannot admit mathematics.
The d5/e2 sharp-distance witness has three survivors although the family's
minimum count is one; those two kinds of sharpness must not be conflated.
Previously refuted universal two-survivor predicates stay refuted.

## Main final verification

Six flags OFF for diagnostic and regression execution, no model/provider call.

- Declared42 suites:1459/1459 PASS, start23:22:12 local, duration58.89s, exit0.
  This is1303 historical/foundation tests plus156 new tests (84Core/72Replay),
  not the sum of repeated development/reviewer checkpoints.
- Whole typecheck `npm run typecheck`: exit0, no diagnostics.
- Whole lint `npm run lint`: exit0, no diagnostics.
- Whole `npm run build`: finalexit0, compile5.1s/TypeScript26.3s/3static pages;
  standalone environment scrub/assets preparation succeeded.
  Default fetch of Inter/IBM Plex Mono failed because public Google Fonts were
  blocked. The permitted network retry fetched public fonts only; no install,
  provider request, DB or private scientific data was sent.
- `git diff --check`: exit0.
- Owned dev40178 paused for build; default restart refused EPERM. Permitted
  loopback restart57960 READY206ms at http://127.0.0.1:3001 with all six flagsOFF.
  This restores observability, not browser mathematical E2E or M1 execution.

Exact regression selectors (runner --project unit --maxWorkers=1 --no-file-parallelism):
- `tests/unit/math-lrc-method-unit.test.ts`
- `tests/unit/math-lrc-research-program.test.ts`
- `tests/unit/math-lrc-method-unit-live.test.ts`
- `tests/unit/math-lrc-matched-benchmark.test.ts`
- `tests/unit/math-lrc-matched-benchmark-finite.test.ts`
- `tests/unit/math-lrc-research-cockpit-family.test.ts`
- `tests/unit/math-lrc-research-cockpit-panel.test.ts`
- `tests/unit/math-lrc-research-cockpit-page.test.ts`
- `tests/unit/math-lrc-proof-unit-run-page.test.ts`
- `tests/unit/math-pilot.test.ts`
- `tests/unit/math-agent-review.test.ts`
- `tests/unit/math-lrc-proof-unit-live.test.ts`
- `tests/unit/research-lrc-proof-unit-audit.test.ts`
- `tests/unit/math-lrc-proof-plan.test.ts`
- `tests/unit/math-method-map.test.ts`
- `tests/unit/math-adaptive-strategy.test.ts`
- `tests/unit/math-portfolio.test.ts`
- `tests/unit/math-proof-obligations.test.ts`
- `tests/unit/math-transport-diagnostics.test.ts`
- `tests/unit/math-diagnostic-capture.test.ts`
- `tests/unit/math-diagnostic-codex-transport.test.ts`
- `tests/unit/math-diagnostic-session-auth.test.ts`
- `tests/unit/math-method-unit-worker.test.ts`
- `tests/unit/lrc-method-unit-observation.test.ts`
- `tests/unit/codex-local-math.test.ts`
- `tests/unit/codex-local-proof-unit.test.ts`
- `tests/unit/math-lrc-proof-unit-worker.test.ts`
- `tests/unit/math-lrc-proof-unit-cycle-refusal.test.ts`
- `tests/unit/math-lrc-proof-unit-request.test.ts`
- `tests/unit/math-lrc-research-loop.test.ts`
- `tests/unit/math-lrc-research-loop-review.test.ts`
- `tests/unit/math-lrc-loop-readiness.test.ts`
- `tests/unit/math-lrc-loop-readiness-review.test.ts`
- `tests/unit/math-lrc-loop-readiness-panel.test.ts`
- `tests/unit/math-lrc-loop-readiness-page.test.ts`
- `tests/unit/math-lrc-shift-replay.test.ts`
- `tests/unit/math-diagnostic-capture-v2.test.ts`
- `tests/unit/math-method-unit-durable-replay.test.ts`
- `tests/unit/math-lrc-phase-binding.test.ts`
- `tests/unit/math-lrc-phase-auth.test.ts`
- `tests/unit/math-lrc-shift-margin.test.ts`
- `tests/unit/math-lrc-shift-margin-replay.test.ts`

Independent reviewer additionally ran final156/156 at23:24:16,1.60s, actual CLI
MATCH54.215375ms/80863 and a further raw Fraction process. These are independent
checks, not extra unique tests or production performance guarantees.

## Acceptance mapping

|TIP criterion|Main final result|
|---|---|
|M1|PASS: all-real proof, quantifiers, open arcs/wrap/unit/equality independently reviewed|
|M2|PASS: matching attained upper witness and larger-threshold obstruction; exact four-class replay|
|M3|PASS: lower-witness lift and stronger conditional all-14 margins; assumptions explicit|
|M4|PASS: complete132 cells/1753 tuples and fresh independent reconstruction, truthful metrics|
|M5|PASS: coherent semantic attacks/process/source/resource controls refuse; no partial positive|
|M6|PASS in this task: final frozen review, Main regression/types/lint/build/preservation|

Thus6/6 scoped TIP-072M criteria are accepted. This is NOT a production readiness
score and does NOT close TIP-072A's A6 PARTIAL or any execution gate.

## Deviations and preservation

Vibecode Kit required Contractor/Builder/reviewer separation: Main sealed the
contract and wrote proof/acceptance, two Builders implemented, the third
independently challenged mathematics and frozen bytes. Main did not author product
code. Final source inspection and broad QA remain Main-owned.

Initial verbose rational objects exceeded32KiB and correctly refused. Contractor
approved compact reduced decimal-string tuples, preserving every branch/field/
fraction without raising a ceiling. Whole type checks caught ES2017 BigInt syntax,
narrowing and ProcessEnv typing issues; owners repaired only their new files,
then refroze pins. Earlier successful checkpoints/drift refusal were not accepted
as final evidence.

Baseline1429 preexisting files under src/tests/scripts/docs remain unchanged
except Main append-only manifest and handoff. Eleven new files comprise TIP,
dossier, Core/test, Python/CLI/test, two Builder reports, review and this report.
No old product/test/script/source proposal/history/predicate/ledger was rewritten.
Original350901B handoff prefix SHA
`8bd43b336c66c5fec6e4e32dcbae4eeda63c5e7187d96efbdab81d7b5098315c`
is preserved. Prior112 manifest entries SHA
`3b77523ee2faa2642507cac4308832daaaf88e5d6fe81198d8a18f73ad512a25`
is preserved;113-entry manifest SHA
`4d7a355ea15e86492a7cd00972f3e2fd9b12127389d31f120f809bc725e8680e`.

HEAD remains4d108227498d3578c9ac3fe60305c10da5aa905b, branch
codex/tip-023a-organization-graph; preexisting dirty work preserved.
No Gitwrite/commit/push requested or performed.

## What remains, and the next valuable research direction

Global LRC14/15, formal certification, external mathematical acceptance and
literature novelty remain NOT_ESTABLISHED. Actual agentLoop/M1/campaign NOT_RUN;
no new mathematical attempt/case persisted, no approval impersonation.
The private durable capture root was not accessed; no DB mutation/session/provider/
paid API/Codex child/archive/install/schema/migration/envfile/billing/deploy.

Read-only preparation found the next production design requirement:
scientific retention must be atomically bound to the exact current owned native
job and terminal mutation, with wall-clock lease freshness and transaction rollback.
Existing completeJob does lock its row; solver retention currently precedes that
separate completion, and review retention does not yet serialize on the owned job.
A read DTO's matching observation is not CAS authority. A proper fix needs reviewed
operation/event provenance design and authorized isolated concurrent DB checks,
not fabricated receipts or fixture admission.

The candidate107 first-party import closure is not complete executable/runtime
attestation; old42-source ceiling stays unchanged. Runtime/generated dependencies,
dynamic capabilities, phased durable storage, fresh bootstrap, exact G2 and the
worker's pre-critic independent replay still require their reviewed scope.
We did not silently widen them to run an untrusted M1.

Mathematical priority after this milestone: exploit correlations between exception
phases induced by one common base time and the actual speed tuple. Do not merely
repeat the now-exhausted independent-phase sweep or revive rejected survivor claims.

## Frozen pins

- TIP:33c6bb0b6cb550fd68b38affbb8ee26fa88b4e5b52b1083d01eec0a3de096934
- Dossier:d7bc027fface2193f135fdbb8ee4d94cecba1af25991c1c848d7a0cfe4721a60
- Core:86c23ecfd0fd68d28d093dfceebe92abf83929d5c06c17881349f674779d6132
- Coretest:022a5f928b30f208b7b7084a544a6c694d820e99e994a0b37f36cb403dc1fc4f
- Python:526ea120b5254fffd1ad1571db2ec351bd264f7ebf4f2febe6e5763e4d0ce353
- CLI:dd6bc2be517d1f26bbbadbc8fab83f2fe5cd819ab48981bef75ff7335e63cb07
- Replaytest:f131de88af93b6955fec8042ffc1ec467b328e154e7ef0184a83b7357cc100bb
- Corecompletion:2f94510ae4eb3632c7b3c76a114242ef429fed3e0f7091bfde3348e4efb2a448
- Replaycompletion:58b57e15e7b39bc8d535003ff6136bf8fb5a9bfa5b51ba6b03f078d7868dc478
- Independentreview:fb5568756dd1e0c0ab4fc980d2be7113c7e6ff5da810ac743556d1d80d0448d7

