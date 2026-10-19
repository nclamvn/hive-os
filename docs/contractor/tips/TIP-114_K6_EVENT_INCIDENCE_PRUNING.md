# TIP114 — Exact event-incidence pruning, not more blind enumeration

Owner directly approves the TIP113 recommendation: “tiếp đã duyệt”. Same ultimate
ALL-real finite K6 F6>=20/93, OPEN. Engineering milestone: reduce unnecessary
147-wall partition work with independently checked certificates. Predecessor
TIP113 report d5046e7ec49243df992d980981cebf5934a1071e66e22b3fdb86abdab7b5089b,
charter a74e1629ca9f6c4e80fa73747ca9049c7313d7ea04f4e36ba7e362aa91f79a92.
Activation2026-10-11 15:24:33UTC; hardstop16:24:33UTC (60min engineering).
Mathematical tests <=120s aggregate, failed starts charged, every call<=30s.
No whole production. Preserve all old sources/evidence and the saved113 forest.

## Smallest change / fixed interface

New proof-only producer/checker under artifacts/research/tip114. Reuse immutable
112 exact algebra/model/LP helpers; checker reuses only independent112 checker,
never producer algorithms. No application/runtime/gate/platform changes.
Schema tip114-k6-v2, same model and stats/limits/run_history; add origin_sha256
64 lowercase hex of the imported v1 artifact. Metadata origin is not a security
grant or a theorem. Import preserves every node/root/history item, changing only
schema and adding origin. Resumev2 preserves origin and all prior evidence.

Existing split nodes stay. New split may choose ANY unused index in147 walls,
with BOTH children; reject repeated wall per path, missing roots/child/cycle/
unreachable data. Old full-depth stationary leaves retain old rules. New
early_stationary leaf fields: kind,sample,polynomial,stationary,incidence.
Incidence = {rows:[signed primitive integer affine rows],duals:[certificates]}.
Rows are sorted, deduplicated; normalize by positive scale only. Independently
derive exactly this inventory from sample; never trust a provided event subset.
Aggregate early/full stationary nodes together in existing stationary_leaves
accounting; processed history still counts every nonpending node once.

## Mathematical early-leaf criterion

Enumerate EVERY nonparallel endpoint PAIR (not unique event heights). For each:
if h<=0, impose -h>=0; if h>=1, impose h-1>=0. Structurally h=0 pairs are
zero events, not new constraints. For an active sample crossing choose lowest
label third interval strictly covering it if any; impose BOTH pos-L>=0 and
R-pos>=0, with no clipping obligation because contribution is zero even if
its height leaves [0,1]. Otherwise impose h>=0,1-h>=0 and, for EVERY third
interval, one fixed outside-side row L-pos>=0 or pos-R>=0, selected from the
generic sample. Strict-apex root handles initial ordering/parallel contacts.
Discard identically nonnegative constants; negative constants must refuse.
All nonconstant decision rows normalize to signed walls in existing inventory.

Each required affine g(p)=a.p+c must be proved >=0 on CLOSED root and CLOSED
path, a safe superset of required rootstrict/pathclosed domain. Shift p=z-R,
z>=0 and existing valid coordinate/epsilon bounds. Given regenerated A z<=b,
an implication certificate {kind:"nonnegative",multipliers:[rational strings]}
requires lambda>=0, lambda A>=(-a,0) coefficientwise and
lambda b<=c-R*sum(a). This proves g>=0 without trusting simplex status.
Use cheap direct cone/row certificates first where possible; LP only when
necessary. If any required row is not certified, split its UNUSED canonical
wall; do not silently drop an event or append a sampled status. No random search.

When all incidence obligations are certified, actual event-spline polynomial
is valid on the ENTIRE partial region by generic density/continuity, not just
one point. Checker independently derives coefficients by slab integration,
then verifies complete incidence implications. Full5 stationarity and ENTIRE
unsafe singular-family feasibility on rootSTRICT/pathCLOSED remain mandatory.
Old strict-empty duals remain unchanged. Early termination needs no split at
irrelevant147walls; global closure still needs all roots/branches and retained
106/107/108F minimum/C1 reductions. Boundary/equality/root distinctions unchanged.

## Requirements and execution

- E114-1: Hand/source argument for whole partial-region polynomial, all events,
  closure faces and full stationarity, challenged independently.
- E114-2: Minimal producer+independentchecker support arbitrary unused splits,
  complete early incidence evidence, exact implication duals, preserved resume.
- E114-3: Focused valid/tamper/missing-event/dual/early-leaf/singular/regression
  tests; a fixed real control demonstrates fewer than147 required wall signs
  IF actually true. Any no-reduction or slower performance must be reported.
- E114-4: Bounded native continuation and independent check from saved113 input;
  measured changed work/terminal progress, no claim global cost qualified.
- E114-5: Completion/Verify EN+VI, honest math/resource/failure ledger/checkpoints.

Main Contractor owns charter/proof/full changed-source review/testing/report,
not code. ProducerBuilder and CheckerBuilder own distinct NEW files; independent
source critic owns review. Skill permits delegation; no new runtime agents.
Read full changed sources before scientific tests. Ordinary AST checks early.
Initial math allocations Builder20s/Checker20s/Main80s, reallocate WITHIN120s,
not automatic extra grant. Builders must request Main release for mathematical
commands; no autonomous runs. Main comparison if useful: old and new producer
from SAME saved113 checkpoint with matched18s cap, max100000, plus independent
checks within remaining budget. No throughput-only whole-cost extrapolation.
Stop logical gap/failed proof control/limit/completion/hardstop; no auto retry.

RSS<=1GiB/evidence<=64MiB/state<=512MiB; cooperative guard limitations disclosed.
df49GiB free. No installs/SymPy/Scipy/build/copies/scratch/distDirs/Docker,
app/UI/DB/auth/config/APIpaid/Gitwrites/oldfile edits or gate framework.
Only owned disposable bytecode can be removed, report it. Do not replace all-real
closure with engineering metrics, finite control, regional theorem or hashes.

## Narrow fixture repair decision — 15:33 UTC, no grant reset

First independent checker control run:15/16 PASS, one final fixture assertion
failed. It assumed retained p* on root range boundary was on a147 event wall.
These inventories differ; source correctly did not reject that generic point.
Main hand-identifies guaranteed unit-clipping wall p2-p1=0 from LL1/LL2, hence
zero5-vector is definitely nongeneric. Authorize changing ONLY that test fixture
and explanation, no checker/producer source change or acceptance weakening.
Preserve failed result; AST then Main reviews actual edit before one separately
released repeat within SAME120s aggregate. Engineering harness correction, not
automatic retry after a failed mathematical implication. No native run yet.

## Native comparison release plan — after corrected controls PASS only

No ceiling reset: producer control charge2s, failed checker control charge2s,
repeat checker charged from same120s. Reallocate unused Builder/Checker test
allowance to Main only within remaining total. Reserve100s for four native calls:
old112 producer18s/outer20 and new114 producer18s/outer20, each max100000, each
from SAME immutable tip113/COST_PILOT_2.json; independent old/new checker28s/
outer30 on corresponding outputs. Create-only BASELINE_18S.json,
PRUNED_18S.json,CHECK_BASELINE_18S.json,CHECK_PRUNED_18S.json in tip114.
Count every real invocation/failedstart; measuredceilcharge not capreissue.
Do not start a call without its reservation remaining. Stop if source/semantic
defect, unexpected witness or refusal. Keep baseline as comparison evidence,
not as an automatically selected successor tree. Only complete checker accepts
fullclosure; fewercuts/processedcounts/runtime are scoped measurements.
