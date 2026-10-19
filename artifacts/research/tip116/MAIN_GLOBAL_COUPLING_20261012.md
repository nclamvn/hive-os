# Whole K6 continuation: exact coupling and maximal-time ties

Status: hand derivation for independent challenge. Global all-real K6 remains
OPEN. SameR116 envelope; mathematical subprocesses0. Frozen prior notes are
not changed. The following are actual-area statements, never proxy gradients.

READING RULE: this is a chronological research record, not an error-free final
manuscript. Section5.4 supersedes the invalid coarsened equations in5.3;
Sections6.5–6.7 explicitly supersede three erroneous arithmetic/zero-face
lines in6.1/6.4. Only repaired claims with independent acceptance may be used.
For a clean status/scope index read the separate continuation completion report.

## 1. Exact all-natural stationary comparison, not yet a bound

On the natural connected-bottom chart set S=sum D_i. Two full hull supports
and five full-prefix restoration supports give

    G=Q_full-sum_(seven cones) E,
    Q_full=3-S+3sum D_i^2-(5/12)S^2,
    E=1/2 dist_W(z(D),K)^2.

For hulls z=1-D, W=Id, K the decreasing/increasing nonnegative cones.
For restoration i, z_j=S/6-D_j (j!=i), W=Id+11^T/2 and K the two
nonnegative prefix cones directed away from i. All z maps are affine.
The full-prefix dual and correct9/4 free-restoration sum were proved in116.

Let D and the accepted sharp D_* both be genuinely full stationary. Write
p=P_K^W z, n=z-p for each cone and use a star for D_*. Subtracting the two
gradients, then expanding the quadratic at D_* gives exactly

    2(G(D)-G(D_*))
      =sum[-<n(D),p_*>_W+<n_*,p(D)>_W].              (C)

Proof. If q_2 is the homogeneous quadratic part in D-D_*, gradient difference
paired with D-D_* gives2q_2=sum<n-n_*,z-z_*>. Expand G-G_* around D_*,
using grad G_*=0, and substitute this equality. Each term becomes
1/2[(n+n_*) dot_W(z-z_*)-(||n||_W^2-||n_*||_W^2)]
=1/2<n+n_*,p-p_*>_W. Cone complementarity gives<n,p>=<n_*,p_*>=0,
yielding(C). Values/first derivatives at bottom contact transfer as before.

The first cross term is nonnegative and the second is nonpositive. It is
INVALID to drop the second: full unrestricted sharp-anchor z has negative
flow coordinates. Thus(C) identifies the whole stationary coupling still
needed; it does not prove it, nor a pointwise bound or inverted-chart formula.

## 2. Adjacent global maximal closure times cannot be subtarget minima

Claim for hostile review: an actual competing natural global minimum cannot
have T_k=T_(k+1)=theta=max_i T_i. Retain D_i>0, one connected bottom,
full actual stationarity, r=sum T_i<=49/31 and the existing minimum filters.
The claim treats ALL k=1..4 and all hull/clamp/contact faces, not genericity.

### 2.1 Both hull fits pool the tied pair

Maximal cuts have no incoming prefix flow, so M_k=M_(k+1)=0 and
s_k=s_(k+1)=1-theta, s=alpha+beta. If D_k>D_(k+1), the violated decreasing
input order forces alpha_k=alpha_(k+1), then equal s forces equal beta.
If D_k<D_(k+1), increasing beta pools first and equal s forces equal alpha.
For equal inputs both ordered fits give equal adjacent values: a strict fit
boundary would require its left/right block endpoint values to lie on opposite
sides of the same input in the wrong strict order. Thus in every case

    alpha_k=alpha_(k+1), beta_k=beta_(k+1).

Let N_j=sum_(h<=j)(delta_h-alpha_h)<=0 and
P_j=sum_(h>=j)(delta_h-beta_h)<=0, delta=1-D. These are full-cone polar
inequalities, valid for positive and zero blocks. Under perturbation
D_k->D_k+h,D_(k+1)->D_(k+1)-h the unchanged candidate hull fits have
unchanged block means; only N_k changes by-h and P_(k+1) by+h.
All their complementarity/drop constraints remain unchanged.

If N_k<0 or P_(k+1)<0, choose a sufficiently small one-sided h which also
keeps any tight other inequality nonpositive. Both ACTUAL hull fits stay
fixed, and their support values stay fixed because both tied entries agree.

### 2.2 A feasible negative actual second variation

Every prefix containing a maximal cut has a uniform inactivity margin.
Indeed a length m prefix with intercept U containing that cut satisfies
U>=(m+1)theta by the exact closure ratio. For any donor T_i<=theta,
mT_i-U<=-theta. Consequently the nearby restorations for cuts other than
k,k+1 are independent of BOTH varied D's. Each varied source restoration
depends only on its OWN varied D; prefixes crossing the other maximum
have the same strict inactivity margin.

