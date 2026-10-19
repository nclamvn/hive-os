# TIP104 R1 — independent analytic challenge

Verdict: **NO_BLOCKING_DEFECT_FOUND in the analytic reduction reviewed here**.
This is a supplementary fresh-context AI review, not an external human referee,
formal proof, novelty assessment, or independent model-family experiment. The
finite cover/stationary/equality arithmetic is a separate dependency being
reviewed in TIP104; its numerical totals are not my reason for accepting the
analytic arguments. No mathematical process, random search, web request, paid
API, compilation, application change, or predecessor edit was executed by this
reviewer. This file is my first finding record; no earlier blocking finding is
being replaced or suppressed.

## Materials and precise trust boundary

Read the repository instructions, commitment protocol, current TIP104 activation
and latest handoff, TIP104, the TIP100 structural report, TIP101 closure report,
the full external-review dossier including C1/C2 and the singular erratum, and
the TIP103 equality/stability report. Inspected actual `triple_bounds.py`,
`shape_walls.py`, `stationary.py`, `acceptance_check.py`, `coverage_check.py`,
`equality_analysis.py`, and the earlier targeted stability review.

The review below independently derives the four necessary adjacent-pair triple
bounds by hand, in addition to checking the geometric missing-edge, cap,
compactness, regularity, chamber, stationarity, and stability arguments. It does
not claim to have manually recomputed every saved cover facet or stationary
record. Certificate acceptance must come from the separate exact checks, not
from this document or a hash/count.

## 1. Pair formula and the nonadjacent exclusion

For slope gap r and scaled bottom separation D, direct horizontal slicing gives

    J_r(D) = integral_0^1 (1-y-|D+r*y|)_+ dy.

Its positive support is exactly (-r,1). The three polynomial branches in the
dossier agree at their endpoints. On the middle branch its unique maximum is
at D=-r/(r+2), with value 1/(r+2). The left branch is increasing up to -1;
the right branch is decreasing from 0. Thus J_r is unimodal, and its global
cap is exactly 1/(r+2), including the zero continuation. For r>1 it is also
C1 on the whole real line. For r=1 the left support endpoint D=-1 has a
derivative jump; no subsequent argument here assumes C1 at that endpoint.

For a missing nonadjacent edge i<j, choose i<k<j and p=k-i, q=j-k. Write
a=5(x_k-x_i), b=5(x_j-x_k). If a+b<=-(p+q), both overlaps cannot be positive:
positivity would require a>-p and b>-q. If a+b>=1 and both are positive,
0<a,b<1; putting u=1-a and v=1-b gives u,v>=0 and u+v<=1. Consequently

    J_p(a)+J_q(b)
    <= (u+v)^2/[2(min(p,q)+1)]
    <= 1/[min(p,q)+2].

If either overlap vanishes, the same final bound follows from the pair cap.
The first and last triangles are disjoint in area, so their triple intersection
is also zero. Inclusion-exclusion therefore gives triple union area >=7/30.
This covers both disjointness branches, tangencies, and arbitrary real offsets.

## 2. Independent hand verification of the adjacent triple bounds

Take third label k=5. For the outer pair (1,2), use r=4; for the central pair
(2,3), use r=3. Define

    a=5(x_5-x_i), b=5(x_5-x_j), j=i+1.

The overlap sum is S=J_r(a)+J_(r-1)(b). Bottom separation means a-b>=1;
apex inversion means a-b<=-1. Whenever one overlap is zero, S is bounded by
1/(r+1), which is below each maximum obtained below.

Suppose both overlaps are positive and a maximizing point lies strictly inside
the relevant disjointness halfspace. C1 stationarity would force both coordinates
to be the unique individual maxima, whose difference is

    -r/(r+2) + (r-1)/(r+1) = -2/[(r+1)(r+2)].

That difference lies strictly between -1 and 1. Hence no such halfspace-interior
maximum exists. It suffices to maximize on a=b+1 or a=b-1. The compact positive
support rectangles and zero-overlap cases justify this reduction globally;
formula seams are C1 and cannot hide a separate nondifferentiable maximum.

Here are all the one-dimensional pieces on which both overlaps are positive.
Endpoint values are included by continuity. The displayed formulas are obtained
by substitution into the pair polynomials, not by reading certificate maxima.

### Outer pair, bottom-separated: r=4, a=b+1

Both-positive support: -3<b<0.

    -3<=b<=-2: S=(b+5)^2/60+(b+3)^2/24.
    -2<=b<=-1: S=1/8-b/4-13*b^2/120.
    -1<=b<= 0: S=1/8-b/4-13*b^2/120.

