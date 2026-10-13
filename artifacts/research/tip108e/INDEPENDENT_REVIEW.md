# TIP108E — independent hand review of the Q244 refutation

Verdict: the prescribed admissible point REFUTES the whole Q244 calibration
target. No blocking defect found in its algebra, normalization or the reported
exact area. It does NOT refute the actual D>0 obligation; here D is positive.
The shadow-union correction remains valid, but has no whole-domain calibration
proof from this point. R1/global finite K6 and the separate one-bottom domain
remain OPEN. This is written AI review, not external/formal acceptance.

Read the full TIP108E charter, latest commitment/handoff, Vibecode role protocol,
retained Q definition in TIP108D/REMAINING_COUPLED_FLOOR.md, current diagnostic
source and saved Builder control. Source inspection is NOT a fresh execution.
Vibecode preserves independent reviewer/Builder evidence roles and old history.

## 1. Domain and scaling

Set p=(50,32,50,32,0,0)/31 and LEFT56,RIGHT1234. The left span is a=0,
right span b=18/31, S=18/31>18/61, q=d=32/31. Thus1<d<57/31 and the
actual bottom gap is d-1=1/31. All internal ties and the closed S endpoint
are allowed. This is precisely in the critical2+4 domain, not an inadmissible
connected-bottom or zero-gap limit.

The scaled slices have unit bases and slopes j,j-1; each area is1/2.
Original offsets are p/6=(25,16,25,16,0,0)/93 and G=6F.
Because S=18/31, the required scaled threshold(2+S)/2 is exactly40/31.
No radial stationarity or natural-order assumption is imposed.

## 2. Q244 before and after high-pair subtraction

Write the right offsets(q+b,q,q+b,q), left offsets(0,0). The potential
wedges are W56=1/4 and W1234=[2(1-b)^2+(1+b)^2]/4. Their sum is
1-b/2+3b^2/4=925/961. Both indicated cross differences d15,d16 equal
z=q+b=50/31, with1<z<2, so the positive hinge is genuinely active.

Its difference from the negative cap is
[(2-z)^2-(z-1)^2]/8=(3-2z)/8. The remaining linear term is(q-b)/2.
Consequently

    Q_before=2+(q-b)/2+(3-2(q+b))/8-W
            =11/8+q/4-b/4-3b^2/4
            =9495/7688=40/31-425/7688.

This ALREADY refutes the target: every subsequent high-pair subtraction is
nonnegative. It is a counterexample to Q244>(2+S)/2, not merely to the
stronger constant floor40/31 at an interior smaller S.

For completeness, directly integrating(1-y-|D-r*y|)_+ on[1/2,1] gives:

| LEFT,RIGHT | Rank | D | High intersection |
|---|---:|---:|---:|
|5,1|4|50/31|49/38440|
|5,2|3|32/31|1/7688|
|5,3|2|50/31|24/961|
|6,1|5|50/31|0|
|6,2|4|32/31|0|
|6,3|3|50/31|985/23064|
|6,4|2|32/31|359/7688|

The rank4/rank3 decreasing-tail pieces give49/38440 and1/7688. The first
rank2 pair starts above1/2 and gives its full area24/961. For rank3,D50/31,
subtract its lower-band triangle36/961 from1849/23064, leaving985/23064.
For rank2,D32/31, subtract841/7688 from150/961, leaving359/7688. The two
zero pairs finish before1/2. All endpoints/seams have measure zero and are
included by continuity. These seven entries sum to1669/14415.

Therefore

    Q244=9495/7688-1669/14415=129073/115320,
    Q244-40/31=-19727/115320.

The saved source constructs the appropriate four endpoint laws for each pair,
includes all nonparallel crossings in the high band and integrates the clipped
intersection, not a full-pair formula substituted for the high band. Its pair
records agree with the hand pieces above. The lower functional remains oriented
Q244<=G; it is its TARGET implication that fails.

## 3. Independent hand reconstruction of actual G

The left56 fan has area3/4. For the right alternating group, b=18/31>1/3.
Its slice hull has width1+b below y=b and1-b+2y above y=b, hence area
H_R=2-b+b^2. Its true central hole opens at c=(1+b)/4: width4y-1-b on
[c,b], then2y+b-1 on[b,1]. Two outer holes open at t=(1+b)/2, each
with width2y-1-b. Integrating these TRUE holes gives

    G_R=(11-10b+11b^2)/8=8555/7688.

This retains the two long-label bridges in the potential central wedge;
replacing that wedge by a true hole would be incorrect.

Below1/2 the left group is connected. The two group hull intersection opens
at(q-1)/3, changes its left endpoint at q/3, and has area2/3-q/3=10/31.
The right central TRUE hole is entirely in the left hull over[c,1/2], with
area(1-b)^2/8=169/7688. Thus actual low intersection is2311/7688.

Above1/2 the left triangles are disjoint; the right12 and34 subunions are
also disjoint because c<1/2. The high pair sum therefore overcounts only
I5 intersect I1 intersect I2, and I6 intersect I3 intersect I4. No higher
multiplicity or omitted other triple can survive in that band.

