import Link from "next/link";
import { Arrow } from "@/components/icons";
import { ProjectCarousel } from "@/components/project-carousel";
import { ProjectActions, ProjectShot } from "@/components/project-card";
import { projects } from "@/lib/content";

export function FeaturedWork() {
  const flagship = projects.find((project) => project.featured);
  if (!flagship) throw new Error("Choose a featured project in lib/content.ts");
  const supporting = projects
    .filter((project) => project !== flagship)
    .map(
      ({
        slug,
        title,
        categoryTags,
        cardSummary,
        liveUrl,
        posterUrl,
        sourceUrl,
        image,
        imageAlt,
        visual,
      }) => ({
        slug,
        title,
        categoryTags,
        cardSummary,
        liveUrl,
        posterUrl,
        sourceUrl,
        image,
        imageAlt,
        visual,
      }),
    );
  return (
    <section id="work" className="work-section" aria-labelledby="work-heading">
      <div className="section-heading">
        <h2 id="work-heading">Projects</h2>
        <Link className="all-projects-link" href="/projects">
          See all projects <Arrow />
        </Link>
      </div>
      <article className="featured-card featured-flagship">
        <ProjectShot project={flagship} priority />
        <div className="featured-copy">
          <ul
            className="featured-tags"
            aria-label={`${flagship.title} categories`}
          >
            {flagship.categoryTags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <h3>
            <Link href={`/projects/${flagship.slug}`}>{flagship.title}</Link>
          </h3>
          <p>{flagship.cardSummary}</p>
          <dl className="featured-metrics">
            {[
              { value: flagship.metric, label: flagship.metricLabel },
              ...(flagship.supportingMetrics ?? []),
            ].map(({ value, label }) => (
              <div key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
          <ProjectActions project={flagship} />
        </div>
      </article>
      <ProjectCarousel projects={supporting} />
    </section>
  );
}
