# TIP-032 local verification — knowledge-frontier dossier

Date: 2026-09-28. Environment: local `hiveos_dev`, Next dev UI and Codex-local worker. This report covers a bounded product gate, **not** a claim of general autonomous literature completeness or theorem discovery.

## REQUIREMENT COVERAGE

| Requirement | Result | Evidence |
| --- | --- | --- |
| AC-01 known `n ≡ 5 (mod 12)` | PASS | Unit gate resolves `n ≡ 2 (mod 3)` and stops as `KNOWN`. |
| AC-02 residual `n ≡ 1 (mod 24)` | PASS | Unit gate returns only `RESEARCH_ONLY` with two matching assessments; no `NOVEL` state exists. |
| AC-03 corrupt content, span or dossier | PASS | Nested digest/span checks reject corrupted dossier even when the outer event digest is recomputed. |
| AC-04 missing source, failed discovery or reviewer disagreement | PASS | Deterministic gate returns `HOLD` before solver. |
| AC-05 accepted worker round | PASS in isolated integration | Full seven-call fake-adapter path retains dossier, two reviews, gate, verifier, attempt, critic and adversary; next rejected task does not reach solver. |
| AC-06 historical event compatibility | PASS | Existing authenticated Erdős–Straus cycle remains `STOPPED/TOKEN_LIMIT` with 4/5 calls and no rewritten events; UI displays retrospective warning. |

Implemented: 6/6 bounded criteria. Missing within this TIP: 0. Deferred beyond this TIP: general primary full-text intake, refreshed publisher-page capture, mathematically exhaustive literature search, formal theorem checker and live fresh round on a new root case.

## SCENARIO RESULTS

- Passed: 6 bounded acceptance criteria; 8 focused unit tests; 7 focused Math Pilot integration tests.
- Failed: 0 in the executed suites.
- Untestable in this run: a fresh seven-call Codex round with actual source agents. The existing root case is bound to an immutable terminal cycle; no new root or subscription call was fabricated for this implementation check.

## TECHNICAL HEALTH

- Local migration `20260928183000_math_frontier_gate`: applied successfully; historical 5-call and new 7-call constraints coexist.
- Readiness: database, all Math Pilot through frontier migrations and forced RLS `READY`. The readiness command intentionally reports worker/provider/certification `UNVERIFIED` when called without activation flags; it is not a live scientific acceptance signal.
- Crossref discovery smoke: `COMPLETE`, five bounded metadata candidates; three retained primary excerpts, dossier SHA-256 generated. Crossref metadata did not become theorem evidence.
- Worker: restarted with original local organization/service actor, Codex subscription mode enabled, paid OpenAI adapter disabled. Subsequent polls: zero claimed jobs, zero failed jobs.
- Authenticated browser: Math Pilot page rendered without server error; old cycle still shows prior-art correction, retrospective TIP-032 note and unchanged ledger digest.
- Full unit suite: 234 passed (42 files).
- Full integration suite: 176 passed (29 files).
- Typecheck: PASS. Lint: PASS, zero warnings. `git diff --check`: PASS.
- Production build: NOT RUN in this verification. The active localhost dev server uses the same `.next` output; a concurrent build previously caused user-visible 404s. This is a deferred packaging check, not a claim that build passed.

## CRITICAL ISSUES AND BOUNDARIES

1. The initial curated primary passages are bounded to Erdős–Straus. Each SHA-256 authenticates the retained normalized excerpt, **not** the whole current publisher page. Generic problems without captured primary passages stop at `HOLD`.
2. Two fresh contexts from the same model family provide procedural challenge, not independent-model or human proof certification. A `RESEARCH_ONLY` decision is exploratory, never proof of novelty.
3. Crossref receives the mathematical query and may be unavailable; its hits are bibliographic leads only. Do not submit confidential statements under this local configuration.
4. Observed-token and deadline ceilings are checked between calls. They are not hard spending controls. No paid API request was made.

## OVERALL STATUS

**READY_WITH_DEFERRED for the bounded local TIP-032 gate.** A fresh live seven-call acceptance round and production build remain unverified. General autonomous novelty certification remains explicitly **NOT ESTABLISHED**. Billing, Git push and deployment were not touched.