The first triple has width q+1-4y from1/2 to(q+1)/4=63/124, area1/7688.
The second triple's successive widths are

    2y-19/31         on[1/2,16/31],
    13/31           on[16/31,50/93],
    63/31-3y        on[50/93,18/31],
    81/31-4y        on[18/31,81/124].

Their integrals are25/3844,26/2883,44/2883,81/7688, respectively, totalling
953/23064. Together the two triples contribute239/5766. Hence ACTUAL high
intersection equals1669/14415-239/5766=2143/28830, and

    G=3/4+8555/7688-2311/7688-2143/28830
     =85789/57660,
    F=G/6=85789/345960,
    D=2G-80/31=11389/28830>0.

In particular F-20/93=11389/345960>0. The hand decomposition agrees with
Builder's BOTH immutable area routines in the saved control; this reviewer
has NOT re-executed those routines. This is a functional falsifier, neither
an admissible actual-D countercertificate nor a smaller global K6 witness.

## 4. Exact shadow-union correction

Let K_A,K_B be the slice hulls and W_A,W_B the unions of potential adjacent
gaps. Each potential positive gap is in its own hull; actual holes are covered
by W because span<1 excludes reversed disjoint label order. Consequently
A*=K_A\W_A is a subset of U_A and B*=K_B\W_B a subset of U_B.

The exact identity is

    |A* union B*|=|K_A union K_B|
      -|W_A\K_B|-|W_B\K_A|-|W_A intersect W_B|.

A point in exactly one hull is lost only through that hull's W; a point in
both hulls is lost only when in BOTH W sets. These three lost regions are
disjoint. Equivalently, compared with subtracting the full two wedge unions,
the valid correction is

    +|W_A intersect K_B|+|W_B intersect K_A|-|W_A intersect W_B|.

The final MINUS intersection must be kept to avoid double restoration. The
correction is nonnegative as a whole, but this identity describes the SHADOW
union, not necessarily the actual union. Group-internal bridging may still
create true covered regions removed from the shadow. Conversely a positive
group bridge cannot automatically be added to a full-union lower bound if
the other group already covers it. At y1 zero-width contacts are harmless.

Thus exact hole/opposite-hull/multiplicity coupling is valid as an ingredient.
Neither this identity, a passing point nor the refutation of weaker Q244 proves
its sufficient whole critical-domain calibration. Q333 is a separate critical
type and is not refuted by this2+4 point.

## Status and ledger / Trạng thái

Zero mathematical subprocesses by this reviewer: hand arithmetic and ordinary
source/document reads only. No producer/old files, code, UI/API/Git/build,
dependency, agents or box-generation work. Created this review only. No
deletion or scratch cleanup required. One read-only filename lookup missed
and was corrected; it was not a mathematical run or altered evidence.

Vibecode giữ tách vai trò và phạm vi bằng chứng. Điểm hợp lệ đã bác bỏ cận
đích của hàm dưới Q244; diện tích thực được tái dựng bằng lập luận lát cắt,
cho D=11389/28830>0. Không phải phản ví dụ D hoặc K6. Hiệu chỉnh hợp bóng
đúng nhưng chưa có chứng minh hiệu chuẩn toàn miền. R1/K6 vẫn MỞ, không
chạy tiến trình toán học hay sửa lịch sử/nguồn của Builder.

## Addendum — outward-envelope correction and endpoint refinements

Hand-reviewed MAIN_OUTWARD_ENVELOPE_CORRECTION.md and HAND_CRITICAL_NOTES.md
after the preceding Q244 finding. No preceding review/proof was replaced.
NO_BLOCKING_DEFECT_FOUND in the following scoped ingredients. Their whole
target floors remain UNPROVED; no new mathematical process was run.

### A. Set orientation and relation to the original Q

The fixed first/last-member interval B_K has positive length: its offset
difference is greater than-1 and u-l-1>=0. It is contained in the actual
slice hull K_K, even if its own interior is not covered by the actual union.
The nonnegative e^- and e^+ are exactly its lower and upper hull expansions.

For2+4, min_RIGHT_left minus LEFT_base_lower is at least d-4y>0 on[0,1/4].
RIGHT_base_upper minus max_LEFT_right is at least d-2y>0 on[0,1/2].
For3+3 these two differences are at least d-3y>0 on[0,1/3]. Each retained
expansion therefore lies outside the opposite ACTUAL hull as well as outside
its own base interval. These conclusions use the same configuration's d;
offset ties and span endpoints do not remove strictness because d>1.

RIGHT_base_upper minus LEFT_base_lower is at least d+1-2y>0 below1/2 for
both types. Thus reverse base-interval separation is impossible. The lower
LEFT outward portion and upper RIGHT outward portion are mutually disjoint
in their common bands. Each is disjoint from the union of both bases.
Consequently they add their lengths to the base-union length without overlap
or duplication of a previously counted base hinge.

