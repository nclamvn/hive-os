# TIP-081 — Research Evidence Program

Date: 2026-10-06, Asia/Saigon. Version: 1.
Contractor: Codex. Homeowner: Lâm.
Root: RESEARCH_EVIDENCE_PROGRAM_081. Mode: DESIGN_AND_PLANNING_ONLY.
Status: PLAN_READY_FOR_BLUEPRINT_REVIEW; BUILD_NOT_STARTED.

## 1. Quyết định và phạm vi hiện tại

Owner trực tiếp duyệt năm hướng đề xuất rồi yêu cầu “lên kế hoạch triển khai đầy
đủ và chi tiết”. Quyết định này mở việc thiết kế chương trình dưới đây; không
được diễn giải thành quyền tự chạy tất cả thực nghiệm, cấp grant mới hoặc bật
transport chưa nghiệm thu. Lượt này chỉ scan chỉ đọc và ghi tài liệu.

Một milestone đang làm: bàn giao kế hoạch có yêu cầu, phụ thuộc, tiêu chuẩn
nghiệm thu, phương án triển khai đầu tiên và các quyết định còn thiếu. Bằng chứng
đóng milestone thiết kế là tài liệu được Contractor rà soát và checkpoint lưu
bền vững. Không có mathematical milestone mới được kích hoạt.

Điểm dừng: bàn giao kế hoạch. Build Phase A cần duyệt blueprint cụ thể ở mục 18;
Phase B cần quyết định execution boundary; mỗi study Phase C/D cần protocol,
đề, tài nguyên và quyền thực thi riêng. Không hỏi Owner về chi tiết lập trình
thông thường sau khi một package đã được duyệt.

Các tiền nhiệm giữ nguyên:

- TIP-080 public permutation slot đã COMPLETED; không reset, retry hoặc tái dùng
  receipt. Nguồn `ad93e61a826db1a584c8ded2a159876f39def30517c775b6f98195dc49592597`.
- TIP-079 engineering build/UI đã nghiệm thu riêng; native scientific execution
  vẫn thiếu no-tools containment đã xác nhận. Không đóng gate bằng UI mới.
- TIP-076 controlled fixtures không phải live-model evidence.
- LRC p139 G/C/T/B còn OPEN 0/4 theo checkpoint; không mở lại attempt, grant,
  search, replay hay dùng một kết quả phụ để thay thế chứng minh LRC 14/15.
- Không commit/push, publish, deploy, billing, cài dependency, gọi API tính phí
  hoặc migration DB được thực hiện bởi kế hoạch này.

## 2. Vấn đề và định vị

HIVE OS đã có bằng chứng giải các bài công khai, review theo ngữ cảnh mới và
kiểm chứng tính toán có phạm vi. Tuy nhiên người xem còn phải đọc một hồ sơ kỹ
thuật dài; một số luồng dùng operator import; các phép đối chứng hiện chưa chứng
minh tăng tỷ lệ giải đúng. Nếu chỉ tăng dashboard hoặc thêm bài thành công,
sản phẩm có thể đẹp hơn nhưng chưa mạnh hơn hoặc dễ tin hơn.

Định vị mục tiêu: **môi trường nghiên cứu toán bằng AI có bằng chứng truy vết,
kiểm chứng phù hợp và tự trị trong phạm vi con người đã duyệt**. Không định vị là
“máy đã giải được bài toán mở” hoặc “hệ thống chắc chắn hơn LLM” khi chưa đo được.
Tên khai triển HIVE mới được gợi ý trong chat chưa phải quyết định thương hiệu.

Ba giá trị độc lập:

1. Hiểu được: người xem biết bài toán, ý tưởng, kết quả và giới hạn.
2. Dùng được: researcher khởi động một run, hệ thống vận hành thực sự và dừng đúng.
3. Tin được: người khác truy nguyên và kiểm tra kết luận trong phạm vi công bố.

Không lấy acceptance của một giá trị để thay thế hai giá trị còn lại.

## 3. Người dùng và tình huống

| Persona | Công việc cần hoàn thành | Hành vi sản phẩm phải hỗ trợ |
|---|---|---|
| Người xem hiểu AI/toán | Đánh giá dự án có nghiêm túc không | Đọc kết quả, xem lập luận, nhận ra assisted/native và informal/formal |
| Research operator | Điều phối một mục tiêu được duyệt | Duyệt contract, theo dõi, định tuyến khi bế tắc, revoke |
| Người kiểm chứng | Kiểm mệnh đề thay vì tin đồng thuận AI | Xem giả thiết, exact certificate, trạng thái replay và khoảng trống |
| Evaluator | Đo phần giá trị bổ sung của phương pháp | So hai arm, giữ nguyên thất bại, khóa bản nộp, chấm giấu nhãn |
| Người kiểm tra bên ngoài | Kiểm tra mà không đọc toàn bộ chat | Gói hồ sơ gọn, hướng dẫn tái lập, giới hạn và nguồn rõ |

Thông tin đã có được dùng thay cho một cuộc RRI dài: local-first; VN/EN; hai
theme; bằng chứng cũ phải giữ nguyên; AI-native là đích; con người quyết định
mục tiêu, giới hạn, escalation và release. Nguồn độc lập cho benchmark kín và
người dùng bên ngoài chưa có, không tự điền bằng tài khoản hoặc đề do solver tạo.

## 4. Baseline bằng chứng

