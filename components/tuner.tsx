"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { frequencyFromCents, pitchStatus, waveformPath } from "@/lib/tuner";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function Tuner() {
  const [cents, setCents] = useState(0);
  // Keep controls inert until hydration; failed script downloads must not leave
  // a movable slider beside a frequency reading that never updates.
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const id = useId();
  const frequency = frequencyFromCents(cents);
  const signedCents = `${cents > 0 ? "+" : ""}${cents}`;
  return (
    <div className="tuner">
      <noscript>
        <p className="visual-caption">
          JavaScript is unavailable. This is a static 440 Hz reference; enable
          JavaScript to adjust the pitch.
        </p>
      </noscript>
      <div className="visual-topline">
        <span>Explore the tuner</span>
        <span className="signal-label">
          <span /> A4 reference
        </span>
      </div>
      <div className="tuner-readout">
        <span className="note">
          A<span>4</span>
        </span>
        <div>
          <output htmlFor={id} className="frequency">
            {frequency.toFixed(1)} <span>Hz</span>
          </output>
          <p className="tuner-status">
            {pitchStatus(cents)} <span>· {signedCents} cents</span>
          </p>
        </div>
      </div>
      <svg className="waveform" viewBox="0 0 440 88" aria-hidden="true">
        <path
          d="M0 44h440M220 0v88"
          stroke="currentColor"
          opacity=".15"
          strokeDasharray="3 4"
        />
        <path
          d={waveformPath(cents)}
          stroke="currentColor"
          strokeWidth="1.75"
          fill="none"
        />
      </svg>
      <div className="tuner-control">
        <label htmlFor={id}>
          {ready ? "Adjust pitch" : "Pitch control requires JavaScript"}
        </label>
        <button type="button" disabled={!ready} onClick={() => setCents(0)}>
          Reset <span aria-hidden="true">↺</span>
        </button>
      </div>
      <input
        id={id}
        type="range"
        disabled={!ready}
        min={-50}
        max={50}
        step={1}
        value={cents}
        onChange={(event) => setCents(Number(event.target.value))}
        aria-valuetext={`${signedCents} cents, ${frequency.toFixed(1)} hertz, ${pitchStatus(cents)}`}
        aria-describedby={`${id}-description`}
      />
      <div className="range-labels" aria-hidden="true">
        <span>−50 cents</span>
        <span>0</span>
        <span>+50 cents</span>
      </div>
      <p className="visual-caption" id={`${id}-description`}>
        Interactive concept demo · synthesized signal
      </p>
    </div>
  );
}
