# TIP116 R2 — endpoint-tie actual flow coupling

Status: hand derivation for independent challenge. Global K6 OPEN.
Envelope02:16:07–03:16:07UTC, mathematical subprocessgrant0.
Frozen predecessor and firstcontinuation bytes unchanged. Main reads exact
actual hull/flow definitions, never applies stationarity to a proxy area.

## 1. Exact scope and reused identities

Natural D>0, actual competing global minimum, one closed bottom component,
full actual gradient, retained range79/61<=r<=49/31 and bottom-slope filters.
Let T1=T5=theta=max T; adjacent maximum ties were already excluded, so
T2,T4<theta; if T3=theta the frozen central proof applies. Remaining endpoint
tie has T3<theta. All three interior actual cuts/flows are retained.

As proved in firstcontinuation Builder Section6, a global endpoint1 maximum
forces beta1>=theta/5>0, all beta positive and bottom maximum label1.
Reflection of endpoint5 forces alpha5>0, all alpha positive and bottom
minimum label6. Therefore

    sum alpha=sum beta=sum delta=r,
    S=sum D=5-r, r=sum T,
    D_i=2T_i+C_i, C_i=sum_j F_ij>=0,
    theta<=5/11.

There are no incoming flows at maximal cuts1/5. Their mutual crossing
prefixes are strictly inactive; their actual outgoing rows have coordinates
only2,3,4. This is an original tied configuration, not a generic limit.

## 2. Both end rows cannot expose ALL three interior cuts

Claim to challenge: it is impossible simultaneously to have

    F14>0 and F52>0

at the retained actual endpoint-tie minimum. Monotonicity of each actual
prefix row then makes ALL its three interior coordinates positive.

At terminal theta, F1,(2,3,4) is the nonnegative decreasing isotonic
projection of (theta-D2,theta-D3,theta-D4). The F5 row is the increasing
projection of the same input. This follows from the actual full-prefix
dual, with the barriers1/5 excluding their mutual coordinates. When the
entire row is positive its sum equals the input sum, including coarsenings.
Put H=D2+D3+D4 and C_mid=C2+C3+C4>=0. Then exactly

    C1=C5=3theta-H,
    D1=D5=5theta-H,
    S=10theta-H,
    r=5-10theta+H,
    H=2(r-2theta)+C_mid.

Eliminating H yields

    C_mid=14theta-5-r>=0, hence r<=14theta-5.

Meanwhile beta1 is positive and at most delta1 (the positive initial
increasing-block minimum-prefix mean is at most its first input). Hence
delta1>0, or D1<1. But

    D1=5-5theta-r >= 10-19theta.

Thus D1<1 forces theta>9/19. This contradicts the previously derived
theta<=5/11, since9/19>5/11 (cross difference99-95=4).

Conclusion, subject to independent review:

    In the endpoint-tie class, F14=0 OR F52=0.

No nearest-only conclusion follows: F13/F53 and one of the opposite farther
flows may remain positive. No positive-fit mean was used for a zero row;
the proof applies to the explicitly assumed two ENTIRE positive rows.
It does not close unique endpoint roots, all endpoint ties or inverteds.

## Ledger

## 3. Stronger exclusion: each end's three-edge farther flow is zero

The preceding weaker conditional exclusion is accepted by Builder and Critic.
The following stronger implication needs separate challenge; it does not
silently upgrade that acceptance.

Assume ONLY F14>0, with no positivity assumption on the opposite row.
The entire first row on2,3,4 is positive, giving C1=3theta-H and
D1=5theta-H. The other maximum endpoint has D5=2theta+C5. Thus

    S=D1+H+D5=7theta+C5,
    r=5-S=5-7theta-C5.

The exact reflected endpoint SOURCE estimate already proved, with clipping
retained, is

    C5+(11/5)theta<=1, theta<=5/11.

Consequently

    r>=4-(24/5)theta>=20/11>49/31,

