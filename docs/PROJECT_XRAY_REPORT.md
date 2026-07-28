# HIVE OS — X-Ray báo cáo dự án

> Ảnh chụp toàn diện ("X-quang") kiến trúc, quản trị, bảo mật và chất lượng của dự án.
> Ngày lập: **2026-07-28** · Nhánh: `codex/tip-015-execution-operations` · Commit gần nhất: `1f573f6`

---

## 0. Tóm tắt điều hành (TL;DR)

HIVE OS là một hệ điều hành vận hành **"governed truth"** (sự thật có quản trị) — mọi khẳng định công khai hoặc vận hành đều phải truy vết được từ **nguồn → trích xuất/quyết định → trạng thái claim → biến đổi → xác minh → phạm vi phát hành**. Hệ thống được xây bằng Next.js 16 (App Router) + React 19 + Prisma 7.9 (PostgreSQL) + better-auth, tổ chức thành **8 kernel/module** độc lập, dùng **ledger append-only bất biến** và **cổng kiểm soát (gate) fail-closed**.

| Chỉ số | Giá trị |
|---|---|
| Mã nguồn | 144 file TS/TSX · ~20.011 dòng |
| Module lõi | 8 kernel |
| Test | 53 file (≈273 test: 106 unit · 103 integration · 64 e2e) |
| Tài liệu | 58 file `.md` |
| Migrations Prisma | 13 |
| Trạng thái | **Local Release Candidate đã ký (2026-07-24)** |

### Tình trạng sức khỏe kỹ thuật (chạy trực tiếp ngày lập báo cáo)

| Kiểm tra | Kết quả |
|---|---|
| `npm run typecheck` (tsc) | ✅ PASS — 0 lỗi |
| `npm run lint` (eslint) | ✅ PASS — 0 lỗi / 0 cảnh báo |
| Node.js | v24.14.1 |
| Next.js | 16.2.11 (Turbopack) |
| Dev server | ✅ chạy tại `http://localhost:3000` |
| Database | ✅ `hiveos-db` (Docker, port 5433) — healthy |

---

## 1. Ngăn xếp công nghệ (Tech Stack)

| Lớp | Công nghệ | Phiên bản |
|---|---|---|
| Framework | Next.js (App Router, Server Components/Actions) | 16.2.11 |
| UI | React / React DOM | 19.2.4 |
| Ngôn ngữ | TypeScript | ^5 |
| ORM / DB | Prisma + `@prisma/adapter-pg` / PostgreSQL | 7.9.0 |
| Xác thực | better-auth (+ `next-js`, `prisma` adapter) | 1.6.23 |
| Validation | Zod | 4.4.3 |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) | ^4 |
| Icon | lucide-react | 1.25.0 |
| Lưu trữ đối tượng | `@aws-sdk/client-s3` (+ local `.storage/`) | 3.1090.0 |
| Test | Vitest 4.1.10 · Playwright 1.61.1 · `@axe-core/playwright` |

---

## 2. Kiến trúc — 8 Module lõi

Mỗi module là một *kernel* tất định (deterministic), không I/O ngoài, với hợp đồng (contract) rõ ràng, lỗi có mã, và projection từ ledger.

### 2.1 `identity-workspace` — Danh tính & Quản trị Workspace
Vòng đời xác thực, tạo workspace, quản lý thành viên, RBAC, chính sách workspace, và audit.
- **Key files:** `context.ts` (WorkspaceContext, resolve phía server), `workspace.ts`, `permissions.ts` (OWNER/ADMIN/MEMBER/VIEWER → capability), `invitations.ts`, `policy.ts`, `audit.ts` (ledger insert-only qua DB trigger), `onboarding.ts`, `slug.ts`.
- **Hàm chính:** `resolveWorkspaceContext()`, `createWorkspace()`, `addMember()/removeMember()/changeRole()`, `sendInvitation()/acceptInvitation()`, `writeAuditEvent()`.

### 2.2 `mission-kernel` — Hợp đồng & Máy trạng thái
Vòng đời nhiệm vụ DRAFT → RELEASED, versioning hợp đồng, requirement/obligation/gate, decision gating, escalation.
- **Key files:** `mission.ts`, `contract.ts`, `state-machine.ts`, `obligations.ts`, `gates.ts` (GateRun append-only), `decisions.ts`, `escalations.ts` (P0–P3), `progress.ts`, `assurance.ts`.
- **Hàm chính:** `createMission()`, `submitContract()/approveContract()`, `transitionMission()`, `evaluateGate()`, `resolveDecision()`.

