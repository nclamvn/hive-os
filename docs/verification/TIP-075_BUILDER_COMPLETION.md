# TIP-075 Builder completion — bounded WHOLE p139 generator

Date: 2026-10-05. Builder: period_builder. STATUS: PARTIAL — engineering
implementation and small controls complete; scientific attempt/acceptance NOT_RUN.
Root LRC_P139_REPRODUCTION_075; mode REPRODUCTION. Whole target J(13,139)=empty.
G/C/T/B remain OPEN. No theorem, prime-gate closure or new discovery is asserted.

Sealed TIP SHA256
3762425eaeee8e145d0130d0045391aadfcfa0be2cf1d8b0da76fb8425ed3df9;
immutable successor charter SHA256
aa870fdc24e48f6cbe0e6cc317e610c346b44d3939475d46fd804500d98869a7.
Vibecode Kit v6.2 used: read-only focused scan, Contractor sealed release,
Builder implementation, separate independent review and Main verification pending.
No whole-production attempt was run by Builder; Main owns attempt1 after freeze,
reviewer owns fresh same-cap attempt2. Tiny controls are not scientific attempts.

## Created files / freeze

Only these three NEW assigned files were written. No old file was edited.

| File | Bytes | SHA256 |
| --- | ---: | --- |
| scripts/operations/attempt-lrc-p139-generation.py | 22021 | 4d9931b0e5549567ac5c956f66272e04e949aedd9aa896b09690353855fc0ec7 |
| tests/research/test_lrc_p139_generation.py | 12188 | 8b338c3ecaee96e2b55391e06470c4422453cdefa22772eb10ae16d1b55ab9c5 |
| docs/verification/TIP-075_BUILDER_COMPLETION.md | reported separately after save | no self-referential hash |

Producer22021B is below30000B source ceiling. No imports of old mathematical
modules or author code. Python standard library only. Fixed no-input CLI; test
helpers use tiny domains/lower caps, never increase production ceilings.

## R1 — mathematical completeness design

Exact139 modular predicate constructs69 BAD masks, each with9 set bits. All69
folded unit actions are built independently from modular arithmetic. No tau139
claim, source rows, orbit totals or archive hash serves as a premise.

Any witness-free13-entry multiset contains a minimal DISTINCT support cover.
Its size s is at leastceil(69/9)=8 and at most13. If P times are private, total
incidence9s is at least P+2(69-P); thus P>=138-9s. Some chosen class has at
leastceil((138-9s)/s) private times. A unit maps that class to1, and those times
become a q-subset of B(1)={1..9}. Exhaustive schedules are:

| s | q | roots |
| ---: | ---: | ---: |
| 8 | 9 | 1 |
| 9 | 7 | 36 |
| 10 | 5 | 126 |
| 11 | 4 | 126 |
| 12 | 3 | 84 |
| 13 | 2 | 36 |

Total409, not the old p83 two-size20-root partition. Tiny helper additionally
uses minimality's private>=1 when the incidence bound is nonpositive; production
all six bounds are positive. This helper is not authority for another prime.

Search correctness:

- Root availability excludes every other class touching the selected private
  subset. Any normalized minimal cover containing that subset remains possible.
- Private-point loss is monotone: adding classes cannot restore a lost private
  point. A zero-gain addition has no private point and is pruned at its child.
- An already complete cover cannot be extended into a larger minimal cover.
  Insufficient remaining classes or9*slots capacity is a necessary impossibility.
- Available union must contain every uncovered time. The sum of largest slot
  gains is an upper bound despite overlaps, so its failure safely prunes.
- Choose uncovered pivot with fewest eligible coverers, ties lowest time. Every
  completion contains a pivot option. Assign it to its least ascending option;
  cumulative earlier-option exclusion then preserves every distinct completion
  once within that branch partition. This is enumeration, not first-witness search.
- A full-size leaf is recorded only when all69 times covered and all selected
  classes retain private points. Canonicalization considers ALL69 unit images,
  sign folding and permutation; it does not discard repeated coordinates.
- For EVERY canonical minimal support, combinations-with-replacement enumerate
  ALL extras of size13-s, including existing classes, repetitions and zero-gain
  extras. Transforming a full multiset's minimal support to its representative
  transforms its extras into some enumerated extra multiset. The exact canonical
  union therefore covers every13-entry orbit. Overlapping supports/extensions are
  deduplicated; no disjoint-count claim or sum-of-counts completeness inference.

