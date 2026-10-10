# Draft TIP-071 / TIP-072 / TIP-073 — durable replay and one M1

Date2026-10-04. Status DRAFT_G1_PENDING, NOT_SEALED_NOT_EXECUTABLE.
Depends on the approved offline065–070 contracts; does not inherit G2.
Working directory /Users/os/hiveos.
Blueprint: docs/proposals/BLUEPRINT_TIP-071_073_DURABLE_REPLAY_AND_M1.md.

## Decisions log

D071-1: New security/authority architecture needs human G1 approval before Builder code.
Latest request starts this detailed design; it is not an approved concrete storage protocol.
D071-2: Reuse existing exact-job machinery, not a third executor or automatic retry.
D071-3: Choose separate arithmetic replay implementation; distinguish host implementation
diversity from external institutional independence/formal proof.
D071-4: V2 coordinator, ONE root/quota, historical V1 unchanged/read-only for M1;
all control records share existing16KiB per-slot ceiling, no extra quota/root.
D071-5: Initial finite check + durable replay are TWO charged checker calls under same5s/2M.
D071-6: Keep contract4/ledger7 historical mathematics immutable; add V2 external receipt/
accounting/admission layer. No deserialized grant; no voting-derived proof/novelty.
D071-7: Two-phase one-use bootstrap binds server-created IDs; no preexisting-ID fiction.
D071-8: No full RRI interview: prior context settles domain/model/caps. One focused
architecture/privacy approval and later exact G2 are the meaningful human decisions.
D071-9: Crash/partial/quota/auth failure safe refusal; no automatic stale lock deletion,
maintenance, resume, alternate root, or old064 repair.

## TIP-071 — durable private V2 and mathematical replay
PriorityP0. Dependencies065/067/070 and APPROVED blueprint.
Task: additive V2 strict schemas/store, independent finite arithmetic replay and two
create-only receipt formats with staged read-back verification. No production activation.
Acceptance: blueprint S1–S11/S15/S18/S20 (these are named criteria, not current passes).
Constraints: unique mktemp fixture roots only; fixed future root untouched; all provider/
worker/queue/campaign flagsOFF; no DB fixtures/model/API/forest/Git/install/migration.
Preserve original37 source registry/ledger/capture schemas and historical packets.
If a source change needs newer runtime pins, version/review a new closure manifest; do
not rewrite a frozen historical seal. If controls cannot fit16KiB, escalate, not widen.
Builder writes Core completion with exact commands, test counts, fault controls and hashes.
Independent reviewer writes separate consequential review/adversarial controls.

## TIP-072 — authenticated one-use ingress and loop consumption
PriorityP0. Depends071 verified and same approved blueprint.
Task: server-only bootstrap -> spent intent -> normal durable command/created IDs -> exact
opaque owned-job authority; purpose-scoped post-ledger admission; V2 two-checker accounting;
passive sanitized UI/readiness. Reuse normal solver/review worker and command/outbox system.
Acceptance: blueprint S1/S2/S5/S6/S9/S10/S12–S18/S20.
No generic requestResearchRun method-lane unlock, fixture authority in production, shared
worker activation, paid provider, scientific DB fixtures or model calls under G1.
No mathematical replay during GET/render/prefetch/manual read refresh. No persisted token.
No autonomous next experiment; tasks stay proposed/unroutable without semantic anchors.
Core/Integration/UI ownership and exact additive seams assigned only after071 contract freeze.
Frontend-design skill must be read before UI task; no design-system replacement.
Builder completion + independent review + Main exact regression/type/lint/build required.

## TIP-073 — one fresh M1 observed on actual browser
PriorityP0. Depends071/072 verified; separate bound executable descriptor + human G2.
Preparation: fresh actual original actor/session/tenant/mission/capabilities, current model/
calibration/login/conflict readiness; approved private-root filesystem access; fresh reviewed
process and actual closure hashes; quota/resource reservations; exact nonce/scope/expiry.
No caller-provided identity substitute; do not infer from URL or previous approving turn.
Run: exactly one newly created M1 and its two exact attempt1 jobs; max3fresh role calls,
original finite check then separately implemented durable replay then critic and ledger.
Acceptance: all blueprintS1–S20, with actual evidence for S19; record failures honestly.
No paidAPI/fallback/retry/resume/newcandidate/prime/forest/campaign/old064reset.
After result: STOP; only conditional/finite scope if supported, all global/formal/
external/novelty axes remain NOT_ESTABLISHED. Retain actual failure and unavailable usage.
Report actual created IDs, role contexts, input/output/receipt/ledger/source hashes,
two checker invocations/counters, auth/owned fences and observed browser screenshot geometry.
If private permission/readiness/source/capacity fails: NOT_RUN; do not fabricate trace.

## Completion and verification protocol

Builder: STATUS/FILES/AC RESULTS/ISSUES/DEVIATIONS/SUGGESTIONS; concrete counts and commands.
Main: requirement coverage, AC pass/fail/severity, type/lint/build/tests, overall disposition.
Count unique tests once. Synthetic fixtures != retained mathematical/actual browser evidence.
Partial scientific trace is not100% E2E. Only explicit reviewed bytes and immutable observed
anchors can support admission. Approval pending; no packs are sealed in contractor manifest.

