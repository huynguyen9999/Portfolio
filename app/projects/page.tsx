import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/content";
import { ProjectActions, ProjectShot } from "@/components/featured-work";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore Huy Nguyen’s software, embedded systems, and signal-processing projects, with engineering details, live sites, and source code.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return <main id="main" className="wrap project-library">
    <Link className="back-link" href="/">← Back to home</Link>
    <header className="library-header"><p className="eyebrow">The project library · {projects.length} projects</p><h1>Things I’ve built.</h1><p>Software, signals, and physical systems. Explore the work, how it came together, and where you can try it.</p></header>
    <div className="library-grid">{projects.map(project => <article className="featured-card" key={project.slug}>
      <ProjectShot project={project} />
      <div className="featured-copy"><ul className="featured-tags" aria-label={`${project.title} categories`}>{project.categoryTags.map(tag => <li key={tag}>{tag}</li>)}</ul><h2><Link href={`/projects/${project.slug}`}>{project.title}</Link></h2><p>{project.cardSummary}</p><ProjectActions project={project} /></div>
    </article>)}</div>
  </main>;
}