### 2.3 `truth-kernel` — Ledger Bằng chứng & Claim
Nguồn bằng chứng & snapshot bất biến, versioning claim, evidence span khớp văn bản chính xác, dispute, honest-null.
- **Key files:** `kernel.ts`, `rules.ts`, `projection.ts` (trạng thái claim tính từ ledger), `errors.ts`.
- **Hàm chính:** `createEvidenceSource()`, `captureSnapshot()` (địa chỉ SHA-256), `createEvidenceSpan()` (nửa mở `[start,end)`), `createClaim()/addClaimVersion()`, `assertHonestNull()`, `setTerminalClaimState()`.

### 2.4 `skill-runtime` — Registry Kỹ năng & Versioning
Registry hợp đồng skill bất biến, semantic versioning, content-hash, projection version active.
- **Hàm chính:** `registerSkill()`, `registerSkillVersion()` (không tự kích hoạt), `activateSkillVersion()`, `changeSkillStatus()` (ACTIVE→DEPRECATED→ARCHIVED).

### 2.5 `execution-fabric` — Cầu nối Thủ công & Ledger Artifact
Điều phối ExecutionTip, run skill/agent, artifact bất biến (SHA-256), luồng thực thi thủ công theo vai trò (CONTRACTOR/BUILDER/VERIFIER), import completion report, deviation, đo tài nguyên.
- **Hàm chính:** `createExecutionTip()`, `issueManualRun()`, `retryManualRun()`, `importCompletionReport()`, `resolveExecutionDeviation()`.

### 2.6 `verification-governance` — Chuẩn Verify & Ủy quyền Phát hành
Kịch bản xác minh bất biến, cưỡng chế tính độc lập của verifier, hoàn tất run, đánh giá "evidence ceiling" cho đủ điều kiện public, signoff của con người, ủy quyền release.
- **Hàm chính:** `createVerificationScenario()`, `beginVerificationRun()/completeVerificationRun()`, `recordGovernanceSignoff()`, `authorizeGovernedRelease()` (tạo ReleaseManifest bất biến).

### 2.7 `mission-templates` — Mẫu Nhiệm vụ Dựng sẵn
`catalog.ts` chứa `MISSION_TEMPLATES` — 4 mẫu: `rapid-operational-brief` (QUICK), `professional-product-delivery` (PROFESSIONAL), `research-evidence-synthesis` (RESEARCH), `regulated-decision-record` (REGULATED).

### 2.8 `observatory` — (Placeholder)
Dành cho lớp phân tích/report tương lai; hiện là README, sẽ đọc ReleaseManifest bất biến cho dashboard công khai.

---

## 3. Mô hình miền (Domain Model — Prisma)

**Xác thực (better-auth sở hữu):** `User`, `Session`, `Account`, `Verification`.

**Danh tính & Quản trị:** `Workspace` (ACTIVE/SUSPENDED/ARCHIVED), `WorkspacePolicy`, `Membership` (role OWNER/ADMIN/MEMBER/VIEWER), `Invitation` (token hash, single-use).

**Audit:** `AuditEvent` — append-only, insert-only qua DB trigger, payload redaction theo schema.

**Nhiệm vụ & Hợp đồng:** `Mission` (DRAFT→…→RELEASED + PARTIAL/BLOCKED/REFUTED/CANCELLED/ARCHIVED), `MissionContract` (versioned), `Requirement`, `Assumption`, `Constraint`, `MissionInput`.

**Obligation & Gate (projection runtime):** `ContractObligation`/`RuntimeObligation`, `ContractGate`/`RuntimeGate`, `GateRun` (append-only, actor HUMAN_COMMAND/DETERMINISTIC_KERNEL).

**Quyết định & Leo thang:** `Decision` (CONTRACT_AMENDMENT/SCOPE_CHANGE/ASSURANCE_DOWNGRADE/…), `Escalation` (P0–P3).

**Sự thật & Bằng chứng (ledger bất biến):** `EvidenceSource`, `Snapshot` (SHA-256), `EvidenceSpan` (nửa mở), `Claim` (DRAFT→…→PROVED_INTERNAL/FALSIFIED/RETRACTED/HONEST_NULL), `ClaimVersion`, `ClaimEvidence` (SUPPORTS/CONTRADICTS), `Dispute`, `HonestNullRecord`, `ProvenanceEdge`.

