# P3 R3 — granular guard source release

2026-10-08 · SAME081D8 · Main Contractor · SOURCE_ONLY_NARROW_RELEASE.
Dependency: approved TIP-081A_P3_ACCEPTANCE_REDESIGN_R3.md.
Owner direct “duyệt R3” approval; exact active milestone remains
P3_SYNTHETIC_PRIVATE_SUMMARY_REPLAY. No new mode/ceiling/family/effect authority.

## Reconciled pre-code freeze and release

Producer/Verifier precode reports specify exact guard dependencies/arities/costs
and actual call sites; Back independently reviewed Front and Front reviewed Back.
Both find narrow guard authoring legitimate with no design blocker. Main reviewed
original source sites, reports and Tool36/204 candidate registry. Release ONLY:

- Producer Builder creates scripts/test/private-summary-runtime-tip081-p3.r3.mjs
  as a complete versioned R2 copy with pGuardChild and guardEntries seams only.
- Independent Verifier Builder creates
  scripts/test/private-summary-verifier-tip081-p3.r3.mjs as a complete versioned
  copy with vGuardChild only; constant name PRIVATE_SUMMARY_VERIFIER_P3_R3.
- Exact independent p/v arity1, no locals, C02 frame80 each; entry arity2/no locals,
  frame96. Function/prototype192 each. Actual source inventory must validate.
- Producer pGuardChild: actual touch, P2_integer validation; index>=128 or invalid
  ALLOCATION_COVERAGE_OPEN; guarded index+1>=128 DEPTH_REFUSED; else true.
- Verifier vGuardChild: independently actual touch, vU validation; index>127 or
  invalid ALLOCATION_COVERAGE_OPEN; index===127 DEPTH_REFUSED; else true.
- Entry guardEntries: actual touch, P2_integer both inputs; used>20000 or invalid
  ALLOCATION_COVERAGE_OPEN; delta>20000-used ENTRY_REFUSED; else true.
- Replace original inline depth comparisons ONLY in the new copies with actual
  respective guard calls immediately BEFORE ++depth/++top and frame child writes.
  Replace only entry comparison in new counters with actual guard call BEFORE
  addition; retain original node/integer/cap/error/accounting/lifetime checks.
- Original allocation/refusal/disposal/time/capture dependencies remain unchanged,
  closed, private. Producer and verifier never share a depth implementation.
  Six public arities/wire/metadata/quotas remain; no kernel/model/fault API appears.

Prospective delta from known source inventory conventions: three192 function rows;
new ALLOCATION_COVERAGE_OPEN literals3*80; moved DEPTH/ENTRY literals retain their
counts. Expected static delta816, acyclic NEW workspace delta256, total1072.
This is an independently checkable prospective census, NOT a computed new T/hash
or proof of normal fixture fit. Any additional code/local/literal/dependency needs
Main reconciliation before further release; no opaque reserve or reduced costs.

## Explicitly withheld work and source findings

No kernel/factory/observer/serialization implementation, standalone harness port,
deriver/loader/preservation/check-tool implementation or tuple release yet. Their
full dependency/registry/cost/fixture freeze remains OPEN. Narrow release does not
waive that gate for those work items, or claim full P3 source readiness.

Normal21-unit fixture has fixed14-Node/8-site shape and traversal algebra, but its
P2 parser entry/byte/five-family/private-call uppers are genuinely unsummed. New T
requires exact post-authoring source census before effects; no fake numeric T.
Tool36/204 registry is a review candidate, not full harness release. Main found a
separate original helper defect: metadata has exact27 keys WITHOUT baseBytes,
while metadata() includes baseBytes in CATEGORY_KEYS; Number(undefined) produces
NaN. Preserve R2 failure history and27-key contract; do not blindly port or drop
intended accounting assertions. Freeze a sound independent baseline/reconstruction
repair before harness code. No current-total residual can make the assertion pass
tautologically. All relevant source-derived counter constants still need review.

Future kernel also must carry invocation-wide lastNow, not reset it for each K;
share ONE original deadline and retain every retired charge. K/S model separation
and canonical full case IDs remain mandatory. These are withheld kernel gates.

## Work and review order / stop

Each Builder edits ONLY its named new versioned file with apply_patch, preserves
R2/P2 and unrelated dirty changes, and writes a short source completion report.
No generators/hashes/imports/parser/checks/tests/effects are executed by Builders.
Main/non-own full diff/source review afterward, no author self-CLEAR. Stop if exact
copies/seams cannot be preserved; do not add new helpers/functions/schema or tests.
No Next/UI code is involved, so no Next-specific guide/code lane is activated.

Closure here is reviewed TWO versioned source copies implementing THREE private
guard seams. It is NOT P3 acceptance, kernel closure or observed runtime PASS.
All36 controls UNRUN, accepted0/8, compileOFF/tuplesNOT_ISSUED. Source7/8/R5partial
predecessor history stays; do not relabel it as full R3 ready. Effects ZERO, no
reservation. Aggregate870882.767416/900000/P3remaining21440.727166 unchanged.
Protected grant/attempt5/failed-root/.env/native/NFT/actual-source access and
API/browser/build/E2E/Git/P4/P5/math/billing/deploy remain excluded.
