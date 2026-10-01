# TIP-040 independent replay completion report

2026-10-01. Builder B, Vibecode Kit v6.2. STATUS: DONE for the assigned
standalone replay, scoped consistency checker, tests and report. No product,
root gate, benchmark campaign or research breakthrough is claimed complete.

## 1. Scope and ownership

Read AGENTS.md, durable handoff, full TIP-040, Vibecode Kit and its TIP/report
reference before implementation. The frozen contract SHA-256 is
`45007d95c263301e726006d1d2fb285350ec45e08959dfc87356336f5ed32e60`.
The exact 71 exposed inputs and ascending single-factor chain followed by
unordered nonempty support bipartitions were preserved. No additional rows,
cyclic-block fallback, method tuning or outcome-dependent allocation was added.

Five new owned files:

- `scripts/operations/sufficient-coverage-replay.py`.
- `scripts/operations/sufficient-coverage-check.ts`.
- `scripts/operations/sufficient-coverage-replay.ts`.
- `tests/unit/sufficient-coverage-replay.test.ts`.
- This report.

All prior TIP-036 through TIP-039 sources, tests and pins, unrelated dirty work,
handoff and manifest were preserved. No app/UI, DB, worker, agent-cycle authority,
provider/model/API, dependency, Git or deployment changes were made.

Before discovery, Contractor and both Builders clarified deterministic choices:
half representatives use numeric-lex ordered coprime (u,v), retaining actual
residue and signed vector; matching scans A cosets numerically and performs an
exact covered-K lift. Final certificate vectors may be globally inverted to
normalize u<=v, with explicit orientation and raw vectors retained. This was
an approved implementation clarification, not a predicate or input change.

## 2. Independent arithmetic and constructive criterion

Python imports only standard-library utilities. It does not import primary
outcomes, factors, images, histograms, representations or prior replay engines.
It independently checks domains, factors T and the ambient group order, and
reduces relative orders by factored-order modular powers and membership in the
explicitly covered subgroup K. This is independently implemented arithmetic,
not a wholly unrelated order algorithm, formal proof or independent human review.

K starts at identity. At each step the smallest-prime unused factor with exact
relative order d<=2e+1 extends K through d consecutive legal exponent digits.
Disjoint cosets and retained vectors make every covered entry constructible.
Previously blocked factors are reconsidered after growth. The chain stops
immediately upon covering -1. The final full-image stabilizer is never supplied
as free coverage, and each prime support block is consumed at most once.

For remaining factors, Python enumerates ordered positive coprime divisor pairs
uv|T_half, rather than primary signed-exponent histogram DP. It retains every
quotient-coset multiplicity, numeric-lex pair representative and signed vector.
N counts assignments, E=sum(mu^2), and L=ceil(N^2/E), all exactly. Only disjoint,
nonempty A/B support partitions are considered. Strict L_A+L_B>|G/K| forces a
target-coset match; exact actual residues determine a covered-K lift. The three
disjoint vectors give a legal construction and a checked strict rational identity.
Unsuccessful sufficient criteria return NOT_CERTIFIED, never MISS or exclusion.

No full ambient-unit scan or full signed image is used as the new criterion's
input. Exposed source results are compared only after certificate generation.
Constructive witnesses are not claimed globally minimal or optimized.

## 3. Actual frozen result and post-certificate comparison

Primary and independent replay agree on all 71 rows, every chain stage, covered
representation, attempted partition, quotient histogram, multiplicity, energy,
rounding, representative, allocation count, lift, certificate and strict tuple.

Invariant content digest:
`48b455470ecb38da669d372206841a65fbc34facb0b684763a01b3df5d96fa72`.

Counts: CHAIN_CERTIFIED4, ENERGY_CERTIFIED0, NOT_CERTIFIED67.
Certificates are P0_h3, P1_h3, P1_h31 and P2_h3. The h31 construction has covered
K size10 and vector [-7,-1]. Its denominators are deliberately retained even
though they are large: (50150528,324525821956479,16275141320751414870912).

A separate approved post-certificate comparator generated the new packet and
fresh replay first, then invoked the old exact TIP-037/TIP-039 diagnostics.
Their source contents remain respectively
`a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c`
and `ff01bdbd52abbb55e98ab912b2c201968cecb210a5fd6449725dd8804731831e`.
Of 11 known hits, four are certified and seven remain NOT_CERTIFIED; all
60 known misses remain NOT_CERTIFIED. No certified miss was observed. This is
a development comparison on exposed rows, not a held-out score, another new
independent ground-truth campaign or evidence of increased root coverage.

The method supplies useful checkable sufficient constructions but misses known
solutions. It proves neither universal factor supply nor termination. No novelty,
root breakthrough, formal certification or superior AI research yield is claimed.

Final actual fresh receipt: PASS, 648ms total wrapper. Python: 101ms,
40,399 ordered pair candidates, 7,068 state insertions, 14,615 additional work
ticks, 744,393 output bytes. Primary: 156ms, 11,405 states, 119,478 work ticks,
744,374 bytes. Implementation-specific counters are not equal-work scores.
Contractor separately obtained final PASS680ms, Python102ms, unchanged content.

## 4. Scoped checker and replay authority boundary

The strict checker binds exact fixed inputs, source-content identifiers, domains,
limits, statuses, prefixes and nested hashes. BigInt arithmetic validates group
products and strict identities. It reconstructs the exact greedy chain and
retained representations, verifies allocation disjointness, threshold rounding,
first-success stopping, matching, lift and final vector normalization.

