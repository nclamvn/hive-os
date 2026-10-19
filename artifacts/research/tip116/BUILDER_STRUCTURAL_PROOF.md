# TIP116 — Builder structural hand proof attempt

STATUS: PARTIAL; all-real finite K6 remains OPEN. Mathematical subprocesses0.
This note rederives the provisional natural-chart identities before using them.
It does not assume stationarity of a lower proxy, impose symmetry, or discard
the twelve inverted-apex continua. TIP109's exact chain identity and regional
C/SOS theorem and TIP110's failed Jensen/projection shortcuts remain unchanged.

## 1. Exact farther-fill energy and first derivatives

Use I_j(t)=[A_j-jt,A_j-(j-1)t], D_i=A_(i+1)-A_i>=0,
delta_i=1-D_i, and G=6F6. In this section the bottom is one closed component.
For cut i define the two side envelopes, omitting an absent side,

    c_i^L(t)=max(0,max_(a<i)[(i-a)t-sum_(h=a)^(i-1)D_h]),
    c_i^R(t)=max(0,max_(b>i+1)[(b-i-1)t-sum_(h=i+1)^(b-1)D_h]),
    c_i=c_i^L+c_i^R.

The accepted exact cut formula, with its two extremal endpoints, gives
q_i(t)=[D_i-2t-c_i(t)]_+. Each side envelope has nonnegative intercepts
S_k, slopes k>=1, and starts at0. Hence c_i is continuous, nondecreasing,
and q_i first vanishes at the unique T_i>=0 solving

    D_i=2T_i+c_i(T_i).

For D_i=0 this means T_i=0. Bottom connectedness gives T_i<=1.

For a single side put J(T,S)=integral_0^T max(0,max_k(kt-S_k))dt.
On its ACTUAL increasing-slope path 0=k0<k1<...<km, define
tau_h=(S_(k_h)-S_(k_(h-1)))/(k_h-k_(h-1)). These actual switch heights
satisfy0<=tau1<=...<=taum<=T. Direct piecewise integration gives

    J=k_m T^2/2-S_(k_m)T
      +sum_h (S_(k_h)-S_(k_(h-1)))^2/[2(k_h-k_(h-1))]
      =sum_h (k_h-k_(h-1))(T-tau_h)^2/2.

Each actual-path expression is a positive-semidefinite quadratic in(T,S).
At a pooled/zero/terminal switch, a disappearing active interval has length0.
The derivative in S_k is minus that interval's length; the derivative in T
is the continuous envelope value at T. Thus the expressions match to first
order. Along any segment in the convex domain T>=0,S>=0, the finite
piecewise-quadratic restriction has nonnegative second derivative and
matching first derivatives. Therefore J is jointly convex and C1. Equal
switches and T=0 follow by the same vanishing-length argument. This does
NOT continue an unconstrained path quadratic beyond its active region.

Let I_i(T,D)=J_i^L+J_i^R. The exact restored area is

    R_i=D_i^2/4-integral_0^infinity q_i(t)dt
       =min_(T>=0)[(T-D_i/2)^2+I_i(T,D)].

Indeed the derivative of the minimized expression is2T-D_i+c_i(T),
whose unique zero is T_i. Evaluation there gives D_i^2/4 minus the
integrated positive gap. Joint convexity and partial minimization show
that R_i is convex. Uniqueness and the C1 envelope derivatives give

    partial_i R_i=D_i/2-T_i,
    partial_j R_i=partial_j I_i(T_i,D), j!=i.

The actual natural area on the connected-bottom domain is exactly

    G=sum D_i-2+B_L+B_R-sum D_i^2/4+sum R_i.

At a contact T_i=1, this infinite-height formula equals the actual value.
In a perturbation of size h within the natural chart, every cut line has
negative slope of magnitude at least2. Any newly added tail above1 has
width O(h), height O(h), and integral O(h^2). Thus values and FIRST
derivatives transfer to the actual height1 functional. No second-variation
transfer in directions opening the bottom is asserted.

## 2. Actual hull projections and exact flow balance

The full, not selected, hull supports have the variational representations

    B_L=max_(alpha1>=...>=alpha5>=0)
          [sum delta_i alpha_i-sum alpha_i^2/2],
    B_R=max_(0<=beta1<=...<=beta5)
          [sum delta_i beta_i-sum beta_i^2/2].

For example, a decreasing alpha assigns prefix length i to heights below
its ith cut; its objective is the integral of the corresponding prefix-sum
line. The maximizing prefix length decreases with height, so this represents
the actual envelope. Since delta_i<=1, all nonnegative projected block
averages are<=1; omission of the upper cap is legitimate ONLY in this
natural chart. Alpha and beta are the unique Euclidean cone projections.
Put s=alpha+beta. Their derivatives with respect to D are minus alpha,
minus beta, respectively.

For every ordered cut pair i!=j define F_(i,j) as the total measure of
heights0<t<T_i for which the active prefix on the side of cut i containing
edge j actually contains j. An absent/zero active prefix contributes0.
At almost every height the active prefix is unique. Consequently

    F_(i,j)=-partial_j I_i(T_i,D)>=0,
    C_i:=c_i(T_i)=sum_(j!=i)F_(i,j),
    M_j:=sum_(i!=j)F_(i,j).

The identity for C_i follows because an active slope k counts the k edges
in its intercept, and integration of active slopes is c_i(T_i)-c_i(0).
This is exact prefix-exposure flow, not an arbitrary nonnegative matrix.

At an ACTUAL unconstrained natural-chart stationary point, first derivatives
of the preceding exact area formula give

    1=s_j+T_j+M_j.                                      (B)

