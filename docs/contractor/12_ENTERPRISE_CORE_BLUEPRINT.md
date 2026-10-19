# BLUEPRINT — HIVE OS Enterprise Core

Status: `APPROVED BY OWNER`

Date: `2026-07-30`

## Goal and boundary

Build the organization, authorization, data-access, command-processing and
interaction foundations required for HIVE OS to operate as an enterprise
platform.

This Blueprint supersedes the assumption that product breadth should remain
small until cloud or AI integration. It does not supersede deterministic kernel
authority, provenance, honest-null, provider neutrality, Vietnamese/system
defaults or the modular-monolith decision.

Cloud deployment, external connectors, model APIs, billing and production
claims remain outside the authorized local product program.

## Requirements matrix

| ID      | Requirement                                                                                                   | Priority |
| ------- | ------------------------------------------------------------------------------------------------------------- | -------- |
| ENT-001 | Model organizations and nested organizational units without flattening authority into one workspace           | P0       |
| ENT-002 | Support groups and scoped grants at organization, unit, workspace and mission scope                           | P0       |
| ENT-003 | Enforce separation of duties and delegated authority in deterministic policy evaluation                       | P0       |
| ENT-004 | Preserve compatibility and provenance while migrating existing workspace memberships                          | P0       |
| ENT-005 | Enforce tenant boundaries in application queries, composite database relationships and PostgreSQL RLS         | P0       |
| ENT-006 | Replace unbounded collections with stable cursor pagination and explicit query limits                         | P0       |
| ENT-007 | Provide indexed structured search and provider-neutral full-text search ports                                 | P0       |
| ENT-008 | Give every material command an idempotency key, correlation identity and immutable outcome                    | P0       |
| ENT-009 | Run long work through a durable job, retry, backpressure and dead-letter contract                             | P0       |
| ENT-010 | Materialize expensive operational counts and portfolio projections outside request fan-out                    | P1       |
| ENT-011 | Generate large dossiers and exports asynchronously, consistently and without whole-document heap construction | P0       |
| ENT-012 | Implement assignment, responsibility, due time, SLA, escalation and configurable approval chains              | P1       |
| ENT-013 | Provide an organizational navigator, Mission Command Graph, operational grid and contextual inspector         | P0       |
| ENT-014 | Provide saved views, bulk selection/actions and a command palette constrained by authorization                | P1       |
| ENT-015 | Preserve VN/EN, system/light/dark, accessibility and responsive operation from 320 to 1600 pixels             | P0       |
| ENT-016 | Enforce retention, legal hold, archive and controlled deletion as auditable lifecycle rules                   | P1       |
| ENT-017 | Emit structured traces, metrics and slow-query evidence without inventing operational claims                  | P1       |
| ENT-018 | Certify large-data, write-heavy, hot-tenant, multi-replica, failure and recovery scenarios                    | P0       |

## Domain architecture

### Organizational authority

```text
Organization
├── OrganizationMembership
├── Group ── GroupMembership
├── OrgUnit ── OrgUnitClosure
│   ├── Portfolio
│   └── Workspace
│       └── Mission
└── ScopedGrant(subject, role, scope, validity, delegation)
```

- `Organization` is the tenant and policy boundary.
- `OrgUnit` uses an adjacency relation plus a closure table so subtree
  authorization does not require application-memory traversal.
- Existing `Workspace` becomes an operating scope within an organization.
- Existing `Membership` remains during compatibility migration, then becomes a
  workspace-scope projection of authoritative grants.
- A grant records subject, role, scope, grantor, reason, validity interval and
  optional delegation source.
- Deny and separation-of-duty rules override inherited grants.

### Authorization evaluation

```text
authorize(actor, capability, resource, commandContext)
  → resolve tenant
  → collect valid direct/group/inherited grants
  → apply resource and assurance constraints
  → apply separation-of-duty and explicit-deny rules
  → return decision + reason codes + policy version
```

The result is deterministic, testable and auditable. UI visibility is derived
from the same decision service but never replaces server enforcement.

### Query contracts

All collection ports accept:

```text
scope + filter + sort + first + after
```

and return:

```text
nodes + pageInfo(endCursor, hasNextPage) + optional exact/estimated total
```

Rules:

- default and maximum page sizes are explicit;
- sort order includes a unique tiebreaker;
- cursors are opaque and versioned;
- nested histories are independently paginated;
- exact total counts are opt-in and budgeted;
- application-memory filtering of tenant-scale collections is prohibited;
- list and export paths have automated query-count and memory ceilings.

### Command and job contracts

Every material mutation receives a command envelope:

```text
commandId, idempotencyKey, organizationId, actorId,
correlationId, expectedVersion, issuedAt, payload
```

The transactional boundary writes domain state, audit outcome and an outbox
record atomically. Workers claim jobs with leases, bounded retries and
idempotent handlers. Poisoned jobs enter a dead-letter state that requires an
authorized disposition.

The initial durable adapter uses PostgreSQL so the local product remains
self-contained. The port permits later replacement without changing kernel
semantics.

### Projections and search

- Portfolio and Control Room metrics use incremental projection tables.
- Projection watermarks expose freshness honestly.
- Search indexes only authorized, normalized object descriptors and retained
  text; every result is authorization-filtered before disclosure.
- PostgreSQL full-text search is the first local adapter. An external search
  engine is not required by this Blueprint.

### Export and lifecycle

