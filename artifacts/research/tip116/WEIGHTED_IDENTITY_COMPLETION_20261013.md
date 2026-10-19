# K6 ten-ray weighted coverage: exact couplings, no global certificate

**TARGET NOT CLOSED — K6 OPEN.** No degree-at-most-four identity proving
`Q<=53/31`, hence no proof of the all-real sharp bound `G>=40/31`, was found
in this bounded hand attempt. No new geometric area floor is established.
The full degree-four certificate class for the NEW objective is still
unresolved, not disproved. Local identities below are tools, not milestones
substituting for the committed sharp inequality.

Owner approved searching for the weighted-coverage identity on the new
representation, degree<=4, feasibility first, no infrastructure. Same TIP116
PUBLIC_DISCOVERY and predecessor `GEOMETRIC_REDUCTION_COMPLETION_20261013.md`.
Activation 2026-10-13 01:24:46 UTC; ceiling 01:54:46 UTC. Main new derivation
STOP 01:35:01 UTC: hand assembly exhausted early, not a timeout or solver
failure. Subsequent work is literal review and recording only.

## 1. Exact target and admissible model

For six triangles with slices

    I_j(t)=[A_j-j*t,A_j-(j-1)*t], 0<=t<=1, A6=0,

the predecessor established globally, including ties and boundaries,

    G=3-Q,
    Q=3D_R1+2D_R2+D_R3+D_L4+2D_L5+3D_L6
      -2D_L1-D_L2-D_R5-2D_R6,
    D_ray=integral_0^1 (1-t)*coverage_indicator_ray(t) dt.

The remaining obligation is precisely `Q<=53/31` on the exact 490-variable
clip/flag/sort/max graph. Its compact domain D is available by the proven
area-preserving projection-packing reduction, not by assuming every original
placement already has bounded apex coordinates. No apex order is assumed.
The sharp placement remains `(-106,-81,-70,-36,-25,0)/31`.

All certificate factors below are existing inequalities. For a crossing
variable a=clip(x/m), write

    g_a+ = (x/m-a)*a >=0,
    g_a- = (a-x/m)*(1-a) >=0,
    a>=0, 1-a>=0.

No derived inequality is silently promoted to a new generator. Bounds such
as 1-H for a max-output wire, while true on geometry, are not automatically
members of the frozen generator list either. Any use would need its own
expansion within the same total-degree limit.

## 2. Exact own-pair identity: degree-three proof

Let m>n>0 and use existing clips a=clip(x/m), b=clip(x/n). Then

    (b-a)*(m*a-n*b)
      = m*((1-b)*g_a+ + b*g_a-)
        + n*((1-a)*g_b+ + a*g_b-).

Expansion cancels x and gives the displayed left side exactly. Every term
on the right is an existing quadratic generator times a nonnegative linear
clip bound. Thus it is a legal degree-three preordering proof. It implies
`0<=a<=b<=m*a/n`, including endpoints: b<a makes the product strictly
negative, while b>a requires m*a>=n*b; the equality case is immediate.

On the predecessor's degree-two dual, pair16 denominators m=6,n=5 have
a=0,b=4/5 at the positive atom of weight3/5. The left side is -16/5 there
and zero at the other atom, giving expectation -48/25. Therefore this
legal degree-three interaction already escapes that particular separator.
Escaping it does not prove the sharp bound or degree-four feasibility.

Degree accounting matters: the left side is quadratic, but THIS displayed
proof costs degree3. An affine SOS-row square multiplying its expansion
would cost degree5. A constant weight, or one further existing nonnegative
linear factor, stays within degree4. This does not exclude some different
proof of the same product at lower degree; none is supplied here.

## 3. Exact three-apex identities: degree-four proofs

For i<j<k set x=Aj-Ai, y=Ak-Aj, z=Ak-Ai=x+y. Select existing clips
a=clip(x/m), b=clip(y/n), t=clip(z/(m+n)), m,n>0. Central denominators
m=j-i,n=k-j always provide one such choice. Both identities hold:

    a*b*(1-t)*((m+n)*t-m*a-n*b)
      = m*b*(1-t)*g_a+
        + n*a*(1-t)*g_b+
        + (m+n)*a*b*g_t-,

    t*(1-a)*(1-b)*(m*a+n*b-(m+n)*t)
      = m*t*(1-b)*g_a-
        + n*t*(1-a)*g_b-
        + (m+n)*(1-a)*(1-b)*g_t+.

For the first expansion the uncancelled linear part is x+y-z; for the
second it is z-x-y. Both vanish identically. Each RHS term is an existing
quadratic generator times two existing nonnegative linear bounds. Total
degree4; no new variable, division or boundary exclusion.

When all three clips are interior, opposite signs force weighted additivity.
At saturation one of the products can be positive; it must not be treated
as an equation or assumed zero at every sharp contact. The identities keep
actual cross-pair geometric dependence that separate pair ordering loses.
For example a=b=delta,t=delta/2,m=n=1 gives forward value
`-delta^3*(1-delta/2)`, equal to `-864/2401` at delta=6/7. This is a
diagnostic fake assignment, NOT a true placement or an area counterexample.

Only constant nonnegative weights on these displayed proofs preserve the
degree4 cap. Further multiplier factors would raise their expanded proof
degree. Their existence alone supplies no coefficient identity for Q.

## 4. Why an exact assembly of separate pair functions cannot work

