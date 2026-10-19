# TIP108C — Uniform-core attempt / Lượt chứng nhận lõi đồng đều

Terminal at 2026-10-11 05:06:50 UTC: **STOP_PARTIAL_NODE_CAP_REFUSAL**.
R1 universal near-two-group defect and global finite C_T(6) remain **OPEN**.
There is no complete certificate, admissible D<=0 countercertificate, smaller
global witness, or new global mathematical milestone. R2 complete replay was
NOT performed: the independently authored checker refused the actual file
before tree/leaf geometry. This is not general Kakeya, a novelty claim, a
benchmark advantage, external peer review or Lean verification.

## Tiếng Việt

Đã triển khai đúng bước được duyệt: chọn cận dưới diện tích có hiệu lực trên
cả một hộp tham số, xây riêng bộ tạo và bộ kiểm chứng, kiểm các tình huống sai,
rồi chạy MỘT lượt trên toàn bộ 286 biểu đồ của 34 chữ ký nhãn còn lại. Không
chạy tìm kiếm ngẫu nhiên, không chỉ chọn vài nhánh dễ và không đổi bài toán.

Mục tiêu là D=2G-(2+S)>0, G=6F, với hai nhóm 2+4/4+2/3+3,
S trong (18/61,18/31], độ dời nội bộ tùy ý và khoảng trống đáy d-1>0.
Phần khoảng cách xa đã chứng minh trong TIP108B được giữ nguyên, không chạy
lại. Miền một thành phần đáy với 13 thứ tự đỉnh vẫn là nghĩa vụ riêng chưa đóng.

Phương pháp có lập luận đúng và kiểm tra thực thi cố định đạt: nếu p_j thuộc
[l_j,u_j], lõi [u_j+j*y,l_j+1+(j-1)*y] nằm trong mọi lát cắt thực khi không
rỗng. Diện tích hợp các lõi vì vậy là cận dưới đồng đều trên toàn hộp. Một lá
chỉ được đóng bằng cận 2G_core-2-S_upper>0 hoặc loại trừ toàn hộp có chứng minh.
Tất cả lựa chọn nhãn đạt độ dời nhỏ nhất trong mỗi nhóm, kể cả trường hợp trùng,
được giữ. Số học nguyên/hữu tỉ không dùng dung sai số thực để quyết định dấu.

Kết quả chạy thực tế của bộ tạo:

- Dừng vì trần **131.072 nút đã xử lý**, không phải hết 30 giây hay hết bộ nhớ.
- Thời gian nội bộ 6,212457 giây; RSS đỉnh khoảng 65,64 MiB.
- Hồ sơ báo 36.246 lá cận dương, 8.960 lá loại miền và **40.946 lá OPEN**,
  độ sâu lớn nhất 10; cả 286 gốc đã được đưa vào ngay từ đầu.
- Các số lá là metadata của bộ tạo, CHƯA được bộ kiểm độc lập chứng nhận.
  Không được quy đổi chúng thành tỷ lệ thể tích miền đã chứng minh hoặc tiến độ
  phần trăm của định lý.

Bộ kiểm độc lập nhận đúng tệp đã lưu và trả **REFUSED: INCOMPLETE is not proof**.
Nó kiểm tiếp nhận có giới hạn rồi từ chối ở trạng thái, trước khi kiểm hình học
từng lá hay tính đầy đủ toàn cây. Vì vậy không gọi đây là nghiệm thu các lá
một phần hoặc một lần phát lại đầy đủ. Mười một kiểm thử cố định đạt, bao gồm
lá giả, nhánh thiếu, dấu chia, biên miền và OPEN; chúng không thay chứng minh.

Nhận định thẳng: lượt này đem lại một phương pháp chứng nhận có cận đồng đều,
hai triển khai tách biệt và bằng chứng dừng trung thực, nhưng **không thêm một
miền toán học được chốt độc lập**. Hiệu quả số học nhanh không đồng nghĩa với
đủ độ mạnh của cận hoặc đủ phân chia để khép miền liên tục năm chiều. Trần nút
được chọn từ profile công sức, không từ một cận trên đã chứng minh cho số lá
cần thiết; lần thử cho thấy trần đã chọn chưa đủ cho chính cây này.

