# TIP-070 — Main completion and observed E2E
Date: 2026-10-04 (Asia/Ho_Chi_Minh).
Disposition: READY_WITH_DEFERRED for authenticated read-only readiness only.
Full authenticated execution plus independent replay: INCOMPLETE. G2: NOT_AUTHORIZED.

## Outcome and scope

Connected the TIP-069 same-process pure planner to the approved authenticated server page through a bounded, tenant-scoped, retained-record readiness loader. Opened the actual Codex in-app browser, exercised read-only selection/reload/refusal paths, checked desktop and mobile geometry, and left the authenticated page visible.

This is not a new LRC campaign, empirical benchmark, mathematical proof, or complete live agent loop. The adapter performs passive source fingerprint checking; it does not run a finite checker, provider, dispatch, private capture writer, or independent replay. Synthetic positive tests were not persisted as actual research evidence.

Vibecode Kit v6.2 shaped the work: delegated owned implementation, independent adversarial review, and Main verification. Frontend-design shaped a quiet, literal, existing-token panel with explicit unresolved states; it did not add a fabricated progress meter or new visual system.

## Narrow acceptance

| Check | Evidence | Disposition |
| --- | --- | --- |
| Approved session and actual read scope | Fresh actual session; authorization before/after; actor/tenant drift refusal; actual authenticated browser | PASS |
| Retained identity, not latest-by-case substitution | Exact case/run/review/job/outbox linkage; foreign scopes refused before derived lookup | PASS, synthetic adversarial controls |
| Exact supported method/output contract | Frozen v4 source-free HONEST_NULL adapter, separate worker/result and dossier anchors, bounded plain JSON | PASS, synthetic positive/negative controls |
| Same-process planner admission | No injected caller grant, receipt, digest, source pin, or resolver; all-or-nothing bounded cohort | PASS, synthetic controls |
| Passive fixed 37-source check | Actual browser VERIFIED_FIXED_37; independent fingerprint audit zero mismatch | PASS, not runtime closure |
| Honest operational UI | Legacy record refused; proposed tasks UNROUTABLE; replay NOT_RUN; info/batch NOT_BOUND; dispatch/closure false | PASS |
| Actual local read-only E2E | Fresh document reload, missing selection, restore selection, disclosure, responsive checks | PASS for observed negative/legacy path |
| Positive authenticated execution/replay/task consumption | No supported positive retained method-unit run in current browser data; no production external anchors or G2 | DEFERRED |

Security boundaries: server-only loader; copied headers; real session/context; bounded 1..16 distinct case UUIDs; nested mission/workspace/organization scope; nondisclosing failure DTO; readonly authorization; no new grant authorizer. Foreign review metadata is rejected before deriving job lookup IDs (MR070-1 closed). Source checking is fixed and passive, not a scientific verdict. Exact original command identity/type/topic/payload, single attempt, terminal job/outbox state and actor linkage are required.

## Verification

Main final serial regression: 35 suites, **882/882 PASS**, zero failures; started 20:43:12 local, duration 37.85s. Counts are unique: prior 725 plus 157 new controls (Core 65, independent reviewer 59, new UI/page 33). UI Builder's 60 includes 27 prior tests and must not be added again.

All six execution flags were false. Exact command:

