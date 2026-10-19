# TIP108C independent checker — initial qualification

STATUS: READY_FOR_MAIN_BOUNDED_ATTEMPT_DECISION_ONLY. R1/R2 whole-certificate
closure is NOT established. No whole generation or whole checker was run.
Vibecode separates this checker Builder's source from Producer Builder and
Main's review; the role separation influenced implementation and controls.

## Independent implementation

`independent_checker.py` imports no producer, and independently reconstructs
the retained 34 masks, all 286 minimum-anchor charts, q-first coordinate order,
closed root boxes and exact dyadic midpoint children. Ties are covered by all
minimum choices; positive-gap signatures are not assumed consecutive labels.
Wire roots cannot supply arbitrary boxes: `initial_box` is only an isolated
control helper argument, and document verification always reconstructs ROOT_BOX.

Every P leaf is recomputed. With Q=31*2^m and H=2Q, the common q-dependent
translation has exact marginal numerators `2u_lo-q_hi,2u_hi-q_lo` on L and
`2v_lo+q_lo,2v_hi+q_hi` on R. The same q box feeds both, although their
marginal envelopes are conservatively separated. All endpoint crossings and
core deaths are included. Empty/inverted cores are absent, not negative-length
intervals. The union is affine on every open event slab; doubled midpoint
positions compute its exact integral N/(7200H^2), without producer trapezoids.
The strict integer check is N>7200H(H+S_Q), where S_Q/Q bounds S on the
admissible part of the box and is clamped at18/31.

X leaves use only all-box S_lower>18/31, S_upper<=18/61, d_upper<=1, or
d_lower>=the retained far threshold. S=18/31 is not discarded by the first
condition; boxes crossing d=1 are not discarded by the third. The complete
preorder parser consumes exactly one subtree per chart and rejects OPEN,
missing children, extra symbols, bad axes, depth/node violations, forged
P/X leaves, wrong/missing/duplicate/noncanonical roots and corrupted counts.
COMPLETE additionally checks the full binary forest identity and all claimed
counts. INCOMPLETE and CONTROL_ONLY cannot become whole proof.

Input is capped at16MiB, with a preparse cap of10000 lexical tokens, nesting6,
200000 string bytes and64-byte numeric atoms. This bounds hostile JSON object
expansion before parsing; valid complete trees have at most32768 characters.
The checker retains only input roots, a <=49-box DFS stack and <=68 event cuts
per core calculation, never an expanded forest or log. The128MiB state envelope
is conservative for these bounds; this is not an independently measured
whole-run peak. JSON duplicates and nonfinite constants are refused. Header
resource claims are checked, but claimed producer elapsed/peak values are not
independent evidence of producer operational consumption.

## Fixed controls and cost

Eleven current tests PASS: independent34/286 reconstruction; TIP108B hand point
against BOTH unchanged TIP098 exact area routines; exact core death and fully
inverted cores; genuine nonzero-width toy box with0PP positive children;
d=1/S=max boundary exclusions; exact dyadic splits; forged P/X and OPEN;
missing/extra/corrupt tree tokens; missing/corrupt roots; count tampering and
duplicate JSON keys. Mocked parser predicates are explicitly structural unit
controls, never mathematical acceptance. The genuine toy is CONTROL_ONLY,
not a proof for its whole root or a remaining near-domain family.

Two initial processes, both PASS; conservative0.4s charged of25s,24.6s remain.
First sparse128-core profile was insufficient as a high-bit qualifier. The
second fixed synthetic H=62*2^48 fixture uses54 event cuts with perturbed12
endpoint constants and nonzero-width cores:128 calls in0.015493416s, largest
observed call0.000200416s. The naive32768-call projection is3.966315s, NOT a
worst-case proof, a necessary leaf-count estimate or completion guarantee.
Details/timing retained in `CHECKER_CONTROL_RESULTS.json`; no failed math run.

Unknown uniform margin near d=1 and complete leaf count remain explicit.
Closed conservative boxes do not guarantee finite strict-positive closure.
A node/depth/time cap bounds effort only. Main must release any one bounded
whole attempt; if incomplete, this verifier refuses and no resume follows.
Global K6 and its separate one-bottom domain remain OPEN. No external referee,
Lean, novelty, A/B superiority or guaranteed full-certificate feasibility claim.

No predecessor edits, producer edits, app/UI/API/DB/Git/install/build/scratch,
new platform or agent spawning. No files were deleted; no cleanup was needed.

## Tiếng Việt

