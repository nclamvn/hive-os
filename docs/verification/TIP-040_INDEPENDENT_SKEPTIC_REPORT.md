# TIP-040 — Independent skeptical review

2026-10-01. Separate same-model context and independent arithmetic paths,
not formal proof-assistant, external-expert or different-model independence.
Own writes are this report only. AGENTS, current handoff, Vibecode Kit v6.2
and applicable QA/report references read. No product, prior evidence, campaign
inputs, provider, DB, UI, worker or Git mutation.

## Current verdict

PASS_WITH_SCOPE_LIMITS. Mathematical checkpoint and final local implementation
review pass under the written allocation and target-membership hypotheses.
Final A/B code, tests, research note and completion reports read fully from disk;
seven current source/test pins, contract and all28 prior source/test pins match.
Own final30 focused scenarios and actual fixed-byte replay pass. No open blocker
for this standalone sufficient-certificate slice; this is not product/root gate
admission, formal proof, novelty or a universal root-coverage result.

Frozen TIP SHA verified before any coverage execution:
45007d95c263301e726006d1d2fb285350ec45e08959dfc87356336f5ed32e60.
Only its exact60 TIP-037 and11 TIP-039 inputs were evaluated. No cyclic-block
fallback, larger shift or additional target was executed.

## 1. Quantified constructive hybrid proof

Let T have distinct prime factors r_i with actual valuations e_i. The full
signed factor box consists of products r_i^{z_i}, |z_i|<=e_i, in G=U(m).
Allocate supports J,A,B disjointly. All prime valuations are spent at most once.

For a covered subgroup Kprev, suppose an unused factor's relative order
d=ord(r_i Kprev) in G/Kprev is at most2e_i+1. The consecutive digits
[-e_i,-e_i+d-1] represent every relative coset exactly once. Multiplying these
digits by the independently covered Kprev therefore covers precisely
Knew=<Kprev,r_i>. Its d cosets are disjoint, so retained legal exponent vectors
give every element of Knew a constructive representation. Starting at {1},
induction proves the entire retained K is covered by support J alone.
Reconsidering previously ineligible factors is valid after K grows; including
relative-order1 factors does not invalidate coverage. No exact stabilizer of
the final full image or exhaustive target-membership computation is required.

If target -1 lies in K, its retained vector is already a legal witness. Otherwise
let Q=G/K. For each legal unused-support bipartition A,B, count assignment
multiplicities mu_A,mu_B on exactly this same quotient. With N=sum mu and
E=sum mu^2, Cauchy–Schwarz gives N^2<=|support(mu)|E. Thus each half-image has
at least L=ceil(N^2/E) distinct quotient cosets. If L_A+L_B>|Q|, its two
images S_A and target*S_B^{-1} intersect by cardinality. Selected half
representatives a,b satisfy target/(ab) in K. Lift that discrepancy using
the separately allocated support J. Combining the three vectors stays within
every original valuation because the supports are disjoint.

From combined exponents, form u=product r_i^{max(z_i,0)} and
v=product r_i^{max(-z_i,0)}. Then gcd(u,v)=1, uv divides T, and ratio -1
implies m divides u+v. With k=T/(uv), A=(u+v)/m, the established Type-II
construction gives denominators T,Apuk,Apvk. T<p and target m>2 ensure
strictness after sorting; actual integer checks must still verify all three
distinct denominators, exactly two p-divisible denominators and
4xyz=p(xy+xz+yz). This is a constructive witness, not a globally minimum one.

The second-moment deduction is standard; it is already present in the project's
collision-kernel note. It uses assignment-collision energy, including diagonal
and multiplicities, not set energy or a sampled/lower energy estimate. A
certified upper bound on E is safe, but exact E need not be computationally
cheaper than direct images. Integer ceiling and strict > are essential.

## 2. False variants and incompleteness

Abstract proof controls, not new registered roots:

- U(7), one residue3 with valuation1: generated group contains target6,
  but signed image {1,3,5} misses6. Generation is not coverage.
- U(15), covered K={1,4}: even group size does not imply target14 belongs to K.
- U(7), disjoint prime factors3 and17, valuation1 each: both half-images
  {1,3,5} have size3, sum6 equals the group order, and the joint image misses6.
  Equality cannot replace strict >.
- U(5), the same factor2 valuation1 reused for both halves: each size3 and
  sum6>4, but the original image misses4. Overlapping full budgets are illegal.
- U(15), disjoint factors2 and17 valuation1: both images lie in <2> of size4
  and their sizes sum6, but target14 lies outside that subgroup. The chosen
  common ambient group must actually contain the target.

