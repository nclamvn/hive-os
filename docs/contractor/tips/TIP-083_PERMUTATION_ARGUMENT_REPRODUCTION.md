# TIP-083 — one short permutation argument reproduction

2026-10-09 · PERMUTATION_ARGUMENT_REPRODUCTION_083 · REPRODUCTION.
Owner directly approved the immediately preceding proposal: complete the general
permutation argument, independent agent critique, finite supporting tests, <=20
minutes, Codex only/no paid API/no new infrastructure. Start05:56:57UTC,
deadline06:16:57UTC. Predecessor LEAN_RESEARCH_DEVELOPMENT_082 is closed; R3 remains
deferred/unaccepted/frozen with its original attempts and budget unchanged.

## Exact output

For a uniform permutation sigma on n letters, define F(empty)=empty and
F(L m R)=F(L)F(R)m at the maximum m. Prove for EVERY integer n>=1 that the
expected number of inverse adjacent-value descents of F(sigma) is
X_n=(n+1)/2-H_n. Supply the structural lemma, probability count, boundary cases
and numerical specialization n=10^12. This is the existing known public Epoch
Tier2 sample, not a blind benchmark or discovery. The source/answer/short solution
are public and Main has read them; no fresh-capability or originality claim.

## Minimal work and acceptance

Solver derives a complete argument; a separate-context critic checks it and
re-derives the fragile steps. Main verifies the resulting argument and reuses
existing tiny exhaustive/rational controls. Store the proof and critique in ONE
completion document; no review stack, application changes or generated tooling.

- A1: prove the order criterion for arbitrary distinct positive letters a<b.
- A2: justify uniform relative-order restriction, oriented adjacency count,
  linearity and the harmonic sum; do not assume F(sigma) is uniform.
- A3: handle n=1,2 and i=n-1; justify strict bounds giving the numerical floor.
- A4: independent non-formal review identifies concrete gaps or supports the
  corrected argument; finite tests are supporting evidence only.

Permitted: source lookup, mathematical reasoning/critique, existing
`npm run research:check` once (<=120s), document edits. No provider API, database,
browser/build/install, Lean installation, product source repair, R3 import/A/B,
Git mutation or other mathematical target. Stop with the argument or exact gap
by deadline; no automatic campaign. Formal proof, novelty and official score
remain NOT_ESTABLISHED. Skill process reduced to this TIP + one proof/completion.
