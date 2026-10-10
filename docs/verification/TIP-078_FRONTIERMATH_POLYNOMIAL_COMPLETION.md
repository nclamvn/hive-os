# TIP-078 — Đối chứng công khai FrontierMath: đa thức bậc19

2026-10-06. Root FM_POLY19_078. **CLOSED_OBSERVATIONAL**; dừng sau đúng một
lượt đã duyệt. Không mở chiến dịch khác, không sửa sản phẩm, không commit/push.

## Kết quả trước tiên

Đối chứng DIRECT1/1 và quy trình METHOD1/1 đều đạt chứng chỉ đại số chính xác;
hai phản biện ở ngữ cảnh mới đều ghi INFORMALLY_REVIEWED_SUPPORTED cho cả hai.
Chênh lệch tỷ lệ giải đạt quan sát được: **0**, không có bằng chứng ưu thế phương
pháp từ phép đo này. Hai bản xây cùng đa thức nhưng trình bày chứng minh khác nhau.

Đề: “Find the degree 19 polynomial”, mẫu Tier2 công khai của
[Epoch AI](https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems), truy cập
2026-10-06; ghi nguồn Epoch AI, CC-BY. Đây không phải bộ FrontierMath kín, điểm
chính thức, bài chưa từng có trong huấn luyện hay phát hiện toán học mới.
Main đã thấy lời giải tham khảo trước thiết kế; điều này được công khai trước
lượt giải. Hai nhóm chỉ nhận đề, định dạng/ràng buộc chung và chính sách riêng.

Ràng buộc hệ số nguyên là **bổ sung** so với hệ số thực của đề gốc, không phải
chỉ định dạng trung lập. Hai nhóm nhận cùng ràng buộc. Bộ kiểm chỉ hỗ trợ một
họ chứng chỉ; ngoài miền/họ đó là INCONCLUSIVE, không tự động là lời giải sai.

## Cấu trúc được kiểm

Hai bản chọn D19, với D0=2, D1=x, Dn=x*D(n-1)-D(n-2), và hệ số tăng dần:

    [0,-19,0,285,0,-1254,0,2508,0,-2717,0,1729,0,-665,0,152,0,-19,0,1]

Giá trị được phát lại từ hệ số, không bảng đáp án:

    p(19) = 1876572071974094803391179

Máy kiểm đủ đồng nhất thức p(x)-p(y)=(x-y)*product(Qk) trong Z[z]/Phi19,
không lấy mẫu hữu hạn hay chỉ so thương số. Mỗi lượt95721 phép toán chính xác;
hai tiến trình độc lập từ hai bản cuối lần lượt0.069479s và0.066236s, exit0.
Phần đại số nội bộ0.017664s/0.017366s. CandidateSHA của cả hai
ea4237d1e2071f9114f572e1c37a98290aa43f1d868863bb66d58dbe49732fac.

Bổ đề viết rõ về biệt thức, Gauss, các nhân tử phân biệt và đóng xạ ảnh cho
**10 thành phần bất khả quy,9 không tuyến tính**. Hai chứng minh tự cung cấp
đồng nhất thức Laurent, tính đơn ánh phép thế, bất khả quy, và kiểm điểm vô cực.
Máy xác minh đồng nhất thức hữu hạn; cầu nối hình học dùng bổ đề tin cậy đã nêu
trong docs/research/FRONTIERMATH_POLY19_CERTIFICATE.md. Không gọi là Lean/formal
foundational proof hay bộ kiểm chính thức của Epoch.

## Luồng thực tế và các giới hạn

PreregistrationSHA8df6e773c3c3ff4a934c8f0219cb73776336d54d23142ca90b7cf23a2c19af49.
CharterSHAaa445b5076ae48dad3d56617ee4b8b5d15a45d741a9767fb3a314fef72d64e1e.
Cầu nốiSHA06f6310ae7e6a65779341a9f257d528ba0c6f9af88e008d253442552c40fa7ef.

Admission01:51:57Z; phiên đầu01:52:47.962547Z; phiên cuối02:01:09.011605Z.
Lượt kết thúc sau552.028s từ admission, dưới45phút. Đúng8 phiên mới/8 threadID:
DIRECT attempt→critic→final, METHOD attempt→critic→final, rồi hai postreviews.
Tất cả exit0, nguyên bản được giữ;0 lỗi,0 hủy,0 đổi bài,0 sửa sau chấm.
Thứ tự DIRECT trước METHOD cố định, không ngẫu nhiên/counterbalanced.

Hai bản cuối đều khóa trước trích JSON, phát lại hoặc chấm. Trích đúng một khối
JSON nguyên byte, không đoán/sửa/chuẩn hóa đáp án. X=METHOD,Y=DIRECT; reviewer1
không tham khảo, reviewer2 chỉ có cầu nối toán học đã khóa, không có phán quyết
reviewer1. Không có tham khảo/checker/họ nhân tử truyền vào nhóm giải.

| Nhóm | Phiên | Thời gian phiên cộng | Thời gian ngoài cả nhóm | Lệnh quan sát | Input / output tokens CLI |
|---|---:|---:|---:|---:|---:|
| DIRECT |3|219.048s|219.738s|5|124169 /12481|
| METHOD |3|195.420s|195.902s|3|91686 /11046|
| Postreview |2|84.586s|85.085s|1|72756 /4442|

