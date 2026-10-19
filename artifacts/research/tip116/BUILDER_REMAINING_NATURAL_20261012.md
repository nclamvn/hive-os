# TIP116 continuation — remaining natural stationary structure

STATUS: PARTIAL / global K6 OPEN. Hand-only, mathematical subprocesses0.
Direct continuation R116-1..3; hardstop2026-10-12 02:10:02UTC.
Frozen predecessor notes are unchanged. The full natural and twelve inverted
continua/faces are not replaced by any conditional result in this note.

## 1. Exact definitions retained from the reviewed predecessor

For natural apices, D_i=A_(i+1)-A_i>0, delta_i=1-D_i. The actual full
left/right hull cuts are alpha=P_dec_nonnegative(delta) and
beta=P_inc_nonnegative(delta); s=alpha+beta. Let T_i be actual cut closure,
F_(i,j) the integrated ACTUAL active-prefix exposure from cut i to edge j,
C_i=sum_j F_(i,j), M_j=sum_i F_(i,j). Actual stationarity gives

    D_i=2T_i+C_i,           1=s_i+T_i+M_i.

Every prefix that contributes flow stays between cuts of strictly larger
closure time: a cut tied with or above its donor is a flow barrier.
If a donor of height H exposes an edge of closure t, its exposure is
strictly less than H-t, by the actual prefix closure-ratio inequality.
No arbitrary DAG or proxy stationary equation is used here.

Projection facts used below follow from exact block polar conditions.
For the increasing projection, a strict positive boundary between i and
i+1 implies delta_i<=beta_i<beta_(i+1)<=delta_(i+1).
An input violation delta_i>delta_(i+1) forces beta_i=beta_(i+1).
For the decreasing projection the reversed statements hold. A separated
positive singleton has its actual input value; a positive constant block
has its actual mean. Zero blocks are never replaced by a free mean.

## 2. Entire strict root2 / right-subtree root3 class is nonstationary

Assume the actual closure heights satisfy

    T2=tau>max(T1,T3,T4,T5),
    T3=theta>max(T4,T5).

These hypotheses allow T4=T5. No symmetry, fixed hull coarsening, fixed
prefix phase, or positive flow at either source is imposed. We prove that
NO actual full stationary point with D>0 has this class. Thus no local
minimum in the class can compete. Reflection treats root4/left-subtree3.

### 2.1 Left leaf and the source3 projection boundary

Put q=T1. Cut1 has no outgoing flow, D1=2q; its incoming root2 exposure
is e=[tau-2q]_+. Hence s1-s2=tau-q-e>0. Since D2>=2tau>D1,
beta1=beta2. Therefore alpha1>alpha2, so alpha1=delta1>0 is a
separated singleton.

Source3 has incoming only from root2. Its root exposure F_(2,3) is
strictly less than tau-theta, so s3>s2. Decreasing order gives
alpha2>=alpha3, forcing beta3>beta2. This positive increasing boundary
forces D2>D3 and hence alpha2=alpha3. In particular beta3>0.

### 2.2 The right leaf order is weakly T5>=T4

Suppose instead T4=x>T5=y. Cut5 is a leaf: D5=2y. Cut4 can only
donate to5, with ell=[x-2y]_+ and D4=2x+ell>D5.
The root2 right length2 prefix is never active: its switch into that
line is at D4, after its switch out at D5. Thus F_(2,4)=F_(2,5)=f.
The source3 right length1 prefix is likewise never positive and active,
because its switch to length2 at D5 precedes its zero crossing D4.
Thus F_(3,4)=F_(3,5)=g, with the exact timing bound g<theta-x.

Source4 has s4=1-x-f-g, while source3 has
s3=1-theta-F_(2,3). Since F_(2,3)>=f and x+g<theta, s4>s3.
Consequently beta4>beta3. Also

    s5-s4=x-y-ell>0.

The input D4>D5 forces alpha4=alpha5, so beta5>beta4.
Both strict increasing boundaries isolate beta4 as a positive singleton;
beta5 is also a positive singleton. Thus beta4=delta4, beta5=delta5.
Their difference is D4-D5=2(x-y)+ell. The preceding source/leaf
balance instead gives x-y-ell. Equality implies x-y+2ell=0,
impossible for x>y. Therefore T5>=T4, including equality.

### 2.3 Exact flows on the remaining weakly ordered right subtree

Set v=T4, psi=T5>=v, b=D4=2v. Cut4 has no outgoing flow.
Cut5 has only the nearest exposure ell=[psi-b]_+ to4, so

    d=D5=2psi+ell.

Source3 has two right prefix lines t-b and 2t-b-d. Since d>=b,
the exact outgoing exposures, including all inactive and tie faces, are

    g=F_(3,4)=[theta-b]_+,
    k=F_(3,5)=[theta-d]_+,
    c=D3=2theta+g+k.

Since c>=2theta>b, root2's right length1 line t-c cannot be positive
and maximal: its switch to length2 occurs at b<c, before its zero
crossing. Therefore its integrated exposures satisfy exactly

    F_(2,3)=F_(2,4)=f,       F_(2,5)=h<=f.

No formula choosing between root length2 and length3 phases is required.
We already have alpha2=alpha3; c>b forces alpha3=alpha4. Put
alpha2=alpha3=alpha4=A, retaining possible pooling with5 and A=0.
The first increasing block beta12 is separated from positive beta3.
As d>=b, beta4=beta5=:E; equality d=b also gives equal end values.
Thus the ACTUAL remaining increasing hull has either singleton3/{45}
or one block{345}; all zero and merging possibilities are retained.

### 2.4 The increasing block345 cannot occur

If beta3=beta4=beta5, the equality alpha3=alpha4 requires s3=s4.
Their exact balances give

    theta-v-g-ell=0.

If theta<=2v then g=ell=0, contradicting theta>psi>=v.
If theta>2v and psi<=2v then g=theta-2v, ell=0, giving v=0.
Otherwise psi>2v, so g=theta-2v, ell=psi-2v and psi=3v.
Consequently ell=v, d=7v, and k=[theta-7v]_+.

The remaining actual source/leaf balances then give

    s5-s4=f-h+theta-3v-k>0.

Indeed f>=h, and theta>psi=3v. If theta<=7v the last k is0;
if theta>7v, theta-3v-k=4v>0. But beta5=beta4 and
alpha5<=alpha4 require s5-s4<=0. Contradiction.