| Tiền nhiệm | Kết quả đã có | Chưa thiết lập |
|---|---|---|
| TIP-077 IMO2024 P1/P2/P3 | DIRECT 3/3, METHOD 3/3 được review informal; chênh lệch quan sát 0 | Method uplift, bộ đề kín, giá trị người dùng, runtime native |
| TIP-078 public polynomial degree 19 | DIRECT 1/1, METHOD 1/1; exact identity replay dưới bổ đề tin cậy; chênh lệch 0 | Formal proof, official FrontierMath score, causal superiority |
| TIP-080 public permutations | 1 run, 4 fresh contexts, 364.296s; floor 499999999972; full written argument, arithmetic check và fresh informal review | Blind score, novelty, method uplift, native autonomy |

Baseline run dùng cho Phase A:
`8ec3fa5b-d423-4055-85ba-c2764ace4fdf`, mission
`c999b840-3b6a-4b8b-b99d-b567072c007b`, workspace
`tip079-poly19-engineering-9ac5dd`.

Hồ sơ TIP-080:
`docs/verification/TIP-080_SCIENTIFIC_COMPLETION.md`, SHA-256
`f22db9a232d5e7193a7cce32268ebb3b9ed5eba1c3ca26735991e5118355edb3`.
Export 120417 bytes tại `artifacts/tip080/run-8ec3fa5b/completed-export.json`, SHA
`976246818165fdfc4a01b7d89123e5d7bcbe18a63600549e99059dc312df8df2`.
These are historical evidence pins, not new runtime authority.

## 5. Mục tiêu đo được và không làm

| Goal | Thước đo / tiêu chuẩn | Loại bằng chứng |
|---|---|---|
| G1 Dễ hiểu | Trong pilot có consent, ít nhất 3/4 người chưa đọc hồ sơ tìm được kết quả và nêu đúng 2 giới hạn trong 2 phút | User observation, chưa đo; Owner demo không thay thế mẫu người dùng |
| G2 Truy nguyên | 100% kết luận được tuyển vào Studio có evidence ref hoặc nhãn editorial/unsupported rõ | Automated provenance checks + source review |
| G3 Tự vận hành | 1 bounded actual-model run chạy từ UI tới sealed result không manual file transfer | Native execution acceptance, không dùng fixtures |
| G4 Sửa sai | Bắt lỗi và sửa trong challenge đã đăng ký; không chấp nhận mutation sai ở negative controls | Challenge evidence, không suy ra hiệu quả lỗi tự nhiên |
| G5 Giá trị phương pháp | Đo paired outcomes, error detection, resource overhead và operator time; chấp nhận kết quả bằng 0 hoặc âm | Frozen comparative pilot, không ép một positive KPI |

Chỉ G2 có thể nghiệm thu hoàn toàn bằng engineering ở Phase A. G1/G3/G4/G5
hiện NOT_RUN cho chương trình mới. Mục tiêu G1 là giả thuyết usability, không
phải số liệu đã có hoặc lựa chọn lọc người tham gia để đạt chỉ tiêu.

Không làm trong release đầu: giải lại toàn bộ LRC, claim đột phá, benchmark
FrontierMath chính thức, website public, shared anonymous link, model marketplace,
arbitrary executable upload, một scheduler mới, global redesign, đổi font, chatbot
tổng quát, native paid-provider fallback, tự động công bố hoặc token suy đoán.

## 6. Roadmap tổng thể và thứ tự phụ thuộc

| Package | Ưu tiên | Đầu ra | Phụ thuộc | Trạng thái hiện tại |
|---|---|---|---|---|
| A — Research Evidence Studio | P0 / Now | UI đọc kết quả, cấu trúc lập luận, giới hạn và evidence | Hồ sơ 080; blueprint A | SPEC_READY, BUILD_NOT_STARTED |
| B0 — Execution-boundary decision | P0 / Next | Chốt transport khả thi và threat model | Gate 079 chưa đóng | DECISION_PENDING |
| B1 — Bounded native loop | P0 / Next | UI → actual worker/model → checker → reviewer → result | B0, reviewed source, actual run approval | NOT_STARTED |
| D0 — Error-repair challenge design | P0 / có thể thiết kế sau A | Corpus lỗi + rubric + independent checker | Mệnh đề/checker được chọn | PROPOSED |
| D1 — Error-repair challenge execution | P0 | Hiển thị falsify → revise → replay trong loop | B1 hoặc assisted study được duyệt riêng; D0 | NOT_AUTHORIZED |
| C0 — Matched evaluation protocol | P0 | Task set, hai estimand, quotas, rubric, failure denominator | Baseline 077/078; source độc lập | PROPOSED |
| C1 — Comparative pilot | P0 | Đo paired value và overhead | C0 + execution grant; B1 nếu đo native product | NOT_AUTHORIZED |
| E — Portable evidence + external evaluation | P1 | Gói replay và phản hồi thực tế | A; kết quả D/C khi có; sharing consent | PROPOSED |
| F — Scoped Lean/mathlib expansion | P1 / conditional | Một formal target được kernel nhận + alignment review | Toolchain/security decision; mục tiêu formal riêng | PROPOSED, không chặn A |

Luồng chính: A → B0 → B1 → D1 → C1 → E.
D0 và C0 có thể chuẩn bị độc lập sau A, không chạy suy luận. E có thể đóng gói
hồ sơ 080 trước khi C1 chạy nhưng không được quảng bá là bằng chứng method uplift.
F là nhánh tăng độ đảm bảo, không làm chậm A và không tự mở study.

Chương trình giảm ưu tiên việc gom thêm bài thành công, thêm panel rời rạc và
chạy brute-force LRC chưa có whole-closure plan hiệu quả. Không hủy hoặc viết lại
những cam kết/hồ sơ nghiên cứu cũ để làm đường cho roadmap mới.

## 7. Blueprint Phase A — Research Evidence Studio

### 7.1 Thiết kế sản phẩm