Since2theta<=r<=49/31, theta<=49/62<1. All closures remain below1 in
a sufficiently small perturbation; no omitted physical-tail curvature arises.
At a terminal switch select the actual one-sided prefix slope l_i in{0,..,4}.
The closure equation gives dT_i/dD_i=1/(2+l_i), hence

    partial_(D_i)^2 R_i=1/2-1/(2+l_i).

The linear variation vanishes by actual stationarity. Raw-square curvature
plus the two own restoration curvatures, with the full hull fixed, give

    G(D+h(e_k-e_(k+1)))-G(D)
      =-h^2/2[1/(2+l_k)+1/(2+l_(k+1))]<0.

This excludes every case where at least one of N_k,P_(k+1) is strict,
including a zero hull block or a simultaneous terminal switch.

### 2.3 Both polar inequalities tight

If N_k=P_(k+1)=0, the neighboring polar inequalities imply

    delta_k>=alpha_k>=delta_(k+1),
    delta_k<=beta_k<=delta_(k+1).

Together with pooled fits this forces all four quantities to one common
delta. Actual source balance now gives

    2delta=1-theta,
    D_k=D_(k+1)=(1+theta)/2,
    C_k=C_(k+1)=(1-3theta)/2>=0,

so theta<=1/3. For k=1 the first maximal cut cannot donate across the
adjacent maximal cut2, hence C1=0 and theta=1/3. Reflection treats k=4.

For k=2 (k=3 by reflection), cut1 is a leaf behind the maximal cut2:
D1=2t, C1=0, M1=C2=(theta-D1)_+. If C2>0 then

    D1=(5theta-1)/2, t=(5theta-1)/4.

Since D2-D1=1-2theta>0, beta1=beta2=delta. Leaf/source balance gives
s1-s2=t>0, hence alpha1>alpha2 and the positive singleton alpha1=delta1.
Its difference from alpha2 equals D2-D1, so

    1-2theta=t=(5theta-1)/4 => theta=5/13>1/3,

a contradiction. Thus C2=0 and theta=1/3. If t<1/3 then beta1=beta2=1/3
and leaf balance gives alpha1=2/3-t>alpha2. Singleton projection also
gives alpha1=1-2t, forcing t=1/3. Therefore D1=2/3 as well.

### 2.4 Explicit flat propagation, not an unproved prefix assumption

After the k=1 argument, first two D/alpha entries are2/3,1/3 and N2=0.
After k=2 they are the first THREE entries, with N3=0. These facts were
derived, not assumed. Suppose the first j-1 entries are flat D=2/3,
alpha=1/3,N_(j-1)=0. For every right prefix j..b, full polar inequality
and decreasing alpha give

    sum_(h=j)^b delta_h<=sum_(h=j)^b alpha_h<=(b-j+1)/3,
    sum_(h=j)^b D_h>=2(b-j+1)/3.

Adding any known flat left entries proves that EVERY cross-cut interval
containing j has sum D>=2m/3 for its length m. Its closure ratio is
at least2m/[3(m+1)], strictly greater than1/3 for m>=2. Since T_j<=theta=1/3,
the minimum can only use the adjacent interval m=1, forcing D_j=2/3 and
T_j=1/3. With N_(j-1)=0, alpha_j<=1/3 and delta_j=1/3, polar N_j<=0
then forces alpha_j=1/3,N_j=0. Induct to j=5. Reflection gives the other
two adjacent-pair cases.

Thus the both-tight case is the full flat vector D_i=2/3, r=5/3>49/31.
It cannot be a competing minimum. Together with2.2 this proves the adjacent
global-max tie exclusion, subject to independent challenge of all steps.

## 3. Nonadjacent tied maxima2/4 reduce directly to nearest-even

Assume T2=T4=theta=max T, with strict T1,T3,T5<theta (adjacent maximum
ties are addressed above). Barriers2/4 make cuts1,3,5 leaves; only nearest
flows2->1,3 and4->3,5 are possible. Their leaf D's are twice their T's,
whereas D2,D4>=2theta. Therefore the input violations force the actual
opposite-alternation hull subspaces. The exact nearest-even calibration116
applies, with all clamped/pooled/zero faces, and gives G>=22/17>40/31.

This does not dispose of nonadjacent endpoint maximum sets{1,4},{2,5},{1,5},
strict endpoint roots, or any inverted apex order. No whole K6 closure is
asserted. No mathematical subprocess or random/finite search was used.

## 4. Independent challenge and shorter both-tight completion

