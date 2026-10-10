# TIP-081A P3 R3 narrow verifier guard source report

Status: SOURCE_READY; non-own review pending. All runtime effects remain OFF. This report is not source acceptance, admission, a test result, normal-fixture FIT, or P3 completion.

## Released source delta

New file: `scripts/test/private-summary-verifier-tip081-p3.r3.mjs`. The complete R2 lexical template was mechanically copied through `apply_patch`; the R2 file and all P2 artifacts were left unchanged. Only three literal edits were made:

1. Exported embedding-data constant renamed to `PRIVATE_SUMMARY_VERIFIER_P3_R3`; this is not a runtime source-taking API.
2. Added independently authored arity-one `__HIVE_P3_vGuardChild(parentIndex)` immediately before `__HIVE_P3_vWalk`. It touches the original owner clock, rejects invalid unsigned-safe-integer or greater-than-127 inputs with `ALLOCATION_COVERAGE_OPEN`, refuses parent index 127 with `DEPTH_REFUSED`, and otherwise returns primitive `true`. It has no locals, allocation, callbacks, AST access, source access, or parser invocation.
3. Replaced only the original inline `top + 1 === 128` refusal with `__HIVE_P3_vGuardChild(top)`, at the same position before `frames[++top]` and child-frame writes. All preceding child checks and all subsequent traversal work remain unchanged.

Dependencies are the existing independent `vU`, captured floor primitive, real `touch`, and `abort`/owner disposal. Clock, taxonomy, refusal cleanup, predecode, pure SHA, ledger reconstruction, traversal ordering, budgets, and normal six-API lifecycle are unchanged. The new body is intentionally not shared with the producer guard.

## Prospective source costs

The released literal policy assigns 192 bytes to the ordinary function/prototype, 80 to the new `ALLOCATION_COVERAGE_OPEN` string, and an 80-byte acyclic frame: static delta 272; workspace delta 80; total delta 352. These are source arithmetic, not fresh hashes, measured effects, a generated census, or numerical new-tool FIT. Exact future source inventory and transitive call coverage remain mandatory.

## Boundaries and stop

No shell copy, parser, import, compiler, generator, test, hash, network, protected-root read, or execution was performed. In-memory unique literal-anchor checks preceded the editorial patch only. No kernel, harness, tooling, manifest, tuple issuance, source bridge, normal-fixture resource claim, or acceptance-experiment result was authored. P3 R2 predecessor obligations remain preserved; revised P321 composition and normal P322 still require their separate evidence. All 36 controls remain UNRUN; tuples remain NOT_ISSUED and compile remains OFF.

Authoring stops here for Main/Back independent source review. This author does not self-clear the verifier template or its integration.
