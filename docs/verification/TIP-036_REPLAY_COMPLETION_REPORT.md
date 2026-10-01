# TIP-036 B: independent shifted-factor replay completion

Date: 2026-10-01. Builder: target_builder. Status: DONE for the standalone replay/invariant-verification scope, pending independent Contractor acceptance. Scientific ceiling: finite public development arithmetic, not a root proof, official benchmark, formal proof or novelty result.

## Files created

- `scripts/operations/adaptive-shift-replay.py`: isolated stdlib-only independent trial primality, positive-divisor scan, factor recovery and ordered coprime divisor-pair enumeration. It never imports primary data or uses the primary signed-factor dynamic program.
- `scripts/operations/adaptive-shift-check.ts`: bounded schema, exact frozen inputs, scope and resource checks, full-row hash/identity verification and invariant comparison.
- `scripts/operations/adaptive-shift-replay.ts`: fixed source-pinned Python adapter, 60-second total wrapper boundary, 2-MiB output bound, allowlisted environment and distinct expected/observed/verified source provenance.
- `tests/unit/adaptive-shift-replay.test.ts`: 11 focused scenarios including actual source-pinned execution, rehashed corruptions, partial resource controls, process/source failures, a final observed wrapper-deadline control and a simulated candidate-investigation diagnostic.
- This report. No prior pinned source/artifact, application/page/DB/queue/worker/model/provider/Git file changed by this Builder.

## Frozen scope and independent result

Both implementations use exactly `200000000 < p <= 201000000`, prime `p=1 mod 840`, and shifts `[7,11,23,47,59,83,107]`. All eligible interval primes are independently tested. Four exposed warmups remain a separate ordered prefix; p19 is **not** placed in these rows because `(19+h)/4` is nonintegral at every menu shift. Its historical h1 construction is separately checked. Neither the interval nor menu was modified after seeing hit counts.

Source-pinned independent replay agrees on **275 interval primes**, **1,953 rows** (28 warmup plus 1,925 interval rows), all complete sorted residue images, exact factor valuations, row hashes, candidate classifications and numeric lexicographic canonical `(u,v)` with `u<=v`. There are **971 hit rows across the combined warmup/interval packet**; this is not a claim of 971 new primes solved, new root coverage, or general conjecture progress. Misses concern this selected Type-II shift family only.

The Python cross-product examined **1,742,040 divisor-pair candidates**, below 50 million. Every retained construction independently satisfies coprimality, `uv|T`, `h|(u+v)`, exact `A,k`, strictly increasing denominators, exact rational identity and exactly two p-divisible denominators. Repeated prime valuations and unused mass are retained, not replaced by a whole-block assumption.

Stable shared invariant content SHA-256:

`ca0edf6ce6ab31d22e801a63db8301039efc20eb3c9d9ee7a613318ef2fcb913`

Prime manifest SHA-256:

`c0a2a8a449bc9eafb46860ba076e40e67b8a1f13c257ab700776b6e2aa5cfa10`

Final Python source pin:

`18dcf20e88d1fd70a5d5cee8e5db429f426f8e3a1e2ac1540f986766cb80fed9`

Group boundary controls use independent Cartesian exponent enumeration, not the primary dynamic-state implementation. h7: 15 profiles, 12 nonresidue-applicable, 6 total misses, zero classification mismatches; profile digest `d897706f4e59c5fcb2bb330a0dfb087c86b9e56785a163906d68708af8c15dae`. h11: 495/460/45/0; digest `c3c464023621b168f4db239b548330a82b770a4aea45ceb857b49377a83887d6`. Total misses include all-QR profiles; they are not identical to applicable misses.

Actual full independent runs completed in roughly 2.2–2.4 seconds of Python arithmetic and about 3.2 seconds including source/check/wrapper overhead. A full compact Python packet was 1,419,660 bytes, below 2,097,152 bytes. Runtime/packet hashes are deliberately run-specific; shared `contentDigest` excludes implementation-specific timings and pair/state counts. These measurements are local arithmetic, not model token or latency observations.

## Requirements and verification

| Requirement | B scope | Evidence |
| --- | --- | --- |
| R02 | PASS, replay/control share | Wrong p19 integrality, exact historical q15/q99 tuples, safe-prime candidate reconstruction, repeated/unused valuations, sorted images and strict identity checks. |
| R03 | PASS | Exact interval/menu/warmup identities; <=10,000 rows, <=50 million Python pair checks, 60-second wall boundary and <=2 MiB output. PARTIAL binds completed prefix and exact pending input; no partial is PASS. |
| R04 | PASS | Fixed pinned source bytes run with `python3 -I -S -B -c`; fresh full independent row/image/canonical agreement. Mutated source, missing process, timeout, output overflow, invalid JSON, image/factor/domain/prime/witness/candidate/hash mutations fail closed. |
| R06 | B completion supplied | Focused tests, lint/typecheck and this report. Final combined skeptical/Contractor verification remains separately owned. |

