"use client";

import React, { useEffect, useRef, useState } from "react";
import { SIGNATURE } from "@/data/signature";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The opening screen: a blue page where the signature writes itself, then the page slides up to reveal the site.
 * It plays every time the website is opened or reloaded, but not again when moving between pages inside the site.
 * Visitors who prefer reduced motion never see it (the stylesheet hides it). Click the screen to skip.
 *
 * The whole timeline (writing, the pause and the slide up) is CSS, so it runs on the browser's animation clock and does not
 * wait for the page's JavaScript to start. Here we only (1) keep the page from scrolling underneath, (2) hold the hero's
 * entrance until the slide up begins, and (3) remove the screen once the slide up has finished.
 */

// true once it has played in this page load (a full reload resets it)
let played = false;

const DRAW_SECONDS = 4; // time to write the whole signature (the pause and the slide up are set in globals.css)

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

const SCROLL_KEYS = new Set([" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"]);
const isLeave = (name: string) => name === "splash-leave" || name === "splash-leave-now";

export default function SplashScreen() {
  const [gone, setGone] = useState(() => played);
  const [skipped, setSkipped] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const watchRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (played) return;
    if (prefersReducedMotion()) {
      played = true;
      return;
    }
    const html = document.documentElement;
    html.classList.add("splash-lock", "splash-hold");

    // Keep the page from scrolling under the opening screen. (Setting overflow:hidden instead would make the browser lay the
    // whole page out again when the screen goes, which showed up as a hitch at the end of the slide.)
    const stop = (e: Event) => e.preventDefault();
    const stopKeys = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) e.preventDefault();
    };
    window.addEventListener("wheel", stop, { passive: false });
    window.addEventListener("touchmove", stop, { passive: false });
    window.addEventListener("keydown", stopKeys);

    // Let the page scroll again. (This component stays mounted after the screen is gone, so the effect clean-up below does not run
    // then: the scroll blockers have to be taken off here, or the page would never scroll.)
    const unblock = () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", stopKeys);
    };

    const finish = () => {
      played = true;
      unblock();
      html.classList.remove("splash-lock", "splash-hold");
      setGone(true);
    };

    // Follow the slide-up animation itself (not DOM events, which only arrive when a frame is drawn): when it begins let the hero's
    // entrance play, and when it has finished remove the screen. This also catches up if the page's JavaScript started late.
    const holdTimers: number[] = [];
    const watch = () => {
      const leave = root.current?.getAnimations().find((a) => isLeave((a as CSSAnimation).animationName));
      if (!leave) return;
      const delay = Number(leave.effect?.getTiming().delay ?? 0);
      const current = typeof leave.currentTime === "number" ? leave.currentTime : 0;
      holdTimers.push(window.setTimeout(() => html.classList.remove("splash-hold"), Math.max(0, delay - current)));
      leave.finished.then(finish).catch(() => {
        /* replaced by another animation (the click to skip): that one is watched separately */
      });
    };
    watchRef.current = watch;
    watch();

    // safety net, in case the animation never runs (for example a tab that was in the background the whole time)
    const safety = window.setTimeout(finish, 9000);

    return () => {
      window.clearTimeout(safety);
      holdTimers.forEach((id) => window.clearTimeout(id));
      watchRef.current = () => {};
      unblock();
      html.classList.remove("splash-lock", "splash-hold");
    };
  }, []);

  // after a click to skip, the slide up is a new animation: watch that one too
  useEffect(() => {
    if (skipped) watchRef.current();
  }, [skipped]);

  if (gone) return null;

  return (
    <div
      ref={root}
      className={`splash${skipped ? " skip" : ""}`}
      aria-hidden
      onClick={() => setSkipped(true)}
    >
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
