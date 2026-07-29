# RtR Pilot Controlled-Environment Dry Run

Status: `TIP-022 LOCAL CONTRACT`

This rehearsal proves only that the selected controlled environment can support
the RtR engineering-change pilot. It does not establish Remote RC, production
readiness, a public release, production SLO/RPO/RTO, or vendor suitability.

## 1. Before the rehearsal

1. Select one real, bounded engineering change with an observable acceptance
   method and rollback boundary.
2. Create the workspace accounts for the Owner, at least one engineer, an
   independent verifier, and operations responsibility. One person may cover
   multiple functions, but Research or Regulated verification must remain
   independent of execution.
3. Copy `PILOT_TEAM_ATTESTATION.example.json` outside the repository's tracked
   files, replace every placeholder with real membership identifiers, and set
   `PILOT_TEAM_ATTESTATION` to its path. Set `PILOT_WORKSPACE_SLUG` to the same
   real workspace slug.
4. Start the selected HIVE OS runtime and set `PILOT_BASE_URL` to its base URL.
5. Confirm the backup and restore procedure in
   `LOCAL_PRODUCTION_REHEARSAL.md`. Do not use a production database for a local
   drill.

## 2. Run readiness

```bash
npm run pilot:readiness
```

The command emits `hive-os.pilot-readiness.v1` JSON and exits non-zero when a
required check fails. It never emits connection strings, credentials, or secret
values. A local result is classified `LOCAL_CONTROLLED_ENVIRONMENT`; staging or
production remains `EXTERNAL_ENVIRONMENT_UNVERIFIED` until the Owner decisions
and real provider evidence are complete.

## 3. Rehearse one mission

1. Select `RtR engineering change dossier` from Templates.
2. Create the draft; review objective, scope, requirement, acceptance method,
   safety constraints, interfaces, configuration identity, and rollback.
3. Submit and approve through the governed contract loop.
4. Register real source identities. Attach a representative spec, CSV bench
   result, test note, or image in Evidence Hub.
5. Retain exact spans only from text-like snapshots. Do not represent PDF or
   image descriptors as extracted evidence.
6. Create claims with evidence and falsification criteria. Retain conflicts or
   honest-null results rather than filling gaps.
7. Execute the approved TIP through Manual Bridge and import the strict
   Completion Report.
8. Run independent verification, retain scenario evidence, sign off, and create
   the governed release only if the deterministic gates pass.
9. Download the complete mission dossier and pilot measurement from Reports.
   Verify the dossier integrity hash by canonicalizing the `dossier` object with
   recursive key sorting and hashing its UTF-8 bytes with SHA-256.

## 4. Observe without inventing data

Record the externally observed values that HIVE OS cannot derive:

- time needed by a reviewer to retrieve the complete dossier;
- human rework hours and the reason for rework;
- defects caught before production and their downstream impact;
- the comparable pre-pilot approval baseline.

Do not enter estimates as measured facts. The pilot report intentionally marks
these values unavailable until a real observation exists.

## 5. Negative and recovery checks

1. Run the tenant-isolation integration and E2E scenarios.
2. Confirm a Viewer cannot upload evidence or mutate governed records.
3. Attempt an invalid type, forged binary signature, empty file, and file over
   10 MB; each must fail without a valid Snapshot.
4. Perform the approved backup/restore drill and compare integrity manifests.
5. Confirm readiness and dossier downloads use private no-store responses.

## 6. Exit criteria

The environment is ready for the pilot only when readiness returns `ready:
true`, the functional team attestation is complete, the dry-run mission reaches
the intended governed boundary, negative checks pass, and the operator can
retrieve both exports.

External staging, provider/region selection, managed secrets, DNS, remote CI,
retention/legal hold, production SLO/RPO/RTO, production release, and public
release remain subject to `OWNER_DECISIONS_TIP-021C-B.md`.
