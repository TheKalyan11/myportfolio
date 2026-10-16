import type { NextRequest } from "next/server";
import { MAX_BYTES, MediaError, clientIp, errorResponse, fetchGuarded, isMediaType, rateLimited, safeFilename } from "@/lib/mediaGuard";

/**
 * GET /api/media/download?url=…&filename=…
 * Streams an audio or video file to the browser. Every address is checked first (see mediaGuard), the response
 * must really be audio or video, and the transfer is cut off at the size limit.
 */
export async function GET(request: NextRequest) {
  try {
    if (rateLimited(clientIp(request), "download", 12, 10 * 60_000)) {
      throw new MediaError("rate_limited", "Too many downloads. Please wait a few minutes and try again.", 429);
    }
    const target = request.nextUrl.searchParams.get("url")?.trim();
    if (!target) throw new MediaError("missing_url", "No file was chosen.");
    if (target.length > 2000) throw new MediaError("invalid_url", "That link is too long.");

    const { res } = await fetchGuarded(target, {}, request.signal);
    if (res.status === 404 || res.status === 410) {
      await res.body?.cancel();
      throw new MediaError("not_found", "That file isn't available any more.", 404);
    }
    if (res.status === 401 || res.status === 403) {
      await res.body?.cancel();
      throw new MediaError("forbidden", "The server won't let us download that file.", 403);
    }
    if (!res.ok || !res.body) {
      await res.body?.cancel();
      throw new MediaError("download_failed", `The source could not send the file (error ${res.status}).`, 502);
    }

    const type = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    if (!isMediaType(type)) {
      await res.body.cancel();
      throw new MediaError("unsupported", "That file type isn't supported. Only audio and video files can be downloaded.", 415);
    }
    const length = Number(res.headers.get("content-length"));
    if (Number.isFinite(length) && length > MAX_BYTES) {
      await res.body.cancel();
      throw new MediaError("too_large", `That file is larger than the ${Math.round(MAX_BYTES / 1048576)} MB limit.`, 413);
    }

    // count bytes as they pass, so an unannounced size can't exceed the limit either
    let sent = 0;
    const limited = res.body.pipeThrough(
      new TransformStream<Uint8Array, Uint8Array>({
        transform(chunk, controller) {
          sent += chunk.byteLength;
          if (sent > MAX_BYTES) controller.error(new Error("size limit"));
          else controller.enqueue(chunk);
        },
      }),
    );

    const name = safeFilename(request.nextUrl.searchParams.get("filename") ?? "", "download");
    const headers: Record<string, string> = {
      "Content-Type": type,
      "Content-Disposition": `attachment; filename="${name.replace(/[^\x20-\x7e]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    };
    if (Number.isFinite(length) && length > 0) headers["Content-Length"] = String(length);
    return new Response(limited, { headers });
  } catch (err) {
    return errorResponse(err);
  }
}
