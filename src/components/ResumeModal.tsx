"use client";

import React, { useEffect } from "react";
import { X, Download, Printer, ExternalLink, Mail, MapPin, Briefcase, Award } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { personal, experience, certifications } = PORTFOLIO_DATA;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

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
        backgroundColor: "rgba(10, 10, 10, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "860px",
          maxHeight: "92vh",
          overflowY: "auto",
          backgroundColor: "#fbf8f2",
          color: "#18181b",
          borderRadius: "16px",
          border: "1px solid rgba(0, 0, 0, 0.15)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.6)",
          padding: "2.5rem 2.8rem",
          fontFamily: "var(--font-sans), -apple-system, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
        className="resume-modal-content"
      >
        {/* Top Controls: Print, Download, Close */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "1.2rem",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            marginBottom: "1.8rem",
          }}
          className="no-print"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#71717a",
              }}
            >
              Curriculum Vitae
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <button
              onClick={handlePrint}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "6px 14px",
                borderRadius: "6px",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                background: "#ffffff",
                color: "#18181b",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                background: "#ffffff",
                color: "#18181b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Resume Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.4rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "0.35rem",
              color: "#09090b",
            }}
          >
            Kalyan V.
          </h1>
          <div
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "#3f3f46",
              marginBottom: "0.8rem",
            }}
          >
            Full Stack Developer | Web &amp; Mobile Apps, AWS, and LLM Solutions
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.2rem",
              fontSize: "0.85rem",
              color: "#52525b",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <MapPin size={14} /> {personal.location}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Mail size={14} /> {personal.email}
            </span>
            <span>GitHub: github.com</span>
            <span>LinkedIn: linkedin.com</span>
          </div>
        </div>

        {/* Professional Summary */}
        <div style={{ marginBottom: "1.8rem" }}>
          <h2
            style={{
              fontSize: "0.88rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderBottom: "2px solid #18181b",
              paddingBottom: "0.3rem",
              marginBottom: "0.8rem",
            }}
          >
            Professional Summary
          </h2>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "#3f3f46" }}>
            Full Stack Developer with 5+ years of experience engineering high-performance Web &amp; Mobile applications, resilient AWS cloud architectures, and production-grade LLM solutions. Proven track record architecting distributed microservices, building real-time multi-agent workflows, and delivering sub-second responsive user interfaces.
          </p>
        </div>

        {/* Core Technical Expertise */}
        <div style={{ marginBottom: "1.8rem" }}>
          <h2
            style={{
              fontSize: "0.88rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderBottom: "2px solid #18181b",
              paddingBottom: "0.3rem",
              marginBottom: "0.8rem",
            }}
          >
            Core Technical Expertise
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem", fontSize: "0.9rem" }}>
            <div>
              <strong>Web &amp; Mobile Apps:</strong> Next.js 16 (App Router / PPR), React 19, TypeScript, React Native, JavaScript (ESNext), Tailwind CSS, WebSockets, Responsive State Machines.
            </div>
            <div>
              <strong>AWS &amp; Cloud Infrastructure:</strong> AWS (ECS, Lambda, S3, CloudFront, Route53, RDS), Docker Containerization, Kubernetes, CI/CD GitHub Actions, Kafka, Prometheus.
            </div>
            <div>
              <strong>LLM Solutions &amp; AI:</strong> Autonomous Agent Graphs, LangChain, RAG Pipelines, Vector Databases (pgvector, Redis, Pinecone), OpenAI &amp; Gemini API integrations, Prompt Engineering.
            </div>
            <div>
              <strong>Databases &amp; Systems:</strong> PostgreSQL, Redis (Cluster, Queues, Pub/Sub), MongoDB, TimescaleDB, GraphQL, REST APIs, Microservices Architecture.
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div style={{ marginBottom: "1.8rem" }}>
          <h2
            style={{
              fontSize: "0.88rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderBottom: "2px solid #18181b",
              paddingBottom: "0.3rem",
              marginBottom: "1rem",
            }}
          >
            Work Experience
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>
            {experience.map((exp) => (
              <div key={exp.company}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <div>
                    <strong style={{ fontSize: "1.05rem", color: "#09090b" }}>{exp.role}</strong>
                    <span style={{ color: "#71717a" }}> — {exp.company}</span>
                  </div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#52525b" }}>{exp.period}</span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#71717a", marginBottom: "0.4rem" }}>
                  {exp.location}
                </div>
                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.88rem", color: "#3f3f46", lineHeight: 1.5 }}>
                  {exp.achievements.map((ach, idx) => (
                    <li key={idx} style={{ marginBottom: "0.25rem" }}>
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div style={{ marginBottom: "1rem" }}>
          <h2
            style={{
              fontSize: "0.88rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderBottom: "2px solid #18181b",
              paddingBottom: "0.3rem",
              marginBottom: "0.8rem",
            }}
          >
            Certifications &amp; Credentials
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.88rem" }}>
            {certifications.map((c) => (
              <div key={c.title} style={{ padding: "6px 12px", background: "#f0ece1", borderRadius: "6px" }}>
                <strong>{c.title}</strong> — {c.issuer} ({c.year})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