Complete candidate evidence uses LRC139G1_PREORDER_EXTENSIONS_U8: ordered root
start records(size/private subset), preorder node reason/pivot/options, root end
node/byte counts, ordered minimal support table, explicit per-support extension
and canonical-image records, sorted13-byte canonical rows. A separate semantic
checker must reconstruct all branches, normalizations and extensions; it is NOT
implemented or replaced by these tiny tests. A complete candidate is labelled
COMPLETE_CANDIDATE_UNACCEPTED, admittedRows=0, G=UNACCEPTED_CANDIDATE, C/T/B=OPEN.

## R2 — exact bounds and accounting

Unchanged production maxima: aggregate work2500000; trace8388608B;
canonical13 data2097152B; summary262144B; source30000B;
candidate/stdout envelope16777216B; cooperative mathematical deadline120s.
One Budget exists before constructor work and is shared across all roots,
sizes, minimal supports, extensions, canonicalization and positive output.

Precharged work includes prime check, each mask coordinate/cardinality and unit
table coordinate, root construction/private/availability, every search node,
private/capacity/union/gain/pivot/options scan, sibling exclusion, child mask/private
update, every extension coordinate, every unit image/coordinate/lex comparison,
insertion-sort insertion/comparison, row/set lookup/insertion allocation, support
and final sorts(conservative n*bit_length(n)), final coordinate encoding and schema/
serialization bytes. Fixed69-bit mask operations have bounded widths; this is a
conservative algorithmic-work counter, not a hardware CPU-instruction count.
No root/size/candidate/shard resets. Refusal occurs BEFORE exceeding work limit.

L2 approved conservative storage clarification, stricter than the old encoded-only
p83 limits: encoded trace/root headers PLUS algorithmic scratch share8MiB;
canonical13 rows include encoded bytes PLUS conservative tuple/set overhead under
2MiB. Domain matrices, recursive frames, intermediate gain/option/private lists,
minimal-support sets, canonical image/sort/current-best copies and extension
buffers are precharged. Final sorted/data/base64/JSON simultaneous-copy upper
bound is checked against16MiB before those allocations. These are accounted
algorithmic allocations, NOT hard Python RSS containment; interpreter/module
baseline is outside the accounting. This can refuse earlier than an encoded-only
implementation and cannot prove that the original encoded-only envelope is
mathematically impossible.

Reviewer found bytearray's retained overallocated capacity was not covered by
the first draft's logical-byte charge. Before freeze it was replaced with
immutable bytes chunks in exact-size linked tuple nodes: sys.getsizeof(bytes)
plus tuple-node size reserved BEFORE linking, no growable trace list/bytearray.
Final pointer-list/join is included in the preflight and charged. Metrics separate
encodedTraceBytes from accountedTraceBytes. A negative cap test verifies unchanged
head/logical length/accounted allocation after precharge refusal. Root context is
set before entry refusal, and completedRoots counts fully recorded roots only.

L2 approved terminal-error-reporting exception: after mathematical work/time
refusal, emission of constant bounded diagnostic fields<=262144B is permitted
outside exhausted mathematical tick/deadline, with NO rows/trace/accepted data and
NO more search. It is not an extra computation grant. Positive final encoding stays
charged. Cooperative120s is NOT a hard process-wall sandbox; Main/reviewer must
use an external120s timeout, and a kill yields only host refusal/no admitted data.

Fixed CLI refuses arguments, stdin data, missing/nonexact-false execution flags
before mathematical work. An open empty pipe is refused using zero-time select,
not a blocking read. Only the six required flag names are read; no environment
values are printed. Inert self-source read is bounded30001B. No author files,
network, subprocess, dynamic code, filesystem writes or provider calls in producer.

Any refusal outputs NOT_ESTABLISHED, complete=false, admittedRows=0, exact
cap/phase/context/counters, G/C/T/B OPEN. No partial trace/dataset/support rows are
exported. Constructor failure retains the external Budget counters. Interruption,
memory/encoding/unexpected failure never releases a positive partial payload.

