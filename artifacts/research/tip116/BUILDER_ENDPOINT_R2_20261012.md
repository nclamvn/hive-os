# R116 continuation R2 — whole endpoint-max proof attempt

Status: OPEN/PARTIAL. Same all-real finite K6 target G>=40/31,
F6>=20/93. Hand-only envelope02:16:07–03:16:07 UTC, mathprocessgrant0.
All predecessor116 and first-continuation files remain frozen.
This note targets actual retained natural positive-cut competing minima
with global closure-max sets{1},{5},{1,5}, not arbitrary natural arrays.

## 1. Exact retained equations and proof debt

Let D_i>0, delta_i=1-D_i, alpha=P_dec_nonneg(delta),
beta=P_inc_nonneg(delta), s=alpha+beta. Actual exposure flows F_ij
and closure times T_i satisfy

    D_i=2T_i+C_i, C_i=sum_j F_ij,
    1=s_i+T_i+M_i, M_i=sum_j F_ji,
    r=sum_i T_i, 2G=1+r, 79/61<=r<=49/31.

The complete hull polars, positive block means, zero blocks and all
prefix/contact phases remain required. These are full-AREA equations,
never the gradient of a lower proxy. Boundary/minimum-attainment and
twelve inverted continua/faces are separate upstream/global debts.

For a fixed source time T_i, the exposure vector is the Euclidean
projection of(T_i-D_j) onto the nonnegative side-prefix cones, one cone
on each side of i. Equivalently its full dual metric residual satisfies

    (W n_i)_j=T_i-D_j-F_ij,
    W=I+11^T/2.

Thus prefix residual sums are nonpositive, tight at strict positive
block ends; no unsupported DAG conservation bound is substituted.

## 2. Whole unique-endpoint source versus ALL right-subtree maxima

Suppose T1=theta>T_j for all j>1. Let psi=max(T2,T3,T4,T5)>0,
and let j be ANY index attaining that right-subtree maximum, allowing
original ties among them. No source other than1 can send flow to j:
any prefix reaching that cut has closure at least psi, whereas all
other source times are <=psi. Hence M_j=F1j, while M1=0.

Write f=(F12,F13,F14,F15), the nonnegative decreasing projection of
y=(theta-D2,...,theta-D5). If f_j>0, let b>=j be the final index
of its positive fit block. Prefix residual tightness at b gives
sum_(2..b)y=sum_(2..b)f. Previous fitted entries are >=f_j; therefore

    f_j<=max_(b>=j) average_(2..b)(theta-D).

If f_j=0 the nonnegative bound below is immediate. Every prefix2..b
containing j obeys sum_(2..b)D>=(m+1)psi, m=b-1<=4, by the
ACTUAL closure-ratio constraint at cut j. Consequently

    F1j<=[theta-5psi/4]_+<theta-psi.

This proof retains every farther-prefix pooling and original right tie.
It does not claim each individual flow is nearest-only. Actual balances give

    s_j-s1=theta-psi-F1j>0.

Since alpha_j<=alpha1, beta_j>beta1. Thus the initial positive beta
block cannot extend through ANY right-subtree maximal cut. In particular,
if2 is among the right-subtree maxima, beta2>beta1, so beta1 is its
actual positive singleton delta1. This strict input-fit boundary forces
D1>D2 (otherwise the increasing fit would pool1/2), hence alpha12 pools.
The endpoint source then has

    alpha1=theta+C1.

These are whole-class necessary implications, not a completed endpoint
value/exclusion argument. A bound on the remaining coupled hull/flows is
still needed, especially when the first beta block stops before a farther
right maximum or additional donor flows reach the intervening cuts.

## 3. Necessary endpoint estimates retained, not closure

The accepted endpoint estimate is

    (11/5)theta+C1<=1, theta<=5/11.

The full increasing hull is positive and preserves sum delta;
the actual endpoint-bottom range gives r=sum alpha. Reflection applies
to a unique endpoint5. For global max set{1,5}, BOTH hulls are positive,
sum alpha=sum beta=sum delta=r, so S+r=5 and3r+sum F=5.
These identities alone do not prove r>=49/31 or G>=40/31.

## 4. Proposed whole maximum-principle route — UNPROVED

The possible implication T_j+M_j<=max T (equivalently s_j>=1-max T)
was raised for challenge, NOT established. One-sided incoming flow has
a plausible height interpretation using the nearest still-open cut,
but summing the two sides requires genuine coupling. A general exposure
DAG or independent projection inequality does not supply it. No later
claim may use this proposal unless it is independently proved.

## 5. Whole endpoint tie: each three-interior-entry row is inactive

Let T1=T5=theta and all interior times be smaller; all hull entries are
positive, S+r=5, theta<=5/11. Endpoint mutual coordinates are zero by
the maximal-cut barriers. Suppose F52>0. The entire truncated row
(F54,F53,F52) is positive, so its tight terminal prefix residual gives

    C5=3theta-H, H=D2+D3+D4, D5=5theta-H.

The opposite row is arbitrary, D1=2theta+C1. Thus S=7theta+C1,
and r=5-7theta-C1. The accepted necessary endpoint bound
C1+11theta/5<=1 yields

    r>=4-24theta/5>=20/11>49/31.

This contradicts the competing range. Reflection excludes F14>0.
Therefore F14=F52=0 separately, stronger than excluding two full rows
simultaneously. This still permits the two-edge farther entries F13/F53.
Main independently derived and Critic independently checked this argument.

