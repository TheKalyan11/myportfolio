"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";
type ProjectItem = {
  slug: string;
  name: string; // shown large in the list
  client?: string; // full name(s), when the list name is shortened or the row covers several sites
  stack?: string; // what it is built with
  url?: string;
  linkLabel?: string;
  image?: string; // file in /public
  mark?: string; // letters on the placeholder tile when there is no image yet
  role: string;
};

const PROJECTS: ProjectItem[] = [
  {
    slug: "braj-nidhi",
    name: "Braj Nidhi",
    stack: "Next.js · NextERP",
    url: "https://thebrajnidhi.com/",
    image: "/brajnidhi.png",
    role: "Full Stack",
  },
  {
    slug: "hkm-dehradun",
    name: "HKM Dehradun",
    client: "Hare Krishna Movement Dehradun",
    stack: "Next.js · CMS",
    url: "https://www.hkmdehradun.org/",
    image: "/hkm.png",
    role: "Full Stack",
  },
  {
    slug: "baala-media-works",
    name: "Baala Media Works",
    stack: "JavaScript",
    url: "https://www.baalamediaworks.com/",
    image: "/baala.png",
    role: "Full Stack",
  },
  {
    slug: "md-mesh",
    name: "MD Mesh",
    url: "https://github.com/TheKalyan11/vcm-s-mdm",
    linkLabel: "View Repository",
    image: "/overview.png",
    role: "Full Stack",
  },
  {
    slug: "annakoot",
    name: "Annakoot",
    url: "https://annakoot.in/",
    mark: "AK",
    role: "Full Stack",
  },
  {
    slug: "movie365",
    name: "Movie365",
    stack: "Laravel · PHP",
    url: "https://github.com/TheKalyan11/movein365-",
    linkLabel: "View Repository",
    mark: "M3",
    role: "Full Stack",
  },
  // Ecommerce and Doctor have no live address yet, so this one row points to the GitHub profile for all of them.
  {
    slug: "ecommerce-doctor-more",
    name: "Ecommerce, Doctor & Other Projects",
    url: "https://github.com/TheKalyan11",
    linkLabel: "Visit My GitHub",
    image: "/ecommerce-doctor.svg",
    role: "Full Stack",
  },
];

const hostOf = (url?: string) => (url ? new URL(url).hostname.replace(/^www\./, "") : "Coming soon");

// Soft abstract tiles for projects that have no photo yet (original gradients, not client artwork).
const TILE_GRADIENTS = [
  "linear-gradient(135deg, #bcd3e6 0%, #e9d9c0 55%, #d98c7a 100%)",
  "linear-gradient(135deg, #d7c6e8 0%, #f1d9c8 55%, #9db8d8 100%)",
  "linear-gradient(135deg, #f0c9a6 0%, #e7e1c9 55%, #8fb3a3 100%)",
  "linear-gradient(135deg, #c9d9c1 0%, #efe3cf 55%, #c97b73 100%)",
  "linear-gradient(135deg, #aab9d6 0%, #ecd9cf 55%, #e0a58f 100%)",
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function SelectedProjects() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const scrolling = useRef(false);
  const projects = PROJECTS;

  // Scrolling through the list opens each project in turn: the row crossing the middle
  // of the screen is the open one. Opening a row only grows it downwards, so the row under
  // the line stays the same one and the list does not flicker.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".sp-row"));
    let frame = 0;
    let settle = 0;
    const update = () => {
      frame = 0;
      scrolling.current = true;
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        scrolling.current = false;
      }, 250);
      // The trigger line sits mid-screen, then sweeps to the bottom over the last stretch of the
      // page so the final rows (which can never reach mid-screen) still get their turn.
      const vh = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - vh;
      const toEnd = Math.min(1, Math.max(0, 1 - (maxScroll - window.scrollY) / (vh * 0.8)));
      const line = vh * (0.5 + 0.47 * toEnd);
      let idx = rows.findIndex((r) => r.getBoundingClientRect().bottom > line);
      if (idx === -1) idx = rows.length - 1;
      setActive(idx);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(settle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Hover still works, but rows sliding under a resting pointer during a scroll must not take over.
  const hoverRow = (i: number) => {
    if (!scrolling.current) setActive(i);
  };

  // Fade the heading and rows in once, as they scroll into view.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
      targets.forEach((t) => t.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root} id="selected-projects" className="sp" aria-labelledby="sp-heading">
      <h2 id="sp-heading" className="sp-heading" data-reveal>
        Selected Projects
      </h2>

      <ul className="sp-list">
        {projects.map((project, i) => {
          const name = project.name;
          const open = active === i;
          return (
            <li
              key={project.slug}
              className="sp-row"
              data-open={open}
              data-reveal
              style={{ transitionDelay: `${i * 60}ms` }}
              onMouseEnter={() => hoverRow(i)}
            >
              <div className="sp-inner">
                <h3 className="sp-name">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                  >
                    {name}
                  </button>
                </h3>

                {project.url && (
                  <a
                    className="sp-jump"
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={open ? 0 : -1}
                  >
                    {project.linkLabel ?? "Jump To Project"} <ArrowRight size={15} />
                  </a>
                )}

                <dl className="sp-meta">
                  <div>
                    <dt>Role</dt>
                    <dd>{project.role}</dd>
                  </div>
                  {project.client && (
                    <div>
                      <dt>Client</dt>
                      <dd>{project.client}</dd>
                    </div>
                  )}
                  {project.stack && (
                    <div>
                      <dt>Built with</dt>
                      <dd>{project.stack}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Link</dt>
                    <dd>{hostOf(project.url)}</dd>
                  </div>
                </dl>

                <div
                  className="sp-media"
                  style={project.image ? undefined : { background: TILE_GRADIENTS[i % TILE_GRADIENTS.length] }}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={`${name} preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, 330px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span className="sp-tile-mark" aria-hidden>
                      {project.mark ?? initials(name)}
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
