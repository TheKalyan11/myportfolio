"use client";

import { usePathname } from "next/navigation";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

/**
 * A floating Play / Playing toggle on the left edge of every page. Switching it on opens only the music player
 * controls (the mini-player bar); the full MusicWave window stays closed. Switching it off puts the controls away.
 */
export default function FloatingPlayButton() {
  const p = useMusicPlayer();
  const pathname = usePathname();

  // the /music page is the full player already
  if (pathname === "/music") return null;

  // "on" means the bar is showing because of this button or a song, not because the MusicWave window is open
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
    <label className="fpt">
      <input
        type="checkbox"
        className="fpt-input"
        checked={open}
        onChange={toggle}
        aria-label={open ? "Hide the music player controls" : "Open the music player controls"}
      />
      <div className="fpt-btn">
        <span className="fpt-txt fpt-play">Play</span>
        <span className="fpt-txt fpt-playing">Playing</span>
        <div className="fpt-dot" />
      </div>
    </label>
  );
}
