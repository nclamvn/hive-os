# K5 — Equality classification and quadratic stability / Dấu bằng và ổn định

11 October 2026. Status: CONDITIONAL_COMPUTER_ASSISTED_RESULT;
external mathematical review and novelty confirmation OPEN.
Owner-approved TIP103, PUBLIC_DISCOVERY_ANALYSIS; exact five-triangle model only.
No new cover, random search, K6, general Kakeya campaign or HIVE UI execution.

## 1. Result in Vietnamese / Kết quả tiếng Việt

Đã phân tích toàn bộ 8.658 trường hợp dừng trong chứng chỉ K5 đã lưu, tái giải
667 hệ đa thức khác nhau bằng số hữu tỉ. Có 68 trường hợp mang giá trị14/61;
tất cả có hạng4. Trong đó64 không thỏa các điều kiện miền hình học;4 trường hợp
khả thi quy về đúng hai cấu hình, khi chuẩn hóa x5=0:

\[
x^-=(79,47,50,12,0)/305,\qquad
x^+=(79,67,29,32,0)/305.
\]

Hai cấu hình này là phản xạ của nhau. Không có hệ dấu bằng suy biến trong toàn
bộ danh mục đã kiểm. Vì vậy, **phụ thuộc vào chứng minh chặn dưới và tính đầy đủ
của TIP101**, mọi nghiệm tối ưu K5 là một trong hai cấu hình trên sau tịnh tiến
chung. Không tồn tại một họ nghiệm tối ưu liên tục sau khi bỏ tịnh tiến.
Cấu hình x^- là hiện vật công khai của Station, không phải phát hiện xây dựng
mới của HIVE. Điểm bổ sung là phân loại hết trường hợp dấu bằng và ổn định.

Đặt tọa độ đỉnh bất biến theo tịnh tiến

\[
A_j=5(x_j-x_1)+j-1,\quad A_1=0,\quad
u=(A_2,A_3,A_4,A_5).
\]

Hai nghiệm trong tọa độ này là

\[
m^-=(29,93,116,165)/61,\qquad
m^+=(49,72,136,165)/61.
\]

Quanh mỗi m, đã giữ tất cả luật pha tiếp giáp, kể cả mặt chuyển pha. Có đúng
hai luật tại mỗi nghiệm. Cả bốn Hessian thỏa H-(1/32)I xác định dương, được
kiểm bằng các định thức chính hữu tỉ, không dùng trị riêng gần đúng. Suy ra

\[
F(u)-14/61\ge \frac1{64}\|u-m\|_2^2
\]

trong các lân cận chuẩn vô cùng bán kính lần lượt1/244 và3/610. Đây là các
bán kính/hệ số bảo thủ, không tuyên bố tối ưu. Tính toán mới kiểm các luật pha
đã lưu; phần chứng minh giải tích và bao phủ miền của TIP101 vẫn là tiền đề.

Ngoài lân cận, tính liên tục, miền compact và phân loại dấu bằng cho một hằng
số dương c sao cho trên toàn không gian tọa độ u,

\[
F(u)-14/61\ge c\min\{\operatorname{dist}_2(u,\{m^-,m^+\})^2,1\}.
\]

**Hằng số c toàn cục mới được chứng minh tồn tại, chưa có giá trị số được
chứng nhận.** Không được bỏ phép chặn min: diện tích không vượt1/2 trong khi
khoảng cách giữa các cấu hình có thể vô hạn. Kết quả không giải Kakeya tổng
quát, chưa là định lý được phản biện bên ngoài hoặc kiểm chứng bằng Lean.

## 2. English result and trust boundary

Assuming the corrected TIP101 analytic reduction and accepted complete
shape/Cartesian stationary certificate, equality in the five translated-triangle
lower bound occurs exactly at the two offsets x^- and x^+ above, modulo common
translation. They form one reflection orbit. There are no unclassified singular
equality loci and no continuous optimal family after fixing the translation gauge.

The fresh rational scan re-eliminates every retained distinct quadratic and
checks equality feasibility. It does NOT regenerate the cover, rederive all cone
energy laws or freshly validate TIP101's whole lower-bound proof. Its completeness
inherits the earlier cover and incident-phase/C1 argument, including corrections
C1/C2 and the strict-versus-closed singular exclusion erratum.

