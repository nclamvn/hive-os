# TIP098 working mathematics — not a global certificate

Owner question: is C_T(5)=14/61? Start 07:52:51UTC, stop08:37:51UTC.
Source-aware Main, not a blind solving arm. Known coordinates and source checker
description were read before this work. No causal method advantage follows.

## 1. Compact reduction (Main derivation)

For general n, the horizontal projection of T_j(x_j) is
J_j=[x_j,x_j+j/n]. Separate the union of these intervals into connected components.
Triangles belonging to different projection components have disjoint interiors,
so their union areas add. Translate whole components horizontally, preserving
all internal offsets, until their projection intervals abut. The component union
areas stay unchanged; any overlaps after translation can only reduce total area.
The resulting horizontal projection is connected and has length at most
sum_j |J_j|=(n+1)/2. Subtract the new x_n from every offset. Since every x_j is
a point of this connected projection, |x_j-x_n| <= (n+1)/2.

Consequently the infimum over all real offsets equals the infimum on
[-(n+1)/2,(n+1)/2]^(n-1), with x_n=0. Area is continuous in the offsets: horizontal
slice interval endpoints move continuously, and their union lengths converge and
are bounded by n*(1-y)/n=1-y; dominated convergence applies. The compact-domain
infimum is therefore attained. For n=5, [-3,3]^4 suffices.

This argument does not restrict the search to rational coordinates, sorted offsets,
reflection symmetry, a grid, or local stationary points. It supplies no 14/61
lower bound. It may be standard; no novelty claim.

## 2. Exact area and the known triple contact

At height y, intervals are [x_j+j*y/n,x_j+1/n+(j-1)*y/n].
Endpoint order changes only at finitely many crossing heights. On each resulting
height slab, interval-union length is affine in y. Integrating exactly is sufficient
to certify a proposed rational configuration, not a global minimum.

Known witness: x=(79/305,47/305,10/61,12/305,0).
Its extra triple contact is at y=32/61:
R_1=R_2=L_4, where R_j=x_j+1/5+(j-1)*y/5, L_j=x_j+j*y/5.
Eliminating y gives x_4=-3*x_1+4*x_2+1/5. This is a contact hyperplane, not proof
that all minimizers satisfy it. Equal L_i/L_j and R_i/R_j crossing heights are
structural identities for equal-width slices and must not be mistaken for
independent active constraints.

Planned investigation: inspect the exact local area quadratics adjacent to this
contact, and bounded finite candidates. A local minimum, even certified, leaves
other cells and all boundary configurations unresolved.

## 3. Source / status observations

- https://arxiv.org/html/2608.23691v2 (14 September 2026), section6.4: source leaves
  unrestricted n=5 optimum unresolved; supplies 14/61 asymmetric witness and 7/30
  reflection-fixed optimum. Not independently reproduced universal source proofs.
- https://dualverse.ai/station/math/discretized-kakeya-needle/ : exact event-sweep
  algorithm and published finite outputs, not yet executed by Main here.
- Targeted web searches for Kakeya+14/61 and C_T(5) found the same open-problem
  description and source. This is not an exhaustive novelty/status guarantee.
- Existing source full-space n=4 enumeration reports9350 cells/4675 reflection
  representatives. It is not evidence that n=5 full-space closure is affordable.

No new n, no reused historical Kakeya maximal gap, no silent fallback success.

## 4. Exact adjacent-cell certificate (Main argument; replay passed08:03:31UTC)

Write z=(x_1,x_2,x_3,x_4), z*=(79/305,47/305,50/305,12/305),
q=z-z*, and ell(q)=3q_1-4q_2+q_4. Endpoint-height event affines and their boundary
or equality walls give184 distinct nonconstant canonical hyperplanes. At z* only
one vanishes: (15,-20,0,5,-1). Every other wall stays on its z* side throughout
the open infinity-norm ball ||q||_infinity<3/1525. The same signs define a larger
convex open domain; dividing it at ell=0 gives the two adjacent event cells.

Within each event cell, the union area is a quadratic: event heights are affine
in z, union-length endpoint laws are affine in (z,y), and exact integration between
affine event heights has degree<=2. This fact is an analytic premise proved by
the slice construction, not inferred from random samples.

A four-variable polynomial of degree<=2 has15 coefficients. At either center
z* +/- (0,0,0,1/100000), take the15 unisolvent points: center, four coordinate
plus steps, four coordinate minus steps, and six distinct pair-plus steps;
step=1/10000000. All points lie in the corresponding same event cell. Rational
area evaluation then determines the quadratic exactly, rather than merely
testing it at15 points. The independent checker must verify all wall signs and
both rational area calculations at these points before acceptance.