The final full-image stabilizer is not a free covered subgroup that can be
reused while all factors are spent again. Quotient coset multiplication must
be canonically reduced; comparing unreduced numeric representatives is not a
group computation. Invalid energies/lifts/budgets must fail closed.

The ascending-eligible chain is deterministic but incomplete: a factor need
not individually saturate its cosets for several factors jointly to yield a
hit. Failure of either sufficient criterion is NOT_CERTIFIED, not MISS or
root exclusion. A prior independently exhaustive comparison can attribute
known hits/misses only after certificate generation; it cannot route this method.

A direct abstract incomplete-HIT control: U(11), distinct prime factors3 and7,
valuation1 each. Their relative orders from {1} are5 and10, both larger than3,
so the chain cannot start. The two half-images have size3, N=E=3 and L=3;
the sole partition has6<=10, so energy does not certify. Nonetheless3*7=10
modulo11, a legal target representation. The full image is
{1,2,3,4,6,7,8,10}. This is a proof control, not a new registered p/T row,
and concretely disproves completeness of the approved sufficient policy.

Proof-only future cyclic-block proposal was challenged separately: in cyclic
L/K of order d, if every visible block factor generates L/K and total allocated
mass W has2W+1>=d, the block covers L/K. Otherwise quotienting by its exact
stabilizer gives order n>=3 (order2 atom already fills); all atom images have
three points and all prefix periods persist. Iterated aperiodic Kneser gives
at least2W+1>=d>=n points, contradiction. This standard Kneser deduction is
valid under those stronger hypotheses, but is NOT implemented or evaluated as
a TIP-040 fallback. Dropping the generator or allocation hypotheses is unsafe.

Positive nontrivial-lift abstract control was independently derived before
calling the current abstract engine: U(19), distinct primes2,7,59,97, all
valuation1. Prime7 first saturates K={1,7,11} with relative-order3. Remaining
factors all equal2 modulo19 and have relative-order6>3, so the chain stops
without target18. First partition has A={2}, B={59,97}; N_A=E_A=3,L_A=3,
N_B=9,E_B=19,L_B=5, and quotient order6. Thus3+5>6. Numeric A coset2 matches
B coset4; actual residues2 and4 need lift7, since2*4*7=18mod19.
The combined vector (1,1,1,1) normalizes to(-1,-1,-1,-1), with oriented
coprime pair(1,80122). The abstract engine agrees and explicitly retains
two unevaluated allocations after first success. This exercises a positive
ENERGY/lift/inversion path despite zero ENERGY rows in the registered batch.
No p/T root was generated, no strict Type-II claim was issued for this control,
and no campaign row was added. Builder A was notified before freeze.

## 3. Independent registered-input calculation

Initial read-only Python stdin oracle independently factored the exact71 inputs,
checked primality/admissibility, relative orders, subgroup representations,
quotient frequencies and integer energies, and checked constructive strict
tuples. It interpreted R01's chain termination literally as continuing until
no eligible factor, then testing target. It found4 CHAIN_CERTIFIED,
0 ENERGY_CERTIFIED and67 NOT_CERTIFIED. This used10,990 half assignments,
11,707 counted group operations and about0.095s including trial factors and
the later ground-truth batch. Those counters belong only to that initial
termination interpretation, not to the final clarified implementation.

Contractor explicitly resolved this L2 determinism seam before Builder
execution: stop immediately when the target is first covered, consistent with
R02 first proved certificate. Half representatives are numeric-lex coprime
pairs (u,v), not exponent-vector lexicographic minima; scan A canonical cosets
in numeric order, match B, then lift once. Inputs/method predicates are unchanged;
constructive m3 witnesses differ from the initial terminal-chain oracle.
The final clarified convention was independently rerun on exactly the same71
inputs, with each half enumerated by positive coprime-divisor pairs and
numeric-lex pair representatives, not importing Builder code. It agrees on
4 CHAIN_CERTIFIED,0 ENERGY_CERTIFIED,67 NOT_CERTIFIED;248 legal bipartitions,
10,990 half assignments and11,698 counted group operations, about0.0237s
including the subsequently executed independent ground-truth comparison.

Constructive chain vectors and pairs in sorted factor order:

| p,m | Factor powers | First target-covering chain / combined vector | u,v |
|---|---|---|---|
|200023321,3|29,1724339|29 relative-order2;(-1,0)|1,29|
|200602081,3|89,563489|89 relative-order2;(-1,0)|1,89|
|200602081,31|2^7,391801|2 relative-order5 then391801 relative-order2;(-7,-1)|1,50150528|
|200656681,3|29,1729799|29 relative-order2;(-1,0)|1,29|

