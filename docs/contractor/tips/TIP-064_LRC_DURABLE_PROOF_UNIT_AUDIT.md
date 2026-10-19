# TIP-064 — durable LRC proof-unit audit

## Header / approval

- Project HIVE OS; priority P0; working directory /Users/os/hiveos.
- Depends on062 controlled observation and063 fixed offline proof unit.
- User “tiếp tục để tạo đột phá chứng minh phương pháp” contextually approves
  the pending detailed stages A–D on2026-10-04. Approval covers the bounded
  experiment, not a promised breakthrough or mathematical acceptance.
- Approved proposal docs/proposals/BLUEPRINT_TIP-064_LRC_DURABLE_PROOF_UNIT_AUDIT.md
  SHA119e545a027c43bba63a320ffdd189659a90585d1d8679105eb7c3310bbf52b1.
  Read that proposal completely; its architecture, limits and acceptance matrix
  are incorporated unchanged. Main Contractor verifies; Builders code/review.

## Context / task

Implement a fixed prospective LRC_PROOF_UNIT request, strict contractv3 with
new lrcProofUnitScope and strict ledger6. Existing JSON columns and ordinary
requestResearchRun/command/outbox/exact-job/worker/automatic-review architecture
are reused. No migration, third executor, direct result backfill or repurposing
of historical062. Preserve old contract1/2, attempt and ledger1–5 canonical
encodings, absent optional fields and guards. Deny new family in cycle/forms/
polling even when its records are malformed.

Fixed063 packet43debef344eb14197d28e9e20446a7d48ee5bcd33758e3d7c8657e0e8a269062
remains17990B/8steps/18edges/6premises/14references. Its UNEXECUTED language is
publication-time snapshot, not prospective actual consumption. New host-only
envelope retains the entire fixed packet and per-role full prepared stdin and
schema identity, contract/case/run/input/source/attempt bindings. Actual thread
and usage come only from returned Codex JSONL. Provider output cannot author
host data. All six premises and eight steps must be addressed exactly once by
every role; only CONDITIONAL/OPEN/MISSING/DISPUTED findings. Retain criticism
and refusal; never rerun to force agreement. Root only PARTIAL/INCONCLUSIVE;
separate CONDITIONAL_REVIEWED/INCONCLUSIVE/REJECTED audit status. Never infer
fresh forest, global14/15, formal proof, novelty or human acceptance.

## Phases / boundaries

A: additive implementation, offline adversarial QA, independent cross-review,
whole types/lint/build and historical pin checks. Builders must not perform
live/model/DB/browser activity. Main alone owns subsequent authorized stages.
B: after A passes, one read-only readiness for pilot.demo@hiveos.invalid,
workspace mathematics-pilot-lab-156de0, mission31943653-4a30-462a-af11-ecd99f9ebfa2.
Check membership/capability, sealed same-requested-model calibration, subscription
login and active conflict. Missing prerequisites refuse; no bypass/backfill.
C: only if B passes, exactly ONE new case with ONE SOLVER and ONE automatic
CRITIC/ADVERSARY review, requested gpt-6-sol through existing Codex subscription.
Exact captured IDs only; no paid API, retries, shared worker loop, extra case,
new prime, fresh forest, old Python semantic replay or author code.
D: actual tenant-scoped readback and complete-byte create-only0600 fsynced
receipts including failures/known IDs. Restore queue/worker/campaign gatesOFF.
Show new case; at most ONE browser observation attempt. Transport failure means
NOT_RUN visual acceptance, no repeated long-timeout retries or invented E2E.

One original30min budget; child240s; stream1MiB each; identity import10s and
fixed42files/53211840B total; lease1800s; reserve remaining role windows before
creation. Cooperative DB/FS/JS limits are not hard OS quotas. Full actual stdin
<=49152UTF8B including escaped solver attempt/review metadata/schema; packet
<=32768B; new-lane solver math output total<=16384B; per-role findings<=8192B,
summary1024/reason256chars; host audit report<=32768B. Refuse before fence/spawn,
no truncation/cap relaxation. No Git/billing/deploy/install/env-file edits.

## Ownership / dependency / design

Core Builder tip062_core: new dependency-safe pure live preparation/binding
module/tests; math-pilot.ts/contracts.ts/agent-review.ts additive schemas and
admission/outcome guards. Do not change frozen063 files. Publish API early.
Integration Builder tip062_driver: worker/review-kernel/Codex adapters/kernel/
math-cycle-kernel, prospective one-shot runtime/CLI/tests reusing old bounded
primitives and existing jobs. Do not alter062 invocation/final predicate.
UI Builder prefix_kz_ui: new passive projection/panel/tests and selected
math-pilot page family guards, no changes to062/063 panels. Read frontend-design
and installed Next guides. Keep HIVE tokens and fonts, restrained readable
research dossier, escaped original prose plus explicit safe TeX companions,
native disclosures, VN/EN, actual provenance/debt distinction. No checker,
importer, callback/model, polling or write during GET/render.

Coordinate pure API/types before dependent integration. Cross-review Core and
Integration after source freeze; Main reviews UI and aggregate. Any materially
different architecture/model/runtime/scope requires human direction, not silent
expansion. Preserve unrelated dirty work and immutable historical documentation.

## Acceptance criteria

- R1 Given new fixed request, route exactv3 without genericOPEN field loss;
  legacy digests/absence remain identical; cross-lane substitution refuses.
- R2 Given actual prepared inputs, retain full immutable packet and recomputable
  stdin/schema/input bindings for each role; provider-authored host fields refuse.
- R3 Given existing jobs, enforce exact dispatch/fences/tenant locks, three
  distinct actual contexts and ledger6 retention without duplicate/retry.
- R4 Given promotion/source/quantifier/missing-findings/shared-context/usage/
  cross-case mutations, including coherent rehash, fail closed conservatively.
- R5 Given VN/EN passive UI, show actual roles/inputs/provenance and failures;
  malformed new-family data cannot regain old actions/polling. Preserve062/063.
- R6 Given historical pins, original caps/42file identities/106sealed entries
  remain unchanged; focused tests, whole types/lint/build pass, no migration.
- R7 Given offline one-shot refusal/failure tests, no model executes. Approved
  real stage either yields one traced valid outcome or explicit NOT_RUN/
  PARTIAL_OR_FAILED with known IDs/actual receipts, not repaired agreement.
  Browser acceptance is a separate result.

## Reports / decisions

Each Builder saves new docs/verification/TIP-064_*_COMPLETION.md with final
source hashes, R-ID counts, tests/failures/repairs and limitations. Independent
review reports are new files; do not rewrite063/062 reports. Main saves quantitative
VERIFY and append-only handoff. Coverage separates implementation, actual local
observation and mathematical acceptance. Sealed proposal remains outside manifest;
append this implementation TIP only, without historical resealing.
