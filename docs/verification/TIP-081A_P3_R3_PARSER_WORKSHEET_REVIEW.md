# P3 R3 parser worksheet A–F — non-own partial review

2026-10-08 · Back reviewer, not worksheet author.
Verdict: CLEAR for the SIX NAMED PARTIAL REGIONS and their disjoint sums only.
Whole normal-fixture FIT, exact new T, remaining grammar/family/call-depth/time
uppers remain OPEN. This is not parser/allocator/semantic release or runtime PASS.

Read the complete A–F worksheet once and inspected only its necessary named
source anchors. No parser/import/hash/generator/check/test effects, broad parser
scan, protected/actual-source access, or new worksheet region was performed.

Source anchors inspected as TEXT:

- `scripts/test/private-grammar-runtime-tip081-p2.mjs`:218–257 guarded callable
  frame/invoke/construct;258–381 get/defineData/set/remove/primitiveString;
  784–867 native call/push/pop branches.
- `scripts/test/generated/private-grammar-tip081-p2.checked.candidate.mjs`:
  Parser1467–1484 and1512–1519; initialContext3179–3183;
  updateContext/paren handlers3219–3270; name handler3309–3320;
  curPosition/Scope/enterScope4456–4476.
- Current `scripts/test/private-summary-runtime-tip081-p3.r3.mjs`:182–197
  actual capacity-two parse arguments with two guarded numeric writes.

Confirmed hand sums:

| Region | Bytes | Entries |
| --- | ---: | ---: |
| A |5534|11|
| B |1924|5|
| C |1662|5|
| D |2464|9|
| E |6336|21|
| A–E |17920|51|
| F |93800|180|
| A–F |111720|231|

A–E five-family vector in worksheet order NODE_SCHEMA/ARRAY/STRING/CALL_FRAME/
BOOKKEEPING is1632/1384/488/3216/11200. F vector1024/7192/3936/12704/68944;
cumulative2656/8576/4424/15920/80144. Each vector sums to its stated byte total.
All reviewed regions contain zero attempted AST Nodes; this is not a full count.

Formulas supported by named runtime/body reads: fresh object property472+2L /
two memberships; separate initial metadata224 once; vector328+8k /k+1; actual
no-growth numeric vector write496 /one; data replacement416; ARRAY length
replacement144; numeric read240/remove112. Native `.call` route1272/six before
handler frame includes its copied-rest missing-slot write, not just backing.
Context first push grows capacity1→2 at112; later pushes reuse retained capacity.
Pops/delete do not refund fields/keyUnits/capacity. No double metadata or omitted
selected `.call` copy found in these formulas.

Disjointness: E excludes already-counted D scopeStack list/property; A–E cover
separated initialization spans without taking excluded constructor paths as zero.
F covers ONLY actual updateContext method lookup/vector/frame/body/selected
handler subtree, not finishToken body/frame or upstream token reads/next calls.
Six defaults plus seventeen callable handlers match the declared23-transition
premise; eight sequential push/pop pairs do not nest their context arrays.
First-region private guarded depth<=3 and F local<=4 are correctly qualified as
local bounds, not a whole upstream grammar/native-stack bound.

No blocking arithmetic/source-formula issue found in this partial scope. Review
does not close four wordsRegexp, remaining Parser fields, strictDirective,
token-reading/scalar trivia, AST/expression/depth queues, finish/body/directive
paths or source-derived T. Pp/Pr/Qp and separate8/4MiB replay families still need
their excluded contributions; small partial totals do not prove whole FIT.

STOP after one review. No kernel/harness/tooling/effect/admission grant follows.
Aggregate870882.767416/900000ms, P3remaining21440.727166 unchanged; all36UNRUN,
compileOFF/tuplesNOT_ISSUED/accepted0/8; R2/P2/62OPEN exclusions retained.
