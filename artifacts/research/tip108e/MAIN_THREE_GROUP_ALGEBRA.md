# Three-plus-three: the common-offset algebra, not a calibrated floor

This hand identity retains every member displacement. It does not prove the
TIP108E target. No endpoint reduction, convexity or supporting-plane assertion
is inferred. No mathematical subprocess was used for this derivation.

Let t=p3-p4, U=p1-p3, V=p2-p3, X=p4-p5, Z=p4-p6. These coordinates are signed;
in particular U,V,X,Z are NOT assumed nonnegative on the whole domain.
All cross differences are in (1,7/4+18/31), a subset of (1,5/2).
Write H_c(D)=(D-c)_+^2. The retained high-band pair integrals have the identities

    f2(D)=-D^2/3+5D/6-11/24+H_(3/2)(D)/2-H_2(D)/6,
    f3(D)=(D-1)^2/8-H_(3/2)(D)/3+H_2(D)/4,
    f4(D)=H_(3/2)(D)/10-H_2(D)/4,
    f5(D)=H_2(D)/12.

These follow by integrating the two linear sides of the clipped overlap tent
on y in[1/2,1]. In particular the final rank2 correction MUST be retained:
without -H_2/6, the proposed formula would be only an upper cap above D=2.

For Q333, substitution of these exact identities and
(3/2-D)_+^2=(D-3/2)^2-H_(3/2)(D) gives Q333=P+J, where

    P=13/6-7t/6+t^2/2
      -t(U+Z)/6+(5t-7)(V+X)/12
      -(U^2+Z^2)/3-7(V^2+X^2)/24
      +UV/2+XZ/2-UZ/4-VX/4,

    J=[H_(3/2)(d14)+H_(3/2)(d36)]/6
      +H_(3/2)(d25)/3
      -[H_(3/2)(d24)+H_(3/2)(d35)]/2
      -[H_(3/2)(d15)+H_(3/2)(d26)]/10
      +[H_2(d24)+H_2(d35)]/6
      -[H_2(d14)+H_2(d25)+H_2(d36)]/4
      +[H_2(d15)+H_2(d26)]/4-H_2(d16)/12.

Here the first index is RIGHT and the second LEFT, and the coupled arguments are

    d14=t+U, d24=t+V, d35=t+X, d36=t+Z,
    d25=t+V+X, d15=t+U+X, d26=t+V+Z, d16=t+U+Z.

For example, the wedge-energy squares that are subtracted in P are
X^2+(Z-X)^2 and (V-U)^2+V^2. Dropping a negative switching hinge or evaluating
these arguments at separately adverse offsets would invalidate the reduction.

## Why the possible S/3 support is still only a conjectured ingredient

The common-offset fan in the first regime has area
13/6-7t/6+t^2/2, with minimum107/72 at t=7/6. Its first-order RIGHT gradients
are (-t/6,(5t-7)/12,(9t-7)/12). At that minimum the sum of its negative
gradients is -7/24, which is less in magnitude than1/3. This suggests, but
does NOT prove, the possible whole-three-plus-three inequality

    G>=107/72-S/3.

If established on the whole domain, it would yield
G-(1+S/2)>=5/2232, hence D>=5/1116. Derivatives at the flat fan do not provide
a global supporting plane. Finite-span curvature, all signed extrema placements,
every switching hinge J and opposite-hull clipping remain obligations.

For U,V>=0, the FULL right outward energy B(U,V)=integral max(U-2y,V-y,0)dy is

    U^2/4                     if 0<=V<=U/2,
    V^2-UV+U^2/2             if U/2<=V<=U,
    V^2/2                     if V>=U.

The same formula applies to B(Z,X) when Z,X>=0. Full energy is not automatically
exclusive of the opposite hull: the reviewed guaranteed low band ends at1/3.
Neither these extrema placements nor full-energy replacement are assumed.

A symmetric baseline calculation at U=Z=A,V=X=T in the middle energy regime
produces P+B(U,V)+B(Z,X)=fan(t)+A^2/12+7T^2/6-AT-tA/3+(5t-7)T/6.
Its stationary expression is NOT a certificate: at A=9/31 it crosses switching
hinges, and part of the full outward energy may not be exclusive. No actual G,
counterexample, subfamily closure or sampled validation is claimed from it.

Tiếng Việt: đã viết cùng một hệ tọa độ cho khe hở và mọi phần giao, với toàn bộ
các hạng chuyển miền. Đây là đồng nhất thức phục vụ chứng minh, chưa phải cận
đạt đích. Không dùng đạo hàm tại cấu hình phẳng làm mặt đỡ toàn cục; không bỏ
hạng bản lề hay tự giả định mọi phần mở rộng bao đều không giao nhóm đối diện.
