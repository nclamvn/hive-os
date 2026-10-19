# LRC method validation — two exact, reviewed results

2026-10-09 06:27:03 UTC · TIP-084 · LRC_METHOD_VALIDATION_084 · METHOD_VALIDATION.
**Scoped acceptance A1–A5: 5/5. Not a proof of unrestricted LRC 14/15.**

## What changed

The development direction now explicitly requires one exact question, its
admissible output and stop condition; method selection follows mathematical
structure rather than a rigid tool sequence. Failure cannot trigger an easier
replacement question or weaker acceptance. Ordinary local repairs remain agent
work; infrastructure must address a concrete defect with a small sufficient fix.
This is an incremental correction, not evidence that all architecture or drift
risks have been eliminated. Historical evidence was preserved, not deleted.

Two cases were frozen before implementation. A small standard-library producer
chooses different methods: closed-interval coverage and common-divisor shifts.
A separately implemented verifier imports no producer/shared math helper,
reconstructs endpoints and physical phases, and must accept BOTH cases before the
CLI emits success. It rejects changes to the cases, thresholds and claimed scope.
The implementation is 100 producer lines, 191 verifier lines and 88 test lines;
no framework, manifest, private parser, database or new security mechanism.

The public source is [Allikvere, *Fourteen and fifteen lonely runners*,
arXiv:2609.02604v2](https://arxiv.org/html/2609.02604v2), §4.2 and §4.4.
The Goddyn–Wong tuple and few-exception shift idea were exposed before solving.
This is a known-source method demonstration, not novelty or a blind benchmark.
“14/15 runners” below includes the stationary runner; there are 13/14 moving
speeds. The paper's global claim is distinct from what we reproduced here.

## A1 — continuous-time tightness for 14 total runners

Let \(V=(1,2,\ldots,11,13,24)\), \(\delta=1/14\), and
\(D(t)=\min_{v\in V}\|vt\|\), where \(\|x\|\) is distance to the nearest integer.
For a speed \(v\) and integer \(k\), define the closed real interval

\[
C(v,k)=\left[\frac{k-\delta}{v},\frac{k+\delta}{v}\right]\cap[0,1].
\]

Every point of this interval satisfies \(|vt-k|\le\delta\), hence
\(D(t)\le\delta\). The producer considers all 116 candidate arcs with
\(0\le k\le v\) and emits a 59-arc chain. The certificate contains only integer
speed indices and centers, not asserted endpoints or a sampled time grid.

The independent verifier reconstructs each interval exactly using fractions,
sorts them, and checks a gap-free union from 0 to 1. The actual certificate passes.
Thus \(D(t)\le1/14\) for EVERY real \(t\in[0,1]\). Integer-speed periodicity
extends the statement to all real time. At \(t=1/14\), none of the residues of
the speeds modulo 14 is 0, and speed 1 attains distance \(1/14\); independent
exact arithmetic confirms \(D(1/14)=1/14\). Therefore

\[
\boxed{\max_{t\in\mathbb R}D(t)=\frac1{14}.}
\]

Equality is legal both for the upper-bound closed cover and the lonely-time
witness. A finite interval certificate proves a continuous statement through
the interval argument; isolated numerical samples would not prove this bound.

## A2 — a constructive infinite 15-runner family

For EVERY positive integer \(Q\) divisible by 5, take ten speeds
\(5Q(1,3,\ldots,19)\) and four exceptions

\[
u_r=(10-2r)Q+1,\quad r=0,1,2,3.
\]

All speeds are positive and distinct: lower speeds are 0 modulo 5, exceptions
are 1 modulo 5, and the exception differences are nonzero multiples of \(2Q\).
Moreover \(\gcd(5Q,10Q+1)=1\), so the whole tuple is primitive. Define
\(\varepsilon=1/(10Q)\le1/50\) and \(t_j=\varepsilon+j/5\), \(j=0,\ldots,4\).
For each odd \(2s+1\) in the lower group,

\[
5Q(2s+1)t_j=\frac{2s+1}{2}+Q(2s+1)j,
\]

so its distance is exactly \(1/2\). For the exception \(r\),

\[
u_rt_j=1-\frac r5+\varepsilon+
\frac{(10-2r)Qj}{5}+\frac j5
\equiv\frac{j-r}{5}+\varepsilon\pmod1.
\]

The middle term is integral because \(5\mid Q\). At \(j=r\), the exception's
distance is \(\varepsilon<1/15\). Thus each of shifts 0, 1, 2 and 3 fails one
different exception. At shift 4 the four distances are

\[
\frac15-\varepsilon,\quad\frac25-\varepsilon,\quad
\frac25+\varepsilon,\quad\frac15+\varepsilon.
\]

Including the lower speeds, the exact minimum is
\(1/5-\varepsilon\ge9/50>1/15\). Hence the first common good shift is 4 and

\[
\boxed{t_* = \frac{8Q+1}{10Q},\qquad
\min_v\|vt_*\|=\frac15-\frac1{10Q}>\frac1{15}.}
\]

No unproved lower-LRC premise is used: the lower speeds' good time was explicitly
constructed. This is an unbounded family, not all possible 15-runner tuples.

The frozen actual case is \(Q=10^{30}\), largest speed \(95Q=9.5\times10^{31}\).
The independent verifier recomputes every original physical speed-time product
for all five shifts with exact integers/fractions; it does not enumerate up to
the largest speed or accept producer-supplied residues. It accepts
\(t_*=8000000000000000000000000000001/10000000000000000000000000000000\).

## Independent critique and actual verification

Separate Builder and verifier/critic contexts produced independent source
implementations. The critic reconstructed the all-Q phase argument, checked that
no lower-LRC assumption was hidden, reviewed the producer/tests/CLI, and found no
essential gap. Main read all three files and independently reviewed the verifier
and the mathematical arguments before the final runs. The contexts share the
public hints and Python Fraction foundation; this is not statistical independence,
external expert acceptance or formal kernel verification.

- Builder initial tests: 8/8 methods PASS, enclosing 0.181218500 s; actual CLI
  PASS, enclosing 0.291913292 s. No failed case or repair was hidden.
- Main final tests: 8/8 methods PASS, unittest 0.066 s, enclosing 0.158044625 s.
- Main actual `npm run research:lrc -- --record`: exit 0, enclosing 0.226385291 s;
  producer/replay internal observation 34 ms. Both-case acceptance required.
- Total measured validation subprocess time: 0.857561708 s, below 600 s;
  each command below 120 s. No benchmark significance is attached to this timing.
- Machine evidence: `LRC_METHOD_VALIDATION_084.json`, 3003 bytes, 59 closed arcs,
  exact original tuples/witnesses and independent acceptance receipt. Created
  once after both checks; no existing result overwritten.

A3 controls reject wrong shift, deletion of an essential covering arc, changed
thresholds, changed tuples, forged endpoints and promotion to a global LRC claim.
The actual verifier subprocess also rejects the whole run when case two is wrong.
These are eight test methods with subcases, not eight mathematical achievements.
JSON duplicate/float/byte limits were source-reviewed; no comprehensive hostile
parser or resource-security benchmark is claimed.

A4 is actual syntax/import/test/CLI execution, not source-inspection-only PASS.
A5 is the in-place direction correction plus a small reproducible command and
preserved predecessor history. Both fixed outputs passed; no easier case replaced
a failure. Evidence identity, tests and agent agreement do not replace the proofs.

## Limits and stop

This demonstrates meaningful scoped mathematics and replay, not an application
agent-loop/E2E adoption or autonomous model benchmark. No paid API, author code,
Lean, database, browser, build, installation, Git commit/push, scratch copy or extra
Next.js output was used. No material files were deleted; cleanup concerned the
default workflow, not historical evidence. The verifier is trusted offline
developer tooling, not a hostile-code sandbox; child output is bounded after
capture, not by a hard streaming/RSS security envelope.

Old whole-p139 G/C/T/B remain unaccepted. R3 remains deferred/unaccepted, A
consumed, B not run, eight obligations open and original attempts/budgets unchanged.
No protected grant/source path, production gate, old frozen source or failed
evidence was repaired, reused or relabelled. Global 14/15 reproduction, research
novelty, blind ability and full-product acceptance remain NOT ESTABLISHED.

LRC_METHOD_VALIDATION_084 stops at this scoped result. A browser presentation or
new mathematical target needs the next direct routing decision; no campaign is
automatically started by this record.
