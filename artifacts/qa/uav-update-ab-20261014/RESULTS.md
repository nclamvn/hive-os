# UAV update A/B — kết quả đối chứng thăm dò

Ngày 14-10-2026. Một cặp chạy, sáu tình huống độc lập trên cùng hồ sơ nền;
không phải sáu mẫu độc lập, benchmark kín hoặc đánh giá năng lực chuyên gia UAV.
Hai nhánh dùng cùng model Codex kế thừa, không override, không API trả phí.
Không có telemetry để khẳng định tên model chính xác, số token hoặc chi phí bằng nhau.

## Kết quả chính

| Tình huống | A: LLM + công cụ thông thường | B: LLM + bộ kiểm HIVE | Bằng chứng chính |
|---|---|---|---|
| S1 Địa hình dưới tán | PASS | PASS | Phương án LiDAR có điều kiện; cần thử/quan sát đất; không bảo đảm phù hợp |
| S2 Diện tích đổi | PASS | PASS | 1.200 ha là hiện tại; 1.000 ha chỉ lịch sử; không suy diễn lịch/tiền |
| S3 Báo giá gộp tổ bay | PASS | PASS | 100 triệu + 5 triệu = 105 triệu trước thuế; loại 10 triệu tổ bay trùng |
| S4 Khác đơn vị diện tích | PASS | PASS | 1.000 ha = 10 km²; tổng phụ 105 triệu trước thuế |
| S5 Thiếu giá/thuế | PASS | PASS | Đơn giá và tổng null; 5 triệu chỉ là phần QA; không tự gán VAT |
| S6 Pilot không đạt | PASS | PASS | 32 cm = 0,32 m > 0,20 m; sửa/thử lại, không mở rộng/nhận đạt |

Đánh giá nội dung do Main thực hiện, **không mù**, theo EXPECTED.md đã khóa trước
khi sinh đầu ra. Đọc toàn bộ phần sửa của cả12 gói; kiểm số độc lập bằng phép tính
trực tiếp, kiểm schema/khớp oldBody/khóa mục, và kiểm B qua UI. Không dùng điểm
biên tập của ứng dụng để chấm chất lượng. Không sửa nội dung sau khi nộp để đạt điểm.
Nguồn tham khảo được giữ từ gói chung, không được xác minh toàn văn lại.

## Thời gian và can thiệp

- A: từ dispatch02:38:51 đến process log02:45:51 UTC: khoảng420giây.
  Báo cáo arm ghi399giây từ lần đọc đồng hồ đầu tiên02:39:12; không nhầm với
  dispatch-to-log. Một yêu cầu giải; tự kiểm bằng Node/shell, rút ngắn văn bản.
- B: từ dispatch02:44:08 đến log02:48:46: khoảng278giây. Một yêu cầu giải;
  thêm một trao đổi sửa đường dẫn dependency, không gợi ý đáp án. Chạy helper thật
  cho6 gói; không có lỗi nội dung cần sửa. Lỗi tsx IPC được xử lý bằng cách đổi
  cách gọi runtime, không đổi checker/đầu ra. PROCESS.md ghi tool use chi tiết.
- Cả hai dưới600giây; không buộc thêm phản biện. Implementation/UI/QA không được
  tính vào thời gian solver; tổng công sức sản phẩm cao hơn một lượt sinh văn bản.
- B nhanh hơn khoảng34% trong **lượt quan sát này**, nhưng không suy ra lợi ích
  nhân quả hoặc tiết kiệm thời gian người dùng. Thứ tự chạy, độ dài văn bản,
  độ trễ, tự kiểm và compute không được kiểm soát đầy đủ. Thời gian sửa của
  người thật và mức tiết kiệm30% vẫn CHƯA ĐO.
- A có rút gọn bản trung gian nhưng chỉ giữ bản cuối; không có đủ bản trung gian
  riêng để kiểm toán từng thay đổi. Vì vậy không dùng số lượt sửa làm bằng chứng
  so sánh. B giữ nguyên ứng viên đầu tiên. Tool-call count A không xác minh đầy đủ.

## Giá trị chứng minh được và chưa chứng minh được

**Chưa chứng minh HIVE tạo nội dung tốt hơn LLM thuần**: cả hai đạt6/6 nghĩa vụ,
không có lỗi nghiêm trọng phân biệt hai nhánh, B không cần checker để sửa lỗi.
Không đổi bài, chạy lại để thắng hoặc dùng lỗi QA cố ý làm bằng chứng A/B.

Giá trị vận hành đã quan sát: nhập một gói thay đổi, xem trước các mục trước/sau,
kiểm số khai báo, từ chối tổng sai/gói cũ, áp dụng4 mục S3 cùng lúc, giữ nguồn và
các mục không sửa, lưu revision với phụ lục và xuất DOCX/PDF. Đây là hỗ trợ
cập nhật có kiểm soát, **không phải AI tự trị**: vẫn có cầu nối JSON thủ công.

Thao tác cốt lõi cho một gói đã có: nhập yêu cầu + nhập gói (2 thao tác nhập),
Check/Apply/Save (3 nút), chưa tính đọc/xem trước, mở panel, chuẩn bị/người chuyển
ngữ cảnh, QA hoặc xuất file. Chưa đo đối chứng thao tác A trên trình soạn thảo;
không tuyên bố ít hơn bao nhiêu thao tác/thời gian con người.

## Hạn chế sản phẩm phát hiện trong E2E

- Checker chỉ kiểm các số có cấu trúc, không tự chứng minh toàn văn khớp chúng,
  không xác minh đầu vào thực địa, báo giá, hiệu lực hoặc quyền triển khai.
- Sau S3, bộ biên tập hiện có vẫn báo10 cảnh báo nguồn không chặn (50/100), gồm
  dữ liệu giả lập/phép tính và JSON phụ lục. Không nới regex theo fixture để làm
  đẹp điểm. Giữ cảnh báo, ghi rõ giới hạn; số50 không phủ định các phép tính đúng.
- Phụ lục JSON đầy đủ giúp truy vết nhưng chưa phải bản trình bày khách hàng tối ưu.
- Font PDF thiếu mũi tên/comparator được phát hiện khi render, xử lý bằng fallback
  ASCII chỉ ở lớp xuất; không sửa nguồn lưu, output A/B hoặc bản Word.

Kết luận đầu tư: giữ tính năng nhỏ này như công cụ quản lý cập nhật và kiểm tra
cụ thể; chưa dùng lượt thử để quảng bá “thông minh hơn LLM” hoặc mở rộng bầy agent.
Nếu tiếp tục đo hiệu quả, mục tiêu đúng là thời gian/độ lỗi của người dùng thật
trên hồ sơ thay đổi nhiều vòng, thay vì lặp lại bài tính mà cả hai đã làm đúng.
Không tự mở phép đo mới trong task này.

## Deliverable

Hồ sơ TEST: http://localhost:3000/w/mathematics-pilot-lab-156de0/authoring/de904436-34b1-4d1f-a7e6-a9b671a04c20

S3 đã được chọn để lưu/xuất trước khi biết kết quả. Toàn bộ số liệu bổ sung đều
ghi rõ giả lập. Hồ sơ UAV gốc không bị sửa. Không deploy, không commit/push trong task.
