# TIP-072A Main acceptance — authenticated phase-read foundation

Date: 2026-10-04. Contractor: Main.
STATUS: FOUNDATION_VERIFIED_WITH_A6_PARTIAL / FULL_072_PARTIAL / NOT_READY_FOR_M1.
Sealed TIP SHA256: dbe979f4148b61625b8ebc0a421c42c884a441516072fa56138e6ff2b1ff90f5.

## Outcome and scope

Implemented two additive product modules and four new test/fixture files through
two Builders, then independently reviewed the final bytes with a third Builder.
Main used Vibecode Kit v6.2 for ownership separation, frozen interfaces,
consequential review, verification and escalation; Main wrote no product code.
Read AGENTS.md, durable handoff, applicable skill/reference instructions and the
installed Next16.2.11 data-security/server-action guides before task actions.

This is a bounded read-only foundation, not full TIP-072 or a research result.
Strict original acceptance: seven of eight scoped categories verified within
their declared offline boundaries; A6 remains PARTIAL. Do not report8/8, complete
security, authenticated live E2E, READY_M1 or mathematical progress from this work.

Core parses bounded detached immutable assertions for PROSPECTIVE -> SOLVER_ACTIVE
-> REVIEW_ACTIVE -> TERMINAL, enforcing exact-next append-only progression and
nonrenewing lifetimes. Assertions only select rows; they are not grants.
Server DAL uses actual first-party BetterAuth/native session entry points and
exact original HUMAN/session/member/mission tenant before capability evaluation.
Opaque READ handles expose sanitized observed matches for exact phase-specific
native command/outbox/job/result and retained attempt/ledger hashes. Tests mock
those first-party boundaries; no real authenticated database request was run.

Actual sequential protocol is respected: no invented future review claim while
solver runs; review owns only its active job after terminal solver retention;
terminal native jobs have cleared leases. Actual solver result is exactly six
fields with NO invented status; native review result is its actual three fields.
Hash/presence verification is not mathematical or semantic ledger acceptance.

## Consequential findings / explicit deviation

Repaired draft native-result mismatch, coherent null/primitive attempt acceptance,
and Main's P1 post-claim session-envelope shrink comparison. The final shorter-
session control proves that an otherwise still-valid refresh cannot extend the
original handle or silently lower its checked envelope without refusing it.

Independent review reproduced a residual final-boundary ownership race: a final
job SELECT can observe matching ownership, then ownership changes while subsequent
asynchronous principal checks finish. The earlier matching snapshot can return.
Adding a finite additional SELECT cannot establish atomic latest-state ownership.

Contractor approved an additive truthful narrowing without rewriting the sealed
TIP: readBinding OBSERVED_MATCH, observationConsistency COOPERATIVE_NON_ATOMIC,
historicalClaims NOT_AUTHENTICATED. Three named hostile controls intentionally
demonstrate solver/review/terminal observed-only returns and next-refresh refusal.
Passing these controls is not a repair of strict A6. All dispatch/admission gates
remain closed. NEVER use these READ handles/DTOs as072B execution/admission rights.
The actual critical operation must perform its own transaction/CAS ownership fence.
Historical CLAIMED/SUCCEEDED/capture/dispatch provenance also remains unauthenticated.

| Scoped criterion | Final Main assessment |
| --- | --- |
| A1 | PASS: strict bounded phases, immutable parsing and nonrenewing append-only progression;123 Core controls. |
| A2 | PASS offline: actual first-party entry points, original principal/session/tenant and capabilities; mocked boundary controls, not live E2E. |
| A3 | PASS observed-read scope: exact active solver native bindings, no future review fabrication. |
| A4 | PASS observed-read scope: retained terminal solver/native result and owned review; no mathematics accepted. |
| A5 | PASS observed-terminal scope: actual cleared jobs/native payloads and recomputed retained hashes; historical and semantic admission explicitly deferred. |
| A6 | PARTIAL: observed pre/post drift, lifetime, handle, privacy and error controls pass; atomic current-at-return ownership is not established. |
| A7 | PASS closed foundation: no execution/storage/replay/receipt mint or old-source modifications; historical refusal regressions pass. |
| A8 | PASS: final declared regressions, whole type/lint/build, independent final-byte review and preservation audit. |

