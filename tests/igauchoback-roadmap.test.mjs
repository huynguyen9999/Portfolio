import test from "node:test";
import assert from "node:assert/strict";
import {
  directRelationships,
  nodeById,
  relatedNodeIds,
  roadmapEdges,
  roadmapNodes,
} from "../components/igauchoback-roadmap-state.ts";

test("representative iGauchoBack roadmap has stable, resolvable course relationships", () => {
  assert.equal(
    new Set(roadmapNodes.map((node) => node.id)).size,
    roadmapNodes.length,
  );
  for (const edge of roadmapEdges) {
    assert.ok(nodeById(edge.from), `missing source ${edge.from}`);
    assert.ok(nodeById(edge.to), `missing target ${edge.to}`);
    assert.notEqual(edge.from, edge.to);
  }
  assert.equal(
    new Set(roadmapEdges.map((edge) => `${edge.from}:${edge.to}:${edge.kind}`))
      .size,
    roadmapEdges.length,
  );
});

test("course selection exposes direct relationships and transitive roadmap context", () => {
  const circuits = directRelationships("ece-10c");
  assert.deepEqual(
    circuits.prerequisites.map((node) => node.id),
    ["ece-10b"],
  );
  assert.deepEqual(circuits.next.map((node) => node.id).sort(), [
    "ece-130a",
    "ece-15a",
  ]);
  const related = relatedNodeIds("ece-10c");
  for (const id of [
    "ece-3",
    "ece-10a",
    "ece-10b",
    "ece-10c",
    "ece-130b",
    "career-dsp",
    "career-hardware",
  ]) {
    assert.ok(related.has(id), `${id} should be connected to ECE 10C`);
  }
});

test("an entry course and a career endpoint support empty relationship states", () => {
  assert.deepEqual(directRelationships("ece-3").prerequisites, []);
  assert.deepEqual(directRelationships("career-dsp").next, []);
});
