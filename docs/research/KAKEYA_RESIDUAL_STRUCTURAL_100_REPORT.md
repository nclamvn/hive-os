# TIP100 — Structural inequalities for the66 residual graphs

STATUS: PARTIAL ROOT;65of66 residual graphs bounded, K5 remains unresolved.
Owner selects analytic residual bounds, not another random/fullcover run.
Start2026-10-10 08:26:19UTC; hardstop09:26:19UTC.099closed history unchanged.

## Outcome

For the five original triangles and ALL real offsets, the written arguments and
exact arithmetic below prove the structural implication

    (some pair has area-zero intersection) => union area>=17/74>14/61.

The constant17/74 is a VALID lower bound, not asserted sharp for that family.
It eliminates65of099's66 residual graph masks;1023(K5) remains open. It is not
65/66 of the mathematical difficulty or a percentage of proof completion.
The new laminar sweep formula handles the geometry of that final graph exactly,
but has NOT yet been minimized over all offsets. Original root is not closed.

## A universal missing-nonadjacent-edge theorem

Let i<k<j, p=k-i>=1, q=j-k>=1, and suppose |T_i intersection T_j|=0.
All labels here refer to the five original triangles, with width(1-y)/5.
Define a=5(x_k-x_i), b=5(x_j-x_k), so D_ij=a+b and r=j-i=p+q.
The scaled pair-overlap function is

    J_s(D)=integral_0^1(1-y-|D+s*y|)_+dy,
    |T_i intersection T_k|=J_p(a)/5,
    |T_k intersection T_j|=J_q(b)/5.

From099, J_s(D)>0 iff -s<D<1, J_s(D)<=1/(s+2), and on[0,1]
J_s(D)=(1-D)^2/[2(s+1)]. Disjointness is exactly a+b<=-(p+q)
or a+b>=1 (including touching boundaries).

For the first branch, both J_p(a),J_q(b) positive would imply
a>-p and b>-q, contradicting a+b<=-(p+q). Thus their sum is at most
1/(min(p,q)+2).

For the second branch, if only one is positive the same bound applies. If both
are positive, a,b<1 and a+b>=1 imply0<a,b<1. Put u=1-a,v=1-b;
u,v>=0 and u+v<=1. Then

    J_p(a)+J_q(b)
    =u^2/[2(p+1)]+v^2/[2(q+1)]
    <=(u+v)^2/[2(min(p,q)+1)]
    <=1/[2(min(p,q)+1)]<=1/[min(p,q)+2].

Since the first and last triangles are disjoint in area, their triple intersection
also has area0, and exact inclusion-exclusion gives

    |T_i union T_k union T_j|
    =3/10-[J_p(a)+J_q(b)]/5
    >=3/10-1/[5(min(p,q)+2)]>=7/30>14/61.

This is valid for ALL offsets, both disjointness branches and all equality/touching
boundaries; no sample, local-minimum or graph-realizability assumption is used.
It proves that any below14/61 configuration must have EVERY nonadjacent label pair
intersect in positive area. The strict gap7/30-14/61 is7/1830. Labels1and5 yield
the stronger1/4 bound by choosing intermediate label3.

## Exact triple-extremum certificate, not sampled offsets

For disjoint i<j and third k, let a=sign(k-i)*5(x_k-x_i),
b=sign(k-j)*5(x_k-x_j), so both pair functions have positive canonical gaps
|k-i| and |k-j|. The disjointness inequalities become
sign(k-i)*a-sign(k-j)*b>=1 or<=-(j-i).

If either pair function vanishes, their sum<=max(1/(|k-i|+2),1/(|k-j|+2)).
Otherwise (a,b) belongs to the bounded rectangle[-|k-i|,1]x[-|k-j|,1].
Each coordinate has at most3 formula intervals; clipping their9 rectangles by
the closed halfspace yields finitely many rational polygons, possibly empty,
segments or singletons. The sum is a separable quadratic on each polygon.

