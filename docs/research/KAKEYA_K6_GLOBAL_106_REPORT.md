# K6 global-bound campaign / Chiến dịch chặn dưới toàn cục K6

STATUS: PARTIAL_NOT_READY_FOR_GLOBAL_OPTIMUM_CLAIM — global C_T(6) is OPEN.
Owner approved60minutes/600seconds;
TIP106 keeps the exact target F6(x)>=20/93 for all real x or an exact smaller
witness. The retained TIP105 local/regional result is not that proof.

## 1. Universal pair estimate / Ước lượng cho mọi cặp

Each triangle has area1/12. For i<j, r=j−i and D=6(xj−xi),

\[
|T_i\cap T_j|=\frac16 J_r(D),\qquad
J_r(D)=\int_0^1(1-y-|D+ry|)_+\,dy\le\frac1{r+2}.
\]

The inequality holds for every D, including zero-overlap and touching cases.
For r>1 the left piece on[−r,−1] is (D+r)^2/[r(r²−1)]; the middle piece on
[−1,0] is −(r+2)D²/[2r(r+1)]−D/(r+1)+1/[2(r+1)]; the right piece on[0,1]
is (1−D)²/[2(r+1)]. The zero continuation applies outside support. The middle
concave quadratic attains1/(r+2) at D=−r/(r+2). The convex outer pieces attain
their maxima at endpoints, no larger. For r=1 the left interval collapses, and
the same middle/right argument applies.

Ước lượng giao diện tích này đúng với mọi độ dịch chuyển, kể cả các trường hợp
không giao nhau hoặc chỉ tiếp xúc. Nó được suy ra từ tích phân chính xác và cực
trị của các mảnh bậc hai, không phải từ mẫu số hữu hạn các cấu hình.

## 2. Disconnected graphs cannot beat the candidate / Đồ thị rời rạc không thể tốt hơn ứng viên

For a subset of k labels, let N be coverage multiplicity and U its union area.
Then integral N=k/12 and

\[
\int N^2=\frac{k}{12}+2\sum_{a<b}|T_{j_a}\cap T_{j_b}|
\le\frac{k}{12}+\frac13\sum_{r=1}^{k-1}\frac{k-r}{r+2}.
\]

Here the increasing subset labels satisfy jb−ja>=b−a. Cauchy–Schwarz on the
support of N proves

\[
U_k\ge\frac{(k/12)^2}{k/12+(1/3)\sum_{r=1}^{k-1}(k-r)/(r+2)}.
\]

Consequently U5>=125/936, U4>=10/81 and U3>=9/80. Also U1=1/12, and the exact
pair-union estimate gives the stronger U2>=1/6−1/18=1/9.

Define the overlap graph using **positive intersection area**, not point contact.
If disconnected, split its components into two nonempty groups. Their unions
have zero cross-intersection area, so their areas add. The three cardinality
splits give respectively

\[
1+5:\ \frac{203}{936},\qquad
2+4:\ \frac{19}{81},\qquad
3+3:\ \frac9{40}.
\]

Their smallest value is203/936. Thus, universally,

\[
\boxed{\text{disconnected positive-overlap graph}\implies
F_6\ge\frac{203}{936}=\frac{20}{93}+\frac{53}{29016}.}
\]

Với một tập con k tam giác, bất đẳng thức Cauchy–Schwarz cho chặn dưới diện tích
theo bội phủ. Nếu đồ thị giao diện tích dương rời rạc, có thể tách các thành phần
thành hai nhóm không giao nhau về diện tích và cộng hai chặn dưới. Cả ba kiểu
phân hoạch đều lớn hơn20/93. Vì vậy mọi cấu hình cạnh tranh với ứng viên phải có
đồ thị liên thông. Tiếp xúc tại một điểm không được tính là cạnh dương.

This lemma does not depend on the K5 global theorem.
Bổ đề này không phụ thuộc định lý tối ưu K5 nội bộ.

