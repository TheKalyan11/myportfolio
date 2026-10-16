"use client";

import React, { useEffect } from "react";
import { Project } from "@/data/portfolioData";
import { X, ExternalLink, CheckCircle2, Server, Database, Cloud, Layout, Zap } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import ProjectGraphic from "./ProjectGraphic";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        backgroundColor: "rgba(3, 7, 18, 0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "840px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "var(--bg-secondary)",
          borderRadius: "24px",
          border: "1px solid var(--border-active)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7), var(--shadow-glow)",
          padding: "2rem",
        }}
        onClick={(e) => e.stopPropagation()}
        className="modal-content"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close project modal"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            zIndex: 10,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          <X size={18} />
        </button>

        {/* Visual Graphic */}
        <div style={{ marginBottom: "1.5rem", borderRadius: "14px", overflow: "hidden" }}>
          <ProjectGraphic project={project} />
        </div>

        {/* Header Information */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <span className="badge">{project.subtitle}</span>
            {project.featured && <span className="badge badge-purple">Featured Production System</span>}
          </div>
          <h2 style={{ fontSize: "1.85rem", fontWeight: 800, marginBottom: "0.6rem" }}>
            {project.title}
          </h2>
          <p style={{ fontSize: "1.02rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {project.longDescription}
          </p>
        </div>

        {/* Impact Metrics Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            marginBottom: "1.75rem",
          }}
        >
          {project.metrics.map((metric) => (
            <div
              key={metric.label}
              style={{
                background: "var(--bg-card)",
                padding: "1rem",
                borderRadius: "12px",
                border: "1px solid var(--border-subtle)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  marginBottom: "0.2rem",
                }}
                className="gradient-text"
              >
                {metric.value}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture Topology Breakdown */}
        <div style={{ marginBottom: "1.75rem" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Zap size={18} color="var(--accent-cyan)" />
            <span>Architecture &amp; System Stack</span>
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem" }}>
            <div className="glass-panel" style={{ padding: "0.85rem 1rem", display: "flex", gap: "0.75rem" }}>
              <Layout size={20} color="var(--accent-cyan)" style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>Frontend Layer</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{project.architecture.frontend}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: "0.85rem 1rem", display: "flex", gap: "0.75rem" }}>
              <Server size={20} color="var(--accent-indigo)" style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>Backend &amp; APIs</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{project.architecture.backend}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: "0.85rem 1rem", display: "flex", gap: "0.75rem" }}>
              <Database size={20} color="var(--accent-emerald)" style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>Storage &amp; State</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{project.architecture.database}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: "0.85rem 1rem", display: "flex", gap: "0.75rem" }}>
              <Cloud size={20} color="var(--accent-purple)" style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>Cloud Infrastructure</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{project.architecture.infrastructure}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Engineering Highlights */}
        <div style={{ marginBottom: "1.75rem" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            Key Engineering Highlights &amp; Solved Challenges
          </h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {project.highlights.map((highlight, idx) => (
              <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ marginTop: "3px", flexShrink: 0 }} />
                <span style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {highlight}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack Tags */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.6rem" }}>
            Technologies Used
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "0.78rem",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "8px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "flex-end",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <GithubIcon size={16} />
            <span>View Source Code</span>
          </a>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <span>Live Demonstration</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
