# K6 / TIP116 R4 — a false proof premise excluded; global theorem open

## Tiếng Việt

### Kết luận

**Chưa chứng minh được K6 toàn cục.** Lượt này không khép thêm miền nào
trong12 miền đảo thứ tự. Kết quả mới là một phản ví dụ hình học chính xác,
được phản biện tay độc lập, loại bỏ tiền đề “chặn chữ V có tâm di động”
đang được xét làm đường chứng minh. Không được gọi nó là phản ví dụ K6
hay đột phá giải bài toán.

Mục tiêu giữ nguyên mô hình sáu tam giác tịnh tiến ngang:

\[
T_j(x_j)=\operatorname{conv}\{(x_j,0),(x_j+1/6,0),(x_j+j/6,1)\},
\quad F_6=\left|\bigcup_{j=1}^6T_j\right|\ge\frac{20}{93}.
\]

Đây là mô hình hữu hạn, không phải Kakeya tổng quát. Định nghĩa nguồn
được đọc lại tại [Station](https://dualverse.ai/station/math/discretized-kakeya-needle/);
nguồn không cung cấp chứng minh cho bất đẳng thức còn thiếu của lượt này.

### Điều đã kiểm được

Với cặp đỉnh đảo \(a>b\), đặt \(u=a-b\), \(B=[b,a]\). Gọi \(O_t\)
là toàn bộ hợp của bốn tam giác còn lại ở tọa độ chuyển động cùng cặp;
\(\ell_0,\ell_+,\ell_-\) là độ dài giao của \(O_t\) với khe \(B\)
và hai khe dịch \(B\pm t\), còn \(\ell_K\) là giao với lens của cặp
sau đổi. Đồng nhất thức lợi ích chính xác là

\[
G_{\rm old}-G_{\rm swap}
=u-\frac{3u^2}{4}
+\int_0^1(\ell_0-\ell_+-\ell_-)\,dt
+\int_0^u(\ell_0-\ell_K)\,dt,
\qquad G=6F_6.
\]

Số hạng cuối có dấu **cộng**, giữ giao che phủ thực ở chiều cao nhỏ.
Mọi giao đều với toàn hợp \(O_t\), không phải tổng giao từng cặp.
Builder và phản biện đã kiểm literal công thức. Đây là đồng nhất thức,
**chưa chứng minh vế phải dương** trên miền cần xét.

Chặn tích phân đủ để loại đảo được đề xuất là

\[
\int_b^a S(x)\,dx\ge\frac{u(5-r)}{12}+\frac{u^2}{3},\qquad
r\le\frac{49}{31},\quad u\le r-1.
\tag{P}
\]

Nếu(P) đúng cho toàn bộ hình học đã tuyên bố, lợi ích đổi cặp ít nhất
\(4u/93>0\). Phép suy ra này đúng, nhưng **(P) chưa được chứng minh**.
Một chặn phân bố mức trên khe thật \(B\) cũng đủ qua layer cake; tiền đề
hình học ấy chưa được chứng minh và chưa bị phản ví dụ dưới đây bác bỏ.

### Phản ví dụ mới bác bỏ đúng điều gì?

Đặt \(p_j=6x_j\), \(A_j=p_j+j\), \(r=79/50\) và

\[
p=(0,1,r,0,1,0).
\]

Khe đảo3/4 là \(x=3+y\), \(1\le y\le r\), \(u=29/50\).
Từ các dải giao thực lấy **hợp trước khi tính độ dài**, suy ra

\[
S(y)=
\begin{cases}
3/4-y/6,&1\le y\le6/5,\\
-1/4+2y/3,&6/5\le y\le4/3,\\
3/4-y/12,&4/3\le y\le3/2,\\
-3/4+11y/12,&3/2\le y\le79/50.
\end{cases}
\]

Chặn chữ V với độ cao \(c=(5-r)/12\) và độ dốc \(4/3\), dù chọn tâm
ở đâu, bắt buộc thỏa bất đẳng thức hai điểm. Nhưng

\[
S(1)+S(r)=\frac{769}{600}
<2c+\frac43u=\frac{806}{600}.
\]

Độ vi phạm chính xác là \(37/600\). Đây không chỉ là lỗi ở mặt tiếp xúc:
với \(\varepsilon=1/10000\), cấu hình

\[
p_\varepsilon=(\varepsilon,1,r-\varepsilon,
\varepsilon,1-\varepsilon,0)
\]

có đáy liên thông nghiêm ngặt, thứ tự đỉnh nghiêm ngặt
\((1,2,4,3,5,6)\) và chỉ một cặp đảo. Chặn biến thiên các đầu dải sau
clipping cho độ vi phạm còn ít nhất \(173/3000>0\). Cả Builder và phản
biện đã kiểm tay phép dựng, các hợp dải và biên sai số.

Phản ví dụ **chỉ bác bỏ chặn chữ V mạnh hơn**. Chính cấu hình ban đầu
có \(S\ge11/20\), nên thỏa(P) nghiêm ngặt. Nó không phải phản ví dụ
cho(P), chặn phân bố mức, điều kiện cực tiểu toàn cục hay K6. Không có
tuyên bố rằng cấu hình này thỏa đầy đủ hệ phương trình dừng của diện tích.

### Trạng thái, sai sót và giới hạn

- R116-1: OPEN; cả12 miền đảo và phần ghép biên/collision/đạt cực tiểu còn mở.
- R116-2: hoàn tất phản biện tay đúng phạm vi cho công thức, các phép suy ra
  có điều kiện và phản ví dụ mới; không phải nghiệm thu định lý toàn cục.
- R116-3: lưu đầy đủ thử nghiệm, bản sửa và báo cáo; dừng sau tiền đề đóng
  thất bại. Không tự khởi động một hướng khác.

Liên thông của sáu tam giác ở đáy chỉ bảo đảm \(O_1\) che phủ khe thật,
không bảo đảm che phủ toàn khoảng tọa độ lớn hơn. Main cũng đã rút lại
cảnh báo sai rằng khoảng cách nguồn có thể đổi dấu ngoài khe: trong miền
\(r<2\), các khoảng cách vẫn ít nhất \(2-r>0\). Không kết luận đã chấp
nhận nào dùng suy luận đã rút lại. Quan sát phụ về radial curvature của
Builder được lưu **UNREVIEWED/UNUSED**, không dùng làm bằng chứng nghiệm thu.

Lượt được duyệt bắt đầu05:19:10 UTC ngày12/10/2026, hạn06:19:10 UTC.
Main dừng suy diễn05:46:49; Builder05:47:48. Phản biện literal cuối
05:49:10, trước hạn. Dừng vì một cơ chế chứng minh đủ đã thất bại, không
vì hết thời lượng và không phải kết luận bài toán bất khả thi.

## English

### Outcome

**Global K6 remains open; zero inverted domains were closed in this run.**
The new established result is an independently hand-checked actual geometric
counterexample to a stronger movable-V proof premise. It is not a K6
counterexample, an averaged-bound counterexample or a research breakthrough.

The exact strip gain above retains the positive early joint-coverage term.
All intersections use the whole external union, with multiplicities counted
once. Its literal identity is accepted; its positivity on the committed
whole domain is not established. The sufficient averaged inequality(P),
and the actual-corridor sublevel premise, remain unproved. The latter is
stronger than(P) but weaker than the refuted movable-V premise.

The exact counter has endpoint sum769/600 against the required806/600.
Its strict epsilon perturbation preserves connected bottom, strict external
apex order and a unique central inversion, with certified hand-derived
violation margin at least173/3000. The unperturbed function actually
satisfies(P) strictly, since S>=11/20>287/600=c+u/3. Therefore failure
of the movable V cannot be conflated with failure of P, the sublevel bound,
the actual coupled gain, full stationarity or the finite K6 target.

All twelve inverted continua/faces and whole boundary/collision/attainment
assembly remain explicit debts. Frozen natural-order classification is
conditional evidence, not an all-real theorem. No Lean verification, external
referee acceptance, novelty claim or general Kakeya result is asserted.

The off-corridor external-bottom-coverage assumption was refused. Main's
additional mistaken distance-positivity warning was immediately corrected
and preserved as withdrawn. The Builder's pre-stop auxiliary radial remark
is preserved UNREVIEWED/UNUSED and is not relied upon.

The new owner-approved60-minute window was05:19:10–06:19:10 UTC. Main
stopped derivation05:46:49, Builder05:47:48. Final literal critic wording
review05:49:10 was within the cap. Only saved-proof review and reporting
followed the stops. There is no automatic replacement proof route or grant.
The earlier R3 overrun history remains unchanged.

## Evidence and resource ledger / Hồ sơ và tài nguyên

- [R4 scope](../../artifacts/research/tip116/CONTINUATION_R4_SCOPE_20261012.md)
- [Main proof and exact counter](../../artifacts/research/tip116/MAIN_INVERTED_R4_20261012.md)
- [Builder note](../../artifacts/research/tip116/BUILDER_INVERTED_R4_20261012.md)
- [Independent review](../../artifacts/research/tip116/CRITIC_INVERTED_R4_20261012.md)
- [Main completion](../../artifacts/research/tip116/MAIN_COMPLETION_R4_20261012.md)
- [Builder completion](../../artifacts/research/tip116/BUILDER_COMPLETION_R4_20261012.md)
- [Critic completion](../../artifacts/research/tip116/CRITIC_COMPLETION_R4_20261012.md)

Mathematical subprocesses0, process seconds0, failed mathematical starts0;
hand research time was nonzero. No optimizer, samples, enumeration, LP,
replay, mathematical code, UI/app/DB/auth/API/Git writes, build, install,
project copy, Docker, deletion or new infrastructure/agents. No scratch or
distDir created; nothing removed. Only new R4 Markdown and append-only
active/handoff checkpoints changed. Frozen predecessors and unrelated dirty
work were preserved. Whitespace checks are maintenance, not proof tests.

Vibecode Kit was used minimally for one Builder, one independent critic and
scoped completion; it did not add gates or platform work. Status: STOP/PARTIAL.
