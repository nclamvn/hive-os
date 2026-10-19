# TIP116 — full coverage context, degree-four attempt

STATUS: PARTIAL; whole all-real K6 remains OPEN. No identity proving
`53/31-Q>=0` on the exact490-variable graph was found. The full new-objective
degree-four class is neither certified nor disproved.

Scope: `CONTEXTUAL_D4_SCOPE_20261013.md`, activation2026-10-13 10:44:35UTC,
hardstop11:14:35UTC. Builder independent new derivation STOP observed
10:55:25UTC, early hand payment exhaustion, not cap exhaustion. Subsequent
literal review and recording do not restart that search. All predecessors
remain unchanged. Same PUBLIC_DISCOVERY target `G>=40/31`, `G=3-Q`.

## 1. Exact global source cancellation, not separate caps

Use `f(s)=s-s^2/2` and the predecessor's ten signed coverage coefficients.
For i<j, d=j-i, Delta=Aj-Ai, define EXISTING clips

    a=clip(Delta/(d+1)), b=clip(Delta/d),
    c=clip(Delta/(d-1)) for d>1.

The exact actual pair-overlap area is

    J_ij=((d+1)*(1-a)^2-2*d*(1-b)^2
           +(d-1)*(1-c)^2)/2.                         (1)

For d=1 omit the last term. For Delta<0 all these clips are0 and (1) is0,
as the interiors are disjoint. For Delta>=0 the slice lens has birth
Delta/(d+1), center Delta/d, and death Delta/(d-1) when d>1. Its width is
the sum of three linear ramps with coefficients d+1,-2d,d-1. Integrating
those ramps on[0,1] gives (1), including saturated events and boundaries.
At d=1 the final width is constant after its center; the two-ramp formula
gives the same result. No natural apex order or positive Delta is imposed.

On the two rays R_i,L_j the original pair coverage band is[a,b]; on L_i,R_j
it is[b,c] when d>1. Their respective Q-coefficient sums are d+1 and1-d.
Thus their contribution is exactly

    (d+1)*(f(b)-f(a))-(d-1)*(f(c)-f(b))=J_ij.

For adjacent labels the latter parallel band has total coefficient0,
including its shared ambiguous flag at Delta=0. Consequently the source
moment sum, BEFORE subtracting whole-prefix overlap, satisfies

    Q_source=sum_(i<j) J_ij.                          (2)

This is a polynomial cancellation in the original clips/flags. The existing
paired-sort moment identities transport it through sorting by degree2
equation multiples; they do not assume fixed source labels after sorting.
It is not a sum of independent pair-area upper bounds.

## 2. What the complete contextual remainder actually pays

Keep the predecessor's quadratic abbreviations

    E_k=f(h_k)-f(l_k)-f(H_k)+f(S_k), E_1=0,
    D_ray=sum_k[f(h_k)-f(l_k)]-sum_k E_k.

Each E is overlap with the WHOLE preceding union on its ray. Let
`R=sum_ray c_ray*sum_k E_k`. Combining (2) with G=3-Q gives exactly

    R=sum_pairs J_ij-Q=G-3+sum_pairs J_ij.             (3)

At a plane point let m be its ACTUAL six-source coverage multiplicity.
Since the total individual area is3, (3) also gives

    R=integral [C(m,2)-m+indicator_(m>0)]
     =integral C(m-1,2) on m>=1, with0 on m=0.         (4)

Thus aggregate R is genuinely nonnegative despite the mixed signs of c.
It retains all intersections, nesting and simultaneous sources. Neither
R>=0 nor E>=0 is silently made a new polynomial generator. The exact target
is still the quantitative payment

    53/31-sum_pairs J_ij+R >=0.                       (5)

Nonnegativity of R alone does not prove (5). No admissible identity for (5)
was obtained; this is the decisive missing assembly, not an omitted source.

## 3. Genuine contextual escape, with its degree accounted

For any EXISTING affine full-coverage row L, `L^2*g_e` is a legal degree4
SOS multiplier of a quadratic clip generator. No wire-box inequality is
needed to justify the square. For example take

    L=C0(R1)=sum_k(H_k-S_k),
    g_e=(tau_(16,den6)-(A6-A1)/6)*(1-tau_(16,den6)).