Builder supplied a shorter GLOBAL polar squeeze in its new continuation
Section3; Main has read and checked it. Critic independently accepted the
entire adjacent-global-max exclusion and the nearest-even maxset{2,4}
floor, including the one-sided curvature, zero blocks and terminal faces.
The earlier longer derivation above remains preserved, not silently replaced.

When N_k=P_(k+1)=0 and the common boundary fits are a, tight left-alpha
and global right-beta polar inequalities give

    ka<=sum_left alpha=sum_left delta<=sum_left beta<=ka.

Therefore every left alpha and beta is a. Tight right-beta and global
left-alpha give the reflected squeeze on the right. Both projections are
globally constant a and sum(delta- a)=0. Prefix-alpha and suffix-beta
polar inequalities now give opposite signs for every prefix, so every
delta_i=a. Closure and stationarity force D=2/3,T=1/3,r=5/3.

This eliminates the endpoint/inner leaf cases and the flat-propagation
induction from the preferred proof. It does NOT eliminate the remaining
maximal sets, strict endpoint roots, or any inverted apex order.

## 5. Whole root2/right-root5 weak right order: independent hand attempt

Working claim, NOT yet accepted: exclude every competing actual local minimum
with tau=T2>all others, psi=T5>max(T3,T4), and T4>=T3. All possible
donors within the right subtree are initially allowed. Reflection applies.
Use q=T1,x=T3,y=T4 and e=[tau-2q]_+. The left leaf has D1=2q,
beta12 pooled and alpha1=delta1>0, as in reviewed Builder Section2.

### 5.1 Strict y>x first forces source5 inactive

The barriers give C3=0,D3=2x and C4=ell=[y-2x]_+,D4=2y+ell>D3.
Source5's two-edge envelope has equal exposures into3/4 whenever active:
g=[psi-(D3+D4)/2]_+,C5=2g,D5=2psi+2g. Input D4>D3 forces beta3=beta4.
Write f3,f4,f5 for the root2 exposures. Actual balance requires

    s3-s4=y-x-(f3-f4)-ell>=0.                     (R)

If g>0, D5>D4: for ell=0 use psi>x+y; for ell>0 use psi>3y/2.
Thus root2's increasing right D inputs give
f3-f4=[min(tau,D4)-D3]_+. If ell=0 and tau>=2y, (R)=-(y-x)<0;
if tau<2y, (R)=x+y-tau<x+y-psi<0. If ell>0, y>2x. For tau>=D4,
(R)=5x-3y<0; for tau<D4, (R)=3x-tau<3x-psi<0.
Therefore C5=0 in the ENTIRE strict y>x class.

If ell=0, C3=C4=C5=0 and the already reviewed WHOLE one-donor proof
Builder Section7 applies. It remains ell>0, hence y>2x.

### 5.2 Positive source4 leaves only a whole two-donor system

Here D5=2psi. If D4>=D5, the root2 length2 prefix is skipped (or tied),
so f4=f5. Then s4-s5=psi-y>0, while the input violation forces
alpha4=alpha5 and monotone beta requires s4-s5<=0. Thus D4<D5.
The root2 exposures consequently use strictly increasing D3<D4<D5.
Equation(R) forces tau<D4 and tau<=3x; otherwise (R)=5x-3y<0.
Hence f4=f5=0,f3=tau-2x, D2=3tau+e-2x.

Input D4<D5 pools beta45, and beta34 was pooled already, so beta345=B.
Balances give s4-s5=psi-y>0, hence alpha4>alpha5. If alpha5=0,
beta345=1-psi and its positive mean gives psi=3y, contradicting
psi<tau<=3x with y>2x. Thus alpha5=delta5>0 and B=psi.
Moreover s3-s2=3x-y>0 (y<psi<tau<=3x), so beta3>beta2 and
alpha23 pools. There are exactly two actual positive hull possibilities:
alpha1/{23}/{4}/{5}, or alpha1/{234}/{5}. No zero or extra coarsening
has been discarded: alpha4>alpha5>0 and alpha1 is isolated.

If alpha3>alpha4, let A=alpha23. Positive block means and balances give

    A=1-(3tau+e)/2, beta12=(tau+e)/2,
    q=beta12+e, e=[tau-2q]_+.

Therefore e=0,q=tau/2. Singleton4 gives psi=2y-2x. Block23 gives
10x+tau=6y; beta345 gives3y+5psi=3; beta12 gives(5/2)tau-x=1.
Solving this WHOLE system forces

    (q,tau,x,y,psi)=(11,22,8,17,18)/47,
    D=(22,50,16,35,36)/47, r=76/47>49/31.

The actual stationary value is G=123/94>40/31. This is an actual
stationary candidate, NOT a claim of its local minimality.

