# TIP112 — K6 exact certificate toolchain / Công cụ chứng nhận K6

## Outcome / Kết quả

**ENGINEERING_ACCEPTED_SCOPED — READY_FOR_BOUNDED_COST_QUALIFICATION.**
The exact producer and independently implemented checker now exist. Twenty-seven
focused tests passed; native generation, checkpoint resume and independent
refusal of unfinished forests behaved as required. This is an engineering
milestone, **not** a complete K6 lower-bound certificate.

**Đã nghiệm thu phạm vi công cụ:** bộ sinh hữu tỉ chính xác và bộ kiểm độc lập
đã được triển khai; 27 kiểm thử đạt, lưu–tiếp tục và từ chối hồ sơ thiếu nhánh
hoạt động đúng. Cận toàn miền hữu hạn **F6 >= 20/93 vẫn OPEN**. Chưa chạy sản
xuất đầy đủ; chưa biết tổng chi phí sinh và kiểm. Không tuyên bố giải Kakeya
tổng quát, kết quả mới được cộng đồng công nhận hay lợi thế A/B của phương pháp.

Activation: 2026-10-11 14:11:00 UTC. Engineering/scientific execution STOP:
14:25:48 UTC, before the 15:11 hard stop. The 60-minute engineering and
120-second mathematical-test grant was not exhausted or reissued. Reporting
after STOP involves no new mathematics. Whole production was excluded throughout.

## Implemented scope / Phạm vi đã thực hiện

Model: p6=0, Aj=pj+j, G=6F6, target 40/31. All 13 necessary strict apex words,
147 affine walls and 21 quadratic monomials are regenerated exactly. Each root
has 30 true pairwise range inequalities and five full word-order inequalities.

Producer uses exact rational two-phase Bland simplex, independently checkable
duals and a split forest with both children. Empty strict interiors are
certified; full-depth cells use the actual event-spline quadratic. Full
five-variable stationarity and **entire** singular-family feasibility are used,
not infeasibility of one chosen solution. Resume preserves the tree and run
history. Limit/interruption cannot silently turn an unfinished forest COMPLETE.

Checker imports no producer model, area, LP or elimination implementation. It
reconstructs walls and inequalities, derives the polynomial through endpoint
coverage/slab integration, verifies dual inequalities, independently eliminates
the full stationary system, and checks complete root/tree ownership. Pending
nodes, missing children/roots, altered polynomials and false completeness refuse
whole acceptance. A producer COMPLETE label alone is never proof acceptance.

The retained compact/minimum, C1, range, apex-word and two-component reductions
are explicit dependencies. Finite closure-density covers incident faces; full
ambient stationarity is required there. The hand/source proof contract is in
`artifacts/research/tip112/CERTIFICATE_SOUNDNESS.md`. A supplementary AI critic
found no blocking mathematical soundness defect after repair; this is neither
external referee approval nor formal verification.

VI: Chứng chỉ đối ngẫu được kiểm lại từ các bất đẳng thức do bộ kiểm tự dựng.
Các mặt biên không bị bỏ qua; họ nghiệm dừng suy biến được xét toàn bộ. Bộ kiểm
tự dựng lại đa thức diện tích hợp thực bằng phương pháp khác bộ sinh. Tuy nhiên,
chưa có cây hoàn chỉnh được sinh và chấp nhận, nên chưa có chứng minh toàn miền.

## Verify — requirement coverage

| Requirement | Reviewed implementation and evidence | Scoped verdict |
|---|---|---|
| R112-1 | 13/147/21/35 exact model; independent regeneration | PASS |
| R112-2 | Exact producer, duals, full stationarity, guarded transactional resume | PASS |
| R112-3 | Independent model/polynomial/dual/RREF/tree checker; tamper controls | PASS implementation; full positive forest NOT RUN |
| R112-4 | 12 producer + 15 checker tests; four native CLI integration controls | PASS |
| R112-5 | Main full source/proof review, critic findings, this EN/VI ledger and checkpoints | PASS |

Coverage is 5/5 **engineering requirements**, not coverage of all geometric
cells. Ordinary AST syntax checks passed. No application build/type/lint was
needed for these standard-library proof-only Python files. `git diff --check`
passed. Frozen sources were not changed after the tests.

## Actual execution ledger / Nhật ký thực thi

Six mathematical invocations, conservatively charged **6 seconds / 120 seconds**.
No mathematical failed starts, no reruns, no running mathematical process.
Expected INCOMPLETE/refusal exit 3 is a successful negative control, not a
failed proof test. Two measurement wrappers failed and are disclosed below.

