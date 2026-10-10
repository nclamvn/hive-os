# TIP-098 — Five-triangle Kakeya feasibility and bounded attack

- Mode: PUBLIC_DISCOVERY_FEASIBILITY, not a blind benchmark or production E2E.
- Owner routing: `tốt triển khai chứng minh năng lực giải pháp`, following the
  explicit proposal to investigate whether C_T(5)=14/61.
- Start: 2026-10-10 07:52:51 UTC; stop no later than 08:37:51 UTC (45 minutes).
- Predecessors: TIP096 ceiling/tie and TIP097 source-assisted proof remain closed
  and preserved. This is not a replacement case in their measurements.
- Working directory: /Users/os/hiveos; no project copy, install or build.

## Exact root

T_j(x_j)=conv((x_j,0),(x_j+1/5,0),(x_j+j/5,1)), j=1,...,5.
Decide whether inf_x area(union_j T_j(x_j))=14/61. Fix common translation x_5=0.
Admissible mathematical closure is either a complete all-real-offset lower bound
14/61, with the known attaining witness, or a rigorously checked rational witness
with area strictly less than 14/61. No finite search proves global optimality.

## Work packages / acceptance

- R1: Confirm current source scope and exact known witness. Newer-result searches
  are documented as searches, not exhaustive literature certification.
- R2: One small stdlib exact area checker, using rational event-height integration,
  plus an independently formulated second calculation. Verify single/known small
  examples, translation/reflection invariance and malformed-input refusals.
- R3: Main investigates a structural reduction and may conduct bounded finite
  candidate searches. Every claimed improvement passes both exact calculations.
  Record the unclosed global obligation and whether full-space certification is
  feasible; do not brute-force an unbounded arrangement by default.
- R4: One integrated report separating mathematics, engineering, source reuse,
  resource observations, novelty and method advantage.

## Boundaries

One implementation Builder only, authorized by the Vibecode Kit role split;
not a fresh mathematical solver, critic, or A/B arm. Main owns mathematics and
adjudication. At most 8 Main tool invocations of the checker/search after Builder
delivery; each <=120 seconds and total <=600 seconds CPU/wall allocation. Builder
own validation <=180 seconds. Search domain/grid/seed/iterations must be recorded.
No paid API, product/UI/auth/DB/Git/deploy, new gates or new research infrastructure.
No new mathematical agent or A/B dispatch in this envelope. A later fair comparison
requires explicit design and resource matching; this run cannot establish causal
HIVE superiority. No switch to n=6/128 or another problem after a failure.

## Minimal implementation brief

Create artifacts/research/tip098/kakeya_exact.py and a focused test file.
For arbitrary rational offsets (n<=8), slice interval j at height y is
[x_j+j*y/n, x_j+1/n+(j-1)*y/n]. Include 0,1 and every endpoint-crossing height in
(0,1); integrate interval-union length exactly between successive heights.
The second exact calculation should instead form the union-length affine formula
from midpoint ordering on each slab and integrate its coefficients, not simply
call the first area function again. Expose rational CLI evaluation with JSON output.
Optional deterministic float candidate search is confined to n=5 and reports
approximate candidates only; exact validation is separately required. No third-party
dependencies, copied upstream checker or global-optimality labels.

The report is PARTIAL unless mathematical root closure is actually established.
Stop on completion/ceiling and preserve all failures. Do not spend the remaining
budget on scaffolding merely to obtain a DONE status.