The first piece is convex, so its maximum is the larger endpoint value 23/120.
The other pieces have their joint maximum at b=-15/13, a=-2/13, where
S=7/26. This also exceeds the outside-support cap 1/5. Thus

    triple union >=3/10-(7/26)/5 =16/65.

### Outer pair, apex-inverted: r=4, a=b-1

Both-positive support: -3<b<1.

    -3<=b<=-1: S=7*(b+3)^2/120.
    -1<=b<= 0: S=11/40-3*b/20-23*b^2/120.
     0<=b<= 1: S=11/40-3*b/20-b^2/40.

The first piece is increasing with maximum 7/30, and the last is decreasing
with maximum 11/40. The middle piece has maximum 7/23 at b=-9/23,
a=-32/23. This exceeds 1/5, so

    triple union >=3/10-(7/23)/5 =11/46.

### Central pair, bottom-separated: r=3, a=b+1

Both-positive support: -2<b<0.

    -2<=b<=-1: S=(8-b^2)/24.
    -1<=b<= 0: S=1/6-b/3-5*b^2/24.

The first is increasing with maximum 7/24. The second has maximum 3/10
at b=-4/5, a=1/5. This exceeds the outside-support cap 1/4, giving

    triple union >=3/10-(3/10)/5 =6/25.

### Central pair, apex-inverted: r=3, a=b-1

Both-positive support: -2<b<1.

    -2<=b<=-1: S=5*(b+2)^2/24.
    -1<=b<= 0: S=1/3-b/6-7*b^2/24.
     0<=b<= 1: S=(8-4*b-b^2)/24.

The first and last pieces have maxima 5/24 and 1/3. The middle has maximum
5/14 at b=-2/7, a=-9/7. This exceeds 1/4, giving

    triple union >=3/10-(5/14)/5 =8/35.

The planar map (horizontal,y)->(y-horizontal,y) preserves area and, after
relabeling j->6-j, sends offsets to -x_j-1/5. Common regauging is harmless.
It supplies the remaining adjacent pairs. Only the central apex-inverted bound
8/35 is insufficient, exactly as the report says; the cap argument is essential.

## 3. Central top-cap inequality, including all delta>=0

In TIP100's scaled/sheared coordinates, the intervals are

    T2=[0,t], T3=[-delta-t,-delta],
    T4=[p-2t,p-t], T5=[q-3t,q-2t].

The triple235 overlap sum is S=J3(q-3)+J2(q-2+delta). For q<=0 its
union is >=1/4. For 0<=q<=3/2, S<=3/32+1/4 and the triple union is
>=37/160. For q>=2, monotonicity of J2 gives S<=J3(q-3)+J2(q-2);
on [2,3] this is 1/2-q^2/24<=1/3, on [3,4] it is <=1/8, and beyond
4 it vanishes. These ranges all give bounds >=17/74.

For 3/2<=q<=2, q-2>=-1/2 and J2 is decreasing from its maximum at -1/2.
Thus delta>=0 yields S<=q-1/2-7*q^2/24. Choose h=q/6. The cap projections
of T4, B=T2 union T3, and T5 are contained respectively in
[p-2h,p], [-delta-h,h], and [q-3h,q]. Positive-area overlap of T4's cap
with both B and T5 would require simultaneously p<3h and p>q-3h, hence
q<6h, impossible. At equality only zero-area touching can survive.

The T4/T5 overlap cap is <=h^2/3. For T4/B, rescaling the cap to height 1
gives the precise canonical arguments

    a=p/h-2, b=(p+delta)/h-1,
    a-b=-1-delta/h<=-1.

Thus the J2(a)+J1(b)<=3/7 lemma applies to the WHOLE delta>=0 range.
For -1<=b<=0 the boundary sum is v-7*v^2/12, v=b+1, with maximum 3/7;
for 0<=b<=1/2 it is 5/12-b/6-b^2/12<=5/12; for b>=1/2 the separate
caps give <=5/16. For b<=1/2, J2 increases up to -1/2 and the constraint
a<=b-1 permits replacing a by b-1. Zero-overlap cases are <=1/3.

At least h^2(1/2-3/7)=h^2/14 of T4's cap is therefore outside triple235.
Adding this and restoring the area factor 1/5 gives exactly

    area >=2/5-q/5+37*q^2/630
          =17/74+(37/630)*(q-63/37)^2.

Reflection supplies pair34. Combined with Sections1–2, this establishes the
all-real missing-edge bound >=17/74 independently of a mask count.

## 4. Compactness, continuity, and C1

