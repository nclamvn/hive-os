# The remaining coupled-floor obligation

The new hand reductions leave LEFT56/RIGHT1234, its reflected LEFT3456/RIGHT12,
and LEFT456/RIGHT123. The reflection reduces these to two canonical types,
NOT to isolated configurations. Every internal offset, common displacement,
tie and span boundary in the retained domain is still quantified.

## A precise valid lower functional, not a target certificate

For a cross pair i(left),j(right), write `d_ji=p_j-p_i>1`. Define

    f_r(z)=integral_(1/2)^1 (1-y-|z-r*y|)_+ dy.

Only ranks r>=2 contribute. Let

    W_K=sum_consecutive_in_K (1+p_next-p_prev)^2/4

for each of these consecutive canonical groups. This is the full potential
adjacent-gap wedge area, not necessarily the true hole area. The quantity
`(z-1)^2/8` below is the full low-band forward-gap cap; it has no clipping
error because every cross difference is <=d+S<3 on the retained near domain.

For LEFT456/RIGHT123, a universally valid lower bound is

    Q333=2+(p3-p4+p6-p4+p3-p1)/2
         +(3/2-d_36)_+^2/6 +(3/2-d_14)_+^2/6
         -(d_16-1)^2/8 -W_456-W_123
         -sum_(i in456,j in123,i-j>=2) f_(i-j)(d_ji).

For LEFT56/RIGHT1234, another universally valid lower bound is

    Q244=2+(p4-p5+p6-p5+p4-p1)/2
         +(2-d_15)_+^2/8 -(d_16-1)^2/8
         -W_56-W_1234
         -sum_(i in56,j in1234,i-j>=2) f_(i-j)(d_ji).

Here d_36 means p3-p6, d_14 means p1-p4, d_16 means p1-p6, etc.; the
first index is the RIGHT member and second index the LEFT member.
The names Q333/Q244 are mnemonic, not triangle-count formulas.

Validity: below height1/2 use the union of the TWO group slice hulls, bounding
its global hull by the maximum/minimum of the indicated fixed OUTER member
lines. Reverse hull separation is impossible in this band, by bottom separation
>1 and the relevant label gaps. The forward gap is capped by right member1's
left endpoint minus left member6's right endpoint. Above1/2 use the individual
group endpoint hull widths and subtract the sum of all cross-pair overlaps.
Subtract the full potential adjacent-gap wedges across both bands. Actual
holes are covered by those wedges, so both Q are <=G. This retains displacement
and individual offsets, but may lose positive hole-bridging/multiplicity terms.

At common offsets within each group, Q333 has its retained sharp anchor
107/72 at q7/6, and Q244 has its retained sharp anchor123/80 at q11/10.
Sharpness at these anchors DOES NOT prove either whole-domain floor.
The still-unproved analytic predicate is

    Q333>(2+S)/2 and Q244>(2+S)/2

throughout their corresponding retained near domains; alternatively one needs
a stronger coupled functional retaining the discarded positive corrections.

## Why no endpoint reduction was admitted

The proper three-group area has its minimum, for endpoint offsets(a,0), at
middle offseta/2, not at a middle-offset endpoint. Its value
`1-a/2+3a^2/8` is lower than the endpoint choice `1-a/2+a^2/2` by a^2/8.
Thus actual-group convexity is a concrete obstruction to an unproved endpoint
minimum principle. At a18/31 this discrepancy is about0.042, too large to
ignore against the small proposed supporting-line margins.

Even for the LOWER functions Q, concavity cannot simply be inferred from the
negative wedge quadratics. High-band pair caps have sign-changing curvature:
rank2 has second derivative -2/3 on D in(1,3/2) and +1/3 on(3/2,2); rank3
has second derivative +1/4 on(1,3/2), -5/12 on(3/2,2), and +1/12 on(2,3).
Their subtractions can therefore create positive coordinate curvature. Positive
envelope hinge curvature must also be included. A global exact chord-error or
sum-of-squares calibration has not been established.

No sampled endpoint patterns, branch collection, resumed box forest, optimizer,
or generic cover can substitute for this missing universal inequality. The
failure to derive it is NOT a proof it is false, NOT an impossibility theorem,
and NOT exhaustion of the execution budget. It is the named unresolved
whole-method implication at the end of this analytic attempt.

## Scope / Phạm vi

31 of the34 necessary label classes now have proposed uniform hand proofs,
independently challenged in the campaign. The remaining three masks are genuine
continuous obligations. No admissible D<=0 witness or global F<20/93 witness
was produced. The separate one-bottom-component13 order domains remain OPEN.
Không coi31 lớp nhãn đã loại là chứng minh toàn miền; ba lớp liên tục còn lại
và bài toán K6 toàn cục vẫn chưa đóng.
