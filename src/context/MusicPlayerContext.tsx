"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { MusicTrack } from "@/app/api/music/search/route";

/**
 * One audio player for the whole site.
 *
 * The <audio> element lives here, above every page, so music keeps playing while visitors move between
 * pages, open and close the MusicWave window, or resize and minimise the browser. The fixed mini-player
 * (MiniPlayer) and the MusicWave window both read and control this one player.
 */

export type RepeatMode = "none" | "all" | "one";

interface MusicPlayerValue {
  /** The song list currently shown while browsing (search results, a language, a genre …). */
  tracks: MusicTrack[];
  isLoading: boolean;
  fetchTracks: (query: string) => Promise<void>;
  ensureTracks: () => void;

  /** What is playing. Browsing never changes it, so searching does not interrupt the music. */
  queue: MusicTrack[];
  queueIndex: number;
  /** The playing track, or the first listed track before anything has been played. */
  currentTrack: MusicTrack | undefined;
  hasQueue: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;

  togglePlay: () => void;
  playFromList: (list: MusicTrack[], index: number) => void;
  /** Looks up songs for a search (for example a language) and starts playing the first one. */
  playQuery: (query: string) => Promise<void>;
  next: () => void;
  prev: () => void;
  seekTo: (fraction: number) => void;
  seekBy: (seconds: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  stop: () => void;
  /** Keep the mini-player on screen even before a song is chosen (used when the MusicWave window is minimized). */
  pin: () => void;

  toastMessage: string | null;
  showToast: (message: string) => void;

  /** The MusicWave window calls this while it is open; the mini-player then also shows before any song is chosen. */
  registerView: () => () => void;
  viewCount: number;
  /** Whether the mini-player should be on screen. */
  visible: boolean;
}

const MusicPlayerContext = createContext<MusicPlayerValue | null>(null);

export function useMusicPlayer(): MusicPlayerValue {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error("useMusicPlayer must be used inside <MusicPlayerProvider>");
  return ctx;
}

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [volume, setVolumeState] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [pinned, setPinned] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestedTracks = useRef(false);
  const errorStreak = useRef(0);
  // Counts the "play these songs" requests. Stopping or choosing another song bumps it, so a search that finishes late does not start playing.
  const playToken = useRef(0);

