# K6: full coverage context, exact routing and the remaining global payment

**PARTIAL — K6 OPEN.** No all-real certificate of `G>=40/31`, equivalently
`F6>=20/93` or `Q<=53/31`, was obtained. The full source-aware degree-four
class is neither proved sufficient nor ruled out. No solver was run.

Scope: CONTEXTUAL_D4_SCOPE_20261013.md. Owner approved full coverage context,
degree<=4, feasibility before execution, no infrastructure or local closure.
Activation2026-10-13 10:44:35UTC; ceiling11:14:35UTC. Main NEW DERIVATION STOP
observed11:04:34UTC, before writing this report: hand assembly exhausted, not
a proof of class infeasibility or a solver failure. Builder stopped10:55:25;
critic stopped10:59:28. Later literal checks of supplied expressions are
recorded separately. Predecessor files and failed-route history are preserved.

## 1. The exact all-six-source obligation

Use the existing490-variable clip/paired-sort/union graph and the preceding
area-preserving compactification D; no new variables, gates or inequalities.
The triangles have slices `[A_j-j*t,A_j-(j-1)*t]`, height0<=t<=1, A6=0.
Let `f(s)=s-s^2/2`. The ten-ray objective is `G=3-Q`, with coefficients

    c_R1=3,c_R2=2,c_R3=1,c_L4=1,c_L5=2,c_L6=3,
    c_L1=-2,c_L2=-1,c_R5=-1,c_R6=-2.

For i<j set d=j-i, Delta=Aj-Ai, and use ORIGINAL clips

    a=clip(Delta/(d+1)), b=clip(Delta/d),
    c=clip(Delta/(d-1)) when d>1.

The actual pair-intersection area, on the whole domain, is

    J_ij=((d+1)*(1-a)^2-2*d*(1-b)^2+(d-1)*(1-c)^2)/2.    (1)

Omit the final term for d=1. For Delta>=0 the slice intersection length is
the sum of ramps born at Delta/(d+1), Delta/d and Delta/(d-1), with slope
coefficients d+1,-2d,d-1; integration gives (1), including saturation and
contacts. For Delta<0 there is no interior intersection; all clips are0
and (1) is0. The adjacent two-ramp version includes its constant tail.

The covered-boundary bands [a,b] have summed ray coefficient d+1, and
[b,c] coefficient1-d. Thus their exact source contribution is

    (d+1)*(f(b)-f(a))-(d-1)*(f(c)-f(b))=J_ij.

For d=1 the parallel contributions cancel, including the shared flag at
Delta=0. Existing paired-sort moment equations transport the source sum;
no post-sort source label is assumed fixed. Consequently

    Q_source=sum_all_15_pairs J_ij.                    (2)

For sorted bands [l_k,h_k], retain the existing prefix-max wires H_k,S_k.
Write the quadratic ABBREVIATIONS (not new generators)

    E_k=f(h_k)-f(l_k)-f(H_k)+f(S_k), E1=0,
    R=sum_ray c_ray*sum_k E_k.

Then `Q=Q_source-R`. Because the total area of the six triangles is3,
if m(x,t) is actual coverage multiplicity, the same R is exactly

    R=G-3+sum J_ij
     =integral [C(m,2)-m+1_(m>0)]
     =integral C(m-1,2) over m>=1, with0 at m=0.        (3)

This proves aggregate R>=0 on genuine geometry despite the signed ray
coefficients. It retains every source, nesting and multiple overlap.
It is NOT a polynomial generator to which arbitrary multipliers may be
attached at an invented lower degree. The open quantitative obligation is

    P=53/31-sum J_ij+R >=0.                            (4)

Qualitative R>=0 does not establish (4). No new sharp area floor follows.

## 2. The precise escape from fixed triple weights

At each nonempty active source set S, choose its LEAST active label v.
The triples containing v and two other active labels number C(|S|-1,2),
exactly the pointwise correction in (3). Thus a context-dependent choice
can represent the correction with no tetrahedron overcount.

For example, on exact sets234,235,245 or345 the required sole triple is
selected. On2345 the rule selects234,235,245 but not345: its value is3,
not the4 forced by keeping all four fixed coefficients1. In particular,
the coefficient of345 changes when source2 becomes active. This explains
why the predecessor's fixed-weight impossibility does not reject context.

The direct Boolean expression uses `X_v*product_(u<v)(1-X_u)` times two
more memberships and can reach degree6. It is NOT a degree4 graph proof.
The existing full-prefix wires represent R quadratically without that
Boolean expansion, but representation of R is not the inequality (4).