## 6. Whole endpoint tie: both two-edge farther entries cannot be positive

Assume F13>0 and F53>0, after Section5 removed F14/F52. The two
truncated endpoint rows each have both entries positive, so their exact
positive-row sums give

    C1=2theta-D2-D3, C5=2theta-D3-D4,
    D1=4theta-D2-D3, D5=4theta-D3-D4,
    S=8theta-D3, r=5-8theta+D3.

The last positive decreasing fit entry of(theta-D2,theta-D3) is at
most its last datum theta-D3. Thus F13>0 implies D3<theta; it also
implies D2+D3<2theta. Similarly D3+D4<2theta. Hence
D1>2theta>D2, so alpha12 pools. If it stopped before3, its actual
positive mean would be

    alpha12=1-2theta+D3/2.

Because the remaining decreasing projection at3 starts a block, its
value is at least its first datum delta3=1-D3; otherwise the first
polar residual of that block would be positive. A strict or non-strict
separation therefore requires alpha12>=delta3, implying
D3>=4theta/3, contrary to D3<theta. Thus alpha123 pools (possibly
into a still larger positive block); reflection forces beta345 to pool.

The first decreasing-fit value is at least every prefix mean, and the
last increasing-fit value at least every suffix mean. Since alpha3=alpha1
and beta3=beta5, this yields the genuine FULL-hull bound

    s3>=average_(1..3)delta+average_(3..5)delta
      =2-8theta/3.

All larger hull coarsenings are included. No individual pooled entry is
replaced by its own input, and no zero mean is used (both hulls are positive).

For the actual source2 right row, nearest-prefix polar gives
T2-D3-F23<=0; for source4 left row, T4-D3-F43<=0. Therefore

    M3>=F23+F43>=T2+T4-2D3.

These inequalities remain valid if either flow is zero. All additional
incoming flows and all interior outgoing flows stay in the actual equations.
Full source3 balance and r=sum T now give

    s3=1-T3-M3<=1-r+2theta+2D3.

Combining both bounds gives r<=-1+14theta/3+2D3. Substitute the
EXACT r=5-8theta+D3 to obtain D3>=6-38theta/3 and hence

    r>=11-62theta/3.

The competing upper bound r<=49/31 forces
theta>=438/961>5/11, with cross-product difference4818-4805=13.
Contradiction. Thus the ENTIRE joint both-two-edge-farther regime is
excluded, with every interior source order, pooling/contact phase and
original interior tie retained. No symmetry, nearest-only reduction or
unproved maximum principle was used. Separate Critic final read is pending.

The surviving tied-end regime has at most one positive farther entry among
F13,F53. This is still NOT the whole endpoint-tie closure.

## 7. Whole tied-end regime with exactly one positive two-edge farther row

Assume F13>0,F53=0 after Section5 excluded the three-edge coordinates.
Reflection treats the opposite case. The exact positive left two-entry row
gives C1=2theta-D2-D3,D1=4theta-D2-D3, D3<theta and alpha123 pooling,
as proved in Section6. The right row has only g=F54=[theta-D4]_+,
C5=g,D5=2theta+g. Therefore

    S=6theta+D4+g, r=5-6theta-D4-g.

If g>0, D4+g=theta and r=5-7theta>=20/11>49/31.
Hence g=0,D5=2theta. The competing upper range then gives

    D4-theta=5-7theta-r
      >=106/31-7theta>=81/341>0.

Since every source time is <=theta<D4, no interior source can expose
cut4. For source2 the last possible right coordinate4 has its next
coordinate5 inactive by the maximal barrier; a positive terminal fit
would be <=its last datum T2-D4<0. Source3 has the same nearest
negative datum and barrier5. Source1/5 entries are already zero.
Thus M4=0, and s4=1-T4>1-theta=s5.

If D4>=D5, the decreasing input violation (or equal-input rule) pools
alpha45; then beta4>beta5 would follow, impossible. Therefore
D4<D5=2theta. The increasing input violation pools beta45;
the strict s4>s5 forces alpha4>alpha5. Its actual positive singleton
is alpha5=delta5=1-2theta, so beta45=theta.

If beta3<theta, the isolated positive beta45 mean gives D4=2-4theta,
and r=3-2theta>=23/11>49/31. Hence beta345=theta necessarily.
Alpha is now EXACTLY123/{4}/{5} or1234/{5}; all its blocks are positive.
Beta has either beta2<theta and the actual block345, or beta2=theta
and block2345. Beta1<theta is proved separately in both alpha cases
below, so no full beta-all block is omitted. No interior flow order,
interior outgoing source or contact phase has been discarded.

### 7.1 Alpha123 separated from4, beta345 separated from2

The actual alpha123 mean is A=1-4theta/3. Singleton4 and source4
give D4=theta+T4; the endpoint balance gives beta1=theta/3<theta.
The ACTUAL beta345 mean is theta, hence

    D3+D4=3-5theta, D3=r+theta-2.

The actual source3 balance gives T3+M3=theta/3. The nearest source2/4
prefix polars remain F23>=T2-D3,F43>=T4-D3, hence

    T3+M3>=r-2theta-2D3.

Thus r<=7theta/3+2D3. Substitution of the exact D3=r+theta-2 yields
r>=4-13theta/3>=67/33>49/31. Contradiction.

### 7.2 Alpha123 separated from4, beta2345 coarsened

