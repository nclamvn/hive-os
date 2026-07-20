# Verify Standard

Every Builder completion report is checked against four mandatory sections.

## Requirement Coverage

- Implemented REQ-IDs / total applicable REQ-IDs.
- Missing and deferred REQ-IDs listed explicitly.

## Scenario Results

- Each Gherkin scenario: PASS or FAIL.
- Failure severity: P0, P1, P2, P3.
- Evidence: test path, screenshot, log, artifact, or database record.

## Technical Health

Exact numbers:

- build status;
- type errors;
- lint errors/warnings;
- unit tests pass/fail/skip;
- integration tests pass/fail/skip;
- E2E tests pass/fail/skip;
- accessibility violations;
- dependency vulnerabilities by severity;
- bundle or performance measurements where relevant.

## Overall Status

- `READY`
- `READY_WITH_DEFERRED` plus explicit list
- `NOT_READY`

## Additional HIVE OS gates

- No synthetic metrics presented as real.
- No model output directly mutates governed status.
- Every public claim has provenance and release authorization.
- Every evidence span points to a stored snapshot.
- Every timeout/cap preserves `OPEN_INCOMPLETE` semantics.
- Every architecture deviation is reported before adoption.
