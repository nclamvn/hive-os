# TIP-075B focused scan — whole-G certificates and independent replay

2026-10-05. Builder / Vibecode Kit focused SCAN. **DESIGN_ONLY**. Same root
`LRC_P139_REPRODUCTION_075`, REPRODUCTION target J(13,139)=empty through G/C/T/B.
Cumulative whole attempts FOUR; new allowance ZERO. G/C/T/B remains OPEN.
This scan proposes design constraints, not implementation, executable acceptance,
new resources, a resume grant or mathematical progress.

## Inspected scope and actual facts

Read AGENTS, commitment protocol/active history, latest075A handoff checkpoint,
TIP-075B and design charter; inspected only public in-repository Python and
relevant whole-G documents. No producer/checker/test/math execution occurred.
No browser/API/provider/author-code/private diagnostics/DB/environment inspection
or Git write. Only this NEW scan document is written. Six execution flags remain
unactivated. Next guidance is not applicable to this documentation-only scan.

Focused stack: standard-library Python, exact integers/bitsets/byte keys; no
framework, database, transport model or UI work. Relevant layout:

```text
scripts/operations/
  attempt-lrc-p139-generation-v2.py   # fixed no-input monolithic producer
  capture-lrc-p139-generation-v2.py   # fixed attempts3/4 provenance collector
tests/research/
  test_lrc_p139_generation_review.py  # independent small SET/scalar semantics
  test_lrc_p139_generation_v2_review.py # compact-table adapter / hostile controls
docs/verification/
  TIP-075A_MAIN_COMPLETION.md         # consumed envelope and exact outcome
```

Read-only hash checks match recorded frozen artifacts:

| Artifact | SHA-256 |
| --- | --- |
| producer v2 | f9a43d77a498c0c0ed94d6df919c27a8d217fdfaae1e37556c41738eb5852bb8 |
| collector v2 | 298b1937c852c124be6cb2e29aa52c02d07d1bd2895688cf84537da139af070d |
| prior SET reader/test | bc9b5410de8ea110337a2d98d89734d4ea498ab50b84f674f15a08fe44b2ed8c |
| v2 independent test | fd5e5eafb31b52ebd771ccc960325eb4f7ed001a223025304aec95b17c64e484 |
|075A Main outcome | d64bae17c3f8957dc91d3dfb96b6bd6511754d8c565287ba5a2ac50dde10d19d |

Historical Main/reviewer attempts3/4 each stopped at2500000 visits,185868548
telemetry operations,298/409 completed roots, size12/rootIndex298/private[1,3,6].
Trace logical count6284462B, current/peak accounted working9731960/9789304B;
encoded final data0 and extensions0. Internal elapsed37446.830/39128.375ms.
These are prior recorded measurements, NOT computations run in this scan.
The node ceiling bound the runs; time/memory/encoded bytes did not. Zero final
data is unfinished output, not emptiness. No trace/support/data prefix was exported.
Diagnostic root298 is **not a checkpoint**; it cannot establish accepted roots,
reconstruct pending siblings or recover the support union. Fresh production must
start from its own approved genesis, not invent missing predecessor evidence.

## Concrete seams and reuse limits

1. `Generator.root` (producer line195) contains a nested recursive `visit`.
   Covered/private/available sets and sibling cursor exist only in Python frames;
   there is no durable program counter. Trace records are header244, tags0..6,
   root footer245 and extension246. A root footer is emitted only after the
   entire subtree returns. A byte offset or root index alone cannot resume it.
2. `Generator.run` (line295) processes roots for a support size, then extensions,
   clears the minimal set, and moves to the next size. Resume must retain phase
   ordering and deduplicated support union, not just tree position. Root schedule
   equality is necessary but insufficient to prove every child and extension.
3. `extend` (line266) emits every combinations-with-replacement extension and
   canonical image; duplicate images still emit evidence. This framing and
   multiplicity semantics are valuable, but a suspended iterator is not encoded.