The critic supplied a whole-domain obstruction to a specifically RESTRICTED
class: an exact target identity whose non-equation summands, evaluated on
genuine geometry, each depend on at most two apex coordinates. Equation
multiples vanish there, regardless of their support. Such an identity would
express G-40/31 as a finite sum of two-coordinate functions on D.

Vary three coordinates between these two states:

    A1: low0, high-4;
    A2: low3, high-7/2;
    A3: low6, high-3;
    fixed A4=1,A5=2,A6=0.

The whole coordinate box lies in D: its sheared projection hull is contained
in [-4,7], of width11<12. Let O be the fixed union of triangles4,5,6.
The third mixed finite difference (high minus low in each variable) of the
union indicator equals

    (1-indicator_O) * product_i=1..3(indicator_HIGH_i-indicator_LOW_i).

Every high triangle lies at x<=-3. The low triangles have slices [-t,0],
[3-2t,3-t], [6-3t,6-2t]; no low point meets a high triangle, and the low
triple intersection is empty. Thus integration of this difference gives
the area of the high triple intersection outside O. In particular the
rectangle

    49/100<=t<=51/100, -22/5<=x<=-41/10

lies in all three high triangles and outside O. Its area is3/500, so the
third mixed difference of G is strictly positive. Every two-coordinate
function misses at least one varying coordinate, so its third difference
is zero. This contradiction rejects the stated exact separable class.

This is an analytic indicator identity and positive rectangle, not a claim
inferred from numerical evaluation of eight samples. Main independently
checked the rectangle and projection containment. It does NOT exclude:

- pairwise lower bounds with a genuinely coupled nonnegative remainder;
- source-aware coverage wires whose evaluated values involve many apexes;
- cross-pair products, global SOS rows, or arbitrary full degree4 certificates.

A small syntactic gate block is not necessarily a pair-separable function.
No broad sparse-SOS impossibility follows from this restricted rejection.

## 5. Full assembly attempt and feasibility decision

The pair and triple certificates above have no coverage-wire variables in
their displayed expansions. Q has quadratic coverage-wire terms. Therefore
these identities ALONE cannot give the required polynomial identity. A full
assembly needs source-aware gate/equation multiples or additional coupled
SOS/product terms that account for those wire coefficients and overlaps.
Gate equations themselves may perform cancellations; it is not proved that
a particular kind of SOS remainder is mandatory.

No complete coefficient assembly with a nonnegative remainder was found.
The triple proofs already exhaust degree4, so multiplying them by routing
factors is not a permitted shortcut. Pair proofs leave only one linear
factor in their displayed expansions. These observations explain why the
local formulas have not become the ten-ray bound; they do not constitute
a theorem that the full admissible class is infeasible.

NO GO for a solver allocation: there is no qualified coupled support,
complete coefficient system, exact PSD recovery plan or bounded solve cost.
The predecessor's dense Gram would have order120786 and require about
116.7GB for its raw dense double array alone. It was not allocated. A small
local Gram is not evidence that the missing global assembly is tractable.

The old positional-objective degree4 impossibility remains frozen to its
old representation. It is NOT used to reject the new velocity objective.
Likewise the new degree2 dual is NOT a degree4 impossibility proof.

## 6. Outcome in Vietnamese

**Chưa khép K6; chưa chứng minh được cận toàn cục 40/31.** Lượt này tìm
được đồng nhất thức ghép hai clip và hai đồng nhất thức ghép ba tam giác,
đều có khai triển chính xác trong giới hạn bậc4. Chúng giữ quan hệ giữa
các hiệu tọa độ, không chỉ kiểm riêng từng cặp.

Đồng thời, một lập luận sai phân hỗn hợp chứng minh rằng không thể viết
đúng toàn bộ diện tích thành tổng các hàm chỉ phụ thuộc từng cặp tọa độ.
Điều này loại một cách ghép quá yếu, không bác bỏ mọi chứng chỉ bậc4.

Phần quyết định còn thiếu là ghép các tương tác đó với mạng phủ của cả sáu
tam giác để cho đúng bất đẳng thức mười cạnh Q<=53/31. Chưa có đồng nhất
thức tổng hoặc phần dư không âm. Vì thế chưa đủ căn cứ chạy bộ giải SOS;
không tăng bậc, không thêm hạ tầng, không coi điều kiện cục bộ là hoàn tất.

## 7. Review and resource record

Minimal Vibecode was used only for the existing Main/Builder/critic review
and scoped outcome record. Builder independently accepted the pair/triple
expansions and reported no full assembly; new derivation STOP01:33:20 UTC.
Its transport subsequently failed, but its saved report
`BUILDER_WEIGHTED_IDENTITY_20261013.md` exists and Main has read it fully.
No Builder acceptance of this final Main report is claimed. Critic stopped
new derivation at01:35:16 UTC and read the full Builder note at that time.
Critic FULL literal review of this Main report, sections1–7, completed at
observed01:36:17 UTC: ACCEPT with no blocking correction. This acceptance
covers the local algebra, restricted obstruction and honest incomplete
outcome, NOT a global K6 certificate. Its saved record is
`CRITIC_WEIGHTED_IDENTITY_20261013.md`. Repository `git diff --check` passed.

Mathematical subprocesses, SDP/numerical search, product-code changes,
builds, UI/DB/API operations, dependency installs, Git writes, new agents,
new variables/gates/infrastructure, scratch directories and deletions:0.
Only read operations, hand mathematics and these scoped Markdown records.
No external-human, formal Lean, novelty or general Kakeya acceptance claim.
