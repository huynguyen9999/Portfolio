import Image from "next/image";
import type { Piece } from "./content";
import { PieceIcon } from "./radial-wheel";
import { Arrow } from "../icons";

type Props = {
  entry: Piece;
  index: number;
  total: number;
  id: string;
  onPrevious: () => void;
  onNext: () => void;
};
export function DetailPanel({
  entry,
  index,
  total,
  id,
  onPrevious,
  onNext,
}: Props) {
  return (
    <div className="pieces-panel" id={id}>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pieces-panel-content"
      >
        <div className="pieces-panel-top">
          <span
            className="pieces-panel-icon"
            style={{ backgroundColor: entry.color }}
          >
            <PieceIcon path={entry.icon} />
          </span>
          <span>{entry.label}</span>
          <span className="pieces-count">
            {String(index + 1).padStart(2, "0")} / {total}
          </span>
        </div>
        <div key={entry.id} className="pieces-answer">
          <h3>{entry.question}</h3>
          <p>{entry.answer}</p>
          {entry.image && (
            <Image
              className="pieces-photo"
              {...entry.image}
              sizes="(max-width: 640px) 90vw, 320px"
              alt={entry.image.alt}
            />
          )}
        </div>
      </div>
      <div className="pieces-panel-bottom">
        <div>
          <button
            type="button"
            onClick={onPrevious}
            aria-label="Previous section"
          >
            <Arrow direction="left" />
          </button>
          <button type="button" onClick={onNext} aria-label="Next section">
            <Arrow />
          </button>
        </div>
      </div>
    </div>
  );
}
