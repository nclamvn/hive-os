# TIP115 — selective incidence: verified experiment, no terminal gain

STATUS: ENGINEERING_VERIFIED_EXPERIMENTAL; RESEARCH_BENEFIT_NOT_DEMONSTRATED.
Mathematical execution STOP 2026-10-11 15:52:01 UTC, before16:43:22 hardstop.
Global all-real finite K6 F6>=20/93 remains OPEN. No whole production readiness.

## Kết luận / Outcome

Đã sửa hẹp việc nhận biết điều kiện incidence đã được chứng minh, không giải
thêm LP để tìm chứng chỉ tại mỗi nút. Bản mới vượt11/11 kiểm thử và xử lý thêm
586 nút so với350 trong cùng18 giây. Nhưng cả hai vẫn có0 miền dừng stationarity
được kiểm độc lập trong lượt tự sinh: **chưa tạo tiến triển chứng minh K6**.
Lượt này loại trừ thêm252 miền rỗng, so với147 của bản cũ; đó là chứng chỉ cục bộ
trong cây chưa hoàn tất, không phải bao phủ toàn miền hay nâng cận dưới.

The selective wrapper is sound at the reviewed/tested scope and lighter on
eligibility, but the promised decision metric did not improve: zero generated
stationary terminal cells in BOTH matched outputs. Additional exact empty-cell
exclusions and processed nodes are secondary partial work, not global closure.
The fixed94-sign positive control repeats the predecessor result40/31, not a
new theorem. No smaller-area witness, new global lower bound, novelty, formal
Lean acceptance, external referee acceptance or causal HIVE advantage established.

**Decision: STOP this optimization route.** Keep the wrapper experimental and
nondefault. No longer run, larger budget, DFS/queue swap, validation bypass,
helper-wide optimization or infrastructure follow-up. Return-to-structure is
the next routing candidate, not automatically executed under this engineering
grant. Preserved TIP109 regionalC theorem and TIP108F exclusions stay unchanged.

## 1. Actual bottleneck, not assumed bottleneck

Standard cProfile on immutable TIP114, same TIP113 saved input. The8s diagnostic
spent its entire interval validating resume certificates;0 nodes processed.
An additional18s profile reached32 new nodes. In that profile pending_paths
cost12.764s cumulative, classify18 calls4.251s, incidence_rows18 calls1.734s,
direct_implication1313 calls1.553s, check_implication369 calls0.619s,
implication21 calls0.539s. These cumulative times are NESTED, not additive.
Profiler overhead changes absolute timing/work reached; not native performance
or a full-proof cost estimate. Saved pstats and PROFILE_FINDINGS.md retain data.
The first short profile's failure to reach classification is retained, not
discarded or called an execution failure.

The observation does not license removing verification. Input proof checks are
unchanged. No wider optimization of resume validation or incidence reconstruction.

## 2. Narrow source change and exact inference

New producer90 lines imports pinned immutable TIP114 and replaces only its
in-memory classifier. Its positive-normalized root/path/bounding inequalities
map to exact source index and scale. If target=scale*source, scale>0, the
closed LP coefficients and bounds transform identically: one multiplier proves
the entire closed parent. A zero multiplier is permitted only for the exact
nonnegative-coordinate-cone inequality. Missing signs split an unused wall;
both children, BFS, history and rollback remain predecessor code.

Dense multipliers and their exact checks are emitted only after ALL incidence
rows qualify. No direct matrix scan or implication LP in eligibility; incoming
cache ignored, not trusted as boolean evidence. If a sign follows only from a
combination, this conservative selector may split unnecessarily; it does not
assert absence of an implication. Whole5-variable stationarity and ENTIRE unsafe
singular-family exclusion unchanged. Same v2 schema and independent checker,
with no producer import in that checker. No app/UI/runtime lane integration.

Main read the full new source/test, amended test, immutable producer/checker
dependencies, reviewed scaling and row indexing, and released bounded tests.
11/11 named controls PASS: fixed real independent incidence/slab/stationarity;
forbidden LP/dense fallback; positive scaling; missing/sign/dual/polynomial/
stationary tampering; partial/false-complete refusal; child/ownership integrity;
saved import/history; unchanged execution identity; entire-nullspace helper.
The last is a synthetic contradictory-path control, NOT geometric coverage.
No test failure or rerun. Builder AST2/2PASS; actual focused suite1.218156875s.

## 3. Same-input native comparison

Baseline is frozen TIP114, not TIP112, isolating the selective classifier change.
Both begin from EXACT identical COST_PILOT_2.json bytes, not a previous new run.
Input:10385 nodes/8707 processed/3521 empty/1678 pending/0 stationary;13 roots.
Runs sequential, same18s internal/20s outer cap and max100000 processed nodes.

| Native metric | TIP114 baseline | TIP115 selective |
|---|---:|---:|
| New processed nodes (secondary) | 350 | 586 |
| New independently checked empty exclusions (secondary) | 147 | 252 |
| New stationary terminal leaves (primary) | 0 | 0 |
| Final created nodes | 10791 | 11053 |
| Final processed nodes | 9057 | 9293 |
| Final empty leaves | 3668 | 3773 |
| Final splits | 5389 | 5520 |
| Final pending leaves | 1734 | 1760 |
| Generator internal seconds | 18.001057250 | 18.000786791 |
| Generator real seconds | 18.09 | 18.09 |
| Independent checker internal seconds | 2.494946917 | 2.558826042 |
| Independent checker real seconds | 2.55 | 2.62 |
| Total native generation/check real seconds | 20.64 | 20.71 |
| Evidence bytes | 1414696 | 1455881 |