contradicting the competing range. Cross difference20*31-49*11=81>0.
Reflection gives the same contradiction for F52>0. Therefore

    F14=F52=0

on the ENTIRE retained endpoint-tie domain. F13 and F53 may still be
positive. Both rows need not be fully positive to apply this repair;
only the stated single row uses a positive-sum identity. This is stronger
than Section2, not a replacement of its preserved correct proof.

## 4. Remaining two-edge exposure identity (not a value bound)

If both F13 and F53 are positive AFTER Section3, each endpoint row has
exactly its nearest two positive entries. Positive PAVA sums give

    C1=2theta-D2-D3, C5=2theta-D4-D3,
    D1=4theta-D2-D3, D5=4theta-D4-D3,
    S=8theta-D3, r=5-8theta+D3.

This identity alone does not force r>=49/31. All inner donors and actual
full-hull polars remain; no nearest-only or restricted-mean assumption.

## Execution ledger

## 5. Both two-edge end flows are also impossible (challenge)

Retain Section3's F14=F52=0 and suppose F13>0,F53>0. The zero
last coordinate of each endpoint prefix cone forces D4>=theta,D2>=theta,
respectively. The positive two-entry sums force D3<theta. As their first
unprojected entries theta-D2/theta-D4 are nonpositive, each positive row
pools its two entries:

    F12=F13=f>0, F54=F53=g>0.

Cut3 cannot donate to edges2/4 with D2,D4>=theta>T3; C3=0,D3=2t.
Cuts2/4 cannot send to either global endpoint, or past their opposite
interior edge D4/D2>=theta. Thus, with u=T2,v=T4,

    k=F23=[u-2t]_+, ell=F43=[v-2t]_+,
    D2=2u+k,D4=2v+ell,
    D1=2theta+2f,D5=2theta+2g,
    f=theta-u-t-k/2, g=theta-v-t-ell/2.

These are exact full-prefix reductions, not assumed nearest rows.
Actual recipient balances are

    s1=s5=1-theta,
    s2=1-u-f, s4=1-v-g,
    s3=1-t-f-g-k-ell.

Since s2-s1=t+k/2>0, beta2>beta1. Beta1 is its positive singleton
delta1 and the actual input boundary gives D1>D2, pooling alpha12.
Because D2>=theta>D3, alpha23 also pools, so alpha123=A>0.
Reflection gives alpha4>alpha5, alpha5=delta5 positive singleton,
and beta345=B>0. Consequently

    A=theta+2f, B=theta+2g,
    2theta+t+3f+3g+k+ell=1.                     (E)

Each fit has just two possibilities: alpha123 separate from4 or alpha1234;
beta345 separate from2 or beta2345. No zero-block mean is invoked.

### 5.1 Both three-entry blocks are separate

The EXACT sums D1+D2+D3=4theta and D3+D4+D5=4theta give
A=B=1-4theta/3. Thus f=g=h=1/2-7theta/6>0, theta<3/7.
D2=D4=13theta/3-1-2t; monotonicity of2u+[u-2t]_+ gives u=v,k=ell.
Equation(E) reduces to t+2k=5theta-2.

If k=0, t=5theta-2 and u=3/2-17theta/6. The required clamp u<=2t
forces theta>=3/7, impossible. If k>0, 3u=13theta/3-1 and
2u-3t=5theta-2. Hence

    t=4/9-19theta/27, k=(77theta-33)/27.

Positivity k>0 again forces theta>3/7. This whole separated case fails.

### 5.2 Exactly one four-entry block

Suppose alpha1234 pools but beta345 is separate from2. Its strict positive
beta2/3 boundary and the already strict beta1/2 boundary isolate beta2
as its ACTUAL singleton delta2. Source2 then gives

    A=u+k-f=theta+2f, hence u+k=theta+3f.