A continuous quadratic attains a maximum on a compact polygon. Choose the
minimal face containing a maximizer in its relative interior: a vertex is checked
directly, an edge has zero restricted derivative (or is constant), and an interior
point has both derivatives zero. Even indefinite Hessians are allowed in this
candidate argument. Singular stationary sets have constant quadratic value on
their affine solution space; exact clipping finds a feasible representative or
shows none. Thus the full vertex/edge/interior candidate list is exhaustive,
including all formula and disjointness boundaries. Candidate values are rational.

The supplied60 certificates in artifacts/research/tip100/ALL_60_CERTIFICATES.json
cover10 pairs x3 third labels x2 disjointness branches, not a five-triangle chamber
search. For each disjoint pair choose the strongest third-label bound. In
ONE-BASED original labels, the adjacent-pair bounds are:

| Pair | Bottom-separated | Apex-inverted |
|---|---|---|
|1,2 and4,5|16/65|11/46|
|2,3 and3,4|6/25|8/35|

The nonadjacent lemma above already handles every nonadjacent pair. All displayed
adjacent bounds exceed14/61 EXCEPT8/35. The latter is below target by2/2135 and
must not be relabeled closure. A fourth triangle supplies the missing bound below.

## Central adjacent pair: four-triangle top-cap inequality

Assume original triangles2and3 are disjoint in the apex-inverted branch:
5(x_3-x_2)<=-1. Set delta=-1-5(x_3-x_2)>=0. Translate x2to0, multiply horizontal
coordinate by5 and shear by-2y (Jacobian5); write t=1-y. In these scaled coordinates
the horizontal sections are

    T2: [0,t],                 T3: [-delta-t,-delta],
    T5: [q-3t,q-2t],           T4: [p-2t,p-t],
    q=5(x5-x2)+3,              p=5(x4-x2)+2.

Original area is one fifth of scaled area. Let S=J3(q-3)+J2(q-2+delta).
The triple235 has area3/10-S/5.

- q<=0: J3=0, J2<=1/4, so the triple is>=1/4.
- 0<=q<=3/2: J3=q^2/24<=3/32, J2<=1/4, so it is>=37/160.
- q>=2: J2 is decreasing on D>=0, so S<=J3(q-3)+J2(q-2).
  On[2,3] this is1/2-q^2/24<=1/3; on[3,4] only J3 remains and is<=1/8;
  for q>=4 both vanish. Hence the triple is>=7/30.

All three bounds exceed14/61. It remains to treat3/2<=q<=2. J2 is decreasing
on D>=-1/2 (through its zero continuation), so delta>=0 gives

    S<=J3(q-3)+J2(q-2)=q-1/2-7q^2/24.

Choose h=q/6<=1/3 and restrict to the top cap0<=t<=h. The projection of T4's
cap is[p-2h,p]; the projections of B=T2 union T3 and T5's caps lie respectively
in[-delta-h,h] and[q-3h,q]. Positive-area intersection with BOTH groups would
require p>q-3h and p-2h<h, hence q<6h, contrary to h=q/6. Equality is only touching,
of area0. Therefore T4's cap can intersect at most one of these two groups.

Its overlap with T5 is<=h^2/3 by the universal gap1 pair bound and scaling.
Its overlap with B is<=3h^2/7 by the following exact three-consecutive-slope lemma:

    J2(a)+J1(b)<=3/7 whenever a-b<=-1.

Proof: if either function is0, the sum<=1/3. Otherwise -1<b<1 and a<=b-1.
For b<=1/2, J2 is increasing up to-1/2, so its maximum over allowed a occurs
at a=b-1. If -1<=b<=0, put v=b+1: the sum is v-7v^2/12<=3/7.
If0<=b<=1/2, the sum is5/12-b/6-b^2/12<=5/12<3/7.
For1/2<=b<1, J2<=1/4 and J1(b)=(1-b)^2/4<=1/16, so the sum<=5/16<3/7.
Closed endpoints satisfy the same bounds. This is a universal analytic lemma,
also independently checkable by the finite polygon certificate.

