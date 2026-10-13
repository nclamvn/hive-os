# Whole-label exclusions from an isolated outer triangle

These exclusions retain the actual offsets and use no offset samples or label
majorization. They do not close every signature in R1.

## Outer-tail lemma

Let one group have offsets in `[q,q+b]`. A member with label h exceeds every
other member's label by at least r. Its right endpoint exceeds every other
member's right endpoint by at least `r*y-b`. Therefore its area exclusive of
the other members is at least

    integral_0^1 min(1-y,(r*y-b)_+) dy
      = (r-b)^2/[2r(r+1)]                  (0<=b<r).

The two breakpoints are `b/r` and `(1+b)/(r+1)`. This is a rigid pointwise
endpoint inequality, not an assertion about convexity of group intersection.
The left-tail version follows by the area-preserving reflected shear.
If this member is disjoint in area from the opposite group, its same-group
exclusive part is exclusive of the ENTIRE other five-member union.

## L={4,5}, R={1,2,3,6}

Triangle6 is disjoint from every left-group triangle at every height: its offset
is more than1 to their right, and its label is larger. Inside its own group,
the other labels are at most3, giving r3 in the outer-tail lemma. The firstfive
consecutive labels have scaled union area at least70/61 by the retained K5
theorem (`F5>=14/61`, scaled horizontally by5). Hence

    G >= 70/61+(3-b)^2/24
      >= 70/61+1875/7688
       = 40/31+47415/468968.

Since `S<=18/31`, this excludes the ENTIRE label class with

    D >= 47415/234484 >0.

Reflection gives the corresponding four-plus-two class. Arbitrary internal
offsets, ties and the S boundary are included.

## L={4,6}, R={1,2,3,5}

Triangle5 is disjoint from left triangle4 because its label and offset are
both greater. It is disjoint from left triangle6 because their rank gap is1
and their right-minus-left offset separation is>1, outside the pair-overlap
support. Its other same-group labels are at most3, giving r2. Thus its
exclusive area outside the OTHER FIVE triangles is at least

    (2-b)^2/12 >= 484/2883.

The forced disjoint pair3(right),4(left), with third label6, has union area
at least8/7. For clarity, write `a=p6-p3`, `b0=p6-p4`. Then `a-b0<-1`.
The retained adjacent-pair triple inequality gives

    J3(a)+J2(b0)<=5/14,
    area(triple346)>=3/2-5/14=8/7.

This is the INVERSE-offset branch of the retained TIP104 central triple
inequality, not its bottom-forward branch. The pair3,4 has no intersection,
so no triple intersection is omitted. The independent hand derivation in
`artifacts/research/tip104/ANALYTIC_REVIEW.md`, Section2, is a dependency.
It covers the whole halfspace `a-b0<=-1`, not only its boundary.

Adding triangle5's exclusive part to the whole other-five union gives

    G >= 8/7+484/2883 = 40/31+412/20181,
    D >= 824/20181 >0.

No theorem for a GAPPED five-label set has been presumed. Reflection again
supplies the corresponding four-plus-two class.

## L={2,5,6}, R={1,3,4}

Triangle2 is disjoint from right triangle1 (rank1 with offset separation>1)
and from right triangles3,4 (larger labels and larger offsets). Its two other
same-group labels are5,6, so the LEFT-tail lemma gives an exclusive area outside
the ENTIRE other-five union of at least

    (3-a)^2/24 >= 1875/7688.

The forced disjoint pair4(right),5(left), with third6, satisfies the retained
inverse-offset adjacent cap `J2(a0)+J1(b0)<=3/7`, hence triple456 area at
least `3/2-3/7=15/14`. The full-halfspace cap, including the rank1 seam, is
proved in the retained TIP104 analytic review Section3; the cap does not
assume global C1 for rank1.
Therefore

    G >= 15/14+1875/7688 =40/31+1345/53816,
    D >=1345/26908>0.

The reflected label class is L={3,4,6},R={1,2,5}. Again no theorem for an
arbitrary gapped-five label set is invoked.

## Status / Trạng thái

Hand proofs proposed for independent challenge; zero mathematical executions.
These are whole LABEL classes, not geometry branch certificates. Other
continuous label domains remain unresolved; no global K6 closure is claimed.
Các cận áp dụng cho mọi độ dời trong từng lớp nhãn, không phải mẫu hữu hạn.
