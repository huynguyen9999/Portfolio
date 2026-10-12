import type { Vec2 } from "./interpolation.ts";

export type GraphNode = Vec2 & { deps: number[] };

const LAYERS = [4, 6, 7, 5, 3];

/** Normalized prerequisite layout inspired by a degree graph, not a catalog export. */
export function graphLayout(): GraphNode[] {
  const nodes: GraphNode[] = [];
  const starts: number[] = [];
  LAYERS.forEach((count, layer) => {
    starts.push(nodes.length);
    for (let i = 0; i < count; i++) {
      const deps: number[] = [];
      if (layer > 0) {
        const prevCount = LAYERS[layer - 1];
        const prevStart = starts[layer - 1];
        const slot = Math.min(prevCount - 1, Math.round((i / Math.max(1, count - 1)) * (prevCount - 1)));
        deps.push(prevStart + slot);
        if (prevCount > 2 && i % 2 === 1) deps.push(prevStart + Math.max(0, slot - 1));
      }
      nodes.push({
        x: layer / (LAYERS.length - 1),
        y: (i + 0.5) / count,
        deps,
      });
    }
  });
  return nodes;
}

export function dependencyPath(nodes: GraphNode[], index: number): Set<number> {
  const path = new Set<number>();
  const ancestors = [index];
  while (ancestors.length) {
    const node = ancestors.pop()!;
    if (path.has(node)) continue;
    path.add(node);
    for (const dep of nodes[node]?.deps ?? []) ancestors.push(dep);
  }
  const children: number[][] = nodes.map(() => []);
  nodes.forEach((node, i) => node.deps.forEach(dep => children[dep]?.push(i)));
  const forward = [index];
  while (forward.length) {
    const node = forward.pop()!;
    for (const child of children[node] ?? []) {
      if (path.has(child)) continue;
      path.add(child);
      forward.push(child);
    }
  }
  return path;
}
