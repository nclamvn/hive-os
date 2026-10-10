# Complete level-one generation at p83 — mathematical contract

Fixed p83, k13 moving speeds/14 total runners, strict bad threshold1/14.
The domain consists of ALL13-entry multisets in the41 nonzero residue classes
modulo83 folded by sign, modulo the folded unit action and permutations.
This is level one only, not eventual properness, cascade or terminal closure.
The accepted TIP056 certificate independently proves tau83=12.

## Exhaustive partition

Every witness-free13-multiset has support covering all41 time classes.
Its support has size at least12 by tau83=12 and at most13.

If its support has size12, exactly one support member occurs twice. Removing
one copy produces a distinct12-class cover. If its support has size13 but is
redundant, removing a removable member likewise produces a12-class cover.
If its support has size13 and no member is removable, it is an irredundant
distinct13-class cover. These cases exhaust the domain, including repeated
coordinates. Repeated folded residues are allowed even when the underlying
integer velocities are pairwise distinct.

Therefore generate every12-class cover orbit, extend EACH representative by
EVERY one of the41 classes (including its existing12 classes), and unite those
canonical13-multiset outputs with every irredundant13-class cover orbit.
The extension classes must not be restricted to new classes or positive gains.

All12 covers are irredundant: otherwise a<=11 cover contradicts TIP056.
For either distinct irredundant size s=12 or13, private-time incidence counting
gives P>=82-5s, hence a member has at least ceil(P/s)=2 private times.
Normalize that member c by speeds*c^-1 and times*c, folding signs. The member
becomes1 and its private pair belongs to B1={1,2,3,4,5}. All ten pairs are
mandatory roots. Other available classes avoid the pair; initially1 is selected,
U={6,...,41}, with s-1 slots. Different roots may duplicate solutions; retaining
only the canonical unit representative removes duplicates, not orbits.

## Minimal-cover enumeration, not decision pruning reuse

State tracks the selected distinct classes S, uncovered times U, available
classes A and remaining slots. Coverage multiplicities determine private times
for EVERY selected member, not just class1. If any selected member has no private
time, no future extension can restore it: adding masks only increases coverage.
Thus that branch cannot complete an irredundant cover. Likewise a newly selected
member with zero gain has no private time and is rejected for that reason.
This separately proved minimality rule is not the TIP056 decision-only rule.
It may be used for minimal12/irredundant13 enumeration, never unrestricted
13-support enumeration or the one-class extension step.

Empty U is a leaf. Admit it only at the exact target size with every selected
member still private; if fewer selected members already cover the domain,
adding any further class cannot make the enlarged cover irredundant. Nonempty U
with no slots, impossible capacity/union/top-gain or too few available classes
cannot complete the target. Every pruning inequality must be an upper bound
on possible completion, not an empirical test.

Choose an uncovered time with fewest eligible coverers, deterministically
breaking ties. Branch on EVERY eligible covering class in ascending order.
Branch j selects option j and excludes options1..j from further selection.
Every possible completion contains a pivot coverer and belongs to the branch
of its least selected option. This partitions completions without skipping
any; monotone minimality cannot eliminate a completion that is irredundant.
Induction on slots proves complete root enumeration. Private-pair normalization
then proves at least one representative of every required unit orbit occurs.

## Canonicalization and extensions

For a sorted folded multiset x, its canonical form is the lexicographic minimum
over ALL41 folded units g of sorted(fold83(g*x_i)). These41 classes represent
all82 units because multiplication by -1 is already folded. Units preserve
coverage, private incidences, distinctness and repeated-coordinate multiplicity.
Canonicalization must preserve all13 entries; a support set is not enough.

If a general13-multiset M contains12-cover C, choose unit g sending C to its
canonical representative C'. Then g*M = C' plus the single folded class g*v.
Every such class is tried, so canonical(M) appears in the extension output.
Taking the sorted set union with canonical irredundant13 covers is complete.
The same representative can suffice for later fibers only via the separately
reviewed eventual-properness symmetry bridge, not as equality of every finite
level's fibers. Cascade must bind exactly this full admitted output dataset.

## Evidence and scope

Require independent complete executions, not matching source counts. Retain the
exact sorted canonical12 dataset and the full sorted canonical13 union, with
root traversal evidence and bound input/source/output identities. The independent
verifier must reconstruct the whole enumeration and compare EVERY decoded row,
including extensions and repeats; a digest or same row count alone is insufficient.
Any truncation, missing root/branch/row, wrong normalization, duplicate erasure,
unallowed prune or source drift must fail closed. Resource exhaustion is an
incomplete run, never an accepted generator.

Passive GET may project a fixed locally admitted summary with explicit storage/
collector trust; it must not run million-node reconstruction or a subprocess.
Its integrity check is not described as a fresh mathematical replay. Local
unsigned receipts do not establish external or formal execution attestation.

[Allikvere2609.02604v2 §4.1](https://arxiv.org/html/2609.02604v2) supplies the
two-branch context. The proof above specializes the complete partition using
the independent tau83 result, rather than relying on author code or logs.
Cascade and terminal must each cover the entire admitted predecessor domain;
their computations and global LRC gates remain open until independently checked.