Each equality point has two incident area laws; their exact Hessians exceed
(1/32)I in the apex coordinates u. This proves the explicit local quadratic
bound above, and compactness supplies the capped global bound with an existential
positive constant. The numerical global constant is not certified.

The public Station witness is attributed to Station. Neither a first-publication
claim, an official benchmark score, independent human acceptance, Lean validation,
autonomous authenticated HIVE E2E nor causal HIVE-versus-one-LLM advantage follows.

## 3. Exact equality proof / Chứng minh phân loại

Use the triangles

\[
T_j(x_j)=\operatorname{conv}\{(x_j,0),(x_j+1/5,0),(x_j+j/5,1)\},\quad 1\le j\le5.
\]

Their union area is F(u). The affine map from offsets with x5=0 to u is
invertible; its inverse is x_j=(A_j-A5+5-j)/5, where A1=0.

1. The TIP101 lower bound makes every point with area14/61 a global minimum.
   TIP100's all-offset zero-pair-overlap bound17/74 excludes all such boundary
   and outside configurations, since17/74-14/61=1/4514>0.
2. Every equality point therefore lies in strict K5. The complete saved shape
   cover contains its normalized shape in a closed cell. The corrected incident
   open-phase argument selects an included Cartesian bottom phase a<b even at
   internal walls/ties. C1 regularity forces the FULL gradient of that polynomial
   to vanish, not merely its gradient along the wall.
3. Solve every retained stationary system with exact rational elimination.
   There are8658 records and667 distinct polynomials;130 inconsistent records
   cannot supply a stationary point. Compare the recomputed stationary values,
   ranks and complete nullspaces to the saved data, rather than trust status labels.
4. Exactly68 records have stationary value14/61. All have rank4, so there is
   no affine equality family to truncate or sample. Closed shape/bottom inequalities
   and all strict K5 inequalities reject64. The remaining four records are:

| Shape cell | Bottom labels | Stationary apex vector | Offsets |
|---|---|---|---|
|1245,1246|(1,5)|(29,93,116,165)/61|x^-|
|1903,1910|(1,5)|(49,72,136,165)/61|x^+|

5. Both unchanged TIP098 area algorithms independently give14/61 at both
   resulting offsets. Thus both candidates actually attain the bound, and the
   preceding necessary-condition inventory excludes every other equality point.

This is a dependent computer-assisted theorem argument, not a sample-based
inference. Reflection in the x5=0 gauge is

\[
R(z_1,z_2,z_3,z_4)=(z_1,z_1-z_4,z_1-z_3,z_1-z_2).
\]

It is an area-preserving involution, but NOT a Euclidean isometry on these four
parameters. Direct Hessian checks at BOTH apex vectors avoid a false transfer
of Euclidean constants through reflection.

## 4. Local stability proof / Chứng minh ổn định địa phương

For any affine phase wall g(u)=b dot u+d,
|g(u+q)-g(u)|<=||b||_1||q||_infinity. Include all42 homogeneous shape walls,
the simplex boundaries, strict K5 boundaries, and all bottom-order comparisons.
Half the minimum nonzero wall margin at each minimizer preserves every nonzero
sign; zero walls remain allowed. The resulting radii are1/244 and3/610.

Within these balls, every admissible shape/phase has closure incident to the
minimizer: the fixed nonzero signs prevent entry into a nonincident shape, and
all bottom comparisons preserve the extremal labels. The COMPLETE retained
inventory is inspected for incidence, including its130 inconsistent cases.
Only the two recorded polynomials at each point survive. No wall face is dropped.

For an incident quadratic p, p(m)=14/61 and grad p(m)=0. Hence EXACTLY

\[
p(m+q)-14/61=\tfrac12 q^THq.
\]

Sylvester's criterion applied to H-(1/32)I gives the following exact shifted
leading minors; every entry is positive:

