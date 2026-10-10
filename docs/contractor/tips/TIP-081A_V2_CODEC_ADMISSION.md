# TIP-081A — V2 codec and synthetic admission

2026-10-07 · SAME081D8 engineering · P0.
Owner “duyệt” directly approves Main's synthetic-only codec/admission proposal.
Dependency: TIP-081A_BOUNDED_AST_AND_CERTIFICATE_DESIGN.md revision2, especially
AppendixA. Historical design checkpoint stays closed; this is the next scoped seam.

## Output / constraints

Implement exact v2 certificate codec and synthetic private admission/coordinator.
Use new files only; frozen v1 modules/tests/config/history and parser unchanged.
No Next.js route/UI work. No parser import/invocation, AST, failed-root acquisition,
resolver, build, E2E, server, DB/API/model-provider, Git or math campaign.
Budget start771254.1296670001/900000ms, remainder128745.87033299985ms; no reset.
Main alone runs measured bounded focused unit/lint/type checks after code review.
Builders may inspect code and write allowed files but must NOT independently run
checks. No .env/protected grant/attempt5 access or broad tree scans.

## C1–C6 / acceptance

C1 Codec: implement AppendixA exact descriptor/receipt/refusal schema, explicit
named hashes and deterministic canonical UTF8. Guard sizes/depth/nodes/fields,
proxies/getters/cycles/unsafe integers BEFORE serialization/hash cloning. Decode
bounded JSON with duplicate-key detection; only data, no public live certificate
authority. SourceHash never overwritten by receiptHash. v1 input refuses in v2.

C2 Ownership: coordinator is SYNTHETIC_ONLY in-memory scaffold with authentic
opaque same-module handles, single active owner/lease and cleanup after expiry.
No caller text callback/plugin, real store authority, source getter or acceptance
certificate issuance. Foreign/clone/expired handles refuse. Synthetic fixture
metadata/bytes, if accepted, must be independently owned/copied and accounted.
No public claim this protects hostile arbitrary v1 importers. Runtime entry always
refuses: parser disabled and actual exclusion/replay integration remain OPEN.

C3 Preflight: synthetic ledger reservations safe-integer, pre-growth and +1-cap
controls; no releasing retained charge by reference disposal/GC assumption.
UNKNOWN prior owner/cross-version live coexistence cannot authorize real use.
Use fixed trusted performance.now; injected hostile clock callbacks not accepted.
Node/site/depth ceilings remain design profile. APIs exact arity, safe typed errors.

C4 Compatibility: no editing/resealing historical v1 receipts/capture. v2 codec
refuses v1 authority adoption. Context-bound v1 replay remains predecessor
evidence, not a required new generic v1 live decoder in this route.

C5 Allocation inventory: exact codec/admission allocation table with pre-growth
guard, bound, lifetime, alias and fixture for each site. Parser precursor list is
NOT full adapter audit; ALLOCATION_COVERAGE_OPEN and parser NOT_IMPLEMENTED/UNRUN.

C6 Tests/review: focused synthetic fixtures cover roundtrip/tamper/swapped hashes,
wrong purposes/versions, duplicate JSON keys, unbounded/proxy/accessor inputs,
exact cap/+1, forged/foreign/stale handles, busy/deadline/cleanup and parser-off.
Independent source review before Main measured checks. Preserve first failures
and corrections; code-only synthetic passes cannot close62OPEN or whole runtime.

## Files / responsibilities

Builder creates scripts/test/codec-tip081-source-v2.mjs,
scripts/test/admit-tip081-source-v2.mjs,
tests/unit/evidence-studio-source-v2.test.ts and
docs/verification/TIP-081A_V2_CODEC_ALLOCATION.md.
Main writes TIP/route/completion/evidence; read-only reviewer cannot edit product.
Do not modify config/dependencies/legacy APIs or add target filesystem access.

## Reporting and stopping

Builder reports files, C1–C6 coverage, allocation bounds, open issues/deviations and
tests authored but UNRUN. Main verifies, runs one bounded focused check package;
any repair/check must fit aggregate remainder. STOP at codec/synthetic admission.
Status must distinguish SYNTHETIC_CODEC_ADMISSION from live source/AST/replay.
No full adapter admission or actual parse grant follows.

## Contractor implementation decisions (Builder escalation, 2026-10-07)

Public codec/admission metadata inputs are bounded JSON TEXT ONLY. Reject objects
and all non-string holders before reflection/coercion; duplicate-key/schema/size
preflight precedes JSON.parse. Internal object operations see only owned bounded
scanner outputs. No exported trusted-object bypass. This narrows the interface
without claiming adversarial native Reflect.ownKeys/symbol-array allocations can
be prebounded. Exact AppendixA schemas still govern decoded owned objects.

No real adapter/audit pin exists yet. Use fixed SYNTHETIC_ONLY hashes of documented
disabled-adapter/inventory domain labels, not caller-selected hashes, not actual
adapter/artifact certification. Real grammar/package hashes remain fixed. Real
accepted receipt encode/decode refuses ALLOCATION_COVERAGE_OPEN; real-mode
descriptor may be inert wire data only, never synthetic owner/live authority.
These are scoped safe implementation choices, not runtime/architecture release.

Independent first-source review found two blockers BEFORE any executable checks:
mutable time lookup and an asserted codec envelope lacking quantitative derivation.
Repair requires captured bound node:perf_hooks clock at module initialization,
and explicit pre-growth logical allocation counters/bounds, not only a constant.
For bounded expiry fixtures, synthetic creation accepts exact arity2 (default
120000ms) or exact arity3 with primitive integer TTL1..120000 ONLY; this narrows
the ceiling, cannot extend it or inject a clock/callback. Real profile stays120s.
Caller-retained codec/output data is per-invocation/per-owner logical scope only,
not process-wide/RSS certification. No tests have yet run at this decision point.

## Completion

C1–C6 scoped6/6 accepted after independent source review/repairs and Main final
33/33focusedunit,syntax2,lint3,focusedTSC0errors. Fullfirst/finalcuts/logs retained;
firstTSC2errors repaired honestly (never annotations + Main checker repo-libs).
41repositorypins before/afterMATCH;5fixedrootpins NOTREAD. Aggregateupper
781813.471875/900000;118186.52812499995left,noreset. Parser/liveadmission/AST/replay
UNRUN/OPEN,62OPENunchanged. STOP. See TIP-081A_V2_CODEC_COMPLETION.md/EVIDENCE.json.
