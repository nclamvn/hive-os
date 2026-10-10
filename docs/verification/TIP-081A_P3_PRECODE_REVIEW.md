# P3 pre-code contract review / source release

2026-10-08 · Main, independent Front and Back.

Owner directly approved P3 revision2 synthetic-only controls/implementation and
<=25000ms incremental effects, no resource reset. Main froze six public arities,
11-field wire/9-field site/14-field historical ledger,27-field metadata/max32
emissions, declaration/visit/decoder limits, cost conventions and five replay
allocation policy families in TIP-081A_P3_FROZEN_CONTRACT.md.

Front complete revised-contract review DESIGN_CLEAR. Back identified missing
cumulative metadata-emission bound; Main repaired to32 prepaid emissions of12816
logical bytes each (410112 total), counted verify/observe with exhaustion disposal.
Back reread complete contract+repairs and returned DESIGN_CLEAR. Six operations
are not mislabelled four; R311 has a reviewed fixed private fault-derivative route,
not phase-only R310 or a public fault flag. Shared grammar/allocator remains OPEN.

Builder source implementation is now released under the frozen contract. No
derivation/import/hash/test effects are released by this design review. Before
effects: review all concrete source-derived initialization/frame counts, helper
graph, per-reserve family/cost mapping, escrow consumption/transitions, roots and
closures, output/decode/hash representations and literal/adversarial fixtures.
Complete first source cuts must precede execution. All36 controls are UNRUN.

Resource start867323.494582/900000ms, remaining32676.505418ms; incremental<=25000ms
including allowances; no effect spent yet. P2/source/real/math gates unchanged.
