# Lemma 8.3 — từ entropy sang luật ô điều kiện

Lượt được chủ dự án duyệt riêng, Main-only, <=40 phút, bắt đầu
2026-10-10 01:37:02UTC. Không gọi thêm model, không thay sản phẩm.

## Kết luận và phạm vi

Đã tái dựng được interface của Lemma8.3 **dưới các tiền đề stationary và
angular nêu dưới đây**. Không cần chọn một phân bố khác cho từng queried offset.
Tinh lọc đồng thời trên một lưới hữu hạn, rồi chọn resolution sau scale gap,
cho sai số o(b) và xác suất từng ô điều kiện, không chỉ entropy trung bình.

STATUS toán cục bộ: SOURCE_RELATIVE_ANALYTIC_RECONSTRUCTION. Không chứng nhận
độc lập toàn bộ nguồn, không Lean/formal certificate, không kết quả mới, không
xác nhận h(p,0)=0 hay toàn bộ Kakeya maximal. Đây là suy diễn của Main, không
phản biện ngoài hệ thống. Không tìm thấy phản ví dụ thỏa nguyên tiền đề trong
interface được kiểm; câu này không thay thế các suy diễn phía dưới.

Nguồn cố định: OpenAI, *The Kakeya maximal conjecture in three dimensions*,
September23,2026, commit fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb.
[Mục Lemma8.3 và chứng minh](https://github.com/openai/math/blob/fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb/preprints/The-Kakeya-maximal-conjecture-in-three-dimensions-September-23-2026/build/sections/60-projections.tex#L156).
Các tọa độ dòng dưới đây trỏ tới bản nguyên văn trong artifacts/research/tip094.

## 1. Những tiền đề thực sự đang dùng

- P-STATIONARY: cùng indexed event graph với atom (i,I1), weight omega_i;
  conditional theo index các atom có trọng số bằng nhau. Proposition stationary
  data, upstream-stationary.tex728–777: branching s0=1-beta, range normal trên
  một time block O(Theta_c N^o(1)), packet ownership và weights được giữ trên
  các nondeficient refinements. R_c=N^(-ell c), Theta_c=N^(-tau c), ell+tau=1.
  Chưa kiểm chứng lại toàn bộ quá trình hình học tạo proposition này.
- P-ANGULAR: angular bound với gamma>0, đối với các typical nondeficient
  (index,E0) fibers, upstream-estimates.tex185–202,366–390. Gamma không phụ
  thuộc gap đã cố định; exceptional fibers được bỏ trước khi chọn label class.
  Đã đọc statement, loss accounting và cách áp dụng; không nghiệm thu toàn bộ
  phép anisotropic normalization/critical inequality phía trước nó.
- P-FRAME: full cells và partial observations sau finer label có bounded mutual
  overlap, upstream-projections.tex103–138 và upstream-entropy.tex78–109.
  Giữ full base cell khi đổi frame; không bỏ thành phần chưa quan sát.
- P-STABLE: entropy law được định nghĩa sau đồng nhất hóa các dense tests ở
  upstream-entropy.tex63–75. Các earlier tests đã đồng nhất hóa, cùng domain
  và cell partitions, tiếp tục nằm trong cleaning list. Đây là điều kiện có
  nội dung; không được thay bằng invariance của một phân bố bất kỳ.

Finite cleaning, probability labeling, gap differentiation và label-removal
được kiểm trực tiếp như dưới đây. Không lấy kết luận của Lemma8.3 làm tiền đề.

## 2. Negative control: mean entropy không đủ

Cho D là số nguyên tăng vô hạn. Một atom có probability1/2; D^2 atom khác có
probability1/(2D^2). Khi đó

\[
 H=\log2+\log D,\qquad H/\log D\longrightarrow1.
\]

Đặt atom đầu tại gốc, các atom còn lại trên lưới phẳng trong miền bị chặn.
Một ball nhỏ quanh gốc vẫn có mass>=1/2; không có Frostman exponent1 với
constant D^o(1) ở radius D^-u, u>0 cố định. Chọn riêng nhánh nguyên tử hoặc
nhánh diffuse đều giữ mass1/2 nhưng đổi normalized entropy thành0 hoặc2.

Đây là phản ví dụ cho **suy luận chỉ dùng mean entropy / arbitrary extensive
restriction**, không phải phản ví dụ Lemma8.3: chưa có P-STATIONARY/P-STABLE.
Nguồn đã phân biệt việc này tại upstream-critical.tex480–485. Không bỏ qua
phân biệt đó để tuyên bố tìm thấy lỗi bản thảo.

## 3. Cleaning có giữ xác suất từng ô và weights không?

Chuẩn hóa original weighted event measure mu(Omega)=1. Sau finite label
pigeonholing, một class A có mass>=rho. Có L partitions được dùng để cleaning,
bao gồm mọi old domain/cell và các test mới. Chọn theta=rho/(2L).
Mỗi deficient cell bị xóa tối đa một lần, bị charge theo **original mass**;
tổng charge<=L theta=rho/2, nên mu(A')>=rho/2.
Với mọi surviving tested cell C:

\[
 \theta\mu(C)\le\mu(A'\cap C)\le\mu(C).
\]

Nếu C subset B và B cũng là một tested domain, viết
a_C=mu(A'cap C)/mu(C), a_B=mu(A'cap B)/mu(B). Posterior mu'=mu(.|A') cho

\[
 \frac{\mu'(C\mid B)}{\mu(C\mid B)}=\frac{a_C}{a_B}
 \in[\theta,\theta^{-1}].
\]

Do đó conditional exponent thay đổi tối đa kappa=log(1/theta)/log N.
Đây là kiểm từng ô còn sống, không dùng expectation để thay nó. Global joint
probabilities có cùng bound sau normalization vì mu(A')>=rho/2>=theta.

Từng atom vẫn có weight omega_i trong unnormalized graph; chỉ xóa atom và
normalize total probability. Không tạo bản sao index, không reset index prior
thành uniform. Đối với conditional tests theo index, omega_i tự triệt tiêu.
Cell/domain cardinality không cần polynomial; chỉ số children của mỗi
probability test cần <=N^C. Quantized matrix/parameter observations thỏa điều
này. Assignment partitions có cardinality lớn chỉ dùng cleaning, không ép một
absolute index-mass label lên chúng.

Với một test, bỏ conditional cells probability<N^-A, A>C, mất tổng mass
<=N^(C-A). Round -log_N probability vào khoảng rộng nu, finite vector classes
có số lượng M<=product_r(2+A_r/nu). Sau tail deletion, chọn class mass
rho>=1/(2M) khi tổng tail<1/2. Thêm domain/cell cleaning thì mọi occupied
conditional exponent nằm trong cùng khoảng rộng nu+2kappa.
Nguồn: upstream-critical.tex281–337,480–485. Tính charge và ratio ở trên xác
nhận mệnh đề finite, kể cả cascades, mà không phụ thuộc số indices.

Điều này giữ các **old homogenized exponents**; không chứng minh invariance
cho một new/unhomogenized entropy test. Các rates giữ được vì các old stable
gap/rectangle tests đã đồng nhất hóa, được clean với original references,
và bounded-overlap comparisons mở rộng chúng tới các tham số liên tục.

## 4. Tại sao một refinement phục vụ nhiều offset được?

Cố định một compact admissible offset interval và c interior như trong nguồn.
Chọn b_n=2^-n (bỏ finite prefix nếu cần), epsilon_n→0. Prescribe offset grid
spacing<=b_n^2 và nested depth meshes có maximum gap eta_n→0. Ở stage n,
include **tất cả** grid offsets, depth vectors, joint/conditioning partitions,
full-cell sandwiches, finite extra labels và within-index parameter tests.
Giữ các earlier homogenized tests. List hữu hạn dù có thể rất lớn.

Thực hiện label selection một lần cho cả vector tests, không chọn class theo
offset a sẽ được hỏi. Pair law sau này phải được chọn từ graph này trước khi
query a; việc biết toàn bộ prescribed grid không phải là thích nghi theo a.

Với b_n đã cố định, lấy label accuracy nu_n<=epsilon_n b_n/10, temporal mesh
error<=epsilon_n b_n/10. Gọi M_n là số classes, L_n số cleaning partitions.
Chọn N_n đủ lớn dọc realizing subsequence để:

\[
 \frac{\log(4M_nL_n)}{b_n\log N_n}\le\epsilon_n,
 \quad b_n\log N_n\longrightarrow\infty,
 \quad\text{các finite normalized errors}\le\epsilon_n b_n.
\]

Nếu label count có log N factors thì log M_n=O_n(log log N), nên với finite
stage vẫn có thể thỏa điều kiện bằng cách tăng N. Total label/cleaning cost
và prior subpower errors đều là o(b_n) trong log_N units; không chỉ o(1).
Không giao một error đã cố định rồi bắt nó nhỏ hơn mọi b về sau. Countable
tests được lấy slow diagonal trước; chọn một N_n sau đó cho finite stage n.
Không khẳng định có graph positive-mass là giao của vô hạn restrictions tại
một resolution cố định, hay một runtime hiệu quả để xây graph này.

Same index/time tree được restrict, không reroute thành unrelated index.
Homogenized child counts không thể tăng sau restriction. Nếu endpoint loss
<=kappa_n=o(b_n), domination của deficit increments và endpoint bound cho
loss của mọi subinterval <=kappa_n, cũng là o(b_n), cộng finite profile errors
đã chọn <=epsilon_n b_n. Không dùng limit G=F để bỏ qua finite-scale errors.
Original weights giữ
nguyên; packet lower bounds dùng P-STATIONARY nondeficient persistence.
Nguồn: upstream-critical.tex339–480, upstream-projections.tex282–323.

## 5. Rectangular entropy và giới hạn theo đúng thứ tự

Base offsets của axis i là a+(1-k_i)b, với k=(0,tau,ell,1). Refinement
interval dài b u_i, 0<=u_i<=zeta_max. Do zeta_max nhỏ hơn mọi nonzero speed
gap, các intervals khác speed tách nhau; trên interval của G, các group
chậm hơn đã được quan sát sâu hơn, group nhanh hơn kết thúc trước nó.
Trừ entropy rectangles refined/base để được coefficient
j_G=phi_(S union G)-phi_S, không phải unconditional axis dimension.

Để phép trừ có lỗi o(b), gap kernel K_S^sigma(s,t) nonnegative, superadditive,
bounded by |S|(t-s). Kiểm proof upstream-entropy.tex171–263: additive envelope
m=inf partition sums, excess E=K-m có zero infimum. Vitali và charge trong
một partition có excess arbitrarily small cho centered density của E bằng0
a.e.; Lebesgue differentiation của m cho uniform expansion trên mọi interval
trong [a-Cb,a+Cb]. Không chỉ derivative ở một endpoint.

Extra label removal cũng không dùng bound H(extra label)=O(sigma) chia cho b.
Increment measures của F_sigma(a)=I(Q_a;e_(c+sigma)|e_c) là nonnegative,
nested theo sigma, bounded densities và total mass O(sigma). Densities giảm
về0 a.e. Chain rule với containing full observations R,T cho

\[
 I(Z;L_2\mid A,L_1)\le I(T;L_2\mid R,L_1)+O(1)
 \le I(T;L_2\mid R,L_0)+O(1),
\]

vì L0 subset L1 subset L2, R được A,L1 xác định và A,Z được T,L1 xác định,
up to bounded overlap. Không dùng sai mệnh đề mutual information giảm dưới
arbitrary nuisance conditioning. Giữ full starting cell; chọn C0 sao cho
min(ell,tau)(C0-1)>zeta_max với margin dương, làm unresolved frame errors
nhỏ hơn finest tested cell. Các O(1) costs chia log D biến mất.
Nguồn: upstream-entropy.tex280–375, upstream-projections.tex103–138,224–280.

Trình tự đúng: N→infinity với finite b,sigma; b→0 với sigma fixed; cuối cùng
sigma→0. Nếu h_b là limiting normalized rectangular increment thì
limsup_(b→0)|h_b/b-R^sigma|<=C f_sigma(a), với f_sigma(a)→0 a.e. và
R^sigma→R. Lấy mọi fixed sigma trong một countable sequence cho h_b/b→R.
Không cần chọn sigma_n theo queried a hay uniform differentiation rate ở
tất cả a. Finite-grid errors ở §4 cho h_b hiện thực tại N_n.

Nearest grid point a_n có |a_n-a|<=b_n^2=o(b_n). Endpoints vẫn trong một
O(b_n) window quanh actual generic a, nên uniform gap expansion áp dụng.
Rates được evaluate tại **a**, không tại a_n (a_n có thể là exceptional point).
Normalized grid error O(|a_n-a|)=o(b_n). Đây là lý do một common diagonal
làm việc a.e. và không cần refit cho từng a.

Kết quả distinct speeds: R(u)=sum_i j_i u_i. Khi tau=ell, tầng chung Y,U
có coefficient m1, phần sâu hơn có rY hoặc rU:

\[
 R(u)=a_1u_X+v_1u_V+
 \begin{cases}r_Y(u_Y-u_U)+m_1u_U,&u_Y\ge u_U,\\
 r_U(u_U-u_Y)+m_1u_Y,&u_U\ge u_Y.\end{cases}
\]

## 6. Từ exponent từng ô sang conditional Frostman

Sau §3–5, uniform conditional exponents và entropy formula xác định cùng
R(u): expectation của -log probability nằm trong cùng narrow exponent band
của mọi occupied cell. Vì normalized error=o(b), đổi đơn vị log N sang
log D=b log N cho

\[
 \mu(O_u=o\mid B)=D^{-R(u)+o(1)}
\]

uniform trên occupied tested cells, B=(E0,J0,L). Freeze nuisance axes to
zeta, selected axes to u<=zeta; ratio joint/marginal cell masses trừ đúng
hai R values. Với distinct speeds, terms nuisance triệt tiêu, exponent
t u với t là sum hai selected rates. Tied case U|Y_zeta cho
(m1-rY)u; pair (X,V)|Y_zeta,U_zeta cho (a1+v1)u. Không dùng original index
mass trong một plank thay cho indexed event probability của ratio này.

Ball radius r=D^-u trong bounded relative square gặp O(1) cells ở dyadic
scale comparable r. Nếu u chưa được test, dùng nearest **coarser** depth v,
0<=u-v<=eta_n. Ball được cover bởi O(1) cells ấy, nên

\[
 \mu(Ball_r\mid\text{nuisance},B)
 \le C D^{o(1)}D^{-tv}
 \le C D^{o(1)+t\eta_n}r^t=D^{o(1)}r^t.
\]

Như vậy mesh phải increasingly fine (có thể chọn nested); chỉ nói union
của meshes dense mà không giảm maximum gap chưa đủ cho uniform all-radius
bound. Đây là làm rõ một lựa chọn trong existential construction, không
phát hiện phản ví dụ cho statement nguồn. Support counts cũng <=D^(R+o(1))
do summing probabilities; finite sampling không tham gia chứng minh này.

## 7. Parameter laws và tied square law

Đặt e=c+b. Relative time radius D^-u tương ứng finer depth
d_t=e+bu/ell, normal radius D^-u tương ứng d_theta=e+bu/tau.
Với c interior, b nhỏ đủ thì các depth vẫn <1. Uniform time counts cho
fine/coarse conditional time mass <=N^(-s0 ell(d_t-e)+o(b))=D^(-s0u+o(1)).
Conditional theo E0 không mất power vì nondeficient coarse normal bin giữ
N^-o(b) của index/time-block mass. Angular premise cho tương tự
N^(-gamma tau(d_theta-e)+o(b))=D^(-gamma u+o(1)). Omega_i cancel trong
within-index probabilities. Bounded interval coverings xử lý centers khác.

Các exceptional angular fibers của **finite** list bị bỏ trước label
pigeonholing; chọn N đủ lớn để tổng exceptional probability nhỏ. Sau cleaning,
ratio estimate §3 giữ các upper bounds với D^o(1) factor. Không chọn label
class rồi hy vọng nó không nằm toàn trong exceptional set. All parameter
deletions/refinements precede matrix offset query và pair coupling.

Khi tau=ell, d=e+bu/ell đồng thời refine cả time và normal widths bằng D^-u.
Trong một fiber (i,E0), time block count <=D^(s0u+o(1)). Mỗi fine time block
có normal range Theta_d N^o(b), nên dùng <=D^o(1) angular bins ở width Theta_d.
Do đó number of occupied joint square cells <=D^(s0u+o(1)). Time upper mass
cho mỗi joint cell <=D^(-s0u+o(1)). Sau conditional-cell homogenization, mọi
cell cùng exponent q_u+o(1). Hai bounds và tổng mass1 buộc

\[
 q_u\ge s0u-o(1),\qquad q_u\le s0u+o(1),
 \quad \mu(Q_u\mid i,E0)=D^{-s0u+o(1)}.
\]

Điều này cung cấp cả lower và upper mass, không suy ra square regularity
chỉ từ hai marginal Frostman upper bounds. Range/branching và homogenization
đều cần. Intermediate radii dùng mesh argument như §6.

## 8. Completion / VERIFY

R1–R4:4/4 audit deliverables, không phải4/4 toàn bộ proof dependencies của
Kakeya. R1 negative control và cleaning ratio; R2 explicit finite-stage budget,
pre-offset diagonal/limit order; R3 point-law ratio, mesh và parameter square
law under P-STATIONARY/P-ANGULAR; R4 report/checkpoint. Local interface đã được
tái dựng với scope trên. Whole maximal theorem và source premises chưa được
chứng nhận độc lập. Không phát hiện một implication sai trong phần đã tái dựng.

Một nguồn42,347bytes được bổ sung: upstream-estimates.tex, pinned40-estimates.tex,
Git blob5970ca112903cdfb1cc0aea64a33069139127e4c khớp inventory; SHA256
c0f59477b115ede1db7a31c6b5246a146e72279e77b2a4155203d070472dd2fc.
Đã đọc các đoạn185–390 và các tiền đề/cleaning liên quan, không cả mục
conditional-X. Acquisition web API không đọc được; read-only curl thành công,
không gửi local data hay chạy upstream TeX. Các nguồn094 trước giữ nguyên.

Validation thực chạy:10/10 source SHA256 checks OK (9 cũ+1 mới); Git blob của
nguồn mới khớp upstream inventory; scoped git diff --check exit0; whitespace
scan các tài liệu mới không có hit (rg exit1 là no matches, không test failure).
Đã đọc và đối chiếu các đoạn được nêu, không một test số học thay chứng minh.
Build/type/lint/product tests N/A; không báo PASS cho kiểm chứng chưa chạy.
Không model/API/agent/UI/product/auth/DB/Git mutation, install, Docker, scratch,
distDir hoặc xóa gì. Không thêm parser/checker/gate. Skill Vibecode chỉ giữ
charter/report, không chuyển bài toán thành task xây hạ tầng.

Next parked, chưa thực thi: Angular Frostman bound, cụ thể registration và
completion của cùng token ensemble phải giữ packet loss E và temporal cost
pE khi anisotropic normalization/pullback plank bounds. Đừng mở campaign mới
chỉ vì interface này đã
được tái dựng. Kết quả này không đo lợi thế của HIVE so với LLM đơn lẻ.

Completion checkpoint2026-10-10 01:44:40UTC, trong giới hạn được duyệt;
STOP bounded Lemma8.3 audit. Không tự thực thi next parked obligation.
