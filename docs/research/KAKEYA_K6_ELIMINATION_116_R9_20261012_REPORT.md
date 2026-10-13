# K6 R9 — exact sixth-triangle elimination / Loại chính xác tam giác thứ sáu

## Kết luận

**Đã hoàn tất chứng minh công thức loại biến trên toàn miền cấu hình thực
của năm tam giác, cùng đánh giá khả thi ban đầu. Chưa khép K6.**

Đây không phải kết quả trên một lân cận hay một họ đối xứng: công thức
giữ mọi thứ tự đỉnh, cấu hình đảo, hợp rời nhau, tiếp xúc nhiều cạnh và
cạnh song song trùng nhau. Tuy nhiên chứng minh công thức không đồng
nghĩa đã chứng minh giá trị tối ưu40/31 trong tọa độ nhân ngang sáu lần.

## 1. Công thức toàn miền đã được kiểm

Với A1,...,A5 thực bất kỳ, đặt

    U_t = union_(j=1..5)[A_j-j*t, A_j-(j-1)*t], 0<=t<=1,
    H(A) = integral_0^1 |U_t|dt,
    C_A(z) = integral_0^1 |U_t intersect [z-6t,z-5t]|dt.

Diện tích nhỏ nhất khi chỉ thay vị trí tam giác thứ sáu là CHÍNH XÁC

    min_z G6(A,z)=H(A)+mu(A),
    mu(A)=1/2-max_z C_A(z).

Hàm C_A liên tục, bậc hai từng đoạn; không giả định khả vi tại tiếp xúc
song song z=A5. Đã chứng minh cực đại đạt được trong khoảng hữu hạn

    [min_j A_j, max_j(A_j+7-j)].

Với MỌI cấu hình năm tam giác cố định, đủ xét tối đa102 điểm gãy và101
điểm cực đại trong các đoạn bậc hai lõm: tổng không quá203 ứng viên.
Đoạn phẳng dùng giá trị ở đầu đoạn; điểm gãy trùng nhau được gộp.
Đây là cận chứng minh bằng hình học, không phải số quan sát từ phép chạy.

Cách tính thay thế không cần dựng biên đa giác: đặt Q_k(z) là tổng độ
dài HỢP các khoảng độ cao mà tia z-k*t nằm trong U_t, k=5,6. Với mỗi j,
d=z-A_j, m=k-j, khoảng đóng góp là

    m>0, d>=0: [max(0,d/(m+1)), min(1,d/m)] nếu không rỗng;
    m=0, 0<=d<=1: [d,1]; các trường hợp khác rỗng.

Lấy hợp của năm khoảng, KHÔNG cộng từng độ dài, rồi

    C_A(z)=integral_(min Aj)^z [Q_5(s)-Q_6(s)]ds.

Công thức này giữ chính xác tương tác phần giao và khe hở. Nó loại hẳn
một biến tối ưu, không thay biến đó bằng một điều kiện cần về đạo hàm.

## 2. Vì sao203 không đồng nghĩa đã giải được K6

Sau bỏ tịnh tiến chung còn BỐN biến của cấu hình lõi. Khi chúng đổi,
thứ tự điểm gãy, cạnh lộ ra và tính hợp lệ của điểm cực đại cũng đổi.
203 là số ứng viên trên một lõi cố định, không phải203 trường hợp cho
toàn không gian bốn biến.

Trên mỗi miền có cấu trúc giao và thứ tự điểm gãy cố định, mọi ứng viên
z là hàm affine của bốn biến; diện tích sau thế z là đa thức bậc hai.
Vì thế có một dạng chứng chỉ toàn cục rõ ràng: chứng minh mọi đa thức
ứng viên hợp lệ đều >=40/31 trên toàn miền đa diện tương ứng, kể cả biên.
Không cần so sánh ứng viên nào thắng, nhưng không được bỏ ứng viên khả thi.

Một kiểm kê so sánh đủ nhưng rất thô cho tối đa5857 siêu phẳng trước
loại trùng và trước các điều kiện hợp lệ của ứng viên. Đây KHÔNG phải
số miền thực, số chứng chỉ, chặn dưới công việc hay dự báo thời gian.
Cận tổ hợp của phân hoạch vẫn lớn; chưa có chứng chỉ toàn miền nhỏ gọn.

