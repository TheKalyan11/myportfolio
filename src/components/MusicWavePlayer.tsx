"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Pause,
  Shuffle,
  Search,
  Heart,
  Home,
  Music2,
  TrendingUp,
  Menu,
  FileText,
  Minus,
  Maximize2,
  Minimize2,
  X,
  ArrowLeft,
  Globe,
  Clock,
  Sparkles,
  Radio
} from "lucide-react";
import type { MusicTrack } from "@/app/api/music/search/route";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { EMAIL } from "@/data/contact";

const TOP_ARTISTS = [
  {
    name: "The Weeknd",
    query: "The Weeknd",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/83/3a/f7/833af71b-2e0c-3303-24f5-8f5c546c073b/20UMGIM21167.rgb.jpg/600x600bb.jpg",
    genre: "R&B / Pop"
  },
  {
    name: "Tyler, The Creator",
    query: "Tyler The Creator",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/de/e1/8b/dee18be4-276a-1e90-7aec-883c91a5a43e/17UM1IM08185.rgb.jpg/600x600bb.jpg",
    genre: "Hip-Hop"
  },
  {
    name: "21 Savage",
    query: "21 Savage",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/77/84/5e/77845ee7-573c-efcc-4ce4-c9625fdce8c7/196871714556.jpg/600x600bb.jpg",
    genre: "Rap"
  },
  {
    name: "Travis Scott",
    query: "Travis Scott",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e7/49/8f/e7498f65-df8f-bead-d6e3-2a8d4d642a79/886447235317.jpg/600x600bb.jpg",
    genre: "Hip-Hop"
  },
  {
    name: "Øneheart",
    query: "Oneheart",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c3/3d/f1/c33df11e-1244-3f80-672c-9b7f88010f17/1963620475841_cover.jpg/600x600bb.jpg",
    genre: "Lo-Fi"
  },
  {
    name: "SZA",
    query: "SZA",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/0d/b3/7a/0db37a96-d4c5-b5f3-5851-3e9fae7b5e96/23UMGIM01901.rgb.jpg/600x600bb.jpg",
    genre: "R&B"
  },
  {
    name: "Harry Styles",
    query: "Harry Styles",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/4b/5e/1e/4b5e1e2f-2a9e-0d60-4cc9-09c64bef7e4b/886449767380.jpg/600x600bb.jpg",
    genre: "Pop"
  },
  {
    name: "Kendrick Lamar",
    query: "Kendrick Lamar",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/fb/36/65/fb3665b2-c14a-73c0-0660-f76b04fcc67a/23UMGIM16827.rgb.jpg/600x600bb.jpg",
    genre: "Hip-Hop"
  }
];

