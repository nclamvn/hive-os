# TIP-064 Core completion — prospective durable proof-unit audit

Status: CORE_ENGINEERING_COMPLETE; independent review and Contractor aggregate acceptance remain separate. This report does not authorize or record a live run. Builder ownership is the new dependency-safe pure binding module, additive contract/attempt/review schemas and evaluation/read admission, and new offline Core tests. No DB schema changes.

Authority: sealed `docs/contractor/tips/TIP-064_LRC_DURABLE_PROOF_UNIT_AUDIT.md` SHA-256 `08bb5e527c43c5890bb02a5cbf1a7585d08409c5b20e1a2b5b0d8c571e09f23a`, incorporating proposal SHA-256 `119e545a027c43bba63a320ffdd189659a90585d1d8679105eb7c3310bbf52b1`.

## Final owned source pins

| File | SHA-256 |
| --- | --- |
| `src/modules/research-sandbox/math-lrc-proof-unit-live.ts` | `efc369abcefded7b0dda0ef38b22631e97ba7334c2ec969ab7e78636d939ea16` |
| `src/modules/research-sandbox/math-pilot.ts` | `b0935868eb848879e1b2f759fcfa51b8b706a7f4a70140fe465e37c95e674a89` |
| `src/modules/research-sandbox/contracts.ts` | `7a8302db375f75e3faef2f0cd7f79662b6826b12b99f9127443fa26de7be4e2d` |
| `src/modules/research-sandbox/agent-review.ts` | `0241a135aeb2caa2f249467f4d94fc346cd5928c84e234176dd7eab599b0916a` |
| `tests/unit/math-lrc-proof-unit-live.test.ts` | `b359d2347d38f5ba59551d2c33c3ff8cf7fd5b43954413429884435bf16f751d` |

No TIP-063 file was edited. Frozen packet digest remains `43debef344eb14197d28e9e20446a7d48ee5bcd33758e3d7c8657e0e8a269062` (17,990 bytes). Its module/test pins remain `294b9ba3e804960478bbcee3df8f771b82e748818d9c6500802c597740ee8f96` and `009b0fb09a062d7f1d1ef4ef7dcad759c528ddbe1af8327f434eadce1d0f5c72`; old Core report remains `b1d2c38b845231a535f688b46c7127fe9434a304d787a98b3c79b139134ba40c`. Current source-data digest is `06653db90b45d1c70f5a109d4ea1343c12bb3b2ab3ce5bb005e1089cf1743b13`; new fixed contract-v3 digest is `351f412c9eb014728a24eac83d89766955a1ffade6fada682b0f46f123a172ff`.

## Delivered contracts and admission

- Explicit `LRC_PROOF_UNIT/ALLIKVERE_P83_PROOF_UNIT_V1` routing resolves only the fixed contract-v3 with separate `lrcProofUnitScope`; it does not attach or reinterpret campaign-v2 evidence. Historical readers and absent optional-field serialization are retained.
- Mathematical solver/reviewer output schemas exclude host evidence, input, identity, thread and usage. The generic attempt schema intentionally accepts transient model feedback before trusted worker attachment; persisted v3 admission requires paired host evidence and feedback. Old lanes refuse prospective fields, including explicit undefined-marker presence where applicable.
- Every role supplies all six premise findings and eight step findings exactly once. Only CONDITIONAL/OPEN/MISSING/DISPUTED are admissible. Conditional-reviewed feedback cannot contain open/missing/disputed findings. Solver/reviewer role mandates differ substantively: reconstruction, dependency-chain criticism, and hostile quantifier/boundary/symmetry attacks.
- Host evidence retains the complete unchanged packet, fixed identity-import admission, external case/run IDs, exact SOLVER stdin/schema and independently recomputable hashes. Review inputs bind the full retained solver attempt digest while carrying only solver-authored mathematics, avoiding host-envelope duplication. Both reviewer inputs are retained in ledger-6 reports.
- Pure read admission requires externally supplied actual caseId/runId; recomputes contract/attempt/ledger/envelope/input hashes, retained stdin/schema hashes and byte counts; compares renderer-v1 semantics; and checks requested model, coherent actual usage and all three distinct contexts. It neither dispatches nor prepares work on GET. The new module's static source construction does not call frozen TIP-063 formatter/preparer/checker exports.
- Ledger 6 has compact evidence refs, exact role inputs, all findings and a fixed host audit summary. Grounded contiguous quotes, supportive gap-free PARTIAL reviews, non-INCONCLUSIVE solver and all conditional feedback are necessary for AI_REVIEWED/PARTIAL. Missing/malformed bindings refuse; honest uncertainty, ungrounded quotes, challenges or unresolved gaps downgrade to INCONCLUSIVE; explicit rejection remains REJECTED. No schema or agreement establishes theorem truth.
- The unchanged debt list remains visible. GLOBAL_LOWER is OPEN and NOT_USED_IN_FINITE_BRIDGE. Global14/15 LRC, formal proof, fresh forest replay, external acceptance and novelty are not established. The frozen packet's UNEXECUTED statement remains a publication-time snapshot, with prospective consumption stored separately.

## Bounds and compatibility controls

Whole prepared input including escaped stdin, external schema and metadata is capped at 49,152 UTF-8 bytes. Solver aggregate mathematical output is capped at 16,384; role feedback at 8,192; finding reason at 256 characters; feedback summary at 1,024 characters; host audit summary at 32,768; host evidence envelope at 65,536. No truncation or larger implicit fallback is used. These Core guards do not implement the Driver's runtime timeout/dispatch limits.

The renderer-v1 mandate and output-schema registry is part of durable semantics and must remain frozen after acceptance. Future renderer/schema changes require a new version and preserved old reader, not historical backfill. Retained stdin/schema bytes are hashed directly, not inferred from prompt labels.

New tests pin all four pre-change fixed contract digests and a pre-change legacy attempt digest. Five version1–5 ledger controls assert canonical parsed bytes and digest remain identical to their raw old shapes, with no prospective defaults. Adjacent historical suites supply further behavioral compatibility checks.

## Offline verification

On 2026-10-04 at 11:50:50 local time, eight focused/adjacent suites passed **254/254** (763ms Vitest duration): new Core50, frozen063 Core54, frozen063 audit61, campaign45, campaign integration/adapters32, and math-pilot/agent-review12. `npx tsc --noEmit` exited0; scoped ESLint on all five owned source/test files exited0.

Earlier frozen063 UI regression check plus Core45 passed70/70 after removing the new module's top-level call to the old formatter; no frozen test or product file was changed. Three initial mutation controls mistakenly repaired their own targeted corrupted hashes, one freeze check examined a schema-parsed copy, and one escaping fixture exceeded solver output before reaching input overflow. Those test constructions were repaired without weakening product limits. Early whole-type checks reported only concurrent Driver fixture errors; the final whole-type check above passed.

NOT_RUN: provider/model calls, DB operations, environment changes, browser/geometry checks, server/build/install/Git actions, standalone scalar-checker invocation, forest execution or semantic archive replay. Historical scalar controls executed only inside the explicitly activated frozen063 offline unit suite listed above; no product/GET path invoked them. Driver/UI integration and live observation are not claimed by this report.

## Trust limitations

Hashes, canonical checks and trusted row IDs reject substitutions and inconsistent/coherently rehashed mutations tested here. They are not cryptographic authenticity against a malicious host or DB that fabricates every field, usage count, context ID and hash. File identity admission does not attest fresh semantic execution or completeness. Contiguous quotes bind review text to the solver argument but do not prove that criticism is mathematically sound. AI conditional agreement leaves retained unsigned premises and global obligations open.
