# TIP108C — Core method, coverage and admission decisions

This records the Owner-routed successor after TIP108B STOP. Same finite K6
near-two-group defect D>0; no global closure or general Kakeya claim.

## Uniform lower bound, not a point sample

For p_j in[l_j,u_j] and fixed y, the nonempty interval
[u_j+j*y,l_j+1+(j-1)*y] lies inside [p_j+j*y,p_j+1+(j-1)*y]. Thus the
union of cores is a subset of every actual union in the parameter box.
Its exact integrated area G_core is a UNIFORM lower bound. Any certified
2G_core-2-S_upper>0 therefore excludes the whole admissible box, not just
its center. Inverted/empty cores after death must be omitted.

Gauge minL=0, minR=q. For each label partition enumerate ALL choices of
minimum member in both groups (ties may occur in multiple charts). Four
nonanchor offsets u/v plus q are five coordinates; S=maxu+maxv and
d=q-maxu. All34 signatures and286 charts must be present. Their root bounds
u/v in[0,18/31], q in[1,75/31] contain the near-domain. A q-dependent
translation by -q/2 preserves each actual area; its box bounds use the SAME
q interval, never independent q values in the two groups.

Given dyadic MIDPOINT splits only, H=62*2^m is a common denominator for all
shifted offset bounds. In scaled X coordinates W=60H*X, T=60H*y, the endpoint
laws have integer intercepts and slopes0..6. Every nonparallel crossing and
core death has integer T, because each nonzero slope difference divides60.
The complete event set includes0 and60H. Union length is continuous and
piecewise affine between events, even when cores die. If N is the sum of
event trapezoid numerators, G_core=N/(7200H^2). The verifier uses its OWN
midpoint-affine integration and reconstructs every box from roots/splits.

Allowed all-box domain rejection:
S_lower>18/31; S_upper<=18/61; d_upper<=1; or d_lower>=the retained
far-separation threshold (57/31 or7/4). These refer to the exact remaining
domain; inequalities must not accidentally remove its S=18/31 boundary.
S_upper for the positive-defect test is min(18/31,max_upperu+max_upperv),
since the test applies only to admissible members of the box.

All branches must terminate in a positive uniform leaf or a sound all-box
exclusion. INCOMPLETE/frontier/missing-root/missing-child/corrupted-split
evidence must be refused, irrespective of how many other leaves pass.

## Effort qualification is not guaranteed mathematical completion

No uniform positive margin on the closure d=1, nor a complete leaf-count
bound, has been proved. Strict D>0 on d>1 need not imply a finite strict
positive closed-box certificate near that boundary. The checker must not
assume finite termination. A complete certificate, if one is produced,
would itself establish the required uniform bound over its leaves.

For an offset uncertainty delta<=1, each triangle loses at most
delta-delta^2/2 of area to its core; for delta>=1 the loss is1/2. Hence
G-G_core<=sum delta_j is a coarse universal convergence estimate. Together
with a KNOWN defect margin it would imply a sufficient grid resolution,
but the presently unknown margin cannot be inserted into a cost estimate.

Sensitivity counts (not necessary-depth estimates): four-way subdivision
of each of five coordinates gives286*4^5=292864 leaves,585442 producer
tree nodes and up to878306 core evaluations including checker positive
leaves (1170884 structural visits if both traverse the whole tree).
Eight-way refinement gives9371648 leaves, up to28114658 core evaluations
and37486020 structural visits. These counts do not prove infeasibility and
do not justify a guaranteed120s full-production claim.

Main therefore admits minimal independent implementations and fixed controls
first (initial aggregate<=10s), not a large geometry-cover platform. A ONE
capped WHOLE attempt may be released only after source/correctness/profile
checks and explicit capacity reservation for replay. Its node/depth/output
and time limits bound the effort, NOT guarantee it closes all286 roots.
No requirement to prove the theorem before trying a bounded certificate is
introduced. Conversely a fast primitive does not establish full leaf cost.
If the bounded attempt fails to finish, STOP honestly; do not keep collecting
branches, resume it silently or request successive grants by renaming.

## Current admission

Ordinary source reads and hand mathematical review performed. New producer
and separately authored verifier are released for implementation/initial
controls ONLY under TIP108C. Full generation/replay is NOT yet released.
Producer75s / checker25s / Main20s cumulative, same120s ceiling; each<=30s.
Initial controls <=10s across roles. Tentative full attempt <=32768 processed
nodes/depth48, producer<=30s, verifier<=its remaining25s allocation. Main must
record its release/refusal after actual controls/profile; no automatic run.

