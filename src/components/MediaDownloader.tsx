"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardPaste,
  Clock,
  Download,
  Film,
  Info,
  Link2,
  Loader2,
  Music2,
  ScanSearch,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import type { MediaFormat, MediaInfo } from "@/lib/mediaAnalyze";

/**
 * MusicWave Video Downloader: a window in the MusicWave style.
 * Everything it shows comes from the server: /api/media/analyze reads the source's own information, and
 * /api/media/download streams the real file, so the progress bar measures real bytes.
 */

const EXAMPLES = [
  { label: "Internet Archive example", url: "https://archive.org/details/Popeye_forPresident" },
  { label: "Wikimedia Commons example", url: "https://commons.wikimedia.org/wiki/File:Big_Buck_Bunny_4K.webm" },
];

/* ---------- live link check (the server repeats every check) ---------- */
type LinkCheck = { state: "empty" | "ok" | "warn" | "bad"; message: string };

const YOUTUBE_HOSTS = ["youtube.com", "youtu.be", "youtube-nocookie.com"];
const PLATFORM_HOSTS = ["instagram.com", "facebook.com", "fb.watch", "tiktok.com", "twitter.com", "x.com", "netflix.com", "spotify.com"];
const MEDIA_EXT = /\.(mp4|m4v|webm|ogv|mkv|mov|mpeg|mpg|mp3|ogg|oga|opus|flac|wav|m4a)$/i;
const hostIn = (host: string, list: string[]) => list.some((h) => host === h || host.endsWith(`.${h}`));

function checkLink(raw: string): LinkCheck {
  const value = raw.trim();
  if (!value) return { state: "empty", message: "" };
  let u: URL;
  try {
    u = new URL(value);
  } catch {
    return { state: "bad", message: "That isn't a valid link yet. Paste a full address that starts with https://" };
  }
  if (u.protocol !== "https:") return { state: "bad", message: "Only secure links that start with https:// are supported." };
  const host = u.hostname.toLowerCase();
  if (hostIn(host, YOUTUBE_HOSTS)) {
    return {
      state: "bad",
      message:
        "YouTube links aren't supported. Downloading from YouTube isn't allowed unless the video is yours or its owner permits it. Try an Internet Archive or Wikimedia Commons page, or a direct link to your own file.",
    };
  }
  if (hostIn(host, PLATFORM_HOSTS)) {
    return { state: "bad", message: "Links from streaming and social platforms aren't supported. Use a link to a file you own or may download." };
  }
  if ((host === "archive.org" || host === "www.archive.org") && /^\/(details|download|embed)\/[^/]+/.test(u.pathname)) {
    return { state: "ok", message: "Internet Archive item detected." };
  }
  if (host === "commons.wikimedia.org" && /^\/wiki\/File:/.test(u.pathname)) {
    return { state: "ok", message: "Wikimedia Commons file detected." };
  }
  if (MEDIA_EXT.test(u.pathname)) return { state: "ok", message: "Direct media file link. We'll check it before downloading." };
  return { state: "warn", message: "We'll check whether this link leads to an audio or video file." };
}

/* ---------- formatting ---------- */
type Dl = {
  id: string;
  phase: "connecting" | "downloading" | "saving" | "done" | "error";
  received: number;
  total: number;
  message?: string;
};

