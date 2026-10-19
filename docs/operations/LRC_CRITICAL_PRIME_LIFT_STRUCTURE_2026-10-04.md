# Critical finite-grid obstructions under a prime lift

Status: mathematical specification awaiting implementation/admission. This
explains a structured subset of the admitted p83 fiber; it does NOT replace
the whole057–059 certificates or settle other primes/global LRC.

## Conditional statement

Let n>=3, N=n+1, M>=2, q prime and gcd(q,M)=1. For a labelled tuple u modulo
M, assume (A) no integer grid time t/M is good for every coordinate at threshold
1/N, and (B) deleting ANY one coordinate admits such a grid witness at that
SAME threshold. Repeats remain labelled. These are finite premises, not an
assumption that lower LRC is true. Equality is good throughout.

Consider ALL q^n labelled lifts v_i=u_i+M*a_i, 0<=a_i<q, modulo Q=qM. Let C_q
be the subset with q dividing every coordinate except possibly one. Then:

1. |C_q|=1+n(q-1).
2. Exactly ONE member of C_q has no full-grid witness modulo Q: the tuple with
   every coordinate divisible by q.
3. Every one-exception member has a constructive full-grid witness using at
   most q phase choices from its deleted-coordinate witness.

This classifies C_q ONLY. It does NOT assert that every OTHER lift is good or
that C_q exhausts every omitted-gcd alternative when the level has other factors.

## Proof: entire subset and the exceptional member

For each coordinate gcd(M,q)=1 gives exactly one digit d_i such that
w_i=u_i+M*d_i is divisible by q. Let w be the all-divisible lift. C_q consists
of w plus, for each coordinate e, the q-1 replacements of its divisible digit.
These replacements have exactly one nondivisible coordinate, so their labelled
classes are disjoint. This proves both completeness and the count, without
enumerating q^n assignments.

Write w=qz. Modulo M, z_i=q^{-1}u_i. Since q^{-1} is a unit, multiplication of
all grid times by it permutes the M residues. Thus distances t*w_i/Q equal
t*z_i/M; assumption(A) implies w has no grid witness. Do not confuse this
finite obstruction with a continuous-time counterexample.

## Proof: constructive one-exception witness

Fix a lift whose only nondivisible coordinate is e. For i!=e its entries are
w_i=qz_i. Let s be a deleted-coordinate witness in assumption(B), and let
j0=(q*s) mod M. For h=0,...,q-1 put j=j0+M*h (0<=j<Q).
For i!=e,

    j*v_i/Q = j*z_i/M = s*u_i/M modulo1,

so every nonexceptional coordinate stays good for ALL q phases. The exceptional
coordinate moves by v_e/q each phase. Since q is prime and q does not divide
v_e, these phases are precisely a q-point equally spaced grid. The bad set is
an OPEN arc of length2/N<=1/2. Such an arc cannot contain the whole q-grid:
its shortest containing closed arc has length1-1/q>=1/2, and equality cannot
be covered by the open arc. At least one h gives distance>=1/N for e, hence
for every coordinate. Endpoint equality MUST be admitted.

All arguments apply uniformly for admissible M,n,q; bounded exact-integer
implementation tests verify instances, not this universal proof by sampling.

## p83 application and what it does not prove

Use the ENTIRE two ancestors derived by058, M166,n13,q7,Q1162. Independently
check (A) and(B), not a source-selected example. Expected earliest folded
deletion witnesses:

    (1,...,13): [6,78,52,40,32,29,23,20,18,17,15,14,12]
    (1,...,11,13,24): [6,78,52,40,32,27,23,20,18,17,15,12,14]

Each C_7 has79 tuples:78 constructed GRID witnesses and1 NO_GRID tuple.
These ancestors each have at least two odd entries and lifts preserve parity,
so the omitted-gcd2 alternative is unavailable. Consequently C_7 is exactly
the full gcd-proper subset at level14 HERE, not in every prime-lift setting.
The5/6 gcd-certified regions in059 are algorithmic certificate subsets, each
containing1 grid-free member and4/5 grid-overlapping members. Do not relabel
79 as5/6 or those region counts as global gcd-only counts.

Potential reuse for15runners is conditional only: q3/q5 can use this lemma if
their own coprime modulus and every deletion witness are established. It does
not handle two or more exceptions; those require a different premise/argument.

## Source comparison / novelty

[Allikvere2609.02604v2 §2, Lemma2.2](https://arxiv.org/html/2609.02604v2)
uses a one-exception divisor shift derived from lower-LRC premises. Section4.4
Lemma4.6 treats multiple exceptions with a union bound. Our finite statement
uses already exhibited grid deletion witnesses instead of lower-case LRC,
and packages the exact C_q count and unique grid-free member. It is a
source-derived specialization/structural explanation, NOT claimed new research.
No exhaustive literature novelty search, academic review or formal proof.
Source accessed2026-10-04; no author executable run.

## Architectural boundary

Old lrcFiniteScope admits only modulus128/10000 Cartesian tuples, disjoint
axes and a10s tool lane. Fullp83 cannot be smuggled into that envelope or its
v4 review ledger. This work is an additive explicit local lemma certificate,
not a new autonomous worker lane, provider field or schema. Human approval
is required for that separate first-class campaign-evidence architecture.
