# Data Boundaries

HIVE OS separates four data classes. They must never mix.

| Class | Where it lives | How it loads |
|---|---|---|
| Production data | Production database + production object store | Created only by real governed operations. Never seeded. |
| Development data | `hiveos_dev` database (Docker, port 5433) + `.storage/` | Created manually by developers during local work. |
| Demo fixtures | `src/server/fixtures/demo.ts` registry (content arrives with later TIPs) | Only when `DEMO_FIXTURES_ENABLED=true` **and** `NODE_ENV !== production`. The env schema rejects `DEMO_FIXTURES_ENABLED=true` in production at startup. |
| Test fixtures | `tests/fixtures/` + `hiveos_test` database + `.storage-test/` | Only by test runners via `.env.test`. Integration tests refuse to run against a non-`hiveos_test` database. |

Rules:

- Demo fixtures are explicitly labelled and route exclusively through `loadDemoFixtures()`; nothing loads them implicitly.
- No synthetic missions, claims, percentages, uptime, verification scores, token usage, agent counts, or resource metrics anywhere, in any class.
- Empty states are preferred to invented data.
- `hiveos_test` is created by `scripts/db/init/01-create-test-db.sql` inside the same development container but is a separate database; test runs never touch `hiveos_dev`.
