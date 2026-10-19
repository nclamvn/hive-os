# TIP116 R4 — Main whole-height inversion work

Status: IN PROGRESS / GLOBAL K6 OPEN. Same PUBLIC_DISCOVERY/R116-1..3.
Activation2026-10-12 05:19:10 UTC; derivation cutoff06:09:10 UTC;
hardstop06:19:10 UTC. Mathematical subprocess grant0. Predecessor files frozen.

## 1. Exact strip formulation with the early joint-coverage term retained

Let the inverted adjacent apices be a=A_i>b=A_(i+1), u=a-b>0.
Retained range r<=49/31 gives 0<u<=r-1<1. In the pair's co-moving
coordinate the old intervals are [a,a+t] and [b-t,b]. Let O_t be the
UNION of the four unchanged intervals in the same coordinate, E=1-1_O.
Define B=[b,a], B_+(t)=[b+t,a+t], B_-(t)=[b-t,a-t], and

    K(t)=[max(b,a-t), min(a,b+t)],

with K empty if its endpoints are reversed. The retained exact gain is

    G_old-G_swap = integral_B S(x)dx - R_u,
    S=P_++P_--L,
    R_u=integral_0^u (integral_B E - integral_K E)dt.

For sigma=0,+,- let ell_sigma(t)=|O_t intersect B_sigma(t)|,
and ell_K(t)=|O_t intersect K(t)|. Fubini gives directly

    integral_B S = u + integral_0^1(ell_0-ell_+-ell_-)dt.

For t<u/2, K is empty; for u/2<=t<=u its length is2t-u. Thus

    R_u=3u^2/4 - integral_0^u(ell_0-ell_K)dt,

and the EXACT coupled finite-swap gain is

    G_old-G_swap
      = u-3u^2/4
        + integral_0^1(ell_0-ell_+-ell_-)dt
        + integral_0^u(ell_0-ell_K)dt.                 (T)

All ell are intersections with the whole O union. Since K is contained
in B for t<=u, the last integral is nonnegative, but may not be replaced
by a sum of pairwise overlaps. No exposure/contact regularity or generic
matrix is assumed. Interval ties change no area integrals. This reformulates
the saved exact identity, rather than proving a new target bound.

The whole missing inequality is positivity of(T) on the declared retained
actual global-minimum domain, or a different complete value/exclusion theorem.
There is NO proof here that the retained range/bottom filters alone imply it.

## 2. One prospective sufficient bound, still UNPROVED

The Builder proposes the actual-union averaged bound

    integral_b^a S >= u(5-r)/12 + u^2/3.              (P)

If(P) held for every retained inversion, using the actual R_u<=3u^2/4
and u<=r-1 would give

    G_old-G_swap >= u(5-r-5u)/12
                >= u(5-3r)/6 >=4u/93>0.

This algebra is valid; its premise(P) is NOT established. It is stronger
than needed for(T), because it discards the nonnegative early joint-coverage
term. Failure of(P) would not by itself refute(T), K6, or a claim restricted
to actual global minima. The old pointwise fan lower envelope is false and
must not be used as a proof of(P).

An alternative proof mechanism for the SAME(P), also UNPROVED, is the
sublevel-measure bound on y in[1,r], with c=(5-r)/12:

    measure{y:S(3+y)<h} <=(3/2)(h-c)_+.               (D)

For noncentral pairs use the corresponding coordinate x=i+y; no i=3
assumption is allowed in a universal version. If(D) were true it would
entail S>=c almost everywhere. For any measurable interval/subset B of
lengthu, layer cake then yields

    integral_B(S-c)
      >= integral_0^(2u/3)(u-3s/2)ds = u^2/3.

The analytic implication D=>P is sound, but(D) is a stronger unproved
geometric premise. Rearrangement is a possible proof tool, not acceptance.

### Scope correction before any geometric use of(D)

Independent critic points out that the full six-triangle bottom connectivity
only implies O_1 covers the ACTUAL corridor B, not the entire ambient
y-range[1,r]. The old pair can bridge other gaps outside B. Moreover other
apices are excluded from B, not necessarily from that entire ambient range,
so positive-distance source-band formulas may not extend there unchanged.
No inference of whole-range O_1 coverage was made or is admissible.

The adequate pending premise is instead D_B on B alone:

    measure{x in B:S(x)<c+s} <=3s/2, s>=0.

This SAME layer-cake implication yields(P) on B and requires no off-corridor
source assumption. D_B is still unproved; correcting its domain is not
mathematical closure. A movable V-minorant on B with slope4/3 would suffice
for D_B. Such a minorant requires the two-point condition

    S(x1)+S(x2)>=2c+(4/3)|x1-x2|,

and S>=c; neither condition has been established from actual four-source
geometry. The refuted fixed symmetric fan does not supply this movable one.

The preceding additional suggestion that positive-distance ray formulas
could fail off B within[1,r] was WRONG and is withdrawn. Critic immediately
corrected it: for lower sources d=m+y-p_k>=m+1-r>=2-r>0;
for upper sources d=n+1+p_k-y>=n+1-r>=2-r>0. Thus the band formulas
are valid throughout that ambient range when r<2. What does NOT extend
is external bottom COVERAGE. This correction changes no accepted theorem:
the only accepted content remains the exact(T) identity and conditional
analytic implications, not a geometric bound.

## 3. Exact actual counter to the STRONGER movable-V premise

