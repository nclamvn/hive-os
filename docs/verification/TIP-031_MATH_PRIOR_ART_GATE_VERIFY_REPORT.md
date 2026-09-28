# TIP-031 local verification — mathematical prior-art correction

Date: 2026-09-28. Scope: local source-bound known-result screen and Math Pilot dossier.

| Check | Result |
| --- | --- |
| Previously false `n ≡ 5 (mod 12)` task | Rejected by deterministic coverage of the sourced `n ≡ 2 (mod 3)` identity before solver dispatch |
| An explicitly not-covered `n ≡ 1 (mod 24)` task | Not classified as known by this small catalog; novelty remains unverified |
| `n ≡ 13 (mod 24)` task | Classified as covered by sourced `n ≡ 5 (mod 8)` identity |
| Exact congruence and affine `n=12k+5` parsing | Unit test PASS |
| Per-round prior-art record | Added to SHA-256-chained immutable event payload for new cycles |
| Historical first live cycle | Unchanged; browser shows retrospective known-result warning and source link |
| Typecheck and lint | PASS |
| Unit tests | 231 PASS (full unit suite) |
| Strict Math Pilot integration | 7 PASS |
| Full strict integration suite | 176 PASS across 29 files |

No new model call was made. The old terminal cycle was not reopened, altered or
counted as completed. The local UI was inspected on its authenticated mission
page; the warning, source citations, token stop and uncompleted round were all
visible together. This verifies the correction path, not a complete general
literature search, formal proof checker or new theorem.
