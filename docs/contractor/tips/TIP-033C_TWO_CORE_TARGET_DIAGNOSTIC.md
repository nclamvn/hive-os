# TIP-033C: Persist bounded two-core target replay

Priority P1, local research tooling only. Depends on the mathematical note
docs/operations/MATH_PILOT_TWO_CORE_TARGET_2026-10-01.md. Working dir /Users/os/hiveos.
Owner continuation includes a target-sensitive attack; no new architecture,
provider, root contract or live campaign. Main agent is Contractor; Builder
implements fixed operational replay scripts and unit controls.

## Requirements / acceptance

- T-01: Persist reproducible TS signed-box comparisons and independent Python
  integer-divisor replay for a1..8, odd primes ell<=997 (1336 rows), exact set
  formula and minimum3*2^a-1. Match the note's c1d4916... manifest.
- T-02: Persist complete no-s-ceiling divisor-criterion audits ONLY a1..4 for
  p131433121,159727681,351121,171348241, matching all four note manifests.
  Independently verify all reported normalized witness pairs/strict identities;
  retain at least the four named p131/p159 tuples in a fixed packet.
- T-03: Compare fixed Python stdout with TS packet; resource-bound the read-only
  tool with isolated flags, <=10sec and <=256KB output, source hash. No arbitrary
  input or model code. Scope must say larger a remain uncomputed; theorem tail
  does not imply complete all-exponent computational audit or root success.
- T-04: Unit tests check expected controls, positive identities, comparison
  mismatch, and unchanged historical caps. CLI must exit nonzero on unavailable
  replay/mismatch. All testable outputs finite and exact.

## Constraints and report

No app UI/agent integration, DB, worker, paid API, formal/novelty promotion,
commit/push, or unrelated-file edits. Reuse existing strict checker and arithmetic
helpers when domain permits; do not change pinned old sources. Do not edit math
note, handoff, TIP or other Builder's files. New files prefixed two-core-target
or math-two-core-target to avoid conflicts. Do not expand factorization bounds.
Checkpoint reuses the note's proof and continuation; no separate interview.
Write docs/verification/TIP-033C_TWO_CORE_TARGET_COMPLETION_REPORT.md with
STATUS, files, T01..04 results, issues, deviations, suggestions. Main agent
will independently verify and add report/handoff.
