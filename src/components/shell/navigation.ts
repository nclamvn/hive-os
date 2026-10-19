import {
  Boxes,
  ClipboardList,
  FileText,
  FilePenLine,
  FlaskConical,
  LayoutDashboard,
  ListChecks,
  Network,
  PlaySquare,
  type LucideIcon,
  Radar,
  Microscope,
  Settings,
  ShieldCheck,
  Target,
} from "lucide-react";

import type { MessageKey } from "@/i18n/config";

/**
 * Canonical navigation affordances from docs/contractor/04_BLUEPRINT.md §9.
 * `implemented` is the product-truth boundary: live destinations are links,
 * while planned destinations remain explicit disabled controls.
 */
export interface NavItem {
  readonly label: string;
  readonly labelKey: MessageKey;
  readonly group: "command" | "truth" | "assurance" | "system";
  readonly icon: LucideIcon;
  readonly implemented: boolean;
  readonly segment:
    | ""
    | "missions"
    | "authoring"
    | "research"
    | "evidence"
    | "claims"
    | "execution"
    | "verification"
    | "control-room"
    | "observatory"
    | "reports"
    | "templates"
    | "skills"
    | "settings";
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    label: "Dashboard",
    labelKey: "nav.dashboard",
    group: "command",
    icon: LayoutDashboard,
    implemented: true,
    segment: "",
  },
  {
    label: "Missions",
    labelKey: "nav.missions",
    group: "command",
    icon: Target,
    implemented: true,
    segment: "missions",
  },
  {
    label: "Governed authoring",
    labelKey: "nav.authoring",
    group: "command",
    icon: FilePenLine,
    implemented: true,
    segment: "authoring",
  },
  {
    label: "Research",
    labelKey: "nav.research",
    group: "truth",
    icon: Microscope,
    implemented: true,
    segment: "research",
  },
  {
    label: "Evidence Hub",
    labelKey: "nav.evidence",
    group: "truth",
    icon: FlaskConical,
    implemented: true,
    segment: "evidence",
  },
  {
    label: "Claims & Insights",
    labelKey: "nav.claims",
    group: "truth",
    icon: ListChecks,
    implemented: true,
    segment: "claims",
  },
  {
    label: "Execution",
    labelKey: "nav.execution",
    group: "assurance",
    icon: PlaySquare,
    implemented: true,
    segment: "execution",
  },
  {
    label: "Verification",
    labelKey: "nav.verification",
    group: "assurance",
    icon: ShieldCheck,
    implemented: true,
    segment: "verification",
  },
  {
    label: "Control Room",
    labelKey: "nav.controlRoom",
    group: "command",
    icon: Network,
    implemented: true,
    segment: "control-room",
  },
  {
    label: "Observatory",
    labelKey: "nav.observatory",
    group: "truth",
    icon: Radar,
    implemented: true,
    segment: "observatory",
  },
  {
    label: "Reports",
    labelKey: "nav.reports",
    group: "assurance",
    icon: FileText,
    implemented: true,
    segment: "reports",
  },
  {
    label: "Templates",
    labelKey: "nav.templates",
    group: "system",
    icon: ClipboardList,
    implemented: true,
    segment: "templates",
  },
  {
    label: "Skill Library",
    labelKey: "nav.skills",
    group: "system",
    icon: Boxes,
    implemented: true,
    segment: "skills",
  },
  {
    label: "Settings",
    labelKey: "nav.settings",
    group: "system",
    icon: Settings,
    implemented: true,
    segment: "settings",
  },
];

/** Match a module and its descendants, but never mark the workspace root twice. */
export function isNavigationActive(pathname: string, href: string): boolean {
  return pathname === href ||
    (/^\/w\/[^/]+\/[^/]+$/.test(href) && pathname.startsWith(`${href}/`));
}
