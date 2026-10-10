# TIP-072M — independent Fraction replay completion

Date: 2026-10-04. Builder: Replay Builder. Status: DONE for the assigned offline
diagnostic implementation; mathematical acceptance and whole-project acceptance
remain the Contractor and independent reviewer's responsibilities.

## Scope and ownership

Created only these new files:

- `scripts/research/lrc-shift-margin-replay.py`
- `scripts/operations/lrc-shift-margin-audit.ts`
- `tests/unit/math-lrc-shift-margin-replay.test.ts`
- this completion report.

Sealed TIP SHA:
`33c6bb0b6cb550fd68b38affbb8ee26fa88b4e5b52b1083d01eec0a3de096934`.
Vibecode Kit's Builder role restricted implementation to the assigned new files;
the Contractor approved the compact wire clarification before changing it.
No historical product, predicate, registry, ledger, source manifest ceiling,
routes/UI, worker, case, database, private capture, environment file, Git state,
provider, campaign, billing, or deployment was changed or accessed for execution.

## Exact reconstruction

The Python checker uses its own stdlib `Fraction` arithmetic. It imports neither
Core nor old arithmetic. It independently constructs every critical phase,
deduplicates coincident boundaries, visits every boundary and adjacent open cell
including cyclic wrap, and derives each actual mask and the deduplicated
per-unit/aggregate attainable mask families. It exhausts the aggregate Cartesian
products rather than redundant unit/cell tuples.

| d/e | delta | aggregate masks | tuple count | minimum good | conditional margin |
|---|---|---:|---:|---:|---|
| 3/2 | 1/6 | 4 | 16 | 1 | 1/13, assuming LRC(12) |
| 5/2 | 1/5 | 15 | 225 | 1 | 1/13, assuming LRC(12) |
| 5/3 | 1/10 | 6 | 216 | 2 | 1/12, assuming LRC(11) |
| 5/4 | 1/10 | 6 | 1296 | 1 | 1/11, assuming LRC(10) |

There are exactly 14 unit partitions, 66 boundary cells and 66 open cells: 132
cells in total. All 1753 mask tuples are exhausted. Distances and all endpoints
are reduced exact rational string tuples. Strictly smaller distances are BAD;
equality is GOOD.

Explicit unit-one sharp phase offsets are respectively
`[5/6,1/6]`, `[4/5,1/5]`, `[9/10,1/2,1/10]`, and
`[9/10,1/2,1/10,7/10]`. Every d-by-e exact distance is retained and the maximum
of the per-shift minimum distances equals delta exactly. Sharpness of distance
is not sharpness of the survivor count: the 5/2 sharp phase witness has three
good shifts although the exhaustive tuple minimum is one.

The separate written all-real counting/continuity proof is required for the
universal interpretation. Rational representatives alone are not offered as an
all-real proof. Lower-LRC witness and analytic alignment assumptions are explicit.
No global LRC14/15, single-speed-tuple optimum, formal proof, external approval,
novelty, live agent loop, or breakthrough is asserted.

## Process and safety contract

The audit starts one aggregate allowance before source IO and Core computation.
External controls require positive safe-integer milliseconds at most 5000 and
operations at most 2000000; fractional, zero, nonfinite, negative, oversized and
accessor controls refuse. After charged Core and IO work, the child's allowance
is the remaining operations and floored remaining milliseconds, never a reset.
All comparison, source rereads and result serialization checks use that same
outer allowance. Core/Python actual work counts need not equal one another.

The fixed fresh child command is `/opt/homebrew/bin/python3 -I -S -B -c` plus
the inspected pinned Python source bytes. `shell:false`, minimal external
environment `{NODE_ENV:"test"}` with no inherited PATH/secrets, 32KiB bounded
stdout/stdin/source reads, 2KiB stderr, no write option or supplied executable.
The small NODE_ENV entry is the Contractor-approved typing clarification for the
repository's required `ProcessEnv.NODE_ENV`; Python does not consume it.
Only fixed four-class requests are supported. Duplicate input keys, JSON NaN,
extra keys and unsupported versions refuse before mathematical work.

Six flags must all equal `false`: RESEARCH_WORKER_ENABLED,
MATH_PILOT_QUEUE_ENABLED, LRC_CAMPAIGN_LOCAL_ENABLED, RESEARCH_OPENAI_ENABLED,
RESEARCH_CODEX_LOCAL_ENABLED, SANDBOX_DOCKER_ENABLED. Missing or true flags refuse.