This also matches the original Q formulas exactly. For2+4 the low-band
base union is its global base hull minus its only possible forward gap:

    integral_0^(1/2)|B_L union B_R|
      =1/4+(p4-p5)/2+(2-d15)_+^2/8-(d16-1)^2/8.

For3+3 it is

    1/4+(p3-p4)/2+(3/2-d36)_+^2/6
      +(3/2-d14)_+^2/6-(d16-1)^2/8.

The forward gap closes at(d16-1)/4<1/2: d16<=d+S<3 in both retained
domains. The2+4 remaining outer hinge has slope2 and cross difference>1,
so it is zero below1/2. The high-band integrated base widths sum to
7/4+(Delta_L+Delta_R)/2 in each type. Adding these low/high formulas
reproduces the respective original Q linear and hinge terms, not a different
functional requiring an unproved low-band hull-order premise.

Finally subtracting the FULL potential wedges remains safe even when the
new expansions are not actual covered regions: every actual hole is covered
by those wedges. Above1/2, actual hull widths equal base widths+e^-+e^+,
and the same high-pair sum still upper-bounds actual group intersection.
Thus retaining ALL high envelope energies is valid without cross-hull
exclusivity. No high expansion is added as an exclusive subset of the whole
union, and no actual bridge is assumed to survive the opposite group.

Both displayed corrected lower functions, including their height cutoffs,
are therefore valid on the WHOLE corresponding critical domains. Reflection
supplies the4+2 type. This does NOT establish either target calibration.
The withdrawn claim that both full hulls stay disjoint to height1/5 would
indeed be false: the forward gap can close near0 as d decreases to1.

At the SAME already prescribed Q244 point, e_R^-=e_R^+=(b-y)_+, and both
left energies vanish. The retained low RIGHT-upper integral is41/248 and
the all-group high energy is25/3844. Hence the corrected functional is

    129073/115320+41/248+25/3844
      =40/31+11/14415.

This hand calculation shows only that the Q244 falsifier does not falsify
the new correction. It is not another executed diagnostic or a whole proof.

### B. Endpoint-retaining proper-group bounds

For four consecutive members with actual endpoint difference Delta and span b,
the previously checked E<=4B+2h-1 yields exactly

    G4>=5/4+Delta*(1-b)/2-b^2/4
       =[5/4-b/2+b^2/4]+(b+Delta)*(1-b)/2.

This is algebraically the previously retained h*b*(1-b)/2 surplus, since
h*b=b+Delta. Delta>=-b and b<1 justify its nonnegative surplus. It does
not constrain the interior offset attaining the minimum; the stated warning
against an independently worst hull bounding box is essential.

For three consecutive members, the new normalized inequality
E<=4B+2h-3/2 checks in all four extrema types modulo reflected complement:
(1,t,0) has4B-E>=E+1>=3/2; (1,0,C) leaves1/2 after substitution;
(0,1,C) leaves1/2+C^2; (0,t,1) has h2 and E<=2<5/2. The six ordered
min/max locations are exhausted by these four types and reflected copies.
They are closed inequalities, so ties are included. The result is

    G3>=1+Delta*(1-s)/2-s^2/8
       =[1-s/2+3s^2/8]+(s+Delta)*(1-s)/2.

The s0 limits give the common-offset fans directly. These refinements retain
endpoint visibility and are valid proper-group bounds; they are NOT cross
intersection bounds or global supports. Here only consecutive critical groups
are claimed, so no new gapped-label endpoint refinement is silently inferred.

### C. Small spans and the additional hand shortcut refutation

A consecutive adjacent potential gap opens only above(1-delta)/2>=
(1-s)/2. A third member d labels away can bridge only below s/d. Simultaneous
strict inequalities require s>d/(d+2)>=1/3. Therefore no positive bridge
exists at s<=1/3; equality gives only zero-area touching. This is not asserted
for nonconsecutive generating labels. Since min(a,b)<=9/31<1/3, false-gap
corrections can arise in at most ONE group in the critical domains. Cross
intersection and opposite-hull clipping remain unresolved by that observation.

The reported endpoint-exclusive-floor refutation is also valid as hand
reasoning: a=b=9/31,q=41/31 gives d=q-a=32/31 and S18/31. Endpoint1 in
its own RIGHT(q+b,q,q+b) group has unique width min(1-y,(y-b)_+). Its
area is(1-b)^2/4=121/961; the small-span condition ensures no other early
bridge-exclusive piece is omitted. Own-group reflection gives the same bound
for endpoint6 of LEFT(0,a,0). Adding the opposite group only reduces each
exclusive area, so max(E1,E6)<=121/961<270/1891. Thus the proposed uniform
endpoint floor cannot close the target with only the retained consecutive-K5
minimum. No actual G, D counterexample or numerical run is claimed for this
second hand configuration. A stronger actual-five-subset calibration remains
an unproved different implication, not disproved by this upper bound.

### D. Scope update

