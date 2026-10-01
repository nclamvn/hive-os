# TIP-033G Contractor verification

2026-10-01. User authorized continued local mathematical attack. Vibecode
Contractor/Builder/reviewer separation used; separate agents share the same
model, so peer criticism is not independent-model or expert certification.

## Requirement coverage

| Requirement | Verified outcome | Status |
|---|---|---|
|G01|Exchange preserves gcd, equation, sorted denominators and strictness|PASS|
|G02|Linear representative bound, conditional h boundary and ALL-m countercontrols|PASS|
|G03|Written shape-preserving minimum-residue lemma and translated-only examples|PASS|
|G03A|All71951 fixed-target higher-power cores checked and separately replayed|PASS|
|G04|D/E/F pins unchanged; no misuse of exchange or arbitrary mixed-q scope|PASS|
|G05|Primary TypeII prior-art comparison; novelty explicitly unresolved|PASS|
|G06|Two completion notes, skeptical review, proof and scoped scientific verdict|PASS|

Implemented7/7 (100%). No requirement interpreted as a guarantee of novelty
or success on the root conjecture.

## Scenarios and scientific evidence

- Written exchange and residual ALL-m refinement independently reviewed.
  Main freshly executed fixed TS/Python exchange audit:34354 controls,
  22587 swaps,32536 strict,206 residual; packet
  `3e919c231c80fcde5b8ad639e3bae84d5e5fd97c1e0b426cb6b316dcf5e1ea5b`.
- Written power-core cases reviewed separately. Main freshly executed full
  TS/Python audit:71951 cores,10738865 pair slots,5 hit cores/5 canonical
  tuples,2 translated-only. Packet
  `0077816c13c6f6ff6fbb490d220396a63cc92f07e0e9bde24a316b5077ee85a9`.
- p159727681 has no hit in the entire declared a>=1,b>=2,odd-prime-ell
  family. Its existing b1/q99 solutions remain valid. Not a root exclusion.
- Exact F sub-slice compatibility passed. Two translated-only tuples absent
  from E's recorded canonical tuple packet, not a claim about all E solutions.
- Skeptic additionally checked1344 image/bound rows, including1000 composite
  moduli and28 sharp cases;11 altered packets rejected; all5 positive cores
  independently exhausted over coprime divisor pairs.
- TS/Python monotonic first-core/midscan/finalization expiry retained PARTIAL,
  exact pending core and prefix only. Missing Python/forged/PARTIAL input never
  yields PASS. These are clock-injection controls, not a full OS stress test.
- Mixed-q scope control q15/p19 and retained q99/p159 show why the theorem
  cannot be generalized to multiple odd-prime supports. The latter has
  canonical residue260 below the falsely generalized bound263.

## Findings and repairs

1. New TS deadline initially started after core planning and used wall clock.
   Builder repaired it to monotonic start before planning, with finalization
   admission check. Expired processing cannot publish a COMPLETE manifest.
   Planning/core work remains bounded; these are checkpoint deadlines plus
   the separate replay-process timeout, not instantaneous per-operation stops.
2. Test-only F accessor initially used the wrong collection name; skeptic
   found it, Builder repaired it without changing F or scientific outputs.
3. UNAVAILABLE metadata initially echoed expected source hash as actual hash.
   Repaired to null unverified scriptDigest plus explicit expectedScriptDigest.
   Successful source-checked replays retain the actual verified digest.

No open correctness finding within this bounded review. Semantic alignment,
formal proof and literature priority remain outside this acceptance.

## Technical health

- Contractor full unit suite:436/436 tests,80/80 files, exit0.
- Final source-frozen focused suite:14/14 tests in2files, exit0.
- Fresh final typecheck:exit0, zero type errors.
- Fresh final full lint:exit0, zero errors/warnings.
- Diff whitespace and Contractor manifest:PASS.
- D artifact/Python, E Python, F artifact/Python pins:unchanged.
- Production build, integration/browser E2E:NOT RUN in this standalone slice.
  No app/UI/DB/worker/provider code was changed here.

## Overall status

READY for exact standalone local diagnostics, with explicit deferred gates:
typed pre-classification retention inside the actual agent cycle; live UI/E2E
exposure; formal/expert mathematical validation; exhaustive literature novelty
review; multiple-odd-prime support theorem and root-conjecture coverage.

No paid API/model dispatch, research worker/queue launch, schema/migration,
historical ledger promotion, Git commit/push, release or deployment. Existing
unrelated dirty workspace assets are preserved. The scientific outcome is
restricted-family completion and a useful search contract, NOT a claimed
breakthrough or previously unknown published theorem.

Proof/results/reproduction:
`docs/operations/MATH_PILOT_POWER_CORE_TAIL_AND_SYMMETRY_2026-10-01.md`.
Builder notes:TIP-033G_BOUND_RESEARCH_COMPLETION_REPORT and
TIP-033G_POWER_CORE_RESEARCH_COMPLETION_REPORT.
Skeptic:TIP-033G_RESEARCH_SKEPTIC_REPORT.
