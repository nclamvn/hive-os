# TIP109 — A whole structural region, with five exact squares

STATUS: REGIONAL THEOREM, NOT GLOBAL K6. Hand proof; zero mathematical processes.
Normalization G=6F6, p_j=6x_j, A_j=p_j+j, D_i=A_(i+1)-A_i.
The preceding MAIN_CHAIN_IDENTITY.md supplies the actual hull identity,
natural-chain exact holes, and valid nearest-neighbor restoration. No old
147-wall chamber or local polynomial continuation is assumed in this proof.

## 1. The explicitly declared closed region

Let D_i>=0 for i=1,...,5. Impose ALL the following12 linear inequalities:

    D5<=1;          2D5>=D3+D4;
    D3+D4>=D1+D2;   D1+D2<=2;
    D1<=1;          2D1>=D2+D3;
    D2+D3>=D4+D5;   D4+D5<=2;
    D1>=2D2;        D5>=2D4;
    D3+D2>=3D4;     D3+D4>=3D2.                         (C)

This is ONE common structural polyhedral region, with its ENTIRE boundary.
It is not a claim that all13 necessary apex continua lie in C, or that all
natural-order stationary points do so. No coverage percentage is supplied.

Theorem: every real offset vector whose D belongs to C satisfies

    G>=40/31, equivalently F6>=20/93.

Equality occurs only at D=(25,11,34,11,25)/31. Thus, modulo horizontal
translation, the unique equality offsets are p=(49,43,23,26,6,0)/31,
or x=(49,43,23,26,6,0)/186. The retained exact construction attains equality.

## 2. Selected hull supports, with all feasibility conditions

The LEFT hull envelope dominates the envelope of just labels1,3,5,6. Its
integral is the variational maximum over0<=alpha<=beta<=gamma<=1 of

    alpha*(p5-p6)+beta*(p3-p5)+gamma*(p1-p3)
      -alpha^2/2-beta^2-gamma^2.

This follows by assigning line6 on[0,alpha], line5 on[alpha,beta], line3
on[beta,gamma] and the reference zero line thereafter. Such a piecewise
assignment is pointwise at most the actual maximum; maximizing is exactly
the selected envelope. At feasible free cuts its value is

    B_L0=(1-D5)^2/2+(2-D3-D4)^2/4+(2-D1-D2)^2/4.

The free cuts are alpha=1-D5, beta=(2-D3-D4)/2,
gamma=(2-D1-D2)/2. The first FOUR conditions in C give their nonnegative,
ordered placement. Their upper bounds1 follow from D>=0. Hence B_LEFT>=B_L0
throughout C, including equal cuts and endpoint contacts. Other hull members
may dominate and only strengthen this lower bound.

Reflecting the chosen labels gives

    B_R0=(1-D1)^2/2+(2-D2-D3)^2/4+(2-D4-D5)^2/4.

The next FOUR conditions guarantee its reflected free cuts are feasible,
and B_RIGHT>=B_R0. An unconstrained selected-cut quadratic is NOT used outside
these declared inequalities. No actual global hull extremum is assumed to
come from the selected labels.

## 3. Whole natural-chain residual-gap bound

For each positive natural facing gap, the immediate neighbors fill attached
left/right portions. Its residual length is at most

    h_i(t)=[D_i-2t-(t-D_(i-1))_+-(t-D_(i+1))_+]_+,

with absent end neighbors omitted. Integrating this nonnegative residual to
INFINITY can only increase its integral over the physical height[0,1]. Thus
the resulting upper bound on actual holes is valid even when D_i>2; it does
NOT count physical triangle coverage beyond t=1. The exact infinite-height
integral is D_i^2/4-R_i, where the restoration R_i is nonnegative.

For an interior gap with neighbors E,F, put m=min(E,F),M=max(E,F):

    R(D,E,F)=(D-2m)_+^2/12+(D+m-3M)_+^2/24.

If D<=2m this is0. If D>2m and D+m<=3M only the first neighbor reaches the
gap before closure, giving the first term. In the remaining case both reach;
their combined fill2t-E-F meets gapD-2t at (D+E+F)/4. Direct integration
gives R=(D-E-F)^2/8+(E-F)^2/4, equal to the displayed two terms. These
pieces agree on all switch faces. A zero D or zero neighbor is a closed limit.

The last FOUR conditions in C allow exactly these selected contributions:

    R1=(D1-2D2)^2/12,
    R5=(D5-2D4)^2/12,
    R3=(D3-D2-D4)^2/8+(D2-D4)^2/4.

