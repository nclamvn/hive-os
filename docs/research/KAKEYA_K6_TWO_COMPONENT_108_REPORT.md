# K6 two-component defect / Khuyết biến phân hai thành phần — TIP108

**PARTIAL_PROOF_STRATEGY_OBSTRUCTION — whole TIP108 and global K6 OPEN.**
Mode PUBLIC_DISCOVERY, finite needle model C_T(6), not the general Kakeya
conjecture. One universal subgroup theorem is proved; the entire committed
two-component inequality and alternative countercertificate are not obtained.

**ĐẠT CHỨNG MINH MỘT NHÓM TRƯỜNG HỢP — mục tiêu TIP108 và K6 toàn cục còn MỞ.**
Đây là mô hình hữu hạn sáu tam giác, không phải giải Giả thuyết Kakeya tổng
quát. Không đổi mục tiêu thành nghiệm thu bổ đề phụ.

## 1. Established result / Kết quả đã chứng minh

Put p_j=6x_j. At original height y, the scaled slice is
`[p_j+j*y,p_j+1+(j-1)*y]`, width `1-y`. Write G=6F. For two closed bottom
components with a strictly positive gap, S is their summed offset ranges,
and D=2G-(2+S). The charter assumes S<=18/31; stationarity is not assumed.

For ANY proper group of k<=5 distinct integer labels, arbitrary offsets
of range s<=18/31, ties and nonmonotone offsets included, the new theorem is

\[
G_{\mathrm{group}}\ge\frac{k+1}{4}-\frac{s}{2}.
\]

A singleton component contributes at least 1/10 exclusive scaled area outside
the other five triangles. ALL 1+5 and 5+1 configurations therefore satisfy

\[
G\ge\frac85-\frac S2,\quad D\ge\frac65-2S\ge\frac6{155}>0,
\qquad F\ge\frac{203}{930}=\frac{20}{93}+\frac1{310}.
\]

This excludes eight of the retained 42 necessary oriented signatures: left
singleton 3,4,5,6 and right singleton 1,2,3,4. No equal-step, symmetry,
global natural-apex-order, graph-connectivity or stationarity assumption is
required. Necessary-signature counts are NOT a complete geometry cover.

Chứng minh mới áp dụng cho mọi nhóm con tối đa năm nhãn, không chỉ bước đều
hay đối xứng. Tam giác đơn luôn có phần diện tích riêng ít nhất 1/10 trong
hệ chuẩn hoá. Vì vậy toàn bộ kiểu 1+5/5+1 trong miền cam kết có diện tích
thật ít nhất `20/93+1/310`: chúng không thể đạt hoặc thấp hơn ứng viên 20/93.
Đây là loại trừ trên miền liên tục, không phải bằng chứng từ một tập mẫu.

## 2. Proof mechanism / Cơ chế chứng minh

Full proof: `artifacts/research/tip108/PROOF_ATTEMPT_LEDGER.md`.
Main verification: `artifacts/research/tip108/MAIN_ANALYTIC_REVIEW.md`.

1. Offset range s<1 prevents reversed disjointness. Each uncovered point in
   a horizontal slice hull corresponds to an adjacent group label cut.
   Overestimating missing area by these gap wedges gives the valid lower
   functional `H=k/2+B-sum(1-delta_i)^2/[2(r_i+1)]<=G_group`.
2. For consecutive labels, the general-endpoint four-edge path inequality
   `E<=4(B_L+B_R)+2(1+v_n-v_0)` proves the linear bound. Peak, valley,
   increasing and decreasing interior orders cover all cases; shorter paths
   follow by appending endpoint duplicates.
3. Inserting integer label gaps increases the direct wedge term enough to
   compensate the decrease of envelope excess B. This preserves the LOWER
   FUNCTIONAL, not necessarily actual union area. Ties and hull switches
   do not omit boundary cases.
4. The singleton's uncovered outer slice has width at least `1-5y` for
   `0<=y<=1/5`; its integral is 1/10.

"Slice hull" is a one-dimensional interval at a fixed height, not the planar
convex hull of all triangles. Convex hulls of `(label,offset)` points integrate
endpoint envelopes only. k<=5 is essential: a six-point zigzag violates the
path inequality. No k=6 extension is used. The new theorem does not depend
on the retained computer-assisted global K5 theorem.

Chuỗi chứng minh: chặn mọi khe bằng nêm của nhãn kề nhau; chứng minh năng
lượng đường cho mọi đầu mút; kiểm soát phép giãn khoảng nhãn bằng mức tăng
của chặn dưới; tích phân phần riêng của tam giác đơn. Không dùng tiền đề
diện tích hợp là hàm lồi hoặc lấy tiếp tuyến địa phương làm chặn toàn cục.
Giới hạn tối đa năm nhãn là thực chất, không được kéo sang một nhóm sáu nhãn.

