# TIP-044 independent skeptical review

2026-10-03. **PASS within the frozen proof/control scope; no blocking finding.**
All five acceptance criteria are satisfied at this review boundary. This is
not a proof of Erdős–Straus, a new solution discovery, novelty certification,
formal/expert review, or product/agent/browser acceptance.

## Scope, instructions and chronology

Read AGENTS, the durable handoff including TIP043, Vibecode Kit v6.2 and the
entire frozen TIP044 contract before validation. The contract SHA is
`2e7bd3aba80bcc5a9bc3e747f4cf8b85be25aad22c4cc42e71ec8036349896c7`,
frozen at 2026-10-03 01:42:35 UTC. The theoretical hypotheses and named
outcomes were already known; this registers validation, not blinded discovery.
The PDF skill was read before inspecting published mathematical statements.

Reviewed the complete Main research note, A completion report, B completion
report including its full executable Python, and the current Main verification
report. Only this report was written, through apply_patch. No product/test,
prior source/report, manifest/handoff, DB, provider, queue, worker, UI, Git or
dependency changes. No 180-row campaign, larger shift menu or new root input.
The skeptical context is separate, but shares host and model family with the
other contexts; it is not external mathematical or different-model independence.

## Acceptance accounting

| Criterion | Independent review / evidence | Verdict |
|---|---|---|
| AC1 / REQ-044-1 | Infinite progression proof, available-budget quantifier, distinct sharper CRT family, full-support positive control | PASS, mechanism-specific only |
| AC2 / REQ-044-2 | Classical exponent arithmetic, fixed versus moving q, coherent quotient-size necessity, paid-order countercontrol | PASS, no impossibility shortcut |
| AC3 / REQ-044-3 | Type I integrality/strictness/identity/allocation, classical source match, prime-T taxonomy, unrealized modular-root control | PASS, sufficient branch only |
| AC4 / REQ-044-4 | Independent in-memory arithmetic, fresh byte-pinned Python replay, three tighter-envelope failures | PASS, known proof controls only |
| AC5 / REQ-044-5 | Complete report reads, 54 old pins and 86 manifest entries independently verified; Main documentation/health checks attributed below | PASS at local documentation boundary |

## 1. Infinite obstruction: what is actually excluded

For prime p congruent to 2521 modulo 9240, p is 1 modulo 840 and 2 modulo
11. The primes 2,3,5,7 are quadratic residues modulo p, while reciprocity
gives (11/p)=(p/11)=-1. Every positive integer below 11 factors over those
four smaller primes, so the least positive nonresidue is 11.

If prime h is 3 modulo 4 and 11 divides T=(p+h)/4, then h is 9 modulo 11
and (11/h)=-1. Since h-1 is twice an odd integer, the full order D of 11
is even and 2 modulo 4. The smallest absolute exponent producing -1 is
D/2. An available signed budget 1<=e<=4 can therefore hit only when
D is 2 or 6. In these cases h divides 12 or 1332=4*9*37 respectively.
Their only prime divisor 3 modulo 4 is 3, incompatible with h=9 modulo 11.

This excludes only the signed single-11 mechanism with at most four actual
or deliberately allocated copies. Forcing 11^4 to divide T does NOT cap its
actual valuation. More copies, other factors, other shifts, paid quotient
corrections and Type I remain outside the conclusion. In particular the
registered p2521/h31 full-support Type II certificate is retained.

The second family is genuinely different: p=41161 modulo 101640 implies
p=21 modulo 484 and p=1 modulo 840, hence p=10, not 2, modulo 11.
Its least nonresidue is again 11. The least positive prime in the class
h=-p modulo 44 is 23, and T=(p+23)/4 is 11 modulo 121. Thus actual v11(T)=1;
the legal image {1,11,21} modulo 23 omits 22. Both progression constants are
coprime to their moduli, so Dirichlet supplies infinitely many prime roots.
The finite samples are not the proof of infinity.

