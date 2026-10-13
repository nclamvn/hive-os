# K6 — compactification and a smaller, apex-free area representation

**PARTIAL — K6 OPEN.** Two exact whole-domain reductions are established
by hand, but the sharp lower bound is not. Same TIP116 PUBLIC_DISCOVERY:
all-real finite K6, `G>=40/31`, equivalently `F6>=20/93`. No general Kakeya,
novelty, formal-verification or external-human-acceptance claim.

Owner approved evaluating a new geometric representation/domain reduction,
feasibility before execution, no blind degree increase or infrastructure.
Activation 2026-10-13 01:11:58 UTC; ceiling 01:41:58 UTC. Predecessor
`PRODUCT_D4_COMPLETION_20261013.md` and all older proof attempts are preserved.

## 1. Exact compactification, without assuming an apex order

The six horizontal intervals are

    I_j(t)=[A_j-j*t, A_j-(j-1)*t], 0<=t<=1, A6=0.

Apply the determinant-one shear `x'=x+3*t`. Their triangles have horizontal
projections `J_j=[A_j+ell_j,A_j+r_j]`, where

    ell=(0,0,0,-1,-2,-3), r=(3,2,1,0,0,0),
    projection lengths=(3,2,1,1,2,3), sum=12.

Partition the union of these CLOSED projection intervals into its interval
components. Translate all triangles of each component together, until the
components abut. Within each group all geometry is unchanged. Between groups,
the original projections are disjoint; the new projections intersect only on
vertical boundary lines. Such intersections have area zero. Thus packing
preserves the total union area EXACTLY, including contacts and arbitrary
label order. Horizontal translations after the shear are just apex shifts
before it. A common translation restores A6=0.

The resulting projection hull has width at most 12. Consequently every
unrestricted placement has an area-equal representative in the compact
five-dimensional polytope

    D={A6=0: Aj-Ak <= 12-rj+ellk for every j!=k}.

These 30 linear inequalities are exactly the condition
`max_j(Aj+rj)-min_k(Ak+ellk)<=12`. They imply

    A1 in[-12,6], A2 in[-12,7], A3 in[-12,8],
    A4 in[-11,9], A5 in[-10,9].

They are NOT constraints satisfied by every original placement: their use
requires this global reduction theorem, not an unsupported box assumption.

Since D is itself contained in the unrestricted domain,

    inf_(all real A) G(A) = min_(A in D) G(A).

Attainment follows from compactness and the elementary continuity estimate
`|G(A)-G(B)|<=2*sum_j|Aj-Bj|`: the symmetric difference of a translated
interval has length at most twice its displacement, at every height.
This does not permit assuming an interior or nonsingular minimum.

The shear is optimal for THIS packing estimate. For general fixed shear c,
the sum of projection lengths is the convex function

    W(c)=sum_j[max(0,c-j+1)-min(0,c-j)].

On (2,3) it is `15-c`, and on (3,4) it is `9+c`; hence its unique minimum
is 12 at c=3. Neither a smallest possible minimizing domain nor a new area
floor follows. Disjoint, abutting projection intervals attain total width
12 and each individual coordinate extreme for this packing rule.

## 2. A better objective: integrate slice velocity, not endpoint position

Let w(t) be the actual union length of the six intervals. It is continuous
and piecewise affine, hence absolutely continuous, with w(0)=0. There are
only finitely many nonpersistent endpoint intersections. Write chi_Rj and
chi_Lj for the indicator that the corresponding endpoint is covered by
another triangle, using the existing shared-flag convention at parallel ties.

After the same shear, endpoint velocities are `Rj'=4-j` and `Lj'=3-j`.
At almost every height, exposed right endpoints minus exposed left endpoints
therefore give

    w'(t)=6 + sum_j (j-4)*chi_Rj(t) - sum_j (j-3)*chi_Lj(t).

Persistent adjacent coincident endpoints have BOTH the same coordinate and
the same velocity. Removing both or retaining both through their shared
flag cancels their contributions exactly. Other source coverage at the
coincident point is identical. Isolated contacts affect no integral. Thus
the derivative formula covers all placements, not just generic chambers.

For each ray put

    D_ray = integral_0^1 (1-t)*chi_ray(t) dt = C0(ray)-C1(ray).

Absolute continuity and integration by parts (or Fubini) now give the exact
global area formula

    G3 = 3 + sum_j (j-4)*D_Rj - sum_j (j-3)*D_Lj = G.

This is quadratic in existing coverage wires. No apex coordinate occurs
explicitly, no variable or constraint has been added, and the degree has
not increased. The earlier positional objective remains correct on genuine
geometry; the two polynomial extensions can differ on false lifts.

Before centering, the same derivation gives
`G0=3+sum(j-1)*D_Rj-sum(j)*D_Lj`. Their equality on genuine geometry also
follows from the covered-left/right count balance. The recommended form
is G3, aligned with the projection shear and with smaller coefficients.

## 3. Exact mechanism escaping the preceding obstruction

The previous full degree-four preordering no-go used the false lift

    A=(T,-100,T+1,-200,T+3/2,0), T<-300,

