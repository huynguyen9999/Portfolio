"use client";

import { useEffect, useRef } from "react";

export function MagneticWord({ children }: { children: string }) {
  const hostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(any-hover: hover)");
    const reset = () => {
      host.removeAttribute("data-active");
      host.style.removeProperty("--word-x");
      host.style.removeProperty("--word-y");
      host.style.removeProperty("--word-rx");
      host.style.removeProperty("--word-ry");
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduced.matches || !hover.matches) {
        reset();
        return;
      }
      // Measure the stationary hit area, not the moving letters. This keeps
      // the interaction confined to the word and avoids hover-edge jitter.
      const box = host.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width - 0.5) * 2));
      const y = Math.max(-1, Math.min(1, ((event.clientY - box.top) / box.height - 0.5) * 2));
      // Browser coordinates decrease upward; amplify that half of the motion.
      const verticalPull = y < 0 ? y * 1.75 : y;
      host.style.setProperty("--word-x", `${x * 18}px`);
      host.style.setProperty("--word-y", `${verticalPull * 12}px`);
      host.style.setProperty("--word-rx", `${-verticalPull * 24}deg`);
      host.style.setProperty("--word-ry", `${x * 30}deg`);
      host.dataset.active = "true";
    };
    const visibility = () => {
      if (document.hidden) reset();
    };
    host.addEventListener("pointerenter", move);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", reset);
    host.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", reset);
    hover.addEventListener("change", reset);
    return () => {
      host.removeEventListener("pointerenter", move);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", reset);
      host.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", reset);
      hover.removeEventListener("change", reset);
      reset();
    };
  }, []);

  return (
    <span ref={hostRef} className="contact-accent magnetic-word">
      <span className="magnetic-word-face">{children}</span>
    </span>
  );
}
