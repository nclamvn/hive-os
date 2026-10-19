# TIP-088 — six-case measured public pilot

2026-10-09 · PUBLIC_SIX_CASE_MEASURED_PILOT_088 · METHOD_EVALUATION.
Owner directly approves the proposed 2 ArXivMath + 2 BrokenArXiv + 2
IMO-ProofBench Advanced public pilot with “tốt triển khai ngay”. This resolves
087's pending source routing; no private/blind FrontierMath claim follows.
Predecessor087: c6c6dff72bae0dbe9c636430871101dbc811df8a7cbf3bedc0489c6440a93d07.

## Exact obligation and selection

Compare A solve/self-check/final against B solve/separate critic/repair on the
same six statements, record actual CLI resource receipts, and report every
outcome including failures. No winning result is required for honest closure.
No case replacement, selective denominator or follow-up campaign this turn.

Prospectively choose first two rows (problem_idx1/2) of MathArena/arxivmath-0826
revision977a3a0083198e11ac4f20fe79288351cebd6281 and brokenarxiv-0826
revision6445b9740c9f932c44a3c1c6019230d08e81a793. Choose PB-Advanced-001/002
from IMO-ProofBench proofbench_v2.csv commit8cea546c9c7209306b4d4ced7c5eacd51f23f928.
Frozen source snapshot: docs/research/pilot088/reference-cases.json; solver-only
snapshot: solver-cases.json in the same directory. Main has read reference
answers; solver/critic must not receive them or source/category/false-count hints.
New-to-HIVE/public-recent != unseen in training. Reference paper metadata retained.
MathArena selected materials CC-BY-SA4.0; IMO dataset CC-BY4.0. Preserve credit.

## Execution envelope

Start after snapshots/rubric/TIP frozen. Overall stop09:15UTC (16:15 local).
Existing subscription-authenticated CLI0.160.0 only; requested gpt-6.1-sol/high,
same inherited user configuration for both, effective backend identity UNKNOWN.
No paid provider API or key. No unmetered collaboration math solver fallback.
Three calls per arm, six total; batch all6 in each call, each <=240s and
combined stdout/stderr <=2MiB. A/B stages may run concurrently; no retry.
One shared blind-to-arm assessor call <=240s separately charged as grading,
not as arm inference. No additional model solve/repair requests after scoring.
Same <=6500-word output instruction per arm call: instruction NOT hard token cap.
All stages ephemeral; explicit prior-message replay, not persisted sessions.
Fresh critic sees only B draft + statements; final B sees draft + critic.
No web/tool/repo/source access by math roles; unexpected tools mark contamination
and cannot support a clean comparison. Read-only child sandbox; normal platform
permission review allowed for CLI host IPC/network, not sandbox bypass.
Capture actual turn.completed input/cached/cachewrite/output/reasoning fields,
exit and wall time; missing usage UNKNOWN, not zero. Do not add cache/reasoning
fields twice to manufacture totals. Actual unequal spend != token-matched test.
No hidden cost equality or statistical conclusion from this one six-case batch.

## Frozen grading (local pilot, not official scores)

Report per-case final-answer/status and proof quality separately. Max6 each:

- C01/C02: answer0/2 (wrong-or-abstain/correct against reference), support0..4
  (0none/invalid, 1relevant partial, 2substantial with essential gaps, 3minor
  fixable gaps, 4complete reviewed derivation or independently checked certificate).
  Correct number alone is2/6, not a solved research-level problem.
- C03/C04: behavior0..3 using published BrokenArXiv rubric:0assert/prove false or
  unusable;1silent repair;2explicit inability/modification without false verdict;
  3explicit false verdict. A claimed correction contradicting original_problem
  caps behavior at1. Separate evidence0..3:0unsupported assertion,1plausible
  relevant argument with essential gap,2substantial with minor gap,3complete
  elementary derivation or independently verifiable counterexample. Behavioral
  success alone is not a proof of falsity. Keep published and stronger evidence
  dimensions separate rather than calling this official BrokenArXiv score.
- C05/C06: proof0..6:0none/irrelevant,1relevant observation,2partial source-rubric
  progress,3substantial essential gaps,4almost/minor gaps,5complete with small
  exposition omission,6complete reviewed proof. Any valid alternative proof is
  admissible; source solution is not axiomatic ground truth. Flag source defects.

Shared assessor gets anonymized final outputs plus references/rubric; Main checks
essential mathematical steps, counterexamples and score consistency. Grades are
ordinary mathematical review, not Lean/formal or independent human certification.
Report initial-to-final changes, critic repairs, fabricated claims, actual resources.
An observed quality/resource tradeoff is not statistical method advantage.

## Scope/stop

Thin standalone stdlib runner + focused mock tests only, no new product framework,
UI/build/install/config/auth/DB/Git or protected oldp139/R3 effects. No fullproject
copy/newdistDir. Owned small empty scratch codex-tmp-pilot088-20261009... removed
at completion/failure. Existing UI/server unchanged. One completion + append-only
checkpoints; no official/blind/novelty/autonomous-app-loop claim. Stop at honest
scoped measured result or specific blocker; no reset or easier replacement.
