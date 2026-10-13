# TIP107 Builder hand mathematics / toán chứng minh tay

The committed root remains all-real F6>=20/93, or a smaller rational witness.
Everything below concerns necessary restrictions or an explicitly restricted
family. None supplies the missing matching universal lower bound.

## 1. False route: separated-group overlap need not be convex

Use the exact K6 triangles in TIP107. Put triangles4,5,6 at bottomoffset0,
and triangles1,2,3 at bottomoffsetd. Call their unions A and B(d).
For1/6<d<1/4 they have two positive-gap bottom components. Let D=6d and work
temporarily in the horizontally scaled coordinate X=6x.

At height y, all intervals have width1-y. For0<y<1/2, each three-triangle
group is connected. Its slice length is1+y, and the group centers differ by
D-3y. Their overlap length is therefore

    (1+y−|D−3y|)_+.

For1/2<y<1, each group consists of three disjoint intervals. Thus the group
intersection length is the SUM of the cross-pair intersection lengths at that
height: no double counting inside either group. On1<D<3/2, only rank-gap2
(multiplicity2) and rank-gap3 (multiplicity3) pairs contribute ABOVE1/2.
Rank-gap1 never contributes under bottom separation; gaps4/5 have already
finished below1/2 in this regime.

The low-height integral is

    I_low(D)=∫_{(D−1)/4}^{D/3}(1+4y−D)dy
             +∫_{D/3}^{1/2}(1−2y+D)dy.

For rank-gap r, a separated pair's full scaled overlap integral is
(r−D)^2/[r(r²−1)]. For r=2, remove its portion below1/2; for r=3, retain
only the tail above1/2. This gives

    I_high(D)=2[(2−D)²/6−(3/2−D)²/2]+3(D−1)²/8.

Direct symbolic simplification gives the WHOLE interval formula

    I(D)=I_low(D)+I_high(D)=−1/6+7D/6−D²/2.

Each group's own scaled area is
∫_0^{1/2}(1+y)dy+∫_{1/2}^1 3(1-y)dy=1.
Restoring the horizontal factor1/6, each physical group area is1/6 and

    O(d)=area(A∩B(d))=−1/36+7d/6−3d²,
    F(d)=area(A∪B(d))=13/36−7d/6+3d².

Hence O''(d)=−6: group overlap is STRICTLY CONCAVE, not convex, throughout
this separated-bottom regime. Union area has a strict rigid-block translation
minimum at d=7/36, where the bottom gap is1/36 and F=107/432.
Moving the blocks toward bottom contact from that point INCREASES union area.

This refutes “pair-overlap convexity implies group-overlap convexity” and the
corresponding unconditional rigid-block merging argument. It does NOT refute
the possibility of a different theorem excluding two components at a full
six-offset local minimum. It is not a smaller-than20/93 construction.

Exact controls at d=23/120,7/36,71/360 give union areas1189/4800,107/432,
1189/4800 in BOTH old independent sweeps. The midpoint overlap is37/432;
each outer overlap is137/1600; strict convexity violation is1/43200.
Those controls corroborate this derivation; they are not its universal proof.

### The rigid-block stationary point is NOT a full-space local minimum

Its bottom union width is1/3. Under the reviewed radial apex-rescaling identity,
the full-space radial derivative is2F−bottomwidth=35/216, which is nonzero.
At radial scale999/1000, the explicitly chosen offsets

    (2341/12000,2339/12000,779/4000,1/3000,1/6000,0)

have area3960377/16000000<107/432 in both exact sweeps. No optimization was
used to obtain this point. The radial identity and this concrete descent keep
the rigid-block/full-space distinction explicit.

## 2. Two-bottom-component restrictions at a subtarget full local minimum

Use Main's necessary radialstationarity identity2F=bottom union width. Let the
two positive-gap bottom components have physical offset spans s_A,s_B.
Each component contributes its span plus1/6 to bottom width, even if it contains
touching intervals. Therefore a full local minimum with F<=20/93 satisfies

    s_A+s_B+1/3=2F<=40/93,
    s_A+s_B<=3/31<1/6.