Không thay Control Room bằng một dashboard khác. Dùng một trang tập trung trên
một run, đề xuất route additive
`/w/[workspaceSlug]/research/evidence-studio?missionId=...&runId=...`.
Query chỉ chọn record được phép, không nhận đường dẫn filesystem, URL dữ liệu,
prompt hoặc mã thực thi. Phase A v1 chỉ hỗ trợ dossier permutation080 đã có.
Poly19/IMO có adapter riêng ở các increment sau, không normalize lossy vào080.

Ba chế độ trình bày đọc cùng dữ liệu, không thay trạng thái nghiên cứu:

- Overview: bài toán, ý tưởng trung tâm, kết quả và conclusion ceiling.
- Proof: đọc lập luận với references đến nguyên bản và evidence.
- Audit: original bytes, prompts, event cut, source, caveats, private export.

Presentation/replay mode chỉ là đọc lại một lịch sử. Luôn ghi “Hồ sơ đã hoàn
thành”, timestamp gốc và CODEX_ASSISTED/operator import. Không có đồng hồ live
giả, agent animation giả, giả stream token hoặc đổi nhãn thành native.

Layout desktop:

```text
┌────────────────────────────────────────────────────────────────────┐
│ Bài toán + nguồn + run + mode + phạm vi kết luận                     │
├────────────────────────────────────────────────────────────────────┤
│ Ý tưởng then chốt / kết quả toán học / điều chưa được chứng minh     │
├───────────────┬────────────────────────────────┬───────────────────┤
│ Mục lục       │ Bàn đọc chứng minh LaTeX       │ Evidence của bước │
│ Bổ đề         │ Giả thiết → lập luận → hệ quả │ đang chọn         │
│ Đếm xác suất  │ Critique gắn với đoạn liên quan│ Checker + ceiling │
│ Chặn H_n      │ Nguyên bản luôn truy cập được │ Gaps / assumptions│
├───────────────┴────────────────────────────────┴───────────────────┤
│ Timeline thực / metadata quan sát / Audit và export mở khi cần       │
└────────────────────────────────────────────────────────────────────┘
```

Mobile: header → summary → mục lục gọn → proof → evidence tương ứng → timeline
→ audit; không ép ba cột. Mỗi công thức dài chỉ có một scroll owner có keyboard
focus, không tạo nested overflow như defect080 đã ghi nhận.

### 7.2 Design system và kiểm lại brief

Giữ HIVE Precision Instrument: canvas `#f4f6f8`, surface `#ffffff`, ink `#0c1424`,
navy `#10244a`, teal `#0b7a67`, amber `#c46716` qua semantic token hiện tại để
dark theme vẫn có thẩm quyền. Giữ font interface đang dùng; monospace chỉ cho
identifier/hash; KaTeX cho toán. Không thêm font/network asset hoặc global CSS.

Điểm đặc trưng là cấu trúc chứng minh và đường nối đến evidence, không phải số
KPI lớn hoặc một màn hình nhiều card giống nhau. Body khoảng 65–80ch, căn trái,
phân cấp rõ; tương tác mở evidence có phản hồi nhẹ và tôn trọng reduced-motion.
Language/theme reuse controls hiện có. Giữ placeholder một dòng/ellipsis và
focus-visible cho bàn phím; không tái tạo pointer-only blue ring đã bỏ.

Brief critique: bảng điều khiển hoạt động không phải điểm khác biệt; proof canvas
được ưu tiên. Audit không bị xóa để làm sạch UI, chỉ hạ tầng trình bày. Caption
“đã kiểm” phải nêu scope thay vì một badge xanh chung cho cả kết quả.

### 7.3 Dữ liệu, reader và bảo toàn nguồn

Code đã đọc:

- `src/modules/permutation-bridge/kernel.ts`: `getBridgeView`, `listBridgeDrafts`,
  `exportBridge`; reader kiểm current source, authority, event cut và exact bytes.
- `src/modules/permutation-bridge/source.ts`: 080 pinned source bundle và QA-only
  environment; source mutation phải bị từ chối, không tự reseal.
- `src/modules/permutation-bridge/ledger.ts`: actor/run binding, bounded chain,
  private storage; lịch sử command/outbox không phải free-form user input.
- `src/app/api/w/[workspaceSlug]/research/permutations/[runId]/export/route.ts`:
  private/no-store export, bounded bytes, credential scan và digest.
- `src/components/research/math-text.tsx`: rendering-only KaTeX; nguyên bản giữ nguyên.

V1 ưu tiên additive route/component/view-model/tests, dùng reader được phép và
không sửa kernel, checker, pinned080 UI, source manifest hay shared auth/storage.
Không có bảng DB mới, không sửa schema, không gọi action mutate, không cấp grant.
Không trả toàn bộ original base64 qua client state nếu view không cần.

Reader hiện hành cần cả actor tạo run, không chỉ role research.read. Phase A
không mở truy cập cho một thành viên khác hoặc anonymous. Nếu một reviewer khác
cần xem, đó là sharing authorization của E, không bypass ở A.

`getBridgeView` kiểm current source. Thêm file mới ngoài danh sách080 có thể giữ
old pins, nhưng mọi shared change hoặc packaging interaction vẫn phải kiểm.
Nếu cần thay pinned/shared file, dừng, ghi compatibility delta và đề xuất một
release admission mới. Không sửa080 source bundle cũ để báo nguyên lịch sử vẫn
còn đúng. Không có fallback HTML công khai hoặc đọc raw artifact theo path client.

Annotation v1 là nội dung editorial được Contractor review, gắn với runID,
finalDigest và dossier cut; không phải output mới của model. Mỗi bước có ref đến
role/digest + đoạn nguyên bản được xác định ổn định. Không sửa dấu công thức
trong original; TeX diễn giải bổ sung phải có nhãn và bản gốc cạnh đó.
POSTREVIEW là prose, không có structured proof acceptance. Không regex từ
“SUPPORTED” để tự chứng nhận theorem. Hiển thị nguyên verdict model với nhãn
informal và chỉ thể hiện Main review nếu annotation được kiểm/bind riêng.