Seven verified scoped categories out of eight (87.5%); this is not a production
security score. A6 and full072/073 must not be treated as implicitly accepted.

## Final QA on frozen product/test bytes

All six execution flags OFF. Exact final named run:

```sh
RESEARCH_WORKER_ENABLED=false MATH_PILOT_QUEUE_ENABLED=false LRC_CAMPAIGN_LOCAL_ENABLED=false RESEARCH_OPENAI_ENABLED=false RESEARCH_CODEX_LOCAL_ENABLED=false SANDBOX_DOCKER_ENABLED=false node node_modules/vitest/vitest.mjs run --project unit tests/unit/math-lrc-method-unit.test.ts tests/unit/math-lrc-research-program.test.ts tests/unit/math-lrc-method-unit-live.test.ts tests/unit/math-lrc-matched-benchmark.test.ts tests/unit/math-lrc-matched-benchmark-finite.test.ts tests/unit/math-lrc-research-cockpit-family.test.ts tests/unit/math-lrc-research-cockpit-panel.test.ts tests/unit/math-lrc-research-cockpit-page.test.ts tests/unit/math-lrc-proof-unit-run-page.test.ts tests/unit/math-pilot.test.ts tests/unit/math-agent-review.test.ts tests/unit/math-lrc-proof-unit-live.test.ts tests/unit/research-lrc-proof-unit-audit.test.ts tests/unit/math-lrc-proof-plan.test.ts tests/unit/math-method-map.test.ts tests/unit/math-adaptive-strategy.test.ts tests/unit/math-portfolio.test.ts tests/unit/math-proof-obligations.test.ts tests/unit/math-transport-diagnostics.test.ts tests/unit/math-diagnostic-capture.test.ts tests/unit/math-diagnostic-codex-transport.test.ts tests/unit/math-diagnostic-session-auth.test.ts tests/unit/math-method-unit-worker.test.ts tests/unit/lrc-method-unit-observation.test.ts tests/unit/codex-local-math.test.ts tests/unit/codex-local-proof-unit.test.ts tests/unit/math-lrc-proof-unit-worker.test.ts tests/unit/math-lrc-proof-unit-cycle-refusal.test.ts tests/unit/math-lrc-proof-unit-request.test.ts tests/unit/math-lrc-research-loop.test.ts tests/unit/math-lrc-research-loop-review.test.ts tests/unit/math-lrc-loop-readiness.test.ts tests/unit/math-lrc-loop-readiness-review.test.ts tests/unit/math-lrc-loop-readiness-panel.test.ts tests/unit/math-lrc-loop-readiness-page.test.ts tests/unit/math-lrc-shift-replay.test.ts tests/unit/math-diagnostic-capture-v2.test.ts tests/unit/math-method-unit-durable-replay.test.ts tests/unit/math-lrc-phase-binding.test.ts tests/unit/math-lrc-phase-auth.test.ts --maxWorkers=1 --no-file-parallelism
```

40 suites,1303/1303 PASS =1071 prior declared regressions +232 new (123Core+109Auth).
Start22:13:49 local;59.65s;exit0; Main session99127. Earlier checkpoint counts
are superseded and not summed. This is the declared relevant regression pack,
not a claim that every repository test or browser E2E ran.

Whole npm run typecheck:exit0/no diagnostics (final session59901).
Whole npm run lint:exit0/no diagnostics (final session59014).
Whole flags-OFF npm run build:exit0;compile6.6s/TypeScript26.3s/3static pages;
standalone-assets/env scripts pass (final session24094).
Initial sandbox build failed external Google Fonts fetch; identical flags-OFF
build used a permitted public-font network exception. No dependency install,
provider/model request or private capture access was used for build verification.

Independent final two-suite run232/232 PASS,start22:13:53,duration838ms,exit0.
Reviewer additionally tested ten in-memory hostile Core controls and independently
reproduced the final observation race. See the independent report below.

Main stopped only its owned dev session97279 for final build. Default loopback
restore was refused EPERM; permitted local listen restored owned session40178 at
http://127.0.0.1:3001,READY201ms,all six execution flags OFF. No browser-E2E claim;
there were no route/action/UI changes in this pack.

## Preservation and provenance

