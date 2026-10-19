# Actual-union event spline: all orders, finite K6

TIP111 feasibility prerequisite, NOT a global lower-bound certificate.
The committed root F6 >= 20/93 on all real offsets remains OPEN.

## Direct identity (no connected-tail assumption)

Put p_j=6x_j, A_j=p_j+j and
I_j(t)=[A_j-jt,A_j-(j-1)t], 0<=t<=1. Let L(t) be their actual union
length, and G=integral_0^1 L(t)dt=6F6. Initially assume distinct apices,
no persistent parallel endpoint coincidences and no three endpoints meeting
at the same positive-height location. This is an open generic arrangement
cell, not an assumption about every minimum.

Near t=0 the six intervals are disjoint, so L(0)=0 and L'(0+)=6.
For each nonparallel pair of endpoint lines, retain its positive crossing
height t_e and its crossing LOCATION. If another interval contains that
location in its strict interior, the pair makes no union-boundary change:
Delta_e=0. Otherwise

    Delta_e = +|s_a-s_b| for LL or RR,
              -|s_a-s_b| for LR or RL.

Here s is the endpoint slope, L denotes a left endpoint and R a right one.
For LL the local boundary is minus the minimum of the two affine endpoints;
for RR it is their maximum. Both have a positive derivative jump of the
stated magnitude. At LR/RL contact the overlap is locally the positive part
of their signed difference, which is subtracted from the union: the jump is
negative for either merging or splitting. These descriptions account for
every possible change at an exposed crossing. A third interval covering
the location removes the change altogether. Triple contacts are excluded
only while deriving a generic-cell law.

Consequently the exact continuous piecewise-affine function satisfies

    L(t)=6t+sum_{e:t_e>0} Delta_e (t-t_e)_+.

Integrating on the PHYSICAL interval, not an infinite cone, gives

    G=3+(1/2) sum_{e:0<t_e<1} Delta_e (1-t_e)^2.       (E)

LL and RR crossings of the SAME two intervals occur at the same height
structurally, at different horizontal locations. They are separate records;
neither unique-height deduplication nor a demand for distinct event heights
is allowed. Simultaneous unrelated locations likewise contribute separately.

Every t_e is affine in the five translation-gauged offset variables divided
by a fixed nonzero integer slope difference. On a cell with fixed positive
event/exposure/clipping signs, (E) is an exact quadratic, not a fit.
Exposure changes are controlled by triple-concurrence and parallel-order
walls. But the extra affine walls t_e=1 are essential: homogeneous normalized
four-dimensional shape walls alone do NOT fix the physical truncation law.

## Boundary and stationary obligations

On a closed cell, the corresponding polynomial equals actual G by continuity
from its interior. Do not assign independent generic Delta values at a
concurrent LOCATION itself; use incident polynomial closures. Off persistent
adjacent parallel contacts, actual G is C1: exposed-boundary gradients are
bounded, boundary ownership changes only on a null set of heights, and
dominated convergence applies. Thus a global minimum on an incident wall
satisfies the FULL ambient five-variable gradient of each incident quadratic,
not only a constrained-face KKT equation.

This leaves real obligations: complete cell/clip coverage, independently
derived polynomials, exact five-variable stationary elimination, and complete
closed/strict feasibility for every below-target singular affine family.
The value of a quadratic is constant on its stationary affine family, but
one infeasible particular solution does not exclude that family.

## Explicit reason not to port the natural connected-tail formula

Take p=(7/5,3/10,1,3/2,3/5,0), hence
A=(12/5,23/10,4,11/2,28/5,6). Its strict apex word is
(2,1,3,4,5,6), range(p)=3/2<49/31, and its bottom union is strictly
connected. The unique bottom extremal labels are4(right) and6(left), with
individual edge slope magnitudes3 and6. The union one-sided bottom slopes
are BOTH L'_-(1)=L'_+(1)=6-4+1=3. This is NOT asserted to satisfy
full/radial stationarity.

At t=10, labels2..6 form one component [-54,-77/10]; label1 is
[-38/5,12/5]. Their persistent gap has length1/10. Actual L(10)=563/10,
whereas the hull length is282/5=564/10. Thus connected physical bottom
does not imply connected extrapolated tail, even in a permitted strict word
with the range and bottom-slope bounds. No smaller-area witness or violation
of the committed inequality follows from this diagnostic.

## Scope / Phạm vi

EN: This repairs the all-order area-law reuse seam. It proves neither a
complete finite partition nor the K6 sharp lower bound, and supplies no
runtime guarantee for a whole producer plus independent checker.

VI: Công thức tính trực tiếp diện tích hợp dùng cho mọi thứ tự đỉnh, không
giả định phần đuôi liên thông. Đây chỉ là tiền đề cho bộ chứng nhận; chưa
bao phủ hết miền và chưa chứng minh cận sắc K6. Không đổi tên việc kiểm
công thức thành kết quả khép bài toán.