Completed run có deadline/receipt đã hết hạn không trở thành lời giải sai.
`expired`/`liveReady` là trạng thái quyền tiếp tục thực thi hiện tại, không phải
trạng thái toán học của hồ sơ đã khóa. Trên trang đọc kết quả, chỉ dùng chúng để
giải thích rằng run không thể khởi động lại; không ghi “kết quả hết hạn”.

`BridgeView.currentPrompt` không chứa toàn bộ prompt lịch sử của completed run.
Nếu Studio cần audit prompt cũ, lấy từ bounded authenticated `exportBridge` và
validate riêng, không dựng lại prompt từ template hiện tại hoặc path phía client.
Timeline event chi tiết lấy từ exact retained events, không suy timestamp từ
thứ tự role. Failed commands hiển thị reason quan sát được, UNKNOWN nếu chưa có.

Phân biệt hai loại export. Archived120417-byte `completed-export.json` là bản
chụp lịch sử bất biến với SHA đã ghi ở mục4. `exportBridge` chạy lại hôm nay
đưa cả `expired`/`liveReady` hiện tại vào JSON nên có thể có digest khác dù mọi
original/prompt/event/checker vẫn nguyên. Studio phải ghi đây là export quan
sát hiện tại với digest/lineage riêng; so stable scientific fields, không ép
toàn bộ JSON trùng archived digest và không giả flags cũ. V1 không hứa download
archived file qua web: nếu cần, đề xuất bounded authenticated fixed-archive
reader riêng trước khi implement, không đọc artifact theo path client.

### 7.4 Requirements Phase A

| ID | Priority | Requirement / acceptance |
|---|---|---|
| A-R01 | P0 | Chỉ đọc run đúng mission/workspace/actor, không tạo DRAFT/START/job/model effect |
| A-R02 | P0 | Overview hiển thị đề, nguồn, kết quả, mode, public exposure và ít nhất hai giới hạn |
| A-R03 | P0 | Proof có LaTeX, giả thiết, structural lemma, probability/expectation và rigorous bound |
| A-R04 | P0 | Mỗi curated claim có original/evidence ref; thiếu/mismatch không hiện như validated claim |
| A-R05 | P0 | Tách process status, arithmetic status, informal review, formal status và novelty |
| A-R06 | P0 | Original/prompt/event/checker và archived export không đổi; export quan sát mới và rendering/annotation có digest/lineage riêng |
| A-R07 | P0 | Replay presentation không gọi inference hoặc giả live activity; timestamp gốc rõ |
| A-R08 | P0 | VN/EN, light/dark, 320/390/768/1280/1536px, keyboard, reduced-motion và accessible math |
| A-R09 | P0 | Auth/tenant/actor/source/credential/bounded-input refusal giữ nguyên, no-store |
| A-R10 | P0 | Reload/deep link đúng selected run; unavailable/empty/corrupt/out-of-scope là trạng thái riêng |
| A-R11 | P0 | Kiểm old-source compatibility và ordinary UI; không dùng “new build passed” thay old run proof |
| A-R12 | P1 | Reader có Table of contents, chọn bước, mở original và evidence trong tối đa hai thao tác |

P0 phải đạt 11/11, P1 1/1 hoặc deferred rõ. Không gọi 12/12 nếu chỉ có screenshot.

### 7.5 Kịch bản nghiệm thu A

| Scenario | Given / When | Then |
|---|---|---|
| A-S01 | Actor hợp lệ mở exact completed080 | Kết quả499999999972 và CODEX_ASSISTED, NON_FORMAL hiển thị cùng nhau |
| A-S02 | Chọn structural lemma | Hiện lập luận + exact original ref; checker không bị gọi là đã chứng minh bổ đề |
| A-S03 | Chọn arithmetic enclosure | Hiện khoảng chính xác + checker assumptions + giới hạn |
| A-S04 | Mở POSTREVIEW | Thấy review ở context mới, không gọi independent model hoặc expert certification |
| A-S05 | Mở presentation, next/previous/reload | Đọc lại retained timeline; mọi scientific effect counter không đổi |
| A-S06 | Mở raw/current export | Original/prompt bytes/digests và stable event/checker/source/task khớp080; export quan sát hiện tại có digest riêng và không giả flags để khớp archived SHA |
| A-S07 | Anonymous/cross-tenant/khác actor/mission mismatch | Refuse, không rò original hoặc metadata riêng |
| A-S08 | Annotation hoặc source pin bị thay trong owned fixture | Không thể tiếp tục như evidence valid; không tự refresh manifest |
| A-S09 | XSS/unsupportedTeX/credential/big malformed input fixture | Không execute, fallback/refuse an toàn, raw historical record không bị sửa |
| A-S10 | 320px + Tab/ShiftTab + công thức dài | Không page overflow, không nested keyboard trap, focus thấy được |
| A-S11 | Hai locale × hai theme × năm viewport | Đọc được, không lỗi nghiêm trọng/critical trong scoped Axe, không suppress |
| A-S12 | Ordinary UI + old080 archived export/stable fields/pins | Archived bytes giữ nguyên; regenerated export chỉ khác declared current observations nếu có; source change phải khai báo, không wash lịch sử |

Fixtures biến đổi chỉ nằm trong namespace QA mới, nhãn ENGINEERING_ONLY.
Không đổi dữ liệu thật để tạo test failure.

### 7.6 Đầu ra thi công A và verification

Builder thực hiện theo package A sau blueprint approval. Trước code đọc guide
Next.js installed liên quan; dùng stack và test pattern hiện tại. Contractor
review logic trạng thái/refusal, đọc source delta, chạy kiểm tra độc lập và E2E
trực quan. Không xem ảnh đẹp là sufficient functional acceptance.

