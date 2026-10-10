# Kakeya G1 — source-derived geometric bridge

2026-10-09. Main-only source follow-up to the owner-routed priority after092.
Mode REPRODUCTION_AUDIT. Source: Guth–Wang–Zahl,
https://arxiv.org/pdf/2601.14411v1, §§2.3,3,4 and8 (pp.4,5,7–8,31–32).
Original SOLVER/CRITIC outputs and UNRESOLVED UI evidence remain untouched.
This is a mathematical derivation, not a machine/Lean certificate, novelty claim,
or alleged counterexample to the published theorem.

## Result in Vietnamese

Đọc đầy đủ Bổ đề4.1 và chứng minh của nó cho phép suy ra ba cận mà gói tóm tắt
trước chưa giải thích: Frostman của từng nhóm tube trong tube cha b; Katz–Tao của
họ tube cha b; và khoảng chặn số lượng b²#B. Có thể xây tube cha từ plank, không
được giả định mọi tube cha tùy chọn đều chứa một plank chứng kiến.

Chưa khép toàn bộ G1: bước dùng cận Frostman thấp để loại b trong khoảng giữa
phải áp dụng cho ĐÚNG họ tube sau chọn lọc, hoặc có một bổ đề chuyển cận thấp
có hao hụt được kiểm soát. Cận thấp từ họ trước chọn lọc không tự động truyền
sang họ sau. Đây là nghĩa vụ hẹp hơn trong lượt tái lập, không phải tuyên bố
chứng minh của tác giả sai. G2 về shading và toàn bộ hao hụt vẫn mở.

## 1. What the original factoring proof actually supplies

Let A be a finite family of equal-volume compact convex sets, with each member
of volume v. The greedy procedure chooses W_j maximizing Delta(A_j,W_j), and
assigns G_j=A_j[W_j], then removes those assigned labels. Put D_j=Delta(A_j,W_j).
For every convex U, Delta(G_j,U)<=Delta(A_j,U)<=D_j. At U=W_j equality holds.
Thus G_j is1-Frostman in W_j, with its maximal density D_j.

Retain a dyadic D_j level and a common shape level. Let A' be the union of these
disjoint assigned groups and W the retained outer family. If j_* is the earliest
retained index, A' subset A_{j_*} and G_{j_*} subset A'. Hence

    Delta_max(A') <= D_{j_*} <= Delta_max(A').

