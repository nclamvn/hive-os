# TIP-063 independent Integration review

STATUS: PASS for R5 offline preparation/audit engineering, with stated limits.
Reviewer Core Builder did not author the Integration module/tests. Review
2026-10-04 after Core's consequential canonical-closure repair. No Integration
file modified. PASS is not mathematical theorem acceptance or live activation.

## Frozen reviewed files and context

| File | Actual SHA256 |
| --- | --- |
| src/modules/research-sandbox/math-lrc-proof-unit-audit.ts | d5db654c7e6104a00860af868f7904d55844d6470d42315fd52a49876ba3768d |
| tests/unit/research-lrc-proof-unit-audit.test.ts | b957dc1395360cec658b8daf99b606c96c07eaefab1ab672e458c4f3949320ed |
| docs/verification/TIP-063_INTEGRATION_COMPLETION.md | 903e10fa0e030a9c417d93088272b6fee58205845a4dee939904749b1bc76794 |

Reviewed against final Core source294b9ba3e804960478bbcee3df8f771b82e748818d9c6500802c597740ee8f96,
packet43debef344eb14197d28e9e20446a7d48ee5bcd33758e3d7c8657e0e8a269062,
8steps/6premises/14references. The Integration callbacks dynamically address
all final named premises/steps; they do not rely on the superseded preliminary
packetd2b61872 or old literal-labelled-row wording. Old062 v2/ledger5 remain
outside the new input/report contract.

## Findings and code inspection

No remaining actionable finding. Full source, tests and completion read.
Generic reused guardedLrcCampaignCall was also inspected: it clones/deep-freezes
the defensive callback input and independently snapshots both raw and defensive
inputs, checking successful AND failed callback paths. Static dependencies are
pure schema/data/hash modules, not old adapter/kernel execution paths.

1. Preparation admits Core's exact fixed packet, not arbitrary self-rehashed
   content. The source DATA block is identical across SOLVER/CRITIC/ADVERSARY;
   role/context/instructions and strict response schema participate in separate
   input digests. Each nested returned value is frozen. Observed prepared sizes
   with offline:review-s/c/a labels:21074/21077/21068UTF8B, each <=49152.
   Packet digest is identical; the three input digests are distinct.
2. Activation is explicit, all callbacks must exist before any call, contexts
   are strict offline-prefixed and pairwise distinct, and dispatch is exactly
   ordered SOLVER→CRITIC→ADVERSARY, once each without retry. Absent packet alone
   defaults; explicitnull refuses. Host packet/context references and content,
   activation and callback identities are revalidated before/after calls and
   on rejection. Changed references cannot evade guards using identical bytes.
3. Strict bounded responses bind role/context/packet/input and contain every
   named premise/step exactly once. Unknown/duplicate/missing findings refuse.
   CONDITIONAL_REVIEWED requires every finding CONDITIONAL; OPEN/MISSING/
   DISPUTED feedback cannot gain agreement. Honest uncertainty downgrades;
   rejection dominates other conditional responses. There is no partial-report
   backfill when a callback throws or returns malformed feedback.
4. Extra accounting/provider/model/thread/ledger/evidence fields and PROVED
   dispositions refuse. Even false untrusted prose cannot alter host-global
   NOT_ESTABLISHED, formalNOT_ESTABLISHED, freshforestNOT_RUN or historical
   NOT_USED_IN_HISTORICAL_062_CASE fields. Reports remain PROOF_UNIT_AUDIT,
   OFFLINE_INJECTED and conditionalp83scope, not old kernel ledgers.
5. Passive report admission reconstructs the exact three role inputs, order,
   distinct contexts, coverage, conservative outcome and canonical auditdigest.
   Coherent rehash alone cannot change packet binding, role order or uncertainty
   into agreement. Passive guards perform schema/hash preparation only: no IO,
   scalar checker, callback, provider or model execution.
6. Limits are enforced in UTF8 bytes for input49152/response8192/report32768,
   with bounded summary1024/finding256 characters and count caps. Tests include
   multibyte overflow despite valid character counts. No old062 caps changed.

## Independent offline verification

Five suites192/192 PASS,3.22s, start10:09:35local/maxWorkers1:
research-lrc-proof-unit-audit61 + math-lrc-proof-unit54 + unchangedcampaign45
+ unchangedcampaign-integration/adapter32. Counts overlap other Builder/Main
runs and must not be added together. New61 Integration cases cover bindings,
rehash mutations, context collision, activation/refusals, missing evidence,
order, frozen mutation and honest downgrade. Core54 cases additionally verify
the final proof-packet guard and unchanged42file mathematical manifest hashes.
Read-only node --importtsx preparation diagnostic confirmed actual sizes and
all three distinct input digests after the final packet repair. No model or
provider invoked. Review did not rerun whole tsc concurrently with Main's final
build/QA; Core's latest preceding whole tsc exited0 after UI fixture repair.

## Explicit limitations / acceptance boundary

Injected callbacks are an explicitly trusted caller seam, not an OS sandbox
or external independent reviewers. Main expressly approved count/output bounds
without a hard wall-clock/preemption architecture. Arbitrary JavaScript callback
wall time cannot be forcibly stopped here; no misleading Promise.race/cancel
guarantee is made. Pure read guards establish fixed structural identity, not
cryptographic execution attestation: fabricated schema-valid offline feedback
can be hashed, but is still only untrusted offline feedback. Prose correctness
is not established by schemas or agreement. Retained forest/universal/formal/
global debts remain unchanged. Live durable provider transport requires a
separate approved versioned scope. Browser/DB/full forest/model/live usage,
external academic acceptance and global LRC NOT_RUN/not established here.