**Kỹ năng:** `Skill` (activeVersionId duy nhất), `SkillVersion` (bất biến, content-hash, schema I/O JSON).

**Thực thi:** `ExecutionTip`, `ExecutionTipDependency`, `ExecutionArtifact` (SHA-256, insert-only), `SkillRun`, `AgentRun` (role + chuỗi retry), `CompletionReport`, `ExecutionDeviation`, `ResourceUsageRecord`.

**Xác minh & Phát hành:** `VerificationScenario`, `VerificationRun` (independence), `VerificationRequirementCoverage`, `VerificationScenarioResult`, `VerificationTechnicalHealth`, `CorruptionTestRun`, `VerificationReport` (4 mục theo Verify Standard), `GovernanceSignoff`, `EvidenceCeilingAssessment`, `GovernedRelease`, `ReleaseManifest` (bundle canonical bất biến).

---

## 4. Định tuyến ứng dụng (`src/app/`)

**Ranh giới xác thực:** `/` (điều hướng gốc) · `/sign-in` · `/sign-up` · `/onboarding` · `/invitations/[token]`.

**Định tuyến theo workspace (`/w/[workspaceSlug]/`):** home · `missions` (+ `/new`, `/[missionId]`) · `evidence` · `claims` · `skills` · `execution` · `verification` · `templates` · `control-room` · `reports` · `observatory` · `settings` (+ `/workspace`, `/members`, `/audit`).

**API:** `/api/health` · `/api/auth/[...all]` (better-auth) · `/api/w/[slug]/exports/audit` · `/exports/verification/[reportId]` · `/exports/release/[releaseId]`.

**Server Actions (`src/app/actions/`):** `identity.ts` · `missions.ts` · `truth.ts` · `execution.ts` · `verification.ts` · `skills.ts` · `settings.ts` — mỗi action đều resolve `WorkspaceContext` phía server → cưỡng chế capability theo vai trò → ghi audit.

---

## 5. Mô hình Quản trị (Governance)

### Hệ thống TIP (Tracked Implementation Phase)
Mỗi TIP là một gói công việc có giới hạn, cần **Owner (Lâm) ủy quyền tường minh**. Ủy quyền **không** lan truyền: TIP sau không được suy ra quyền từ việc TIP trước đã xong.

### Mô hình Gate (G0–G6)
| Gate | Nội dung | Trạng thái |
|---|---|---|
| G0 Scan | Phạm vi & pre-flight | PASS |
| G1 Blueprint | Kiến trúc & thiết kế | PASS |
| G2 Foundation | Hạ tầng lõi | PASS_WITH_DEFERRED |
| G3 Mission Loop E2E | Kernel nhiệm vụ end-to-end | **HOLD** (Owner hoãn; chặn bởi billing) |
| G4 Truth Loop | Truth Kernel | PASS (local) |
| G5 Execution & Verification | Full stack | PASS (local) |
| G6 UI/Security/RC | Fidelity, a11y, bảo mật, RC | **PASS** (Local RC ký 2026-07-24) |

**`PASS_WITH_DEFERRED`** = hoàn tất cục bộ nhưng mang theo nghĩa vụ cần điều kiện ngoài (billing, CI từ xa, deploy production) hoặc TIP tương lai.

### Chính sách Đảm bảo (Assurance Profiles)
| Profile | Duyệt | Verify sau | Signoff phát hành | Đủ điều kiện public |
|---|---|---|---|---|
| QUICK | Owner/Admin | Không | Không | Không |
| PROFESSIONAL | Owner/Admin | Không | Không | Không |
| RESEARCH | Owner/Admin | Có | Có | Có (gate `INDEPENDENT_VERIFICATION`) |
| REGULATED | **Chỉ Owner** | Có | Có | Có (`INDEPENDENT_VERIFICATION` + `HUMAN_RELEASE_SIGNOFF`) |

