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

## Event-to-schema contract (SEC-02)

Each event type has one strict Zod schema (`AUDIT_PAYLOAD_SCHEMAS` in
`audit.ts`). `.strict()` rejects unknown keys, so the event type is the only
valid payload shape and a request-shaped object cannot pass through.

| Event type | Allowed payload keys |
|---|---|
| `workspace.created` | `name`, `slug` |
| `workspace.updated` | `name` |
| `membership.created` | `role`, `via` (`onboarding`\|`invitation`) |
| `membership.role_changed` | `from`, `to` |
| `membership.suspended` | `role` |
| `invitation.created` | `email`, `role` |
| `invitation.accepted` | `role` |
| `invitation.revoked` | `email` |

`writeAuditEvent` calls `validateAuditPayload(eventType, payload)` (throws on
unknown event type or shape/extra-key mismatch), then the fail-closed redaction
below. Correlation and actor fields are separate columns, never part of the
arbitrary payload input. Tests: AUD-PAYLOAD-01..05.

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
