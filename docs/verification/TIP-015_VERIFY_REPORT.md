# TIP-015 Execution Operations Verify Report

Date: 2026-07-23

Overall status: `READY_WITH_DEFERRED — LOCAL VERIFIED`

## Result

Execution Fabric and Manual Provider Bridge now have a complete workspace
operator surface. The UI connects the existing governed sequence:

`APPROVED → EXPLORING → ExecutionTip → instruction artifact → external
exchange → Completion Report → BUILDING readiness gate`

No provider API, credential flow, queue, webhook, billing integration, or
independent-verification claim was introduced.

## Technical health

| Check | Result |
|---|---|
| Next.js 16.2.10 production build | PASS |
| Type errors | 0 |
| Lint errors | 0 |
| Lint warnings | 0 |
| Unit tests | 106 passed, 0 failed, 0 skipped |
| Integration tests | 99 passed, 0 failed, 0 skipped |
| E2E tests | 57 passed, 0 failed, 0 skipped |
| Aggregate tests | 262 passed |
| Serious/critical accessibility violations | 0 |
| Mobile horizontal overflow at 320px | 0 |
| Schema migration | Not required; all 11 existing migrations current |

Targeted browser development initially used a global alert selector that also
matched the Next.js route announcer, then asserted transient success copy after
the successful mutation had removed its now-inapplicable form. Those test
selectors were corrected to use the scoped form error and durable ledger state.
The production behavior was unchanged; the complete final suite passed.

## Governed behavior

- Approved Missions can explicitly enter EXPLORING with a retained reason.
- Work packages bind one active, assurance-compatible immutable SkillVersion.
- Optional predecessor identifiers must resolve inside the same Mission and
  workspace.
- Manual issue creates an immutable SHA-256 instruction and attributed attempt
  one.
- Provider name, model/operator, execution role, and manual mode remain visible.
- Strict Completion Report JSON is parsed and kernel-validated before any write.
- Invalid and incomplete reports create no artifact, report, usage, deviation,
  or terminal state.
- Completion imports atomically retain report artifact, requirement coverage,
  technical health, usage, deviations, and run state.
- Retry is limited to the latest terminal attempt and appends history.
- Material deviations remain visible and block dependent execution until an
  authorized resolution is audited.
- Mission entry to BUILDING remains fail-closed until all execution packages
  are complete and no material deviation is open.
- Viewer projection is read-only; foreign workspace projections contain no
  records.

## UI evidence

- Desktop Execution Operations inspected in the running local app.
- The signature five-step artifact spine communicates Package, Instruction,
  Exchange, Report, and Readiness without implying automation.
- Operator forms are disclosure-based so only the current governed operation is
  expanded.
- The immutable ledger exposes package state, dependencies, attempt attribution,
  exact instruction content, artifact digests, report status, coverage, and
  resource usage.
- Responsive inspection at 320 by 844 pixels reported
  `scrollWidth = clientWidth = 320`.
- Keyboard and automated serious/critical accessibility gates pass.

## Deferred obligations

- TIP-016 Verification Operations UI remains the next local product priority.
- Settings productization follows Verification Operations.
- `OBL-FND-001`: remote reproducibility remains externally blocked by billing;
  no billing or GitHub Actions state was changed.
- `OBL-DEP-001`: fresh registry vulnerability audit remains deferred.
- `OBL-DEP-002`: pinned `pg` concurrency deprecation remains isolated for a
  dependency-upgrade TIP; concurrency checks pass.

## Gate assessment

- TIP-015: local verified.
- TIP-016 Verification Operations: next authorized local architecture/UI
  priority.
- Remote G3: blocked externally until billing is resolved and GitHub Actions
  passes on the reviewed commit.
