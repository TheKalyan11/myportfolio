/**
 * Smooth-scrolls to a section by its "#id" and keeps the address bar in step.
 *
 * The browser's own jump to "#id" measures the target once, when the click happens. This page has pinned and
 * scroll-driven sections whose heights change while you scroll, so a long jump can stop short or get cancelled.
 * This version measures the target again on every frame, so it always lands on it, and a wheel, touch or key
 * press hands control back to the visitor straight away.
 */
let cancelCurrent: (() => void) | null = null;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function scrollToSection(hash: string): boolean {
  if (typeof window === "undefined") return false;
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const target = id ? document.getElementById(id) : document.body;
  if (!target) return false;

  cancelCurrent?.();

  const root = document.documentElement;
  // keep the same gap the browser would leave: the target's scroll-margin plus the page's scroll-padding
  const margin = (parseFloat(getComputedStyle(target).scrollMarginTop) || 0) + (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0);
  const targetTop = () => target.getBoundingClientRect().top + window.scrollY - margin;
  const maxScroll = () => root.scrollHeight - window.innerHeight;
  const land = () => Math.min(Math.max(targetTop(), 0), maxScroll());

  const from = window.scrollY;
  const distance = Math.abs(land() - from);
  const duration = Math.min(1600, 500 + distance * 0.12);
  const start = performance.now();

  // the stylesheet asks for smooth scrolling; turn that off while we animate so the two do not fight
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";

  let frame = 0;
  const stop = () => {
    cancelAnimationFrame(frame);
    root.style.scrollBehavior = previous;
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
    if (cancelCurrent === stop) cancelCurrent = null;
  };
  cancelCurrent = stop;
  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const goal = land();
    window.scrollTo(0, from + (goal - from) * easeInOut(t));
    if (t < 1) {
      frame = requestAnimationFrame(step);
      return;
    }
    // final settle: layout can still move for a moment (images, pinned sections), so correct it a few times
    let settles = 0;
    const settle = () => {
      const miss = land() - window.scrollY;
      if (Math.abs(miss) > 1 && settles++ < 6) {
        window.scrollTo(0, window.scrollY + miss);
        frame = requestAnimationFrame(settle);
      } else {
        stop();
      }
    };
    frame = requestAnimationFrame(settle);
  };
  frame = requestAnimationFrame(step);

  if (id) window.history.replaceState(null, "", `#${id}`);
  return true;
}