The actual-hull half-height and shadow functions at the prescribed Q244 point
also check: Q_half_actual=19541/14415=40/31+941/14415; the shadow loss is
at most529/7688, giving a shadow lower floor163643/115320>40/31 there.
All these statements concern the SAME hand point and not whole calibration.
The exact interaction identities and non-double-counting warnings remain valid.

Reviewer ledger remains ZERO mathematical subprocesses; only ordinary reads,
hand derivations and this own-file addendum. R1/global K6 remain OPEN, with
no whole target-reaching inequality for the two continuous critical types.

Bổ sung: cận dưới có hiệu chỉnh bao ngoài đúng hướng và không đếm trùng;
các cận nhóm giữ hai đầu cùng bổ đề khoảng nhỏ đã được kiểm tra bằng tay.
Điểm bác Q244 không bác cận mới, nhưng không thay chứng minh toàn miền.
Không chạy toán, không sửa nguồn/đánh giá cũ; R1/K6 vẫn MỞ.

## Additional HAND review: clipped inward energies and licensed proxy reduction

The following is independent hand reasoning, with ZERO mathematical
subprocesses. It reviews the updated HAND_CRITICAL_NOTES.md,
MAIN_THREE_GROUP_ALGEBRA.md and MAIN_THREE_GROUP_CLIPPING.md. A valid lower
functional is not its unproved target calibration.

### E. Whole two-plus-four C2 replacement

Gauge min_LEFT p=0 and max_LEFT p=a. Set t=p1-p2 and c=p1-a-1.
The actual LEFT56 hull lies in [5y,a+1+5y]. For t>0, c>t follows from
p2>a+1. The interval Xi=[p2+2y,p1+y] is a RIGHT lower-hull expansion.
Its portion to the RIGHT of the enclosing LEFT hull has length
min(t-y,(c-4y)_+). It is exclusive of the opposite actual hull.

If c>=4t its integral is t^2/2. Otherwise the two clipped linear pieces
meet at (c-t)/3; their missing triangular area is (4t-c)^2/24. Thus

    C_right=t^2/2-(4t-c)_+^2/24.

Its support ends no later than c/4<1/2. The correct bound is
c<=d+S-1<44/31, not a strict first inequality: equality in that first
comparison is possible at a0 when p1 is the RIGHT maximum. This correction
has already been preserved in the updated Builder notes.

The portion LEFT of the same box has length min((3y-p2)_+,(t-y)_+).
It opens at p2/3, peaks at p1/4 and closes at t. The peak height is
(3t-p2)_+/4 and its rising/falling slopes are3 and-1, so its integral is
(3t-p2)_+^2/24. Consequently the stated C2 is valid, with all terms zero
when t<=0.

The high portion of this second contribution is already part of the old
RIGHT lower-envelope high energy. Therefore the FULL C2 must REPLACE that
old term, not add alongside it. The right-of-box portion alone is low-band
and has no such conflict. Own-group lower and upper expansions are separated
by a positive base interval; opposite-group outward additions lie in the
opposite hull, whereas these selected pieces lie outside it. All potential
gap wedges and cross-pair subtractions must remain.

For general member j with k=j-1, the same triangle calculation gives

    C_j_right=t_+^2/(2k)-(4t-kc)_+^2/[8k(4-k)],
    C_j_left=((4-k)t-kpj)_+^2/[8k(4-k)].

Each full candidate may replace the old inward high term. Their MAXIMUM is
valid; their SUM is not licensed because the member wedges can overlap.
Since c>t for t>0, C_j_right>=t^2/8. Choosing a member attaining the RIGHT
minimum q yields the valid lower contribution (p1-q)^2/8.

### F. Q244 proxy: legitimate p4 minimization, not true-area minimization

The upper-envelope lower energy

    M=max((p1-p4)_+^2/6,(p2-p4)_+^2/4,(p3-p4)_+^2/2)

is a maximum of individual envelope triangles, not their sum. Its direction
and separation from the selected lower expansion are correct. Thus
Q_proxy=Q244+(p1-q)^2/8+M is a valid whole-domain lower functional.

On D>1, the exact rank2 high-pair function has f2'(D)<=1/6: its derivatives
are5/6-2D/3 on(1,3/2), (D-2)/3 on(3/2,2), and0 above2. Therefore

    derivative_p4 Q244 >=1/3+(p3-p4)/2.

Fix q and a containing RIGHT interval[q,q+b]. On the first M branch,
subtracting (p1-p4)_+/3 leaves at least-b/2 beyond1/3. When active this
follows from -b/3-(p4-q)/6>=-b/2; when inactive it follows from
p3-p4>=-b. On the second branch, subtracting (p2-p4)_+/2 leaves at least
-b/2, directly from p3-p2>=-b when active. On the third branch, subtracting
(p3-p4)_+ leaves -abs(p3-p4)/2>=-b/2. Zero branches obey the same bound.
At switches all one-sided derivatives obey it and the proxy is continuous.
Hence its p4 derivative is at least1/3-b/2>0 throughout the containing box.

