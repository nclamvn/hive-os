# TIP116 — Independent structural hand review

STATUS: PARTIAL. The all-real finite K6 target F6>=20/93 remains OPEN.
This is an independent AI hand challenge, not external or formal acceptance.
Mathematical subprocesses0; no finite samples or optimizer evidence.

## Admission and retained scope

The active owner routing is TIP116, PUBLIC_DISCOVERY, hand-only, with the
2026-10-11 16:59:50UTC hard stop. R116-1 requires the whole natural complement
of C and all twelve inverted continua, or a complete actual-minimum exclusion.
This review uses the protocol/current activation/latest handoff, TIP116,
Vibecode Kit and its TIP/report reference, accepted109 identities/C theorem,
110 failures, and retained106/107/108F reductions. Old proof bytes are untouched.

## 1. Actual natural flow identities checked independently

For D_i>0 define

    c_i^L(t)=max_{k=0,...,i-1}[kt-sum_{h=i-k}^{i-1}D_h],

and the analogous right suffix maximum. The k=0 term is0. Factoring the
exact cross-cut minimum gives q_i=(D_i-2t-c_i^L-c_i^R)_+.
The c_i do not depend on their own D_i. Their unique closure times T_i obey
D_i=2T_i+c_i(T_i). Hence the exact holes are

    integral q_i = D_i T_i-T_i^2-I_i(T_i,D),
    I_i(T,D)=integral_0^T c_i(t)dt.

The derivative of T_i cancels because the residual is0 at closure. At T_i=1,
any omitted physical-bottom tail after a small perturbation has width and
height O(|h|), hence area O(h^2). FIRST derivatives therefore transfer;
second derivatives across a bottom contact do not follow from this argument.

The actual full hull envelopes are the decreasing/increasing nonnegative
Euclidean projections alpha/beta of delta=1-D. Their maximizers are unique,
including pooled and zero blocks; their support values are C1 and have
D-derivatives -alpha/-beta. Since D>=0 gives delta<=1, the projected block
averages never exceed the physical upper cut1. No free hull quadratic is
continued across a pooling face.

For the prefix-exposure flow F_(i,j) of the Builder note, direct integration
of active prefix slopes gives

    C_i=c_i(T_i)=sum_j F_(i,j),
    M_j=sum_i F_(i,j)=-sum_{i!=j} partial_j I_i(T_i,D).

The actual full gradient therefore gives exactly

    1=alpha_j+beta_j+T_j+M_j.

The Builder's joint convexity/C1 proof for J(T,S) is valid: each ACTUAL
increasing-slope envelope path has a positive-semidefinite quadratic, and
disappearing active intervals have length0, so first derivatives match.
Its partial-minimization proof of convex restored energy R_i is consequently
valid in the nonnegative natural domain. This is not a proxy-stationarity claim.

Positive hull blocks satisfy the stated block conservation equalities by
projection complementarity. Zero blocks have only polar inequalities; replacing
them by equality would be invalid.

The monotone-D exclusion in the Builder note is sound for genuine competing
minima. Its strict comparison 5(1-mu)/6<1-mu needs mu<1; strict D>0 supplies
that. The degenerate D=0 collision face cannot be admitted as a stationary
natural minimum. The argument does not cover nonmonotone D or inversion.

## 2. Prefix lifetime ordering is valid, but not the sharp coupling

If donor i has an active side prefix of length k, intercept S, reaching cut h
on a positive-length band below T_i, then S<kt there. The interval of those
k edges crosses h, so the exact closure minimum gives

    T_h<=S/(k+1)<k t/(k+1)<k T_i/(k+1)<T_i.

This proves strict lifetime descent and the claimed barrier/locality property.
It does not prove nearest-neighbor-only flow, a sharp total-flow bound, or the
desired coupling M_total-g<=8r/49, where g=r-sum delta>=0.

Here is an exact hand counter to dropping the FIVE individual stationary
equations and using only lifetime constraints, retained bottom filters and
their summed timing identity. Put

    D=(1/2,1/2,10/7,1/2,1/2),
    p=(11/7,15/14,4/7,1,1/2,0).