If alpha3=alpha4, tau=3x. The positive alpha234 and beta345 block means,
plus the source/left-leaf balances, give

    psi=(7x+e)/3, beta12=y-2x/3+e/3,
    12y+13x+13e=6, 9y+35x+5e=9,
    e=[3x-2(beta12+e)]_+.

Beta12 cannot be zero because y>2x gives beta12>4x/3.
For e=0 these equations force x=18/101,y=31/101<2x.
For e>0, 11e=13x-6y; the two mean equations become
9y+52x=11,23y+150x=33, forcing x=2/7,y=-3/7.
Both alternatives contradict the actual positive right order.
Thus the ENTIRE positive-source4 class is noncompeting.

### 5.3 Equal x=y=t with source5 active

Here C3=C4=0, D3=D4=2t. If C5=0, reviewed one-donor Section7 applies.
Suppose g=psi-2t>0. Then C5=2g,D5=4psi-4t>2t. Equal adjacent
inputs pool both hulls at3/4; D5>D4 pools beta45, hence beta345.
Root2 has f3=f4=[tau-2t]_+,f5=[tau-D5]_+. Monotone alpha gives

    s4-s5=t-(f4-f5)>=0.

If tau>=D5 this is7t-4psi<0; therefore tau<D5,f5=0 and tau<=3t.
Now s3-s2=3t-psi>0, so beta3>beta2 and alpha23 pools. Alpha234
is positive. Alpha5=0 would give beta345=1-psi, while its actual
positive mean equals1-4psi/3, forcing psi=0. Thus alpha5=delta5>0
and beta345=3psi-4t. Only alpha234/{5} or alpha2345 can occur.

In the first case the exact positive means and balances give

    13psi-12t=3, tau+e=12psi-21t,
    beta12=(tau+e)/3, q=beta12+e, e=[tau-2q]_+.

They force e=tau/11 and63tau=22+44t. Solving forces
t=7172/32087,tau=16214/32087,psi=14025/32087.
But psi-2t=-319/32087<0, contradicting g>0.

In the coarsened case alpha2345=alpha5 implies tau=3t. Its actual
mean gives e=12psi-24t>0. Source2 and the left leaf give
3e=17t-8psi. Hence psi=89t/44,e=3t/11,beta12=12t/11,q=15t/11.
The positive beta12 mean now requires t=22/145, whereas the positive
beta345 mean13psi-12t=3 requires t=132/629. These are incompatible.
There is no zero beta12 face: psi>2t gives beta12=4psi-7t>t.

If the above independent derivation survives hostile review, together with
Builder Section7 it closes ALL strict root2/right-root5 arrays with T4>=T3,
not just nearest-only or one-donor arrays. The T3>T4 side, global root ties,
endpoint roots and inverted apices remain in the committed obligation.
No mathematical subprocess, phase enumeration, samples or symmetry was used.

### 5.4 Correction to the equal-wing coarsened branch (preserved)

Builder found a real logical error in Section5.3: after proving alpha5>0,
the draft called it delta5 before checking whether it is a singleton.
That conclusion, beta345=3psi-4t and13psi-12t=3, is valid ONLY in
the separated alpha234/{5} branch. The earlier coarsened-branch equations
and incompatible t values therefore are WITHDRAWN as closure evidence.
The preceding separated branch and Section5.2 are unaffected.

Here is Builder's complete replacement for alpha2345=A. Source/leaf
balance still gives tau=3t, and D2=8t+e,D5=4psi-4t. The ACTUAL
positive block means are

    A=1-2t-psi-e/4, E=1-4psi/3.

Source5 gives24t+16psi+3e=12. Source2 and the isolated left leaf give
beta12=psi-t+e/4>0 and q=psi-t+5e/4. Its ACTUAL positive mean
then gives psi+t+e=1/2. Substitution into the first equation gives
8t-13e=4, hence t>=1/2. But psi>2t and psi+t+e=1/2 imply t<1/6.
Contradiction. This proof retains coarsened alpha and never replaces a
pooled positive entry by its individual input. Independent critic review
of the repaired whole claim remains required.

## 6. Remaining right order with positive internal donor3 (working)

Hand attempt for hostile review, not accepted. Retain strict root2 and strict
right-root5, but now x=T3>y=T4 and C3=ell=x-2y>0, so x>2y.
Initially source5 may have farther flow and root2 may expose all right edges.
Write tau=T2,psi=T5,q=T1,e=[tau-2q]_+. Tree barriers give

    D3=3x-2y, D4=2y,
    g=F54=psi-2y, h=F53=[psi-D3]_+,
    D5=2psi+g+h.

D3>D4 pools alpha34; D5>D4 pools beta45. Root2's length1 right
prefix is skipped, so F23=F24=f=[tau-3x/2]_+, F25=k=[tau-D5]_+.
The latter formulas are exact since D5>=2psi>2x>3x/2.

