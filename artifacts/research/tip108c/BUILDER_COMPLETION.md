# TIP108C Producer Completion Report / Báo cáo hoàn tất

## Status

**PARTIAL — INCOMPLETE_MUST_REFUSE. R1 OPEN. Global K6 OPEN.**

The ONE authorized whole-chart attempt stopped at its131072 processed-node cap.
It did not produce a complete certificate or an admissible D<=0 counterexample.
Generation is STOPPED; no resume, rerun, refinement attempt or automatic successor
is authorized. This is an actual node-cap stop, not a proof of impossibility,
minimal required cost, budget exhaustion or use of the full wall window.

The committed scientific goal is unchanged: D=2G-(2+S)>0 on every remaining
34-label-signature near-two-component configuration, with arbitrary internal
offsets/ties, S in(18/61,18/31], strictly positive bottom gap, and the retained
size-dependent separation bounds. No radial stationarity or critical-label
majorization was assumed. The separate one-component13-orderword global domain
remains OPEN regardless of this campaign.

## What was established

The uniform guaranteed-core argument, all286 minimum-anchor charts and exact
integer event integration were implemented and checked within a bounded effort.
The producer uses endpoint trapezoids; the separately authored verifier uses its
own midpoint-affine integration and does not import the producer algorithm.
Main reviewed the schema/coverage proof and freshly replayed the initial controls
before releasing the single attempt. This establishes the engineering route and
its bounded effort, NOT a completed mathematical certificate.

The attempt seeded all286 charts before any processing and used a global
breadth-first queue. Every split kept both dyadic closed children. Pending regions
remain explicitly encoded with O, including roots that were not fully resolved.
No prefix of signatures was substituted for the whole target.

## Attempt outcome: producer metadata only

Command:

    python3 -B artifacts/research/tip108c/core_producer.py produce \
      --max-nodes 131072 --max-seconds 30 \
      --out artifacts/research/tip108c/WHOLE_ATTEMPT_1.json

Result status INCOMPLETE_MUST_REFUSE; stopped_by NODE_CAP; process exit0 denotes
successful emission of the explicit incomplete/refusal artifact, not proof success.

| Producer output field | Recorded value |
| --- | ---: |
| Root records | 286 |
| Processed nodes | 131072 |
| Created/encoded nodes | 172018 |
| Positive-core leaf claims P | 36246 |
| Domain-exclusion leaf claims X | 8960 |
| OPEN frontier leaves O | 40946 |
| Maximum encoded depth | 10 |
| Roots containing OPEN frontier | 208 |
| Roots without O, producer-only claims | 78 |
| Peak process RSS bytes | 68829184 |
| Output file bytes | 189812 |

The208/78 root partition was a filesystem-metadata projection of the saved
strings, not tree reconstruction or geometric verification. These root/leaf
classifications have NOT been independently certified. They do not constitute
accepted partial mathematical closure or reduce the34 continuous obligations.

The independent checker returned expected REFUSED: "INCOMPLETE is not proof".
It parsed bounded input and rejected the status BEFORE partial-leaf/full-tree
replay. Thus no independent acceptance of P/X leaves, root completion or frontier
completeness is claimed. CHECKER_WHOLE_REFUSAL.json and CHECKER_REVIEW.md are
owned by the independent checker; this producer report does not edit them.

## Controls and source checks

Producer initial controls passed: canonical34 masks/286 charts (10/14/10 by size),
constant-core agreement with BOTH retained independent area methods at a known
arithmetic-control point, core death area1/8, wide-empty core area0, a CONTROL_ONLY
two-positive-leaf toy tree, missing-root/child/trailing/symbol negatives, and286
OPEN frontier preservation. The toy has three nodes, not three positive leaves.
Finite controls are not additional independent geometry cases or scientific closure.

The128 fixed-cell profile exercised path depth48 and maximum promoted precision48,
with37 cuts per cell. Core time total0.012873495s, mean0.000100574s, maximum
0.000144292s. It qualified a bounded effort reservation, not a full leaf-count
or worst-case completion bound. The independent checker separately reported its
own11 controls and high-bit profile PASS before admission. Its ledger is separate.

Both ordinary AST syntax checks passed without bytecode output. The sole source
revision after initial controls changed only the tentative MAX_NODES constant
from32768 to131072 under Main's recorded exact-limit decision. Initial source
hash/profile/history were preserved in PRODUCER_QUALIFICATION.md. No producer
implementation change followed the whole attempt.

## Producer execution ledger

