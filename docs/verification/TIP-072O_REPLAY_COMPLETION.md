# TIP-072O — independent replay Builder completion

Date: 2026-10-05. Role: Replay Builder. Status: FROZEN / READY FOR INDEPENDENT REVIEW.
This report covers only the four new files assigned to this Builder. It does not
grant production execution or replace independent review/Main acceptance.

## Sealed scope and exact identities

The complete sealed TIP was read before implementation:
`docs/contractor/tips/TIP-072O_FIVE_EXCEPTION_PAIR.md`, SHA-256
`e44326aacc687bdea50f68d6da7092eb44ac5ab1e31c367b0d8ad0ef5b6ba8f6`.
The current handoff, project instructions and installed Next.js Vitest guide
were read; the Vibecode Builder ownership and evidence-based verification
workflow were followed. The final Main mathematical dossier, including the
warning that a residue representative does not validate every integer lift,
was read and matches the fixed actual-speed scope here.

| Owned file | Bytes | Frozen SHA-256 |
| --- | ---: | --- |
| `scripts/research/lrc-five-exception-replay.py` | 13,829 | `0129c863fcc092872d1cb34fcbf4b3f189ca3108cead6060e6185e0bd70087fd` |
| `scripts/operations/lrc-five-exception-audit.ts` | 12,567 | `bd1605a7d77a2af6d1012e1e49e5ef48649304dafd9ad9ae50916e9dfe290ed0` |
| `tests/unit/math-lrc-five-exception-replay.test.ts` | 24,062 | `99188da02dbf92f726a7988a84b887dd0fc2948a2d8be68249fcc094e8016eab` |
| `docs/verification/TIP-072O_REPLAY_COMPLETION.md` | See external hash | Self-hash supplied separately after freeze |

Pinned Core input:
`src/modules/research-sandbox/math-lrc-five-exception.ts`, SHA-256
`57a414857a7ab458efeda92e8229d6308dd799d18c68a72bb4cbeb32213a0792`.

Complete semantic report digest:
`86731a54c988e4f22d3a793101f4faddaeb60e6a6ab8f4047db88df0e14d0255`.
The entire canonical evidence is compared, not just this digest or verdict.
The wire uses reduced signed decimal numerator/positive denominator tuples;
all verbose fields fit without interning, omissions or increased quotas.

## Independent mathematics reconstructed

Python imports only `hashlib`, `json`, `math`, `sys`, `time` and stdlib
`fractions.Fraction`. It imports no Core/old mathematical routine, supplied
speed solver, network, process, filesystem or provider library. It derives
threshold crossings from the actual affine equations and bounded integer
ranges, independently of the Core's arithmetic/enumeration.

- Six roots `0, 1/30, 1/15, 2/15, 1/6, 1/5`; all eleven ordered closed-point/open
  cells, including both endpoints; all five-by-two distance matrices; separate
  coordinate BAD sets, exact BAD union and GOOD complement. Equality is GOOD.
- All eighteen fixed full14-speed positive tuples, twelve scaled and six
  arbitrary-extra tuples, in the sealed order. All 252 selected full-coordinate
  distances, all exception matrices, lowest physical GOOD shift, lower witness,
  carry, inverse, normalized phase/shift, and exact time are retained.
  Actual minima need not equal the guarantee: they are `1/10` or `2/25`, both
  above the conditional guaranteed `1/15`.
- The first consequential omitted-carry failure is independently located at
  fixture8/q11: correct physical0/normalized1/carry1/inverse1; omitted carry
  gives physical1/time11/50. Speed77 has distance3/50 below1/15.
- Sharp exceptions `[1,2,3,4,7]`, base1/15, and the full fourteen-speed extension
  with reduced divisibles `[1,2,4,5,7,8,10,11,13]`. Every five-by-fourteen matrix,
  lower witness tau1/3 and minima `[1/15,1/15,1/15,0,1/15]` are retained.
- Independent-phase zero obstruction, full14 residue-alias witness
  `[6,17,11,23,29]` at1/6, and failed three-exception upgrade `[1,2,7]` at1/10.
  These do not become counterexamples to global LRC. The alias has verified
  lower minimum1/6 but full shift maximum1/30, so congruence alone cannot
  replace an exact doubled pair.
- Six conservative route comparisons preserve the stronger applicable
  independent bound; e=d zero is `NO_POSITIVE_GUARANTEE`, not LRC failure.
  Routes remain passive mathematical evidence, not runtime/registry changes.
- Every scope assertion is part of exact reconstruction/comparison: conditional
  lower witness; target15 total met conditionally; target14 total not certified;
  no strict slack, fixed tuple optimum, global/formal/external/novelty result,
  autonomous agent run, generic solver, residue-only premise or authority.

The finite cells/fixtures are diagnostic evidence. The all-real pair lemma,
counting theorem and conditional lift depend on the separately written and
reviewed proof; the Python process does not turn samples into a universal proof.