No predecessors modified, runtime authority minted, app code/UI/Git/API paid
or build/dependency/platform work. This is a mathematical certificate method,
not new procedural gates in HIVE OS.

## Selected effort refinement before the one attempt

Initial producer and independent checker controls pass, with both area methods
matching the retained hand point, death/empty-core checks, all34/286 roots,
adversarial tree refusals and high-bit arithmetic profiles. Main's fresh
producer-control replay also PASS: internal0.019792833s; conservative charge1s
of Main20s. This is Main mathematical process1, no output file or full generation.

The explicitly tentative32768 node limit is changed to131072 before admission,
without increasing30s producer, remaining checker25s allocation,120s aggregate,
60min wall, depth48,128MiB state or16MiB artifacts. At full completion this
binary forest has <=65679 leaves. The checker high-bit profile suggests about8s
mean or <17s using observed max and68/54 event factor; unknown leaf requirement
and machine/runtime variation remain explicit. Main's producer profile had one
0.0005765s outlier, so no observed maximum is a rigorous global time guarantee.
Actual timer/state refusal, not extrapolation, enforces the effort ceiling.

This avoids an arbitrary early node stop far below the already reserved process
time. It is NOT a second attempt, increased execution grant or assertion of
cost-qualified guaranteed full proof. Full production still waits for the
updated-source/fresh-checker acceptance and a recorded release.

## ONE whole-attempt release — 2026-10-11 05:04 UTC

Main read the entire independent checker and control source after header
hardening and the131072 cap selection. Its integration is separately authored,
not a producer import; signatures/charts and boxes are independently rebuilt.
Every positive/exclusion leaf and all tree/root/count completeness are checked.
Main mathematical process2: fresh11-control run PASS, internal0.030863750s,
high-bit128 calls0.015299542s, largest observed call0.000182583s. Conservative
Main charge1s; current Main total2s/20s. These are11 distinct fixed controls,
not multiplied by the agents' previous replays. Mocked parsing controls are
explicitly not mathematical acceptance.

Release ONE producer invocation now: all286 chart roots seeded, BFS,
max131072 processed nodes/depth48/30s, artifact<=16MiB/state<=128MiB.
No smaller-root/critical-signature substitute. Producer72s allocation remains;
this command's30s cap fits it. Reserve checker24s (remaining24.6s before any
later charge), and Main18s for necessary verification/refusal recording.
If COMPLETE, run the independent full checker before any mathematical closure.
If INCOMPLETE, obtain an actual checker refusal; do NOT treat partial leaves
as independently accepted, resume, rerun or open another generation attempt.

The131072-node complete binary forest has <=65679 leaves, so the checker's
core integration runs at most65679 times: observed mean projects about8s,
and observed max with an event factor about17s, plus structural/JSON overhead.
Those projections do NOT apply to131072 core calls and are NOT rigorous runtime
guarantees; the24s timer is authoritative. Neither the full mathematical leaf
requirement nor termination near d=1 is known. This is admission of bounded
effort, NOT promised full production or a conclusion from a profile.

Scientific status remains OPEN until all roots/leaves independently pass.
No UI/app/runtime/DB/auth/Git/build/API paid authority is added by this decision.

## Terminal — 2026-10-11 05:06:50 UTC

The ONE attempt stopped at NODE_CAP131072 after6.212457 internal seconds,
not at its30s time/128MiB memory ceiling. Actual file is
WHOLE_ATTEMPT_1.json, SHA256
4bc8d5ea74e5f68411e08259002c85927cd72f85e559cd254f1202c133c5db12.
Producer metadata reports40946 OPEN leaves; no complete proof exists.
Independent checker actually refused: INCOMPLETE is not proof, exit1,
elapsed0.012909083s, BEFORE geometric/whole-tree replay. Thus neither partial
leaf counts nor partial geometry are independently accepted mathematical closure.
R1 and globalK6 OPEN; R2 full replay NOT_PERFORMED. Fixed11 controls PASS
but cannot replace it. Final conservative charge Producer10/Checker0.7/Main2,
aggregate12.7s/120s. STOP_PARTIAL_NODE_CAP_REFUSAL; no resumption or rerun.

This is not impossibility, a proven boundary obstruction or time exhaustion.
Unknown margin/refinement cost remains. Proposed next routing: analytic coupled
defect/core-loss study of remaining domain and boundary, not larger blind box
subdivision. No successor executed or authorized. Bilingual outcome in
docs/research/KAKEYA_K6_UNIFORM_CORE_108C_REPORT.md; predecessor bytes retained.
