# K6 after elimination — global lower bound not established

## Tiếng Việt

**Chưa khép K6. Lượt này không tạo cận dưới mới và không khép thêm miền
cực tiểu nào.** Mục tiêu vẫn là chứng minh trên toàn không gian thực

\[
H(A)+\mu(A)\ge\frac{40}{31},\qquad F_6\ge\frac{20}{93}.
\]

Phép loại chính xác biến thứ sáu từ lượt trước vẫn được giữ nguyên. Lượt
này thử khống chế đồng thời phần giao và khe hở, không vét từng miền.
Hai biểu diễn đúng — diện tích hợp ngoài tam giác thứ sáu và tổng giao
theo cây cực đại thay đổi theo độ cao — chưa cho bất đẳng thức đủ mạnh.
Không được thay hợp bằng tổng từng phần, hoặc đổi tích phân của cực đại
thành cực đại của tích phân.

### Điều mới được xác lập, đúng phạm vi

Một tiền đề đủ từng được giữ lại là **(P) với giả thiết thuần hình học**
đã bị bác bỏ. Nó không đúng ngay cả khi đáy liên thông, khoảng trải
nhỏ hơn `49/31`, thứ tự đỉnh không kề nhau đúng, và chỉ có một đảo kề nhau.

Trong tọa độ `I_j(t)=[A_j-jt,A_j-(j-1)t]`, lấy

\[
A=(44/21,44/21,32/7,4,136/21,136/21).
\]

Diện tích hợp thực trước và sau đổi hai đỉnh thứ ba/thứ tư lần lượt là
`921/441` và `923/441`: phép đổi **làm tăng** diện tích `2/441`.
Với `r=11/7`, `u=4/7`, đồng nhất thức gain đã lưu cho

\[
\int_B S\le\frac{106}{441},
\qquad\text{nhưng (P) đòi hỏi }\int_B S\ge\frac{120}{441}.
\]

Vi phạm ít nhất `2/63`. Nhiễu bốn đỉnh ngoài bởi
`(-e,+e,-e,+e)`, `e=1/100000`, bỏ các trùng đỉnh ngoài mà vẫn giữ vi phạm;
sai số của hiệu diện tích không quá `16e`. Đây không phải lỗi chỉ xảy ra
ở mặt suy biến. Phép tính hợp theo từng độ cao và tích phân hữu tỉ đã
được Main, Builder và critic kiểm tay riêng; không phải kiểm chứng Lean
hay nghiệm thu của chuyên gia ngoài hệ thống.

**Giới hạn quan trọng:** diện tích phản ví dụ này lớn hơn `40/31`; nó
không phải phản ví dụ K6 hay một cực tiểu cạnh tranh của cả sáu tam giác.
Nó chỉ đóng đường dùng (P) từ các điều kiện hình học nói trên. Phiên bản
thực sự dùng đầy đủ tính cực tiểu sáu tam giác vẫn chưa được chứng minh.
Hồ sơ R4 cũ được bảo toàn; kết quả này thay thế trạng thái “chưa biết”
của đúng tiền đề (P) rộng đó, không thay thế mục tiêu K6.

Một chặn scalar mạnh hơn `mu>=c-a*(H-H0)` với `a<1` cũng không thể đúng
ngay tại cấu hình K6 đạt cận trên đã lưu. Đây là giới hạn của chặn đề
xuất, không phải chứng nhận tối ưu toàn cục của cấu hình đó.

### Quyết định sau lượt này

Dừng đường chứng minh thuần hình học đã thất bại; không tự mở lượt khác,
không bổ sung điều kiện cần rồi coi là tiến triển. Nghĩa vụ còn nguyên
là một chặn ghép đủ mạnh trên toàn miền, hoặc lập luận cực tiểu đầy đủ
loại toàn bộ trường hợp còn lại. Không có chứng cứ đủ để hứa một trong
hai sẽ khép được bằng một lượt lặp lại tương tự.

## English

**Global K6 remains open. This continuation establishes no new lower
bound and excludes no whole competing-minimum class.** Exact elimination
remains valid, but neither the actual exterior-union formulation nor the
dynamic maximum-spanning-tree formulation yielded the required uniform
bound. The interaction between gaps and overlap was not paid quantitatively.

The new exact negative result refutes the previously open geometry-only
premise (P), not K6. The placement above has connected bottom, range
`11/7<49/31`, and only the central adjacent-apex inversion. Its actual
area increases by `2/441` under the proposed swap. The saved exact gain
identity bounds its S integral by `106/441`, whereas (P) demands `120/441`.
The counter persists after the stated strict perturbation, with area-
difference error at most `16e`. Its high area means it is not a competing
global minimum; no full-six-minimality theorem is refuted or proved.

The stronger scalar calibration also fails at the retained sharp witness.
Neither failure is a positive K6 milestone or a general impossibility
claim. The earlier natural-order evidence, all twelve inverted continua,
required boundary/attainment assembly and whole-proof review retain their
existing scopes. There is no novelty, general Kakeya, formal-proof or
external-acceptance claim. No automatic successor campaign is authorized.

## Evidence and execution scope

- [Main exact objective and attempt](../../artifacts/research/tip116/MAIN_GLOBAL_AFTER_ELIMINATION_20261012.md)
- [Builder calculation and review](../../artifacts/research/tip116/BUILDER_GLOBAL_AFTER_ELIMINATION_20261012.md)
- [Critic full actual-union counter and strictification](../../artifacts/research/tip116/CRITIC_GLOBAL_AFTER_ELIMINATION_20261012.md)
- [Continuation scope](../../artifacts/research/tip116/CONTINUATION_R9_GLOBAL_SCOPE_20261012.md)
- [Frozen elimination result](KAKEYA_K6_ELIMINATION_116_R9_20261012_REPORT.md)

Owner continuation observed 13:09:49 UTC on 2026-10-12. Original R9
cutoff 13:43:24 and hardstop 13:53:24 were retained, not reset. Main
recorded new-derivation stop 13:34:09; critic stopped 13:33:54. The stop
is an early definite-route-failure stop, not time exhaustion or a claim
that all possible approaches have been exhausted. Subsequent work is
literal saved-proof review and reporting only.

Builder records its derivation stop 13:32:49 and independent full counter
review 13:33:55. Final Main note/report were fully read by critic at
13:35:15 and Builder at 13:35:46, with no blocking correction at the stated
negative-result scope. Main read the final appended review records at
13:36:21. The ordinary `git diff --check` passed; it is a whitespace check,
not mathematical verification.

Mathematical subprocesses/seconds/failed starts: 0/0/0. Only hand work,
source reads and Markdown; no enumeration, optimizer, samples, app/UI,
API/DB/Git mutation, build, install, new infrastructure or new agents.
No scratch copies or build directories created; nothing removed. Frozen
predecessors and unrelated changes were preserved. Vibecode Kit was used
only for the existing Builder/critic review and scoped truthful reporting.
