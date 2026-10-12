import Link from "next/link";
import { ProjectCarousel } from "@/components/project-carousel";
import { ProjectActions, ProjectShot } from "@/components/project-card";
import { projects } from "@/lib/content";

function projectBySlug(slug: string) {
  const project = projects.find(item => item.slug === slug);
  if (!project) throw new Error(`Missing project ${slug}`);
  return project;
}

export function FeaturedWork() {
  const flagship = projectBySlug("igauchoback");
  const supporting = projects.filter(project => project.slug !== flagship.slug).map(({ slug, title, categoryTags, cardSummary, liveUrl, posterUrl, image, imageAlt }) => ({ slug, title, categoryTags, cardSummary, liveUrl, posterUrl, image, imageAlt }));
  return <section id="work" className="work-section" aria-labelledby="work-heading">
    <div className="section-heading">
      <h2 id="work-heading">Projects</h2>
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
    <ProjectCarousel projects={supporting} />
  </section>;
}
