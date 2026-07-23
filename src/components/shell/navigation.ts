import {
  Boxes,
  ClipboardList,
  FileText,
  FlaskConical,
  LayoutDashboard,
  ListChecks,
  Network,
  PlaySquare,
  type LucideIcon,
  Radar,
  Settings,
  ShieldCheck,
  Target,
} from "lucide-react";

/**
 * Canonical navigation affordances from docs/contractor/04_BLUEPRINT.md §9.
 * `implemented` is the product-truth boundary: live destinations are links,
 * while planned destinations remain explicit disabled controls.
 */
export interface NavItem {
  readonly label: string;
  readonly icon: LucideIcon;
  readonly implemented: boolean;
  readonly segment:
    | ""
    | "missions"
    | "evidence"
    | "claims"
    | "execution"
    | "control-room"
    | "observatory"
    | "reports"
    | "templates"
    | "skills";
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, implemented: true, segment: "" },
  { label: "Missions", icon: Target, implemented: true, segment: "missions" },
  { label: "Evidence Hub", icon: FlaskConical, implemented: true, segment: "evidence" },
  { label: "Claims & Insights", icon: ListChecks, implemented: true, segment: "claims" },
  { label: "Execution", icon: PlaySquare, implemented: true, segment: "execution" },
  { label: "Verification", icon: ShieldCheck, implemented: false, segment: "" },
  { label: "Control Room", icon: Network, implemented: true, segment: "control-room" },
  { label: "Observatory", icon: Radar, implemented: true, segment: "observatory" },
  { label: "Reports", icon: FileText, implemented: true, segment: "reports" },
  { label: "Templates", icon: ClipboardList, implemented: true, segment: "templates" },
  { label: "Skill Library", icon: Boxes, implemented: true, segment: "skills" },
  { label: "Settings", icon: Settings, implemented: false, segment: "" },
];
