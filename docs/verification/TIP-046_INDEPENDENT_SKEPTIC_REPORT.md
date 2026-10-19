# TIP-046 skeptical review

Status: PASS_WITH_SCOPE_LIMITS for inspected production code. The integration-test fixture finding is closed after source repair and Contractor Main's reported guarded database pass; broader acceptance remains Contractor-owned.

## Independence and scope

The reviewer implemented the primary finite-grid certificate core, then performed a read-only skeptical review of the separately implemented Python replay, replay wrapper, worker/reviewer integration, retained UI and isolated-database test. This is not independent review of the reviewer's own core implementation, a different-model mathematical audit, external expert approval or foundational proof certification. Contractor Main owns independent core verification, full-suite/build verification and visible browser acceptance.

The inspected claim is exhaustive finite Cartesian classification on one sealed grid. `NO_GRID` excludes only times `j/M`; it does not refute continuous-time LRC. Singleton 14/15 controls are not Allikvere's full coverage. SHIFT and CRT leaves construct exact finite grid witnesses, not an admitted universal or inductive lemma.

## Production-code findings

No substantive soundness blocker found in the inspected production code.

- Python consumes independently sealed scope/root and untrusted certificate; strict keys and integer types reject coercion and unknown fields. It separately verifies the root domain, all ordered disjoint exhaustive partitions, tree reachability/uniqueness and leaf arithmetic. CRT reconstruction uses modular inverses rather than the primary checker's bounded search; rational alignment uses `Fraction`.
- Actual source bytes match pinned SHA-256 and the wrapper executes those same already-verified bytes. Isolated Python flags, an environment allowlist, one observed ten-second outer deadline and 262,144-byte output limit fail closed on drift, unavailable process, timeout, overflow or disagreement.
- The worker runs trusted checked evidence before the provider dispatch fence. It attaches the envelope itself; strict model parsing omits that field, and the worker additionally rejects provider-returned host evidence.
- Solver and fresh critic/adversary contexts require the same valid root-bound envelope. The actual worker composition supplies the reviewer instance directly, avoiding an intermediate callback dropping the fifth evidence argument.
- Retained attempt hashes include evidence. Ledger v4 binds scope, certificate and evidence digests; stored review validation rejects omission, rebinding, altered references, downgrade and LRC evidence on historical non-LRC cases. A positive AI review still classifies the LRC research result as `PARTIAL`, not an unrestricted theorem.
- The authoritative controlled-cycle root loader rejects finite LRC cases entering the Erdős–Straus route. Preset requests are strict, fixed on the server and separately authorized. Local development/test guards precede new LRC solver and review model dispatch.
- The bilingual retained panel calls only pure validation; it neither reads the replay source nor spawns Python on page rendering. Historical records show absent evidence instead of synthesized certification. Root/scope/certificate/evidence/Python digests and witness/grid-exclusion/unresolved counts are visible.

Hashes are not signatures. Retained byte consistency does not attest external execution, the Python interpreter, hardware, human independence or source publication acceptance. Local trusted collectors and immutable ledgers remain assumptions. Cooperative observed checkpoints are not hard synchronous CPU preemption.

## Test-fixture finding

`tests/integration/math-lrc-agent-gate.test.ts` initially attempted to strip and rehash an already retained attempt through `tx.researchRun.update`, then rewrite its completed job result before asserting zero reviewer calls. The existing trigger in `prisma/migrations/20260928150000_codex_local_math_attempt/migration.sql` explicitly rejects changes once `OLD.math_model_attempt` is non-null. This fixture cannot reach its intended reviewer assertion under the real database guards. The rejection is correct product behavior, not a product defect.

The fixture was repaired before acceptance: it now asserts the attempted immutable update is rejected, then reads back the unchanged attempt and digest. Math-case/run/review reads use a trusted tenant-scoped transaction; the disallowed OpenAI request correctly expects a thrown guard rather than a durable success-shaped outcome. Unavailable-tool and forged-provider-evidence checks expect worker rethrows after failure retention and preserve the no-dispatch/no-attempt assertions. No trigger is disabled or weakened. The final integration test SHA-256 is `db0b0dcdc8911c97f98f0218d4b3445b798cfdc332e43c06c7a45c1fda0f3442`. The reviewer read the repaired source but did not execute database tests. Contractor Main reported the fourth strict isolated run passing, closing this fixture finding without weakening product immutability.

## Independently executed checks

