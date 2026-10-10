# Kakeya maximal: kiểm cơ chế suy hao mật độ — TIP094

Ngày 2026-10-10. Phạm vi: kiểm nguồn, không phải chiến dịch giải giả thuyết.
Trạng thái: **đã truy nguyên cơ chế và kiểm các bước cục bộ dưới đây;
chưa xác nhận toàn bộ định lý maximal**. Không có phản ví dụ nào được thiết lập
đối với bản thảo trong lượt này. “Chưa kiểm xong” không đồng nghĩa “bài sai”.

## 1. Đúng bản thảo, đúng câu hỏi

Nguồn chính: OpenAI, *The Kakeya maximal conjecture in three dimensions*,
23-09-2026, PDF97 trang. Phiên bản đọc được khóa tại commit
`fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb` của
[openai/math](https://github.com/openai/math/tree/fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb).
[PDF nguồn](https://github.com/openai/math/blob/fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb/preprints/The-Kakeya-maximal-conjecture-in-three-dimensions-September-23-2026/paper.pdf).
PDF và các mục nguồn liên quan được giữ tại `artifacts/research/tip094/`;
`SOURCES.md` ghi custody. Không chạy/build mã upstream.

Bài tuyên bố ước lượng operator L3 với mất mát delta^-epsilon. Câu hỏi của
lượt kiểm này là **mật độ lambda được giữ ở đâu, và điều kiện nào còn phải
chứng minh**, không phải lặp lại một kết luận trong abstract.

Mốc so sánh: [Zahl, khảo sát §3.3](https://arxiv.org/html/2512.09397v1#S3.SS3)
nêu trở ngại mật độ bị bình phương qua các bước nâng thang. Định lý tập hợp
[Guth–Wang–Zahl](https://arxiv.org/abs/2601.14411) có ngưỡng mật độ phụ thuộc
epsilon; không tự động cho tính đồng đều cần ở bài maximal. Hồ sơ TIP092 của
HIVE chỉ là tái lập Main Lemma1 tương đối với các tiền đề nguồn, không phải
chứng chỉ cho bản thảo mới.

## 2. Cơ chế thực: profile, không chỉ một số lambda

Trong mô hình hữu hạn, mỗi index có trọng số được giữ nguyên, một đường affine
và tập các bin thời gian được đánh dấu. Đặt N=delta^-1, n là tổng trọng số,
I là tổng incidence có trọng số, k=I/n, m=I/|E| và lambda=k/N.
Profile F(s) ghi thiếu hụt số bin bên trong một block cỡ N^s:

\[
  \#(S_i\cap J)=N^{s-F(s)+o(1)},\qquad F(1)=\alpha,
  \quad\lambda=N^{-\alpha+o(1)}.
\]

F không giảm, 1-Lipschitz, F(0)=0. Chỉ biết F(1) không mô tả được phân bố
thiếu hụt giữa các thang. Nguồn định nghĩa, với p>2 và q>=0,

\[
 \Pi_F(t)=\int_0^t P_{p,q}(F'(s))\,ds,\qquad
 P_{p,q}(e)=pe-\frac1\eta\int_{1/2-\eta}^{1/2}\min(q,re)\,dr.
\]

Điểm quyết định: tại q=0, **Pi_F(1)=p alpha**, bất kể hình dạng profile.
Critical inequality tại h(p,0)=0 trở thành

\[
 m\le N^{p\alpha+o(1)}\Delta_0
   =\lambda^{-p}N^{o(1)}\Delta_0.
\]

Với hướng tách nhau, Delta_0 bị chặn bởi hằng số. Do I=nNlambda, hệ quả là
|E| >= nN lambda^(p+1) N^-o(1). Cho p tiến xuống2 mới thu được số mũ3 cần
thiết. **h(p,0)=0 là tiền đề sâu, không phải sản phẩm của phép đổi số mũ này.**
Vị trí: `upstream-critical.tex` dòng130–207, `def:critical`.

## 3. Kiểm A — chi phí của restriction được cộng, không bình phương

Giả sử hai profile F,G thuộc đúng lớp uniform của nguồn, G đến từ restriction
giữ ít nhất N^-e+o(1) incidence, không tăng tổng trọng số index và không tạo
số lượng chart/index với mất mát theo lũy thừa chưa được tính. Khi đó:

1. Các block con được giữ là tập con của các block cũ, nên
   G(t)-G(s) >= F(t)-F(s) ở mọi s<t.
2. Nếu n'<=n, bảo toàn incidence cho
   n'N^(1-G(1)+o(1)) >= nN^(1-F(1)-e+o(1)); do đó
   0<=G(1)-F(1)<=e.
3. G-F không giảm và Lipschitz, nên G'>=F' hầu khắp nơi. Mọi hệ số góc của P
   nằm trong [p-1/2,p]. Vì thế

\[
 0\le\Pi_G(1)-\Pi_F(1)
 \le p\int_0^1(G'-F')\le pe.
\]

Đây là kiểm giải tích trực tiếp của phần cost lemma. Nhiều restriction có
budget e_j cộng lại gây tăng cost không quá p sum(e_j), **nếu các điều kiện
trên được duy trì ở từng bước**. Nó không bảo đảm một phép nâng thang hình học
bất kỳ đáp ứng các điều kiện. Nếu nhân index theo số block hoặc bỏ hụt budget
support, áp dụng này không còn hợp lệ.
Vị trí: `upstream-critical.tex` dòng340–474 và565–618.

## 4. Kiểm B — bình phương mật độ vẫn còn, nhưng bị tính vào mâu thuẫn

Bản thảo không lén coi lambda^2 như lambda. Ở prefix kappa, đặt nu là số mũ
đến từ ước lượng planar Furstenberg. Với các tiền đề hình học của
`lem:prefix-extension`, mật độ trong plate được chặn dưới bởi
N^-F(kappa) K^(nu-1), K=N^kappa.

Kiểm phần operator plate: với plate 1×K×K chứa điểm query, overlap hai plate
có góc giữa pháp tuyến theta bị chặn bởi C K^2/(1+K theta). Nếu hai plate
giao nhau, khoảng cách query y tới mặt phẳng của plate x không quá
C(1+K theta). Kernel AA* vì vậy không quá

\[
 \frac{C\,1_{|x-y|\le CK}}{K^2(1+\operatorname{dist}(y,\mathcal P_x))}.
\]

Tích phân theo hai tọa độ tiếp tuyến cho CK^2; tích phân theo pháp tuyến cho
C(1+log K). Kernel đối xứng, nên Schur cho bình phương chuẩn L2 không quá
C(1+log K), đồng đều theo linearization. Suy ra support đã fill có thể tăng
theo **rho^-2**, không phải rho^-1.

Giữ đúng số mũ ấy, nguồn có

\[
 |E^+|\le N^{2F(\kappa)+2\kappa(1-\nu)+o(1)}|E|,
 \qquad I^+=N^{F(\kappa)+o(1)}I.
\]

Do đó m^+ >= m N^[-F(kappa)-2kappa(1-nu)-o(1)]. Mặt khác, nếu xuất phát từ
critical equality, fill bỏ cost Pi_F(kappa) còn clustering không tăng, thì
critical upper bound cho m^+ <= m N^-Pi_F(kappa)+o(1). So sánh hai vế bắt buộc

\[
 \Pi_F(\kappa)\le F(\kappa)+2\kappa(1-\nu).
\]

**Kết luận của kiểm B:** không có phép cứu mật độ miễn phí. Suy hao bình phương
được giữ nguyên trong ledger; tác giả dùng bất đẳng thức cần thiết này để loại
các profile cực trị không phù hợp. Phần tính toán support/cost đã được kiểm.
Việc tạo đúng một họ plate với các shadings và phân bố neighbor cần thiết là
tiền đề hình học, chưa được chứng nhận độc lập bởi kiểm operator.
Vị trí: `upstream-local.tex` dòng405–490,500–685.

## 5. Kiểm C — same-index không được giả định là độc lập

Nguồn dùng label Z=(L0,L1) của hai event có cùng index. Giữ luật xác suất cố
định trong lúc thay đổi offset a. Giả sử các quan sát J(a) là lưới nested và
H(Z|E0)<=C(1+b log N). Đặt f(a)=I(J(a);Z|E0). Chain rule cho

\[
 I(J(a+Kb);Z\mid E_0,J(a))=f(a+Kb)-f(a).
\]

f không giảm và range không quá entropy alphabet. Trên một khoảng offset cố
định nằm trong miền admissible, tích phân sai phân không quá Kb times range.
Với D=N^b, chia log D cho bound C(b+1/log N). Chọn b_n và1/log N_n summable:
Tonelli cho incremental mutual information/log D tiến về0 ở hầu hết offset.
Đối với nearest-grid offset, sandwich bằng một gap lớn hơn cố định xử lý sai số
o(b) mà không cần giả định các inverse-grid cells có kích thước bằng nhau.

Bước xác suất này đúng dưới các giả thiết vừa nêu. Nếu pair law được chọn lại
theo offset a, f không còn là information function của một luật cố định và
chứng minh không dùng được. Bản thảo có nêu rõ ranh giới này.

Sau đó luật tích chỉ là **luật so sánh**, không phải luật thực của các event.
Nếu một support event chắc chắn dưới luật thực nhưng có xác suất <=D^-c dưới
luật tích các marginal, data processing cho KL buộc mutual information>=c log D.
Nó mâu thuẫn với bound trên. Giả thiết Frostman/target-support đủ mạnh để tạo
xác suất D^-c vẫn phải được kiểm riêng; bound entropy không cung cấp chúng.
Vị trí: `upstream-projections.tex` dòng441–595,650–788.

## 6. Kiểm D — từ critical inequality tới L3, có điều kiện

Đọc và đối chiếu PDF trang91–94 với `upstream-closure.tex` dòng382–644.
Giữ nguyên giả thiết h(p,0)=0 và regularization đúng lớp nguồn:

- Slope packing cho Delta_0<=C, kể cả subfamily.
- Failure uniform của cell bound tạo một sequence lambda=N^-alpha+o(1);
  regularization giữ incidence trong subpower và F(1)=alpha. Nếu cell support
  nhỏ hơn nNlambda^(p+1)N^-xi thì multiplicity vượt N^(p alpha) bởi một power
  cố định, trái critical bound. Không cần eta đồng đều cho nguồn set theorem.
- Sau nhóm translation với overlap bị chặn, số cap hướng cho

\[
 \sigma\{\mathcal K_N1_E>\lambda\}
 \le C_{p,\xi}N^\xi |E|\max(N^{-1},\lambda)^{-(p+1)}.
\]

Ở lambda>=N^-1, lambda^(2-p)<=N^(p-2), nên layer-cake cho indicator có cost
N^(p-2+xi)(1+log N)|E|. Phần lambda<N^-1 không bị bỏ quên: |E|>=N^-3 với
nonempty grid union đủ để chặn nó.

Với ||f||3=1, cell averages F_N thỏa0<=F_N<=N và||F_N||3<=1. Chỉ cần
O(log N) amplitude levels từ N^-1 tới N, dùng triangle inequality rồi Hölder
trên các levels; phần amplitude thấp có bound pointwise N^-1. Các grid cubes
gặp tube cũ nằm trong cylinder length4/radius4/N, nên integral domination có
volume factor64. Kết quả:

\[
 \|K_\delta f\|_3
 \le C_{p,\kappa}\delta^{-(p-2)/3-\kappa}\|f\|_3.
\]

Nếu h(p,0)=0 xảy ra với p>2 arbitrarily close to2, chọn p một lần theo epsilon
rồi kappa=epsilon/2 để được delta^-epsilon. Không cho p phụ thuộc delta nhằm
che một hằng số không đồng đều. Phần reduction này không tự chứng minh
Proposition10.1 (critical vanishing).

## 7. Trở ngại còn lại và lựa chọn tiếp theo

Chuỗi còn cần kiểm độc lập đầy đủ là: tạo equality có deficit dương → các
inner/outer cut trên cùng index/weight/time tree → canonical profile → luật
finite-scale có các conditional Frostman bounds → projection constraints →
critical vanishing. Đã đọc các đoạn liên quan để định vị; **chưa nghiệm thu
toàn bộ các dependency này**, các theorem nguồn Furstenberg hay cả97 trang.
Không thể đổi “một critic không tìm ra lỗi” thành xác nhận chuỗi đó.

Ưu tiên tiếp theo được định vị là interface **Local counts and conditional
Frostman laws**, `upstream-projections.tex` dòng156–362 (Lemma8.3), nối với
stationary data và các parent cuts. Nghĩa vụ cụ thể: cùng một refinement được
chọn trước queried offset phải giữ index weight, branching và các conditional
cell laws ở độ chính xác o(b), sau chia log D, khi D=N^b→infinity. Mean entropy
không đủ để thay một bound từng fiber. Cần một suy diễn finite-scale đầy đủ hoặc
phản ví dụ thỏa nguyên các tiền đề; chưa khẳng định interface này sai.

Đây là **đề xuất kiểm bước tiếp**, chưa là tuyên bố bổ đề mới hay chiến dịch5D.
Nếu interface đúng và đã có trong nguồn, chỉ ghi tái lập; tính mới cần một
statement mạnh hơn thực sự chưa được tài liệu hiện có bao phủ. Không tìm kết quả
bằng cách bỏ giả thiết hay thay tên một lemma đã công bố.

## Completion / VERIFY

STATUS: DONE cho lượt source audit có giới hạn; full maximal claim NOT_VERIFIED.
Coverage: P1–P4,4/4 deliverables của charter; đây là coverage công việc, không
phải phần trăm chứng minh Kakeya đã hoàn tất. Bốn kiểm A–D có phạm vi và tiền đề
hiển thị phía trên; không có formal/Lean certificate hay đánh giá độc lập mới.

FILES: charter094; ghi chú này; SOURCES và PDF/các mục TeX nguyên bản;
append-only commitment/handoff. Không đổi product code, UI, auth hay database.
VALIDATION: pdfinfo và pdftotext thật trên PDF97 trang; đối chiếu công thức ở
trang3,18,68,90–94; cả9 SHA-256 nguồn đã kiểm OK,4 Git blob IDs đối chiếu
khớp inventory upstream; git diff whitespace kiểm riêng các tài liệu tracking.
Build/type/lint/product
tests N/A cho lượt tài liệu toán, không được báo PASS giả. Không có benchmark,
solver/critic mới, paid API hoặc backend activation.
LIMITS: lời chứng nhận cục bộ của Main, không phản biện chuyên gia ngoài và
không formalize toàn bộ. HIVE advantage và novelty NOT_ESTABLISHED.

Acquisition ban đầu bị chặn DNS trong sandbox; GitHub tree/web PDF không đọc
được, paper.tex tại root404. Read-only network escalation lấy đúng source path
build/sections và pinned commit, không gửi dữ liệu local. Không clone repo,
install/build/Docker hay tạo scratch/distDir; giữ1,206,394bytes nguồn nghiên cứu
bền vững trong checkout, không có gì bị xóa. STOP scope094; source audit không
thay chuẩn của TIP093 và không tự cho phép A/B hay research campaign tiếp theo.

Completion checkpoint: 2026-10-10 01:34:11UTC, trong giới hạn40 phút.
