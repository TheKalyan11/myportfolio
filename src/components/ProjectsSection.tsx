"use client";

import React, { useState } from "react";
import { PORTFOLIO_DATA, Project } from "@/data/portfolioData";
import ProjectGraphic from "./ProjectGraphic";
import ProjectModal from "./ProjectModal";
import { ExternalLink, Layers, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";

export default function ProjectsSection() {
  const { projects } = PORTFOLIO_DATA;
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filterTabs = [
    { id: "all", label: "All Systems" },
    { id: "aicloud", label: "AI & Distributed Cloud" },
    { id: "fullstack", label: "Full-Stack SaaS" },
    { id: "frontend", label: "Frontend & Canvas" },
    { id: "tools", label: "Security & Tools" },
  ];

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  return (
    <section id="projects" className="section-wrapper" style={{ position: "relative" }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">Engineered Portfolio</div>
          <h2 className="section-title">
            Featured Projects &amp; <span className="gradient-text">Production Architectures</span>
          </h2>
          <p className="section-subtitle">
            A curated selection of high-concurrency cloud systems, generative AI platforms, and reactive user interfaces built with modern web technologies.
          </p>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.6rem",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "0.55rem 1.25rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  border: isActive
                    ? "1px solid var(--accent-cyan)"
                    : "1px solid var(--border-subtle)",
                  backgroundColor: isActive
                    ? "rgba(56, 189, 248, 0.15)"
                    : "var(--bg-card)",
                  color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                  boxShadow: isActive ? "0 0 20px rgba(56, 189, 248, 0.2)" : "none",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "2rem",
          }}
          className="projects-grid"
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-panel glass-panel-hover"
              style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: "18px",
              }}
            >
              {/* Graphic Banner */}
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedProject(project)}
              >
                <ProjectGraphic project={project} />
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  justifyContent: "space-between",
                  gap: "1.2rem",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "var(--accent-cyan)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {project.subtitle}
                    </span>
                    {project.featured && (
                      <span className="badge badge-purple" style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem" }}>
                        Featured
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 800,
                      marginBottom: "0.6rem",
                      lineHeight: 1.3,
                      cursor: "pointer",
                      color: "var(--text-primary)",
                      transition: "color 0.2s ease",
                    }}
                    onClick={() => setSelectedProject(project)}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-cyan)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                  >
                    {project.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.92rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      marginBottom: "1rem",
                    }}
                  >
                    {project.description}
                  </p>

                  {/* Metrics Badges */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.6rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {project.metrics.slice(0, 2).map((m) => (
                      <div
                        key={m.label}
                        style={{
                          fontSize: "0.78rem",
                          padding: "0.3rem 0.65rem",
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "8px",
                          display: "flex",
                          gap: "0.35rem",
                        }}
                      >
                        <span style={{ color: "var(--text-muted)" }}>{m.label}:</span>
                        <span style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.74rem",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "6px",
                          background: "var(--bg-tertiary)",
                          color: "var(--text-dim)",
                          fontWeight: 500,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--border-subtle)",
                  }}
                >
                  <button
                    onClick={() => setSelectedProject(project)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--accent-cyan)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <span>View Architecture</span>
                    <ArrowRight size={15} />
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View source on GitHub"
                      style={{
                        color: "var(--text-secondary)",
                        padding: "6px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                    >
                      <GithubIcon size={18} />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open live demo"
                      style={{
                        color: "var(--accent-cyan)",
                        padding: "6px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "transform 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <style jsx>{`
        @media (max-width: 640px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
