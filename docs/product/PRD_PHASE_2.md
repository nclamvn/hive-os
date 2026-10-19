# HIVE OS — PRD Phase 2

Ngày gốc: 2026-10-14 · Cập nhật: 2026-10-19 · Phiên bản: 1.2
Trạng thái: **Định hướng được Owner duyệt; lát cắt định hướng người/AI được triển khai và kiểm riêng theo mục 13. Không xác nhận lợi thế sản phẩm hoặc kích hoạt runtime.**

## 1. Quyết định sản phẩm

HIVE chuyển từ tham vọng nền tảng suy luận/điều phối AI tổng quát sang bộ năng lực
chuyên ngành sử dụng trên nền tảng agent có sẵn. Ưu tiên Codex hoặc Claude Cowork
kết hợp skill, tài nguyên chuyên ngành và công cụ nhỏ. Chỉ phát triển ứng dụng
riêng khi một nhu cầu khách hàng cụ thể cần dữ liệu, trạng thái, quyền truy cập
hoặc thao tác mà các công cụ hiện có chưa đáp ứng đủ tốt.

Quyết định này do Owner xác nhận sau khi thảo luận kết quả toán, UAV và ERP:
“ghi vào PRD phase 2 ... phát triển theo hướng có giá trị”, tránh xây lại chức
năng các LLM và nền tảng agent đã làm tốt. Đây là thay đổi định hướng đầu tư,
không phải chứng nhận hiệu quả hay kế hoạch tự động triển khai mọi mục dưới đây.

**English decision:** Phase 2 prioritizes domain skills, reusable resources and
small verification tools on existing agent platforms. Standalone software needs
an identified customer problem and evidence of added operational value. Existing
research and product records are retained; no reasoning-superiority claim is made.

## 2. Vấn đề và người dùng

Người dùng thành thạo agent đã có thể đọc nguồn, phân tích, lập kế hoạch, viết
mã và tạo tài liệu trong Codex hoặc Cowork. Một ứng dụng bổ sung có thể làm tăng
công sức do nhập ngữ cảnh hai lần, vận chuyển JSON, xử lý cảnh báo sai và bảo trì
hai hệ thống, trong khi chưa tạo đầu ra tốt hơn.

Người dùng mục tiêu ban đầu là nhà nghiên cứu hoặc chuyên gia hồ sơ đang dùng
agent và muốn kiểm một nghĩa vụ cụ thể, tái sử dụng tri thức hoặc bàn giao kết
quả. Nhóm cộng tác nhiều người là ứng viên cho ứng dụng riêng nếu có nhu cầu
quản lý dữ liệu thực. **Chưa có bằng chứng nhu cầu trả tiền hoặc nhóm khách hàng
đã được xác nhận cho Phase 2.** Các persona là giả thuyết để kiểm, không là dữ
liệu thị trường.

## 3. Bằng chứng và giới hạn

| Hồ sơ | Điều đã quan sát | Điều chưa được thiết lập |
| --- | --- | --- |
| [UAV một đề](../../artifacts/qa/button-ab-20261014/RESULTS.md) | A/B cùng 18/20; B dùng nhiều lượt model hơn | Lợi thế nội dung, cùng compute, tiết kiệm công sức con người |
| [UAV sáu cập nhật](../../artifacts/qa/uav-update-ab-20261014/RESULTS.md) | A/B cùng 6/6 trong một hồ sơ giả lập; helper kiểm số/gói cũ | Sáu mẫu độc lập, lợi ích năng suất tổng quát |
| [LACAHSA ERP](../../artifacts/qa/erp-ab-20261014/SCORECARD.md) | A 37/40; B 34/40; preview/revision và từ chối gói cũ chạy đúng | Khác biệt nhân quả, review chuyên gia, lợi thế suy luận |
| [K6](../CODEX_CHAT_HANDOFF.md) | Có hồ sơ lập luận, kiểm và hướng thất bại được giữ | Khép K6, đột phá, lợi thế đối chứng với cùng LLM |
| [Santa Fe chuẩn bị](../../artifacts/qa/holdout-operator-20261014/README.md) | Tài liệu/rubric đã soạn; chưa có người vận hành hoặc kết quả | Holdout model chưa từng gặp, chấm chuyên gia độc lập, ROI |

Một ca hòa/thua không chứng minh mọi ứng dụng AI vô ích; nó không cung cấp căn
cứ để đầu tư lớn vào điều phối tổng quát của HIVE. Chất lượng nền tảng OpenAI
hoặc Anthropic cũng không được mặc định là tốt nhất ở mọi nghiệp vụ: phải so với
khả năng thực của công cụ mà khách hàng đã dùng.

