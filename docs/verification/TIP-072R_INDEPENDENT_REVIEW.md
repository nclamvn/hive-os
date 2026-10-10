# TIP-072R independent mathematical and executable review

Date: 2026-10-05. Independent reviewer role under Vibecode Kit v6.2.
STATUS: PASS for the written theorem and bounded offline implementation;
READY_WITH_DEFERRED_PREEXISTING_REPOSITORY_INVENTORY_GAP overall.
Main owns historical preservation and final requirement acceptance. No browser,
native agent-loop, M1, runtime attestation or scientific admission was performed.

## Scope and frozen inputs

Read AGENTS.md, the relevant durable 072Q handoff and complete 072Q proof before
the independent mathematical scan. Read the complete sealed 072R TIP, complete
new proof, complete frozen product/test sources and Builder report. Vibecode Kit
and its QA/report references were read completely. Only this NEW report is
written by this reviewer; no product, tests, old evidence or manifest edits.

Confirmed SHA256 pins before and after the actual verification:

| Artifact | SHA256 |
|---|---|
|TIP-072R_CLUSTERED_LOWER_TWO_REGION.md|f2705cf652c0222d7fc38d688de8fbca893d549b2fe351c1302e86f22e69f86c|
|LRC_CLUSTERED_LOWER_TWO_REGION_2026-10-05.md|83795d823cbcbc23d120ab09d7ee623ddd5064d6c844a9503fc01333c6a83357|
|lrc-clustered-lower-replay.py|6dbed2c2c18fbceba5436091809a3e1ae2dd372e29fe391072a72db8bdf56536|
|test_lrc_clustered_lower.py|e261ced8fa02be11862a42675d0972c8fef8a2bbf61517f95c0388b4a51b192a|
|TIP-072R_BUILDER_COMPLETION.md|04b9079cbaccc3c7123c8f170c9eedcc7cd6481024f35ee4a64f366bc6697084|

## Mathematical acceptance: R1 and R2

PASS. Independently derived the two-region overlap, rather than inferring a
universal result from successful samples. For general d and eta with 0<2deta<1,
the first lower-good interval is [eta/m,(1-eta)/U]. The condition U<=Cm, with
C=(1-deta)(1-eta)/(eta(1+deta)), is exactly the sufficient inequality
W>=2eta/B for B=m(1-deta)/(deta). All denominators divided by are positive.

For V<=B, positivity and unit residues give no-wrap exceptional representatives
between 1/d and 1-eta at EVERY nonzero physical shift. The lower first bands
remain valid and shifts preserve them. For V>B, a closed lower interval of
length at least the selected exception's OPEN unsafe component cannot fit in
that component. Starting at its left endpoint and moving to the RIGHT boundary
is valid even for a negative phase offset or center tie. The selected exception
then forbids zero shifts; the other d-1 forbid at most one each. Equality is
GOOD throughout, not a forbidden endpoint. Composite d requires coprimality.

The constants are independently confirmed: nine lower multiples5 with U<=7m
and five unit exceptions yield target1/15; eight lower multiples5 with
19U<=117m yield target1/14. The written families are unbounded in ALL actual
coordinates, not merely common scalings, and require no lower-LRC assumption.
They complement rather than contain the old ratio9 lower progression5..45.

Explicit controls independently checked: n13 m95,U585,B171 has first interval
[1/1330,1/630], width1/1197; speed171 at physical j4 has distance1/14 exactly.
Case4 selected201 at t0=1/750 has orbit norm17/50>=1/3, so no adjustment is
needed. Case6 selected172 has negative nearest-center offset and orbit norm
47/133<5/14; its RIGHT endpoint19/12040 lies inside the interval near its
upper endpoint1/630. Substituting the nearest-boundary rule from 072Q would
not be the specified construction.

Above-cone control lower10,15,20,25,30,35,40,45,75 and exceptions1,2,3,4,21
has gap (20,300/13), and no selected-exception orbit-safe point in its first
lower interval. Yet31/150 is a full target1/15 witness. Failure of these
sufficient gates is UNKNOWN, not an LRC counterexample or an optimality claim.