The preceding A,D4 and beta1=theta/3 remain exact. Since beta2=theta,
beta1 is its strict positive singleton, D1=1-theta/3. The ACTUAL
positive beta2345 mean gives r=13theta/3. The exact range formula
r=5-7theta-T4 then yields T4=5-34theta/3.
Strict interior T4<theta requires theta>15/37, whereas r<=49/31
requires theta<=147/403<15/37. Contradiction.

### 7.3 Alpha1234 coarsened, beta345 separated from2

The ACTUAL positive alpha1234 mean is A=1-theta-D4/4.
Source4 gives A+theta=1-T4, so D4=4T4 and

    theta/4<T4<theta/2, beta1=T4<theta.

The beta345 mean again gives D3=r+theta-2. Source3 now has
T3+M3=T4, so the same legitimate nearest-prefix inequalities yield
r<=2theta+T4+2D3. Consequently

    r>=4-4theta-T4>4-9theta/2>=43/22>49/31.

Contradiction. This uses the actual pooled mean, not a singleton input.

### 7.4 Both alpha1234 and beta2345 coarsened

Here D4=4T4,beta1=T4<theta. Beta1 is therefore its actual positive
singleton delta1, D1=1-T4. The ACTUAL beta2345 mean yields
r=4theta+T4. Together with r=5-6theta-4T4 this forces

    T4=1-2theta, r=1+2theta.

Interior T4<theta forces theta>1/3; the competing cap gives
theta<=9/31<1/3. Contradiction.

Thus this ENTIRE one-positive-farther-entry tied-end class is excluded,
including both possible full hull coarsenings and every interior flow.
No unproved maximum principle, symmetry, arbitrary DAG constraint or
proxy stationarity is used. Independent Main/Critic review is required.
Combining Sections5–7, a competing tied-end minimum must have BOTH
endpoint rows nearest-only. That last regime is not closed by this note.

## 8. Whole nearest-end tied class: interior maxima at2/4 above cut3

Assume endpoint times theta are globally maximal and BOTH endpoint
rows are nearest-only. Let u=T2>=v=T4>t=T3>0, with u,v<theta;
reflection treats v>=u>t. Original u=v is included, not discarded.
Interior cut3 has zero outgoing flow by the higher adjacent barriers,
so D3=2t. Put

    h=F23=[u-2t]_+, g=F43=[v-2t]_+,
    D4=2v+g,
    f=F12=[theta-D2]_+, q=F54=[theta-D4]_+.

The possible source2 farther-to4 entry is initially retained. Because
F53=0, if D3<theta its last datum theta-D3 is positive. A positive
q with that zero last fit would make its first block residual tight,
then the next prefix residual positive. Hence q=0. The full two-entry
prefix polar now gives D3+D4>=2theta. If g=0 this says theta<=t+v<2v=D4.
If g>0 it says theta<=3v/2<D4=3v-2t. If D3>=theta, then
u,v<theta<=2t implies h=g=0 and D4=2v>2t>=theta.
Thus in ALL phases D4>theta, q=0 and F24=0. The latter follows
from the exact source2 row on3/4: D3<D4 makes its data decreasing,
and its last datum u-D4<0. Hence D2=2u+h and M4=0.

As in Section7, s4=1-v>s5=1-theta excludes D4>=D5=2theta.
Therefore beta45 pools and alpha4>alpha5=1-2theta>0.
Its value is beta45=theta. Input D3<D4 also pools beta34, so
beta345=theta, allowing a possible coarsening into2/1.

Cut2 is an interior maximum; no other interior donor reaches it,
including the original tie u=v. Thus M2=f and
s2-s1=theta-u-f>0, since D2>=2u gives f<theta-u.
Consequently beta2>beta1; beta1 is its positive singleton delta1,
and alpha12 pools. D2>D3 forces alpha23 to pool too, so

    A=alpha123=theta+f,
    alpha4=1-theta-v.

The alpha monotonicity condition A>=alpha4 and source3 balance imply
v-t-h-g>=0. When g>0, both h and g are positive and this is u<=3t.
Also

    beta2-theta=t+h+g-u-f.

If h=0, this is t-u-f<0. If h>0,g=0 it is-t-f<0.
If h,g>0 it is v-3t-f<=0. Equality in that last case requires
the ORIGINAL interior tie u=v=3t and f=0. These exact alternatives
separate the only possible beta2/345 merger without genericity.

### 8.1 Strict beta2 boundary, including nonexceptional u=v

Here beta1<beta2<theta, so beta2 is its actual positive singleton
delta2. Its source balance gives D2=u+theta+2f. Since the actual
nearest endpoint fit is f=[theta-D2]_+=[-u-2f]_+, f=0.
Thus u+h=theta. As u<theta, h>0 and

    u=t+theta/2, A=theta,
    g=1-5theta/2.

The ACTUAL beta345 mean gives t+v=1-5theta/4.

If g=0, theta=2/5,t+v=1/2. The strict v>t forces v>1/4,
so alpha4=3/5-v<7/20<theta. Thus alpha123 is genuinely
separated from4; no coarsened face was assumed absent.
Its actual positive mean gives t=2/15,v=11/30, contradicting
g=0 requiring v<=2t.

If g>0, its exact definition v=2t+g together with t+v yields

    t=5theta/12, u=11theta/12, v=1-5theta/3.

Here alpha4=2theta/3<theta, so again the ACTUAL alpha123 block
is separated. Its positive mean forces theta=12/31, whence

    (T1,T2,T3,T4,T5)=(12,11,5,11,12)/31,
    r=51/31>49/31.