This is not a counter to(P), D_B or K6. It rejects a proposed proof
mechanism for(P), preserving the distinction between sufficient premises.
Main derived it by hand; the independent critic FULLY checked the actual
three-ray unions and their four pieces and accepted the counter.

Set r=79/50 and p=(0,1,r,0,1,0), with central inversion3/4.
The actual corridor is x=3+y, 1<=y<=r, u=r-1=29/50.
The other apices are A1=1, A2=3, A5=A6=6. The bottom union is connected:
its distinct starts are0,1,r and their consecutive gaps are1 and29/50.
The outer adjacent-apex tie is removed by the strict perturbation below.

Lower external ray distances are2+y and y. The two upper external
triangles have common distance f=3-y. Whole center coverage is

    C_union=[min(y/2,f/3),1],

with lower/upper center bands overlapping throughout the corridor. The
whole plus coverage is[f/4,f/2]; the lower plus bands are empty after
clipping. The minus coverage is the union of

    [y/3,y/2], [(2+y)/4,1], [f/2,1].

Its total length is1/2-y/12 for y<=4/3, 2y/3-1/2 for
4/3<=y<=3/2, and1-y/3 for y>=3/2. Thus EXACTLY

    S(y)=3/4-y/6                 for1<=y<=6/5,
         -1/4+2y/3               for6/5<=y<=4/3,
         3/4-y/12                for4/3<=y<=3/2,
         -3/4+11y/12             for3/2<=y<=79/50.

In particular

    S(1)+S(r)=7/12+419/600=769/600,
    2c+(4/3)u=806/600, c=(5-r)/12.

The exact violated margin is37/600. Any V-minorant with heightc and
slope4/3, no matter where its center is placed, would imply the opposite
two-point inequality by the triangle inequality. Hence NO such movable
V-minorant exists for this actual geometry.

### Strict actual geometry, not a tie artifact

Take epsilon=1/10000 and

    p_epsilon=(epsilon,1,r-epsilon,epsilon,1-epsilon,0).

The actual range is r'=r-epsilon, corridor y∈[1+epsilon,r-epsilon],
and u'=u-2epsilon>0. The strict apex word is(1,2,4,3,5,6),
with all external apices distinct and naturally ordered. The distinct bottom
starts are0,epsilon,1-epsilon,1,r-epsilon; all gaps are strictly below1.
Bottom minimum is uniquely label6, maximum uniquely label3. No actual
gradient/global-minimum claim is made.

Clipping a band to[0,1] cannot increase its endpoint-displacement bound;
the symmetric difference of a union is bounded by the sum for its bands.
For lower/upper distance2 sources the sum of the three bands' reciprocal
endpoint coefficients is35/12; for distance1 sources it is10/3
(the infinite endpoint has zero movement). At either moved corridor endpoint,
the four distance displacements are bounded by2epsilon,epsilon,2epsilon,
epsilon respectively. Therefore each S changes by at most75epsilon/4.
The two-endpoint sum changes by at most75epsilon/2, while the V right
side changes by-5epsilon/2. The strict violated margin is at least

    37/600-40epsilon=173/3000>0.

This proves the movable-V premise false also without an external-apex tie,
bottom touch or range-cap equality. It is an actual geometric obstruction
to that STRONGER premise, not a stationary or K6 counterexample.

The original unperturbed function has S>=11/20 on the entire corridor.
Indeed its minimum is at y=6/5. Since c+u/3=287/600<11/20,
this particular configuration SATISFIES(P) strictly. The V failure cannot
be promoted into failure of(P) or D_B. No new root proof has been obtained.

## 4. Terminal disposition

Main new derivation STOP05:46:49 UTC after the definite failed movable-V
closing mechanism; Builder records its own STOP05:47:48 UTC. This was not
time/budget exhaustion and did not refute the weaker(P) or actual(T) gain.
Only literal saved-proof review, reporting and metadata followed.

Critic FULL Main1--3 acceptance checkpoint05:48:09 UTC; its later literal
Builder6 wording review05:49:10 UTC. Main fully read the saved critic note,
Builder1--6 and both completions within the run; last completion read batch
05:49:23 UTC. Accepted scopes are the exact identity, conditional analytic
implications, conditional uniform positive-u face transfer and actual V-only
counter. None is a whole inversion theorem. The Builder's pre-stop auxiliary
radial-curvature observation is retained UNREVIEWED/UNUSED, not acceptance.

R116-1 remains OPEN: no one of the twelve inverted continua is certified by
this work. Full boundary/collision/attainment assembly is not opened. Frozen
natural classification is not promoted into an all-real theorem. No Lean,
external referee, novelty or general Kakeya claim. No automatic follow-up.

Primary-source definition refresh only: Station's discretized-needle notebook
https://dualverse.ai/station/math/discretized-kakeya-needle/ was opened during
the permitted read-only literature lane. Its finite-model definition is the
same triangle model used here. It supplies no proof of this run's missing
inversion inequality and is not a novelty audit. No source code was executed.

## Ledger (interim)

Ordinary source/status/clock reads and new Markdown only. Mathematical
processes0, seconds0, failed starts0. No optimizer/sample/enumeration/LP/
replay/code/UI/DB/auth/API/Git/build/install/copy/Docker/delete/infra.
No scratch/distDir created, nothing removed. Existing dirty work untouched.
Two guessed ordinary source names did not exist; rg --files resolved the
observed inventory. No mathematical execution or predecessor edit occurred.
