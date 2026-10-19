# COMPLETION REPORT — TIP-033D

2026-10-01. Builder under Vibecode Kit v6.2.

## STATUS

DONE for the FOUR fixed targets and the normalized subclass `m=2^a*ell`,
odd prime ell of exponent ONE. Exact recursive primality/product checks and
finite divisor enumeration plus the independently reviewed written tail.
This is not Lean/formal certification, novelty, all-prime success, root theorem,
denominator optimum, live browser E2E or an authoritative agent-cycle event.

## FILES CHANGED

Created only:

- `scripts/operations/certified-two-core-generate.py`: fixed bounded deterministic
  discovery; generated artifact output only, no network or dependencies.
- `scripts/operations/certified-two-core-artifact.json`: factor/product evidence
  and recursive Lucas certificates, 183105 bytes, zero unresolved inputs.
- `scripts/operations/certified-two-core-check.ts`: exact BigInt certificate,
  scope/tail, divisor decisions and normalized strict Type II verifier.
- `scripts/operations/certified-two-core-replay.py`: separate stdlib Python
  checker with recursive dependency traversal and integer-divisor witnesses.
- `scripts/operations/certified-two-core-replay.ts`: source/artifact-pinned fixed
  Python replay, allowlisted environment, timeout30s, output256KiB.
- `scripts/operations/certified-two-core-audit.ts`: fixed CLI, non-PASS exits1.
- `tests/unit/certified-two-core.test.ts`: seven certification/tampering controls.
- This report.

No TIP-033C source/artifact pin, application route, agent cycle, worker, database,
provider, main notes, TIP/handoff or git mutation changed by this Builder.

## D01..D04 RESULTS

Coverage: 4/4 requirements implemented and locally tested.

- D01 PASS: a1..25 for p131433121/p159727681/p171348241, a1..16 for p351121.
  388 criterion entries (384 distinct integer inputs), every j0..2a_max+2 and both kinds. Repeated inputs are
  retained with their exact kind/j binding. All permitted exponents are tested;
  s has no ceiling. BigInt/Python integers cover every arithmetic value.
- D02 PASS: 1185 recursive Lucas nodes including2, complete q-1 factorization,
  exact products, one order witness per distinct certified prime factor.
  Every composite ell is rejected using a complete certified factor/product,
  never probable primality. All 54 candidate-ell decisions are accounted for.
- D03 PASS: deterministic discovery completed for all targets, zero unresolved.
  Each target has a 120s monotone guard and POSIX real-time alarm; deterministic
  rho ceilings32 seeds/2000000 steps per seed and4096 Lucas bases. Fresh
  regeneration gives byte-identical artifact. Separate fixed exact TS/Python
  checkers agree on all manifests and15 strict positive witnesses. Replay
  timeout30000ms/maxBuffer262144; source/artifact hashes checked before dispatch.
- D04 PASS: altered product, Lucas witness, missing recursive base, missing
  criterion/ell entries, exponent and target scope drift, explicit PARTIAL,
  corrupted witness/replay output all fail closed. Actual absent-Python CLI
  exits1 without process diagnostics; TIP-033C controls and pin remain unchanged.

The gcd variant of Lucas used here is stronger than merely testing inequality:
for every q^e||(n-1), an a has a^(n-1)=1 mod n and
gcd(a^((n-1)/q)-1,n)=1. For each prime r|n this forces q^e to divide the order
of a modulo r, hence q^e|r-1. Doing so for all q gives n-1|r-1; r>=n and r|n
then force r=n. This is a written elementary justification, not a formal proof.

## EXACT RESULTS / REMAINDER

All exponent decisions, including miss rows, are retained in replay output.
Eligible `(a,ell,s)` triples:

- p131433121: (1,20551,164407), (3,391753,12536095).
- p159727681: (2,71,1135), (2,313,5007).
- p351121: (1,11,87), (2,3,47), (2,73,1167), (2,401,6415),
  (2,467,7471), (3,1009,32287), (4,3,191), (5,59,7551).
