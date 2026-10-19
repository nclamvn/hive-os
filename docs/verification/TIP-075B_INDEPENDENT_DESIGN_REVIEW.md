# TIP-075B — independent hostile DESIGN review

2026-10-05. Reviewer: period_skeptic, separate from Contractor/Builder.
Root: `LRC_P139_REPRODUCTION_075`; mode REPRODUCTION, current work DESIGN_ONLY.
Whole target J(13,139)=empty through G/C/T/B; all four scientific gates OPEN.
Historical whole attempts FOUR, new execution allowance ZERO.

## Verdict and inspected boundary

**READY for the design checkpoint, with explicit BUILD/execution prerequisites.**
The proposed whole-G completeness argument is sound under the stated finite
domain and deterministic event semantics. No remaining design-level soundness
contradiction was identified. This is not executable correctness, an accepted G
dataset, independent p139 replay, J-empty, paper reproduction or global LRC14/15.

Read the complete TIP, design amendment and blueprint, focused Builder scan,
AGENTS, commitment protocol/active history and latest075A handoff checkpoint.
Reviewed the phase-ordering and lifecycle revisions before this verdict. Pins:

| Reviewed artifact | SHA-256 |
| --- | --- |
| TIP-075B | 17fa07b7677529ec5109fa5f9c978c83128980525423e2728393a2dc2ee79d9f |
| Design amendment | b34e782a40f2359091531039a8a4c0b006155b285f985cec57d35d2aef36a1c4 |
| Final reviewed blueprint | 87cfdf791518f64f2bd395b9be0cc3b9c57e6f4c8911a7c6fed2c9675c3cf20b |
| Builder focused scan | 1f18e09b7a8e51c93c14873742be8844a4085cbfed4a17cfec493aedb56f389c |

Checks performed: read-only document inspection and file SHA integrity, plus
independent mathematical reasoning below. Tests, generators, checkers,
mathematical computations, build/types/lint and browser E2E: **NOT_RUN**.
Ten scenarios are paper walkthroughs, not ten tests. No source/host/test edits,
author-code execution, API, private diagnostics read/stat/write, DB, environment
inspection, Git write or operational admission occurred. Only this NEW report
is authored. Vibecode Kit separates design review from Builder implementation;
its report discipline does not turn an unexecuted scenario into a pass.

## Independent mathematical assessment — R1

The domain is explicit:69 sign-folded nonzero classes for prime139,13 entries,
strict BAD predicate `14*min(vt mod139,-vt mod139)<139`. Each mask has9 elements:
multiplication by a nonzero speed permutes folded classes, and the class1 mask is
exactly1..9. Equality is not silently changed to BAD. G outputs unit-orbit
representatives of covering13-entry MULTISETS, not distinct13-sets or J-empty.

Every such multiset contains an inclusion-minimal DISTINCT support S. Its size
s is8..13 because9s must cover69 points. If U points have incidence1, all others
have incidence at least2, so9s >= U+2(69-U), giving U >=138-9s. Private points
are disjoint among members; pigeonhole yields a member with at least
ceil((138-9s)/s) private points. The quotas9,7,5,4,3,2 and409 roots follow.
These are derived coverage bounds, not source-tau assumptions.

For that member v, transform a speed x to the folded class of x/v and a time t
to the folded class of vt. Their product agrees up to sign, preserving BAD,
coverage and private points. The chosen speed becomes1 and any quota-sized
subset of its private points becomes a subset of1..9. Excluding all OTHER
candidate masks intersecting that subset is therefore complete. Root1 remains
selected although it is not an available additional candidate. Some supports
may belong to multiple roots; the blueprint correctly uses canonical set UNION,
not a sum of root counts or a claimed409-way partition.

All listed prunes are monotone or valid upper bounds: private sets only shrink;
an early cover cannot become a larger minimal cover; available count, mask UNION
and9-per-slot capacity bound possible completions; the sum of largest individual
uncovered gains overestimates coverage even with overlap. At a nonpruned pivot,
every completion contains an eligible covering option. Its least ascending such
option assigns it to exactly one child. Removing earlier options but retaining
later options and nonoptions preserves that unique within-root partition.
Checker reconstruction of the FIRST applicable prune and full ordered options
is essential: a plausible local prune or matching node total is insufficient.

