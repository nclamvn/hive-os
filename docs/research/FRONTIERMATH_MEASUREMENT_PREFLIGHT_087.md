# FrontierMath — resource/source preflight

2026-10-09 · TIP087 · **P1/P2 complete; P3 awaiting source routing.**
The next A/B measurement has NOT started. Method advantage remains unestablished.

## Concrete gap closed

TIP086 could count requests and arithmetic calls but could not observe token
usage through the collaboration interface. The existing local Codex CLI can
instead return provider-reported usage in its JSONL `turn.completed` event.
[Official non-interactive documentation](https://learn.chatgpt.com/docs/non-interactive-mode)
documents this transport and saved authentication. Main fetched the actual page,
then checked the installed CLI/adapters; this is not a capability claim from a
search snippet or invented telemetry.

Actual installed CLI0.160.0 reports `Logged in using ChatGPT`. Existing user
configuration selects gpt-6.1-sol/high. The isolated smoke used those same
explicit requested settings, read-only child sandbox, disabled web search,
ephemeral session and `--ignore-user-config`, avoiding repository context and
user-configured plugins. No auth file/key was read, copied or edited. Reported
settings are requested settings; effective backend model ID was not observed.

The first host-sandbox invocation exited1 after0.040615s, with no JSON event:
`failed to initialize in-process app-server client: Operation not permitted`.
This was NOT treated as zero token use, a mathematical failure, or account expiry.

Contractor corrected its own overly broad no-permission-retry constraint and
submitted exactly the SAME read-only reply-only invocation through the provided
platform permission review, with≤59s remaining child timeout. Review allowed
execution. No danger-full-access/yolo/rules bypass, paid API or unmetered-agent
fallback was used; the failed observation is retained.

The successful actual result was:

| Observation | Actual value |
|---|---:|
| Child exit | 0 |
| Host measured subprocess seconds | 13.927107 |
| Input tokens | 13,151 |
| Cached input tokens | 9,856 |
| Cache-write input tokens | 0 |
| Output tokens | 11 |
| Reasoning-output tokens | 0 |

Observed events: one thread.started, one turn.started, one completed agent
message `FM087_TELEMETRY_OK`, one turn.completed with the above usage. No tool,
web, command execution, file-change or delegate item was observed. The smoke was
non-mathematical and intentionally trivial. Zero reasoning tokens is the returned
field **for this smoke**, not a claim about mathematical runs or hidden backend
costs. Artifact087.json contains the exact retained observed fields, not estimates.

The combined actual child time was13.967722s, below60s. The platform review and
parent work are not isolated model-inference latency. This step used the saved
subscription authentication, not a provider API key or newly purchased credits.

## What the next resource comparison can honestly measure

Use JSONL receipts for every solver/critic/repair invocation, including failed
and incomplete calls. Keep input, cached-input, cache-write, output and reasoning
fields separate; do not double-count cache or presume an undocumented billing
formula. Missing usage is UNKNOWN, not zero. Timeouts and resource refusals stay
in the outcome denominator. Stop rather than reconstructing actual usage from
word counts or another task's account-wide percentages.

Usage arrives after completion: it provides **measurement**, not proof of a hard
pre-generation token ceiling or exact token matching. Both arms need the same
predeclared invocation settings/time/request caps and reporting of actually
consumed resources. Include the separate critic's full usage in B, not just its
final solver. A complete paired mathematical evaluation still requires a frozen
dataset, shared rubric/checks and retained failures. No application queue or new
framework is needed to establish this transport capability.

## Source gap — not silently substituted

[Epoch describes Tiers1–4 as unpublished problems](https://epoch.ai/frontiermath),
while its accessible [sample collection](https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems)
publishes solutions. This session has no private Epoch dataset access. A public
Tier3 sample being new to HIVE does not establish lower training exposure.
Changing parameters alone does not establish a new mathematical difficulty.
No private access request, purchase or outside message was made.

Main presented a concise source choice to Owner:

1. Recommended: three newly authored **FrontierMath-inspired transfer questions**,
   explicitly not Epoch questions/official scores; fix statements/rubric before
   any solving, disclose template exposure and AI authorship. Independent checking
   must establish well-posedness; this is not an external-expert blind dataset.
2. Exact public Epoch samples not yet tried in HIVE, explicitly retaining public
   answer/training-exposure limits. It would be a metered public pilot, not the
   proposed less-exposed or private evaluation.

No batch has been dispatched or relabeled while this choice is pending. Private
Epoch problems or expert-supplied unpublished material would require genuine
access, not a fabricated “blind” label. The current task is partial against the
requested next comparative evaluation, despite successful technical preflight.

## Scoped acceptance and cleanup

- P1 PASS: actual saved-auth CLI reply/usage after the retained startup refusal;
  returned accounting and host time observed, not mocked.
- P2 PASS: accessible source/exposure boundaries established; low-exposure
  dataset **NOT ESTABLISHED**.
- P3 PARTIAL: truthful report/source-choice request completed, human route and
  fixed batch remain pending. No mathematical result or method win claimed.

No product code or configuration changed. Build/type/lint/unit/integration/E2E
tests and Lean NOT RUN: not relevant to this reply-only preflight. No paid API,
application DB/agent records, Git mutation, install, project copy, new Next
distDir, Docker or old p139/R3 effect. Existing dirty107 tracked paths preserved.
Disk preflight84Gi free. The ONLY small scratch directory
`/private/tmp/codex-tmp-fm087-20261009.50tmEn` was confirmed empty and removed by
`rmdir` after each invocation; no project files or dependencies were copied there.

OpenAI Docs guided verification of the existing JSONL transport; Vibecode was
kept to one TIP and this completion, not a new infrastructure stack. No solver
subagents, model migration or research campaign was started. STOP pending the
source decision; do not repeat the unmetered086 run or start an easier replacement.
