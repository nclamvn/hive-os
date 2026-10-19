# TIP-064 independent Core review

Reviewer: Driver Builder, independent of Core ownership. Result: PASS_OFFLINE; no remaining consequential Core finding at this source freeze. Contractor aggregate acceptance and any live readiness/observation remain separate. This review authorizes no live action.

Authority: sealed TIP SHA-256 `08bb5e527c43c5890bb02a5cbf1a7585d08409c5b20e1a2b5b0d8c571e09f23a` and incorporated proposal `119e545a027c43bba63a320ffdd189659a90585d1d8679105eb7c3310bbf52b1`. Vibecode Kit's independent verification separation was applied; the reviewer edited only this new review artifact and no Core product/test file.

## Exact reviewed freeze

All five Core product/test files and the completion report were read; their SHA-256 pins matched the declared freeze.

| File | SHA-256 |
| --- | --- |
| `src/modules/research-sandbox/math-lrc-proof-unit-live.ts` | `efc369abcefded7b0dda0ef38b22631e97ba7334c2ec969ab7e78636d939ea16` |
| `src/modules/research-sandbox/math-pilot.ts` | `b0935868eb848879e1b2f759fcfa51b8b706a7f4a70140fe465e37c95e674a89` |
| `src/modules/research-sandbox/contracts.ts` | `7a8302db375f75e3faef2f0cd7f79662b6826b12b99f9127443fa26de7be4e2d` |
| `src/modules/research-sandbox/agent-review.ts` | `0241a135aeb2caa2f249467f4d94fc346cd5928c84e234176dd7eab599b0916a` |
| `tests/unit/math-lrc-proof-unit-live.test.ts` | `b359d2347d38f5ba59551d2c33c3ff8cf7fd5b43954413429884435bf16f751d` |
| `docs/verification/TIP-064_CORE_COMPLETION.md` | `8aa4c5a9575169287421141445277b0a7d7e97cd634d713000d3b064e2deffd3` |

Driver integration baseline used for source inspection is completion SHA `84f1afd634dec5dcbf35952d54992bdb704b300d01b5410ff9849634577db166`, with its19 frozen product/test pins. Its independent review is separately owned by Core.

Report-only supersession: Core clarified its no-standalone-checker wording and recorded the historical scalar-only unit controls. Its completion pin above supersedes the initially reviewed `5c8b4442b9b1cbe52b48e03c6a5b691cc97cb2847e62c3a6f6930fc8c7dc8e50`; the five Core product/test pins and verification results are unchanged. The revised report was reread and its new hash checked; no product retest was required for this prose-only clarification.

## Findings and admission checks

- R1: the explicit prospective request resolves a fixed version3 contract with separate proof-unit scope, stored as existing OPEN case type. Legacy version1/2 contracts reject mixed proof-family markers, including undefined-presence controls; old fixed contract and attempt digests are golden-tested. No schema migration or historical default/backfill appears.
- R2: the new dependency-safe module never imports the old063 offline callback/checker or calls its prompt/preparation hook on import/GET. A fixed source-data string transports the complete unchanged packet. Role-specific exact stdin/schema and metadata are retained; full canonical prepared bytes are capped49152, including JSON escaping, rather than merely measuring packet or argument. Reviewer payload carries solver mathematics once, binds the full retained attempt digest, and does not duplicate the full host evidence envelope.
- R2/R4: strict model-only schemas reject host evidence/input/provider/thread/usage fields. Every six premise and eight step IDs must occur exactly once; duplicate/missing/global-status promotion controls fail. Feedback8192, solver aggregate16384 and audit-summary32768 byte limits are independent; no truncate/fallback path appears. Persistent attempt admission requires paired host evidence/findings even though the transient parser accepts mathematical feedback before trusted worker attachment.
- R3/R4: evaluation and passive read admission require external actual case/run IDs rather than deriving trust solely from model/retained envelopes. Fixed contract, packet/evidence/source/input/prompt/schema/attempt/ledger hashes are recomputed and exact immutable renderer-v1 content checked. Coherently rehashed semantic substitutions, foreign IDs/model, invalid usage, reused contexts, missing bindings and v5 downgrade refuse. Actual accounting remains a host observation, not mathematical feedback or cryptographic authenticity.
- R4: new ledger6 requires prospective-only evidence and ordered critic/adversary inputs/model provenance. Conditional support with grounded contiguous quotes and no gaps can produce only PARTIAL; solver uncertainty, reviewer challenges/gaps or ungrounded quotes remain INCONCLUSIVE. Rejection is retained. The summary preserves all frozen debts, marks GLOBAL_LOWER OPEN/unused by the finite bridge, and does not establish global14/15 LRC, fresh forest replay, formal proof, novelty or human/external acceptance.
- R6: legacy ledger1–5 parsed canonical bytes/digests preserve absent new fields; old review lanes reject prospective fields. Frozen063 packet/module/audit are not edited, and its UNEXECUTED/no-provider-consumption text is explicitly treated as a publication-time snapshot rather than rewritten as a live attestation.

No consequential Core defect was found. The renderer-v1 mandate/schema registry must remain versioned and preserved when dependencies/templates change; future code must not silently reinterpret retained historical inputs.

## Independently executed offline evidence

On2026-10-04 at12:39:48 local, **254/254 tests passed in8 suites,2.62s**: Core new50 plus historical/adjacent204. Command:

```sh
npx vitest run tests/unit/math-lrc-proof-unit-live.test.ts tests/unit/math-lrc-proof-unit.test.ts tests/unit/research-lrc-proof-unit-audit.test.ts tests/unit/math-lrc-campaign.test.ts tests/unit/math-lrc-campaign-integration.test.ts tests/unit/math-lrc-campaign-adapters.test.ts tests/unit/math-pilot.test.ts tests/unit/math-agent-review.test.ts --maxWorkers=1
```

Whole `npx tsc --noEmit --incremental false` exited0 at the final Driver/Core source baseline. Independent scoped ESLint on the five Core product/test files exited0 with zero warnings. Historical scalar-only controls ran solely within their explicit offline test activation; no forest/full semantic replay, standalone checker, DB, provider/login, browser, server, build, installation, Git or environment-file operation was performed by this reviewer.

## Limits of this PASS

This verifies bounded schema/binding behavior and offline integration, not a theorem, live subscription protocol or browser geometry. Hash consistency and trusted external IDs are not authenticity against a malicious host fabricating all values. Identity-only admission remains unsigned/not fresh and does not attest semantic completeness. Grounded quotes do not establish the mathematical correctness of criticism. No reviewed schema can turn model agreement into formal or human acceptance. Main must still complete its independent engineering/readiness gates before the single prospective observation.
