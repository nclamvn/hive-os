# TIP113 — K6 cost qualification / Đo tính khả thi công cụ K6

## Decision / Kết luận

**COST_ASSESSMENT_DONE; WHOLE_PRODUCTION_COST_UNQUALIFIED.**
Two exact resumptions and their independent checks were executed successfully
within the approved diagnostic envelope. Generation is the observed bottleneck.
The evidence does not qualify complete generation plus checking, and does not
prove this method impossible. All-real finite **F6 >= 20/93 remains OPEN**.

VI: Đã đo công cụ thực, không chạy lại từ đầu. Bộ kiểm độc lập kiểm đúng hồ sơ
đã sinh; chưa có cây đủ nhánh. Nút thắt là sinh phân hoạch, không phải tốc độ
kiểm. Chưa đủ cơ sở để chạy toàn bộ, nhưng cũng chưa chứng minh phương pháp
bất khả thi. Không gọi phép đo này là đột phá toán học hay nghiệm thu cận K6.

Owner approved the proposed cost assessment without another question. Activation
2026-10-11 14:31:36 UTC; mathematical execution STOP 14:33:08 UTC, before the
15:01:36 hard stop. No code changes, full production or successor were launched.
Four invocations only; no retry or failed start. This report/checkpoint follows
STOP and adds no mathematical computation.

## Actual measurements

Existing immutable producer/checker from TIP112 were used with internal limits
28 s and outer alarms 30 s. Each output is create-only. Producer starts from
`tip112/MAIN_RESUME_1.json`, not a new tree; its 20 processed nodes and all 13
roots remain present. Second pilot resumes the first. Each pilot has all prior
run-history records, duals, nodes and pending branches.

| Observation | Pilot 1 | Pilot 2 |
|---|---:|---:|
| Newly processed nodes | 4,864 | 3,823 |
| Cumulative processed nodes | 4,884 | 8,707 |
| Created nodes | 5,853 | 10,385 |
| Split nodes | 2,920 | 5,186 |
| Exact empty-interior leaves | 1,964 | 3,521 |
| Pending nodes | 969 | 1,678 |
| Full stationary leaves | 0 | 0 |
| Largest split-wall index (zero-based) | 19 | 22 |
| Producer internal elapsed | 28.000928083 s | 28.001259833 s |
| Producer measured real elapsed | 28.08 s | 28.10 s |
| Checker internal elapsed | 1.263246500 s | 2.380196250 s |
| Checker measured real elapsed | 1.33 s | 2.45 s |
| Certificate bytes | 735,837 | 1,355,326 |

Both producers exit 3, INCOMPLETE/TIME_CAP. Both checkers exit 3,
REFUSED/INCOMPLETE_FOREST_REFUSED. The checker independently reconstructs the
model, traverses every root/branch and verifies the available duals and accounting
before reaching this refusal. This is expected successful partial verification,
not acceptance of global closure. No actual polynomial/stationary leaf was
reached by these pilots, so whole stationary-checking performance is unmeasured.

Largest split index 22 means some paths have only begun the first 23 of 147
declared walls; it is **not a percentage of mathematical coverage**. Wall count
alone does not predict future branch counts, stationary-family cost or closure.

`/usr/bin/time -p` worked for all four calls; no known failing `-l` RSS wrapper
was reused. Real times sum 59.96 s. Conservative charges are 29+2+29+3 =
**63 s / 120 s**, including process startup/serialization in measured real time.
The source guard remained cooperative; exact peak RSS was not emitted, and hard
OS memory containment is not claimed. No resource refusal was observed. The
result does not qualify complete production peak memory.

Metadata inspection afterwards used ordinary read-only `jq`/`wc`/hash/diff
commands, not another producer, model evaluation, search or certificate check.

## Why the assessment does not qualify production

1. The queue grew from 27 pending initially to 969 and then 1,678. It has not
   begun contracting toward a complete forest.
2. The second 28-second producer processed fewer nodes than the first. These
   timings include validating the previously saved evidence on resume; they are
   not isolated simplex microbenchmarks. No constant throughput extrapolation
   or precise attribution to one internal routine is justified.
3. No terminal 147-wall cell was reached. The cost of actual polynomial
   generation, singular stationary disposition and independent full-leaf
   checking is not captured by these native pilots.