The strict u>v branch already fails by u=v at that value. The original
u=v branch is excluded by its range. This is an actual stationary
candidate with D=(24,23,10,23,24)/31 and full fits
alpha=(12,12,12,8,7)/31,beta=(7,8,12,12,12)/31;
no assertion of local minimality is made. Its G=41/31>40/31.

### 8.2 Exceptional original merger u=v=3t, f=0

Here h=g=t,D2=D4=7t,D3=2t,D1=D5=2theta.
Beta2345=theta and alpha123=theta. Source3 gives2theta+3t=1;
source4 then forces alpha4=theta, so alpha1234 is its positive
pooled block. Its ACTUAL mean is1-theta/2-4t, yielding
3theta/2+4t=1. These exact equations force t=1/7,theta=2/7,
contrary to globally maximal theta>u=v=3/7.
Thus the exceptional original tie is excluded directly.

This ENTIRE declared nearest-end tied class is noncompeting, including
all interior source activation, original2/4 ties, beta mergers and alpha
coarsening. It never assumes that interior donor flows vanish globally.
Main separately checks nearest-end interior order u>t>=v; interior
T3>=T2,T4 belongs to the exact nearest-odd cone calibration, including
inactive selected flows and hull coarsenings. These dependencies require
explicit independent review before a whole endpoint-tie conclusion.

## 9. Reviewed assembly and current unique-endpoint scope

Main Section9 assembles the independently reviewed Sections5--8 here,
Main nearest-end order proof and the frozen exact nearest-odd calibration.
These exhaust ALL interior orders and original ties for maxT={1,5}.
The whole tied-end competing-minimum class is noncompeting, conditional
on the retained upstream attainment/full-stationarity/range reductions.
This is not the all-real K6 theorem. Unique maxima {1},{5}, all twelve
inverted continua and final boundary assembly remain open.

Main Sections8,10,12,13, literally read and checked, supply the following
whole unique-endpoint necessities. If T1=theta is the unique global max,
then theta<=5/11, F14=F15=0. If F13>0, its actual last positive prefix
gives D1+D2+D3=4theta and D3<theta; alpha123 is positively pooled.
All alpha and beta values are positive and S+r=5. The original failed
zero-alpha45 attempt incorrectly needed D5>=1; its repaired proof uses
aggregate D4>=1,D4+D5>=2, the exact source2/3 zero tails, and positive
beta34 pooling to contradict T4<=theta. The separate alpha4>0,alpha5=0
case really has tight N4, hence D5>=1, no incoming5 and the reviewed
zero-incoming endpoint source lemma. No individual datum equality was
substituted for a zero pooled mean.

## 10. Whole m2 class with right-subtree maximum containing cut3

Assume precisely the unique-endpoint1 m2 regime of Section9. Let
psi=T3=max(T2,T3,T4,T5), allowing every additional original maximum tie.
Since D3>=2psi and D3<theta, psi<theta/2.

The maximal cut3 is a barrier to outgoing flows from4/5 toward3 or
beyond; source1's entries4/5 are already zero. Thus the ACTUAL outgoing
rows4/5 are only their mutual nearest entries. If both are inactive,
D4+D5=2T4+2T5<=4psi. If source4 is active, source5 cannot be active:
D5=2T5 and F45=T4-2T5>0, so D4+D5=3T4<=3psi. Reflection treats active
source5. Hence, without assuming which row is active,

    D4+D5<=4psi, r=theta+sum_(2..5)T<=theta+4psi.

Both positive full hulls preserve the total sum, so

    5=S+r=4theta+(D4+D5)+r
      <=5theta+8psi<9theta<=45/11<5,

a contradiction. This excludes the ENTIRE declared right-maximum-cut3
class, including right-subtree ties, all other incoming flows and all
hull coarsenings. It is not unique-endpoint closure: maxima2,4,5 still
need a whole argument. Independent literal review is required.

## 11. A failed general common-hull curvature shortcut

In the m2 regime alpha123 pools. If beta23 pools also, one can find a
one-sided D2+h,D3-h direction preserving both full hull fits unless
both boundary residuals are tight. The both-tight exception would force
delta2=alpha2=beta2=delta3; the positive alpha123 mean then gives
D3=4theta/3, contrary to D3<theta. This observation alone does NOT
exclude beta23 pooling. The exact area contains

    -sum D_i^2/4 + sum (convex farther-restoration R_i).

Keeping both hulls fixed therefore gives a negative diagonal curvature
PLUS positive restoration curvature, not automatically a negative
second variation. The required actual-cone restoration curvature bound
has not been proved. No generic common-hull exclusion or nearest-only
principle is claimed or used.

## 12. WHOLE m2 right maximum containing4 but not5

REVIEW CORRECTION: the first draft below omitted q from both beta means.
Its q-positive computations and its unqualified whole conclusion were
withdrawn on literal critic review. They are preserved as error history;
the corrected actual means and all q-positive phases are rederived in12.3.
The q-zero computations and the initial full-hull reductions do not use
the omitted term. Only the repaired proof may be considered for acceptance.

Keep unique T1=theta, F13>0 and Section9's reviewed whole necessities.
Let psi=T4=max(T2,T3,T4,T5), w=T5<psi. Original T2=psi contacts are
retained. A contact T3=psi has already been excluded by Section10;
it is not discarded generically. Write u=T2,t=T3 and

    L=C4left=F43+F42, q=F45=[psi-2w]_+.

