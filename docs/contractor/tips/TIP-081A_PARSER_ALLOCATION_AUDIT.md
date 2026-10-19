# TIP-081A — Pinned parser allocation audit and real-source integration plan

2026-10-07 · SAME081D8 engineering · P0 · audit/design ONLY.
Owner “duyệt và tiếp tục” follows Main's explicit audit+plan, parser-off proposal.
Dependency: V2_CODEC_SYNTHETIC_ADMISSION_ACCEPTED_LIVE_PARSER_OPEN.

## Exact obligation and admissible evidence

Inspect the complete121634-byte pinned Acorn8.14.0 source as TEXT, identify every
allocation family and its source functions/locations, and map each to required
before-growth guards, exclusions, lifetime and independent verification controls.
Chốt a concrete private authentic-source consumer/replay implementation plan.
Full-source inspection is not a proof that all dynamic allocations are bounded;
unresolved/call-transitive/native/common-mode gaps must remain explicitly OPEN.
Do not relabel a family sample or textual search as complete semantic coverage.

A1 Verify pinned file identity/hash by bounded text inspection tooling; maintain
complete contiguous source-span coverage and source package pin. Never import,
require, eval or invoke Acorn or the target payload. No prettier/AST tool that
parses it. Fixed file only; no dependency/NFT/native tree scans.
A2 Inventory initialization, constructor, statement/expression/binding, scope,
regex validation, token/string/numeric, error/output and all enabled options,
including literal arrays/objects/RegExp/functions, growth/assignment, slices,
concatenation, iterator/callback/helper effects and recursion before guards.
A3 Map each family to guard/charge/ownership/control or pre-entry exclusion;
no unreviewed stock-parser callback/node-counter shortcut. Separate explicit
source sites from runtime-engine internals and unknown transitive costs.
A4 Feasibility: preserve64MiB/20k/200knodes/depth128/120s; largest-source historical
headroom is not AST allowance; replay retains producer reservations. Refusal is
admissible. Do not raise cap, reset budget or substitute smaller real source.
A5 Private bridge plan: authentic source ownership without public text/callback,
complete creation-stage retirement, controlled cross-version exclusion, exact
pins/real receipts, producer retirement/replay/literal ledger and no whole-graph
or mathematical closure. Existing synthetic-only pins cannot authorize real use.
A6 Independent read-only review and durable findings/completion, with precise
inspection/semantic coverage distinction. Stop after audit/plan; implementation,
parser/source integration and actual runs require separate Owner routing.

## Constraints / roles / resource

Main writes audit/TIP/plan/completion and reviews. Read-only auditors may split
contiguous fixed-source ranges and report facts; no product changes or executions.
No tests/type/lint/build/E2E/server/DB/API/Git/math/grant/.env/protectedattempt5 or
failed-root payload reads. Prior milestones and frozen code/tests/config unchanged.
Text-reading/hash/index tooling is orchestration only, not a parser implementation.
Any measured data inspection helper is charged within existing aggregate:
start781813.471875/900000ms;118186.52812499995ms left; no reset/new runtime grant.
Logical-memory claims remain separate from physical RSS/GC and hostile host state.

## Acceptance / report

Given pinned source and prior codec evidence, when every span is inspected and
allocation families independently reviewed, then publish exact source provenance,
inventory, known uncovered guards and a bounded implementation order. Audit may
complete as inspected while allocation enforcement/semantic admission stays OPEN.
Report A1–A6 separately; no runtime/test PASS claims. Any architectural departure
belongs to a proposal with predecessor preserved, not an automatic implementation.
