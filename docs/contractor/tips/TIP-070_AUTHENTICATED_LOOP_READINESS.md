# TIP-070: authenticated retained-loop readiness and visible local E2E

Date:2026-10-04. Priority:P0. Status:SEALED_G1_LOCAL_READ_ONLY.
Repository:/Users/os/hiveos. Depends on sealed TIP065–069 and approved v2 DAL/auth blueprint.
Human requested connecting the method to authenticated execution/independent
verification BEFORE a new LRC campaign, and opening Codex browser for observation.

## Decision and scope

Reuse existing session/workspace authorization, tenant RLS, retained job/result
and full ledger7 admission. Add a read-only server boundary and passive cockpit
panel. This is the first safe connection to actual execution records, NOT a
new execution-authority mint, campaign, capture store or proof checker.
No architecture/schema change: Contractor adopts the existing approved DAL pattern.
A new live/security architecture decision is deferred to explicit future G2.

Actual browser now authenticates Local Pilot at127.0.0.1:3001. Selected historical
064 case failed with UNKNOWN cause and no retained method-unit. No positive
real method-unit admission may be invented, backfilled or recovered with fixtures.

Ordinary sanitized retained task viewing follows actual research.read capability
for this mission/workspace, not original-actor raw diagnostic rights. Viewing does
not consume tasks, mutate jobs, authorize tools or expose private captures.
Raw diagnostics/replay remain original actor + jobs.manage + local permission,
unmodified and unaccessed by this slice.

## Deliverables and ownership

Core Builder: NEW src/server/operations/math-lrc-loop-readiness.ts and NEW focused
unit tests/fixture if needed; NEW Core completion. No preexisting product edits.
UI Builder: NEW passive math-lrc-loop-readiness-panel.tsx + NEW unit tests;
only narrowly additive integration in src/app/w/[workspaceSlug]/research/math-pilot/page.tsx,
preserving unrelated dirty changes and old selection/family/form guards.
Independent Reviewer: read-only consequential review, NEW review controls/report
if assigned; repair requests go to Core/UI. Main contracts and verifies, not code.

## Server boundary

1. Server-only export accepts Headers/current request, workspace slug, mission ID
   and <=16 DISTINCT valid case IDs only. No caller ctx, grant, batch, source pins,
   registry/ADMITTED token, digests, receipts or injected production resolver.
   Immutable Headers snapshot; resolve actual current user/workspace/membership;
   authorize research.read on actual resource. Revalidate session/capability before
   returning, refuse principal/tenant drift. Ordinary unauthorized/notfound is
   non-disclosing, no foreign IDs/job/result contents in errors or returned DTO.
2. Use existing getDb and withOrganizationTenant. Read exact persisted case/run/
   review in scoped bounded query; do NOT trust displayed latest-job-by-case.
   Load run.jobId and agentReview.jobId exact scoped jobs/outboxes.
   Validate case/run/review organization/workspace/mission/case linkage; original
   command identity; distinct jobs/outboxes; attempts=maxAttempts=1; SUCCEEDED
   jobs; run completed AWAITING_REVIEW or APPROVED; codex-local/gpt-6-sol.
   Strict one-key payloads and proper SOLVER ResearchRun/runId versus REVIEW
   MathPilotCase/caseId aggregate/type/topic/outbox/command lineage.
   Explicit source/question family check: only exact frozen v4 method contract/
   ledger7 allowed, legacy064 cannot become method evidence.
3. Derive anchors only from actual persisted rows/results: contractDigest,
   mathModelAttemptDigest, researchDossierDigest with deterministic sources/findings
   ordering, review contract/attempt/research/ledger digests, solver job result
   runId/resultDigest/mathModelAttemptDigest and exact review job result caseId/
   ledgerDigest/disposition. Never take a digest out of untrusted UI metadata
   or solely recompute-and-trust a altered record.
4. Reuse bounded verifyInstalledMethodUnitSources and fixed finite pins; source
   failure refuses safely. No checker execution, source-loader/model effects,
   private diagnostics-root/capture access or mutation. Old37 pins do not claim
   runtime coverage of new069/070 code; those receive separate frozen QA pins.
5. Create registry/admit/plan entirely within this authenticated same process;
   batch:null and information/relations/associations empty. Independent durable
   metadata does not yet exist, so NEVER invent stop/pivot authority or promote
   votes/knownfinite receipts. Full existing retained validation is mandatory.
   Keep raw records/private admission identities on server; return only sanitized
   immutable bounded DTO: per-case status/reason, actual admitted count, proposed
   task refs/reasons/digests if admitted, PLANNING_ONLY and explicit blockers.
   dispatchAllowed:false/proofClosure:false; global/formal/external/novelty
   NOT_ESTABLISHED; fresh finite replay/batch/independent new information NOT_RUN/
   NOT_BOUND as appropriate, not verified by passive hash admission.
6. Incomplete/legacy/malformed/foreign/source-error inputs produce explicit safe
   refusal or missing state, never partially trusted tasks. A missing requested
   case is non-disclosing unavailable. Normal source/DB operational failure must
   not leak stack, raw data, paths or credentials. No hidden work on GET beyond
   bounded passive source hashes, authenticated retained DB reads and pure planning.

