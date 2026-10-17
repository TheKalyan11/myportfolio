"use client";

import { usePathname } from "next/navigation";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

/**
 * A floating button on the left edge of every page. It opens only the music player controls (the mini-player bar);
 * the full MusicWave window stays closed. Click it again to put the controls away.
 */
export default function FloatingPlayButton() {
  const p = useMusicPlayer();
  const pathname = usePathname();

  // the /music page is the full player already
  if (pathname === "/music") return null;

  // "open" means the bar is showing because of this button or a song, not because the MusicWave window is open
  const open = p.visible && p.viewCount === 0;

  const toggle = () => {
    if (open) {
      p.stop();
      return;
    }
    p.ensureTracks();
    p.pin();
  };

  return (
    <button
      type="button"
      className="fpb"
      onClick={toggle}
      aria-pressed={open}
      aria-label={open ? "Hide the music player controls" : "Open the music player controls"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="36" height="36" aria-hidden>
        <rect width={36} height={36} fill="#fdd835" />
        <circle cx="18" cy="20" r="10" fill="#e53935" />
        <path d="M8 20a10 10 0 0 1 20 0" fill="none" stroke="#212121" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="5.6" y="18" width="4" height="7" rx="2" fill="#212121" />
        <rect x="26.4" y="18" width="4" height="7" rx="2" fill="#212121" />
        <circle cx="14.5" cy="20" r="1.6" fill="#fff" />
        <circle cx="21.5" cy="20" r="1.6" fill="#fff" />
        <path d="M14.5 24.2q3.5 2.6 7 0" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="fpb-now">now!</span>
      <span className="fpb-play">play</span>
    </button>
  );
}