Apices are strictly natural, range(p)=11/7 lies in[79/61,49/31], the bottom
is strictly connected, and unique extreme labels1/6 give both depth slopes6.
The exact cuts and flows are

    T=(1/4,1/4,4/7,1/4,1/4),
    M=(1/14,1/14,0,1/14,1/14).

For cut3, c_3=4(t-1/2)_+; other cuts close before any fill. Thus sum T=r,
g=0 and M_total=2/7, but

    M_total/r=2/11>8/49.

The actual projections are

    alpha=(1/2,1/2,4/21,4/21,4/21), beta=reverse(alpha).

The four outer balances alpha+beta+T+M equal85/84, and the central balance
equals20/21. They sum to5, but are NOT individually1. This is not a
counterexample to any theorem genuinely using full stationarity. The point's
actual area is G=769/588>40/31, and its radial derivative is13/294, not0.
The example identifies the exact information lost by an aggregate-only flow
argument; it neither refutes K6 nor establishes a new closure milestone.

For comparison, solving all five balances in the related hand family
D=(d,d,c,d,d), c>2d and c+2d<3, gives

    outer balance=2-(9d+c)/6,
    central balance=2-(3c+4d)/6.

Their common value1 occurs at d=12/23,c=30/23. Therefore

    D=(12,12,30,12,12)/23,
    p=(37,26,15,22,11,0)/23,
    T=(6,6,13,6,6)/23,
    M=(1,1,0,1,1)/23,
    alpha=(11,11,5,5,5)/23, beta=reverse(alpha)

is genuinely full-stationary, outside C. It has G=30/23>40/31 and range
37/23>49/31, so the competing-range filter excludes it. No local-minimum or
Hessian claim is made. The exact flow equations do not by themselves imply C.

## 3. A stronger whole-height necessary condition for every inversion

Let A_i>A_(i+1). The two triangles are disjoint at every positive height:
their inner facing endpoints have the constant gap A_i-A_(i+1)>0.
Let O be the union of the other four triangles, and write

    c_j(a)=|T_j(a) intersect O|, M_j=max_a c_j(a), j=i,i+1.

The maxima exist because these continuous coverage functions vanish outside
a bounded interval. At an inverted GLOBAL minimum, each original apex must
attain its corresponding M_j, not merely satisfy a coverage derivative0.
Indeed, moving just triangle j to ANY apex a gives

    G_new=|O|+1-c_j(a)-c_other(old)
                 -|(T_j(a) intersect T_other(old))\O|
          <=G_old-[c_j(a)-c_j(old)].

Any strict coverage improvement is therefore an actual descending variation,
even if the moved pair begins to overlap. No pair-overlap derivatives are
summed; c_j is intersection with the ENTIRE union O.

More exactly, set q(a,b)=|(T_i(a) intersect T_(i+1)(b))\O|. With O fixed,

    min G=|O|+1-sup_{a,b}[c_i(a)+c_(i+1)(b)+q(a,b)].

An inverted global minimum forces that supremum to equal M_i+M_(i+1).
Consequently q(a,b)=0 for EVERY pair of individual maximizing apices.
If any pair of maximizers has q>0, the actual union strictly decreases.
If the maximizing-apex sets have a common apex a, setting both there preserves
the old minimum value but places it on an adjacent-apex collision face,
contradicting the retained106 collision exclusion. This provides a valid
whole-height coupling reduction for all twelve retained inverted continua.

What remains unproved is an ORDERED-MAXIMIZER or exposed-overlap theorem for
the special four-triangle unions O with the retained near-natural apex words.
For one other triangle only, the preferred apex separation is
r(r+1)/(r+2), and preferred apices increase with the moving label. That
single-triangle fact cannot be added across O: multiple coverage changes
both gradients and maxima. Neither a pointwise swap nor independent pair
coverage maximization establishes the needed union-level theorem.

### Contact-band check of a prospective integrated swap

