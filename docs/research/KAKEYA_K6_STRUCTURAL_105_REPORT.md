# K6 — exact construction and structural obstruction / Cấu hình chính xác và trở ngại cấu trúc

Status: **PARTIAL_GLOBAL_RESULT — C_T(6) remains OPEN.**

Owner routing: “lên thẳng k6”. This report continues from retained K5 evidence;
the stream disconnection did not require regenerating that evidence.

## 1. Scope / Phạm vi

For arbitrary real offsets, define

\[
T_j(x_j)=\operatorname{conv}\{(x_j,0),(x_j+1/6,0),(x_j+j/6,1)\},\quad
F_6(x)=\left|\bigcup_{j=1}^{6}T_j(x_j)\right|,\quad
C_T(6)=\inf_{x\in\mathbb R^6}F_6(x).
\]

This is a six-triangle finite Kakeya model, not unrestricted Kakeya. Translation
does not affect area; computations fix x6=0. The global minimum is not proved.

Đây là mô hình hữu hạn gồm sáu tam giác dịch chuyển ngang, không phải toàn bộ
giả thuyết Kakeya. Chuẩn hóa x6=0 chỉ loại bỏ phép tịnh tiến chung. Chưa chứng minh
giá trị tối ưu toàn cục của mô hình này.

## 2. Exact upper bound / Chặn trên chính xác

The structured construction found

\[
x^*=\frac1{186}(49,43,23,26,6,0),\qquad F_6(x^*)=\frac{20}{93}.
\]

Both retained exact algorithms — endpoint trapezoid integration and independently
implemented midpoint affine integration — give the same rational value. Main
reran the witness. Numerical navigation selected the candidate; rational sweeps,
not numerical rounding or a seed inventory, establish its area.

Hai thuật toán tích phân hữu tỉ độc lập cho cùng diện tích 20/93; Main đã phát lại
phép kiểm. Tính toán gần đúng chỉ chọn ứng viên. Giá trị diện tích được xác nhận
bằng số hữu tỉ, không phải suy đoán từ tìm kiếm hay làm tròn.

The public reversal family xj=(6−j)/18 has area2/9. Therefore

\[
\frac29-\frac{20}{93}=\frac2{279}>0.
\]

This improves that named restricted family, NOT a certified literature record.
The witness is reflection-fixed: x1+x6=x2+x5=x3+x4=49/186. This differs from K5's
forced symmetry breaking, but does not establish symmetry of all K6 minimizers.

Cấu hình này tốt hơn họ đảo đều đã công bố một lượng 2/279, không phải tuyên bố
kỷ lục thế giới. Nó có đối xứng phản xạ; điều đó không có nghĩa mọi nghiệm tối ưu
K6 đều đối xứng. Tính mới vẫn chưa được thẩm định.

