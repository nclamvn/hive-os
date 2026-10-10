# Five translated Kakeya triangles — critical review dossier

Date: 10 October 2026. Status: READY FOR EXTERNAL REVIEW, NOT EXTERNALLY ACCEPTED.
Scope: the finite five-triangle model only. This is not the Kakeya conjecture.

This dossier is a source/proof audit and a proposed referee packet. No new
mathematical calculation, search, replay, build or test was executed in preparing
it. Computational counts below are preserved TIP101 results, not new validation.
The original Main report is unchanged, SHA256
`8aa3eb90345f776e0428b5fb5a5f4ce444135de5efca8ba46a5d02c5257f3796`.
Read it together with the explicit correction below. Its source/certificate files
are unchanged. The earlier closure is a computer-assisted claim with written
analytic premises, not an external referee's verdict.

## 1. Literature assessment and attribution

The primary Station notebook uses exactly the triangle model below. Its Theorem
3.5 concerns the reflection-fixed locus; Proposition3.6 supplies the asymmetric
witness; Corollary3.7 leaves unrestricted n=5 open. These are distinct claims.
[Author verification notebook](https://dualverse.ai/station/math/discretized-kakeya-needle/).

Section6.4, S2 of Chung, Du and Wesley's preprint v2, dated14 September2026,
likewise distinguishes the symmetric optimum from the unresolved full value.
[Station preprint v2](https://arxiv.org/html/2608.23691v2#S6.SS4).

The proposed contribution is therefore a global LOWER bound matching their
already-public witness, not discovery of the value as a construction. No claim
of being first is made. The theorem is potentially new relative to these primary
sources if the proof survives review, but search absence cannot establish novelty.

Targeted search on10October2026 included:

- `"Kakeya" "14/61" triangles`;
- `"five triangles" Kakeya minimum area`;
- `"discretized Kakeya needle"`;
- `"C_T(5)" Kakeya`;
- `"discretized Kakeya" "14/61"`;
- `"Kakeya" "five" "global optimum"`;
- `"14/61" "Kakeya" proof -site:dualverse.ai -site:emergentmind.com`;
- `"discretized Kakeya" "n=5" optimum proof`;
- `"On certain minima related to the Besicovitch-Kakeya problem"`.

No separately published global n=5 proof was identified in the returned results.
This is a bounded public search, not a full MathSciNet/zbMATH/citation-network,
non-English, private-manuscript or author-correspondence search. Secondary AI
summaries were discovery aids only, not proof or novelty authority.

Historical references identified in the primary source include Schoenberg1962
and Keich1999. The journal's own index confirms the Schoenberg article, pages
145–148; its full text was not obtained in this pass. Keich's DOI redirect was
inaccessible to the browsing tool, so its full contents were not checked.
[Journal index](https://math.ubbcluj.ro/~mathjour/cont27-1962.html),
[Keich DOI](https://doi.org/10.1112/S0024609398005372).
The related HorizonMath preprint was located, not audited for this exact claim:
[arXiv2603.15617v2](https://arxiv.org/abs/2603.15617v2).
One GitHub notebook page opened; the notebook's Lean/task links failed to fetch.
No Lean result was inferred from those links and no formal checker was run.

## 2. Precise claim submitted for review

For arbitrary real offsets, let

\[
T_j(x_j)=\operatorname{conv}\left\{(x_j,0),
 (x_j+1/5,0),(x_j+j/5,1)\right\},\qquad 1\le j\le5.
\]

The computer-assisted claim is

\[
\left|\bigcup_{j=1}^5T_j(x_j)\right|\ge\frac{14}{61},
\qquad C_T(5)=\frac{14}{61}.
\]

Equality is attained by the public Station witness

\[
x=(79/305,47/305,10/61,12/305,0).
\]

The upper bound and that witness are attributed to Station. The proposed new
part is the all-offset lower bound. This work was source-aware and assisted by
LLMs; it is not a blind benchmark, an official FrontierMath score, a measured
method-vs-one-LLM advantage or a formally verified theorem. The reviewer is asked
to test the whole proof, not merely to approve the known witness.

## 3. Source audit: findings and trust boundary

| Obligation | Source-audit finding | External action still required |
|---|---|---|
| Model identity | Exact match to primary definition | Confirm intended geometry, not another Kakeya model |
| Outside/degenerate configurations | TIP100 supplies17/74 bound via pair/triple/cap inequalities | Check all disjoint-pair branches and the60 rational certificates |
| Compactness and interior attainment | Closed pair polytope compact; witness lies below its boundary bound | Check no unbounded branch escapes the reduction |
| C1 regularity | Fixed-strip slice derivatives admit uniform Lipschitz domination | Check persistent coincidences and continuity of gradient |
| Coarse quadratic geometry | Triple/parallel walls and clipping suffice | Apply correctionC1 below; verify boundary-incidence argument |
| Coverage including faces | Closed inner hulls, disjoint interiors, exact volume equality | Review hull code and reproduce volume certificate |
| Cartesian bottom phases | All chain label products retained, not just center event order | Apply clarificationC2 below to wall/tie incidence |
| Stationary algebra | Independent elimination checks rank, full nullspace and exact value | Review own-elimination code; reproduce acceptance |
| Singular infeasibility |94 saved invariant-inequality contradictions, not point sampling | Inspect annihilation of entire nullspace |
| Claimed independence | Different integration and elimination implementations; same LLM-assisted project | Do not confuse algorithmic replay with external human review |

No additional blocking mathematical defect was identified by this written/source
audit. That is not a guarantee that none exists. The boundary proof remains a
substantive analytic dependency, not something a new unit test can establish.
Existing40/40 tests and six AST checks were run in TIP101; none were rerun here.

### Correction C1: endpoint-pair exception at the cone's top boundary

The original report says `0<A_j-A_i<A5` for every i<j. This is literally false
for (i,j)=(1,5), since A1=0 and A5-A1=A5. The corrected statement is

\[
0<A_j-A_i<A_5\quad\text{unless }(i,j)=(1,5),
\qquad A_5-A_1=A_5.
\]

For every non-extreme pair, a crossing at t=A5 would require an apex difference
equal to a nonzero integer slope difference times A5, which is impossible.
For the extreme pair, endpoint slopes are {−1,0} and {−5,−4}; their nonzero
differences have magnitudes3,4,5, never1. Hence this pair also cannot produce a
parameter-dependent crossing at t=A5. Same-triangle coincidences at t=0 are
structural; adjacent parallel coincidences require equal apices and are excluded.
The conclusion that no extra clipping wall is needed is unchanged, but its
written proof must include this exception. No numerical certificate was changed.
This is specific to n=5 and must not be copied to another n without checking.

### Clarification C2: incident open phase at an internal wall

At a putative minimum A*, choose a full-dimensional shape chamber whose closure
contains its strict shape. Approach A* through that chamber and strict K5, avoiding
bottom ties. A subsequence has constant bottom-max/min labels (a,b), because the
label set is finite. Their limits are extrema at A*, so the all-tied-extrema
ordering implies a<b. The labels occur in that chamber's envelope chains, and
its Cartesian inventory includes (a,b). The corresponding polynomial equals
area on this approaching open phase. Continuous gradients then give
grad p(A*)=grad area(A*)=0. Thus the proof does not assume that an arbitrary
wall-only label occurs in every adjacent open chain, or that merely touching a
polytope automatically establishes gradient equality.

## 4. Proof route a referee should attack

### 4.1 Disjoint-pair exclusion and compactness

Each triangle has area1/10. For a positive slope gap r, scaled overlap is

\[
J_r(D)=\int_0^1(1-y-|D+ry|)_+\,dy.
\]

It vanishes outside (−r,1), and max J_r=1/(r+2). Its exact branches are

\[
J_r(D)=
\begin{cases}
0,&D\notin(-r,1),\\
(D+r)^2/[r(r^2-1)],&-r<D<-1\quad(r>1),\\
[r-2rD-(r+2)D^2]/[2r(r+1)],&-1\le D\le0,\\
(1-D)^2/[2(r+1)],&0\le D<1.
\end{cases}
\]

These follow by integrating the linear overlap on either side of D+ry=0;
their shared endpoints agree. A disjoint nonadjacent pair i<j, with i<k<j,
implies J_(k−i)+J_(j−k)<=1/(min(k−i,j−k)+2). Inclusion-exclusion of the three
triangles therefore gives area>=7/30. For adjacent pairs, exact clipping of the
J-branch rectangles and their disjointness halfspaces yields the following
strongest third-triangle bounds (one-based labels):

| Disjoint pair | Bottom-separated | Apex-inverted |
|---|---:|---:|
|1,2;4,5|16/65|11/46|
|2,3;3,4|6/25|8/35|

The finite supporting file is `artifacts/research/tip100/ALL_60_CERTIFICATES.json`.
It contains the clipped polygons and all vertex/edge/interior stationary
candidates. Its labels are zero-based. In particular pair1,2 uses third label5,
and pair2,3 uses third label5; reflection handles the other two pairs. Merely
reading its maxima is not a replacement for auditing its exhaustive candidate
argument and arithmetic.

The remaining central apex-inverted branch is handled analytically. The top-cap
argument in TIP100 gives, in its variables,

\[
\text{area}\ge\frac25-\frac q5+\frac{37q^2}{630}
=\frac{17}{74}+\frac{37}{630}\left(q-\frac{63}{37}\right)^2.
\]

The case outside q∈[3/2,2] has larger triple bounds. The cap proof must be checked
for all separations delta>=0, including tangency; it uses the universal bound
J_2(a)+J_1(b)<=3/7 when a−b<=−1, not the erroneous nonconsecutive-slope shortcut
refused in earlier work. Together all zero-overlap pairs give17/74>14/61.

With x5=0, the closed pair-overlap polytope has20 inequalities

\[
-(j-i)\le5(x_j-x_i)\le1.
\]

It is compact, and all boundary/outside configurations are excluded by the above
bound. Therefore a global minimum exists in its strict interior.

### 4.2 Regularity and shape reduction

Put A_j=5x_j+j and translate to A1=0. In strict K5,
0<A_j−A_i<j−i+1 and 0<A2<A3<A4<A5<5. At t=1−y, the scaled intervals are
[A_j−jt,A_j−(j−1)t]. Area is1/5 of their union-length integral on the FIXED strip
0<=t<=1. Distinct endpoint lines coincide at finitely many t, except possible
adjacent parallel lines; equality of their intercepts is excluded by strict apex
ordering. Away from these finitely many t, union length is locally affine in A.
Its translation difference quotients are uniformly bounded by symmetric-difference
length. Dominated convergence proves continuous partial derivatives and hence C1.

Normalize v=A/A5. The free shape is0<v2<v3<v4<1. Triple concurrence and parallel
coincidence of the ten lines give homogeneous parameter walls. The corrected
clipping argumentC1 supplies the remaining boundary check. On each chamber,
union-boundary vertices are affine; shoelace yields a homogeneous quadratic
cone energy. Swaps of unrelated crossing heights do not change boundary incidence.

With L_A(t) denoting scaled cone union length, set

\[
Q(A)=\int_0^{A_5}L_A(t)\,dt-\frac32A_5^2.
\]

For t>=A5, L_A(t)=5t−A5. Strict K5 also gives a connected union for t>=1.
The exact area formula is

\[
5\,\text{area}=\frac52-A_5+Q(A)-U(A)-V(A),
\]

where U,V are the upper/lower hull correction integrals from1 to A5, zero for
A5<=1. The decreasing upper and increasing lower envelope chains supply exact
quadratic formulas for these tails once their bottom labels are fixed. Dropping
the positive tails would give an invalid lower bound and was explicitly refused.

### 4.3 Exhaustiveness of the computational certificate

There are42 cutting walls. The saved2632 inner hulls have distinct sign words,
satisfy all simplex/sign inequalities, and exact total volume1/6. Finite closed
union plus volume equality covers even all faces: a nonempty relative-open
complement would meet the simplex interior and have positive volume. This argument
requires ACTUAL hull volumes; the independent checker reconstructs supporting
facets rather than assuming the producer's edge topology.

Any global minimum has all bottom-max labels smaller than all bottom-min labels.
For fixed shape, scale stationarity gives area=half bottom width. If the right-hand
phase had a>b, its linear coefficient d=v_a−v_b would be positive and stationary
scale would force negative quadratic coefficient, contradicting local minimality.
The extremal tied labels choose that phase, so the ordering includes ties.
All Cartesian chain pairs a<b are retained, not just center radial phases.

For each quadratic p, solve its full four-variable stationary equations. If
inconsistent, there is no candidate. Otherwise p is constant on its complete
stationary affine set. Safe values require no feasibility assumption. Below-target
unique points violate an exact feasibility row. Each below-target singular set is
excluded by a row whose normal annihilates its complete nullspace and whose
constant is negative. C1 and clarificationC2 apply full stationarity even on walls.

Preserved finite results:2632 cells,667 distinct quadratics,8658 cases;3998 safe,
4436 unique below-target infeasible,94 singular below-target infeasible and130
inconsistent. All94 saved singular contradictions have invariant constant−2.
Both computational paths agreed, but these counts do not establish analytic
premises by themselves. The known equality witness completes the proposed proof
only after the premises and case inventory are accepted.

## 5. Minimal review materials and reproduction

Start with these documents, not the entire application's historical task stack:

1. This dossier, including correctionC1 and clarificationC2.
2. `docs/research/KAKEYA_K5_CLOSURE_101_REPORT.md` — full Main proof/cost history.
3. `docs/research/KAKEYA_RESIDUAL_STRUCTURAL_100_REPORT.md` — outside-bound proof.
4. `artifacts/research/tip100/ALL_60_CERTIFICATES.json` and `triple_bounds.py` —
   disjoint-pair arithmetic dependency.
5. Under `artifacts/research/tip101`: `shape_walls.py`, `coverage_check.py`,
   `acceptance_check.py`; saved geometry `MAIN_FULL_SHAPE_COVER.json`; producer
   ledger `MAIN_FULL_STATIONARY_CERTIFICATE.json`; and the two saved verification
   outputs `MAIN_FULL_SHAPE_VERIFICATION.json` and
   `MAIN_INDEPENDENT_STATIONARY_VERIFICATION.json`.

Also make `coverage.cpp` and `stationary.py` available for provenance/source audit.
They are not needed to replay acceptance of the already-saved certificate.
No app configuration, credentials, database or browser session belongs in the
review payload. No archive, public repository release or message was sent here.

From the existing checkout, independent acceptance uses Python standard library:

```sh
python3 -B artifacts/research/tip101/coverage_check.py artifacts/research/tip101/MAIN_FULL_SHAPE_COVER.json --out REVIEW_VOLUME.json --seconds 60
python3 -B artifacts/research/tip101/acceptance_check.py artifacts/research/tip101/MAIN_FULL_SHAPE_COVER.json artifacts/research/tip101/MAIN_FULL_STATIONARY_CERTIFICATE.json --out REVIEW_STATIONARY.json --seconds 180
```

Use new output filenames. No compile, dependency install, native producer, app
server or full search is required. These directions are for a separately routed
reviewer; this follow-up did not execute them or reset any exhausted grant.
The outside-bound certificate should also be independently audited; these two
commands alone do NOT verify the whole analytic theorem.

## 6. Referee questions and an unsent cover note

Please explicitly address:

1. Are the triangle definition, scaling/gauge and strict K5 equivalence correct?
2. Does the17/74 theorem cover every disjoint/tangent pair and every real offset?
3. Are C1 and full-gradient necessity valid at all internal arrangement walls?
4. Do the42 walls preserve the necessary cone/hull geometry after correctionC1?
5. Do the actual-hull volume argument and Cartesian phases omit any case or face?
6. Are every nullspace and every infeasibility contradiction complete and exact?
7. Is there an earlier proof of unrestricted C_T(5)=14/61 under this same model?

Report a specific lemma/line, missing region or exact counterexample for a
rejection. A numerical optimization screenshot or a vote is not sufficient.
Distinguish correct / repairable gap / blocking gap / prior known result /
unable to review. Record reviewer identity, date, materials read, calculations
actually rerun and any source edits. An AI reviewer is supplementary, not a human
external acceptance, and should be labelled as such.

Suggested first contact: the authors of Station, who stated this exact open
problem, asking for a mathematical referee or a pointer to prior work. A second
referee with computational/discrete geometry expertise and no involvement in
this proof would strengthen independence. No private contact address is guessed.
The owner says no referee is currently available; human acceptance remains OPEN.

Draft subject: Request for critical review — exact lower bound for five Kakeya triangles

> We have an LLM-assisted, computer-assisted proof dossier for the finite
> translated-triangle quantity C_T(5), claiming a global lower bound14/61 matching
> your public asymmetric witness. We are not claiming a solution of the general
> Kakeya conjecture or an externally accepted new theorem. The dossier combines
> an analytic exclusion of zero-overlap pairs, a C1/full-stationarity reduction,
> and exact rational coverage/acceptance certificates. It includes an explicit
> correction to a boundary sentence in our initial write-up. Could you critically
> review the reduction, recommend a referee, or identify prior work resolving this
> exact finite case? We can provide the proof and minimal standalone evidence.

This is a DRAFT only. Recipient, permitted materials and external sending must
be confirmed separately; no response or endorsement has been received.

## 7. Completion checkpoint

R1 bounded primary-source comparison DONE, novelty UNRESOLVED; R2 source/proof
audit DONE with one explicit repair and one incidence clarification; R3 reviewer
dossier DONE; R4 actual external mathematical acceptance OPEN (no named referee).
No new computational tests or theorem runs; prior execution limits/history intact.
Vibecode was reduced to TIP+report: no software Builder, framework, new gate or
agent swarm was needed. The skill influenced preservation and claim separation,
not the mathematical truth conditions.

Overall: READY TO REQUEST REVIEW, NOT READY TO ANNOUNCE AN EXTERNALLY VERIFIED
NEW THEOREM. Stop this preparation pass; choose a human referee/release channel
before any external coordination or stronger public claim.

Terminal preparation checkpoint:2026-10-10 10:07:54UTC,8min34s after start and
within the30min source/document review envelope. R1-R3 DONE; R4 OPEN. Original
Main/TIP100 report hashes and all five implementation/checker source hashes were
rechecked and remain identical to the recorded predecessor values. This was
file-integrity inspection, not fresh mathematical validation. New scientific
invocations0, new tests0, new compiles0, new agents0. No deletion or scratch/build
artifact was needed. External sending0; reviewer name/acceptance0.

## 8. Presentation-stage summary erratum — 10 October 2026

During the owner-authorized bilingual UI integration, direct inspection of the
unchanged `MAIN_INDEPENDENT_STATIONARY_VERIFICATION.json` found that the prose
summary "all94 saved singular contradictions have invariant constant−2" is
incorrect. The actual retained exclusions are **80 closed rows with constant−2**
and **14 strict rows with constant0**. The latter contradict a required expression
`>0`, rather than `>=0`. `acceptance_check.py` lines249–251 explicitly accepts
`constant<0 or kind=='strict' and constant==0`, after checking that the row
annihilates every nullspace direction. Cell873/pair(1,4)/strict-row16 is one such
zero-constant record. Both kinds exclude the complete stationary affine set.

This corrects Sections3/4.3 above, the original Main report's prose summary and
earlier explanations; it does not change any certificate, implementation or
classification total. No mathematical replay was run in making this correction.
The earlier dossier SHA256 was
`723f5a1604fdfc61b77b2e31532b2604ca2cf987f0d749a7dc87e04ce7a7efa8`;
its content is preserved above with this appended correction. The original Main
report remains unchanged. External mathematical acceptance and novelty remain
open; file-integrity checks and UI tests do not discharge them.

### Tiếng Việt

Khi tích hợp giao diện song ngữ theo yêu cầu chủ dự án, đối chiếu tệp phát lại gốc
phát hiện lỗi tóm tắt: không phải cả94 hằng số đều bằng−2. Có **80 hàng ràng buộc
đóng với hằng số−2** và **14 hàng nghiêm ngặt với hằng số0**. Loại thứ hai mâu thuẫn
với điều kiện biểu thức `>0`. Bộ kiểm tra gốc đã xử lý đúng cả hai loại và kiểm
hàng đó triệt tiêu toàn bộ không gian null. Ví dụ: miền873, cặp(1,4), hàng nghiêm
ngặt16. Đính chính này sửa lời văn, không sửa chứng chỉ, nguồn thuật toán hay tổng
số trường hợp; không chạy một lượt phát lại toán học mới. Phản biện bên ngoài và
xác nhận tính mới vẫn chưa hoàn tất.
