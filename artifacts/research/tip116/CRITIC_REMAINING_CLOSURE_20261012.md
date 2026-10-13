# TIP116 continuation — independent whole-union critic

STATUS: PARTIAL / universal all-real finite K6 F6>=20/93 OPEN.
Direct continuation of R116-1..3, activated2026-10-12 01:10:02UTC;
hardstop02:10:02UTC. Mathematical subprocess grant0. The frozen116 proof,
report and completion bytes are not edited. This is hand review, not formal
or external acceptance. Vibecode Kit and its report reference apply.
Mathematical derivation stopped on Main's explicit PARTIAL routing at
2026-10-12 02:03UTC; only completion and scope-wording checks follow.

## 1. Whole frozen-union inversion condition retained

For any inverted adjacent apices a=A_i>b=A_(i+1), let O be the UNION
of the other four triangles. The old pair is disjoint at every height.
At a global minimum each member separately maximizes its WHOLE-UNION
coverage c_i(a),c_(i+1)(b), not merely its pairwise coverage sums.
Writing M_j=max c_j and q(v,w)=|(T_i(v) intersect T_(i+1)(w))\O|,
global minimality requires

    sup_(v,w)[c_i(v)+c_(i+1)(w)+q(v,w)]=M_i+M_(i+1).

Thus every pair of individual global maximizers has q=0. A strict joint
gain excludes the inversion even if there are no ordered individual maxima.
The frozen predecessor's unique inverted-maximizer example defeats ordering
from external natural order/range alone, but has TWO bottom components.
It is not a retained-domain counter or a joint global-minimum counter.

There is a valid conditional strict JOINT descent if the two maximizing
sets intersect at an apex x distinct from every O apex. At that common
maximum, both outside-area costs U_+,U_- are C1 with zero derivative.
Choose new apices x-epsilon for i and x+epsilon for i+1. Their individual
cost losses are o(epsilon), whereas their outside-O overlap is
2epsilon*L(x)+o(epsilon). Here L(x)>0: finitely many other distinct apices
leave the co-moving vertical line x exposed for a positive initial-height
interval. Thus the joint outside-union cost strictly decreases.

If x equals an O apex, parallel adjacent edges can make an individual
cost nonsmooth. The C1 shortcut must NOT be used there; the accepted
collision-face exclusion supplies the separate argument. Nothing here
proves the required intersection of the two maximizing sets on the
remaining connected-bottom/full-stationarity domain.

## 2. Exact finite-swap exposure identity, including its early-height term

Use x=z+i t, so the old pair is [a,a+t] and [b-t,b], and put
E(x,t)=1-1_(O_t)(x) in these coordinates. Define union-level exposures

    L(x)=integral_0^1 E(x,t)dt,
    P_+(x)=integral_0^1 E(x+t,t)dt,
    P_-(x)=integral_0^1 E(x-t,t)dt,
    S(x)=P_+(x)+P_-(x)-L(x).

The actual isolated-triangle derivatives at the old inverted positions give
P_+(a)=L(a),P_-(b)=L(b). They do NOT give S>=0 throughout[b,a].
At a common stationary apex only, S=L>=0. Transferring the latter conclusion
between two distinct stationary apices would discard the nonlocal coupling.

Let u=a-b>0 and swap the apices. The new pair's overlap outside O is

    q(b,a)=integral_0^1 integral_(max(b,a-t))^(min(a,b+t)) E(x,t)dx dt,

where an empty inner interval contributes0. Set

    R_u=integral_0^u [ integral_b^a E(x,t)dx
                      -integral_(max(b,a-t))^(min(a,b+t)) E(x,t)dx ]dt.

The second inner interval is contained in[b,a] for t<=u; it is empty
for t<u/2. Hence exactly

    G_old-G_swap = integral_b^a S(x)dx-R_u,
    0<=R_u<=3u^2/4.

Proof: outside-O area of triangle i is U_+(x)=integral integral_x^(x+t)E;
that of triangle i+1 is U_-(x)=integral integral_(x-t)^x E. Therefore
U_+'=P_+-L and U_-'=L-P_-. Subtract the swapped union area, counting
its outside-O overlap ONCE, to get
integral_b^a(P_++P_--2L)+q(b,a). For t>=u the lens is exactly[b,a],
so q=integral_b^a L-R_u. The bound on R_u is
u*(u/2)+integral_(u/2)^u(2u-2t)dt=3u^2/4.