This context includes the union of all five covering sources, not merely
the own-pair clips. On the retained degree2 diagnostic its expectation is
-32/125, so it defeats that particular separator. At the sharp arrangement
L=13/31 and g_e=0. The length follows from connected R1 source bands spanning
[12/31,25/31]. A legal escape is not a target identity or solver qualification.

For a routed upper p with original clipped inputs alpha,beta put
`h=(p-alpha)*(p-beta)`, `delta=alpha-beta`. For the existing max gate
`r=max(a,p)`, let `h_M=(r-a)*(r-p)`. Main proposed, and Builder expanded,
the exact contextual identity

    delta^2*(f(r)-f(a))
      =(r-a)*(p-beta)^2*(1-alpha)
        +(r-a)*(p-alpha)^2*(1-beta)
        +((alpha-beta)*(r-a))^2/2
        +(r-a)*(alpha+beta-2)*h-delta^2*h_M.           (6)

The key cancellation is

    delta^2*(1-p)=(p-beta)^2*(1-alpha)
                 +(p-alpha)^2*(1-beta)+(alpha+beta-2)*h.

Every non-equation summand in (6) is an existing nonnegative linear margin
times an original clip bound times a square, or a free square. Total degree4;
the old aggregate a needs no bound. The equality multipliers also cost4.
If alpha,beta themselves are carried wires, their bounds cannot simply be
assumed generators. Equation (6) does not remove delta^2: at
alpha=beta=p=r=1/2,a=0 its left side is0 although f(r)-f(a)=3/8.
Moment conservation of paired sums does not by itself justify division or
discarding this discriminant. No global unweighted payment follows here.

These full-context terms are genuine options unavailable to a fixed-weight
triple minorant. They show why that predecessor's rejection does NOT reject
the present class. No coefficient combination of them proving (5) was found.

## 4. Why context can escape the fixed-triple obstruction

Analytically, at an active source set S choose its least active label v.
The triples containing v and two other active labels number C(|S|-1,2),
so this CONTEXTUAL choice equals the complete rank correction (4) pointwise.
It does not assign fixed coefficients to the four conflicting triples of
the predecessor's tetrahedron example.

But the direct Boolean selector is
`X_v*product_(u<v)(1-X_u)`. Multiplying by two further memberships can reach
degree6. This particular analytical expansion is NOT an admitted degree4
certificate on the frozen graph. It adds no variables or generators.
The graph already represents R quadratically through full-prefix wires;
in principle gate cancellation could avoid that Boolean expansion. No such
degree4 coefficient identity has been supplied or proved impossible.

## 5. Feasibility and scoped outcome

The actual attempted assembly was (2)-(5), with contextual clip squares and
routing transfer (6) paying the signed whole-source overlap. Exact cancellation
was established; the uniform nonnegative quantitative payment was not.
Neither the degree2 dual nor an old positional-objective no-go is used to
reject this new-objective degree4 class. No full certificate, qualified sparse
coefficient system, solve cost or exact PSD recovery plan exists in this attempt.
No execution is qualified or released by these algebraic tools.

The existing critic independently accepted (1)-(4) from messages, in the stated
exact-global but no-bound scope. No FULL saved-note acceptance is claimed at
creation; later literal reviews must record their actual observed times.

**Tiếng Việt:** Chưa khép K6. Đã giữ đúng toàn bộ ngữ cảnh phủ: tổng nguồn
trước overlap là tổng15 phần giao hai, còn phần bù đúng là tích phân số chu
trình của tập nguồn đang phủ. Hệ số phụ thuộc các dây của cả hợp phủ có thể
vượt trở ngại trọng số ba cố định mà không tăng bậc. Tuy nhiên chưa tìm được
đồng nhất thức trả đủ phần chênh để đạt40/31; không coi việc thoát một phản
ví dụ hoặc công thức cục bộ là hoàn tất.

Minimal Vibecode: existing Main/Builder/critic hand review only. Mathematical
processes/SDP/code/build/UI/API/DB/Git writes/install/new agents/variables/
gates/infrastructure/scratch/deletions:0. Only reads, hand mathematics and
this one new Markdown record. No restart or successor is automatically admitted.

Critic FULL literal saved-text review of sections1–5 completed at observed
10:57:53UTC: ACCEPT, no blocking correction. This accepts the exact identities,
legal contextual degree accounting and incomplete outcome; it does NOT accept
a global53/31 payment or reject the full new-objective degree-four class.
