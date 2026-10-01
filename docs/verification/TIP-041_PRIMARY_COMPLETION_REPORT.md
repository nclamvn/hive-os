# COMPLETION REPORT — TIP-041 Builder A

2026-10-01. Vibecode Kit v6.2. STATUS: DONE for the delegated primary slice;
whole-slice independent acceptance remains the Contractor's responsibility.

## Files and scope

Created only:

- scripts/operations/block-coverage.ts: inert fixed-input producer, abstract
  proof seams, root-bound constructive witnesses and deadline-aware packets.
- scripts/operations/block-coverage-audit.ts: fixed no-argument CLI with
  dynamic-import and final-stdout serialization checkpoints.
- tests/unit/block-coverage.test.ts: 23 primary scenarios.
- docs/operations/MATH_PILOT_BLOCK_COVERAGE_2026-10-01.md: theorem derivation,
  paid construction, exact results, negative controls and limits.
- This completion report.

No old source or pin, app/Next/UI, DB/history, model/API/worker, dependencies,
Git/deploy or Contractor contract/handoff was edited. Existing unrelated dirty
screenshots, workspace files and cache were preserved. The current handoff,
AGENTS, full final TIP and skill/report reference were read before changes.
No Next code was touched; Next-specific guides were not needed for this slice.

Final delegated code/test pins:

| File | SHA-256 |
|---|---|
| block-coverage.ts | 1ac9f30c699e52e7d3e2784ce20535758323f76cbbb206431ab585a222c1338d |
| block-coverage-audit.ts | 9fa536d09f0ad5f933e635a60f5a2432ba60d0fe8a8663974efdb5bc475627f7 |
| block-coverage.test.ts | ede158157f51943b0ef8c63fb87669bc0e5d8432c965b94f6ff59f984409b55b |

Contract read at frozen SHA
279a968e7beabaecb1f32f682b2b8057d2f217631516cb720bb7ae17e4af8508.
Founding/current manifest and all 35 preceding source/test pins are untouched;
Contractor preservation verification is a separate gate, not inferred from
the primary generator.

## Requirement coverage

| Requirement | Delegated implementation/evidence | Status |
|---|---|---|
| R01 | Exact all-proper-subgroup sufficient theorem, BigInt units/orders, paid disjoint block construction | PASS |
| R02 | Frozen individual/cardinality-mask/block/energy routing, complete retained checks, scoped witnesses and actual independent semantic replay | PASS |
| R03 | Separate cohort summaries, old gain/loss zero, post-generation independent truth and resource guards | PASS |
| R04 | Abstract nonmaximal/noncyclic lattice, positive construction, cap/target/equality/lift/partial/CLI controls; independent adversarial review follows | PASS primary scenarios |
| R05 | Five delegated files, full proof/report and final pins; Contractor/replay reports owned separately | PASS delegated deliverables |

Delegated requirements 5/5; missing primary requirements 0. This is not a
claim that all wider research/program goals are complete.

## Actual tests and receipts

- Focused primary: 23/23 PASS, 1 file, 2.04s (2026-10-01 21:54:04 +07).
- Full `npm run typecheck`: PASS, 0 type errors.
- Owned ESLint: PASS, 0 errors and 0 warnings.
- Actual fixed CLI: exit 0, COMPLETE, 2,657,329 stdout bytes including newline,
  packet outputBytes 2,657,328; observed elapsed checkpoint 570ms.
- Fresh fixed-source Python replay on primary: PASS,
  EXACT_FULL_COVERAGE_INVARIANTS_AGREE, 2,420ms wrapper; verified source bytes
  5eb313064a0c43d548de9b2d10cbbfa45df6b613e93caf9893db3a83685e69c5.
  Receipt digest afac6c089aa87439078aa72a634eb3a956992996f205164ffb68d57cfa9c5d3e.
  This is the observed checkpoint pin; Builder B may independently harden its
  own files before its final freeze, requiring Contractor final replay.
- Stable semantic content
  4d00cb143ae028bcda5f636df617c049ed4d006bcd54bed3f585c1c58e048347;
  rows e51794b81610642e49920bd9016835891f046d909de7a00ecdd0da61e52c5bee.
- Primary 33,932 insertions / 344,702 work; Python 95,791 pair checks /
  20,912 insertions / 2,509,370 work, Python checkpoint 578ms. The algorithms'
  counters are not equal-budget or speedup evidence.

The 23 scenarios cover frozen provenance/cohorts; complete U15 and U40
lattices; joint cyclic/noncyclic coverage; target outside D; exact atom order
versus truncated lower-bound closure; sufficient-cap false negatives; paid
numeric-lex block construction; restart/order-1; cardinality-mask selection;
legal vectors/first-target stopping; all strict tuples/inversion; energy and
unevaluated splits; >= versus >; unchanged exposed failures; abstract/root
separation; malformed factors/cap expansion; high-modulus BigInt; six lowered
resource paths; finalization/prefix preservation; inert import/fixed CLI;
actual late CLI serialization downgrade.

