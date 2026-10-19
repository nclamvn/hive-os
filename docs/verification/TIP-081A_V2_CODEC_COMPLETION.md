# TIP-081A — V2 codec/synthetic admission completion

2026-10-07 · SAME081D8 engineering.
STATUS: DONE for C1–C6; V2_CODEC_SYNTHETIC_ADMISSION_ACCEPTED_LIVE_PARSER_OPEN.

## New result

The reviewed wire/ownership design now has working bounded JSON-text v2 codecs
and a synthetic-only private admission scaffold, previously unimplemented.
Named source/descriptor/profile/receipt/refusal hashes remain distinct. Exact
schema and decoded duplicate-key checks precede whole JSON parse; monotone scratch
guards precede dynamic allocations/serialization/hash. Source backing parent plus
owned copy charged before construction; opaque handles, captured trusted time,
shorter-only synthetic TTL, busy/refusal/expiry cleanup tested. Parser/runtime
entry always refuses; no live certificate issuance is exposed by admission.

## Verification / requirement coverage

C1–C6:6/6 PASS_SCOPED (100% of this synthetic codec/admission TIP, not six AST
implementation requirements). Independent source review CLEAR after preserved
findings/repairs, Main reviewed full code/test/inventory. Final33/33 unique
synthetic controls V201–V233 PASS in1file; tests121ms first/120ms final, two runs
of the same33 controls, NOT66 unique controls. Syntax2modules PASS, lint3files
PASS, focused TypeScript check0errors. No whole-project fresh typecheck; no build
or E2E. Predecessor402/402 remains historical, not included in this run's count.

First check type errors2 preserved: missing @returns{never} for always-throw helpers
and Main checker omitted repository esnext libs. Repair comments accurately type
unchanged throwing paths; checker-only library alignment, no casts/ignores/cap
weakening or test/config changes. Final source and driver reviewed CLEAR.
First source reviews caught mutable clock, unsubstantiated scratch allowance,
split-path and per-loop literal allocations. Those failures/refinements remain
in review history; no executable checks preceded the completed source repairs.
One outer sandbox_apply denial occurred before any command executed; retry used
the same restrictive OS policy through approved escalation, not relaxed guards.

41 repository predecessor pins MATCH before/after; new4files stable in final
checks. Five fixed-root predecessor pins were deliberately not read in this
synthetic route. No fresh whole failed-root/46pin/source lease check claimed.

## Files changed and evidence

Builder created only:
- scripts/test/codec-tip081-source-v2.mjs
- scripts/test/admit-tip081-source-v2.mjs
- tests/unit/evidence-studio-source-v2.test.ts
- docs/verification/TIP-081A_V2_CODEC_ALLOCATION.md

Main created TIP/source review/first and final check archives/evidence/completion,
and appended route/completion to handoff/ACTIVE. Frozen v1 source/tests, parser,
config and previous archives unchanged; unrelated dirty repository work preserved.
Complete first/final source cuts, hashes, drivers and stdout/stderr retained in
TIP-081A_V2_CODEC_{FIRST_CHECK,FINAL_CHECK}.json. Summary and budget in
TIP-081A_V2_CODEC_EVIDENCE.json; enabled-site derivation in allocation inventory.

## Resource accounting and boundaries

First check3561.553125ms; final check2983.138416ms. Pin scan14.650667ms.
Four conservative1000ms allowances: failed sandbox apply, pin capture wrapper,
first check wrapper, final check wrapper. Total new upper10559.342208ms.
Aggregate upper781813.471875/900000ms;118186.52812499995ms remains; no reset.
Both check packages capped90000ms individually and admitted within remainder.

Codec envelope524288logical bytes per call; owned synthetic envelope1048576,
initial655360; wire16384/depth128/fields64/values4096. Logical cost convention
and caller-retained output scope are explicit, not measured OS/RSS/GC/global
process memory proof. Synthetic adapter/audit pins hash fixed domain labels,
NOT actual adapter or complete grammar allocation-audit artifacts.

No actual source/failed-root acquisition, parser/AST, target execution, resolver,
build/E2E/server/DB/paidAPI/model-provider/Git/math/billing/deploy/publication effect.
Independent syntax replay, real cross-version exclusion/owner integration and
complete pinned-parser allocation audit remain NOT_IMPLEMENTED/UNRUN.
Caller whole graph OPEN; fullruntimeNOT_ACCEPTED; predecessor62OPEN unchanged;
no new mathematical result or research milestone.

## Stop / next routing proposal

STOP at approved codec and synthetic admission. Next proposal is a bounded
complete allocation-site audit of the pinned grammar and a concrete private
real-source consumer/replay implementation plan, before enabling parser or
authentic-source integration. This is NOT automatically approved by completion.

Skill influence: Vibecode separated Builder code from Contractor verification;
independent source review found allocation/clock gaps before measured checks and
retained first/final evidence instead of declaring synthetic passes live closure.
