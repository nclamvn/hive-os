# Aggregate odd blocks and certified square-core slice

2026-10-01. Exact target-sensitive local diagnostics, not a conjecture solution,
novelty claim, formal theorem or retained agent event. The existing live V2
cycle and its rejected task are unchanged. No new model/paid API call ran.

## 1. A larger window, with its actual restriction

Let m=2^a q, a>=1, q>=3 odd, s=4m-1. Permit only the coprime normalized
pairs obtained from ratios 2^f q^g, f in[-a,a], g in{-1,0,1}. Composite q is
allowed, but its proper prime divisors are NOT separate blocks. Since
q=2^(-(a+2)) mod s, the three intervals merge exactly:

$$R_s^{\mathrm{block}}=\{-2^t\pmod s:\ |t|\le2a+2\}.$$

The four-case minimum proof in MATH_PILOT_TWO_CORE_TARGET uses only q odd
and q>=3, not primality. It therefore proves minR>=3*2^a-1 here too. Fixed
target eligibility is exactly s|(p+2^j) or s|(2^j p+1), j0..2a+2, with
2^a<=(p+1)/3. TIP-033E reuses D's certified complete factor tables, including
all composite candidate q that D correctly rejected in its PRIME-ONLY scope.
No factorization or D output was silently broadened.

Both checkers revalidate all1185 Lucas nodes,388 criterion entries and54 q
decisions. TS uses signed whole-block vectors; Python separately enumerates
integer pairs with odd parts only1/q, after running the pinned D Python
certificate verifier. Independence is implementation-level, not foundations.

| Target p | Eligible cores (a,q,s) | Composite-q cores | Distinct canonical tuples | Added vs D |
|---:|---:|---:|---:|---:|
|131433121|13|11|7|5|
|159727681|10|8|7|5|
|351121|14|6|11|4|
|171348241|18|15|15|12|
|Total|55|40|40|26|

These count ONE canonical (A,u)-ordered strict representative per eligible
core, then deduplicate denominator tuples. They do not count every possible
solution. Completeness covers all a/s in this whole-block family at these
four targets only. The minimum s within this restricted family is respectively
143,1135,47,199, not a minimum-denominator or all-family optimality result.
Old witnesses already cover the root targets, so added tuples are NOT new
overall conjecture coverage.

Essential scope countercontrol: for p159727681, m198=2*99 and s791,
the whole-q99 family misses. The full normalized pair A3,u11,v605794,k6
does hit and gives strict denominators

$$39982404,\quad31626080838,\quad1741717274106852.$$

E explicitly excludes that core; using 3/11 as partial blocks of99 would
falsely expand its claim. This control is now a regression.

## 2. Square odd-prime cores: necessary candidates versus true hits

TIP-033F scope was declared before discovery: same FOUR targets, b=2,
a=1..4, ell odd prime; NO ell or s ceiling. Higher a/b are UNCOMPUTED.
For m=2^a ell^2 and C=2^(a+2), the full normalized image is

$$R_s=\{-2^t:\ |t|\le2a+2\}
\cup\{-\ell2^t:\ -a\le t\le2a+2\}\pmod s.$$

The g=-2,0,2 signed windows give the first set; g=-1,1 give the second,
using ell^2=C^-1 mod s. Squaring the second-window target congruence gives
necessary divisors of C*p^2-2^(2t) for t>=0, and C*(2^j*p)^2-1 for t=-j<0.
Every divisor must still satisfy s+1=C*ell^2, certified ell primality,
the ORIGINAL coprime pair condition and separate strict Type II checks.

Exact BigInt bound now has a reusable tested implementation:

$$m\le\left\lfloor\frac{T_0(T_0+1)}{4T_0-p}\right\rfloor,
\quad T_0=\lfloor p/4\rfloor+1.$$

The earlier written proof's strict-negative wording was corrected to
nonpositive at p2; the formula and residual constants are unchanged. This
bound limits a family; it does not certify the still-uncomputed search.

F artifact is COMPLETE for all16 declared target/exponent rows, with
256 criterion entries,1399 certified prime nodes and11 target-ell decisions.
Of25 candidate (a,s,ell) rows:16 violate the finite bound,6 miss the original
congruence,1 has composite ell9, and2 are strict hits:

| p | a | ell | s | Strict denominators |
|---:|---:|---:|---:|---|
|131433121|2|3|143|33088059,4731592356,1932829716534284|
|171348241|1|5|199|43052325,8567412050,590155212776826|

Both hits already occur in E; this slice adds no translated-only rescue.
p159727681 and p351121 miss this b2/a1..4 slice, NOT the whole b2 family
or the root problem. Original-congruence misses include p159 at s399/s1599.

A separate prime/residual control p109201, a1,ell3,m18,s71 satisfies
71|8p^2-1 and s+1=8*3^2 but has NO original normalized pair. It demonstrates
why raised roots cannot be accepted directly. Independent trial division and
both implementations reject it; its finite bound passes, so a bound-only
filter would not repair this error.

## Reproduction and provenance

```text
node --import tsx scripts/operations/aggregate-odd-core-audit.ts
node --import tsx scripts/operations/square-core-audit.ts
```

Fixed isolated replay: Python -I -S -B,30s,256KiB output, allowlisted
environment. E generic semantic verification does NOT assert byte provenance:
it reports the expected D pin but null actual source digest. Only the fixed
hash-checked loader binds the actual digest. F similarly separates generic
certificate validity from its fixed byte-checked loader.

```text
Unchanged D artifact ae5abacaddd6027e5875ded6db0448899efeae6f1e977355330a7b26b767a040
E Python source 92e916acd4981c82cc676508ac76a261d7a41a1f8f30a0ed98cd52f222d40a92
E decision/output 1e69acb42c9417ed4ad1ee9c25f98f49b26db0180d8b1e8b9f4bd210d24e4f79
F artifact c20ab868ceceee139a7319c5d8ec3b11c953fc6136677565ef9b5184b537cff2
F Python source ca888f9de3a179d34c086113c1bae3b17fda3c21789ac22e9f842c8b83e20eae
F decision/output 68371829e82b7e8b00df4597be13721a56248d43abfc49e3388766bd1696a141
```

## Literature boundary and next task

The divisor/Type I-II foundation is established, not newly invented here:
[Elsholtz–Tao](https://arxiv.org/abs/1107.1010) study solution counts;
[Bello-Hernández–Benito–Fernández](https://arxiv.org/abs/2606.10922) explicitly
compare divisor parametrization with known Type I/II descriptions. The public
author-owned [signed-box note](https://github.com/chasebryan/centl/blob/main/research/erdos-straus/ES-TWO-TARGET-SIGNED-BOX-EQUIVALENCE.md)
also discusses finite multiplicative boxes and does not claim universal target
hitting. These are background comparisons, not expert validation of E/F;
the two abstracts and the signed-box page do not establish literature priority.

Next useful agent task: a NEW typed, target-bound exact core-slice plan with
certified scope and unresolved-state admission, before source/verifier/solver
classification. Preserve the s791 full-pair control, false raised roots, the
old rejection and byte-bound history. Then extend translated slices under a
new explicit resource/scope contract. Do not repeat the rejected unrelated
first-denominator survey, silently expand E/F, or treat finite misses as a
universal escape/exclusion theorem. This evidence has NOT yet been retained
in a live cycle, and the previous full-history UI performance gap is untouched.
