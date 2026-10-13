# Conditional geometric equations, degree four — exact feasibility rejection

**Outcome: adding multiples of the existing equations cannot repair the saved
SOS/inequality support class. No numerical run is warranted. K6 remains OPEN.**

Scope: `CONDITIONAL_D4_SCOPE_20261013.md`. Owner approved conditional
geometric certificates with total degree<=4 and no infrastructure.
Activation2026-10-12 23:45:48UTC /06:45:48 Oct13 Asia/Saigon;
hardstop2026-10-13 00:15:48UTC. The exact578-variable graph is retained.
The earlier409PSD rejection and every predecessor remain frozen.

## 1. Kết luận tiếng Việt

Đã kiểm tra hướng được duyệt và tìm được một trở ngại mạnh hơn, trước khi
chạy bộ giải: **chỉ bổ sung bội của các phương trình hiện có là không đủ**,
nếu giữ các hệ số SOS của phép cắt phụ thuộc vào năm tọa độ, năm cờ dấu
kề nhau và biến cắt riêng, như mẫu đã đề xuất.

Lý do không còn là thiếu bậc ở phương trình nhị phân. Trên các hướng ra
vô cực của hình học thật, tính không âm và diện tích bị chặn ép hệ số
của các phép cắt giữa hai nhãn KHÔNG kề nhau vào dạng rất hẹp. Những
hệ số đó không phát hiện được một phép gán sai có các biến cắt bằng0
hoặc1. Phép gán mới này thỏa tất cả phương trình nối/nhị phân, nên nhân
các phương trình ấy với bất cứ đa thức nào cũng không loại được nó.

Cụ thể, phép gán đại số cho `G=-5`, trong khi mọi hạng còn lại của
chứng chỉ phải không âm. Nó bác bỏ lớp chứng chỉ, **không phải phản ví
dụ K6**: các biến cắt được cố ý gán sai so với tọa độ hình học.

Phạm vi kết luận rất quan trọng: giữ nguyên lớp hệ số SOS nói trên thì
ngay cả bội phương trình bậc cao hơn cũng không cứu được. Nhưng chưa
bác bỏ mọi chứng chỉ SOS bậc4 với các tập biến khác, tích bất đẳng thức
khác, hoặc một cách chứng minh hình học khác. Không tự triển khai những
mở rộng đó. Không có cận dưới K6 mới hay mốc khép toàn bài toán.

## 2. Candidate family and stronger theorem under review

We retain the exact boundary graph and inequalities from
`BUILDER_SPARSE_SOS_20261012.md`, sections1–5. Write A6=0 and

    Delta_i=A_(i+1)-A_i, i=1,...,5.

These five differences are independent real coordinates. The five flags
b_i encode the sign of Delta_i, with both binary choices permitted at zero.
For each pair i<j, each raw crossing has the form

    c_e = alpha_e*(Delta_i+...+Delta_(j-1)), alpha_e>0.

Its own clip tau_e has quadratic inequality generators

    g_e,+=(c_e-tau_e)*tau_e,
    g_e,-=(tau_e-c_e)*(1-tau_e),

and bounds tau_e>=0, 1-tau_e>=0. The preserved multiplier supports are

    sigma_e,+/- = sum_l r_e,+/-,l(A,b,tau_e)^2,
    deg r_e,+/-,l <=1.

The rows have no other clip or gate-wire variable. This restriction follows
from the saved clip-parent supports and degree<=2 SOS multiplier ceiling.

The approved revision permits selected existing equation multiples of total
degree<=4. Instead of choosing an arbitrary small subset, the following
rejection holds even if EVERY existing equation is multiplied by an
arbitrary polynomial. Proving impossibility in this larger family excludes
every approved subset; this is a proof comparison, not an executed expansion.
All other inequality terms remain the saved ones, with nonnegative SOS/
scalar coefficients and the specified nonclip linear-generator products.
No new inequality generator or clip-generator product is silently admitted.