Half checks establish legal representatives and internal mass/energy identities;
they do not independently reconstruct true multiplicities or numeric-lex minima.
Thus scoped validation alone is not proof authority. A concrete fully rehashed
P0_h11 half-frequency redistribution preserves N, recomputes E/L and passes
scoped validation, but fresh Python comparison returns MISMATCH. The wrapper's
full semantic comparison is mandatory for its PASS result.

A bounded abstract-allocation verifier exercises the otherwise absent actual
ENERGY branch. It is explicitly not campaign admission or arbitrary root/witness
authority. Global packet validation still requires fixed inputs and strict root
identities. Tests demonstrate that fabricated abstract witness fields cannot
be promoted into an accepted fixed packet.

## 5. Resources, failure preservation and provenance

Limits remain 60 seconds, 71 rows, two million state insertions, 50 million
work ticks, independent 50 million divisor-pair candidates and two MiB output.
Atomic completed row prefixes retain exact next ROW input or FINALIZE pending
context. Pair/state/work/row/time/output exhaustion cannot produce PASS.
Serialization and final stdout checks are included in Python observed deadlines.
The post-row assert_candidate guard checks status/certificate/attempt consistency;
its Investigation diagnostic retains that bounded offending hashed row under
non-COMPLETE INVESTIGATION and exit1, never normal certificate admission. Earlier
factor, coset or strict-arithmetic ValueErrors fail the process closed but do not
universally retain a full offending row. The diagnostic test injects a synthetic
consistency fault; no actual mathematical refutation was observed or claimed.

The wrapper reads the fixed Python source, records observed and expected hashes,
verifies the pin, and executes those exact bytes with python3 -I -S -B -c.
It does not hash then reread an executable source path. Environment inheritance
is restricted to PATH, PYTHONDONTWRITEBYTECODE and NODE_ENV. Total wrapper time
includes validation, source reading, process initialization, bounded output,
JSON parsing, comparison and final observed receipt checkpoint. A child COMPLETE
at total60000ms is downgraded to UNAVAILABLE/WRAPPER_TIME_LIMIT.

Deadlines are observed checkpoints plus child process timeout, not hard JavaScript
preemption. PATH-selected Python is not independently authenticated. Source and
receipt digests provide byte binding inside the trusted local collector boundary,
not external signatures or adversarial-host attestation. Missing source/tool,
source drift, process/output failure, invalid JSON and disagreement fail closed.

## 6. Tests, controls and final verification

Twelve grouped tests cover actual replay; fully rehashed scope, chain, allocation,
energy, coset, lift, tuple and resource faults; coherent frequency forgery;
positive ENERGY with nontrivial lift; known hit not certified; strict-threshold
equality; composite even K; BigInt precision; exact partial pending inputs;
first/internal/midpoint/last/finalization timeouts; constructor and stdout
serialization expiry; output prefix/head limits; retained contradiction rows;
source/process/environment failures; and late final receipt downgrade.

Abstract controls are not additional campaign rows. U7 factors3^2*5 supplies a
positive ENERGY witness (45,1730,3114) for p173 outside the frozen root domain.
U31 exercises nontrivial K lifting. U19 exercises a stronger energy allocation
only, without asserting a prime-root witness. U11 factors2*5 has a known hit
but is NOT_CERTIFIED. U7 factors3*17 tests equality, which is not sufficient.
U15 factors7^2 has even covered K excluding -1, preventing a prime-parity shortcut.

Final owned unit run: 12/12 PASS, one file, 12.98s, start21:27:03+07.
Heavy bounded mutation tests use a narrow 30-second test harness allowance;
production mathematical caps were not relaxed. Owned ESLint, full TypeScript
check and git diff --check all exit0. No assertion failure or guard weakening
occurred. Contractor's final whole-unit run: 715/715 PASS, 101 files, 95.43s,
start21:27:51+07; full lint, owned lint and typecheck exit0. Skeptic independently
confirmed fresh replay, 19 rehashed faults rejected, coherent-frequency
MISMATCH and exact first/mid/last/finalize PARTIAL prefixes, with no open blocker.

Reproduction:

```sh
npx vitest run --project unit tests/unit/sufficient-coverage-replay.test.ts
npx eslint scripts/operations/sufficient-coverage-check.ts scripts/operations/sufficient-coverage-replay.ts tests/unit/sufficient-coverage-replay.test.ts
npx tsc --noEmit --pretty false
node --import tsx -e 'const a=require("./scripts/operations/sufficient-coverage.ts");const b=require("./scripts/operations/sufficient-coverage-replay.ts");const n=a.sufficientCoveragePacket();const r=b.replaySufficientCoverage(n);console.log(JSON.stringify({status:r.status,pin:r.verifiedScriptDigest,elapsedMs:r.elapsedMs,contentDigest:r.replay?.contentDigest,runtime:r.replay?.runtime}));'
```

Frozen owned SHA-256:

| File | SHA-256 |
| --- | --- |
| sufficient-coverage-replay.py | 57874e09b3c501919c64c611b25d475d2f83419aabc35024fcd06af518983b96 |
| sufficient-coverage-check.ts | 939b9e7c1b2ac3fc97d4eeb2501c383ba4366ab145dc0d9f61f1e756e1d55a07 |
| sufficient-coverage-replay.ts | 5497d52d04cfb001302847660e1faae6fc4b9d7445b67ef510fb58a531d151f4 |
| sufficient-coverage-replay.test.ts | 60756d4596d5a814b53d1ac1791ed324a714336feb3b334139fbd0cfbe0edb33 |

Remaining gate: Contractor acceptance and integration decisions. This slice
does not authorize live research execution, root-result promotion or any product
gate bypass. Future stronger coverage criteria require a separately frozen scope.