The maximal barrier4 makes C5=0,D5=2w and confines rows2/3 to their
mutual nearest flows. M4=0. Therefore s5-s4=psi-w-q>0, forcing
beta5>beta4. Its genuine singleton is beta5=1-2w. Input D4>=2psi>D5
pools alpha45, with positive value

    a=alpha4=alpha5=w-q>0, beta4=B=1-psi-a.

Let A=alpha123, allowing initial coarsening into45. The actual prefix
polar gives A>=1-4theta/3. Since both full hulls are positive,

    r=3A+2a<=49/31,
    a<=2theta-22/31<=68/341<13/33<=A.

Thus the alpha123/45 boundary is genuinely strict and
A=1-4theta/3, beta1=theta/3. Also
psi+a<3theta-22/31<=223/341<28/33<=1-theta/3, so B>beta1.
If beta3<B, beta4 would be its positive singleton delta4 (beta5>B);
source4 would then give D4=psi+a<2psi, impossible. Hence beta34 pools,
and its actual block starts at2 or3, never1. This exhausts all full
hull alternatives here, including coarsened means and original ties.

### 12.1 Actual beta234 block

Beta1 is its singleton, so D1=1-theta/3,
P=D2+D3=13theta/3-1. Positive C1=1-7theta/3 gives theta<3/7 and
a<32/217. The genuine beta234 mean gives

    P+L=psi+3a.

Source4's last positive left prefix has length n=0,1 or2; it cannot
reach the global cut1. These are exhaustive terminal lengths, not a
proxy donor graph.

If n=2, L=2psi-P, hence a=psi/3. The phase q=0 is impossible because
it requires psi<=2w=2a. In phase q>0, w=(a+psi)/3=4psi/9.
The actual alpha45 mean, D4+D5=2-2a, gives
5psi-P=2-2psi/3, so P=17psi/3-2. Combining prefix means forces
17psi-13theta=3, impossible since psi<theta<3/7.

If n=0, L=0. When q>0 the same tail mean is3psi=2-2a, giving
a=1-3psi/2>5/14>32/217. When q=0 it is2psi+2a=2-2a, giving
psi+2a=1; but psi+2a<5theta-44/31<157/217<1. Both phases fail.

If n=1, L=psi-D3>0 and the inactive next coordinate gives D2>=psi.
The beta234 mean now yields D2=3a and D3<psi. For q=0 the actual
tail mean gives D3=3psi+4a-2<11theta-88/31-2<0. Thus q>0,
and the tail mean gives D3=4psi+2a-2.

As D2>=psi>=t, source3 has no outgoing flow; D3=2t.
Source2's only possible outgoing flow is c=[u-D3]_+.
Since D2>D3 the positive endpoint row pools, F12=F13=e.
No other source reaches2 in this n=1 phase, whereas incoming3 is
e+c+(psi-D3). Equality s2=s3 from the ACTUAL alpha/beta blocks gives

    u=t+c+psi-D3.

If c=0, D2=2u=2psi-D3=3a, hence D3=2psi-3a.
Together with the tail mean this requires2psi+5a=2, whereas
2psi+5a<6/7+160/217=346/217<2.
If c>0, cancellation gives psi=3t, D3=2psi/3;
the tail mean then gives a=1-5psi/3>2/7>32/217.
This closes every terminal-length and clipping alternative of this block.

### 12.2 Actual beta34 block, separated from2

Its genuine mean gives D3+L=2a. Suppose q>0; then a=3w-psi<psi/2.
For n=0, the first inactive left datum gives D3>=psi, contradiction.
For n=1, D3+L=psi, contradiction. For n=2,
L=2psi-P gives D2=2psi-2a>psi; its positive final fitted entry cannot
exceed the last datum psi-D2<0, contradiction. Thus q=0 and a=w.
The actual alpha45 mean yields L=2-2psi-4a, so

    D3=2psi+6a-2.

If beta1 is a singleton, D1=1-theta/3 and positive C1 gives theta<3/7.
Hence D3<14theta-132/31-2<-8/31<0, impossible.
Otherwise beta12 is its actual positive block theta/3, separated from34.
Its genuine mean gives D3=14theta/3-2. Equating the two expressions
forces7theta/3=psi+3a<7theta-66/31, hence theta>99/217>5/11
(the last cross-product difference is4), contradiction.

Therefore the ENTIRE declared m2 right-max-containing4/not5 class is
noncompeting, including the original2/4 max tie, all source2/3 activation,
all source4 left terminal lengths and both source4-to5 clamps. The
right-max4/5 tie remains a separate obligation, not inferred by a limit.
Literal independent review is required before accepting this proof.

### 12.3 Explicit repair of every q-positive phase

The ACTUAL D4 is2psi+L+q. Therefore the correct positive block means are

    beta234: P+L+q=psi+3a;
    beta34: D3+L+q=2a.

The missing q in12.1--12.2 is a real algebraic error, not a harmless
notation change. Those old q-positive steps are withdrawn. When q>0,
a=3w-psi, q=psi-2w=(psi-2a)/3, so a<psi/2. The true alpha45 mean
remains D4+D5=3psi+L=2-2a. All initial strict-alpha/beta-boundary
reductions in Section12 remain valid independently of this error.

For the actual beta34 block:
if n=0, D3>=psi contradicts D3+q=2a<psi;
if n=1, D3+L=psi, hence psi+q=2a<psi, contradiction;
if n=2, L=2psi-P gives D2=2psi+q-2a>psi, contrary to its positive
final fit being at most psi-D2. Thus q-positive beta34 is fully excluded.
The q-zero proof in12.2 uses the now-correct identical q-zero means.

