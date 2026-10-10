# TIP-065–068 — research program draft instruction packs

Date:2026-10-04. **UNSEALED / G1 APPROVAL_REQUIRED / NOT DISPATCHED**.
Parent: `BLUEPRINT_MATH_RESEARCH_PROGRAM_V2.md`, read completely before work.
Earlier TIP-065 diagnostic proposal remains immutable and incorporated only
where consistent with the prospective privacy policy in the new blueprint.
No task in this document authorizes live models, certificate collector execution,
DB experiments, browser mutations, migration, Git, billing or deployment.

## Common context and boundaries

Working directory `/Users/os/hiveos`. Read AGENTS.md, current handoff and relevant
installed Next documentation before writing UI/server code. Use Builder role
under Vibecode Kit; Main Contractor coordinates and verifies, does not code.
Reuse existing auth/tenant, command/outbox/exact-job/worker and storage patterns
where their guarantees fit. Ordinary object storage is NOT sufficient unchanged
for private create-only captures. Preserve unrelated dirty changes.

Old contracts1/2/3, ledger1–6, historical papers/reports/receipts, renderer-v1,
fixed063packet and064failedcase remain immutable. New mathematical semantics
need additive schemas/renderer/admission; diagnostics version is orthogonal
when the mathematical contract is unchanged. Malformed new lanes refuse, never
fall back to generic old forms/actions. No guard removal in old math cycle.

Before implementation, freeze the exact prime enumerations, quantified method
statement, finite domain, new certificate schema and checker quotas specified
in blueprint§12. Contractor accepts those seal artifacts by cross-review before
Builders code; any change beyond the approved scope returns to Human. G1 alone
does not make an unfrozen arbitrary method packet valid execution input.

Source identity is not mathematical evidence. Recorded tool invocations and
actual verifier outputs are separate from model claims. No author-code execution
in this offline task; small bounded independent synthetic fixtures are allowed.
Read-only source inspection and pure deterministic fixture tests are allowed.
Network literature capture/tool enabling is a separate explicitly bounded task.

Builders report changed files, source hashes, requirement/AC counts, exact test
selector/counts, deviations and remaining debts. Independent review of Core and
Integration must use another Builder; Main reviews UI and verifies aggregate.
Do not sum overlapping test counts or quote old064tests as current QA.

## TIP-065 — diagnostic boundary

Priority P0. Owner Integration Builder. Depends on approved G1 privacy design.
Requirements R8/R11/R12; supportsR9. Engineering only, no mathematical milestone.
References: Codex math/review adapters; proof-unit observation runtime; existing
complete-byte receipt writer; storage/local.ts as a non-conforming comparison.

Tasks:

1. Implement fixed-root private capture abstraction with explicit access,
   identity, quota, retention, create-only/full-write/fsync and no-follow checks.
   Replay/purge requires the authenticated original actor with current exact
   tenant membership/capability and explicit local diagnostic permission; caller
   metadata is not authorization. Atomically reserve slot and worst-case bytes
   across processes before dispatch; enforce capture bounds and charge partial/
   orphan files. Replay expiry is not automatic deletion; expose overdue raw
   retention and bounded authorized maintenance purge, never GET cleanup.
   Filesystem access outside writable roots must be approved; refusal must not
   lead to a fallback root or provider dispatch. Stderr content capture OFF.
2. Capture exact prepared input/schema before dispatch, bounded raw stdout before
   decoding, complete or explicitly truncated manifest. Distinguish transport
   completion from admission. Keep mathematical parser semantics unchanged.
3. Add non-secret typed diagnostics and deterministic version-pinned offline
   replay by authorized opaque ID. No arbitrary-path readers or raw bytes in UI.
4. Passive sanitized projection for new failures; old064 remains UNKNOWN.

Acceptance:

- D1 Given invalid UTF-8/JSONL/protocol/tool/usage/schema, replay returns the
  correct refusal boundary, never an admitted proof or ledger.
- D2 Given nonzero/cancel/deadline/overflow, retain truthful bounded incomplete
  status. A truncated response cannot be replayed as complete.
