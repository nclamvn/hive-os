# K6 — whole gap/overlap payment: concrete assembly rejected

**PARTIAL; K6 OPEN.** No nonnegative degree<=4 identity for the complete
target was obtained. A specific global, sharp-calibrated geometric assembly
was rejected exactly before computation. This is NOT a rejection of K6 or
of the full source-aware degree-four class. No new area floor is claimed.

Scope: NONNEGATIVE_REMAINDER_SCOPE_20261013.md; same TIP116 R116-1/2/3,
PUBLIC_DISCOVERY. Activation2026-10-13 11:26:54UTC/cap11:56:54UTC.
Main NEW DERIVATION STOP observed11:31:49UTC, after the concrete assembly
failed and both Builder and critic checked the failure. This uses the
declared early-stop condition, not the whole time allowance. No subsequent
strategy or solver run is activated. Earlier records remain unchanged.
Builder new derivation STOP11:32:01UTC; critic STOP11:31:22UTC.

## 1. Target and the candidate actually tested

Keep the full490-wire graph, original clipping/routing/union equations,
all contacts and the area-preserving compactification D. The unchanged target is

    P=53/31-Q=G-40/31=53/31-sum15J+R >=0,
    R=integral_(m>=1) C(m-1,2).

For a ray's five source intervals `[l_j,h_j]`, let D_ray be their weighted
union measure with density `1-t` on [0,1], and `f(t)=t-t^2/2`.
For any nonempty source group S its hull measure

    H(S)=f(max_(j in S) h_j)-f(min_(j in S) l_j)

is an upper bound for that group's union. An individual source band has
measure `f(h_j)-f(l_j)`, a lower bound for the whole union. These are
global geometric comparisons, including degenerate intervals and ties.
The group extrema are analytic abbreviations, NOT added graph variables
or newly admitted polynomial generators; no degree-four translation is assumed.

Test the following upper bound Qhat for Q:

- On positive rays R1,R3,L4,L6, replace D_ray by its full five-band hull.
- On R2, use the SUM of the individual source1 band, the individual source3
  band, and the hull of source4,5,6. On L5 use its reflected grouping.
- On negative rays R5,R6 retain the source4 band only; on L1,L2 retain
  the source3 band only.

Use the original coefficients: R1,L6:+3; R2,L5:+2; R3,L4:+1;
R5,L2:-1; R6,L1:-2. Every replacement has the correct sign, hence
`Q<=Qhat` and `G>=3-Qhat` for all real placements. The sought sufficient
payment would be `Qhat<=53/31`. A further exact degree-four translation
would still be required even if that geometric inequality held.

This was not another moment-conservation attempt: it tried to majorize
the whole signed objective with a quantitative sharp candidate.

## 2. Sharp contact is satisfied, but is insufficient

At the retained construction `A*=(-106,-81,-70,-36,-25,0)/31`,

    R1: union=[12/31,25/31],
    R3: union=[11/31,1],
    R2: union=[11/62,11/31] U [14/31,45/62] U [25/31,1].

For R2 these are respectively source3, the union of source4/5/6, and
source1. Thus the selected group hulls lose no measure at A*. Negative
R5 is covered by its source4 band `[11/31,1]`, and R6 by its source4 band
`[18/31,1]`. Reflection supplies the other five rays. All candidate
replacements are exact here, so `Qhat(A*)=Q(A*)=53/31`.

This checks equality at the proposed minimizer, not the global inequality.

## 3. Exact whole-family failure

Use actual placements `A_j=(j-6)c`, with `1/2<=c<=1`.
For a pair of separation d, its first band is `[dc/(d+1),c]`;
its second is `[c,min(dc/(d-1),1)]` when d>1, and `[c,1]` when d=1.
These follow from the original clips; no false graph lift or sample is used.

Write the following measure abbreviations:

    a=f(c)-f(c/2), b=f(1)-f(c/2),
    d=f(1)-f(c), e=f(c)-f(2c/3), so b=a+d.

The actual extreme rays R1,L6 have measure a. R2,R3,R5,L2,L4,L5 have
measure b; R6,L1 have measure d. Consequently

    Q=6a+6b-2b-4d=10a=5c-15c^2/4.

