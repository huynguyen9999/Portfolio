import test from "node:test";
import assert from "node:assert/strict";
import { frequencyFromCents, pitchStatus, waveformPath } from "../lib/tuner.mjs";

test("A4 reference and equal temperament endpoints", () => {
  assert.equal(frequencyFromCents(0), 440);
  assert.ok(Math.abs(frequencyFromCents(-50) - 427.474054) < 0.000001);
  assert.ok(Math.abs(frequencyFromCents(50) - 452.892984) < 0.000001);
  assert.equal(frequencyFromCents(1200), 880);
});
test("pitch feedback distinguishes flat, target, and sharp", () => {
  assert.equal(pitchStatus(-1), "Flat");
  assert.equal(pitchStatus(0), "Target pitch");
  assert.equal(pitchStatus(1), "Sharp");
});
test("waveform responds to the selected frequency without invalid coordinates", () => {
  assert.notEqual(waveformPath(-50), waveformPath(50));
  for (const cents of [-50, 0, 50]) {
    assert.ok(waveformPath(cents).startsWith("M0.0 44.0"));
    assert.ok(!/NaN|Infinity/.test(waveformPath(cents)));
  }
});
