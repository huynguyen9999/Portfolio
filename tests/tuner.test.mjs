import test from "node:test";
import assert from "node:assert/strict";
import { frequencyFromCents, pitchStatus, waveformPath } from "../lib/tuner.ts";

test("A4 reference and equal temperament endpoints", () => {
  assert.equal(frequencyFromCents(0), 440);
  assert.ok(Math.abs(frequencyFromCents(-50) - 427.474054) < 0.000001);
  assert.ok(Math.abs(frequencyFromCents(50) - 452.892984) < 0.000001);
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

test("every slider step is monotonic, symmetric in cents, and has a bounded waveform", () => {
  let previous = 0;
  for (let cents = -50; cents <= 50; cents++) {
    const frequency = frequencyFromCents(cents);
    assert.ok(frequency > previous);
    assert.ok(
      Math.abs(frequency * frequencyFromCents(-cents) - 440 ** 2) < 1e-8,
    );
    previous = frequency;
    const points = [...waveformPath(cents).matchAll(/[ML]([\d.]+) ([\d.]+)/g)];
    assert.equal(points.length, 221);
    for (const [, x, y] of points) {
      assert.ok(Number(x) >= 0 && Number(x) <= 440);
      assert.ok(Number(y) >= 15 && Number(y) <= 73);
    }
  }
});

test("invalid and out-of-range pitch fails explicitly instead of rendering NaN", () => {
  for (const value of [
    NaN,
    Infinity,
    -Infinity,
    -51,
    51,
    undefined,
    null,
    "0",
  ]) {
    for (const fn of [frequencyFromCents, pitchStatus, waveformPath]) {
      assert.throws(() => fn(value), RangeError);
    }
  }
  assert.equal(pitchStatus(-0), "Target pitch");
  assert.equal(pitchStatus(0.5), "Sharp");
});