For R3 both-neighbor feasibility is D3+D2>=3D4 and D3+D4>=3D2. Equivalently,
the nonnegative maximizers in

    max_{u,v>=0}[(D3-2D2)u+(D3-2D4)v-3u^2-2uv-3v^2]

are u=(D3-3D2+D4)/8, v=(D3+D2-3D4)/8. Endpoint feasibility is precisely
D1>=2D2,D5>=2D4. Nonnegative R2,R4 are discarded only in the valid direction.
Together with the actual hull and natural unique-hole identity this proves

    G>=Q=sum_i D_i-2+B_L0+B_R0-sum_i D_i^2/4+R1+R3+R5.     (Q)

This remains valid across every moving-endpoint order change inside C. No
single arrangement cell, common base overlap or global reflection assumption
has been made.

## 4. Exact five-square decomposition

Use reflection coordinates, purely an invertible change of variables:

    a=(D1+D5)/2, b=(D2+D4)/2, c=D3,
    d=(D1-D5)/2, e=(D2-D4)/2.

Neither d nor e is set to zero. Expanding Q gives

    Q=3-2a-2b-c+7a^2/6+5b^2/3+3c^2/8+ab/3+bc/2
                         +(7d^2+2de+13e^2)/6.

Its symmetric gradient equations are7a+b=6,2a+20b+3c=12,3c+2b=4.
Their solution is(a,b,c)=(25,11,34)/31, with value40/31. Put

    u=a-25/31, v=b-11/31, w=c-34/31.

Then the ENTIRE quadratic, not merely its Taylor approximation, is

    Q = 40/31
        + (7/6)*(u+v/7)^2
        + (23/14)*(v+7w/46)^2
        + (31/92)*w^2
        + (7/6)*(d+e/7)^2
        + (15/7)*e^2.                                 (SOS)

All coefficients are strictly positive. To independently check the central
completion, (23/14)*(7/46)^2=7/184 and31/92+7/184=3/8.
For the antisymmetric completion, (7/6)/49+15/7=13/6.
Every square vanishes only at u=v=w=d=e=0, giving the claimed unique D.
The known construction lies strictly within C and attains the retained exact
area40/31. This completes the regional theorem and equality classification.

## 5. The region is not just the old local arrangement

The explicit hand point

    D=(9/10,2/5,19/20,2/5,9/10),
    p=(29/20,27/20,3/4,7/10,1/10,0)

satisfies ALL12 inequalities strictly and D>0. Its range29/20<49/31,
its bottom is connected, and its unique bottom extremal labels are6 and1.
Here p3-p4=1/20>0, whereas at the accepted construction p3-p4=-3/31<0.
The base left-edge collision p3=p4 is a bottom-clipping arrangement wall.
Thus the new structural region extends across a wall bounding the old witness
chamber. No actual area at this point or stationary/radial condition is claimed;
the argument establishes a REGIONAL lower bound by inclusion in C alone.

## 6. Exact remaining gap

We have NOT proved that every relevant natural-apex stationary minimum belongs
to C, nor calibrated the clamped functional outside C. The12 inverted-apex
continua remain untreated by this theorem. Necessary bottom/radial/full-gradient
conditions cannot be silently replaced by C. Therefore TIP109 R1 and global
finite C_T(6) remain OPEN. This is a strengthened structural regional theorem,
not general Kakeya, external acceptance, formal kernel verification, novelty
or measured method superiority.

## Tiếng Việt

Đã chứng minh bằng tay một định lý trên TOÀN miền cấu trúc C xác định bởi12
bất đẳng thức tuyến tính, kể cả mọi mặt biên: F6>=20/93. Chứng minh giữ đầy đủ
hai đường bao thực và phần khe được lân cận lấp, rồi tách sai lệch thành NĂM
bình phương có hệ số dương. Không giả định đối xứng: hai biến bất đối xứng vẫn
nằm trong các bình phương. Đẳng thức duy nhất, tới tịnh tiến ngang, là cấu hình
(49,43,23,26,6,0)/186. Miền C vượt qua ít nhất một vách hình học của ô cục bộ
cũ, nên đây không phải lặp lại việc kiểm Hessian tại một điểm.

Còn thiếu: chứng minh mọi cực tiểu cạnh tranh thuộc C hoặc bị loại bằng một
lập luận đầy đủ; xử lý12 thứ tự đảo cặp kề. Không có cận toàn miền K6 mới,
không tuyên bố tính mới trong tài liệu, không nói đã giải Kakeya tổng quát.