### 2.5 Two positive actual block means give the final contradiction

Thus beta3<beta4=beta5. With the already strict beta2<beta3,
beta3 is a positive singleton delta3=1-c; E is the positive ACTUAL
mean of block45, E=1-(b+d)/2. Source3 balance gives

    A=c-theta-f=theta+g+k-f.

Leaf4 balance and the exact positive block45 mean give instead

    A=1-v-f-g-ell-E=psi-f-g-ell/2.

Equating these yields

    psi-theta=2g+k+ell/2>=0,

contradicting psi<theta. No positivity of A or beta12 was needed.
This excludes the ENTIRE stated strict root2/right-subtree3 class and
its reflection, not merely a phase or a stationary example.

## 3. Main's adjacent global-max tie exclusion: full polar completion

Main proposed the negative-variation part; Builder independently checked
it and supplied the global polar squeeze completing its both-tight branch.
Assume an actual competing local minimum with D>0 and r<=49/31 has

    T_k=T_(k+1)=theta=max_i T_i,  k in{1,2,3,4}.

No donor can expose a global-max edge, so M_k=M_(k+1)=0 and
s_k=s_(k+1)=1-theta. Compare the two inputs delta_k,delta_(k+1).
If they differ, the input violation forces one of the two projections to
pool them; equal s then forces the other projection to pool them too.
If they are equal, either their projected values are equal already, or
the monotone differences of alpha and beta could only cancel if both
are zero. Thus in every case

    alpha_k=alpha_(k+1)=a, beta_k=beta_(k+1)=b.

For clarity in the equal-input case, if alpha drops strictly between
them, its boundary polar inequalities give delta_k>=alpha_k>
alpha_(k+1)>=delta_(k+1), impossible for equal inputs. The increasing
projection has the reflected statement. Hence both pool equal inputs.

Define the GLOBAL cone polar residuals

    P_j=sum_(i<=j)(delta_i-alpha_i)<=0,
    S_j=sum_(i>=j)(delta_i-beta_i)<=0.

Their complementarity identities hold even on zero projection blocks.
Perturb D_k by h and D_(k+1) by -h. All P's except P_k are unchanged;
P_k changes by -h. All S's except S_(k+1) are unchanged;
S_(k+1) changes by h. The two projection orthogonality identities
are unchanged because each projection has equal entries across the pair.
If P_k<0, choose h<0; if S_(k+1)<0, choose h>0. For sufficiently
small h these choices preserve BOTH actual full projection fits.

Every other restoration R_i is locally unchanged by this perturbation:
an active prefix cannot contain a global-max edge. More strongly, any
such prefix of length m has intercept >=(m+1)theta, while mT_i<=mtheta,
so it has fixed negative margin at least theta. It stays inactive under
small perturbation, even if other global maxima or terminal switches exist.
The restorations at k and k+1 depend on their own D, but not on the
other global-max D. The exact raw-minus-restoration curvature is

    partial^2[-D_i^2/4+R_i]/partial D_i^2
       =-partial T_i/partial D_i=-1/(2+l_i)<0,

where l_i is its actual terminal active-prefix slope. At a simultaneous
switch choose the actual one-sided slope; every resulting piece has this
strictly negative curvature. Since stationarity kills the linear term,
the area changes along the permitted sign by

    -[1/(2+l_k)+1/(2+l_(k+1))]h^2/2<0

on the sufficiently small terminal phase. This is a feasible ACTUAL-area
variation: 2theta<=r<=49/31 gives theta<=49/62<1, leaving a strict
height1 margin and no unphysical restoration tail. Thus a local minimum
requires both P_k=0 and S_(k+1)=0.

The neighboring polar inequalities now force

    delta_k>=a>=delta_(k+1)>=b>=delta_k,

using P_(k-1),P_(k+1),S_k,S_(k+2); take P_0=S_6=0 at endpoints.
Hence a=b=delta_k=delta_(k+1).

Here is the WHOLE, not iterative, finish. On the left of the boundary,
alpha_i>=a and beta_i<=a. The tight P_k gives

    sum_left delta=sum_left alpha>=ka.

The global beta polar S_1<=0 and tight S_(k+1)=0 give instead
sum_left delta<=sum_left beta<=ka. Therefore all left alpha and beta
are exactly a and sum_left delta=ka. On the right, alpha_i<=a and
beta_i>=a. The tight S_(k+1) gives

    sum_right delta=sum_right beta>=(5-k)a,

whereas global P_5<=0 and P_k=0 give
sum_right delta<=sum_right alpha<=(5-k)a. Thus all right alpha and
beta are also a, with sum_right delta=(5-k)a. Both projections are
globally constant a and sum delta=5a. The prefix polar inequality
sum_(i<=j)(delta_i-a)<=0 and the suffix polar inequality, using total0,
give opposite inequalities for every prefix. Hence EVERY delta_i=a.

All D_i are equal. Their actual closure is D_i/2 because for any
m-edge interval mD/(m+1)>=D/2. Source stationarity gives
2a=1-theta and D=1-a=2theta, so theta=1/3, D=2/3, r=5/3.
This violates the competing range r<=49/31. No adjacent global-max
tie can therefore occur at a competing actual local minimum.

This argument covers ALL four locations and any additional maxima;
no genericity or perturbation replacing the original tie by an assumed
strict pattern is used. Review remains separate from the mathematical
claim recorded here.

## 4. Nonadjacent global tie2/4 is exactly nearest-even

If T2=T4=theta=max T, all other ties adjacent to one of them are
already excluded by Section3 at a competing minimum. Even without
that exclusion, tree barriers give no outgoing flow from cuts1/3/5,
and allow cuts2/4 only their two nearest edges. Thus actual restoration
is nearest-only at2/4. The leaves have D1=2T1,D3=2T3,D5=2T5;
the sources have D2,D4>=2theta. Consequently

    D2>=D1,D3,             D4>=D3,D5.

These input violations force the actual full hull into alpha blocks
{1},{23},{45} and beta blocks{12},{34},{5}, with all coarsenings and
zero faces retained. The reviewed predecessor Section10 EXACT
nearest-even stationary calibration applies and gives G>=22/17>40/31.
This closes this whole tied-max class, not every nonadjacent tie.

