/** A synthesized reference signal, independent of the original Python tuner. */
export function frequencyFromCents(cents) {
  return 440 * 2 ** (cents / 1200);
}

export function pitchStatus(cents) {
  return cents === 0 ? "Target pitch" : cents < 0 ? "Flat" : "Sharp";
}

export function waveformPath(cents) {
  const frequency = frequencyFromCents(cents);
  return Array.from({ length: 221 }, (_, i) => {
    const x = i * 2;
    const y = 44 - 29 * Math.sin(2 * Math.PI * frequency * (i / 220) * 0.012);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}
