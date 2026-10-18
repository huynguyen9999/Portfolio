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
const ACTIVE_OFFSET = 8;

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
        role="group"
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
          Explore each section. Hover to preview, click to keep a selection. Use
          Tab to focus a section and Enter or Space to select.
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
              role="button"
              tabIndex={0}
              aria-label={entry.label}
              aria-pressed={selected === index}
              aria-controls={panelId}
              className={`pieces-segment${isActive ? " is-active" : ""}`}
              style={
                {
                  "--piece-color": entry.color,
                  "--piece-x": `${dx - CENTER}px`,
                  "--piece-y": `${dy - CENTER}px`,
                } as CSSProperties
              }
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") onPreview(index);
              }}
              onFocus={() => onPreview(index)}
              onClick={() => onSelect(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(index);
                }
              }}
            >
              <path className="pieces-hit-area" d={path} />
              <g className="pieces-segment-art">
                <path className="pieces-wedge" d={path} />
                <g transform={`translate(${x - 11} ${y - 25})`}>
                  <PieceIcon path={entry.icon} />
                </g>
                <text
                  className="pieces-label"
                  x={x}
                  y={y + 12}
                  textAnchor="middle"
                >
                  {entry.shortLabel.map((line, i) => (
                    <tspan key={line} x={x} dy={i ? 13 : 0}>
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
            y={CENTER + 3}
            className="pieces-pi"
            textAnchor="middle"
          >
            π
          </text>
          <text x={CENTER} y={CENTER + 31} textAnchor="middle">
            {`${entries.length} Pieces`}
            <tspan x={CENTER} dy="18">
              of Me
            </tspan>
          </text>
        </g>
      </svg>
    </div>
  );
}