- D3 Given wrong actor/tenant/job/role, forged authentication context, concurrent
  quota reservations, symlink, traversal, coherent hash mutation, expired capture,
  partial write or source drift, fail closed. Bound storage under concurrent/
  interrupted capture; no dispatch after input-capture failure or repeated
  provider attempt. Expired raw remains accounted until authorized purge.
- D4 Given raw sensitive-looking strings, only allowlisted codes/paths appear
  in logs/UI/tracked reports. No stderr/env/auth/history export or raw GET route.
- D5 Given old064history, retain all digests and missing cause/context; synthetic
  response demonstrates only prospective behavior, not recovery of old bytes.

Output: new `TIP-065_*_COMPLETION.md` and independent review; exact D1–D5 results.
No live observation as part of completion; propose it only after aggregate QA.

## TIP-066 — goals, master obligations and applicability

Priority P0. Owner Core Builder. Depends G1; may proceed alongside065.
Requirements R1/R2/R3/R4/R11/R12; supportsR5/R9/R10.
References: method-map, adaptive-strategy, portfolio, proof-obligations,
lemma-graph and LRC proof-plan. Reuse pure contracts/canonicalJson/hashing.

Tasks:

1. Implement an additive domain-specific baseline/projection: mode, exact
   statement/convention, trust policy, root, methods, tools and finite limits.
2. Deterministically expand LRC master obligations from the23aggregate baseline
   entries into typed per-prime stages and explicit log-closure. Derive state
   only from accepted artifact references; validate edges/acyclicity/source
   consistency/coverage denominators. Keep master separate from small subgraph.
   Require admitted semantic implication evidence for each closure-critical
   edge, with exact statement/domain/quantifier and assumption alignment.
3. Add LRC method cards and applicability matching using predicate/premise IDs.
   Satisfied/open/refuted, source-adopted and missing capability remain distinct.
4. Explain method ranking by root contribution, discrimination, readiness and
   estimated cost/uncertainty. Defer missing tools, permit explicit conditional
   branches under policy, reject refuted predicates.

Acceptance:

- C1 Given14runners and15runners, preserve13/14moving-speed convention, source
  v2 and separate61/71prime sets; archived111prime set cannot substitute.
- C2 Given only p83 terminal evidence, no aggregate61 closure or15theorem status.
  Missing analytic/lower/prime/log premise remains visible on critical path.
- C3 Given source-adopted premises, produce only the appropriate conditional
  status. Connected graph/roundclosed/modelvote cannot prove an implication.
  Given all prerequisite nodes marked closed but a missing, mismatched or false
  implication edge, root closure must refuse. DAG connectivity is not evidence.
- C4 Given a source publication badge but wrong premises/tool, reject/defer
  applicability. Missing tool cannot be created by a model field.
- C5 Given older/malformed contracts or coherent scope substitution, preserve
  old encodings/digests and refuse cross-lane use; no new cycle actions.

Output: new `TIP-066_CORE_COMPLETION.md`, independent review, APIs published for
067/068 and exact registry size/quota decision. No DB migration/schema table.

## TIP-067 — reusable method unit and bounded research loop

Priority P0. Owners Core + Integration with disjoint ownership agreed before
edits. Depends066; diagnostics integration depends065. Requirements R5/R6/R7,
supportsR1/R2/R3/R4/R10/R11/R12.

Tasks:

1. Implement prospective LRC method-lane preparation, explicit experiment
   contracts and host-only evidence binding through existing authorized jobs.
   Do not unlock old ES cycle. Version mathematical semantics additively.
2. Prepare the few-exception shift reproduction unit with exact assumptions and
   step/statement alignment, independent finite arithmetic checker and explicit
   conditional ceiling for universal/lower-case/real-time reasoning.
   Pin fourteen positive integer speeds, prime d, e nondivisible entries,
   m_d=ceil(2d/15), e>=2 and e*m_d<d, plus LRC(m) for1<=m<=12. Initial
   fixtures target d3/e2 and d5/e2..4. Rational offset samples are not a verifier
   for the universal real-time assertion; retain that analytic proof debt.
   Enforce blueprint§12 finite checker quotas; larger domains return UNSUPPORTED.