4. `candidate` (line314) materializes whole trace/support/data/base64/JSON at once.
   It cannot stream sealed segments or independently finalize a global union.
   `diagnostic` intentionally drops mathematical payloads on refusal.
5. Collector `collect` (line172) validates immutable source/history, exclusive
   start, fixed paths, bounds and exact bytes. It neither performs semantic replay
   nor supports segments/recovery. `load_validator` loads SAME producer definitions;
   `capture_validate` is structural coherence only. It must not become the
   independent checker by renaming its status.
6. Prior `tiny_evidence` (review test line50) independently derives masks/private
   sets/pivot/prune/units/extensions using SET/scalar operations and compares
   final exact data. Its mathematical approach is reusable. The module itself
   imports the producer at top level for tests, uses `assert`, decodes whole
   base64 and accumulates complete sets without deployment budgets. Do not import
   that module in a production checker. A new separately pinned standalone
   checker must contain its own derivations, explicit fail-closed exceptions,
   bounded parser/allocation/work/deadline and streaming continuation support.

Existing small controls are evidence for future test design, not freshly passed
here and not a whole-p139 checker. No TODO/lint/coverage count or full repository
health conclusion was inferred from this focused scan.

## Mathematical completeness obligations that cuts must preserve

Every13-entry BAD cover contains a minimal DISTINCT support. Size is8..13 since
each speed covers9 of69 classes. With P private times, incidences satisfy
`9s >= P+2(69-P)`, hence `P>=138-9s`; one member owns at least
`ceil((138-9s)/s)` private times. Multiplying speeds by that member's inverse and
time coordinates by that member preserves the predicate and makes its class1.
Enumerating all quota-sized subsets of B(1) yields409 exhaustive, potentially
overlapping roots. Quotas9/7/5/4/3/2 and root counts1/36/126/126/84/36 are part of
the derivation, not trusted producer metadata or a source-tau assumption.

A selected member's private set only shrinks under additions; loss of all private
times prevents any later MINIMAL cover. An early complete cover cannot extend to
a larger minimal cover. Capacity/available union/count/top-gain pruning must be
recomputed from actual eligible sets by the checker. At each uncovered pivot,
every completing solution has a least ascending eligible pivot-coverer; cumulative
earlier-option exclusion assigns it to exactly one sibling. Resuming with a fresh
availability mask, omitting a prior excluded option or skipping a sibling breaks
this argument even if node/row totals and hashes agree.

For a support size, canonicalize the entire leaf union under ALL69 folded units,
sign/permutation. A unit mapping a minimal support to its canonical form maps any
extra multiset to another permitted extra multiset. Thus every original13 cover
appears through some canonical minimal support plus every extension of size13-s.
Extras may repeat or equal existing support entries; they are not combinations
of distinct unused speeds. Different supports/roots/sizes overlap: final data is
an exact canonical UNION. Counts or additive per-segment totals cannot certify it.

## Recommended continuation design for Contractor blueprint

Recommend a versioned deterministic event/state machine, with separate SEARCH,
SUPPORT_FINALIZE, EXTEND, FINAL_UNION and TERMINAL phases. These are design
recommendations, not approved implementation fields or release numbers.

- Cut only at complete typed record boundaries and explicit pre-node/pre-next-
  extension safe points. A node may have emitted its full branch header yet still
  have pending children; the schema must encode that state without masquerading
  it as a pruned/completed node. Define atomic leaf/canonicalization effects so a
  crash cannot add a support without evidence or replay it twice accidentally.
- Each bounded segment binds root/prime13-moving/strictness/no-tau, proof-format
  version, producer/checker pins, commitment/predecessor, sequence, phase, exact
  input/output frontier and artifact hashes. Hashes establish byte integrity;
  only independent replay establishes valid continuation.
