# TIP108B — Coupled two-bottom-component campaign / Báo cáo cận ghép

Terminal: **PARTIAL_PROOF_STRATEGY_OBSTRUCTION**. R1 remains **OPEN**;
global finite C_T(6) remains **OPEN**. No D<=0 countercertificate and no
smaller global witness were obtained. This is not a general Kakeya result,
an independently established novelty claim, a benchmark score or a Lean proof.

Owner approval started this fresh campaign at 2026-10-11 04:28:37 UTC,
with a hard deadline 05:28:37 UTC and <=120s mathematical subprocess budget.
It stopped at 04:46:26 UTC (about 18 minutes) because the remaining coupled proof needs a
justified whole-domain argument and cost qualification; NOT because the time
or computation allowance was exhausted. The predecessor STOP/proofs and
failed strategies remain intact. No automatic successor is authorized.

## Tiếng Việt — kết quả và phạm vi

Mục tiêu giữ nguyên: với hai thành phần đáy có khoảng trống dương, hai nhóm
gồm 2+4, 4+2 hoặc 3+3 tam giác, chứng minh D=2G-(2+S)>0 trên toàn miền còn
lại, hoặc đưa phản chứng hữu tỉ hợp lệ. G=6F; S là tổng hai độ rộng độ dời,
S<=18/31. Đặt d=min(p_nhóm phải)-max(p_nhóm trái)>1; khoảng trống thực giữa
hai thành phần đáy là d-1. Không giả định điểm đang xét thỏa điều kiện cực tiểu.

Đã chứng minh ba kết quả có phạm vi liên tục, không dựa vào mẫu:

1. Cho MỌI nhóm ba nhãn nguyên phân biệt, với độ rộng độ dời s<=18/31,
   kể cả thứ tự bất kỳ và các độ dời trùng nhau,
   G_nhóm>=1-s/2+3s^2/8. Chứng minh kiểm đủ sáu thứ tự độ dời cho nhãn liên
   tiếp rồi dùng định lý chèn khoảng nhãn đã giữ từ TIP108. Đây là định lý
   một nhóm, không tự giải quyết phần giao giữa hai nhóm.
2. Cho toàn bộ loại 2+4/4+2/3+3, khi d>=57/31,
   D>=6/961>0 và F>=20/93+1/1922. Mọi nhãn, độ dời nội bộ và biên S đều
   được bao gồm. Cận này loại cả phần miền có khoảng cách không bị chặn.
3. Riêng loại 3+3, kết hợp cận nhóm mạnh hơn cho phép hạ ngưỡng xuống
   d>=7/4, với D>=4453/230640>0.

Agent phản biện độc lập đã kiểm trực tiếp các lập luận, phép phản xạ/kéo
xiên bảo toàn diện tích, công thức giao từng cặp, số cặp theo chênh lệch
nhãn và phép tính hữu tỉ. Đây là phản biện AI trong chương trình, không phải
nghiệm thu của chuyên gia ngoài chương trình hay kiểm chứng hình thức.

Đã bác bỏ hai lối tắt bằng cùng một cấu hình hữu tỉ được suy ra bằng tay:
p=(176,176,149,27,0,0)/93, nhóm trái {4,5,6}, nhóm phải {1,2,3}.
S=18/31; khoảng trống đáy 29/93. Đồ thị giao dương liên thông; hai nhãn
đầu/cuối đều có bậc 5. Hai chương trình diện tích đã giữ từ TIP098 cùng cho
F=50293/207576, tức D=5653/17298>0.

Trong khi cận cần là G>40/31, cận hỗ trợ cố định chỉ đạt
214321/172980 (thiếu 8879/172980); cận hợp bao lát ngang trên toàn chiều
cao trừ các khe kề chỉ đạt 8291/6696 (thiếu 349/6696). Vì vậy hai cận này
không thể chứng minh mục tiêu toàn miền. Đây KHÔNG phải phản chứng của D>0.
Cận ghép ở chiều cao 1/2 vẫn vượt mục tiêu tại cấu hình này, nhưng một
cấu hình không chứng minh được nó vượt mục tiêu trên toàn miền.

Chưa hoàn tất: loại 2+4/4+2 với 1<d<57/31; loại 3+3 với 1<d<7/4,
độ dời nội bộ tùy ý và mọi biên. Cận nhỏ S<=18/61 đã đóng từ trước không
bị chạy lại; phần S chưa đóng vẫn là (18/61,18/31]. Có 34 chữ ký nhãn
cần thiết còn lại; chúng KHÔNG phải 34 miền hình học đã kiểm xong. Miền
một thành phần đáy với 13 thứ tự đỉnh cũng vẫn là nghĩa vụ riêng của K6.

Điểm tắc chính xác: chưa có cận ghép giữ đồng thời khoảng cách giữa nhóm,
mọi độ dời thành viên, hiệu chỉnh các khe được tam giác khác bắc cầu và
hiệu chỉnh giao bị đếm nhiều lần. Chưa có định lý cho phép thay toàn 34
chữ ký bằng trường hợp {4,5,6}/{1,2,3}. Các phép tính của trường hợp khó
đơn lẻ, phép tuyến tính hóa tại một điểm hay cực trị từng cặp độc lập
không được dùng thay nghĩa vụ này.