const formatBytes = (n?: number) => {
  if (!n || n <= 0) return "";
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(n < 10 * 1024 * 1024 ? 1 : 0)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const formatDuration = (s?: number) => {
  if (!s || s <= 0) return "";
  const t = Math.round(s);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = t % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
};

/** "1080p WEBM" -> { quality: "1080p", type: "WEBM" } so the quality can be shown as a badge. */
const splitLabel = (label: string) => {
  const m = /^(\d{3,4}p)\s+(.*)$/.exec(label);
  return m ? { quality: m[1], type: m[2] } : { quality: "", type: label };
};

/**
 * onClose:     shows a close button (used when the downloader is a pop-up).
 * mainSiteUrl: shows an "Open in main website" button that sends the visitor there (used when the downloader runs
 *              on its own domain, away from the main website).
 */
export default function MediaDownloader({ onClose, mainSiteUrl }: { onClose?: () => void; mainSiteUrl?: string }) {
  const [url, setUrl] = useState("");
  const [agree, setAgree] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [info, setInfo] = useState<MediaInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"video" | "audio">("video");
  const [dl, setDl] = useState<Dl | null>(null);
  const downloadAbort = useRef<AbortController | null>(null);
  const analyzeAbort = useRef<AbortController | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const check = checkLink(url);
  const canAnalyze = check.state !== "empty" && check.state !== "bad" && agree && !analyzing;

  // move focus into the window, and cancel anything still running when it closes
  useEffect(() => {
    closeRef.current?.focus();
    return () => {
      downloadAbort.current?.abort();
      analyzeAbort.current?.abort();
    };
  }, []);

  const analyze = async (raw: string) => {
    const link = raw.trim();
    if (!link) return;
    analyzeAbort.current?.abort();
    const ac = new AbortController();
    analyzeAbort.current = ac;
    downloadAbort.current?.abort();
    setAnalyzing(true);
    setError(null);
    setInfo(null);
    setDl(null);
    try {
      const res = await fetch(`/api/media/analyze?url=${encodeURIComponent(link)}`, { signal: ac.signal });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? "We couldn't read that link. Please try again.");
      const result = json as MediaInfo;
      setInfo(result);
      setTab(result.formats.some((f) => f.kind === "video") ? "video" : "audio");
    } catch (e) {
      if (ac.signal.aborted) return;
      setError(e instanceof Error ? e.message : "We couldn't read that link. Please try again.");
    } finally {
      if (!ac.signal.aborted) setAnalyzing(false);
    }
  };

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setError(null);
      } else {
        setError("Your clipboard is empty. Copy a link first.");
      }
    } catch {
      setError("The browser blocked clipboard access. Paste the link into the box with Ctrl+V.");
    }
  };

  const startDownload = async (f: MediaFormat) => {
    downloadAbort.current?.abort();
    const ac = new AbortController();
    downloadAbort.current = ac;
    setDl({ id: f.id, phase: "connecting", received: 0, total: f.sizeBytes ?? 0 });
    try {
      const res = await fetch(
        `/api/media/download?url=${encodeURIComponent(f.url)}&filename=${encodeURIComponent(f.filename)}`,
        { signal: ac.signal },
      );
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error?.message ?? "The download failed. Please try again.");
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error("Your browser can't stream this download. Try a newer browser.");
      const announced = Number(res.headers.get("content-length")) || 0;
      const total = announced || f.sizeBytes || 0;

      setDl({ id: f.id, phase: "downloading", received: 0, total });
      const chunks: Uint8Array[] = [];
      let received = 0;
      let lastPaint = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.byteLength;
        const now = performance.now();
        if (now - lastPaint > 90) {
          lastPaint = now;
          setDl({ id: f.id, phase: "downloading", received, total });
        }
      }
      if (announced && received < announced) throw new Error("The connection dropped before the file finished. Please try again.");

      setDl({ id: f.id, phase: "saving", received, total: received });
      const blob = new Blob(chunks as BlobPart[], { type: res.headers.get("content-type") ?? "application/octet-stream" });
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = f.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 10_000);
      setDl({ id: f.id, phase: "done", received, total: received });
    } catch (e) {
      if (ac.signal.aborted) {
        setDl(null);
        return;
      }
      setDl({
        id: f.id,
        phase: "error",
        received: 0,
        total: 0,
        message: e instanceof Error ? e.message : "The download failed. Please try again.",
      });
    }
  };

  const video = info?.formats.filter((f) => f.kind === "video") ?? [];
  const audio = info?.formats.filter((f) => f.kind === "audio") ?? [];
  const shown = (tab === "video" && video.length > 0) || audio.length === 0 ? video : audio;
  const shownKind = shown === video ? "video" : "audio";

  const renderRow = (f: MediaFormat) => {
    const active = dl && dl.id === f.id ? dl : null;
    const busy = !!active && (active.phase === "connecting" || active.phase === "downloading" || active.phase === "saving");
    const pct = active && active.total > 0 ? Math.min(100, Math.round((active.received / active.total) * 100)) : null;
    const { quality, type } = splitLabel(f.label);
    return (
      <li key={f.id} className={`dl-format ${active ? "is-active" : ""}`}>
        <div className="dl-format-main">
          <span className="dl-format-icon" aria-hidden>
            {f.kind === "video" ? <Film size={17} /> : <Music2 size={17} />}
          </span>
          <span className="dl-format-text">
            <span className="dl-format-title">
              {quality && <span className="dl-quality">{quality}</span>}
              <strong>{type}</strong>
            </span>
            <span className="dl-format-sub">{formatBytes(f.sizeBytes) || "Size shown while downloading"}</span>
          </span>
          {busy ? (
            <button type="button" className="dl-btn dl-btn-ghost" onClick={() => downloadAbort.current?.abort()}>
              <X size={14} /> Cancel
            </button>
          ) : (
            <button type="button" className="dl-btn dl-btn-go" onClick={() => startDownload(f)} aria-label={`Download ${f.label}`}>
              <Download size={14} /> {active?.phase === "error" ? "Retry" : active?.phase === "done" ? "Again" : "Download"}
            </button>
          )}
        </div>

        {active && (
          <div className="dl-progress" role="status" aria-live="polite">
            {active.phase !== "error" && active.phase !== "done" && (
              <div className="dl-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct ?? undefined}>
                <span className={`dl-fill ${pct === null ? "indeterminate" : ""}`} style={pct === null ? undefined : { width: `${pct}%` }} />
              </div>
            )}
            <p className={`dl-status ${active.phase}`}>
              {active.phase === "connecting" && (
                <>
                  <Loader2 size={14} className="dl-spin" /> Connecting to the source…
                </>
              )}
              {active.phase === "downloading" && (
                <>
                  <Loader2 size={14} className="dl-spin" /> Downloading{pct !== null ? ` ${pct}%` : ""} · {formatBytes(active.received)}
                  {active.total > 0 ? ` of ${formatBytes(active.total)}` : ""}
                </>
              )}
              {active.phase === "saving" && (
                <>
                  <Loader2 size={14} className="dl-spin" /> Saving the file…
                </>
              )}
              {active.phase === "done" && (
                <>
                  <CheckCircle2 size={14} /> Downloaded {formatBytes(active.received)}. Saved as {f.filename}
                </>
              )}
              {active.phase === "error" && (
                <>
                  <XCircle size={14} /> {active.message}
                </>
              )}
            </p>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="dl-window" role={onClose ? "dialog" : "region"} aria-modal={onClose ? true : undefined} aria-label="MusicWave Video Downloader" onClick={(e) => e.stopPropagation()}>
      <header className="dl-top">
        <div className="dl-brand">
          <span className="dl-brand-icon" aria-hidden>
            <Download size={18} />
          </span>
          <span className="dl-brand-name">
            MusicWave <em>Downloader</em>
          </span>
          <span className="dl-dev-badge">Still under development</span>
        </div>
        <div className="dl-top-actions">
          {mainSiteUrl && (
            <a className="dl-main-link" href={mainSiteUrl}>
              <span className="dl-main-long">Open in main website</span>
              <span className="dl-main-short">Main website</span>
              <ArrowUpRight size={15} aria-hidden />
            </a>
          )}
          {onClose && (
            <button ref={closeRef} type="button" className="dl-close" onClick={onClose} aria-label="Close downloader">
              <X size={16} />
            </button>
          )}
        </div>
      </header>

      <div className="dl-scroll">
        <div className="dl-gif-wrap">
          <div className="dl-gif">
            <iframe
              src="https://giphy.com/embed/v2JqIt9EQKMFb1bGUh"
              title="Funny GIF"
              loading="lazy"
              referrerPolicy="no-referrer"
              allowFullScreen
            />
          </div>
          <a
            className="dl-gif-credit"
            href="https://giphy.com/gifs/cc0studios-mfer-normal-mfercoin-v2JqIt9EQKMFb1bGUh"
            target="_blank"
            rel="noopener noreferrer"
          >
            via GIPHY
          </a>
        </div>
        <section className="dl-hero">
          <h2>Paste a link. Pick a format. Download.</h2>
          <p>Your own files and openly licensed media, straight from the source.</p>

          <div className={`dl-field ${check.state}`}>
            <Link2 size={18} aria-hidden />
            <input
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="Paste a video or audio link…"
              aria-label="Link to analyze"
              aria-invalid={check.state === "bad"}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canAnalyze) analyze(url);
              }}
            />
            {url ? (
              <button type="button" className="dl-field-btn" onClick={() => { setUrl(""); setError(null); }} aria-label="Clear link">
                <X size={14} /> Clear
              </button>
            ) : (
              <button type="button" className="dl-field-btn" onClick={paste} aria-label="Paste from clipboard">
                <ClipboardPaste size={14} /> Paste
              </button>
            )}
          </div>

          <div className={`dl-check ${check.state}`} role="status" aria-live="polite">
            {check.state === "ok" && <CheckCircle2 size={15} aria-hidden />}
            {check.state === "warn" && <Info size={15} aria-hidden />}
            {check.state === "bad" && <AlertCircle size={15} aria-hidden />}
            <span>{check.message}</span>
          </div>

          <label className="dl-consent">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span className="dl-box" aria-hidden>
              <CheckCircle2 size={14} />
            </span>
            <span>I own this content, have permission to download it, or it is openly licensed.</span>
          </label>

          <div className="dl-actions">
            <button type="button" className="dl-analyze" disabled={!canAnalyze} onClick={() => analyze(url)}>
              {analyzing ? (
                <>
                  <Loader2 size={17} className="dl-spin" /> Analyzing…
                </>
              ) : (
                <>
                  <ScanSearch size={17} /> Analyze Video
                </>
              )}
            </button>
            <div className="dl-examples">
              <span>Try an example</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.url}
                  type="button"
                  className="dl-chip"
                  disabled={analyzing}
                  onClick={() => {
                    setUrl(ex.url);
                    setAgree(true); // the examples are openly licensed or public domain
                    analyze(ex.url);
                  }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {error && (
          <div className="dl-error" role="alert">
            <AlertCircle size={18} aria-hidden />
            <div>
              <strong>We couldn&apos;t use that link</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {info && (
          <section className="dl-result" aria-label="Video information">
            <div className="dl-info">
              <div className="dl-thumb-wrap">
                {info.thumbnail ? (
                  <Image src={info.thumbnail} alt="" width={240} height={135} className="dl-thumb" unoptimized />
                ) : (
                  <span className="dl-thumb dl-thumb-empty" aria-hidden>
                    <Film size={28} />
                  </span>
                )}
                {info.durationSeconds ? (
                  <span className="dl-duration">
                    <Clock size={12} aria-hidden /> {formatDuration(info.durationSeconds)}
                  </span>
                ) : null}
              </div>
              <div className="dl-info-text">
                <h3>{info.title}</h3>
                <p>
                  <span className="dl-badge">{info.sourceLabel}</span>
                  {info.license ? <span className="dl-badge dl-badge-soft">License: {info.license}</span> : null}
                  <span className="dl-badge dl-badge-soft">
                    {info.formats.length} format{info.formats.length === 1 ? "" : "s"} available
                  </span>
                </p>
              </div>
            </div>

            <div className="dl-tabs" role="tablist" aria-label="Format type">
              <button
                type="button"
                role="tab"
                aria-selected={shownKind === "video"}
                className={shownKind === "video" ? "active" : ""}
                disabled={video.length === 0}
                onClick={() => setTab("video")}
              >
                <Film size={14} /> Video <span>{video.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={shownKind === "audio"}
                className={shownKind === "audio" ? "active" : ""}
                disabled={audio.length === 0}
                onClick={() => setTab("audio")}
              >
                <Music2 size={14} /> Audio <span>{audio.length}</span>
              </button>
            </div>

            <ul className="dl-formats">{shown.map(renderRow)}</ul>
            {audio.length === 0 && (
              <p className="dl-note">
                <Info size={14} aria-hidden /> This source has no separate audio file, so only video formats are listed.
              </p>
            )}
          </section>
        )}

        <p className="dl-dev-note">
          <Info size={15} aria-hidden />
          <span>This downloader is still under development. Some features may change, and some sources or formats may not work yet.</span>
        </p>

        <p className="dl-legal">
          <ShieldCheck size={15} aria-hidden />
          <span>
            Only your own files and openly licensed or public-domain media can be downloaded. YouTube and other streaming platforms
            are not supported. Qualities and formats are exactly what the source offers.
          </span>
        </p>
      </div>
    </div>
  );
}
