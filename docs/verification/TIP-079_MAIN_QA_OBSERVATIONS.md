# TIP-079 Main actual QA observations

Root NATIVE_POLY19_SHOWCASE_079 / ENGINEERING_IMPLEMENTATION. Append-only
observations, not native inference acceptance. 2026-10-06, Asia/Saigon.

## First held source cut

Installed ENGINEERING_ONLY bundle digest
`64b0bfd291428ca81d488b5a552e13c678196b7fe2f9cc6ea088c268e9e65583`,
64 source files,665533 source/report bytes. LIVE authority NOT_INSTALLED.
Main focused126/126PASS, five files, Vitest345ms/wrapper0.556s.
Main whole tsc --noEmit --incremental false exit0; observation interval is not
an exact CPU duration. A independently measured fresh whole tsc PASS28.996s.

## Actual integration failure retained — 10:33:14 local

Exactly tests/integration/research-showcase.test.ts, invocation-only config:false,
setupFiles:[], single worker, isolated hiveos_test and dedicated private storage.
No global setup/migration/truncation/cleanup/model. Actual result19PASS/2FAIL,
Vitest22.48s/test21.692s, exit1. This is a failure, not partial suite acceptance.

1. `current mission DENY stops an approved run before any role reservation`:
   AuthorizationError Missing scoped capability: research.read, kernel.ts52,
   integration test101. Product denial is correct; test incorrectly called the
   denied public read service to inspect a negative fixture.
2. `revocation after durable START fences even engineering provider adoption`:
   expected REVOKED, received COMPLETED, integration test119. Real service defect:
   revoke handler emitted outbox:[], while shared durable kernel requires1–20
   outbox events. SAVEPOINT rolled the revoke event back and returned FAILED;
   revoke caller did not reject that outcome. Main exact scoped own-QA SQL read
   confirms statusFAILED/error_codeINVALID_EFFECT/error_message
   `Command effect must emit 1–20 outbox events`.

Main authorized a narrow fix: one fixed observational revocation outbox atomically,
strict SUCCEEDED/exact normalized outcome admission, explicit hook/result assertion,
and denied-read assertion plus own-fixture tenant inspection. No shared runtime
permission relaxation. Before rerun, corrected source requires renewed independent
review and an explicitly preserved predecessor bundle/report; never silent reseal.

## Build attempts retained

First restricted fixed build exit1: next/font failed fetching existing Inter and
IBM Plex Mono from Google Fonts. Same fixed build retried with scoped escalation.
Second observed process ran approximately3min21s at the last diagnostic, then
session handle disappeared around its240s internal bound/new user turn. Later
read-only check found no remaining build process and no BUILD_ID/standalone server.
No final exit output was delivered: terminated/timeout cause UNKNOWN, NOT_PASS.
No unsupported build success, clean timeout attribution or browser acceptance.

No native role requests, API charge, scientific result, official benchmark score,
new research cohort, Git commit/push, deployment or old-history cleanup.

## Corrected source actual integration — 10:49:53 local

New independently admitted ENGINEERING_ONLY bundle canonical digest
`fae8d7abc9d859ca89b5b7b587e5e15279907e75158d0ff4bc6d8fb2fa14d357`,
64 files/666749 source/report bytes. Main compared all64 pins: only kernel,
action and fixed build-helper changed relative to the preserved predecessor.
Fresh Main six-file unit suite136/136PASS,319ms/wrapper0.428s. Final Builder
whole typecheckPASS23.849s, lint clean1.560s, helper syntax check exit0.

Exact isolated21-case rerun, same invocation-only no-setup scope:
**21/21 PASS**, one file, Vitest21.95s/test21.19s, exit0. Actual assertions cover
persisted approval/outbox, exact/fault replay, RLS/append-only, concurrent claims,
current DENY/inactive membership/stale lease/lineage, actual committed revoke,
original deadline, real SIGKILL recovery and failed/unknown/malformed/oversize
byte-preservation admission. No model/CLI scientific requests. Predecessor failed
fixtures are retained; this is a newly generated fixture set, not repaired scores.

## Compiler boundary ceiling