This is a whole-height exact variation, with all coverage multiplicities and
the low-height correction retained. A sufficient strict descent criterion is
integral_b^a S>R_u. No proof of that sign on all remaining continua is claimed.
In particular a positive collision coefficient by itself does not establish
the finite swap: the R_u term cannot be silently omitted.

There is also an important integrated direction check. Separate GLOBAL
optimality of the old inverted placements gives U_+(a)<=U_+(b) and
U_-(b)<=U_-(a). Therefore

    integral_b^a P_+<=integral_b^a L,
    integral_b^a P_-<=integral_b^a L.

These are UPPER, not lower, exposure bounds, and imply integral S<=integral L.
Whole joint global minimality additionally requires integral S<=R_u.
Consequently integrating the individual-optimality inequalities does not
by itself prove the needed strict finite-swap descent. Their signs cannot
be reversed or their two different maximizing apices identified.

## 3. What connected bottom really supplies; correction preserved

Since the old pair leaves the corridor[b,a] vacant in the above coordinates,
one bottom component implies O_1 covers the ENTIRE corridor. Equivalently,
for EVERY x in[b,a] some external interval covers x at t=1. For a lower
source of relative label distance r, its center-ray band is
[d/(r+1),d/r]; covering x at1 requires r<=d<=r+1. Higher sources
have the reflected formula. Thus this is a joint union-band restriction,
not an independent distance lower bound on each source.

An initially sent stronger statement was wrong and is WITHDRAWN: connectivity
does not require one external interval to cover the whole inner gap. A chain
of two overlapping external intervals may bridge it. Write old bottom starts
p_(i+1)=v,p_i=v+1+u. One valid midpoint consequence is that some external
start belongs to[v+u/2,v+1+u/2], because it covers the gap midpoint
v+1+u/2. There are also coverings of each gap endpoint, possibly by different
sources. The stronger band[v+u,v+1] for one source is not justified.

The universal estimate of the preceding exact finite-swap expression under
this connected-bottom restriction, retained apex words, and actual GLOBAL
minimality/full stationarity remains the inversion obstruction. The old
disconnected counter cannot replace this missing implication.

### 3A. Same-direction bound is valid; a stronger pointwise route fails

Normalize p_min=0,p_max=r and write y=x-i in the inverted corridor,
so1<=y<=r. Every lower-source SAME-direction ray band starts at
t=d/m=1+(y-p_k)/m>=1-(r-y); its union therefore has length<=r-y.
The reflected higher-source SAME-direction union has length<=y-1.
Their total length is at most r-1. The opposite-ray bands must still be
counted as UNIONS with these late bands; discarding their overlaps is lossy.

The sufficient pointwise estimate S(x)>=3u/4 is TOO STRONG even with all
retained geometric filters. This is not a counter to a global-minimum claim.
Let r=79/50,u0=r-1=29/50, epsilon=1/1000 and set

    p=(r,u0+epsilon,r-epsilon,epsilon,1-epsilon,0).

Its sole adjacent apex inversion is3/4; the external apices are strictly
ordered1<2<5<6. Its inversion width is u=u0-2epsilon. Bottom starts are
0,epsilon,u0+epsilon,1-epsilon,r-epsilon,r, so all successive gaps are<1.
Min6/max1 are unique, range79/50 is retained, and both depth slopes are6.
No actual-gradient or global-minimum claim is made.

First take the epsilon=0 limit to compute S at the corridor midpoint.
The lower external fan (labels1/2) has common apex2+u0 and the higher fan
(labels5/6) common apex6. Their separation is D=4-u0. In pair co-moving
coordinates translated by the lower apex, O_t is the UNION of
[t,3t] and[D-3t,D-t]. The pair apex corridor is[2-u0,2], midpointD/2.
There C occupies[D/6,1], while each outer ray is occupied on
[D/8,1]: its early and late bands touch atD/4. Consequently

    S(mid)=1+(1-D/6)-2(1-D/8)=D/12=57/200,
    3u0/4=87/200.

Shifting source2 up and source5 down by epsilon changes their three ray
bands' endpoint lengths by a total at most7epsilon; union symmetric
differences are bounded by the corresponding sums. Thus at epsilon1/1000,
S(mid)<=57/200+7/1000<3(u0-2epsilon)/4. The strict example above inherits the
failure without an excluded external apex collision or bottom disconnection.