## 3. A valid compact all-real domain / Miền compact hợp lệ cho bài toán trên mọi số thực

Positive overlap is equivalent to −(j−i)<6(xj−xi)<1 for i<j. Every such edge
therefore has |xi−xj|<5/6. A simple path in a connected six-vertex graph has
at most five edges. With x6=0, connectedness implies |xj|<25/6 for every j.
Outside or on the boundary of

\[
P=[-25/6,25/6]^5,
\]

the graph cannot be connected; Section2 gives area>=203/936>20/93. Continuity
of union area and the retained20/93 witness show a global minimum is attained
strictly inside P. This establishes all-real domain completeness without
assuming full pair overlap or ordered apices.

Sau khi đặt x6=0, liên thông buộc mọi biến nằm trong hộp mở(−25/6,25/6)^5.
Bên ngoài và trên biên hộp đóng, chặn203/936 loại cấu hình tốt hơn ứng viên.
Tính liên tục bảo đảm cực tiểu toàn cục tồn tại trong hộp. Đây là phép rút gọn
đúng cho toàn miền thực, không giả định tất cả cặp đều giao nhau hay đỉnh đã có
thứ tự theo nhãn.

Crucially, connected does NOT imply ordered. For
x=(0,1/6,−1/6,0,0,0), absolute apex coordinates6xj+j are(1,3,2,4,5,6).
The overlap edges1–2,1–3,2–4,4–5,5–6 connect the graph despite the inversion.
This refutes connected⇒ordered, not the still-unproved assertion that every
below20/93 minimum is ordered. No claim that this example beats20/93 is made.

Liên thông không kéo theo thứ tự đỉnh. Ví dụ trên có đồ thị liên thông nhưng
hai đỉnh giữa bị đảo thứ tự. Nó bác bỏ phép suy luận đó; không phải phản ví dụ
có diện tích nhỏ hơn20/93, cũng không bác bỏ một định lý chưa chứng minh về thứ
tự của các cực tiểu dưới ngưỡng.

## 4. Extreme labels need genuine overlap / Hai nhãn đầu–cuối cần giao nhau đủ mạnh

For endpoint e=1 or6, let S be its positive-overlap neighbors and r their label
gaps. The other five consecutive labels, after horizontal scaling and, when
needed, the negative shear, have area>=35/183 by the corrected K5 theorem.
The endpoint adds area outside their union of at least

\[
\max\left\{0,\frac1{12}-\sum_{r\in\mathrm{gap}(S)}\frac1{6(r+2)}\right\}.
\]

Therefore this gives a valid all-real endpoint-conditioned lower bound. If the
endpoint has degree at most one, the overlap sum is at most1/18, hence

\[
\boxed{F_6\ge\frac{481}{2196}
=\frac{20}{93}+\frac{271}{68076}.}
\]

Every configuration with F6<=20/93 must have degree(1),degree(6)>=2. For an
endpoint of degree two, gap sets{3,5} and{4,5} are excluded as well: their overlap
caps2/35 and13/252 are strictly smaller than

\[
\frac1{12}-\left(\frac{20}{93}-\frac{35}{183}\right)=\frac{1351}{22692}.
\]

The other eight two-gap sets do not meet this exclusion threshold. A cap equal
to the threshold would only give F6>=20/93, not exclude equality.

Nhờ định lý K5 đã hiệu chỉnh cho khối năm nhãn còn lại, tam giác nhãn1 hoặc6
có không quá một giao diện tích dương sẽ buộc tổng diện tích lớn hơn20/93.
Cũng loại được hai kiểu khoảng cách nhãn xa{3,5} và{4,5} khi bậc bằng hai.
Các kiểu khác chưa bị loại; không được suy ra đồ thị đầy đủ hoặc thứ tự đỉnh.
Phần này phụ thuộc định lý K5 nội bộ đang chờ phản biện toán học bên ngoài.