Deliverables: route + bounded server view model + proof/evidence components +
localization + owned annotations + unit/security/UI tests + completion report.
Không bắt buộc một file layout cụ thể; output contract quan trọng hơn path.

Proposed engineering envelope cần duyệt cùng A: suites <=120s/lượt, aggregate
engineering tests <=900s; type/lint <=180s/lượt; tối đa 2 builds <=600s/build;
một build fail phải chẩn đoán/giữ evidence trước lượt còn lại, không có lượt3
tự động. Browser acceptance <=30 phút; loopback/test5433/hiveos_test và QA
identity đã được phép hoặc owned synthetic fixture mới, không truncate/ordinary
DB migration. Scientific/paid-provider calls = 0. Nếu không đủ bound, STOP.

Áp dụng restricted OS read profile hiện có cho actual test/build/server effects;
không mở/stat/follow hai target LRC075 đã bị loại ở charter080. Không broad
artifact tracing, cleanup hoặc thay old running server trước new acceptance.

Báo cáo A phải có 12 requirements implemented/missing/deferred; 12 scenario
pass/fail/untestable; số unit/integration/E2E thực; build/type/lint; exact source
compatibility result; screenshot; remaining gates; READY hoặc NOT_READY.

## 8. Phase B — Tự trị thật nhưng trong phạm vi rõ

### B0 Quyết định trước thực thi

Không mặc định gói đăng ký có một API native tương đương provider API. Native
path phải có supported transport, permission profile và evidence capture thực
sự. Phân tích transport cũ079, kiểm docs/installed capability tại thời điểm build,
không hạ no-tools requirement bằng một câu “model được nhắc không dùng tools”.

Ba tuyến quyết định: (1) transport hiện có đáp ứng pre-effect containment;
(2) sửa architecture sang một boundary khả thi và được Owner duyệt;
(3) giữ CODEX_ASSISTED, báo native blocked. Paid API cần approval chi phí riêng,
không phải fallback mặc định. Không cho model đọc source/checker/reference/token.

Threat model phải xác định host/DB admin nào được tin, những hiệu ứng ngăn được
trước suy luận, điều chỉ quan sát hậu kiểm và remote cancellation UNKNOWN.
Nếu không ngăn được quyền bị cấm, không chạy scientific request để thử vận may.

Scan hiện tại cho thấy `src/modules/research-showcase/containment.ts` trả
`BLOCKED_UNESTABLISHED`; `transport.ts` không có executor và trả
`CONTAINMENT_REFUSED_BEFORE_EFFECT`. Vì vậy B1 không phải việc bật một checkbox
trên UI. Cần một actual transport được review; trường hợp không khả thi thì
bàn giao blocked có lý do, không thay synthetic worker vào scientific acceptance.

### B1 Luồng và mức tự trị

UI duyệt task/goal/allowance → authenticated command → durable reservation →
worker lease → fresh solver → critic → bounded revision → fixed checker → fresh
postreview → sealed result → gate cần con người nếu có.

Đây là luồng tối thiểu để nghiệm thu trước. Về sau strategy có thể chọn search,
formalization, counterexample hoặc literature route trong tool/task allowance
đã duyệt. Không hard-code rằng mọi bài buộc chạy đúng bốn role; cũng không để
planner bỏ independent verification/release gate. Strategy change trong target
được ghi; target/domain/resource/security change cần human routing.

Những gì AI tự làm: tách nghĩa vụ chứng minh, đề xuất hướng, chọn tool được phép,
phản biện, sửa, phát lại checker và tạo hồ sơ. Những gì con người quyết: target,
admissible closure, resource ceiling, authority/security, thay đổi chiến lược
vượt phạm vi và release. Không yêu cầu con người bấm xác nhận từng đoạn text.

Requirements B-R01..08: actual transport không import/fixture; deny-before-effect;
persist quota before dispatch; crash/recovery/double-post fencing; revoke/late
adoption refusal; no retry khi provider effect UNKNOWN; observed/declared/unknown
telemetry riêng; UI tới exact final dossier không thao tác file thủ công.

| ID | Required output | Kịch bản tối thiểu trước acceptance |
|---|---|---|
| B-R01 | Actual source-reviewed transport, task-only contexts | New native run nhận original từ worker thực; fixed provider/import không đạt scientific AC |
| B-R02 | Boundary ngăn effect bị cấm trước dispatch | Tool/admission negative probe trong owned engineering profile; không dùng trace rỗng thay prevention |
| B-R03 | Permanent resource reservations | Double submit/reload/expired receipt không tăng allowance hoặc reset clock |
| B-R04 | Durable recovery với lease/source/epoch fencing | Crash trước/giữa/sau dispatch giữ consumed slot; stale worker không adopt |
| B-R05 | Revoke và deadline có hiệu lực | Revoke khi đang chạy, output muộn refused; remote cancel uncertainty vẫn lưu |
| B-R06 | Unknown effect không tự retry | Lost provider response tạo paused unknown-effect state; không thêm request để đoán |
| B-R07 | Telemetry honest và reviewer/checker binding | Self-reported tool/cost khác trace được flag; verifier result bound exact FINAL, không model-authored |
| B-R08 | Browser end-to-end không manual import | Authenticated Start → actual stages → checker/review → sealed dossier tồn tại sau reload |

Các scenario B ở đây là minimum blueprint. Chi tiết transport/tool list, source,
runtime flags và numerical ceilings chỉ đóng trong B0/B1 TIP sau human decision;
không giao Builder một “B1 ready” khi boundary còn chưa chốt.