Balance at3/4 requires s3-s4=psi-3y-h<=0. If h>0 this equals
3x-5y>0. Thus h=0,psi<=3y,D5=3psi-2y. Balance at4/5 requires
s4-s5=3y-x-f+k>=0. If k>0, it becomes5y+x/2-3psi<0 since
psi>x>2y. Therefore k=0,tau<D5 and f<=3y-x.
Also s3-s2=tau-x-f>0, so beta3>beta2 and alpha23 pools;
together with alpha34 this forces alpha234=A. There are only two
positive beta possibilities: singleton3/block45 if psi<3y, or345 if
psi=3y. Alpha is either234/{5} or2345. Their zero faces are handled
below, not replaced by singleton formulas.

### 6.1 Separated beta3, separated alpha5

Here E=beta45=1-3psi/2. Alpha5=0 would give E=1-psi and psi=0;
thus alpha5=delta5>0, E=2psi-2y. Source3 and leaf4 give

    A=2x-2y-f=3y-x-f+psi/2,
    psi=6x-10y, 21x-37y=1.                         (S)

Let B=beta12=q-e. Actual alpha234 and source2 balances give

    9x-6y-f+2tau+e=3,
    B=1-tau-2x+2y+f, q=B+e.

If B=0 and f>0, (S) and B=1-7x/2+2y force x=2y, forbidden.
If B=0 and f=0, e=tau/3; the displayed alpha mean gives11x-2y=1.
With(S) it forces x=7/73,y=2/73,psi=22/73>3y, forbidden.
Therefore B>0 and the ACTUAL beta12 mean gives

    2B+3e/2+tau+f=1.

If f=0 and e>0, the means force tau=4x-4y>2x, contradicting
tau<=3x/2. If f=e=0 they force x+2y=1 and(S) gives y=20/79>1/4,
contradicting x>2y. Thus f>0. Then B=1-7x/2+2y. If e=0,
the means give tau=2x-4y/5 and
465x-252y=110; the clamp condition tau<=2B implies7x-12y/5<=2.
Combining the mean equations with(S) gives the same positive e candidate
below; equivalently the clamp fails. More transparently solve with e>0:

    e=(tau-2B)/3, tau=2x-4y/5,
    465x-252y=110, 21x-37y=1.

This forces y=615/3971,x=26726/83391. The resulting B and tau give
tau-2B>0, so the positive-e branch is self-consistent and the zero-e
alternative is not. Its full actual closure sum is

    r=1/3+17x/2-47y/5=133567/83391>49/31.

Thus this ENTIRE separated/separated class has no competing minimum.
No claim of local minimality of its possible stationary point is made.

### 6.2 Separated beta3, coarsened alpha2345

Now s4=s5 gives f=3y-x>0,tau=x/2+3y. The positive beta45 mean
and source5 give A=psi/2; equation psi=6x-10y is unchanged.
The ACTUAL positive alpha2345 mean gives32x-40y+e=4.
Source2 gives B=1-7x/2+2y.

If B>0 its actual mean gives15x-20y-3e=2. Twice this equation
minus the alpha equation yields -2x-7e=0, impossible.
If B=0, q=e=tau/3=x/6+y. Together with B=0 and the alpha mean
one obtains x=186/433. But B=0 implies y=(7x-2)/4, and psi>x
then requires x<2/5; 186/433>2/5. Contradiction.
No zero A face is possible because A=psi/2>0.

### 6.3 Pooled beta345, separated alpha5

Here psi=3y and E=1-x-7y/3. If alpha5=0, E=1-3y would give
x=2y/3, impossible. Therefore alpha5=delta5>0 and E=4y, giving

    3x+19y=3, A=1-x-f-4y,
    f+12y=2tau+e, B=x+f+4y-tau.

B>0: for f>0 it is4y-x/2; for f=0 it is at least4y-x/2;
and x<psi=3y. Its ACTUAL mean gives2B+3e/2+tau+f=1.

If f>0,e>0, the equations force
e=y-x/8,504y-87x=16 and3x+19y=3. Hence y=103/1055,
x=1208/3165>3y, contrary to the strict subtree order.
If f>0,e=0, tau=12y-3x/2 and the clamp tau<=2B forces x>=8y,
again impossible. If f=0,e>0 the equations give10x+58y=9 with
3x+19y=3, hence y=3/16,x=-3/16. If f=e=0 they give tau=6y,
but f=0 would require x>=4y. All branches contradict x<3y.

### 6.4 Pooled beta345 and coarsened alpha2345

Here f=3y-x>0,tau=x/2+3y. ACTUAL beta and source5 give
E=1-x-7y/3,A=x-2y/3>0. The ACTUAL alpha2345 mean and source2 give

    18x+49y+3e=12, B=1-3x/2-7y/3.

