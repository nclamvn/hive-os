# TIP — Source classification in dossier editorial checks

Date: 2026-10-14. Priority P1. Depends on the local UAV update feature.

## Scope and decision

The user approved fixing remaining source false positives, visible browser QA,
commit and push, but no deployment. One Builder implements; Contractor verifies.
This is a focused bug fix: no new workflow gate, dependency, migration or model call.
The previous A/B trial and its frozen files remain historical evidence, not rerun
or rescored. No claim of method superiority follows from this repair.

## Context

Shared checker: `src/modules/authoring/quality.ts`. Optional update arithmetic:
`src/modules/authoring/update-pack.ts`. The saved synthetic UAV update currently
produces ten numeric-source false positives in narrative and evidence appendix.
Existing citation, certainty, structural and style distinctions must survive.

## Acceptance criteria

1. Given explicit input/simulation quantities and declared computations, the
   checker distinguishes them from externally asserted facts; the saved S3
   document no longer emits its ten false source warnings. No fixture IDs or
   document-specific exemptions.
2. Given a real performance claim adjacent to synthetic inputs or calculations,
   that claim still needs a source. A TEST label or APPENDIX kind is not immunity.
3. Given malformed, altered or unbound evidence and forged MATCH text, no
   mathematical verification is inferred. Existing arithmetic checks are reused
   where structured evidence is accepted; source classification is not truth.
4. Given unresolved citations or raw tool traces, publication blockers remain.
   English and Vietnamese cases and adverse mixed clauses have regressions.
5. Current editor/export/library use the shared rules without mutating historical
   revision reports. Browser QA demonstrates both the fixed case and a real
   unsupported claim; no test edits are saved over the original proposal.

## Verification and handoff

Builder reports changed files, root cause, AC results and limitations. Contractor
independently runs focused tests/typecheck/lint and visible browser QA, then
commits/pushes relevant pending update work plus this fix. No deployment or full
build unless a concrete failure requires it. Preserve user changes and disk hygiene.
