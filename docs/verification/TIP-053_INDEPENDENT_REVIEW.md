# TIP-053 independent prefix/KZ mathematical and implementation review

Status: PASS_WITH_SCOPE_LIMITS — mathematical, implementation and independent
arithmetic review complete for the source hashes recorded below. The abstract
fixed-n product lemma is ACCEPTED_WITH_WRITTEN_REAL_BRIDGE. Its LRC application
and all 23 global proof-plan obligations remain OPEN/NOT_ESTABLISHED.

## Sources and acceptance distinction

Read sealed TIP-053 contract, AGENTS/current durable handoff, Main's
`LRC_PREFIX_KZ_ANALYTIC_AUDIT_2026-10-03.md`, and primary
[Allikvere v2, §§3.2–3.4](https://arxiv.org/html/2609.02604v2).
No author/archive program was executed. Reviewer is a separately instructed
same-model agent, not an external mathematician or proof assistant.

For fixed n=13,14, the abstract REAL-variable product lemma can be accepted
with its written polyhedral bridge and exact arithmetic independently replayed.
That is substantive bounded progress, not a new mathematical discovery.
Application to every actual LRC counterexample remains conditional on accepted
lower cases, the ellipsoid/projected-lattice bridge and KZ basis properties.
All 23 existing global application dependencies remain OPEN; full LRC14/15,
novelty and formal/external acceptance are not established here.

## Written mathematical review

- Rational-subspace induction: coordinate functionals span the dual, so for
  dimension q>=2 some pair is nonproportional. A minimum positive line-angle
  pair, suitably oriented, has a sum lying strictly between its lines. If that
  sum were parallel to any coordinate functional, it would contradict the
  selected minimum angle. The hyperplane perpendicular to the sum therefore
  retains all coordinates, imposes yi=-yj, and coordinate deletion is injective.
  Rationality follows from rational orthogonal projection onto rational V.
  The ambient/subspace dimension induction preserves both lower-LRC index
  n+1-q and separation denominator n+2-q. This is reviewed written source
  reasoning, not a computed witness or formalized induction.
- Prefix implication: V=span(v,z1,...,zr) has dimension r+1 by projection and
  contains positive v. The lower-case requirement is through n-r; its separated
  point has distance at least 1/(n+1-r). Descending nearest-plane rounding
  gives projected error at most sqrt(sum t_i)/2. E subset D and integer lifts
  then turn coordinate errors into a witness when the error is at most
  r/((n+1)(n+1-r)). Equality still gives distance >=1/(n+1), so a counterexample
  must have STRICT prefix sum >B_r. Exact scalar identities alone do not
  establish the geometric hypotheses.
- Abstract change of variables: wi=(3/4)^(i-1), zi=ti/wi turns KZ into monotone
  z and leaves positive weighted-prefix constraints. z1>=B1>0 places the closed
  polyhedron in the positive orthant. Its recession directions are exactly
  0<=u1<=...<=ud; r=1 forces u1>=0, and monotonicity makes the other weighted
  prefix inequalities automatic. Thus the polyhedron is pointed.
- Vertex necessity: maximal constant-z blocks give d-beta active adjacencies.
  A prefix strictly inside one such block cannot be active: feasibility at the
  block start and activity at r force z_block<=c_r/w_r, while feasibility at
  r+1 forces z_block>=c_(r+1)/w_(r+1), strictly larger. Therefore all beta
  block-end prefixes must be active for full vertex rank d.
- Vertex sufficiency: each block value is the weighted average of ci/wi over
  that block. Strict increase of those ratios guarantees successive block
  values are distinct/increasing and each internal prefix is feasible. The
  block-end and adjacency equalities have independent rank d. Every contiguous
  composition is a vertex and every vertex is one of those compositions.
- Real-domain completeness: Minkowski–Weyl represents every feasible point as
  a convex combination of these vertices plus a nonnegative recession vector.
  Coordinate-increasing concavity of sum log(wi zi) then puts its infimum at
  a vertex. This WRITTEN bridge, not vertex counting alone, covers arbitrary
  positive real inputs. Positivity avoids undefined logarithms; no line or
  negative recession direction is silently ignored.
- Equality: every nonsingleton block has a strictly larger product in the
  independently checked fixed n cases. Only all-singleton composition has
  product K. Any nonzero recession vector increases the objective; any convex
  combination involving a nonminimal vertex has larger objective by concavity.
  Thus all-real equality occurs only at ti=ci. This point is not an actual
  counterexample because actual counterexample prefixes must be strict.

## Independent calculation actually executed

A separate stdlib Python `Fraction` calculation used recursively generated
integer compositions, not Builder's cut-mask implementation. Derived B,c,w and
every contiguous block; checked block product, each full vertex's KZ and all
weighted-prefix constraints, distinct vertices and minima.

- n13/d12: 78 blocks, 66 nonsingleton strict inequalities, 2,048 distinct
  feasible vertices. Unique equality: all-singleton composition.
- n14/d13: 91 blocks, 78 nonsingleton strict inequalities, 4,096 distinct
  feasible vertices. Unique equality: all-singleton composition.
- Exact minima:
  K13=89348172069691/3616460531462492894939937597619200000000;
  K14=2289670297/97243124257250844122250000000000000000.
- All 25 prefix separation-minus-error identities equal 1/(n+1), with lower
  index n-r, and every adjacent c-growth ratio is greater than 4/3.
- Omit KZ: B=[1,5], t=[5,2/5] satisfies prefixes but product2<4.
- Omit growth: B=[1,2], t=[8/7,6/7] satisfies KZ/prefixes but product48/49<1.
  These controls are abstract mathematical examples, not LRC counterexamples.

No mathematical flaw found in the sealed conditional argument or Main note.

## Final implementation review

No consequential implementation defect or unresolved finding in reviewed bytes.

The pure consumer reconstructs fixed formulas, all 169 contiguous blocks and
every cut mask 0..2047 / 0..4095, then compares the entire semantic report body.
It does not accept producer-provided counts or stream hashes without rerunning
their arithmetic. Canonical rational values are enforced by comparison to its
reconstructed reduced values. Both source dimensions are fixed, not selected
from untrusted input. Unknown fields, missing/reordered blocks, promoted lower
or geometric premises, formal/global promotion and altered minima are rejected.

JS checks internal prefix feasibility and active block ends for EVERY contiguous
block before joining blocks for EVERY mask. Checking successive constant-z
scales enforces cross-block KZ, while within-block KZ is equality by construction.
This compositional check is mathematically equivalent to full vertex feasibility,
not missing prefix checks. The independently implemented Python Fraction program
additionally materializes each complete vertex and explicitly checks every full
prefix and every adjacent KZ inequality. Exact ordered vertex streams match.

The negative control growth flags are correct: B=[1,5] has increments 1,4 and
ratio4>4/3; B=[1,2] has ratio1, which fails the required growth. Neither control
is described as an LRC counterexample. KZ basis existence and rational-subspace
induction remain written/source-based application premises, not machine-established
geometric witnesses.

Actual reviewer execution:

- No-write collector freshly executes pinned Python bytes (`-I -S -B -c`,
  shell false) and matched 60,239 output bytes in 838 ms. Output SHA-256
  `c575944c443b4fa229bf7a1ccccdc8e9fd0b9c56e275c9aa90e04756f4d14b4a`.
- A THIRD stream oracle used recursive integer compositions, independently
  converted their block ends to masks, sorted the masks and hashed exact products.
  Reproduced complete n13 stream
  `34c1eefa103ff1bff192b1737a2fbcc4a2bec93c62336e579b5134535dc7f03f`
  and n14 stream
  `041244221e716b5e8cdf19f2ca7c5e1dbd422f99bd8732286fa4143d19af450c`.
- Thirteen independent faults, each with stdout digest/bytes and outer report
  digest coherently resealed, all rejected: missing block, duplicate block,
  missing prefix, wrong lower index, wrong equality count, wrong stream,
  wrong mask count, wrong minimum, noncanonical rational, source-section drift,
  global promotion, formal promotion, and relabelled negative control.
- Three new unit files: 43/43 PASS, 5.86 seconds. Includes actual independent
  Python, source/runtime drift, process failure and capped deadlines, create-only
  collector output, many coherent-rehash attacks, VI/EN/fail-closed presentation,
  pure read projection and unchanged global statuses. No mocked LLM campaign.

Fresh collector has a ten-second outer budget. Source preparation/primary
arithmetic is charged to it, and Python receives at most the smaller of five
seconds and remaining budget. Final admission checks total elapsed time again.
JS deadline checks are cooperative, not CPU preemption; Python has its own
process kill timeout. Unsigned hashes/receipts assume trusted local collector,
interpreter and storage, not external execution attestation or formal proof.
The retained pure projection imports no CLI/runner and launches no subprocess,
network/model or historical validator. No prior evidence is resealed.

UI review: abstract minimum is stated symbolically as K_n=product c_i with
unique singleton equality, independently of conditional LRC application.
Exact rational values remain retained in the report and Main mathematical note.
Bulky denominator digits are deliberately not added to parent HTML because an
unchanged prior regression excludes them; the reviewer suggested digits, then
accepted the approved symbolic display and no old-test weakening. The written
all-real bridge, lower/geometric premises, all 23 open global obligations and
absence of new agent integration/campaign are explicit. No scope promotion.

Reviewed SHA-256 pins:

- Pure module `bb6670e52e18c96d617916e24ffcaa385d36b4a97e7ce001122fc9fac073d37d`.
- Fresh runner `7673e1a230ca750d0fa20fc317cbd0b52523a790f3a3daccc782e27d1218c40d`.
- Python `4db152962dd6991e7454cb02922c818aebbdceddfb0ec5d8fee2d687b4baf87c`.
- CLI `f91d94130caeae4c6209fca300e312db080585d1b773bce2e27b62d319036aaa`.
- Retained raw report `e17d97fa1d4a8f05e899e06cfb2da24fb439376fe25b6783eb9c10da650ab8f6`.
- Pure tests `2bdb046a77967dfae480f74d9558434b85aec730eb10ea7f6b7f87e556337959`.
- Replay tests `1ff64afaabba9bcd581b01c29c66bede69b1b7fb25c64e58c7d1089880fd11ec`.
- UI `e37366024f8e9b0cfec368ef31421f2ffa88ab06c64b433478054a39794815f2`.
- UI tests `c10428989d8c58eed037320d0c50ef82394b9683e8ab98ad61e49876437c0143`.

Changed bytes after review require relevant re-review. No product edits are
owned by this reviewer. The accepted bounded abstract lemma is substantive
progress in reproduction/audit, NOT novelty, formal proof or full LRC closure.

Browser, repository build/lint/typecheck, full unit suite, DB integration,
live model campaign, author archive and formal/external acceptance NOT_RUN by
this reviewer; Main handles proportionate product acceptance separately.
