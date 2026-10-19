# TIP-117 — Product handoff verification

Date: 2026-10-13. Scope: local product maintenance and Git handoff, **not deployment**.
Research is paused. K6 remains OPEN. No new mathematical campaign, paid provider
call, database schema change or authentication bypass was performed.

## Delivered scope

| Requirement | Implementation and evidence |
| --- | --- |
| R1 Clear bilingual research entry | Task-oriented entry points, truthful manual/provider boundaries, no automatic dispatch on navigation; local-only tools hidden outside development/test. |
| R2 Responsive, keyboard-usable navigation | Nested research selection, reachable tablet account controls, search ellipsis, mobile focus trap including closed disclosures, scroll/focus restoration on breakpoint change. |
| R3 Predictable packaging/startup | Explicit standalone artifact/profile selection, no silent stale fallback; Docker excludes disposable outputs; push-triggered cloud image publishing removed. |
| R4 Practical team onboarding | README plus EN/VI handoff guide covering local setup, roles, SMTP, local-only routes, backup/recovery and future deployment requirements. |
| R5 Honest regression scope | Repeatable product checks separated from 54 historical/one-shot cases without editing their assertions or resealing archived manifests. Exact wall-clock limits retained; unit files serialized to avoid CPU contention. |
| R6 Preserve and deliver reviewed work | Research checkpoint `9676d22` preserves prior TIP103–116 evidence. Product release identity is the commit containing this report; remote verification is reported with the delivery response. |

Implementation coverage: 6/6 scoped requirements. This is not a percentage of
all HIVE OS features, mathematical goals or production readiness.

## Verification record

- Initial typecheck passed. Initial/focused lint passed with **0 errors and 41
  existing warnings** in historical TIP081 scripts. Frozen sources were not
  rewritten merely to remove warnings.
- Initial unfiltered baseline: 5,348 passed, 23 failed, 36 skipped across 258
  files; one historical one-shot suite also failed its prerequisites/hooks.
  Failures were investigated rather than counted as passes.
- Product-scope run: **5,369 passed, 1 timeout, 19 deselected**, 259 files,
  596.73 seconds. The remaining timeout was a 30-second frontier admission
  test under concurrent execution. Assertions and limits remain unchanged.
  The attempted CLI exclusions did not override project selection; both heavy
  replay files actually ran. This was not a reduced-suite pass.
- Isolated serial replay of both heavy files: **30/30 passed**, 368.04 seconds,
  with original assertions and time limits. This resolves the observed timeout
  in the focused rerun, not a claim of a new all-green monolithic suite.
- Focused identity, authorization and workspace-policy integration:
  **26/26 passed**, three files, against isolated `hiveos_test`.
- Two intermediate LOCAL_QA standalone builds passed using the existing
  `.next-build`; packaged environment files were scrubbed and assets prepared.
- Browser regression initially exposed a hidden-disclosure focus target;
  after correction, the two preference scenarios and research-shell scenario
  passed **3/3**. A subsequent review found the open-drawer resize/scroll-lock
  defect; its fix was checked in the live UI and added to that regression.
- Final-source build, dependency remediation and regression results follow
  below; earlier passes must not be read as acceptance of later changes.

## Final-source verification and compatible patches

- Exact pins: Next.js/eslint-config-next 16.3.8, sharp 0.35.5, Vitest 4.1.11.
  Associated framework/platform binaries and allowed Vitest transitives were
  refreshed in the lockfile. No Prisma downgrade or Nodemailer major upgrade.
- Four additional patches stay within existing dependency ranges: fast-uri
  3.1.8, nanoid 3.3.20, source-map-js 1.2.2, baseline-browser-mapping 2.11.28.
  No new direct dependency or transitive override was added.
- The first build after upgrading Next compiled but failed TypeScript on the
  new test helper's widened `NODE_ENV` string. The helper now accepts the exact
  environment union; no `any` or relaxed compiler setting was introduced.
- Subsequent full typecheck **passed**; five focused unit files **64/64 passed**
  on the updated toolchain. Vite emits a future configuration-loader warning;
  it was not suppressed by changing package module semantics.
- Final lint **passed, 0 errors / 41 historical warnings**. The Next-generated
  AGENTS.md guidance block was refreshed by `next dev`; its source was verified
  in the installed Next package. Project/research instructions were retained.
- The 5,369-case product pass and 30-case replay above used the previous
  dependency lock. They are not represented as a complete-suite rerun on the
  final dependency graph.
- Final LOCAL_QA build on Next 16.3.8 **passed** (compile 7.2 seconds,
  TypeScript 6.0 seconds). The one retained packaged environment file was
  scrubbed and static/public assets prepared.