Source: [Station verification notebook, §4.3](https://dualverse.ai/station/math/discretized-kakeya-needle/).
The notebook's listed benchmark sizes are2,4,8,16,32,64,128, and its separate
small-n results concern3,4,5. Bounded searches for “Kakeya20/93”, “discretized
Kakeya six” and “C_T(6)” found no matching primary K6 theorem; search absence is
not evidence of novelty. No exhaustive literature review is asserted.

Nguồn chuẩn so sánh là mục4.3 của notebook Station. Tra cứu giới hạn chưa tìm thấy
định lý K6 tương ứng trong nguồn gốc, nhưng không được dùng sự vắng mặt của kết
quả tìm kiếm để khẳng định tính mới; chưa có rà soát tài liệu toàn diện.

## 3. A certified region, not the whole space / Miền được chứng nhận, không phải toàn không gian

Let z=(x1,...,x5), z*=the first five entries above. Generate all endpoint-pair
equalities at y=0 and1, parallel coincidences, and triple-endpoint concurrences.
After rational normalization/deduplication there are147 hyperplanes. Let C be
the open chamber with the same signs as z*. The exact replay records every wall
and sign. No coarse wall contains z*. The ball ||z−z*||∞<1/465 lies in C.

Sinh đầy đủ các siêu phẳng do hai đầu mút gặp nhau tại biên y=0 hoặc1, hai đường
song song trùng nhau, và ba đường đầu mút đồng quy. Sau chuẩn hóa có147 siêu phẳng.
C là miền mang cùng dấu với ứng viên. Ứng viên không nằm trên siêu phẳng thô nào;
lân cận ||z−z*||∞<1/465 nằm trong C. Danh sách dấu và siêu phẳng được lưu trong
chứng chỉ phát lại, không chỉ báo một con số đếm.

**Why one polynomial suffices on C.** Every triangle edge has fixed slope and
affine intercept. Pairwise intersection vertices, including strip-boundary
vertices, are affine in z. Union-boundary incidence can change only through
triple concurrence, parallel coincidence, or an intersection crossing a strip
boundary; these are the generated walls. On connected C the polygon boundary
therefore has fixed incidence. Its signed shoelace area is one quadratic in z.
Coincident heights of unrelated crossings do not change boundary incidence.
Deriving that quadratic on a generic fine subcell determines it throughout C;
continuity extends the identity to its closure. This geometric argument, not
finite sample agreement, supplies the extension.

**Vì sao một đa thức đủ trên C.** Các cạnh có hệ số góc cố định, nên tọa độ giao
điểm phụ thuộc affine vào z. Cấu trúc biên hợp đa giác chỉ thay đổi khi đồng quy,
trùng đường song song hoặc giao điểm đi qua biên dải; các siêu phẳng trên đã bao
gồm những biến cố đó. Trong C, cấu trúc biên cố định; công thức diện tích dây giày
cho một đa thức bậc hai duy nhất. Hai biến cố độc lập có cùng độ cao không thay
đổi cấu trúc biên. Tính liên tục mở rộng công thức đến bao đóng của C. Đây là
lập luận hình học, không phải suy luận từ một số điểm thử.

Exact symbolic integration gives

\[
F_6(z,0)=\frac{20}{93}+\frac12(z-z^*)^TH(z-z^*),\quad z\in\overline C,
\]

\[
H=\begin{pmatrix}
7&-6&-1&0&0\\
-6&33/2&-9&-3&3/2\\
-1&-9&13&0&-3\\
0&-3&0&13&-9\\
0&3/2&-3&-9&33/2
\end{pmatrix}.
\]

The gradient at z* is zero; the leading principal minors are
7,159/2,342,3636,25110, all positive. Sylvester's criterion proves H positive
definite. Thus z* uniquely minimizes area on this closed chamber and is a strict
local minimum in the full five-dimensional gauge space. Three finer event-order
ties at the witness do not invalidate this coarse-chamber result.

Gradient tại z* bằng0; năm định thức con chính đầu đều dương. Tiêu chuẩn Sylvester
chứng minh Hessian xác định dương. Vì vậy ứng viên là nghiệm cực tiểu duy nhất
trong bao đóng miền C, và là cực tiểu địa phương nghiêm ngặt trong cả năm biến tự
do — không chỉ trong họ đối xứng. Ba điểm trùng độ cao thuộc phân chia mịn không
làm mất hiệu lực kết luận trên miền thô.

Other chambers remain unexcluded. No147-wall global cover was generated.
Các miền khác chưa bị loại trừ; chưa sinh phân chia bao phủ toàn không gian K6.

## 4. Universal lower bound by incompatible K5 blocks / Chặn dưới toàn cục từ hai khối K5 không tương thích

This part depends on the corrected internal K5 computer-assisted theorem and
its equality/stability classification, not on an external referee's acceptance:
[TIP103 report](KAKEYA_K5_EQUALITY_STABILITY_103_REPORT.md), §5, states

\[
F_5(u)\ge \frac{14}{61}+c\min\{\operatorname{dist}(u,M)^2,1\},\quad c>0,
\]

\[
M=\{(29,93,116,165)/61,(49,72,136,165)/61\}.
\]

The constant c is existential: min{1/64,eta,1/4514}, with eta not computed.
It cannot be replaced by1/64 or1/4514 without further proof.

Phần này kế thừa định lý K5 nội bộ đã được sửa và kiểm bằng chứng chỉ cùng phân
loại nghiệm/ổn định; chưa thay thế phản biện bên ngoài. Hằng số c dương tồn tại,
nhưng eta chưa được tính. Không được tự thay c bằng1/64 hoặc1/4514.

Scale the first five triangles horizontally by6/5 to get K5. For the last five,
also apply X↦X−y/5 after that scaling. Each original block has area(5/6)F5.
Their apex-coordinate vectors are

\[
A=(6(x_2-x_1)+1,6(x_3-x_1)+2,6(x_4-x_1)+3,6(x_5-x_1)+4),
\]
\[
B=(6(x_3-x_2)+1,6(x_4-x_2)+2,6(x_5-x_2)+3,6(x_6-x_2)+4).
\]

For v=(v1,v2,v3,v4), define

\[
L(v)=(v_2-v_1,v_3-v_2,v_4-v_3),\qquad
R(v)=(v_1,v_2-v_1,v_3-v_2).
\]

The shared four triangles impose **L(A)=R(B)**. Moreover ||L||,||R||<=2 by
(a−b)^2<=2a^2+2b^2. The four squared cross-distances between L(M) and R(M) are

\[
\frac1{3721}\begin{pmatrix}3582&450\\72&3582\end{pmatrix}.
\]

So delta²=72/3721 is their minimum squared separation. Choose nearest minimizers
for A and B. Compatibility and the triangle inequality give

\[
\delta\le 2\operatorname{dist}(A,M)+2\operatorname{dist}(B,M),\quad
\max\{\operatorname{dist}(A,M)^2,\operatorname{dist}(B,M)^2\}\ge\frac9{7442}.
\]

This threshold is below1, so the capped stability estimate retains it. Since
the full six-triangle union contains both blocks,

\[
\boxed{F_6(x)\ge\frac{35}{183}+\frac{15c}{14884}>\frac{35}{183}}
\quad\text{for every real }x.
\]

Chuẩn hóa hai khối năm tam giác cho hai bài K5. Bốn tam giác chung buộc L(A)=R(B),
nhưng hai tập ảnh của các nghiệm đạt dấu bằng K5 cách nhau một khoảng dương.
Vì vậy ít nhất một khối phải cách tập nghiệm K5 một lượng định lượng. Chặn ổn
định toàn cục biến độ lệch đó thành diện tích tăng thêm. Kết luận đóng khung đúng
cho mọi bộ dịch chuyển thực, không chỉ ứng viên đã tìm được. Không cần giả định
tồn tại nghiệm tối ưu K6 hay dùng một tập mẫu thay cho toàn không gian.

Equality incompatibility ALONE would only rule out attainment of35/183. The
global K5 stability bound is essential to rule out sequences approaching that
value. A targeted fresh-context critic hand-checked normalization, compatibility,
norms, all four distances, the cap and constants; no blocking gap found. That is
AI proof review, not external mathematical acceptance.

Chỉ chỉ ra dấu bằng không tương thích chưa đủ loại bỏ một dãy tiến về35/183.
Chặn ổn định K5 toàn cục mới bảo đảm khoảng cách diện tích dương đồng đều. Phản
biện AI theo đúng khoảng trống này đã kiểm bằng tay các bước và không tìm thấy
lỗi chặn; đó không phải nghiệm thu bởi nhà toán học độc lập bên ngoài.

## 5. What was established / Điều đã thiết lập

\[
\frac{35}{183}+\frac{15c}{14884}\le C_T(6)\le\frac{20}{93},\qquad c>0.
\]

The numerical endpoints without the uncomputed positive correction are
approximately0.1912568306 and0.2150537634. Their separation is still substantial.
The correction is proved positive but has no newly certified numerical value.

Đã có cấu hình chính xác tốt hơn họ đảo đều, chứng nhận cực tiểu trên một miền
đầy đủ, và một chặn dưới toàn cục nghiêm hơn phép chuyển K5 đơn thuần. Khoảng giữa
hai phía vẫn chưa khép; không có cơ sở gọi20/93 là tối ưu toàn cục.

The reusable insight is a compatibility obstruction: equality classifications
plus global stability on overlapping smaller problems can yield a strict larger
problem lower bound without enumerating its full arrangement. This establishes
a mathematical mechanism within the retained proof chain, not causal superiority
of HIVE versus a strong single LLM, novelty, or a solution of general Kakeya.

Cơ chế có thể tái sử dụng là kiểm tính tương thích của các cấu hình đạt dấu bằng
trên các khối chồng lấn, rồi dùng ổn định toàn cục để nâng chặn dưới. Đây là kết
quả toán có nội dung trong chuỗi chứng minh hiện tại; chưa chứng minh HIVE vượt
một LLM đơn, chưa xác lập tính mới, và không giải giả thuyết Kakeya tổng quát.

## 6. Verification / Kiểm chứng

Scoped R1–R4 deliverables4/4 complete. Global C_T(6), numerical global c,
external mathematical review, novelty and causal method advantage remain OPEN.
Ordinary engineering tests do not close any of these scientific obligations.

Main verified source wall generation and the polygon proof; the targeted critic
verified the geometric implication but did NOT independently enumerate the147
walls, compute the Hessian, or prove the radius from a separate implementation.
Fresh Main local replay agrees exactly with the Builder certificate apart from
elapsed time, the clarified premise, and newly added complete wall/sign fields.
The final output has147 rows and147 signs. Main witness replay independently
reruns the two retained rational sweep implementations; it is not a third area
algorithm. Eight distinct focused controls PASS in both Builder and Main runs,
not16 distinct tests. Final additive local output/CLI was executed by Main; no
application build, typecheck or lint was needed or claimed for this math-only pass.

Đã hoàn tất4/4 đầu ra có phạm vi; mục tiêu tối ưu K6 toàn cục vẫn mở. Main kiểm
nguồn sinh siêu phẳng và lập luận đa giác; phản biện AI kiểm ý nghĩa hình học,
không tự sinh lại147 siêu phẳng bằng chương trình khác. Phát lại Main khớp chứng
chỉ cũ, và lưu đủ147 hàng cùng147 dấu. Tám kiểm thử khác nhau đều đạt; chạy lại
không biến chúng thành16 kiểm thử. Không chạy hoặc tuyên bố build/typecheck/lint
toàn ứng dụng trong lượt nghiên cứu chỉ dùng công cụ toán này.

Math-process usage: Builder4/4, including one immediate missing-SciPy refusal
(no install), structured stdlib navigation3.024894s, exact local0.046761s,
eight-control process0.055s. Main3/4: exact witness, eight-control replay0.056s,
fresh local replay0.049163s. Total7/8 mathematical processes, conservatively
<6seconds of computation within300seconds; one unused invocation not reissued.
Navigation completed25structured starts/35,575floating objective evaluations.
Those evaluations are not an exhaustive arrangement, a proof of optimality, or
a benchmark comparison to another solver. The internal “converged” flag only
means the coordinate step became small. Original missing-dependency refusal and
Builder output preceding additive wall fields remain documented, not erased.

Tổng cộng7/8 tiến trình toán, dưới6giây tính toán theo cách tính bảo thủ trong
trần300giây. Có một lượt từ chối vì thiếu SciPy; không cài thêm gói. Tìm kiếm
định hướng dùng25 cấu hình khởi đầu có cấu trúc, không ngẫu nhiên. Các đánh giá
gần đúng không phải bao phủ toàn miền hay so sánh năng lực với một solver khác.

Evidence: `artifacts/research/tip105/MAIN_WITNESS_REPLAY.json`,
`MAIN_LOCAL_CERTIFICATE.json`, `BUILDER_NAVIGATION.json`, the three small Python
sources, eight controls and `BUILDER_COMPLETION.md`. Main local JSON SHA256:
61e50ac23cf8148c95bbca8bfdc4cb8e102eb7ab2bf1972f7cb2f316a7c1fe8a.
Original K5 closure report SHA8aa3eb90345f776e0428b5fb5a5f4ce444135de5efca8ba46a5d02c5257f3796
and equality report SHAc5368c489232e4b6e376d813298c9e0bc76ac95624938b86dac7253cd822c3c7
remain unchanged. No K5 regeneration, UI/app/DB/auth/config/Git mutation, paid
API, build/install, new gate, project copy, scratch directory, distDir, Docker
or bytecode allocation. New evidence package approximately64KiB; nothing removed.

Hồ sơ K5 được giữ nguyên, không chạy lại từ đầu. Không thay UI, database, xác
thực, Git hoặc gọi API trả phí; không thêm hạ tầng, bản sao dự án hay thư mục
build. Không có dữ liệu bị xóa.

## 7. Stop / Điểm dừng

This bounded campaign is complete; the global root is not. The next substantive
obligation is to exclude configurations outside this certified chamber or obtain
a universal inequality matching20/93, rather than run more random searches or
call the regional certificate a global proof. The all-domain cost is not yet
qualified; no full4D cover or successor grant is silently opened.

Lượt này đã hoàn tất phần đầu ra đã định; bài toán toàn cục chưa khép. Nghĩa vụ
tiếp theo là loại các cấu hình ngoài miền đã chứng nhận, hoặc chứng minh bất
đẳng thức toàn cục khớp20/93. Không tự mở bao phủ4chiều, tăng trần hay đổi mục tiêu.
