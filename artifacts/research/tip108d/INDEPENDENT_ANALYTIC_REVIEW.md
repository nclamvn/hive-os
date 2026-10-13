# TIP108D — independent hand challenge

Verdict: NO_BLOCKING_DEFECT_FOUND in the scoped ingredients and31 whole-label
exclusions reviewed below. R1 and global finite K6 remain OPEN: LEFT56,3456,
456 still require continuous coupled proofs. This is a written AI challenge,
not an external referee, formal proof, novelty finding or vote-based acceptance.

Read the active charter/commitment/protocol/latest handoff, HAND_COUPLING_NOTES,
PROPER_FOUR_GROUP_PROOF, ISOLATED_TRIANGLE_CLASSES, L356_COUPLED_PAIR_PROOF,
HAND_LABEL_CLASSIFICATION and actual label_criteria.py. Checked the retained
TIP104 inverse triple arguments, TIP108 gap-insertion functional, TIP108B
three-group theorem and relevant retained tangent record. Vibecode informed
the independent role/output separation; no producer artifact was edited.

## 1. Scaling, reflection and directed intersections

G=6F is the area in scaled coordinates X=6x. Every unit-base triangle has
area1/2 and slice[p_j+j*y,p_j+1+(j-1)*y]. For two positive-gap bottom groups,
bottom width is2+S; no radial stationarity is used to prove D=2G-2-S>0.

To avoid sign ambiguity, use canonical J_r(z) for higher-minus-lower offset,
and C_r(D)=J_r(-D) for a separated cross pair with higher label on LEFT.
For D>1, C_r(D)=(r-D)_+^2/[r(r^2-1)] for r>=2; rank1 and all other cross
orientations are disjoint in area. C_r(D)<C_r(1) for every D>1, including
the zero continuation. All retained signatures have a directed pair. Thus
O<C_L, not merely O<=C_L, is justified by the pair union bound.

The K6 reflected shear X'=1+6y-X preserves area, sends j to7-j and p to-p,
and reverses LEFT/RIGHT. Accordingly LEFT maps to{7-j:j in RIGHT}, not
simply to the reversed original LEFT. Ranges are exchanged and d,S preserved.
The normalized proper-group version sends v_i to1-v_(n-i). No symmetry-based
omission of a remaining continuous class is introduced.

Two local exposition errors found on the first read were reported, then
corrected in the new notes with an explicit correction record:

- D_ij can attain d, so the relation is D_ij>=d>1, not D_ij>d.
- Adding the two bridge-positive inequalities gives u+w=s>r+t directly.
  The former longer expansion was incorrect; the corrected contradiction is
  stronger since s<1 and r+t>=2. Neither correction invalidates the conclusion.

## 2. Pair floors and quantitative gap insertion

For within-group offset magnitude at most a<1, the negative branch overlap is
B_r(u)=(1+u)^2/[2(r+1)]-u^2/r. It dominates the positive branch and is maximized
over0<=u<=a at min(a,r/(r+2)). Thus g_r(a) is a safe pair union lower bound.
More precisely it is the minimum for allowed range<=a; when a exceeds the
overlap maximizer, it need not be sharp for the EXACT prescribed range a.
This harmless relaxation is sufficient for every subsequent inequality.

The derivative of2g_r(a)+a is(r-1)/(r+1)+2(r+2)a/[r(r+1)] before saturation,
and1 after; hence2g_r(a)+a>=2-1/(r+1) throughout0<=a<=18/31. Combining a
four-group weak floor and O<C_L gives83/62-1/(r+1)-2C_L, as stated.

The new insertion residual is a quantitative consequence of the RETAINED
piecewise-C1 hull-envelope loss estimates for the SAME hull-minus-wedge
functional. It does not assert actual union-area monotonicity. For delta>=0,
the residual numerator has endpoint lower bounds313/961 and169/961. For
delta=-u, the r1 split has bounds457/961 or min(313/961,337/961); r>=2 has
min(313/961,457/961). Concavity in the relevant u/delta intervals justifies
endpoint minimization. Consequently gamma_r=169/[1922(r+1)(r+2)] is valid.
Telescoping sum_r1..g-1 1/[(r+1)(r+2)]=1/2-1/(g+1) proves the stated addition.
For145/236, the two gap3 contributions add169/1922 to D, changing-67/1922
to102/1922=51/961. Three-group quadratic strengthening is also a bound on
this SAME consecutive-label lower functional, so insertion residue can be
added without presuming that a bridge correction survives the opposite group.

## 3. Strengthened proper four-group bound

For positive s, normalization gives attained extrema0 and1. There are twelve
ordered distinct min/max positions; reflected-complement reversal has four
fixed types and four paired types, hence the eight listed cases are complete.
All inequalities are closed and include ties. The envelope claims in cases
1,4,5,6,8 follow from individual triangular envelope integrals. Substitution
gives exactly the displayed nonnegative remainders. Case7 uses E<=3 and h=2.

