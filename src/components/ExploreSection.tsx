"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Play, Pause, Sparkles, Gamepad2, Disc3 } from "lucide-react";
import CrazyCalculator from "@/components/CrazyCalculator";
import MusicWavePlayer from "@/components/MusicWavePlayer";
import PixelStudio from "@/components/PixelStudio";
import AiAssistant from "@/components/AiAssistant";
import TokenLab from "@/components/TokenLab";
import MoodReader from "@/components/MoodReader";

interface ExploreItem {
  id: string;
  category: "music" | "creative" | "games" | "ai";
  categoryLabel: string;
  countBadge: string;
  pillBg: string;
  pillColor: string;
  cardBg: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  tags: string[];
  features: string[];
}

const EXPLORE_ITEMS: ExploreItem[] = [
  {
    id: "music-player",
    category: "music",
    categoryLabel: "MUSIC",
    countBadge: "01+",
    pillBg: "#fed24c",
    pillColor: "#2a170f",
    cardBg: "#f6be32",
    title: "MUSIC PLAYER",
    subtitle: "MUSIC",
    image: "/explore/music-player.jpg",
    description: "A retro-modern vinyl record player web experience with realistic turntable physics, vinyl scratch audio, Lo-Fi beat generator, and spatial audio effects.",
    tags: ["Web Audio API", "Canvas Visualizer", "Three.js", "React"],
    features: [
      "Vinyl turntable physics simulation & tonearm tracking",
      "Dynamic real-time frequency spectrum visualizer",
      "Lo-Fi chill beats generator & ambient sound mixer",
      "Offline caching with IndexedDB audio persistence"
    ]
  },
  {
    id: "pixel-studio",
    category: "creative",
    categoryLabel: "CREATIVE",
    countBadge: "02+",
    pillBg: "#ffffff",
    pillColor: "#2a170f",
    cardBg: "#e9e9e9",
    title: "PIXEL STUDIO",
    subtitle: "PIXEL ART MAKER",
    image: "/explore/pixel-studio.svg",
    description: "Draw your own pixel art right in the page: pick colors, fill shapes, mirror your strokes, and save the result as a crisp PNG. It all runs on your device and nothing is uploaded.",
    tags: ["Canvas API", "Pointer Events", "React", "TypeScript"],
    features: [
      "Pencil, eraser, flood fill and color picker with keyboard shortcuts",
      "Mirror mode, 16, 24 and 32 pixel canvases, and a 60-step undo and redo",
      "Touch, pen and mouse drawing through one set of pointer events",
      "Exports a sharp, transparent PNG on the visitor's own device"
    ]
  },
  {
    id: "games",
    category: "games",
    categoryLabel: "GAMES",
    countBadge: "03+",
    pillBg: "#cbbaee",
    pillColor: "#2a170f",
    cardBg: "#bfaee9",
    title: "GAMES",
    subtitle: "CRAZY CALCULATOR",
    image: "/explore/games.jpg",
    description: "A joke calculator that always gives ridiculous, wrong answers. Nothing is ever charged.",
    tags: ["WebGL", "PixiJS", "Game Loop", "Audio FX"],
    features: [
      "60 FPS hardware-accelerated canvas rendering",
      "Full gamepad & DualSense controller support",
      "Global leaderboard with anti-cheat state validation",
      "Responsive touch controls for mobile devices"
    ]
  },
  {
    id: "ai-assistant",
    category: "ai",
    categoryLabel: "AI",
    countBadge: "04+",
    pillBg: "#d7f0e3",
    pillColor: "#2a170f",
    cardBg: "#a9dcc2",
    title: "ASK KALYAN",
    subtitle: "AI ASSISTANT",
    image: "/explore/ai-assistant.svg",
    description: "Chat with a small assistant that answers questions about Kalyan's skills, projects and AI work. It retrieves the best-matching facts and streams the answer back, like a tiny RAG pipeline that runs in your browser.",
    tags: ["RAG idea", "Streaming UI", "React", "TypeScript"],
    features: [
      "Matches your question against facts and shows what it retrieved",
      "Streams the answer a few characters at a time",
      "Runs entirely in the browser: no AI service, nothing is sent anywhere",
      "Suggested questions to get started"
    ]
  },
  {
    id: "token-lab",
    category: "ai",
    categoryLabel: "AI",
    countBadge: "05+",
    pillBg: "#d6e8fb",
    pillColor: "#2a170f",
    cardBg: "#a9cdf3",
    title: "TOKEN LAB",
    subtitle: "HOW AI READS TEXT",
    image: "/explore/token-lab.svg",
    description: "See how a language model reads your text: split into tokens, counted, and priced. Type anything and watch the colored tokens, the counts and the estimated cost change.",
    tags: ["Tokenization", "LLM basics", "React", "TypeScript"],
    features: [
      "Live token, word and character counts",
      "Colored tokens with optional token IDs",
      "Cost estimate from your own price per million tokens",
      "A simple approximation of real tokenizers"
    ]
  },
  {
    id: "mood-reader",
    category: "ai",
    categoryLabel: "AI",
    countBadge: "06+",
    pillBg: "#fbe0cc",
    pillColor: "#2a170f",
    cardBg: "#f5b996",
    title: "MOOD READER",
    subtitle: "SENTIMENT ANALYSIS",
    image: "/explore/mood-reader.svg",
    description: "Write a sentence and see the mood it carries on a gauge, with the positive and negative words highlighted. It understands \"not good\" and \"very good\".",
    tags: ["Sentiment analysis", "NLP basics", "React", "TypeScript"],
    features: [
      "Animated mood gauge from very negative to very positive",
      "Highlights the words that drove the score",
      "Handles negation and intensifiers",
      "Runs instantly in the browser"
    ]
  }
];

