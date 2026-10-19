# COMPLETION REPORT — TIP-033C

2026-10-01. Builder under Vibecode Kit v6.2.

## STATUS

DONE within the fixed local diagnostic boundary. Not a live campaign, browser
E2E, agent evidence event, root theorem, formal proof or novelty acceptance.

## FILES CHANGED

Created only:

- `scripts/operations/two-core-target.ts`: signed-box finite set controls,
  fixed four-target divisor-criterion audits, strict Type II witnesses and scope.
- `scripts/operations/two-core-target-replay.py`: independent integer-divisor
  enumeration, exact congruences, strict integer identity and Type II replay.
- `scripts/operations/two-core-target-replay.ts`: digest-pinned isolated Python
  invocation with 10-second / 256-KiB limits, comparison and safe failure states.
- `scripts/operations/two-core-target-audit.ts`: fixed CLI; non-PASS exits 1.
- `tests/unit/math-two-core-target.test.ts`: six positive/negative scenarios.
- This completion report.

No historical source/cap, app route, agent integration, database, worker,
provider, mathematical note, TIP, handoff or git action changed by this Builder.

## TEST RESULTS

Acceptance coverage: T-01..T-04, 4/4 implemented and locally tested.

- T-01 PASS: all 1,336 rows for a1..8, odd primes ell<=997, compare exact signed
  boxes against the contiguous power interval and check minimum3*2^a-1.
  Rows manifest `c1d4916f901fa2958e54906dd70be40e184487bfb3fe70b303e9588788082758`.
- T-02 PASS: all criterion integers factored for each a1..4, four fixed targets;
  no s ceiling. All four expected manifests match the mathematical note.
  All 12 retained witness tuples independently satisfy strict ordered identity,
  normalized divisibility and exactly two p-divisible denominators. The four
  named p131/p159 tuples/digests are regression controls.
- T-03 PASS: fixed isolated Python `-I -S -B`, source pin, environment allowlist,
  timeout10000ms, maxBuffer262144 bytes. Output equals the entire TS packet.
  Missing Python returns UNAVAILABLE without process error/env leakage.
  Scope explicitly preserves uncomputed a>4 and forbids root promotion.
- T-04 PASS: six new tests and historical mixed-core regressions pass. Modified
  packet count / null raw output reject as MISMATCH; a genuine replay against a
  tampered primary returns MISMATCH. CLI under absent-Python PATH exits1, stdout
  says UNAVAILABLE, stderr is empty. Out-of-scope targets/exponents/prime bases
  reject; historical 4096 atlas / 4095 two-core search caps unchanged.

Commands:

```text
node --import tsx scripts/operations/two-core-target-audit.ts
npx vitest run --project unit tests/unit/math-two-core-target.test.ts tests/unit/math-mixed-core.test.ts --maxWorkers=1
npx eslint scripts/operations/two-core-target.ts scripts/operations/two-core-target-replay.ts scripts/operations/two-core-target-audit.ts tests/unit/math-two-core-target.test.ts
npm run typecheck
git diff --check
```

Fresh full typecheck and targeted lint PASS, zero errors. No production build,
full unit/integration/browser suite requested or claimed by this Builder.

Python source SHA256:
`3d6236f96239076cba5640ce4cfd1e111aeadfc3a621e87c125f6cd99958c68f`.
Compact entire packet / trimmed stdout SHA256:
`3c1c60e3f1e8abe2db377843386a24ade1394d42513c2f46dbb0daa527d847dd`.

Four target manifests respectively p131433121 / p159727681 / p351121 / p171348241:

```text
dd9dbf6fad33777fee6c6a283c12f2a719ae6674ff777ca25bf3f14f57c6fbe7
c8916bbb5c5df7f538e65100bfdd6bfc27b7d492744a6e3d2029b8df0f67d9fb
7b3044385060a9302a895f3ff682b1df0f6677fbc16a7d4670554ed68e293433
42db9a004759eb4389322798f54226d5c396dd6f695d6d3ed57ad86baab66b20
```

## ISSUES

No blocking issue. Exact written theorem review remains Contractor's
responsibility; the finite code checks do not prove its infinite quantifiers.
All-exponent target audits are explicitly not executed. Trial factorization
bound176 billion applies ONLY to the fixed a1..4 inputs and must not be
silently expanded. Signed-box and divisor enumeration are independently
implemented but share the normalized-family mathematics and standard arithmetic.

## DEVIATIONS

None affecting approved scope. The fixed packet summarizes the 1,336 checked
rows by count/digest, keeping replay output small; both implementations generate
every row and check the exact set before emitting that manifest. Retains every
one of the 12 fixed positive controls, exceeding the minimum four named tuples.

## SUGGESTIONS

Review the tail proof separately. A next TIP can design certified factorization
for remaining finite exponents; do not conflate the proved cutoff with having
computed those exponents, or attach this diagnostic to agent V2 by implication.