Lowering p4 to q preserves that fixed box and its minimum q. It is a licensed
minimization of THIS relaxed lower functional. The containing b must remain
fixed during this argument; no assertion that actual area has an endpoint
minimum follows. The displayed post-reduction expression in Builder notes
also checks by substitution: its wedge sum is
[(B-A)^2+(C-B)^2+C^2]/4+a^2/4, its linear term is1+k0/2, and its cross
arguments retain the common k0,ell. No whole calibrated minimum is proved.

### G. Whole three-plus-three clipping and common-offset algebra

The LEFT456 hull is contained in[4y,a+1+5y]. For RIGHT j2 or3, k=j-1,
t=p1-pj and c=p1-a-1, its selected inward interval has width t-ky.
Its right-of-box exclusive portion is exactly
min((t-ky)_+,(c-4y)_+). The same loss-triangle calculation gives

    C_j_right=t_+^2/(2k)-(4t-kc)_+^2/[8k(4-k)] >=t_+^2/8.

Here c<=d+b-1<7/4+18/31-1=165/124<2, so the contribution is entirely
below1/2. Choosing ONE minimum member gives (p1-min_RIGHT p)^2/8. The
ignored left-of-box portion opens at pj/(3-k), above1/2 for j2 and above1
for j3. Thus this restricted C_right can ADD alongside the old inward high
energy; it does not inherit the full-C2 double-counting issue.

Reflection x'=C+1+6y-x maps p_j to C-p_j and j to7-j. It gives the other
selected low contribution (max_LEFT p-p6)^2/8. The two selected portions
are inside their own hulls and outside the opposite hulls, so cannot overlap.
Their own-group inward/outward sides are separated by positive base width.

An outward expansion with group span s is at most(s-y)_+. Its omitted
middle-band area is therefore bounded above by

    T(s)=[(s-1/3)_+^2-(s-1/2)_+^2]/2.

The whole proxy stated in MAIN_THREE_GROUP_CLIPPING.md is consequently valid:

    G>=Q333+B_LEFT_lower+B_RIGHT_upper-T(a)-T(b)
       +(p1-min_RIGHT p)^2/8+(max_LEFT p-p6)^2/8.

It discards other nonnegative inward high terms. No signed-extrema placement,
span tie or common-gap boundary is removed by this statement.

The exact Q333=P+J identity also checks by direct hand expansion with
t=p3-p4,U=p1-p3,V=p2-p3,X=p4-p5,Z=p4-p6. In particular the wedge
quadratics are X^2+(Z-X)^2 and(V-U)^2+V^2. Combining these with the two
low caps and the rank2/3 base polynomials gives the stated coefficients
-(U^2+Z^2)/3, -7(V^2+X^2)/24, UV/2+XZ/2-UZ/4-VX/4 and the stated
linear terms. The switching coefficients in J agree, including rank2's
essential -H_2/6 term. All cross arguments remain coupled to the same six
offsets. The polynomial P alone is not a lower certificate when its omitted
hinges are active.

### H. Concrete obstruction to a uniform first-order flattening proof

The desired whole-three-plus-three support G>=107/72-S/3 remains UNPROVED
and is NOT refuted here. However, the negative-gradient budget seen at flat
fans does NOT extend uniformly to arbitrary finite spans.

Take the HAND configuration LEFT456=(a,0,a), RIGHT123=(q,q,q), with
a18/31 and q9/4. Its S18/31 and d=q-a=207/124 lie in the current domain.
Differentiate the ACTUAL union area with respect to p5, keeping the other
five offsets fixed. Its own RIGHT endpoint is exposed for y>a; its own LEFT
endpoint is exposed for y<a or y>t0=(1+a)/2. Thus its own-group derivative
is(1-3a)/2. RIGHT group coverage suppresses the exposed right endpoint only
on[(q-1)/2,q/3], and suppresses exposed left endpoints on[q/4,a] and
[t0,(q+1)/4]. These intervals have the required order

    q/4<a<(q-1)/2<q/3<t0<(q+1)/4<1.

They are all above1/2, where the three common-offset RIGHT intervals are
disjoint. RIGHT member3 covers neither exposed endpoint. Consequently

    derivative_p5 G
      =(1-3a)/2-(3-q)/6+(a-q/4)+((q+1)/4-t0)
      =q/6-a-1/4=1/8-a=-113/248<-1/3.

No persistent endpoint contact obstructs this derivative. This is a concrete
counterargument to a uniform finite-span negative-gradient bound<=1/3, not
to the proposed global anchored support. Excess area above the flat-fan
anchor can absorb a locally steeper slope. No actual G or D was evaluated
for this configuration, and it is not an area/defect witness. Local fan
derivatives, stationarity and restricted-family calculations cannot establish
the missing global support.

### I. Whole two-plus-four far strip d>=5/3

The retained pair and proper4 bounds give

    G_LEFT+G_RIGHT>=2-S/2+(3a^2+b^2)/4
                       >=2-S/2+3S^2/16,

