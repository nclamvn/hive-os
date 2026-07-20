# Permission Matrix — Identity & Workspace (TIP-003)

Source of truth: `src/modules/identity-workspace/permissions.ts`. Server-side
authorization is authoritative; hiding a control in the UI is never
authorization.

| Capability | Owner | Admin | Member | Viewer |
|---|:--:|:--:|:--:|:--:|
| `workspace.read` | ✅ | ✅ | ✅ | ✅ |
| `workspace.update` | ✅ | ✅ | ❌ | ❌ |
| `members.read` | ✅ | ✅ | ✅ | ✅ |
| `members.invite` | ✅ | ✅ | ❌ | ❌ |
| `members.change_role` (ordinary) | ✅ | ✅ | ❌ | ❌ |
| `members.suspend` (ordinary) | ✅ | ✅ | ❌ | ❌ |
| `members.manage_owner` (grant/demote/remove Owner) | ✅ | ❌ | ❌ | ❌ |
| `audit.read` | ✅ | ✅ | ❌ | ❌ |

## Invariants (enforced in services, not just the matrix)

- **Admin cannot touch Owners.** Any role transition where the current or next
  role is `OWNER` requires `members.manage_owner` (Owner-only). See
  `canChangeRole()`.
- **Last active Owner protection.** A workspace must always retain at least one
  active `OWNER`. Demoting or suspending the last active Owner raises an
  `InvariantError`. Enforced transactionally with `countActiveOwners()`.
- **Workspace scoping.** Every member/role/audit operation is scoped to the
  authorized `WorkspaceContext.workspace.id`. A membership ID from another
  workspace resolves to `NotFound` (no existence leak).

## Tests

Unit: `tests/unit/permissions.test.ts` (matrix + `canChangeRole`).
Integration: `tests/integration/identity.test.ts` (ID-09, ID-10, ID-11).