The two base cap triangles remain apex-disjoint after normalization by h;
their normalized separation is delta/h>=0. Thus that lemma applies regardless
of delta, not just at the tangent base configuration. No extra delta*h error is
needed. T4's cap area is h^2/2, so at least h^2/14 lies outside triple235.
Adding that contribution, and dividing by5, proves

    |T2 union T3 union T4 union T5|
    >=2/5-q/5+37q^2/630
    =17/74+(37/630)(q-63/37)^2
    >=17/74>14/61,  with difference1/4514.

For q outside[3/2,2], the earlier triple bounds are also>=17/74. Hence17/74
holds on the ENTIRE apex-inverted pair23 branch, including all touching and
piece boundaries. Reflection/shear (horizontal,y)->(y-horizontal,y) preserves
area and sends label j to6-j, with new offset -x_j-1/5. It sends the23 branch to
the34 branch and proves the same bound there.

## Residual scope

Apply this lemma to099's66 masks using the same fixed pair-bit order
combinations(1,...,5,2). Counts are an exact finite table check; the all-offset
justification is the preceding analytic proof, not mask enumeration itself.
The nonadjacent theorem reduces66 masks to8:
495,510,511,894,895,1007,1022,1023. Adjacent outer-pair certificates remove
495,510,511,894,1022. Central bottom-separated certificates and the top-cap lemma
remove895and1007. Exactly one residual mask remains:1023, the complete graph K5.
This reduction is conditional on verified exact triple arithmetic plus the written
top-cap argument, NOT proof of the still-open complete-graph case.

Equivalently, any configuration with union area<=14/61 must have all ten triangle
pairs intersect in POSITIVE area. The disjoint-pair branches have a uniform lower
bound at least17/74, separated from14/61 by1/4514. Any global minimizer therefore
lies strictly inside the complete-overlap polytope, whose defining inequalities are

    -(j-i)<5(x_j-x_i)<1,  for every1<=i<j<=5.

Every boundary of that polytope is already excluded analytically. No proof has yet
bounded area on its INTERIOR, including its triple-concurrence walls. The two local
quadratic cells from098 do not cover that interior. No extra cover is authorized
by this analytic task.

After fixing x5=0, its closure is compact: pair(j,5) inequalities give
-1/5<=x_j<=(5-j)/5 for j=1,...,4. All20 pair inequalities define the closed
complete-overlap polytope P. Outside its strict interior some pair is disjoint
in area, hence the17/74 lower bound applies. The known14/61 witness is strictly
inside P; continuity attains a minimum on compact P, and the boundary gap forces
every global minimizer into its interior. Therefore the all-space optimization
is rigorously reduced to this4D polytope, not the entire[-3,3]^4 cube. This does
not assert convexity of its area functional or optimality of the witness.

## Structure of the remaining complete graph: a laminar sweep

Write apex coordinates A_j=5x_j+j, t=1-y, and scaled left endpoints
L_j=A_j-j*t. Every interval has width t. Strict complete overlap implies
A_1<...<A_5. At any height0<=y<1, if adjacent labels j+1 and j belonged to
different components in REVERSED spatial order, disjointness would require
L_(j+1)+t<=L_j. But L_(j+1)-L_j=(A_(j+1)-A_j)-t>-t, a contradiction.
Therefore the component index of label j is nondecreasing in j. Components
are consecutive label blocks in natural spatial order.

Once a cut k separates labels<=k from labels>k, every cross-cut pair i<j is
naturally disjoint. Its gap is

    L_j-(L_i+t)=A_j-A_i-(j-i+1)t,

which strictly increases with y. Thus that separation persists: components only
SPLIT, never merge. There are at most4 cuts, not arbitrary repeated reconnections.
For cut k define

    tau_k=max_{i<=k<j} (1-5(x_j-x_i))/(j-i+1).

