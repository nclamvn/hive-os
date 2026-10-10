# HIVE OS — chương trình nghiên cứu toán học, blueprint nâng cấp

Ngày: 2026-10-04 (Asia/Ho_Chi_Minh). Trạng thái: **DRAFT / APPROVAL_REQUIRED**.
Đây là thiết kế và phạm vi thi công đề xuất, chưa phải tính năng đã triển khai.
Không hứa hẹn phương pháp hoàn hảo, nghiệm thu định lý hay đột phá.

## 1. Quyết định kiến trúc

Chuyển từ chuỗi hồ sơ/chạy công cụ sang một chương trình có mục tiêu toán học:

```text
Mục tiêu + chế độ + chính sách sử dụng tài liệu
  → nghĩa vụ trên đường tới kết luận
  → phương pháp có tiền đề phù hợp
  → thí nghiệm có khả năng phân biệt các giả thuyết
  → chứng cứ + phản biện + kiểm chứng độc lập
  → đóng nghĩa vụ có phạm vi / bác bỏ / đổi hướng / dừng
```

Tái sử dụng command/outbox/job/worker, auth theo tenant, review và chứng chỉ
hiện có. Không tạo executor thứ ba, không thay lõi bằng một framework agent mới.
LRC có adapter phương pháp riêng, version mới và admission riêng; không bỏ
guard để đưa dữ liệu LRC vào vòng Erdős–Straus cũ.

Hai chế độ khác nhau nhưng được phép dùng chung bổ đề:

- **REPRODUCTION**: tái lập một kết quả đã công bố; đầu ra là mức tái lập và
  các tiền đề còn thiếu, không phải tính mới.
- **DISCOVERY**: mệnh đề ứng viên khác kết quả nguồn, có phép thử bác bỏ và
  nghĩa vụ chứng minh. Được dùng định lý nguồn như một giả thiết được khai báo;
  không phải tái lập toàn bộ văn liệu trước khi bắt đầu nghiên cứu.

Con người phê duyệt mục tiêu, chính sách tin cậy nguồn, ngân sách/thẩm quyền
và công bố kết quả. Trong một phạm vi đã phê duyệt, AI tự chọn nhánh, phản biện,
kiểm công cụ, cập nhật nghĩa vụ và đổi hướng; không hỏi lại ở mỗi bước nhỏ.

## 2. Điểm xuất phát đã kiểm tra

HEAD `4d108227498d3578c9ac3fe60305c10da5aa905b`, checkout có nhiều thay đổi
từ các TIP trước. Giữ nguyên tất cả dữ liệu, code và báo cáo lịch sử.

- `math-method-map.ts` và vòng cycle hiện chủ yếu phục vụ Erdős–Straus.
  Trạng thái công bố của nguồn không tự chứng minh tiền đề phương pháp áp dụng.
- `math-lrc-proof-plan.ts` có **23 mục phụ thuộc tổng hợp** cho hai mục tiêu,
  không phải 23 APPLICATION theo prime; tất cả được phát hành ở trạng thái OPEN.
  Đây chưa phải sổ nghĩa vụ có trạng thái suy ra từ chứng cứ của từng prime.
- Số học khoảng hữu tỉ, hằng số và margin mâu thuẫn đã có. Không tính lại chúng
  rồi báo như kết quả nghiên cứu mới.
- Các collector generation/cascade/terminal p83 có kiểm ngữ nghĩa TS và Python
  độc lập. Nhưng replay terminal dùng predecessor lưu giữ không đồng nghĩa với
  chạy mới toàn bộ chuỗi phụ thuộc.
- Lemma graph hiện ghi phụ thuộc được nêu, chưa xác nhận các suy diễn ngữ nghĩa.
  ROUND_CLOSED hoặc AI_REVIEWED không phải chứng minh định lý.
- TIP-064 thất bại ở SOLVER: một lần dispatch, không có output được nhận,
  CRITIC/ADVERSARY chưa chạy. `INVALID_INPUT` chưa xác định nguyên nhân chính xác.
  Không có bytes phản hồi cũ để phục hồi; synthetic fixture không thay được chúng.