The m31 covered subgroup has size10, not the full group size30. Every displayed
pair and strict three-denominator identity was directly checked with integers.

Only after all71 initial sufficient decisions, a separate divisor-pair truth
batch found11 known hits:4 certified and7 NOT_CERTIFIED known hits. The7 are
(200023321,103), (200602081,79), (200656681,19), (200656681,31),
(200656681,79), (131433121,71), (131433121,103).
All11 composite rows remain NOT_CERTIFIED; their previous exhaustive misses
are not relabeled by this sufficient method. No new root coverage follows.

## 4. Implementation, adversarial and resource checks

Primary, fixed CLI, Python, scoped checker/wrapper and primary unit file read
fully from disk. TS uses quotient-frequency DP and positive numeric-lex pair
retention; Python independently factors and enumerates coprime divisor pairs
per half. Chain coverage, allocation policy, matching cosets, actual-residue
discrepancy lift, normalization and strict root-bound tuple checks are coherent.
Neither producer imports prior exhaustive outcomes or executes cyclic-block
fallback. Old comparison is a separately attributed later test only.

Own actual fresh source-byte replay before final B report freeze: PASS,
EXACT_FULL_COVERAGE_INVARIANTS_AGREE,626ms wrapper. Primary11,405 state
insertions/119,478 work steps/143ms/744,374 bytes. Python40,399 pair checks,
7,068 retained-state insertions/14,615 work steps/100ms/744,393 bytes.
Expected/observed/verified Python SHA
57874e09b3c501919c64c611b25d475d2f83419aabc35024fcd06af518983b96.
Full stable content
48b455470ecb38da669d372206841a65fbc34facb0b684763a01b3df5d96fa72.
Final frozen source-byte replay independently rerun: PASS,
EXACT_FULL_COVERAGE_INVARIANTS_AGREE,644ms wrapper, exit0. Expected, observed
and verified Python SHA equal the same57874e09 pin. Replay content remains
48b455470ecb38da669d372206841a65fbc34facb0b684763a01b3df5d96fa72;
Python40,399 pair checks,7,068 retained-state insertions,14,615 work steps,
99ms and744,392 bytes. Resource counters and packet/output hashes depend on
observed runtime; semantic content is the stable comparison authority.

Nineteen own fully-rehashed faults rejected: prior-content provenance, root,
factor product, group order, relative order, covered entry, valuation budget,
reused chain support, overlapping halves, N, energy diagonal, ceil bound,
strict-threshold predicate, coset, lifted tuple, target status, pending prefix,
runtime work and COMPLETE elapsed60000ms. All local verification false and
comparison MISMATCH.

A coherent frequency-mass forgery on P0_h11, mask1, half factors[1,2],
redistributes one multiplicity while preserving total N, all legal vectors and
recomputing E/L/sufficient/all nested hashes. It passes scoped consistency
but a fresh actual fixed-byte comparison returns MISMATCH in616ms. Thus the
scoped validator is not an exact frequency or numeric-lex canonicality oracle;
fresh execution remains mandatory. It cannot be described as complete semantic
acceptance on hashes alone. The unchanged sufficient predicate and valid
representatives in this test do not establish a new mathematical HIT.

Own actual primary maxRows1 retains one atomic row, pending ROW P0_h7;
scoped validation true and wrapper PARTIAL, never PASS. Read-only Python phase
injections preserve exact pending ROW P0_h3/P1_h31/C_r13 prefixes0/20/70 and
FINALIZE71; every summary complete flag false. Lowered pair limit1 stops after
two rows, pending P0_h11; state/work limit1 stops with no row, pending P0_h3.
No shared files were changed for these tests.

Resource receipt includes source reads, validation, child execution/comparison
and observed finalization; fixed CLI includes dynamic import/serialization.
In-process inert-import exclusion, synchronous checkpoint versus hard
preemption, and trusted local collector/Python PATH remain limitations, not
external execution attestation. Outputs remain below2MiB and PARTIAL cannot
be promoted to COMPLETE/PASS. No arbitrary executable or provider is used.

Own28 previous TIP-036/037/038/039 source/test pins independently hashed twice
and unchanged at final freeze. Both final unit files read fully and independently
run together:30/30 scenarios,2/2 files PASS,13.39s, start21:29:02+07.
The preceding own A-only final run also passed18/18. Positive abstract ENERGY
controls exercise nontrivial lift/inversion and retained unevaluated allocations;
all actual registered certificates use CHAIN, so zero registered ENERGY success
must not be described as measured ENERGY yield.

