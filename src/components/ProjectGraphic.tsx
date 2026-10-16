"use client";

import React from "react";
import Image from "next/image";
import { Project } from "@/data/portfolioData";
import { Activity, ShieldCheck, GitPullRequest, LayoutGrid, ShoppingBag } from "lucide-react";

interface ProjectGraphicProps {
  project: Project;
}

export default function ProjectGraphic({ project }: ProjectGraphicProps) {
  if (project.graphicType === "image" && project.image) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          borderRadius: "14px 14px 0 0",
          backgroundColor: "#060911",
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: "cover",
            transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="project-image-hover"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 50%, rgba(10, 15, 26, 0.9) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            padding: "4px 10px",
            background: "rgba(8, 12, 22, 0.8)",
            backdropFilter: "blur(8px)",
            borderRadius: "20px",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "var(--accent-cyan)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--accent-cyan)",
            }}
          />
          Live Dashboard
        </div>
      </div>
    );
  }

  // Telemetry Visualizer
  if (project.graphicType === "telemetry") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: "14px 14px 0 0",
          background: "linear-gradient(135deg, #071318 0%, #0d2229 100%)",
          overflow: "hidden",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(16, 185, 129, 0.2)",
        }}
      >
        {/* Background Network Grid Pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            opacity: 0.6,
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Activity size={16} color="#10b981" />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10b981", letterSpacing: "0.05em" }}>
              CLUSTER US-EAST // 99.99% UP
            </span>
          </div>
          <span style={{ fontSize: "0.7rem", color: "#6ee7b7", background: "rgba(16, 185, 129, 0.2)", padding: "2px 8px", borderRadius: "10px" }}>
            120K req/s
          </span>
        </div>

        {/* SVG Sparkline Waves */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <svg viewBox="0 0 400 90" style={{ width: "100%", height: "70px", overflow: "visible" }}>
            <defs>
              <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,60 Q30,20 60,50 T120,40 T180,65 T240,25 T300,55 T360,30 T400,45 L400,90 L0,90 Z"
              fill="url(#telemetryGrad)"
            />
            <path
              d="M0,60 Q30,20 60,50 T120,40 T180,65 T240,25 T300,55 T360,30 T400,45"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#a7f3d0", position: "relative", zIndex: 1 }}>
          <span>p99 Latency: 14ms</span>
          <span>Nodes: 48 healthy</span>
          <span>Failover: 0 errors</span>
        </div>
      </div>
    );
  }

  // Collaborative Canvas Visualizer
  if (project.graphicType === "canvas") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: "14px 14px 0 0",
          background: "linear-gradient(135deg, #130e26 0%, #20173d 100%)",
          overflow: "hidden",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(168, 85, 247, 0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <LayoutGrid size={16} color="#c084fc" />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#c084fc" }}>
              MULTIPLAYER CRDT // 4 PEERS SYNCED
            </span>
          </div>
          <div style={{ display: "flex", gap: "-6px" }}>
            {["#38bdf8", "#ec4899", "#f59e0b"].map((c, i) => (
              <div
                key={i}
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: c,
                  border: "2px solid #130e26",
                  marginLeft: i > 0 ? "-6px" : 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Node connections */}
        <div style={{ position: "relative", height: "80px" }}>
          <svg viewBox="0 0 300 80" style={{ width: "100%", height: "100%" }}>
            <line x1="50" y1="40" x2="150" y2="25" stroke="rgba(192, 132, 252, 0.4)" strokeWidth="2" strokeDasharray="4" />
            <line x1="150" y1="25" x2="250" y2="55" stroke="rgba(192, 132, 252, 0.4)" strokeWidth="2" strokeDasharray="4" />
            <circle cx="50" cy="40" r="16" fill="#6366f1" />
            <text x="50" y="44" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Doc</text>
            <circle cx="150" cy="25" r="20" fill="#a855f7" />
            <text x="150" y="29" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">CRDT</text>
            <circle cx="250" cy="55" r="16" fill="#ec4899" />
            <text x="250" y="59" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Sync</text>
          </svg>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#e9d5ff" }}>
          <span>Yjs WebRTC Mesh</span>
          <span>Zoom: 100% (60 FPS)</span>
        </div>
      </div>
    );
  }

  // Ecommerce Storefront Visualizer
  if (project.graphicType === "ecommerce") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: "14px 14px 0 0",
          background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
          overflow: "hidden",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ShoppingBag size={16} color="#38bdf8" />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#38bdf8" }}>
              HEADLESS PPR STOREFRONT
            </span>
          </div>
          <span style={{ fontSize: "0.7rem", color: "#38bdf8", background: "rgba(56, 189, 248, 0.15)", padding: "2px 8px", borderRadius: "10px" }}>
            100/100 Core Web Vitals
          </span>
        </div>

        {/* Mock Product & Checkout Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: "10px" }}>
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              textAlign: "center",
              flex: 1,
            }}
          >
            <div style={{ fontSize: "0.7rem", color: "#a1a1aa" }}>Sub-second Prerender</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff" }}>0.4s FCP</div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(56, 189, 248, 0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              textAlign: "center",
              flex: 1,
            }}
          >
            <div style={{ fontSize: "0.7rem", color: "#7dd3fc" }}>Stripe Instant Pay</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#38bdf8" }}>+34% Conv</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#d4d4d8" }}>
          <span>Next.js 16 Partial Prerendering</span>
          <span>Apple Pay &amp; Google Pay Ready</span>
        </div>
      </div>
    );
  }

  // Security & ZK-Vault Visualizer
  if (project.graphicType === "security") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: "14px 14px 0 0",
          background: "linear-gradient(135deg, #0c1a2e 0%, #172554 100%)",
          overflow: "hidden",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(59, 130, 246, 0.3)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={16} color="#60a5fa" />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#60a5fa" }}>
              CIRCOM ZK-PROOF VERIFICATION
            </span>
          </div>
          <span style={{ fontSize: "0.7rem", color: "#93c5fd", background: "rgba(59, 130, 246, 0.2)", padding: "2px 8px", borderRadius: "10px" }}>
            0 Bytes PII Leaked
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", margin: "4px 0" }}>
          <div style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", borderRadius: "8px", fontSize: "0.75rem", color: "#bfdbfe" }}>
            Rust Wasm Proof
          </div>
          <span style={{ color: "#60a5fa", fontWeight: "bold" }}>→</span>
          <div style={{ padding: "6px 12px", background: "rgba(16, 185, 129, 0.2)", border: "1px solid #10b981", borderRadius: "8px", fontSize: "0.75rem", color: "#6ee7b7", fontWeight: "bold" }}>
            Verified In 1.1s
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#bfdbfe" }}>
          <span>FIDO2 / WebAuthn Passkeys</span>
          <span>snarkjs client circuits</span>
        </div>
      </div>
    );
  }

  // Code Review Intelligence Bot Visualizer
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: "14px 14px 0 0",
        background: "linear-gradient(135deg, #1e112a 0%, #2e1065 100%)",
        overflow: "hidden",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(217, 70, 239, 0.25)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <GitPullRequest size={16} color="#f472b6" />
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f472b6" }}>
            PR INTELLIGENCE // AST PARSER
          </span>
        </div>
        <span style={{ fontSize: "0.7rem", color: "#fbcfe8", background: "rgba(244, 114, 182, 0.2)", padding: "2px 8px", borderRadius: "10px" }}>
          -62% Turnaround
        </span>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", padding: "8px", borderRadius: "8px", fontSize: "0.72rem" }}>
          <span style={{ color: "#a855f7", fontWeight: "bold" }}>Risk Assessment:</span> Low
          <div style={{ color: "#94a3b8", fontSize: "0.68rem" }}>0 breaking API diffs detected</div>
        </div>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", padding: "8px", borderRadius: "8px", fontSize: "0.72rem" }}>
          <span style={{ color: "#f472b6", fontWeight: "bold" }}>Review Summary:</span>
          <div style={{ color: "#94a3b8", fontSize: "0.68rem" }}>Contextual markdown insights</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#f5d0fe" }}>
        <span>40K+ PRs processed</span>
        <span>94% engineer satisfaction</span>
      </div>
    </div>
  );
}
