"use client";

import { useId, useState } from "react";
import { pieces } from "./content";
import { RadialWheel } from "./radial-wheel";
import { DetailPanel } from "./detail-panel";
import "./about-me.css";

export function AboutMe() {
  const [selected, setSelected] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const panelId = useId();
  const active = preview ?? selected;
  function select(index: number) {
    setSelected(index);
    setPreview(null);
  }
  return (
    <section
      id="about"
      className="pieces-section"
      aria-labelledby="about-heading"
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
        entry={pieces[active]}
        index={active}
        total={pieces.length}
        id={panelId}
        onPrevious={() => select((active + pieces.length - 1) % pieces.length)}
        onNext={() => select((active + 1) % pieces.length)}
      />
    </section>
  );
}