After fixing x5=0, pair(j,5) gives -1/5<=x_j<=(5-j)/5. The closed
20-inequality overlap polytope is compact. Its boundary and every point outside
its strict interior have a zero-area pair, so area>=17/74 there. Union area is
continuous: translating an interval by delta changes its symmetric difference
length by at most 2|delta|, uniformly in t, and integration preserves this bound.
The known witness has smaller area 14/61, so compactness supplies a true global
minimizer strictly inside K5. No branch at infinity escapes this reduction.

In the translation-invariant apex gauge A1=0, strict K5 means
0<A_j-A_i<j-i+1. For fixed A, at almost every t in the fixed strip [0,1],
all ten endpoint values are distinct. Parallel endpoint lines from adjacent
labels could agree persistently only if their apices agreed, excluded by the
strict ordering. Own-triangle apex coincidences occur only at t=0.

At every remaining t, union length is locally affine in A. Coordinate difference
quotients have a uniform integrable bound from interval symmetric difference.
Dominated convergence gives every partial derivative. Along A_n->A, endpoint
orders converge for almost every t; the derivative coefficients are uniformly
bounded, so the same argument gives continuous partial derivatives. Hence area
is C1 on all strict K5, including internal walls and bottom ties. The global
minimum must have zero FULL four-variable gradient, not merely tangential gradient.

## 5. Why the shape walls and quadratic continuation suffice

The ten lines have fixed slopes and intercepts linear in A. A combinatorial
change in their clipped arrangement can only occur through a triple concurrence,
parallel coincidence, or a crossing passing a clipping boundary. At t=0,
distinct-label crossings are excluded by strict apex ordering. At t=A5, the
corrected C1 argument is indispensable: nonextreme apex differences lie in
(0,A5), so cannot equal a nonzero integer slope difference times A5. The
extreme pair has difference A5, but its endpoint slope differences have
magnitudes 3,4,5, never 1. Therefore there is no missing top-clipping wall.

More explicitly, the position of each pairwise intersection relative to every
third line is fixed by the relevant triple determinant sign. The intercept
ordering of parallel lines and the positions relative to clipping boundaries
are fixed as well. Thus intersection order ALONG each line and boundary-edge
incidence are constant in a chamber. Two unrelated crossings exchanging their
horizontal t-level do not change these incidences and are not extra shape walls.
Every relevant polygon vertex is affine in A (fixed slope denominators); shoelace
therefore gives a quadratic cone energy in A. This supplies the degree theorem
needed to extend a fine-subchamber integration polynomial to the entire coarse
chamber. Agreement at finitely many points would not have supplied that theorem.

The wall generator enumerates all triples and all parallel pairs. A linear
wall cuts the open ordered simplex exactly when its values on simplex vertices
have both signs; discarded noncutting walls cannot cross its strict interior.
The 42-wall inventory is thus logically sufficient, conditional on exact saved
coverage acceptance. The finite union of inner hulls is closed. Disjoint signword
interiors, containment in the simplex, and equality of actual volume to 1/6
force coverage of every simplex point: a nonempty relative-open complement
would meet its interior and have positive volume. This includes wall faces.

## 6. Tails, Cartesian inventory, bottom labels, and incident phases

For t>=A5 the union is connected with length 5t-A5. For strict K5 it is
already connected for t>=1: each ADJACENT apex gap is in (0,2), so its
left-endpoint difference at t is in (-t,t) for t>=1; adjacent intervals
overlap and link the full union. Arbitrary nonadjacent pairs need not overlap
at t=1. The upper and
lower hull chains switch monotonically in label. Their combinatorics are governed
by a subset of the same triple walls. The integrals from 1 to A5 are therefore
exact quadratic tail corrections once the bottom labels are fixed. Their upper
and lower switch TIMES need not interleave in a fixed order; the two integrals
add independently. All Cartesian chain pairs are necessary. The actual code
retains them, rather than only pairs observed in one radial traversal.

For fixed strict shape v and scale s, write F_v(u)=integral_0^u L_v(r)dr.
The area is s^2 F_v(1/s)/5. Its radial derivative is
[2s F_v(1/s)-L_v(1/s)]/5, so stationarity gives area=half bottom width.
Immediately to the right in s, tied bottom maxima select the largest label and
tied minima the smallest label, because v_j increases strictly. If these selected
labels satisfy a>b, then d=v_a-v_b>0. The one-sided radial quadratic has
derivative (d+2Ks)/5; zero derivative forces K<0 and the right-hand second-order
change is negative, contradicting a minimum. If all bottom endpoints coincide,
the right-hand selections are a=5,b=1, so this case is likewise excluded.
Therefore EVERY maximizing label is smaller than EVERY minimizing label at a
global minimum, including ties. This justifies the a<b restriction.

