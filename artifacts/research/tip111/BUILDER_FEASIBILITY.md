# TIP111 — Whole-certificate feasibility audit

Terminal status: UNQUALIFIED_WHOLE_PRODUCER_AND_CHECKER. Scientific STOP
14:04:47UTC by Main, before14:55UTC; NOT a proof of infeasibility or an
exhausted budget. R1 all-real F6>=20/93 remains OPEN. No production run,
coverage certificate or complete stationary certificate was generated.

## Concrete source audit, not an n-flag port

The old tip101 shape_walls.py fixes a3D simplex with four homogeneous entries.
coverage.cpp fixes3D rank/edge intersections,4-entry vertices and a64-bit
active-plane mask. Its original cap is64 total planes. Merely increasing n
would not produce4D geometry or represent the n6 inventory.

coverage_check.py builds3D triangular facets and polygonal face hulls, and
compares volume with1/6. It is NOT an independent4D hull-volume checker.
stationary.py fixes n5, four ambient variables,15 monomials, natural endpoint
chains, ALL-pair overlap strict rows and a future hull-tail subtraction.
acceptance_check.py independently repeats those same dimensional/domain/tail
restrictions; it is not an independent all13 K6 checker. For a singular unsafe
family its acceptance only succeeds when one constraint is constant on the
entire nullspace and violated. A general singular K6 family can require a
combination of inequalities; a bad particular solution is not its exclusion.

TIP106's natural18/92 prefix and cost heuristic remain exactly a prefix and
heuristic. They do not supply all13 coverage, a cell-count lower bound, or an
upper time guarantee for either production or independent checking.

The inversion tail is a mathematical seam, not just code width: adjacent
inverted apices give a persistent positive facing gap. Slices can split AFTER
the connected physical bottom. Hence natural future-hull subtraction is
invalid for those words. No allpair/fulltail assumption is reused here.

## Smallest correct symbolic law found

Use five real offset variables in a translation gauge. In depth t, the scaled
triangle interval is [A_j-j*t,A_j-(j-1)*t]. For strict distinct apices its union
has initial length0 and initial slope6. At a generic positive endpoint crossing,
an exposed LL/RR crossing changes the slope by +abs(slope difference), an
exposed LR crossing by its negative; another triangle strictly covering the
location makes the change0. Therefore the actual FINITE-height area is

    G=3+(1/2)*sum_(0<t_e<1) delta_e*(1-t_e)^2.

Both endpoint PAIR records at the same height must be retained. LL and RR
events of the same triangle pair have structurally equal heights at DIFFERENT
locations; genericity does not remove those ties. Same-location triple faces
are handled by the incident polynomial's continuous extension, not by
miscounting all pair jumps at concurrence. Unit-height events have zero weight.
Main's MAIN_EVENT_SPLINE.md and the scoped hand critic supply the symbolic
derivation; the new helper tests14 fixed values only, not its whole-cell law.

This law avoids any future connected-hull assumption. It gives a quadratic
on each open full coarse cell and an incident closed-cell formula. A complete
stationary method still needs the full ambient C1/face proof away from the
excluded persistent adjacent-apex collision, rather than face-only KKT.

## Exact audit results and their scope

One authorized command:

    python3 -B artifacts/research/tip111/audit_all_orders.py --seconds 10 --out artifacts/research/tip111/BUILDER_ALL_ORDER_AUDIT.json

Result FEASIBILITY_AUDIT_NOT_COVER, exit0, failures0, internal0.086586708s,
conservatively charged1s. RSS22,315,008bytes. Internal10s/outer12s guards
were not reached. Source and evidence are10,269/76,143bytes.

Inventory in gauge A6=0:107 homogeneous triple/parallel planes,15 t=0/top
planes,40 distinct unit-clipping planes,147 distinct full affine coarse
planes. Homogeneous/top sets overlap; counts are not to be added naively.
All thirteen disjoint-adjacent-swap words were generated exactly once:

