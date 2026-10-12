"use client";

import { useRef } from "react";
import Link from "next/link";
import { Arrow } from "@/components/icons";
import { ProjectActions, ProjectShot } from "@/components/project-card";
import type { Project } from "@/lib/content";

type CarouselProject = Pick<Project, "slug" | "title" | "categoryTags" | "cardSummary" | "liveUrl" | "posterUrl" | "sourceUrl" | "image" | "imageAlt">;

export function ProjectCarousel({ projects }: { projects: CarouselProject[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function move(direction: "backward" | "forward") {
    const track = trackRef.current;
    if (!track) return;

    const distance = Math.max(track.clientWidth * 0.82, 280);
    track.scrollBy({
      left: direction === "forward" ? distance : -distance,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  return <div className="project-carousel">
    <div className="carousel-controls" aria-label="Browse projects">
      <button type="button" onClick={() => move("backward")} aria-label="Show previous projects"><Arrow direction="left" /></button>
      <button type="button" onClick={() => move("forward")} aria-label="Show more projects"><Arrow /></button>
    </div>
    <div className="carousel-track" ref={trackRef} aria-label="More projects" tabIndex={0}>
      {projects.map(project => <article className="featured-card" key={project.slug}>
        <ProjectShot project={project} />
        <div className="featured-copy">
          <ul className="featured-tags" aria-label={`${project.title} categories`}>{project.categoryTags.map(tag => <li key={tag}>{tag}</li>)}</ul>
          <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
          <p>{project.cardSummary}</p>
          <ProjectActions project={project} compact />
        </div>
      </article>)}
    </div>
  </div>;
}
