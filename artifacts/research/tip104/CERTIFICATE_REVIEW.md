# TIP104 R2 — independent certificate/source challenge

Initial finding recorded 2026-10-11 00:50 UTC. Supplementary fresh-context AI
review, not a human referee, formal proof, model-family independence or novelty
assessment. Scope: the retained TIP100/101/103 finite arithmetic dependencies
and their analytic trust boundary. No mathematical process, test, compile,
regeneration or search was invoked by this reviewer. Main's replays are separate.

## Initial findings (preserved)

No blocking defect identified by source inspection. In particular:

- The exact inner-hull volume argument does cover closed faces, not merely
  almost every shape. Actual supporting facets are reconstructed from all
  noncollinear vertex triples, and each facet is independently convex-hulled in
  an injective planar projection. The centroid is interior to a positive-volume
  hull; absolute tetrahedral volumes give its volume without a producer
  orientation assumption. Distinct sign words give disjoint three-dimensional
  interiors. A finite union of closed inner hulls of volume equal to the simplex
  cannot leave a nonempty relative-open complement: any such complement meets
  the simplex interior and has positive volume. This includes lower-dimensional
  faces. The source itself checks positive volume, signs and total volume; its
  reported successful arithmetic still requires Main's actual replay.
- Supplied stationary nullspaces are checked for both containment in ker(H) and
  exact rank 4-rank(H). This is a full basis check, not a list-length test.
  Particular solutions and values are independently recomputed. Singular
  below-target infeasibility is independently established by a constraint
  invariant on the whole stationary affine set; it does not rely on sampling a
  particular solution or trusting the producer feasibility status.
- The producer's generic stationary-feasibility helper need not be accepted as
  a universal unbounded-polyhedron feasibility theorem. For the actual accepted
  singular below-target records, the independent invariant-row contradictions
  remove that trust dependency. The retained erratum distinguishes 80 closed
  negative constants (-2) from 14 strict zero constants (0); both are valid.
- Cartesian bottom-pair inventory is explicitly reconstructed for each shape
  cell from its envelope chains, and duplicate/missing pairs are refused.
  Omitting a>=b is valid only with the separate minimum-order theorem; this
  review does not replace that theorem with inventory counts.

## Coarse polynomial versus a generic fine integration chamber

The checkers integrate at a rational perturbation into a finer event-height
chamber. Successful equality of coefficients there is not by itself proof that
the polynomial holds on the entire coarse cell. I checked the required geometric
argument rather than assuming it from the replay:

1. In the (horizontal-coordinate,t) plane the union is a union of five clipped
   wedges between fixed-slope endpoint lines, 0<=t<=A5. A boundary vertex is
   an apex, an endpoint-line intersection, or an endpoint at the top clipping
   line. Each is affine in A because slope differences are fixed nonzero
   integers and the clipping height A5 is itself linear in A.
2. Boundary segment incidence and the order of intersection vertices along a
   shared endpoint line can change only at a three-line concurrence, a parallel
   coincidence, or a clipping collision. An exchange in height between
   unrelated crossings does not change their incidence or their order along a
   shared line. It therefore does not change the oriented polygon-boundary
   shoelace law. This is why the fine event-height walls need not all be shape
   walls.
3. At t=0, distinct apices are strictly ordered. At t=A5, a non-extreme positive
   apex difference is strictly below A5 and cannot equal a nonzero integer slope
   difference times A5. For the exceptional extreme pair (1,5), the difference
   equals A5 but endpoint slope differences have magnitudes 3,4,5, not 1.
   Structural own-apex meetings are fixed. Adjacent parallel coincidence requires
   equal apices, excluded in strict K5. This uses correction C1.
4. Thus the fixed coarse sign chamber has a fixed polygon-boundary description,
   giving a homogeneous quadratic cone integral by shoelace. Coefficients
   derived symbolically on one open fine chamber are the same quadratic on the
   whole coarse chamber. Continuity extends values to its closure. This is an
   analytic argument, not a finite interpolation test.

Normalization is not a restriction to the center's scale or a fixed witness
ray. Every strictly ordered apex vector has positive A5 and normalized shape
(A2/A5,A3/A5,A4/A5) in the open simplex. Rescaling both the horizontal coordinate
and t by A5 multiplies the cone area by A5^2, so the normalized symbolic law
lifts to the entire positive cone over that chamber. The subsequent bottom
phase introduces the constant t=1 through UNIT; its feasibility rows allow all
strict K5 scales, not only A5=1. When A5<=1 strict ordering forces bottom labels
(1,5), whose terminal tails are empty. For A5>1, fixed bottom labels and the
shape's envelope chains give the exact tail polynomial from t=1 onward. Thus
the all-scale area law is not inferred from agreement at one normalized point.

`independent_generic` correctly keeps A5=1, avoids zero fine rows using a
quadratic-in-k direction family, and limits epsilon by every initially nonzero
row. A nonzero row with no first-three-coordinate part is constant on this
normalized section and cannot acquire a new event tie. The symbolic endpoint
count integration counts occupied elementary intervals once regardless of
overlap multiplicity. Its interval integration and subtraction of 3*A5^2/2
match the definition of cone energy. Tail integration follows every remaining
upper/lower envelope switch; it is not a tail-free relaxation. The a=1,b=5
terminal-chain case also gives zero tails when A5<=1.

