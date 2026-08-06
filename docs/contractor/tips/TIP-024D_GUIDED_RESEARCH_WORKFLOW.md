# TIP-024D — Guided Research Workflow & Worker Activation

Status: `IMPLEMENTED — ACTIVATION REQUIRES RUNTIME CREDENTIALS`

## Objective

Turn governed research from a technical job-submission screen into a usable
enterprise workflow. An operator must always know what to enter, what the
system is doing, who acts next, and whether the result is ready for authoring.

## Product contract

The primary path contains only:

1. Mission and optional target document.
2. A falsifiable research question.
3. Scope and exclusion criteria.
4. One action that assigns the dossier to a worker.

Source domains, query plans, provider identity, source ceilings and primary
source requirements remain available under advanced controls. If no explicit
query plan is supplied, the bounded research question becomes the first query.

The status rail is derived from retained state, never simulated:

| Stage | Durable state |
| --- | --- |
| Define brief | no run yet |
| Collect evidence | `QUEUED`, `RUNNING` |
| Independent review | `AWAITING_REVIEW`, `REJECTED` |
| Approved dossier | `APPROVED` |

Active pages refresh every five seconds while work is queued or running. Each
dossier exposes its latest update and a plain-language next action. A queued
job does not imply that a worker is healthy.

## Worker boundary

The release pipeline now publishes a distinct `hiveos-staging-worker` image.
It runs as the unprivileged `node` user and uses the same immutable source
revision as the web image. It does not receive migration credentials or an
application listening port.

Worker startup fails closed unless:

- one organization and one service actor are explicitly bound;
- at least one adapter is enabled;
- the OpenAI adapter has a runtime API key when enabled;
- the Docker sandbox has a digest-pinned registry when enabled.

The worker identity is a credentialless `SERVICE` principal. Database guards
deny authentication Accounts/Sessions, administrative memberships and broad
scoped roles even if an operator or later application path attempts to assign
them. Provisioning is explicit, idempotent and attributed to a human
Owner/Admin in the append-only audit ledger.

OpenAI API credentials are read only by the worker. They are not accepted by
the web form and are not retained in command, audit, source or finding data.

## Acceptance gates

- Guided form works without an explicit query plan.
- Advanced source and computation contracts are collapsed by default.
- `QUEUED` and `RUNNING` dossiers expose live refresh and an honest next action.
- Review remains separation-of-duties protected.
- Approved dossiers link into the authoring surface for the same Mission.
- Worker image is built separately, runs non-root, and is published by the
  staging image workflow.
- Activation and rollback instructions are reproducible without committing a
  credential.

Managed staging is not considered worker-active until the activation checks in
`docs/operations/TIP-024D_RESEARCH_WORKER_ACTIVATION.md` pass.