## 5. Exact obstruction to an overstrong universal nearest-only shortcut

Main asked whether ACTUAL local-minimum curvature could exclude EVERY
positive farther-prefix exposure. The answer to that unqualified proposal
is NO. The following is an exact local theorem, not a numerical sample.
It does NOT refute exclusion of SUBTARGET farther-fill minima.

Consider the already retained actual stationary vector

    D0=(12,12,30,12,12)/23.

Its actual projections are alpha12=11/23,alpha345=5/23 and
beta123=5/23,beta45=11/23. The between-block drops are strict.
Internal residuals in alpha345 and beta123 are strict; only the equal
inputs1/2 and4/5 permit unpooling. Its actual closures are

    T=(6,6,13,6,6)/23.

Only cut3 donates, with both two-edge prefixes active at its terminal
height. The terminal height13/23 exceeds the four wing D's12/23;
all four noncentral restorations vanish with strict closure margins.
These properties persist in a sufficiently small neighborhood, except
the two explicit equal-input pooling/flow-order switches below.

Write

    a=(D1+D2)/2, b=(D4+D5)/2, c=D3,
    d=(D1-D2)/2, e=(D5-D4)/2,
    x=(a+b)/2, z=(a-b)/2.

For d>=0, the actual alpha12 hull remains pooled. For d<0, its two
input values are decreasing and unpool, adding EXACTLY d^2 to the
hull energy. The left source3 integrated prefix envelope, whose terminal
height is above both inputs, is exactly

    (T-a)^2+d^2  if d>=0,
    (T-a)^2      if d<0.

The first formula comes from its two slope increments at a-d and a+d;
the second from its single slope2 increment at a. Thus the restoration
adds d_+^2 while the hull adds d_-^2: together exactly d^2.
Reflection gives exactly e^2 on the right, with beta45 unpooling for
e<0 and the source3 prefix splitting for e>=0.

After the exact convex minimization in terminal T,

    R3=c^2/4+a^2+b^2-(c/2+a+b)^2/3+d_+^2+e_+^2.

The raw gap-square term contributes -(d^2+e^2)/2. Combining it with
the actual hull and restoration switches gives the positive residual
(d^2+e^2)/2. The remaining free block expression is

    Qstar=3-2a-2b-c+(11/6)(a^2+b^2)-(2/3)ab
                         +c(a+b)/3+c^2/4.

Direct completion, with no reflection assumption on the perturbed D,
gives the exact ACTUAL local identity

    G=30/23
      +3[(x-12/23)+(c-30/23)/9]^2
      +(23/108)(c-30/23)^2+(13/3)z^2
      +(d^2+e^2)/2.

All five difference directions have strictly positive coefficients.
Hence D0 is a STRICT local minimum of the actual union area, including
all four one-sided combinations of the hull/prefix-order switches.
It has positive farther3-to1 and3-to5 exposure. No unphysical height1
tail is present: T3=13/23<1 and all other closures are6/23.

At this point r=37/23>49/31 and G=30/23>40/31. It is not a
counterexample to K6 or to a theorem restricted to competing minima.
It does refute the attempted stronger structural rule that ALL actual
local minima must be nearest-only. That shortcut is explicitly withdrawn;
farther exposure remains in the committed whole proof obligation.

## 6. Universal endpoint-max necessary condition; clipping retained

Suppose T1=theta=max T at an actual competing minimum. M1=0, so
alpha1+beta1=1-theta. Every m-edge prefix has actual closure ratio
at least theta, hence sum_prefix D>=(m+1)theta and

    mean_prefix delta<=1-(1+1/m)theta<=1-6theta/5.

Alpha1 is the positive part of the maximum of those prefix means;
beta1 is the positive part of their minimum. The clipping needs an
explicit preliminary case. If theta>=5/6, all those means are<=0,
so alpha1=beta1=0 and stationarity forces theta=1. This exceptional
case makes p1 a bottom minimum with a maximum at a later label,
violating the retained plus-side bottom slope>=3. It is not a competitor.

Therefore theta<5/6, and the unclipped upper bound is legitimate:

    alpha1<=1-6theta/5,
    beta1=1-theta-alpha1>=theta/5>0.

All beta entries are positive; their total fit gives sum beta=sum delta,
so label1 is a bottom maximum and r=sum alpha. Moreover beta1, the
positive first-block mean, is at most delta1=1-2theta-C1. Thus

    (11/5)theta+C1<=1,             theta<=5/11.

The bound is strict when C1>0. Reflection treats a global endpoint5
root and forces alpha5>0, bottom minimum label6. These are whole endpoint
SOURCE necessary conditions; they neither imply monotone D nor prove the
required value bound. They remove only one endpoint-hull slack term.

## 7. Whole one-donor root2 / right-subtree5 class, including farther flow

This class proof does NOT assume nearest-only, symmetry or a hull pattern.
Assume actual stationarity/local minimality, D>0, and

    T2=tau>max(T1,T3,T4,T5),
    T5=psi>max(T3,T4),      C3=C4=C5=0.

Cut1 has C1=0 by the root2 barrier. Only root2 may donate, but initially
ALL three right prefixes are allowed. Put T1=q,T3=theta,T4=v,
D1=2q,D3=2theta,D4=2v,D5=2psi. Its left exposure is
e=[tau-2q]_+. As in Section2, beta12 is pooled and alpha1 is an
isolated positive singleton. Let f3,f4,f5 be root2's actual right
exposures into3,4,5. The right leaf5 no-outflow conditions give

    2v>=psi,             theta+v>=psi.

### 7.1 Root2 cannot expose5 at stationarity

Since D5 is larger than D3,D4, the length3 root prefix becomes active
only after t=D5=2psi. If theta<=v, the exact exposures are
f3=[tau-2theta]_+, f4=[tau-2v]_+, f5=[tau-2psi]_+.
If theta>v, they are f3=f4=[tau-theta-v]_+,
f5=[tau-2psi]_+. If tau>=2psi, then

    s4-s5=psi-v-f4+f5
       =-(psi-v) if theta<=v,
       =theta-psi if theta>v.

Both are strictly negative, including tau=2psi. But D5>D4 forces
beta4=beta5, and decreasing order requires s4-s5=alpha4-alpha5>=0.
Therefore tau<2psi and f5=0. The displayed formulas for f3,f4 remain
valid below that height.