The replayed exact polynomials have constant14/61 and gradient0 at z*:

    A(z)=14/61 + (1/2) q^T H_- q, ell(q)<=0;
    A(z)=14/61 + (1/2) q^T H_+ q, ell(q)>=0.

    H_- = [[5, -5/2, -5/2, 0],
           [-5/2, 10/3, 0, -5/6],
           [-5/2, 0, 65/6, -15/2],
           [0, -5/6, -15/2, 40/3]];

    H_+ = [[35/4, -15/2, -5/2, 5/4],
           [-15/2, 10, 0, -5/2],
           [-5/2, 0, 65/6, -15/2],
           [5/4, -5/2, -15/2, 55/4]].

Their leading principal minors are respectively
(5,125/12,6625/72,38125/72) and
(35/4,125/4,6625/24,38125/24), all positive. Sylvester's criterion makes both
positive definite. H_+-H_-=(5/12)*(3,-4,0,1)^T*(3,-4,0,1), so the formulas
agree on the dividing wall; continuity covers cell boundaries. The specified
exact replay passed, so z* is therefore the unique minimum on these two adjacent
cell closures and a strict local minimum on the stated neighborhood.

This does NOT show that every possible configuration belongs to these cells.
It closes no all-space lower bound and is not a new global Kakeya result. Its
research-routing value is to rule out all sufficiently small perturbations of
the published witness, not just the tested coordinate directions. No priority or
novelty claim is made for this local calculation.

## 5. Coarser geometric arrangement — Main reduction, not full-space execution

It is unnecessary to compare the heights of EVERY pair of unrelated crossing
events. Two intersections at different horizontal locations can exchange their
heights without changing the line arrangement or the polygon union boundary.
Use instead the ten slanted boundary laws b_i(z)+s_i*y, clipped to0<=y<=1.
Include the following nonconstant parameter hyperplanes:

1. b_i-b_j=0 and b_i+s_i-b_j-s_j=0 (intersection on bottom/top; also captures
   equality of parallel boundary lines).
2. (s_j-s_i)*(b_k-b_i)-(s_k-s_i)*(b_j-b_i)=0 for every triple (concurrence).

Discard identically zero or constant nonzero equations; normalize and deduplicate.
The exact Main diagnostic found78 hyperplanes, all a subset of the184 sweep-order
walls. This count is retained in MAIN_FINAL_VERIFICATION.json; no coarse-cell
enumeration or global minimization was performed.

Why these walls suffice: on a connected component of their complement, the order
of intersections along every slanted boundary line is unchanged. It can change
only if two intersection points collide (a triple concurrence), a point reaches
y=0 or1, or parallel lines coincide. The same holds for endpoint order along the
bottom and top. Structural coincidences, e.g. the two edges of one triangle meeting
at its apex at y=1, are fixed identities; a new line reaching such a vertex is
already covered by the listed top equations. The strip line arrangement is
therefore combinatorially constant on each component. Each triangle is specified
by its fixed two boundary labels and bottom edge, so the selected union boundary
is constant as a labeled edge/vertex sequence.

Every relevant boundary vertex is affine in z: fixed unequal slopes give a
constant nonzero denominator when two slanted lines intersect; intersections
with y=0 or1 are also affine. The shoelace area formula, including oriented hole
boundaries if present, is therefore a rational quadratic on each coarse cell.
Continuity covers its closure. Hence full-space certification may work on this
coarser arrangement without losing configurations. This is a written geometric
reduction, NOT a tested claim that every coarse cell was minimized. A full proof
still needs coverage, all faces and singular stationary sets; nonconvex quadratics
must not be discarded merely because an unconstrained stationary value is large.

The general-position upper bound for184 hyperplanes in four dimensions is
47,256,031 cells; for78 it is1,505,583. Neither is an actual cell count or a runtime
estimate. This reduction gives a more concrete proof route, but cannot by itself
justify a claim of affordable complete enumeration, novelty or HIVE superiority.

## 6. Finite search result and stop

Coordinate pattern search seed98001:200 starts,7708iterations,61864 objective
evaluations,1.2534seconds; best is the known witness. DE/rand/1/bin seed98002:
50population,10000generations,500050evaluations,28.1089seconds; numerical best
looks slightly smaller only at floating-point rounding scale. Its rationalized
offsets (79/305,154064/999777,10/61,12/305,0) have exact area
14/61 + 1/55790109285624135, strictly WORSE. Both exact algorithms agree.

The exact rejection concerns the rationalized submitted candidate. The float
decimal coordinates were not separately promoted to an exact binary-rational
certificate. No record or counterexample is claimed. Negative searches do not
prove optimality. No additional search is justified just by this roundoff effect.
