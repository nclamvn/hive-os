/** Fixed server-owned targets only. This is not a crawler or a model URL loader. */
export const STATUS_PUBLICATIONS = ["1107.1010", "1406.6307", "2609.09204"] as const;
export type StatusPublicationId = typeof STATUS_PUBLICATIONS[number];
export const STATUS_MAX_BYTES = 131_072;
export const STATUS_TIMEOUT_MS = 7_000;

export async function fetchFixedPublicationStatus(
  id: StatusPublicationId,
  fetcher: typeof fetch = fetch,
): Promise<{ body: string }> {
  if (!STATUS_PUBLICATIONS.includes(id)) throw new Error("PUBLICATION_NOT_ALLOWLISTED");
  const url = `https://arxiv.org/abs/${id}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), STATUS_TIMEOUT_MS);
  const cancelled = new Promise<never>((_, reject) => {
    controller.signal.addEventListener("abort", () => reject(new Error("STATUS_TIMEOUT")), { once: true });
  });
  try {
    return await Promise.race([cancelled, (async () => {
      const response = await fetcher(url, { redirect: "error", signal: controller.signal,
        headers: { accept: "text/html", "accept-encoding": "identity" } });
      // Injected collectors must satisfy the same final-host boundary as native fetch.
      if (!response.ok || response.redirected || (response.url && response.url !== url)) throw new Error("STATUS_HTTP_BOUNDARY");
      const media = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
      if (media !== "text/html") throw new Error("STATUS_MEDIA_TYPE");
      const declared = response.headers.get("content-length");
      if (declared && (!/^\d+$/.test(declared) || Number(declared) > STATUS_MAX_BYTES)) throw new Error("STATUS_SIZE_LIMIT");
      if (!response.body) throw new Error("STATUS_EMPTY_BODY");
      const reader = response.body.getReader();
      const abortReader = () => { void reader.cancel().catch(() => undefined); };
      controller.signal.addEventListener("abort", abortReader, { once: true });
      const chunks: Uint8Array[] = [];
      let size = 0;
      try {
        while (true) {
          const chunk = await reader.read();
          if (controller.signal.aborted) throw new Error("STATUS_TIMEOUT");
          if (chunk.done) break;
          size += chunk.value.byteLength;
          if (size > STATUS_MAX_BYTES) throw new Error("STATUS_SIZE_LIMIT");
          chunks.push(chunk.value);
        }
      } catch (error) {
        void reader.cancel().catch(() => undefined);
        throw error;
      } finally { controller.signal.removeEventListener("abort", abortReader); reader.releaseLock(); }
      return { body: new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)) };
    })()]);
  } finally { clearTimeout(timer); controller.abort(); }
}