```sh
RESEARCH_WORKER_ENABLED=false MATH_PILOT_QUEUE_ENABLED=false LRC_CAMPAIGN_LOCAL_ENABLED=false RESEARCH_OPENAI_ENABLED=false RESEARCH_CODEX_LOCAL_ENABLED=false SANDBOX_DOCKER_ENABLED=false node ./node_modules/vitest/vitest.mjs run --project unit tests/unit/math-lrc-method-unit.test.ts tests/unit/math-lrc-research-program.test.ts tests/unit/math-lrc-method-unit-live.test.ts tests/unit/math-lrc-matched-benchmark.test.ts tests/unit/math-lrc-matched-benchmark-finite.test.ts tests/unit/math-lrc-research-cockpit-family.test.ts tests/unit/math-lrc-research-cockpit-panel.test.ts tests/unit/math-lrc-research-cockpit-page.test.ts tests/unit/math-lrc-proof-unit-run-page.test.ts tests/unit/math-pilot.test.ts tests/unit/math-agent-review.test.ts tests/unit/math-lrc-proof-unit-live.test.ts tests/unit/research-lrc-proof-unit-audit.test.ts tests/unit/math-lrc-proof-plan.test.ts tests/unit/math-method-map.test.ts tests/unit/math-adaptive-strategy.test.ts tests/unit/math-portfolio.test.ts tests/unit/math-proof-obligations.test.ts tests/unit/math-transport-diagnostics.test.ts tests/unit/math-diagnostic-capture.test.ts tests/unit/math-diagnostic-codex-transport.test.ts tests/unit/math-diagnostic-session-auth.test.ts tests/unit/math-method-unit-worker.test.ts tests/unit/lrc-method-unit-observation.test.ts tests/unit/codex-local-math.test.ts tests/unit/codex-local-proof-unit.test.ts tests/unit/math-lrc-proof-unit-worker.test.ts tests/unit/math-lrc-proof-unit-cycle-refusal.test.ts tests/unit/math-lrc-proof-unit-request.test.ts tests/unit/math-lrc-research-loop.test.ts tests/unit/math-lrc-research-loop-review.test.ts tests/unit/math-lrc-loop-readiness.test.ts tests/unit/math-lrc-loop-readiness-review.test.ts tests/unit/math-lrc-loop-readiness-panel.test.ts tests/unit/math-lrc-loop-readiness-page.test.ts --maxWorkers=1 --no-file-parallelism
```

Exact selectors:
```text
tests/unit/math-lrc-method-unit.test.ts
tests/unit/math-lrc-research-program.test.ts
tests/unit/math-lrc-method-unit-live.test.ts
tests/unit/math-lrc-matched-benchmark.test.ts
tests/unit/math-lrc-matched-benchmark-finite.test.ts
tests/unit/math-lrc-research-cockpit-family.test.ts
tests/unit/math-lrc-research-cockpit-panel.test.ts
tests/unit/math-lrc-research-cockpit-page.test.ts
tests/unit/math-lrc-proof-unit-run-page.test.ts
tests/unit/math-pilot.test.ts
tests/unit/math-agent-review.test.ts
tests/unit/math-lrc-proof-unit-live.test.ts
tests/unit/research-lrc-proof-unit-audit.test.ts
tests/unit/math-lrc-proof-plan.test.ts
tests/unit/math-method-map.test.ts
tests/unit/math-adaptive-strategy.test.ts
tests/unit/math-portfolio.test.ts
tests/unit/math-proof-obligations.test.ts
tests/unit/math-transport-diagnostics.test.ts
tests/unit/math-diagnostic-capture.test.ts
tests/unit/math-diagnostic-codex-transport.test.ts
tests/unit/math-diagnostic-session-auth.test.ts
tests/unit/math-method-unit-worker.test.ts
tests/unit/lrc-method-unit-observation.test.ts
tests/unit/codex-local-math.test.ts
tests/unit/codex-local-proof-unit.test.ts
tests/unit/math-lrc-proof-unit-worker.test.ts
tests/unit/math-lrc-proof-unit-cycle-refusal.test.ts
tests/unit/math-lrc-proof-unit-request.test.ts
tests/unit/math-lrc-research-loop.test.ts
tests/unit/math-lrc-research-loop-review.test.ts
tests/unit/math-lrc-loop-readiness.test.ts
tests/unit/math-lrc-loop-readiness-review.test.ts
tests/unit/math-lrc-loop-readiness-panel.test.ts
tests/unit/math-lrc-loop-readiness-page.test.ts
```

Whole repository: npx tsc --noEmit exit 0; npm run lint exit 0 (no errors/warnings); npm run build exit 0, compiled 5.7s/types 26.6s, static pages 3/3 and standalone environment scrub/assets prepared. Initial build could not fetch public Google fonts in the sandbox; the approved retry only permitted that public fetch, with all execution gates still off. No dependency or environment-file mutation.

