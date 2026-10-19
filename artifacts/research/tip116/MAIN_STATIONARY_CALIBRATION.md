# K6: stationary calibration by projection normality

Status: hand proof on an explicitly delimited exact-area class. This is NOT
the all-real K6 lower bound. No mathematical subprocess was executed.

## 1. General lemma

Let `Q(D)=q_*+q(D-D_*)`, with `q` a homogeneous positive-definite quadratic.
Suppose the value and first derivatives of the ACTUAL area at `D` agree with

    G(D)=Q(D)-sum_k E_k(D),
    E_k(D)=1/2 dist_(W_k)(z_k(D),K_k)^2,

where every `W_k` is positive definite, every `K_k` is closed convex, every
`z_k` is affine, and `z_k(D_*)` belongs to `K_k`. If the actual full gradient
vanishes at `D`, then `G(D)>=q_*`.

Proof. Put `p=P_K^W z`, `n=z-p`, and `z_*=z(D_*)`. Projection normality is
`<n,z_*-p>_W<=0`. Squared distance is continuously differentiable, so

    grad_D E dot(D-D_*)
      = <n,z-z_*>_W
      = ||n||_W^2+<n,p-z_*>_W >= 2E.

Taking the full stationary gradient against `D-D_*` gives

    0=2q(D-D_*)-sum_k grad E_k dot(D-D_*).

Thus `q>=sum E_k` and `G>=q_*`. This is not convexity of `G`, not Jensen,
not a bound `G>=Q`, and not stationarity of a selected lower proxy. If all
anchor images are interior points of their cones, every nonzero residual
makes the displayed normality inequality strict. Equality at a stationary
point therefore forces every deficit to vanish and then `D=D_*`.

## 2. Exact nearest-alternating area

Use `D=(D1,...,D5)>0`, the actual gap-closure heights `T_i`, actual prefix
restorations, and scaled area `G=6F6`. Assume:

1. The bottom is one closed component. Actual first derivatives, including
   `T_i=1` contact faces, agree with the infinite-height gap expression.
2. Only the prefix flows `1->2`, `3->2`, `3->4`, `5->4` can be positive.
   All farther-prefix flows and all outgoing flows from cuts2/4 are zero.
3. The ACTUAL decreasing hull projection is constant on `12` and `34`;
   the ACTUAL increasing projection is constant on `23` and `45`.
   Their blocks may coarsen and may be clipped to zero.

These are actual-area assumptions, not merely assumptions on a lower
nearest-neighbor support. The exact chain formula is

    G=sum D-2+B_L+B_R-sum D_i^2/4+R1+R3+R5.

The decreasing free block cuts are

    z_L=(1-(D1+D2)/2, 1-(D3+D4)/2, 1-D5),
    W_L=diag(2,2,1), K_L={z1>=z2>=z3>=0}.

The increasing free block cuts are

    z_R=(1-D1, 1-(D2+D3)/2, 1-(D4+D5)/2),
    W_R=diag(1,2,2), K_R={0<=z1<=z2<=z3}.

The actual hull supports are their free quadratic supports minus the
corresponding squared-distance deficits. This holds because the full
projections actually lie in these block subspaces; one must not assume
it for an arbitrary natural configuration.

Each end restoration has the exact dual form

    R_end=max_(u>=0)[(D-2E)u-3u^2].

Its free maximizer is `z=(D-2E)/6`, metric `W=6`, cone `[0,infinity)`.
The central restoration is

    R3=max_(u,v>=0)[(D3-2D2)u+(D3-2D4)v-3u^2-2uv-3v^2],
    W3=((6,2),(2,6)),
    z3=((D3-3D2+D4)/8,(D3+D2-3D4)/8).

Completing the concave squares gives actual restoration equals free
restoration minus its cone-projection deficit, even when a flow is zero.
Consequently the exact value and derivatives satisfy `G=Q-E_total`.

In reflection coordinates

    a=(D1+D5)/2, b=(D2+D4)/2, c=D3,
    d=(D1-D5)/2, e=(D2-D4)/2,

the free quadratic is

    Q=3-2a-2b-c+7a^2/6+5b^2/3+3c^2/8+ab/3+bc/2
      +(7d^2+2de+13e^2)/6.

With `u=a-25/31`, `v=b-11/31`, `w=c-34/31`, completing squares gives

    Q=40/31
      +7/6(u+v/7)^2+23/14(v+7w/46)^2+31/92 w^2
      +7/6(d+e/7)^2+15/7 e^2.

The anchor is `D_*=(25,11,34,11,25)/31`. Its free hull cuts are
`z_L*=(13,17/2,6)/31`, `z_R*=(6,17/2,13)/31`; both are strictly inside
their ordered positive cones. Each end free multiplier is `1/62`, and
both central multipliers are `3/62`, also interior. The general lemma
therefore proves

    ACTUAL full stationarity in this exact class => G>=40/31,

with equality only at `D_*`. No symmetry was imposed on `D`.

