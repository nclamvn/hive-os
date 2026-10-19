# Shared task and evidence packet

Viết đề xuất sơ bộ bằng tiếng Việt cho khảo sát 1.000 ha rừng bằng UAV, gồm phương
án kỹ thuật, quy trình, kiểm chứng, tiến độ và dự toán sơ bộ có căn cứ. Dữ liệu
thiếu phải nêu rõ, không tự bịa. Đầu ra giúp chủ nhiệm quyết định bước tiếp, chưa
là thiết kế bay hoặc chào giá được duyệt. Chỉ diện tích 1.000 ha là đầu vào của
người dùng. Chưa có địa điểm/AOI, địa hình/tán rừng, mục tiêu đầu ra/độ chính xác,
CRS/khống chế, điều kiện tiếp cận/quyền bay, thiết bị/nhân lực/báo giá/lịch.

Dùng tri thức chuyên môn để đề xuất có điều kiện; không viện dẫn tài liệu ngoài
gói nguồn. Không tự điền số ngày, giá, độ cao, năng suất, mật độ hay độ chính xác.
Không hỏi lại người dùng trong lượt này: ghi các yêu cầu bổ sung cần thiết.
Tối đa 1.200 từ (tách bằng khoảng trắng), gồm tài liệu tham khảo.
Trả JSON duy nhất gồm title và sections: mảng {key, body}, đúng 8 key:
need, scope, architecture, methodology, verification, plan, risk-limitations,
references. body là văn xuôi hoặc bullet text, không JSON con. Dùng [@S1], [@S2],
[@S3] ngay sau luận điểm nguồn hỗ trợ. Không chèn nhãn nhánh/phương pháp thử.
Bạn được tự kiểm tra trong một lần trả lời. Không đọc file khác, không duyệt web,
không dùng tool tính toán, không tạo agent. Chỉ dùng nội dung gói này.

## Nguồn cố định — tóm tắt phạm vi đã đọc, không phải toàn văn

S1: Gatziolis & Andersen (2008), A guide to LIDAR data acquisition and processing
for the forests of the Pacific Northwest, PNW-GTR-768, DOI 10.2737/PNW-GTR-768.
https://research.fs.usda.gov/treesearch/30652
Phạm vi: metadata/abstract cho hướng dẫn thu nhận và xử lý LiDAR trong lâm nghiệp.
Không cung cấp thông số hay bảo đảm hiệu năng tại khu rừng của nhiệm vụ này.

S2: USDA RMRS, cloud2trees project.
https://research.fs.usda.gov/rmrs/projects/cloud2trees
Phạm vi đọc: phần giới thiệu và luồng dữ liệu. Xử lý point cloud từ airborne LiDAR
hoặc UAS SfM/laser; tạo các sản phẩm như mô hình địa hình, chiều cao tán, đám mây
chuẩn hóa, đỉnh/crown cây. Không bảo đảm quan sát mặt đất dưới tán hoặc độ chính
xác mọi hiện trường; chưa chạy công cụ hay có dữ liệu cho nhiệm vụ này.

S3: USGS Lidar Base Specification 2025 rev. A, Data Processing and Handling.
https://www.usgs.gov/ngp-standards-and-specifications/lidar-base-specification-data-processing-and-handling-requirements
Phạm vi: CRS được thống nhất trước thu nhận, ghi đủ định nghĩa ngang/dọc; kiểm
chứng độ chính xác đứng tuyệt đối/tương đối và báo cáo trước phân loại/sản phẩm
dẫn xuất. Đây là chuẩn chương trình USGS 3DEP, chỉ tham khảo phương pháp ở đây,
không chứng nhận tuân thủ trọn bộ và không cấp quyền bay ở địa điểm chưa biết.

Provenance: S1/S2 abstract/project scope read in preceding UAV E2E. Fresh fetch
in this turn timed out; no new claim added. S3 relevant sections re-read this turn.
This packet is identical for both branches; source capture is not immutable.
