"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import CursorTrail from "@/components/CursorTrail";
import { EMAIL } from "@/data/contact";

// Each tag jumps to the section of this page that covers it.
const TAGS = [
  { label: "Web & Mobile Apps", target: "#selected-projects" },
  { label: "AWS Cloud Infrastructure", target: "#tech-stack" },
  { label: "LLM Solutions & Agents", target: "#tech-stack" },
  { label: "Full-Stack Architecture", target: "#services" },
  { label: "Next.js & React 19", target: "#tech-stack" },
];

// One entry for each section of the page, in page order.
const NAV_LINKS = [
  { number: "01", label: "About", href: "#intro" },
  { number: "02", label: "Selected Projects", href: "#selected-projects" },
  { number: "03", label: "Services", href: "#services" },
  { number: "04", label: "Tech Stack", href: "#tech-stack" },
  { number: "05", label: "Certifications", href: "#certifications" },
  { number: "06", label: "Explore", href: "#explore" },
  { number: "07", label: "Contact", href: "#contact" },
];

const MARQUEE_ITEMS = TAGS.map((t) => t.label);

export default function Hero() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  return (
    <section id="about" className="hero">
      {/* Top bar */}
      <nav className="hero-nav" aria-label="Primary">
        <a href="#about" className="hero-logo">
          kalyan
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
          <h1 className="hero-title">
            <span className="hero-line">
              <span>THE</span>
            </span>
            <span className="hero-line">
              <span>KALYAN</span>
            </span>
          </h1>

          <p className="hero-lede">
            <strong>Full Stack Developer</strong> · Web &amp; Mobile Apps, AWS, and LLM Solutions.
            <br />
            Architecting high-scale distributed systems &amp; intelligent production applications.
          </p>

          <ul className="hero-tags">
            {TAGS.map((tag) => (
              <li key={tag.label}>
                <a
                  href={tag.target}
                  className="hero-tag"
                  aria-current={selectedTag === tag.label}
                  onClick={() => setSelectedTag(tag.label)}
                >
                  {tag.label}
                </a>
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
            <span className="hero-logo">kalyan // MENU</span>
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
                onClick={() => setMenuOpen(false)}
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