The example does NOT refute an averaged finite-swap inequality. Indeed in
the unperturbed fan limit, for corridor coordinate d in[2-u0,D/2],
S(d)=3D/4-4d/3 and the other half is reflected. Thus
integral S=u0/3+u0^2/4, exceeding the crude early correction3u0^2/4
when u0<2/3. A low midpoint coefficient cannot justify abandoning the joint
gain route, just as positivity at one collision cannot prove a finite swap.
This diagnostic is used only to reject the stronger pointwise inference.
Correction log: an initial strict perturbation moved sources1/6 instead;
that would make bottom extremes4/3 and depth2, failing the retained depth
condition. It was discarded in favor of the displayed sources2/5 perturbation,
whose min6/max1 and depth6 genuinely satisfy that necessary filter.

## 3B. A second exact WHOLE joint-global condition: group correlation

For any label cut i, let L be the UNION of triangles1..i and R the
UNION of triangles i+1..6. Translating ALL left-group apices by h
preserves both group areas exactly. Hence an actual all-space global
minimum must satisfy

    C_i(h)=area((L+h) intersect R)<=C_i(0) for every real h.

Indeed G(h)=area(L)+area(R)-C_i(h). A strict gain in this WHOLE
union correlation is an admissible full-space descending variation.
It is not a sum of pair intersections, and does not require the translated
competitor to preserve the necessary retained-domain filters.

This supplies an independent joint test beyond separate frozen-O maxima.
It does NOT yet exclude an inversion: I did not prove that the maximizing
relative alignment of the two nonconvex group unions is naturally ordered
under the bottom/range/full-stationarity conditions. The group unions may
have height-dependent holes or disconnected slices, so treating them as
convex triangles, invoking log-concavity without its hypotheses, or replacing
their overlap by summed pair overlaps would discard actual contributions.
No group-translation descent theorem is asserted.

## 4. Universal natural residual identity independently verified

Using TWO full hull cones and FIVE full prefix-flow cones gives exactly

    G=Q_full-sum_7 E_k,
    Q_full=3-S_D+3 sum D_i^2-(5/12)S_D^2, S_D=sum D_i,
    E_k=.5 dist_(W_k)^2(z_k,K_k), z_k=c_k+A_k D.

For two actual full stationary natural points D and the accepted sharp D*,
put p_k=P_K z_k,n_k=z_k-p_k, and star the anchor quantities. The exact identity
is

    2(G(D)-G(D*))
      =sum_k[-<n_k,p_k*>_(W_k)+<n_k*,p_k>_(W_k)].

Hand derivation: cone orthogonality gives grad E_k dot D
=2E_k-<n_k,c_k>. Pair actual stationarity with D to obtain
2G=6-S_D-sum<n_k,c_k>. Compare both stationary gradients and pair their
difference with D*; use anchor stationarity paired with D-D*. Substitution
cancels <n_k,n_k*> and yields the displayed formula. The first summand is
nonnegative and the second nonpositive. Both survive; the second cannot be
discarded because the unrestricted full-flow anchor is infeasible.

At D*=(25,11,34,11,25)/31 the full hull residuals are
n_alpha*=(-14,14,-23,23,0)/62,
n_beta*=(0,23,-23,14,-14)/62. The anchor-negative hull term is

    -[14(alpha1-alpha2)+23(alpha3-alpha4)
      +23(beta3-beta2)+14(beta5-beta4)]/62.

The actual anchor flow rows have f12=f54=1/31,f32=f34=3/31 and
all other exposures0. Their weighted residuals W n_i* are:
row1 to(2,3,4,5): (0,-44,2,-26)/62;
row2 to(1,3,4,5): (-39,-57,-11,-39)/62;
row3 to(1,2,4,5): (-22,0,0,-22)/62;
rows4/5 are the reflected rows2/1. These retain ALL farther flows.
The criterion is equivalent stationary scalar coupling, not a pointwise
inequality and not a completed natural or global K6 proof.

## 5. Builder's strict root2 / strict right-subtree3 proof reviewed

The new Builder continuation Section2 is sound within its exact hypotheses
T2>all others,T3>max(T4,T5), including T4=T5. Its left leaf balances and
strict beta2<beta3 boundary genuinely force alpha2=alpha3. If T4>T5,
the two strict increasing singleton boundaries make the exact input difference
2(T4-T5)+ell incompatible with the actual balance T4-T5-ell.

