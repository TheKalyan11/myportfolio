"use client";

import React, { useState } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { Search, Compass, CheckCircle2, Flame } from "lucide-react";

export default function SkillsSection() {
  const { skillsData, radar } = PORTFOLIO_DATA;
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Flattened search if user types in search box
  const allSkills = skillsData.flatMap((cat) =>
    cat.skills.map((s) => ({ ...s, category: cat.title }))
  );

  const filteredSkills = searchQuery.trim()
    ? allSkills.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <section id="skills" className="section-wrapper" style={{ position: "relative" }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">Technical Competencies</div>
          <h2 className="section-title">
            Skills, Frameworks &amp; <span className="gradient-text">Core Expertise</span>
          </h2>
          <p className="section-subtitle">
            A comprehensive spectrum of modern web technologies, scalable backend architectures, and AI engineering practices leveraged to deliver high-performance production systems.
          </p>
        </div>

        {/* Search & Category Header Bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {skillsData.map((cat, idx) => {
              const isActive = activeCategory === idx && !searchQuery.trim();
              return (
                <button
                  key={cat.title}
                  onClick={() => {
                    setActiveCategory(idx);
                    setSearchQuery("");
                  }}
                  style={{
                    padding: "0.5rem 1.15rem",
                    borderRadius: "10px",
                    fontSize: "0.86rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: isActive
                      ? "1px solid var(--accent-cyan)"
                      : "1px solid var(--border-subtle)",
                    backgroundColor: isActive
                      ? "rgba(56, 189, 248, 0.15)"
                      : "var(--bg-card)",
                    color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                  }}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>

          {/* Quick Filter Search */}
          <div
            style={{
              position: "relative",
              width: "min(100%, 260px)",
            }}
          >
            <input
              type="text"
              placeholder="Filter skill (e.g., Next.js, Redis)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.9rem 0.5rem 2.2rem",
                borderRadius: "10px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
            <Search
              size={15}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
            marginBottom: "3.5rem",
          }}
        >
          {(filteredSkills || skillsData[activeCategory].skills).map((skill) => (
            <div
              key={skill.name}
              className="glass-panel glass-panel-hover"
              style={{
                padding: "1.25rem 1.4rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "var(--accent-cyan)",
                    }}
                  />
                  <span style={{ fontWeight: 700, fontSize: "0.98rem", color: "var(--text-primary)" }}>
                    {skill.name}
                  </span>
                </div>
                {skill.tag && (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.55rem",
                      borderRadius: "6px",
                      backgroundColor:
                        skill.tag === "Cutting-Edge"
                          ? "rgba(168, 85, 247, 0.15)"
                          : "rgba(56, 189, 248, 0.12)",
                      color:
                        skill.tag === "Cutting-Edge"
                          ? "var(--accent-purple)"
                          : "var(--accent-cyan)",
                    }}
                  >
                    {skill.tag}
                  </span>
                )}
              </div>

              {/* Progress Bar & Experience Span */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.76rem",
                    color: "var(--text-muted)",
                    marginBottom: "0.4rem",
                  }}
                >
                  <span>Experience: {skill.years}</span>
                  <span style={{ fontWeight: 600, color: "var(--accent-cyan)" }}>{skill.level}% Mastery</span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    borderRadius: "3px",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${skill.level}%`,
                      height: "100%",
                      borderRadius: "3px",
                      background: "var(--gradient-primary)",
                      transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Radar / Active R&D Spotlight */}
        <div
          className="glass-panel"
          style={{
            padding: "2rem",
            borderRadius: "20px",
            border: "1px solid var(--border-active)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem" }}>
            <Compass size={22} color="var(--accent-purple)" />
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>
              Technical Radar &amp; <span className="gradient-text">Active Research</span>
            </h3>
            <span className="badge badge-purple" style={{ marginLeft: "auto" }}>
              <Flame size={13} />
              Continuous Exploration
            </span>
          </div>

          <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", marginBottom: "1.5rem", maxWidth: "700px" }}>
            Staying at the bleeding edge of software engineering by actively experimenting with low-level systems, distributed coordination protocols, and GPU compute paradigms.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {radar.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "var(--bg-card)",
                  padding: "1.2rem",
                  borderRadius: "14px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ fontSize: "0.92rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  {item.title}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                  <span style={{ fontSize: "0.76rem", color: "var(--accent-purple)", fontWeight: 600 }}>
                    {item.status}
                  </span>
                  <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                    {item.progress}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "5px",
                    borderRadius: "3px",
                    background: "rgba(255, 255, 255, 0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.progress}%`,
                      height: "100%",
                      borderRadius: "3px",
                      background: "linear-gradient(90deg, #6366f1, #a855f7)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
