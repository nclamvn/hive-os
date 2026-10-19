# TIP-077 — Đo năng lực toán học thực tế

2026-10-05. ACTUAL_CAPABILITY_PILOT_077 / CAPABILITY_EVALUATION.
**CLOSED trong phạm vi quan sát đã duyệt; không phải nghiệm thu runtime live.**

## Kết luận chính

LLM thực đã tạo sáu lời giải hoàn chỉnh cho ba bài IMO2024. Mỗi bản nộp
được hai phiên chấm mới, độc lập về ngữ cảnh, hỗ trợ qua kiểm tra các bước
thiết yếu. Nhóm trực tiếp3/3; nhóm có phương pháp3/3; chênh lệch ghép cặp0.
Không có thất bại, lượt bị loại hay bài thay thế trong mẫu số sáu nhóm.

Đây là bằng chứng tích cực về khả năng giải và phản biện của LLM kết hợp
quy trình trong phép thử này. Nó **chưa chứng minh lợi ích bổ sung về tỷ lệ
giải đúng của phương pháp**, khả năng khám phá bài toán mở, hay giá trị với
người dùng thật. Không dùng kết quả hòa để tự động mở thêm vòng thử.

Nguồn đề: [IMO2024 chính thức](https://www.imo-official.org/problems/2024/).
Đối chiếu A1/N4/C7 trong
[shortlist có lời giải](https://www.imo-official.org/assets/documents/problems/2024/IMO2024SL.pdf).
Lời giải tham khảo chỉ được lấy sau khi cả sáu bản nộp cuối đã khóa.

## Kết quả và thời gian từng nhóm

SUPPORTED nghĩa chính xác là INFORMALLY_REVIEWED_SUPPORTED,
không phải điểm IMO chính thức, chứng minh hình thức hay VERIFIED_EXACT_SCOPE.
Thời gian ngoài gồm giải, phản biện, sửa, truyền bản gốc và chờ của người điều phối.

| Bài | Trực tiếp: kết quả / thời gian ngoài | Có phương pháp: kết quả / thời gian ngoài |
| --- | --- | --- |
| P1 — tổng các phần nguyên | SUPPORTED /202.717s | SUPPORTED /202.386s |
| P2 — gcd ổn định theo số mũ | SUPPORTED /132.759s | SUPPORTED /157.039s |
| P3 — dãy đếm và chu kỳ | SUPPORTED /476.695s | SUPPORTED /445.914s |

P1: hai cách lập luận khác nhau; các bước về số âm, ranh giới của phần nguyên,
và hai chiều phân loại đều được chấm. P2: hai bản đều chứng minh tính cần và
đủ bằng chu kỳ đồng dư, xử lý ngưỡng N tùy ý và phép khử phần tử khả nghịch.
P3: cả hai bản chứng minh một bổ đề bộ đếm, không suy chu kỳ từ mô phỏng.
Bất biến giữa bộ đếm có nhãn và bộ đếm sắp thứ tự khống chế khoảng cách;
trạng thái chuẩn hóa hữu hạn với chuyển tiếp xác định suy ra chu kỳ.
Hai phiên chấm kiểm riêng các chỉ số thời gian, trường hợp hòa và bước chặn
khoảng cách; Main cũng đọc toàn bộ sáu bản cuối sau khi khóa.

Đây là lời giải cho các bài đã công bố, không phải định lý mới. Không có
bất đồng giữa hai phiên chấm; không sửa bản nộp sau khi có điểm.

## Chi phí quan sát được

| Thành phần | Trực tiếp | Có phương pháp | Chấm chung |
| --- | ---: | ---: | ---: |
| Yêu cầu / phiên mới |9|9|6|
| Token đầu vào, gồm phần cache |185059|164678|96552|
| Token đầu vào cache |139520|120448|64000|
| Token đầu ra theo CLI |33764|34139|14982|
| Token reasoning theo CLI |22951|21504|9453|
| Tổng thời gian các phiên |713.686s|688.537s|316.794s|
| Lệnh tính toán quan sát |2|1|0|

Toàn bộ:24 yêu cầu,24 thread IDs khác nhau;446289 input,323968 cached input,
82885 output,53908 reasoning theo telemetry CLI. Giữ riêng các trường,
không cộng reasoning vào output để tạo một tổng token giả định.

Các tổng này chỉ đo24 phiên toán/chấm của thí nghiệm. Token/công sức của
Main điều phối, đọc hồ sơ, lập báo cáo và các lượt hỗ trợ kỹ thuật viết/kiểm
bộ thu chưa có telemetry tương đương: UNKNOWN, không coi là miễn phí. Chúng
không giải bài, không được đọc output toán trước khi khóa; thời gian chuẩn bị
và kiểm kỹ thuật vẫn nằm trong đồng hồ90phút.

Nhóm có phương pháp dùng ít hơn11.0% input nhưng nhiều hơn1.1% output;
tổng thời gian phiên ít hơn3.5%. Đây là mô tả mẫu nhỏ, không phải ước tính
tiết kiệm tiền hay ưu thế tính toán. Cache, chờ mạng, cách điều phối và
độ ngẫu nhiên chưa được tách riêng. Input không cache lần lượt45539/44230.
Phương pháp chậm hơn ở P2, nhanh hơn ở P3: không có ưu thế đồng đều.

Tổng thời gian phiên1719.016s không bằng toàn bộ thời gian nghiên cứu.
Đồng hồ cohort bắt đầu15:50:53Z; model cuối kết thúc16:39:27.884Z,
tức48m34.884s gồm chuẩn bị và điều phối. Đóng báo cáo trong trần90phút.
Mỗi nhóm dùng3/4 slot; mỗi cặp dùng2/2 slot chấm, thời gian lần lượt
95.781s/52.636s/224.742s, đều dưới480s. Không tăng trần hay gọi thêm để sửa điểm.

Ba lệnh Python chỉ tính trong bộ nhớ, đều thoát0, tổng1.363s. Trực tiếp P3
có mô phỏng dãy và kiểm bất biến có seed; nhóm phương pháp có chẩn đoán
ngẫu nhiên không seed. Các phép hữu hạn này hỗ trợ tìm ý, **không phải chứng minh**.
Không có lệnh tính toán ở bốn nhóm P1/P2 hoặc sáu lượt chấm.

## Thiết kế, tính toàn vẹn và giới hạn

- Cùng cấu hình gpt-6.1-sol/high/priority, CLI0.160.0, tài khoản ChatGPT có sẵn.
  Không API key/fallback tính phí. Chi phí tiền thực và phiên bản model được
  phục vụ, số cuộc gọi nội bộ: UNKNOWN; sử dụng hạn mức đăng ký là có thật.
- Đề/công thức được kiểm bằng ảnh PDF gốc; registration/policy/template khóa
  trước suy luận. Mỗi nhóm có ba phiên mới attempt→critic→final; critic và
  final chỉ nhận bản gốc cùng nhóm. Main không đưa gợi ý hoặc chọn lời giải.
- Thứ tự giữ nguyên P1direct→method, P2method→direct, P3direct→method.
  Baseline được tự chọn chiến thuật và có cùng vòng phản biện/sửa, không bị
  cố tình làm yếu. Nhóm phương pháp nhận thêm giao thức độc lập với bài.
- Hai lượt chấm mỗi cặp được giấu nhãn nhóm X/Y; lượt2 nhận ghi chú nguồn
  đã khóa, không nhận điểm lượt1. Văn phong gốc có thể lộ chiến thuật, nên
  không hứa ẩn danh tuyệt đối. Các reviewers dùng cùng model, không phải
  hội đồng người thật hoặc kiểm chứng đa model/hình thức.
- Kiểm72 SHA của bản cuối/raw trace/stderr trước và sau lưu bền:0 sai lệch.
  Raw receipt CAPTURED_ORIGINAL_UNGRADED giữ nguyên; điểm sau đó lưu riêng.
  Tổng bản tạm+lưu bền dưới4MiB tại lúc đóng, dưới trần10MiB.
- Giữ lỗi DNS tải nguồn ban đầu và QA giả của bộ thu riêng, không tính chúng
  thành kết quả model. Lỗi xử lý signal/startup được sửa và kiểm trước inference.
  Không có model request thất bại/hủy trong24 lượt thực.
- Một thiếu sót điều phối được giữ trong integrity-audit.json: hạn mức nhập
  bằng tay cho P1_DIRECT_FINAL có thể kéo dài deadline2.5s. Bản thực kết thúc
  trước deadline gốc397.283s, nên không có vượt thời gian thực. Các lượt sau
  trừ buffer chuẩn bị. Không tuyên bố cơ chế timer là trần OS/server cứng.
- Đề công khai; khả năng đã xuất hiện trong dữ liệu học/lịch sử: UNKNOWN.
  Ba bài, một lần mỗi nhóm, không có ý nghĩa thống kê về ưu thế quần thể.
  Equal observable opportunity không đồng nghĩa verified equal total compute;
  tách thư mục và chỉ dẫn không phải sandbox filesystem đã được chứng minh.

## Bằng chứng lưu bền và nghĩa vụ đóng

[Metrics](../../artifacts/tip077-actual-pilot-NqivSV/metrics.json),
[ledger24lượt](../../artifacts/tip077-actual-pilot-NqivSV/request-ledger.json),
[hồ sơ gốc](../../artifacts/tip077-actual-pilot-NqivSV/README.md).
Mỗi thư mục session có prompt nguồn, nguyên văn output, JSONL, receipt và SHA.
QA fake-* được phân biệt rõ, không nằm trong mẫu số đo thật.

| Nghĩa vụ | Trạng thái trong phạm vi TIP-077 |
| --- | --- |
| M1 đề/policy/approval trước inference | CLOSED |
| M2 sáu nhóm khác policy, ngữ cảnh mới, giữ mẫu số | CLOSED |
| M3 không mô phỏng thành live/không giả usage/certificate | CLOSED |
| M4 bản gốc + hai phản biện độc lập + đối chiếu nguồn | CLOSED_INFORMAL_ONLY |
| M5 báo đủ sáu kết quả/chi phí/các giới hạn | CLOSED |
| M6 dừng đúng cohort, giữ lịch sử, không mở chiến dịch mới | CLOSED |

Phần chưa được thiết lập: hiệu quả gia tăng trên bài mới, runtime live của
HIVE OS, giá trị với người dùng thật, kiểm chứng hình thức và khả năng bài toán
mở. TIP-076 engineering không đổi; LRCp139 G/C/T/B vẫn OPEN0/4. Không đọc/replay
grant hay attempt lịch sử, không ghi user DB, sửa product/schema, Git, deploy
hoặc billing trong bước này.

**STOP.** Thay đổi ưu tiên tiếp theo, nếu chủ dự án duyệt: một phép thử
held-out mù có đối chứng trên bài chưa công bố, được chuyên gia chuẩn bị
đáp án/rubric và kiểm chứng ngoài model. Chưa mở rộng runtime hoặc chạy lại
LRC chỉ từ kết quả hòa này; không tự động triển khai đề xuất sau khi đóng.
