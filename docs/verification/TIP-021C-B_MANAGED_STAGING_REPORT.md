# TIP-021C-B — AWS Managed Staging Report

Status: `READY_WITH_DEFERRED — MANAGED STAGING LIVE`

Date: `2026-08-04`

## Deployment identity

| Item | Evidence |
| --- | --- |
| Region/account | AWS Singapore `ap-southeast-1`; account `217358003879` |
| Source | `90b63a6b2b37c9f5420ea9f2f2201f12bf64d948` |
| App image | `sha256:48d7e75f0e313fb3fe2bdd90002fa242af495623e37d3911ecb0555e7d554a15` |
| Migrator image | `sha256:10a2e8db30376251414d2c551f22ff25b2278399345de10bb1a0e89b13be1521` |
| Staging URL | `https://d366nm3yse819q.cloudfront.net` |
| CloudFront | `E3HPXGYUM413JY`, status `Deployed`, origin IP type `ipv6` |
| CI | quality-gates `30926263742` PASS; staging-images `30926261042` PASS |

## Managed topology

- Lightsail app `hiveos-staging-app`: Ubuntu 24.04, `nano_ipv6_3_0`,
  512 MiB RAM, 2 vCPU, 20 GB, IPv6-only.
- Lightsail database `hiveos-staging-db`: PostgreSQL 16.14,
  `micro_2_0`, private endpoint, backup retention enabled, backup window
  `18:00-18:30` UTC, maintenance `sun:19:00-sun:19:30` UTC.
- S3 `hiveos-staging-217358003879-ap-southeast-1`: all public access blocked,
  versioning enabled, SSE-S3 and bounded lifecycle.
- Secrets Manager `hiveos/staging/deployment`: consolidated runtime and
  migration environments; runtime injection excludes the migration credential.
- Caddy terminates TLS at a temporary IPv6-derived `sslip.io` origin.
  CloudFront presents the stable dual-stack viewer URL with caching disabled.
- The app container runs read-only, drops all Linux capabilities, sets
  `no-new-privileges`, has memory/CPU/PID bounds and uses host networking. The
  Lightsail firewall exposes only 80/443 plus the operator SSH boundary; port
  3000 is not publicly allowed.

## Acceptance evidence

| Gate | Result | Evidence |
| --- | --- | --- |
| STG-01 immutable artifact | PASS | Commit and both ECR digests recorded above |
| STG-02 credential separation | PASS | Runtime env has `DATABASE_URL`; migration URL is used only by the one-shot migrator and shredded afterward |
| STG-03 runtime PostgreSQL role | PASS | `rolsuper=false`, `rolcreatedb=false`, `rolcreaterole=false`, `rolbypassrls=false` for `hiveos_app` |
| STG-04 object storage | PASS | Runtime IAM credential completed put/head/get/delete; head reported `AES256`; probe object deleted |
| STG-05 HTTPS health/UI | PASS | Five consecutive edge samples returned live `200` and ready `200`; `/` returned 307 to `/sign-in`; `/sign-in` returned 200; HSTS present |
| STG-06 email | DEFERRED | SES identity list is empty; self-sign-up remains disabled and delivery is fail-closed |
| STG-07 authenticated tenant smoke | DEFERRED | No verified sender/onboarded staging identity is available |
| STG-08 constrained soak | DEFERRED | 30–60 minute managed soak has not run |
| STG-09 recovery | DEFERRED | Managed logical backup/restore and projection rebuild have not run |
| STG-10 budget | PASS_WITH_RISK | Budget is USD 20/month with credits excluded; fixed Lightsail is USD 18.50, leaving narrow usage-based headroom |

## Deployment discoveries

The first bootstrap attempt exposed three fail-closed staging defects and each
was corrected without weakening security:

1. Lightsail executes user data with `/bin/sh`; the Bash bootstrap now
   self-reexecutes before using `pipefail`.
2. PostgreSQL TLS required the AWS RDS global CA bundle. Both migrator and app
   mount that CA and retain certificate verification.
3. The node is IPv6-only. CloudFront required explicit IPv6 origin selection;
   S3 required its dual-stack endpoint; Docker bridge networking could not
   provide outbound IPv6, so the app uses bounded host networking.

## Budget boundary

The fixed Lightsail run rate is USD 18.50/month: USD 15 database and USD 3.50
app node. Secrets Manager, ECR storage, S3, CloudFront and requests are
usage-based and must remain low. At certification time AWS Budget reported USD
0 actual and no forecast, which is expected for newly created resources and is
not proof that future usage remains below the ceiling.

## Decision

TIP-021C-B proves that the reviewed HIVE OS artifact can migrate and run on a
managed AWS staging topology with real PostgreSQL, S3, TLS and bounded runtime
credentials. It does not prove production capacity, deliverability, RPO/RTO or
SLO.

Overall decision: `READY_WITH_DEFERRED — MANAGED STAGING LIVE`.

TIP-021C-C may start only after the Owner supplies a verified SES staging sender
identity. It must close STG-06 through STG-09 without exceeding the USD 20
ceiling; otherwise the deferred status remains.
