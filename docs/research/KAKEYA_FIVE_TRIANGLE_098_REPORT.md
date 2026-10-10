# TIP098 — Kakeya five-triangle feasibility and bounded attack

**Overall: PARTIAL.** The root C_T(5)=14/61 is neither proved nor refuted.
No measured HIVE advantage, blind benchmark or authenticated product E2E.

Started2026-10-10 07:52:51UTC; mathematical/checker work closed08:03:31UTC;
terminal checkpoint08:06:36UTC (13min45s, within45min/08:37:51UTC ceiling).
Direct owner routing: `tốt triển khai chứng minh năng lực giải pháp` after the
explicit five-triangle selection analysis. Charter:
`docs/contractor/tips/TIP-098_KAKEYA_FIVE_TRIANGLE_FEASIBILITY.md`.

## Outcome rather than activity

1. Independently implemented rational area calculations reproduce the published
   14/61 witness and reject the apparent numerical improvement from bounded search.
2. Main derived a compact all-offset reduction to[-3,3]^4 (x5=0), plus an exact
   strict-local-minimum proof with a reproducible adjacent-cell arithmetic certificate.
3. Main derived a coarser polygon-combinatorics partition:78 hyperplanes rather
   than184 sweep-order hyperplanes suffice for piecewise quadratic union area.
   Exact counts are replayed; the coarser partition's sufficiency is a written
   geometric argument, not a formalized theorem or full-space minimization.
4. The missing global lower bound is explicit. Neither finite negative search,
   local optimality nor smaller partition counts discharge it. Do not report a
   new Kakeya solution, mathematical breakthrough or method superiority.

## Problem and source exposure

For j=1,...,5,

    T_j(x_j)=conv((x_j,0),(x_j+1/5,0),(x_j+j/5,1));
    C_T(5)=inf_x area(union_j T_j(x_j)).

The accepted root evidence is either an all-real-offset proof C_T(5)>=14/61,
together with an attaining witness, or an exact explicit smaller-area witness.

Main read the known coordinates, source open status and event-sweep description
before this campaign. It is not an independent first-pass or blind test.
Primary sources:

- https://arxiv.org/html/2608.23691v2 , section6.4,14September2026.
- https://dualverse.ai/station/math/discretized-kakeya-needle/ .
- https://arxiv.org/html/2511.02864v1 , section6.9, historical Keich/AlphaEvolve
  construction comparison; older records are not current novelty baselines.

Targeted latest-result searches returned the source/open-problem descriptions,
not a newer closure. They are not exhaustive literature certification. No source
universal theorem or Lean proof was independently compiled in this campaign.

## Mathematical result established here

Full arguments and explicit matrices are in
`artifacts/research/tip098/MATHEMATICAL_WORKING_NOTES.md`, sections1,4,5.

### Compact reduction

Each triangle projects horizontally onto[x_j,x_j+j/5]. Translate disconnected
projection components until they abut. Areas within a component are unchanged;
overlap between components can only decrease union area. The final connected
projection has length<=sum_j j/5=3. After a common translation fixes x5=0,
every offset lies in[-3,3]. Continuity gives attainment on this compact domain.
This does not impose symmetry, sorted offsets, rationality or a grid.

### Exact local theorem

Let z*=(79/305,47/305,10/61,12/305), q=z-z*, ell=3q1-4q2+q4.
At z* only one of184 canonical event walls vanishes:15x1-20x2+5x4-1=0.
Every other sign is preserved for ||q||_infinity<3/1525.
The two adjacent area polynomials are

    A(z)=14/61 + (1/2)q^T H_-q, ell<=0;
    A(z)=14/61 + (1/2)q^T H_+q, ell>=0.

The matrices are displayed in the working notes and retained in the full replay
JSON. Leading principal minors:

    H_-: 5,125/12,6625/72,38125/72;
    H_+: 35/4,125/4,6625/24,38125/24.

Both are positive definite. Their difference is(5/12)vv^T, v=(3,-4,0,1), so
the two polynomials agree at ell=0. Thus z* is a strict local minimum and is
the unique minimum over these two adjacent cell closures. It is not established
that all configurations can be reduced to these cells without increasing area.

This is an exact computational/written local proof, not arbitrary finite sampling:
the slice derivation proves degree<=2 on each event cell;15 unisolvent exact
values determine its15 coefficients; the certificate checks all sample points
belong to the required cell. Sylvester's criterion and continuity complete the
local conclusion. Degree<=2 is Main's stated analytic premise, not certified by
unit tests. No independent mathematical referee/formal proof/novelty claim.

### Coarser global proof route