If B=0 then e=tau/3=x/6+y, and these equations give
9x+14y=6,37x+104y=24, hence y<0. If B>0 its ACTUAL mean gives
21x-8y-9e=6. For e>0, the clamp equation and these means force
x=62y/21,y=70/841,e=-422/2523, impossible. For e=0, the means
give x=130/391,y=48/391,tau=209/391,B=84/391; but the zero clamp
requires tau<=2B=168/391. Again impossible.

If every calculation survives independent review, Sections5 and6 plus the
reviewed one-donor/nearest calibrations exclude nearly all strict root2/right
root5 cases. The still unproved side is x>y with C3=0 and C5 positive:
source5 may have its nearest4 exposure (and potentially farther3), while
root2 has its two-edge restoration. Endpoint roots, global root ties and
inverted orders are STILL retained; no global K6 closure follows here.

### 6.5 Main self-review correction: zero-left-flow branch

In Section6.1 the first draft incorrectly recycled the positive-e linear
system into f>0,e=0. That sentence and its zero-e coefficient line are
WITHDRAWN; the positive-e candidate/value derivation is unaffected.
For f>0,e=0 the ACTUAL equations are instead

    21x-37y=1, 59x-32y=14,
    y=235/1511,x=486/1511,tau=840/1511,B=280/1511.

The zero clamp requires tau<=2B=560/1511, a contradiction. This
explicitly closes that branch without calling its free system identical
to the positive-e system. Main self-review preceded independent acceptance.

### 6.6 Critic correction to B=f=0 (preserved)

The earlier Section6.1 equation11x-2y=1 was incorrect: substituting
e=tau/3 into its actual alpha mean gives13x-4y=2. Together with
21x-37y=1 this forces x=70/397,y=29/397,psi=130/397>3y=87/397.
Thus the branch is excluded by the actual beta order psi<=3y, not by
the withdrawn x/y values or their claimed contradiction. The critic also
corrected an intermediate arithmetic slip in its message before acceptance.

## 7. Right-root5 with x>y and inactive internal source3 (working)

Retain strict global root2 and strict right-root5, x=T3>y=T4,
C3=0, hence x<=2y. Builder's full-flow reduction (independently matching
Section6 before its ell>0 specialization) removes source5 farther-to3
and root2 farther-to5. If source5 has no outgoing flow the reviewed whole
one-donor proof applies. Otherwise h=psi-2y>0, D5=3psi-2y and root2
sends equal f=[tau-x-y]_+ to3/4. D3=2x,D4=2y.
Actual hulls pool alpha234 and beta45, with beta3>beta2. All flows
and coarsenings are retained; s3-s4=psi-x-y<=0 and s4-s5=y-f>=0.

If beta3 is a positive singleton, the positive beta45 mean is
E=1-3psi/2. Source3 and leaf4 give A=x-f=y-f+psi/2, hence
psi=2(x-y)<=x, contradicting psi>x. Therefore beta345 pools,
balance gives psi=x+y and its positive mean gives

    E=1-5x/3-y, alpha5=1-psi-E=2x/3>0,
    A=alpha234=2x/3+y-f.

This positive alpha5 is NOT called its individual input in the coarsened
alpha2345 branch. That distinction is retained explicitly below.

### 7.1 Separated alpha234/{5}

Now alpha5=delta5 and11x+3y=3. Put B=beta12=q-e.
The ACTUAL means and source2 balance give

    4x+5y-f+2tau+e=3,
    B=1-tau-2x/3-y+f, q=B+e, e=[tau-2q]_+.

If f=0 and B=0, e=tau/3 and tau=1-2x/3-y; substitution gives
11x+12y=3, contrary to11x+3y=3 and y>0. For f=0,B>0 the
positive beta12 mean is2B+3e/2+tau=1. Its e>0 branch forces
tau=4x/3+2y>x+y, contrary to f=0. Its e=0 branch gives
4x+3y=3, contrary to11x+3y=3 and x>0. Thus f>0.

Then B=17x/3-1 and tau+e=3B; B cannot be zero. The clamp forces
e=B/4,tau=11B/4,q=5B/4. The positive beta12 mean gives
63B/8=1+x+y. With11x+3y=3 these force

    x=237/1135, y=266/1135,

contrary to x>y. This excludes the entire separated face, including
zero left exposure and zero root right exposure alternatives.

### 7.2 Coarsened alpha2345

Now A=alpha5=2x/3 and f=y>0, so tau=x+2y. The ACTUAL positive
alpha2345 mean and source2 balance give

    29x+27y+3e=12, B=1-5x/3-2y.

