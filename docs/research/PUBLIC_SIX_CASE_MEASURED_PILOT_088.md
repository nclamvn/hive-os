# TIP088 — first attempt stopped; comparison not completed

2026-10-09. Status: EXECUTION_ALLOWANCE_CONSUMED / COMPARISON_INCOMPLETE.
No mathematical score or method advantage established. This is the truthful
checkpoint for the approved public pilot, not successful comparative acceptance.

## What was implemented and frozen before dispatch

Owner approved the proposed six-case source route with “tốt triển khai ngay”.
TIP087 source routing is resolved; its original evidence/history remains intact.
TIP088, local grading rubric, six statements and grader-only references were
saved before any mathematical dispatch. Selection was deterministic first2 rows,
not based on solver success:

| ID | Source case | Task |
| --- | --- | --- |
| C01 | ArXivMath August2026 #1, Victor Armegioiu | Delayed 2D Navier–Stokes dissipation exponent |
| C02 | ArXivMath August2026 #2, Ankan Sadhu | Maximum hexary5-tuple packing |
| C03 | BrokenArXiv August2026 #1, Paolo Leonetti | One-sided non-symmetric convexity |
| C04 | BrokenArXiv August2026 #2, Saeid Alikhani/Max Griswold | Integer domination polynomial roots |
| C05 | IMO-ProofBench v2 PB-Advanced-001 | Perfect-power counting divisibility |
| C06 | IMO-ProofBench v2 PB-Advanced-002 | Directed-set dynamics/orbit bound |

Sources: [ArXivMath](https://huggingface.co/datasets/MathArena/arxivmath-0826),
[BrokenArXiv](https://huggingface.co/datasets/MathArena/brokenarxiv-0826),
[IMO-ProofBench](https://github.com/google-deepmind/superhuman/tree/main/imobench).
Selected MathArena text/reference data retain CC-BY-SA4.0 and author attribution;
IMO material retains CC-BY4.0 and Google DeepMind credit. Full source IDs/versions
are in reference-cases.json. Dataset solutions were read by Main only, not sent
to solver/critic. Recent public material is not proven unseen in training.

Thin stdlib runner: scripts/research/public_pilot_088.py. No application queue,
new framework, product UI, build, install, config/auth change or paid API. Actual
Main final15/15 focused tests PASS, with tiny local Python children and mocked
Codex events. These are engineering checks, not mathematical successes. Earlier
13-test reruns are not added to15 as new controls. Builder fixed unbounded tail
capture before dispatch; Main reviewed the bounded nonblocking drain and process
cleanup. No code changed after the actual attempt started.

## Actual run and retained failure

ONE invocation, started2026-10-09T08:22:41.626677UTC. Requested existing configured
gpt-6.1-sol/high via subscription-authenticated Codex CLI0.160.0; effective backend
identity unknown. Ephemeral clean cwd, explicit replay design, child read-only
sandbox, web disabled, allowlisted environment without provider keys. Normal
platform-reviewed host permission, no unsafe sandbox bypass. A1/B1 prompts were
identical, containing only C01–C06 statements and equal instructions.

| Observation | A1 direct | B1 solver |
| --- | --- | --- |
| Allocated call timeout | 240s | 240s |
| Observed child wall | 240.019045s | 240.018912s |
| Stop reason / exit | timeout / -15 | timeout / -15 |
| Started thread and turn | yes | yes |
| Completed turn | no | no |
| Completed mathematical answer | none | none |
| Returned text | empty | 19-word introductory commentary only |
| Actual token receipt | UNKNOWN | UNKNOWN |
| Tool/contamination event observed | none | none |
| Group cleanup | TERM sent, leader reaped | TERM sent, leader reaped |

No stderr errors or explicit turn.failed events were observed. This does not
prove the cause was mathematical difficulty; remote queue/latency and internal
reasoning time are not separately observable. Both turns began, so this is not
the earlier startupEPERM. The current logs cannot distinguish the remaining
causes. Normal worker cleanup completed including stdin writer; SIGKILL not
needed. Local child wall total480.037957s reflects parallel children, not480s
elapsed session time or model compute time.

Runner stopped after the first stage pair as designed. A2/A3/B2/B3 and shared
assessor were NOT invoked. Six planned cases remain in the denominator; all six
are UNASSESSED for both arms, not assigned0 for mathematical inability. There
is no completed critic loop, repair measurement, paired quality comparison or
token-matched conclusion. Missing usage is UNKNOWN, not zero or no consumption:
the requests may have consumed subscription allowance without returning a final
usage receipt. No additional paid provider API was used.

Raw prompts/events/stderr/responses/receipts and measurement.json are retained
under artifacts/research/pilot088/attempt1 (~40KiB). No retries, easy substitutes,
unmetered math agents, source-answer feedback or post-failure scoring.

## Practical lesson / next proposed routing, not executed

Main chose to batch six heterogeneous research/olympiad cases into a single240s
call per stage. That economical batching made the failure poorly diagnostic:
without intermediate answers we cannot identify which case blocked completion.
This design, not a proved mathematical weakness of either method, needs repair.
Do not add gates/frameworks or raise a claimed score. Proposed human revision:
keep exactly these six frozen cases, schedule one case per call with explicit
early answer/status and bounded proof output, and agree total calls/time before
any rerun. That increases request count and changes the resource contract, so it
is NOT silently authorized or executed here. Do not select only easierC05 to
produce a favorable showcase, or claim this public test is official/blind.

Scientific comparison remains INCOMPLETE. This attempt is ended; its grant is
consumed. No next attempt/budget increase or independent mathematical campaign
follows automatically. Oldp139/R3 attempts, gates and unaccepted state unchanged.
UI/dev server left untouched. No Git/billing/deploy.

## Preservation / cleanup

Owned empty scratch /private/tmp/codex-tmp-pilot088-20261009.hXZRcq was inspected
empty and removed withrmdir after workers exited. Mock-test temporary directories
automatically removed. No project copy, extra Next distDir, dependency install,
Docker build or material user-file deletion.

Frozen hashes:

- TIP088 d1b1be3b018a4be0f5f208d65e5918a74a6ee02e94ad269e7fac5f3e4c567e54
- solver cases147d952360c96a0a2ee8c67b68f9a3dd7704f18d7d247abd6563470a640cff20
- references77709b6c024b8261db4822ad1504e960523b6cc0d5a603fa0307c5732aef4420
- runner839d4ce3618daab71f227e71c9b7c83b68f38e3a2ede99d2a5c24323ad0e3817
- tests673fa053070a29d0deaec4cd2de6d21eaca147f5a26c46f088ad6eaac35288a9
