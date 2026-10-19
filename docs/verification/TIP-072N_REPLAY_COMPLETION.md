# TIP-072N — correlated pair/triple independent replay completion

Date: 2026-10-05. Builder: Replay Builder. Status: DONE for the assigned offline
implementation; Contractor acceptance and consequential review are separate.
The Vibecode Kit Builder authored only the four assigned new files below.

## Contract and scope

- TIP SHA `2b09ea0e182f18578190c30696cdb8ba9e860558acc1aef1f314b1709c9f3c70`.
- Pair-correlation addendum SHA
  `aa4798b16bfa886a05138094278fdea9ec00a6e46c64f4de3156e0c9a1276ba1`.
- Created `scripts/research/lrc-correlated-triple-replay.py`,
  `scripts/operations/lrc-correlated-triple-audit.ts`,
  `tests/unit/math-lrc-correlated-triple-replay.test.ts`, and this report only.

Read both sealed documents completely, latest handoff and the written dossier,
and installed Next.js Vitest guide before writing the tests. Synchronous pure
unit/CLI diagnostics only, not async Server Component E2E. No package install or
configuration change. No old arithmetic/helper imports: Python uses independently
derived stdlib Fraction equations; Core is compared only by complete semantic
evidence. Ordinary canonical hashing and the existing fixed-process IO design
were reused in new files, not old mathematical computations.

No old product/test/UI/worker/history/registry/ledger/predicate/42-source ceiling
was changed. No DB/session, model/provider/API/Codex child, private capture,
campaign/M1, archive, environment file, schema/migration, Git, billing or deploy
execution. This is not an actual case/result or production closure.

## Reconstructed mathematical content

The Python process independently derives the critical roots
`x=(z±1/9)/c−j/3`, using integer bounds obtained from the actual affine value
range rather than a trusted root list. Multipliers are fixed 1,2,4; j=0,1,2;
closed normalized domain [0,1/3]. Roots are:

`0,1/36,1/18,1/9,5/36,7/36,2/9,5/18,11/36,1/3`.

All 10 boundary cells and 9 adjacent open cells are retained, including both
domain endpoints. Every cell carries its three-by-three exact distance matrix,
actual good shift indices, first-two BAD union indices and deterministic
normalized shift. The union has size at most one everywhere. BAD is strict;
threshold equality is GOOD. Endpoint normalization is not silently merged into
the other endpoint's physical shift labels.

Three closed proof segments retain all nine affine coordinate functions, floors
and exact fractional-part ranges. **Intercept is the raw affine intercept**:
fractional value = slope*x + intercept − floor. This was explicitly settled by
the Contractor before freeze, with final Core/Python agreement.

The sharp witness x=1/9 retains all nine distances and all three shift minima
equal 1/9. The unrelated independent-phase obstruction retains residues [1,2,1],
phases [0,1/3,1/3], and three zero minima. Neither is a global LRC counterexample.

All 26 positive fixed tuples and all **351** final coordinate distances are
retained and independently evaluated: 20 harmonic tuples for k13/k14 and
q1,2,4,5,7,8,10,11,13,14; six arbitrary-third tuples for both k and
(q,v)=(1,5),(2,7),(13,17). Every divisible lower witness is checked exactly,
not inferred from its label. Conditional margins are 1/11 for 13 moving/14 total
and 1/12 for 14 moving/15 total. Their general lifting requires the stated lower
witness; it does not independently prove lower LRC(10/11).

Seven fixtures have nonzero normalization carry. All fixtures retain
`m=floor(3*q*t0)`, normalized x, inverse, h, actual physical
`j=qInverse*(h−m) mod3`, time and distances. The harmonic selector uses h2 on
the closed middle segment, h1 otherwise. Arbitrary-third cases enumerate actual
physical shifts and select the lowest good j; their normalized shift is then
derived from the carry permutation rather than misusing the harmonic selector.

The carry control is mathematically consequential: k13/q14/v56 has t0=1/33,
m1, inverse2 and h1; correct physical j0 passes. Dropping m yields j2 and
t=23/33, where speed56 has distance1/33<1/9. No claim is made that every carry
omission must fail every tuple.

All four older-class negative fixtures retain valid lower witnesses and full
distance evidence. Their best shifted margins remain 1/6,1/5,1/10,1/10;
correlation alone does not automatically improve them. The residue-alias control
retains all14 speeds, lower margin1/5 and maximum shift margin1/15 for exceptions
1,5,4. It rejects a residue-only interpretation of the exact doubled pair, not
LRC. No negative or positive fixture/cell was omitted.

## Lossless wire clarification, unchanged quotas

Verbose repeated labels yielded report32425B, evidence32518B and actual raw
Python process32608B. The measured complete audit DTO shape was33071B, exceeding
32768B; this measurement was not an accepted oversized audit.

Before freeze, Contractor L2 approved fixed lossless string interning:

- fixtureKinds legend: HARMONIC / ARBITRARY_THIRD;
- selectionRules legend: HARMONIC_SEGMENT_WITH_CARRY / LOWEST_PHYSICAL_GOOD_SHIFT;
- lowerLrcAssumptions legend: LRC(10) / LRC(11).

The corresponding existing fields now reference numeric indices0/1. The full
legend itself is reconstructed and compared, preventing semantic reassignment.
No field meaning, speed tuple, coordinate, interval, scope, pin, metric or
assurance was dropped. Final report31398B / evidence31491B, and the actual final
full CLI stdout was **32045B including newline**, below32768B with723B headroom.
This clarified a previously unspecified wire representation, not the mathematical
family, executable architecture or resource ceilings.

