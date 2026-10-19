# Complete terminal certificate — live p83 F2 ancestor domain

This is a universal certificate specification, not an admitted execution.
It depends on the ENTIRE admitted057 generator and ENTIRE admitted058 cascade,
including the exact final32 and derived live2 ancestor datasets. The observed
two ancestors are not selected samples. No lower-LRC or author-code premise
is needed for this finite computation. Global inference remains separate.

## Full labelled domains and integer arithmetic

For a live ancestor u modulo166, each of13 coordinates has seven choices
u_i+166*a modulo1162, a=0..6. At every node a coordinate domain D_i is a
nonempty subset of these digits. Every completion is labelled; repeated
coordinates do not permit erasing choices. Its mass is the integer product
of the13 domain cardinalities. The root mass is7^13=96889010407, safely below
the JavaScript exact-integer limit, but intermediate numbers must still be
checked as safe nonnegative integers, not parsed approximately.

For folded time t, bad means14*min(t*v mod1162,1162-(t*v mod1162))<1162.
Equality is GOOD. Times divisible by7 inherit the witness-free F2 ancestor
predicate. At all other folded times, phases of the seven choices are exactly
spaced by1/7; the strict bad arc has length1/7 and contains at most one of
these phases. Construct the complete clause of literals (coordinate,digit)
whose speed is bad at t. The clause means at least one literal must hold to
avoid a grid witness. Every folded time is accounted for, not sampled.

An actual admissible boundary control exists here (unlike prime-only83):
u=1,t=83 and digits a=0,1 give residues83 and1079 modulo1162, both at
distance83=1162/14 and therefore GOOD. These are two endpoints of the bad
arc; replacing < with <= would incorrectly give two bad choices for one
coordinate, violating the clause encoding itself. Test both endpoints and
all seven choices, not just a synthetic boundary or policy string.

## Node invariants and complete disjoint partition

A clause is satisfied if a singleton coordinate domain is its bad digit.
Otherwise its available literals are those whose digits remain in their
coordinate domains. A zero-literal unsatisfied clause means EVERY completion
has a grid witness at that time. This is a sound full-domain terminal leaf.

If an unsatisfied clause has exactly one available literal (i,a), all choices
in D_i except a have the same grid witness. Their rejected mass is
(|D_i|-1)*product_{j!=i}|D_j|. Continue with D_i={a}; the surviving mass is
product_{j!=i}|D_j|. A recorded force must include the literal and time;
the independent verifier recomputes both before accepting either mass.

For a split clause list all currently available literals in the agreed
deterministic order. Branch j fixes its literal, while excluding every earlier
literal digit from that earlier coordinate's domain. These are precisely the
completions whose FIRST satisfied literal is j. After the last branch, exclude
every literal digit: the remaining NONE-satisfied region has a grid witness
at the same time, so its entire mass is rejected. Empty regions have zero
mass and are skipped only after explicit recomputation. Because each time has
at most one bad digit per coordinate, split literals have distinct coordinates.
The child regions and final-none region are disjoint and exhaust the parent.
All nonempty child subtrees are mandatory; omit one and mass/reachability fails.

This argument permits any deterministic choice of split clause, provided
the full actual options/exclusions and every child are validated. It does
not permit the old minimal-cover/private-member pruning: terminal is a
decision problem on fixed labelled coordinates, not minimal-cover generation.

## Sound covering-gain leaves

Let U contain all currently unsatisfied clauses/times. For each coordinate
and available digit, let B(i,a) be the subset of U covered by that digit.
If the union of every available B(i,a) misses a member of U, no completion
can cover all U. Likewise any completion covers at most
sum_i max_{a in D_i}|B(i,a)| members of U, since it chooses only one digit
per coordinate; overlaps can only reduce the actual union. A sum below|U|
therefore rejects the entire current region. The independent verifier derives
U, domains, masks and bound afresh, never trusts a supplied gain total.

## Sound gcd leaves and SAT refusal

The properness alternative is gcd(14,all speeds except some i)>1. An admitted
F2 ancestor is improper, so at least two coordinates are odd. Every level14
choice preserves parity, eliminating the omitted-gcd factor2 alternative.
Thus this fiber is gcd-proper exactly when at least12 coordinates are divisible
by7. Each coordinate has exactly one such digit because166 is a unit modulo7.
If at least12 domains contain ONLY that divisible digit, every completion is
gcd-proper whatever the remaining coordinate. The verifier tests these twelve
divisibilities directly; optional enumeration of the small remaining free
domain also checks the original omitted-coordinate gcd predicate.

If every clause is satisfied without a proved gcd leaf, enumerate EVERY
remaining completion and directly check the original grid/gcd definitions.
One improper tuple is a counterexample to this terminal claim. A successful
certificate has no unaccounted or improper SAT completion. Caps/deadline/
parse failures never stand in for an empty result.

## Complete tree evidence, weighted mass and eventual bridge

Retain every force, split, conflict/gain/gcd/SAT node for every live ancestor,
with exact ordered root bindings and complete preorder. The semantic verifier
reconstructs domains and every partition, consumes all bytes/children once,
and verifies grid-certified + gcd-certified masses equal7^13 at EACH root.
These are disjoint certificate regions, not a claim that grid and gcd predicates
are globally exclusive. Aggregate mass/hash alone does not certify the tree.
Independent masks/clauses/arithmetic and full output comparison are required.

Planning-only full SCAN:607854 calls,668179 forces, approximately18.829s,
RSS138805248B for both roots. Observed masses are96889010402+5 and
96889010401+6. Actual compact forest must be retained and independently replayed
before any admission; estimates/logs alone are not evidence acceptance.

Only after whole cascade and whole terminal acceptance apply the common-level
224 argument in LRC_P83_CASCADE_TERMINAL_BRIDGE_2026-10-03.md. Levels14/32
are not comparable. A hypothetical improper224 lift reduces to an improper32
lift, hence one of ALL retained live F2 ancestors; its14 reduction is proper
by this WHOLE terminal certificate, contradicting monotonicity back to224.
CRT lifts every base-unit orbit action to a unit at83*224. This closes one
finite p83 eventual-properness obligation, not other60 primes/globalLRC/novelty.

Passive UI is retained unsigned local integrity, never a fresh mathematical
replay. Formal/external proof and global application gates stay distinct.
[Allikvere2609.02604v2 §§2,4.2–4.3](https://arxiv.org/html/2609.02604v2) gives
the lifting/properness context; the complete domain/partition/gain certificate
above must pass its own independent implementation and review.
