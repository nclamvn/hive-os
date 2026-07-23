# TIP-011 Observatory and Reports Verify Report

Date: 2026-07-23

Overall status: `READY_WITH_DEFERRED`

## Verified result

- Observatory reads immutable approved PUBLIC ReleaseManifest snapshots only.
- Mutable Truth rows are never joined to reconstruct a publication.
- Records appear only after the Mission is RELEASED.
- Reports expose workspace-scoped Verify Reports and governed release bundles.
- Empty states do not imply that verification or publication exists.
- Restricted and internal claims cannot enter the public manifest projection.
- Mobile 390px has no horizontal overflow; automated scans found no serious or
  critical accessibility violations.

## Evidence

- Verification Governance integration scenarios validate manifest omission
  before RELEASED and exact manifest projection after RELEASED.
- E2E: OBS-01, OBS-02, and REP-01.
- Full release-candidate gates are recorded in
  `docs/verification/TIP-012_VERIFY_REPORT.md`.

## Deferred

- Public unauthenticated Observatory hosting and export formats are not part of
  this internal local surface.
- Remote reproducibility remains blocked by `OBL-FND-001`.