For the actual beta234 block, beta1 remains a genuine singleton,
theta<3/7, a<32/217 as before.
If n=0, the true tail mean gives a=1-3psi/2>5/14>32/217, contradiction.
If n=2, P+L=2psi and the corrected beta mean gives q=3a-psi.
Together with q=(psi-2a)/3 this yields

    a=4psi/11, w=5psi/11, q=psi/11.

The tail mean gives P=63psi/11-2, while the genuine prefix mean is
P=13theta/3-1. Thus189psi-143theta=33, impossible since
psi<theta<3/7 implies its left side<46theta<138/7<33.

If n=1, the corrected mean gives D2=3a-q, not3a. The inactive
next coordinate still gives D2>=psi>D3. Source3's outgoing row is
zero, D3=2t; source2's only possible outgoing entry is c=[u-D3]_+.
The root row still has F12=F13=e, and the actual equal blocks still give
u=t+c+psi-D3. If c=0, D2=2psi-D3=3a-q, so
D3=2psi-3a+q. Comparing the unchanged true tail mean
D3=4psi+2a-2 forces2psi+5a-q=2. But q>0 and
2psi+5a<346/217<2, contradiction. If c>0 the same balance cancels
to psi=3t,D3=2psi/3; the true tail mean still gives
a=1-5psi/3>2/7>32/217, contradiction.

These exhaust every q-positive terminal length for both actual beta
blocks, with the omitted term now retained. Together with the unchanged
q-zero proofs, they repair the whole declared class subject to a new
FULL literal independent review. The right4/5 max tie is still not covered.

## 13. WHOLE m2 right maximum containing5 but not4

Let psi=T5=max(T2,T3,T4,T5)<theta, w=T4<psi. Right maxima containing3
were excluded in10; no strictness of the other maxima is imposed here.
M5=0, so the reviewed source lemma applies. All endpoint5 positive rows
of length at least3 are impossible: their genuine prefix sum gives
r=sum beta>=4-5psi>=19/11>49/31. Hence F52=F51=0.

First exclude F53>0, WITHOUT a symmetry assumption. Set h=theta+psi.
The two endpoint positive-two-edge prefixes give
D1+D2+D3=4theta,D3+D4+D5=4psi, hence
S=4h-D3,r=5-4h+D3. Their last positive fits imply D3<min(theta,psi).
The genuine hulls pool alpha123 and beta345, possibly with larger
coarsenings, so s3>=2-4h/3. The two internal nearest prefix polars give
M3>=T2+T4-2D3; actual balance then gives
s3<=1-r+h+2D3. Combining yields D3>=6-19h/3 and

    r>=11-31h/3>=53/33>49/31,

because h<=10/11. Thus source5 is nearest-only. If its nearest flow
g=[psi-D4]_+ is positive, D4+D5=3psi and
r=5-4theta-3psi>5-7theta>=20/11>49/31. Therefore
g=0,D5=2psi. The range identity gives

    D4-theta=5-r-5theta-2psi
       >106/31-7theta>=81/341>0.

Every other donor has time at most theta<D4, so its positive final fit
to4 is impossible; M4=0. Comparing s4=1-w>s5=1-psi excludes
D4>=D5: that order would pool alpha45 and force beta4>beta5.
Thus D4<D5, beta45 pools, alpha5 is its positive singleton1-2psi,
beta45=psi and alpha4=1-w-psi. Since D3<theta<D4, beta34 also pools,
giving beta345=psi with possible coarsening into2. Section2 gives
beta1<beta5=psi, so coarsening into1 is impossible.

If alpha1234 pools with value A=alpha4, its prefix polar gives
w+psi<=4theta/3. Its total alpha sum is r=5-4w-6psi, so
r>=5-22theta/3>=5/3>49/31. This excludes every beta alternative at once.

Otherwise alpha123 is its actual positive block
A=1-4theta/3, separated from4. Positivity and w<psi give
r=5-4theta-w-3psi>5-4(theta+psi). Thus theta+psi>53/62.
If beta345 is separated from2, its genuine mean gives
D3+D4=3-5psi, hence D3=r+4theta-3psi-2.
Cut3 balance and both internal nearest prefix polars give
4theta/3-psi=T3+M3>=r-theta-psi-2D3+F13.
Consequently

    r>=4-31theta/3+6psi+F13
      >283/31-49theta/3>=1744/1023>49/31.

If beta2345 instead pools, beta1 is its positive singleton theta/3;
D1=1-theta/3 and its genuine mean gives r=4psi+theta/3.
Thus r>106/31-11theta/3>=1793/1023>49/31.
These are all original full-hull alternatives; no inactive clamp or
internal source was omitted. The whole declared class is noncompeting,
subject to independent literal review. The original4/5 max tie follows
only from the separate argument below, not from continuity.

## 14. WHOLE m2 right maximum tie containing4 and5

Let psi=T4=T5=max(T2,T3,T4,T5)<theta, retaining any further original
maximal contacts. Section10 excludes contacts with3. Section13's
endpoint-row pruning and asymmetric BOTH-far exclusion use only M5=0,
not w<psi, and therefore still apply. The endpoint5 nearest flow is
zero by the equal-time cut4 barrier; D5=2psi. Its positive-flow alternative
is also incompatible with D4>=2psi. The range still gives D4>theta;
M4=M5=0, so s4=s5=1-psi.