In either ordering, theta+f3<tau. Hence s3>s2, forcing beta3>beta2
and D2>D3; therefore alpha2=alpha3. The ACTUAL beta possibilities
are a separated positive singleton3 followed by positive block45,
or positive block345. No zero block on the right is possible.

### 7.2 Alpha5 is positive and cannot pool with4

If alpha5=0, source5 balance gives beta5=1-psi. If beta45 is the
separate block its positive mean gives v=0. If beta345 is the block,
its positive mean gives theta+v=psi/2, contradicting theta+v>=psi.
Thus alpha5>0.

Suppose alpha4=alpha5. Because the inputs delta4>delta5 are strictly
decreasing and this common block is positive, it cannot be a separate
block45: its first prefix residual would have the wrong sign. It must
join alpha23, making alpha2345=A. Actual balance then requires

    f4=psi-v>0.

If theta>v, f3=f4 and tau=psi+theta. A singleton beta3 and actual
block45 mean would give theta=psi; pooled beta345 gives s3=s5,
hence theta=v. Both contradict theta>v.

If theta<v, tau=psi+v and f3=psi+v-2theta. Then s3-s5=theta-v<0,
so beta3 is the separated singleton. Source3 and source5 give
A=3theta-psi-v and beta45=1-3theta+v. The ACTUAL block45 mean is
1-v-psi, so 3theta=2v+psi>3v, contradicting theta<v.

The remaining theta=v case has tau=psi+v and f3=f4=psi-v.
Beta345 is pooled. The exact positive alpha2345/beta345 means give

    A=1-3psi/2-v-e/4,
    E=1-(4v+2psi)/3,
    14psi+28v+3e=12.

Source2 gives B=beta12=psi/2+e/4>0, while leaf1 gives q=B+e.
Thus q=psi/2+5e/4 and e=[v-5e/2]_+ imply e=2v/7.
The positive beta12 mean then gives 21psi+4v=7. Combining this
with 98psi+202v=84 gives v=psi=7/25, contradicting psi>v.
All cases are excluded. Therefore alpha4>alpha5; alpha5 is the
positive singleton delta5, and source5 gives beta5=psi.

### 7.3 Forced overlapping actual hull blocks

If alpha4 were a singleton, leaf4 balance would give
beta4=v-f4<=v<psi=beta5, contradicting beta4=beta5.
Therefore alpha4 joins alpha23, making alpha234=A>0.
If beta3 were a singleton, source3 would give A=theta-f3,
whereas block45's mean and leaf4 balance give A=psi-f4.
Thus theta-psi=f3-f4>=0, impossible. Consequently beta345=psi.
Its positive mean and the source3/4 balances give

    2theta+2v+5psi=3,
    theta-v=f4-f3<=0.

If theta<v, the exact f3/f4 formulas show the balance can hold only
when 2theta<tau<2v and tau=theta+v; then f4=0. If theta=v,
f3=f4=[tau-2v]_+.

### 7.4 The nearest/no-far alternatives have negative actual variation

In the preceding theta<v alternative, and in theta=v with tau<=2v,
the right root exposure is nearest-only. The shared hull blocks
alpha234 and beta345 have alpha prefix residual at3

    P3=-(delta4-A)=v+f4-psi=v-psi<0.

Except for the explicit leaf4 boundary below, choose h<0 in
D3->D3+h,D4->D4-h. The strict alpha residual and the beta suffix
polar sign preserve BOTH actual full fits. The farther root switch D4
increases, so no farther flow activates, including tau=D4. The root's
nearest3 prefix either remains active or activates from its zero face;
on every actual one-sided phase its minimized D3 curvature is either0
or1-1/(2+l)<1. The raw pair curvature is -1.

Boundary correction retained: the first draft claimed all leaf closure
margins here were strict. That was too strong. In theta<v, C4=0
only gives v<=2theta. If v<2theta the h<0 direction retains all zero
restorations. If v=2theta, h<0 would activate R4 and is NOT admissible
for that curvature calculation. Instead choose h>0: the beta suffix
residual is then

    S4=2-2v-4psi=(-2+4theta)/5<0,

using the actual beta345 mean and theta<psi<1/2. This strict slack
and the alpha polar sign preserve both fits. The leaf4 margin now
improves; root farther-switch margin is strict tau=3theta<D4=4theta;
leaf5 has strict margins because psi<tau=3theta<2v and
psi<theta+v=tau. Thus all other restorations remain0 in this direction.
In theta=v,tau<=2v the leaf margins are strict (psi<tau<=2v),
so the original h<0 direction applies. In every alternative the actual
second variation is strictly negative. Height1 is safe: the no-far
condition implies r>2tau, so competing range gives tau<49/62<1.
These alternatives are not local minima.

### 7.5 The only remaining stationary candidate and its whole value

It remains theta=v=t with tau>2t: a genuine farther length2 exposure
f3=f4=tau-2t. Set B=beta12=psi-t>0. Positive alpha234's actual
mean and source balances give

    tau=3B-e, q=B+e, e=[tau-2q]_+.

The zero-e alternative would give e=[B]_+>0. Hence
e=B/4, tau=11B/4, q=5B/4. The positive beta12 and beta345 means give

    63B-16t=8,             9t+5B=3.

Thus necessarily

    B=120/647, t=149/647, psi=269/647,
    tau=330/647, q=150/647, e=30/647.

This yields r=q+tau+2t+psi=1047/647>49/31. The actual stationary
radial value is G=(1+r)/2=847/647>40/31. Therefore the ENTIRE
stated one-donor class, including root farther prefixes, has no competing
local minimum. Reflection gives the corresponding root4/left-subtree1
one-donor class. No claim here excludes additional donors3/4/5 in the
original right-subtree5 tree; those remain in the global obligation.

## 8. Free-anchor calibration for the entire nearest mixed2/5 domain

Assume the ACTUAL functional at the stationary point has nearest-only
restoration at2 and5, with all other restorations zero, and actual hull
cuts in the subspaces

    alpha:{1},{234},{5},       beta:{12},{3},{45},

including every coarsening and zero face. No actual reflection or fixed
activation of the nearest flows is imposed. This is an explicitly stated
exact domain, not a claim that every remaining tree belongs to it.

