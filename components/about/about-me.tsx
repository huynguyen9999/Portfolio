"use client";

import { useId, useState } from "react";
import { pieces } from "./content";
import { RadialWheel } from "./radial-wheel";
import { DetailPanel } from "./detail-panel";
import "./about-me.css";

export function AboutMe() {
  const [selected, setSelected] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const panelId = useId();
  const active = preview ?? selected;
  function select(index: number) {
    if (index !== selected) {
      setAnnouncement(
        `${pieces[index].label}. Story ${index + 1} of ${pieces.length}.`,
      );
    }
    setSelected(index);
    setPreview(null);
  }
  return (
    <section
      id="about"
      className="pieces-section"
      aria-labelledby="about-heading"
      onFocusCapture={() => setPreview(null)}
    >
      <div className="pieces-intro">
        <h2 id="about-heading">About me</h2>
      </div>
      <RadialWheel
        entries={pieces}
        active={active}
        selected={selected}
        panelId={panelId}
        onPreview={setPreview}
        onSelect={select}
      />
      <DetailPanel
        entries={pieces}
        index={active}
        id={panelId}
        onPrevious={() =>
          select((selected + pieces.length - 1) % pieces.length)
        }
        onNext={() => select((selected + 1) % pieces.length)}
      />
      <p
        className="pieces-announcement"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </p>
      <noscript>
        <style>{`#about .pieces-wheel-wrap, #about .pieces-panel { display: none; } #about > noscript { grid-column: 1 / -1; }`}</style>
        <div className="pieces-fallback">
          {pieces.map((entry, index) => (
            <details key={entry.id} open={index === 0}>
              <summary>{entry.label}</summary>
              <h3>{entry.question}</h3>
              <p>{entry.answer}</p>
            </details>
          ))}
        </div>
      </noscript>
    </section>
  );
}
