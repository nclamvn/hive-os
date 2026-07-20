# Test Fixtures

Deterministic inputs used exclusively by Vitest and Playwright runs.

- Loaded only by test code; the application never reads this directory.
- Integration tests run against the isolated `hiveos_test` database via `.env.test`.
- Do not place demo or development content here — see `docs/DATA_BOUNDARIES.md`.
