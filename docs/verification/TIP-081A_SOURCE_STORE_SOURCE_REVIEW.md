# TIP-081A — Source-store source review
2026-10-07. SAME081D8; reviewed implementation seam, not mathematical closure.

Main fully read final modules and tests. Independent peer studio081_independent_review returned FINAL CLEAR after reading/hash-checking all four files and the SS17 repair. Builders did not execute checks; Main owns effectful verification.

Frozen final cut:
- scripts/test/store-tip081-inventory-source.mjs: 3197e77e78d561f18c00b3443b23f0807581b06ca11b9258e07bf76f3c232069 (15214 bytes)
- tests/unit/evidence-studio-source-store.test.ts: 7c6ebcff039499cfbfc52edf9043670c955b98941fe625aca1bc7edd0f88f62a (17150 bytes)
- scripts/test/verify-tip081-inventory-source.mjs: 52cfda3af018b59db9b3d11582567a200d8357d0557e12d59fa8720082360bca (22118 bytes)
- tests/unit/evidence-studio-source-store-verifier.test.ts: 110957091768304eb6ebc728ae7a75d29e8d7f11a74abbdb26a02b2c114b7b02 (11211 bytes)

D1: lexical acquire→frozen independent verify→metadata return has no acquired key/body Map/Buffer/closure reference retained in the source owner. Metadata remains historical, original retainedBodyCopies:1 unchanged. New PRIVATE_METADATA_ONLY view correctly describes reachable payload zero only after creation stage. No claim of immediate GC/RSS or external alias accounting.
D2: whole creation metadata/entries/policies/digests preserved; new opaque brands cannot become original acquisition/manifest authority. Creation verification is historical, selected freshness separately scoped.
D3: global owner/lease gates, pre-reserved exact expected source size; guarded stat plus expected FD fstat BEFORE full allocation, bounded reads/EOF/rechecks/hash of same private bytes before fatal UTF8 decode. No source execution/callback/full body/text escape. Dedicated chunk copies use captured allocation/copy intrinsics. Cleanup remains possible after expiry.
D4: independently replicated M/3M/8M+4096-per-row control/chunk/decoder convention; source Buffer + decoded text counted while verifier reconstructs metadata and streams fresh file. No frozen verifier caller-envelope fiction: old full verification finishes first. Conservative worst decoding may refuse a source whose exact decoding would fit; not an impossibility theorem.
D5: independent UTF8 DFA/hash/literal accounting and current selected-source filesystem hash; current whole-universe freshness not asserted. Own clock before/after authentication plus trusted deadline mapping corrected before initial check cut.
D6: 17 producer and12 verifier controls; normal synthetic regression/lint/type only. Initial SS17 whole-file join ban falsely matched legitimate path.join. Initial four-file cut and401/402 logs retained; test-only repair asserts exact measurePrivate→readInventorySourceLease boundaries, bans array join there, preserves global Buffer.concat/pieces.push and all other guards. Product modules unchanged.

Shared assumptions: trusted canonical module instance and controlled consumers; original root/path/hash helpers; ordinary check/recheck same-UID filesystem races, not atomic openat isolation; logical UTF16/control convention, not host-intrinsics/RSS certification. Unrelated sources can change after creation; SV10 explicitly does not promote historical union into fresh global proof.

Scope remains: actual fixed-root source-store NOT_RUN; parser/AST/traversal/resolution NOT_IMPLEMENTED/UNRUN; caller whole-graph/runtime OPEN/NOT_ACCEPTED; existing62 obligations unchanged. Previous truncated full plan remains unavailable, not recreated. No build/browser/server/DB/API/model/Git/materialization/publication/math effect.
