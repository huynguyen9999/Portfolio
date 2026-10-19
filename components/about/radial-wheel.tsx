import { useId, type CSSProperties } from "react";
import type { Piece } from "./content";

export function PieceIcon({ path }: { path: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}
const SIZE = 520;
const CENTER = SIZE / 2;
const OUTER_RADIUS = 242;
const INNER_RADIUS = 100;
const LABEL_RADIUS = 174;
const ACTIVE_OFFSET = 6;

const point = (radius: number, degrees: number) => {
  const radians = (degrees * Math.PI) / 180;
  // Fixed precision keeps server and browser trigonometry identical at hydration.
  return [
    CENTER + radius * Math.cos(radians),
    CENTER + radius * Math.sin(radians),
  ].map((value) => Number(value.toFixed(3)));
};
function wedge(start: number, end: number) {
  return `M ${point(OUTER_RADIUS, start)} A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${point(OUTER_RADIUS, end)} L ${point(INNER_RADIUS, end)} A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 0 ${point(INNER_RADIUS, start)} Z`;
}

type Props = {
  entries: readonly Piece[];
  active: number;
  selected: number;
  panelId: string;
  onPreview: (index: number | null) => void;
  onSelect: (index: number) => void;
};
export function RadialWheel({
  entries,
  active,
  selected,
  panelId,
  onPreview,
  onSelect,
}: Props) {
  const titleId = useId();
  const helpId = useId();
  const segmentAngle = 360 / entries.length;
  return (
    <div className="pieces-wheel-wrap">
      <p className="pieces-kicker">Get to know Huy</p>
      <svg
        className="pieces-wheel"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="radiogroup"
        aria-labelledby={titleId}
        aria-describedby={helpId}
        onPointerLeave={() => onPreview(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            onPreview(null);
        }}
      >
        <title id={titleId}>{`${entries.length} pieces of me`}</title>
        <desc id={helpId}>
          Choose a story. Use arrow keys to change the selection, or tap a
          section. Mouse hover previews a story; clicking keeps it.
        </desc>
        {entries.map((entry, index) => {
          const angle = -90 + index * segmentAngle;
          const [x, y] = point(LABEL_RADIUS, angle);
          const [dx, dy] = point(ACTIVE_OFFSET, angle);
          const path = wedge(
            angle - segmentAngle / 2,
            angle + segmentAngle / 2,
          );
          const isActive = active === index;
          return (
            <g
              key={entry.id}
              role="radio"
              tabIndex={selected === index ? 0 : -1}
              aria-label={entry.label}
              aria-checked={selected === index}
              aria-controls={panelId}
              className={`pieces-segment${isActive ? " is-active" : ""}`}
              style={
                {
                  "--piece-color": entry.color,
                  "--piece-x": `${dx - CENTER}px`,
                  "--piece-y": `${dy - CENTER}px`,
                } as CSSProperties
              }
              // Focus-driven scrolling can fire pointerenter under a stationary mouse.
              // Preview only actual pointer movement so it cannot override keyboard focus.
              onPointerMove={(event) => {
                if (
                  active !== index &&
                  event.pointerType !== "touch" &&
                  window.matchMedia("(any-hover: hover)").matches
                ) {
                  onPreview(index);
                }
              }}
              onClick={() => onSelect(index)}
              onKeyDown={(event) => {
                const forward =
                  event.key === "ArrowRight" || event.key === "ArrowDown";
                const backward =
                  event.key === "ArrowLeft" || event.key === "ArrowUp";
                if (forward || backward) {
                  event.preventDefault();
                  const next =
                    (index + (forward ? 1 : -1) + entries.length) %
                    entries.length;
                  onSelect(next);
                  event.currentTarget.parentElement
                    ?.querySelectorAll<SVGGElement>('[role="radio"]')
                    [next]?.focus();
                  return;
                }
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(index);
                }
              }}
            >
              <path className="pieces-hit-area" d={path} aria-hidden="true" />
              <g className="pieces-segment-art" aria-hidden="true">
                <path className="pieces-wedge" d={path} />
                <g
                  transform={`translate(${x - 14} ${y - 35}) scale(${28 / 22})`}
                >
                  <PieceIcon path={entry.icon} />
                </g>
                <text
                  className="pieces-label"
                  x={x}
                  y={y + 12}
                  textAnchor="middle"
                >
                  {entry.shortLabel.map((line, i) => (
                    <tspan key={line} x={x} dy={i ? 21 : 0}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            </g>
          );
        })}
        <g className="pieces-center" aria-hidden="true">
          <text
            x={CENTER}
            y={CENTER - 8}
            className="pieces-number"
            textAnchor="middle"
          >
            {entries.length}
          </text>
          <text
            className="pieces-center-copy"
            x={CENTER}
            y={CENTER + 22}
            textAnchor="middle"
          >
            Pieces
            <tspan x={CENTER} dy="22">
              of Me
            </tspan>
          </text>
        </g>
      </svg>
    </div>
  );
}
