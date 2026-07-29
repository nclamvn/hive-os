# Owner Decisions Required Before External Staging

Status: `OPEN — NOT AUTHORIZED BY TIP-021C-A`

The following decisions materially affect cost, data residency, security, and
operating responsibility. The Builder must not infer them from the local
contract.

| Decision | Required evidence |
| --- | --- |
| Hosting and region | Runtime support, network model, data residency, cost |
| Managed PostgreSQL | Version, pooling, encryption, PITR, maintenance policy |
| Object storage | S3 compatibility, encryption/KMS, lifecycle, versioning |
| Secret manager | Rotation, audit, access boundary, deployment integration |
| SMTP provider | Domain verification, deliverability, event visibility |
| Observability | Log/trace/metric retention, alerts, redaction, cost |
| Domain and DNS | Ownership, TLS automation, recovery contact |
| RPO and RTO | Business impact, backup frequency, restore evidence, cost |
| Production SLO | Pilot need, measurement window, alerting/on-call capacity |
| Tenancy/RLS | Threat model, dedicated vs shared DB, migration/test cost |
| Retention/legal hold | Customer/legal need, deletion authority, audit proof |
| Budget ceiling | Monthly platform and incident-response capacity |

Recommended next sequence:

1. Owner chooses a staging architecture and budget ceiling.
2. Contractor records the choices and scopes TIP-021C-B.
3. Builder provisions only the approved staging resources.
4. TIP-021C-C performs drills and security review before any production
   authorization.