Builder late source audit found installed NFT exclusions applied after tracing;
final NFT admission is not an OS-level proof of pre-read isolation. Inspected NFT
builtin map does not model fs/promises, and no root-wide traversal was reproduced.
No original reference was deliberately followed/read/stat-ed by Main or Builders,
but automatic compiler pre-read behavior is NOT independently attested. Earlier
source-admission statements must not be expanded into such an OS-level guarantee.
Do not open/stat an excluded original to investigate. Stop if generated trace
flags forbidden history; do not enlarge globs or claim native no-tools containment
from compiler packaging. Native R2/R10 remain blocked and are unrelated to this
engineering-only packaging check.

Third build uses reviewed fixed --webpack, same240s child timeout. Build-only
invocation sets AUTH_RATE_LIMIT_ENABLED=true (production compilation safer;
runtime QA retains NODE_ENV=test and its own explicit flags). No env file edits.
At diagnostic2min02s compiler worker was actively consuming~497%CPU; no successful
build/NFT/package/browser result inferred from process activity. Result pending.

## Final bounded build observation

Third fixed Webpack attempt ended exit143 at approximately the configured240s
bound, without compile success output. Exact follow-up checks found no BUILD_ID,
no standalone/server.js, and no remaining three known owned build processes.
No packaging/NFT/browser success is inferred. Source cap not increased; no
automatic fourth attempt, partial-build relabel or new UI server. Main partial
completion is TIP-079_MAIN_COMPLETION.md; native and build/browser gates remain.

## Owner-approved600s resume — 11:17 local

Direct owner approval preserved in TIP-079_BUILD_UI_RESUME.md and handoff/active.
Main archived the old64-file manifest/review byte-identically as BUILD240
predecessors and admitted66-file engineering-only source. Canonical digest
95b9af29a7234f7325d05a53341011a63abfd90690d46bc55ceb06d3302c2965;
installer717995 source/report bytes; no live authority installed.
Main fresh149/149 pure units PASS335ms. Builder finalTSC0/4.994s and lint0/1.390s.

One controlled fixed600s Webpack build now PASS: compile6.9s, TypeScript25.3s,
child46173.17ms, exit0/no signal/no error.54 generated NFT inventories,
15578 references/995836bytes, forbidden flags0. Packaging67 pins (66 source+
fixed Main review) plus manifest,725950bytes. The applied OS read-deny profile
remained in force. No forbidden original probe/read/stat/follow was performed.
This supports the src-only QA Tailwind scan correction; it does not isolate all
cache effects or prove a unique cause for prior CPU failures. No font mock.
Next automatically added the two .next-tip079 type include paths to tsconfig;
strict settings remain unchanged. Existing user/predecessor formatting preserved.

Standalone server ready127.0.0.1:3002 using test DB and the same owned storage.
Main found storage root755 at resume preflight, verified owned nonsymlink exact
root, chmod700 only that directory; cause unknown, no historical data cleanup.

Visible Codex IAB: normal sign-in with preprovisioned synthetic QA account;
own mission f798feb8-acfc-4865-af1f-a69ce278e1b1; own run
22381368-440f-467a-a094-0e6ccd90e1cf queued through UI, then exact reviewed separate
host worker claimed1 and COMPLETED. Reload visibly retains four completed roles,
VERIFIED_POLY19_CYCLOTOMIC_CONSTRUCTION exact replay and INCONCLUSIVE fault/control
postreview; native disabled and NOT_INVOKED_ENGINEERING_ONLY disclosed throughout.
Math source disclosure expands with rendered KaTeX. Screenshots retained under
artifacts/tip079/visible-completed-vi.jpg and visible-results-vi.jpg.

First actual headless E2E attempt FAIL at collection,0 executed,0.432s. Installed
Playwright forbids trace/screenshot worker options in describe group. Main routed
only the test-file fix: file-level trace/screenshot off for all3 cases; keep
explicit12 safe layout screenshots, pinned config/product unchanged. Firstfailure
is retained, not counted as passes. Rerun remains pending at this observation.

Important auth ceiling: existing signUpToDashboard helper marks ONLY each fresh
synthetic test user's email verified with a guarded isolated owner connection,
then uses ordinary sign-in/onboarding UI. This is out-of-band test-fixture email
verification, NOT end-to-end email delivery/token consumption or production auth
acceptance. No source statement that it uses zero auth bypass may conceal this.

## Actual E2E execution — first3-case runtime cut

