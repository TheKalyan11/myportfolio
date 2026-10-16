"use client";

import React from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const { testimonials } = PORTFOLIO_DATA;

  return (
    <section className="section-wrapper" style={{ position: "relative" }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">Peer Recommendations</div>
          <h2 className="section-title">
            Trusted by Engineering <span className="gradient-text">Leaders &amp; Founders</span>
          </h2>
          <p className="section-subtitle">
            What engineering leaders, architects, and collaborators have to say about working alongside me on mission-critical initiatives.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.8rem",
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="glass-panel glass-panel-hover"
              style={{
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                borderRadius: "20px",
              }}
            >
              <div>
                {/* Quote Icon & Stars */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      background: "rgba(99, 102, 241, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent-indigo)",
                    }}
                  >
                    <Quote size={18} />
                  </div>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "0.96rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    fontStyle: "italic",
                    marginBottom: "1.5rem",
                  }}
                >
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "var(--gradient-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "0.88rem",
                    boxShadow: "0 0 12px rgba(99, 102, 241, 0.4)",
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.98rem", color: "var(--text-primary)" }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {t.role} • {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
