# Completion report — TIP088 epoch2 casewise driver

STATUS: DONE (engineering transport slice only; no mathematical acceptance).

FILES CREATED:
- `scripts/research/public_pilot_088_casewise.py`: thin driver reusing the frozen
  predecessor's actual command, capture, parser and receipt writer.
- `tests/research/test_public_pilot_088_casewise.py`: 14 focused stdlib tests.
- This Builder completion report.

No predecessor source/test/snapshot was modified. Driver SHA256:
`5f50e70b35b814c0a33db396b0b67e43710c91dbe9a2bb3309e429451151223a`.
New tests SHA256:
`d3d78f1593d30b8ac2f6e6f86b41b5ee4cfac9707624ff19c8a1fb5c08db5f45`.
Frozen predecessor SHA256 remains
`839d4ce3618daab71f227e71c9b7c83b68f38e3a2ede99d2a5c24323ad0e3817`;
original test SHA256 remains
`673fa053070a29d0deaec4cd2de6d21eaca147f5a26c46f088ad6eaac35288a9`.
Both solver/reference snapshot hashes match the epoch2 TIP.

TEST RESULTS:
- Standard `compile` syntax checks: 2/2 PASS, no bytecode created.
- Focused new tests: 14/14 PASS, 0.126 seconds internal unittest time.
- Combined original + new tests: 29/29 PASS, 0.213 seconds internal unittest time.
- Checks cover six-call single-case scheduling, identical initial prompts,
  stage allocations 240/120/120, explicit response replay/fresh critic,
  per-arm failure/no retry, later-case continuation, all-six summary denominator,
  deadline/no calls and clipped calls, strict IDs/frozen input/no reference fields,
  create-only evidence, empty external scratch, quota refusal, actual usage/null
  fields, 1400-word rejection, source preservation, and 36 calls across two mocked
  invocations with no second C05 dispatch. These are not mathematical tests.

ACTUAL DISPATCH: Builder Codex/model/math requests ZERO. The existing regression
suite ran tiny local Python children only. Mocked calls consume no model budget.

DEVIATIONS: Main clarified the fixed stop time to 10:19 UTC before any dispatch;
driver uses that deadline, matching final TIP SHA256
`f8e872fbf9258f220b1d5721fb39e4a4d0c4f4ddce568a8e86c0c5a375b361bc`.
Runtime MAX_WORDS is set to 1400 on a private import of the old runner, leaving
its frozen source and original tests unchanged. No new grant infrastructure.

LIMITATIONS / MAIN RESPONSIBILITIES:
- Main alone decides whether C05 has mathematical acceptance and authorizes the
  remaining-five invocation. The driver checks C05 transport completion only.
- The 36-call total and no-repeat semantics apply to the fixed six-case plan and
  shared create-only evidence root; Main owns the execution grant and must not
  use another root to repeat cases. This is not a tamper-proof server gate.
- Word count is post-response checked, not a hard token ceiling. Usage/backend
  fields retain predecessor observability limits; missing metrics stay null.
- Explicit quota/auth failure text stops the batch; ordinary failed later arms
  stop only their own next stages, retaining fixed-denominator failures.
- No product/UI/build/install/DB/config/Git work or mathematical grading occurred.

CLEANUP: unittest TemporaryDirectory removed its owned small
`/private/tmp/codex-tmp-pilot088e2-test-20261009-*` scratch directories on exit;
existing tests likewise auto-cleaned their own `codex-tmp-pilot088-test-20261009-*`
directories. No project copies, dependency installs, new distDir or material user
files were created/deleted.
