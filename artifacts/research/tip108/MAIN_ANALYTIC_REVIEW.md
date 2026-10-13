# TIP108 — Main mathematical review / Rà soát toán học

This record verifies the new proper-group lemma and singleton-component
exclusion. It does **not** certify the entire two-component obligation or
global K6. One gap-specific AI critic independently challenged the hand
arguments; that is not external human review, Lean verification or a measured
method advantage.

## 1. Geometric lower functional

Use scaled slices `[p_i+j_i*y,p_i+j_i*y+1-y]`, with increasing distinct integer
labels `j_i` and offset range `s<=18/31<1`. A reversed disjoint pair would
require an offset difference greater than `1+(j_next-j_prev-1)y>=1`, impossible.
Consequently an uncovered point inside the slice hull separates a prefix of
group labels from its suffix. Its gap is bounded by the adjacent-label wedge
at that cut. Longer-label bridges only reduce the actual missing area.

With `r_i=j_(i+1)-j_i`, `delta_i=p_(i+1)-p_i` and hull-envelope excess `B`,

    G_group >= H = k/2 + B - sum_i (1-delta_i)^2/[2(r_i+1)].

This is a lower bound, not an equality or an assertion of convexity of area.
Each wedge starts inside height `[0,1]` because `|delta_i|<1`. All envelope
switches occur before height 1 because label gaps are at least 1 and `s<1`.

## 2. Consecutive labels: finite-path inequality

Write `p_i=s*v_i`, `v_i in [0,1]`, `n=k-1<=4`, `A=v_0`, `C=v_n`.
Define `E=sum(v_(i+1)-v_i)^2` and the two positive-line envelope integrals
`B_L,B_R` in the Builder proof. Put

    u=max_{1<=i<=n}(A-v_i)_+^2/i,
    w=max_{0<=i<n}(v_i-C)_+^2/(n-i).

Then `B_L>=u/2`, `B_R>=w/2`. For `n=4`, the four interior-order cases
(peak, valley, increasing, decreasing) prove

    E <= 2u+2w+2(1-A+C) <= 4(B_L+B_R)+2(1-A+C).

The decreasing case is a convex maximization on `0<=c<=a<=1`; all three
vertices are checked, not merely the two endpoint-extreme configurations.
The increasing case bounds the middle energy by half the two positive
boundary squares plus `1-A+C`. Appending copies of C covers shorter paths:
E and the left envelope stay unchanged, while the right envelope decreases.

Thus, for consecutive labels,

    G_group-(k+1)/4+s/2 >= s(1-s)(1+C-A)/2 >= 0.

The restriction `k<=5` is essential. The six-point path `(1,0,1,0,1,0)`
has `E=5`, `B_L+B_R=1`, `C-A=-1`, refuting an extension of this discrete
lemma to k=6. No such extension is used.

## 3. Nonconsecutive integer labels

Expand one adjacent label gap from integer r to r+1. The direct part of H
increases by `(1-delta)^2/[2(r+1)(r+2)]`. On each hull piece, the loss
derivative of B is half the sum of the squared negative crossing slopes.
There is at most one crossing edge per hull. Finite continuity and piecewise
differentiability suffice at hull switches; no omitted jumps occur.

For `delta>=0`, support inequalities force each slope to be at most
`(s-delta)/(g+1)`. Its integrated total loss is at most
`(s-delta)^2/[(r+1)(r+2)]`, smaller than the direct gain since `2s^2<1`.
For `delta=-u<=0`, each crossing slope is either `u/g` (adjacent edge) or
at most `s/(g+1)` (proper edge). The r>=2 and r=1 split comparisons in the
Builder proof reduce to convex quadratics with endpoint residuals at most
`-313/961`, `-457/961`, or `-337/961`.

Each insertion therefore preserves the **lower functional H**, not necessarily
actual union area. Iterating establishes

    G_group >= (k+1)/4-s/2

for every proper integer-label group, k<=5, s<=18/31, including offset ties.
This proof does not depend on the computer-assisted K5 global theorem.

## 4. Entire singleton-component family

