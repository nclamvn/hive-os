# TIP-023B — Scoped Authorization, RLS and Separation of Duties

## Header

- TIP-ID: `TIP-023B`
- Project: HIVE OS Enterprise Core
- Module: Authorization
- Depends on: TIP-023A
- Priority: P0
- Status: `AUTHORIZED BY OWNER — 2026-07-30`

## Requirements

| ID      | Requirement                                                                                           |
| ------- | ----------------------------------------------------------------------------------------------------- |
| ENT-002 | Support groups and scoped grants at organization, unit, workspace and mission scope                   |
| ENT-003 | Enforce separation of duties and delegated authority in deterministic policy evaluation               |
| ENT-005 | Enforce tenant boundaries in application queries, composite database relationships and PostgreSQL RLS |

## Task

1. Add enterprise roles, scoped allow/deny grants, validity windows,
   delegation chains, revocation and organization policy versions.
2. Backfill one organization-scoped compatibility grant from each existing
   OrganizationMembership.
3. Implement deterministic authorization evaluation for direct and group
   subjects with organization, inherited OrgUnit, Workspace and Mission scope.
4. Make explicit deny override allow; reject expired, revoked, broken or
   excessively deep delegation chains.
5. Enforce builder/verifier and executor/release-approver separation for
   high-assurance missions.
6. Enable and force PostgreSQL RLS on the Enterprise authority plane. Runtime
   access requires transaction-local organization and actor context.
7. Apply scoped authorization to Organization operations and sensitive
   verification/release authority without weakening existing kernel gates.

## Acceptance criteria

### AUTH-01 — Compatibility authority

Legacy Owner/Admin/Member/Viewer memberships receive deterministic
organization-scoped grants preserving current access after migration and new
onboarding.

### AUTH-02 — Scope inheritance

An Organization grant applies throughout its Organization; an OrgUnit grant
applies only to that unit and descendants; Workspace and Mission grants apply
only to their exact resource boundary.

### AUTH-03 — Group and deny precedence

Direct and group grants are evaluated together. Any applicable explicit deny
for a capability overrides every allow.

### AUTH-04 — Delegation

Delegated authority is valid only while every parent grant in its bounded chain
is active and time-valid. Revocation or expiry fails closed without rewriting
historical grants.

### AUTH-05 — Separation of duties

For Research/Regulated missions, a user who performed Builder execution cannot
approve verification or release. Required independent authority cannot be
self-delegated around the rule.

### AUTH-06 — Runtime RLS

The `hiveos_app` role cannot read or mutate authority rows without a valid
transaction-local tenant context and cannot access a second Organization while
bound to the first. The role remains `NOBYPASSRLS`.

### AUTH-07 — Auditability

Grant, delegation, revocation and denied sensitive actions produce bounded
reason codes, policy version and actor/correlation attribution without secrets.

### AUTH-08 — Regression

Typecheck, lint, unit, integration, E2E, fresh migration and legacy-upgrade
rehearsal pass. Existing Workspace authorization and kernel invariants remain
intact.

## RLS rollout boundary

This TIP forces RLS on the Enterprise authority plane:

- organization;
- organization membership and policy;
- OrgUnit and closure;
- portfolio;
- organization group and membership;
- scoped grants.

Existing business ledgers retain their current trusted WorkspaceContext and
composite tenant predicates. They are not silently placed behind RLS until each
bounded context uses transaction-local tenant context; that expansion remains
a required enterprise gate and must not be described as complete database-wide
RLS.

## Constraints

- PostgreSQL remains the initial authority store.
- No external identity provider, SCIM, cloud service or policy engine.
- No UI scope in this TIP.
- Deny and separation-of-duty rules always fail closed.
- Runtime RLS context must be transaction-local to prevent pool leakage.
- Existing visual artifacts remain outside scope.

## Reports

- `docs/verification/TIP-023B_COMPLETION_REPORT.md`
- `docs/verification/TIP-023B_VERIFY_REPORT.md`
