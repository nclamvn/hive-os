# TIP-081A — Bounded AST/certificate design completion

2026-10-07 · SAME081D8 engineering.
STATUS: DONE for design only; DESIGN_REVIEWED_IMPLEMENTATION_NOT_RELEASED.

## Established now

Previously source-only evidence had no reviewed private consumer contract and an
ambiguous receipt hash name. The new specification supplies exact v2 wire schemas,
canonical seal rules, historical v1 contextual verification, private owner/replay
seam, charge-before-growth requirements, full allocation-audit prerequisite,
explicit conservative lifetime accounting and implementation-routing boundaries.
It identifies concrete unsafe allocation boundaries in pinned Acorn source by
text inspection, not execution. It does not establish a working bounded parser.

## Requirement coverage and verification

B1–B6 specified/reviewed6/6 (100% DOCUMENT coverage; code coverage0/6 for this new
contract). Fresh-context reader review found five revision1 gaps; all addressed
in revision2. Final peer verdict CLEAR within those findings/review scope; Main
accepts scoped design completion. Review history preserves failures/refinements.
Future adversarial control groups8/8 specified, all UNRUN, not test passes.

Technical health this turn: build NOT RUN; typecheck NOT RUN; lint NOT RUN;
unit tests NOT RUN; parser NOT IMPORTED/INVOKED; E2E NOT RUN. Prior402/40214files,
lint4 and wholeTSC belong to source-store predecessor, not this new design.
Read-only repository status/source inspection and document editing only.
No actual failed-root source acquisition, runtime, browser/server, DB/API/model,
Git commit/push, math, materialization, billing/deploy or publication effect.

## Files changed

Created:
- docs/contractor/tips/TIP-081A_BOUNDED_AST_AND_CERTIFICATE_DESIGN.md
- docs/verification/TIP-081A_BOUNDED_AST_DESIGN_REVIEW.md
- docs/verification/TIP-081A_BOUNDED_AST_DESIGN_COMPLETION.md

Appended route/completion only:
- docs/research/ACTIVE_RESEARCH_COMMITMENT.md
- docs/CODEX_CHAT_HANDOFF.md

Frozen product modules/tests/parser, real receipt/capture and other dirty work were
not edited. No fresh46pin runtime verification is claimed this step.

## Remaining gaps / stopping

The new adapter, complete allocation coverage/cost proof, source-consumer module,
codec, replay integration and semantic completeness checks are not implemented.
Stock parse and post-parse counts are inadmissible. Logical64MiB is not RSS/GC.
Producer-AST charge is not reclaimed merely on reference disposal; replay may
honestly refuse for lack of headroom. Shared grammar/ownership infrastructure
retains common-mode risk. No guarantee largest source can fit; no smaller-source
substitution/full-graph claim allowed. Caller whole graph OPEN/fullruntime
NOT_ACCEPTED; predecessor62OPEN unchanged; no mathematical milestone.

Budget upper remains771254.1296670001/900000ms, remaining128745.87033299985ms.
No new execution grant or reset. STOP after approved design/review.

## Proposed next decision — not granted

Approve bounded synthetic-only v2 codec + private-consumer admission/coordinator
implementation, parser disabled, with hash/schema/ownership/refusal controls and
codec/admission allocation inventory. Stop at that seam. Complete adapter audit,
parser implementation and actual fixed-root parse require later distinct routing.
Do not infer approval for build/E2E, additional real-root runs or broader research.

Skills influence: Vibecode separates Contractor design from future Builder code
and retains TIP/completion evidence; doc-coauthoring reader testing exposed five
specific specification ambiguities before any implementation was released.