At an adjacent collision, take the pair's co-moving contact coordinate0,
with its outer endpoints -t,+t, and keep O fixed. Put

    C={t:0 in O_t}, P_-={t:-t in O_t}, P_+={t:+t in O_t}.

The one-sided first-order difference between the separated inverted pair
and the sorted pair has coefficient

    1+|C|-|P_-|-|P_+|.

These are UNION occupancy sets in height, not sums of individual ray hits.
For a lower source with relative gap r and positive apex distance d, its
three bands are C=[d/(r+1),d/r], P_+=[d/r,d/(r-1)] and
P_-=[d/(r+2),d/(r+1)], clipped to[0,1]. For r=1 the late endpoint is
infinity. Higher sources interchange the outer wings.

No proof that this coefficient has the needed sign throughout the retained
domain, nor a transfer from the collision coefficient to finite swaps, is
supplied. In particular an independently distance-minimized symmetric central
diagnostic with nearest distance1-rho and farther distance2-rho has actual
offset span1+2rho. Setting rho=range-1 violates the actual retained range;
such a diagnostic can only be a relaxation, not a feasible extremizer.

### Single-inversion pointwise counter, with naturally ordered O

Even removing the other inversion from the retained110 obstruction does not
rescue SLICE-WISE swapping. This exact symbolic family supplies a separate
counter. For0<u<1/100 take

    p=(-1/2,4/7,u/2,-1-u/2,-1/5,-1/5).

Its sole apex inversion is3/4, and all four O apices are naturally ordered.
The range11/7+u/2 is in[79/61,49/31], the bottom is strictly connected,
and its unique extreme labels4(left)/2(right) give both depth slopes3.
No full-gradient or radial stationarity is claimed.

At t=13/20, using the co-moving horizontal coordinate z+3t-3, the four
fixed intervals are

    O1=[-6/5,-11/20], O2=[31/140,61/70],
    O5=[1/2,23/20], O6=[17/20,3/2].

The old pair has intervals[-t-u/2,-u/2] and[u/2,t+u/2]. Thus its whole
slice union is[-6/5,-u/2] union[u/2,3/2]. Swapping the two apices gives
pair union[-t+u/2,t-u/2]; O retains every discarded outer wing and the
new whole union is[-6/5,3/2]. Actual slice width INCREASES by exactly u.

This is expressly NOT an integrated-area or stationary counterexample.
Indeed its collision bands at u=0 are

    C=[3/14,3/7] union[5/6,1], P_+=[3/7,1],
    P_-=[1/7,3/14] union[5/8,5/6],

so the full-height first-order swap coefficient is89/168>0. Therefore
G_old-G_swap=(89/168)u+o(u)>0 for sufficiently small u: the integrated
swap decreases area despite the displayed slice increase. The only refuted
implication is that a single inversion, natural O and the retained bottom
filters license pointwise full-union compression.

## 3A. Strict central-star argument additionally hand-checked

The Builder's later Section6 covers D>0 with actual full stationarity/local
minimality, C1=C2=C4=C5=0 and T3 strictly greater than all wing times. This
whole nonsymmetric CLASS exclusion is sound within precisely that domain.

The decreasing fit must separate its first two positive entries from the
rest, and the increasing fit separates its last two. The local violated
input order delta2>delta3 forces beta2=beta3; the fit-block endpoint bounds
are in the correct direction. Both separated-beta1 branches, including
beta1=0, contradict the exact wing balances/C1=0. The inner hull means may
remain0; the argument never treats a zero-block polar inequality as equality.

The exceptional u>theta>v, u+v=2theta branch is validly excluded by the
one-sided ACTUAL perturbation (u,v)->(u-h,v+h). The pooled hull means remain
unchanged, with the increasing first-prefix residual improving and the second
unchanged. Any cut1 long-interval tie is made strict by the decreasing adjacent
closure. Cut2 has a positive closure margin; affected cut4/5 long sums either
stay fixed or increase. All four zero restored energies remain0.