The two free nearest restorations are

    R2_free=D2^2/4+(D1^2+D3^2)/2-(D1+D2+D3)^2/8,
    R5_free=(D5-2D4)^2/12.

Combining the free block hulls with the raw gaps gives

    Qmix=3-sum D+D^T A D/24,

where the symmetric matrix A is

    [21, 3,-3, 0, 0]
    [ 3, 7, 1, 4, 0]
    [-3, 1,19, 4, 0]
    [ 0, 4, 4,12, 2]
    [ 0, 0, 0, 2,14].

It is positive definite. For example w=(1,2,1,2,2) gives strict
weighted diagonal dominance margins
A_ii*w_i-sum_(j!=i)|A_ij|w_j=(12,2,6,8,24)>0.
Rescaling by diag(w) makes a symmetric strictly diagonally dominant
matrix with positive diagonal, giving a positive sum-of-squares form.
This is a hand coefficient check, not an executed eigenvalue computation.

Its unique FREE quadratic anchor is

    Dfree=(8,22,10,4,14)/17,      Qmix(Dfree)=22/17.

Indeed A*(8,22,10,4,14)^T=(204,204,204,204,204)^T.
The free hull optimizers there are
alpha=(9,5,5,5,3)/17 and beta=(2,2,7,8,8)/17, all feasible.
The free INCLUDED nearest exposures are F_(2,1)=2/17,
F_(2,3)=0 and F_(5,4)=2/17; the variational multipliers of the
predecessor Section9 are half those exposures. All included cone
constraints are feasible, including the zero right exposure at2.

Correction preserved: Builder initially messaged this as an ACTUAL
stationary anchor with actual closure vector(4,10,5,2,6)/17.
Main correctly rejected that claim. This vector is only the free
included-term timing, not the actual full timing: source3 activates
near4 (its actual closure14/51<5/17), and source2 has farther-prefix
activation. No actual stationarity, radial identity or full area value
at Dfree is asserted. Dfree need not belong to the actual domain of
this calibration. Only FREE Q criticality and feasibility of its
INCLUDED free hull/nearest-restoration optimizers are required.

On the stated actual domain G=Qmix-E, where E is the sum of all
included hull and restoration squared cone-distance deficits. The
feasible included anchor gives grad E dot(D-Dfree)>=2E, and
actual full stationarity gives0=2Qdist-grad E dot(D-Dfree).
Thus Qdist>=E and G>=22/17. First derivatives agree at inactive
restoration/pooling switches; no lower-proxy stationarity is invoked.
Reflection gives the corresponding nearest mixed1/4 domain.

### 8.1 Whole strict root2/right-subtree5 NEAREST reduction

Assume tau=T2>all others, psi=T5>theta=T3,v=T4, with only
nearest restoration at2 and5. Inputs force alpha23,beta12,beta45
to pool. Source3 versus source2 forces beta3>beta2. Source4 versus
source5 gives s4-s5=psi-v-ell>0, where ell=[psi-2v]_+,
so alpha4>alpha5. Hence alpha4 is positive and alpha5 is a singleton,
possibly zero. If alpha4 does not join alpha23 it is a positive singleton.

If both singletons are positive, source/leaf balances give
beta4=v-ell and beta5=psi+ell, contradicting their pooled equality.
If alpha5=0, the singleton4 case instead gives v+psi-ell=1.
When ell>0, this forces v=1/3. A separate beta45 positive mean then
forces psi=0, while a pooled beta345 positive mean forces theta=0;
both impossible. When ell=0, v+psi=1. Separate beta45 has mean0
but beta5=1-psi=v>0, impossible. Pooled beta345 has mean
1-2(theta+1)/3=1-psi, so psi=2(theta+1)/3>2/3 and
r=tau+q+theta+v+psi>5/3>49/31. This is not competing.

Thus every competing minimum in this ENTIRE nearest tree class has
alpha234 pooled and lies in the exact calibration domain, with every
beta3/45 coarsening or zero alpha5 retained. It satisfies G>=22/17.
Additional/farther flows are not removed by this result; Sections5/7
explicitly show why a universal nearest-only assumption is forbidden.

## 9. Whole strict root2/right-root5, T3>T4 with C3=0

This is a whole remaining tree class, not an assumed nearest pattern.
Let tau=T2 be the strict global maximum, psi=T5>t=T3>v=T4>0,
and suppose C3=0, equivalently t<=2v. Put q=T1 and e=[tau-2q]_+.
The actual side-prefix envelopes give

    D1=2q, D3=2t, D4=2v,
    h=[psi-2v]_+, k=[psi-2t]_+,
    D5=2psi+h+k.

Inputs D3>D4 force alpha34 to pool. If k>0, actual balances give
s3-s4=t-v>0, contrary to beta3<=beta4 on that pooled alpha block.
Hence k=0. Inputs D5>D4 pool beta45. If root2 reached edge5,
tau>=D5 and its equal exposure to3/4 minus its exposure to5 would
give s4-s5=t-psi-2h<0, contrary to alpha4>=alpha5 on beta45.
Thus root2 has no edge5 flow and has equal exposures
f=[tau-t-v]_+ to3/4. The formula D5>D3 used here follows directly
from psi>t and h>=0, so no skipped prefix was assumed.

If h=0, psi<=2v and all other cuts have zero outgoing flow. This
is exactly the whole one-donor class proved in Section7. Suppose h>0.
Then D5=3psi-2v, and

    s3-s4=psi-t-v, s4-s5=v-f.

These imply psi<=t+v and f<=v. Source3/root2 difference is
tau-t-f>0: it is tau-t if f=0, and v if f>0. Hence beta3>beta2,
which forces alpha23 to pool. Together with alpha34, alpha234=A.
The left leaf still forces beta12=B and alpha1=delta1>0.
There are only beta12/{3}/{45} or beta12/{345} possibilities on
the right, with arbitrary coarsening of alpha234 into5 retained.

If beta3<beta4, beta3 is its actual positive singleton delta3.
Source3 gives A=t-f. The actual positive beta45 mean gives
E=1-3psi/2; source4 gives A=v+psi/2-f. Consequently
psi=2t-2v<=t, contrary to psi>t. Thus beta345=E necessarily.
Source3/4 balance now forces

    psi=t+v, E=1-5t/3-v, alpha5=2t/3>0,
    A=2t/3+v-f.

