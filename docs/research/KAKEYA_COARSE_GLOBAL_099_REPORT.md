# TIP099 — Reduced-arrangement global lower-bound attempt

STATUS: TERMINAL PARTIAL; original root C_T(5)=14/61 UNRESOLVED.
Owner specifically continues the all-space proof, including regions and boundaries,
without new random search. Start2026-10-10 08:08:22UTC; hardstop09:08:22UTC.
Predecessor098 local result/partial root remains unchanged.

## Exact mathematical obligations

1. Cover[-3,3]^4 with closures of every coarse78-wall chamber intersecting the cube.
2. Determine the exact area quadratic on each chamber.
3. Prove each quadratic>=14/61 on its entire closed polytope, including all faces
   and singular stationary sets, or provide an independently checked smaller witness.

Missing ANY of these means no all-space proof. The098 compact reduction and known
attaining witness connect this finite compact-domain certificate to all real offsets.
No new mathematical target or finite random experiment is substituted.

## Main's coverage argument

Start the full compact cube as the convex hull of its16 vertices. Inserting a
nonconstant affine wall divides every crossed polytope into its intersections with
the two CLOSED halfspaces. Their union is the parent; wholly one-sided parents
remain unchanged. If a wall only supports a boundary, its lower-dimensional part
is already in the closure of the retained full-dimensional cell. Thus induction
on all78 walls gives a complete cover including walls, not only generic points.

For a full-dimensional bounded4-polytope, a face is the intersection of its active
supporting hyperplanes. Distinct vertices form an edge iff their shared active
normals have rank3. Rank3 gives a one-dimensional face containing both vertices;
vertices cannot lie inside an edge, so they are its endpoints. Rank<=2 gives a
face of dimension>=2. Rank4 would force the same point. Counting common active
bits is insufficient at degenerate vertices; rank must be exact. Only constraints
actually inserted into the parent may be used; a future wall is NOT a parent facet.

Clipping retains admitted old vertices and adds intersections of crossed edges
with the new wall. This is the standard vertex description of a clipped convex
polytope: a new vertex not already old has its minimal parent face reduced by
one independent equation and therefore lies on a parent edge. Three independent
shared constraints and the new wall give exact Cramer coordinates; a zero
determinant on an actually crossed edge is a refusal, not a reason to skip it.
Duplicate coordinates merge, while on-wall vertices survive in both child closures.

Coverage validation must establish all these invariants for the actual generated
data. A progress count or output digest does not establish the cover by itself.
The native enumerator uses checked exact integer arithmetic, not floating hulls.
An incomplete plane prefix covers the cube geometrically but does NOT give final
quadratics/minima, so cannot close the proof.

## Main's area-polynomial argument

The coarse walls preserve the clipped line arrangement, hence the labeled union
boundary. Boundary vertices are affine in offsets because their slopes are fixed.
The oriented shoelace formula proves that area is rational quadratic on a coarse
chamber. Structural fixed coincidences of a triangle's own apex do not create an
extra parameter wall; new boundary lines meeting such an apex are included by
top-height equalities. Continuity extends the polynomial to the cell closure.

An implementation can either determine its15 coefficients from15 unisolvent exact
area values strictly inside that chamber, or symbolically integrate a generic fine
sweep lying in it. For the latter, each slab has affine height laws h0(z),h1(z)
and union-length law b(z)+s*y, with b affine and s constant. Its exact contribution
is b(z)*(h1-h0)+(s/2)*(h1^2-h0^2). Summing gives a quadratic on an open fine cell.
Because the area is already known quadratic on the containing coarse chamber,
polynomial uniqueness extends that expression to the whole coarse chamber.

Avoid nonstructural fine walls at the sample: a barycenter can lie on irrelevant
fine-event coincidences even though it is strictly inside a coarse chamber. Equal
height laws that are identical as affine functions may be deduplicated; equal
sample values of DISTINCT laws may not be silently deduplicated. Exact comparison
with both098 area paths is an engineering check, not the degree proof itself.

## Main's all-face minimization argument

For a nonempty bounded cell P and its quadratic Q, a minimum exists. Choose the
unique minimal face F whose relative interior contains a minimizer. In an affine
coordinate basis of F, write Q(t)=c+g.t+(1/2)t^T Ht. At an interior minimum,
Ht=-g and H is positive semidefinite (derivatives in both directions are allowed).
If H is indefinite, an interior minimum is impossible; all proper boundary faces
still need evaluation. If the stationary system is inconsistent, the same is true.

