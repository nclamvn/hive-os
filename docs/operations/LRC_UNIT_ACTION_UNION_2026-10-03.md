# TIP-050 — exact proof reuse under kernel units

## Scope and proof, before implementation acceptance

Continue the same four ordered p199 FULL domains from the immutable TIP048
base and TIP049 frontier checkpoint. Retain a separate artifact; never rewrite
old evidence. Use only COVER_BOUND leaves, whose arithmetic has been replayed.
Exclude anchored rows, old047 shard schema, conditional gcd, survivor and
unresolved labels. This is certificate reuse, not a new search or global proof.

Allikvere already discusses unit orbits in [Remark2.3 of the primary
paper](https://arxiv.org/html/2609.02604v2). The following fixed-level specialization
and exact bookkeeping implement that known symmetry; no novelty is asserted.
Read-only SCAN computations exposed likely outcomes before BUILD, so this is
not a blind benchmark or an AI-model capability measurement.

Let H=398, M=7H=2786. Exactly six integers s=1+Ht, with
t in{0,2,3,4,5,6}, are units modulo M fixing all residues modulo H. Indeed
s is1 modulo H, so coprime to H, and s=1-t modulo7, which is nonzero.
The excluded t=1 gives a nonunit and is never admitted.

For each original ordered coordinate v_i=r_i+Hd_i, H=-1 modulo7 gives

    s v_i = r_i + H((1-t)d_i + t r_i)  (mod M).

Thus the action on digits is a bijection, independently in each axis, while
coordinate labels and the common multiplier remain fixed. A proved prefix
cylinder transforms into another prefix cylinder of the same length; every
unspecified trailing axis still ranges over all seven digits. For child proofs,
first lift the leaf prefix into the parent's original axes using the longer
compatible leaf/target prefix. Appending the target twice would be incorrect.

Because multiplication by s permutes grid times, distance-to-integer satisfies
||j(sv_i)/M||=||(sj)v_i/M||. A single time witnessing all coordinates of v
transports using its inverse under this same permutation to witness sv.
Folding j and M-j is compatible with unit multiplication. This proves witness
existence for every transported configuration, without assuming one common
witness across an entire COVER_BOUND cylinder. No coordinate-specific time is
allowed. The fixed digit d_i=r_i modulo7 (v_i divisible by7) demonstrates why
coverage must not be multiplied by six as a general rule.

## Exact set bookkeeping

Encode each thirteen-digit vector as its lexicographic base7 ordinal
sum(d_i*7^(12-i)). The root is the integer interval[0,7^13). A prefix of
length m and code c represents exactly[c*7^(13-m),(c+1)*7^(13-m)).

Derive every original proven source leaf from verified certificates, transform
it under each of the six units including identity, and compute the union of
those half-open intervals. TypeScript merges sorted overlapping or adjacent
intervals. Independent Python uses a signed endpoint sweep. Both derive the
same canonical disjoint interval list, complement in the whole root, exact
cardinalities and digests. Adjacent intervals may merge without adding a point;
overlaps count once. Identity ensures old witness coverage is included.

For each parent separately, let W be the old witness set, V its transformed
union, and R the root. Then W is a subset of V, V is a subset of R, and

    new_verified = |V|-|W|; remaining = |R|-|V|.

The raw transported mass sums all six images with multiplicity. Its difference
from |V| measures duplicate mass, not an extra proof. No row aggregation is a
unique velocity count, orbit-class count or global problem completion rate.

The compact retained summary stores full union/complement digests and bounded
examples. Examples are only display aids. Admission reconstructs the complete
sets from immutable source evidence; hashes alone or sampled intervals do not
prove coverage. Never admit an incomplete union after a resource timeout.

## Resource and acceptance boundaries

Frozen caps:120k source leaves/1.5M transported intervals/1.5M union intervals,
50M new-method work,60s pure admission,90s independent wrapper,120s entire
collector,80MiB input/1MiB output and retained report. Old048/049 source
validators keep their own unchanged limits. Deadlines are cooperative observed
checks, not hard synchronous JavaScript preemption. Literal hash-pinned local
Python sources are executed, not downloaded author/model/request code.

The new retained-only view checks only the new projection, avoiding stacked old
panels. It does not spawn Python, generate/search, fetch research or call models.
Normal workspace auth/load applies. No cross-request validation cache this TIP.
Local unsigned receipts trust storage/collector/interpreter; they are not formal
proof or externally signed execution attestation.

All five global obligations, lower-LRC12 dependency, unverified whole ZIP and
NOT_ESTABLISHED remain. Completing this software does not complete the LRC14/15
theorem or a HIVE LLM campaign. Actual admitted outcomes and acceptance results
will be recorded after the independent collector and Main verification.

## Actual retained result and Main checks

Main's one explicit default collector completed in37806ms and retained16493
bytes in a NEW `retained-unit-report.json`. Raw SHA-256
`78519d5c7113a63bf79ed6ab8352adcf221937a6b13bfa0647251ce5478d99d4`;
content digest `b155a25e6a6579ff2c5c74ed2d08285c60b0e7cad6142cd3cc25e36cc7cc0357`.
Plan digest `4265dd104bdbe2ec8b5e348503b80f82f8abc037412e914357642d6c8bddf221`.
The actual Python replay independently checked the old16certificates/composition,
unit actions and exact endpoint sweep before final pure retained admission.

| Ordered parent | Original witnesses | Exact transported union | Verified increment | Exact remaining |
| --- | ---: | ---: | ---: | ---: |
| tight0 | 260155553 | 1560933318 | 1300777765 | 95328077089 |
| tight1 | 316139670 | 1896838020 | 1580698350 | 94992172387 |
| tight2 | 160043457 | 960260742 | 800217285 | 95928749665 |
| gw0 | 219045631 | 1314273786 | 1095228155 | 95574736621 |

All four rows remain PARTIAL. Their528246 transformed source prefix intervals
give canonical union/complement interval counts72/79/83/58. No new witness
search or larger old certificate limit was used. In these particular inputs
the six images happen to be disjoint (overlap mass0), which was established by
the actual set union, not assumed. The increment4776921555 sums row-domain
assignments, not globally unique velocities/orbit classes or global proof.

Main independently rebuilt a Map prefix tree without any production arithmetic
imports and obtained all four identical cardinalities. Main separately compared
3044496 exact bad-predicate identities under speed/time multiplication. Against
production interval/action helpers,53 small two-axis set-enumeration controls
and2597 membership/complement checks passed, including overlaps, nested regions,
adjacency and a fixed-point no-factor6 case. An additional missing fixed-point
block remained an exact hole after all six actions. These are development
controls, not an external or blind mathematical capability assessment.

Each parent's fully fixed digit vector d_i=r_i mod7 has all thirteen speeds
divisible by7. Direct folded-grid checking found no witness for these four
vectors. This is NOT a continuous-time counterexample; the old conditional gcd
dependency remains unpromoted. The transport method cannot close such a gap by
inventing grid coverage. A diagnostic typo (`return14`) initially stopped that
inline check; correcting it reran successfully, with no product or evidence
mutation. Product's mechanical change to three TIP049 route-selector test
expectations was authorized because old panels now render only in the old view;
the old tests' semantic protection, old artifacts and panel bytes remain.

Main's third-algorithm Map-tree DFS also reconstructed all full canonical union
and complement digests/examples, matching every retained row. A separate literal
three-source `python3 -I -S -B -c` replay took7623ms and matched both the complete
summary and exact stdout SHA
`c9ff403a88767f3f1a0170738891697354fc679de179285c0eaba5269a0d479b`.
Two Main faults coherently changed both primary/independent summaries, output,
evidence and outer report hashes: one-count coverage reduction and fabricated
union digest. Fresh pure report reconstruction rejected both in7865/8453ms.
These checks do not assume that matching unsigned hashes prove execution.

Live UI admission was observed in Vietnamese and English, with four PARTIAL
rows and two KaTeX formulas. Document widths matched1280desktop/390mobile;
no console errors were observed. The temporary viewport was reset and the user
tab retained. Initial navigation exceeded the browser's short wait while the
server was still computing; subsequent inspection confirmed the requested URL
and admitted report, not a404. A locator using an unsupported heading-level
option was ambiguous; known DOM selectors were used thereafter. Viewport-only
screenshot captured the narrow visible panel even under a wider test viewport;
full-page screenshot correctly captured1366x2233 actual default content.

Proof-of-work: `/private/tmp/hive-tip050.qtN11A/verified-ui.png`, SHA
`7f30d150c98d3b02af9cc95340089709bd43cca2042084c6dcbc2d2173dd2427`;
mobile EN `/private/tmp/hive-tip050.qtN11A/mobile-en.png`, SHA
`8fdc39b3cbf3d8ae05b3cfc4509ce7afce879f9124efb21e34b2ea76d0fb5676`.
Replay Builder preliminary17cases passed; its initial zero-budget provenance
loop is clock coverage only. Final five fresh nonzero execution-pin faults plus
clock case passed6/6. Main full regression uses the frozen final22-case file.

Next research priority is orbit-aware routing on the exact remaining set, with
canonical representatives and separately sealed certificates, rather than
increasing brute-force caps. Fully fixed divisible-by7 slices need their own
declared dependency treatment; no grid-witness transport can manufacture one.
Fresh HIVE typed model-cycle integration and verified admission caching remain
separate work, not implied by this local stopped proof-reuse collector.

Initial Main full regression:124files,1092PASS/2staticFAIL in458.94s. Both
failures were old TIP047/048 route-selector string expectations, after genuine
arithmetic admission had passed. Main authorized two more narrowly mechanical
test repairs: TIP047 now checks oldRetainedView, unitRetainedView and their OR;
TIP048 changes only the two old-panel guards to oldRetainedView. Existing
arithmetic, purity, source fixtures, old caps and product code are unchanged.
Before/after test pins are retained in the final Product completion. Main reruns
the whole frozen suite, not merely treating the initial1092pass as acceptance.

Production build compiled successfully, including TypeScript, standalone env
scrubbing and asset preparation. Dev was stopped before build and restored on
127.0.0.1:3001 with queueOFF/workerSTOPPED, ready242ms. Fresh unit-view GET200
took11.7s cold (application10.6s); earlier reads10.8/9.1/10.4s. Real admission
is not instant. Old server history included17:21 auth/pool timeouts under the
old stacked view; new unit-view reads and the fresh post-build page succeeded.
Verified content-bound read caching/event-loop isolation remain important
operational follow-up, never an arithmetic-bypass cache.

Old tab16 became a connection-error data URL after shutdown. Its reload/cleanup
was blocked by browser URL policy; no policy or security warning was bypassed.
Fresh same-browser tab17 showed the actual local unit view after its short
navigation wait expired. It is retained as the deliverable. Post-build snapshot
has two formulas, zero math errors, four rows and documentWidth=viewport1280.
`/private/tmp/hive-tip050.qtN11A/post-build-ui.png` SHA
`2ceb9139527cc2b54ecc91465573a573304f0a1673d67b205cff1705ddd8f12e`.

## Derived next-routing lemma (not admitted new coverage)

Put x_i=d_i-r_i mod7. The six actions become x -> a*x with a in F7^*.
Composition is t*u = t+u-tu mod7. The only fixed vector is x=0; all other
orbits have exactly six points, since a nonzero coordinate forces a=1 for a
stabilizer. Normalize the first nonzero labelled coordinate to1; the resulting
vector is a unique canonical representative. No coordinate permutation or
changed mathematical domain is involved. The fully transported union and its
complement are invariant by this complete six-element group.

Because Main's complete digest check places the fixed vector outside each
current witness union, a remaining cardinality R would correspond to
(R-1)/6+1 remaining orbits. Current derived diagnostics tight0/tight1/tight2/gw0:
15888012849/15832028732/15988124945/15929122771. These are still enormous, not
an invitation to enumerate them. Structural family selection and independent
lift-back certificates should precede any quotient-driven search.

Separate Main enumeration of each343-point closed three-axis slice gave58
orbits (one fixed,57free of size6) and49392 group-composition comparisons
passed. An initial inline diagnostic incorrectly expected scope inside the
compact plan and stopped before checks; it was corrected to read the pinned
base row. No artifact/product changed. This lemma is elementary known group
action specialization, not a novel theorem, a compiled quotient implementation,
a HIVE-agent gate, new witnesses or a15-person result. It has no effect on the
frozen TIP050 plan, source selection, budgets or retained classification.

## Final Main acceptance

Final frozen regression124files1094/1094PASS408.68s, started17:39:13local.
All22Core/22Replay/21Product new tests ran together; repaired old static
expectations also passed. Whole final typecheck/lint, production build and
diff-check passed. DB integration was NOT_RUN_THIS_TURN. The local queue remains
OFF and no worker/model/provider campaign was run. Prior24immutable source
pins and92currentmanifest entries were verified; founding manifest and prior
215934-byte handoff prefix remain exact. Software READY_WITH_DEFERRED is not
research completion: all four rows PARTIAL, global NOT_ESTABLISHED and all five
obligations remain. No commit/push/deploy/install/paidAPI/DB mutation this turn.
