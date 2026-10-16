"use client";

import React from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { Briefcase, Calendar, MapPin, CheckCircle, Award } from "lucide-react";

export default function ExperienceSection() {
  const { experience, certifications } = PORTFOLIO_DATA;

  return (
    <section id="experience" className="section-wrapper" style={{ position: "relative" }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">Career Milestones</div>
          <h2 className="section-title">
            Work Experience &amp; <span className="gradient-text">Leadership</span>
          </h2>
          <p className="section-subtitle">
            A proven trajectory of engineering high-scale distributed applications, mentoring development teams, and shipping production software.
          </p>
        </div>

        {/* Timeline Container */}
        <div
          style={{
            position: "relative",
            maxWidth: "880px",
            margin: "0 auto 4rem auto",
          }}
        >
          {/* Vertical connecting line */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              bottom: "20px",
              left: "20px",
              width: "2px",
              background: "linear-gradient(180deg, var(--accent-cyan), var(--accent-indigo), transparent)",
              opacity: 0.4,
            }}
            className="timeline-vertical-line"
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {experience.map((exp, idx) => (
              <div
                key={exp.company}
                style={{
                  display: "flex",
                  gap: "2rem",
                  position: "relative",
                }}
                className="timeline-item"
              >
                {/* Node Dot */}
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "var(--bg-secondary)",
                    border: idx === 0 ? "2px solid var(--accent-cyan)" : "2px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: idx === 0 ? "0 0 16px rgba(56, 189, 248, 0.4)" : "none",
                    zIndex: 2,
                  }}
                >
                  <Briefcase size={18} color={idx === 0 ? "var(--accent-cyan)" : "var(--text-muted)"} />
                </div>

                {/* Experience Content Card */}
                <div
                  className="glass-panel glass-panel-hover"
                  style={{
                    padding: "1.8rem",
                    flex: 1,
                    borderRadius: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      marginBottom: "0.6rem",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>
                        {exp.role}
                      </h3>
                      <div
                        style={{
                          fontSize: "1.02rem",
                          fontWeight: 700,
                          color: "var(--accent-cyan)",
                          marginTop: "0.2rem",
                        }}
                      >
                        {exp.company}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
                      <span className="badge" style={{ fontSize: "0.78rem" }}>
                        <Calendar size={13} />
                        {exp.period}
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={12} />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      marginBottom: "1.2rem",
                    }}
                  >
                    {exp.description}
                  </p>

                  {/* Bullet achievements */}
                  <div style={{ marginBottom: "1.2rem" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                      Key Outcomes &amp; Impact
                    </div>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {exp.achievements.map((ach, aIdx) => (
                        <li key={aIdx} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                          <CheckCircle size={15} color="var(--accent-emerald)" style={{ marginTop: "3px", flexShrink: 0 }} />
                          <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                            {ach}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack used */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          fontSize: "0.74rem",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "6px",
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--text-dim)",
                          fontWeight: 500,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Banner */}
        <div
          className="glass-panel"
          style={{
            maxWidth: "880px",
            margin: "0 auto",
            padding: "1.8rem 2rem",
            borderRadius: "20px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
            border: "1px solid var(--border-active)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "rgba(56, 189, 248, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-cyan)",
              }}
            >
              <Award size={26} />
            </div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>Professional Certifications</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Verified industry standards and continuing cloud &amp; AI credentials
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem" }}>
            {certifications.map((c) => (
              <div
                key={c.title}
                style={{
                  padding: "0.5rem 0.9rem",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "10px",
                  fontSize: "0.8rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{c.title}</span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{c.issuer} • {c.year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .timeline-vertical-line {
            display: none !important;
          }
          .timeline-item {
            flex-direction: column !important;
            gap: 0.8rem !important;
          }
        }
      `}</style>
    </section>
  );
}
