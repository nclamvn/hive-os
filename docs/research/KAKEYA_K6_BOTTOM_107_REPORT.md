# K6 bottom structure / Cấu trúc đáy K6 — TIP107

**PARTIAL — the global root remains OPEN / Mục tiêu toàn cục vẫn MỞ.**

The owner approved a 60-minute proof campaign with at most120seconds of
mathematical computation. The unchanged target is F6(x)>=20/93 for EVERY real
offset vector, including boundaries, or a rational smaller witness checked by
both retained exact area algorithms. Neither outcome was obtained. The old
20/93 regional minimum remains a regional result, not a global optimum.

Chủ dự án duyệt chiến dịch chứng minh tối đa60phút, tính toán hỗ trợ không quá
120giây. Mục tiêu không đổi: F6(x)>=20/93 với MỌI bộ biến thực, kể cả biên,
hoặc một cấu hình hữu tỉ nhỏ hơn được kiểm bằng hai thuật toán diện tích cũ.
Chưa đạt một trong hai kết quả. Không đổi mục tiêu thành nghiệm thu bổ đề phụ.

## 1. Model and dependencies / Mô hình và tiền đề

Let p_j=6x_j, A_j=p_j+j, t=1-y. In horizontally scaled coordinates the
triangles have slices I_j(t)=[A_j-jt,A_j-(j-1)t], width t. Write L(t) for
their union length and G(u)=integral_0^u L(t)dt. Then F6=G(1)/6.
Gauge x6=0 removes common translation; all claims are area-invariant.

TIP106 supplies global-minimum attainment in a compact all-real domain,
exclusion of adjacent-apex collision faces as local-minimum locations, the
radial identity12F6=L(1), and at most two closed bottom components for a
minimum at/below20/93. Touching intervals belong to ONE closed component.
TIP105 supplies F6>=35/183+15c/14884, where c>0 is the EXISTENTIAL K5 stability
constant from103, not a computed numerical constant. Endpoint graph exclusions
used below also depend on the corrected internal K5 theorem. These retained
analytic/computer-assisted claims still lack external human review/Lean proof.

Đặt p_j=6x_j, A_j=p_j+j và t=1-y. Các khoảng lát cắt đã nhân chiều ngang là
[A_j-jt,A_j-(j-1)t], độ dài t. L(t) là độ dài hợp, G(u) là tích phân từ0đếnu;
diện tích thật bằngG(1)/6. Quy ước x6=0 chỉ bỏ tịnh tiến chung.

Dùng các kết quả106 về tồn tại cực tiểu toàn cục, loại va chạm đỉnh nhãn kề
nhau tại cực tiểu, đồng nhất thức12F6=L(1), và tối đa hai thành phần đáy.
Hai khoảng tiếp xúc được tính trong CÙNG một thành phần đóng. Chặn105 và
các loại trừ bậc đầu–cuối phụ thuộc định lý K5 nội bộ đã hiệu chỉnh; c chỉ biết
tồn tại dương, chưa có giá trị toàn cục tính được. Không gọi phản biện AI là
phản biện toán học con người hoặc chứng minh hình thức.

## 2. New second variation / Biến phân bậc hai mới

Scale every apex by s>0 and regauge by a common translation. The exact identity is

\[
F(s)=\frac{s^2}{6}G(1/s),\qquad
F'(1)=\frac{2G(1)-L(1)}6.
\]

L is continuous and piecewise affine, with INTEGER one-sided slopes at1:
on a generic height each component contributes a right endpoint minus a left
endpoint, whose slope is a-b+1, where a is its minimum-left label and b its
maximum-right label. The finite endpoint arrangement provides a positive
one-sided neighborhood even at bottom ties or topology changes.

At stationarity2G(1)=L(1), the one-sided second derivatives are