- Frames require normalized root/quota/private subset, path of selected options,
  deterministic parent pivot/options and next-child cursor. Covered/private/
  availability/slots are independently reconstructed from the path and preceding
  accepted events; producer-supplied values can be comparison witnesses only.
  The checker must derive the exact ordered pending frontier after replay, then
  require the next segment input to equal it. Root298 prose/context is not one.
- For extensions, independently derive the sorted canonical support table only
  after all relevant roots close. Bind size/support-table content and index plus
  exact combinations-with-replacement cursor/rank. Reconstruct the next tuple;
  never trust a producer claim that a rank interval was visited. Define end-of-
  support and end-of-size transitions, including zero-support cases.
- Maintain bounded sorted runs for minimal support union and final-row union,
  with a complete run manifest and independently checked dedup/merge. Verify
  exact membership BOTH ways: every generated image occurs and no extra final
  row occurs. Each output row's range/sort/validity alone proves neither direction.
- Start genesis at root0/empty accumulators. Define terminal completion as all409
  roots, all size unions, all extension schedules, all final-union runs consumed,
  empty pending frontier and no orphan bytes/artifacts. A coherent zero final
  set is allowed only after this same complete replay; source nonemptiness/count
  disagreement is a lead for review, never a semantic premise or automatic fail.
- New standalone checker must not import the producer, same-trust capture
  validator, or prior test modules. Read typed inert bounded artifacts only, never
  evaluate serialized Python state/code. Scalar/SET reconstruction can use its
  own bounded representation; independence need not mean unbounded slow brute
  force. Measure checker feasibility later within separately approved limits.

Root-boundary cuts simplify the first design but cannot guarantee that one root
fits a process limit. Inside-root continuation is required before claiming general
resumability. A verifier resume checkpoint must bind the exact independently
derived frontier/accumulators, verified predecessor chain and checker version.
If durable verified state cannot be trusted/reconstructed, replay from genesis;
that extra replay must be charged. A digest of an unchecked state is insufficient.

## Lifecycle and TOTAL resources — unresolved release prerequisites

Segmentation lowers simultaneous process buffers; it does not reduce total tree
visits, extension work, encoded evidence or replay cost. With unchanged algorithm,
the measured target needs MORE than2500000 visits because it was still incomplete
at that count. No total estimate for completion is justified by298/409: later
roots/extensions can dominate. Old8MiB total evidence may also fail; no measured
complete bound exists. Do not silently reinterpret old ceilings as per-segment.

A future human-approved envelope needs explicit independent dimensions:

1. TOTAL producer visits/work/time, checker visits/work/time, bounded starts/
   retries, segment count and persisted evidence+data+checkpoint+receipt bytes.
   Count repeated replay/recomputation and failed processes; evidence dedup saves
   stored bytes but does not refund CPU or erase a failed start.
2. Separate process wall, peak working allocation, stdin/stdout/stderr/file and
   parser-depth/item limits. Peak memory is not a sum of sequential reservations;
   concurrent producer/checker peaks would need an aggregate bound or sequential
   execution. Neither limit is hard RSS without actual containment.
3. A host-owned durable resource ledger, pre-dispatch reservation, exact predecessor
   CAS/lock and terminal reconciliation. New process/segment labels cannot reset
   totals or the four historical attempts. Missing/torn/unknown counters stop;
   conservative outstanding reservation charges until independently reconciled.
   Producer self-reported counts alone are not lifecycle resource authority.
4. Distinguish semantic node counts reconstructed from proof from actual repeated
   physical work. Deadlines must cover constructor/parser/canonicalization/
   encoding/hash/merge/fsync/validation and failure cleanup; split telemetry and
   host wall totals honestly. Bounded diagnostics and cleanup allowance must be
   explicit, not unaccounted repeated timeout tails.

