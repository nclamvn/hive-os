# TIP108D hand coupling notes

R1 remains OPEN. These are analytic ingredients and rejected shortcuts, not a
substitute for the whole remaining34-signature defect inequality.

## Universal directed-pair label criterion

For the left label set L and right complement R, define

    C_L = sum_{i in L,j in R,i-j>=2} (i-j-1)/[(i-j)(i-j+1)].

Every cross offset D_ij=p_j-p_i is>=d>1. The retained exact intersection formula
J_r(D)=(r-D)_+^2/[r(r^2-1)] decreases strictly from J_r(1) whenever a directed
pair exists; hence the actual group intersection is<C_L by the union bound.
Every retained signature has at least one such pair. Combining the proper-group
bounds gives uniform strict defect floors

    D > 26/31 - 2C_L                       (sizes2+4 or4+2),
    D > 1855/1922 - 2C_L                   (size3+3).

The latter uses a+b=S and a^2+b^2>=S^2/2; the function
2-2S+3S^2/8 decreases up to S=18/31. Thus a nonnegative displayed floor excludes
the ENTIRE label class, not sampled offsets. A complete finite label table may
evaluate this criterion without a geometry cover. The subsequently authorized
single label-only computation is recorded in BUILDER_LABEL_CRITERIA.json.

## Stronger two-label contribution (the whole allowed range)

For two labels with gap r and0<=a<=18/31<1, offset difference delta in[-a,a], positive delta
has overlap (1-delta)^2/[2(r+1)]. For delta=-u<=0, direct integration gives

    B_r(u)=(1+u)^2/[2(r+1)]-u^2/r.

It is maximized at u=min(a,r/(r+2)); this maximum dominates the nonnegative-delta
case. Therefore the pair union area is at least g_r(a)=1-B_r(u).
For a<=r/(r+2), differentiation gives

    [2g_r(a)+a]'=1-2/(r+1)+2(r+2)a/[r(r+1)] >=0.

Above that point the maximum overlap is constant and the derivative is1. Hence
throughout the allowed range

    2g_r(a)+a >= 2-1/(r+1).

If the other four-label group has range b and S=a+b<=18/31, its retained bound
G4>=5/4-b/2 yields

    D > 83/62 - 1/(r+1) - 2C_L.

This also applies when the pair is the right group. It excludes, for example,
L={2,6} (r4,C=7/15), L={3,5} (r2,C=29/60), and their reflected configurations.
There is no equal-step, ordering or stationarity assumption in this pair formula.

## Uniform positive label-gap insertion residual

The retained hull gap-insertion derivative estimates imply a quantitative
residual, not the invalid full flat-label gain. With s<=s0=18/31, each insertion
from r to r+1 increases the group H-W lower functional by at least

    gamma_r = 169/[1922(r+1)(r+2)].

For delta>=0, direct gain minus the upper bound on envelope loss has numerator
(1-delta)^2-2(s-delta)^2 over2(r+1)(r+2). This is concave in delta in[0,s], so
its minimum is at an endpoint: at least min(1-2s0^2,(1-s0)^2)=169/961.
For delta=-u<=0 and r=1, the retained u>=2s/3 branch gives numerator
1+2u-5u^2, whose endpoint minimum on[0,s0] is457/961. The other branch gives
1+2u-5u^2-2s^2, whose minimum on[0,2s0/3] is at least313/961 (the other endpoint
is337/961). For r>=2 the numerator is
1+2u-(1+4/r)u^2-2s^2; concavity and endpoint evaluation bound it below by
min(313/961,457/961). All exceed169/961. These are the retained envelope-loss
bounds, not an assumed monotonicity/convexity of actual union area.

Telescoping over all inserted integer gaps yields the universal proper-group
bound, for k<=5 and range s<=18/31,

    G_group >= (k+1)/4-s/2
               +(169/1922)*sum_gaps[1/2-1/(r_gap+1)].

For L={1,4,5},R={2,3,6}, both groups have gaps3 and1. Their combined addition
to D is169/1922. The basic three-three floor is-67/1922, so the ENTIRE label
class is excluded with D>51/961. This does not close the other label classes
or R1. A finite all-label table, if authorized, can combine this residual with
the two-label criterion without producing offset/cell branches.

## A coupled shadow-union functional

At each height let K_A,K_B be horizontal slice hulls of the actual group unions
U_A,U_B. Let W_A,W_B be the unions of potential gaps between consecutive labels
inside each group. Actual holes are subsets of W by the retained gap-cover proof.
Every positive gap lies inside its own hull: its endpoints are an interval's
right endpoint and the next interval's left endpoint. Thus

    A*=K_A minus W_A subset U_A,
    B*=K_B minus W_B subset U_B,
    area(A* union B*) <= G.