## 5. Parallel-contact faces cannot contain a local minimum / Mặt tiếp xúc song song không chứa cực tiểu địa phương

Set absolute apex coordinates Aj=6xj+j and t=1−y. The scaled intervals are
Ij=[Aj−jt,Aj−(j−1)t], all of length t. Suppose Aj=Aj+1, with j in1,...,5;
their touching endpoints agree for every t. Vary Aj by h, leaving other apices
fixed (the gauge x6=0 is preserved).

Let U_t be the union of the other five intervals. The slice length is

\[
L_t(h)=|U_t|+t-|I_j(h)\cap U_t|.
\]

Persistent endpoint ties can only be a moving left endpoint against labelj+1's
right endpoint, or a moving right endpoint against labelj−1's left endpoint.
Same-side endpoint slopes are distinct. At a generic height, an exposed such
contact contributes max(−h,0) or max(h,0) to overlap; the corresponding UNION
central difference is −|h|. A contact covered in the interior of U_t contributes
zero. There is no positive persistent kink. Intersections of several adjacent
collision hyperplanes do not introduce another endpoint with the same slope:
every endpoint slope occurs at most twice.

Remove neighborhoods of width O(|h|) around the finitely many nonpersistent
endpoint meeting heights and t=0. On their complement, all other endpoint orders
are stable and the central difference is nonpositive. The removed set contributes
O(h²): translating one interval changes its union length by at most2|h|,
uniformly, while the removed heights have total measure O(|h|).

Choose a fixed small positive top band[t0,2t0] where the Aj=Aj+1 contact is
exposed. Different apices stay away for sufficiently small t0; equal-apex labels
tile nonoverlapping intervals and no third label interior covers this contact.
For small |h| the band's contribution is at most−t0|h| to the scaled integral.
Dividing by6 gives

\[
F_6(A+he_j)+F_6(A-he_j)-2F_6(A)
\le -\frac{t_0}{6}|h|+O(h^2)<0.
\]

At least one perturbation lowers area. Thus no local minimum lies on any
adjacent-apex collision hyperplane, including their intersections. This is a
written analytic proof challenged by the targeted critic, not inferred from a
finite collision fixture or the numerical walk.

Nếu hai đỉnh nhãn kề nhau bằng nhau, hai cạnh đầu mút tiếp xúc song song trên
một dải độ cao dương. Dịch một tam giác sang hai phía tạo phần giao dạng hàm
max; hiệu sai phân trung tâm của diện tích hợp mang dấu âm. Các giao điểm chỉ
ở một độ cao riêng lẻ đóng góp bậcO(h²), còn tiếp xúc lộ ra gần đỉnh cho số hạng
âm bậc|h|. Vì vậy ít nhất một phía làm giảm diện tích: không có cực tiểu địa
phương trên các mặt va chạm đỉnh kề nhau, kể cả khi nhiều mặt cùng giao.

Away from these hyperplanes, endpoints coincide only at finitely many heights.
The uniform translation bound just used permits differentiation under the
integral and continuity of the first derivatives by dominated convergence.
Therefore F6 is C1 there, including nonpersistent triple-concurrence and clipping
walls. By Section3 a global minimum exists inside P; by this lemma it avoids
the nonsmooth collision set and has zero FULL five-variable gradient. On any
incident open polynomial chamber, its polynomial gradient agrees with that
full gradient by continuity. No restricted face-stationarity substitution is
required at the remaining internal walls.

Ngoài các mặt va chạm đó, lập luận hội tụ bị chặn cho F6 khả vi liên tục, kể cả
các mặt đồng quy hoặc cắt biên không tồn tại suốt một dải độ cao. Cực tiểu toàn
cục tồn tại trong hộp và tránh tập không trơn, nên gradient đầy đủ theo năm biến
bằng0. Đây là tiêu chuẩn cần đúng cho mọi thứ tự đỉnh, không chỉ miền đã xét.

