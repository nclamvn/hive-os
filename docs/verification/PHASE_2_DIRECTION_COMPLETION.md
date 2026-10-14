# Phase 2 direction and repository cleanup — 2026-10-14

## Delivered

Owner directly approved recording the strategic correction in a Phase 2 PRD,
cleanup and commit/push. Base checkout: `f151bf5`, existing branch
`codex/tip-023a-organization-graph`.

- Added `docs/product/PRD_PHASE_2.md`: domain skills/resources and small tools
  on existing agents first; standalone work needs a named customer need and
  evidence of added value. Requirements, non-goals, measurement limits, proposed
  investment thresholds and stop conditions are explicit.
- README, AGENTS, research direction and team handoff now route future feature
  selection to that PRD; no new runtime guard, schema or user-facing ceremony.
- Added an evaluation index preserving the UAV ties, ERP 37/40 vs 34/40,
  blocked Dayton preparation and unrun Santa Fe proposal.
- Parked Santa Fe; appended methodology corrections without rewriting its
  original unexecuted protocol/rubric. New-to-project public cases are not proven
  model-unseen; same-coordinator rubric is not independent expert assessment;
  small operator samples do not establish ROI.
- Retained completed ERP sources/outputs and added a 26-entry byte receipt.
  Its frozen protocol pin still matches the acquisition note; original answers
  and scorecard are unchanged. Added report clarifications, including ordinary
  tools/self-review for A and the limited scope of HTTP export observations.
  Three captured source files retain original whitespace through exact-path
  Git attributes; authored code/documents keep their normal whitespace checks.

## Cleanup and preservation

Removed **11 generated files** from the unrun Santa Fe proposal: eight extracted
`.txt` files and three cover-preview PNGs. They can be regenerated with
`pdftotext`/`pdftoppm` from the retained eight original PDFs; no mathematical or
completed A/B evidence was deleted. Original candidate PDFs remain local with
unchanged hashes, excluded from Git to avoid retaining incidental conference
attendee data in the pushed repository. Source origins/digests are committed.
No application module was deleted or reworked speculatively.

No project copy, install, new build directory, Docker activity, database change,
model run or deployment was undertaken. No dependency-security claim is made.

## Actual verification

- Checked 36 local Markdown links across nine changed/new entry documents:
  zero missing targets.
- Parsed six retained ERP JSON artifacts successfully.
- Verified all 26 ERP receipt entries and all eight local Santa Fe PDF hashes.
- Confirmed candidate PDF cache is ignored by Git and baseline remote/local
  branch heads matched after fetch (`0/0`) before committing.
- Inspected workflow triggers: `staging-images` is manual `workflow_dispatch`;
  `quality` has main-push/PR triggers. No publish/deploy workflow is dispatched.
- `git diff --check` passed. Source, application tests and production build were
  not rerun: this change is documentation/evidence/ignore rules only.

## Remaining scope

Phase 2 feature implementation, real customer validation and production release
are not completed by this record. K6 remains OPEN/paused. Next work starts from
one real user job and its smallest sufficient host/skill/tool solution; this
handoff does not auto-start an agent swarm, operator study or math campaign.
Commit and push outcome must be checked from Git rather than inferred here.

The write-spec guidance shaped measurable outcomes, scope and acceptance; it
did not add product gates or ask the Owner to repeat the approved decision.