const LANGUAGE_PLAYLISTS = [
  { label: "Hindi",      query: "hindi bollywood hits 2024",       emoji: "🇮🇳", color: "rgba(232,244,253,0.55)", accent: "#1a7abf" },
  { label: "English",   query: "english pop hits 2024",           emoji: "🌍", color: "rgba(232,240,254,0.55)", accent: "#2d6ae0" },
  { label: "Telugu",    query: "telugu hits songs",               emoji: "🎵", color: "rgba(230,244,234,0.55)", accent: "#1e7e34" },
  { label: "Tamil",     query: "tamil hits songs",                emoji: "🎶", color: "rgba(252,232,230,0.55)", accent: "#d33b2c" },
  { label: "Kannada",   query: "kannada hits songs",              emoji: "🎸", color: "rgba(254,243,226,0.55)", accent: "#c87c01" },
  { label: "Malayalam", query: "malayalam hits songs",            emoji: "🌺", color: "rgba(243,232,253,0.55)", accent: "#7b2fb5" },
  { label: "Bengali",   query: "bengali hits songs",              emoji: "🌸", color: "rgba(252,228,236,0.55)", accent: "#c2185b" },
  { label: "Punjabi",   query: "punjabi hits bhangra",            emoji: "🥁", color: "rgba(232,245,233,0.55)", accent: "#2e7d32" },
  { label: "K-Pop",     query: "kpop hits bts blackpink",         emoji: "🇰🇷", color: "rgba(225,245,254,0.55)", accent: "#0277bd" },
  { label: "Spanish",   query: "spanish latin reggaeton hits",    emoji: "💃", color: "rgba(255,243,224,0.55)", accent: "#e65100" },
  { label: "Japanese",  query: "japanese jpop anime songs",       emoji: "🗾", color: "rgba(252,228,236,0.55)", accent: "#ad1457" },
  { label: "Arabic",    query: "arabic pop hits",                 emoji: "🌙", color: "rgba(232,234,246,0.55)", accent: "#3949ab" },
  { label: "French",    query: "french pop chanson hits",         emoji: "🇫🇷", color: "rgba(232,234,250,0.55)", accent: "#1565c0" },
  { label: "Portuguese",query: "portuguese fado samba hits",      emoji: "🇧🇷", color: "rgba(230,244,234,0.55)", accent: "#2e7d32" },
  { label: "Russian",   query: "russian pop hits songs",          emoji: "🇷🇺", color: "rgba(252,228,230,0.55)", accent: "#c62828" },
  { label: "Turkish",   query: "turkish pop hits songs",          emoji: "🇹🇷", color: "rgba(255,235,238,0.55)", accent: "#b71c1c" },
  { label: "Italian",   query: "italian pop opera hits",          emoji: "🇮🇹", color: "rgba(232,245,233,0.55)", accent: "#1b5e20" },
  { label: "German",    query: "german pop schlager hits",        emoji: "🇩🇪", color: "rgba(255,248,225,0.55)", accent: "#f57f17" },
  { label: "Indonesian",query: "indonesian dangdut pop hits",     emoji: "🇮🇩", color: "rgba(243,232,253,0.55)", accent: "#6a1b9a" },
  { label: "Nigerian",  query: "afrobeats naija pop hits",        emoji: "🎷", color: "rgba(255,243,224,0.55)", accent: "#e65100" },
  { label: "Swahili",   query: "bongo flava swahili hits",        emoji: "🌍", color: "rgba(230,244,234,0.55)", accent: "#33691e" },
  { label: "Marathi",   query: "marathi lavani hits songs",       emoji: "🎪", color: "rgba(252,228,236,0.55)", accent: "#880e4f" },
  { label: "Gujarati",  query: "gujarati garba dandiya hits",     emoji: "🪅", color: "rgba(255,243,224,0.55)", accent: "#bf360c" },
  { label: "Bhojpuri",  query: "bhojpuri hits songs",             emoji: "🎤", color: "rgba(232,244,253,0.55)", accent: "#01579b" }
];

const SONG_GENRES = [
  { label: "All Songs", query: "all" },
  { label: "Hip-Hop", query: "hip hop hits" },
  { label: "Pop Hits", query: "pop hits 2024" },
  { label: "R&B / Soul", query: "r&b soul hits" },
  { label: "Electronic", query: "electronic dance" },
  { label: "Rock", query: "rock classics" },
  { label: "Lo-Fi Chill", query: "lofi chill beats" }
];

interface MusicWavePlayerProps {
  onClose?: () => void;
  isModal?: boolean;
}

const POLL_KEY = "musicwave-poll-version";
const POLL_QUESTION = "Which version do you need?";
const POLL_OPTIONS = [
  {
    label: "Full Website",
    detail: "A complete, fully functional website optimized for desktop and mobile browsers.",
  },
  {
    label: "Mobile Version Only",
    detail: "A mobile-friendly version of the website for smartphone users.",
  },
  {
    label: "Both",
    detail: "A complete website and a dedicated mobile application for Android and iOS.",
  },
] as const;

/**
 * A one-question poll. The answer is kept in this browser, and voting also opens the visitor's email app with the
 * answer addressed to the site owner (there is no server to collect votes), so it is delivered when they press send.
 */