If y>tau_k, all cross-cut gaps are positive, hence the cut exists. Conversely,
if the cut exists, natural component order forces every cross-cut gap nonnegative,
so y>=tau_k. Equalities/touching cause no area discontinuity. Full K5 places every
tau_k strictly between0and1. At noncritical heights, the component partition
is precisely the consecutive-label partition obtained by cuts with y>tau_k.

For a connected block B, the union is its interval hull, of scaled length

    (1-y)+max_{j in B}(5x_j+j*y)-min_{j in B}(5x_j+j*y).

Summing this over the current blocks and integrating, divided by5, gives the
EXACT original union area on the whole strict-K5 domain. Its critical heights
are the4 cut thresholds and at most10 left-endpoint crossings, plus0and1.
This formula is justified by component geometry, not agreement at test points.
Multiple equal heights are included by continuity and exact deduplication.

Distinct split times produce an ordered binary interval tree on5 leaves: there
are Catalan C4=14 shapes. Simultaneous splits permit several binary refinements,
all retained. This is14 TREE SHAPES, not14 fully optimized polynomial regions;
envelope identities, time orders, feasibility and stationary sets still vary.
No claim the original4D minimization is automatically solved by counting trees.

## Why the last graph is not closed by the current bounds

Pair graph and the universal pair-overlap caps alone are logically insufficient.
Here is an exact relaxation obstruction, explicitly NOT triangle geometry:
on32 abstract atoms s in{+1,-1}^5 put measure

    w(s)=(1/160)*(1-s1*s4/4-s2*s5/4-s1*s5/3),

and let E_j contain atoms with s_j=+1. Every weight is>=1/960, every E_j has
measure1/10, and all pair intersections are positive. Intersections14and25 are
3/80,15 is1/30, and the other seven are1/20. Each meets its required cap
1/[5(|j-k|+2)], yet the union is191/960<14/61. Thus no valid proof using ONLY
these abstract marginals/caps and complete graph can imply14/61. Higher triangle/
sweep geometry is necessary. This is not a smaller Kakeya witness.

A second tempting shortcut also fails: area is NOT convex even inside strictK5
with x1 the largest and x5 the smallest bottom offset. At
(31/101,19/103,13/107,8/109,0), all78 coarse walls are nonzero and the exact local
area Hessian has H44=-5. A sufficiently small fourth-coordinate direction stays
in the same chamber and K5, and has negative second derivative. This is an exact
counterexample to convexity, not a random search or inference from a few positive
Hessian samples. Consequently098's strict local minimum cannot be promoted to a
global minimum using an assumed convexity argument. The full Hessian and failed
shortcut are preserved in MAIN_CONVEXITY_DIAGNOSTIC.json.

The remaining obligation is therefore genuinely geometric: prove the laminar
functional>=14/61 for all admissible4D offset choices, all envelope changes and
ties, or produce an exact smaller witness. Its boundary is already certified
>=17/74. This task has NOT executed a renewed fullcover or exhaustive14-tree
optimization and does not claim that either has known acceptable cost.

## Work / source / claims

Main read the public Station definition/witness and its n5 open-status before
this campaign; no blind discovery or novelty claim. Source:
https://dualverse.ai/station/math/discretized-kakeya-needle/ . That source proves
the reflection-fixed lower bound7/30, not unrestricted C_T(5)=14/61. Our disjoint
pair lemma above is a separate argument and does not assume reflection symmetry.

One implementation Builder checks the proposed finite2D pair-overlap maxima.
No product/UI/auth/DB/Git/config/build/install/APIpaid/random/grid/fullcover.
Root closure, source comparison, finite arithmetic and engineering results will
be separated in the terminal ledger. No method superiority inferred.

## Actual verification and resource ledger at08:50:31UTC (before owner resumption)

