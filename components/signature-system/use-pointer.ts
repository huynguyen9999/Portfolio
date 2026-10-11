"use client";

import { useEffect, useRef, type RefObject } from "react";
import { clamp } from "./interpolation";

export type PointerSample = {
  x: number;
  y: number;
  stage: number;
  down: boolean;
  inside: boolean;
  coarse: boolean;
  clientX: number;
  clientY: number;
};

export function usePointer(target: RefObject<HTMLElement | null>, reducedMotion: boolean) {
  const sample = useRef<PointerSample>({ x: 0.12, y: 0.5, stage: 0.06, down: false, inside: false, coarse: false, clientX: 0, clientY: 0 });

  useEffect(() => {
    const el = target.current;
    if (!el || reducedMotion) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    sample.current.coarse = coarse;
    let originX = 0;
    let originStage = sample.current.stage;

    const point = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      return {
        x: clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1),
        y: clamp((event.clientY - rect.top) / Math.max(1, rect.height), 0, 1),
      };
    };
    const move = (event: PointerEvent) => {
      const next = point(event);
      sample.current.x = next.x;
      sample.current.y = next.y;
      sample.current.clientX = event.clientX;
      sample.current.clientY = event.clientY;
      sample.current.inside = true;
      if (coarse) {
        if (!sample.current.down) return;
        const dx = (event.clientX - originX) / Math.max(1, el.getBoundingClientRect().width);
        sample.current.stage = clamp(originStage + dx, 0, 1);
        return;
      }
      if (next.y <= 0.86) sample.current.stage = next.x;
    };
    const down = (event: PointerEvent) => {
      sample.current.down = true;
      originX = event.clientX;
      originStage = sample.current.stage;
      if (coarse) el.setPointerCapture?.(event.pointerId);
      move(event);
    };
    const up = (event: PointerEvent) => {
      sample.current.down = false;
      if (coarse) el.releasePointerCapture?.(event.pointerId);
    };
    const leave = () => {
      sample.current.inside = false;
      if (!coarse) sample.current.down = false;
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", leave);
    };
  }, [target, reducedMotion]);

  return sample;
}
