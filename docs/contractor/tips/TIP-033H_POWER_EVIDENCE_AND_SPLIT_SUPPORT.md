# TIP-033H: Power-core evidence in the agent loop and split-support research

2026-10-01. Owner requests continued attack. Depends on TIP-033G, existing
versioned V1/V2 mixed-core evidence and the reviewed Type-II normalization.
Working directory: /Users/os/hiveos. Existing dirty work is preserved.

## Decision and task graph

Compact continuation of the approved architecture, not a new blueprint.
Contractor defines scope and verifies; separate Builders implement and explore;
skeptical reviewer checks mathematical and provenance boundaries. No new human
checkpoint is needed for bounded offline work. Paid API, live model campaign,
worker/queue launch, DB mutation, Git/deploy and historical ledger promotion
are excluded. Existing UI styles are reused, not redesigned.

## Requirements

- H01: Add MIXED_CORE_REPLAY_V3, preserving exact V1/V2 historical validation,
  mandates and method matching. New Erdős–Straus cycles select V3; an old
  retained marker keeps its original version. Retain the exact fixed G packet
  (SHA 0077816c13c6f6ff6fbb490d220396a63cc92f07e0e9bde24a316b5077ee85a9)
  plus freshly independently replayed Python evidence before the first model
  call, bound to the root digest and explicit FOUR-target power-core scope.
- H02: Baseline, kernel and power evidence must all pass. Strictly validate
  source/packet/output hashes, completeness, exact target set, limits and
  scope. PARTIAL, unavailable, source drift and any rehashed mutation fail
  closed with zero downstream model calls. Fixed executable paths only;
  no model code, paths, arguments or environment secrets. Do not modify G
  scripts/packet/source pins. A server-side adapter may import the fixed
  standalone checker; keep execution outside page rendering and client code.
  Python packaging absent in production must fail closed, not silently skip.
- H03: All existing planner, portfolio, source analyst/challenger, verifier,
  solver, critic/adversary transports receive the same sealed V3 envelope.
  Mandates clearly distinguish full prime-power support from arbitrary odd
  composite split factors and from a global root proof. No-hit p159727681 in
  b>=2 does NOT mean this prime lacks a solution. Include known q99 rescue,
  five hit cores and translated-only b3 scope; do not claim new root coverage,
  formal proof or novelty. V3 must not leak into historical V1/V2 mandates.
- H04: Existing trace evidence panel renders retained V3 status, fixed four
  targets, family bounds, counts and strict witnesses with its normal math
  renderer. An old V2 ledger still shows V2: available standalone G files
  alone are never displayed as retained agent evidence. Add focused schema,
  chain and actual worker-transport regression tests; test DB integration
  only with the existing isolated hiveos_test safeguards.
- H05: Seek a support-preserving structural mechanism for several odd prime
  factors, using general coprime A,u partitions of m. Derive a written lemma
  or document a refuted candidate with exact replay. Do not generalize G's
  prime-power minimum bound: q15/p19 and q99/p159 are mandatory negative
  controls. Explore a mathematically justified bounded slice, not a huge
  arbitrary exhaustive scan. Written exact identities distinguish necessary
  conditions from sufficient tests and general statements from finite data.
  New tools have predeclared caps (<=100000 core rows, <=30 seconds per run,
  <=256 KiB replay output), PARTIAL behavior and independently implemented
  stdlib Python versus TS checks. Escalate before enlarging the slice.
- H05A: Approved exact ray diagnostic: fixed coprime (A,U) in
  {(6,5),(3,11),(4,9),(2,25),(3,1),(162,1),(1,1)}, at the four G targets
  and control p19 (35 rows). Q0 is the least positive -U mod A, with Q0=1
  when A=1; h0=(U+Q0)/A. Prove 0<p0(k)=4UQ0k-h0<4AUk-1 and
  Q=Q0+A*t => p=p0+(4AUk-1)*t, t>=0. Use the resulting necessary k
  cutoff and the sufficient-and-necessary divisor test d|Ap+U,
  d=-1 mod4AU, k=(d+1)/(4AU) to decide ALL k on these rays. TS complete
  factor-divisor generation versus Python square-root divisor-pair replay.
  This preserves the chosen A/U partition, not a fixed support set for m:
  varying k can add primes. It is not completeness over every mixed core.
  Explicitly distinguish non-strict constructions if any from strict hits.
- H06: Compare candidate structural results with primary literature and run
  adversarial review. Preserve all D/E/F/G pins and old scope statements.
  Deliver completion reports and Contractor verification with quantified
  requirement coverage, test counts, unresolved gaps and honest scientific
  status. A breakthrough is a goal, not a guaranteed acceptance criterion.

## Acceptance criteria

Given a new eligible cycle, when round one starts, then the V3 sealed evidence
is retained before any agent call; any component failure stops execution.
Given retained V1/V2 history, when loaded or continued, then no V3 evidence is
invented and old hashes remain valid. Given a rehashed corrupt V3 packet or
wrong root/version/source, validation rejects it. Given the fixed power-core
packet, fresh independent replay matches the original exact digest. Given a
several-prime structural candidate, written proof and independent controls
support precisely the declared scope, or its refutation is retained as such.

Completion Report: DONE/PARTIAL/BLOCKED, files changed, requirement/AC results,
issues, deviations and suggestions. Product integration and research outcome
are assessed separately; finite hits are not a universal theorem.