## 3. Các kỹ thuật nguồn được chọn

Nguồn cố định: Jaan Allikvere, *Fourteen and fifteen lonely runners*,
[arXiv:2609.02604v2](https://arxiv.org/html/2609.02604v2), 2026-09-24.
Đây là tuyên bố của preprint, không tự động là chứng nhận của HIVE OS.

Các phần được chọn: §3 kết hợp covolume với các ràng buộc prefix/KZ để thu nhỏ
bài toán hữu hạn; §4.1 chia tìm kiếm thành hai nhánh đầy đủ; §4.2 nâng nghiệm;
§4.4 ghép modulus bằng CRT và xử lý ít ngoại lệ bằng phép dịch; §5 khép mâu
thuẫn toàn cục bằng prime và bound. §6 nêu giới hạn kiểm chứng độc lập của
toàn bộ phép tính. Theo v2, hai mục tiêu dùng 61 và 71 prime; archive v1 có
111 prime là một baseline khác, không được trộn.

Phần còn lại là thiết kế sản phẩm của HIVE OS, không phải tuyên bố của tác giả.

## 4. Mười hai yêu cầu nghiệm thu

| ID | Yêu cầu | Chủ thể kiểm tra |
| --- | --- | --- |
| R1 | Mục tiêu, lượng từ, miền, convention số người/tốc độ và chế độ được pin | Core + independent review |
| R2 | Sổ nghĩa vụ master, từng prime và global closure gắn chứng cứ | Core |
| R3 | Chọn phương pháp bằng tiền đề thực sự, không bằng tên/trạng thái nguồn | Core + adversarial tests |
| R4 | Chính sách nhận định lý nguồn và nợ giả thiết hiển thị rõ | Core + UI |
| R5 | Thí nghiệm có discrimination, stop/pivot và ứng viên discovery riêng | Core + Integration |
| R6 | Kiểm ngữ nghĩa và đầy đủ; bằng chứng AI không thay proof kernel | Core + independent verifier |
| R7 | Giới hạn hữu hạn, reserve review, không lặp vô ích hoặc nới phạm vi ngầm | Integration |
| R8 | Chẩn đoán transport/admission riêng, replay offline và lưu giữ riêng tư | Integration + security review |
| R9 | Một cockpit mục tiêu–bằng chứng, VN/EN/KaTeX, passive GET | UI |
| R10 | Benchmark đối chứng công bằng và báo cáo hiệu quả toán học | Contractor |
| R11 | Giữ nguyên lịch sử, source pins, legacy contracts và worker guards | All + Contractor |
| R12 | Gate con người ở quyết định chiến lược; không ở từng bước agent | Contractor + Integration |

## 5. Mô hình chương trình và nghĩa vụ

Một baseline immutable chứa: statement chuẩn hóa có lượng từ/miền; TeX chỉ là
biểu diễn; source/version/digest; convention; mode; trust policy; nghĩa vụ root;
phương pháp được phép; giới hạn; capability registry. Mọi run tham chiếu baseline
và targeted obligation; case mới nhất không được tự trở thành hướng đang chọn.

Sổ master là projection từ các artifact hợp lệ, không cho model ghi trực tiếp
`PROVED`. Bổ sung version mới, không sửa `buildAllikvereProofPlan()` v1 hoặc
các packet 063/064. Giữ các aggregate cũ làm nguồn đối chiếu, rồi tách:

- analytic premises và giảm primitive/distinct/lower cases;
- nghĩa vụ generation/lift/terminal theo từng prime đúng mục tiêu;
- CRT/shift nơi áp dụng, không gán cho mọi prime một cách máy móc;
- explicit global log-closure và mọi cạnh cần thiết tới root;
- một registry evidence reference có statement/scope/checker/source pins.

Master DAG chỉ mô tả phụ thuộc, **không chứng minh cạnh**. Không dùng giới hạn
6-node/8-edge của lemma subgraph cũ để chứa toàn bộ chương trình. Master LRC
được sinh xác định từ baseline, có quota kích thước riêng; không đẩy nó vào
stdin model hoặc biến thành arbitrary graph authoring trong giai đoạn này.

Trạng thái được tách thành các chiều, không gom thành một badge “verified”:

1. vận hành: attempted / transport closed / admitted / reviewed;
2. tài liệu: source reported / source adopted theo policy;
3. kiểm địa phương: exact finite replay và coverage domain;
4. toán học: open / refuted exact predicate / reviewed conditional / kernel
   checked với statement alignment đã kiểm;
5. bên ngoài và tính mới: external acceptance / literature assessment, độc lập.

Root có conditional closure chỉ khi mọi nghĩa vụ **và từng implication edge
cần thiết** có evidence được admit, đúng statement/miền/quantifier và cùng tập
giả thiết tường minh. Không suy edge truth từ DAG connectivity hoặc node status.
Source-adopted implication vẫn phải pin chính xác statement và giữ nợ nguồn.
Local independent establishment chỉ khi không còn giả thiết nguồn
chưa được kiểm theo tiêu chuẩn đã chọn. Dùng nguồn vẫn hợp lệ cho nghiên cứu,
nhưng không được đổi nhãn thành independent reproduction.

## 6. Thư viện phương pháp theo khả năng áp dụng

Thêm domain adapter LRC, giữ nguyên enum/encoding Erdős v1. Mỗi method card có:
source locator và bytes pin; target kind; tiền đề có ID; tool capability;
expected output; evidence ceiling; cost estimate có khoảng bất định; một phép
thử phân biệt; novelty ceiling; stop/pivot; rejected predicate liên quan.

Tiền đề có ba trạng thái SATISFIED / OPEN / REFUTED theo artifact cụ thể.
Nhánh conditional được phép nếu policy cho phép và ghi toàn bộ nợ OPEN.
REFUTED hoặc sai convention thì không áp dụng. Thiếu công cụ thì DEFERRED,
không cho LLM tuyên bố công cụ đã tồn tại.

Các họ ban đầu: analytic bound reduction; complete covering; monotone lifting;
common-level/CRT composition; few-exception shifts. Phương pháp được chọn phải
chỉ ra đúng nghĩa vụ bị tác động và điều gì sẽ thay đổi sau thí nghiệm.

Xếp hạng ưu tiên: đi tới root, độ giảm bất định, tiền đề/công cụ sẵn có, chi phí
và sự đa dạng hướng. Điểm chỉ là heuristics có giải thích, không là xác suất
đúng. Các method khác nhau về tên nhưng cùng một predicate không là đa dạng.

## 7. Vòng nghiên cứu tự trị có kiểm soát

Mỗi experiment contract phải nêu trước:

- exact statement và predicate ID, targeted obligation, source assumptions;
- đối thủ mạnh nhất/counterexample candidate và phép kiểm discriminating;
- miền hữu hạn/nhóm đối xứng/biên strict hoặc non-strict nếu có computation;
- kết quả admissible: witness, refutation, conditional argument, completeness
  certificate hoặc missing tool; không yêu cầu reviewer phải đồng ý;
- resource cap và điều kiện stop/pivot; cách so sánh với baseline.

Agent phát biểu → adversary tìm điểm gãy → checker kiểm witness/certificate
và phủ miền → critic kiểm statement alignment → host cập nhật nghĩa vụ.
Các role dùng context riêng; cùng một model vẫn có lỗi tương quan, không được
gọi là độc lập toán học chỉ vì có ba role. Formal checker chỉ được ghi là có
khi thật sự đã tích hợp và kiểm đúng statement.

Phản ví dụ hợp lệ chặn đúng predicate và các hậu quả logic có chứng cứ; không
chặn một “họ ý tưởng” bằng text similarity. Tương đương hai statement phải có
justification được nhận, không chỉ normalization chuỗi. Gap review chỉ thành
nhiệm vụ mới nếu có root contribution và không tái sinh mệnh đề đã bác bỏ.

Dừng cứng khi integrity/transport/accounting hỏng. Không sinh case mới để che
lỗi. Dừng/pivot khi hai thí nghiệm đã hoàn tất trong batch không đóng nghĩa vụ,
bác bỏ giả thuyết hay giảm một uncertainty đã định nghĩa trước. Thất bại công
cụ không được tính như bác bỏ toán học. Không tăng prime, forest hoặc ngân sách
để tránh quy tắc này.

## 8. Kiểm chứng độc lập và tích hợp công cụ

Kiểm soundness của witness/nhánh **và completeness của domain partition**.
Mutation suite bắt buộc: thiếu nhánh; trùng/overlap không khai báo; pruning mất
nghiệm; sai strict boundary; unit không khả nghịch; sign/permutation sai;
source drift; coherent rehash nhưng sai nội dung; predicate hoặc miền khác.

Đưa công cụ vào registry host với input/output/schema/source/cap pins. Model
chỉ đề xuất invocation; authorized job thực thi. Gửi compact typed report cho
role, không gửi cả cây lớn hoặc tin model tự báo đã chạy tool.

Fresh generation → fresh cascade → fresh terminal phải bind output mới của
từng predecessor. Identity hashing hoặc replay riêng terminal không thay được
chuỗi đó. Collector caps hiện khác nhau; giữ riêng khỏi model stream cap và
10-second identity import. Blueprint này **không cho phép chạy chuỗi lớn**.

## 9. Chẩn đoán kỹ thuật — TIP-065 riêng

Giữ đề xuất cũ nguyên trạng, bổ sung thiết kế prospective. Envelope chẩn đoán
không thay contract toán học hay ledger acceptance:

`INPUT_CAPTURED → DISPATCH_ATTEMPTED → TRANSPORT_CLOSED → ADMISSION_ACCEPTED/REJECTED`.

Giữ exact stdin/schema trước dispatch và stdout bytes trước decode; incomplete
prefix khi overflow phải ghi truncated/non-replayable. Capture lỗi thì fail
closed, không dispatch/retry. Mã lỗi phân biệt process/deadline/cancel/size,
UTF-8/JSONL/protocol/tool/context/usage/schema/source/storage; chỉ allowlisted
codes/paths đi vào UI. Thread/usage từ transport là unaccepted metadata cho tới
admission, không là bằng chứng toán.

Đề xuất privacy policy cần phê duyệt cùng blueprint:

- root cố định ngoài repository/webroot/Codex history:
  `/Users/os/Library/Application Support/HIVE OS/ResearchDiagnostics`;
- directory0700, create-only files0600, full-write/fsync, symlink/path refusal;
  dùng opaque IDs bind tenant/actor/case/run/job/role/dispatch;
- replay/purge yêu cầu principal xác thực là actor gốc, còn membership/capability
  hợp lệ trong đúng tenant và local diagnostic permission. IDs do caller gửi
  không tạo authority; không có bypass operator/admin mặc định hoặc raw web GET;
- exact input/stdout trong capture; stderr mặc định **không lưu**, chỉ exit code
  và category. Không capture env, auth file, unrelated Codex history;
- tối đa 100 captures /128MiB toàn root; caps mỗi role không vượt scope gốc;
  atomically reserve slot và worst-case input/stdout/manifest bytes trước
  dispatch, enforce trong capture. Partial/orphan captures vẫn tính dung lượng,
  không giải phóng reservation để che bytes còn trên đĩa;
- replay hết hạn sau24h. Đây **không phải cam kết tự xóa sau24h**: raw còn trên
  đĩa cho tới maintenance purge được principal trên cho phép, chọn bounded
  opaque IDs và ghi safe summary receipt. Không daemon/GET cleanup, không broad
  path deletion. UI báo overdue retention; chưa purge có thể hết quota và chặn
  dispatch mới. Không auto-export raw;
- không tuyên bố encryption-at-rest:0600 không chống cùng OS user/admin.
  Bản đầu local opt-in, không dùng cho dữ liệu bí mật; nếu cần encryption hoặc
  multi-user production thì một scope bảo mật riêng;
- ghi bên ngoài writable roots hiện tại cần filesystem approval riêng lúc
  thực thi. Không silently fallback vào Git-tracked docs hoặc ordinary storage.

Offline replay dùng exact parser version, xác minh manifest/digest/size/access;
không subprocess/model/network/checker/DB acceptance. Candidate parser có nhãn
counterfactual. Không biến rejected capture thành accepted attempt hoặc sửa064.

## 10. Cockpit nghiên cứu

Dùng Math Pilot hiện có, auth/tenant và HIVE tokens; không một trang dashboard
mới. Một vùng mục tiêu/campaign rõ ràng, một vùng investigation/evidence:

- statement với TeX, mode, retained strategy, targeted obligation và next
  discriminating action; không suy strategy từ selected/newest case;
- master obligations, denominator coverage theo prime/domain và critical path;
  p83 không thể đóng aggregate61; local14 không tự thiết lập15;
- evidence timeline gắn obligation, original prose và safe TeX companion;
  các panel TIP lịch sử nằm trong disclosure, không thay lịch sử;
- operational blockers riêng khỏi mathematical debt; attempted/returned/admitted
  và reviewer NOT_RUN đúng thực tế;064 vẫn precise causeUNKNOWN;
- giả thiết nguồn, conditional scope, replay provenance, formal/external/novelty
  trạng thái riêng. Không proofpercentage từ node/token/run count.

Native disclosures, reading measure<=76ch, không text overflow, VN/EN và mobile.
GET/render chỉ đọc projection hợp lệ: không fetch literature, replay, prepare,
model call, write, auto polling hoặc khôi phục form cũ khi new-family malformed.

## 11. Mốc đầu tiên và đo giá trị

M0: diagnostic boundary có replay offline và reason code đúng. **Kỹ thuật**,
không tính vào tiến triển toán học.

M1 đề xuất: tái lập có phản biện **few-exception shift** ở mức conditional
statement, có liên kết từng bước/premise và verifier kiểm phần hữu hạn chính xác.
Unit phải ghi đúng statement nguồn:14tốc độ nguyên dương, prime$d$,
$e=\#\{i:d\nmid u_i\}$, $m_d=\lceil2d/15\rceil$, $2\le e$ và
$em_d<d$, với giả thiết $LRC(m)$ cho $1\le m\le12$ được khai báo.
Fixture ban đầu tập trung
$d=3,e=2$ và $d=5,2\le e\le4$; không đổi lượng từ universal thành kiểm
một vài offset hữu tỉ. Các phép đếm hữu hạn không thay chứng minh bước về
thời gian thực và lưới dịch.
Thử điều kiện hợp lệ và near-miss không thỏa điều kiện; negative output chỉ bác
bỏ certificate/applicability, không tự thành counterexample LRC. Phần suy diễn
với thời gian thực/lower theorem chưa formal thì giữ reviewed-conditional.
M1 không phải kết quả mới, không khép14/15 và không thay full forest coverage.

Sau M1, discovery được phép chọn một bài toán phụ có giá trị: xác định một
**điều kiện cấu trúc chứng minh được** cho overlap các tập dịch xấu giúp xử lý
lớp ngoài điều kiện sufficient hiện có. Đây mới là hướng ứng viên, chưa giả
thuyết được xác nhận và chưa novelty. Contract phải tách exact family, expected
gain, obstruction và khảo sát nguồn trước khi gọi là tiến bộ mới. Nếu nguồn đã
bao phủ hoặc không có discrimination thì chọn họ khác, không cố giữ hướng này.

Benchmark: so sánh direct-solver baseline với method-assisted pipeline trên
cùng statement, source exposure, tool access, model và resource cap. Báo cả
thành công/thất bại, role calls, elapsed/usage thực; không cộng reviewer votes
thành score. Tối thiểu các kiểm chuẩn: known conditional lemma; incomplete
finite certificate; plausible false statement; một candidate discovery chưa
có answer oracle. Known source-visible benchmark không là held-out benchmark.

Metrics toán học: aligned obligations discharged; exact predicates refuted;
complete finite domains checked; unresolved critical-path premises; reusable
known lemmas so với novelty-assessed new claims. Một paired pilot chỉ kiểm
luồng/khả thi; kết luận hiệu quả cần nhiều đề và uncertainty, không suy từ1bài.

## 12. Task graph và thẩm quyền

Draft TIP packs: `docs/proposals/TIP-065_068_RESEARCH_PROGRAM_DRAFT_PACKS.md`.

Trước seal/thi công, phải freeze canonical data và schema mới theo scope này:

- prime sets lấy đúng `allikvereProofPrimes(13|14)` và targets.primes của
  retained arithmetic, so sánh toàn bộ enumeration/order/uniqueness, không chỉ
  counts. Source module SHA256
  `650d55595ad689ce4726ca6c84f5772d543027c95df7121b1e6cc2747c335c9f`;
  retained artifact SHA256
  `8f0d79ea33d484bcbd9e966096e91b0af4f7081fe46b4e3fb554f38bd2108962`;
- quantified shift statement và lower premises ở§11; finite checker ban đầu
  chỉ d∈{3,5}, e đúng các trường hợp đã nêu. Input<=32KiB, integer/rational
  components<=256bits, deadline<=5s và<=2,000,000 explicit operations, certificate
  finite domain/strict boundaries phải pin. Đây là quota lane mới, không nới
  collector hay parser064. Input ngoài scope trả UNSUPPORTED, không verdict;
- schema mới, canonical digest, checker/source version và implication-admission
  rules được Contractor cross-review trước code. Chưa có frozen new packet trong
  lượt planning này. Chuẩn bị các artifact seal là công việc đầu sau G1, không
  tự tạo quyền live. Đổi statement/miền/quota vượt scope phải trình lại.

| TIP | Deliverable | Gate |
| --- | --- | --- |
| 065 | Private diagnostic boundary, deterministic offline replay, failed projection | Privacy design + offline QA |
| 066 | Baseline/mode/master obligations, applicability và source policy | Offline compatibility/adversarial QA |
| 067 | LRC method lane, shift unit, bounded experiment contracts, semantic evidence | Offline verifier + independent review |
| 068 | Cockpit và matched benchmark harness | Passive UI + aggregate QA |

065 và066 có thể thi công song song sau phê duyệt;067 dựa066;068 dựa065–067.
Không commit/push/deploy/billing, migration, install hay API phí trong phạm vi.
Không seal draft vào manifest. Builder viết code; Contractor kiểm ngược.

**Gate G1 cần một lần xác nhận:** chấp thuận blueprint và privacy policy để
thi công **offline**065–068. Không có quyền model, forest hoặc DB experiment.

**Gate G2 sau offline QA:** một experiment manifest riêng phải chọn exact unit,
actor/tenant, model/calibration, source/checker versions, caps và actual job
scope. Gợi ý batch đầu1experiment/3roles/no retries; không reuse failed064.
Nếu sau này duyệt autonomous batch lớn hơn, phải đặt finite rounds/calls và
pivot authority trước, không cần duyệt từng bước trong batch đó.

**Gate G3:** người vận hành quyết định strategic redirect hoặc public claim.
Không thay formal verification bằng click nghiệm thu. Approval con người cũng
không làm một chứng minh sai trở thành đúng.

## 13. Điều kiện đóng nâng cấp

Cả12requirements có implementation/test evidence, historical pins giữ nguyên,
type/lint/build và independent reviews đạt; UI visual nếu thực sự quan sát được.
Không gọi triển khai offline là successful live E2E. Sau G2, có đúng một traced
experiment với role/checker/evidence status trung thực, kể cả failure.

“Chương trình có giá trị” phải được chứng minh bằng benchmark và kết quả toán
có phạm vi, không bởi số TIP hoặc vẻ đẹp cockpit. Nếu repeated research output
không thêm thông tin, hệ thống phải đề nghị đổi phương pháp hoặc dừng.
