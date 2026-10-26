"use client";

import React, { useEffect, useRef, useState } from "react";
import { Aperture, Film, Gamepad2, Video } from "lucide-react";
import { siBlender, siDavinciresolve, siDji, siGodotengine, siSony, siUnity, siUnrealengine, siWondersharefilmora } from "simple-icons";

// Edit the descriptions and the software lists freely.
// A tool is either a brand from "simple-icons" (`brand`), or a lettered tile (`letters`) for apps that have no icon there. Both keep the software's own colours.
type Tool = { name: string; brand?: { path: string; hex: string }; letters?: { text: string; bg: string; fg: string } };

type Skill = { title: string; copy: string; Icon: typeof Aperture; tools: Tool[] };

const SKILLS: Skill[] = [
  {
    title: "Photography",
    copy: "Capturing and retouching photos for brands, products and people, with an eye for light, framing and colour.",
    Icon: Aperture,
    tools: [
      { name: "Lightroom", letters: { text: "Lr", bg: "#001e36", fg: "#31a8ff" } },
      { name: "Photoshop", letters: { text: "Ps", bg: "#001e36", fg: "#31a8ff" } },
      { name: "Sony", brand: siSony },
    ],
  },
  {
    title: "Videography",
    copy: "Shooting video that tells a story: promos, product films, events and short social clips.",
    Icon: Video,
    tools: [
      { name: "DJI", brand: siDji },
      { name: "Sony", brand: siSony },
      { name: "After Effects", letters: { text: "Ae", bg: "#00005b", fg: "#9999ff" } },
    ],
  },
  {
    title: "Video editing",
    copy: "Cutting, colour grading and adding motion graphics and sound, so the footage becomes a finished piece.",
    Icon: Film,
    tools: [
      { name: "Premiere Pro", letters: { text: "Pr", bg: "#00005b", fg: "#9999ff" } },
      { name: "After Effects", letters: { text: "Ae", bg: "#00005b", fg: "#9999ff" } },
      { name: "DaVinci Resolve", brand: siDavinciresolve },
      { name: "Filmora", brand: siWondersharefilmora },
    ],
  },
  {
    title: "Game development",
    copy: "Building playable games and interactive worlds, from the first prototype to the finished 2D or 3D game.",
    Icon: Gamepad2,
    tools: [
      { name: "Unity", brand: siUnity },
      { name: "Unreal Engine", brand: siUnrealengine },
      { name: "Godot", brand: siGodotengine },
      { name: "Blender", brand: siBlender },
    ],
  },
];

export default function OtherSkills() {
  const root = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  // the cards fade in once the top of the section has come up into the screen
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        setSeen(true);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={root} id="other-skills" className="ok" data-seen={seen} aria-labelledby="ok-heading">
      <p className="pr-kicker">(BEYOND CODE)</p>
      <h2 id="ok-heading" className="pr-heading">
        Other skills
      </h2>
      <p className="os-lede">Away from the keyboard I also work with cameras, edit video and build games. They shape how I design and animate for the web.</p>

      <ul className="ok-grid">
        {SKILLS.map(({ title, copy, Icon, tools }, i) => (
          <li key={title} className="ok-card" style={{ transitionDelay: `${i * 90}ms` }}>
            <span className="ok-icon" aria-hidden>
              <Icon size={28} strokeWidth={1.7} />
            </span>
            <h3>{title}</h3>
            <p>{copy}</p>
            <ul className="ok-tools" aria-label={`${title} software`}>
              {tools.map((t) => (
                <li key={t.name} className="ok-tool">
                  {t.brand ? (
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d={t.brand.path} fill={`#${["000000", "FFFFFF"].includes(t.brand.hex.toUpperCase()) ? "0a0a0a" : t.brand.hex}`} />
                    </svg>
                  ) : t.letters ? (
                    <span className="ok-letters" style={{ background: t.letters.bg, color: t.letters.fg, borderColor: t.letters.fg }} aria-hidden>
                      {t.letters.text}
                    </span>
                  ) : null}
                  {t.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
