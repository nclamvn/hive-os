# TIP-053: conditional prefix argument and complete abstract KZ minimum

## Header / decision

Priority P0; depends on TIP051/052. Owner requested the next theorem-first
continuation. Contractor designs and verifies; separate Builders implement.
This bounded extension keeps the approved architecture, so no new blueprint
ceremony. Primary source https://arxiv.org/html/2609.02604v2 §§3.2–3.4.
Moving speeds n=13/14, total runners n+1, lattice dimension d=n-1.

## Scope and mathematical specification

R1: Retain a reviewed CONDITIONAL separated-points/nearest-plane prefix trace.
B_r=(2r/((n+1)(n+1-r)))^2, B_0=0, c_i=B_i-B_{i-1}.
For each of all 25 prefixes record separation 1/(n+1-r), error capacity
r/((n+1)(n+1-r)), exact difference 1/(n+1), lower LRC max n-r.
The nearest-plane error <=sqrt(sum t_i)/2 and E subset D are explicit premises;
equality yields a witness, hence counterexample prefixes are strictly >B_r.
Source's rational-subspace induction and KZ basis existence are written
mathematical review, NOT a fabricated computational witness or formal proof.
Lower cases and geometric application remain NOT_ESTABLISHED locally.

R2: Check the abstract REAL-variable product bound given those constraints.
rho=3/4, w_i=rho^(i-1), z_i=t_i/w_i. Feasible region is monotone positive z
with weighted prefixes >=B_r. Given source c_{i+1}/c_i>4/3, c_i/w_i strictly
increases. Every vertex is described by contiguous constant-z blocks whose
ends are active prefixes. No prefix can be active inside a block: activity at
r gives z<=c_r/w_r, feasibility at r+1 gives z>=c_{r+1}/w_{r+1}, contradiction.
Counting independent active constraints forces all block ends active.
Conversely every contiguous composition is feasible: block z is the weighted
average of c_i/w_i, increasing across blocks and dominating internal prefix
averages. Block ends and within-block equalities give d independent constraints.
There are exactly 2^(d-1) vertices: 2048 and4096. Positive pointed polyhedron
has recession cone 0<=u_1<=...<=u_d; Minkowski–Weyl plus coordinate-increasing
concavity of sum log(w_i z_i) puts its infimum at a vertex. This WRITTEN bridge
is essential; finite enumeration alone is not a real-domain proof.
For ALL 78+91 contiguous blocks, exact rational geom-product >= product c_i;
then independently enumerate ALL 6144 cut masks, prefix/KZ feasibility,
minimum K=product c_i and unique equality at all singleton blocks. Retain a
complete ordered stream digest and counts, not 6144 bulky rows. Consumer must
recompute ALL masks, not trust counters/digests supplied by producer.

R3: New pinned stdlib Python independent replay, shell=false, isolated -I -S -B,
bounded input/output, <=10s global collector and <=5s remaining replay cap.
Fixed n/rho/source specification, canonical rational validation, all block
intervals and mask domain reconstructed; coherent-rehashed missing/duplicate/
forged block, stream, count, minimum, equality or theorem-promotion rejected.
Source/report/hash receipts unsigned local trust only. Retained report <=262144
bytes, Python <=30000 bytes, stdout <=262144, no caller-selected unbounded n.
Create-only collector output; no resealing old evidence. Pure retained UI GET
has no subprocess, network, model or old validator invocation.

R4: New bilingual section in existing proof dossier. Preserve palette, layout,
MathText, wrapping provenance and 320px responsiveness; add only minimal parent
imports/insertion. Show abstract minimum vs conditional application distinctly,
all23 existing global obligations OPEN and LRC14/15 NOT_ESTABLISHED. Lower LRC,
ellipsoid/geometric bridge, shape, full author terminal coverage stay OPEN.
Fail closed on unavailable/corrupt data. No theorem-percent or novelty claims.
This is retained analytic audit, NOT fresh HIVE model campaign or new host seam.

R5: Tests include boundary equality, all masks/blocks, pinned real Python,
coherent-rehashed attacks, pure GET/VI/EN/failclosed; independent skeptical
mathematical review of continuous-to-finite bridge. Negative controls: omit KZ
with B=[1,5], t=[5,2/5] gives product2<4; omit c-growth with B=[1,2],
t=[8/7,6/7] gives48/49<1 while satisfying rho and prefixes. Neither control
is an LRC counterexample. Main runs focused regressions/type/lint/build and
live browser checks; reports requirements count and explicit NOT_RUN gates.

## Ownership / constraints / report

Core Builder owns new prefix-kz pure module, independent replay helper/Python,
CLI, artifact and unit tests. Coordinate stable exported API with UI Builder.
UI Builder owns new prefix-kz panel/tests and minimal proof-panel insertion.
Reviewer owns independent review only. Main owns TIP, manifest, mathematical
note, verify report and handoff. Read AGENTS/handoff/installed Next guide.
Use apply_patch; preserve all unrelated dirty work. No changes to old source
reports/pins, frozen051plan,052host seam/helper, old tests or selectors. No
dependency install, DB/schema/migration, API/job/model campaign, author code,
billing, commit/push/deploy. Queue/worker remain OFF.
Each Builder supplies Completion Report with R coverage/tests/issues/deviations.
