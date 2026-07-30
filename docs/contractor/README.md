# HIVE OS — Contractor Start Package

Status: **BLUEPRINT LOCKED · LOCAL RC SIGNED · PRODUCTION NOT AUTHORIZED**

This package is the living governance record for the implemented HIVE OS web
operating system. It follows Vibecode Kit v6.1 trust boundaries:

- **Homeowner:** wants, chooses, approves, owns responsibility.
- **Contractor:** architecture, coordination, TIP scope, and verification. Does
  not code.
- **Builder:** implementation, tests, and completion reports. Does not silently
  change approved architecture.

The UI direction in `assets/hive-os-ui-locked.png` is treated as **LOCKED**. Build must reproduce its visual language, not merely its page structure.

## Current gate ledger

```text
G0 SCAN:                            PASS
G1 BLUEPRINT:                       PASS
G2 FOUNDATION LOCAL:                PASS
G3 MISSION LOOP LOCAL:              PASS
G3 REMOTE REPRODUCIBILITY:          BLOCKED_EXTERNAL (OBL-FND-001)
G4 TRUTH LOOP LOCAL:                PASS_PROVISIONAL
G5 EXECUTION + VERIFICATION LOCAL:  PASS_PROVISIONAL
G6 LOCAL RC:                        PASS_PROVISIONAL

LOCAL RC:            SIGNED
REMOTE RC:           NOT ESTABLISHED
PRODUCTION RELEASE:  NOT AUTHORIZED
PUBLIC RELEASE:      NOT AUTHORIZED
```

## Required continuation sequence

1. Contractor scopes a bounded TIP from the locked Blueprint and current
   evidence.
2. Homeowner explicitly authorizes that TIP.
3. Builder implements only the authorized TIP and returns a Completion Report.
4. Contractor verifies acceptance scenarios and records a Verify Report.
5. Later TIP authorization is never inferred from an earlier approval.

## Manifest provenance

- `MANIFEST.founding.sha256` preserves the checksum ledger received with the
  original Contractor start package. Its historical paths and hashes are not
  rewritten as the package evolves.
- `MANIFEST.current.sha256` verifies the current files under
  `docs/contractor/`, excluding both manifest ledgers to avoid self-reference.
- The unit quality gate verifies the current manifest. Any authorized change to
  this package must renew it before closure.

No production claim, release status, evidence percentage, verification percentage, mission count, or resource number may be synthesized. Empty states are preferred to invented data.
