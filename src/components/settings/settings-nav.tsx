import Link from "next/link";

import type { SettingsCopy } from "@/i18n/settings-copy";

type Tab = "policy" | "workspace" | "members" | "audit";

export function SettingsNav({
  slug,
  active,
  showAudit,
  copy,
}: {
  slug: string;
  active: Tab;
  showAudit: boolean;
  copy: SettingsCopy["nav"];
}) {
  const tabs: { key: Tab; label: string; href: string }[] = [
    { key: "policy", label: copy.policy, href: `/w/${slug}/settings` },
    {
      key: "workspace",
      label: copy.workspace,
      href: `/w/${slug}/settings/workspace`,
    },
    {
      key: "members",
      label: copy.members,
      href: `/w/${slug}/settings/members`,
    },
  ];
  if (showAudit) {
    tabs.push({
      key: "audit",
      label: copy.audit,
      href: `/w/${slug}/settings/audit`,
    });
  }

  return (
    <nav
      aria-label={copy.label}
      className="border-line flex w-full min-w-0 max-w-full gap-1 overflow-x-auto border-b"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={tab.key === active ? "page" : undefined}
          className={`text-body -mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2 font-medium ${
            tab.key === active
              ? "border-navy-800 text-ink-strong"
              : "text-ink-muted hover:text-ink border-transparent"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