On that branch the left prefix energy is (T-v)^2/2. Increasing v makes the
optimized terminal T INCREASE with derivative1/m, where m=3+k_R and k_R is
the right terminal active slope on the increasing-T side. Thus a right
terminal switch is handled in the correct one-sided phase. The exact minimized
curvature is1-1/m; raw curvature is-1, hull curvature0, so the actual second
variation is -h^2/(2m). The beta prefix mean is v/2>0, and source balance
forces theta<1. No omitted physical-bottom tail contributes to this argument.

The remaining equal wing-pair equations force a=b using a strictly increasing
scalar function, not Jensen. Their only strict-root stationary competitor is
the above-range (12,12,30,12,12)/23 point; the flat2/3 vector occurs only on
the strict-root boundary, and theta=1 gives range7/3. This excludes the
declared central-star class without imposing symmetry.

It does not exclude tied/noncentral maxima, multiple donors, arbitrary
natural arrays, or any inverted order. It is not accepted as a substitute
for R116-1 or a new global/whole-natural milestone.

## 3B. Full strict-central-root reduction and calibration reviewed

The Builder's later Sections7--9 remove the single-donor assumption within
the domain T3 strictly greater than all other T's. The wing-order argument
is valid: T2>T1 would force C1=0, a cut2->1 flow and equal root flows to1/2;
the two necessary strictly decreasing hull drops then make the exact hull
difference twice (or more than) the required wing difference. Reflection
gives T1>=T2,T5>=T4, and hence C2=C4=0.

If an endpoint itself donates, farther root flow to it contradicts the
increasing/decreasing fit order. If farther root flow reaches an inactive
left endpoint, the left wing D's must be equal. The mixed case with an active
right end was checked without symmetry or omission of zero inner blocks.
The two right-hull alternatives {34},{5} and {345} exhaust the possible
fit partitions. The zero beta-prefix alternative forces a negative D5.
The positive beta-prefix alternative yields exactly

    9a+4theta-2b=6, 3a+psi=2,
    13a-10theta-6psi+2b=0, theta=3b/2,

whose solution a=126/241,theta=117/241 contradicts the required theta>a.
Thus farther root flow is removed on this declared strict-central domain.

The remaining exact nearest-flow area equals Q minus ALL projection
deficits: two full hulls, two end restorations and the central restoration.
The full hulls really lie in the selected block subspaces, since D1>=D2,
D3>D2,D4 and D5>=D4 force the corresponding fit equalities, including
equal input values. Arbitrary coarsening and clipping at0 remain admissible.
The nearest restoration conjugates use nonnegative multipliers, so zero end
or central flows are losses of their free quadratics, not an invalid free
continuation. At a farther-prefix terminal contact or T_i=1 the FIRST
derivatives match the actual area; no second-variation transfer is required.

For E=.5||z-P_K z||_W^2 and a feasible sharp-anchor z*, normality gives
grad E dot(z-z*)>=2E. Every free optimum z(D) is affine. Therefore actual
full stationarity of G=40/31+Qdist-E_total implies

    0=2Qdist-sum grad E dot(D-D*),
    Qdist>=E_total, G>=40/31.

This is a valid stationary calibration throughout that strict-central domain,
including hull/restoration projection faces. It does not calibrate a lower
proxy at a nonstationary actual point, use independent curvature domination,
or infer a global inequality away from stationary points.

A wording correction was sent: the sharp D* itself has a strict central
maximum and G=40/31. Thus this argument excludes STRICTLY SUBTARGET minima,
not every minimum at/below target. Equality is retained. Noncentral roots,
tied roots and all inverted continua remain outside this conclusion.

## 4. Component births give a valid weaker joint constraint

For a<b and Delta=A_b-A_a>0, the pair overlap edge is present precisely for

    Delta/(b-a+1)<=t<=Delta/(b-a-1),

with the upper endpoint infinity when b=a+1. For Delta<0 it is absent.
Ignore ONLY edge deaths, retaining every birth time tau_ab=Delta/(b-a+1).
This birth-only graph has at most as many components as the actual overlap
graph, at every generic height. When the closed bottom is connected, its
birth graph is connected by1, and Kruskal's component identity gives

    integral_0^1 k_actual(t)dt>=1+sum_{e in an MST}tau_e.

