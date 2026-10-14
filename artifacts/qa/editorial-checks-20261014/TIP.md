# Editorial checker precision — scoped implementation

Owner requests false-positive fixes, separation of content vs style, browser QA,
lean core and no deploy. Existing PDF/button/QA edits must remain intact. No new
LLM, workflow gate, dependency, DB migration or rewrite of historical reports.

## Acceptance
1. Existing UAV B_FINAL content: explicitly user-attributed1000ha and technical
   absolute/relative accuracy do not produce incorrect warnings. Narrow local
   handling only; an attributed input clause must NOT exempt an unrelated numeric
   performance claim elsewhere or after punctuation/conjunction. EN/VI cases.
2. Negated guarantees are not unconditional guarantees; actual positive certainty
   and unsupported measurements remain reviewable. Test mixed positive/negative
   clauses, technical phrase plus guarantee, decimal/thousands/percent units.
3. Style (dashes, formulaic prose, dense paragraphs) is advisory, not blocker and
   does not lower content-check score/status. AI-authorship disclosure is not by
   itself a content error; don't incentivize concealment. Broken citations, empty
   required sections and raw tool traces remain blockers. Unknown issue codes
   conservatively count as content. Keep strict existing report compatibility.
4. UI EN/VI clearly separates content/structure findings and style advice, labels
   score/check as heuristic not factual validation, and reflects current rules for
   old documents without modifying immutable historical reports. Historical scores
   labeled as recorded at save. List/editor/server export must not disagree about
   old style-only blockers; recompute current checks for export with actual doc type.
5. Regression tests include export fail-closed content cases/style-only allowed,
   old report compatibility, current UAV draft/final, no broadly ignored sentences.
   Typecheck/scoped lint/focused tests; Contractor verifies live browser positive
   and negative edits without saving synthetic claims into the real proposal.

Decision: no new report schema is needed if category can be derived from issue
code. No full build for this scope unless local compilation exposes a need.
Builder submits completion; main independently inspects code and live UI.