| Cell | First | Second | Third | Fourth |
|---|---|---|---|---|
|1245|59/160|11387/76800|32527/819200|819307/1966080000|
|1246|49/480|9457/230400|80911/7372800|219859/1966080000|
|1903|83/160|9107/76800|32527/819200|615187/1966080000|
|1910|241/480|25777/230400|80911/7372800|186857/5898240000|

Thus each law gives area gap >=||q||_2^2/64. Continuity supplies the same bound
on their shared face. The fresh evidence includes all four matrices, their
unshifted minors, complete equality constraints and the radius computation.

For a familiar offset-coordinate version, let z=(x1,x2,x3,x4), x5=0, and z* be
either minimizer. If u-u*=h, then

\[
z-z^*=(-h_4,h_1-h_4,h_2-h_4,h_3-h_4)/5.
\]

Therefore ||z-z*||_2^2<=7||h||_2^2/25. Also ||h||_infinity<=10||z-z*||_infinity.
Consequently, for ||z-z*||_infinity<=1/2440,

\[
\text{area}(z)-14/61\ge (25/448)\|z-z^*\|_2^2.
\]

This conservative translation does not assume reflection preserves distance.

## 5. Global stability proof / Chứng minh ổn định toàn cục

Let M={m^-,m^+}, r=1/244 and

\[
P=\{u:0\le A_j-A_i\le j-i+1\text{ for all }i<j,\ A_1=0\}.
\]

P is compact: 0<=A_j<=j for j=2,...,5. The zero-overlap-pair theorem gives
F(u)-14/61>=1/4514 outside P and on its boundary. In P, set

\[
K=\{u\in P:\operatorname{dist}_2(u,M)\ge r\},\qquad
\eta=\min_{u\in K}(F(u)-14/61).
\]

K is compact and nonempty (for example u=0 is away from both points). The
complete equality classification and continuity imply eta>0, without computing
eta. In the r-balls use Section4; on K use eta; outside P use1/4514. Thus

\[
F(u)-14/61\ge c\min\{\operatorname{dist}_2(u,M)^2,1\},\quad
c=\min\{1/64,\eta,1/4514\}>0.
\]

This also proves that any sequence with area approaching14/61 approaches one
of the two minimizers, modulo translation and reflection. In the local balls,
area excess epsilon implies Euclidean apex distance at most8sqrt(epsilon).
No explicit global epsilon threshold for entry into those balls is certified.

The quadratic exponent is the local nondegenerate order: along a nonzero ray
inside an incident phase the exact gap is a positive constant times t^2, so a
fixed positive lower bound with power p<2 would fail as t tends to0. This is
not a sharpness claim for the chosen constants/radii.

## 6. Mechanism and transferable insight / Cơ chế có thể tái sử dụng

The old TIP098 two-phase formula can be written compactly at the Station witness,
with q=z-z^-, ell(q)=3q1-4q2+q4 and its exact matrix H_-:

\[
\text{area}(z)-14/61=\tfrac12q^TH_-q+\tfrac5{24}\max\{\ell(q),0\}^2
\]

for ||q||_infinity<3/1525. This restates, not rediscovers, the old local theorem.

General explanation: if two quadratic laws form a C1 function across a wall
ell(q)=v dot q, their difference has value and gradient zero on an open wall
patch. A quadratic with that property equals alpha*ell(q)^2. Hence their Hessian
jump is2alpha*vv^T, rank one. When the baseline Hessian is positive definite
and alpha>=0, the one-sided squared term adds rigidity. If alpha<0, positivity
on BOTH sides must be checked; the rank-one property alone is insufficient.
This elementary lemma is not claimed new. It explains the local geometry and
suggests looking for a small collection of rigidity certificates before using
an exhaustive search in another n. No K6 or general-n theorem follows here.

## 7. Literature and value / Tài liệu và giá trị

Primary sources checked11October2026:

