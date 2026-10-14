# Source classification verification — 2026-10-14

Status: READY for the requested commit/push; no deployment.

## Baseline

- Current local TEST document DOC-9CD9B5E9, revision 3: ten numeric-source
  warnings, no blockers, score 50/100, four optional style notes.
- Screenshot: `01-before.jpg`. UI confirmed exactly the ten reported findings.
- Independent baseline: 76 unit tests across authoring, update-pack and
  current-rules files passed. Existing Vite config-loader warning remains.
- Stored revision scores: 50, 100, 0. No data changes made in this task.
- Current branch: `codex/tip-023a-organization-graph`, prior HEAD `fd54705`.

## Planned independent acceptance checks

1. Existing synthetic dossier warnings are correctly classified without editing
   its body or stored historical quality reports.
2. Mixed synthetic/computational text plus a real unsupported claim still warns.
3. An incorrect supported arithmetic expression is not mistaken for merely a
   missing citation; copied/forged MATCH is not accepted as tool evidence.
4. Missing citations remain blockers, including beside synthetic text.
5. VI/EN UI, saved revision export, library/current check consistency.

No new benchmark/model call, no production build or deployment is implied by this
verification. The preceding A/B result is retained without changing its scores.

## Independent results

Requirements implemented: 5/5 (100%); missing/deferred current-scope ACs: 0.

Live Codex browser, authenticated local session, same saved TEST revision 3:

| Scenario | Result |
|---|---|
| Unchanged S3 dossier | PASS: ten false warnings → zero; four style notes remain |
| Synthetic 2 ha × 100 VND/ha = 200 VND plus real survey of 2 ha | PASS: one source warning, no value-based exemption |
| 2 ha × 100 VND/ha = 250 VND | PASS: one calculation warning, not a missing citation |
| Correct synthetic calculation with @MISSING-QA | PASS: one unresolved-citation blocker |
| Appendix claimedTotal changed to106m, old105m MATCH retained | PASS: evidence-replay warning |
| Empirical999ha assertion inserted in valid JSON request | PASS: one source warning |
| English wrong250USD calculation plus measured99% | PASS: two correctly separated warnings, English labels |
| Synthetic200VND followed by paid900VND | PASS: payment statement still needs a source |
| Library after navigating away | PASS: same current100/100, original UAV remainsv3 |
| Stored history | PASS: saved50/100/0 unchanged, no new revision |
| Saved PDF download | PASS: native PDF link succeeds with revised shared checker |
| Return to VN and restore draft | PASS: all synthetic adversarial edits discarded; current0/0 |

All injected QA text was unsaved and restored, then navigation reloaded saved
content. No DB/account/auth changes. Final screenshot `05-after.jpg` shows the
current check result and explicit heuristic limitation. Other screenshots retain
the inspected draft views, not necessarily every below-fold warning at the
natural narrow Codex viewport. The DOM observations above record the exact
warning outcomes; no screenshot was edited to create evidence.

Technical health, run independently by Contractor after final changes:

- 126/126 focused tests PASS, four files, 1.49s; no skipped tests.
- Typecheck PASS, zero errors; scoped ESLint PASS, zero errors/warnings.
- `git diff --check` PASS.
- Staging includes two pre-existing A/B PROCESS logs with an extra blank line at
  EOF. Staged whitespace check reports those two documentation-only warnings;
  retained verbatim to preserve the historical logs. With blank-at-EOF excluded,
  staged diff check passes. No source-code whitespace failures.
- Next dev served the changed client/server flow. No full production build or
  isolated Playwright suite run; this is not deployment acceptance. Prior panel
  successful-save reset test remains compiled, not executed as isolated E2E.
- Existing Vite config-loader future-compatibility warning remains unrelated.
- Frozen update helper and COMMON_INPUT/PROTOCOL/EXPECTED hashes all match
  the preceding trial. No A/B rescore or claim of superiority.

The checker is deliberately bounded, not a universal source verifier or NLP
truth detector. Numerical consistency is not commercial or technical acceptance.
No new dependency, migration, mandatory process gate or generic evaluator.
No extra build directory/project copy created; no user data removed. Disk29GiB
available during checks. Previous pending lean-update feature and QA evidence
are included with this repair as the requested coherent commit.
