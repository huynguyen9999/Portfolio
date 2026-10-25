import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/icons";
import { ProjectVisual } from "@/components/project-visual";
import type { Project } from "@/lib/content";

type ProjectActionData = Pick<
  Project,
  "slug" | "title" | "liveUrl" | "posterUrl" | "sourceUrl"
>;
type ProjectShotData = Pick<Project, "visual" | "image" | "imageAlt">;

export function ProjectActions({ project }: { project: ProjectActionData }) {
  return (
    <div className="featured-actions">
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Live site: ${project.title}`}
        >
          Live site <Arrow diagonal />
        </a>
      )}
      {project.posterUrl && (
        <a
          href={project.posterUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`View poster: ${project.title}`}
        >
          Poster <Arrow diagonal />
        </a>
      )}
      {!project.liveUrl && !project.posterUrl && project.sourceUrl && (
        <a
          href={project.sourceUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`View on GitHub: ${project.title}`}
        >
          GitHub <Arrow diagonal />
        </a>
      )}
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`Explore project: ${project.title}`}
      >
        Explore project <Arrow />
      </Link>
    </div>
  );
}

export function ProjectShot({
  project,
  priority = false,
}: {
  project: ProjectShotData;
  priority?: boolean;
}) {
  return (
    <div className="featured-shot">
      {project.image ? (
        <Image
          src={project.image}
          alt={project.imageAlt ?? ""}
          fill
          sizes={
            priority
              ? "(max-width: 900px) 100vw, 640px"
              : "(max-width: 700px) 100vw, 340px"
          }
          preload={priority}
        />
      ) : (
        <ProjectVisual kind={project.visual} />
      )}
    </div>
  );
}