with the pair-13 clips set to zero and all other clips actual. Its positional
objective differed from true area by `(T+1)/8`, tending to minus infinity,
while every admissible negative certificate contribution stayed bounded.

The new objective behaves differently on EXACTLY that same false lift:

- On [1/3,3/8], the outside source still covers both affected endpoints.
- On [3/8,1/2], R1 alone becomes falsely exposed; its sheared velocity is 3.
- On [1/2,1], R3 and L1 become falsely exposed; their velocity difference is -1.

Hence

    G3_false-G_true
      =3*integral_(3/8)^(1/2)(1-t)dt-integral_(1/2)^1(1-t)dt
      =27/128-16/128=11/128.

The old divergent loss disappears and even changes sign on that example.
This is a representation change with an exact calculation, not a fitted
penalty or a claim that all false lifts have been repaired.

More generally, for valid assigned coverage bands each D_ray lies in [0,1/2].
The positive coefficients in G3 sum to 6 and absolute negative coefficients
to 12, so `-3<=G3<=6` on such lifts. Arbitrary erroneous clips can reverse
band endpoints, so this narrow bound must NOT be claimed for all false
lifts. On any bounded-wire lift, each of the five increments
`f(H)-f(S)`, `f(s)=s-s^2/2`, lies in [-1/2,1/2]. The safe coarse bound
`-42<=G3<=48` still rules out the old unbounded-apex objective mechanism.

Compactification is a separate escape: it excludes the unbounded true
recession cones used to constrain SOS rows. G3 does not need compactification
to be exact. The two reductions may be used independently or together.
Neither invalidates the earlier theorem for its frozen objective/grammar.

## 4. The equivalent geometric model is smaller

The coefficients of D_R4 and D_L3 are zero. Their two independent coverage
networks can be omitted, retaining every clip and shared flag. Each omitted
ray uses 36 paired-sort outputs and 8 maxima, with 18 linear equations,
44 quadratic equations and 34 linear inequalities.

Any assignment of the remaining exact clipping/flag graph extends to the
omitted networks by performing their prescribed sort/max operations.
Conversely deletion preserves all remaining constraints. Thus the projected
feasible geometry and objective are equivalent, including tied routes.

The reduced representation has:

| Item | Count |
| --- | ---: |
| Variables | 490 = 5 apex + 40 clips + 5 flags + 10*44 coverage wires |
| Linear equations | 180 |
| Quadratic equations | 445 |
| Linear inequalities | 430; or 460 if the 30 compact-domain inequalities are used |
| Quadratic inequalities | 90 |
| Objective degree | 2 |

This is an exact MATHEMATICAL model reduction, not an implementation change.
It does not prove equal truncated-SOS power: a certificate on the larger
model might use the omitted wires as multiplier masks. The smaller model
is not silently declared degree-four complete.

## 5. Feasibility test: degree two still fails, even on D

Use two false assigned-band lifts with

    Z=4/5 with weight 3/5; Z=-6/5 with weight 2/5;
    Aj=(j-6)*Z, so E[Z]=0.

Set every clip to zero EXCEPT pair-16 denominator-5 and denominator-4 clips:
both are 4/5 at the positive atom and zero at the negative atom. Its
denominator-6 clip remains zero. Flags are actual (all 1 or all 0), and
all sort/max operations are actual on these assigned bands.

The sheared projection hulls are [-4,0] and [-3,9], of widths 4 and 12.
Thus all compact-domain inequalities hold at BOTH atoms. Every equation
vanishes pointwise. All nonclip inequalities and every product of linear
inequalities are nonnegative pointwise. For clipping margins

    g_plus=(c-tau)*tau, g_minus=(tau-c)*(1-tau),

ordinary zero clips have E[g_minus]=0 and g_plus=0. For the special
denominator-5 clip, E[g_minus]=12/25 and E[g_plus]=0. For denominator 4,
E[g_minus]=72/125 and E[g_plus]=12/125. These are all nonnegative.

The parallel coverage contributions cancel in G3. The only positive-length
nonparallel false coverage is [0,4/5] on R1 and L6 at the positive atom.
Its weighted length is `4/5-(4/5)^2/2=12/25`. Therefore

    G3_positive=3-6*(12/25)=3/25, G3_negative=3,
    E[G3]=159/125, E[G3-40/31]=-71/3875<0.

This excludes the full degree-two preordering, even with D: quadratic
generators have only nonnegative constant SOS multipliers at total degree
two; free SOS have nonnegative expectation; all equation terms vanish.
It is NOT a physical counterexample. This new dual works for both the
578- and 490-variable velocity representations.

A specific allowed degree-four interaction escapes this dual:

    g_minus(pair16, denominator6) * tau(pair16, denominator5)^2.

Its expectation is exactly `-32/125`. It is nonnegative on genuine geometry
and has total degree four, using only existing within-pair crossing information.
This proves the degree-two separator does NOT certify degree-four failure.
It does NOT provide the target identity or establish that one exists.

## 6. Go/no-go before computation

