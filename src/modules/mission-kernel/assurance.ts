import type { AssuranceProfile, GateEvaluationMode, MissionStatus } from "@prisma/client";

export interface GateTemplate {
  code: string;
  title: string;
  requiredBeforeStatus: MissionStatus;
  required: boolean;
  evaluationMode: GateEvaluationMode;
}

export interface AssurancePolicy {
  profile: AssuranceProfile;
  /** Minimum non-optional requirements a contract must declare. */
  minRequirements: number;
  /** Minimum weighted obligations a contract must declare. */
  minObligations: number;
  /** Whether contract approval is reserved to workspace Owners. */
  approvalOwnerOnly: boolean;
  /** Truthful future requirements — created as OPEN gates, never passed. */
  gateTemplates: GateTemplate[];
  requiresIndependentVerification: boolean;
  requiresReleaseSignoff: boolean;
  publicReleaseEligible: boolean;
}

const VERIFY_GATE: GateTemplate = {
  code: "INDEPENDENT_VERIFICATION",
  title: "Independent verification",
  requiredBeforeStatus: "RELEASED",
  required: true,
  evaluationMode: "MANUAL",
};

const SIGNOFF_GATE: GateTemplate = {
  code: "HUMAN_RELEASE_SIGNOFF",
  title: "Human release sign-off",
  requiredBeforeStatus: "RELEASED",
  required: true,
  evaluationMode: "MANUAL",
};

const POLICIES: Record<AssuranceProfile, AssurancePolicy> = {
  QUICK: {
    profile: "QUICK",
    minRequirements: 1,
    minObligations: 1,
    approvalOwnerOnly: false,
    gateTemplates: [],
    requiresIndependentVerification: false,
    requiresReleaseSignoff: false,
    publicReleaseEligible: false,
  },
  PROFESSIONAL: {
    profile: "PROFESSIONAL",
    minRequirements: 1,
    minObligations: 1,
    approvalOwnerOnly: false,
    gateTemplates: [],
    requiresIndependentVerification: false,
    requiresReleaseSignoff: false,
    publicReleaseEligible: false,
  },
  RESEARCH: {
    profile: "RESEARCH",
    minRequirements: 1,
    minObligations: 1,
    approvalOwnerOnly: false,
    gateTemplates: [VERIFY_GATE],
    requiresIndependentVerification: true,
    requiresReleaseSignoff: true,
    publicReleaseEligible: true,
  },
  REGULATED: {
    profile: "REGULATED",
    minRequirements: 1,
    minObligations: 1,
    approvalOwnerOnly: true,
    gateTemplates: [VERIFY_GATE, SIGNOFF_GATE],
    requiresIndependentVerification: true,
    requiresReleaseSignoff: true,
    publicReleaseEligible: true,
  },
};

export function assurancePolicy(profile: AssuranceProfile): AssurancePolicy {
  return POLICIES[profile];
}

/** Profile strength order for detecting downgrades (higher = stronger). */
const RANK: Record<AssuranceProfile, number> = {
  QUICK: 0,
  PROFESSIONAL: 1,
  RESEARCH: 2,
  REGULATED: 3,
};

export function isAssuranceDowngrade(
  from: AssuranceProfile,
  to: AssuranceProfile,
): boolean {
  return RANK[to] < RANK[from];
}