Failure/repair trail was retained, not erased by the final green run:
- Initial HMR missing Core module: temporarily removed the exact new page seam, then reapplied after the real module existed; no fake production stub.
- Core mock supplied an unrequested solver job; corrected mock, kept all-or-nothing refusal.
- Frozen fixture had an unsupported extra model field; corrected fixture rather than loosening schema.
- Actual browser OPERATIONAL_REFUSED exposed an unsupported direct Mission organization filter; replaced with the real nested workspace relation and added query-shape regression.
- Reviewer MR070-1 identified pre-job-lookup foreign review handling; repaired the guard and retested.
- Initial whole type check: 30 nullable narrowing errors and one test literal union; repaired never-returning refusal declaration and typed test fixture, no unsafe production assertions.
- Initial new page mock observed inactive refresh differently; corrected observer/assertions, preserving prior product behavior.
- Initial review mutation regex falsely matched WeakSet.delete; narrowed database-mutation control.
- Mobile heading was obscured by the existing sticky header; added scroll-mt-24 only to the new panel and rechecked.
See owned reports for checkpoints and exact controls.

## Actual browser observation

Browser: existing Codex in-app browser ID 2, final tab ID 3, marked deliverable and left open.
URL:
http://127.0.0.1:3001/w/mathematics-pilot-lab-156de0/research/math-pilot?missionId=31943653-4a30-462a-af11-ecd99f9ebfa2&caseId=b396580a-7bc7-4a8d-a966-0ad3eaa3e246#math-lrc-loop-readiness

Actual existing Local Pilot session; no credentials or provisioning. Historical TIP-064 selected record remains FAILED/UNKNOWN; unavailable old adversary/critic/usage is not fabricated. Observed AUTHORIZED / AUTHENTICATED_READ_ONLY / VERIFIED_FIXED_37, LEGACY_NOT_ADMISSIBLE / NOT_ADMITTED, zero admitted tasks, PLANNING_ONLY, G2_NOT_AUTHORIZED, fresh replay NOT_RUN, independent information/batch NOT_BOUND. No forced retry of TIP-064.

Actions: actual native document reload; one missing UUID selection (00000000-0000-4000-8000-000000000070), no foreign data; restore actual record through Hồ sơ combobox and Xem hồ sơ; open details; mobile 390x844 and reset to desktop 1366x988. Final width equals viewport on both: mobile document390/panel358, heading117; desktop document1366, heading121 below sticky header64. VN observed; EN rendering is synthetic-test evidence, not an actual preference switch.

Owned dev server was stopped before build and restarted loopback-only; final exec session60226 remains available. Old browser tab encountered connection failure during restart; a fresh tab in the same browser reopened the known local URL. No unsupported interstitial bypass.

Bounded read-only local scoped job counts before/after (13:36 and 13:46 UTC) are identical:
```json
{"jobs":58,"latest":{"id":"6e20db79-00a6-48e5-aa43-5a9e49e15ba3","createdAt":"2026-10-04T05:47:40.579Z","status":"DEAD_LETTER"}}
```
This supports no new scoped research job observed; it does not claim every database table was unchanged. Only ordinary approved Better Auth session housekeeping was permitted, not scientific mutations.

Screenshots (actual JPEGs):
- artifacts/tip-070/authenticated-legacy-desktop-final.jpg — d384480565ab610280a71d80a259fa42875ed6f56f2aff1dfea890c433e173aa
- artifacts/tip-070/authenticated-legacy-mobile-final.jpg — 237e6ebce8ffbb8b98c11802b9bd1e79fdeb9301261237c6640f4bc1cea7d48d
- artifacts/tip-070/unavailable-selection.jpg — 17cebce94bfcbcfb8ef033f2d7f1a0a6e89e9c5cdffc564a5ad74165a82aeeaf
Earlier before/initial screenshots retained as checkpoints.