| Invocation | Measured evidence | Conservative charge | Outcome |
| --- | --- | ---: | --- |
| Initial controls including128-cell profile | Internal0.019844958s | 1s | PASS |
| Initial ordinary AST syntax process | Process startup included in charge | 1s | PASS |
| Constant-only cap-revision AST syntax process | Process startup included in charge | 1s | PASS |
| ONE whole attempt | Internal6.212457s; tool-reported wall6.161649s | 7s | INCOMPLETE at NODE_CAP |

Producer total conservative charge10s of75s. Exactly TWO mathematical subprocesses
(initial controls/profile and whole attempt), plus TWO ordinary syntax processes.
Zero failed mathematical starts/timeouts; the node-cap refusal is explicitly
retained, not omitted. No second profile or generation ran. Metadata/source reads,
hash/byte projections and apply_patch reports were not geometric computations.
Main/checker own their separate allowances and actual ledgers.

The attempt stayed below its30s/depth48/128MiB/16MiB limits. Created-node count
exceeds processed count because OPEN children are retained, as allowed; complete
acceptance would require all created/encoded nodes processed and every root closed.
The time/memory/output ceilings were NOT reached. Unused allowances do not issue
permission to resume, enlarge the node cap again or rerun another partial attempt.

## Files and immutable sources

Producer-owned new files only under artifacts/research/tip108c:

- core_producer.py: bounded integer core integration, full chart generation,
  dyadic split tree, global BFS queue, caps, controls/profile and create-only output.
- BUILDER_PRODUCER_CONTROLS.json: finite initial arithmetic/structural checks.
- PRODUCER_QUALIFICATION.md: proof argument, initial/cap-revision history and ledger.
- WHOLE_ATTEMPT_1.json: explicit incomplete whole-attempt frontier artifact.
- BUILDER_COMPLETION.md: this report.

No old area/proof/helper bytes were edited. No checker implementation was read,
imported or modified by the producer. No dependencies, compiles/builds, UI/app/DB/
auth/config/Git/paid APIs, platform/gates, random/navigation/optimizer, scratch
project copies or distDir were introduced. No newly created scratch/bytecode
artifacts need removal. The measured artifact directory before this final report
was259293bytes; subsequent small checker/report artifacts remain far below16MiB.

Frozen SHA256:

    core_producer.py
    eaeae641a11be368d5f0548b98351e27017ed7163231f9e5f434ca2a4850b3ff
    WHOLE_ATTEMPT_1.json
    4bc8d5ea74e5f68411e08259002c85927cd72f85e559cd254f1202c133c5db12
    BUILDER_PRODUCER_CONTROLS.json
    8e99deaa4fde40b00def0852e810444e4129384ee093e8e66b51f1fa18c83d03
    retained tip098/kakeya_exact.py (unchanged)
    26c3b41b3bb731d67247ef1033e94ba4e0dbb0b58aa662858bafe0603596cf55

## Remaining obligation and routing

The complete near-two-group defect inequality still needs a WHOLE certificate
or universal analytic proof, or an exact admissible countercertificate. This
partial split tree cannot be accepted or resumed. The recorded algorithm's
131072-node outcome does not prove that any complete method needs more nodes,
that120s is insufficient in principle, or that the mathematical goal is false.
Main's terminal checkpoint and any future direct owner routing govern next work.

Vibecode Kit informed the Producer/Contractor/independent-Checker boundaries,
the preserved TIP/Completion audit trail and explicit non-closure handoff.

## Tiếng Việt

Kết quả PARTIAL: cây chứng chỉ CHƯA HOÀN CHỈNH, R1 và K6 toàn cục vẫn mở.
Đã chạy đúng MỘT lần thử trên đủ286 biểu đồ bằng hàng đợi toàn cục. Lần thử
dừng ở131072 nút xử lý, còn40946 lá OPEN; không được chạy tiếp hoặc làm lại.
208 gốc còn OPEN và78 gốc không có ký hiệu O chỉ là số liệu từ đầu ra producer,
không phải các miền hình học đã được kiểm độc lập hay đóng nghĩa vụ toán học.

Bộ kiểm độc lập từ chối đúng vì đầu ra chưa hoàn chỉnh, trước khi tính lại các
lá hoặc toàn cây. Các kiểm ban đầu và hồ sơ chi phí đạt nhưng không thay thế
chứng minh toàn miền. Không có phản ví dụ D<=0. Đây không phải kết luận bất khả
thi hoặc hết ngân sách: dừng do giới hạn nút của một lần thử được duyệt.

Producer có hai tiến trình toán và hai kiểm cú pháp thông thường; tính bảo thủ
tổng10 giây trong phần75 giây. Không chỉnh nguồn cũ hay thêm hạ tầng, không có
thử tinh chỉnh kế tiếp. Main ghi checkpoint cuối và quyền định tuyến tiếp theo
phải đến trực tiếp từ chủ sở hữu, không phát sinh từ thời gian còn dư.
