"use client";

import { usePreferences } from "@/components/preferences/preferences-provider";

const PLANES = [
  "mission.planes.mission",
  "mission.planes.truth",
  "mission.planes.execution",
  "mission.planes.verification",
  "mission.planes.release",
] as const;

export function ProvenanceRail({
  active = 0,
  label,
}: {
  active?: number;
  label?: string;
}) {
  const { t } = usePreferences();
  return (
    <div
      role="group"
      aria-label={label ?? t("mission.provenance")}
      className="border-line bg-surface-subtle border-y px-2 py-2.5"
    >
      <ol className="provenance-rail grid grid-cols-5">
        {PLANES.map((key, index) => (
          <li
            key={key}
            className="provenance-node min-w-0 px-1 text-center"
            data-active={index === active}
            aria-current={index === active ? "step" : undefined}
          >
            <span
              className={`text-meta block truncate font-medium ${
                index === active ? "text-blue-600" : "text-ink-muted"
              }`}
            >
              {t(key)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