Recommend immutable content-addressed blobs plus a small authoritative committed
manifest/receipt: exclusive START reservation; bounded inert blob staging;
fsync/atomic publication; commit receipt LAST, with predecessor CAS. Define
crashes before START, after START, after blob and after receipt. An orphan/torn
blob cannot advance the frontier, but still consumes start/time/storage allowance.
Recovery may reconcile an intact blob only through independent replay under a
charged recovery budget; missing receipt never supplies a free rerun. Preserve
orphans until a specified bounded cleanup policy, not silent deletion. Filesystem
race/concurrency/path threat model and trusted ledger ownership must be explicit;
content-addressing alone neither provides host authentication nor crash ordering.

No concrete new numeric envelope is proposed as approved here. Build-only release
must precede any execution-envelope approval and whole generation/replay grant.
Scientific G acceptance must be an independent verdict over exactly the final
manifest/data, not producer COMPLETE, receipt hashes, segment verification count
or model vote. G establishes full level-one generation, not by itself J-empty;
C/T/B remain independently open and unreleased.

## R/A coverage recommendations and paper walkthroughs

| Requirement/scenario | Blueprint constraint / expected refusal |
| --- | --- |
| R1/A1 | Derive409 roots, every subtree/prune, full support/extension union and terminal completeness; no tau/source totals. |
| R2/A2 | Safe typed cut with pending siblings; checker derives both frontiers and exact successor cursor. |
| R3/A3 | Separate SET/scalar checker rejects coherent-rehash root/sibling/prune/extension omission and extra/missing final row. |
| R4/A4 | Exact predecessor/sequence/frontier equality; duplicate segment, overlap, reorder, orphan/tail or subtree swap refuses. |
| R4/A5 | Rebuild state from path/events; forged private/available/root count rejected even with valid hashes. |
| R4–R5/A6 | Crash ordering plus outstanding host reservation; blob without committed receipt does not advance or refund. |
| R5/A7 | Cross-segment sums/ledger and charged replay/retries; untrusted/exhausted totals forbid next dispatch. |
| R4/A8 | Scope/format/pins/strictness locked;075A root298 diagnostic rejected as a resume input. |
| R6/A9 | Verified segments with pending roots/extensions/merge stay PARTIAL, G OPEN. |
| R6–R8/A10 | Checker timeout/fault => INCONCLUSIVE; full zero-row proof allowed; source disagreement not source-shaped acceptance; no C/T/B auto-release. |
| R7 | DESIGN → BUILD_ONLY → freeze/hostile controls → numeric TOTAL-envelope approval → generation/replay separately; current grant0. |

These ten walkthroughs are NOT executed tests or claims of resolved executable
correctness. The contract asks Main blueprint and independent hostile/fresh-reader
reviews to resolve detailed schema, lifecycle, trust and envelope ambiguities.
Design issue severities: missing resume/independent full replay/TOTAL accounting
are P0 build/release prerequisites; source/runtime integration remains outside
this scan rather than silently repaired.

## Preservation / health / stop

Existing seven unlisted `docs/contractor/research-program-v2/` files remain the
documented074-INV-01/P2 owning-scope issue: CORE_SCOPE.json,
CORE_SCOPE_REVIEW_NOTES.md, INTEGRATION_SCOPE.json,
INTEGRATION_SCOPE_REVIEW_NOTES.md, SEAL_ACCEPTANCE.md, UI_BENCHMARK_SCOPE.json,
UI_BENCHMARK_SCOPE_REVIEW_NOTES.md. No inventory rerun, unrelated reseal, deletion
or exclusion was made; prior recorded inventory failure is not recast as green.

Checks here: public source/document reads and listed SHA integrity only. Tests,
generator, checker, mathematical controls, build/types/lint/browser all NOT_RUN
under DESIGN_ONLY. Existing source/auth/lease/replay/G2 and SOURCE_REFUSED gates
unchanged. All old sources/pins/evidence/history are immutable; only this scan
document was created. Stop after delivery for Main blueprint/design review.
No attempt5, implementation or resource grant is inferred from this report.