To calculate the total hull exposure, the decreasing projection polar
conditions are sum_(j<=k)(delta_j-alpha_j)<=0. Equality holds at every
strict positive drop of alpha. If alpha's last positive entry is m,
its drop to0 gives equality for the first m entries; all other prefixes
have smaller sums. Hence sum alpha=max(0,max_k sum_(j<=k)delta_j)
=p1-min p. The analogous suffix proof gives sum beta=max p-p6. Thus

    sum s=sum delta+r, r=max p-min p.

Summing(B), using sum C=sum M and sum D=2sum T+sum C, now proves

    sum T=r.                                            (R)

Every equation here uses the ACTUAL area's full gradient. Neither the lower
neighbor proxy nor the radial condition alone implies(B).

## 3. Prefix ratio, spatial tree locality, and joint block conservation

Take any active side prefix of donor cut i, length k, intercept
S=sum of its k contiguous D edges. For EVERY edge j in that prefix,
the exact closure formula for cut j admits this interval as one of its
cross-cut intervals, so T_j<=S/(k+1). Therefore

    S>=(k+1)max_(j in prefix)T_j.

If this prefix contributes a positive amount of flow, kt-S>0 on a
positive-length interval below T_i. Consequently every edge in that prefix
satisfies T_j<k T_i/(k+1)<T_i. Ties have no positive flow.

In particular a donor cannot send flow ACROSS an edge whose closure height
is at least the donor's. Its flow stays between the nearest such barriers
on either side. With distinct heights these are precisely branches of the
Cartesian max-tree of(T1,...,T5); ties use the barrier formulation. This is
stronger than acyclicity alone.

A quantitative consequence retaining all prefix constraints is

    C_i<=sum_(existing sides) max_(prefixes on that side)
      [kT_i-max(2sum_(j in prefix)T_j,
                  (k+1)max_(j in prefix)T_j)]_+.

Here D_j=2T_j+C_j>=2T_j justifies the first intercept lower bound. Also,
for j on a side with at most K edges,
F_(i,j)<=[T_i-(1+1/K)T_j]_+; this weaker bound is NOT sharp enough by itself.

The hull and flow additionally satisfy an exact JOINT conservation law.
For every positive constant block B of alpha bounded by actual strict
drops (or a domain endpoint), projection complementarity gives
sum_B(delta-alpha)=0. Since(B) and D=2T+C imply

    delta-alpha=beta-T-C+M,

one obtains

    sum_B beta=sum_B T+F(B->B^c)-F(B^c->B).              (P_L)

Here F(X->Y)=sum_(i in X,j in Y)F_(i,j). An analogous positive beta
block satisfies the same right side with sum_B alpha on the left.
Zero hull blocks retain polar inequalities, not this equality. Arbitrary
DAG flows do not capture these two actual-envelope block laws.

## 4. Hand test: no monotone-D competing minimum

This is a test of the joint conditions, not a new closure milestone.
Suppose0<D1<=...<=D5 and retain actual stationarity, a connected bottom,
the two one-sided bottom-slope conditions, and competing range r<=49/31.
Then delta is nonincreasing,

    alpha_j=(delta_j)_+, beta_j=mu,
    mu=(sum delta/5)_+.

The first projection is already decreasing. The increasing projection of
a decreasing sequence is its single averaged block, clipped at0; the
prefix polar conditions verify this directly.

The exact T_i are nondecreasing. To prove T_(i-1)<=T_i, take any
cross-cut interval for cut i. If its first edge is<=i-1, it also crosses
cut i-1. Otherwise it starts at i and all its m edges have D>=D_i,
so its closure ratio is at least mD_i/(m+1)>=D_i/2
>=D_(i-1)/2>=T_(i-1). Taking the minimum proves the claim.
Therefore cut5 has no incoming flow: M5=0.

If sum delta>=0 and delta5<=0, alpha5=0 and stationarity gives
T5=1-mu. But the full five-edge cross interval gives

    T5<=sum D/6=5(1-mu)/6<1-mu,

a contradiction (mu<1 because D>0 gives every delta<1).

If sum delta<0, the bottom sequence p is convex, because
p_(j+1)-p_j=D_j-1 is nondecreasing. Its maximum is at label6 and is
strictly greater than p1. Convexity makes label6 the unique maximum;
otherwise a tied earlier maximum together with nondecreasing increments
would force p1>=p6. Every minimum label b is<=5. For t>1 near the bottom,
the natural components cannot split: all cut closures are<=1. The actual
width is therefore the hull width, with one-sided slope1+b-6=b-5<=0.
This contradicts the retained plus-side bottom-slope>=3, even when the
minimum is tied. Thus this case cannot be a competing minimum.

It follows that delta5>0, hence every delta_j>0, and bottom extrema are
labels1/6. Now mu=r/5. Every right-side prefix of cut i has intercept
S>=kD_i, while t<=T_i<=D_i/2, so no right-side prefix contributes fill.
Cut1 has no left side either, but the following argument needs only the
maximal cut5. Its stationary equation gives

    mu=T5+C5>=T5>=sum T/5=r/5=mu.

Therefore all T_i=mu and C5=0. Equal T's permit no positive prefix flow,
so ALL C_i=M_i=0. Hence D_i=2mu for every i. Averaging delta=1-D gives
mu=1-2mu, or mu=1/3. Thus the only stationary vector in this monotone
case is D=(2/3,...,2/3), r=5/3 and, by the actual radial identity,
G=(1+r)/2=4/3>40/31. It is outside the competing range already.
Reflection treats nonincreasing D. No claim that all other D are in C,
or that the flat stationary vector is a local minimum, is made.

## 5. Open implication and current route

The desired sharp statement cannot discard endpoint slack. Put
g=r-sum delta>=0. Summing the exact balance gives

    5=3r+M_total-g.