All these positive block means are actual, not singleton replacements.
In particular the positive source5 fit removes its zero face without
assuming it was separated. Since tau>psi=t+v, f=tau-t-v>0.
Exactly two alpha possibilities remain.

### 9.1 Separated alpha234/{5}

Here f<v and actual singleton5 gives 11t+3v=3.
The source2/left-leaf equations, the positive beta12 mean, and the
positive alpha234 mean are

    B=1-tau-A, q=B+e, e=[tau-2q]_+,
    2B=1-tau-f-3e/2,
    4t+5v-f+2tau+e=3.

B is positive: if B=0, then q=e>0 and tau=3e. The separated
singleton5 relation gives A=1-3t-f, while the source2 balance
gives A=1-tau. Thus tau=3t+f. Comparing with the exact root
equation tau=t+v+f gives v=2t, contrary to t>v. Only after this
zero-face contradiction is the actual positive beta12 mean used.

Combining these equations with f=tau-t-v and 11t+3v=3 yields

    5f+4e=7t/3, e=96t-20,
    f=16-229t/3, tau=17-79t, q=-21+305t/3.

If e=0, then (t,v)=(15,17)/72, contradicting t>v.
If e>0, the defining equality e=tau-2q forces
(t,v)=(237,266)/1135, again contradicting t>v.
There is no stationary array on this entire separated face.

### 9.2 Coarsened alpha2345

Here f=v, tau=t+2v and A=alpha5=2t/3. Its actual positive mean is
1-(7t+9v+e)/4. Therefore

    29t+27v+3e=12, B=1-5t/3-2v, q=B+e.

If B=0, then q=e>0 and 3e=tau=t+2v. The two displayed mean
equations become 5t+6v=3 and30t+29v=12. They force
v=6/7,t=-3/7, impossible. Hence B>0 and its actual mean gives

    14t+6v-9e=6.

For e=0, this equation and the alpha mean force
t=15/34,v=-1/34, impossible. For e>0, the exact definition of e
gives 9e=13t+18v-6; comparison forces t=12v, contradicting
t<=2v and v>0. No coarsened stationary array remains.

Together with Section7 for h=0, this closes the ENTIRE strict
root2/right-root5 class with T3>T4 and C3=0, including all positive,
zero and coarsened hull faces, without assuming source5 nearest-only.
The C3>0 part is independently pursued in Main Section6. This is
not a whole K6 closure; endpoint roots, global ties, boundary limits
and inverted union remain separate obligations.

### 9.3 Zero-face correction preserved

The first saved draft of9.1 tried to infer delta1<=0 from beta12=0.
That is FALSE: a zero initial increasing block only constrains its
admissible pooled/suffix directions, not its first input individually.
The sentence was replaced above by the exact source/root contradiction
v=2t. No zero-block mean or individual-input bound is used in that repair.

## 10. Independent checks of Main whole strict-tree proof

Main Sections5.1/5.2 and its repaired5.4 were checked by hand against
the actual means and balances. Positive source4 forces the two actual
hull alternatives stated there; its separated candidate has
(q,tau,T3,T4,psi)=(11,22,8,17,18)/47 and r=76/47>49/31.
The pooled equations and clipping alternatives are independently checked.

Main6.1's positive-e candidate has common denominator83391:

    (q,tau,x,y,psi)=(19600,43120,26726,12915,31206)/83391,
    e=3920/83391, f=3031/83391,
    D=(39200,96222,54348,25830,67788)/83391,
    alpha=(44191,24591,24591,24591,15603)/83391,
    beta=(15680,15680,29043,36582,36582)/83391.

All actual positive means and five balances agree. Its range is
133567/83391, exceeding49/31 since the cross-product difference is54418.
This is an actual stationary candidate; local minimality is NOT asserted.
Main6.2 and6.3 block equations and every zero/positive-clamp contradiction
were independently checked. Main's6.5 and6.6 corrections supersede the
withdrawn arithmetic, not the originally erroneous lines.

Builder and Critic independently found the same real Main6.4 arithmetic
error. Its positive-e equations force y=98/841, x=868/2523 and e=82/2523,
NOT the previously asserted y=70/841 and negative e. The algebraic
candidate actually has r=3977/2523<49/31. It is nevertheless NOT an
actual hull solution:

    D=(1234,2742,2016,588,2058)/2523,
    delta=(1289,-219,507,1935,465)/2523,
    proposed alpha=(1289,672,672,672,672)/2523,
    proposed beta=(535,535,969,969,969)/2523.

Its decreasing-fit polar at4 is207/2523>0, since alpha5-delta5=207/2523.
Thus actual coarsening is infeasible. The exclusion MUST use that polar,
not the withdrawn negative-e claim. This is not a K6 counterexample.
Main6.7 preserves and repairs that mistake; the same bad free candidate
illustrates why joint full-hull feasibility cannot be dropped.

## 11. Nonadjacent tie2/5: exact exceptional checks

This section checks explicit tied faces; it does not infer them from
strict maxima by genericity. Let T2=T5=theta=max T and inner cuts below
theta. The full strict-tree equations in Main5/6 remain valid with
tau>=psi, except the equal-inner exceptional face and the possible
zero f of Section9, which must be handled separately.

When T3=T4=t and source5 is active, the exceptional equality
tau=psi=3t forces beta all equal B and alpha2345=A, with alpha1 isolated.
Here D2=8t+e,D3=D4=2t,D5=8t, q=B+e.
If A>0 its ACTUAL mean is1-5t-e/4. Source balance gives
B=2t+e/4, so e=[3t-2q]_+=[-t-5e/2]_+=0 and q=2t.
The actual positive beta-all mean is1-24t/5, yielding t=5/34.
The alpha polar at4 equals A-delta5=15/34>0, so this face is impossible.
If A=0, beta-all mean plus source balance gives2q+5t+e=0, impossible.

