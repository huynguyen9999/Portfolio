import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/icons";
import { ProjectVisual } from "@/components/project-visual";
import { projects, type Project } from "@/lib/content";

const SUPPORTING = ["lidar", "guitar-tuner", "orbit"];

function projectBySlug(slug: string) {
  const project = projects.find(item => item.slug === slug);
  if (!project) throw new Error(`Missing project ${slug}`);
  return project;
}

export function ProjectActions({ project, compact = false }: { project: Project; compact?: boolean }) {
  const sourceUrl = compact && (project.liveUrl || project.posterUrl) ? undefined : project.sourceUrl;
  return <div className="featured-actions">
    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Live site: ${project.title}`}>Live site <Arrow diagonal /></a>}
    {project.posterUrl && <a href={project.posterUrl} target="_blank" rel="noreferrer" aria-label={`View poster: ${project.title}`}>Poster <Arrow diagonal /></a>}
    {sourceUrl && <a href={sourceUrl} target="_blank" rel="noreferrer" aria-label={`Source: ${project.title}`}>Source <Arrow diagonal /></a>}
    <Link href={`/projects/${project.slug}`} aria-label={`Explore project: ${project.title}`}>Explore project <Arrow /></Link>
  </div>;
}

export function ProjectShot({ project, priority = false }: { project: Project; priority?: boolean }) {
  return <div className="featured-shot">
    {project.image ? <Image src={project.image} alt={project.imageAlt ?? ""} fill sizes={priority ? "(max-width: 900px) 100vw, 640px" : "(max-width: 700px) 100vw, 340px"} priority={priority} /> : <ProjectVisual slug={project.slug} />}
  </div>;
}

export function FeaturedWork() {
  const flagship = projectBySlug("igauchoback");
  const supporting = SUPPORTING.map(projectBySlug);
  return <section id="work" className="work-section" aria-labelledby="work-heading">
    <div className="section-heading">
      <h2 id="work-heading">Projects</h2>
      <Link className="inline-link" href="/projects">View all projects <Arrow /></Link>
    </div>
    <article className="featured-card featured-flagship">
      <ProjectShot project={flagship} priority />
      <div className="featured-copy">
        <ul className="featured-tags" aria-label={`${flagship.title} categories`}>{flagship.categoryTags.map(tag => <li key={tag}>{tag}</li>)}</ul>
        <h3><Link href={`/projects/${flagship.slug}`}>{flagship.title}</Link></h3>
        <p>{flagship.cardSummary}</p>
        <dl className="featured-metrics"><div><dt>{flagship.metric}</dt><dd>{flagship.metricLabel}</dd></div></dl>
        <ProjectActions project={flagship} />
      </div>
    </article>
    <div className="featured-row">{supporting.map(project => <article className="featured-card" key={project.slug}>
      <ProjectShot project={project} />
      <div className="featured-copy">
        <ul className="featured-tags" aria-label={`${project.title} categories`}>{project.categoryTags.map(tag => <li key={tag}>{tag}</li>)}</ul>
        <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
        <p>{project.cardSummary}</p>
        <ProjectActions project={project} compact />
      </div>
    </article>)}</div>
  </section>;
}
