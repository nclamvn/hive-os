# Truth Kernel Policy

## Authority

Snapshots, exact spans, claim versions, evidence links, disputes, honest-null
records, and provenance edges are append-only ledgers. `Claim.state` is a
governed projection recomputed by deterministic services.

## State rules

1. A claim starts only with evidence, an explicit internal owner, or an
   explicitly falsifiable hypothesis.
2. One supporting source yields `SOURCED`.
3. `CORROBORATED` requires two qualifying sources with distinct
   `independenceKey` values.
4. Distinct retained normalized values, or explicit contradictory evidence,
   yield `DISPUTED`; source tier never chooses a winner.
5. `HONEST_NULL` requires an explicit actor and rationale.
   `EMPTY_CERTIFIED` additionally requires a replayable certificate reference.
6. `FALSIFIED` and `RETRACTED` are terminal projections. Their versions and
   evidence remain queryable.

## Span semantics

Offsets are zero-based and half-open: `[startOffset, endOffset)`. A span is
accepted only when `snapshot.content.slice(startOffset, endOffset)` equals
`exactText` exactly. Snapshot content is immutable after capture.

## Access projections

| Target | Included access levels | Sensitive metadata |
|---|---|---|
| Internal | PUBLIC, WORKSPACE, RESTRICTED | Included |
| Export | PUBLIC, WORKSPACE | Falsification/review metadata omitted |
| Public | PUBLIC only | Falsification/review metadata omitted |

Projection filtering is server-side and requires explicit capability checks.