Main independently recomputed clipped polygon vertices by every two-binding-
constraint system and their quadratic extrema for all60 triple certificates:
402 formula polygons,468 vertices, exact agreement. This is a universal finite
piece certificate under the explicitly proved pair formulas/extrema argument,
not arbitrary testing of configurations. Results MAIN_TRIPLE_VERIFICATION.json
and RESIDUAL_GRAPH_DISPOSITIONS.json record65 closed masks and1023 unresolved.

Main final replay:39 distinct focused controls (17triple+10top-cap identities/
abstract atoms+12laminar),0failures/errors,5 Python sources AST-valid. Repeated
Builder/Main replays are not added as extra tests. Ten FIXED configurations agree
with both unchanged098 area algorithms and the new laminar integration path.
Those fixed checks validate code only, not the all-K5 lower bound. The known
witness's four cut heights are93/122,32/61,99/122,37/61; exact area14/61.
All simultaneous cuts/left-line crossings retained; nonstrict/malformed inputs
refused by the strict-K5 integrator rather than silently extrapolated.

The top-cap bound's complete-square identity and positive margin1/4514 were
checked exactly. Its projection, scaling, reflection and union implications
are Main's written geometric proofs, not formalLean or independent human review.
No claim of peer-verified novelty or superiority over a strong baseline.

Six Main mathematical computational invocations of at most60s were used:
1reference pair-overlap/disjoint-pattern diagnostic;2residual-mask count;
3independent triple polygon/extremum verification (~0.060s);
4fixed exact Hessian/convexity diagnostic (~0.147s);
5all39 controls, identities and reference laminar replay (~0.136s);
6inventory of EXISTING099prefix geometry (~0.100s). No random/grid/optimization
search. Total measured mathematical computation well below300s, no individual
command near60s. These times are not model tokens, total reasoning or human effort.
No further invocation was run to manufacture closure; unused grants remain unused.

The existing69wallprefix contains21832 K5 members, versus47681 previous active
members;25849 are now excluded by the disjoint-pair theorem. This inventory is
NOT a final78wall count, new cover, optimization or full-cost guarantee. The hard
part can be concentrated in that one graph; do not report98.5% of research solved.

One implementation Builder: bounded stdlib arithmetic and integrator only, no
fresh mathematical reviewer or newtarget. Native compiles/builds0; product/UI/
auth/DB/config/Git/install/APIpaid/wholecover0. Initial/followup reports preserved.
Builder computation well below120s; no scratch/distDir/venv/bytecode/Docker.
No files deleted. Entire new output below16MiB.

Retained failures: the convexity shortcut is false (two fixed negative Hessians);
the abstract pair-only relaxation admits191/960 and cannot close K5; the8/35
triple bound alone misses the target, so it is explicitly superseded by the
four-triangle argument rather than reported as a win. Two Main metadata reads
guessed nonexistent followup filenames; corrected by the actual inventory, no
mathematical data changed. Builder retained one report-patch context mismatch.

Requirement coverage: R1partial (65/66 graphs, one complete-graph interior
unresolved); R2complete within proposed disjoint/top-cap/laminar arithmetic scope;
R3complete integrated report. OverallNOT_READY_FOR_ROOT_CLAIM. Scientific progress
is the all-offset disjoint-pair theorem and exact laminar representation, not
engineering volume, sample agreement or proof that investment is worthwhile.

STOP this bounded analytic pass with the exact residual, before the60min ceiling;
the admitted charter allows an explicit unclosed-pattern result. No renewed099
cover/compile or automatic envelope/tree exhaustive enumeration. Next routing,
if selected by Owner, must bound the laminar functional on P's entire interior,
including all feasible envelope changes,14 tree shapes/ties and stationary sets,
within a separately demonstrated finite cost. It must preserve the strict boundary
bound17/74 and cannot assume convexity, choose another n, or reset old failures.

## Owner-resumed K5 work: exact elimination of the scale variable

The owner explicitly requests the named next step after the preceding report.
Resume THIS TIP100, not a new campaign: original09:26:19UTC hardstop, cumulative
8 Main mathematical calls/300s and Builder120s unchanged. The preceding terminal
result is preserved. This section gives universal reductions on K5, followed by
fixed-shape arithmetic; it does NOT assert the missing all-shape inequality.