After all roots of a size, canonicalization under ALL69 units derives the exact
minimal-support orbit set. Every original covering13-multiset contains one such
support. A unit taking it to its canonical support also transforms the remaining
entries into a permitted extra multiset. Enumerating every nondecreasing extra
tuple, allowing repeats and entries already in the support, therefore emits its
orbit. Conversely an extension of a covering support covers. Length0 contributes
one empty tuple, not zero tuples. Duplicate images still produce extension
events; deduplication belongs to exact final UNION. These two directions establish
G-set equality if the entire stream is independently accepted. Source row counts
and producer COMPLETE cannot supply a missing direction.

## Soundness at cuts, restart and exact data

The amended phase order is unambiguous: all roots for a size; SUPPORT_END with
independently derived table equality; every ordered support/extras iterator;
SIZE_END after complete extension consumption; then final UNION and FINAL_END.
No barrier declaration can skip a pending iterator. Empty support tables still
have the appropriate barriers, so empty data does not bypass completeness.

A complete node6 event can leave children pending. The explicit DFS frontier,
including remaining options and next-child index, is therefore part of state;
rootIndex, byte offset or a hashed producer stack is not enough. Cuts occur only
after full event effects, including leaf canonicalization/support insertion or
extension canonicalization/UNION insertion. Checker replay reconstructs the next
event rather than validating whichever continuation the producer proposes.

The separate scalar/SET checker derives its OWN masks, private sets, options,
canonical support runs and extension rows. It cannot import the producer,
same-trust structural validator or prior producer-importing test module. Run
hashes are integrity aids; exact independently reconstructed table/stream equality
and complete event consumption certify both missing and extra rows. A terminal
empty frontier plus every manifest entry consumed is necessary for WHOLE_G;
an arbitrary number of verified prefixes is not sufficient.

Whole-prefix replay from genesis on verifier restart is conservative but sound.
It also includes the expensive support/UNION reconstruction; a saved cursor hash
cannot replace it. The design permits same-process checker memory only while
the trusted pinned process remains alive, not a new process inheriting a receipt.
Checker memory, process identity, file lock/descriptor safety and actual atomic
publication still require implementation and fault controls.

## Reviewer objections and resolution

Two concrete lifecycle ambiguities were sent to Main and corrected in §5 before
freeze; neither was silently deferred as implemented:

1. **Reservation-to-START crash:** unique invocation identity binds campaign,
   attempt slot and predecessor; create-only quota reservation is durable and
   fsynced BEFORE START. A crash between them permanently spends the reservation
   and occupies the slot, preserving it and stopping for bounded reconciliation.
   This prevents a missing START from manufacturing a free retry.
2. **Captured tail rollback:** every committed unverified tail must be replayed
   before continuation. Invalid tail refuses the chain; it cannot be discarded
   and replaced from an earlier verified cut under the same campaign. All bytes,
   history and charges remain. A new genesis requires separately authorized
   routing and cannot erase the failed whole attempt.

The phase/table correction is also checked: SUPPORT_END verifies the support
table BEFORE extension work; SIZE_END verifies this same table's entire schedule
and identity. This removes the earlier possibility of conflating table closure
with completed extensions. Uncommitted staging/orphans are never admitted
mathematical evidence; they remain charged storage, not hidden free workspace.

## Requirement and scenario coverage

Requirements addressed at DESIGN level:8/8 (100%); implemented/verified here:0.

| Requirement | Concrete blueprint obligation / independent finding |
| --- | --- |
| R1 | §2/§6: private normalization, all409 roots, unique within-root children, all repeated extras, exact final set equality. Sound argument above; whole evidence absent. |
| R2 | §4/§5: complete-event cuts, explicit frontier, replay from genesis and durable commits. No historical298 resume. Exact wire/checkpoint implementation remains debt. |
| R3 | §3/§6: separate scalar/SET derivation and own runs; no shared semantic oracle. Actual checker not built or run. |
| R4 | §4/§5: unique successor event, manifest chain, reconstructed cursors, corrected tail rule and crash refusal. Atomicity/parser controls still required. |
| R5 | §7 and revised §5: permanently charged unique reservations, replay/writes/failed starts TOTAL, separate invocation and campaign counts. No numeric grant exists. |
| R6 | §8: verified prefix != G; G != C/T/B/J/global14/15. Verdict binds entire stream and exact UNION. |
| R7 | §3/§8: design, BUILD_ONLY, frozen review, human numeric envelope and whole execution are separate releases; source/runtime remains SOURCE_REFUSED. |
| R8 | §1/§8: historical measurements/source counts do not become proof, method superiority or novelty. No feasibility/breakthrough promise. |