3. Add a discovery-candidate contract, not a hard-coded successful conjecture.
   Require falsifiable statement, source differences, potential gain, strong
   objection, discriminating output and novelty-pending status.
4. Implement bounded stop/pivot projection: operational errors stop; admitted
   exact counterexample blocks exact predicate; duplicate/equivalent claims
   need certified relation, not text matching. Review gaps become root-linked
   tasks only. Reserve reviewer time/calls before dispatch.
5. Add tool registry bindings and mutation fixtures for finite soundness and
   completeness. Fresh-chain output binding must be specified, but do not run
   real generation/cascade/terminal collectors in this task.

Acceptance:

- M1 Given valid shift parameters, pure verifier confirms only the exact finite
  claims. Missing lower theorem/universal alignment stays conditional/open;
  no claim that finite tests prove all LRC instances.
- M2 Given near-miss hypothesis, wrong boundary, incomplete partition, overlap,
  non-unit, source drift or coherent rehash, reject certificate/applicability
  precisely; not a fabricated mathematical counterexample.
- M3 Given model-written checker receipt or unavailable formal kernel, no
  accepted tool/proof status. Same-model independent contexts stay labelled
  operationally separate, not statistically independent.
- M4 Given exhausted resources, integrity/transport failure or no-discrimination
  experiments, stop/pivot within approved contract, no new prime/forest/retry.
- M5 Given historical064 and legacy cycle refusal, retain exact records and
  guards. Every new output needs its own case/run/source/predicate binding.

Output: Core/Integration completion and cross-review. Offline tests only; live
SOLVER/CRITIC/ADVERSARY demonstration is G2, not part of offline test evidence.

## TIP-068 — research cockpit and comparative benchmark

Priority P1. Owner UI Builder for cockpit; Contractor scopes benchmark; Builder
implements offline harness. Depends065–067. Requirements R9/R10, presentation
ofR1–R8/R11/R12. Use frontend-design, HIVE tokens/fonts/KaTeX and existing route.

Tasks:

1. Compose goal/mode/retained strategy, master obligations/critical path and
   evidence investigation into existing Math Pilot. Archive old panels under
   disclosures; no historical status rewrite or more top-level TIP panels.
2. Show operational errors, missing roles/usage, source assumptions, finite
   scope, conditional/formal/external/novelty dimensions distinctly.
3. Create matched benchmark case/manifest/report fixtures for known lemma,
   incomplete certificate, false candidate and discovery candidate. Compare
   direct vs assisted cost/access/exposure identically, report actual unavailable
   data. Harness preparation does not call providers.

Acceptance:

- U1 Given p83/sourceconditional/failed064 data, no global proof/progress badge,
  invented active strategy or precise old failure cause.
- U2 Given VN/EN long math content at320/390/768/1440px, readable safe TeX,
  no structural overflow; text prose and hash provenance retained. Missing
  browser observation yields NOT_RUN visual acceptance, not screenshot claims.
- U3 Given authenticated GET or malformed new-family records, no fetch/import/
  replay/preparation/model/write/polling, no old controls regained.
- U4 Given paired fixture, all budgets/source exposure/tools/model match; missing
  usage is unavailable, not zero; known-source-visible case not held-out.
- U5 Given report totals, distinguish engineering tests, experiment outcomes and
  mathematical admissions. One paired pilot cannot establish method superiority.

Output: UI/harness completion. Main verifies focused suites, type/lint/build,
historical pins and independently reviews privacy/semantic/UI consequences.

## Closing report and subsequent gate

Contractor final report maps all12requirements to evidence, reports unique
tests/suites with exact selectors, types/lint/build outcomes and all deferred
work. Gates/calls/checker operations remain OFF through this offline phase.
If G1 is not approved, none of these packs is executable authority.

After offline PASS, propose ONE new M1 experiment manifest (G2) with exact unit,
actor/tenant/model/calibration/tool scope/caps/IDs/no retry. Old064 remains
failed; do not reconstruct its response or use the old one-shot approval again.
