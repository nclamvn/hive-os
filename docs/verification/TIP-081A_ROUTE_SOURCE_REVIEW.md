# TIP-081A — Narrow route repair source review
2026-10-07. SAME081D8step3 R1–R3, not runtime acceptance.

Main first inspected actual fixed manifests under original25 source/lineage pins.
Cause: /500 maps to pages/500.html; producer and verifier assumed all page targets
were.js. Installed16.2.11 require.js100–103 handles HTML as text; build/index.js
2243–2256 emits this mapping. Source data only, not loaded Next/native/target code.

Builder changed only the producer route loop/test, independent Builder changed
only verifier route loop/test. Main read the complete deltas. Pages pages/*.html
is acquired with PAGE_ROUTE provenance but not entry; existing.js stays entry,
App.js-only and strict/path/unsupported/missing/source/resource safeguards remain.
No new shared classifier, helper, receipt shape, dependency or API.

Pins:
- scripts/test/acquire-tip081-inventory.mjs: 104de3668412d54df55adb9dc98eefc8b8a8bd32a839f94b97b2d76d6b35588f
- scripts/test/verify-tip081-inventory.mjs: a3b391338cb07155d41d5e8f004f536c9761633e2ed7f856230f6672cf6d6aba
- tests/unit/evidence-studio-inventory.test.ts: 361ed4046a1f525486645da3711da402aede6634119abe2285aff5880234bfa7
- tests/unit/evidence-studio-inventory-verifier.test.ts: 2573302a8be8be5db0a7afbf6684a7991471b740244e279bee8746ea31d2bdc1

I2-07: exact static500 fixture, asset kind/nonentry/JS preservation, missing asset,
App HTML/outside pages/unsupported extension/traversal/absolute negatives.
IV23: own reconstruction, rehashed removed PAGE_ROUTE provenance refusal, forged
HTML execution-entry refusal; grouped unsupported cases. Two new named controls.
Prior source cuts/review/bundle preserved, never overwritten as successful cuts.

Real graph remains UNRUN: combined caller+graph pre-growth ledger unestablished.
Exact seed/raw universe remains OPEN. Failedbuild4 is not accepted build authority.
Main one fresh read-only probe only after checks/source admission; stop refusal.
Shared strict schema/path/read primitives and same-UID path-race limitations remain.

Independent read-only final delta review CLEAR: both classifiers agree, focused
controls cover data/entry/provenance and tampering, no safety blocker or authority
widening found. No tests/probes/product code were executed by the reviewer.
