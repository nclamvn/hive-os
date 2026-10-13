# TIP103 targeted mathematical review — supplementary AI critic

Scope: R3 only, read-only source inspection and mathematical reasoning. No new
calculation, checker replay, search, test or source edit was executed. This review
does not supply independent human acceptance or a novelty claim. It relies on
TIP101's complete cover, Cartesian phase inventory, C1/stationarity reduction and
outside-pair bound, with both corrections in the current external-review dossier.

## Finding

No blocking defect was identified in the proposed **conditional** equality and
capped quadratic stability deduction. The distinction between a new equality
scan and a fresh full predecessor-certificate acceptance must remain explicit.
The new scan accounts for all retained 8658 records and re-eliminates their 667
quadratics; it does not rederive the cone polynomials or independently establish
the complete shape/Cartesian inventory. Those are accepted predecessor premises.

### Equality completeness, including ties

Assuming the predecessor universal lower bound, every equality point is a global
minimum. The outside-pair bound places it in strict K5. Corrected incident-open-
phase argument C2 then selects an included Cartesian phase, including points on
shape walls or bottom ties; C1 forces its full gradient to vanish. Therefore all
equality points occur among the retained stationary systems. Inspecting only
rank-four systems would have been inadequate; the new scan considers nullspaces
before classification. Its saved result contains 68 equality records, all rank
four, 64 infeasible and four feasible records deduplicating to two points. Thus
no singular equality locus remains **in the retained complete inventory**.

### Local star and exact radius

For an affine wall g, an infinity-norm perturbation q obeys
|g(A+q)-g(A)| <= ||normal(g)||_1 ||q||_infinity. Hence the code's half-margin
radius preserves every nonzero shape-wall, strict-polytope and bottom-comparison
sign. Zero walls are intentionally allowed. Because all bottom comparisons are
included, bottom extrema cannot silently switch across an unrecorded phase.

Every nearby shape cell must, by complete cover and the fixed nonzero signs,
have closure containing the equality point. Its bottom phase also has the same
extremal labels or an incident tie. It is therefore one of the laws retained by
the closed-feasibility incident scan. Excluding inconsistent stationary systems
from that local list is safe under C1: a genuine incident law at a minimum must
have zero full gradient there and so cannot have inconsistent stationary equations.
The source computes two incident laws per point, checks their exact stationary
gradients, and certifies H-(1/32)I positive definite via exact principal minors.
Consequently the local bound is

    area(A)-14/61 >= (1/64) ||A-m||_2^2

on the stated local infinity-norm balls (radii 1/244 and 3/610). The common
Euclidean radius r=1/244 is admissible since ||q||_infinity <= ||q||_2. It is
conservative, not claimed to be the maximal local radius or sharp coefficient.

### Global capped bound

Use A=(A2,A3,A4,A5), Aj=5(xj-x1)+j-1, and let M contain the two classified
points. Let P_A be the transformed closed pair-overlap polytope. It is compact.
On its complement (including its boundary when applicable), the predecessor
bound gives area-14/61 >= 1/4514. On the compact set

    K = P_A \ {A : dist_2(A,M) < r},

continuity and the complete equality classification give eta=min_K(area-14/61)>0.
If K is empty the away-from-minimizers clause is vacuous. Thus, for nonempty K,

    area(A)-14/61 >= c min{dist_2(A,M)^2,1},
    c = min{1/64, eta, 1/4514} > 0.

This is a rigorous **existence** statement, not an explicit numerical global
constant: eta has not been computed or certified by this review. A pure uncapped
all-real quadratic bound is false since the union area is bounded by 1/2 while
gauge-fixed offsets can be arbitrarily separated. Locally, nonzero quadratic
directional growth makes exponent two the nondegenerate order; a stronger power
p<2 cannot hold with a fixed positive coefficient as distance tends to zero.

## Reflection caveat

In x5=0 gauge, R(z1,z2,z3,z4)=(z1,z1-z4,z1-z3,z1-z2). It comes from the
area-preserving planar map (u,y)->(y-u,y), relabeling j to 6-j and regauging;
R^2=I. But R is **not** a Euclidean isometry. Reusing an untransformed Euclidean
Hessian coefficient after reflection would be incorrect: the Hessian transforms
by congruence, and neighborhoods transform as well. A crude safe transfer uses
||R||_2 <= sqrt(7), ||R||_infinity <= 2, hence ||Rq||_2 >= ||q||_2/sqrt(7).
The present A-metric approach avoids this issue by directly certifying both
points' local Hessians and radii rather than transferring a common x-metric bound.

## Useful general rank-one jump lemma

Suppose a C1 function agrees with quadratics p_minus and p_plus on opposite
sides of a linear wall ell(q)=v dot q, and q=0 is stationary on the wall. C1
agreement on a relatively open wall patch forces the quadratic difference to
be alpha*ell(q)^2: its value and gradient vanish on that hyperplane. Therefore
H_plus-H_minus=2*alpha*v*v^T. If H_minus is positive definite and alpha>=0,

    f(q)-f(0) = (1/2)q^T H_minus q + alpha*max{ell(q),0}^2

has a positive quadratic lower bound on that local two-phase domain. If alpha
is negative, positivity of both side Hessians is needed instead; rank one alone
does not guarantee a minimum. TIP098 has alpha=5/24 and v=(3,-4,0,1), consistent
with its displayed Hessian jump (5/12)vv^T. This lemma explains the local mechanism
but cannot replace the global equality inventory or outside-pair theorem.

## Claim boundary

Recommended wording: conditional computer-assisted classification of equality
and quadratic stability in the exact five translated-triangle model, dependent
on the earlier analytic/certificate dossier and pending external mathematical
review. Not unrestricted Kakeya, a measured HIVE-vs-LLM advantage, a new public
witness, a formally verified theorem or established novelty.
