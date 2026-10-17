"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { CITY, EMAIL, EMAIL_ALT, PHONE, SOCIALS } from "@/data/contact";
import { INDIA_OUTLINE } from "@/data/indiaOutline";

const INK = "#0a0a0a";
const ACCENT = "#d1181f";
const NAME = "THE KALYAN";

// The race-car clip shown under the name (a file in /public).
const F1_VIDEO = "/f1-footer.mp4";

/* ------------------------------------------------------------------ */
/* A word drawn as a grid of small squares; dots near the pointer light up red. */
/* ------------------------------------------------------------------ */
function DotWord({ text }: { text: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = wrap.current;
    const cv = canvas.current;
    if (!box || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let dots: { x: number; y: number }[] = [];
    let cell = 8;
    let pointer: { x: number; y: number } | null = null;
    let width = 0;
    let height = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const reach = cell * 9;
      for (const d of dots) {
        let near = 0;
        if (pointer) {
          const dist = Math.hypot(d.x - pointer.x, d.y - pointer.y);
          near = Math.max(0, 1 - dist / reach);
        }
        const size = cell * (0.62 + 0.3 * near);
        ctx.fillStyle = near > 0.05 ? ACCENT : INK;
        ctx.fillRect(d.x - size / 2, d.y - size / 2, size, size);
      }
    };

    const build = () => {
      const dpr = window.devicePixelRatio || 1;
      width = box.clientWidth;
      if (!width) return;
      const family = getComputedStyle(box).fontFamily;

      // The letters keep their natural shape at a modest size and are spaced out to span the full width.
      const letters = [...text];
      const probe = document.createElement("canvas").getContext("2d");
      if (!probe) return;
      const fontPx = width * (width >= 900 ? 0.095 : 0.14);
      probe.font = `800 ${fontPx}px ${family}`;
      const ink = letters.map((l) => {
        const m = probe.measureText(l);
        return { l, left: m.actualBoundingBoxLeft, w: m.actualBoundingBoxLeft + m.actualBoundingBoxRight };
      });
      const margin = width * 0.006;
      const gap = (width - margin * 2 - ink.reduce((s, i) => s + i.w, 0)) / Math.max(1, letters.length - 1);
      height = Math.round(fontPx * 0.74);

      cv.width = width * dpr;
      cv.height = height * dpr;
      cv.style.width = `${width}px`;
      cv.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const o = off.getContext("2d");
      if (!o) return;
      o.font = `800 ${fontPx}px ${family}`;
      o.textAlign = "left";
      o.textBaseline = "alphabetic";
      o.fillStyle = "#000";
      let x = margin;
      for (const i of ink) {
        o.fillText(i.l, x + i.left, height * 0.97);
        x += i.w + gap;
      }
      const data = o.getImageData(0, 0, width, height).data;

      cell = Math.min(9, Math.max(3, Math.round(fontPx * 0.054)));
      dots = [];
      for (let y = cell / 2; y < height; y += cell) {
        for (let x = cell / 2; x < width; x += cell) {
          if (data[(Math.floor(y) * width + Math.floor(x)) * 4 + 3] > 128) dots.push({ x, y });
        }
      }
      draw();
    };

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
      draw();
    };
    const onLeave = () => {
      pointer = null;
      draw();
    };

    const ro = new ResizeObserver(build);
    ro.observe(box);
    document.fonts.ready.then(build);
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);
    return () => {
      ro.disconnect();
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
    };
  }, [text]);

  return (
    <div ref={wrap} className="ft-dotword" aria-label={text} role="img">
      <canvas ref={canvas} aria-hidden />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* India as a field of small dots (offset rows), with a glowing pin on the city. */
/* ------------------------------------------------------------------ */
const inRing = (px: number, py: number, ring: [number, number][]) => {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const inIndia = (lon: number, lat: number) => INDIA_OUTLINE.some((r) => inRing(lon, lat, r));

// Bounds of the outline, so the map can be fitted to its box.
const BOUNDS = (() => {
  let minLon = 180;
  let maxLon = -180;
  let minLat = 90;
  let maxLat = -90;
  for (const r of INDIA_OUTLINE)
    for (const [x, y] of r) {
      minLon = Math.min(minLon, x);
      maxLon = Math.max(maxLon, x);
      minLat = Math.min(minLat, y);
      maxLat = Math.max(maxLat, y);
    }
  return { minLon, maxLon, minLat, maxLat };
})();

function DotMap() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const pin = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = wrap.current;
    const cv = canvas.current;
    const pinEl = pin.current;
    if (!box || !cv || !pinEl) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const build = () => {
      const dpr = window.devicePixelRatio || 1;
      const W = box.clientWidth;
      const H = box.clientHeight;
      if (!W || !H) return;
      cv.width = W * dpr;
      cv.height = H * dpr;
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // a degree of longitude is shorter than a degree of latitude at India's latitude
      const kx = Math.cos((22 * Math.PI) / 180);
      const { minLon, maxLon, minLat, maxLat } = BOUNDS;
      const spanX = (maxLon - minLon) * kx;
      const spanY = maxLat - minLat;
      const padX = 14;
      const padTop = 8;
      const padBottom = 24; // leaves room for the clock
      const scale = Math.min((W - padX * 2) / spanX, (H - padTop - padBottom) / spanY);
      const mapW = spanX * scale;
      const mapH = spanY * scale;
      const offX = W - padX - mapW; // map sits on the right, like the reference
      const offY = padTop + (H - padTop - padBottom - mapH) / 2;

      // dots on offset rows, which reads as a denser, more map-like texture than a square grid
      const step = Math.max(5, Math.round(mapH / 52));
      const rowH = step * 0.86;
      const r = step * 0.34;
      ctx.fillStyle = INK;
      let row = 0;
      for (let y = offY; y <= offY + mapH; y += rowH, row++) {
        const lat = maxLat - (y - offY) / scale;
        for (let x = offX + (row % 2 ? step / 2 : 0); x <= offX + mapW; x += step) {
          const lon = minLon + (x - offX) / (kx * scale);
          if (inIndia(lon, lat)) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      pinEl.style.left = `${offX + (CITY.lon - minLon) * kx * scale}px`;
      pinEl.style.top = `${offY + (maxLat - CITY.lat) * scale}px`;
    };

    const ro = new ResizeObserver(build);
    ro.observe(box);
    build();
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrap} className="ft-map" role="img" aria-label={`Map of India with a pin on ${CITY.name}`}>
      <canvas ref={canvas} aria-hidden />
      <span ref={pin} className="ft-pin" aria-hidden />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Live clock for the city (updates every second, after hydration).   */
/* ------------------------------------------------------------------ */
function CityClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: CITY.timeZone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="ft-clock">{time || "--:--:--"}</span>;
}

// The current year, read in the browser only so the server-rendered page never freezes a stale one.
const noopSubscribe = () => () => {};
function Year() {
  const year = useSyncExternalStore(
    noopSubscribe,
    () => String(new Date().getFullYear()),
    () => "",
  );
  return <>{year}</>;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="ft-copy"
      aria-label={done ? "Copied" : label}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          window.setTimeout(() => setDone(false), 1600);
        });
      }}
    >
      {done ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Looping race-car clip that only plays while it is on screen.       */
/* ------------------------------------------------------------------ */
function RaceVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  // A silent clip that plays only while the strip is on screen.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // stays on its first frame
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      v.pause();
    };
  }, []);

  return <video ref={ref} className="ft-video" src={F1_VIDEO} muted loop playsInline preload="metadata" aria-hidden />;
}

