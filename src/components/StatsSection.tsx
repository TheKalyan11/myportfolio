"use client";

import React from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { Award, Code2, ShieldCheck, Users } from "lucide-react";

export default function StatsSection() {
  const { stats } = PORTFOLIO_DATA;

  const statIcons = [
    <Award key="exp" size={24} color="var(--accent-cyan)" />,
    <Code2 key="projects" size={24} color="var(--accent-indigo)" />,
    <ShieldCheck key="uptime" size={24} color="var(--accent-emerald)" />,
    <Users key="users" size={24} color="var(--accent-purple)" />,
  ];

  return (
    <section style={{ padding: "2.5rem 0 4.5rem 0", position: "relative" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="glass-panel glass-panel-hover"
              style={{
                padding: "1.8rem 1.6rem",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {/* Subtle top accent bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background:
                    idx === 0
                      ? "var(--accent-cyan)"
                      : idx === 1
                      ? "var(--accent-indigo)"
                      : idx === 2
                      ? "var(--accent-emerald)"
                      : "var(--accent-purple)",
                  opacity: 0.8,
                }}
              />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {statIcons[idx]}
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--text-muted)",
                  }}
                >
                  Metric #{idx + 1}
                </span>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    marginBottom: "0.35rem",
                  }}
                  className="gradient-text"
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "1.02rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: "0.84rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.4,
                  }}
                >
                  {stat.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