Thus the sufficient sharp coupling is

    M_total-g<=8r/49,

not the stronger unconditional M_total<=8r/49. It would imply r>=49/31
and the desired actual stationary value bound. The latter stronger statement
requires endpoint extrema and must not be assumed globally.

The prefix-tree locality and BOTH projection block laws have not yet been
shown to imply that coupling, force every competing natural minimum into C,
or force the sharp alternating max-tree. Nonmonotone D arrays, pooled/zero
hull blocks, simultaneous closures and relevant faces remain. The twelve
inverted-apex continua are entirely outside this natural proof attempt.
No finite check, previous local SOS or negative Hessian of a lower proxy
substitutes for that whole implication.

## 6. Further hand test: entire strict-central-star minimum class

The following excludes a WHOLE nonsymmetric natural class, not merely its
reflected example. It is still not all-natural closure. Assume D>0, actual
full-gradient stationarity/local-minimum second variations, one closed bottom,

    C1=C2=C4=C5=0, T3=theta>max(T1,T2,T4,T5).

Only cut3 can donate exact prefix flow. Write u=D1,v=D2,w=D4,z=D5,c=D3.
Every wing closure is T_j=D_j/2. Thus c>=2theta is strictly larger than
all four wing D's. The only left prefix lines of cut3 are t-v and2t-u-v.
Let f1=F_(3,1),f2=F_(3,2). Their exact formulas are:

    u<=v: f1=f2=[theta-(u+v)/2]_+;
    u>v:  f1=[theta-u]_+, f2=[theta-v]_+.

These formulas include no-flow and endpoint-equality cases. Also C1=0
requires u<=2v, by the adjacent prefix at T1=u/2. Reflection gives z<=2w.

Since the earliest left activation height is min(v,(u+v)/2)>v/2,

    T2+f2<theta.

Source-center stationarity and wing2 stationarity imply s2>s3. The local
input violation delta2>delta3 forces the increasing isotonic projection
to have beta2=beta3: a strict projection boundary there would put the
last value of its left block>=delta2 and the first of its right block
<=delta3, contradicting increasing order. Therefore alpha2>alpha3.
Reflection gives beta3<beta4. In particular alpha1/alpha2 are positive,
separated from the remaining decreasing-hull blocks, and beta4/beta5 are
positive, separated from the remaining increasing-hull blocks. The inner
blocks may still be zero; that case is retained.

If u<v, the decreasing projection on the first two entries is their
already strictly decreasing input: alpha1=delta1,alpha2=delta2.
The first three inputs are strictly decreasing, so beta1=beta2=beta3
(possibly0). The two flows are equal. Subtracting wing stationarity then
requires s1-s2=(v-u)/2, whereas the hull gives s1-s2=v-u. Contradiction.
Hence u>=v and alpha1=alpha2=1-(u+v)/2>0.

The increasing prefix up to label3 now has only two possibilities:
beta1=beta2=beta3, or a separated first entry with

    beta1=(1-u)_+, beta2=beta3=1-(v+c)/2>beta1.

For the separated case with beta1>0, its ordering gives
u>=(v+c)/2>=theta+v/2>theta, so f1=0. If v<theta,
subtracting the two wing balances gives

    u-(v+c)/2=(u+v)/2-theta,
    u=2v+c-2theta=2v+C3,

contradicting u<=2v because this case has positive left flow and C3>0.
If v>=theta, both left flows vanish and the same subtraction gives u=c,
contradicting u<2theta<=c.

For the separated case with beta1=0, u>=1 and beta2>0 implies c<2,
hence theta<1<=u and again f1=0. If v<theta, subtraction gives
u+2v+C3=2. But u>=1 and u<=2v imply the left side>=2+C3>2.
If v>=theta it gives u+c=2, whereas u<2theta<=c and u>=1 imply c>1,
again impossible. Thus beta must pool the first THREE entries.
Reflection forces alpha to pool the last THREE entries. Their means may
be clipped at0; no positivity of these inner blocks was assumed.

If u>v with these pooled hulls, s1=s2 and the wing balances require
(u-v)/2=f2-f1. The both-active branch gives f2-f1=u-v and is impossible;
the no-flow branch is likewise impossible. The only remaining branch is

    u>theta>v, u+v=2theta, f1=0,f2=theta-v>0.             (A)

This branch is NOT a local minimum of the ACTUAL area. Perturb u to u-h
and v to v+h, h>0 sufficiently small. The first decreasing block mean and
the first increasing three-entry block mean are unchanged. The decreasing
block's internal ordering has a strict margin u>v; the increasing block's
first prefix residual improves and its second prefix residual is unchanged.
Consequently the FULL hull projections stay unchanged, including inner
zero/pooled faces. The beta prefix mean is in fact positive here: wing1
balance and f1=0 give beta1=v/2>0. Source balance then ensures theta<1.

For cut1 every nonadjacent cross interval includes BOTH u and v, so its
closure ratio is unchanged while its adjacent closure u/2 decreases.
For cut2 every nonadjacent interval either crosses cut3 and has old ratio
>=theta>v/2, or is the two-edge interval u+v=2theta with ratio2theta/3>v/2.
Its adjacent closure v/2 therefore remains strict for small h. For cuts4/5,
every affected cross sum is unchanged (contains both u,v) or increases
(contains v but not u). Thus all four zero C's persist. Strict central
maximality and theta<1 keep this perturbation in the actual connected-bottom
domain, so no unphysical tail second variation is used.

