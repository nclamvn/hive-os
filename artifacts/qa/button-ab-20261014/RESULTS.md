# Kết quả: nút thao tác và A/B đề xuất UAV

Ngày 14-10-2026. Không API trả phí, không deploy, không commit/push trong lượt này.

## Kết luận chính

**Chưa chứng minh được lợi thế chất lượng nội dung của HIVE so với một lượt LLM
thuần trên đề này.** Chấm ẩn nhãn bằng một ngữ cảnh model mới: cả hai 18/20,
không phát hiện lỗi nghiêm trọng trong phạm vi gói nguồn. Đây là một thử nghiệm
thăm dò trên một đề, không phải chứng nhận kỹ thuật, benchmark hay thống kê năng lực.

| Chỉ số | A: LLM một lượt | B: HIVE có Codex vận hành |
|---|---|---|
| Model | Cùng model kế thừa; không override | Cùng model kế thừa; không override |
| Lượt model tạo nội dung | 1 | 3: soạn, phản biện, sửa |
| Thời gian tới đầu ra cuối | Khoảng104giây | Khoảng181giây; tới lưu UI≤203giây |
| Độ dài gồm tiêu đề | 965 từ tách khoảng trắng | 964 từ tách khoảng trắng |
| Điểm rubric ẩn nhãn | 18/20 | 18/20 |
| Lỗi nghiêm trọng được phát hiện | 0 | 0 |
| Phạm vi nguồn | Cùng3 bản tóm tắt | Cùng3 bản tóm tắt |

Không có telemetry token/cost hoặc model-ID chính xác nên không gọi đây là thử
GPT-6, không tính tỷ lệ hiệu quả trên token. Cùng trần600giây nhưng khác số lượt
model, không phải đối chứng cùng compute. Thời gian là elapsed có điều phối, không
phải độ trễ API. Chấm điểm thêm66giây nằm ngoài cả hai ngân sách giải.

## Khác biệt có bằng chứng

- B rõ hơn ở điều kiện mở rộng: “Không bay khi thiếu điều kiện; không mở rộng khi
  thử không đạt.” A có quyết định tiếp tục/điều chỉnh/dừng nhưng chưa gắn điều kiện
  này rõ bằng B. Rubric mục4: A1, B2.
- A cụ thể hơn ở dự toán: “Ngày công, ngày thuê thiết bị...” và “Tránh tính trùng
  thuê máy/người vận hành”. B mới quy định khối lượng×đơn giá chung, chưa rõ đơn vị.
  Rubric mục7: A2, B1.
- Cả hai thiếu gắn từng nhóm thông tin còn thiếu với người cung cấp/xác nhận cụ
  thể; nêu vai trò chung chưa đủ. Mục2 cùng1. Các mục còn lại cùng2.
- Phản biện B không nhận ra khoảng trống phân trách nhiệm/đơn vị này. Bản sửa cuối
  chỉ chỉnh dấu câu/diễn đạt, không thêm bằng chứng hay năng lực kỹ thuật.

Contractor đã đối chiếu các trích dẫn với hai JSON cuối và kiểm phép cộng18/20.
Khoảng cách A ở mục4 có thể được người chấm khác cho thêm1 điểm vì điều kiện có
thể hiểu ngầm từ các phần liên quan. Cách chấm đó vẫn không đổi kết luận “chưa có
lợi thế rõ ràng” theo ngưỡng3 điểm khóa trước. Không nâng điểm hoặc chạy lại.

## Giá trị và điểm yếu thực tế của ứng dụng

Đã xác nhận trên trình duyệt: tiếp nhận bản soạn8 mục, khai báo3 citation, giữ
bản nháp và bản sửa thành revision2/3, hiển thị lịch sử thay đổi, cho phép xuất khi
hết blocker. Cả8 trường nội dung UI khớp nguyên văn B_FINAL.json. Hồ sơ cũ không
bị sửa. Đây là giá trị quản lý tài liệu có bằng chứng, **chưa đo được lợi ích tiết
kiệm thời gian cộng tác**, và không phải tự động gọi worker hay nghiên cứu tự trị.