### Bất biến quản trị cốt lõi
1. Tạo mission + contract v1 là **atomic**; APPROVED dừng trước các kernel sau.
2. Contract đã duyệt **bất biến** ở cả tầng service lẫn DB.
3. Chuyển trạng thái **fail-closed**, an toàn tương tranh; `INCOMPLETE ≠ PASS`.
4. Ledger **append-only** (GateRun/AuditEvent/ReleaseManifest/VerificationRun) — 3 lớp: privilege + trigger + schema.
5. Hành động vật chất cần **Decision record**; mọi claim public có provenance + ủy quyền release.
6. BLOCKED tạo Escalation; resume trả về đúng trạng thái đã ghi.
7. Quyết định thay đổi thẩm quyền workspace / chọn REGULATED / hạ profile: **chỉ Owner**.
8. Tối đa **một** contract DRAFT/IN_REVIEW mỗi mission (partial unique index `mission_contract_one_current`, TIP-004C).

---

## 6. Tư thế Bảo mật (Security)

### Xác thực (ADR-001)
better-auth 1.6.23 sở hữu User/Account/Session/Verification, email+password, cookie HTTP-only (Secure theo protocol). HIVE giữ quyền Workspace/Membership/Invitation/audit (**không** dùng Organization plugin). Rate limit bật mặc định, schema env **từ chối tắt** trong production.

### Cô lập Workspace
`resolveWorkspaceContext()` xác thực session + yêu cầu **membership active**; mọi truy vấn lọc theo `ctx.workspace.id` (ID client không bao giờ là thẩm quyền). Workspace/membership thiếu đều trả **404** (chống dò tìm).

### Tách vai trò Database (least privilege)
| Kết nối | Role | Quyền |
|---|---|---|
| Migration | `hiveos` (owner) | Đầy đủ schema/migration |
| Runtime | `hiveos_app` | Chỉ DML thường; `audit_event` chỉ SELECT/INSERT; **không** superuser/createdb/createrole/bypass RLS |

`audit_event` bảo vệ 2 lớp: role thiếu UPDATE/DELETE **và** trigger DB từ chối UPDATE/DELETE với mọi role.

### Ma trận Quyền (tóm tắt)
| Capability | Owner | Admin | Member | Viewer |
|---|:--:|:--:|:--:|:--:|
| workspace.read | ✅ | ✅ | ✅ | ✅ |
| workspace.update | ✅ | ✅ | ❌ | ❌ |
| members.invite | ✅ | ✅ | ❌ | ❌ |
| members.manage_owner | ✅ | ❌ | ❌ | ❌ |
| audit.read | ✅ | ✅ | ❌ | ❌ |

**Bất biến:** Admin **không** đụng được Owner; luôn giữ **≥1 Owner active** (demote/suspend bị chặn trong transaction).

### Mối đe dọa & Giảm thiểu (TIP-003)
Session theft/fixation · rò rỉ token mời (256-bit, chỉ lưu SHA-256, TTL 7 ngày, single-use) · truy cập chéo workspace · giả mạo audit · đua thẩm quyền (lock + re-validate) · open redirect (same-origin, không honor `next`).

**Rủi ro tồn dư:** giả định HTTPS ở production; link mời phải chia sẻ qua kênh tin cậy; email verification & password reset **hoãn**.

---

## 7. Ranh giới Dữ liệu (Data Boundaries)

| Lớp | Nơi | Nạp | Quy tắc |
|---|---|---|---|
| Production | DB + object store production | Chỉ vận hành thật | **Không bao giờ seed** |
| Development | `hiveos_dev` (Docker :5433) + `.storage/` | Dev tạo thủ công | Chỉ local |
| Demo fixtures | `src/server/fixtures/demo.ts` | Chỉ khi `DEMO_FIXTURES_ENABLED=true` và `NODE_ENV≠production` | Schema từ chối ở production |
| Test fixtures | `tests/fixtures/` + `hiveos_test` | Test runner qua `.env.test` | DB tách biệt |

**Bảo đảm:** không có metric tổng hợp/giả (uptime, %, điểm verify, token, số agent…); ưu tiên empty state hơn dữ liệu bịa.

---

## 8. Chất lượng & Kiểm thử

### Kim tự tháp test (~273 test)
- **Unit (15 file):** permissions, audit-redaction/schema, mission-state-machine, verification/execution/skill-contracts, truth-rules, mission-templates, env, fixtures, rate-limit, design-tokens, storage-local.
- **Integration (16 file):** identity, auth, concurrent-owner, mission(+concurrent), contract-uniqueness, workspace-policy, verification-governance, truth, execution-fabric, skill-registry, database, audit-payload, dashboard, control-room.
- **E2E (16 spec, 64 kịch bản):** foundation, identity(+visual), mission(+visual/workspace), execution/verification/truth-operations, shell(+visual), control-room(+visual), product-surfaces, settings-operations, templates-skills.

