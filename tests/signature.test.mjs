import test from "node:test";
import assert from "node:assert/strict";
import { dominantStage, mixPosition, springStep, stageWeights } from "../components/signature-system/interpolation.ts";
import { dependencyPath, graphLayout } from "../components/signature-system/graph-state.ts";
import { signalCents, signalPoint, signalReadout } from "../components/signature-system/signal-state.ts";
import { beamHits, lidarLayout, scanAngle } from "../components/signature-system/lidar-state.ts";

test("stage weights move from graph through signal to sensor", () => {
  const left = stageWeights(0);
  const middle = stageWeights(0.5);
  const right = stageWeights(1);
  assert.equal(left.graph, 1);
  assert.ok(middle.signal > middle.graph && middle.signal > middle.lidar);
  assert.equal(right.lidar, 1);
  for (const stage of [0, 0.25, 0.5, 0.75, 1]) {
    const weights = stageWeights(stage);
    const sum = weights.graph + weights.signal + weights.lidar;
    assert.ok(Math.abs(sum - 1) < 1e-9);
    assert.equal(dominantStage(weights), stage < 0.3 ? "graph" : stage > 0.7 ? "lidar" : "signal");
  }
});

test("mixed positions stay inside the weighted bounds", () => {
  const weights = stageWeights(0.32);
  assert.ok(weights.graph > 0 && weights.signal > 0);
  const mixed = mixPosition({ x: 0, y: 0 }, { x: 10, y: 20 }, { x: 30, y: 0 }, weights);
  assert.ok(mixed.x > 0 && mixed.x < 10);
  assert.ok(mixed.y > 0 && mixed.y < 20);
});

test("spring motion approaches the target without exploding", () => {
  const current = { x: 0, y: 0 };
  const velocity = { x: 0, y: 0 };
  let previous = Infinity;
  for (let step = 0; step < 90; step++) {
    springStep(current, velocity, { x: 100, y: 40 }, 16);
    const distance = Math.hypot(100 - current.x, 40 - current.y);
    assert.ok(Number.isFinite(distance));
    if (step > 10) assert.ok(distance <= previous + 1);
    previous = distance;
  }
  assert.ok(Math.hypot(100 - current.x, 40 - current.y) < 5);
});

test("graph has a traversable prerequisite path", () => {
  const nodes = graphLayout();
  assert.ok(nodes.length >= 15 && nodes.length <= 25);
  assert.ok(nodes.some(node => node.deps.length > 0));
  const capstone = nodes.length - 1;
  const path = dependencyPath(nodes, capstone);
  assert.ok(nodes.slice(0, 4).some((_, index) => path.has(index)));
  assert.ok(path.has(capstone));
});

test("signal readout stays on the A4 reference and hold centers it", () => {
  assert.equal(signalCents(0.5, 0.5, true), 0);
  assert.equal(signalReadout(0).label, "A4 · 440.0 Hz · IN TUNE");
  const flat = signalReadout(signalCents(0.5, 0.8, false));
  assert.ok(flat.frequency < 440);
  assert.match(flat.label, /A4 · \d+\.\d Hz · -[\d.]+ cents/);
  const sample = signalPoint(3, 20, -8, 0);
  assert.ok(sample.x > 0 && sample.x < 1);
  assert.ok(sample.y > 0 && sample.y < 1);
});

test("sensor returns stay inside an illustrative range and the beam can miss", () => {
  const samples = lidarLayout(20);
  assert.equal(samples.length, 20);
  for (const sample of samples) {
    assert.ok(sample.cm >= 40 && sample.cm <= 170);
    assert.ok(sample.x > 0 && sample.x < 1);
  }
  assert.equal(scanAngle(0) < scanAngle(1), true);
  assert.equal(beamHits(samples[0].angle, samples[0].angle), true);
  assert.equal(beamHits(0, Math.PI), false);
});