Consequently every pair of bases WITHIN EITHER component overlaps with positive
length. In fact their base overlap is at least1/6−3/31=13/186.
Thus each group is a strict common-base-overlap clique. This asserts neither
cross-group overlap nor that either label set is consecutive.

Put p_j=6x_j and A_j=p_j+j. If i<j belong to the same component, then

    A_j−A_i=(j−i)+(p_j−p_i)
             >=1−6s_component>=1−18/31=13/31>0.

Thus each component's apices are NATURALLY ORDERED BY LABEL internally,
regardless of the order of its base offsets. Cross-group apex order may still
interleave, invert adjacent labels, or have admissible nonadjacent ties.
This is not the unjustified whole-K6 natural-apex-order reduction refused in106.

### Internally ordered clique groups have laminar slice partitions

For i<j in one group, write delta=x_j−x_i and r=j−i. Its two slice intervals
overlap exactly when

    |delta+r*y/6|<(1-y)/6.

Because |delta|<1/6, the lower inequality delta+(r−1)y/6>−1/6 always holds.
The upper inequality therefore determines the unique loss threshold

    tau_ij=(1−6delta)/(r+1), with0<tau_ij<1.

The upper bound uses A_j>A_i. Every internal pair loses overlap once and
never regains it. Hence the group's connected partition only refines with y.

For three in-group labels i<j<k, tau_ik<=max(tau_ij,tau_jk). To see this,
suppose both shorter thresholds<=y<1; add their numerator inequalities:
2−6(x_k−x_i)<=(k−i+2)y, hence
1−6(x_k−x_i)<=(k−i+1)y+(y−1)<(k−i+1)y.
Therefore a positive edge between i,k forces any intermediate j to connect
to at least one endpoint. A graph path joining labels on opposite sides of an
intermediate label contains an edge spanning that label, so this argument also
puts it in the component. Connected components are consecutive blocks in the
GROUP'S label subsequence, even when that subsequence has gaps in1,...,6.

This validates an internally laminar geometry. It does not eliminate the
cross-group multiplicities responsible for the concave-overlap counterexample.

No claim is made that one failed adjacent-in-group edge already cuts the graph:
a longer edge can still bridge it. Consecutiveness follows from BETWEENNESS of
components, not a single-adjacent-cut test. On nongeneric threshold heights,
positive-overlap edges use y<tau; closed interval contacts use y<=tau. Both
edge families disappear monotonically. Since tau_ik<max(tau_ij,tau_jk) for
three labels, even an outer closed contact forces an intermediate positive
edge to an endpoint. Simultaneous contacts can therefore be handled as closures
of the refining partitions; their zero-height-measure contribution changes
neither the area integrals nor the strict internal-apex ordering statement.

## 3. Main's one-bottom-component order restriction, checked combinatorially

With one closed connected bottom component, scaled bottom width is range(p)+1.
At a full local minimum F<=20/93,

    range(p)<=12F−1<=49/31<2.

For labelgap j−i>=2,
A_j−A_i>=(j−i)−range(p)>=13/31>0. Thus only adjacent-label inversions are
possible. Main's previously proved adjacent-apex-collision exclusion removes
the remaining possible ties at local minima.

Such strict permutations consist of disjoint adjacent swaps: two overlapping
adjacent inversions would invert a nonadjacent pair. An inverted adjacent pair
must be neighboring in the orderword, since every other label must lie before
or after BOTH by nonadjacent comparisons. Removing these two-label blocks leaves
all other labels in increasing order. Conversely every disjoint-adjacent-swap
word preserves all nonadjacent comparisons. Recursive counts satisfy
f_n=f_{n-1}+f_{n-2}, f_0=f_1=1, giving f_6=13.

The independent finite control filters all720 permutations by the nonadjacent
comparison criterion and compares the13 survivors to the recursive generator.
It verifies a COMBINATORIAL classification, not the remaining continuous
offset domain, area polynomials or a complete geometry certificate.