## Preservation and sealed artifacts

Before final handoff append, independent 1390-file baseline comparison: 0 missing, 1386 unchanged; only four authorized old paths changed (manifest, page, two mechanical mocks). Reversing only the new page seam and two mocks in memory exactly restored baseline hashes. Existing dirty work is not inferred from HEAD; preserved historical packets, proposals, renderers, source pins, and unrelated changes.

Baseline page: 21538d49e5f15217afbda4bedf4f8d83e81f6f802a469d931b7ed10ca3dd4575.
Baseline old cockpit test: 4e0f5828f1f24d0b1bcef57c70a24e8f80cf3f96147af1881b61fb2dc5e502f2.
Baseline old proof-unit page test: 6447cca18b7cc25fd61c1a2b32bfcefb3b5457da3b0ba8a9967aa5f2d4105c2a.
Original handoff prefix: 329597 bytes, b27b3903b72d3278358b0973623d1591c501202f906308829e4cdcfe09b21f26.
Manifest110 entries: 625a9902c9814f1e3a63263853d261c8d0f0117c383cdf62196d38c719eb7992; original109-entry prefix unchanged cb16faeaba2f7bdb104b3dc404002d61a30e87d77791787eb57262080d14164d.
Clarified pre-implementation TIP070 seal: 63f94205c7ffe0148431baef6463ada470fa2699197fdc39c8991d8b4e9f1e99.
Fixed37 source registry unchanged: 1f664c01e327b70c2e64b55b5e45af5604a52b4104dceb2337f37912cf539bfa; does not cover 069/070 runtime closure.

Final owned product pins:
- src/server/operations/math-lrc-loop-readiness.ts — b2a03dc3f20386ef42e7e5d81c39dcf03beb80580e52a2bb6ca5ea4798f33720
- src/components/research/math-lrc-loop-readiness-panel.tsx — 92ca20fcfc165303aa7babce6ab47c96485d6fa3b43314311a5de83d3c9432a0
- src/app/w/[workspaceSlug]/research/math-pilot/page.tsx — dbd8fb14d7bcefe5b36be99654ce3df41f91a4990a0868c8166f6d9e0edbf291

Reports:
- docs/verification/TIP-070_CORE_COMPLETION.md — 63c97eb5a092982c2c50fcfa7d9eb1316beaac20e28f615210ade01d603ea8d1
- docs/verification/TIP-070_UI_COMPLETION.md — 446adc47d8413b0b48a5a9421361ff0a592487cc4ee3368dab3bad21749a380e
- docs/verification/TIP-070_INDEPENDENT_REVIEW.md — 00bc5ea9c9022eaa4ad1b83efe28f34b748df6e2d2c73bac7595a21810e9d5c6

## Remaining work before any campaign

The full live connection requested by the user remains incomplete; the current defensible outcome is authenticated readiness and visible refusal E2E. No scientific result, new theorem, formal proof, external independence, novelty or global LRC14/15 closure has been established by TIP070.

Next requires an approved security design for durable private external replay/capture anchors and information/batch/relation/association receipts: ownership, atomic writes, fsync/crash behavior, retention and authentication refresh. Then implement actual same-process independent replay/task consumption, build an exact executable manifest covering the new runtime closure (not merely old37), bind actual actor/tenant/capability/calibration and fresh case/run/job identifiers, and request explicit G2 for ONE fresh M1. Do not retry064 or launch a forest from this read-only approval. Old M1 candidate remains DRAFT_NOT_EXECUTABLE_NOT_AUTHORIZED.

Overall program remains 7/12 COMPLETE_OFFLINE and five partial (R5/R8/R9/R10/R12); positive U2 execution/task geometry and M4 empirical result remain pending. Existing caps unchanged:30min/240s/49KiB/1MiB/32KiB/256bits/5s/2M/d3d5.

No model/API/provider login, paid call, worker dispatch, new campaign/forest, production private capture, install, schema/migration, billing, deployment, commit or push performed this turn.

