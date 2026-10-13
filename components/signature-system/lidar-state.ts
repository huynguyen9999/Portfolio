import type { Vec2 } from "./interpolation.ts";

export type LidarSample = Vec2 & { angle: number; cm: number; movement: boolean };

/** One complete left-to-right-and-back pass. Kept deliberately slow to read as a physical scan. */
export const SENSOR_SWEEP_CYCLE_MS = 17_600;
export const SENSOR_REFERENCE_CM = 100;
const SENSOR_HIT_TOLERANCE = 0.022;

/** Normalized semicircle of synthetic returns. Distances are illustrative, not measurements. */
export function lidarLayout(count: number): LidarSample[] {
  return Array.from({ length: count }, (_, index) => {
    const span = count <= 1 ? 0.5 : index / (count - 1);
    const angle = Math.PI * (0.06 + span * 0.88);
    const reach = 0.28 + ((index * 17) % 10) / 10 * 0.5;
    const cm = Math.round(42 + reach * 128);
    return {
      x: 0.5 + Math.cos(Math.PI - angle) * reach * 0.72,
      y: 0.82 - Math.sin(angle) * reach * 0.7,
      angle,
      cm: Math.min(170, cm),
      movement: index % 7 === 3,
    };
  });
}

export function scanAngle(pointerX: number): number {
  return Math.PI * (0.06 + Math.min(1, Math.max(0, pointerX)) * 0.88);
}

/** Maps the illustrative centimetre reading back to the radial layout used by the display. */
export function sensorRadiusForCm(cm: number): number {
  return Math.min(0.78, Math.max(0.28, (cm - 42) / 128));
}

/** Sweeps left to right through the illustrative 180° field, then reverses. */
export function sweepAngle(elapsedMs: number, cycleMs = SENSOR_SWEEP_CYCLE_MS): number {
  const cycle = ((elapsedMs % cycleMs) + cycleMs) % cycleMs;
  const progress = cycle / cycleMs;
  return scanAngle(progress <= 0.5 ? progress * 2 : (1 - progress) * 2);
}

export function beamHits(angle: number, sample: number, tolerance = 0.11): boolean {
  return Math.abs(angle - sample) <= tolerance;
}

export function proximityHits(angle: number, samples: LidarSample[], thresholdCm = 100): LidarSample[] {
  return samples.filter(sample => sample.cm <= thresholdCm && beamHits(angle, sample.angle, SENSOR_HIT_TOLERANCE));
}
