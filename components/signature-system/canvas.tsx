"use client";

import { useEffect, useRef, type RefObject } from "react";
import { dependencyPath, graphLayout } from "./graph-state";
import { lidarLayout, proximityHits, scanAngle, sweepAngle } from "./lidar-state";
import { dominantStage, mixPosition, springStep, stageWeights, type StageName, type Vec2 } from "./interpolation";
import { signalCents, signalPoint, signalReadout } from "./signal-state";
import type { PointerSample } from "./use-pointer";

const NODES = graphLayout();
const RETURNS = lidarLayout(NODES.length);
const FLOW_COUNT = 10;
const CUBE = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
] as const;

type Particle = { graph: Vec2; deps: number[]; current: Vec2; velocity: Vec2; energy: number };

function toPixel(point: Vec2, width: number, height: number, padX: number, padY: number): Vec2 {
  return { x: padX + point.x * (width - padX * 2), y: padY + point.y * (height - padY * 2) };
}

function cubePoint(index: number, width: number, height: number): Vec2 {
  const corner = CUBE[index % CUBE.length];
  const scale = Math.min(width, height) * 0.14;
  if (index >= CUBE.length) return { x: width / 2 + ((index % 5) - 2) * 7, y: height / 2 + ((index % 3) - 1) * 7 };
  return { x: width / 2 + (corner[0] + corner[2] * 0.45) * scale, y: height / 2 + (corner[1] - corner[2] * 0.32) * scale };
}

function drawSensorLed(context: CanvasRenderingContext2D, width: number, lit: boolean, opacity: number) {
  const x = width - 118;
  const y = 18;
  context.globalAlpha = opacity;
  context.fillStyle = "#e8ece9";
  context.fillRect(x, y, 100, 29);
  context.fillStyle = lit ? "#d48b2a" : "#9aa3a3";
  if (lit) {
    context.shadowColor = "#d48b2a";
    context.shadowBlur = 12;
  }
  context.beginPath();
  context.arc(x + 14, y + 14.5, 6, 0, Math.PI * 2);
  context.fill();
  context.shadowBlur = 0;
  context.fillStyle = "#42515a";
  context.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText(lit ? "LED · 100 CM" : "LED · CLEAR", x + 27, y + 17.5);
}

