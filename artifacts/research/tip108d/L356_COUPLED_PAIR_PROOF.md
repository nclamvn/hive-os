# Whole L356/R124 coupled exclusion (hand proof)

Let L={3,5,6}, R={1,2,4}, with strictly separated bottom groups, ranges a,b,
`S=a+b<=18/31`. Offsets may have any order or ties. All cross right-minus-left
offset differences exceed1. This proof uses actual offset differences, not an
independent maximum of group loss and overlap.

Write `J_r(z)` for the intersection of two unit-base triangles whose higher
label is r above the lower and whose offset minus the lower offset is z.
For a separated cross pair with right-minus-left difference D>1 and the higher
label on the left, put

    C_r(D)=J_r(-D)=(r-D)_+^2/[r(r^2-1)]  (r>=2).

This decreases with D. For an intra-group pair of gap r and difference -u,
`0<=u<1`, direct slicing gives

    J_r(-u)=(1+u)^2/[2(r+1)]-u^2/r.

For positive difference z<1 the overlap is `(1-z)^2/[2(r+1)]`.

## Four triangles suffice

Triangle4(right) is disjoint from triangles3,5(left): its higher offset makes
it disjoint from the lower label3, while its rank gap from5 is1 and the offset
separation exceeds1. Hence the union of345 has area exactly

    3/2-J2(delta),  delta=p5-p3.

Adding triangle1 and using the union bound on its three overlaps gives

    G >= 2-[J2(delta)+C2(D)+C4(D-delta)+J3(epsilon)],
    D=p1-p3,       epsilon=p4-p1.

Here `D>1`, `D-delta>1`, `|delta|<=a`, `|epsilon|<=b`. The unmentioned
triangles2,6 can only increase area. The triple345 formula has no omitted
triple intersection, since4 is disjoint from both others.

## Coupled cross cap

For delta>=0, the cross constraints give `D>=1+delta`. Consequently

    J2(delta)+C2(D)+C4(D-delta)
      <= (1-delta)^2/3+3/20 <=29/60.

For delta=-u<=0, `D>=1` and monotonicity gives

    J2(-u)+C2(D)+C4(D+u)
      <= (1+u)^2/6-u^2/2 +1/6 +(3-u)^2/60
       = T(u)=29/60+7u/30-19u^2/60.

Since u<=a, the other group range satisfies `b<=S-u`. The maximum overlap
of its gap3 pair1,4, for range b<=18/31<3/5, is

    B3(b)=(1+b)^2/8-b^2/3 =1/8+b/4-5b^2/24.

The negative-difference branch dominates the positive one, and B3 increases
on the entire allowed range. Thus the total bracket in the area floor is at
most `T(u)+B3(S-u)` when delta<=0. In the positive-difference case it is at
most `29/60+B3(S)`, the u0 value of the same upper quadratic.

Expansion and square completion give

    T(u)+B3(S-u)
      =73/120+S/4-5S^2/24 +(25S-1)*u/60-21u^2/40
      <= H(S)=73/120+S/4-5S^2/24+(25S-1)^2/7560.

The maximum is attained in the unrestricted quadratic at
`u=(25S-1)/63`. Allowing an unrestricted quadratic maximum is a valid upper
bound even when this point is outside `[0,S]`. On the actual S domain,

    H'(S)=(92-95S)/378>0.

At S18/31, exact arithmetic gives

    H(S)=128488/181629 =22/31-410/181629.

Therefore the ENTIRE label class satisfies

    G>=2-H(S)>=40/31+410/181629,
    D_defect=2G-(2+S)>=820/181629>0.

The use of non-strict cap values at bottom separation1 only weakens the bounds;
the actual domain has separation>1. All S endpoints and intra-group ties are
included. There is no global convexity, critical-label majorization or geometry
cell enumeration. The result is a whole label-class inequality, not full R1.

## Status / Trạng thái

Proposed hand proof for independent challenge. Zero mathematical subprocesses.
Chứng minh ghép độ dời cho toàn lớp nhãn L356/R124; các lớp còn lại chưa đóng.
