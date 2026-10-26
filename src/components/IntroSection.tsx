"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { prefersReducedMotion } from "@/lib/motion";

// The about text, one string per paragraph. **Double asterisks** mark the bold parts.
const PARAGRAPHS = [
  "**Hi, I’m Kalyan — a Full Stack & AI Engineer building scalable web and mobile applications, intelligent AI solutions, and cloud-powered systems.** I work across the entire stack, from crafting seamless user experiences and robust APIs to deploying reliable infrastructure on AWS.",
  "I build with Next.js, React, and modern technologies, integrating Generative AI, LLMs, RAG pipelines, AI agents, and intelligent automation to turn complex ideas into practical, production-ready products. From system architecture and backend engineering to cloud infrastructure, performance optimization, and AI-powered workflows, I focus on building software that is reliable, scalable, and genuinely useful.",
  "Beyond development, I enjoy exploring creative digital experiences, motion, and 3D when a project calls for something distinctive. I also contribute to open source and believe in building technology that developers and users love.",
  "**My focus:** Full-Stack Engineering · Generative AI & LLMs · AI Agents & Automation · AWS Cloud · Web & Mobile Apps · Open Source",
];

// Every word with its paragraph and whether it is bold, so the scroll fill can colour them one by one.
const WORDS = PARAGRAPHS.map((text) =>
  text
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .flatMap((part) => {
      const bold = part.startsWith("**");
      return (bold ? part.slice(2, -2) : part)
        .split(" ")
        .filter(Boolean)
        .map((word) => ({ word, bold }));
    }),
);

// Fill colours: pale grey → red (the leading edge) → ink (settled). They come from the CSS variables
// --intro-dim, --intro-red and --intro-ink, so the light and the dark theme each get their own.
type Rgb = [number, number, number];
let DIM: Rgb = [203, 199, 189];
let RED: Rgb = [201, 20, 28];
let INK: Rgb = [10, 10, 10];

const parseColor = (value: string, fallback: Rgb): Rgb => {
  const v = value.trim();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].split("").map((c) => c + c).join("") : hex[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const rgb = v.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : fallback;
};

const readPalette = (el: Element) => {
  const cs = getComputedStyle(el);
  DIM = parseColor(cs.getPropertyValue("--intro-dim"), DIM);
  RED = parseColor(cs.getPropertyValue("--intro-red"), RED);
  INK = parseColor(cs.getPropertyValue("--intro-ink"), INK);
};

const mixRgb = (a: Rgb, b: Rgb, t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

const fillColor = (t: number) => (t < 0.5 ? mixRgb(DIM, RED, t * 2) : mixRgb(RED, INK, (t - 0.5) * 2));

/* Clients & collaborators, each set as a typographic wordmark with a small mark. */
// `logo` is an optional file in /public (e.g. "/clients/tea-lovers.svg"). When present it is shown
// instead of the typographic wordmark below, so real brand files can be dropped in one by one.
type Client = { name: string; logo?: string; mark?: React.ReactNode; style: React.CSSProperties };

const mark = (children: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="1.15em" height="1.15em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);

const CLIENTS: Client[] = [
  {
    // bold extended capitals
    name: "Baala Media Works",
    mark: mark(
      <>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M10 9 L16 12 L10 15 Z" fill="currentColor" />
      </>,
    ),
    style: { fontWeight: 800, letterSpacing: "-0.02em", textTransform: "uppercase", fontSize: "1.05rem" },
  },
  {
    // soft rounded product-company wordmark
    name: "Sambin Technologies",
    mark: mark(
      <>
        <path d="M12 2.5 L20.5 7.25 V16.75 L12 21.5 L3.5 16.75 V7.25 Z" />
        <path d="M15.5 9.5 C14 7.5 8.5 8.2 9 10.8 C9.5 13.3 15 11.4 15 14 C15 16.4 10 16.4 8.5 14.5" />
      </>,
    ),
    style: { fontWeight: 600, letterSpacing: "-0.02em", fontSize: "1.35rem" },
  },
  {
    // engraved serif capitals
    name: "Touchstone Foundation",
    mark: mark(
      <>
        <path d="M12 2 L21 12 L12 22 L3 12 Z" />
        <path d="M3 12 H21" />
      </>,
    ),
    style: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      fontSize: "1.05rem",
      textShadow: "1.5px 1.5px 0 rgba(123, 119, 111, 0.35)",
    },
  },
  {
    // heavy condensed capitals, like a stamped label
    name: "Tea Lovers",
    style: {
      fontFamily: "Impact, 'Arial Narrow', 'Archivo', sans-serif",
      fontWeight: 900,
      letterSpacing: "0.03em",
      textTransform: "uppercase",
      fontSize: "1.5rem",
    },
  },
  {
    // slanted racing-style capitals with a speed swoosh
    name: "Links",
    mark: mark(<path d="M2 16 L9 8 H22 L15 16 Z" fill="currentColor" />),
    style: { fontWeight: 900, fontStyle: "italic", letterSpacing: "-0.01em", textTransform: "uppercase", fontSize: "1.3rem" },
  },
  {
    // asterisk burst + spaced capitals
    name: "Rise",
    mark: mark(
      <path d="M12 3 V21 M3 12 H21 M5.6 5.6 L18.4 18.4 M18.4 5.6 L5.6 18.4" strokeWidth="2.6" />,
    ),
    style: { fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "1.1rem" },
  },
  {
    // ornate wide serif capitals
    name: "BeerBazaar",
    style: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      fontSize: "1.25rem",
      textShadow: "1px 1px 0 rgba(123, 119, 111, 0.45), -1px -1px 0 rgba(123, 119, 111, 0.2)",
    },
  },
];