## 3. A legal full-coverage multiplier, with exact feasibility evidence

An affine row L of EXISTING coverage wires may be squared and multiplied
by an ORIGINAL quadratic clip generator: total degree4, globally legal.
No semantic output-box inequality is used. For the concrete row

    L=C0(R1)=sum_k(H_k-S_k),
    g=(tau_(16,den6)-(A6-A1)/6)*(1-tau_(16,den6)),

the legal term is `L^2*g`. C0 is affine; replacing it by the quadratic
weighted moment D and squaring would cost6 and is excluded.

On the frozen false degree2 diagnostic, Z=4/5 with weight3/5 and Z=-6/5
with weight2/5, Aj=(j-6)Z. Clips are0 except pair16 denominators5 and4,
which equal4/5 at the positive atom; sorting/union wires are genuine for
those assigned bands. L takes values4/5,0 and g takes values-2/3,1. Hence

    E[L^2*g]=(3/5)*(16/25)*(-2/3)=-32/125.

This escapes that degree2 separator. It is a hand evaluation of an existing
diagnostic, not a physical counterexample, new search or certificate of P.
The predecessor already had a within-pair degree4 term defeating the same
diagnostic; the added fact here is that a FULL-UNION affine row is legal too,
not a newly established separation of the entire degree4 class.

At the sharp placement A*=(-106,-81,-70,-36,-25,0)/31, R1's bands form the
connected union[12/31,25/31], so L=13/31. The raw crossing53/93 is interior,
so g=0. This row is therefore sharp-zero without being identically zero.
That necessary contact check is not coefficient feasibility for the target.

## 4. Retaining lower routing context makes the transfer cheaper

For an existing paired comparator, write lower inputs a,b, minimum u, and
upper input wires alpha,beta, with carried upper p paired to u. Define only
abbreviations

    A=a-u, B=b-u, eta=A+B,
    hA=A*(p-beta), hB=B*(p-alpha).

A,B are existing nonnegative linear margins, and hA,hB are existing
conditional-routing equations. Exactly, including off-graph values,

    eta*(1-p)=A*(1-beta)+B*(1-alpha)-hA-hB.            (5)

For an existing max gate r=max(v,p), put W=r-v>=0 and
`hM=(r-v)*(r-p)`. The exact moment identity gives

    eta*(f(r)-f(v))
      =W*A*(1-beta)+W*B*(1-alpha)
        +A*W^2/2+B*W^2/2-W*(hA+hB)-eta*hM.          (6)

When alpha,beta are ORIGINAL clipped inputs (or original bounded flags),
the first terms are products of three existing linear inequalities; the
next are linear margins times a square. Equation multipliers have degree3.
Thus (6) has a genuine DEGREE3 proof and permits ONE further existing
nonnegative linear context factor at degree4. An extra affine-row square
would instead cost5. No bound on the whole previous aggregate v is assumed.

This improves on the earlier upper-discriminant transfer, whose weight
(alpha-beta)^2 vanishes when saturated uppers coincide. On the min graph,
eta=|a-b| depends on the lower routing context, and need not vanish when
alpha=beta. The formula is exact at lower ties as well, but then eta=0:
it proves a weighted statement, not the unweighted increment. No division,
implicit rational multiplier or generic untie assumption is allowed.

All sharp initial lower endpoints are distinct on each retained ray. It
suffices to check R1,R2,R3,R5,R6, the other five being their reflections:

    R1: 25/62,12/31,35/62,81/155,53/93;
    R2: 25/31,11/62,15/31,14/31,81/155;
    R3: 18/31,11/31,17/31,15/31,35/62;
    R5: 81/124,56/93,45/62,11/31,25/62;
    R6: 106/155,81/124,70/93,18/31,25/31.

Sorting permutes these five values, so each comparator has eta>0 at that
sharp graph. This is a non-vacuity check, NOT global unweighting or closure.

## 5. Why this does not yet qualify a whole degree4 run

First, routed upper inputs are not automatically supplied with box generators.
Suppose both inputs of a parent comparator already require their own
degree2 weighted-bound proofs. Clearing the parent independently with BOTH
child weights gives a degree4 bound; inserting the max moment then costs5.
The sorting prefix(0,3),(1,4),(0,2),(1,3) already reaches a comparator with
two carried inputs. Therefore that naive separate-branch expansion is NOT
an admissible <=4 implementation. This counts the displayed proof, not a
lower bound for every possible jointly cancelling certificate.