- [Station verification notebook](https://dualverse.ai/station/math/discretized-kakeya-needle/):
  exact same model, public14/61 witness, reflection-fixed7/30 optimum, unrestricted
  K5 value still described as open. No full K5 equality/stability theorem identified
  in this notebook; its single-focus uniqueness result is a different restricted family.
- [Station preprint v2](https://arxiv.org/html/2608.23691v2#S6.SS4):
  same finite construction/problem scope, not an external review of HIVE.

Bounded public queries included Kakeya+14/61+stability/minimizers/unique,
five-triangles+Kakeya+equality, discretized-Kakeya+stability, and translated-
triangles+Kakeya+minimizers. No independent earlier resolution of this exact
classification was located. This is not exhaustive MathSciNet/zbMATH, full
historical-paper or author-correspondence verification; novelty stays OPEN.
Search results concerning other Kakeya models were not treated as this model's
proof. Secondary AI summaries were not proof authorities.

Tiến triển mới là từ một giá trị tối ưu có chứng chỉ sang **phân loại nghiệm
và tính cứng định lượng**. Tuy nhiên đây vẫn là mô hình hữu hạn nhỏ, kết quả
phụ thuộc chứng minh trước và chưa được phản biện ngoài nhóm. Nó cho thấy một
luồng LLM hỗ trợ + đại số chính xác có thể tạo hồ sơ nghiên cứu có nội dung;
chưa chứng minh HIVE vượt một LLM mạnh với cùng tài nguyên.

## 8. Execution, verification and stop / Thực thi, kiểm tra và điểm dừng

R1 bounded literature assessment DONE with novelty unresolved.
R2 complete retained equality classification DONE, conditional on predecessor.
R3 explicit local / existential capped-global proof DONE at stated scope;
numerical global eta/c, external review and formalization NOT DONE.
R4 bilingual proof and scoped evidence DONE. No product integration claimed.

Three full scans: Builder preliminary5.057628459s; Builder final5.034239s
(see Builder report for precise timing); Main fresh final-source replay5.160430334s.
The preliminary scan omitted130 inconsistent cases from the local incident
inventory, though they were counted in equality classification. Final source
includes them; all remain nonincident. Preliminary output is retained, not erased.
Main and final outputs agree in all mathematical content (timing excluded).
Two six-test engineering runs:6/6 PASS each, not12 distinct tests. Five Python
invocations conservatively counted against6, total compute below17s/300s.
No fresh full101 acceptance/cover/energy derivation. Small unit imports exercise
actual source syntax; no appbuild/type/lint/dependency install was needed.

One implementation Builder plus one targeted supplementary AI proof critic for
the local-star/global-stability/reflection gap. Critic performed no numerical
replay and is not an external human referee. Vibecode reduced to TIP+report;
no RRI/blueprint stack or new gate was added.

Minimal new evidence under artifacts/research/tip103:
equality_analysis.py, test_equality_analysis.py, EQUALITY_ANALYSIS_FINAL.json,
MAIN_EQUALITY_REPLAY.json, STABILITY_REVIEW.md and BUILDER_COMPLETION.md.
EQUALITY_ANALYSIS.json is the preserved preliminary result, not final authority.
Create-only replay command, ordinary Python stdlib, current checkout:

```sh
python3 -B artifacts/research/tip103/equality_analysis.py --out artifacts/research/tip103/REVIEW_EQUALITY.json
python3 -B -m unittest discover -s artifacts/research/tip103 -p 'test_equality_analysis.py' -v
```

These are reproduction instructions, not an automatically authorized future run.
Original TIP101 cover/stationary and Main/corrected review hashes were rechecked
unchanged. Final analysis source SHA256
f9e31171f6e265ffd9fd4fd6184e8b6b719cfd80297e848874141597cff3f5a7.
No old evidence, DB/auth/runtime/source grants were edited. No paidAPI/Git/UI/
build/install/Docker/scratch project or native binary. Nothing material deleted.

STOP: mathematical deliverable complete at its dependent, unrefereed scope.
Best next routing is external review of the combined K5 lower-bound/equality/
stability proof, or an explicitly approved presentation of this result. No
automatic K6/campaign/resource increase or stronger public claim is authorized.

Terminal checkpoint2026-10-11 00:39UTC, about6min of the30min window. Raw JSON
comparison (excluding only elapsed_seconds) confirmed Main/final identity;
git diff --check PASS. New artifact directory128KiB plus these small documents.
External review and novelty remain OPEN; no authenticated product execution.
