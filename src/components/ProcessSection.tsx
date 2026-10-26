"use client";

import React, { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// Edit the wording freely: these describe how a project usually runs.
const STEPS = [
  {
    title: "Discover",
    copy: "We talk through the goal, the people who will use it and the limits (time, budget, existing systems), so the plan starts from the real problem.",
    tags: "Goals · Users · Scope",
  },
  {
    title: "Design",
    copy: "Flows, wireframes and a visual direction, shared early so feedback is cheap and the screens are settled before the code is.",
    tags: "Wireframes · UI · Prototype",
  },
  {
    title: "Build",
    copy: "Clean code on a modern stack, shipped in small pieces you can open and try, with the back end, the AI features and the cloud set up together.",
    tags: "Next.js · APIs · AWS · AI",
  },
  {
    title: "Launch",
    copy: "Deployment, performance and accessibility checks, and monitoring on infrastructure that can grow with the product.",
    tags: "Deploy · Test · Monitor",
  },
  {
    title: "Improve",
    copy: "After launch: fixes, measurements and new features based on how people really use it, not on guesses.",
    tags: "Support · Analytics · Iterate",
  },
];

export default function ProcessSection() {
  const root = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(0); // how many steps the reader has scrolled to

  // Steps switch on as they cross the lower part of the screen, and the rule beside them fills up to the last one.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".pr-row"));
    if (prefersReducedMotion()) {
      setLit(rows.length);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.72;
      setLit(rows.filter((r) => r.getBoundingClientRect().top < line).length);
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
    <section ref={root} id="process" className="pr" aria-labelledby="pr-heading">
      <p className="pr-kicker">(PROCESS)</p>
      <h2 id="pr-heading" className="pr-heading">
        How I work
      </h2>

      <ol className="pr-list" style={{ ["--lit" as string]: lit / STEPS.length }}>
        {STEPS.map((step, i) => (
          <li key={step.title} className="pr-row" data-on={i < lit}>
            <span className="pr-num">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="pr-title">{step.title}</h3>
            <p className="pr-copy">{step.copy}</p>
            <small className="pr-tags">{step.tags}</small>
          </li>
        ))}
      </ol>
    </section>
  );
}
