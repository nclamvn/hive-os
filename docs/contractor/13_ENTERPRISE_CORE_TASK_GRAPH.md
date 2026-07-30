# HIVE OS — Enterprise Core Task Graph

Status: `APPROVED — TIP-023A, TIP-023B AND TIP-023C LOCALLY VERIFIED`

Recorded: `2026-07-30`

## Dependency map

```text
TIP-023A Organization Graph
    ├── TIP-023B Authorization & Tenant Isolation
    │       ├── TIP-023D Enterprise Workflow
    │       └── TIP-023F Enterprise Operating Surface
    └── TIP-023C Bounded Query & Search
            ├── TIP-023E Command, Job & Projection Plane
            └── TIP-023F Enterprise Operating Surface

TIP-023D + TIP-023E + TIP-023F
    └── TIP-023G Lifecycle, Export & Observability
            └── TIP-023H Enterprise Scale Certification

Only after TIP-023H:
    TIP-024 Connectors → TIP-025 Governed AI
```

## TIP-023A — Organization Graph and Compatibility Migration

**Priority:** P0
**Requirements:** ENT-001, ENT-004

Add Organization, OrgUnit, OrgUnitClosure, Portfolio,
OrganizationMembership, Group and GroupMembership. Backfill existing
workspaces without changing current authorization. Provide hierarchy mutation
rules, cycle prevention, stable identifiers and retained audit history.

Acceptance floor:

- fresh and upgrade migrations pass;
- each existing workspace receives one deterministic organization/root unit;
- concurrent reparent operations cannot create a cycle;
- hierarchy queries are tenant-scoped and bounded;
- existing identity and mission E2E behavior remains unchanged.

## TIP-023B — Scoped Authorization and Database Tenant Defense

**Priority:** P0
**Depends on:** TIP-023A
**Requirements:** ENT-002, ENT-003, ENT-005

Add scoped grants, group inheritance, delegation validity, explicit deny,
separation-of-duty rules, decision reason codes, tenant-aware composite
constraints and PostgreSQL RLS. Run compatibility evaluation before switching
authority from the four-role matrix.

Acceptance floor:

- resource authorization is deterministic and auditable;
- inherited access never crosses organization boundaries;
- verifier/builder and releaser/executor conflicts fail closed where policy
  requires independence;
- direct runtime-role SQL cannot read or mutate a foreign tenant;
- owner continuity and current authorization scenarios remain preserved.

## TIP-023C — Bounded Query, Grid and Search Contracts

**Priority:** P0
**Depends on:** TIP-023A
**Requirements:** ENT-006, ENT-007

Create versioned cursor primitives, server-side filters, stable sort contracts,
query limits and PostgreSQL full-text search adapter. Migrate mission, truth,
skill, execution, verification, audit and finder collections away from
unbounded reads.

Acceptance floor:

- no tenant-scale `findMany` remains without an explicit bound or cursor;
- nested histories paginate independently;
- capability discovery is performed by indexed database predicates;
- authorization filters every search result;
- query count and heap ceilings pass on large deterministic fixtures.

## TIP-023D — Enterprise Workflow and Accountability

**Priority:** P1
**Depends on:** TIP-023B
**Requirements:** ENT-012

Add assignments, accountable roles, due times, SLA policies, escalation rules,
approval-chain definitions, work inbox and authorized bulk reassignment.

Acceptance floor:

- every active obligation can expose one accountable owner or an honest
  unassigned state;
- overdue/SLA state is derived from retained policy and timestamps;
- approval chains preserve separation of duties;
- delegation expiry revokes future authority without rewriting history;
- bulk commands report per-resource success/failure without partial silence.

## TIP-023E — Durable Command, Job and Projection Plane

**Priority:** P0
**Depends on:** TIP-023B, TIP-023C
**Requirements:** ENT-008, ENT-009, ENT-010

Implement command envelopes, idempotency registry, transactional outbox,
PostgreSQL-backed job leases, retries, dead-letter disposition and incremental
portfolio projections with freshness watermarks.

Acceptance floor:

- duplicate command delivery produces one governed effect and a stable outcome;
- state, audit and outbox commit atomically;
- worker crash and lease expiry are recoverable;
- retry never overwrites append-only kernel history;
- Control Room renders bounded projections instead of request-time count
  fan-out.

## TIP-023F — Mission Command Surface

**Priority:** P0
**Depends on:** TIP-023B, TIP-023C; integrates TIP-023D and TIP-023E when ready
**Requirements:** ENT-013, ENT-014, ENT-015

Replace the dashboard-first information architecture with the organization
navigator, Mission Command Graph, operational grid, contextual inspector,
chronology mode, saved views and authorized command palette.

Acceptance floor:

- the default operational surface is graph/grid-based and uses real data;
- users can move organization → portfolio → mission without losing context;
- graph nodes expose stored state, dependency, authority and gaps without
  synthetic metrics;
- grid uses server pagination, filter and sort contracts;
- inspector exposes provenance and authorized next actions;
- full workflow passes at 320, 390, 768, 1280 and 1600 pixels;
- VN/EN and system/light/dark combinations pass;
- keyboard, screen-reader semantics and reduced motion pass;
- no page degenerates into a stack of decorative text cards.

## TIP-023G — Lifecycle, Streaming Export and Observability

**Priority:** P1
**Depends on:** TIP-023D, TIP-023E, TIP-023F
**Requirements:** ENT-011, ENT-016, ENT-017

Implement governed retention evaluation, legal hold, archive candidates,
controlled deletion, resumable streaming dossier generation, projection
rebuild and structured trace/metric hooks.

Acceptance floor:

- no tenant or workspace delete can cascade through governed ledgers;
- legal hold blocks lifecycle disposition;
- large dossier creation is asynchronous, bounded and resumable;
- incomplete export is never published as complete;
- trace correlation follows command → transaction → outbox → job → artifact;
- unavailable metrics remain unavailable.

## TIP-023H — Enterprise Scale Certification

**Priority:** P0 release gate
**Depends on:** TIP-023G
**Requirements:** ENT-018

Create deterministic large datasets and certify read, write, concurrency,
isolation, worker recovery, hot-tenant, projection rebuild, export and recovery
behavior. Results remain local/non-SLO until a production-like environment is
separately authorized.

Acceptance floor:

- million-row ledger fixture can be generated reproducibly;
- 100-way governed write contention preserves invariants;
- hot-tenant load cannot disclose or corrupt a second tenant;
- multi-process workers do not duplicate governed effects;
- 60-minute bounded soak records latency, throughput, CPU, RSS, connections and
  queue depth;
- backup/restore plus projection rebuild returns to a verified watermark;
- every failure has severity, retained evidence and an explicit disposition.

## Program constraints

- One TIP is authorized and verified before the next dependent TIP begins.
- Existing dirty visual artifacts are not part of this program unless a TIP
  explicitly regenerates them.
- Each TIP produces a Completion Report and quantitative Verify Report.
- No push, deployment, external API, paid infrastructure or production claim is
  implied by Blueprint approval.
