"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { prefersReducedMotion } from "@/lib/motion";

type Shot = { src: string; host: string };

type Service = {
  num: string;
  title: string;
  copy: string;
  tags: string;
  layout: "browser" | "phones" | "motion" | "shop" | "ai" | "ux";
  shots?: [Shot, Shot]; // only the browser layout uses these; the other layouts draw their own animated panels
};

// Drafts: edit the wording freely. The screenshots are your own projects.
const SERVICES: Service[] = [
  {
    num: "01",
    title: "Web Development & CMS",
    copy: "Fast, accessible websites and web apps built with Next.js and modern JavaScript, with a CMS so your team can update content without a developer.",
    tags: "Next.js · JavaScript · CMS",
    layout: "browser",
    shots: [
      { src: "/brajnidhi.png", host: "thebrajnidhi.com" },
      { src: "/hkm.png", host: "hkmdehradun.org" },
    ],
  },
  {
    num: "02",
    title: "Mobile Development",
    copy: "Mobile-first interfaces and apps that feel at home on every screen, running on the same back end as your website.",
    tags: "Responsive · Mobile apps",
    layout: "phones",
  },
  {
    num: "03",
    title: "AI Solutions & Agents",
    copy: "Generative AI features, LLM-powered agents and RAG pipelines that connect to your own data and workflows, built to be reliable in production and not just in a demo.",
    tags: "Generative AI · LLMs · RAG · AI agents · Automation",
    layout: "ai",
  },
  {
    num: "04",
    title: "Animations & Microinteractions",
    copy: "Motion has a purpose. I design animations that guide users, reinforce your brand identity, and turn every scroll into a memorable experience.",
    tags: "Scroll animation · Microinteractions · Motion",
    layout: "motion",
  },
  {
    num: "05",
    title: "Shopify / Ecommerce",
    copy: "Custom Shopify stores designed around your brand, creating shopping experiences that feel unique instead of generic.",
    tags: "Shopify · Ecommerce · Custom storefronts",
    layout: "shop",
  },
  {
    num: "06",
    title: "UI & UX Design",
    copy: "Interfaces designed around how people actually use them: clear flows, a consistent design system and the small details that make a product feel effortless.",
    tags: "UI design · UX flows · Design systems",
    layout: "ux",
  },
];

// The easing curve in the Motion row morphs from ease-in-out to an overshoot on an 8s loop:
// hold, morph (3s-4s), hold, morph back (7s-8s). Handle positions are the cubic-bezier control points on a 14 x 14 grid.
const CURVE_TIMING = {
  dur: "8s",
  repeatCount: "indefinite",
  calcMode: "spline",
  keyTimes: "0;0.375;0.5;0.875;1",
  keySplines: "0 0 1 1;0.65 0 0.35 1;0 0 1 1;0.65 0 0.35 1",
};
const loopOf = (a: string, b: string) => `${a};${a};${b};${b};${a}`;
const CURVE_D = loopOf("M0 14C9.1 14 4.9 0 14 0", "M0 14C4.76 -7.84 8.96 0 14 0");
const CURVE_X1 = loopOf("9.1", "4.76");
const CURVE_Y1 = loopOf("14", "-7.84");
const CURVE_X2 = loopOf("4.9", "8.96");

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// Slope of the diagonal wipe edge (height gained per unit of width), roughly 38°.
const SLOPE = 0.78;

// Must match --closed-h / --open-h on .svc in globals.css (in rem; the folded height is 0 on small screens).
const CLOSED_REM = 13.5;
const OPEN_REM = 36;
const MOBILE_QUERY = "(max-width: 900px)";
// Must match --svx-rule-w in globals.css: each card has two of these rules (top of card, top of body).
const RULE_PX = 2;

// Points along the rippling edge of the colour wipe.
const WAVE_STEPS = 24;