On(A), the left integrated prefix envelope is exactly(T-v)^2/2 near its
terminal height. The right side has terminal active slope k_R in{0,1,2};
at a switch choose its one-sided slope as T increases. In the exact convex
minimization for R3, the T curvature is m=2+1+k_R, the T-v cross derivative
is-1, and the v curvature is1. Thus its minimized v curvature is1-1/m.
The raw-square curvature in direction(u,v)->(u-h,v+h) is-1; hull curvature
is0 and all other R's remain0. The actual area therefore has the strict
one-sided quadratic decrease

    G(D+h*(-1,1,0,0,0))-G(D)=-h^2/(2m)<0,

for the sufficiently small actual phase on that side. First derivatives
vanish by actual stationarity. This excludes(A), including a right terminal
switch. Hence u=v=:a. Reflection gives w=z=:b.

With these equalities, the two remaining inner hull means are

    L=[1-(c+2b)/3]_+, R=[1-(2a+c)/3]_+.

Wing balance is

    a/2-(theta-a)_+=R, b/2-(theta-b)_+=L.

The function x/2-(theta-x)_+-[1-(2x+c)/3]_+ is strictly increasing
(its every one-sided slope is at least1/2). Both a and b are its zeros,
so a=b, without Jensen or an imposed reflection condition.

If theta=1, source balance forces L=R=0; wing balance then gives
a=b=2/3 and r=sum T=7/3>49/31. Otherwise L=R=(1-theta)/2>0.
If theta<=a, all flow vanishes, c=2theta; the equations give the flat
D=(2/3,...,2/3), theta=1/3, r=5/3. This flat solution is a boundary of,
not inside, the assumed strict-root class. If theta>a, closure gives
c=6theta-4a, and the equations reduce to

    theta=3a-1, 9theta-4a=3.

Thus a=12/23, theta=13/23, c=30/23. Its range is
sum T=37/23>49/31 and radial value G=30/23>40/31. These are the only
stationary local-minimum possibilities compatible with the whole strict
central-star class and its inner hull clipping cases. No actual competing
minimum lies in this class.

This argument does not cover a noncentral maximal T, tied maximal T's with
noncentral cuts, or multiple exact donors. Those are still part of the root
obligation; no convexity or generalized star exclusion is inferred from this
class calculation.

## 7. Strict central max-tree: the two wing orders are forced

Now assume only T3=theta>max(T1,T2,T4,T5), allowing multiple donors.
Suppose T2>T1. Tree locality restricts every wing flow to cut2->edge1;
neither cut1 nor any right-wing cut can send flow across the greater T2/T3.
Consequently

    C1=0, D1=2T1,
    C2=[T2-D1]_+, D2=2T2+C2>D1.

The root's left prefix is k2-only because D1<D2, so its two left flows
are equal e=[theta-(D1+D2)/2]_+. Thus M1=C2+e,M2=e,M3=0.
Since (D1+D2)/2=T2+(D1+C2)/2>T2, one has T2+e<theta.
Balance gives s2>s3; increasing beta then forces alpha2>alpha3.
Also delta1>delta2 forces beta1=beta2. The wing difference is

    s1-s2=T2-T1-C2>0,

equal to(D2-D1)/2 when C2=0 and D1/2 when C2>0. It forces
alpha1>alpha2. The two strict decreasing-projection drops at1/2 and2/3
make alpha1=delta1 and alpha2=delta2, both positive. Hence the hull gives
s1-s2=D2-D1, strictly larger than either of the necessary wing differences:
in the active case D2=3T2-D1>2D1, so D2-D1>D1>D1/2.
Contradiction. Therefore T1>=T2. Reflection gives T5>=T4.

With those weak orders, cuts2/4 have no outgoing flow. Cut1 can donate only
to2, cut5 only to4; the root remains a possible farther donor to1/5.
Moreover D1>=D2, D5>=D4, and D3>=2theta>D2,D4. These input violations
force the ACTUAL decreasing projection into blocks{12},{34},{5}, with
arbitrary coarsening/zero blocks, and the ACTUAL increasing projection into
blocks{1},{23},{45}, again with arbitrary coarsening/zeros. This does not
impose the inequalities C or choose one unpooled hull path.

## 8. Strict central max-tree: no farther root flow at a competitor

First suppose C1>0 and root flow F_(3,1)>0. Then D2=2T2,
C1=T1-D2>0,D1=3T1-D2>D2. Positive farther flow means theta>D1, so
F_(3,2)-F_(3,1)=D1-D2. Exact wing balance gives

    s1-s2=T2+C1+F_(3,2)-T1-F_(3,1)=D1-3T2>0,

because T1>D2=2T2 implies D1>4T2. But delta1<delta2 forces
alpha1=alpha2, and increasing beta gives s1<=s2. Contradiction.
Thus a root cannot flow to an endpoint that itself donates.

If root flow to1 is positive and C1=0, then D1>=D2 and both root prefixes
have passed their switch. Wing balance gives s1-s2=(D1-D2)/2. Decreasing
alpha has alpha1=alpha2 when D1>D2, so increasing beta contradicts that
positive difference. Therefore D1=D2=:a, and theta>a. If C5=0 also, this
is the entire strict-central-star class already excluded in Section6.

It remains to treat the MIXED case C5>0, which is not the star class.
Write b=D4, psi=T5>b, d=D5=3psi-b. The preceding argument rules out
farther root flow to5. Since theta>psi>b, root flow to4 is theta-b.
Thus

    c=D3=5theta-2a-b,
    M1=M2=theta-a, M4=psi+theta-2b, M5=M3=0.

The equal left inputs and delta3<delta2 force beta1=beta2=beta3=:B.
Wing/source balances force alpha2-alpha3=a/2>0, so
alpha1=alpha2=1-a and A:=alpha3=alpha4 satisfy

    B=3a/2-theta, A=1-3a/2.

