# TIP-081A — Approved environment repair and one build4

2026-10-06. Owner repeats/approves previous proposal: repair build configuration,
validate environment before running, ONE fresh build<=600s then E2E<=30min IF
build/package admission pass. SAME081PhaseA A-R01..12/A-S01..12 engineering only.
Three failed builds retained; fourth total attempt is not a reset. Zero provider,
scientific, native, LRC, Git, migration/deploy/billing/publication authority.

## Narrow repair and Builder ownership

Only existing build/start/harness helper files may change. Compiler overlay,
Next/shared env/security/source080 and UI remain pinned/unchanged. Force
AUTH_RATE_LIMIT_ENABLED=true in production-build environment regardless of
QA test input; real NODE_ENV=test server may still disable it. Do not change
src/server/env.ts or bypass its schema/security checks.

Add a pure actual-schema preflight BEFORE marker consumption/Next spawn,
evaluating exact fixed child environment with production-build NEXT_PHASE as
Next does for collection. Use parseEnv from already-pinned src/server/env.ts
without DB/server/init effects. Use installed Node/TS capability or bounded
existing TS runner as required, no dependency install/runtime patch. Do not
dump credentials or consume allowance on invalid preflight. Report runtime
compatibility ambiguity before architecture changes. Bounded preflight must
run offline, no app bundle, <=120s and existing test envelope.

Retain old build3 acknowledgment/marker/result history; add distinct build4
ack/owned create-only consumption+result, same source/root/overlay/600s bindings
and success-only package/start guard. Do not reuse/reset old markers. New
reviewed successor binds _PRE_BUILD4 review/bundle and permits only the three
owned helper/test deltas. Source inventory19 unchanged. Existing unit refusals
and preserveflags/NFT/OS/dependency/storage/auth/source guards remain.

Builder source changes/pure authored tests ONLY; no build/server/DB/E2E/probe/Git
effects. Main reviews every delta, executes offline preflight/pure/type/lint,
seals manifest then prepares ONE fresh owned shadow. Main consumes only after
preflight PASS, performs the single600s Next build with network denied and exact
shadow/TMPDIR writes. No retry/dev-server/fresh-root fallback within this approval.

## Acceptance and stop

E1 exact production-build schema passes with rate limiting ON; runtime QA remains
test and passes existing safety rules. Original false+production negative control
refuses; malformed/missing DB/storage/secret/build-boundary input refuses without
marker/child effects. Do not call production runtime valid merely from build pass.
E2 distinct one-usebuild4/sourcepredecessor and success-only launch constraints.
E3 unit/type/lint/pin/archive preservation; oldscientific commands unchanged.
E4 one actual build<=600s + NFT/dependency packaging admission; if fail STOP.
E5 only if PASS: actual owner UI/read-only replay/export and automated scoped
security/layout/math keyboard/locales/themes tests, browser<=30min. Only ordinary
test auth/session/freshlabelled QA identities may mutate isolatedtest5433/
hiveos_test, no original scientific records or new inference. Fixed web3004.
STOP after acceptedPhaseA or genuine singlebuild/security/source/cap blocker.