For Section9's unequal inactive-source3 tied face, beta345 still forces
psi=t+v. Now tau=psi implies f=0, which the STRICT shortcut f>0
does not cover. On separated alpha234/{5}, the actual singleton relation
11t+3v=3 and the alpha mean6t+7v+e=3 remain necessary.
If B=0, e=tau/3 gives19t+22v=9 and5t+6v=3; subtraction forces
t+v=0. If B>0,e>0, the positive beta12 mean is
14t+18v-9e=6, while the defining clamp gives9e=13t+15v-6;
comparison forces t+3v=0. If B>0,e=0, the means6t+7v=3 and
7t+9v=3 contradict11t+3v=3. Thus this tied zero-flow face is excluded.
The coarsened alpha2345 equations in9.2 already have f=v>0, and their
contradictions do not require tau>psi. Independent Critic Section11 has
now reviewed the whole one-donor extension and these exceptional faces.
The ENTIRE global maximum set{2,5} and its reflection{1,4} are excluded.
Neither result covers endpoint tie1/5.

The one-donor extension has a real terminal boundary which cannot be
dismissed by the old strict psi<tau line. In its t<v nearest face,
tau=t+v may equal psi at tie2/5. The negative-variation perturbation
D3+h,D4-h keeps D3+D4 EXACT, so the source5 length2 zero threshold
2psi=D3+D4 remains exact and R5 stays zero. Its nearest4 threshold
is strict because psi=t+v<2v. At v=2t the already repaired positive-h
direction also keeps this farther intercept fixed and improves the
near4 leaf/restoration margin. This replaces, rather than silently
reuses, the invalid strict psi<tau shortcut at the tied terminal.

## 12. Whole strict root2, right-subtree maximum set{3,5}

Hand proof for independent review. Let tau=T2 be the strict global max,
eta=T3=T5>v=T4>0, q=T1, e=[tau-2q]_+. Neither endpoint of the
right subtree can expose the other equal-max endpoint. Thus

    g=[eta-2v]_+, D3=D5=c=2eta+g, D4=2v,
    F34=F54=g,
    F23=F24=f=[tau-(c+2v)/2]_+, F25=h=[tau-c]_+,
    D2=2tau+e+2f+h, D1=2q.

These are actual full side-prefix envelopes: c>2v skips the initial
root2 prefix at3, and its last transition occurs at c. Inputs pool
alpha34 and beta45. Moreover s3-s2=tau-eta-f>0; it equals a strictly
positive average-threshold difference if f>0, and tau-eta otherwise.
Consequently beta3>beta2, forcing alpha23 as well, hence alpha234=A.
Beta12=B and alpha1 is its strict positive singleton as in the left-leaf
reduction. No hull clipping or coarsening has yet been discarded.

### 12.1 Both right endpoint donors active: g>0

Here eta>2v, c=3eta-2v, and alpha34 equality gives
s3-s4=eta-3v<=0, so eta<=3v. If tau>=c,
s4-s5=-5g/2<0, contrary to beta45 equality and alpha4>=alpha5.
Hence h=0,tau<c and

    s4-s5=3v-eta-f>=0.

If beta3<beta4, beta3 is the positive singleton1-c and beta45 has
actual positive mean1-3eta/2. Source3 and source4 then give
A=2eta-2v-f=3v-eta/2-f, forcing eta=2v, impossible.
Therefore beta345 pools and equality of s3,s4 forces eta=3v.
Its ACTUAL mean is E=1-16v/3. Source5 gives alpha5=7v/3>0;
source3 gives A=7v/3-f. Since A>=alpha5, f=0, and alpha2345
coarsens to its common positive value7v/3. Here tau<=9v/2.

Its ACTUAL mean and source2 balance give

    6tau+3e+76v=12, B=1-tau-7v/3, q=B+e.

If B=0, e=tau/3 and these equations force
v=15/179,tau=144/179, violating tau<=9v/2.
If B>0, its positive mean gives tau+14v/3-3e/2=1.
For e>0, the defining left clamp forces tau=14v/3>9v/2.
For e=0, the means force v=1/8,tau=5/12,A=7/24.
But delta5=1-7v=1/8<A, so the required decreasing-fit prefix
polar at4 is A-delta5=1/6>0. The actual coarsening is infeasible.
Thus the entire g>0 tied subtree is excluded.

### 12.2 Inactive right donors: g=0, separated alpha5

Now eta<=2v and c=2eta. Balances give s3-s4=v-eta<0.
Thus beta3 is necessarily its strict positive singleton1-2eta,
and beta45 has actual positive mean E=1-eta-v.
Source3 and source5 give

    A=eta-f, alpha5=v-h,
    A-alpha5=eta-v-f+h.

If tau<2eta, h=0 and this difference is strictly positive, whether
f=0 or f>0. Therefore alpha5=v>0 is its actual singleton delta5,
and2eta+v=1. The alpha234 actual mean and source2 give

    eta-f+2tau+e=1,
    B=1-tau-eta+f, q=B+e.

B=0 would make the first equation tau+e=0. Hence B>0, whose
ACTUAL mean gives tau+2eta-3f-3e/2=1. Combining the two
mean equations yields tau=eta-2f-5e/2<=eta, contrary to strict root2.
No left-flow clamp or zero f was assumed away.

### 12.3 Inactive donors, coarsened positive alpha2345

If tau>=2eta, then h=tau-2eta and f=tau-eta-v>0.
The preceding alpha difference is zero, so alpha2345=A=2eta+v-tau.
First suppose A>0. Write s=2eta+v, so B=1-s and
D2=5tau+e-4eta-2v. The ACTUAL alpha2345 mean is
1-(5tau+e)/4; therefore

    tau+e+4s=4.

If B=0, s=1 and this equation forces tau+e=0. Hence B>0.
Its ACTUAL mean gives5tau+3e-6s=-2. These two equations imply

    tau=9s-7, e=11-13s.

For e=0, s=11/13,tau=8/13,B=2/13, but the zero-clamp condition
tau<=2B fails. For e>0, the exact defining clamp gives
3e=tau-2B=11s-9, hence s=21/25,tau=14/25,e=2/25,
B=4/25,q=6/25. Yet tau>=2eta gives eta<=7/25, while
eta>v=s-2eta gives eta>7/25. Contradiction.

### 12.4 The coarsened zero alpha face

If A=0, then tau=s=2eta+v and B=1-s. No positive-alpha mean
is invoked. If B>0, its legitimate positive mean gives3e=s-2<0,
impossible since B>=0 implies s<=1. If B=0, tau=1 and the
left-leaf equation q=e plus its defining clamp gives q=e=1/3.
The actual closure sum is r=q+tau+2eta+v=7/3>49/31.
Thus even the clipped coarsened face is noncompeting.

