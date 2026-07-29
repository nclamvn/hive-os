import type { AssuranceProfile } from "@prisma/client";

export interface MissionTemplate {
  readonly key: string;
  readonly version: 1;
  readonly domain: string;
  readonly name: string;
  readonly description: string;
  readonly assuranceProfile: AssuranceProfile;
  readonly objective: string;
  readonly scope: string;
  readonly successDefinition: string;
  readonly requirementTitle: string;
  readonly requirementCriteria: string;
  readonly obligationTitle: string;
  readonly obligationWeight: number;
}

export const MISSION_TEMPLATES: readonly MissionTemplate[] = [
  {
    key: "rapid-operational-brief",
    version: 1,
    domain: "Operations",
    name: "Rapid operational brief",
    description:
      "A bounded decision brief for time-sensitive operational work.",
    assuranceProfile: "QUICK",
    objective: "Produce a decision-ready operational brief for the stated question.",
    scope: "Use the supplied context and explicitly bounded evidence window.",
    successDefinition:
      "A concise recommendation, retained source trail, risks and named next action.",
    requirementTitle: "Decision question is answered",
    requirementCriteria:
      "The brief answers the approved question and distinguishes facts, assumptions and open gaps.",
    obligationTitle: "Retain material evidence and limitations",
    obligationWeight: 1,
  },
  {
    key: "professional-product-delivery",
    version: 1,
    domain: "Product",
    name: "Professional product delivery",
    description:
      "A governed delivery contract for production-quality product increments.",
    assuranceProfile: "PROFESSIONAL",
    objective: "Deliver the approved product increment to production-quality standards.",
    scope: "Implement only the approved functional, security and interface boundaries.",
    successDefinition:
      "Acceptance scenarios pass with audit evidence, rollback notes and no fabricated state.",
    requirementTitle: "Approved product behavior is complete",
    requirementCriteria:
      "Every accepted scenario is implemented, verified and traceable to retained evidence.",
    obligationTitle: "Pass the product quality gate",
    obligationWeight: 3,
  },
  {
    key: "rtr-engineering-change",
    version: 1,
    domain: "Deeptech Engineering",
    name: "RtR engineering change dossier",
    description:
      "A governed change and verification dossier for UAV, simulator, flight-control, gimbal or sensor-stack work.",
    assuranceProfile: "PROFESSIONAL",
    objective:
      "Approve and release one bounded engineering change with an accountable decision, retained implementation evidence and independent verification.",
    scope:
      "Cover the named subsystem, approved interfaces, safety constraints, acceptance method and rollback boundary; exclude adjacent redesign not required by the change.",
    successDefinition:
      "The released change has an approved contract, traceable requirement, source evidence, execution record, independent verification, sign-off and immutable release manifest.",
    requirementTitle: "Engineering change is verified against its approved baseline",
    requirementCriteria:
      "The changed subsystem satisfies the approved functional and safety acceptance method, with exact test evidence, identified configuration, observed result and verifier conclusion.",
    obligationTitle: "Close the engineering change verification dossier",
    obligationWeight: 4,
  },
  {
    key: "research-evidence-synthesis",
    version: 1,
    domain: "Research",
    name: "Research evidence synthesis",
    description:
      "A falsifiable synthesis with provenance, disagreement and honest-null handling.",
    assuranceProfile: "RESEARCH",
    objective: "Answer the research question using reproducible evidence synthesis.",
    scope: "Use declared sources, inclusion criteria and an explicit search boundary.",
    successDefinition:
      "Claims are sourced, conflicts retained, limitations explicit and conclusions falsifiable.",
    requirementTitle: "Evidence synthesis is reproducible",
    requirementCriteria:
      "A reviewer can replay the source selection, exact spans and claim reasoning.",
    obligationTitle: "Complete independent verification",
    obligationWeight: 4,
  },
  {
    key: "regulated-decision-record",
    version: 1,
    domain: "Governance",
    name: "Regulated decision record",
    description:
      "A high-assurance record for decisions requiring independent review and sign-off.",
    assuranceProfile: "REGULATED",
    objective: "Produce a controlled decision record for the approved regulated question.",
    scope: "Operate within named policy, access, retention and evidence constraints.",
    successDefinition:
      "The release contains approved claims, independent verification and accountable sign-off.",
    requirementTitle: "Regulated decision is defensible",
    requirementCriteria:
      "Requirements, evidence, verifier independence and sign-off are complete and auditable.",
    obligationTitle: "Satisfy regulated release governance",
    obligationWeight: 5,
  },
] as const;

export function getMissionTemplate(key: string | undefined) {
  if (!key) return undefined;
  return MISSION_TEMPLATES.find((template) => template.key === key);
}
