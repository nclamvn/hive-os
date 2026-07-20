import Link from "next/link";

type Tab = "workspace" | "members" | "audit";

export function SettingsNav({
  slug,
  active,
  showAudit,
}: {
  slug: string;
  active: Tab;
  showAudit: boolean;
}) {
  const tabs: { key: Tab; label: string; href: string }[] = [
    { key: "workspace", label: "Workspace", href: `/w/${slug}/settings/workspace` },
    { key: "members", label: "Members", href: `/w/${slug}/settings/members` },
  ];
  if (showAudit) {
    tabs.push({ key: "audit", label: "Audit", href: `/w/${slug}/settings/audit` });
  }

  return (
    <nav aria-label="Settings" className="border-line flex gap-1 border-b">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={tab.key === active ? "page" : undefined}
          className={`text-body -mb-px border-b-2 px-3 py-2 font-medium ${
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