export function SignatureCanvas({
  pointer,
  pinRef,
  pinEpoch,
  pinTick,
  reducedMotion,
  onStage,
  onRelease,
  readoutRef,
  sensorReadoutRef,
}: {
  pointer: RefObject<PointerSample>;
  pinRef: RefObject<number | null>;
  pinEpoch: RefObject<number>;
  pinTick: number;
  reducedMotion: boolean;
  onStage: (stage: StageName) => void;
  onRelease: () => void;
  readoutRef: RefObject<HTMLParagraphElement | null>;
  sensorReadoutRef: RefObject<HTMLParagraphElement | null>;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<((now: number) => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const context = canvas.getContext("2d");
    if (!context) {
      host.dataset.canvas = "unavailable";
      return;
    }
    host.dataset.canvas = "ready";
    const particles: Particle[] = NODES.map(node => ({
      graph: { x: node.x, y: node.y },
      deps: node.deps,
      current: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      energy: 0,
    }));
    const graphEdges = particles.flatMap((particle, index) => particle.deps.map(dep => ({ from: index, to: dep })));
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = performance.now();
    let hover = -1;
    let highlighted = new Set<number>();
    let seenStage: StageName | null = null;
    let seenEpoch = pinEpoch.current;
    let holdX = pointer.current.clientX;
    let holdY = pointer.current.clientY;
    let pulse = 0;
    let pulseEdge = 0;
    let cubeUntil = 0;
    let sensorSweepStartedAt = performance.now();
    const history: { stage: StageName; at: number }[] = [];
    let visible = true;
    const colors = getComputedStyle(document.documentElement);
    const ink = colors.getPropertyValue("--ink").trim() || "#292e2f";
    const accent = colors.getPropertyValue("--accent").trim() || "#42698b";
    const muted = colors.getPropertyValue("--muted").trim() || "#676d6e";

    let paint: ((now: number) => void) | null = null;
    const resize = () => {
      const rect = host.getBoundingClientRect();
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (particles[0].current.x === 0 && particles[0].current.y === 0) {
        for (const particle of particles) {
          const placed = toPixel(particle.graph, width, height, width * 0.1, height * 0.14);
          particle.current.x = placed.x;
          particle.current.y = placed.y;
        }
      }
      paint?.(performance.now());
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const intersection = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); }, { threshold: 0.05 });
    intersection.observe(host);

    const scrollBias = () => {
      const rect = host.getBoundingClientRect();
      if (rect.top >= 0) return 0;
      return Math.min(1, -rect.top / Math.max(1, rect.height * 0.7));
    };

    const draw = (now: number) => {
      const dt = Math.min(40, now - last);
      last = now;
      pulse += dt;
      if (pulse > 4200) {
        pulse = 0;
        pulseEdge = (pulseEdge + 3) % NODES.length;
      }
      const sample = pointer.current;
      if (pinEpoch.current !== seenEpoch) {
        seenEpoch = pinEpoch.current;
        holdX = sample.clientX;
        holdY = sample.clientY;
      }
      const pointerTravel = Math.hypot(sample.clientX - holdX, sample.clientY - holdY);
      if (pinRef.current !== null && pointerTravel > 18) {
        pinRef.current = null;
        onRelease();
      }
      let stage = pinRef.current ?? sample.stage;
      // An explicit control selection must keep its matching project link.
      if (!reducedMotion && pinRef.current === null) stage *= 1 - scrollBias();
      const weights = stageWeights(stage);
      const mode = dominantStage(weights);
      if (mode !== seenStage) {
        seenStage = mode;
        if (mode === "lidar") sensorSweepStartedAt = now;
        onStage(mode);
      }
      const holding = sample.down && mode === "signal";
      const cents = signalCents(sample.x, sample.y, holding);
      const readout = signalReadout(cents);
      if (readoutRef.current) {
        readoutRef.current.textContent = weights.signal > 0.45 ? readout.label : "";
        readoutRef.current.dataset.cents = cents.toFixed(1);
      }
      if (history.at(-1)?.stage !== mode) {
        history.push({ stage: mode, at: now });
        if (history.length > 5) history.shift();
        const names = history.map(item => item.stage).join("-");
        const span = history.length === 5 ? history[4].at - history[0].at : Infinity;
        if (names === "graph-signal-lidar-signal-graph" && span < 2600) cubeUntil = now + 720;
      }
      const cubing = now < cubeUntil;
      const padX = width * 0.1;
      const padY = height * 0.14;
      const local = { x: sample.x * width, y: sample.y * height };
      hover = -1;
      if (!reducedMotion && weights.graph > 0.62 && sample.inside) {
        let nearest = 48;
        particles.forEach((particle, index) => {
          const placed = toPixel(particle.graph, width, height, padX, padY);
          const distance = Math.hypot(placed.x - local.x, placed.y - local.y);
          if (distance < nearest) {
            nearest = distance;
            hover = index;
          }
        });
      }
      highlighted = hover >= 0 ? dependencyPath(NODES, hover) : new Set();
      const beam = mode === "lidar" && weights.lidar > 0.55 ? sweepAngle(now - sensorSweepStartedAt) : scanAngle(sample.x);
      const closeReturns = proximityHits(beam, RETURNS);
      const ledOn = weights.lidar > 0.55 && closeReturns.length > 0;
      host.dataset.sensorLed = ledOn ? "on" : "off";
      if (sensorReadoutRef.current) {
        sensorReadoutRef.current.textContent = weights.lidar > 0.55
          ? `180° sweep · LED ${ledOn ? "on — object within 100 cm" : "off — field clear"}`
          : "";
      }

      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      if (weights.lidar > 0.08) {
        const origin = toPixel({ x: 0.5, y: 0.82 }, width, height, padX, padY);
        context.strokeStyle = accent;
        context.globalAlpha = weights.lidar * 0.28;
        for (const radius of [0.28, 0.46, 0.64]) {
          context.beginPath();
          context.arc(origin.x, origin.y, Math.min(width, height) * radius, Math.PI, Math.PI * 2);
          context.stroke();
        }
        context.globalAlpha = weights.lidar * 0.7;
        context.beginPath();
        context.moveTo(origin.x, origin.y);
        context.lineTo(origin.x + Math.cos(Math.PI - beam) * Math.min(width, height) * 0.46, origin.y - Math.sin(beam) * Math.min(width, height) * 0.42);
        context.stroke();
        if (!reducedMotion) {
          context.fillStyle = accent;
          for (let index = 0; index < 5; index++) {
            const along = (now * 0.00022 + index * 0.19) % 1;
            const distance = Math.min(width, height) * (0.1 + along * 0.36);
            context.globalAlpha = weights.lidar * (0.16 + along * 0.34);
            context.beginPath();
            context.arc(origin.x + Math.cos(Math.PI - beam) * distance, origin.y - Math.sin(beam) * distance * 0.9, 1.25 + along, 0, Math.PI * 2);
            context.fill();
          }
        }
        drawSensorLed(context, width, ledOn, weights.lidar);
        context.globalAlpha = 1;
      }

      context.globalAlpha = weights.graph * 0.45;
      context.strokeStyle = accent;
      particles.forEach((particle, index) => {
        const from = toPixel(particle.graph, width, height, padX, padY);
        for (const dep of particle.deps) {
          const parent = toPixel(particles[dep].graph, width, height, padX, padY);
          context.globalAlpha = (highlighted.size === 0 || (highlighted.has(index) && highlighted.has(dep)) ? 0.7 : 0.28) * weights.graph;
          context.beginPath();
          context.moveTo(from.x, from.y);
          context.lineTo(parent.x, parent.y);
          context.stroke();
        }
      });
      if (weights.graph > 0.4 && pulse < 900) {
        const traveler = NODES[pulseEdge];
        const dep = traveler.deps[0];
        if (dep !== undefined) {
          const along = pulse / 900;
          const from = toPixel(traveler, width, height, padX, padY);
          const parent = toPixel(NODES[dep], width, height, padX, padY);
          context.globalAlpha = 0.8;
          context.fillStyle = accent;
          context.beginPath();
          context.arc(parent.x + (from.x - parent.x) * along, parent.y + (from.y - parent.y) * along, 2.4, 0, Math.PI * 2);
          context.fill();
        }
      }
      if (!reducedMotion && weights.graph > 0.35) {
        context.fillStyle = accent;
        for (let index = 0; index < Math.min(FLOW_COUNT, graphEdges.length); index++) {
          const edge = graphEdges[(index * 3 + Math.floor(now / 1250)) % graphEdges.length];
          const destination = particles[edge.from];
          const source = particles[edge.to];
          const along = (now * 0.00024 + index * 0.17) % 1;
          const eased = along * along * (3 - 2 * along);
          const sourcePoint = toPixel(source.graph, width, height, padX, padY);
          const destinationPoint = toPixel(destination.graph, width, height, padX, padY);
          context.globalAlpha = weights.graph * (0.2 + Math.sin(along * Math.PI) * 0.42);
          context.beginPath();
          context.arc(sourcePoint.x + (destinationPoint.x - sourcePoint.x) * eased, sourcePoint.y + (destinationPoint.y - sourcePoint.y) * eased, 1.3 + Math.sin(along * Math.PI) * 1.1, 0, Math.PI * 2);
          context.fill();
        }
      }
      context.globalAlpha = 1;

      particles.forEach((particle, index) => {
        const signal = signalPoint(index, particles.length, cents, now * 0.0015);
        const lidar = RETURNS[index];
        let target = mixPosition(
          toPixel(particle.graph, width, height, padX, padY),
          toPixel(signal, width, height, padX, padY),
          toPixel(lidar, width, height, padX, padY),
          weights,
        );
        if (cubing) target = cubePoint(index, width, height);
        if (!cubing && weights.graph > 0.55) {
          const idle = Math.sin(now * 0.0007 + index) * 1.6 * weights.graph;
          target = { x: target.x + idle, y: target.y + Math.cos(now * 0.0005 + index) * 1.2 * weights.graph };
          const placed = toPixel(particle.graph, width, height, padX, padY);
          const distance = Math.hypot(placed.x - local.x, placed.y - local.y);
          if (sample.inside && distance < 92) {
            const pull = (1 - distance / 92) * 9 * weights.graph;
            target = { x: target.x + (local.x - placed.x) / Math.max(1, distance) * pull, y: target.y + (local.y - placed.y) / Math.max(1, distance) * pull };
          }
        }
        if (highlighted.has(index)) particle.energy = Math.min(1, particle.energy + dt * 0.01);
        else particle.energy = Math.max(0, particle.energy - dt * 0.004);
        if (reducedMotion) {
          particle.current.x = target.x;
          particle.current.y = target.y;
          particle.velocity.x = 0;
          particle.velocity.y = 0;
        } else springStep(particle.current, particle.velocity, target, dt);
        const hit = weights.lidar > 0.55 && closeReturns.some(sample => sample.angle === lidar.angle);
        context.fillStyle = highlighted.has(index) || hit ? accent : ink;
        context.globalAlpha = 0.9;
        context.beginPath();
        context.arc(particle.current.x, particle.current.y, 3.1 + particle.energy * 1.8 + (hit ? 1.4 : 0), 0, Math.PI * 2);
        context.fill();
        if (hit && (lidar.movement || index === 4)) {
          context.globalAlpha = weights.lidar;
          context.fillStyle = muted;
          context.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
          context.fillText(lidar.movement ? "movement" : `${lidar.cm} cm`, particle.current.x + 8, particle.current.y - 8);
        }
      });
      context.globalAlpha = 1;
    };
    paint = draw;
    drawRef.current = draw;

    if (reducedMotion) {
      draw(performance.now());
      return () => {
        resizeObserver.disconnect();
        intersection.disconnect();
      };
    }

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible) return;
      draw(now);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
    };
  }, [onRelease, onStage, pinEpoch, pinRef, pointer, readoutRef, reducedMotion, sensorReadoutRef]);

  useEffect(() => {
    if (!reducedMotion) return;
    drawRef.current?.(performance.now());
  }, [pinTick, reducedMotion]);

  return <div className="signature-frame" ref={hostRef} data-signature-canvas=""><canvas ref={canvasRef} aria-hidden="true" /></div>;
}
