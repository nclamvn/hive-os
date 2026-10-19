# TIP101 implementation Builder checkpoint

Scope: implement Main's finite full-K5 shape-cover/full-gradient strategy, not a
second mathematical solver or independent theorem reviewer. Predecessor098/099/
100 sources and evidence were read and are unchanged. All new implementation and
control outputs are within `artifacts/research/tip101`.

## Implemented

- `shape_walls.py`: exact ten cone endpoint lines, triple concurrence plus
  relevant parallel coincidences, primitive signed normals, open-simplex vertex
  sign test. 52 distinct normals; 42 cut the open ordered simplex; 10 do not.
- `coverage.cpp`: homogeneous 3D ordered simplex splitting; shared active-plane
  rank2 identifies edges; checked-int128 Cramer3x3 intersections; all signs and
  active labels retained. No retirement, 4D cube or predecessor grant reuse.
  Time/RSS/cell/coefficient/output ceilings refuse complete status.
- `coverage_check.py`: independently derives the exact42-wall inventory,
  validates signs/active labels, detects duplicate signwords, computes actual
  support hull facets from vertex triples and canonical coplanar groups, projected
  2D monotone hull triangulation, exact tetrahedral volumes. Complete status
  requires full42 processing and totalvolume1/6. Prefix status is explicitly not
  complete coverage for stationary certification.
- `stationary.py`: generic exact symbolic interval-union cone integration yields
  homogeneous quadratic Q, with one both098-path engineering comparison percell.
  Full upper/lower envelope chains yield all Cartesian a<b bottom-extrema pairs,
  not only center interleavings. Symbolic upper/lower tails give exact4-variable
  area quadratics. Full Hessian equations are solved exactly; inconsistent systems
  have no candidate; values>=14/61 are safe independent of feasibility. Every
  belowtarget system requires closed shape/bottom constraints and strictK5.
  Singular affine stationary systems use bounded exact all-active-vertex
  enumeration and meanvertices strict-feasibility test. No PSD or face shortcut.
  Feasible lower candidates require both unchanged098 exactarea paths to agree.
  Partial/malformed cover, arithmetic/time/size/refusal stays explicitly partial.
  Output records polynomial, stationary particular/nullspace, belowtarget full
  constraints, active-system counts and unique-case violated inequalities.

## Executed Builder development validation

One successful small clang++ compile; no installs. Four source AST controls.
24 distinct unit controls PASS, final suite0.391s. Earlier20-control version
also passed0.159s; these reruns do not add distinct controls. Including initial
AST/cone/tail diagnostics, cumulative development validation below2s, below120s.

Controls include wall size/signs, actual tetra volume, missing/coplanar hull
refusal, prefix-only result, duplicate signword, outside-simplex/active-label/
wall-inventory refusal, incomplete cover rejection by both consumers, inconsistent
and constant systems, unique infeasible stationary point, singular feasible mean,
strict-empty singular affine set, singular enumeration cap, the two distinct
source-adjacent quadratics bothvalue14/61/fullgradientzero, reflectedsource
fullgradientzero, fixed source/reflected/symmetric tail-phase laws versus both098
paths, and four tiny native controls for repeated/coincident planes, exactvolume,
cellcap/timecap/coefficientcap refusal. Tiny native geometry has2cells, not a
scientific cover pilot or full enumeration.

## Mathematical and resource boundary

No scientific pilot/fullcover/stationary campaign executed by Builder; Main owns
those invocations and universal proof of C1, coarse-quadratic extension, stationary
completeness and bottom-extrema reduction. Tests/finite arithmetic alone do not
establish the Kakeya root. Main reported a full42wall/2632cell/1527vertex native
cover and independentvolume1/6, but these are Main results, not Builder executions.

Disk check63GiB free before compile. No project copy, scratch directory, venv,
dependency install, Next distDir, Docker, paidAPI, product/UI/auth/DB/config/Git/
deploy mutation. Generated native binary is owned and Main must remove it at
campaign end; source and tiny control evidence retained. At this checkpoint no
files have been removed. No additional agent or mathematical swarm spawned.

## Same-envelope independent acceptance checker follow-up

At Main's request, added `acceptance_check.py`, no optimize/stationary imports.
It independently regenerates42walls, verifies2632cell records and all Cartesian
a<b pairs exactly once, reconstructs chains and every cone Q/area polynomial by
an endpoint coverage-count sweep (rather than producer interval merging), and
uses separately implemented exact elimination, Hessian extraction and complete
nullspace rank checks. Every stationary value is recalculated; belowtarget
shape/bottom/strictK5 inequalities are independently reconstructed. Singular
belowtarget systems require an explicit invariant-inequality contradiction:
normal annihilates every nullspace direction, and the closed constant is negative
or strict constant nonpositive. Such proof records are exported. Otherwise the
checker refuses with UNRESOLVED; it does not run a new LP/vertex search.

16 additional distinct tiny acceptance controls PASS0.531s. They include exact
elimination/derivatives/walls, fixed source energy/fullgradient, one fixed saved
cell and one fixed singular saved cell, malformed/duplicate/missing Cartesian
cases, corrupted energy/area/value/nullspace/constraint rejection, and explicit
derivation-unverified status for arithmetic-only mode. These fixtures intentionally
have only1cell and cannot establish whole coverage. The tests read Main's saved
full evidence but do not execute a full checker, campaign or scientific run.

Total distinct controls40(24+16); cumulative Builder development execution remains
below3s, below120s; one native compile unchanged. Main owns acceptance fullrun and
universal proof. Source-level separate arithmetic is not a mathematical referee,
source independence from the public witness, or a formal Lean certificate.
