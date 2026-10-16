"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

const INTRO =
  "Hi, I'm Kalyan - a full stack developer with a name that sounds like a blessing. I build web and mobile products people enjoy using and systems that never make them wait. Interfaces, APIs and the cloud they run on - and when the work needs art direction, motion or 3D, that gets made here too.";

const WORDS = INTRO.split(" ");

// Fill colours: pale grey → red (the leading edge) → black (settled)
const DIM: [number, number, number] = [203, 199, 189];
const RED: [number, number, number] = [201, 20, 28];
const INK: [number, number, number] = [10, 10, 10];

const mixRgb = (a: [number, number, number], b: [number, number, number], t: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

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
  const text = useRef<HTMLParagraphElement>(null);
  const photo = useRef<HTMLDivElement>(null);

  // The paragraph is pinned in the middle of the screen while the section's
  // track scrolls past; scroll progress through the track fills the words in.
  useEffect(() => {
    const track = trackEl.current;
    const stage = stageEl.current;
    const el = text.current;
    if (!track || !stage || !el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>(".intro-word"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      words.forEach((w) => (w.style.color = fillColor(1)));
      return;
    }

    const SOFT = 9; // how many words are mid-fade at once (the red leading edge)
    let frame = 0;
    let stageH = 0;
    const measure = () => {
      // the pinned frame is only as tall as the text, so there is no dead space around it
      stageH = stage.offsetHeight;
      track.style.setProperty("--stage-h", `${stageH}px`);
    };
    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const pinTop = (window.innerHeight - stageH) / 2; // where the stage sticks
      const travel = rect.height - stageH;
      const progress = travel > 0 ? Math.min(1, Math.max(0, (pinTop - rect.top) / travel)) : 1;
      // finish filling slightly before the pin releases so the full text is readable
      const filled = Math.min(1, progress / 0.85) * (words.length + SOFT);
      words.forEach((w, i) => {
        const t = Math.min(1, Math.max(0, (filled - i) / SOFT));
        w.style.color = fillColor(t);
      });

      if (photo.current) {
        photo.current.style.setProperty("--drift", `${((0.5 - progress) * 46).toFixed(1)}px`);
        photo.current.style.setProperty("--tilt", `${(11 - progress * 8).toFixed(2)}deg`);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

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
          <p ref={text} className="intro-text">
            <span ref={photo} className="intro-photo" aria-hidden>
              <Image
                src="/Sepia-Toned Vintage Studio Portrait.png"
                alt=""
                fill
                sizes="(max-width: 768px) 130px, 260px"
                style={{ objectFit: "cover", objectPosition: "50% 35%" }}
              />
            </span>
            {WORDS.map((word, i) => (
              <React.Fragment key={i}>
                <span className="intro-word">{word}</span>{" "}
              </React.Fragment>
            ))}
          </p>
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
