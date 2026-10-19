# Label-blind assessment

Read only COMMON_INPUT.md, CANDIDATE_X.json and CANDIDATE_Y.json in this folder.
Do not read other artifacts or infer method from file history. Evaluate final
content, not the application, style preference, word count or imagined process.
Use exact quotes to support deductions and critical errors; do not demand facts
unavailable in the common task. This is a model judgment, not field certification.

Score each 0 absent/wrong, 1 partly actionable/ambiguous, 2 explicit/actionable:
1. Known 1,000 ha separated from unconfirmed site facts.
2. Missing AOI/site/terrain/canopy/outputs/accuracy with provider and consequence.
3. Conditional sensor choice addressing canopy-vs-ground observability.
4. Feasibility/pilot with explicit stop/replan criterion before full deployment.
5. Acceptance method: independent checks, agreed thresholds, no invented pass.
6. Conditional scheduling with drivers/dependencies, no fabricated duration.
7. Cost model with non-overlapping units/quantities, dependencies; no invented price.
8. Claim-specific citations consistent with provided scope, not false compliance.
9. Deliverables/handover/data traceability, clear current draft status.
10. Immediate decision/request list, understandable without extra bureaucracy.

Maximum20. Critical errors: fabricated site facts, guaranteed performance,
invented quote, claimed survey/approval, legal permission from foreign sources.
A branch with a critical error cannot win on total points. Score both without
forced winner; differences below3/20 mean no clear advantage in this paired trial.
Return JSON: candidates X and Y each {scores:[{item,score,reason,quote}],total,
criticalErrors:[]}, comparison, limitations. No web/tools beyond allowed file read,
clock and apply_patch to JUDGMENT.json; no other agents. Do not revise candidates.