Acceptance engineering có synthetic forced crash, revoke, source drift, duplicate
START, late output và unknown provider outcome. Scientific acceptance riêng cần
một actual approved run với new IDs, source/task/authority/resource bindings.
Không tái dùng080receipt hoặc kết quả080 như output mới. Giữ verdict FAILED hoặc
INCONCLUSIVE nếu đó là kết quả thật.

## 9. Phase D — Chứng minh năng lực phản biện và sửa sai

D0 chọn theorem/checker đủ độc lập và nhỏ để kiểm logic đúng, không lấy answer
scalar làm oracle duy nhất. Có bốn error classes ban đầu: sai lượng từ/miền;
missing boundary/necessity; sửa coefficient/certificate nhưng giữ answer;
đổi từ kiểm finite thành claim universal. Giữ cả positive/negative controls.

Đăng ký mutation/rubric trước khi solver chạy. Hệ thống nhận candidate và target,
không nhận danh sách lỗi/expected repair. Tạo corpus và chấm ở context/process
khác; một LLM vừa cài lỗi vừa làm oracle không là independent acceptance.

D1 phải lưu chuỗi candidate ban đầu → phát hiện lỗi kèm evidence → nghĩa vụ bị
ảnh hưởng → revision có lý do → checker replay → postreview. Refuted claim vẫn
được giữ trong history và planner không sử dụng lại như premise chưa bị bác bỏ.
Nếu patch tạo lỗi khác, vòng không được hiện “resolved” từ consensus.

Metrics: detected/total per class, false acceptance, false alarm trên positive
controls, repaired-and-rechecked/total, resource/operator overhead. Tổng denominator
giữ mọi slot failed/time-out/refused. Mục tiêu engineering: mọi registered corrupt
certificate negative control bị refuse; không hứa100% mọi lỗi chứng minh.

Synthetic challenge nhãn SYNTHETIC_ERROR_CHALLENGE, không phải natural failure
hay research breakthrough. Nếu gặp lỗi tự nhiên trong future study, giữ nguyên và
phân tích riêng, không thay synthetic controls hoặc chọn lỗi đẹp sau khi biết kết quả.

## 10. Phase C — Đo phần giá trị gia tăng thật

### C0 Hai câu hỏi không được trộn

- End-to-end value: một LLM với ngân sách phù hợp vs HIVE OS. Đo hệ thống như một
  package; nhiều context/tools/control là một phần can thiệp, chi phí phải tính.
- Protocol ablation: matched multi-call baseline vs HIVE method, cùng allowance
  và tool policy. Đo giá trị bổ sung của method, không gán hiệu quả có thêm call
  cho riêng governance hoặc prompt.

077/078 đã có review/revision ở cả baseline và method, không phải single-call
baseline. Không relabel dữ liệu cũ để đáp ứng thiết kế mới. Baseline có quyền
tự chọn cách giải trong allowance, không cố tình làm yếu.

Proposed diagnostic pilot: 12 bài ghép cặp cho một estimand chính, xác định trước
nguồn/tier/domain; sampling rule và quota chỉ chốt sau đánh giá feasibility.
Số12 là proposal thiết kế, không runtime grant, không đủ để hứa superiority
statistical hoặc generalization. Một study lớn hơn cần power/precision planning
từ tỷ lệ paired discordance và budget, không chọn n để tạo headline.

Điều kiện held-out: nguồn độc lập giữ đáp án/rubric, solvers chưa được truy cập,
statement-only capture. Public FrontierMath samples là public capability test,
không blind/training-clean; không gọi benchmark chính thức. Nếu không có nguồn
độc lập, ghi DATA_SOURCE_BLOCKED hoặc PUBLIC_SAMPLE, không giả kín.

Khóa task/prompt/policy/toolchain/checker/grading/limits trước dispatch. Cùng model
configuration khi có thể, served version UNKNOWN nếu thiếu evidence. Seed và thứ
tự ngẫu nhiên/counterbalanced được đăng ký, grading giấu arm label; caveat về
style leakage và reviewer cùng model vẫn hiện. Checker/reference không đến solver;
grader không biết prior reviewer verdict. Không sửa final sau khi biết điểm.

Budget phải nêu call/time/token/tools/retained bytes per arm và grading overhead
riêng. Matched allowance không có nghĩa equal realized compute. Không coi unknown
hidden reasoning/currency là0; phí API0 không có nghĩa subscription usage miễn phí.

### C1 Chấm và quyết định

Primary endpoint: tỷ lệ full proof supported theo rubric đã khóa, không chỉ đúng
số cuối. Secondary: critical-error acceptance, error detection/repair, number of
unclosed obligations, elapsed time, actual observed tokens, tool compute và
operator interventions/time. Study tooling time và Main time được tách, không bỏ.

Report full registered denominator, paired outcomes và uncertainty khi estimable.
Không cộng sai reasoning/cached fields vào total; timeout/refusal là outcome,
không đổi bài hoặc gọi lại cho đến khi thành công. Nếu100% cả hai, báo ceiling
effect và gain0; không đổi primary metric hậu nghiệm để tuyên bố thắng.

Routing sau pilot: có bằng chứng giá trị → đầu tư vào mechanism tạo gain; hòa →
xem resource/reliability nhưng không đổi nhãn thành superiority; âm → giảm
coordination hoặc bỏ component không có ích. Kết quả đẹp không tự mở open problem.

## 11. Phase F — Formal assurance với Lean

Hiện có Lean4.10 Std-only pilot/check runner, axiom audit và fresh lean4checker
replay trong code. Không có bằng chứng rằng current080 proof đã chạy Lean.
Không gọi code integration là installed/available runtime hoặc whole-proof acceptance.

