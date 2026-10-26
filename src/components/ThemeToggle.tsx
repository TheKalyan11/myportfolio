"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

/** A sun and moon switch on the right edge of every page: on (blue sky, sun) is the light look, off (night, moon and stars) is the dark look. */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // the /music page is the full player and has its own look
  if (pathname === "/music") return null;

  const light = theme === "light";
  return (
    <label className="theme-switch" title={light ? "Switch to dark mode" : "Switch to light mode"}>
      <input type="checkbox" checked={light} onChange={toggleTheme} aria-label={light ? "Switch to the dark theme" : "Switch to the light theme"} />
      <span className="theme-slider">
        <span className="theme-star theme-star-1" />
        <span className="theme-star theme-star-2" />
        <span className="theme-star theme-star-3" />
        <svg viewBox="0 0 16 16" className="theme-cloud" aria-hidden>
          <path
            transform="matrix(.77976 0 0 .78395-299.99-418.63)"
            fill="#fff"
            d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
          />
        </svg>
      </span>
    </label>
  );
}
