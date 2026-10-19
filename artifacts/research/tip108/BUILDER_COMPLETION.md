# TIP108 Builder Completion Report — scoped STOP, root OPEN

Terminal handoff: 2026-10-11 approximately04:25UTC. The60minute window ends
04:48UTC; this is NOT exhaustion of that window or the computational budget.
Stop reason is the named current strategy obstruction: no justified
branch-independent inequality for the common-q coupled two-group functional
on the remaining2+4/4+2/3+3 domains. No automatic successor or budget reset.

## Outcome and scope

Hand-proved the proper common-base group bound
G_group>=(k+1)/4-s/2 for k<=5, arbitrary distinct integer labels from1,...,6,
offset range s<=18/31, ties and nonmonotone offsets included. Proof uses
horizontal slice hulls, upper bounds on adjacent gap wedges, a general-endpoint
four-edge path-energy inequality, and controlled arbitrary label-gap insertion.
The k<=5 restriction is essential; no globalK6 extension is asserted.

This closes ALL two-bottom-component1+5 and5+1 configurations, not a selected
family: a singleton has exclusive scaled area>=1/10, so
G>=8/5-S/2 and D>=6/5-2S>=6/155>0. Also F>=203/930=20/93+1/310.
Among the retained42necessary oriented signatures, these are exactly8.
The20size2/4 and14size3 signatures retain arbitrary continuous offsets and
remain OPEN. GlobalK6 also retains the separate one-bottom-component
13order-word continuous domain. No auxiliary D<=0 or smaller root witness
was found. TIP108R1 and globalK6 are NOT closed.

Vietnamese: Đã chứng minh chặn diện tích cho mọi nhóm con tối đa năm nhãn
và loại toàn bộ8phân hoạch1+5/5+1còn lại, với D>=6/155. Còn34phân hoạch
hai thành phần và miền một thành phần13thứ tự đỉnh. Không có chứng chỉ
D<=0 hay nghiệm nhỏ hơn20/93. Dừng do thiếu bất đẳng thức ghépq và các
offset trên toàn miền, không phải đã hết thời gian hay ngân sách.

## Exact computational evidence, not universal closure

All four dual variants use the difficult L456/R123 signature and check ALL
permitted membership atoms. Each produces a feasible exact lower certificate
and matching upper multipliers for its explicit abstract relaxation:

* Coarse nonnegative-a:47atoms,22variables,76pivots, optimum70/61.
* Five-band nonnegative-a:186atom-band constraints,30exact band cap
  certificates,415pivots, optimum70/61.
* Coarse signed-a:47atoms,28splitvariables,92pivots, optimum70/61.
* Coarse signed-a plus new proved group-mass53/31:47atoms,29splitvariables,
  81pivots, optimum70/61.

Every optimum is below40/31 by270/1891. No42signature LP expansion followed.
These matching upper certificates are NOT realizable triangle configurations;
they prove limitations of the stated moment information. In particular they
lose common inter-group q and constituent offsets across heights/pairs.

One exact hand-chosen near-touching control p=(491,491,401,90,0,0)/310 has
two components, S18/31, gap1/310, connected positive-overlap graph,
endpoint degrees5. Both immutable tip098 methods give F814013/3459600,
D70013/288300>0. This is finite point evidence only, not a proof of the
remaining3+3 domain or a countercertificate.

## Last analytic attempt and missing obligation

The h=1/2 coupling functional bounds cross intersection by low-height
slice-hull intersection plus the high-height sum of all cross-pair
intersections. Together with the valid group hull-minus-wedge lower bounds
it is universally valid and exact at zero-span consecutive3+3,q7/6,
G107/72. It retains q and every relative offset, unlike independent maxima.

No inequality strong enough on its entire34signature continuum was proved.
High-height pair sums can overcount triple intersections, potential adjacent
wedges can be covered by longer-label bridges, and exposed-envelope labels
change in admissible branches. Neither local tangent support nor independent
pair-band maxima license a whole-domain conclusion. The proposed3+3 and2+4
affine supports remain explicitly unproved in PROOF_ATTEMPT_LEDGER.md.

## Verification and execution ledger

Builder5actual mathematical processes, no failures:

1. Coarsepilot0.1212501669942867s; conservativecharge0.2s;25shardcap.
2. Heightpilot6.2403784590133s; charge6.25s;25shardcap.
3. Exactpoint0.002184416021918878s; charge0.01s;29shardcap.
4. Signedpilot0.1559697919874452s; charge0.2s;5shardcap.
5. Groupmasspilot0.13221675000386313s; charge0.2s;5shardcap.

Actual internal sum6.651999584020814s; conservative Buildercharge6.86/75s.
Main reports6fresh mathematical checks, conservative6/45s: all4saved dual
variants replayPASSwithout simplex, near-touching pointPASSboth immutable
area methods, and independent fixed-range-group quadratic refutation.
Combined11processes, conservative12.86/120s. Ordinary source reads,
apply_patch edits, byte counts and fingerprints are metadata operations,
not mathematical executions. No invocation cap was manufactured.

Main independently hand-validated the complete proper-group proof and1+5
area bound. This is internal research review, not an external referee or
globalK6certificate. Solver checks and fresh replays do not replace the
remaining mathematical proof.

## Deliverables and controls

New files only under artifacts/research/tip108:

* atom_dual.py — coarse exactpilot; --signed-a and --group-bound; --replay
  checks saved vectors without optimization. create-only--out.
* height_dual.py — complete exact band caps and five-band pilot; --replay
  reconstructs cap certificates/atoms and checks vectors, without simplex.
* point_control.py — one exact rational point through both retained methods,
  bottom-component/graph/defect ledger; no search. create-only--out.
* PROOF_ATTEMPT_LEDGER.md — full proofs, failed relaxations, coupling gap,
  exact run ledger and bilingual scope.
* BUILDER_ATOM_DUAL_PILOT.json; BUILDER_HEIGHT_DUAL_PILOT.json;
  BUILDER_NEAR_TOUCH_CONTROL.json; BUILDER_SIGNED_A_DUAL_PILOT.json;
  BUILDER_GROUP_MASS_DUAL_PILOT.json.
* This Completion Report.

No random/nav/cellwalk/fullgeometrycover, compiles, dependencies, installs,
app/API/UI/DB/auth/config/Git/build operations. No scratch project/distDir.
All source writes used apply_patch. Nothing was deleted and no cleanup was
needed. Old tip098 exact area source fingerprint remains
26c3b41b3bb731d67247ef1033e94ba4e0dbb0b58aa662858bafe0603596cf55.
The nine pre-completion files were135661bytes before the final hull wording
clarification; total package remains far below16MiB.

Runtime gates and external review obligations are unchanged. Parent owns
the final durable handoff/report update and any next routing question.
