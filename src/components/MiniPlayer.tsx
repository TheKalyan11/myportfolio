"use client";

import React from "react";
import Image from "next/image";
import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume1, Volume2, VolumeX, X } from "lucide-react";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

const FALLBACK_ART =
  "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/83/3a/f7/833af71b-2e0c-3303-24f5-8f5c546c073b/20UMGIM21167.rgb.jpg/600x600bb.jpg";

const WAVE = [35, 60, 40, 85, 55, 95, 70, 45, 90, 65, 100, 75, 50, 85, 60, 90, 45, 75, 100, 65, 80, 50, 95, 70, 40, 85, 60, 90, 75, 50, 80, 65, 95, 60, 40, 70, 85, 55, 90, 65, 45, 75, 95, 60, 80, 50, 70, 40];

const formatTime = (secs: number) => {
  if (!Number.isFinite(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

/** A click-, drag- and keyboard-seekable strip. */
function Seekable({
  className,
  children,
  label,
}: {
  className: string;
  children: React.ReactNode;
  label: string;
}) {
  const { currentTime, duration, seekTo, seekBy } = useMusicPlayer();

  const seekFromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width > 0) seekTo((e.clientX - rect.left) / rect.width);
  };

  return (
    <div
      className={className}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(currentTime)}
      aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        seekFromPointer(e);
      }}
      onPointerMove={(e) => {
        if (e.buttons === 1) seekFromPointer(e);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          seekBy(5);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          seekBy(-5);
        }
      }}
    >
      {children}
    </div>
  );
}

/**
 * The fixed mini-player. It stays at the bottom of the screen on every page while a song is loaded,
 * and keeps working when the browser is resized or minimised, because the audio itself lives in
 * MusicPlayerProvider and not in this component.
 */
export default function MiniPlayer() {
  const p = useMusicPlayer();
  const { currentTrack, isPlaying, currentTime, duration, volume, isMuted, isShuffle, repeatMode, viewCount } = p;

  if (!p.visible || !currentTrack) return null;

  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const muted = isMuted || volume === 0;
  const VolumeIcon = muted ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <aside className="mp" role="region" aria-label="Music player">
      {/* thin progress line: the progress bar on phones, a quiet accent on desktop */}
      <Seekable className="mp-line" label="Seek">
        <span className="mp-line-fill" style={{ width: `${pct}%` }} />
      </Seekable>

      <div className="mp-track">
        <Image
          src={currentTrack.artwork || FALLBACK_ART}
          alt={`${currentTrack.album} cover`}
          width={44}
          height={44}
          className="mp-cover"
          unoptimized
        />
        <div className="mp-texts">
          <span className="mp-title" title={currentTrack.title}>
            {currentTrack.title}
          </span>
          <span className="mp-artist" title={`${currentTrack.artist} · ${currentTrack.album}`}>
            {currentTrack.artist}
          </span>
        </div>
      </div>

      <div className="mp-controls">
        <div className="mp-btns">
          <button
            type="button"
            className={`mp-ctrl mp-opt ${isShuffle ? "active" : ""}`}
            onClick={p.toggleShuffle}
            aria-label="Shuffle"
            aria-pressed={isShuffle}
          >
            <Shuffle size={15} />
          </button>
          <button type="button" className="mp-ctrl" onClick={p.prev} aria-label="Previous song">
            <SkipBack size={17} fill="currentColor" />
          </button>
          <button type="button" className="mp-play" onClick={p.togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button type="button" className="mp-ctrl" onClick={p.next} aria-label="Next song">
            <SkipForward size={17} fill="currentColor" />
          </button>
          <button
            type="button"
            className={`mp-ctrl mp-opt ${repeatMode !== "none" ? "active" : ""}`}
            onClick={p.toggleRepeat}
            aria-label={`Repeat: ${repeatMode}`}
          >
            {repeatMode === "one" ? <Repeat1 size={15} /> : <Repeat size={15} />}
          </button>
        </div>

        <div className="mp-wave-row">
          <span className="mp-time">{formatTime(currentTime)}</span>
          <Seekable className="mp-wave" label="Song progress">
            {WAVE.map((h, i) => (
              <span
                key={i}
                className={`mp-bar ${(i / (WAVE.length - 1)) * 100 <= pct ? "passed" : ""} ${isPlaying ? "dance" : ""}`}
                style={{ height: `${h}%`, animationDelay: `${(i % 10) * 0.08}s` }}
              />
            ))}
          </Seekable>
          <span className="mp-time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="mp-volume">
        <button type="button" className="mp-ctrl" onClick={p.toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
          <VolumeIcon size={17} />
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => p.setVolume(parseFloat(e.target.value))}
          className="mp-vol-slider"
          aria-label="Volume"
        />
        {viewCount === 0 && (
          <button type="button" className="mp-ctrl mp-close" onClick={p.stop} aria-label="Close player">
            <X size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