Both INCOMPLETE/TIME_CAP. Same unchanged TIP114 checker verifies tree ownership,
model, every supplied leaf certificate and accounting/history, then returns
REFUSED/INCOMPLETE_FOREST_REFUSED because pending nodes remain. This expected
refusal is NOT complete mathematical acceptance and not a failed invocation.
Ordinary jq comparison additionally confirms same model, roots, old closed nodes
and old run-history prefix, with same input digest as origin, for both outputs.

The selector processed more work in one bounded observation; terminal proof
benefit, remaining-work bound, production feasibility and statistical speedup
are NOT established. Empty counts/bytes do not measure covered volume or global
completion percentage. Native artifacts have NO stationary leaves; the fixed
unit-test cell must not be substituted for generated progress.

## 4. Ledger and verification

| Mathematical invocation | real seconds | conservative charge |
|---|---:|---:|
| Profile8s | 8.16 | 9 |
| Profile18s | 18.11 | 19 |
| Focused controls10s outer | 1.34 | 2 |
| Native baseline18s | 18.09 | 19 |
| Native selective18s | 18.09 | 19 |
| Check baseline28s internal/30s outer | 2.55 | 3 |
| Check selective28s internal/30s outer | 2.62 | 3 |
| Total | 68.96 | 74/120 |

Seven calls; failed starts0, executed test failures0, retries0, ongoing math0.
Ordinary patch-context failures2 retained; successfully corrected context without
any mathematical rerun. Source-review test improvement before source freeze1;
no post-test source changes. No stream failure, install, full build or API.
Resource guards cooperative; exact RSS peak NOT emitted, no hard containment
or production-memory guarantee. Stop on decision, not exhaustion or impossibility.

REQUIREMENT COVERAGE: S115-1..5 implemented5/5 (100%) at engineering scope.
SCENARIOS:11PASS/0FAIL;2expected incomplete native checker refusals; mathematical
terminal-gain criterion0/1, explicitly NOT READY for research-benefit claim.
TECHNICAL HEALTH: AST2/2PASS reported by Builder; focused11/11 executed by Main;
git diff --check PASS. App build/type/lint not run: no application source change.
OVERALL: verified experimental wrapper; NOT READY for default/whole production.
Remaining: whole natural complement-of-C coupling or full stationary exclusion,
and all12 inverted continua; no additional regional substitute or automatic
computation routed. Main/Builder used Vibecode Kit minimally, unchanged checker.

Disk preflight49GiB free; final research artifacts5.6MiB. No copies/venvs/installs/distDirs/bytecode/Docker created.
No material deletion needed; research evidence retained. Dirty predecessors
preserved. No UI/app/database/auth/config/paidAPI/Gitcommit/push changes.

## 5. Frozen source and evidence pins

SHA256 (paths relative to repository, retained bytes):

```
tip112/producer.py 9f71612ddcd3aefb5ef7086d4eb3f501f597bdf8c6613f8b00d764b14efc1da1
tip112/checker.py 14d538896ef75ef3d6c72016c8c33eedb66372460f402c7ad005bfb1c19b9b40
tip114/producer.py 14c3a581d1a85ae0b29b98b41ec5ee29158ee65db66dc900c6617a8de2d2d2ea
tip114/checker.py 373b2153aa46d3087f4d3c1e429957e416e21c4cc6e2463f895f62e39e7dc802
tip113/COST_PILOT_2.json 87c0b4c48eca955c51f0ed652e0dc90c10cffb6aacf33fbabb02463d5bb9c42c
tip115/producer.py 6c8711821aa771ced988e0a604563da5a48e31d448de6f4d90597b198b90205e
tip115/test_producer.py f85105d7bf3b3d5ee65951573f191059f7be3ab033f616d9d8712b535e687d04
tip115/FOCUSED_CONTROLS_1.json 605e6a4fca23705aee19272145afa8538d8b9f449a8c06d4d99bab63e1ef8dc9
tip115/PROFILE_114.pstats a644715aa6d727569cf5e5a87c40cd13b42bf29fef071363553d63ec2c0d6502
tip115/PROFILE_114_18S.pstats 4235e0bee6beb60c32b3731db551c8e3fc9791e9a35fdc5b041328e43581ee4f
tip115/PROFILE_FOREST.json f71df7fd92f4d76b9050fe37bd79ee5ec17c10b3b8d4118278ee3e0d2e4279ff
tip115/PROFILE_FOREST_18S.json 6efc4812a685636b00e2627943ad221647fa75264a89db523248e7be89bc31f1
tip115/BASELINE_18S.json c53c66f7b85160591600d1d8364053607a009d5cb9599916e74176bcfedbeccf
tip115/SELECTIVE_18S.json afe2c5a707fafdc1bce6ea7073a95c5a3a97058c23bdc6eb2bfe812cef430c25
tip115/CHECK_BASELINE_18S.json 79934d6352a4ceafda3f16afe47df6082a46b25590b23e72bb7145805c76b4b0
tip115/CHECK_SELECTIVE_18S.json 02efed8828a29043b25af129b2e248410044f7fa515dc7ea2029c3e866f10e93
```

Predecessor charter SHA256 ed80bdf177a3e440d8be0a17251cf197d4e83cc11390060c8ff14c994d19133c;
predecessor report SHA256 ab21693f84084ca605fc3dd88a95846915e28b21b8d62f6d0554add9e2152ea0.
Both confirmed unchanged; strategic history retained. No optimization successor
automatically follows this completed experiment.

All tipNNN paths above are under artifacts/research/. Ordinary final pins match
released sources and predecessor pins; no change to checked code after execution.