For the tested candidate, each positive R2/L5 grouping has measure b+e:
the source1 and source3 bands give d+a=b, while the group hull contributes
e again. Each selected negative band has measure d. Therefore

    Qhat=6a+6b+4e-6d=12a+4e
        =16f(c)-12f(c/2)-4f(2c/3)
        =22c/3-101c^2/18.

At the exact rational placement c=2/3,

    a=1/6, e=8/81,
    Q=5/3, G=4/3 >40/31,
    Qhat=194/81 >53/31,
    3-Qhat=49/81 <40/31.

The projection intervals under the previously used shear have total hull
`[-10/3,0]` at this placement, so it is also inside compact D. Restricting
to that existing compactification does not remove the failure.

The exact excess is

    Qhat-Q=2a+4e=59/81.

Its first term comes from omitted coverage on negative rays R5/L2. Its
second comes from DOUBLE COUNTING positive-ray group overlap. Retaining
ALL actual negative-ray unions repairs only the first term: the resulting
upper bound is still `Q+4e=167/81>53/31` at c=2/3. Thus fixing only the
negative-ray selection does not rescue the assembly. A correct certificate
must retain and control the cross-group intersections too.

This is a decisive rejection of the named sharp-calibrated majorant,
NOT a counterexample to the required area bound: the actual area is4/3.
It is not a no-go theorem for other contextual identities on the full graph.

## 4. Decision and Vietnamese outcome

**NO RUN for this assembly.** Exact failure of its necessary geometric
bound precedes any question of coefficient solving, PSD recovery or graph
degree. More solver time cannot make the displayed false inequality true.
No alternative complete degree-four certificate was found in this attempt.
Feasibility of the full degree-four class remains unresolved.

**Chưa khép K6; chưa có cận dưới mới.** Lượt này đã thử một chặn cho toàn
bộ mục tiêu, có dấu bằng đúng tại cấu hình40/31, thay vì bổ sung công thức
bảo toàn mômen. Tuy nhiên chặn đó không đạt cận mục tiêu trên họ cấu hình
cách đều: tại c=2/3,
diện tích thật là4/3, nhưng chặn chỉ cho49/81. Ngay cả khi khôi phục toàn
bộ phần phủ ở cạnh mang dấu âm, phần giao giữa các cụm cạnh dương vẫn bị
đếm thừa, nên cách ghép này không thể chứng minh mục tiêu.

Giá trị của phép kiểm là loại chính xác một ứng viên trước khi tốn chi phí
chạy, không phải tiến triển định lượng về cận K6 hay chứng minh bất khả thi
của mọi chứng chỉ bậc4. Không tăng bậc, không thêm hạ tầng và không tự mở
lượt nghiên cứu khác. Nghĩa vụ còn nguyên: chứng chỉ không âm cho toàn P,
giữ tương tác khe hở–phủ chồng trên mọi cấu hình và biên.

## 5. Scoped verification

Builder and critic independently checked the literal candidate, its global
comparison direction, sharp contact, family formulas and rational rejection.
Critic's initial full calculation review was observed11:31:22UTC. Final
saved Main-text review is recorded separately after an actual full read.
Minimal Vibecode/TIP116 reused these existing reviewers; no extra agents
or product gates. R116-1 remains OPEN; R116-2 scoped hand challenge and
R116-3 EN/VI records are supplied, not a percentage of mathematical closure.

Only ordinary reads, hand algebra and Markdown. Mathematical subprocesses,
solver/sampling/enumeration/product code/build/UI/API/DB/Git writes/install/
new agents/variables/gates/infra/scratch/deletions:0. No formal or external
human verification, novelty, general Kakeya claim or automatic next action.

Critic FULL saved Main §§1--5 review observed11:33:23UTC: mathematical
formulas and scope accepted. Vietnamese wording was clarified: the valid
comparison Q<=Qhat is not false; the required additional bound Qhat<=53/31
fails. This review accepts the exact rejection, NOT a K6 certificate.
Main subsequently read both saved Builder and critic notes in full.
Repository `git diff --check` passed after both checkpoint appends at
observed11:34:19UTC; this checks documentation whitespace, not mathematics.