| Invocation | Result | Helper internal seconds | Charge |
|---|---|---:|---:|
| Producer tests, create-only `BUILDER_TESTS_1.json` | Exit 0; 12/12 PASS | 0.186599625 | 1 s |
| Checker tests, `--seconds 8` | Exit 0; 15/15 PASS | 0.339538708 | 1 s |
| Producer native `--seconds 8 --max-nodes 18` | Exit 3; INCOMPLETE/NODE_CAP | 0.102495458 | 1 s |
| Independent check of smoke, `--seconds 5` | REFUSED/INCOMPLETE_FOREST_REFUSED; wrapper exit 1 | 0.016779958 | 1 s |
| Producer resume, `--seconds 5 --max-nodes 2` | INCOMPLETE/NODE_CAP; wrapper exit 1 | 0.033902458 | 1 s |
| Independent check of resume, `--seconds 5` | Exit 3; REFUSED/INCOMPLETE_FOREST_REFUSED | 0.017292333 | 1 s |

Helper internal sum is approximately 0.69660854 s; it is **not** the complete
invocation wall time. Producer-test tool wall was 0.189378291 s; checker-test
internal time exceeded its tool wall field 0.288021708 s. Both observations
are retained rather than silently normalized. Each invocation is charged 1 s.

Smoke created 45 nodes: 18 processed, 16 splits, two dual-certified empty leaves,
27 pending. Resume created 47 nodes: 20 processed, 17 splits, three empty leaves,
27 pending. All 13 roots were present; no full stationary leaf was reached in
these native smoke forests. History records 18+2 processed nodes. Independent
checks validated model/tree/real empty duals/accounting before refusing pending
coverage. Four native artifacts preserve these results.

The fixed real-leaf unit control reproduces the retained local stationary
point p*=(49,43,23,26,6)/31, rank five, G=40/31. Producer agrees with both
immutable area paths; checker independently reproduces all 21 coefficients
and the retained local Hessian. This is **old local mathematics reproduced as
a control**, not new global progress. Synthetic singular/dual fixtures are
helper controls, not actual geometric coverage certificates.

`/usr/bin/time -l` wrapped the smoke checker and resumed producer. Both children
saved their expected payloads before the wrapper failed with
`sysctl kern.clockrate: Operation not permitted`; wrapper exit 1 is preserved.
No measurement retry occurred. Exact peak RSS was not emitted. Cooperative
measured-peak guards passed, but **hard OS memory containment and production
peak memory are not established**. The wrapper failures are instrumentation
failures, not hidden successes or mathematical counterexamples.

## Repairs and failure history / Các sửa lỗi được giữ lịch sử

Before scientific tests: explicit gauge-field interoperability; decimal-string
metadata compatible with float-refusing proof input; refusal reason cannot be
overwritten COMPLETE when pending is zero; timer starts before resume parsing;
resume traversals guarded; child/parent/processed-count mutation rolls back
transactionally on interruption; cumulative run history retained. These are
source-review findings, not failed mathematical runs. Critic review preserves
the predecessor versions/findings. Checker Builder's final-message stream
disconnected during completion reporting; its frozen source, saved 15-test
ledger and Main integration evidence were already present. No rerun was needed.

## Integrity, disk and boundaries

Frozen SHA-256:

- producer: `9f71612ddcd3aefb5ef7086d4eb3f501f597bdf8c6613f8b00d764b14efc1da1`
- producer tests: `c5ef609f21d7f3cb8da75aac945ff98f089033f03ad1425bda391998b61bd73a`
- checker: `14d538896ef75ef3d6c72016c8c33eedb66372460f402c7ad005bfb1c19b9b40`
- checker tests: `e8070aef312ad7f8c791dfe12f5c6c443a59bca9750e85ad6ee5023838d58e16`
- producer test evidence: `e72fc993705d46b47a37707e9125ba84b9e687c66181e5057ebb5b79b9cff6fe`

Main rechecked unchanged TIP111 charter/report, TIP109 C report, TIP108F report,
TIP110 report and immutable TIP098 area source. Earlier uncommitted predecessor
artifacts are preserved. Hashes are integrity metadata, not mathematical proof.

Only new proof artifacts/docs and append-only active/handoff checkpoints were
changed. Artifacts occupied 152 KiB at final inspection; disk 50 GiB free.
No bytecode cache, disposable scratch or new build folder was created; nothing
was deleted. No dependency install, app/UI/DB/auth/config change, paid API,
Docker, project copy, build, Git commit or push. Vibecode separated Contractor
review from two independently owned implementations; it did not add runtime
gates or an agent platform.

## Remaining obligation / Nghĩa vụ còn lại

**Global K6 OPEN.** A positive complete-forest acceptance path has not been
executed. Total generation/checking cost, forest size and production memory are
unknown. Tiny tests are not a credible full-runtime extrapolation.

The next eligible route is bounded **cost qualification of this existing exact
toolchain**, with both generation and independent checking measured, before
deciding whether whole production fits an expressly approved envelope. Do not
replace whole closure with another sample, regional lemma or count. No successor,
new budget, target or whole production is authorized by this terminal report.

VI: Công cụ thiếu trước đây đã có; bước toán học còn thiếu là sinh và kiểm
**cây đầy đủ** với chi phí được xác định. Trước hết cần định lượng tính khả thi
của công cụ hiện có, không xây thêm hạ tầng hoặc gọi kiểm thử hữu hạn là đột phá.
TIP112 dừng ở nghiệm thu công cụ; không tự mở chiến dịch tiếp theo.
