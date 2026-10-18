"use client";

import { useId, useState } from "react";
import {
  directRelationships,
  nodeById,
  relatedNodeIds,
  roadmapEdges,
  roadmapNodes,
} from "./igauchoback-roadmap-state";

const COLUMNS = [
  "Foundations",
  "Circuit core",
  "Digital systems",
  "Advanced core",
  "Systems",
  "Capstone",
  "Outcomes",
];

export function IGauchoBackRoadmap() {
  const [selectedId, setSelectedId] = useState<string | null>("ece-10c");
  const markerId = useId();
  const titleId = useId();
  const selected = selectedId ? nodeById(selectedId) : undefined;
  const related = selectedId ? relatedNodeIds(selectedId) : new Set<string>();
  const relationships = selectedId
    ? directRelationships(selectedId)
    : { prerequisites: [], next: [] };
  return (
    <section
      className="roadmap-explorer"
      aria-labelledby={titleId}
      onKeyDown={(event) => {
        if (event.key === "Escape") setSelectedId(null);
      }}
    >
      <div className="roadmap-explorer-heading">
        <div>
          <p className="eyebrow">Interactive roadmap concept</p>
          <h2 id={titleId}>UCSB Electrical Engineering</h2>
        </div>
        <p>
          Representative course relationships · {roadmapNodes.length} nodes /{" "}
          {roadmapEdges.length} edges shown
        </p>
      </div>
      <div className="roadmap-legend" aria-label="Roadmap legend">
        <span>
          <i className="roadmap-key prerequisite" aria-hidden="true" />{" "}
          Prerequisite
        </span>
        <span>
          <i className="roadmap-key recommended" aria-hidden="true" />{" "}
          Recommended
        </span>
        <span>
          <i className="roadmap-key outcome" aria-hidden="true" /> Leads to
        </span>
      </div>
      <div
        className="roadmap-scroll"
        role="region"
        aria-label="Representative electrical engineering course roadmap"
      >
        <div className="roadmap-grid" data-selected={selectedId ?? ""}>
          <svg
            className="roadmap-edges"
            viewBox="0 0 1416 370"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <marker
                id={markerId}
                markerWidth="7"
                markerHeight="7"
                refX="6"
                refY="3.5"
                orient="auto"
              >
                <path d="M0,0 L7,3.5 L0,7 Z" />
              </marker>
            </defs>
            {roadmapEdges.map((edge) => {
              const from = nodeById(edge.from)!;
              const to = nodeById(edge.to)!;
              const relatedEdge =
                !selectedId || (related.has(edge.from) && related.has(edge.to));
              const startX = 108 + from.column * 200;
              const endX = 108 + to.column * 200;
              const startY = 96 + from.row * 110;
              const endY = 96 + to.row * 110;
              const bend = Math.max(26, (endX - startX) * 0.45);
              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  className={`roadmap-edge ${edge.kind} ${relatedEdge ? "is-related" : ""}`}
                  d={`M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`}
                  markerEnd={`url(#${markerId})`}
                />
              );
            })}
          </svg>
          {COLUMNS.map((column, index) => (
            <p
              key={column}
              className="roadmap-column"
              style={{ gridColumn: index + 1 }}
            >
              {column}
            </p>
          ))}
          {roadmapNodes.map((node) => {
            const isSelected = node.id === selectedId;
            const isRelated = !selectedId || related.has(node.id);
            const label = `${node.code}, ${node.title}${node.units ? `, ${node.units}` : ""}`;
            return (
              <button
                key={node.id}
                type="button"
                className={`roadmap-node ${node.kind === "career" ? "roadmap-career" : ""} ${isRelated ? "is-related" : "is-muted"}`}
                style={{ gridColumn: node.column + 1, gridRow: node.row + 2 }}
                aria-pressed={isSelected}
                aria-label={label}
                onClick={() => setSelectedId(node.id)}
              >
                <span className="roadmap-node-code">
                  {node.code}
                  {node.units && <small>{node.units}</small>}
                </span>
                <strong>{node.title}</strong>
                {node.kind !== "career" && (
                  <span className="roadmap-node-dot" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div
        className="roadmap-inspector"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {selected ? (
          <>
            <div>
              <p className="eyebrow">Selected course</p>
              <h3>
                {selected.code} · {selected.title}
              </h3>
              <p>{selected.description}</p>
            </div>
            <dl>
              <div>
                <dt>
                  {relationships.prerequisites.length
                    ? "Comes after"
                    : "Entry point"}
                </dt>
                <dd>
                  {relationships.prerequisites.length
                    ? relationships.prerequisites
                        .map((item) => item.code)
                        .join(", ")
                    : "No prerequisite shown"}
                </dd>
              </div>
              <div>
                <dt>
                  {relationships.next.length ? "Connects to" : "Endpoint"}
                </dt>
                <dd>
                  {relationships.next.length
                    ? relationships.next.map((item) => item.code).join(", ")
                    : "No later relationship shown"}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              className="roadmap-clear"
              onClick={() => setSelectedId(null)}
            >
              Clear selection <span aria-hidden="true">×</span>
            </button>
          </>
        ) : (
          <p>
            Select a course or outcome to focus its prerequisite path and
            connected options.
          </p>
        )}
      </div>
      <p className="roadmap-note">
        Interactive concept demo · representative UCSB EE course relationships,
        not an official degree audit.{" "}
        <a
          href="https://igauchoback.vercel.app/roadmap/ucsb/electrical-engineering"
          target="_blank"
          rel="noreferrer"
        >
          Try the live roadmap <span aria-hidden="true">↗</span>
        </a>
      </p>
    </section>
  );
}