Test-only file-scope privacy fix reviewed; pinned66source+review still match.
First actual runtime suite:1PASS/2FAIL,37.6s, exit1 (collection failure separate).
Queue/revoke/reload test PASS2.0s. Layout completed12 locale/theme/width frames
and no-overflow assertions, but scoped Axe found SERIOUS scrollable-region-focusable
on the one long inline task formula at320px. No suppression/score promotion.
Full flow passed its paired exact valid-origin replay/foreign-origin500 checks,
one-own-run/outbox and zeroROLE_STARTED assertions, then fixed worker child hit
the unchanged30s lifetime bound. Failure context visibly shows the owned fresh
run1f4424a7-4ac2-4b2e-b308-59757e1d026f COMPLETED and exactVERIFIED before timeout;
process-exit acceptance remains FAIL, not a reason to widen its ceiling.

Main routed two narrow R6/worker lifecycle corrections to Builder: task formula
split into naturally wrapping independent inline clauses, without changing math
or originals/shared renderer; inspect DB singleton ownership, await graceful
disconnect at fixed launcher termination rather than forcing exit0. Add bounded
sanitized child outcome diagnostics, no raw original/auth output. No effect
rerun before Main review and explicit preserved predecessor/new source admission.
Prior failed full-flow fixture, logs and source seals remain retained.

## Final corrected build/UI acceptance — 11:26 local

Main read and compared all66 source pins: only fixed CLI lifecycle and task
formula presentation changed. Prior95b9... manifest/review archived byte-identically
as UI_LIFECYCLE predecessors before create-only install. New canonical bundle
a5142d1b49cfb756bfc0dfddf98fe9b6f924d7d7d3eca5187f19f46e01f59c12;
718718source/reportbytes, native authority NOT_INSTALLED. Frozen Main reviewSHA
a25e4780b2fcb5aab5f0f0d355a482adf8b28b7295db6f6dba226e843eee917c,
manifestfileSHAf44661c937ef9e5cd2e99e1bc6c4a284ff064aeb770ac14a55a324a3e26120cb.
Main fresh153/153 units PASS368ms; Builder scoped78/78PASS303ms, lint0/1.694s,
wholeTSC0/5.442s. All67 root source+review pins match again after build/browser.

Final actual Webpack600s-bounded build PASS47731.411ms, compile5.2s/TSC28.4s,
exit0/noerror/nosignal. Same54NFT inventories/15578refs/995836bytes/forbidden0;
67pins+manifest packaged726673bytes. Own earlier QA server parent was verified
and stopped withTERM (sandbox initially denied signal; scoped escalation stopped
only PID16371). This was planned restart, not a build failure/data deletion.
New guarded standalone QA server ready127.0.0.1:3002; same test DB/storage0700.

Actual same3-case E2E final run **3/3PASS,10.7s,exit0**, no retries:

- own UI queue/revoke/reload2.2s;
- EN/VI × light/dark ×1280/390/320,12screenshots, no page overflow; rendered KaTeX,
  keyboard focus and scoped WCAG2A/AA Axe no SERIOUS/CRITICAL violations3.0s;
- own fresh UI ingress, valid exact replay vs solechangedforeignOrigin500,
  idempotent oneownrun/outbox and zeroSTART before fixedworker, child success
  within30s, COMPLETED afterreload, exact JSON/text/private provenance-labelled
  HTTPexports, full fouroriginal/certificate/fault/trace/source/event seals,
  anonymous401 and distinct fresh tenant403/404 checks4.8s.

No captured approval body/cookie/rawchildoutput persisted; automatic E2E trace
and screenshot OFF. Disclosed out-of-band QA email verification remains, no
production-mail/token E2E claim. Failed fixtures/context+12screenshots retained
in e2e-runtime-failure-1; failure was not rewritten into success.

Final visible IAB own run df85ecc0-c87a-46d9-aa8f-95a489eae385 on newa514... cut
was requested normally in UI. Fixed separate hostworker claimed1/COMPLETED and
exited0 without30s idle hang. Reload visibly retains all5 stages and original
disclosure; task formula is four naturally wrapping rendered clauses. Final
screenshot artifacts/tip079/visible-final-results-vi.jpg. Tab kept as deliverable.
Previous visible run22381368 and downloaded269688byte JSON/388byte FINAL retain
their95b9... seal; no reseal or replacement with the newrun.

Engineering build/UI/R8/HTTP-R1 scope is accepted. Native R2/R10 remain
BLOCKED_UNESTABLISHED, scientific model calls0. No new theorem/novelty/private
benchmark/official score/method gain/LRC14-15 closure follows. Stop further effects
pending direct routing for native-boundary design; no Git/deploy/billing/campaign.