GO for the exact compactification and apex-free representation as mathematical
tools. NO GO for a dense global SOS allocation or an unqualified solver run.
Degree two has a decisive exact rejection; degree four remains unresolved,
not disproved, not certified, and not promoted merely by removing old barriers.

A full free quartic SOS on 490 variables has a Gram matrix of order
`binomial(492,2)=120786`. Its raw dense double array alone would use
`8*120786^2=116714062368` bytes, about 116.7 GB, before solver overhead.
This is a static hand count, not an allocation or a runtime estimate.
Sparse supports require an actual coupled identity; their existence, total
solve cost and exact coefficient/PSD recovery have NOT been qualified here.

The remaining sharp obligation, now in bounded coverage moments, is exactly

    3*D_R1+2*D_R2+D_R3+D_L4+2*D_L5+3*D_L6
      -2*D_L1-D_L2-D_R5-2*D_R6 <= 53/31.

It must hold jointly for all genuine six-triangle placements, including all
boundaries. The retained sharp placement and target do not change. No new
area floor, complete minimum classification or whole K6 certificate follows
from the representation or the local quartic diagnostic.

## 7. Verification and scope ledger

- R116-1: PARTIAL. Exact whole-domain representation/reduction established;
  the committed sharp lower-bound proof remains OPEN.
- R116-2: hand challenge covered arbitrary ordering, disconnected components,
  contacts, shared parallel flags, invalid-band caveats, objective extensions,
  variable-count reduction and an exact new degree-two obstruction.
- R116-3: preflight recorded; no new degree, solver or infrastructure released.

Minimal Vibecode was used for Main/Builder/critic hand work and its record.
Builder supplied compactification, a local bounded-clip identity and the new
two-atom obstruction through messages; transport interruptions occurred.
Do not infer a completed Builder file or an executed solver from those messages.
Main derived the velocity objective and checked the two-atom arithmetic;
the existing critic independently checked the implications and counts.
Main new-derivation STOP was observed 01:22:42 UTC; subsequent work was
literal review and recording. The critic stopped its own new derivation
at 01:19:35 UTC, then FULL-read this Main note, sections 1–8, at observed
01:23:01 UTC: ACCEPTED, no blocking correction. Its complete saved note is
`CRITIC_GEOMETRIC_REDUCTION_20261013.md`; Main read its proof and review.
Builder's later final-read request also suffered a transport interruption;
no completed final Builder read is claimed. The mathematical checks above
are AI hand checks, not Lean or external human review. Ordinary `git diff
--check` passed; this is a document whitespace check, not a proof check.

Mathematical subprocesses, numerical searches, SDP runs, builds, installs,
UI/API/DB/Git writes, new infrastructure or gates: 0. Product source is not
changed. No scratch copy or deletion; nothing removed. Pre-existing work is
preserved. Build/type/lint/test suites are NOT RUN, not reported as passing.

## 8. Kết luận tiếng Việt

Đã chứng minh hai thay đổi áp dụng cho TOÀN miền, không phải một họ con:

1. Trượt ngang bảo toàn diện tích rồi dồn các cụm hình chiếu rời nhau lại.
   Mọi cấu hình ban đầu có một đại diện cùng diện tích trong miền compact
   xác định bởi 30 bất đẳng thức tuyến tính. Cực tiểu toàn cục được bảo toàn
   và có đạt được; không giả định thứ tự đỉnh tự nhiên hay bỏ qua biên.
2. Tính diện tích bằng tốc độ thay đổi độ dài lát cắt. Công thức mới không
   chứa tọa độ đỉnh trong mục tiêu, vẫn bậc 2, và cho phép bỏ hai mạng phủ
   không còn đóng góp: giảm biểu diễn từ 578 xuống 490 biến phụ và biến gốc.

Cơ chế vượt trở ngại cũ là cụ thể: trên chính họ gán sai đã làm mục tiêu
cũ giảm vô hạn, sai lệch của mục tiêu mới chỉ bằng 11/128, không phụ thuộc
vị trí cụm. Phép giảm miền cũng loại các hướng đi ra vô hạn. Đây không phải
thêm hình phạt hoặc chạy lại mẫu SOS đã bị bác bỏ.

Kiểm khả thi vẫn nghiêm: một phản ví dụ đại số hai điểm bác bỏ chứng chỉ
bậc 2 ngay cả trên miền compact mới. Một tích bậc 4 giữa các clip của cùng
cặp vượt được phép thử đó, nhưng CHƯA có đồng nhất thức cho cận 40/31.
Không chạy bộ giải lớn: ma trận Gram đặc toàn cục riêng phần dữ liệu thô
đã khoảng 116,7 GB. Chưa chứng minh tính khả thi của một mẫu thưa đầy đủ.

**K6 chưa khép và chưa có cận dưới mới.** Kết quả của lượt này là phép giảm
toàn cục và biểu diễn toán học phù hợp hơn, kèm kiểm tra loại bậc 2; không
được gọi thành đột phá của bài toán. Việc tiếp theo đáng làm là tìm một
đồng nhất thức có cấu trúc cho bất đẳng thức phủ có trọng số ở mục 6,
giữ tương tác các clip và nguồn phủ, trước khi cấp tài nguyên tính toán.