\[
F''(1+)=[L'_-(1)-L(1)]/6,\qquad
F''(1-)=[L'_+(1)-L(1)]/6.
\]

The SIDE REVERSAL matters: s>1 samples t=1/s<1. At a local minimum both are
nonnegative. Since L(1)=12F>=140/61>2, BOTH integer slopes are at least3.
Any signature with either one-sided slope<=2 cannot be a local minimum.

More precisely, for each side with slope c_side, integrate the affine piece
L(u)=d+c_side*u, with d=L(1)-c_side. Substitution in F(s) and stationarity give
the exact identity, not a truncated Taylor estimate,

\[
F(s)-F(1)=\frac{c_{\rm side}-L(1)}{12}(s-1)^2.
\]

For a local minimum F<=20/93, L(1)<=80/31, hence on some two-sided neighborhood

\[
F(s)\ge F(1)+\frac{13}{372}(s-1)^2.
\]

The neighborhood radius is configuration-dependent and uncomputed. This is
LOCAL RADIAL rigidity, not full-Hessian stability or a global area lower bound.

Khi co giãn toàn bộ đỉnh theo s, diện tích tuân theo công thức chính xác trên.
L là hàm liên tục, tuyến tính từng mảnh; độ dốc một phía là số nguyên vì mỗi
thành phần hợp lấy hiệu hai đầu mút có độ dốc nguyên. Công thức đạo hàm bậc hai
phải ĐẢO PHÍA do t=1/s. Tại cực tiểu cả hai độ dốc phải ít nhất3; một phía có
độ dốc không quá2 sẽ loại được cấu hình đó, kể cả khi có tiếp xúc hoặc đổi
thành phần ngay tại đáy.

Tích phân từng mảnh cho đồng nhất thức bậc hai chính xác và hệ số13/372 của
độ tăng theo hướng co giãn xuyên tâm. Bán kính lân cận chưa được lượng hóa;
không suy ra ổn định theo mọi biến hay chặn diện tích toàn cục.

## 3. One bottom component: 13 orders / Một thành phần đáy: 13 thứ tự

For ONE closed connected bottom component, L(1)=1+range(p). At a subtarget
local minimum, radial stationarity gives range(p)<=49/31<2. Thus for j-i>=2,

\[
A_j-A_i=(j-i)+(p_j-p_i)\ge2-49/31=13/31>0.
\]

Only adjacent labels can invert. Adjacent-apex ties have already been excluded
as local-minimum locations; every apex order is therefore strict here.
Two adjacent inversions cannot share a label, since that would invert a
nonadjacent pair. Inverted adjacent labels are neighboring in the orderword:
all other labels must precede or follow both. Removing these blocks leaves
natural order. Conversely disjoint adjacent swaps preserve all nonadjacent
comparisons. Counts f_n=f_(n-1)+f_(n-2), f_0=f_1=1 give f_6=13.

The helper independently filters ALL720 permutations and compares survivors to
a recursively generated matching-word list. This checks the exact discrete
classification; 13 words are NOT13 polynomial chambers or complete geometry
cases. They retain continua of offsets and all relevant internal boundaries.

Nếu đáy có một thành phần đóng, độ dài hợp bằng1+cự ly giữa hai p ngoài cùng.
Điều kiện điểm dừng buộc cự ly không quá49/31. Mọi cặp nhãn cách nhau ít nhất2
vẫn có đỉnh tăng theo nhãn với khoảng cách tối thiểu13/31. Chỉ hai nhãn kề nhau
có thể đảo thứ tự; các cặp đảo không được dùng chung nhãn. Bỏ các khối hai nhãn
đó còn thứ tự tự nhiên. Công thức truy hồi đếm được13 kiểu.

Đã kiểm đủ720 hoán vị bằng một bộ lọc và một cách sinh truy hồi độc lập trong
helper. Đây là phân loại TỔ HỢP đúng; không phải chứng minh rằng đã bao phủ hết
13 miền hình học hoặc chứng minh chặn20/93 trên chúng. Tiếp xúc ở đáy vẫn thuộc
nhánh một thành phần, không bị bỏ qua.

## 4. Two components: tight, ordered groups / Hai thành phần: nhóm hẹp, có thứ tự

For TWO positive-gap bottom components with scaled offset spans S_L,S_R,
L(1)=2+S_L+S_R. Thus S:=S_L+S_R<=18/31<1. Each group has a COMMON base
intersection of scaled length at least1-S_group>=13/31 (physical13/186),
not merely positive pairwise intersections. For any i<j within a group,
A_j-A_i>=(j-i)-S_group>=13/31. Internal apex order is natural and strict;
labels within a group need not be globally consecutive, and cross-group apex
order/ties have NOT been excluded.

In original height y, an internal pair loses slice overlap exactly once at
tau_ij=[1-(p_j-p_i)]/(j-i+1), strictly between0and1. For i<j<k in the group's
label subsequence, tau_ik<=max(tau_ij,tau_jk). Indeed, if both shorter thresholds
are<=y<1, adding their defining inequalities yields

\[
1-(p_k-p_i)\le(k-i+1)y+(y-1)<(k-i+1)y.
\]

So an edge spanning an intermediate label connects that label to at least one
endpoint. A connecting path then forces every intermediate in-group label into
the same component. Internal slice components are consecutive blocks in the
GROUP subsequence, and their partition only refines as y increases. Exact
contact heights are handled by closure; their measure is zero in the integral.
A single absent adjacent edge is NOT sufficient to declare a cut: longer
edges may bridge it. Visible endpoint-envelope changes still need accounting.

Với hai thành phần đáy tách nhau thực sự, tổng độ trải p của hai nhóm không
quá18/31. Mỗi nhóm có một khoảng GIAO CHUNG ở đáy dài ít nhất13/186 trong
tọa độ thật. Các đỉnh trong nhóm tăng nghiêm ngặt theo nhãn. Không giả định
nhãn của nhóm liên tiếp, hoặc đỉnh giữa hai nhóm cũng có thứ tự tự nhiên.

Mỗi cặp nội bộ chỉ mất giao một lần khi tăng độ cao. Bất đẳng thức các ngưỡng
tau bảo đảm thành phần lát cắt là các khối liên tiếp trong dãy nhãn RIÊNG của
nhóm; phân hoạch chỉ tách, không nhập lại. Đã xử lý độ cao tiếp xúc và không
suy diễn sai rằng chỉ cần một cạnh nhãn kề mất là cả nhóm bị cắt. Những thay
đổi đầu mút lộ ra và giao chồng giữa HAI nhóm vẫn chưa được khống chế đầy đủ.

## 5. 42 necessary label signatures / 42 phân hoạch nhãn cần thiết

Let S be the LEFT group's nonempty proper label set; its complement is the
right group. For cross-pair i in left,j in right, p_j-p_i>1. Positive area
overlap is impossible if i<j, or if i=j+1. A connecting cross-edge must have
i-j>=2. Connectedness therefore requires max(S)-min(S^c)>=2.

Of62 oriented nonempty proper subsets, this excludes exactly10:
S={1,...,k},k=1,...,5, or S={1,...,m-1} union{m+1},m=1,...,5.
To verify exhaustiveness, set m=min(S^c). All labels<m belong to S, and
max(S)<=m+1 leaves exactly these prefix/almost-prefix possibilities.

Endpoint1 in the left group has NO cross-neighbor, and endpoint6 in the right
has none. Their degree is exactly group size minus one, by the common base
intersection. The retained degree>=2 condition additionally excludes
S={1,4},{1,5},{1,6}, and complements of{1,6},{2,6},{3,6}: six new signatures.
The two retained far-gap exclusions further remove
S={1,4,6},{1,5,6},{2,4,5},{3,4,5}: four new signatures.
The lists are disjoint, leaving62-10-6-4=42 necessary oriented signatures.

This count was independently challenged by hand. It is NOT a count of complete
continuous geometry cases, realizable subtarget minima, or a Catalan structure.

Gọi S là tập nhãn ở thành phần TRÁI. Do hai đáy tách nhau, cạnh giao giữa hai
nhóm chỉ có thể đi từ nhãn trái lớn hơn nhãn phải ít nhất2. Điều kiện liên thông
loại10 trong62 cách chia trái/phải. Nhãn1 ở trái hoặc nhãn6 ở phải không có
giao với nhóm ngoài; điều kiện bậc ít nhất2 loại thêm6 cách. Hai kiểu láng giềng
xa đã loại ở106 loại tiếp4 cách. Các danh sách không trùng nhau: còn42 phân
hoạch nhãn CẦN THIẾT. Đếm được42 không đồng nghĩa có42 trường hợp hình học
hoàn chỉnh hoặc42 cấu hình cực tiểu dưới ngưỡng.

## 6. A false proof shortcut, exactly refuted / Bác bỏ chính xác lối tắt sai

Put labels4,5,6 at offset0 and labels1,2,3 at offset d,1/6<d<1/4.
The groups have positive-gap bottom components. Complete slice integration gives

\[
O(d)=|U_{456}\cap U_{123}(d)|=-1/36+7d/6-3d^2,
\quad F(d)=13/36-7d/6+3d^2.
\]

Each group has area1/6. Thus group overlap is STRICTLY CONCAVE (O''=-6),
despite the convex separated-pair overlap functions. Rigid block translation
has a positive-gap minimum at d=7/36,area107/432. Moving these two blocks toward
bottom contact from that point increases union area. The full proof integrates
the connected slices below y=1/2 and rank2/rank3 pair tails above; see
artifacts/research/tip107/HAND_PROOF_AND_GAP.md, Section1.

This is NOT a full-space minimum: 2F-bottomwidth=35/216 is nonzero, and the
hand-chosen radial perturbation s=999/1000 has exact area3960377/16000000,
strictly smaller than107/432, but still above20/93. Both exact algorithms agree.
The refuted statement is group-convexity/unconditional rigid merging, NOT K6.

For a restricted equal-step3+3 family, complete rescaling/integration also gives
F(a)=107/432-35a/36+179a²/12,0<=a<=3/124. This ENTIRE family lies above20/93
by29627/1660608. It is recorded as a failed candidate for universal reduction;
arbitrary internal offsets and other label sets are not covered.

Hai nhóm{4,5,6} và{1,2,3} có đáy tách nhau nhưng diện tích giao LÕM theo d,
không lồi. Tích phân đầy đủ cho các công thức trên. Vì vậy phép suy luận từ
giao từng cặp sang giao cả nhóm, rồi ghép hai đáy để giảm diện tích, là SAI.
Điểm cực tiểu khi chỉ dịch nguyên hai khối không phải cực tiểu toàn không gian:
đã có nhiễu xuyên tâm hữu tỉ cụ thể làm giảm diện tích. Không có phản ví dụ
nhỏ hơn20/93. Họ3+3 bước đều cũng chỉ là một họ đã chứng minh riêng; không
thay thế nghĩa vụ đối với các độ dịch chuyển nội bộ tùy ý.

## 7. Exact unresolved obligation / Nghĩa vụ chính xác còn mở

For two groups define D=2G(1)-L(1)=12F-(2+S). The retained transfer yields

\[
D\ge18/61-S+45c/3721.
\]

Thus D>0 when S<=18/61; a two-component subtarget minimum must satisfy
18/61+45c/3721<=S<=18/31. A universal STRICT D>0 throughout the remaining
tight two-group domain would exclude that branch. It has NOT been proved.
Equalizing group bases, compressing their labels into high-three/low-three,
or assuming the two union-overlaps are convex are unjustified shortcuts.

Separately, the ONE-component branch still requires a valid20/93 inequality
on all13 orderword continua and relevant boundaries, or complete cost-qualified
stationary-polynomial coverage. None has been supplied. Full arbitrary-apex
natural ordering, global reflection symmetry of minimizers, and full pairwise
overlap remain unproved. An area check at finitely many points cannot replace
either obligation. No further branch collection or random search was run.

Đặt D=12F-(2+S). Chặn truyền K5 loại được mọi trường hợp S<=18/61 vì D dương,
không thể là điểm dừng xuyên tâm. Phần hai nhóm còn lại phải có
18/61+45c/3721<=S<=18/31. Vẫn thiếu chứng minh D luôn dương trên TOÀN miền
còn lại, hoặc một bất đẳng thức diện tích khác đủ mạnh. Không được coi nhóm
bước đều hay nhãn ba-lớn/ba-nhỏ là đại diện mọi cấu hình.

Nhánh một thành phần vẫn thiếu bất đẳng thức20/93 trên13 miền thứ tự liên tục,
kể cả biên liên quan, hoặc chứng nhận đa thức điểm dừng đầy đủ với chi phí phù
hợp. Chưa có chứng minh thứ tự đỉnh tự nhiên toàn cục, đối xứng của mọi cực
tiểu hoặc tất cả cặp đều giao nhau. Không dùng các kiểm hữu hạn để thay nghĩa
vụ này; không mở thêm tìm kiếm ngẫu nhiên hay gom nhánh nhỏ.

## 8. Verification and resource accounting / Kiểm chứng và tài nguyên

One Builder implemented three small create-only controls; Main source-inspected
and freshly executed all three, preserving separate MAIN_*.json records.
Each K6 coordinate control used BOTH unchanged independently authored area
algorithms in tip098. Main's replay is not a third area implementation.
All executions passed: group counterexample/radial descent,720-permutation
classification/arithmetic, and restricted3+3 formula controls.

There are SIX distinct K6 coordinate controls across seven records (a=0 repeats
d=7/36), not twelve or fourteen from reruns. The n3 rescaling check and the
discrete720-permutation classification have separate scopes. Hand proofs,
not these samples, justify the stated continuum lemmas. A targeted AI critic
challenged radial side reversal, order reduction, the42-signature count and
the missing whole-domain defect argument; no external human/Lean/novelty or
causal research-method advantage is claimed.

Builder3/3 processes:0.006485708+0.000544000+0.004876708=0.011906416s.
Main3/3:0.006488542+0.000527334+0.004814166=0.011830042s.
Internal computation sum0.023736458s; conservative total<1second/120seconds,
six invocations, each script with29second signal guard. Zero mathematical
failures/retries/compiles/installs. Ordinary document reads/hand reasoning are
not charged as mathematical subprocesses. Four documentation-only patch context
mismatches (three Main, one Builder) were corrected/discarded, without changing
mathematical results or causing a mathematical rerun.

R1 structural restrictions established at their necessary/local scope; the
universal matching inequality is MISSING. R2 hand proof challenge and exact
controls complete only within stated scopes, not global proof verification.
R3 bilingual report complete. Overall NOT_READY_FOR_GLOBAL_OPTIMUM_CLAIM.
No app build/typecheck/lint or formal proof test suite was executed or claimed.

Một Builder viết ba công cụ kiểm nhỏ; Main đọc nguồn và chạy lại đủ ba, lưu
hiện vật riêng. Các phép diện tích dùng cả hai thuật toán cũ độc lập về cách
triển khai. Có sáu cấu hình K6 khác nhau, không nhân đôi số lượng vì chạy lại.
Phân loại720 hoán vị là kiểm đầy đủ bài toán tổ hợp, không phải kiểm toàn miền
liên tục. Phản biện AI đã chỉ ra việc đảo phía của biến phân và thách thức các
phép rút gọn; chưa có phản biện con người hay kiểm Lean.

Tổng sáu tiến trình tính toán, thời gian nội bộ0,023736458giây; không cài đặt,
biên dịch, tìm kiếm tối ưu hay gọi API. Nghiên cứu chủ yếu bằng lập luận và
kiểm chứng bằng chứng, không phải đốt ngân sách. Nguồn/chứng chỉ cũ, UI,
database, xác thực và Git không sửa. Không tạo scratch, thư mục build, Docker
hay bytecode; không xóa dữ liệu. Chưa kiểm RSS độc lập, không tuyên bố chứng
nhận bộ nhớ. Tài liệu và hiện vật mới được giữ trong repository.

## 9. Terminal / Điểm dừng

Stop PARTIAL with the same global target OPEN. The false merging shortcut is
removed; subtarget minimum candidates now have13 one-component
orderwords or42 necessary two-component label signatures plus internal laminar
structure. This is genuine reduction of a proof obligation, NOT global K6
closure, novelty, a Kakeya breakthrough, or an established method advantage.
No silent extension, reissued resources or automatic successor follows.

Dừng ở trạng thái PARTIAL, giữ nguyên mục tiêu toàn cục còn MỞ. Đã loại một
chiến thuật sai và rút gọn đúng miền cần chứng minh; chưa đạt chặn20/93 toàn
cục. Không gọi số trường hợp tổ hợp là tỷ lệ hoàn tất chứng minh, không gọi
kết quả này là đột phá Kakeya hay lợi thế phương pháp đã được đo. Muốn tiếp
tục cần định tuyến vào đúng hai bất đẳng thức còn thiếu, không thêm hạ tầng.

Terminal2026-10-11 03:35UTC, approximately15minutes/60maximum. Mathematical
helper invocations6/6; no further execution or automatic resource reissue.
The decisive obstruction is the false group-merging route and absence of a
valid replacement universal inequality, not a purported completed cover.
New artifacts approximately56KiB/16MiB limit. No allocated scratch to remove.
Rechecked retained source pins: tip098 exact area26c3b41b3bb731d67247ef1033e94ba4e0dbb0b58aa662858bafe0603596cf55;
TIP105 report24a8307e3d1ccc3e5480bd53a9211c924d12e669b73c85d142b1543f3f3e5364;
TIP106 charter989840de5548e0a84ba21e19345c92e9f107bda909bd6be29d56f9ae9fd32bf3.
