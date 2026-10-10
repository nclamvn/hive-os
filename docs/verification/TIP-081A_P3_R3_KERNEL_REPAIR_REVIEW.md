# P3 R3 kernel — independent narrow repair review

2026-10-08 · SAME081D8 · Ast non-own reviewer.
Verdict: SOURCE_PROPOSAL_CLEAR; NOT actual-source/execution/admission CLEAR.

Read the repaired unitFinish/unitCase rows and appended narrow cleanup repair in
TIP-081A_P3_R3_KERNEL_FREEZE.md. The original review also read only the fixed
production disposal/abort/guard bodies and P2 integer/timed/refuse/arithmetic
ranges named by that freeze. No kernel code, parser, import, hash, test, check,
execution effect or protected domain was accessed; no original code was edited.

The former prospective gap is resolved: unitFinish explicitly uses an inner
unconditional finally to invoke actual disposal and clear held K/S roots even
when validation abort has already nulled the owner global. Caller finally clears
local aliases. Clock validation uses captured finite/order/original deadline, not
integer, so valid fractional performance timestamps are retained and carried
through the local K rather than lost with __P2_owner.

unitCase now distinguishes target start/factory failure, preserves the first raw
fault without reflection, treats observer/cleanup failure as whole-invocation
failure, emits no accepted prefix on those failures, and still cleans all roots.
Independent SHA/tail observation runs only on a complete successful CODEC wire;
refused cases fill preallocated scalar records with null digests and allocate no
observer buffer/string after the original abort. Writer seal work is unchanged.

Four added local binding occurrences are targetStarted,failed,observerCaught,
cleanupCaught. unitCase arity2/local12 gives C02=64+16*14=288, up64 from224;
the fourteen-helper sum becomes1936, up64 from1872. This affects prospective T,
not the311288 known guest bytes,492 memberships or11162 output bound. No new
helper/heap record/capture/schema/fixture/cap/authority was introduced.

The remaining gate is ONE full non-own review of the future actual kernel source,
including exact extraction/captures/C01/C02, before-growth charges, clock carry,
all refusal cleanup and raw first-failure preservation. In particular OUTPUT
cleanup must not mask a primary/native output failure with a later finally fault;
the actual source review must verify this path separately, not infer it from the
unitCase proposal. Actual T/emitted review/reservation/admission remain separate.
This report is not permission to import or run anything or evidence of unit PASS.

All36UNRUN/runtime0/8/compileOFF/tuplesNOT_ISSUED, predecessor62OPEN and
fullRuntimeClosureNOT_ACCEPTED remain. Aggregate870882.767416/900000ms and
P3remaining21440.727166ms unchanged; effects0. Await Back SOURCE_READY notification;
no source polling or broadened scans are performed.