For ten slanted boundary laws b_i(z)+s_i*y, retain only the parameter walls
where boundaries meet at y=0/1, parallel boundaries coincide, or three boundaries
concur. These fix the clipped line arrangement and the selected union boundary.
Its vertices are affine in z, making shoelace area rational quadratic per cell.
The diagnostic found78 such walls, a subset of184;106 unnecessary sweep-order
comparisons can be omitted. This reduction is about mathematical representation,
not removal of cases without proof. Continuity includes boundaries; a global
certificate must still treat every coarse cell/face and singular stationary set.

For context only, general-position region upper bounds in four dimensions are
47,256,031 for184 walls and1,505,583 for78. These are NOT actual region counts,
timings, cost guarantees or completed coverage. No unbounded enumeration launched.

## Finite search and the rejected numerical improvement

| Search | Parameters | Actual work | Result |
|---|---|---|---|
| Coordinate pattern | seed98001,200starts,[-3,3]^4 | 7708iterations,61864objective evaluations,1.2534s | known witness |
| DE/rand/1/bin | seed98002,50population,10000generations,[-3,3]^4 | 500050objective evaluations,28.1089s | roundoff-scale apparent gain |

Both include the published and symmetric witnesses as initial states. These are
two conventional numerical searches, not A/B solver arms, independent discoveries,
or fresh LLM calls. Counts are not proof evidence.

The submitted rationalized DE candidate

    (79/305,154064/999777,10/61,12/305,0)

has exact area

    14/61 + 1/55790109285624135,

strictly worse than the reference. BOTH exact paths agree. The original float
coordinates were not separately converted to exact binary-rational witnesses;
there is no validated improvement. The useful behavior here is rejection of an
unsupported numerical record, not proof that HIVE beats an equally equipped LLM.

## Technical verification and preserved failures

One implementation Builder wrote the small stdlib tools; Main owned mathematical
derivations and adjudication. Builder is not a fresh mathematical reviewer or
competing solver. Source inspected by Main before execution.

Main used all8 allowed command invocations:

1. First focused suite:20tests,18pass/2fail due pending wrong n2 fixtures.
2. Reference evaluation, contact-wall local interpolation and normal probes.
3. Two adjacent4D Hessian candidates, retained exact JSON.
4. Coordinate search (no improvement).
5. Event-wall/radius diagnostics (184,onezero,3/1525).
6. Coupled DE search (no validated improvement).
7. Exact reference/symmetric/rationalized-candidate validation.
8. Final29tests, syntax parsing of3owned Python files, complete local arithmetic
   certificate and geometry-wall count diagnostic: exit0,29/29,0errors/failures,
   0.5758seconds combined; no ninth rerun or hidden reset.

Full final JSON retained as`MAIN_FINAL_VERIFICATION.json`, not a transcribed
subset. It contains30 exact interpolation points checked by both algorithms,
2760wall-sign comparisons per side, all184 walls, gradients, Hessians/minors,
rank-one relation and scope labels. It was not tool-display-truncated.

The first fixture incorrectly expected[1/3,0] to attain1/3 for n2. It actually
has area3/8; [1/6,0] attains1/3. The initial suggested[1/4,0] gives11/32. These
errors were corrected in fixtures and preserved in the Builder report, not erased
as successful runs. A Builder diagnostic also initially retained a constant
nonzero equation as a hyperplane (185 rather than184); discarded as a non-wall.

Syntax3/3 PASS; focused tests29/29 PASS; no Next build/type/lint/Lean/E2E run
(not applicable to this standalone Python package). Builder own validation<2s,
below180s. Main commands each<120s and their combined runtime far below600s.
No authenticated backend/model/token/cost receipt or human-effort measurement;
these remain UNKNOWN. No paid API manually called.

## Scope, requirement coverage and stop

- R1 source/witness status: complete in the explicitly limited search scope.
- R2 exact finite checker: complete, replayed.
- R3 bounded attack and structural feasibility: complete as an investigation;
  original mathematical root UNRESOLVED.
- R4 integrated honest report: complete.

Engineering/investigation delivery is not whole-problem mathematical closure.
The proposed full-space global certificate has NOT been built or run; its actual
cost is unknown. Fair strong-LLM/non-LLM A/B has NOT been launched. It would be
misleading to call this run evidence of HIVE superiority or worthwhile investment.
TIP096 ceiling/tie and TIP097 source-assisted/first-attempt partial remain intact.

STOP this envelope: no more numerical searches, replacement problem, n6/128,
source-gap renaming, default swarm or extra gates. The next research obligation,
if routed, is an all-space structural lower bound or COMPLETE coarse-cell
certificate, not repeated perturbation around a certified strict local minimum.
Do not build another large framework merely to make this report look complete.

No product/UI/auth/DB/config/Git/commit/push/deploy/build/install/Docker changes.
Only tip098 tools/evidence/notes, this report, charter and append-only research
checkpoints. Existing dirty worktree preserved. Removed the two bytecode files
created by Main's initial non-`-B` checks and their empty local__pycache__directory;
no material user data removed, no scratch copy or new distDir created.