Tài liệu tiền nhiệm `docs/operations/MATH_PILOT_FORMAL_GATE_2026-09-30.md` ghi
một accepted fresh replay cho calibration even-square, vẫn alignment pending.
Đó là evidence lịch sử ở target khác, không phải lần kiểm runtime mới của081,
không chứng nhận080 và không tạo quyền dùng formalizer cũ trong chương trình mới.

F0: read-only toolchain/runtime/source/version audit; chọn một formal obligation
có ích. Nếu cần install/upgrade/mathlib/container/storage, đưa delta kiến trúc,
dependency và numerical QA envelope cho Owner; không bật từ plan này.

F1: domain/assumptions/quantifiers/conclusion mapping trước proof search; immutable
formal target; cấm sorry/admit và disallowed axioms; pin mathlib/toolchain nếu
được chọn; compile, audit transitive axioms, fresh replay và operator semantic
alignment acceptance. Kernel acceptance của mệnh đề sai đề không đóng bài gốc.

Mục tiêu đầu có thể là một structural lemma, không hứa formalize full n=10^12
proof hoặc LRC14/15. UI phân biệt PARTIAL_FORMAL_OBLIGATION với WHOLE_PROOF_FORMAL.
Chốt target/method sau feasibility review; một symbolic identity checker không
bị đổi nhãn thành Lean. Human alignment vẫn là một gate quan trọng.

## 12. Phase E — Gói bằng chứng dùng lại và người kiểm tra bên ngoài

E1 private portable package: statement/source/license metadata; original roles;
rendered proof + raw bytes; checker/source/toolchain pins; trusted assumptions;
machine verdict và informal review riêng; exact command replay; failure history;
resource observations; limits; manifest/checksum; guide và expected scoped result.
Không mặc định original source license cho phép redistribute toàn bộ lời giải
tham khảo; kiểm quyền sử dụng trước release, không cào/public lại dữ liệu kín.

Một clean environment replay kiểm bytes, identities/certificates trong scope;
không chạy model-authored executable hoặc nhúng credentials. Thiếu runtime phải
cho UNAVAILABLE với hướng dẫn, không cài dependency hoặc chạy network script
tự động. Bundle là artifact inert, giới hạn path/size/executable permissions.

Gói private nguyên bản giữ nguyên. Public/shareable derivative nếu được duyệt
có redaction manifest + new digest + lineage; không sửa originals rồi nói exact.
Việc loại user IDs/token/storage keys khỏi public derivative phải được kiểm.

E2 đề xuất 4 người chưa xem dossier cho comprehension test và 2 mathematical
reviewers cho proof/rubric feedback; consent/sharing/recruitment cần Owner.
Không tạo reviewer giả hoặc dùng Owner làm toàn bộ sample. Reviewer có thể không
đồng ý; lưu dissent và sửa bản trình bày/phiên bản khoa học mới có lineage.

Demo/communications kit chỉ sau private acceptance: walkthrough5–7 phút, ảnh
proof/evidence, one-page statement of achieved/not-established claims và private
replay package. Public posting/deploy là quyết định riêng, không tự làm.

## 13. Kiến trúc trạng thái kết luận

Đây là proposed view vocabulary; không đổi legacy enums hoặc upgrade old records.

| Axis | Trạng thái cần thể hiện | Điều không suy ra |
|---|---|---|
| Workflow | Draft / Running / Completed / Stopped / Failed | Completed không có nghĩa theorem true |
| Evidence integrity | Consistent / Refused / Unavailable | Hash chain không chống trusted admin rewrite |
| Computation | Exact scoped replay / Rejected / Inconclusive / Not run | Finite test không chứng minh universal claim |
| Argument review | Informal supported / Disputed / Incomplete / Not reviewed | Same-model vote không phải independent expert proof |
| Formal proof | Kernel accepted for target / Partial / Not established | Cần statement alignment và assumptions |
| Novelty | Known public problem / Not assessed / External assessment | Đúng bài công khai không tạo định lý mới |
| Execution provenance | Codex-assisted import / Controlled fixture / Actual native | Không nâng provenance bằng rendering hoặc file copy |

Không gộp thành một confidence score hoặc badge “VERIFIED” không scope. Thiếu
dữ liệu là UNKNOWN/NOT_ASSESSED, không tự suy luận từ claim của model.

## 14. Task graph và phân công

Proposed subpackages, không phải các TIP đã được thi công:

| Package | Contractor | Builder / reviewer | Definition of done |
|---|---|---|---|
| 081-A | Finalize view contract/annotation, Main QA | Additive Studio UI + tests; independent reader review | A-R01..12/A-S01..12 có coverage, no effects, old evidence intact |
| 081-B0 | Boundary options, human decision | Read-only capability/security review | Signed scope/threat model, no implicit grant |
| 081-B1 | Source admission/live approval/Main E2E | Worker + durable orchestration + hostile QA | Engineering AND separately actual native run accepted |
| 081-D | Freeze mutation corpus/rubric | Independent checker/challenge tooling + review | Detection/revision/replay dossier, synthetic disclosure |
| 081-C | Preregister source/arms/metrics/stop | Capture/evaluator tooling, isolated graders | Full denominator report, limitations and resource observations |
| 081-F | Formal target/semantic acceptance | Formalizer/runtime QA + separate replay | Scoped formal target + axiom audit + alignment, or explicit blocked |
| 081-E | Release scope/consent/dissent handling | Inert package/replay guide + independent reader | Clean replay + permission-reviewed derivative, no auto publish |

Vibecode: Contractor không product code; Builder không tự đổi architecture.
Source-owning Builder không là sole verifier của output mình. Routine decisions
được AI tự xử lý trong approved output/bounds; chỉ escalation thật mới tới Owner.

## 15. Nhịp triển khai, năng lực và chi phí

