import type { NextRequest } from "next/server";
import { analyzeUrl } from "@/lib/mediaAnalyze";
import { MediaError, clientIp, errorResponse, rateLimited } from "@/lib/mediaGuard";

/** GET /api/media/analyze?url=…  ->  title, thumbnail, duration and the formats the source offers. */
export async function GET(request: NextRequest) {
  try {
    if (rateLimited(clientIp(request), "analyze", 30, 10 * 60_000)) {
      throw new MediaError("rate_limited", "Too many requests. Please wait a few minutes and try again.", 429);
    }
    const url = request.nextUrl.searchParams.get("url")?.trim();
    if (!url) throw new MediaError("missing_url", "Paste a link first.");
    if (url.length > 2000) throw new MediaError("invalid_url", "That link is too long.");
    const info = await analyzeUrl(url);
    return Response.json(info, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return errorResponse(err);
  }
}
