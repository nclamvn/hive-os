# K6 / TIP116 R8 — payment bound remains unproved

## Kết quả

**Chưa khép K6. Lượt R8 không hoàn tất nghĩa vụ chứng minh chính.**
Chặn toàn cục F6 >= 20/93, cả mười hai miền đảo dương cùng các mặt biên,
và phần ghép biên/tồn tại cực tiểu vẫn mở. Không có milestone nghiên cứu
được nghiệm thu trong lượt này.

Với một cực tiểu toàn cục cạnh tranh thật của cả sáu tam giác, giữ nguyên mọi
giao, khe hở, tiếp xúc và biên gốc, đặt

    x=G(A)=(1+r)/2, u=max positive adjacent apex inversion,
    lambda=1/(1+u), h=1-lambda, B_j=lambda*A_j+h*j,
    delta=G(B)-x.

Nghĩa vụ đã duyệt là chứng minh trên TOÀN miền cực tiểu toàn cục cạnh tranh thật:

    delta <= h^2*r^2/[4*(3-x)].                         (R)

**(R) chưa được chứng minh, cũng chưa bị bác bỏ dưới đầy đủ giả thiết.**
Phép nén và phép co tiếp theo đã có công thức kiểm được, nhưng chưa có
ước lượng bảo đảm phần giảm diện tích trả đủ chi phí nén trên toàn miền.

## Phần đã kiểm được và giới hạn

Cho cấu hình sau nén có hai đỉnh kề nhau trùng nhau, đặt R=lambda*r,
d=2-R. Tách cặp đỉnh theo thứ tự tự nhiên một lượng epsilon=d/11 cho
mức giảm diện tích hợp thật ít nhất d^2/33. Phép kiểm giữ cả bốn tam giác
còn lại, không cộng trùng phần giao. Main và agent phản biện đã kiểm tay
các khoảng tiếp xúc, tính bao hàm của lát cắt và phép tích phân.

Nhưng tại cực tiểu toàn cục ban đầu, điều này chỉ suy ra

    delta >= (2-lambda*r)^2/33.

Đây là CHẶN DƯỚI của chi phí nén, không phải chặn trên (R). Ghép với
chặn trên hiện có chưa tạo mâu thuẫn trên toàn miền. Vì thế không được
dùng nó để tuyên bố đã vượt khoảng chắn hoặc đã chứng minh K6.

Các hướng khác cũng chưa khép: chặn trên theo thành phần cũ thiếu ước
lượng phần mất khi chọn lại thành phần; so sánh vị trí toàn cục của hai
tam giác lặp lại hướng R5 mà chưa trả chi phí; chỉ giữ lần giao đầu bỏ
sót lần mất giao; cận trực tiếp cuối cùng chưa giải xong tối ưu ghép và
chưa phủ các kiểu đảo ở hai đầu. Không kết quả miền con hay điều kiện
cần nào được tính thay cho chứng minh toàn miền.

## English — outcome and scope of evidence

**K6 remains open. R8 achieved zero committed mathematical closure.**
The approved uniform payment bound (R) is unproved, not refuted under
the complete actual-minimum hypotheses. All twelve positive-inversion
continua/faces and the boundary/attainment assembly remain unfinished.

A finite natural split of a compressed coapex pair decreases the actual
six-triangle union area by at least (2-lambda*r)^2/33. Main and the
independent AI critic hand-checked the contact geometry, containment and
integration. At the original global minimum this gives a LOWER bound on
delta, not the required upper payment. Available upper estimates do not
contradict it uniformly. This ingredient is not a closure milestone.

The other attempted bounds did not control the actual finite cost minus
component re-selection, complete contact history, or all asymmetric and
endpoint inversion cases. Selected branches, symmetric configurations
and necessary conditions were not substituted for full-domain evidence.
There is no accepted global K6 proof, counterexample to K6, novelty claim,
Lean certificate, or external expert validation from this run.

## Execution and decision

Activation: 2026-10-12 11:52:09 UTC (18:52:09 Vietnam).
Original derivation cutoff12:42:09; hardstop12:52:09 UTC, unchanged.
Main stopped new derivation at12:33:38; critic at12:33:11; Builder at
12:34:03 UTC. Main read the complete Builder attempt and completion at
12:35:30 UTC. Critic read the full report draft and appended Main note
at12:34:32 UTC, accepting the mathematical direction and zero-closure
wording; its requested final-status and explicit global-minimum wording
corrections were applied. These are distinct observed events, not a
shared or backdated team stop.
Critic also read the full Builder attempt/completion at12:35:14 UTC:
accepted its exact intersection bookkeeping and selected-branch algebra,
NOT the unproved joint lower bound, central-domain result, endpoint
extension or (R). Builder reread the saved report at12:35:27 UTC.
Early finalization is not cap exhaustion or failure of a proved implication.

Mathematical subprocesses/seconds/failed starts: 0/0/0. No new agents,
code/UI/database/auth/API/Git writes, build/install, enumeration, optimizer,
sampling, replay, infrastructure, scratch copy or deletion. Nothing removed.
All predecessors through R7 and unrelated work were preserved. Vibecode
Kit affected only reuse of the existing Builder/critic and truthful proof
review/reporting; it supplied no mathematical evidence.

Evidence: the new R8 scope, Main note, Builder attempt/completion and
critic note/completion in artifacts/research/tip116. The checked finite
split is detailed in CRITIC_RADIAL_PAYMENT_R8_20261012.md section6.

No automatic successor run is activated. Another identical bounded run
is not justified by this outcome alone. The next substantive decision
must concern a genuinely different complete proof mechanism or expert
review of the exact unresolved bound, not more conditions or infrastructure.
That is a routing recommendation, not an authorized strategy change.
