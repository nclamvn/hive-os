# Profile findings / Kết quả đo nút thắt

Standard cProfile on frozen TIP114 producer, identical TIP113 input; no source
instrumentation, no validation bypass. These are profiled, NOT native timings.

| Diagnostic | real seconds | charged seconds | new nodes processed |
|---|---:|---:|---:|
| 8s internal | 8.16 | 9 | 0 |
| 18s internal | 18.11 | 19 | 32 |

Aggregate mathematical charge28/120s. Both artifacts INCOMPLETE/TIME_CAP,
0 stationary leaves; neither closes the theorem. Pstats are reproducible saved
diagnostic artifacts; cumulative times are nested and must NOT be added.

18s profile: pending_paths1 call12.764s cumulative; classify18 calls4.251s;
incidence_rows18 calls1.734s; direct_implication1313 calls1.553s;
check_implication369 calls0.619s; implication21 calls0.539s. Global lp_rows3571
calls7.347s and check_dual3536 calls5.366s are dominated by resume validation.
Fraction arithmetic has large cumulative cost. 8s profile exhausted its
internal cap in pending_paths, after2192 checked empty certificates, before any
new classification. Profiler overhead changes work reached, so none of these
absolute times predicts native throughput or complete-proof cost.

Decision: narrow selective certificate construction from signed root/path
constraints, no per-node implication LP, no repeated dense scan of all matrix
rows when eligibility is still incomplete. Keep input proof checks and existing
incidence inventory/reconstruction. Do not bypass old validation, optimize every
helper, or add infrastructure. One changed classifier and unchanged independent
checker. Baseline for the matched comparison is frozen TIP114 (not TIP112),
isolating this selective change. Both generations start from identical saved
TIP113 bytes; fixed18s internal limits and no more searches if no terminal gain.

VI: Lượt8 giây chưa tới xử lý mới vì kiểm lại chứng chỉ trong checkpoint. Lượt18
giây cho thấy LP chỉ là một phần chi phí; quét điều kiện và phép tính phân số
cũng đáng kể. Sửa hẹp việc nhận biết điều kiện đã có, không bỏ kiểm chứng để
lấy tốc độ. Tiêu chí quyết định vẫn là miền kết thúc được kiểm độc lập, không
phải số nút đã chạy. Không có miền kết thúc mới thì chưa chứng minh được lợi ích.
