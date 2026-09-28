# TIP-025 Mathematics Pilot Gate — local verification

Date: 2026-09-28

Verdict: **LOCAL IMPLEMENTATION PASS; LIVE CALIBRATION NOT YET VERIFIED**

## Machine-verifiable evidence

| Gate | Result |
| --- | --- |
| Prisma schema validation and client generation | PASS |
| Migration `20260928120000_math_pilot_gate` | Applied to `hiveos_dev` and isolated `hiveos_test` |
| Runtime role / forced RLS | PASS, local preflight |
| TypeScript and ESLint | PASS |
| Production build and route packaging | PASS |
| Full unit suite | 215/215 PASS |
| Strict full integration suite | 170/170 PASS |
| Full browser E2E suite | 102/102 PASS |
| New mobile 390 px overflow | PASS |
| New page serious/critical WCAG 2 A/AA automated findings | 0 |

Integration exercises the durable job with a **fake provider**, real retained
source/finding digests, source review, independent math assessment, model-bound
calibration gate and open-case creation. Negative paths include premature open
request, self-assessment, duplicate assessment, wrong model, early authoring
import and database mutation of the frozen contract.

The local readiness command reported database, migration and forced RLS READY;
Docker AVAILABLE; worker and provider UNVERIFIED; calibration NOT_RUN. No live
OpenAI request was made. No provider key was read or printed, no new worker was
activated, and no claim of theorem-proving capability is made. MATH-07 remains
pending under the local runbook.

Pre-existing modified visual screenshot artifacts were left in place and were
not included in this TIP's acceptance evidence.