Second, lower-tie faces cannot be removed. Even on the full graph, set all
Aj=0, all crossing clips0 and all shared adjacent flags1 (permitted at
Delta=0). R2 has the source1 parallel band[0,1] and four bands[0,0]. Every
sorted lower is0, so every eta is0. Choose an admissible tie routing putting
the parallel band last (it can move from slot0 to3, then3 to4); its prefix
max insertion gains f(1)-f(0)=1/2. The matching L1 coverage cancels in Q: its coefficient-2
opposes R2's+2. The other adjacent contributions cancel similarly; Q=0
and G=3. This is not a K6 counterexample. It shows concretely why the
WHOLE-source cancellation, not division of per-gate certificates, matters.

The critic also proves a finite-certificate obstruction for an isolated
unweighted increment with FREE bounded inputs and only two local root
equations. Its precise excluded-generator list is in the critic note.
It does not apply to the complete raw-clipping graph: original strictly
saturated clipping inequalities change that local first-order cone, and
the old aggregate's equations add omitted cancellations. That local result
is NOT used to reject P or the full degree4 class.

No exact nonnegative assembly of (4), qualified sparse coefficient system,
solve cost or exact PSD-recovery procedure was obtained. The previously
unqualified dense allocation is not attempted. The correct decision is
**NO RUN on the present incomplete assembly**, not 'degree4 is impossible'
and not 'a global certificate is now ready'. Simultaneous cancellation
across actual clipping, routing and both ray signs remains the missing
mathematical step. Another collection of individually valid gate formulas
would not by itself satisfy the committed output.

## 6. Kết quả và giới hạn — tiếng Việt

**Chưa khép K6; chưa có chứng minh mới cho cận40/31.** Lượt này đã kiểm
được cách giữ đúng toàn bộ ngữ cảnh phủ, thay vì gắn trọng số cố định cho
từng giao ba. Tổng phần bù đúng là tích phân C(m-1,2); khi nguồn thứ tư
xuất hiện, lựa chọn giao ba phải đổi theo tập nguồn đang hoạt động.

Về đại số, hệ số SOS dùng độ dài hợp phủ của cả năm nguồn trên một cạnh
vẫn hợp lệ trong bậc4. Quan trọng hơn, dùng cả phương trình định tuyến
đầu dưới cho công thức truyền chứng chỉ bậc3, tránh mất trọng số chỉ vì
hai đầu trên cùng bằng1. Đây là công cụ hợp lệ, không phải nghiệm thu K6.

Điểm chưa đạt vẫn chính xác là: chứng minh tổng15 giao đôi trừ phần bù
toàn nguồn luôn <=53/31. Ghép từng nhánh độc lập theo công thức hiện có
lên bậc5; chia bỏ trọng số lại bỏ sót mặt đầu dưới trùng nhau. Vì vậy
không chạy bộ giải dựa trên cách ghép chưa đạt chuẩn này, không tăng bậc,
không thêm hạ tầng và không coi công thức cục bộ là một mốc đóng bài toán.
Toàn bộ lớp chứng chỉ bậc4 có ngữ cảnh vẫn mở, chưa bị bác bỏ.

## 7. Verification and resources

R116-1 global closure OPEN. R116-2 scoped hand challenge performed; no global
certificate exists to accept. R116-3 preserves attempts, scope and EN/VI
outcome. Minimal Vibecode supplied the existing Main/Builder/critic review
only, not new platform gates. Main read Builder and critic notes in full.
Critic FULL Builder review10:57:53UTC accepted its exact scoped identities
and incomplete outcome. Main's later lower-context formulas were checked
literally, not by restarting the critic's stopped independent search.
Final saved Main review and repository diff check are recorded below when
actually completed. No percentages of mathematical completion are inferred.

Mathematical subprocesses/SDP/random or finite search/code/build/UI/API/DB/
Git writes/install/new agents/variables/gates/infrastructure/scratch/deletions:0.
Only reads, hand mathematics and Markdown records. No novelty, general
Kakeya, Lean/formal-kernel or external-human acceptance is claimed.
No automatic successor research or execution is authorized by this report.

Final review record: critic FULL literal Main-report §§1–7 review completed
at observed11:06:14UTC: ACCEPT mathematics and stated scope, no blocking
error. All five sharp lower-endpoint lists were checked independently.
The concrete Aall0 example explicitly chooses allowed parallel-band-last
tie routing, as requested by the literal review. This accepts the exact
formulas and incomplete outcome, NOT a global K6 certificate. Repository
`git diff --check` passed after the report/checkpoint edits at11:07:09UTC.