  // Latest values for the audio event handlers, which are attached once.
  const live = useRef({ queue, queueIndex, repeatMode, isShuffle, tracks });
  useEffect(() => {
    live.current = { queue, queueIndex, repeatMode, isShuffle, tracks };
  });

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 2500);
  }, []);

  /* ---------- browsing list ---------- */
  const fetchTracks = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/music/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) setTracks(data.results);
    } catch (err) {
      console.error("Failed to load music:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const ensureTracks = useCallback(() => {
    if (requestedTracks.current) return;
    requestedTracks.current = true;
    void fetchTracks("all");
  }, [fetchTracks]);

  /* ---------- playback ---------- */
  const startAt = useCallback((list: MusicTrack[], index: number) => {
    const audio = audioRef.current;
    const track = list[index];
    if (!audio || !track) return;
    setQueue(list);
    setQueueIndex(index);
    setCurrentTime(0);
    audio.src = track.previewUrl;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

  const playQuery = useCallback(
    async (query: string) => {
      const token = ++playToken.current;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/music/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (token !== playToken.current) return; // stopped or replaced while searching
        if (data.results && data.results.length > 0) {
          setTracks(data.results);
          startAt(data.results, 0);
        } else {
          showToast("Could not find songs right now");
        }
      } catch (err) {
        console.error("Failed to load music:", err);
        showToast("Could not load songs right now");
      } finally {
        setIsLoading(false);
      }
    },
    [startAt, showToast],
  );

  const pickNext = useCallback((direction: 1 | -1) => {
    const { queue: q, queueIndex: i, isShuffle: shuffle } = live.current;
    if (q.length === 0) return -1;
    if (shuffle && q.length > 1) {
      let n = i;
      while (n === i) n = Math.floor(Math.random() * q.length);
      return n;
    }
    return (i + direction + q.length) % q.length;
  }, []);

  const next = useCallback(() => {
    const n = pickNext(1);
    if (n >= 0) startAt(live.current.queue, n);
  }, [pickNext, startAt]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const n = pickNext(-1);
    if (n >= 0) startAt(live.current.queue, n);
  }, [pickNext, startAt]);

  const playFromList = useCallback(
    (list: MusicTrack[], index: number) => {
      const audio = audioRef.current;
      const track = list[index];
      if (!track) return;
      playToken.current++;
      const { queue: q, queueIndex: i } = live.current;
      // choosing the song that is already playing toggles it
      if (audio && q[i] && q[i].id === track.id && q[i].title === track.title && audio.src) {
        if (audio.paused) {
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } else {
          audio.pause();
          setIsPlaying(false);
        }
        return;
      }
      startAt(list, index);
    },
    [startAt],
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const { queue: q, tracks: list } = live.current;
    if (q.length === 0) {
      // nothing chosen yet: start with the first listed song
      if (list.length > 0) startAt(list, 0);
      return;
    }
    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [startAt]);

  const seekTo = useCallback((fraction: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const total = audio.duration && !Number.isNaN(audio.duration) ? audio.duration : 30;
    const t = Math.max(0, Math.min(1, fraction)) * total;
    audio.currentTime = t;
    setCurrentTime(t);
  }, []);

  const seekBy = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const total = audio.duration && !Number.isNaN(audio.duration) ? audio.duration : 30;
    const t = Math.max(0, Math.min(total, audio.currentTime + seconds));
    audio.currentTime = t;
    setCurrentTime(t);
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(Math.max(0, Math.min(1, value)));
    setIsMuted(false);
  }, []);
  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);
  const toggleShuffle = useCallback(() => setIsShuffle((s) => !s), []);
  const toggleRepeat = useCallback(
    () => setRepeatMode((m) => (m === "none" ? "all" : m === "all" ? "one" : "none")),
    [],
  );

  const pin = useCallback(() => setPinned(true), []);

  const stop = useCallback(() => {
    playToken.current++;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setIsPlaying(false);
    setQueue([]);
    setQueueIndex(0);
    setCurrentTime(0);
    setPinned(false);
  }, []);

  /* ---------- the audio element (created once, never torn down by navigation) ---------- */
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !Number.isNaN(audio.duration)) setDuration(audio.duration);
    };
    const onPlay = () => {
      errorStreak.current = 0;
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      const { queue: q, queueIndex: i, repeatMode: repeat, isShuffle: shuffle } = live.current;
      if (repeat === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      const atEnd = !shuffle && i === q.length - 1;
      if (repeat === "none" && atEnd) {
        setIsPlaying(false);
        return;
      }
      next();
    };
    const onError = () => {
      if (!audio.getAttribute("src")) return; // cleared on purpose
      setIsPlaying(false);
      errorStreak.current += 1;
      const { queue: q } = live.current;
      if (errorStreak.current >= q.length) {
        showToast("Tracks are unavailable right now.");
        return;
      }
      showToast("Track unavailable. Playing next...");
      setTimeout(next, 800);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [next, showToast]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  /* ---------- lock-screen / keyboard media keys ---------- */
  const currentTrack: MusicTrack | undefined = queue[queueIndex] ?? tracks[0];
  const playing = queue[queueIndex];
  useEffect(() => {
    if (!("mediaSession" in navigator) || !playing) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: playing.title,
      artist: playing.artist,
      album: playing.album,
      artwork: [{ src: playing.artwork, sizes: "512x512", type: "image/jpeg" }],
    });
  }, [playing]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    ms.setActionHandler("play", togglePlay);
    ms.setActionHandler("pause", togglePlay);
    ms.setActionHandler("previoustrack", prev);
    ms.setActionHandler("nexttrack", next);
    ms.setActionHandler("seekto", (d) => {
      const audio = audioRef.current;
      if (audio && typeof d.seekTime === "number") {
        audio.currentTime = d.seekTime;
        setCurrentTime(d.seekTime);
      }
    });
    return () => {
      (["play", "pause", "previoustrack", "nexttrack", "seekto"] as const).forEach((a) => ms.setActionHandler(a, null));
    };
  }, [togglePlay, prev, next]);

  /* ---------- views ---------- */
  const registerView = useCallback(() => {
    setViewCount((c) => c + 1);
    return () => setViewCount((c) => Math.max(0, c - 1));
  }, []);

  const hasQueue = queue.length > 0;
  const visible = hasQueue || viewCount > 0 || pinned;

  // Leave room under the page for the fixed bar (the MusicWave window reserves its own space).
  useEffect(() => {
    const on = (hasQueue || pinned) && viewCount === 0;
    document.body.classList.toggle("has-mini-player", on);
    return () => document.body.classList.remove("has-mini-player");
  }, [hasQueue, pinned, viewCount]);

  const value = useMemo<MusicPlayerValue>(
    () => ({
      tracks,
      isLoading,
      fetchTracks,
      ensureTracks,
      queue,
      queueIndex,
      currentTrack,
      hasQueue,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      isShuffle,
      repeatMode,
      togglePlay,
      playFromList,
      playQuery,
      next,
      prev,
      seekTo,
      seekBy,
      setVolume,
      toggleMute,
      toggleShuffle,
      toggleRepeat,
      stop,
      pin,
      toastMessage,
      showToast,
      registerView,
      viewCount,
      visible,
    }),
    [
      tracks,
      isLoading,
      fetchTracks,
      ensureTracks,
      queue,
      queueIndex,
      currentTrack,
      hasQueue,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      isShuffle,
      repeatMode,
      togglePlay,
      playFromList,
      playQuery,
      next,
      prev,
      seekTo,
      seekBy,
      setVolume,
      toggleMute,
      toggleShuffle,
      toggleRepeat,
      stop,
      pin,
      toastMessage,
      showToast,
      registerView,
      viewCount,
      visible,
    ],
  );

  return <MusicPlayerContext.Provider value={value}>{children}</MusicPlayerContext.Provider>;
}
