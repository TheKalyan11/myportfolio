"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, Terminal, Heart, Globe, Cpu } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

export default function Footer() {
  const { personal } = PORTFOLIO_DATA;
  const [time, setTime] = useState<string>("");
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-secondary)",
        padding: "4rem 0 2.5rem 0",
        position: "relative",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand Info */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "var(--gradient-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                }}
              >
                <Terminal size={16} />
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--text-primary)" }}>
                Kalyan<span style={{ color: "var(--accent-cyan)" }}>.dev</span>
              </span>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "320px", marginBottom: "1rem" }}>
              Senior Full-Stack Engineer specializing in high-concurrency cloud systems, Next.js architecture, and generative AI integrations.
            </p>
            {/* Live Time Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0.8rem",
                background: "var(--bg-card)",
                borderRadius: "20px",
                border: "1px solid var(--border-subtle)",
                fontSize: "0.78rem",
                color: "var(--text-secondary)",
              }}
            >
              <Globe size={14} color="var(--accent-cyan)" />
              <span>Hyderabad (IST):</span>
              <strong style={{ color: "var(--text-primary)" }}>{time || "Loading..."}</strong>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Navigation
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.88rem" }}>
              <li>
                <a href="#about" style={{ color: "var(--text-secondary)", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-cyan)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>
                  About &amp; Overview
                </a>
              </li>
              <li>
                <a href="#projects" style={{ color: "var(--text-secondary)", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-cyan)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>
                  Featured Projects
                </a>
              </li>
              <li>
                <a href="#skills" style={{ color: "var(--text-secondary)", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-cyan)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>
                  Skills &amp; Tech Radar
                </a>
              </li>
              <li>
                <a href="#experience" style={{ color: "var(--text-secondary)", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-cyan)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>
                  Experience &amp; Milestones
                </a>
              </li>
              <li>
                <a href="#contact" style={{ color: "var(--text-secondary)", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-cyan)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>
                  Contact &amp; Connect
                </a>
              </li>
            </ul>
          </div>

          {/* Technical Stack Badge & Back to Top */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Built With
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                {["Next.js 16", "React 19", "TypeScript", "App Router", "Vanilla CSS", "Lucide"].map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "0.74rem",
                      padding: "0.25rem 0.55rem",
                      borderRadius: "6px",
                      background: "var(--bg-tertiary)",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="btn-secondary"
              style={{
                padding: "0.55rem 1rem",
                fontSize: "0.82rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span>Back to Top</span>
              <ArrowUp size={15} />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "2rem",
            borderTop: "1px solid var(--border-subtle)",
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            gap: "1rem",
          }}
        >
          <div>
            &copy; {year} {personal.fullName}. All rights reserved.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span>Crafted with</span>
            <Heart size={13} color="#ef4444" fill="#ef4444" />
            <span>&amp; high performance standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