Case2's lower hull changes at a1/2 and upper hull at a=(2+C)/3. Below1/2,
the needed difference is E0-(1-C)^2/3>=0. In the middle interval it is
2a(1-a)-(1-C)^2/3, bounded by its two endpoints; above the threshold it is
(1-a)^2+2C(1-a)>=0. Thresholds and hull energies agree at their seams.

For case3, d=(1-a,a-b,b) sums to1. Prefix/suffix drops are nonnegative, so
all relevant PAV block averages are nonnegative despite a possible negative
middle entry. The convex/concave hull energies are half the squared norms
I,J of the two opposite monotone projections. Their block cases are exhaustive:

- A three-block projection pairs with a one-block projection: I+J=E+1/3,
  and E>=1/3.
- Two two-block projections pool opposite adjacent pairs, giving
  2(I+J)-E-1=(d1-d3)^2.
- One/two blocks reduce after reflection to x=d1>=1/3,
  max(0,(1-x)/2)<=y=d3<=1/3. The residual is minimized at a y endpoint,
  where it is3(x-1/3)^2/2 or(x-1/3)^2. y0 occurs only at x1.
- Both one-block projections force the constant vector, giving equality.

Thus E<=4B+2h-1. Substitution yields
G4>=5/4-s/2+s^2/4+h*s*(1-s)/2>=5/4-s/2+s^2/4.
Common offsets follow at s0. Retained insertion enlarges the SAME functional,
so the theorem and its quantitative gap residue extend to arbitrary integer
labels. There is no equal-step, offset-order or actual-area-convexity premise.

## 4. Isolated outer triangles and exact dependencies

The outer tail is pointwise at least min(1-y,(r*y-b)_+). Its breakpoints are
b/r and(1+b)/(r+1), both in[0,1] when0<=b<r. Its integral is
(r-b)^2/[2r(r+1)]. If disjoint from the opposite group, this SAME tail lies
outside all other five triangles, regardless of overlaps among those five.

E45: triangle6 is disjoint from LEFT4,5, and three labels separate it from
its same-group competitors1,2,3. The OTHER FIVE are precisely consecutive
labels1..5, so their unit-base scaled area is5*(14/61)=70/61. This is the
only use of a five-member theorem here. The tail at b18/31 is1875/7688,
giving G>=40/31+47415/468968 and D>=47415/234484.

E46: triangle5 is disjoint from LEFT4 by forward ordering and LEFT6 by the
rank1 inverse support. Its r2 tail is at least484/2883. For triple346,
a=p6-p3,b0=p6-p4 satisfy a-b0=p4-p3<-1. TIP104 Section2's FULL inverse
halfspace cap J3(a)+J2(b0)<=5/14 applies; pair3,4 is disjoint, so no triple
intersection is lost. Triple area>=8/7 plus the exclusive triangle5 tail
gives G>=40/31+412/20181 and D>=824/20181. No gapped-five theorem is used.

E256: triangle2 is disjoint from all RIGHT1,3,4. Its reflected r3 tail is
at least1875/7688. Triple456 has the inverse adjacent halfspace relation
a0-b0=p5-p4<-1. TIP104 Section3 establishes J2(a0)+J1(b0)<=3/7 for the
WHOLE halfspace, including the rank1 seam without an invalid global-C1
assumption. Thus triple area>=15/14, and G>=40/31+1345/53816,
D>=1345/26908. The reflected LEFT is346. All three reflections preserve
the offsets/ties/positive-gap domain; their table rows are correct.

## 5. L356/R124 coupled four-triangle exclusion

Triangle4 is disjoint from LEFT3,5. Hence G345=3/2-J2(delta), delta=p5-p3.
Adding triangle1 and bounding its overlaps individually gives the stated
four-triangle floor2-[J2(delta)+C2(D)+C4(D-delta)+J3(epsilon)]. The omitted
triangles2,6 only increase area. D>1,D-delta>1, |delta|<=a, |epsilon|<=b
all follow from the actual separated groups, not independent cap optimizers.

For delta>=0, D>=1+delta gives bracket without the last pair<=29/60.
For delta=-u, monotonic cross caps give T(u)=29/60+7u/30-19u^2/60.
Crucially b<=S-u; since B3(b)=1/8+b/4-5b^2/24 increases up to3/5 and
18/31<3/5, the other pair contributes at most B3(S-u). This retains the
range/offset coupling that independent maxima would discard.

Square completion has coefficient-21/40 in u and linear coefficient
(25S-1)/60. Its unrestricted maximum is
H(S)=73/120+S/4-5S^2/24+(25S-1)^2/7560, also bounding the delta>=0 case.
H'(S)=(92-95S)/378>0 on the allowed range. At S18/31,
H=128488/181629=22/31-410/181629 exactly. Thus the whole class satisfies
G>=40/31+410/181629 and D>=820/181629>0. Boundaries/ties are included;
using separation1 in the caps only weakens the actual d>1 bounds.