At a true one-bottom stationary point, integral k=1+range(p), so the MST
birth cost is at most range(p). This retains split costs in a VALID direction,
but gives no sharp lower bound49/31. Discarding deaths as equality or assuming
consecutive original-label components in an inverted word would be invalid.

## 5. Opposite nearest calibration and one noncentral tree reviewed

Builder Section10's full five-variable quadratic and SOS were hand-expanded.
The antisymmetric term is exactly (7d^2+2de+3e^2)/4; completing its square
gives (7/4)(d+e/7)^2+(5/7)e^2. The symmetric completion has coefficients
7/4,5/7,17/20 and anchor (8,18,6,18,8)/17. Its value22/17 exceeds40/31
by2/527. Both hull free cuts are feasible, and the restoration duals
(0,1/17),(1/17,0) are feasible ON their nonnegative faces. Thus the same
actual-gradient projection-normality argument applies, including zero flows
and pooled/zero hull faces. These facts are not an unrestricted natural bound.

Builder Section14 completely reduces the specified strict tree
T2=tau>all other T, T4=psi>max(T3,T5). Put D1=2q,D3=a,D5=b,
L=(psi-a)_+,R=(psi-b)_+,c=D4=2psi+L+R. The middle root-right
prefix is never active since c>b; its exposures to4/5 coincide, say f.
The full fits really force alpha23/45 and beta12/34 pooling. Prefix timing
gives psi+f<tau, hence beta34 is separated positively from beta12.
Leaf5 balance separates its positive singleton beta5. Equating that
singleton/34-block difference gives b=a+L+3R, forcing R=0 and
b=max(a,psi). No assumed reflection is used.

For f>0 and a<psi, exact terminal flows give
g=tau-a,f=tau-2psi+a/2, and s3-s4=2(a-psi)<0, contradicting
beta3=beta4 and decreasing alpha. For a>=psi, b=a,c=2psi and
f=tau-psi-a/2. Balances pool alpha2345 into A=v-tau, where
v=a+psi; beta12=B=1-v=q-e, e=(tau-2q)_+,
D2=5tau+e-2v. Each zero-block alternative is checked separately.
If A=0,B>0, the positive beta mean implies q+D2/2=tau with
D2>=3tau, impossible. If A=B=0, tau=v=1,q=e=1/3,
r=7/3, outside the retained cap. If A>0,B=0, the positive alpha
mean implies e=-tau. Finally A,B>0 imply

    tau=14/25,q=6/25,e=2/25,v=21/25.

Far flow requires a>14/25, while strict child closure psi>a/2 gives
a<14/25. Thus f=0, and the exact nearest-even calibration applies.
This proves the specified class bound22/17, NOT the other noncentral trees,
inner ties, arbitrary natural arrays, or any inverted continuum.

## 6. Endpoint-tie central extension: a necessary boundary repair

Section11 extends the central regime to T3=theta>=T1,T5 with strict
T2,T4<theta. Its new mixed face algebra checks: pooling betaALL and
alpha345 gives b=2theta/3,d=7theta/3,c=13theta/3-2a,
B=3a/2-theta,A=1-3a/2. The A>0 mean yields theta=39a/44<a;
the A=0 positive-beta case yields theta=0; its theta=1 zero-beta case
has r=3. Thus the mixed face cannot be a retained competitor.

The strict Section6 star proof does NOT literally carry over unchanged:
its separated beta1/no-left-flow branch inferred u=c and contradicted
u<2theta. An endpoint tie allows u=c=2theta. This needs the following
repair. That equality forces C3=0. The positive alpha12 block and positive
beta23 block have equal means because u=c, so alpha1=beta3. Since
s1=s3, actual balance gives alpha3=beta1. If beta1=0, source3 balance
instead gives alpha3=v/2>0, impossible. If beta1>0, alpha3=delta3.
The strict inner closure T4<theta gives delta4>delta3; the endpoint
inequality T5<=theta gives delta5>=delta3. Alpha2>alpha3 separates
the right decreasing-fit subproblem3..5, whose first fit value is at least
(delta3+delta4)/2>delta3, also impossible. This explicitly removes the
new zero-center-flow boundary without treating a zero-block mean as equality.

