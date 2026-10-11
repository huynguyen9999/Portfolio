import { frequencyFromCents } from "../../lib/tuner.ts";
import { clamp, type Vec2 } from "./interpolation.ts";

export function signalCents(pointerX: number, pointerY: number, holding: boolean): number {
  if (holding) return 0;
  const vertical = (0.5 - pointerY) * 70;
  const horizontal = (pointerX - 0.5) * 10;
  return clamp(vertical + horizontal, -50, 50);
}

export function signalReadout(cents: number): { note: string; frequency: number; cents: number; label: string } {
  const frequency = frequencyFromCents(cents);
  const signed = `${cents > 0 ? "+" : ""}${cents.toFixed(1)}`;
  return {
    note: "A4",
    frequency,
    cents,
    label: cents === 0 ? "A4 · 440.0 Hz · IN TUNE" : `A4 · ${frequency.toFixed(1)} Hz · ${signed} cents`,
  };
}

/** Normalized sample on a synthesized A4-region waveform. */
export function signalPoint(index: number, count: number, cents: number, phase: number): Vec2 {
  const x = count <= 1 ? 0.5 : index / (count - 1);
  const frequency = frequencyFromCents(cents);
  const amplitude = 0.08 + Math.min(0.16, Math.abs(cents) / 50 * 0.16);
  const y = 0.5 + Math.sin(phase + x * Math.PI * 3.2 * (frequency / 440)) * amplitude;
  return { x, y: clamp(y, 0.08, 0.92) };
}