Bộ kiểm tra độc lập và11 kiểm thử cố định đạt; tái dựng đủ34 chữ ký/286 biểu
đồ, tính tích phân lõi bằng thuật toán trung điểm-affine riêng, kiểm tra cây
đầy đủ và từ chối lá giả, nhánh thiếu, OPEN/INCOMPLETE. Hai lần chạy ban đầu
tính bảo thủ0,4 giây; còn24,6 giây trong phần ngân sách Checker25 giây.
Benchmark số nguyên độ sâu48 là kiểm chuẩn chi phí, không phải bằng chứng
đủ số lá hoặc bảo đảm hoàn tất. Chưa chạy kiểm tra toàn chứng thư; chờ Main
quyết định cho phép một lần thử có chặn. Biên độ d=1/số lá chưa biết, R1/R2
toàn miền và bài toán K6 toàn cục vẫn MỞ. Không sửa lịch sử hay mã Producer.

## Pre-attempt selected-cap revision — preserved initial history

Main selects131072 processed nodes instead of the initial tentative32768,
without changing the120s campaign or30s producer/24.6s remaining checker,
16MiB artifact/128MiB state ceilings. Only MAX_NODES was changed in checker
source; no new mathematical process or whole replay was run. Initial controls,
timings and their32768-node projections above remain historical evidence,
not projections for the revised cap. Current source SHA256:
31b050be0f522e1b484a760dd74cbe4bc03efa407cdb5ffb31d1a3805b5df722.
Unchanged controls SHA256:
331e80469ca5a83d1c555fdf75e9305b15ce3a0de99990ec5d0a7175dbf85336.

This checker's retained high-bit mean projects approximately15.865s for131072
core calls; its largest observed call projects approximately26.27s, exceeding
24.6s before traversal. Neither estimate is a worst-case proof. Therefore my
profile does NOT establish a<=17s maximum projection for the revised cap.
Any later Main profile must be separately attributed. A hard-capped bounded
attempt remains possible, but sufficient full replay time is not guaranteed.
The200000-byte lexical string cap still accommodates131072 total preorder
characters plus canonical metadata; node completeness and all resource checks
remain enforced. Await separate Main release for any whole replay.

### Main clarification before the one authorized replay

The preceding15.865s/26.27s figures refer to131072 CORE CALLS, not131072
tree visits. A complete binary forest with286 roots has leaves=(nodes+286)/2,
hence at most65679 leaves at the selected cap. Core integration runs only
on P leaves; X leaves and internal splits do not require integration. Thus
this checker's retained observations project approximately7.95s mean/13.16s
maximum-observed P-leaf work; a68/54 event-count heuristic gives about16.6s.
This clarifies Main's8s/17s projection and is mathematically consistent with
the complete-forest leaf bound. It is NOT an upper-runtime proof: structural
visits, X tests, JSON parsing and variable timings are additional. Main's
single whole replay is released with24s timer after the Producer's finished
file notification. Source remains unchanged; partial evidence still refuses.

## Terminal result — actual one-attempt refusal

After Producer's finished-file notification, the one authorized command was:
`python3 -B artifacts/research/tip108c/independent_checker.py artifacts/research/tip108c/WHOLE_ATTEMPT_1.json --seconds 24`.
Exit1 was the expected refusal, not a control-test failure. Actual output:
REFUSED, reason `INCOMPLETE is not proof`, elapsed0.012909083s. Input SHA256
4bc8d5ea74e5f68411e08259002c85927cd72f85e559cd254f1202c133c5db12;
checker source still31b050be0f522e1b484a760dd74cbe4bc03efa407cdb5ffb31d1a3805b5df722.
Conservative whole-call charge0.3s; checker total3 math processes/0.7s of25s,
including this expected nonzero refusal. Initial controls remain11 PASS.

The bounded input parsed and status refusal occurred BEFORE tree/leaf replay.
Accordingly this is an independent ACTUAL REFUSAL, not R2 full-certificate
verification. No P/X leaf geometry, producer count or open-root count was
independently accepted from the incomplete file. Its metadata reports the
131072 processed-node cap,172018 created nodes,40946 OPEN leaves and6.212457s
producer time; these remain producer claims here, not independently recounted
whole-forest proof. `CHECKER_WHOLE_REFUSAL.json` preserves exact command,
output, hashes, timing and scope.

STATUS: STOP_PARTIAL_NODE_CAP_REFUSAL. R1 remaining two-group inequality OPEN;
R2 complete replay not performed because no complete certificate exists.
Global K6 including the separate one-bottom domain remains OPEN. Unused
checker time is not a grant for resumption, rerun or a successor. No further
mathematical execution, producer/source edits, deletion or scratch cleanup.

Kết thúc: một lần kiểm tra được cấp phép đã TỪ CHỐI tệp thực tế vì INCOMPLETE,
không chứng nhận các lá một phần. Ngân sách Checker tính bảo thủ0,7/25 giây
qua3 tiến trình, gồm một lần exit1 từ chối đúng dự kiến. R1 và K6 toàn cục
vẫn MỞ; R2 kiểm tra toàn chứng thư chưa thực hiện. Dừng, không tự chạy lại.