The other separated-beta branches retain their strict contradiction because
positive center flow gives c>2theta>=u. The negative one-sided variation
branch u+v=2theta has u<2theta from v>0; increasing the optimized center
terminal T preserves a possibly tied opposite endpoint, and all zero wing
restorations remain zero by the same cross-sum check. Therefore the central
calibration is sound WITH this boundary repair, on the declared endpoint-tie,
strict-inner regime only.

## 7. Exact ordered-maximizer counter, with bottom-component correction

This is a counter ONLY to deriving ordered coverage maximizers from natural
external apex order and the retained range. It is NOT a counter in the whole
retained one-bottom-component domain and NOT a joint global-minimum example.
The earlier message claiming connected bottom was erroneous and is withdrawn.

Set D=71/50, epsilon=1/100000, and freeze four external apices

    A1=D-4+epsilon, A2=0, A5=D, A6=4-epsilon.

These are naturally ordered. Let f_epsilon(a) be the area of triangle3
with apex a intersected with the UNION of those four triangles, integrated
over the whole height interval0<=t<=1. To prove its global maximum exactly,
first take epsilon=0 and use x=z+3t. The four intervals become

    [D-4+2t,D-4+3t], [t,2t],
    [D-2t,D-t], [4-3t,4-2t].

For a>=0 the first interval adds no coverage beyond the third. Indeed
contact with [a,a+t] requires t>=(a+4-D)/3, which is at least
(D-a)/2 since a>=0>D-8/5; its right end never exceeds D-t.
For a<=4/5, the fourth interval's intersection with [a,a+t] is contained
in [t,2t], since first contact requires t>=(4-a)/4>=a.
For a>4/5 retain its extra union coverage rather than summing overlaps.

Direct integration of these piecewise-affine UNION endpoints gives f_0:

    0<=a<=D/4:
      -a^2+(D/2)a-D^2/3+D-1/2;
    D/4<=a<=D-1:
      -a^2/3+(D/6)a-7D^2/24+D-1/2;
    D-1<=a<=D/2:
      a^2/6+(1-5D/6)a+5D^2/24;
    D/2<=a<=4/5:
      (1+2D/3)a-4a^2/3-D^2/6;
    4/5<=a<=2D/3:
      (1+2D/3)a-4a^2/3-D^2/6+(5/8)(a-4/5)^2;
    2D/3<=a<=1:
      a^2/24-(D/3)a+D^2/6+2/5;
    1<=a<=D:
      3a^2/8-((D+2)/3)a+D^2/6+11/15.

For transparency, subtract the exact triple intersection K of triangles2,3,5:
K=aD/6-a^2/12 up to D/4, then
K=D^2/24-(3/4)(a-D/3)^2 up to D/2, then
K=(3/4)(2D/3-a)^2 up to2D/3, and only THEN K=0. Their pairwise
coverage terms are J1(a) and J2(D-a), where Jr(d) is the integral
of [t-|d-rt|]_+. The extra fourth-interval coverage for4/5<a<1 is
(5/8)(a-4/5)^2; for1<=a<=D it is
-(a-1)^2/24+(a-1)/4+1/40. Thus no triple coverage is double-counted.

Outside[0,D] there is no larger maximum. For a<0 only triangles1/5
can meet3; their nonnegative apex distances sum4. The sum of their
two J2's is at most1/3 (on the only common-support branch it equals
-d^2/6+2d/3-1/3 for1<=d<=2, with reflection for2<=d<=3).
For D<=a<=2 only triangles2/6 need be retained, and their summed
coverage is at most a^2/24-a/3+2/3, decreasing on that interval and
less than1/3 at D. For a>=2 only triangle6 can contribute, with
J3<=1/5<1/3. These are valid upper bounds on union coverage.

