# TIP-082 — Main verification / lean developer lane

2026-10-09 · LEAN_RESEARCH_DEVELOPMENT_082 · ENGINEERING.
STATUS: DONE / READY_SCOPED_DEVELOPER_SLICE. Whole-product readiness NOT_ESTABLISHED.

## What changed

An executable, ordinary developer route now runs cheap checks before extended
source audits: `npm run research:check` performs syntax → actual-source strict
types → focused regression tests → real CLI arithmetic replay smoke. A failed
stage stops subsequent stages. `npm run research:replay` exposes the same known
public synthetic arithmetic observation separately.

No custom parser, dependency census, grant engine, database, new UI or evidence
issuance was added. Existing checker and existing tests are reused unchanged.
This is an incremental correction of development practice, not a product rewrite
or a completed autonomous research campaign.

Files: package.json (two aliases), scripts/research/check.mjs and replay.mts,
tsconfig.research.json, vitest.research.config.ts,
tests/unit/research-development.test.ts; README, DEVELOPMENT_DIRECTION, TIP-082,
protocol and append-only ACTIVE/handoff; Builder and non-own review reports.
The earlier new replay.ts entrypoint was moved to replay.mts, not duplicated.
Unrelated dirty repository changes were preserved; no commit/push performed.

## Actual final Main validation

Main invoked the two package commands serially through standard spawnSync,
120000ms timeout per command, stopping on error/signal/nonzero status. No API,
DB, build, install, browser or R3 effect was invoked.

| Observation | Result | Actual elapsed |
|---|---|---:|
| Node syntax stage | PASS |32.2ms|
| Focused TypeScript strict/checkJs/noEmit | PASS, zero diagnostics |2526.3ms|
| Vitest stage | PASS,2files/63tests |745.8ms|
| Actual replay CLI smoke | PASS, nonempty labelled arithmetic output |234.3ms|
| Check internal total | PASS |3540.2ms|
| Enclosing npm research:check | exit0/no signal/no error |3690.539ms|
| Enclosing npm research:replay | exit0/no signal/no error |236.115375ms|

Vitest reports466ms, setup0ms, tests117ms. Actual final denominator is existing52
plus new11, not the earlier59 or the erroneous "eight new" source description.
The old checker's hostile intake/wrong-answer controls and exhaustive n=1..8
permutation controls ran; finite controls do not prove a universal lemma.

Final standalone checker elapsed2.592459ms, rational operations76, gcd iterations
2196, peak integer bits258. Observed result SUPPORTED_UNDER_LEMMA_ARITHMETIC:

```
floor = 499999999972
6299999999649229/12600 < X < 4999999999729/10
```

Exact synthetic candidate digest
fa69d94db5489d26e4d2ccb3f19a9fe3505446d2c900052c5238ceb999c187ae.
The observation explicitly sets freshSolverResult=false, noveltyEstablished=false,
authorityGranted=false, proofValidation=NOT_VALIDATED_NON_FORMAL_REVIEW_REQUIRED,
formalProof=NOT_ESTABLISHED, officialScore=NOT_ESTABLISHED. Arithmetic uses the
existing structural/expectation lemma as an assumption; no new proof or model
capability result was obtained. Matching numbers are not proof acceptance.

## Failure history and engineering lesson

1. Initial Builder check: syntax/type/59tests PASS, internal2946.6ms.
   Standalone tsx CLI failed with IPC listen EPERM before the checker; enclosing
   replay187.8ms. No arithmetic success from that invocation.
2. A launcher-only repair to node --import tsx still failed: replay.ts transformed
   as CommonJS, top-level await unsupported. Main check still59PASS/typesPASS,
   enclosing3160.298375ms; replay failed at341.292666ms before the checker.
3. Proper repair: explicit ESM .mts and an actual CLI smoke in the default check,
   including an empty-exit0 refusal control. Actual final results above passed.

Both failures remain recorded. Source review, mocked tests and TypeScript alone
had not established executable entrypoint health. The repair fixes that gap
without a source-proof stack. Contractor also removed its unnecessary newly
self-imposed one-repair rule; it was not a human-specified R3 condition.

Resource ceiling remains600s aggregate new developer validation,120s invocation.
Builder's initial outer check time was not captured, so retain its whole240s
maximum allocation conservatively (not measured elapsed). Both Main batches
total7428.245416ms measured enclosing time: conservative combined upper247.428246s
is below600s. This is development accounting, not a native runtime/RSS proof or
a changed scientific/R3 ceiling. No timeout occurred.

## Requirement coverage and independent review

5/5 AC implemented and accepted for this slice:

- AC1: actual orchestration fail-fast/order/deadline/timeout/signal/empty-CLI
  controls and successful real CLI smoke. Failure controls substitute the native
  runner at the real seam, not actual hostile-process containment tests.
- AC2: actual imported checker/replay/orchestrator/config/test source checked
  under strict/checkJs/noEmit/skipLibCheck=false, no source-error suppression.
- AC3: existing hostile/mismatch/tiny-exhaustive controls actually ran.
- AC4: exact arithmetic result and limitation labels observed; altered floor
  rejected in tests. No proof/formal/official capability acceptance.
- AC5: commands documented, default direction simplified, frozen R3/live gates
  untouched by this implementation. No unrequested campaign or irreversible write.

Non-own full source review is in TIP-082_INDEPENDENT_REVIEW.md. Main independently
read all new code/config/tests and exact package delta, then executed the final
commands. Reviewer source findings are not relabelled as its executed PASS.

Build, lint, full-app typecheck, integration and browser E2E: NOT_RUN. This focused
slice does not certify those or discover all defects in the dirty repository.
Trusted developer tooling is not a sandbox for arbitrary agent-generated code.

## Durable direction and remaining work

Vibecode Kit was used for one Builder and one non-own review; its minimal-process
judgment enabled removal of the unnecessary local repair gate. The durable method
now prioritizes cheap executable checks, distinguishes development from research
authority, and asks each infrastructure addition to remove a concrete obstacle.
Five product responsibilities remain dossier, adaptive strategy, solver/critic,
appropriate independent verification and evidence/UI. The next product step is
to exercise that short loop in one explicitly scoped research session, not extend
the private-tool census. It has not been run or automatically authorized here.

R3 remains DEFERRED_UNACCEPTED with original frozen source/configuration/P51 and
first-failure history: A consumed, B not run,8 obligations open,
aggregate876382.767416/900000ms, remaining15940.727166ms. No repaired/recycled A/B,
issuance, security weakening, whole mathematical closure or official benchmark.
LEAN_RESEARCH_DEVELOPMENT_082 closes; no new scientific charter is activated.

No scratch/project copy, dependency install, venv, per-TIP distDir or Docker work.
No material deletion or unrelated cleanup. Nothing was removed except the rename
of this task's new .ts entrypoint to .mts. Historical evidence is preserved.