The exact slice identity is

    |A* union B*| = |K_A union K_B|
                   -|W_A minus K_B|-|W_B minus K_A|-|W_A intersect W_B|.

Within a group, potential adjacent gaps are pairwise disjoint when range<1.
For gaps indexed i<k, the end of gap i is the left endpoint of member i+1;
the start of gap k is the right endpoint of member k. If k=i+1 their order
differs by the positive width1-y. If k>=i+2, their difference is at most
s-1-(label_k-label_(i+1)-1)y<0. Therefore only CROSS-group gap intersections
need multiplicity correction. This functional preserves common displacement
and opposite-hull hole covering, unlike subtracting full W_A+W_B. Its whole
target bound has not been proved or refuted.

## Exact arbitrary three-member bridge correction

Let j1<j2<j3, r=j2-j1, t=j3-j2, and offsets p1,p2,p3 have range<1.
Because potential adjacent gaps are disjoint and avoid their two generating
triangles, a false gap can only be covered by the remaining third triangle.
Consequently the ACTUAL group area is exactly

    G3 = H-W1-W2+B1+B2,
    B2 = [(t+1)(p1-p2)+r(p3-p2)-r]_+^2
         /[2r(t+1)(r+t+1)],
    B1 = [(r+1)(p2-p3)+t(p2-p1)-t]_+^2
         /[2t(r+1)(r+t+1)].

For B2, set u=p1-p2 and v=p3-p2. The gap2->3 opens at
(1-v)/(t+1); the bridge by triangle1 ends at u/r. Its peak is at
(1+u-v)/(r+t+1), with length h=[(t+1)u+rv-r]/(r+t+1).
The two slopes are t+1 and-r. The area is
h^2*(1/(t+1)+1/r)/2, giving the displayed formula. The positive case forces
u>0, and the range<1 ensures opening>=0 and ending<1, so no boundary truncation
is omitted. B1 follows by the explicit area-preserving reflected shear.

At most one correction is positive. If both were positive, p1>p2>p3; write
u=p1-p2>0,w=p2-p3>0, u+w=s<1. Their two strict conditions would imply

    (t+1)u-rw>r,       (r+1)w-tu>t.

Adding gives exactly u+w=s>r+t, contradicting s<1 and r,t>=1.
This is an exact gapped-label/offset formula, not a restricted equal-step family.
For consecutive labels and offsets(s,0,v), it reduces to
B2=(2s+v-1)_+^2/12 and B1=0.

The positive group correction cannot simply be added to a whole-union lower
bound: the opposite group might already cover it. Its useful role is in a
genuinely coupled calibration or exact group-intersection calculation, which
remains open. No full six-variable event cover has been started.

## Rejected uniform flattening/support assumptions

A partition-specific loss<=S/3 from its own zero-range optimum is false.
The retained zero-span2+4 L56/R1234 optimum has right gradients
(-1/4,-1/40,-1/8,2/5). Moving the first three members by+b and the fourth by0
loses2b/5 at first order, more than b/3. No computation was needed or executed.
The weaker universal anchor107/72-S/3 is a different, still unproved proposition.

Type-dependent anchor supports could be useful:

    G >= 107/72-7S/24                  for3+3,
    G >= 123/80-3a/20-2b/5             for2+4 (mirrored for4+2).

They would close the target with positive margins, but anchor gradients do NOT
establish global supports, and no label majorization is assumed.

The seemingly stronger proper-group statement G>=C_flat(labels)-s/2 is also
FALSE. For labels(1,2,4,5), offsets(s,0,s,0), the slice hull correction B=s^2,
the linear term is-2s/3, and the wedge quadratic is2s^2/3. Therefore H-W equals

    G = 4/3-2s/3+s^2/3       for0<s<1/4.

Equality is valid here: every potential gap opens after y>s, when all starts
have their label order, so no member bridges it. At s=1/8 this is241/192,
below C_flat-s/2=61/48 by1/64. The retained smaller positive gap-insertion
residual is not contradicted and may safely be used; the full flat-gap gain
cannot simply be added to the old linear bound.

## Ledger and scope

Initial stage: hand work and source/document reads only, zero mathematical
subprocesses. Subsequently ONE authorized fixed34-label arithmetic process ran:
internal0.001635542s, conservativecharge3s/75. No offset samples, box generation,
optimizer or frontier continuation. No restricted-family result is treated as
whole R1 closure. Old sources/proof bytes remain unchanged; all new evidence
belongs only to artifacts/research/tip108d.

Correction record, 2026-10-11 05:46 UTC: independent challenge corrected two
exposition slips in this new note. The smallest cross difference can ATTAIN d,
so the relation is >=d>1. The sum of the two bridge-positive inequalities is
exactly u+w=s, not the earlier incorrectly expanded expression. The bridge
impossibility conclusion remains valid with the shorter direct contradiction.