Here alpha3=alpha4 follows from delta3<delta4. Also beta4=beta5 because
d>2b. If beta3=beta4, source5 balance gives s5=1-psi>1-theta=s3,
whereas alpha5<=alpha3 and beta5=beta3 give s5<=s3. Contradiction.
Therefore beta3<beta4, and its last two-entry block has the positive value
E=1-3psi/2. Source5 balance then gives alpha5=psi/2>0, so A>0.

The ACTUAL right decreasing hull has only two remaining alternatives:

1. Blocks{34},{5}. Then A=1-(c+b)/2. Combining A=1-3a/2 and the closure
   c+b=5theta-2a yields theta=a, contradicting theta>a.
2. Block{345}. Then A=1-(c+b+d)/3. If B=0, theta=3a/2; the equality for A
   gives c+b+d=3theta, while closure gives c+b=5theta-2a. Hence d=-a<0.
   If B>0, B=1-(2a+c)/3 is the actual positive first-three-entry mean.
   Since alpha4=alpha5 and beta4=beta5, the two right wing balances give
   theta=3b/2. The remaining exact mean/balance equalities reduce to

       9a+4theta-2b=6,
       3a+psi=2,
       13a-10theta-6psi+2b=0.

   They give a=126/241,theta=117/241, contradicting theta>a. No approximate
   numerical inference or symmetry assumption is used.

Equal right hull blocks are covered by either formula, so no hull-pooling
face is dropped. The reflected mixed case is identical. Consequently no
competing local minimum with a STRICT central maximal cut can have farther
root flow to1 or5.

## 9. Main's projection-normality calibration, including zero nearest flows

This section records a proof jointly developed with Main; it is a genuine
stationary calibration on the exact nearest-only domain, not a global lower
functional inequality. Sections7/8 reduce every strict-central-root competitor
to this domain. Tree locality makes cuts1/5 purely nearest donors; cut3 has
only its two nearest prefixes; cuts2/4 have no restoration. Therefore its
ACTUAL area is the full-hull nearest-restoration functional. Section7 also
forces the actual full hull to the block subspaces used by TIP109's free
quadratic Q, including all their coarsenings and zero faces.

Each full hull support equals its free block quadratic minus a weighted
squared distance E_L/E_R of its free block cuts to their nonnegative ordered
cone. The end/central restorations have analogous exact representations:

    R_end=max_(u>=0)[(D-2E)u-3u^2],
    R_center=max_(u,v>=0)[(D3-2D2)u+(D3-2D4)v
                              -3u^2-2uv-3v^2].

Completing each strictly concave quadratic shows its value is free energy
minus a weighted squared projection distance E_end/E_center. Thus on the
exact nearest-only domain, INCLUDING ZERO flows and simultaneous switches,

    G=Q-E_total,
    Q=40/31+Qdist(D-D*), D*=(25,11,34,11,25)/31,

where Qdist is the positive quadratic given by the five TIP109 squares.
All five families of free maximizing cuts/multipliers are feasible at D*.
Zero end/central flows are handled by their restoration deficits, rather
than continuing a free restoration quadratic through a negative multiplier.

For clarity, let E(z)=1/2||z-P_K z||_W^2 with closed convex cone K and
positive-definite W, and let z* in K. Put n=z-P_K z. Projection normality gives
<n,z*-P_K z>_W<=0, hence

    grad E(z) dot(z-z*)
       =||n||_W^2+<n,P_K z-z*>_W>=2E(z).

Every free cut map z(D) is affine, so this proves grad_D E dot(D-D*)>=2E
for each actual hull/restoration deficit. The expressions are C1 across
all projection faces. Using the actual full stationary gradient, whose
height1 boundary transfer was established in Section1,

    0=grad G dot(D-D*)
     =2Qdist-sum grad E dot(D-D*)

implies Qdist>=E_total. Consequently G>=40/31. This uses no independent
Loewner domination, no Jensen, no Hessian of a lower proxy, and no fixed
stationarity of a selected lower support. It is NOT a claim that G>=Q or
that all natural points minimize the same proxy.

Combining Sections7--9: every actual natural local minimum with D>0 and
a STRICT unique central maximal closure T3 satisfies G>=40/31; there is no
STRICTLY SUBTARGET minimum in that class. The accepted equality construction
has such a strict central root and is NOT excluded. The all-natural gap is now
noncentral maximal closures, ties of the central maximum with noncentral
cuts, and relevant limits of those domains. The twelve inverted-apex continua
remain entirely unclosed. Thus the global root and R116-1 remain OPEN.

## 10. Hand calibration for the opposite nearest alternation

This is a second conditional stationary calibration, NOT a claim that strict
noncentral max trees have been fully reduced to it. Assume the ACTUAL gaps
have only nearest restorations at cuts2/4, with R1=R3=R5=0. Assume the ACTUAL
decreasing hull projection lies in blocks{1},{23},{45}, and the increasing
one in blocks{12},{34},{5}, allowing all coarsenings/zeros. For example these
block constraints are forced by the four input inequalities
D2>=D1,D3 and D4>=D3,D5. They are explicit hypotheses here, not silently
inferred for every noncentral-max configuration.

The free hull and two free interior restorations give Q_even. In the full
invertible reflection coordinates a,b,c,d,e from TIP109,

    Q_even=3-2a-2b-c+7a^2/4+3b^2/4+c^2
              +ab/2+bc/2-ac/2+(7d^2+2de+3e^2)/4.

Its unique anchor is Ddagger=(8,18,6,18,8)/17, not imposed symmetry.
Set u=a-8/17,v=b-18/17,w=c-6/17. Direct completion gives

    Q_even=22/17
       +(7/4)(u+v/7-w/7)^2
       +(5/7)(v+2w/5)^2+(17/20)w^2
       +(7/4)(d+e/7)^2+(5/7)e^2.

