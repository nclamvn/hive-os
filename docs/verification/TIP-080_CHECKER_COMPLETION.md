# Completion report — TIP080 fixed permutation checker

STATUS: DONE for the narrowly assigned engineering checker, pending Main's
independent source review/integration acceptance. Scientific roles NOT_STARTED.

## Files and boundary

Created only assigned checker source, focused unit tests and written lemma,
plus this normal Builder completion report. No A-owned file was edited.

- src/modules/permutation-bridge/checker.ts — pure fixed BigInt rational checker;
  no filesystem, CLI, network, eval, candidate code, database or model effects.
- tests/unit/permutation-checker.test.ts — hostile intake/identity controls and
  independent tiny permutation enumeration/recursive transform.
- docs/research/PERMUTATION_CHECKER_LEMMA.md — private engineering reference;
  complete structural/counting/log-bound argument and nonformal trust ceiling.

Vibecode Builder/verify separation kept this implementation scoped and left
independent source acceptance, authenticated caller wiring and live admission
with Main/A. Relevant AGENTS/charter/protocol/active/handoff were read.
No Next framework imports or framework code were needed.

## Acceptance criteria / verification

All six local checker obligations implemented and tested: strict FINAL grammar;
bounded exact UTF8/duplicate-key-safe intake; unchanged original SHA and separate
canonical certificate SHA/binding checks; fixed exact rational calculation;
arithmetic-versus-proof status separation; hostile/tiny engineering controls.
This is6/6 local checker coverage, not6/6 complete product/scientific acceptance.

Focused command: vitest run --project unit tests/unit/permutation-checker.test.ts.
52/52 PASS,11:56:58 local, Vitest297ms/tool wrapper0.525s. Independent exhaustive
n1..8 controls cover46233 permutations and each adjacent-label event. They do not
replace the all-n written proof. Prior design-only unsaved Python enumeration
also matched,0.335s; not added as distinct unit tests.

Scoped ESLint on checker/test: exit0, no errors/warnings,1.569s.
No build, whole-project typecheck, DB/browser, checker subprocess or model run
was performed by this Builder. Main/A own those coordinated integration checks.
Focused unit elapsed remains far below120s/600s aggregate preparation bounds.

## Integration API / honesty

checkPermutationFinal(originalBytes:Uint8Array,
binding:{runId:UUID,finalDigest:SHA256,sourceBundleDigest:SHA256,taskDigest:SHA256},
signal?:AbortSignal) -> Promise<PermutationCheckerResult>.

Caller retains original bytes FIRST, validates reviewed source/current auth/root
cut/deadline, then invokes/adopts only after sealed FINAL. Binding is shape/hash
checked, not cryptographic authentication of the human or upstream Codex output.
Task digest uses the actual current contracts.task canonical digest.

Matched claim: SUPPORTED_UNDER_LEMMA_ARITHMETIC.
Wrong canonical numeric claim: ARITHMETIC_CLAIM_MISMATCH, not proof-text refutation.
Malformed/unsupported/oversize/BOM/UTF8/duplicate/changed binding: INCONCLUSIVE.
Every result says NOT_VALIDATED_NON_FORMAL_REVIEW_REQUIRED for proof validation,
formal/official status NOT_ESTABLISHED. Proof review remains separate POSTREVIEW.
No UI DRAFT/golden-answer projection and no scientific authority are supplied.

Hard input bounds: original32768bytes; canonical decimal floor <=32digits;
strict fixed certificate version/kind/n; existing bounded duplicate-safe parser.
Parser's conservative structural accounting uses6x original-byte allowance only
after actual32KiB input admission, so larger originals remain refused.
Fixed16series terms+H10; cooperative1000ms/4096rational operations/4096GCD
iterations/4096integer bits. Observations are exact rational strings; no floats
for mathematics. Runtime measurements count these labelled high-level operations,
not hidden model work/cost or hard OS containment. Written mathematical lemmas
and installed runtime remain trusted, not formalized/cryptographically attested.

## Issues, deviations, suggestions

No unresolved local P0/P1 or architectural deviation found. All upstream imports
must include checker/lemma/test and existing bounded parser/types in the new080
source inventory. Never add the private reference/formula/floor to future solver
prompts, DRAFT displays or imported originals. Only neutral FINAL grammar belongs
in prompts; grader-only checker evidence may enter POSTREVIEW after sealing.

Source acceptance and actual authenticated/browser integration remain Main's gates;
52fixtures do not establish fresh solving ability, official score or novelty.
STOP assigned Builder implementation; hold these sources for independent review.

## SHA256

```text
checker.ts 9353ce8aac4c529ab6c99c75ed0b78f973cdb041057173f6324e169e1a661587
permutation-checker.test.ts 42c9366d9ceeb2de9d0a30ff3fa90431fe0fbeccd1684b7ce44dd1ed1459f4ba
PERMUTATION_CHECKER_LEMMA.md 29e8fb05a3a0b1ac03237d9a32be4329b66e0ccf7a542b68ccd526ef24850617
```

## Append-only ES2017 syntax compatibility checkpoint

Main explicitly approved only mechanical bigint literal -> BigInt(decimal-string)
replacement in the owned checker/test. The preceding4929bytes remain unchanged,
SHA0f9a01bac0f95d41c98b98814d40a8cd5dfdedc930b96225274649a8ba95f0ef.
Initial unit/lint success above did not establish whole-project ES2017 typecheck;
A subsequently identified TS2737 on bigint literal syntax. No global target,
mathematical strategy, input grammar, arithmetic limits or result semantics changed.

After exact mechanical replacement: same52/52 tests PASS12:11:40 local,
Vitest352ms/wrapper0.467s; scoped ESLint0errors/warnings1.738s. These are reruns,
not52additional tests. A/Main own coordinated whole-project type verification.
Lemma unchanged. Checker/test HOLD; no DB/build/browser/model effects.

```text
checker.ts 7b3f25a1bdcf041d0f938979deb4c0517591189927305b6c26c987aa06279ca4
permutation-checker.test.ts fa609c817db66ccf77863a4d0c8e910191d36f09aefd0e4e7f1410ed1885bfe5
```