Under T5>=T4, c=D3>D4 eliminates the root2 one-edge right prefix, so its
exposures to3/4 coincide f, with h to5<=f. Full alpha234 pooling and
beta45 pooling retain zero blocks. The beta345 case forces psi=3v,ell=v,
then s5-s4=f-h+theta-3v-k>0, contradicting alpha5<=alpha4. Otherwise
the positive beta3 singleton and positive beta45 actual mean give

    A=theta+g+k-f=psi-f-g-ell/2,
    psi-theta=2g+k+ell/2>=0,

contradicting strict theta>psi. Neither A nor beta12 was assumed positive.
This excludes that entire strict class and its reflection, not global-max
ties, subtree5, endpoint roots, arbitrary natural arrays, or inversion.

## 6. Adjacent global-max ties and tied maxima2/4 independently reviewed

The FULL Main Sections2/3 and Builder Sections3/4 were read. The adjacent
global-max tie exclusion is accepted within the natural competing-minimum
domain, using Builder's simpler global polar squeeze rather than an assumed
generic perturbation. Equal source balances and one input violation force
BOTH full fits to pool the tied entries; equal inputs also cannot support a
strict fit boundary by the endpoint block bounds.

For perturbation D_k+h,D_(k+1)-h, only alpha-prefix residual P_k changes
by-h and beta-suffix residual S_(k+1) by+h. If P_k<0 choose h<0;
if S_(k+1)<0 choose h>0. A sufficiently small variation preserves ALL
polar inequalities and orthogonality because the fitted pair entries agree.
Thus both ACTUAL full fits and hull values stay fixed. Any prefix containing
a maximal cut has intercept at least(m+1)theta while its donor terminal is
at mosttheta, a fixed inactive margin at leasttheta. Other restorations do
not depend locally on either varied D, and the two source restorations have
only their own D dependence. Their raw-minus-restored second derivatives
are exactly -1/(2+l_i), with the actual one-sided terminal slopes at switches.
Full stationarity kills the first variation. The resulting strictly negative
second variation is physical: theta<=r/2<=49/62<1, so every closure and
the perturbed closures lie strictly below the bottom.

If both polar residuals are tight, neighboring inequalities give
delta_k>=alpha_k>=delta_(k+1)>=beta_k>=delta_k, so their common
value is a. On the left of this boundary, decreasing alpha>=a and increasing
beta<=a. Tight P_k gives sum_left delta=sum_left alpha>=ka, while
global beta polar together with tight S_(k+1) gives
sum_left delta<=sum_left beta<=ka. Hence both fits on the left are a.
The reflected right inequalities do the same on the right. Both full fits
are globally constant a, and total residual is0. Prefix and suffix polar
inequalities then give opposite inequalities for every prefix, forcing
EVERY delta_i=a. Actual closure and stationarity imply D_i=2/3,
theta=1/3,r=5/3>49/31. This treats all four adjacent locations and
any additional tied maxima without silently replacing a tie by a strict tree.

For T2=T4=max T, barriers leave cuts1/3/5 with no outgoing flow, and
permit only nearest flows at2/4. Source D's dominate the adjacent leaf D's,
forcing the opposite-alternation full-hull subspaces. Therefore the reviewed
nearest-even exact stationary calibration applies with all clamps and
pooled/zero faces, giving G>=22/17>40/31. It does not close other nonadjacent
maximum sets, strict endpoint roots, or any inverted order.

## 7. Further natural claims hostile-checked, with their exact scopes

Builder Section5's actual local identity at D0=(12,12,30,12,12)/23
is sound. At the two equal wing-input switches, hull loss d_-^2 and
restoration gain d_+^2 sum to d^2; the raw term leaves d^2/2, and the
right reflection does the same. Its remaining completed squares expand
with coefficients3,23/108,13/3 and strict positivity in all five directions.
Thus this is a genuine STRICT actual local minimum WITH farther flow,
but outside the competing range. An unqualified nearest-only rule for all
local minima is false; it cannot be used to close the subtarget domain.

Section6's endpoint-max necessary bound retains clipping correctly.
If theta>=5/6, both first hull fits are0, source stationarity gives theta=1,
and the resulting bottom minimum at label1 violates the retained depth filter.
Otherwise beta1>=theta/5>0, so its positive first-block mean is at most
delta1. Therefore (11/5)theta+C1<=1 and theta<=5/11. This is a
source restriction only, not an endpoint-root exclusion or target floor.

