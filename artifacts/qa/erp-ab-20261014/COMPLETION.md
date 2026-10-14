# Kết thúc phép đo A/B — LACAHSA ERP

Ngày chạy: 2026-10-14. Đây là phép đo công khai, một ca, không mù; không phải
benchmark chính thức, không phải tuyên bố nhân quả và không phải hồ sơ nộp thầu.

## Câu hỏi

Với cùng gói tài liệu ERP công khai và cùng mô hình Codex theo gói đăng ký,
quy trình HIVE gọn (soạn, rà đúng khoảng trống, cập nhật có revision) có tạo đầu
ra nội dung tốt hơn một lượt LLM thuần không?

## Thiết kế đã giữ

- Cùng mô hình/cài đặt kế thừa, cùng gói nguồn, hai checkpoint nguồn; tối đa
  600 giây cho mỗi checkpoint và tối đa hai prompt/checkpoint.
- Nhánh A dùng LLM cùng model với công cụ đọc tệp/tính toán bình thường. Nội
  dung A được khóa trước khi chỉ được nhập vào UI HIVE để hiển thị; A không nhận
  phản hồi hay điểm từ HIVE trong lúc tạo nội dung.
- Nhánh B dùng lõi sẵn có: revision, preview gói cập nhật, kiểm preimage/schema
  và phản hồi trên UI. Helper chỉ kiểm cấu trúc gói và revision, không có đáp án
  hay năng lực đánh giá nguồn.
- Không gọi API trả phí, không gửi/nộp/liên hệ bên ngoài và không triển khai.

Chi tiết đầy đủ ở `PROTOCOL.md`; nguồn và giới hạn của chúng ở
`SOURCE_INTAKE.md`.

## Kết quả

| Chỉ số đã đóng trước | A — LLM thuần | B — HIVE lõi gọn |
| --- | ---: | ---: |
| Điểm rubric không mù (tối đa 40) | 37 | 34 |
| Bịa khẳng định quan trọng | 0 | 0 |
| Cập nhật lịch Addendum 3 | Có | Có |
| Nhận ra xung đột portal/Addendum | Có | Có |
| Chứng minh lợi thế chất lượng nội dung | Không | Không |

A nhỉnh hơn ở ngữ cảnh vận hành hiện tại (EisnerAmper/Sage, đối soát thủ công
Sage–Neighborly, công thức TCO). B không chứng minh được lợi thế nội dung; chênh
ba điểm là mô tả một ca, không được diễn giải là khác biệt nhân quả.

## Điều HIVE đã chứng minh được trong lượt này

Các lợi thế quan sát được thuộc về vận hành hiện vật, không phải “giải hay hơn”:

1. Chuỗi revision bất biến cho baseline và cập nhật;
2. Xem trước thay đổi bốn phần trước khi áp dụng;
3. Gắn catalogue nguồn và xuất DOCX/PDF từ revision đã lưu;
4. Từ chối gói cập nhật cũ có `baseRevision=2` sau khi tài liệu đã ở revision 3
   với thông báo **“Sai tài liệu hoặc phiên bản gốc.”**. Điều này ngăn ghi đè
   lặng lẽ.

Hai xuất DOCX/PDF của nhánh B trả HTTP 200 trong phiên E2E. Màn hình từ chối
revision cũ được lưu tại `B-stale-rejection.png`.

## Điều chưa đạt và khuyến nghị

Không nên quảng bá HIVE là model giải/sáng tác tốt hơn LLM thuần từ phép đo này.
Bộ kiểm tra hiện vẫn sinh cảnh báo heuristic sai hoặc quá rộng (đặc biệt nhận
diện citation/số liệu); đó là nợ sản phẩm nhìn thấy được. Không có telemetry
thời gian thao tác con người hoặc token đáng tin nên không được tuyên bố tiết
kiệm thời gian/chi phí.

Bước đo giá trị tiếp theo nên là một holdout mù nhiều hồ sơ có rubric chuyên gia
đóng trước, hoặc một thử nghiệm operator thực đo thời gian, tỷ lệ bỏ sót và khả
năng truy vết. Giữ lõi hiện tại; không mở rộng thêm agent/gate trước khi có bằng
chứng đó.