Both actual hulls pool45. Indeed whichever of D4>=D5 or D4<=D5 holds
forces alpha45 or beta45 to pool, respectively, and equal s4/s5 forces
the other to pool as well. Equal D4=D5 cannot have a strict projection
boundary in either monotone hull. Put alpha45=a,beta45=b; both are positive.

If psi<=theta/2, source4 has at most two left coordinates with each
fit<=psi, so D4<=4psi; D5=2psi and r<=theta+4psi. Then
5=S+r<=5theta+10psi<=10theta<=50/11<5, contradiction.
Thus psi>theta/2, and both D4,D5>theta.

Write N4=sum_(1..4)(delta-alpha)<=0 and L5=delta5-beta5<=0.
If both are tight, adjacent alpha prefix and beta suffix polar
inequalities force delta4=a=b=delta5. Since a+b=1-psi,
delta5=1-2psi gives psi=1/3,D4=D5=2/3. Then
r=5-4theta-4/3>=61/33>49/31, impossible.

Otherwise choose a nonzero one-sided h in the perturbation
D4(h)=D4+h,D5(h)=D5-h. The alpha prefix residual at4 changes by-h,
the beta suffix residual at5 by+h; every other residual and every
block mean stays fixed. At least one of these two residuals is strict,
so one sign of sufficiently small h preserves BOTH original full hull
fits, even if the other residual is tight. Positivity and natural order
remain valid. All cut times are strictly below1, so this is a legitimate
second-variation of the actual height-one functional, not a tail proxy.

Only restoration R4 can change locally. For rows1/2/3, coordinates4/5
are a strictly negative terminal tail because D4,D5>theta; their exact
nonnegative decreasing fits are zero and their restoration duals are
independent of these coordinates locally. For row5, every left prefix
contains the maximal cut4. Its m-coordinate datum mean is at most
-psi/m<0 by the exact closure lower bound on that prefix containing4.
Thus the entire restoration R5 remains zero locally. Row4 cannot reach
cut1, whose datum is strictly negative since D1>2theta; its right coordinate5
is strictly inactive. Therefore its only variable dual is the actual
two-coordinate left cone K, with W=I+(1/2)11^T and

    R4=max_(f in K)[(D4/2)sum f-Dother dot f-(1/2)f^T W f].

This strongly concave quadratic yields the universal increment bound
R4(D4+h)<=R4(D4)+R4'(D4)h+h^2/8, including every terminal switch:
the inverse metric has 1^T W^-1 1=1 in dimension2, and the varying
linear dual coefficient is (h/2)1. This bound does not freeze an active
phase or use an unconstrained optimizer as an anchor.

The exact functional is linear in sum D plus the two hull values,
minus sum D_i^2/4 plus sum R_i. The chosen perturbation keeps sum D
and both hull values fixed. Its diagonal change is its first derivative
minus h^2/2; the sole restoration change is at most its first derivative
plus h^2/8. Actual full stationarity cancels their summed first derivative.
Hence G(D(h))<=G(D)-3h^2/8, contradicting an actual local minimum.

This excludes the ENTIRE declared original4/5 right-max tie class,
including further contacts with2 and all source4 left-prefix clamps.
The strict row-inactivity and two-coordinate dual bound are essential;
this does not reinstate the failed generic common-hull argument in11.
Independent literal review is required before accepting the proof.

## 15. WHOLE m2 right maximum containing2

Let u=T2=max(T2,T3,T4,T5)<theta. Section10 excludes original contacts
with3; hence t=T3<u, but ties with4/5 are retained. Section2 forces
beta1 to be its singleton delta1, and source1 balance gives
A=alpha123=theta+C1. Initially this block may coarsen into4/5.
Put V=D4+D5. The full sum and range give

    V=5-r-4theta>=106/31-4theta>=546/341>3theta>3u.

### 15.1 Actual whole-flow reduction

The maximal cut2 is a barrier, so F52=0. If F53>0, source5 has exactly
a positive terminal two-edge row. The asymmetric BOTH-far argument at
the start of13 needs only its actual time T5<=theta, the two positive
prefixes and both positive full hulls; it does NOT need T5 maximal.
It gives r>=53/33>49/31. Thus source5 is nearest-only. Its positive
nearest alternative would give V=3T5<=3u, impossible. Consequently

    C5=0,D5=2v with v=T5<=u, D4=V-2v>u.

In fact D4>=106/31-4theta-2u>106/31-6theta>=236/341>theta.
This stronger margin justifies every later reference to D4>theta.

Source2's terminal4/5 tail is zero: its first datum on4 is negative and
its last-two average u-V/2 is negative. Source3's right4/5 row is zero
for the same reason. Source1's entries4/5 were already zero. Hence
M4=0 and source3 has no outgoing row (cut2 blocks its left side),
so D3=2t. Source2 has only h=[u-2t]_+ to3. Source4 cannot reach the
maximal cut2, and has only g=[w-2t]_+ to3 and q=[w-2v]_+ to5, where
w=T4<=u. Thus

    D2=2u+h, D3=2t, D4=2w+g+q, D5=2v,
    M2=F12, M3=F13+h+g, M4=0, M5=q.

In particular D2>D3 since u>t. The actual positive source1 two-coordinate
projection therefore pools, F12=F13=e=C1/2>0. No proxy graph has been
imposed: every farther entry was excluded by a genuine barrier, the
asymmetric prefix argument or the negative terminal tail.