### Normalize apex shape, not sample offsets

Let A_j=5x_j+j. Strict K5 gives A_1<...<A_5. Horizontal translation has no effect;
write A_j=A_1+s*v_j, where s=A_5-A_1>0 and

    v_1=0<v_2<v_3<v_4<v_5=1.

Choose the translated gauge A_1=0, hence x_j=(s*v_j-j)/5. For every pair i<j,
the strict K5 inequalities become0<s*(v_j-v_i)<j-i+1. Therefore its EXACT scale
domain is0<s<S(v), with

    S(v)=min_{i<j}(j-i+1)/(v_j-v_i),   m(v)=1/S(v).

This maps the WHOLE K5 interior to three shape variables plus one positive scale,
not merely a family near the witness. In particular S<=5. The endpoints s=0 and
s=S have an area-zero pair intersection and are already excluded by17/74; s=0
actually has area1/2. Shape collisions also force an area-zero pair intersection.

For t=1-y, the horizontally scaled sections are

    [s*v_j-j*t, s*v_j-(j-1)*t].

Let L_v(r) be the union length of intervals[v_j-j*r,v_j-(j-1)*r], for r>=0.
Changing variables r=t/s gives the exact area

    A(s,v)=s^2/5 * F_v(1/s),   F_v(u)=integral_0^u L_v(r)dr.

### A hull-minus-gap identity on the entire normalized cone

Set ell_j(r)=v_j-j*r and, for k=1,...,4,

    g_k(r)=min_{i<=k<j}(v_j-v_i-(j-i+1)*r).

For r>0, adjacent labels cannot occupy disjoint components in reversed order:
ell_(j+1)-ell_j=(v_(j+1)-v_j)-r>-r. A reversal of the sequence of component
indices would require such an adjacent reversal. Components are therefore
consecutive label blocks in natural spatial order, just as in the100 sweep proof.
Cut k exists with a positive gap exactly when g_k(r)>0; its gap length then equals
min_{j>k}ell_j-max_{i<=k}ell_i-r=g_k(r). Removing all these physical gaps from
the interval hull yields the universal identity

    L_v(r)=r+max_j ell_j(r)-min_j ell_j(r)-sum_{k=1}^4 max(g_k(r),0).

It includes simultaneous cut/envelope changes by continuity. At r=0 its continuous
value is0. For r>=m, every cross-pair expression defining g_k is<=0, so all cuts
are closed and the union is a SINGLE connected interval. Thus, throughout the
admissible integration endpoint r=1/s>m,

    L_v(r)=r+max_j ell_j(r)-min_j ell_j(r).

For r>=1, label1 is the maximum and label5 the minimum: v_j<1 and integer slope
differences suffice to check both inequalities. Hence L_v(r)=5r-1 there.

Define the normalized cone energy and hull tail by

    Q(v)=integral_0^1 [L_v(r)-(5r-1)]dr,
    h_v(r)=max_j[v_j-(j-1)*r]+max_j[1-v_j-(5-j)*r],
    R_v(u)=integral_u^1 h_v(r)dr  if m<=u<1, and0 if u>=1.

Both maxima in h include a zero term, so R>=0. For r>=m, h=L_v-(5r-1).
Integration gives, for ALL strict-K5 shapes/scales,

    F_v(u)=5u^2/2-u+Q(v)-R_v(u),  u>=m,
    5*A(s,v)=5/2-s+s^2*[Q(v)-R_v(1/s)].

The tail cannot be dropped from a LOWER bound: it is subtracted. A bound on Q
alone is NOT automatically a bound on all K5 scales. This preserves the known
failure of global convexity rather than hiding it in a new parametrization.

### At most nine exact radial quadratic pieces per shape

