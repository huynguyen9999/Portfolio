export type RelationshipKind = "prerequisite" | "recommended" | "leads-to";

export type RoadmapNode = {
  id: string;
  code: string;
  title: string;
  units?: string;
  column: number;
  row: number;
  kind?: "career";
  description: string;
};

export type RoadmapEdge = {
  from: string;
  to: string;
  kind: RelationshipKind;
};

/**
 * A compact, representative subset of the public UCSB EE roadmap. It is a
 * portfolio demonstration, not a catalog export or degree-audit source.
 */
export const roadmapNodes: RoadmapNode[] = [
  { id: "ece-3", code: "ECE 3", title: "Introduction to Electrical Engineering", units: "4 units", column: 0, row: 0, description: "An early survey of electrical engineering disciplines, tools, and career paths." },
  { id: "ece-5", code: "ECE 5", title: "Introduction to ECE", units: "4 units", column: 0, row: 1, description: "An introduction to ECE sub-fields through faculty lectures and project labs." },
  { id: "cmpsc-16", code: "CMPSC 16", title: "Problem Solving with C++", units: "4 units", column: 0, row: 2, description: "Programming fundamentals for engineering applications." },
  { id: "ece-10a", code: "ECE 10A", title: "Circuits & Systems I", units: "5 units", column: 1, row: 1, description: "Core preparation for signals, electronics, and logic-design tracks." },
  { id: "ece-10b", code: "ECE 10B", title: "Circuits & Systems II", units: "5 units", column: 2, row: 0, description: "Continuation of circuit analysis, frequency response, and system-level concepts." },
  { id: "ece-15a", code: "ECE 15A", title: "Fundamentals of Logic Design", units: "4 units", column: 2, row: 2, description: "Boolean algebra and sequential logic for digital systems." },
  { id: "ece-10c", code: "ECE 10C", title: "Circuits & Systems III", units: "5 units", column: 3, row: 0, description: "Advanced circuits that bridge to upper-division EE analysis and design." },
  { id: "ece-152a", code: "ECE 152A", title: "Digital Design Principles", units: "5 units", column: 3, row: 2, description: "Finite state machines, timing, and implementation strategies for digital hardware." },
  { id: "ece-130a", code: "ECE 130A", title: "Signal Analysis & Processing I", units: "4 units", column: 4, row: 0, description: "Continuous-time signals, Fourier analysis, filtering, and signal-processing methods." },
  { id: "ece-153b", code: "ECE 153B", title: "Sensor & Peripheral Interface Design", units: "4 units", column: 4, row: 2, description: "Embedded interfaces, sensors, and peripherals for system design." },
  { id: "ece-130b", code: "ECE 130B", title: "Signal Analysis & Processing II", units: "4 units", column: 5, row: 0, description: "Discrete-time signals, sampling, Z-transforms, and digital filter design." },
  { id: "ece-188a", code: "ECE 188A", title: "Senior EE Capstone I", units: "5 units", column: 5, row: 2, description: "The first senior-project milestone: requirements, budget, and an initial prototype." },
  { id: "career-dsp", code: "Career", title: "Signal Processing Engineer", column: 6, row: 0, kind: "career", description: "A representative outcome connected to signal-analysis coursework." },
  { id: "career-hardware", code: "Career", title: "Hardware / Digital Design", column: 6, row: 2, kind: "career", description: "A representative outcome connected to digital-design and capstone coursework." },
];

export const roadmapEdges: RoadmapEdge[] = [
  { from: "ece-3", to: "ece-10a", kind: "recommended" },
  { from: "ece-5", to: "ece-10a", kind: "recommended" },
  { from: "ece-10a", to: "ece-10b", kind: "prerequisite" },
  { from: "ece-10b", to: "ece-10c", kind: "prerequisite" },
  { from: "ece-10c", to: "ece-130a", kind: "prerequisite" },
  { from: "ece-10c", to: "ece-15a", kind: "recommended" },
  { from: "cmpsc-16", to: "ece-15a", kind: "recommended" },
  { from: "ece-15a", to: "ece-152a", kind: "prerequisite" },
  { from: "ece-130a", to: "ece-130b", kind: "prerequisite" },
  { from: "ece-152a", to: "ece-153b", kind: "recommended" },
  { from: "ece-153b", to: "ece-188a", kind: "prerequisite" },
  { from: "ece-130b", to: "career-dsp", kind: "leads-to" },
  { from: "ece-152a", to: "career-hardware", kind: "leads-to" },
  { from: "ece-188a", to: "career-hardware", kind: "leads-to" },
];

const byId = new Map(roadmapNodes.map(node => [node.id, node]));

export function nodeById(id: string) {
  return byId.get(id);
}

export function relatedNodeIds(selectedId: string) {
  const related = new Set([selectedId]);
  const upstream = new Map<string, string[]>();
  const downstream = new Map<string, string[]>();
  for (const edge of roadmapEdges) {
    upstream.set(edge.to, [...(upstream.get(edge.to) ?? []), edge.from]);
    downstream.set(edge.from, [...(downstream.get(edge.from) ?? []), edge.to]);
  }
  const visit = (start: string, adjacency: Map<string, string[]>) => {
    const pending = [...(adjacency.get(start) ?? [])];
    while (pending.length) {
      const id = pending.pop();
      if (!id || related.has(id)) continue;
      related.add(id);
      pending.push(...(adjacency.get(id) ?? []));
    }
  };
  visit(selectedId, upstream);
  visit(selectedId, downstream);
  return related;
}

export function directRelationships(selectedId: string) {
  return {
    prerequisites: roadmapEdges.filter(edge => edge.to === selectedId && edge.kind !== "leads-to").map(edge => nodeById(edge.from)).filter((node): node is RoadmapNode => Boolean(node)),
    next: roadmapEdges.filter(edge => edge.from === selectedId).map(edge => nodeById(edge.to)).filter((node): node is RoadmapNode => Boolean(node)),
  };
}