- Export request captures an authoritative mission/version boundary.
- A durable job streams cursor-bounded sections to object storage.
- A canonical manifest hashes each part and the completed bundle.
- Failure is resumable and never publishes an incomplete bundle.
- Retention policy does not itself delete data: lifecycle evaluation creates a
  governed candidate, checks legal holds, requests authority and records the
  disposition.
- Direct cascading deletion of governed ledgers is prohibited at the tenant
  boundary.

## Enterprise interaction architecture

### Global shell

The shell gains three explicit context layers:

1. organization and unit scope;
2. portfolio/workspace scope;
3. object/action context.

The sidebar becomes an organizational navigator rather than a long menu.
Product modules move to a compact mode switcher or command palette. The header
contains scope breadcrumb, saved-view context, search/command trigger and the
existing icon-only locale/theme controls.

### Mission Command Graph

The graph has deterministic lanes:

```text
Intake | Contract | Truth | Execution | Verification | Release
```

Rows represent portfolios or missions. Nodes represent real governed states;
dependency edges represent stored relationships; gaps are explicit empty or
blocked nodes. Operators can:

- expand/collapse portfolio hierarchy;
- filter by owner, assurance, state, risk, SLA and evidence gap;
- trace one mission from contract to release;
- select a node to open the contextual inspector;
- switch between graph, grid and chronology without changing scope.

### Operational grid

The grid is the primary high-volume manipulation surface:

- server-side cursor pagination and filtering;
- pinned identity/status columns;
- column visibility and density settings;
- keyboard navigation and selection;
- saved views with explicit ownership/visibility;
- bulk actions only where one authorization decision can be safely evaluated
  per selected resource;
- mobile switches to a structured record list, not a horizontally compressed
  desktop table.

### Context inspector

The inspector provides:

- authoritative state and next permitted actions;
- owner, authority and SLA;
- evidence/provenance trace;
- recent immutable events;
- dependencies and affected objects;
- contextual forms without losing canvas position.

### Design tokens

Reuse the implemented Precision Instrument semantic tokens. Actual neutral dark
values in `src/app/globals.css` are authoritative where older documentation
still shows blue-dark values.

| Role             | Light     | Dark      |
| ---------------- | --------- | --------- |
| Canvas           | `#f4f6f8` | `#0d0e10` |
| Surface          | `#ffffff` | `#131518` |
| Surface subtle   | `#f8fafc` | `#191c20` |
| Surface selected | `#eaf0fb` | `#25292f` |
| Ink strong       | `#08101f` | `#f5f7fb` |
| Line             | `#dce3eb` | `#2b2f35` |

The design adds density, hierarchy and interaction primitives, not decorative
colors or a second visual language.

## Module and file boundaries

```text
src/modules/
├── organization/          organization tree, groups and grants
├── authorization/         deterministic policy evaluation
├── command-runtime/       command envelope, outbox and durable jobs
├── projections/           enterprise read models and watermarks
├── search/                query contracts and local search adapter
├── lifecycle/             retention, legal hold, archive and deletion review
└── existing kernels/      remain authoritative for their bounded contexts

src/components/enterprise/
├── organization-navigator
├── scope-breadcrumb
├── command-palette
├── mission-command-graph
├── operational-grid
├── context-inspector
└── chronology
```

Existing modules may call authorization, command and projection ports. They may
not import UI code or external provider SDKs.

## Migration strategy

1. Add organization and scope records without changing current behavior.
2. Backfill one organization and root unit per existing workspace.
3. Dual-evaluate existing roles and scoped grants; fail on semantic mismatch in
   tests and diagnostic mode.
4. Switch authoritative reads to the new decision service.
5. Enable tenant-aware constraints and RLS after negative-path coverage.
6. Retire compatibility projection only through a separate verified migration.

Every migration must support fresh install, upgrade with retained history and
recovery rehearsal.

## Verification gates

| Gate                 | Evidence                                                                             |
| -------------------- | ------------------------------------------------------------------------------------ |
| ENT-G1 Authority     | hierarchy, inheritance, deny, delegation and separation-of-duty scenarios pass       |
| ENT-G2 Isolation     | cross-tenant application and direct-database negative tests pass with RLS            |
| ENT-G3 Bounded data  | no unbounded collection; query/memory budgets pass on large fixtures                 |
| ENT-G4 Durable work  | command idempotency, retry, lease expiry and dead-letter recovery pass               |
| ENT-G5 Enterprise UX | graph/grid/inspector workflows pass VN/EN, light/dark, keyboard and responsive E2E   |
| ENT-G6 Scale         | write-heavy, hot-tenant, multi-replica and soak profiles meet approved local targets |
| ENT-G7 Recovery      | migration, projection rebuild, job recovery and export resume pass                   |

## Explicit exclusions

- Cloud vendor selection or paid resources.
- Staging or production deployment.
- Model provider API or autonomous agent execution.
- External connector implementation.
- Billing and commercial packaging.
- Microservice split without measured evidence.
- Fabricated enterprise demo metrics.

## Checkpoint

- [ ] Organizational hierarchy and authorization direction approved.
- [ ] PostgreSQL-first durable command/search approach approved.
- [ ] Mission Command Graph interaction model approved.
- [ ] Connectors, cloud and AI remain sequenced after Enterprise Core.
- [ ] Task graph below is authorized to begin one bounded TIP at a time.

Approved by the Owner on `2026-07-30`. `TIP-023A` is authorized to begin.