Không có cơ sở để tiếp tục mở rộng hạ tầng hoặc gom thêm nhánh nhỏ. Bước
nghiên cứu kế tiếp, nếu được định tuyến, phải đưa ra một cận ghép thật sự
bao phủ toàn miền hoặc một chứng chỉ phản chứng hợp lệ; nếu cần phân miền
liên tục đầy đủ, phải xác định phạm vi và chi phí trước. Lượt này không
tuyên bố việc đó bất khả thi, cũng không tự mở bộ vét miền mới.

## English — scope and proof summary

The approved obligation was universal D=2G-(2+S)>0 on every remaining
two-component 2+4/4+2/3+3 configuration, or an exact admissible D<=0
countercertificate. Bottom groups have strictly positive separation,
S<=18/31, arbitrary internal offsets, ties and labels. Define
d=min_R p-max_L p>1; the actual bottom gap is d-1. No radial-stationarity
assumption was used to prove an inequality intended to exclude it.

The new three-label theorem is G_3>=1-s/2+3s^2/8. The complete proof,
including six offset orders and the retained same-functional gap-insertion
dependency, is in BUILDER_HAND_NOTES.md. Its explicit reflection is the
area-preserving shear X'=s+1+(j_min+j_max-1)y-X.

A reversed cross pair of rank r>=2 and displacement D_ij>=d has scaled
intersection J_r(D_ij)=(r-D_ij)_+^2/[r(r^2-1)]. There are at most two
rank-two directed cross pairs (one in each of chains 1,3,5 and 2,4,6),
and at most 3/2/1 of ranks 3/4/5. Hence cross-group intersection
O<=V(d)=2J_2(d)+3J_3(d)+2J_4(d)+J_5(d). For 1<d<2,
V(d)=d^2/2-73d/30+16/5; each J_r is nonincreasing on d>1.

Combining V(57/31)=400/961 with the retained proper-group theorem yields
G>=1243/961, D>=6/961 and F>=20/93+1/1922, universally for d>=57/31.
For 3+3, a^2+b^2>=S^2/2 and the new group theorem give
D>=2-2S+3S^2/8-2V(d). At d>=7/4, use V(7/4)=227/480 and the decreasing
span polynomial to obtain D>=4453/230640>0. Beyond d=2, use monotonicity
of J_r, NOT extrapolation of the displayed polynomial.

The near-separation domains remain open, as does the separate global
one-bottom-component domain. The stronger group theorem and far tails are
genuine scoped analytic progress, but do not close R1 or establish global
K6 optimality. No literature novelty or comparison with a bare LLM was
measured in this campaign.

The hand-derived exact point falsifies the sufficient-target claims for
the fixed-support and full-hull-minus-wedges lower functionals. It does
NOT falsify the actual defect inequality: both retained independently
authored exact area methods agree on its positive D. Main reviewed the new
diagnostic helper and replayed both versions in fresh processes. This is
finite diagnostic verification, not independent reimplementation of a
universal proof. The still-valid half-height lower functional remains
unproved across the whole offset/label domain.

## Evidence and actual resource ledger

- Full hand proofs/attempts: artifacts/research/tip108b/BUILDER_HAND_NOTES.md.
- Far-tail proof and independent challenges:
  artifacts/research/tip108b/MAIN_FAR_GAP_PROOF.md.
- Builder ledger: artifacts/research/tip108b/BUILDER_COMPLETION.md.
- Exact diagnostic payloads: BUILDER_COUPLED_FUNCTIONAL_CONTROL.json and
  BUILDER_WHOLE_HULL_CONTROL.json in the same artifact directory.
- Builder: two mathematical processes, no failures; internal total
  0.012573458s; conservative wall/import charge 2s of 75s.
- Main: two fresh mathematical replays, no failures; internal elapsed
  0.003868917s and 0.004200125s; conservative charge 2s of 45s.
- Aggregate: four mathematical processes, conservative charge **4s/120s**;
  no invocation quota, no reset, reissued allowance or paid API. The allowance
  is a ceiling, not a reason to spend time on an invalid proof shortcut.
- Critic: hand-only, no mathematical processes or edits. Three scoped passes:
  common far-tail, G3 theorem, refined 3+3 far-tail.
- One documentation patch had a context mismatch and made no changes; fixed
  immediately. No mathematical failures, installs, compiles or app builds.

Final helper SHA256:
f0533b10e655ff73a0154432a918861065c4798ce61b0863c525d5b374a097b1.
First JSON SHA256:
2575122ee6a94dc97d679f9954faa50feac726a9d8ba323c4530880274966197.
Whole-hull JSON SHA256:
ed93d7f2ebdd1858429ffe43763e52d3bb1e4efec3d8f14ffe11def092385591.

Retained TIP098 exact helper SHA256 unchanged:
26c3b41b3bb731d67247ef1033e94ba4e0dbb0b58aa662858bafe0603596cf55.
TIP108 charter and proof pins also remain unchanged (listed in TIP108B).
All mathematical outputs are new in artifacts/research/tip108b; only durable
commitment/handoff appendices were updated. Existing uncommitted research
103–108 was preserved. No UI/app/DB/auth/config/Git/runtime grant changes,
Docker operation, project copy, scratch directory, distDir or deletion.

Vibecode Kit supplied one scoped Builder and gap-specific independent
challenge, with a minimal TIP/proof/report handoff; it did not introduce
new product gates or infrastructure. Human routing is required before any
successor campaign; this partial terminal is not a permission to drift.
