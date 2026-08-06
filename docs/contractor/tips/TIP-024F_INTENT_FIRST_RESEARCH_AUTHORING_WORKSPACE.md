# TIP-024F — Intent-first Research and Authoring Workspace

Status: Implemented, local verification complete

## Objective

Replace the operator-facing research control plane with a short, plain-language
path from intent to governed work. A normal user states the outcome once and
starts. HIVE OS derives the bounded research brief, query plan, source ceiling
and language policy without asking the user to configure infrastructure.

## User outcome

The default workspace presents one required field:

> What do you want to finish?

The current Mission is selected automatically. Mission and target document can
be changed in one optional context disclosure. One primary action starts the
work. Status and the next human action remain visible after submission.

## Mandatory invariants

1. The happy path has exactly one user-authored required value: the intended
   outcome.
2. The server, not the browser, supplies the default scope, bilingual query
   policy, provider, model and source ceiling.
3. Existing Mission authorization, durable command, job, audit and research
   integrity contracts remain unchanged.
4. Runtime, entrypoint, immutable input reference and SHA-256 controls are not
   rendered in the default workspace.
5. Expert source and computation controls require an explicit transition to
   `advanced=1`.
6. Simplifying the interface does not imply that generated findings are
   approved. Independent review and the approved-research authoring bridge
   remain mandatory.
7. Vietnamese and English use the same information hierarchy and interaction
   count.

## Acceptance criteria

| ID | Criterion |
| --- | --- |
| INTENT-01 | An authorized user starts research by entering only an outcome and pressing one button |
| INTENT-02 | The server derives a deterministic safe scope when none is supplied |
| INTENT-03 | The current Mission is preselected; document attachment is optional |
| INTENT-04 | Provider, model, runtime, entrypoint and digests are absent from the default UI |
| INTENT-05 | Expert controls remain reachable through one quiet, explicit transition |
| INTENT-06 | Active status, interruption and next action remain honestly reported |
| INTENT-07 | The layout has no horizontal overflow at a 390 px viewport |
| INTENT-08 | The default workspace has no serious or critical WCAG 2 A/AA violations |

## Interaction budget

- Typical start: one text entry, one click.
- Change Mission or attach a document: one disclosure, one selection, one
  click.
- Expert computation: one explicit mode transition before technical controls
  exist in the page.

## Explicit non-goals

- This TIP does not weaken research review, provenance or authoring gates.
- This TIP does not activate or fund a model/provider adapter.
- This TIP does not infer missing business authority from a natural-language
  request.