Không có deadline calendar do Owner đặt hoặc dữ liệu team capacity đủ để hứa ngày
giao toàn bộ. Roadmap dựa trên milestone, không kéo gate bằng một Gantt giả.
Planning estimate sau approval, không phải resource grant:

- A: 2–3 vòng build/review/acceptance theo scope, effort mức M.
- B0: một feasibility/security decision; time-to-close UNKNOWN.
- B1: mức L, chỉ ước lượng lại sau B0; không chặn A nếu native không khả thi.
- D0/C0: mỗi phần một design review; D1/C1 có thời gian do frozen numeric protocol.
- F: mức L/uncertain theo mục tiêu formal và toolchain, có stop khi infeasible.
- E: mức M, external response time UNKNOWN.

“Vòng” là planning iteration, không tăng số build/model retry trong envelope A
hoặc study. Không đồng nhất AI elapsed time với ngày làm việc người.

Mỗi package dành QA/security/compatibility trước nghiệm thu; nguồn lực dư không
tự thêm tính năng. Bảo trì kỹ thuật liên quan nằm trong package; vấn đề ngoài scope
được park. Nếu chi phí điều phối vượt lợi ích, cắt/ghép component thay vì tăng role.

API paid budget hiện0 cho chương trình mới, native transport entitlement chưa
chốt. Quota đăng ký, inference tokens, host work, reviewer time đều là tài nguyên;
unknown phải giữ unknown. Old approval20USD hoặc giả định unlimited API của các
lượt lịch sử không tự chuyển sang081.

## 16. Risk register và biện pháp

| Risk | Owner | Mitigation / stop |
|---|---|---|
| UI đẹp nhưng không có incremental ability | Contractor/evaluator | Tách G1/G2 khỏi G5; giữ đối chứng hòa/âm; không đổi primary metric |
| Nâng UI làm source080 reader refuse | Builder/Main | Additive-first; diff source pins; preserve old server/source; explicit new admission nếu cần |
| Native tool boundary không thực hiện được | Security reviewer/Owner | No scientific effect before containment; giữ assisted nếu chưa có tuyến hợp lệ |
| Checker chỉ kiểm họ hẹp nhưng UI gọi full proof | Math reviewer/Main | Scoped states/assumptions, unsupported=INCONCLUSIVE, negative controls |
| Reviewer dùng cùng model cùng sai | Evaluator | Independent computation/formal where suitable, context isolation; external review; limits explicit |
| Public contamination hoặc chọn bài sau biết đáp án | Contractor/evaluator | Frozen source/sampling; statement-only solvers; no blind claim từ public samples |
| Cost quan sát thiếu hoặc model self-report sai | Runtime/evaluator | Actual traces, observed vs declared, UNKNOWN, separate grading/Main cost |
| Recovery tạo duplicate inference | Worker/Main | Pre-dispatch reservation, lease fencing, unknown effect STOP, no automatic retry |
| Evidence derivative rò secrets | Export reviewer/Owner | Bounded scan, private original vs redacted derivative, explicit release approval |
| Quay lại drift thành các TIP nhỏ không đóng mục tiêu | Contractor | One active milestone, named closure, stop; root history không reset |

## 17. Các gate nghiệm thu và quyết định

H0: Owner duyệt blueprint A và engineering envelope ở mục7.6. Không cần hỏi từng
component/label/loop/test trong scope. H1: Contractor bàn giao A Verify Report và
Owner quyết acceptance với deferred nếu có. B0 security/transport là H2, một
quyết định materially different, không được suy từ H0.

H3: mỗi actual run/study có exact targets/limits/source/authority riêng sau
engineering acceptance. H4: đối chiếu semantic formal target khi dùng Lean.
H5: consent/sharing/external review/public release. Không lặp form approval để
hợp thức hóa unestablished runtime; tài liệu là human intent, runtime authority
phải được cơ chế đã nghiệm thu kiểm.

Open questions còn thực sự thiếu:

| OQ | Ai quyết | Khi cần | Proposed default |
|---|---|---|---|
| OQ1 | Owner | Trước A build | Duyệt additive, private, no-schema Studio và bounded QA; no scientific calls |
| OQ2 | Security/Owner | B0 | Không nới containment; chọn một tuyến khả thi được review |
| OQ3 | Source curator/Owner | C0 | Ưu tiên held-out độc lập; nếu public thì label public |
| OQ4 | Evaluator/Owner | C1 | Chọn một estimand và numeric envelope trước model dispatch |
| OQ5 | Math reviewer/Owner | F | Một scoped formal obligation; mathlib/toolchain decision nếu cần |
| OQ6 | Owner | E2/release | Consent, người nhận, redaction và quyền publish riêng |

## 18. Quyết định thi công đầu tiên được đề xuất

**Duyệt Phase A: Research Evidence Studio v1, chỉ đọc hồ sơ permutation080;
additive route/component, zero new DB tables, giữ nguyên checker/raw/source080;
private authenticated QA, VN/EN/light/dark/accessibility; engineering bounds tại
mục7.6; không model/API/run mới/Git/deploy/publication.**

Sau khi được duyệt: Contractor tạo bounded Builder TIP từ A-R/A-S đã chốt, review
source compatibility, Builder implement/test, Main verify và mở local UI thực
để Owner nghiệm thu. Chỉ khi A đã đạt mới kết luận “Studio hoàn thành”. Toàn bộ
năm hướng không được đóng từ acceptance này.

Điểm kết thúc chương trình, không hứa trước: đọc hiểu được một kết quả toán,
actual bounded native operation nếu boundary khả thi, bằng chứng sửa sai có
scope, phép đo so sánh thật dù kết quả0/âm, hồ sơ có thể kiểm bên ngoài. Không
hứa một theorem mới, giải LRC14/15 hoặc khám phá tự trị hoàn toàn.
