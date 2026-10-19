# TIP-075C — implement reviewed whole-G certificate architecture

Priority P0; depends on accepted075B. Human-approved BUILD_ONLY2026-10-05.
Root LRC_P139_REPRODUCTION_075; REPRODUCTION; G/C/T/B0/4, old attempts4, new0.
Contractor designs/coordinates/verifies; three Builders have disjoint ownership.
Exact contract: docs/contractor/WIRE_TIP-075C_G_SEGMENTS.md; reviewed075B blueprint.

## Ownership / task graph

Producer Builder: scripts/operations/attempt-lrc-p139-generation-v3.py,
tests/research/test_lrc_p139_generation_v3.py,
docs/verification/TIP-075C_PRODUCER_COMPLETION.md.
Independent checker Builder: scripts/operations/verify-lrc-p139-g-segments.py,
tests/research/test_lrc_p139_g_segments_review.py,
docs/verification/TIP-075C_CHECKER_COMPLETION.md.
Host Builder: scripts/operations/capture-lrc-p139-generation-v3.py,
tests/research/test_lrc_p139_g_segments_host.py,
docs/verification/TIP-075C_HOST_COMPLETION.md.
Main: TIP/wire/charter, review coordination, Main completion and append checkpoints.
No shared semantic helper module. Each Builder scans relevant delta before coding;
reuse075B scan; do not edit another owner's file without Main coordination.

## R1–R8

R1: optimized producer explicit event-state machine with safe inside-root cuts,
bounded typed cursor, complete support/extensions/UNION; no serialized code/state.
R2: standalone independent SET/scalar checker derives every state/event, exact
support/data equality, no producer/shared/test imports or assert-based admission.
R3: generator resume reconstructs prefix, compares fresh checker cursor; checker
restart replays entire committed prefix; no trusting saved producer/verifier state.
R4: durable create-only host lock/descriptor-based path safety, ordered fsync,
unique quota reservation BEFORE START, commit-last manifests, fail-closed recovery.
R5: permanently charged TOTAL quotas across all invocations/replays/failed starts/
writes; separate measured telemetry/process limits; unknown ledger/tail stops.
R6: bounded allocation/parser/pipes/time/storage/file counts; explicit refuse,
not unbounded JSON/set/trace/merge, not a claimed hard OS RSS sandbox.
R7: exact chain/table/data final verdict; tiny verdict separate from p139/G/J;
wrong scope/pins, coherent-rehash omission/swap/duplicate must reject.
R8: default CLI/p139 constructor refuse current whole grant; old files/pins and
source/auth/lease/G2 preserved, no UI/live/API/reseal/counter reset.

## Actual control scenarios

A1 Complete tiny exhaustive covers equal direct brute force, including all roots,
supports/multiset extras/canonical UNION and empty cases.
A2 Every tiny event cut: reconstructed cursor equals uninterrupted; pending
sibling/private/extension state survives process reconstruction.
A3 Coherently rehashed missing root/sibling/fake prune/pivot/extension rejects.
A4 Extra/missing/duplicated table or final row, preserving range/hash, rejects.
A5 Duplicate/overlap/reorder/orphan/truncated/subtree-swap/wrong cursor rejects.
A6 Real files: crash after reservation/before START/staging/commit/verdict receipt;
quota/slot stays spent; missing receipt stops, no silent rollback of bad tail.
A7 TOTAL exhaustion/replay charge/forged counters/ledger corruption refuses before
next start; precharge full quota/no refunds/automatic retry.
A8 Real lock/link/nonregular/path/source-drift controls; no unpinned source imports.
A9 Real subprocess bounded pipes/time/exit/kill-wait-close/child env controls.
A10 Prefix is not G, terminal incomplete/corrupt union not acceptance; checker
fault/timeout/refusal cannot produce final verdict.
A11 Strict domain/type/duplicate-key/nonfinite/overflow/unknown-tag/input bounds;
memory/event/node/extension/storage/diagnostic caps refuse before unbounded effects.
A12 p139/no whole grant/default CLI/old298 pseudo-checkpoint refuse before search;
historical attempts4 unchanged, no paper/global14/15/novelty acceptance.

Reports include actual commands/counts/times and R/A mapping, missing/deferred
explicit. No invented PASS or repeated-test double counting. After implementation,
cross-review another Builder's source and independent hostile controls; Main
inspects actual code and reruns suites before scoped acceptance.