Before and after execution, no-follow regular-file FD reads verify source size,
identity metadata and pinned byte hashes. Executing the already-inspected source
bytes avoids a Python pathname swap between inspection and dispatch. The complete
normalized semantic evidence, not merely a hash or verdict, must equal the fresh
Core report. Metrics are outside the semantic digest. Failure, timeout, source
drift, oversized IO or exhausted resources never returns partial positive
evidence. The complete successful audit JSON is also checked below 32KiB.

These hashes are **local source-byte/process consistency pins**, not signed
attestation of the host, installed Python runtime, imported stdlib, agent identity,
production execution closure, actual M1, or mathematical authority. Cooperative
time/accounting checks are not OS-level proof that a malicious host is bounded.

## Wire clarification and preservation

The initially verbose fraction objects yielded a measured 33375-byte report,
33468-byte envelope and 33558-byte process JSON, so the actual bounded checker
correctly returned RESOURCE_REFUSED. An in-memory overflow measurement was only a
size investigation, never an accepted certificate. The Contractor approved
compact `[canonicalNumerator,canonicalDenominator]` strings while preserving every
cell, endpoint, family, witness, field and limit. The final Core envelope is
18960 bytes; the observed successful standalone Python process JSON was 19050
bytes. No ceiling was increased and no branch was removed.

## Verification evidence

Final own selector:

`node ./node_modules/vitest/vitest.mjs run --project unit tests/unit/math-lrc-shift-margin-replay.test.ts --maxWorkers=1 --no-file-parallelism`

All six execution flags OFF. Final 72/72 tests PASS, 0 failures,
start 23:21:38 local, duration 1.17s, exit 0. Earlier development checks are not
added to this count. The actual fresh process tests invoke the installed Python;
mocked process/IO tests are negative fault injection only, not the success basis.

Controls include 16 coherent rehashed semantic mutations (endpoint, nonunit,
missing/reordered cells, wrap, equality, sharp optimum/distances, duplicate family,
tuple count, survivors, missing lower assumption, global/agent/authority promotion,
component overflow); wrong process metrics; source drift both before and after
process success; failure/timeout/signal/stderr/malformed/oversized process output;
invalid budgets; shared operation exhaustion and a returned process beyond the
outer deadline; actual Python hostile fixed requests and oversized stdin.

Actual standalone CLI, with all six flags OFF:

`node --import tsx scripts/operations/lrc-shift-margin-audit.ts`

Exit 0, MATCH; observed outer 62.830542ms / 80863 charged operations;
Core 8.447125ms / 30852 operations; Python 6.417500ms / 33867 operations;
fresh process wall time 48.783875ms. These observed timings are not production
latency guarantees. Full semantic digest:
`bc5e0c35ca92175882b6056edf4ddbe13fa169a085cced57edf256fbf88c92ed`.

Own ESLint selector: 0 errors / 0 warnings / exit 0.
Whole `tsc --noEmit --incremental false`: exit 0 after own/Core type repairs.
Main still owns final historical regression pack, whole build/lint/type checks,
preservation audit and acceptance; independent frozen-byte review is pending.

## M1–M6 mapping

| ID | Builder result | Evidence / remaining owner |
|---|---|---|
| M1 | PARTIAL, outside own proof ownership | Complete cells/masks; written all-real proof and independent math review are Main/reviewer-owned |
| M2 | PASS within fixed-class executable scope | Four exact distance witnesses, Python/Core complete match; general proof is separately reviewed |
| M3 | PARTIAL, outside own proof ownership | Correct four conditional margins and explicit assumptions retained; analytic lifting proof is Main-owned |
| M4 | PASS | 132 cells, 1753 tuples, deduplicated attainable families, fresh independent Fraction process, truthful metrics |
| M5 | PASS | Semantic rehash, resource/process/source/IO controls; no partial positive |
| M6 | DEFERRED to Main/reviewer | Own tests/types/lint pass, final frozen pins supplied; whole QA and consequential review pending |

## Frozen implementation pins

- Python: `526ea120b5254fffd1ad1571db2ec351bd264f7ebf4f2febe6e5763e4d0ce353`
- CLI: `dd6bc2be517d1f26bbbadbc8fab83f2fe5cd819ab48981bef75ff7335e63cb07`
- Own tests: `f131de88af93b6955fec8042ffc1ec467b328e154e7ef0184a83b7357cc100bb`
- Compared Core: `86c23ecfd0fd68d28d093dfceebe92abf83929d5c06c17881349f674779d6132`

No implementation deviation beyond the approved compact wire and minimal external
environment typing clarification. No proposed production scope/cap change was
implemented. The earlier 107-file candidate TypeScript import scan is incomplete
as an executable/third-party closure and is not this diagnostic's attestation.