Một điểm yếu cần ưu tiên sửa sau phép đo: điểm biên tập tăng26→90 chủ yếu do thay
ba dấu em dash và diễn đạt. Bộ kiểm tra vẫn báo nhầm “tuyệt đối và tương đối” trong
thuật ngữ độ chính xác, và đòi citation cho diện tích do người dùng cung cấp. Không
dùng90/100 làm điểm chuyên môn; không bịa nguồn hoặc xóa thuật ngữ đúng để đạt100.
Trong lượt này không thay checker khi đang đo để tránh làm lệch phép thử.

## Quyết định sản phẩm nên rút ra

Giữ solver chính làm mặc định. Phản biện chỉ đáng dùng khi có thiếu hụt cụ thể,
rủi ro cao hoặc bằng chứng cần đối chiếu; không mặc định ba lượt cho mọi đề xuất.
Ưu tiên giảm false positive và tách cảnh báo văn phong khỏi lỗi chặn phát hành,
không xây thêm gate/bầy agent. Giữ citation, phiên bản và xuất tài liệu như tính
năng quản lý công việc, không quảng bá chúng thành năng lực suy luận vượt LLM.
Lượt thử này không đủ kết luận toàn dự án vô ích hay phản biện không bao giờ có ích.

## Giới hạn cần giữ khi chia sẻ

- Một đề sơ bộ khá thuận lợi với LLM mạnh, chưa có dữ liệu hiện trường để kiểm
  sai số hoặc so sánh phương án bằng tính toán; có thể có hiệu ứng gần trần.
- Model chấm điểm cùng dòng mô hình, ngữ cảnh riêng và nhãnX/Y ngẫu nhiên; không
  phải chuyên gia UAV độc lập. Không có đánh giá con người ngoài nhóm.
- Cùng format8 mục và gói nguồn được tuyển sẵn giúp cả hai; A là LLM thuần có
  brief tốt, không phải chatbot chỉ nhận một câu mơ hồ. Không cố tình làm yếu A.
- S1/S2 dùng phạm vi đã đọc ở E2E trước; fetch mới timeout. S3 đọc lại thành công.
  Không tuyên bố đã kiểm tra toàn văn nguồn hoặc capture bất biến.
- A được tự sửa file trung gian trong cùng lượt trước khi hoàn tất. Một thông báo
  điều phối về transport đến sau sửa đã được ghi trong RUN_LOG; không có gợi ý
  sửa nội dung và không chạy lượt thứ hai. Chỉ đầu ra cuối được chấm.
- Kết quả không chứng minh quy trình gốc HIVE tự chạy model: Codex điều phối và
  nhập dữ liệu qua UI theo ủy quyền, không gọi API trả phí.

## UI và kiểm thử code

Nhóm Gửi rà soát/Chặn đã đồng nhất chiều rộng, cao40px, giữ primary/secondary.
VN/EN ở390px và1440px đạt kiểm geometry, không cắt chữ; keyboard focus còn rõ.
28/28 unit, typecheck, scoped lint, diff check pass. Không fullbuild trong đợt sửa
trình bày nhỏ. Không thêm dependency/distDir/temp copy, không xóa dữ liệu.
Vibecode tách Builder/Contractor; frontend-design giữ nhịp nút hiện hữu thay vì
thay đổi nhận diện toàn ứng dụng. Xem BUTTON_COMPLETION.md để biết giới hạn QA.

## Hồ sơ và bằng chứng

- UI: http://localhost:3000/w/mathematics-pilot-lab-156de0/authoring/5f672414-4a3e-4910-817e-87d8235a4441
- A_FINAL.json / B_DRAFT.json / REVIEW.json / B_FINAL.json: toàn bộ đầu ra.
- AB_PROTOCOL.md / COMMON_INPUT.md: thiết kế và đầu vào khóa trước.
- JUDGE_RUBRIC.md / CANDIDATE_X.json / CANDIDATE_Y.json / JUDGMENT.json: chấm ẩn nhãn.
- RUN_LOG.md: thời gian, phân nhánh, hashes, quy trình UI và giới hạn telemetry.
- buttons-desktop.jpg / b-draft-ui.jpg / b-final-ui.jpg / b-final-content.jpg.