At Ddagger the free decreasing hull is(9,5,5,4,4)/17, the increasing
hull its reverse, so all ordered/nonnegative cut constraints are feasible.
The free restoration maximizers at cut2 are(u,v)=(0,1/17), at cut4
(1/17,0). These are feasible ON the nonnegative multiplier faces; no
strict activation or genericity is assumed. The closure times are
(4,8,3,8,4)/17, with tied noncentral maxima, and their sum is27/17.
The exact radial value at that stationary anchor is22/17. It is above
the target by2/527, not a smaller witness.

Exactly as in Section9, the ACTUAL functional on the explicitly stated
nearest-even domain is Q_even minus all hull/restoration projection
deficits. Projection normality with this feasible anchor and ACTUAL full
stationarity therefore proves G>=22/17>40/31. Zero nearest flows and
all projection faces are included. No Jensen is used to obtain the
reflection coordinates or the anchor, and no area routine was executed.

Farther fills, different full-hull subspaces, non-nearest donors, and their
faces remain outside this conditional calculation. The four root hypotheses
are not established merely by the two noncentral peak heights or by the
existence of this stationary anchor. Hence this is not closure of the
noncentral-max obligation.

## 11. Main's endpoint-tie extension of the central-max reduction

Main proposed, and Builder checked, the following extension of Sections7--9:

    T3=theta>=T1,T5, theta>max(T2,T4).

Endpoint ties are now retained; an inner cut tied to the central maximum is
NOT included. Section7 still excludes T2>T1, because T2<theta and root3
remains a flow barrier; reflection still gives T5>=T4. The input violations
forcing the full hull P0 blocks remain. Root flow to an endpoint tied with
theta is0, so any positive farther endpoint flow occurs on the STRICT side.
The previous no-far proof works unless the opposite active endpoint has
T5=theta (or its reflection), with the endpoint-tie star repair recorded
below. The original draft asserted that the strict Section6 star calculation
could simply be reused. Critic found a genuine strict-gap defect in that
assertion: its no-left-flow separated-beta1 argument used u<2theta,
whereas an endpoint tie permits u=c=2theta and C3=0. That literal reuse
is withdrawn; Section6 itself retains its explicit STRICT hypotheses.

For the NEW mixed face, retain root farther-left flow, D1=D2=a<theta,
C5>0, and psi=T5=theta. If beta3<beta4, the prior positive right-block
equations still apply. The{34}/{5} case gives theta=a; the{345} case is
already incompatible with source3/source5 equality and the strict beta
drop (or with the prior exact equations). The only new alternative is
beta3=beta4. The left prefix already pools123 and the right pools45, so
ALL beta entries equal B. Source3 and source5 have equal exposure1-theta;
decreasing order then forces alpha3=alpha4=alpha5=A. Left balance gives

    B=3a/2-theta, A=1-3a/2.

Right wing balance gives b=D4=2theta/3, whence

    d=D5=7theta/3, c=D3=13theta/3-2a.

If A>0, the ACTUAL positive alpha345 block mean is
1-(c+b+d)/3=1-22theta/9+2a/3. Equating it to1-3a/2 gives
theta=39a/44<a, contradicting farther-left flow. If A=0, a=2/3.
For theta<1, B=1-theta>0, and the ACTUAL full beta block has mean
1-sum D/5=1-22theta/15. This gives theta=0, impossible. At theta=1,
its zero block cannot be replaced by a free mean, but sum T gives
r=a+2theta+b/2=3>49/31. Thus this mixed endpoint-tie face is excluded
without assuming strict hull cuts, a positive zero-block mean, or genericity.

### 11.1 Explicit repair of the tied endpoint star branch

Use Section6's u=D1,v=D2,w=D4,z=D5,c=D3, with only central outgoing
flow, T3=theta>=T1,T5 and theta>max(T2,T4). The old separated-beta1,
no-left-flow branch gives u=c when beta1>0. When beta1=0 it instead
gives u+c=2 and u>=1; since u<=2theta<=c, this forces u=c=1.
Thus both branches reduce to u=c. Under strict endpoint timing Section6
contradicted u<2theta<=c. Under the present weak endpoint inequality
we only have u<=2theta<=c, so u=c=2theta and C3=0 is possible at that
stage; it cannot be discarded by the old inequality. All central flows
are then zero. Actual source balances give s1=s3=1-theta.

The already established positive alpha12 block and separated positive
beta23 block have means

    alpha1=alpha2=1-(u+v)/2,
    beta2=beta3=1-(v+c)/2.

Thus u=c gives alpha1=beta3. Combining this with s1=s3 gives
alpha3=beta1. If beta1=0, the source3 balance nevertheless gives

    alpha3=1-theta-beta3=v/2>0,

a contradiction. If beta1>0, its separated singleton value is
beta1=1-u=delta3, hence alpha3=delta3. Strict inner timing T4<theta
gives delta4>delta3, and T5<=theta gives delta5>=delta3. The strict
drop alpha2>alpha3, already forced by T2<theta, isolates the actual
decreasing projection on entries3..5. Its first value is at least the
first-two-entry mean (delta3+delta4)/2>delta3, contradicting
alpha3=delta3. This uses the exact ordered projection, not a fictitious
mean on a zero block. Reflection repairs the other endpoint branch.

For the farther-left-flow branch alone C3>0 already forces c>2theta,
so the exceptional zero-C3 branch cannot occur there. Critic's broader
repair above is recorded explicitly to justify the full endpoint-tie
star reuse without hiding that distinction. Main requested this repair;
Critic supplied and checked the argument. It changes no strict Section6
statement and opens no new proof branch or milestone.

Consequently the actual-stationary projection-normality calibration applies
throughout this central-max regime WITH ENDPOINT TIES and STRICT INNER CUTS:
every actual local minimum in it satisfies G>=40/31. The accepted equality
configuration is retained. Noncentral larger maxima, maxima tied with inner
cut2/4, and all twelve inverted-apex continua remain OPEN.

