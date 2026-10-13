# Completion report — TIP107 single Builder

STATUS: PARTIAL for the all-real K6 root. Three scoped analytic results and
lean exact controls are complete; F6>=20/93 globally is NOT established and
no smaller rational witness was found.

## Files changed

New files only under `artifacts/research/tip107`:

- `HAND_PROOF_AND_GAP.md`: complete hand derivations, failed merging route,
  structural group restrictions, exact remaining proposition, bilingual summary.
- `group_overlap_counterexample.py` / `BUILDER_GROUP_COUNTEREXAMPLE.json`:
  exact controls of the group-convexity refutation and explicit radial descent.
- `structural_controls.py` / `BUILDER_STRUCTURAL_CONTROLS.json`: independent
  exhaustive720-permutation combinatorial check against the13-word adjacent-swap
  recursion, plus exact boundary constants. NOT continuous geometry coverage.
- `tight_group_defect.py` / `BUILDER_TIGHT_GROUP_DEFECT.json`: exact controls of
  one hand-derived equal-step3+3 tight family and its positive radial defect.
- This completion report.

No old source/evidence, UI/app/DB/auth/config/Git, execution grant or predecessor
report was changed. No installation, build, compile, navigation, optimization,
random search, cell walk, new infrastructure or further delegation occurred.

## New mathematics and precise scope

1. Universal GROUP-OVERLAP-CONVEXITY is FALSE even for separated-bottom groups.
   For A={4,5,6} atoffset0 and B={1,2,3} atoffsetd,1/6<d<1/4, hand slice
   integration gives O(d)=−1/36+7d/6−3d² and F(d)=13/36−7d/6+3d².
   Hence O''=−6. Rigid-block translation has a strict positive-gap minimum at
   d=7/36,F=107/432, but this is NOT a full five-dimensional local minimum.
   Its radial derivative is35/216; an explicit hand-chosen radial perturbation
   has lower area3960377/16000000 in both exact methods. Not a root counterexample.

2. At any subtarget FULL local minimum with two positive-gap bottom components,
   Main's radial identity forces their physical span sum<=3/31<1/6. Each group
   is therefore a strict common-base-overlap clique, and its apices increase
   naturally by label with scaled gap>=13/31. No consecutive-label or global
   apex-order assumption. Internal pair overlaps disappear once, at
   tau_ij=(1−6(xj−xi))/(j−i+1). Betweenness tau_ik<=max(tau_ij,tau_jk)
   makes each component consecutive in its GROUP label subsequence; partitions
   refine with height. A failed single adjacent edge need NOT cut the graph.
   Positive-overlap and closed-contact threshold conventions/ties are explicitly
   distinguished in the proof note. This does not control cross-group overlap.

3. Main's one-bottom-component reduction leaves13 strict apex orderwords:
   scaledrange<=49/31, so nonadjacent labels retain order with gap>=13/31.
   Adjacent-apex ties are excluded by the retained106 local-minimum lemma.
   All720 permutations were checked against the order criterion and matched
   an independently coded disjoint-adjacent-swap recursion. This verifies the
   discrete classification, not a continuous offset/polynomial cover.

4. A RESTRICTED tight3+3 family has strictly positive radial defect and lies
   above the target. With x=(d+2a,d+a,d,2a,a,0),d=7/36+11a/6,
   0<=a<=3/124, the full hand formula is
   F(a)=107/432−35a/36+179a²/12. Its radial defect is
   (179/6)(a−35/1074)(a−1/6)>0. Monotonicity proves the entire family's minimum
   386747/1660608=20/93+29627/1660608. This is ONE equal-step family, not every
   3+3 case, label partition or unequal/internal offset schedule.

The hand proofs establish these scoped statements; finite controls alone would
not establish them. No priority, novelty, external human review or formalization
is asserted. Necessary-minimum reductions depend explicitly on Main's reviewed
radial identity and prior adjacent-apex-collision exclusion, not on a new grant.

## Actual process ledger

Builder used all THREE allocated mathematical subprocesses:

| Process | Actual result | Internal elapsed |
|---|---|---|
|1 group-convexity counterexample controls|PASS both old exact sweeps|0.006485708s|
|2 discrete orderwords/boundary arithmetic|PASS all720,13 survivors, exact constants|0.000544000s|
|3 restricted tight-family controls|PASS both old exact sweeps at three hand points|0.004876708s|

Sum0.011906416s; conservative<1s/60s. All passed, zero failures/refusals. Each
script has a29s signal ceiling inside the30s per-process allowance. No further
Builder mathematical execution or compile was undertaken after the quota.
Subsequent reasoning/file edits were hand work and source inspection only.
Main's planned fresh three-helper replays are distinct charged invocations,
not additional distinct mathematical claims or doubled control counts.
One later documentation-only patch had a context mismatch and was reapplied
after reading the exact paragraph; no mathematical run/evidence was changed.

Process1 checks three rigid d points and one full-space radial descent point,
plus the two exact n3 area methods for the consecutive-three rescaling.
Process3 checks three a values (a=0 repeats an earlier point). These are seven
K6 replay records but SIX distinct K6 configurations, not seven independent
cases. Both exact implementations are retained independently authored methods;
rerunning them does not produce a new mathematical implementation.

No unittest framework suite, app lint/typecheck/build or separate compile was
run. The scripts were interpreted and their explicit assertion controls executed
successfully; claim those actual controls, not invented test-suite totals.
All output paths are create-only. No scratch project, dependency install, venv,
distDir, Docker image or bytecode was created. Nothing removed.

## Remaining obligation / stop

The group merging/convexity shortcut is definitively unavailable. Internal
ordering/laminarity and13 one-component orderwords narrow the old missing
domain, but do not solve its area inequality. What remains is a valid universal
matching area/strict-radial-defect argument for arbitrary internally ordered
clique groups and arbitrary cross-group multiplicity patterns, plus the
one-component13-orderword continuous domain with relevant boundary cases.

Negative radial defect in the tighttwo-group domain would itself imply a
smaller-than20/93 ROOT witness. The restricted family's positive defect does
not prove universal positivity. No full two-component local minimum has been
excluded in all cases. Global root stays OPEN, not a milestone success.

Main requested final proof notes/report, no further mathematical process or
finite branch collection. No unused-time reinterpretation, target change,
counter reset, automatic successor or runtime grant is authorized.
