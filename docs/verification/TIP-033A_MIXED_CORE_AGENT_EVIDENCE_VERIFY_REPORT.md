# Completion and verification report — TIP-033A

Date: 2026-10-01. Role: Builder under the existing TIP-033 architecture.
Implementation status: DONE for the bounded integration. Verification status:
PARTIAL for live scientific E2E; no new subscription-model campaign was run.

## Files and behavior

Created `math-mixed-core-agent.ts`: strict fixed V1 packet validation, canonical
root binding, replay digest checks, and two precise typed refutation IDs.
Extended math-cycle schemas/kernel to retain `MIXED_CORE_EVIDENCE` before the
first agent call and `MIXED_CORE_CLAIM_REFUTED` before source/solver dispatch.
Existing transaction locking, tenant isolation, call reservations, token/time
limits and event chaining are reused; no database migration or paid provider.
Failed replay is retained and stops with INTEGRITY_FAILURE, not mathematical
refutation. Historical traces without the marker are not retroactively edited.

Forwarded the same evidence through Codex-local portfolio/planner, task verifier,
solver scope, critic and adversary adapters and worker wiring. The inner packet
retains its diagnostic-origin scope; the outer evidence envelope is the new
authoritative cycle event. No old pinned arithmetic script was modified.

Updated cycle UI with retained replay status, scope, exact counts, root/evidence/
script/output digests and typed decisions. Updated workbench copy to distinguish
read-only preview from actual cycle execution. Added unit tests and expanded the
existing tenant-scoped database integration scenario. Updated current contractor
manifest with the new TIP; founding manifest unchanged.

## Acceptance coverage

| AC | Result | Evidence and limit |
| --- | --- | --- |
| MC-01 | PASS | Actual pinned Python replay; integration reads the committed event before planner callback. UNAVAILABLE fault injection retains error and starts zero model calls. |
| MC-02 | PASS, fixture | Five roles receive identical root-bound evidence digest. No real LLM output is implied by these callbacks. |
| MC-03 | PASS | Both IDs refuted in unit tests; single-core false assertion stopped in DB integration with exactly one planner call and no downstream calls. |
| MC-04 | PASS | Rehashed wrong roots, scope/count mutations, extra fields, duplicate/late evidence rejected; JSONB key reorder accepted; historical traces remain readable. |
| MC-05 | PARTIAL visual verification | Browser verifies updated preview and historical-cycle warning. Retained-event panel is implemented/typechecked/reviewed but not visually exercised with a new live event. |
| MC-06 | PASS within declared tests | 351 unit tests / 67 files and 8 integration tests / 1 file pass; live model campaign explicitly deferred. |

Six requirements implemented; five fully verified within the declared test
scope; one has a remaining live visual scenario. No missing implementation was
silently counted as scientific acceptance.

## Commands and observed results

- `npx vitest run --project unit --maxWorkers=1`: 351/351 PASS, 67/67 files.
- `npm run test:integration:strict -- tests/integration/math-pilot.test.ts`:
  8/8 PASS on isolated hiveos_test. Setup refuses any other database name.
- `npm run typecheck`: PASS, zero type errors.
- Targeted ESLint on this slice's module/adapters/worker/pages/tests: PASS,
  zero errors or warnings.
- `git diff --check`: PASS.
- Browser authenticated local workbench: Python match; formulas render; no
  `.katex-error` and no document horizontal overflow at desktop viewport.
- Browser Math Pilot: existing cycle records readable, explicit warning that
  no mixed-core event is present. No history rewrite or new run submission.

The first integration attempt was denied local DB access under the sandbox;
it was rerun with scoped escalation. The long multi-campaign scenario then hit
the default five-second test timeout; a scenario-specific 60-second timeout
was added, not a global relaxation. Final strict run passed in 18.66 seconds
(15.74 seconds test work). Earlier malformed test fixtures and a missing current
manifest entry were fixed; final results above are reruns, not first attempts.

## Exact provenance

- Packet SHA-256:
  `63624d65888a0c9cf8b3ebae474c7bd58e64538b4befa8d57a0627ee677f60e5`.
- Pinned Python script:
  `9da0dfd3774d9ea2162d5a31fd18c3d82d398ecf918ccae19acfbfffa64297a5`.
- Trimmed replay output:
  `2c303b38a395a86482ec8207110bf9edb9a6e96de29a1f130629d07d408aa863`.
- Browser proof: `/tmp/hive-mixed-core-agent-evidence-2026-10-01.jpg`.

## Issues, deviations and next handoff

No general semantic-equivalence detector: an untyped paraphrase still requires
critic/adversary review. These agents are role-separated, not guaranteed
statistically independent. The replay checks finite arithmetic independently;
the single-core tail remains a written argument, not a formal proof. No new
mathematical result, novelty certification, root solution or publication gate
was obtained this turn.

Deferred: production build, mobile/new retained-panel visual scenario, full
integration suite beyond this file, live subscription-model campaign and formal/
literature acceptance. Existing local server is kept; research queue remains
disabled. No commit, push, billing change or deployment.

Next bounded research action: a new cycle should explicitly seek a narrower
mixed-core hitting condition or characterize extra CRT/kernel collisions, using
these counterexamples as pre-planner constraints. It must not recycle universal
single-core rescue or universal equality P-E. Preserve separate finite,
parametric, formal and novelty gates before calling any result a breakthrough.

Vibecode Kit influenced the explicit MC-01..06 contract, negative/fault-injection
tests, manifest integrity check and fixture-versus-live acceptance accounting.