A left singleton has an uncovered prefix of length at least `1-5y` for
`0<=y<=1/5`: every other left endpoint is more than that distance to its
right. The slice width `1-y` is sufficient. A right singleton has the
reflected uncovered right tail. Hence its exclusive scaled area is at least
`1/10`, independently of internal offsets of the other group.

Combining with the five-group bound gives

    G >= 8/5-S/2,
    D=2G-(2+S) >= 6/5-2S >= 6/155 > 0,
    F=G/6 >= 203/930 = 20/93 + 1/310.

This covers ALL 1+5 and 5+1 bottom-component configurations in the charter,
not a finite sample or equal-step family. No graph or radial stationarity
assumption is required. Among the retained 42 necessary signatures, it
removes eight: left singletons 3,4,5,6 and right singletons 1,2,3,4.
The remaining 34 signatures comprise 10 of size 2, 14 of size 3, and
10 of size 4. These are necessary label signatures, NOT complete geometry
cases. Their continuous offsets, cross-group coupling and boundaries remain
unproved. The separate one-bottom-component K6 obligation also remains open.

## 5. Actual Main executions

All mathematical invocations are charged conservatively at one second each;
each is below its <=30-second invocation cap. No optimization is rerun in
the four saved-dual replays.

1. Retained exact helper, n=5 auxiliary group-bound refutation: both areas
   `1109/4000`; the conjectured equal-step quadratic minimum is false.
2. Near-touch n=6 control: both areas `814013/3459600`; S=`18/31`, gap=`1/310`,
   connected graph, endpoint degrees 5, D=`70013/288300>0`. One point only.
3. Coarse saved dual: all 47 atom identities/lower and upper vectors PASS.
4. Height dual: all 186 atom-band identities and 30 complete cap certificates
   reconstructed, lower/upper vectors PASS. Internal elapsed 0.047858375s.
5. Signed-a dual: 47 atoms, exact triangle moments, saved vectors PASS.
6. Proven-group-mass dual: 47 atoms, signed-a plus group mass `53/31`, PASS.

Main charge: 6/45 seconds; these replays are finite arithmetic validation,
not independent geometry realizability or proof of the remaining domains.
All four relaxations return `70/61<40/31`. The signed coarse variants
prove a limitation of their explicitly stated moment information, not an
impossibility theorem for geometric or coupled proof methods. The nonnegative
five-band variant does not rule out signed or offset-coupled band methods.

Retained area source SHA-256 remains
`26c3b41b3bb731d67247ef1033e94ba4e0dbb0b58aa662858bafe0603596cf55`.

## Tiếng Việt — nội dung đã xác nhận và giới hạn

Đã kiểm lại toàn bộ chuỗi lập luận: khoảng trống trong bao lồi được chặn
bằng các nêm giữa hai nhãn kề nhau; bất đẳng thức năng lượng đường cho tối
đa năm nhãn xử lý mọi vị trí đầu mút; phép giãn khoảng nhãn được kiểm soát
bằng mức tăng của chính chặn dưới. Không giả sử diện tích hợp là hàm lồi,
bước đều, đối xứng hoặc thứ tự đầu trái cố định.

Kết luận tổng quát là `G_group >= (k+1)/4-s/2` cho nhóm con tối đa năm
nhãn, `s<=18/31`. Một thành phần đáy chỉ có một tam giác luôn đóng góp ít
nhất `1/10` diện tích được chuẩn hoá nằm ngoài nhóm còn lại. Do đó toàn bộ
kiểu 1+5/5+1 thỏa `D>=6/155` và `F>=20/93+1/310`: chúng không thể là
cấu hình đạt hoặc thấp hơn ứng viên `20/93`.

Phản biện AI bằng tính tay đã kiểm riêng các bước trên. Đây chưa phải phản
biện chuyên gia ngoài hệ thống, chứng nhận Lean, xác nhận tính mới hay phép
đo lợi thế phương pháp. Các kiểu 2+4/4+2/3+3 vẫn cần chặn giao liên nhóm
giữ được cùng một bộ độ lệch và cùng một khoảng cách qua mọi độ cao. Các
chứng chỉ moment phát lại thành công không thay thế nghĩa vụ đó.