Main baseline1418 preexisting src/tests/scripts/docs files:0 missing;
before handoff append,1417 unchanged and only manifest changed by one append.
Ten new files at that audit were exactly the sealed TIP, six source/test/fixture
files and three Builder/reviewer reports. This Main report is the eleventh.
Handoff is subsequently append-only; old345993-byte prefix SHA256 remains
7234c99d23c4b55682c4caacb8748992dd3b4a0e3fed89b31aaa237958d29d91.
Prior111-entry manifest prefix SHA256 remains
93fbcde2e1bbf09c21a5ebd84eabac050e5ca8e2e502588f080b5c60451a2cd0.
New112-entry manifest SHA256:
3b77523ee2faa2642507cac4308832daaaf88e5d6fe81198d8a18f73ad512a25.
git diff --check:exit0. HEAD remains
4d108227498d3578c9ac3fe60305c10da5aa905b,
branch codex/tip-023a-organization-graph; unrelated prior dirty work preserved.
No Git write/commit/push, envfile/schema/migration/install/billing/deploy change.

Frozen SHA256 pins:

- src/modules/research-sandbox/math-lrc-phase-binding.ts:
  b034c4eca6722dcb9bf99c76688a908565af17eff0edf17c91e1067c9ba9f908
- src/server/operations/math-lrc-phase-auth.ts:
  0af85f8f66f6d7d311c0498a0fe3c09bb076eb5b6c9d21b6ff44ac20781fe107
- tests/unit/math-lrc-phase-binding.test.ts:
  011d810d86f05c5a993e7c51b0138baa95b6a25b7cbf633e0b0aac5c16fcb46e
- tests/unit/math-lrc-phase-auth.test.ts:
  fb2c445f3eee254130af748169368f2dbfcb5ac324536120ac582075812c9904
- tests/unit/math-lrc-phase-binding-fixture.ts:
  eb497d9a48220a5471803c73bcf1fd23ae299543608a286ade38d795dae09063
- tests/unit/math-lrc-phase-auth-fixture.ts:
  4a1c2076f746ef5b085b71fea3e0aeadaddd61c68acd4ed451dd94e2e95acef2
- docs/verification/TIP-072A_CORE_COMPLETION.md:
  29d6a1bad9f2fcb544ed8c7f63950484e49ca3f6610edefa5f11a664be2bafab
- docs/verification/TIP-072A_AUTH_COMPLETION.md:
  4e5a2d7ad5b8b9cbdd9ed00ef14bcc6a3a14d58739e9f5b582b8d267e69a8e20
- docs/verification/TIP-072A_INDEPENDENT_REVIEW.md:
  7ed62609797e10442125dd01eb1f2da2abfd3000351a273fcf5ad574099aa4b8

## Next ordered work — actual loop remains closed

1. Seal072B operation-level ownership/CAS plus authenticated historical native
   event/capture/dispatch provenance. Measure real DAL cost against the existing
   aggregate finite-operation ceiling; mock timing is not a live latency result.
2. Define and review complete executable source closure against current42-file
   ceiling. Conservative pre-foundation scans77–81 files used different roots;
   neither is a sealed complete manifest. No silent widening, omitted dynamic
   dependencies, edited historical37 registry or bounded-security relaxation.
   Vibecode Kit escalation keeps this scope revision/design gate explicit.
3. Implement upfront durable one-use bootstrap/reservations, fresh native IDs,
   phased purpose-bound production storage/full transport, bounded read-only V1
   maintenance interoperability, precritic fresh independent replay, postledger
   seal/restart inspector, loop consumption and truthful passive UI. Frozen071
   simultaneous-claim fixture protocol and production refusals remain unchanged.
4. Only after actual private-root purpose permission, exact fresh actor/tenant/
   calibration/descriptor/source-process readiness and HUMAN G2, run ONE new073
   M1 then STOP. No research campaign/retry/generic executor unlock inferred.

No actual DB/job/model/provider execution, source attestation, external private-
root access, mathematical attempt, M1 or campaign occurred in this turn.
Existing known14-moving/15-total finite shift scope, original arithmetic/history/
refutations/ledger7 and064 FAILED/UNKNOWN remain unchanged. No new theorem,
continuous/global LRC14or15, formal/external/novelty or breakthrough claim.