## 4. Mục tiêu

1. Giảm công sức hoàn thành một công việc chuyên ngành đã xác định, tính cả đọc
   nguồn, nhập/chuyển ngữ cảnh, sửa, kiểm và bàn giao.
2. Tạo công cụ kiểm chứng có phạm vi rõ, chạy lại được, phát hiện được lỗi cụ thể;
   khi không kiểm được phải trả trạng thái chưa xác định.
3. Tái sử dụng tri thức và mẫu thành skill/tài nguyên có đầu vào và đầu ra rõ,
   giảm chi phí bảo trì phần nền tảng.
4. Chỉ đầu tư ứng dụng riêng khi có giá trị khách hàng bổ sung được quan sát hoặc
   ràng buộc vận hành bắt buộc được xác nhận.

Không dùng số agent, gate, test, trang UI, audit record hoặc điểm heuristic làm
chỉ số thay cho các mục tiêu này.

## 5. Những việc không tiếp tục mở rộng theo mặc định

- Chat, planner, bộ nhớ/ngữ cảnh hoặc nền tảng agent tổng quát tự xây: ưu tiên
  dùng cơ chế sẵn có của host; ngoại lệ phải gắn với hạn chế thực đã quan sát.
- Bầy agent và solver–critic–repair cố định cho mọi nhiệm vụ: phản biện cần một
  câu hỏi cụ thể; đồng thuận model không là kiểm chứng độc lập.
- Gate biên tập/phê duyệt mới cho việc thông thường: các kiểm tra quyền, giao
  dịch và bảo mật đang có vẫn được giữ tại ranh giới thực thi.
- Tự động mở chiến dịch toán hoặc thêm benchmark để tìm kết quả thắng. K6 tiếp
  tục OPEN/paused; nghiên cứu mới cần mục tiêu và phạm vi được chọn riêng.
- Deploy, kích hoạt worker/API, đổi provider, database hoặc xóa code nghiên cứu
  như một hệ quả tự động của PRD này.

## 6. Lựa chọn giải pháp

Thực hiện theo thứ tự: dùng host hiện tại → thêm skill/tài nguyên → thêm script
hoặc connector nhỏ → chỉ khi cần mới bổ sung một bề mặt ứng dụng chuyên biệt.
Đây là nguyên tắc chọn giải pháp, không phải chuỗi gate người dùng phải đi qua.

| Thành phần | Định hướng |
| --- | --- |
| Suy luận, chiến lược, viết, code, gọi công cụ | Host agent làm mặc định |
| Tri thức ngành, cách đọc nguồn, mẫu hồ sơ | Skill/tài nguyên ngắn, có phiên bản |
| Đại số, đơn vị, chi phí, chứng chỉ hữu hạn, proof kernel | Công cụ đúng phạm vi; lựa chọn theo bài |
| Lịch sử và tệp của một chuyên gia | Dùng tệp/Git/công cụ host trước |
| Dữ liệu chia sẻ, quyền, giao dịch nghiệp vụ | Chỉ dùng/xây ứng dụng khi yêu cầu thực cần nó |
| Các màn hình và module HIVE hiện có | Giữ để tham khảo và sử dụng local; không mở rộng chỉ để tận dụng code đã viết |

## 7. User stories

- Là nhà nghiên cứu, tôi muốn đưa một phát biểu hoặc chứng chỉ vào công cụ kiểm
  phù hợp để biết đúng phần nào được xác nhận và phần nào còn mở.
- Là chuyên gia hồ sơ, tôi muốn áp dụng tri thức và mẫu trong phiên agent đang
  dùng để tạo đầu ra mà không phải sao chép ngữ cảnh giữa hai hệ thống.
- Là người nhận bàn giao, tôi muốn mở nguồn, đầu ra và lệnh kiểm thực tế để tái
  lập phần kết luận có công cụ hỗ trợ.
- Là nhóm có dữ liệu chung, tôi muốn thay đổi dữ liệu đúng quyền và giữ phiên
  bản nhất quán nếu các công cụ hiện dùng không đáp ứng được yêu cầu này.

## 8. Yêu cầu và nghiệm thu

Các mục dưới đây là tiêu chí cho một lát cắt được chọn sau này. Không yêu cầu
triển khai toàn bộ như một chương trình hoặc bộ máy quản trị mới.