Section7's ENTIRE stated one-donor strict root2/subtree5 class checks out.
The three right prefix formulas and f5=0 projection contradiction are exact.
The alpha5 zero case, alpha45 pooling alternatives, and ensuing overlapping
alpha234/beta345 blocks retain all positive/zero and no-flow faces. The
nearest/no-far negative variation handles the exceptional v=2theta leaf
contact by reversing h; its beta suffix slack is genuinely strict and all
other closure margins then improve. The r>2tau argument gives tau<1,
so no omitted physical-tail curvature enters. Its sole remaining necessary
stationary vector has the exact647 denominators recorded by Builder and
r=1047/647>49/31. A harmless algebra typo was caught in the original
Section7.4: P3=v-f4-psi, not v+f4-psi. All phases used there have f4=0,
so neither the slack nor the argument changes. This class does not exclude
extra donors3/4/5 in the full subtree5 regime.

Section8's mixed nearest2/5 calibration is valid. Its symmetric matrix A,
weighted strict diagonal dominance margins(12,2,6,8,24), and free anchor
(8,22,10,4,14)/17 were independently checked. A times its integer anchor
numerator is204 times the all-one vector; the free minimum is22/17.
The included full hull optimizers and included restoration exposures are
feasible, including the zero multiplier at cut2's right neighbor. The anchor
is NOT an actual stationary configuration: omitted source3 and farther source2
restorations activate. This does not invalidate normality calibration, which
requires only free Q-criticality and feasibility in the INCLUDED cones.

Section8.1's actual strictroot2/subtree5 NEAREST reduction genuinely forces
the stated mixed hull subspaces. The alpha4 singleton case contradicts equal
beta45 if both end fits are positive; with alpha5=0, separate and pooled
positive beta means exclude ell>0, while ell=0 gives either a zero mean
contradiction or r>5/3. Thus alpha234 pools and the conditional floor22/17
applies. This does not establish nearest-only on the remaining full domain.

## 8. Whole strict root2/right-root5 weak right-order exclusion

Main Section5, with the explicitly corrected Section5.4 replacing ONLY the
coarsened equal-wing branch, survives independent hand review. Its scope is
an actual competing stationary minimum with T2=tau strictly greater than
all other closures, T5=psi strictly greater than T3,T4, and T4>=T3.
All possible right-subtree donors are initially included; this is not a
nearest-only hypothesis. The prior one-donor result remains a dependency.

For y=T4>x=T3, actual balances and the pooled beta34 require
s3-s4=y-x-(f3-f4)-ell>=0, with ell=[y-2x]_+.
If source5 is active, its exposures into3/4 agree and D5>D4>D3.
The exact root2 exposure difference [min(tau,D4)-D3]_+ makes this
balance strictly negative in both ell branches. Thus source5 is inactive.
If ell>0, alpha45 pooling excludes D4>=D5; the same balance forces
tau<D4 and tau<=3x, so f4=f5=0. Actual beta345 means exclude alpha5=0.
The two remaining positive alpha subspaces give either the exact stationary
candidate (q,tau,x,y,psi)=(11,22,8,17,18)/47 with r=76/47>49/31,
or the coarse equations whose e=0 and e>0 solutions violate y>2x.
I checked every stated equation and the actual means giving them, rather
than only substituting the final candidate.

For x=y=t and active source5, equal hull fits at3/4 and the beta45 pool
force tau<=3t, f5=0 and beta3>beta2. The alpha5 zero case contradicts
its actual beta345 mean. In the separated alpha234/{5} branch, the
positive means force the stated fractions over32087 and psi-2t<0.

The original draft's further conclusion alpha5=delta5 merely from
alpha5>0 was WRONG when alpha2345 is pooled. Its old coarsened equations
are withdrawn, not accepted. Section5.4 correctly replaces them: with
tau=3t, the ACTUAL means are

    A=1-2t-psi-e/4, E=1-4psi/3.

Source5 gives24t+16psi+3e=12. Source2 and the left leaf give
beta12=psi-t+e/4>0 and q=psi-t+5e/4. The actual beta12 mean gives
psi+t+e=1/2. Together these imply8t-13e=4, so t>=1/2; yet psi>2t
and the preceding sum imply t<1/6. This is a valid pooled-block
contradiction without replacing any fitted pooled entry by its own input.

