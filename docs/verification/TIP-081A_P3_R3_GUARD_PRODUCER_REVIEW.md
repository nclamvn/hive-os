# TIP-081A P3 R3 narrow producer source review

Verdict: CLEAR for the authorized narrow SOURCE delta only. This non-own review does not authorize execution, kernel/harness/tooling, admission, normal-fixture FIT, or P3 acceptance.

## Actual text reviewed

Read the complete `TIP-081A_P3_R3_GUARD_SOURCE_RELEASE.md`, the full new `scripts/test/private-summary-runtime-tip081-p3.r3.mjs` through its END marker, the producer source report, and the complete plain-text R2-to-R3 diff. The diff contains exactly two added declarations and two original call-site replacements; no other producer text changes appear. Read the existing P2 integer/timed dependency definitions as plain text to confirm the guard input and clock premises. No parser, import, hash, generator, compiler, runtime check, or test was used.

## Guard and integration findings

`pGuardChild` has arity one and no locals. It touches the existing real clock first, rejects invalid unsigned safe integers (including negative zero) or indices at least 128 with `ALLOCATION_COVERAGE_OPEN`, refuses index 127 with `DEPTH_REFUSED`, and returns primitive true for indices 0 through 126. The bounded addition is performed only after validation. Its actual walk call replaces the old depth comparison after child/schema validation, immediately before `producerFrames[++depth]` and child-frame writes. Root index zero and both traversal passes remain unchanged. This is independently authored from the verifier predicate; no shared depth implementation was introduced.

`guardEntries` has arity two and no locals. Real touch precedes validation of both unsigned-safe-integer inputs and the used-at-most-20000 premise; subtraction is therefore bounded and nonnegative. `delta > 20000 - used` refuses before any counter addition. In the actual counters call, existing owner/entry/node validation remains before this guard, the original node-limit check remains after it, and both additions remain last. Exact boundary meanings are unchanged for valid normal inputs: 19999 plus 1 admits, 20000 plus 0 admits, and 20000 plus 1 refuses. These are source consequences, not observed component results.

Existing clock capture, started/lastNow/TTL state, refusal taxonomy, owner disposal, weak-authority retirement, escrow transfer, category accounting and six public arities are unchanged. The new guards introduce real additional deadline touches; they neither reset nor renew the deadline. The compile-release constant is still false. No new public source/AST/guard/fault/model accessor appears.

## Costs and acceptance limits

The released prospective policy matches the actual added shapes: two function/prototype rows at 192 each and two new `ALLOCATION_COVERAGE_OPEN` literal rows at 80 each give static delta 544. Existing DEPTH/ENTRY literals moved rather than multiplying. Arity-one and arity-two no-local frames give workspace deltas 80 and 96, respectively, for 176; combined producer delta 720. These are logical source-policy arithmetic, not new hashes, a generated site census, physical-memory evidence, or numerical tool FIT. Future exact inventory/transitive source binding remains mandatory.

No remaining blocker was found within these four narrow edits. Normal parser-fit bounds, kernel/observer/factory dependencies, canonical component registry, independent baseline reconstruction and execution release remain OPEN under the release document. All 36 controls remain UNRUN, accepted runtime 0/8, source 7/8 with R5 partial, compile OFF and tuples NOT_ISSUED. R2/P2 and predecessor failures remain preserved. This review does not self-clear the separately authored verifier.

STOP: source-only review and this new report are the entire action. No effect reservation or budget reset; aggregate 870882.767416/900000 and P3 remaining 21440.727166 are unchanged.