export default function ServicesSection() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const strokes = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const trackEl = track.current;
    const stageEl = stage.current;
    const overlayEl = overlay.current;
    const strokesEl = strokes.current;
    const titleEl = title.current;
    const wrapEl = wrap.current;
    if (!trackEl || !stageEl || !overlayEl || !strokesEl || !titleEl || !wrapEl) return;

    const reduced = prefersReducedMotion();
    const cards = Array.from(wrapEl.querySelectorAll<HTMLElement>(".svc"));

    // Where each bar starts and how thick it is, in screen px, so droplets can be placed beyond its tip.
    const bars = Array.from(strokesEl.querySelectorAll<HTMLElement>(".svx-stroke"));
    const drops = Array.from(strokesEl.querySelectorAll<HTMLElement>(".svx-drop"));
    let geom: { ox: number; oy: number; h: number }[] = [];
    const measureBars = () => {
      geom = bars.map((bar) => {
        const cs = getComputedStyle(bar);
        const h = parseFloat(cs.height) || 0;
        return { ox: parseFloat(cs.left) || 0, oy: (parseFloat(cs.top) || 0) + h / 2, h };
      });
    };

    // The mockups are drawn at a fixed size and scaled to fit the panel: one scale for the open
    // card, a smaller one for the folded strip.
    const fit = () => {
      const mobile = window.matchMedia(MOBILE_QUERY).matches;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      cards.forEach((card) => {
        const panel = card.querySelector<HTMLElement>(".svc-panel");
        const cluster = card.querySelector<HTMLElement>(".svc-cluster");
        const copy = card.querySelector<HTMLElement>(".svc-copy");
        if (!panel || !cluster || !copy) return;
        const openH = mobile ? OPEN_REM * rem - copy.offsetHeight : OPEN_REM * rem;
        const sOpen = Math.min(1, (panel.clientWidth * 0.96) / cluster.offsetWidth, (openH * 0.96) / cluster.offsetHeight);
        const sClosed = mobile ? sOpen : Math.min(sOpen, (CLOSED_REM * rem * 0.84) / cluster.offsetHeight);
        card.style.setProperty("--s-open", sOpen.toFixed(3));
        card.style.setProperty("--s-closed", sClosed.toFixed(3));
      });
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // 1. Intro: scroll progress through the pinned track drives the colour wipe.
      if (!reduced) {
        const rect = trackEl.getBoundingClientRect();
        const travel = rect.height - vh;
        const raw = travel > 0 ? clamp01(-rect.top / travel) : 1;
        // The two corner bars grow out of the corner, the second a beat behind the first, and their
        // tips lift as they extend. Then the colour wipe takes over, and the full colour holds for a
        // moment before the section unpins.
        const gA = easeOut(clamp01(raw / 0.4));
        const gB = easeOut(clamp01((raw - 0.06) / 0.4));
        const t = easeInOut(clamp01((raw - 0.4) / 0.52));
        // extra margin so the rippling front still clears the far corner when the wipe finishes
        const full = vw + vh / SLOPE + 160;
        const c = t * full;

        // The wipe's leading edge ripples like a liquid front instead of cutting straight across.
        const nx = SLOPE / Math.hypot(1, SLOPE);
        const ny = 1 / Math.hypot(1, SLOPE);
        const amp = 64 * clamp01(t * 6) * (1 - 0.6 * t);
        const edge: string[] = [];
        for (let i = 1; i <= WAVE_STEPS; i++) {
          const u = i / WAVE_STEPS;
          const wave = amp * Math.sin(Math.PI * u) * Math.sin(u * Math.PI * 5 + raw * 16);
          edge.push(`${(c * (1 - u) + nx * wave).toFixed(1)}px ${(c * SLOPE * u + ny * wave).toFixed(1)}px`);
        }
        overlayEl.style.clipPath = `polygon(0 0, ${c.toFixed(1)}px 0, ${edge.join(", ")})`;

        const set = (name: string, value: string) => strokesEl.style.setProperty(name, value);
        const lenA = vw * (0.3 + 0.4 * gA);
        const lenB = vw * (0.14 + 0.5 * gB);
        // the angles wobble a little with the scroll, like liquid settling
        const rotA = -40 - 7 * gA + 1.8 * Math.sin(raw * 11);
        const rotB = -22 - 6 * gB + 1.8 * Math.sin(raw * 9 + 1);
        set("--len-a", lenA.toFixed(1));
        set("--len-b", lenB.toFixed(1));
        set("--rot-a", `${rotA.toFixed(2)}deg`);
        set("--rot-b", `${rotB.toFixed(2)}deg`);
        // and the bars swell and thin as if they were being pumped
        set("--wob-a", (1 + 0.06 * Math.sin(raw * 19)).toFixed(3));
        set("--wob-b", (1 + 0.06 * Math.sin(raw * 16 + 2)).toFixed(3));
        // once grown, the pair keeps drifting up and to the right while the wipe takes over
        const drift = raw * 70;
        set("--drift", drift.toFixed(1));

        // Two kinds of blob per bar. Blob 0 is a droplet just beyond the tip that pulses in size and
        // distance. Blobs 1 and 2 are bulges that travel along the bar's body as you scroll. With
        // the goo filter they swell out of the bar, slide toward the tip, then melt back into it.
        if (geom.length === bars.length) {
          const state = [
            { g: gA, len: lenA, rot: rotA },
            { g: gB, len: lenB, rot: rotB },
          ];
          drops.forEach((drop, i) => {
            const bi = i < 3 ? 0 : 1;
            const j = i % 3;
            const gm = geom[bi];
            const st = state[bi];
            const phase = j * 1.7 + bi * 0.9;
            const theta = (st.rot * Math.PI) / 180;
            const dx = Math.cos(theta);
            const dy = Math.sin(theta);
            let along: number;
            let side = 0;
            let diam: number;
            if (j === 0) {
              const gap = gm.h * 0.7 * (1 + 0.3 * Math.sin(raw * 16 + phase));
              along = st.len + gap;
              side = gm.h * 0.18 * Math.sin(raw * 13 + phase);
              diam = gm.h * 0.6 * (0.75 + 0.25 * Math.sin(raw * 20 + phase));
            } else {
              const f = (raw * 2.6 + (j - 1) * 0.5 + bi * 0.27) % 1;
              along = f * st.len;
              diam = gm.h * 1.55 * Math.sin(Math.PI * f);
            }
            diam *= st.g;
            const x = gm.ox + dx * along - dy * side + drift;
            const y = gm.oy + dy * along + dx * side - drift * 0.55;
            drop.style.width = `${diam.toFixed(1)}px`;
            drop.style.height = `${diam.toFixed(1)}px`;
            drop.style.transform = `translate3d(${(x - diam / 2).toFixed(1)}px, ${(y - diam / 2).toFixed(1)}px, 0)`;
          });
        }
        titleEl.style.transform = `translate3d(0, ${(-raw * 36).toFixed(1)}px, 0)`;
      }

      // 2. Accordion: the card at the trigger line is the open one. The line is worked out from the
      //    list's fixed top and the folded row height (not from the current, animating layout), so
      //    opening and folding never feed back into the choice. Near the end of the page the line
      //    sweeps down so the last card gets its turn too.
      {
        const mobile = window.matchMedia(MOBILE_QUERY).matches;
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const headH = cards[0].querySelector<HTMLElement>(".svc-head")?.offsetHeight ?? 0;
        const pitch = headH + (mobile ? 0 : CLOSED_REM * rem) + 2 * RULE_PX;
        const maxScroll = document.documentElement.scrollHeight - vh;
        const toEnd = clamp01(1 - (maxScroll - window.scrollY) / (vh * 0.8));
        const line = vh * (0.5 + 0.4 * toEnd);
        const firstTop = cards[0].getBoundingClientRect().top;
        const idx = Math.min(cards.length - 1, Math.max(0, Math.floor((line - firstTop) / pitch)));
        setActive(idx);
      }

      // 3. Service cards: the mockups drift against each other as each card passes.
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const p = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / vh));
        card.style.setProperty("--p", p.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      fit();
      measureBars();
      onScroll();
    };

    fit();
    measureBars();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Headline slides in once as the section arrives.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            stageEl.classList.add("is-in");
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    io.observe(stageEl);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // The curve is animated with SVG (SMIL) and everything around it with CSS. Restart both clocks together so the ball matches the curve.
  useEffect(() => {
    const scene = wrap.current?.querySelector<HTMLElement>(".svc-motion");
    const svg = scene?.querySelector<SVGSVGElement>(".mo-curve");
    if (!scene || !svg || typeof scene.getAnimations !== "function") return;
    svg.setCurrentTime(0);
    scene.getAnimations({ subtree: true }).forEach((a) => {
      a.currentTime = 0;
    });
  }, []);

  return (
    <section id="services" className="svx" aria-labelledby="svx-heading">
      <div ref={track} className="svx-track">
        <div ref={stage} className="svx-stage">
          <div ref={strokes} className="svx-strokes" aria-hidden>
            <span className="svx-stroke svx-stroke-a" />
            <span className="svx-stroke svx-stroke-b" />
            <span className="svx-drop" />
            <span className="svx-drop" />
            <span className="svx-drop" />
            <span className="svx-drop" />
            <span className="svx-drop" />
            <span className="svx-drop" />
          </div>

          {/* Blur + threshold: shapes that touch melt into each other like liquid. */}
          <svg className="svx-defs" width="0" height="0" aria-hidden focusable="false">
            <defs>
              <filter id="svx-goo" colorInterpolationFilters="sRGB">
                <feGaussianBlur in="SourceGraphic" stdDeviation="13" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
          </svg>

          <div ref={title} className="svx-title-wrap">
            <h2 id="svx-heading" className="svx-title">
              <span className="svx-line svx-line-a">
                <span>Web, mobile &amp; AI.</span>
              </span>
              <span className="svx-line svx-line-b">
                <span>Built to scale.</span>
              </span>
            </h2>
            <p className="svx-label">[ Services ]</p>
          </div>

          <div ref={overlay} className="svx-overlay" aria-hidden />
        </div>
      </div>

      <div ref={wrap} className="svc-wrap">
        {SERVICES.map((s, i) => (
          <article key={s.num} className="svc" data-open={active === i}>
            <header className="svc-head">
              <span className="svc-num">[{s.num}]</span>
              <h3 className="svc-title">{s.title}</h3>
            </header>

            <div className="svc-body">
              <div className="svc-copy">
                <p>{s.copy}</p>
                <small>{s.tags}</small>
              </div>

              <div className="svc-panel" aria-hidden>
                <div className={`svc-cluster${s.layout === "phones" ? " svc-cluster-phone" : ""}`}>
                {s.layout === "motion" ? (
                  <div className="svc-motion">
                    {/* Left: an easing-curve editor. The curve morphs between ease-in-out and an overshoot while the ball under it runs the same easing. */}
                    <div className="mo-card mo-card-curve">
                      <span className="mo-label">
                        <span>ease-in-out</span>
                        <span>back-out · overshoot</span>
                      </span>
                      <svg className="mo-curve" viewBox="-3 -10 20 28">
                        <rect className="mo-frame" x="0" y="0" width="14" height="14" />
                        <path className="mo-grid" d="M3.5 0V14M7 0V14M10.5 0V14M0 3.5H14M0 7H14M0 10.5H14" />
                        <path className="mo-diag" d="M0 14L14 0" />
                        <line className="mo-arm" x1="0" y1="14" x2="9.1" y2="14">
                          <animate attributeName="x2" values={CURVE_X1} {...CURVE_TIMING} />
                          <animate attributeName="y2" values={CURVE_Y1} {...CURVE_TIMING} />
                        </line>
                        <line className="mo-arm" x1="14" y1="0" x2="4.9" y2="0">
                          <animate attributeName="x2" values={CURVE_X2} {...CURVE_TIMING} />
                        </line>
                        <path className="mo-path" d="M0 14C9.1 14 4.9 0 14 0">
                          <animate attributeName="d" values={CURVE_D} {...CURVE_TIMING} />
                        </path>
                        <rect className="mo-end" x="-0.5" y="13.5" width="1" height="1" />
                        <rect className="mo-end" x="13.5" y="-0.5" width="1" height="1" />
                        <circle className="mo-knob" cx="9.1" cy="14" r="0.9">
                          <animate attributeName="cx" values={CURVE_X1} {...CURVE_TIMING} />
                          <animate attributeName="cy" values={CURVE_Y1} {...CURVE_TIMING} />
                        </circle>
                        <circle className="mo-knob" cx="4.9" cy="0" r="0.9">
                          <animate attributeName="cx" values={CURVE_X2} {...CURVE_TIMING} />
                        </circle>
                      </svg>
                      <div className="mo-track">
                        <span className="mo-ball" />
                      </div>
                    </div>

                    {/* Right: a toggle, a like button, a button with loading and success states, and a staggered list. */}
                    <div className="mo-card mo-card-play">
                      <div className="mo-sec">
                        <span className="mo-cap">Toggle · Like</span>
                        <div className="mo-row-center">
                          <span className="mo-toggle">
                            <i />
                          </span>
                          <span className="mo-like">
                            <svg viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <s />
                            <s />
                            <s />
                            <s />
                            <s />
                            <s />
                          </span>
                        </div>
                      </div>
                      <div className="mo-sec">
                        <span className="mo-cap">Button states</span>
                        <div className="mo-row-center">
                          <span className="mo-btn">
                            <span className="mo-btn-label">
                              Let&apos;s go <b>→</b>
                            </span>
                            <i className="mo-spin" />
                            <b className="mo-check">✓</b>
                          </span>
                        </div>
                      </div>
                      <div className="mo-sec">
                        <span className="mo-cap">Stagger</span>
                        <div className="mo-list">
                          <span className="mo-item">
                            <i />
                            <b />
                            <em />
                          </span>
                          <span className="mo-item">
                            <i />
                            <b />
                            <em />
                          </span>
                          <span className="mo-item">
                            <i />
                            <b />
                            <em />
                          </span>
                        </div>
                        <div className="mo-prog">
                          <u />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : s.layout === "ai" ? (
                  <div className="ai-scene">
                    {/* A chat that streams its answer, next to the RAG pipeline that produced it. */}
                    <div className="ai-card ai-chat">
                      <span className="ai-cap">Assistant</span>
                      <div className="ai-msg ai-user">Summarize the Q3 report</div>
                      <div className="ai-msg ai-bot">
                        <span className="ai-typing">
                          <i />
                          <i />
                          <i />
                        </span>
                        <span className="ai-stream">
                          <b />
                          <b />
                          <b />
                          <b />
                          <u className="ai-caret" />
                        </span>
                      </div>
                      <span className="ai-tool">search_docs(&quot;Q3 report&quot;)</span>
                      <div className="ai-input">
                        <span />
                        <i />
                      </div>
                    </div>
                    <div className="ai-card ai-flow">
                      <span className="ai-cap">RAG pipeline</span>
                      <div className="ai-nodes">
                        <span className="ai-node">
                          <i />
                          Documents
                        </span>
                        <span className="ai-link">
                          <u />
                        </span>
                        <span className="ai-node">
                          <i />
                          Embeddings
                        </span>
                        <span className="ai-link">
                          <u />
                        </span>
                        <span className="ai-node">
                          <i />
                          Vector search
                        </span>
                        <span className="ai-link">
                          <u />
                        </span>
                        <span className="ai-node">
                          <i />
                          LLM answer
                        </span>
                      </div>
                      <span className="ai-cited">
                        <i />
                        Answer grounded in 3 sources
                      </span>
                    </div>
                  </div>
                ) : s.layout === "ux" ? (
                  <div className="ux-scene">
                    {/* A dashed wireframe is painted into the finished screen, beside the design tokens and a flow. */}
                    <div className="ux-art">
                      <div className="ux-frame">
                        {(["wire", "final"] as const).map((kind) => (
                          <div key={kind} className={`ux-ui ux-ui-${kind}`}>
                            <span className="u-head">
                              <i />
                              <b />
                            </span>
                            <span className="u-hero" />
                            <span className="u-title" />
                            <span className="u-line" />
                            <span className="u-line u-short" />
                            <span className="u-btn" />
                          </div>
                        ))}
                        <span className="ux-guide">
                          <em>16 px</em>
                        </span>
                        <span className="ux-wipe" />
                      </div>
                    </div>
                    <div className="ux-panel">
                      <div>
                        <span className="ux-cap">Colour</span>
                        <div className="ux-swatches">
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                        </div>
                      </div>
                      <div>
                        <span className="ux-cap">Type</span>
                        <div className="ux-type">
                          <strong>Aa</strong>
                          <span>
                            <b />
                            <i />
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="ux-cap">Spacing</span>
                        <div className="ux-space">
                          <b />
                          <b />
                          <b />
                        </div>
                      </div>
                      <div>
                        <span className="ux-cap">User flow</span>
                        <div className="ux-flow">
                          <i />
                          <i />
                          <i />
                          <u />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : s.layout === "shop" ? (
                  <>
                    {/* A storefront drawn from scratch: the cursor adds two products, a dot flies to the cart and the badge counts up. */}
                    <span className="sh-swatch">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                    <div className="sh-window">
                      <div className="sh-bar">
                        <i />
                        <i />
                        <i />
                        <span>yourstore.com</span>
                      </div>
                      <div className="sh-nav">
                        <b className="sh-logo">STORE</b>
                        <span className="sh-links">
                          <i />
                          <i />
                          <i />
                        </span>
                        <span className="sh-cart">
                          <svg viewBox="0 0 24 24">
                            <path d="M3 4h2l2.4 11h10.2L20 7H6.2" />
                            <circle cx="9" cy="19.5" r="1.6" />
                            <circle cx="17" cy="19.5" r="1.6" />
                          </svg>
                          <span className="sh-badge" />
                        </span>
                        <span className="sh-checkout">Checkout · 2 items →</span>
                      </div>
                      <div className="sh-body">
                        <div className="sh-title">
                          <b />
                          <i />
                        </div>
                        <div className="sh-grid">
                          {["₹499", "₹799", "₹649"].map((price, n) => (
                            <div key={n} className={`sh-card sh-card-${n}`}>
                              <span className="sh-img">
                                <span className={`sh-prod sh-prod-${n}`} />
                              </span>
                              <span className="sh-info">
                                <b />
                                <strong>{price}</strong>
                              </span>
                              <span className="sh-add">
                                <i className="sh-plus">+</i>
                                <i className="sh-check">✓</i>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="sh-fly sh-fly-0">
                        <i />
                      </span>
                      <span className="sh-fly sh-fly-2">
                        <i />
                      </span>
                      <svg className="sh-cursor" viewBox="0 0 14 20">
                        <path d="M1 1v15l4-3.6 3 6.6 2.4-1.1-3-6.4H13z" fill="#14100e" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </>
                ) : s.layout === "browser" ? (
                  <>
                    {s.shots?.map((shot, k) => (
                      <figure key={k} className={`svc-shot ${k === 0 ? "svc-shot-a" : "svc-shot-b"}`}>
                        <div className="svc-shot-bar">
                          <i />
                          <i />
                          <i />
                          <span>{shot.host}</span>
                        </div>
                        <div className="svc-shot-img">
                          <Image src={shot.src} alt="" fill sizes="(max-width: 900px) 80vw, 40vw" style={{ objectFit: "cover", objectPosition: "top" }} />
                        </div>
                      </figure>
                    ))}
                  </>
                ) : (
                  <>
                    {/* The phone is an app drawn from scratch: a progress ring, a scrolling list and a tab bar. */}
                    <div className="svc-phone svc-phone-main">
                      <span className="ph-notch" />
                      <div className="ph-screen">
                        <div className="ph-status" />
                        <div className="ph-head">
                          <span className="ph-avatar" />
                          <span className="ph-lines">
                            <b />
                            <i />
                          </span>
                        </div>
                        <div className="ph-hero">
                          <span className="ph-ring-wrap">
                            <svg className="ph-ring" viewBox="0 0 44 44">
                              <circle cx="22" cy="22" r="18" className="ph-ring-bg" />
                              <circle cx="22" cy="22" r="18" className="ph-ring-fg" />
                            </svg>
                          </span>
                          <span className="ph-hero-text">
                            <b />
                            <i />
                          </span>
                        </div>
                        <div className="ph-list">
                          <div className="ph-track">
                            {[0, 1, 2, 3, 0, 1, 2, 3].map((c, n) => (
                              <div key={n} className={`ph-row ph-row-${c}`}>
                                <span className="ph-thumb" />
                                <span className="ph-row-lines">
                                  <b />
                                  <i />
                                </span>
                                <em />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="ph-tabs">
                          <u />
                          <i />
                          <i />
                          <i />
                          <i />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
