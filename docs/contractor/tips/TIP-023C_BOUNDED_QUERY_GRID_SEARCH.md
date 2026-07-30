# TIP-023C — Bounded Query, Grid and Search Contracts

## Header

- TIP-ID: `TIP-023C`
- Project: HIVE OS Enterprise Core
- Module: Query Contracts
- Depends on: TIP-023A
- Priority: P0
- Status: `AUTHORIZED BY OWNER — 2026-07-30`

## Requirements

| ID      | Requirement                                                                       |
| ------- | --------------------------------------------------------------------------------- |
| ENT-006 | Replace tenant-scale collections with stable cursor pagination and explicit limits |
| ENT-007 | Provide indexed structured search and provider-neutral full-text search ports     |

## Task

1. Introduce versioned opaque cursors, bounded page requests and deterministic
   `nodes + pageInfo` responses.
2. Require every stable order to include an immutable unique tiebreaker.
3. Add server-side mission and skill filters and move skill capability
   discovery from application-memory filtering to PostgreSQL predicates.
4. Bound legacy collection wrappers and nested histories while exposing new
   cursor-native ports for enterprise grid consumers.
5. Add a provider-neutral governed-object search port backed initially by
   PostgreSQL full-text indexes.
6. Scope every search query by Workspace and filter every candidate through
   the scoped authorization kernel before disclosure.
7. Reject malformed, stale-version, wrong-kind and oversized cursors/queries.
8. Certify deterministic ordering, isolation, authorization, query-count and
   heap ceilings using large deterministic fixtures.

## Acceptance criteria

### QUERY-01 — Cursor contract

Cursors are opaque, versioned and kind-bound. Invalid or mismatched cursors
fail closed. Page sizes default to 25 and cannot exceed the port-specific
maximum.

### QUERY-02 — Stable pagination

Concurrent inserts do not duplicate or skip records already inside a traversal
boundary. Every sort includes `id` as a deterministic tiebreaker.

### QUERY-03 — Structured filtering

Mission status/assurance and Skill status/capability/assurance filters execute
as indexed database predicates, not tenant-scale application-memory filters.

### QUERY-04 — Bounded collections

Mission, truth, skill, execution, verification, audit and release collections
have explicit limits or cursor ports. Nested histories have independent
limits/cursors and never expand without a ceiling.

### QUERY-05 — Indexed search

PostgreSQL full-text indexes cover Mission, Evidence, Claim, Skill, Execution,
Verification and Release descriptors. Search input and candidate counts are
bounded.

### QUERY-06 — Authorized disclosure

Every search candidate is Workspace-scoped and evaluated against the
authorization kernel at its Workspace or Mission resource before it can be
returned. A forbidden object never leaks through title, count or ranking.

### QUERY-07 — Scale ceilings

A deterministic large fixture proves bounded result size, bounded query count
and bounded heap growth. Exact total counts remain opt-in and are not computed
by default.

### QUERY-08 — Regression

Typecheck, lint, unit, integration, E2E, production build, fresh migration and
upgrade rehearsal pass without weakening TIP-023B.

## Constraints

- PostgreSQL `simple` text search is the first adapter; the port remains
  provider-neutral.
- Search ranking is a relevance aid, never authoritative governed state.
- No external search engine, cache, UI redesign, cloud service or model API.
- Existing array-returning ports remain compatibility wrappers but must be
  explicitly bounded.
- Existing dirty visual artifacts remain outside scope.

## Reports

- `docs/verification/TIP-023C_COMPLETION_REPORT.md`
- `docs/verification/TIP-023C_VERIFY_REPORT.md`
