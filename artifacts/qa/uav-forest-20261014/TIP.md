# UAV forest proposal: browser E2E

- Date: 2026-10-14
- Scope: local operator-assisted workflow, no paid API, no worker dispatch, no flight or deployment.
- Base: 12ef071, codex/tip-023a-organization-graph.
- Request: create a preliminary proposal for surveying 1,000 ha of forest by UAV, through visible Codex browser interactions; make missing data explicit.

## Acceptance criteria

1. Create a separate mission using the four-field intake; preserve scope and limits.
2. Create a mission-linked technical proposal and save all eight sections in an immutable revision through UI.
3. Identify missing inputs, responsible roles and consequences; do not invent location, performance, prices, deadlines or field results.
4. Declare traceable primary references and distinguish methodological evidence from site-specific evidence.
5. Download a native Word export, verify the package and visually inspect its rendered pages.
6. Exercise native PDF export and report its actual result, without substituting a converted file as evidence of native PDF success.

## Decisions

- No new campaign, architecture or administrative gates. Existing authoring module is sufficient for this test.
- Codex is the content author/operator. This test does not establish autonomous worker capability or technical survey acceptance.
- Keep the editorial warning on the user-supplied area rather than attach an unrelated citation.
- Any exporter repair is a separate narrow approval; do not silently change code during a test-only request.
