# Mission Security Boundary (TIP-004)

## Transition authority
Only `HUMAN_COMMAND` (authenticated user + authorized WorkspaceContext) or a
`DETERMINISTIC_KERNEL` may drive governed transitions. Provider/model output is
never a transition authority; there is no provider-proposal ingestion in this
TIP. GateRun records `actorType` (HUMAN_COMMAND here). (MK-15)

## Isolation
Every mission query is scoped by the authorized `WorkspaceContext.workspace.id`.
A mission in another workspace resolves to `MISSION_NOT_FOUND` — no existence
leak. Client-supplied workspace IDs are never authorization. (MK-02)

## Permissions
Centralized matrix (`identity-workspace/permissions.ts`) extended with mission
capabilities; server-side authoritative. Regulated approval is Owner-only and
assurance downgrades are reserved to Owners (enforced in services). (MK-04, MK-07)

## Concurrency & idempotency
Reference codes are allocated by a concurrency-safe counter upsert. Mission
creation is idempotent per `(workspaceId, idempotencyKey)`. Transitions use
optimistic version checks with FOR UPDATE locks; one of two racing commands
wins, the other returns `MISSION_VERSION_CONFLICT`. Duplicate approval yields
`CONTRACT_ALREADY_APPROVED` with no duplicated obligations/gates. (MK-01, MK-13, MK-14)

## Audit & database
Strict per-event audit payloads (allowlist + fail-closed redaction); mutation
and its AuditEvent commit together. `gate_run` is append-only (trigger +
runtime SELECT/INSERT only). Approved contract definitions are frozen at the
database level. Migrations run as the owner role; the app runs as the
least-privileged `hiveos_app` role. (MK-08, MK-21, MK-25..28)