Combining the exact f identity with this equality gives k=2t+8f>0,
u=4t+8f. Since alpha3=alpha4 and beta3=beta4,
s3=s4, so v=t+f+k+ell=3t+9f+ell>2t. Therefore ell=v-2t,
which substituted back forces t+9f=0, impossible. Reflection excludes
the other one-four-entry case without a genericity assumption.

### 5.3 Both four-entry blocks

Here s2=s3=s4, giving

    u-k=t+g+ell, v-ell=t+f+k.

If exactly one of k,ell is positive, assume k>0,ell=0. Then g=t,
v=t+f+k, and the g identity gives theta=3t+f+k. The f identity
with u=2t+k gives f=theta-3t-3k/2, forcing k=0. Reflection
excludes the other case.

If k,ell>0, then g+ell=t,f+k=t and
u=3t-f,v=3t-g. The exact f/g formulas force

    f=g=9t-2theta, k=ell=2theta-8t,
    D2=D4=6theta-20t, A=B=18t-3theta.

The ACTUAL alpha1234 mean is1-theta-D4/4, so
13t-theta/2=1. Source3 balance gives39t-6theta=1.
These force t=11/117,theta=52/117 and f=-5/117<0, impossible.

If k=ell=0, then u=t+g,v=t+f and f+g=theta-2t.
The actual four-entry means are

    2theta+t/2+5f/2=1,
    2theta+t/2+5g/2=1.

Thus f=g=(theta-2t)/2. Equation(E) gives theta-t=1/5, while the
means give13theta-8t=4. Therefore t=7/25,theta=12/25,f=-1/25<0,
again impossible.

All four actual hull alternatives and every k/ell zero/positive clamp
are covered. Proposed conclusion for separate hostile review:

    F13=0 OR F53=0

on the ENTIRE retained endpoint-tie domain. This preserves one-sided
two-edge farther exposure; it is NOT a nearest-only or global K6 theorem.

## 6. Shorter independent both-two-edge argument

Builder independently obtained the following aggregate proof; Critic read
and accepted Main Section5, and is separately reading this saved version.
The positive two-entry sums imply D1+D2+D3=D3+D4+D5=4theta and D3<theta.
They force alpha123 and beta345 to pool: alpha12 first pools because
D1>2theta>D2; if its positive block stopped at2, its actual mean
1-2theta+D3/2 would need to be>=delta3=1-D3, forcing D3>=4theta/3.
Reflection yields beta345. Full prefix means therefore imply

    s3=alpha1+beta5 >= 2-8theta/3.

The first-coordinate polar of each interior donor prefix gives
F23>=T2-D3 and F43>=T4-D3, with negative right sides harmless.
Thus M3>=T2+T4-2D3, and actual stationarity gives

    s3<=1-r+2theta+2D3.

Consequently r<=-1+14theta/3+2D3. Combining r=5-8theta+D3
with this inequality and the competing range cap gives

    D3>=6-38theta/3, D3<=8theta-106/31,
    theta>=438/961>5/11.

The last strict comparison is438*11=4818>5*961=4805. This contradicts
the exact endpoint SOURCE estimate. All hulls are actual and positive;
coarsenings and zero interior flows are retained. No all-positive middle
row assumption, genericity, symmetry or proxy stationarity is introduced.

## 7. Nearest ends, interior root2 with right-subroot3: whole exclusion

Assume F13=F53=0 as well as Section3's F14=F52=0. Endpoints send
only nearest flows f=[theta-D2]_+ and g=[theta-D4]_+.
Let u=T2>t=T3>=v=T4, q=T1=T5=theta>u; the case t=v is retained.
Cuts1/5 are barriers. Cut4 has no outgoing flow; D4=2v. Cut3 can
only donate to4, with ell=[t-2v]_+ and D3=2t+ell>=D4.
The exact root2 right row consequently pools its two entries:

    F23=F24=h=[u-(D3+D4)/2]_+, C2=2h,
    D2=2u+2h,D1=2theta+f,D5=2theta+g.

