import {
  Boxes,
  ClipboardList,
  FileText,
  FlaskConical,
  LayoutDashboard,
  ListChecks,
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
  /** Only the Dashboard shell exists at this build stage. */
  readonly implemented: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, implemented: true },
  { label: "Missions", icon: Target, implemented: true },
  { label: "Evidence Hub", icon: FlaskConical, implemented: false },
  { label: "Claims & Insights", icon: ListChecks, implemented: false },
  { label: "Verification", icon: ShieldCheck, implemented: false },
  { label: "Observatory", icon: Radar, implemented: false },
  { label: "Reports", icon: FileText, implemented: false },
  { label: "Templates", icon: ClipboardList, implemented: false },
  { label: "Skill Library", icon: Boxes, implemented: false },
  { label: "Settings", icon: Settings, implemented: false },
];
