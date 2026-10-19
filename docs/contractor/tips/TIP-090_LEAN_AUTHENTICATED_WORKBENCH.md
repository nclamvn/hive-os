# TIP-090 — authenticated lean research workbench

Date: 2026-10-09. Priority: P1. Depends on accepted TIP089.
Root: LEAN_AUTHENTICATED_WORKBENCH_090. Mode: ENGINEERING_UI_INTEGRATION.
Owner routes the proposed UI integration with “triển khai bước tiếp thep”, then
explicitly chooses “Chỉ tích hợp UI trước”. No fresh model inference is authorized.
Predecessor TIP089 and pilot088 records, failures and grants stay preserved.

## Context / decision

Working directory /Users/os/hiveos. Reuse executeLeanResearch, installed core-v3
adapters, session/workspace authorization, WorkspaceShell, Button and MathText.
The current lrc-demo is read-only; do not turn it into a campaign dispatcher.
The smallest usable integration is a sibling /w/[workspaceSlug]/research/lean
workbench and a thin authenticated server action. Inputs are user-supplied model
outputs, not canned solver responses. This is a manual bridge, NOT an automatic
LLM transport or evidence of autonomous mathematical discovery.

Builder focused scan established existing controlled workers cannot be treated as
live subscription inference. Owner selected UI-only; no extra RRI/approval round
or new framework is needed. Contractor designs/reviews; Builder implements.

## Requirements and acceptance criteria

R1 Actual entry point. Given an authenticated workspace member, the new page and
links from research and lrc-demo expose a usable problem/primary-output form.
Submitting invokes executeLeanResearch on the server, not browser simulation or
an imported CLI script. Page and EVERY action enforce current session, workspace
membership/capability and development/test environment independently. VIEWER
cannot execute. Unknown workspace/auth failures reveal no workspace data.

R2 Lean operation. Given raw primary JSON and a problem, keep primary-first
behavior. Capture the first missing role's exact core-generated prompt as waiting
for manual input, not a dispatched model request. Only concrete core-recognized
gaps expose focused critic; only a concrete REPAIR exposes a repair input. A
verified scope/no-gap/NO_CHANGE/refutation must not demand ceremonial roles.
Optional malformed/missing/rejected output cannot erase useful primary evidence.
Distinguish imported role outputs from awaiting, never-invoked LLM requests.

R3 Bounded tool checking. Optionally select one of the FOUR existing static exact
adapters and bounded JSON input. Build the engineering contract/config on host;
client cannot supply host grant, provider, receipt, usage or release authority.
Show normalized checked predicate/input and exact checked scope separately from
the user's prose statement. No implication that their semantic alignment, an
arbitrary proof, global theorem, novelty or external acceptance has been verified.
Missing/incompatible scope remains unverified. No new checker/Lean installation.

R4 Usable truthful UI. Reuse design tokens and typography, VI/EN, safe MathText,
labels, keyboard focus and responsive single-column flow. One clear input area
and ordered result/next-step area; no default swarm, gate dashboard or fake
progress animation. Blank initial problem/output; examples only as labelled
schema help. Disable duplicate submit and reject stale async responses after
editing problem/input; changing primary/context invalidates stale secondary
inputs/results. Errors are sanitized with clear retry/input guidance.

R5 Evidence and provenance. Preserve raw imported call outputs and original
draft in response, expose observed scope/gaps/secondary failures, UNKNOWN usage.
Provide explicit copy-prompt and download-JSON operations. Download records
manual supplied-output origin, no live LLM transport, no independently established
source authority and no durable DB job. Session state resets on refresh; no
localStorage authority/global mutable run registry. Do not silently save to DB.

R6 Verification/preservation. Ordinary early type/lint/focused real-core and
mocked-auth boundary tests; Main actual visible browser verification of no-gap,
exact-check, targeted repair, invalid optional output and invalid input. Existing
101 core checks must still pass. Tests/E2E are engineering evidence, not fresh
AI solves, benchmark results or new LRC results. Keep historical campaign/core
source bundles, legacy acceptance, oldp139/R3 and frozen088 intact.

## Constraints / stop

No model/API/CLI solve, API spending, provider enablement, account change, DB
mutation, schema/dependency install, source reseal, production build, Git push or
campaign. Read the relevant installed Next16 guides before app code. Preserve all
pre-existing dirty changes. Use current dev server/.next; no project shadow or
new distDir. Each validation <=120s; combined developer validation <=600s;
visible browser verification <=15min. Stop at R1–R6 completion or a named blocker.
If a fresh model run is later desired, it needs separate direct routing, not a
fixture renamed to inference. No automatic research after closure.

## Report

Builder sends changed files, acceptance outcomes, exact commands/timings, defects,
deviations and operational limits to Contractor. Main writes ONE completion
report with coverage, actual browser checks, build/type/lint/test status and any
unmet obligation. No extra report/config family or gate ceremony.
