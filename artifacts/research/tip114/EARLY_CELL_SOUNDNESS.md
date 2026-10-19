# Early event-incidence cells — mathematical contract

This is an implementation soundness argument, not a produced whole K6 proof.
The target F6>=20/93 remains OPEN. Retain TIP112 minimum/root/C1/forest reductions.

Let U be rootSTRICT and pathSTRICT; a positive common-slack sample proves U
nonempty, open and full-dimensional. Its relative closure within the root is
rootSTRICT/pathCLOSED. We prove all selected event rows on the larger closed
root/path polyhedron, so their validity transfers to this relative closure.

For each nonparallel endpoint PAIR, the crossing height h and horizontal position
are affine functions of p. All12 endpoints and every pair are inventoried, even
structural equal-height records at different positions. Each nontrivial selected
row is among the retained147 triple/top/bottom/parallel walls after positive
normalization. At generic points off these finite walls:

- h<0 or h>1 contributes nothing to the actual area event law;
- a crossing lying inside any one third interval contributes nothing, whether
  or not its height is physically active;
- otherwise an active crossing is exposed if every third interval places it
  outside to the selected side. Its jump is fixed by endpoint kinds/slopes.

All rows selected at the sample are nonnegative everywhere in the closed parent
polyhedron. A nonconstant affine row cannot vanish at an interior point of U
while staying nonnegative there: a neighborhood would include negative values.
Thus it is strictly positive on U. Identically-zero height rows arise from the
same triangle apex; these contribute zero. Other structural constants are handled
explicitly. Fixed classifications therefore apply throughout U, except harmless
finite-wall coincidences resolved by continuity. The direct event polynomial is
the SAME quadratic throughout U. Continuity extends it to rootSTRICT/pathCLOSED.
This can join several full147-sign chambers; unrelated incidences need not split.

Independently deriving coefficients by actual endpoint-count integration on one
open fine neighborhood fixes the polynomial by polynomial identity. This is not
fitting values at a sample: the event-incidence proof first licenses one quadratic
on the whole parent. The checker must independently regenerate all needed rows,
not trust a producer event list or equality of one area value.

For g=a.p+c, p=z-R and z>=0, let d=c-R*sum(a). Regenerated closed inequalities
are Az<=b. If lambda>=0, lambda A>=(-a,0), lambda b<=d, then
-a.z<=lambda A.z<=lambda b<=d; hence g=a.z+d>=0. Coefficient domination is sound
because every shifted coordinate and epsilon is nonnegative. Exact multipliers,
not status/row labels, carry the implication. Even stronger closed-root proof
does not assert impossibility of target equality on its boundary.

Early leaves use full ambient five-variable stationarity, not face KKT. On a
consistent stationary affine family Q has constant value; unsafe value still
requires exclusion of the ENTIRE family under rootSTRICT/pathCLOSED. Incident
face minima lie in at least one closure of a terminal open cell by finite
complete binary branching/density; retained C1 makes its full gradient vanish.
Any missed branch, event, implication or singular family prevents acceptance.

Arbitrary split-wall order is harmless if indices are valid and unrepeated per
path, both children are present, and each terminal leaf supplies either genuine
empty-interior evidence, a legacy147-wall disposition, or complete early incidence
and stationary evidence. At most147 distinct splits per path ensures termination
of a finite complete forest; it supplies no affordable bound on its total size.

If a required nonconstant g has g(sample)>0 but the closed-parent LP exhibits
a point with g<0, mixing that point with the strict sample yields a point with
root/path inequalities strict and g<0. Both signs therefore meet the open parent.
This explains why selecting such unresolved event walls avoids dummy one-sided
splits; it does not bound how many genuine event regions will remain. A failed
dual alone, without the exact violating LP result, does not prove both sides
nonempty, so ordinary empty-child checking is still retained.

VI: Chỉ bỏ phép chia khi đã chứng nhận cả miền dùng cùng một đa thức diện tích.
Không dùng mẫu điểm để suy ra tính đúng trên miền. Bộ kiểm dựng lại đầy đủ nghĩa
vụ theo mọi cặp đầu mút và kiểm đối ngẫu chính xác; mặt biên và toàn họ dừng suy
biến giữ nguyên. Chứng minh này cho phép tối ưu công cụ, chưa chứng minh K6.