Hence the ENTIRE stated strict weak-right-order class is excluded after
the repair. The T3>T4 class, other maximal sets/endpoint roots, and all
inverted actual-minimum configurations remain outside this result.

## 9. Strict root2/right-root5 opposite order: two arithmetic repairs

Main Section6 covers x=T3>y=T4 with actual C3=x-2y>0. Its exact
whole-envelope barriers force source5 farther exposure h=0 and root2
farther exposure k=0; the actual source balances then give psi<=3y and
f<=3y-x. The alpha234 pool and the separated/coarsened beta345 and
alpha5 alternatives retain all zero-fit faces. I checked the whole derivation
and every branch equation, finding TWO further erroneous arithmetic lines.

In Section6.1, B=f=0 gives e=tau/3 and tau=1-2x+2y. Substitution
in the ACTUAL alpha mean gives13x-4y=2, NOT the earlier11x-2y=1.
Together with21x-37y=1 this gives x=70/397,y=29/397 and
psi=130/397>3y=87/397. Thus the branch remains excluded, but by its
actual beta order. An intermediate message of mine misstated the resulting
x numerator; it was immediately corrected before acceptance.

More importantly, Section6.4's B>0,e>0 coarsened case does NOT give
negative e. The displayed actual equations instead give

    x=868/2523, y=294/2523, e=82/2523,
    tau=1316/2523, B=535/2523, q=617/2523, psi=882/2523.

Here r=3977/2523<49/31, so a range contradiction is unavailable.
This is NOT an actual stationary candidate: the proposed alpha2345 fit
violates its full cone polar inequality. Indeed

    D=(1234,2742,2016,588,2058)/2523,
    delta=(1289,-219,507,1935,465)/2523,
    alpha=(1289,672,672,672,672)/2523,
    P4=(-219+507+1935-3*672)/2523=207/2523>0.

The required decreasing-cone prefix polar is nonpositive. Thus this branch
is excluded by genuine full-hull infeasibility, NOT by the withdrawn e<0
calculation. The remaining Section6.1 positive-e stationary candidate has
r=133567/83391>49/31; all other Section6.2–6.4 branches contradict
their actual source order or left-flow clamp. Section6.5's separately
preserved zero-e correction also checks. With these explicit repairs,
the ENTIRE declared positive-C3 strict tree class is excluded.

## 10. Remaining strict root2/right-root5 class independently checked

Main Section7 covers x>y with C3=0, so x<=2y, and active source5.
The initial whole-envelope reduction is valid: source5 farther h>0 makes
s3-s4=x-y>0, contradicting pooled alpha34. Root2 farther k>0 would
make s4-s5=x+4y-3psi<0 because psi>2y and x<=2y. Thus all initially
possible farther flows are removed by ACTUAL balance, not assumed absent.

A positive beta3 singleton forces psi=2(x-y)<=x, violating strict
subtree root5. Therefore beta345 pools, psi=x+y, and its actual mean
gives E=1-5x/3-y. Actual stationarity gives alpha5=2x/3>0; it is
called delta5 ONLY in the separated alpha234/{5} branch.

In that separated branch,11x+3y=3 and the actual left/root block equations
exclude f=0 in both B=0 and B>0 cases, retaining e=0/e>0 separately.
With f>0, they force B=17x/3-1, tau+e=3B, e=B/4 and tau=11B/4.
The positive beta12 mean is63B/8=1+x+y, giving
x=237/1135,y=266/1135, contrary to x>y.

For alpha2345 pooled, f=y and tau=x+2y. Its ACTUAL mean is
29x+27y+3e=12 and B=1-5x/3-2y. B=0 forces negative x;
B>0,e>0 forces x=12y, contrary to x<=2y; and B>0,e=0 forces
x=15/34,y=-1/34. Each equation was independently hand-checked.

Combining Sections8–10, the repaired Main Sections5–7 and the prior
reviewed WHOLE one-donor result exclude the ENTIRE strict global-root2,
strict right-subtree-root5 class and its reflection. This does NOT settle
other subtree ties, endpoint roots, nonadjacent global maximal sets, or
any inverted configuration. The universal committed target remains OPEN.

## 11. Nonadjacent global maxima2/5: actual tie face checked