At an internal wall, choose an approaching sequence through an incident open
shape chamber, strict K5, and no bottom ties. A subsequence has fixed bottom
labels a,b. Their limits are extrema at the minimum, so a<b. Shape-chain
combinatorics are fixed in that chamber, hence its Cartesian inventory contains
the pair. On the actual approaching open phase, the listed quadratic equals
area. C1 continuation then identifies its full gradient with the area gradient
at the limit. It is not sufficient merely to pick an arbitrary closed-cell label;
clarification C2 supplies exactly the necessary incident-open-phase selection.

Consequently, once all finite stationary systems and feasibility rows are
accepted, the universal contradiction argument is sound: a smaller minimum
would force a feasible below-target stationary case in that complete inventory.
Singular exclusions require annihilating the WHOLE nullspace. Both closed
negative-constant and strict zero-constant contradictions are valid; the retained
80/14 erratum must remain attached to any summary claiming otherwise.

## 7. Equality and quantitative stability

Conditional on the corrected lower-bound proof and complete equality scan, every
equality point is a global minimum and enters the same full-gradient inventory.
Rank-four equality systems give isolated points; checking all ranks first is
essential. The two gauge offsets and reflection orbit claimed by TIP103 are
consistent with the affine inverse x_j=(A_j-A5+5-j)/5 and the area-preserving
reflection. Reflection is not a Euclidean isometry on gauge parameters; direct
Hessian checks at both points, as used here, avoid transferring an invalid metric
constant.

For the local star, retaining the signs of every nonzero shape wall and bottom
comparison prevents entry into a nonincident chamber. Zero walls are allowed.
The complete cover argument also implies that each listed inner hull equals
the closure of its full sign chamber: interior points with that signword can
belong to no other hull, and the finite union covers them. Thus there is no
hidden truncation issue in using these sign constraints for local incidence.
The wall bound |g(m+q)-g(m)|<=||normal(g)||_1||q||_infinity justifies the
half-margin radii. Every nearby law is in the closed incident inventory; at the
minimum its full gradient is zero. Exact positivity of H-(1/32)I then gives
gap>=||q||_2^2/64 on both sides and their shared faces. Inconsistent stationary
systems cannot be genuine incident laws at a C1 minimum; including them in the
inspection is nevertheless the appropriate completeness check.

The offset norm conversion is sound: the inverse linear map has squared
Frobenius norm 7/25, so ||z-z*||_2^2<=7||u-m||_2^2/25; conversely
||u-m||_infinity<=10||z-z*||_infinity. These yield the stated conservative
25/448 offset coefficient and common radius 1/2440.

For the global capped bound, the common Euclidean radius r=1/244 lies inside
both proven infinity-norm balls. On compact P away from these balls, complete
equality classification and continuity give a strictly positive minimum gap
eta; outside P the uniform gap is 1/4514. Taking
c=min(1/64,eta,1/4514)>0 proves gap>=c*min(dist_2(u,M)^2,1).
The cap is necessary because union area is <=1/2 while offsets can be unbounded.
No numerical eta or global c is proved by this compactness argument.

The local exponent statement also checks out. Along any nonzero ray in an
incident open phase, the exact gap is a positive constant times t^2; for small
t the nearest minimizer is the ray's base point, so distance is proportional to
t. Dividing the gap by distance^p tends to zero for p<2. Thus no fixed positive
lower coefficient for a stronger local power p<2 can hold. The global capped
bound implies any almost-minimizing sequence approaches M; the local estimate
gives distance<=8*sqrt(area excess) only after local entry. No explicit global
epsilon threshold for that entry has been silently asserted.

## Final qualification

No concrete counterexample or unclosed necessary analytic lemma was found in
the reviewed chain. The four adjacent triple bounds have additional independent
written arithmetic above. The universal theorem still depends on correct exact
coverage/stationary/equality arithmetic and on accepting these analytic arguments;
supplementary AI review is not external mathematical acceptance. Human review,
Lean/formalization, novelty, and causal HIVE advantage remain unestablished.

New output: this analysis file only. No predecessor changed and no temporary
project, distDir, Docker image, or binary was created; nothing was deleted.

Writing correction record: an initial draft of this new review overgeneralized
J_r's C1 property to r=1 at D=-1 and said all pairs overlap at t=1. Those were
reviewer-draft errors, not defects found in the predecessor proof. The correct
facts are the r>1 regularity needed in the hand-max argument and adjacent-pair
bottom connectivity used above. Neither error is being represented as a source
counterexample or hidden blocking finding.