## 4. A hand-derived tight3+3 family has positive radial defect

For0<=a<1/6 consider

    x=(d+2a,d+a,d,2a,a,0), d>1/6+2a.

Groups1,2,3 and4,5,6 have the same reversed base-step a. Each group area is
1/6−a+9a²: integrate its connected low-y width until y=(1+6a)/2, then its
three disjoint widths above that height. More explicitly, in scaled units the
three integrals over[0,6a], [6a,(1+6a)/2], [(1+6a)/2,1] sum to1−6a+54a².

Put b=1−6a and D=6d. Positive separation implies group overlap is zero for
y<6a. On y=6a+b*z, subtract the common A-group intercept6(1-b) and divide
the scaled horizontal coordinate by b. The A intervals become the a=0
intervals4,5,6; the B intervals become1,2,3 translated by

    E=(D−3+3b)/b.

The intersection-area Jacobian is b². Thus for1<E<3/2 its overlap is b² times
the overlap from Section1. Rigid-block maximization occurs at E=7/6, i.e.

    d=7/36+11a/6,
    bottomgap=d−(1/6+2a)=1/36−a/6>0.

The exact union area on these rigid-block optimal positions is

    F(a)=107/432−35a/36+179a²/12.

The two-component tight-span restriction4a<=3/31 gives0<=a<=3/124.
Here the radial defect is

    2F(a)−(1/3+4a)
      =(179/6)(a−35/1074)(a−1/6)>0,

because3/124<35/1074<1/6. Moreover F is decreasing on the whole tight interval,
so this ENTIRE RESTRICTED FAMILY satisfies

    F(a)>=F(3/124)=386747/1660608
                    =20/93+29627/1660608>20/93.

Exact controls at a=0,1/100,3/124 agree with this formula and factorization in
both old area methods. The hand derivation establishes the restricted-family
statement; finite samples alone would not.

This says nothing universal about asymmetric3+3 groups, other label partitions,
or unequal internal offset schedules. It cannot replace the global root.

### Exact remaining defect question

In the whole tighttwo-component domain, negative defect would imply
F<bottomwidth/2<=20/93, so an exact negative example would be a ROOT smaller
witness. Positive defect for the equal-step family is not universal positivity.
The missing proposition is a valid strict-defect inequality (or another matching
area argument) for EVERY internally ordered-clique pair with arbitrary label
partition, internal offsets and cross-group intersection multiplicities.
Pair convexity and unconditional rigid merging cannot supply that proposition.

## Tóm tắt tiếng Việt

Đã bác bỏ chính xác lập luận “chồng lấp từng cặp lồi thì chồng lấp hai nhóm cũng
lồi”: hai nhóm{4,5,6} và{1,2,3} có đáy tách nhau vẫn cho diện tích giao LÕM theo
dịch chuyển nhóm. Điểm cực tiểu khi chỉ dịch hai khối KHÔNG phải cực tiểu toàn
không gian; đã có nhiễu hướng xuyên tâm cụ thể làm diện tích giảm.

Nếu một cực tiểu toàn không gian có hai thành phần đáy và diện tích<=20/93,
tổng độ trải đáy của hai nhóm<=3/31. Vì vậy các đáy trong mỗi nhóm giao nhau
thực sự, và các đỉnh trong nhóm tăng theo nhãn. Phân hoạch lát cắt mỗi nhóm có
cấu trúc phân nhánh đơn điệu. Không suy ra thứ tự đỉnh giữa hai nhóm.

Trường hợp một thành phần đáy chỉ còn13 thứ tự đỉnh kiểu đổi chỗ hai nhãn kề
nhau không chồng nhau; kiểm720 hoán vị xác nhận phân loại tổ hợp, không phải
bao phủ hình học. Một họ3+3 bước đều được chứng minh có diện tích lớn hơn20/93
và sai lệch xuyên tâm dương trên toàn miền bước nhỏ. Họ này không đại diện mọi
cấu hình hai nhóm. Bất đẳng thức tổng quát còn thiếu; mục tiêu K6 vẫn MỞ.
