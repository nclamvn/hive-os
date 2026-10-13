# Exact rejected group bound / Bác bỏ chính xác chặn nhóm đề xuất

This is a counterexample to an AUXILIARY proof route, not TIP108's two-component
defect inequality and not a smaller K6 witness. A gap-specific critic supplied
the construction by hand; Main independently inspected its slice derivation and
executed both unchanged rational area algorithms through the existing tip098 CLI.

## Proposed statement — FALSE

For k consecutive labels with common base intersection and scaled base span s<1,
the proposed bound was

    G_k >= (k+1)/4 - s/2 + 3s²/[4(k-1)].

Equal reversed steps attain the right-hand expression, but they need not minimize
the area. Even monotone bases do not suffice to validate this lower bound.

## Entire counterfamily and complete slice calculation

Take k=5 and p=s(1,3/5,3/5,1/5,0),0<s<1. The scaled slice starts are
q_j=p_j+j*y, with common width1-y. All adjacent-label intervals overlap for
y<1/2, so the group is connected there. The minimum-start labels change
5 -> 2 -> 1 at y=s/5,2s/5; maximum-start labels change1 -> 3 -> 5 at
y=s/5,3s/10. This gives the following exact union length, including boundary
values by continuity:

| Height interval | Union length |
|---|---|
|0 to s/5|1+s-5y|
|s/5 to 3s/10|1|
|3s/10 to 2s/5|1-3s/5+2y|
|2s/5 to 1/2|1-s+3y|
|1/2 to 1/2+s/10|2-s+y|
|1/2+s/10 to 1/2+s/5|3-4s/5-y|
|1/2+s/5 to1|5(1-y)|

For y>1/2 the starts are naturally ordered because every adjacent base step
is <=2s/5<1/2. The adjacent23 overlap has ended, the45 overlap ends at
1/2+s/10, and12/34 end at1/2+s/5. Thus the last three rows account for the
actual connected components, not a presumed label-adjacency tree at all heights.

Integrating ALL rows gives

    G_5=3/2-s/2+(9/50)s².

The proposed coefficient was3/16. Its excess over the actual area is
(3/16-9/50)s²=(3/400)s²>0 throughout0<s<1. This is a hand-proved continuum
refutation; a few sample values alone would not establish it.

## Exact replay at s=1/4

p=(5,3,3,1,0)/20, scaled areaG5=1109/800.
The false lower bound is355/256, exceeding the actual area by3/6400.
Use the old n5-normalized model x=p/5=(1/20,3/100,3/100,1/100,0).

Executed Main command (only eval, NO search):

    python3 -B artifacts/research/tip098/kakeya_exact.py eval 1/20 3/100 3/100 1/100 0

Actual output: statusEXACT_FINITE_AREA,n5,area1109/4000,
area_affine1109/4000,agreementtrue,global_optimalityNOT_ESTABLISHED.
Multiplying by5 gives1109/800 as required. Conservative computation charge1s
from Main's45s allocation. No install/build/optimization/source changes.

## Scope and implication / Phạm vi và ý nghĩa

The step-uniformity bound is unavailable for the whole two-group proof, even
when the within-group bases are monotone and share a common interval. Envelope
changes cause the improvement. This removes an unsupported shortcut; it does
not refute D=12F6-(2+S)>0 on the actual two-component domain.

Chặn dựa trên bước đều là SAI, ngay cả khi các đáy sắp đơn điệu và có khoảng
giao chung. Họ p=s(1,3/5,3/5,1/5,0) cho công thức diện tích chính xác trên
toàn0<s<1, thấp hơn chặn đề xuất bởi(3/400)s². Ở s=1/4, hai thuật toán diện
tích cũ đều cho1109/4000 trong mô hình năm tam giác; nhân5 thu được1109/800.

Đây chỉ là bác bỏ chặn PHỤ. Không phải phản ví dụ hai thành phần của TIP108,
không chứng minh hay bác bỏ K6, và không được đổi mục tiêu nghiệm thu thành
“đã tìm thấy một phản ví dụ” mà bỏ qua phạm vi của nó.