The bounded exported abstract-allocation helper deliberately checks allocation,
chain, quotient and energy consistency without root-witness or fixed-campaign
admission. The global packet checker calls the witness-checking path and rejects
inserting these controls into the fixed packet. A fabricated abstract witness
can pass the abstract seam; it is not a root proof or admission authority.
Fresh comparison, not the abstract helper or hashes alone, supplies the current
exact-multiplicity/canonicality acceptance boundary.

Contractor-attributed final repository checks, not rerun by this reviewer:
715/715 unit tests,101 files PASS,95.43s, start21:27:51+07; full TypeScript,
full and owned lint exit0. Contractor also reports actual fixed CLI exit0,
185ms/744,375 stdout bytes and fresh replay PASS680ms/Python102ms.
These aggregate checks supplement rather than replace the independent review.

## 5. Frozen fingerprints and requirement coverage

All hashes below were computed from the final current disk, not stale snapshots.

| File under scripts/operations, unless noted | SHA-256 |
|---|---|
|sufficient-coverage.ts|b289366a8676fe2b7c3362312981c9508c841ed5e3597d7b7a8455e6c40f6084|
|sufficient-coverage-audit.ts|58e5ae31affa5ff7526e27bd066b801391723ab162683d859af54afa4388dc2d|
|sufficient-coverage-replay.py|57874e09b3c501919c64c611b25d475d2f83419aabc35024fcd06af518983b96|
|sufficient-coverage-check.ts|939b9e7c1b2ac3fc97d4eeb2501c383ba4366ab145dc0d9f61f1e756e1d55a07|
|sufficient-coverage-replay.ts|5497d52d04cfb001302847660e1faae6fc4b9d7445b67ef510fb58a531d151f4|
|tests/unit/sufficient-coverage.test.ts|50b9af634c15458a5688ee6ca339e16bbafd0d9df5688b473c37e7d3993ed63b|
|tests/unit/sufficient-coverage-replay.test.ts|60756d4596d5a814b53d1ac1791ed324a714336feb3b334139fbd0cfbe0edb33|

Research note SHA:
0678284fde6456e749ceb7023b8f214ffd07db44d930f5a0b5373890a3dcad0d.
Primary completion report SHA:
32c25410c81ba3258fbc107dd0c1e580fc2ddfb0b90ff7c3c2037fe516fe52ec.
Replay completion report SHA:
b95532eff8009da6c59a0834afdf4fc59cfdd18dd72576edf2e5e711b1cfe1a5.
Both reports' scope/provenance/resource statements agree with the observed code
and receipts. Their completion is local assigned work, not external certification.
The final replay report's diagnostic precision was reread completely: post-row
status/certificate/attempt inconsistency retains an INVESTIGATION row; earlier
factor/coset/strict-arithmetic ValueErrors fail closed without a universal full-row
retention guarantee. The tested injected inconsistency is synthetic, not an
observed mathematical counterexample. No source/test pin changed in this amendment.

- R01 PASS: allocation-safe proof, exact covered chain, strict quotient-energy
  threshold, independently paid lift, greedy incompleteness and false variants.
- R02 PASS: exact71 frozen inputs, constructive vectors/strict tuples, separate
  full fresh replay and post-certificate known-result comparison without routing.
- R03 PASS: explicit caps, exact atomic partials, contradiction/non-COMPLETE
  diagnostics, pin/read/process/serialization/final receipt guards and tampering.
- R04 PASS: all assigned sources/tests/notes/reports read, final pins and old28
  preservation checked, independent30 tests plus attributed aggregate715 tests.

Scope-limited local requirements4/4 reviewed; no remaining implementation blocker
found. This report does not authorize expanding the campaign, provider execution
or governed product result promotion.

## Scientific and operational ceiling

The71 exposed controls are not held-out data, model yield or novel roots.
Conditional sufficient coverage is not a theorem that every root supplies such
an allocation. A lower collision bound/character/large mass/generated subgroup
cannot substitute for the verified certificate. Formal/expert/novelty,
root-wide factor supply, governed agent/UI admission and comparative live
model measurement remain deferred. The weighted-energy mechanism is known and
the four constructive certificates reproduce already exposed solutions. The
next useful scientific step is a separately preregistered stronger sufficient
criterion with an honest known-hit recovery/complexity comparison, not an
unregistered fallback or a larger-input count presented as a breakthrough.
