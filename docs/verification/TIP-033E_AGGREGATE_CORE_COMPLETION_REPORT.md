# COMPLETION REPORT — TIP-033E

2026-10-01. Builder under Vibecode Kit v6.2.

## STATUS

DONE within the aggregate odd WHOLE-BLOCK subfamily. Four fixed targets,
all allowed exponents and all moduli, zero unresolved inputs. No UI, agent
event, database, worker, provider, dependency, Git or publication change.

## FILES CHANGED

Created only:

- `scripts/operations/aggregate-odd-core-check.ts`: additive exact block
  decision, finite image controls, classified factor evidence and canonical
  strict representatives. Reuses D's full immutable certificate verifier.
- `scripts/operations/aggregate-odd-core-replay.py`: separate aggregate
  integer-pair enumeration after executing source-pinned D Python certificates.
- `scripts/operations/aggregate-odd-core-replay.ts`: fixed isolated replay,
  source pin, timeout30s, output256KiB, safe failure and comparison.
- `scripts/operations/aggregate-odd-core-audit.ts`: fixed CLI, non-PASS exits1.
- `tests/unit/aggregate-odd-core.test.ts`: seven positive/negative scenarios.
- This report.

D artifact/source/output/pins remain unchanged. No historical cap changed.

## REQUIREMENT RESULTS

Coverage E01..E04: 4/4 implemented and locally tested.

- E01 PASS: m=2^a*q, q>=3 odd prime OR composite; allowed ratios only
  2^f*q^g, f[-a,a], g[-1,1]. Partial prime divisors of q are never blocks.
  Since q=2^(-(a+2)) modulo s=2^(a+2)*q-1, interval images merge into
  [-2a-2,2a+2]; therefore R={-2^t}. The four-case written minimum proof
  uses only q odd (2^t mod q cannot vanish) and q>=3, not q prime, and gives
  minR>=3*2^a-1. This reuses the reviewed written tail, not a formal proof.
  Every qualifying q from every D-certified criterion divisor is retained
  without its prime filter, for a1..25/25/16/25 respectively.
- E02 PASS: new method ERDOS_STRAUS_AGGREGATE_ODD_BLOCK_DECISION_V1.
  All1185 recursive Lucas/product nodes are rechecked; all388 criterion
  entries and54 q decisions are checked before expansion. Every chosen pair
  has gcd(A,U)=1 and AU|m; exact congruence, strict identity, positive distinct
  denominators and exactly two p-divisible denominators are verified. All
  composite q carry their certified complete factorization.
- E03 PASS: fixed artifact/hash plus Python source and pinned D dependency.
  Python uses -I -S -B, allowlisted environment, timeout30000ms, output262144
  bytes. Missing/corrupt certificates, omissions, scope drift and mismatched
  output never yield PASS/COMPLETE. CLI without Python exits1 safely.
- E04 PASS: prime compatibility with unchanged D output, composites/q9,
  missing/product/Lucas/scope/tail corruption, provenance distinction and
  explicit full-mixed-core negative control all tested.

## EXACT COUNTS AND MATHEMATICAL FINDINGS

Counts refer to ONE canonical (A,U)-ordered strict representative per eligible
core (a,q,s), not enumeration of every possible parameterization/solution.
Prime baseline and aggregate counts are intentionally separate.

| p | eligible cores | composite cores | distinct representative tuples | D distinct tuples | additional tuples |
|---:|---:|---:|---:|---:|---:|
|131433121|13|11|7|2|5|
|159727681|10|8|7|2|5|
|351121|14|6|11|7|4|
|171348241|18|15|15|3|12|
|Total|55|40|40|14|26|

E recovers the earlier p131433121 witness via whole q9 at a2:
(A,U,s,v,k)=(4,9,143,3676451,1), strict tuple
(33088059,4731592356,1932829716534284). This was already known, not new root
coverage. Prime-only D's least s164407 was a restriction of that subclass.
The minimum eligible s within E for the four targets is143/1135/47/199;
these are not minimum denominators or all-family optima.
The a1/q25/s199 p171348241 representative is
(43052325,8567412050,590155212776826), checked exactly.

Essential negative control: p159727681, a1,q99,m198,s791 has residue260 and
NO whole-q block hit. Nevertheless the FULL normalized mixed-core pair
(A,U,v,k)=(3,11,605794,6) gives the strict tuple
(39982404,31626080838,1741717274106852). E must not include it by treating
3 or11 as q99 blocks. The finite atlas and actual target manifest both exclude
this control. Likewise q9/a1 and q9/a2 never include the partial block3.

Uncomputed remainder in this aggregate-block subfamily for FOUR targets:
NONE, subject to the written tail. The rest of the normalized composite-core
divisor family remains outside E, as the791 control demonstrates. No all-prime
coverage, root theorem, formal or novelty conclusion follows.

## VERIFICATION / REPRODUCTION

Seven new tests PASS. Combined E/D14 tests/2files PASS. Fresh full typecheck,
targeted ESLint and diff whitespace check PASS, zero errors. No full unit,
integration/browser suite or production build claimed by this Builder.

```text
node --import tsx scripts/operations/aggregate-odd-core-audit.ts
npx vitest run --project unit tests/unit/aggregate-odd-core.test.ts tests/unit/certified-two-core.test.ts --maxWorkers=1
npm run typecheck
```

Hashes:

```text
Unchanged D artifact ae5abacaddd6027e5875ded6db0448899efeae6f1e977355330a7b26b767a040
Unchanged D Python dependency 6c78cc56b61e9497f3610219cfb51ff6583f831c81c07ce3bdd2c8b8ba612c7b
New E Python source 92e916acd4981c82cc676508ac76a261d7a41a1f8f30a0ed98cd52f222d40a92
Entire E decision / trimmed stdout 1e69acb42c9417ed4ad1ee9c25f98f49b26db0180d8b1e8b9f4bd210d24e4f79
```

Per-target manifests:

```text
a0123753c49693d8d52df6c8fda6aa9aedfca44848531c4c2e9d3a71b47fabb9
8f3dd2dd7799db7ed8f9f8f1706d38bef33c309ad565b6fe65e48a7baf0b1f2e
eef98ac54f9c792a39751a5b40f91d3bb75f6fafe1f417d3e33dcd92d5c4b1ce
1a7d52c63bab82fef7bb215a054108247140c364084a23bb0a5d178db19cba38
```

## ISSUES / DEVIATIONS / SUGGESTIONS

No blocker or approved-scope deviation. Python reuses the PINNED D Python
certificate engine and separately implements aggregate integer-pair enumeration;
this is not a wholly new independent foundational verifier. TS likewise reuses
D's exact certificate verifier and implements new signed whole-block pairs.
The generic semantic verifyAggregateOddCore(raw) deliberately reports
sourceArtifactDigest:null and only EXPECTED source pin. Only the fixed
byte-hash-checked loader binds actual artifact provenance; a different valid
Lucas witness remains semantically valid but does not acquire that byte hash.
The corresponding regression swaps a valid prime5 Lucas base2 for3.
Next: translated windows for higher odd-prime exponents or separately bounded
general mixed cores, preserving the791 exclusion and all fixed old certificates.
