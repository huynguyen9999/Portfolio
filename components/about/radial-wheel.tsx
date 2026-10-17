import { useId, type CSSProperties } from 'react';
import type { Piece } from './content';

export function PieceIcon({ path }: { path: string }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg>;
}
const point = (radius: number, degrees: number) => {
  const radians = degrees * Math.PI / 180;
  // Fixed precision keeps server and browser trigonometry identical at hydration.
  return [260 + radius * Math.cos(radians), 260 + radius * Math.sin(radians)].map(value => Number(value.toFixed(3)));
};
function wedge(start: number, end: number) {
  return `M ${point(242, start)} A 242 242 0 0 1 ${point(242, end)} L ${point(100, end)} A 100 100 0 0 0 ${point(100, start)} Z`;
}

type Props = { entries: readonly Piece[]; active: number; selected: number; panelId: string; onPreview: (index: number | null) => void; onSelect: (index: number) => void };
export function RadialWheel({ entries, active, selected, panelId, onPreview, onSelect }: Props) {
  const titleId = useId();
  const helpId = useId();
  return <div className="pieces-wheel-wrap">
    <p className="pieces-kicker">Get to know Huy</p>
    <svg className="pieces-wheel" viewBox="0 0 520 520" role="group" aria-labelledby={titleId} aria-describedby={helpId} onPointerLeave={() => onPreview(null)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) onPreview(null); }}>
      <title id={titleId}>12 pieces of me</title>
      <desc id={helpId}>Explore each section. Hover to preview, click to keep a selection. Use Tab to focus a section and Enter or Space to select.</desc>
      {entries.map((entry, index) => {
        const angle = -90 + index * 30;
        const [x, y] = point(174, angle);
        const [dx, dy] = point(8, angle);
        const isActive = active === index;
        return <g key={entry.id} role="button" tabIndex={0} aria-label={entry.label} aria-pressed={selected === index} aria-controls={panelId}
          className={`pieces-segment${isActive ? ' is-active' : ''}`}
          style={{ '--piece-color': entry.color, '--piece-x': `${dx - 260}px`, '--piece-y': `${dy - 260}px` } as CSSProperties}
          onPointerEnter={event => { if (event.pointerType !== 'touch') onPreview(index); }} onFocus={() => onPreview(index)} onClick={() => onSelect(index)}
          onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(index); } }}>
          <path className="pieces-hit-area" d={wedge(angle - 15, angle + 15)} />
          <g className="pieces-segment-art">
            <path className="pieces-wedge" d={wedge(angle - 15, angle + 15)} />
            <g transform={`translate(${x - 11} ${y - 25})`}><PieceIcon path={entry.icon} /></g>
            <text className="pieces-label" x={x} y={y + 12} textAnchor="middle">{entry.shortLabel.map((line, i) => <tspan key={line} x={x} dy={i ? 13 : 0}>{line}</tspan>)}</text>
          </g>
        </g>;
      })}
      <g className="pieces-center" aria-hidden="true"><text x="260" y="263" className="pieces-pi" textAnchor="middle">π</text><text x="260" y="291" textAnchor="middle">12 Pieces<tspan x="260" dy="18">of Me</tspan></text></g>
    </svg>
  </div>;
}
