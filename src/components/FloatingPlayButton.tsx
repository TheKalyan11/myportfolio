"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

/**
 * A floating Play / Playing toggle on the left edge of every page. Switching it on opens only the music player
 * controls (the mini-player bar) and starts playing Telugu songs; the full MusicWave window stays closed. Switching it off puts the controls away.
 */
// the same search the MusicWave "Telugu" language uses
const TELUGU_QUERY = "telugu hits songs";

export default function FloatingPlayButton() {
  const p = useMusicPlayer();
  const pathname = usePathname();
  const [inFooter, setInFooter] = useState(false);

  // The button steps out of the way while the footer is on screen (the footer has its own contact buttons).
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const footer = document.getElementById("footer");
      setInFooter(!!footer && footer.getBoundingClientRect().top < window.innerHeight * 0.9);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  // the /music page is the full player already
  if (pathname === "/music") return null;

  // The music bar is showing because of this button or a song, not because the MusicWave window is open
  const barOpen = p.visible && p.viewCount === 0;
  // "Playing" means a song is really playing (or the songs are still being looked up), not just that the bar is open
  const on = barOpen && (p.isPlaying || p.isLoading);

  const toggle = () => {
    if (on) {
      // playing: switch it off and put the controls away
      p.stop();
      return;
    }
    if (barOpen && p.hasQueue) {
      // the bar is open but paused: carry on with the same song
      p.togglePlay();
      return;
    }
    // closed: open the controls and play Telugu songs, starting with the first one
    p.pin();
    void p.playQuery(TELUGU_QUERY);
  };

  return (
    <label className={`fpt${inFooter ? " fpt-away" : ""}`}>
      <input
        type="checkbox"
        className="fpt-input"
        checked={on}
        onChange={toggle}
        aria-label={on ? "Stop the music and hide the player controls" : "Play music"}
      />
      <div className="fpt-btn">
        <span className="fpt-txt fpt-play">Play</span>
        <span className="fpt-txt fpt-playing">Playing</span>
        <div className="fpt-dot" />
      </div>
    </label>
  );
}