[Allikvere v2, Section4.4 Lemma4.6](https://arxiv.org/html/2609.02604v2#S4.SS4)
was inspected directly: its stated counting condition does not close the
five-exception d5 case. The new ratio-restricted argument is a program-level
method improvement. This limited comparison, and the documented established
Kravitz interval principle, do NOT establish literature priority or novelty.
No whole archived branch or global LRC14/15 is accepted by this review.

## Actual independent arithmetic: R3 and R5

PASS. Ran a fresh child using the inspected source BYTES, Python -I -S -B,
shell=false, empty stdin, minimal environment containing only six exact-false
execution flags, timeout5s, and source pre/post SHA equality. Actual exit0,
stderr0B, stdout29993B including newline; process52.805458ms, arithmetic
11.6855ms, charged operations110396. Byte count varies with the separate timing
field and is not a deterministic semantic claim.

An independent read-only Fraction oracle, without importing Builder math or
Builder test expectations, reconstructed the COMPLETE canonical body: all
eight labels and actual tuples; every context/premise/boundary/gap/branch;
original and adjusted matrices; BAD sets and unions; GOOD complements; selected
distances; final witnesses; all scope fields and counts. All820 matrix
coordinates matched exactly. Eight original and four adjusted matrices remain;
six witnesses accepted by the bounded method, two out-of-cone UNKNOWN results
retain only their separately observed original witnesses. No matrix truncation.

Semantic digest MATCH:
`36c4b1e6579e222abc4924a0cd243ef83d8530564345d1d160d6f69a4e07401f`.

Eighteen coherent-rehash mutations were rejected by the REVIEWER's whole-body
comparison: targets/counts, original/adjusted distances, movements/bases, actual
speeds, already-safe boundary, branch, BAD sets, UNKNOWN promotion, ratio
constant, execution/agent-loop scope, accepted count, final physical shift and
label. Each mutant recomputed its digest, so digest consistency alone was not
the acceptance criterion. These are reviewer comparison controls, NOT claims
of a product certificate validator or signed runtime attestation.

## Actual fresh tests and hostile controls: R4

Command: `python3 -I -S -B tests/research/test_lrc_clustered_lower.py`.
Actual30/30 unittest methods PASS1.722s. The suite's thirty flag-fault subtests
and three option/path/custom-input refusal children are not added to the method
count. No historical 072Q test run is represented as fresh 072R evidence.

Additional reviewer-owned read-only checks:150 exact geometry cases PASS,
covering both targets, five unit speeds, positive/zero/negative centers and
both open-component endpoints/interior signs. Twenty-two own refusal controls
PASS, covering input positivity/types/caller evidence, rational component caps,
output limits and invalid/shared resource budgets. An extra out-of-cone tuple's
complete original matrix contributed70 independently checked coordinates and
confirmed the31/150 witness without promoting UNKNOWN.

Fresh AST parsing2/2 files PASS. Complete frozen source inspection confirms
the product's only os capability is reading the six named flags. No product
file, network, subprocess, DB/provider/private-root capability or old math
imports. The test/reviewer file reads and children are verification-only.

Hard ceilings remain5s,2M charged operations,32768B complete output and256-bit
rational components. One whole-run budget, not per-case reset. Preflight output
tree sizing rejects over-cap evidence before whole-tree serialization; there
is no truncation-to-fit or positive JSON on a CLI refusal. Local byte pinning
is not host/interpreter provenance or production executable-closure acceptance.

Next build/types/lint: SKIP, justified Python/docs-only scope; no application
code/config/dependency change to verify. Python static typing/lint NOT_CLAIMED.
Fresh `git diff --check` exit0. Browser/UI E2E, M1 and agent-loop are NOT_RUN.

## Requirement accounting and deferred repository issue: R6

| Requirement | Independent outcome |
|---|---|
|R1 universal written argument|PASS|
|R2 two separate targets and scope|PASS|
|R3 bounded standalone implementation|PASS|
|R4 fresh unit/adversarial checks|PASS|
|R5 full independent replay and comparison|PASS|
|R6 Main preservation and repository inventory|READY_WITH_DEFERRED; historical preservation owned by Main|

All6 R IDs have delivered artifacts;5/6 independently accepted without a
deferred repository condition. This is not a percentage of project readiness.
Fresh reviewer inventory:121 listed contractor files vs128 actual, no missing
listed file and ALL121 hashes matching. The same seven unlisted
research-program-v2 files remain: CORE_SCOPE.json, CORE_SCOPE_REVIEW_NOTES.md,
INTEGRATION_SCOPE.json, INTEGRATION_SCOPE_REVIEW_NOTES.md, SEAL_ACCEPTANCE.md,
UI_BENCHMARK_SCOPE.json, UI_BENCHMARK_SCOPE_REVIEW_NOTES.md. Their preexisting
history is Main baseline evidence; this reviewer confirms current inventory
only. No unreviewed reseal, exclusion or deletion is performed. R-INV-01/P2
requires owning-scope review; whole-repository green is NOT established.

ISSUES in new mathematical/product scope: none found. DEVIATIONS: none.
OVERALL: READY_WITH_DEFERRED_PREEXISTING_REPOSITORY_INVENTORY_GAP, offline only.
Next research should explicitly partition the remaining lower-ratio region,
not extrapolate this cone or the older fixed progression to an archived branch.

No DB/session/model/provider/API/Codex-child/privatecapture/scientificcase/job/
M1/campaign/archive/schema/migration/envfile/install/Gitwrite/commit/push/billing/
deploy. Execution authority remains false. Full072 remains
PARTIAL/NOT_READY_FOR_M1; global/formal/external/novelty/breakthrough absent.