## UI design and integration

Existing cockpit hierarchy/tokens are binding. Subject: serious mathematical
research provenance, not a new marketing dashboard.
Tokens reuse surface#ffffff/canvas#f4f6f8/ink#0c1424/muted#617086/line#dce3eb/
warning#c46716 and their existing dark equivalents. Existing typography only.
Left-aligned single compact readiness section, semantic definition rows with
one restrained warning boundary; no repeated decorative cards/gradient/newfont.
Actual process order only: session -> scoped jobs -> evidence admission ->
independent replay/new info -> execution gate. Missing/blocked reason and next
required action readable VN/EN. No fictional green progress, percent proof,
placeholder success, polling, raw capture, G2 toggle or run button.
Reuse existing disclosure for bounded task references and label them PROPOSED/
UNROUTABLE, not queued/executed. Wrap long reasons/digests, min-w-0, <=80character
body line where practical, sensible mobile layout. Minimal manual reload link
with prefetch=false may re-read current selection, not mutate anything.

Render for selected LRC proof/method family on the existing selected case only,
including legacy064 as LEGACY_NOT_ADMISSIBLE. Loader independently enforces
access; page membership check alone is not server boundary. Preserve old pure
family guards, source scope, legacy forms and original historical output.
Frontend Design influences clarity/restraint, not style-system replacement.

## Acceptance criteria

- A1: Given current authenticated research.read membership, when readiness is
  loaded, only the exact permitted mission/cases are read; missing/revoked/
  changed/forged user/context or foreign IDs cannot admit or disclose records.
- A2: Given synthetic authoritative v4/ledger7 rows and exact job/outbox/results,
  when independently admitted server-side, tasks retain exact source refs;
  wrong jobs/types/attempts/tenant/command/payload/status/result pins refuse.
- A3: Given missing/legacy064/invalid/mutated records or source-pin drift, no
  admitted tasks/result promotion occurs; historical UNKNOWN remains unchanged.
- A4: Given valid retained evidence but no independently anchored batch/info/
  relations/associations, output is PLANNING_ONLY, tasks UNROUTABLE, dispatch/
  closurefalse and fresh independent replay NOT_RUN; no tool/model call/write.
- A5: Given repeated loads/shuffled requested equivalent records, bounded DTO is
  immutable/deterministic, aggregate caps/duplicate/depth refusals preserve069.
- A6: Given safe readiness DTO, passive VN/EN panel shows actual status/blockers,
  no raw records/identity tokens/model dispatch or fabricated readiness.
- A7: Given actual current local browser session, visible E2E loads historical
  record/refusal and unavailable selection safely, manual reload/navigation works,
  no research job is created. Positive fixture tests remain SYNTHETIC, not claimed
  browser scientific evidence. Mobile/desktop geometry screenshots if feasible.
- A8: Legacy registry37/code/packets/069/test/history/sealed proposals preserved,
  only approved additive page seam/newfiles and append-only handoff/manifest.

## Verification, exclusions, reports

Main runs serial focused + broad selector regression, whole types/lint/build
with execution flags OFF, full baseline hash audit and visible browser E2E.
No source/API/model/login provider/worker/Git/install/migration/schema/private-root/
paid-billing/deploy/campaign action. Ordinary local web runtime and current browser
session/read-only local DB viewing explicitly authorized by current request.
No demo account provisioning or scientific DB fixtures. No change to old scopes,
G2 candidate or old37-source registry. Source hashes QA do not authenticate an
entirely malicious DB/host; localreadiness is not production deployment readiness.
Original30min/240s/49KiB/1MiB/32KiB/256bit/5s2M/d3d5 caps unchanged.

Reports: exact AC counts/results, actual commands and run pins, fixed controls,
technical health, source/file hashes, synthetic-vs-browser evidence, remaining
R5 execution/R8 private durable anchors/R12 activation and G2NOTAUTHORIZED.
No new LRC14/15 theorem/novelty/proof claim. Explicit remaining security design:
durable private capture/batch/information/relation anchor ownership/atomicity/
crash recovery/retention/refresh, executable manifest scope and authority mint.

## G1 clarification before implementation (2026-10-04)

Independent review found that the approved Better Auth session resolver may
refresh an active session or remove an expired session. Contractor explicitly
permits only this ordinary authentication lifecycle housekeeping. The passive
readiness guarantee means no scientific, research-run, job, outbox, private
capture, model or campaign mutation; it does not assert zero authentication-table
writes. Reuse the approved resolver and revalidate current principal/capability;
do not introduce a custom signed-cookie or authority architecture in this TIP.
Report this exception in verification. All execution gates remain closed.

UI Builder may additionally make mechanical mock-only additions to the existing
math-lrc-research-cockpit-page and math-lrc-proof-unit-run-page unit tests for the
new server dependency. Preserve every old assertion/control and report the diff.
This narrow test allowance supersedes the earlier new-test-only ownership clause.
