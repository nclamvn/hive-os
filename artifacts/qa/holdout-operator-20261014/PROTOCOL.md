# Pre-registered holdout operator pilot

Status: READY, NOT RUN. Frozen 2026-10-14 before any pilot output.

## Question

On comparable source-grounded update/handover tasks, does HIVE's existing
revision, citation, preview and export surface reduce *measured operator work or
avoidable omissions* without degrading content accuracy compared with ordinary
LLM/chat plus generic files?

It does **not** ask whether HIVE's model is more intelligent. The same Codex
model/settings available to each participant must be used in both arms; model
identity, tokens and price are recorded as unknown unless telemetry exists.

## Arms and parity

| Arm A — generic | Arm B — HIVE |
| --- | --- |
| Same Codex model, source pack, task, 20-minute cap/case and one self-review/revision. | Same Codex model, source pack, task, 20-minute cap/case and one self-review/revision. |
| Ordinary local reader/editor and ordinary chat/file tools permitted. | Existing HIVE Evidence, Authoring, citation, revision, update preview and export only; no code patching. |
| Final text plus source references retained. | Final saved HIVE revision plus source references retained. |

Neither arm may browse for extra facts, contact the agency, create a vendor claim,
or reuse another arm's output. The RFPs are historical. The operator may say an
item is unknown; no penalty applies for refusing to invent a vendor fact.

## Two checkpoint task per case

**ERP:** at checkpoint 1, use RFP plus Addenda 1–3 to write a two-section
readiness note (controlling timeline/requirements; unknowns and next actions).
At checkpoint 2, add Addendum 4 and revise the same note, preserving unchanged
obligations and adding a dated impact log.

**JMS:** at checkpoint 1, use the RFP to prepare the same two-section readiness
note. At checkpoint 2, add Addendum 1 and the award notice; revise into a
handover note that distinguishes the original solicitation, the current award
fact, and remaining/unknown actions.

Every sentence making a factual procurement claim must name its source and page.
No actual vendor proposal is required or permitted.

## Counterbalancing and blinding

Recruit at least two operators who have basic document/LLM proficiency but were
not authors of the rubric. Randomly assign one sequence per operator:

| Sequence | Case 1 | Case 2 |
| --- | --- | --- |
| X | ERP in HIVE; JMS generic | — |
| Y | JMS in HIVE; ERP generic | — |

The second operator takes the opposite case/arm pairing. Counterbalance start arm
and case order across additional operators. Before scoring, a custodian labels
each final only `X` or `Y`; the assessor receives final text, citations and
receipts but not arm, operator, elapsed time or product screens. The assessor
uses the locked rubric without revising it.

## Measures

Primary outcomes, reported per case and arm:

1. **Critical omissions/fabrications** — rubric items marked FAIL, plus any
   invented vendor fact, false current procurement state, or unsupported submission
   assertion.
2. **Requirement accuracy** — sum of 10 locked checks (0/1/2 each).
3. **Active operator seconds** — stopwatch from first task action to final
   artifact, excluding declared breaks but including source reading, prompt
   preparation, review, warning triage and saving/exporting.
4. **Traceability completion** — source/page locator for factual claims,
   preserved baseline/final, update log, and export/revision receipt where the
   arm can produce one.

Secondary observations: misleading product warnings, UI mistakes, need to copy
information manually, unintended edits, save/export failure and participant
confidence (1–5). Agent wall-clock, token count and tool calls are not human-time
measures.

## Decision rule and limits

Call a result only a *promising operational signal* if HIVE has no extra critical
error, no lower median rubric score, and at least 30% lower **measured** median
active operator time across a counterbalanced sample of at least four completed
operator-case pairs. Otherwise report a tie, loss or insufficient evidence.

Never call this an LLM benchmark, causal productivity proof or commercial ROI
study. A failed product action stays in the record; no mid-study repair or rerun
to seek a win. Stop a case at 20 active minutes, preserve incomplete output and
record it as such.