At a farther-prefix terminal contact, any newly active prefix interval has
vanishing length, so its additional integrated energy has zero first
derivative. The same squared-distance expressions are C1 at pooled/zero
projection faces. Height1 contact contributes only an O(h^2) tail. These
facts permit transfer of the first-derivative identity; they do not justify
using a proxy Hessian or an unphysical second variation.

## 3. What this does and does not close

Builder Sections7--8 derive the hypotheses above for an actual competing
global minimum with a STRICT unique central maximal closure `T3`, retaining
the previously proved bottom/range/slope conditions. The independent critic
has checked their block alternatives and exact mixed far-flow algebra. This
closes the strict-central-root candidate-minimum class, including nonsymmetric
configurations, coarsened/zero hull blocks and clamped nearest restorations
previously outside region C. It is not a pointwise bound proved for every
configuration merely having that closure order.

Builder Section11 extends the central reduction to endpoint ties with strict
inner cuts, after an explicit independently reviewed repair of the
`u=c=2theta,C3=0` star boundary. It does not reuse the strict-endpoint
contradiction unchanged. Section14 separately closes the strict root2/right
subtree4 class and its reflection by the feasible opposite nearest anchor,
giving `G>=22/17>40/31`.

Other noncentral maximal closures, central/inner maximal ties and other
untreated ties, and all twelve inverted-apex continua remain obligations.
Thus `ALLreal F6>=20/93` is OPEN.

## 4. Rejected shortcut retained

A proposed negative variation in a far-left equal-wing case would change
`D1=u+h,D2=u-h`. It is invalid to keep the root's integrated left envelope
fixed merely because `D1+D2` is fixed: a new slope1 interval appears from
`u-h` to `u+h`, adding `h^2` of prefix energy. The raw-square decrease alone
therefore cannot exclude that case. The mixed branch must instead use the
exact balance/block argument, without discarding this switch contribution.

## 5. Compact exact dual for ALL natural farther restorations

This is an identity, not the missing global inequality. For cut `i`, put
`f=(f_j)_(j!=i)` and let `K_i` require nonnegative exposures nonincreasing
with distance on EACH side of that cut, separately. The integrated side
prefix envelopes satisfy

    I_i(T,D)=max_(f in K_i)[(T*1-D_other) dot f-||f||^2/2].

This is the same prefix-envelope/isotonic-support identity used for the
hulls. At the actual closure `T_i`, its maximizing `f` is the row of exact
prefix exposures, with `sum f=C_i` and `T_i=(D_i-C_i)/2`.

Consequently the exact restored area also has the single cone-dual form

    R_i=max_(f in K_i)[(D_i/2)*sum f-D_other dot f
                         -||f||^2/2-(sum f)^2/4].

Proof without an unchecked minimax exchange: at the actual maximizing row,
projection normality is
`(T_i*1-D_other-f) dot(v-f)<=0` for every `v in K_i`. This is precisely the
first-order maximum condition for the last strictly concave quadratic,
since its gradient is `D_i/2*1-D_other-f-(sum f)/2*1`. Substituting
`T_i=(D_i-sum f)/2` identifies the gradients and the objective value with
the previously established exact restored area. Uniqueness follows from
the positive-definite metric `W=I+11^T/2`.

All four other cuts are retained, not just nearest neighbors. Writing
`S=sum D`, `W^-1=I-11^T/6` gives the unrestricted free row maximizer

    z_j=S/6-D_j, j!=i.

Thus each exact `R_i` is a free row quadratic minus its weighted cone
distance. This unifies nearest clamps and farther pooling. It does not make
the unrestricted free anchor feasible; generally some of its exposures
are negative, so the calibration lemma cannot be used at that anchor.

Correction log: Main initially wrote an incorrect sum of unrestricted free
row quadratics, with coefficient `11/4`. Builder caught a duplicated
`D_i^2` term. The correct identities are

    sum_i sum_(j!=i)(D_i/2-D_j)^2=6*sum D_i^2-S^2,
    sum_i(3D_i-S)^2=9*sum D_i^2-S^2,
    sum_i R_i_free=9/4*sum D_i^2-5/12*S^2.

The incorrect coefficient was only a communicated hand proposal, never
executed or used in an accepted bound. The correction does NOT turn this
all-natural identity into closure of R116-1.

## Tiếng Việt

Đã chứng minh một bổ đề hiệu chuẩn tại điểm dừng của DIỆN TÍCH THẬT: phần
sai lệch khi ghép khối, cắt về0 hoặc tắt luồng là khoảng cách bình phương tới
một nón lồi. Tính pháp tuyến của phép chiếu ghép trực tiếp các sai lệch đó
với phương trình dừng, cho chặn `G>=40/31` trong lớp luồng láng giềng xác
định ở trên; dấu bằng buộc đúng cấu hình sắc. Đây không phải lập luận đối
xứng, không thay diện tích thật bằng hàm chặn dưới để lấy phương trình dừng.
Chưa có chứng minh toàn bộ K6: các cây gốc không ở giữa chưa được xử lý,
các cực đại đồng hạng còn lại và12 miền đảo thứ tự vẫn phải được khép.
