# Owner Decisions for AWS Managed Staging

Status: `APPROVED — MANAGED STAGING LIVE, CERTIFICATION DEFERRED`

Owner authorization: 2026-08-04. AWS resource creation is limited to the
Singapore region and a measured monthly cost ceiling of USD 20. Production and
public release remain unauthorized.

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

## Locked staging decisions

| Decision | Owner-approved staging contract |
| --- | --- |
| Hosting and region | AWS Singapore (`ap-southeast-1`); one Lightsail Nano IPv6-only instance (`nano_ipv6_3_0`, USD 3.50/month) |
| Managed PostgreSQL | Lightsail PostgreSQL 16 Micro (`micro_2_0`, USD 15/month), encrypted managed storage, private connectivity, automatic backup retention enabled |
| Object storage | Regional Amazon S3 Standard bucket, public access blocked, versioning enabled, SSE-S3 (`AES256`), incomplete multipart cleanup and noncurrent-version expiry |
| Secret manager | One consolidated AWS Secrets Manager staging secret; operator-mediated deployment injection into a root-owned `0600` runtime file. No secret is committed or embedded in the image |
| SMTP provider | Amazon SES SMTP in Singapore. External mail certification remains fail-closed until the Owner supplies and verifies a staging sender identity |
| Observability | Lightsail resource metrics, application structured events in bounded `journald`, health probes, and AWS Budget evidence. Central log export is deferred under the ceiling |
| Domain and DNS | Temporary staging-only IPv6-derived `sslip.io` hostname with automated TLS. A customer-owned domain is required before production |
| RPO and RTO | Staging target only: managed database backup retention plus an integrity-checked logical backup/restore drill. No production RPO/RTO claim |
| Production SLO | Not authorized. Staging measurements remain observations, not SLO evidence |
| Tenancy/RLS | Shared managed PostgreSQL with the implemented Organization/Workspace RLS and least-privileged `hiveos_app` runtime role |
| Retention/legal hold | TIP-023G governed lifecycle and legal-hold rules remain authoritative; S3 lifecycle must not bypass them for current objects |
| Budget ceiling | AWS Budget `hiveos-staging-monthly`, USD 20/month, credits excluded from budget accounting |

Fixed monthly run rate is USD 18.50 before the small usage-based S3, Secrets
Manager, ECR, CloudFront and network request charges. The deployment must remain
low traffic. AWS Budget excludes credits and remains the accounting guard;
budget alerts do not hard-stop resources. Lightsail CDN is excluded because its
USD 2.50 fixed plan would exceed the ceiling.

The live staging edge is `https://d366nm3yse819q.cloudfront.net`. CloudFront is
configured with cache disabled and IPv6-only origin connectivity to the
temporary `sslip.io` Caddy origin. This is staging evidence, not an approved
production DNS boundary.

## Honest certification boundary

- The 512 MiB application node is a constrained staging probe, not production
  capacity or evidence that the million-row local fixture fits this node.
- The temporary DNS name is not an enterprise ownership boundary.
- Email recovery, authenticated onboarding, alert delivery, the 30–60 minute
  constrained soak and backup/restore drill must pass before TIP-021C-C can be
  marked complete.
- If the memory, delivery or variable-cost gates cannot pass, the result is
  `READY_WITH_DEFERRED`; the budget must not be exceeded to manufacture a pass.

Execution sequence:

1. Contractor records the locked architecture and cost ceiling.
2. Builder provisions only the approved staging resources.
3. TIP-021C-C performs drills and security review before any production
   authorization.
