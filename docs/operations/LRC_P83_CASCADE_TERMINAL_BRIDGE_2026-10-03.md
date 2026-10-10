# Complete p83 binary cascade and terminal bridge

Mathematical scope: k13 moving speeds,14 total runners, p83. Generation must
first be accepted with its EXACT full canonical115903-row predecessor. A grid
witness is good at equality:14*distance>=modulus. A tuple is proper if it has
a grid witness or gcd(level,all coordinates except some i)>1. These are finite
definition predicates; global inference still has the un-replayed lower-LRC
and other-prime obligations. No finite-grid failure is a continuous counterexample.

## Entire binary fibers as exact Boolean constraints

At parent modulus N=83*l, each coordinate u has two lifts u and u+N modulo2N.
All2^13 labelled assignments are the full fiber. For even time t=2s, each
product differs by an integer on the parent time grid, so its distance predicate
equals the parent predicate. A witness-free parent already covers every even
time. If parent is proper, properness persists at every multiple of its level;
its children need not be enumerated further.

For odd time t, the two choices differ by phase t/2, hence1/2 modulo one. The
strict bad arc has length2/14=1/7, so both choices cannot be bad simultaneously.
Each odd folded time yields a clause: at least one coordinate must choose the
unique bit, if any, that is bad there. A clause may be empty, certifying a grid
witness for every assignment in that branch. Satisfying every odd-time clause
is equivalent to the full grid-witness-free condition, not a heuristic sample.

DPLL may force a sole remaining literal, reject an empty unsatisfied clause,
or split on an unassigned variable with BOTH bits mandatory. Record enough
information to replay every forced assignment, contradictory time, split and
satisfying leaf. Once all clauses are satisfied, enumerate EVERY free-bit
assignment; do not keep only one representative. Directly test the gcd predicate
for every resulting complete tuple and retain exactly the improper ones.
Induction on free variables proves exhaustive partition of all8192 labelled
assignments per parent. Counts or hashes alone do not prove this equivalence.

At these power-of-two levels, the gcd condition is equivalent to at most one
odd coordinate. After level2, coordinate parity is fixed by the parent; this
fact can optimize filtering but must not replace the original predicate in
independent checks. Deduplicate only exact sign/permutation classes: fold each
coordinate modulo the current modulus, sort all13 entries, preserve repeats.
Signs and permutations are bijections of full next-level fibers and preserve
grid witnesses/gcd, so one representative suffices. Do not assume arbitrary
level-one unit normalization equals a fixed finite-level fiber.

Repeat for ALL admitted parents at2,4,8,16,32, keeping the full exact sorted
output at each stage. Empty fibers establish properness for that complete
branch; nonempty output is a live frontier, not a proof of failure or of LRC.

## Deriving the live level2 ancestor domain

Reduce every retained level32 row modulo166=83*2, fold each coordinate and
sort. This gives the complete set A of level2 ancestor classes of the live
frontier. Reduction commutes with independent signs/permutations. Any improper
level32 tuple reduces to an improper level2 row; otherwise properness would
persist to32. Every row whose level2 ancestor is absent from A is already
proper at32 according to the COMPLETE accepted cascade, not a sampled branch.
The exact A must be computed and retained; its expected small cardinality must
not be assumed from the paper or a diagnostic run.

## Full level14 fibers, exact multi-valued clauses

For each row u in A, the seven choices u_i+166*a, a=0..6, are ALL level14 lifts
of its13 labelled coordinates. Their Cartesian product is7^13 assignments.
Folding modulo1162 preserves distances and gcd; each original choice must remain
accounted for even if any later deduplication is used.

Times divisible by7 inherit the witness-free level2 predicate. At any other
time the seven choices give seven equally spaced phases, since t is a unit
modulo7. The open bad arc has length1/7, so at most ONE choice of each coordinate
is bad. Thus each remaining folded time gives an exact multi-valued clause
whose literals say 'coordinate i has digit a'. Zero literals means a grid witness.
The endpoints are good; both bad endpoints must never be included by a <= test.

An exhaustive domain solver may use sound unit propagation, empty-clause
rejection and a complete partition by a coordinate's available digits or by
the first satisfied literal. If the latter is used, later branches exclude
all earlier literal values from their coordinate domains. These exclusions,
including domains becoming empty, must be explicit/replayable. No literal,
digit or free assignment is omitted. A stronger covering gain prune is allowed
only with a proved upper bound valid for every remaining choice/domain.

Specifically let U be the still-uncovered folded times, and B(i,a) the bad
mask of digit a in the current domain D(i) of an unassigned coordinate. If
the union of ALL B(i,a) misses a time in U, no completion can cover it. Also
each completion chooses at most one digit per coordinate, so it covers at
most sum_i max_{a in D(i)} |B(i,a) intersect U| currently uncovered times.
If this sum is less than |U|, rejection is sound despite overlaps (overlaps
can only lower the actual union). Both bounds must be recomputed for the
actual reduced domains. No minimal-cover/private-member pruning transfers
automatically to this terminal decision problem.

Monotone gcd pruning is independently sound: once at least12 assigned
coordinates are divisible by7, every completion is proper, whatever the last
coordinate. More generally,12 coordinate domains restricted to7-divisible
choices suffice. This may cut before grid coverage completes. It is a properness
certificate for the whole branch, not a reason to label each tuple a grid witness.
Every remaining satisfying complete tuple must be directly tested for both
definition alternatives. Any improper leaf refutes the terminal claim.

## Non-comparable levels and a common level224

Levels14 and32 do NOT divide one another; their results cannot be transported
directly. Let L=lcm(14,32)=224. Suppose the entire generation and binary cascade
are accepted, and every level14 lift of every computed live level2 ancestor in
A is proper. A hypothetical improper level224 tuple reduces to an improper
level32 tuple by monotonicity. Its folded level2 ancestor therefore belongs
to A. Reduction modulo1162 is a level14 lift of that ancestor, up to signs/
permutation, so it is proper by the FULL terminal certificate. Properness
persists to224, contradiction. Thus the whole admitted level-one domain has
no improper lift at224.

For any level-one unit translate, choose its unit multiplier at modulus83*224
by CRT (specified multiplier modulo83 and1 modulo224). This is a unit and
gives a bijection on full fibers; permutations/signs likewise give bijections.
Therefore complete unit-orbit generation plus the common-level argument imply
I(13,83,224) is empty, hence J(13,83) is empty in the finite eventual-properness
definition. This is ONE selected prime, not all61 or globalLRC14/15.

## Trust and admission boundary

Each stage must bind every predecessor row and retain complete branch evidence
and exact decoded outputs, independently replaying all rather than relying on
source totals. Only after whole generation, whole cascade, the derived live
ancestor set, WHOLE terminal fibers and this bridge are reviewed can the local
p83 result be admitted. Until then all proposed counts are SCAN observations.
Passive UI summary pins identify trusted local offline receipts; GET does not
repeat these computations. Unsigned receipts/program/interpreter/storage trust
are not external attestation or a formal proof assistant's certification.

[Allikvere2609.02604v2 §§2,4.2–4.3](https://arxiv.org/html/2609.02604v2) supplies
the properness/lifting context. The clause encodings, complete live-ancestor
reduction and common-level partition above require their own independent
implementation and universal review; source logs alone are insufficient.