The left local maximum is at a=D/4, value
M_left=D-1/2-13D^2/48. The third branch is convex and cannot exceed
its endpoints; the last three branches strictly decrease. The fourth
branch is strictly concave, with its unique maximum at

    a_*=(3+2D)/8=73/100,
    M_right=(9+12D-4D^2)/48=5617/15000.

The exact margin M_right-M_left=23/40000>0. At a=D/2 the loss
from M_right is1/1875. Consequently outside(.72,.74), f_0 is at
most M_right-1/7500; this follows from the fourth-branch quadratic
loss (4/3)(.01)^2 and the larger losses on all other branches.

Shifting each external triangle by epsilon changes its symmetric-difference
area by at most2epsilon. Thus |f_epsilon-f_0|<=4epsilon uniformly
over ALL a. Since1/7500-8epsilon>0, every perturbed global maximizer
lies in(.72,.74). Within that window triangle1 is absent, and the shift
of triangle6 adds precisely the bottom wedge

    1-epsilon/4<=t<=1, width4t-4+epsilon,

with area epsilon^2/8, independent of a. Triangle5 does not cover that
wedge. Hence f_epsilon=f_0+epsilon^2/8 throughout the window, proving
that a_*=73/100 is still the UNIQUE GLOBAL coverage maximizer.

Reflection x->D-x interchanges labels j and7-j and maps apex a toD-a;
the external union is invariant. Therefore triangle4's unique global
maximizer is b_*=D-a_*=69/100<a_*. The two individual maxima invert.

At those two placements the complete apex word has ONLY the adjacent
inversion3/4. Offsets are

    p1=-179/50+epsilon, p2=-2, p3=-227/100,
    p4=-331/100, p5=-179/50, p6=-2-epsilon.

Its range79/50 is between79/61 and49/31; min p5 and max p2 are
unique, with slopes5 and2. BUT THE BOTTOM IS DISCONNECTED:
triangle4 ends at-231/100, triangle3 starts at-227/100, leaving
the open gap(-231/100,-227/100) of width1/25. External triangles1/5
end near-129/50, while2/6 start near-2, so neither side bridges it.
There are two bottom components. This exact correction is indispensable:
the example does not refute an ordering theorem using connected bottom
and genuine global stationarity. That stronger coupling remains unproved.

## Outcome and ledger

R116-2: the new natural first-derivative/projection/flow implications and scoped
stationary calibrations have been hand-challenged and found sound within
their declared scope, with the endpoint-tie boundary repair above. A precise
counter shows why aggregate constraints do not supply sharp calibration.
Ordered coverage maximizers fail under natural external order/range alone,
but the displayed counter has TWO bottom components. The ordering/coupling
needed on the retained connected-bottom domain is still OPEN.

R116-1: NOT CLOSED. No complete natural complementary inequality, twelve-word
inversion exclusion, or universal target floor has been proved. The accepted
C theorem and all predecessor evidence remain unchanged.

Mathematical processes0, seconds0, failed mathematical starts0. Ordinary source
reads, clock reads and this new Markdown patch only. Missing-directory discovery
reads produced no mathematical data. No samples, code, enumeration, LP, replay,
optimizer, UI/API/Git/build/install/scratch output or predecessor edit. Nothing
was deleted; no mathematical process is running.

Tiếng Việt: kiểm tay xác nhận các phương trình luồng và phép chiếu của diện tích
thực trên miền tự nhiên, kể cả khối gộp/khối0 và đạo hàm bậc nhất ở đáy. Đã chỉ
ra bằng phân số chính xác rằng bỏ năm phương trình dừng riêng lẻ rồi chỉ giữ
tổng thời gian sẽ không đủ cho cận sắc. Với cặp đảo, cực tiểu toàn cục buộc từng
tam giác tối đa hóa phần giao với TOÀN hợp bốn tam giác còn lại; vẫn chưa chứng
minh được định lý ghép các vị trí tối đa hóa trên cả12 miền. K6 toàn cục vẫn MỞ.
