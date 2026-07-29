"use client";

import { useRouter } from "next/navigation";

import { usePreferences } from "@/components/preferences/preferences-provider";

export interface WorkspaceOption {
  slug: string;
  name: string;
}

export interface WorkspaceSwitcherProps {
  current: WorkspaceOption;
  workspaces: WorkspaceOption[];
}

/**
 * Accessible workspace switcher. With a single workspace it is a static label;
 * with more than one it is a native select that navigates on change (keyboard
 * operable by default).
 */
export function WorkspaceSwitcher({
  current,
  workspaces,
}: WorkspaceSwitcherProps) {
  const router = useRouter();
  const { t } = usePreferences();

  if (workspaces.length <= 1) {
    return (
      <div>
        <span className="text-eyebrow text-ink-muted block">
          {t("common.workspace")}
        </span>
        <span className="text-body text-ink-strong block truncate font-medium">
          {current.name}
        </span>
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor="workspace-switcher"
        className="text-eyebrow text-ink-muted block"
      >
        {t("common.workspace")}
      </label>
      <select
        id="workspace-switcher"
        value={current.slug}
        onChange={(e) => router.push(`/w/${e.target.value}`)}
        className="text-body text-ink-strong border-line bg-surface mt-1 h-9 w-full rounded-md border px-2 font-medium"
      >
        {workspaces.map((w) => (
          <option key={w.slug} value={w.slug}>
            {w.name}
          </option>
        ))}
      </select>
    </div>
  );
}