- Final Playwright regression **3/3 passed**, 6.7 seconds, one worker/no retries:
  first-visit preferences, preference persistence, and the complete desktop/
  tablet/mobile navigation scenario including resize with the drawer open.
  This used the rebuilt standalone artifact and isolated `hiveos_test`, not
  the live research database or a stale dev server.

## Cleanup

Removed exactly 167 current-turn synthetic fixture roots (34 packaging,
59 shadow, 74 unit) under `/private/tmp/hiveos-tip081-*`, after checking the
explicit target list, ownership, modes, timestamps and file identities.
Removed 672,532 regular-file bytes (423 files), 483 directories and 40 symlinks;
symlinks were unlinked, never followed. All 167 targets were verified absent.
Older/unrelated paths and all research evidence were preserved. Deletion was
direct, not Trash; these synthetic fixtures can be recreated from their tests.
No project copy or new per-task build directory was created. `.next` and the
single reusable `.next-build` remain for local development/acceptance. No Docker
image was built; no container or volume pruning was performed. Disk remained
at least 23 GiB free during the final install/build sequence.

## Deliberately not certified

- No staging/production deployment, public data publication, remote migration,
  Docker release image or paid worker activation.
- No full current integration/E2E matrix, load/SLO certification, external
  security review, SMTP delivery acceptance or restore rehearsal in this task.
- Historical source-contract reproduction remains unresolved. The 19 named
  cases plus 35 one-shot cases are **not passing**; see
  [exact product/archive scope](PRODUCT_TEST_SCOPE.md).
- Dependency risk acceptance from August expired on 2026-08-31. It is not
  extended by this maintenance task. Fresh audit initially reported 13 findings
  (1 critical, 9 high, 3 moderate) in the omit-dev graph. After compatible
  patches, omit-dev reports **5 high, 0 moderate, 0 critical**; the full graph
  reports **13 high, 0 moderate, 0 critical**. Both audits still fail. Remaining
  omit-dev packages are Prisma, @prisma/config, deepmerge-ts, mysql2 and
  Nodemailer. These counts are affected-package counts, not five independent
  exploitable application flaws. Deployment remains blocked.
- Local research routes are not automatically available to a remote research
  team. Their existing environment and authorization guards remain intact.

## Handoff status

**READY for scoped local maintenance/Git handoff, with explicit deferred debt;
NOT READY for shared deployment.** All six maintenance requirements are
implemented; the final build, typecheck, focused unit and browser scenarios
pass. Dependency policy, historical replay, warning cleanup and full final-lock
regression remain distinct outstanding work, not silently waived acceptance.

The Owner explicitly chose finish/push first and deployment selection later.
No automatic image publication accompanies this change. The local dev server
was restarted on port 3000. The existing Codex tab retained a connection-error
document during the restart; the user was asked to reopen the ordinary local
URL rather than bypass browser controls. Automated final E2E passed separately;
the Owner subsequently confirmed the UI loaded in their external browser.
The local sign-in endpoint also returned HTTP 200 after restart.

Next priority before deploy is the remaining dependency remediation with
mail/Prisma compatibility testing, then full acceptance on the chosen target.
Do not restart K6 or widen local-only research access as part of that work.

## Follow-up — consistent Research content width (2026-10-13)

The Owner reported that the request panel was narrower than Recent work.
The first two Research sections had independent `max-w-5xl` caps; both now
inherit the workspace shell width with `w-full min-w-0`. Paragraph measure,
shell gutters, typography, colors and research behavior are unchanged.

- Focused research-entry unit tests: **12/12 passed**; typecheck, scoped ESLint
  and whitespace checks passed.
- Reused `.next-build` for one LOCAL_QA build: **passed** (compile 9.4 seconds,
  TypeScript 48 seconds); standalone environment scrub and asset preparation
  passed. Disk preflight: 24 GiB free. No new build directory or project copy.
- Selected Playwright regression: **4/4 passed**, 8.4 seconds, one worker and
  no retries, against isolated `hiveos_test`. New geometry assertions compare
  both edges of the entry, request and Recent work sections at 1440, 900 and
  390 pixels and reject horizontal document overflow. Desktop/mobile captures
  are retained in ignored `test-results`; visual inspection confirms alignment.
- The layout fixture was then strengthened to create a synthetic mission via
  the UI and require the actual request textarea before measuring. Its focused
  replay **1/1 passed**, 6.5 seconds, on the same build; updated desktop/mobile
  captures were visually inspected. No research request was submitted.
- Development sign-in endpoint still returns HTTP 200. No research campaign,
  provider call, live research data change or deployment was performed.

This is a scoped page-layout correction, not a new whole-product acceptance
or a resolution of the deployment risks recorded above.
