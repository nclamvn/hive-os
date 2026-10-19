# Eight-case proof audit — frozen prospective protocol

Preparation date: 2026-10-10 (Asia/Ho_Chi_Minh).
Mode: METHOD_EVALUATION_PREPARATION. Execution NOT_AUTHORIZED by this document.

## Question and boundary

Does the existing thin HIVE workflow improve identification/localization of a
substantive mathematical error, or reduce real review effort, relative to the
same strong LLM with the same tools and allocated resources?

This corpus is a small researcher-authored structural CALIBRATION, not a hidden
FrontierMath set, independent expert benchmark, novel research or research-level
capability score. Its motifs came from the visible092 reconstruction. The current
Codex curator created and knows the answer key. Training exposure is unknown.
Basic claims intentionally have tractable truth conditions; a ceiling result
would mean this corpus does not discriminate the workflows, not that a harder
corpus is automatically authorized. No source theorem is being re-certified.

These are constructed controls, not naturally sampled researcher mistakes.
Some faulty inferences are conspicuous and the writing itself can supply cues.
A success here establishes only performance on these exact inputs; difficulty,
representativeness and independence of the cases are not established.

## Corpus and custody

Reviewer input: artifacts/research/tip093/reviewer-input.json, exactly8 IDs with
only id/target/proof. Each is self-contained and fits the existing manual UI.
Reference: artifacts/research/tip093/gold.json,4VALID/4INVALID_PROOF.
At least one invalid submitted proof has a TRUE target. Labels concern the
submitted argument, not merely the truth of its conclusion.

The reference packet includes full elementary written justifications, exact
counterexamples, permitted repairs/refutations and explicit machine-check scope.
It does not rely on an open geometric conjecture or a merely likely label.
The small verify.py replay verifies arithmetic and finite witnesses; universal
measurable-family/quantifier statements remain written mathematical arguments,
not Lean/kernel certificates. All references must be inspected before dispatch.

Input/gold separation is a LOCAL DATA convention, not access control. A future
run must supply ONLY one input dossier per fresh context, no gold, protocol,
answer count, other-case texts, metadata, prior092 notes or grader feedback.
Cases share motifs; sending all8 together would leak cross-case hints and fail
the intended isolation. No agent can be both answer-key curator and an
independent-blind solver/referee merely by changing its role name.

The prep manifest identifies frozen bytes, not truth. Any later mathematical
correction creates a preserved successor with explicit owner routing BEFORE
dispatch; no failed case may be quietly replaced.

## Common first request and output

Both arms receive exactly the SAME first mathematical request below, followed
by one dossier's target and proof. They are not asked to solve a different task.

> Assess the supplied mathematical proof as written under exactly its stated
> hypotheses. Decide SUPPORTED, REJECTED or UNRESOLVED. A true conclusion does
> not make an invalid argument valid. If rejecting, pinpoint a substantive step
> and supply a rigorous obstruction or counterexample where possible. If the
> target is false, refute it instead of silently weakening it. If supporting,
> explain the key logical dependencies. Any corrected argument must keep the
> original target and hypotheses, or explicitly label its extra assumptions.
> Do not fabricate tool results or claim formal certification. Use permitted
> tools only for mathematical checks, never to read answer keys or other cases.
> Before finalizing, self-check your verdict, every witness against the stated
> premises, and any proposed revision against the unchanged target.
> Return the common JSON shape described below.

Common data shape (type illustration, not a submitted answer):

    {
      "verdict": "SUPPORTED|REJECTED|UNRESOLVED",
      "targetDisposition": "TRUE|FALSE|NOT_ESTABLISHED",
      "reasoning": "mathematical assessment",
      "issue": {"step": "S1/S2/... or null", "explanation": "text or null"},
      "witness": "exact counterexample/checkable obstruction or null",
      "revision": "corrected proof or explicit conditional statement or null",
      "unresolvedObligation": "specific remaining step or null",
      "toolEvidence": "actual commands/results or null"
    }

A future transport may require a stricter machine schema, but must not add
different substantive prompts to the two arms or silently repair invalid output.
No grading feedback may reach a solver before its final submission is frozen.

## Matched arms — proposal, not a dispatch grant

- A: strong direct LLM. First request includes self-check. It may use its
  remaining requests for focused self-review and correction; do not make it a
  deliberately weak one-shot baseline.
- B: same primary request through the thin HIVE procedure. An additional
  separate-context critic is allowed only for a concrete uncertainty, failure
  or missing step; a revision only in response to a substantive objection.
  No default swarm, compulsory approval vote or style rewrite.
- The two arms have the SAME requested model/settings, dossier, source access,
  available standard-library math tools, output limit and allocated request/time
  allowance. B does not get hidden reference certificates or richer literature.
  Tool use is optional for BOTH; neither arm gets the answer-key verifier.
- No extra attempts after timeout, malformed output, tool failure or apparent
  wrong answer. Failed/incomplete pipelines stay in the fixed denominator.
  Keep first and final results separately; a lost final does not inherit a draft.
