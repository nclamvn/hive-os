import {
  Boxes,
  ClipboardList,
  FileText,
  FlaskConical,
  LayoutDashboard,
  ListChecks,
  Network,
  type LucideIcon,
  Radar,
  Settings,
  ShieldCheck,
  Target,
} from "lucide-react";

/**
 * Canonical navigation affordances from docs/contractor/04_BLUEPRINT.md §9.
 * These are shell navigation labels only — their domain pages are NOT built
 * in TIP-002. Every destination except Dashboard resolves to a truthful
 * "not implemented in the current build stage" boundary.
 */
export interface NavItem {
  readonly label: string;
  readonly icon: LucideIcon;
  readonly implemented: boolean;
  readonly segment: "" | "missions" | "control-room" | "observatory" | "reports";
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, implemented: true, segment: "" },
  { label: "Missions", icon: Target, implemented: true, segment: "missions" },
  { label: "Evidence Hub", icon: FlaskConical, implemented: false, segment: "" },
  { label: "Claims & Insights", icon: ListChecks, implemented: false, segment: "" },
  { label: "Verification", icon: ShieldCheck, implemented: false, segment: "" },
  { label: "Control Room", icon: Network, implemented: true, segment: "control-room" },
  { label: "Observatory", icon: Radar, implemented: true, segment: "observatory" },
  { label: "Reports", icon: FileText, implemented: true, segment: "reports" },
  { label: "Templates", icon: ClipboardList, implemented: false, segment: "" },
  { label: "Skill Library", icon: Boxes, implemented: false, segment: "" },
  { label: "Settings", icon: Settings, implemented: false, segment: "" },
];
