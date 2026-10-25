import { resume } from "@/lib/links";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "@/lib/content";
import { ProjectVisual } from "@/components/project-visual";
import { Arrow } from "@/components/icons";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: `${project.title} — Huy Nguyen`,
      description: project.summary,
      images: ["/opengraph-image"],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <main id="main" className="wrap case-study">
      <Link href="/projects" className="back-link">
        <span aria-hidden="true">←</span> All projects
      </Link>
      <header className="case-header">
        <p className="eyebrow">
          Project breakdown <span aria-hidden="true">/</span> {project.category}{" "}
          · {project.year}
        </p>
        <h1>{project.title}</h1>
        <p>
          {project.summaryLink ? (
            <>
              {project.summary.slice(0, project.summary.indexOf(project.summaryLink.text))}
              <a
                className="summary-link"
                href={project.summaryLink.href}
                target="_blank"
                rel="noreferrer"
              >
                {project.summaryLink.text}
              </a>
              {project.summary.slice(project.summary.indexOf(project.summaryLink.text) + project.summaryLink.text.length)}
            </>
          ) : project.summary}
        </p>
        <ul className="tags" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="case-actions">
          {project.liveUrl && (
            <a
              className="button-primary"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              Visit live project <Arrow diagonal />
            </a>
          )}
          {project.posterUrl && (
            <a
              className="button-primary"
              href={project.posterUrl}
              target="_blank"
              rel="noreferrer"
            >
              View project poster <Arrow diagonal />
            </a>
          )}
          {!project.liveUrl && !project.posterUrl && project.sourceUrl && (
            <a
              className="button-primary"
              href={project.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub <Arrow diagonal />
            </a>
          )}
          <a
            className="button-text"
            href={resume.href}
            target="_blank"
            rel="noreferrer"
          >
            View résumé <Arrow diagonal />
          </a>
        </div>
      </header>
      <div className={project.featureShot ? "case-gallery" : undefined}>
        <figure className={project.featureShot ? "case-gallery-item" : undefined}>
          <div className="case-visual">
            {!project.visual && project.image ? (
              <Image
                className="case-screenshot"
                src={project.image}
                alt={project.imageAlt ?? project.title}
                width={project.imageWidth ?? 1440}
                height={project.imageHeight ?? 1000}
                sizes={project.featureShot
                  ? "(max-width: 900px) 100vw, 720px"
                  : "(max-width: 700px) 100vw, 1080px"}
              />
            ) : (
              <ProjectVisual kind={project.visual} />
            )}
          </div>
          {project.featureShot && (
            <figcaption>
              <h2>Explore the app landscape</h2>
              <p>Start with the big picture: discover related apps, then select one to explore the feedback behind it.</p>
            </figcaption>
          )}
        </figure>
        {project.featureShot && (
          <figure className="case-gallery-item">
            <a
              className="case-feature-image"
              href={project.featureShot.image}
              target="_blank"
              rel="noreferrer"
              aria-label={`Enlarge screenshot: ${project.featureShot.title} (opens in a new tab)`}
            >
              <Image
                src={project.featureShot.image}
                alt={project.featureShot.alt}
                width={project.featureShot.width}
                height={project.featureShot.height}
                sizes="(max-width: 900px) 375px, 360px"
              />
            </a>
            <figcaption>
              <h2>{project.featureShot.title}</h2>
              {project.featureShot.caption && <p>{project.featureShot.caption}</p>}
              <a className="inline-link" href={project.featureShot.image} target="_blank" rel="noreferrer">
                View complete panel <Arrow diagonal />
              </a>
            </figcaption>
          </figure>
        )}
      </div>
      <div className="case-body">
        <aside className="case-facts">
          <span className="eyebrow">At a glance</span>
          <p className="case-metric">{project.metric}</p>
          <p>{project.metricLabel}</p>
          {project.supportingMetrics && (
            <dl className="featured-metrics">
              {project.supportingMetrics.map(({ value, label }) => (
                <div key={label}>
                  <dt>{value}</dt>
                  <dd>{label}</dd>
                </div>
              ))}
            </dl>
          )}
          <div>
            <span className="eyebrow">Project highlights</span>
            <ul>
              {project.evidence.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="case-narrative">
          {[
            ["The problem", project.problem],
            ["What I built", project.contribution],
            ["The engineering challenge", project.tradeoff],
            ["The result", project.result],
          ].map(([heading, text]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p>{text}</p>
            </section>
          ))}
          {project.visual === "tuner" && (
            <p className="case-disclosure">
              The interactive illustration above uses a synthesized A4 signal.
              The original project is a Python application that processes live
              microphone audio; this browser demonstration does not run that
              application or measure its accuracy.
            </p>
          )}
        </div>
      </div>
      <div className="next-project">
        <span className="eyebrow">Keep exploring</span>
        <Link href={`/projects/${next.slug}`}>
          {next.title}
          <Arrow />
        </Link>
      </div>
    </main>
  );
}