## 12. Current noncentral-root attempt; no closure

For strict maximal T2=tau, the left leaf has D1=2T1 and only incoming
F_(2,1)=[tau-2T1]_+. Adjacent delta1>delta2 forces beta1=beta2, and
source/leaf balance gives alpha1>alpha2 and beta1=T1-F_(2,1)>=0.
If the right subtree has strict maximum T3 aboveT4/T5, incoming root
prefix exposure satisfies F_(2,3)>=F_(2,4)>=F_(2,5) and
T3+F_(2,3)<tau by the prefix ratio bound. Thus beta3>beta2, forcing
D2>=D3. Within that right-subtree case, T4>T5 is impossible: the input
D4>D5 makes the root2 right-prefix k2 line inactive (its switch into
that line at D4 follows its switch out at D5), so F_(2,4)=F_(2,5).
The same two-singleton projection contradiction as Section7 then yields
T5>=T4. These are exploratory necessary reductions, not a value bound.

The adjacent donors2/3, possible donor5, and longer root2 prefixes still
couple two different subtree exposure scales. No complete actual-stationary
exclusion/value argument has been obtained for them, for right-subtree roots
4/5, or for strict root1 (reflections cover4/5 only after those proofs exist).
The nearest-even calibration in Section10 cannot be substituted: these
configurations have not been proved nearest-only or in its hull subspaces.
This is the specific remaining obstruction of the present hand attempt,
not a claim of mathematical impossibility or a completed finite case cover.

## 13. Compact exact all-prefix dual; Main coefficient correction preserved

This is a compact restatement of the exact coupling, not a new global proof.
For cut i use four coordinates f_j,j!=i. On either side, require f to be
nonnegative and nonincreasing with distance FROM cut i. Let K_i be the
product of these two cones. The integrated side prefix envelope is exactly

    I_i(T,D)=max_(f in K_i)[sum_(j!=i)(T-D_j)f_j-sum f_j^2/2].

Indeed f_j is the measure of the active prefix containing edge j; the
prefix-depth representation is the same ordered-cut maximization used for
the actual hull. It gives the nonnegative isotonic projection of the input
T-D_j, with the order directed away from i on each side.

Take the ACTUAL minimizing T_i and its unique maximizing f*. Then
sum f*=c_i(T_i), and closure says T_i=D_i/2-sum f*/2>=0.
The projection normality condition for f* is exactly the optimality condition
of the strictly concave quadratic after eliminating T. This DIRECT KKT
argument proves the identity without swapping an unjustified min and max:

    R_i=max_(f in K_i)[(D_i/2)sum f_j-sum_(j!=i)D_j f_j
                          -sum f_j^2/2-(sum f_j)^2/4].

Unconstrained T would also have the same minimum: for T<=0 and natural
D>=0, I_i(T,D)=0 and the derivative is2T-D_i<=0, so no lower negative-T
minimum occurs. The direct KKT proof does not need this observation.

The metric is W=Id+(1/2)11^T in four dimensions, with
W^-1=Id-(1/6)11^T. Writing S=sum_(i=1)^5 D_i, its unrestricted maximizing
coordinate is z_j=S/6-D_j, j!=i. This gives free energy minus a squared
W-distance from z to K_i. Main's initial summed-free-energy coefficient
11/4 was incorrect; Builder corrected it, and Main accepted the correction.
The exact sum is

    sum_i R_i_free=(9/4)sum_i D_i^2-(5/12)S^2.

To check by hand, set b_(i,j)=D_i/2-D_j. Then
sum_(i,j!=i)b_(i,j)^2=6sum D_i^2-S^2 and
sum_i(3D_i-S)^2=9sum D_i^2-S^2. The free energy sum is half the first
minus1/12 of the second, yielding9/4, not11/4. At all D_i=1 each free
R_i=1/6, sum5/6; the withdrawn11/4 coefficient would give10/3 instead.

At the sharp accepted anchor, the unrestricted all-prefix z contains
NEGATIVE coordinates and is not in K_i. Therefore Section9's feasible-anchor
normality inequality CANNOT be applied globally to these deficits. The
compact dual retains the same missing whole active-cone/actual-stationary
coupling; it does not eliminate noncentral roots, inner ties or inverted
apex continua. No code, sample or mathematical subprocess was used.

## 14. Strict root2 with strict right-subtree root4: complete class reduction

This is a whole specified actual closure-tree class, not a conclusion that
every natural competitor has this class. Assume D_i>0, actual full
stationarity, bottom connectivity and r=sum T_i<=49/31, with

    T_2=tau>max(T_1,T_3,T_4,T_5),
    T_4=psi>max(T_3,T_5).

Write T_1=q, D_1=2q, D_3=a=2T_3, D_5=b=2T_5.
Tree locality gives C_1=C_3=C_5=0. The only child4 outgoing
exposures are L=[psi-a]_+ to3 and R=[psi-b]_+ to5, so

    c=D_4=2psi+L+R.

The root2 exposure to1 is e=[tau-2q]_+. On its right the only possible
prefix lines are t-a, 2t-a-c, 3t-a-c-b. Because c>=2psi>b, the
middle line is never maximal: its switch from the first occurs at c,
after its switch to the third at b. Thus root2 exposures to4 and5
are equal, denoted f; its exposure to3 is g>=f.

We have D_2>=2tau>D_1,a and c>=2psi>a,b. These are the input
violations forcing actual alpha to pool23 and45, and actual beta
to pool12 and34, with all additional coarsenings/clipping retained.
Sources2 and4 have no other incoming exposure except f into4, hence

    s_2=1-tau,             s_4=1-psi-f.