const mailVote = (answer: string) => {
  const subject = `MusicWave poll: ${answer}`;
  const body = `${POLL_QUESTION}\n\nMy answer: ${answer}`;
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

function PlatformPoll() {
  const [saved, setSaved] = useState<string>(() => {
    try {
      return typeof window === "undefined" ? "" : (window.localStorage.getItem(POLL_KEY) ?? "");
    } catch {
      return "";
    }
  });
  const [choice, setChoice] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);

  const submit = () => {
    if (!choice) return;
    try {
      window.localStorage.setItem(POLL_KEY, choice);
    } catch {
      // storage can be blocked; the answer still shows for this visit
    }
    setSaved(choice);
    setEditing(false);
    mailVote(choice);
  };

  const voted = saved !== "" && !editing;

  return (
    <article className="mw-note-card mw-poll" aria-labelledby="mw-poll-q">
      <h2 id="mw-poll-q" className="mw-note-title">
        {POLL_QUESTION}
      </h2>
      <p className="mw-note-text">Please choose one option:</p>

      {voted ? (
        <div className="mw-poll-done" role="status">
          <p>
            Thanks for voting! You chose <strong>{saved}</strong>.
          </p>
          <div className="mw-poll-actions">
            <button type="button" className="mw-poll-change" onClick={() => mailVote(saved)}>
              Send by email
            </button>
            <button
              type="button"
              className="mw-poll-change"
              onClick={() => {
                setChoice(saved);
                setEditing(true);
              }}
            >
              Change answer
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mw-poll-options" role="radiogroup" aria-labelledby="mw-poll-q">
            {POLL_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                type="button"
                role="radio"
                aria-checked={choice === opt.label}
                className={`mw-poll-option ${choice === opt.label ? "selected" : ""}`}
                onClick={() => setChoice(opt.label)}
              >
                <span className="mw-poll-dot" aria-hidden />
                <span className="mw-poll-copy">
                  <strong>{opt.label}</strong>
                  <span>{opt.detail}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="mw-note-text">
            Select the option that best fits your needs so we can plan the right features and development approach.
          </p>
          <button type="button" className="mw-poll-vote" onClick={submit} disabled={!choice}>
            Vote
          </button>
          <p className="mw-poll-note">Voting opens your email app with your answer ready to send. Press send there to deliver it.</p>
        </>
      )}
    </article>
  );
}

export default function MusicWavePlayer({ onClose, isModal = false }: MusicWavePlayerProps) {
  // The audio, the song list and the playing queue live in the site-wide player (MusicPlayerContext),
  // so music keeps playing when this window is closed or the page changes.
  const player = useMusicPlayer();
  const { tracks, isLoading, fetchTracks, currentTrack, isPlaying, hasQueue, toastMessage, showToast, registerView, ensureTracks } = player;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<"browse" | "songs" | "artists" | "favorites" | "notes">("browse");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"trending" | "new" | "shuffle">("trending");
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Minimize: the pop-up closes, or on the full page the window folds away. Either way the song keeps playing
  // and the fixed mini-player stays at the bottom.
  const minimize = () => {
    player.pin(); // the controls stay on screen, with or without a song chosen yet
    if (onClose) onClose();
    else setIsMinimized(true);
  };

  // Cover art for the Top Artists row, looked up from the music library so each portrait is a real, loading image.
  const [artistImages, setArtistImages] = useState<Record<string, string>>({});
  const artistImagesRequested = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // While this window is open the mini-player is shown, and the first song list is loaded.
  useEffect(() => registerView(), [registerView]);
  useEffect(() => {
    ensureTracks();
  }, [ensureTracks]);

  const playTrackAtIndex = (index: number) => player.playFromList(tracks, index);

  // the songs after the current one (before anything is playing, the list after the first song)
  const upNextBase = hasQueue ? player.queue : tracks;
  const upNextStart = hasQueue ? player.queueIndex + 1 : 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      if (val.trim()) {
        fetchTracks(val);
        setActiveNav("browse");
      } else {
        fetchTracks(activeNav === "songs" ? selectedGenre : "all");
      }
    }, 380);
  };

  useEffect(() => {
    if (activeNav !== "artists" || artistImagesRequested.current) return;
    artistImagesRequested.current = true;
    const simple = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");
    TOP_ARTISTS.forEach(async (a) => {
      try {
        const res = await fetch(`/api/music/search?q=${encodeURIComponent(a.query)}`);
        const data = await res.json();
        const results: MusicTrack[] = data.results ?? [];
        const key = simple(a.query).slice(0, 5);
        // the cover that appears most often among this artist's songs is their main album
        const counts = new Map<string, number>();
        for (const t of results) {
          if (t.artwork && simple(t.artist).includes(key)) counts.set(t.artwork, (counts.get(t.artwork) ?? 0) + 1);
        }
        const best = [...counts.entries()].sort((x, y) => y[1] - x[1])[0]?.[0];
        if (best) setArtistImages((prev) => ({ ...prev, [a.name]: best }));
      } catch {
        // keep the built-in picture if the lookup fails
      }
    });
  }, [activeNav]);

  const clearSearch = () => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setSearchQuery("");
    fetchTracks(activeNav === "songs" ? selectedGenre : "all");
  };

  // Enter searches at once (without waiting for the typing pause); Escape clears the box.
  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (searchQuery.trim()) {
        fetchTracks(searchQuery);
        setActiveNav("browse");
      }
    } else if (e.key === "Escape") {
      clearSearch();
      e.currentTarget.blur();
    }
  };

  // Pressing "/" anywhere in the player jumps to the search box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast("Removed from favorites");
      } else {
        next.add(id);
        showToast("Added to favorites ❤️");
      }
      return next;
    });
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Shared track list renderer
  const renderTrackList = (trackList: MusicTrack[]) => (
    <div className="mw-tracks-list">
      {trackList.map((track, idx) => {
        const isCurrent = !!currentTrack && track.id === currentTrack.id && track.title === currentTrack.title;
        const trackIdx = tracks.findIndex(t => t.id === track.id && t.title === track.title);
        const isFav = favorites.has(track.id);
        return (
          <div
            key={track.id + idx}
            className={`mw-track-row ${isCurrent ? "playing" : ""}`}
            onClick={() => {
              if (trackIdx !== -1) {
                playTrackAtIndex(trackIdx);
              } else {
                playTrackAtIndex(idx);
              }
            }}
          >
            <div className="mw-track-left">
              <span className="mw-track-num">{idx + 1}</span>
              <div className="mw-track-thumb-wrap">
                <Image
                  src={track.artwork || "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/83/3a/f7/833af71b-2e0c-3303-24f5-8f5c546c073b/20UMGIM21167.rgb.jpg/600x600bb.jpg"}
                  alt={track.title}
                  width={44}
                  height={44}
                  className="mw-track-thumb"
                  unoptimized
                />
                <div className="mw-track-play-overlay">
                  {isCurrent && isPlaying ? (
                    <Pause size={15} fill="currentColor" />
                  ) : (
                    <Play size={15} fill="currentColor" />
                  )}
                </div>
              </div>
              <div className="mw-track-info">
                <span className="mw-track-title">{track.title}</span>
                <span className="mw-track-artist">{track.artist}</span>
              </div>
            </div>
            <div className="mw-track-album">{track.album}</div>
            <div className="mw-track-right">
              <span className="mw-track-dur">{formatTime(track.duration)}</span>
              <button
                type="button"
                className={`mw-fav-btn ${isFav ? "liked" : ""}`}
                onClick={(e) => toggleFavorite(track.id, e)}
                title={isFav ? "Unlike" : "Like"}
              >
                <Heart size={15} fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (isMinimized) {
    return (
      <div className="mw-container">
        <div className="mw-minimized">
          <Radio size={22} />
          <h2>MusicWave is minimized</h2>
          <p>Your music keeps playing in the player at the bottom of the screen.</p>
          <button type="button" className="mw-restore-btn" onClick={() => setIsMinimized(false)}>
            <Maximize2 size={14} />
            Open MusicWave
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`mw-container ${isModal ? "mw-modal-mode" : ""} ${isMaximized ? "mw-max" : ""}`}>
      {/* Toast */}
      {toastMessage && (
        <div className="mw-toast">{toastMessage}</div>
      )}

      {/* Window Frame */}
      <div className="mw-window">
        {/* Top Bar */}
        <div className="mw-topbar">
          <div className="mw-window-actions">
            <button
              type="button"
              className="mw-win-btn"
              onClick={minimize}
              aria-label="Minimize"
              title="Minimize (the music keeps playing in the mini-player)"
            >
              <Minus size={14} />
            </button>
            <button
              type="button"
              className="mw-win-btn"
              onClick={() => setIsMaximized((m) => !m)}
              aria-label={isMaximized ? "Restore size" : "Maximize"}
              aria-pressed={isMaximized}
              title={isMaximized ? "Restore size" : "Maximize"}
            >
              {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          </div>

          {/* Search bar: sits at the top of the cream panel */}
          <div className={`mw-search-wrap ${searchFocused ? "focused" : ""}`}>
            <Search size={15} className="mw-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="mw-search-input"
              placeholder="Search songs, artists…"
              aria-label="Search songs"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKey}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchQuery ? (
              <button
                type="button"
                className="mw-search-clear"
                aria-label="Clear search"
                onClick={() => {
                  clearSearch();
                  searchInputRef.current?.focus();
                }}
              >
                <X size={13} />
              </button>
            ) : (
              <kbd className="mw-search-kbd" aria-hidden>/</kbd>
            )}
          </div>

          <div className="mw-topbar-right">
            {onClose ? (
              <button type="button" onClick={onClose} className="mw-close-btn" aria-label="Close Preview">
                <X size={14} />
                <span>Close</span>
              </button>
            ) : (
              <Link href="/#explore" className="mw-back-link">
                <ArrowLeft size={13} />
                <span>Portfolio</span>
              </Link>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="mw-body">
          {/* Mobile menu button */}
          <button
            type="button"
            className="mw-mobile-menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Menu"
          >
            {sidebarOpen ? <X size={19} /> : <Menu size={19} />}
          </button>

          {/* Sidebar */}
          <aside className={`mw-sidebar ${sidebarOpen ? "open" : ""}`}>
            {/* Brand */}
            <div className="mw-brand">
              <div className="mw-brand-icon">
                <Radio size={18} />
              </div>
              <span className="mw-brand-name">MusicWave</span>
            </div>

            {/* Nav */}
            <nav className="mw-nav">
              <span className="mw-nav-heading">Library</span>
              <ul className="mw-nav-list">
                <li>
                  <button
                    type="button"
                    className={`mw-nav-item ${activeNav === "browse" ? "active" : ""}`}
                    onClick={() => {
                      setActiveNav("browse");
                      setSearchQuery("");
                      fetchTracks("all");
                      setSidebarOpen(false);
                    }}
                  >
                    <Home size={16} />
                    <span>Browse</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`mw-nav-item ${activeNav === "songs" ? "active" : ""}`}
                    onClick={() => {
                      setActiveNav("songs");
                      setSelectedGenre("all");
                      setSearchQuery("");
                      fetchTracks("all");
                      setSidebarOpen(false);
                    }}
                  >
                    <Music2 size={16} />
                    <span>Songs</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`mw-nav-item ${activeNav === "artists" ? "active" : ""}`}
                    onClick={() => {
                      setActiveNav("artists");
                      setSidebarOpen(false);
                    }}
                  >
                    <Globe size={16} />
                    <span>Explore Language</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`mw-nav-item ${activeNav === "favorites" ? "active" : ""}`}
                    onClick={() => {
                      setActiveNav("favorites");
                      setSidebarOpen(false);
                    }}
                  >
                    <Heart size={16} />
                    <span>Favorites</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`mw-nav-item ${activeNav === "notes" ? "active" : ""}`}
                    onClick={() => {
                      setActiveNav("notes");
                      setSidebarOpen(false);
                    }}
                  >
                    <FileText size={16} />
                    <span>Notes</span>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Live indicator */}
            <div className="mw-live-status">
              <span className="mw-live-dot" />
              <span>MusicWave Live • Free Streaming</span>
            </div>
            <div className="mw-side-note">
              <p>
                😂 <strong>Warning: Crazy Features Ahead!</strong>
              </p>
              <p>This website is already crazy enough! More madness is coming soon. 🤪❤️</p>
              <p>
                <strong>Crafted with ❤️ by Kalyan — professionally unserious since day one!</strong> 😂
              </p>
            </div>
          </aside>

          {/* Main Content */}
          <main className="mw-main">

            {/* ── TOP ARTISTS VIEW ── */}
            {activeNav === "artists" && (
              <div className="mw-section">
                {/* Explore by Language: a plain text heading, languages first */}
                <div className="mw-section-header">
                  <div>
                    <h2 className="mw-section-title">Explore by Language</h2>
                    <p className="mw-section-sub">Tap a language to stream its top songs</p>
                  </div>
                </div>
                <div className="mw-lang-grid">
                  {LANGUAGE_PLAYLISTS.map((lang) => (
                    <button
                      key={lang.label}
                      type="button"
                      className={`mw-lang-card ${activeLanguage === lang.label ? "active" : ""}`}
                      style={{
                        "--lang-bg": lang.color,
                        "--lang-accent": lang.accent
                      } as React.CSSProperties}
                      onClick={() => {
                        setActiveLanguage(lang.label);
                        setSearchQuery("");
                        setActiveNav("browse"); // show the loaded songs
                        fetchTracks(lang.query);
                        showToast(`Loading ${lang.label} songs...`);
                      }}
                    >
                      <span className="mw-lang-label">{lang.label}</span>
                    </button>
                  ))}
                </div>

                {/* Top Artists below */}
                <div className="mw-section-header" style={{ marginTop: "1.2rem" }}>
                  <div>
                    <h2 className="mw-section-title">Top Artists</h2>
                    <p className="mw-section-sub">Click an artist to stream their songs</p>
                  </div>
                  <span className="mw-badge">{TOP_ARTISTS.length} Artists</span>
                </div>
                <div className="mw-artists-grid">
                  {TOP_ARTISTS.map((artist) => (
                    <div
                      key={artist.name}
                      className="mw-artist-card"
                      onClick={() => {
                        setSearchQuery(artist.name);
                        setActiveNav("browse");
                        fetchTracks(artist.query);
                      }}
                    >
                      <div className="mw-artist-img-wrap">
                        <Image
                          src={artistImages[artist.name] ?? artist.image}
                          alt={artist.name}
                          width={140}
                          height={140}
                          className="mw-artist-img"
                          unoptimized
                        />
                        <div className="mw-artist-play-overlay">
                          <Play size={22} fill="white" />
                        </div>
                      </div>
                      <span className="mw-artist-name">{artist.name}</span>
                      <span className="mw-artist-genre">{artist.genre}</span>
                    </div>
                  ))}
                </div>
                <p className="mw-app-note">
                  <Sparkles size={14} />
                  <span>Many more artists and albums are available only in the application.</span>
                </p>
              </div>
            )}

            {/* ── FAVORITES VIEW ── */}
            {activeNav === "favorites" && (
              <div className="mw-favorites-page">
                <div className="mw-favorites-gif">
                  <iframe
                    src="https://giphy.com/embed/Fn0ysbG90HX0uj5shv"
                    title="Funny dog GIF"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    allowFullScreen
                  />
                </div>
                <a
                  className="mw-favorites-gif-credit"
                  href="https://giphy.com/gifs/dogs-of-instagram-lunch-tre-viral-dog-Fn0ysbG90HX0uj5shv"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  via GIPHY
                </a>
                <h2 className="mw-favorites-title">Favorites — Coming Soon</h2>
                <p className="mw-favorites-subtitle">Currently under testing</p>
                <p className="mw-favorites-desc">
                  The Favorites feature is currently under development and will soon be available on the MusicWave
                  web version. Stay tuned for updates as we work to bring you the ability to save your favorite songs
                  and access them easily.
                </p>
                <p className="mw-favorites-thanks">Thank you</p>
              </div>
            )}

            {/* ── NOTES VIEW ── */}
            {activeNav === "notes" && (
              <div className="mw-section mw-notes">
                <div className="mw-notes-gif-wrap">
                  <div className="mw-notes-gif">
                    <iframe
                      src="https://giphy.com/embed/xdLH51eNWZAHrwy5mf"
                      title="Kermit the Frog GIF"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      allowFullScreen
                    />
                  </div>
                  <a
                    className="mw-favorites-gif-credit"
                    href="https://giphy.com/gifs/muppetwiki-muppets-kermit-the-frog-xdLH51eNWZAHrwy5mf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    via GIPHY
                  </a>
                </div>
                <article className="mw-note-card">
                  <h2 className="mw-note-title">Important Notice</h2>
                  <p className="mw-note-text">
                    All songs are available on the MusicWave web version. Use the search box to find songs by title,
                    language, or artist name and stream your favorite music directly on the website.
                  </p>
                  <ul className="mw-note-list">
                    <li><strong>Search Music:</strong> Find songs by title, language, or artist name.</li>
                    <li><strong>Online Streaming:</strong> Play available songs directly on the website.</li>
                    <li><strong>Explore Languages:</strong> Discover music from different languages and explore available playlists.</li>
                    <li><strong>Music Controls:</strong> Enjoy play, pause, next, previous, and volume controls.</li>
                    <li><strong>Favorites — Coming Soon:</strong> The Favorites feature will be available on the web soon. You&apos;ll be able to save your favorite songs and access them easily.</li>
                    <li><strong>Other Features:</strong> Advanced search options, detailed artist information, personalized playlists, and listening history may be introduced in future updates.</li>
                  </ul>
                </article>

                <article className="mw-note-card">
                  <h2 className="mw-note-title">Mobile App Coming Soon</h2>
                  <p className="mw-note-text">
                    The MusicWave mobile app is currently under development and is planned to launch on Android through
                    M-Droid as soon as possible.
                  </p>
                  <ul className="mw-note-list">
                    <li><strong>Current Status:</strong> The app is still in development and is not yet available for download.</li>
                    <li><strong>Platform Support:</strong> The initial release is planned for Android only. iOS support is not currently available.</li>
                    <li><strong>Future Updates:</strong> More features and improvements will be announced as development progresses.</li>
                  </ul>
                </article>

                <PlatformPoll />

                <p className="mw-note-thanks">
                  Thank you for supporting MusicWave. Stay tuned for updates and the official launch! 🎵❤️
                </p>
                <p className="mw-note-tagline">MusicWave — Your music, your vibe.</p>
              </div>
            )}

            {/* ── SONGS VIEW ── */}
            {activeNav === "songs" && (
              <div className="mw-section">
                <div className="mw-section-header">
                  <div>
                    <h2 className="mw-section-title">All Songs</h2>
                    <p className="mw-section-sub">Complete streaming library</p>
                  </div>
                  <span className="mw-badge">{tracks.length} songs</span>
                </div>

                {/* Genre Pills */}
                <div className="mw-genre-pills">
                  {SONG_GENRES.map((g) => (
                    <button
                      key={g.label}
                      type="button"
                      className={`mw-genre-pill ${selectedGenre === g.query ? "active" : ""}`}
                      onClick={() => {
                        setSelectedGenre(g.query);
                        setSearchQuery("");
                        fetchTracks(g.query);
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>

                {isLoading ? (
                  <div className="mw-loading">
                    <div className="mw-spinner" />
                    <span>Loading tracks...</span>
                  </div>
                ) : tracks.length === 0 ? (
                  <div className="mw-empty">
                    <Music2 size={32} strokeWidth={1.5} />
                    <p>No tracks found. Try a different genre.</p>
                  </div>
                ) : renderTrackList(tracks)}
              </div>
            )}

            {/* ── EXPLORE BY LANGUAGE (shown in Songs view too) ── */}
            {activeNav === "songs" && (
              <div className="mw-section">
                <div className="mw-section-header">
                  <div>
                    <h2 className="mw-section-title">
                      <Globe size={17} style={{ display: "inline", marginRight: "0.4rem", verticalAlign: "middle" }} />
                      Explore by Language
                    </h2>
                    <p className="mw-section-sub">Tap any language to load its top songs</p>
                  </div>
                </div>
                <div className="mw-lang-grid">
                  {LANGUAGE_PLAYLISTS.map((lang) => (
                    <button
                      key={lang.label}
                      type="button"
                      className={`mw-lang-card ${activeLanguage === lang.label ? "active" : ""}`}
                      style={{
                        "--lang-bg": lang.color,
                        "--lang-accent": lang.accent
                      } as React.CSSProperties}
                      onClick={() => {
                        setActiveLanguage(lang.label);
                        fetchTracks(lang.query);
                        showToast(`Loading ${lang.label} songs...`);
                      }}
                    >
                      <span className="mw-lang-label">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── BROWSE VIEW ── */}
            {activeNav === "browse" && (
              <>
                {/* If search is active */}
                {searchQuery ? (
                  <div className="mw-section">
                    <div className="mw-section-header">
                      <div>
                        <h2 className="mw-section-title">Search Results</h2>
                        <p className="mw-section-sub">Results for &ldquo;{searchQuery}&rdquo;</p>
                      </div>
                      <span className="mw-badge">{tracks.length} tracks</span>
                    </div>
                    {isLoading ? (
                      <div className="mw-loading">
                        <div className="mw-spinner" />
                        <span>Searching...</span>
                      </div>
                    ) : tracks.length === 0 ? (
                      <div className="mw-empty">
                        <Search size={32} strokeWidth={1.5} />
                        <p>No results found. Try a different search.</p>
                      </div>
                    ) : renderTrackList(tracks)}
                  </div>
                ) : (
                  <>
                    {/* Quick tabs */}
                    <div className="mw-browse-tabs">
                      <button
                        type="button"
                        className={`mw-tab ${activeTab === "trending" ? "active" : ""}`}
                        onClick={() => { setActiveTab("trending"); fetchTracks("trending hits 2024"); }}
                      >
                        <TrendingUp size={14} />
                        Trending
                      </button>
                      <button
                        type="button"
                        className={`mw-tab ${activeTab === "new" ? "active" : ""}`}
                        onClick={() => { setActiveTab("new"); fetchTracks("new releases 2024"); }}
                      >
                        <Clock size={14} />
                        New Releases
                      </button>
                      <button
                        type="button"
                        className={`mw-tab ${activeTab === "shuffle" ? "active" : ""}`}
                        onClick={() => {
                          setActiveTab("shuffle");
                          if (tracks.length > 0) {
                            playTrackAtIndex(Math.floor(Math.random() * tracks.length));
                          }
                        }}
                      >
                        <Shuffle size={14} />
                        Shuffle Play
                      </button>
                    </div>

                    {/* Curated-playlist banner for the current track */}
                    {currentTrack && (
                      <div className="mw-hero">
                        <Image
                          src={currentTrack.artwork}
                          alt=""
                          width={400}
                          height={400}
                          className="mw-hero-art"
                          unoptimized
                          aria-hidden
                        />
                        <div className="mw-hero-text">
                          <span className="mw-hero-kicker">Curated playlist</span>
                          <h2 className="mw-hero-title">{currentTrack.title}</h2>
                          <p className="mw-hero-desc">
                            {currentTrack.artist} · {tracks.length} songs ready to stream.
                          </p>
                          <button type="button" className="mw-hero-play" onClick={player.togglePlay}>
                            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                            {isPlaying ? "Pause" : "Play"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Track list */}
                    <div className="mw-section">
                      <div className="mw-section-header">
                        <div>
                          <h2 className="mw-section-title">
                            {hasQueue ? "Played Music" : "Discover Music"}
                          </h2>
                          <p className="mw-section-sub">
                            {hasQueue ? "Your recent playback" : "Stream from our global library"}
                          </p>
                        </div>
                        <span className="mw-badge">{tracks.length} tracks</span>
                      </div>

                      {isLoading ? (
                        <div className="mw-loading">
                          <div className="mw-spinner" />
                          <span>Loading streams...</span>
                        </div>
                      ) : renderTrackList(tracks)}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Footer Credit */}
            <div className="mw-footer-credit">
              Developed with ❤️ by <strong>Kalyan</strong>
            </div>
          </main>

          {/* Right Panel */}
          <aside className="mw-right-panel">
            <div className="mw-now-playing-card">
              {/* EQ + Label */}
              <div className="mw-np-header">
                <div className="mw-eq-bars" aria-hidden="true">
                  <span className={`mw-eq-bar ${isPlaying ? "bounce" : ""}`} />
                  <span className={`mw-eq-bar ${isPlaying ? "bounce b2" : ""}`} />
                  <span className={`mw-eq-bar ${isPlaying ? "bounce b3" : ""}`} />
                </div>
                <span className="mw-np-label">Now Playing</span>
              </div>

              {/* Cover */}
              <div className="mw-np-cover-wrap">
                <Image
                  src={currentTrack?.artwork || "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/83/3a/f7/833af71b-2e0c-3303-24f5-8f5c546c073b/20UMGIM21167.rgb.jpg/600x600bb.jpg"}
                  alt={currentTrack?.title || "Album Art"}
                  width={280}
                  height={280}
                  className="mw-np-cover"
                  priority
                  unoptimized
                />
              </div>

              {/* Title + Artist */}
              <div className="mw-np-info">
                <h3 className="mw-np-title">{currentTrack?.title || "Select a song"}</h3>
                <p className="mw-np-artist">{currentTrack?.artist || "MusicWave"}</p>
              </div>

              {/* Queue */}
              <div className="mw-queue">
                <span className="mw-queue-label">Next in Queue</span>
                <div className="mw-queue-list">
                  {upNextBase.slice(upNextStart, upNextStart + 3).map((qt, qi) => (
                    <div
                      key={qt.id + qi}
                      className="mw-queue-item"
                      onClick={() => player.playFromList(upNextBase, upNextStart + qi)}
                    >
                      <Image src={qt.artwork} alt={qt.title} width={34} height={34} className="mw-queue-thumb" unoptimized />
                      <div className="mw-queue-info">
                        <span className="mw-queue-title">{qt.title}</span>
                        <span className="mw-queue-artist">{qt.artist}</span>
                      </div>
                      <span className="mw-queue-dur">{formatTime(qt.duration)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
