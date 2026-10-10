# TIP-069: evidence-admitted LRC research-loop planning

Date: 2026-10-04. Priority: P0. Status: SEALED_G1_OFFLINE_CONTINUATION.
Project: HIVE OS. Working directory: `/Users/os/hiveos`.
Dependencies: sealed TIP-065–068, approved research-program blueprint R5/R7/R11.

## Decision and authority

Human “Tiếp theo” continues the previously approved offline implementation.
This TIP completes a narrow deterministic planning component of R5, not a new
executor or an autonomous live batch. Main contracts and verifies; Core Builder
implements; Integration Builder independently reviews consequential semantics.
No new RRI/architecture gate: this is the already approved blueprint §7 rule.

The scan found that two-no-information stop/pivot is currently descriptive
text. It also found that production creation-authority/bootstrap and durable
private replay indexes need further security design. Those remain deferred;
this TIP does not implement a permit mint, kernel bypass or production ingress.

## Deliverable

Add a pure versioned LRC loop sidecar and focused offline tests. It must admit
retained ledger7 records against externally supplied actual row/job/source and
outer retained-digest bindings, then derive bounded proposed gap tasks and a
deterministic STOP/PIVOT/CONTINUE/PLANNING_ONLY decision. Reuse the existing full
record validator, not only a ledger parser. No product UI changes are required.

Admission is an explicit trust boundary: callers cannot fabricate admission
by providing a typed `{status: ADMITTED}` object, copying/deserializing it or
coherently rehashing a mismatched record. Use private identity brands or repeat
full validation. Host references are an explicit trusted boundary, not a claim
of resistance to an entirely malicious host fabricating all evidence.

Tasks may identify only the fixed six premises/seven steps and exact reviewer
gap references. Target/root contribution requires separately admitted exact
host association; arbitrary prose cannot create a master implication. Unmapped
gaps stay visible as UNROUTABLE. A proposed root contribution is planning only,
never logical sufficiency or discharge. Do not alter the frozen unit statement.

A sealed bounded batch registry, exact candidate predicates and independently
admitted information receipts supply planning policy. Missing registry means
PLANNING_ONLY, never implicit execution authority. Modes stay separate:
REPRODUCTION is not novelty; DISCOVERY candidates need a separate falsifiable
statement, domain/quantifiers/assumptions, difference from source, expected gain,
strongest objection and novelty PENDING. This service does not assess literature.

Refutation blocks only the exact quantified predicate/domain/assumptions or
explicitly evidence-admitted bidirectional equivalence. Normalized prose, copied
hashes, names and overlapping finite checks cannot establish equivalence.
Changed assumptions are not silently banned. Repeated known finite PASS, votes,
new prose/hash and source adoption do not count as new mathematical information.

Two-no-information requires two DISTINCT completed admitted experiments in the
SAME sealed batch, in declared order, against a predefined information criterion.
Missing/unknown execution, duplicates, retries and in-flight experiments do not
count. An independently admitted new aligned obligation result, exact predicate
refutation or predefined uncertainty change can reset the streak. Operational,
integrity, accounting and resource failures hard-stop before selection. At
streak 2, pivot only to a different eligible preapproved candidate within the
remaining exact cap; otherwise STOP_NO_INFORMATION. A one-experiment manifest
cannot license two experiments. Unknown resource usage refuses dispatch planning.

Planning bounds: <=16 admitted records, 32 candidates, 64 proposed tasks,
64 relation references; aggregate input <=2MiB and output <=256KiB. Experiment,
role call/token/wall/tool/checker/prime caps come from the trusted sealed batch,
not method-card text. These bounds never relax 30min/240s/49KiB/1MiB/32KiB/
256bits/5s/2M operations or authorize expanded finite domains.

## Acceptance criteria

- A1: Given a valid retained record with exact external bindings, admission
  freezes it; missing/wrong row/job/source/digest and forged admission refuse.
- A2: Given admitted review gaps, proposed tasks preserve exact source finding
  and root association; missing association is UNROUTABLE, never proof closure.
- A3: Given two distinct completed no-information experiments in the same batch,
  the projection pivots to an eligible different approved candidate or stops;
  duplicate/incomplete/failed/other-batch records cannot create the streak.
- A4: Given independent aligned information, the streak resets; repeated known
  checks, votes and changed prose alone do not reset it.
- A5: Given exact refutation or admitted bidirectional equivalence, only those
  scoped candidates are excluded; broader/new-assumption predicates remain
  distinct; mismatched or unsupported relation receipts refuse.
- A6: Given missing batch, unknown usage, exhausted resources or an operational
  failure, output is planning-only or hard-stop with no dispatch grant.
- A7: Given shuffled equivalent inputs and cap edges, output is deterministic,
  bounded and immutable; malformed/over-cap input refuses fail-loudly.
- A8: Legacy packets/source registry/cycle refusals and old diagnostics semantics
  remain byte-preserved; no model/DB/GET/checker/network calls or auto writes.

## Ownership / verification / report

Core owns new loop/admission modules and new focused unit tests only. Read
AGENTS/handoff and full incorporated blueprint/TIP. No existing product edits
without Contractor approval. Integration performs read-only independent review,
then Main assigns repairs to Core. Use existing offline fixtures only, no new
retained scientific artifacts claiming actual execution. Run focused tests
serially; Main independently runs selectors, types, lint and build with gates
off, audits pre-turn hashes and appends handoff. Reports must list exact counts,
AC results, changed-file pins, trust ceilings, deviations and remaining gaps.

## Exclusions and truthful ceiling

No live/model/API/forest/DB experiment, browser, production diagnostics root,
Git/billing/deploy/install/migration, new executor, source-registry-v1 edit,
historical report edit or reinterpretation. No global LRC14/15 establishment,
formal proof, novelty or successful live E2E. Pure task planning is useful but
does not close R5 execution or R8/R12 production ingress. Those remain explicit.