Fix any admissible shape v. As r increases, the label maximizing ell_j can only
DECREASE, and the minimizing label can only INCREASE: two lines cross at most
once and their slopes are -j. Each envelope therefore switches at most four
times. Their combined envelope has at most eight switch heights, including
simultaneous switches; thus A(s,v) has at most NINE radial pieces on[0,S]. This
is a universal per-shape count, not nine pieces for the entire three-dimensional
shape space. The dependence of coefficients on v is still piecewise quadratic.

On a connected-envelope interval with maximum label a and minimum label b, put
c=b-a+1 and d=v_a-v_b. Here L_v(r)=c*r+d, so

    F_v(r)=c*r^2/2+d*r+K,
    A(s,v)=c/10+(d/5)*s+(K/5)*s^2.

K is determined exactly from the previous integral at any endpoint of that
interval, not fitted from sampled offsets. Fixed-shape integration has finitely
many rational line crossings when v is rational. All piece endpoints, convex
stationary points s=-d/(2K) when K>0, and flat intervals suffice to minimize the
closed radial domain. Concave/linear pieces have their minimum at endpoints.
No numerical optimizer or random search is needed for this scale elimination.

### Necessary conditions for EVERY global minimizer

The100 compactness/boundary-gap theorem implies a global minimizer exists strictly
inside P, since the known14/61 witness lies below17/74. Its normalized shape and
scale are strict; varying s slightly with v fixed remains feasible. L_v is
continuous, so F_v is differentiable, and A is C1 even at radial envelope switches:

    dA/ds=[2*s*F_v(1/s)-L_v(1/s)]/5.

At a global minimum this derivative vanishes. If W is the ORIGINAL horizontal
union width at y=0, then W=s*L_v(1/s)/5, and consequently

    A=W/2=(1+max_j(5x_j)-min_j(5x_j))/10.

This holds at bottom-envelope ties as well; it is not inferred from the witness.
Since the known candidate bounds the global minimum above by14/61, every global
minimizer must satisfy max(5x_j)-min(5x_j)<=79/61. A hypothetical BETTER global
minimum has strict inequality. A converse lower bound on this span is NOT proved.

Further, every label attaining the largest bottom left endpoint must be SMALLER
than every label attaining the smallest endpoint. To prove this, look immediately
to the right in s: among tied maxima the largest label wins (v is increasing),
and among tied minima the smallest label wins. In this one-sided piece a!=b.
If a>b, then d>0; derivative zero forces K=-d/(2s)<0. Its second-order change
to the right is K*h^2/5<0, contradicting a local minimum. Thus a<b, including
ties. This eliminates natural-order bottom extrema as global minimizer candidates;
it does NOT yet force the extreme labels to be1and5. Ten ordered pairs remain.

For a feasible stationary point of a radial piece with K>0,

    A_stationary=c/10-d^2/(20*K).

Its desired14/61 bound is exactly

    (122*c-280)*K >= 61*d^2.

At envelope junctions both one-sided laws must be considered; C1 stationarity
and nonnegative one-sided curvature are necessary. Their values agree. In
particular c=2 would give A_stationary<1/5: such candidates must be excluded by
their shape/scale feasibility or would contradict the desired root. They have
NOT been excluded here. This explicit obligation prevents presenting scale
elimination as a completed global proof.

### Exact fixed-ray certificate and its limited scope

For the source witness shape

    v=(0,29/165,93/165,116/165,1),  S=165/34,

the first radial piece0<=s<=165/49 is

    A(s,v)=1/2-s/5+61*s^2/1650
          =14/61+(61/1650)*(s-165/61)^2.

The other four pieces are checked by exact endpoint/convex-stationary arithmetic
in RADIAL_CONTROLS.json; their values are strictly larger than14/61. The unique
minimum on[0,S] is therefore14/61 at s=165/61. For s>=S, some pair is disjoint;
for s<=0 all apex orders are reversed or equal and a pair is disjoint. The100
17/74 theorem excludes ALL these scales too. Thus the whole REAL scaling ray of
this ONE shape is now certified, not just the098 local neighborhood. Translating
the resulting offsets recovers(79/305,47/305,10/61,12/305,0).