## 6. Complete finite-label predicate versus continuous closure

Independently reconstructed ten size2 sets from pairs in23456, ten size4 sets
by reflected complements of those pairs, and fourteen size3 sets: among the
twenty triples remove123,124 by connectivity,146,156 by endpoint1's far
neighbor exclusion, and245,345 by endpoint6's reflected exclusion. The
result matches HAND_LABEL_CLASSIFICATION completely. Cross sums and the
listed positive floors were checked by hand; reflection preserves C_L.

Q34 minimizes3a^2/2+(S-a)^2/2 in the unsaturated branch, giving3S^2/8 at
a=S/4. The saturated branch increases. The other four-group's gap3 adds
169/3844 to D, giving35/3844 at S18/31. Q36 minimizes
a/2+5a^2/12+(S-a)^2/2, giving S^2/2-3(S-1/2)_+^2/11; the resulting floor
decreases in S and is7033/317130 at the endpoint.

Inspected label_criteria.py as FINITE PREDICATE ARITHMETIC ONLY. Its general
pair/four minimum has c=(r-1)/(r+1), e=(r+2)/[r(r+1)] and
a*=max(0,(S-c)/(2e+1)). For r1,2,3 at S18/31 these are at most9/62,
23/217,15/341, respectively, below the saturation thresholds; for r4,5
c>Smax and a*=0. The saturated-region derivative1-S+a>0 excludes a hidden
minimum. The minimized-energy derivative is S-a*<=S, so adding it to the
-2S baseline remains decreasing. Evaluating at Smax is therefore uniform,
not sampled optimization. The source adds gap residue ONLY to the OTHER
four-group: the exact pair bound already accounts for its label gap.

The finite helper has no offsets/cells/geometry cover and its source is
consistent with these analytical predicates. Main reports its own fresh exact
finite-label execution PASS; this reviewer did NOT execute it. Source inspection
is not separately executed acceptance. The class proof dependencies address
31 rows and leave exactly LEFT56,3456,456. Negative residual floors are not
counterexamples and do not show the actual target is false.

## 7. Additional ingredients and explicit open gap

The shadow-union identity is exact: regions in only one hull lose that hull's
uncovered wedges, while a region in both hulls is lost only in both wedge sets.
Within-group potential gaps are disjoint for span<1; at y1 touching is harmless.
Their actual-hole cover follows from the no-reversed-disjoint-label argument.
The three-member bridge formula integrates the min of its increasing gap
width and decreasing covering endpoint, with no truncation since u<1 and
r,t>=1. Its reflected formula and the corrected at-most-one argument hold.
These positive group bridges cannot be simply added to a full-union lower
bound when the opposite group may already cover them; that warning is essential.

The flat-gap-support counterexample is valid: for labels1245 and offsets
(s,0,s,0),0<s<1/4, hull-minus-gaps equals actual area
4/3-2s/3+s^2/3. At s1/8 this is241/192, below61/48 by1/64. Thus the
quantitative small insertion residue must not be replaced by a full flat gain.
The retained L56/R1234 tangent at q11/10 has G123/80 and right gradients
(-1/4,-1/40,-1/8,2/5); low-height hull/high-height pair differentiation agrees.
Moving the first three right members together loses2b/5 at first order, so
partition-specific loss<=S/3 is false. Proposed stronger global supports remain
UNPROVED: their positive target margins are not global support proofs.

The remaining substantive obligation is an actual coupled calibration for
LEFT56/3456 and LEFT456 over their complete offset/separation domains. The
review does not eliminate these by majorization, stationarity, symmetry or
unproved convexity; no new cover or continuation of TIP108C was performed.

## Ledger and status / Ghi nhận và trạng thái

This reviewer performed HAND reasoning and ordinary read-only source inspection:
ZERO mathematical subprocesses, tests, searches, diagnostics, box generation,
UI/API/Git/build/install or extra agents. Created this review only; predecessor
bytes and other agents' source/proofs were not edited. Nothing was deleted.

Kết quả: không phát hiện lỗ hổng chặn trong các bổ đề/cận được rà soát và31
lớp nhãn toàn miền. Hai lỗi diễn đạt/cộng đại số đã báo và được sửa có lịch sử.
Cận G4, đuôi tam giác cô lập, các cap nghịch TIP104, ghép L356 và bảng nhãn
đã được kiểm tra bằng lập luận viết. Không chạy tiến trình toán học; kiểm tra
bảng bằng máy là bằng chứng riêng của Main, không phải lần chạy của reviewer.
R1 và K6 toàn cục vẫn MỞ với LEFT56,3456,456; một thành phần đáy cũng MỞ.
Vibecode giữ tách vai trò và bằng chứng, không thay chứng minh bằng phiếu AI.