This excludes these faces as GLOBAL-MINIMUM locations, not by proving their
individual areas are all>=20/93. If a smaller point existed on a collision face,
the compact global minimum would be even smaller and occur elsewhere. Complete
stationary-case coverage is still necessary.

Không tuyên bố mọi điểm trên mặt va chạm có diện tích>=20/93. Chỉ chứng minh
cực tiểu toàn cục không nằm ở đó. Nếu có điểm nhỏ hơn trên mặt, cực tiểu toàn cục
còn nhỏ hơn sẽ nằm ở nơi khác. Vẫn phải bao phủ đầy đủ các trường hợp điểm dừng.

## 6. Radial stationarity restricts the bottom / Điều kiện điểm dừng theo tỷ lệ ràng buộc đáy

For any apex vector A, let L_A(r) be the scaled interval-union length and
G(u)=integral0^u L_A(r)dr. Scaling all apices by s>0 gives

\[
L_{sA}(t)=sL_A(t/s),\qquad
F(s)=\frac{s^2}{6}G(1/s).
\]

Regauging x6=0 just adds a common horizontal translation and does not change
area. L_A is continuous, so differentiation gives

\[
F'(s)=\frac{2sG(1/s)-L_A(1/s)}6.
\]

At any local minimum, s=1 is stationary and

\[
\boxed{2F(1)=L_A(1)/6=W,}
\]

where W is the original bottom union length. Each positive-gap bottom component
contains a full interval of length1/6. Three or more components would give
W>=1/2 and F>=1/4>20/93. A global minimizer at or below target has at most TWO
bottom components. This argument needs neither apex ordering nor full pair
overlap, and does not assert that two components are impossible.

Tỷ lệ hóa toàn bộ đỉnh, rồi bỏ tịnh tiến chung, cho công thức chính xác của diện
tích theo một biến s. Tại cực tiểu, điều kiện đạo hàm bằng0 buộc diện tích bằng
một nửa tổng độ dài hợp các khoảng ở đáy. Mỗi thành phần đáy có độ dài ít nhất
1/6; từ ba thành phần trở lên sẽ cho diện tích ít nhất1/4, lớn hơn ứng viên.
Vì vậy chỉ còn một hoặc hai thành phần đáy. Chưa loại trường hợp hai thành phần.

This is a necessary condition for minima, not an inequality for every arbitrary
configuration. No connected-bottom envelope refinement is used here: a touching
bridge can open under radial variation, so assuming connectedness persists would
silently omit a branch.

Đây là điều kiện cần tại cực tiểu, không phải bất đẳng thức cho mọi cấu hình.
Không dùng giả định một cầu tiếp xúc ở đáy vẫn nối khi thay đổi tỷ lệ; cầu đó
có thể mở ra và tạo thêm một nhánh phải xét.

## 7. The remaining obligation / Nghĩa vụ còn mở

Prove F6>=20/93 on the connected, endpoint-admissible configurations inside P,
including nonordered apex chambers and their incident full-gradient cases, or
give an exact smaller point. Section5 now validly excludes persistent parallel
faces as global-minimum locations. It does NOT justify deleting nonordered
chambers. No global symmetry, convexity, ordered-apex or full-overlap premise has
been proved. The bottom may have one OR two components, with nonconsecutive
label sets; no complete stationary-polynomial inventory is available for this
remaining compact domain.

Còn phải chứng minh chặn20/93 trong các cấu hình liên thông, thỏa điều kiện
hai nhãn đầu–cuối, nằm trong hộp compact; phải bao gồm thứ tự đỉnh không tự nhiên
và các đa thức điểm dừng liên quan. Mục5 đã loại mặt tiếp xúc song song bằng
chứng minh, không phải bằng việc bỏ qua chúng. Chưa có định lý đối xứng, lồi,
thứ tự đỉnh hay giao đầy đủ để thay thế nghĩa vụ toàn cục.

