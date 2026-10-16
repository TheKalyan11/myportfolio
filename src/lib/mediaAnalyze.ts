import { MAX_BYTES, MediaError, assertPublicUrl, fetchGuarded, isMediaType, safeFilename } from "@/lib/mediaGuard";

/**
 * Looks up what can be downloaded from a link, using each source's own public API where there is one:
 *  - Internet Archive item pages  -> archive.org metadata API (the files the item offers)
 *  - Wikimedia Commons file pages -> MediaWiki API (the original and its transcoded qualities)
 *  - a direct link to an audio or video file -> a header check of that file
 * Nothing is downloaded here; this only reads information.
 */

export interface MediaFormat {
  id: string;
  kind: "video" | "audio";
  label: string;
  ext: string;
  sizeBytes?: number;
  url: string;
  filename: string;
}

export interface MediaInfo {
  source: "archive" | "wikimedia" | "direct";
  sourceLabel: string;
  title: string;
  thumbnail?: string;
  durationSeconds?: number;
  license?: string;
  pageUrl: string;
  formats: MediaFormat[];
}

const VIDEO_EXT = ["mp4", "m4v", "webm", "ogv", "mkv", "mov", "mpeg", "mpg"];
const AUDIO_EXT = ["mp3", "ogg", "oga", "opus", "flac", "wav", "m4a"];

const extOf = (name: string) => (name.split("?")[0].split(".").pop() ?? "").toLowerCase();

const MIME_EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/ogg": "ogv",
  "video/quicktime": "mov",
  "video/x-matroska": "mkv",
  "video/mpeg": "mpeg",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/ogg": "ogg",
  "audio/opus": "opus",
  "audio/flac": "flac",
  "audio/x-flac": "flac",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/mp4": "m4a",
  "audio/aac": "aac",
  "application/ogg": "ogg",
};

const parseDuration = (v: unknown): number | undefined => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v !== "string") return undefined;
  if (v.includes(":")) {
    const parts = v.split(":").map(Number);
    if (parts.some((n) => Number.isNaN(n))) return undefined;
    return parts.reduce((total, n) => total * 60 + n, 0);
  }
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : undefined;
};

const firstString = (v: unknown): string | undefined => (Array.isArray(v) ? String(v[0] ?? "") : typeof v === "string" ? v : undefined);

async function getJson(url: string): Promise<unknown> {
  const { res } = await fetchGuarded(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    await res.body?.cancel();
    throw new MediaError("not_found", "The source could not find that item. Check the link and try again.", res.status === 404 ? 404 : 502);
  }
  try {
    return await res.json();
  } catch {
    throw new MediaError("bad_response", "The source sent a reply we couldn't read. Try again later.", 502);
  }
}

/* ---------------------------- Internet Archive ---------------------------- */
interface ArchiveFile {
  name: string;
  format?: string;
  size?: string;
  length?: string;
  height?: string;
  source?: string;
  private?: string;
}

