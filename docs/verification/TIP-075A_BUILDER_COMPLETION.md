# TIP-075A Builder completion — frozen engineering candidate

2026-10-05. Status: **PARTIAL**. The additive epoch2 producer and fixed public
collector are implemented and small controls pass. Default whole p139 generation
has **NOT_RUN**: Main owns attempt3 after this freeze; reviewer may own attempt4
only after a validated incomplete attempt3. G/C/T/B remains **0/4 closed**.
No mathematical milestone, source reproduction, independent G acceptance, live
authority or LRC14/15 proof is claimed by this report.

## Contract and provenance

- TIP-075A: `899b8aad9ad68a3c7ea9d1d8d29e7db91a5ce9bf157f102cb6f4cb6df3c07160`.
- Epoch2 charter: `c0ecdbf7daac42ed05fd3b0d0174ebabd3f0ef9af1dfcc49e513b9fa630ae6e0`.
- Root remains `LRC_P139_REPRODUCTION_075`; scope remains every13-entry folded
  multiset unit orbit at p139 level one, not selected roots or an assumed tau.
- Old producer, tests, Builder report and Main report were hash-checked unchanged:
  respectively `4d9931b0e5549567ac5c956f66272e04e949aedd9aa896b09690353855fc0ec7`,
  `8b338c3ecaee96e2b55391e06470c4422453cdefa22772eb10ae16d1b55ab9c5`,
  `2c1c87e44e581b0f907e23e45c21d5bb7cc4d712f1446d12785419c23940b400`,
  `45f873a6dbeb33f16467e86d1240bac4bcd540afe9ad615694e800209c8dce66`.
  Attempts1/2 are retained. Their primitive-work refusal after3493 search nodes
  is not evidence that the corrected search-node ceiling or time ceiling fails.

Only these NEW files are Builder-owned. No old product, source registry, sealed
case, charter, handoff, DB/schema, runtime, UI or Git state was written.

| Created path | Bytes | SHA-256 |
| --- | ---: | --- |
| scripts/operations/attempt-lrc-p139-generation-v2.py | 25203 | f9a43d77a498c0c0ed94d6df919c27a8d217fdfaae1e37556c41738eb5852bb8 |
| scripts/operations/capture-lrc-p139-generation-v2.py | 11150 | 298b1937c852c124be6cb2e29aa52c02d07d1bd2895688cf84537da139af070d |
| tests/research/test_lrc_p139_generation_v2.py | 18017 | d3a3c89e221774546ac652c5aaffc178c3512d4db3f2a5eef6fc681559143cbb |
| docs/verification/TIP-075A_BUILDER_COMPLETION.md | external freeze pin | self-hash intentionally supplied separately |

The host embeds the exact frozen new producer hash above, not an environment or
CLI override. Source ceilings30000/12000B are respected.

## R1 — whole-domain mathematics retained

The exact69 time/speed classes use the strict open BAD predicate
`14*min(v*t mod139, -v*t mod139)<139`; every mask and transposed coverer has9 bits.
All69 folded unit actions preserve multiplicity. Minimal distinct support sizes
8..13 have private quotas9,7,5,4,3,2. The normalized private-subset root counts are
1,36,126,126,84,36, totaling409; no source row count or tau139 is assumed.

Availability is a bitset. Pivot selection is the minimum available-coverer count
over uncovered times, with lowest-time tie; sibling options ascend and previous
options are cumulatively excluded. Monotone private-loss, capacity, union and
top-gain pruning preserve the previous mathematical partition. A gain histogram
replaces comparison sorting without changing the top-slot upper bound.

Every canonical minimal support is extended through ALL combinations with
replacement to13, including repeats and existing speeds. All69 unit images are
canonicalized and combined by an exact set UNION, never disjoint counts. Every
extension emits evidence even when its canonical image duplicates an earlier row.
Tiny scalar exhaustive oracles compare both the entire final multiset union and
the entire minimal-support spectrum, not just individual witnesses. The Builder
has not implemented or claimed the separate whole G semantic checker.

## R2 — resource units and conservative allocation model

The global node limit is2500000 **visit calls**: each root visit, internal node,
pruned node and leaf charges before its body. It never resets across roots/sizes.
Mask scans, unit images and extensions increment primitive-operation telemetry
only; a control deliberately exceeds10000000 operations without a work refusal.
Extensions remain bounded by evidence bytes, working memory and the shared
deadline rather than escaping through a hidden unbounded post-search phase.

