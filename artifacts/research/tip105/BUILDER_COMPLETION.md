# Completion report — TIP105 single K6 Builder

STATUS: DONE for scoped R2 implementation/construction and local inspection.
The global K6 root is OPEN. Main owns R1 source comparison, R3 all-real transfer
proof, R4 bilingual report and final verification.

## Files changed

Created only under `artifacts/research/tip105`:

- `k6_structured.py`: deterministic structured numerical navigation; exact K6
  finite evaluation through both unchanged TIP098 sweeps; finite compatibility
  arithmetic; create-only `--out` evidence option.
- `k6_local.py`: rational endpoint-arrangement walls and exact symbolic area
  polynomial from a generic nearby slab-order point, plus Hessian/minor checks.
  Final source adds create-only `--out` and emits all147coarse wall rows/signs.
- `test_k6.py`: eight named focused controls.
- `BUILDER_NAVIGATION.json`: full 25-seed navigation ledger and exact replay.
- `BUILDER_LOCAL_CERTIFICATE.json`: exact local arithmetic certificate.
- `BUILDER_CONTROLS.txt`: actual fresh test output.
- This completion report.

No old mathematical source/evidence, app code, DB/auth/config, Git state, runtime
grants, build outputs or external services were edited. No install or compiler.

## Exact new construction

Offsets x=(49,43,23,26,6,0)/186. Both immutable exact implementations give
area=20/93. The public reversal benchmark x_j=(6-j)/18 gives area2/9 through
both routines. The improvement is exactly2/279. The candidate is reflection
fixed: x1+x6=x2+x5=x3+x4=49/186. These are finite constructive upper bounds,
not a global-optimality or novelty claim.

Numerical navigation used exactly25 public/structured seeds: one reversal
configuration, and both horizontally scaled K5 equality points with12 natural
sixth-base insertion endpoints each. No random starts, random grids, full-space
cover or inherited old search routine was executed. The best observed point
came from the reversal seed.25/25 starts completed,35,575 objective evaluations,
3.024893834s including exact rationalizations and symmetric replay. The
`converged` ledger flag means the coordinate step fell below1e-9, not a rigorous
stationarity certificate. Rational denominator caps1000 and10000 recovered the
same small-denominator20/93 witness; larger caps gave nearby rational points.

## Exact local result and premise

The witness lies strictly inside ONE coarse endpoint-arrangement chamber:
147 nonconstant walls, zero active coarse walls, strict infinity-norm radius
1/465. The463-wall fine sweep-order arrangement has three zero walls:

    (0,1,-1,-1,1,0)
    (1,-1,0,0,-1,0)
    (1,0,-1,-1,0,0)

They are unrelated event-height swaps, not endpoint-concurrence or clipping
walls. Main reports source inspection of the coarse-chamber quadraticity premise
passed. These finite arithmetic checks themselves do not prove that premise.

Within the chamber, symbolic integration at a generic rational nearby point
produces A(x)=20/93+(1/2)(x-x*)^T H(x-x*) with

    H = [[7,-6,-1,0,0],
         [-6,33/2,-9,-3,3/2],
         [-1,-9,13,0,-3],
         [0,-3,0,13,-9],
         [0,3/2,-3,-9,33/2]].

Exact gradient at x* is zero. Leading principal minors are
7,159/2,342,3636,25110, all positive. Both old rational area routines agree
with the symbolic polynomial at its generic center and at the witness.
Assuming the reviewed coarse-arrangement quadraticity argument,
this certifies a strict full five-dimensional LOCAL minimum for
||x-x*||_infinity<1/465. It does not cover other coarse chambers or establish
global K6 optimality. No all-cell certificate, human referee or novelty claim.

Main additionally notes that the geometric union-polygon argument extends this
same polynomial throughout the entire coarse chamber and continuously to its
closure. With that proof, H positive definite certifies a unique minimum20/93
on that closed REGIONAL chamber, still not across other chambers or all offsets.
The final complete wall/sign output supports Main's fresh replay. The retained
Builder certificate predates that additive output property and has no wall rows;
no hidden Builder rerun occurred after the four-invocation quota was exhausted.

## Compatibility helper

The finite exact K5 apex equality points are
(29,93,116,165)/61 and(49,72,136,165)/61. For
L(u)=(u2-u1,u3-u2,u4-u3) and R(v)=(v1,v2-v1,v3-v2),
the four squared mismatches are[[3582,450],[72,3582]]/3721.
The controls verify min mismatch/16=9/7442 and its5/6 scaling15/14884.
The operator-norm and all-real K5-transfer/stability proofs are Main's;
the global stability c is existential, NOT a numerical certificate.

## Tests and invocation accounting

Builder used all FOUR allotted mathematical Python invocations:

1. Initial navigation immediately failed `ModuleNotFoundError: No module named
   'scipy'`. No objective evaluation, dependency installation or fallback hidden
   in that process. Tool-reported execution wall time0.000009167s; no independent
   internal timing. This failed invocation remains charged against the quota.
2. Revised stdlib navigation: PASS; internal elapsed3.024893834s.
3. Exact local arithmetic: PASS; internal elapsed0.046760583s.
4. Focused controls:8/8 PASS,0 failures; unittest internal elapsed0.055s.

Successful internal timing sum3.126654417s. Conservative cumulative account
<5s, allowing the immediate import refusal/tool rounding. Each successful
calculation far below60s; navigation/local sources also signal-stop at59s.
No further Builder mathematical process is authorized or executed. Main's
replays are separate and must be counted in the shared8-process/300s envelope.

Named controls: structured seed inventory; exact witness and float navigation
agreement; symmetric benchmark; reflection; malformed inputs/gauge refusal;
compatibility arithmetic; local symbolic polynomial; create-only output contract.
Create-only persistence refusal is mocked in the unit control, not an actual
filesystem contention test. Both new numerical/local sources were interpreted
in actual runs; no separate compile, application typecheck, lint or build was
run. A Main rerun does not double the count of eight distinct named controls.

Final additive `--out`/wall-row output edits were source-inspected but not
executed anew by Builder; Main has reserved fresh test/local invocations for
their final-source verification. Original Builder output remains unmodified.

## Issues / deviations / suggestions

- SciPy absent: replaced the optional initial dependency with stdlib cyclic
  coordinate navigation after one charged refusal. This stayed inside the
  permitted deterministic structured construction, with no new package install.
- Exact symbolic integration replaced a more expensive finite-difference local
  Hessian recovery; implementation detail only, same local scope.
- The rational candidate and local arithmetic are new scoped deliverables; an
  all-real matching lower bound and source-priority check still prevent global
  closure. Do not promote the strict local minimum to a global result.
- No scratch project, venv, dependency install, Docker image, build/distDir or
  Python bytecode was created. Nothing removed. Existing source pins preserved.
- STOP after the scoped Builder deliverable. Future search or whole-space
  certification needs separate human routing, not unused elapsed-time allowance.
