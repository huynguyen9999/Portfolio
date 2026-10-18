"use client";

import { useEffect, useRef, type RefObject } from "react";
import { clamp } from "./interpolation";

export type PointerSample = {
  x: number;
  y: number;
  stage: number;
  down: boolean;
  inside: boolean;
  clientX: number;
  clientY: number;
};

export function usePointer(
  target: RefObject<HTMLElement | null>,
  reducedMotion: boolean,
) {
  const sample = useRef<PointerSample>({
    x: 0.12,
    y: 0.5,
    stage: 0.06,
    down: false,
    inside: false,
    clientX: 0,
    clientY: 0,
  });

  useEffect(() => {
    const el = target.current;
    if (!el || reducedMotion) return;
    const state = sample.current;
    let activePointer: number | null = null;
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
      if (
        !event.isPrimary ||
        (activePointer !== null && event.pointerId !== activePointer)
      )
        return;
      const next = point(event);
      sample.current.x = next.x;
      sample.current.y = next.y;
      sample.current.clientX = event.clientX;
      sample.current.clientY = event.clientY;
      sample.current.inside = true;
      if (event.pointerType === "touch") {
        if (!sample.current.down) return;
        const dx =
          (event.clientX - originX) /
          Math.max(1, el.getBoundingClientRect().width);
        sample.current.stage = clamp(originStage + dx, 0, 1);
        return;
      }
      if (next.y <= 0.86) sample.current.stage = next.x;
    };
    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || activePointer !== null)
        return;
      activePointer = event.pointerId;
      sample.current.down = true;
      originX = event.clientX;
      originStage = sample.current.stage;
      if (event.pointerType === "touch") el.setPointerCapture(event.pointerId);
      move(event);
    };
    const up = (event: PointerEvent) => {
      if (event.pointerId !== activePointer) return;
      activePointer = null;
      sample.current.down = false;
      if (event.pointerType === "touch") sample.current.inside = false;
      if (el.hasPointerCapture(event.pointerId))
        el.releasePointerCapture(event.pointerId);
    };
    const leave = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      sample.current.inside = false;
      if (event.pointerType !== "touch") {
        sample.current.down = false;
        activePointer = null;
      }
    };
    const reset = () => {
      if (activePointer !== null && el.hasPointerCapture(activePointer))
        el.releasePointerCapture(activePointer);
      activePointer = null;
      state.down = false;
      state.inside = false;
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("lostpointercapture", up);
    window.addEventListener("blur", reset);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("lostpointercapture", up);
      window.removeEventListener("blur", reset);
      reset();
    };
  }, [target, reducedMotion]);

  return sample;
}
