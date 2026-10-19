# K6 / TIP116 R5 — full-minimum gap remains open

## Tiếng Việt

**Chưa khép K6.** Không có miền đảo thứ tự đỉnh dương nào trong 12 miền
còn lại được loại toàn bộ. Đích vẫn là F6 >= 20/93 cho mọi cấu hình thực
của sáu tam giác, không phải giả thuyết Kakeya tổng quát.

Kết quả được Builder, phản biện độc lập và Main kiểm bằng tay:

- Phép co giãn đỉnh của diện tích hợp thật cho 2G = 1+r tại cực tiểu có
  đáy nối, với G=6F6. Đạo hàm bậc hai một phía giữ đầy đủ nhãn cực trị trùng.
- Đáy chỉ chạm phải giữ hai hiệu chỉnh mở khe kappa_minus/kappa_plus.
  Điều kiện nhãn của đáy nối chặt không được kéo sang biên tiếp xúc.
- Tiếp xúc đỉnh của hai hướng liên tiếp có biến đổi giảm diện tích trực tiếp.
  Đây là kiểm lại loại một mặt đã biết, không phải loại miền đảo dương.
- Cực tiểu toàn cục buộc bất đẳng thức cho MỌI vị trí thay thế của cặp:
  fplus(v)+fminus(w)-q(v,w) >= mplus+mminus. q là phần giao ngoài hợp
  bốn tam giác còn lại; không được cộng giao từng cặp để thay q.

Nghĩa vụ chính chưa đạt: phối hợp điều kiện của CẢ SÁU tam giác để tạo một
biến đổi giảm đủ diện tích vượt khoảng chắn Delta. Giá trị nhỏ nhất của
fplus(v)+fminus(v) có thể cao hơn mplus+mminus; giảm từ cấu hình chung đỉnh
không tự động đánh bại cấu hình cũ. Chưa chứng minh Delta bị vượt.

Một họ hình học chính xác chứng minh cân bằng/độ cong tại riêng cặp đảo là
không đủ. Họ đó vi phạm điều kiện cực tiểu xuyên tâm và có các đỉnh ngoài
trùng nhau; nó KHÔNG phải phản ví dụ K6 hay cực tiểu đầy đủ sáu biến.
Phản biện sửa một câu: phép tách đỉnh giảm hàm hai vị trí ngoài đường chéo,
không nhất thiết giảm hàm đường chéo phi. Lịch sử sửa được giữ.

Lượt R5 bắt đầu 13:27:32, hạn 14:27:32 ngày 12/10/2026, giờ Việt Nam.
Builder dừng suy luận mới 13:52:38, phản biện 13:52:08; Main đã chuyển
sang đọc/kiểm nội dung đã lưu sau mốc kiểm 13:52:55. Kiểm đồng hồ tiếp
theo lúc 14:40:35 thấy hạn đã qua; không mở lại nghiên cứu R5. Báo cáo
được hoàn tất sau hạn, không tính là chứng minh trong thời gian được cấp.
Chỉ đạo mới về cực tiểu toàn phần được giữ làm định tuyến cho một lượt
riêng, không tự kéo dài hay đổi giờ bắt đầu R5.

Vibecode Kit chỉ dùng cho Builder/phản biện và báo cáo có phạm vi rõ;
không thêm hạ tầng. Không chạy quá trình toán, mẫu số, tối ưu, vét miền,
API, build hay thao tác Git. Không đổi UI/code, không tạo bản sao hoặc
distDir, không xóa gì. Hồ sơ cũ và các thay đổi khác được giữ.

## English

**Global K6 remains open.** Zero of the twelve positive-inversion continua
were wholly excluded. The target remains all-real F6 >= 20/93 for six
translated triangles, not the general Kakeya conjecture.

Scoped independent hand review accepted actual radial scaling and both
one-sided bottom-contact corrections, direct adjacent-coapex descent, and
the exact all-placement two-coordinate envelope retaining outside-union
overlap q. A coapex face exclusion is re-established, not positive-inversion
closure. Necessary endpoint conditions alone fail on an exact symbolic
geometric family; that family is explicitly NOT a full six-variable minimum
or K6 counterexample.

The committed missing step is a true six-variable minimum argument yielding
an actual decrease that overcomes Delta, or a full value floor. Individual
argmin sets have not been proved to intersect. Off-diagonal descent need
not lower the diagonal function phi; the literal wording correction is
preserved. No boundary/attainment assembly is claimed complete.

R5 activation 06:27:32 UTC, hard stop 07:27:32. Builder derivation stopped
06:52:38 and critic 06:52:08. Main's next clock observation 07:40:35 was
after the cap; only saved-proof review/reporting followed. The new owner
whole-minimum routing does not retrospectively extend R5. Mathematical
subprocesses/time/failed starts: 0/0/0. No code, UI, API, Git writes, builds,
copies, distDir or deletions. AI hand review is not Lean, external refereeing,
novelty validation, or universal closure.

Proof and correction details:
[Builder](../../artifacts/research/tip116/BUILDER_GLOBAL_R5_20261012.md),
[independent critic](../../artifacts/research/tip116/CRITIC_GLOBAL_R5_20261012.md).
