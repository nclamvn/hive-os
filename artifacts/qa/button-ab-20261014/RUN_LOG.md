# UAV comparison execution record

User selected same current Codex model, no paid API. Inherited model/settings with
no overrides; exact model ID/token telemetry not exposed. Fresh solver contexts.

## Sequence (UTC, 2026-10-14)
- A initial dispatch anchor 02:06:45; final completion 02:08:29 (104s).
- B initial dispatch anchor 02:06:50; draft final 02:08:10.
- B draft ingested via visible UI into separate DOC-BD12906E revision2.
- Independent-context critique completed 02:09:03, no material content gaps found.
- B final revision completed 02:09:51 (181s from dispatch).
- B final saved/observed revision3 before clock read 02:10:13 (<=203s including UI).
- All eight UI section strings compared exactly equal to B_FINAL.json afterward.
- Both generation branches closed below600s; no rerun or extra solver call.

Dispatch anchors are coordinator clock records, not provider latency telemetry.
A used one solver turn; B used draft + critique + revision = three model turns.
Final model-assessor call is evaluation overhead outside both solve budgets.
Total token usage and subscription compute cost unavailable; zero paid API calls.
No claim of equal compute or provider API automation. Codex operated HIVE's UI.

## Transport and controls
Coordinator inspected A's intermediate file before final; it had invalid literal
newlines. A self-corrected JSON and shortened within its single turn before a
coordinator 'do not revise' notice arrived. No task/rubric/content repair was sent
to A. Only final response scored. Intermediate file is not a failed final response.
This unsolicited transport-stop notice is disclosed as an experimental blemish.
B draft file was ingested after final completion and verified against saved UI.
No completed predecessor proposal or A output was provided to B/reviewer.
Both final contents use965/964 whitespace-separated words including title.

Randomization via crypto.randomInt(2) returned1: X=B, Y=A. Byte-identical copies
made AFTER freezing finals. Judge was given common input + rubric + X/Y only.

## SHA-256
- A_FINAL.json: 980fbecef3d346c8ef90d122dbc081efcfe97e63c6912057bb9627e3f279f0f7
- B_DRAFT.json: 20580497ac8550d71c2c210e68dddaa6ce43fef4d60e44ab82a00b196ba21c67
- B_FINAL.json: a0b840d53ce26ebfc33cb13ab86777c33ab89c806ffb6cbbdc38135d6e7cd614

## Actual application observations (NOT content scores)
Draft revision2:26/100,3 publication blockers (em dashes),4 warnings.
Final revision3:90/100,0 blockers,2 warnings retained: user-supplied1000ha without
external citation, and 'absolute/relative' accuracy misread as certainty. Neither
warning justifies removing correct content or inventing citations. The64-point
increase is mainly punctuation compliance, NOT increased factual performance.
Source citations are declared references, not immutable SOT snapshots. No worker,
technical approval, survey execution, paid provider, deployment or mission status
transition. Old DOC-7EF4039C unchanged.

UI: http://localhost:3000/w/mathematics-pilot-lab-156de0/authoring/5f672414-4a3e-4910-817e-87d8235a4441