## R3 — sources / preserved scope

Primary source v2 https://arxiv.org/html/2609.02604v2 and inert archive SHA
c9428bfe14fd15fe45a3eade1f49e0b0fc28bb3a3c206bd00235424f10b46cc6 were read
in scan only. Archived v1 logs are not v2 equivalence or independent certificates.
Author counts informed feasibility risk, not any producer branch or acceptance.
No author code ran. No subset A/GW cascade was implemented or substituted.

All six flags OFF for engineering checks. No private diagnostics read/stat/write,
DB/session/case/provider/API/model/job/nativeM1/browser E2E/campaign, environment
file/schema/dependency/UI/product/source-pin/registry modification, install or
Git write/commit/push/billing/deploy. Source37/readiness remains SOURCE_REFUSED;
this new offline producer cannot mint runtime authority or a research approval.
Main owns broader preservation/inventory audit; the known unrelated inventory
drift is not repaired here.

## R4 / scenarios / health

| Requirement | Builder status |
| --- | --- |
| R1 full mathematical partition/design | IMPLEMENTED, tiny exhaustive controls PASS; full semantics pending separate checker |
| R2 aggregate bounds and safe refusal | IMPLEMENTED, hostile controls PASS; full measured outcome NOT_RUN |
| R3 additive/source/flag boundaries | IMPLEMENTED; Main preservation audit pending |
| R4 measured acceptance/reporting | PARTIAL: small tests/report complete, A6 and independent verification pending |

Engineering implementation3/4 complete,1/4 partial; scientific G/C/T/B0/4 closed.

| Scenario | Result |
| --- | --- |
| A1 exact masks/units/409 roots | PASS tiny construction checks, all69*69 modular coordinates |
| A2 minimal-cover enumeration | PASS separate scalar brute force on p7/divisor3/target3, p11/5/4, p17/6/5 |
| A3 units/repeats/cross-root union | PASS complete tiny multiset-orbit sets match independent brute force |
| A4 global work/refusal | PASS precharge/global continuation/canonicalization-extension budget checks; no partial exported data |
| A5 input/flags/deadline/storage/source | PASS missing/nonfalse six flags, unsafeCLI/stdin/openpipe, malformed/increased caps, work, trace/scratch/data/envelope/summary/source/deadline controls |
| A6 full measured production attempt | NOT_RUN: Main attempt1/reviewer attempt2 only after freeze; generation acceptance NOT_ESTABLISHED |
| A7 frozen report/preservation/independent review | Builder files/report recorded; independent/Main review and broad preservation PENDING |

Small controls21/21 PASS, 0 failures, unittest0.128s; initial17/17, then19/19,
then20/20 before final root-entry control. Source/scratch/trace-capacity issues
found in Main/reviewer draft review were fixed before freeze, not disguised as
scientific results.

Exact fresh command (six flags OFF, isolated Python, no bytecode writes):

```sh
RESEARCH_WORKER_ENABLED=false MATH_PILOT_QUEUE_ENABLED=false LRC_CAMPAIGN_LOCAL_ENABLED=false RESEARCH_OPENAI_ENABLED=false RESEARCH_CODEX_LOCAL_ENABLED=false SANDBOX_DOCKER_ENABLED=false python3 -I -S -B tests/research/test_lrc_p139_generation.py -v
```

git diff --check: exit0. Build/typecheck/ESLint: SKIP, only additive Python/tests/
Markdown; no TypeScript/Next/UI/dependency/schema/product change. Python imports
and code paths exercised by21 controls; no pycache creation. Full default producer
NOT_RUN; no full mathematical result hash exists at Builder freeze.

## Deviations / suggestions / STOP

No target/resource/architecture deviation. L2 decisions: shared conservative
storage accounting and bounded terminal diagnostic emission, as described above.
Tiny test-only max(1,q) uses minimality private>=1, not a production tau assumption.
Separate checker remains required even if producer completes; do not call a
matching count/hash or test suite an independently established G.

STOP after freeze for independent review and Main-owned measured attempt. If
work/storage/time fails, record exact result and leave whole target OPEN; after
at most two no-closure attempts STOP for direct human routing. Do not increase
caps, switch prime, narrow to two orbit families, import tau139 or start C/T/B.