Full-gradient use at a face still needs C1 and an incident *open* phase.
Clarification C2 supplies that route: choose a full-dimensional incident shape
chamber, approach through strict K5 while avoiding bottom ties, then retain a
constant-label subsequence. The limiting labels are extrema at the minimum and
their a<b ordering puts the phase in the Cartesian inventory. This does not
assume that every wall-only label appears in every adjacent chain. No contrary
coarse/fine mismatch was found.

## TIP100 finite outside-bound dependency

I inspected `triple_bounds.py` and the supporting structure of
`ALL_60_CERTIFICATES.json`, including its point/segment/polygon records. This is
source and proof inspection, not a fresh scan of all numeric certificate rows.

- For canonical coordinates a=sign(k-i)*5(xk-xi),
  b=sign(k-j)*5(xk-xj), si*a-sj*b=5(xj-xi). Consequently the producer's two
  halfspaces are exactly the two closed disjointness branches, including
  tangency.
- Pair overlap vanishes outside [-r,1]; otherwise its left/middle/right formulas
  cover the whole support, including branch endpoints. If either overlap
  vanishes, the separate single-overlap bound max(1/(ra+2),1/(rb+2)) is valid.
  All both-positive points are in the Cartesian product of formula ranges.
- `clip` keeps points on equality and computes every strict edge crossing.
  Convex hulling of kept vertices and crossings gives the exact halfspace
  intersection; point and segment degeneracies are retained. The rational
  monotone hull returns a consistent CCW polygon used by feasibility checks.
- A compact clipped polygon has a quadratic maximum on the relative interior
  of a minimal face. Vertices, all restricted edge stationary points (or
  constant edges), and the feasible full-gradient stationary affine set cover
  those possibilities without assuming concavity. The edge derivative formula
  is exact. Linear nonconstant edges need only endpoints.
- These quadratics are separable. `stationary` intersects the polygon with
  x=-lx/(2qx) and/or y=-ly/(2qy), using opposite closed halfspaces. A zero
  quadratic coefficient with nonzero linear coefficient refuses full
  stationarity; both zero leave the coordinate free. A nonempty clipped
  stationary section has constant quadratic value, so its vertex centroid is
  an adequate representative of the whole set. Singular/constant directions
  are not silently omitted.
- The 60-record generation inventory is all 10 pairs, all three remaining
  third labels, and both disjointness branches. Taking the strongest third
  label is valid since each is a lower bound for the same original union.

The analytic central-pair cap inequality and nonadjacent-pair theorem remain
R1 dependencies; this finite audit does not establish them by itself.

## TIP103 equality and stability dependency

The new scan independently eliminates each distinct retained quadratic, includes
all 8658 cases (including inconsistent cases in the incident scan), and tests
the full equality affine locus before treating any rank-four point as feasible.
The saved final output contains 68 equality records of rank four, 64 rejected
and four feasible, deduplicated to two gauge offsets. These numeric counts are
retained data inspected here, not new arithmetic execution by this reviewer.

At the displayed points m-=(29,93,116,165)/61 and
m+=(49,72,136,165)/61, the bottom-extremum labels are uniquely (1,5).
For m- the bottom left-endpoint values are (-61,-93,-90,-128,-140)/61;
for m+ they are (-61,-73,-111,-108,-140)/61. Thus the local neighborhoods do
not require arbitrary nearby nonminimal a>=b phases to be included: preserving
all nonzero bottom comparisons keeps the same two extrema.

The radius rows include all shape walls, simplex boundaries, strict K5 rows,
and bottom comparisons. For g=b.u+d, a displacement q obeys
|g(u+q)-g(u)|<=||b||1*||q||infinity. Half the minimum nonzero margin fixes
every nonzero sign; zero walls are intentionally allowed. Every nearby open
phase then has the minimizer in its closure: along the segment to the minimizer
all fixed signs remain valid and the zero-at-minimizer signs tend to zero.
Complete shape coverage plus the unchanged unique bottom labels makes the
closed-feasibility incident scan exhaustive. It is not a radius justified by
finite sampling.

All four saved incident Hessians are symmetric and are separately checked in
the source by exact leading minors of H-epsilon*I. Sylvester's criterion gives
the stated lower Hessian bound; because value and full gradient agree at the
minimum, Taylor's quadratic identity gives the 1/64 gap coefficient. Reflection
is correctly not treated as a Euclidean isometry; both points are checked
directly. The Euclidean balls used globally fit inside the infinity-norm balls.

The global capped bound follows from a compact away-from-minimizers set, full
equality classification, continuity and the outside-pair gap. Its constant is
existential because eta has not been computed; the report explicitly says so.
The cap min(distance^2,1) is necessary because area is bounded while offsets can
diverge. No global numerical constant or formal proof follows from this audit.

## Source-only disposition

R2 source/proof challenge: NO_BLOCKING_DEFECT_FOUND within the materials above.
No targeted diagnostic is proposed because no specific unresolved necessary
premise was identified that a bounded computation could address. Main must
still report actual saved-cover/full-acceptance replay outcomes separately.
Whole-theorem acceptance remains dependent on R1's analytic outside bound,
regularity and stationary completeness audit. Qualified AI review does not
close external mathematical review, novelty or formal verification.

No predecessor file was changed. Only this create-only review document was
added; no scratch directory, build output, dependency or generated binary was
created, and nothing was deleted.