Không thể ghép thẳng bộ2632 miền K5 cũ: bộ đó dùng điều kiện mọi cặp
chồng lấp sau phép rút gọn cực tiểu K5. Lõi của một cấu hình K6 không
đương nhiên thỏa điều kiện ấy. Chặn cũ cho phần ngoài, sau chuẩn hóa,
chỉ là85/74<40/31. Hằng số ổn định K5 toàn cục cũng chưa được định lượng
đủ để trả phần diện tích bổ sung còn thiếu.

**Quyết định khả thi:** công thức loại biến chính xác đã đủ cơ sở;
chưa đủ cơ sở mở sản xuất một chứng chỉ K6 toàn miền với chi phí nhỏ.
Không kết luận hướng này bất khả thi, cũng không xây bộ vét miền mới.

## 3. English — theorem, feasibility and remaining obligation

For every unrestricted real five-triangle core, the exact insertion
cost is mu(A)=1/2-max C_A(z). The coverage function is continuous and
piecewise quadratic, with compact attainment. At most102 projected core
vertices/knots and101 interior concave-quadratic maxima supply a complete
candidate set of size at most203. Coincident, parallel, disconnected,
inverted and physical-boundary cases are included directly.

The independent ray-union representation is C_A'=Q5-Q6 almost everywhere,
with Qk defined by the actual union of the five explicit height intervals
above. The parallel case is retained; no generic stationary argument or
pairwise-overlap relaxation is used. Exact elimination needs no numerical
optimizer. Rational cores admit rational candidate/value arithmetic.

This is an all-core theorem, not a finite test. But203 is a per-core
count, not a count of global parameter chambers. In four normalized core
variables, affine candidates yield quadratic value branches on polyhedral
domains. A full proof must bound every admissible branch, including all
faces. The conservative5857 comparison-wall ceiling is not an actual
enumeration or runtime guarantee, and excludes later eligibility cuts.

The exact remaining target is H(A)+mu(A)>=40/31 for EVERY real core.
Conditional on the retained internal all-real K5 theorem, it is equivalent
to epsilon+mu(A)>=270/1891, epsilon=H(A)-70/61>=0. The elimination proof
itself does not need that predecessor theorem. Its restricted shape cover
and existential stability constant do not already prove this tradeoff.

Verdict: exact elimination and the first-stage feasibility assessment are
complete at independent AI hand-review scope; full K6 production cost is
NOT QUALIFIED and global K6 is OPEN. No infeasibility, novelty, external
referee acceptance or Lean verification is claimed. No automatic next
enumeration or campaign is launched.

## 4. Verification and resource record

E1 all-core exact formula/attainment/candidates: hand-reviewed PASS.
E2 feasibility assessment: DONE, distinguishing fixed-core work from the
unqualified whole certificate. E3 literal review/report: recorded below.
Global R116-1 lower bound: OPEN, not counted as complete by E1/E2.

Activation2026-10-12 12:53:24UTC (19:53:24 Vietnam); original cutoff
13:43:24/hardstop13:53:24 unchanged. Main new derivation stopped13:05:07;
critic13:05:03 and Builder13:05:32UTC. Early first-stage completion is not
exhaustion of the60min cap.

Main fully read Builder proof13:04:06UTC. Critic fully read Main13:02:08,
Builder13:03:25 and its continuity addendum13:04:37. Those reviews accept
the formula, degeneracies, counts and scoped feasibility, not a K6 floor.
Critic fully reread repaired Builder proof/completion13:06:46; Builder
fully read final bilingual report13:07:20. Main read repaired Builder
sections and its completion during13:07:51--13:08:09. Only literal review
and terminal recording followed the derivation stops. Critic fully read
the final bilingual report and final Main note13:08:02UTC: ACCEPT, no
blocking correction; final metadata records the distinct observed stops.

Evidence is in artifacts/research/tip116: new R9 scope, MAIN_ELIMINATION,
BUILDER_ELIMINATION and CRITIC_ELIMINATION notes dated20261012, plus
Builder/critic completions. All predecessors including R8 are preserved.
Vibecode Kit affected only existing-agent proof review and honest reporting;
no new workflow platform or runtime gate was introduced.

Mathematical subprocesses/seconds/failed starts: 0/0/0. No code, app/UI,
database, API, Git writes, build/install, sampling, optimizer, enumeration,
replay, infrastructure, scratch copy or deletion. Nothing removed. No
executed numeric timing, benchmark or software-test result is asserted.