| Ưu tiên | Yêu cầu | Điều kiện nghiệm thu |
| --- | --- | --- |
| P0 | Gắn một thay đổi với công việc và người dùng cụ thể | Nêu ai gặp khó khăn, đầu ra cần gì, cách đang làm và vì sao host/skill hiện có chưa đủ; không có nhu cầu thì dừng ở ghi nhận |
| P0 | Dùng lại nền tảng agent | Luồng chạy trong host đã chọn; không có lớp chat/memory/planner song song chỉ để bọc lại host |
| P0 | Skill/công cụ giải quyết một nghĩa vụ rõ | Đầu vào, đầu ra, nguồn, giới hạn có thể đọc trực tiếp; công cụ kiểm trường hợp đúng, sai và thiếu dữ liệu liên quan |
| P0 | Bàn giao bằng định dạng mở | Người khác mở được hiện vật và chạy lại kiểm tra đã tuyên bố mà không cần chuỗi thao tác thủ công qua UI HIVE |
| P0 | Kiểm giá trị với baseline mạnh | Baseline cùng model, nguồn, công cụ thông thường, lịch sử và quyền tự sửa phù hợp; tính toàn bộ thao tác/tài nguyên, giữ cả hòa/thua |
| P1 | Connector hoặc UI nhỏ cho thao tác lặp lại | Có thao tác cụ thể được giảm hoặc yêu cầu trạng thái/quyền được bảo đảm; đo cả phần lỗi và chi phí bảo trì |
| P2 | Ứng dụng đội nhóm độc lập | Có khách hàng dùng lặp lại và nhu cầu dữ liệu/giao dịch/quyền được xác nhận; nếu cần độ tin cậy vận hành phải nghiệm thu riêng |

P1/P2 là lựa chọn theo nhu cầu, không phải backlog cam kết xây. Bảo trì bảo mật
và xử lý lỗi sản phẩm hiện có là công việc riêng, không bị chặn bởi phép đo lợi thế.

## 9. Đo giá trị và quyết định đầu tư

Với mỗi công việc được chọn, lưu một ghi nhận ngắn gồm: đầu ra, thời gian người
thật, lỗi quan trọng/bỏ sót, thời gian tìm lại bằng chứng, tài nguyên dùng và phản
hồi của người nhận. Thời gian agent không thay được thời gian người vận hành;
hash không xác nhận nội dung; cảnh báo heuristic không là review chuyên môn.

Phép đối chứng phải cho baseline tự đọc tệp, tính, tự sửa và dùng những công cụ
khách hàng thực có. Mọi khác biệt về số lượt/tài nguyên phải được công bố. Nguồn
công khai chưa được dùng trong dự án chỉ là ca mới với dự án, không chứng minh
model chưa từng gặp. Chấm ẩn nhãn cũng không tự tạo chuyên gia độc lập.

**Ngưỡng quản trị dự kiến**, không phải kết quả hay ngưỡng thống kê:

- Muốn tăng đầu tư, trước hết có ít nhất một người ngoài đội xây sử dụng lại
  cho một công việc tương tự và xác nhận lợi ích thực.
- Đối với lời hứa năng suất, mục tiêu thử ban đầu là giảm ít nhất 30% công sức
  con người với chất lượng không giảm và không thêm lỗi quan trọng. Phải báo
  số mẫu, khác biệt từng ca và cả lượt thất bại; mẫu nhỏ chỉ là tín hiệu.
- Nếu giá trị là quyền/giao dịch/khả năng phục hồi, đo trực tiếp yêu cầu đó và
  xác nhận khách hàng cần nó; không áp ép một bài viết A/B để biện minh.
- Đầu tư thương mại cần khách hàng xác nhận nhu cầu sử dụng/trả tiền và chi phí
  bảo trì dự kiến. “Bản demo đẹp” và “có nhiều code” không đủ.
- Nếu một so sánh hợp lệ hòa/thua và không xuất hiện nhu cầu mới cụ thể, giữ
  công cụ nhỏ hữu ích, dừng mở rộng hướng đó. Không đổi rubric/bài để tìm thắng.

## 10. Lộ trình thực dụng

| Bước | Đầu ra tối thiểu | Khi dừng/chuyển |
| --- | --- | --- |
| A — dùng và tinh lọc | Chọn một công việc thật; dùng Codex/Cowork và công cụ đang có; trích đúng một năng lực tái sử dụng nếu cần | Không có thiếu hụt thì dùng host, không xây thêm |
| B — thử với người nhận | Đầu ra được dùng, nhận xét và chi phí thao tác được ghi thực | Hòa/thua hoặc không được dùng lại thì không mở rộng |
| C — đầu tư chuyên biệt | Chỉ thêm phần dữ liệu, connector hoặc UI được nhu cầu chứng minh | Chi phí vượt lợi ích hoặc nền tảng host đã giải được thì thu gọn |

