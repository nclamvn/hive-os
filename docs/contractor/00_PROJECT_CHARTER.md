# Project Charter — HIVE OS

## Mission

Build a premium, easy-to-use web operating system that lets a non-expert submit a research, analysis, build, or evaluation mission in natural language while the system handles methodology selection, provenance, claim states, model-role separation, verification, escalation, and release governance.

## Product thesis

The user should learn **how to use HIVE**, not the internal frameworks. Refinery, registry-hygiene, Vibecode, HIVE-Research, model adapters, verifiers, and corruption tests become internal system services.

## Core invariant

Every public or operational assertion must be traceable to:

`input/source → extraction or decision → claim state → transformation → verification → release scope`

## Non-goals for v0.1

- Fully autonomous scientific discovery without human approval.
- Formal theorem proving for every domain.
- Replacing domain experts in regulated or safety-critical decisions.
- A generic chatbot UI with hidden unstructured agent behavior.
- A marketplace of hundreds of skills before the kernel is trustworthy.

## Success definition for v0.1

A new user can create a mission, approve a generated contract, inspect claims and evidence, see exact workflow state, respond to an escalation, review verification results, and issue a governed release without knowing the names Refinery, SOT, TIP, RRI, or corruption suite.