Main Section8 survives hostile review on T2=T5=tau=psi>max(T1,T3,T4),
and its reflection. The repaired Sections5–7 inequalities require only
tau>=psi apart from the explicitly treated equal-wing exception. Strict
inner psi>x,y keeps the beta2/3 boundary strict in all other reductions;
the Section7 f=0 case is actually included, not discarded by a strict-root
shortcut or a generic perturbation.

In the one-donor theta<v case, tau=theta+v may now equal psi. Under
D3+h,D4-h, the terminal source5 two-edge intercept is EXACTLY constant.
Thus its new zero-envelope contact stays zero. The nearest4 margin is
strict because psi=theta+v<2v; the root2 farther SWITCH is also atD4=2v,
not at its two-edge average. The reviewed one-sided negative variation,
including h>0 at v=2theta, retains all actual contact contributions.

For the exceptional equal-wing psi=tau=3t, actual balances and data
violations genuinely force full beta constant B and alpha2345 constant A.
With D2=8t+e,D3=D4=2t,D5=8t, A=0 would imply2q+5t+e=0.
For A>0, the actual mean gives A=1-5t-e/4, B=2t+e/4 and
q=2t+5e/4. The left clamp forces e=0; the FULL positive beta mean
gives t=5/34,q=10/34,A=9/34. Its actual alpha2345 prefix polar
N4=15/34>0 is infeasible. This is a valid tie exclusion, not a claim
that the old separated beta12 means survive a merged face.

Therefore global maximum set{2,5} and reflection{1,4} are excluded.
Strict global root2 with right-subtree maximum sets{3,4},{3,5},{4,5},
or{3,4,5} is NOT covered by the unique right-subroot3/4/5 proofs.
These original tie faces remain open, as do endpoint global roots,
maximum set{1,5}, and the inverted orders. No genericity transfer is
accepted. The universal target remains OPEN.

## 12. Original two-way right-subtree ties below strict root2

For T3=T4=theta>T5=psi and T2=tau>theta, I independently derived
a whole original-tie exclusion before seeing a saved Main version.
Barriers give C3=0,D3=2theta,C4=ell=[theta-2psi]_+,D4=2theta+ell,
D5=2psi. The root2 prefix hull skips lengths1/2, so all three right
exposures equal f=[tau-(D3+D4+D5)/3]_+. Equal s3,s4 and input
violations force alpha345=A. Since s5>s4 and s3>s2, beta5 is a
positive singleton and beta34 a separate positive block.
If ell=0, their actual means/balances give A=theta-f=psi-f,
contradicting psi<theta. If ell>0, they give
A=3theta/2-psi-f=3psi-theta-f, forcing psi=5theta/8 while
ell>0 requires psi<theta/2. No f-zero or clipped alpha face was omitted.

Main Section9 was FULLY read and independently checked for original
T4=T5=theta>T3=x under strict root2. Its ell=[theta-2x]_+ envelope,
all skipped-prefix f/g formulas, exact g=0 reductions, and both separate
alpha23/45 and coarsened alpha2345 means are sound. For ell>0 the
separate candidate has r=131/81>49/31; coarsened positive/zero B and
e alternatives contradict source order. For ell=0, all f-zero/positive,
B-zero/positive and e branches contradict either theta<=2x, theta>x,
or the actual left-flow clamp. The proof keeps C=alpha45>0 derived from
stationarity, not assumed positivity. This ENTIRE original tie is accepted.

Builder Section12 was FULLY read and checked for original
T3=T5=eta>T4=v under strict root2. Exact envelopes are
g=[eta-2v]_+,D3=D5=c=2eta+g,D4=2v,
f=[tau-(c+2v)/2]_+,h=[tau-c]_+. The beta2/3 boundary is strict.
For g>0, the separate beta3 case forces eta=2v; the pooled case
forces eta=3v,f=0 and alpha2345=7v/3. All left B/e faces then
contradict the terminal threshold or the actual alpha prefix polar.
For g=0,tau<2eta, the actual separated alpha5 mean and left means
give tau<=eta. For tau>=2eta, coarsened positive alpha gives the
free scalar s=2eta+v. Its zero-e clamp fails; positive-e forces
s=21/25,tau=14/25, but tau>=2eta and eta>v give opposite
inequalities eta<=7/25 and eta>7/25. Coarsened A=0 uses NO
positive-alpha mean and gives either negative e or r=7/3.
Every stated zero/contact and coarsening alternative was checked.