If B=0, e=tau/3 gives30x+29y=12 and5x+6y=3, forcing
y=6/7,x=-3/7. If B>0 its positive beta12 mean gives
14x+6y-9e=6. For e>0, the clamp gives9e=13x+18y-6;
comparison forces x=12y, contrary to x<=2y.
For e=0 the two mean equations give x=15/34,y=-1/34.
All alternatives are impossible.

Subject to independent review, Section7 completes the remaining x>y,
C3=0,C5>0 part of the strict root2/right-root5 class. Together with the
repaired Sections5/6 and reviewed one-donor proof it would close that
ENTIRE strict tree class and its reflection, not all natural K6: endpoint
roots and nonadjacent maximal ties are still pending, as are12 inversions.

### 6.7 Critic repair: coarse positive-e candidate fails the full hull

The Section6.4 positive-e values y=70/841 and e=-422/2523 are WRONG
and withdrawn. The ACTUAL mean equations instead force
y=98/841,x=868/2523,e=82/2523,tau=1316/2523,B=535/2523,
q=617/2523,psi=882/2523. Its radial closure sum would lie below the
target; that does NOT make it an actual stationary configuration.
Critic and Main independently checked the indispensable full-hull test:

    D=(1234,2742,2016,588,2058)/2523,
    delta=(1289,-219,507,1935,465)/2523,
    proposed alpha=(1289,672,672,672,672)/2523,
    N4=(-219+507+1935-3*672)/2523=207/2523>0.

This violates the exact decreasing-cone polar condition N4<=0. The
candidate is excluded by ACTUAL hull infeasibility, not negative e or
a false area assertion. Section6's whole-class closure uses this repair
and Section6.6, not the preserved erroneous equations. The positive-e
separated candidate in Section6.1 remains genuine and above the target.

## 8. Nonadjacent global maxima2/5: explicit tie continuation (working)

Assume T2=T5=tau=psi>max(T1,T3,T4). Adjacent global-max ties were
already excluded, so a global set containing2/5 has exactly these maxima.
The preceding exact right-order reductions use tau>=psi, except the
explicit exceptions treated here. No perturbation to a strict-root array
is used as proof of the original tie.

Sections5.1–5.2 inequalities, repaired Section6, and Section7 retain the
strict inner inequalities psi>x,y and thus survive tau=psi. Section7
explicitly treats f=0, which becomes possible at tau=psi=x+y. Its
zero/positive beta and left-flow branches are excluded by the actual means.
One must not instead quote Builder's strict shortcut f>0.

In the reviewed one-donor reduction, theta<v and tau=theta+v can now
equal psi. The old leaf5 strict two-edge margin cannot be quoted. Under
its actual negative variation D3+h,D4-h, the two-edge intercept D3+D4
is EXACTLY constant, so the terminal source5 two-edge zero envelope stays
zero. Its nearest4 inequality is strict because psi=theta+v<2v.
The existing h<0 choice (v<2theta) or corrected h>0 choice (v=2theta)
preserves all other fits and zero restorations. Thus the same ACTUAL
negative curvature survives this original tie face. The pooled alpha4/5
alternatives force tau=psi+positive(theta or v), impossible already.

One exceptional equal-wing face remains: T3=T4=t,psi=tau=3t,C5>0.
Here beta2/beta3 can merge, so the separated beta12 means from Section5
must NOT be used. Actual balances and input orders instead force

    beta1=...=beta5=B, alpha2=...=alpha5=A,
    alpha1=delta1>0,
    D2=8t+e,D3=D4=2t,D5=8t, D1=2q,
    A+B=1-3t, B=q-e, e=[3t-2q]_+.

If A=0, the positive global beta mean and its source balance give
2q+5t+e=0, impossible. If A>0, its ACTUAL block2345 mean is
A=1-5t-e/4, so B=2t+e/4>0 and q=2t+5e/4.
The clamp forces e=[-t-5e/2]_+=0. The global beta mean then gives
t=5/34,q=10/34,A=9/34. But the ACTUAL alpha2345 polar condition
at4 fails:

    N4=delta2+delta3+delta4-3A=15/34>0.

This is an infeasible free block candidate, not an actual stationary
counterexample. Therefore that entire exceptional tie is excluded.
Subject to full hostile review, this closes maximal set{2,5} and its
reflection{1,4}. Endpoint global roots and maximum set{1,5}, plus all
inverted orders, remain unproved. No genericity, sampling or all-real
closure claim is made.

## 9. Subtree tie4/5 below strict root2: working complete exclusion

Assume T2=tau>theta=T4=T5>x=T3, q=T1. Barriers give
C3=C5=0,D3=2x,D5=2theta, C4=ell=[theta-2x]_+,D4=2theta+ell.
Root2's last two right exposures coincide g=F24=F25; denote its first
exposure f=F23. Full stationarity gives equal s4=s5, hence both hull
fits pool4/5 (input violation first pools one if ell>0; equal inputs
pool each fit if ell=0). D4>D3 forces beta34 to pool, so beta345=E.
Since tau-x-f>0 on every actual root prefix phase, beta3>beta2 and
alpha23 pools. Alpha is1/{23}/{45} or1/{2345}; beta is12/{345}.

