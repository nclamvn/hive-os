export const MISSION_VIEWS = [
  "overview",
  "contract",
  "research",
  "evidence",
  "claims",
  "build",
  "verify",
  "decisions",
  "release",
] as const;

export type MissionView = (typeof MISSION_VIEWS)[number];

export function normalizeMissionView(value?: string): MissionView {
  return MISSION_VIEWS.includes(value as MissionView)
    ? (value as MissionView)
    : "overview";
}
