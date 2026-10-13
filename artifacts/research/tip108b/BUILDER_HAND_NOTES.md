# TIP108B Builder hand notes / Ghi chú chứng minh

This is an append-only campaign artifact, not a certificate that R1 is closed.
The active obligation is D=2G-(2+S)>0 for every remaining two-bottom-component
configuration of sizes 2+4, 3+3 or 4+2, with S<=18/31 and a strictly positive
bottom gap. Global K6 and the one-component domains are separate open questions.

## A stronger proper three-label group bound

For any three distinct integer labels and offset range 0<=s<=18/31,

    G_group >= 1 - s/2 + 3s^2/8.

Here G is scaled area (G=6F in the six-label problem), and offsets may be tied
or have any order. This is a group theorem, NOT the needed two-group theorem.

First take consecutive labels and subtract a common offset. Write the offsets
as (p0,p1,p2), let Delta=p2-p0, and E=(p1-p0)^2+(p2-p1)^2. The retained
horizontal-slice-hull-minus-adjacent-gap argument gives

    G_group >= 1 + Delta/2 + B - E/4,

where B is the integral of the lower/upper endpoint envelope excess. Negative
edges of the lower convex and upper concave hull of (i,pi) contribute the
square of their vertical drop divided by twice their horizontal length.
This is a LOWER bound; adjacent gaps can be bridged, so equality is not presumed.

All offset-order cases follow as below. Ties are included in these closed cases.

1. Decreasing endpoints: (s,t,0), 0<=t<=s. For t<=s/2 the lower hull
   contributes ((s-t)^2+t^2)/2 and the upper hull contributes s^2/4.
   For t>=s/2 the two hull contributions exchange. Consequently
   B-E/4=E/4+s^2/4>=3s^2/8, and Delta=-s.

2. Increasing endpoints: (0,t,s). Both negative-slope envelope energies vanish,
   Delta=s and E=t^2+(s-t)^2<=s^2. Thus the lower bound is at least
   1+s/2-s^2/4, which is no smaller than 1-s/2+3s^2/8 because
   s-5s^2/8>=0 for the present range.

3. Middle is the minimum: (s,0,t). The lower hull energy is s^2/2 and the
   upper hull energy is (s-t)^2/4. Therefore B-E/4=s^2/2-st/2, and the
   lower bound is 1-s/2+s^2/2+t(1-s)/2. It exceeds the claimed bound.

4. The reflection of case 3 is (s-t,s,0). The explicit area-preserving shear
   reflection is X'=s+1+(j_min+j_max-1)y-X, with y unchanged. It sends
   label j to j_min+j_max-j and offset p to s-p. Hence the ordered offsets
   become (s-p2,s-p1,s-p0). This covers
   the order with last offset minimum and middle offset maximum.

5. (0,s,t): lower hull energy is zero, upper hull energy is (s-t)^2/2,
   Delta=t and E=s^2+(s-t)^2. The resulting lower bound is
   1+t(1-s)/2+t^2/4>=1. The claimed bound is <=1 since s<=18/31<4/3.

6. Reflection of case 5 is (s-t,0,s), covering the remaining order.

For nonconsecutive labels, invoke the retained TIP108 gap-insertion theorem:
each integer gap enlargement from r to r+1 does not decrease the SAME
slice-hull-minus-adjacent-wedge lower functional when s<=18/31. That theorem
was independently checked in the predecessor campaign; this note does not
replace its derivative/negative-hull-edge proof with an assumption of actual
area monotonicity. Iterated insertion therefore preserves the strengthened
consecutive-label lower bound. There is no claim that the minimizer has
equal steps, and no extension of the analogous claim to four or five labels.

For two three-label groups this yields the valid bound

    G_L+G_R >= 2-S/2 + 3(a^2+b^2)/8,

where a+b=S. It alone does not bound their intersection and does not close D.

## Exact functional falsifications, not defect counterexamples

One hand-derived point was used, with no navigation or search:

    p=(176,176,149,27,0,0)/93,
    L={4,5,6}, R={1,2,3}, S=18/31, bottom gap=29/93.

Both immutable TIP098 area routines return F=50293/207576, hence
G=50293/34596 and D=5653/17298>0. The point is NOT an admissible D<=0
countercertificate and is not a smaller global K6 witness.

At this point the required G is 40/31. The fixed-zero-anchor support calibration
gives 214321/172980, below the required value by 8879/172980. The full-height
slice-hull-union minus all adjacent gap wedges gives 8291/6696, below the
required value by 349/6696. Their universally valid LOWER orientations are
not in dispute: what is refuted is that either lower bound proves the target.
The complete exact event integrations include all branch changes, rather than
extrapolating a quadratic outside its valid band.

The actual half-height coupling functional instead gives 739573/518940,
above the required value by 69973/518940 at this point. Its definition is

    Q_half = H_L+H_R - W_L-W_R
             - integral_0^(1/2) |Hull_L(y) intersect Hull_R(y)| dy
             - sum_cross_pairs integral_(1/2)^1 |I_i(y) intersect I_j(y)| dy.

H denotes horizontal slice-hull length integrated over height, not the ordinary
convex hull of planar triangles. W consists of full adjacent-label wedge caps.
Q_half<=G is universal by the gap-cover argument and the high-band union bound.
The one-point positive margin does NOT establish Q_half>(2+S)/2 on the domain.

## Coupling obstruction under investigation

Replacing all actual holes by adjacent-gap caps loses positive corrections when
a third interval bridges a potential gap. Replacing high-band group intersection
by pair sums loses multiplicity corrections. In particular, the two losses
cannot be treated as independent attained extrema. A complete proof would have
to bound Q_half over all actual offsets and labels, retain those corrections,
or prove a valid label/offset majorization. No established theorem currently
permits the critical L={4,5,6},R={1,2,3} calculations to stand for all 34 signatures.
No assertion of convex group overlap, fixed exposed boundary labels, or an
equal-step group minimizer is used.

The new Main far-separation theorem removes d>=57/31 on the whole 34-signature
domain; see MAIN_FAR_GAP_PROOF.md. Its remaining near-separation domain
1<d<57/31 is still continuous and open. The sharpened three-label bound above
adds information but does not by itself supply the missing cross-group coupling.

## Tiếng Việt: phạm vi

Đã chứng minh cận mạnh hơn cho MỘT nhóm gồm ba nhãn bất kỳ, kể cả độ dời
không theo thứ tự và các trường hợp trùng nhau. Hai phép kiểm chính xác chỉ
bác bỏ khả năng dùng hai hàm cận dưới đơn giản để đóng mục tiêu; chúng không
bác bỏ bất đẳng thức D>0. Hàm ghép tại chiều cao 1/2 vẫn là một cận dưới hợp
lệ, nhưng chưa có chứng minh nó đạt cận cần thiết trên toàn 34 miền nhãn và
mọi độ dời liên tục. Không diễn giải mẫu hữu hạn thành chứng minh toàn miền.