The actual s=alpha+beta balances are

    s1=s5=1-theta,
    s2=1-u-f, s3=1-t-h, s4=1-v-h-ell-g.

First s2-s1=theta-u-f>0: if f=0 use theta>u; if f>0 this
equals D2-u=u+2h>0. Thus beta2>beta1 and beta1 is its positive
singleton delta1. Its strict input boundary gives D1>D2, so alpha12 pools.
Also s3-s2=u-t+f-h>0: if h=0 use u>t; if h>0 the remaining
u-t-h equals v+ell/2>0. Thus beta3>beta2, isolating beta2 as
its positive singleton delta2.

Put A=alpha1=alpha2. Source1 and2 now give exactly

    A=theta+f=u+2h-f, hence u+2h=theta+2f.

If f>0, f=theta-2u-2h forces5u+6h=3theta and f=-u/3<0.
Therefore f=0, h=(theta-u)/2>0, D2=theta+u.
Its positive row gives D3+D4=3u-theta<2u<D2, pooling alpha23.
Since D3>=D4, alpha34 pools as well, including the equal-input case.
Hence alpha1234=A=theta; it may additionally pool with5.
D5>D4 pools beta45. The strict beta2/3 boundary leaves exactly
two positive full-hull alternatives on3/4/5.

If beta3 is separate from beta45, the latter actual mean is
E=1-v-theta-g/2. Source4 has alpha4=theta, giving

    theta+E=1-v-h-ell-g, hence h+ell+g/2=0,

impossible since h>0.

If beta345 pools, s3=s4 gives g=t-v-ell. Its ACTUAL mean and
source3 give

    ell+2v+g=theta+t+3h.

Substitution gives v=theta+3h, contrary to v<theta.
Both coarsenings are impossible. No assumption about alpha5 separation,
zero nearest-end g, or active/inactive ell was required.

This ENTIRE nearest-end class is nonstationary; reflection treats interior
root4/left-subroot3. Cases where interior3 is maximal fall into the exact
nearest-odd stationary calibration (including its interior ties), as
separately checked by Builder. Nearest-end interior2/right-subroot4 and
its reflection, and one-sided two-edge end flows remain OPEN.

## Review and ledger update

Builder and Critic separately accept Section3's individual three-edge
exclusions. Critic FULLY read Section5 and accepted all four original
full-hull alternatives and every k/ell clamp. Sections6/7 require their
own literal review before use. One ordinary patch context failed before
this successful append; no mathematical process was launched.

## 8. Universal endpoint maximum: no three/four-edge farther row

This new proposed reduction DOES NOT assume the opposite endpoint ties
or either alpha terminal positivity. Let T1=theta=max T, retaining the
actual competing minimum filters. The reused endpoint SOURCE lemma gives
beta all positive, r=sum alpha and theta<=5/11. The complete decreasing
hull polar implies for every prefix k

    sum_(i<=k) delta_i <= sum_(i<=k) alpha_i <= r.

Let m in{1,2,3,4} be the last positive coordinate of source1's outgoing
row. Its first m coordinates are positive and the remaining coordinates
are zero. Complementarity at that last positive-prefix boundary in the
actual restoration cone gives the EXACT positive sum

    C1=m theta-sum_(j=2)^(m+1) D_j,
    D1+sum_(j=2)^(m+1) D_j=(m+2)theta.

This remains valid under all positive-row coarsenings; no mean is imposed
on the zero tail. Therefore

    r >= (m+1)-(m+2)theta.

If m=4 this is r>=25/11>49/31; if m=3 it is r>=19/11>49/31,
using theta<=5/11 in each case. Both contradict the competing range.
Thus the ENTIRE endpoint1-max candidate domain satisfies

    F14=F15=0,

and reflection gives F52=F51=0 for any endpoint5 global maximum.
One-sided two-edge exposures F13/F53 remain possible. This reduction
applies to unique endpoint maxima and original endpoint ties, not merely
the all-positive-hull tied subfamily. It needs separate independent review.

