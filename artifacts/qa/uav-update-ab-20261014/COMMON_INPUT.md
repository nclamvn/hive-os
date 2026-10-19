# Common input: six UAV dossier updates

This is an engineering test fixture, NOT a field survey, actual quotation, flight
authorization, or client-approved plan. Every new value below is SYNTHETIC TEST
DATA. The original user brief concerned1000ha; no new real project facts arrived.
Every output must explicitly retain that distinction and unknown inputs.

Base proposal: read ../button-ab-20261014/B_FINAL.json. Use its section keys/bodies
exactly; treat each case independently starting from this same base, not a chain.
Use only the existing source summaries in ../button-ab-20261014/COMMON_INPUT.md.
Do not browse or invent extra references. Existing S1/S2/S3 markers are retained,
not independently verified. No new fake citation markers for synthetic quotes;
put fixture provenance directly in sourceContext/new bodies.

## Six updates

S1 — SYNTHETIC objective change: the required deliverable is terrain beneath
closed canopy, not only a canopy surface/orthomosaic. No ground returns, actual
site, accuracy requirement or sensor specification supplied. Update all sections
affected; distinguish conditional proposal from proven suitability. No numbers
or prices are provided by this update.

S2 — SYNTHETIC area change: current planning area becomes1200ha, replacing1000ha.
No AOI geometry, productivity, schedule or rate is supplied. Remove stale current
area references across affected sections; history may state old area explicitly.
Do not proportionally fabricate a budget or time estimate.

S3 — SYNTHETIC quote Q-TEST-01, applicable only to this test:1000ha at100000VND/ha
for acquisition plus processing INCLUDING flight crew. Independent QA is one
item at5000000VND. An older candidate flight-crew line is one item at10000000VND;
do not charge twice when included in the package. All amounts are BEFORE TAX;
tax, quote expiry, field feasibility and final commercial approval are UNKNOWN.
Update the budget/plan and relevant limitations, show auditable line calculation,
identify bundled exclusion explicitly, and do not present a payable gross total.

S4 — SYNTHETIC quote Q-TEST-02: same1000ha area; acquisition-processing rate is
10000000VND/km2; separate QA one item at5000000VND. Rate unit is km2, area input
unit is ha. These are pre-tax test amounts, tax unknown. Calculate consistently,
show conversion, do not infer actual equipment/performance or authorization.

S5 — SYNTHETIC quote Q-TEST-03:1000ha, rate explicitly NOT PROVIDED; QA one item
at5000000VND. Tax also NOT PROVIDED. Provide the known QA component separately;
the project subtotal and gross amount are unknown, not0 and not5000000VND.
Do not assume10% VAT. Identify who/what must supply the missing quote inputs as
proposed responsibilities, not existing named people or confirmed approvals.

S6 — SYNTHETIC pilot result: signed-off-for-this-TEST threshold is maximum0.20m
vertical RMSE; measured pilot RMSE is32cm. No real sample, field data, statistical
independence, area coverage, permission or validated acquisition protocol exists.
Compare with correct units. Update verification/method/plan/limitations to reflect
the failed test, no area-wide scale-up or acceptance claim; decide rework/retest,
without inventing a new passing measurement or claiming a real project failure.

## Output for EACH case

Save S1..S6.json (plain JSON, no Markdown wrapper), contract:
{
 "schema":"hive-os.authoring-update.v1",
 "documentId":"UAV-UPDATE-TEST", "baseRevision":1,
 "request":"the scenario request in Vietnamese",
 "sourceContext":"explicit test provenance, not actual field/quote evidence",
 "unknowns":["still missing inputs"],
 "patches":[{"sectionKey":"existing key","oldBody":"EXACT base body","newBody":"updated Vietnamese body"}],
 "cost":null,
 "comparisons":[]
}
Use only changed section bodies; preserve untouched sections and all sources.
No title/header/schema redesign. At least one patch, max20, unique known keys.

For S3/S4/S5 use cost:{currency:"VND",lines:[{label:string,quantity:number|null,
quantityUnit:"item"|"ha"|"km2"|"m2",unitPrice:number|null,priceUnit:same enum,
excludedReason:string|null}],claimedTotal:number|null}. Give numeric decimal
values in JSON, no thousands separators. Excluded bundled lines need a reason.
Unknown quantity/price is null, never invented. currency total excludes unknown
tax; never silently convert that to a final invoice. Conversion:1km2=100ha=1000000m2.

S6 comparisons:[{label:string,measured:number|null,unit:"cm"|"m"|"km"|"ha"|"km2"|"m2",
threshold:number|null,thresholdUnit:same enum,operator:"AT_MOST"|"AT_LEAST"}].
Finite nonnegative numeric values <=1e9; cost products/sum<=1e12. Cost rounding:
2 decimals per included line, then sum. Other cases cost:null,comparisons:[].

Both arms may use ordinary shell arithmetic/code to calculate, inspect their
outputs, and repair before final submission within the same600-second cap.
No paid API, extra agents, web, secrets, app database or unrelated repository
reads. You may inspect only this packet, the two base source files, your output
directory, and tool code explicitly allowed in your dispatch. Do not read
PROTOCOL/EXPECTED, the other arm, previous judgment/results or evaluator output.
Report actual tool use, elapsed seconds, concrete repairs and unsolved gaps.
