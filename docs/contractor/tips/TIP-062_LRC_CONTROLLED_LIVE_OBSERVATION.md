# TIP-062: LRC controlled live observation

## Header and authorization

- Project: HIVE OS; priority P0; depends on accepted TIP-061 A/B.
- Working directory: /Users/os/hiveos.
- Approved scope: docs/proposals/BLUEPRINT_TIP-062_LRC_CONTROLLED_LIVE_OBSERVATION.md,
  SHA256 f74b2114218eb7d6a533aec9797a649ec5549a384984a35c5064c731711c3009.
- Human replied “Tiếp tục” directly to the approval request on 2026-10-04.
  Contractor treats that contextual instruction as approval of this proposal;
  no literal approval phrase is required. No broader autonomous run authorized.
- Contractor designs/verifies; Builders implement and report. Reuse existing
  architecture; escalate any scope/security/contract change before implementing.

## Task and ownership

Implement exact-target outbox dispatch and job claim, a one-shot authorized
local p83 driver, and passive campaign UI. Core, driver and UI Builders own
separate files; coordinate interfaces, do not overwrite each other's work.
No model/DB write/flag/server/browser action by Builders during implementation.
Contractor authorizes one conditional live run only after offline acceptance.

Read AGENTS.md, durable handoff and approved proposal before work. UI Builder
reads frontend-design skill and installed Next server/client/page guides.
Preserve the dirty tree, historical source/artifact/report pins and contracts.

### Core

Add optional bounded exact-ID selectors to dispatchOutboxBatch and claimJobs.
Given absent selector, preserve existing behavior. Given supplied selector,
every candidate/mutation query including exhausted-lease cleanup is tenant-
and ID-constrained before limits. Empty/malformed/cross-tenant selectors refuse
or select nothing, never select all. Preserve atomic SKIP LOCKED, capability,
audit, lease and expected-version fences. No migration or widened caps.

### Driver

Provide explicit local preflight/run modes with injected seams for offline
tests. Fixed workspace mathematics-pilot-lab-156de0 and mission
31943653-4a30-462a-af11-ecd99f9ebfa2, preset ALLIKVERE_P83_14_V1;
resolve authorized tenant/requesting actor, never choose arbitrary first admin.
Same-model sealed calibrations and no conflicting active case are mandatory.
Missing/ambiguous prerequisites STOP with no backfill/bypass/new-case retry.
Use normal command APIs and capture authorized exact case/run/outbox/job IDs.
One solver job, then only its automatic review job; no duplicate review.
Existing gpt-6-sol local subscription adapter, no model override or paid API.
Process-local flags only, shared/web worker OFF, env files unchanged.

One original monotonic 30-minute budget includes preflight through retention;
preserve existing 240-second process, per-stream 1 MiB, parser/string, 10-second
import and 1800-second lease limits. Refuse stages without sufficient remaining
time, terminate owned children at expiry, no retry or deadline reset. Do not
naively heartbeat version-fenced jobs. If existing handlers require a narrow
optional abort/deadline propagation seam, preserve defaults and all old caps.
At most three role invocations. Retain create-only mode-600 operator receipt
with identities, timings, real outcomes/accounting and any partial failure.
Never fabricate zero usage or an accepted review after failure.

### UI

Passive selected-case campaign panel in existing research page. Use existing
Panel/StatusBadge/MathText, tokens, theme and VN/EN conventions. Show mode
RETAINED_REFERENCE_NOT_FRESH, finite claim vs global OPEN obligations, digests,
ledger validity, separate role contexts/requested model/actual usage. Render
only admitted/validated record information; malicious/mismatched records cannot
gain accepted status. Hide incompatible cycle desk/action for campaign cases.
No creation form, action, polling, import, queue or model call from GET/render.
Long digests/content wrap responsively; accessible semantics, no new assets.

## Acceptance criteria

- R1: Given unrelated pending/ready/expired/exhausted work, when exact selection
  runs, then that work is unchanged; empty/cross-tenant selectors do not widen.
- R2: Given authorized target IDs, when one-shot executes, then one solver and
  one automatic review only; uncertain/failed execution is not retried.
- R3: Given missing calibration, invalid actor/tenant, conflict or disabled
  capability, when preflight runs, then no creation/model dispatch occurs.
- R4: Given exhausted/insufficient budget, when stages start/execute, then
  refuse/abort owned work and retain failure; original limits remain unchanged.
- R5: Given invalid evidence, mutation, context collision or missing accounting,
  when three-role flow runs, then no accepted v5 review is fabricated; preserve
  TIP-061 same-facts host binding and PARTIAL/INCONCLUSIVE root restriction.
- R6: Given valid/missing/invalid campaign data, when UI renders VN/EN at narrow
  and wide widths, then scope/provenance are honest and cycle action absent;
  render invokes no side-effectful importer/worker/provider.
- R7: Given historical contracts and artifacts, when regressions, whole types,
  lint/build and pin checks run, then old behavior/digests/caps remain intact.
- R8: After R1–R7 pass and live prerequisites pass, one new case is observed
  with real persisted outcomes and at most three calls. Record browser status
  separately; HTTP health/stubs are not browser E2E. If readiness fails R8 is
  NOT_RUN with exact blocker, not waived or marked accepted.

## Scientific and operational exclusions

Evidence stays retained NOT_FRESH, not new mathematical replay. Finite p83 I/J
results are known-source conditional facts, not global14/15 proof or novelty.
All other proof obligations remain OPEN. Scientific output is dependency map
and a proposed reusable research direction only. No prime/shard execution,
paid API, model override, migration/install, billing, deployment, Git action,
formal/external acceptance or unrestricted autonomous loop.

## Completion reports

Each Builder saves a new report under docs/verification (not sealed contractor
manifest), with STATUS DONE/PARTIAL/BLOCKED, created/modified files and final
SHA256 pins, R-ID/test results with counts, errors, deviations and suggestions.
Do not claim live/browser acceptance from offline tests. Contractor performs
independent review and a quantitative final VERIFY report.