async function analyzeArchive(id: string, pageUrl: string): Promise<MediaInfo> {
  const json = (await getJson(`https://archive.org/metadata/${encodeURIComponent(id)}`)) as {
    metadata?: Record<string, unknown>;
    files?: ArchiveFile[];
  };
  const meta = json.metadata;
  if (!meta || !json.files) throw new MediaError("not_found", "That Internet Archive item doesn't exist or isn't available.", 404);
  if (String(meta["access-restricted-item"] ?? "") === "true") {
    throw new MediaError("restricted", "That item is access-restricted by the Internet Archive and can't be downloaded here.", 403);
  }

  const formats: MediaFormat[] = [];
  let duration: number | undefined;
  for (const f of json.files) {
    if (f.private === "true" || !f.name || f.name.includes("/")) continue;
    const ext = extOf(f.name);
    const kind: "video" | "audio" | null = VIDEO_EXT.includes(ext) ? "video" : AUDIO_EXT.includes(ext) ? "audio" : null;
    if (!kind) continue;
    const sizeBytes = f.size ? Number(f.size) : undefined;
    if (sizeBytes && sizeBytes > MAX_BYTES) continue; // too large for this downloader
    const height = f.height ? Number(f.height) : undefined;
    duration ??= parseDuration(f.length);
    const label =
      kind === "video"
        ? `${height ? `${height}p ` : ""}${ext.toUpperCase()}${f.format ? ` (${f.format})` : ""}`
        : `${f.format ?? ext.toUpperCase()}`;
    formats.push({
      id: `archive:${f.name}`,
      kind,
      label,
      ext,
      sizeBytes,
      url: `https://archive.org/download/${encodeURIComponent(id)}/${encodeURIComponent(f.name)}`,
      filename: safeFilename(f.name),
    });
  }
  if (formats.length === 0) {
    throw new MediaError("no_media", "That item has no downloadable audio or video files within the size limit.", 404);
  }
  const heightOf = (m: MediaFormat) => Number(/^(\d+)p/.exec(m.label)?.[1] ?? 0);
  formats.sort((a, b) => (a.kind === b.kind ? heightOf(b) - heightOf(a) || (b.sizeBytes ?? 0) - (a.sizeBytes ?? 0) : a.kind === "video" ? -1 : 1));

  const licenseUrl = firstString(meta.licenseurl);
  return {
    source: "archive",
    sourceLabel: "Internet Archive",
    title: firstString(meta.title) ?? id,
    thumbnail: `https://archive.org/services/img/${encodeURIComponent(id)}`,
    durationSeconds: duration,
    license: licenseUrl ? licenseUrl.replace(/^https?:\/\//, "") : undefined,
    pageUrl,
    formats: formats.slice(0, 14),
  };
}

/* ---------------------------- Wikimedia Commons --------------------------- */
interface CommonsDerivative {
  src: string;
  type: string;
  transcodekey?: string;
  height?: number;
  width?: number;
}

async function analyzeCommons(fileTitle: string, pageUrl: string): Promise<MediaInfo> {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2" +
    `&titles=${encodeURIComponent(fileTitle)}&prop=videoinfo&viprop=url%7Csize%7Cmime%7Cmediatype%7Cderivatives%7Cextmetadata&viurlwidth=640`;
  const json = (await getJson(api)) as {
    query?: { pages?: { missing?: boolean; title?: string; videoinfo?: Record<string, unknown>[] }[] };
  };
  const page = json.query?.pages?.[0];
  const info = page?.videoinfo?.[0] as
    | {
        url: string;
        size?: number;
        mime: string;
        mediatype?: string;
        duration?: number;
        thumburl?: string;
        derivatives?: CommonsDerivative[];
        extmetadata?: Record<string, { value?: string }>;
      }
    | undefined;
  if (!page || page.missing || !info) throw new MediaError("not_found", "That Wikimedia Commons file doesn't exist.", 404);
  if (!isMediaType(info.mime)) {
    throw new MediaError("unsupported", "That Wikimedia Commons file isn't an audio or video file.", 415);
  }

  const baseName = (page.title ?? fileTitle).replace(/^File:/, "");
  const stem = baseName.replace(/\.[^.]+$/, "");
  const formats: MediaFormat[] = [];
  const seen = new Set<string>();
  const add = (url: string, mime: string, height: number | undefined, size: number | undefined, key?: string) => {
    const kind: "video" | "audio" = mime.startsWith("audio/") ? "audio" : "video";
    const ext = MIME_EXT[mime.split(";")[0].trim()] ?? extOf(url);
    const label = `${kind === "video" && height ? `${height}p ` : ""}${ext.toUpperCase()}`;
    const id = `commons:${key ?? "original"}`;
    if (seen.has(id) || (size && size > MAX_BYTES)) return;
    seen.add(id);
    formats.push({
      id,
      kind,
      label: key === undefined ? `${label} (original)` : label,
      ext,
      sizeBytes: size,
      url,
      filename: safeFilename(`${stem}${height && kind === "video" ? ` ${height}p` : ""}.${ext}`),
    });
  };

  for (const d of info.derivatives ?? []) {
    const isOriginal = d.transcodekey === undefined;
    add(d.src, d.type, d.height, isOriginal ? info.size : undefined, d.transcodekey);
  }
  if (formats.length === 0) add(info.url, info.mime, undefined, info.size);
  if (formats.length === 0) {
    throw new MediaError("no_media", "No downloadable version of that file is within the size limit.", 404);
  }
  const heightOf = (m: MediaFormat) => Number(/^(\d+)p/.exec(m.label)?.[1] ?? 0);
  formats.sort((a, b) => (a.kind === b.kind ? heightOf(b) - heightOf(a) : a.kind === "video" ? -1 : 1));

  const license = info.extmetadata?.LicenseShortName?.value;
  return {
    source: "wikimedia",
    sourceLabel: "Wikimedia Commons",
    title: stem.replace(/_/g, " "),
    thumbnail: info.thumburl,
    durationSeconds: info.duration,
    license,
    pageUrl,
    formats,
  };
}

/* ------------------------------ direct file link ------------------------------ */
async function analyzeDirect(url: URL): Promise<MediaInfo> {
  let res: Response;
  ({ res } = await fetchGuarded(url.toString(), { method: "HEAD" }));
  if (!res.ok) {
    // some servers refuse HEAD: ask for the first byte only
    ({ res } = await fetchGuarded(url.toString(), { headers: { Range: "bytes=0-0" } }));
    await res.body?.cancel();
  }
  if (res.status === 404 || res.status === 410) throw new MediaError("not_found", "That file isn't available any more (the server says it was not found).", 404);
  if (res.status === 401 || res.status === 403) throw new MediaError("forbidden", "The server won't let us read that file. It may need a login or doesn't allow downloads.", 403);
  if (!res.ok && res.status !== 206) throw new MediaError("unreachable", `The server answered with an error (${res.status}). Try again later.`, 502);

  const type = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!isMediaType(type)) {
    throw new MediaError(
      "unsupported",
      type.startsWith("text/html")
        ? "That link opens a web page, not a media file. Paste a direct link to an audio or video file (such as .mp4 or .mp3), or an Internet Archive or Wikimedia Commons page."
        : "That file type isn't supported. Only audio and video files can be downloaded.",
      415,
    );
  }
  const range = res.headers.get("content-range");
  const total = range ? Number(range.split("/")[1]) : Number(res.headers.get("content-length"));
  const sizeBytes = Number.isFinite(total) && total > 0 ? total : undefined;
  if (sizeBytes && sizeBytes > MAX_BYTES) {
    throw new MediaError("too_large", `That file is larger than the ${Math.round(MAX_BYTES / 1048576)} MB limit.`, 413);
  }

  const disposition = res.headers.get("content-disposition") ?? "";
  const dispName = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition)?.[1];
  const pathName = decodeURIComponent(url.pathname.split("/").pop() || "");
  const ext = MIME_EXT[type] ?? extOf(pathName) ?? "bin";
  const rawName = dispName ? decodeURIComponent(dispName) : pathName || `download.${ext}`;
  const filename = safeFilename(rawName.includes(".") ? rawName : `${rawName}.${ext}`);
  const kind: "video" | "audio" = type.startsWith("audio/") || type === "application/ogg" ? "audio" : "video";

  return {
    source: "direct",
    sourceLabel: url.hostname,
    title: filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "),
    pageUrl: url.toString(),
    formats: [
      {
        id: "direct:file",
        kind,
        label: `${ext.toUpperCase()} ${kind}`,
        ext,
        sizeBytes,
        url: url.toString(),
        filename,
      },
    ],
  };
}

/** Entry point: decides which source a link belongs to and returns what it offers. */
export async function analyzeUrl(raw: string): Promise<MediaInfo> {
  const url = await assertPublicUrl(raw);
  const host = url.hostname.toLowerCase();

  if (host === "archive.org" || host === "www.archive.org") {
    const m = /^\/(?:details|download|embed)\/([^/?#]+)/.exec(url.pathname);
    if (!m) throw new MediaError("unsupported", "Paste the address of an Internet Archive item, such as https://archive.org/details/…", 415);
    return analyzeArchive(decodeURIComponent(m[1]), `https://archive.org/details/${m[1]}`);
  }
  if (host === "commons.wikimedia.org") {
    const m = /^\/wiki\/(File:[^?#]+)/.exec(url.pathname);
    if (!m) throw new MediaError("unsupported", "Paste the address of a Wikimedia Commons file page, such as …/wiki/File:Example.webm", 415);
    return analyzeCommons(decodeURIComponent(m[1]).replace(/_/g, " "), url.toString());
  }
  return analyzeDirect(url);
}
