export type Vec2 = { x: number; y: number };

export type StageName = "graph" | "signal" | "lidar";

export type StageWeights = Record<StageName, number>;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function smoothstep(edge0: number, edge1: number, value: number): number {
  if (edge0 === edge1) return value >= edge1 ? 1 : 0;
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Graph at the left, signal through the middle, sensor at the right. */
export function stageWeights(stage: number): StageWeights {
  const t = clamp(stage, 0, 1);
  const toSignal = smoothstep(0.2, 0.42, t);
  const toLidar = smoothstep(0.58, 0.8, t);
  const graph = 1 - toSignal;
  const lidar = toLidar;
  const signal = Math.max(0, 1 - graph - lidar);
  const sum = graph + signal + lidar || 1;
  return { graph: graph / sum, signal: signal / sum, lidar: lidar / sum };
}

export function dominantStage(weights: StageWeights): StageName {
  if (weights.lidar >= weights.signal && weights.lidar >= weights.graph) return "lidar";
  if (weights.signal >= weights.graph) return "signal";
  return "graph";
}

export function mixPosition(graph: Vec2, signal: Vec2, lidar: Vec2, weights: StageWeights): Vec2 {
  return {
    x: graph.x * weights.graph + signal.x * weights.signal + lidar.x * weights.lidar,
    y: graph.y * weights.graph + signal.y * weights.signal + lidar.y * weights.lidar,
  };
}

/** Frame-rate-independent damped spring. Mutates current and velocity. */
export function springStep(current: Vec2, velocity: Vec2, target: Vec2, dtMs: number, stiffness = 0.012, damping = 0.045): void {
  const dt = clamp(dtMs, 0, 40);
  const follow = 1 - Math.exp(-stiffness * dt);
  const drag = Math.exp(-damping * dt);
  velocity.x = velocity.x * drag + (target.x - current.x) * follow;
  velocity.y = velocity.y * drag + (target.y - current.y) * follow;
  current.x += velocity.x;
  current.y += velocity.y;
}