## Independent process and bound enforcement

Fixed command `/opt/homebrew/bin/python3 -I -S -B -c` executes already-inspected
pinned source bytes, never supplied code or a writable file output. `shell:false`,
minimal environment `{NODE_ENV:"test"}` without inherited secrets/PATH,
bounded32KiB source/stdin/stdout and2KiB stderr. Source no-follow regular-file
reads verify identity metadata and hashes before/after the process.

Only the fixed version plus positive safe-integer remaining milliseconds<=5000
and operations<=2000000 is accepted. Fractional/zero/nonfinite/oversized/hidden/
getter controls refuse. JSON stdin checks bytes before parsing and rejects
duplicate keys, NaN, unknown fields and unsupported versions. No generic speed
solver or accepted caller-supplied family exists.

One outer allowance starts before IO and Core. Source reads, actual Core work,
remaining child budget, process wall time, stdout inspection, full normalized
comparison, source rereads and successful result serialization use the same
allowance. The child receives floored remaining milliseconds and actual remaining
operations, not a reset5s/2M. Distinct Core/Python operation counts are truthful.
A successful actual child followed by exhausting an80000-operation aggregate
allowance returns RESOURCE_REFUSED with null positive evidence. Inherited
serialization hooks detected after the process boundary refuse with zero getter
invocations; even a refused CLI response bypasses such hooks.

All six flags must exactly equal false: RESEARCH_WORKER_ENABLED,
MATH_PILOT_QUEUE_ENABLED, LRC_CAMPAIGN_LOCAL_ENABLED, RESEARCH_OPENAI_ENABLED,
RESEARCH_CODEX_LOCAL_ENABLED, SANDBOX_DOCKER_ENABLED. Undefined/true flags refuse.
No inherited provider credentials reach the child.

Source pins mean local source-byte/process consistency, **not** signed host,
installed Python/stdlib, agent identity, production executable closure, scientific
acceptance or M1 attestation. Budget checks are cooperative safeguards, not a
claim about a malicious host. Global/formal/external/novelty NOT_ESTABLISHED;
agentLoop NOT_RUN; executionAuthority false. The universal mathematical theorem
rests on the separate written proof, not rational samples or passing processes.

## Verification results

Final own selector, all six execution flags OFF:

`node ./node_modules/vitest/vitest.mjs run --project unit tests/unit/math-lrc-correlated-triple-replay.test.ts --maxWorkers=1 --no-file-parallelism`

**92/92 PASS**, 0 failed; start08:06:34 local, duration1.76s, exit0.
Development checkpoints are not summed. Positive process tests call the installed
Python with the pinned source; mocked process/IO tests inject negative faults
only, not the acceptance basis.

Tests include26 coherent-rehashed semantic mutations; wrong cells/endpoints,
proof affine/floor content, physical carry, arbitrary-third selector, dictionary
meaning, assumptions, residue alias and global/agent/authority promotion; direct
BigInt checks on every coordinate fixture and all9 affine ranges; real carry
failure; six hostile passive data forms; inherited-hook zero invocation; all
resource/source/process/metrics controls and actual Python malformed/oversized
requests. No partial positive survives a required failed observation.

Final actual standalone command, all flags OFF:

`node --import tsx scripts/operations/lrc-correlated-triple-audit.ts`

MATCH / exit0 /32045B stdout; outer65.638417ms /93807 charged operations;
Core13.508625ms /55426; Python7.734125ms /6962; fresh process44.219625ms.
These are observed local timings, not production guarantees. Complete semantic
digest `6190bc46a5d21e202acbdb4cce24cafc5ebba17434d648aa652f2514ac7e8312`.

Own focused ESLint:0 errors/0 warnings/exit0. Final whole
`tsc --noEmit --incremental false`: exit0. Main owns final historical regression
pack, whole lint/type/build, fingerprint/prefix preservation audit and acceptance.
Independent reviewer received frozen bytes before this report was written.

## N1–N6 coverage and remaining ownership

| ID | Builder result | Evidence / remaining work |
|---|---|---|
| N1 | PARTIAL, proof ownership outside Builder | Complete affine/pair evidence; Main all-real proof and consequential review own universal acceptance |
| N2 | PASS in executable scope | Independent-phase obstruction, four old-class negatives, residue alias and exact physical carry control |
| N3 | PASS in fixed executable scope | All26 tuples/351 coordinates, actual shifts, lower witnesses, both moving/total conventions; general lift is written-proof scope |
| N4 | PASS | Actual independent Fraction process reconstructs complete19cells/10boundaries/9ranges/fixtures/sharpness/legend/source content |
| N5 | PASS | Semantic/hostiledata/process/source/resource controls; limits unchanged and null evidence on refusal |
| N6 | DEFERRED to Main/reviewer | Own tests/types/lint pass; final consequential review and Main whole QA/preservation audit pending |

## Frozen pins

- Python `8455b779eacea07de66e8af90b32e76b3f44368b5c5a62c25f7abb69795bb282`
- CLI `cfbcdeb12b90ba998496b66aa68ecd2d21f18e11696cac299088ef5e56973092`
- Own tests `471220bdf48c45363adb2ec9e87b894b283e601b37ce4410b80569d0a7400e08`
- Compared Core `7bb711c11ad4c85ccb2c14521ac098669fe48f6ddc4a40ca5f6775108eed5b6e`

No unapproved deviation. Approved clarifications: lossless legend interning,
raw affine intercept semantics, and the existing minimal external environment.
No quota expansion, omitted branch, silent architecture change, actual agent
loop, global LRC or literature novelty assertion.
