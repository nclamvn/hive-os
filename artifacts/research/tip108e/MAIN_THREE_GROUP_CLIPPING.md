# Three-plus-three: inward clipping and a stronger whole-domain proxy

HAND proof. This improves the valid lower function; the uniform target floor
is still unproved. Only the consecutive TIP108E groups LEFT456/RIGHT123 are
quantified. No subprocess, sample search or new infrastructure is used.

Translate so min_L p=0, max_L p=a and min_R p=q=a+d>1. The actual LEFT hull is
contained in the enclosing interval [4y,a+1+5y]. For RIGHT member j=2 or3,
let k=j-1, t=p1-pj and c=p1-a-1. If t>0, then c>t because pj-a-1>=d-1>0.
The RIGHT lower-envelope expansion contains the interval

    Xi_j(y)=[pj+j*y,p1+y]    when t-k*y>0.

It lies below the RIGHT baseline lower endpoint, not in its base interval.
Its portion to the RIGHT of the enclosing LEFT hull has length

    min((t-k*y)_+,(c-4*y)_+).

Because c>t, the exact integral of this portion is

    C_j^right=t^2/(2k)-(4t-k*c)_+^2/[8k(4-k)].

For t<=0 take C_j^right=0. The two lines switch at (c-t)/(4-k); integrating
the triangular loss from the full wedge gives the displayed subtraction.
This portion is supported below c/4. Since
c<=d+b-1<7/4+18/31-1=165/124<2, it is entirely below height1/2.
It is therefore exclusive of the opposite ACTUAL hull in the low band.

As c>t, its loss is at most (4-k)t^2/(8k), giving

    C_j^right>=t^2/8.

Select ONE member attaining min_R p (or take zero when p1=min_R p). Do not
sum intersecting wedges from different members. This yields a uniformly
guaranteed low-band contribution (p1-min_R p)^2/8. Reflection
j->7-j, x->C+1+6y-x gives the other contribution (max_L p-p6)^2/8.

The two selected low corrections cannot overlap: each is outside the opposite
actual hull and inside its own hull. They also cannot overlap the earlier
outward corrections, because an inward lower expansion ends at its group's
baseline lower endpoint while the outward upper expansion starts above the
baseline upper endpoint; the reflected statement is identical. The group base
intervals have positive width. Full potential gap wedges are still subtracted,
so no assertion that an expanded hull is filled by the actual union is needed.

Only the RIGHT-of-box portions are used here. The LEFT-of-box part opens above
pj/(3-k), which is above1/2 for j2 and above1 for j3. It is ignored. Unlike
the more detailed C2 from the two-plus-four argument, the corrections used in
this file have NO high-band portion and may ADD alongside high envelope energy.

## Retain the outward energies without assuming full exclusivity

Let B_L^- and B_R^+ denote the FULL integrals on[0,1] of their corresponding
outward envelope expansions. The previously reviewed guarantee retains these
energies on[0,1/3] and[1/2,1]. Every such expansion at height y is at most
(s-y)_+, where s is its group's span. The omitted middle band costs at most

    T(s)=[(s-1/3)_+^2-(s-1/2)_+^2]/2.

Discarding the remaining nonnegative inward high energies, the whole-domain
proxy is therefore

    G>=Q333+B_L^-+B_R^+-T(a)-T(b)
       +(p1-min_R p)^2/8+(max_L p-p6)^2/8.

Its arguments remain coupled to the same six offsets, actual bottom gap and
group spans. This is NOT an assertion that the proxy is>(2+S)/2. To close the
type, every signed extrema placement, displacement switch and boundary still
needs a uniform calibrated inequality. Passing a flat fan or a zigzag cannot
supply that missing implication. Reflection and ties preserve the inequalities.

Tiếng Việt: cận mới chỉ cộng phần mở rộng bao đã được cắt theo bao nhóm đối
diện; các nêm chồng nhau không bị cộng nhiều lần. Phần bao ngoài chưa bảo đảm
không giao nhau được trừ bằng T(s), không tự coi là diện tích có ích. Đây là
cận dưới toàn miền đã định hướng đúng, chưa chứng minh nó vượt ngưỡng đích.

## A smaller-group endpoint reduction, submitted for hand challenge

Reflection exchanges the two groups, so choose the RIGHT group to have span
b=min(a,b)<=9/31<1/3. Its omitted-band loss T(b) is zero. Weaken its full
outward energy to M3=max((p1-p3)_+^2/4,(p2-p3)_+^2/2), retaining the earlier
inward correction (p1-q)^2/8. Hold q=min_R p and the containing span b fixed.
The left envelope, span loss and inward correction do not depend on p3.

The p3 derivative of Q333 is

    1/2+(p2-p3)/2
      -[f2'(d35)+f3'(d36)+(3/2-d36)_+/3].

The bracket is at most1/3: f2'<=1/6; below3/2, f3'(D)+(3/2-D)/3
=1/4-D/12<=1/6, while above3/2 f3'<=1/8. In each branch of M3 its
derivative combined with (p2-p3)/2 is at least-b/2. Thus the lower proxy's
p3 derivative is at least1/6-b/2>0, including one-sided seams. Lowering p3
to q is therefore licensed for THIS relaxed function. It preserves minq and
the containing span box; no true-area endpoint assertion follows.

Write A=p1-q,B=p2-q after this reduction. Drop the middle upper-energy
candidate, leaving A^2/4+(p1-q)^2/8=3A^2/8. The only B dependence is

    -[(B-A)^2+B^2]/4-f2(d24)-f3(d25)-f4(d26),

where all three arguments move with B and retain their actual left offsets.
Its second derivative is at most
-1+2/3+5/12+3/10=23/60. The f_r pieces are C1. Consequently its endpoint
chord is a lower bound ONLY AFTER subtracting (23/120)*B*(b-B). The maximum
penalty is23b^2/480<=621/153760. Plain concavity would be false in some
mixed phases and is NOT asserted. The remaining endpoint proxies still depend
on all left offsets, A, common displacement and span. Their target calibration
is unproved; this reduction does not close3+3 or R1.
