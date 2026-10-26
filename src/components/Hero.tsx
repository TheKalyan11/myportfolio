"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Mascot } from "page-mascot";
import { X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import CursorTrail from "@/components/CursorTrail";
import { EMAIL } from "@/data/contact";
import { scrollToSection } from "@/lib/scrollToSection";

// Skill tags: they only react to the pointer (hover), they do not link anywhere.
const TAGS = [
  { label: "Generative AI & LLM Applications" },
  { label: "AI Agents & Workflow Automation" },
  { label: "RAG Pipelines & AI Integrations" },
  { label: "AWS Cloud Infrastructure & Serverless Architecture" },
  { label: "Full-Stack & Distributed Systems Architecture" },
  { label: "Next.js, React 19 & Modern Web Applications" },
  { label: "Cross-Platform Mobile App Development" },
  { label: "REST APIs, Database Design & Backend Engineering" },
];

// One entry for each section of the page, in page order.
const NAV_LINKS = [
  { number: "01", label: "About", href: "#intro" },
  { number: "02", label: "Selected Projects", href: "#selected-projects" },
  { number: "03", label: "Services", href: "#services" },
  { number: "04", label: "How I Work", href: "#process" },
  { number: "05", label: "Tech Stack", href: "#tech-stack" },
  { number: "06", label: "Other Skills", href: "#other-skills" },
  { number: "07", label: "Certifications", href: "#certifications" },
  { number: "08", label: "Open Source", href: "#open-source" },
  { number: "09", label: "Explore", href: "#explore" },
  { number: "10", label: "FAQ", href: "#faq" },
  { number: "11", label: "Contact", href: "#contact" },
];

// The title's font size is clamp(4.4rem, 9.8vw, 10.2rem) with a line height of 0.85, so the mascot is sized from one title line (the drawing has some empty margin, hence the 2).
const mascotSizeFor = (viewportWidth: number) => {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const font = Math.min(Math.max(viewportWidth * 0.098, 4.4 * rem), 10.2 * rem);
  return Math.round(font * 0.85 * 2);
};

const MARQUEE_ITEMS = TAGS.map((t) => t.label);

export default function Hero() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mascotSize, setMascotSize] = useState(64);

  useEffect(() => {
    const fit = () => setMascotSize(mascotSizeFor(window.innerWidth));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <section id="about" className="hero">
      {/* Top bar */}
      <nav className="hero-nav" aria-label="Primary">
        <a href="#about" className="hero-logo">
          thekalyan.online
        </a>
        <button
          className="hero-burger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <span />
          <span />
        </button>
      </nav>

      <div className="hero-body">
        {/* Portrait: right half on desktop, stacked below the copy on mobile */}
        <div className="hero-media">
          <CursorTrail>
            <Image
              src="/Contemplative Sepia Profile Portrait.png"
              alt="Contemplative Sepia Profile Portrait"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </CursorTrail>
        </div>

        <div className="hero-copy">
          <div className="hero-title-row">
            <h1 className="hero-title">
              <span className="hero-line">
                <span>THE</span>
              </span>
              <span className="hero-line">
                <span>KALYAN</span>
              </span>
            </h1>
            {/* Stands between THE and KALYAN, to the right of THE. It follows the pointer and blinks when poked (sheets are in /public/mascots). */}
            <div className="hero-mascot">
              <Mascot
                directions="/mascots/crt-directions.webp"
                reactions="/mascots/crt-reactions.webp"
                size={mascotSize}
                label="Mascot that follows your cursor"
              />
            </div>
          </div>

          <p className="hero-lede">
            <strong>Full Stack &amp; AI Engineer</strong> · Web &amp; Mobile Apps, AWS, Generative AI &amp; Intelligent Automation
            <br />
            Architecting scalable distributed systems, production-grade AI applications, and intelligent automation solutions.
          </p>

          <ul className="hero-tags">
            {TAGS.map((tag) => (
              <li key={tag.label}>
                <span className="hero-tag">{tag.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Scrolling text band (two identical halves so -50% loops seamlessly) */}
      <div className="hero-marquee" aria-hidden>
        <div className="hero-marquee-track">
          {[0, 1].map((half) => (
            <div key={half} style={{ display: "flex" }}>
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <span key={`${item}-${i}`} className="hero-marquee-item">
                  {item}
                  <i>✺</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Full-screen menu */}
      {menuOpen && (
        <div className="hero-menu">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="hero-logo">thekalyan.online // MENU</span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
              style={{ background: "none", border: 0, cursor: "pointer", color: "inherit", padding: 8 }}
            >
              <X size={28} />
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "0.6rem", margin: "auto 0" }}>
            {NAV_LINKS.map((item) => (
              <a
                key={item.number}
                href={item.href}
                className="hero-menu-link"
                onClick={(e) => {
                  setMenuOpen(false);
                  if (scrollToSection(item.href)) e.preventDefault();
                }}
              >
                <span style={{ fontSize: "1rem", opacity: 0.45 }}>{item.number}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              paddingTop: "1.5rem",
              borderTop: "1.5px solid #b8b5b0",
              fontSize: "0.9rem",
            }}
          >
            <div>
              Direct dispatch: <a href={`mailto:${EMAIL}`} style={{ color: "inherit", fontWeight: 700 }}>{EMAIL}</a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <button
                onClick={toggleTheme}
                className="hero-tag"
                style={{ background: "none", cursor: "pointer" }}
              >
                Switch Palette ({theme})
              </button>
              <span>Hyderabad, India • IST</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