If H is PSD and t0 solves Ht0=-g, then

    Q(t)=Q(t0)+(1/2)(t-t0)^T H(t-t0) >= Q(t0)

on the entire affine space. Thus Q(t0)>=14/61 legitimately certifies the whole
face even if t0 is outside it. Conversely, Q(t0)<14/61 is NOT a counterexample
unless the stationary affine space intersects F's polytope closure. The singular
solutions t0+ker(H) require exact feasibility, not a nonsingular-only shortcut.

This feasibility problem is finite: restrict all face inequalities to the kernel
coordinates. The feasible set is bounded because the coordinate map is injective
and F is bounded. A nonempty bounded polytope has a vertex, including when it is
lower-dimensional; at such a vertex enough independent active inequality normals
span the kernel dimension. Enumerating those small binding systems and checking
ALL inequalities exactly therefore decides feasibility. Any cap/timeout remains
UNKNOWN, never infeasible.

Enumerate every face by intersecting existing faces with supporting facet equations,
deduplicate by exact vertex sets, and check dimension by exact rank. Zero-dimensional
faces are direct rational values. Every possible minimizing face is then accounted
for. Common-face results may be cached across neighboring cells because the global
area is continuous and their restrictions agree on that affine face; a cache key
must identify the actual geometric face, not a hash of unrelated coefficient text.

## Main's analytic retirement bound (08:19UTC)

This retires a region only after an all-point bound; it does not remove it from
the cover or replace the original target. Every triangle has area1/10. For j<k,
write r=k-j and D=5(x_k-x_j). Their exact intersection area is

    I_r(D)=(1/5) integral_0^1 (1-y-|D+r*y|)_+ dy.

Positive-area intersection is possible exactly when -r<D<1. Consequently a
polytope's vertex minimum D>=1, or vertex maximum D<=-r, proves the pair disjoint
up to measure-zero boundary on the ENTIRE polytope.

Put J_r=5I_r. It vanishes outside[-r,1]. For r>1 its pieces are

    [-r,-1]: (D+r)^2/[r(r^2-1)],
    [-1,0]: D+(r+1)/2 - (r+2)(D+r)^2/[2r(r+1)],
    [0,1]: -D+(1-r)/2 + (D+r)^2/[2(r+1)].

These follow by integrating (d+w)_+-2d_++(d-w)_+, with d=D+r*y
and w=1-y. The first piece is increasing. The middle is concave, with maximum
1/(r+2) at D=-r/(r+2). The last is decreasing, with maximum1/[2(r+1)]
at0. For r=1 the first interval is a singleton (omit its undefined formula),
while the other two remain valid. Hence for ALL offsets

    I_r(D)<=M_jk=1/[5(r+2)].

Construct a conservative possible-intersection graph G for a polytope P using
the exact vertex test above; false possible edges only weaken the bound. Distinct
components S are pairwise disjoint in area for every point of P. For
f_S=sum_{j in S}1_{T_j}, F=integral f_S=|S|/10 and

    integral f_S^2 <= Q_S=F+2 sum_{edges within S} M_jk.

Cauchy-Schwarz yields |union_{j in S}T_j|>=F^2/Q_S. Thus the entire P has
lower bound L(G)=sum_S F^2/Q_S. The1024 possible labeled graphs have exact rational
table entries. A retirement requires61*numerator>=14*denominator. A retired cell
retains its prefix signs, vertices, graph and bound as a terminal cover member;
only unresolved active cells are split by subsequent walls. Union preservation
therefore remains valid, including all boundary points, without generating
irrelevant descendants of an already certified region. Total active plus retired
members remains capped50000; no budget or acceptance criterion changes.

Strengthening08:21UTC: apply the same component bound to each nonempty induced
vertex subset U, and take the maximum of its31 exact values. Its union is contained
in the full union, so every such bound remains valid. This includes the simple
bound |U|/10 for a pairwise-disjoint subset. It needs no new optimizer, sampled
offset, or additional partition. The original full-graph table is preserved as
predecessor evidence; the final table is independently recomputed before use.

