"use client";

import React, { useEffect, useRef } from "react";
import { BadgeCheck, Code2, Layers } from "lucide-react";
import { siFlutter, siGoogle } from "simple-icons";
import { prefersReducedMotion } from "@/lib/motion";

const LINES = ["Certifications"];

// Each line split into letters, numbered across both lines (spaces get -1), worked out once.
const LINE_CHARS = (() => {
  let i = 0;
  return LINES.map((line) => Array.from(line).map((ch) => ({ ch, i: ch === " " ? -1 : i++ })));
})();

type Badge = { label: string; brand?: { path: string; hex: string }; image?: string; custom?: React.ReactNode };

// HOW TO ADD YOUR OWN: copy one line below, paste it at the end of the list and change the label.
// The simplest form needs only a label and shows a check-mark badge:
//   { label: "Meta React Developer" },
// To show a logo instead, add `brand: siReact` (any icon from "simple-icons", imported above)
// or `image: "/logos/yourlogo.svg"` (a file in /public/logos).
// Only list certifications you really hold.
const BADGES: Badge[] = [
  // a credential rather than a brand: a stack of layers (the "stack" in full-stack) with a verified check
  {
    label: "Full-Stack Certified",
    custom: (
      <span className="ct-stack-icon" aria-hidden>
        <Layers strokeWidth={1.7} />
        <BadgeCheck strokeWidth={2.4} className="ct-stack-check" />
      </span>
    ),
  },
  { label: "Full-Stack Web Development Program", custom: <Code2 className="ct-plain-check" strokeWidth={2} aria-hidden /> },
  { label: "Flutter Certified", brand: siFlutter },
  { label: "AWS Certified", image: "/logos/aws.svg" },
  // AI Certified is from Google, the Generative AI Foundations Certificate from Microsoft
  { label: "AI Certified", brand: siGoogle },
  {
    label: "Generative AI Foundations Certificate",
    // simple-icons has no Microsoft logo, so its four squares are drawn here
    custom: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M2 2h9.5v9.5H2z" fill="#f25022" />
        <path d="M12.5 2H22v9.5h-9.5z" fill="#7fba00" />
        <path d="M2 12.5h9.5V22H2z" fill="#00a4ef" />
        <path d="M12.5 12.5H22V22h-9.5z" fill="#ffb900" />
      </svg>
    ),
  },
];

// Deterministic "random" numbers, so the server and the browser scatter the letters identically.
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function CertificationsSection() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  // While the section is pinned, scroll progress pulls each letter from its scattered, tilted, blurred
  // starting point into place, each starting a little after the others. The text and badges follow.
  useEffect(() => {
    const trackEl = track.current;
    const stageEl = stage.current;
    if (!trackEl || !stageEl) return;
    const chars = Array.from(stageEl.querySelectorAll<HTMLElement>(".ct-char"));
    const reduced = prefersReducedMotion();
    if (reduced) {
      chars.forEach((c) => c.style.setProperty("--t", "1"));
      stageEl.style.setProperty("--rest", "1");
      return;
    }
    const delays = chars.map((_, i) => rand(i, 4) * 0.32);

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = trackEl.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? clamp01(-rect.top / travel) : 1;
      chars.forEach((c, i) => c.style.setProperty("--t", easeOut(clamp01((p - delays[i]) / 0.5)).toFixed(3)));
      stageEl.style.setProperty("--rest", easeOut(clamp01((p - 0.72) / 0.2)).toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="certifications" className="ct" aria-labelledby="ct-heading">
      <div ref={track} className="ct-track">
        <div ref={stage} className="ct-stage">
          <h2 id="ct-heading" className="ct-title" aria-label="Certifications">
            {LINE_CHARS.map((chars, li) => (
              <span key={LINES[li]} className="ct-line" aria-hidden>
                {chars.map(({ ch, i }, j) => {
                  if (i < 0) return <span key={j} className="ct-space" />;
                  return (
                    <span
                      key={j}
                      className="ct-char"
                      style={{
                        ["--dx" as string]: `${((rand(i, 1) - 0.5) * 64).toFixed(2)}vw`,
                        // kept within about ±27vh so letters start inside the pinned frame, not above it
                        ["--dy" as string]: `${((rand(i, 2) - 0.5) * 54).toFixed(2)}vh`,
                        ["--r" as string]: `${((rand(i, 3) - 0.5) * 140).toFixed(2)}deg`,
                      }}
                    >
                      {ch}
                    </span>
                  );
                })}
              </span>
            ))}
          </h2>

          <p className="ct-sub">
            Certified by the platforms I build on, so every project is held to their standards for quality,
            performance and long-term reliability.
          </p>

          <ul className="ct-badges">
            {BADGES.map((b) => (
              <li key={b.label} className="ct-badge">
                {b.brand ? (
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d={b.brand.path} fill="currentColor" />
                  </svg>
                ) : b.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- a small static logo file
                  <img src={b.image} alt="" />
                ) : (
                  b.custom ?? <BadgeCheck className="ct-plain-check" strokeWidth={2.2} aria-hidden />
                )}
                {b.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
