# TIP103 Builder completion — 11 October 2026

Scope: bounded offline equality analysis of the retained TIP101 K5 certificates;
no new cover, lower-bound replay, optimization, model call, UI or infrastructure.
All new Builder files are in `artifacts/research/tip103`; predecessor bytes were
not edited. Main owns the analytic proof, literature assessment and final claims.

## Exact inputs and implementation

- Cover `MAIN_FULL_SHAPE_COVER.json`: SHA256
  `3097a3df15e02f5d299811bc9edbaab453211fdffd1559aedfa50b7e40a78c4a`.
- Stationary `MAIN_FULL_STATIONARY_CERTIFICATE.json`: SHA256
  `95d41c6565ccd683bab2376463b402fa3f7170b99bf3daa881c3b15b0878707c`.
- New analyzer `equality_analysis.py`: SHA256
  `f9e31171f6e265ffd9fd4fd6184e8b6b719cfd80297e848874141597cff3f5a7`.
- Final Builder evidence `EQUALITY_ANALYSIS_FINAL.json`: SHA256
  `c4d87fb3c6545382f481d17f840a414ea50e81aae0f234909c032c140751ab0e`.

Reuses the independent TIP101 acceptance helper's rational elimination,
derivatives, constraints and value evaluation—not the producer's stationary
algorithm. Re-eliminates every distinct polynomial, verifies each saved
particular/nullspace and stationary value, reconstructs equality feasibility
from shape closures, strict complete-overlap constraints and closed bottom
max/min constraints. Both unchanged TIP098 area algorithms verify feasible
offsets. This is independence from the original producer, not independence from
the whole project: the predecessor's analytic premises and trusted geometry
inventory remain dependencies.

## Invocation ledger and retained correction

1. `PYTHONDONTWRITEBYTECODE=1 python3 artifacts/research/tip103/equality_analysis.py`
   at approximately 00:34:54 UTC: full scan 5.057629 s, all equality systems
   accounted. Output `EQUALITY_ANALYSIS.json` retained. Its incident-law loop
   omitted the 130 inconsistent cases, although those cannot be incident at a
   stationary minimizer under the predecessor C1 premise. This was corrected
   before acceptance rather than silently erasing the first result.
2. Same command after including **all** cases in incident-law inspection:
   5.034239 s. Output `EQUALITY_ANALYSIS_FINAL.json` retained; every one of the
   8,658 cases now inspected at each minimizer. Same equality and local results.
3. `PYTHONDONTWRITEBYTECODE=1 python3 artifacts/research/tip103/test_equality_analysis.py`:
   six tiny controls PASS; unittest duration below 0.001 s, process/tool roundtrip
   about 0.1 s. Conservatively counted as a mathematical invocation. No full
   rescan in tests.

Builder consumed three of the shared six process invocations. Full scientific
scan time 10.091868 s; conservative combined budget charge 11 s (including the
tiny-control process), below 300 s. Each full run has its embedded 120 s time
and 1536 MiB RSS checks. No additional scientific process executed by Builder.
CLI was subsequently extended with `--out` for Main's fresh create-only replay;
output is restricted to this TIP103 directory. No hidden rerun followed that
small CLI change. Main's process is not included above.

## Equality classification

- All 2,632 retained cells and 8,658 stationary cases inspected.
- All 667 distinct quadratics re-eliminated exactly.
- 68 cases have stationary value exactly 14/61; **all rank four**.
- 64 equality cases violate a closed shape/bottom constraint.
- Four cases are feasible; they deduplicate to two points in gauge x5=0:

  `m=(79,47,50,12,0)/305`, and
  `Rm=(79,67,29,32,0)/305`.

- Corresponding normalized apex coordinates A2...A5 are
  `(29,93,116,165)/61` and `(49,72,136,165)/61`.
- Each point has two equality phase records, pair (1,5): cells 1245/1246
  for m; cells 1903/1910 for Rm.
- There are **no singular equality loci**: none were omitted, unresolved or
  dismissed using a test of one particular point. Generic singular-locus
  handling only permits invariant-row exclusion and otherwise returns OPEN.
- Both exact area integrations give 14/61 at both points.
- Reflection `R(x)=(x1,x1-x4,x1-x3,x1-x2,0)` exchanges the two points;
  it is an involution but not an assumed Euclidean isometry.

Every actual global minimizer must be one of these points **conditional on**
TIP101's complete cover, corrected C1/phase-law and full-gradient completeness
arguments, plus TIP100's strict complete-overlap reduction. This scan does not
prove those analytic dependencies afresh or provide human/formal acceptance.

## Local stability arithmetic

Every retained phase is tested for incidence at each point, including the 130
inconsistent stationary cases. Each point has exactly two incident laws, both
with zero gradient and value 14/61. Exact Sylvester leading principal minors
are positive for each H and each shifted matrix `H-(1/32)I` (all minors and
coefficients retained). No floating eigenvalues or numerical PSD test used.

The exact nonzero affine wall margins certify A-coordinate L-infinity radii
`1/244` at m and `3/610` at Rm. Inside those open balls, shape-wall signs,
bottom-order signs and strict complete-overlap constraints cannot change except
on walls already passing through the center; **both** incident laws are kept
across those ties. Thus Main can justify on the local phase star:

`Area(A)-14/61 >= ||A-A*||_2^2/64`.

No assertion that the phase star consists of one open chamber is made. The
Taylor identity is exact because every law is quadratic. Converting this into
an x-coordinate local inequality and a compactness-based global bound is Main's
written mathematical task; no explicit global constant was computed here.

## Engineering controls and limits

Six controls: determinant pivot sign, singular determinant, strict shifted-PD
threshold, indefinite-minor rejection, exact gauge conversion, reflection
involution. Tests are helper correctness checks, not independent theorem proof.
At reporting time the four code/evidence files totaled 75,767 bytes; with this
report comfortably below 8 MiB. No scratch copy, install, compiler, bytecode,
distDir, Docker, DB, UI, paid API or Git operation; nothing material deleted.
Novelty, independent human review, unrestricted Kakeya, formal Lean verification
and causal HIVE-vs-LLM superiority remain unestablished.
