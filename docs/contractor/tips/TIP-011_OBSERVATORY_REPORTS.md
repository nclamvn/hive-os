# TIP-011 — Observatory and Reports

Status: `READY_WITH_DEFERRED — LOCAL VERIFIED`

## Task

Implement governed publication and report surfaces from approved immutable
release manifests.

## Non-negotiable boundary

Observatory and public/report projections read ReleaseManifest snapshots only.
They never join mutable Truth rows to reconstruct a public result.

## Acceptance Criteria

- Internal Observatory lists only PUBLIC, APPROVED releases whose Mission is
  RELEASED.
- Public records include exact released claims, methods, limitations,
  artifact hashes, approvers, and manifest hash.
- Reports expose retained Verify Reports and governed release bundles within
  workspace permissions.
- Empty states never imply a release exists.
- Restricted/internal claims cannot leak through any public projection.
- Responsive, keyboard, and accessibility gates pass.
