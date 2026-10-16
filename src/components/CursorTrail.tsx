"use client";

import React, { useRef, useCallback, useEffect } from "react";

/*
 * Cursor trail: icons pop out behind the pointer over the portrait.
 *
 * Perf notes: a fixed pool of sticker elements is created once and animated
 * with the Web Animations API (transform + opacity only), so spawning a
 * sticker never triggers a React re-render. The photo also drifts gently
 * opposite the pointer (lerped in rAF) for a softer, more tactile feel.
 */

const RED = "#d9262c";
const TINT = "rgba(217, 38, 44, 0.13)";

const stroke = {
  fill: "none",
  stroke: RED,
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const svgProps = { viewBox: "0 0 64 64", width: "100%", height: "100%" } as const;

/* Alternates developer icons and art-direction icons around the trail. */
const ICONS: { name: string; node: React.ReactNode }[] = [
  {
    name: "code",
    node: (
      <svg {...svgProps} {...stroke}>
        <path d="M22 17 L7 32 L22 47" />
        <path d="M42 17 L57 32 L42 47" />
        <path d="M37 11 L27 53" />
      </svg>
    ),
  },
  {
    name: "palette",
    node: (
      <svg {...svgProps} {...stroke}>
        <path
          d="M32 6C16 6 6 18 6 32c0 14 12 26 26 26 6 0 6-6 3-9-3-3-1-8 5-8h8c6 0 10-4 10-10C58 17 47 6 32 6Z"
          fill={TINT}
        />
        <circle cx="19" cy="31" r="3.4" fill={RED} stroke="none" />
        <circle cx="27" cy="18" r="3.4" fill={RED} stroke="none" />
        <circle cx="41" cy="18" r="3.4" fill={RED} stroke="none" />
        <circle cx="49" cy="29" r="3.4" fill={RED} stroke="none" />
      </svg>
    ),
  },
  {
    name: "terminal",
    node: (
      <svg {...svgProps} {...stroke}>
        <rect x="5" y="9" width="54" height="46" rx="7" fill={TINT} />
        <path d="M5 21 H59" />
        <circle cx="13" cy="15" r="1.6" fill={RED} stroke="none" />
        <circle cx="19" cy="15" r="1.6" fill={RED} stroke="none" />
        <path d="M16 31 L25 38 L16 45" />
        <path d="M31 46 H44" />
      </svg>
    ),
  },
  {
    name: "pen-tool",
    node: (
      <svg {...svgProps} {...stroke}>
        <path d="M32 4 L49 30 L41 51 H23 L15 30 Z" fill={TINT} />
        <path d="M32 33 V51" />
        <circle cx="32" cy="29" r="3.6" fill={RED} stroke="none" />
        <path d="M21 58 H43" />
      </svg>
    ),
  },
  {
    name: "git-branch",
    node: (
      <svg {...svgProps} {...stroke}>
        <path d="M17 19 V45" />
        <path d="M46 29 C46 40 33 39 22 45" />
        <circle cx="17" cy="14" r="5.5" fill={TINT} />
        <circle cx="17" cy="50" r="5.5" fill={TINT} />
        <circle cx="46" cy="24" r="5.5" fill={TINT} />
      </svg>
    ),
  },
  {
    name: "brush",
    node: (
      <svg {...svgProps} {...stroke}>
        <path d="M57 5 L60 8 L38 34 L30 27 Z" fill={TINT} />
        <path d="M30 27 L38 34 C36 43 27 50 10 54 C14 47 12 38 20 31 C24 28 27 27 30 27 Z" fill={RED} />
        <path d="M44 20 L50 26" />
      </svg>
    ),
  },
  {
    name: "laptop",
    node: (
      <svg {...svgProps} {...stroke}>
        <rect x="10" y="11" width="44" height="31" rx="4" fill={TINT} />
        <path d="M3 50 H61 L57 43 H7 Z" />
        <path d="M27 21 L21 26.5 L27 32" />
        <path d="M37 21 L43 26.5 L37 32" />
      </svg>
    ),
  },
  {
    name: "viewfinder",
    node: (
      <svg {...svgProps} {...stroke}>
        <path d="M7 20 V8 H19" />
        <path d="M45 8 H57 V20" />
        <path d="M57 44 V56 H45" />
        <path d="M19 56 H7 V44" />
        <circle cx="32" cy="32" r="10" fill={TINT} />
        <circle cx="32" cy="32" r="2.6" fill={RED} stroke="none" />
      </svg>
    ),
  },
  {
    name: "react",
    node: (
      <svg {...svgProps} {...stroke} strokeWidth={2.6}>
        <ellipse cx="32" cy="32" rx="27" ry="10.5" />
        <ellipse cx="32" cy="32" rx="27" ry="10.5" transform="rotate(60 32 32)" />
        <ellipse cx="32" cy="32" rx="27" ry="10.5" transform="rotate(120 32 32)" />
        <circle cx="32" cy="32" r="4.4" fill={RED} stroke="none" />
      </svg>
    ),
  },
  {
    name: "moon",
    node: (
      <svg {...svgProps} {...stroke} strokeWidth={2.4}>
        <circle cx="32" cy="32" r="26" fill={TINT} />
        <circle cx="22" cy="23" r="5.5" fill="rgba(217, 38, 44, 0.4)" stroke="none" />
        <circle cx="41" cy="19" r="3.2" fill="rgba(217, 38, 44, 0.4)" stroke="none" />
        <circle cx="43" cy="37" r="6.5" fill="rgba(217, 38, 44, 0.4)" stroke="none" />
        <circle cx="25" cy="43" r="3.8" fill="rgba(217, 38, 44, 0.4)" stroke="none" />
        <circle cx="33" cy="30" r="2" fill="rgba(217, 38, 44, 0.4)" stroke="none" />
      </svg>
    ),
  },
  {
    name: "sunglasses",
    node: (
      <svg {...svgProps} {...stroke} strokeWidth={2.6}>
        <path d="M9 24 H28 C28 36 24 45 17 45 C11 45 9 34 9 24 Z" fill={RED} />
        <path d="M36 24 H55 C55 34 53 45 47 45 C40 45 36 36 36 24 Z" fill={RED} />
        <path d="M28 27 C30 23 34 23 36 27" />
        <path d="M9 24 L3 19 M55 24 L61 19" />
        <path d="M14 30 L18 38" stroke="#efeeeb" strokeWidth={2} />
        <path d="M41 30 L45 38" stroke="#efeeeb" strokeWidth={2} />
      </svg>
    ),
  },
  {
    name: "spark",
    node: (
      <svg {...svgProps} fill={RED}>
        <path d="M32 2C34 20 44 30 62 32 44 34 34 44 32 62 30 44 20 34 2 32 20 30 30 20 32 2Z" />
      </svg>
    ),
  },
  {
    name: "mobile",
    node: (
      <svg {...svgProps} {...stroke}>
        <rect x="17" y="5" width="30" height="54" rx="7" fill={TINT} />
        <path d="M28 11 H36" />
        <path d="M24 26 H40 M24 33 H40 M24 40 H32" />
        <circle cx="32" cy="52" r="1.8" fill={RED} stroke="none" />
      </svg>
    ),
  },
  {
    name: "swallow",
    node: (
      <svg viewBox="0 0 80 64" width="100%" height="100%" {...stroke} strokeWidth={2.4}>
        <path d="M6 8 L58 46 M6 8 H14 M6 8 L8 16" />
        <path
          d="M22 44C30 28 48 24 62 32 54 38 46 44 36 50c10 2 20 8 34 6C60 62 40 64 24 56c-6-4-4-8-2-12Z"
          fill={RED}
        />
        <path d="M40 34C44 20 52 12 66 8 62 18 56 26 48 34Z" fill={RED} />
        <circle cx="56" cy="35" r="1.4" fill="#efeeeb" stroke="none" />
      </svg>
    ),
  },
];

const SIZE = 96; // px, sticker box (keep in sync with .trail-sticker in globals.css)
const SPAWN_DISTANCE = 170; // px of pointer travel before the next icon appears
const MIN_INTERVAL_MS = 380;
const LIFETIME_MS = 1500;
const EXIT_AT = 0.6; // animation offset where the fade-out begins
const PARALLAX_PX = 14;

export default function CursorTrail({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const stickerEls = useRef<(HTMLSpanElement | null)[]>([]);
  const anims = useRef<(Animation | null)[]>([]);
  const last = useRef<{ x: number; y: number; t: number } | null>(null);
  const slot = useRef(0);

  // parallax state (all mutable, read in rAF)
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  // Self-scheduling rAF loop; stops itself once the photo has settled.
  const loop = useRef<() => void>(() => {});
  useEffect(() => {
    loop.current = () => {
      const c = current.current;
      const t = target.current;
      c.x += (t.x - c.x) * 0.08;
      c.y += (t.y - c.y) * 0.08;
      if (layer.current) {
        layer.current.style.transform = `translate3d(${c.x.toFixed(2)}px, ${c.y.toFixed(2)}px, 0) scale(1.06)`;
      }
      const settled = Math.abs(t.x - c.x) < 0.05 && Math.abs(t.y - c.y) < 0.05;
      raf.current = settled ? null : requestAnimationFrame(() => loop.current());
    };
  }, []);

  const wake = useCallback(() => {
    if (raf.current === null) raf.current = requestAnimationFrame(() => loop.current());
  }, []);

  useEffect(() => {
    const running = anims.current;
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      running.forEach((a) => a?.cancel());
    };
  }, []);

  const spawn = useCallback((x: number, y: number, vx: number, vy: number) => {
    const i = slot.current++ % ICONS.length;
    const el = stickerEls.current[i];
    if (!el) return;
    anims.current[i]?.cancel();

    // Only one icon on screen: send the previous one into a quick fade-out.
    const prev = anims.current[(i + ICONS.length - 1) % ICONS.length];
    if (prev && prev.playState === "running") {
      const exitStart = LIFETIME_MS * EXIT_AT;
      if (Number(prev.currentTime) < exitStart) prev.currentTime = exitStart;
      prev.playbackRate = 2.5;
    }

    const rot = Math.round(Math.random() * 30 - 15);
    const len = Math.hypot(vx, vy) || 1;
    const driftX = (vx / len) * 18;
    const driftY = (vy / len) * 18 - 26; // keeps a gentle upward float
    const px = x - SIZE / 2;
    const py = y - SIZE / 2;
    const at = (dx: number, dy: number, s: number, r: number) =>
      `translate3d(${px + dx}px, ${py + dy}px, 0) scale(${s}) rotate(${r}deg)`;

    anims.current[i] = el.animate(
      [
        { transform: at(0, 6, 0.25, rot - 28), opacity: 0, offset: 0, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
        { transform: at(0, 0, 1, rot), opacity: 1, offset: 0.2, easing: "linear" },
        { transform: at(driftX * 0.2, driftY * 0.2, 1, rot), opacity: 1, offset: EXIT_AT, easing: "cubic-bezier(0.45, 0, 0.55, 1)" },
        { transform: at(driftX, driftY, 0.82, rot + 10), opacity: 0, offset: 1 },
      ],
      { duration: LIFETIME_MS, fill: "both" },
    );
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "touch" || !root.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rect = root.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // parallax: photo drifts a touch against the pointer
      target.current.x = -((x / rect.width) * 2 - 1) * PARALLAX_PX;
      target.current.y = -((y / rect.height) * 2 - 1) * PARALLAX_PX;
      wake();

      const now = performance.now();
      const prev = last.current;
      if (!prev) {
        last.current = { x, y, t: now };
        return;
      }
      const dx = x - prev.x;
      const dy = y - prev.y;
      if (Math.hypot(dx, dy) < SPAWN_DISTANCE || now - prev.t < MIN_INTERVAL_MS) return;

      last.current = { x, y, t: now };
      spawn(x, y, dx, dy);
    },
    [spawn, wake],
  );

  const onLeave = useCallback(() => {
    last.current = null;
    target.current = { x: 0, y: 0 };
    wake();
  }, [wake]);

  return (
    <div
      ref={root}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ position: "relative", width: "100%", height: "100%", cursor: "crosshair", overflow: "hidden" }}
    >
      <div ref={layer} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "scale(1.06)", willChange: "transform" }}>
        {children}
      </div>
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
        {ICONS.map((icon, i) => (
          <span
            key={icon.name}
            ref={(el) => {
              stickerEls.current[i] = el;
            }}
            className="trail-sticker"
          >
            {icon.node}
          </span>
        ))}
      </div>
    </div>
  );
}