- Replay focused suite: 9/9 tests, one file, PASS, 1.61 seconds.
- Product adapter/retention/UI focused suite: 7/7 tests, one file, PASS, 566 milliseconds.
- Final combined core/replay/product focused run: 28/28 tests, three files, PASS, 2.97 seconds (2.28 seconds tests), started 2026-10-03 14:39:00 local time.
- Fresh 7,776-tuple replay matches separate flat enumeration: 7,407 witness tuples and 369 fixed-grid exclusions, zero unresolved. This verifies the scoped development control, not an uncontaminated model benchmark or new research theorem.
- No database, model, external network, worker/server or Git operation was performed by this skeptical review. Focused tests use transport mocks for Codex and real pinned Python arithmetic; they are not a live LLM/browser cycle.

## Contractor-attributed acceptance checks

The following are reports from Contractor Main, not executions by this reviewer and not inferred from mock transport tests:

- Final repaired isolated LRC database fixture: 1/1 PASS, 3.16 seconds overall, 1.40 seconds tests. Both configured database URLs were guarded as loopback `hiveos_test` before execution.
- Earlier legacy math-pilot integration suite: 8/8 PASS, 61.60 seconds.
- Full frozen unit suite before the final UI projection fix: 895 tests / 112 files PASS, 224.91 seconds. The final post-fix 112-file suite was still running when this report was finalized; no final post-fix pass is asserted here.
- Actual visible browser cycle completed using three fresh Codex contexts (solver, critic, adversary), with retained finite-grid evidence PASS for 7,776 tuples. The research root remained `PARTIAL`; both AI reviews were `INCONCLUSIVE`. This is live local procedural verification, not unrestricted LRC or Allikvere verification.
- Final build and lint after the UI provenance fix exited zero, as reported by Main.

The reviewer separately inspected the final `agentLedger.version >= 3` page projection, which preserves requested-model provenance for ledger v4. The product focused suite now contains eight tests, including a source-projection guard; that eighth test was not part of this reviewer's executed 28-test run. A source guard alone is not browser acceptance.

## Inspected source fingerprints

```text
08c6bb7d94ebfb9d5b64c3ce8840fbe486a40fe3e0dbaece72cb6c11929015e8 src/modules/research-sandbox/math-lrc-certificates.ts
4be01dbbeb9e802fd094ceadcf44c3a5ac600fde3f4138226ce67dcd1cd25cbf src/modules/research-sandbox/math-lrc-replay.ts
280ec187a51e5873e6890b9c764d183513d1822d0f2d568fae3c16447bd6b099 scripts/operations/replay-lrc-certificates.py
7a5c64d9be5ab2f0dab77beee096923a59e680b08a7d78d559e1d03cdaecefe0 tests/unit/math-lrc-certificates.test.ts
d8faa22fc6b255a79e99f88784e44c35678396ddb784312418f823009975152f tests/unit/math-lrc-replay.test.ts
77ca4b57d67cbb6a1066843ca604d4b17cfa8e7b0172ff8e6513b41aa2027cdb tests/unit/math-lrc-agent-gate.test.ts
db0b0dcdc8911c97f98f0218d4b3445b798cfdc332e43c06c7a45c1fda0f3442 tests/integration/math-lrc-agent-gate.test.ts
0d57b40fc7cdad0da174d246360036ef5e33813476b424743c8f3a1b3f3fad8a src/app/w/[workspaceSlug]/research/math-pilot/page.tsx
bbc125bbf6229617c1100e0990e9377695b735f1bebf345270a18bc1b4205e85 src/components/research/math-lrc-evidence-panel.tsx
939e900fbbbb97dafb17e0eb106ae048dedaa5fe159f8cb404bbc2f593b166e2 src/modules/research-sandbox/worker.ts
5d57b73d7390ca79a33a00b9ac5c4cd3f05ed430c94b119513ee45cb31c02a6d src/modules/research-sandbox/agent-review-kernel.ts
33560825925dffaaa1a36a20320d6288069777d7db26d2e6c797bd2124a9e72a src/modules/research-sandbox/adapters/codex-local-math.ts
6c87a2b07b2e02472d0ff02d481a922536e524d93e7459085782b37c14e3bdbd src/modules/research-sandbox/adapters/codex-local-review.ts
```

## Deferred acceptance

Contractor must retain the actual acceptance outputs and record the final post-UI-fix full-unit result and any remaining type-check gate. The attributed database/build/lint/browser passes above do not expand this reviewer's own execution scope. Full Allikvere regeneration, universal LRC proof, novel structural theorem and external mathematical acceptance remain excluded.