The reduced-progression hypothesis was checked against
[Dirichlet Theorem 18.1 in Sutherland's MIT notes](https://math.mit.edu/classes/18.785/2019fa/LectureNotes18.pdf).
This review checks the statement and its application, not a new proof of
Dirichlet's theorem.

## 2. Analytic guarantee and root/quotient distinction

For moving least-nonresidue q<=C p^alpha, forcing q^e|T uses the reduced
class h=-p modulo 4q^e. A Linnik bound with exponent lambda gives
h<=C_e p^(alpha*lambda*e), for fixed e. With alpha=.16 and lambda=5.2
the exponent is .832e. At e1 this yields eventual h<p. At e2 the exponent
1.664 fails that unknown-constant uniform guarantee; it does NOT establish
absence of smaller primes. Even an exponent of 1 would need a suitable
constant to establish h<p. For fixed q and e there are only finitely many
reduced classes, whose least primes have a fixed finite maximum.

I checked the least-nonresidue statement in
[Banks–Guo v1, introduction (1.1)](https://arxiv.org/html/1511.05523v1)
and the published least-prime exponent 5.18 in
[Xylouris, Theorem 1.1, page 66](https://www.impan.pl/shop/publication/transaction/download/product/83078).
Weakening to .16 and 5.2 preserves the stated implication. No effective
numerical cutoff, GRH extension or independent replay of these analytic proofs
is claimed.

For coherent inert cosets, each inert prime factor is a root nonresidue and
is at least the root's least nonresidue q0. Therefore q0^E<=T, where E is
the total actual inert valuation. The projected target requires E>=d/2,
so q0^(d/2)<=T<p/2 is necessary. Here d is the anchor's QUOTIENT order,
not q0's full order; q0 need not itself divide T. This is not a certificate
of sufficient correction supply.

The p401/h31 control disproves full-order pruning: actual ord31(3)=30,
but allocated 2^2 support pays the subgroup {1,2,4,8,16}. The quotient order
of 3 is 6; exponent 3 and correction 8 produce -1. A generated subgroup
without actual signed-box coverage would not pay this lift.

## 3. Type I: actual divisor realization is essential

Under the contract's prime p,h hypotheses and h<p, assume positive ad|T
and h|4a^2d+1. Set c=T/(ad), v=(4a^2d+1)/h and b=cv-a. Algebra gives
hb=pa+c, proving b integral and b>a>0. Also c<=T<p/2<ap. Hence
T=acd<bcd<abdp. The identity 4abcd=p(a+b)+c gives
4/p=1/(acd)+1/(bcd)+1/(abdp). Since a,c,d<p and hb=pa+c, p divides none
of a,b,c,d, so exactly the last denominator is p-divisible.

This matches the classical parametrization in
[Elsholtz–Tao v6, Proposition 2.3 and equations (2.6)–(2.8)](https://arxiv.org/html/1107.1010v6).
It is a specialization and direct algebraic verification, not a new construction
or claim that all Type I representations have this first denominator.

For factor budgets, alpha_i+delta_i<=e_i is required by ad|T. The coefficient
2alpha_i+delta_i in the congruence squares a algebraically; it does not allocate
the same valuation twice. The congruence requires inert d, and inert d makes
-1/(4d) a square modulo h. But an actual divisor a|T/d must realize that
root. At p61/h7/T17, d17 has modular roots a=2,5, whereas the available
divisor a is only 1. This is a concrete countercontrol to a free norm lift.

For prime T=r and h>3, the three allocations (1,1),(r,1),(1,r) reduce this
norm branch to 4r=-1 modulo h. The restricted coprime Type II box instead
hits exactly when r=-1 modulo h. Both conditions would force h|3, excluded.
These two branch criteria are disjoint, not exhaustive root solvability tests.

I also read the statement-level distinction in
[Chamberland, Integers 26 A42, Theorem 1 and Conjecture 2](https://math.colgate.edu/~integers/aa42/aa42.pdf):
its Type II equivalence does not turn the universal existence conjecture into
an established theorem. Pollack's prime-nonresidue supply results do not by
themselves make those primes divisors of a moving T. Withdrawn arXiv
2609.09204v2 is excluded as authority. This is targeted primary-source
matching, not exhaustive novelty clearance.

## 4. Actual independent controls and source replay

My in-memory installed-Node arithmetic imported no builder implementation,
factor tables or retained outcomes. Fresh trial primality checked all 202
registered integers. Modular power/order, exact divisor allocation and BigInt
cleared identities were independently implemented under 60 seconds / 5M
logical work / 64KiB, without writing a script artifact.

Final independent result: COMPLETE, 143115 work, 7.7125ms observed through
summary generation. Its summary was bounded well below 64KiB. Record digest
`fb2aae37bcaaf379211ef4088c52d7de16d29b49efc2584ff2f1361003132602`.
This is my schema's fingerprint, not an equal digest to differently shaped A/B
records. Common facts agree:

- 36 primes / 65 composites in the first progression; 31 / 70 in the second.
  All 67 prime roots have least nonresidue 11. Second-family prime roots all
  satisfy h23, actual v11(T)=1 and the single-atom miss.
- All 15 prescribed shift primes and all 60 budgets were tested. Four hits,
  all at incompatible h3; only h31 is compatible in this finite set and its
  four budgets miss. No incompatible positive row was concealed.
- Four required strict tuples pass positivity, exact identity and prescribed
  p-divisibility counts: (5,10,130), (41,942,38622), (108,1604,10827),
  (638,55462,804199), with counts 1,2,2,2 respectively. The p61 named branch
  miss and p401 full/quotient order distinction agree.

I then extracted the terminating-LF Python source from B's frozen report and
verified its SHA:
`c1d33f1fbed52bb8a33df3de4fd8322100bcc07b82b1a7dde51bfc9a2876e6e8`.
Fresh execution used env-i, PATH=/usr/bin:/bin, python3 -I -S -B. It exited 0,
COMPLETE, 81191 work, 29ms, exactly 11608 stdout bytes matching declared
bytes; no terminating newline. Scientific digest:
`96538c53b9584bfbc31b4353212074f8ae9d6b6baf3fb53d787a975469e01354`.
Fresh branch counts agree with A: (1,0),(0,0),(0,1),(2,1),(1,1). Two p401
Type I allocations yield the same tuple, not two distinct solutions.

I independently injected the three tighter constants into the extracted
in-memory source: work1 -> WORK_LIMIT/work1; seconds0 -> TIME_LIMIT/work0;
bytes100 -> FINAL_ENVELOPE_LIMIT/work81191. All exited 1 with INCOMPLETE,
never COMPLETE. These are resource fault controls, not research counterexamples.
No failed run was treated as an authoritative completed prefix.

Failure history is retained. My first Node command had a shell-newline parse
error before work. The next draft normalized a negative JavaScript remainder
incorrectly and reached the unchanged 5M-work guard; correcting the exponent
normalization alone produced the final independent completion. A separate
stdout-summary parser later had an extra closing parenthesis, causing a
consumer SyntaxError and broken pipe; it was corrected and the fresh replay
above repeated successfully. None changed registered inputs, claims or caps.
B's initial second-family pmod11=2 assertion failed closed and was corrected
to 10. The clean Python environment emitted a Darwin temp-directory warning
on stderr; stdout/exit/arithmetic remained correct.

Logical loop counters differ between contexts and do not measure comparative
model efficiency. Native gcd/BigInt/hash/JSON/OS operations are not CPU-attested;
deadline checkpoints are not hard preemption or an OS-write deadline. Successful
byte-pinned replay is local source identity, not a signed receipt or formal proof.

## 5. Preservation, reviewed pins and technical attribution

Independently reconstructed 54 unique source/test pins from the eight Main
TIP036–043 verification reports: all 54 current byte hashes match, zero
conflicts. Independently ran current-manifest verification: all 86 entries
pass. Current manifest SHA:
`23550c673a88c96046a259fe309d8c3c2046c0817629f4a375a7acee09395bf1`.
Founding manifest current SHA is
`2a2dafa24464338de9c60091cd039ea2705537a670ec6b4e49a9b0a196f8c4b4`.
Main attributes its exact HEAD-byte preservation and old-line preservation;
I did not execute Git or claim the archived founding paths freshly all exist.

Fully reviewed frozen documents:

| Document | SHA256 |
|---|---|
| A completion | `0e5584558a051039c55c12bb78097e9b540df47e5b5c2d20fdd9756bd2fae84b` |
| B completion | `96e86fb64250c3fb9f9db66d594ec6044aebb88294c158ad798c5dabf34e2e49` |
| Main research note | `491d42c7d4633306fb4bb46224a537b02a1f10b1d8d0bf12bc53d631eccdad04` |

Main reports fresh installed TypeScript and full ESLint exit 0, six research
display formulas passing installed KaTeX, and A reports four completion-display
formulas parsing. These are attributed technical checks, not my product tests.
TIP043's 827-test full-suite success is historical; no fresh unit/integration,
build or browser/model E2E is claimed for this documentation-only slice.
Main owns final verification/handoff closure. No source/runtime integration
or privileged mutation is authorized by this report.

The final Main-note section 6 documentation-only closure was reread: it now
records the agreed counts, actual fail-closed injections and attributed
typecheck/lint outcomes. No mathematical claim changed; the table pins that
final note rather than its earlier reviewed snapshot. No arithmetic rerun.

## Scoped conclusion / remaining research obligation

No blocking proof, source, arithmetic or quantified-scope defect remains in
the frozen TIP044 package. The infinite narrow-mechanism obstruction is useful
direction control, and the Type I pivot is correctly classical. Neither is a
new solution to the original problem.

The next substantive obligation is root-coupled ACTUAL divisor realization
for the Type I norm congruence, or an ACTUALLY paid target correction for Type II.
An unrelated supply of nonresidue primes, a generated subgroup, a modular
square root or a larger finite menu does not supply that missing implication.
Universal root existence, novelty clearance, formal/external review, governed
agent/UI admission, uncontaminated equal-budget live-model evaluation and
product E2E remain deferred. Original Erdős242: **NOT_ESTABLISHED**.
