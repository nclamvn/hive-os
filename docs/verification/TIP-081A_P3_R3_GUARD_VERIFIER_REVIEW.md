# P3 R3 verifier guard — independent narrow source review

2026-10-08 · SAME081D8 · Back reviewer, not verifier author.
Verdict: SOURCE_REVIEWED for the released verifier guard/call-site seam ONLY.
No blocking source issue found in this narrow delta. This is not full P3 source
readiness, normal fixture FIT, kernel closure, admission, allocator/semantic proof
or an observed runtime test. No hash/import/parser/generator/compiler/unit/check
effects were executed; plain source reads and the complete textual diff only.

## Evidence inspected

Complete `diff -u` between
`scripts/test/private-summary-verifier-tip081-p3.mjs` and
`scripts/test/private-summary-verifier-tip081-p3.r3.mjs`; changed body context
243–268 and pre-push context312–338 in the new file; entire narrow release
TIP-081A_P3_R3_GUARD_SOURCE_RELEASE.md and verifier author's
TIP-081A_P3_R3_GUARD_VERIFIER_REPORT.md. Original retained dependency bodies were
previously inspected as source in the pre-code review; this diff shows no edits
to them. Diff exit1 denotes textual differences, not a failed runtime check.

The complete text diff contains exactly three changes:

1. Outer lexical embedding constant changes only from
   PRIVATE_SUMMARY_VERIFIER_P3 to PRIVATE_SUMMARY_VERIFIER_P3_R3.
2. New private __HIVE_P3_vGuardChild at250–256.
3. Original inline depth condition replaced by actual guard call at322.

No other verifier text differs. R2 remains the comparison predecessor, not a
rewritten passing artifact. The constant is embedding DATA, not a source/AST-
taking runtime API or caller authority; no kernel/factory/seed hook is introduced.

## Independent guard semantics and before-growth placement

Exact arity1, no locals. The first operation is actual __HIVE_P3_touch; subsequent
validation uses the independently authored existing vU, not the producer's
P2_integer implementation. vU checks number/nonnegative/safe upper/floor and
reciprocal -0. Invalid values or parentIndex>127 invoke actual abort with
ALLOCATION_COVERAGE_OPEN. Valid127 invokes actual DEPTH_REFUSED;0..126 return
primitive true. No coercion, AST/source access, callback, allocation or expected-
result echo occurs in the new body.

The call is immediately before `const next=frames[++top]` and child writes.
Existing child-null/type/array and ancestor-cycle checks precede it; remaining
frame inheritance/binding assignments follow unchanged. The same lexical loop
is used by both passes. Arrays remain on the current Node frame; there is no
new AST-depth convention or increased frame capacity. Parent126 admits depth128;
parent127 refuses the next child before index/frame growth. It is not an observed
P3 normal AST129 branch. Invalid states get additional fail-closed validation.

Direct/transitive dependencies remain closed and real:
vU→captured floor; touch→P2_timed→captured clock/finite/private original deadline/
lastNow/refuse-disposal bridge; abort→P3_dispose/error→fixed P2/P3 singleton
tables/private owner/active/owners/captured weak deletion. No stub clock, renewal,
caller option or harmless disposal substitute appears. Producer and verifier
depth implementations are separate; neither invokes the other's guard/traversal.
Extra clock touches retain the original deadline; they do not extend it.

## Costs, retained boundaries and remaining gates

Released C01/C02 model: ordinary function/prototype192 +new
ALLOCATION_COVERAGE_OPEN literal80 =static272; params1/locals0 gives frame80;
new helper acyclic coexistence1. Prospective verifier delta352 matches author's
report. Existing DEPTH_REFUSED literal occurrence is moved, not duplicated.
Outer constant rename keeps its binding count. No new vector/object/string/
membership is allocated by a guard call under this logical convention.

These are source arithmetic, not a freshly computed complete source census/new T
or physical allocation certificate. Existing source-site/frame/capture inventory
still needs exact post-authoring reconciliation before any effect. No historical
workspace charge is reduced. Unchanged remainder retains predecode/taxonomy/
canonicalization/SHA/independent ledger/cleanup/caps/lifetimes; all normal public
APIs are still outside the verifier snippet. Kernel/harness/tooling were not
released or reviewed by this verdict. Normal21-unit parser resource worksheet,
whole kernel/dependency/cost fit, emitted review and Main reservation remain OPEN.

STOP after this narrow source verdict. No tuple issued or compile flag changed;
all36 controls UNRUN, accepted0/8, source7/8/R5partial predecessor status unchanged.
Aggregate870882.767416/900000ms, P3remaining21440.727166 unchanged. R2/P2/62OPEN/
callergraph/native/physical/protected-source and excluded-effect boundaries remain.
