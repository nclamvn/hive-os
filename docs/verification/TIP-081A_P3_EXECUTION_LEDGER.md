# P3 measured-effect ledger

2026-10-08 · Main-owned synthetic effects only.

Inherited total867323.494582/900000ms; remainder32676.505418ms. Owner approved
P3 incremental<=25000ms INCLUDING all1000ms wrapper/child allowances. Coding,
read-only source inspection and documentation are not parser/check effects.
No allowance is a measured runtime and no successful child removes its allowance.
Each reservation requires source review first; unused future reservations may be
released, spent work/history cannot reset. Hard unit ceiling8000ms.

## Current state

Effects0; incremental spent0ms; aggregate unchanged. No generator/import/hash/
parser/syntax/lint/type/unit/build/E2E has run for P3. Exact command reservations
will be appended BEFORE dispatch, followed by actual raw results/accounting.
Resource ceiling does not imply any command/admission grant while source review
remains open. No partial run may be called P3 acceptance.

## Reservation E01 — before dispatch

ONE inert `node scripts/test/capture-private-summary-tip081-p3.mjs` child,
Main-owned supervisor. Source prerequisite: P3_SOURCE_REVIEW.md
CLEAR_INERT_CAPTURE_DERIVATION_ONLY and non-own final tool review.
Child timeout3000ms, supervisor settlement allowance500ms, output1MiB cap,
child V8 old-space512MiB/supervisor128MiB. Detached POSIX child process group
killed on timeout/output overflow. No child parser/artifact import or tests.
These limits do not certify OS scheduling/native/RSS containment.

Reserve3500ms measured upper envelope plus3000ms conservative allowances
(tool shell, supervisor, capture/derive child):6500ms incremental maximum.
Aggregate reservation873823.494582/900000ms; P3 remainder18500ms if all spent.
Do not automatically use that remainder. Preserve raw first result/failure;
no retry. Normal/alias issuance and checker remain prohibited at this checkpoint.

## E01 actual first result — no retry

Exit0, no timeout/output overflow. Supervisor raw559.272834ms; tool child raw
502.36283299999997ms (contained); exec wall478.178834ms. The clock discrepancy
is retained, larger supervisor observation used. +3000ms allowances gives
3559.272834ms upper increment; aggregate870882.767416/900000ms;
29117.232584ms remains. Release unused reservation2940.727166ms only, not spent
work. P3 incremental remaining21440.727166ms, no new effect reservation.

Complete first cuts and6inert artifacts persisted; capture-time36predecessor and
2TS tool pins MATCH. No generated parser/Acorn import, tests or admission.
Raw metadata P3_E01_RAW_RESULT.json; full child evidence P3_DERIVATION_EFFECT.json.
STOP_AT_COVERAGE: P319producer/P321normal-depth remain OPEN. No checker/issuance,
post-pin command or automated retry. See P3_COMPLETION.md for exact scope.