### 9.1 Positive source4 (theta>2x)

Right D4>D5 skips the root length2 prefix; its length1-to3 switch is
at (D4+D5)/2=5theta/2-x. Thus f-g=[min(tau,5theta/2-x)-2x]_+.
Balance s3-s4=theta-x-(f-g)-ell>=0 forces tau<=3x, with tau below
that switch, so g=0,f=tau-2x. E's positive actual mean is
E=1-5theta/3. Source4 gives alpha45=C=2theta/3>0, and source3 gives
alpha23=A=3x-tau+2theta/3>=C. All zero alpha faces are thereby excluded.

If A>C, the ACTUAL separate block means and left-leaf balance give

    theta=(6/19)(1+x), e=0,q=tau/2,
    (5/2)tau-x=1, tau=2-6x-4theta/3.

They force (q,tau,x,theta,theta)=(19,38,14,30,30)/81.
Thus r=131/81>49/31 and actual stationary G=106/81>40/31.
No local-minimality assertion about that candidate is used.

If A=C, tau=3x. The ACTUAL alpha2345 mean gives
7x+e+23theta/3=4, B=beta12=1-3x-2theta/3.
For B=0, e=x and the equations force theta=12/53,x=15/53,
contradicting theta>2x. For B>0 the positive beta12 mean gives
15x+8theta-9e=6. If e>0, 9e=27x+4theta-6; comparison forces
theta=3x=tau, forbidden. If e=0 the two means give
theta=18/59,x=14/59, again contrary to theta>2x.

### 9.2 Inactive source4 (x<theta<=2x)

Now all right restorations are zero. The exact root exposures are
f=[tau-2x]_+, g=[tau-2theta]_+. Balance s3-s4>=0 rules out
tau>=2theta; hence g=0,tau<2theta,f<=theta-x. Beta345 has positive
mean E=1-(2x+4theta)/3. Source4 gives C=alpha45=(2x+theta)/3>0;
source3 gives A=(4theta-x)/3-f>=C.

If A>C, the ACTUAL alpha45 mean gives2x+7theta=3. Alpha23 and
beta12 means, with B=x+(e+f)/2>0, give

    6tau+3e-3f+4x+8theta=6,
    tau+2x+5e/2+3f/2=1.

For f>0 their elimination gives7x+5theta=3; comparing with
2x+7theta=3 forces x=2theta/5, contrary to theta<=2x.
For f=0 they force e=2(theta-x)/3>0. The clamp then gives
tau=2x+4e>2x, contrary to f=0.

If A=C, f=theta-x>0,tau=theta+x. The ACTUAL alpha2345 mean gives
17x+25theta+3e=12, B=1-4theta/3-5x/3.
If B=0, e=tau/3 and the equations force theta=3/29,x=15/29,
contrary to theta>x. For B>0 its positive actual mean gives
7theta+17x-9e=6. Its e>0 clamp gives9e=11theta+13x-6;
comparison forces x=theta. If e=0, theta=1/3,x=11/51,
tau=28/51,B=10/51, violating the zero clamp tau<=2B.

Every phase/clamp/coarsening of this original subtree tie is included.
The proof is still awaiting independent challenge; it is not a generic
limit of the unique-subroot4/5 proofs. No mathematical subprocess was run.

## 10. Terminal review status — supersedes pending labels above

Critic continuation Sections12–14 FULLY read. Original right-subtree ties
{3,4},{3,5},{4,5},{3,4,5} are accepted after direct actual-means/clamps/polars
review. Builder Section14 triple-tie derivation was read and checked by Main;
no generic limiting argument is used. All strict-root2 right-subtree maximum
sets and reflected root4 cases are now covered on the retained positive-cut
actual competing-minimum domain. The frozen central-root endpoint-tie repair
was separately reread by Critic, not silently replaced by strict-root3.

Global maximum-set audit in that precise natural domain leaves exactly
{1},{5},{1,5} OPEN. All twelve inverted continua/faces and whole-theorem
boundary/attainment assembly remain unclosed. The necessary endpoint bound
and conditional joint-maximizer gain are NOT closure. Global F6>=20/93
remains OPEN; STOP/PARTIAL. No additional mathematical work is routed.

Read the clean report
docs/research/KAKEYA_K6_STRUCTURAL_116_CONTINUATION_20261012_REPORT.md
for accepted claims and correction index; chronological invalid steps above
remain visible but are superseded only by their explicit repairs.
