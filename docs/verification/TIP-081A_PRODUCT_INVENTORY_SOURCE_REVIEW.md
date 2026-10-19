# TIP-081A — Product inventory source review
2026-10-07. SAME081 Phase A / D8step3. Read-only acquisition prerequisite.

## Review scope and disposition
Main read both producer and independently authored verifier, both test files, and
the post-review deltas. Independent reviewer reread all four files and final
deltas using read-only source tools, without executing tests/probes, product
code, product acquisition, or repository mutations.
Disposition: no source safety blocker to bounded checks and one guarded actual
fixed-root feasibility probe. This is not runtime acceptance or graph closure.

Reviewed source pins:
- scripts/test/acquire-tip081-inventory.mjs: 5a570c5d60cce499d8343118b0055f3ddef27ce6b787a757b659ad10ef501b31
- scripts/test/verify-tip081-inventory.mjs: 32e5123f82d280a5f1088d5f3a54482a281524dd58a9e9d1705474efd51b0446
- tests/unit/evidence-studio-inventory.test.ts: ab254765a82022b49795f3314399bf8125a3ca382fb863c4c5bbaa6f25a9ff13
- tests/unit/evidence-studio-inventory-verifier.test.ts: cb7588ff58cc70723fd1462fe480b31e2fc160ce7caec39dd16f49711c602c72

## Findings resolved before execution
Independent obligation reconstruction now deduplicates conservative OPEN ids
exactly; IV19 groups the duplicate middleware-key case into its existing control.
Filesystem diagnostics validate virtual path/category before any operation,
retain the safe requested path, and suppress raw OS error text. I2-04 asserts it.
These were source-review refinements, not failed executions or additional named
tests. First-cut bytes are preserved with check evidence.

## Safety and independence
Fixed failedbuild4 root plus sparse installed declarations/seeds only. No failed
standalone, recursive dependency walk, target/helper/native evaluation, NFT run,
resolver execution, writes, network, application build, or mathematical work.
Producer metadata/read counters distinguish parsed declaration reads from payload
acquisition. Incremental catalogue reservations precede growth; original/copy
coexistence and verifier buffer/receipt reservations are counted.
Verifier independently reconstructs filesystem universe, declarations, references,
entries, provenance, identities and byte hashes. Strict JSON/path/canonical and
no-follow readers are shared assumptions, not an independent filesystem broker.

## Open gates
Exact seed/raw union is not transitive completeness. Unknown declarations remain
OPEN. Frozen graph APIs lack caller-inclusive pre-growth accounting, so actual
graph analysis is UNRUN. Same-UID hostile ancestor replacement is not ruled out
by check/recheck APIs. No full I1–I6, T2–T5, deployability, or accepted epoch claim.
Actual result and preservation audit belong to the separate completion/evidence.

## Narrow corrections after the retained first failed check
First execution passed325/326 controls; lint passed; noEmit type check failed.
I4-03 now distinguishes earlier CATEGORY_REFUSED from ENUMERATION_REFUSED and
asserts no further metadata access. Minimal test callback row types replace
implicit anys. Verifier refuse() has a truthful never-return JSDoc annotation;
all paths already throw. No runtime behavior, source schema, resource ceiling,
target, named-test count or grant changed. Main read these deltas. Exact failed
four-file cut is retained in TIP-081A_PRODUCT_INVENTORY_FIRST_FAILURE.json;
raw stdout/stderr authority is the immutable tool transcript chunk d60502.