### Sức khỏe kỹ thuật (TIP-019 Local RC — 2026-07-24)
| Chỉ số | Kết quả |
|---|---|
| Production build | PASS |
| Type errors / Lint errors / warnings | 0 / 0 / 0 |
| Unit / Integration / E2E | 106 / 103 / 64 passed |
| npm vulnerabilities (moderate) | 0 |
| A11y vi phạm serious/critical | 0 |
| Tràn ngang @320px | 0 |
| Migrations | 12→13 hiện hành |
| Fresh install / Upgrade / Backup-restore | PASS (54 bảng) |

**Hiệu năng (loopback local, không phải SLO production):** `POST /sign-in` ~14ms · `GET /api/health` ~11ms.

---

## 9. Trạng thái Release Candidate & Khoảng trống đã biết

**Local RC: ĐÃ KÝ (2026-07-24, TIP-019).** Sản phẩm local hoàn chỉnh tính năng và đã được làm cứng. **Chưa** tái lập được từ xa và **chưa** deploy production.

### Chuỗi TIP đã hoàn tất (đều verify local)
TIP-005 Truth Kernel · TIP-006 Skill Registry · TIP-007 Execution Fabric · TIP-008 Verification Governance · TIP-009 Mission Workspace · TIP-010 Dashboard · TIP-011 Observatory/Reports · TIP-012 QA/RC · TIP-013 Truth Operations · TIP-014 Templates & Skill Library · TIP-015 Execution Operations · TIP-016 Verification Operations · TIP-017 Settings Control Plane · TIP-018 Cross-surface Discovery · **TIP-019 Local Hardening & RC (PASS)**.

### Nghĩa vụ hoãn / khoảng trống
1. **`OBL-FND-001` (BLOCKED_EXTERNAL):** billing GitHub Actions → CI từ xa chưa chạy → chặn G3 từ xa.
2. **`OBL-DEP-001`:** npm audit mới bị hoãn (quyền).
3. **`OBL-DEP-002`:** cảnh báo deprecation `pg` của Prisma adapter — cô lập cho bản cập nhật dependency, không ảnh hưởng chức năng.
4. **Deploy từ xa / Observatory production:** cố ý hoãn tới khi Local RC ký & billing giải quyết.
5. **Tái lập từ xa:** chưa chứng minh, phụ thuộc billing.

---

## 10. Đánh giá tổng thể

| Trục | Nhận định |
|---|---|
| **Quản trị** | Kỷ luật gate theo hợp đồng, ủy quyền Owner tường minh mỗi TIP; "governed truth" đảm bảo mọi claim truy vết về bằng chứng. |
| **Bảo mật** | Phòng thủ nhiều lớp: session, cô lập workspace, DB least-privilege, audit bất biến (privilege + trigger), rate limit, ma trận quyền có bất biến. Rủi ro tồn dư được ghi rõ. |
| **Chất lượng** | Kim tự tháp test đầy đủ (~273 test); 0 lỗ hổng phụ thuộc; 0 vi phạm a11y nghiêm trọng; fresh install & upgrade đã kiểm chứng. |
| **Toàn vẹn dữ liệu** | Tách bạch nghiêm ngặt production/dev/demo/test; không metric giả; ưu tiên empty state. |
| **Hiện trạng** | Toàn bộ kiến trúc local hoàn tất & làm cứng (TIP-019). Chờ giải quyết billing GitHub Actions (`OBL-FND-001`) để chạy CI từ xa và tiến tới production. |

**Rủi ro nổi bật cần theo dõi:** (1) billing CI đang chặn tính tái lập từ xa — rủi ro vận hành chính; (2) tính năng bảo mật hoãn (email verification, password reset) trước khi lên production; (3) deprecation `pg` cần dọn trong chu kỳ dependency.

---

*Báo cáo do Claude Code tạo tự động từ mã nguồn, tài liệu `docs/`, git history và kiểm tra sức khỏe trực tiếp (typecheck/lint/dev server/DB) ngày 2026-07-28.*
