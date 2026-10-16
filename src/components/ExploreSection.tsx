"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Play, Pause, Sparkles, Gamepad2, Disc3 } from "lucide-react";
import MusicWavePlayer from "@/components/MusicWavePlayer";
import MediaDownloader from "@/components/MediaDownloader";

interface ExploreItem {
  id: string;
  category: "music" | "videos" | "games";
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

// Where the Games card sends visitors.
const GAMES_URL = "https://quiz.bato.dev/";

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
    id: "youtube-downloader",
    category: "videos",
    categoryLabel: "VIDEOS",
    countBadge: "02+",
    pillBg: "#fdb5cc",
    pillColor: "#2a170f",
    cardBg: "#fca7c2",
    title: "MEDIA DOWNLOADER",
    subtitle: "VIDEO & AUDIO",
    image: "/explore/youtube-downloader.jpg",
    description: "Paste a link to a file you own, or an Internet Archive or Wikimedia Commons page, and download its audio and video in the formats and qualities the source really offers, with live progress and clear errors.",
    tags: ["Next.js API", "Streaming proxy", "SSRF protection", "TypeScript"],
    features: [
      "Reads titles, thumbnails, durations and formats from each source's own API",
      "Real download progress measured from the streamed bytes",
      "Server-side checks: https only, no private networks, audio and video only, size limit",
      "YouTube and streaming platforms are refused, so only authorized content is downloaded"
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
    subtitle: "PLAY",
    image: "/explore/games.jpg",
    description: "Curated collection of retro arcade browser games and WebGL experiments including pixel platformers, 3D micro-racers, and nostalgic 8-bit adventures.",
    tags: ["WebGL", "PixiJS", "Game Loop", "Audio FX"],
    features: [
      "60 FPS hardware-accelerated canvas rendering",
      "Full gamepad & DualSense controller support",
      "Global leaderboard with anti-cheat state validation",
      "Responsive touch controls for mobile devices"
    ]
  }
];

export default function ExploreSection() {
  const [activeModalItem, setActiveModalItem] = useState<ExploreItem | null>(null);

  // What a card does when opened: the music card opens the player, the games card goes to the quiz site
  // (in a new tab, so the portfolio stays open), and the others show their preview window.
  const openItem = (item: ExploreItem) => {
    if (item.id === "music-player") setIsMusicPlayerOpen(true);
    else if (item.id === "youtube-downloader") setIsDownloaderOpen(true);
    else if (item.id === "games") window.open(GAMES_URL, "_blank", "noopener,noreferrer");
    else setActiveModalItem(item);
  };
  const [isMusicPlayerOpen, setIsMusicPlayerOpen] = useState(false);
  // The Media Downloader also opens straight from a link such as https://your-site/?open=media-downloader
  // (the "Open in main website" button of the standalone downloader uses it).
  const [isDownloaderOpen, setIsDownloaderOpen] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("open") === "media-downloader",
  );
  const [mounted, setMounted] = useState(false);

  // Once the downloader is closed, drop "?open=media-downloader" from the address so a refresh doesn't reopen it.
  useEffect(() => {
    if (isDownloaderOpen) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("open") !== "media-downloader") return;
    params.delete("open");
    const query = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (query ? "?" + query : "") + window.location.hash);
  }, [isDownloaderOpen]);

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
        if (isDownloaderOpen) setIsDownloaderOpen(false);
        if (activeModalItem) setActiveModalItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMusicPlayerOpen, isDownloaderOpen, activeModalItem]);

  // Lock body scroll when in-page music player modal is active
  useEffect(() => {
    if (isMusicPlayerOpen || isDownloaderOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMusicPlayerOpen, isDownloaderOpen]);

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

      {/* MusicWave-style Video Downloader window (portalled to document.body) */}
      {mounted && isDownloaderOpen && createPortal(
        <div className="dl-overlay" onClick={() => setIsDownloaderOpen(false)}>
          <MediaDownloader onClose={() => setIsDownloaderOpen(false)} />
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