This is a conditional geometric family, NOT the all-shape lower bound or a novel
research claim. The symmetric shape's closed radial minimum is7/30 at s=8/3;
its known public symmetric-family result is not relabeled independent discovery.
Two other fixed control shapes are code controls, not attempted replacement
problems or evidence of a general minimum.

### Refused shortcut and independent arithmetic

A contemplated three-triangle shortcut was rejected BEFORE being used: the
consecutive-component theorem depends on consecutive integer slopes and cannot
be transplanted to slopes1,3,5. At normalized apices(0,1/5,1), r=2/5, their
intervals are[-2/5,0],[-1,-3/5],[-1,-3/5]. The union length is4/5, hull length1,
and the natural-label cut formula misses the reversed spatial gap. This refutes
that PREMISE, not any proved triple lower bound or the valid five-slope reduction.

Builder added only radial_shape.py/test_radial_shape.py plus41,704-byte controls
and appended completion;10new distinct controls PASS, two source AST checks.
Four fixed shapes,32 scale comparisons against both098 paths and100laminar
where strict, including all radial junctions/endpoints and stationary candidates.
Main invocation7 independently integrates the hull-minus-gap energy and the
hull-tail correction:12 radial coefficient laws match exactly, four stationary
area/half-bottom-width identities match. These are scoped code/arithmetic checks,
not proof that all three-dimensional shape choices meet the final inequality.
Results MAIN_RADIAL_VERIFICATION.json. Cumulative distinct controls now49.

The remaining mathematical task is the UNIVERSAL feasible-shape stationary
inequality above, including all envelope/gap changes and junctions, or an exact
smaller witness. No all-shape enumeration/minimization, cost estimate or renewed
cover has been executed. The universal dimension reduction and fixed-ray theorem
are real additions; the original root STILL remains PARTIAL.

### Resumption terminal checkpoint — 2026-10-10 09:07:34UTC

Main invocation8/8 passes49/49 distinct focused controls,0errors/failures, seven
Python sources AST-valid. No ninth mathematical run. Final measured computation
0.195s; cumulative computation remains far below300s. Builder's ten new controls
take0.0635s, cumulative validation far below120s. Main independently checks all
five fixed-source-ray piece minima, exact witness translation, and tightness of
the stationary inequality on that shape. Output
MAIN_RESUMED_FINAL_VERIFICATION.json preserves exact margins, not rounded votes.

The discarded tail shortcut has an explicit exact control: on the source shape
at s=4, actual area7736/27225, uncorrected energy expression481/1650. The latter
OVERestimates area by401/54450; R_v(1/4)=401/174240. Dropping that positive tail
cannot certify a lower bound. This is not a smaller-than14/61 witness.

Total elapsed41min15s from the original08:26:19 start, within original60min.
Original8/8 Main invocation cap now consumed including both resumed checks;
no new resource grant, wall cover, compile or shape search. Previous65/66 theorem
and failed shortcuts preserved. New outputs~768KiB, no scratch/distDir/bytecode/
Docker/deletion. No product/UI/auth/DB/config/Git/install/APIpaid/newinfra.

Requirement coverage: R1 STILL partial (K5 all-shape lower bound open), R2complete
for written hull/radial reductions and supplied exact arithmetic, R3complete.
Scale elimination is universal; fixed-ray minimization is conditional. Neither
finite controls nor3D instead of4D prove all-shape closure or method superiority.
No formalLean/independent human review/authenticated HIVE E2E/novelty claim.

STOP original envelope. The exact remaining obligation is to establish
(122*c-280)*K>=61*d^2 on EVERY feasible shape/envelope stationary case, excluding
admissible c=2 candidates if none exist, with all ties/shape boundaries handled,
or exhibit an exact smaller witness. A further all-shape partition requires a
demonstrated cost and direct owner routing, not automatically another checker
framework, renewed random search or a claim this universal inequality is solved.