All subgroup inequalities are retained after failure. U15 has seven proper
subgroups with only {1,11} failing; U40 has 26 with only noncyclic
{1,11,21,31} failing. Abstract profiles never enter the fixed root/witness
gate. Actual campaign lattices are smaller; no mathematical refutation was
observed and synthetic tests are not reported as one.

No full project browser E2E, integration DB, build, live model/campaign or
provider run was performed or claimed by this Builder.

## Measured scientific result

All 191 A/B method decisions were generated before their retrospective truth
checks. Complete primary/B semantic agreement preceded the final Contractor
and skeptic double-divisor truth checks. Chronology qualification: the skeptic
had already completed its own independent 191-row method oracle and truth
diagnostic before A finished, before the later operational wait clarification.
No outcomes were sent to A/B before their method runs and no policy changed.
Its independent report discloses this chronological deviation; this report
does not claim no other context performed any earlier truth calculation. Frozen
outcome: 25 SINGLE_CHAIN_CERTIFIED, 8 BLOCK_CHAIN_CERTIFIED, 2 ENERGY_CERTIFIED,
156 NOT_CERTIFIED. Old 71: 4/0/0/67; new 120: 21/8/2/89.

Old certification gained/lost lists are empty versus TIP-040. The seven old
known hits still fail certification, including p=131433121,h=103. No claim
of solving those blockers is made. Independent post-generation new-cohort
truth, separately reported by Contractor and skeptic, finds 63 hits / 57
misses, 31 certified hits / 32 uncertified hits / 0 false certificates.
Recovery is 49.21% of actual hit rows, not NOT_CERTIFIED-as-miss accuracy.
Per-root hits/certifications: 9/5,6/5,8/3,7/2,7/4,10/4,10/5,6/3.
No old-method/new-cohort arm was run; eight block certificates are a mechanism
count, not evidence of an eight-certificate comparative improvement.

Retained block attempts: 1,050 = 1,031 atom-order rejects + 2 group-size
lower-bound rejects + 17 PASS constructions. PASS need not contain the target
or yield a final certificate. No registered attempt fails an all-subgroup
inequality; that branch is covered by explicit abstract countercontrols.

## Failure history, decisions and limits

One draft unit fixture incorrectly expected the inverse pair residues3/5 in
U7 to cover all six elements. It actually covers five. The sufficiency-cap
false-negative control was corrected to residues3/2, whose full image is six;
22/23 became 23/23. This fixes a test assumption, not the mathematical method,
inputs, routing or guard. There was no real campaign contradiction.

An attempted patch failed atomically because an already mechanically renamed
method literal did not match; the patch was reapplied with correct context.
No partial product edit or old-file rewrite resulted. A missing optional
skill-reference path was corrected to the skill's declared report-format
reference before coding continued.

Pre-outcome L1 wire clarification with Builder B: numeric coset/member ordering;
ascending exact atom-order prefix; discovery-order lower-bound prefixes;
complete size/numeric-lex subgroup ordering; current-unused support bitmask;
stage and cohort IDs; same old source bindings plus new cohort identity.
No contract deviation, fallback or post-outcome tuning occurred.

Final documentation review corrected the scoped-checker ceiling: it does
rebuild D and the full proper lattice; frequency/canonicality and execution
still require fresh replay. It also retained the skeptic's disclosed earlier
independent-oracle chronology instead of claiming no earlier truth existed.
New-file whitespace inspection found two extra blank CLI EOF lines; an
approved mechanical trim changed only its source pin. Actual CLI rerun stayed
COMPLETE with the same semantic content (638ms, exit0), and owned tests/lint
were rerun. All five owned files have no trailing spaces and one newline at EOF;
no mathematical policy or contract changed.

Resource caps are enforced for atomic rows, small-group closure, complete
subgroup collection, construction and final sealing/serialization. Lowered
SUBGROUP/SMALL_GROUP caps produce PARTIAL, not a mathematical rejection.
Work counters count modular/group/factor operations, not all mask/primality
CPU steps; the time envelope covers synchronous work but is not hard
preemption. The final scoped checker rebuilds exact D and the complete proper
lattice, checking closure, membership, relative orders and inequalities. It
does not prove exact histogram multiplicities or numeric-lex representative
completeness/canonicality, nor source execution: fresh independently
implemented replay remains required.
Receipt/source integrity is local collector trust, not signed attestation
of the Python binary. Formal/external mathematical independence is absent.

## Suggestions and deferred gates

The rigorous new general sufficient mechanism works on some finite additional
roots but does not rescue the old exposed failures. Study root-bound factor
supply and quotient occupancy on the remaining hit rows; do not enlarge
blocks/multipliers or change thresholds after observing these results.

Deferred: unbounded factor-supply/root bridge; novelty/prior-art acceptance;
formal/external mathematical review; governed tool/UI/agent integration;
uncontaminated equal-budget model evaluation; live product E2E. No root-wide
Erdős242 claim or publication gate is promoted. READY for Contractor verification
of the bounded primary slice, not universal research completion.