## 8. Execution and verdict / Thực thi và kết luận

**The committed root was NOT closed:** neither a universal20/93 lower bound nor
a smaller rational witness was established. New all-real domain/necessary-minimum
lemmas are written in Sections1–6; finite execution evidence is separate below.

**Mục tiêu cam kết chưa đạt:** chưa có chặn20/93 cho mọi cấu hình và cũng chưa
có phản ví dụ hữu tỉ nhỏ hơn. Các bổ đề rút gọn đúng cho toàn miền đã được trình
bày; chúng không thay thế chứng nhận bao phủ các điểm dừng còn lại.

### Cost-qualified refusal / Từ chối một phép chạy chưa đủ cơ sở

One exact cost pilot generated107raw/92cutting homogeneous walls for the ORDERED
normalized4D apex simplex. It processed18/92walls, retaining212prefixcells and
385vertices in0.456239s. It is not a complete cover or an independently verified
prefix coverage certificate. A generic4D arrangement upper bound is2,924,014cells,
not the actual count. A quartic extrapolation from this small prefix suggests
roughly145,000cells and, using the K5 Python stationary rate, roughly2900seconds
for stationarity alone. This is a HEURISTIC, not an impossibility proof.

Full production was not run: production plus independent4D coverage/stationary
verification did not have qualified cost inside600seconds, and, more importantly,
no universal ordered-apex reduction was available. The actual all-real domain
from Section3 includes nonordered configurations. An ordered cover, however
complete, could not close the root without that missing theorem.

Thử chi phí chỉ xét tiền tố18/92siêu phẳng của miền đỉnh có thứ tự, không phải
bao phủ toàn cục. Ước lượng chi phí là ngoại suy, không phải chứng minh bất khả
thi. Không chạy sinh toàn bộ vì chưa đủ cơ sở về tổng chi phí kiểm chứng và chưa
có định lý cho phép thay miền thực bằng miền đỉnh có thứ tự. Giữ nguyên kết quả
tiền tố và ghi rõ việc từ chối; không dùng nó để tuyên bố hoàn tất.

### Counterexample attempts and replay / Các lượt tìm phản ví dụ và phát lại

Deterministic hierarchy navigation uses42six-leaf binary trees with three leaf
orders and fixed merge-height schedules:420configurations,336distinct offset
starts after84duplicate skips. Unrestricted five-offset descent completed454,046
approximate evaluations in39.713412s, with no random restart. This is an original
topology-inspired seed recipe, not a reproduced Schoenberg/Keich construction.
Best rational replay remains(49,43,23,26,6,0)/186 with area20/93.

One topology/contact walk stopped at its52second internal cap, below its59second
outer guard. It retained162completedchambers,163stagedpolynomials,563queued
signwords and401openfrontier entries, including the interrupted chamber. Floating
rays propose neighbors and at most8selected codimension1 contacts per chamber;
they do not enumerate all facets or cells. The source scope explicitly remains
coverageNONE, with singular sets and unvisited/missing cases unresolved.

Main freshly replayed ALL196saved exact-area candidates:18full-gradient points
and178selected face-KKT points. Both unchanged rational area implementations
agree with the saved areas and coordinates; minimum remains20/93. Source counts
and401frontier entries match. This replay verifies saved AREAS, not stationarity,
feasibility, frontier completeness, missing records or complete chamber coverage.
Repeated points/candidates are not196distinct minima or196complete global cases.
Main output: `artifacts/research/tip106/MAIN_CANDIDATE_REPLAY.json`.

Tìm kiếm có cấu trúc và lượt đi qua miền kề không tìm được điểm nhỏ hơn20/93.
Main đã tính lại196diện tích lưu bằng hai thuật toán hữu tỉ; chúng khớp, nhưng
đây chỉ là kiểm các điểm đã lưu. Còn401mục biên chưa mở; không biến “chưa thấy
phản ví dụ” thành chặn dưới, tỷ lệ hoàn tất hoặc bằng chứng phương pháp vượt
một LLM đơn. Không tiếp tục gom thêm nhánh hữu hạn khi chưa có cách bao phủ đủ.

