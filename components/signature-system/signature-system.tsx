"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/icons";
import { SignatureCanvas } from "./canvas";
import type { StageName } from "./interpolation";
import { usePointer } from "./use-pointer";

const COPY: Record<StageName, string> = {
  graph: "I model complex relationships.",
  signal: "I turn noisy data into information.",
  lidar: "I connect software to the physical world.",
};

const LINKS: Record<StageName, { href: string; label: string }> = {
  graph: { href: "/projects/igauchoback", label: "Built for iGauchoBack" },
  signal: { href: "/projects/guitar-tuner", label: "Explore the tuner" },
  lidar: { href: "/projects/lidar", label: "See the LiDAR system" },
};

const STAGES: { name: StageName; label: string; value: number }[] = [
  { name: "graph", label: "Graph", value: 0.06 },
  { name: "signal", label: "Signal", value: 0.5 },
  { name: "lidar", label: "Sensor", value: 0.94 },
];

export function SignatureSystem() {
  const frame = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLParagraphElement>(null);
  const sensorReadoutRef = useRef<HTMLParagraphElement>(null);
  const pinRef = useRef<number | null>(null);
  const pinEpoch = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [stage, setStage] = useState<StageName>("graph");
  const [revealed, setRevealed] = useState(false);
  const [pinTick, setPinTick] = useState(0);
  const controlRef = useRef(false);
  const stageRef = useRef<StageName>("graph");
  const announced = useRef(false);
  const dwell = useRef(0);
  const pointer = usePointer(frame, reducedMotion);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReducedMotion(media.matches);
      if (media.matches) setRevealed(true);
    };
    apply();
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      window.clearTimeout(dwell.current);
    };
  }, []);

  const onStage = useCallback(
    (next: StageName) => {
      if (announced.current && stageRef.current === next) return;
      announced.current = true;
      stageRef.current = next;
      setStage(next);
      window.clearTimeout(dwell.current);
      if (reducedMotion || controlRef.current) {
        setRevealed(true);
        return;
      }
      setRevealed(false);
      dwell.current = window.setTimeout(() => setRevealed(true), 650);
    },
    [reducedMotion],
  );

  const onRelease = useCallback(() => {
    controlRef.current = false;
  }, []);

  const choose = (next: (typeof STAGES)[number]) => {
    window.clearTimeout(dwell.current);
    controlRef.current = true;
    stageRef.current = next.name;
    pinRef.current = next.value;
    pinEpoch.current += 1;
    setPinTick((count) => count + 1);
    setStage(next.name);
    setRevealed(true);
  };

  return (
    <section
      className="signature"
      aria-labelledby="signature-heading"
      data-reduced={reducedMotion ? "true" : "false"}
      data-stage={stage}
    >
      <div className="signature-copy">
        <h2 id="signature-heading" className="signature-kicker">
          Graph, signal, sensor
        </h2>
        <p aria-live="polite">{COPY[stage]}</p>
        <p className="signature-note">
          The same points move from a prerequisite graph, into a waveform, then
          into a scanning distance field. The waveform and distances are
          illustrative, not a live recording or a sensor log. Sensor mode sweeps
          an illustrative 180° field and shows a 100 cm proximity indicator.
        </p>
      </div>
      <div className="signature-stage">
        <div ref={frame}>
          <SignatureCanvas
            pointer={pointer}
            pinRef={pinRef}
            pinEpoch={pinEpoch}
            pinTick={pinTick}
            reducedMotion={reducedMotion}
            onStage={onStage}
            onRelease={onRelease}
            readoutRef={readoutRef}
            sensorReadoutRef={sensorReadoutRef}
          />
        </div>
      </div>
      <div className="signature-meta">
        <p className="signature-readout" ref={readoutRef} aria-live="off" />
        <p
          className="signature-sensor-readout"
          ref={sensorReadoutRef}
          aria-live="off"
        />
        {revealed && (
          <Link className="signature-link" href={LINKS[stage].href}>
            {LINKS[stage].label} <Arrow />
          </Link>
        )}
      </div>
      <div
        className="signature-controls"
        role="radiogroup"
        aria-label="Visualization state"
      >
        {STAGES.map((item, index) => (
          <button
            key={item.name}
            type="button"
            role="radio"
            aria-checked={stage === item.name}
            tabIndex={stage === item.name ? 0 : -1}
            onClick={() => choose(item)}
            onKeyDown={(event) => {
              const forward =
                event.key === "ArrowRight" || event.key === "ArrowDown";
              const backward =
                event.key === "ArrowLeft" || event.key === "ArrowUp";
              if (!forward && !backward) return;
              event.preventDefault();
              const nextIndex =
                (index + (forward ? 1 : -1) + STAGES.length) % STAGES.length;
              choose(STAGES[nextIndex]);
              event.currentTarget.parentElement
                ?.querySelectorAll<HTMLButtonElement>("button")
                [nextIndex]?.focus();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