// Each marquee row repeats the clients so one half is always wider than the viewport.
// Row one starts with Baala Media Works; row two is the same list rotated so names don't line up.
const REPEAT = 2;
const ROTATED: Client[] = [...CLIENTS.slice(4), ...CLIENTS.slice(0, 4)];
const ROW_ONE: Client[] = Array.from({ length: REPEAT }, () => CLIENTS).flat();
const ROW_TWO: Client[] = Array.from({ length: REPEAT }, () => ROTATED).flat();

function MarqueeRow({ items, duration }: { items: Client[]; duration: number }) {
  return (
    <div className="intro-logos" aria-hidden>
      <div className="intro-logos-track" style={{ animationDuration: `${duration}s` }}>
        {[0, 1].map((half) => (
          <div key={half} className="intro-logos-half">
            {items.map((c, i) => (
              <span key={`${c.name}-${i}`} className="intro-logo" style={c.logo ? undefined : c.style}>
                {c.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- brand files vary in size and format
                  <img src={c.logo} alt="" className="intro-logo-img" />
                ) : (
                  <>
                    {c.mark}
                    {c.name}
                  </>
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IntroSection() {
  const trackEl = useRef<HTMLDivElement>(null);
  const stageEl = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);

  // The paragraph is pinned in the middle of the screen while the section's
  // track scrolls past; scroll progress through the track fills the words in.
  useEffect(() => {
    const track = trackEl.current;
    const stage = stageEl.current;
    const el = text.current;
    if (!track || !stage || !el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>(".intro-word"));
    readPalette(el);
    const reduced = prefersReducedMotion();
    if (reduced) {
      words.forEach((w) => (w.style.color = fillColor(1)));
      return;
    }

    const SOFT = 9; // how many words are mid-fade at once (the red leading edge)
    let frame = 0;
    let stageH = 0;
    let tall = false;
    const measure = () => {
      // the pinned frame is only as tall as the text, so there is no dead space around it
      stageH = stage.offsetHeight;
      track.style.setProperty("--stage-h", `${stageH}px`);
      // text taller than the screen cannot be pinned (the bottom would be cut off), so it just scrolls
      tall = stageH > window.innerHeight * 0.92;
      track.classList.toggle("is-tall", tall);
    };
    const update = () => {
      frame = 0;
      let progress: number;
      if (tall) {
        // not pinned: fill while the text moves up through the screen
        const top = stage.getBoundingClientRect().top;
        const vh = window.innerHeight;
        progress = Math.min(1, Math.max(0, (vh * 0.85 - top) / (stageH + vh * 0.25)));
      } else {
        const rect = track.getBoundingClientRect();
        const pinTop = (window.innerHeight - stageH) / 2; // where the stage sticks
        const travel = rect.height - stageH;
        progress = travel > 0 ? Math.min(1, Math.max(0, (pinTop - rect.top) / travel)) : 1;
      }
      // finish filling slightly before the pin releases so the full text is readable
      const filled = Math.min(1, progress / 0.85) * (words.length + SOFT);
      words.forEach((w, i) => {
        const t = Math.min(1, Math.max(0, (filled - i) / SOFT));
        w.style.color = fillColor(t);
      });

      if (photo.current) {
        // the portrait glides up, straightens up, zooms out and fades in as the text fills
        const p = photo.current;
        p.style.setProperty("--drift", `${(-progress * 90).toFixed(1)}px`);
        p.style.setProperty("--tilt", `${(16 - progress * 20).toFixed(2)}deg`);
        p.style.setProperty("--zoom", (1.1 - progress * 0.1).toFixed(3));
        p.style.setProperty("--fade", (0.45 + Math.min(1, progress * 4) * 0.55).toFixed(3));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // switching between the light and dark theme changes the colours, so read them again and repaint the words
    const themeWatch = new MutationObserver(() => {
      readPalette(el);
      update();
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    measure();
    update();
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(stage);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      ro.disconnect();
      themeWatch.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="intro" className="intro" aria-labelledby="intro-heading">
      <h2 id="intro-heading" className="sr-only">
        About Kalyan
      </h2>

      <div ref={trackEl} className="intro-track">
        <div ref={stageEl} className="intro-stage">
          <div ref={text} className="intro-text">
            {WORDS.map((words, p) => (
              <p key={p} className="intro-para">
                {p === 0 && (
                  <span ref={photo} className="intro-photo" aria-hidden>
                    <Image
                      src="/Sepia-Toned Vintage Studio Portrait.png"
                      alt=""
                      fill
                      sizes="(max-width: 768px) 130px, 260px"
                      style={{ objectFit: "cover", objectPosition: "50% 0%" }}
                    />
                  </span>
                )}
                {words.map(({ word, bold }, i) => (
                  <React.Fragment key={i}>
                    <span className={bold ? "intro-word intro-bold" : "intro-word"}>{word}</span>{" "}
                  </React.Fragment>
                ))}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="intro-inner">
        <div className="intro-rule" />

        <div className="intro-lower">
          <div>
            <p className="intro-kicker">(FREELANCE &amp; CLIENTS)</p>
            <p className="sr-only">Baala Media Works, Sambin Technologies, Touchstone Foundation, Tea Lovers, Links, Rise, BeerBazaar</p>
            <MarqueeRow items={ROW_ONE} duration={60} />
            <MarqueeRow items={ROW_TWO} duration={76} />
          </div>
        </div>
      </div>
    </section>
  );
}