## 3. Recession lemma for nonadjacent crossings

Assume such an identity for `P=G-40/31` exists. On every actual full graph,
equation terms vanish and all other summands are nonnegative. The six
triangles have total area3, so every nonnegative summand is bounded by

    P<=3-40/31=53/31.

Fix a crossing whose span S={i,...,j-1} has at least two members. An affine
row of its negative-tail multiplier is

    r(A,b,tau_e)=u dot A+a*tau_e+d+beta dot b.

Choose any open sign chamber of the independent Delta coordinates on which
c_e<0. On a ray A=R*v there, flags are constant, tau_e=0 for R>0, and
g_e,-=-R*c_e(v) grows without bound. Boundedness of g_e,-*r² forces u to
vanish on that open cone, hence u=0. It then forces

    d+beta dot b=0

for every sign pattern in which c_e can be negative. Those are exactly
the binary patterns having at least one zero in S: make that negative
Delta dominate the finite positive ones, keeping all signs strict.

Since |S|>=2, this collection includes the all-zero pattern and ALL five
unit-vector patterns. Evaluating an affine flag polynomial at these six
patterns gives d=0 and beta=0. Thus every negative-tail row is a*tau_e.

For a positive-tail row, use c_e>0 and large R, so tau_e=1 and
g_e,+=R*c_e(v)-1 grows without bound. Again u=0. The residual affine
flag polynomial at tau_e=1 vanishes whenever at least one flag in S is1.
These patterns include the all-one pattern and its five single-bit deletions.
Their differences force beta=0, and the remaining constant forces the row
to be a*(tau_e-1).

Consequently, for EVERY nonadjacent crossing in ANY hypothetical certificate
of this family,

    sigma_e,-=kappa_e*tau_e²,
    sigma_e,+=lambda_e*(1-tau_e)²,
    kappa_e,lambda_e>=0.

This proof uses actual sign chambers only as open sets for a linear identity,
not a chamber search, finite sampling or a restriction of the K6 domain.
Arbitrary equation multipliers do not affect boundedness because their
equations vanish on every true graph. In particular, both weighted quadratic
clip terms vanish whenever tau_e is assigned either endpoint0 or1, even if
that endpoint is inconsistent with the raw crossing value.

No adjacent-crossing normal form is needed for the contradiction below:
those clips are assigned their true values, so their weighted terms are
nonnegative automatically.

## 4. One exact false-lift assignment defeats every equation-only repair

Set

    A=(-10,-8,-6,-4,-2,0), all Delta_i=2, all b_i=1.

For adjacent pairs, assign the two clips their actual values:

    clip(Delta_i)=1, clip(Delta_i/2)=1.

Assign every nonadjacent clip zero EXCEPT for the pair(1,6), denominator4:

    tau_(1,6;4)=1,
    tau_(1,6;5)=tau_(1,6;6)=0.

The actual raw values for that pair are10/4,10/5,10/6, all exceeding1.
The two assigned zeros are deliberately wrong. All nonadjacent assigned
clips nevertheless belong to {0,1}, so section3 eliminates their weighted
quadratic contributions in any purported certificate.

For pair i<j with distance d>=2, the two coverage-band types are

    L_j in triangle i, R_i in triangle j: [tau_(d+1),tau_d],
    R_j in triangle i, L_i in triangle j: [tau_d,tau_(d-1)].

Thus the exceptional pair produces FULL coverage [0,1] only for rays L1
and R6. Its other two occurrences are [0,0]. Every other nonadjacent band
is [0,0]. Every adjacent band is [1,1], including the parallel band using
the true flag. All bands have valid lower<=upper ordering; no fake reversed
interval is being exploited.

Choose all sorting and prefix-maximum wires by their actual operations on
these assigned bands. Every saved equation (Boolean, paired routing and
prefix maximum) vanishes exactly. All nonclip inequality generators and
their saved pair products are nonnegative. Clip bounds are nonnegative;
adjacent quadratic clip generators are also nonnegative because those clips
are genuine. Free SOS are nonnegative at any real assignment.