Chưa biết có cận dương đồng đều trên bao đóng d=1 hay cần điều khiển suy biến
theo d-1; cũng chưa có cận số lá cần thiết. Vì vậy không suy ra việc chứng minh
bất khả thi, không đổ lỗi chắc chắn cho biên d=1 và không nâng trần để tiếp tục
vét hộp. Đề xuất định tuyến tiếp theo là **phân tích cận đồng đều và mất mát lõi
trên miền/biên còn mở để tìm một bất đẳng thức ghép**, tận dụng cây đã lưu làm
chẩn đoán, không mở thêm hạ tầng hoặc gom lá rời rạc. Đề xuất chưa được thực thi;
cần định tuyến trực tiếp trước chiến dịch mới. Không tự tiếp tục cây hoặc tái
cấp phần ngân sách chưa dùng.

## English

One capped whole attempt was performed after correctness controls and explicit
replay reservation. Guaranteed slice cores provide a uniform lower area bound
on each parameter box. All 34 necessary label signatures and all 286 minimum-
anchor charts are represented, including ties. Exact dyadic midpoint trees,
integer event integration and separately authored midpoint-affine checking
avoid floating-point acceptance. None of these facts proves finite termination.

The producer stopped at its 131072 processed-node cap after 6.212457 internal
seconds, with 172018 created nodes, 36246 claimed positive leaves, 8960 claimed
domain-exclusion leaves and 40946 OPEN leaves. These are producer metadata,
not independently accepted partial proof or a measure of covered parameter
volume. The actual verifier parsed the bounded file and refused its INCOMPLETE
status before geometric/tree replay. No complete certificate exists, so R2
full replay was not performed and R1 remains open. The separate one-bottom-
component obligation also remains open.

The observed stop does not establish impossibility or exhaustion of the time/
memory envelope. The selected node cap was an effort bound, not a proven leaf-
requirement bound. Unknown uniform margin at the closed d=1 boundary and
unknown refinement complexity remain explicit. A proposed successor would
analyze the coupled defect and core-loss bounds over the remaining domain and
its boundary; it must not silently become a larger box-search campaign.
No successor, resumption, extra attempt or increased allowance is authorized.

## Evidence and actual ledger

- Method and admission: artifacts/research/tip108c/MAIN_METHOD_AND_ADMISSION.md.
- Producer controls/qualification: BUILDER_PRODUCER_CONTROLS.json and
  PRODUCER_QUALIFICATION.md in that directory; final ledger BUILDER_COMPLETION.md.
- Exact actual output: WHOLE_ATTEMPT_1.json (189812 bytes).
- Actual independent refusal: CHECKER_WHOLE_REFUSAL.json and CHECKER_REVIEW.md.
- Producer: two mathematical processes plus two ordinary AST syntax processes;
  conservative charge **10s/75s** including the one 7s whole attempt.
- Checker: three mathematical processes, conservative **0.7s/25s**; eleven
  distinct fixed tests PASS and one expected nonzero whole-file refusal.
- Main: two fresh mathematical control replays, conservative **2s/20s**.
- Total: seven mathematical processes plus two syntax processes, conservative
  **12.7s/120s**. No mathematical control failure, no reset/recycled allowance.
  NODE_CAP is an explicitly incomplete production outcome, not success.
- Scientific execution stopped before the 05:48:31 UTC hard deadline; wall
  window was 04:48:31–05:48:31 UTC. Unused effort is not permission to resume.

Output SHA256: 4bc8d5ea74e5f68411e08259002c85927cd72f85e559cd254f1202c133c5db12.
Producer SHA256: eaeae641a11be368d5f0548b98351e27017ed7163231f9e5f434ca2a4850b3ff.
Checker SHA256: 31b050be0f522e1b484a760dd74cbe4bc03efa407cdb5ffb31d1a3805b5df722.
Tests SHA256: 331e80469ca5a83d1c555fdf75e9305b15ce3a0de99990ec5d0a7175dbf85336.
Retained TIP098 helper SHA256 unchanged:
26c3b41b3bb731d67247ef1033e94ba4e0dbb0b58aa662858bafe0603596cf55.
TIP108B charter/report/Main proof pins were rechecked unchanged.

Vibecode Kit was used to separate the scoped Producer Builder from an
independently authored verifier and Main review. It did not add product gates
or infrastructure. Existing dirty research103–108b was preserved. No UI/app/
DB/auth/config/Git/API paid/runtime/build/install/Docker/project-copy/distDir
work or deletion occurred; no scratch cleanup was needed.
