# TIP-052 independent mathematical and implementation review

Status: PASS_WITH_SCOPE_LIMITS — mathematical and current implementation review
complete. This record is not global LRC theorem
acceptance, formal proof, novelty review, or a live model campaign receipt.

## Source and scope

Primary source read directly: Allikvere, arXiv:2609.02604v2 (2026-09-24),
[Lemma 2.2 and Lemma 4.6](https://arxiv.org/html/2609.02604v2).
Read TIP-052 contract, AGENTS.md, current durable handoff sections, and existing
finite certificate host envelope. No author/archive program was executed.
The source itself distinguishes its archived computation from a full independent
reimplementation or formal verification (§6).

The current task can admit checked conditional shift mechanisms and limited
congruence-class applicability. It cannot certify every required terminal or
level-one orbit, the analytic bound, lower LRC inputs, or the full 14/15 result.
All 23 global proof-plan dependencies must remain OPEN.

## Mathematical review

1. For each shift q/d, the bad condition is the OPEN arc
   `||phase + q/d|| < 1/N`. Its only boundary points on R/Z are
   `±1/N − q/d mod 1`. The finite union of these points partitions the entire
   real circle, including irrational phases, into connected open cells.
   For each q the predicate is constant on each cell, because no continuous
   distance function crosses its threshold there. Evaluating one exact rational
   representative per cell therefore certifies all real phases in that cell;
   evaluating every boundary separately handles equality, which is GOOD.
   This is not an assertion that a sampled rational time grid proves LRC.
2. A complete d-point equally spaced grid has at most `ceil(2d/N)` points in
   that bad open arc. Coincident critical points must be canonically deduplicated;
   both sides and all cyclic adjacencies still require checking. The last cell
   wraps from the final critical phase to the first phase plus one.
3. If g>1 divides the modulus M and every fixed residue, then all integer lifts
   are divisible by g and the entire class is nonprimitive. This conclusion is
   unconditional integer arithmetic and is NOT an all-real LR witness or a
   promotion of old NO_GRID coverage.
4. For an omit-one class, g|M and g dividing all other residues makes the other
   coordinates invariant under q/g for every integer lift. An exception unit
   modulo g visits a complete g-grid. For a primitive full tuple the unit fact
   also follows from gcd of the full tuple being one. A composite nonunit
   exception requires its actual orbit `g/gcd(g,exception)`; merely not being
   divisible by g does not imply the complete g-grid.
5. The omit-one result needs a lower-case witness for the other distinct speeds.
   The stronger lower separation `>=1/k` preserves their good status under all
   common shifts. The exception's complete grid cannot fit an open bad arc of
   length `2/(k+1)<=1/2` for k>=3. Equality at the boundary is harmless.
6. For 14 moving speeds, a prime d and exactly e>=2 exceptions give at most
   14-e<=12 other distinct values. The assumed lower LRC witness remains fixed
   under q/d. Every exception is a unit mod d and blocks at most
   `ceil(2d/15)` shifts. The STRICT inequality `e*ceil(2d/15)<d` ensures a
   common shift. This is a sufficient, not necessary, criterion and remains
   conditional until the lower premise is independently established.

## Independent exact controls actually run

Executed a separate Python stdlib `Fraction` calculation, not Builder code,
over N=4..24 and d=2..64: 1,323 cases, 162,164 boundary/open-cell representatives.
Every derived maximum was at most `ceil(2d/N)`; N=15,d=3 and d=5 have bound one.
These checks corroborate the written critical-point proof, not formal proof or
global terminal enumeration.

Negative controls:

- With N=15,d=3,e=3, phases 0,1/3,2/3 forbid every shift; the equality
  `e*ceil(2d/N)=d` cannot be accepted as a common-shift certificate.
- With d=4 and exception speed 2, the orbit has only two points despite
  d not dividing the speed. A prime/unit guard cannot be omitted.
- Equality `distance=1/N` is outside the bad OPEN arc and therefore good.

## Final implementation review

No consequential mathematical or implementation defect found in reviewed bytes.
Producer and consumer both use exact rationals, but the consumer derives its own
required critical phases, order, cyclic adjacency, midpoint and each mask rather
than calling the phase producer. The independent stdlib Python checker derives
its own phase partitions/classes and the trusted wrapper compares exact complete
output bytes. Every admitted application is recomputed, including the fixed
source/application list; coherent outer rehashing is not enough to admit a fault.

The no-write CLI actually reads/hash-checks immutable TIP-048 source bytes,
hash-checks the four source scopes, derives each coordinate as
`r + 199*2*(r mod 7)`, and compares all four resulting labelled vectors before
fresh replay. This is meaningful source binding, not decorative source hashes.
It does not replay the full old certificate trees or alter any old coverage.
The sufficient `g|M` congruence mechanism is not confused with the paper's
specific level parameter in its definition of properness.

Host preparation derives uniform modulo-g superclasses from EVERY value of each
finite axis. Its residue-class modulus is g, not the old finite time-grid M;
the all-axis invariant justifies that superclass. The finite host scope/root
remain bound in the envelope, but its grid counts are not changed by conditional
properness. Old absent-field envelopes remain admissible with their original
digest/interpretation. Consequently the fresh replay guarantee is the normal
new worker preparation path, NOT every hypothetical direct provider invocation
using a historical envelope. This is the deliberate compatibility boundary.

Normal fresh preparation uses pinned Python bytes with isolated flags
`-I -S -B -c`, shell false, capped input/output, source bytes and timeout.
Receipt hashes are local unsigned consistency evidence, not signed execution
attestation. JavaScript elapsed/work checks are cooperative bounds, not CPU
preemption. Python has a separate process timeout. No model/provider-supplied
properness payload can become authoritative host evidence.

Actual reviewer execution:

- `NODE_ENV=test node --import tsx scripts/operations/allikvere-properness-audit.ts`
  (no `--write`): PASS, fresh independent replay 43 ms, stdout 15,072 bytes,
  SHA-256 `ec603c283eb8a6da723eb1fe35c9f7c8bb8a6b6e2bad436f7f220bcf20cbcd7e`.
  Three exact certificates: N14/d7 = 14 cells; N15/d3 = 12; N15/d5 = 20.
  Every maximum is one. Four actual classes are NONPRIMITIVE_CLASS_EXCLUDED;
  five synthetic controls are CONDITIONAL_LOWER_WITNESS only.
- Seven separate semantic mutations rejected: missing boundary, missing open
  cell, duplicate cell, forged mask, wrong cyclic wrap, wrong maximum and forged
  lower-premise acceptance. Geometry mutations resealed certificate digest,
  stdout digest/bytes and report digest. The first wrong-mask test accidentally
  assigned an already-empty boundary mask to empty, i.e. was no mutation;
  corrected to a false `[0]` mask, which was rejected. No product change followed.
- Combined actual unit run: five files, 49/49 PASS, 2.11 seconds — new pure,
  replay and panel tests plus unchanged finite replay and agent-gate regressions.
  Python in replay tests really executes; only Codex transport is mocked.
  Test covers source drift/process failure/output mismatch, coherent-rehashed
  supplemental faults before provider dispatch, legacy absent-field digests,
  identical compact facts in solver/critic/adversary prompts and PARTIAL
  conclusion despite supportive AI reviews.
- Main subsequently found and repaired a resource-budget composition issue:
  the supplemental runner must not grant a new five seconds after the existing
  finite checker has already used most of its ten-second outer budget. Reviewer
  re-read ONLY the changed runner, host seam and replay tests. The host passes
  `floor(10000 - elapsed)` to the helper; the helper requires positive safe-integer
  remaining time, caps it at five seconds, charges preparation/source/read work
  to that same budget and gives Python only the remaining child timeout. Zero,
  negative, fractional and infinite budgets fail before process dispatch; an
  oversized available budget cannot increase the fixed five-second child cap.
  Final admission still checks the original outer ten-second elapsed time.
  These JavaScript checks are cooperative, not event-loop preemption; the Python
  timeout is separately enforced by its process wrapper. No unresolved budget
  composition finding remains. Final focused re-review: three files, 26/26 PASS,
  2.00 seconds (new nine-case replay/gate suite plus unchanged finite replay and
  agent-gate regressions). Math/Python/retained report/UI bytes did not change.

The prepare-then-dispatch gate test is executable, with a source assertion for
the worker seam; it is NOT a real database-backed worker integration run.
Database integration, live model campaign, browser, full repository QA/build,
global archive reproduction, external and formal acceptance were NOT_RUN by this
reviewer. Main performs UI and repository acceptance separately.

UI source review found no scope promotion: actual classes and synthetic controls
are separated; lower witness NOT_ESTABLISHED, equality GOOD, cyclic/all-real
partition argument and no full proof/novelty/live-campaign claim are explicit.
The proof view uses pure retained admission only; it imports no runner or CLI.
All 23 source-to-global obligations remain OPEN.

Reviewed source SHA-256 pins:

- Pure module: `c4f7caae3881a2eecae6af875479860559d070bdc1c90fba40237c011e462b73`.
- Fresh runner: `2969df49984d4a99a4168a0f8903d5e77231f2ff1286debdda3e417e7fd81247`.
- Python: `16acdd9457ef02cfdea0d96f2ddc0ca770cfe1b3ccb46b330b6004f24bb42f1b`.
- CLI: `34d4b63dbda95e967678194ee16e30c574029cfd527cf6d0a12e80e1fd650eab`.
- Optional host seam: `97bca47a8d1c312ab1f241ea7f65da410a2f31f873ae8f218091490ea974ad28`.
- Pure tests: `64e341ac3525944da7e488f260820f162891ef14609d14bbeae0f2eba22dc2f4`.
- Replay/gate tests: `0b50c649c57dba78bdc84fa8f2df92e3d19515b0c8e5c85edbee2a781fbcfbd0`.
- UI: `2187057365a80c66dd16e465c1cc5dc20650e704ca6657c2ab7bc19ce83cad85`.
- UI tests: `d0c47f0db7025730fcc56f2722a12d24d7fe658e1212dfac801fbc2c6c8860f2`.

If these bytes change after review, changed scope must be reviewed again. This
is a separately instructed same-model reviewer, not an external mathematician.

No DB/API/model job, paid request, Git publication, dependency installation,
archive execution, or product/core modification was performed by this reviewer.