The only covered boundary rays of positive height measure are L1 and R6.
Since L1=-10-t and R6=-5t, the formal area polynomial is

    G_lifted = 3 + integral_0^1 (L1-R6) dt
             = 3 + integral_0^1 (-10+4t) dt
             = -5,
    P_lifted = -5-40/31 = -195/31 <0.

But every surviving non-equation term of the supposed identity is
nonnegative, every nonadjacent weighted quadratic clip term is zero, and
every equation multiple is zero REGARDLESS of its degree/support.
Contradiction.

**Theorem:** with the preserved affine clip-SOS row supports `(A,b,tau_e)`,
no expansion solely of the existing equation multipliers can certify
`G-40/31`. Real coefficients are excluded, hence rational coefficients too.
The assignment is not a genuine clipped geometry or a negative real union
area. It refutes the certificate family, not K6 or its sharp candidate.

## 5. Feasibility decision and scientific limits

The proposed Boolean correction `b²g-g(b²-b)=bg` remains a valid identity
and escapes the previous coefficient-scaling argument. It is insufficient
for global closure: the new sign-chamber recession argument survives all
equation-only corrections and provides the stronger obstruction above.

Do NOT allocate an SDP, count an enlarged dense basis, install a solver or
increase the degree to repair this family. Equation-only augmentation is
now ruled out even beyond the degree ceiling, so that response would waste
work. The true578-variable graph remains valid. What failed is the restricted
ability of its inequality multipliers to recognize nonadjacent crossing
information from only affine functions of the existing adjacent sign flags.

Escaping this theorem would require changing at least one actual premise,
such as the allowed clip-multiplier variable supports or inequality products,
or leaving this certificate approach. No such change is implemented or
claimed feasible here. No new whole K6 lower bound, minimum-class exclusion,
external/formal acceptance or mathematical novelty claim is made.

## 6. Completion / verification record

Fixed-route feasibility: REJECTED by exact hand proof. Whole K6/R116-1: OPEN.
Main proposed the recession/false-lift argument; Builder and critic checked
the decisive formulas independently. Full literal-review results recorded
below when finished. All earlier artifacts remain frozen.

Mathematical processes0; numerical/SDP searches0; code/build/install/UI/API/DB/
Git changes0; no infrastructure, scratch or deletion. No code tests needed
or claimed. Minimal Vibecode procedure supplies the existing review and
scope record, not mathematical validity. New files are this report, scope,
one Builder note and one critic note, plus append-only active/handoff entries.

Main new-derivation STOP observed2026-10-12 23:48:53UTC; subsequent work
literal review and recording only. Early stop on decisive approved-route
rejection, not cap exhaustion or an automatic next campaign.

### Final review

Builder read the FULL Main report at observed23:50:12UTC; critic at
observed23:50:41UTC. Both accepted the complete proof and quantified support
restriction without a blocking correction. Main read both full supporting
notes. Their distinct new-derivation stops are Builder23:49:22 and
critic23:48:47UTC. These are internal separate AI hand reviews, not an
external mathematician or proof-assistant certification.

The critic caught and Builder corrected one earlier draft assertion:
actual adjacent clips do not make both quadratic generators zero. For
c=2,tau=1, g+=1. Only their NONNEGATIVITY is needed and used in this Main
proof; the withdrawn zero claim is preserved in the Builder/critic history.

Acceptance outcome: feasibility of equation-only repair with the declared
supports is resolved NEGATIVELY. Global mathematical closure R116-1 is
unmet. No numerical, partial-domain or engineering result is presented
as a substitute. Supporting notes:
`BUILDER_CONDITIONAL_D4_20261013.md`, `CRITIC_CONDITIONAL_D4_20261013.md`.
