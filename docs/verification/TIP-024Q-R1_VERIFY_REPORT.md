# VERIFY REPORT — TIP-024Q-R1 P1 Enterprise UAT Closure

Date: `2026-08-05`

## VERDICT

`ACCEPT — TECHNICAL P1 CLOSED; HUMAN FUNCTIONAL ATTESTATION PENDING`

The exact revision `5c73448a5897339f359764b425581f181a32b582` passes the
authorized machine-verifiable P1 contract on managed AWS staging. It must not
be represented as production SLO, production capacity or signed enterprise
business acceptance.

## ACCEPTANCE MATRIX

| Criterion | Evidence | Verdict |
| --- | --- | --- |
| QA-024Q-R1-01 complete VN/EN identity surfaces | Staging first visit rendered VI and system appearance; interactive switch rendered complete EN copy | PASS |
| QA-024Q-R1-02 localized auth semantics | Unit/E2E coverage retained neutral recovery, validation, busy/error and accessible password-control states | PASS |
| QA-024Q-R1-03 responsive/accessibility/no-retry E2E | Exact-revision CI and local certification; 87/87 full E2E, zero retries | PASS |
| QA-024Q-R1-04 patched recoverable host | Kernel `7.0.0-1010-aws`, zero standard updates, health restored, restart 0 and OOM false | PASS |
| QA-024Q-R1-05 continuous managed soak | 1,800.18 seconds, 1,745/1,745 HTTP 200, zero transport/5xx, bounded max gap 2,886.64 ms | PASS_NON_SLO |
| QA-024Q-R1-06 managed backup/restore/rebuild | Integrity hash retained; inventories equal; projection rebuild 1/1; disposable target removed | PASS |
| QA-024Q-R1-07 five governed pilot scenarios | 5 Missions, SoD, approvals, evidence and exports passed; human attestation kept separate | PASS_MACHINE / HUMAN_PENDING |
| QA-024Q-R1-08 exact gates and remaining decisions | CI runs, counts, durations, failed attempts and human boundary retained | PASS |

## FAILURE TRANSPARENCY

1. PostgreSQL 16 initially rejected a PostgreSQL 15 `pg_dump`; the migrator now
   pins the PostgreSQL 16 client and the version check passed.
2. The first repaired recovery run protected credentials but stripped managed
   TLS query parameters from the isolated database URL. Administrative restore
   succeeded while the application projection client failed closed. Revision
   `5c73448` preserves the transport parameters; the repeat recovery passed.
3. Operator-Mac soak attempts were not promoted to PASS when sleep or DNS gaps
   occurred. The authoritative 30-minute run moved to AWS and traversed the
   public CloudFront URL with zero transport errors.

## SCOPE LIMITS

- The staging result is bounded, low-rate and non-SLO. It does not certify
  Vingroup-scale throughput, disaster-recovery RPO/RTO or production load.
- The 512 MiB Lightsail node is a budget-constrained certification topology,
  not the intended enterprise production topology.
- Human functional-team sign-off remains required using the retained
  attestation form. No automated test can truthfully replace that decision.

## RETAINED EVIDENCE

- `docs/verification/evidence/TIP-024Q-R1_MANAGED_STAGING_SOAK.json`
- `docs/verification/evidence/TIP-024Q-R1_MANAGED_STAGING_SOAK_ATTEMPT1.json`
- `docs/verification/evidence/TIP-024Q-R1_MANAGED_STAGING_SOAK_ATTEMPT2.json`
- `docs/verification/evidence/TIP-024Q-R1_MANAGED_STAGING_SOAK_ATTEMPT3_CLIENT_DNS.json`
- `docs/verification/evidence/TIP-024Q-R1_MANAGED_RECOVERY.json`
- `docs/operations/TIP-024Q-R1_FUNCTIONAL_TEAM_ATTESTATION.md`