All retained D_j are comparable to D=Delta_max(A'). In particular
sum_{T in G_W}|T| comparable to D*|W|. For every convex U,

    sum_{W subset U} D*|W| <= C*sum_{T in A'[U]}|T|
                          <= C*D*|U|.

Cancel D>0: Delta_max(W)<=C. The important statement is near-maximal density
of the RETAINED family A', not automatically of the family A before the greedy
level selection. Counting refinement here is not yet a shading-mass refinement.

## 2. Compatible b-parents can be built with witnesses

Work inside one rho-parent S with h<=a<=b<=C*rho. Apply the preceding construction
to its h-tubes. Each retained W has dimensions comparable to a×b×1, volume ab,
and is contained in a tube of thickness Cb around its long axis.

Choose a maximal b-separated collection of these long-axis parameters in the
four-dimensional space of unit segments (two direction and two transverse
position parameters, in bounded coordinate charts). Enlarge its tubes by a fixed
constant. Every W is contained in one enlarged representative parent P. Assign
each W to one such P, making the choices for representatives so that each P
contains its own representative W_P. Keep whole assigned groups G_W together.
The P are essentially distinct up to fixed constants. They are Cb-tubes, and
|P| comparable to b². Parent changes by fixed factors do not mean exact geometric
containment at thickness b; normalization must retain these fixed constants.

This construction gives an injection P->W_P. It avoids the unjustified shortcut
that an arbitrary coarse cover of fine tubes automatically contains whole planks.
Inside S use its retained family A'_S. Assigned fine fibers A_P are disjoint
and each is contained in P. One may subsequently pigeonhole parent occupancies,
keeping entire parent groups; the density estimates below use the pre-selection
upper density D_S and retained witnesses, which must not be deleted silently.
The local arguments below use the assigned fibers inside S. Transferring them
to the exact geometric fibers of a pre-existing multiscale cover is part of the
cover-matching obligation in(R), not a free identification. Fixed-factor parent
enlargements and restriction to rho labels must be tracked in that transfer.

## 3. Local Frostman bound: the density cancels locally

Let D_S=Delta_max(A'_S). The representative witness gives

    sum_{T in A_P}|T| >= c*D_S*|W_P|,
    Delta(A_P,P) >= c*(a/b)*D_S.

For convex U subset P, A_P[U] subset A'_S[U], so

    Delta(A_P,U) <= D_S,
    C_F(A_P,P) <= C*b/a.

If later a whole witness loses a fraction of its assigned fine mass, retain a
number r_P in(0,1] and use C_F(A_P,P)<=C*r_P^(-1)*b/a instead. A global retention
fraction is not a lower bound for each r_P.

This derivation does not need Delta_max(A'_S) to equal the maximum density of
the union over different rho-parents. The shorthand in §8 can instead be read
locally: both numerator and witness denominator are measured in the same S.

## 4. Coarse Katz–Tao bound by an injection, not by overlap counting

For a convex U containing some parents P inside S, their distinct W_P lie in U.
Since the original outer plank family W_S is Katz–Tao,

    #B_S[U]*ab <= C*sum_{W in W_S[U]}|W| <= C*|U|.

Multiplying by |P| comparable to b² gives

    Delta_max(B_S) <= C*b/a.

There are at most C*rho^(-4) essentially distinct rho-parents in the unit ball:
unit-segment parameters have dimension4. After assigning coarse parents to rho
labels (bounded multiplicity suffices), summing the local bounds gives

    Delta_max(B) <= C*rho^(-4)*(b/a).

With rho=h^eps and b/a<=h^(-u), this is C*h^(-4eps-u). Subfamilies of B preserve
this upper Katz–Tao bound. The witness injection must remain one-to-one within
each rho-family; simply selecting one W for each P without controlling repeated
witnesses is not sufficient.

## 5. Coarse count sandwich from upper Frostman inheritance

Assume the normalized starting family F has C_F(F,K)<=h^(-t), K of constant
volume, and the retained fine family F' has total tube volume at least c(h)
times that of F. Then directly from the definitions

    C_F(F',K) <= c(h)^(-1)*C_F(F,K).

Assign F' to b-parents as above. After retaining a parent occupancy level, the
assigned fine volume per parent is comparable because all parents have volume
comparable to b². The elementary argument in Remark3.3(A) then gives

    C_F(B,K) <= C*c(h)^(-1)*h^(-t),

where c(h) must now include all selections of fine mass up to this point. If
c(h)>=h^kappa and constants are absorbed with further positive slack, write
C_F(B,K)<=h^(-u) for any u>t+kappa. This is an UPPER-bound inheritance statement.

Let X=b²#B. Pick any parent P: Delta(B,P)>=1. The definition of C_F(B,K) gives
X>=c/C_F(B,K), while taking U=K gives X<=C*Delta_max(B). Therefore

    c*h^u <= X <= C*h^(-4eps-u).

This derives the count sandwich using retained-volume and occupancy data.
It does not infer global coarse Frostman from a single local b-fiber alone.

## 6. Scale cutoff: explicit conditional implication and remaining obligation

The interval in Lemma7.7(A), after normalization, is
[h^(1-eps),h^eps]. Assume the SAME retained family F' and its compatible
b-parents satisfy, at every relevant scale r,

    C_F(F'[P_r],P_r) >= c*h^kappa*(r/h)^eta_j.       (R)

Failure of the aspect-ratio estimate gives b/a<=h^(-u); with witness-retention
loss folded into kappa, the local upper bound is C*h^(-u-kappa).
If h^(1-eps)<=b<=h^eps, (R) gives at least c*h^(kappa-eps*eta_j).
These bounds are incompatible when

    eps*eta_j > u+2kappa,
    (C/c)*h^(eps*eta_j-u-2kappa) < 1.

Thus b<h^(1-eps), up to fixed-scale factors with slack, follows PROVIDED(R)
has been transferred to this very family and cover. Using
u=10*eta_(j-1)/(eps*gamma) avoids division by beta at this local step; gamma>0.

What is NOT proved by the cited ingredients inspected in this follow-up is(R)
for every admissible later factoring/pigeonholing refinement. Lemma4.1 preserves
a large retained volume and makes the chosen retained density near-maximal;
it does not assert preservation of the original lower Frostman obstruction.
Lemma5.11 supplies shading/product refinements, not such a lower-bound transfer.
Remark3.3(A) supplies an upper Frostman bound, not a lower one.

Concrete reason not to assume generic lower-bound monotonicity: in K=[0,1],
take the200 partition intervals of length1/200. This family has C_F=1 and total
interval volume1. Add10 distinct shifted intervals of that same length, all
inside J=[0,1/100]. For example their left endpoints are i/2200, i=1,...,10.
Total volume becomes21/20. J contains the two partition intervals and all ten
new intervals, so Delta(A,J)=6 and C_F(A,K)>=40/7. Removing the added intervals
keeps20/21 of total volume but returns C_F=1. All sets are convex and equal-volume.
This disproves a generic implication from large retained volume to retained
lower C_F. It is NOT a counterexample under the uniform essential-distinct 3D
tube hypotheses or to the authors' intended refinement argument.

## 7. Closure accounting

Established beyond092: source proof of near-maximal retained cluster density;
compatible witness-bearing parents; local C_F cancellation; injection-based
coarse Katz–Tao estimate; global rho^(-4) bound; count sandwich with stated loss;
and the exact exponent margin needed for a same-family cutoff contradiction.
These are mathematical source-derived bounds, not finite numerical samples.

G1 remains PARTIALLY_ESTABLISHED, not CLOSED. Its narrowed residual is to justify
(R), or an alternative argument producing the required cutoff, for the actual
mass/shading-preserving refined family, with a quantified loss small enough for
eps*eta_j>u+2kappa. This residual belongs to G1; it is not renamed away as G2.
G2 still includes the complete analytic/shading/recombination loss ledger and
uniform positive improvement. Main Lemma1 remains UNRESOLVED in our reproduction.
No assertion that the published proof is wrong, and no AI superiority score.

Recommended next mathematical action, requiring owner routing: derive a robust
same-family obstruction-transfer lemma or revisit the source's factoring/refinement
order to avoid needing one. No additional LLM call, gate or checker framework
is authorized or useful until that concrete mathematical choice is settled.

## 8. A source-grounded way to avoid the invalid generic inference

Follow-up source, actually read in this turn: Wang–Zahl,
https://arxiv.org/pdf/2502.17655v1, Proposition6.3 and its proof in§6.1,
printed pp.52,56–58. The HTML tool could not load this4.3MB page; the official
PDF was downloaded (3.9MB) and the relevant text extracted. Printed p.56 was
visually checked. This is the paper cited as[8] by the streamlined source.

Its factoring-trichotomy proof regularizes admissible-scale covers, applies
Proposition4.6 with induced refinements to descendants, and THEN classifies the
retained fibers as Type1/Type2. Balanced branching counts (6.17) are retained.
When all stages pass, the surviving family is Frostman at every scale. At a
failed stage, it constructs prisms of small volume relative to their parent.
Flat prisms produce one conclusion; the non-flat case constructs a finer
balanced cover, establishes upper Katz–Tao bounds and chooses the outer scale
using branching-count inequalities (6.23)–(6.24).

This is a documented alternative proof ORGANIZATION: refine/factor first,
then obtain the needed statement about that refined family, rather than simply
assert a lower obstruction survived arbitrary deletions. It is not a proof
here of(R), nor permission to invoke Proposition6.3 as if its hypotheses and
conclusions were identical to Lemma7.7 in the current normalized setting.

The inspected original Proposition6.3 is geometric, but the original paper's
E/D volume estimates also use Frostman SLAB constants, with additional m/ell
factors (Definition1.5). They cannot be silently substituted for K_KT/K_F or
declared equivalent. A rigorous replacement route would need a stated dictionary
of assumptions and quantitative outputs, plus the shading losses in our G2.
This route is parked for explicit owner confirmation; no strategic switch,
fresh LLM call or new infrastructure was made during this G1 source follow-up.
