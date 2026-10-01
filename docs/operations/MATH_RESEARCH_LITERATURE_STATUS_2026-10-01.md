# TIP-034 literature status and partial method map

## Current primary-source observations

The Contractor and Builder inspected the current official abstract records and
the indicated full-text passages on 2026-10-01. This was a read-only literature
audit, not independent verification of every theorem in these publications.

| Publication | Captured mathematical version | Current record | Method-map role |
| --- | --- | --- | --- |
| [Elsholtz–Tao 1107.1010](https://arxiv.org/abs/1107.1010) | Tao v2 Proposition 1.2, Remark 1.3, Proposition 1.4; Elsholtz–Tao v6 Theorem 1.1, Remark 1.2, section 2 | Latest v6, no withdrawal observed | Qualified historical construction/local obstruction and current counting background |
| [Salez 1406.6307](https://arxiv.org/abs/1406.6307) | v1 Proposition 3, Corollary 1, sections 3 and 4 | Latest v1, no withdrawal observed | Modular filters, explicit applicability assumptions and residual-coverage gap |
| [Jiang 2609.09204](https://arxiv.org/abs/2609.09204) | Older v1 was previously compared | Latest v2 withdrawn 2026-09-13; author comments report errors | Publication-wide quarantined suspect lead, not an accepted premise |

The [v2 Tao text](https://arxiv.org/html/1107.1010v2) is not the latest version
of the publication. Its version-qualified baseline is preserved; supersession
alone does not establish that its elementary algebra is false. The
[current v6 text](https://arxiv.org/html/1107.1010v6) was checked separately,
including the introduction's heuristic/typical-count caveat and Type II
characterizations in section 2. Counting and heuristic evidence do not supply
an all-prime existence proof.

The [Salez v1 text](https://arxiv.org/html/1406.6307v1) separates its polynomial
classification from its integer corollary. The method card retains positivity,
prime-domain and coprimality requirements. Filter coverage and finite checks
must not be promoted into a proof that every residual prime is covered.

No mathematical result from Jiang is adopted. Quarantine affects citation
authority, not the truth of separately checked arithmetic or locally proved
identities. Historical references and hash-sealed ledgers are retained.

## Implemented capture and trust boundaries

The fixed server collector may fetch only these three exact HTTPS arXiv
abstract-record URLs. It accepts no model/user URLs, follows no redirects,
requires HTML, imposes a seven-second absolute operation deadline and caps
streamed bytes at 128 KiB. Normalized status evidence is capped at 32 KiB per
record. It retains publication identity, selected/latest versions, observation
and evaluation times, normalized content digest, status/provenance and an
observation digest. The normalized digest is **not a digest of the complete
mathematical paper or raw HTTP bytes**.

Malformed, failed, oversized or redirected responses remain unavailable.
The parser requires an identifiable abstract record and an unambiguous,
contiguous submission history. A withdrawal word in a title is not a withdrawal
notice. Status ACTIVE means only that no withdrawal was observed in the
captured publication record. It certifies no mathematical statement.

Known Jiang withdrawal is an immutable V1 publication-wide quarantine floor,
including v1/v2, abs/HTML/PDF and arXiv DOI aliases. A missing notice, failed
fetch or recomputed digest cannot remove it. A future reinstatement would need
a separately reviewed policy version, not a model edit or silent fallback.
Identity-only normalization also recognizes legacy HTTP arXiv and dx.doi.org
aliases and safely decoded percent-encoded paths, including the encoded DOI
slash emitted by Crossref discovery. Malformed encodings, userinfo,
nonstandard ports and arbitrary hosts do not normalize. None of these aliases
is a fetch target; the collector's exact HTTPS allowlist is unchanged.

The method packet binds the sealed root digest, frontier dossier digest, each
status capture and six reviewed card-content digests. Cards state assumptions,
obstructions, missing root bridges, tools and evidence ceilings. The global
support bridge is explicitly a project hypothesis, not an attributed theorem.
All cards declare `premiseAuthority:false`; source health and model agreement
are not mathematical acceptance. Missing tools are visible, never fabricated
as runnable cycle capabilities.

The six-card, three-publication corpus is **partial and curated**. It is not an
exhaustive literature search, generic crawler, autonomous theorem extractor or
novelty certificate. It does not newly certify the older frontier catalog's
eight other excerpts as healthy/current. Adding a source, method or changed
status policy requires a reviewed versioned extension and its tests.

V1 integrity validation is deterministic and clock-free for retained history.
New dispatch checks the packet's 24-hour freshness and rejects future captures.
A fresh packet can explicitly carry unavailable/stale source observations as
non-authoritative background; this is not a successful current publication
check. The V1 seed/withdrawal semantics are frozen: later publication health
changes belong to a new observation/policy layer, not edits that regrade old
packets or rewrite ledgers.

Runtime capture is a trusted server collector boundary. Digests detect content
mutation and rebinding; they are not cryptographic server signatures proving
HTTP authenticity. No browser read fetches publication status.

## Verification limits

Nine bounded unit scenarios cover packet/source integrity, rehashed premise
promotion, all registered aliases, withdrawal floors, supersession, malformed
and duplicate history, freshness/future time, fixed URL boundaries, redirects,
media/size failure and stalled-body cancellation. No paid model calls, live
worker, campaign, database migration or Git operation was performed by Builder B.

Official records were readable through the primary-source browsing tool.
Initial sandboxed Node collection returned `TypeError: fetch failed` for all
three URLs. A permitted read-only network retry then fetched their actual HTML
using the unchanged fixed collector. Parsing and normalized capture integrity
passed on all three records:

| Publication | Parsed status/latest | Normalized UTF-8 bytes | Captured content SHA-256 |
| --- | --- | --- | --- |
| 1107.1010 | ACTIVE / v6 | 5,042 | `be21ba88e58bbcd08c734b23efa6794932b2be954e7a7cef96808a7557101588` |
| 1406.6307 | ACTIVE / v1 | 4,055 | `a5ade46d552f29c33e8de7821e7624646d8fc793743daa1d327167f5e94dcfa6` |
| 2609.09204 | WITHDRAWN / v2 | 5,653 | `d5bff80fd376211c4f0d1ff68c40c1b415598d29a0aadb20a1813d50acc36a0d` |

These are the observed status-page fingerprints, not new mathematical-paper
pins or application ledger entries. The same-budget held-out scientific
evaluation and live role/campaign admission remain separate work, described
in `MATH_ADAPTIVE_RESEARCH_EVALUATION.md`.