Chưa chốt thời hạn, khách hàng hoặc ngân sách triển khai A–C. Phiên hiện tại chỉ
chốt PRD, tài liệu điều hướng, vệ sinh hiện vật và commit/push. Pilot Santa Fe
được lưu tham khảo, chưa tuyển người, chưa chạy và không là việc bắt buộc kế tiếp.

## 11. Những câu hỏi còn mở

| Câu hỏi | Người xác nhận | Thời điểm cần |
| --- | --- | --- |
| Công việc lặp lại nào đang gây mất công cho một người/nhóm thực? | Owner/người dùng | Trước lát cắt tính năng mới |
| Dùng nền tảng nào và giới hạn triển khai/phân phối thực tế của nó? | Kỹ thuật/người dùng | Khi chọn host; tra tài liệu hiện hành, không giả định parity Codex/Cowork |
| Công cụ kiểm được phần nào, đâu cần chuyên gia hoặc proof kernel? | Chuyên gia/kỹ thuật | Trước khi tuyên bố kết quả |
| Người nhận có dùng lại/trả tiền, và phần nào cần dịch vụ duy trì? | Khách hàng/Owner | Trước đầu tư thương mại hoặc deploy |

## 12. Áp dụng và bảo toàn

PRD này là chỉ dẫn cho lựa chọn sản phẩm mới, thay cho mặc định lịch sử “web OS
trước” trong Phase 1. Các quyết định lịch sử, manifest, nguồn toán, kết quả A/B,
schema và bảo mật hiện có được giữ nguyên; định hướng không thay đổi runtime.
Không đưa luật mới vào UI hoặc tạo thêm đối tượng gate/database.