## Actual result and remaining mathematical obligation

The universal pair-overlap bound and subset component-CS argument give a written
structural reduction on ALL real offsets: if the union area is below14/61, its
positive-area pair-intersection graph must belong to the66 masks retained in
`artifacts/research/tip099/UNRESOLVED_GRAPH_MASKS.json`. The other958 of1024 labeled
graphs have certified lower bounds>=14/61. This is a necessary-condition reduction,
NOT a measure/probability statement, proof of optimum, novelty claim, or win over
a strong LLM baseline. Its arithmetic table was independently recomputed by Main.
The66 unresolved graphs have edge counts6:4,7:24,8:27,9:10,10:1.

The final native attempt processed69/78 walls. It retained142 certified terminal
regions and47681 unresolved active prefix regions (47823 total). At the next wall
it hit the50000-member guard and transactionally retained the prior complete prefix.
The prefix split construction still covers the cube including boundaries, but its
active members have NOT reached all78 geometric walls. Their final quadratics and
every-face minima remain missing. No n5 cell/face minimization was launched as a
scientific certification: the consumer correctly refused this incomplete cover.
No smaller witness was produced; the source witness remains an upper bound14/61.

Main independently checked all142 terminal graph bounds/vertex inequalities and
all20134 stored vertices' active-plane labels, not all vertices of every possible
cell or the entire split tree by a second enumerator. Native split correctness
and the written geometric/coarse-degree lemmas remain explicit proof premises;
tests are not a substitute for them. Full closure is therefore NOT accepted.

## Actual runtime and work ledger

| Main run | Result | Processed/pending walls | Members | Seconds |
|---|---|---|---|---|
| Cost1: lexicographic, no retirement | CELL_LIMIT |38/40|9626|3.03349|
| Cost2: lexicographic, full-graph CS | CELL_LIMIT |58/20|47795|10.197|
| Cost3: pair-first, full-graph CS | MAX_PLANES_LIMIT |60/18|41886|6.46014|
| Final: pair-first, induced-subset CS | CELL_LIMIT |69/9|47823|9.27316|

All3 costing grants and the1 full-cover attempt are consumed; no larger or fifth
coverage run. Two small native compiles consumed. Final peak RSS46874624bytes
(about44.7MiB); runtime/memory did not hit their ceilings, the cell-count guard did.
The final output is7864796bytes; the whole task directory is about23MiB, below64MiB.
Actual cost of a completed cover and full face minimization remains UNKNOWN.

Main final verification1: independent1024-entry table,142 terminal regions and
20134 active-label lists PASS_SCOPED_NOT_GLOBAL in1.292s. Verification2:17/17
deterministic controls,4 Python syntax checks, expected COVER_INCOMPLETE refusal
with0 n5 cells certified/47681 pending PASS in1.012s. Both final verification
grants consumed. Scientific optimization attempts unused, not reset or redirected.
Recorded Main native/verification computation totals about31.3s, below600s;
this is not total model/token/human work. Those costs remain unmeasured.

Builder validates implementation only:17/17 final controls,56-cell/1234-face n3
control, and initial erroneous n4 count fixture retained in its initial report.
No Builder n5 scientific run; no repeated tests added as new research wins.

The two analytic strengthenings and pair-first permutation change only the proof
execution, not the root, resource grant or closure standard. All old tables and
failed/partial pilots remain preserved. No random search was executed.

STOP at the coverage grant/cell ceiling. The parked mathematical direction is
an analytic bound on the66 dense residual graph patterns, or a demonstrated
mathematical reduction making the complete certificate fit the SAME envelope;
not an automatic bigger run, extra agents, new gate, or another local search.
The current task does not authorize a new campaign without owner routing.

One implementation Builder, no fresh mathematical solver/reviewer or A/B arm.
No paidAPI/product/UI/auth/DB/Git/deploy/install/gates. Native small compilation
permitted after df shows69GiB free; no Boost dependency installed. Limits and
refusal conditions in TIP-099_KAKEYA_COARSE_GLOBAL_CERTIFICATE.md remain fixed.

No root theorem is declared. No inferred HIVE advantage or novelty from implementation.
Cleanup: remove the task-owned generated native binary; retain its source and
the small evidence in the checkout. No scratch copy/distDir/install/Docker used.