4. There is no credible bound on remaining actual branches or resulting bytes.
   Small current files do not establish eventual fit under the 64 MiB evidence,
   512 MiB state or process ceilings.

Source review explains the observed pressure: the producer processes a
breadth-oriented pending queue; each node solves a fresh exact common-slack LP
for its path and advances only one fixed-order wall. Resume also verifies the
existing forest before adding work. This is a source-grounded diagnosis, not
an instrumented per-routine profile. The independent checker is substantially
cheaper than generation for **these partial certificates only**.

VI: Không có lý do khoa học để lấy tốc độ 28 giây đầu rồi nhân tuyến tính ra
thời gian toàn bộ. Cây còn tăng, các ô cuối chưa được xử lý, số nhánh còn lại
chưa có chặn đáng tin. Vì vậy dừng mở rộng phép chạy là quyết định đo được,
không phải mất cam kết với mục tiêu toán học.

## Next technical decision — no automatic execution

Do not add another gate, UI, agent framework or simply run this breadth-first
enumeration for longer. The existing verifier should remain the trust anchor.
An eligible improvement would reduce **necessary partition work**, for example
exactly certifying redundant wall signs or terminal incidence before splitting
all remaining walls, with independent checking and a completeness argument.
Warm-start/caching may improve constants, but alone is not a remaining-work bound.
Changing to depth-first traversal could reach leaves earlier for diagnosis; it
does not reduce the total partition and must not be sold as mathematical closure.

Such an improvement requires its own explicit design/verification scope. It was
not implemented in this cost-only task. The ultimate obligation stays the same:
complete admissible coverage and stationary-family exclusion, not another finite
sample. No production or fresh resource authority is minted by this report.

VI: Ưu tiên có căn cứ là giảm số phép chia thực sự cần thiết bằng chứng chỉ
chính xác, giữ bộ kiểm độc lập và chứng minh tính đầy đủ. Đổi thứ tự duyệt hoặc
thêm thời gian chỉ giúp quan sát/chạy nhanh hơn; tự nó không chứng minh K6.

## Completion / Verify

STATUS: DONE for the cost assessment; NOT READY for whole production.
Requirement coverage: C113-1..4, 4/4 (100%) scoped requirements fulfilled.
Scenario results: two preserving resumptions and two independent partial checks
behaved as required; 4/4 PASS, zero failed starts, zero unexpected failure.
No global positive-acceptance scenario occurred.
Technical health: unchanged source hashes; `git diff --check` PASS; no build,
type/lint run or repeated unit suite needed because no source changed. Existing
TIP112 27-test evidence remains retained, not reported as rerun here.
Critical unresolved issue: complete cost/remaining work is unqualified; all-real
K6 proof remains open. No extra implementation, deferred UI or source patch.

Created: this report, TIP113 charter, two pilot JSONs and two checker JSONs.
Modified: append-only active commitment and handoff. No app/runtime changes.
No installs, API, paid calls, Git commit/push, Docker, build, project copy,
new distDir, scratch or deletions. Preflight disk 50 GiB free. All old dirty
predecessor sources/evidence preserved. Vibecode was reduced to scoped planning,
running already-reviewed tools and verification; no Builder/code work was needed.

## Integrity pins (not proof)

- Producer: `9f71612ddcd3aefb5ef7086d4eb3f501f597bdf8c6613f8b00d764b14efc1da1`
- Checker: `14d538896ef75ef3d6c72016c8c33eedb66372460f402c7ad005bfb1c19b9b40`
- Starting resume: `691e60d5ffab831cea8ea2ad3095cfc70a87b04342032fb5535ad7baa9988dbb`
- Pilot 1: `1542168dba4e0302987e43d834050400db7396beb625f9bc477cc6e923d88ca9`
- Pilot 2: `87c0b4c48eca955c51f0ed652e0dc90c10cffb6aacf33fbabb02463d5bb9c42c`
- Check 1: `aef0457e0684bd4fae19ee9b5ae77d0227ab6f6c05dbbcc332567a4a6a1a9cbb`
- Check 2: `972e21a02439cb4378d076a88df4c8cc6e3c4e02a2c7038e8583ec5aff979637`

The new established fact is measured behavior and a concrete partition-generation
bottleneck in this existing toolchain. What remains missing is a complete exact
certificate and credible cost bound, not another smoke test or new infrastructure.