- Fresh context for EACH case/arm. Neither arm sees the other arm or other cases.
  Alternate which arm runs first by fixed case parity; identical case order.
  Actual cache warmth, backend identity and inference compute may still differ.

Suggested envelope for a LATER explicitly approved run: max3 mathematical
requests/case/arm; per case/arm240s aggregate (first<=120s, each optional<=60s),
including allowed tool time; <=1200 words per response; at most48 mathematical
requests across16 fixed case-arms, no retries. Sequential upper allocation64min;
overall90min including local adjudication/report, with remaining clock always
taking precedence. Both arms get at most2 stdlib computation calls of<=15s each
within their240s allowance. A stopped run reports partials rather than extending
the cap. These are proposed ceilings, not currently active resources/authority.

No paid API is included. Subscription execution requires fresh direct execution
approval and approval of its precise payload/recipient where required. Markdown
does not bypass runtime auth/host source boundaries or activate existing excluded
execution lanes. If matched backend settings/tools cannot be established, report
the confound; do not call it an exact compute-matched comparison.

## Scoring frozen BEFORE execution

Score each first/final submission separately, preserving raw bytes.

1. Verdict: for each4 invalid proofs count false acceptance (SUPPORTED),
   correct rejection (REJECTED), explicit abstention (UNRESOLVED) and missing/
   invalid transport separately. For each4 valid proofs count correct support,
   false rejection, abstention and missing/invalid transport separately.
   An all-abstain or all-reject policy cannot win on safety alone.
2. Localization:0/1 on each invalid proof. Requires the reference substantive
   defect or an equally decisive alternative, not style or generic uncertainty.
   Naming an S-number without explaining its invalid inference scores0.
3. Decisive evidence:0/1 on each invalid proof. A counterexample must satisfy
   ALL original premises and actually contradict the submitted step/target.
   For the true-target invalid proof, refuting the target scores0; exposing its
   faulty witness or inference can score1.
4. Disposition/repair:0/1 on invalid proofs. A correct same-target repair where
   the target is true, or a rigorous refutation with no pretend repair where
   the target is false. Added hypotheses or a different target must be labeled
   CONDITIONAL/NEW_STATEMENT and do not count as original-target repair.
5. Support adequacy:0/1 on valid proofs. A correct verdict must have meaningful
   supporting reasoning consistent with the reference; an unsupported vote is
   not a proof audit. Do not penalize a valid proof for hypothetical unstated
   stronger hypotheses.
6. Scope honesty: record each invented receipt, imported unauthorized premise,
   false formal/whole-Kakeya claim, silent target switch or claim that finite
   samples establish a universal assertion. Such claims invalidate the relevant
   claimed evidence/repair; preserve an otherwise correct verdict separately.

Do NOT collapse these into one promotional percentage. Report the four-case
valid and invalid denominators, usable submission counts, abstentions/failures,
and exactly which case differences were substantively added after first drafts.
Verdict counts can be computed mechanically against the key; reasoning/repair
needs inspection against the written reference, not string matching or votes.
Ambiguous adjudication is UNASSESSED, not automatically PASS.

Mask method labels for substantive adjudication when the grader is genuinely
separate from routing; if the same curator/operator assesses both arms, disclose
that it is NOT independently blinded grading. Another context of the same model
family is not an independent expert. No judge model is automatically authorized
or included in this preparation.

## Resources / human-effort metric

Retain actual prompt/output bytes, requested settings, turn counts, failures,
wall-clock spans, optional stage reasons, tool commands/results and known usage.
Requested model identity is not authenticated backend identity. Missing usage is
UNKNOWN, not zero; reasoning tokens are not added again to output totals.
Allocated caps do not imply token-matched compute or equal monetary spend.

Human effort is UNKNOWN unless a real human participant actually reviews the
packets under a fixed task and records time/interventions. Codex runtime, fewer
clicks, operator guesses or AI judging time do not measure human minutes.
With no human participant, this pilot can report reliability/resource outcomes,
but CANNOT establish reduced human review effort.

## Prospective decision / stop

These8 deliberately selected controls can diagnose behavior and motivate a
later study; they cannot establish statistical/general research superiority.

- If both arms already support/reject/localize every case, report CEILING/TIE;
  stop. No posthoc harder replacement to manufacture an advantage.
- If B adds correct localization/evidence on at least2 invalid cases over A,
  while introducing no additional false rejection/unsupported evidence on valid
  cases and staying within the same allocation, report a NARROW PILOT SIGNAL,
  not a confirmed advantage. Investigate reproducibility before investment.
- If B adds no reliable finding and costs more, do not expand mandatory critics;
  keep the simplest primary-first workflow.
- A claimed effort saving requires actually measured human data, regardless of
  mathematical scores. No human data means no conclusion on that outcome.

Current authorized step ends when input/key/rules are prepared and verified.
No A/B run, UI automation, new product feature or new research campaign follows
automatically. Preserve the previous092 result and the no-win086/088 evidence.
