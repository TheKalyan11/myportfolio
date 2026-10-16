import dns from "node:dns/promises";
import net from "node:net";

/**
 * Safety helpers for the media downloader (server only).
 *
 * The downloader fetches files on behalf of a visitor, so every address is checked before the server
 * connects to it: https only, no private or internal networks, no platform pages that forbid downloading,
 * only audio / video responses, and a size limit.
 */

export const MAX_BYTES = 500 * 1024 * 1024; // 500 MB per file
const CONNECT_TIMEOUT_MS = 15_000;
const USER_AGENT = "PortfolioMediaDownloader/1.0 (+https://kalyan-portfolio.vercel.app)";

export class MediaError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export const YOUTUBE_MESSAGE =
  "YouTube links can't be downloaded here. YouTube's Terms of Service only allow downloads that the platform itself offers, " +
  "or that the video's owner has permitted. Paste a direct link to a file you own, or an Internet Archive or Wikimedia Commons page.";

const YOUTUBE_HOSTS = ["youtube.com", "youtu.be", "youtube-nocookie.com", "googlevideo.com"];
const PLATFORM_HOSTS = [
  "instagram.com",
  "facebook.com",
  "fb.watch",
  "tiktok.com",
  "twitter.com",
  "x.com",
  "netflix.com",
  "primevideo.com",
  "hotstar.com",
  "spotify.com",
  "music.apple.com",
  "jiosaavn.com",
];

const hostMatches = (host: string, list: string[]) => list.some((h) => host === h || host.endsWith(`.${h}`));

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    );
  }
  if (net.isIPv6(ip)) {
    const v = ip.toLowerCase();
    if (v === "::" || v === "::1") return true;
    if (v.startsWith("::ffff:")) {
      const rest = v.slice(7);
      return rest.includes(".") ? isPrivateIp(rest) : true;
    }
    return /^f[cd]/.test(v) || /^fe[89ab]/.test(v) || v.startsWith("ff");
  }
  return true;
}

/** Parses and checks a user-supplied address. Throws a MediaError with a friendly message when it is not allowed. */
export async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new MediaError("invalid_url", "That doesn't look like a valid link. Paste a full address that starts with https://");
  }
  if (url.protocol !== "https:") {
    throw new MediaError("https_only", "Only secure links that start with https:// are supported.");
  }
  if (url.username || url.password || (url.port && url.port !== "443")) {
    throw new MediaError("blocked_host", "That address can't be used. Paste a normal https:// link.");
  }

  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (hostMatches(host, YOUTUBE_HOSTS)) throw new MediaError("youtube_unsupported", YOUTUBE_MESSAGE);
  if (hostMatches(host, PLATFORM_HOSTS)) {
    throw new MediaError(
      "platform_unsupported",
      "Links from streaming and social platforms can't be downloaded here. Use a direct link to a file you own or are allowed to download.",
    );
  }
  if (net.isIP(host) || host === "localhost" || /\.(localhost|local|internal|lan|home)$/.test(host) || !host.includes(".")) {
    throw new MediaError("blocked_host", "That address can't be used. Paste a public https:// link to a media file or page.");
  }

  // Resolve the name and refuse private networks. (A determined attacker could still race DNS between this
  // check and the request; production deployments should also restrict outbound traffic at the network level.)
  let addresses: { address: string }[];
  try {
    addresses = await dns.lookup(host, { all: true });
  } catch {
    throw new MediaError("unreachable", "That website could not be found. Check the link and try again.");
  }
  if (addresses.length === 0 || addresses.some((a) => isPrivateIp(a.address))) {
    throw new MediaError("blocked_host", "That address can't be used. Paste a public https:// link to a media file or page.");
  }
  return url;
}

export const isMediaType = (contentType: string | null | undefined): boolean => {
  const t = (contentType ?? "").split(";")[0].trim().toLowerCase();
  return t.startsWith("audio/") || t.startsWith("video/") || t === "application/ogg";
};

/** fetch() that checks every redirect hop, times out while connecting, and follows the caller's abort signal. */
export async function fetchGuarded(
  raw: string,
  init: RequestInit = {},
  signal?: AbortSignal,
  maxRedirects = 4,
): Promise<{ res: Response; url: URL }> {
  let current = raw;
  for (let hop = 0; hop <= maxRedirects; hop++) {
    const url = await assertPublicUrl(current);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONNECT_TIMEOUT_MS);
    const onAbort = () => controller.abort();
    signal?.addEventListener("abort", onAbort);
    let res: Response;
    try {
      res = await fetch(url, {
        ...init,
        redirect: "manual",
        cache: "no-store",
        signal: controller.signal,
        headers: { "User-Agent": USER_AGENT, Accept: "*/*", ...(init.headers as Record<string, string> | undefined) },
      });
    } catch {
      throw new MediaError("unreachable", "The source didn't respond. It may be offline, so try again later.", 502);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    }
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      current = new URL(res.headers.get("location") as string, url).toString();
      await res.body?.cancel();
      continue;
    }
    return { res, url };
  }
  throw new MediaError("too_many_redirects", "That link redirects too many times.", 502);
}

/* ---------- small in-memory rate limit (per server instance) ---------- */
const hits = new Map<string, number[]>();

export function rateLimited(ip: string, bucket: string, limit: number, windowMs: number): boolean {
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return recent.length > limit;
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0].trim() : request.headers.get("x-real-ip")) || "unknown";
}

export function errorResponse(err: unknown): Response {
  if (err instanceof MediaError) {
    return Response.json({ error: { code: err.code, message: err.message } }, { status: err.status });
  }
  console.error("media error:", err);
  return Response.json(
    { error: { code: "server_error", message: "Something went wrong on our side. Please try again." } },
    { status: 500 },
  );
}

export const safeFilename = (name: string, fallback = "download"): string => {
  const cleaned = name.replace(/[\r\n"\\/:*?<>|]+/g, "_").replace(/\s+/g, " ").trim().slice(0, 120);
  return cleaned || fallback;
};