Encoded trace8388608B, encoded canonical dataset2097152B and encoded stdout
16777216B are separate from producer working accounting134217728B. The explicit
new128MiB allowance is not called an inherited ceiling or hard Python RSS limit.
Producer120s is cooperative, including constructor and output; host starts its
independent120s child clock BEFORE Popen and kills/waits on expiry. Built-in
sort/base64/hash/JSON cannot be interrupted by a cooperative poll; the host is
the outer timeout. Constant bounded terminal error emission is the approved
exception after mathematical refusal; it includes no rows, trace or supports.

Preallocation reservations, made BEFORE corresponding allocations, are:

- Full fixed trace capacity plus128B; bounded equal-size slice replacement only,
  no append/extend and no retained-capacity growth. Logical encoded length is
  measured separately from the full allocated buffer.
- Domain tables `4096+256*n+4*n*n`; p139 uses n69. Canonicalization temporaries
 4096B; root temporary4096B; each recursive frame4096B, depth at most13;
  completed-root metadata1024B each, and initial set/root headers4096B.
- Each unique compact bytes key reserves `256+width` before insertion, covering
  bytes objects, set slack and simultaneous resize tables. Individual removals
  do not release this reservation while the set exists. Minimal-set header256B
  and key reservations release only after the whole set is cleared/deleted.
  Encoded13B charges independently before each unique final-row insertion.
- Minimal support sorting/join workspace `4096+128*N`: sorted pointers plus
  CPython bytes.join per-item Py_buffer descriptors and slack. Compact retained
  support table reserves `width*N+128`; extension temporaries4096B.
- Finalization workspace `1048576+128*Nfinal+9*R`, where R is logical raw trace,
  final raw data and all raw support tables. The128-per-row part covers sorting
  pointers plus join descriptors. The9R part covers raw trace/data copies,
  simultaneous base64 bytes/strings, JSON fragments/join strings and UTF8 output;
  the1MiB part covers bounded409-root metadata/containers and fixed overhead.
  These are conservative algorithmic reservations, not measured RSS. Interpreter
  baseline, allocator behavior and arbitrary future Python implementations are
  not a hard sandbox guarantee.

Encoded stdout is preflighted using exact `4*ceil(rawBytes/3)` per blob plus JSON
metadata and newline, then the serialized length is checked exactly. A1024B
initial metadata-growth margin is conservatively reserved within the SAME stdout
cap; it can refuse a near-boundary candidate, not silently increase the cap.
No sixfold trace multiplier is confused with encoded stdout. Final telemetry is
explicitly labeled `AFTER_BLOBS_BEFORE_FINAL_JSON`; it does not falsely count the
last JSON construction/output poll as already measured. Host elapsed time covers
child execution and validation, not subsequent receipt-file fsync.

Host separately preflights128MiB: stream buffers/copies bounded by
`4*OUT+4*ERR+65536+headers`, and parse/structural validation copies by
`7*stdoutBytes+4194304`. The4MiB includes fixed<=30k own-source AST/definition
loading. This is a bounded pinned-producer JSON-profile allocation model, NOT
generic hostile JSON defense or hard interpreter RSS containment. Base64 ASCII,
length/count bounds precede decoding. Source/body integrity is not mathematical
acceptance.

## R3 — host integrity, history and approved L2 implementation choices

CLI permits only `--attempt=3` or `--attempt=4`, with six exactfalse flags and
no caps or output paths supplied by callers. Pin/history/parent-path/output
symlink checks and preexisting output refusal run before own-source loading or
child dispatch. Attempt-start is create-only before the child; crashes/timeouts
leave it retained and forbid silently retrying that attempt. Files use exclusive
creation with nofollow guards; receipts/candidates are never overwritten.
Parent path inspection plus exclusive final creation is not claimed to solve all
hostile concurrent filesystem replacement races.

The child uses Python-I-S-B, stdinDEVNULL, shellfalse and an allowlisted OFF-only
environment. Selector reads bound stdout16MiB and stderr8192B while streaming.
Timeout/excess/nonzero/stderr causes kill when necessary, wait and pipe cleanup.
On malformed or negative results only a bounded diagnostic/receipt survives,
never partial mathematical rows. Complete candidates retain exact stdout bytes
as UNACCEPTED/admittedRows0/semanticVerifiedfalse and prohibit attempt4.