Tài liệu OpenAI xác nhận có skill, script và cơ chế quản lý phiên/ngữ cảnh,
nhưng không là bằng chứng so sánh mọi kiến trúc host hoặc Claude Cowork:
[Build skills](https://learn.chatgpt.com/docs/build-skills) và
[App Server](https://learn.chatgpt.com/docs/app-server#api-overview), đọc 2026-10-14.
Đối chiếu capability hiện hành khi chọn nền tảng thay vì bảo trì một bản sao.

Phiên sau bắt đầu từ PRD này và nhu cầu thực của người dùng. Không khởi động lại
bầy agent, benchmark, chiến dịch K6 hoặc dựng nền tảng chỉ vì lịch sử có sẵn.

## 13. Bổ sung được Owner duyệt: người định hướng, AI triển khai

Ngày 2026-10-19, Owner yêu cầu HIVE có hai lựa chọn tại ngã rẽ nghiên cứu: con
người đưa ý tưởng bằng lời, hoặc để AI chọn hướng; sau đó yêu cầu gọt giũa và
triển khai từng bước. Đây là nhu cầu trực tiếp của người vận hành hiện tại,
chưa là bằng chứng nhu cầu thị trường hoặc lợi thế trước Codex/Cowork.

**Công việc:** nhà nghiên cứu muốn nói “tôi nghĩ nên thử hướng này” mà không
phải tự viết công thức, prompt kỹ thuật hoặc vận chuyển JSON; khi chưa có hướng,
họ muốn ủy quyền lựa chọn cách tiếp cận mà vẫn giữ mục tiêu, bằng chứng và giới hạn.

- **Tôi định hướng / I guide:** lời gợi ý là ý định chiến lược, không phải sự
  thật hay phương pháp mặc định đúng. Model phải xét tiền đề, đối chiếu nguồn,
  thử hướng phù hợp và công khai nếu nó không khả thi. Không âm thầm đổi mục tiêu.
- **AI tự định hướng / AI guides:** model chọn một bước tiếp có lý do từ kết quả
  và khoảng trống hiện có. Không tự cấp quyền tăng ngân sách, đổi chính sách
  dữ liệu, mở campaign hoặc công bố bài toán đã được giải.
- **Một hồ sơ dùng chung:** đổi người định hướng không tạo hai lịch sử tách rời,
  không ghi đè kết quả trước; lượt kế tiếp trỏ về lượt nguồn. Người có thể tiếp
  quản ở ngã rẽ tiếp theo. Không hứa ngắt/hủy một model call đang chạy nếu runtime
  chưa hỗ trợ điều đó.
- **Lõi nhỏ:** một solver/agent chính dùng nguồn và công cụ được phép. Phản biện
  chỉ cho khoảng trống cụ thể, kiểm máy chỉ cho nghĩa vụ có thể kiểm; không mở
  một lượt solver–critic–repair cố định hay thêm hệ thống chat/bộ nhớ song song.

### Các bước triển khai và giới hạn

1. **Lát cắt hiện tại:** dùng lại trang nghiên cứu, hàng đợi, bộ thu nguồn và lịch
   sử sẵn có. Nhập mục tiêu, chọn cách định hướng, gửi tối đa một bước nghiên cứu;
   kế thừa mục tiêu và chính sách nguồn từ lượt trước bằng dữ liệu server. Khi
   bộ thực thi không được cấu hình/cấp quyền, UI phải nói rõ chưa chạy; hồ sơ
   chuyển cho host là văn bản đọc được, không phải bằng chứng model đã thực thi.
2. **Nghiệm thu runtime riêng:** chỉ khi đã cấu hình provider/worker và có quyền
   thực thi/chi phí phù hợp, chạy một việc mới xuyên suốt bằng nguồn thực; kiểm
   tiếp quản, tiền đề sai, thiếu nguồn, hết tài nguyên và kết quả chưa xác nhận.
   Bản thân yêu cầu tính năng không cho phép API trả phí hoặc nghiên cứu K6 mới.
3. **Đo giá trị trước mở rộng:** so cùng host agent, model, nguồn, lịch sử và công
   cụ. Đo công người, thời gian đến kết quả dùng được, lỗi bỏ sót, tìm lại nguồn,
   chi phí và can thiệp. Nếu UI/connector không giảm công hoặc đáp ứng nhu cầu
   cộng tác thực, giữ phần skill/công cụ nhỏ và bỏ lớp dư thừa.

Tiêu chí P0 của lát cắt: không cần JSON để định hướng; đổi mode không gọi model;
không mất lời đã nhập; không sửa kết quả cũ; không lấy parent ngoài workspace/
mission; không biến nội dung chưa rà soát thành dữ kiện đã duyệt; runtime tắt
không tạo job giả “đang chạy”; EN/VI, bàn phím và màn hình hẹp dùng được.

**Chưa cam kết trong lát cắt:** deep research đa công cụ tùy ý trong web runtime,
Codex/Cowork transport mới, vòng tự trị liên tục, shell tự do, đo lợi thế hoặc
chứng minh toán mới. Không gọi thu nguồn có dẫn chứng là một nhà nghiên cứu tự
trị hoàn chỉnh. Xem [kế hoạch và kiểm chứng](RESEARCH_DIRECTION_IMPLEMENTATION.md).

### Sửa lõi theo yêu cầu kế tiếp: API tiếp tục giả lập

Owner làm rõ: “vẫn giả lập api hãy chỉnh sửa lõi HIVE để đạt mindset trên”.
Không coi giao diện chọn hướng, prompt mới hoặc một bộ thu nguồn là đã sửa lõi.
Lõi gọn phải đưa phản hồi thực sự vào quyết định của lượt kế tiếp:

- Giữ mục tiêu và ràng buộc do host sở hữu; chuyển người/AI định hướng không
  thay chúng hoặc xóa kết quả trước.
- Model diễn giải trực giác thành hướng có thể thử, xét tiền đề và nêu phương
  án gần nhất nếu tiền đề không đứng vững. Đây là lập luận của model, chưa phải
  kết luận đúng chỉ vì đã khớp schema.
- Lưu hướng đã thử, kết quả công cụ và nghĩa vụ còn mở. Prompt sau phải chứa
  phản hồi đó; quyết định tiếp tục/đổi hướng/dừng phải phụ thuộc vào quan sát,
  không chạy tuyến phản biện/sửa cố định hoặc lặp hướng thất bại bằng metadata mới.
- Model không tự chứng nhận tiến triển. Host phân biệt đề xuất, tự nhận xét và
  receipt kiểm máy thực; ứng viên sai không đồng nghĩa phương pháp tổng quát sai.
- Mặc định một solver, không reviewer. Tổng số call/thời gian/byte tính xuyên
  các bước, kể cả bước lỗi. Human mode dừng ở ngã rẽ; Auto chỉ đi trong giới hạn
  và phải trả lại quyền khi cần quyết định chưa được cấp.

Triển khai trên executor hiện có, tương thích luồng cũ. Kiểm trên một kịch bản
kỹ thuật cố định với provider giả lập ghi nhãn rõ và checker thực, không giả
thông minh cho đề bài tùy ý. Bằng chứng này chỉ nghiệm thu điều khiển/kiểm chứng,
không chứng minh năng lực LLM, deep research, lợi thế đối chứng hoặc khép K6.
Không bật API, worker, quyền shell, campaign hoặc deploy theo yêu cầu này.
