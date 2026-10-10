# P3 R3 producer guards — source completion, UNRUN

2026-10-08 · SAME081D8 · SOURCE_ONLY_NARROW_RELEASE.
Implemented only the versioned producer file released by
TIP-081A_P3_R3_GUARD_SOURCE_RELEASE.md:
`scripts/test/private-summary-runtime-tip081-p3.r3.mjs`.
R2/P2 predecessors, verifier, kernel/harness/tooling/configs and artifacts were
not edited. No source hash, parser/import/generator/check/test/runtime effect
was run. Changes were made through apply_patch from plain original source TEXT.
This report is author completion, NOT independent source-clear or runtime PASS.

## Exact intended delta

The new file retains the complete R2 producer/lifecycle overlay. Only two private
declarations and two original call-site substitutions were made:

- Lines88–94: `__HIVE_P3_pGuardChild(parentIndex)`, exactarity1/no locals. Real
  touch precedes captured P2_integer validation. Invalid/index>=128 aborts
  ALLOCATION_COVERAGE_OPEN; bounded index+1>=128 aborts DEPTH_REFUSED; else true.
- Lines95–101: `__HIVE_P3_guardEntries(used,delta)`, exactarity2/no locals. Real
  touch precedes integer validation. Invalid/used>20000 aborts
  ALLOCATION_COVERAGE_OPEN; delta>20000-used aborts ENTRY_REFUSED; else true.
- Counters102–108: replaced only its original inline entry comparison with
  `__HIVE_P3_guardEntries(s.entries,entries)` before either counter addition.
  Original owner/input/node checks and additions remain.
- Walk425: replaced only inline depth comparison with
  `__HIVE_P3_pGuardChild(depth)` immediately before frame selection/++depth and
  child writes. Original schema/cycle/array/type checks and both passes remain.

Dependencies are existing closed real touch→timed→captured clock/refuse/disposal,
integer→safe/is, abort→dispose/error singleton tables. Neither guard allocates
objects, arrays, strings, closures or memberships at call time; source-frame and
function/literal costs are still required. No verifier depth implementation is
shared. Failure retains actual operational cleanup, no dummy clock or stub.

Compile constant remains false. All six public names/arities, wire/metadata
schemas, cost conventions, capacities, escrow/category rules, source identity,
producer/replay extraction, retirement and protected boundaries remain as R2.
No public guard, factory, seed/model/kernel/fault hook, parser/source/AST accessor
or caller-controlled option was added. Header comments are unchanged.

## Prospective cost delta / unclosed validation

C01 two ordinary function/prototype rows2*192=384; two additional
ALLOCATION_COVERAGE_OPEN literals2*80=160. Existing DEPTH_REFUSED/ENTRY_REFUSED
literal occurrences move into the respective guard rather than adding another
occurrence. Expected producer static delta544.

C02 arity1/no locals80 plusarity2/no locals96; acyclic new helper coexistence1;
expected new workspace176. Producer combined prospective delta720. These are
logical source conventions, not fresh source-site inventory/hash/new T or
physical V8/native stack allocation. Main/non-own actual source census must
confirm no additional binding/literal/local/dependency rows before effects.

Normal21-unit parser-fit worksheet and whole kernel/factory/observer census
remain OPEN. Kernel/harness/tooling are NOT released by this implementation.
No unit fixture was authored/executed and no tuple issued. All36 controls UNRUN,
accepted0/8, source7/8/R5partial predecessor status is preserved.

STOP for Main/non-own source review. No further code or effect is authorized by
this report. Aggregate870882.767416/900000ms, P3remaining21440.727166 unchanged;
no reservation/reset. R2 history/P2/62OPEN/native/physical/callergraph exclusions
and protected attempt5/grant/failed-root/.env/actual-source boundaries remain.