Mỗi nhóm<600s; cả hai postreviews<480s. Trace từng nhóm21622/20918bytes,
postreviews10542bytes, đều<512KiB. Cached-input/reasoning-output rawfields lưu
riêng trong metrics và receipt; không giả định bao hàm, không quy thành phí.
Thời gian nhận event công cụ không phải thời gian CPU; giới hạn công cụ là
giám sát quan sát được, không bảo đảm OS-hard CPU/filesystem/memory confinement.
Actual per-command compute duration, hidden calls, served model version,
training exposure, chi phí tiền và tokens Main/engineering: **UNKNOWN**.
Ít input/time trong một cặp không chứng minh hiệu quả kinh tế hoặc quan hệ nhân quả.

CLI0.160.0, đăng nhập ChatGPT sẵn có; gpt-6.1-sol/high/priority giữ như cấu hình
đã xác nhận. Môi trường khóa API không truyền cho phiên con; không dùng API trả
phí, không đổi model/cài đặt. Parent được cho phép truy cập dịch vụ; mỗi phiên
con dùng sandbox read-only, cwd riêng trống, ephemeral/ignore-user-config/JSONL.
Không tuyên bố đây là cách ly chống tấn công đầy đủ hoặc chứng minh mô hình đã
phục vụ chính xác một phiên bản backend cụ thể.

## Một bất nhất tự báo cáo phải giữ lại

Reviewer1 viết đã dùng một lệnh tính toán. Raw trace có0 command_execution và
receipt ghi0 lệnh; không có bằng chứng công cụ tương ứng. Ghi
MODEL_TOOL_SELF_REPORT_UNCORROBORATED, không sửa nguyên bản hoặc cộng một phép
tính tưởng tượng. Grade vẫn là nhận xét toán học informal của reviewer, không
chứng chỉ máy. Reviewer2 có1 lệnh được quan sát; hai exact replays tách riêng
mới là bằng chứng máy cho đại số. Không tạo thêm request để sửa bất nhất.

Điều này cho thấy phải dựa vào telemetry gốc thay vì văn xuôi của AI. Không biến
hai phản biện cùng model thành bảo đảm độc lập từ con người/đa mô hình.

## QA, bằng chứng và phạm vi thay đổi

Main đọc đầy đủ verifier/tests/helpers, chạy độc lập18/18 verifier tests PASS
0.425s và29/29 transport tests PASS1.339s, mỗi tiến trình dưới30s. Các positive
controls được sinh bằng recurrence chỉ là ENGINEERING_ONLY, không kết quả giải
mới. Kiểm âm giữ nguyên p(19) nhưng sửa hệ số vẫn không đạt factor certificate.
Có kiểm duplicate/bool/float/oversize/symlink/FIFO/domain/time/operation bounds,
đường argparse thật, khóa hai finals, truyền quota còn lại, no-resume/no-retry,
và hủy capture bằng executable giả, không gọi model để QA.

VerifierSHA38f59143ce544d77d84dbd43f590ef070f099018a32b13d2a81abf8ccbeec84a.
TestSHAe2dacdff3442891122b914b006b65cbcd227cdb9adeb9d095e8d744b6826bfce.
Nguồn controller/helpers được pin trước inference; xem registration và Builder
report. Main kiểm24 hash original/trace/stderr khớp receipt; toàn bộ cây source
và evidence khớp byte trước/sau chép bền vững, trước thêm tài liệu closure.

Bằng chứng: artifacts/tip078-frontiermath-poly19-9OftkW. Có registration,
source/policies/exposure,8 raw traces/receipt/originals, prompt projection pins,
controller events,2 exact replay inputs/results và metrics.json. Bản tạm còn
giữ nguyên tại /private/tmp/hiveos-tip078-poly19-9OftkW. Không restart controller;
nguồn archive giữ đường dẫn gốc để audit, không được gọi là grant chạy lại.

Chỉ thêm verifier Python-stdlib/tests và hồ sơ nghiên cứu. Không sửa Next/UI,
product runtime/provider integration/schema/userDB, Git/deploy/billing. Không
đụng grant/attempt5/source37/pins hoặc chạy lại LRC. HEAD vẫn4d10822; toàn bộ
thay đổi có trước trong worktree được giữ nguyên. TIP076/077 và báo cáo đóng cũ
không bị viết lại.

## Nghiệm thu và STOP

R1 nguồn/exposure/phê duyệt rõ; R2 verifier giới hạn/không execute candidate;
R3 exact identity+cầu nối viết rõ; R4 controls/QA thật; R5 preregistration và
đúng lượt actual-model: đạt trong phạm vi công khai quan sát được.

Milestone đạt: giải và kiểm một mẫu đại số/hình học công khai bằng8 phiên thực
và phát lại exact, không chỉ dựng UI/mock scalar. Nhưng chưa chứng minh ưu thế
phương pháp, khả năng chưa gặp đề, nghiên cứu đột phá, giá trị người dùng, hoặc
tự trị E2E của chính runtime HIVE OS. Official FrontierMath/privateheldout/Lean/
prototype runtime E2E: NOT_RUN. Bài công khai có thể đã nằm trong huấn luyện.

STOP sau lượt này. Nếu đo lợi thế tổng quát, bước sau cần cohort nhiều bài đủ
khó, định tuyến/phê duyệt tài nguyên riêng và, lý tưởng, đề/rubric chưa công bố
do nguồn độc lập nắm giữ. Không tự mở lượt tiếp hoặc tái gọi một bài đã giải.
