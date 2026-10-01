import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, FlaskConical } from "lucide-react";

import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { MathText } from "@/components/research/math-text";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { getTranslator } from "@/i18n/server";
import { hasCapability } from "@/modules/identity-workspace";
import { searchDivisorLed } from "@/modules/research-sandbox/math-divisor-led";
import { parseDivisorLabQuery, replayDivisorLab } from "@/modules/research-sandbox/math-divisor-replay";
import { mixedCoreResearchPacket } from "@/modules/research-sandbox/math-mixed-core";
import { replayMixedCorePacket } from "@/modules/research-sandbox/math-mixed-core-replay";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getEnv } from "@/server/env";

export const dynamic = "force-dynamic";
const inputClass = "border-line bg-surface text-ink mt-2 min-h-11 w-full min-w-0 rounded-md border px-3 py-2 outline-none focus:border-line-strong";

export default async function MathToolsPage({ params, searchParams }: {
  params: Promise<{ workspaceSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { workspaceSlug } = await params;
  // Authentication and workspace isolation precede any arithmetic or tool dispatch.
  const data = await loadWorkspacePage(workspaceSlug);
  if (!hasCapability(data.ctx.membership.role, "research.read")) notFound();
  const env = getEnv();
  if (!["development", "test"].includes(env.NODE_ENV) ||
    (env.DEPLOYMENT_ENV && !["development", "test"].includes(env.DEPLOYMENT_ENV))) notFound();
  const { locale } = await getTranslator();
  const t = (vi: string, en: string) => locale === "vi" ? vi : en;
  const query = await searchParams;
  let scope: ReturnType<typeof parseDivisorLabQuery> | null = null;
  try { scope = parseDivisorLabQuery(query); } catch { /* Invalid input is shown, never silently recomputed. */ }
  const primary = scope ? searchDivisorLed(scope.n, scope.maxS, scope.mode) : null;
  const replay = primary ? await replayDivisorLab(primary) : null;
  const structural = scope ? mixedCoreResearchPacket() : null;
  const structuralReplay = structural ? await replayMixedCorePacket(structural) : null;
  const title = t("Bàn kiểm chứng số học", "Exact arithmetic workbench");
  const subtitle = t("Erdős–Straus · Tìm theo ước s và phát lại độc lập", "Erdős–Straus · Divisor-led search and independent replay");
  const base = `/w/${workspaceSlug}/research/math-tools`;
  const presets = [
    { n: 131433121, s: 142, mode: "ALL", label: "s ≤ 142" },
    { n: 131433121, s: 143, mode: "ALL", label: "s ≤ 143 · 11 × 13" },
    { n: 131433121, s: 143, mode: "PRIME_ONLY_DIAGNOSTIC", label: t("s ≤ 143 · chỉ nguyên tố", "s ≤ 143 · primes only") },
    { n: 131433121, s: 311, mode: "PRIME_ONLY_DIAGNOSTIC", label: t("s ≤ 311 · chỉ nguyên tố", "s ≤ 311 · primes only") },
    { n: 351121, s: 19, mode: "ALL", label: "p = 351121 · s ≤ 19" },
    { n: 351121, s: 31, mode: "ALL", label: "p = 351121 · s ≤ 31" },
  ];

  return <WorkspaceShell data={data} title={title} subtitle={subtitle}>
    <div className="mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-6 pb-8">
      <Link href={`/w/${workspaceSlug}/research/math-pilot`} className="text-meta text-ink-muted hover:text-ink inline-flex min-h-10 items-center gap-2 self-start">
        <ArrowLeft className="size-4" aria-hidden="true" /> Math Pilot
      </Link>
      <header>
        <div className="text-meta text-ink-muted mb-2 flex items-center gap-2"><FlaskConical className="size-4" aria-hidden="true" /> {t("Công cụ local · chỉ đọc", "Local tool · read only")}</div>
        <h1 className="text-page-title text-ink-strong">{title}</h1>
        <p className="text-body text-ink-muted mt-2">{subtitle}</p>
      </header>

      <Panel className="p-5 sm:p-6">
        <form key={scope ? `${scope.n}-${scope.maxS}-${scope.mode}` : "invalid"} method="get" className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_0.7fr_1.3fr_auto]">
          <label className="text-meta text-ink min-w-0 font-medium">{t("Số nguyên tố p", "Prime p")}
            <input name="n" type="number" inputMode="numeric" min="841" max="200000000" required defaultValue={scope?.n ?? 131433121} className={inputClass} />
          </label>
          <label className="text-meta text-ink min-w-0 font-medium">{t("Giới hạn s", "Bound s")}
            <input name="maxS" type="number" inputMode="numeric" min="3" max="4095" required defaultValue={scope?.maxS ?? 143} className={inputClass} />
          </label>
          <label className="text-meta text-ink min-w-0 font-medium">{t("Chế độ tìm", "Search mode")}
            <select name="mode" defaultValue={scope?.mode ?? "ALL"} className={inputClass}>
              <option value="ALL">{t("Mọi s ≡ 3 (mod 4)", "All s ≡ 3 (mod 4)")}</option>
              <option value="PRIME_ONLY_DIAGNOSTIC">{t("Chỉ s nguyên tố · đối chứng", "Prime s only · control")}</option>
            </select>
          </label>
          <Button type="submit" className="min-h-11 justify-center">{t("Tính và phát lại", "Compute and replay")}</Button>
        </form>
        <p className="text-meta text-ink-muted mt-4">{t("p ≡ 1 (mod 840), p ≤ 200.000.000; 3 ≤ s ≤ 4095. Không gọi API, không ghi hồ sơ, không kích hoạt vòng agent.", "p ≡ 1 (mod 840), p ≤ 200,000,000; 3 ≤ s ≤ 4095. No API calls, record writes, or agent-cycle dispatch.")}</p>
      </Panel>

      {!primary ? <Panel role="alert" className="p-6"><h2 className="text-section-title text-ink-strong">{t("Dữ liệu ngoài phạm vi", "Input outside scope")}</h2>
        <p className="text-body text-ink-muted mt-2">{t("Cần p là số nguyên tố thuộc lớp 1 modulo 840 và giới hạn s từ 3 đến 4095. Tham số phải đầy đủ, không lặp. Chưa chạy phép tính hay Python.", "Require a prime p congruent to 1 modulo 840 and a bound from 3 to 4095. Parameters must be complete and non-repeated. Neither computation nor Python was run.")}</p>
      </Panel> : <Panel className="min-w-0 overflow-hidden p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-section-title text-ink-strong">{primary.status === "WITNESS" ? t("Tìm được nhân chứng chính xác", "Exact witness found") : t("Chưa tìm thấy trong khoảng s", "Not found in the s interval")}</h2>
            <p className="text-meta text-ink-muted mt-2">p = {primary.n} · 3 ≤ s ≤ {primary.maxS} · {primary.mode === "ALL" ? t("mọi s hợp lệ", "all eligible s") : t("chỉ s nguyên tố", "prime s only")}</p>
          </div>
          <span role="status" className={`text-meta inline-flex items-center gap-2 ${replay?.status === "PASS" ? "text-success-600" : "text-ink"}`}>
            {replay?.status === "PASS" && <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />}
            {replay?.status === "PASS" ? t("Python độc lập: khớp", "Independent Python: matched") : replay?.status === "MISMATCH" ? t("Python: không khớp — chưa nghiệm thu", "Python: mismatch — not accepted") : t("Python: chưa xác minh", "Python: unverified")}
          </span>
        </div>
        {primary.witness ? <div className="my-5 min-w-0 text-lg sm:text-xl">
          <MathText text={`$$\\frac{4}{${primary.witness.n}} = \\frac{1}{${primary.witness.x}} + \\frac{1}{${primary.witness.y}} + \\frac{1}{${primary.witness.z}}$$`} />
          <p className="text-meta text-ink-muted mt-2 sm:hidden">{t("Vuốt ngang công thức để xem toàn bộ.", "Swipe the formula horizontally to see it in full.")}</p>
        </div> : <p className="text-body text-ink mt-5">{t("Không có nhân chứng từ họ cấu trúc chuẩn hoá trong giới hạn này. Đây không phải phản ví dụ đối với giả thuyết Erdős–Straus.", "No witness from the normalized construction family within this bound. This is not a counterexample to the Erdős–Straus conjecture.")}</p>}
        {primary.construction && <div className="border-line text-body text-ink mt-4 border-t pt-4">
          <MathText text={`$s=${primary.firstS},\\quad a=${primary.construction.a},\\quad u=${primary.construction.u},\\quad v=${primary.construction.v},\\quad k=${primary.construction.k}$`} />
          <p className="text-meta text-ink-muted mt-3">{t("s nhỏ nhất theo thứ tự tìm đã khai báo; không khẳng định mẫu số hoặc tham số là tối ưu.", "First s under the declared search order; no optimality claim for denominators or parameters.")}</p>
        </div>}
        <p className="text-meta text-ink-muted mt-5">{t("Python duyệt độc lập các cặp nhân tử; đối chiếu phạm vi, s đầu tiên, tham số, bộ mẫu số và SHA-256 của đẳng thức nguyên chính xác. Đây là kiểm chứng tính toán, không phải chứng minh hình thức Lean hoặc xác nhận tính mới.", "Python independently enumerates factor pairs; compares scope, first s, parameters, denominators, and the exact integer identity SHA-256. This is computational checking, not a Lean proof or novelty certification.")}</p>
        <details className="border-line text-meta text-ink-muted mt-5 border-t pt-4">
          <summary className="min-h-8 cursor-pointer">{t("Dấu vết kiểm chứng SHA-256", "SHA-256 verification trace")}</summary>
          <dl className="mt-3 grid gap-3 break-all">
            <div><dt>TypeScript</dt><dd className="mt-1 font-mono">{primary.digest}</dd></div>
            <div><dt>Python source</dt><dd className="mt-1 font-mono">{replay?.scriptDigest}</dd></div>
            <div><dt>Python output</dt><dd className="mt-1 font-mono">{replay?.outputDigest ?? "—"}</dd></div>
            <div><dt>Exact identity</dt><dd className="mt-1 font-mono">{primary.strictDigest ?? "—"}</dd></div>
            {replay?.mismatches.length ? <div><dt>{t("Sai khác / lý do", "Mismatch / reason")}</dt><dd>{replay.mismatches.join(", ")}</dd></div> : null}
          </dl>
        </details>
      </Panel>}

      {structural && <Panel id="mixed-core" className="min-w-0 overflow-hidden p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-section-title text-ink-strong">{t("Chứng chỉ cấu trúc · core hỗn hợp", "Structural certificates · mixed cores")}</h2>
          <span role="status" className="text-meta text-ink-muted">{structuralReplay?.status === "PASS"
            ? t("Python độc lập: khớp toàn bộ", "Independent Python: full match")
            : t("Chưa nghiệm thu · phát lại chưa khớp", "Not accepted · replay not matched")}</span>
        </div>
        <p className="text-body text-ink-muted mt-3">{t("Đo độ phức tạp bằng số prime khác nhau chia m, không phải số nhân tử của s. Hai ca khó có mức tối thiểu chính xác là 2 trong họ chuẩn hoá: loại trừ toàn bộ core một prime bằng chứng chỉ có chặn đuôi, rồi dựng nhân chứng core hai prime.", "Complexity counts distinct primes dividing m, not factors of s. Two hard cases have exact minimum 2 in the normalized family: complete single-prime-core exclusion with a tail bound, followed by a two-prime-core witness.")}</p>
        <div className="mt-5 grid gap-5">{structural.certificates.slice(0, 2).map((c) => <article key={c.p} className="border-line min-w-0 border-t pt-4">
          <h3 className="text-body text-ink-strong font-medium">p = {c.p} · {t("core tối thiểu", "minimum core support")} = {c.minimumSupport}</h3>
          <MathText className="mt-3" text={`$m=${(c.twoCore.firstS! + 1) / 4},\\quad s=${c.twoCore.firstS},\\quad a=${c.twoCore.construction!.a},\\quad u=${c.twoCore.construction!.u}$`} />
          <MathText className="mt-3" text={`$$\\frac{4}{${c.p}}=\\frac{1}{${c.twoCore.witness!.x}}+\\frac{1}{${c.twoCore.witness!.y}}+\\frac{1}{${c.twoCore.witness!.z}}$$`} />
          <p className="text-meta text-ink-muted mt-3">{t("Loại trừ core một prime", "Single-prime-core exclusion")}: {c.singleCore.candidatesChecked} {t("ca hữu hạn + chứng minh chặn đuôi", "finite cases + tail-bound proof")}. {t("Không phải tối ưu mẫu số hay chứng minh giả thuyết gốc.", "Not denominator optimality or a proof of the root conjecture.")}</p>
        </article>)}</div>
        <div className="border-line mt-5 border-t pt-4">
          <h3 className="text-body text-ink-strong font-medium">{t("Phản ví dụ cho công thức đếm quá mạnh", "Counterexample to the stronger counting formula")}</h3>
          <MathText className="mt-3" text={"$m=72\\cdot17=1224,\\quad s=4895,\\quad(72-2\\cdot17)^2-5\\cdot17^2=-1$"} />
          <p className="text-body text-ink-muted mt-3">{t("105 cặp → chặn trên 93 lớp từ quan hệ đã biết → thực tế 92 lớp. Hai cặp (72,17) và (17,72) va chạm ở lớp 3739. Không được nâng chặn trên thành đẳng thức hoặc dùng số cặp làm số lớp độc lập.", "105 pairs → upper bound 93 from the known relation → actually 92 classes. Pairs (72,17) and (17,72) collide at residue 3739. The upper bound is not an equality; pair counts are not independent class counts.")}</p>
          <p className="text-meta text-ink-muted mt-3">{t("Kiểm 1024 core nhỏ không thấy va chạm bổ sung, nhưng ca Pell lớn hơn bác bỏ suy rộng. Công cụ này có phạm vi riêng; không mở rộng giới hạn 4095 của phép tìm phía trên.", "1024 small cores show no extra collisions, but the larger Pell case disproves extrapolation. This diagnostic has a separate scope; it does not widen the search above's 4095 cap.")}</p>
        </div>
        <p className="text-meta text-ink-muted mt-5">{t("Đối chứng có core tối thiểu 1: p=351121 và p=171348241. Đây là bản xem trước chỉ đọc, không ghi sự kiện. Đợt Erdős–Straus mới sẽ tự phát lại và lưu chứng chỉ trước planner; xem hồ sơ đợt để xác nhận thực sự đã chạy. Chứng minh viết tay + phát lại số học, chưa Lean hoặc xác nhận tính mới.", "Controls with minimum core support 1: p=351121 and p=171348241. This is a read-only preview, not an event write. A new Erdős–Straus cycle replays and retains the packet before planning; inspect its ledger to confirm actual execution. Written proof + arithmetic replay, not Lean or novelty certification.")}</p>
        <details className="border-line text-meta text-ink-muted mt-4 border-t pt-4">
          <summary className="min-h-8 cursor-pointer">{t("Dấu vết chứng chỉ cấu trúc", "Structural certificate trace")}</summary>
          <dl className="mt-3 grid gap-3 break-all"><div><dt>TypeScript packet</dt><dd className="font-mono">{structural.digest}</dd></div>
            <div><dt>Python source</dt><dd className="font-mono">{structuralReplay?.scriptDigest}</dd></div>
            <div><dt>Python output</dt><dd className="font-mono">{structuralReplay?.outputDigest ?? "—"}</dd></div>
          </dl>
        </details>
      </Panel>}

      <section>
        <h2 className="text-section-title text-ink-strong">{t("Đối chứng đã giữ lại", "Retained controls")}</h2>
        <p className="text-meta text-ink-muted mt-2">{t("So sánh cùng một p khi mở rộng khoảng hoặc chỉ giữ s nguyên tố. Mỗi lựa chọn tính và phát lại mới, không nạp kết quả mẫu.", "Compare the same p across bounds or with prime-only s. Each selection computes and replays afresh, rather than loading a sample result.")}</p>
        <div className="mt-4 flex flex-wrap gap-2">{presets.map((preset) => <a key={`${preset.n}-${preset.s}-${preset.mode}`}
          href={`${base}?n=${preset.n}&maxS=${preset.s}&mode=${preset.mode}`}
          aria-current={scope?.n === preset.n && scope.maxS === preset.s && scope.mode === preset.mode ? "page" : undefined}
          className="border-line bg-surface text-meta text-ink hover:border-line-strong aria-[current=page]:border-line-strong inline-flex min-h-11 items-center rounded-md border px-3 py-2">{preset.label}</a>)}</div>
      </section>
    </div>
  </WorkspaceShell>;
}
