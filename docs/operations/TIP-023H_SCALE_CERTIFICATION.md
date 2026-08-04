# TIP-023H Local Scale Certification

This procedure is destructive only to two fixed disposable databases:
`hiveos_tip023h_scale` and `hiveos_tip023h_restore`. It rejects every other
database name and requires exact confirmation.

## Preconditions

- Local PostgreSQL and required CLI tools (`pg_dump`, `pg_restore`) are
  available.
- `.env` contains separate migration-owner and least-privilege runtime URLs.
- No production or shared database is represented by either fixed disposable
  name.

## Harness smoke

The smoke profile validates harness behavior but still builds the deterministic
large fixture. It is not certification and cannot overwrite certified
evidence:

```bash
npm run scale:smoke
```

## Full certification

```bash
npm run scale:certify
```

The default soak is 3,600 seconds. Progress is emitted every ten seconds. The
run also performs 100-way contention, hot-tenant RLS probes, four-process job
claiming, integrity-manifested backup/restore and the real application
projection rebuild.

Machine-readable evidence is written to
`docs/verification/evidence/TIP-023H_SCALE_REPORT.json`. Local latency,
throughput, CPU, RSS, connection and queue values are observations, not
production SLOs or cloud capacity claims.

Successful runs remove both disposable databases. Failed runs retain them for
forensics; they can be removed by rerunning the confirmed harness after the
failure is understood.

