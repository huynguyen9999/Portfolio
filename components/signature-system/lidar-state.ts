import type { Vec2 } from "./interpolation.ts";

export type LidarSample = Vec2 & { angle: number; cm: number; movement: boolean };

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

export function beamHits(angle: number, sample: number, tolerance = 0.11): boolean {
  return Math.abs(angle - sample) <= tolerance;
}
