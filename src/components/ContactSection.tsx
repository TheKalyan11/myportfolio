"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { EMAIL } from "@/data/contact"; // where messages go; edit it in src/data/contact.ts


// Sky video in /public (a free-to-use Pexels clip), looped without a visible restart (see the effect below).
// Set this to "" to use the animated sky drawn by this component instead, which is also what shows if the
// video ever fails to load.
const SKY_VIDEO = "/sky.mp4";

const REASONS = ["Freelance project", "Role / Opportunity", "Just saying hi"];

// Tileable cloud texture drawn once in the browser (layered value noise), so the clouds can drift forever
// without a visible seam and without shipping an image or video file.
function makeClouds(seed: number, size = 256, freq = 4): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(size, size);

  const hash = (x: number, y: number, period: number) => {
    const px = ((x % period) + period) % period;
    const py = ((y % period) + period) % period;
    const n = Math.sin(px * 127.1 + py * 311.7 + seed * 74.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const noise = (x: number, y: number, period: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = smooth(x - xi);
    const yf = smooth(y - yi);
    const a = hash(xi, yi, period);
    const b = hash(xi + 1, yi, period);
    const c = hash(xi, yi + 1, period);
    const d = hash(xi + 1, yi + 1, period);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let v = 0;
      let amp = 0.5;
      let f = freq;
      let norm = 0;
      for (let o = 0; o < 5; o++) {
        v += noise((x / size) * f, (y / size) * f, f) * amp;
        norm += amp;
        amp *= 0.5;
        f *= 2;
      }
      v /= norm;
      const alpha = Math.min(1, Math.max(0, (v - 0.46) * 3.4));
      const shade = 232 + 23 * v; // slightly grey in the thin parts, white in the dense ones
      const i = (y * size + x) * 4;
      img.data[i] = shade;
      img.data[i + 1] = shade;
      img.data[i + 2] = Math.min(255, shade + 4);
      img.data[i + 3] = Math.pow(alpha, 1.15) * 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL("image/png");
}

export default function ContactSection() {
  const root = useRef<HTMLElement>(null);
  const topVideo = useRef<HTMLVideoElement>(null);
  const bottomVideo = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"idle" | "opening">("idle");
  const [videoFailed, setVideoFailed] = useState(false);
  const useVideo = Boolean(SKY_VIDEO) && !videoFailed;

  // Seamless loop. A video that simply loops jumps visibly when it restarts, so two copies play half a clip
  // apart. The bottom copy is always fully visible; the top copy fades out as it nears its end and fades back
  // in after it restarts. Whenever the top copy jumps back to the start it is invisible, and whenever the
  // bottom copy jumps the top copy is fully covering it, so the sky never seems to replay.
  useEffect(() => {
    if (!useVideo) return;
    const top = topVideo.current;
    const bottom = bottomVideo.current;
    if (!top || !bottom) return;

    // Visitors who prefer reduced motion get a still frame instead of a moving sky.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      top.style.opacity = "1";
      top.pause();
      bottom.pause();
      return;
    }

    let ready = false;
    const prepare = () => {
      if (ready || !Number.isFinite(top.duration) || !Number.isFinite(bottom.duration)) return;
      ready = true;
      bottom.currentTime = top.duration / 2; // the bottom copy runs half a clip ahead
    };
    top.addEventListener("loadedmetadata", prepare);
    bottom.addEventListener("loadedmetadata", prepare);
    prepare();

    const tick = () => {
      const D = top.duration;
      if (!ready || !Number.isFinite(D) || D <= 0) return;
      const t = top.currentTime;
      const fade = Math.min(1.5, D * 0.2); // seconds spent fading at each end
      const k = Math.min(1, Math.max(0, Math.min(t, D - t) / fade));
      const opacity = k * k * (3 - 2 * k);
      top.style.opacity = opacity.toFixed(3);

      // Keep the copies exactly half a clip apart. Correct only while the top copy hides the bottom one.
      if (opacity > 0.98) {
        const want = (t + D / 2) % D;
        let diff = bottom.currentTime - want;
        if (diff > D / 2) diff -= D;
        if (diff < -D / 2) diff += D;
        if (Math.abs(diff) > 0.12) bottom.currentTime = want;
      }
    };
    // A plain timer (about 30 updates a second) is smooth enough for a slow fade and, unlike animation
    // frames, keeps running in every browser and embedded preview.
    const timer = window.setInterval(tick, 33);

    return () => {
      window.clearInterval(timer);
      top.removeEventListener("loadedmetadata", prepare);
      bottom.removeEventListener("loadedmetadata", prepare);
    };
  }, [useVideo]);

  useEffect(() => {
    const el = root.current;
    if (!el || useVideo) return;
    el.style.setProperty("--cloud-a", `url(${makeClouds(3, 256, 4)})`);
    el.style.setProperty("--cloud-b", `url(${makeClouds(11, 256, 3)})`);
    el.style.setProperty("--cloud-c", `url(${makeClouds(19, 256, 5)})`);
  }, [useVideo]);

  // No server needed: pressing Send opens the visitor's email app with their details filled in.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const subject = `${get("reason") || "Hello"} from ${get("name")}`;
    const lines = [`Name: ${get("name")}`, `Email: ${get("email")}`];
    if (get("phone")) lines.push(`Phone: ${get("phone")}`);
    const body = [...lines, "", get("message")].join("\n");
    setStatus("opening");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section ref={root} id="contact" className="cn" aria-labelledby="cn-heading">
      <div className="cn-sky" aria-hidden>
        {useVideo ? (
          <>
            <video
              ref={bottomVideo}
              className="cn-video"
              src={SKY_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onError={() => setVideoFailed(true)}
            />
            <video
              ref={topVideo}
              className="cn-video cn-video-top"
              src={SKY_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onError={() => setVideoFailed(true)}
            />
          </>
        ) : (
          <>
            <span className="cn-cloud cn-cloud-a" />
            <span className="cn-cloud cn-cloud-b" />
            <span className="cn-cloud cn-cloud-c" />
          </>
        )}
      </div>

      <div className="cn-card">
        <p className="cn-kicker">(LEAVE YOUR DETAILS)</p>
        <h2 id="cn-heading" className="cn-title">
          Let&apos;s build something
        </h2>
        <p className="cn-write">
          Or just write: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>

        <form className="cn-form" onSubmit={onSubmit}>
          <label className="cn-field">
            <span>Name</span>
            <input name="name" type="text" placeholder="Your full name" required autoComplete="name" />
          </label>
          <label className="cn-field">
            <span>Email</span>
            <input name="email" type="email" placeholder="name@company.com" required autoComplete="email" />
          </label>
          <label className="cn-field">
            <span>Phone</span>
            <input name="phone" type="tel" placeholder="+91" autoComplete="tel" />
          </label>
          <label className="cn-field">
            <span>Reason</span>
            <select name="reason" defaultValue={REASONS[2]}>
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="cn-field cn-wide">
            <span>Message</span>
            <input name="message" type="text" placeholder="A few words" required />
          </label>

          <div className="cn-actions">
            <button type="submit" className="cn-send">
              {status === "opening" ? "Opening your email…" : "Send Details"} <ArrowRight size={16} />
            </button>
            <span className="cn-note">I read every message and reply myself.</span>
          </div>
          <p className="cn-fine">Sending opens your email app with these details. Nothing is stored on this site.</p>
        </form>
      </div>
    </section>
  );
}