Self-check command: `npx vitest run --project unit tests/unit/adaptive-shift-replay.test.ts`. Owned lint command: `npx eslint scripts/operations/adaptive-shift-check.ts scripts/operations/adaptive-shift-replay.ts tests/unit/adaptive-shift-replay.test.ts`. Typecheck: `npx tsc --noEmit --pretty false`. The prior final owned run passed 10/10 tests with lint 0 errors/0 warnings and typecheck 0 errors. Contractor's subsequent whole-unit run passed 597/598; its sole failure was this fixed 1.4-MiB rehashed-mutation test exceeding the default 5-second test timeout under suite contention (5,273 ms), not an arithmetic assertion failure. That one test now has a bounded 30-second test allowance; production arithmetic/wrapper limits remain 60 seconds. The added final-clock regression initially exposed a test-only nested `perf_hooks` spy problem (10/11, mockReset TypeError), fixed using an explicit module mock forwarding the real clock by default. Final post-repair run at 19:59:44+07 passed **11/11** in 18.49 seconds, owned lint **0 errors/0 warnings**, and full typecheck **0 errors**. Contractor owns the final whole-unit rerun. No integration DB, build or browser campaign was launched here.

Reproduction from repository root:

```sh
node --import tsx -e 'const a=require("./scripts/operations/adaptive-shift-partitions.ts");const b=require("./scripts/operations/adaptive-shift-replay.ts");const r=b.replayAdaptiveShiftPartitions(a.adaptiveShiftPacket());console.log(JSON.stringify({...r,replay:r.replay?{status:r.replay.status,contentDigest:r.replay.contentDigest,rows:r.replay.rows.length,primes:r.replay.primes.length,runtime:r.replay.runtime}:null}));'
```

## Findings and repairs

1. Whole-target timeout includes divisor discovery, pair enumeration, finalization and serialized packet sealing. Final serialized COMPLETE output crossing the 60-second boundary is changed to PARTIAL/FINALIZE, not accepted. Completed h7 controls remain retained if h11 is interrupted. Output limiting retains the largest bounded exact row prefix with the first unretained row named.
2. Checker now rejects fully rehashed COMPLETE receipts with `elapsedMs>=60000`, internally contradicted normal prediction/hit records, and a forged partial pending row not equal to the next prefix input. A plausible non-target image omission can pass scoped identity validation; **fresh full independent comparison still rejects it**. The scoped checker does not claim image completeness or lex minimality on its own.
3. The source adapter originally hashed a file and then executed its path. It now executes the exact verified source **bytes**, closing that read/execute race. `expectedScriptDigest` is policy; `observedScriptDigest` is actual read provenance; `verifiedScriptDigest` is populated only after equality. A mismatch never claims a verified pin.
4. ESM builtin exports cannot be spied on with direct namespace `vi.spyOn`; tests use Vitest's builtin-module spy wrappers. Next augments `ProcessEnv` to require `NODE_ENV`; the child receives a fixed `NODE_ENV=test`, plus PATH and Python bytecode-disable only, not application/provider secrets. Executable selection through local PATH is not a Python-binary attestation.
5. A simulated contradictory prediction now retains a bounded offending row in an explicit `INVESTIGATION` diagnostic and exits nonzero. It is not a normal COMPLETE packet or automatic scientific refutation. The wrapper cannot PASS it. No actual contradictory mathematical input was found or claimed.
6. The wrapper's result factory previously revalidated the large primary packet after its last deadline check. It now retains the already-validated primary digest, observes elapsed time after validation/comparison work, and downgrades a would-be PASS at `elapsedMs>=60000` to UNAVAILABLE/WRAPPER_TIME_LIMIT. A controlled monotonic-clock test covers this final-boundary race. This is an observed total-work checkpoint, not hard preemption of synchronous JavaScript.

## Limits and deferred acceptance

The shift parametrization and safe-prime group framework overlap known literature and previous A19 work; B does not assert novelty. Group profile tests are finite controls, not a proof of an all-modulus theorem. The full invariant match verifies only the declared finite packet. More constructions of previously covered primes do not establish new root coverage. A universal bridge requiring an appropriate shift for every residual prime remains unresolved.

Primary theoretical notes, rigorous theorem review and literature comparison are separate Contractor/Builder A outputs. Formal/kernel validation, expert mathematical/publication acceptance, live agent-cycle integration, model comparison, UI/browser demonstration and general Erdős242 breakthrough remain outside this replay slice.