export default function FooterSection() {
  return (
    <footer id="footer" className="ft">
      <div className="ft-top">
        <h2 className="ft-title">
          Built for speed.
          <br />
          Ready when you are.
        </h2>
        <a className="ft-cta" href={`mailto:${EMAIL}`}>
          <span className="ft-cta-arrow">
            <ArrowRight size={18} />
          </span>
          <span className="ft-cta-label">Say hello</span>
        </a>
      </div>

      <div className="ft-boxes">
        <section className="ft-box" aria-label="Contact">
          <h3 className="ft-tab">Contact</h3>
          <div className="ft-panel">
            <div className="ft-row">
              <span>{EMAIL}</span>
              <CopyButton text={EMAIL} label="Copy email address" />
            </div>
            <div className="ft-row">
              <span>{EMAIL_ALT}</span>
              <CopyButton text={EMAIL_ALT} label="Copy second email address" />
            </div>
            {PHONE && (
              <div className="ft-row">
                <span>{PHONE}</span>
                <CopyButton text={PHONE} label="Copy phone number" />
              </div>
            )}
          </div>
        </section>

        {SOCIALS.length > 0 && (
          <section className="ft-box" aria-label="Follow me">
            <h3 className="ft-tab">Follow me</h3>
            <div className="ft-panel">
              {SOCIALS.map((s) =>
                s.href ? (
                  <a key={s.label} className="ft-row ft-link" href={s.href} target="_blank" rel="noopener noreferrer">
                    <span>{s.label}</span>
                    <ArrowUpRight size={14} />
                  </a>
                ) : (
                  // no link yet: the row is shown but does nothing
                  <span key={s.label} className="ft-row ft-row-off" title="Link coming soon">
                    <span>{s.label}</span>
                    <ArrowUpRight size={14} />
                  </span>
                ),
              )}
            </div>
          </section>
        )}

        <section className="ft-box" aria-label="Location">
          <h3 className="ft-tab">Based in {CITY.country}</h3>
          <div className="ft-panel ft-panel-map">
            <DotMap />
            <span className="ft-city">{CITY.name}</span>
            <CityClock />
          </div>
        </section>

      </div>

      <DotWord text={NAME} />

      <div className="ft-strip">
        <RaceVideo />
      </div>

      <div className="ft-bar">
        <span>
          © <Year /> {NAME}
        </span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Back to top
        </a>
      </div>
    </footer>
  );
}