For a positive two-edge row the same argument gives only
r>=3-4theta (hence theta>=11/31 under the cap). This is NOT a value
bound sufficient for K6; no stronger inequality is inferred from it.

Ordinary source/status/clock reads, Markdown only. Mathematical calls0,
seconds0, failed mathematical starts0. No code/tests/optimizer/samples/LP/
enumeration/replay/UI/API/Gitwrite/build/install/copy/Docker/deletion/infra.
Initial aggregate historical output truncated; required instructions and
selected exact proof sections reread separately. No scratch/distDircreated.

## 9. Whole endpoint-tie closure: explicit coverage assembly

The declared scope is the retained ACTUAL natural competing minimum with
global maximum-time set exactly {1,5}. It is not arbitrary natural input
and does not cover any inverted apex order. Main Sections3/5/6 and Builder
Sections5–7 eliminate all farther endpoint entries, independently reviewed
literally by Critic. Thus both endpoint rows are nearest-only.

Every original interior ordering belongs to one of the following classes:

1. T3>=T2,T4, including all original ties. Higher adjacent barriers give
   C2=C4=0. All remaining restoration rows are nearest-only, with donors
   1,3,5 and recipients2/4. Their actual positive-cut data give
   D1>D2, D3>=D2,D4 and D5>D4. Consequently the actual full hulls lie in
   alpha12/34 and beta23/45 subspaces, allowing all larger coarsenings and
   clamps. The frozen exact nearest-odd full-cone calibration applies to
   the ACTUAL union and yields G>=40/31. Equality forces zero projection
   deficits (the sharp free hull/restoration anchors are relative-interior
   cone points), then zero positive quadratic displacement, D=D*.
   Its actual T*=(12/31,11/62,14/31,11/62,12/31) violates the endpoint
   global-maximum condition. Hence this class cannot be competing.
2. T2>T3>=T4, or its reflection. Main Section7 excludes the entire class,
   retaining all original T3=T4 contacts, zero selected flows and hull
   coarsenings; no equality-order case is omitted.
3. T2>=T4>T3, or its reflection. Builder Section8 excludes the entire
   class, retaining T2=T4 and explicitly treating the exceptional beta
   merger. The only surviving algebraic stationary candidate has
   r=51/31>49/31 and G=41/31>40/31; it is not asserted locally minimal.

These alternatives exhaust all three interior cut times, including ties.
Thus the ENTIRE declared {1,5} competing-minimum class is noncompeting,
conditional on the frozen exact calibration and upstream attainment,
positive-cut/fullstationarity and range-filter reductions. Critic has
FULLY read the literal component proofs and separately accepted this
coverage/equality audit. Unique endpoint maxima {1},{5}, twelve inverted
continua and the final upstream boundary assembly remain OPEN. No global
K6 lower bound, novelty or research-breakthrough claim follows yet.

## 10. General endpoint with zero incoming flow: proposed SOURCE extension

Let endpoint1 have T1=tau>0 and M1=0, but do NOT require global maximality.
Assume tau<=5/11 from a separate global endpoint SOURCE. Every initial
m-cut closure ratio is at least its ACTUAL closure time tau, so
sum_(1..m)D>=(m+1)tau for m=1,...,5. Consequently

    alpha1=max(0,max_prefix mean delta)<=1-6tau/5,
    alpha1+beta1=1-tau, beta1>=tau/5>0.

The upper bound is positive because tau<=5/11; no zero/clipped mean is
silently substituted. The full increasing hull is positive and preserves
sum delta. The actual bottom maximum is label1 and r=sum alpha. Since
beta1<=delta1=1-2tau-C1, C1+11tau/5<=1. Reflection gives all-alpha
positivity, bottom minimum label6, r=sum beta and C5+11tau/5<=1 for a
zero-incoming endpoint5. The original global-maximum hypothesis was used
only to secure M=0 and the preliminary clipping case. This proposed
extension requires independent literal review before further use.