## 3. Attempts and verification / Hướng thử và kiểm chứng

The stronger equal-step quadratic group-minimum guess was refuted exactly:
five-label p=(5,3,3,1,0)/20 has scaled area1109/800, below guessed355/256 by
3/6400. The new linear proof does not reuse that false premise.

Four complete moment relaxations for L456/R123 return exactly70/61, below
40/31 by270/1891: coarse nonnegative-a; five-band nonnegative-a; coarse
signed-a; coarse signed-a plus newly proved group-union mass53/31. Matching
upper multipliers prove insufficiency of these explicit information classes,
not geometric realizability or impossibility of a coupled proof. No42-LP
expansion followed. The five-band result does not rule out signed-band methods.

Main freshly replayed all four saved certificates WITHOUT simplex, rebuilding
all atoms and all30complete band-cap certificates: PASS. One near-touch
control has S18/31,gap1/310,connected graph,endpoint degrees5; both retained
independently authored area methods give F814013/3459600,D70013/288300>0.
That point is neither a domain proof nor a countercertificate.

A gap-specific AI critic independently hand-checked the geometry, discrete
lemma, gap insertion and entire singleton exclusion. No external human
referee, Lean verification, novelty confirmation or controlled A/B advantage
was obtained. Successful arithmetic replay cannot replace the missing proof.

Đã bác bỏ chặn bậc hai sai, không tái dùng nó. Các chứng chỉ phát lại thành
công nhưng mô hình moment vẫn không đủ: nó mất sự ghép của cùng một q và
cùng các độ lệch qua mọi độ cao. Phản biện AI đã kiểm riêng chứng minh mới;
chưa có phản biện chuyên gia ngoài hệ thống, Lean, xác nhận tính mới hay A/B.

## 4. Remaining obligation / Nghĩa vụ còn thiếu

R1 remains OPEN on34necessary signatures:10size2,14size3,10size4, namely the
2+4/4+2/3+3 continuous domains including arbitrary offsets and boundaries.
A branch-independent common-q, offset-coupled cross-group inequality is missing.
The candidate supports `G>=107/72-7S/24` for3+3 and `G>=123/80-2S/5` for2+4
are ONLY tangent-derived leads, not proved universal bounds or statements
covering every label signature. An admissible branch changes exposed labels.

The final valid functional caps cross overlap by slice-hull intersection below
y=1/2 and the sum of actual pair intersections above it. It retains q and all
relative offsets and is sharp at the zero-span3+3anchor. Its sufficient lower
inequality over the remaining whole domain is unproved. No unqualified full
geometry cover was launched to mask this gap.

No admissible D<=0 certificate or F<20/93 witness was found. Global K6 also
retains the separate one-bottom-component13-orderword continuous-domain
obligation. The regional20/93certificate is still not a global optimum.

Còn34phân hoạch cần thiết kiểu2+4/4+2/3+3, không được gọi là34ca hình học
đã hoàn tất. Cần chặn giao liên nhóm giữ cùng q và mọi độ lệch; các tiếp
tuyến trên chưa phải định lý. K6 toàn cục còn miền một thành phần đáy với
13thứ tự đỉnh. Chưa có phản ví dụ D<=0 hoặc cấu hình nhỏ hơn20/93.

## 5. Terminal checkpoint / Điểm dừng

2026-10-11 03:48–approximately04:25UTC, about37/60minutes; hard stop04:48UTC.
STOP is the named unproved coupling-strategy obstruction, NOT exhaustion of
time or computation. Unused allowance is not reissued; no successor is active.
Builder5math invocations: actual6.651999584s, conservative6.86/75s.
Main6math checks: conservative6/45s. Combined11,12.86/120s; no math failures
or invocation over30s. One documentation patch-context mismatch was corrected
without changing mathematical evidence; metadata reads are not math executions.

Old source/charter history is intact. Area source SHA256:
`26c3b41b3bb731d67247ef1033e94ba4e0dbb0b58aa662858bafe0603596cf55`.
No UI/app/DB/auth/config/Git/APIpaid/build/install/new infrastructure/runtime
grant/scratch project/distDir/Docker operation. No deletion or cleanup needed.
Vibecode Kit kept one Builder, gap-specific review and the existing TIP/report
workflow; no additional gates were built.

Dừng sau khoảng37phút do thiếu bất đẳng thức ghép đủ mạnh, không phải đã
hết trần60phút/120giây. Giữ lịch sử hướng thất bại và chứng minh đã đạt;
không tự mở chiến dịch tiếp, tăng trần, đổi mục tiêu hoặc gọi phần này là
khép K6. Nghiên cứu tiếp cần định tuyến trực tiếp từ con người.
