import Image from "next/image";
import type { Piece } from "./content";
import { PieceIcon } from "./radial-wheel";
import { Arrow } from "../icons";

type Props = {
  entries: readonly Piece[];
  index: number;
  id: string;
  onPrevious: () => void;
  onNext: () => void;
};
export function DetailPanel({ entries, index, id, onPrevious, onNext }: Props) {
  const entry = entries[index];
  return (
    <div
      className="pieces-panel"
      id={id}
      role="region"
      aria-labelledby={`${id}-heading`}
    >
      <div className="pieces-panel-content">
        <div className="pieces-panel-top">
          <span
            className="pieces-panel-icon"
            style={{ backgroundColor: entry.color }}
          >
            <PieceIcon path={entry.icon} />
          </span>
          <span>{entry.label}</span>
          <span className="pieces-count">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(entries.length).padStart(2, "0")}
          </span>
        </div>
        <div className="pieces-stories">
          {/* Hidden stories reserve intrinsic height without measuring or clipping text. */}
          {entries.map((story, storyIndex) => {
            const visible = storyIndex === index;
            return (
              <div
                key={story.id}
                className={visible ? "pieces-answer" : "pieces-answer-reserved"}
                aria-hidden={visible ? undefined : true}
                inert={!visible}
              >
                <h3 id={visible ? `${id}-heading` : undefined}>
                  {story.question}
                </h3>
                <p>{story.answer}</p>
                {story.image && (
                  <Image
                    className="pieces-photo"
                    {...story.image}
                    sizes="(max-width: 760px) 90vw, 380px"
                    alt={story.image.alt}
                  />
                )}
              </div>
            );
          })}
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