| Paper scenario | Reviewed refusal/closure reasoning; NOT an executed control |
| --- | --- |
| A1 | All roots, tables, extras and final exact UNION required; no completed-root-count shortcut. |
| A2 | Cut after branch event retains pending siblings; resumed event derives from that exact frontier. |
| A3 | Coherently rehashed omissions/fake prune/extra or absent row fail semantic reconstruction/equality, not merely a checksum. |
| A4 | Exact chain and successor state reject overlap/duplication/reorder/transplanted different state; orphans cannot enter accepted manifest. |
| A5 | Producer private/cursor/counters/checkpoint are hints; independent reconstruction decides. |
| A6 | Durable reservation/start/blob/commit/verdict boundaries retain charges; tail rollback and orphan reservation now explicitly refuse. |
| A7 | Exhausted/missing TOTAL ledger stops before another admission; replay and reconciliation are charged work. |
| A8 | Header binds root/domain/strictness/history/sources;075A diagnostic298 has no accepted events/tables and cannot resume. |
| A9 | Missing terminal/root/extension/UNION leaves G OPEN even when prior segments verify. |
| A10 | Checker fault/timeout yields no admission; zero requires exhaustive equality, not source nonemptiness or an expected count. |

Ten scenarios addressed as reasoning; executed0, no test pass rate asserted.

## Unresolved BUILD / execution prerequisites

These are real blockers to executable acceptance, not objections to completing
the present design review:

- Freeze exact canonical fields/widths/framing, overflow/duplicate-key handling,
  cursor representation, event-effects order, root counters and table/run identity.
  Demonstrate state equivalence at every permitted tiny-domain cut, including
  pending siblings, empty tables, duplicate extension images and atomic merges.
- Build the genuinely independent checker. Require coherent-rehash omission,
  false-prune, altered-option, extension and final-row mutations from valid
  baselines; parser/source separation and exact set equality cannot be helper-only.
- Implement descriptor/lock/create-only/fsync publication with bounded fault
  injection at reservation, START, staging, commit and verdict/receipt boundaries.
  Verify failed reservation/tail cannot be reused. Scope filesystem threat claims
  to the demonstrable local single-writer trust model, not privileged-host security.
- Freeze explicit TOTAL producer/reconstruction and checker/replay envelopes,
  source/metadata/event/extension/diagnostic limits, all writes/merge/orphan storage,
  live file/FD/working-memory bounds and cleanup/reconciliation allowance. Measure
  feasibility only after separate authorization. No numeric value is supplied or
  approved by this report; old2.5M-node/120s limits are not fresh segment quotas.
- Source-pin cooperative node accounting is not an OS node sandbox. Time/pipe/write
  supervision and any claimed hard CPU/RSS containment require actual evidence.
  Entire-prefix restart may be costly; segmentation is not a proof of affordable
  whole generation/replay, nor a reason to silently enlarge TOTAL resources.
- Preserve four old whole attempts. A future approved campaign would be cumulative
  attempt5; continuations consume separately bounded invocations, while a fresh
  genesis/changed candidate increments whole-attempt history. No TIP/segment rename
  resets either dimension. A concrete human-approved envelope is still required.

Technical health: build/types/lint/tests/E2E NOT_RUN under DESIGN_ONLY; no new
executable health assertion. The seven previously unlisted contractor files remain
074-INV-01/P2: CORE_SCOPE.json, CORE_SCOPE_REVIEW_NOTES.md, INTEGRATION_SCOPE.json,
INTEGRATION_SCOPE_REVIEW_NOTES.md, SEAL_ACCEPTANCE.md, UI_BENCHMARK_SCOPE.json,
UI_BENCHMARK_SCOPE_REVIEW_NOTES.md under research-program-v2. No fresh inventory
run or unrelated reseal/deletion/exclusion here. Six execution flags remain OFF;
source/auth/lease/replay/G2 unchanged and operational SOURCE_REFUSED.

Established this turn: a reviewed completeness-preserving whole-G certificate
design, including explicit closure of two lifecycle drift risks. Still absent:
frozen executable format/checker/host, authorized numeric envelope, whole-G data
and replay, and every C/T/B closure. STOP after this design checkpoint. Propose
BUILD_ONLY separately; do not execute attempt5 or infer mathematical progress.