export default function ExploreSection() {
  const [activeModalItem, setActiveModalItem] = useState<ExploreItem | null>(null);

  // What a card does when opened: the music card opens the player, the games card opens the Crazy Calculator, and the others show their preview window.
  const openItem = (item: ExploreItem) => {
    if (item.id === "music-player") setIsMusicPlayerOpen(true);
    else if (item.id === "pixel-studio") setIsPixelOpen(true);
    else if (item.id === "games") setIsCalcOpen(true);
    else if (item.id === "ai-assistant" || item.id === "token-lab" || item.id === "mood-reader") setOpenLab(item.id);
    else setActiveModalItem(item);
  };
  const [isMusicPlayerOpen, setIsMusicPlayerOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isPixelOpen, setIsPixelOpen] = useState(false);
  const [openLab, setOpenLab] = useState<"ai-assistant" | "token-lab" | "mood-reader" | null>(null);
  const [mounted, setMounted] = useState(false);

  // Audio simulation state for Music Player modal
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMusicPlayerOpen) setIsMusicPlayerOpen(false);
        if (isPixelOpen) setIsPixelOpen(false);
        if (openLab) setOpenLab(null);
        if (isCalcOpen) setIsCalcOpen(false);
        if (activeModalItem) setActiveModalItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMusicPlayerOpen, isPixelOpen, isCalcOpen, openLab, activeModalItem]);

  // Lock body scroll when in-page music player modal is active
  useEffect(() => {
    if (isMusicPlayerOpen || isPixelOpen || isCalcOpen || openLab) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMusicPlayerOpen, isPixelOpen, isCalcOpen, openLab]);

  return (
    <section id="explore" className="explore-section" aria-label="Explore Projects and Experiments">
      <div className="explore-container">
        {/* Top Header Row */}
        <div className="explore-header">
          {/* Title: EXPLORE SOME CRAZY with sunburst rays */}
          <div className="explore-title-wrap">
            <h2 className="explore-title">EXPLORE SOME CRAZY</h2>
            <div className="explore-sunburst" aria-hidden="true">
              <span className="ray ray-top" />
              <span className="ray ray-mid" />
              <span className="ray ray-bot" />
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="explore-cards-grid">
          {EXPLORE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="explore-card"
              onClick={() => openItem(item)}
            >
              {/* Visual Rounded Card */}
              <div className="explore-card-visual" style={{ backgroundColor: item.cardBg }}>
                <div className="explore-card-image-box">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={640}
                    height={480}
                    className="explore-card-img"
                    priority
                  />
                </div>
                {/* Subtle interactive hover badge */}
                <div className="explore-card-hover-overlay">
                  <button
                    type="button"
                    className="explore-view-tag"
                    onClick={(e) => {
                      e.stopPropagation();
                      openItem(item);
                    }}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {/* Card Title & Subtitle */}
              <div className="explore-card-info">
                <h3 className="explore-card-title">{item.title}</h3>
                <div className="explore-card-sub-wrap">
                  <span className="explore-sub-dash" />
                  <span className="explore-card-subtitle">{item.subtitle}</span>
                  <span className="explore-sub-dash" />
                </div>
                <button
                  type="button"
                  className="explore-preview-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openItem(item);
                  }}
                >
                  <span>Preview</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Detail Modal (Portalled to document.body) */}
      {mounted && activeModalItem && createPortal(
        <div
          className="explore-modal-backdrop"
          onClick={() => {
            setActiveModalItem(null);
            setIsPlaying(false);
          }}
        >
          <div className="explore-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="explore-modal-close"
              onClick={() => {
                setActiveModalItem(null);
                setIsPlaying(false);
                  }}
              aria-label="Close modal"
            >
              <X size={20} strokeWidth={2.4} />
            </button>

            {/* Modal Header Graphic */}
            <div className="explore-modal-hero" style={{ backgroundColor: activeModalItem.cardBg }}>
              <div className="explore-modal-image-wrap">
                <Image
                  src={activeModalItem.image}
                  alt={activeModalItem.title}
                  width={600}
                  height={420}
                  className="explore-modal-img"
                />
              </div>
              <div className="explore-modal-badge-row">
                <span className="explore-modal-badge">{activeModalItem.categoryLabel}</span>
                <span className="explore-modal-badge explore-modal-badge-count">{activeModalItem.countBadge}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="explore-modal-body">
              <div className="explore-modal-title-row">
                <h3 className="explore-modal-title">{activeModalItem.title}</h3>
                <span className="explore-modal-sub">{activeModalItem.subtitle}</span>
              </div>

              <p className="explore-modal-desc">{activeModalItem.description}</p>

              {/* Interactive Widget depending on Item */}
              {activeModalItem.id === "music-player" && (
                <div className="explore-widget-card">
                  <div className="explore-widget-header">
                    <Disc3 size={18} className={isPlaying ? "spin-turntable" : ""} />
                    <span>Live Apple Music Streaming Experience</span>
                  </div>
                  <div style={{ marginTop: "1.2rem", display: "flex", justifyContent: "center" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModalItem(null);
                        setIsMusicPlayerOpen(true);
                      }}
                      className="explore-play-btn"
                      style={{ border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <Sparkles size={16} />
                      <span>Launch MusicWave Player Preview</span>
                    </button>
                  </div>
                </div>
              )}

              {activeModalItem.id === "games" && (
                <div className="explore-widget-card">
                  <div className="explore-widget-header">
                    <Gamepad2 size={18} />
                    <span>Arcade & Canvas Controller Hub</span>
                  </div>
                  <div className="explore-arcade-grid">
                    <div className="arcade-stat-box">
                      <span className="stat-label">Frame Rate</span>
                      <span className="stat-val">60 FPS</span>
                    </div>
                    <div className="arcade-stat-box">
                      <span className="stat-label">Audio Engine</span>
                      <span className="stat-val">8-Bit Synth</span>
                    </div>
                    <div className="arcade-stat-box">
                      <span className="stat-label">Controllers</span>
                      <span className="stat-val">Gamepad / Touch</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Feature Highlights */}
              <div className="explore-modal-features">
                <h4 className="features-title">Core Engineering Highlights</h4>
                <ul className="features-list">
                  {activeModalItem.features.map((feat, idx) => (
                    <li key={idx} className="feature-item">
                      <span className="feature-dot" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="explore-modal-tags">
                {activeModalItem.tags.map((tag) => (
                  <span key={tag} className="explore-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Crazy Calculator window */}
      {mounted && isCalcOpen && createPortal(
        <div className="dl-overlay" onClick={() => setIsCalcOpen(false)}>
          <CrazyCalculator onClose={() => setIsCalcOpen(false)} />
        </div>,
        document.body
      )}

      {/* Pixel Studio window (portalled to document.body) */}
      {mounted && isPixelOpen && createPortal(
        <div className="dl-overlay" onClick={() => setIsPixelOpen(false)}>
          <PixelStudio onClose={() => setIsPixelOpen(false)} />
        </div>,
        document.body
      )}

      {/* AI labs: Ask Kalyan, Token Lab and Mood Reader */}
      {mounted && openLab && createPortal(
        <div className="dl-overlay" onClick={() => setOpenLab(null)}>
          {openLab === "ai-assistant" && <AiAssistant onClose={() => setOpenLab(null)} />}
          {openLab === "token-lab" && <TokenLab onClose={() => setOpenLab(null)} />}
          {openLab === "mood-reader" && <MoodReader onClose={() => setOpenLab(null)} />}
        </div>,
        document.body
      )}

      {/* MusicWave In-Page Full Player Preview Directly on Current Page (Portalled to document.body) */}
      {mounted && isMusicPlayerOpen && createPortal(
        <div
          className="musicwave-inpage-overlay"
          onClick={() => setIsMusicPlayerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="MusicWave Player Preview"
        >
          <div className="musicwave-inpage-dialog" onClick={(e) => e.stopPropagation()}>
            <MusicWavePlayer isModal={true} onClose={() => setIsMusicPlayerOpen(false)} />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
