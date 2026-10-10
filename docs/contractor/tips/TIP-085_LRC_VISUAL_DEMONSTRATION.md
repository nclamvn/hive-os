# TIP-085 — show the two verified LRC results

2026-10-09 · LRC_VISUAL_DEMONSTRATION_085 · UI_PRESENTATION.
Direct Owner routing: visually present the two TIP-084 results, no new campaign
or infrastructure. TIP-084 remains closed; old p139/R3 history is unchanged.

## Small design / scope

One read-only workspace route `research/lrc-demo`, existing authentication,
research.read capability, WorkspaceShell, locale/theme and MathText. Load the
retained public TIP-084 JSON, not arbitrary files or old campaign artifacts.
One small interactive component, a pure display helper if needed, focused tests.
Add a discoverable link in the existing math-tools view; no global navigation
rebuild. No scientific re-run, model/API call, job/lease/grant/DB write.

Use existing HIVE fonts and surface/ink/line tokens. Scientific accents: teal
#0f766e for coverage/pass, slate #64748b for neutral, red #b91c1c for failed shift;
theme-aware contrast. The memorable element is the actual interval atlas, not
another collection of rounded KPI cards. Left-aligned text, generous whitespace,
no automatic animation or new assets/fonts. A two-case selector and a wide
scientific figure with compact controls/proof below it. This uses HIVE's existing
identity but replaces a generic dashboard treatment with the mathematical object.

GW14: render the actual 59 arcs on 13 speed rows, time axis0..1, equality marker
t1/14. Select an arc through native keyboard-friendly controls; show exact closed
endpoints and why any time inside is bounded. Diagram is illustrative; the
retained independent exact union certificate is what established coverage.

SHIFT15: five buttons j0..4; show original 14-runner distances/grouped geometry
and the particular exception which blocks each failed shift. Use exact BigInt
physical products for values, symbolic epsilon where tiny offsets cannot be
seen. At j4 show t=(8Q+1)/(10Q) and min1/5−1/(10Q)>1/15. SVG floating coordinates
are only display approximations, never a verification claim. Q fixed1e30.

Status explicitly says retained OFFLINE independent replay; no UI control may
claim a fresh solve, new check, autonomous agent-loop acceptance, formal proof,
novelty or global LRC14/15. Source/proof rationale and limits visible, including
the all-Q multiple-of-five family argument and known-source exposure.

## Acceptance / quick checks

- U1: authenticated workspace page + navigation loads, without security bypass.
- U2: GW diagram uses retained59facts/13rows; selection displays exact endpoints,
  t1/14/equality and whole-period certificate versus drawing distinction.
- U3: allfive shift selections expose exact distances; j0..3 visibly fail and
  j4 passes. Huge integer velocities never drive float-based acceptance.
- U4: honest retained status, public source, scoped claims, readable TeX; no
  API/job/persistence effects. Missing/unaccepted record must not become PASS.
- U5: keyboard labels/focus, no viewport overflow, responsive375px/desktop,
  light/dark via existing tokens. Focused source/tests and real browser walkthrough.

Builder code + inline completion; Main source/visual review + ONE final report.
Full blueprint/RRI ceremony omitted: explicit narrow Owner scope, existing app
patterns. Standard checks first, no full build/install/new distDir/shadow copy.
Reuse ordinary `.next` dev, bind127.0.0.1 if server needed. Disk checked85Gi free.
Routine bounded checks<=120s each; browser walkthrough<=15min once route ready.
Stop at scoped result or concrete blocker; do not extend a math campaign or
turn runtime/auth failures into a broad infrastructure project. No Git mutations.

## Direct Owner-approved demo recovery

User could not remember a verified account, then explicitly approved recovery
of ONLY public pilot.demo@hiveos.invalid in LOCAL hiveos_dev: verify its email
and enable existing login prefill. No password change, account creation, other
account change, new workspace/authority, or disabled verification. Ordinary
login/session effects are allowed, not research persistence or job execution.

Existing provisioning currently tries sign-in before setting email_verified,
so it refuses its own existing unverified demo. Reuse that script with an
explicit existing-only mode returning BEFORE provisionWorkspace. Verify fixed
password ownership through the actual auth API (including only the specific
password-checked EMAIL_NOT_VERIFIED response), require both database URLs local
loopback/hiveos_dev, scope UPDATE to exact existing HUMAN demo id. Builder
source/tests + Main review precede one bounded execution. No `.env` edits;
DEMO_FIXTURES_ENABLED is process-only on the ordinary local dev server.