### Technical checks and resources / Kiểm kỹ thuật và tài nguyên

Builder4/6mathematical processes: costpilot0.456239s, hierarchy39.713412s,
walk52.001248s, twelve controls0.086s; sum92.256899s. Main3/6: graph arithmetic
and32endpoint masks, twelve-control replay0.088s, saved196-area replay0.527939s.
Conservative total<96seconds/600seconds,7/12processes, no compile/install.
The targeted analytic critic did hand reasoning only, no mathematical execution.
Twelve DISTINCT controls PASS Builder/Main, not24from rerunning. Main's final
helper was freshly executed; no application build/typecheck/lint is claimed.

R1 valid universal/necessary reductions established, but no ordered/full-overlap
reduction; R2 global enumeration/bound unresolved; R3 fresh finite replay and
targeted proof challenge complete only at their stated scope, whole-coverage
check absent; R4 bilingual report complete. Root verdict stays PARTIAL.
The critic is AI review, not a human referee, Lean formalization or independently
measured research-method advantage. Novelty was not assessed in this pass.

Main source-inspected pair formulas, moment arithmetic, connected-path proof,
endpoint exposure argument, persistent-contact sign and radial stationarity.
One documentation patch had a context mismatch; it was corrected, with no
mathematical run or evidence affected. No failed mathematical process or hidden
retry occurred. The timed walk is retained as PARTIAL, not a crashed or complete
run. Its earlier Builder report's unresolved parallel-face concern is now
addressed by Section5's written proof; the historical report remains unchanged.

Tổng tính toán bảo thủ dưới96giây,7/12tiến trình trong trần600giây; không cài gói
hay biên dịch. Mười hai kiểm thử khác nhau đều đạt; không tính thành24vì phát lại.
Đó là chất lượng công cụ, không phải nghiệm thu định lý toàn cục. Phản biện AI
không thay nhà toán học độc lập hoặc chứng minh Lean; chưa đo lợi thế nhân quả.

Sources/evidence live only in `artifacts/research/tip106` plus this report/TIP and
append-only checkpoints. Approximately1MiB new evidence. Original K5/K6 sources,
certificates, TIP105 report and witnesses unchanged. No UI/app/DB/auth/config/Git,
paidAPI, new gates/platform, project copy, scratch/distDir, Docker or bytecode
allocation. Nothing removed. Actual peak RSS was not measured independently;
the1GiB ceiling is not a measured RSS certificate.

Không sửa nguồn hoặc chứng chỉ cũ, UI, database, xác thực hay Git; không gọi API
trả phí, không thêm nền tảng hoặc thư mục build. Không có dữ liệu bị xóa.

## 9. Stop and research decision / Điểm dừng và quyết định nghiên cứu

Stop this campaign with the exact global obligation still open. Unused resources
are not reissued for more finite branches. Full ordered production was refused
on logical/cost grounds; finite hierarchy/contact attempts did not refute20/93.
The root is now legitimately reduced to full stationary cases in a compact
connected domain, with admissible endpoint graphs and at most two bottom
components. The missing item is a COMPLETE necessary-polynomial inventory or
a universal structural inequality on that remaining domain, not another UI gate,
hash, random run or local Hessian. No automatic successor grant follows.

Dừng lượt này với mục tiêu toàn cục còn mở. Đã có miền compact và điều kiện cần
đúng, đồng thời xử lý mặt không trơn bằng chứng minh. Vẫn thiếu danh mục đầy đủ
các đa thức điểm dừng cần xét, hoặc bất đẳng thức cấu trúc bao phủ miền còn lại.
Không tự mở chiến dịch khác hoặc lấy kết quả cục bộ thay mục tiêu20/93.
