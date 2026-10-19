# HIVE OS — Enterprise Core Vision

Status: `PROPOSED FOR OWNER APPROVAL`

Recorded: `2026-07-30`

## Strategic thesis

HIVE OS will become a governed execution operating system for large
organizations before it connects external cloud infrastructure or model
providers.

The product is not a generic dashboard and not an AI chat wrapper. Its job is
to let an organization see, operate, and prove the chain:

```text
Authority → Intent → Contract → Evidence → Execution → Verification → Release
```

Infrastructure and model providers remain replaceable adapters. Organizational
authority, deterministic state, provenance, workload control, and the
enterprise interaction model are product core.

## Project classification

| Dimension  | Enterprise direction                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| Interface  | Bilingual web command surface with dense operational views                                                            |
| Data flow  | Human commands and retained evidence enter governed kernels; asynchronous workers materialize projections and exports |
| User model | Multi-organization, hierarchical units, groups, scoped roles, delegated authority, separation of duties               |
| Lifecycle  | Long-lived mission portfolios with deterministic transitions and append-only evidence                                 |
| Scale      | Large multi-tenant organizations, hot tenants, millions of ledger rows                                                |
| State      | PostgreSQL remains authoritative; projections, search and object storage are derived or retained layers               |

## Product pillars

### 1. Enterprise authority graph

Represent organization, subsidiary, business unit, department, team, portfolio,
workspace and mission as explicit scopes. Authorization is evaluated against
the actor, action, resource, scope and policy, not only one global workspace
role.

### 2. Bounded data plane

Every collection is paginated, filterable and subject to a query budget. Large
exports, indexing and projections never block an interactive web request.
Tenant isolation is enforced in the service and database layers.

### 3. Durable command plane

Business mutations have command identity, idempotency and an audit envelope.
Long-running work uses a provider-neutral job contract with retry, backpressure
and dead-letter handling. The local adapter remains available without choosing
a cloud vendor.

### 4. Governed operating surface

The primary experience is a Mission Command Graph, not a grid of decorative
cards. It exposes organizational scope, portfolio flow, blocked authority,
truth gaps, execution state and verification readiness from real records.

### 5. Enterprise lifecycle

Assignment, responsibility, service-level commitments, escalations, approval
chains, saved operational views, retention, legal hold and controlled deletion
are governed product concepts rather than external integrations.

## Primary users and loops

| User                 | Repeated operating loop                                                                |
| -------------------- | -------------------------------------------------------------------------------------- |
| Executive sponsor    | Select organizational scope → inspect portfolio exposure → open accountable decision   |
| Portfolio operator   | Triage assigned work → rebalance ownership → resolve SLA or dependency block           |
| Mission owner        | Define contract → assign obligations → govern evidence and execution → request release |
| Builder/operator     | Pull authorized work → execute → attach retained artifacts → report deviation          |
| Independent verifier | Inspect trace → run verification → record bounded conclusion                           |
| Security/audit       | Review authority, policy, access, retention and immutable event history                |

## Design direction — Mission Command Graph

### Layout

```text
┌──────────────┬────────────────────────────────────────┬───────────────┐
│ Organization │ Scope / command / saved view           │ Context       │
│ and portfolio├────────────────────────────────────────┤ inspector     │
│ navigator    │ Mission Command Graph                  │               │
│              │ Portfolio lanes, dependencies, gates   │ Authority     │
│              ├────────────────────────────────────────┤ Evidence      │
│              │ Operational grid / event chronology    │ Actions       │
└──────────────┴────────────────────────────────────────┴───────────────┘
```

- Left navigation answers “where in the organization am I operating?”
- The command canvas answers “what is moving, blocked, exposed or awaiting
  authority?”
- The inspector answers “why is this state true and what may I do next?”
- Data grids answer “which exact records match this operational question?”

### Visual identity

The existing Precision Instrument system remains authoritative:

- Vietnamese first-visit default; English available.
- System appearance first-visit default; explicit light/dark persist.
- Neutral graphite dark theme and quiet off-white light theme.
- Be Vietnam Pro for interface text, Literata only for mission theses, IBM Plex
  Mono for identifiers and trace coordinates.
- Hairline structure, open instrument bays and dense rows replace stacks of
  rounded cards.
- Color communicates state, authority or risk only.

The single expressive element is the Mission Command Graph. It uses ordered
lanes, dependency lines and state markers derived from real records. It is not
a decorative network diagram and never fabricates telemetry.

### Interaction model

- Command palette for navigation, scoped search and authorized actions.
- Persistent scope breadcrumb with organization and portfolio context.
- Keyboard-operable data grid with cursor pagination, column controls, saved
  views and bulk selection.
- Docked or drawer inspector preserves the operator's place in the grid/graph.
- Timeline and provenance modes show chronological and causal explanations.
- Motion is limited to selection transfer, dependency tracing and inspector
  transitions; reduced-motion retains every function.

## Architectural stance

Keep the modular monolith and PostgreSQL transactional authority. Add ports and
local durable adapters for jobs, projections and search. Split a deployable
service only after scale evidence establishes an independent failure or scaling
boundary.

Initial separable boundaries are:

1. execution workers;
2. search/index projection;
3. dossier/export pipeline.

No external provider, paid service, production environment or AI API is
authorized by this vision.

## Success definition

The Enterprise Core program is successful when:

1. organizational authority and separation of duties are represented and
   tested;
2. no interactive collection or export performs an unbounded read;
3. governed commands are idempotent and long work is durable;
4. the primary UI supports portfolio triage, contextual inspection and bulk
   operation without synthetic data;
5. scale certification exercises large datasets, write contention,
   multi-tenant isolation and recovery;
6. connector and AI work can attach through stable ports without changing
   governed kernel authority.