the second inequality following from(3a-b)^2>=0. Cross ranks2,3,4,5 have
counts2,2,2,1. At d5/3 their exact full-pair caps are respectively
1/54,2/27,49/540,5/54, giving V244=62/135. Each cap decreases with d.
The resulting floor is decreasing in S<=18/31. At that endpoint its margin
over40/31 is

    13/31+243/3844-62/135=12097/518940>0.

This uniformly excludes the whole d>=5/3 strip of the critical two-plus-four
type, with its reflected strip. It does not close the remaining near strip,
the full label class, three-plus-three or R1/global K6.

Reviewer ledger remains ZERO mathematical subprocesses. All predecessor
reviews and evidence are unchanged. The whole calibrated coupling floor
remains the named open obligation; no AI agreement substitutes for it.

### J. Further licensed reduction of the weaker two-plus-four proxy

Main's subsequent HAND proposal drops the B upper-envelope candidate and uses
M2=max(A^2/6,C^2/2), after the already licensed p4=q reduction. Dropping a
nonnegative candidate from the maximum weakens the lower functional, so does
not invalidate it. For fixed other variables, its B dependence is precisely

    -[(B-A)^2+(C-B)^2]/4-f3(k0+B)-f4(ell+B).

Its second derivative on every exact-pair phase is at most
-1+5/12+3/10=-17/60. The f3 and f4 pieces are C1 at their switching points,
so strict concavity extends across them. Thus minimizing this relaxed lower
functional over B in[0,b] legitimately reduces to B0 or b. It says nothing
about an endpoint minimum of the actual area.

For B0 in the remaining strip d<5/3, all cross differences are below
5/3+18/31=209/93<7/3. Here f4' is nonnegative: it is0 below3/2,
(D-3/2)/5 between3/2 and2, and7/10-3D/10 between2 and7/3. Also f5'>=0.
The A derivative, on either M2 branch, is consequently bounded above by

    -A/2-(2-k0-A)_+/4-(ell-1)/4
    -f4'(k0+A)-f5'(ell+A)+A/3
       <=-A/6-(ell-1)/4<0.

One-sided derivatives at switches obey the same strict bound. Therefore A=b
is licensed on the B0 branch of this proxy, with the same fixed containing
span b. The B=b branch, the remaining C/gap/span calibration and the whole
target floor are not established by these two reductions.

### K. Additional C elimination: valid estimates, then a blocking concavity flaw

For the deliberately weakened Bb proxy with upper energy C^2/2, the A second
derivative is
-1/2+(1/4)*1_{k0+A<2}-f4''(k0+A)-f5''(ell+A). It is bounded above by
-1/4 below3/2, -9/20 between3/2 and2, and-1/5 above2. The relevant seams
are C1. This licenses A0 or b for that relaxed proxy, not for the original
M2 maximum or the true union area.

