"use client";

import React, { useEffect, useState } from "react";
import { SIGNATURE } from "@/data/signature";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The opening screen: a red page where the signature writes itself, then the page slides up to reveal the site.
 * It plays every time the website is opened or reloaded, but not again when moving between pages inside the site.
 * Visitors who prefer reduced motion never see it (the stylesheet hides it). Click the screen to skip.
 */

// true once it has played in this page load (a full reload resets it)
let played = false;

const DRAW_SECONDS = 4; // time to write the whole signature
const HOLD_MS = 650; // pause on the finished signature
const LEAVE_MS = 900; // the slide up

const total = SIGNATURE.strokes.reduce((sum, s) => sum + s.len, 0);
// The pen eases in at the first stroke and eases out at the last (sine curve over the whole signature); inside each stroke the
// speed is constant, so the line flows from one stroke into the next without stopping.
const ease = (p: number) => 0.5 - 0.5 * Math.cos(Math.PI * p);
let cursor = 0;
const TIMING = SIGNATURE.strokes.map((s) => {
  const t0 = ease(cursor / total) * DRAW_SECONDS;
  cursor += s.len;
  const t1 = ease(cursor / total) * DRAW_SECONDS;
  return { delay: t0, dur: Math.max(0.05, t1 - t0) };
});

export default function SplashScreen() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(() => played);

  useEffect(() => {
    if (played) return;
    if (prefersReducedMotion()) {
      played = true;
      return;
    }
    const root = document.documentElement;
    root.classList.add("splash-lock");
    const t1 = window.setTimeout(() => setLeaving(true), DRAW_SECONDS * 1000 + HOLD_MS);
    const t2 = window.setTimeout(() => {
      played = true; // marked only when finished, so React dev double-run of this effect still plays it
      setGone(true);
      root.classList.remove("splash-lock");
    }, DRAW_SECONDS * 1000 + HOLD_MS + LEAVE_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      root.classList.remove("splash-lock");
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`splash ${leaving ? "leaving" : ""}`} aria-hidden onClick={() => setLeaving(true)}>
      <svg className="splash-sig" viewBox={`0 0 ${SIGNATURE.width} ${SIGNATURE.height}`} role="presentation">
        {SIGNATURE.strokes.map((s, i) => (
          <path
            key={i}
            d={s.d}
            pathLength={1}
            strokeWidth={s.w}
            style={{ "--delay": `${TIMING[i].delay.toFixed(3)}s`, "--dur": `${TIMING[i].dur.toFixed(3)}s` } as React.CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}
