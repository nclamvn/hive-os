import type { AuthoringContent } from "./contracts";

function words(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

export function diffAuthoringContent(
  previous: AuthoringContent | null,
  current: AuthoringContent,
) {
  const before = new Map(
    (previous?.sections ?? []).map((section) => [section.key, section]),
  );
  const after = new Map(current.sections.map((section) => [section.key, section]));
  const keys = [...new Set([...before.keys(), ...after.keys()])];
  const sections = keys.map((key) => {
    const left = before.get(key);
    const right = after.get(key);
    const status: "ADDED" | "REMOVED" | "MODIFIED" | "UNCHANGED" = !left
      ? "ADDED"
      : !right
        ? "REMOVED"
        : left.heading !== right.heading ||
            left.body !== right.body ||
            left.kind !== right.kind
          ? "MODIFIED"
          : "UNCHANGED";
    return {
      key,
      heading: right?.heading ?? left?.heading ?? key,
      status,
      wordDelta: words(right?.body ?? "") - words(left?.body ?? ""),
    };
  });
  return {
    titleChanged: previous ? previous.title !== current.title : true,
    abstractChanged: previous ? previous.abstract !== current.abstract : true,
    citationDelta:
      current.citations.length - (previous?.citations.length ?? 0),
    sections,
    changedSectionCount: sections.filter((section) => section.status !== "UNCHANGED")
      .length,
  };
}
