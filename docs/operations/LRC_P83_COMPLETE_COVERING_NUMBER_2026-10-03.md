# Complete covering-number stage at p83

TIP056, fixed k13 moving speeds/14 runners. This closes a whole level-one
covering-number premise, not whole prime properness or LRC14/15.

## Definitions and full-domain reduction

Let C={1,...,41} represent nonzero residues modulo83 up to independent sign.
At threshold1/14 a class v blocks precisely
B_v={t∈C:14 min(tv mod83,83−tv mod83)<83}.
Because v is a unit modulo83, multiplication permutes folded classes. The
blocked magnitudes are1..5, so every B_v has exactly five elements. Equality
is good, not blocked. A multiset is witness-free at level1 iff its SUPPORT
covers C; multiplicities do not change this decision predicate.

Suppose a support S of s≤11 distinct classes covers C. Counting all5s
incidences, let P be the number of times covered exactly once. Every other
time has at least two incidences, so5s≥P+2(41−P), hence P≥82−5s. Every such
private time belongs to one class. Some class has at least ceil(P/s)≥3 private
times. A cover cannot be empty; no division-by-zero exception occurs.

Choose that class c. Multiply each speed by c^-1 modulo83 and each time by c,
then fold signs. Products, the blocking condition, incidence multiplicities
and private times are preserved. The selected class becomes1, with B1=1..5.
Choose any three of its private times: one of the ten triples in C(1..5,3).
Every other class avoids these three times. After selecting1, the uncovered
time set is6..41 and there are at most10 remaining classes. Therefore the ten
fixed decision roots cover EVERY hypothetical support of size≤11, not only
a selection of source-generated tuples.

## Complete decision recurrence

State (U,A,r) consists of uncovered times, available distinct classes, remaining
slots. U empty is a cover; any such leaf disproves the desired lower bound.
If r=0 or |U|>5r, no completion exists. Removing zero-gain classes preserves
the existence of a completion using AT MOST r classes: any zero-gain member
can simply be omitted. This is not a valid rule for enumerating every larger
support/multiset, and is not reused for the13-speed generator.

If union of available masks misses U, a completion is impossible. Otherwise
sum the r largest available gains |B_v∩U|; if below |U|, even ignoring overlap
no completion can cover U. These inequalities are upper bounds on possible
coverage, so the strict prune is sound.

Choose t∈U with fewest available covering classes, tie by least t. Its options
v1<...<vq are exhaustive: every completion must select at least one. Branch j
selects vj, excludes v1...vj from the future available set, removes B_vj from
U and decreases r by one. A completion lies in exactly the branch determined
by its least selected pivot-coverer. Thus the branches are disjoint and cover
all completions. Keep every child, including immediately pruned children.

Induction on remaining slots proves that an admitted tree with no COVER leaf
certifies nonexistence for its whole root. The private-time reduction then
certifies tau83≥12. The compact certificate verifier reconstructs every state
and branch; a leaf digest or aggregate node total alone is not a certificate.

## Upper bound and acceptance boundary

The support (1,6,8,10,11,13,17,19,21,23,25,38) contains12 distinct classes.
Computing and unioning its exact masks covers all41 times, proving tau83≤12.
Combined with the ten complete negative roots this proves tau83=12 in the
fixed modular covering problem, without invoking lower LRC or author code.
This is a reproduced finite prerequisite, not a new mathematical discovery.

The next generator can therefore restrict a support of size≤12 to size exactly
12, but it must still enumerate all required covers/extensions with proven
normalization and account for irredundant13-class covers. This certificate does
not establish that generator, any binary cascade or the full level14 terminals.
It does not certify J(13,83)=empty or close any whole61-prime global obligation.

## Provenance and implementation trust

[Allikvere v2 §4.1 and §5](https://arxiv.org/html/2609.02604v2) fixes the cover
problem and includes83 in the selected61-prime set. The independent proof
above uses direct incidence counting and a complete finite decision procedure.
[Zenodo record22066772](https://zenodo.org/records/22066772) metadata GET on
3Oct2026 is revision13, modified25Sep2026. Its declared174600959-byte archive
MD5 matches cached /private/tmp/hive-lrc14-audit.HA52Rz/fourteen-proof.zip:
9b6564895671a1d5e03d4ff21e124f7c; local SHA256 is
c9428bfe14fd15fe45a3eade1f49e0b0fc28bb3a3c206bd00235424f10b46cc6.
This checks archive identity, not the truth of its proof. No executable from
that archive is run. Its tau83 manifest count63986 is source-reported only;
the new ten normalized trees use a different complete search.

Pinned Python sets and pure TS bitmasks independently reconstruct the fixed
domain. Local unsigned receipts depend on trusted collectors/interpreters and
storage, not external or formal attestation. Old partial archive statements
and all old proof receipts remain immutable; later checksum work does not
rewrite their historical scope.