## 11. Unique-endpoint two-edge row: both terminal alpha zeros impossible

Let T1=theta be the unique global maximum, F13>0 and F14=F15=0.
The actual positive donor prefix gives D1+D2+D3=4theta and D3<theta;
as in the tied-end proof, the actual decreasing hull pools123 positively.
Suppose alpha4=alpha5=0. The genuine positive/zero block boundary makes
N3=0, so the full hull polar gives D4>=1 and D4+D5>=2. It does NOT give
D5>=1 individually, which is not required below.

Let psi=T5<theta<=5/11. The maximal-cut barrier makes F51=0. Source5's
last-positive-row complementarity leaves four possibilities:

* No positive flow: 2psi=D5. The zero-tail polar alone does not bound
  D5 below, so this phase is NOT excluded by the preceding inequalities.
* One positive neighbor: 3psi=D5+D4>=2, impossible.
* Two positive neighbors: 4psi=D5+D4+D3>2, impossible.
* Three positive neighbors: 5psi=D5+D4+D3+D2>=2+D3+D2, forcing
  D1=4theta-D2-D3>2-theta>1, contrary to beta1>0 and beta1<=delta1.

The no-flow phase needs D5>=1 or another independent argument. Thus the
attempt as currently stated does NOT yet exclude the whole zero-alpha-tail
class. This explicitly prevents imposing an individual mean on a zero
pooled block. No later claim may silently omit this remaining phase.

## 12. Repair of the entire zero-alpha-tail class: actual pooled beta and source4

Retain exactly Section11's scope. Its one/two/three-neighbor exclusions
are valid independently of any individual zero-block mean. Thus source5
has no outgoing flow, D5=2psi. The ACTUAL alpha123 positive block has

    A=1-4theta/3, r=3A=3-4theta,
    theta<=(3-79/61)/4=26/61<3/7.

The source2 right-side data are (T2-D3,T2-D4,T2-D5). Their last-two
mean is at most T2-1<0, and their first datum is greater than that mean
because D3<theta<1<=(D4+D5)/2. Their actual decreasing nonnegative
projection therefore has both last entries zero: the negative last-two
pool cannot merge into the strictly higher first datum. This reasoning
also includes the singleton zero alternatives of that tail. Source3's
right-side data on4/5 have first datum T3-D4<0 and total mean at most
T3-1<0, so their decreasing nonnegative projection is identically zero.
Together with source1's F14=0 and source5's zero outgoing row, this gives
M4=0 for the actual full AREA, not for a proxy graph.

All beta values are strictly positive from the endpoint SOURCE lemma.
The actual positive beta block containing4 cannot start at4: its only
possible endpoints would be4 (datum delta4<=0) or5 (mean delta45<=0).
Therefore it starts at or before3 and beta3=beta4. Source3 stationarity
gives A+beta3=1-T3-M3<1, hence beta4<4theta/3. Source4 stationarity,
alpha4=M4=0, now gives

    T4=1-beta4>1-4theta/3>theta,

contradicting the unique global maximum. Thus the ENTIRE positive
two-edge endpoint1 row with alpha4=alpha5=0 is noncompeting, including
the no-flow source5 phase which Section11 alone left open. Reflection
treats the opposite end. This is only a conditional subfamily exclusion,
NOT unique-endpoint whole closure or the global K6 theorem. Separate
literal independent review is required. All zero pooled means were kept
as aggregate polar conditions, never as individual equalities.

## 13. Remaining zero-alpha5 face and full-hull positivity in the m2 regime

