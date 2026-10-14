# Research-team handoff / Bàn giao cho nhóm nghiên cứu

Updated 2026-10-14. Research is paused; K6 is **OPEN**, not a completed theorem.
The owner-approved [Phase 2 PRD](../product/PRD_PHASE_2.md) directs future
investment toward domain skills and small tools on existing agents. This guide
covers the existing local application, not a commitment to expand or deploy it.
No new cloud deployment, paid-model call or mathematical campaign is implied.

**Tiếng Việt:** Phase 2 ưu tiên năng lực chuyên ngành dùng trong Codex/Cowork.
Ứng dụng riêng chỉ được đầu tư theo nhu cầu khách hàng cụ thể. Đọc PRD trước khi
chọn tính năng mới; hướng dẫn dưới đây giữ cách vận hành bản local hiện hữu.

## 1. Start locally / Khởi động local

Follow [README setup](../../README.md#getting-started): Node.js 24, PostgreSQL 16,
`.env` with two generated authentication secrets, `npm ci`, database startup,
then `npm run db:bootstrap` and `npm run dev`. Keep at least 20 GB disk space
before install/build. Do not replace a populated `.env` or existing database.

`DATABASE_URL` is the least-privileged application role;
`DATABASE_MIGRATION_URL` belongs only to migration/backup operators. Do not run
the web application as the database owner. Startup validation is deliberately
fail-closed; fix configuration instead of disabling guards.

For a disposable demo, `AUTH_ALLOW_SELF_SIGNUP=true npm run demo:provision`
then `npm run dev:demo`. Navigate to the **same origin** as `BETTER_AUTH_URL`
(template: `http://localhost:3000/sign-in`). Select the workspace offered after
sign-in; its generated slug is not guaranteed to match another installation.
Do not share the public demo identity with a real research team.

**Tiếng Việt:** Chạy theo README, giữ riêng tài khoản database vận hành và
migration. Tài khoản demo chỉ dùng trên máy local, không phải tài khoản nhóm.
Không tắt kiểm tra xác thực khi gặp lỗi đăng nhập.

## 2. First useful walkthrough / Luồng làm việc đầu tiên

Under `/w/<workspaceSlug>`:

**Local/test boundary:** `research/lean`, `research/kakeya`, `research/lrc-demo`
and `research/math-tools` currently require `NODE_ENV=development` or `test`
and a compatible development/test `DEPLOYMENT_ENV`. Their guards are unchanged;
these routes deliberately return not-found in production/staging. This
walkthrough is local acceptance guidance, not a production research-team
handoff or a claim that a fresh full acceptance suite has passed.

**Phạm vi local/test:** Bốn trang nghiên cứu trên chưa được mở cho production
hay staging. Bản hướng dẫn không thay thế nghiệm thu mới toàn bộ sản phẩm;
không đổi `NODE_ENV` trên máy chủ dùng chung để né giới hạn này.

1. Open the workspace/control room and confirm the correct team identity.
2. Open `research/lean` for the compact workflow. Enter a problem, retain its
   source and constraints, and supply the model output through the supported
   bridge. Use targeted critique only for an identified gap.
3. Keep mathematical claims distinct from exact checks, model opinions and
   unproved obligations. A tool result proves only its stated scope.
4. Open `research/lrc-demo` for the two retained LRC demonstrations and
   `research/kakeya` for the retained Kakeya/K5 presentation. These are evidence
   views, not a request to restart the paused K6 campaign.
5. Use `settings/members` for membership management and `settings/audit` to
   inspect the trail. Switch VN/EN and theme from the interface controls.

**Tiếng Việt:** Ưu tiên một solver, phản biện đúng khoảng trống và kiểm chứng
đúng phạm vi. Nội dung từ Codex được đưa vào qua thao tác của người vận hành;
đây không phải API tự chạy từ gói đăng ký. Kết quả lưu trên UI không tự động
trở thành định lý đã chứng minh hay benchmark kín.

## 3. Team access / Quyền truy cập

Create individual verified accounts; the owner invites colleagues from member
settings. Use Viewer for observation, Member for ordinary research work,
Admin for delegated administration, Owner only for responsible maintainers.
Enterprise roles/scope policies can further restrict these capabilities;
the server's authorization checks are authoritative.

Local `MAIL_DRIVER=local` captures mail in process memory and exposes no inbox
route. It cannot deliver team invitations or password-recovery messages to
people. A shared deployment requires SMTP and a tested invitation, email
verification and password-reset flow. Do not manually mark real users verified
or enable global signup merely to get around delivery failure.

**Tiếng Việt:** Mỗi người có tài khoản riêng; không dùng chung Owner. Email local
không gửi thư thật. Phải kiểm luồng mời thành viên và khôi phục mật khẩu qua SMTP
trước khi bàn giao cho nhóm làm việc từ xa.

## 4. What is and is not automatic / Ranh giới tự động hóa

- UI and retained evidence can be used without a paid-model provider.
- The Codex subscription/manual bridge is operator-mediated; it is not an
  application API credential or unattended research service.
- Provider/worker execution is separate and disabled by default. Activating it
  requires scoped identity, provider configuration, resource limits and the
  existing execution/review controls; see
  [worker activation](TIP-024D_RESEARCH_WORKER_ACTIVATION.md).
- Lean/formal verification is an optional configured execution path, not an
  automatic guarantee on all displayed proofs. LaTeX rendering is presentation.
- K6 global closure, external referee approval, novelty and a demonstrated
  general advantage over a single LLM have **not** been established.

## 5. Checks and operations / Kiểm tra và vận hành

Run `npm run typecheck`, `npm run lint` and `npm run test:unit` first. Integration
tests require the isolated `hiveos_test` database and its migrations/runtime
role; never aim them at a team's research database. `npm run test:e2e` builds
and starts the app and must not be launched casually against an active demo.
Use `npm run research:check` for focused developer checks only, not as theorem
acceptance.

For an isolated maintenance build use `HIVE_BUILD_PROFILE=LOCAL_QA npm run build`
and reuse `.next-build`. Ordinary builds use `.next`. The corresponding
`HIVE_BUILD_PROFILE=LOCAL_QA npm start` selects the isolated artifact and refuses
to fall back to an old default artifact. Runtime configuration is injected
separately; production settings are not the local demo environment.

Check `/api/health/live` for process liveness and `/api/health/ready` for
dependency readiness. A healthy process alone is not acceptance: also test
sign-in, a workspace read/write round trip, Viewer write rejection, cross-team
access rejection, bilingual formulas and an evidence download where available.

### Backup and restore

Stop writes for a consistent database/object-store snapshot. With PostgreSQL
16-compatible `pg_dump`/`pg_restore` available, run:

```bash
npm run db:backup:local -- --output=/absolute/new/private-backup-directory
```

The command copies PostgreSQL and local object storage and creates an integrity
manifest. The backup is sensitive; store it outside Git with restricted access
and encryption appropriate to team policy. It does not back up S3 or provider
secret-manager configuration.

Restore only into an explicitly named recovery database and a new/empty storage
directory, never over the team's active database:

```bash
npm run db:restore:local -- \
  --backup=/absolute/private-backup-directory \
  --database-url=postgresql://USER:PASSWORD@HOST:PORT/hiveos_recovery \
  --confirm-target=hiveos_recovery \
  --storage-target=/absolute/new/recovery-storage
```

The URL above is a template, not a real credential. Handle actual credentials
through a secure operator session, not chat, screenshots or shared shell
history. Verify restored data before switching traffic. Use the
[migration recovery runbook](MIGRATION_RECOVERY_RUNBOOK.md) for schema incidents;
do not invent down migrations.

## 6. Before shared deployment / Trước khi deploy

Shipping the standard web container will not make the guarded local research
routes available. A later deployment decision must specify which research
surfaces may be shared, their retained-data packaging and authorization model,
and tests on that target before changing those guards. Do not promise remote
research UI access from the local demonstration alone.

Choose and confirm the target, domain/TLS, operating owner, budget, data region,
database, S3-compatible storage, SMTP and secret manager. Historical AWS staging
records are not proof that the old endpoint is currently live or certified.
`staging-images` is manual-only; pushing code does not dispatch it.

Before release, record the reviewed commit and tested artifact, back up data,
apply migrations through a separate job, inject runtime-only secrets, keep
demo fixtures disabled, and complete authenticated/cross-workspace/recovery
smokes on the selected target. Keep paid workers off unless separately enabled.
Do not publish local research records by copying the development database.

See [environment matrix](ENVIRONMENT_MATRIX.md),
[deployment sequence](DEPLOYMENT_RUNBOOK.md), and
[incident response](INCIDENT_RESPONSE_RUNBOOK.md). Those historical runbooks
describe technical contracts; current owner decisions determine the destination
and scope. No production readiness is claimed by this handoff alone.

### Dependency security triage — 2026-10-13

Installed narrow exact updates: Next.js and eslint-config-next `16.3.8`, sharp
override `0.35.5`, Vitest `4.1.11`. Registry engine requirements support Node 24;
fresh application acceptance is separate from installation. Sources:
[Next.js security release](https://github.com/vercel/next.js/releases/tag/v16.3.8),
[sharp release](https://github.com/lovell/sharp/releases/tag/v0.35.5), and
[Vitest advisory](https://github.com/advisories/GHSA-82fw-gwwq-j7x9).

**Deployment remains blocked by unresolved dependency risk:** Nodemailer 9.1.1,
although suggested by npm audit, does not cover the current affected ranges.
The maintainer's [SMTP AUTH denial-of-service advisory](https://github.com/nodemailer/nodemailer/security/advisories/GHSA-4ffr-jq9g-5ffx)
lists `10.0.13` as patched; moving from our 9.x to 10.x requires separate mail
compatibility review. Prisma 7.9.1 includes vulnerable deepmerge-ts and mysql2
tooling dependencies. See [deepmerge-ts](https://github.com/advisories/GHSA-ggr8-5vv4-36mx),
[mysql2 authentication](https://github.com/advisories/GHSA-3f6p-5ww8-9rcr), and
[mysql2 decompression](https://github.com/advisories/GHSA-rgwj-5xj2-c3m3).
Do not apply npm's proposed Prisma 6 downgrade, an 8.x prerelease, or unchecked
transitive overrides merely to turn the audit green.

An explicitly scoped compatible transitive update then installed fast-uri
`3.1.8`, nanoid `3.3.20`, source-map-js `1.2.2` and baseline-browser-mapping
`2.11.28`, within their existing ranges without new direct pins or overrides.
The resulting full audit reports 13 high affected packages; `--omit=dev`
reports 5 high (@prisma/config, deepmerge-ts, mysql2, nodemailer and prisma).
Both report zero moderate and critical findings. These dependency-graph counts
are not proof that each issue is reachable from a deployed route, but they are
not a clean bill of health either.

The repository's dependency-risk baseline expired on 2026-08-31. It has not
been renewed or waived. Version updates do not by themselves establish a clean
fresh audit or a passing dependency policy. Keep shared deployment deferred.

**Tiếng Việt:** Chỉ nâng các phiên bản hẹp đã nêu và kiểm lại. Rủi ro Nodemailer,
Prisma cùng baseline hết hạn vẫn phải xử lý trước deploy; không âm thầm bỏ qua,
hạ chuẩn hoặc coi lời gợi ý của npm là một bản vá đã tương thích.