| Word | Cutting homogeneous shape walls |
|---|---:|
|123456|92|
|123465|75|
|123546|77|
|124356|78|
|124365|61|
|132456|77|
|132465|60|
|132546|62|
|213456|75|
|213465|58|
|213546|60|
|214356|61|
|214365|44|

These are FOUR-dimensional normalized apex-shape inventories, not cell counts
or covers. Adding the40 unit-clipping planes requires the scale/fifth variable
or an equally complete scale-phase construction. The old4D shape inventory
alone cannot tell whether each exposed crossing lies before the physicalt=1.

Fourteen fixed exact controls passed the event formula AND both immutable
TIP098 area implementations. Thirteen use the fixed rank recipe
A_word[r]=3*(101^r-1)/(2*(101^5-1)), r0..5. The other uses Main's hand point
p0=(7/5,3/10,1,3/2,3/5,0) with the declared, nonadaptive perturbation
p_i=p0_i+101^(-i),i1..5;p6=0. Its word is213456, exact bottom range
312181205/208120802 and persistent facing gap11201/102010. It is not
claimed stationary or a root counterexample. No random/optimizer/navigation,
ordered-prefix replay, shape-cell generation or stationary family collection
was performed.

## Whole scheme and unresolved qualification

A minimal sound COMPLETE route would require all the following together:

1. All13 strict apex-word roots in the bounded necessary competing-minimum
   domain, retaining connected-bottom/contact limits and all retained root
   reductions. No natural ordering or allpair-overlap replacement.
2. Complete partition by the coarse exposure and unit-clip walls; either full
   five-variable affine partition or complete4D shape PLUS scale-phase coverage.
3. Independent completeness checking. A full split tree with BOTH children and
   checked Farkas certificates for empty STRICT interiors could avoid an unported
   hull-volume checker, but needs an explicit closure-density argument for all
   incident faces. An unchecked producer vertex list is not a substitute.
4. Independent actual-union polynomial derivation, e.g. coverage-count slab
   integration or clipped63-subset intersection inclusion–exclusion rather than
   reusing the producer's event-exposure implementation.
5. Full five-variable stationary RREF, constant-value singular affine families,
   and COMPLETE strict/closed feasibility certificates for every unsafe family.
   Farkas/strict-margin LP or a complete bounded affine feasibility method is
   needed when no single nullspace-constant row excludes it.
6. Total producer PLUS independent coverage/derivation/stationary checker time,
   state/RSS and evidence size qualified inside the remaining480s/limits, with
   all failures and staged incomplete state accounted. No generator-only verdict.

No such complete producer/checker is present or qualified by this audit. The
correct new law removes the old tail bug, but its cheap14 controls do not measure
the unknown full affine cell count, singular-case workload or independent replay
cost. Generic arrangement upper bounds in the JSON are combinatorial UPPER
bounds, not actual counts, cost lower bounds, or guarantees that480s suffice.
No claim that optimized complete generation is impossible is made. Main stopped
the campaign at this concrete qualification seam instead of spending the
remaining ceiling on partial branch collection or a new geometry platform.

## Tiếng Việt

Đã kiểm nguồn và sửa đúng khe tái sử dụng: dùng diện tích hợp THỰC trên
0<=t<=1, không lấy đường bao làm phần đuôi cho thứ tự đảo. Kiểm kê đủ13 thứ tự,
147 vách affine gồm40 vách cắt ởt=1;14 kiểm chứng hữu hạn khớp cả hai thuật
toán diện tích chính xác cũ. Đây KHÔNG phải phủ miền hay chứng minh cực tiểu.

Chưa đủ điều kiện chạy sản xuất: thiếu bộ sinh phủ đầy đủ, bộ kiểm độc lập
đúng chiều/đúng miền, xử lý toàn bộ họ dừng suy biến và chi phí TỔNG kiểm-được.
Dừng tại UNQUALIFIED_WHOLE_PRODUCER_AND_CHECKER, không kết luận bất khả thi hay
hết thời gian/ngân sách. Cận K6 toàn miền số thực vẫn MỞ.