### 15.2 Order w<v

Here q=0,M5=0. Comparing s4>s5 exactly as13 gives D4<D5=2v, beta345=v,
alpha5=1-2v and alpha4=1-w-v. The full prefix alpha123 may coarsen into4
but cannot into5. If it coarsens into4, the Section13 aggregate prefix
argument gives r>=5/3. Otherwise its actual mean is A=1-4theta/3 and
r>5-4(theta+v), hence theta+v>53/62. Also D5>D4>theta implies v>theta/2,
so beta1=theta/3<v, excluding beta coarsening into1. The two genuine
beta alternatives,345 or2345, are precisely Section13's actual means,
which give respectively r>1744/1023 or r>1793/1023. Their derivations
retain arbitrary incoming3 and use only actual nearest prefix polars,
not maximality of v. Thus this whole order is noncompeting.

### 15.3 Order w>v

Now s5-s4=w-v-q>0, so beta5 is its genuine singleton1-2v and alpha45
pools with a=v-q>0. Since A=theta+2e>theta>v>=a, alpha123/45 is a
genuine boundary. Its actual prefix mean gives A=1-4theta/3,
e=(1-7theta/3)/2>0 and theta<3/7. Range gives a<32/217.
Beta4=1-w-a>beta1=theta/3 by the same bounds as12. If beta3<beta4,
beta4 would be a singleton, giving D4=w+a<2w, impossible. Thus beta34
pools, starting at2 or3; its block cannot reach1.

If it starts at2, equality s2=s3 gives u=t+h+g. If h=0, u<=2t and
w<=u imply g=0, forcing u=t, impossible. If h>0, cancellation gives
g=t>0 and w=3t. But the source3/source4 balances give

    A-a=w-t-e-h-g=3t-u-e<0,

because w=3t<=u and e>0, contrary to A>a. This includes every q clamp.

If the block starts at3, beta2 is its positive singleton delta2.
Source2 balance gives u+h=A+e. If h=0 this forces u>A>theta,
contrary to u<theta. If h>0, the prefix sum P=D2+D3=3u,
and the actual beta1 singleton gives P=13theta/3-1, hence
u=13theta/9-1/3<2/7. For q=0, V=2w+g+2v<=5w<=5u<10/7.
For q>0, V=3w+g<=4w<=4u<8/7. Both contradict
V>=106/31-4theta>370/217. This closes every original full-hull and
source activation alternative in w>v without needing incorrect beta
mean formulas or assuming symmetric times.

### 15.4 Original order tie w=v

Here q=0,M4=M5=0. Equality s4=s5 and the input D4>=D5 pool both
alpha45 and beta45, with positive values. Furthermore V<=5w and
V>=546/341, so D5=2w>=2V/5>theta. Also
D4=V-2w>=V-2u>106/31-6theta>=236/341>theta.

Apply the EXACT curvature argument of14 to D4+h,D5-h. Its hypotheses
are checked here explicitly: all other rows have strictly negative final
4/5 tails; source5's prefixes containing4 have strictly negative average
by the maximal cut4 within that right pair, and prefixes reaching2 have
the higher cut2 barrier. Thus R5 stays zero locally. Source4's receiver2
has last datum w-D2<=u-2u<0, so its only possible left coordinate is3;
its right coordinate5 is strictly inactive. The exact one-coordinate
restoration dual gives an even smaller own-D4 increment bound h^2/12.
If both hull boundary residuals at4/5 are tight, their polar inequalities
force D4=D5=2/3, so V=4/3<546/341, impossible. Otherwise one nonzero
sign of h keeps BOTH hull fits fixed. Full stationarity cancels the
first derivative, while the negative diagonal contributes-h^2/2 and
the sole restoration contributes at most+h^2/12. The actual area falls,
contradicting a local minimum. All times are below theta<1, so no
physical bottom-tail second-variation issue occurs.

This closes all three orders w<v,w>v,w=v, with the original rightmax
ties with4/5 retained. The ENTIRE declared right-max-containing2 m2
class is noncompeting subject to FULL literal independent review.

## 16. Final literal-review disposition (no new derivation)

Critic FULLY reread and independently accepted Section12 with12.3's
explicit omitted-q repair. Critic subsequently FULLY read and independently
accepted Section13's entire right-max5/not4 scope and Section14's original
right-max4/5 tie scope, including asymmetric prefix means, full-hull
alternatives, strict row-inactivity margins and the metric curvature bound.
Section10 was already independently accepted. Original errors remain above.

Section15 was read in full but NOT fully verified; it remains PENDING.
No whole m2 assembly is therefore accepted at this checkpoint. The exact
still-unreviewed m2 obligation is the right-subtree maximum set containing2
but not3, including original contacts with4/5. The nearest-only unique
endpoint regimes, all twelve inverted continua and final upstream boundary
assembly remain OPEN. No all-real K6 or new regional milestone is claimed.

Mathematical branch work stopped before the03:16:07 UTC hardstop;
this section records review evidence only. No automatic continuation.

## Ledger

Required AGENTS/protocol/active/handoff latest, original charter, R2 scope,
latest clean report, full Vibecode skill and TIP/report reference read.
Ordinary reads/clock and apply_patch only; mathematical processes0,
seconds0, failed starts0. No code/samples/optimizer/LP/enumeration/replay/
UI/API/Git/build/install/copy/deletion/new infrastructure or new agents.