Still assume unique global endpoint1 and F13>0. The actual positive
alpha123 block leaves only two ways alpha5 can be zero: alpha4=0
(excluded by Section12) or alpha4>0. In the latter case the actual
positive/zero boundary gives N4=0, so delta5<=0 and D5>=1.
Every source time is <=theta<=5/11<D5. For a decreasing donor row whose
final coordinate reaches5, a positive final fit cannot exceed that last
datum: subtract the preceding nonpositive full-prefix residual from the
tight final positive-prefix residual. Thus positive F_i5 would require
T_i-D5>0, impossible. The direct-neighbor case is included. Therefore
M5=0 for the full union. Section10's independently reviewed source
extension gives alpha5>=T5/5>0, contradiction.

Consequently the ENTIRE unique-endpoint1 positive-two-edge donor regime
has BOTH full hulls strictly positive and satisfies

    S+r=5, S=sum D.

This is a necessary whole-regime structural reduction, not an area
lower bound or unique-endpoint closure. The nearest-only endpoint1
regime, all remaining m2 interior phases, and all inversions remain open.
The inference about D5>=1 was used only at a genuine alpha4>0 boundary,
not on a zero pooled alpha45 block. Independent literal review required.

## 14. Terminal Main handwork / literal-review checkpoint

Main new mathematical derivation STOPPED 2026-10-12 03:07:16 UTC, inside
the same 02:16:07–03:16:07 hand-only envelope. No extension is inferred
from the owner's stream-disconnection/retry message. Main's uncommitted
explorations of the nearest-only endpoint regime yielded no complete
proof and are NOT closure evidence; that regime remains OPEN.

Critic FULLY read and independently accepted Sections8–13 in their exact
declared scopes; Section9's exhaustive endpoint-tie/equality audit is
accepted with the frozen calibration and upstream dependencies. Section11's
failed missing no-flow argument is preserved and superseded ONLY by12.
Section13 establishes both-hull positivity for the entire m2 regime,
not for arbitrary nearest-only endpoint configurations.

Main FULLY read Builder R2 Sections9–15, including12.3's omitted-q
withdrawal and complete repair. Section10 and repaired12 are independently
accepted. Literal review of13–15 is still pending at this checkpoint;
their partition would exhaust m2 but not the nearest-only endpoint regime
or any inversion. Main has not substituted message-level assertions for
those saved full proofs or the independent review record.

Global ALL-real finite K6 lower bound is OPEN. No novelty, whole-K6 closure,
or proof of the general Kakeya conjecture is asserted. Completion report
is docs/research/KAKEYA_K6_STRUCTURAL_116_R2_20261012_REPORT.md.

Ledger: mathematical subprocesses0/time0/failedstarts0; ordinary reads,
clock/status and newMarkdown only. Extra ordinary failed source names in
rg and a failed patch context were followed by corrected reads/patches.
One too-broad source search returned truncated historical JSON output;
it was narrowed to Markdown, not executed as mathematics. Tracked git
diff --check and new-R2-note trailing-whitespace scans are clean at03:07.
No scratch/distDircreated, no deletions or cleanup needed, frozen
predecessor proof files and unrelated dirty changes preserved.

## 15. Final reviewed coverage — supersedes pending checkpoint14

Critic completed FULL literal independent checks of Builder13/14 and15
by03:14:34UTC and accepted their exact scopes. All nonempty right-subtree
maximum sets in the m2 regime are exhausted by10, repaired12.3,13,14,15;
original ties are retained. Thus the ENTIRE unique-endpoint positive-two-edge
regime is noncompeting, with reflection. With universal Section8 pruning,
remaining natural globalmaxsets{1},{5} have nearest-only endpoint rows,
including possibly zero endpoint flow. Interior farther rows are NOT
discarded. All12 inverted continua and upstream whole assembly remainOPEN.

STOP/PARTIAL checkpoint03:14:45UTC; same03:16:07 hardstop. No globalK6,
novelty or generalKakeya claim. An idle-critic send_message did not trigger
review; explicit followup_task reused that same critic and the full check
completed before acceptance. No new agent/ceiling or mathematical process.