Attempt4 requires a fully validated pinned attempt3 terminal INCOMPLETE receipt:
exact boolean/type/keysets, root/epoch/pins, start hash/domain, payload hash/count,
and consistent diagnostic versus host-failure alternatives. Start-only history,
truthy terminal values, semantic0, malformed counts or a complete attempt3 refuse.
Historical Main report pins bind earlier attempts; they do not mint live grants.

Approved L2: to preserve BOTH source ceilings, only the pure bounded structural
capture validator lives in the SAME pinned own producer. The host loads exact
already-verified OWN bytes in memory after CLI/flags/path/pins checks, validates
ROOT/SCOPE/LIMITS/callable exports, and never constructs Generator or starts math
at import. This is explicitly same-trust provenance/schema validation, NOT an
independent G checker or permission to execute author/arbitrary external code.
It validates all409 ordered descriptors, exact limits/domain/encoding, typed
metrics, coherent base64 lengths/hashes, sorted fixed-width rows/supports,
distinct entries within each minimal support (final13 rows permit repeats), and
extension/trace length relationships. A zero-row complete candidate is logically
allowed when ALL structure/counts cohere; observed source counts are not premises.

## R4 / acceptance map and fresh controls

Command executed with no default whole producer or real child dispatch:

```sh
RESEARCH_WORKER_ENABLED=false MATH_PILOT_QUEUE_ENABLED=false LRC_CAMPAIGN_LOCAL_ENABLED=false RESEARCH_OPENAI_ENABLED=false RESEARCH_CODEX_LOCAL_ENABLED=false SANDBOX_DOCKER_ENABLED=false python3 -I -S -B tests/research/test_lrc_p139_generation_v2.py -v
```

Fresh final result: **29/29 PASS**, unittest0.224s, process0.218s reported by the
terminal wrapper. These timings are incidental small-control measurements, not
a prediction that the whole target fits. All controls use tiny mathematical
domains or mocks/temp output paths. The synthetic409-root positive host fixture
is explicitly NOT a mathematical certificate: it tests schema/transport retention
and UNACCEPTED status only.

| Acceptance | Builder result / remaining boundary |
| --- | --- |
| A1 | Listed old pins unchanged; same root/epoch2; fixed attempts3/4 and receipt ordering controls PASS. Main performs final preservation audit. |
| A2 | Global node-only refusal and >10M telemetry controls PASS; visits never reset. |
| A3 | Exact69 masks/transpose/units/409 roots, histogram equality, and complete tiny scalar multiset/support unions PASS. Independent tiny trace reader is reviewer-owned, not claimed complete by Builder. |
| A4 | Trace reserve-before-allocation and constant capacity PASS; encoded data before insertion, working preflight before set/sort/output, extension/canonical deadline and stdout refusal controls PASS. |
| A5 | Flags/CLI/pin/path/symlink/overwrite/status/epoch/type/base64/schema/history and partial-output refusal PASS; actual stream_child function tested with mocked pipes/select/process for timeout and stdout/stderr excess, including kill+wait+close. No real producer dispatch. |
| A6 | NOT_RUN; no measured default result/candidate/closure. Main attempt3 is next; reviewer attempt4 conditional on incomplete3. |

Draft defects found and repaired before freeze: unresolved macOS temporary `/var`
symlink paths in tests caused5 fixture errors, corrected by resolving temporary
roots rather than weakening product guards; mechanical validator relocation
renamed base64's `validate=True` keyword incorrectly, detected by positive
transport control and repaired; initial oversized host source was refactored
under explicit approved L2 without raising12000B. Reviewer concerns led to128N
join reservations, strict complete schema/history and output-path-before-loader
checks. Main's last review also moved set/header reservation before constructing
the containers and added distinct minimal-support coherence plus a repeated
support negative fixture. No whole attempt was consumed while repairing drafts.

Next/build/types/lint are SKIP: Python/docs-only additive scope, no product or
Next changes and no active server build. The existing seven-file contractor
inventory drift is unrelated and not repaired/resealed here. No runtime flags
activated, environment files inspected, private diagnostic path touched, API or
native job used, mathematical case changed, or Git commit/push performed.

## Freeze / STOP

After these pins, Builder stops writes for independent/Main review. If measured
G completes, keep exact UNACCEPTED bytes and STOP for separately released full
semantic checker; a same-producer rerun cannot close G. If incomplete, preserve
exact cap/context/resources, admittedRows0 and open G/C/T/B; attempt4 is the only
remaining conditional run. Max cumulative4 is not reset by this amendment.
