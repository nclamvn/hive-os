# Workspace Isolation Design Note (TIP-003)

## Principle

A membership never grants access outside its workspace. Authorization is
resolved server-side from the authenticated session; a slug or entity ID
supplied by the browser is never treated as authorization.

## Mechanism

1. **Trusted context.** `resolveWorkspaceContext(headers, slug)` verifies the
   session, loads the workspace by slug, then requires an **active membership**
   for that user. It returns a `WorkspaceContext` carrying the trusted
   `workspace.id`, `membership.role`, and a fresh `correlationId`.
2. **Scoped queries.** Every service method (`listMembers`, `changeMemberRole`,
   `suspendMember`, `listAuditEvents`, invitations) takes a `WorkspaceContext`
   and filters by `ctx.workspace.id`. Target lookups use
   `loadScopedMembership()` which filters by `{ id, workspaceId }`.
3. **No client-supplied workspace IDs.** Workspace IDs are injected from the
   trusted context, never from request bodies.

## No existence leak

A missing workspace and a missing/inactive membership both surface as
`NotFoundError` (HTTP 404 via `notFound()`), so a caller cannot distinguish
"no such workspace" from "not a member". Out-of-workspace membership IDs also
resolve to `NotFound`.

## Root routing

`/` resolves server-side: unauthenticated → `/sign-in`; no membership →
`/onboarding`; one workspace → `/w/[slug]`; multiple → `/workspaces` chooser.

## Tests

ID-04 (route guard), ID-07 (cross-workspace mutation blocked), ID-08 (scoped
listing), ID-20 (multi-workspace membership).
