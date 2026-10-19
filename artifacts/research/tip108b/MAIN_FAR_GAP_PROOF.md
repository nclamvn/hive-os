# TIP108B — Universal far-separation exclusion / Loại miền cách xa

Status: analytic scoped theorem, independently challenged by the retained
critic. NOT closure of TIP108B R1 or global K6.

## English proof

Use scaled slices I_j(y)=[p_j+j y,p_j+1+(j-1)y], G=6F.
Let L,R be the left/right bottom groups, each of size at least two, with
sum of offset ranges S<=18/31 and d=min_R p-max_L p>1. Ties inside groups
and S=18/31 are included. No stationarity or overlap-graph assumption is used.

For i in L and j in R, set D_ij=p_j-p_i>=d. If i<=j or i-j=1 their
triangles have no positive-area intersection. For r=i-j>=2, integrating
the rising and falling affine overlap lengths gives

    J_r(D_ij)=(r-D_ij)_+^2/[r(r^2-1)].

Indeed, when 1<D_ij<r the overlap starts at (D_ij-1)/(r-1), its peak
at D_ij/r has height 1-D_ij/r, and ends at (D_ij+1)/(r+1). Its triangular
area is the displayed value. If D_ij>=r it vanishes. Thus J_r is
nonincreasing for D_ij>1.

There are at most two rank-two directed cross-pairs: labels split into
chains 1,3,5 and 2,4,6, and both edges in one chain cannot cross from R
at the lower label to L at the higher label, because the middle label
would have to lie in both groups. Total rank-three/four/five pair counts
are at most 3,2,1. Taking a union bound on cross-group intersection gives

    O=area(U_L intersect U_R)<=V(d)=2J_2(d)+3J_3(d)+2J_4(d)+J_5(d).

For 1<d<2 this is d^2/2-73d/30+16/5. At d0=57/31,
V(d0)=400/961. Each summand is nonincreasing, so this upper bound holds
for ALL d>=d0, including d beyond this polynomial's range; no polynomial
extrapolation is used.

The retained TIP108 proper-group theorem applies to both groups (sizes
2+4,3+3,4+2): G_L+G_R>=2-S/2. Consequently, for d>=57/31,

    G=G_L+G_R-O >= 53/31-400/961=1243/961,
    D=2G-(2+S) >= 6/961 > 0,
    F>=1243/5766=20/93+1/1922.

This removes the entire unbounded separation tail for all label choices,
not finitely sampled points. It leaves 1<d<57/31 OPEN. The retained
small-S exclusion is separate, and the one-bottom-component domain also
remains open globally.

## Sharper tail for two three-label groups

The Builder's complete six-order argument in BUILDER_HAND_NOTES.md proves
G_group>=1-s/2+3s^2/8 for any three integer labels and s<=18/31. The same
critic independently checked all hull energies, reflection/shear, ties and
the retained gap-insertion argument. The reflection used is the
area-preserving map X'=s+1+(j_min+j_max-1)y-X, not a bare X reflection.

For spans a,b with a+b=S, a^2+b^2>=S^2/2. Hence for 3+3,

    D >= 2-2S+3S^2/8-2V(d).

At d0=7/4, V(d0)=227/480. The span expression decreases on
0<=S<=18/31 because its derivative is -2+3S/4<0. Thus for ALL d>=7/4,

    D >= 26/31+243/1922-227/240=4453/230640 > 0.

The critic separately checked this refinement, including use of individual
J_r monotonicity beyond d=2. It leaves 1<d<7/4 open for 3+3; the 2+4/4+2
tail threshold remains 57/31. No universal near-gap inequality is inferred.

## Independent challenge

The existing critic /root/k6_transfer_review read the active charter and
checked the pair formula, orientations, directed counts, monotonicity,
normalization, rational arithmetic and boundary cases by hand. Scoped
PASS; no execution, edit, external review or formal prover was involved.
This is AI mathematical review, not a claim of external peer review.

## Tiếng Việt

Với hai nhóm đáy, mỗi nhóm có ít nhất hai tam giác, đặt d là khoảng cách
nhỏ nhất giữa các độ dời của nhóm phải và nhóm trái (chưa trừ độ rộng đáy
1). Khi d>=57/31 và tổng hai độ rộng độ dời S<=18/31, ta đã chứng minh
trên TOÀN miền này rằng D>=6/961>0 và F>=20/93+1/1922.

Chứng minh dùng công thức giao chính xác của từng cặp tam giác, giới hạn
số cặp theo chênh lệch nhãn, rồi kết hợp với định lý nhóm tối đa năm tam
giác đã giữ từ TIP108. Nó không giả định điểm đang xét là điểm cực tiểu,
không dựa vào mẫu hữu hạn và vẫn bao gồm các độ dời trùng nhau trong nhóm.
Một agent khác đã phản biện trực tiếp lập luận và phép tính hữu tỉ.

Đây là kết quả loại một miền liên tục không bị chặn về khoảng cách,
KHÔNG phải chứng minh xong bất đẳng thức hai nhóm hay K6. Miền hai nhóm
gần nhau 1<d<57/31 vẫn chưa đóng; miền một thành phần đáy cũng còn mở.

Riêng hai nhóm ba nhãn, cận nhóm mạnh hơn cho phép hạ ngưỡng cách xa
xuống d>=7/4, với D>=4453/230640>0. Phần còn mở của loại 3+3 là
1<d<7/4; loại 2+4/4+2 vẫn còn miền 1<d<57/31.

## Main execution ledger

Main mathematical process 1: fresh replay of reviewed new
coupled_control.py, no output file; elapsed internal 0.003868917s,
conservative charge 1s of Main45s. Two retained independent area methods
agree at the hand-derived diagnostic. This is finite verification, not a
universal theorem. Its fixed-support functional is below its required
bound by 8879/172980, while actual D=5653/17298>0. The shortcut is therefore
retired, not promoted to an admissible D countercertificate.

All other Main work so far is source/document reads and hand reasoning,
not mathematical subprocesses. Builder separately owns its ledger.

Main mathematical process 2: fresh replay after reviewing the full-hull
diagnostic addition to the same new helper. Internal elapsed 0.004200125s;
conservative charge 1s. It reproduces the full-hull functional 8291/6696,
below target by 349/6696, and the identical positive actual defect. Both
Main mathematical processes succeeded; total conservative Main charge 2s.
The retained TIP098 helper and TIP108 charter/proof SHA256 remain unchanged.

Technical note: one documentation patch failed its context match and made
no changes; the corrected patch succeeded. This was not a mathematical
execution or a lost mathematical attempt.