All possible restoration, positive/zero hull and coarsened faces of
this ENTIRE strict-root2/right-maximum-set{3,5} class are included.
Reflection applies to the reflected strict-root4 class. Independent
Critic Section12 now accepts the whole Section12 proof. Main Section9,
independently checked by Builder and Critic, covers right-subtree max
set{4,5}; endpoint global roots are not covered.

## 13. Whole strict root2, right-subtree maximum set{3,4}

Let T2=tau>theta=T3=T4>psi=T5>0, q=T1, e=[tau-2q]_+.
Barriers give C3=C5=0, C4=ell=[theta-2psi]_+,
D3=2theta,D4=2theta+ell,D5=2psi. The exact root2 right envelope
pools all three edges: with ell>0 its length3 threshold is5theta/3,
below its shorter average thresholds; with ell=0 it is
(4theta+2psi)/3<2theta. Thus F23=F24=F25=f, with f equal the
positive part of tau minus the relevant displayed threshold.
Also D2=2tau+e+3f,D1=2q.

Input D4>=D3 pools beta34; D4>D5 pools alpha45. Balances give
s3=s4=1-theta-f and s5=1-psi-f-ell.
The source3/root2 difference tau-theta-f is strictly positive on
both envelope phases, so beta3>beta2>=0. Thus beta34 is a positive
actual block, and alpha23 pools since D2>D3. Equality s3=s4 and
beta34 equality then pools alpha34. Together alpha2345=A.

If ell>0, s5-s4=psi>0, so beta5>beta4 is its positive singleton.
The actual beta34 mean is1-5theta/2+psi, and beta5=1-2psi.
Source3 and leaf5 give

    A=3theta/2-psi-f=3psi-theta-f.

Therefore psi=5theta/8, contrary to ell>0 requiring theta>2psi.
If ell=0, s5-s4=theta-psi>0 likewise isolates beta5.
The actual beta34 mean is1-2theta. Source3 and leaf5 instead give
A=theta-f=psi-f, contrary to theta>psi. Since A>=alpha5 and
the strict positive beta boundary was derived, no zero/clipped mean
has been silently used. This ENTIRE right-subtree tie is impossible
at actual stationarity, independent of the target range restriction.

## 14. Whole strict root2, right-subtree maximum set{3,4,5}

Let T2=tau>theta=T3=T4=T5>0, q=T1, e=[tau-2q]_+.
All three right cuts have zero outgoing flow, D3=D4=D5=2theta.
Root2 sends the same f=[tau-2theta]_+ to each, and
D2=2tau+e+3f,D1=2q. Actual fits pool beta345 and alpha2345,
with beta3>beta2 from tau-theta-f>0. Therefore the former block
is positive, has E=1-2theta, and source balances give

    A=alpha2345=theta-f>=0,
    B=beta12=1-tau-A, q=B+e.

Alpha1 remains isolated positive by the strict left-leaf argument.
The positive/zero A and B faces are separated below.

### 14.1 Positive A with f=0

Here tau<=2theta and A=theta. Its ACTUAL positive mean gives

    10theta+2tau+e=4, B=1-tau-theta.

If B=0, q=e=tau/3 and these equations give
theta=5/23,tau=18/23>2theta, impossible.
If B>0 its ACTUAL mean gives tau+2theta-3e/2=1.
For e=0 these equations force tau=theta=1/3, contrary to strict root2.
For e>0 the exact clamp3e=tau-2B gives tau=2theta and then

    theta=7/25,tau=14/25,e=2/25,B=4/25,q=6/25.

The actual range is r=q+tau+3theta=41/25>49/31.
This is a stationary candidate, not a claim of local minimality.

### 14.2 Positive A with f>0

Now tau=2theta+f, A=theta-f>0, B=1-3theta and
the ACTUAL positive alpha mean is14theta+f+e=4.
If B=0, theta=1/3 and this equation is impossible with f,e>=0.
If B>0 its ACTUAL positive mean is

    4theta-5f/2-3e/2=1.

For e>0, the defining clamp3e=tau-2B=8theta+f-2
combined with that mean forces f=0, contrary to this face.
For e=0 the two means give theta=11/39,f=2/39,tau=24/39,
B=6/39. The zero-clamp condition tau<=2B=12/39 fails.
No positive-A stationary competitor remains.

### 14.3 Zero coarsened alpha A=0

Here f=theta,tau=3theta and B=1-3theta>=0. No positive-alpha
block mean is used. If B>0, its legitimate positive mean gives
e=theta-2/3<0, impossible since B>=0 implies theta<=1/3.
If B=0, theta=1/3,tau=1 and q=e=tau/3=1/3. Its closure sum
is r=q+tau+3theta=7/3>49/31. Thus even the zero alpha face
is noncompeting; it is not omitted as an interior generic limit.

The entire triple right-subtree tie is covered. Reflections of Sections13/14
give the analogous strict-root4 tied left subtrees. Independent Critic
Sections12/13 now accept these original tied faces; no strict-subroot
proof alone justifies these ties.

## Current global gap and ledger

Independent Critic Sections8–11 accept the repaired Main whole strict
root2/right-subtree5 proof and its reflection, and global maximal
sets{2,5}/{1,4}. Critic Sections12/13 additionally accept ALL original
right-subtree maximum sets{3,4},{3,5},{4,5},{3,4,5} under strict root2,
and their reflected strict-root4 classes. Section9 here supplies the same actual C3=0 reduction;
its zero-face correction is explicitly preserved. Adjacent maximal sets
and{2,4} were also reviewed separately. The whole natural global-minimum
obligation STILL retains strict endpoint roots, endpoint maximal set{1,5},
and unresolved natural boundary/minimum-attainment steps. The twelve inverted
continua/faces and the universal committed K6 target remain OPEN.
No statement here converts a strict class into tied maxima by genericity.

Ordinary source/clock reads and apply_patch only; mathematical subprocesses0,
seconds0, failed starts0. No code, samples, optimizer, LP, enumeration,
UI/API/Git/build/install/copy/deletion or new infrastructure. Initial combined
historical read output was truncated; exact latest active/handoff checkpoints,
continuation scope, original TIP and skill/report instructions were reread.
One ordinary tail read used an incorrect critic filename and returned not-found;
the observed filename was then read. One ordinary apply_patch context failed
before the corrected patch. Neither launched a mathematical process.