- p171348241: (1,61,487), (5,23,2943), (7,7,3583).

No hits at a>4 for the two hard targets. This is an exact restricted-family
decision, not a new root exclusion. The two positive controls gain three
additional eligible moduli beyond TIP-033C. All15 tuples separately satisfy
`n>2`, `0<x<y<z`, exact identity and exactly two n-divisible denominators.
The tail begins at a26 (minimum residue201326591) for the three larger p,
and at a17 (minimum393215) for p351121. Unresolved factor inputs: ZERO.
Uncomputed remainder in this subclass for these four targets: NONE, subject to
the written tail lemma; other targets/subclasses and formal/novelty remain open.

## VERIFICATION / HASHES

Fresh7 new unit tests PASS. Combined TIP033C/TIP033D13 tests/2 files PASS.
Full typecheck, targeted ESLint and git diff whitespace checks PASS, zero errors.
No full integration/browser suite or production build claimed by this Builder.

```text
python3 -I -S -B scripts/operations/certified-two-core-generate.py
node --import tsx scripts/operations/certified-two-core-audit.ts
npx vitest run --project unit tests/unit/certified-two-core.test.ts tests/unit/math-two-core-target.test.ts --maxWorkers=1
npm run typecheck
```

Hashes:

```text
Generator 908168b400a3fb70c3ccdf5f720c26b11459b49c1ec78b8d6e4ebc596061a0c8
Artifact ae5abacaddd6027e5875ded6db0448899efeae6f1e977355330a7b26b767a040
Python checker 6c78cc56b61e9497f3610219cfb51ff6583f831c81c07ce3bdd2c8b8ba612c7b
Entire decision / trimmed stdout b8aa9854ef8a16a0e7f02ce30f9c43b0bf2f8c06467713e2756ffbd036f7dcf9
```

Target manifests in fixed target order:

```text
0a721ef33b8fa78f072231e5b9264ca29090deb8849301325659daf0f5f1de66
6d3f7f6af0b8730d102aa3e1b08c6384c6b0bac0e1f307e6b4cd1456cb697b85
c7ca6edb37c97b6baf02fb1ad4c14cc1a6910b391330fabf486276471242efde
60ee993138412342b41da21a92051f5801078af4ff6eb3d0968512c62f1f3765
```

## ISSUES / DEVIATIONS / SUGGESTIONS

No blocking implementation issue. Discovery uses MR only as a filter; neither
checker trusts it. Generator requires POSIX signals on this local macOS/Linux
research environment. Rejected/incomplete artifacts never produce COMPLETE.
Deviation: per-q gcd order witnesses rather than one shared primitive base;
the exact elementary proof above supports the stronger checker criterion.
The two checkers share mathematics and SHA256 but use different recursive
certificate traversal and normalized-pair enumeration. They are not independent
foundational systems. Next mathematics: higher odd-prime exponents or multiple
odd generators; do not infer an adaptive universal coverage theorem from this
complete narrow decision. Formal alignment/publication review remain separate.

## Skeptic timeout repair

The independent review found an operational gap: SIGALRM during candidate
divisor enumeration was outside the earlier per-factor exception boundary.
The generator now wraps the WHOLE target, disables the alarm before building
pending records, and retains every exact missing criterion/exponent/kind or
ell input instead of exiting or inventing a miss. Finalization happens inside
that boundary; append/print happens only after the alarm is disabled.
Actual SIGALRM fault injection at the first candidate enumeration and at final
target finalization both return PARTIAL, bind the exact interrupted input/phase,
and leave no timer armed. The first retains all106 criterion tables and exact
pending enumeration tasks, while finalization retains all13 ell decisions but
still refuses COMPLETE. Normal regeneration remains byte-identical to the
pinned COMPLETE artifact, so artifact/checker/output hashes are unchanged.