## Fresh process, source consistency and shared resources

The CLI permits only the fixed inspected source. It opens both sources as
regular non-symlink files, bounds them before reading, checks file identity and
SHA-256 before and after the process, and executes the inspected Python bytes:

`/opt/homebrew/bin/python3 -I -S -B -c <inspected pinned source>`

The process uses `shell:false`, fixed bounded stdin/stdout, 2KiB stderr limit,
SIGKILL timeout and minimal `{NODE_ENV:"test"}`; no inherited secrets or PATH.
Python rejects duplicate JSON keys, NaN, malformed/unknown fields/versions and
oversized stdin before parsing. Fraction components are bounded to256 bits.

The shared outer maximum stays 5,000ms /2,000,000 charged steps /32,768 bytes.
Source IO, Core work, serialization, fresh process, independent work and complete
comparison all consume this one allowance. The child receives the actual
floored positive remaining milliseconds/operations, not reset maxima. Zero,
negative, fractional, excessive and inconsistent controls refuse. Any failure
returns null positive evidence, including source drift after process success.

Passive admission rejects getters/prototypes/symbols/hidden keys/cycles/sparse
arrays and inherited serialization hooks without invoking hooks. Whole semantic
equality prevents coherent rehashed corruptions from acceptance. Generated
successful evidence is the detached immutable Core evidence, not untrusted
Python objects.

Source pins prove local inspected-byte/process consistency only. They do not
attest a malicious host, installed interpreter, signed producer, production
source closure, durable agent replay, grant or M1. The whole result explicitly
retains `NOT_SIGNED_ATTESTATION`, `agentLoop: NOT_RUN`, authority false.

## Actual verification

All six execution flags were explicitly false for the named unit/type/lint/audit
runs: worker, pilot queue, local campaign, OpenAI, local Codex and Docker sandbox.

| Check | Actual result |
| --- | --- |
| Named Replay unit selector | 100/100 PASS; tests1.70s, runner1.91s |
| Whole `tsc --noEmit --incremental false` | EXIT0, no diagnostics |
| ESLint owned CLI + Replay test | EXIT0, no diagnostics |
| Actual `node --import tsx scripts/operations/lrc-five-exception-audit.ts` | MATCH64.17675ms;90,421 total steps;29,716B complete stdout including newline |
| Actual Core contribution in that audit | 53,564 steps;13.305417ms |
| Actual isolated Python contribution in that audit | 6,487 steps;6.782084ms;process43.522875ms |
| Complete evidence envelope | 29,162B;3,606B below32KiB |
| Separate real raw Python request | ACCEPTED, exit0, empty stderr;6.9000ms;6,487 steps;29,252B stdout including newline |

The 100 tests include full actual Python/Core equality, all roots/cells/fixtures,
independent exact recomputation of all140 full14 sharp+alias matrix coordinates
and lower rows, carry failure, conservative routes, coherent rehashed semantic
corruptions, hostile passive inputs/hook invocation counters, pre/post source
drift, subprocess exit/signal/timeout/stderr/malformed/oversize faults, inconsistent
metrics, all flag refusals, shared-step/time exhaustion and actual raw Python
request/resource/duplicate-key/NaN/overflow controls.

Reproduction uses the six OFF assignments, then:

```text
node ./node_modules/vitest/vitest.mjs run --project unit tests/unit/math-lrc-five-exception-replay.test.ts --maxWorkers=1 --no-file-parallelism
node ./node_modules/typescript/bin/tsc --noEmit --incremental false
node ./node_modules/eslint/bin/eslint.js scripts/operations/lrc-five-exception-audit.ts tests/unit/math-lrc-five-exception-replay.test.ts
node --import tsx scripts/operations/lrc-five-exception-audit.ts
```

A pre-freeze filtered development test included the actual audit while Core's
pin was still `PENDING`; it correctly returned SOURCE_REFUSED, with23 other raw
Python/passive/math checks passing. After the final Core pin, the complete100
tests and actual audit passed. This is recorded, not suppressed or promoted.

## Acceptance ownership and boundaries

O1: independent fixed arithmetic aligns with Main's proof; universal proof
acceptance remains Main/reviewer-owned. O2: all negatives and truthful scope
retained. O3: complete18/252 construction and consequential carry control PASS.
O4: fresh actual independent whole-content replay PASS. O5: named hostile/source/
process/resource controls PASS with null refusal evidence. O6: Builder checks
complete; independent final review, Main full regression/build and preservation
audit are intentionally not self-certified in this report.

Only the four new owned files were authored. No prior source/test/UI/worker,
registry37, closure cap42, forest, ledger7, archive, case, private capture root,
DB/session/provider/model, M1/campaign, environment/install, Git, billing or
deployment change was made by this Builder. No spending occurred. Products/tests
are frozen at the listed SHA-256 values; further changes require an identified
finding and a new freeze.
