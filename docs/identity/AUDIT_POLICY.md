# Audit Event Schema & Redaction Policy (TIP-003)

Model: `AuditEvent` (`audit_event` table). Implementation:
`src/modules/identity-workspace/audit.ts`.

## Schema

| Field | Meaning |
|---|---|
| `id` | Event ID |
| `workspaceId` | Owning workspace (scoping key) |
| `actorUserId` | User who caused the transition (nullable for system) |
| `actorMembershipId` | Membership of the actor (nullable) |
| `eventType` | Canonical type (see `AuditEventType`) |
| `entityType` / `entityId` | Target object |
| `correlationId` | Groups events from one operation |
| `payload` | Redacted, allowlisted JSON |
| `createdAt` | Timestamp |

## Canonical event types

`workspace.created`, `workspace.updated`, `membership.created`,
`membership.role_changed`, `membership.suspended`, `invitation.created`,
`invitation.accepted`, `invitation.revoked`.

## Append-only enforcement

- No application update/delete path exists (`writeAuditEvent` is the only
  writer; there is no updater/deleter).
- Database triggers `audit_event_no_update` / `audit_event_no_delete`
  (migration `20260720074109_audit_append_only`) reject `UPDATE`/`DELETE` for
  every row. Evidence: `artifacts/tip-003/audit-immutability.txt`;
  test: ID-17.
- Workspace deletion cascades to audit rows, which the trigger blocks — so a
  workspace with audit history cannot be hard-deleted (workspaces are archived
  via `status`, never destroyed).

## Redaction (allowlist + fail-closed)

- Payloads are built from an explicit safe allowlist at each call site
  (e.g. `{ role, name, slug, email }`). Email is PII, not a secret, and is
  permitted; raw invitation tokens are never included.
- `assertRedactedPayload()` additionally **rejects** any payload (recursively)
  whose key matches
  `pass|token|secret|hash|cookie|authorization|session|credential|api[-_]?key|database[-_]?url`.
  This fails closed against accidental serialization of sensitive fields.
- Tests: ID-18 (unit `audit-redaction.test.ts` + integration scan of stored
  rows).