The complete C-loss bound also checks. On D>1, f2+f3 has maximum3/40 at
D7/5; abs(f3')<=1/8 and separate maxima f2<=1/16,f3<=1/20. Thus the
mixed-argument cap min(3/40+a/8,9/80) is valid. For Bb branches the C
derivative is at least b/2-1/6-a/4. When ell=k0+a, use f3''<=1/4 and
(f2+f3)'<=1/6. When ell=k0-a, set x=ell+C: below x+a3/2, f2' is decreasing,
and above that threshold f2'(x+a)<=0 while f3'(x)<=1/8. Therefore the
uniform loss m(a,b)=b*(1/6+a/4-b/2)_+ is sound in both orientations.

These ingredients do NOT establish the subsequent fixed-S chord reduction.
Main caught and withdrew that attempted step before certificate acceptance;
this reviewer independently confirms the defect. For the Bb/Ab branch with
k0=d,ell=d+a and b=S-a, write h23=f2+f3 and h34=f3+f4. Its C0 scalar
function H has

    H''=-3/4+(1/4)*1_{d+b<2}-h23''(d+a)-h34''(d+b).

The low hinge has POSITIVE second derivative1/4, not negative. At the HAND
interior parameters d6/5,S1/2,a1/10,b2/5, its two arguments are13/10 and
8/5. The hinge is active, h23''=-5/12 and h34''=-13/60, giving

    H''=-3/4+1/4+5/12+13/60=2/15>0.

Thus H is not concave on the whole fixed-span interval; its endpoint values
cannot alone provide the claimed chord lower bound. This refutes that proof
ingredient, not actual defect positivity or any independently stronger lower
proxy. No entire Bb/Ab branch closure is admitted. Endpoint algebra, C-loss
and small-span estimates cannot substitute for the missing interior bound.
Reviewer mathematical execution count remains ZERO.

### L. Corrected COMPLETE B=b proxy-branch calibration

The subsequently saved MAIN_BMAX_CALIBRATION.md replaces the false concavity
step with the valid upper-curvature bound H''<=2/15. This reviewer has read
the complete corrected source and independently checked its HAND proof.

For fixed S,d, C1 seams and H''<=2/15 imply H-a^2/15 is concave, hence
H(a)>=(1-a/S)H(0)+(a/S)H(S)-ab/15. The opposite orientation has H''<=-1/5.
The H00 orientations have H00''<=-11/12 and<=-17/60. Grouping the paired
functions, rather than separately adverse curvature phases, gives these
bounds. Thus the same weaker chord-error estimate applies to all four faces.

All THREE displacement-phase polynomials for the pure-right H0 endpoint
and all THREE for the harder pure-left HS endpoint check by direct hand
expansion of the exact f_r pieces. For S>=1/2, the three phases exhaust
the domain: d<=3/2 with d+S<=2, d<=3/2 with d+S>=2, and d>=3/2 with
d+S>=2. Their boundaries are continuous. The phaseII vertices lie below
their intervals precisely under S<53/65 and S<29/40, respectively, both
valid here. H0 phaseIII has positive derivative; HS phaseIII is concave
and therefore needs BOTH endpoints, which the source explicitly checks.

Completing the first-phase squares gives the exact stated endpoint margins:

    H0-(1+S/2)>=[4385-6970S-925S^2]/7920
                  >=455/138384;
    HS-(1+5S/8)>=181/432-65S/216-71S^2/108
                  >=9385/415152.

The last HS phase at d5/3 has margin
719/1080-33S/40-7S^2/20>=71309/1037880>1/20, so is not an overlooked
lower endpoint. The A0 pure-right endpoint dominates H0 by at least
S/4-3S^2/8+(f4+f5)(d+S)-(f4+f5)(d), with a further nonnegative hinge
when d+S>=2. The opposite pure-left orientation exceeds HS by at leastS/4.
These comparisons use the same S,d and include both cross-difference phases.

For S>=1/2, m<=a/8 is valid: the active quadratic's upper bound for m-a/8
is(36S^2-132S+49)/1728<0 on the stated interval. This threshold is explicit;
the source does NOT use that inequality on the smaller-span domain where it
can fail. With u=a/S, the extra endpoint allowance S/8 absorbs this loss,
leaving margin at least3/1000+17u/1000-S^2*u*(1-u)/15. Since S^2/15<9/400,
its completed-square lower bound is959/360000>0.

For S<=1/2, the fixed-d derivative bounds for H0-(1+S/2) and HS-(1+S/2)
are correct on every exact-pair phase, using f3'>=-1/12,f4',f5'>=0 and
h2345'>=-1/4. The S1/2 endpoint floors are535/6336 and1/6. The uniform
C loss and curvature loss are at most49/1728 and1/240, respectively. Their
remaining margin535/6336-49/1728-1/240=2467/47520>0 checks exactly.

SCOPED PASS: the corrected proof gives the uniform959/360000 margin for
the ENTIRE relaxed B=b branch, both A endpoint faces, arbitrary C and both
left orientations, including span/phase ties. No finite actual geometry or
unproved endpoint minimum replaces that quantification. This does NOT yet
calibrate B=0/A=b, the whole two-plus-four type, three-plus-three or R1/global
K6. The false-sign predecessor remains preserved above. No mathematical
execution or external/human referee acceptance is claimed.

### M. COMPLETE B0 scalar calibration and resulting critical 2+4 closure

The subsequently saved B0_SCALAR_CALIBRATION.md has been read completely and
independently hand-checked. Its role is calibration of the ENTIRE other relaxed
proxy branch, not a finite set of actual geometries. All previous licensed
reductions remain inequalities on containing boxes; no actual-area endpoint
minimum is inferred.

The scalar Q after the mixed f2/f3 cap c(a) and discarded nonnegative upper
remainder is correct. In negative left orientation p5=a,p6=0, both LEFT
envelope expansions equal(a-y)_+. The lower expansion through1/4 contributes
a^2/2 for a<=1/4, otherwise a/4-1/32. The TWO high expansions together
contribute(a-1/2)_+^2. Thus the stated F(a) is valid. Its low part is outside
the RIGHT hull by the previously reviewed d-4y>0 bound; its high parts are
individual group-hull additions with the same cross-pair subtraction retained.
None was retained in this weakened B0 proxy already. They are not a false-gap
restoration, do not overlap the selected opposite low correction, and are not
duplicate high energy. In positive left orientation these expansions vanish.

At the pure RIGHT endpoint, the displayed phase polynomial checks by exact
expansion of h234(d) and h45(d+S). Its derivative is positive for d>=1.
When d+S>2, the base derivative is(3-d-S)/4>1/10 and h234'(d)<0: in that
phase d>2-S>=44/31>7/5, which justifies the latter sign also below3/2.
The remaining h45 derivative is at most1/10. When d+S<3/2 the displayed
derivative-1/3+5d/12 is positive; between the switches the exact derivatives
give the same monotonic direction. Thus no displacement phase is omitted.
The endpoint d1 yields exactly

    delta_R=29/60-13S/20-9S^2/40>=1733/57660>3/100  (S>=1/2),
    delta_R=61/120-3S/4-S^2/8>=49/480              (S<=1/2).

These formulas meet at S1/2. The pure LEFT scalar endpoint differs from HS
by f2(k)+f3(ell)-c(S), hence loses at most9/80; the positive orientation
retains its extra S/4. This is a valid inequality, not separate attainment
of unrelated extrema.

For the stripped scalar J, the negative-orientation upper-curvature bound
13/60 checks. If d+b<2, f4''(d+b)>=0 and its bound is actually1/6; otherwise
the bound is-3/4+2/3+3/10=13/60. The positive orientation has J''<=-7/12.
All seams are C1, so the endpoint chord error is at most13ab/120 on the
negative side. The additional cap chord deficit is precisely the stated
c(a)-[(1-a/S)c(0)+(a/S)c(S)], not an uncharged switch of that cap.

For S>=1/2 and a<=3/10, combining endpoint bounds3/100 and delta_1>11/500
gives the claimed margin3/100-(83/1000)a/S-(13/120)a(S-a)+F(a).
The adverse linear coefficient is at most887/3875<23/100. Thus the two
low-a interval floors191/24000 and101/9600 check by completed square and
monotonicity, respectively. For a>=3/10, the endpoint/cap part is at least
-7/250, F(a)>=7/160 and curvature loss<1/100. This gives the explicit
floor23/4000>1/200. No presumed a0 dominance is used.

On positive orientation the two endpoint margins are at least3/100 and the
largest cap deficit is29/1600, giving19/1600. For S<=1/2 the endpoint floor
13/240, cap deficit<=3/200 and curvature loss<=13/1920 give311/9600.
Ties and the a1/4,a3/10,a1/2,S1/2 boundaries are continuous. Consequently
the ENTIRE B0 branch has the conservative uniform margin1/200.

SCOPED HAND PASS: combine this B0 calibration, the corrected ENTIRE B=b
calibration and the whole d>=5/3 pair bound. For every configuration in the
critical LEFT56/RIGHT1234 domain, including both left orientations, all offset
ties, containing-span endpoints and its reflected LEFT3456/RIGHT12 domain,

    G-(1+S/2)>=959/360000,
    D=2G-(2+S)>=959/180000>0.

The far-strip margin12097/518940 and B0 margin1/200 both exceed959/360000;
there is no unbounded separation gap between these pieces. This is a
uniform analytic closure of these critical types, conditional only on the
explicit retained proper4/pair/lower-functional dependencies reviewed here.
It is NOT closure of LEFT456/RIGHT123, the separate one-bottom domains,
R1 or global K6. No novelty, method-superiority, external referee or formal
proof status is inferred. Reviewer mathematical executions remain ZERO;
only own review was appended and all predecessor evidence preserved.

### N. Additional three-plus-three proxy reduction, NOT calibration

Main's subsequent HAND proposal reflects the groups if necessary so the RIGHT
span b<=9/31<1/3. The full reflection previously checked swaps these canonical
groups and preserves their spans/area. Thus T(b)=0; no extrema placement or
apex order is assumed. Replace the RIGHT outward energy by

    M3=max((p1-p3)_+^2/4,(p2-p3)_+^2/2),

retaining C_RIGHT=(p1-q)^2/8 and the other clipping-proof LEFT terms, which
are independent of p3. Fix the original minimum q and containing span b.
Direct differentiation of Q333 gives

    derivative_p3 Q333=1/2+(p2-p3)/2
      -f2'(D35)-f3'(D36)-(3/2-D36)_+/3.

The bracket is at most1/3. Indeed f2'<=1/6; below3/2 the other two terms
combine to(3-D36)/12<=1/6, and above3/2 they are at most1/8. The first M3
branch subtracts(p1-p3)_+/2, leaving the relative term at least-b/2; the
second subtracts(p2-p3)_+, leaving-abs(p2-p3)/2>=-b/2. These inequalities
include zero branches and one-sided derivatives at ties. Hence the complete
proxy p3 derivative is at least1/6-b/2>=2/93>0.

Lowering p3 toq is therefore licensed for THIS lower functional. It preserves
q and the containing interval[q,q+b]; keeping b fixed is essential. It is not
an endpoint minimization theorem for the actual union. At p3=q write
A=p1-q and B=p2-q, then further weaken M3 to A^2/4. The retained inward
correction adds A^2/8 and introduces no B dependence.

The only B terms are the two RIGHT potential wedges and the cross functions
f2(D24),f3(D25),f4(D26). Thus its second derivative is at most
-1+2/3+5/12+3/10=23/60. The pieces are C1, giving the valid whole-interval
endpoint chord inequality with deficit(23/120)B(b-B). Its maximum is
23b^2/480<=621/153760. This is a charged curvature error, NOT an assumption
that the actual union or this weakened proxy is concave or endpoint-minimized.

SCOPED PASS of these reductions only. The endpoint functions, the remaining
LEFT offsets/span, common-gap switches and uniform target floor are still
unproved. No three-plus-three or R1/global K6 closure follows. Mathematical
execution count remains ZERO.