These direct exclusions remove the three TWO-WAY right-subtree maximum
sets{3,4},{4,5},{3,5}. Builder Section13 was then FULLY read and matched
my original independent tie3/4 argument, also pooling alpha23 since D2>D3.
No genericity transfer is made.

## 13. Original all-three right-subtree tie reviewed

Builder Section14 was FULLY read and checked for strict global root2
with T3=T4=T5=theta. Barriers make all right restorations zero and
root2 sends equal f=[tau-2theta]_+ to all three cuts. Data and balances
force actual alpha2345=A and beta345=E, with beta3>beta2 and E=1-2theta.
Actual stationarity gives A=theta-f>=0,B=1-tau-A,q=B+e.

For A>0,f=0, its ACTUAL mean10theta+2tau+e=4 and every B/e face
give either a forbidden source order or the active-e candidate
theta=7/25,tau=14/25,q=6/25 with r=41/25>49/31. For A>0,f>0,
the ACTUAL mean14theta+f+e=4 and positive beta12 mean exclude e>0;
the zero-e candidate theta=11/39,f=2/39,tau=24/39 violates its
actual clamp tau<=2B=12/39. B=0 is impossible in that positive face.

For A=0, NO positive-alpha mean is used. Here f=theta,tau=3theta,
B=1-3theta. A positive beta12 mean gives negative e; B=0 gives
theta=1/3,tau=1,q=e=1/3 and r=7/3>49/31. Each actual branch
and denominator was independently checked. Thus the ENTIRE original
triple tie is excluded, with its reflection.

Together the accepted unique-root and original-tie proofs now cover all
right-subtree maximum sets under strict GLOBAL root2 (and reflection4).
This is a classification of actual competing minima, not a pointwise area
bound on arbitrary natural arrays. Endpoint global roots1/5, global
maximum set{1,5}, any unresolved natural boundary/minimum-attainment
steps, and all twelve inverted continua/faces remain OPEN. The frozen
global-root3 endpoint-tie extension must be separately retained in the
coverage audit, not silently replaced by a strict-root statement.

## 14. Global natural maximum-set coverage audit

I reread FULL frozen Builder Section11, including its explicit11.1 repair.
Its mixed endpoint-tie actual block means and the exceptional zero-C3 star
repair check. In the mixed face, the positive alpha345 mean gives
theta=39a/44<a; the clipped mean uses the positive full beta block only
when theta<1, and theta=1 uses r=3 instead. The star zero-C3 repair does
not reuse the withdrawn strict u<2theta contradiction: it proves u=c=2theta,
then actual balances and the decreasing projection on3..5 contradict the
strict inner timing. Parallel-edge/contact and zero-block distinctions remain.

Therefore, on the accepted retained NATURAL positive-cut actual-minimum
domain, the central-max proof covers global maximum sets
{3},{1,3},{3,5},{1,3,5}, with strict inner2/4. Adjacent global maxima
are excluded. The reviewed strict root2/right-subtree proofs cover{2}
and reflection{4}; the nearest-even calibration covers{2,4}; the original
tie continuation covers{2,5} and{1,4}. The remaining global-max sets
are EXACTLY{1},{5},{1,5} within that domain.

This is not a verification of all boundary/minimum-attainment reductions,
nor of any inverted continuum. Those accepted upstream reductions must
remain explicit in a whole theorem. No natural-region or combinatorial
coverage percentage substitutes for the committed all-real finite floor.

## Ledger

Ordinary source/clock reads and this NEW Markdown patch only. Mathematical
subprocesses0, seconds0, failed starts0. No samples, optimizer, LP, code,
enumeration, replay, UI/API/Git/build/install/copy/deletion or extra agents.
An initial oversized aggregate historical read was truncated; latest active
and handoff checkpoints, continuation scope, charter and skill/report sources
were reread separately. The invalid single-bridge assertion above is preserved
as a correction, not used as closure evidence. Three ordinary patch contexts
failed before their corrected patches; no mathematical process was started.
One ordinary source lookup used an incorrect frozen Builder filename and
returned not-found; rg --files supplied the observed name before the full
requested section was read. No forbidden process or old-file edit occurred.
After mathematical STOP, the complete new continuation report was read
for wording only. Its retained natural-domain qualifications, exact endpoint
maxsets, explicit upstream dependencies and12 inverted OPEN labels pass.
Minor editorial file-location/reduced-mean suggestions were sent to Main;
no additional derivation or universal acceptance occurred.