The prefix timing inequality gives psi+f<tau. Directly, if f>0,
the length3 line cannot dominate length1 before
t>(c+b)/2>psi, so its active exposure f<tau-psi; if f=0 use
psi<tau. Thus s_4>s_2.
Since alpha_2>=alpha_4, beta_4>beta_2: the beta12 and beta34
blocks are strictly separate, and beta34 is positive. At leaf5,

    s_5-s_4=psi-b/2-R>0.

Since alpha_4=alpha_5, beta_5>beta_4. Consequently beta5 is an
isolated positive coordinate, beta_5=1-b, whereas beta34 is the
positive mean 1-(a+c)/2. Equating their difference gives

    b=a+L+3R.

If R>0 then 4b=a+L+3psi>=4psi, contradicting b<psi.
Therefore R=0 and b=a+L=max(a,psi).

If f=0, all actual restoration is nearest-only at2 and4, with the
full actual hull in the opposite-alternation block subspaces. Section10
applies, including vanishing nearest exposures and all hull deficits,
and gives G>=22/17>40/31. It remains to exclude f>0.

### 14.1 The case a<psi

Here L=psi-a, b=psi, c=3psi-a. The right root prefix switches from
length1 to length3 at (c+b)/2=2psi-a/2>a. Thus f>0 implies

    g=tau-a,             f=tau-2psi+a/2.

Incoming exposure at3 is L+g=tau+psi-2a, and at4 is f. Actual
stationarity yields s_3-s_4=2(a-psi)<0. But beta_3=beta_4 and
alpha_3>=alpha_4 imply s_3-s_4>=0. Contradiction.

### 14.2 The case a>=psi

Now L=R=0, b=a, c=2psi. Since psi>a/2, the right root prefix
switches at psi+a/2>a. Thus

    g=tau-a,             f=tau-psi-a/2>0.

Actual stationarity gives s_3=s_4=1-tau+a/2. Since beta34 is one
block, alpha_3=alpha_4. Together with forced alpha23 and45 this
pools all of alpha2345 into A>=0. At leaf1,
s_1-s_2=tau-q-e>0, while beta_1=beta_2; hence alpha1 is strictly
separate and positive, alpha_1=1-2q. Put B_L=beta_1=beta_2.
The isolated beta5 and the leaf5 balance give

    A=a+psi-tau,             B_L=1-a-psi.

Let v=a+psi. Root2 closure and leaf1 balance now give exactly

    D_2=5tau+e-2v,           B_L=q-e=1-v,
    e=[tau-2q]_+,            A=v-tau.

If A=0 and B_L>0, then v=tau and D_2=3tau+e. The positive
beta12 mean gives q+D_2/2=tau, impossible for q>0 and
D_2>=3tau. If A=B_L=0, then v=tau=1, q=e=1/3 and
r=q+tau+psi+a=7/3>49/31. Thus a competing point must have A>0.

Suppose first B_L>0. The exact positive alpha2345 mean is

    A=1-D_2/4-v/2.

It implies v=1-(tau+e)/4 and 4q=tau+5e. The possibility e=0
would give q=tau/4, contradicting e=[tau-2q]_+=tau/2.
Therefore e=tau/7 and q=3tau/7. The positive beta12 mean,
B_L=1-q-D_2/2, gives 3tau+e+q=2, hence

    tau=14/25, q=6/25, e=2/25, v=21/25.

Far exposure requires tau>psi+a/2=v-a/2, so a>14/25.
But strict child4 closure psi>a/2 gives a<2v/3=14/25.
Contradiction.

Finally, if B_L=0 and A>0, then v=1, q=e=tau/3. The same
positive alpha mean and A=1-tau give e=-tau, impossible for
tau>0. All zero-block alternatives were treated without asserting
a positive-block mean on a zero block.

Thus f>0 is impossible for a competing actual stationary point in
this entire strict root2/right-subtree4 class. Every such point has
G>=22/17. Reflection gives the strict root4/left-subtree2 class.
Main independently handchecked the actual restoration/source balances,
projection means and zero-block alternatives; Critic accepted this entire
section after an independent hostile check. This is a reviewed conditional
class theorem, not a global closure or a replacement milestone.
Other noncentral trees, including root1, root2/right-subtree3 or5,
and inner maximum ties, are NOT covered. This class reduction does
not close the committed all-natural obligation or the inverted cases.

## Ledger and scope

Ordinary read-only source/clock calls and this apply_patch only. Mathematical
subprocesses0; no optimizer, samples, enumeration, LP, replay, code, build,
UI/API/Git action, scratch copy or old-file edit. One ordinary source search
used an incorrect missing report pathname and returned exit2; no mathematics
was executed. One ordinary apply_patch used stale context and failed without
changing any file. Initial aggregate protocol/history reads were truncated and
the relevant latest active/handoff checkpoint plus the full selected proof
notes and skill/report instructions were subsequently read separately.

Tiếng Việt: đã suy lại các đồng nhất thức thời gian và luồng từ diện tích
THỰC, bổ sung ràng buộc luồng không vượt qua một khe đóng muộn hơn hoặc
bằng nó, và cân bằng ghép giữa luồng với từng khối của hai đường bao. Kiểm
bằng tay loại được mẫu D đơn điệu cạnh tranh; chứng minh trên lớp cực đại
giữa có khe trong đóng sớm và lớp gốc2/cây con phải4 (cùng ảnh đối xứng)
đã được rà soát độc lập. Chưa có bất đẳng thức ghép
sắc cho toàn miền tự nhiên ngoài C; không bỏ12 miền đảo thứ tự. K6 toàn bộ
số thực vẫn MỞ, không tuyên bố định lý mới trên toàn miền.
