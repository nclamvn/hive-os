import { createElement, type MouseEvent } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ButtonProps } from "@/components/ui/button";

const state = vi.hoisted(() => ({
  locale: "en" as "en" | "vi",
  busy: false,
  error: null as string | null,
  buttons: [] as ButtonProps[],
  refresh: vi.fn(),
  submit: vi.fn(),
  approve: vi.fn(),
  block: vi.fn(),
  localizeError: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: state.refresh }) }));
vi.mock("@/components/preferences/preferences-provider", () => ({
  usePreferences: () => ({ locale: state.locale }),
}));
vi.mock("@/app/actions/missions", () => ({
  submitContractAction: state.submit,
  approveContractAction: state.approve,
  blockMissionAction: state.block,
}));
vi.mock("@/i18n/action-errors", () => ({ localizedActionError: state.localizeError }));
// Keep real server rendering and Button styles; capture handlers without any
// live mission mutation. Seed pending/error states that SSR cannot transition.
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useState: (initial: unknown) => actual.useState(
      typeof initial === "boolean" ? state.busy : state.error,
    ),
  };
});
vi.mock("@/components/ui/button", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/button")>();
  return {
    ...actual,
    Button: (props: ButtonProps) => {
      state.buttons.push(props);
      return actual.Button(props);
    },
  };
});

import { MissionActions } from "@/components/mission/mission-actions";

function render(status = "SCOPED", canApprove = true) {
  state.buttons = [];
  return renderToStaticMarkup(createElement(MissionActions, {
    slug: "lab", missionId: "mission-1", status, canApprove,
  }));
}

describe.each(["en", "vi"] as const)("mission peer actions (%s)", (locale) => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.locale = locale;
    state.busy = false;
    state.error = null;
    for (const action of [state.submit, state.approve, state.block]) {
      action.mockResolvedValue({ ok: true });
    }
    state.localizeError.mockReturnValue("Localized failure");
  });

  it("uses equal peer tracks, deliberate mobile stacking, and shared 40px branding", () => {
    const html = render();
    expect(html).toContain("grid grid-cols-1 gap-2");
    expect(html).toContain("min-[760px]:auto-cols-fr");
    expect(html).toContain("min-[760px]:grid-flow-col");
    expect(html).toContain("min-[760px]:grid-cols-none");
    expect(html).not.toContain("flex-wrap");
    expect(html.match(/h-10/g)).toHaveLength(2);
    expect(html).toContain("bg-navy-800 text-white");
    expect(html).toContain("border border-line bg-surface text-ink");
    expect(state.buttons.map((button) => button.children)).toEqual(
      locale === "vi" ? ["Gửi rà soát", "Chặn"] : ["Submit for review", "Block"],
    );
  });

  it.each([
    ["INTAKE", true, ["secondary"]],
    ["SCOPED", false, ["primary", "secondary"]],
    ["CONTRACT_REVIEW", true, ["primary", "secondary"]],
    ["CONTRACT_REVIEW", false, ["secondary"]],
    ["APPROVED", true, ["secondary"]],
    ["BLOCKED", true, []],
    ["BUILDING", true, []],
    ["RELEASED", true, []],
  ] as const)("preserves %s action visibility (canApprove=%s)", (status, canApprove, variants) => {
    const html = render(status, canApprove);
    expect(state.buttons.map((button) => button.variant)).toEqual(variants);
    expect((html.match(/<button /g) ?? []).length).toBe(variants.length);
    // No fixed two-column definition can reserve a missing peer's slot.
    expect(html).not.toContain("grid-cols-2");
  });

  it("retains approval labels and disables every peer while busy", () => {
    state.busy = true;
    const html = render("CONTRACT_REVIEW");
    expect(state.buttons[0].children).toBe(locale === "vi" ? "Duyệt hợp đồng" : "Approve contract");
    expect(state.buttons.every((button) => button.disabled)).toBe(true);
    expect(html.match(/disabled=""/g)).toHaveLength(2);
  });

  it.each([
    ["SCOPED", 0, "submit"],
    ["CONTRACT_REVIEW", 0, "approve"],
    ["SCOPED", 1, "block"],
  ] as const)("dispatches the existing %s action at index %s", async (status, index, action) => {
    render(status);
    await state.buttons[index].onClick?.({} as MouseEvent<HTMLButtonElement>);
    const args = action === "block"
      ? ["lab", "mission-1", locale === "vi" ? "bị người vận hành chặn" : "blocked by operator"]
      : ["lab", "mission-1"];
    expect(state[action]).toHaveBeenCalledExactlyOnceWith(...args);
    for (const other of ["submit", "approve", "block"] as const) {
      if (other !== action) expect(state[other]).not.toHaveBeenCalled();
    }
    expect(state.refresh).toHaveBeenCalledOnce();
  });

  it("localizes failure without refreshing and keeps the alert outside peer sizing", async () => {
    const failure = { ok: false, errorCode: "FORBIDDEN" };
    state.submit.mockResolvedValue(failure);
    render();
    await state.buttons[0].onClick?.({} as MouseEvent<HTMLButtonElement>);
    expect(state.localizeError).toHaveBeenCalledExactlyOnceWith(locale, failure);
    expect(state.refresh).not.toHaveBeenCalled();
    state.error = "Localized failure";
    const html = render();
    expect(html).toMatch(/<\/button><\/div><span role="alert"/);
    expect(html).toContain("Localized failure");
  });
});
