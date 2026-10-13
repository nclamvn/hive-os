# Weighted ten-ray identity — Builder hand attempt

Status PARTIAL: no whole target identity and no new degree-four impossibility.
TIP116 PUBLIC_DISCOVERY, all-real G6>=40/31. Scope activation01:24:46UTC,
hardstop01:54:46UTC on2026-10-13. Predecessors frozen; no mathematical process.

## 1. Actual obligation and model

Use the exact490-variable velocity representation from
GEOMETRIC_REDUCTION_COMPLETION_20261013.md, with compact projection domain D
available by its whole-domain packing proof. Write D_ray=C0-C1 and

    Q=3D_R1+2D_R2+D_R3+D_L4+2D_L5+3D_L6
       -2D_L1-D_L2-D_R5-2D_R6, G3=3-Q.

The required output is a nonnegative degree<=4 polynomial identity for
53/31-Q, jointly on the full geometric graph. Neither the old positional
objective's recession obstruction nor a single false-lift escape proves
anything about this target. Existing clips, routing and coverage maxima
retain all source interactions; none is replaced by a sum of pair overlaps.

## 2. Exact pair coupling checked independently

For a=clip(x/m), b=clip(x/n), m>n>0, define

    g_a+=(x/m-a)*a, g_a-=(a-x/m)*(1-a),
    g_b+=(x/n-b)*b, g_b-=(b-x/n)*(1-b).

Main's identity is

    (b-a)*(m*a-n*b)
      =m*((1-b)*g_a+ +b*g_a-)
       +n*((1-a)*g_b+ +a*g_b-).

It is exact: the two x contributions cancel, and the remaining terms are
m*a*(b-a)+n*b*(a-b). Every right-hand summand is an existing quadratic
clip generator times a nonnegative linear bound, of total degree three.
It implies a<=b<=m*a/n on actual assignments, with boundary cases retained.
It is a positive local coupling, NOT a bound on Q.

## 3. Exact triple coupling and its reverse

Let x=Aj-Ai, y=Ak-Aj, m=j-i, n=k-j, and
a=clip(x/m), b=clip(y/n), t=clip((x+y)/(m+n)). All are existing central
crossings. Then

    a*b*(1-t)*((m+n)*t-m*a-n*b)
      =m*b*(1-t)*g_a+ +n*a*(1-t)*g_b+
       +(m+n)*a*b*g_t-,

and

    t*(1-a)*(1-b)*(m*a+n*b-(m+n)*t)
      =m*t*(1-b)*g_a- +n*t*(1-a)*g_b-
       +(m+n)*(1-a)*(1-b)*g_t+.

Both expansions were independently checked by cancelling x and y. Each
right-hand summand is an existing quadratic generator times two existing
nonnegative linear bounds; total degree is exactly at most four. There
is no new generator, division or exclusion of saturation at0/1.

These identities retain actual three-apex additive geometry, but their
vanishing activation factors must not be cancelled at boundaries. An
identity for Q cannot be inferred from interior equalities alone.

## 4. Attempted target assembly and exact remaining gap

The hand attempt was to assemble these nonnegative degree3/4 expansions,
free SOS and permitted routing/union equation multiples into 53/31-Q.
No coefficients accomplishing that assembly were obtained. In particular
the ten D_ray are measures of WHOLE coverage unions: their upper routing,
nesting, simultaneous contact and saturation cannot be removed by treating
the area as a pair-separable objective or by using a local clip identity
as though it were the target polynomial.

No globally sufficient inequality, nonnegative coefficient vector or PSD
Gram identity is supplied. No counterexample to the full new representation
or its unrestricted degree-four certificate class is proved. The exact
local expansions are preserved as checked attempt material, not a necessary-
condition milestone or a new K6 floor. Full coupled coverage calibration is
the open obligation. No numerical execution is justified merely by these
local identities or by small individual supports.

## 5. Completion and resource record

Builder new mathematical derivation STOP observed01:33:20UTC, early after
the feasible hand assembly attempt was exhausted, NOT cap exhaustion. Later
work is recording and literal review only; no successor route is adopted.

Builder FULL predecessor completion read was observed01:23:06UTC: ACCEPT,
no blocking error in compactification, velocity objective, contacts,490
counts, degree-two diagnostic or its quartic escape. Those conclusions
remain the predecessor's scoped results, not a new certificate here.

Independent critic likewise reports the pair relation and both triple
expansions exact and admissible, with no full Q assembly or full D4 no-go.
No actual target certificate exists in this note to route for acceptance.

Created only this optional Builder note. Mathematical subprocesses, code,
SDP/numerical trials, installs, builds, UI/API/DB/Git, new infrastructure,
agents, copied projects or deletion: all0. Nothing removed. Minimal Vibecode
is used for the existing scope/report/review workflow only.

Kết luận: các đồng nhất thức clip cục bộ đúng, nhưng chưa ghép được với
hợp coverage thành chứng chỉ toàn miền. K6 vẫn OPEN; không có cận dưới mới
và không tự cấp phép chạy solver hoặc tăng bậc.
