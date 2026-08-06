"use client";

import {
  Activity,
  ArrowUpRight,
  FilePenLine,
  RadioTower,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { Locale } from "@/i18n/config";

type OperationRun = {
  id: string;
  status: string;
  updatedAt: Date | string;
  kind: "research" | "computation";
  label: string;
};

type OperationJob = {
  id: string;
  runId: string | null;
  status: string;
  attempts: number;
  maxAttempts: number;
  lockedBy: string | null;
  leaseExpiresAt: Date | string | null;
  updatedAt: Date | string;
};

export function MissionOperationStatus({
  locale,
  slug,
  missionId,
  hasOpenWork,
  researchRuns,
  computationRuns,
  jobs,
}: {
  locale: Locale;
  slug: string;
  missionId: string;
  hasOpenWork: boolean;
  researchRuns: Array<{
    id: string;
    question: string;
    status: string;
    updatedAt: Date | string;
  }>;
  computationRuns: Array<{
    id: string;
    kind: string;
    status: string;
    updatedAt: Date | string;
  }>;
  jobs: OperationJob[];
}) {
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());
  const runs = useMemo<OperationRun[]>(
    () =>
      [
        ...researchRuns.map((run) => ({
          id: run.id,
          status: run.status,
          updatedAt: run.updatedAt,
          kind: "research" as const,
          label: run.question,
        })),
        ...computationRuns.map((run) => ({
          id: run.id,
          status: run.status,
          updatedAt: run.updatedAt,
          kind: "computation" as const,
          label: run.kind,
        })),
      ].sort(
        (left, right) =>
          new Date(right.updatedAt).getTime() -
          new Date(left.updatedAt).getTime(),
      ),
    [computationRuns, researchRuns],
  );
  const activeRun = runs.find((run) =>
    ["QUEUED", "RUNNING"].includes(run.status),
  );
  const activeJob = activeRun
    ? jobs.find((job) => job.runId === activeRun.id)
    : undefined;
  const leaseExpired = Boolean(
    now &&
      activeJob?.status === "RUNNING" &&
      activeJob.leaseExpiresAt &&
      new Date(activeJob.leaseExpiresAt).getTime() <= now,
  );
  const state = activeRun
    ? activeRun.status === "QUEUED"
      ? activeJob && ["DEAD_LETTER", "CANCELLED"].includes(activeJob.status)
        ? "stalled"
        : "queued"
      : !activeJob || activeJob.status !== "RUNNING" || leaseExpired
        ? "stalled"
        : "running"
    : hasOpenWork
      ? "manual"
      : "idle";
  const isLive = state === "running";
  const shouldRefresh = Boolean(activeRun);
  const lastSignalAt =
    activeJob?.updatedAt ?? activeRun?.updatedAt ?? runs[0]?.updatedAt ?? null;

  useEffect(() => {
    const clock = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    if (!shouldRefresh) return;
    const refresh = window.setInterval(() => router.refresh(), 8_000);
    return () => window.clearInterval(refresh);
  }, [router, shouldRefresh]);

  const copy = operationCopy(locale, state, activeRun?.kind);
  const signal = lastSignalAt
    ? new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(lastSignalAt))
    : locale === "vi"
      ? "Chưa có tín hiệu worker"
      : "No worker signal";

  return (
    <section
      aria-live="polite"
      aria-label={locale === "vi" ? "Trạng thái vận hành" : "Operational status"}
      className="border-line bg-surface-subtle border-b px-5 py-4"
    >
      <div className="grid gap-4 min-[820px]:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)_auto] min-[820px]:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`border-line bg-surface relative mt-0.5 grid size-9 shrink-0 place-items-center rounded-md border ${isLive ? "mission-operation-live" : ""}`}
          >
            {state === "stalled" ? (
              <TriangleAlert className="text-warning-600 size-4" aria-hidden="true" />
            ) : state === "running" || state === "queued" ? (
              <RadioTower className="text-navy-700 size-4" aria-hidden="true" />
            ) : (
              <Activity className="text-ink-muted size-4" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-body text-ink-strong font-semibold">
                {copy.title}
              </p>
              <span
                className={`text-meta rounded-sm px-1.5 py-0.5 font-medium ${
                  state === "stalled"
                    ? "bg-warning-50 text-warning-600"
                    : isLive
                      ? "bg-violet-50 text-violet-600"
                      : "bg-surface-muted text-ink"
                }`}
              >
                {copy.badge}
              </span>
            </div>
            <p className="text-meta text-ink-muted mt-1 max-w-2xl">
              {copy.description}
            </p>
          </div>
        </div>

        <dl className="border-line grid grid-cols-2 border-y min-[820px]:border-y-0 min-[820px]:border-l">
          <div className="py-2 pr-3 min-[820px]:py-0 min-[820px]:pl-4">
            <dt className="text-eyebrow text-ink-muted font-medium">
              {locale === "vi" ? "Tín hiệu gần nhất" : "Latest signal"}
            </dt>
            <dd className="text-meta text-ink mt-1 tabular">{signal}</dd>
          </div>
          <div className="border-line border-l py-2 pl-3 min-[820px]:py-0 min-[820px]:pl-4">
            <dt className="text-eyebrow text-ink-muted font-medium">
              {locale === "vi" ? "Lần thử" : "Attempt"}
            </dt>
            <dd className="text-meta text-ink mt-1 tabular">
              {activeJob
                ? `${activeJob.attempts}/${activeJob.maxAttempts}`
                : locale === "vi"
                  ? "Không có job"
                  : "No job"}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-x-4 gap-y-2 min-[820px]:justify-end">
          <Link
            href={`/w/${slug}/research?missionId=${missionId}`}
            className="text-meta text-ink group inline-flex items-center gap-1 font-medium underline decoration-line-strong underline-offset-4"
          >
            {locale === "vi" ? "Mở Phòng nghiên cứu" : "Open Research Lab"}
            <ArrowUpRight
              className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <Link
            href={`/w/${slug}/authoring?missionId=${missionId}`}
            className="text-meta text-ink-muted group inline-flex items-center gap-1 font-medium hover:text-ink"
          >
            <FilePenLine className="size-3.5" aria-hidden="true" />
            {locale === "vi" ? "Soạn thảo đề án" : "Author dossier"}
          </Link>
        </div>
      </div>
      <div className="bg-line mt-4 h-px overflow-hidden" aria-hidden="true">
        <span
          className={`mission-operation-signal block h-px w-1/4 bg-violet-600 ${isLive ? "is-live" : ""}`}
        />
      </div>
    </section>
  );
}

function operationCopy(
  locale: Locale,
  state: "queued" | "running" | "stalled" | "manual" | "idle",
  kind?: "research" | "computation",
) {
  if (locale === "vi") {
    if (state === "running") {
      return {
        title:
          kind === "computation"
            ? "Sandbox đang xử lý"
            : "Worker nghiên cứu đang xử lý",
        badge: "CÓ TÍN HIỆU",
        description:
          "Job có lease hợp lệ. Màn hình tự đồng bộ mỗi 8 giây cho đến khi chuyển trạng thái.",
      };
    }
    if (state === "queued") {
      return {
        title: "Đang chờ worker nhận việc",
        badge: "ĐÃ XẾP HÀNG",
        description:
          "Yêu cầu đã vào hàng đợi bền vững nhưng chưa có adapter phù hợp nhận xử lý.",
      };
    }
    if (state === "stalled") {
      return {
        title: "Mất tín hiệu worker",
        badge: "CẦN KIỂM TRA",
        description:
          "Run báo đang chạy nhưng không còn lease worker hợp lệ. Dữ liệu vẫn được giữ lại để khôi phục hoặc xử lý lại.",
      };
    }
    if (state === "manual") {
      return {
        title: "Đang thực hiện thủ công",
        badge: "KHÔNG CÓ JOB NỀN",
        description:
          "“Đang thực hiện” chỉ ghi nhận trách nhiệm nghiệp vụ. Hệ thống chưa khởi chạy AI hoặc worker cho nhiệm vụ này.",
      };
    }
    return {
      title: "Chưa có tiến trình đang chạy",
      badge: "SẴN SÀNG",
      description:
        "Khởi tạo nghiên cứu, sandbox hoặc TIP thực thi khi bạn muốn hệ thống bắt đầu xử lý công việc.",
    };
  }

  if (state === "running") {
    return {
      title:
        kind === "computation"
          ? "Sandbox is processing"
          : "Research worker is processing",
      badge: "LIVE",
      description:
        "The job holds a valid lease. This surface refreshes every 8 seconds until its state changes.",
    };
  }
  if (state === "queued") {
    return {
      title: "Waiting for a worker",
      badge: "QUEUED",
      description:
        "The request is retained in the durable queue but no compatible adapter has claimed it yet.",
    };
  }
  if (state === "stalled") {
    return {
      title: "Worker signal lost",
      badge: "CHECK REQUIRED",
      description:
        "The run says it is active but no valid worker lease remains. Its retained state can be recovered or retried.",
    };
  }
  if (state === "manual") {
    return {
      title: "Manual work in progress",
      badge: "NO BACKGROUND JOB",
      description:
        "In progress records workflow accountability. It does not mean an AI or worker is running for this Mission.",
    };
  }
  return {
    title: "No process is running",
    badge: "READY",
    description:
      "Start research, a sandbox run, or an execution TIP when the system should begin processing work.",
  };
}
