# TIP-023A — Organization Graph and Compatibility Migration

## Header

- TIP-ID: `TIP-023A`
- Project: HIVE OS Enterprise Core
- Module: Organization
- Depends on: approved Enterprise Core Blueprint
- Priority: P0
- Status: `AUTHORIZED BY OWNER — 2026-07-30`

## Context

- Working directory: `/Users/os/hiveos`
- Blueprint:
  `docs/contractor/12_ENTERPRISE_CORE_BLUEPRINT.md`
- Existing identity boundary:
  `src/modules/identity-workspace`
- Authoritative schema: `prisma/schema.prisma`
- Existing Workspace/Membership behavior must remain compatible.
- Existing dirty visual artifacts are outside this TIP.

## Requirements

| ID      | Requirement                                                                                         |
| ------- | --------------------------------------------------------------------------------------------------- |
| ENT-001 | Model organizations and nested organizational units without flattening authority into one workspace |
| ENT-004 | Preserve compatibility and provenance while migrating existing workspace memberships                |

## Task

Implement the first enterprise tenancy layer:

1. Add Organization, OrganizationMembership, OrgUnit, OrgUnitClosure,
   Portfolio, OrganizationGroup and OrganizationGroupMembership models.
2. Associate every Workspace with one Organization and OrgUnit; allow an
   optional Portfolio.
3. Upgrade existing data by creating one deterministic Organization/root unit
   per existing Workspace and mirroring existing Memberships into
   OrganizationMembership compatibility records.
4. Provision new Organization/root unit/closure/OrganizationMembership
   atomically during existing Workspace onboarding.
5. Add a bounded Organization module for hierarchy reads, child-unit creation,
   hierarchy moves, portfolio creation and group membership.
6. Prevent cross-organization parents, hierarchy cycles, invalid root
   placement and duplicate business keys at the database boundary.
7. Preserve existing authorization in this TIP. New scoped grants and RLS
   belong to TIP-023B.

## Acceptance criteria

### ORG-01 — Existing workspace compatibility

Given a database created before TIP-023A, when the migration is applied, then
every Workspace has exactly one valid Organization and root OrgUnit, existing
Membership rows remain unchanged, and matching OrganizationMembership
compatibility rows exist.

### ORG-02 — Atomic onboarding

Given a new authenticated user, when Workspace onboarding succeeds, then the
Organization, root OrgUnit, self closure, Workspace, both membership records,
policy and audit events exist atomically.

### ORG-03 — Bounded hierarchy

Given an authorized Workspace context, when its Organization hierarchy is
read, then only that Organization is returned, the result has an explicit
limit, and the closure depth is correct.

### ORG-04 — Cycle prevention

Given nested OrgUnits, when sequential or concurrent moves attempt to make an
ancestor a child of its descendant, then the database rejects the cycle and
the prior valid hierarchy remains queryable.

### ORG-05 — Tenant boundary

Given two Organizations, when a unit is created or moved under a parent from
the other Organization, then the mutation fails without disclosing or changing
foreign hierarchy state.

### ORG-06 — Business collections

Given an Organization, when portfolios, groups and group memberships are
created, then their keys are unique inside the Organization, references cannot
cross the Organization, and reads remain bounded.

### ORG-07 — Regression and migration gates

Given the completed implementation, typecheck, lint, unit, integration,
fresh-migration and upgrade-migration gates pass with no regression to existing
identity/workspace behavior.

## Constraints

- Keep the modular monolith and PostgreSQL authoritative store.
- Do not implement scoped grants, RLS, command queues or Enterprise UI.
- Do not connect cloud, external APIs or AI providers.
- Do not infer a multi-workspace organization for existing data; one
  Organization per legacy Workspace is the only safe backfill.
- No destructive rewrite of existing Workspace, Membership or AuditEvent
  history.
- Record any implementation deviation in the Completion Report.

## Report

Create:

- `docs/verification/TIP-023A_COMPLETION_REPORT.md`
- `docs/verification/TIP-023A_VERIFY_REPORT.md`
